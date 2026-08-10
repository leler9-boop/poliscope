-- POLISCOP — Durées de conservation et purge.
--
-- PRINCIPE : la durée est une DONNÉE de la base, pas un commentaire dans un document. Elle
-- est lisible, testable, et la purge la lit — impossible de documenter 6 mois et d'en garder
-- 36 sans que la table et la fonction ne divergent visiblement.
--
-- « Conserver un maximum de données » n'est pas une finalité recevable. Chaque durée
-- ci-dessous porte sa justification dans la colonne `rationale`.

create table if not exists private.retention_policies (
  data_class     text primary key,
  retention      interval not null,
  action         text not null check (action in ('delete', 'redact')),
  rationale      text not null,
  updated_at     timestamptz not null default now()
);

comment on table private.retention_policies is
  'Durées de conservation appliquées par private.run_retention(). Modifier ici change le comportement réel.';

insert into private.retention_policies (data_class, retention, action, rationale) values

  ('attempt_timing_detail', interval '6 months', 'redact',
   'Horodatages fins et temps par question : granularité la plus ré-identifiante (rythme de '
   'frappe, heure de connexion). Six mois suffisent à mesurer et corriger l''ergonomie du '
   'questionnaire ; au-delà, seuls les agrégats ont un intérêt. Les colonnes sont vidées, '
   'l''état de réponse est conservé.'),

  ('abandoned_attempts', interval '90 days', 'delete',
   'Passation jamais terminée et sans activité depuis 90 jours : la personne n''a pas été '
   'au bout, rien ne justifie de conserver un parcours partiel au-delà de l''analyse '
   'd''abandon du trimestre en cours.'),

  ('quiz_responses', interval '25 months', 'delete',
   'Réponses pseudonymisées. Durée alignée sur un cycle électoral complet (présidentielle '
   'du 18/04/2027 + rétrospective) et sur le plafond de 25 mois retenu par la CNIL pour la '
   'mesure d''audience. Au-delà, la comparaison n''a plus de valeur méthodologique : le '
   'questionnaire lui-même aura changé de version.'),

  ('question_reports', interval '12 months', 'redact',
   'Signalement résolu : le commentaire libre est effacé 12 mois après résolution — il peut '
   'contenir du texte rédigé par une personne. La catégorie, la question et le statut sont '
   'conservés : ce sont les données qui servent au pilotage éditorial et elles ne sont pas '
   'ré-identifiantes.'),

  ('technical_logs', interval '24 hours', 'delete',
   'Compteurs de limitation de débit. Aucune valeur analytique, uniquement opérationnelle : '
   'la fenêtre utile se compte en minutes.'),

  ('consent_records', interval '36 months', 'delete',
   'Preuve du consentement (RGPD art. 7 §1). Conservée au-delà des données qu''elle '
   'autorise : une preuve détruite avant la donnée rendrait le traitement indéfendable. '
   '36 mois après la DERNIÈRE décision du sujet, prescription des actions courantes.')

on conflict (data_class) do update set
  retention = excluded.retention,
  action    = excluded.action,
  rationale = excluded.rationale,
  updated_at = now();


-- ─── Purge ──────────────────────────────────────────────────────────────────
--
-- Idempotente, journalisée, et déclarative : elle LIT `retention_policies`. Prévue pour un
-- `pg_cron` quotidien (`select private.run_retention();`) — voir
-- docs/data-platform/retention.md pour l'activation, qui suppose l'extension pg_cron.

create table if not exists private.retention_runs (
  id         uuid primary key default gen_random_uuid(),
  ran_at     timestamptz not null default now(),
  summary    jsonb not null
);

create or replace function private.run_retention()
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, private, pg_temp
as $$
declare
  v_summary jsonb := '{}'::jsonb;
  v_n       bigint;
  v_ret     interval;
