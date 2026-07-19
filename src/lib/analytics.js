/**
 * POLISCOP — Analytics module
 *
 * Thin, fire-and-forget wrapper over track() from anonymous.js.
 * All calls are silent no-ops when Supabase is not configured.
 * Never import this in server-side or non-browser contexts.
 *
 * Usage:
 *   import { trackLandingView, trackTestStart } from './analytics.js';
 *   trackLandingView({ lang: 'fr', hasProfile: false });
 *
 * Consent gating (RGPD, 2026-07-11):
 * A subset of events below carry political-opinion content (the answer value
 * itself, or an archetype/candidate derived from it) — GDPR Article 9 special
 * category data. Those are gated behind explicit consent via a module-level flag,
 * kept in sync by useStore.js (setConsent/withdrawConsent) rather than importing
 * useStore here directly, which would create a circular import (useStore already
 * imports several track* functions from this file). Events with no political
 * payload (page views, funnel counts, account lifecycle) are never gated — they
 * carry no opinion data, matching the "legitimate interest" analytics category.
 */

import { track } from './anonymous.js';

let _politicalDataConsent = false;

/** Called by useStore.js whenever consent state changes (grant, withdraw, or on rehydration from localStorage). */
export function setAnalyticsConsent(granted) {
  _politicalDataConsent = granted === true;
}

function trackIfConsented(event_name, props) {
  if (!_politicalDataConsent) return;
  track(event_name, props);
}

// ── Acquisition ──────────────────────────────────────────────────────────────

/**
 * Fired once per session when the landing page is first rendered.
 * @param {{ lang: string, hasProfile: boolean }} props
 */
export function trackLandingView({ lang, hasProfile } = {}) {
  track('landing_view', {
    lang: lang ?? null,
    has_profile: hasProfile ?? false,
  });
}

// ── Quiz funnel ───────────────────────────────────────────────────────────────

/**
 * User clicks a CTA that starts a quiz (mode chosen on SelectTest screen).
 * @param {{ mode: string, lang: string }} props
 */
export function trackTestStart({ mode, lang } = {}) {
  track('test_start', {
    mode: mode ?? null,
    lang: lang ?? null,
  });
}

/**
 * User completes the last question in their quiz session.
 * @param {{ mode: string, answeredCount: number, totalCount: number, lang: string }} props
 */
export function trackTestComplete({ mode, answeredCount, totalCount, lang } = {}) {
  track('test_complete', {
    mode:           mode ?? null,
    answered_count: answeredCount ?? null,
    total_count:    totalCount ?? null,
    lang:           lang ?? null,
  });
}

/**
 * User starts improve mode (one-question-at-a-time refinement from Profile).
 */
export function trackImproveStarted() {
  track('improve_started');
}

/**
 * User exits improve mode back to their profile.
 * @param {{ answeredCount: number }} props
 */
export function trackImproveCompleted({ answeredCount } = {}) {
  track('improve_completed', {
    answered_count: answeredCount ?? null,
  });
}

// ── Profile ───────────────────────────────────────────────────────────────────

/**
 * Profile page becomes visible to the user.
 * Consent-gated: archetype_id/top_candidate_id are derived political-opinion data.
 * @param {{ answeredCount: number, archetypeId: string|null, topCandidateId: string|null }} props
 */
export function trackProfileViewed({ answeredCount, archetypeId, topCandidateId } = {}) {
  trackIfConsented('profile_viewed', {
    answered_count:   answeredCount  ?? null,
    archetype_id:     archetypeId   ?? null,
    top_candidate_id: topCandidateId ?? null,
  });
}

/**
 * User shares their profile card (image or link).
 * Consent-gated: carries archetype/candidate alignment, derived political-opinion data.
 * @param {{ method: 'native'|'copy'|'download', archetypeId: string|null, topCandidateId: string|null, topCandidateAlignment: number|null }} props
 */
export function trackProfileShared({ method, archetypeId, topCandidateId, topCandidateAlignment } = {}) {
  trackIfConsented('profile_shared', {
    method:                  method                ?? null,
    archetype_id:            archetypeId           ?? null,
    top_candidate_id:        topCandidateId        ?? null,
    top_candidate_alignment: topCandidateAlignment ?? null,
  });
}

/**
 * User downloads their profile image (save to camera roll / file).
 * Consent-gated: carries archetype_id, derived political-opinion data.
 * @param {{ archetypeId: string|null }} props
 */
export function trackProfileDownloaded({ archetypeId } = {}) {
  trackIfConsented('profile_downloaded', {
    archetype_id: archetypeId ?? null,
  });
}

/**
 * User exports their profile as a JSON file.
 */
export function trackProfileExported() {
  track('profile_exported');
}

// ── Auth ──────────────────────────────────────────────────────────────────────

/**
 * User successfully creates an account.
 * @param {{ method: 'email'|'google'|'github' }} props
 */
export function trackSignupCompleted({ method } = {}) {
  track('signup_completed', { method: method ?? null });
}

/**
 * User successfully logs in to an existing account.
 * @param {{ method: 'email'|'google'|'github' }} props
 */
export function trackLoginCompleted({ method } = {}) {
  track('login_completed', { method: method ?? null });
}

// ── Onboarding / demographics ─────────────────────────────────────────────────

/**
 * User submits the onboarding demographics form.
 * Consent-gated: same rationale as saveDemographics() in auth.jsx — this data
 * is explicitly meant to be cross-referenced with political opinions, so the
 * joined processing is sensitive even though no single field here is.
 * @param {{ gender, ageRange, communeType, employmentStatus, educationLevel, hasPostalCode }} props
 */
