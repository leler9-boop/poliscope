/**
 * Estimated percentage of the French population sharing each archetype.
 * Based on approximate French electoral distribution (2022–2027 surveys).
 * Used for share card messaging — keeps users curious & encourages sharing.
 */

export const ARCHETYPE_RARITY = {
  social_democrate:       18,
  progressiste_europeen:  12,
  centriste_republicain:  11,
  republicain_conservateur: 10,
  reformiste_liberal:      9,
  ecologiste_engage:       8,
  liberal_progressiste:    7,
  gaulliste_social:        6,
  humaniste_gauche:        5,
  national_populiste:      5,
  ecologiste_pragmatique:  4,
  insoumis:                3,
  liberal_conservateur:    2.5,
  patriote_social:         2,
  souverainiste_gauche:    1.5,
  democrate_participatif:  1.5,
  social_patriote:         1,
  communiste_republicain:  1,
};

/**
 * Returns a share-card rarity line for the given archetype ID.
 * @param {string} archetypeId
 * @param {'fr'|'en'} lang
 * @returns {string}
 */
export function getRarityLine(archetypeId, lang = 'fr') {
  const pct = ARCHETYPE_RARITY[archetypeId];
  if (pct == null) return '';

  if (pct <= 2) {
    return lang === 'fr'
      ? `Profil ultra-rare · Seulement ${pct}% des Français`
      : `Ultra-rare profile · Only ${pct}% of the French`;
  }
  if (pct <= 5) {
    return lang === 'fr'
      ? `Profil rare · ${pct}% de la population`
      : `Rare profile · ${pct}% of the population`;
  }
  if (pct <= 10) {
    return lang === 'fr'
      ? `${pct}% des Français partagent ce profil`
      : `${pct}% of the French share this profile`;
  }
  return lang === 'fr'
    ? `L'un des profils les plus répandus · ${pct}%`
    : `One of the most common profiles · ${pct}%`;
}
