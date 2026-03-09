// Auth context — wraps Supabase auth with React context.
// The entire app works without auth (guest mode).
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseEnabled } from './supabase.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseEnabled) {
      setLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
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

  async function signOut() {
    if (!isSupabaseEnabled) return;
    await supabase.auth.signOut();
    setUser(null);
  }

  // ── Profile storage ───────────────────────────────────────────────────────

  async function saveProfile(answers, themeScores) {
    if (!isSupabaseEnabled || !user) return { error: 'Not authenticated or backend not configured' };

    const payload = {
      user_id:      user.id,
      answers:      answers,
      theme_scores: themeScores,
      updated_at:   new Date().toISOString(),
    };

    // Upsert — create or update
    const { data, error } = await supabase
      .from('profiles')
      .upsert(payload, { onConflict: 'user_id' })
      .select()
      .single();

    return { data, error };
  }

  async function loadProfile() {
    if (!isSupabaseEnabled || !user) return { data: null, error: null };

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    return { data, error };
  }

  const value = {
    user,
    loading,
    isAuthenticated: Boolean(user),
    isSupabaseEnabled,
    signUp,
    signIn,
    signOut,
    saveProfile,
    loadProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
