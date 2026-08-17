/**
 * POLISCOP — « Mes données et confidentialité ».
 *
 * ⚠ CET ÉCRAN N'EST PLUS RÉSERVÉ AUX PERSONNES CONNECTÉES.
 *
 * Le commentaire précédent affirmait « logged-in users only (guests have nothing stored
 * server-side by construction) ». C'est devenu faux : l'analyse pseudonymisée du
 * questionnaire ne suppose aucun compte, et elle concerne justement les visiteurs qui n'en
 * ont pas. Les réserver de cet écran rendait mensongère la phrase « vous pouvez changer
 * d'avis à tout moment » affichée avant le quiz.
 *
 * DEUX TRAITEMENTS DISTINCTS, DEUX BLOCS SÉPARÉS, JAMAIS FUSIONNÉS :
 *   • sauvegarde liée au COMPTE — visible et actionnable seulement s'il existe un compte ;
 *   • analyse pseudonymisée du QUESTIONNAIRE — toujours actionnable.
 *
 * Le bloc « compte » ne doit jamais prétendre que rien n'est transmis : il ne connaît pas
 * l'état de l'autre finalité. Il décrit son propre état, rien de plus.
 *
 * Ne touche pas aux données locales du navigateur (voir `resetProfile`) ni au compte
 * d'authentification lui-même.
 */
import React, { useEffect, useState } from 'react';
import { useStore } from '../store/useStore.js';
import { PURPOSES } from '../lib/consent.js';
import CollectionConsentControl from './CollectionConsentControl.jsx';
import { withdrawalState as readQueueState, WITHDRAWAL_STATE } from '../lib/withdrawalQueue.js';

/**
 * État du retrait pour la finalité politique.
 *
 * ⚠ On interroge la SESSION en priorité, pas le stockage : elle seule connaît les demandes
 * gardées en mémoire quand le stockage refuse d'écrire. Lire le stockage directement rendait
 * `none` — « rien à supprimer » — pour une demande qui venait précisément d'échouer à s'y
 * inscrire, c'est-à-dire le message exactement inverse de la réalité.
 */
async function readWithdrawalState() {
  try {
    const { attemptSession } = await import('../lib/attemptSession.js');
    return attemptSession.withdrawalState(PURPOSES.POLITICAL_ANALYTICS);
  } catch {
    const storage = typeof localStorage !== 'undefined' ? localStorage : null;
    return readQueueState(storage, { purpose: PURPOSES.POLITICAL_ANALYTICS });
  }
}

/** Lecture synchrone, pour l'état initial du composant. */
function readWithdrawalStateSync() {
  const storage = typeof localStorage !== 'undefined' ? localStorage : null;
  return readQueueState(storage, { purpose: PURPOSES.POLITICAL_ANALYTICS });
}

/**
 * Fusionne l'issue IMMÉDIATE d'une action et l'état DURABLE de la file.
 *
 * ⚠ Les deux sont nécessaires et aucun ne remplace l'autre. La file dit ce qui survivra à un
 * rechargement ; l'issue de l'action dit ce qui vient de se passer — notamment le seul cas
 * que la file ne peut pas raconter : une demande qu'elle n'a PAS pu enregistrer. Sans
 * stockage, la file relit `none`, c'est-à-dire « rien à supprimer » — exactement le message
 * à ne pas afficher à quelqu'un dont la demande vient d'échouer.
 */
function mergeWithdrawal(fileState, issue) {
  const mien = issue?.withdrawals?.find(w => w.purpose === PURPOSES.POLITICAL_ANALYTICS);
  if (!mien) return fileState;
  if (mien.state === WITHDRAWAL_STATE.UNPERSISTED) {
    return { ...fileState, state: WITHDRAWAL_STATE.UNPERSISTED, requestId: mien.requestId ?? null };
  }
  // La file fait foi dès qu'elle a pu enregistrer quelque chose : elle porte le nombre de
  // tentatives et le reçu.
  return fileState;
}
import { useAuth } from '../lib/auth.jsx';

