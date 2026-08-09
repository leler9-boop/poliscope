-- ============================================================================
-- POLISCOP — Rollback de 20260809120000_admin_authorization
--
-- Restaure l'état antérieur : les implémentations reprennent leur nom public et leurs
-- droits d'origine, les prédicats d'autorisation sont supprimés.
--
-- ⚠ APRÈS CE ROLLBACK, LES AGRÉGATS REDEVIENNENT APPELABLES PAR `anon`.
-- Ne l'exécuter que pour restaurer un service pendant un incident, et refermer ensuite.
--
-- `admin_users` n'est PAS supprimée : elle ne casse rien et sa suppression ferait perdre
-- la liste des administrateurs. La retirer explicitement si nécessaire (voir en bas).
-- ============================================================================

begin;

do $$
declare
  fn record;
  public_name text;
begin
  for fn in
    -- Types seuls, sans nom de paramètre : `regprocedure`, ALTER FUNCTION et GRANT
    -- n'acceptent pas « days_back integer » comme identité de fonction.
    select p.proname,
           (select coalesce(string_agg(format_type(t, null), ', '), '')
              from unnest(p.proargtypes) t) as argtypes
    from pg_proc p join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public' and p.proname like 'founder\_impl\_%'
  loop
    public_name := replace(fn.proname, 'founder_impl_', 'founder_');

    -- Supprimer le wrapper s'il existe encore
    if to_regprocedure('public.' || public_name || '(' || fn.argtypes || ')') is not null then
      execute format('drop function public.%I(%s);', public_name, fn.argtypes);
    end if;

    execute format('alter function public.%I(%s) rename to %I;', fn.proname, fn.argtypes, public_name);
    -- Droits d'origine tels que définis par 20260614_founder_rpc_functions.sql
    execute format('revoke all on function public.%I(%s) from public;', public_name, fn.argtypes);
    execute format('grant execute on function public.%I(%s) to anon;', public_name, fn.argtypes);
    execute format('grant execute on function public.%I(%s) to authenticated;', public_name, fn.argtypes);

    raise notice 'restaurée : %', public_name;
  end loop;
end $$;

drop function if exists public.is_founder_admin();
drop function if exists public.has_admin_role(text[]);

commit;

-- Suppression complète de la liste d'autorisation (destructif — décommenter sciemment) :
--   drop table if exists public.admin_users;
