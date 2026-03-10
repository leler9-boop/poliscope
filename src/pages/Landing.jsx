import React from 'react';
import { useStore } from '../store/useStore.js';
import { createTranslator } from '../i18n/translations.js';

export default function Landing() {
  const language = useStore(s => s.language);
  const navigate = useStore(s => s.navigate);
  const profile  = useStore(s => s.profile);
  const t = createTranslator(language);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 sm:py-20">

      {/* Hero */}
      <div className="max-w-3xl mx-auto text-center mb-16 sm:mb-20">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-5">
          {language === 'fr' ? 'Profilage politique multidimensionnel' : 'Multi-dimensional political profiling'}
        </p>

        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight tracking-tight mb-6">
          {t('landing_hero_title')}
        </h1>

        <p className="text-base sm:text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed mb-10">
          {t('landing_hero_subtitle')}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => navigate('selectTest')}
            className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-semibold px-7 py-3.5 rounded-xl shadow-sm transition-colors text-sm"
          >
            {t('landing_cta_primary')}
          </button>

          {profile ? (
            <button
              onClick={() => navigate('profile')}
              className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
            >
              {language === 'fr' ? 'Voir mon profil →' : 'View my profile →'}
            </button>
          ) : (
            <button
              onClick={() => navigate('elections')}
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 border border-gray-200 px-5 py-3.5 rounded-xl hover:border-gray-300 transition-colors"
            >
              {t('landing_cta_elections')}
            </button>
          )}
        </div>
      </div>

      {/* Feature cards */}
      <div className="grid sm:grid-cols-3 gap-4 mb-16">
        {[
          {
            label: language === 'fr' ? 'Profil' : 'Profile',
            title: language === 'fr' ? 'Profil multidimensionnel' : 'Multi-dimensional profile',
            desc: language === 'fr'
              ? '8 thèmes politiques, 4 axes idéologiques. Bien au-delà du spectre gauche–droite.'
              : '8 political themes, 4 ideological axes. Far beyond a simple left–right spectrum.',
          },
          {
            label: language === 'fr' ? 'Élections' : 'Elections',
            title: language === 'fr' ? 'Compatibilité électorale' : 'Election matching',
            desc: language === 'fr'
              ? 'Comparez votre profil à de vraies élections et candidats avec des scores précis.'
              : 'Compare your profile to real elections and candidates with accurate alignment scores.',
            action: () => navigate('elections'),
            actionLabel: language === 'fr' ? 'Explorer les élections →' : 'Explore elections →',
          },
          {
            label: language === 'fr' ? 'Histoire' : 'History',
            title: language === 'fr' ? 'Figures historiques' : 'Historical figures',
            desc: language === 'fr'
              ? 'Découvrez quels dirigeants historiques vous ressemblez, de Roosevelt à Thatcher.'
              : 'Discover which historical leaders you most resemble, from FDR to Thatcher.',
            action: () => navigate('figures'),
            actionLabel: language === 'fr' ? 'Explorer →' : 'Explore →',
          },
        ].map((card, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-7 hover:border-gray-300 hover:shadow-sm transition-all">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">{card.label}</p>
            <h3 className="font-semibold text-gray-900 text-base mb-2 leading-snug">{card.title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{card.desc}</p>
            {card.action && !profile && (
              <p className="mt-4 text-xs text-gray-400">{t('landing_no_profile_note')}</p>
            )}
            {card.action && profile && (
              <button
                onClick={card.action}
                className="mt-5 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                {card.actionLabel}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* How it works */}
      <div className="bg-white rounded-2xl border border-gray-200 p-7 sm:p-10 mb-14">
        <h2 className="font-bold text-gray-900 text-lg mb-8 tracking-tight">
          {language === 'fr' ? 'Comment ça fonctionne' : 'How it works'}
        </h2>
        <div className="grid sm:grid-cols-4 gap-6 sm:gap-8">
          {[
            {
              step: '01',
              title: language === 'fr' ? 'Priorisez vos thèmes' : 'Prioritize your themes',
              desc: language === 'fr' ? 'Classez les enjeux qui comptent le plus pour vous.' : 'Rank the issues that matter most to you.',
            },
            {
              step: '02',
              title: language === 'fr' ? 'Répondez aux questions' : 'Answer questions',
              desc: language === 'fr' ? 'Des questions structurées sur des enjeux politiques réels.' : 'Structured questions on real political issues.',
            },
            {
              step: '03',
              title: language === 'fr' ? 'Découvrez votre profil' : 'Discover your profile',
              desc: language === 'fr' ? 'Un profil multidimensionnel sur 8 thèmes et 4 axes.' : 'A multi-dimensional profile across 8 themes and 4 axes.',
            },
            {
              step: '04',
              title: language === 'fr' ? 'Comparez et explorez' : 'Compare & explore',
              desc: language === 'fr' ? 'Alignement avec les candidats, partis et figures historiques.' : 'Alignment with candidates, parties, and historical figures.',
            },
          ].map(({ step, title, desc }) => (
            <div key={step}>
              <p className="text-xs font-bold text-gray-300 tracking-widest mb-3">{step}</p>
              <h4 className="font-semibold text-sm text-gray-900 mb-2 leading-snug">{title}</h4>
              <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Trust row */}
      <div className="flex flex-wrap gap-x-8 gap-y-2 justify-center mb-10">
        {[t('trust_data'), t('trust_no_sell'), t('trust_anonymous')].map((msg, i) => (
          <span key={i} className="text-xs text-gray-400 flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-gray-300 flex-shrink-0" />
            {msg}
          </span>
        ))}
      </div>

      {/* Disclaimer */}
      <p className="text-center text-xs text-gray-400 max-w-xl mx-auto leading-relaxed">
        {language === 'fr'
          ? 'Poliscope est un outil analytique et éducatif. Il ne constitue pas une recommandation de vote. Les profils des candidats et des figures historiques sont des approximations analytiques.'
          : 'Poliscope is an analytical and educational tool. It does not constitute a voting recommendation. Candidate and historical figure profiles are analytical approximations.'}
      </p>
    </div>
  );
}
