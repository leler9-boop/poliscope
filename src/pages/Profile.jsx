import React, { useRef, useState, useMemo } from 'react';
import { useStore } from '../store/useStore.js';
import { createTranslator } from '../i18n/translations.js';
import { getConfidenceMeta, AXES_LABELS } from '../engine/scorer.js';
import { THEMES_ORDER, THEME_LABELS, THEME_COLORS } from '../data/questions.js';
import { rankByAlignment, alignmentBarColor, alignmentColorClass } from '../engine/matcher.js';
import { ideologicalCurrents } from '../data/ideologicalCurrents.js';
import { generateProfileSummary } from '../engine/profileSummary.js';
import { refinementThemes } from '../data/refinementThemes.js';
import RadarChart from '../components/RadarChart.jsx';
import AxisBar from '../components/AxisBar.jsx';
import { useAuth } from '../lib/auth.jsx';
import { isSupabaseEnabled } from '../lib/supabase.js';

/** Apply manual adjustments on top of computed theme scores. */
function buildAdjustedThemes(themes, adjustments) {
  if (!adjustments || Object.keys(adjustments).length === 0) return themes;
  const result = { ...themes };
  Object.entries(adjustments).forEach(([k, v]) => {
    if (result[k] != null) result[k] = Math.max(0, Math.min(100, result[k] + v));
  });
  return result;
}

