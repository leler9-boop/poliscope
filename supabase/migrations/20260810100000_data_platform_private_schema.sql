-- POLISCOP — Plateforme de données : schéma de collecte non exposé.
--
-- POURQUOI UN SCHÉMA `private`
-- ----------------------------
-- PostgREST n'expose que les schémas déclarés dans `db-schemas` (par défaut `public`).
-- Tout ce qui touche à une opinion politique reliée à un identifiant pseudonyme vit donc
-- ici : même en cas d'erreur de RLS sur une table, il n'existe aucune route HTTP pour la
-- lire. `anon` et `authenticated` n'ont PAS `usage` sur ce schéma — la porte est fermée
-- avant même la question des policies.
--
-- L'écriture se fait exclusivement par la clé `service_role`, détenue par l'Edge Function
-- d'ingestion (`supabase/functions/ingest/`). Le frontend ne parle jamais à ces tables.
--
-- CE QUI N'EST PAS COLLECTÉ, par construction (pas par convention) :
--   • aucun User-Agent brut       — seule une catégorie d'appareil sur trois valeurs ;
--   • aucune adresse IP en clair  — l'Edge Function n'en persiste aucune forme ;
--   • aucun referrer, aucune URL externe, aucune donnée démographique ici.
--
-- Idempotent : réapplicable sans erreur (le banc d'essai le vérifie).

-- ─── 0. Schéma et fermeture par défaut ──────────────────────────────────────

create schema if not exists private;

comment on schema private is
  'Collecte pseudonyme. Jamais exposé par PostgREST. Écriture service_role uniquement.';

-- Fermeture explicite : ne jamais compter sur le fait que `db-schemas` n'inclut pas
-- `private`. Une modification de configuration ne doit pas suffire à ouvrir la porte.
revoke all on schema private from public;

do $$
begin
  if exists (select 1 from pg_roles where rolname = 'anon') then
    execute 'revoke all on schema private from anon';
  end if;
  if exists (select 1 from pg_roles where rolname = 'authenticated') then
    execute 'revoke all on schema private from authenticated';
  end if;
  if exists (select 1 from pg_roles where rolname = 'service_role') then
    execute 'grant usage on schema private to service_role';
  else
    raise notice 'Rôle service_role absent (base locale) — GRANT de schéma ignoré.';
  end if;
end $$;


-- ─── 1. Types énumérés ──────────────────────────────────────────────────────

do $$
begin
  -- État de réponse. `answered` et `no_opinion` sont les deux seuls états produits
  -- aujourd'hui par le produit ; les deux autres sont prévus pour rester extensibles
  -- SANS migration de contrainte, mais aucun bouton ne les émet (décision UX : ne pas
  -- multiplier les boutons sans justification).
  if not exists (select 1 from pg_type t join pg_namespace n on n.oid = t.typnamespace
                 where n.nspname = 'private' and t.typname = 'response_state') then
    create type private.response_state as enum (
      'answered',              -- une valeur 1–5 a été choisie
      'dont_know',             -- réservé — non émis par le client actuel
      'no_opinion',            -- « sans opinion » explicite : CONSERVÉ, jamais supprimé
      'prefer_not_to_answer'   -- réservé — non émis par le client actuel
    );
  end if;

  -- Catégorie d'appareil : trois valeurs, dérivées côté client de la largeur de viewport.
  -- Volontairement grossier — c'est l'anti-empreinte de terminal.
  if not exists (select 1 from pg_type t join pg_namespace n on n.oid = t.typnamespace
                 where n.nspname = 'private' and t.typname = 'device_category') then
    create type private.device_category as enum ('mobile', 'tablet', 'desktop');
  end if;

  -- Finalités de consentement. Une finalité = une case, non précochée, révocable.
  if not exists (select 1 from pg_type t join pg_namespace n on n.oid = t.typnamespace
                 where n.nspname = 'private' and t.typname = 'consent_purpose') then
    create type private.consent_purpose as enum (
      'measurement',         -- mesure d'audience, aucun contenu politique
      'political_analytics', -- réponses politiques anonymes + temps par question
      'cloud_save',          -- sauvegarde personnelle rattachée à un compte
      'research'             -- usage scientifique ultérieur — séparé, jamais précoché
    );
  end if;

  if not exists (select 1 from pg_type t join pg_namespace n on n.oid = t.typnamespace
                 where n.nspname = 'private' and t.typname = 'report_category') then
    create type private.report_category as enum (
      'unclear', 'biased', 'irrelevant', 'fact_error', 'outdated', 'technical', 'other'
    );
  end if;

  if not exists (select 1 from pg_type t join pg_namespace n on n.oid = t.typnamespace
                 where n.nspname = 'private' and t.typname = 'report_status') then
    create type private.report_status as enum ('new', 'triaged', 'confirmed', 'rejected', 'fixed');
  end if;
end $$;


-- ─── 2. Utilitaire : horodatage de modification ─────────────────────────────

create or replace function private.touch_updated_at()
returns trigger
language plpgsql
set search_path = pg_catalog, private, pg_temp
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;


-- ─── 3. Preuve de consentement (append-only) ────────────────────────────────
--
-- Chaque DÉCISION est une ligne. Un retrait n'écrase pas l'acceptation : il ajoute une
-- ligne `granted = false`. C'est ce qui rend la preuve opposable (RGPD art. 7 §1) — une
-- table « état courant » mise à jour par upsert ne prouve rien du passé.
--
-- `policy_version` + `text_hash` : on conserve QUELLE formulation a été acceptée. Sans le
-- hash du texte, « version 2026-08 » est une affirmation invérifiable.

create table if not exists private.consent_records (
  id                   uuid primary key default gen_random_uuid(),

  -- Sujet : au moins l'un des deux. L'identifiant anonyme est un pseudonyme de terminal,
  -- pas un identifiant de personne — mais relié à des opinions, il est traité comme tel.
  anonymous_session_id uuid,
  user_id              uuid references auth.users(id) on delete cascade,

  purpose              private.consent_purpose not null,
  granted              boolean not null,

  policy_version       text not null,
  text_hash            text not null,

  decided_at           timestamptz not null default now(),
  -- Durée de conservation ANNONCÉE à l'utilisateur au moment de la décision. Stockée avec
  -- la décision : si la politique change, on sait ce qui avait été promis à cette personne.
  retention_until      timestamptz,

  client_release       text,
  language             text check (language is null or language in ('fr', 'en')),

  created_at           timestamptz not null default now(),

  constraint consent_records_subject_present
    check (anonymous_session_id is not null or user_id is not null)
);

comment on table private.consent_records is
  'Journal append-only des décisions de consentement. Une ligne par décision et par finalité.';

create index if not exists consent_records_anon_purpose_idx
  on private.consent_records (anonymous_session_id, purpose, decided_at desc);
create index if not exists consent_records_user_purpose_idx
  on private.consent_records (user_id, purpose, decided_at desc);

-- Append-only imposé par la base, pas par la discipline des appelants.
create or replace function private.forbid_mutation()
returns trigger
language plpgsql
set search_path = pg_catalog, private, pg_temp
as $$
begin
  raise exception
    'Table % en journal append-only : % interdit. Ajouter une nouvelle ligne de décision.',
    tg_table_name, tg_op
    using errcode = 'restrict_violation';
end;
$$;

drop trigger if exists consent_records_append_only on private.consent_records;
create trigger consent_records_append_only
  before update or delete on private.consent_records
  for each row execute function private.forbid_mutation();

-- Vue de l'état courant : dernière décision par (sujet, finalité).
create or replace view private.consent_current as
select distinct on (coalesce(user_id::text, anonymous_session_id::text), purpose)
       coalesce(user_id::text, anonymous_session_id::text) as subject_key,
       anonymous_session_id,
       user_id,
       purpose,
       granted,
       policy_version,
       text_hash,
       decided_at
  from private.consent_records
 order by coalesce(user_id::text, anonymous_session_id::text), purpose, decided_at desc, id desc;

comment on view private.consent_current is
  'Dernière décision connue par sujet et finalité. Absence de ligne = non décidé = pas de collecte.';


-- ─── 4. Passations anonymes ─────────────────────────────────────────────────

create table if not exists private.quiz_attempts (
  id                     uuid primary key default gen_random_uuid(),

  anonymous_session_id   uuid not null,

  -- Rattachement à un compte : JAMAIS automatique. `user_id` ne peut être renseigné que si
  -- la décision de rattachement est elle-même tracée (`link_consent_id`). La contrainte
  -- rend le rattachement silencieux impossible, pas seulement déconseillé.
  user_id                uuid references auth.users(id) on delete set null,
  link_consent_id        uuid references private.consent_records(id),
  linked_at              timestamptz,

  questionnaire_version  text not null,
  scoring_version        text not null,
  -- Modes CANONIQUES du produit (`TEST_MODES`, src/data/questions.js) : 16 / 32 / 64 questions.
  -- ⚠ `quick` / `medium` / `full` sont des ALIAS HISTORIQUES, encore présents dans des
  -- `testMode` persistés d'anciens navigateurs. Ils sont normalisés par `canonicalMode()`
  -- AVANT l'envoi et ne doivent jamais atteindre cette colonne : les accepter ici créerait
  -- deux valeurs pour un même mode et casserait tout regroupement par mode.
  mode                   text not null check (mode in ('discovery', 'standard', 'deep')),

  started_at             timestamptz not null default now(),
  completed_at           timestamptz,
  abandoned_at           timestamptz,
  last_activity_at       timestamptz not null default now(),

  question_count_shown   integer not null default 0 check (question_count_shown  >= 0),
  question_count_answered integer not null default 0 check (question_count_answered >= 0),

  consent_version        text not null,
  client_release         text,
  language               text check (language is null or language in ('fr', 'en')),
  device_category        private.device_category,

  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now(),

  constraint quiz_attempts_link_requires_consent
    check ((user_id is null and link_consent_id is null and linked_at is null)
        or (user_id is not null and link_consent_id is not null and linked_at is not null)),

  -- Une passation ne peut pas être à la fois terminée et abandonnée.
  constraint quiz_attempts_terminal_state_exclusive
    check (completed_at is null or abandoned_at is null)
);

comment on table private.quiz_attempts is
  'Une passation. Aucun User-Agent brut, aucune IP. Rattachement à un compte impossible sans consentement tracé.';
comment on column private.quiz_attempts.device_category is
  'mobile | tablet | desktop. Dérivé de la largeur de viewport côté client — jamais du User-Agent.';

create index if not exists quiz_attempts_session_idx   on private.quiz_attempts (anonymous_session_id, started_at desc);
create index if not exists quiz_attempts_started_idx   on private.quiz_attempts (started_at desc);
create index if not exists quiz_attempts_mode_idx      on private.quiz_attempts (mode, started_at desc);
create index if not exists quiz_attempts_activity_idx  on private.quiz_attempts (last_activity_at);

drop trigger if exists quiz_attempts_touch on private.quiz_attempts;
create trigger quiz_attempts_touch
  before update on private.quiz_attempts
  for each row execute function private.touch_updated_at();


-- ─── 5. Réponses ────────────────────────────────────────────────────────────
--
-- UNE LIGNE PAR (passation, question). L'état de la réponse est porté par
-- `response_state`, PAS par la présence ou l'absence de la ligne :
--
--   • jamais vue          → aucune ligne
--   • vue, sans réponse   → ligne, `response_state` null, `answered_at` null
--   • « sans opinion »    → ligne, `response_state = 'no_opinion'`, `answer_value` null
--   • répondue 1–5        → ligne, `response_state = 'answered'`, `answer_value` 1–5
--
-- C'est la correction de fond du modèle historique (`user_answers.answer_value smallint`),
-- où « sans opinion » ne pouvait s'exprimer QUE par la suppression de la ligne — ce qui le
-- rendait indiscernable de « jamais vue ».

create table if not exists private.quiz_responses (
  id                    uuid primary key default gen_random_uuid(),

  attempt_id            uuid not null references private.quiz_attempts(id) on delete cascade,
  question_id           text not null,
  questionnaire_version text not null,

  response_state        private.response_state,
  answer_value          smallint,

  first_shown_at        timestamptz,
  last_shown_at         timestamptz,
  answered_at           timestamptz,

  -- Temps ACTIF cumulé, mesuré à l'horloge monotone côté client (performance.now()).
  -- Exclut : onglet caché, modale couvrante, navigation hors question.
  active_dwell_ms       integer check (active_dwell_ms is null or active_dwell_ms >= 0),
  -- Temps de présence total (première présentation → dernière), pour comparaison. Un écart
  -- énorme entre les deux signale un onglet laissé ouvert, pas une question difficile.
  total_elapsed_ms      integer check (total_elapsed_ms is null or total_elapsed_ms >= 0),
  -- Valeur aberrante MARQUÉE plutôt que supprimée : l'analyse décide de l'exclure, la
  -- collecte ne décide pas à sa place.
  dwell_capped          boolean not null default false,

  presentation_count    integer not null default 0 check (presentation_count >= 0),
  change_count          integer not null default 0 check (change_count >= 0),
  sequence_index        integer check (sequence_index is null or sequence_index >= 0),

  -- Ordonnancement des écritures concurrentes. Une réponse arrivée en retard mais plus
  -- ancienne que la ligne stockée est ignorée (voir private.ingest_responses).
  client_updated_at     timestamptz not null,
  -- Identifiant de mutation : rend l'écriture idempotente (rejeu réseau, reprise hors ligne).
  mutation_id           uuid not null,

  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),

  -- Une seule ligne par question et par passation.
  constraint quiz_responses_attempt_question_unique unique (attempt_id, question_id),

  -- LES DEUX CONTRAINTES DEMANDÉES, imposées par la base :
  constraint quiz_responses_answered_requires_value
    check (response_state is distinct from 'answered'
           or (answer_value is not null and answer_value between 1 and 5)),
  constraint quiz_responses_no_opinion_requires_null
    check (response_state is distinct from 'no_opinion' or answer_value is null),
  -- Les états réservés n'ont pas davantage de valeur numérique.
  constraint quiz_responses_unknown_states_require_null
    check (response_state not in ('dont_know', 'prefer_not_to_answer') or answer_value is null),
  -- Une valeur ne peut pas exister sans état la justifiant.
  constraint quiz_responses_value_requires_answered
    check (answer_value is null or response_state = 'answered')
);

