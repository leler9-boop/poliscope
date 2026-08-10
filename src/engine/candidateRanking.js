// POLISCOP — Point d'entrée UNIQUE du classement des candidats.
//
// POURQUOI UN SEUL POINT D'ENTRÉE
// -------------------------------
// `ElectionDetail.jsx` a déjà porté une copie divergente du moteur : veto à 5 thèmes au lieu
// de 6, `themeWeights` ignoré. Les pages Profil et Élection classaient différemment la même
// personne. La règle depuis : un seul moteur, appelé au même endroit par toutes les surfaces.
//
// SÉLECTION DE VOIE — CONTRAT EXPLICITE
// -------------------------------------
// ⚠ CORRECTION 2026-08-10. La version précédente calculait la voie stricte, puis retournait
// celle-ci « dès qu'elle produisait au moins un résultat ». Ce comportement était une bombe à
// retardement : le jour où UN SEUL candidat aurait franchi le seuil strict, les neuf autres
// auraient disparu de Profil et de la page Élection, sans erreur ni message. Le classement
// public se serait silencieusement réduit à une personne.
//
// La voie est désormais choisie par l'appelant, jamais par la disponibilité des données :
//   • `mode: 'editorial'` — TOUS les candidats passent par la voie éditoriale ;
//   • `mode: 'strict'`    — TOUS les candidats passent par la voie stricte, et ceux qui
//                           n'y sont pas admissibles restent visibles dans `unscored`.
//
// Aucun mélange, aucune sélection automatique. Passer en mode strict sera une décision
// produit explicite, prise quand le corpus vérifié sera suffisant — pas un effet de bord.

import { rankCandidates } from './candidateMatch.js';
import { rankEditorialMatches, SCORE_PROVENANCE } from './editorialMatch.js';
import { getEditorialAnswers } from '../data/candidateEditorialAnswers.js';

/** Voies disponibles. Le mode est une DÉCISION, pas une conséquence des données. */
export const MATCH_MODE = Object.freeze({
  STRICT:    'strict',
  EDITORIAL: 'editorial',
});

/** Provenance de données associée à chaque voie, pour l'affichage. */
export const MODE_PROVENANCE = Object.freeze({
  [MATCH_MODE.STRICT]:    'sourced-positions',
  [MATCH_MODE.EDITORIAL]: 'editorial-estimate-v1',
});

/** Version du contrat de sélection de voie. */
export const RANKING_CONTRACT_VERSION = 'ranking-v2-explicit-mode';

/**
 * Classe des candidats dans une voie EXPLICITEMENT choisie.
 *
 * @param {Object}  params
 * @param {Array}   params.candidates       candidats de l'élection
 * @param {string}  params.mode             `'editorial'` ou `'strict'` — obligatoire en pratique
 * @param {Object}  params.userThemes       profil thématique (voie stricte)
 * @param {Object}  params.userAnswers      réponses brutes (voie éditoriale)
 * @param {Object}  params.electionAnswers  réponses aux questions spécifiques (voie stricte)
 * @param {Array}   params.questions        jeu de questions comparé
 * @param {string}  params.questionSet      `general` ou identifiant d'élection
 * @returns {{results: Array, unscored: Array, mode: string, provenance: string|null}}
 */
export function rankCandidatesForSurface({
  candidates = [],
  mode,
  userThemes = null,
  userAnswers = {},
  electionAnswers = {},
  questions = [],
  questionSet = 'general',
  priorityOrder = [],
  themeWeights = null,
  language = 'fr',
  // Injection utilisée par les tests et par un futur appelant qui fournirait lui-même le
  // corpus : sans ces deux paramètres, la voie stricte ne voyait que les données globales.
  approvedPositions = null,
  sourceIsVerified = null,
} = {}) {
  if (!Object.values(MATCH_MODE).includes(mode)) {
    throw new TypeError(
      `Mode de matching invalide ou absent : ${String(mode)}. `
      + `Utilisez explicitement "${MATCH_MODE.EDITORIAL}" ou "${MATCH_MODE.STRICT}".`,
    );
  }

  if (mode === MATCH_MODE.STRICT) {
    // Voie stricte pour TOUS. Les non-admissibles restent visibles avec leur motif.
    const strict = userThemes
      ? rankCandidates(
        {
          userThemes, priorityOrder, themeWeights, language, questions,
          // ⚠ Sans ceci, les réponses spécifiques de l'utilisateur n'atteignaient jamais le
          // moteur strict : la page Élection aurait classé exactement comme la page Profil.
          electionAnswers,
          ...(approvedPositions ? { approvedPositions } : {}),
          ...(sourceIsVerified ? { sourceIsVerified } : {}),
        },
        candidates,
      )
      : { results: [], unscored: candidates.map(candidate => ({ candidate, match: { score: null, reason: 'no_user_profile' } })) };

    return {
      ...strict,
      mode: MATCH_MODE.STRICT,
      provenance: strict.results.length ? SCORE_PROVENANCE.VERIFIED : null,
      dataSource: MODE_PROVENANCE[MATCH_MODE.STRICT],
      contractVersion: RANKING_CONTRACT_VERSION,
    };
  }

  // Voie éditoriale pour TOUS. Aucun candidat ne peut recevoir la provenance « vérifié ».
  const editorial = rankEditorialMatches(candidates, {
    userAnswers,
    questions,
    answersFor: candidate => getEditorialAnswers(candidate.id, questionSet),
  });

  return {
    ...editorial,
    mode: MATCH_MODE.EDITORIAL,
    provenance: editorial.results.length ? SCORE_PROVENANCE.EDITORIAL : null,
    dataSource: MODE_PROVENANCE[MATCH_MODE.EDITORIAL],
    contractVersion: RANKING_CONTRACT_VERSION,
  };
}
