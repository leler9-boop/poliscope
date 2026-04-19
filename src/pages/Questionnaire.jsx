import React, { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { useStore } from '../store/useStore.js';
import { createTranslator } from '../i18n/translations.js';
import QuestionCard from '../components/QuestionCard.jsx';
import PreQuizModal from '../components/PreQuizModal.jsx';
import { questionHints } from '../data/questionHints.js';

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

  const handleIntroStart = () => {
    try { sessionStorage.setItem('prequiz_seen', '1'); } catch {}
    setIntroSeen(true);
  };

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

  const handleAnswer = (val) => {
    if (question) answerQuestion(question.id, val);
  };

  const handleNext = () => {
    if (improveMode) {
      nextImproveQuestion();
    } else if (isLast) {
      finishQuestionnaire();
    } else {
      nextQuestion();
    }
  };

  const handleSkip = () => {
    if (isLast) finishQuestionnaire();
    else nextQuestion();
  };

  return (
    <>
      <AnimatePresence>
        {!introSeen && !improveMode && (
          <PreQuizModal language={language} onStart={handleIntroStart} />
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

        {/* ── Question card ── */}
        <div className="flex-1 flex flex-col items-center justify-start pt-8 pb-28 px-4">
          {question && (
            <QuestionCard
              question={questionHints[question.id]
                ? { ...question, info: questionHints[question.id] }
                : question
              }
              currentAnswer={currentAnswer}
              onAnswer={handleAnswer}
              language={language}
            />
          )}
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
                  onClick={prevQuestion}
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
