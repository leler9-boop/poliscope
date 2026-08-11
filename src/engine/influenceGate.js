// POLISCOP — Garde de navigation autour de la demande d'influence électorale.
//
// POURQUOI CES RÈGLES SONT ICI ET PAS DANS LE COMPOSANT
// -----------------------------------------------------
// La suspension de l'auto-avance vivait dans `Questionnaire.jsx`, et le bouton manuel
// « Suivant » avait sa propre condition (`disabled={!hasAnswer}`). Deux chemins de navigation,
// une seule règle appliquée : on pouvait répondre puis cliquer « Suivant » pour quitter la
// question sans jamais traiter la demande, qui devenait décorative.
//
// Les trois fonctions ci-dessous sont PURES et partagées par tous les chemins de navigation.
// Un garde-fou enfermé dans du JSX n'est vérifiable que par un rendu complet — c'est
// exactement comme ça que le bouton « Suivant » a échappé à la règle.

import { isScorable } from './scorer.js';

/** Une décision d'influence a-t-elle été prise pour cette question ? (choix OU refus) */
function hasInfluenceDecision(voteInfluence, questionId) {
  const entry = voteInfluence?.[questionId];
  if (!entry || typeof entry !== 'object') return false;
  // `declined: true` est une décision : la personne a vu la demande et a choisi de passer.
  return entry.declined === true || typeof entry.level === 'string';
}

/**
 * La demande doit-elle être ouverte pour cette question ?
 *
 * Vrai si la question est marquée, qu'une réponse politique EXPLOITABLE existe, et qu'aucune
 * décision d'influence n'a encore été prise. C'est ce qui la fait réapparaître après un
 * rechargement ou un retour arrière : l'état ne dépend pas d'un drapeau de session.
 *
 * « Sans opinion » ne déclenche rien : il n'y a aucune décision politique à qualifier.
 */
export function shouldOpenInfluencePrompt({ question, currentAnswer, voteInfluence } = {}) {
  if (!question?.voteInfluencePrompt) return false;
  if (!isScorable(currentAnswer)) return false;
  return !hasInfluenceDecision(voteInfluence, question.id);
}

/**
 * Peut-on quitter la question courante ?
 *
 * ⚠ À appeler depuis TOUS les chemins de navigation — bouton « Suivant », auto-avance, fin de
 * quiz, mode amélioration. Une garde visuelle (`disabled`) ne suffit pas : un double clic, une
 * animation en cours ou un minuteur d'auto-avance périmé peuvent déclencher le gestionnaire
 * malgré l'attribut.
 */
export function canLeaveQuestion({ question, currentAnswer, influencePromptFor, voteInfluence } = {}) {
  if (!question?.voteInfluencePrompt) return true;
  // Un prompt ouvert pour une AUTRE question ne doit pas geler celle-ci.
  if (influencePromptFor !== question.id) return true;
  if (!isScorable(currentAnswer)) return true;
  return hasInfluenceDecision(voteInfluence, question.id);
}

/**
 * Quel prompt doit être ouvert, compte tenu de la question réellement affichée ?
 *
 * Recale l'état sur la question courante et referme un prompt déjà satisfait. Empêche un
 * `influencePromptFor` orphelin — qui bloquerait la navigation sur une question sans rapport,
 * ou ferait écrire une influence sur la mauvaise question.
 *
 * @returns {string|null} identifiant de la question dont la demande doit être ouverte
 */
export function resolveOpenPrompt({ openFor, question, currentAnswer, voteInfluence } = {}) {
  if (shouldOpenInfluencePrompt({ question, currentAnswer, voteInfluence })) return question.id;
  // Sinon, aucune demande n'a lieu d'être ouverte : surtout pas celle d'une autre question.
  return openFor === question?.id ? null : null;
}
