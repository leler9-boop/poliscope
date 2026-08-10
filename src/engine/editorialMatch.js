// POLISCOP — Matching éditorial V1 : comparaison DIRECTE utilisateur ↔ candidat.
//
// PRINCIPE
// --------
// L'utilisateur et le candidat vivent dans le même espace de réponses : mêmes questions,
// même échelle 1–5, mêmes directions. La proximité se mesure sur l'INTERSECTION réelle de
// leurs réponses exploitables — pas sur huit nombres thématiques saisis à côté.
//
// CE QUI EST EXCLU DE L'INTERSECTION, ET POURQUOI
//   • question jamais posée à l'utilisateur      → aucune opinion à comparer
//   • « sans opinion » de l'utilisateur          → un refus d'opinion n'est pas une opinion
//   • réponse candidate inconnue                 → une estimation absente n'est pas un centre
//   • question retirée de la banque              → l'identifiant ne désigne plus la même chose
//   • version de questionnaire incompatible      → les libellés ont changé sous l'identifiant
//
// ⚠ On ne remplace JAMAIS une absence par 3. Le centre est une opinion — « ni d'accord ni
// pas d'accord » — et l'attribuer par défaut fabrique une proximité qui n'existe pas.
//
// ⚠ Cette voie produit des ESTIMATIONS. Elle ne se substitue pas au moteur strict
// (`candidateMatch.js`, positions sourcées et relues) et ne s'active que si l'appelant la
// demande explicitement. Aucun basculement silencieux dans un sens ou dans l'autre.

import { THEMES_ORDER } from '../data/questions.js';
import { isScorable } from './scorer.js';
import { MATCHING_VERSION, QUESTIONNAIRE_VERSION } from './versions.js';
import {
  EDITORIAL_ANSWERS_VERSION, EDITORIAL_REVIEWED_AT, ANSWER_STATE,
} from '../data/candidateEditorialAnswers.js';

/** Provenance d'un résultat. Un mélange reste une estimation : jamais « vérifié ». */
export const SCORE_PROVENANCE = Object.freeze({
  EDITORIAL: 'editorial_estimate',
  MIXED:     'mixed',
  VERIFIED:  'verified',
});

/**
 * Seuils propres à la comparaison directe.
 *
 * Ils ne sont PAS calés pour faire réapparaître des scores : ils expriment à partir de quand
 * une proximité calculée sur quelques questions cesse d'être du bruit. Le mode Découverte ne
 * pose que 16 questions ; exiger 12 sujets communs y rendrait tout incomparable.
 */
export const EDITORIAL_MATCH_CONFIG = Object.freeze({
  version: 'editorial-v1',
  /** Minimum absolu de questions comparées, tous modes confondus. */
  minComparedQuestions: 5,
  /** Part minimale des questions répondues par l'utilisateur qui doit être couverte. */
  minComparedRatio: 0.3,
  /** Thèmes distincts minimum dans l'intersection : un score bâti sur un seul thème ment. */
  minThemesInIntersection: 3,
});

/**
 * Profil thématique dérivé de réponses 1–5, avec la MÊME normalisation que `calculateProfile`.
 *
 * Volontairement sans `stretchScore` : l'étirement de la v1 sert à écarter les profils
 * utilisateurs les uns des autres pour l'affichage. L'appliquer ici déformerait la
 * comparaison, puisque les deux côtés ne passent pas par le même nombre de questions.
 *
 * @param {Object} answers  { questionId: 1..5 }
 * @param {Array}  questions questions portant `id`, `theme`, `direction`, `weight`
 */
export function themesFromAnswers(answers, questions) {
  const acc = {};
  THEMES_ORDER.forEach(t => { acc[t] = { sum: 0, weight: 0, count: 0 }; });

  for (const q of questions) {
    const value = answers?.[q.id];
    if (!isScorable(value)) continue;
    const normalized = (value - 1) / 4;
    const contribution = q.direction === 1 ? normalized : 1 - normalized;
    const w = q.weight ?? 1;
    const bucket = acc[q.theme];
    if (!bucket) continue;
    bucket.sum += contribution * w;
    bucket.weight += w;
    bucket.count++;
  }

  const themes = {};
  const perTheme = {};
  for (const t of THEMES_ORDER) {
    const d = acc[t];
    // AUCUNE valeur par défaut : un thème sans réponse reste `null`, jamais 50.
    themes[t] = d.weight > 0 ? Math.round((d.sum / d.weight) * 100) : null;
    perTheme[t] = d.count;
  }
  return { themes, perTheme, answered: Object.values(perTheme).reduce((a, b) => a + b, 0) };
}

/**
 * Intersection exploitable entre réponses utilisateur et réponses candidates.
 * @returns {{questionId, theme, user, candidate, basis}[]}
 */
