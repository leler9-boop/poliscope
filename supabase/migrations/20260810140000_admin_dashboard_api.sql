-- POLISCOP — API du tableau de bord éditorial.
--
-- Le tableau de bord doit lire des données qui vivent dans `private`, schéma non exposé.
-- La seule voie autorisée est une fonction `security definer` qui :
--   • vérifie `public.is_founder_admin()` AVANT toute lecture ;
--   • ne renvoie que des agrégats ou des colonnes éditoriales ;
--   • est révoquée de `public` et `anon`, accordée à `authenticated` seul.
--
-- Le contrôle d'accès est DANS la fonction, pas dans l'interface : une clé anon publique
-- suffit à appeler n'importe quel RPC, l'écran React ne protège rien.

-- ─── 1. File de signalements ────────────────────────────────────────────────

create or replace function public.admin_question_reports(
  p_status                private.report_status default null,
  p_category              private.report_category default null,
  p_questionnaire_version text default null,
  p_limit                 integer default 200
)
returns table (
  id                    uuid,
  question_id           text,
  questionnaire_version text,
  category              private.report_category,
  comment               text,
  language              text,
  origin_screen         text,
  created_at            timestamptz,
  status                private.report_status,
  priority              smallint,
  admin_notes           text,
  resolved_at           timestamptz,
  fixed_in_version      text,
  is_current_version    boolean
)
language plpgsql
stable
security definer
set search_path = pg_catalog, public, private, pg_temp
as $$
begin
  if not public.is_founder_admin() then
    raise exception 'Accès refusé' using errcode = 'insufficient_privilege';
  end if;

  return query
    select r.id, r.question_id, r.questionnaire_version, r.category, r.comment,
           r.language, r.origin_screen, r.created_at,
           r.status, r.priority, r.admin_notes, r.resolved_at, r.fixed_in_version,
           -- « Le problème concerne-t-il encore la version en service ? » Sans cette
           -- colonne, l'équipe retraite des signalements déjà corrigés.
           (r.fixed_in_version is null) as is_current_version
      from private.question_reports r
     where (p_status   is null or r.status   = p_status)
       and (p_category is null or r.category = p_category)
       and (p_questionnaire_version is null or r.questionnaire_version = p_questionnaire_version)
     order by r.created_at desc
     limit greatest(1, least(coalesce(p_limit, 200), 1000));
end;
$$;


-- ─── 2. Santé d'une question : signalements × temps × sans-opinion ──────────
--
-- La comparaison demandée tient dans une seule requête : un pic de signalements sur une
-- question dont le temps médian explose et dont le taux de « sans opinion » monte, c'est
-- une question mal formulée. Les trois signaux séparés ne le disent pas.

create or replace function public.admin_question_health(
  p_questionnaire_version text default null,
  p_mode                  text default null
)
returns table (
  question_id           text,
  questionnaire_version text,
  shown_count           bigint,
  answered_count        bigint,
  no_opinion_count      bigint,
  no_opinion_rate       numeric,
  changed_count         bigint,
  change_rate           numeric,
  dwell_p25_ms          numeric,
  dwell_median_ms       numeric,
  dwell_p75_ms          numeric,
  dwell_p90_ms          numeric,
  capped_count          bigint,
  report_count          bigint
)
language plpgsql
stable
security definer
set search_path = pg_catalog, public, private, pg_temp
as $$
begin
  if not public.is_founder_admin() then
    raise exception 'Accès refusé' using errcode = 'insufficient_privilege';
  end if;

  return query
  with resp as (
    select r.question_id, r.questionnaire_version, r.response_state,
           r.active_dwell_ms, r.change_count, r.dwell_capped
      from private.quiz_responses r
      join private.quiz_attempts a on a.id = r.attempt_id
     where (p_questionnaire_version is null or r.questionnaire_version = p_questionnaire_version)
       and (p_mode is null or a.mode = p_mode)
  ),
  agg as (
    select resp.question_id,
           resp.questionnaire_version,
           count(*)                                                          as shown_count,
           count(*) filter (where resp.response_state = 'answered')          as answered_count,
           count(*) filter (where resp.response_state = 'no_opinion')        as no_opinion_count,
           count(*) filter (where resp.change_count > 0)                     as changed_count,
           count(*) filter (where resp.dwell_capped)                         as capped_count,
           -- PERCENTILES, pas moyennes : un onglet laissé ouvert déplace une moyenne de
           -- plusieurs minutes et ne déplace pas une médiane.
           percentile_cont(0.25) within group (order by resp.active_dwell_ms) as p25,
           percentile_cont(0.50) within group (order by resp.active_dwell_ms) as p50,
           percentile_cont(0.75) within group (order by resp.active_dwell_ms) as p75,
           percentile_cont(0.90) within group (order by resp.active_dwell_ms) as p90
      from resp
     group by resp.question_id, resp.questionnaire_version
  )
  select agg.question_id,
         agg.questionnaire_version,
         agg.shown_count,
         agg.answered_count,
         agg.no_opinion_count,
         round(agg.no_opinion_count::numeric / nullif(agg.shown_count, 0), 4) as no_opinion_rate,
         agg.changed_count,
         round(agg.changed_count::numeric   / nullif(agg.shown_count, 0), 4) as change_rate,
         round(agg.p25::numeric) , round(agg.p50::numeric),
         round(agg.p75::numeric) , round(agg.p90::numeric),
         agg.capped_count,
         coalesce((select count(*) from private.question_reports qr
                    where qr.question_id = agg.question_id
                      and qr.questionnaire_version = agg.questionnaire_version), 0) as report_count
    from agg
   order by report_count desc, agg.no_opinion_count desc;
