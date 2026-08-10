// POLISCOP — Contrat unique des priorités et de la pondération électorale.
//
// TROIS DONNÉES DISTINCTES, JAMAIS CONFONDUES
// -------------------------------------------
//   A. La RÉPONSE POLITIQUE      — ce que la personne pense. Construit le profil idéologique.
//   B. L'IMPORTANCE DU THÈME     — le poids général qu'elle accorde à un sujet.
//   C. L'INFLUENCE SUR LE VOTE   — la capacité d'une mesure précise à faire basculer son choix.
//
// ⚠ RÈGLE FONDAMENTALE : « ce sujet ne changera pas mon vote » n'est NI « sans opinion », NI
// une réponse neutre, NI une question ignorée. La réponse politique reste intégralement dans
// le profil idéologique ; seul son POIDS dans le matching électoral change. Confondre les deux
// reviendrait à effacer une opinion parce qu'elle n'est pas décisive — ce qui est faux et
// appauvrit le profil sans que personne ne l'ait demandé.
//
// Tous les niveaux et multiplicateurs vivent ICI. Les disperser dans les composants garantit
// qu'ils divergeront : c'est déjà arrivé sur le veto du matching, avec deux surfaces qui
// classaient la même personne différemment.

import { THEMES_ORDER } from '../data/questions.js';

/** Version du contrat de pondération. Tout résultat pondéré l'embarque. */
export const PRIORITY_CONTRACT_VERSION = 'priority-v1';

// ─── B. Importance générale d'un thème ───────────────────────────────────────

export const IMPORTANCE_LEVEL = Object.freeze({
  NOT:       'not_important',
  LOW:       'low',
  MEDIUM:    'medium',
  HIGH:      'high',
  VERY_HIGH: 'very_high',
});

/** Ordre d'affichage, du moins au plus important. */
export const IMPORTANCE_ORDER = Object.freeze([
  IMPORTANCE_LEVEL.NOT, IMPORTANCE_LEVEL.LOW, IMPORTANCE_LEVEL.MEDIUM,
  IMPORTANCE_LEVEL.HIGH, IMPORTANCE_LEVEL.VERY_HIGH,
]);

/**
 * Multiplicateurs. `0` est une valeur LÉGITIME : elle retire le thème du matching électoral
 * pondéré sans toucher au profil idéologique.
 */
export const IMPORTANCE_MULTIPLIER = Object.freeze({
  [IMPORTANCE_LEVEL.NOT]:       0,
  [IMPORTANCE_LEVEL.LOW]:       0.5,
  [IMPORTANCE_LEVEL.MEDIUM]:    1,
  [IMPORTANCE_LEVEL.HIGH]:      1.25,
  [IMPORTANCE_LEVEL.VERY_HIGH]: 1.5,
});

/** Libellés publics. Français simple, sans jargon. */
export const IMPORTANCE_LABELS = Object.freeze({
  fr: {
    [IMPORTANCE_LEVEL.NOT]:       'Pas important',
    [IMPORTANCE_LEVEL.LOW]:       'Peu important',
    [IMPORTANCE_LEVEL.MEDIUM]:    'Moyennement important',
    [IMPORTANCE_LEVEL.HIGH]:      'Important',
    [IMPORTANCE_LEVEL.VERY_HIGH]: 'Très important',
  },
  en: {
    [IMPORTANCE_LEVEL.NOT]:       'Not important',
    [IMPORTANCE_LEVEL.LOW]:       'Slightly important',
    [IMPORTANCE_LEVEL.MEDIUM]:    'Moderately important',
    [IMPORTANCE_LEVEL.HIGH]:      'Important',
    [IMPORTANCE_LEVEL.VERY_HIGH]: 'Very important',
  },
});

/** D'où vient la pondération thématique. Sert à mesurer quel parcours les gens utilisent. */
export const PRIORITY_SOURCE = Object.freeze({
  INDEPENDENT: 'independent_rating',
  EQUAL:       'equal_default',
  RANKING:     'precise_ranking',
});

// ─── C. Influence d'une question précise sur le vote ─────────────────────────

export const VOTE_INFLUENCE_LEVEL = Object.freeze({
  NONE:     'none',
  UNLIKELY: 'unlikely',
  LIKELY:   'likely',
  STRONG:   'strong',
});

export const VOTE_INFLUENCE_ORDER = Object.freeze([
  VOTE_INFLUENCE_LEVEL.NONE, VOTE_INFLUENCE_LEVEL.UNLIKELY,
  VOTE_INFLUENCE_LEVEL.LIKELY, VOTE_INFLUENCE_LEVEL.STRONG,
]);

