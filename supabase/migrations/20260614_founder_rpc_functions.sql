-- ============================================================
-- Migration: Founder Dashboard RPC functions
-- Date: 2026-06-14
-- Run in: Supabase SQL Editor (production project gpvqsftyrninbwzhkaed)
--
-- WHY THIS EXISTS:
-- The FounderDashboard uses the anon Supabase key (VITE_SUPABASE_ANON_KEY).
-- All tables have RLS enabled — anon reads return 0 rows silently.
-- Solution: SECURITY DEFINER functions that run as DB owner, bypass RLS,
-- and return ONLY aggregated anonymised data (never PII).
-- Each function is GRANTED to anon so the browser can call it.
-- ============================================================


-- ─────────────────────────────────────────────────────────────────────────────
-- ALSO APPLY: schema_v2.sql columns that saveProfileMeta() needs
-- (idempotent — safe to run even if already applied)
-- ─────────────────────────────────────────────────────────────────────────────

ALTER TABLE public.user_profiles
  ADD COLUMN IF NOT EXISTS archetype_id            text,
  ADD COLUMN IF NOT EXISTS top_candidate_id        text,
  ADD COLUMN IF NOT EXISTS top_candidate_alignment numeric(5,1),
  ADD COLUMN IF NOT EXISTS created_at              timestamptz NOT NULL DEFAULT now();

ALTER TABLE public.user_demographics
  ADD COLUMN IF NOT EXISTS commune_type       text,
  ADD COLUMN IF NOT EXISTS employment_status  text,
  ADD COLUMN IF NOT EXISTS education_level    text,
  ADD COLUMN IF NOT EXISTS postal_code        text,
  ADD COLUMN IF NOT EXISTS created_at         timestamptz NOT NULL DEFAULT now();

ALTER TABLE public.user_profiles
  ADD COLUMN IF NOT EXISTS quiz_mode text;

-- Indexes for dashboard queries
CREATE INDEX IF NOT EXISTS user_profiles_archetype_id_idx
  ON public.user_profiles (archetype_id)
  WHERE archetype_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS user_profiles_top_candidate_id_idx
  ON public.user_profiles (top_candidate_id)
  WHERE top_candidate_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS user_profiles_created_at_idx
  ON public.user_profiles (created_at);

CREATE INDEX IF NOT EXISTS events_created_at_idx
  ON public.events (created_at);

CREATE INDEX IF NOT EXISTS events_name_created_at_idx
  ON public.events (event_name, created_at);

CREATE INDEX IF NOT EXISTS user_demographics_commune_type_idx
  ON public.user_demographics (commune_type)
  WHERE commune_type IS NOT NULL;

CREATE INDEX IF NOT EXISTS user_demographics_gender_idx
  ON public.user_demographics (gender)
  WHERE gender IS NOT NULL;


-- ─────────────────────────────────────────────────────────────────────────────
-- 1. founder_get_growth()
--    Returns: total_profiles, profiles_7d, profiles_30d, profiles_24h,
--             total_events, total_demographics, total_anonymous_sessions
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.founder_get_growth()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN jsonb_build_object(
    'total_profiles',
      (SELECT COUNT(*) FROM public.user_profiles),
    'profiles_7d',
      (SELECT COUNT(*) FROM public.user_profiles
       WHERE created_at >= now() - interval '7 days'),
    'profiles_30d',
      (SELECT COUNT(*) FROM public.user_profiles
       WHERE created_at >= now() - interval '30 days'),
    'profiles_24h',
      (SELECT COUNT(*) FROM public.user_profiles
       WHERE created_at >= now() - interval '24 hours'),
    'total_events',
      (SELECT COUNT(*) FROM public.events),
    'total_demographics',
      (SELECT COUNT(*) FROM public.user_demographics),
    'total_anonymous_sessions',
      (SELECT COUNT(*) FROM public.anonymous_sessions),
    'profiles_with_archetype',
      (SELECT COUNT(*) FROM public.user_profiles
       WHERE archetype_id IS NOT NULL),
    'profiles_with_candidate',
      (SELECT COUNT(*) FROM public.user_profiles
       WHERE top_candidate_id IS NOT NULL)
  );
