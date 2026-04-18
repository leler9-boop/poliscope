import React, { useState, useMemo } from 'react';
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
        <p className="text-gray-500 mb-4">
          {language === 'fr' ? 'Aucune question disponible.' : 'No questions available.'}
        </p>
        <button onClick={() => navigate('landing')} className="text-blue-600 font-medium">
          ← {t('back')}
        </button>
      </div>
    );
  }

  const total        = questionsQueue.length;
  const question     = questionsQueue[currentIndex];
  const currentAnswer = question ? answers[question.id] : null;
  const progress     = total > 0 ? ((currentIndex) / total) * 100 : 0;
  const isLast       = currentIndex === total - 1;
  const hasAnswer    = currentAnswer != null;

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
    if (isLast) {
      finishQuestionnaire();
    } else {
      nextQuestion();
    }
  };

  return (
    <>
    <AnimatePresence>
      {!introSeen && !improveMode && (
        <PreQuizModal language={language} onStart={handleIntroStart} />
      )}
    </AnimatePresence>
    <div className="min-h-[calc(100vh-56px)] bg-gray-50 flex flex-col">
      {/* Top progress bar */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 sticky top-14 z-30">
        <div className="max-w-2xl mx-auto">
          {improveMode ? (
            <>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-blue-600">{t('improve_title')}</span>
                <span className="text-xs text-gray-400">
                  {language === 'fr'
                    ? `${totalAnswered} réponse${totalAnswered > 1 ? 's' : ''} au total`
                    : `${totalAnswered} answer${totalAnswered > 1 ? 's' : ''} total`}
                </span>
              </div>
              {/* Barre de progression vers profil complet (objectif = 80 réponses) */}
              <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-400 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, Math.round((totalAnswered / 80) * 100))}%` }}
                />
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-500">
                  {t('q_progress', { current: currentIndex + 1, total })}
                </span>
                <span className="text-xs text-gray-400">{Math.round(progress)}%</span>
              </div>
              <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-300"
                  style={{ width: `${Math.round(((currentIndex + (hasAnswer ? 1 : 0)) / total) * 100)}%` }}
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 flex flex-col items-center justify-start pt-8 pb-24 px-4">
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

      {/* Bottom nav — sticky */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 z-30">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          {improveMode ? (
            <>
              {/* Stop */}
              <button
                onClick={stopImproveMode}
                className="px-4 py-2.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                {t('improve_stop')}
              </button>
              {/* Next question */}
              <button
                onClick={handleNext}
                disabled={!hasAnswer}
                className={`ml-auto px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors ${
                  hasAnswer
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {t('improve_next')} →
              </button>
            </>
          ) : (
            <>
              {/* Back */}
              <button
                onClick={prevQuestion}
                disabled={currentIndex === 0}
                className={`px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                  currentIndex === 0
                    ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                    : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                }`}
              >
                ← {t('q_prev')}
              </button>

              {/* Skip */}
              <button
                onClick={handleSkip}
                className="text-sm text-gray-400 hover:text-gray-600 font-medium px-2"
              >
                {t('q_skip')}
              </button>

              {/* Next / Finish */}
              <button
                onClick={handleNext}
                disabled={!hasAnswer}
                className={`ml-auto px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors ${
                  hasAnswer
                    ? isLast
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isLast ? t('q_finish') : `${t('q_next')} →`}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
    </>
  );
}
