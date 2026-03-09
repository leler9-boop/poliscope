// POLISCOPE — Zustand Store
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { calculateProfile } from '../engine/scorer.js';
import { THEMES_ORDER, getQuestionQueue, questions as allQuestions } from '../data/questions.js';
import { createTranslator } from '../i18n/translations.js';

const STORAGE_KEY = 'poliscope_state';

function detectLanguage() {
  const lang = navigator.language?.slice(0, 2);
  return lang === 'fr' ? 'fr' : 'en';
}

export const useStore = create(
  persist(
    (set, get) => ({
      // ── App state ──
      language: detectLanguage(),
      currentPage: 'landing',

      // ── Test state ──
      testMode: null,
      questionsQueue: [],
      currentQuestionIndex: 0,

      // ── Answers & profile ──
      answers: {},
      priorityOrder: [...THEMES_ORDER],
      profile: null,

      // ── Actions ──
      setLanguage: (lang) => set({ language: lang }),
      navigate: (page) => set({ currentPage: page }),

      startTest: (mode) => {
        const { priorityOrder } = get();
        const queue = getQuestionQueue(mode, priorityOrder);
        set({
          testMode: mode,
          questionsQueue: queue,
          currentQuestionIndex: 0,
          currentPage: 'questionnaire',
        });
      },

      startRefinement: (extraCount) => {
        const { answers } = get();
        const unanswered = allQuestions.filter(q => answers[q.id] == null).slice(0, extraCount);
        set({
          questionsQueue: unanswered,
          currentQuestionIndex: 0,
          currentPage: 'questionnaire',
        });
      },

      setPriorityOrder: (order) => set({ priorityOrder: order }),

      answerQuestion: (questionId, value) => {
        const newAnswers = { ...get().answers, [questionId]: value };
        const profile = calculateProfile(newAnswers);
        set({ answers: newAnswers, profile });
      },

      nextQuestion: () => {
        const { currentQuestionIndex, questionsQueue } = get();
        if (currentQuestionIndex < questionsQueue.length - 1) {
          set({ currentQuestionIndex: currentQuestionIndex + 1 });
        } else {
          const { answers } = get();
          const profile = calculateProfile(answers);
          set({ profile, currentPage: 'profile' });
        }
      },

      prevQuestion: () => {
        const { currentQuestionIndex } = get();
        if (currentQuestionIndex > 0) {
          set({ currentQuestionIndex: currentQuestionIndex - 1 });
        }
      },

      finishQuestionnaire: () => {
        const { answers } = get();
        const profile = calculateProfile(answers);
        set({ profile, currentPage: 'profile' });
      },

      resetProfile: () => {
        set({
          answers: {},
          profile: null,
          testMode: null,
          questionsQueue: [],
          currentQuestionIndex: 0,
          currentPage: 'landing',
        });
      },

      exportProfile: () => {
        const { answers, profile, priorityOrder } = get();
        const data = {
          version: '1.0',
          exportDate: new Date().toISOString(),
          answers,
          profile,
          priorityOrder,
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `poliscope-profile-${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
      },

      importProfile: (jsonData) => {
        try {
          const data = JSON.parse(jsonData);
          if (data.answers && data.profile) {
            set({
              answers: data.answers,
              profile: data.profile,
              priorityOrder: data.priorityOrder ?? [...THEMES_ORDER],
              currentPage: 'profile',
            });
            return true;
          }
        } catch (e) {
          console.error('Import failed:', e);
        }
        return false;
      },
    }),
    {
      name: STORAGE_KEY,
      partialize: (state) => ({
        language: state.language,
        answers: state.answers,
        profile: state.profile,
        priorityOrder: state.priorityOrder,
      }),
    }
  )
);

export { createTranslator };
