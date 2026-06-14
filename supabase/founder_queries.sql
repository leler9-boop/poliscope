-- ═══════════════════════════════════════════════════════════════════════════════
-- POLISCOP — Founder Dashboard Queries
-- Run in: Supabase Dashboard → SQL Editor
-- All queries require service_role key (or run in SQL Editor directly).
-- Run schema.sql + schema_v2.sql + schema_v3.sql before using these.
-- ═══════════════════════════════════════════════════════════════════════════════


-- ═══════════════════════════════════════════════
-- SECTION 1 — TRAFFIC & FUNNEL
-- ═══════════════════════════════════════════════

-- 1.1 Weekly overview (run every Monday)
SELECT * FROM v_weekly_dashboard ORDER BY week DESC LIMIT 8;

-- 1.2 All-time funnel summary
SELECT
  SUM(CASE WHEN event_name = 'landing_view'   THEN 1 END) AS total_visitors,
  SUM(CASE WHEN event_name = 'test_start'     THEN 1 END) AS total_starts,
  SUM(CASE WHEN event_name = 'test_complete'  THEN 1 END) AS total_completions,
  SUM(CASE WHEN event_name = 'profile_shared' THEN 1 END) AS total_shares,
  SUM(CASE WHEN event_name = 'signup_completed' THEN 1 END) AS total_signups,
  ROUND(
    100.0 * SUM(CASE WHEN event_name = 'test_complete' THEN 1 END)
    / NULLIF(SUM(CASE WHEN event_name = 'test_start' THEN 1 END), 0), 1
  ) AS completion_pct,
  ROUND(
    100.0 * SUM(CASE WHEN event_name = 'profile_shared' THEN 1 END)
    / NULLIF(SUM(CASE WHEN event_name = 'test_complete' THEN 1 END), 0), 1
  ) AS share_pct
FROM events;

-- 1.3 Daily active users (last 30 days)
SELECT
  DATE(created_at AT TIME ZONE 'Europe/Paris') AS day,
  COUNT(DISTINCT COALESCE(user_id::text, anonymous_id)) AS unique_users,
  COUNT(*) FILTER (WHERE event_name = 'test_start') AS starts,
  COUNT(*) FILTER (WHERE event_name = 'test_complete') AS completions
FROM events
WHERE created_at >= now() - INTERVAL '30 days'
GROUP BY day
ORDER BY day DESC;

-- 1.4 Quiz mode distribution
SELECT
  props->>'mode' AS mode,
  COUNT(*) AS starts,
  ROUND(
    100.0 * SUM(CASE WHEN event_name = 'test_complete' THEN 1 END)
    / NULLIF(COUNT(*) FILTER (WHERE event_name = 'test_start'), 0), 1
  ) AS completion_pct
FROM events
WHERE event_name IN ('test_start', 'test_complete')
  AND props->>'mode' IS NOT NULL
GROUP BY props->>'mode'
ORDER BY starts DESC;

-- 1.5 Share modal open → actual share conversion
SELECT
  COUNT(*) FILTER (WHERE event_name = 'share_modal_opened') AS modal_opens,
  COUNT(*) FILTER (WHERE event_name = 'profile_shared') AS shares,
  ROUND(
    100.0 * COUNT(*) FILTER (WHERE event_name = 'profile_shared')
    / NULLIF(COUNT(*) FILTER (WHERE event_name = 'share_modal_opened'), 0), 1
  ) AS conversion_pct
FROM events
WHERE event_name IN ('share_modal_opened', 'profile_shared');

-- 1.6 Share method breakdown
SELECT
  props->>'method' AS method,
  COUNT(*) AS count,
  ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 1) AS pct
FROM events
WHERE event_name = 'profile_shared'
  AND props->>'method' IS NOT NULL
GROUP BY props->>'method'
ORDER BY count DESC;

-- 1.7 Language distribution
SELECT
  props->>'lang' AS lang,
  COUNT(*) AS starts