export default function DataControlsModal({ onClose }) {
  const language       = useStore(s => s.language);
  const consent        = useStore(s => s.consent);
  const collectionConsent = useStore(s => s.collectionConsent);
  const recordCollectionConsent = useStore(s => s.recordCollectionConsent);
  const withdrawCollectionConsent = useStore(s => s.withdrawCollectionConsent);
  const exportProfile  = useStore(s => s.exportProfile);
  const { user, revokeConsent, deleteMyData } = useAuth();
  const fr = language === 'fr';

  // ⚠ L'état affiché vient de la FILE PERSISTANTE, jamais du store : annoncer « supprimé »
  // parce qu'un booléen Zustand a changé afficherait une confirmation que le serveur n'a
  // jamais donnée.
  const [withdrawal, setWithdrawal] = useState(() => readWithdrawalStateSync());
  useEffect(() => {
    let vivant = true;
    (async () => {
      try {
        const { attemptSession } = await import('../lib/attemptSession.js');
        await attemptSession.retryWithdrawals();
      } catch { /* module indisponible */ }
      if (vivant) setWithdrawal(await readWithdrawalState());
    })();
    return () => { vivant = false; };
  }, []);

  const [revoking, setRevoking]             = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleting, setDeleting]             = useState(false);
  const [deleted, setDeleted]               = useState(false);
  const [error, setError]                   = useState(null);

  const hasConsent = consent?.politicalData === true;

  // ⚠ DEUX CONSENTEMENTS DISTINCTS, DEUX COMMANDES DISTINCTES.
  //
  // Cet écran ne montrait que `consent.politicalData` — la sauvegarde liée au COMPTE. La
  // collecte pseudonymisée du questionnaire n'y figurait pas, alors que l'écran d'entrée
  // promet « vous pouvez changer d'avis depuis Mes données ». La promesse était fausse, et
  // elle l'était surtout pour les visiteurs SANS compte, qui n'avaient aucune commande.
  const collectionDecision = collectionConsent?.[PURPOSES.POLITICAL_ANALYTICS] ?? null;

  async function handleRevoke() {
    setRevoking(true);
    setError(null);
    const { error } = await revokeConsent();
    setRevoking(false);
    if (error) setError(error);
  }

  async function handleDelete() {
    setDeleting(true);
    setError(null);
    const { error } = await deleteMyData();
    setDeleting(false);
    if (error) { setError(error); return; }
    setConfirmingDelete(false);
    setDeleted(true);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 px-0 sm:px-4">
      <div className="bg-white rounded-t-2xl sm:rounded-xl shadow-xl w-full sm:max-w-md max-h-[92vh] overflow-y-auto">
        <div className="sticky top-0 bg-white rounded-t-2xl sm:rounded-t-xl border-b border-gray-100 px-6 pt-5 pb-4 flex items-start justify-between">
          <h2 className="text-base font-bold text-gray-900">
            {fr ? 'Mes données et confidentialité' : 'My data and privacy'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg leading-none">✕</button>
        </div>

        <div className="px-6 py-4 space-y-4 text-sm text-gray-700 leading-relaxed">
          {!confirmingDelete && (
            <>
              {user && (
              <div className={`rounded-lg px-3 py-2.5 text-xs font-medium ${hasConsent ? 'bg-blue-50 text-blue-700' : 'bg-gray-50 text-gray-500'}`}>
                {hasConsent
                  ? (fr
                      ? '☁ Sauvegarde liée au compte activée — vos réponses et votre profil sont stockés sur nos serveurs, rattachés à votre compte.'
                      : '☁ Account-linked save enabled — your answers and profile are stored on our servers, linked to your account.')
                  // ⚠ NE PAS ÉCRIRE « rien ne quitte cet appareil » ICI. Cette phrase était
                  // fausse dès que l'analyse pseudonymisée du questionnaire était acceptée :
                  // deux traitements distincts, deux états distincts. Ce bloc ne décrit QUE
                  // la sauvegarde liée au compte.
                  : (fr
                      ? 'Sauvegarde liée au compte désactivée — rien n’est rattaché à votre compte.'
                      : 'Account-linked save disabled — nothing is attached to your account.')}
              </div>
              )}

              {user && hasConsent && (
                <button
                  onClick={handleRevoke}
                  disabled={revoking}
                  className="w-full border border-gray-200 text-gray-700 font-semibold py-2.5 rounded-lg text-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  {revoking ? (fr ? 'Retrait en cours…' : 'Withdrawing…') : (fr ? 'Retirer mon accord' : 'Withdraw consent')}
                </button>
              )}
              {user && (
                <p className="text-xs text-gray-400">
                  {fr
                    ? 'Retirer votre accord arrête toute nouvelle sauvegarde liée au compte, mais ne supprime pas ce qui est déjà enregistré — utilisez « Supprimer mes données » ci-dessous.'
                    : 'Withdrawing consent stops any further account-linked save, but doesn’t delete what’s already stored — use "Delete my data" below.'}
                </p>
              )}

              {/* ── Collecte pseudonymisée du questionnaire — sans compte requis ── */}
              <CollectionConsentControl
                decision={collectionDecision}
                language={language}
                withdrawal={withdrawal}
                onRetry={async () => {
                  try {
                    const { attemptSession } = await import('../lib/attemptSession.js');
                    await attemptSession.retryWithdrawals();
                  } catch { /* hors navigateur : rien à rejouer */ }
                  setWithdrawal(await readWithdrawalState());
                }}
                onGrant={async () => {
                  await recordCollectionConsent({ [PURPOSES.POLITICAL_ANALYTICS]: true }, { language });
                  setWithdrawal(await readWithdrawalState());
                }}
                onWithdraw={async () => {
                  // ⚠ ON ATTEND LE RÉSULTAT. La version précédente relisait la file après un
                  // délai de zéro milliseconde : une course avec l'import dynamique de
                  // `attemptSession` et l'écriture de la tombstone. Gagnée, l'interface
                  // affichait « suppression en cours » ; perdue, elle affichait
                  // « suppression confirmée par le serveur » — sans qu'aucun serveur n'ait
                  // répondu quoi que ce soit.
                  const issue = await withdrawCollectionConsent([PURPOSES.POLITICAL_ANALYTICS], { language });
                  setWithdrawal(mergeWithdrawal(await readWithdrawalState(), issue));
                }}
              />

              <div className="border-t border-gray-100 pt-4">
                <button
                  onClick={() => exportProfile()}
                  className="w-full border border-gray-200 text-gray-700 font-semibold py-2.5 rounded-lg text-sm hover:bg-gray-50 transition-colors mb-2"
                >
                  {fr ? '↓ Exporter mes données (JSON)' : '↓ Export my data (JSON)'}
                </button>

                {deleted ? (
                  <p className="text-xs font-medium text-green-700 bg-green-50 rounded-lg px-3 py-2.5">
                    {fr ? '✓ Mes données et confidentialité ont été supprimées.' : '✓ My data and privacy has been deleted.'}
                  </p>
                ) : (
                  <button
                    onClick={() => setConfirmingDelete(true)}
                    className="w-full border border-red-200 text-red-600 font-semibold py-2.5 rounded-lg text-sm hover:bg-red-50 transition-colors"
                  >
                    {fr ? 'Supprimer mes données en ligne' : 'Delete my online data'}
                  </button>
                )}
              </div>

              {error && <p className="text-xs text-red-500">{error}</p>}

              <p className="text-[11px] text-gray-400 border-t border-gray-100 pt-3">
                {fr
                  ? <>Pour supprimer ton compte et ton adresse email, écris à <a href="mailto:contact@poliscop.org" className="text-blue-600 hover:underline">contact@poliscop.org</a> — cette étape nécessite une intervention manuelle de notre part.</>
                  : <>To delete your account and email address, email <a href="mailto:contact@poliscop.org" className="text-blue-600 hover:underline">contact@poliscop.org</a> — this step requires manual action on our end.</>}
              </p>
            </>
          )}

          {confirmingDelete && (
            <>
              <p className="font-semibold text-gray-900">
                {fr ? 'Confirmer la suppression ?' : 'Confirm deletion?'}
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                <li>{fr ? 'Tes réponses, ton profil et tes informations démographiques (si renseignées) enregistrés sur nos serveurs seront définitivement supprimés.' : 'Your answers, profile, and demographic info (if provided) stored on our servers will be permanently deleted.'}</li>
                <li>{fr ? 'Cette action est irréversible.' : 'This action is irreversible.'}</li>
                <li>{fr ? 'Tes réponses sur cet appareil ne sont pas affectées.' : 'Your answers on this device are not affected.'}</li>
              </ul>
              <p className="text-xs text-gray-400">
                {fr ? 'Pense à exporter tes données avant si tu veux les garder.' : 'Remember to export your data first if you want to keep it.'}
              </p>
              {error && <p className="text-xs text-red-500">{error}</p>}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors"
                >
                  {deleting ? (fr ? 'Suppression…' : 'Deleting…') : (fr ? 'Oui, supprimer' : 'Yes, delete')}
                </button>
                <button
                  onClick={() => setConfirmingDelete(false)}
                  disabled={deleting}
                  className="flex-1 border border-gray-200 text-gray-600 font-semibold py-2.5 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                >
                  {fr ? 'Annuler' : 'Cancel'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
