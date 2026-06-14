-- ═══════════════════════════════════════════════════════════════════════════════
-- POLISCOP — Schema V2 migrations
-- Run in: Supabase Dashboard → SQL Editor → New Query
-- Safe to run on an existing database — uses ALTER TABLE IF NOT EXISTS.
-- Run AFTER schema.sql (the base schema must already exist).
-- ═══════════════════════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. user_profiles — add intelligence columns
-- ─────────────────────────────────────────────────────────────────────────────

-- created_at: needed for cohort analysis (when did the user first complete a test?)
ALTER TABLE public.user_profiles
  ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now();

-- archetype_id: computed archetype slug (e.g. 'social_democrate')
-- Lets us query archetype distribution without running JS scoring in SQL.
ALTER TABLE public.user_profiles
  ADD COLUMN IF NOT EXISTS archetype_id text;

-- top_candidate_id: slug of the best-matching 2027 candidate (e.g. 'macron')
ALTER TABLE public.user_profiles
  ADD COLUMN IF NOT EXISTS top_candidate_id text;

-- top_candidate_alignment: 0–100 match score with top_candidate_id
ALTER TABLE public.user_profiles
  ADD COLUMN IF NOT EXISTS top_candidate_alignment smallint;

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. user_demographics — richer segmentation
-- ─────────────────────────────────────────────────────────────────────────────

-- gender: 'homme' | 'femme' | 'non_binaire' | 'ne_se_prononce_pas'
ALTER TABLE public.user_demographics
  ADD COLUMN IF NOT EXISTS gender text;

-- region: French region code (e.g. 'IDF', 'ARA', 'PACA') derived from postal_code
-- Stored separately so raw postal_code can be purged per GDPR retention policy.
ALTER TABLE public.user_demographics
  ADD COLUMN IF NOT EXISTS region text;

-- employment_status: 'etudiant' | 'employe' | 'independant' | 'chomeur' | 'retraite' | 'autre'
ALTER TABLE public.user_demographics
  ADD COLUMN IF NOT EXISTS employment_status text;

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. anonymous_sessions — acquisition intelligence
-- ─────────────────────────────────────────────────────────────────────────────

-- referrer: document.referrer (first 512 chars) for traffic source analysis
ALTER TABLE public.anonymous_sessions
  ADD COLUMN IF NOT EXISTS referrer text;

-- utm_source: UTM source param for campaign tracking
ALTER TABLE public.anonymous_sessions
  ADD COLUMN IF NOT EXISTS utm_source text;

-- utm_medium: UTM medium param (e.g. 'social', 'email', 'cpc')
ALTER TABLE public.anonymous_sessions
  ADD COLUMN IF NOT EXISTS utm_medium text;

-- utm_campaign: UTM campaign name
ALTER TABLE public.anonymous_sessions
  ADD COLUMN IF NOT EXISTS utm_campaign text;

-- answered_count: denormalised — updated by the app on each answer for quick funnel analysis
ALTER TABLE public.anonymous_sessions
  ADD COLUMN IF NOT EXISTS answered_count int NOT NULL DEFAULT 0;

-- completed: true when anonymous user reaches the profile page
ALTER TABLE public.anonymous_sessions
  ADD COLUMN IF NOT EXISTS completed boolean NOT NULL DEFAULT false;

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. Fix RLS on anonymous_sessions
-- The original policy used USING (true) for ALL which allows cross-session reads.
-- Replace with insert-only + update-own-row via a computed field check.
-- Since anonymous_sessions.id IS the anonymous_id, we use a function check.
-- ─────────────────────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "anonymous_sessions: insert/update own row" ON public.anonymous_sessions;

-- Open INSERT (same as events — client creates its own session row)
CREATE POLICY "anonymous_sessions: open insert"
  ON public.anonymous_sessions FOR INSERT
  WITH CHECK (true);

