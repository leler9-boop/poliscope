-- POLISCOP — API d'ingestion, côté base.
--
-- L'Edge Function `ingest` valide la FORME du payload (allowlist de champs, taille, version,
-- CORS, débit). Ces fonctions valident le FOND : consentement, ordonnancement, idempotence,
-- bornes de valeurs. La séparation est volontaire — une Edge Function se redéploie, une
-- contrainte de base ne se contourne pas.
--
-- Toutes ces fonctions sont `security definer` ET révoquées de `public`, `anon`,
-- `authenticated`. Seul `service_role` peut les exécuter, c'est-à-dire l'Edge Function.
-- Une fonction `security definer` laissée exécutable par `anon` serait exactement la faille
-- que le durcissement de 20260809120000 a corrigée sur les RPC `founder_*` : on ne la
-- réintroduit pas ici.

-- ─── Constantes de collecte ─────────────────────────────────────────────────
--
-- Plafond du temps actif par question. Au-delà, la valeur est CONSERVÉE mais marquée
-- (`dwell_capped`), jamais supprimée : l'analyse choisit d'exclure, la collecte constate.
-- 10 minutes sur une question unique relève de l'onglet oublié, pas de la réflexion.

create or replace function private.max_active_dwell_ms()
returns integer language sql immutable as $$ select 600000 $$;


-- ─── 1. Consentement : lecture d'état ───────────────────────────────────────

create or replace function private.has_consent(
  p_anonymous_session_id uuid,
  p_user_id              uuid,
  p_purpose              private.consent_purpose
)
returns boolean
language sql
stable
security definer
set search_path = pg_catalog, private, pg_temp
as $$
  -- Absence de ligne = non décidé = PAS de collecte. Le `coalesce(..., false)` porte donc
  -- une décision produit, pas une commodité d'écriture : le défaut est fermé.
  select coalesce((
    select c.granted
      from private.consent_records c
     where c.purpose = p_purpose
       and ((p_user_id is not null and c.user_id = p_user_id)
         or (p_anonymous_session_id is not null and c.anonymous_session_id = p_anonymous_session_id))
     order by c.decided_at desc, c.id desc
     limit 1
  ), false);
$$;

comment on function private.has_consent(uuid, uuid, private.consent_purpose) is
  'Dernière décision connue pour cette finalité. false si aucune décision — le défaut est fermé.';


-- ─── 2. Consentement : enregistrement d'une décision ────────────────────────

create or replace function private.record_consent(p_payload jsonb)
returns uuid
language plpgsql
security definer
set search_path = pg_catalog, private, pg_temp
as $$
declare
  v_id uuid;
begin
  insert into private.consent_records (
    anonymous_session_id, user_id, purpose, granted,
    policy_version, text_hash, decided_at, retention_until,
    client_release, language
  )
  values (
    nullif(p_payload->>'anonymous_session_id', '')::uuid,
    nullif(p_payload->>'user_id', '')::uuid,
    (p_payload->>'purpose')::private.consent_purpose,
    (p_payload->>'granted')::boolean,
    p_payload->>'policy_version',
    p_payload->>'text_hash',
    coalesce((p_payload->>'decided_at')::timestamptz, now()),
    nullif(p_payload->>'retention_until', '')::timestamptz,
    p_payload->>'client_release',
    nullif(p_payload->>'language', '')
  )
  returning id into v_id;

  -- Un RETRAIT du consentement à l'analyse politique doit AGIR, pas seulement être noté.
  -- Les passations et réponses déjà collectées pour ce sujet sont supprimées ici même :
  -- c'est ce qui rend le retrait effectif sans dépendre d'une purge différée.
  if (p_payload->>'purpose') = 'political_analytics'
     and (p_payload->>'granted')::boolean is false then
    -- Le garde-fou anti-suppression des « sans opinion » protège contre un bug, pas contre
    -- un retrait de consentement : on annonce l'intention explicitement, le temps de la
    -- transaction seulement (`is_local = true`).
    perform set_config('poliscop.purge', 'on', true);
    delete from private.quiz_attempts a
     where (nullif(p_payload->>'anonymous_session_id', '')::uuid is not null
            and a.anonymous_session_id = nullif(p_payload->>'anonymous_session_id', '')::uuid)
        or (nullif(p_payload->>'user_id', '')::uuid is not null
            and a.user_id = nullif(p_payload->>'user_id', '')::uuid);
  end if;

  return v_id;
end;
$$;

