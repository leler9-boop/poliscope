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
export const MATCH_CONTRACTS_VERSION = 'contracts-2026-08-14';

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

/**
 * Contrat de la correspondance ÉLECTORALE DIRECTE.
 *
 * POURQUOI IL A FALLU L'ÉCRIRE (P0-3, 2026-08-14)
 * ----------------------------------------------
 * `ELECTION_MATCH_CONTRACT` ci-dessus décrit ce qu'un questionnaire de scrutin permet
 * d'atteindre EN THÈMES. Il servait à autoriser — ou non — un score qui, en réalité, était
 * un mélange 65/35 entre un profil thématique dérivé des positions et un score direct calculé
 * sur les MÊMES positions. Les mêmes preuves étaient donc comptées deux fois, et le score
 * direct était interdit dès que le profil thématique n'atteignait pas quatre thèmes — alors
 * qu'il ne dépend pas du tout de cette dérivation.
 *
 * La correspondance électorale répond à une question précise : « sur les questions de cette
 * élection auxquelles j'ai répondu, de quel candidat suis-je le plus proche ? ». Son contrat
 * porte donc sur l'INTERSECTION RÉELLE — combien de positions ont pu être comparées, sur
 * combien de disponibles, couvrant combien de thèmes —, jamais sur la richesse d'un profil
 * général que cette lecture n'utilise pas.
 *
 * JUSTIFICATION DES SEUILS
 *   • `minComparedPositions: 5` — en dessous, une seule réponse pèse plus de 20 % du
 *     résultat : le nombre décrit alors une question, pas une proximité.
 *   • `minQuestionnaireShare: 0.25` — comparer trois questions sur dix-sept, ce n'est pas se
 *     prononcer sur l'élection. Le dénominateur est le questionnaire, pas ce qu'on a trouvé.
 *   • `minThemesRepresented: 3` — même plancher que `ABSOLUTE_MIN_THEMES`, et pour la même
 *     raison : deux thèmes ne décrivent pas une proximité politique. Il n'y a en revanche
 *     AUCUN seuil « deux positions par thème » ici — la comparaison est faite question par
 *     question, pas par agrégation thématique : exiger deux observations par thème serait
 *     importer une contrainte qui n'a de sens que pour un profil.
 */
export const ELECTION_DIRECT_CONTRACT = Object.freeze({
  id: 'election-direct',
  version: MATCH_CONTRACTS_VERSION,
  minComparedPositions: 5,
  minQuestionnaireShare: 0.25,
  minThemesRepresented: ABSOLUTE_MIN_THEMES,
  rationale: 'Correspondance électorale directe : au moins cinq positions comparées, couvrant '
    + 'un quart du questionnaire et trois thèmes distincts. Aucune agrégation thématique, donc '
    + 'aucun seuil de positions par thème.',
});

/**
 * Le contrat direct est-il rempli par une intersection donnée ?
 *
 * @param {{compared: number, available: number, questionnaireSize: number, themes: number}} x
 * @returns {{contract: string, version: string, satisfied: boolean, reason: string|null,
 *            minComparedPositions: number, minQuestionnaireShare: number,
 *            minThemesRepresented: number, share: number}}
 */
export function resolveDirectElectionContract({
  compared = 0, available = 0, questionnaireSize = 0, themes = 0,
} = {}) {
  const c = ELECTION_DIRECT_CONTRACT;
  const share = questionnaireSize > 0 ? compared / questionnaireSize : 0;
  const base = {
    contract: c.id,
    version: MATCH_CONTRACTS_VERSION,
    minComparedPositions: c.minComparedPositions,
    minQuestionnaireShare: c.minQuestionnaireShare,
    minThemesRepresented: c.minThemesRepresented,
    compared,
    available,
    questionnaireSize,
    themes,
    share,
  };

  // ⚠ Les motifs sont DISTINCTS : « le candidat n'a pas assez de positions codées » et
  // « vous n'avez pas répondu à assez de questions » se réparent par des gestes opposés.
  if (compared === 0) {
    return { ...base, satisfied: false, reason: available === 0 ? 'no_election_positions' : 'no_common_answers' };
  }
  if (compared < c.minComparedPositions) {
    return { ...base, satisfied: false, reason: 'too_few_compared_positions' };
  }
  if (share < c.minQuestionnaireShare) {
    return { ...base, satisfied: false, reason: 'questionnaire_share_too_small' };
  }
  if (themes < c.minThemesRepresented) {
    return { ...base, satisfied: false, reason: 'too_few_themes_represented' };
  }
  return { ...base, satisfied: true, reason: null };
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
