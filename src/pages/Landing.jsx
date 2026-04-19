import React from 'react';
import { motion } from 'motion/react';
import { useStore } from '../store/useStore.js';
import { createTranslator } from '../i18n/translations.js';

/* ── Animation helpers ── */
const fadeUp = (delay = 0) => ({
  initial:    { opacity: 0, y: 20 },
  animate:    { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease: [0.25, 0.46, 0.45, 0.94] },
});

const scrollReveal = (delay = 0) => ({
  initial:     { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport:    { once: true, margin: '-60px' },
  transition:  { duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] },
});

/* ── SVG Icons ── (pas d'emojis — règle ui-ux-pro-max: no-emoji-icons) */
const IconCompass = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
  </svg>
);

const IconVote = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 12l2 2 4-4"/>
    <rect x="3" y="3" width="18" height="18" rx="2"/>
  </svg>
);

const IconBuilding = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 21h18M9 21V7l3-4 3 4v14M9 10h6M9 14h6M9 18h6"/>
  </svg>
);

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
      title: language === 'fr' ? 'Découvrez votre profil' : 'Discover your profile',
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
      Icon: IconCompass,
      title: language === 'fr' ? 'Au-delà du spectre gauche–droite' : 'Beyond left–right',
      desc:  language === 'fr'
        ? '8 thèmes, 4 axes idéologiques. Votre profil politique est bien plus nuancé qu\'une étiquette.'
        : '8 themes, 4 ideological axes. Your political profile is far richer than any single label.',
    },
    {
      Icon: IconVote,
      title: language === 'fr' ? 'Élections réelles' : 'Real elections',
      desc:  language === 'fr'
        ? 'Comparez votre profil aux candidats des vraies élections, avec des scores d\'alignement précis.'
        : 'Compare yourself to candidates in real elections, with precise alignment scores.',
      action:      profile ? () => navigate('elections') : null,
      actionLabel: language === 'fr' ? 'Explorer les élections →' : 'Explore elections →',
    },
    {
      Icon: IconBuilding,
      title: language === 'fr' ? 'Figures historiques' : 'Historical figures',
      desc:  language === 'fr'
        ? '40 dirigeants historiques mondiaux. Découvrez à qui vous ressemblez, de FDR à Thatcher.'
        : '40 world leaders across history. Discover who you resemble, from FDR to Thatcher.',
      action:      profile ? () => navigate('figures') : null,
      actionLabel: language === 'fr' ? 'Explorer →' : 'Explore →',
    },
  ];

  const stats = [
    language === 'fr' ? '8 thèmes' : '8 themes',
    language === 'fr' ? '4 axes idéologiques' : '4 ideological axes',
    language === 'fr' ? '120+ questions' : '120+ questions',
    language === 'fr' ? '40 figures historiques' : '40 historical figures',
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">

        {/* ══════════════════════════════════════
            HERO
        ══════════════════════════════════════ */}
        <section className="pt-20 sm:pt-28 pb-20 sm:pb-24 text-center">

          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-full px-4 py-1.5 mb-10"
            {...fadeUp(0)}
          >
            <span
              className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"
              style={{ animation: 'pulse 2s infinite' }}
            />
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
              {language === 'fr' ? 'Profilage politique multidimensionnel' : 'Multi-dimensional political profiling'}
            </span>
          </motion.div>

          {/* H1 */}
          <motion.h1
            className="text-[2.8rem] sm:text-[4rem] font-bold text-slate-900 tracking-tight leading-[1.05] mb-5"
            {...fadeUp(0.08)}
          >
            {language === 'fr' ? (
              <>
                Comprenez vos<br />
                <span className="text-slate-400">convictions politiques.</span>
              </>
            ) : (
              <>
                Know where<br />
                <span className="text-slate-400">you stand.</span>
              </>
            )}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-base sm:text-lg text-slate-500 max-w-md mx-auto leading-relaxed mb-10"
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
              className="inline-flex items-center gap-2 bg-slate-900 text-white font-semibold px-7 py-3.5 rounded-xl text-sm"
              style={{ boxShadow: '0 1px 3px rgba(15,23,42,0.12), 0 1px 2px rgba(15,23,42,0.08)' }}
              whileHover={{ scale: 1.02, boxShadow: '0 8px 24px rgba(15,23,42,0.18)' }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.15 }}
            >
              {t('landing_cta_primary')}
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M6 12l4-4-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.button>

            {profile ? (
              <button
                onClick={() => navigate('profile')}
                className="text-sm font-medium text-slate-400 hover:text-slate-700 transition-colors px-4 py-3.5"
              >
                {language === 'fr' ? 'Voir mon profil →' : 'View my profile →'}
              </button>
            ) : (
              <button
                onClick={() => navigate('elections')}
                className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 px-6 py-3.5 rounded-xl hover:border-slate-300 hover:bg-slate-50 transition-all"
              >
                {t('landing_cta_elections')}
              </button>
            )}
          </motion.div>

          {/* Stats strip */}
          <motion.div
            className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2"
            {...fadeUp(0.32)}
          >
            {stats.map((stat, i) => (
              <span key={i} className="flex items-center gap-2 text-xs font-medium text-slate-400">
                {i > 0 && <span className="w-1 h-1 rounded-full bg-slate-200 shrink-0" />}
                {stat}
              </span>
            ))}
          </motion.div>
        </section>

        {/* ══════════════════════════════════════
            COMMENT ÇA MARCHE
        ══════════════════════════════════════ */}
        <section className="pb-20 sm:pb-24">
          <motion.p
            className="text-xs font-semibold text-slate-400 uppercase tracking-widest text-center mb-12"
            {...scrollReveal()}
          >
            {language === 'fr' ? 'Comment ça fonctionne' : 'How it works'}
          </motion.p>

          <div className="grid sm:grid-cols-3 gap-4">
            {steps.map((step, i) => (
              <motion.div
                key={step.n}
                className="bg-white rounded-2xl border border-slate-200 p-7 hover:border-slate-300 transition-all duration-200"
                style={{ boxShadow: '0 1px 2px rgba(15,23,42,0.04)' }}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                whileHover={{ y: -2, boxShadow: '0 6px 16px rgba(15,23,42,0.07)', transition: { duration: 0.18 } }}
              >
                <span className="text-3xl font-black text-slate-100 tabular-nums block mb-5 leading-none">
                  {step.n}
                </span>
                <h3 className="font-semibold text-slate-900 text-sm mb-2 leading-snug">{step.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════
            POURQUOI POLISCOP
        ══════════════════════════════════════ */}
        <section className="pb-20 sm:pb-24">
          <motion.p
            className="text-xs font-semibold text-slate-400 uppercase tracking-widest text-center mb-12"
            {...scrollReveal()}
          >
            {language === 'fr' ? 'Pourquoi Poliscop' : 'Why Poliscop'}
          </motion.p>

          <div className="grid sm:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <motion.div
                key={i}
                className="bg-white rounded-2xl border border-slate-200 p-7 hover:border-slate-300 transition-all duration-200 flex flex-col"
                style={{ boxShadow: '0 1px 2px rgba(15,23,42,0.04)' }}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                whileHover={{ y: -2, boxShadow: '0 6px 16px rgba(15,23,42,0.07)', transition: { duration: 0.18 } }}
              >
                {/* Icon — SVG, pas emoji */}
                <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mb-5 shrink-0">
                  <f.Icon />
                </div>
                <h3 className="font-semibold text-slate-900 text-sm mb-2 leading-snug">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed flex-1">{f.desc}</p>
                {f.action ? (
                  <button
                    onClick={f.action}
                    className="mt-5 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors self-start"
                  >
                    {f.actionLabel}
                  </button>
                ) : (
                  !profile && i > 0 && (
                    <p className="mt-5 text-xs text-slate-300 leading-relaxed">{t('landing_no_profile_note')}</p>
                  )
                )}
              </motion.div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════
            CTA BAS
        ══════════════════════════════════════ */}
        <section className="pb-20 sm:pb-28">
          <motion.div
            className="bg-slate-900 rounded-3xl px-8 py-16 sm:px-14 sm:py-20 text-center"
            {...scrollReveal()}
          >
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-5">
              {language === 'fr' ? 'Commencer' : 'Get started'}
            </p>
            <h2 className="text-2xl sm:text-[2.2rem] font-bold text-white tracking-tight mb-3 leading-tight">
              {language === 'fr'
                ? 'Prêt à découvrir votre profil ?'
                : 'Ready to discover your political profile?'}
            </h2>
            <p className="text-sm text-slate-500 mb-10">
              {language === 'fr' ? '5 minutes · Anonyme · Gratuit' : '5 minutes · Anonymous · Free'}
            </p>

            <motion.button
              onClick={() => navigate('selectTest')}
              className="inline-flex items-center gap-2 bg-white text-slate-900 font-semibold px-7 py-3.5 rounded-xl text-sm"
              style={{ boxShadow: '0 4px 14px rgba(0,0,0,0.25)' }}
              whileHover={{ scale: 1.03, boxShadow: '0 8px 24px rgba(0,0,0,0.32)' }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.15 }}
            >
              {t('landing_cta_primary')}
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M6 12l4-4-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.button>

            {/* Trust row */}
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-12 pt-10 border-t border-slate-800">
              {[t('trust_data'), t('trust_no_sell'), t('trust_anonymous')].map((msg, i) => (
                <span key={i} className="text-xs text-slate-500 flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-slate-700 shrink-0" />
                  {msg}
                </span>
              ))}
            </div>
          </motion.div>

          <p className="text-center text-xs text-slate-400 mt-8 max-w-lg mx-auto leading-relaxed">
            {language === 'fr'
              ? 'Poliscop est un outil analytique et éducatif. Il ne constitue pas une recommandation de vote. Les profils des candidats et figures historiques sont des approximations analytiques.'
              : 'Poliscop is an analytical and educational tool. It does not constitute a voting recommendation. Candidate and historical figure profiles are analytical approximations.'}
          </p>
        </section>

      </div>
    </div>
  );
}