export default function Profile() {
  const language           = useStore(s => s.language);
  const profile            = useStore(s => s.profile);
  const answers            = useStore(s => s.answers);
  const priorityOrder      = useStore(s => s.priorityOrder);
  const profileAdjustments = useStore(s => s.profileAdjustments);
  const applyRefinement    = useStore(s => s.applyRefinement);
  const resetAdjustments   = useStore(s => s.resetAdjustments);
  const navigate        = useStore(s => s.navigate);
  const exportProfile   = useStore(s => s.exportProfile);
  const importProfile   = useStore(s => s.importProfile);
  const resetProfile    = useStore(s => s.resetProfile);
  const startRefinement    = useStore(s => s.startRefinement);
  const startImproveMode   = useStore(s => s.startImproveMode);
  const pendingMigration   = useStore(s => s.pendingMigration);
  const setPendingMigration = useStore(s => s.setPendingMigration);
  const t = createTranslator(language);
  const fileRef = useRef(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null); // null | 'saving' | 'saved' | 'error'

  const [showAllCurrents, setShowAllCurrents] = useState(false);

  // Refinement UI state
  const [refineOpen, setRefineOpen] = useState(false);
  const [refineStep, setRefineStep] = useState(1); // 1 | 2 | 3
  const [selectedRefinementTheme, setSelectedRefinementTheme] = useState(null);
  const [selectedSubtheme, setSelectedSubtheme] = useState(null);
  const [sliderValue, setSliderValue] = useState(0);

  const { user, saveAnswers, saveUserProfile } = useAuth();

  if (!profile) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="text-5xl mb-4">📋</div>
        <h2 className="text-xl font-bold text-gray-900 mb-3">
          {language === 'fr' ? 'Aucun profil trouvé' : 'No profile yet'}
        </h2>
        <p className="text-gray-500 mb-6">
          {language === 'fr'
            ? 'Répondez au questionnaire pour générer votre profil politique.'
            : 'Complete the questionnaire to generate your political profile.'}
        </p>
        <button
          onClick={() => navigate('selectTest')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
        >
          {t('landing_cta_primary')}
        </button>
      </div>
    );
  }

  const { themes: rawThemes, axes, confidence, confidenceScore, answeredCount, totalQuestions } = profile;
  const themes = useMemo(
    () => buildAdjustedThemes(rawThemes, profileAdjustments),
    [rawThemes, profileAdjustments]
  );
  const adjustedProfile = useMemo(() => ({ ...profile, themes }), [profile, themes]);
  const confMeta = getConfidenceMeta(confidence, language);
  const rankedCurrents = useMemo(
    () => rankByAlignment(adjustedProfile, ideologicalCurrents, priorityOrder),
    [adjustedProfile, priorityOrder]
  );
  const profileSummary = useMemo(
    () => generateProfileSummary(themes, rankedCurrents, language),
    [themes, rankedCurrents, language]
  );
  const hasAdjustments = Object.keys(profileAdjustments).length > 0;
  const adjustmentCount = Object.values(profileAdjustments).filter(v => v !== 0).length;
  const answeredTotal = Object.keys(answers).length;
  const unansweredCount = totalQuestions - answeredTotal;

  // Confidence bar color
  const confBarColor =
    confidenceScore >= 80 ? '#059669' :  // emerald-600
    confidenceScore >= 60 ? '#16a34a' :  // green-600
    confidenceScore >= 40 ? '#2563eb' :  // blue-600
    confidenceScore >= 20 ? '#d97706' :  // amber-600
    '#ef4444';                           // red-500

  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const ok = importProfile(ev.target.result);
      if (!ok) alert(language === 'fr' ? 'Fichier invalide' : 'Invalid file');
    };
    reader.readAsText(file);
  };

  const axisKeys = ['economic', 'social', 'institutional', 'international'];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Header */}
      <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{t('profile_title')}</h1>
          <p className="text-gray-500 mt-1 text-sm">{t('profile_subtitle')}</p>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 flex-wrap">
          {/* Cloud save — shown when Supabase is configured */}
          {isSupabaseEnabled && (
            user ? (
              <button
                onClick={async () => {
                  setSaveStatus('saving');
                  const [a, p] = await Promise.all([saveAnswers(answers), saveUserProfile(profile)]);
                  setSaveStatus(!a.error && !p.error ? 'saved' : 'error');
                  setTimeout(() => setSaveStatus(null), 3000);
                }}
                disabled={saveStatus === 'saving'}
                className={`flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg border transition-colors ${
                  saveStatus === 'saved'  ? 'border-green-300 bg-green-50 text-green-700' :
                  saveStatus === 'error'  ? 'border-red-300 bg-red-50 text-red-700' :
                  saveStatus === 'saving' ? 'border-blue-200 bg-blue-50 text-blue-600 opacity-70' :
                  'border-blue-200 text-blue-600 hover:bg-blue-50'
                }`}
              >
                {saveStatus === 'saving' ? '…' : saveStatus === 'saved' ? '✓' : saveStatus === 'error' ? '✗' : '☁'}
                {saveStatus === 'saved'  ? (language === 'fr' ? 'Enregistré' : 'Saved') :
                 saveStatus === 'error'  ? (language === 'fr' ? 'Erreur' : 'Error') :
                 saveStatus === 'saving' ? (language === 'fr' ? 'Enregistrement…' : 'Saving…') :
                 (language === 'fr' ? 'Enregistrer' : 'Save to cloud')}
              </button>
            ) : (
              <button
                onClick={() => navigate('auth')}
                className="flex items-center gap-1.5 text-xs font-medium text-blue-600 border border-blue-200 px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors"
              >
                ☁ {language === 'fr' ? 'Connexion pour sauvegarder' : 'Sign in to save'}
              </button>
            )
          )}

          <button
            onClick={exportProfile}
            className="flex items-center gap-1.5 text-xs font-medium text-gray-600 border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            ↓ {t('profile_export')}
          </button>
          <button
            onClick={() => fileRef.current?.click()}
            className="flex items-center gap-1.5 text-xs font-medium text-gray-600 border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            ↑ {t('profile_import')}
          </button>
          <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={handleImport} />
          <button
            onClick={() => setShowResetConfirm(true)}
            className="flex items-center gap-1.5 text-xs font-medium text-red-500 border border-red-200 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors"
          >
            ✕ {t('profile_reset')}
          </button>
        </div>
      </div>

      {/* Reset confirmation */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="font-bold text-gray-900 mb-2">{t('profile_reset')}</h3>
            <p className="text-sm text-gray-500 mb-5">{t('profile_reset_confirm')}</p>
            <div className="flex gap-3">
              <button
                onClick={() => { resetProfile(); setShowResetConfirm(false); }}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors"
              >
                {t('yes')}
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 border border-gray-200 text-gray-600 font-semibold py-2.5 rounded-lg text-sm hover:bg-gray-50 transition-colors"
              >
                {t('cancel')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Migration banner */}
      {pendingMigration && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4 flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex-1">
            <p className="text-sm font-semibold text-blue-900">{t('migrate_title')}</p>
            <p className="text-xs text-blue-700 mt-0.5">{t('migrate_subtitle')}</p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={async () => {
                setSaveStatus('saving');
                const [a, p] = await Promise.all([saveAnswers(answers), saveUserProfile(profile)]);
                setSaveStatus(!a.error && !p.error ? 'saved' : 'error');
                setTimeout(() => setSaveStatus(null), 3000);
                setPendingMigration(false);
              }}
              className="text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg transition-colors"
            >
              {t('migrate_yes')}
            </button>
            <button
              onClick={() => setPendingMigration(false)}
              className="text-xs font-medium text-blue-600 hover:text-blue-800 px-3 py-1.5"
            >
              {t('migrate_no')}
            </button>
          </div>
        </div>
      )}

      {/* Confidence bar */}
      <div className={`p-4 rounded-xl border mb-6 ${confMeta.bg} ${confMeta.border}`}>
        <div className="flex items-center justify-between mb-2">
          <span className={`text-sm font-semibold ${confMeta.color}`}>{t('confidence_label')}</span>
          <span className={`text-sm font-bold ${confMeta.color}`}>{confidenceScore ?? 0}%</span>
        </div>
        <div className="h-2.5 bg-white bg-opacity-60 rounded-full overflow-hidden mb-2">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${confidenceScore ?? 0}%`, backgroundColor: confBarColor }}
          />
        </div>
        <div className="flex items-start justify-between gap-3">
          <p className="text-xs text-gray-600 flex-1">{confMeta.message}</p>
          <span className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0">
            {t('profile_answered', { n: answeredTotal })} {t('profile_of_total', { total: totalQuestions })}
          </span>
        </div>
        {(confidenceScore ?? 0) < 40 && (
          <button
            onClick={startImproveMode}
            className="mt-3 text-xs font-semibold bg-white border border-current px-3 py-1.5 rounded-lg hover:bg-opacity-80 transition-colors"
            style={{ color: confBarColor, borderColor: confBarColor }}
          >
            {t('confidence_improve_cta')} →
          </button>
        )}
      </div>

      {/* Profile summary */}
      {profileSummary && (
        <div className="bg-white border border-gray-100 rounded-xl p-5 mb-6">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
            {t('profile_summary_title')}
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">{profileSummary}</p>
          {hasAdjustments && (
            <p className="mt-2 text-xs text-blue-600 font-medium">
              ✎ {t('refine_active', { n: adjustmentCount })}
            </p>
          )}
        </div>
      )}

      {/* Main grid */}
      <div className="grid sm:grid-cols-2 gap-6 mb-6">

        {/* Radar chart */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-bold text-gray-900 mb-5">{t('profile_themes_title')}</h2>
          <div className="flex justify-center">
            <RadarChart themes={themes} language={language} size={280} />
          </div>
        </div>

        {/* Theme scores list */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-bold text-gray-900 mb-5">{t('profile_themes_title')}</h2>
          <div className="space-y-3">
            {THEMES_ORDER.map(theme => {
              const score = themes[theme] ?? 50;
              const label = THEME_LABELS[language]?.[theme] ?? theme;
              const color = THEME_COLORS[theme] ?? '#6b7280';
              return (
                <div key={theme}>
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                      <span className="text-sm font-medium text-gray-700">{label}</span>
                    </div>
                    <span className="text-sm font-bold text-gray-900">{score}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${score}%`, backgroundColor: color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Ideological axes */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
        <h2 className="font-bold text-gray-900 mb-5">{t('profile_axes_title')}</h2>
        <div className="grid sm:grid-cols-2 gap-x-10">
          {axisKeys.map(axisKey => {
            const axisInfo = AXES_LABELS[axisKey]?.[language];
            if (!axisInfo) return null;
            return (
              <AxisBar
                key={axisKey}
                label={axisInfo.label}
                score={axes[axisKey] ?? 50}
                leftLabel={axisInfo.left}
                rightLabel={axisInfo.right}
              />
            );
          })}
        </div>
      </div>

      {/* Ideological Currents */}
      <div className="mb-6">
        <div className="mb-5">
          <h2 className="font-bold text-gray-900 text-lg">{t('currents_title')}</h2>
          <p className="text-sm text-gray-500 mt-1">{t('currents_subtitle')}</p>
        </div>

        {/* Top 3 currents */}
        <div className="space-y-3">
          {rankedCurrents.slice(0, 3).map((current, idx) => {
            const barColor = alignmentBarColor(current.alignment);
            const textColor = alignmentColorClass(current.alignment);
            return (
              <div key={current.id} className="bg-white border border-gray-100 rounded-xl p-4 sm:p-5">
                <div className="flex items-start gap-3">
                  <span className="text-xl mt-0.5 flex-shrink-0">{current.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        {idx === 0 && (
                          <span
                            className="text-xs font-semibold px-2 py-0.5 rounded-full text-white"
                            style={{ backgroundColor: current.color }}
                          >
                            {t('currents_top_match')}
                          </span>
                        )}
                        <h3 className="font-semibold text-gray-900 text-sm">
                          {current.name[language]}
                        </h3>
                      </div>
                      <span className={`text-lg font-bold tabular-nums flex-shrink-0 ${textColor}`}>
                        {current.alignment}%
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed mb-2">
                      {current.shortDesc[language]}
                    </p>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-3">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${current.alignment}%`, backgroundColor: barColor }}
                      />
                    </div>
                    {idx === 0 && current.keyBeliefs?.[language] && (
                      <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
                          {t('currents_key_beliefs')}
                        </p>
                        <ul className="space-y-1">
                          {current.keyBeliefs[language].map((belief, bi) => (
                            <li key={bi} className="text-xs text-gray-600 flex items-start gap-1.5">
                              <span className="text-gray-300 mt-0.5 flex-shrink-0">·</span>
                              {belief}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Toggle all */}
        <button
          onClick={() => setShowAllCurrents(!showAllCurrents)}
          className="mt-3 text-xs font-medium text-blue-500 hover:text-blue-700 transition-colors"
        >
          {showAllCurrents ? t('currents_show_less') : t('currents_show_all')} {showAllCurrents ? '▲' : '▼'}
        </button>

        {/* All remaining currents */}
        {showAllCurrents && (
          <div className="mt-3 grid sm:grid-cols-2 gap-3">
            {rankedCurrents.slice(3).map(current => {
              const barColor = alignmentBarColor(current.alignment);
              const textColor = alignmentColorClass(current.alignment);
              return (
                <div key={current.id} className="bg-white border border-gray-100 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-base">{current.icon}</span>
                    <span className="font-medium text-gray-900 text-sm">{current.name[language]}</span>
                    <span className={`ml-auto text-sm font-bold tabular-nums ${textColor}`}>
                      {current.alignment}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${current.alignment}%`, backgroundColor: barColor }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Profile Refinement */}
      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden mb-6">
        <button
          onClick={() => { setRefineOpen(!refineOpen); setRefineStep(1); setSelectedRefinementTheme(null); setSelectedSubtheme(null); setSliderValue(0); }}
          className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
        >
          <div>
            <p className="font-semibold text-gray-800 text-sm">{t('refine_title')}</p>
            <p className="text-xs text-gray-400 mt-0.5">{t('refine_subtitle')}</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {hasAdjustments && (
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                {t('refine_adjusted_badge')} · {adjustmentCount}
              </span>
            )}
            <span className="text-gray-400 text-lg leading-none">{refineOpen ? '−' : '+'}</span>
          </div>
        </button>

        {refineOpen && (
          <div className="border-t border-gray-100 px-5 py-5">

            {/* Step 1: Choose theme */}
            {refineStep === 1 && (
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
                  {t('refine_step1')}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {refinementThemes.map(rt => (
                    <button
                      key={rt.id}
                      onClick={() => { setSelectedRefinementTheme(rt); setRefineStep(2); }}
                      className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-gray-200 hover:border-gray-400 hover:bg-gray-50 transition-all text-center"
                    >
                      <span className="text-xl">{rt.emoji}</span>
                      <span className="text-xs font-semibold text-gray-800">{rt.label[language]}</span>
                      <span className="text-gray-400 leading-snug" style={{ fontSize: '10px' }}>{rt.desc[language]}</span>
                    </button>
                  ))}
                </div>
                {hasAdjustments && (
                  <button
                    onClick={resetAdjustments}
                    className="mt-4 text-xs text-red-500 hover:text-red-700 font-medium transition-colors"
                  >
                    ✕ {t('refine_reset')}
                  </button>
                )}
              </div>
            )}

            {/* Step 2: Choose subtheme */}
            {refineStep === 2 && selectedRefinementTheme && (
              <div>
                <button
                  onClick={() => setRefineStep(1)}
                  className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700 mb-4 transition-colors"
                >
                  ← {t('refine_back')}
                </button>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">
                  {selectedRefinementTheme.emoji} {selectedRefinementTheme.label[language]}
                </p>
                <p className="text-xs text-gray-400 mb-4">{t('refine_step2')}</p>
                <div className="space-y-2">
                  {selectedRefinementTheme.subthemes.map(sub => (
                    <button
                      key={sub.id}
                      onClick={() => { setSelectedSubtheme(sub); setSliderValue(0); setRefineStep(3); }}
                      className="w-full flex items-start gap-3 px-4 py-3 rounded-xl border border-gray-200 hover:border-gray-400 hover:bg-gray-50 text-left transition-all"
                    >
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{sub.label[language]}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{sub.desc[language]}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Slider */}
            {refineStep === 3 && selectedSubtheme && (
              <div>
                <button
                  onClick={() => setRefineStep(2)}
                  className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700 mb-4 transition-colors"
                >
                  ← {t('refine_back')}
                </button>
                <p className="text-sm font-semibold text-gray-800 mb-1">{selectedSubtheme.label[language]}</p>
                <p className="text-xs text-gray-500 mb-5">{selectedSubtheme.desc[language]}</p>

                {/* Slider */}
                <div className="mb-5">
                  <div className="flex justify-between text-xs text-gray-400 mb-2">
                    <span>{selectedSubtheme.lessLabel[language]}</span>
                    <span className="font-semibold text-gray-700">
                      {sliderValue === 0 ? t('refine_neutral') :
                       sliderValue > 0 ? `+${sliderValue}` : `${sliderValue}`}
                    </span>
                    <span>{selectedSubtheme.moreLabel[language]}</span>
                  </div>
                  <input
                    type="range"
                    min={-2}
                    max={2}
                    step={1}
                    value={sliderValue}
                    onChange={e => setSliderValue(Number(e.target.value))}
                    className="w-full accent-gray-800 cursor-pointer"
                  />
                  <div className="flex justify-between mt-1">
                    {[-2, -1, 0, 1, 2].map(v => (
                      <span key={v} className={`text-center flex-1 text-xs transition-colors ${sliderValue === v ? 'text-gray-900 font-bold' : 'text-gray-300'}`}>
                        {v === -2 ? '−−' : v === -1 ? '−' : v === 0 ? '○' : v === 1 ? '+' : '++'}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (sliderValue !== 0) {
                      const delta = {};
                      Object.entries(selectedSubtheme.adjustment).forEach(([k, v]) => {
                        delta[k] = v * sliderValue;
                      });
                      applyRefinement(delta);
                    }
                    setRefineStep(1);
                    setSelectedRefinementTheme(null);
                    setSelectedSubtheme(null);
                    setSliderValue(0);
                  }}
                  disabled={sliderValue === 0}
                  className="w-full bg-gray-900 hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-xl text-sm transition-colors"
                >
                  {t('refine_apply')}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Refine + explore */}
      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        {/* Refine profile */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-semibold text-gray-900 mb-1 text-sm">{t('profile_refine')}</h3>
          <p className="text-xs text-gray-400 mb-4">
            {language === 'fr'
              ? `${unansweredCount} questions non répondues restantes`
              : `${unansweredCount} unanswered questions remaining`}
          </p>
          <div className="flex gap-2 flex-wrap">
            {[15, 40].filter(n => n <= unansweredCount + 1).map(n => (
              <button
                key={n}
                onClick={() => startRefinement(n)}
                className="text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors"
              >
                +{n} {language === 'fr' ? 'questions' : 'questions'}
              </button>
            ))}
            {unansweredCount > 0 && (
              <button
                onClick={() => startRefinement(unansweredCount)}
                className="text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors"
              >
                {language === 'fr' ? 'Toutes les questions restantes' : 'All remaining questions'}
              </button>
            )}
            {unansweredCount === 0 && (
              <p className="text-xs text-green-600 font-medium">
                ✓ {language === 'fr' ? 'Profil complet !' : 'Profile complete!'}
              </p>
            )}
          </div>
        </div>

        {/* Quick navigation */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-semibold text-gray-900 mb-3 text-sm">
            {language === 'fr' ? 'Explorer vos correspondances' : 'Explore your matches'}
          </h3>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => navigate('elections')}
              className="flex items-center gap-2 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 px-4 py-2.5 rounded-lg transition-colors text-left"
            >
              🗳️ {t('profile_view_elections')}
            </button>
            <button
              onClick={() => navigate('figures')}
              className="flex items-center gap-2 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 px-4 py-2.5 rounded-lg transition-colors text-left"
            >
              🏛️ {t('profile_view_figures')}
            </button>
          </div>
        </div>
      </div>

      {/* Methodology note */}
      <p className="text-xs text-gray-400 text-center leading-relaxed">
        {language === 'fr'
          ? 'Les scores représentent vos positions sur des spectres thématiques, pas des verdicts moraux. Une valeur de 50 est neutre/centrale.'
          : 'Scores represent your position on thematic spectrums, not moral verdicts. A value of 50 is neutral/centrist.'}
      </p>
    </div>
  );
}
