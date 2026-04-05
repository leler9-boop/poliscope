import React from 'react';
import { motion } from 'motion/react';
import { useStore } from '../store/useStore.js';
import { createTranslator } from '../i18n/translations.js';

// Mount-based — for hero (always visible on load)
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] },
});

// Scroll-triggered — for below-fold sections
const scrollReveal = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.55, delay, ease: [0.25, 0.46, 0.45, 0.94] },
});

export default function Landing() {
  const language = useStore(s => s.language);
  const navigate  = useStore(s => s.navigate);
  const profile   = useStore(s => s.profile);
  const t = createTranslator(language);

  const steps = [
    {
      n: '01',
      title: language === 'fr' ? 'Répondez aux questions' : 'Answer questions',
      desc:  language === 'fr'
        ? 'Des questions structurées sur des enjeux politiques réels — de l\'économie à l\'environnement.'
        : 'Structured questions on real political issues — from the economy to the environment.',
    },
    {
      n: '02',
      title: language === 'fr' ? 'Découvrez votre profil' : 'Get your profile',
      desc:  language === 'fr'
        ? 'Un profil multidimensionnel sur 8 thèmes et 4 axes idéologiques.'
        : 'A multi-dimensional profile across 8 political themes and 4 ideological axes.',
    },
    {
      n: '03',
      title: language === 'fr' ? 'Comparez et explorez' : 'Compare & explore',
      desc:  language === 'fr'
        ? 'Alignement avec des candidats réels, partis et figures historiques mondiales.'
        : 'See your alignment with real candidates, parties, and world historical figures.',
    },
  ];

  const features = [
    {
      icon: '🧭',
      title: language === 'fr' ? 'Au-delà du spectre gauche–droite' : 'Beyond left–right',
      desc:  language === 'fr'
        ? '8 thèmes, 4 axes idéologiques. Votre profil politique est bien plus nuancé qu\'une simple étiquette.'
        : '8 themes, 4 ideological axes. Your political profile is far richer than any single label.',
    },
    {
      icon: '🗳️',
      title: language === 'fr' ? 'Élections réelles' : 'Real elections',
      desc:  language === 'fr'
        ? 'Comparez votre profil aux candidats des vraies élections, avec des scores d\'alignement précis.'
        : 'Compare yourself to candidates in real elections, with precise alignment scores.',
      action:      profile ? () => navigate('elections') : null,
      actionLabel: language === 'fr' ? 'Explorer les élections →' : 'Explore elections →',
    },
    {
      icon: '🏛️',
      title: language === 'fr' ? 'Figures historiques' : 'Historical figures',
      desc:  language === 'fr'
        ? '40 dirigeants historiques mondiaux. Découvrez à qui vous ressemblez, de FDR à Thatcher.'
        : '40 world leaders across history. Discover who you resemble, from FDR to Thatcher.',
      action:      profile ? () => navigate('figures') : null,
      actionLabel: language === 'fr' ? 'Explorer →' : 'Explore →',
    },
  ];

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #f5f7ff 0%, #ffffff 50%)' }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6">

        {/* ══════════════════════════════════
            HERO
        ══════════════════════════════════ */}
        <section className="pt-20 sm:pt-28 pb-20 sm:pb-24 text-center">

          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-1.5 mb-10 shadow-sm"
            {...fadeUp(0)}
          >
            <span
              className="w-1.5 h-1.5 rounded-full bg-blue-500"
              style={{ animation: 'pulse 2s infinite' }}
            />
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
              {language === 'fr' ? 'Profilage politique multidimensionnel' : 'Multi-dimensional political profiling'}
            </span>
          </motion.div>

          {/* H1 */}
          <motion.h1
            className="text-5xl sm:text-[72px] font-bold text-gray-900 tracking-tight leading-[1.04] mb-6"
            {...fadeUp(0.08)}
          >
            {language === 'fr' ? (
              <>
                Comprenez vos<br />
                <span className="text-gray-500">convictions politiques.</span>
              </>
            ) : (
              <>
                Know where<br />
                <span className="text-gray-500">you stand.</span>
              </>
            )}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-lg sm:text-xl text-gray-500 max-w-lg mx-auto leading-relaxed mb-10"
            {...fadeUp(0.16)}
          >
            {language === 'fr'
              ? 'Répondez à quelques questions. Obtenez un profil idéologique en profondeur — pas juste une étiquette.'
              : 'Answer a few questions. Get a deep ideological profile — not just a label.'}
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16"
            {...fadeUp(0.24)}
          >
            <motion.button
              onClick={() => navigate('selectTest')}
              className="inline-flex items-center gap-2 bg-gray-900 text-white font-semibold px-8 py-4 rounded-2xl shadow-md text-sm"
              whileHover={{ scale: 1.03, boxShadow: '0 12px 32px rgba(0,0,0,0.18)' }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.18, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {t('landing_cta_primary')}
              <span className="opacity-50">→</span>
            </motion.button>

            {profile ? (
              <button
                onClick={() => navigate('profile')}
                className="text-sm font-medium text-gray-400 hover:text-gray-700 transition-colors px-4 py-4"
              >
                {language === 'fr' ? 'Voir mon profil →' : 'View my profile →'}
              </button>
            ) : (
              <button
                onClick={() => navigate('elections')}
                className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 px-6 py-4 rounded-2xl hover:border-gray-300 hover:shadow-sm transition-all"
              >
                {t('landing_cta_elections')}
              </button>
            )}
          </motion.div>

          {/* Stats strip */}
          <motion.div
            className="flex flex-wrap items-center justify-center gap-6 sm:gap-8"
            {...fadeUp(0.32)}
          >
            {[
              language === 'fr' ? '8 thèmes politiques' : '8 political themes',
              language === 'fr' ? '4 axes idéologiques' : '4 ideological axes',
              language === 'fr' ? '120+ questions' : '120+ questions',
              language === 'fr' ? '40 figures historiques' : '40 historical figures',
            ].map((stat, i) => (
              <span key={i} className="flex items-center gap-2 text-xs font-medium text-gray-400">
                {i > 0 && <span className="w-1 h-1 rounded-full bg-gray-200 flex-shrink-0" />}
                {stat}
              </span>
            ))}
          </motion.div>
        </section>

        {/* ══════════════════════════════════
            HOW IT WORKS
        ══════════════════════════════════ */}
        <section className="pb-20 sm:pb-24">
          <motion.p
            className="text-xs font-semibold text-gray-400 uppercase tracking-widest text-center mb-12"
            {...scrollReveal()}
          >
            {language === 'fr' ? 'Comment ça fonctionne' : 'How it works'}
          </motion.p>

          <div className="grid sm:grid-cols-3 gap-5">
            {steps.map((step, i) => (
              <motion.div
                key={step.n}
                className="bg-white rounded-2xl border border-gray-100 p-7 hover:border-gray-200 hover:shadow-lg transition-shadow duration-300"
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
              >
                <span className="text-4xl font-black text-gray-100 tabular-nums block mb-5 leading-none">
                  {step.n}
                </span>
                <h3 className="font-semibold text-gray-900 text-sm mb-2 leading-snug">{step.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════
            WHY POLISCOP
        ══════════════════════════════════ */}
        <section className="pb-20 sm:pb-24">
          <motion.p
            className="text-xs font-semibold text-gray-400 uppercase tracking-widest text-center mb-12"
            {...scrollReveal()}
          >
            {language === 'fr' ? 'Pourquoi Poliscop' : 'Why Poliscop'}
          </motion.p>

          <div className="grid sm:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={i}
                className="bg-white rounded-2xl border border-gray-100 p-7 hover:border-gray-200 hover:shadow-lg transition-shadow duration-300 flex flex-col"
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
              >
                <span className="text-3xl mb-5 block">{f.icon}</span>
                <h3 className="font-semibold text-gray-900 text-sm mb-2 leading-snug">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed flex-1">{f.desc}</p>
                {f.action ? (
                  <button
                    onClick={f.action}
                    className="mt-5 text-xs font-semibold text-gray-700 hover:text-gray-900 transition-colors self-start"
                  >
                    {f.actionLabel}
                  </button>
                ) : (
                  !profile && i > 0 && (
                    <p className="mt-5 text-xs text-gray-300 leading-relaxed">{t('landing_no_profile_note')}</p>
                  )
                )}
              </motion.div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════
            BOTTOM CTA
        ══════════════════════════════════ */}
        <section className="pb-20 sm:pb-28">
          <motion.div
            className="bg-gray-900 rounded-3xl px-10 py-16 sm:px-16 sm:py-20 text-center"
            {...scrollReveal()}
          >
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-5">
              {language === 'fr' ? 'Commencer' : 'Get started'}
            </p>
            <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight mb-3 leading-tight">
              {language === 'fr'
                ? 'Prêt à découvrir votre profil ?'
                : 'Ready to discover your political profile?'}
            </h2>
            <p className="text-sm text-gray-500 mb-10">
              {language === 'fr' ? '5 minutes · Anonyme · Gratuit' : '5 minutes · Anonymous · Free'}
            </p>

            <motion.button
              onClick={() => navigate('selectTest')}
              className="inline-flex items-center gap-2 bg-white text-gray-900 font-semibold px-8 py-4 rounded-2xl text-sm shadow-lg"
              whileHover={{ scale: 1.03, boxShadow: '0 16px 40px rgba(0,0,0,0.25)' }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.18, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {t('landing_cta_primary')}
              <span>→</span>
            </motion.button>

            {/* Trust row */}
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-12 pt-10 border-t border-gray-800">
              {[t('trust_data'), t('trust_no_sell'), t('trust_anonymous')].map((msg, i) => (
                <span key={i} className="text-xs text-gray-500 flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-gray-700 flex-shrink-0" />
                  {msg}
                </span>
              ))}
            </div>
          </motion.div>

          <p className="text-center text-xs text-gray-400 mt-8 max-w-lg mx-auto leading-relaxed">
            {language === 'fr'
              ? 'Poliscop est un outil analytique et éducatif. Il ne constitue pas une recommandation de vote. Les profils des candidats et figures historiques sont des approximations analytiques.'
              : 'Poliscop is an analytical and educational tool. It does not constitute a voting recommendation. Candidate and historical figure profiles are analytical approximations.'}
          </p>
        </section>

      </div>
    </div>
  );
}
