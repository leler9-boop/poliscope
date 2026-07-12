import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { findBySlug } from '../../content/learn/manifest.js';
import { VERDICT_LABELS } from '../../content/learn/vraifaux/bank.js';
import { L, VERDICT_STYLE } from './helpers.js';
import { SectionBody, SourceLine } from './Briques.jsx';

/** Modules interactifs des fiches : progression, navigation de niveaux, accordéons,
 *  chronologie, tableau comparatif, vrai/faux, quiz, chips de liens. */

/* ── barre de progression de lecture ─────────────────────────────────────── */

export function ReadingProgress() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setPct(h > 0 ? Math.min(100, (window.scrollY / h) * 100) : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <div className="fixed top-0 left-0 right-0 z-40 h-0.5 bg-transparent pointer-events-none">
      <div className="h-full bg-gray-900 transition-[width] duration-150" style={{ width: `${pct}%` }} />
    </div>
  );
}

/* ── navigation sticky entre niveaux ─────────────────────────────────────── */

const LEVEL_LABELS = {
  1: { fr: '20 secondes', en: '20 seconds' },
  2: { fr: '3 minutes', en: '3 minutes' },
  3: { fr: 'Tout comprendre', en: 'Full picture' },
  4: { fr: 'Aller plus loin', en: 'Go further' },
};

export function LevelNav({ hasLevels, maxLevel, language, onJump }) {
  return (
    <div className="sticky top-0 z-30 -mx-4 sm:mx-0 px-4 sm:px-0 py-2 bg-[#f7f7f5]/90 backdrop-blur border-b border-gray-200/60 mb-5">
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
        {hasLevels.filter(l => l <= 3 || hasLevels.includes(4)).map(l => {
          const active = l <= maxLevel;
          return (
            <button
              key={l}
              onClick={() => onJump(l)}
              className={`shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
                active
                  ? 'bg-gray-900 border-gray-900 text-white'
                  : 'bg-white border-gray-200 text-gray-500 hover:border-gray-400'
              }`}
            >
              {l === 1 ? '⏱' : l === 2 ? '📖' : l === 3 ? '🔍' : '📚'} {L(LEVEL_LABELS[l], language)}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ── accordéon N3 ────────────────────────────────────────────────────────── */

export function Accordion({ section, language, isOpen, onToggle, anchorRef }) {
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

/* ── chronologie interactive ─────────────────────────────────────────────── */

export function Chronologie({ chrono, language }) {
  const [open, setOpen] = useState(null);
  return (
    <section className="bg-white border border-gray-200 rounded-2xl p-5 mb-4">
      <p className="text-xs font-bold uppercase tracking-wide text-indigo-600 mb-1">
        {language === 'fr' ? '📜 Chronologie' : '📜 Timeline'}
      </p>
      <h3 className="text-sm font-bold text-gray-900 mb-4">{L(chrono.titre, language)}</h3>
      <div className="relative pl-5 border-l-2 border-gray-200 space-y-1">
        {chrono.events.map((ev, i) => {
          const isOpen = open === i;
          return (
            <div key={i} className="relative">
              <span className={`absolute -left-[27px] top-2 w-3 h-3 rounded-full border-2 ${isOpen ? 'bg-gray-900 border-gray-900' : 'bg-white border-gray-300'}`} />
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                className="w-full text-left rounded-lg px-2 py-1.5 hover:bg-gray-50 transition-colors"
              >
                <span className="text-xs font-bold text-gray-400 tabular-nums mr-2">{ev.date}</span>
                <span className="text-sm font-semibold text-gray-800">{L(ev.titre, language)}</span>
              </button>
              {isOpen && (
                <div className="px-2 pb-2">
                  <p className="text-sm text-gray-600 leading-relaxed">{L(ev.detail, language)}</p>
                  {ev.source && <SourceLine sources={[ev.source]} language={language} />}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ── tableau comparatif ──────────────────────────────────────────────────── */

export function TableauComparatif({ tableau, language }) {
  return (
    <section className="bg-white border border-gray-200 rounded-2xl p-5 mb-4">
      <p className="text-xs font-bold uppercase tracking-wide text-teal-600 mb-1">
        {language === 'fr' ? '⚖️ Comparaison' : '⚖️ Comparison'}
      </p>
      <h3 className="text-sm font-bold text-gray-900 mb-3">{L(tableau.titre, language)}</h3>
      <div className="overflow-x-auto -mx-5 px-5">
        <table className="w-full text-sm border-separate border-spacing-0 min-w-[560px]">
          <thead>
            <tr>
              <th className="text-left text-xs font-semibold text-gray-400 pb-2 pr-3 w-28"></th>
              {tableau.colonnes.map((c, i) => (
                <th key={i} className="text-left text-xs font-bold text-gray-800 pb-2 pr-3">{L(c, language)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableau.lignes.map((row, ri) => (
              <tr key={ri}>
                <td className="text-xs font-semibold text-gray-500 py-2 pr-3 border-t border-gray-100 align-top">{L(row.label, language)}</td>
                {row.cells.map((cell, ci) => (
                  <td key={ci} className="text-[13px] text-gray-700 leading-snug py-2 pr-3 border-t border-gray-100 align-top">{L(cell, language)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {tableau.note && <p className="text-[11px] text-gray-400 italic mt-3">{L(tableau.note, language)}</p>}
      <SourceLine sources={tableau.sources} language={language} />
    </section>
  );
}

/* ── vrai / faux ─────────────────────────────────────────────────────────── */

export function VraiFauxItem({ item, language }) {
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
          <SourceLine sources={item.sources} language={language} />
        </div>
      )}
    </div>
  );
}

/* ── quiz ────────────────────────────────────────────────────────────────── */

export function QuizItem({ q, index, language }) {
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

export function LinkChip({ slugOrObj, language }) {
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