export function comparableAnswers(userAnswers, candidateAnswers, questions, { questionnaireVersion } = {}) {
  const byId = new Map(questions.map(q => [q.id, q]));
  const out = [];

  for (const answer of candidateAnswers) {
    const question = byId.get(answer.questionId);
    if (!question) continue;                                   // question retirée ou hors jeu
    if (answer.answerState !== ANSWER_STATE.ESTIMATED) continue; // inconnue ou remplacée
    if (!isScorable(answer.answerValue)) continue;
    // Une réponse candidate codée sous une version de questionnaire incompatible ne peut pas
    // être comparée : l'identifiant est stable, le libellé ne l'est pas.
    if (questionnaireVersion && answer.questionnaireVersion
        && answer.questionnaireVersion !== questionnaireVersion) continue;

    const userValue = userAnswers?.[answer.questionId];
    if (!isScorable(userValue)) continue;   // non posée, sautée, ou « sans opinion »

    out.push({
      questionId: answer.questionId,
      theme: question.theme,
      user: userValue,
      candidate: answer.answerValue,
      basis: answer.basis,
    });
  }
  return out;
}

/**
 * Indice de proximité 0–100 sur l'intersection.
 * Distance moyenne normalisée : deux réponses identiques valent 100, opposées valent 0.
 */
function proximityFrom(pairs) {
  if (!pairs.length) return null;
  let total = 0;
  for (const p of pairs) total += 1 - Math.abs(p.user - p.candidate) / 4;
  return Math.round((total / pairs.length) * 100);
}

/**
 * Compare un utilisateur et un candidat sur leurs réponses.
 *
 * @param {Object} params
 * @param {Object} params.userAnswers        { questionId: 1..5 | NO_OPINION }
 * @param {Array}  params.candidateAnswers   réponses éditoriales du candidat
 * @param {Array}  params.questions          questions du jeu comparé
 * @param {Object} [params.config]           seuils
 * @returns {Object} résultat portant score, couverture et provenance
 */
export function computeEditorialMatch({
  userAnswers = {},
  candidateAnswers = [],
  questions = [],
  config = EDITORIAL_MATCH_CONFIG,
  candidateDataVersion = EDITORIAL_ANSWERS_VERSION,
  updatedAt = EDITORIAL_REVIEWED_AT,
  questionnaireVersion = QUESTIONNAIRE_VERSION,
} = {}) {
  const pairs = comparableAnswers(userAnswers, candidateAnswers, questions, { questionnaireVersion });

  const userAnswered = questions.filter(q => isScorable(userAnswers?.[q.id])).length;
  const candidateKnown = candidateAnswers.filter(
    a => a.answerState === ANSWER_STATE.ESTIMATED && isScorable(a.answerValue),
  ).length;
  const themesInIntersection = new Set(pairs.map(p => p.theme));

  // Toute contribution éditoriale suffit à rendre le résultat estimatif : le libellé
  // « vérifié » exige que TOUTES les contributions respectent le contrat strict.
  const provenance = pairs.length === 0
    ? null
    : SCORE_PROVENANCE.EDITORIAL;

  const base = {
    scoreType: 'editorial-direct-comparison',
    profileSource: EDITORIAL_ANSWERS_VERSION,
    questionsCompared: pairs.length,
    questionsAvailable: questions.length,
    userAnswered,
    estimatedPositionsUsed: pairs.length,
    verifiedPositionsUsed: 0,
    unknownPositions: candidateAnswers.length - candidateKnown,
    themesCovered: [...themesInIntersection],
    candidateDataVersion,
    questionnaireVersion,
    matchingVersion: MATCHING_VERSION,
    editorialMatchVersion: config.version,
    updatedAt,
    provenance,
  };

  const insufficient = (reason) => ({
    ...base, score: null, reason, themes: null, agreements: [], disagreements: [],
  });

  if (candidateKnown === 0) return insufficient('no_editorial_answers');
  if (userAnswered === 0)    return insufficient('user_has_no_answers');
  if (pairs.length === 0)    return insufficient('no_common_questions');
  if (pairs.length < config.minComparedQuestions) return insufficient('too_few_common_questions');
  if (pairs.length / Math.max(userAnswered, 1) < config.minComparedRatio) {
    return insufficient('coverage_too_narrow');
  }
  if (themesInIntersection.size < config.minThemesInIntersection) {
    return insufficient('too_few_themes');
  }

  const score = proximityFrom(pairs);
  const sorted = [...pairs].sort(
    (a, b) => Math.abs(a.user - a.candidate) - Math.abs(b.user - b.candidate),
  );
  const candidateAnswerMap = Object.fromEntries(
    candidateAnswers.map(a => [a.questionId, a.answerValue]),
  );

  return {
    ...base,
    score,
    reason: null,
    themes: themesFromAnswers(candidateAnswerMap, questions).themes,
    // Les trois sujets les plus proches et les trois plus éloignés : c'est ce qui rend un
    // score explicable. Un indice sans ses raisons n'est pas vérifiable par l'utilisateur.
    agreements:    sorted.slice(0, 3).map(p => p.questionId),
    disagreements: sorted.slice(-3).reverse().map(p => p.questionId),
  };
}

/**
 * Classe une liste de candidats. Un candidat non comparable n'empêche jamais les autres
 * d'être classés : il rejoint une liste séparée, avec son motif.
 */
export function rankEditorialMatches(candidates, { userAnswers, questions, answersFor }) {
  const results = [];
  const unscored = [];
  for (const candidate of candidates) {
    const match = computeEditorialMatch({
      userAnswers, questions, candidateAnswers: answersFor(candidate),
    });
    if (match.score == null) unscored.push({ candidate, match });
    else results.push({ candidate, match });
  }
  results.sort((a, b) => b.match.score - a.match.score || a.candidate.id.localeCompare(b.candidate.id));
  return { results, unscored };
}