comment on function private.record_consent(jsonb) is
  'Ajoute une décision de consentement. Un retrait de political_analytics supprime immédiatement les passations liées.';


-- ─── 3. Passation ───────────────────────────────────────────────────────────

create or replace function private.ingest_attempt(p_payload jsonb)
returns uuid
language plpgsql
security definer
set search_path = pg_catalog, private, pg_temp
as $$
declare
  v_id      uuid := nullif(p_payload->>'attempt_id', '')::uuid;
  v_anon    uuid := nullif(p_payload->>'anonymous_session_id', '')::uuid;
  v_user    uuid := nullif(p_payload->>'user_id', '')::uuid;
begin
  if v_id is null or v_anon is null then
    raise exception 'ingest_attempt : attempt_id et anonymous_session_id sont obligatoires'
      using errcode = 'invalid_parameter_value';
  end if;

  -- DEUXIÈME barrière de consentement, après celle du client. Une passation est une donnée
  -- d'opinion (mode, progression, abandon) : sans `political_analytics`, rien n'est écrit.
  if not private.has_consent(v_anon, v_user, 'political_analytics') then
    raise exception 'ingest_attempt : consentement political_analytics absent pour ce sujet'
      using errcode = 'insufficient_privilege';
  end if;

  insert into private.quiz_attempts (
    id, anonymous_session_id, questionnaire_version, scoring_version, mode,
    started_at, last_activity_at, completed_at, abandoned_at,
    question_count_shown, question_count_answered,
    consent_version, client_release, language, device_category
  )
  values (
    v_id, v_anon,
    p_payload->>'questionnaire_version',
    p_payload->>'scoring_version',
    p_payload->>'mode',
    coalesce((p_payload->>'started_at')::timestamptz, now()),
    coalesce((p_payload->>'last_activity_at')::timestamptz, now()),
    nullif(p_payload->>'completed_at', '')::timestamptz,
    nullif(p_payload->>'abandoned_at', '')::timestamptz,
    coalesce((p_payload->>'question_count_shown')::integer, 0),
    coalesce((p_payload->>'question_count_answered')::integer, 0),
    p_payload->>'consent_version',
    p_payload->>'client_release',
    nullif(p_payload->>'language', ''),
    nullif(p_payload->>'device_category', '')::private.device_category
  )
  on conflict (id) do update set
    -- Compteurs monotones : un lot arrivé dans le désordre ne doit pas faire RECULER la
    -- progression. `greatest` est le seul opérateur correct ici.
    question_count_shown    = greatest(private.quiz_attempts.question_count_shown,
                                       excluded.question_count_shown),
    question_count_answered = greatest(private.quiz_attempts.question_count_answered,
                                       excluded.question_count_answered),
    last_activity_at        = greatest(private.quiz_attempts.last_activity_at,
                                       excluded.last_activity_at),
    -- Les états terminaux ne s'annulent pas : une fois terminée, une passation le reste.
    completed_at            = coalesce(private.quiz_attempts.completed_at, excluded.completed_at),
    abandoned_at            = coalesce(private.quiz_attempts.abandoned_at, excluded.abandoned_at);

  return v_id;
end;
$$;


-- ─── 4. Réponses — lot ordonné et idempotent ────────────────────────────────
--
-- GARANTIE D'ORDRE : une écriture n'est appliquée que si son `client_updated_at` est
-- STRICTEMENT postérieur à celui de la ligne stockée. Une requête partie plus tôt mais
-- arrivée plus tard ne peut donc pas écraser un choix plus récent — c'est précisément le
-- défaut du modèle « un upsert par clic » qu'elle remplace.
--
-- IDEMPOTENCE : `mutation_id` est unique. Rejouer un lot (reprise hors ligne, retry réseau)
-- ne produit aucun effet supplémentaire et ne remonte pas d'erreur.

create or replace function private.ingest_responses(p_attempt_id uuid, p_items jsonb)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, private, pg_temp
as $$
declare
  item        jsonb;
  v_anon      uuid;
  v_user      uuid;
  v_applied   int := 0;
  v_stale     int := 0;
  v_duplicate int := 0;
  v_dwell     integer;
  v_capped    boolean;
  v_state     private.response_state;
  v_value     smallint;
  v_rows      int;
