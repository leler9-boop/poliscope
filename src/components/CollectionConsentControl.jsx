import React from 'react';

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
}) {
  const fr = language === 'fr';
  const granted = decision?.granted === true;

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

      <p className="text-[11px] text-gray-400 leading-relaxed mt-2">
        {fr
          ? 'Le retrait arrête immédiatement les envois suivants et demande la suppression de la passation pseudonymisée déjà transmise. Les identifiants déposés sur cet appareil sont effacés.'
          : 'Withdrawing immediately stops further sending and requests deletion of the pseudonymised session already transmitted. Identifiers stored on this device are erased.'}
      </p>
    </div>
  );
}