end;
$$;


-- ─── 3. Entonnoir d'abandon par position dans la file ───────────────────────

create or replace function public.admin_dropoff_by_position(p_mode text default null)
returns table (
  mode            text,
  sequence_index  integer,
  reached         bigint,
  answered        bigint,
  abandoned_here  bigint
)
language plpgsql
stable
security definer
set search_path = pg_catalog, public, private, pg_temp
as $$
begin
  if not public.is_founder_admin() then
    raise exception 'Accès refusé' using errcode = 'insufficient_privilege';
  end if;

  return query
  with last_seen as (
    select r.attempt_id, max(r.sequence_index) as last_index
      from private.quiz_responses r
     group by r.attempt_id
  )
  select a.mode,
         r.sequence_index,
         count(*)                                                   as reached,
         count(*) filter (where r.response_state = 'answered')      as answered,
         count(*) filter (where a.completed_at is null
                            and ls.last_index = r.sequence_index)   as abandoned_here
    from private.quiz_responses r
    join private.quiz_attempts a on a.id = r.attempt_id
    join last_seen ls            on ls.attempt_id = r.attempt_id
   where r.sequence_index is not null
     and (p_mode is null or a.mode = p_mode)
   group by a.mode, r.sequence_index
   order by a.mode, r.sequence_index;
end;
$$;


-- ─── 4. Première exposition vs réexposition ─────────────────────────────────

create or replace function public.admin_reexposure_comparison(p_questionnaire_version text default null)
returns table (
  question_id       text,
  first_pass_median numeric,
  repeat_median     numeric,
  repeat_share      numeric
)
language plpgsql
stable
security definer
set search_path = pg_catalog, public, private, pg_temp
as $$
begin
  if not public.is_founder_admin() then
    raise exception 'Accès refusé' using errcode = 'insufficient_privilege';
  end if;

  return query
  select r.question_id,
         round(percentile_cont(0.5) within group (
           order by case when r.presentation_count <= 1 then r.active_dwell_ms end)::numeric) as first_pass_median,
         round(percentile_cont(0.5) within group (
           order by case when r.presentation_count >  1 then r.active_dwell_ms end)::numeric) as repeat_median,
         round((count(*) filter (where r.presentation_count > 1))::numeric
               / nullif(count(*), 0), 4) as repeat_share
    from private.quiz_responses r
   where (p_questionnaire_version is null or r.questionnaire_version = p_questionnaire_version)
   group by r.question_id
   order by repeat_share desc;
end;
$$;


-- ─── 5. Qualification d'un signalement ──────────────────────────────────────

create or replace function public.admin_update_question_report(
  p_report_id        uuid,
  p_status           private.report_status default null,
  p_priority         smallint default null,
  p_admin_notes      text default null,
  p_fixed_in_version text default null
)
returns private.report_status
language plpgsql
security definer
set search_path = pg_catalog, public, private, pg_temp
as $$
declare
  v_status private.report_status;