begin
  select a.anonymous_session_id, a.user_id into v_anon, v_user
    from private.quiz_attempts a where a.id = p_attempt_id;

  if v_anon is null then
    raise exception 'ingest_responses : passation % inconnue', p_attempt_id
      using errcode = 'invalid_parameter_value';
  end if;

  if not private.has_consent(v_anon, v_user, 'political_analytics') then
    raise exception 'ingest_responses : consentement political_analytics absent'
      using errcode = 'insufficient_privilege';
  end if;

  for item in select * from jsonb_array_elements(coalesce(p_items, '[]'::jsonb)) loop
    v_state := nullif(item->>'response_state', '')::private.response_state;
    v_value := nullif(item->>'answer_value', '')::smallint;

    -- Cohérence redite ici pour produire une erreur LISIBLE avant que la contrainte de
    -- table ne rejette le lot entier avec un message de bas niveau.
    if v_state = 'answered' and (v_value is null or v_value < 1 or v_value > 5) then
      raise exception 'ingest_responses : état answered sans valeur 1–5 (question %)', item->>'question_id'
        using errcode = 'check_violation';
    end if;
    if v_state is distinct from 'answered' then
      v_value := null;   -- « sans opinion » n'est jamais encodé par un nombre.
    end if;

    -- Temps actif : jamais négatif, plafonné et MARQUÉ.
    v_dwell  := nullif(item->>'active_dwell_ms', '')::integer;
    v_capped := false;
    if v_dwell is not null then
      if v_dwell < 0 then
        v_dwell := 0;                                  -- une horloge monotone ne recule pas :
        v_capped := true;                              -- une valeur négative est un défaut client.
      elsif v_dwell > private.max_active_dwell_ms() then
        v_dwell  := private.max_active_dwell_ms();
        v_capped := true;
      end if;
    end if;

    begin
      insert into private.quiz_responses (
        attempt_id, question_id, questionnaire_version,
        response_state, answer_value,
        first_shown_at, last_shown_at, answered_at,
        active_dwell_ms, total_elapsed_ms, dwell_capped,
        presentation_count, change_count, sequence_index,
        client_updated_at, mutation_id
      )
      values (
        p_attempt_id,
        item->>'question_id',
        item->>'questionnaire_version',
        v_state, v_value,
        nullif(item->>'first_shown_at', '')::timestamptz,
        nullif(item->>'last_shown_at',  '')::timestamptz,
        nullif(item->>'answered_at',    '')::timestamptz,
        v_dwell,
        nullif(item->>'total_elapsed_ms', '')::integer,
        v_capped,
        coalesce((item->>'presentation_count')::integer, 0),
        coalesce((item->>'change_count')::integer, 0),
        nullif(item->>'sequence_index', '')::integer,
        (item->>'client_updated_at')::timestamptz,
        (item->>'mutation_id')::uuid
      )
      on conflict (attempt_id, question_id) do update set
        response_state     = excluded.response_state,
        answer_value       = excluded.answer_value,
        -- La PREMIÈRE présentation ne bouge plus ; la dernière avance.
        first_shown_at     = least(private.quiz_responses.first_shown_at, excluded.first_shown_at),
        last_shown_at      = greatest(private.quiz_responses.last_shown_at, excluded.last_shown_at),
        answered_at        = excluded.answered_at,
        -- Le temps actif est CUMULÉ côté client (retours arrière inclus) : on prend la
        -- valeur transmise, mais jamais une valeur qui ferait reculer le cumul.
        active_dwell_ms    = greatest(coalesce(private.quiz_responses.active_dwell_ms, 0),
                                      coalesce(excluded.active_dwell_ms, 0)),
        total_elapsed_ms   = greatest(coalesce(private.quiz_responses.total_elapsed_ms, 0),
                                      coalesce(excluded.total_elapsed_ms, 0)),
        dwell_capped       = private.quiz_responses.dwell_capped or excluded.dwell_capped,
        presentation_count = greatest(private.quiz_responses.presentation_count, excluded.presentation_count),
        change_count       = greatest(private.quiz_responses.change_count, excluded.change_count),
        sequence_index     = coalesce(excluded.sequence_index, private.quiz_responses.sequence_index),
        client_updated_at  = excluded.client_updated_at,
        mutation_id        = excluded.mutation_id
      -- ⚠ LA garantie d'ordre. Sans ce `where`, une requête ancienne terminée en retard
      -- écraserait le dernier choix de l'utilisateur.
      where excluded.client_updated_at > private.quiz_responses.client_updated_at;

      get diagnostics v_rows = row_count;
      if v_rows > 0 then v_applied := v_applied + 1; else v_stale := v_stale + 1; end if;

    exception
      when unique_violation then
        -- `mutation_id` déjà appliqué : rejeu d'un lot. Résultat attendu, pas une erreur.
        v_duplicate := v_duplicate + 1;
    end;
  end loop;

  return jsonb_build_object('applied', v_applied, 'stale', v_stale, 'duplicate', v_duplicate);
