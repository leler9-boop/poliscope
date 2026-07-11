/**
 * OnboardingModal — Post-login demographic collection
 *
 * Design: low friction, high intelligence value.
 * - Pill buttons for categorical fields (gender, commune, employment) — 1 tap
 * - Dropdowns for ordinal fields (age, education) — more options
 * - Text input for postal code (optional, geographic intelligence)
 *
 * Fields and their analytical value:
 *   gender          → "Les femmes soutiennent-elles davantage l'IVG ?" ★★★★★
 *   employment      → "Les étudiants sont-ils plus pro-européens ?"    ★★★★★
 *   commune_type    → "Les ruraux sont-ils plus souverainistes ?"       ★★★★★
 *   age_range       → Cohorte — déjà très utilisé                      ★★★★★
 *   education_level → Niveau d'études × opinions                        ★★★★☆
 *   postal_code     → Région, rural/urbain (si commune_type absent)    ★★★☆☆
 */

import React, { useState } from 'react';
import { useAuth } from '../lib/auth.jsx';
import { useStore } from '../store/useStore.js';
import { trackDemographicsCompleted, trackDemographicsSkipped } from '../lib/analytics.js';

// ── Data ──────────────────────────────────────────────────────────────────────

const AGE_RANGES = ['18-24', '25-34', '35-44', '45-54', '55-64', '65+'];

const GENDER_OPTIONS = [
  { value: 'homme',           fr: 'Homme',            en: 'Man' },
  { value: 'femme',           fr: 'Femme',            en: 'Woman' },
  { value: 'non_binaire',     fr: 'Non-binaire',      en: 'Non-binary' },
  { value: 'ne_se_prononce',  fr: 'Autre / NSP',      en: 'Other / Prefer not' },
];

const EMPLOYMENT_OPTIONS = [
  { value: 'etudiant',        fr: 'Étudiant·e',       en: 'Student' },
  { value: 'employe_salarie', fr: 'Salarié·e',        en: 'Employee' },
  { value: 'fonctionnaire',   fr: 'Fonctionnaire',    en: 'Civil servant' },
  { value: 'independant',     fr: 'Indépendant·e',    en: 'Self-employed' },
  { value: 'sans_emploi',     fr: 'Sans emploi',      en: 'Unemployed' },
  { value: 'retraite',        fr: 'Retraité·e',       en: 'Retired' },
];

const COMMUNE_OPTIONS = [
  { value: 'grande_ville',  fr: 'Grande ville',   en: 'Large city' },       // >100K
  { value: 'ville_moyenne', fr: 'Ville moyenne',  en: 'Medium city' },      // 10K–100K
  { value: 'petite_ville',  fr: 'Petite ville',   en: 'Small town' },       // 2K–10K
  { value: 'rural',         fr: 'Rural',          en: 'Rural' },            // <2K
];

const EDUCATION_LEVELS = [
  { value: 'primaire',   fr: 'Primaire',       en: 'Primary school' },
  { value: 'college',    fr: 'Collège',        en: 'Middle school' },
  { value: 'lycee',      fr: 'Lycée',          en: 'High school' },
  { value: 'bac',        fr: 'Bac',            en: 'Baccalaureate' },
  { value: 'bac_1_2',   fr: 'Bac+1/2',        en: 'Bac+1/2' },
  { value: 'bac_3',     fr: 'Bac+3',          en: "Bachelor's degree" },
  { value: 'bac_4_5',   fr: 'Bac+4/5',        en: "Master's degree" },
  { value: 'bac_5_plus',fr: 'Bac+5+',         en: 'Doctorate / Grandes Écoles' },
];

// ── Sub-components ────────────────────────────────────────────────────────────

