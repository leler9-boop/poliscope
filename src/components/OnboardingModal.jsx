import React, { useState } from 'react';
import { useAuth } from '../lib/auth.jsx';
import { useStore } from '../store/useStore.js';

const AGE_RANGES = ['18-24', '25-34', '35-44', '45-54', '55-64', '65+'];

const EDUCATION_LEVELS = [
  { value: 'primaire',  fr: `Primaire`,    en: `Primary school` },
  { value: 'college',   fr: `Collège`,     en: `Middle school` },
  { value: 'lycee',     fr: `Lycée`,       en: `High school` },
  { value: 'bac',       fr: `Bac`,         en: `Baccalaureate` },
  { value: 'bac_1_2',   fr: `Bac+1/2`,    en: `Bac+1/2` },
  { value: 'bac_3',     fr: `Bac+3`,       en: `Bachelor's degree` },
  { value: 'bac_4_5',   fr: `Bac+4/5`,    en: `Master's degree` },
  { value: 'bac_5_plus',fr: `Bac+5+`,     en: `Doctorate / Grandes Écoles` },
];

export default function OnboardingModal() {
  const language          = useStore(s => s.language);
  const setNeedsOnboarding = useStore(s => s.setNeedsOnboarding);
  const { saveDemographics } = useAuth();
  const fr = language === 'fr';

  const [ageRange,        setAgeRange]        = useState('');
  const [educationLevel,  setEducationLevel]  = useState('');
  const [postalCode,      setPostalCode]      = useState('');
  const [saving,          setSaving]          = useState(false);
  const [saveError,       setSaveError]       = useState(false);

  async function handleSave() {
    setSaving(true);
    setSaveError(false);
    const { error } = await saveDemographics({
      age_range:       ageRange        || null,
      education_level: educationLevel  || null,
      postal_code:     postalCode      || null,
    });
    setSaving(false);
    if (error) {
      setSaveError(true);
      return; // keep modal open — do not dismiss until save succeeds
    }
    setNeedsOnboarding(false);
  }

  // Skip: still create a record so onboarding doesn't re-trigger on next login
  async function handleSkip() {
    setSaveError(false);
    const { error } = await saveDemographics({ age_range: null, education_level: null, postal_code: null });
    if (error) {
      setSaveError(true);
      return; // keep modal open — do not dismiss until save succeeds
    }
    setNeedsOnboarding(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-1">
          {fr ? `Complétez votre profil` : `Complete your profile`}
        </h2>
        <p className="text-sm text-gray-500 mb-5">
          {fr
            ? `Ces informations sont optionnelles et nous aident à améliorer Poliscop.`
            : `These details are optional and help us improve Poliscop.`}
        </p>

        <div className="space-y-4">
          {/* Age range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {fr ? `Tranche d'âge` : `Age range`}
            </label>
            <select
              value={ageRange}
              onChange={e => setAgeRange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">{fr ? `Non renseigné` : `Prefer not to say`}</option>
              {AGE_RANGES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          {/* Education level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {fr ? `Niveau d'études` : `Education level`}
            </label>
            <select
              value={educationLevel}
              onChange={e => setEducationLevel(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">{fr ? `Non renseigné` : `Prefer not to say`}</option>
              {EDUCATION_LEVELS.map(lvl => (
                <option key={lvl.value} value={lvl.value}>
                  {fr ? lvl.fr : lvl.en}
                </option>
              ))}
            </select>
          </div>

          {/* Postal code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {fr ? `Code postal` : `Postal code`}
            </label>
            <input
              type="text"
              value={postalCode}
              onChange={e => setPostalCode(e.target.value)}
              maxLength={10}
              placeholder={fr ? `Ex: 75001` : `e.g. 75001`}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Privacy disclaimer */}
        <p className="mt-4 text-xs text-gray-400 italic leading-relaxed">
          {fr
            ? `Les données sont utilisées uniquement de manière anonymisée. Aucune donnée personnelle n'est vendue ou partagée.`
            : `Data is used in anonymized form only. No personal data is sold or shared.`}
        </p>

        {saveError && (
          <p className="mt-3 text-xs text-red-500">
            {fr
              ? `Une erreur est survenue. Veuillez réessayer.`
              : `Something went wrong. Please try again.`}
          </p>
        )}

        <div className="mt-5 flex gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors"
          >
            {saving
              ? (fr ? `Enregistrement…` : `Saving…`)
              : (fr ? `Enregistrer` : `Save`)}
          </button>
          <button
            onClick={handleSkip}
            disabled={saving}
            className="px-4 py-2.5 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-40 font-medium"
          >
            {fr ? `Passer` : `Skip`}
          </button>
        </div>
      </div>
    </div>
  );
}
