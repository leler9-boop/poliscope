import React, { useState } from 'react';
import { useStore } from '../store/useStore.js';
import { createTranslator } from '../i18n/translations.js';
import { rankByAlignment } from '../engine/matcher.js';
import { elections } from '../data/elections.js';
import MatchCard from '../components/MatchCard.jsx';

export default function Elections() {
  const language      = useStore(s => s.language);
  const profile       = useStore(s => s.profile);
  const priorityOrder = useStore(s => s.priorityOrder);
  const navigate      = useStore(s => s.navigate);
  const t = createTranslator(language);

  const [selectedElectionId, setSelectedElectionId] = useState(elections[0]?.id ?? null);

  const selectedElection = elections.find(e => e.id === selectedElectionId);

  const rankedCandidates = profile && selectedElection
    ? rankByAlignment(profile, selectedElection.candidates, priorityOrder)
    : null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{t('elections_title')}</h1>
        <p className="text-gray-500 mt-1 text-sm">{t('elections_subtitle')}</p>
      </div>

      {/* No profile warning */}
      {!profile && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-6">
          <p className="text-amber-800 text-sm font-medium mb-3">{t('elections_no_profile')}</p>
          <button
            onClick={() => navigate('selectTest')}
            className="bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            {t('landing_cta_primary')}
          </button>
        </div>
      )}

      {/* Election selector */}
      <div className="flex gap-3 mb-6 flex-wrap">
        {elections.map(election => (
          <button
            key={election.id}
            onClick={() => setSelectedElectionId(election.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border font-medium text-sm transition-all ${
              selectedElectionId === election.id
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300'
            }`}
          >
            <span>{election.flag}</span>
            <span>{election.title[language]}</span>
          </button>
        ))}
      </div>

      {/* Selected election info */}
      {selectedElection && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-6">
          <div className="flex items-start gap-3">
            <span className="text-3xl">{selectedElection.flag}</span>
            <div>
              <h2 className="font-bold text-gray-900">{selectedElection.title[language]}</h2>
              <p className="text-sm text-gray-500 mt-1">{selectedElection.description[language]}</p>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {profile && rankedCandidates && (
        <>
          {/* Disclaimer */}
          <div className="text-xs text-gray-400 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 mb-5">
            ⚠️ {t('elections_disclaimer')}
          </div>

          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
            {t('elections_sorted')}
          </p>

          {/* Top match */}
          {rankedCandidates[0] && (
            <div className="mb-4">
              <MatchCard
                target={rankedCandidates[0]}
                rank={1}
                language={language}
                isTopMatch={true}
              />
            </div>
          )}

          {/* Rest */}
          <div className="space-y-3">
            {rankedCandidates.slice(1).map((candidate, idx) => (
              <MatchCard
                key={candidate.id}
                target={candidate}
                rank={idx + 2}
                language={language}
              />
            ))}
          </div>

          {/* Alignment distribution chart */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mt-6">
            <h3 className="font-bold text-gray-900 mb-4 text-sm">
              {language === 'fr' ? 'Vue d\'ensemble des compatibilités' : 'Alignment overview'}
            </h3>
            <div className="space-y-2.5">
              {rankedCandidates.map(candidate => {
                const barColor =
                  candidate.alignment >= 75 ? '#16a34a' :
                  candidate.alignment >= 55 ? '#2563eb' :
                  candidate.alignment >= 35 ? '#d97706' : '#dc2626';
                return (
                  <div key={candidate.id} className="flex items-center gap-3">
                    {candidate.color && (
                      <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: candidate.color }} />
                    )}
                    <span className="text-xs text-gray-600 w-28 flex-shrink-0 truncate">{candidate.name}</span>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${candidate.alignment}%`, backgroundColor: barColor }}
                      />
                    </div>
                    <span className="text-xs font-bold w-9 text-right" style={{ color: barColor }}>
                      {candidate.alignment}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
