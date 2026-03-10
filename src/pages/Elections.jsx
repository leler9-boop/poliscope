import React from 'react';
import { useStore } from '../store/useStore.js';
import { createTranslator } from '../i18n/translations.js';
import { elections } from '../data/elections.js';

export default function Elections() {
  const language      = useStore(s => s.language);
  const profile       = useStore(s => s.profile);
  const navigate      = useStore(s => s.navigate);
  const selectElection = useStore(s => s.selectElection);
  const electionAnswers = useStore(s => s.electionAnswers);
  const t = createTranslator(language);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{t('elections_title')}</h1>
        <p className="text-gray-500 text-sm">{t('elections_subtitle')}</p>
      </div>

      {/* No profile notice */}
      {!profile && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8">
          <p className="text-amber-800 text-sm font-medium mb-3">{t('elections_no_profile')}</p>
          <button
            onClick={() => navigate('selectTest')}
            className="bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            {t('landing_cta_primary')}
          </button>
        </div>
      )}

      {/* Election cards */}
      <div className="grid sm:grid-cols-2 gap-4">
        {elections.map(election => {
          const hasAnswers = Object.keys(electionAnswers[election.id] ?? {}).length > 0;
          const qCount = election.specificQuestions?.length ?? 0;

          return (
            <div
              key={election.id}
              className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-md hover:border-gray-200 transition-all group cursor-pointer"
              onClick={() => selectElection(election.id)}
            >
              {/* Flag + title */}
              <div className="flex items-start gap-4 mb-4">
                <span className="text-4xl leading-none">{election.flag}</span>
                <div>
                  <h2 className="font-bold text-gray-900 text-base leading-snug group-hover:text-gray-700 transition-colors">
                    {election.title[language]}
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5">{election.country} · {election.year}</p>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-500 leading-relaxed mb-5">
                {election.description[language]}
              </p>

              {/* Meta row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Candidate count */}
                  <span className="text-xs text-gray-400">
                    {election.candidates.length} {language === 'fr' ? 'candidats' : 'candidates'}
                  </span>
                  {/* Q count */}
                  {qCount > 0 && (
                    <span className="text-xs text-gray-400">
                      · {qCount} {language === 'fr' ? 'questions spécifiques' : 'specific questions'}
                    </span>
                  )}
                </div>

                {/* Has answers badge */}
                {hasAnswers && (
                  <span className="text-xs font-medium text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
                    ✓ {language === 'fr' ? 'Répondu' : 'Answered'}
                  </span>
                )}
              </div>

              {/* CTA */}
              <div className="mt-4 pt-4 border-t border-gray-50">
                <span className="text-sm font-semibold text-gray-800 group-hover:text-gray-900 transition-colors">
                  {language === 'fr' ? 'Explorer cette élection' : 'Explore this election'} →
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Trust footer */}
      <div className="mt-10 flex flex-wrap gap-4 justify-center">
        {[t('trust_data'), t('trust_no_sell'), t('trust_anonymous')].map((msg, i) => (
          <span key={i} className="text-xs text-gray-400 flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-gray-300" />
            {msg}
          </span>
        ))}
      </div>
    </div>
  );
}
