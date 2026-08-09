// POLISCOP — Scoring Engine
// Converts question answers into a multi-dimensional political profile.

import { THEMES, THEMES_ORDER, questions as allQuestions } from '../data/questions.js';
import { SCORING_VERSION_V1, SCORING_VERSION_V2, AXIS_VERSION, currentVersions } from './versions.js';

/**
 * Valeur de réponse réservée à « Je ne sais pas / Sans opinion ».
 *
 * POURQUOI : le bouton « neutre » (3) était la seule façon de ne pas se prononcer, et il
 * était compté comme une position centrale. Une absence d'opinion et un centrisme assumé
 * produisaient donc exactement le même profil. Cette valeur sort du domaine 1–5 pour être
 * impossible à confondre : elle n'entre dans aucune moyenne, elle réduit la couverture.
 */
export const NO_OPINION = 'no_opinion';

/** Une réponse est-elle exploitable pour le calcul ? */
export function isScorable(answer) {
  return typeof answer === 'number' && answer >= 1 && answer <= 5;
}

/**
 * Calculate theme scores from user answers.
 * @param {Object} answers - { questionId: answerValue (1–5) }
 * @returns {Object} { themes: { ECONOMY: 0–100, … }, confidence, answeredCount }
 */
/**
 * Push scores away from 50 to produce more extreme, differentiated profiles.
 * 60 → ~65, 70 → ~77, 80 → ~86, 90 → ~93
 * Center (50) stays at 50; edges stay near 0/100.
 */
function stretchScore(score) {
  const centered = score - 50;
  if (centered === 0) return 50;
  const sign = centered > 0 ? 1 : -1;
  return Math.round(50 + sign * Math.pow(Math.abs(centered) / 50, 0.75) * 50);
}

export function calculateProfile(answers) {
  const themeData = {};
  THEMES_ORDER.forEach(theme => {
    themeData[theme] = { weightedSum: 0, totalWeight: 0 };
  });

  allQuestions.forEach(q => {
    const answer = answers[q.id];
    if (!isScorable(answer)) return; // ignore null, undefined et NO_OPINION

    // Normalize answer to 0–1
    const normalized = (answer - 1) / 4;

    // Apply direction: direction=1 means agree shifts score up, -1 means it shifts down
    const contribution = q.direction === 1 ? normalized : 1 - normalized;

    // Weight by question importance (core=5, refinement=3/2, deep=1)
    const w = q.weight ?? 1;
    themeData[q.theme].weightedSum += contribution * w;
    themeData[q.theme].totalWeight += w;
  });

  // Build theme scores (0–100) using weighted average, then stretch away from center
  // to produce more differentiated profiles
  const themes = {};
  THEMES_ORDER.forEach(theme => {
    const d = themeData[theme];
    if (d.totalWeight === 0) {
      themes[theme] = 50; // default to center when no data
    } else {
      const raw = Math.round((d.weightedSum / d.totalWeight) * 100);
      themes[theme] = stretchScore(raw);
    }
  });

  // Derive ideological axes
  const axes = calculateAxes(themes);

  // Confidence based on number of answered questions
  // Ne comptabilise que les réponses exploitables : un « sans opinion » ne doit pas
  // gonfler l'indicateur de couverture.
  const answeredCount = Object.keys(answers).filter(id => isScorable(answers[id])).length;
  const totalQuestions = allQuestions.length;
  // Confidence calibrated against the quiz's actual max (64 questions for deep/Approfondi mode).
  //   discovery mode (16q) → 25% → 'medium'  ("Première estimation")
  //   standard mode  (32q) → 50% → 'high'    ("Profil robuste")
  //   deep mode      (64q) → 100% → 'very_high' ("Profil très fiable")
  // Profile.jsx confBarColor thresholds (≥80 emerald, ≥60 green, ≥40 blue) remain percentage-based
  // and automatically produce the right colour for each mode.
  const confidenceScore = Math.min(100, Math.round((answeredCount / 64) * 100));
  let confidence;
  if (answeredCount < 8)        confidence = 'very_low';
  else if (answeredCount < 16)  confidence = 'low';
  else if (answeredCount < 32)  confidence = 'medium';
  else if (answeredCount < 64)  confidence = 'high';
  else                          confidence = 'very_high';

  return {
    themes, axes, confidence, confidenceScore, answeredCount, totalQuestions,
    versions: currentVersions({ scoring: SCORING_VERSION_V1 }),
  };
}

