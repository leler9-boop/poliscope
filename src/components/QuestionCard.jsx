import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { THEME_LABELS, THEME_COLORS } from '../data/questions.js';
import { CONCEPTS } from '../data/conceptMap.js';

const LIKERT_LABELS = {
  en: ['Strongly disagree', 'Disagree', 'In between', 'Agree', 'Strongly agree'],
  fr: ['Pas du tout d\'accord', 'Pas d\'accord', 'Entre les deux', 'D\'accord', 'Tout à fait d\'accord'],
};

const REPORT_OPTIONS = {
  en: ['Not clear', 'Not relevant', 'Biased'],
  fr: ['Pas claire', 'Pas pertinente', 'Biaisée'],
};

/* Valeur 1–5 → label court pour mobile */
const SHORT_LABELS = {
  en: ['No ++', 'No', 'Between', 'Yes', 'Yes ++'],
  fr: ['Non ++', 'Non', 'Entre 2', 'Oui', 'Oui ++'],
};

export default function QuestionCard({ question, currentAnswer, onAnswer, onSkip, language = 'en', concepts = [], onConceptClick }) {
  const [showInfo,     setShowInfo]     = useState(false);
  const [reportOpen,   setReportOpen]   = useState(false);
  const [reportChoice, setReportChoice] = useState(null);
  const [reportText,   setReportText]   = useState('');
  const [reportSent,   setReportSent]   = useState(false);

  const labels      = LIKERT_LABELS[language]  ?? LIKERT_LABELS.en;
  const shortLabels = SHORT_LABELS[language]    ?? SHORT_LABELS.en;
  const reportOptions = REPORT_OPTIONS[language] ?? REPORT_OPTIONS.en;
  const themeLabel  = THEME_LABELS[language]?.[question.theme] ?? question.theme;
  const themeColor  = THEME_COLORS[question.theme] ?? '#64748B';
  const hasInfo     = Boolean(question.info?.fr || question.info?.en || (typeof question.info === 'string' && question.info));
  const questionText = typeof question.text === 'string'
    ? question.text
    : (question.text[language] ?? question.text.fr ?? question.text.en);

  const handleReportSubmit = () => {
    setReportSent(true);
    setTimeout(() => {
      setReportOpen(false);
      setReportChoice(null);
      setReportText('');
      setReportSent(false);
    }, 1800);
  };

  const closeReport = () => {
    setReportOpen(false);
    setReportChoice(null);
    setReportText('');
    setReportSent(false);
  };

  return (
    <>
      {/* ═══ CARD ═══ */}
      <div
        className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 max-w-2xl mx-auto w-full"
        style={{ boxShadow: '0 1px 3px 0 rgba(15,23,42,0.06), 0 1px 2px -1px rgba(15,23,42,0.04)' }}
      >

        {/* ── Thème badge ── */}
        <div className="flex items-center mb-6">
          <span
            className="inline-block w-2 h-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: themeColor }}
          />
          <span className="ml-2 text-xs font-semibold uppercase tracking-widest text-slate-400">
            {themeLabel}
          </span>
        </div>

        {/* ── Question ── */}
        <p className="text-[1.1rem] sm:text-xl font-medium text-slate-900 leading-relaxed mb-4 tracking-tight">
          {questionText}
        </p>

        {/* ── Contexte trigger — below question so user sees it after reading ── */}
        {hasInfo && (
          <motion.button
            key={`info-${question.id}`}
            onClick={() => setShowInfo(!showInfo)}
            className="flex items-center gap-1.5 mb-5 text-xs font-medium transition-colors"
            style={{ color: showInfo ? '#2563EB' : '#94A3B8' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.25 }}
            whileTap={{ scale: 0.97 }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" style={{ flexShrink: 0 }}>
              <path d="M6 0a6 6 0 100 12A6 6 0 006 0zm.75 9H5.25V5.25h1.5V9zM6 4.5a.75.75 0 110-1.5.75.75 0 010 1.5z"/>
            </svg>
            <span className="underline underline-offset-2 decoration-dotted">
              {showInfo
                ? (language === 'fr' ? 'Masquer le contexte' : 'Hide context')
                : (language === 'fr' ? 'Comprendre cet enjeu' : 'Understand this issue')}
            </span>
          </motion.button>
        )}

        {/* ── Info panel ── */}
        <AnimatePresence>
          {showInfo && (
            <motion.div
              className="mb-6 px-4 py-3.5 bg-blue-50 border border-blue-100 rounded-xl text-sm text-slate-600 leading-relaxed"
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {typeof question.info === 'string'
                ? question.info
                : (question.info?.[language] ?? question.info?.fr ?? question.info?.en)}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Concept resources ─────────────────────────────────────────────────
            V4: "Pour aller plus loin" resource entries instead of badge-pills.
            Each entry looks like a clickable article card, not a hashtag.
            The chevron → communicates "there's a full explanation inside."
        ──────────────────────────────────────────────────────────────────── */}
        {concepts.length > 0 && onConceptClick && (
          <div className="mb-5">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-2.5 flex items-center gap-1.5">
              <span>📚</span>
              <span>{language === 'fr' ? 'Pour aller plus loin' : 'Go deeper'}</span>
            </p>
            <div className="space-y-1.5">
              {concepts.map((key) => {
                const concept = CONCEPTS[key];
                if (!concept) return null;
                const label = concept.label?.[language] ?? concept.label?.fr ?? key;
                return (
                  <button
                    key={key}
                    onClick={() => onConceptClick(key)}
                    className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-blue-50 hover:border-blue-200 text-left transition-all group min-h-[44px]"
                  >
                    <span className="text-base flex-shrink-0 leading-none">{concept.icon}</span>
                    <span className="flex-1 text-sm font-medium text-slate-700 group-hover:text-blue-700 leading-snug">
                      {label}
                    </span>
                    <svg className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-500 flex-shrink-0" viewBox="0 0 16 16" fill="none">
                      <path d="M6 12l4-4-4-4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Likert scale ── */}
        <div>
          {/* Labels extrêmes desktop */}
          <div className="hidden sm:flex justify-between text-xs text-slate-400 mb-2.5 px-0.5">
            <span>{labels[0]}</span>
            <span>{labels[4]}</span>
          </div>

          {/* Boutons */}
          <div className="flex gap-2 sm:gap-2.5">
            {[1, 2, 3, 4, 5].map((val) => {
              const isSelected = currentAnswer === val;
              return (
                <motion.button
                  key={val}
                  onClick={() => onAnswer(val)}
                  title={labels[val - 1]}
                  className={[
                    'flex-1 relative flex flex-col items-center justify-center gap-1.5',
                    'h-14 sm:h-16 rounded-xl border-2 transition-all duration-150',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1',
                    'cursor-pointer select-none',
                    isSelected
                      ? 'border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-200'
                      : 'border-slate-200 bg-white text-slate-400 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-600',
                  ].join(' ')}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.08 }}
                >
                  {/* Numéro */}
                  <span className={`text-base font-bold leading-none ${isSelected ? 'text-white' : 'text-slate-500'}`}>
                    {val}
                  </span>
                  {/* Label court mobile */}
                  <span className={`text-[10px] font-medium leading-none sm:hidden ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                    {shortLabels[val - 1]}
                  </span>
                </motion.button>
              );
            })}
          </div>

          {/* Labels complets desktop */}
          <div className="hidden sm:grid grid-cols-5 gap-2 mt-2.5">
            {labels.map((label, i) => (
              <p key={i} className="text-[11px] text-center text-slate-400 leading-tight px-0.5">{label}</p>
            ))}
          </div>

          {onSkip && (
            <button
              type="button"
              onClick={onSkip}
              className="mt-5 w-full min-h-[52px] px-4 rounded-xl border-2 border-slate-200 bg-slate-50 text-slate-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 font-semibold text-sm transition-colors flex items-center justify-center gap-2"
            >
              <span aria-hidden="true">?</span>
              <span>
                {language === 'fr'
                  ? 'Je ne sais pas · Passer cette question'
                  : "I don't know · Skip this question"}
              </span>
            </button>
          )}
          {onSkip && (
            <p className="mt-2 text-[11px] text-center text-slate-400 leading-relaxed">
              {language === 'fr'
                ? 'Cette question ne comptera pas dans votre profil.'
                : 'This question will not count toward your profile.'}
            </p>
          )}
        </div>

        {/* ── Report ── */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={() => setReportOpen(true)}
            className="text-[11px] text-slate-300 hover:text-slate-500 transition-colors py-2.5 px-1 min-h-[44px] flex items-center"
          >
            {language === 'fr' ? 'Signaler un problème' : 'Report an issue'}
          </button>
        </div>
      </div>

      {/* ═══ MODAL REPORT ═══ */}
      <AnimatePresence>
        {reportOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(6px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={closeReport}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm"
              style={{ boxShadow: '0 24px 48px -12px rgba(15,23,42,0.18)' }}
              initial={{ scale: 0.94, opacity: 0, y: 12 }}
              animate={{ scale: 1,    opacity: 1, y: 0 }}
              exit={{   scale: 0.96,  opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.34, 1.06, 0.64, 1] }}
              onClick={e => e.stopPropagation()}
            >
              {reportSent ? (
                <motion.div
                  className="text-center py-4"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="w-10 h-10 bg-green-50 border border-green-200 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                    </svg>
                  </div>
                  <p className="font-semibold text-slate-900 mb-1">
                    {language === 'fr' ? 'Merci !' : 'Thanks!'}
                  </p>
                  <p className="text-sm text-slate-400">
                    {language === 'fr' ? 'Votre signalement a été pris en compte.' : 'Your report has been noted.'}
                  </p>
                </motion.div>
              ) : (
                <>
                  <h3 className="font-bold text-slate-900 mb-1">
                    {language === 'fr' ? 'Signaler un problème' : 'Report an issue'}
                  </h3>
                  <p className="text-xs text-slate-400 mb-5">
                    {language === 'fr' ? 'Quel problème avec cette question ?' : 'What\'s wrong with this question?'}
                  </p>
                  <div className="space-y-2 mb-4">
                    {reportOptions.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => setReportChoice(i)}
                        className={`w-full text-left px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                          reportChoice === i
                            ? 'border-slate-900 bg-slate-900 text-white'
                            : 'border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                  <textarea
                    value={reportText}
                    onChange={e => setReportText(e.target.value)}
                    placeholder={language === 'fr' ? 'Détails (optionnel)…' : 'Details (optional)…'}
                    rows={2}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 resize-none focus:outline-none focus:border-slate-400 mb-4 placeholder:text-slate-300 transition-colors"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleReportSubmit}
                      disabled={reportChoice === null}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                        reportChoice !== null
                          ? 'bg-slate-900 hover:bg-black text-white'
                          : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      {language === 'fr' ? 'Envoyer' : 'Send'}
                    </button>
                    <button
                      onClick={closeReport}
                      className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-500 border border-slate-200 hover:bg-slate-50 transition-colors"
                    >
                      {language === 'fr' ? 'Annuler' : 'Cancel'}
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