END;
$$;

REVOKE ALL ON FUNCTION public.founder_get_growth() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.founder_get_growth() TO anon;
GRANT EXECUTE ON FUNCTION public.founder_get_growth() TO authenticated;


-- ─────────────────────────────────────────────────────────────────────────────
-- 2. founder_get_candidates()
--    Returns: array of {id, count, avg_alignment, pct}
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.founder_get_candidates()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  total_n bigint;
  result  jsonb;
BEGIN
  SELECT COUNT(*) INTO total_n
  FROM public.user_profiles
  WHERE top_candidate_id IS NOT NULL;

  IF total_n = 0 THEN RETURN '[]'::jsonb; END IF;

  SELECT jsonb_agg(
    jsonb_build_object(
      'id',            top_candidate_id,
      'count',         cnt,
      'avg_alignment', ROUND(avg_align, 1),
      'pct',           ROUND((cnt::numeric / total_n) * 100, 1)
    )
    ORDER BY cnt DESC
  )
  INTO result
  FROM (
    SELECT
      top_candidate_id,
      COUNT(*)                             AS cnt,
      AVG(top_candidate_alignment::numeric) AS avg_align
    FROM public.user_profiles
    WHERE top_candidate_id IS NOT NULL
    GROUP BY top_candidate_id
  ) t;

  RETURN COALESCE(result, '[]'::jsonb);
END;
$$;

REVOKE ALL ON FUNCTION public.founder_get_candidates() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.founder_get_candidates() TO anon;
GRANT EXECUTE ON FUNCTION public.founder_get_candidates() TO authenticated;


-- ─────────────────────────────────────────────────────────────────────────────
-- 3. founder_get_archetypes()
--    Returns: array of {id, count, pct}
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.founder_get_archetypes()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  total_n bigint;
  result  jsonb;
BEGIN
  SELECT COUNT(*) INTO total_n
  FROM public.user_profiles
  WHERE archetype_id IS NOT NULL;

  IF total_n = 0 THEN RETURN '[]'::jsonb; END IF;

  SELECT jsonb_agg(
    jsonb_build_object(
      'id',    archetype_id,
      'count', cnt,
      'pct',   ROUND((cnt::numeric / total_n) * 100, 1)
    )
    ORDER BY cnt DESC
  )
  INTO result
  FROM (
    SELECT archetype_id, COUNT(*) AS cnt
    FROM public.user_profiles
    WHERE archetype_id IS NOT NULL
    GROUP BY archetype_id
  ) t;

  RETURN COALESCE(result, '[]'::jsonb);
END;
$$;

REVOKE ALL ON FUNCTION public.founder_get_archetypes() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.founder_get_archetypes() TO anon;
GRANT EXECUTE ON FUNCTION public.founder_get_archetypes() TO authenticated;


-- ─────────────────────────────────────────────────────────────────────────────
-- 4. founder_get_compass()
--    Returns: {avg_economic, avg_social, n} or null
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.founder_get_compass()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result jsonb;
BEGIN
  SELECT jsonb_build_object(
    'avg_economic', ROUND(AVG((axes->>'economic')::numeric), 1),
    'avg_social',   ROUND(AVG((axes->>'social')::numeric), 1),
    'avg_institutional', ROUND(AVG((axes->>'institutional')::numeric), 1),
    'avg_international', ROUND(AVG((axes->>'international')::numeric), 1),
    'n', COUNT(*)
  )
  INTO result
  FROM public.user_profiles
  WHERE axes IS NOT NULL
    AND axes->>'economic' IS NOT NULL
    AND axes->>'social' IS NOT NULL;

  RETURN result;
