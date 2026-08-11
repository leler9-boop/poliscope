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
export const PRIORITY_CONTRACT_VERSION = 'priority-v2';

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

/** Un niveau est-il lisible par le contrat ? */
function isKnownLevel(level) {
  return typeof level === 'string' && level in IMPORTANCE_MULTIPLIER;
}

/**
 * Ce thème a-t-il fait l'objet d'un CHOIX EXPLICITE ?
 *
 * ⚠ CORRECTION 2026-08-10 (défaut A). L'écran initialisait les huit thèmes à MEDIUM :
 * quelqu'un qui ne touchait à rien produisait exactement l'état de quelqu'un ayant cliqué
 * huit fois sur « moyennement important ». Les deux valent 1 dans le calcul — c'est voulu,
 * un non-choix ne doit pas pénaliser — mais ils ne disent pas la même chose, et la donnée
 * récoltée devenait ininterprétable.
 */
export function isExplicitlyAnswered(importance, theme) {
  return importance?.answered?.[theme] === true && isKnownLevel(importance?.levels?.[theme]);
}

/** Nombre de thèmes réellement évalués. Sert à l'analytique et à l'honnêteté des libellés. */
export function answeredThemeCount(importance) {
  return THEMES_ORDER.filter(theme => isExplicitlyAnswered(importance, theme)).length;
}

/**
 * État vierge : aucun choix exprimé. Les niveaux sont `null`, le multiplicateur retombe
 * sur le neutre, et rien n'est enregistré comme une décision.
 */
export function blankImportance() {
  const levels = {};
  const answered = {};
  for (const theme of THEMES_ORDER) { levels[theme] = null; answered[theme] = false; }
  return { levels, answered, source: null };
}

/**
 * « Tous les sujets comptent à peu près autant » : une DÉCISION explicite sur les huit
 * thèmes, distincte d'une absence de choix qui donnerait pourtant le même multiplicateur.
 */
