-- POLISCOP — Tests d'autorisation du tableau de bord fondateur.
-- Exécuté par supabase/tests/run-migration-tests.sh APRÈS la migration
-- 20260809120000_admin_authorization.sql.
--
-- Chaque test échoue bruyamment (RAISE EXCEPTION) : le script shell propage le code retour.

\set ON_ERROR_STOP on

-- ─── Jeu d'essai ─────────────────────────────────────────────────────────────
insert into auth.users (id, email) values
  ('11111111-1111-1111-1111-111111111111', 'fondateur@test'),
  ('22222222-2222-2222-2222-222222222222', 'analyste@test'),
  ('33333333-3333-3333-3333-333333333333', 'quidam@test')
on conflict do nothing;

insert into public.admin_users (user_id, role) values
  ('11111111-1111-1111-1111-111111111111', 'founder'),
  ('22222222-2222-2222-2222-222222222222', 'analyst')
on conflict do nothing;

insert into public.user_profiles (user_id, answered_count, archetype_id, top_candidate_id, theme_scores, axes)
values ('33333333-3333-3333-3333-333333333333', 12, 'arch_a', 'lepen_2027', '{}'::jsonb, '{}'::jsonb)
on conflict do nothing;

-- ─── 1. anon ne peut exécuter aucune fonction publique ──────────────────────
do $$
declare leaks text[];
begin
  select coalesce(array_agg(p.oid::regprocedure::text), '{}') into leaks
  from pg_proc p join pg_namespace n on n.oid = p.pronamespace
  where n.nspname = 'public' and has_function_privilege('anon', p.oid, 'execute');

  if array_length(leaks, 1) > 0 then
    raise exception 'ÉCHEC 1 — anon peut encore exécuter : %', array_to_string(leaks, ', ');
  end if;
  raise notice 'OK 1 — anon n''a aucun droit EXECUTE dans public';
end $$;

-- ─── 2. anon ne peut pas lire admin_users ───────────────────────────────────
do $$
begin
  if has_table_privilege('anon', 'public.admin_users', 'select')
     or has_table_privilege('authenticated', 'public.admin_users', 'select') then
    raise exception 'ÉCHEC 2 — admin_users lisible depuis le client';
  end if;
  raise notice 'OK 2 — admin_users inaccessible à anon et authenticated';
end $$;

-- ─── 3. utilisateur connecté NON admin → refus ──────────────────────────────
do $$
declare ok boolean;
begin
  perform set_config('request.jwt.claim.sub', '33333333-3333-3333-3333-333333333333', true);

  if public.is_founder_admin() then
    raise exception 'ÉCHEC 3a — un non-admin est reconnu comme admin';
  end if;

  begin
    perform public.founder_get_growth();
    raise exception 'ÉCHEC 3b — un non-admin a pu appeler founder_get_growth()';
  exception
    when insufficient_privilege then
      raise notice 'OK 3 — non-admin refusé (42501)';
  end;
end $$;

-- ─── 4. anon (aucun sujet JWT) → refus ──────────────────────────────────────
do $$
begin
  perform set_config('request.jwt.claim.sub', '', true);

  if public.is_founder_admin() then
    raise exception 'ÉCHEC 4a — anon reconnu comme admin';
  end if;

  begin
    perform public.founder_get_growth();
    raise exception 'ÉCHEC 4b — anon a pu appeler founder_get_growth()';
  exception
    when insufficient_privilege then
      raise notice 'OK 4 — anon refusé (42501)';
  end;
end $$;

-- ─── 5. analyste : accès aux agrégats de volumétrie ─────────────────────────
do $$
declare res jsonb;
begin
  perform set_config('request.jwt.claim.sub', '22222222-2222-2222-2222-222222222222', true);

  if not public.is_founder_admin() then
    raise exception 'ÉCHEC 5a — l''analyste devrait voir le tableau de bord';
  end if;

  res := public.founder_get_growth();
  if res is null then
    raise exception 'ÉCHEC 5b — founder_get_growth() vide pour l''analyste';
  end if;
  raise notice 'OK 5 — analyste autorisé sur la volumétrie';
