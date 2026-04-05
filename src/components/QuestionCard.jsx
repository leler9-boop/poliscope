import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { THEME_LABELS, THEME_COLORS } from '../data/questions.js';

const LIKERT_LABELS = {
  en: ['Strongly disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly agree'],
  fr: ['Pas du tout d\'accord', 'Pas d\'accord', 'Neutre', 'D\'accord', 'Tout à fait d\'accord'],
};

const REPORT_OPTIONS = {
  en: ['Not clear', 'Not relevant', 'Biased'],
  fr: ['Pas claire', 'Pas pertinente', 'Biaisée'],
};

export default function QuestionCard({ question, currentAnswer, onAnswer, language = 'en' }) {
  const [showInfo,    setShowInfo]    = useState(false);
  const [reportOpen,  setReportOpen]  = useState(false);
  const [reportChoice, setReportChoice] = useState(null);
  const [reportText,  setReportText]  = useState('');
  const [reportSent,  setReportSent]  = useState(false);

  const labels = LIKERT_LABELS[language] ?? LIKERT_LABELS.en;
  const reportOptions = REPORT_OPTIONS[language] ?? REPORT_OPTIONS.en;
  const themeLabel = THEME_LABELS[language]?.[question.theme] ?? question.theme;
  const themeColor = THEME_COLORS[question.theme] ?? '#6b7280';
  const hasInfo = Boolean(question.info?.fr || question.info?.en || (typeof question.info === 'string' && question.info));

  const handleReportSubmit = () => {
    // UI only — no data sent
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
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8 max-w-2xl mx-auto w-full">

        {/* Theme badge */}
        <div className="flex items-center gap-2 mb-5">
          <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: themeColor }} />
          <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
            {language === 'fr' ? 'Thème : ' : 'Theme: '}{themeLabel}
          </span>
        </div>

        {/* Question text + info button */}
        <div className="flex items-start gap-3 mb-8">
          <p className="text-lg sm:text-xl font-medium text-gray-900 leading-relaxed flex-1">
            {typeof question.text === 'string' ? question.text : (question.text[language] ?? question.text.fr ?? question.text.en)}
          </p>

          {/* Info button — only shown when info exists */}
          {hasInfo && (
            <div className="relative flex-shrink-0">
              <motion.button
                key={question.id}
                onClick={() => setShowInfo(!showInfo)}
                className="relative w-7 h-7 rounded-full border flex items-center justify-center text-sm font-bold transition-colors"
                style={{
                  borderColor: showInfo ? '#93c5fd' : '#d1d5db',
                  color: showInfo ? '#2563eb' : '#9ca3af',
                  backgroundColor: showInfo ? '#eff6ff' : 'transparent',
                }}
                title={language === 'fr' ? 'En savoir plus' : 'Learn more'}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: showInfo ? 1 : 0.7, scale: 1 }}
                transition={{ duration: 0.35, delay: 0.4, ease: 'easeOut' }}
                whileHover={{ scale: 1.18, opacity: 1, transition: { duration: 0.15 } }}
                whileTap={{ scale: 0.92 }}
              >
                i
                <motion.span
                  key={`pulse-${question.id}`}
                  className="absolute inset-0 rounded-full border border-blue-400 pointer-events-none"
                  initial={{ scale: 1, opacity: 0.5 }}
                  animate={{ scale: 1.7, opacity: 0 }}
                  transition={{ duration: 0.65, delay: 0.75, ease: 'easeOut' }}
                />
              </motion.button>
            </div>
          )}
        </div>

        {/* Info tooltip */}
        <AnimatePresence>
          {showInfo && (
            <motion.div
              className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-lg text-sm text-gray-700 leading-relaxed"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <div className="flex items-start gap-2">
                <svg className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                </svg>
                <p>{typeof question.info === 'string' ? question.info : (question.info?.[language] ?? question.info?.fr ?? question.info?.en)}</p>
              </div>
              <button
                onClick={() => setShowInfo(false)}
                className="mt-2 text-xs text-blue-500 hover:text-blue-700 font-medium transition-colors"
              >
                {language === 'fr' ? 'Fermer' : 'Close'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Likert scale */}
        <div className="space-y-3">
          <div className="hidden sm:flex justify-between text-xs text-gray-400 px-1 mb-1">
            <span>{labels[0]}</span>
            <span>{labels[4]}</span>
          </div>

          <div className="flex gap-2 sm:gap-3">
            {[1, 2, 3, 4, 5].map((val) => {
              const isSelected = currentAnswer === val;
              const label = labels[val - 1];
              return (
                <motion.button
                  key={val}
                  onClick={() => onAnswer(val)}
                  title={label}
                  className={`flex-1 relative flex flex-col items-center gap-2 py-3 rounded-lg border-2 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 ${
                    isSelected
                      ? 'border-blue-600 bg-blue-600 text-white shadow-md'
                      : 'border-gray-200 bg-white text-gray-500 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.1 }}
                >
                  <div className={`w-3 h-3 rounded-full border-2 transition-colors ${
                    isSelected ? 'border-white bg-white' : 'border-gray-300 group-hover:border-blue-400'
                  }`} />
                  <span className="text-xs font-medium sm:hidden leading-tight text-center px-0.5">{label}</span>
                </motion.button>
              );
            })}
          </div>

          <div className="hidden sm:grid grid-cols-5 gap-2 px-0">
            {labels.map((label, i) => (
              <p key={i} className="text-xs text-center text-gray-400 leading-tight">{label}</p>
            ))}
          </div>
        </div>

        {/* Report link */}
        <div className="mt-5 pt-4 border-t border-gray-100 flex justify-end">
          <button
            onClick={() => setReportOpen(true)}
            className="text-xs text-gray-300 hover:text-gray-500 transition-colors"
          >
            {language === 'fr' ? 'Signaler un problème' : 'Report an issue'}
          </button>
        </div>
      </div>

      {/* Report modal */}
      <AnimatePresence>
        {reportOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeReport}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm"
              initial={{ scale: 0.92, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.34, 1.1, 0.64, 1] }}
              onClick={e => e.stopPropagation()}
            >
              {reportSent ? (
                <motion.div
                  className="text-center py-4"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="text-3xl mb-3">✓</div>
                  <p className="font-semibold text-gray-900 mb-1">
                    {language === 'fr' ? 'Merci pour votre retour !' : 'Thanks for your feedback!'}
                  </p>
                  <p className="text-sm text-gray-400">
                    {language === 'fr' ? 'Votre signalement a été pris en compte.' : 'Your report has been noted.'}
                  </p>
                </motion.div>
              ) : (
                <>
                  <h3 className="font-bold text-gray-900 mb-1">
                    {language === 'fr' ? 'Signaler un problème' : 'Report an issue'}
                  </h3>
                  <p className="text-xs text-gray-400 mb-5">
                    {language === 'fr' ? 'Quel est le problème avec cette question ?' : 'What\'s the issue with this question?'}
                  </p>

                  {/* Options */}
                  <div className="space-y-2 mb-4">
                    {reportOptions.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => setReportChoice(i)}
                        className={`w-full text-left px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                          reportChoice === i
                            ? 'border-gray-900 bg-gray-900 text-white'
                            : 'border-gray-200 text-gray-700 hover:border-gray-400'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>

                  {/* Optional text */}
                  <textarea
                    value={reportText}
                    onChange={e => setReportText(e.target.value)}
                    placeholder={language === 'fr' ? 'Détails (optionnel)…' : 'Details (optional)…'}
                    rows={2}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 resize-none focus:outline-none focus:border-gray-400 mb-4 placeholder:text-gray-300"
                  />

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={handleReportSubmit}
                      disabled={reportChoice === null}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                        reportChoice !== null
                          ? 'bg-gray-900 hover:bg-black text-white'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {language === 'fr' ? 'Envoyer' : 'Send'}
                    </button>
                    <button
                      onClick={closeReport}
                      className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-500 border border-gray-200 hover:bg-gray-50 transition-colors"
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