export const VOTE_INFLUENCE_MULTIPLIER = Object.freeze({
  [VOTE_INFLUENCE_LEVEL.NONE]:     0,
  [VOTE_INFLUENCE_LEVEL.UNLIKELY]: 0.5,
  [VOTE_INFLUENCE_LEVEL.LIKELY]:   1,
  [VOTE_INFLUENCE_LEVEL.STRONG]:   1.5,
});

export const VOTE_INFLUENCE_LABELS = Object.freeze({
  fr: {
    [VOTE_INFLUENCE_LEVEL.NONE]:     'Pas du tout',
    [VOTE_INFLUENCE_LEVEL.UNLIKELY]: 'Probablement pas',
    [VOTE_INFLUENCE_LEVEL.LIKELY]:   'Probablement oui',
    [VOTE_INFLUENCE_LEVEL.STRONG]:   'Oui, beaucoup',
  },
  en: {
    [VOTE_INFLUENCE_LEVEL.NONE]:     'Not at all',
    [VOTE_INFLUENCE_LEVEL.UNLIKELY]: 'Probably not',
    [VOTE_INFLUENCE_LEVEL.LIKELY]:   'Probably yes',
    [VOTE_INFLUENCE_LEVEL.STRONG]:   'Yes, a lot',
  },
});

/**
 * Défaut d'influence quand la question n'a JAMAIS été posée.
 *
 * `LIKELY` (multiplicateur 1) est le choix documenté : ne pas demander revient à ne rien
 * savoir, et l'absence de réponse ne doit ni gonfler ni éteindre une question. Un défaut à 0
 * effacerait silencieusement toutes les questions non interrogées.
 */
export const DEFAULT_VOTE_INFLUENCE = VOTE_INFLUENCE_LEVEL.LIKELY;

// ─── Plafonds ────────────────────────────────────────────────────────────────

/**
 * Plafond du poids effectif d'une question, exprimé en multiples d'une question normale.
 * Sans lui, `1,5 × 1,5 × poids CORE` laisserait une seule question très spécialisée décider
 * du classement à elle seule.
 */
export const MAX_EFFECTIVE_WEIGHT_RATIO = 2;

// ─── Construction de l'importance thématique ─────────────────────────────────

/** Toutes les thématiques à « moyennement important ». Ne touche à AUCUNE réponse politique. */
export function equalImportance() {
  const out = {};
  for (const theme of THEMES_ORDER) out[theme] = IMPORTANCE_LEVEL.MEDIUM;
  return { levels: out, source: PRIORITY_SOURCE.EQUAL };
}

/**
 * Convertit un classement ordonné (glisser-déposer) vers le MÊME contrat que les évaluations
 * indépendantes. Sans cette conversion, deux parcours produiraient deux échelles de poids
 * incomparables, et le classement « précis » serait en réalité un autre algorithme.
 *
 * Répartition sur les cinq niveaux : les deux premiers thèmes sont « très important », les
 * deux suivants « important », etc. Elle est volontairement grossière — un classement exprime
 * un ordre, pas une intensité.
 */
export function importanceFromRanking(priorityOrder) {
  const order = (priorityOrder && priorityOrder.length === THEMES_ORDER.length)
    ? priorityOrder
    : [...THEMES_ORDER];
  const byRank = [
    IMPORTANCE_LEVEL.VERY_HIGH, IMPORTANCE_LEVEL.VERY_HIGH,
    IMPORTANCE_LEVEL.HIGH, IMPORTANCE_LEVEL.HIGH,
    IMPORTANCE_LEVEL.MEDIUM, IMPORTANCE_LEVEL.MEDIUM,
    IMPORTANCE_LEVEL.LOW, IMPORTANCE_LEVEL.LOW,
  ];
  const out = {};
  order.forEach((theme, index) => { out[theme] = byRank[index] ?? IMPORTANCE_LEVEL.MEDIUM; });
  for (const theme of THEMES_ORDER) out[theme] ??= IMPORTANCE_LEVEL.MEDIUM;
  return { levels: out, source: PRIORITY_SOURCE.RANKING };
}

/**
 * Normalise n'importe quel état de priorité persisté vers le contrat courant.
 *
 * Anciens profils : un profil enregistré avant cette version ne porte qu'un `priorityOrder`.
 * Il est converti par `importanceFromRanking`, et l'ordre par défaut du store (déclaration)
 * donne donc « très important » aux deux premiers thèmes. Pour éviter cette surprise, un
 * ordre STRICTEMENT égal à l'ordre de déclaration est traité comme « aucun choix exprimé »
 * et devient une importance égale.
 */
