// POLISCOP — Matching Engine
// Calculates alignment scores between a user profile and candidates/figures.

import { THEMES_ORDER, THEME_LABELS } from '../data/questions.js';
import { MATCH_CONFIG, computeVeto } from './matchConfig.js';

/**
 * Construit la carte de poids par thème à partir des préférences utilisateur.
 * Règle de priorité, unique et explicite : une allocation `themeWeights` complète gagne
 * toujours ; sinon on retombe sur l'ordre de priorité (rang 1 = poids 8, rang 8 = poids 1) ;
 * sinon sur l'ordre de déclaration des thèmes.
 *
 * Exportée pour que TOUTES les surfaces (Profil, Élection, archétypes) utilisent la même —
 * l'audit avait relevé que la page Élection ignorait purement et simplement `themeWeights`.
 */
export function buildWeightMap(priorityOrder, themeWeights) {
  const weightMap = {};

  if (themeWeights && THEMES_ORDER.every(t => themeWeights[t] != null)) {
    THEMES_ORDER.forEach(theme => { weightMap[theme] = themeWeights[theme]; });
    // Garde-fou : une allocation entièrement nulle ne doit pas produire un résultat au hasard.
    if (THEMES_ORDER.every(t => !(weightMap[t] > 0))) {
      THEMES_ORDER.forEach(theme => { weightMap[theme] = 1; });
    }
    return weightMap;
  }

  const order = (priorityOrder && priorityOrder.length === THEMES_ORDER.length)
    ? priorityOrder
    : THEMES_ORDER;
  order.forEach((theme, idx) => { weightMap[theme] = THEMES_ORDER.length - idx; });
  return weightMap;
}

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
  const weightMap = buildWeightMap(priorityOrder, themeWeights);

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

  const meanDistance = totalWeight > 0 ? weightedDistanceSum / totalWeight : 0.5; // 0–1

  // Power 2.4: balanced spread — generous enough for moderate users, still punishing for opposites.
  // d=0.05 → 89%  (very similar)
  // d=0.15 → 71%  (good overlap)
  // d=0.25 → 53%  (moderate disagreement)
  // d=0.35 → 37%  (weak alignment)
  // d=0.50 → 19%  (opposing)
  // POL-AUDIT-019: kept unrounded here — rounding once, after the veto below, avoids a
  // rare double-rounding artifact that could flip a ranking by one point (~0.04% of pairs).
  const baseAlignment = Math.pow(1 - meanDistance, MATCH_CONFIG.distanceExponent) * 100;

  // Veto multiplicatif : sur 6 thèmes clivants, un écart important écrase le score.
  // Les seuils, pénalités et la rampe vivent désormais dans `matchConfig.js` — un seul
  // endroit, consommé aussi par la page Élection (qui en avait sa propre copie, sans GLOBAL).
  const { multiplier: vetoMultiplier } = computeVeto(
    // `?? 50` : le moteur v1 traite un thème absent comme centriste. Le v2 (thèmes `null`)
    // passe par `candidateMatch.js`, qui laisse `computeVeto` ignorer les thèmes inconnus.
    Object.fromEntries(THEMES_ORDER.map(t => [t, userThemes[t] ?? 50])),
    Object.fromEntries(THEMES_ORDER.map(t => [t, targetProfile[t] ?? 50])),
    weightMap,
  );

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
export function rankByAlignment(userProfile, targets, priorityOrder, themeWeights, options = {}) {
  const { hideVariants = false } = options;
  const pool = hideVariants ? targets.filter(t => !t.variantOf) : targets;
  const results = pool.map(target => ({
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
      very_high: 'Very strong proximity',
      high: 'Strong proximity',
      moderate: 'Moderate proximity',
      low: 'Weak proximity',
      very_low: 'Very weak proximity',
    },
    fr: {
      // Vocabulaire de PROXIMITÉ : le nombre mesure une distance entre positions. Il ne
      // porte aucun jugement sur l'adéquation d'un vote à vos intérêts — voir le garde-fou
      // de terminologie dans tests/data/ui-terminology.test.mjs.
      very_high: 'Très forte proximité',
      high: 'Forte proximité',
      moderate: 'Proximité modérée',
      low: 'Faible proximité',
      very_low: 'Très faible proximité',
    },
  };
  const l = labels[lang] ?? labels.en;
  if (score >= 70) return l.very_high;
  if (score >= 50) return l.high;
  if (score >= 35) return l.moderate;
  if (score >= 20) return l.low;
  return l.very_low;
}
