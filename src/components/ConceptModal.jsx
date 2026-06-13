import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CONCEPTS } from '../data/conceptMap.js';

/**
 * ConceptModal — inline educational overlay shown when a user clicks a concept pill.
 *
 * Props:
 *   conceptKey   string         — key into CONCEPTS
 *   language     'fr' | 'en'
 *   onClose      () => void
 *   onGoToArticle (articleKey) => void  — navigate to J'y connais rien (optional)
 */
export default function ConceptModal({ conceptKey, language, onClose, onGoToArticle }) {
  const [level, setLevel] = useState(1);
  const lang = language === 'fr' ? 'fr' : 'en';

  const concept = CONCEPTS[conceptKey];
  if (!concept) return null;

  const t = (obj) => obj?.[lang] ?? obj?.fr ?? '';

  const handleGoToArticle = () => {
    onClose();
    if (onGoToArticle) onGoToArticle(concept.articleKey);
  };

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(15,23,42,0.55)', backdropFilter: 'blur(6px)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-y-auto"
        style={{ boxShadow: '0 24px 60px -12px rgba(15,23,42,0.22)' }}
        initial={{ scale: 0.96, opacity: 0, y: 20 }}
        animate={{ scale: 1,    opacity: 1, y: 0 }}
        exit={{   scale: 0.97,  opacity: 0, y: 8 }}
        transition={{ duration: 0.22, ease: [0.34, 1.06, 0.64, 1] }}
        onClick={(e) => e.stopPropagation()}
      >

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl leading-none">{concept.icon}</span>
            <div>
              <p className="font-bold text-slate-900 text-[15px] leading-tight">
                {t(concept.label)}
              </p>
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest mt-0.5">
                {lang === 'fr' ? 'Explication' : 'Explanation'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors text-base font-medium leading-none"
            aria-label="Fermer"
          >
            ✕
          </button>
        </div>

        {/* ── Level tabs ── */}
        <div className="flex gap-1.5 px-5 pt-4 pb-1">
          {[
            { n: 1, label: lang === 'fr' ? '⚡ En bref' : '⚡ Quick' },
            { n: 2, label: lang === 'fr' ? '📖 Plus de détails' : '📖 More detail' },
          ].map(({ n, label }) => (
            <button
              key={n}
              onClick={() => setLevel(n)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${
                level === n
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ── Content ── */}
        <div className="px-5 py-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={level}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -2 }}
              transition={{ duration: 0.16 }}
            >
              <p className="text-sm text-slate-700 leading-[1.7]">
                {level === 1 ? t(concept.level1) : t(concept.level2)}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* ── Link to Beginner page ── */}
          {concept.articleKey && onGoToArticle && (
            <button
              onClick={handleGoToArticle}
              className="mt-5 w-full flex items-center justify-between px-4 py-3 rounded-xl bg-amber-50 border border-amber-100 hover:bg-amber-100 transition-colors group"
            >
              <div className="flex items-center gap-2">
                <span className="text-base">📚</span>
                <span className="text-sm font-semibold text-amber-800">
                  {lang === 'fr' ? 'Article complet dans J\'y connais rien' : 'Full article in Beginner guide'}
                </span>
              </div>
              <span className="text-amber-600 group-hover:translate-x-0.5 transition-transform">→</span>
            </button>
          )}

          {/* ── Dismiss ── */}
          <button
            onClick={onClose}
            className="mt-3 w-full text-xs text-slate-400 hover:text-slate-600 py-2 transition-colors"
          >
            {lang === 'fr' ? '← Revenir à la question' : '← Back to question'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
