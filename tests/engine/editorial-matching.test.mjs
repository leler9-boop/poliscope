// POLISCOP — Matching éditorial V1 : garanties du mode estimation.
//
// Deux voies coexistent et ne doivent JAMAIS se confondre :
//   • `sourced-positions`     — positions sourcées, vérifiées, relues. Aucune aujourd'hui.
//   • `editorial-estimate-v1` — meilleure estimation raisonnable, publique mais étiquetée.
//
// Ces tests verrouillent la frontière entre les deux, et les règles qui rendent une
// estimation honnête : pas de centre par défaut, pas de basculement silencieux, provenance
// transportée jusqu'au résultat, et une inconnue qui reste une inconnue.

import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  computeEditorialMatch, rankEditorialMatches, comparableAnswers, themesFromAnswers,
  SCORE_PROVENANCE, EDITORIAL_MATCH_CONFIG,
} from '../../src/engine/editorialMatch.js';
import {
  getEditorialAnswers, editorialCoverage, EDITORIAL_ANSWERS,
  ANSWER_STATE, ANSWER_BASIS, EDITORIAL_ANSWERS_VERSION,
} from '../../src/data/candidateEditorialAnswers.js';
import { computeCandidateMatch } from '../../src/engine/candidateMatch.js';
import { elections } from '../../src/data/elections.js';
import { NO_OPINION } from '../../src/engine/scorer.js';
import { QUESTIONNAIRE_VERSION } from '../../src/engine/versions.js';

const FR2027 = elections.find(e => e.id === 'fr_2027');
const QUESTIONS = FR2027.specificQuestions;
const answersFor = c => getEditorialAnswers(c.id, 'fr_2027');

/** Profil de gauche écologiste et pro-européen. */
const LEFT_GREEN = {
  fr_2027_q1: 5, fr_2027_q2: 2, fr_2027_q3: 2, fr_2027_q4: 5, fr_2027_q5: 5, fr_2027_q6: 5,
  fr_2027_q7: 2, fr_2027_q8: 1, fr_2027_q9: 4, fr_2027_q10: 2, fr_2027_q11: 5, fr_2027_q12: 5,
  fr_2027_q13: 5, fr_2027_q14: 5, fr_2027_q15: 4, fr_2027_q16: 2, fr_2027_q17: 5,
};
/** Profil de droite conservatrice et sécuritaire. */
const RIGHT_CONS = {
  fr_2027_q1: 1, fr_2027_q2: 5, fr_2027_q3: 5, fr_2027_q4: 2, fr_2027_q5: 2, fr_2027_q6: 2,
  fr_2027_q7: 5, fr_2027_q8: 5, fr_2027_q9: 4, fr_2027_q10: 5, fr_2027_q11: 1, fr_2027_q12: 1,
  fr_2027_q13: 2, fr_2027_q14: 2, fr_2027_q15: 3, fr_2027_q16: 5, fr_2027_q17: 2,
};

const rank = userAnswers => rankEditorialMatches(FR2027.candidates, { userAnswers, questions: QUESTIONS, answersFor });
const scoreOf = (ranking, id) => ranking.results.find(r => r.candidate.id === id)?.match.score ?? null;

// ─── La voie éditoriale fonctionne ──────────────────────────────────────────

test('un candidat éditorialement complet produit un score', () => {
  const match = computeEditorialMatch({
    userAnswers: LEFT_GREEN, questions: QUESTIONS,
    candidateAnswers: answersFor({ id: 'tondelier' }),
  });
  assert.notEqual(match.score, null, `aucun score : ${match.reason}`);
  assert.ok(match.score >= 0 && match.score <= 100);
  assert.equal(match.questionsCompared, 17);
});

test('les dix candidats suivis sont comparables sur 2027', () => {
  const { results, unscored } = rank(LEFT_GREEN);
  assert.equal(results.length, 10, `non classés : ${unscored.map(u => `${u.candidate.id}(${u.match.reason})`).join(', ')}`);
});

