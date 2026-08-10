// POLISCOP — Trois données distinctes : opinion, importance du thème, influence sur le vote.
//
// LE PRINCIPE QUE CES TESTS PROTÈGENT
// -----------------------------------
// « Ce sujet ne changera pas mon vote » n'est NI « sans opinion », NI une réponse neutre, NI
// une question ignorée. La réponse politique reste intégralement dans le profil idéologique ;
// seul son poids dans le matching électoral change.
//
// Confondre les deux serait la régression la plus grave possible ici : effacer une opinion
// parce qu'elle n'est pas décisive appauvrit le profil sans que personne ne l'ait demandé, et
// le rend faux — la personne A BIEN une opinion, elle a juste dit qu'elle ne votera pas
// là-dessus.

import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  IMPORTANCE_LEVEL, IMPORTANCE_MULTIPLIER, PRIORITY_SOURCE,
  VOTE_INFLUENCE_LEVEL, VOTE_INFLUENCE_MULTIPLIER, DEFAULT_VOTE_INFLUENCE,
  MAX_EFFECTIVE_WEIGHT_RATIO, PRIORITY_CONTRACT_VERSION,
  equalImportance, importanceFromRanking, normalizeThemeImportance,
  themeMultiplier, voteInfluenceMultiplier,
  computeEffectiveQuestionWeight, balanceWeightsAcrossThemes,
} from '../../src/engine/priorityWeights.js';
import {
  computeIdeologicalMatch, computeElectoralPriorityMatch,
} from '../../src/engine/editorialMatch.js';
import { THEMES_ORDER } from '../../src/data/questions.js';
import { NO_OPINION } from '../../src/engine/scorer.js';
import { ANSWER_STATE, ANSWER_BASIS } from '../../src/data/candidateEditorialAnswers.js';

// ─── Fixtures synthétiques : deux thèmes, poids éditoriaux égaux ────────────

const Q = [
  { id: 'A1', theme: THEMES_ORDER[0], direction: 1, weight: 2 },
  { id: 'A2', theme: THEMES_ORDER[0], direction: 1, weight: 2 },
  { id: 'B1', theme: THEMES_ORDER[1], direction: 1, weight: 2 },
  { id: 'B2', theme: THEMES_ORDER[1], direction: 1, weight: 2 },
];

const candidateAnswers = (map) => Object.entries(map).map(([questionId, answerValue]) => ({
  questionId, answerValue,
  answerState: answerValue == null ? ANSWER_STATE.UNKNOWN : ANSWER_STATE.ESTIMATED,
  basis: answerValue == null ? ANSWER_BASIS.UNKNOWN : ANSWER_BASIS.EDITORIAL_INFERENCE,
  rationale: null, sourceIds: [], questionnaireVersion: null,
}));

const importanceOf = (levels) => ({ levels, source: PRIORITY_SOURCE.INDEPENDENT });

/**
 * Seuils permissifs : ces fixtures testent l'ARITHMÉTIQUE de pondération, pas les seuils de
 * couverture — ceux-ci ont leurs propres tests dans editorial-matching.test.mjs. Sans cela,
 * un fixture à 4 questions et 2 thèmes serait rejeté avant tout calcul.
 */
const LOOSE = { version: 'test-loose', minComparedQuestions: 1, minComparedRatio: 0, minThemesInIntersection: 1 };
const allMedium = () => importanceOf(Object.fromEntries(THEMES_ORDER.map(t => [t, IMPORTANCE_LEVEL.MEDIUM])));

// ─── Le contrat lui-même ────────────────────────────────────────────────────

test('les cinq niveaux d’importance portent les multiplicateurs convenus', () => {
  assert.equal(IMPORTANCE_MULTIPLIER[IMPORTANCE_LEVEL.NOT], 0);
  assert.equal(IMPORTANCE_MULTIPLIER[IMPORTANCE_LEVEL.LOW], 0.5);
  assert.equal(IMPORTANCE_MULTIPLIER[IMPORTANCE_LEVEL.MEDIUM], 1);
  assert.equal(IMPORTANCE_MULTIPLIER[IMPORTANCE_LEVEL.HIGH], 1.25);
  assert.equal(IMPORTANCE_MULTIPLIER[IMPORTANCE_LEVEL.VERY_HIGH], 1.5);
});

test('les quatre niveaux d’influence sur le vote portent les multiplicateurs convenus', () => {
  assert.equal(VOTE_INFLUENCE_MULTIPLIER[VOTE_INFLUENCE_LEVEL.NONE], 0);
  assert.equal(VOTE_INFLUENCE_MULTIPLIER[VOTE_INFLUENCE_LEVEL.UNLIKELY], 0.5);
  assert.equal(VOTE_INFLUENCE_MULTIPLIER[VOTE_INFLUENCE_LEVEL.LIKELY], 1);
  assert.equal(VOTE_INFLUENCE_MULTIPLIER[VOTE_INFLUENCE_LEVEL.STRONG], 1.5);
});

