-- ============================================================================
-- POLISCOP — 20260809120000_admin_authorization
--
-- Autorisation du tableau de bord fondateur + fermeture deny-by-default de TOUTES les
-- fonctions du schéma `public`.
--
-- HISTORIQUE DES DEUX ERREURS CORRIGÉES ICI
-- -----------------------------------------
-- 1. `supabase/schema_v7_admin_security.sql` (obsolète, neutralisé) révoquait les droits puis
--    VÉRIFIAIT un garde interne qu'il n'ajoutait jamais : elle échouait toujours.
-- 2. La première version de CE fichier ne traitait que `founder_*` et se contentait d'ASSERTER
--    qu'aucune fonction publique n'était exécutable par `anon`. Appliquée sur la vraie chaîne
--    de migrations, elle échouait :
--
--        ERROR: Fonctions encore exécutables par anon : set_updated_at()
--
--    `public.set_updated_at()` est créée par `20260612_fix_rls_and_constraints.sql`. Comme
--    toute fonction PostgreSQL, elle reçoit EXECUTE à PUBLIC à la création. Une assertion ne
--    corrige rien : il faut RÉVOQUER.
--
-- MODÈLE DE PRIVILÈGES
-- --------------------
-- Deny-by-default sur l'ensemble du schéma `public` :
--   a) révocation d'EXECUTE à PUBLIC / anon / authenticated sur TOUTES les fonctions ;
--   b) re-GRANT uniquement selon l'allowlist déclarée ci-dessous, nommément ;
--   c) les fonctions de TRIGGER ne sont jamais accordées à un rôle client — PostgreSQL ne
--      vérifie EXECUTE qu'au CREATE TRIGGER, pas à l'exécution : révoquer ne casse rien
--      (prouvé par le test 12 du banc d'essai) ;
--   d) toute fonction non-trigger, actuellement exécutable par un client et ABSENTE de
--      l'allowlist fait ÉCHOUER la migration avec un diagnostic — c'est un arbitrage humain,
--      pas une décision à prendre automatiquement (la révoquer pourrait casser le frontend).
--
-- Les RPC `founder_*` gardent leur corps : on renomme l'implémentation en `founder_impl_*`
-- et on crée un wrapper de même signature portant le contrôle d'autorisation. Recopier
-- 400 lignes de corps aurait garanti une divergence au premier changement.
--
-- Idempotente et re-jouable. Vérifie ses préconditions AVANT toute mutation.
-- Rollback : supabase/rollbacks/20260809120000_admin_authorization_rollback.sql
-- ============================================================================

begin;

-- ─── 0. Préconditions — échouer avant de muter quoi que ce soit ──────────────

do $$
declare
  expected text[] := array[
    'founder_get_growth()',
    'founder_get_candidates()',
    'founder_get_archetypes()',
    'founder_get_compass()',
    'founder_get_events(integer)',
    'founder_get_top_skipped(integer)',
    'founder_get_gender_scores()',
    'founder_get_commune_scores()',
    'founder_get_demographics_quality()'
  ];
  sig        text;
  missing    text[] := '{}';
  unexpected text[] := '{}';
  r          record;
begin
  foreach sig in array expected loop
    if to_regprocedure('public.' || sig) is null
       and to_regprocedure('public.' || replace(sig, 'founder_', 'founder_impl_')) is null then
      missing := missing || sig;
    end if;
  end loop;

  if array_length(missing, 1) > 0 then
    raise exception
      E'Préconditions non satisfaites — fonctions absentes : %.\nCette base ne correspond pas au dépôt : appliquer d''abord 20260614_founder_rpc_functions.sql.',
      array_to_string(missing, ', ');
  end if;

  -- `oid::regprocedure` normalise en `nom(types)` — sans les noms de paramètres.
  for r in
    select replace(p.oid::regprocedure::text, 'public.', '') as s
    from pg_proc p join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public'
      and p.proname like 'founder\_%'
      and p.proname not like 'founder\_impl\_%'
  loop
    if not (r.s = any(expected)) then
      unexpected := unexpected || r.s;
    end if;
  end loop;

  if array_length(unexpected, 1) > 0 then
    raise exception
      E'La production contient des fonctions founder_* inconnues du dépôt : %.\nLes inventorier et les ajouter à cette migration avant de continuer — les laisser ouvertes à anon serait une faille.',
      array_to_string(unexpected, ', ');
  end if;