test('le classement est déterministe', () => {
  const a = rank(LEFT_GREEN).results.map(r => `${r.candidate.id}:${r.match.score}`);
  const b = rank(LEFT_GREEN).results.map(r => `${r.candidate.id}:${r.match.score}`);
  assert.deepEqual(a, b);
});

// ─── Frontière avec la voie stricte ─────────────────────────────────────────

test('le mode éditorial ne s’active pas tout seul dans le moteur strict', () => {
  // `computeCandidateMatch` ne doit rien savoir des estimations : sans position approuvée,
  // il refuse, quelles que soient les réponses éditoriales disponibles.
  const match = computeCandidateMatch({
    userThemes: Object.fromEntries(Object.keys(themesFromAnswers({}, QUESTIONS).themes).map(t => [t, 50])),
    candidate: FR2027.candidates.find(c => c.id === 'tondelier'),
    questions: QUESTIONS,
  });
  assert.equal(match.score, null, 'le moteur strict a produit un score depuis des estimations');
  assert.equal(match.reason, 'no_sourced_positions');
});

test('un résultat éditorial est toujours étiqueté estimation, jamais vérifié', () => {
  for (const { match } of rank(LEFT_GREEN).results) {
    assert.equal(match.provenance, SCORE_PROVENANCE.EDITORIAL);
    assert.notEqual(match.provenance, SCORE_PROVENANCE.VERIFIED);
    assert.equal(match.verifiedPositionsUsed, 0);
    assert.ok(match.estimatedPositionsUsed > 0);
  }
});

test('la provenance et les versions accompagnent chaque résultat', () => {
  const { match } = rank(LEFT_GREEN).results[0];
  for (const field of ['scoreType', 'profileSource', 'questionsCompared', 'questionsAvailable',
    'estimatedPositionsUsed', 'verifiedPositionsUsed', 'unknownPositions',
    'candidateDataVersion', 'questionnaireVersion', 'matchingVersion', 'updatedAt']) {
    assert.ok(match[field] != null, `champ de provenance manquant : ${field}`);
  }
  assert.equal(match.profileSource, EDITORIAL_ANSWERS_VERSION);
  assert.equal(match.questionnaireVersion, QUESTIONNAIRE_VERSION);
});

// ─── Ce qui entre, et ce qui n'entre pas, dans l'intersection ───────────────

test('« sans opinion » de l’utilisateur est exclu de la comparaison', () => {
  const withNoOpinion = { ...LEFT_GREEN, fr_2027_q1: NO_OPINION, fr_2027_q2: NO_OPINION };
  const pairs = comparableAnswers(withNoOpinion, answersFor({ id: 'tondelier' }), QUESTIONS);
  const ids = pairs.map(p => p.questionId);
  assert.ok(!ids.includes('fr_2027_q1'), '« sans opinion » a été comparé');
  assert.ok(!ids.includes('fr_2027_q2'), '« sans opinion » a été comparé');
  assert.equal(pairs.length, 15);
});

test('une question jamais posée n’entre pas dans l’intersection', () => {
  const partial = { fr_2027_q1: 5, fr_2027_q5: 5, fr_2027_q11: 5, fr_2027_q12: 5, fr_2027_q13: 5, fr_2027_q17: 5 };
  const match = computeEditorialMatch({
    userAnswers: partial, questions: QUESTIONS, candidateAnswers: answersFor({ id: 'roussel_2027' }),
  });
  assert.equal(match.questionsCompared, 6);
  assert.equal(match.userAnswered, 6);
});