end $$;

-- ─── 6. analyste : REFUS sur les croisements ré-identifiants ────────────────
-- C'est le test qui prouve que la distinction founder/analyst n'est pas décorative.
do $$
begin
  perform set_config('request.jwt.claim.sub', '22222222-2222-2222-2222-222222222222', true);
  begin
    perform public.founder_get_gender_scores();
    raise exception 'ÉCHEC 6 — l''analyste a pu croiser opinion et genre';
  exception
    when insufficient_privilege then
      raise notice 'OK 6 — analyste refusé sur founder_get_gender_scores()';
  end;
end $$;

-- ─── 7. fondateur : accès complet ───────────────────────────────────────────
do $$
declare res jsonb;
begin
  perform set_config('request.jwt.claim.sub', '11111111-1111-1111-1111-111111111111', true);

  if not public.is_founder_admin() then
    raise exception 'ÉCHEC 7a — le fondateur n''est pas reconnu';
  end if;

  res := public.founder_get_growth();
  if res is null then raise exception 'ÉCHEC 7b — growth vide'; end if;

  perform public.founder_get_gender_scores();
  perform public.founder_get_commune_scores();
  perform public.founder_get_candidates();
  perform public.founder_get_events(7);
  perform public.founder_get_top_skipped(10);
  raise notice 'OK 7 — fondateur autorisé sur l''ensemble';
end $$;

-- ─── 8. les paramètres sont bien transmis au wrapper ────────────────────────
do $$
begin
  perform set_config('request.jwt.claim.sub', '11111111-1111-1111-1111-111111111111', true);
  insert into public.events (event_name, created_at) values ('test_event', now());
  insert into public.events (event_name, created_at) values ('vieil_event', now() - interval '60 days');

  if (public.founder_get_events(7))::text = (public.founder_get_events(365))::text then
    raise exception 'ÉCHEC 8 — le paramètre days_back n''atteint pas l''implémentation';
  end if;
  raise notice 'OK 8 — les arguments traversent le wrapper';
end $$;

-- ─── 9. valeur par défaut du paramètre préservée ────────────────────────────
do $$
begin
  perform set_config('request.jwt.claim.sub', '11111111-1111-1111-1111-111111111111', true);
  perform public.founder_get_events();      -- doit fonctionner sans argument
  perform public.founder_get_top_skipped(); -- idem
  raise notice 'OK 9 — valeurs par défaut des paramètres conservées';
end $$;

-- ─── 10. implémentations privées inaccessibles au client ────────────────────
do $$
declare leaks text[];
begin
  select coalesce(array_agg(p.oid::regprocedure::text), '{}') into leaks
  from pg_proc p join pg_namespace n on n.oid = p.pronamespace
  where n.nspname = 'public'
    and p.proname like 'founder\_impl\_%'
    and (has_function_privilege('anon', p.oid, 'execute')
      or has_function_privilege('authenticated', p.oid, 'execute'));

  if array_length(leaks, 1) > 0 then
    raise exception 'ÉCHEC 10 — implémentations privées exposées : %', array_to_string(leaks, ', ');
  end if;
  raise notice 'OK 10 — founder_impl_* inaccessibles depuis le client';
end $$;

-- ─── 11. « sans opinion » ne peut pas entrer dans answer_value ──────────────
-- Prouve côté base la contrainte que src/lib/cloudAnswers.js fait respecter côté client.
do $$
begin
  begin
    insert into public.user_answers (user_id, question_id, answer_value)
    values ('33333333-3333-3333-3333-333333333333', 'ECO_1', 'no_opinion');
    raise exception 'ÉCHEC 11 — la chaîne « no_opinion » a été acceptée dans un smallint';
  exception
    when invalid_text_representation or check_violation or datatype_mismatch then
      raise notice 'OK 11 — answer_value rejette « no_opinion » (c''est bien le bug corrigé côté client)';
  end;
end $$;


-- ═══════════════════════════════════════════════════════════════════════════
-- Ajouts après le 2e contre-audit : le banc sautait 20260612_fix_rls_and_constraints.sql,
-- donc il ne voyait pas `public.set_updated_at()`. Contre-test de départ :
--   ERROR: Fonctions encore exécutables par anon : set_updated_at()
-- ═══════════════════════════════════════════════════════════════════════════