begin
  -- La purge est le SEUL contexte autorisé à supprimer une réponse « sans opinion ».
  -- Drapeau local à la transaction : il ne fuit pas vers la requête suivante.
  perform set_config('poliscop.purge', 'on', true);

  -- 1. Détail de chronométrage — REDACTION, pas suppression. La réponse survit, sa
  --    granularité temporelle disparaît.
  select retention into v_ret from private.retention_policies where data_class = 'attempt_timing_detail';
  update private.quiz_responses r
     set first_shown_at   = null,
         last_shown_at    = null,
         answered_at      = null,
         active_dwell_ms  = null,
         total_elapsed_ms = null,
         sequence_index   = null
    from private.quiz_attempts a
   where a.id = r.attempt_id
     and a.started_at < now() - v_ret
     and (r.first_shown_at is not null or r.active_dwell_ms is not null);
  get diagnostics v_n = row_count;
  v_summary := v_summary || jsonb_build_object('timing_detail_redacted', v_n);

  -- 2. Passations abandonnées.
  select retention into v_ret from private.retention_policies where data_class = 'abandoned_attempts';
  delete from private.quiz_attempts
   where completed_at is null
     and last_activity_at < now() - v_ret;
  get diagnostics v_n = row_count;
  v_summary := v_summary || jsonb_build_object('abandoned_attempts_deleted', v_n);

  -- 3. Réponses au-delà de la durée de conservation : la passation entière part (cascade).
  select retention into v_ret from private.retention_policies where data_class = 'quiz_responses';
  delete from private.quiz_attempts where started_at < now() - v_ret;
  get diagnostics v_n = row_count;
  v_summary := v_summary || jsonb_build_object('attempts_deleted', v_n);

  -- 4. Signalements résolus : seul le texte libre est effacé.
  select retention into v_ret from private.retention_policies where data_class = 'question_reports';
  update private.question_reports
     set comment = null, admin_notes = null
   where resolved_at is not null
     and resolved_at < now() - v_ret
     and (comment is not null or admin_notes is not null);
  get diagnostics v_n = row_count;
  v_summary := v_summary || jsonb_build_object('reports_redacted', v_n);

  -- 5. Journaux techniques.
  select retention into v_ret from private.retention_policies where data_class = 'technical_logs';
  delete from private.ingest_rate_limits where window_start < now() - v_ret;
  get diagnostics v_n = row_count;
  v_summary := v_summary || jsonb_build_object('rate_limit_rows_deleted', v_n);

  -- 6. Preuves de consentement — supprimées EN DERNIER, et seulement si le sujet n'a plus
  --    aucune décision récente. Le trigger append-only est contourné explicitement pour ce
  --    seul cas, sous le drapeau de purge.
  select retention into v_ret from private.retention_policies where data_class = 'consent_records';
  delete from private.consent_records c
   where c.decided_at < now() - v_ret
     and not exists (
       select 1 from private.consent_records c2
        where c2.decided_at >= now() - v_ret
          and ((c.user_id is not null and c2.user_id = c.user_id)
            or (c.anonymous_session_id is not null
                and c2.anonymous_session_id = c.anonymous_session_id))
     );
  get diagnostics v_n = row_count;
  v_summary := v_summary || jsonb_build_object('consent_records_deleted', v_n);

  insert into private.retention_runs (summary) values (v_summary);
  return v_summary;
end;
$$;

-- Le trigger append-only bloquerait l'étape 6 : il apprend à reconnaître la purge.
create or replace function private.forbid_mutation()
returns trigger
language plpgsql
set search_path = pg_catalog, private, pg_temp
as $$
begin
  -- Une suppression sous drapeau de purge est légitime : c'est l'exécution de la durée de
  -- conservation annoncée, pas une réécriture de l'histoire. Un UPDATE reste interdit en
  -- toutes circonstances — une preuve qui se modifie n'est plus une preuve.
  if tg_op = 'DELETE' and coalesce(current_setting('poliscop.purge', true), 'off') = 'on' then
    return old;
  end if;

  raise exception
    'Table % en journal append-only : % interdit. Ajouter une nouvelle ligne de décision.',
    tg_table_name, tg_op
    using errcode = 'restrict_violation';
end;
$$;


-- ─── Privilèges ─────────────────────────────────────────────────────────────

do $$
begin
  execute 'alter table private.retention_policies enable row level security';
  execute 'alter table private.retention_policies force  row level security';
  execute 'alter table private.retention_runs     enable row level security';
  execute 'alter table private.retention_runs     force  row level security';

  execute 'revoke all on table private.retention_policies from public';
  execute 'revoke all on table private.retention_runs     from public';
  execute 'revoke all on function private.run_retention()  from public';

  if exists (select 1 from pg_roles where rolname = 'anon') then
    execute 'revoke all on table private.retention_policies from anon';
    execute 'revoke all on table private.retention_runs     from anon';
    execute 'revoke all on function private.run_retention() from anon';
  end if;
  if exists (select 1 from pg_roles where rolname = 'authenticated') then
    execute 'revoke all on table private.retention_policies from authenticated';
    execute 'revoke all on table private.retention_runs     from authenticated';
    execute 'revoke all on function private.run_retention() from authenticated';
  end if;
  if exists (select 1 from pg_roles where rolname = 'service_role') then
    execute 'grant select, insert, update, delete on table private.retention_policies to service_role';
    execute 'grant select, insert on table private.retention_runs to service_role';
    execute 'grant execute on function private.run_retention() to service_role';
  end if;
end $$;
