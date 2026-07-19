// POLISCOP — Zustand Store
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { calculateProfile } from '../engine/scorer.js';
import { THEMES_ORDER, getQuestionQueue, questions as allQuestions } from '../data/questions.js';
import { createTranslator } from '../i18n/translations.js';
import { supabase, isSupabaseEnabled } from '../lib/supabase.js';
import { routerNavigate, PAGE_TO_PATH } from '../lib/router.js';
import {
  trackTestStart,
  trackTestComplete,
  trackImproveStarted,
  trackImproveCompleted,
  trackRetakeStarted,
  setAnalyticsConsent,
} from '../lib/analytics.js';

// Consent text version — bump this if the consent copy shown to users changes
// materially, so previously-granted consent can be distinguished from consent
// to the current wording (mirrors user_consents.version in schema_v3.sql).
export const CONSENT_VERSION = '2026-07';

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

// Clé localStorage historique (ancienne orthographe) : ne PAS renommer, elle identifie
// les données déjà écrites dans les navigateurs des utilisateurs existants.
const OLD_STORAGE_KEY = 'poliscope_state'; // brand-check:allow
const STORAGE_KEY = 'poliscop_state';

// Migrate localStorage data from old key to new key (runs once)
// Wrapped in try/catch: Safari private browsing throws SecurityError on any localStorage access
try {
  if (typeof localStorage !== 'undefined') {
    if (localStorage.getItem(OLD_STORAGE_KEY) && !localStorage.getItem(STORAGE_KEY)) {
      localStorage.setItem(STORAGE_KEY, localStorage.getItem(OLD_STORAGE_KEY));
    }
    localStorage.removeItem(OLD_STORAGE_KEY);
  }
} catch {
  // Safari private browsing — localStorage unavailable, app runs in guest mode
}

