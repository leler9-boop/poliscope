// Auth context — wraps Supabase auth with React context.
// The entire app works without auth (guest mode).
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseEnabled } from './supabase.js';
import { useStore } from '../store/useStore.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * Fetch all answers for a given userId from Supabase and hydrate the store.
   * Only hydrates if the store has no local answers (guest or fresh session).
   */
  async function loadAnswersForUser(userId) {
    if (!isSupabaseEnabled || !supabase) return;
    const storeState = useStore.getState();
    const hasLocalAnswers = Object.keys(storeState.answers).length > 0;
    if (hasLocalAnswers) return; // Let the migration flow handle this

    const { data, error } = await supabase
      .from('user_answers')
      .select('question_id, answer_value')
      .eq('user_id', userId);

    if (error) {
      console.error('[Poliscope] Failed to load cloud answers:', error.message);
      return;
    }

    if (data && data.length > 0) {
      const answersMap = {};
      data.forEach(row => { answersMap[row.question_id] = row.answer_value; });
      useStore.getState().hydrateFromCloud(answersMap);
    }
  }

  useEffect(() => {
    if (!isSupabaseEnabled) {
      setLoading(false);
      return;
    }

    // Get initial session, then load cloud answers if already logged in
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const u = session?.user ?? null;
      setUser(u);
      useStore.getState().setAuthUser(u);

      if (u) {
        await loadAnswersForUser(u.id);
      }

      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      useStore.getState().setAuthUser(u);

      if (event === 'SIGNED_IN' && u) {
        const { answers, setPendingMigration } = useStore.getState();
        const hasLocalAnswers = Object.keys(answers).length > 0;

        if (hasLocalAnswers) {
          // User has unsaved local answers — offer migration
          setPendingMigration(true);
        } else {
          // No local answers — silently load from cloud
          loadAnswersForUser(u.id);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // ── Auth actions ──────────────────────────────────────────────────────────

  async function signUp(email, password) {
    if (!isSupabaseEnabled) return { error: { message: 'Backend not configured' } };
    return supabase.auth.signUp({ email, password });
  }

  async function signIn(email, password) {
    if (!isSupabaseEnabled) return { error: { message: 'Backend not configured' } };
    return supabase.auth.signInWithPassword({ email, password });
  }

  async function signInWithGoogle() {
    if (!isSupabaseEnabled) return { error: { message: 'Backend not configured' } };
    return supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    });
  }

  async function signOut() {
    if (!isSupabaseEnabled) return;
    await supabase.auth.signOut();
    setUser(null);
    useStore.getState().setAuthUser(null);
  }

  // ── Data persistence ──────────────────────────────────────────────────────

  /**
   * Upsert all answers into user_answers (one row per question).
   */
  async function saveAnswers(answers) {
    if (!isSupabaseEnabled || !user) return { error: 'Not authenticated' };
    const rows = Object.entries(answers).map(([question_id, answer_value]) => ({
      user_id: user.id,
      question_id,
      answer_value,
    }));
    if (rows.length === 0) return { data: null, error: null };
    const { data, error } = await supabase
      .from('user_answers')
      .upsert(rows, { onConflict: 'user_id,question_id' });
    return { data, error };
  }

  /**
   * Upsert computed profile snapshot into user_profiles.
   */
  async function saveUserProfile(profile) {
    if (!isSupabaseEnabled || !user || !profile) return { error: 'Not authenticated' };
    const payload = {
      user_id:          user.id,
      theme_scores:     profile.themes,
      axes:             profile.axes,
      confidence:       profile.confidence,
      confidence_score: profile.confidenceScore ?? 0,
      answered_count:   profile.answeredCount ?? 0,
      updated_at:       new Date().toISOString(),
    };
    const { data, error } = await supabase
      .from('user_profiles')
      .upsert(payload, { onConflict: 'user_id' });
    return { data, error };
  }

  /**
   * Load answers + profile snapshot from Supabase.
   */
  async function loadCloudData() {
    if (!isSupabaseEnabled || !user) return { answers: null, profile: null };

    const [answersRes, profileRes] = await Promise.all([
      supabase.from('user_answers').select('question_id, answer_value').eq('user_id', user.id),
      supabase.from('user_profiles').select('*').eq('user_id', user.id).maybeSingle(),
    ]);

    const answersMap = {};
    (answersRes.data ?? []).forEach(row => {
      answersMap[row.question_id] = row.answer_value;
    });

    return {
      answers: Object.keys(answersMap).length > 0 ? answersMap : null,
      profile: profileRes.data ?? null,
    };
  }

  const value = {
    user,
    loading,
    isAuthenticated: Boolean(user),
    isSupabaseEnabled,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    saveAnswers,
    saveUserProfile,
    loadCloudData,
    // Legacy alias used by the Profile.jsx cloud-save button
    saveProfile: async (answers) => saveAnswers(answers),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
