// POLISCOP — Diagnostic affiché par `scripts/check-matching.mjs`, isolé pour être TESTABLE.
//
// DÉFAUT CORRIGÉ (P1 du contre-audit du 2026-08-14)
// -------------------------------------------------
// La colonne « élection » affichait « relecture non faite » dès que `approved.length === 0`,
// y compris quand il n'existait AUCUNE position — donc rien à relire. Le rapport reprochait
// une relecture manquante à des candidats pour lesquels personne n'a jamais rien codé.
//
// Les deux situations se réparent par des gestes opposés : l'une demande de coder des
// positions, l'autre d'en faire relire. Les confondre envoie le travail au mauvais endroit —
// c'est le même défaut que « aucun corpus approuvé à ce jour » affiché en dur, corrigé dans
// le lot précédent, et il est resté ici.

/** Corpus inexistant, corpus non relu, ou rien à signaler ? */
export function diagnoseCorpus({ positions = 0, approved = 0 } = {}) {
  if (positions === 0) return 'aucun corpus';
  if (approved === 0) return 'relecture non faite';
  return null;
}

/**
 * Blocage de la lecture GÉNÉRALE (profil thématique en huit dimensions).
 * @returns {string} libellé affiché, `'—'` quand rien ne bloque
 */
export function diagnoseGeneral({
  positions = 0, approved = 0, themesReady = 0, minKnownThemes = 4, score = null,
} = {}) {
  const corpus = diagnoseCorpus({ positions, approved });
  if (corpus) return corpus;
  if (themesReady < minKnownThemes) return 'corpus trop étroit pour un profil général';
  return score == null ? 'CHAÎNE CASSÉE' : '—';
}

/**
 * Blocage de la lecture ÉLECTORALE DIRECTE (comparaison question par question).
 * @returns {string} libellé affiché, `'—'` quand rien ne bloque
 */
export function diagnoseElection({
  positions = 0, approved = 0, compared = 0, questionnaireSize = 0, themesRepresented = 0,
  contract, score = null,
} = {}) {
  const corpus = diagnoseCorpus({ positions, approved });
  if (corpus) return corpus;
  if (score != null) return '—';

  const part = questionnaireSize > 0 ? compared / questionnaireSize : 0;
  const contratRempli = compared >= contract.minComparedPositions
    && part >= contract.minQuestionnaireShare
    && themesRepresented >= contract.minThemesRepresented;
  // Le contrat est rempli et pourtant aucun score : le défaut est dans le moteur ou le
  // mapping, pas dans le corpus. C'est LE contrôle bloquant de ce script.
  return contratRempli ? 'CHAÎNE CASSÉE' : 'intersection sous le contrat direct';
}
