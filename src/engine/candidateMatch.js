// POLISCOP — Moteur unique de proximité utilisateur ↔ candidat.
//
// Ce module remplace la logique qui vivait dans `src/pages/ElectionDetail.jsx`. Le composant
// React y dupliquait la table de veto (en oubliant GLOBAL) et ignorait complètement
// `themeWeights` : la même personne pouvait obtenir un classement différent selon qu'elle
// regardait la page Profil ou la page Élection. Fonction pure, testable, versionnée.
//
// CONTRAT DE PREUVE (2026-08-09, 3e contre-audit)
// -----------------------------------------------
// Une contribution candidat n'entre dans un score PUBLIC que si elle provient d'une position
// `approved`, sourcée par un document VÉRIFIÉ, codée, relue et datée. Il n'existe plus aucun
// repli :
//   • `candidate.profile` (`legacy-manual-v1`, huit nombres saisis à la main) n'alimente plus
//     le classement public ;
//   • `specificQuestions[].positions` n'est plus utilisé comme position de secours.
// Avec zéro position approuvée, le comportement honnête est : aucun candidat classé.
// Les données legacy restent lisibles pour comparaison interne et migration — jamais pour
// produire un « meilleur match ».
//
// CE QUE LE SCORE EST — et n'est pas
// ----------------------------------
// C'est un INDICE DE PROXIMITÉ éditorial sur 100, pas un pourcentage. Ce n'est ni une
// probabilité de vote, ni une proportion de positions communes. Il combine :
//   • une distance thématique pondérée par les priorités de l'utilisateur,
//   • une amplification non linéaire assumée (exposant 2,4),
//   • des pénalités multiplicatives sur 6 thèmes clivants.
// L'interface doit l'afficher comme « xx/100 » avec sa couverture, jamais comme « xx % »
// sans dénominateur. Voir docs/methodology/matching.md.

import { THEMES_ORDER, THEME_LABELS } from '../data/questions.js';
import { MATCH_CONFIG, computeVeto } from './matchConfig.js';
import { resolveCandidateId } from '../data/candidateRegistry.js';
import { getPositions, getSource } from '../data/candidateProvenance.js';
import { deriveCandidateThemes, CANDIDATE_PROFILE_VERSION } from './candidateProfile.js';
import { buildWeightMap } from './matcher.js';
import { MATCHING_VERSION, CANDIDATE_DATA_RELEASE } from './versions.js';

/**
 * @typedef {Object} MatchResult
 * @property {number}  score              indice de proximité final 0–100
 * @property {number}  globalScore        composante « profil global »
 * @property {number|null} electionScore  composante « questions de l'élection », null si aucune
 * @property {Object}  coverage           { themesKnown, themesTotal, positionsUsed, positionsTotal, answeredSpecific }
 * @property {Array}   vetoTriggered      désaccords majeurs ayant pesé sur le score
 * @property {Array}   agreements         principaux accords (questions spécifiques si disponibles)
 * @property {Array}   disagreements      principaux désaccords
 * @property {Object}  versions           versions du calcul
 */

/**
 * Score de proximité global (profil 8 thèmes contre profil candidat).
 * Gère les thèmes inconnus (`null`, scoring v2) : ils sont exclus de la moyenne au lieu
 * d'être assimilés à 50, qui confondait « je ne sais pas » et « centriste ».
 */
function globalProximity(userThemes, targetThemes, weightMap) {
  let weightedDistanceSum = 0;
  let totalWeight = 0;
  let themesKnown = 0;

  for (const theme of THEMES_ORDER) {
    const u = userThemes?.[theme];
    const t = targetThemes?.[theme];
    if (u == null || t == null) continue;      // thème inconnu → hors calcul
    const weight = weightMap[theme] ?? 1;
    if (!(weight > 0)) continue;               // thème explicitement écarté par l'utilisateur
    themesKnown++;
    weightedDistanceSum += weight * (Math.abs(u - t) / 100);
    totalWeight += weight;
  }

  if (totalWeight === 0) {
    return { score: null, themesKnown, reason: 'no_weighted_theme' };
  }

  // Seuil de couverture minimale — RÉELLEMENT appliqué depuis le 2026-08-09.
  // `MATCH_CONFIG.minKnownThemesForScore` existait mais n'était consulté nulle part :
  // un score pouvait être calculé, affiché et classé à partir d'un seul thème connu.
  if (themesKnown < MATCH_CONFIG.minKnownThemesForScore) {
    return { score: null, themesKnown, reason: 'insufficient_coverage' };
  }

  const meanDistance = weightedDistanceSum / totalWeight;
  const base = Math.pow(1 - meanDistance, MATCH_CONFIG.distanceExponent) * 100;
  const { multiplier, triggered } = computeVeto(userThemes, targetThemes, weightMap);

  return {
    score: Math.max(0, Math.min(100, Math.round(base * multiplier))),
    themesKnown,
    vetoTriggered: triggered,
  };
}

