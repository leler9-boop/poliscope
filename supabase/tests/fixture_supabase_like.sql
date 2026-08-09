-- POLISCOP — Fixture Postgres minimale imitant Supabase.
--
-- Permet de tester les migrations sur un cluster local jetable, sans Docker ni CLI Supabase :
-- rôles `anon` / `authenticated` / `service_role`, schéma `auth` avec `auth.users` et
-- `auth.uid()`, et les tables `public` dont dépendent les fonctions `founder_*`.
--
-- `auth.uid()` lit ici un GUC (`request.jwt.claim.sub`) — même mécanisme que Supabase, ce qui
-- permet d'usurper un utilisateur en test avec `set local request.jwt.claim.sub = '<uuid>'`.
--
-- Usage : voir supabase/tests/run-migration-tests.sh

-- ─── Rôles ───────────────────────────────────────────────────────────────────
do $$
begin
  if not exists (select 1 from pg_roles where rolname = 'anon') then
    create role anon nologin noinherit;
  end if;
  if not exists (select 1 from pg_roles where rolname = 'authenticated') then
    create role authenticated nologin noinherit;
  end if;
  if not exists (select 1 from pg_roles where rolname = 'service_role') then
    create role service_role nologin noinherit bypassrls;
  end if;
end $$;

grant usage on schema public to anon, authenticated, service_role;

-- ─── Schéma auth ─────────────────────────────────────────────────────────────
create schema if not exists auth;

create table if not exists auth.users (
  id    uuid primary key,
  email text
);

create or replace function auth.uid()
returns uuid
language sql
stable
as $$
  select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid;
$$;

grant usage on schema auth to anon, authenticated, service_role;
grant execute on function auth.uid() to anon, authenticated, service_role;

-- ─── Tables publiques utilisées par les fonctions founder_* ─────────────────
create table if not exists public.user_profiles (
  user_id          uuid primary key,
  theme_scores     jsonb,
  axes             jsonb,
  confidence       text,
  confidence_score int,
  answered_count   int,
  archetype_id     text,
  top_candidate_id text,
  top_candidate_alignment int,
  created_at       timestamptz not null default now()
);

create table if not exists public.user_answers (
  user_id      uuid not null,
  question_id  text not null,
  answer_value smallint not null check (answer_value between 1 and 5),
  created_at   timestamptz not null default now(),
  primary key (user_id, question_id)
);

create table if not exists public.user_demographics (
  user_id           uuid primary key,
  gender            text,
  age_range         text,
  commune_type      text,
  employment_status text,
  education_level   text,
  created_at        timestamptz not null default now(),
  -- Requise par le trigger set_user_demographics_updated_at de 20260612.
  updated_at        timestamptz not null default now()
);

create table if not exists public.events (
  id           bigserial primary key,
  anonymous_id uuid,
  user_id      uuid,
  event_name   text not null,
  props        jsonb,
  created_at   timestamptz not null default now()
);

create table if not exists public.anonymous_sessions (
  id           uuid primary key,
  last_seen_at timestamptz,
  device       text,
  lang         text
);

-- Table écrite par le client anonyme. RLS ouverte en production (cf. 20260612).
create table if not exists public.anonymous_answers (
  anonymous_id uuid not null,
  question_id  text not null,
  answer_value smallint not null check (answer_value between 1 and 5),
  created_at   timestamptz not null default now(),
  primary key (anonymous_id, question_id)
);

create table if not exists public.user_consents (
  user_id      uuid not null,
  consent_type text not null,
  granted      boolean not null,
  version      text,
  created_at   timestamptz not null default now(),
  primary key (user_id, consent_type)
);

-- ─── RLS : état de production reproduit ──────────────────────────────────────
-- 20260612_fix_rls_and_constraints.sql suppose ces tables déjà sous RLS avec des
-- policies existantes. Sans cela, la migration s'applique mais ne reproduit pas
-- l'exposition réelle.
alter table public.anonymous_sessions enable row level security;
alter table public.events             enable row level security;
alter table public.anonymous_answers  enable row level security;
alter table public.user_demographics  enable row level security;
alter table public.user_answers       enable row level security;
alter table public.user_profiles      enable row level security;
alter table public.user_consents      enable row level security;

-- Policies « self-access » des schémas v1–v5 : chaque compte n'accède qu'à ses lignes.
-- Nécessaire pour reproduire le chemin réel de saveDemographics() (UPSERT + trigger).
drop policy if exists "user_demographics: self" on public.user_demographics;
create policy "user_demographics: self" on public.user_demographics
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "user_answers: self" on public.user_answers;
create policy "user_answers: self" on public.user_answers
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "user_profiles: self" on public.user_profiles;
create policy "user_profiles: self" on public.user_profiles
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "user_consents: self" on public.user_consents;
create policy "user_consents: self" on public.user_consents
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Droits de table accordés en production par Supabase aux rôles clients.
grant select, insert, update, delete on all tables in schema public to anon, authenticated;
grant usage, select on all sequences in schema public to anon, authenticated;