test('une question jamais interrogée garde un poids neutre, ni nul ni gonflé', () => {
  assert.equal(voteInfluenceMultiplier({}, 'A1'), VOTE_INFLUENCE_MULTIPLIER[DEFAULT_VOTE_INFLUENCE]);
  assert.equal(voteInfluenceMultiplier(undefined, 'A1'), 1);
});

// ─── Les trois facteurs, et le plafond ──────────────────────────────────────

test('le poids effectif respecte les trois facteurs', () => {
  const w = computeEffectiveQuestionWeight({
    themeFactor: 1.5, influenceFactor: 0.5, editorialWeight: 2, baselineWeight: 2,
  });
  assert.equal(w, 1.5 * 0.5 * 2);
});

test('le plafond empêche une question de peser plus du double d’une question normale', () => {
  const w = computeEffectiveQuestionWeight({
    themeFactor: 1.5, influenceFactor: 1.5, editorialWeight: 10, baselineWeight: 2,
  });
  assert.equal(w, MAX_EFFECTIVE_WEIGHT_RATIO * 2, 'le plafond n’est pas appliqué');
  assert.ok(w < 1.5 * 1.5 * 10);
});

test('aucun poids effectif n’est NaN, infini ou négatif', () => {
  for (const args of [
    { themeFactor: 0, influenceFactor: 1, editorialWeight: 2 },
    { themeFactor: NaN, influenceFactor: 1, editorialWeight: 2 },
    { themeFactor: 1, influenceFactor: Infinity, editorialWeight: 2 },
    { themeFactor: -1, influenceFactor: 1, editorialWeight: 2 },
    {},
  ]) {
    const w = computeEffectiveQuestionWeight(args);
    assert.ok(Number.isFinite(w) && w >= 0, `poids invalide : ${w} pour ${JSON.stringify(args)}`);
  }
});

test('un thème riche en questions ne domine pas mécaniquement', () => {
  // Thème A : 6 questions. Thème B : 1 question. Même importance déclarée.
  const entries = [
    ...Array.from({ length: 6 }, (_, i) => ({ id: `a${i}`, theme: 'A', ownWeight: 2, themeFactor: 1 })),
    { id: 'b0', theme: 'B', ownWeight: 2, themeFactor: 1 },
  ];
  const balanced = balanceWeightsAcrossThemes(entries);
  const massA = balanced.filter(e => e.theme === 'A').reduce((s, e) => s + e.weight, 0);
  const massB = balanced.filter(e => e.theme === 'B').reduce((s, e) => s + e.weight, 0);
  assert.ok(Math.abs(massA - massB) < 1e-9,
    `le thème à 6 questions pèse ${massA} contre ${massB} — domination mécanique`);
});

test('l’importance déclarée n’est PAS effacée par le rééquilibrage entre thèmes', () => {
  const entries = [
    { id: 'a', theme: 'A', ownWeight: 2, themeFactor: 1.5 },
    { id: 'b', theme: 'B', ownWeight: 2, themeFactor: 0.5 },
  ];
  const balanced = balanceWeightsAcrossThemes(entries);
  const massA = balanced.find(e => e.id === 'a').weight;
  const massB = balanced.find(e => e.id === 'b').weight;
  assert.ok(massA > massB, 'égaliser les thèmes effacerait la priorité déclarée');
  assert.equal(massA / massB, 3);
});

// ─── Conversion et compatibilité ────────────────────────────────────────────

test('« tous les sujets comptent autant » donne une importance moyenne partout', () => {
  const eq = equalImportance();
  assert.equal(eq.source, PRIORITY_SOURCE.EQUAL);
  for (const t of THEMES_ORDER) assert.equal(eq.levels[t], IMPORTANCE_LEVEL.MEDIUM);
});

test('un classement précis se convertit vers le MÊME contrat de pondération', () => {
  const order = [...THEMES_ORDER].reverse();
  const conv = importanceFromRanking(order);
  assert.equal(conv.source, PRIORITY_SOURCE.RANKING);
  assert.equal(conv.levels[order[0]], IMPORTANCE_LEVEL.VERY_HIGH);
  assert.equal(conv.levels[order[7]], IMPORTANCE_LEVEL.LOW);
  for (const t of THEMES_ORDER) assert.ok(conv.levels[t], `${t} sans niveau`);
});