export function normalizeThemeImportance({ themeImportance, priorityOrder } = {}) {
  if (themeImportance?.levels && THEMES_ORDER.every(t => themeImportance.levels[t])) {
    return {
      levels: { ...themeImportance.levels },
      source: themeImportance.source ?? PRIORITY_SOURCE.INDEPENDENT,
    };
  }
  if (priorityOrder?.length === THEMES_ORDER.length) {
    const untouched = priorityOrder.every((t, i) => t === THEMES_ORDER[i]);
    return untouched ? equalImportance() : importanceFromRanking(priorityOrder);
  }
  return equalImportance();
}

/** Multiplicateur d'un thème, robuste à un niveau inconnu. */
export function themeMultiplier(importance, theme) {
  const level = importance?.levels?.[theme];
  return IMPORTANCE_MULTIPLIER[level] ?? IMPORTANCE_MULTIPLIER[IMPORTANCE_LEVEL.MEDIUM];
}

/** Multiplicateur d'influence d'une question, robuste à un niveau inconnu ou absent. */
export function voteInfluenceMultiplier(voteInfluence, questionId) {
  const level = voteInfluence?.[questionId]?.level ?? voteInfluence?.[questionId];
  if (level == null) return VOTE_INFLUENCE_MULTIPLIER[DEFAULT_VOTE_INFLUENCE];
  return VOTE_INFLUENCE_MULTIPLIER[level] ?? VOTE_INFLUENCE_MULTIPLIER[DEFAULT_VOTE_INFLUENCE];
}

// ─── Poids effectif d'une question ───────────────────────────────────────────

/**
 * poids effectif = importance du thème × influence sur le vote × poids éditorial de base,
 * puis plafonné.
 *
 * @param {Object} p
 * @param {number} p.themeFactor      multiplicateur du thème (0 … 1,5)
 * @param {number} p.influenceFactor  multiplicateur d'influence (0 … 1,5)
 * @param {number} p.editorialWeight  poids éditorial de la question (STATUS_WEIGHTS)
 * @param {number} p.baselineWeight   poids éditorial d'une question « normale », pour le plafond
 * @returns {number} poids effectif, toujours fini et ≥ 0
 */
export function computeEffectiveQuestionWeight({
  themeFactor = 1,
  influenceFactor = 1,
  editorialWeight = 1,
  baselineWeight = 2,
} = {}) {
  const raw = themeFactor * influenceFactor * editorialWeight;
  if (!Number.isFinite(raw) || raw <= 0) return 0;
  const cap = MAX_EFFECTIVE_WEIGHT_RATIO * (baselineWeight > 0 ? baselineWeight : 1);
  return Math.min(raw, cap);
}

/**
 * Répartit les poids pour qu'un thème riche en questions n'écrase pas mécaniquement les autres.
 *
 * Sans cette correction, un thème représenté par huit questions pèserait quatre fois plus
 * qu'un thème représenté par deux, quelle que soit l'importance déclarée — la pondération
 * exprimerait alors la composition de la banque, pas les priorités de la personne.
 *
 * RÈGLE : la masse totale d'un thème vaut son multiplicateur d'importance, quel que soit son
 * nombre de questions. À l'intérieur du thème, cette masse se répartit proportionnellement au
 * poids propre de chaque question (poids éditorial × influence sur le vote).
 *
 *   masse(thème)     = themeFactor
 *   poids(question)  = themeFactor × poidsPropre / Σ poidsPropres du thème
 *
 * ⚠ Ne PAS égaliser les thèmes entre eux : ce serait effacer l'importance déclarée, c'est-à-dire
 * exactement la donnée qu'on cherche à faire compter.
 *
 * @param {Array<{theme: string, ownWeight: number, themeFactor: number}>} entries
 * @returns {Array<{theme: string, weight: number}>} entrées portant leur poids effectif final
 */
export function balanceWeightsAcrossThemes(entries) {
  const totalPerTheme = new Map();
  for (const e of entries) {
    totalPerTheme.set(e.theme, (totalPerTheme.get(e.theme) ?? 0) + (e.ownWeight > 0 ? e.ownWeight : 0));
  }
  return entries.map(e => {
    const total = totalPerTheme.get(e.theme) ?? 0;
    // Aucun poids propre dans ce thème (tout à zéro) : le thème ne contribue pas. On ne
    // fabrique pas une part par division — ce serait un NaN, ou pire, une part inventée.
    if (!(total > 0) || !(e.ownWeight > 0)) return { ...e, weight: 0 };
    const weight = e.themeFactor * (e.ownWeight / total);
    return { ...e, weight: Number.isFinite(weight) && weight > 0 ? weight : 0 };
  });
}