test('une réponse candidate inconnue n’est jamais remplacée par un centre', () => {
  const answers = answersFor({ id: 'tondelier' }).map((a, i) =>
    i < 12 ? { ...a, answerValue: null, answerState: ANSWER_STATE.UNKNOWN, basis: ANSWER_BASIS.UNKNOWN } : a);
  const pairs = comparableAnswers(LEFT_GREEN, answers, QUESTIONS);
  assert.equal(pairs.length, 5, 'des inconnues ont été comparées');
  for (const p of pairs) assert.ok([1, 2, 3, 4, 5].includes(p.candidate));
});

test('une réponse codée sous une version de questionnaire incompatible est refusée', () => {
  const stale = answersFor({ id: 'tondelier' }).map(a => ({ ...a, questionnaireVersion: '2020.01-obsolete' }));
  const match = computeEditorialMatch({
    userAnswers: LEFT_GREEN, questions: QUESTIONS, candidateAnswers: stale,
  });
  assert.equal(match.score, null);
  assert.equal(match.reason, 'no_common_questions');
});

test('une question retirée du jeu est ignorée sans faire échouer le reste', () => {
  const reduced = QUESTIONS.filter(q => q.id !== 'fr_2027_q1');
  const match = computeEditorialMatch({
    userAnswers: LEFT_GREEN, questions: reduced, candidateAnswers: answersFor({ id: 'tondelier' }),
  });
  assert.equal(match.questionsCompared, 16);
  assert.notEqual(match.score, null);
});

// ─── Seuils ─────────────────────────────────────────────────────────────────

test('trop peu de sujets communs ne produit pas de score', () => {
  const tiny = { fr_2027_q1: 5, fr_2027_q5: 4 };
  const match = computeEditorialMatch({
    userAnswers: tiny, questions: QUESTIONS, candidateAnswers: answersFor({ id: 'tondelier' }),
  });
  assert.equal(match.score, null);
  assert.equal(match.reason, 'too_few_common_questions');
});

test('une intersection concentrée sur trop peu de thèmes est refusée', () => {
  // Cinq questions, toutes économiques : suffisant en nombre, pas en diversité.
  const economyOnly = { fr_2027_q1: 5, fr_2027_q8: 1, fr_2027_q11: 5, fr_2027_q17: 5, fr_2027_q12: 5 };
  const match = computeEditorialMatch({
    userAnswers: economyOnly, questions: QUESTIONS, candidateAnswers: answersFor({ id: 'roussel_2027' }),
  });
  assert.equal(match.score, null);
  assert.equal(match.reason, 'too_few_themes');
});

test('un candidat sans aucune réponse éditoriale le dit, sans bloquer les autres', () => {
  const { results, unscored } = rankEditorialMatches(FR2027.candidates, {
    userAnswers: LEFT_GREEN, questions: QUESTIONS,
    answersFor: c => (c.id === 'tondelier' ? [] : answersFor(c)),
  });
  assert.equal(unscored.length, 1);
  assert.equal(unscored[0].candidate.id, 'tondelier');
  assert.equal(unscored[0].match.reason, 'no_editorial_answers');
  assert.equal(results.length, 9, 'un candidat sans données a empêché les autres d’être classés');
});

// ─── Cohérence politique (Partie D) ─────────────────────────────────────────
//
// Ces contrôles ne codent pas le résultat attendu : ils détectent une incohérence GROSSIÈRE
// qui appellerait une revue. Un écart n'est pas automatiquement une erreur.

test('un profil de gauche écologiste classe la gauche devant la droite', () => {
  const r = rank(LEFT_GREEN);
  const gauche = ['tondelier', 'melenchon_2027', 'ruffin', 'roussel_2027', 'glucksmann'];
  const droite = ['retailleau', 'zemmour_2027', 'lepen_2027'];
  const minGauche = Math.min(...gauche.map(id => scoreOf(r, id)));
  const maxDroite = Math.max(...droite.map(id => scoreOf(r, id)));
  assert.ok(minGauche > maxDroite,
    `incohérence : plus faible score de gauche ${minGauche} ≤ plus fort score de droite ${maxDroite}`);
});

