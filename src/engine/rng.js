// POLISCOP — Générateur pseudo-aléatoire déterministe (seedé).
//
// POURQUOI : `getQuestionQueue()` mélangeait les questions non-CORE avec `Math.random()`.
// Deux personnes en mode Standard — ou la même personne deux fois — ne répondaient donc pas
// aux mêmes questions, sans qu'aucune trace ne permette de reconstituer la file. Le tirage
// devenait une source de variance non mesurée sur les scores, et un questionnaire interrompu
// puis repris pouvait changer de contenu.
//
// Ce module ne rend PAS les formes courtes statistiquement équivalentes — cela demande une
// calibration psychométrique (voir docs/methodology/validation-roadmap.md). Il rend
// simplement le tirage reproductible, ce qui est un prérequis à toute mesure ultérieure.

/** Hash de chaîne → entier 32 bits (xfnv1a). Rend n'importe quelle graine textuelle utilisable. */
function hashSeed(str) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/**
 * mulberry32 — PRNG 32 bits, rapide, période 2^32, suffisant pour mélanger une liste de
 * questions. Ne pas l'utiliser pour quoi que ce soit de cryptographique.
 * @param {string|number} seed
 * @returns {() => number} fonction renvoyant un flottant dans [0, 1)
 */
export function createRng(seed) {
  let a = typeof seed === 'number' ? seed >>> 0 : hashSeed(String(seed));
  return function next() {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Mélange de Fisher–Yates piloté par un RNG seedé. Ne modifie pas le tableau d'entrée. */
export function seededShuffle(arr, rng) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Graine de session, lisible et courte. Générée une seule fois au démarrage d'une passation
 * puis persistée avec le résultat : c'est elle qui permet de reproduire la file exacte.
 * Utilise `crypto` quand il est disponible, sinon un repli acceptable (la graine n'a aucune
 * exigence de sécurité — seulement d'unicité raisonnable).
 */
export function generateSeed() {
  const g = globalThis.crypto;
  if (g?.getRandomValues) {
    const buf = new Uint32Array(2);
    g.getRandomValues(buf);
    return `${buf[0].toString(36)}${buf[1].toString(36)}`;
  }
  return `${Date.now().toString(36)}${Math.floor(Math.random() * 1e9).toString(36)}`;
}