comment on table private.quiz_responses is
  'Une ligne par (passation, question). « Sans opinion » est un ÉTAT conservé, jamais une suppression de ligne.';
comment on column private.quiz_responses.active_dwell_ms is
  'Temps actif à l''horloge monotone : hors onglet caché, hors modale couvrante. Voir docs/data-platform/timing-protocol.md.';
comment on column private.quiz_responses.mutation_id is
  'Identifiant client de la mutation. Rejouer la même mutation ne produit aucun effet supplémentaire.';

create index if not exists quiz_responses_attempt_idx  on private.quiz_responses (attempt_id);
create index if not exists quiz_responses_question_idx on private.quiz_responses (question_id, questionnaire_version);
create index if not exists quiz_responses_state_idx    on private.quiz_responses (response_state);
-- Idempotence : deux applications de la même mutation ne peuvent pas coexister.
create unique index if not exists quiz_responses_mutation_idx on private.quiz_responses (mutation_id);

drop trigger if exists quiz_responses_touch on private.quiz_responses;
create trigger quiz_responses_touch
  before update on private.quiz_responses
  for each row execute function private.touch_updated_at();

-- Interdiction structurelle de la suppression d'une réponse « sans opinion ».
-- La règle produit « ne jamais supprimer une ligne parce que la personne choisit sans
-- opinion » est vraie dans le code client ; ce garde-fou la rend vraie même si un futur
-- script se trompe.
--
-- La purge de rétention et le retrait de consentement doivent, eux, pouvoir supprimer :
-- ils annoncent leur intention par `set local poliscop.purge = 'on'`. Un drapeau EXPLICITE
-- plutôt qu'une détection de cascade — le comportement des triggers RI en cascade dépend
-- de subtilités de visibilité de snapshot sur lesquelles une garantie de conservation ne
-- doit pas reposer.
create or replace function private.forbid_no_opinion_delete()
returns trigger
language plpgsql
set search_path = pg_catalog, private, pg_temp
as $$
begin
  if old.response_state = 'no_opinion'
     and coalesce(current_setting('poliscop.purge', true), 'off') <> 'on' then
    raise exception
      'Suppression refusée : « sans opinion » est une donnée, pas une absence de donnée (question %).',
      old.question_id
      using errcode = 'restrict_violation';
  end if;
  return old;
