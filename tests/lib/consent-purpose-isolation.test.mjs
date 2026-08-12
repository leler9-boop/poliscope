// POLISCOP — Aucune ligne de consentement politique ne doit porter d'identifiant de compte.
//
// DÉFAUT CORRIGÉ (P0-B2)
// ----------------------
// `buildConsentRecords()` estampillait CHAQUE enregistrement avec `anonymous_session_id` ET
// `user_id`, quelle que soit la finalité. Une ligne `political_analytics` contenait donc en
// même temps le pseudonyme politique et l'identifiant de compte : exactement la table de
// correspondance que le texte de consentement promet de ne pas créer.
//
// Le texte affirme « vos réponses ne sont reliées à aucun compte » et « jamais dans ce flux :
// aucun identifiant de compte ». Ces tests transforment ces deux phrases en propriétés du
// code, observées sur les PAYLOADS RÉELLEMENT ÉMIS.

import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  PURPOSES, ALL_PURPOSES, emptyConsentState, currentDecision,
  buildConsentRecords, identifiersFor, PURPOSE_IDENTIFIER,
} from '../../src/lib/consent.js';

const IDS = {
  anonymousSessionId: 'sid-politique',
  userId: 'compte-42',
  measurementId: 'sid-mesure',
  researchId: 'sid-recherche',
};

/** État de consentement avec les finalités demandées décidées. */
function etat(decisions) {
  const s = { ...emptyConsentState() };
  for (const [purpose, granted] of Object.entries(decisions)) {
    s[purpose] = currentDecision(granted, { purpose, language: 'fr' });
  }
  return s;
}

const emis = (decisions, ids = IDS) => buildConsentRecords(etat(decisions), ids);
const ligne = (records, purpose) => records.find(r => r.purpose === purpose);

// ─── La garantie centrale, sur les cinq combinaisons demandées ──────────────

const CAS = [
  ['visiteur sans compte', { [PURPOSES.POLITICAL_ANALYTICS]: true }, { ...IDS, userId: null }],
  ['utilisateur connecté', { [PURPOSES.POLITICAL_ANALYTICS]: true, [PURPOSES.CLOUD_SAVE]: true }, IDS],
  ['sauvegarde acceptée, analyse refusée', { [PURPOSES.CLOUD_SAVE]: true, [PURPOSES.POLITICAL_ANALYTICS]: false }, IDS],
  ['analyse acceptée, sauvegarde refusée', { [PURPOSES.POLITICAL_ANALYTICS]: true, [PURPOSES.CLOUD_SAVE]: false }, IDS],
  ['les deux acceptées', { [PURPOSES.POLITICAL_ANALYTICS]: true, [PURPOSES.CLOUD_SAVE]: true, [PURPOSES.MEASUREMENT]: true, [PURPOSES.RESEARCH]: true }, IDS],
];

for (const [nom, decisions, ids] of CAS) {
  test(`aucun payload political_analytics ne contient user_id — ${nom}`, () => {
    const records = emis(decisions, ids);
    for (const r of records.filter(x => x.purpose === PURPOSES.POLITICAL_ANALYTICS)) {
      assert.equal(r.user_id, null,
        'cette ligne relie le pseudonyme politique au compte : c’est la correspondance que '
        + 'le texte promet de ne pas créer');
    }
  });
}

test('aucune ligne, quelle que soit la finalité, ne porte les DEUX identifiants', () => {
  for (const [, decisions, ids] of CAS) {
    for (const r of emis(decisions, ids)) {
      const deux = r.anonymous_session_id != null && r.user_id != null;
      assert.equal(deux, false, `${r.purpose} porte les deux identifiants`);
    }
  }
});

// ─── Cloisonnement finalité par finalité ────────────────────────────────────

test('la sauvegarde liée au compte ne porte JAMAIS le pseudonyme d’analyse', () => {
  const r = ligne(emis({ [PURPOSES.CLOUD_SAVE]: true }), PURPOSES.CLOUD_SAVE);
  assert.equal(r.user_id, 'compte-42');
  assert.equal(r.anonymous_session_id, null,
    'y placer le pseudonyme politique recréerait le lien par l’autre bout');
});

test('la mesure d’audience utilise son PROPRE pseudonyme', () => {
  const r = ligne(emis({ [PURPOSES.MEASUREMENT]: true }), PURPOSES.MEASUREMENT);
  assert.equal(r.anonymous_session_id, 'sid-mesure');
  assert.notEqual(r.anonymous_session_id, IDS.anonymousSessionId,
    'partager l’identifiant relierait le parcours de navigation aux opinions');
  assert.equal(r.user_id, null);
});

test('la recherche exige un identifiant EXPLICITE, rien n’est déduit', () => {
  const avec = ligne(emis({ [PURPOSES.RESEARCH]: true }), PURPOSES.RESEARCH);
  assert.equal(avec.anonymous_session_id, 'sid-recherche');

  const sans = ligne(
    buildConsentRecords(etat({ [PURPOSES.RESEARCH]: true }), { ...IDS, researchId: null }),
    PURPOSES.RESEARCH,
  );
  assert.equal(sans.anonymous_session_id, null,
    'emprunter le pseudonyme d’analyse ferait entrer les opinions dans un autre traitement');
});

test('chaque finalité déclare explicitement quel identifiant elle porte', () => {
  for (const purpose of ALL_PURPOSES) {
    assert.ok(PURPOSE_IDENTIFIER[purpose], `${purpose} n’a pas de portée d’identifiant déclarée`);
  }
});

test('identifiersFor ne rend jamais deux identifiants à la fois', () => {
  for (const purpose of ALL_PURPOSES) {
    const { anonymous_session_id: a, user_id: u } = identifiersFor(purpose, IDS);
    assert.equal(a != null && u != null, false, `${purpose} en porte deux`);
  }
});

// ─── Le retrait garde le pseudonyme nécessaire à la suppression ─────────────

test('un retrait politique conserve le pseudonyme — sans lui, rien à supprimer', () => {
  const r = ligne(emis({ [PURPOSES.POLITICAL_ANALYTICS]: false }), PURPOSES.POLITICAL_ANALYTICS);
  assert.equal(r.granted, false);
  assert.equal(r.anonymous_session_id, 'sid-politique');
  assert.equal(r.user_id, null);
  assert.equal(r.retention_until, null, 'un refus n’ouvre aucune durée de conservation');
});
