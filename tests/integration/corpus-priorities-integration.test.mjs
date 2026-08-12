// POLISCOP — Invariants de l'intégration corpus 2027 × priorités électorales.
//
// POURQUOI CE FICHIER EXISTE
// --------------------------
// Deux travaux ont été menés en parallèle sur des branches divergentes : le corpus éditorial
// complet (11 candidats × 128 réponses, `candidateEditorialCorpus2027.js`) d'un côté, la
// séparation opinion / importance / influence de l'autre. Chacun était juste isolément et
// faux en absence de l'autre :
//
//   • sans le corpus, les 18 questions d'influence n'avaient aucune réponse candidate, donc
//     aucune influence ne pouvait peser — et un parcours Approfondi tombait légitimement en
//     `coverage_too_narrow` ;
//   • sans la séparation, le corpus était comparé sans pondération par les priorités.
//
// Ces tests interdisent qu'une future fusion reperde silencieusement l'un des deux côtés.

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { rankBothWays } from '../../src/engine/candidateRanking.js';
import {
  questions, coreQuestions, getQuestionQueue, THEMES_ORDER,
} from '../../src/data/questions.js';
import {
  getEditorialAnswers, ANSWER_STATE,
} from '../../src/data/candidateEditorialAnswers.js';
import { GENERAL_CANDIDATE_ORDER, NON_CORE_ANSWERS } from '../../src/data/candidateEditorialCorpus2027.js';
import { elections } from '../../src/data/elections.js';
import { CANDIDATE_REGISTRY, getRegistryEntry } from '../../src/data/candidateRegistry.js';
import {
  IMPORTANCE_LEVEL, PRIORITY_SOURCE, VOTE_INFLUENCE_LEVEL,
} from '../../src/engine/priorityWeights.js';

const FR2027 = elections.find(e => e.id === 'fr_2027');
const CANDIDATES = FR2027.candidates;
const COVERED = CANDIDATES.filter(c => getEditorialAnswers(c.id, 'general').length > 0);
const MARKED = questions.filter(q => q.voteInfluencePrompt);

const allMedium = () => ({
  levels: Object.fromEntries(THEMES_ORDER.map(t => [t, IMPORTANCE_LEVEL.MEDIUM])),
  answered: Object.fromEntries(THEMES_ORDER.map(t => [t, true])),
  source: PRIORITY_SOURCE.EQUAL,
});

const rank = (userAnswers, voteInfluence = {}) => rankBothWays({
  candidates: CANDIDATES, userAnswers, questions,
  questionSet: 'general', themeImportance: allMedium(), voteInfluence,
});

// ─── 1 à 3 : le corpus est réellement complet ───────────────────────────────

test('les candidats couverts possèdent exactement 128 réponses générales', () => {
  assert.equal(COVERED.length, 11, 'onze candidats doivent être couverts');
  for (const c of COVERED) {
    assert.equal(getEditorialAnswers(c.id, 'general').length, 128,
      `${c.id} n'a pas 128 réponses générales`);
  }
});

test('les réponses CORE et non-CORE sont toutes disponibles', () => {
  assert.equal(coreQuestions.length + Object.keys(NON_CORE_ANSWERS).length, questions.length);
  assert.equal(Object.keys(NON_CORE_ANSWERS).length, 112);
  const union = new Set(COVERED.flatMap(c => getEditorialAnswers(c.id, 'general')).map(a => a.questionId));
  const manquantes = questions.filter(q => !union.has(q.id)).map(q => q.id);
  assert.deepEqual(manquantes, [], 'toute question active doit être documentée');
});

test('chaque question d’influence a une réponse pour CHAQUE candidat couvert', () => {
  assert.equal(MARKED.length, 18);
  for (const c of COVERED) {
    const ids = new Set(getEditorialAnswers(c.id, 'general').map(a => a.questionId));
    const absentes = MARKED.filter(q => !ids.has(q.id)).map(q => q.id);
    assert.deepEqual(absentes, [], `${c.id} n'a pas de position sur ${absentes.join(', ')}`);
  }
});

