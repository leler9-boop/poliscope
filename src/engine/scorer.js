// POLISCOPE — Scoring Engine
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
    themeData[theme] = { sum: 0, count: 0 };
  });

  allQuestions.forEach(q => {
    const answer = answers[q.id];
    if (answer == null) return;

    // Normalize answer to 0–1
    const normalized = (answer - 1) / 4;

    // Apply direction: direction=1 means agree shifts score up, -1 means it shifts down
    const contribution = q.direction === 1 ? normalized : 1 - normalized;

    themeData[q.theme].sum += contribution;
    themeData[q.theme].count += 1;
  });

  // Build theme scores (0–100)
  const themes = {};
  THEMES_ORDER.forEach(theme => {
    const d = themeData[theme];
    if (d.count === 0) {
      themes[theme] = 50; // default to center when no data
    } else {
      themes[theme] = Math.round((d.sum / d.count) * 100);
    }
  });

  // Derive ideological axes
  const axes = calculateAxes(themes);

  // Confidence based on number of answered questions
  const answeredCount = Object.keys(answers).length;
  const totalQuestions = allQuestions.length;
  const coverage = answeredCount / totalQuestions;
  let confidence;
  if (coverage < 0.2)      confidence = 'low';
  else if (coverage < 0.55) confidence = 'medium';
  else                      confidence = 'high';

  return { themes, axes, confidence, answeredCount, totalQuestions };
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
    low: {
      en: { label: 'Low confidence', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200',
            message: 'Your profile gives a rough orientation. Answer more questions for a more accurate picture.' },
      fr: { label: 'Faible fiabilité', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200',
            message: 'Votre profil donne une orientation générale. Répondez à plus de questions pour une image plus précise.' },
    },
    medium: {
      en: { label: 'Medium confidence', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200',
            message: 'Your profile is reasonably accurate. More questions will refine it further.' },
      fr: { label: 'Fiabilité moyenne', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200',
            message: 'Votre profil est assez précis. Davantage de questions le raffineront encore.' },
    },
    high: {
      en: { label: 'High confidence', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200',
            message: 'Your profile is highly accurate based on a comprehensive set of answers.' },
      fr: { label: 'Haute fiabilité', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200',
            message: 'Votre profil est très précis, basé sur un ensemble complet de réponses.' },
    },
  };
  return meta[confidence]?.[lang] ?? meta.low[lang];
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