end;
$$;

comment on function private.ingest_responses(uuid, jsonb) is
  'Lot idempotent et ordonné. Une écriture plus ancienne que la ligne stockée est ignorée (stale).';


-- ─── 5. Signalement ─────────────────────────────────────────────────────────
--
-- PAS de barrière de consentement ici, et c'est délibéré : un signalement est un retour
-- sur le CONTENU du questionnaire, pas une opinion politique de la personne. Il ne
-- transporte ni réponse, ni profil. En revanche `attempt_id` n'est rattaché que si la
-- passation existe déjà — donc que si l'analyse politique était consentie.

create or replace function private.ingest_report(p_payload jsonb)
returns uuid
language plpgsql
security definer
set search_path = pg_catalog, private, pg_temp
as $$
declare
  v_id      uuid;
  v_attempt uuid := nullif(p_payload->>'attempt_id', '')::uuid;
  v_comment text := nullif(btrim(coalesce(p_payload->>'comment', '')), '');
begin
  if v_attempt is not null
     and not exists (select 1 from private.quiz_attempts a where a.id = v_attempt) then
    v_attempt := null;   -- passation non collectée : le signalement reste valable, sans lien.
  end if;

  -- Bornage défensif : l'Edge Function tronque déjà, la base ne fait pas confiance.
  if v_comment is not null then
    v_comment := left(v_comment, 1000);
  end if;

  insert into private.question_reports (
    question_id, questionnaire_version, attempt_id,
    anonymous_session_id, user_id,
    category, comment, language, client_release, origin_screen
  )
  values (
    p_payload->>'question_id',
    p_payload->>'questionnaire_version',
    v_attempt,
    nullif(p_payload->>'anonymous_session_id', '')::uuid,
    nullif(p_payload->>'user_id', '')::uuid,
    (p_payload->>'category')::private.report_category,
    v_comment,
    nullif(p_payload->>'language', ''),
    p_payload->>'client_release',
    nullif(p_payload->>'origin_screen', '')
  )
  returning id into v_id;

  return v_id;
end;
$$;


-- ─── 6. Limitation de débit ─────────────────────────────────────────────────

create or replace function private.check_rate_limit(
  p_bucket_key     text,
  p_max_hits       integer,
  p_window_seconds integer
)
returns boolean
language plpgsql
security definer
set search_path = pg_catalog, private, pg_temp
as $$
declare
  v_window timestamptz := to_timestamp(floor(extract(epoch from now()) / p_window_seconds) * p_window_seconds);
  v_hits   integer;
begin
  insert into private.ingest_rate_limits (bucket_key, window_start, hits)
  values (p_bucket_key, v_window, 1)
  on conflict (bucket_key, window_start) do update set hits = private.ingest_rate_limits.hits + 1
  returning hits into v_hits;

  return v_hits <= p_max_hits;
end;
$$;

comment on function private.check_rate_limit(text, integer, integer) is
  'true si la requête est sous le quota. Contrôle alternatif au JWT pour l''ingestion anonyme.';


-- ─── 7. Privilèges ──────────────────────────────────────────────────────────
--
-- Chaque fonction est fermée à `public` (donc à `anon` et `authenticated`) puis ouverte au
-- seul `service_role`. `revoke from public` est indispensable : PostgreSQL accorde
-- `execute` à `public` par défaut sur toute fonction nouvellement créée.

do $$
declare
  fn text;
  has_service boolean := exists (select 1 from pg_roles where rolname = 'service_role');
begin
  foreach fn in array array[
    'private.has_consent(uuid, uuid, private.consent_purpose)',
    'private.record_consent(jsonb)',
    'private.ingest_attempt(jsonb)',
    'private.ingest_responses(uuid, jsonb)',
    'private.ingest_report(jsonb)',
    'private.check_rate_limit(text, integer, integer)',
    'private.max_active_dwell_ms()'
  ] loop
    execute format('revoke all on function %s from public', fn);
    if exists (select 1 from pg_roles where rolname = 'anon') then
      execute format('revoke all on function %s from anon', fn);
    end if;
    if exists (select 1 from pg_roles where rolname = 'authenticated') then
      execute format('revoke all on function %s from authenticated', fn);
    end if;
    if has_service then
      execute format('grant execute on function %s to service_role', fn);
    end if;
  end loop;
end $$;
