// POLISCOP — Matching Engine
// Calculates alignment scores between a user profile and candidates/figures.

import { THEMES_ORDER, THEME_LABELS } from '../data/questions.js';

/**
 * Calculate alignment percentage between user profile and a target profile.
 *
 * Algorithm:
 * 1. For each theme, compute absolute difference (0–100 scale → 0–1 after /100)
 * 2. Apply priority weighting (higher-ranked theme → higher weight)
 * 3. Compute weighted mean distance
 * 4. Alignment = (1 - weighted_mean_distance) × 100
 *
 * This produces a sharp spread: opposing candidates score 10–25%,
 * closely aligned ones score 80–95%.
 *
 * @param {Object} userThemes   - { ECONOMY: 0–100, … }
 * @param {Object} targetProfile - same structure as userThemes
 * @param {Array}  priorityOrder - optional array of theme keys in priority order (highest first)
 * @returns {number} alignment 0–100
 */
export function calculateAlignment(userThemes, targetProfile, priorityOrder, themeWeights) {
  // Build weight map — explicit themeWeights take priority over priorityOrder
  const weightMap = {};

  if (themeWeights && THEMES_ORDER.every(t => themeWeights[t] != null)) {
    // Use user-defined 100-point allocation directly as weights
    THEMES_ORDER.forEach(theme => {
      weightMap[theme] = themeWeights[theme];
    });
  } else {
    const order = (priorityOrder && priorityOrder.length === THEMES_ORDER.length)
      ? priorityOrder
      : THEMES_ORDER;
    order.forEach((theme, idx) => {
      // Weights: rank 1 = weight 8, rank 8 = weight 1
      weightMap[theme] = THEMES_ORDER.length - idx;
    });
  }

  let weightedDistanceSum = 0;
  let totalWeight = 0;

  THEMES_ORDER.forEach(theme => {
    const userVal  = userThemes[theme]   ?? 50;
    const targVal  = targetProfile[theme] ?? 50;
    const distance = Math.abs(userVal - targVal) / 100; // 0–1
    const weight   = weightMap[theme] ?? 1;

    weightedDistanceSum += weight * distance;
    totalWeight += weight;
  });

  const meanDistance = weightedDistanceSum / totalWeight; // 0–1

  // Power 2.8: produces a sharper, more realistic spread.
  // d=0.05 → 86%  (very similar)
  // d=0.15 → 64%  (moderate overlap)
  // d=0.25 → 44%  (clear disagreement)
  // d=0.35 → 28%  (weak alignment)
  // d=0.50 → 14%  (opposing)
  const baseAlignment = Math.round(Math.pow(1 - meanDistance, 2.8) * 100);

  // Multiplicative veto: on 4 clivant themes, a large distance crushes the score.
  // This models the "dealbreaker" effect — e.g. a user strongly opposed to immigration
  // restriction will never align with a far-right candidate, even if they agree on economy.
  // Thresholds set at 50-55 to avoid crushing moderate profiles (< 20% for too many).
  const VETO_THEMES = {
    IMMIGRATION:     { threshold: 30, penalty: 0.62 },
    ECONOMY:         { threshold: 30, penalty: 0.72 },
    SOCIAL:          { threshold: 42, penalty: 0.78 },
    SECURITY:        { threshold: 42, penalty: 0.78 },
    PUBLIC_SERVICES: { threshold: 42, penalty: 0.82 },
  };
  let vetoMultiplier = 1.0;
  Object.entries(VETO_THEMES).forEach(([theme, config]) => {
    const dist = Math.abs((userThemes[theme] ?? 50) - (targetProfile[theme] ?? 50));
    if (dist > config.threshold) vetoMultiplier *= config.penalty;
  });

  const alignment = Math.round(baseAlignment * vetoMultiplier);
  return Math.max(0, Math.min(100, alignment));
}

/**
 * Rank a list of candidates/figures by alignment with the user profile.
 * @param {Object} userProfile  - { themes: {…}, … }
 * @param {Array}  targets      - array of { id, name, profile: {…}, … }
 * @param {Array}  priorityOrder - optional
 * @returns {Array} sorted targets with .alignment added, highest first
 */
export function rankByAlignment(userProfile, targets, priorityOrder, themeWeights) {
  const results = targets.map(target => ({
    ...target,
    alignment: calculateAlignment(userProfile.themes, target.profile, priorityOrder, themeWeights),
  }));
  return results.sort((a, b) => b.alignment - a.alignment);
}

/**
 * Generate a personalised "why you match" sentence for a given figure.
 * Finds the 2 themes where user and figure are most aligned and names them.
 */
export function generateWhyMatch(userThemes, figure, lang = 'en') {
  const themeDistances = THEMES_ORDER.map(theme => ({
    theme,
    distance: Math.abs((userThemes[theme] ?? 50) - (figure.profile[theme] ?? 50)),
  }));

  const top2 = themeDistances
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 2)
    .map(t => (THEME_LABELS[lang]?.[t.theme] ?? t.theme).toLowerCase());

  const themeStr = top2.join(lang === 'fr' ? ' et ' : ' and ');
  return lang === 'fr'
    ? `Votre profil se rapproche le plus de ${figure.name} sur les thèmes : ${themeStr}.`
    : `Your profile aligns most closely with ${figure.name} on ${themeStr}.`;
}

/**
 * Get a color class for an alignment score.
 */
export function alignmentColorClass(score) {
  if (score >= 70) return 'text-green-600';
  if (score >= 50) return 'text-blue-600';
  if (score >= 30) return 'text-amber-600';
  return 'text-red-600';
}

/**
 * Get bar fill color for an alignment score.
 */
export function alignmentBarColor(score) {
  if (score >= 70) return '#16a34a'; // green-600
  if (score >= 50) return '#2563eb'; // blue-600
  if (score >= 30) return '#d97706'; // amber-600
  return '#dc2626';                  // red-600
}

/**
 * Get a descriptive label for alignment score.
 */
export function alignmentLabel(score, lang = 'en') {
  const labels = {
    en: {
      very_high: 'Very strong alignment',
      high: 'Strong alignment',
      moderate: 'Moderate alignment',
      low: 'Weak alignment',
      very_low: 'Very weak alignment',
    },
    fr: {
      very_high: 'Très forte compatibilité',
      high: 'Forte compatibilité',
      moderate: 'Compatibilité modérée',
      low: 'Faible compatibilité',
      very_low: 'Très faible compatibilité',
    },
  };
  const l = labels[lang] ?? labels.en;
  if (score >= 70) return l.very_high;
  if (score >= 50) return l.high;
  if (score >= 35) return l.moderate;
  if (score >= 20) return l.low;
  return l.very_low;
}
