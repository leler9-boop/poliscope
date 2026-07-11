/**
 * ConsentModal — Explicit RGPD consent before any server-side save of political answers.
 *
 * Shown once per account decision (grant or decline), triggered by an explicit
 * user action — clicking "☁ Enregistrer" or the migration banner's "Oui" in
 * Profile.jsx — never on page load, never bundled into the signup form. No
 * option is pre-selected. Declining is a first-class, equally-sized choice,
 * not a de-emphasised "skip" link, and never blocks using the app.
 *
 * Design constraints from the mission brief this implements:
 * - understandable by a teenager, not legally misleading
 * - explicit about: what data, why, how long, what it's used for, how to
 *   withdraw, how to delete, that the app works without server save
 * - account creation is NOT treated as consent — this is a separate step
 */
import React from 'react';
import { useStore, CONSENT_VERSION } from '../store/useStore.js';

export default function ConsentModal({ onDecided }) {
  const language    = useStore(s => s.language);
  const setConsent  = useStore(s => s.setConsent);
  const fr = language === 'fr';

  function decide(granted) {
    setConsent(granted);
    onDecided?.(granted);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 px-0 sm:px-4">
      <div className="bg-white rounded-t-2xl sm:rounded-xl shadow-xl w-full sm:max-w-md max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white rounded-t-2xl sm:rounded-t-xl border-b border-gray-100 px-6 pt-5 pb-4">
          <h2 className="text-base font-bold text-gray-900">
            {fr ? 'Sauvegarder tes réponses en ligne ?' : 'Save your answers online?'}
          </h2>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
            {fr
              ? 'Pour l’instant, tes réponses restent uniquement sur cet appareil — personne d’autre ne peut les voir.'
              : 'Right now, your answers stay only on this device — no one else can see them.'}
          </p>
        </div>

        <div className="px-6 py-4 space-y-4 text-sm text-gray-700 leading-relaxed">
          <div>
            <p className="font-semibold text-gray-900 mb-1">
              {fr ? 'Si tu acceptes, on enregistre :' : 'If you agree, we store:'}
            </p>
            <ul className="list-disc list-inside space-y-0.5 text-gray-600">
              <li>{fr ? 'Ta réponse à chaque question (de 1 à 5)' : 'Your answer to each question (1 to 5)'}</li>
              <li>{fr ? 'Ton profil politique calculé (tes scores par thème)' : 'Your computed political profile (your scores per theme)'}</li>
            </ul>
          </div>

          <div>
            <p className="font-semibold text-gray-900 mb-1">{fr ? 'Pourquoi' : 'Why'}</p>
            <p>
              {fr
                ? 'Pour que tu retrouves ton profil si tu changes d’appareil ou effaces ton navigateur, en te reconnectant simplement à ton compte.'
                : 'So you can get your profile back if you switch devices or clear your browser, just by signing back in.'}
            </p>
          </div>

          <div>
            <p className="font-semibold text-gray-900 mb-1">{fr ? 'Combien de temps' : 'How long'}</p>
            <p>
              {fr
                ? 'Tant que ton compte existe, ou jusqu’à ce que tu en demandes la suppression — à tout moment.'
                : 'As long as your account exists, or until you request their deletion — any time.'}
            </p>
          </div>

          <div>
            <p className="font-semibold text-gray-900 mb-1">{fr ? 'À quoi ça sert' : 'What it’s used for'}</p>
            <ul className="list-disc list-inside space-y-0.5 text-gray-600">
              <li>{fr ? 'Te montrer ton profil, où que tu te connectes.' : 'Showing you your profile, wherever you sign in.'}</li>
              <li>
                {fr
                  ? 'De façon groupée (jamais avec ton nom), comprendre les grandes tendances politiques en France — par exemple, si telle tranche d’âge est plutôt favorable à telle mesure.'
                  : 'In grouped form (never with your name), understanding broad political trends in France — e.g. whether a given age group tends to favour a given policy.'}
              </li>
            </ul>
            <p className="mt-1 text-gray-500">
              {fr
                ? 'Jamais vendu. Jamais utilisé pour te cibler avec de la publicité.'
                : 'Never sold. Never used to target you with advertising.'}
            </p>
          </div>

          <div>
            <p className="font-semibold text-gray-900 mb-1">
              {fr ? 'Changer d’avis' : 'Changing your mind'}
            </p>
            <p>
              {fr
                ? <>Tu peux retirer ton accord ou demander la suppression de tes données à tout moment, en écrivant à <a href="mailto:contact@poliscop.org" className="text-blue-600 hover:underline">contact@poliscop.org</a> (voir notre politique de confidentialité).</>
                : <>You can withdraw consent or request deletion of your data any time by emailing <a href="mailto:contact@poliscop.org" className="text-blue-600 hover:underline">contact@poliscop.org</a> (see our privacy policy).</>}
            </p>
          </div>

          <p className="text-xs text-gray-400 italic border-t border-gray-100 pt-3">
            {fr
              ? 'Sans ton accord, tu peux quand même répondre à toutes les questions et voir ton profil — juste sans sauvegarde en ligne.'
              : 'Without your consent, you can still answer every question and see your profile — just without an online save.'}
          </p>

          <div className="flex flex-col gap-2 pb-2">
            <button
              onClick={() => decide(true)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors"
            >
              {fr ? "J'accepte la sauvegarde en ligne" : 'I agree to the online save'}
            </button>
            <button
              onClick={() => decide(false)}
              className="w-full border border-gray-200 text-gray-600 font-semibold py-2.5 rounded-lg text-sm hover:bg-gray-50 transition-colors"
            >
              {fr ? 'Non merci, je reste en local' : 'No thanks, keep it on this device'}
            </button>
          </div>

          <p className="text-[10px] text-gray-300 text-center">
            {fr ? 'Version du texte de consentement' : 'Consent text version'}: {CONSENT_VERSION}
          </p>
        </div>
      </div>
    </div>
  );
}
