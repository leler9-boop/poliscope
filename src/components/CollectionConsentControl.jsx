import React from 'react';
import { WITHDRAWAL_STATE } from '../lib/withdrawalQueue.js';

/**
 * POLISCOP — Commande de la collecte pseudonymisée du questionnaire.
 *
 * ⚠ POURQUOI CE COMPOSANT EST PUR ET SÉPARÉ DE `DataControlsModal`
 * ----------------------------------------------------------------
 * Deux raisons, et la seconde est un piège vérifié :
 *
 * 1. C'est une finalité DISTINCTE de la sauvegarde liée au compte. Les mélanger dans un seul
 *    bloc laissait croire qu'un visiteur sans compte n'avait rien à décider — alors que c'est
 *    exactement lui que la collecte concerne.
 *
 * 2. Un composant qui lit le store n'est pas vérifiable par rendu serveur : zustand v5 sert
 *    l'état INITIAL à `useSyncExternalStore` côté serveur (`getInitialState`), jamais l'état
 *    courant. Un test de rendu aurait donc toujours affiché « aucune décision », quel que soit
 *    le consentement réel — et serait passé sans rien prouver. En recevant la décision par
 *    propriété, l'affichage devient observable.
 */
export default function CollectionConsentControl({
  decision = null,
  language = 'fr',
  onGrant,
  onWithdraw,
  onRetry = null,
  /**
   * État du retrait, tel que rendu par `withdrawalQueue.withdrawalState()` : un OBJET
   * `{state, requestId, confirmedAt, …}`, pas une chaîne.
   *
   * ⚠ DÉFAUT CORRIGÉ (P0-1, 2026-08-14). Le composant recevait `'none' | 'pending' |
   * 'confirmed'` et testait `=== 'pending'` ; TOUT le reste — y compris `'none'` — affichait
   * « Suppression confirmée par le serveur ». Or `withdrawalState()` ne rendait jamais
   * `'confirmed'` : la confirmation était donc affichée par ÉLIMINATION. Un refus initial,
   * une tombstone jamais écrite, un stockage indisponible ou une lecture trop précoce
   * annonçaient tous une suppression qui n'avait pas eu lieu.
   */
  withdrawal = null,
}) {
  const fr = language === 'fr';
  const granted = decision?.granted === true;

  // ⚠ « Suppression confirmée » ne s'affiche QUE sur preuve positive : un reçu portant
  // l'identifiant de CETTE demande, obtenu après une réponse 2xx. Aucune autre valeur, et
  // surtout pas l'absence d'information, ne produit ce message.
  const etat = withdrawal?.state ?? WITHDRAWAL_STATE.NONE;
  const enAttente = etat === WITHDRAWAL_STATE.REQUESTED || etat === WITHDRAWAL_STATE.PENDING;
  const confirme  = etat === WITHDRAWAL_STATE.CONFIRMED;
  const nonPersiste = etat === WITHDRAWAL_STATE.UNPERSISTED;
  const jamaisCollecte = etat === WITHDRAWAL_STATE.NONE;

  return (
    <div className="border-t border-gray-100 pt-4">
      <p className="text-xs font-semibold text-gray-700 mb-1">
        {fr ? 'Analyse de vos réponses au questionnaire' : 'Analysis of your questionnaire answers'}
      </p>
      <p className="text-[11px] text-gray-400 leading-relaxed mb-2">
        {fr
          ? 'Choix indépendant de la sauvegarde liée au compte ci-dessus. Il ne nécessite aucun compte.'
          : 'Independent from the account-linked cloud save above. No account required.'}
      </p>

      <div
        data-testid="collection-consent-status"
        className={`rounded-lg px-3 py-2.5 text-xs font-medium mb-2 ${granted ? 'bg-blue-50 text-blue-700' : 'bg-gray-50 text-gray-500'}`}
      >
        {decision
          ? `${granted ? (fr ? 'Collecte autorisée' : 'Collection allowed') : (fr ? 'Collecte refusée' : 'Collection declined')}`
            + ` · ${fr ? 'décision du' : 'decided on'} ${String(decision.decidedAt ?? '').slice(0, 10)}`
            + ` · ${fr ? 'texte' : 'text'} ${decision.policyVersion ?? '—'}`
          : (fr ? 'Aucune décision enregistrée pour l’instant.' : 'No decision recorded yet.')}
      </div>

      {granted ? (
        <button
          type="button"
          data-testid="withdraw-collection"
          onClick={onWithdraw}
          className="w-full border border-gray-200 text-gray-700 font-semibold py-2.5 rounded-lg text-sm hover:bg-gray-50 transition-colors"
        >
          {fr ? 'Retirer mon accord à la collecte' : 'Withdraw my consent to collection'}
        </button>
      ) : (
        <button
          type="button"
          data-testid="grant-collection"
          onClick={onGrant}
          className="w-full border border-gray-200 text-gray-700 font-semibold py-2.5 rounded-lg text-sm hover:bg-gray-50 transition-colors"
        >
          {fr ? 'Autoriser la collecte' : 'Allow collection'}
        </button>
      )}

      {!granted && decision && (
        <p
          data-testid="withdrawal-state"
          data-withdrawal-state={etat}
          className={`text-[11px] leading-relaxed mt-2 ${
            nonPersiste ? 'text-red-700' : enAttente ? 'text-amber-700' : confirme ? 'text-emerald-700' : 'text-gray-500'
          }`}
        >
          {jamaisCollecte && (fr
            // Rien n'a été collecté : parler de suppression laisserait croire qu'un corpus
            // existait, puis qu'il a été effacé. Deux affirmations fausses.
            ? 'Collecte refusée. Aucune nouvelle donnée ne sera envoyée.'
            : 'Collection declined. No new data will be sent.')}

          {enAttente && (fr
            ? 'Collecte arrêtée — suppression serveur demandée, pas encore confirmée. Elle sera réessayée automatiquement au retour du réseau.'
            : 'Collection stopped — server deletion requested, not yet confirmed. It will be retried automatically when the network returns.')}

          {confirme && (fr
            ? `Suppression confirmée par le serveur le ${String(withdrawal?.confirmedAt ?? '').slice(0, 10)} `
              + `(demande ${String(withdrawal?.requestId ?? '—').slice(0, 8)}, finalité ${withdrawal?.purpose ?? '—'}).`
            : `Deletion confirmed by the server on ${String(withdrawal?.confirmedAt ?? '').slice(0, 10)} `
              + `(request ${String(withdrawal?.requestId ?? '—').slice(0, 8)}, purpose ${withdrawal?.purpose ?? '—'}).`)}

          {nonPersiste && (fr
            // ⚠ NE PAS PROMETTRE UN REJEU. Sans stockage, la demande disparaît à la fermeture
            // de l'onglet : annoncer « réessayée automatiquement » serait faux.
            ? 'Collecte arrêtée sur cet appareil, mais la demande de suppression n’a pas pu y être enregistrée : '
              + 'elle ne survivra pas à la fermeture de l’onglet. Réessayez maintenant, ou écrivez-nous.'
            : 'Collection stopped on this device, but the deletion request could not be stored here: '
              + 'it will not survive closing this tab. Retry now, or contact us.')}

          {(enAttente || nonPersiste) && onRetry && (
            <>
              {' '}
              <button type="button" data-testid="retry-withdrawal" onClick={onRetry} className="underline underline-offset-2">
                {fr ? 'Réessayer maintenant' : 'Retry now'}
              </button>
            </>
          )}
        </p>
      )}

      <p className="text-[11px] text-gray-400 leading-relaxed mt-2">
        {fr
          ? 'Le retrait arrête immédiatement les envois suivants et demande la suppression de la passation pseudonymisée déjà transmise. Les identifiants déposés sur cet appareil sont effacés.'
          : 'Withdrawing immediately stops further sending and requests deletion of the pseudonymised session already transmitted. Identifiers stored on this device are erased.'}
      </p>
    </div>
  );
}
