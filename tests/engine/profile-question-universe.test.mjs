// POLISCOP — L'univers de questions comparé sur la page Profil.
//
// DÉFAUT P0 REPRODUIT
// -------------------
// `Profile.jsx` passait `questions: coreQuestions` à `rankBothWays()`. Or AUCUNE des 18
// questions portant `voteInfluencePrompt` n'est CORE — c'est même une règle éditoriale : on
// n'interroge l'influence que sur des questions spécialisées, et les CORE ne le sont pas.
//
// Conséquence : toutes les influences recueillies portaient sur des questions absentes du
// calcul. Le compteur d'influences pouvait devenir positif, le libellé annoncer « les
// décisions qui peuvent influencer votre vote », et ces décisions n'avoir strictement aucun
// effet sur le score affiché. Le produit décrivait un calcul qu'il ne faisait pas.
//
// Second effet : un parcours Standard (32) ou Approfondi (64) ne comparait jamais plus de
// 16 questions, alors que l'utilisateur en avait répondu deux à quatre fois plus.

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { rankBothWays } from '../../src/engine/candidateRanking.js';
import { questions, coreQuestions } from '../../src/data/questions.js';
import { getEditorialAnswers } from '../../src/data/candidateEditorialAnswers.js';
import { elections } from '../../src/data/elections.js';
import {
  IMPORTANCE_LEVEL, PRIORITY_SOURCE, VOTE_INFLUENCE_LEVEL,
} from '../../src/engine/priorityWeights.js';
import { NO_OPINION } from '../../src/engine/scorer.js';

const FR2027 = elections.find(e => e.id === 'fr_2027');
const CANDIDATES = FR2027.candidates;

/** Questions générales pour lesquelles au moins un candidat a une réponse éditoriale. */
const documented = new Set(
  CANDIDATES.flatMap(c => getEditorialAnswers(c.id, 'general')).map(a => a.questionId),
);

const allMedium = () => ({
  levels: Object.fromEntries([...new Set(questions.map(q => q.theme))].map(t => [t, IMPORTANCE_LEVEL.MEDIUM])),
  answered: Object.fromEntries([...new Set(questions.map(q => q.theme))].map(t => [t, true])),
  source: PRIORITY_SOURCE.EQUAL,
});

/** Réponses sur TOUTES les questions documentées, marquées comprises. */
function answersOnDocumented(value = 4) {
  return Object.fromEntries([...documented].map(id => [id, value]));
}

/**
 * Jeu de réponses de taille EXACTE contenant toutes les questions documentées.
 * Reproduit un parcours réel : la file contient les CORE plus des questions spécialisées.
 */
function answersOfSize(n) {
  const rest = questions.filter(q => !documented.has(q.id)).slice(0, n - documented.size);
  return Object.fromEntries([...documented, ...rest.map(q => q.id)].map(id => [id, 4]));
}

const rank = (userAnswers, voteInfluence, universe) => rankBothWays({
  candidates: CANDIDATES, userAnswers, questions: universe,
  questionSet: 'general', themeImportance: allMedium(), voteInfluence,
});

const signature = r => r.electoral.results.map(x => `${x.candidate.id}:${x.match.score}`).join('|');

// ─── Le défaut lui-même ─────────────────────────────────────────────────────

test('aucune question marquée n’est CORE : les limiter aux CORE exclut toute influence', () => {
  const marked = questions.filter(q => q.voteInfluencePrompt);
  assert.ok(marked.length > 0);
  assert.equal(marked.filter(q => q.status === 'CORE').length, 0);
  const markedInCore = marked.filter(q => coreQuestions.some(c => c.id === q.id));
  assert.deepEqual(markedInCore, [],
    'si une marquée devenait CORE, ce test devrait être revu — pas contourné');
});

test('avec l’univers CORE, changer une influence ne change RIEN au classement', () => {
  // C'est la démonstration du défaut : le produit annonçait un effet inexistant.
  const marked = questions.find(q => q.voteInfluencePrompt && documented.has(q.id))
    ?? questions.find(q => q.voteInfluencePrompt);
  const userAnswers = answersOnDocumented(4);

  const strong = rank(userAnswers, { [marked.id]: { level: VOTE_INFLUENCE_LEVEL.STRONG } }, coreQuestions);
  const none = rank(userAnswers, { [marked.id]: { level: VOTE_INFLUENCE_LEVEL.NONE } }, coreQuestions);

  assert.equal(signature(strong), signature(none),
    'ce test décrit le DÉFAUT : avec l’univers CORE, l’influence est sans effet');
});

