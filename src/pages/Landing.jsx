import React from 'react';
import { useStore } from '../store/useStore.js';
import { createTranslator } from '../i18n/translations.js';

export default function Landing() {
  const language = useStore(s => s.language);
  const navigate = useStore(s => s.navigate);
  const profile  = useStore(s => s.profile);
  const t = createTranslator(language);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-16">

      {/* Hero */}
      <div className="text-center mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-4 py-1.5 mb-5">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
          <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
            {language === 'fr' ? 'Profil politique multidimensionnel' : 'Multi-dimensional political profiling'}
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-bold text-gray-900 leading-tight mb-5">
          {t('landing_hero_title')}
        </h1>

        <p className="text-base sm:text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed mb-8">
          {t('landing_hero_subtitle')}
        </p>

        {/* CTA */}
        <button
          onClick={() => navigate('selectTest')}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-7 py-3.5 rounded-lg shadow-sm transition-colors text-base"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          {t('landing_cta_primary')}
        </button>

        {profile && (
          <p className="mt-3 text-sm text-gray-400">
            {language === 'fr' ? 'Vous avez déjà un profil.' : 'You already have a profile.'}{' '}
            <button onClick={() => navigate('profile')} className="text-blue-500 hover:text-blue-700 font-medium">
              {language === 'fr' ? 'Voir mon profil →' : 'View my profile →'}
            </button>
          </p>
        )}
      </div>

      {/* Feature cards */}
      <div className="grid sm:grid-cols-3 gap-5 mb-12">
        {[
          {
            icon: '📊',
            title: language === 'fr' ? 'Profil multidimensionnel' : 'Multi-dimensional profile',
            desc: language === 'fr'
              ? '8 thèmes politiques, 4 axes idéologiques. Bien plus qu\'un simple spectre gauche-droite.'
              : '8 political themes, 4 ideological axes. Far beyond a simple left–right spectrum.',
          },
          {
            icon: '🗳️',
            title: language === 'fr' ? 'Compatibilité électorale' : 'Election matching',
            desc: language === 'fr'
              ? 'Comparez votre profil à de vraies élections et candidats avec des scores précis.'
              : 'Compare your profile to real elections and candidates with accurate alignment scores.',
            action: () => navigate('elections'),
            actionLabel: language === 'fr' ? 'Voir les élections →' : 'Explore elections →',
          },
          {
            icon: '🏛️',
            title: language === 'fr' ? 'Figures historiques' : 'Historical figures',
            desc: language === 'fr'
              ? 'Découvrez quels dirigeants historiques vous ressemblez le plus, de Roosevelt à Thatcher.'
              : 'Discover which historical leaders you most resemble, from FDR to Thatcher.',
            action: () => navigate('figures'),
            actionLabel: language === 'fr' ? 'Explorer →' : 'Explore →',
          },
        ].map((card, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 sm:p-6">
            <div className="text-3xl mb-3">{card.icon}</div>
            <h3 className="font-semibold text-gray-900 mb-2">{card.title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{card.desc}</p>
            {card.action && !profile && (
              <p className="mt-3 text-xs text-gray-400">{t('landing_no_profile_note')}</p>
            )}
            {card.action && profile && (
              <button
                onClick={card.action}
                className="mt-3 text-sm text-blue-500 hover:text-blue-700 font-medium"
              >
                {card.actionLabel}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* How it works */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 sm:p-8">
        <h2 className="font-bold text-gray-900 text-xl mb-5">
          {language === 'fr' ? 'Comment ça fonctionne' : 'How it works'}
        </h2>
        <div className="grid sm:grid-cols-4 gap-4">
          {[
            {
              step: '1',
              title: language === 'fr' ? 'Priorisez vos thèmes' : 'Prioritize your themes',
              desc: language === 'fr' ? 'Classez les enjeux qui comptent le plus pour vous.' : 'Rank the issues that matter most to you.',
            },
            {
              step: '2',
              title: language === 'fr' ? 'Répondez aux questions' : 'Answer questions',
              desc: language === 'fr' ? 'Des questions structurées sur des enjeux politiques réels.' : 'Structured questions on real political issues.',
            },
            {
              step: '3',
              title: language === 'fr' ? 'Découvrez votre profil' : 'Discover your profile',
              desc: language === 'fr' ? 'Un profil multidimensionnel sur 8 thèmes et 4 axes.' : 'A multi-dimensional profile across 8 themes and 4 axes.',
            },
            {
              step: '4',
              title: language === 'fr' ? 'Comparez et explorez' : 'Compare & explore',
              desc: language === 'fr' ? 'Alignement avec les candidats, partis et figures historiques.' : 'Alignment with candidates, parties, and historical figures.',
            },
          ].map(({ step, title, desc }) => (
            <div key={step} className="flex gap-3">
              <div className="flex-shrink-0 w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                {step}
              </div>
              <div>
                <h4 className="font-semibold text-sm text-gray-800 mb-1">{title}</h4>
                <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Methodology note */}
      <p className="text-center text-xs text-gray-400 mt-8 max-w-xl mx-auto leading-relaxed">
        {language === 'fr'
          ? 'Poliscope est un outil analytique et éducatif. Il ne constitue pas une recommandation de vote. Les profils des candidats et des figures historiques sont des simplifications analytiques.'
          : 'Poliscope is an analytical and educational tool. It does not constitute a voting recommendation. Candidate and historical figure profiles are analytical simplifications.'}
      </p>
    </div>
  );
}