FROM events
WHERE event_name = 'test_start'
GROUP BY props->>'lang'
ORDER BY starts DESC;

-- 1.8 Retake rate
SELECT
  COUNT(*) FILTER (WHERE event_name = 'test_complete') AS completions,
  COUNT(*) FILTER (WHERE event_name = 'retake_started') AS retakes,
  ROUND(
    100.0 * COUNT(*) FILTER (WHERE event_name = 'retake_started')
    / NULLIF(COUNT(*) FILTER (WHERE event_name = 'test_complete'), 0), 1
  ) AS retake_pct
FROM events;


-- ═══════════════════════════════════════════════
-- SECTION 2 — POLITICAL DISTRIBUTION
-- ═══════════════════════════════════════════════

-- 2.1 Archetype distribution (all time)
SELECT
  archetype_id,
  COUNT(*) AS users,
  ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 1) AS pct,
  ROUND(AVG(top_candidate_alignment), 1) AS avg_candidate_alignment,
  ROUND(AVG((axes->>'economic')::numeric), 1) AS avg_economic,
  ROUND(AVG((axes->>'social')::numeric), 1) AS avg_social
FROM user_profiles
WHERE archetype_id IS NOT NULL
GROUP BY archetype_id
ORDER BY users DESC;

-- 2.2 Archetype trend (last 8 weeks)
SELECT * FROM v_archetype_trend
WHERE week >= date_trunc('week', now()) - INTERVAL '8 weeks'
ORDER BY week DESC, user_count DESC;

-- 2.3 Candidate (top match) distribution
SELECT
  top_candidate_id,
  COUNT(*) AS users,
  ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 1) AS pct,
  ROUND(AVG(top_candidate_alignment), 1) AS avg_alignment
FROM user_profiles
WHERE top_candidate_id IS NOT NULL
GROUP BY top_candidate_id
ORDER BY users DESC;

-- 2.4 Candidate trend (last 8 weeks)
SELECT * FROM v_candidate_trend
WHERE week >= date_trunc('week', now()) - INTERVAL '8 weeks'
ORDER BY week DESC, user_count DESC;

-- 2.5 Ideological distribution — left/right + progressive/conservative mean
SELECT
  ROUND(AVG((axes->>'economic')::numeric), 1)     AS mean_economic_axis,   -- 0=left, 100=right
  ROUND(AVG((axes->>'social')::numeric), 1)        AS mean_social_axis,     -- 0=conservative, 100=progressive
  ROUND(AVG((axes->>'institutional')::numeric), 1) AS mean_institutional,   -- 0=authoritarian, 100=democratic
  ROUND(AVG((axes->>'international')::numeric), 1) AS mean_international,   -- 0=nationalist, 100=globalist
  -- Political compass quadrants
  COUNT(*) FILTER (WHERE (axes->>'economic')::numeric < 50 AND (axes->>'social')::numeric >= 50) AS left_progressive,
  COUNT(*) FILTER (WHERE (axes->>'economic')::numeric >= 50 AND (axes->>'social')::numeric >= 50) AS right_progressive,
  COUNT(*) FILTER (WHERE (axes->>'economic')::numeric < 50 AND (axes->>'social')::numeric < 50)  AS left_conservative,
  COUNT(*) FILTER (WHERE (axes->>'economic')::numeric >= 50 AND (axes->>'social')::numeric < 50) AS right_conservative,
  COUNT(*) AS total
FROM user_profiles
WHERE answered_count >= 15;  -- minimum confidence threshold