end $$;


-- ─── 1. Liste d'autorisation des administrateurs ────────────────────────────

create table if not exists public.admin_users (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  role       text not null default 'founder' check (role in ('founder', 'analyst')),
  granted_at timestamptz not null default now(),
  granted_by uuid references auth.users(id),
  note       text
);

comment on table public.admin_users is
  'Liste d''autorisation des administrateurs. Provisionnée UNIQUEMENT via la clé service_role.';

alter table public.admin_users enable row level security;
alter table public.admin_users force row level security;

-- Aucune policy : inaccessible à anon comme à authenticated, quelle que soit l'opération.
revoke all on table public.admin_users from public, anon, authenticated;

-- `service_role` doit pouvoir provisionner les administrateurs depuis le back-office ou un
-- script serveur. Il porte BYPASSRLS dans Supabase, mais les GRANT de table restent
-- nécessaires : sans eux, l'insertion échoue malgré le bypass.
do $$
begin
  if exists (select 1 from pg_roles where rolname = 'service_role') then
    execute 'grant select, insert, update, delete on table public.admin_users to service_role';
  else
    raise notice 'Rôle service_role absent (base locale) — GRANT ignoré.';
  end if;
end $$;


-- ─── 2. Prédicats d'autorisation ────────────────────────────────────────────
--
-- `search_path` figé : sans lui, un objet piégé dans un schéma temporaire pourrait détourner
-- la résolution des noms à l'intérieur d'une fonction SECURITY DEFINER.

create or replace function public.has_admin_role(required_roles text[])
returns boolean
language sql
stable
security definer
set search_path = pg_catalog, public, pg_temp
as $$
  select exists (
    select 1 from public.admin_users a
    where a.user_id = auth.uid()
      and a.role = any(required_roles)
  );
$$;

comment on function public.has_admin_role(text[]) is
  'true si l''utilisateur courant possède l''un des rôles demandés. false pour anon. Jamais exposée aux clients.';

create or replace function public.is_founder_admin()
returns boolean
language sql
stable
security definer
set search_path = pg_catalog, public, pg_temp
as $$
  -- Consommée par le frontend pour décider s'il affiche le tableau de bord. `analyst` y a
  -- accès ; la restriction fine se joue fonction par fonction (étape 3).
  select public.has_admin_role(array['founder', 'analyst']);
$$;


-- ─── 3. Enveloppement des RPC fondateur ─────────────────────────────────────
--
-- RÔLES — distinction réelle, vérifiée par le test 6 du banc d'essai :
--   • `analyst` : volumétrie et parcours (croissance, événements, questions passées).
--   • `founder` : tout ce qui croise l'opinion avec une donnée démographique (genre, commune)
--     ou nomme un candidat / archétype — le plus ré-identifiant.

do $$
declare
  fn record;
  impl_name text;
  founder_only constant text[] := array[
    'founder_get_candidates', 'founder_get_archetypes', 'founder_get_compass',
    'founder_get_gender_scores', 'founder_get_commune_scores'
  ];
  roles_literal text;