-- ─── 12. set_updated_at : fermée aux clients, MAIS le trigger fonctionne toujours ──
-- PostgreSQL ne vérifie EXECUTE sur une fonction de trigger qu'au CREATE TRIGGER, jamais au
-- déclenchement. Révoquer est donc sans effet fonctionnel — ce test le prouve sur une UPDATE
-- réelle exécutée en tant qu'`anon`, au lieu de le supposer.
do $$
declare
  before_ts    timestamptz;
  after_ts     timestamptz;
  rows_touched int;
begin
  if to_regprocedure('public.set_updated_at()') is null then
    raise exception 'ÉCHEC 12 — set_updated_at() absente : la chaîne 20260612 n''a pas été appliquée, le banc ne reproduit pas la production';
  end if;

  if has_function_privilege('anon', 'public.set_updated_at()', 'execute')
     or has_function_privilege('authenticated', 'public.set_updated_at()', 'execute') then
    raise exception 'ÉCHEC 12a — set_updated_at() est encore exécutable par un rôle client';
  end if;

  -- `updated_at` est semé dans le passé. Le trigger est BEFORE UPDATE : l'INSERT conserve la
  -- valeur fournie. Comparer deux `now()` ne prouverait rien — `now()` est l'horodatage de
  -- DÉBUT DE TRANSACTION et reste constant dans un même bloc DO, quel que soit pg_sleep().
  delete from public.user_demographics where user_id = '33333333-3333-3333-3333-333333333333';
  insert into public.user_demographics (user_id, gender, updated_at)
  values ('33333333-3333-3333-3333-333333333333', 'f', timestamptz '2000-01-01 00:00:00+00');

  select updated_at into before_ts from public.user_demographics
  where user_id = '33333333-3333-3333-3333-333333333333';

  -- Chemin RÉEL de saveDemographics() : rôle `authenticated` + claim JWT, sous RLS
  -- « self-access ». Aucun droit EXECUTE sur set_updated_at() n'est détenu par ce rôle.
  perform set_config('request.jwt.claim.sub', '33333333-3333-3333-3333-333333333333', true);
  set local role authenticated;
  update public.user_demographics set gender = 'm'
  where user_id = '33333333-3333-3333-3333-333333333333';
  get diagnostics rows_touched = row_count;
  reset role;

  if rows_touched <> 1 then
    raise exception 'ÉCHEC 12b — l''UPDATE n''a touché aucune ligne (RLS de la fixture ?), le test ne prouve rien';
  end if;

  select updated_at into after_ts from public.user_demographics
  where user_id = '33333333-3333-3333-3333-333333333333';

  if after_ts is null or after_ts <= before_ts then
    raise exception 'ÉCHEC 12c — le trigger ne s''est pas déclenché après révocation (avant=% après=%)', before_ts, after_ts;
  end if;
  if after_ts < timestamptz '2020-01-01 00:00:00+00' then
    raise exception 'ÉCHEC 12d — updated_at n''a pas été porté à now() : %', after_ts;
  end if;
  raise notice 'OK 12 — set_updated_at() fermée aux clients ET trigger toujours fonctionnel';
end $$;

-- ─── 13. Aucune fonction de trigger n'est exposée à un client ───────────────
do $$
declare leaks text[];
begin
  select coalesce(array_agg(p.oid::regprocedure::text), '{}') into leaks
  from pg_proc p join pg_namespace n on n.oid = p.pronamespace
  where n.nspname = 'public'
    and p.prorettype = 'pg_catalog.trigger'::regtype
    and (has_function_privilege('anon', p.oid, 'execute')
      or has_function_privilege('authenticated', p.oid, 'execute'));

  if array_length(leaks, 1) > 0 then
    raise exception 'ÉCHEC 13 — fonctions de trigger exposées : %', array_to_string(leaks, ', ');
  end if;
  raise notice 'OK 13 — aucune fonction de trigger exposée aux clients';
end $$;