// ─── Scoring v2 ──────────────────────────────────────────────────────────────
//
// Différences assumées avec le v1, toutes documentées dans docs/methodology/scoring-v2.md :
//   1. un thème sans réponse exploitable vaut `null`, pas 50 — « inconnu » ≠ « centriste » ;
//   2. pas d'étirement non linéaire : le score reste la moyenne pondérée des réponses ;
//   3. la couverture est calculée par thème et renvoyée à côté du score, jamais fondue dedans ;
//   4. aucune incertitude numérique n'est inventée — `uncertainty` reste `null` tant qu'aucune
//      validation empirique ne permet de la calculer (voir validation-roadmap.md).
//
// Le v1 reste le comportement par défaut de l'application : basculer les utilisateurs sur le
// v2 change leurs résultats et doit être une décision produit explicite, pas un effet de bord.

/**
 * @param {Object} answers  { [questionId]: 1–5 | NO_OPINION }
 * @param {Object} [options]
 * @param {string[]} [options.askedQuestionIds]
 *   Identifiants des questions RÉELLEMENT posées durant la passation (la file). Sans eux, la
 *   couverture ne peut pas distinguer « non posée » de « posée sans réponse » : la première
 *   version comptait `asked` sur toute la banque, si bien qu'un mode Découverte (2 questions
 *   par thème) affichait une couverture calculée sur 16 — un rapport faux d'un facteur 8.
 *   Quand l'information est absente, `inQueue` vaut `null` plutôt qu'un nombre inventé.
 * @returns {{themes: Object, axes: Object, coverage: Object, uncertainty: null, versions: Object}}
 */
export function calculateProfileV2(answers, { askedQuestionIds = null } = {}) {
  const asked = askedQuestionIds ? new Set(askedQuestionIds) : null;

  const acc = {};
  THEMES_ORDER.forEach(theme => {
    acc[theme] = { weightedSum: 0, totalWeight: 0, answered: 0, noOpinion: 0, inQueue: 0, inBank: 0 };
  });

  allQuestions.forEach(q => {
    const bucket = acc[q.theme];
    if (!bucket) return;

    // `inBank` : taille de la banque pour ce thème — un plafond théorique, pas une couverture.
    bucket.inBank++;

    const wasAsked = asked ? asked.has(q.id) : answers[q.id] !== undefined;
    if (wasAsked) bucket.inQueue++;

    const answer = answers[q.id];
    if (answer === NO_OPINION) { bucket.noOpinion++; return; }
    if (!isScorable(answer)) return;

    const normalized = (answer - 1) / 4;
    const contribution = q.direction === 1 ? normalized : 1 - normalized;
    const w = q.weight ?? 1;
    bucket.weightedSum += contribution * w;
    bucket.totalWeight += w;
    bucket.answered++;
  });

  const themes = {};
  const perTheme = {};
  THEMES_ORDER.forEach(theme => {
    const d = acc[theme];
    themes[theme] = d.totalWeight === 0
      ? null                                   // ← v1 mettait 50 ici
      : Math.round((d.weightedSum / d.totalWeight) * 100);
    perTheme[theme] = {
      /** Réponses exploitables 1–5. */
      answered: d.answered,
      /** Questions explicitement passées (« sans opinion »). */
      noOpinion: d.noOpinion,
      /** Questions réellement posées dans cette passation. `null` si la file est inconnue. */
      inQueue: askedQuestionIds ? d.inQueue : null,
      /** Questions existant dans la banque pour ce thème — plafond, PAS une couverture. */
      inBank: d.inBank,
      /** Posées mais restées sans réponse ni « sans opinion ». `null` si la file est inconnue. */
      unanswered: askedQuestionIds ? Math.max(0, d.inQueue - d.answered - d.noOpinion) : null,
    };
  });

  const known = THEMES_ORDER.filter(t => themes[t] != null);
  const answeredCount = THEMES_ORDER.reduce((n, t) => n + perTheme[t].answered, 0);
  const noOpinionCount = THEMES_ORDER.reduce((n, t) => n + perTheme[t].noOpinion, 0);
  const askedCount = askedQuestionIds
    ? THEMES_ORDER.reduce((n, t) => n + perTheme[t].inQueue, 0)
    : null;

  return {
    themes,
    axes: calculateAxesV2(themes),
    coverage: {
      themesKnown: known.length,
      themesTotal: THEMES_ORDER.length,
      answeredCount,
      noOpinionCount,
      /** Nombre de questions posées ; `null` si la file n'a pas été fournie. */
      askedCount,
      /** La couverture est-elle calculée sur la file réelle ou déduite des seules réponses ? */
      basedOnQueue: Boolean(askedQuestionIds),
      perTheme,
    },
    // Volontairement null : afficher un intervalle non estimé serait une fausse précision.
    uncertainty: null,
    versions: currentVersions({ scoring: SCORING_VERSION_V2 }),
  };
}

