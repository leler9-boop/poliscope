import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { useStore } from '../store/useStore.js';
import { getParcours, stepKey } from '../content/learn/parcours/index.js';
import { findEntry } from '../content/learn/manifest.js';
import { L } from '../components/learn/helpers.js';
import { setPageMeta } from '../lib/seo.js';
import { POINTS } from '../lib/knowledge.js';

const DIFF = { 1: { fr: 'Découverte' }, 2: { fr: 'Intermédiaire' }, 3: { fr: 'Avancé' } };

export default function LearnParcours() {
  const { slug } = useParams();
  const language = useStore(s => s.language);
  const parcoursDone = useStore(s => s.parcoursDone);
  const parcours = getParcours(slug);

  React.useEffect(() => {
    if (parcours) {
      setPageMeta({
        title: `Parcours « ${parcours.titre.fr} » — apprendre pas à pas | Poliscop`,
        description: parcours.description.fr,
        path: `/learn/parcours/${slug}`,
      });
    }
  }, [slug]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!parcours) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16 text-center">
        <p className="text-gray-500 text-sm mb-4">{language === 'fr' ? `Ce parcours n'existe pas.` : `This path doesn't exist.`}</p>
        <Link to="/learn" className="text-sm font-semibold text-blue-600 hover:text-blue-800">← J'y connais rien</Link>
      </div>
    );
  }

  const done = parcoursDone[slug] || [];
  const isDone = (e) => done.includes(stepKey(e));
  const doneCount = parcours.etapes.filter(isDone).length;
  const total = parcours.etapes.length;
  const complete = doneCount === total;
  const next = parcours.etapes.find(e => !isDone(e));

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-14">

      {/* Fil d'Ariane */}
      <motion.nav initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-gray-400 mb-6">
        <Link to="/learn" className="hover:text-gray-600 transition-colors">
          {language === 'fr' ? `J'y connais rien` : 'Politics 101'}
        </Link>
        <span className="mx-1.5">›</span>
        <span className="text-gray-600 font-medium">{language === 'fr' ? 'Parcours' : 'Path'}</span>
      </motion.nav>

      {/* En-tête */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">{parcours.icon}</span>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">{L(parcours.titre, language)}</h1>
        </div>
        <p className="text-gray-500 text-sm leading-relaxed max-w-lg mb-3">{L(parcours.description, language)}</p>
        <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full border bg-emerald-50 border-emerald-200 text-emerald-700">
          {L(DIFF[parcours.difficulty], language)}
        </span>
      </motion.div>

      {/* Progression */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-gray-200 rounded-2xl p-5 mb-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold text-gray-800">
            {complete
              ? (language === 'fr' ? '🎉 Parcours terminé !' : '🎉 Path completed!')
              : `${doneCount} / ${total} ${language === 'fr' ? 'étapes' : 'steps'}`}
          </p>
          {complete && (
            <span className="text-xs font-bold text-emerald-600">+{POINTS.parcours} pts</span>
          )}
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-gray-900 rounded-full transition-all" style={{ width: `${(doneCount / total) * 100}%` }} />
        </div>
        {!complete && next && (
          <Link
            to={`/learn/${next.section}/${next.slug}?parcours=${slug}`}
            className="mt-4 inline-block bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
          >
            {doneCount === 0
              ? (language === 'fr' ? 'Commencer le parcours →' : 'Start the path →')
              : (language === 'fr' ? 'Continuer →' : 'Continue →')}
          </Link>
        )}
        {complete && (
          <p className="text-sm text-gray-500 mt-3">
            {language === 'fr'
              ? `Les points sont ajoutés à votre niveau de connaissance. Un autre parcours vous attend sur le hub.`
              : `Points added to your knowledge level. Another path awaits on the hub.`}
          </p>
        )}
      </motion.div>

      {/* Étapes */}
      <div className="space-y-2 mb-8">
        {parcours.etapes.map((e, i) => {
          const entry = findEntry(e.section, e.slug);
          if (!entry) return null;
          const ok = isDone(e);
          return (
            <Link
              key={stepKey(e)}
              to={`/learn/${e.section}/${e.slug}?parcours=${slug}`}
              className={`flex items-start gap-3 border rounded-2xl px-4 py-3.5 transition-colors ${
                ok ? 'bg-emerald-50/50 border-emerald-200 hover:border-emerald-400' : 'bg-white border-gray-200 hover:border-gray-400'
              }`}
            >
              <span className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                ok ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-500'
              }`}>
                {ok ? '✓' : i + 1}
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-gray-800">{entry.icon} {L(entry.title, language)}</span>
                <span className="block text-xs text-gray-500 leading-snug mt-0.5">{L(e.pourquoi, language)}</span>
              </span>
            </Link>
          );
        })}
      </div>

      <p className="text-center">
        <Link to="/learn" className="text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors">
          ← {language === 'fr' ? 'Tous les parcours' : 'All paths'}
        </Link>
      </p>
    </div>
  );
}