/**
 * Score de proximité sur les questions propres à une élection (les 17 de fr_2027, etc.).
 * Ne compte QUE les questions à la fois répondues par l'utilisateur et documentées pour le
 * candidat : c'est ce compte qui doit être affiché (« 12 positions comparables sur 17 »).
 */
function electionProximity(electionAnswers, questions, usablePositions) {
  // SEULES les positions approuvées comptent. Le repli `q.positions[candidateId]` — des
  // valeurs éditoriales non sourcées — a été supprimé : c'est lui qui produisait un score
  // pour les dix candidats 2027 alors qu'aucune position n'avait été relue.
  const byQuestion = new Map(usablePositions.map(p => [p.questionId, p]));

  const usable = questions.filter(
    q => electionAnswers?.[q.id] != null && byQuestion.has(q.id),
  );
  if (usable.length === 0) return { score: null, positionsUsed: 0, usable: [], byQuestion };

  // stance -2…+2 → échelle Likert 1–5, la même que les réponses de l'utilisateur.
  const likert = p => p.stance + 3;

  const meanDist = usable.reduce(
    (sum, q) => sum + Math.abs(electionAnswers[q.id] - likert(byQuestion.get(q.id))) / 4, 0,
  ) / usable.length;

  const raw = Math.pow(1 - meanDist, MATCH_CONFIG.electionDistanceExponent) * 100;
  return {
    score: Math.max(0, Math.min(100, Math.round(raw))),
    positionsUsed: usable.length,
    usable,
    byQuestion,
  };
}

/**
 * Point d'entrée unique. Toutes les surfaces doivent passer par ici.
 *
 * @param {Object}   p
 * @param {Object}   p.userThemes         scores 0–100 (ou null par thème en scoring v2)
 * @param {Object}   p.candidate          { id, name } — `profile` legacy est IGNORÉ
 * @param {Array}    [p.priorityOrder]
 * @param {Object}   [p.themeWeights]     allocation 100 points ; prioritaire sur priorityOrder
 * @param {Object}   [p.electionAnswers]  { [questionId]: 1–5 }
 * @param {Array}    [p.questions]        specificQuestions de l'élection
 * @param {Array}    [p.approvedPositions] injection pour les tests ; sinon lues du registre
 * @param {Function} [p.sourceIsVerified] injection pour les tests ; sinon `verifiedAt` du document
 * @param {string}   [p.asOf]             date de référence pour les revirements
 * @param {string}   [p.language]
 * @returns {MatchResult}
 */
