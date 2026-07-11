/**
 * DataControlsModal — RGPD self-service controls for cloud-stored political
 * data: view consent status, withdraw consent, permanently delete cloud
 * data. Reachable from Profile.jsx, logged-in users only (guests have
 * nothing stored server-side by construction — see Étape 2 of the RGPD
 * remediation, audit/rgpd-remediation-2026-07/).
 *
 * Does NOT touch local browser data (see resetProfile in useStore.js) or
 * the Supabase Auth account itself (email/login) — full account deletion
 * needs service_role access this client-side app doesn't have, so users are
 * pointed to email support instead. See auth.jsx's deleteMyData() docstring.
 */
import React, { useState } from 'react';
import { useStore } from '../store/useStore.js';
import { useAuth } from '../lib/auth.jsx';

export default function DataControlsModal({ onClose }) {
  const language       = useStore(s => s.language);
  const consent        = useStore(s => s.consent);
  const exportProfile  = useStore(s => s.exportProfile);
  const { revokeConsent, deleteMyData } = useAuth();
  const fr = language === 'fr';

  const [revoking, setRevoking]             = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleting, setDeleting]             = useState(false);
  const [deleted, setDeleted]               = useState(false);
  const [error, setError]                   = useState(null);

  const hasConsent = consent?.politicalData === true;

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
            {fr ? 'Tes données en ligne' : 'Your online data'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg leading-none">✕</button>
        </div>

        <div className="px-6 py-4 space-y-4 text-sm text-gray-700 leading-relaxed">
          {!confirmingDelete && (
            <>
              <div className={`rounded-lg px-3 py-2.5 text-xs font-medium ${hasConsent ? 'bg-blue-50 text-blue-700' : 'bg-gray-50 text-gray-500'}`}>
                {hasConsent
                  ? (fr
                      ? '☁ Sauvegarde en ligne activée — tes réponses et ton profil sont stockés sur nos serveurs, liés à ton compte.'
                      : '☁ Cloud save enabled — your answers and profile are stored on our servers, linked to your account.')
                  : (fr
                      ? 'Sauvegarde en ligne désactivée — tes réponses restent uniquement sur cet appareil.'
                      : 'Cloud save disabled — your answers stay only on this device.')}
              </div>

              {hasConsent && (
                <button
                  onClick={handleRevoke}
                  disabled={revoking}
                  className="w-full border border-gray-200 text-gray-700 font-semibold py-2.5 rounded-lg text-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  {revoking ? (fr ? 'Retrait en cours…' : 'Withdrawing…') : (fr ? 'Retirer mon accord' : 'Withdraw consent')}
                </button>
              )}
              <p className="text-xs text-gray-400">
                {fr
                  ? 'Retirer ton accord arrête toute nouvelle sauvegarde, mais ne supprime pas ce qui est déjà enregistré — utilise « Supprimer mes données » ci-dessous pour ça.'
                  : 'Withdrawing consent stops any further save, but doesn’t delete what’s already stored — use "Delete my data" below for that.'}
              </p>

              <div className="border-t border-gray-100 pt-4">
                <button
                  onClick={() => exportProfile()}
                  className="w-full border border-gray-200 text-gray-700 font-semibold py-2.5 rounded-lg text-sm hover:bg-gray-50 transition-colors mb-2"
                >
                  {fr ? '↓ Exporter mes données (JSON)' : '↓ Export my data (JSON)'}
                </button>

                {deleted ? (
                  <p className="text-xs font-medium text-green-700 bg-green-50 rounded-lg px-3 py-2.5">
                    {fr ? '✓ Tes données en ligne ont été supprimées.' : '✓ Your online data has been deleted.'}
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
