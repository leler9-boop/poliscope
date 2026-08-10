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
  getEditorialAnswers,
} from '../data/candidateEditorialAnswers.js';
import {
  PRIORITY_CONTRACT_VERSION, normalizeThemeImportance, themeMultiplier,
  voteInfluenceMultiplier, computeEffectiveQuestionWeight, balanceWeightsAcrossThemes,
} from './priorityWeights.js';

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
 * Profil thématique dérivé de réponses 1–5.
 *
 * ⚠ CE N'EST PAS le même pipeline que `calculateProfile()` / `calculateProfileV2()`, et il ne
 * faut pas le prétendre. Ce qui est réellement partagé :
 *   • l'échelle 1–5 et sa normalisation `(v - 1) / 4` ;
 *   • l'application de `direction` question par question ;
 *   • la pondération par `weight` ;
 *   • le refus d'attribuer une valeur par défaut à un thème sans réponse.
 * Ce qui diffère : le scorer canonique itère la banque ACTIVE complète et applique
 * `stretchScore()` en v1. Ici on itère le jeu de questions fourni (les 17 d'une élection ne
 * sont pas dans la banque générale) et on n'étire pas — l'étirement écarte les profils pour
 * l'affichage, et l'appliquer à un seul des deux côtés fausserait la comparaison.
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
 * Dérive le profil thématique d'un candidat depuis le corpus éditorial explicite.
 *
 * Cette fonction alimente les vues « par sujet ». Elle ne transforme pas une estimation en
 * preuve : la provenance et la couverture voyagent avec les huit thèmes calculés. Une fiche
 * sans corpus reste indisponible au lieu de retomber sur un ancien profil manuel.
 */
export function deriveEditorialCandidateThemes({
  candidateId,
  questions = [],
  questionSet = 'general',
  questionnaireVersion = QUESTIONNAIRE_VERSION,
} = {}) {
  const questionIds = new Set(questions.map(question => question.id));
  const usable = getEditorialAnswers(candidateId, questionSet).filter(answer =>
    questionIds.has(answer.questionId)
      && answer.answerState === ANSWER_STATE.ESTIMATED
      && isScorable(answer.answerValue)
      && (!answer.questionnaireVersion || answer.questionnaireVersion === questionnaireVersion));
  const answerMap = Object.fromEntries(
    usable.map(answer => [answer.questionId, answer.answerValue]),
  );
  const derived = themesFromAnswers(answerMap, questions);

  return {
    ...derived,
    candidateId,
    questionSet,
    knownAnswers: usable.length,
    questionsAvailable: questions.length,
    provenance: usable.length ? EDITORIAL_ANSWERS_VERSION : null,
    updatedAt: usable.length ? EDITORIAL_REVIEWED_AT : null,
  };
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
  const byId = new Map(questions.map(q => [q.id, q]));
  // Forme IDENTIQUE à celle du moteur strict (`{ q, distance, position }`), pour que les
  // surfaces affichent les accords et désaccords sans savoir quelle voie a produit le score.
  const sorted = [...pairs]
    .map(p => ({
      q: byId.get(p.questionId),
      distance: Math.abs(p.user - p.candidate),
      position: { stance: p.candidate - 3, basis: p.basis },
      userAnswer: p.user,
    }))
    .sort((a, b) => a.distance - b.distance);
  const candidateAnswerMap = Object.fromEntries(
    candidateAnswers.map(a => [a.questionId, a.answerValue]),
  );

  return {
    ...base,
    score,
    reason: null,
    themes: themesFromAnswers(candidateAnswerMap, questions).themes,
    // Les sujets les plus proches et les plus éloignés : c'est ce qui rend un score
    // explicable. Un indice sans ses raisons n'est pas vérifiable par l'utilisateur.
    agreements:    sorted.filter(x => x.distance <= 1).slice(0, 3),
    disagreements: sorted.filter(x => x.distance >= 2).slice(-3).reverse(),
    breakdownSource: EDITORIAL_ANSWERS_VERSION,
  };
}

/**
 * RÉSULTAT 1 — Ressemblance politique.
 *
 * « Quel candidat répondrait le plus souvent comme moi ? »
 *
 * Utilise les réponses politiques SEULES : ni importance de thème, ni influence sur le vote.
 * C'est le classement qui doit rester intact quand quelqu'un déclare qu'un sujet ne changera
 * pas son vote — son opinion compte toujours pour dire à qui il ressemble.
 */
export const computeIdeologicalMatch = computeEditorialMatch;