/**
 * Axes v2 : mêmes formules éditoriales que le v1 (axisVersion inchangée), mais un axe n'est
 * calculé que si tous ses composants sont connus. Un axe partiellement inconnu vaut `null`
 * plutôt qu'une valeur reposant implicitement sur des 50 fabriqués.
 */
export function calculateAxesV2(themes) {
  const need = (...keys) => keys.every(k => themes[k] != null);
  const inv = v => 100 - v;
  return {
    economic: need('ECONOMY', 'PUBLIC_SERVICES')
      ? Math.round(themes.ECONOMY * 0.5 + inv(themes.PUBLIC_SERVICES) * 0.5) : null,
    social: need('SOCIAL', 'IMMIGRATION', 'SECURITY')
      ? Math.round(themes.SOCIAL * 0.45 + inv(themes.IMMIGRATION) * 0.3 + inv(themes.SECURITY) * 0.25) : null,
    institutional: need('DEMOCRACY', 'SECURITY', 'GLOBAL')
      ? Math.round(themes.DEMOCRACY * 0.6 + inv(themes.SECURITY) * 0.25 + themes.GLOBAL * 0.15) : null,
    international: need('GLOBAL', 'IMMIGRATION', 'DEMOCRACY')
      ? Math.round(themes.GLOBAL * 0.55 + inv(themes.IMMIGRATION) * 0.25 + themes.DEMOCRACY * 0.2) : null,
  };
}

/**
 * Recalcule les axes à partir de scores thématiques quelconques.
 *
 * L'audit relevait qu'un ajustement manuel du profil modifiait les thèmes et le matching,
 * mais laissait les 4 axes affichés à leur valeur d'avant ajustement. Toute surface qui
 * modifie des thèmes DOIT repasser par cette fonction — c'est la même que celle utilisée à
 * la création du profil, ce qui rend l'incohérence impossible.
 */
export function recalculateAxes(themes) {
  return themes && THEMES_ORDER.some(t => themes[t] == null)
    ? calculateAxesV2(themes)
    : calculateAxes(themes);
}

export { AXIS_VERSION };

/**
 * Derive 4 ideological axes from theme scores.
 * Each axis is a value 0–100.
 */
