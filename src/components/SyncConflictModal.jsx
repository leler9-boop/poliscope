import React, { useState } from 'react';
import { useStore } from '../store/useStore.js';
import { useAuth } from '../lib/auth.jsx';

export default function SyncConflictModal() {
  const language       = useStore(s => s.language);
  const syncConflict   = useStore(s => s.syncConflict);
  const setSyncConflict = useStore(s => s.setSyncConflict);
  const hydrateFromCloud = useStore(s => s.hydrateFromCloud);
  const answers        = useStore(s => s.answers);
  const { saveAnswers } = useAuth();
  const fr = language === 'fr';

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!syncConflict) return null;
  const { remoteAnswers, remoteCount, localCount } = syncConflict;

  // Conserver le local : pousse l'état local vers Supabase — y compris la SUPPRESSION des
  // lignes distantes correspondant aux questions passées en « sans opinion ». C'est la
  // primitive syncAnswersToCloud() qui s'en charge (voir src/lib/cloudAnswers.js).
  // La modale ne se ferme QUE si la synchronisation a réussi : la refermer sur une erreur
  // laisserait l'utilisateur croire son choix appliqué alors que le cloud diverge encore.
  async function handleKeepLocal() {
    setLoading(true);
    setError(null);
    const res = await saveAnswers(answers);
    setLoading(false);
    if (res?.error) {
      setError(fr
        ? 'La synchronisation a échoué : votre profil sauvegardé n’a pas été mis à jour. Vos réponses restent intactes sur cet appareil.'
        : 'Sync failed: your saved profile was not updated. Your answers remain intact on this device.');
      return;
    }
    setSyncConflict(null);
  }

  // Use remote: hydrate store with remote answers, close modal
  async function handleUseRemote() {
    setLoading(true);
    hydrateFromCloud(remoteAnswers);
    setSyncConflict(null);
    setLoading(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6">
        <h2 className="text-base font-bold text-gray-900 mb-2">
          {fr ? `Deux profils détectés` : `Two profiles found`}
        </h2>
        {error && (
          <p role="alert" className="text-xs text-red-600 leading-relaxed bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4">
            {error}
          </p>
        )}
        <p className="text-sm text-gray-500 mb-5 leading-relaxed">
          {fr
            ? `Votre profil local et votre profil sauvegardé sont différents. Lequel voulez-vous conserver ?`
            : `Your local profile and your saved profile differ. Which one do you want to keep?`}
        </p>

        <div className="flex flex-col gap-3">
          {/* Keep local (more advanced) */}
          <button
            onClick={handleKeepLocal}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors"
          >
            {fr
              ? `Garder celui-ci (${localCount} réponses)`
              : `Keep this one (${localCount} answers)`}
          </button>

          {/* Use remote */}
          <button
            onClick={handleUseRemote}
            disabled={loading}
            className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-2.5 rounded-lg text-sm transition-colors"
          >
            {fr
              ? `Utiliser le profil sauvegardé (${remoteCount} réponses)`
              : `Use saved profile (${remoteCount} answers)`}
          </button>
        </div>
      </div>
    </div>
  );
}