function PillGroup({ options, value, onChange, language }) {
  const fr = language === 'fr';
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(value === opt.value ? '' : opt.value)}
          className={[
            'px-3 py-1.5 rounded-full text-sm font-medium border transition-all',
            value === opt.value
              ? 'bg-blue-600 border-blue-600 text-white'
              : 'bg-white border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600',
          ].join(' ')}
        >
          {fr ? opt.fr : opt.en}
        </button>
      ))}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function OnboardingModal() {
  const language           = useStore(s => s.language);
  const setNeedsOnboarding = useStore(s => s.setNeedsOnboarding);
  const hasConsent         = useStore(s => s.consent?.politicalData === true);
  const { saveDemographics } = useAuth();
  const fr = language === 'fr';

  // ── State ──
  const [gender,          setGender]          = useState('');
  const [ageRange,        setAgeRange]        = useState('');
  const [communeType,     setCommuneType]     = useState('');
  const [employmentStatus, setEmploymentStatus] = useState('');
  const [educationLevel,  setEducationLevel]  = useState('');
  const [postalCode,      setPostalCode]      = useState('');
  const [saving,          setSaving]          = useState(false);
  const [saveError,       setSaveError]       = useState(false);

  async function handleSave() {
    setSaving(true);
    setSaveError(false);
    const { error } = await saveDemographics({
      gender:           gender           || null,
      age_range:        ageRange         || null,
      commune_type:     communeType      || null,
      employment_status: employmentStatus || null,
      education_level:  educationLevel   || null,
      postal_code:      postalCode       || null,
    });
    setSaving(false);
    if (error) { setSaveError(true); return; }
    trackDemographicsCompleted({
      gender:           gender           || null,
      ageRange:         ageRange         || null,
      communeType:      communeType      || null,
      employmentStatus: employmentStatus || null,
      educationLevel:   educationLevel   || null,
      hasPostalCode:    !!postalCode,
    });
    setNeedsOnboarding(false);
  }

  async function handleSkip() {
    setSaveError(false);
    const { error } = await saveDemographics({
      gender: null, age_range: null, commune_type: null,
      employment_status: null, education_level: null, postal_code: null,
    });
    if (error) { setSaveError(true); return; }
    trackDemographicsSkipped();
    setNeedsOnboarding(false);
  }

  const filledCount = [gender, ageRange, communeType, employmentStatus, educationLevel, postalCode]
    .filter(Boolean).length;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 px-0 sm:px-4">
      <div className="bg-white rounded-t-2xl sm:rounded-xl shadow-xl w-full sm:max-w-md max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white rounded-t-2xl sm:rounded-t-xl border-b border-gray-100 px-6 pt-5 pb-4">
          <h2 className="text-base font-bold text-gray-900">
            {fr ? 'Qui es-tu ?' : 'Tell us about yourself'}
          </h2>
          <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
            {hasConsent
              ? (fr
                  ? 'Ces informations aident Poliscop à mieux comprendre les opinions des Français. Elles restent liées à ton compte, mais ne sont jamais analysées individuellement — uniquement en groupe.'
                  : 'This helps Poliscop understand French political opinions. It stays linked to your account, but is never analyzed individually — only in grouped form.')
              : (fr
                  ? 'Ces informations restent uniquement sur cet appareil tant que tu n’actives pas la sauvegarde en ligne — elles ne sont pas envoyées à nos serveurs.'
                  : 'This stays only on this device unless you enable cloud save — it isn’t sent to our servers.')}
          </p>
          {/* Progress dots */}
          {filledCount > 0 && (
            <div className="flex gap-1 mt-2">
              {[0,1,2,3,4,5].map(i => (
                <div
                  key={i}
                  className={`h-1 w-1 rounded-full transition-colors ${i < filledCount ? 'bg-blue-500' : 'bg-gray-200'}`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="px-6 py-4 space-y-5">
          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {fr ? 'Genre' : 'Gender'}
              <span className="ml-1.5 text-xs font-normal text-gray-400">★★★★★</span>
            </label>
            <PillGroup options={GENDER_OPTIONS} value={gender} onChange={setGender} language={language} />
          </div>

          {/* Age range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              {fr ? "Tranche d'âge" : 'Age range'}
              <span className="ml-1.5 text-xs font-normal text-gray-400">★★★★★</span>
            </label>
            <select
              value={ageRange}
              onChange={e => setAgeRange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">{fr ? 'Non renseigné' : 'Prefer not to say'}</option>
              {AGE_RANGES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          {/* Commune type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {fr ? 'Tu habites plutôt…' : 'You live in…'}
              <span className="ml-1.5 text-xs font-normal text-gray-400">★★★★★</span>
            </label>
            <PillGroup options={COMMUNE_OPTIONS} value={communeType} onChange={setCommuneType} language={language} />
          </div>

          {/* Employment status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {fr ? 'Statut professionnel' : 'Professional status'}
              <span className="ml-1.5 text-xs font-normal text-gray-400">★★★★★</span>
            </label>
            <PillGroup options={EMPLOYMENT_OPTIONS} value={employmentStatus} onChange={setEmploymentStatus} language={language} />
          </div>

          {/* Separator */}
          <div className="border-t border-gray-100 pt-1">
            <p className="text-[11px] text-gray-400 mb-3 uppercase tracking-wide font-medium">
              {fr ? 'Optionnel' : 'Optional'}
            </p>
          </div>

          {/* Education level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              {fr ? "Niveau d'études" : 'Education level'}
            </label>
            <select
              value={educationLevel}
              onChange={e => setEducationLevel(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">{fr ? 'Non renseigné' : 'Prefer not to say'}</option>
              {EDUCATION_LEVELS.map(lvl => (
                <option key={lvl.value} value={lvl.value}>
                  {fr ? lvl.fr : lvl.en}
                </option>
              ))}
            </select>
          </div>

          {/* Postal code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              {fr ? 'Code postal' : 'Postal code'}
            </label>
            <input
              type="text"
              value={postalCode}
              onChange={e => setPostalCode(e.target.value)}
              maxLength={10}
              placeholder={fr ? 'Ex: 75001' : 'e.g. 75001'}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Privacy */}
          <p className="text-[11px] text-gray-400 italic leading-relaxed">
            {fr
              ? 'Aucune donnée personnelle n\'est vendue ou partagée. Les analyses que nous publions sont toujours groupées, jamais individuelles.'
              : 'No personal data is sold or shared. Analysis we publish is always grouped, never individual.'}
          </p>

          {saveError && (
            <p className="text-xs text-red-500">
              {fr ? 'Une erreur est survenue. Veuillez réessayer.' : 'Something went wrong. Please try again.'}
            </p>
          )}

          {/* Actions */}
          <div className="flex gap-3 pb-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors"
            >
              {saving
                ? (fr ? 'Enregistrement…' : 'Saving…')
                : (fr ? 'Enregistrer' : 'Save')}
            </button>
            <button
              onClick={handleSkip}
              disabled={saving}
              className="px-4 py-2.5 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-40 font-medium"
            >
              {fr ? 'Passer' : 'Skip'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
