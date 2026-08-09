// POLISCOP — Intégrité de la provenance des positions candidates.
//
// Le 2e contre-audit relevait que `candidateProvenance.js` était une ÎLE : aucun moteur ne
// l'importait, aucune position approuvée n'existait, et rien ne validait sa structure. Une
// position mal formée — sans source, avec un `stance` hors domaine, en double — aurait pu y
// entrer sans que rien ne la signale.
//
// `candidateMatch.js` consomme désormais `getApprovedPositions()`. Ces tests garantissent
// qu'aucune position non conforme ne peut atteindre un score.

import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  SOURCE_DOCUMENTS, CANDIDATE_POSITIONS, SOURCE_LEVEL, REVIEW_STATUS,
  getApprovedPositions, positionCoverage, getReviewQueue, getSource, FR2027_QUESTION_IDS,
} from '../../src/data/candidateProvenance.js';
import { resolveCandidateId } from '../../src/data/candidateRegistry.js';
import { elections } from '../../src/data/elections.js';
import { computeCandidateMatch } from '../../src/engine/candidateMatch.js';
import { THEMES_ORDER } from '../../src/data/questions.js';

const fr2027 = elections.find(e => e.id === 'fr_2027');
const flat = v => Object.fromEntries(THEMES_ORDER.map(t => [t, v]));

// ─── Documents sources ───────────────────────────────────────────────────────

test('chaque document source a un identifiant unique', () => {
  const ids = SOURCE_DOCUMENTS.map(s => s.id);
  assert.equal(new Set(ids).size, ids.length, 'identifiant de source dupliqué');
});

