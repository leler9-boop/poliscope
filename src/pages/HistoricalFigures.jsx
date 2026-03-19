import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useStore } from '../store/useStore.js';
import { createTranslator } from '../i18n/translations.js';
import { rankByAlignment, generateWhyMatch, alignmentBarColor } from '../engine/matcher.js';
import { historicalFigures } from '../data/historicalFigures.js';
import MatchCard from '../components/MatchCard.jsx';

function applyAdjustments(themes, adjustments) {
  if (!adjustments || Object.keys(adjustments).length === 0) return themes;
  const result = { ...themes };
  Object.entries(adjustments).forEach(([k, v]) => {
    if (result[k] != null) result[k] = Math.max(0, Math.min(100, result[k] + v));
  });
  return result;
}

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] },
});

export default function HistoricalFigures() {
  const language           = useStore(s => s.language);
  const profile            = useStore(s => s.profile);
  const priorityOrder      = useStore(s => s.priorityOrder);
  const profileAdjustments = useStore(s => s.profileAdjustments);
  const navigate           = useStore(s => s.navigate);
  const t = createTranslator(language);

  const [disclaimerOpen, setDisclaimerOpen] = useState(false);

  const adjustedProfile = profile
    ? { ...profile, themes: applyAdjustments(profile.themes, profileAdjustments) }
    : null;

  const rankedFigures = adjustedProfile
    ? rankByAlignment(adjustedProfile, historicalFigures, priorityOrder)
    : null;

  const topMatch    = rankedFigures?.[0]  ?? null;
  const silverBronze = rankedFigures?.slice(1, 3) ?? [];
  const rest         = rankedFigures?.slice(3) ?? [];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16">

      {/* ── Header ── */}
      <motion.div className="mb-8" {...fadeUp(0)}>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">{t('figures_title')}</h1>
        <p className="text-gray-500 mt-1.5 text-sm">{t('figures_subtitle')}</p>
      </motion.div>

      {/* ── Disclaimer (collapsible) ── */}
      <motion.div className="mb-8" {...fadeUp(0.06)}>
        <button
          onClick={() => setDisclaimerOpen(!disclaimerOpen)}
          className="flex items-center gap-2 text-xs font-medium text-gray-400 hover:text-gray-600 transition-colors"
        >
          <span className="text-gray-300 text-[10px]">{disclaimerOpen ? '▲' : '▼'}</span>
          <span>{language === 'fr' ? 'À propos de ces profils' : 'About these profiles'}</span>
        </button>
        {disclaimerOpen && (
          <motion.div
            className="mt-3 bg-gray-50 border border-gray-200 rounded-xl p-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
          >
            <p className="text-xs text-gray-500 leading-relaxed">
              {language === 'fr'
                ? 'Ces profils sont des approximations analytiques construites à partir d\'écrits, de discours et de positions historiques documentées. Les figures ont évolué dans des contextes très différents des nôtres. Ce comparateur est un outil d\'exploration intellectuelle, pas un verdict politique.'
                : 'These profiles are analytical approximations built from documented writings, speeches and historical positions. These figures lived in very different times and contexts. This tool is meant for intellectual exploration — not political verdicts.'}
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* ── No profile ── */}
      {!profile && (
        <motion.div
          className="bg-white border border-gray-200 rounded-2xl p-10 text-center shadow-sm"
          {...fadeUp(0.1)}
        >
          <div className="text-5xl mb-4">🏛️</div>
          <p className="text-gray-700 font-semibold mb-2">{t('figures_no_profile')}</p>
          <p className="text-sm text-gray-400 mb-6 max-w-sm mx-auto leading-relaxed">
            {language === 'fr'
              ? 'Créez votre profil politique pour découvrir quelles figures historiques vous ressemblez le plus.'
              : 'Build your political profile to discover which historical figures you most resemble.'}
          </p>
          <button
            onClick={() => navigate('selectTest')}
            className="bg-gray-900 hover:bg-black text-white font-semibold px-6 py-3 rounded-xl text-sm transition-colors"
          >
            {t('landing_cta_primary')}
          </button>
        </motion.div>
      )}

      {/* ── Ranked figures ── */}
      {adjustedProfile && rankedFigures && (
        <>
          {/* Count label */}
          <motion.p
            className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-5"
            {...fadeUp(0.1)}
          >
            {t('figures_sorted')} — {rankedFigures.length} {language === 'fr' ? 'figures' : 'figures'}
          </motion.p>

          {/* ── Top match ── */}
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
            </motion.div>
          )}

          {/* ── #2 & #3 ── */}
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
                </motion.div>
              ))}
            </div>
          )}

          {/* ── Rest of the grid ── */}
          {rest.length > 0 && (
            <>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-8 mb-4">
                {language === 'fr' ? 'Autres figures' : 'Other figures'}
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
                  </motion.div>
                ))}
              </div>
            </>
          )}

          {/* ── Alignment overview ── */}
          <motion.div
            className="bg-white rounded-2xl border border-gray-200 p-6 mt-2"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="font-semibold text-xs uppercase tracking-widest text-gray-500 mb-5">
              {language === 'fr' ? 'Vue d\'ensemble' : 'Alignment overview'}
            </h3>
            <div className="space-y-2.5">
              {rankedFigures.map((figure, idx) => {
                const barColor = alignmentBarColor(figure.alignment);
                return (
                  <div key={figure.id} className="flex items-center gap-3">
                    <span className="text-sm flex-shrink-0 w-6 text-center">{figure.emoji ?? '👤'}</span>
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
    </div>
  );
}