/**
 * RÉSULTAT 2 — Proximité électorale pondérée.
 *
 * « Quel candidat est le plus proche de moi sur les sujets qui comptent dans mon choix ? »
 *
 * poids effectif = importance du thème × influence de la question sur le vote × poids éditorial
 * puis : plafonnement par question, puis répartition pour qu'un thème riche en questions ne
 * domine pas, puis normalisation par la somme des poids réellement comparables.
 *
 * ⚠ Une question de poids nul reste COMPARÉE et COMPTÉE (`questionsCompared`) : elle ne pèse
 * simplement pas. La distinction entre « je n'ai pas d'avis » et « mon avis ne changera pas
 * mon vote » vit précisément dans cet écart entre `questionsCompared` et `questionsWeighted`.
 */
export function computeElectoralPriorityMatch({
  userAnswers = {},
  candidateAnswers = [],
  questions = [],
  themeImportance = null,
  voteInfluence = {},
  config = EDITORIAL_MATCH_CONFIG,
  candidateDataVersion = EDITORIAL_ANSWERS_VERSION,
  updatedAt = EDITORIAL_REVIEWED_AT,
  questionnaireVersion = QUESTIONNAIRE_VERSION,
  baselineWeight = 2,
} = {}) {
  // On repart du résultat idéologique : mêmes exclusions, mêmes seuils de couverture, mêmes
  // métadonnées de provenance. Seule la pondération diffère.
  const base = computeIdeologicalMatch({
    userAnswers, candidateAnswers, questions, config,
    candidateDataVersion, updatedAt, questionnaireVersion,
  });

  const withPriority = (extra) => ({
    ...base,
    scoreType: 'electoral-priority-weighted',
    priorityContractVersion: PRIORITY_CONTRACT_VERSION,
    themeImportanceSource: themeImportance?.source ?? null,
    ...extra,
  });

  if (base.score == null) return withPriority({ questionsWeighted: 0 });

  const importance = normalizeThemeImportance({ themeImportance });
  const byId = new Map(questions.map(q => [q.id, q]));
  const pairs = comparableAnswers(userAnswers, candidateAnswers, questions, { questionnaireVersion });

  // 1. Poids propre de chaque question : influence × poids éditorial, plafonné.
  const entries = pairs.map(p => {
    const question = byId.get(p.questionId);
    const influenceFactor = voteInfluenceMultiplier(voteInfluence, p.questionId);
    return {
      ...p,
      themeFactor: themeMultiplier(importance, p.theme),
      ownWeight: computeEffectiveQuestionWeight({
        themeFactor: 1,               // appliqué à l'étape 2, thème par thème
        influenceFactor,
        editorialWeight: question?.weight ?? baselineWeight,
        baselineWeight,
      }),
      influenceFactor,
    };
  });

  // 2. Répartition : masse d'un thème = son importance, quel que soit son nombre de questions.
  const weighted = balanceWeightsAcrossThemes(entries);

  const totalWeight = weighted.reduce((s, e) => s + e.weight, 0);
  const questionsWeighted = weighted.filter(e => e.weight > 0).length;

  // Aucun poids : tous les thèmes concernés sont à « pas important », ou toutes les questions
  // comparées sont sans influence. On ne divise pas par zéro et on n'invente pas de score.
  if (!(totalWeight > 0)) {
    return withPriority({ score: null, reason: 'no_weighted_questions', questionsWeighted: 0 });
  }

  const weightedSum = weighted.reduce(
    (s, e) => s + e.weight * (1 - Math.abs(e.user - e.candidate) / 4), 0,
  );
  const raw = (weightedSum / totalWeight) * 100;
  const score = Number.isFinite(raw) ? Math.max(0, Math.min(100, Math.round(raw))) : null;

  const sortedByWeight = [...weighted]
    .filter(e => e.weight > 0)
    .sort((a, b) => (b.weight * Math.abs(b.user - b.candidate)) - (a.weight * Math.abs(a.user - a.candidate)));

  return withPriority({
    score,
    reason: score == null ? 'weighting_failed' : null,
    questionsWeighted,
    themesCovered: [...new Set(weighted.filter(e => e.weight > 0).map(e => e.theme))],
    // Les désaccords qui pèsent RÉELLEMENT dans ce classement — pas les plus grands écarts
    // dans l'absolu, ce qui induirait en erreur sur un sujet déclaré sans importance.
    weightedDisagreements: sortedByWeight.slice(0, 3).map(e => e.questionId),
  });
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
