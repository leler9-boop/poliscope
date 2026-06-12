-- ============================================================
-- Migration: fix RLS policies and missing constraints
-- Date: 2026-06-12
-- Run in: Supabase SQL Editor (production project gpvqsftyrninbwzhkaed)
-- ============================================================

-- 1. FIX anonymous_sessions RLS
--    Production policy blocks UPDATE (breaks UPSERT path).
--    Drop all policies and recreate with correct open policy.
DROP POLICY IF EXISTS "anonymous_sessions: insert/update own row" ON public.anonymous_sessions;
DROP POLICY IF EXISTS "anonymous_sessions: open" ON public.anonymous_sessions;

CREATE POLICY "anonymous_sessions: open"
  ON public.anonymous_sessions FOR ALL
  USING (true)
  WITH CHECK (true);

-- 2. VERIFY / FIX user_demographics unique constraint
--    Without this, saveDemographics UPSERT fails with 42P10.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'public.user_demographics'::regclass
      AND conname = 'user_demographics_user_id_unique'
  ) THEN
    ALTER TABLE public.user_demographics
      ADD CONSTRAINT user_demographics_user_id_unique UNIQUE (user_id);
  END IF;
END $$;

-- 3. VERIFY / FIX set_updated_at trigger on user_demographics
--    Required so updated_at refreshes on each UPSERT.
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

DROP TRIGGER IF EXISTS set_user_demographics_updated_at ON public.user_demographics;
CREATE TRIGGER set_user_demographics_updated_at
  BEFORE UPDATE ON public.user_demographics
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 4. FIX events RLS — ensure anon INSERT is allowed (idempotent)
DROP POLICY IF EXISTS "events: open insert" ON public.events;
CREATE POLICY "events: open insert"
  ON public.events FOR INSERT
  WITH CHECK (true);

-- 5. FIX anonymous_answers — ensure anon INSERT and UPDATE are allowed
--    (needed for answer updates via UPSERT from the Zustand store)
DROP POLICY IF EXISTS "anonymous_answers: insert/update own row" ON public.anonymous_answers;
CREATE POLICY "anonymous_answers: insert/update own row"
  ON public.anonymous_answers FOR ALL
  USING (true)
  WITH CHECK (true);

-- Confirm result
SELECT tablename, policyname, cmd, qual, with_check
FROM pg_policies
WHERE tablename IN ('anonymous_sessions','events','anonymous_answers','user_demographics','user_answers','user_profiles')
ORDER BY tablename, policyname;