begin
  for fn in
    select p.oid,
           p.proname,
           -- Types seuls, SANS nom de paramètre : regprocedure, ALTER FUNCTION et GRANT
           -- n'acceptent pas « days_back integer » comme identité de fonction.
           (select coalesce(string_agg(format_type(t, null), ', '), '')
              from unnest(p.proargtypes) t)          as argtypes,
           pg_get_function_arguments(p.oid)          as args_with_defaults,
           pg_get_function_result(p.oid)             as result_type,
           p.pronargs                                as nargs
    from pg_proc p join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public'
      and p.proname like 'founder\_%'
      and p.proname not like 'founder\_impl\_%'
    order by p.proname
  loop
    impl_name := replace(fn.proname, 'founder_', 'founder_impl_');

    -- Idempotence : si `founder_impl_*` existe déjà, la fonction publique EST le wrapper
    -- d'une application précédente ; on le recrée au lieu de renommer une seconde fois.
    if to_regprocedure('public.' || impl_name || '(' || fn.argtypes || ')') is null then
      execute format('alter function public.%I(%s) rename to %I;', fn.proname, fn.argtypes, impl_name);
    end if;
    execute format('alter function public.%I(%s) set search_path = pg_catalog, public, pg_temp;', impl_name, fn.argtypes);

    roles_literal := case when fn.proname = any(founder_only)
                          then $q$array['founder']$q$
                          else $q$array['founder','analyst']$q$
                     end;

    execute format($tmpl$
      create or replace function public.%I(%s)
      returns %s
      language plpgsql
      security definer
      set search_path = pg_catalog, public, pg_temp
      as $body$
      begin
        if not public.has_admin_role(%s) then
          raise exception 'not_authorized' using errcode = '42501';
        end if;
        return public.%I(%s);
      end;
      $body$;
    $tmpl$,
      fn.proname, fn.args_with_defaults, fn.result_type, roles_literal,
      impl_name,
      (select coalesce(string_agg('$' || i::text, ', '), '') from generate_series(1, fn.nargs) i)
    );

    raise notice 'RPC fondateur enveloppée : % (rôles : %)', fn.proname, roles_literal;
  end loop;
end $$;


-- ─── 4. Fermeture deny-by-default de TOUT le schéma public ──────────────────
--
-- C'est l'étape qui manquait. Elle traite toutes les fonctions, pas seulement `founder_*` :
-- `set_updated_at()` (trigger, 20260612), et toute fonction héritée des schémas v3/v4/v6
-- éventuellement présente en production.

do $$
declare
  fn record;
  argtypes text;
  granted_roles text[];
  needs_arbitration text[] := '{}';
  revoked_triggers int := 0;
  -- ALLOWLIST — seul endroit où un accès client est accordé. Toute fonction absente d'ici
  -- perd son accès client (fonctions de trigger) ou fait échouer la migration (le reste).
  allow_authenticated constant text[] := array[
    'is_founder_admin',
    -- RPC de libre-service utilisateur des schémas v3/v5, si présentes en production.
    -- Elles agissent sur les données de l'appelant (auth.uid()) et doivent rester ouvertes
    -- aux comptes connectés — les fermer casserait l'export et la suppression RGPD.
    'delete_my_account', 'export_my_data', 'has_consent'
  ];
begin
  for fn in
    select p.oid,
           p.proname,
           p.prorettype = 'pg_catalog.trigger'::regtype as is_trigger,
           (select coalesce(string_agg(format_type(t, null), ', '), '')
              from unnest(p.proargtypes) t) as argtypes,
           has_function_privilege('anon', p.oid, 'execute')          as anon_can,
           has_function_privilege('authenticated', p.oid, 'execute') as auth_can
    from pg_proc p join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public' and p.prokind = 'f'
  loop
    argtypes := fn.argtypes;

    -- (a) révocation systématique
    execute format('revoke all on function public.%I(%s) from public, anon, authenticated;',
                   fn.proname, argtypes);

    -- (c) fonction de trigger : jamais de droit client. PostgreSQL ne contrôle EXECUTE qu'au
    -- CREATE TRIGGER ; le déclenchement n'en dépend pas. Révoquer est donc sans effet
    -- fonctionnel — le test 12 du banc d'essai le prouve sur une UPDATE réelle par anon.
    if fn.is_trigger then
      if fn.anon_can or fn.auth_can then revoked_triggers := revoked_triggers + 1; end if;
      continue;
    end if;

    -- (b) re-GRANT nommément
    granted_roles := '{}';
    if fn.proname = any(allow_authenticated) or fn.proname like 'founder\_%' then
      if fn.proname not like 'founder\_impl\_%' then
        execute format('grant execute on function public.%I(%s) to authenticated;', fn.proname, argtypes);
        granted_roles := array['authenticated'];
      end if;
    end if;

    -- (d) arbitrage humain requis : elle était ouverte, elle n'est pas dans l'allowlist.
    --
    -- Exception — les internes que CETTE migration ferme délibérément : `has_admin_role`
    -- (prédicat) et les `founder_impl_*` (implémentations enveloppées). Elles apparaissent
    -- comme « ouvertes » parce que le catalogue a été lu avant la révocation du même run.
    -- Les signaler serait un faux positif qui bloquerait chaque application.
    if array_length(granted_roles, 1) is null
       and (fn.anon_can or fn.auth_can)
       and fn.proname <> 'has_admin_role'
       and fn.proname not like 'founder\_impl\_%'
    then
      needs_arbitration := needs_arbitration || (fn.proname || '(' || argtypes || ')');
    end if;
  end loop;

  if revoked_triggers > 0 then
    raise notice 'Fonctions de trigger fermées aux clients : % (sans effet sur le déclenchement).', revoked_triggers;
  end if;

  if array_length(needs_arbitration, 1) > 0 then
    raise exception
      E'Fonctions publiques exposées aux clients et absentes de l''allowlist : %.\nElles viennent d''une génération de schéma non inventoriée. Décider explicitement, fonction par fonction, puis les ajouter à `allow_authenticated` (ou les laisser fermées) avant de rejouer cette migration. Ne pas les révoquer à l''aveugle : le frontend peut en dépendre.',
      array_to_string(needs_arbitration, ', ');
  end if;
