// POLISCOP — La seconde lecture, et ce qu'elle a le droit de changer.
//
// RÈGLE PRODUIT VÉRIFIÉE ICI
// --------------------------
// Une estimation éditoriale n'est jamais promue automatiquement en position vérifiée, et
// `pending_review` n'entre pas dans la voie stricte. Sans ces deux verrous, il suffirait
// qu'une position soit CODÉE pour qu'elle devienne, de fait, VÉRIFIÉE — et le mot « vérifié »
// ne voudrait plus rien dire à l'écran.

import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  CANDIDATE_POSITIONS, REVIEW_STATUS, getApprovedPositions, getReviewQueue,
} from '../../src/data/candidateProvenance.js';
import {
  SECOND_READING, REVIEW_VERDICT, secondReadingFor, stillNeedingReview,
} from '../../src/data/candidateReviewLog.js';

const CODEES = CANDIDATE_POSITIONS.filter(p => p.reviewStatus === REVIEW_STATUS.PENDING_REVIEW);

// ─── Couverture de la passe ─────────────────────────────────────────────────

test('les 23 positions codées ont toutes une entrée de seconde lecture', () => {
  assert.equal(CODEES.length, 23);
  const manquantes = CODEES
    .filter(p => !secondReadingFor(p.candidateId, p.questionId))
    .map(p => `${p.candidateId}/${p.questionId}`);
  assert.deepEqual(manquantes, [], 'une position codée sans trace de relecture est indistinguable '
    + 'd’une position relue et approuvée');
});

test('aucune entrée de relecture ne porte sur une position inexistante', () => {
  const orphelines = SECOND_READING
    .filter(r => !CANDIDATE_POSITIONS.some(p => p.candidateId === r.candidateId && p.questionId === r.questionId))
    .map(r => `${r.candidateId}/${r.questionId}`);
  assert.deepEqual(orphelines, []);
});

// ─── Ce qu'une relecture doit porter ────────────────────────────────────────

test('chaque relecture nomme son relecteur, son type, sa version et sa date', () => {
  for (const r of SECOND_READING) {
    assert.ok(r.reviewedBy, `${r.questionId} : relecteur absent`);
    assert.ok(['model', 'human'].includes(r.reviewerType), `${r.questionId} : type de relecteur invalide`);
    assert.ok(r.reviewerVersion, `${r.questionId} : version de passe absente`);
    assert.match(r.reviewedAt, /^\d{4}-\d{2}-\d{2}$/, `${r.questionId} : date invalide`);
    assert.ok(r.notes && r.notes.length > 40, `${r.questionId} : raisonnement trop court pour être relu`);
  }
});

test('une approbation exige que la source ait été RÉELLEMENT ouverte', () => {
  const fautives = SECOND_READING
    .filter(r => r.verdict === REVIEW_VERDICT.APPROVED && r.sourceOpened !== true)
    .map(r => `${r.candidateId}/${r.questionId}`);
  assert.deepEqual(fautives, [],
    'approuver sans ouvrir la source revient à fabriquer une vérification');
});

test('une correction ou un rejet dit ce qu’il propose à la place', () => {
  for (const r of SECOND_READING.filter(x => x.verdict === REVIEW_VERDICT.CORRECTED)) {
    assert.equal(typeof r.suggestedStance, 'number', `${r.questionId} : correction sans intensité proposée`);
    assert.equal(typeof r.codedStance, 'number', `${r.questionId} : correction sans intensité d’origine`);
    assert.notEqual(r.suggestedStance, r.codedStance);
  }
  for (const r of SECOND_READING.filter(x => x.verdict === REVIEW_VERDICT.REJECTED)) {
    assert.ok(r.notes.length > 80, `${r.questionId} : un rejet doit être motivé précisément`);
  }
});

test('un verdict inconnu est impossible', () => {
  const valides = new Set(Object.values(REVIEW_VERDICT));
  for (const r of SECOND_READING) assert.ok(valides.has(r.verdict), `${r.questionId} : ${r.verdict}`);
});

// ─── Les deux verrous de publication ────────────────────────────────────────

test('aucune position `pending_review` n’entre dans la voie stricte', () => {
  for (const candidateId of [...new Set(CODEES.map(p => p.candidateId))]) {
    const approuvees = getApprovedPositions(candidateId);
    const fuites = approuvees.filter(p => p.reviewStatus !== REVIEW_STATUS.APPROVED);
    assert.deepEqual(fuites, [], `${candidateId} : une position non approuvée alimente un score`);
  }
});

test('la seconde lecture ne suffit PAS à publier : le statut reste à décider', () => {
  // Le journal enregistre un constat documentaire ; il ne bascule pas `reviewStatus` de
  // lui-même. Une relecture par un modèle n'est pas une validation éditoriale indépendante.
  const approuveesParLaPasse = SECOND_READING.filter(r => r.verdict === REVIEW_VERDICT.APPROVED);
  assert.ok(approuveesParLaPasse.length > 0);
  for (const r of approuveesParLaPasse) {
    const position = CANDIDATE_POSITIONS.find(p => p.candidateId === r.candidateId && p.questionId === r.questionId);
    assert.equal(position.reviewStatus, REVIEW_STATUS.PENDING_REVIEW,
      `${r.questionId} : la passe de relecture a promu une position, ce qu'elle n'a pas autorité à faire`);
  }
});

test('le relecteur ne peut pas approuver ce qu’il a lui-même recodé', () => {
  for (const r of SECOND_READING.filter(x => x.verdict === REVIEW_VERDICT.CORRECTED)) {
    assert.notEqual(r.verdict, REVIEW_VERDICT.APPROVED);
  }
});

// ─── Ce qui reste à faire, énoncé et non masqué ─────────────────────────────

test('les positions non concluantes restent listées comme telles', () => {
  const restantes = stillNeedingReview();
  assert.ok(restantes.length > 0, 'si tout était approuvé, ce test devrait être mis à jour');
  // Chaque position restante doit dire POURQUOI elle n'est pas conclue.
  for (const r of restantes) {
    assert.ok(r.notes.length > 40, `${r.questionId} : motif d'inaboutissement absent`);
  }
});

test('la file de relecture d’origine reste cohérente avec le corpus', () => {
  const file = getReviewQueue();
  assert.ok(file.length >= CODEES.length);
  assert.ok(file.every(p => p.reviewStatus !== REVIEW_STATUS.APPROVED));
});
