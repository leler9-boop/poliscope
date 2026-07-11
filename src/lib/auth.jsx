// Auth context — wraps Supabase auth with React context.
// The entire app works without auth (guest mode).
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseEnabled } from './supabase.js';
import { useStore, CONSENT_VERSION } from '../store/useStore.js';
import { initAnonymousSession, mergeAnonymousAnswers } from './anonymous.js';
import { trackSignupCompleted, trackLoginCompleted } from './analytics.js';

const AuthContext = createContext(null);

// RGPD: single source of truth for "is it OK to write political-opinion data
// (answers, computed profile, archetype/candidate) to Supabase for this user?"
// Checked before every such write in this file. See
// audit/rgpd-remediation-2026-07/ for the full design rationale.
function hasPoliticalDataConsent() {
  return useStore.getState().consent?.politicalData === true;
}

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
    // RGPD: no automatic account sync (read or write) without explicit consent —
    // logging in is not itself consent. See hasPoliticalDataConsent() above.
    if (!hasPoliticalDataConsent()) return;

    const storeState    = useStore.getState();
    const localAnswers  = storeState.answers;
    const localCount    = Object.keys(localAnswers).length;

    // Fetch cloud profile snapshot for count + timestamp comparison.
    // user_profiles has created_at only (no updated_at column).
    const { data: cloudProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('answered_count, created_at')
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

    // Equal count → compare timestamps, use most recent.
    // Use created_at as proxy for last profile save (no updated_at on this table).
    const remoteUpdated = cloudProfile?.created_at ? new Date(cloudProfile.created_at) : null;
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

  /**
   * Reconcile consent state on login: consent is recorded per-account, not per-
   * device, so a user who consented on their laptop shouldn't be re-asked on
   * their phone. Precedence: a server-side row always wins (it's the durable
   * record); if none exists yet but this device has a local decision, push it
   * to the server (covers "just granted consent in this same session, before
   * the row existed yet"). If neither exists, do nothing — no consent has ever
   * been given anywhere, sync stays off until the user is explicitly asked
   * (triggered from the UI, not automatically here).
   */
  async function syncConsentFromServer(userId) {
    if (!isSupabaseEnabled || !supabase) return;
    const { data, error } = await supabase
      .from('user_consents')
      .select('granted, version, created_at')
      .eq('user_id', userId)
      .eq('consent_type', 'political_data')
      .maybeSingle();

    if (error) {
      console.error('[Poliscop] consent fetch error:', error.message);
      return;
    }

    if (data) {
      useStore.getState().hydrateConsent({ granted: data.granted, grantedAt: data.created_at, version: data.version });
      return;
    }

    const local = useStore.getState().consent;
    if (local?.politicalData === true || local?.politicalData === false) {
      await supabase.from('user_consents').upsert(
        {
          user_id: userId,
          consent_type: 'political_data',
          granted: local.politicalData,
          version: local.version ?? CONSENT_VERSION,
        },
        { onConflict: 'user_id,consent_type' }
      ).then(({ error: upsertError }) => {
        if (upsertError) console.error('[Poliscop] consent push error:', upsertError.message);
      });
    }
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

      if (u) {
        await syncConsentFromServer(u.id);
        await smartSync(u.id);
      }

      setLoading(false);
    });

    // Prevent onboarding check from firing more than once per login cycle.
    // SIGNED_IN can fire twice with OAuth (code exchange + session restore).
    let onboardingChecked = false;

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      useStore.getState().setAuthUser(u);

      if (event === 'SIGNED_IN' && u) {
        await syncConsentFromServer(u.id);
        // Merge any legacy anonymous_answers left over from before this device's
        // consent was known — only meaningful (and only permitted) once consent
        // is established, hence running it after the sync above, not before.
        if (hasPoliticalDataConsent()) await mergeAnonymousAnswers(u.id);
        await smartSync(u.id);

        // Track login vs signup by checking if this is the user's first sign-in.
        // user.created_at ≈ now means it's a fresh signup; older date means login.
        const createdAt = u.created_at ? new Date(u.created_at) : null;
        const isNewUser = createdAt && (Date.now() - createdAt.getTime()) < 30_000;
        if (isNewUser) {
          trackSignupCompleted({ method: u.app_metadata?.provider ?? 'email' });
        } else {
          trackLoginCompleted({ method: u.app_metadata?.provider ?? 'email' });
        }

        // Show onboarding if user has never filled in demographics.
        // Guard: only check once per login cycle, even if SIGNED_IN fires twice.
        if (!onboardingChecked) {
          onboardingChecked = true;
          const { data: demo } = await supabase
            .from('user_demographics')
            .select('id')
            .eq('user_id', u.id)
            .maybeSingle();

          if (!demo) {
            useStore.getState().setNeedsOnboarding(true);
          }
        }
      }

      // Reset flag on sign-out so next login cycle checks again.
      if (event === 'SIGNED_OUT') {
        onboardingChecked = false;
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

  // ── Consent (RGPD Article 9 — political opinion data) ────────────────────

  /**
   * Record explicit consent, both locally (immediate effect on this device —
   * see useStore.setConsent) and server-side (durable, follows the account
   * across devices). Call this from the consent modal's "I agree" action, not
   * automatically on login or signup.
   */
  async function grantConsent() {
    useStore.getState().setConsent(true);
    if (!isSupabaseEnabled || !supabase || !user) return { error: null }; // local-only is still a valid outcome pre-login
    const { error } = await supabase.from('user_consents').upsert(
      { user_id: user.id, consent_type: 'political_data', granted: true, version: CONSENT_VERSION },
      { onConflict: 'user_id,consent_type' }
    );
    if (error) console.error('[Poliscop] grantConsent error:', error.message);
    return { error };
  }

  /**
   * Withdraw consent. Does NOT delete already-stored data (that's deleteMyData,
   * a separate, more consequential action) — it only stops any further sync and
   * analytics from this point on. The consent row itself is kept (with
   * granted=false) as the audit trail proving consent was later withdrawn.
   */
  async function revokeConsent() {
    useStore.getState().withdrawConsent();
    if (!isSupabaseEnabled || !supabase || !user) return { error: null };
    const { error } = await supabase.from('user_consents').upsert(
      { user_id: user.id, consent_type: 'political_data', granted: false, version: CONSENT_VERSION },
      { onConflict: 'user_id,consent_type' }
    );
    if (error) console.error('[Poliscop] revokeConsent error:', error.message);
    return { error };
  }

  // ── Data persistence ──────────────────────────────────────────────────────

  /**
   * Upsert all answers into user_answers (one row per question).
   * Requires explicit consent — see hasPoliticalDataConsent() at the top of this
   * file. This check is a safety net in addition to the UI only calling this
   * after consent is confirmed (Profile.jsx) — do not remove it to "simplify".
   */
  async function saveAnswers(answers) {
    if (!isSupabaseEnabled || !user) return { error: 'Not authenticated' };
    if (!hasPoliticalDataConsent()) return { error: 'Consent required before saving political answers' };
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
   * Upsert computed profile snapshot into user_profiles. Requires explicit
   * consent, same rationale as saveAnswers() above.
   */
  async function saveUserProfile(profile) {
    if (!isSupabaseEnabled || !user || !profile) return { error: 'Not authenticated' };
    if (!hasPoliticalDataConsent()) return { error: 'Consent required before saving political answers' };
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
   *
   * @param {{ gender, age_range, commune_type, employment_status, education_level, postal_code }} fields
   */
  async function saveDemographics({
    gender           = null,
    age_range        = null,
    commune_type     = null,
    employment_status = null,
    education_level  = null,
    postal_code      = null,
  } = {}) {
    if (!isSupabaseEnabled || !user) return { error: 'Not authenticated' };
    const { error } = await supabase
      .from('user_demographics')
      .upsert(
        {
          user_id: user.id,
          gender:            gender            ?? null,
          age_range:         age_range         ?? null,
          commune_type:      commune_type      ?? null,
          employment_status: employment_status ?? null,
          education_level:   education_level   ?? null,
          postal_code:       postal_code       ?? null,
        },
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

  /**
   * Persist the computed archetype and top candidate into user_profiles.
   * Called automatically from a useEffect in Profile.jsx once archetype +
   * candidates are resolved — NOT from a user-initiated save action. Because
   * this fires without any explicit click, the consent check below is the
   * only thing standing between "user is logged in" and an unconsented write:
   * archetype_id/top_candidate_id are themselves derived political-opinion
   * data (see audit/rgpd-remediation-2026-07/), same rationale as
   * saveAnswers()/saveUserProfile() above. Fire-and-forget — errors are
   * logged, never surface to the user.
   *
   * @param {{ archetypeId: string, topCandidateId: string, topCandidateAlignment: number }} meta
   */
  async function saveProfileMeta({ archetypeId, topCandidateId, topCandidateAlignment }) {
    if (!isSupabaseEnabled || !supabase || !user) return;
    if (!hasPoliticalDataConsent()) return;
    const { error } = await supabase
      .from('user_profiles')
      .upsert(
        {
          user_id:                 user.id,
          archetype_id:            archetypeId            ?? null,
          top_candidate_id:        topCandidateId         ?? null,
          top_candidate_alignment: topCandidateAlignment  ?? null,
        },
        { onConflict: 'user_id' }
      );
    if (error) console.error('[Poliscop] saveProfileMeta error:', error.message);
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
    saveProfileMeta,
    grantConsent,
    revokeConsent,
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