-- 2.6 Average theme scores across all users
SELECT
  ROUND(AVG((theme_scores->>'ECONOMY')::numeric), 1)         AS avg_economy,
  ROUND(AVG((theme_scores->>'SOCIAL')::numeric), 1)           AS avg_social,
  ROUND(AVG((theme_scores->>'IMMIGRATION')::numeric), 1)      AS avg_immigration,
  ROUND(AVG((theme_scores->>'SECURITY')::numeric), 1)         AS avg_security,
  ROUND(AVG((theme_scores->>'ENVIRONMENT')::numeric), 1)      AS avg_environment,
  ROUND(AVG((theme_scores->>'DEMOCRACY')::numeric), 1)        AS avg_democracy,
  ROUND(AVG((theme_scores->>'GLOBAL')::numeric), 1)           AS avg_global,
  ROUND(AVG((theme_scores->>'PUBLIC_SERVICES')::numeric), 1)  AS avg_public_services,
  COUNT(*) AS n
FROM user_profiles
WHERE answered_count >= 15;

-- 2.7 Theme score distribution — show how spread out each theme is
SELECT
  'ECONOMY' AS theme, ROUND(STDDEV((theme_scores->>'ECONOMY')::numeric), 1) AS std_dev,
  ROUND(MIN((theme_scores->>'ECONOMY')::numeric), 0) AS min_val,
  ROUND(MAX((theme_scores->>'ECONOMY')::numeric), 0) AS max_val
FROM user_profiles WHERE answered_count >= 15
UNION ALL
SELECT 'IMMIGRATION', ROUND(STDDEV((theme_scores->>'IMMIGRATION')::numeric), 1),
  ROUND(MIN((theme_scores->>'IMMIGRATION')::numeric), 0),
  ROUND(MAX((theme_scores->>'IMMIGRATION')::numeric), 0)
FROM user_profiles WHERE answered_count >= 15
UNION ALL
SELECT 'SOCIAL', ROUND(STDDEV((theme_scores->>'SOCIAL')::numeric), 1),
  ROUND(MIN((theme_scores->>'SOCIAL')::numeric), 0),
  ROUND(MAX((theme_scores->>'SOCIAL')::numeric), 0)
FROM user_profiles WHERE answered_count >= 15
UNION ALL
SELECT 'ENVIRONMENT', ROUND(STDDEV((theme_scores->>'ENVIRONMENT')::numeric), 1),
  ROUND(MIN((theme_scores->>'ENVIRONMENT')::numeric), 0),
  ROUND(MAX((theme_scores->>'ENVIRONMENT')::numeric), 0)
FROM user_profiles WHERE answered_count >= 15
ORDER BY std_dev DESC;  -- which themes are most divisive?


-- ═══════════════════════════════════════════════
-- SECTION 3 — DEMOGRAPHICS
-- ═══════════════════════════════════════════════

-- 3.1 Demographics coverage rate
SELECT
  COUNT(*) AS total_users,
  COUNT(ud.user_id) AS users_with_demographics,
  ROUND(100.0 * COUNT(ud.user_id) / NULLIF(COUNT(*), 0), 1) AS coverage_pct
FROM user_profiles up
LEFT JOIN user_demographics ud ON ud.user_id = up.user_id;

-- 3.2 Age distribution
SELECT
  age_range,
  COUNT(*) AS users,
  ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 1) AS pct
FROM user_demographics
WHERE age_range IS NOT NULL
GROUP BY age_range
ORDER BY age_range;

-- 3.3 Education distribution
SELECT
  education_level,
  COUNT(*) AS users,
  ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 1) AS pct
FROM user_demographics
WHERE education_level IS NOT NULL
GROUP BY education_level
ORDER BY users DESC;

-- 3.4 Age × archetype cross-tab (political intelligence)
SELECT * FROM v_demographic_archetype
ORDER BY age_range, user_count DESC;

-- 3.5 Age × economic axis (left/right by age)
SELECT
  ud.age_range,
  ROUND(AVG((up.axes->>'economic')::numeric), 1) AS avg_economic,
  ROUND(AVG((up.axes->>'social')::numeric), 1)   AS avg_social,
  COUNT(*) AS n
FROM user_profiles up
JOIN user_demographics ud ON ud.user_id = up.user_id
WHERE ud.age_range IS NOT NULL AND up.answered_count >= 15
GROUP BY ud.age_range
ORDER BY ud.age_range;

