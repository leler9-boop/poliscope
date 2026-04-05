// POLISCOP — Scoring Engine
// Converts question answers into a multi-dimensional political profile.

import { THEMES, THEMES_ORDER, questions as allQuestions } from '../data/questions.js';

/**
 * Calculate theme scores from user answers.
 * @param {Object} answers - { questionId: answerValue (1–5) }
 * @returns {Object} { themes: { ECONOMY: 0–100, … }, confidence, answeredCount }
 */
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

  // Build theme scores (0–100) using weighted average
  const themes = {};
  THEMES_ORDER.forEach(theme => {
    const d = themeData[theme];
    if (d.totalWeight === 0) {
      themes[theme] = 50; // default to center when no data
    } else {
      themes[theme] = Math.round((d.weightedSum / d.totalWeight) * 100);
    }
  });

  // Derive ideological axes
  const axes = calculateAxes(themes);

  // Confidence based on number of answered questions
  const answeredCount = Object.keys(answers).length;
  const totalQuestions = allQuestions.length;
  const confidenceScore = Math.min(100, Math.round(answeredCount / 2));
  let confidence;
  if (answeredCount < 10)       confidence = 'very_low';
  else if (answeredCount < 30)  confidence = 'low';
  else if (answeredCount < 80)  confidence = 'medium';
  else if (answeredCount < 200) confidence = 'high';
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
  const institutional = Math.round(
    themes.DEMOCRACY * 0.6 +
    (100 - themes.SECURITY) * 0.25 +
    (100 - themes.GLOBAL) * 0.15
  );

  // International axis: 0 = nationalist/sovereignist, 100 = globalist/internationalist
  const international = Math.round(
    (100 - themes.GLOBAL) * 0.55 +
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
      en: { label: 'Very low confidence', color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-200',
            message: 'Your profile is still very approximate. Answer more questions to start building an accurate picture.' },
      fr: { label: 'Très faible fiabilité', color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-200',
            message: 'Votre profil est encore très approximatif. Répondez à plus de questions pour commencer à construire une image précise.' },
    },
    low: {
      en: { label: 'Low confidence', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200',
            message: 'Your profile is still approximate. Answer more questions to improve precision.' },
      fr: { label: 'Faible fiabilité', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200',
            message: 'Votre profil est encore approximatif. Répondez à plus de questions pour améliorer la précision.' },
    },
    medium: {
      en: { label: 'Medium confidence', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200',
            message: 'Your profile is reasonably accurate. More questions will refine it further.' },
      fr: { label: 'Fiabilité moyenne', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200',
            message: 'Votre profil est assez précis. Davantage de questions le raffineront encore.' },
    },
    high: {
      en: { label: 'High confidence', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200',
            message: 'Your profile is highly accurate and well-defined.' },
      fr: { label: 'Haute fiabilité', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200',
            message: 'Votre profil est très précis et bien défini.' },
    },
    very_high: {
      en: { label: 'Very high confidence', color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200',
            message: 'Your profile is extremely accurate based on a comprehensive set of answers.' },
      fr: { label: 'Très haute fiabilité', color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200',
            message: 'Votre profil est extrêmement précis, basé sur un ensemble complet de réponses.' },
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
