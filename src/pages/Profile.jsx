import React, { useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
import ProfileShareModal from '../components/ProfileShareModal.jsx';
import { useAuth } from '../lib/auth.jsx';
import { isSupabaseEnabled } from '../lib/supabase.js';

/** Weight editor — lets user allocate 100 points across themes. */
function WeightEditor({ initial, themeWeights, setThemeWeights, language, onClose }) {
  const defaultWeights = () => {
    const base = Math.floor(100 / THEMES_ORDER.length);
    const extra = 100 - base * THEMES_ORDER.length;
    return Object.fromEntries(THEMES_ORDER.map((t, i) => [t, base + (i < extra ? 1 : 0)]));
  };

  const [weights, setWeights] = React.useState(
    () => initial ?? defaultWeights()
  );
  const total = Object.values(weights).reduce((a, b) => a + b, 0);
  const remaining = 100 - total;

  const handleChange = (theme, raw) => {
    const val = Math.max(0, Math.min(100, Number(raw) || 0));
    setWeights(prev => ({ ...prev, [theme]: val }));
  };

  return (
    <div>
      <p className="text-xs text-gray-500 mb-4 leading-relaxed">
        {language === 'fr'
          ? 'Répartissez 100 points entre les thèmes selon leur importance pour vous. Cela pondérera votre score d\'alignement avec les candidats.'
          : 'Allocate 100 points across themes based on how much each matters to you. This weights your alignment scores with candidates and figures.'}
      </p>

      <div className={`text-xs font-semibold mb-4 tabular-nums ${remaining === 0 ? 'text-green-600' : 'text-amber-600'}`}>
        {remaining === 0
          ? (language === 'fr' ? '✓ Total : 100' : '✓ Total: 100')
          : (language === 'fr' ? `Points restants : ${remaining}` : `Remaining: ${remaining}`)}
      </div>

      <div className="space-y-3 mb-5">
        {THEMES_ORDER.map(theme => {
          const label = THEME_LABELS[language]?.[theme] ?? theme;
          const color = THEME_COLORS[theme] ?? '#6b7280';
          return (
            <div key={theme} className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
              <span className="text-xs text-gray-700 flex-1 min-w-0 truncate">{label}</span>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button
                  onClick={() => handleChange(theme, weights[theme] - 1)}
                  className="w-6 h-6 rounded border border-gray-200 text-gray-500 hover:bg-gray-100 text-xs leading-none flex items-center justify-center transition-colors"
                >−</button>
                <span className="text-sm font-bold tabular-nums w-7 text-center text-gray-800">
                  {weights[theme]}
                </span>
                <button
                  onClick={() => handleChange(theme, weights[theme] + 1)}
                  className="w-6 h-6 rounded border border-gray-200 text-gray-500 hover:bg-gray-100 text-xs leading-none flex items-center justify-center transition-colors"
                >+</button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => { setThemeWeights(weights); onClose(); }}
          disabled={remaining !== 0}
          className="flex-1 bg-gray-900 hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold py-2.5 rounded-xl transition-colors"
        >
          {language === 'fr' ? 'Appliquer les priorités' : 'Apply priorities'}
        </button>
        <button
          onClick={onClose}
          className="text-xs text-gray-400 hover:text-gray-600 px-3 transition-colors"
        >
          {language === 'fr' ? 'Annuler' : 'Cancel'}
        </button>
      </div>

      {themeWeights && (
        <button
          onClick={() => { setThemeWeights(null); onClose(); }}
          className="mt-3 text-xs text-red-500 hover:text-red-700 font-medium transition-colors"
        >
          ✕ {language === 'fr' ? 'Réinitialiser les priorités' : 'Reset priorities'}
        </button>
      )}
    </div>
  );
}

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
  const themeWeights       = useStore(s => s.themeWeights);
  const setThemeWeights    = useStore(s => s.setThemeWeights);
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
  const [weightEditorOpen, setWeightEditorOpen] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

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
    () => rankByAlignment(adjustedProfile, ideologicalCurrents, priorityOrder, themeWeights),
    [adjustedProfile, priorityOrder, themeWeights]
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

  const axisKeys = ['social', 'institutional', 'international'];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      {/* Header */}
      <motion.div
        className="flex items-start justify-between mb-10 flex-wrap gap-4"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">{t('profile_title')}</h1>
          <p className="text-gray-500 mt-1.5 text-sm">{t('profile_subtitle')}</p>
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
            onClick={() => setShowShareModal(true)}
            className="flex items-center gap-1.5 text-xs font-semibold text-white bg-gray-900 hover:bg-black border border-gray-900 px-3 py-2 rounded-lg transition-colors"
          >
            ↗ {language === 'fr' ? 'Partager' : 'Share'}
          </button>
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
      </motion.div>

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

      {/* ═══ HERO ═══ */}
      {(() => {
        const topCurrent = rankedCurrents[0];
        const accentColor = topCurrent?.color ?? '#2563eb';
        const econScore = axes?.economic ?? 50;
        const isRight = econScore >= 50;

        return (
          <motion.div
            className="relative rounded-3xl border border-gray-200 overflow-hidden mb-8"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {/* Top accent bar — animates in from left */}
            <motion.div
              className="h-[3px]"
              style={{ backgroundColor: accentColor }}
              initial={{ scaleX: 0, originX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.7, delay: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            />

            <div
              className="p-7 sm:p-10"
              style={{ background: `linear-gradient(160deg, ${accentColor}0D 0%, transparent 55%)` }}
            >
              {/* Confidence pill — top right */}
              <div className="flex justify-end mb-6">
                <span
                  className="text-xs font-semibold px-3 py-1 rounded-full tabular-nums"
                  style={{ backgroundColor: `${confBarColor}18`, color: confBarColor }}
                >
                  {language === 'fr' ? 'Fiabilité' : 'Confidence'} {confidenceScore ?? 0}%
                </span>
              </div>

              {/* "You lean" label */}
              <motion.p
                className="text-sm font-medium text-gray-400 mb-1.5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {language === 'fr' ? 'Vous êtes plutôt' : 'You lean'}
              </motion.p>

              {/* Current name — big */}
              <motion.h2
                className="text-3xl sm:text-4xl font-bold tracking-tight mb-2"
                style={{ color: accentColor }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                {topCurrent?.icon} {topCurrent?.name[language]}
              </motion.h2>

              {/* Short description */}
              <motion.p
                className="text-sm text-gray-500 leading-relaxed max-w-lg mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45 }}
              >
                {topCurrent?.shortDesc[language]}
              </motion.p>

              {/* ── Featured economic axis ── */}
              <div>
                <div className="flex justify-between items-center mb-2.5">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                    {AXES_LABELS.economic[language]?.label}
                  </span>
                  <motion.span
                    className="text-xs font-bold tabular-nums"
                    style={{ color: accentColor }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6, duration: 0.4, ease: [0.34, 1.2, 0.64, 1] }}
                  >
                    {econScore}
                  </motion.span>
                </div>

                <div className="relative h-3 bg-gray-100 rounded-full">
                  {/* Fill from center */}
                  <div
                    className="absolute top-0 h-full rounded-full"
                    style={{
                      left:  isRight ? '50%' : `${econScore}%`,
                      right: isRight ? `${100 - econScore}%` : '50%',
                      backgroundColor: accentColor,
                      opacity: 0.25,
                    }}
                  />
                  {/* Center tick */}
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-px h-5 bg-gray-300"
                    style={{ left: '50%' }}
                  />
                  {/* "You are here" animated dot */}
                  <motion.div
                    className="absolute top-1/2 -translate-y-1/2 z-10"
                    initial={{ left: 'calc(50% - 9px)' }}
                    animate={{ left: `calc(${econScore}% - 9px)` }}
                    transition={{ duration: 1.3, delay: 0.4, ease: [0.34, 1.2, 0.64, 1] }}
                  >
                    <div className="relative w-[18px] h-[18px]">
                      {/* Pulse ring */}
                      <motion.div
                        className="absolute inset-0 rounded-full"
                        style={{ backgroundColor: accentColor }}
                        animate={{ scale: [1, 2.4], opacity: [0.45, 0] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 1.2, ease: 'easeOut' }}
                      />
                      {/* Dot */}
                      <div
                        className="absolute inset-0 rounded-full bg-white shadow-lg border-[3px]"
                        style={{ borderColor: accentColor }}
                      />
                    </div>
                  </motion.div>
                </div>

                <div className="flex justify-between mt-2">
                  <span className="text-xs text-gray-400">← {AXES_LABELS.economic[language]?.left}</span>
                  <span className="text-xs text-gray-400">{AXES_LABELS.economic[language]?.right} →</span>
                </div>
              </div>

              {/* Profile summary */}
              {profileSummary && (
                <motion.p
                  className="mt-7 pt-6 border-t border-gray-100 text-sm text-gray-600 leading-relaxed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  {profileSummary}
                  {hasAdjustments && (
                    <span className="ml-2 text-xs text-gray-400 font-medium">
                      ✎ {t('refine_active', { n: adjustmentCount })}
                    </span>
                  )}
                </motion.p>
              )}

              {/* Low-confidence CTA */}
              {(confidenceScore ?? 0) < 40 && (
                <button
                  onClick={startImproveMode}
                  className="mt-5 text-xs font-semibold text-gray-700 border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {t('confidence_improve_cta')} →
                </button>
              )}
            </div>
          </motion.div>
        );
      })()}

      {/* ── Share CTA — prominent, below hero ── */}
      <motion.div
        className="flex items-center gap-3 mb-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <motion.button
          onClick={() => setShowShareModal(true)}
          className="flex items-center gap-2 bg-gray-900 hover:bg-black text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors shadow-sm"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          transition={{ duration: 0.15 }}
        >
          ↗ {language === 'fr' ? 'Partager mon profil' : 'Share my profile'}
        </motion.button>
        <span className="text-xs text-gray-400">
          {language === 'fr' ? 'Carte visuelle à partager' : 'Visual card to share'}
        </span>
      </motion.div>

      {/* Main grid */}
      <motion.div
        className="grid sm:grid-cols-2 gap-5 mb-8"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
      >

        {/* Radar chart */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-7">
          <h2 className="font-semibold text-gray-900 mb-5 text-sm uppercase tracking-widest text-gray-500">{t('profile_themes_title')}</h2>
          <div className="flex justify-center">
            <RadarChart themes={themes} language={language} size={280} />
          </div>
        </div>

        {/* Theme scores list */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-7">
          <h2 className="font-semibold text-sm uppercase tracking-widest text-gray-500 mb-5">{t('profile_themes_title')}</h2>
          <div className="space-y-4">
            {THEMES_ORDER.map((theme, idx) => {
              const score = themes[theme] ?? 50;
              const label = THEME_LABELS[language]?.[theme] ?? theme;
              const color = THEME_COLORS[theme] ?? '#6b7280';
              return (
                <motion.div
                  key={theme}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.35 + idx * 0.06, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  <div className="flex justify-between items-center mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                      <span className="text-sm font-medium text-gray-700">{label}</span>
                      {themeWeights?.[theme] != null && (
                        <span className="text-xs text-gray-400 tabular-nums">{themeWeights[theme]}%</span>
                      )}
                    </div>
                    <span className="text-sm font-bold text-gray-800 tabular-nums">{score}</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: color }}
                      initial={{ width: '0%' }}
                      animate={{ width: `${score}%` }}
                      transition={{ duration: 0.9, delay: 0.4 + idx * 0.06, ease: [0.25, 0.46, 0.45, 0.94] }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Ideological axes */}
      <motion.div
        className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-7 mb-8"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <h2 className="font-semibold text-sm uppercase tracking-widest text-gray-500 mb-6">{t('profile_axes_title')}</h2>
        <div className="grid sm:grid-cols-3 gap-x-10">
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
      </motion.div>

      {/* Ideological Currents */}
      {(() => {
        // Split into primary and secondary, maintaining alignment order
        const primaryCurrents = rankedCurrents.filter(c => c.tier !== 'secondary');
        const secondaryCurrents = rankedCurrents.filter(c => c.tier === 'secondary');
        const topPrimary = primaryCurrents.slice(0, 3);
        const restPrimary = primaryCurrents.slice(3);

        return (
          <div className="mb-6">
            <div className="mb-6">
              <h2 className="font-bold text-gray-900 text-lg tracking-tight">{t('currents_title')}</h2>
              <p className="text-sm text-gray-500 mt-1.5">{t('currents_subtitle')}</p>
            </div>

            {/* Top 3 primary currents */}
            <div className="space-y-3">
              {topPrimary.map((current, idx) => {
                const barColor = alignmentBarColor(current.alignment);
                const textColor = alignmentColorClass(current.alignment);
                return (
                  <motion.div
                    key={current.id}
                    className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 overflow-hidden"
                    style={idx === 0 ? { borderLeftWidth: 4, borderLeftColor: current.color } : {}}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 + idx * 0.12, ease: [0.25, 0.46, 0.45, 0.94] }}
                  >
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
                          <motion.span
                            className={`text-lg font-bold tabular-nums flex-shrink-0 ${textColor}`}
                            initial={{ opacity: 0, scale: 0.7 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.7 + idx * 0.12, ease: [0.34, 1.2, 0.64, 1] }}
                          >
                            {current.alignment}%
                          </motion.span>
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed mb-2">
                          {current.shortDesc[language]}
                        </p>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-3">
                          <motion.div
                            className="h-full rounded-full"
                            style={{ backgroundColor: barColor }}
                            initial={{ width: '0%' }}
                            animate={{ width: `${current.alignment}%` }}
                            transition={{ duration: 1.0, delay: 0.65 + idx * 0.12, ease: [0.25, 0.46, 0.45, 0.94] }}
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
                  </motion.div>
                );
              })}
            </div>

            {/* Toggle all primary */}
            {restPrimary.length > 0 && (
              <>
                <button
                  onClick={() => setShowAllCurrents(!showAllCurrents)}
                  className="mt-3 text-xs font-medium text-blue-500 hover:text-blue-700 transition-colors"
                >
                  {showAllCurrents ? t('currents_show_less') : t('currents_show_all')} {showAllCurrents ? '▲' : '▼'}
                </button>
                <AnimatePresence>
                  {showAllCurrents && (
                    <motion.div
                      className="mt-3 grid sm:grid-cols-2 gap-3"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                    >
                      {restPrimary.map((current, idx) => {
                        const barColor = alignmentBarColor(current.alignment);
                        const textColor = alignmentColorClass(current.alignment);
                        return (
                          <motion.div
                            key={current.id}
                            className="bg-white border border-gray-200 rounded-2xl p-4"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: idx * 0.05 }}
                          >
                            <div className="flex items-center gap-2 mb-2.5">
                              <span className="text-base">{current.icon}</span>
                              <span className="font-medium text-gray-900 text-sm">{current.name[language]}</span>
                              <span className={`ml-auto text-sm font-bold tabular-nums ${textColor}`}>
                                {current.alignment}%
                              </span>
                            </div>
                            <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                              <motion.div
                                className="h-full rounded-full"
                                style={{ backgroundColor: barColor }}
                                initial={{ width: '0%' }}
                                animate={{ width: `${current.alignment}%` }}
                                transition={{ duration: 0.7, delay: idx * 0.05 }}
                              />
                            </div>
                          </motion.div>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}

            {/* Secondary currents — "Related traditions" */}
            {secondaryCurrents.length > 0 && (
              <div className="mt-5 border-t border-gray-100 pt-4">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                  {language === 'fr' ? 'Traditions apparentées' : 'Related traditions'}
                </p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {secondaryCurrents.map((current, idx) => {
                    const barColor = alignmentBarColor(current.alignment);
                    const textColor = alignmentColorClass(current.alignment);
                    return (
                      <motion.div
                        key={current.id}
                        className="bg-gray-50 border border-gray-200 rounded-2xl p-4"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.55 + idx * 0.08 }}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-base">{current.icon}</span>
                          <span className="font-medium text-gray-700 text-sm">{current.name[language]}</span>
                          <span className={`ml-auto text-sm font-bold tabular-nums ${textColor}`}>
                            {current.alignment}%
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 leading-relaxed mb-2">{current.shortDesc[language]}</p>
                        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full rounded-full"
                            style={{ backgroundColor: barColor }}
                            initial={{ width: '0%' }}
                            animate={{ width: `${current.alignment}%` }}
                            transition={{ duration: 0.8, delay: 0.6 + idx * 0.08 }}
                          />
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* Profile Refinement */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden mb-8">
        <button
          onClick={() => { setRefineOpen(!refineOpen); setRefineStep(1); setSelectedRefinementTheme(null); setSelectedSubtheme(null); setSliderValue(0); }}
          className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
        >
          <div>
            <p className="font-semibold text-gray-800 text-sm">{t('refine_title')}</p>
            <p className="text-xs text-gray-400 mt-0.5">
              {language === 'fr'
                ? 'Faites de légers ajustements si certains résultats ne vous semblent pas tout à fait justes.'
                : 'Make small tweaks if any part of your profile doesn\'t feel quite right.'}
            </p>
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
                <p className="text-xs text-gray-500 mb-3 leading-relaxed">
                  {language === 'fr'
                    ? 'Ces ajustements sont légers — ils ne remplacent pas vos réponses, ils les nuancent. Choisissez un domaine à affiner.'
                    : 'These are light adjustments — they don\'t replace your answers, they add nuance. Pick a topic to fine-tune.'}
                </p>
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
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {/* Refine profile */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6">
          <h3 className="font-semibold text-gray-900 mb-3 text-sm">{t('profile_refine')}</h3>

          {!weightEditorOpen ? (
            <div className="space-y-4">
              {/* Option 1: Answer more questions */}
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-2">
                  {language === 'fr' ? '1. Répondre à plus de questions' : '1. Answer more questions'}
                </p>
                <p className="text-xs text-gray-400 mb-2">
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
                      {language === 'fr' ? 'Toutes' : 'All remaining'}
                    </button>
                  )}
                  {unansweredCount === 0 && (
                    <p className="text-xs text-green-600 font-medium">
                      ✓ {language === 'fr' ? 'Profil complet !' : 'Profile complete!'}
                    </p>
                  )}
                </div>
              </div>

              {/* Option 2: Define priorities */}
              <div className="border-t border-gray-100 pt-4">
                <p className="text-xs font-semibold text-gray-500 mb-1">
                  {language === 'fr' ? '2. Définir mes priorités politiques' : '2. Define my political priorities'}
                </p>
                <p className="text-xs text-gray-400 mb-2 leading-relaxed">
                  {language === 'fr'
                    ? 'Pondérez les thèmes selon leur importance pour vous.'
                    : 'Weight themes by how much they matter to you.'}
                </p>
                <button
                  onClick={() => setWeightEditorOpen(true)}
                  className="flex items-center gap-1.5 text-xs font-medium text-gray-700 border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  ⚖ {themeWeights
                    ? (language === 'fr' ? 'Modifier les priorités' : 'Edit priorities')
                    : (language === 'fr' ? 'Définir mes priorités' : 'Set my priorities')}
                  {themeWeights && (
                    <span className="ml-1 bg-gray-900 text-white text-xs px-1.5 py-0.5 rounded-full">✓</span>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <WeightEditor
              initial={themeWeights}
              themeWeights={themeWeights}
              setThemeWeights={setThemeWeights}
              language={language}
              onClose={() => setWeightEditorOpen(false)}
            />
          )}
        </div>

        {/* Quick navigation */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6">
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

      {/* Share modal */}
      <AnimatePresence>
        {showShareModal && (
          <ProfileShareModal
            themes={themes}
            rankedCurrents={rankedCurrents}
            language={language}
            onClose={() => setShowShareModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