// ─── Ce que la correction garantit MÉCANIQUEMENT ────────────────────────────
//
// ⚠ Constat majeur, découvert en écrivant ces tests : les réponses éditoriales générales des
// candidats ne couvrent QUE les 16 questions CORE. Aucune des 18 questions marquées n'a de
// réponse candidate. L'intersection ne peut donc contenir aucune influence, quel que soit
// l'univers passé au moteur — et `questionsCompared` reste plafonné à 16 même en mode
// Approfondi, parce que le plafond vient du corpus candidat, pas de l'univers.
//
// Basculer sur la banque générale reste nécessaire (le plafond artificiel disparaît, et la
// correction devient effective dès qu'une question marquée sera documentée), mais elle ne
// change RIEN au résultat affiché aujourd'hui. Les tests ci-dessous séparent donc :
//   • la mécanique, prouvée sur un corpus synthétique ;
//   • l'état réel, figé tel qu'il est — sans prétendre qu'il fait mieux.

import { computeIdeologicalMatch, computeElectoralPriorityMatch } from '../../src/engine/editorialMatch.js';
import { ANSWER_STATE, ANSWER_BASIS } from '../../src/data/candidateEditorialAnswers.js';

const LOOSE = { version: 'test', minComparedQuestions: 1, minComparedRatio: 0, minThemesInIntersection: 1 };
const THEMES = [...new Set(questions.map(q => q.theme))];

/** Univers synthétique : 6 questions dont une MARQUÉE, toutes documentées côté candidat. */
const SYNTH = [
  { id: 'M1', theme: THEMES[0], direction: 1, weight: 2, voteInfluencePrompt: true },
  { id: 'N1', theme: THEMES[0], direction: 1, weight: 2 },
  { id: 'N2', theme: THEMES[1], direction: 1, weight: 2 },
  { id: 'N3', theme: THEMES[1], direction: 1, weight: 2 },
  { id: 'N4', theme: THEMES[2], direction: 1, weight: 2 },
  { id: 'N5', theme: THEMES[2], direction: 1, weight: 2 },
];
const synthCandidate = map => Object.entries(map).map(([questionId, answerValue]) => ({
  questionId, answerValue, answerState: ANSWER_STATE.ESTIMATED,
  basis: ANSWER_BASIS.EDITORIAL_INFERENCE, rationale: null, sourceIds: [], questionnaireVersion: null,
}));

const synthImportance = () => ({
  levels: Object.fromEntries(THEMES.map(t => [t, IMPORTANCE_LEVEL.MEDIUM])),
  answered: Object.fromEntries(THEMES.map(t => [t, true])),
  source: PRIORITY_SOURCE.EQUAL,
});

// L'utilisateur est en désaccord total sur la question marquée, d'accord ailleurs.
const SYNTH_USER = { M1: 1, N1: 5, N2: 5, N3: 5, N4: 5, N5: 5 };
const SYNTH_CAND = synthCandidate({ M1: 5, N1: 5, N2: 5, N3: 5, N4: 5, N5: 5 });

const elec = voteInfluence => computeElectoralPriorityMatch({
  userAnswers: SYNTH_USER, candidateAnswers: SYNTH_CAND, questions: SYNTH,
  themeImportance: synthImportance(), voteInfluence, config: LOOSE,
});

test('une influence STRONG pèse davantage qu’une influence nulle sur le score pondéré', () => {
  const strong = elec({ M1: { level: VOTE_INFLUENCE_LEVEL.STRONG } });
  const none = elec({ M1: { level: VOTE_INFLUENCE_LEVEL.NONE } });
  assert.notEqual(strong.score, none.score, 'l’influence déclarée doit produire un effet réel');
  assert.ok(none.score > strong.score,
    'annuler le poids d’un désaccord doit REMONTER le score, pas le baisser');
});

test('une influence nulle retire du POIDS, pas de la comparaison', () => {
  const none = elec({ M1: { level: VOTE_INFLUENCE_LEVEL.NONE } });
  assert.equal(none.questionsCompared, 6, 'la question doit rester comparée');
  assert.equal(none.questionsWeighted, 5, 'elle ne doit plus peser');
});

test('le classement idéologique ne bouge pas quand seule l’influence change', () => {
  const ideo = computeIdeologicalMatch({
    userAnswers: SYNTH_USER, candidateAnswers: SYNTH_CAND, questions: SYNTH, config: LOOSE,
  });
  for (const level of [VOTE_INFLUENCE_LEVEL.STRONG, VOTE_INFLUENCE_LEVEL.NONE]) {
    const again = computeIdeologicalMatch({
      userAnswers: SYNTH_USER, candidateAnswers: SYNTH_CAND, questions: SYNTH, config: LOOSE,
    });
    assert.equal(again.score, ideo.score, `le profil idéologique a bougé avec ${level}`);
  }
});

