import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useStore } from '../store/useStore.js';
import { LEARN_MANIFEST } from '../content/learn/manifest.js';
import { setPageMeta } from '../lib/seo.js';

const L = (field, language) => field?.[language] ?? field?.fr ?? '';

const CATEGORIES = {
  institutions: { fr: 'Institutions et vie politique' },
  economie: { fr: 'Économie' },
  immigration: { fr: 'Immigration, nationalité et asile' },
};

export default function LearnDico() {
  const language = useStore(s => s.language);

  React.useEffect(() => {
    setPageMeta({
      title: `Dictionnaire politique — chaque mot expliqué simplement | Poliscop`,
      description: `OQTF, 49.3, motion de censure, dette publique, proportionnelle… chaque mot du débat politique français expliqué en trois niveaux, avec sources officielles.`,
      path: '/learn/dico',
    });
  }, []);
  const defs = LEARN_MANIFEST.filter(e => e.type === 'definition');

  const byCat = {};
  for (const d of defs) (byCat[d.categorie || 'institutions'] ||= []).push(d);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <motion.nav initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-gray-400 mb-6">
        <Link to="/learn" className="hover:text-gray-600 transition-colors">
          {language === 'fr' ? `J'y connais rien` : 'Politics 101'}
        </Link>
        <span className="mx-1.5">›</span>
        <span className="text-gray-600 font-medium">{language === 'fr' ? 'Dictionnaire' : 'Dictionary'}</span>
      </motion.nav>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mb-2">
          {language === 'fr' ? 'Le dictionnaire politique' : 'The political dictionary'}
        </h1>
        <p className="text-gray-500 text-sm leading-relaxed max-w-lg">
          {language === 'fr'
            ? `Chaque mot en trois niveaux : une phrase, une explication simple, puis la fiche complète. La base grandit chaque semaine.`
            : `Every word at three levels: one sentence, a simple explanation, then the full page. The library grows every week.`}
        </p>
      </motion.div>

      {Object.entries(byCat).map(([cat, entries]) => (
        <div key={cat} className="mb-8">
          <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-3">{L(CATEGORIES[cat], language)}</p>
          <div className="space-y-2">
            {entries.map(entry => (
              <Link
                key={entry.slug}
                to={`/learn/${entry.section}/${entry.slug}`}
                className="flex items-start gap-3 bg-white border border-gray-200 hover:border-gray-400 rounded-2xl px-4 py-3 transition-colors"
              >
                <span className="text-xl shrink-0 mt-0.5">{entry.icon}</span>
                <span>
                  <span className="block text-sm font-semibold text-gray-800">{L(entry.title, language)}</span>
                  <span className="block text-xs text-gray-500 leading-snug mt-0.5">{L(entry.hook, language)}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
