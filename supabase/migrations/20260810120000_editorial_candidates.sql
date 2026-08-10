-- POLISCOP — Modèle éditorial : candidats, sources, positions, relectures, releases.
--
-- OBJECTIF
-- --------
-- Sortir progressivement les candidats de `src/data/elections.js` et
-- `src/data/candidateRegistry.js`. Supabase devient la SOURCE DE VÉRITÉ ; le fichier
-- statique devient un ARTEFACT DE PUBLICATION (snapshot versionné généré au build), et un
-- filet de sécurité si Supabase est indisponible. Il cesse d'être une seconde source
-- éditoriale — c'était la cause des divergences entre pages.
--
-- LA RÈGLE NON NÉGOCIABLE
-- -----------------------
-- Une IA, un script de veille ou une collecte automatique ne peut JAMAIS publier une
-- position en `approved`. Ce n'est pas une consigne d'équipe : trois triggers l'imposent.
--   1. un codeur automatique ne peut pas dépasser l'état `coded` ;
--   2. `approved` exige une relecture HUMAINE, par une personne DIFFÉRENTE du codeur ;
--   3. une release publiée est immuable, et seules des positions `approved` y entrent.
--
-- Ces tables vivent dans `public` : le frontend doit pouvoir les lire par PostgREST. La
-- RLS n'ouvre à `anon` que ce qui appartient à une release PUBLIÉE.

-- ─── 1. Types ───────────────────────────────────────────────────────────────

do $$
begin
  if not exists (select 1 from pg_type t join pg_namespace n on n.oid = t.typnamespace
                 where n.nspname = 'public' and t.typname = 'position_status') then
    create type public.position_status as enum (
      'draft',       -- brouillon créé depuis une source
      'coded',       -- codage effectué (humain, assisté ou automatique)
      'in_review',   -- soumis à relecture indépendante
      'approved',    -- relu et approuvé par un humain ≠ codeur
      'rejected',    -- relecture négative
      'superseded'   -- remplacé par une position ultérieure (revirement)
    );
  end if;

  -- Qui a produit le codage. `automated` couvre la veille et l'assistance IA.
  if not exists (select 1 from pg_type t join pg_namespace n on n.oid = t.typnamespace
                 where n.nspname = 'public' and t.typname = 'coder_kind') then
    create type public.coder_kind as enum ('human', 'assisted', 'automated');
  end if;

  if not exists (select 1 from pg_type t join pg_namespace n on n.oid = t.typnamespace
                 where n.nspname = 'public' and t.typname = 'review_decision') then
    create type public.review_decision as enum ('approve', 'reject', 'request_changes');
  end if;

  -- Position sur une question, sur la même échelle que les réponses (1–5), plus les états
  -- explicites qu'un programme peut réellement produire.
  if not exists (select 1 from pg_type t join pg_namespace n on n.oid = t.typnamespace
                 where n.nspname = 'public' and t.typname = 'candidacy_status') then
    create type public.candidacy_status as enum (
      'declared', 'presumed', 'qualified', 'withdrawn', 'eliminated', 'not_running'
    );
  end if;
end $$;


-- ─── 2. Référentiel ─────────────────────────────────────────────────────────