-- 3.6 Education × economic axis
SELECT
  ud.education_level,
  ROUND(AVG((up.axes->>'economic')::numeric), 1) AS avg_economic,
  ROUND(AVG((up.axes->>'social')::numeric), 1)   AS avg_social,
  COUNT(*) AS n
FROM user_profiles up
JOIN user_demographics ud ON ud.user_id = up.user_id
WHERE ud.education_level IS NOT NULL AND up.answered_count >= 15
GROUP BY ud.education_level
ORDER BY avg_economic;


-- ═══════════════════════════════════════════════
-- SECTION 4 — BEHAVIOURAL INTELLIGENCE
-- (Requires question_answered events)
-- ═══════════════════════════════════════════════

-- 4.1 Top 20 most controversial questions (highest answer variance)
SELECT * FROM v_question_controversy LIMIT 20;

-- 4.2 Top 20 questions with highest "50/50 split" (closest to neutral)
SELECT
  question_id,
  theme,
  response_count,
  mean_answer,
  ABS(mean_answer - 3.0) AS distance_from_neutral,  -- 0 = perfect split
  std_dev
FROM v_question_controversy
WHERE response_count >= 20
ORDER BY distance_from_neutral ASC, std_dev DESC
LIMIT 20;

-- 4.3 Most skipped questions (friction zones)
SELECT
  props->>'question_id' AS question_id,
  props->>'theme' AS theme,
  COUNT(*) AS skip_count
FROM events
WHERE event_name = 'question_skipped'
  AND props->>'question_id' IS NOT NULL
GROUP BY props->>'question_id', props->>'theme'
ORDER BY skip_count DESC
LIMIT 20;

-- 4.4 Quiz dropout analysis — where do users leave?
SELECT * FROM v_dropout_by_question
WHERE last_index <= 30  -- focus on first 30 questions (early dropout)
ORDER BY last_index;

-- 4.5 Concept explainer usage (which topics need more explanation)
SELECT
  props->>'concept_key' AS concept_key,
  COUNT(*) AS opens,
  ROUND(AVG((props->>'question_index')::numeric), 0) AS avg_question_index
FROM events
WHERE event_name = 'concept_opened'
  AND props->>'concept_key' IS NOT NULL
GROUP BY props->>'concept_key'
ORDER BY opens DESC
LIMIT 20;

-- 4.6 Theme engagement — which themes get most answers (vs. most skips)
SELECT
  props->>'theme' AS theme,
  COUNT(*) FILTER (WHERE event_name = 'question_answered') AS answers,
  COUNT(*) FILTER (WHERE event_name = 'question_skipped')  AS skips,
  ROUND(
    100.0 * COUNT(*) FILTER (WHERE event_name = 'question_skipped')
    / NULLIF(COUNT(*) FILTER (WHERE event_name IN ('question_answered', 'question_skipped')), 0), 1
  ) AS skip_rate_pct
FROM events
WHERE event_name IN ('question_answered', 'question_skipped')
  AND props->>'theme' IS NOT NULL
GROUP BY props->>'theme'
ORDER BY answers DESC;

-- 4.7 Priority ranking usage (how many users customise priorities?)
SELECT
  COUNT(*) FILTER (WHERE event_name = 'priority_ranking_completed') AS priority_customised,
  COUNT(*) FILTER (WHERE event_name = 'test_start') AS total_starts,
  ROUND(
    100.0 * COUNT(*) FILTER (WHERE event_name = 'priority_ranking_completed')
    / NULLIF(COUNT(*) FILTER (WHERE event_name = 'test_start'), 0), 1
  ) AS priority_adoption_pct
FROM events
WHERE event_name IN ('priority_ranking_completed', 'test_start');


-- ═══════════════════════════════════════════════
-- SECTION 5 — RETENTION & VIRALITY
-- ═══════════════════════════════════════════════

-- 5.1 Share virality by archetype
SELECT * FROM v_share_virality_by_archetype;