begin
  -- `founder` uniquement : qualifier un signalement, c'est écrire dans la base.
  if not public.has_admin_role(array['founder']) then
    raise exception 'Accès refusé' using errcode = 'insufficient_privilege';
  end if;

  update private.question_reports r
     set status           = coalesce(p_status, r.status),
         priority         = coalesce(p_priority, r.priority),
         admin_notes      = coalesce(p_admin_notes, r.admin_notes),
         fixed_in_version = coalesce(p_fixed_in_version, r.fixed_in_version),
         -- Cohérence avec la contrainte `question_reports_resolved_consistency` : les états
         -- terminaux portent une date, les autres n'en portent pas.
         resolved_at      = case
                              when coalesce(p_status, r.status) in ('rejected', 'fixed')
                                then coalesce(r.resolved_at, now())
                              else null
                            end,
         resolved_by      = case
                              when coalesce(p_status, r.status) in ('rejected', 'fixed')
                                then coalesce(r.resolved_by, auth.uid())
                              else null
                            end
   where r.id = p_report_id
  returning r.status into v_status;

  if v_status is null then
    raise exception 'Signalement % introuvable', p_report_id using errcode = 'no_data_found';
  end if;

  return v_status;
end;
$$;


-- ─── 6. Export agrégé ───────────────────────────────────────────────────────
--
-- Export de RÉSULTATS AGRÉGÉS, comme demandé : ni commentaire libre, ni identifiant de
-- session, ni horodatage individuel. Un export de lignes brutes serait une extraction
-- d'opinions pseudonymes hors du périmètre de collecte.

create or replace function public.admin_export_report_aggregates(p_questionnaire_version text default null)
returns table (
  question_id           text,
  questionnaire_version text,
  category              private.report_category,
  status                private.report_status,
  report_count          bigint,
  first_reported_at     timestamptz,
  last_reported_at      timestamptz
)
language plpgsql
stable
security definer
set search_path = pg_catalog, public, private, pg_temp
as $$
begin
  if not public.is_founder_admin() then
    raise exception 'Accès refusé' using errcode = 'insufficient_privilege';
  end if;

  return query
    select r.question_id, r.questionnaire_version, r.category, r.status,
           count(*) as report_count,
           min(r.created_at) as first_reported_at,
           max(r.created_at) as last_reported_at
      from private.question_reports r
     where (p_questionnaire_version is null or r.questionnaire_version = p_questionnaire_version)
     group by r.question_id, r.questionnaire_version, r.category, r.status
     order by report_count desc;
end;
$$;


-- ─── 7. Privilèges ──────────────────────────────────────────────────────────
--
-- `revoke from public` D'ABORD : sans cela, `anon` hérite d'`execute` par défaut et une
-- fonction `security definer` lisant `private` devient une porte ouverte — la faille
-- exacte corrigée par 20260809120000 sur les RPC `founder_*`.

do $$
declare
  fn text;
begin
  foreach fn in array array[
    'public.admin_question_reports(private.report_status, private.report_category, text, integer)',
    'public.admin_question_health(text, text)',
    'public.admin_dropoff_by_position(text)',
    'public.admin_reexposure_comparison(text)',
    'public.admin_update_question_report(uuid, private.report_status, smallint, text, text)',
    'public.admin_export_report_aggregates(text)'
  ] loop
    execute format('revoke all on function %s from public', fn);
    if exists (select 1 from pg_roles where rolname = 'anon') then
      execute format('revoke all on function %s from anon', fn);
    end if;
    -- `authenticated` peut APPELER ; le corps de la fonction refuse si la personne n'est
    -- pas administratrice. Deux barrières distinctes, volontairement.
    if exists (select 1 from pg_roles where rolname = 'authenticated') then
      execute format('grant execute on function %s to authenticated', fn);
    end if;
    if exists (select 1 from pg_roles where rolname = 'service_role') then
      execute format('grant execute on function %s to service_role', fn);
    end if;
  end loop;
end $$;

-- Le type `private.report_status` apparaît dans la signature de RPC appelables par
-- `authenticated` : sans `usage` sur le TYPE, PostgREST échoue à résoudre l'appel.
-- `usage` sur un type énuméré ne donne accès à aucune donnée.
do $$
begin
  if exists (select 1 from pg_roles where rolname = 'authenticated') then
    execute 'grant usage on type private.report_status   to authenticated';
    execute 'grant usage on type private.report_category to authenticated';
  end if;
  if exists (select 1 from pg_roles where rolname = 'anon') then
    execute 'revoke all on type private.report_status   from anon';
    execute 'revoke all on type private.report_category from anon';
  end if;
end $$;
