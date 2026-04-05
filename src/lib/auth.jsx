// Auth context — wraps Supabase auth with React context.
// The entire app works without auth (guest mode).
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseEnabled } from './supabase.js';
import { useStore } from '../store/useStore.js';
import { initAnonymousSession, mergeAnonymousAnswers } from './anonymous.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * Smart sync: compare local vs cloud answer counts and apply the best profile.
   *
   * Rules:
   * - no remote profile  → push local to cloud (background)
   * - remote > local     → hydrate from cloud
   * - local > remote     → push local to cloud (background)
   * - equal count        → use most recent (last_updated)
   */
  async function smartSync(userId) {
    if (!isSupabaseEnabled || !supabase) return;

    const storeState    = useStore.getState();
    const localAnswers  = storeState.answers;
    const localCount    = Object.keys(localAnswers).length;

    // Fetch cloud profile snapshot for count + timestamp comparison
    const { data: cloudProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('answered_count, updated_at')
      .eq('user_id', userId)
      .maybeSingle();

    if (profileError) {
      console.error('[Poliscop] smartSync profile fetch error:', profileError.message);
      return;
    }

    const remoteCount = cloudProfile?.answered_count ?? 0;

    if (remoteCount === 0 && localCount === 0) return;

    if (remoteCount === 0) {
      // No remote profile → upload local in background
      if (localCount > 0) _pushLocalToCloud(userId, localAnswers);
      return;
    }

    if (remoteCount > localCount) {
      // Cloud is more complete → hydrate local from cloud
      await _hydrateFromCloud(userId);
      return;
    }

    if (localCount > remoteCount) {
      // Local is more complete → ask user which profile to keep
      const { data: remoteData } = await supabase
        .from('user_answers')
        .select('question_id, answer_value')
        .eq('user_id', userId);

      const remoteAnswers = {};
      (remoteData ?? []).forEach(row => { remoteAnswers[row.question_id] = row.answer_value; });

      useStore.getState().setSyncConflict({ remoteAnswers, remoteCount, localCount, userId });
      return;
    }

    // Equal count → compare timestamps, use most recent
    const remoteUpdated = cloudProfile?.updated_at ? new Date(cloudProfile.updated_at) : null;
    const localUpdated  = storeState.profileLastUpdated ? new Date(storeState.profileLastUpdated) : null;

    if (remoteUpdated && (!localUpdated || remoteUpdated > localUpdated)) {
      await _hydrateFromCloud(userId);
    }
    // otherwise local is most recent — keep it as-is
  }

  async function _hydrateFromCloud(userId) {
    const { data, error } = await supabase
      .from('user_answers')
      .select('question_id, answer_value')
      .eq('user_id', userId);

    if (error) {
      console.error('[Poliscop] Failed to load cloud answers:', error.message);
      return;
    }

    if (data && data.length > 0) {
      const answersMap = {};
      data.forEach(row => { answersMap[row.question_id] = row.answer_value; });
      useStore.getState().hydrateFromCloud(answersMap);
    }
  }

  function _pushLocalToCloud(userId, localAnswers) {
    const rows = Object.entries(localAnswers).map(([question_id, answer_value]) => ({
      user_id: userId, question_id, answer_value,
    }));
    if (rows.length === 0) return;
    supabase
      .from('user_answers')
      .upsert(rows, { onConflict: 'user_id,question_id' })
      .then(({ error }) => {
        if (error) console.error('[Poliscop] Sync upload error:', error.message);
      });
  }

  useEffect(() => {
    if (!isSupabaseEnabled) {
      setLoading(false);
      return;
    }

    // Initialize anonymous session (fire-and-forget)
    initAnonymousSession();

    // Get initial session and sync answers
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const u = session?.user ?? null;
      setUser(u);
      useStore.getState().setAuthUser(u);

      if (u) await smartSync(u.id);

      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      useStore.getState().setAuthUser(u);

      if (event === 'SIGNED_IN' && u) {
        await mergeAnonymousAnswers(u.id);
        await smartSync(u.id);

        // Show onboarding if user has never filled in demographics
        const { data: demo } = await supabase
          .from('user_demographics')
          .select('id')
          .eq('user_id', u.id)
          .maybeSingle();

        if (!demo) {
          useStore.getState().setNeedsOnboarding(true);
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

  /**
   * Save optional demographic data. Creates a record even if all fields are null
   * (used to mark onboarding as seen/skipped).
   */
  async function saveDemographics({ age_range, education_level, postal_code }) {
    if (!isSupabaseEnabled || !user) return { error: 'Not authenticated' };
    const { error } = await supabase
      .from('user_demographics')
      .upsert(
        { user_id: user.id, age_range: age_range ?? null, education_level: education_level ?? null, postal_code: postal_code ?? null },
        { onConflict: 'user_id' }
      );
    if (error) console.error('[Poliscop] Demographics save error:', error.message);
    return { error };
  }

  /**
   * Load demographic data for the current user.
   */
  async function loadDemographics() {
    if (!isSupabaseEnabled || !user) return null;
    const { data } = await supabase
      .from('user_demographics')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();
    return data;
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
    saveDemographics,
    loadDemographics,
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
