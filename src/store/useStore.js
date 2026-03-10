// POLISCOPE — Zustand Store
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { calculateProfile } from '../engine/scorer.js';
import { THEMES_ORDER, getQuestionQueue, questions as allQuestions } from '../data/questions.js';
import { createTranslator } from '../i18n/translations.js';

/**
 * Pick the next question for improve mode.
 * Prefers unanswered questions; avoids repeating the last 3 themes.
 */
function pickNextQuestion(answers, recentThemes = []) {
  const unanswered = allQuestions.filter(q => answers[q.id] == null);
  const pool = unanswered.length > 0 ? unanswered : allQuestions;
  // Avoid repeating same theme as last 3 picks
  const preferred = pool.filter(q => !recentThemes.slice(-3).includes(q.theme));
  const source = preferred.length > 0 ? preferred : pool;
  return source[Math.floor(Math.random() * source.length)];
}

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

      // ── Auth state (session-only, synced from auth.jsx) ──
      userId: null,
      userEmail: null,

      // ── Improve mode (session-only, not persisted) ──
      improveMode: false,
      recentThemes: [],

      // ── Migration (session-only) ──
      pendingMigration: false,

      // ── Profile adjustments (manual refinement, does not touch original answers) ──
      profileAdjustments: {}, // { [THEME]: deltaPoints }

      // ── Election module ──
      selectedElectionId: null,
      electionAnswers: {}, // { [electionId]: { [questionId]: value } }

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
          improveMode: false,
          questionsQueue: unanswered,
          currentQuestionIndex: 0,
          currentPage: 'questionnaire',
        });
      },

      startImproveMode: () => {
        const { answers, recentThemes } = get();
        const question = pickNextQuestion(answers, recentThemes);
        set({
          improveMode: true,
          questionsQueue: [question],
          currentQuestionIndex: 0,
          currentPage: 'questionnaire',
        });
      },

      stopImproveMode: () => {
        set({ improveMode: false, currentPage: 'profile' });
      },

      nextImproveQuestion: () => {
        const { answers, recentThemes, questionsQueue } = get();
        const currentTheme = questionsQueue[0]?.theme;
        const updatedRecent = currentTheme
          ? [...recentThemes, currentTheme].slice(-6)
          : recentThemes;
        const question = pickNextQuestion(answers, updatedRecent);
        set({
          questionsQueue: [question],
          currentQuestionIndex: 0,
          recentThemes: updatedRecent,
        });
      },

      setAuthUser: (user) => set({
        userId:    user?.id    ?? null,
        userEmail: user?.email ?? null,
      }),

      setPendingMigration: (v) => set({ pendingMigration: v }),

      applyRefinement: (themeDeltas) => {
        // themeDeltas: { ECONOMY: -5, PUBLIC_SERVICES: +5, ... }
        const current = get().profileAdjustments;
        const next = { ...current };
        Object.entries(themeDeltas).forEach(([theme, delta]) => {
          const prev = next[theme] ?? 0;
          // Cap total adjustment per theme at ±25
          next[theme] = Math.max(-25, Math.min(25, prev + delta));
        });
        set({ profileAdjustments: next });
      },

      resetAdjustments: () => set({ profileAdjustments: {} }),

      selectElection: (id) => set({ selectedElectionId: id, currentPage: 'electionDetail' }),

      answerElectionQuestion: (electionId, questionId, value) => {
        const current = get().electionAnswers;
        set({
          electionAnswers: {
            ...current,
            [electionId]: { ...(current[electionId] ?? {}), [questionId]: value },
          },
        });
      },

      clearElectionAnswers: (electionId) => {
        const current = get().electionAnswers;
        const next = { ...current };
        delete next[electionId];
        set({ electionAnswers: next });
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
          profileAdjustments: {},
          testMode: null,
          questionsQueue: [],
          currentQuestionIndex: 0,
          improveMode: false,
          recentThemes: [],
          pendingMigration: false,
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
        electionAnswers: state.electionAnswers,
        profileAdjustments: state.profileAdjustments,
      }),
    }
  )
);

export { createTranslator };
