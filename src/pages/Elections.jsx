import React from 'react';
import { motion } from 'motion/react';
import { useStore } from '../store/useStore.js';
import { createTranslator } from '../i18n/translations.js';
import { elections } from '../data/elections.js';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] },
});

export default function Elections() {
  const language       = useStore(s => s.language);
  const profile        = useStore(s => s.profile);
  const navigate       = useStore(s => s.navigate);
  const selectElection = useStore(s => s.selectElection);
  const electionAnswers = useStore(s => s.electionAnswers);
  const t = createTranslator(language);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16">

      {/* Header */}
      <motion.div className="mb-10" {...fadeUp(0)}>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mb-2">
          {t('elections_title')}
        </h1>
        <p className="text-gray-500 text-sm">{t('elections_subtitle')}</p>
      </motion.div>

      {/* No profile notice */}
      {!profile && (
        <motion.div
          className="bg-white border border-gray-200 rounded-2xl p-7 mb-10 shadow-sm"
          {...fadeUp(0.08)}
        >
          <div className="text-4xl mb-3">🗳️</div>
          <p className="text-gray-700 text-sm font-semibold mb-1">{t('elections_no_profile')}</p>
          <p className="text-xs text-gray-400 mb-5 leading-relaxed max-w-sm">
            {language === 'fr'
              ? 'Créez votre profil politique pour voir votre alignement avec les candidats.'
              : 'Build your political profile to see your alignment with candidates.'}
          </p>
          <button
            onClick={() => navigate('selectTest')}
            className="bg-gray-900 hover:bg-black text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
          >
            {t('landing_cta_primary')}
          </button>
        </motion.div>
      )}

      {/* Election cards */}
      <div className="grid sm:grid-cols-2 gap-5 mb-12">
        {elections.map((election, idx) => {
          const hasAnswers = Object.keys(electionAnswers[election.id] ?? {}).length > 0;
          const qCount = election.specificQuestions?.length ?? 0;

          return (
            <motion.div
              key={election.id}
              className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm cursor-pointer group"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1 + idx * 0.07, ease: [0.25, 0.46, 0.45, 0.94] }}
              whileHover={{
                y: -3,
                boxShadow: '0 12px 32px rgba(0,0,0,0.09)',
                transition: { duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] },
              }}
              onClick={() => selectElection(election.id)}
            >
              {/* Banner image */}
              {election.image ? (
                <div className="relative h-44 overflow-hidden bg-gray-950">
                  <img
                    src={election.image}
                    alt={election.title[language]}
                    className="w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-700"
                    loading="lazy"
                  />
                  {/* Base tint */}
                  <div className="absolute inset-0 bg-black/15" />
                  {/* Bottom gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Answered badge */}
                  {hasAnswers && (
                    <span className="absolute top-3 right-3 text-[11px] font-semibold text-white bg-green-600/90 px-2.5 py-0.5 rounded-full shadow-sm">
                      ✓ {language === 'fr' ? 'Répondu' : 'Answered'}
                    </span>
                  )}

                  {/* Country · year + title layered at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 px-5 pb-4 pt-10">
                    <p className="text-[10px] font-semibold text-white/55 uppercase tracking-[0.13em] mb-1.5">
                      {election.flag}&ensp;{election.country}&nbsp;·&nbsp;{election.year}
                    </p>
                    <h2 className="font-bold text-white text-[15px] leading-snug tracking-tight" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                      {election.title[language]}
                    </h2>
                  </div>
                </div>
              ) : (
                /* No image fallback */
                <div className="bg-gray-950 px-5 pt-5 pb-4">
                  <p className="text-[10px] font-semibold text-white/45 uppercase tracking-[0.13em] mb-1.5">
                    {election.flag}&ensp;{election.country}&nbsp;·&nbsp;{election.year}
                  </p>
                  <div className="flex items-center justify-between">
                    <h2 className="font-bold text-white text-[15px] leading-snug tracking-tight">
                      {election.title[language]}
                    </h2>
                    {hasAnswers && (
                      <span className="text-[11px] font-semibold text-green-400 flex-shrink-0 ml-3">
                        ✓ {language === 'fr' ? 'Répondu' : 'Answered'}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Card body */}
              <div className="p-5 sm:p-6">
                {/* Description */}
                <p className="text-sm text-gray-500 leading-relaxed mb-5 line-clamp-2">
                  {election.description[language]}
                </p>

                {/* Meta + CTA row */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <span>👥</span>
                      {election.candidates.length} {language === 'fr' ? 'candidats' : 'candidates'}
                    </span>
                    {qCount > 0 && (
                      <span className="flex items-center gap-1">
                        <span>❓</span>
                        {qCount} {language === 'fr' ? 'questions' : 'q.'}
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-semibold text-gray-400 group-hover:text-gray-900 transition-colors flex items-center gap-1">
                    {language === 'fr' ? 'Explorer' : 'Explore'}
                    <span className="group-hover:translate-x-0.5 transition-transform inline-block">→</span>
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Trust footer */}
      <motion.div
        className="flex flex-wrap gap-x-8 gap-y-2 justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.4 }}
      >
        {[t('trust_data'), t('trust_no_sell'), t('trust_anonymous')].map((msg, i) => (
          <span key={i} className="text-xs text-gray-400 flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-gray-300 flex-shrink-0" />
            {msg}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