test('un ancien profil sans importance reste lisible et sans surprise', () => {
  // L'ordre par défaut du store est l'ordre de DÉCLARATION : personne ne l'a choisi.
  // Le convertir en « très important » pour les deux premiers thèmes serait inventer un choix.
  const legacy = normalizeThemeImportance({ priorityOrder: [...THEMES_ORDER] });
  assert.equal(legacy.source, PRIORITY_SOURCE.EQUAL);
  for (const t of THEMES_ORDER) assert.equal(legacy.levels[t], IMPORTANCE_LEVEL.MEDIUM);

  // Un ordre RÉELLEMENT réorganisé est bien converti.
  const reordered = normalizeThemeImportance({ priorityOrder: [...THEMES_ORDER].reverse() });
  assert.equal(reordered.source, PRIORITY_SOURCE.RANKING);
});

test('un état vide ne casse rien', () => {
  const empty = normalizeThemeImportance({});
  for (const t of THEMES_ORDER) assert.ok(empty.levels[t]);
  assert.equal(themeMultiplier(empty, THEMES_ORDER[0]), 1);
});

// ─── LE point central : influence nulle ≠ opinion effacée ───────────────────

test('une influence nulle laisse la réponse politique dans le profil idéologique', () => {
  const user = { A1: 5, A2: 5, B1: 1, B2: 1 };
  const cand = candidateAnswers({ A1: 5, A2: 5, B1: 5, B2: 5 });
  const influence = { B1: { level: VOTE_INFLUENCE_LEVEL.NONE }, B2: { level: VOTE_INFLUENCE_LEVEL.NONE } };

  const ideological = computeIdeologicalMatch({ userAnswers: user, candidateAnswers: cand, questions: Q, config: LOOSE });
  const electoral = computeElectoralPriorityMatch({
    userAnswers: user, candidateAnswers: cand, questions: Q, config: LOOSE,
    themeImportance: allMedium(), voteInfluence: influence,
  });

  // Le profil idéologique compare TOUT : 4 questions, dont les deux désaccords.
  assert.equal(ideological.questionsCompared, 4,
    'une influence nulle a retiré la réponse du profil idéologique');
  // Le matching électoral ignore les deux questions sans influence → accord parfait.
  assert.equal(electoral.questionsCompared, 4, 'les questions doivent rester comptées');
  assert.equal(electoral.questionsWeighted, 2, 'les questions à influence nulle doivent peser 0');
  assert.ok(electoral.score > ideological.score,
    `le score pondéré (${electoral.score}) devrait dépasser l’idéologique (${ideological.score})`);
});

test('« sans opinion » reste distinct de « pas important pour mon vote »', () => {
  const cand = candidateAnswers({ A1: 5, A2: 5, B1: 5, B2: 5 });

  const sansOpinion = computeIdeologicalMatch({
    userAnswers: { A1: 5, A2: 5, B1: NO_OPINION, B2: NO_OPINION },
    candidateAnswers: cand, questions: Q, config: LOOSE,
  });
  const pasImportant = computeIdeologicalMatch({
    userAnswers: { A1: 5, A2: 5, B1: 1, B2: 1 },
    candidateAnswers: cand, questions: Q, config: LOOSE,
  });

  assert.equal(sansOpinion.questionsCompared, 2, '« sans opinion » doit sortir de la comparaison');
  assert.equal(pasImportant.questionsCompared, 4, 'une opinion réelle doit rester comparée');
  assert.notEqual(sansOpinion.score, pasImportant.score);
});

test('une question jamais répondue reste distincte des deux autres cas', () => {
  const cand = candidateAnswers({ A1: 5, A2: 5, B1: 5, B2: 5 });
  const jamais = computeIdeologicalMatch({
    userAnswers: { A1: 5, A2: 5 }, candidateAnswers: cand, questions: Q, config: LOOSE,
  });
  assert.equal(jamais.questionsCompared, 2);
  assert.equal(jamais.userAnswered, 2, 'une question non posée ne doit pas compter comme répondue');
});

// ─── Les deux classements ───────────────────────────────────────────────────

test('avec des poids identiques, le pondéré converge vers le non pondéré', () => {
  const user = { A1: 5, A2: 2, B1: 4, B2: 1 };
  const cand = candidateAnswers({ A1: 4, A2: 3, B1: 5, B2: 2 });
  const ideological = computeIdeologicalMatch({ userAnswers: user, candidateAnswers: cand, questions: Q, config: LOOSE });
  const electoral = computeElectoralPriorityMatch({
    userAnswers: user, candidateAnswers: cand, questions: Q, config: LOOSE,
    themeImportance: allMedium(), voteInfluence: {},
  });
  assert.equal(electoral.score, ideological.score,
    'à pondération uniforme, les deux méthodes doivent coïncider');
});