test('chaque document source a une URL, un éditeur et un niveau connu', () => {
  const levels = new Set(Object.values(SOURCE_LEVEL));
  for (const s of SOURCE_DOCUMENTS) {
    assert.match(s.url ?? '', /^https:\/\//, `${s.id} : URL absente ou non https`);
    assert.ok(s.publisher, `${s.id} : éditeur manquant`);
    assert.ok(levels.has(s.level), `${s.id} : niveau de source inconnu « ${s.level} »`);
    assert.ok(s.discoveredAt, `${s.id} : date de découverte manquante`);
  }
});

test('les dates de source sont au format ISO ou explicitement nulles', () => {
  const iso = /^\d{4}-\d{2}-\d{2}$/;
  for (const s of SOURCE_DOCUMENTS) {
    for (const field of ['publishedAt', 'eventAt', 'discoveredAt', 'verifiedAt']) {
      const v = s[field];
      assert.ok(v === null || (typeof v === 'string' && iso.test(v)),
        `${s.id}.${field} = « ${v} » : attendu AAAA-MM-JJ ou null`);
    }
  }
});

// ─── Positions ───────────────────────────────────────────────────────────────

test('unicité de (candidateId, questionId, validFrom)', () => {
  const seen = new Set();
  for (const p of CANDIDATE_POSITIONS) {
    const key = `${p.candidateId}|${p.questionId}|${p.validFrom ?? 'null'}`;
    assert.ok(!seen.has(key), `position dupliquée : ${key}`);
    seen.add(key);
  }
});

test('chaque position référence un candidat du registre canonique', () => {
  for (const p of CANDIDATE_POSITIONS) {
    assert.equal(resolveCandidateId(p.candidateId), p.candidateId,
      `${p.candidateId} n'est pas un identifiant canonique du registre`);
  }
});

test('chaque sourceId d’une position existe réellement', () => {
  for (const p of CANDIDATE_POSITIONS) {
    for (const id of p.sourceIds ?? []) {
      assert.ok(getSource(id), `${p.candidateId}/${p.questionId} référence une source inconnue : ${id}`);
    }
  }
});

test('stance appartient à {-2,-1,0,+1,+2} ou vaut null — jamais 3 ni une chaîne', () => {
  for (const p of CANDIDATE_POSITIONS) {
    assert.ok(
      p.stance === null || [-2, -1, 0, 1, 2].includes(p.stance),
      `${p.candidateId}/${p.questionId} : stance « ${p.stance} » hors domaine. ` +
      `« Inconnu » se code null, jamais 0 ni une valeur Likert.`,
    );
  }
});

test('le statut de revue est une valeur connue', () => {
  const statuses = new Set(Object.values(REVIEW_STATUS));
  for (const p of CANDIDATE_POSITIONS) {
    assert.ok(statuses.has(p.reviewStatus),
      `${p.candidateId}/${p.questionId} : statut inconnu « ${p.reviewStatus} »`);
  }
});

test('une position APPROUVÉE a obligatoirement stance, source et relecteur', () => {
  for (const p of CANDIDATE_POSITIONS.filter(x => x.reviewStatus === REVIEW_STATUS.APPROVED)) {
    assert.notEqual(p.stance, null, `${p.candidateId}/${p.questionId} approuvée sans stance`);
    assert.ok((p.sourceIds ?? []).length > 0, `${p.candidateId}/${p.questionId} approuvée sans source`);
    assert.ok(p.reviewedBy, `${p.candidateId}/${p.questionId} approuvée sans relecteur`);
    assert.notEqual(p.reviewedBy, p.codedBy,
      `${p.candidateId}/${p.questionId} : le codeur ne peut pas être son propre relecteur indépendant`);
  }
});

test('une position en relecture est complète mais ne se prétend pas déjà validée', () => {
  for (const p of CANDIDATE_POSITIONS.filter(x => x.reviewStatus === REVIEW_STATUS.PENDING_REVIEW)) {
    assert.notEqual(p.stance, null, `${p.candidateId}/${p.questionId} en relecture sans stance`);
    assert.ok(p.sourceIds?.length, `${p.candidateId}/${p.questionId} en relecture sans source`);
    assert.ok(p.excerpt, `${p.candidateId}/${p.questionId} en relecture sans extrait`);
    assert.ok(p.reasoning, `${p.candidateId}/${p.questionId} en relecture sans raisonnement`);
    assert.ok(p.codedBy, `${p.candidateId}/${p.questionId} en relecture sans codeur`);
    assert.ok(p.validFrom, `${p.candidateId}/${p.questionId} en relecture sans date de validité`);
    assert.equal(p.reviewedBy, null, `${p.candidateId}/${p.questionId} porte déjà un relecteur sans être approuvée`);
    assert.ok(p.excerpt.trim().split(/\s+/).length <= 25,
      `${p.candidateId}/${p.questionId} : extrait de plus de 25 mots`);
  }
});

test('une supersession référence une position réellement existante', () => {
  const keys = new Set(CANDIDATE_POSITIONS.map(p => `${p.candidateId}|${p.questionId}|${p.validFrom ?? 'null'}`));
  for (const p of CANDIDATE_POSITIONS.filter(x => x.supersedesId)) {
    assert.ok(keys.has(p.supersedesId),
      `${p.candidateId}/${p.questionId} remplace une position inexistante : ${p.supersedesId}`);
  }
});

// ─── Effet réel sur le moteur ────────────────────────────────────────────────

test('getApprovedPositions ne renvoie que du publiable', () => {
  for (const person of new Set(CANDIDATE_POSITIONS.map(p => p.candidateId))) {
    for (const p of getApprovedPositions(person)) {
      assert.equal(p.reviewStatus, REVIEW_STATUS.APPROVED);
      assert.notEqual(p.stance, null);
      assert.ok(p.sourceIds.length > 0);
    }
  }
});

test('zéro position approuvée ⇒ AUCUN score public (et non un repli legacy)', () => {
  // Le test précédent affirmait « le repli legacy s'applique donc partout » : il verrouillait
  // exactement l'inverse de l'exigence produit. Le repli a été supprimé du moteur public.
  const approved = CANDIDATE_POSITIONS.filter(p => p.reviewStatus === REVIEW_STATUS.APPROVED);
  assert.equal(approved.length, 0,
    `${approved.length} position(s) approuvée(s) : mettre à jour docs/data/candidate-provenance.md ` +
    `et le rapport, qui affirment qu'aucune n'est encore sourcée.`);

  const m = computeCandidateMatch({
    userThemes: flat(50),
    candidate: fr2027.candidates[0],
    priorityOrder: [...THEMES_ORDER],
    electionAnswers: Object.fromEntries(fr2027.specificQuestions.map(q => [q.id, 3])),
    questions: fr2027.specificQuestions,
  });
  assert.equal(m.score, null, 'un score a été produit sans aucune preuve sourcée');
  assert.equal(m.reason, 'no_sourced_positions');
  assert.equal(m.coverage.sourcedPositions, 0);
  assert.equal(m.coverage.positionProvenance, 'sourced-positions',
    'la seule provenance possible pour un score est désormais « sourced-positions »');
});

test('onze positions de David Lisnard sont codées mais restent exclues sans relecture indépendante', () => {
  const cov = positionCoverage('david-lisnard');
  assert.equal(cov.approved, 0);
  assert.equal(cov.total, FR2027_QUESTION_IDS.length);
  assert.equal(cov.ratio, 0);

  const positions = CANDIDATE_POSITIONS.filter(position => position.candidateId === 'david-lisnard');
  const pending = positions.filter(position => position.reviewStatus === REVIEW_STATUS.PENDING_REVIEW);
  const unknown = positions.filter(position => position.reviewStatus === REVIEW_STATUS.TO_REVIEW);
  assert.equal(pending.length, 11);
  assert.equal(unknown.length, 6);

  for (const position of pending) {
    assert.notEqual(position.stance, null);
    assert.ok(position.excerpt);
    assert.ok(position.reasoning);
    assert.ok(position.codedBy);
    assert.equal(position.reviewedBy, null, 'le premier passage ne doit pas se prétendre indépendant');
    assert.ok(position.sourceIds.every(sourceId => [
      SOURCE_LEVEL.PRIMARY_OFFICIAL,
      SOURCE_LEVEL.PRIMARY_DIRECT,
    ].includes(getSource(sourceId)?.level)));
  }

  // Les 17 entrées restent dans la file : onze à relire, six encore à instruire.
  const queue = getReviewQueue().filter(x => x.candidateId === 'david-lisnard');
  assert.equal(queue.length, FR2027_QUESTION_IDS.length,
    'aucune question ne doit disparaître avant validation ou rejet explicite');
});

test('six positions 2027 de Gabriel Attal sont codées sans présenter ses chantiers comme un programme final', () => {
  const positions = CANDIDATE_POSITIONS.filter(position => position.candidateId === 'gabriel-attal');
  const pending = positions.filter(position => position.reviewStatus === REVIEW_STATUS.PENDING_REVIEW);
  const unknown = positions.filter(position => position.reviewStatus === REVIEW_STATUS.TO_REVIEW);

  assert.equal(positions.length, FR2027_QUESTION_IDS.length);
  assert.equal(pending.length, 6);
  assert.equal(unknown.length, 11);
  assert.equal(positionCoverage('gabriel-attal').approved, 0);

  for (const position of pending) {
    assert.notEqual(position.stance, null);
    assert.ok(position.excerpt);
    assert.ok(position.reasoning);
    assert.equal(position.reviewedBy, null);
    assert.ok(position.sourceIds.every(sourceId => getSource(sourceId)?.level === SOURCE_LEVEL.PRIMARY_OFFICIAL));
  }
});

test('six positions actuelles de Fabien Roussel sont codées sans recycler son programme 2022', () => {
  const positions = CANDIDATE_POSITIONS.filter(position => position.candidateId === 'fabien-roussel');
  const pending = positions.filter(position => position.reviewStatus === REVIEW_STATUS.PENDING_REVIEW);
  const unknown = positions.filter(position => position.reviewStatus === REVIEW_STATUS.TO_REVIEW);

  assert.equal(positions.length, FR2027_QUESTION_IDS.length);
  assert.equal(pending.length, 6);
  assert.equal(unknown.length, 11);
  assert.equal(positionCoverage('fabien-roussel').approved, 0);
  assert.ok(pending.every(position => position.sourceIds.every(sourceId =>
    getSource(sourceId)?.level === SOURCE_LEVEL.PRIMARY_OFFICIAL)));
  assert.ok(pending.every(position => position.sourceIds.every(sourceId =>
    !getSource(sourceId)?.url.includes('fabienroussel2022'))));
});

test('les identifiants de questions de la provenance existent dans fr_2027', () => {
  const known = new Set(fr2027.specificQuestions.map(q => q.id));
  for (const p of CANDIDATE_POSITIONS) {
    if (!p.questionId.startsWith('fr_2027')) continue;
    assert.ok(known.has(p.questionId), `question inconnue dans la provenance : ${p.questionId}`);
  }
});
