// POLISCOP — Point d'entrée UNIQUE du classement des candidats.
//
// POURQUOI UN SEUL POINT D'ENTRÉE
// -------------------------------
// `ElectionDetail.jsx` a déjà porté une copie divergente du moteur : veto à 5 thèmes au lieu
// de 6, `themeWeights` ignoré. Les pages Profil et Élection classaient différemment la même
// personne. La règle depuis : un seul moteur, appelé au même endroit par toutes les surfaces.
//
// Ce module ajoute la sélection de VOIE, qui est la même décision produit partout :
//   1. voie stricte  (`sourced-positions`)     — positions approuvées et relues ;
//   2. voie éditoriale (`editorial-estimate-v1`) — estimations, explicitement demandée.
//
// La voie stricte est TOUJOURS tentée en premier. La voie éditoriale ne prend le relais que
// si l'appelant l'a demandée — jamais par accident, jamais en silence.

import { rankCandidates } from './candidateMatch.js';
import { rankEditorialMatches, SCORE_PROVENANCE } from './editorialMatch.js';
import { getEditorialAnswers } from '../data/candidateEditorialAnswers.js';

/** Voies disponibles. */
export const MATCH_MODE = Object.freeze({
  STRICT:   'sourced-positions',
  EDITORIAL: 'editorial-estimate-v1',
});

/** Version du contrat de sélection de voie. */
export const RANKING_CONTRACT_VERSION = 'ranking-v1';

/**
 * Classe des candidats, en choisissant la voie de façon explicite et traçable.
 *
 * @param {Object}  params
 * @param {Array}   params.candidates      candidats de l'élection
 * @param {Object}  params.userThemes      profil thématique de l'utilisateur (voie stricte)
 * @param {Object}  params.userAnswers     réponses brutes de l'utilisateur (voie éditoriale)
 * @param {Array}   params.questions       jeu de questions comparé
 * @param {string}  params.questionSet     `general` ou identifiant d'élection
 * @param {boolean} [params.allowEditorial] autorise la voie éditoriale en repli. FAUX par
 *                  défaut : aucune estimation ne s'affiche sans que l'appelant l'ait voulu.
 * @returns {{results: Array, unscored: Array, mode: string, provenance: string|null}}
 */
export function rankCandidatesForSurface({
  candidates = [],
  userThemes = null,
  userAnswers = {},
  questions = [],
  questionSet = 'general',
  allowEditorial = false,
  priorityOrder = [],
  themeWeights = null,
  language = 'fr',
} = {}) {
  // ── Voie stricte ────────────────────────────────────────────────────────
  const strict = userThemes
    ? rankCandidates({ userThemes, priorityOrder, themeWeights, language, questions }, candidates)
    : { results: [], unscored: candidates.map(candidate => ({ candidate, match: { score: null, reason: 'no_user_profile' } })) };

  if (strict.results.length > 0) {
    return {
      ...strict,
      mode: MATCH_MODE.STRICT,
      provenance: SCORE_PROVENANCE.VERIFIED,
      contractVersion: RANKING_CONTRACT_VERSION,
    };
  }

  // Aucune position approuvée : sans autorisation explicite, on n'affiche RIEN plutôt qu'une
  // estimation présentée comme une vérification.
  if (!allowEditorial) {
    return {
      ...strict,
      mode: MATCH_MODE.STRICT,
      provenance: null,
      contractVersion: RANKING_CONTRACT_VERSION,
    };
  }

  // ── Voie éditoriale, demandée explicitement ─────────────────────────────
  const editorial = rankEditorialMatches(candidates, {
    userAnswers,
    questions,
    answersFor: candidate => getEditorialAnswers(candidate.id, questionSet),
  });

  return {
    ...editorial,
    mode: MATCH_MODE.EDITORIAL,
    provenance: editorial.results.length ? SCORE_PROVENANCE.EDITORIAL : null,
    contractVersion: RANKING_CONTRACT_VERSION,
  };
}