test('les deux classements peuvent désigner des candidats différents', () => {
  const user = { A1: 5, A2: 5, B1: 5, B2: 5 };
  // X ressemble globalement plus ; Y est meilleur sur le thème qui compte pour le vote.
  const X = candidateAnswers({ A1: 1, A2: 1, B1: 5, B2: 5 });
  const Y = candidateAnswers({ A1: 5, A2: 5, B1: 1, B2: 1 });
  const importance = importanceOf({
    ...allMedium().levels,
    [THEMES_ORDER[0]]: IMPORTANCE_LEVEL.VERY_HIGH,
    [THEMES_ORDER[1]]: IMPORTANCE_LEVEL.NOT,
  });
  const idX = computeIdeologicalMatch({ userAnswers: user, candidateAnswers: X, questions: Q }).score;
  const idY = computeIdeologicalMatch({ userAnswers: user, candidateAnswers: Y, questions: Q }).score;
  const elX = computeElectoralPriorityMatch({ userAnswers: user, candidateAnswers: X, questions: Q, themeImportance: importance, config: LOOSE }).score;
  const elY = computeElectoralPriorityMatch({ userAnswers: user, candidateAnswers: Y, questions: Q, themeImportance: importance, config: LOOSE }).score;

  assert.equal(idX, idY, 'les deux candidats doivent être à égalité idéologique dans ce fixture');
  assert.ok(elY > elX, 'le pondéré doit préférer le candidat proche sur le thème qui compte');
});

// ─── Robustesse ─────────────────────────────────────────────────────────────

test('tous les thèmes à « pas important » ne produit pas de score inventé', () => {
  const none = importanceOf(Object.fromEntries(THEMES_ORDER.map(t => [t, IMPORTANCE_LEVEL.NOT])));
  const r = computeElectoralPriorityMatch({
    userAnswers: { A1: 5, A2: 5, B1: 5, B2: 5 },
    candidateAnswers: candidateAnswers({ A1: 5, A2: 5, B1: 5, B2: 5 }),
    questions: Q, themeImportance: none, config: LOOSE,
  });
  assert.equal(r.score, null, 'un score a été produit sans aucun poids');
  assert.equal(r.reason, 'no_weighted_questions');
});

test('aucun résultat pondéré ne produit NaN, Infinity ou un score hors bornes', () => {
  const cas = [
    { userAnswers: {}, candidateAnswers: [], questions: Q },
    { userAnswers: { A1: 5 }, candidateAnswers: candidateAnswers({ A1: null }), questions: Q },
    { userAnswers: { A1: 5, A2: 1, B1: 3, B2: 4 }, candidateAnswers: candidateAnswers({ A1: 1, A2: 5, B1: 2, B2: 5 }), questions: Q },
  ];
  for (const c of cas) {
    const r = computeElectoralPriorityMatch({ ...c, themeImportance: allMedium(), config: LOOSE });
    if (r.score !== null) {
      assert.ok(Number.isFinite(r.score), `score non fini : ${r.score}`);
      assert.ok(r.score >= 0 && r.score <= 100, `score hors bornes : ${r.score}`);
    }
  }
});

test('le résultat pondéré transporte sa couverture et sa version de contrat', () => {
  const r = computeElectoralPriorityMatch({
    userAnswers: { A1: 5, A2: 4, B1: 2, B2: 1 },
    candidateAnswers: candidateAnswers({ A1: 5, A2: 4, B1: 2, B2: 1 }),
    questions: Q, themeImportance: allMedium(), config: LOOSE,
  });
  assert.equal(r.priorityContractVersion, PRIORITY_CONTRACT_VERSION);
  assert.ok(r.questionsWeighted > 0);
  assert.ok(Array.isArray(r.themesCovered));
  assert.equal(r.scoreType, 'electoral-priority-weighted');
});

test('les estimations candidates conservent leur provenance dans les deux classements', () => {
  const cand = candidateAnswers({ A1: 5, A2: 4, B1: 2, B2: 1 });
  for (const r of [
    computeIdeologicalMatch({ userAnswers: { A1: 5, A2: 4, B1: 2, B2: 1 }, candidateAnswers: cand, questions: Q, config: LOOSE }),
    computeElectoralPriorityMatch({ userAnswers: { A1: 5, A2: 4, B1: 2, B2: 1 }, candidateAnswers: cand, questions: Q, themeImportance: allMedium(), config: LOOSE }),
  ]) {
    assert.equal(r.provenance, 'editorial_estimate');
    assert.equal(r.verifiedPositionsUsed, 0);
  }
});
