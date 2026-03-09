import React from 'react';
import { useStore } from '../store/useStore.js';
import { createTranslator } from '../i18n/translations.js';
import { rankByAlignment } from '../engine/matcher.js';
import { historicalFigures } from '../data/historicalFigures.js';
import MatchCard from '../components/MatchCard.jsx';

export default function HistoricalFigures() {
  const language      = useStore(s => s.language);
  const profile       = useStore(s => s.profile);
  const priorityOrder = useStore(s => s.priorityOrder);
  const navigate      = useStore(s => s.navigate);
  const t = createTranslator(language);

  const rankedFigures = profile
    ? rankByAlignment(profile, historicalFigures, priorityOrder)
    : null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{t('figures_title')}</h1>
        <p className="text-gray-500 mt-1 text-sm">{t('figures_subtitle')}</p>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
        <p className="text-sm text-amber-800 leading-relaxed">{t('figures_disclaimer')}</p>
      </div>

      {/* No profile */}
      {!profile && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
          <div className="text-4xl mb-3">🏛️</div>
          <p className="text-gray-600 text-sm font-medium mb-4">{t('figures_no_profile')}</p>
          <button
            onClick={() => navigate('selectTest')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors"
          >
            {t('landing_cta_primary')}
          </button>
        </div>
      )}

      {/* Ranked figures */}
      {profile && rankedFigures && (
        <>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
            {t('figures_sorted')}
          </p>

          {/* Top match */}
          {rankedFigures[0] && (
            <div className="mb-4">
              <MatchCard
                target={rankedFigures[0]}
                rank={1}
                language={language}
                isTopMatch={true}
                showDetails={true}
              />
            </div>
          )}

          {/* Rest */}
          <div className="grid sm:grid-cols-2 gap-4">
            {rankedFigures.slice(1).map((figure, idx) => (
              <MatchCard
                key={figure.id}
                target={figure}
                rank={idx + 2}
                language={language}
                showDetails={true}
              />
            ))}
          </div>

          {/* Alignment overview */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mt-6">
            <h3 className="font-bold text-gray-900 mb-4 text-sm">
              {language === 'fr' ? 'Vue d\'ensemble des compatibilités' : 'Alignment overview'}
            </h3>
            <div className="space-y-2.5">
              {rankedFigures.map(figure => {
                const barColor =
                  figure.alignment >= 75 ? '#16a34a' :
                  figure.alignment >= 55 ? '#2563eb' :
                  figure.alignment >= 35 ? '#d97706' : '#dc2626';
                return (
                  <div key={figure.id} className="flex items-center gap-3">
                    <span className="text-base flex-shrink-0 w-6 text-center">{figure.emoji}</span>
                    <span className="text-xs text-gray-600 w-28 flex-shrink-0 truncate">{figure.name}</span>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${figure.alignment}%`, backgroundColor: barColor }}
                      />
                    </div>
                    <span className="text-xs font-bold w-9 text-right" style={{ color: barColor }}>
                      {figure.alignment}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Note */}
          <p className="text-xs text-gray-400 text-center mt-6 leading-relaxed max-w-xl mx-auto">
            {language === 'fr'
              ? 'Les profils des figures historiques sont des simplifications analytiques à des fins éducatives uniquement. L\'histoire est complexe et nuancée — utilisez cet outil comme point de départ pour en apprendre davantage.'
              : 'Historical figure profiles are analytical simplifications for educational purposes only. History is complex and nuanced — use this as a starting point for further learning.'}
          </p>
        </>
      )}
    </div>
  );
}
