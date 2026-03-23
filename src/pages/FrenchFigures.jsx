import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../store/useStore.js';
import { createTranslator } from '../i18n/translations.js';
import { rankByAlignment, generateWhyMatch, alignmentBarColor } from '../engine/matcher.js';
import { frenchFigures } from '../data/frenchFigures.js';
import MatchCard from '../components/MatchCard.jsx';
import { THEMES_ORDER, THEME_LABELS, THEME_COLORS } from '../data/questions.js';

// ── Theme axis pole labels ────────────────────────────────────────────────────

const THEME_AXES = {
  ECONOMY:         { en: { left: 'Redistrib.', right: 'Free market' }, fr: { left: 'Redistrib.', right: 'Marché libre' } },
  SOCIAL:          { en: { left: 'Traditional', right: 'Progressive' }, fr: { left: 'Trad.', right: 'Progressiste' } },
  IMMIGRATION:     { en: { left: 'Restrictive', right: 'Open' }, fr: { left: 'Restrictif', right: 'Ouverture' } },
  SECURITY:        { en: { left: 'State sec.', right: 'Civil lib.' }, fr: { left: 'État', right: 'Libertés' } },
  ENVIRONMENT:     { en: { left: 'Growth', right: 'Ecology' }, fr: { left: 'Croissance', right: 'Écologie' } },
  DEMOCRACY:       { en: { left: 'Strong state', right: 'Participative' }, fr: { left: 'État fort', right: 'Participatif' } },
  GLOBAL:          { en: { left: 'Sovereignty', right: 'Multilateral.' }, fr: { left: 'Souverain.', right: 'Multilatér.' } },
  PUBLIC_SERVICES: { en: { left: 'Private', right: 'Public' }, fr: { left: 'Privé', right: 'Public' } },
};

// ── Family filter config ──────────────────────────────────────────────────────

const FAMILIES = [
  { key: 'all',       label: { fr: 'Tous', en: 'All' } },
  { key: 'center',    label: { fr: 'Centre', en: 'Centre' } },
  { key: 'left',      label: { fr: 'Gauche', en: 'Left' } },
  { key: 'right',     label: { fr: 'Droite', en: 'Right' } },
  { key: 'far_right', label: { fr: 'Extrême droite', en: 'Far right' } },
  { key: 'ecology',   label: { fr: 'Écologie', en: 'Ecology' } },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function applyAdjustments(themes, adjustments) {
  if (!adjustments || Object.keys(adjustments).length === 0) return themes;
  const result = { ...themes };
  Object.entries(adjustments).forEach(([k, v]) => {
    if (result[k] != null) result[k] = Math.max(0, Math.min(100, result[k] + v));
  });
  return result;
}

function diffLabel(diff, language) {
  if (diff < 12) return language === 'fr' ? 'Très proches' : 'Very close';
  if (diff < 28) return language === 'fr' ? 'Proches' : 'Close';
  if (diff < 45) return language === 'fr' ? 'Modéré' : 'Moderate';
  return language === 'fr' ? 'Désaccord' : 'Disagreement';
}

function diffColor(diff) {
  if (diff < 12) return '#10b981'; // green
  if (diff < 28) return '#3b82f6'; // blue
  if (diff < 45) return '#f59e0b'; // amber
  return '#ef4444';                // red
}

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] },
});

// ── Compare Modal ─────────────────────────────────────────────────────────────