END;
$$;

REVOKE ALL ON FUNCTION public.founder_get_compass() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.founder_get_compass() TO anon;
GRANT EXECUTE ON FUNCTION public.founder_get_compass() TO authenticated;


-- ─────────────────────────────────────────────────────────────────────────────
-- 5. founder_get_events(days_back int DEFAULT 7)
--    Returns: array of {event_name, count} for the last N days, sorted desc
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.founder_get_events(days_back int DEFAULT 7)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result jsonb;
BEGIN
  SELECT jsonb_agg(
    jsonb_build_object('event', event_name, 'count', cnt)
    ORDER BY cnt DESC
  )
  INTO result
  FROM (
    SELECT event_name, COUNT(*) AS cnt
    FROM public.events
    WHERE created_at >= now() - (days_back || ' days')::interval
    GROUP BY event_name
  ) t;

  RETURN COALESCE(result, '[]'::jsonb);
END;
$$;

REVOKE ALL ON FUNCTION public.founder_get_events(int) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.founder_get_events(int) TO anon;
GRANT EXECUTE ON FUNCTION public.founder_get_events(int) TO authenticated;


-- ─────────────────────────────────────────────────────────────────────────────
-- 6. founder_get_top_skipped(limit_n int DEFAULT 10)
--    Returns: array of {question_id, count} for question_skipped events
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.founder_get_top_skipped(limit_n int DEFAULT 10)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result jsonb;
BEGIN
  SELECT jsonb_agg(
    jsonb_build_object('id', question_id, 'count', cnt)
    ORDER BY cnt DESC
  )
  INTO result
  FROM (
    SELECT props->>'question_id' AS question_id, COUNT(*) AS cnt
    FROM public.events
    WHERE event_name = 'question_skipped'
      AND props->>'question_id' IS NOT NULL
    GROUP BY props->>'question_id'
    ORDER BY cnt DESC
    LIMIT limit_n
  ) t;

  RETURN COALESCE(result, '[]'::jsonb);
END;
$$;

REVOKE ALL ON FUNCTION public.founder_get_top_skipped(int) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.founder_get_top_skipped(int) TO anon;
GRANT EXECUTE ON FUNCTION public.founder_get_top_skipped(int) TO authenticated;


-- ─────────────────────────────────────────────────────────────────────────────
-- 7. founder_get_gender_scores()
--    Returns: array of {genre, n, social, immigration, global, environment}
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.founder_get_gender_scores()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result jsonb;
BEGIN
  SELECT jsonb_agg(
    jsonb_build_object(
      'genre',       gender,
      'n',           cnt,
      'social',      ROUND(avg_social, 1),
      'immigration', ROUND(avg_immigration, 1),
      'global',      ROUND(avg_global, 1),
      'environment', ROUND(avg_env, 1)
    )
    ORDER BY cnt DESC
  )
  INTO result
  FROM (
    SELECT
      ud.gender,
      COUNT(*)                                                AS cnt,
      AVG((up.theme_scores->>'SOCIAL')::numeric)             AS avg_social,
      AVG((up.theme_scores->>'IMMIGRATION')::numeric)        AS avg_immigration,
      AVG((up.theme_scores->>'GLOBAL')::numeric)             AS avg_global,
      AVG((up.theme_scores->>'ENVIRONMENT')::numeric)        AS avg_env
    FROM public.user_profiles up
    JOIN public.user_demographics ud ON ud.user_id = up.user_id
    WHERE ud.gender IN ('homme', 'femme')
      AND up.theme_scores IS NOT NULL
    GROUP BY ud.gender
    HAVING COUNT(*) >= 3
  ) t;

  RETURN COALESCE(result, '[]'::jsonb);
END;
$$;

REVOKE ALL ON FUNCTION public.founder_get_gender_scores() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.founder_get_gender_scores() TO anon;
GRANT EXECUTE ON FUNCTION public.founder_get_gender_scores() TO authenticated;