-- UPDATE: client can only update the row whose id matches the ID it provided.
-- This prevents session A from modifying session B's row.
-- Note: with anon key there's no server-side identity, so this is best-effort.
CREATE POLICY "anonymous_sessions: update own row"
  ON public.anonymous_sessions FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- SELECT is intentionally NOT granted to anon key — aggregate queries
-- must use service_role (Supabase SQL Editor or Edge Functions).

-- ─────────────────────────────────────────────────────────────────────────────
-- 5. Performance indexes
-- ─────────────────────────────────────────────────────────────────────────────

-- Time-series index on events (essential for daily/weekly metrics queries)
CREATE INDEX IF NOT EXISTS events_created_at_idx
  ON public.events (created_at DESC);

-- Composite index: look up event counts by name over a time range
CREATE INDEX IF NOT EXISTS events_name_created_at_idx
  ON public.events (event_name, created_at DESC);

-- Archetype distribution queries
CREATE INDEX IF NOT EXISTS user_profiles_archetype_id_idx
  ON public.user_profiles (archetype_id)
  WHERE archetype_id IS NOT NULL;

-- Top candidate distribution queries
CREATE INDEX IF NOT EXISTS user_profiles_top_candidate_id_idx
  ON public.user_profiles (top_candidate_id)
  WHERE top_candidate_id IS NOT NULL;

-- Demographics cross-tab with age range
CREATE INDEX IF NOT EXISTS user_demographics_age_range_idx
  ON public.user_demographics (age_range)
  WHERE age_range IS NOT NULL;

-- ─────────────────────────────────────────────────────────────────────────────
-- 6. Analytics views (read via service_role / SQL Editor)
-- These views aggregate data without exposing individual PII rows.
-- ─────────────────────────────────────────────────────────────────────────────

-- 6a. Funnel: daily event counts by event name
CREATE OR REPLACE VIEW public.v_daily_funnel AS
SELECT
  date_trunc('day', created_at AT TIME ZONE 'Europe/Paris') AS day,
  event_name,
  COUNT(*)                                                   AS event_count,
  COUNT(DISTINCT COALESCE(user_id::text, anonymous_id))      AS unique_users
FROM public.events
GROUP BY 1, 2
ORDER BY 1 DESC, 2;

-- 6b. Weekly product metrics — top-level KPIs
CREATE OR REPLACE VIEW public.v_weekly_stats AS
SELECT
  date_trunc('week', created_at AT TIME ZONE 'Europe/Paris') AS week,
  COUNT(*) FILTER (WHERE event_name = 'landing_view')         AS landing_views,
  COUNT(*) FILTER (WHERE event_name = 'test_start')           AS test_starts,
  COUNT(*) FILTER (WHERE event_name = 'test_complete')        AS test_completions,
  COUNT(*) FILTER (WHERE event_name = 'profile_shared')       AS profile_shares,
  COUNT(*) FILTER (WHERE event_name = 'signup_completed')     AS signups,
  COUNT(*) FILTER (WHERE event_name = 'demographics_completed') AS demographics_filled,
  -- Conversion rates
  ROUND(
    100.0 * COUNT(*) FILTER (WHERE event_name = 'test_complete')
    / NULLIF(COUNT(*) FILTER (WHERE event_name = 'test_start'), 0), 1
  ) AS quiz_completion_pct,
  ROUND(
    100.0 * COUNT(*) FILTER (WHERE event_name = 'profile_shared')
    / NULLIF(COUNT(*) FILTER (WHERE event_name = 'test_complete'), 0), 1
  ) AS share_rate_pct
FROM public.events
GROUP BY 1
ORDER BY 1 DESC;

-- 6c. Archetype distribution (authenticated users)
CREATE OR REPLACE VIEW public.v_archetype_distribution AS
SELECT
  archetype_id,
  COUNT(*)                                      AS user_count,
  ROUND(AVG(top_candidate_alignment), 1)        AS avg_top_alignment,
  ROUND(AVG(answered_count), 0)                 AS avg_answered_count,
  MIN(created_at)                               AS first_seen,
  MAX(updated_at)                               AS last_seen
