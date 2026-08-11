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
// Second effet, distinct : `userAnswered` est compté SUR L'UNIVERS passé au moteur. Tronquer
// l'univers tronquait le dénominateur du contrôle de couverture, qui ne pouvait donc plus se
// déclencher. Une personne ayant répondu à 64 questions était classée sur 16 avec un ratio
// affiché de 1,0.
//
// ⚠ HISTORIQUE DE CE FICHIER. Écrit sur une branche où le corpus candidat ne contenait que
// les 16 réponses CORE, il figeait cet état appauvri : « aucune question marquée n'a de
// réponse candidate », « un questionnaire long est refusé ». Ces affirmations étaient vraies
// là-bas et sont FAUSSES ici : `origin/main` apporte 128 réponses pour 11 candidats. Elles
// ont été remplacées par les invariants réels, et non desserrées.

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { rankBothWays } from '../../src/engine/candidateRanking.js';
import { questions, coreQuestions, THEMES_ORDER } from '../../src/data/questions.js';
import {
  getEditorialAnswers, ANSWER_STATE, ANSWER_BASIS,
} from '../../src/data/candidateEditorialAnswers.js';
import { elections } from '../../src/data/elections.js';
import {
  computeIdeologicalMatch, computeElectoralPriorityMatch, EDITORIAL_MATCH_CONFIG,
} from '../../src/engine/editorialMatch.js';
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
  levels: Object.fromEntries(THEMES_ORDER.map(t => [t, IMPORTANCE_LEVEL.MEDIUM])),
  answered: Object.fromEntries(THEMES_ORDER.map(t => [t, true])),
  source: PRIORITY_SOURCE.EQUAL,
});

/** Jeu de réponses de taille EXACTE, pris parmi les questions documentées. */
function answersOfSize(n, value = 4) {
  return Object.fromEntries([...documented].slice(0, n).map(id => [id, value]));
}

const rank = (userAnswers, voteInfluence, universe) => rankBothWays({
  candidates: CANDIDATES, userAnswers, questions: universe,
  questionSet: 'general', themeImportance: allMedium(), voteInfluence,
});

const signature = r => r.electoral.results.map(x => `${x.candidate.id}:${x.match.score}`).join('|');

// ─── Le défaut lui-même : toujours vrai, et c'est pourquoi la correction compte ──

test('aucune question marquée n’est CORE : les limiter aux CORE exclut toute influence', () => {
  const marked = questions.filter(q => q.voteInfluencePrompt);
  assert.ok(marked.length > 0);
  assert.equal(marked.filter(q => q.status === 'CORE').length, 0);
  const markedInCore = marked.filter(q => coreQuestions.some(c => c.id === q.id));
  assert.deepEqual(markedInCore, [],
    'si une marquée devenait CORE, ce test devrait être revu — pas contourné');
});

test('avec l’univers CORE, changer une influence ne change RIEN au classement', () => {
  // Démonstration du défaut : le produit annonçait un effet inexistant.
  const marked = questions.find(q => q.voteInfluencePrompt && documented.has(q.id));
  const userAnswers = answersOfSize(64);

  const strong = rank(userAnswers, { [marked.id]: { level: VOTE_INFLUENCE_LEVEL.STRONG } }, coreQuestions);
  const none = rank(userAnswers, { [marked.id]: { level: VOTE_INFLUENCE_LEVEL.NONE } }, coreQuestions);

  assert.equal(signature(strong), signature(none),
    'ce test décrit le DÉFAUT : avec l’univers CORE, l’influence est sans effet');
});

// ─── Ce que la correction produit sur le CORPUS RÉEL ─────────────────────────

test('toutes les questions marquées ont une réponse candidate documentée', () => {
  const marked = questions.filter(q => q.voteInfluencePrompt).map(q => q.id);
  const absentes = marked.filter(id => !documented.has(id));
  assert.deepEqual(absentes, [],
    'une influence portant sur une question non documentée ne peut pas peser : le libellé '
    + '« thèmes et décisions » deviendrait mensonger');
});

test('sur l’univers complet, une influence STRONG change le score électoral', () => {
  const marked = questions.find(q => q.voteInfluencePrompt && documented.has(q.id));
  const userAnswers = answersOfSize(64);

  const strong = rank(userAnswers, { [marked.id]: { level: VOTE_INFLUENCE_LEVEL.STRONG } }, questions);
  const none = rank(userAnswers, { [marked.id]: { level: VOTE_INFLUENCE_LEVEL.NONE } }, questions);

  assert.notEqual(signature(strong), signature(none),
    'avec la banque complète, l’influence déclarée doit produire un effet réel');
});