export function trackDemographicsCompleted({
  gender,
  ageRange,
  communeType,
  employmentStatus,
  educationLevel,
  hasPostalCode,
} = {}) {
  trackIfConsented('demographics_completed', {
    gender:           gender           ?? null,
    age_range:        ageRange         ?? null,
    commune_type:     communeType      ?? null,
    employment_status: employmentStatus ?? null,
    education_level:  educationLevel   ?? null,
    has_postal_code:  hasPostalCode    ?? false,
  });
}

/**
 * User skips the onboarding demographics form.
 */
export function trackDemographicsSkipped() {
  track('demographics_skipped');
}

// ── Content engagement ────────────────────────────────────────────────────────

/**
 * User opens a concept explainer modal from the questionnaire.
 * @param {{ conceptKey: string, questionIndex: number }} props
 */
export function trackConceptOpened({ conceptKey, questionIndex } = {}) {
  track('concept_opened', {
    concept_key:    conceptKey    ?? null,
    question_index: questionIndex ?? null,
  });
}

/**
 * User opens the Beginner / explainer page.
 * @param {{ section: string }} props
 */
export function trackBeginnerOpened({ section } = {}) {
  track('beginner_opened', { section: section ?? null });
}

/**
 * User opens or closes a question's "Comprendre cet enjeu" explanation panel.
 * No opinion payload (no answer value) — not consent-gated, same rubric as trackConceptOpened.
 * @param {{ questionId: string, theme: string, open: boolean }} props
 */
export function trackExplanationToggled({ questionId, theme, open } = {}) {
  track('explanation_toggled', {
    question_id: questionId ?? null,
    theme:       theme      ?? null,
    open:        open       ?? false,
  });
}

/**
 * User clicks an inline Academy concept link inside a question's explanation.
 * Opens Poliscop Academy in a new tab; carries only topic identifiers, never
 * the user's answer — not consent-gated, same rubric as trackConceptOpened.
 * @param {{ conceptId: string, questionId: string, theme: string, position: number|null }} props
 */
export function trackAcademyConceptClicked({ conceptId, questionId, theme, position } = {}) {
  track('academy_concept_clicked', {
    concept_id:  conceptId  ?? null,
    question_id: questionId ?? null,
    theme:       theme      ?? null,
    position:    position   ?? null,
  });
}

// ── Quiz micro-events ─────────────────────────────────────────────────────────

/**
 * User answers a question in the questionnaire.
 * Fires on FIRST answer to each question (not on re-selection).
 * Consent-gated: `value` is the political answer itself (GDPR Article 9 data),
 * not just behavioral metadata — do not remove this gate to "simplify" the funnel.
 * @param {{ questionId: string, theme: string, value: 1|2|3|4|5, questionIndex: number, mode: string|null, isImprove: boolean }} props
 */
export function trackQuestionAnswered({ questionId, theme, value, questionIndex, mode, isImprove } = {}) {
  trackIfConsented('question_answered', {
    question_id:    questionId    ?? null,
    theme:          theme         ?? null,
    value:          value         ?? null,
    question_index: questionIndex ?? null,
    mode:           mode          ?? null,
    is_improve:     isImprove     ?? false,
  });
}

/**
 * User skips a question without answering.
 * Consent-gated: theme is a (weak) signal of which political topics a person avoids.
 * @param {{ questionId: string, theme: string, questionIndex: number, mode: string|null }} props
 */
export function trackQuestionSkipped({ questionId, theme, questionIndex, mode } = {}) {
  trackIfConsented('question_skipped', {
    question_id:    questionId    ?? null,
    theme:          theme         ?? null,
    question_index: questionIndex ?? null,
    mode:           mode          ?? null,
  });
}

// ── Retention ─────────────────────────────────────────────────────────────────

/**
 * User resets their profile and starts over.
 * Product stickiness / retake signal.
 */
export function trackRetakeStarted() {
  track('retake_started');
}

// ── Share funnel ──────────────────────────────────────────────────────────────

/**
 * User opens the share modal (intent, before taking any action).
 * Consent-gated: carries archetype_id, derived political-opinion data.
 * @param {{ archetypeId: string|null }} props
 */
export function trackShareModalOpened({ archetypeId } = {}) {
  trackIfConsented('share_modal_opened', {
    archetype_id: archetypeId ?? null,
  });
}

// ── Feature adoption ──────────────────────────────────────────────────────────

/**
 * User confirms their priority ranking on the PriorityRanking page.
 * Consent-gated: which themes someone weighs most is itself a values signal.
 * @param {{ priorityOrder: string[] }} props
 */
export function trackPriorityCompleted({ priorityOrder } = {}) {
  trackIfConsented('priority_ranking_completed', {
    priority_order: priorityOrder ?? null,
  });
}

// ── Content engagement ────────────────────────────────────────────────────────

/**
 * User views a candidate profile page.
 * @param {{ candidateId: string }} props
 */
export function trackCandidateViewed({ candidateId } = {}) {
  track('candidate_viewed', {
    candidate_id: candidateId ?? null,
  });
}

/**
 * User views an election detail page.
 * @param {{ electionId: string }} props
 */
export function trackElectionViewed({ electionId } = {}) {
  track('election_viewed', {
    election_id: electionId ?? null,
  });
}

/**
 * User views a historical or French figure profile.
 * @param {{ figureId: string, section: 'historical'|'french' }} props
 */
export function trackFigureViewed({ figureId, section } = {}) {
  track('historical_figure_viewed', {
    figure_id: figureId ?? null,
    section:   section  ?? null,
  });
}

/**
 * User initiates a candidate comparison.
 * @param {{ id1: string, id2: string }} props
 */
export function trackCompareStarted({ id1, id2 } = {}) {
  track('compare_started', {
    candidate_id_1: id1 ?? null,
    candidate_id_2: id2 ?? null,
  });
}