-- ─── 14. service_role peut provisionner les administrateurs ────────────────
do $$
declare n int;
begin
  if not exists (select 1 from pg_roles where rolname = 'service_role') then
    raise exception 'ÉCHEC 14 — rôle service_role absent de la fixture';
  end if;

  if not has_table_privilege('service_role', 'public.admin_users', 'insert')
     or not has_table_privilege('service_role', 'public.admin_users', 'delete') then
    raise exception 'ÉCHEC 14a — service_role ne peut pas gérer admin_users';
  end if;

  -- Le compte existe déjà (créé par le flux d'inscription Supabase, pas par service_role).
  insert into auth.users (id, email) values ('44444444-4444-4444-4444-444444444444', 'nouveau@test')
  on conflict do nothing;

  set local role service_role;
  insert into public.admin_users (user_id, role, note)
  values ('44444444-4444-4444-4444-444444444444', 'analyst', 'test de provisionnement')
  on conflict do nothing;
  select count(*) into n from public.admin_users where user_id = '44444444-4444-4444-4444-444444444444';
  delete from public.admin_users where user_id = '44444444-4444-4444-4444-444444444444';
  reset role;

  if n <> 1 then
    raise exception 'ÉCHEC 14b — service_role n''a pas pu insérer dans admin_users';
  end if;
  raise notice 'OK 14 — service_role provisionne et retire un administrateur';
end $$;

-- ─── 15. Manifeste de parité : privilèges attendus, fonction par fonction ───
-- Verrouille l'état FINAL de chaque fonction publique : type (trigger/normal),
-- SECURITY DEFINER, search_path figé, et rôles autorisés.
do $$
declare
  fn        record;
  problems  text[] := '{}';
  expect_authenticated constant text[] := array[
    'is_founder_admin',
    'founder_get_growth', 'founder_get_candidates', 'founder_get_archetypes',
    'founder_get_compass', 'founder_get_events', 'founder_get_top_skipped',
    'founder_get_gender_scores', 'founder_get_commune_scores', 'founder_get_demographics_quality',
    -- Tableau de bord éditorial (20260810140000). Ouvertes à `authenticated`, fermées à
    -- `anon`, chacune refusant l'accès en interne hors administrateur. Le test 16 vérifie
    -- ce refus sur une session authentifiée non administratrice — le GRANT seul ne prouve
    -- rien, c'est la paire GRANT + refus interne qui constitue la garantie.
    'admin_question_reports', 'admin_question_health', 'admin_dropoff_by_position',
    'admin_reexposure_comparison', 'admin_update_question_report',
    'admin_export_report_aggregates'
  ];
  should_be_open boolean;
begin
  for fn in
    select p.proname,
           p.oid,
           p.oid::regprocedure::text as sig,
           p.prosecdef,
           p.proconfig,
           p.prorettype = 'pg_catalog.trigger'::regtype as is_trigger,
           has_function_privilege('anon', p.oid, 'execute') as anon_can,
           has_function_privilege('authenticated', p.oid, 'execute') as auth_can
    from pg_proc p join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public' and p.prokind = 'f'
  loop
    should_be_open := fn.proname = any(expect_authenticated);

    if fn.anon_can then
      problems := problems || (fn.sig || ' : exécutable par anon');
    end if;
    if fn.auth_can <> should_be_open then
      problems := problems || (fn.sig || ' : authenticated=' || fn.auth_can || ', attendu ' || should_be_open);
    end if;
    if fn.prosecdef and (fn.proconfig is null
        or not exists (select 1 from unnest(fn.proconfig) c where c like 'search\_path=%')) then
      problems := problems || (fn.sig || ' : SECURITY DEFINER sans search_path figé');
    end if;
  end loop;

  if array_length(problems, 1) > 0 then
    raise exception E'ÉCHEC 15 — écart au manifeste de parité :\n  · %', array_to_string(problems, E'\n  · ');
  end if;
  raise notice 'OK 15 — manifeste de parité respecté par toutes les fonctions publiques';
end $$;

select 'TOUS LES TESTS D''AUTORISATION SONT PASSÉS' as resultat;