function detectLanguage() {
  return 'fr';
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

      // ── Onboarding (session-only) ──
      needsOnboarding: false,

      // ── RGPD consent for storing/transmitting political-opinion data (persisted) ──
      // politicalData: null = never decided (default — nothing is sent anywhere) |
      //                true = granted | false = explicitly declined.
      // This is the single gate checked before any Supabase write of answers,
      // computed profile, or archetype/candidate-carrying analytics events.
      consent: { politicalData: null, grantedAt: null, version: null },

      // ── Profile reveal (session-only) — true once after quiz completion ──
      profileRevealPending: false,

      // ── Sync conflict (session-only): set when local > remote on login ──
      // null | { remoteAnswers, remoteCount, localCount, userId }
      syncConflict: null,

      // ── « Comprendre la politique » : dernière fiche consultée (persisté) ──
      // null | { section, slug, title, ts }
      lastLearn: null,

      // ── Gamification apprentissage (persisté, 100 % local — engagement, pas opinion) ──
      // knowledge : { quiz: {qid: bool}, vf: {id: bool}, fiches: {slug: maxLevel} }
      knowledge: { quiz: {}, vf: {}, fiches: {} },
      // parcoursDone : { [parcoursSlug]: [ 'section/slug', … ] }
      parcoursDone: {},

      // ── Profile last updated timestamp (persisted for cross-device sync) ──
      profileLastUpdated: null,

      // ── Profile adjustments (manual refinement, does not touch original answers) ──
      profileAdjustments: {}, // { [THEME]: deltaPoints }

      // ── Priority weights (100 points allocated across themes, null = equal) ──
      themeWeights: null, // { ECONOMY: 20, SOCIAL: 15, … } summing to 100

      // ── Election module ──
      selectedElectionId: null,
      electionAnswers: {}, // { [electionId]: { [questionId]: value } }

      // ── Candidate module ──
      selectedCandidateId: null,
      compareIds: [], // [id1, id2]

      // ── Actions ──
      setLanguage: (lang) => set({ language: lang }),

      setLastLearn: (v) => set({ lastLearn: v }),

      recordQuiz: (qid, correct) => set(st => {
        // ne jamais dégrader un acquis : une bonne réponse passée reste acquise
        if (st.knowledge.quiz[qid] === true) return {};
        return { knowledge: { ...st.knowledge, quiz: { ...st.knowledge.quiz, [qid]: correct } } };
      }),

      recordVf: (id, correct) => set(st => {
        if (st.knowledge.vf[id] === true) return {};
        return { knowledge: { ...st.knowledge, vf: { ...st.knowledge.vf, [id]: correct } } };
      }),

      recordFicheLevel: (slug, level) => set(st => {
        const cur = st.knowledge.fiches[slug] || 0;
        if (level <= cur) return {};
        return { knowledge: { ...st.knowledge, fiches: { ...st.knowledge.fiches, [slug]: level } } };
      }),

      markParcoursStep: (parcoursSlug, key) => set(st => {
        const done = st.parcoursDone[parcoursSlug] || [];
        if (done.includes(key)) return {};
        return { parcoursDone: { ...st.parcoursDone, [parcoursSlug]: [...done, key] } };
      }),

      navigate: (page) => {
        set({ currentPage: page });
        const { selectedElectionId, selectedCandidateId, compareIds } = get();
        let path = PAGE_TO_PATH[page];
        if (page === 'electionDetail')   path = `/elections/${selectedElectionId}`;
        if (page === 'candidateProfile') path = `/candidates/${selectedCandidateId}`;
        if (page === 'compareView')      path = `/compare/${compareIds[0]}/${compareIds[1]}`;
        if (path) routerNavigate(path);
      },

      startTest: (mode) => {
        const { priorityOrder, language } = get();
        const queue = getQuestionQueue(mode, priorityOrder);
        set({
          testMode: mode,
          questionsQueue: queue,
          currentQuestionIndex: 0,
          currentPage: 'questionnaire',
        });
        routerNavigate('/quiz');
        trackTestStart({ mode, lang: language });
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
        routerNavigate('/quiz');
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
        routerNavigate('/quiz');
        trackImproveStarted();
      },

      stopImproveMode: () => {
        const { answers } = get();
        set({ improveMode: false, currentPage: 'profile' });
        routerNavigate('/profile');
        trackImproveCompleted({ answeredCount: Object.keys(answers).length });
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

      setNeedsOnboarding: (v) => set({ needsOnboarding: v }),

      /**
       * Record a consent decision (grant or decline). Also mirrors the decision
       * into analytics.js's module-level flag so trackQuestionAnswered() and
       * friends start/stop firing immediately, in the same tick. Persisting to
       * Supabase's user_consents table (for logged-in users) happens separately
       * in auth.jsx — this action only updates local/device state.
       */
      setConsent: (granted) => {
        const consent = { politicalData: granted === true, grantedAt: new Date().toISOString(), version: CONSENT_VERSION };
        set({ consent });
        setAnalyticsConsent(granted === true);
      },

      /** Explicit withdrawal — distinct action from setConsent(false) only for readability at call sites. */
      withdrawConsent: () => {
        set({ consent: { politicalData: false, grantedAt: new Date().toISOString(), version: CONSENT_VERSION } });
        setAnalyticsConsent(false);
      },

      /**
       * Sync local consent state FROM a server-side user_consents row (auth.jsx,
       * on login) — unlike setConsent(), preserves the row's original grantedAt
       * rather than stamping "now", since this isn't a new decision.
       */
      hydrateConsent: ({ granted, grantedAt, version }) => {
        set({ consent: { politicalData: granted === true, grantedAt: grantedAt ?? null, version: version ?? null } });
        setAnalyticsConsent(granted === true);
      },

      setSyncConflict: (v) => set({ syncConflict: v }),

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

      setThemeWeights: (weights) => set({ themeWeights: weights }),

      selectElection: (id) => {
        set({ selectedElectionId: id, currentPage: 'electionDetail' });
        routerNavigate(`/elections/${id}`);
      },

      selectCandidate: (id) => {
        set({ selectedCandidateId: id, currentPage: 'candidateProfile' });
        routerNavigate(`/candidates/${id}`);
      },

      startCompare: (id1, id2) => {
        set({ compareIds: [id1, id2], currentPage: 'compareView' });
        routerNavigate(`/compare/${id1}/${id2}`);
      },

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
        const now = new Date().toISOString();
        set({ answers: newAnswers, profile, profileLastUpdated: now });

        // RGPD (2026-07-11): political answers are local-only by default. Nothing is
        // sent to Supabase — for anonymous OR logged-in users — without explicit,
        // affirmative consent (consent.politicalData === true). Account creation or
        // login alone is NOT sufficient consent. See audit/rgpd-remediation-2026-07/
        // for the full design. Do not remove this check to "fix" sync — that would
        // reintroduce silent transmission of GDPR Article 9 data.
        //
        // Anonymous users are intentionally never written to Supabase at all: the
        // local `answers` state above is already the complete, authoritative copy,
        // so there is nothing to gain from also mirroring it to anonymous_answers
        // pre-consent. If they later sign up and consent, saveAnswers()/
        // saveUserProfile() (auth.jsx) push this same local state to their account.
        const { userId, consent } = get();
        const hasConsent = consent?.politicalData === true;
        if (isSupabaseEnabled && supabase && userId && hasConsent) {
          // Save individual answer
          supabase
            .from('user_answers')
            .upsert(
              { user_id: userId, question_id: questionId, answer_value: value },
              { onConflict: 'user_id,question_id' }
            )
            .then(({ error }) => {
              if (error) console.error('[Poliscop] Supabase answer save error:', error.message);
            });
          // Save profile snapshot (answered_count used for cross-device sync)
          supabase
            .from('user_profiles')
            .upsert(
              {
                user_id:          userId,
                theme_scores:     profile.themes,
                axes:             profile.axes,
                confidence:       profile.confidence ?? 'very_low',
                confidence_score: profile.confidenceScore ?? 0,
                answered_count:   Object.keys(newAnswers).length,
              },
              { onConflict: 'user_id' }
            )
            .then(({ error }) => {
              if (error) console.error('[Poliscop] Supabase profile snapshot error:', error.message);
            });
        }
      },

      /**
       * Load answers fetched from Supabase into the store (keyed by question_id).
       * Recalculates the profile so all derived state stays consistent.
       */
      hydrateFromCloud: (cloudAnswers) => {
        if (!cloudAnswers || Object.keys(cloudAnswers).length === 0) return;
        const profile = calculateProfile(cloudAnswers);
        set({ answers: cloudAnswers, profile });
      },

      nextQuestion: () => {
        const { currentQuestionIndex, questionsQueue } = get();
        if (currentQuestionIndex < questionsQueue.length - 1) {
          set({ currentQuestionIndex: currentQuestionIndex + 1 });
        } else {
          const { answers, testMode, language } = get();
          const profile = calculateProfile(answers);
          set({ profile, currentPage: 'profile' });
          routerNavigate('/profile');
          trackTestComplete({
            mode: testMode,
            answeredCount: Object.keys(answers).length,
            totalCount: profile.totalQuestions,
            lang: language,
          });
        }
      },

      prevQuestion: () => {
        const { currentQuestionIndex } = get();
        if (currentQuestionIndex > 0) {
          set({ currentQuestionIndex: currentQuestionIndex - 1 });
        }
      },

      finishQuestionnaire: () => {
        const { answers, testMode, language } = get();
        const profile = calculateProfile(answers);
        set({ profile, currentPage: 'profile', profileRevealPending: true });
        routerNavigate('/profile');
        trackTestComplete({
          mode: testMode,
          answeredCount: Object.keys(answers).length,
          totalCount: profile.totalQuestions,
          lang: language,
        });
      },

      clearRevealPending: () => set({ profileRevealPending: false }),

      resetProfile: () => {
        trackRetakeStarted();
        set({
          answers: {},
          profile: null,
          profileAdjustments: {},
          themeWeights: null,
          testMode: null,
          questionsQueue: [],
          currentQuestionIndex: 0,
          improveMode: false,
          recentThemes: [],
          pendingMigration: false,
          currentPage: 'landing',
        });
        routerNavigate('/');
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
        a.download = `poliscop-profile-${new Date().toISOString().slice(0, 10)}.json`;
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
            routerNavigate('/profile');
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
        themeWeights: state.themeWeights,
        profileLastUpdated: state.profileLastUpdated,
        consent: state.consent,
        lastLearn: state.lastLearn,
        knowledge: state.knowledge,
        parcoursDone: state.parcoursDone,
      }),
      // Sync analytics.js's module-level consent flag as soon as the persisted
      // state is available — before this runs, it defaults to false (fail-closed:
      // no tracking of political content until we positively know consent was granted).
      onRehydrateStorage: () => (state) => {
        setAnalyticsConsent(state?.consent?.politicalData === true);
      },
    }
  )
);

export { createTranslator };
