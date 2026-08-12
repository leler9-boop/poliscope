// POLISCOP — Deux contrats de correspondance, versionnés et justifiés.
//
// POURQUOI DEUX
// -------------
// Un seul seuil servait aux deux usages : le profil GÉNÉRAL, tiré d'une banque de 128
// questions couvrant les huit thèmes, et la correspondance ÉLECTORALE, tirée d'un
// questionnaire propre à un scrutin — 7 à 18 questions, parfois concentrées sur trois thèmes.
//
// Conséquence mesurée : `it_2022` ne permet structurellement d'atteindre qu'UN thème, et
// `stras_2026` ou `es_2023` deux. Exiger quatre thèmes leur imposait une condition qu'aucun
// corpus, même parfait, ne pourrait jamais remplir. Le produit n'annonçait pas « ce
// questionnaire ne permet pas de conclure » : il renvoyait le même « couverture
// insuffisante » qu'un corpus simplement incomplet. Deux situations très différentes —
// l'une se répare en codant des positions, l'autre en changeant le questionnaire.
//
// ⚠ CE QUI N'EST PAS FAIT ICI. Aucun seuil n'est abaissé pour faire apparaître un score. Le
// contrat électoral s'adapte à ce que le questionnaire REND POSSIBLE, et s'arrête à un
// plancher en dessous duquel un « rapprochement » ne veut plus rien dire. Sous ce plancher,
// l'élection est déclarée structurellement insuffisante — un constat affiché, pas contourné.

/** Version des contrats. À incrémenter dès qu'un seuil ou sa justification change. */
export const MATCH_CONTRACTS_VERSION = 'contracts-2026-08-12';

/**
 * Plancher absolu, commun aux deux contrats.
 *
 * JUSTIFICATION. Deux thèmes ne décrivent pas une proximité politique : on peut s'accorder
 * sur l'économie et l'environnement en divergeant sur tout le reste. Trois est le plus petit
 * nombre au-delà duquel un désaccord isolé ne domine plus mécaniquement le résultat. Ce
 * plancher ne s'adapte à AUCUN questionnaire : c'est lui qui déclare l'insuffisance
 * structurelle plutôt que de céder.
 */
export const ABSOLUTE_MIN_THEMES = 3;

/**
 * Contrat GÉNÉRAL — profil sur les huit dimensions politiques.
 *
 * JUSTIFICATION DES SEUILS
 *   • `minKnownThemes: 4` — la moitié des huit thèmes. En dessous, annoncer une
 *     « ressemblance politique » revient à généraliser depuis un quart du spectre.
 *   • `minPositionsPerTheme: 2` — une position isolée ne fait pas un thème connu. Une seule
 *     déclaration sur l'économie ne dit rien de la politique économique d'ensemble.
 */
export const GENERAL_MATCH_CONTRACT = Object.freeze({
  id: 'general',
  version: MATCH_CONTRACTS_VERSION,
  minKnownThemes: 4,
  minPositionsPerTheme: 2,
  rationale: 'Profil général : la moitié des huit thèmes, deux positions par thème. Une '
    + 'position isolée ne permet pas de prétendre connaître un thème complet.',
});

/**
 * Contrat ÉLECTORAL — questionnaire propre à un scrutin.
 *
 * JUSTIFICATION DES SEUILS
 *   • `minPositionsPerTheme: 2` — identique au contrat général, et pour la même raison. Ce
 *     seuil-là n'a aucune raison de dépendre du scrutin.
 *   • `minKnownThemes` — calculé, jamais fixé d'avance : `min(4, thèmes atteignables)`, sans
 *     descendre sous `ABSOLUTE_MIN_THEMES`. Un questionnaire qui couvre cinq thèmes exige
 *     quatre ; un questionnaire qui n'en couvre que trois exige trois — parce que lui en
 *     demander quatre serait lui demander l'impossible, pas être exigeant.
 *   • En dessous du plancher, aucun seuil n'est proposé : l'élection est déclarée
 *     structurellement insuffisante.
 */
export const ELECTION_MATCH_CONTRACT = Object.freeze({
  id: 'election',
  version: MATCH_CONTRACTS_VERSION,
  maxKnownThemes: 4,
  minPositionsPerTheme: 2,
  rationale: 'Correspondance électorale : le seuil suit ce que le questionnaire du scrutin '
    + 'rend atteignable, plafonné au seuil général et jamais sous trois thèmes.',
});

/** Un thème est « atteignable » s'il porte assez de questions pour franchir le seuil. */
export function attainableThemes(questions = [], { minPositionsPerTheme } = ELECTION_MATCH_CONTRACT) {
  const perTheme = {};
  for (const q of questions) {
    if (!q?.theme) continue;
    perTheme[q.theme] = (perTheme[q.theme] ?? 0) + 1;
  }
  return Object.values(perTheme).filter(n => n >= minPositionsPerTheme).length;
}

/**
 * Résout le contrat applicable à un questionnaire d'élection.
 *
 * @returns {{minKnownThemes: number|null, minPositionsPerTheme: number, attainable: number,
 *            structurallyPossible: boolean, contract: string, version: string, reason: string|null}}
 */
export function resolveElectionContract(questions = []) {
  const attainable = attainableThemes(questions, ELECTION_MATCH_CONTRACT);
  const base = {
    contract: ELECTION_MATCH_CONTRACT.id,
    version: MATCH_CONTRACTS_VERSION,
    minPositionsPerTheme: ELECTION_MATCH_CONTRACT.minPositionsPerTheme,
    attainable,
  };

  if (attainable < ABSOLUTE_MIN_THEMES) {
    // ⚠ On ne descend PAS le plancher pour rendre l'élection scorable. Le questionnaire ne
    // permet pas de conclure ; c'est un fait à afficher, pas un obstacle à contourner.
    return {
      ...base,
      minKnownThemes: null,
      structurallyPossible: false,
      reason: 'questionnaire_structurally_insufficient',
    };
  }

  return {
    ...base,
    minKnownThemes: Math.min(ELECTION_MATCH_CONTRACT.maxKnownThemes, attainable),
    structurallyPossible: true,
    reason: null,
  };
}

/** Contrat du profil général — indépendant de tout scrutin. */
export function resolveGeneralContract() {
  return {
    contract: GENERAL_MATCH_CONTRACT.id,
    version: MATCH_CONTRACTS_VERSION,
    minKnownThemes: GENERAL_MATCH_CONTRACT.minKnownThemes,
    minPositionsPerTheme: GENERAL_MATCH_CONTRACT.minPositionsPerTheme,
    attainable: 8,
    structurallyPossible: true,
    reason: null,
  };
}
