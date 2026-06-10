/**
 * archetypeEngine.js
 * Given a user's theme scores, returns the best-matching archetype
 * and a ranked list of all archetypes by alignment.
 *
 * Reuses rankByAlignment from matcher.js — same interface, no duplication.
 */

import { archetypes } from '../data/archetypes.js';
import { rankByAlignment } from './matcher.js';

/**
 * Get the user's top archetype match.
 *
 * @param {Object} themes   — { ECONOMY: 0-100, SOCIAL: 0-100, … }
 * @param {Array}  [priorityOrder] — optional theme priority list (from store)
 * @returns {Object}  archetype object with `.alignment` injected
 */
export function getArchetype(themes, priorityOrder = null) {
  const ranked = rankArchetypes(themes, priorityOrder);
  return ranked[0] ?? null;
}

/**
 * Rank all archetypes by alignment score (descending).
 *
 * @param {Object} themes
 * @param {Array}  [priorityOrder]
 * @returns {Array} archetypes sorted best-first, each with `.alignment`
 */
export function rankArchetypes(themes, priorityOrder = null) {
  // rankByAlignment expects { themes: { … } } as the user profile
  const userProfile = { themes };
  return rankByAlignment(userProfile, archetypes, priorityOrder ?? [], null);
}

/**
 * Get top N distinguishing trait strings for the matched archetype.
 *
 * @param {Object} archetype  — result from getArchetype()
 * @param {string} language   — 'fr' | 'en'
 * @param {number} [n=3]
 * @returns {string[]}
 */
export function getTopTraits(archetype, language = 'fr', n = 3) {
  if (!archetype?.traits) return [];
  const traits = archetype.traits[language] ?? archetype.traits.fr ?? [];
  return traits.slice(0, n);
}