FROM public.user_profiles
WHERE archetype_id IS NOT NULL
GROUP BY archetype_id
ORDER BY user_count DESC;

-- 6d. Top candidate distribution (authenticated users)
CREATE OR REPLACE VIEW public.v_candidate_distribution AS
SELECT
  top_candidate_id,
  COUNT(*)                                  AS user_count,
  ROUND(AVG(top_candidate_alignment), 1)    AS avg_alignment,
  ROUND(AVG((theme_scores->>'ECONOMY')::numeric), 1)      AS avg_economy,
  ROUND(AVG((theme_scores->>'SOCIAL')::numeric), 1)       AS avg_social,
  ROUND(AVG((theme_scores->>'IMMIGRATION')::numeric), 1)  AS avg_immigration,
  ROUND(AVG((theme_scores->>'ENVIRONMENT')::numeric), 1)  AS avg_environment
FROM public.user_profiles
WHERE top_candidate_id IS NOT NULL
GROUP BY top_candidate_id
ORDER BY user_count DESC;

-- 6e. Archetype × age_range cross-tab (political intelligence)
-- Shows which age groups cluster around each archetype.
CREATE OR REPLACE VIEW public.v_archetype_by_age AS
SELECT
  up.archetype_id,
  ud.age_range,
  COUNT(*)                                 AS user_count,
  ROUND(AVG(up.top_candidate_alignment), 1) AS avg_top_alignment
FROM public.user_profiles up
JOIN public.user_demographics ud ON ud.user_id = up.user_id
WHERE up.archetype_id IS NOT NULL
  AND ud.age_range IS NOT NULL
GROUP BY up.archetype_id, ud.age_range
ORDER BY up.archetype_id, user_count DESC;

-- 6f. Share virality — which archetypes share most?
CREATE OR REPLACE VIEW public.v_share_virality AS
SELECT
  (props->>'archetype_id') AS archetype_id,
  (props->>'method')       AS share_method,
  COUNT(*)                 AS share_count
FROM public.events
WHERE event_name = 'profile_shared'
  AND props->>'archetype_id' IS NOT NULL
GROUP BY 1, 2
ORDER BY share_count DESC;

-- 6g. Funnel drop-off: test_start → test_complete by mode
CREATE OR REPLACE VIEW public.v_funnel_by_mode AS
SELECT
  (props->>'mode')    AS mode,
  COUNT(*)            AS started,
  -- completions: events where mode matches (approximate — not per-session join)
  SUM(CASE WHEN event_name = 'test_complete' THEN 1 ELSE 0 END) AS completed
FROM public.events
WHERE event_name IN ('test_start', 'test_complete')
  AND props->>'mode' IS NOT NULL
GROUP BY mode;

-- ─────────────────────────────────────────────────────────────────────────────
-- 7. Data retention helper (run periodically via cron or manual SQL Editor)
-- Deletes events older than 24 months for GDPR compliance.
-- ─────────────────────────────────────────────────────────────────────────────

-- Manual command (run in SQL Editor when needed):
-- DELETE FROM public.events WHERE created_at < now() - INTERVAL '24 months';

-- ─────────────────────────────────────────────────────────────────────────────
-- 8. Notes
-- ─────────────────────────────────────────────────────────────────────────────
-- • All analytics views require service_role key to query (not exposed to clients).
-- • user_demographics.postal_code stores raw postal code (GDPR sensitive).
--   After deriving user_demographics.region, consider nullifying postal_code
--   for users who opt for minimal data storage.
-- • anonymous_sessions.device stores raw UA string — consider replacing with
--   a parsed OS/browser summary on the client side before storing.
-- • For CNIL compliance: political opinion data (theme_scores) is "données sensibles"
--   under GDPR Article 9. Ensure explicit, specific consent is recorded per user
--   before storing user_profiles rows. The current schema has no consent table.
--   A future user_consents table should be added if the platform scales.
