// POLISCOP — Contrat de sélection de voie et granularité de provenance.
//
// CE QUE CES TESTS AURAIENT ATTRAPÉ
// ---------------------------------
// 1. `rankCandidatesForSurface()` calculait la voie stricte puis la retournait « dès qu'elle
//    produisait au moins un résultat ». Le jour où UN candidat aurait franchi le seuil strict,
//    les neuf autres auraient disparu de Profil et de la page Élection — sans erreur, sans
//    message, sans qu'aucun test ne bouge. Le classement public se serait réduit à une
//    personne.
//
// 2. La provenance était déclarée par LIGNE de question, donc héritée par les dix candidats :
//    285 réponses sur 330 portaient `official-programme`, `parliamentary-record` ou
//    `direct-current` sans le moindre raisonnement individuel et avec `sourceIds` vide.
//
// 3. Les réponses spécifiques d'une élection n'étaient pas transmises au moteur strict : la
//    page Élection aurait classé exactement comme la page Profil, en ignorant les 17 réponses
//    que l'utilisateur venait de donner.

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { rankCandidatesForSurface, MATCH_MODE, MODE_PROVENANCE } from '../../src/engine/candidateRanking.js';
import { SCORE_PROVENANCE } from '../../src/engine/editorialMatch.js';
import { EDITORIAL_ANSWERS, ANSWER_BASIS } from '../../src/data/candidateEditorialAnswers.js';
import { computeCandidateMatch } from '../../src/engine/candidateMatch.js';
import { elections } from '../../src/data/elections.js';
import { questions as allQuestions, THEMES_ORDER } from '../../src/data/questions.js';
import { resolveCandidateId } from '../../src/data/candidateRegistry.js';
import { REVIEW_STATUS } from '../../src/data/candidateProvenance.js';

const FR2027 = elections.find(e => e.id === 'fr_2027');
const CORE = allQuestions.filter(q => q.status === 'CORE');
const userThemes = Object.fromEntries(THEMES_ORDER.map((t, i) => [t, 30 + i * 5]));
const userAnswers = Object.fromEntries(CORE.map((q, i) => [q.id, (i % 5) + 1]));

/** Corpus strict complet et approuvé, bâti sur les vraies questions. Contenu neutre. */
const fullStrictCorpus = FR2027.specificQuestions.map(q => ({
  candidateId: resolveCandidateId('attal'), questionId: q.id, stance: 1,
  sourceIds: ['fixture'], excerpt: 'extrait', reasoning: 'raisonnement',
  evidenceType: 'programme', confidence: 1, reviewStatus: REVIEW_STATUS.APPROVED,
  codedBy: 'fixture', reviewedBy: 'fixture', validFrom: '2026-01-01', supersedesId: null,
}));

// ─── 1. Granularité de provenance ───────────────────────────────────────────

const STRONG = new Set(Object.values(ANSWER_BASIS)
  .filter(b => b !== ANSWER_BASIS.EDITORIAL_INFERENCE && b !== ANSWER_BASIS.UNKNOWN));

test('une provenance forte exige toujours un raisonnement individuel et une source', () => {
  const offenders = EDITORIAL_ANSWERS
    .filter(a => STRONG.has(a.basis) && (!a.rationale || a.sourceIds.length === 0))
    .map(a => `${a.electionCandidateId}/${a.questionId} (${a.basis})`);
  assert.deepEqual(offenders.slice(0, 10), [],
    `${offenders.length} réponses portent une base forte sans justification et source propres`);
});

test('aucune question ne distribue une provenance forte à ses dix candidats par héritage', () => {
  const byQuestion = new Map();
  for (const a of EDITORIAL_ANSWERS) {
    if (!byQuestion.has(a.questionId)) byQuestion.set(a.questionId, []);
    byQuestion.get(a.questionId).push(a);
  }
  for (const [questionId, answers] of byQuestion) {
    const strong = answers.filter(a => STRONG.has(a.basis));
    const documented = answers.filter(a => a.rationale);
    // Une base FAIBLE accompagnée d'un raisonnement reste licite ; l'inverse jamais.
    assert.ok(
      strong.length <= documented.length,
      `${questionId} : ${strong.length} bases fortes pour ${documented.length} raisonnements — héritage de ligne`,
    );
  }
});

test('aucune source n’est inventée', () => {
  for (const a of EDITORIAL_ANSWERS) {
    assert.ok(Array.isArray(a.sourceIds), `${a.questionId} : sourceIds absent`);
    // Aucune source n'est enregistrée à ce jour. En fabriquer une donnerait une preuve fausse.
    assert.equal(a.sourceIds.length, 0, `${a.questionId} : source inventée`);
  }
});

test('l’immense majorité des réponses est honnêtement étiquetée déduction éditoriale', () => {
  const inference = EDITORIAL_ANSWERS.filter(a => a.basis === ANSWER_BASIS.EDITORIAL_INFERENCE).length;
  assert.ok(inference > EDITORIAL_ANSWERS.length * 0.5,
    `seulement ${inference}/${EDITORIAL_ANSWERS.length} en déduction éditoriale : provenance surévaluée`);
});

// ─── 2. Contrat de voie : aucune bascule automatique ────────────────────────

