import React, { useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useStore } from '../store/useStore.js';
import { LEARN_MANIFEST, UPCOMING, findBySlug, searchLearn } from '../content/learn/manifest.js';
import { VRAIFAUX_BANK, VRAIFAUX_IDS, VERDICT_LABELS } from '../content/learn/vraifaux/bank.js';
import { setPageMeta } from '../lib/seo.js';
import { PARCOURS_LIST, stepKey } from '../content/learn/parcours/index.js';
import { computeScore } from '../lib/knowledge.js';

const L = (field, language) => field?.[language] ?? field?.fr ?? '';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, delay },
});

function formatDate(iso, language) {
  if (!iso) return '';
  try {
    return new Date(iso + 'T00:00:00').toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch { return iso; }
}

function SectionLabel({ children }) {
  return <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-3">{children}</p>;
}

/* ── 1. Recherche ────────────────────────────────────────────────────────── */

function LearnSearch({ language }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const results = useMemo(() => searchLearn(query), [query]);
  const inputRef = useRef(null);

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="search"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder={language === 'fr' ? `Une question politique ? Écrivez-la simplement.` : 'A political question? Just type it.'}
        className="w-full bg-white border border-gray-200 focus:border-gray-400 rounded-2xl px-5 py-4 text-[15px] text-gray-800 placeholder-gray-400 outline-none shadow-sm transition-colors"
      />
      {query.length >= 2 && (
        <div className="absolute z-20 left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden">
          {results.length === 0 ? (
            <p className="px-5 py-4 text-sm text-gray-400">
              {language === 'fr'
                ? `Pas encore de fiche pour cette question — la base grandit chaque semaine.`
                : `No page for this yet — the library grows every week.`}
            </p>
          ) : results.map(entry => (
            <button
              key={entry.slug}
              onClick={() => navigate(`/learn/${entry.section}/${entry.slug}`)}
              className="w-full flex items-start gap-3 px-5 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
            >
              <span className="text-xl shrink-0 mt-0.5">{entry.icon}</span>
              <span>
                <span className="block text-sm font-semibold text-gray-800">{L(entry.title, language)}</span>
                <span className="block text-xs text-gray-500 leading-snug mt-0.5">{L(entry.hook, language)}</span>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── carte générique (repère / actualité) ─────────────────────────────────── */

function EntryCard({ slug, language, dated = false }) {
  const entry = findBySlug(slug);
  const upcoming = !entry && UPCOMING.find(u => u.slug === slug);
  const item = entry || upcoming;
  if (!item) return null;

  const inner = (
    <div className="flex items-start gap-3">
      <span className="text-2xl shrink-0">{item.icon}</span>
      <div className="min-w-0">
        <p className="text-sm font-bold text-gray-900 flex items-center gap-2 flex-wrap">
          {L(item.title, language)}
          {!entry && (
            <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
              {language === 'fr' ? 'bientôt' : 'soon'}
            </span>
          )}
        </p>
        <p className="text-xs text-gray-500 leading-snug mt-1">{L(item.hook, language)}</p>
        {dated && entry?.lastReviewedAt && (
          <p className="text-[11px] text-gray-400 mt-1.5">
            ✓ {language === 'fr' ? 'vérifié le' : 'verified'} {formatDate(entry.lastReviewedAt, language)}
          </p>
        )}
      </div>
    </div>
  );

  if (entry) {
    return (
      <Link
        to={`/learn/${entry.section}/${entry.slug}`}
        className="block bg-white border border-gray-200 hover:border-gray-400 rounded-2xl px-4 py-3.5 transition-colors"
      >
        {inner}
      </Link>
    );
  }
  return <div className="bg-gray-50 border border-dashed border-gray-200 rounded-2xl px-4 py-3.5">{inner}</div>;
}

/* ── 6. Vrai ou faux ? (carte interactive) ────────────────────────────────── */

const VERDICT_STYLE = {
  vrai: 'bg-emerald-50 border-emerald-200 text-emerald-700',
  faux: 'bg-rose-50 border-rose-200 text-rose-700',
  partiel: 'bg-amber-50 border-amber-200 text-amber-700',
  trompeur: 'bg-orange-50 border-orange-200 text-orange-700',
  'sans-contexte': 'bg-gray-100 border-gray-200 text-gray-600',
};

// L'intuition « nuancé » regroupe les verdicts partiel / trompeur / sans-contexte.
const GUESSES = [
  { key: 'vrai', label: { fr: 'Vrai' }, matches: ['vrai'] },
  { key: 'faux', label: { fr: 'Faux' }, matches: ['faux'] },
  { key: 'nuance', label: { fr: `C'est plus nuancé` }, matches: ['partiel', 'trompeur', 'sans-contexte'] },
];

function VraiFauxCard({ language }) {
  const recordVf = useStore(s => s.recordVf);
  const [idx, setIdx] = useState(() => Math.floor(Math.random() * VRAIFAUX_IDS.length));
  const [guessed, setGuessed] = useState(null);
  const id = VRAIFAUX_IDS[idx];
  const item = VRAIFAUX_BANK[id];

  const guess = (g) => {
    const correct = g.matches.includes(item.verdict);
    setGuessed({ correct });
    recordVf(id, correct);
  };

  const next = () => {
    setGuessed(null);
    setIdx(i => (i + 1) % VRAIFAUX_IDS.length);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5">
      <p className="text-[15px] font-medium text-gray-800 mb-3">« {L(item.enonce, language)} »</p>
      {!guessed ? (
        <div className="flex flex-wrap gap-2">
          {GUESSES.map(g => (
            <button
              key={g.key}
              onClick={() => guess(g)}
              className="text-sm font-semibold border border-gray-200 hover:border-gray-400 text-gray-700 px-4 py-2 rounded-xl transition-colors"
            >
              {L(g.label, language)}
            </button>
          ))}
        </div>
      ) : (
        <div>
          <p className={`text-xs font-bold mb-2 ${guessed.correct ? 'text-emerald-600' : 'text-rose-500'}`}>
            {guessed.correct
              ? (language === 'fr' ? '✓ Bien vu ! +5 pts' : '✓ Well spotted! +5 pts')
              : (language === 'fr' ? '✗ Pas tout à fait…' : '✗ Not quite…')}
          </p>
          <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full border mb-2 ${VERDICT_STYLE[item.verdict]}`}>
            {L(VERDICT_LABELS[item.verdict], language)}
          </span>
          <p className="text-sm text-gray-600 leading-relaxed mb-3">{L(item.explication, language)}</p>
          <button onClick={next} className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors">
            {language === 'fr' ? 'Un autre →' : 'Another one →'}
          </button>
        </div>
      )}
    </div>
  );
}

/* ── page ────────────────────────────────────────────────────────────────── */

const REPERES = ['gauche', 'droite', 'centre', 'president-de-la-republique', 'elections', 'partis'];
const ACTUALITE = ['retraites', 'oqtf', 'inflation'];
const MOTS_PARTOUT = ['oqtf', '49-3', 'dette-publique', 'proportionnelle', 'motion-de-censure'];


export default function LearnHub() {
  const language = useStore(s => s.language);
  const lastLearn = useStore(s => s.lastLearn);
  const knowledge = useStore(s => s.knowledge);
  const parcoursDone = useStore(s => s.parcoursDone);
  const score = computeScore(knowledge, parcoursDone, PARCOURS_LIST);

  React.useEffect(() => {
    setPageMeta({
      title: `J'y connais rien — la politique expliquée simplement | Poliscop`,
      description: `Comprendre la politique sans jargon : chaque sujet en 20 secondes, 3 minutes ou en profondeur. Gauche, droite, institutions, immigration, laïcité — expliqués simplement et sourcés.`,
      path: '/learn',
    });
  }, []);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-14">

      {/* 1. En-tête — identité « J'y connais rien » */}
      <motion.div {...fadeUp(0)} className="mb-6">
        <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold px-3 py-1 rounded-full mb-3">
          <span>💡</span>Poliscop
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-2">
          {language === 'fr' ? `J'y connais rien` : 'Politics 101'}
        </h1>
        <p className="text-gray-600 text-[15px] leading-relaxed max-w-lg">
          {language === 'fr'
            ? `La politique expliquée simplement, sans vous prendre pour un idiot.`
            : `Politics explained simply — without treating you like an idiot.`}
        </p>
        <p className="text-gray-400 text-sm leading-relaxed max-w-lg mt-1">
          {language === 'fr'
            ? `Chaque sujet en 20 secondes, en 3 minutes, ou en profondeur. À vous de choisir.`
            : `Every topic in 20 seconds, 3 minutes, or in depth. Your call.`}
        </p>
      </motion.div>

      {/* 2. Recherche */}
      <motion.div {...fadeUp(0.05)} className="mb-8">
        <LearnSearch language={language} />
      </motion.div>

      {/* 9. Reprendre où j'en étais (seulement si progression) */}
      {lastLearn && (
        <motion.div {...fadeUp(0.08)} className="mb-8">
          <Link
            to={`/learn/${lastLearn.section}/${lastLearn.slug}`}
            className="flex items-center justify-between bg-gray-900 hover:bg-gray-800 rounded-2xl px-5 py-3.5 transition-colors"
          >
            <span className="text-sm text-white">
              <span className="text-gray-400">{language === 'fr' ? `Reprendre où j'en étais — ` : 'Pick up where I left off — '}</span>
              <span className="font-semibold">{lastLearn.title}</span>
            </span>
            <span className="text-gray-400">→</span>
          </Link>
        </motion.div>
      )}

      {/* Votre niveau de connaissance */}
      <motion.div {...fadeUp(0.09)} className="mb-8">
        <div className="bg-white border border-gray-200 rounded-2xl px-5 py-4 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-1">
              {language === 'fr' ? 'Votre niveau' : 'Your level'}
            </p>
            <p className="text-sm font-bold text-gray-900">
              {score.niveau.icon} {L(score.niveau.nom, language)}
              <span className="font-semibold text-gray-400"> · {score.points} pts</span>
            </p>
            {score.suivant ? (
              <div className="mt-1.5 flex items-center gap-2">
                <div className="w-32 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gray-900 rounded-full" style={{ width: `${score.progression}%` }} />
                </div>
                <span className="text-[10px] text-gray-400">
                  {score.suivant.icon} {language === 'fr' ? 'à' : 'at'} {score.suivant.min} pts
                </span>
              </div>
            ) : (
              <p className="text-[11px] text-gray-400 mt-1">{L(score.niveau.phrase, language)}</p>
            )}
          </div>
          <Link
            to="/learn/quiz"
            className="shrink-0 bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors"
          >
            {language === 'fr' ? '🏆 Le grand quiz' : '🏆 Big quiz'}
          </Link>
        </div>
      </motion.div>

      {/* 3. Commencer de zéro */}
      <motion.div {...fadeUp(0.1)} className="mb-10">
        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold px-3 py-1 rounded-full mb-3">
            <span>💡</span>{language === 'fr' ? `J'y connais rien` : 'Total beginner'}
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-1.5">
            {language === 'fr' ? 'Commencer de zéro' : 'Start from zero'}
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed mb-4">
            {language === 'fr'
              ? `Un parcours en 7 étapes pour tout comprendre dans le bon ordre : la politique, la gauche et la droite, les institutions, le vote, les partis, les débats — et comment vérifier une info.`
              : `A 7-step path to understand everything in the right order — politics, left and right, institutions, voting, parties, debates, and how to check a claim.`}
          </p>
          <Link
            to="/learn/parcours/je-pars-de-zero"
            className="inline-block bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
          >
            {language === 'fr' ? `Commencer le parcours →` : 'Start the path →'}
          </Link>
        </div>
      </motion.div>

      {/* 4. Les grands repères */}
      <motion.div {...fadeUp(0.14)} className="mb-10">
        <SectionLabel>{language === 'fr' ? 'Comprendre les grands repères' : 'The big landmarks'}</SectionLabel>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {REPERES.map(slug => <EntryCard key={slug} slug={slug} language={language} />)}
        </div>
      </motion.div>

      {/* 5. Comprendre l'actualité */}
      <motion.div {...fadeUp(0.18)} className="mb-10">
        <SectionLabel>{language === 'fr' ? `Comprendre l'actualité` : 'Understand the news'}</SectionLabel>
        <div className="space-y-2.5">
          {ACTUALITE.map(slug => <EntryCard key={slug} slug={slug} language={language} dated />)}
        </div>
      </motion.div>

      {/* 6. J'entends ce mot partout */}
      <motion.div {...fadeUp(0.22)} className="mb-10">
        <div className="flex items-baseline justify-between gap-2 mb-3">
          <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
            {language === 'fr' ? `J'entends ce mot partout` : 'I keep hearing this word'}
          </p>
          <Link to="/learn/dico" className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors">
            {language === 'fr' ? 'Tout le dictionnaire →' : 'Full dictionary →'}
          </Link>
        </div>
        <div className="flex flex-wrap gap-2">
          {MOTS_PARTOUT.map(slug => {
            const entry = findBySlug(slug);
            if (!entry) return null;
            return (
              <Link
                key={slug}
                to={`/learn/${entry.section}/${entry.slug}`}
                className="inline-flex items-center gap-1.5 bg-white border border-gray-200 hover:border-gray-400 text-sm text-gray-700 font-medium px-3.5 py-2 rounded-full transition-colors"
              >
                <span>{entry.icon}</span>{L(entry.title, language)}
              </Link>
            );
          })}
        </div>
      </motion.div>

      {/* 7. Vrai ou faux ? */}
      <motion.div {...fadeUp(0.26)} className="mb-10">
        <SectionLabel>{language === 'fr' ? 'Vrai ou faux ?' : 'True or false?'}</SectionLabel>
        <VraiFauxCard language={language} />
      </motion.div>

      {/* 8. Parcours guidés */}
      <motion.div {...fadeUp(0.3)} className="mb-10">
        <div className="flex items-baseline justify-between gap-2 mb-3">
          <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
            {language === 'fr' ? 'Les parcours guidés' : 'Guided paths'}
          </p>
          <Link to="/learn/quiz" className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors">
            {language === 'fr' ? 'Le grand quiz →' : 'The big quiz →'}
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {PARCOURS_LIST.map(p => {
            const done = (parcoursDone[p.slug] || []).filter(k => p.etapes.some(e => stepKey(e) === k)).length;
            const total = p.etapes.length;
            const complete = done === total;
            return (
              <Link
                key={p.slug}
                to={`/learn/parcours/${p.slug}`}
                className={`block border rounded-2xl px-4 py-3.5 transition-colors ${
                  complete ? 'bg-emerald-50/50 border-emerald-200 hover:border-emerald-400' : 'bg-white border-gray-200 hover:border-gray-400'
                }`}
              >
                <p className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
                  <span>{p.icon}</span>{L(p.titre, language)}
                  {complete && <span className="text-emerald-600 text-xs">✓</span>}
                </p>
                <p className="text-[11px] text-gray-400 mt-0.5 leading-snug">{L(p.description, language)}</p>
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${complete ? 'bg-emerald-500' : 'bg-gray-900'}`} style={{ width: `${(done / total) * 100}%` }} />
                  </div>
                  <span className="text-[10px] font-semibold text-gray-400 tabular-nums">{done}/{total}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </motion.div>

      {/* 9. Accès aux contenus avancés — Poliscop Academy */}
      <motion.div {...fadeUp(0.34)} className="mb-4">
        <Link
          to="/learn/academy"
          className="group relative block overflow-hidden bg-gray-900 hover:bg-gray-800 rounded-3xl px-6 py-7 transition-colors"
        >
          <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-white/5" />
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Poliscop</p>
          <p className="text-2xl font-bold text-white tracking-tight mb-2">Academy</p>
          <p className="text-sm text-gray-300 leading-relaxed max-w-md mb-3">
            {language === 'fr'
              ? `Prêt à aller plus loin ? Les grands dossiers complets : idéologies, débats, présidents, chronologies — tout sourcé, tout vérifié.`
              : `Ready for more? The complete dossiers: ideologies, debates, presidents, timelines — all sourced, all verified.`}
          </p>
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-white">
            {language === 'fr' ? `Entrer dans l'Academy` : 'Enter the Academy'}
            <span className="group-hover:translate-x-0.5 transition-transform">→</span>
          </span>
        </Link>
      </motion.div>

      {/* Lien discret vers l'ancienne version pendant la migration */}
      <p className="text-xs text-gray-300 text-center mt-8">
        <Link to="/learn/explorer" className="hover:text-gray-500 transition-colors">
          {language === 'fr' ? `Voir les fiches de la première version →` : 'See the first-generation pages →'}
        </Link>
      </p>
    </div>
  );
}