end;
$$;

drop trigger if exists quiz_responses_protect_no_opinion on private.quiz_responses;
create trigger quiz_responses_protect_no_opinion
  before delete on private.quiz_responses
  for each row execute function private.forbid_no_opinion_delete();


-- ─── 6. Signalements de questions ───────────────────────────────────────────
--
-- Séparation stricte entre CE QUE L'UTILISATEUR ENVOIE (immuable après création) et CE QUE
-- L'ÉQUIPE ÉDITORIALE ÉCRIT (statut, priorité, notes). Une note d'administration ne doit
-- jamais pouvoir être confondue avec un propos de l'utilisateur.

create table if not exists private.question_reports (
  id                    uuid primary key default gen_random_uuid(),

  question_id           text not null,
  questionnaire_version text not null,

  attempt_id            uuid references private.quiz_attempts(id) on delete set null,
  anonymous_session_id  uuid,
  user_id               uuid references auth.users(id) on delete set null,

  category              private.report_category not null,
  -- Nettoyé et borné côté Edge Function ; la borne est REDITE ici, car une contrainte de
  -- base est le seul contrôle qu'un bug applicatif ne peut pas contourner.
  comment               text check (comment is null or char_length(comment) <= 1000),

  language              text check (language is null or language in ('fr', 'en')),
  client_release        text,
  -- Écran d'origine : valeur INTERNE d'une liste fermée, jamais une URL arbitraire
  -- (une URL peut porter des paramètres et devenir une donnée personnelle).
  origin_screen         text check (origin_screen is null or origin_screen in
                          ('questionnaire', 'improve', 'election_detail', 'profile', 'learn', 'other')),

  created_at            timestamptz not null default now(),

  -- ── Champs éditoriaux ──
  status                private.report_status not null default 'new',
  priority              smallint not null default 3 check (priority between 1 and 5),
  admin_notes           text,
  resolved_at           timestamptz,
  resolved_by           uuid references auth.users(id) on delete set null,
  -- Version de question dans laquelle le problème est corrigé — permet de distinguer
  -- « encore vrai » de « déjà corrigé, signalement sur une ancienne version ».
  fixed_in_version      text,

  updated_at            timestamptz not null default now(),

  constraint question_reports_resolved_consistency
    check ((status in ('rejected', 'fixed')) = (resolved_at is not null))
);

