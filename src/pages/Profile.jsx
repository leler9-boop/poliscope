import React, { useRef, useState } from 'react';
import { useStore } from '../store/useStore.js';
import { createTranslator } from '../i18n/translations.js';
import { getConfidenceMeta, AXES_LABELS } from '../engine/scorer.js';
import { THEMES_ORDER, THEME_LABELS, THEME_COLORS } from '../data/questions.js';
import RadarChart from '../components/RadarChart.jsx';
import AxisBar from '../components/AxisBar.jsx';
import { useAuth } from '../lib/auth.jsx';
import { isSupabaseEnabled } from '../lib/supabase.js';

export default function Profile() {
  const language        = useStore(s => s.language);
  const profile         = useStore(s => s.profile);
  const answers         = useStore(s => s.answers);
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

  const { themes, axes, confidence, confidenceScore, answeredCount, totalQuestions } = profile;
  const confMeta = getConfidenceMeta(confidence, language);
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