test('chaque ligne du corpus non-CORE porte une valeur par candidat', () => {
  assert.equal(GENERAL_CANDIDATE_ORDER.length, 11);
  for (const [id, row] of Object.entries(NON_CORE_ANSWERS)) {
    assert.equal(row.v.length, GENERAL_CANDIDATE_ORDER.length,
      `la ligne ${id} n'a pas une valeur par candidat`);
    for (const v of row.v) assert.ok(v >= 1 && v <= 5, `valeur hors échelle dans ${id}`);
  }
});

// ─── 4 à 6 : les trois modes comparent ce qu'ils promettent ─────────────────

for (const [label, mode, taille] of [['Découverte', 'quick', 16], ['Standard', 'standard', 32], ['Approfondi', 'deep', 64]]) {
  test(`un parcours ${label} compare jusqu’à ${taille} réponses`, () => {
    for (const seed of [1, 7, 42]) {
      const queue = getQuestionQueue(mode, THEMES_ORDER, seed);
      assert.equal(queue.length, taille, `file ${label} de taille inattendue (graine ${seed})`);
      const userAnswers = Object.fromEntries(queue.map(q => [q.id, 4]));
      const r = rank(userAnswers);
      assert.equal(r.ideological.results.length, CANDIDATES.length,
        `${label} doit classer tous les candidats (graine ${seed})`);
      assert.equal(r.ideological.results[0].match.questionsCompared, taille,
        `${label} doit comparer les ${taille} réponses (graine ${seed})`);
    }
  });
}

test('les questions marquées figurent réellement dans les files Standard et Approfondi', () => {
  for (const seed of [1, 7, 42]) {
    for (const mode of ['standard', 'deep']) {
      const queue = getQuestionQueue(mode, THEMES_ORDER, seed);
      const marked = queue.filter(q => q.voteInfluencePrompt);
      assert.ok(marked.length > 0, `aucune question marquée en ${mode} (graine ${seed})`);

      // …et elles entrent réellement dans l'intersection candidate.
      const userAnswers = Object.fromEntries(queue.map(q => [q.id, 4]));
      const voteInfluence = Object.fromEntries(
        marked.map(q => [q.id, { level: VOTE_INFLUENCE_LEVEL.STRONG }]));
      const m = rank(userAnswers, voteInfluence).electoral.results[0].match;
      assert.equal(m.influenceDeclared, marked.length,
        `toutes les influences doivent entrer dans l'intersection (${mode}, graine ${seed})`);
    }
  }
});

// ─── 9 à 12 : la sémantique de l'influence ─────────────────────────────────

test('une influence « none » conserve la réponse dans le classement idéologique', () => {
  const queue = getQuestionQueue('deep', THEMES_ORDER, 1);
  const userAnswers = Object.fromEntries(queue.map(q => [q.id, 4]));
  const marked = queue.find(q => q.voteInfluencePrompt);

  const sans = rank(userAnswers).ideological.results[0].match;
  const avec = rank(userAnswers, { [marked.id]: { level: VOTE_INFLUENCE_LEVEL.NONE } })
    .ideological.results[0].match;

  assert.equal(avec.questionsCompared, sans.questionsCompared,
    '« ce sujet ne changera pas mon vote » n’est pas « je n’ai pas répondu »');
  assert.equal(avec.score, sans.score);
});

test('une influence « none » retire la question du score électoral', () => {
  const queue = getQuestionQueue('deep', THEMES_ORDER, 1);
  const userAnswers = Object.fromEntries(queue.map(q => [q.id, 4]));
  const marked = queue.find(q => q.voteInfluencePrompt);

  const neutre = rank(userAnswers).electoral.results[0].match;
  const nulle = rank(userAnswers, { [marked.id]: { level: VOTE_INFLUENCE_LEVEL.NONE } })
    .electoral.results[0].match;

  assert.equal(nulle.questionsWeighted, neutre.questionsWeighted - 1);
});

