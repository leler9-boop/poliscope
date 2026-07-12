import React, { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { useStore } from '../store/useStore.js';
import { findEntry, findBySlug, SECTIONS } from '../content/learn/manifest.js';
import { getVraiFaux, VERDICT_LABELS } from '../content/learn/vraifaux/bank.js';

/* ── helpers ─────────────────────────────────────────────────────────────── */

// Contenu FR d'abord : renvoie la langue demandée, sinon le français.
const L = (field, language) => field?.[language] ?? field?.fr ?? '';

const DIFFICULTY = {
  1: { fr: 'Découverte', en: 'Beginner', cls: 'bg-emerald-50 border-emerald-200 text-emerald-700' },
  2: { fr: 'Intermédiaire', en: 'Intermediate', cls: 'bg-blue-50 border-blue-200 text-blue-700' },
  3: { fr: 'Avancé', en: 'Advanced', cls: 'bg-purple-50 border-purple-200 text-purple-700' },
};

const VERDICT_STYLE = {
  vrai: 'bg-emerald-50 border-emerald-200 text-emerald-700',
  faux: 'bg-rose-50 border-rose-200 text-rose-700',
  partiel: 'bg-amber-50 border-amber-200 text-amber-700',
  trompeur: 'bg-orange-50 border-orange-200 text-orange-700',
  'sans-contexte': 'bg-gray-100 border-gray-200 text-gray-600',
};

const VISION_STYLE = {
  blue:   'bg-blue-50 border-blue-200 text-blue-800',
  purple: 'bg-purple-50 border-purple-200 text-purple-800',
  green:  'bg-emerald-50 border-emerald-200 text-emerald-800',
};

function formatDate(iso, language) {
  if (!iso) return '';
  try {
    return new Date(iso + 'T00:00:00').toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch { return iso; }
}

function Paragraphs({ text }) {
  return text.split('\n\n').map((p, i) => (
    <p key={i} className="text-sm text-gray-600 leading-relaxed mb-3 last:mb-0">{p}</p>
  ));
}

/* ── briques ─────────────────────────────────────────────────────────────── */

function BriqueGlossaire({ termes, language }) {
  return (
    <div className="space-y-3">
      {termes.map((t, i) => (
        <div key={i} className="bg-gray-50 rounded-xl px-4 py-3">
          <p className="text-sm font-semibold text-gray-800 mb-1">{L(t.nom, language)}</p>
          <p className="text-sm text-gray-600 leading-relaxed">{L(t.def, language)}</p>
        </div>
      ))}
    </div>
  );
}

function BriqueComparaison({ rows, language }) {
  return (
    <div className="space-y-2">
      {rows.map((r, i) => (
        <div key={i} className="flex gap-3 bg-gray-50 rounded-xl px-4 py-3">
          <div className="shrink-0 w-24">
            <p className="text-sm font-semibold text-gray-800">{L(r.pays, language)}</p>
            <p className="text-xs font-bold text-gray-500 mt-0.5">{r.valeur}</p>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">{L(r.desc, language)}</p>
        </div>
      ))}
    </div>
  );
}

function BriqueVisions({ visions, language }) {
  return (
    <div className="space-y-3">
      {visions.map((v, i) => {
        const cls = VISION_STYLE[v.couleur] || VISION_STYLE.blue;
        return (
          <div key={i} className={`border rounded-xl px-4 py-3 ${cls}`}>
            <p className="text-xs font-bold uppercase tracking-wide mb-1.5">{L(v.label, language)}</p>
            <p className="text-sm leading-relaxed">{L(v.corps, language)}</p>
          </div>
        );
      })}
    </div>
  );
}

function SectionBody({ section, language }) {
  if (section.brique === 'glossaire' && section.termes) return <BriqueGlossaire termes={section.termes} language={language} />;
  if (section.brique === 'comparaison' && section.rows) return <BriqueComparaison rows={section.rows} language={language} />;
  if (section.brique === 'visions' && section.visions) return <BriqueVisions visions={section.visions} language={language} />;
  if (section.brique === 'confusion') {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
        <p className="text-xs font-bold uppercase tracking-wide text-amber-700 mb-1.5">
          {language === 'fr' ? '⚠️ Attention à la confusion' : '⚠️ Common confusion'}
        </p>
        <Paragraphs text={L(section.corps, language)} />
      </div>
    );
  }
  return <Paragraphs text={L(section.corps, language)} />;
}

/* ── accordéon N3 ────────────────────────────────────────────────────────── */

function Accordion({ section, language, isOpen, onToggle, anchorRef }) {
  return (
    <div ref={anchorRef} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="text-sm font-semibold text-gray-800">{L(section.titre, language)}</span>
        <span className={`text-gray-400 text-xs transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </button>
      {isOpen && (
        <div className="px-4 pb-4 pt-1 border-t border-gray-100">
          <SectionBody section={section} language={language} />
        </div>
      )}
    </div>
  );
}

/* ── vrai/faux ───────────────────────────────────────────────────────────── */

function VraiFauxItem({ item, language }) {
  const [revealed, setRevealed] = useState(false);
  return (
    <div className="bg-white border border-gray-200 rounded-xl px-4 py-3">
      <p className="text-sm font-medium text-gray-800 mb-2">« {L(item.enonce, language)} »</p>
      {!revealed ? (
        <button
          onClick={() => setRevealed(true)}
          className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
        >
          {language === 'fr' ? 'Voir la réponse →' : 'Reveal answer →'}
        </button>
      ) : (
        <div>
          <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full border mb-2 ${VERDICT_STYLE[item.verdict]}`}>
            {L(VERDICT_LABELS[item.verdict], language)}
          </span>
          <p className="text-sm text-gray-600 leading-relaxed">{L(item.explication, language)}</p>
          {item.sources?.length > 0 && (
            <p className="text-xs text-gray-400 mt-2">
              {language === 'fr' ? 'Source : ' : 'Source: '}
              {item.sources.map(s => s.label).join(' · ')}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

/* ── quiz ────────────────────────────────────────────────────────────────── */

function QuizItem({ q, index, language }) {
  const [picked, setPicked] = useState(null);
  return (
    <div className="bg-white border border-gray-200 rounded-xl px-4 py-3">
      <p className="text-sm font-medium text-gray-800 mb-3">
        <span className="text-gray-400 font-bold mr-1.5">{index + 1}.</span>
        {L(q.question, language)}
      </p>
      <div className="space-y-1.5">
        {q.options.map((opt, i) => {
          let cls = 'border-gray-200 hover:border-gray-300 text-gray-700';
          if (picked !== null) {
            if (i === q.bonneReponse) cls = 'border-emerald-300 bg-emerald-50 text-emerald-800';
            else if (i === picked) cls = 'border-rose-300 bg-rose-50 text-rose-700';
            else cls = 'border-gray-100 text-gray-400';
          }
          return (
            <button
              key={i}
              disabled={picked !== null}
              onClick={() => setPicked(i)}
              className={`w-full text-left text-sm border rounded-lg px-3 py-2 transition-colors ${cls}`}
            >
              {L(opt, language)}
            </button>
          );
        })}
      </div>
      {picked !== null && (
        <p className="text-sm text-gray-600 leading-relaxed mt-3 bg-gray-50 rounded-lg px-3 py-2">
          {L(q.explication, language)}
        </p>
      )}
    </div>
  );
}

/* ── chips « mots associés » / « continuer avec » ────────────────────────── */

function LinkChip({ slugOrObj, language }) {
  const obj = typeof slugOrObj === 'string' ? { slug: slugOrObj } : slugOrObj;
  const entry = obj.slug ? findBySlug(obj.slug) : null;
  if (entry && !obj.soon) {
    return (
      <Link
        to={`/learn/${entry.section}/${entry.slug}`}
        className="inline-flex items-center gap-1.5 bg-white border border-gray-200 hover:border-gray-400 text-sm text-gray-700 px-3 py-1.5 rounded-full transition-colors"
      >
        <span>{entry.icon}</span>
        {L(entry.title, language)}
      </Link>
    );
  }
  const label = obj.label ? L(obj.label, language) : obj.slug;
  return (
    <span className="inline-flex items-center gap-1.5 bg-gray-50 border border-dashed border-gray-300 text-sm text-gray-400 px-3 py-1.5 rounded-full">
      {label}
      <span className="text-[10px] font-semibold uppercase tracking-wide">{language === 'fr' ? 'bientôt' : 'soon'}</span>
    </span>
  );
}

/* ── page ────────────────────────────────────────────────────────────────── */

export default function LearnPage() {
  const { section, slug } = useParams();
  const language = useStore(s => s.language);
  const setLastLearn = useStore(s => s.setLastLearn);

  const entry = findEntry(section, slug);
  const [content, setContent] = useState(null);
  const [maxLevel, setMaxLevel] = useState(1); // passage de niveau toujours explicite (bouton)
  const [openSections, setOpenSections] = useState({});
  const level2Ref = useRef(null);
  const level3Ref = useRef(null);
  const anchorRefs = useRef({});

  useEffect(() => {
    let alive = true;
    setContent(null);
    setMaxLevel(1);
    setOpenSections({});
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
          ← {language === 'fr' ? 'Comprendre la politique' : 'Understanding politics'}
        </Link>
      </div>
    );
  }

  const diff = DIFFICULTY[entry.difficulty] || DIFFICULTY[1];
  const frOnly = language !== 'fr' && !(entry.langs || []).includes(language);

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

  const vfItems = content ? getVraiFaux(content.vraiFaux) : [];

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-14">

      {/* Fil d'Ariane */}
      <motion.nav initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-gray-400 mb-6 flex flex-wrap items-center gap-1.5">
        <Link to="/learn" className="hover:text-gray-600 transition-colors">
          {language === 'fr' ? 'Comprendre la politique' : 'Understanding politics'}
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
          {/* N1 — En 20 secondes */}
          <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-gray-200 rounded-2xl p-5 mb-4">
            <p className="text-xs font-bold uppercase tracking-wide text-amber-600 mb-2">
              {language === 'fr' ? '⏱ En 20 secondes' : '⏱ In 20 seconds'}
            </p>
            <p className="text-[15px] text-gray-800 leading-relaxed">{L(content.level1, language)}</p>
          </motion.section>

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
            <section ref={level2Ref} className="bg-white border border-gray-200 rounded-2xl p-5 mb-4 scroll-mt-4">
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
            <section ref={level3Ref} className="mb-4 scroll-mt-4">
              <p className="text-xs font-bold uppercase tracking-wide text-purple-600 mb-3 px-1">
                {language === 'fr' ? '🔍 Tout comprendre' : '🔍 The full picture'}
              </p>

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
                      {item.kind === 'discours' ? '🎙' : item.kind === 'biblio' ? '📖' : '🔗'}
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
                  <div className="flex flex-wrap gap-2">
                    {content.figuresLiees.map((f, i) => (
                      <span key={i} className="inline-flex flex-col bg-gray-50 border border-dashed border-gray-300 px-3 py-1.5 rounded-xl">
                        <span className="text-sm text-gray-700 font-medium">{f.nom}</span>
                        <span className="text-[10px] text-gray-400">{L(f.note, language)}</span>
                      </span>
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
