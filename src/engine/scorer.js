// POLISCOP — Scoring Engine
// Converts question answers into a multi-dimensional political profile.

import { THEMES, THEMES_ORDER, questions as allQuestions } from '../data/questions.js';

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
    if (answer == null) return;

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
  const answeredCount = Object.keys(answers).length;
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

  return { themes, axes, confidence, confidenceScore, answeredCount, totalQuestions };
}

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
      en: { label: 'Robust profile', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200',
            message: 'Your profile is solid and well-differentiated across all themes.' },
      fr: { label: 'Profil robuste', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200',
            message: 'Votre profil est solide et bien différencié sur l\'ensemble des thèmes.' },
    },
    very_high: {
      en: { label: 'Highly reliable profile', color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200',
            message: 'Your profile is built on a comprehensive set of answers across all political themes.' },
      fr: { label: 'Profil très fiable', color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200',
            message: 'Votre profil repose sur un ensemble complet de réponses couvrant tous les grands thèmes politiques.' },
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
