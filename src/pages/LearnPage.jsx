import React, { useEffect, useRef, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { useStore } from '../store/useStore.js';
import { findEntry, findBySlug, SECTIONS } from '../content/learn/manifest.js';
import { getVraiFaux } from '../content/learn/vraifaux/bank.js';
import { L, formatDate, DIFFICULTY } from '../components/learn/helpers.js';
import { SectionBody } from '../components/learn/Briques.jsx';
import {
  ReadingProgress, LevelNav, Accordion, Chronologie, TableauComparatif,
  VraiFauxItem, QuizItem, LinkChip,
} from '../components/learn/Modules.jsx';

/**
 * Renderer générique d'une fiche « J'y connais rien » / Poliscop Academy.
 * La logique de page (niveaux, sommaire, ancres) vit ici ; tout le rendu
 * de contenu vit dans src/components/learn/.
 */
export default function LearnPage() {
  const { section, slug } = useParams();
  const [searchParams] = useSearchParams();
  const language = useStore(s => s.language);
  const setLastLearn = useStore(s => s.setLastLearn);

  const entry = findEntry(section, slug);
  const [content, setContent] = useState(null);
  const [maxLevel, setMaxLevel] = useState(1); // passage de niveau toujours explicite (bouton)
  const [openSections, setOpenSections] = useState({});
  const [sommaireOpen, setSommaireOpen] = useState(false);
  const level2Ref = useRef(null);
  const level3Ref = useRef(null);
  const anchorRefs = useRef({});

  // ?niveau=2|3 : deep-link depuis l'Academy ou la recherche — ouvre directement le bon niveau
  const wantedLevel = parseInt(searchParams.get('niveau'), 10) || 1;

  useEffect(() => {
    let alive = true;
    setContent(null);
    setMaxLevel(wantedLevel >= 3 ? 4 : wantedLevel);
    setOpenSections({});
    setSommaireOpen(false);
    if (entry) {
      entry.load().then(c => { if (alive) setContent(c); });
      setLastLearn({ section, slug, title: entry.title.fr, ts: Date.now() });
    }
    return () => { alive = false; };
  }, [section, slug]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!entry) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16 text-center">
        <p className="text-gray-500 text-sm mb-4">
          {language === 'fr' ? `Cette fiche n'existe pas (encore).` : `This page doesn't exist (yet).`}
        </p>
        <Link to="/learn" className="text-sm font-semibold text-blue-600 hover:text-blue-800">
          ← {language === 'fr' ? `J'y connais rien` : 'Politics 101'}
        </Link>
      </div>
    );
  }

  const diff = DIFFICULTY[entry.difficulty] || DIFFICULTY[1];
  const frOnly = language !== 'fr' && !(entry.langs || []).includes(language);
  const parentFiche = content?.parentFiche ? findBySlug(content.parentFiche) : null;

  const openAnchor = (id) => {
    setOpenSections(s => ({ ...s, [id]: true }));
    setTimeout(() => anchorRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60);
  };

  const showLevel2 = () => {
    setMaxLevel(2);
    setTimeout(() => level2Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60);
  };

  const showLevel3 = () => {
    setMaxLevel(4);
    setTimeout(() => level3Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60);
  };

  const jumpToLevel = (l) => {
    if (l > maxLevel) setMaxLevel(l >= 3 ? 4 : l);
    setTimeout(() => {
      if (l === 1) window.scrollTo({ top: 0, behavior: 'smooth' });
      else if (l === 2) level2Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      else level3Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  };

  const setAllSections = (open) => {
    const next = {};
    (content?.level3?.sections || []).forEach(s => { if (s.id) next[s.id] = open; });
    setOpenSections(next);
  };

  const vfItems = content ? getVraiFaux(content.vraiFaux) : [];
  const allOpen = content?.level3?.sections?.every(s => !s.id || openSections[s.id]);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <ReadingProgress />

      {/* Fil d'Ariane */}
      <motion.nav initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-gray-400 mb-6 flex flex-wrap items-center gap-1.5">
        <Link to="/learn" className="hover:text-gray-600 transition-colors">
          {language === 'fr' ? `J'y connais rien` : 'Politics 101'}
        </Link>
        <span>›</span>
        <span>{L(SECTIONS[entry.section], language)}</span>
        <span>›</span>
        <span className="text-gray-600 font-medium">{L(entry.title, language)}</span>
      </motion.nav>

      {/* En-tête */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl">{entry.icon}</span>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">{L(entry.title, language)}</h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${diff.cls}`}>
            {L(diff, language)}
          </span>
          {entry.lastReviewedAt && (
            <span className="text-xs text-gray-400 bg-white border border-gray-200 px-2.5 py-1 rounded-full">
              ✓ {language === 'fr' ? 'Vérifié le' : 'Verified'} {formatDate(entry.lastReviewedAt, language)}
            </span>
          )}
        </div>
        {frOnly && (
          <p className="mt-3 text-xs text-gray-400 italic">This page is currently available in French only.</p>
        )}
      </motion.div>

      {!content ? (
        <div className="flex items-center justify-center min-h-[30vh]">
          <div className="w-6 h-6 rounded-full border-2 border-gray-200 border-t-gray-500 animate-spin" />
        </div>
      ) : (
        <>
          {/* Navigation entre niveaux (sticky) */}
          {(entry.hasLevels || []).length > 1 && (
            <LevelNav hasLevels={entry.hasLevels} maxLevel={maxLevel} language={language} onJump={jumpToLevel} />
          )}

          {/* N1 — En 20 secondes */}
          <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-gray-200 rounded-2xl p-5 mb-4">
            <p className="text-xs font-bold uppercase tracking-wide text-amber-600 mb-2">
              {language === 'fr' ? '⏱ En 20 secondes' : '⏱ In 20 seconds'}
            </p>
            <p className="text-[15px] text-gray-800 leading-relaxed">{L(content.level1, language)}</p>
          </motion.section>

          {/* Renvoi vers la grande fiche (définitions du dico rattachées à un débat) */}
          {parentFiche && (
            <Link
              to={`/learn/${parentFiche.section}/${parentFiche.slug}?niveau=3`}
              className="flex items-center justify-between bg-indigo-50 border border-indigo-200 hover:border-indigo-400 rounded-2xl px-5 py-3.5 mb-4 transition-colors"
            >
              <span className="text-sm text-indigo-800">
                {language === 'fr' ? 'La grande fiche débat : ' : 'The full debate page: '}
                <span className="font-semibold">{L(parentFiche.title, language)}</span>
              </span>
              <span className="text-indigo-400">→</span>
            </Link>
          )}

          {/* CTA vers N2 */}
          {content.level2?.sections?.length > 0 && maxLevel < 2 && (
            <button
              onClick={showLevel2}
              className="w-full bg-white hover:bg-gray-50 border border-gray-300 text-gray-800 text-sm font-semibold rounded-2xl px-5 py-4 mb-4 transition-colors"
            >
              {language === 'fr' ? 'Comprendre un peu mieux →' : 'Understand a bit more →'}
            </button>
          )}

          {/* N2 — En 3 minutes */}
          {content.level2?.sections?.length > 0 && maxLevel >= 2 && (
            <section ref={level2Ref} className="bg-white border border-gray-200 rounded-2xl p-5 mb-4 scroll-mt-12">
              <p className="text-xs font-bold uppercase tracking-wide text-blue-600 mb-4">
                {language === 'fr' ? '📖 En 3 minutes' : '📖 In 3 minutes'}
              </p>
              <div className="space-y-5">
                {content.level2.sections.map((s, i) => (
                  <div key={i}>
                    <h3 className="text-sm font-bold text-gray-900 mb-1.5">{L(s.titre, language)}</h3>
                    <SectionBody section={s} language={language} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* CTA vers N3 */}
          {content.level3?.sections?.length > 0 && maxLevel === 2 && (
            <button
              onClick={showLevel3}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold rounded-2xl px-5 py-4 mb-4 transition-colors"
            >
              {language === 'fr' ? 'Tout comprendre sur ce sujet →' : 'Understand everything →'}
            </button>
          )}

          {/* N3 — Tout comprendre */}
          {content.level3?.sections?.length > 0 && maxLevel >= 3 && (
            <section ref={level3Ref} className="mb-4 scroll-mt-12">
              <div className="flex items-center justify-between gap-2 mb-3 px-1">
                <p className="text-xs font-bold uppercase tracking-wide text-purple-600">
                  {language === 'fr' ? '🔍 Tout comprendre' : '🔍 The full picture'}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSommaireOpen(o => !o)}
                    className="text-xs font-semibold text-gray-500 hover:text-gray-800 transition-colors"
                  >
                    {language === 'fr' ? 'Sommaire' : 'Contents'}
                  </button>
                  <span className="text-gray-300">·</span>
                  <button
                    onClick={() => setAllSections(!allOpen)}
                    className="text-xs font-semibold text-gray-500 hover:text-gray-800 transition-colors"
                  >
                    {allOpen
                      ? (language === 'fr' ? 'Tout replier' : 'Collapse all')
                      : (language === 'fr' ? 'Tout ouvrir' : 'Expand all')}
                  </button>
                </div>
              </div>

              {/* Sommaire */}
              {sommaireOpen && (
                <div className="bg-white border border-gray-200 rounded-2xl p-4 mb-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                    {content.level3.sections.map((s, i) => (
                      <button
                        key={s.id || i}
                        onClick={() => { if (s.id) openAnchor(s.id); setSommaireOpen(false); }}
                        className="text-left text-[13px] text-gray-600 hover:text-gray-900 py-1 border-b border-gray-50 last:border-0 transition-colors"
                      >
                        <span className="text-gray-300 font-semibold tabular-nums mr-1.5">{String(i + 1).padStart(2, '0')}</span>
                        {L(s.titre, language)}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Cartographie (dossiers-pivots) */}
              {content.carte?.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-3">
                  <h3 className="text-sm font-bold text-gray-900 mb-3">
                    {L(content.carteTitre, language) || (language === 'fr' ? 'La carte — cliquez pour ouvrir' : 'The map — click to open')}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {content.carte.map(c => (
                      <button
                        key={c.id}
                        onClick={() => openAnchor(c.id)}
                        className="text-left bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl px-3 py-2.5 transition-colors"
                      >
                        <p className="text-sm font-semibold text-gray-800">{L(c.nom, language)}</p>
                        <p className="text-xs text-gray-500 leading-snug mt-0.5">{L(c.resume, language)}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                {content.level3.sections.map(s => (
                  <Accordion
                    key={s.id || L(s.titre, language)}
                    section={s}
                    language={language}
                    isOpen={!!openSections[s.id]}
                    onToggle={() => setOpenSections(o => ({ ...o, [s.id]: !o[s.id] }))}
                    anchorRef={el => { if (s.id) anchorRefs.current[s.id] = el; }}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Chronologie */}
          {content.chronologie && maxLevel >= 3 && (
            <Chronologie chrono={content.chronologie} language={language} />
          )}

          {/* Tableau comparatif */}
          {content.tableauComparatif && maxLevel >= 3 && (
            <TableauComparatif tableau={content.tableauComparatif} language={language} />
          )}

          {/* N4 — Pour aller encore plus loin */}
          {content.level4?.items?.length > 0 && maxLevel >= 3 && (
            <section className="bg-white border border-gray-200 rounded-2xl p-5 mb-4">
              <p className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-3">
                {language === 'fr' ? '📚 Pour aller encore plus loin' : '📚 To go further'}
              </p>
              <div className="space-y-3">
                {content.level4.items.map((item, i) => (
                  <div key={i} className="flex gap-2.5">
                    <span className="text-gray-300 text-sm shrink-0">
                      {item.kind === 'discours' ? '🎙' : item.kind === 'biblio' ? '📖' : item.kind === 'donnees' ? '📊' : '🔗'}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {item.url
                          ? <a href={item.url} target="_blank" rel="noopener noreferrer" className="hover:underline">{L(item.titre, language)}</a>
                          : L(item.titre, language)}
                      </p>
                      {item.note && <p className="text-xs text-gray-500 mt-0.5">{L(item.note, language)}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Vrai ou faux ? */}
          {vfItems.length > 0 && maxLevel >= 2 && (
            <section className="mb-4">
              <p className="text-xs font-bold uppercase tracking-wide text-rose-600 mb-3 px-1">
                {language === 'fr' ? '🎯 Idées reçues — vrai ou faux ?' : '🎯 Common beliefs — true or false?'}
              </p>
              <div className="space-y-2">
                {vfItems.map(item => <VraiFauxItem key={item.id} item={item} language={language} />)}
              </div>
            </section>
          )}

          {/* Testez-vous */}
          {content.quiz?.length > 0 && maxLevel >= 2 && (
            <section className="mb-4">
              <p className="text-xs font-bold uppercase tracking-wide text-emerald-600 mb-3 px-1">
                {language === 'fr' ? '✏️ Testez-vous' : '✏️ Test yourself'}
              </p>
              <div className="space-y-2">
                {content.quiz.map((q, i) => <QuizItem key={i} q={q} index={i} language={language} />)}
              </div>
            </section>
          )}

          {/* Figures et partis liés */}
          {(content.figuresLiees?.length > 0 || content.partisLies?.length > 0) && maxLevel >= 2 && (
            <section className="bg-white border border-gray-200 rounded-2xl p-5 mb-4">
              {content.figuresLiees?.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">
                    {language === 'fr' ? 'Les figures' : 'Key figures'}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {content.figuresLiees.map((f, i) => (
                      <div key={i} className="flex items-center gap-2.5 bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl">
                        <span className="shrink-0 w-8 h-8 rounded-full bg-gray-900 text-white text-[11px] font-bold flex items-center justify-center">
                          {f.nom.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()}
                        </span>
                        <span className="min-w-0">
                          <span className="block text-sm text-gray-800 font-semibold truncate">{f.nom}</span>
                          <span className="block text-[11px] text-gray-400 truncate">{L(f.note, language)}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {content.partisLies?.length > 0 && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">
                    {language === 'fr' ? 'Les partis' : 'Related parties'}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {content.partisLies.map((p, i) => (
                      <span key={i} className="inline-flex flex-col bg-gray-50 border border-dashed border-gray-300 px-3 py-1.5 rounded-xl">
                        <span className="text-sm text-gray-700 font-medium">{p.nom}</span>
                        <span className="text-[10px] text-gray-400">{L(p.note, language)}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}

          {/* Mots associés */}
          {content.motsAssocies?.length > 0 && (
            <section className="mb-4 px-1">
              <p className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">
                {language === 'fr' ? 'Les mots associés' : 'Related terms'}
              </p>
              <div className="flex flex-wrap gap-2">
                {content.motsAssocies.map((m, i) => <LinkChip key={i} slugOrObj={m} language={language} />)}
              </div>
            </section>
          )}

          {/* Continuer avec */}
          {content.continuerAvec?.length > 0 && (
            <section className="mb-6 px-1">
              <p className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">
                {language === 'fr' ? 'Continuer avec' : 'Continue with'}
              </p>
              <div className="flex flex-wrap gap-2">
                {content.continuerAvec.map((c, i) => <LinkChip key={i} slugOrObj={c} language={language} />)}
              </div>
            </section>
          )}

          {/* Sources */}
          {content.sources?.length > 0 && (
            <section className="border-t border-gray-200 pt-4 pb-2">
              <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-2">Sources</p>
              <ul className="space-y-1">
                {content.sources.map((s, i) => (
                  <li key={i} className="text-xs text-gray-400 leading-relaxed">
                    {s.url
                      ? <a href={s.url} target="_blank" rel="noopener noreferrer" className="hover:text-gray-600 hover:underline">{s.label}</a>
                      : s.label}
                    {s.perimetre && <span className="italic"> — {s.perimetre}</span>}
                  </li>
                ))}
              </ul>
              <p className="text-[11px] text-gray-300 mt-3">
                {language === 'fr'
                  ? `Dernière modification : ${formatDate(content.updatedAt, language)} · Dernière vérification factuelle : ${formatDate(content.freshness?.lastReviewedAt, language)}`
                  : `Last modified: ${formatDate(content.updatedAt, language)} · Last fact-checked: ${formatDate(content.freshness?.lastReviewedAt, language)}`}
              </p>
            </section>
          )}
        </>
      )}
    </div>
  );
}
