import React, { useState, useRef, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useStore } from '../store/useStore.js';
import { createTranslator } from '../i18n/translations.js';
import { trackQuestionAnswered, trackQuestionSkipped } from '../lib/analytics.js';
import QuestionCard from '../components/QuestionCard.jsx';
import PreQuizModal from '../components/PreQuizModal.jsx';
import ConceptModal from '../components/ConceptModal.jsx';
import { questionHints } from '../data/questionHints.js';
import { QUESTION_CONCEPTS, THEME_INTROS } from '../data/conceptMap.js';
import { THEME_COLORS } from '../data/questions.js';

export default function Questionnaire() {
  const language             = useStore(s => s.language);
  const questionsQueue       = useStore(s => s.questionsQueue);
  const currentIndex         = useStore(s => s.currentQuestionIndex);
  const answers              = useStore(s => s.answers);
  const answerQuestion       = useStore(s => s.answerQuestion);
  const nextQuestion         = useStore(s => s.nextQuestion);
  const prevQuestion         = useStore(s => s.prevQuestion);
  const finishQuestionnaire  = useStore(s => s.finishQuestionnaire);
  const navigate             = useStore(s => s.navigate);
  const improveMode          = useStore(s => s.improveMode);
  const stopImproveMode      = useStore(s => s.stopImproveMode);
  const nextImproveQuestion  = useStore(s => s.nextImproveQuestion);
  const totalAnswered        = Object.keys(answers).length;
  const t = createTranslator(language);

  const [introSeen, setIntroSeen] = useState(() => {
    try { return sessionStorage.getItem('prequiz_seen') === '1'; } catch { return false; }
  });

  // ── Question slide direction (1 = forward, -1 = backward) ──
  const directionRef = useRef(1);

  // ── Auto-advance timer ──
  const autoAdvanceTimer = useRef(null);

  // ── Concept modal ──
  const [activeConceptKey, setActiveConceptKey] = useState(null);

  // ── Theme transition banner ──
  const prevThemeRef = useRef(null);
  const [themeIntro, setThemeIntro] = useState(null); // { theme, icon, text }

  const handleIntroStart = () => {
    try { sessionStorage.setItem('prequiz_seen', '1'); } catch {}
    setIntroSeen(true);
  };

  // Detect theme change and show chapter transition banner.
  // V4: removed 3-second auto-timeout. Banner now stays visible until:
  //   (1) user answers the first question of the new theme, or
  //   (2) user manually clicks ✕.
  // Must be before early return to satisfy Rules of Hooks.
  const currentQuestion = (questionsQueue && questionsQueue.length > 0) ? questionsQueue[currentIndex] : null;
  useEffect(() => {
    if (!currentQuestion) return;
    const currentTheme = currentQuestion.theme;
    if (prevThemeRef.current !== null && prevThemeRef.current !== currentTheme) {
      const intro = THEME_INTROS[currentTheme];
      if (intro) {
        setThemeIntro({
          theme:   currentTheme,
          icon:    intro.icon,
          chapter: intro.chapter?.[language] ?? intro.chapter?.fr ?? currentTheme,
          text:    intro[language] ?? intro.fr,
        });
        prevThemeRef.current = currentTheme;
        return; // no timer — banner persists until first answer or manual close
      }
    }
    prevThemeRef.current = currentTheme;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestion?.id]);

  if (!questionsQueue || questionsQueue.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <p className="text-slate-500 mb-4">
          {language === 'fr' ? 'Aucune question disponible.' : 'No questions available.'}
        </p>
        <button onClick={() => navigate('landing')} className="text-blue-600 font-medium hover:text-blue-700">
          ← {t('back')}
        </button>
      </div>
    );
  }

  const total         = questionsQueue.length;
  const question      = questionsQueue[currentIndex];
  const currentAnswer = question ? answers[question.id] : null;
  const isLast        = currentIndex === total - 1;
  const hasAnswer     = currentAnswer != null;

  /* Progression en segments (inspired by 21st.dev segmented steps) */
  const progressPct = total > 0
    ? Math.round(((currentIndex + (hasAnswer ? 1 : 0)) / total) * 100)
    : 0;

  // Clear auto-advance timer when question changes (user manually navigated)
  useEffect(() => {
    return () => clearTimeout(autoAdvanceTimer.current);
  }, [currentIndex]);

  const testMode = useStore(s => s.testMode);

  const handleAnswer = (val) => {
    if (!question) return;
    const wasAnswered = currentAnswer != null;
    answerQuestion(question.id, val);
    // Dismiss chapter banner on first answer of the new theme (V4)
    if (themeIntro && !wasAnswered) setThemeIntro(null);
    // Auto-advance 600ms after first answer — don't fire if already answered (re-selection)
    if (!wasAnswered) {
      trackQuestionAnswered({
        questionId:    question.id,
        theme:         question.theme,
        value:         val,
        questionIndex: currentIndex,
        mode:          testMode,
        isImprove:     improveMode,
      });
      clearTimeout(autoAdvanceTimer.current);
      autoAdvanceTimer.current = setTimeout(() => {
        directionRef.current = 1;
        if (improveMode) nextImproveQuestion();
        else if (isLast) finishQuestionnaire();
        else nextQuestion();
      }, 600);
    }
  };

  const handleNext = () => {
    clearTimeout(autoAdvanceTimer.current);
    directionRef.current = 1;
    if (improveMode) {
      nextImproveQuestion();
    } else if (isLast) {
      finishQuestionnaire();
    } else {
      nextQuestion();
    }
  };

  const handleSkip = () => {
    clearTimeout(autoAdvanceTimer.current);
    directionRef.current = 1;
    if (question) {
      trackQuestionSkipped({
        questionId:    question.id,
        theme:         question.theme,
        questionIndex: currentIndex,
        mode:          testMode,
      });
    }
    if (isLast) finishQuestionnaire();
    else nextQuestion();
  };

  const handlePrev = () => {
    clearTimeout(autoAdvanceTimer.current);
    directionRef.current = -1;
    prevQuestion();
  };

  return (
    <>
      <AnimatePresence>
        {!introSeen && !improveMode && (
          <PreQuizModal language={language} onStart={handleIntroStart} />
        )}
      </AnimatePresence>

      {/* ── Concept modal ── */}
      {/* Note: onGoToArticle intentionally omitted — navigating away would exit the quiz */}
      <AnimatePresence>
        {activeConceptKey && (
          <ConceptModal
            key={activeConceptKey}
            conceptKey={activeConceptKey}
            language={language}
            onClose={() => setActiveConceptKey(null)}
          />
        )}
      </AnimatePresence>

      <div className="min-h-[calc(100vh-56px)] bg-slate-50 flex flex-col">

        {/* ── Barre de progression sticky ── */}
        <div className="bg-white border-b border-slate-200 px-4 py-3 sticky top-14 z-30">
          <div className="max-w-2xl mx-auto">
            {improveMode ? (
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xs font-semibold text-blue-600 shrink-0">{t('improve_title')}</span>
                </div>
                <span className="text-xs text-slate-400 tabular-nums shrink-0">
                  {language === 'fr'
                    ? `${totalAnswered} réponse${totalAnswered > 1 ? 's' : ''}`
                    : `${totalAnswered} answer${totalAnswered !== 1 ? 's' : ''}`}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                {/* Numéro question */}
                <span className="text-xs font-semibold text-slate-500 tabular-nums w-16 shrink-0">
                  {currentIndex + 1} / {total}
                </span>

                {/* Barre segmentée — 10 segments visuels */}
                <div className="flex-1 flex gap-0.5 h-1.5">
                  {Array.from({ length: 10 }).map((_, i) => {
                    const segThreshold = ((i + 1) / 10) * 100;
                    const isFilled = progressPct >= segThreshold;
                    const isCurrent = !isFilled && progressPct >= (i / 10) * 100;
                    return (
                      <div
                        key={i}
                        className="flex-1 rounded-full transition-all duration-300"
                        style={{
                          backgroundColor: isFilled
                            ? '#2563EB'
                            : isCurrent
                            ? '#BFDBFE'
                            : '#E2E8F0',
                        }}
                      />
                    );
                  })}
                </div>

                {/* Pourcentage */}
                <span className="text-xs font-medium text-slate-400 tabular-nums w-9 text-right shrink-0">
                  {progressPct}%
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ── Chapter transition banner ─────────────────────────────────────────
            V4: redesigned from notification toast to chapter-opening card.
            - Left accent border in theme color (chapter marker)
            - Two-line hierarchy: CHAPTER NAME → framing question
            - No auto-timeout: stays until user answers first question or clicks ✕
        ────────────────────────────────────────────────────────────────────── */}
        <AnimatePresence>
          {themeIntro && (
            <motion.div
              className="mt-4 px-4 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0,   height: 'auto' }}
              exit={{    opacity: 0, y: -6,   height: 0 }}
              transition={{ duration: 0.32, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <div
                className="flex items-start gap-3.5 px-4 py-3.5 rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden"
                style={{ borderLeft: `3px solid ${THEME_COLORS[themeIntro.theme] ?? '#2563eb'}` }}
              >
                {/* Icon */}
                <span className="text-xl flex-shrink-0 mt-0.5 leading-none">{themeIntro.icon}</span>

                {/* Text hierarchy */}
                <div className="flex-1 min-w-0">
                  <p
                    className="text-[10px] font-bold uppercase tracking-widest mb-1 leading-none"
                    style={{ color: THEME_COLORS[themeIntro.theme] ?? '#2563eb' }}
                  >
                    {themeIntro.chapter}
                  </p>
                  <p className="text-sm font-medium text-slate-800 leading-snug">
                    {themeIntro.text}
                  </p>
                </div>

                {/* Dismiss */}
                <button
                  onClick={() => setThemeIntro(null)}
                  className="text-slate-300 hover:text-slate-500 transition-colors flex-shrink-0 p-0.5 mt-0.5 min-w-[24px] min-h-[24px] flex items-center justify-center"
                  aria-label="Fermer"
                >
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Question card — animated slide between questions ── */}
        <div className="flex-1 flex flex-col items-center justify-start pt-8 pb-28 px-4 overflow-hidden">
          <AnimatePresence
            mode="wait"
            custom={directionRef.current}
          >
            {question && (
              <motion.div
                key={question.id}
                custom={directionRef.current}
                variants={{
                  enter: (d) => ({ opacity: 0, x: d * 28, scale: 0.98 }),
                  center: { opacity: 1, x: 0, scale: 1 },
                  exit: (d) => ({ opacity: 0, x: d * -20, scale: 0.98 }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.24, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="w-full max-w-2xl"
              >
                <QuestionCard
                  question={
                    questionHints[question.id]
                      ? { ...question, info: questionHints[question.id] }
                      : question.explanation
                      ? { ...question, info: question.explanation }
                      : question
                  }
                  currentAnswer={currentAnswer}
                  onAnswer={handleAnswer}
                  language={language}
                  concepts={QUESTION_CONCEPTS[question.id] ?? []}
                  onConceptClick={setActiveConceptKey}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Navigation bas ── */}
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-slate-200 px-4 py-2 z-30">
          <div className="max-w-2xl mx-auto flex items-center gap-2">
            {improveMode ? (
              <>
                <button
                  onClick={stopImproveMode}
                  className="min-h-[56px] px-4 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  {t('improve_stop')}
                </button>
                <button
                  onClick={handleNext}
                  disabled={!hasAnswer}
                  className={`ml-auto min-h-[56px] px-6 rounded-xl font-semibold text-sm transition-colors ${
                    hasAnswer
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {t('improve_next')} →
                </button>
              </>
            ) : (
              <>
                {/* Retour */}
                <button
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  className={`min-h-[56px] min-w-[56px] rounded-xl border text-sm font-medium transition-colors flex items-center justify-center ${
                    currentIndex === 0
                      ? 'border-slate-100 text-slate-300 cursor-not-allowed bg-white'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50 bg-white'
                  }`}
                  aria-label={t('q_prev')}
                >
                  <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                    <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>

                {/* Passer */}
                <button
                  onClick={handleSkip}
                  className="min-h-[56px] px-4 text-sm text-slate-400 hover:text-slate-600 font-medium rounded-xl hover:bg-slate-50 transition-colors"
                >
                  {t('q_skip')}
                </button>

                {/* Suivant / Terminer */}
                <button
                  onClick={handleNext}
                  disabled={!hasAnswer}
                  className={`ml-auto min-h-[56px] px-6 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 ${
                    hasAnswer
                      ? isLast
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-200'
                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-200'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {isLast ? (
                    <>
                      {t('q_finish')}
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M3 8l4 4 6-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </>
                  ) : (
                    <>
                      {t('q_next')}
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M6 12l4-4-4-4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>

      </div>
    </>
  );
}