-- 5.2 Improve mode adoption
SELECT
  COUNT(*) FILTER (WHERE event_name = 'improve_started') AS improve_uses,
  COUNT(*) FILTER (WHERE event_name = 'profile_viewed') AS profile_views,
  ROUND(
    100.0 * COUNT(*) FILTER (WHERE event_name = 'improve_started')
    / NULLIF(COUNT(*) FILTER (WHERE event_name = 'profile_viewed'), 0), 1
  ) AS improve_adoption_pct
FROM events
WHERE event_name IN ('improve_started', 'profile_viewed');

-- 5.3 Content engagement (candidate, election, figure clicks)
SELECT
  event_name,
  COUNT(*) AS count,
  COUNT(DISTINCT COALESCE(user_id::text, anonymous_id)) AS unique_users
FROM events
WHERE event_name IN ('candidate_viewed', 'election_viewed', 'historical_figure_viewed', 'compare_started')
GROUP BY event_name
ORDER BY count DESC;

-- 5.4 Candidate interest ranking
SELECT
  props->>'candidate_id' AS candidate_id,
  COUNT(*) AS views
FROM events
WHERE event_name = 'candidate_viewed'
  AND props->>'candidate_id' IS NOT NULL
GROUP BY props->>'candidate_id'
ORDER BY views DESC;

-- 5.5 Most viewed historical figures
SELECT
  props->>'figure_id' AS figure_id,
  COUNT(*) AS views
FROM events
WHERE event_name = 'historical_figure_viewed'
  AND props->>'figure_id' IS NOT NULL
GROUP BY props->>'figure_id'
ORDER BY views DESC
LIMIT 20;


-- ═══════════════════════════════════════════════
-- SECTION 6 — POLITICAL INTELLIGENCE (ADVANCED)
-- ═══════════════════════════════════════════════

-- 6.1 The 5 most agreed-upon positions (lowest controversy, highest mean)
-- These are questions where most French (Poliscop) users agree
SELECT
  question_id,
  theme,
  ROUND(mean_answer, 2) AS mean_answer,
  ROUND(std_dev, 2) AS std_dev,
  response_count
FROM question_analytics
WHERE response_count >= 50
ORDER BY mean_answer DESC, std_dev ASC
LIMIT 5;

-- 6.2 The 5 most contested positions (highest controversy)
SELECT
  question_id,
  theme,
  ROUND(mean_answer, 2) AS mean_answer,
  ROUND(std_dev, 2) AS std_dev,
  ROUND(pct_agree, 1) AS pct_agree,
  ROUND(pct_disagree, 1) AS pct_disagree,
  response_count
FROM question_analytics
WHERE response_count >= 50
ORDER BY std_dev DESC
LIMIT 5;

-- 6.3 Which themes predict support for each candidate?
-- Shows avg theme score for users whose top_candidate_id = each candidate
SELECT
  top_candidate_id,
  COUNT(*) AS n,
  ROUND(AVG((theme_scores->>'ECONOMY')::numeric), 1)         AS economy,
  ROUND(AVG((theme_scores->>'IMMIGRATION')::numeric), 1)      AS immigration,
  ROUND(AVG((theme_scores->>'SOCIAL')::numeric), 1)           AS social,
  ROUND(AVG((theme_scores->>'ENVIRONMENT')::numeric), 1)      AS environment,
  ROUND(AVG((theme_scores->>'SECURITY')::numeric), 1)         AS security,
  ROUND(AVG((theme_scores->>'DEMOCRACY')::numeric), 1)        AS democracy,
  ROUND(AVG((theme_scores->>'GLOBAL')::numeric), 1)           AS global,
  ROUND(AVG((theme_scores->>'PUBLIC_SERVICES')::numeric), 1)  AS public_services
FROM user_profiles
WHERE top_candidate_id IS NOT NULL AND answered_count >= 15
GROUP BY top_candidate_id
ORDER BY n DESC;