test('le mode éditorial garde TOUS les candidats, même si la voie stricte pourrait scorer', () => {
  // `approvedPositions` rendrait la voie stricte productive. Le mode éditorial doit l'ignorer
  // complètement : c'est exactement le scénario qui faisait disparaître neuf candidats.
  const r = rankCandidatesForSurface({
    candidates: FR2027.candidates,
    mode: MATCH_MODE.EDITORIAL,
    userThemes,
    userAnswers,
    questions: CORE,
    questionSet: 'general',
    approvedPositions: fullStrictCorpus,
  });
  assert.equal(r.mode, MATCH_MODE.EDITORIAL);
  assert.equal(r.results.length, 10, 'des candidats ont disparu du classement éditorial');
  assert.equal(r.dataSource, MODE_PROVENANCE[MATCH_MODE.EDITORIAL]);
});

test('aucun résultat éditorial ne peut porter la provenance « vérifié »', () => {
  const r = rankCandidatesForSurface({
    candidates: FR2027.candidates, mode: MATCH_MODE.EDITORIAL,
    userThemes, userAnswers, questions: CORE, questionSet: 'general',
  });
  assert.notEqual(r.provenance, SCORE_PROVENANCE.VERIFIED);
  for (const { match } of r.results) {
    assert.equal(match.provenance, SCORE_PROVENANCE.EDITORIAL);
    assert.equal(match.verifiedPositionsUsed, 0);
  }
});

test('le mode strict n’emprunte jamais la voie éditoriale et garde les autres visibles', () => {
  const r = rankCandidatesForSurface({
    candidates: FR2027.candidates,
    mode: MATCH_MODE.STRICT,
    userThemes,
    questions: FR2027.specificQuestions,
    questionSet: 'fr_2027',
  });
  assert.equal(r.mode, MATCH_MODE.STRICT);
  assert.equal(r.dataSource, MODE_PROVENANCE[MATCH_MODE.STRICT]);
  // Aucun corpus approuvé aujourd'hui : zéro score, mais les dix restent visibles.
  assert.equal(r.results.length, 0);
  assert.equal(r.unscored.length, 10, 'des candidats non admissibles ont été escamotés');
  for (const { match } of r.unscored) assert.ok(match.reason, 'un motif est requis');
});

test('le mode est une décision de l’appelant, jamais une conséquence des données', () => {
  const editorial = rankCandidatesForSurface({
    candidates: FR2027.candidates, mode: MATCH_MODE.EDITORIAL,
    userThemes, userAnswers, questions: CORE, questionSet: 'general',
  });
  const strict = rankCandidatesForSurface({
    candidates: FR2027.candidates, mode: MATCH_MODE.STRICT,
    userThemes, questions: CORE, questionSet: 'general',
  });
  assert.notEqual(editorial.mode, strict.mode, 'le mode demandé n’est pas respecté');
});

test('un mode absent ou inconnu échoue fermé au lieu de publier une estimation implicite', () => {
  assert.throws(
    () => rankCandidatesForSurface({ candidates: FR2027.candidates }),
    /Mode de matching invalide ou absent/,
  );
  assert.throws(
    () => rankCandidatesForSurface({ candidates: FR2027.candidates, mode: 'automatique' }),
    /Mode de matching invalide ou absent/,
  );
});

// ─── 3. Les réponses électorales atteignent le moteur strict ───────────────

test('les réponses spécifiques 2027 modifient réellement le résultat strict', () => {
  const candidate = FR2027.candidates.find(c => c.id === 'attal');
  const common = {
    userThemes, candidate, questions: FR2027.specificQuestions,
    approvedPositions: fullStrictCorpus, sourceIsVerified: () => true,
  };
  const sansReponses = computeCandidateMatch({ ...common, electionAnswers: {} });
  // Réponses volontairement opposées aux positions du corpus (stance 1 → likert haut).
  const opposees = Object.fromEntries(FR2027.specificQuestions.map(q => [q.id, 1]));
  const avecReponses = computeCandidateMatch({ ...common, electionAnswers: opposees });

  assert.notEqual(sansReponses.score, null, 'le fixture strict doit produire un score');
  assert.notEqual(avecReponses.score, null);
  assert.notEqual(
    sansReponses.score, avecReponses.score,
    'les réponses électorales sont ignorées par le moteur strict',
  );
  assert.ok(avecReponses.coverage.answeredSpecific > 0);
});

test('rankCandidatesForSurface transmet electionAnswers en mode strict', () => {
  const base = {
    candidates: [FR2027.candidates.find(c => c.id === 'attal')],
    mode: MATCH_MODE.STRICT, userThemes,
    questions: FR2027.specificQuestions, questionSet: 'fr_2027',
    approvedPositions: fullStrictCorpus, sourceIsVerified: () => true,
  };
  const sans = rankCandidatesForSurface({ ...base, electionAnswers: {} });
  const avec = rankCandidatesForSurface({
    ...base,
    electionAnswers: Object.fromEntries(FR2027.specificQuestions.map(q => [q.id, 1])),
  });
  const scoreSans = sans.results[0]?.match?.score ?? null;
  const scoreAvec = avec.results[0]?.match?.score ?? null;
  assert.notEqual(scoreSans, null, 'le fixture strict doit produire un score');
  assert.notEqual(scoreSans, scoreAvec,
    'electionAnswers n’atteint pas le moteur strict à travers rankCandidatesForSurface');
});