create table if not exists public.candidates (
  id            text primary key,               -- même identifiant que candidateRegistry.js
  display_name  text not null,
  slug          text not null unique,
  party_code    text,
  aliases       text[] not null default '{}',   -- alias historiques (fusions, changements de nom)
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create table if not exists public.elections (
  id            text primary key,               -- ex. 'fr_2027'
  label_fr      text not null,
  label_en      text,
  election_date date,
  created_at    timestamptz not null default now()
);

create table if not exists public.election_candidates (
  election_id   text not null references public.elections(id)  on delete cascade,
  candidate_id  text not null references public.candidates(id) on delete cascade,
  display_order integer,
  primary key (election_id, candidate_id)
);

create table if not exists public.candidate_election_status (
  id            uuid primary key default gen_random_uuid(),
  candidate_id  text not null references public.candidates(id) on delete cascade,
  election_id   text not null references public.elections(id)  on delete cascade,
  status        public.candidacy_status not null,
  -- Statut DATÉ et SOURCÉ : « candidat » sans date ni source est une affirmation, pas une donnée.
  effective_on  date not null,
  source_id     uuid,
  note          text,
  created_at    timestamptz not null default now(),
  unique (candidate_id, election_id, effective_on)
);

create table if not exists public.sources (
  id            uuid primary key default gen_random_uuid(),
  url           text,
  archive_url   text,                            -- copie pérenne : une URL de campagne disparaît
  publisher     text,
  title         text,
  kind          text not null default 'other'
                check (kind in ('program', 'interview', 'speech', 'vote', 'press', 'social', 'other')),
  published_at  date,
  retrieved_at  timestamptz not null default now(),
  content_hash  text,                            -- détecte une page modifiée après citation
  created_at    timestamptz not null default now()
);

create table if not exists public.program_documents (
  id            uuid primary key default gen_random_uuid(),
  candidate_id  text not null references public.candidates(id) on delete cascade,
  election_id   text references public.elections(id) on delete set null,
  title         text not null,
  source_id     uuid references public.sources(id) on delete set null,
  document_date date,
  created_at    timestamptz not null default now()
);

alter table public.candidate_election_status
  drop constraint if exists candidate_election_status_source_fk;
alter table public.candidate_election_status
  add constraint candidate_election_status_source_fk
  foreign key (source_id) references public.sources(id) on delete set null;


-- ─── 3. Positions ───────────────────────────────────────────────────────────

create table if not exists public.candidate_positions (
  id                uuid primary key default gen_random_uuid(),

  candidate_id      text not null references public.candidates(id) on delete cascade,
  election_id       text references public.elections(id) on delete set null,
  question_id       text not null,

  -- Position sur l'échelle du questionnaire. `null` autorisé UNIQUEMENT en brouillon :
  -- le trigger d'approbation l'exige non nul.
  stance            smallint check (stance is null or stance between 1 and 5),

  -- Preuve. `excerpt` est l'extrait EXACT, `coding_rationale` explique le passage de
  -- l'extrait à la note. Sans les deux, une position n'est pas vérifiable par un tiers.
  excerpt           text,
  coding_rationale  text,

  primary_source_id uuid references public.sources(id) on delete restrict,
  source_date       date,
  valid_from        date,
  valid_until       date,

  coder_id          uuid references auth.users(id) on delete set null,
  coder_kind        public.coder_kind not null default 'human',
  reviewer_id       uuid references auth.users(id) on delete set null,

  status            public.position_status not null default 'draft',

  -- Revirement : la position remplacée reste en base, elle n'est pas écrasée.
  supersedes_id     uuid references public.candidate_positions(id) on delete set null,

  data_version      text not null default 'unversioned',

  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  approved_at       timestamptz,

  constraint candidate_positions_validity_order
    check (valid_until is null or valid_from is null or valid_until >= valid_from)
);

create index if not exists candidate_positions_candidate_idx on public.candidate_positions (candidate_id, question_id);
create index if not exists candidate_positions_status_idx    on public.candidate_positions (status);
create index if not exists candidate_positions_election_idx  on public.candidate_positions (election_id);

-- Sources SECONDAIRES d'une position (corroboration, contradiction).
create table if not exists public.candidate_position_sources (
  position_id  uuid not null references public.candidate_positions(id) on delete cascade,
  source_id    uuid not null references public.sources(id) on delete restrict,
  excerpt      text,
  role         text not null default 'supporting'
               check (role in ('supporting', 'contradicting', 'context')),
  created_at   timestamptz not null default now(),
  primary key (position_id, source_id)
);

-- Relectures. Un relecteur est TOUJOURS humain : le type ne prévoit pas d'alternative.
create table if not exists public.candidate_position_reviews (
  id           uuid primary key default gen_random_uuid(),
  position_id  uuid not null references public.candidate_positions(id) on delete cascade,
  reviewer_id  uuid not null references auth.users(id) on delete restrict,
  decision     public.review_decision not null,
  notes        text,
  reviewed_at  timestamptz not null default now()
);

create index if not exists candidate_position_reviews_position_idx
  on public.candidate_position_reviews (position_id, reviewed_at desc);

-- Historique complet. Append-only : c'est la piste d'audit éditoriale.
create table if not exists public.candidate_position_revisions (
  id           uuid primary key default gen_random_uuid(),
  position_id  uuid not null references public.candidate_positions(id) on delete cascade,
  revision     integer not null,
  snapshot     jsonb not null,
  changed_by   uuid references auth.users(id) on delete set null,
  changed_at   timestamptz not null default now(),
  reason       text,
  unique (position_id, revision)
);


-- ─── 4. Releases de publication ─────────────────────────────────────────────

create table if not exists public.publication_releases (
  id            uuid primary key default gen_random_uuid(),
  version       text not null unique,            -- ex. 'candidates-2026-08-10'
  channel       text not null default 'production' check (channel in ('production', 'preview')),
  notes         text,
  created_at    timestamptz not null default now(),
  created_by    uuid references auth.users(id) on delete set null,
  published_at  timestamptz,
  published_by  uuid references auth.users(id) on delete set null
);

create table if not exists public.publication_release_positions (
  release_id   uuid not null references public.publication_releases(id) on delete cascade,
  position_id  uuid not null references public.candidate_positions(id) on delete restrict,
  primary key (release_id, position_id)
);

create index if not exists publication_releases_published_idx
  on public.publication_releases (published_at desc nulls last);


-- ─── 5. Garde-fous ──────────────────────────────────────────────────────────

create or replace function public.enforce_position_workflow()
returns trigger
language plpgsql
set search_path = pg_catalog, public, pg_temp
as $$
declare
  v_reviews int;
begin
  -- (1) Un codage automatique ne dépasse pas `coded`. La veille prépare, elle ne publie pas.
  if new.coder_kind = 'automated'
     and new.status in ('in_review', 'approved') then
    -- `in_review` reste interdit à l'auteur automatique lui-même : c'est un humain qui
    -- soumet à relecture, sinon la file de relecture se remplit toute seule.
    if new.status = 'approved' then
      raise exception
        'Publication refusée : une position codée automatiquement ne peut pas être approuvée (candidat %, question %).',
        new.candidate_id, new.question_id
        using errcode = 'insufficient_privilege';
    end if;
  end if;

  if new.status = 'approved' then
    -- (2) Preuve complète exigée. Une position approuvée sans extrait ni source n'est pas
    -- vérifiable — c'est exactement le défaut des profils `legacy-manual-v1`.
    if new.stance is null or new.excerpt is null or btrim(new.excerpt) = ''
       or new.coding_rationale is null or btrim(new.coding_rationale) = ''
       or new.primary_source_id is null or new.source_date is null then
      raise exception
        'Approbation refusée : stance, extrait, raisonnement, source et date de source sont obligatoires (candidat %, question %).',
        new.candidate_id, new.question_id
        using errcode = 'check_violation';
    end if;

    -- (3) Relecture HUMAINE et INDÉPENDANTE. `reviewer_id <> coder_id` est la condition
    -- d'indépendance ; sans elle, « relu » ne veut rien dire.
    select count(*) into v_reviews
      from public.candidate_position_reviews r
     where r.position_id = new.id
       and r.decision = 'approve'
       and (new.coder_id is null or r.reviewer_id is distinct from new.coder_id);

    if v_reviews = 0 then
      raise exception
        'Approbation refusée : aucune relecture « approve » par un relecteur distinct du codeur (candidat %, question %).',
        new.candidate_id, new.question_id
        using errcode = 'insufficient_privilege';
    end if;

    if new.approved_at is null then
      new.approved_at := now();
    end if;
  end if;

  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists candidate_positions_workflow on public.candidate_positions;
create trigger candidate_positions_workflow
  before insert or update on public.candidate_positions
  for each row execute function public.enforce_position_workflow();


-- Journalisation automatique des révisions : la piste d'audit ne dépend pas de la
-- discipline de l'appelant.
create or replace function public.log_position_revision()
returns trigger
language plpgsql
set search_path = pg_catalog, public, pg_temp
as $$
declare
  v_next int;
begin
  select coalesce(max(revision), 0) + 1 into v_next
    from public.candidate_position_revisions where position_id = new.id;

  insert into public.candidate_position_revisions (position_id, revision, snapshot, changed_by, reason)
  values (new.id, v_next, to_jsonb(new), new.reviewer_id, tg_op);

  return null;
end;
$$;

drop trigger if exists candidate_positions_revision_log on public.candidate_positions;
create trigger candidate_positions_revision_log
  after insert or update on public.candidate_positions
  for each row execute function public.log_position_revision();


-- Une release publiée est IMMUABLE : c'est ce qui permet au frontend de s'y fier et à un
-- résultat de matching d'être reproductible a posteriori.
create or replace function public.enforce_release_immutability()
returns trigger
language plpgsql
set search_path = pg_catalog, public, pg_temp
as $$
begin
  if tg_table_name = 'publication_releases' then
    if tg_op = 'DELETE' then
      if old.published_at is not null then
        raise exception 'Release % publiée : suppression interdite.', old.version
          using errcode = 'restrict_violation';
      end if;
      return old;
    end if;
    -- Seule transition autorisée sur une release publiée : aucune.
    if old.published_at is not null then
      raise exception 'Release % publiée : modification interdite (immuable).', old.version
        using errcode = 'restrict_violation';
    end if;
    return new;
  end if;

  -- Contenu d'une release : verrouillé dès la publication.
  if exists (
    select 1 from public.publication_releases r
     where r.id = coalesce(new.release_id, old.release_id) and r.published_at is not null
  ) then
    raise exception 'Contenu d''une release publiée : modification interdite.'
      using errcode = 'restrict_violation';
  end if;

  return coalesce(new, old);
end;
$$;

drop trigger if exists publication_releases_immutable on public.publication_releases;
create trigger publication_releases_immutable
  before update or delete on public.publication_releases
  for each row execute function public.enforce_release_immutability();

drop trigger if exists publication_release_positions_immutable on public.publication_release_positions;
create trigger publication_release_positions_immutable
  before insert or update or delete on public.publication_release_positions
  for each row execute function public.enforce_release_immutability();


-- Seule une position `approved` entre dans une release.
create or replace function public.enforce_release_only_approved()
returns trigger
language plpgsql
set search_path = pg_catalog, public, pg_temp
as $$
declare
  v_status public.position_status;
begin
  select status into v_status from public.candidate_positions where id = new.position_id;
  if v_status is distinct from 'approved' then
    raise exception 'Release : la position % est en statut %, seules les positions approuvées sont publiables.',
      new.position_id, coalesce(v_status::text, 'inconnu')
      using errcode = 'check_violation';
  end if;
  return new;
end;
$$;

drop trigger if exists publication_release_positions_approved on public.publication_release_positions;
create trigger publication_release_positions_approved
  before insert on public.publication_release_positions
  for each row execute function public.enforce_release_only_approved();


-- ─── 6. Surface publique ────────────────────────────────────────────────────
--
-- Le frontend ne lit QUE ceci. `security_invoker` n'est pas utilisé : la vue filtre
-- elle-même sur la release publiée, et les tables sous-jacentes restent fermées à `anon`.

create or replace view public.published_candidate_positions as
select p.id,
       p.candidate_id,
       p.election_id,
       p.question_id,
       p.stance,
       p.excerpt,
       p.coding_rationale,
       p.source_date,
       p.valid_from,
       p.valid_until,
       p.data_version,
       s.url          as source_url,
       s.archive_url  as source_archive_url,
       s.publisher    as source_publisher,
       s.title        as source_title,
       r.version      as release_version,
       r.published_at as release_published_at
  from public.candidate_positions p
  join public.publication_release_positions rp on rp.position_id = p.id
  join public.publication_releases r           on r.id = rp.release_id
  left join public.sources s                   on s.id = p.primary_source_id
 where p.status = 'approved'
   and r.published_at is not null
   and r.channel = 'production';

comment on view public.published_candidate_positions is
  'Seule surface de lecture publique des positions. Un brouillon n''y apparaît jamais.';


-- ─── 7. RLS et privilèges ───────────────────────────────────────────────────

do $$
declare
  tbl text;
begin
  foreach tbl in array array[
    'candidates', 'elections', 'election_candidates', 'candidate_election_status',
    'sources', 'program_documents', 'candidate_positions', 'candidate_position_sources',
    'candidate_position_reviews', 'candidate_position_revisions',
    'publication_releases', 'publication_release_positions'
  ] loop
    execute format('alter table public.%I enable row level security', tbl);
    execute format('alter table public.%I force  row level security', tbl);
    execute format('revoke all on table public.%I from public', tbl);

    -- Aucune écriture par un client, jamais. L'édition passe par le back-office
    -- (service_role) ou par des RPC administrateur explicitement autorisées.
    if exists (select 1 from pg_roles where rolname = 'anon') then
      execute format('revoke all on table public.%I from anon', tbl);
    end if;
    if exists (select 1 from pg_roles where rolname = 'authenticated') then
      execute format('revoke all on table public.%I from authenticated', tbl);
    end if;
    if exists (select 1 from pg_roles where rolname = 'service_role') then
      execute format('grant select, insert, update, delete on table public.%I to service_role', tbl);
    end if;
  end loop;
end $$;

-- Lecture publique du référentiel d'identité : le nom d'un candidat et sa liste
-- d'élections sont des informations publiques, elles ne relèvent d'aucun secret éditorial.
do $$
begin
  if exists (select 1 from pg_roles where rolname = 'anon') then
    execute 'grant select on table public.candidates          to anon, authenticated';
    execute 'grant select on table public.elections           to anon, authenticated';
    execute 'grant select on table public.election_candidates to anon, authenticated';
    execute 'grant select on table public.sources             to anon, authenticated';
  end if;
end $$;

drop policy if exists candidates_public_read on public.candidates;
create policy candidates_public_read on public.candidates for select using (true);

drop policy if exists elections_public_read on public.elections;
create policy elections_public_read on public.elections for select using (true);

drop policy if exists election_candidates_public_read on public.election_candidates;
create policy election_candidates_public_read on public.election_candidates for select using (true);

-- Les sources ne sont lisibles que si elles étayent une position PUBLIÉE : la
-- bibliographie d'un dossier en cours de constitution est un travail éditorial.
drop policy if exists sources_published_read on public.sources;
create policy sources_published_read on public.sources for select using (
  exists (
    select 1
      from public.candidate_positions p
      join public.publication_release_positions rp on rp.position_id = p.id
      join public.publication_releases r           on r.id = rp.release_id
     where r.published_at is not null
       and p.status = 'approved'
       and (p.primary_source_id = public.sources.id
            or exists (select 1 from public.candidate_position_sources ps
                        where ps.position_id = p.id and ps.source_id = public.sources.id))
  )
);

-- Positions : lecture publique STRICTEMENT limitée aux positions approuvées appartenant à
-- une release publiée. C'est la policy qui rend la vue sûre.
drop policy if exists candidate_positions_published_read on public.candidate_positions;
create policy candidate_positions_published_read on public.candidate_positions for select using (
  status = 'approved'
  and exists (
    select 1 from public.publication_release_positions rp
      join public.publication_releases r on r.id = rp.release_id
     where rp.position_id = public.candidate_positions.id
       and r.published_at is not null
       and r.channel = 'production'
  )
);

drop policy if exists publication_releases_published_read on public.publication_releases;
create policy publication_releases_published_read on public.publication_releases for select using (
  published_at is not null and channel = 'production'
);

drop policy if exists publication_release_positions_published_read on public.publication_release_positions;
create policy publication_release_positions_published_read on public.publication_release_positions for select using (
  exists (select 1 from public.publication_releases r
           where r.id = publication_release_positions.release_id
             and r.published_at is not null and r.channel = 'production')
);

do $$
begin
  if exists (select 1 from pg_roles where rolname = 'anon') then
    execute 'grant select on table public.candidate_positions            to anon, authenticated';
    execute 'grant select on table public.publication_releases           to anon, authenticated';
    execute 'grant select on table public.publication_release_positions  to anon, authenticated';
    execute 'grant select on public.published_candidate_positions        to anon, authenticated';
  end if;
end $$;

-- AUCUNE policy de lecture pour : program_documents, candidate_election_status,
-- candidate_position_sources, candidate_position_reviews, candidate_position_revisions.
-- RLS activée sans policy = invisible pour anon et authenticated. Ce sont des données de
-- travail éditorial (relectures nominatives, notes internes, brouillons).

revoke all on function public.enforce_position_workflow()      from public;
revoke all on function public.log_position_revision()          from public;
revoke all on function public.enforce_release_immutability()   from public;
revoke all on function public.enforce_release_only_approved()  from public;