export function computeCandidateMatch({
  userThemes,
  candidate,
  priorityOrder,
  themeWeights,
  electionAnswers = {},
  questions = [],
  approvedPositions = null,
  sourceIsVerified = null,
  asOf = null,
  language = 'fr',
}) {
  const weightMap = buildWeightMap(priorityOrder, themeWeights);

  // ── Profil candidat DÉRIVÉ des positions approuvées ──────────────────────
  // `candidate.profile` n'est jamais lu ici. C'est le cœur du correctif : les huit nombres
  // `legacy-manual-v1` ne peuvent plus produire de classement public.
  const canonicalId = resolveCandidateId(candidate?.id);
  const positions = approvedPositions ?? (canonicalId ? getPositions(canonicalId) : []);
  const verify = sourceIsVerified ?? (id => Boolean(getSource(id)?.verifiedAt));

  const derived = deriveCandidateThemes(positions, questions, { sourceIsVerified: verify, asOf });

  const versions = {
    matching: MATCHING_VERSION,
    candidateData: CANDIDATE_DATA_RELEASE,
    candidateProfile: derived.version,
  };

  const answeredSpecific = questions.filter(q => electionAnswers?.[q.id] != null).length;

  const baseCoverage = {
    themesKnown: derived.coverage.themesKnown,
    themesTotal: derived.coverage.themesTotal,
    sourcedPositions: derived.coverage.sourcedPositions,
    perTheme: derived.coverage.perTheme,
    positionsTotal: questions.length,
    answeredSpecific,
    positionProvenance: 'sourced-positions',
  };

  // Aucune preuve recevable : le candidat n'est pas comparable. On le dit, on ne le note pas.
  if (derived.usable.length === 0) {
    return {
      score: null,
      reason: 'no_sourced_positions',
      globalScore: null,
      electionScore: null,
      coverage: { ...baseCoverage, positionsUsed: 0, specificIgnored: answeredSpecific > 0 },
      vetoTriggered: [],
      agreements: [],
      disagreements: [],
      breakdownSource: 'none',
      derivedThemes: derived.themes,
      versions,
    };
  }

  const g = globalProximity(userThemes, derived.themes, weightMap);
  const { multiplier: vetoMultiplier } = computeVeto(userThemes, derived.themes, weightMap);
  const e = electionProximity(electionAnswers, questions, derived.usable);

  const coverage = {
    ...baseCoverage,
    positionsUsed: e.positionsUsed,
    specificIgnored: answeredSpecific > 0 && e.positionsUsed === 0,
  };

  // Une couverture thématique insuffisante invalide le résultat entier : on ne se rabat pas
  // sur les seules réponses spécifiques, qui ne seraient pas comparables aux autres scores.
  if (g.score == null) {
    return {
      score: null,
      reason: g.reason ?? 'insufficient_coverage',
      globalScore: null,
      electionScore: null,
      coverage,
      vetoTriggered: g.vetoTriggered ?? [],
      agreements: [],
      disagreements: [],
      breakdownSource: 'none',
      derivedThemes: derived.themes,
      versions,
    };
  }

  const electionScore = e.score == null ? null : Math.round(e.score * vetoMultiplier);
  const score = electionScore == null
    ? g.score
    : Math.round(g.score * MATCH_CONFIG.blend.global + electionScore * MATCH_CONFIG.blend.election);

  return {
    score: Math.max(0, Math.min(100, score)),
    reason: null,
    globalScore: g.score,
    electionScore,
    coverage,
    vetoTriggered: g.vetoTriggered ?? [],
    ...breakdown(e.usable, electionAnswers, e.byQuestion, derived.themes, userThemes, language),
    // Profil thématique DÉRIVÉ des seules positions approuvées. Exposé pour que les surfaces
    // d'affichage (ventilation par thème) cessent de lire `candidate.profile`, qui est
    // `legacy-manual-v1` : huit nombres saisis à la main, sans preuve par position.
    // Un thème sans assez de positions sourcées vaut `null` — à afficher comme inconnu,
    // jamais à remplacer par 50.
    derivedThemes: derived.themes,
    versions,
  };
}

/**
 * Classe une liste de candidats et signale les ex æquo.
 * Ne présente pas un ordre catégorique quand l'écart est sous le seuil versionné.
 */
export function rankCandidates(params, candidates) {
  const all = candidates.map(candidate => ({
    candidate,
    match: computeCandidateMatch({ ...params, candidate }),
  }));

  const results = all
    .filter(r => r.match.score != null)
    .sort((a, b) => b.match.score - a.match.score);

  // Les candidats sans score ne sont pas silencieusement absents : l'appelant reçoit la
  // liste et le motif, pour pouvoir le dire à l'utilisateur.
  const unscored = all.filter(r => r.match.score == null);

  const tooClose = results.length >= 2
    && (results[0].match.score - results[1].match.score) < MATCH_CONFIG.tieThreshold;

  return { results, unscored, tooClose };
}

/**
 * Accords et désaccords, calculés UNIQUEMENT sur des positions approuvées.
 *
 * Le repli « thèmes » de la version précédente comparait le profil legacy du candidat au
 * profil de l'utilisateur : il produisait des affirmations du type « proches sur l'économie »
 * sans qu'aucune position n'ait été relue. Supprimé.
 */
function breakdown(usable, electionAnswers, byQuestion, derivedThemes, userThemes, language) {
  if (!usable?.length) {
    return { agreements: [], disagreements: [], breakdownSource: 'none' };
  }
  const likert = p => p.stance + 3;
  const scored = usable
    .map(q => ({
      q,
      distance: Math.abs(electionAnswers[q.id] - likert(byQuestion.get(q.id))),
      position: byQuestion.get(q.id),
    }))
    .sort((a, b) => a.distance - b.distance);

  return {
    agreements: scored.filter(x => x.distance <= 1).slice(0, 3),
    disagreements: scored.filter(x => x.distance >= 2).slice(-3).reverse(),
    breakdownSource: 'sourced-positions',
  };
}

/** Libellés de thèmes — conservés pour les surfaces qui affichent la couverture par thème. */
export function themeLabel(theme, language = 'fr') {
  return (THEME_LABELS[language] ?? THEME_LABELS.en)[theme] ?? theme;
}