-- ─────────────────────────────────────────────────────────────────────────────
-- 8. founder_get_commune_scores()
--    Returns: array of {commune, n, immigration, global, security}
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.founder_get_commune_scores()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result jsonb;
BEGIN
  SELECT jsonb_agg(
    jsonb_build_object(
      'commune',     commune_type,
      'n',           cnt,
      'immigration', ROUND(avg_immigration, 1),
      'global',      ROUND(avg_global, 1),
      'security',    ROUND(avg_security, 1)
    )
    ORDER BY
      CASE commune_type
        WHEN 'grande_ville' THEN 1
        WHEN 'ville_moyenne' THEN 2
        WHEN 'petite_ville' THEN 3
        WHEN 'rural' THEN 4
        ELSE 5
      END
  )
  INTO result
  FROM (
    SELECT
      ud.commune_type,
      COUNT(*)                                              AS cnt,
      AVG((up.theme_scores->>'IMMIGRATION')::numeric)      AS avg_immigration,
      AVG((up.theme_scores->>'GLOBAL')::numeric)           AS avg_global,
      AVG((up.theme_scores->>'SECURITY')::numeric)         AS avg_security
    FROM public.user_profiles up
    JOIN public.user_demographics ud ON ud.user_id = up.user_id
    WHERE ud.commune_type IS NOT NULL
      AND up.theme_scores IS NOT NULL
    GROUP BY ud.commune_type
    HAVING COUNT(*) >= 3
  ) t;

  RETURN COALESCE(result, '[]'::jsonb);
END;
$$;

REVOKE ALL ON FUNCTION public.founder_get_commune_scores() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.founder_get_commune_scores() TO anon;
GRANT EXECUTE ON FUNCTION public.founder_get_commune_scores() TO authenticated;


-- ─────────────────────────────────────────────────────────────────────────────
-- 9. founder_get_demographics_quality()
--    Returns: coverage stats for each demographic field
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.founder_get_demographics_quality()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  total_profiles bigint;
  total_demos    bigint;
  result         jsonb;
BEGIN
  SELECT COUNT(*) INTO total_profiles FROM public.user_profiles;
  SELECT COUNT(*) INTO total_demos    FROM public.user_demographics;

  SELECT jsonb_build_object(
    'total_profiles',     total_profiles,
    'total_demographics', total_demos,
    'coverage_pct',       CASE WHEN total_profiles > 0
                               THEN ROUND((total_demos::numeric / total_profiles) * 100, 1)
                               ELSE 0 END,
    'gender_filled',      (SELECT COUNT(*) FROM public.user_demographics WHERE gender IS NOT NULL),
    'age_filled',         (SELECT COUNT(*) FROM public.user_demographics WHERE age_range IS NOT NULL),
    'commune_filled',     (SELECT COUNT(*) FROM public.user_demographics WHERE commune_type IS NOT NULL),
    'employment_filled',  (SELECT COUNT(*) FROM public.user_demographics WHERE employment_status IS NOT NULL),
    'education_filled',   (SELECT COUNT(*) FROM public.user_demographics WHERE education_level IS NOT NULL),
    'postal_filled',      (SELECT COUNT(*) FROM public.user_demographics WHERE postal_code IS NOT NULL)
  ) INTO result;

  RETURN result;
END;
$$;

REVOKE ALL ON FUNCTION public.founder_get_demographics_quality() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.founder_get_demographics_quality() TO anon;
GRANT EXECUTE ON FUNCTION public.founder_get_demographics_quality() TO authenticated;


-- ─────────────────────────────────────────────────────────────────────────────
-- VERIFY: list all founder_ functions with their grants
-- ─────────────────────────────────────────────────────────────────────────────
SELECT
  routine_name,
  routine_type,
  security_type
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name LIKE 'founder_%'
ORDER BY routine_name;
