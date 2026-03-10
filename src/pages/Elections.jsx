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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mb-2">{t('elections_title')}</h1>
        <p className="text-gray-500 text-sm">{t('elections_subtitle')}</p>
      </div>

      {/* No profile notice */}
      {!profile && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-10">
          <p className="text-gray-700 text-sm font-medium mb-4">{t('elections_no_profile')}</p>
          <button
            onClick={() => navigate('selectTest')}
            className="bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
          >
            {t('landing_cta_primary')}
          </button>
        </div>
      )}

      {/* Election cards */}
      <div className="grid sm:grid-cols-2 gap-4 mb-12">
        {elections.map(election => {
          const hasAnswers = Object.keys(electionAnswers[election.id] ?? {}).length > 0;
          const qCount = election.specificQuestions?.length ?? 0;

          return (
            <div
              key={election.id}
              className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-gray-300 hover:shadow-sm transition-all group cursor-pointer"
              onClick={() => selectElection(election.id)}
            >
              {/* Banner image */}
              {election.image && (
                <div className="relative h-36 overflow-hidden bg-gray-900">
                  <img
                    src={election.image}
                    alt={election.title[language]}
                    className="w-full h-full object-cover object-center"
                    loading="lazy"
                  />
                  {/* Answered badge overlay */}
                  {hasAnswers && (
                    <span className="absolute top-3 right-3 text-xs font-medium text-green-100 bg-green-900 bg-opacity-80 border border-green-700 px-2 py-0.5 rounded-full backdrop-blur-sm">
                      ✓ {language === 'fr' ? 'Répondu' : 'Answered'}
                    </span>
                  )}
                </div>
              )}

              {/* Card body */}
              <div className="p-5 sm:p-6">
                {/* Country / year */}
                <p className="text-xs text-gray-400 mb-2">{election.country} · {election.year}</p>

                {/* Title */}
                <h2 className="font-bold text-gray-900 text-base leading-snug tracking-tight mb-3">
                  {election.title[language]}
                </h2>

                {/* Description */}
                <p className="text-sm text-gray-500 leading-relaxed mb-5">
                  {election.description[language]}
                </p>

                {/* Meta + CTA row */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span>{election.candidates.length} {language === 'fr' ? 'candidats' : 'candidates'}</span>
                    {qCount > 0 && (
                      <span>· {qCount} {language === 'fr' ? 'questions' : 'questions'}</span>
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-500 group-hover:text-gray-900 transition-colors">
                    {language === 'fr' ? 'Explorer →' : 'Explore →'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Trust footer */}
      <div className="flex flex-wrap gap-x-8 gap-y-2 justify-center">
        {[t('trust_data'), t('trust_no_sell'), t('trust_anonymous')].map((msg, i) => (
          <span key={i} className="text-xs text-gray-400 flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-gray-300 flex-shrink-0" />
            {msg}
          </span>
        ))}
      </div>
    </div>
  );
}