function calculateAxes(themes) {
  // Economic axis: 0 = far left, 100 = far right
  // Right indicators: free market (ECONOMY high), minimal state (PUBLIC_SERVICES low)
  const economic = Math.round(
    themes.ECONOMY * 0.5 + (100 - themes.PUBLIC_SERVICES) * 0.5
  );

  // Social axis: 0 = very conservative, 100 = very progressive
  // Progressive indicators: social progressivism, pro-immigration, civil liberties
  const social = Math.round(
    themes.SOCIAL * 0.45 +
    (100 - themes.IMMIGRATION) * 0.3 +
    (100 - themes.SECURITY) * 0.25
  );

  // Institutional axis: 0 = authoritarian/populist, 100 = democratic/rule of law
  // GLOBAL: high = pro-mondialisation → contributes positively to institutional openness
  const institutional = Math.round(
    themes.DEMOCRACY * 0.6 +
    (100 - themes.SECURITY) * 0.25 +
    themes.GLOBAL * 0.15
  );

  // International axis: 0 = nationalist/sovereignist, 100 = globalist/internationalist
  // GLOBAL: high = pro-mondialisation → contributes positively to international axis
  const international = Math.round(
    themes.GLOBAL * 0.55 +
    (100 - themes.IMMIGRATION) * 0.25 +
    themes.DEMOCRACY * 0.2
  );

  return { economic, social, institutional, international };
}

/**
 * Get profile confidence metadata.
 */
export function getConfidenceMeta(confidence, lang = 'en') {
  const meta = {
    very_low: {
      en: { label: 'Profile in progress', color: 'text-gray-500', bg: 'bg-gray-50', border: 'border-gray-200',
            message: 'Answer a few more questions to generate your first profile.' },
      fr: { label: 'Profil en cours', color: 'text-gray-500', bg: 'bg-gray-50', border: 'border-gray-200',
            message: 'Répondez à quelques questions supplémentaires pour générer votre premier profil.' },
    },
    low: {
      en: { label: 'Early signals', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200',
            message: 'A first orientation is visible. Complete the Discovery test for a more reliable result.' },
      fr: { label: 'Premiers signaux', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200',
            message: 'Une première orientation est visible. Complétez le test Découverte pour un résultat plus fiable.' },
    },
    medium: {
      en: { label: 'First estimation', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200',
            message: 'Your profile captures your main positions. The Standard test will sharpen it further.' },
      fr: { label: 'Première estimation', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200',
            message: 'Votre profil capture vos grandes positions. Le test Standard le précisera davantage.' },
    },
    high: {
      en: { label: 'Good coverage', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200',
            message: 'Enough answers to differentiate every theme. Coverage describes detail, not scientific reliability.' },
      fr: { label: 'Bonne couverture', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200',
            message: 'Assez de réponses pour différencier chaque thème. La couverture décrit le niveau de détail, pas une fiabilité scientifique.' },
    },
    very_high: {
      en: { label: 'Full coverage', color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200',
            message: 'Every theme is covered by the full set of questions. This measures detail, not validated accuracy.' },
      fr: { label: 'Couverture complète', color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200',
            message: 'Tous les thèmes sont couverts par l\'ensemble des questions. Cela mesure le niveau de détail, pas une exactitude validée.' },
    },
  };
  return meta[confidence]?.[lang] ?? meta.very_low[lang];
}

/**
 * Get axes labels.
 */
export const AXES_LABELS = {
  economic: {
    en: { left: 'Left', right: 'Right', label: 'Economic axis' },
    fr: { left: 'Gauche', right: 'Droite', label: 'Axe économique' },
  },
  social: {
    en: { left: 'Conservative', right: 'Progressive', label: 'Social axis' },
    fr: { left: 'Conservateur', right: 'Progressiste', label: 'Axe social' },
  },
  institutional: {
    en: { left: 'Authoritarian', right: 'Democratic', label: 'Institutional axis' },
    fr: { left: 'Autoritaire', right: 'Démocratique', label: 'Axe institutionnel' },
  },
  international: {
    en: { left: 'Nationalist', right: 'Globalist', label: 'International axis' },
    fr: { left: 'Nationaliste', right: 'Mondialiste', label: 'Axe international' },
  },
};
