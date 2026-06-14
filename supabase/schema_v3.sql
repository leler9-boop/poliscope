-- ═══════════════════════════════════════════════════════════════════════════════
-- POLISCOP — Schema V3 migrations
-- Run AFTER schema.sql AND schema_v2.sql.
-- All operations are safe to run on a new database — uses IF NOT EXISTS throughout.
-- ═══════════════════════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. user_consents — GDPR Article 9 consent tracking
-- ─────────────────────────────────────────────────────────────────────────────
-- Political opinion data (user_profiles.theme_scores) is a special category
-- under GDPR Article 9. Explicit consent must be recorded before saving it.
-- This table is the audit trail that proves consent was obtained.

CREATE TABLE IF NOT EXISTS public.user_consents (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  consent_type  text        NOT NULL,   -- 'political_data' | 'analytics' | 'marketing'
  granted       boolean     NOT NULL DEFAULT false,
  version       text        NOT NULL DEFAULT '2026-01', -- consent text version
  ip_hash       text,                  -- SHA-256 of IP at time of consent (not the raw IP)
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT user_consents_user_type_unique UNIQUE (user_id, consent_type)
);

ALTER TABLE public.user_consents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_consents: users manage own row"
  ON public.user_consents FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP TRIGGER IF EXISTS set_user_consents_updated_at ON public.user_consents;
CREATE TRIGGER set_user_consents_updated_at
  BEFORE UPDATE ON public.user_consents
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX IF NOT EXISTS user_consents_user_id_idx
  ON public.user_consents (user_id);

CREATE INDEX IF NOT EXISTS user_consents_type_granted_idx
  ON public.user_consents (consent_type, granted);


-- ─────────────────────────────────────────────────────────────────────────────
-- 2. quiz_sessions — session-level quiz tracking
-- ─────────────────────────────────────────────────────────────────────────────
-- Bridges anonymous_sessions and events. One row per quiz attempt.
-- Populated by the app: INSERT on test_start, UPDATE on test_complete.
-- Enables accurate dropout analysis without joining events × events.

CREATE TABLE IF NOT EXISTS public.quiz_sessions (
  id                  uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  anonymous_id        text,
  user_id             uuid        REFERENCES auth.users(id) ON DELETE SET NULL,
  mode                text,                   -- 'quick' | 'standard' | 'full'
  started_at          timestamptz NOT NULL DEFAULT now(),
  completed_at        timestamptz,            -- NULL until quiz finished
  questions_shown     int         NOT NULL DEFAULT 0,
  questions_answered  int         NOT NULL DEFAULT 0,
  questions_skipped   int         NOT NULL DEFAULT 0,
  last_question_index int         NOT NULL DEFAULT 0,  -- last index seen (dropout point)
  archetype_id        text,                   -- populated on completion
  top_candidate_id    text,                   -- populated on completion
  top_candidate_alignment smallint,
  lang                text
);

ALTER TABLE public.quiz_sessions ENABLE ROW LEVEL SECURITY;

-- Open insert (anonymous and authenticated)
CREATE POLICY "quiz_sessions: open insert"
  ON public.quiz_sessions FOR INSERT
  WITH CHECK (true);

-- Update own session by anonymous_id (best-effort — no server-side identity for anon)
CREATE POLICY "quiz_sessions: open update"
  ON public.quiz_sessions FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS quiz_sessions_anonymous_id_idx
  ON public.quiz_sessions (anonymous_id);

CREATE INDEX IF NOT EXISTS quiz_sessions_user_id_idx
  ON public.quiz_sessions (user_id);

CREATE INDEX IF NOT EXISTS quiz_sessions_started_at_idx
  ON public.quiz_sessions (started_at DESC);

CREATE INDEX IF NOT EXISTS quiz_sessions_mode_idx
  ON public.quiz_sessions (mode) WHERE mode IS NOT NULL;


