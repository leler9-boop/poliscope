// POLISCOPE — Matching Engine
// Calculates alignment scores between a user profile and candidates/figures.

import { THEMES_ORDER } from '../data/questions.js';

/**
 * Calculate alignment percentage between user profile and a target profile.
 *
 * Algorithm:
 * 1. For each theme, compute absolute difference (0–100 scale → 0–1 after /100)
 * 2. Apply priority weighting (higher-ranked theme → higher weight)
 * 3. Compute weighted mean distance
 * 4. Alignment = (1 - weighted_mean_distance) × 100
 *
 * This produces genuine spread: opposing candidates score 15–35%,
 * closely aligned ones score 70–95%.
 *
 * @param {Object} userThemes   - { ECONOMY: 0–100, … }
 * @param {Object} targetProfile - same structure as userThemes
 * @param {Array}  priorityOrder - optional array of theme keys in priority order (highest first)
 * @returns {number} alignment 0–100
 */
export function calculateAlignment(userThemes, targetProfile, priorityOrder) {
  // Build weight map from priority order
  const weightMap = {};
  const order = (priorityOrder && priorityOrder.length === THEMES_ORDER.length)
    ? priorityOrder
    : THEMES_ORDER;

  order.forEach((theme, idx) => {
    // Weights: rank 1 = weight 8, rank 8 = weight 1
    weightMap[theme] = THEMES_ORDER.length - idx;
  });

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
  const alignment = Math.round((1 - meanDistance) * 100);
  return Math.max(0, Math.min(100, alignment));
}

/**
 * Rank a list of candidates/figures by alignment with the user profile.
 * @param {Object} userProfile  - { themes: {…}, … }
 * @param {Array}  targets      - array of { id, name, profile: {…}, … }
 * @param {Array}  priorityOrder - optional
 * @returns {Array} sorted targets with .alignment added, highest first
 */
export function rankByAlignment(userProfile, targets, priorityOrder) {
  const results = targets.map(target => ({
    ...target,
    alignment: calculateAlignment(userProfile.themes, target.profile, priorityOrder),
  }));
  return results.sort((a, b) => b.alignment - a.alignment);
}

/**
 * Get a color class for an alignment score.
 */
export function alignmentColorClass(score) {
  if (score >= 75) return 'text-green-600';
  if (score >= 55) return 'text-blue-600';
  if (score >= 35) return 'text-amber-600';
  return 'text-red-600';
}

/**
 * Get bar fill color for an alignment score.
 */
export function alignmentBarColor(score) {
  if (score >= 75) return '#16a34a'; // green-600
  if (score >= 55) return '#2563eb'; // blue-600
  if (score >= 35) return '#d97706'; // amber-600
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
  if (score >= 75) return l.very_high;
  if (score >= 55) return l.high;
  if (score >= 40) return l.moderate;
  if (score >= 25) return l.low;
  return l.very_low;
}