test('le classement idéologique ne bouge pas quand seule l’influence change', () => {
  const marked = questions.find(q => q.voteInfluencePrompt && documented.has(q.id));
  const userAnswers = answersOfSize(64);
  const ideo = r => r.ideological.results.map(x => `${x.candidate.id}:${x.match.score}`).join('|');

  const a = rank(userAnswers, { [marked.id]: { level: VOTE_INFLUENCE_LEVEL.STRONG } }, questions);
  const b = rank(userAnswers, { [marked.id]: { level: VOTE_INFLUENCE_LEVEL.NONE } }, questions);

  assert.equal(ideo(a), ideo(b),
    'l’influence électorale n’a rien à faire dans la ressemblance idéologique');
});

test('une influence nulle retire du POIDS, pas de la comparaison', () => {
  const marked = questions.find(q => q.voteInfluencePrompt && documented.has(q.id));
  const userAnswers = answersOfSize(64);
  const answers = getEditorialAnswers(CANDIDATES[0].id, 'general');

  const withNone = computeElectoralPriorityMatch({
    userAnswers, candidateAnswers: answers, questions,
    themeImportance: allMedium(), voteInfluence: { [marked.id]: { level: VOTE_INFLUENCE_LEVEL.NONE } },
  });
  const withStrong = computeElectoralPriorityMatch({
    userAnswers, candidateAnswers: answers, questions,
    themeImportance: allMedium(), voteInfluence: { [marked.id]: { level: VOTE_INFLUENCE_LEVEL.STRONG } },
  });

  assert.equal(withNone.questionsCompared, withStrong.questionsCompared,
    'la question reste comparée dans les deux cas');
  assert.equal(withNone.questionsWeighted, withStrong.questionsWeighted - 1,
    'seule sa participation au POIDS disparaît');
});

test('une influence sur une question absente de l’intersection n’est pas comptée', () => {
  const m = computeElectoralPriorityMatch({
    userAnswers: answersOfSize(32),
    candidateAnswers: getEditorialAnswers(CANDIDATES[0].id, 'general'),
    questions, themeImportance: allMedium(),
    voteInfluence: { QUESTION_ABSENTE: { level: VOTE_INFLUENCE_LEVEL.STRONG } },
  });
  assert.equal(m.influenceDeclared, 0,
    'compter une influence hors intersection ferait annoncer un effet inexistant');
});

// ─── Le contrôle de couverture : dénominateur vrai, refus toujours possible ───

test('le contrôle de couverture compte les réponses RÉELLEMENT données', () => {
  const userAnswers = answersOfSize(64);

  const core = rank(userAnswers, {}, coreQuestions);
  assert.equal(core.ideological.results[0].match.userAnswered, coreQuestions.length,
    'l’univers CORE ne pouvait jamais compter plus de 16 réponses');

  const full = rank(userAnswers, {}, questions);
  assert.equal(full.ideological.results[0].match.userAnswered, 64,
    'l’univers complet compte les réponses réellement données');
});

test('un parcours Approfondi normal n’est PAS refusé pour couverture trop mince', () => {
  const r = rank(answersOfSize(64), {}, questions);
  assert.equal(r.ideological.results.length, CANDIDATES.length,
    'avec 128 réponses par candidat, 64 réponses utilisateur donnent un ratio de 1,0');
  assert.equal(r.ideological.unscored.length, 0);
});

test('le refus pour couverture trop mince reste ATTEIGNABLE sur un corpus incomplet', () => {
  // Le garde-fou ne doit pas disparaître parce que le corpus 2027 est complet : un candidat
  // ajouté demain avec quelques positions seulement doit continuer d'être écarté.
  const sparse = [...documented].slice(0, 6).map(questionId => ({
    questionId, answerValue: 4, answerState: ANSWER_STATE.ESTIMATED,
    basis: ANSWER_BASIS.EDITORIAL_INFERENCE, rationale: null, sourceIds: [],
    questionnaireVersion: null,
  }));
  const m = computeIdeologicalMatch({
    userAnswers: answersOfSize(64), candidateAnswers: sparse, questions,
  });
  assert.equal(m.score, null);
  assert.equal(m.reason, 'coverage_too_narrow');
  assert.ok(m.questionsCompared / m.userAnswered < EDITORIAL_MATCH_CONFIG.minComparedRatio);
});

// ─── Exclusions ─────────────────────────────────────────────────────────────

test('une question jamais posée reste exclue de la comparaison', () => {
  const partial = answersOfSize(8);
  const m = rank(partial, {}, questions).ideological.results[0].match;
  assert.equal(m.questionsCompared, 8,
    'seules les questions réellement répondues doivent être comparées');
});

test('« sans opinion » reste exclu de la comparaison', () => {
  const ids = [...documented].slice(0, 20);
  const withOpinion = Object.fromEntries(ids.map(id => [id, 4]));
  const withNoOpinion = { ...withOpinion, [ids[0]]: NO_OPINION, [ids[1]]: NO_OPINION };
  const a = rank(withOpinion, {}, questions).ideological.results[0].match.questionsCompared;
  const b = rank(withNoOpinion, {}, questions).ideological.results[0].match.questionsCompared;
  assert.equal(b, a - 2);
});
