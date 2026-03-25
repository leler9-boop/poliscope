-- Poliscope — Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query

-- ── Helper: auto-update updated_at ───────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ─────────────────────────────────────────────────────────────────────────────
-- profiles (legacy — kept for backward compatibility)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  answers      jsonb NOT NULL DEFAULT '{}',
  theme_scores jsonb NOT NULL DEFAULT '{}',
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT profiles_user_id_unique UNIQUE (user_id)
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles: users manage own row"
  ON public.profiles FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX IF NOT EXISTS profiles_user_id_idx ON public.profiles (user_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- user_answers: one row per (user, question) — upserted on every answer
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.user_answers (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id  text NOT NULL,
  answer_value smallint NOT NULL,
  updated_at   timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT user_answers_user_question_unique UNIQUE (user_id, question_id)
);

ALTER TABLE public.user_answers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_answers: users manage own rows"
  ON public.user_answers FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP TRIGGER IF EXISTS set_user_answers_updated_at ON public.user_answers;
CREATE TRIGGER set_user_answers_updated_at
  BEFORE UPDATE ON public.user_answers
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX IF NOT EXISTS user_answers_user_id_idx ON public.user_answers (user_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- user_profiles: computed profile snapshot — one row per user
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  theme_scores     jsonb NOT NULL DEFAULT '{}',
  axes             jsonb NOT NULL DEFAULT '{}',
  confidence       text NOT NULL DEFAULT 'very_low',
  confidence_score smallint NOT NULL DEFAULT 0,
  answered_count   int NOT NULL DEFAULT 0,
  updated_at       timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT user_profiles_user_id_unique UNIQUE (user_id)
);

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_profiles: users manage own row"
  ON public.user_profiles FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP TRIGGER IF EXISTS set_user_profiles_updated_at ON public.user_profiles;
CREATE TRIGGER set_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX IF NOT EXISTS user_profiles_user_id_idx ON public.user_profiles (user_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- user_demographics: optional onboarding data — one row per user
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.user_demographics (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  age_range       text,
  education_level text,
  postal_code     text,
  updated_at      timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT user_demographics_user_id_unique UNIQUE (user_id)
);

ALTER TABLE public.user_demographics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_demographics: users manage own row"
  ON public.user_demographics FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP TRIGGER IF EXISTS set_user_demographics_updated_at ON public.user_demographics;
CREATE TRIGGER set_user_demographics_updated_at
  BEFORE UPDATE ON public.user_demographics
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX IF NOT EXISTS user_demographics_user_id_idx ON public.user_demographics (user_id);

-- ── Notes ─────────────────────────────────────────────────────────────────────
-- user_answers.answer_value : 1–5 (Likert scale)
-- user_profiles.theme_scores: { "ECONOMY": 62, "SOCIAL": 45, ... }
-- user_profiles.axes        : { "economic": 55, "social": 72, ... }
-- user_profiles.confidence  : "very_low" | "low" | "medium" | "high" | "very_high"
-- user_demographics.age_range       : "18-24" | "25-34" | "35-44" | "45-54" | "55-64" | "65+"
-- user_demographics.education_level : "primaire" | "college" | "lycee" | "bac" | "bac_1_2" | "bac_3" | "bac_4_5" | "bac_5_plus"
