// POLISCOP — Sélection contrôlée de la version de scoring.
//
// Le v2 est prêt (thèmes `null` au lieu de 50, pas d'étirement, couverture séparée) mais
// l'activer change TOUS les scores existants. Ce module rend la bascule explicite, réversible
// et observable — au lieu d'un remplacement silencieux.
//
// TROIS GARANTIES
// ---------------
// 1. Un profil déjà calculé garde sa version. On ne recalcule jamais un ancien résultat en v2
//    sans que l'utilisateur le sache : `profile.versions.scoring` fait foi à la relecture.
// 2. La version active est décidée par un drapeau, pas par le code appelant.
// 3. `compareScoringVersions()` permet de mesurer l'écart AVANT de basculer qui que ce soit.

import { calculateProfile, calculateProfileV2 } from './scorer.js';
import { SCORING_VERSION_V1, SCORING_VERSION_V2 } from './versions.js';
import { THEMES_ORDER } from '../data/questions.js';

/**
 * Drapeau d'activation.
 *
 * `VITE_SCORING_VERSION=v2` bascule les NOUVEAUX profils sur le v2. Absent ⇒ v1.
 * Passer par une variable d'environnement plutôt qu'une constante permet d'activer le v2
 * sur un déploiement de préproduction sans toucher au code, et de revenir en arrière
 * instantanément si l'écart mesuré est trop grand.
 *
 * ⚠ Au 2026-08-09 la valeur par défaut reste `v1`. La méthode active en production est donc
 * toujours celle du v1 — thème sans réponse = 50, étirement 0,75. Le dire, et ne pas
 * prétendre le contraire, fait partie du contrat de transparence.
 */
export function activeScoringVersion() {
  const flag = (import.meta?.env?.VITE_SCORING_VERSION ?? '').toLowerCase();
  return flag === 'v2' ? SCORING_VERSION_V2 : SCORING_VERSION_V1;
}

/** Le v2 est-il actif pour les nouveaux calculs ? */
export function isV2Active() {
  return activeScoringVersion() === SCORING_VERSION_V2;
}

/**
 * Calcule un profil avec la version active.
 * @param {Object} answers
 * @param {{askedQuestionIds?: string[]}} [options]
 */
export function calculateActiveProfile(answers, options = {}) {
  return isV2Active()
    ? calculateProfileV2(answers, options)
    : calculateProfile(answers);
}

/**
 * Un profil déjà stocké doit-il être relu comme v1 ?
 * Les profils antérieurs au versionnage n'ont pas de champ `versions` : ce sont des v1.
 */
export function scoringVersionOf(profile) {
  return profile?.versions?.scoring ?? SCORING_VERSION_V1;
}

/**
 * Nombre de réponses exploitables, quelle que soit la version du profil.
 * Le v1 expose `answeredCount`, le v2 `coverage.answeredCount` : les appelants ne doivent pas
 * avoir à connaître la version pour lire un compteur.
 */
export function profileAnsweredCount(profile) {
  if (profile?.coverage?.answeredCount != null) return profile.coverage.answeredCount;
  return profile?.answeredCount ?? 0;
}

/** Un profil stocké a-t-il été calculé avec une version différente de l'active ? */
export function isStaleVersion(profile) {
  return profile != null && scoringVersionOf(profile) !== activeScoringVersion();
}

/**
 * Mesure l'écart entre les deux versions pour un même jeu de réponses.
 *
 * Sert à décider de la bascule sur des données réelles plutôt qu'à l'intuition : combien de
 * thèmes changent, de combien, et le premier candidat change-t-il ? Utilisé par les tests de
 * sensibilité et destiné à une analyse hors ligne sur des passations consenties.
 *
 * @returns {{maxThemeShift: number, meanThemeShift: number, themesBecomingUnknown: string[], perTheme: Object}}
 */
export function compareScoringVersions(answers, options = {}) {
  const v1 = calculateProfile(answers);
  const v2 = calculateProfileV2(answers, options);

  const perTheme = {};
  const themesBecomingUnknown = [];
  const shifts = [];

  for (const theme of THEMES_ORDER) {
    const a = v1.themes[theme];
    const b = v2.themes[theme];
    if (b == null) {
      // Le v1 affichait 50 (« centriste ») là où le v2 dit « non déterminé ». C'est le
      // changement le plus visible pour l'utilisateur, et il ne se mesure pas en points.
      themesBecomingUnknown.push(theme);
      perTheme[theme] = { v1: a, v2: null, shift: null };
      continue;
    }
    const shift = Math.abs(a - b);
    shifts.push(shift);
    perTheme[theme] = { v1: a, v2: b, shift };
  }

  return {
    maxThemeShift: shifts.length ? Math.max(...shifts) : 0,
    meanThemeShift: shifts.length ? shifts.reduce((s, x) => s + x, 0) / shifts.length : 0,
    themesBecomingUnknown,
    perTheme,
  };
}