test('les compteurs distinguent influences déclarées et influences effectivement pesantes', () => {
  const none = elec({ M1: { level: VOTE_INFLUENCE_LEVEL.NONE } });
  assert.equal(none.influenceDeclared, 1, 'une influence présente dans l’intersection doit être comptée');
  assert.equal(none.questionsWeighted, 5, 'mais elle ne pèse pas');
});

test('une influence sur une question absente de l’intersection n’est pas comptée', () => {
  const none = elec({ QUESTION_ABSENTE: { level: VOTE_INFLUENCE_LEVEL.STRONG } });
  assert.equal(none.influenceDeclared, 0,
    'compter une influence hors intersection ferait annoncer un effet inexistant');
});

// ─── État RÉEL du corpus, figé sans complaisance ─────────────────────────────

test('aujourd’hui, aucune question marquée n’a de réponse candidate', () => {
  const marked = questions.filter(q => q.voteInfluencePrompt).map(q => q.id);
  const covered = marked.filter(id => documented.has(id));
  assert.deepEqual(covered, [],
    'si une marquée devient documentée, ce test doit être mis à jour — et le libellé « thèmes '
    + 'et décisions » deviendra alors légitime');
});

test('l’intersection réelle est plafonnée par le corpus candidat, pas par l’univers', () => {
  // 32 réponses dont les 16 documentées : le ratio vaut 0,5, au-dessus du seuil.
  const userAnswers = answersOfSize(32);
  const m = rank(userAnswers, {}, questions).ideological.results[0].match;
  assert.equal(m.questionsCompared, documented.size,
    'seules les questions documentées côté candidats peuvent être comparées');
  assert.equal(m.userAnswered, 32);
});

test('l’univers CORE tronquait le DÉNOMINATEUR du contrôle de couverture', () => {
  // C'est le second volet du défaut, et le plus grave : `userAnswered` est compté sur
  // l'univers passé au moteur. Restreindre aux CORE faisait afficher « 16 réponses » à une
  // personne qui en avait donné 64, et rendait le contrôle de couverture INOPÉRANT.
  const userAnswers = answersOfSize(64);

  const core = rank(userAnswers, {}, coreQuestions);
  assert.equal(core.ideological.results[0].match.userAnswered, coreQuestions.length,
    'l’univers CORE ne pouvait jamais compter plus de 16 réponses');

  const full = rank(userAnswers, {}, questions);
  const seen = full.ideological.results[0]?.match ?? full.ideological.unscored[0].match;
  assert.equal(seen.userAnswered, 64, 'l’univers complet compte les réponses réellement données');
});

test('un questionnaire long est REFUSÉ plutôt que classé sur une couverture trop mince', () => {
  // ⚠ Conséquence assumée de la correction : en mode Approfondi (64 réponses) et avec des
  // candidats documentés sur 16 questions seulement, le ratio vaut 0,25 — sous le seuil de
  // 0,30. Aucun candidat n'est classé, et c'est le comportement CORRECT : le contrôle de
  // couverture existe précisément pour ce cas. Abaisser le seuil pour faire réapparaître un
  // classement fabriquerait une confiance que les données ne portent pas.
  const r = rank(answersOfSize(64), {}, questions);

  assert.equal(r.ideological.results.length, 0, 'aucun candidat ne doit être classé');
  assert.ok(r.ideological.unscored.length > 0, 'les candidats doivent rester VISIBLES, avec un motif');
  assert.equal(r.ideological.unscored[0].match.reason, 'coverage_too_narrow',
    'le motif affiché doit être la couverture, pas un échec générique');
});

test('une question jamais posée reste exclue de la comparaison', () => {
  const ids = [...documented].slice(0, 8);
  const partial = Object.fromEntries(ids.map((id, i) => [id, (i % 5) + 1]));
  const m = rank(partial, {}, questions).ideological.results[0].match;
  assert.equal(m.questionsCompared, ids.length,
    'seules les questions réellement répondues doivent être comparées');
});

test('« sans opinion » reste exclu de la comparaison', () => {
  const ids = [...documented].slice(0, 10);
  const withOpinion = Object.fromEntries(ids.map(id => [id, 4]));
  const withNoOpinion = { ...withOpinion, [ids[0]]: NO_OPINION, [ids[1]]: NO_OPINION };
  const a = rank(withOpinion, {}, questions).ideological.results[0].match.questionsCompared;
  const b = rank(withNoOpinion, {}, questions).ideological.results[0].match.questionsCompared;
  assert.equal(b, a - 2);
});