comment on table private.question_reports is
  'Signalements réellement stockés. Les colonnes utilisateur sont immuables ; seules les colonnes éditoriales évoluent.';
comment on column private.question_reports.admin_notes is
  'Notes internes. Séparées du commentaire utilisateur — ne jamais fusionner les deux champs.';

create index if not exists question_reports_question_idx on private.question_reports (question_id, questionnaire_version);
create index if not exists question_reports_status_idx   on private.question_reports (status, created_at desc);
create index if not exists question_reports_created_idx  on private.question_reports (created_at desc);

drop trigger if exists question_reports_touch on private.question_reports;
create trigger question_reports_touch
  before update on private.question_reports
  for each row execute function private.touch_updated_at();

-- Les colonnes envoyées par l'utilisateur sont figées à la création.
create or replace function private.freeze_report_user_columns()
returns trigger
language plpgsql
set search_path = pg_catalog, private, pg_temp
as $$
begin
  if new.question_id is distinct from old.question_id
     or new.questionnaire_version is distinct from old.questionnaire_version
     or new.category    is distinct from old.category
     or new.comment     is distinct from old.comment
     or new.language    is distinct from old.language
     or new.origin_screen is distinct from old.origin_screen
     or new.created_at  is distinct from old.created_at
     -- `attempt_id` : le DÉLIER est légitime — c'est ce que fait `on delete set null` quand
     -- la passation est purgée ou que le consentement est retiré. Le RELIER ou le pointer
     -- ailleurs ne l'est pas. Seule la transition « valeur → null » est donc tolérée.
     or (new.attempt_id is distinct from old.attempt_id and new.attempt_id is not null)
     or new.anonymous_session_id is distinct from old.anonymous_session_id then
    raise exception
      'Colonnes utilisateur immuables : un signalement ne se réécrit pas, il se qualifie (statut, priorité, notes).'
      using errcode = 'restrict_violation';
  end if;
  return new;