-- 6.4 Archetype × candidate cross-tab
-- Which archetypes most often match with which candidates?
SELECT
  archetype_id,
  top_candidate_id,
  COUNT(*) AS n,
  ROUND(AVG(top_candidate_alignment), 1) AS avg_alignment
FROM user_profiles
WHERE archetype_id IS NOT NULL AND top_candidate_id IS NOT NULL
GROUP BY archetype_id, top_candidate_id
ORDER BY archetype_id, n DESC;

-- 6.5 Most viral archetypes — which profiles share most?
-- Combines user_profiles + profile_shared events
SELECT
  e.props->>'archetype_id' AS archetype_id,
  COUNT(*) AS total_shares,
  COUNT(DISTINCT COALESCE(e.user_id::text, e.anonymous_id)) AS unique_sharers,
  -- Share rate = sharers / total users with that archetype
  ROUND(
    100.0 * COUNT(DISTINCT COALESCE(e.user_id::text, e.anonymous_id))
    / NULLIF((SELECT COUNT(*) FROM user_profiles WHERE archetype_id = e.props->>'archetype_id'), 0), 1
  ) AS share_rate_pct
FROM events e
WHERE e.event_name = 'profile_shared'
  AND e.props->>'archetype_id' IS NOT NULL
GROUP BY e.props->>'archetype_id'
ORDER BY share_rate_pct DESC;

-- 6.6 Geography check — which archetypes appear in which regions?
-- (Only useful once region is derived from postal_code)
SELECT * FROM v_geographic_distribution
WHERE region IS NOT NULL
ORDER BY user_count DESC;

-- 6.7 Mode effectiveness — do full-mode users have different politics?
SELECT
  (e.props->>'mode') AS mode,
  COUNT(*) AS completions,
  ROUND(AVG(up.answered_count), 0) AS avg_answered,
  ROUND(AVG((up.axes->>'economic')::numeric), 1) AS avg_economic,
  ROUND(AVG((up.axes->>'social')::numeric), 1) AS avg_social
FROM events e
JOIN user_profiles up ON up.user_id = e.user_id
WHERE e.event_name = 'test_complete' AND e.user_id IS NOT NULL
GROUP BY e.props->>'mode'
ORDER BY completions DESC;


-- ═══════════════════════════════════════════════
-- SECTION 7 — MONITORING / HEALTH
-- ═══════════════════════════════════════════════

-- 7.1 Events volume last 7 days
SELECT
  event_name,
  COUNT(*) AS count,
  COUNT(*) FILTER (WHERE created_at >= now() - INTERVAL '24 hours') AS last_24h
FROM events
WHERE created_at >= now() - INTERVAL '7 days'
GROUP BY event_name
ORDER BY count DESC;

-- 7.2 Table sizes (to monitor Supabase quota)
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS total_size,
  pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) AS data_size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- 7.3 Total registered users
SELECT COUNT(*) FROM auth.users;

-- 7.4 Users with profiles (completed at least one quiz)
SELECT
  COUNT(*) AS total_registered,
  COUNT(up.user_id) AS have_profile,
  ROUND(100.0 * COUNT(up.user_id) / NULLIF(COUNT(*), 0), 1) AS profile_pct,
  ROUND(AVG(up.answered_count), 0) AS avg_answered
FROM auth.users u
LEFT JOIN user_profiles up ON up.user_id = u.id;

-- 7.5 Check that analytics events are flowing
SELECT
  event_name,
  COUNT(*) AS total,
  MAX(created_at) AS last_event
FROM events
GROUP BY event_name
ORDER BY last_event DESC;

-- ─────────────────────────────────────────────────────────────────────────────
-- REFRESH COMMANDS (run after new data accumulates)
-- ─────────────────────────────────────────────────────────────────────────────
-- SELECT refresh_analytics_views();        -- refresh materialized views
-- SELECT refresh_question_analytics();     -- rebuild question_analytics table
