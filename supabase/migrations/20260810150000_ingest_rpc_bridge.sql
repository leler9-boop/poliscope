-- POLISCOP — Pont RPC pour l'Edge Function d'ingestion.
--
-- POURQUOI CE PONT EXISTE
-- -----------------------
-- PostgREST ne sert que les schémas déclarés dans `api.schemas` (config.toml) — et
-- `private` en est volontairement absent. Conséquence directe : même avec la clé
-- `service_role`, `supabase.rpc('ingest_attempt')` ne peut PAS atteindre
-- `private.ingest_attempt`. La solution paresseuse serait d'ajouter `private` aux schémas
-- exposés ; ce serait détruire le modèle de confidentialité pour une commodité d'appel.
--
-- À la place : deux fonctions `public`, minces, sans logique métier, réservées à
-- `service_role`. Elles ne font que router vers `private`. Un client anonyme ou connecté
-- n'a AUCUN privilège d'exécution dessus — vérifié par le manifeste de parité (test 15) et
-- par le test 22 de data_platform.test.sql.

create or replace function public.ingest_v1(p_type text, p_payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public, private, pg_temp
as $$
declare
  v_result jsonb;
begin
  -- Aiguillage sur une liste FERMÉE. Un type inconnu échoue, il n'est pas ignoré.
  case p_type
    when 'consent' then
      v_result := jsonb_build_object('consent_id', private.record_consent(p_payload));

    when 'attempt' then
      v_result := jsonb_build_object('attempt_id', private.ingest_attempt(p_payload));

    when 'responses' then
      v_result := private.ingest_responses(
        (p_payload->>'attempt_id')::uuid,
        p_payload->'items'
      );

    when 'report' then
      v_result := jsonb_build_object('report_id', private.ingest_report(p_payload));

    else
      raise exception 'Type d''ingestion refusé : %', p_type
        using errcode = 'invalid_parameter_value';
  end case;

  return v_result;
end;
$$;

comment on function public.ingest_v1(text, jsonb) is
  'Point d''entrée unique de l''Edge Function d''ingestion. Réservé à service_role — aucun client.';


create or replace function public.ingest_rate_limit_v1(
  p_bucket_key     text,
  p_max_hits       integer,
  p_window_seconds integer
)
returns boolean
language sql
security definer
set search_path = pg_catalog, public, private, pg_temp
as $$
  select private.check_rate_limit(p_bucket_key, p_max_hits, p_window_seconds);
$$;


-- ─── Privilèges : service_role et personne d'autre ──────────────────────────
--
-- `revoke from public` en premier — sans quoi `anon` hérite d'EXECUTE par défaut et
-- l'ingestion devient appelable directement, contournant validation, CORS et débit.

do $$
declare
  fn text;
begin
  foreach fn in array array[
    'public.ingest_v1(text, jsonb)',
    'public.ingest_rate_limit_v1(text, integer, integer)'
  ] loop
    execute format('revoke all on function %s from public', fn);
    if exists (select 1 from pg_roles where rolname = 'anon') then
      execute format('revoke all on function %s from anon', fn);
    end if;
    if exists (select 1 from pg_roles where rolname = 'authenticated') then
      execute format('revoke all on function %s from authenticated', fn);
    end if;
    if exists (select 1 from pg_roles where rolname = 'service_role') then
      execute format('grant execute on function %s to service_role', fn);
    end if;
  end loop;
end $$;