test('un profil de droite conservatrice classe la droite devant la gauche', () => {
  const r = rank(RIGHT_CONS);
  const droite = ['retailleau', 'zemmour_2027', 'lepen_2027'];
  const gauche = ['tondelier', 'melenchon_2027', 'ruffin'];
  assert.ok(Math.min(...droite.map(id => scoreOf(r, id))) > Math.max(...gauche.map(id => scoreOf(r, id))));
});

test('les candidats proches restent distinguables', () => {
  // Aucun clone : deux candidats ne doivent pas recevoir exactement le même profil de réponses.
  const paires = [['zemmour_2027', 'lepen_2027'], ['philippe', 'attal'],
    ['glucksmann', 'melenchon_2027'], ['ruffin', 'roussel_2027']];
  for (const [a, b] of paires) {
    const A = answersFor({ id: a }); const B = answersFor({ id: b });
    const diff = A.filter(x => {
      const y = B.find(z => z.questionId === x.questionId);
      return y && y.answerValue !== x.answerValue;
    }).length;
    assert.ok(diff >= 3, `${a} et ${b} ne diffèrent que sur ${diff} question(s) : clonage probable`);
  }
});

test('les particularités individuelles sont conservées face à la ligne du parti', () => {
  const roussel = answersFor({ id: 'roussel_2027' });
  const melenchon = answersFor({ id: 'melenchon_2027' });
  const val = (set, id) => set.find(a => a.questionId === id)?.answerValue;
  // Le PCF est pro-nucléaire, LFI ne l'est pas : c'est le cas d'école du non-clonage.
  assert.ok(val(roussel, 'fr_2027_q3') > val(melenchon, 'fr_2027_q3'),
    'Roussel devrait être nettement plus favorable au nucléaire que Mélenchon');
  // Laïcité : Roussel plus strict que LFI.
  assert.ok(val(roussel, 'fr_2027_q10') > val(melenchon, 'fr_2027_q10'));
  // Sécurité : ligne assumée plus ferme que LFI.
  assert.ok(val(roussel, 'fr_2027_q7') >= val(melenchon, 'fr_2027_q7'));
});

// ─── Intégrité du jeu de réponses ───────────────────────────────────────────

test('chaque réponse éditoriale porte sa base, sa version et sa date', () => {
  const bases = new Set(Object.values(ANSWER_BASIS));
  for (const a of EDITORIAL_ANSWERS) {
    assert.ok(bases.has(a.basis), `${a.candidateId}/${a.questionId} : base « ${a.basis} » inconnue`);
    assert.equal(a.provenance, EDITORIAL_ANSWERS_VERSION);
    assert.ok(a.questionnaireVersion, 'version de questionnaire absente');
    assert.match(a.reviewedAt, /^\d{4}-\d{2}-\d{2}$/);
    if (a.answerState === ANSWER_STATE.ESTIMATED) {
      assert.ok([1, 2, 3, 4, 5].includes(a.answerValue));
    } else {
      assert.equal(a.answerValue, null, 'une réponse non estimée porte une valeur');
      assert.equal(a.basis, ANSWER_BASIS.UNKNOWN);
    }
  }
});

test('la couverture éditoriale est mesurée, pas supposée', () => {
  for (const candidate of FR2027.candidates) {
    const c = editorialCoverage(candidate.id, 'fr_2027');
    assert.equal(c.total, 17, `${candidate.id} : ${c.total} réponses au lieu de 17`);
    assert.equal(c.known + c.unknown, c.total);
  }
});

test('un thème sans réponse reste indéterminé, jamais ramené au centre', () => {
  const { themes } = themesFromAnswers({ fr_2027_q1: 5 }, QUESTIONS);
  assert.equal(themes.ECONOMY != null, true);
  assert.equal(themes.SOCIAL, null, 'un thème sans réponse a reçu une valeur par défaut');
  assert.equal(themes.SECURITY, null);
});