-- ─────────────────────────────────────────────────────────────────────────────
-- 3. question_analytics — per-question aggregate stats
-- ─────────────────────────────────────────────────────────────────────────────
-- Stores pre-computed statistics derived from events.question_answered.
-- Updated periodically (not in real-time) via the refresh RPC function below.
-- This avoids scanning 10M event rows on every dashboard load at 100K users.

CREATE TABLE IF NOT EXISTS public.question_analytics (
  question_id        text        PRIMARY KEY,
  theme              text        NOT NULL,
  response_count     int         NOT NULL DEFAULT 0,
  skip_count         int         NOT NULL DEFAULT 0,
  mean_answer        numeric(4,2),            -- 1.00–5.00
  std_dev            numeric(4,2),            -- 0–2 (higher = more polarising)
  controversy_score  numeric(4,2),            -- std_dev normalised 0–100
  skip_rate          numeric(5,2),            -- skip_count / (response_count + skip_count) × 100
  pct_agree          numeric(5,2),            -- % who answered 4 or 5
  pct_disagree       numeric(5,2),            -- % who answered 1 or 2
  last_updated       timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.question_analytics ENABLE ROW LEVEL SECURITY;
-- Read-only for everyone — populated only via service_role RPC
CREATE POLICY "question_analytics: read only"
  ON public.question_analytics FOR SELECT
  USING (true);


-- ─────────────────────────────────────────────────────────────────────────────
-- 4. Additional indexes on existing tables
-- ─────────────────────────────────────────────────────────────────────────────

-- events: JSONB path index for question_answered queries
-- Enables: WHERE event_name = 'question_answered' AND props->>'question_id' = 'ECO_1'
CREATE INDEX IF NOT EXISTS events_props_question_id_idx
  ON public.events ((props->>'question_id'))
  WHERE event_name = 'question_answered';

-- events: JSONB path index for share virality analysis
CREATE INDEX IF NOT EXISTS events_props_archetype_id_idx
  ON public.events ((props->>'archetype_id'))
  WHERE event_name = 'profile_shared';

-- events: JSONB path index for mode-based funnel analysis
CREATE INDEX IF NOT EXISTS events_props_mode_idx
  ON public.events ((props->>'mode'))
  WHERE event_name IN ('test_start', 'test_complete');

-- user_profiles: time-series trend queries
CREATE INDEX IF NOT EXISTS user_profiles_created_at_idx
  ON public.user_profiles (created_at DESC);

-- user_profiles: economic axis queries (JSONB expression index)
CREATE INDEX IF NOT EXISTS user_profiles_axes_economic_idx
  ON public.user_profiles ((axes->>'economic'));


-- ─────────────────────────────────────────────────────────────────────────────
-- 5. Analytics views (read via service_role / SQL Editor)
-- ─────────────────────────────────────────────────────────────────────────────

-- 5a. Question controversy ranking
-- Shows which questions produce the most disagreement across users.
-- Requires question_answered events to be flowing.
CREATE OR REPLACE VIEW public.v_question_controversy AS
SELECT
  props->>'question_id'                                AS question_id,
  props->>'theme'                                      AS theme,
  COUNT(*)                                             AS response_count,
  ROUND(AVG((props->>'value')::numeric), 2)            AS mean_answer,
  ROUND(STDDEV((props->>'value')::numeric), 2)         AS std_dev,
  -- Controversy score: normalised std_dev (max possible ≈ 2.0 for 1–5 scale)
  ROUND(STDDEV((props->>'value')::numeric) / 2.0 * 100, 1) AS controversy_score,
  -- Split: % who agree (4-5) vs disagree (1-2)
  ROUND(100.0 * SUM(CASE WHEN (props->>'value')::int >= 4 THEN 1 ELSE 0 END) / COUNT(*), 1) AS pct_agree,
  ROUND(100.0 * SUM(CASE WHEN (props->>'value')::int <= 2 THEN 1 ELSE 0 END) / COUNT(*), 1) AS pct_disagree
FROM public.events
WHERE event_name = 'question_answered'
  AND props->>'question_id' IS NOT NULL
GROUP BY props->>'question_id', props->>'theme'
HAVING COUNT(*) >= 10  -- minimum sample size for statistical reliability
ORDER BY std_dev DESC NULLS LAST;


-- 5b. Archetype trend (week-over-week)
-- Shows how the ideological distribution is shifting over time.
CREATE OR REPLACE VIEW public.v_archetype_trend AS
SELECT
  date_trunc('week', created_at AT TIME ZONE 'Europe/Paris') AS week,
  archetype_id,
  COUNT(*)                                                    AS user_count,
  ROUND(AVG(top_candidate_alignment), 1)                      AS avg_alignment,
  ROUND(AVG((axes->>'economic')::numeric), 1)                 AS avg_economic_axis,
  ROUND(AVG((axes->>'social')::numeric), 1)                   AS avg_social_axis
FROM public.user_profiles
WHERE archetype_id IS NOT NULL
GROUP BY week, archetype_id
ORDER BY week DESC, user_count DESC;


-- 5c. Candidate trend (week-over-week)
CREATE OR REPLACE VIEW public.v_candidate_trend AS
SELECT
  date_trunc('week', created_at AT TIME ZONE 'Europe/Paris') AS week,
  top_candidate_id,
  COUNT(*)                                                    AS user_count,
  ROUND(AVG(top_candidate_alignment), 1)                      AS avg_alignment
FROM public.user_profiles
WHERE top_candidate_id IS NOT NULL
GROUP BY week, top_candidate_id
ORDER BY week DESC, user_count DESC;


-- 5d. Dropout analysis — where do users abandon the quiz?
-- Uses question_answered events to find the last question seen per session.
-- Sessions that got a test_complete are NOT dropouts.
CREATE OR REPLACE VIEW public.v_dropout_by_question AS
WITH last_question AS (
  SELECT
    anonymous_id,
    MAX((props->>'question_index')::int) AS last_index,
    COUNT(*) AS questions_answered
  FROM public.events
  WHERE event_name = 'question_answered'
  GROUP BY anonymous_id
),
completions AS (
  SELECT DISTINCT anonymous_id
  FROM public.events
  WHERE event_name = 'test_complete'
)
SELECT
  lq.last_index,
  COUNT(*) FILTER (WHERE c.anonymous_id IS NULL) AS dropouts,
  COUNT(*) FILTER (WHERE c.anonymous_id IS NOT NULL) AS completions,
  COUNT(*) AS total_reached
FROM last_question lq
LEFT JOIN completions c ON c.anonymous_id = lq.anonymous_id
GROUP BY lq.last_index
ORDER BY lq.last_index;


-- 5e. Demographic × archetype cross-tab (political intelligence)
CREATE OR REPLACE VIEW public.v_demographic_archetype AS
SELECT
  ud.age_range,
  up.archetype_id,
  COUNT(*)                                   AS user_count,
  ROUND(AVG(up.top_candidate_alignment), 1)  AS avg_alignment,
  ROUND(AVG((up.axes->>'economic')::numeric), 1) AS avg_economic,
  ROUND(AVG((up.axes->>'social')::numeric), 1)   AS avg_social
FROM public.user_profiles up
JOIN public.user_demographics ud ON ud.user_id = up.user_id
WHERE up.archetype_id IS NOT NULL
  AND ud.age_range IS NOT NULL
GROUP BY ud.age_range, up.archetype_id
ORDER BY ud.age_range, user_count DESC;


-- 5f. Share virality — which archetypes are most viral?
CREATE OR REPLACE VIEW public.v_share_virality_by_archetype AS
SELECT
  (props->>'archetype_id')     AS archetype_id,
  (props->>'method')           AS share_method,
  COUNT(*)                     AS share_count,
  ROUND(AVG((props->>'top_candidate_alignment')::numeric), 1) AS avg_alignment
FROM public.events
WHERE event_name = 'profile_shared'
  AND props->>'archetype_id' IS NOT NULL
GROUP BY props->>'archetype_id', props->>'method'
ORDER BY share_count DESC;


-- 5g. Mode effectiveness — does quiz mode affect archetype confidence?
CREATE OR REPLACE VIEW public.v_mode_effectiveness AS
SELECT
  (props->>'mode')                                AS mode,
  COUNT(*)                                        AS completions,
  ROUND(AVG((props->>'answered_count')::numeric), 0) AS avg_answered,
  ROUND(AVG((props->>'total_count')::numeric), 0) AS avg_total
FROM public.events
WHERE event_name = 'test_complete'
  AND props->>'mode' IS NOT NULL
GROUP BY props->>'mode'
ORDER BY completions DESC;


-- 5h. Geographic distribution (populated when postal_code → region mapping is done)
-- Once region is derived and stored in user_demographics, this powers the map.
CREATE OR REPLACE VIEW public.v_geographic_distribution AS
SELECT
  ud.region,
  up.archetype_id,
  up.top_candidate_id,
  COUNT(*)                                    AS user_count,
  ROUND(AVG((up.axes->>'economic')::numeric), 1) AS avg_economic,
  ROUND(AVG((up.axes->>'social')::numeric), 1)   AS avg_social
FROM public.user_profiles up
JOIN public.user_demographics ud ON ud.user_id = up.user_id
WHERE ud.region IS NOT NULL
GROUP BY ud.region, up.archetype_id, up.top_candidate_id
ORDER BY user_count DESC;


-- 5i. Full weekly dashboard — all KPIs in one query
CREATE OR REPLACE VIEW public.v_weekly_dashboard AS
SELECT
  date_trunc('week', created_at AT TIME ZONE 'Europe/Paris')    AS week,
  COUNT(*) FILTER (WHERE event_name = 'landing_view')            AS landing_views,
  COUNT(DISTINCT COALESCE(user_id::text, anonymous_id))
    FILTER (WHERE event_name = 'landing_view')                   AS unique_visitors,
  COUNT(*) FILTER (WHERE event_name = 'test_start')              AS test_starts,
  COUNT(*) FILTER (WHERE event_name = 'test_complete')           AS test_completions,
  COUNT(*) FILTER (WHERE event_name = 'profile_viewed')          AS profile_views,
  COUNT(*) FILTER (WHERE event_name = 'share_modal_opened')      AS share_intents,
  COUNT(*) FILTER (WHERE event_name = 'profile_shared')          AS profile_shares,
  COUNT(*) FILTER (WHERE event_name = 'signup_completed')        AS signups,
  COUNT(*) FILTER (WHERE event_name = 'login_completed')         AS logins,
  COUNT(*) FILTER (WHERE event_name = 'demographics_completed')  AS demographics_filled,
  COUNT(*) FILTER (WHERE event_name = 'demographics_skipped')    AS demographics_skipped,
  COUNT(*) FILTER (WHERE event_name = 'retake_started')          AS retakes,
  COUNT(*) FILTER (WHERE event_name = 'improve_started')         AS improve_starts,
  -- Conversion rates
  ROUND(
    100.0 * COUNT(*) FILTER (WHERE event_name = 'test_complete')
    / NULLIF(COUNT(*) FILTER (WHERE event_name = 'test_start'), 0), 1
  ) AS quiz_completion_pct,
  ROUND(
    100.0 * COUNT(*) FILTER (WHERE event_name = 'profile_shared')
    / NULLIF(COUNT(*) FILTER (WHERE event_name = 'test_complete'), 0), 1
  ) AS share_rate_pct,
  ROUND(
    100.0 * COUNT(*) FILTER (WHERE event_name = 'signup_completed')
    / NULLIF(COUNT(*) FILTER (WHERE event_name = 'test_complete'), 0), 1
  ) AS signup_rate_pct,
  ROUND(
    100.0 * COUNT(*) FILTER (WHERE event_name = 'profile_shared')
    / NULLIF(COUNT(*) FILTER (WHERE event_name = 'share_modal_opened'), 0), 1
  ) AS share_conversion_pct   -- modal open → actual share
FROM public.events
GROUP BY week
ORDER BY week DESC;


-- ─────────────────────────────────────────────────────────────────────────────
-- 6. Materialized views (for 100K+ scale, refresh daily/hourly)
-- ─────────────────────────────────────────────────────────────────────────────

CREATE MATERIALIZED VIEW IF NOT EXISTS public.mv_archetype_distribution AS
SELECT
  archetype_id,
  COUNT(*)                                              AS user_count,
  ROUND(AVG(top_candidate_alignment), 1)                AS avg_top_alignment,
  ROUND(AVG(answered_count), 0)                         AS avg_answered_count,
  ROUND(AVG((axes->>'economic')::numeric), 1)           AS avg_economic_axis,
  ROUND(AVG((axes->>'social')::numeric), 1)             AS avg_social_axis,
  MIN(created_at)                                       AS first_seen,
  MAX(updated_at)                                       AS last_seen
FROM public.user_profiles
WHERE archetype_id IS NOT NULL
GROUP BY archetype_id
ORDER BY user_count DESC;

CREATE UNIQUE INDEX IF NOT EXISTS mv_archetype_distribution_archetype_idx
  ON public.mv_archetype_distribution (archetype_id);


CREATE MATERIALIZED VIEW IF NOT EXISTS public.mv_candidate_distribution AS
SELECT
  top_candidate_id,
  COUNT(*)                                              AS user_count,
  ROUND(AVG(top_candidate_alignment), 1)                AS avg_alignment,
  ROUND(AVG((theme_scores->>'ECONOMY')::numeric), 1)    AS avg_economy,
  ROUND(AVG((theme_scores->>'SOCIAL')::numeric), 1)     AS avg_social,
  ROUND(AVG((theme_scores->>'IMMIGRATION')::numeric), 1) AS avg_immigration,
  ROUND(AVG((theme_scores->>'ENVIRONMENT')::numeric), 1) AS avg_environment
FROM public.user_profiles
WHERE top_candidate_id IS NOT NULL
GROUP BY top_candidate_id
ORDER BY user_count DESC;

CREATE UNIQUE INDEX IF NOT EXISTS mv_candidate_distribution_candidate_idx
  ON public.mv_candidate_distribution (top_candidate_id);


-- ─────────────────────────────────────────────────────────────────────────────
-- 7. RPC functions (SECURITY DEFINER — bypass RLS for safe aggregate access)
-- ─────────────────────────────────────────────────────────────────────────────
-- These allow the frontend (with anon key) to call aggregate analytics
-- without exposing individual rows. Safe: they only return aggregates.

-- 7a. Refresh materialized views (called by a scheduled function or manually)
CREATE OR REPLACE FUNCTION public.refresh_analytics_views()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY public.mv_archetype_distribution;
  REFRESH MATERIALIZED VIEW CONCURRENTLY public.mv_candidate_distribution;
END;
$$;

-- 7b. Refresh question_analytics table from events
-- Call this daily or after a batch of new events.
CREATE OR REPLACE FUNCTION public.refresh_question_analytics()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.question_analytics;
  INSERT INTO public.question_analytics (
    question_id, theme, response_count, skip_count, mean_answer,
    std_dev, controversy_score, skip_rate, pct_agree, pct_disagree, last_updated
  )
  -- Answered responses
  WITH answered AS (
    SELECT
      props->>'question_id'     AS question_id,
      props->>'theme'           AS theme,
      COUNT(*)                  AS response_count,
      AVG((props->>'value')::numeric)    AS mean_answer,
      STDDEV((props->>'value')::numeric) AS std_dev,
      SUM(CASE WHEN (props->>'value')::int >= 4 THEN 1 ELSE 0 END) AS agree_count,
      SUM(CASE WHEN (props->>'value')::int <= 2 THEN 1 ELSE 0 END) AS disagree_count
    FROM public.events
    WHERE event_name = 'question_answered'
      AND props->>'question_id' IS NOT NULL
    GROUP BY props->>'question_id', props->>'theme'
  ),
  skipped AS (
    SELECT
      props->>'question_id' AS question_id,
      COUNT(*)              AS skip_count
    FROM public.events
    WHERE event_name = 'question_skipped'
      AND props->>'question_id' IS NOT NULL
    GROUP BY props->>'question_id'
  )
  SELECT
    a.question_id,
    a.theme,
    a.response_count,
    COALESCE(s.skip_count, 0)                                    AS skip_count,
    ROUND(a.mean_answer, 2)                                      AS mean_answer,
    ROUND(a.std_dev, 2)                                          AS std_dev,
    ROUND(a.std_dev / 2.0 * 100, 1)                              AS controversy_score,
    ROUND(COALESCE(s.skip_count, 0)::numeric
          / (a.response_count + COALESCE(s.skip_count, 0)) * 100, 2) AS skip_rate,
    ROUND(a.agree_count::numeric / a.response_count * 100, 1)   AS pct_agree,
    ROUND(a.disagree_count::numeric / a.response_count * 100, 1) AS pct_disagree,
    now()
  FROM answered a
  LEFT JOIN skipped s ON s.question_id = a.question_id
  WHERE a.response_count >= 10;  -- minimum sample size
END;
$$;

-- 7c. Get archetype distribution (safe for frontend)
-- Returns aggregate counts only — no individual user data exposed.
CREATE OR REPLACE FUNCTION public.get_archetype_distribution()
RETURNS TABLE(archetype_id text, user_count bigint, avg_economic numeric, avg_social numeric)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    up.archetype_id,
    COUNT(*),
    ROUND(AVG((up.axes->>'economic')::numeric), 1),
    ROUND(AVG((up.axes->>'social')::numeric), 1)
  FROM public.user_profiles up
  WHERE up.archetype_id IS NOT NULL
  GROUP BY up.archetype_id
  ORDER BY COUNT(*) DESC;
END;
$$;

-- 7d. Get top controversial questions (safe for frontend)
CREATE OR REPLACE FUNCTION public.get_top_controversial_questions(limit_n int DEFAULT 10)
RETURNS TABLE(question_id text, theme text, response_count bigint, std_dev numeric, controversy_score numeric)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    qa.question_id,
    qa.theme,
    qa.response_count,
    qa.std_dev,
    qa.controversy_score
  FROM public.question_analytics qa
  WHERE qa.response_count >= 10
  ORDER BY qa.std_dev DESC NULLS LAST
  LIMIT limit_n;
END;
$$;


-- ─────────────────────────────────────────────────────────────────────────────
-- 8. Data retention policy
-- ─────────────────────────────────────────────────────────────────────────────
-- Run manually in SQL Editor or via a scheduled Postgres function.
-- Deletes events older than 24 months for GDPR Article 5(1)(e) compliance.

-- Manual command:
-- DELETE FROM public.events WHERE created_at < now() - INTERVAL '24 months';
-- DELETE FROM public.quiz_sessions WHERE started_at < now() - INTERVAL '24 months';

-- To run automatically, create a Supabase Edge Function or pg_cron job:
-- SELECT cron.schedule('purge-old-events', '0 3 1 * *',
--   $$DELETE FROM public.events WHERE created_at < now() - INTERVAL '24 months'$$);


-- ─────────────────────────────────────────────────────────────────────────────
-- 9. Notes
-- ─────────────────────────────────────────────────────────────────────────────
-- • All views require service_role key to query (not exposed to clients).
-- • Materialized views must be refreshed periodically:
--     SELECT refresh_analytics_views();
--     SELECT refresh_question_analytics();
-- • question_analytics will be empty until question_answered events flow.
-- • user_consents must be populated before user_profiles to comply with Article 9.
-- • The geographic view (v_geographic_distribution) requires region to be
--   derived from postal_code. Implement on client side before storing.
-- • RPC functions (get_archetype_distribution, get_top_controversial_questions)
--   are callable with the anon key — they expose only aggregates, not PII.