end $$;


-- ─── 5. Contrôles finaux ────────────────────────────────────────────────────

do $$
declare
  fn     record;
  leaks  text[] := '{}';
  nosafe text[] := '{}';
begin
  -- a) plus aucune fonction exécutable par anon
  for fn in
    select p.oid::regprocedure::text as sig
    from pg_proc p join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public' and has_function_privilege('anon', p.oid, 'execute')
  loop
    leaks := leaks || fn.sig;
  end loop;
  if array_length(leaks, 1) > 0 then
    raise exception 'Fonctions encore exécutables par anon : %', array_to_string(leaks, ', ');
  end if;

  -- b) aucune implémentation interne accessible à un client
  for fn in
    select p.oid::regprocedure::text as sig
    from pg_proc p join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public'
      and (p.proname like 'founder\_impl\_%' or p.proname = 'has_admin_role')
      and has_function_privilege('authenticated', p.oid, 'execute')
  loop
    leaks := leaks || fn.sig;
  end loop;
  if array_length(leaks, 1) > 0 then
    raise exception 'Implémentations internes exposées : %', array_to_string(leaks, ', ');
  end if;

  -- c) toute fonction SECURITY DEFINER a un search_path figé
  for fn in
    select p.oid::regprocedure::text as sig, p.proconfig
    from pg_proc p join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public' and p.prosecdef
  loop
    if fn.proconfig is null
       or not exists (select 1 from unnest(fn.proconfig) c where c like 'search\_path=%') then
      nosafe := nosafe || fn.sig;
    end if;
  end loop;
  if array_length(nosafe, 1) > 0 then
    raise exception 'SECURITY DEFINER sans search_path figé : %', array_to_string(nosafe, ', ');
  end if;

  -- d) chaque wrapper founder_* porte bien le garde d'autorisation
  for fn in
    select p.proname, pg_get_functiondef(p.oid) as def
    from pg_proc p join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public'
      and p.proname like 'founder\_%'
      and p.proname not like 'founder\_impl\_%'
  loop
    if position('has_admin_role' in fn.def) = 0 then
      raise exception 'Wrapper sans garde d''autorisation : %', fn.proname;
    end if;
  end loop;
end $$;

commit;

-- ============================================================================
-- PROVISIONNEMENT D'UN ADMINISTRATEUR (clé service_role uniquement) :
--   insert into public.admin_users (user_id, role, note)
--   values ('<uuid>', 'founder', 'ajouté le <date> par <personne>');
--
-- VÉRIFICATION : docs/security/production-audit-runbook.md
-- ROLLBACK    : supabase/rollbacks/20260809120000_admin_authorization_rollback.sql
-- ============================================================================