function CompareModal({ figure, userThemes, language, onClose }) {
  const overlayRef = useRef(null);
  const t = createTranslator(language);

  // Close on click outside
  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        ref={overlayRef}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleOverlayClick}
      >
        <motion.div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">{figure.emoji}</span>
              <div>
                <h2 className="font-semibold text-gray-900 text-base">{figure.name}</h2>
                <p className="text-xs text-gray-400">
                  {typeof figure.party === 'object' ? figure.party[language] : figure.party}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors text-lg leading-none"
            >
              ×
            </button>
          </div>

          {/* No profile CTA */}
          {!userThemes && (
            <div className="p-8 text-center">
              <div className="text-4xl mb-3">📊</div>
              <p className="font-semibold text-gray-700 mb-2">
                {language === 'fr' ? `Créez votre profil d'abord` : 'Create your profile first'}
              </p>
              <p className="text-sm text-gray-400 leading-relaxed max-w-xs mx-auto">
                {language === 'fr'
                  ? `Répondez aux questions pour comparer votre profil avec ${figure.name}.`
                  : `Answer the questions to compare your profile with ${figure.name}.`}
              </p>
            </div>
          )}

          {/* Theme bars comparison */}
          {userThemes && (
            <div className="p-5 space-y-5">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                {language === 'fr' ? 'Comparaison par thème' : 'Theme comparison'}
              </p>
              {THEMES_ORDER.map((theme) => {
                const userScore   = Math.round(userThemes[theme] ?? 50);
                const figureScore = Math.round(figure.profile[theme] ?? 50);
                const diff        = Math.abs(userScore - figureScore);
                const color       = THEME_COLORS[theme];
                const axis        = THEME_AXES[theme];
                const axisLabels  = axis ? axis[language] : null;
                const label       = THEME_LABELS[language][theme];

                return (
                  <div key={theme} className="space-y-1.5">
                    {/* Theme label + diff badge */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-700">{label}</span>
                      <span
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-full text-white"
                        style={{ backgroundColor: diffColor(diff) }}
                      >
                        {diffLabel(diff, language)}
                      </span>
                    </div>

                    {/* Axis poles */}
                    {axisLabels && (
                      <div className="flex justify-between text-[10px] text-gray-300">
                        <span>{axisLabels.left}</span>
                        <span>{axisLabels.right}</span>
                      </div>
                    )}

                    {/* User bar */}
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-gray-400 w-10 text-right flex-shrink-0">
                        {language === 'fr' ? 'Moi' : 'Me'}
                      </span>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-gray-800"
                          initial={{ width: '0%' }}
                          animate={{ width: `${userScore}%` }}
                          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                        />
                      </div>
                      <span className="text-[10px] font-bold tabular-nums text-gray-600 w-7 flex-shrink-0">
                        {userScore}
                      </span>
                    </div>

                    {/* Figure bar */}
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-gray-400 w-10 text-right flex-shrink-0 truncate">
                        {figure.name.split(' ')[0]}
                      </span>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: color }}
                          initial={{ width: '0%' }}
                          animate={{ width: `${figureScore}%` }}
                          transition={{ duration: 0.6, delay: 0.05, ease: [0.25, 0.46, 0.45, 0.94] }}
                        />
                      </div>
                      <span className="text-[10px] font-bold tabular-nums w-7 flex-shrink-0" style={{ color }}>
                        {figureScore}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function FrenchFigures() {
  const language           = useStore(s => s.language);
  const profile            = useStore(s => s.profile);
  const priorityOrder      = useStore(s => s.priorityOrder);
  const profileAdjustments = useStore(s => s.profileAdjustments);
  const navigate           = useStore(s => s.navigate);
  const t = createTranslator(language);

  const [search,        setSearch]        = useState('');
  const [familyFilter,  setFamilyFilter]  = useState('all');
  const [compareTarget, setCompareTarget] = useState(null);

  const adjustedProfile = profile
    ? { ...profile, themes: applyAdjustments(profile.themes, profileAdjustments) }
    : null;

  // Filter figures by search + family
  const filtered = frenchFigures.filter((fig) => {
    const matchesFamily = familyFilter === 'all' || fig.family === familyFilter;
    const matchesSearch = search.trim() === '' ||
      fig.name.toLowerCase().includes(search.toLowerCase());
    return matchesFamily && matchesSearch;
  });

  // Rank by alignment if profile exists, otherwise sort alphabetically
  const displayFigures = adjustedProfile
    ? rankByAlignment(adjustedProfile, filtered, priorityOrder)
    : [...filtered].sort((a, b) => a.name.localeCompare(b.name));

  const topMatch     = adjustedProfile ? displayFigures[0]         : null;
  const silverBronze = adjustedProfile ? displayFigures.slice(1, 3) : [];
  const rest         = adjustedProfile ? displayFigures.slice(3)    : displayFigures;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16">

      {/* ── Header ── */}
      <motion.div className="mb-8" {...fadeUp(0)}>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
          {language === 'fr' ? `Figures politiques françaises` : `French Political Figures`}
        </h1>
        <p className="text-gray-500 mt-1.5 text-sm">
          {language === 'fr'
            ? `28 figures politiques françaises actives ces 5 dernières années — comparez leurs positions avec les vôtres.`
            : `28 French political figures active in the last 5 years — compare their positions with yours.`}
        </p>
      </motion.div>

      {/* ── Search + Filters ── */}
      <motion.div className="mb-6 space-y-3" {...fadeUp(0.06)}>
        {/* Search bar */}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={language === 'fr' ? `Rechercher une figure…` : `Search a figure…`}
          className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 transition"
        />

        {/* Family filter tabs */}
        <div className="flex flex-wrap gap-2">
          {FAMILIES.map((fam) => (
            <button
              key={fam.key}
              onClick={() => setFamilyFilter(fam.key)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
                familyFilter === fam.key
                  ? 'bg-gray-900 text-white'
                  : 'bg-white border border-gray-200 text-gray-500 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              {fam.label[language]}
            </button>
          ))}
        </div>
      </motion.div>

      {/* ── No profile CTA ── */}
      {!profile && (
        <motion.div
          className="bg-white border border-gray-200 rounded-2xl p-8 text-center shadow-sm mb-8"
          {...fadeUp(0.1)}
        >
          <div className="text-4xl mb-3">🇫🇷</div>
          <p className="text-gray-700 font-semibold mb-2">
            {language === 'fr' ? `Créez votre profil pour comparer` : `Build your profile to compare`}
          </p>
          <p className="text-sm text-gray-400 mb-6 max-w-sm mx-auto leading-relaxed">
            {language === 'fr'
              ? `Répondez aux questions politiques pour voir quelles figures françaises vous ressemblent le plus.`
              : `Answer the political questions to see which French figures you most resemble.`}
          </p>
          <button
            onClick={() => navigate('selectTest')}
            className="bg-gray-900 hover:bg-black text-white font-semibold px-6 py-3 rounded-xl text-sm transition-colors"
          >
            {t('landing_cta_primary')}
          </button>
        </motion.div>
      )}

      {/* ── Empty state ── */}
      {displayFigures.length === 0 && (
        <motion.div
          className="text-center py-16 text-gray-400 text-sm"
          {...fadeUp(0.1)}
        >
          {language === 'fr' ? `Aucune figure trouvée.` : `No figures found.`}
        </motion.div>
      )}

      {/* ── Ranked list (with profile) ── */}
      {adjustedProfile && displayFigures.length > 0 && (
        <>
          <motion.p
            className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-5"
            {...fadeUp(0.1)}
          >
            {language === 'fr' ? `Classé par compatibilité` : `Sorted by alignment`} — {displayFigures.length} {language === 'fr' ? `figures` : `figures`}
          </motion.p>

          {/* Top match */}
          {topMatch && (
            <motion.div className="mb-4" {...fadeUp(0.15)}>
              <MatchCard
                target={topMatch}
                rank={1}
                language={language}
                isTopMatch={true}
                showDetails={true}
                whyMatch={generateWhyMatch(adjustedProfile.themes, topMatch, language)}
              />
              <div className="mt-2 flex justify-end">
                <button
                  onClick={() => setCompareTarget(topMatch)}
                  className="text-xs font-medium text-gray-400 hover:text-gray-700 px-3 py-1.5 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                >
                  {language === 'fr' ? `Comparer` : `Compare`}
                </button>
              </div>
            </motion.div>
          )}

          {/* #2 & #3 */}
          {silverBronze.length > 0 && (
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              {silverBronze.map((figure, idx) => (
                <motion.div
                  key={figure.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.22 + idx * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  <MatchCard
                    target={figure}
                    rank={idx + 2}
                    language={language}
                    showDetails={true}
                    whyMatch={generateWhyMatch(adjustedProfile.themes, figure, language)}
                  />
                  <div className="mt-2 flex justify-end">
                    <button
                      onClick={() => setCompareTarget(figure)}
                      className="text-xs font-medium text-gray-400 hover:text-gray-700 px-3 py-1.5 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                    >
                      {language === 'fr' ? `Comparer` : `Compare`}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Rest */}
          {rest.length > 0 && (
            <>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-8 mb-4">
                {language === 'fr' ? `Autres figures` : `Other figures`}
              </p>
              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {rest.map((figure, idx) => (
                  <motion.div
                    key={figure.id}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 + idx * 0.04, ease: [0.25, 0.46, 0.45, 0.94] }}
                  >
                    <MatchCard
                      target={figure}
                      rank={idx + 4}
                      language={language}
                      showDetails={true}
                      whyMatch={generateWhyMatch(adjustedProfile.themes, figure, language)}
                    />
                    <div className="mt-2 flex justify-end">
                      <button
                        onClick={() => setCompareTarget(figure)}
                        className="text-xs font-medium text-gray-400 hover:text-gray-700 px-3 py-1.5 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                      >
                        {language === 'fr' ? `Comparer` : `Compare`}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )}

          {/* Alignment overview */}
          <motion.div
            className="bg-white rounded-2xl border border-gray-200 p-6 mt-2"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="font-semibold text-xs uppercase tracking-widest text-gray-500 mb-5">
              {language === 'fr' ? `Vue d'ensemble` : `Alignment overview`}
            </h3>
            <div className="space-y-2.5">
              {displayFigures.map((figure, idx) => {
                const barColor = alignmentBarColor(figure.alignment);
                return (
                  <div key={figure.id} className="flex items-center gap-3">
                    <span className="text-sm flex-shrink-0 w-6 text-center">{figure.emoji ?? `👤`}</span>
                    <span className="text-xs text-gray-600 w-28 flex-shrink-0 truncate">{figure.name}</span>
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: barColor }}
                        initial={{ width: '0%' }}
                        whileInView={{ width: `${figure.alignment}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: idx * 0.02, ease: [0.25, 0.46, 0.45, 0.94] }}
                      />
                    </div>
                    <span className="text-xs font-bold w-9 text-right tabular-nums" style={{ color: barColor }}>
                      {figure.alignment}%
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </>
      )}

      {/* ── Unranked list (no profile) ── */}
      {!adjustedProfile && displayFigures.length > 0 && (
        <div className="grid sm:grid-cols-2 gap-4">
          {displayFigures.map((figure, idx) => (
            <motion.div
              key={figure.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05 + idx * 0.03, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <MatchCard
                target={figure}
                rank={null}
                language={language}
                showDetails={true}
                whyMatch={null}
              />
              <div className="mt-2 flex justify-end">
                <button
                  onClick={() => setCompareTarget(figure)}
                  className="text-xs font-medium text-gray-400 hover:text-gray-700 px-3 py-1.5 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                >
                  {language === 'fr' ? `Comparer` : `Compare`}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* ── Compare modal ── */}
      {compareTarget && (
        <CompareModal
          figure={compareTarget}
          userThemes={adjustedProfile ? adjustedProfile.themes : null}
          language={language}
          onClose={() => setCompareTarget(null)}
        />
      )}
    </div>
  );
}