export function equalImportance() {
  const levels = {};
  const answered = {};
  for (const theme of THEMES_ORDER) { levels[theme] = IMPORTANCE_LEVEL.MEDIUM; answered[theme] = true; }
  return { levels, answered, source: PRIORITY_SOURCE.EQUAL };
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
export function isValidRanking(priorityOrder) {
  // ⚠ CORRECTION 2026-08-10 (défaut D). Vérifier la seule LONGUEUR acceptait
  // ['ECONOMY', 'ECONOMY', …] et produisait des poids silencieusement faux. On exige une
  // permutation EXACTE des huit thèmes : ni doublon, ni intrus, ni manquant.
  if (!Array.isArray(priorityOrder) || priorityOrder.length !== THEMES_ORDER.length) return false;
  const seen = new Set(priorityOrder);
  if (seen.size !== THEMES_ORDER.length) return false;
  return THEMES_ORDER.every(theme => seen.has(theme));
}

export function importanceFromRanking(priorityOrder) {
  // Une entrée invalide n'est jamais appliquée à moitié : on retombe sur un neutre EXPLICITE.
  if (!isValidRanking(priorityOrder)) return blankImportance();
  const order = priorityOrder;
  const byRank = [
    IMPORTANCE_LEVEL.VERY_HIGH, IMPORTANCE_LEVEL.VERY_HIGH,
    IMPORTANCE_LEVEL.HIGH, IMPORTANCE_LEVEL.HIGH,
    IMPORTANCE_LEVEL.MEDIUM, IMPORTANCE_LEVEL.MEDIUM,
    IMPORTANCE_LEVEL.LOW, IMPORTANCE_LEVEL.LOW,
  ];
  const levels = {};
  const answered = {};
  order.forEach((theme, index) => {
    levels[theme] = byRank[index] ?? IMPORTANCE_LEVEL.MEDIUM;
    answered[theme] = true;   // classer un thème EST un choix le concernant
  });
  return { levels, answered, source: PRIORITY_SOURCE.RANKING };
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
  const raw = (themeImportance && typeof themeImportance === 'object') ? themeImportance : null;
  const rawLevels = (raw?.levels && typeof raw.levels === 'object') ? raw.levels : null;

  if (rawLevels) {
    const levels = {};
    const answered = {};
    for (const theme of THEMES_ORDER) {
      const level = rawLevels[theme];
      const valid = isKnownLevel(level);
      levels[theme] = valid ? level : null;
      // Un niveau illisible ne peut pas compter comme une réponse valide, même si le
      // drapeau `answered` prétend le contraire : la valeur ne veut rien dire.
      answered[theme] = valid && raw?.answered?.[theme] === true;
    }
    const count = THEMES_ORDER.filter(t => answered[t]).length;
    // Ne pas déclarer « évaluations indépendantes » si aucune évaluation n'existe.
    const source = count === 0 ? null
      : (raw.source === PRIORITY_SOURCE.EQUAL || raw.source === PRIORITY_SOURCE.RANKING)
        ? raw.source
        : PRIORITY_SOURCE.INDEPENDENT;
    return { levels, answered, source };
  }

  if (Array.isArray(priorityOrder) && isValidRanking(priorityOrder)) {
    // L'ordre par défaut du store est l'ordre de DÉCLARATION : personne ne l'a choisi.
    const untouched = priorityOrder.every((t, i) => t === THEMES_ORDER[i]);
    return untouched ? blankImportance() : importanceFromRanking(priorityOrder);
  }
  return blankImportance();
}

/** Multiplicateur d'un thème, robuste à un niveau inconnu. */
export function themeMultiplier(importance, theme) {
  const level = importance?.levels?.[theme];
  const value = isKnownLevel(level)
    ? IMPORTANCE_MULTIPLIER[level]
    : IMPORTANCE_MULTIPLIER[IMPORTANCE_LEVEL.MEDIUM];   // non renseigné ⇒ neutre, pas pénalisé
  return Number.isFinite(value) ? value : 1;
}

/** Multiplicateur d'influence d'une question, robuste à un niveau inconnu ou absent. */
export function voteInfluenceMultiplier(voteInfluence, questionId) {
  const entry = voteInfluence?.[questionId];
  const level = (entry && typeof entry === 'object') ? entry.level : entry;
  // Une influence explicitement nulle DOIT survivre : c'est une décision, pas une absence.
  if (typeof level === 'string' && level in VOTE_INFLUENCE_MULTIPLIER) {
    const value = VOTE_INFLUENCE_MULTIPLIER[level];
    return Number.isFinite(value) ? value : 1;
  }
  // Tout le reste — jamais demandé, refus de répondre, valeur illisible — vaut neutre.
  return VOTE_INFLUENCE_MULTIPLIER[DEFAULT_VOTE_INFLUENCE];
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
/**
 * Plafonne la PART de chaque question dans le score final.
 *
 * ⚠ CORRECTION 2026-08-10 (défaut C). `computeEffectiveQuestionWeight()` plafonnait bien un
 * poids intermédiaire, mais `balanceWeightsAcrossThemes()` redistribuait ensuite toute la
 * masse d'un thème entre ses questions. Une question SEULE dans un thème « très important »
 * captait donc l'intégralité de cette masse : mesurée sur les poids réellement utilisés dans
 * le score, sa part atteignait 0,333 pour un plafond promis à 0,125 — 2,7 fois trop. La
 * promesse « une question ne pèse jamais plus que deux questions normales » était fausse.
 *
 * CONTRAT FINAL, vérifiable sur les poids servant au score :
 *     part normale  = 1 / (nombre de questions à poids positif)
 *     part maximale = MAX_EFFECTIVE_WEIGHT_RATIO × part normale
 *
 * Le surplus retiré à une question plafonnée est redistribué aux AUTRES, proportionnellement
 * à leur poids — jamais réinjecté dans la question plafonnée, ce qui annulerait le plafond.
 * L'opération se répète tant qu'une redistribution fait dépasser une nouvelle question.
 *
 * Note : avec une ou deux questions, `2/N ≥ 1` et aucun plafond ne peut mordre. C'est
 * arithmétique, pas un oubli : à deux questions, aucune ne peut « dominer » l'autre.
 */
export function capQuestionShares(entries, { maxRatio = MAX_EFFECTIVE_WEIGHT_RATIO } = {}) {
  const positives = entries.filter(e => Number.isFinite(e.weight) && e.weight > 0);
  const total = positives.reduce((s, e) => s + e.weight, 0);
  if (!(total > 0) || positives.length === 0) {
    return entries.map(e => ({ ...e, weight: 0 }));
  }

  const maxShare = maxRatio / positives.length;
  if (maxShare >= 1) return entries.map(e => ({ ...e, weight: e.weight > 0 ? e.weight : 0 }));

  // Parts normalisées, puis écrêtage itératif.
  const shares = new Map(positives.map(e => [e, e.weight / total]));
  const capped = new Set();

  for (let pass = 0; pass < positives.length; pass++) {
    const over = positives.filter(e => !capped.has(e) && shares.get(e) > maxShare + 1e-12);
    if (over.length === 0) break;
    for (const e of over) { shares.set(e, maxShare); capped.add(e); }

    const usedByCapped = capped.size * maxShare;
    const remaining = 1 - usedByCapped;
    const free = positives.filter(e => !capped.has(e));
    const freeMass = free.reduce((s, e) => s + shares.get(e), 0);
    if (!(freeMass > 0) || !(remaining > 0)) {
      // Plus rien à redistribuer : les non plafonnées tombent à zéro plutôt que de recevoir
      // une part inventée.
      for (const e of free) shares.set(e, 0);
      break;
    }
    for (const e of free) shares.set(e, (shares.get(e) / freeMass) * remaining);
  }

  return entries.map(e => ({ ...e, weight: shares.has(e) ? shares.get(e) : 0 }));
}

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
