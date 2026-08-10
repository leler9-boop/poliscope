// POLISCOP — Signalements de questions.
//
// Le défaut corrigé : `handleReportSubmit` affichait « signalement pris en compte » sans
// aucun appel réseau. Le test central de ce fichier est donc « aucun faux succès » — il
// échouerait si quelqu'un remettait un `setReportSent(true)` inconditionnel.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  submitQuestionReport, buildReportPayload, flushReportOutbox,
  pendingReportCount, clearReportOutbox, REPORT_STATUS,
} from '../../src/lib/questionReports.js';

// `localStorage` n'existe pas sous Node : on l'installe pour que la file locale soit
// réellement exercée, et non silencieusement contournée par le try/catch du module.
function installLocalStorage() {
  const map = new Map();
  globalThis.localStorage = {
    getItem: k => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => map.set(k, String(v)),
    removeItem: k => map.delete(k),
    clear: () => map.clear(),
  };
  return () => { delete globalThis.localStorage; };
}

const baseInput = {
  questionId: 'ECO_1',
  questionnaireVersion: '2026.08-128q',
  category: 'biased',
  language: 'fr',
  originScreen: 'questionnaire',
};

// ─── Construction du payload ─────────────────────────────────────────────────

test('le payload porte la catégorie de base, pas un index de bouton', () => {
  const payload = buildReportPayload({ ...baseInput, category: 'fact_error' });
  assert.equal(payload.category, 'fact_error');
  assert.equal(payload.question_id, 'ECO_1');
  assert.equal(payload.questionnaire_version, '2026.08-128q');
});

test('une catégorie inconnue est refusée à la construction', () => {
  assert.throws(() => buildReportPayload({ ...baseInput, category: 'pas_claire' }), /catégorie/);
});

test('un écran d’origine hors liste retombe sur « other » — jamais une URL', () => {
  const payload = buildReportPayload({ ...baseInput, originScreen: 'https://poliscop.fr/quiz?t=1' });
  assert.equal(payload.origin_screen, 'other');
});

test('les champs optionnels absents ne sont pas envoyés à null', () => {
  const payload = buildReportPayload(baseInput);
  assert.equal('attempt_id' in payload, false);
  assert.equal('user_id' in payload, false);
  assert.equal('comment' in payload, false);
});

test('le commentaire est borné à 1000 caractères', () => {
  const payload = buildReportPayload({ ...baseInput, comment: 'x'.repeat(4000) });
  assert.equal(payload.comment.length, 1000);
});

// ─── Le cœur : aucun faux succès ─────────────────────────────────────────────

test('« envoyé » N’EST retourné qu’après une réponse serveur POSITIVE', async () => {
  const restore = installLocalStorage();
  try {
    const calls = [];
    const result = await submitQuestionReport(baseInput, {
      enabled: true,
      isOnline: () => true,
      post: async (type, payload) => { calls.push({ type, payload }); return { ok: true }; },
    });

    assert.equal(result.status, REPORT_STATUS.SENT);
    assert.equal(calls.length, 1, 'aucun appel réseau n’a été effectué');
    assert.equal(calls[0].type, 'report');
    assert.equal(calls[0].payload.category, 'biased');
    assert.equal(pendingReportCount(), 0);
  } finally { restore(); }
});

test('une réponse serveur AMBIGUË ne vaut pas succès', async () => {
  const restore = installLocalStorage();
  try {
    const result = await submitQuestionReport(baseInput, {
      enabled: true,
      isOnline: () => true,
      post: async () => ({ ok: false }),          // ni erreur, ni confirmation
    });

    assert.notEqual(result.status, REPORT_STATUS.SENT,
      'un succès a été annoncé sans confirmation du serveur');
    assert.equal(result.status, REPORT_STATUS.QUEUED);
    assert.equal(pendingReportCount(), 1, 'le signalement a été perdu');
  } finally { restore(); }
});

test('HORS LIGNE : conservé localement, et surtout PAS annoncé comme reçu', async () => {
  const restore = installLocalStorage();
  try {
    let posted = false;
    const result = await submitQuestionReport(baseInput, {
      enabled: true,
      isOnline: () => false,
      post: async () => { posted = true; return { ok: true }; },
    });

    assert.equal(result.status, REPORT_STATUS.QUEUED);
    assert.equal(result.reason, 'offline');
    assert.equal(posted, false, 'un envoi a été tenté hors ligne');
    assert.equal(pendingReportCount(), 1, 'le signalement n’a pas été conservé');
  } finally { restore(); }
});

test('panne réseau : conservé et rejoué au retour de la connexion', async () => {
  const restore = installLocalStorage();
  try {
    const error = new Error('réseau'); error.code = 'network'; error.retryable = true;
    const first = await submitQuestionReport(baseInput, {
      enabled: true, isOnline: () => true,
      post: async () => { throw error; },
    });
    assert.equal(first.status, REPORT_STATUS.QUEUED);
    assert.equal(pendingReportCount(), 1);

    const sentPayloads = [];
    const flushed = await flushReportOutbox({
      enabled: true, isOnline: () => true,
      post: async (type, payload) => { sentPayloads.push(payload); return { ok: true }; },
    });

    assert.equal(flushed.sent, 1);
    assert.equal(flushed.remaining, 0);
    assert.equal(sentPayloads[0].category, 'biased');
    assert.equal(pendingReportCount(), 0);
  } finally { restore(); }
});

test('un refus DÉFINITIF n’est pas rejoué indéfiniment', async () => {
  const restore = installLocalStorage();
  try {
    const error = new Error('payload invalide');
    error.code = 'invalid_payload';
    error.retryable = false;

    const result = await submitQuestionReport(baseInput, {
      enabled: true, isOnline: () => true,
      post: async () => { throw error; },
    });

    assert.equal(result.status, REPORT_STATUS.FAILED);
    assert.equal(pendingReportCount(), 0,
      'un signalement définitivement refusé encombre la file locale');
  } finally { restore(); }
});

test('sans backend configuré, le signalement est conservé et jamais annoncé reçu', async () => {
  const restore = installLocalStorage();
  try {
    const result = await submitQuestionReport(baseInput, { enabled: false });
    assert.equal(result.status, REPORT_STATUS.QUEUED);
    assert.equal(result.reason, 'ingest_disabled');
    assert.equal(pendingReportCount(), 1);
  } finally { restore(); }
});

test('clearReportOutbox vide la file — « effacer mes données »', async () => {
  const restore = installLocalStorage();
  try {
    await submitQuestionReport(baseInput, { enabled: false });
    assert.equal(pendingReportCount(), 1);
    clearReportOutbox();
    assert.equal(pendingReportCount(), 0);
  } finally { restore(); }
});

test('un signalement ne transporte AUCUNE réponse au questionnaire', async () => {
  const restore = installLocalStorage();
  try {
    const calls = [];
    await submitQuestionReport(
      { ...baseInput, comment: 'Question orientée' },
      { enabled: true, isOnline: () => true,
        post: async (type, payload) => { calls.push(payload); return { ok: true }; } },
    );

    const payload = calls[0];
    for (const forbidden of ['answer_value', 'response_state', 'theme', 'profile', 'answers']) {
      assert.equal(forbidden in payload, false,
        `un signalement transporte « ${forbidden} » — c’est une opinion, pas un retour éditorial`);
    }
  } finally { restore(); }
});