end;
$$;

drop trigger if exists question_reports_freeze on private.question_reports;
create trigger question_reports_freeze
  before update on private.question_reports
  for each row execute function private.freeze_report_user_columns();


-- ─── 7. Limitation de débit de l'ingestion ──────────────────────────────────
--
-- L'Edge Function anonyme tourne avec `verify_jwt = false` : il n'y a pas de JWT à
-- vérifier pour un visiteur non connecté. Le contrôle alternatif est ce compteur par
-- fenêtre, plus la validation stricte du payload et la borne de taille. Le seau est
-- indexé sur un HACHÉ salé (jamais l'IP en clair) et purgé par la tâche de rétention.

create table if not exists private.ingest_rate_limits (
  bucket_key   text not null,
  window_start timestamptz not null,
  hits         integer not null default 0 check (hits >= 0),
  primary key (bucket_key, window_start)
);

comment on table private.ingest_rate_limits is
  'Compteurs de débit. `bucket_key` est un haché salé — aucune IP en clair n''est persistée.';

create index if not exists ingest_rate_limits_window_idx on private.ingest_rate_limits (window_start);


-- ─── 8. RLS et privilèges ───────────────────────────────────────────────────
--
-- Toutes les tables : RLS activée ET forcée, AUCUNE policy. Conséquence : même un rôle
-- disposant d'un GRANT ne lit rien. Seul `service_role` (BYPASSRLS dans Supabase) traverse.
-- `force row level security` s'applique aussi au propriétaire de la table — sans lui, un
-- accès via le rôle propriétaire contournerait tout.

do $$
declare
  tbl text;
begin
  foreach tbl in array array[
    'consent_records', 'quiz_attempts', 'quiz_responses', 'question_reports', 'ingest_rate_limits'
  ] loop
    execute format('alter table private.%I enable row level security', tbl);
    execute format('alter table private.%I force  row level security', tbl);
    execute format('revoke all on table private.%I from public', tbl);

    if exists (select 1 from pg_roles where rolname = 'anon') then
      execute format('revoke all on table private.%I from anon', tbl);
    end if;
    if exists (select 1 from pg_roles where rolname = 'authenticated') then
      execute format('revoke all on table private.%I from authenticated', tbl);
    end if;
    if exists (select 1 from pg_roles where rolname = 'service_role') then
      execute format('grant select, insert, update, delete on table private.%I to service_role', tbl);
    end if;
  end loop;
end $$;

-- La vue d'état courant suit la même règle que les tables qu'elle lit.
revoke all on private.consent_current from public;
do $$
begin
  if exists (select 1 from pg_roles where rolname = 'anon') then
    execute 'revoke all on private.consent_current from anon';
  end if;
  if exists (select 1 from pg_roles where rolname = 'authenticated') then
    execute 'revoke all on private.consent_current from authenticated';
  end if;
  if exists (select 1 from pg_roles where rolname = 'service_role') then
    execute 'grant select on private.consent_current to service_role';
  end if;
end $$;

-- Les fonctions créées ici sont des triggers ou des utilitaires internes : personne ne doit
-- pouvoir les appeler depuis une route HTTP.
revoke all on function private.touch_updated_at()          from public;
revoke all on function private.forbid_mutation()           from public;
revoke all on function private.forbid_no_opinion_delete()  from public;
revoke all on function private.freeze_report_user_columns() from public;

-- Objets créés PLUS TARD dans ce schéma : fermés par défaut eux aussi.
alter default privileges in schema private revoke all on tables    from public;
alter default privileges in schema private revoke all on functions from public;