test('une influence « strong » peut modifier le classement électoral', () => {
  const queue = getQuestionQueue('deep', THEMES_ORDER, 1);
  const userAnswers = Object.fromEntries(queue.map(q => [q.id, 4]));
  const marked = queue.filter(q => q.voteInfluencePrompt);
  const sig = r => r.electoral.results.map(x => `${x.candidate.id}:${x.match.score}`).join('|');

  const fortes = Object.fromEntries(marked.map(q => [q.id, { level: VOTE_INFLUENCE_LEVEL.STRONG }]));
  const nulles = Object.fromEntries(marked.map(q => [q.id, { level: VOTE_INFLUENCE_LEVEL.NONE }]));

  assert.notEqual(sig(rank(userAnswers, fortes)), sig(rank(userAnswers, nulles)),
    'déclarer des décisions déterminantes doit avoir un effet mesurable');
});

test('le classement idéologique est identique quand seule l’influence change', () => {
  const queue = getQuestionQueue('deep', THEMES_ORDER, 1);
  const userAnswers = Object.fromEntries(queue.map(q => [q.id, 4]));
  const marked = queue.filter(q => q.voteInfluencePrompt);
  const sig = r => r.ideological.results.map(x => `${x.candidate.id}:${x.match.score}`).join('|');

  const base = sig(rank(userAnswers));
  for (const level of Object.values(VOTE_INFLUENCE_LEVEL)) {
    const vi = Object.fromEntries(marked.map(q => [q.id, { level }]));
    assert.equal(sig(rank(userAnswers, vi)), base,
      `la ressemblance idéologique a bougé avec l’influence ${level}`);
  }
});

// ─── 15 à 18 : ce que l'intégration ne doit pas perdre ─────────────────────

test('Lisnard est présent, avec un statut de candidature daté et sourcé', () => {
  const registre = getRegistryEntry('lisnard');
  assert.ok(registre, 'Lisnard doit figurer au registre canonique');
  assert.equal(registre.id, 'david-lisnard', 'l’alias historique doit résoudre vers l’identité canonique');
  assert.ok(registre.status, 'son statut de candidature doit être renseigné');
  assert.ok(registre.statusDate, 'son statut doit être daté');
  assert.ok(registre.statusSourceIds?.length > 0, 'son statut doit être sourcé');
  assert.ok(CANDIDATE_REGISTRY.includes(registre));
  assert.ok(GENERAL_CANDIDATE_ORDER.includes('lisnard'), 'Lisnard doit être dans le corpus');
  assert.ok(CANDIDATES.some(c => c.id === 'lisnard'), 'Lisnard doit être dans fr_2027');
});

test('les huit scores thématiques des candidats restent disponibles', () => {
  for (const c of COVERED) {
    const themes = c.profile ?? null;
    assert.ok(themes, `${c.id} n'expose aucun profil thématique`);
    for (const t of THEMES_ORDER) {
      assert.equal(typeof themes[t], 'number', `${c.id} n'a pas de score ${t}`);
    }
  }
});

test('les pages candidat disposent des estimations sur les 128 questions', () => {
  for (const c of COVERED) {
    const answers = getEditorialAnswers(c.id, 'general');
    assert.equal(answers.length, 128);
    assert.ok(answers.every(a => a.answerState === ANSWER_STATE.ESTIMATED),
      `${c.id} porte une réponse qui n'est pas étiquetée « estimation »`);
  }
});

test('aucun profil legacy-manual-v1 n’entre dans un score', () => {
  const queue = getQuestionQueue('deep', THEMES_ORDER, 1);
  const userAnswers = Object.fromEntries(queue.map(q => [q.id, 4]));
  for (const { match } of rank(userAnswers).ideological.results) {
    assert.notEqual(match.profileSource, 'legacy-manual-v1',
      'les huit nombres saisis à la main ne doivent jamais produire un score affiché');
    assert.ok(match.provenance, 'tout score affiché doit porter sa provenance');
  }
});
