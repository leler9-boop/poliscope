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
 */

import { track } from './anonymous.js';

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
 * @param {{ answeredCount: number, archetypeId: string|null, topCandidateId: string|null }} props
 */
export function trackProfileViewed({ answeredCount, archetypeId, topCandidateId } = {}) {
  track('profile_viewed', {
    answered_count:   answeredCount  ?? null,
    archetype_id:     archetypeId   ?? null,
    top_candidate_id: topCandidateId ?? null,
  });
}

/**
 * User shares their profile card (image or link).
 * @param {{ method: 'native'|'copy'|'download', archetypeId: string|null, topCandidateId: string|null, topCandidateAlignment: number|null }} props
 */
export function trackProfileShared({ method, archetypeId, topCandidateId, topCandidateAlignment } = {}) {
  track('profile_shared', {
    method:                  method                ?? null,
    archetype_id:            archetypeId           ?? null,
    top_candidate_id:        topCandidateId        ?? null,
    top_candidate_alignment: topCandidateAlignment ?? null,
  });
}

/**
 * User downloads their profile image (save to camera roll / file).
 * @param {{ archetypeId: string|null }} props
 */
export function trackProfileDownloaded({ archetypeId } = {}) {
  track('profile_downloaded', {
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
 * @param {{ ageRange: string|null, educationLevel: string|null, hasPostalCode: boolean }} props
 */
export function trackDemographicsCompleted({ ageRange, educationLevel, hasPostalCode } = {}) {
  track('demographics_completed', {
    age_range:       ageRange       ?? null,
    education_level: educationLevel ?? null,
    has_postal_code: hasPostalCode  ?? false,
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

// ── Quiz micro-events ─────────────────────────────────────────────────────────

/**
 * User answers a question in the questionnaire.
 * Fires on FIRST answer to each question (not on re-selection).
 * This is the most valuable event — enables dropout analysis, controversy scoring,
 * and per-question political distribution.
 * @param {{ questionId: string, theme: string, value: 1|2|3|4|5, questionIndex: number, mode: string|null, isImprove: boolean }} props
 */
export function trackQuestionAnswered({ questionId, theme, value, questionIndex, mode, isImprove } = {}) {
  track('question_answered', {
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
 * Signals friction or topic discomfort.
 * @param {{ questionId: string, theme: string, questionIndex: number, mode: string|null }} props
 */
export function trackQuestionSkipped({ questionId, theme, questionIndex, mode } = {}) {
  track('question_skipped', {
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
 * Enables measuring modal open → actual share conversion.
 * @param {{ archetypeId: string|null }} props
 */
export function trackShareModalOpened({ archetypeId } = {}) {
  track('share_modal_opened', {
    archetype_id: archetypeId ?? null,
  });
}

// ── Feature adoption ──────────────────────────────────────────────────────────

/**
 * User confirms their priority ranking on the PriorityRanking page.
 * Measures feature adoption: what % of users customise priorities?
 * @param {{ priorityOrder: string[] }} props
 */
export function trackPriorityCompleted({ priorityOrder } = {}) {
  track('priority_ranking_completed', {
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
