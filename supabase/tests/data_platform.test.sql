-- POLISCOP — Tests de la plateforme de données.
--
-- Exécuté par supabase/tests/run-migration-tests.sh sur la base `poliscop_full`, après
-- application de toutes les migrations dans l'ordre de la CLI.
--
-- Chaque test échoue par `raise exception` : la sortie non nulle du script est la preuve.
-- Convention : `OK n — …` en sortie normale, `ÉCHEC n — …` en exception.

\set ON_ERROR_STOP on

-- ─── Jeu d'essai ────────────────────────────────────────────────────────────

insert into auth.users (id, email) values
  ('a0000000-0000-0000-0000-000000000001', 'codeur@poliscop.fr'),
  ('a0000000-0000-0000-0000-000000000002', 'relecteur@poliscop.fr'),
  ('a0000000-0000-0000-0000-000000000003', 'fondateur@poliscop.fr'),
  ('a0000000-0000-0000-0000-000000000004', 'quidam@example.org')
on conflict (id) do nothing;

insert into public.admin_users (user_id, role)
values ('a0000000-0000-0000-0000-000000000003', 'founder')
on conflict (user_id) do nothing;


-- ═══ 1. Aucune donnée politique avant consentement ══════════════════════════

do $$
declare
  v_ok boolean := false;
begin
  begin
    perform private.ingest_attempt(jsonb_build_object(
      'attempt_id',            '11111111-1111-1111-1111-111111111111',
      'anonymous_session_id',  '99999999-9999-9999-9999-999999999999',
      'questionnaire_version', 'q-2026-08',
      'scoring_version',       's-v1',
      'mode',                  'discovery',
      'consent_version',       '2026-08'
    ));
  exception when insufficient_privilege then
    v_ok := true;
  end;

  if not v_ok then
    raise exception 'ÉCHEC 1 — une passation a été écrite SANS consentement political_analytics';
  end if;
  if exists (select 1 from private.quiz_attempts
              where anonymous_session_id = '99999999-9999-9999-9999-999999999999') then
    raise exception 'ÉCHEC 1b — une ligne a malgré tout été créée';
  end if;
  raise notice 'OK 1 — aucune collecte politique sans consentement';
end $$;


-- ═══ 2. Collecte APRÈS consentement ═════════════════════════════════════════

do $$
declare
  v_attempt uuid := '11111111-1111-1111-1111-111111111111';
  v_anon    uuid := '99999999-9999-9999-9999-999999999999';
begin
  perform private.record_consent(jsonb_build_object(
    'anonymous_session_id', v_anon,
    'purpose',              'political_analytics',
    'granted',              true,
    'policy_version',       '2026-08',
    'text_hash',            'sha256:essai',
    'language',             'fr'
  ));

  perform private.ingest_attempt(jsonb_build_object(
    'attempt_id',            v_attempt,
    'anonymous_session_id',  v_anon,
    'questionnaire_version', 'q-2026-08',
    'scoring_version',       's-v1',
    'mode',                  'discovery',
    'consent_version',       '2026-08',
    'language',              'fr',
    'device_category',       'mobile',
    'question_count_shown',  3
  ));

  if not exists (select 1 from private.quiz_attempts where id = v_attempt) then
    raise exception 'ÉCHEC 2 — la passation consentie n''a pas été enregistrée';
  end if;
  raise notice 'OK 2 — collecte effective après consentement';
end $$;


-- ═══ 3. « Sans opinion » CONSERVÉ, et distinct de « jamais vue » ════════════

do $$
declare
  v_attempt uuid := '11111111-1111-1111-1111-111111111111';
  v_state   private.response_state;
  v_value   smallint;
  v_seen    int;
begin
  perform private.ingest_responses(v_attempt, jsonb_build_array(
    -- ECO_1 : répondue 4
    jsonb_build_object('question_id','ECO_1','questionnaire_version','q-2026-08',
      'response_state','answered','answer_value',4,'sequence_index',0,
      'client_updated_at','2026-08-10T10:00:00Z','mutation_id','22222222-0000-0000-0000-000000000001',
      'active_dwell_ms',4200,'presentation_count',1),
    -- SOC_1 : « sans opinion » explicite
    jsonb_build_object('question_id','SOC_1','questionnaire_version','q-2026-08',
      'response_state','no_opinion','sequence_index',1,
      'client_updated_at','2026-08-10T10:00:10Z','mutation_id','22222222-0000-0000-0000-000000000002',
      'active_dwell_ms',9100,'presentation_count',1)
    -- IMM_1 : JAMAIS envoyée → doit rester absente
  ));

  select response_state, answer_value into v_state, v_value
    from private.quiz_responses where attempt_id = v_attempt and question_id = 'SOC_1';

  if v_state is distinct from 'no_opinion' then
    raise exception 'ÉCHEC 3 — « sans opinion » non conservé (état lu : %)', coalesce(v_state::text, 'aucune ligne');
  end if;
  if v_value is not null then
    raise exception 'ÉCHEC 3b — « sans opinion » a reçu une valeur numérique (%) — position fabriquée', v_value;
  end if;

  select count(*) into v_seen from private.quiz_responses
    where attempt_id = v_attempt and question_id = 'IMM_1';
  if v_seen <> 0 then
    raise exception 'ÉCHEC 3c — une question jamais posée a produit une ligne';
  end if;

  raise notice 'OK 3 — « sans opinion » conservé et distinct de « jamais vue »';
end $$;


-- ═══ 4. Suppression d'un « sans opinion » refusée ═══════════════════════════

do $$
declare
  v_ok boolean := false;
begin
  begin
    delete from private.quiz_responses
     where attempt_id = '11111111-1111-1111-1111-111111111111' and question_id = 'SOC_1';
  exception when restrict_violation then
    v_ok := true;
  end;

  if not v_ok then
    raise exception 'ÉCHEC 4 — un « sans opinion » a pu être supprimé hors purge';
  end if;
  raise notice 'OK 4 — « sans opinion » protégé contre la suppression';
end $$;


-- ═══ 5. Ordre des mutations : une écriture ancienne n'écrase pas ════════════

do $$
declare
  v_attempt uuid := '11111111-1111-1111-1111-111111111111';
  v_value   smallint;
  v_res     jsonb;
begin
  -- Nouveau choix : 2, à 10:05.
  perform private.ingest_responses(v_attempt, jsonb_build_array(
    jsonb_build_object('question_id','ECO_1','questionnaire_version','q-2026-08',
      'response_state','answered','answer_value',2,
      'client_updated_at','2026-08-10T10:05:00Z','mutation_id','22222222-0000-0000-0000-000000000003')));

  -- Requête PARTIE PLUS TÔT (10:02) mais ARRIVÉE plus tard : doit être ignorée.
  v_res := private.ingest_responses(v_attempt, jsonb_build_array(
    jsonb_build_object('question_id','ECO_1','questionnaire_version','q-2026-08',
      'response_state','answered','answer_value',5,
      'client_updated_at','2026-08-10T10:02:00Z','mutation_id','22222222-0000-0000-0000-000000000004')));

  select answer_value into v_value
    from private.quiz_responses where attempt_id = v_attempt and question_id = 'ECO_1';

  if v_value <> 2 then
    raise exception 'ÉCHEC 5 — le dernier choix local (2) a été écrasé par une écriture ancienne (lu : %)', v_value;
  end if;
  if (v_res->>'stale')::int <> 1 then
    raise exception 'ÉCHEC 5b — l''écriture obsolète n''a pas été comptée comme telle : %', v_res;
  end if;
  raise notice 'OK 5 — ordre des mutations respecté';
end $$;


-- ═══ 6. Idempotence : rejouer un lot ne double rien ═════════════════════════

do $$
declare
  v_attempt uuid := '11111111-1111-1111-1111-111111111111';
  v_before  int;
  v_after   int;
  v_res     jsonb;
begin
  select count(*) into v_before from private.quiz_responses where attempt_id = v_attempt;

  -- Exactement le même lot que le test 3 (mêmes mutation_id) : reprise hors ligne typique.
  v_res := private.ingest_responses(v_attempt, jsonb_build_array(
    jsonb_build_object('question_id','ECO_1','questionnaire_version','q-2026-08',
      'response_state','answered','answer_value',4,'sequence_index',0,
      'client_updated_at','2026-08-10T10:00:00Z','mutation_id','22222222-0000-0000-0000-000000000001',
      'active_dwell_ms',4200,'presentation_count',1)));

  select count(*) into v_after from private.quiz_responses where attempt_id = v_attempt;

  if v_before <> v_after then
    raise exception 'ÉCHEC 6 — le rejeu a créé des lignes (% → %)', v_before, v_after;
  end if;
  if (v_res->>'applied')::int <> 0 then
    raise exception 'ÉCHEC 6b — un rejeu a été appliqué comme une écriture neuve : %', v_res;
  end if;
  raise notice 'OK 6 — rejeu idempotent, sans effet ni erreur';
end $$;


-- ═══ 7. Temps cumulé au retour arrière, et pas de double comptage ══════════

do $$
declare
  v_attempt uuid := '11111111-1111-1111-1111-111111111111';
  v_dwell   integer;
  v_pres    integer;
begin
  -- Retour sur ECO_1 : le client renvoie le CUMUL (4200 + 3000) et 2 présentations.
  perform private.ingest_responses(v_attempt, jsonb_build_array(
    jsonb_build_object('question_id','ECO_1','questionnaire_version','q-2026-08',
      'response_state','answered','answer_value',2,'active_dwell_ms',7200,'presentation_count',2,
      'client_updated_at','2026-08-10T10:10:00Z','mutation_id','22222222-0000-0000-0000-000000000005')));

  select active_dwell_ms, presentation_count into v_dwell, v_pres
    from private.quiz_responses where attempt_id = v_attempt and question_id = 'ECO_1';

  if v_dwell <> 7200 then
    raise exception 'ÉCHEC 7 — temps actif cumulé incorrect (attendu 7200, lu %)', v_dwell;
  end if;
  if v_pres <> 2 then
    raise exception 'ÉCHEC 7b — compteur de présentations incorrect (attendu 2, lu %)', v_pres;
  end if;

  -- Un lot en retard portant un cumul PLUS FAIBLE ne doit pas faire reculer le compteur.
  perform private.ingest_responses(v_attempt, jsonb_build_array(
    jsonb_build_object('question_id','ECO_1','questionnaire_version','q-2026-08',
      'response_state','answered','answer_value',2,'active_dwell_ms',100,'presentation_count',1,
      'client_updated_at','2026-08-10T10:11:00Z','mutation_id','22222222-0000-0000-0000-000000000006')));

  select active_dwell_ms into v_dwell
    from private.quiz_responses where attempt_id = v_attempt and question_id = 'ECO_1';
  if v_dwell <> 7200 then
    raise exception 'ÉCHEC 7c — le temps cumulé a reculé (lu %)', v_dwell;
  end if;

  raise notice 'OK 7 — temps cumulé monotone, aucun double comptage';
end $$;


-- ═══ 8. Valeur aberrante plafonnée et MARQUÉE, jamais supprimée ════════════

do $$
declare
  v_attempt uuid := '11111111-1111-1111-1111-111111111111';
  v_dwell   integer;
  v_capped  boolean;
begin
  perform private.ingest_responses(v_attempt, jsonb_build_array(
    jsonb_build_object('question_id','SEC_1','questionnaire_version','q-2026-08',
      'response_state','answered','answer_value',3,'active_dwell_ms', 99000000,
      'client_updated_at','2026-08-10T10:20:00Z','mutation_id','22222222-0000-0000-0000-000000000007')));

  select active_dwell_ms, dwell_capped into v_dwell, v_capped
    from private.quiz_responses where attempt_id = v_attempt and question_id = 'SEC_1';

  if v_dwell <> private.max_active_dwell_ms() then
    raise exception 'ÉCHEC 8 — plafond non appliqué (lu %)', v_dwell;
  end if;
  if not v_capped then
    raise exception 'ÉCHEC 8b — valeur plafonnée non marquée : l''analyse ne peut plus l''exclure';
  end if;
  raise notice 'OK 8 — aberration plafonnée et marquée';
end $$;


-- ═══ 9. Contraintes d'état ══════════════════════════════════════════════════

do $$
declare
  v_blocked int := 0;
begin
  begin
    insert into private.quiz_responses (attempt_id, question_id, questionnaire_version,
      response_state, answer_value, client_updated_at, mutation_id)
    values ('11111111-1111-1111-1111-111111111111','X1','q','answered', null, now(), gen_random_uuid());
  exception when check_violation then v_blocked := v_blocked + 1; end;

  begin
    insert into private.quiz_responses (attempt_id, question_id, questionnaire_version,
      response_state, answer_value, client_updated_at, mutation_id)
    values ('11111111-1111-1111-1111-111111111111','X2','q','no_opinion', 3, now(), gen_random_uuid());
  exception when check_violation then v_blocked := v_blocked + 1; end;

  begin
    insert into private.quiz_responses (attempt_id, question_id, questionnaire_version,
      response_state, answer_value, client_updated_at, mutation_id)
    values ('11111111-1111-1111-1111-111111111111','X3','q','answered', 9, now(), gen_random_uuid());
  exception when check_violation then v_blocked := v_blocked + 1; end;

  if v_blocked <> 3 then
    raise exception 'ÉCHEC 9 — %/3 écritures incohérentes bloquées par la base', v_blocked;
  end if;
  raise notice 'OK 9 — contraintes answered/no_opinion imposées par la base';
end $$;


-- ═══ 10. Signalement RÉELLEMENT stocké ══════════════════════════════════════

do $$
declare
  v_id  uuid;
  v_cat private.report_category;
begin
  v_id := private.ingest_report(jsonb_build_object(
    'question_id','ECO_1','questionnaire_version','q-2026-08',
    'attempt_id','11111111-1111-1111-1111-111111111111',
    'anonymous_session_id','99999999-9999-9999-9999-999999999999',
    'category','biased','comment','  Formulation orientée.  ',
    'language','fr','origin_screen','questionnaire','client_release','test'));

  select category into v_cat from private.question_reports where id = v_id;
  if v_cat is distinct from 'biased' then
    raise exception 'ÉCHEC 10 — signalement non stocké';
  end if;
  if (select comment from private.question_reports where id = v_id) <> 'Formulation orientée.' then
    raise exception 'ÉCHEC 10b — commentaire non nettoyé';
  end if;
  raise notice 'OK 10 — signalement stocké et nettoyé';
end $$;


-- ═══ 11. anon ne lit RIEN de la collecte ════════════════════════════════════

do $$
declare
  v_denied int := 0;
  n int;
begin
  set local role anon;

  begin execute 'select count(*) from private.quiz_responses'  into n;
  exception when insufficient_privilege then v_denied := v_denied + 1; end;

  begin execute 'select count(*) from private.quiz_attempts'   into n;
  exception when insufficient_privilege then v_denied := v_denied + 1; end;

  begin execute 'select count(*) from private.question_reports' into n;
  exception when insufficient_privilege then v_denied := v_denied + 1; end;

  begin execute 'select count(*) from private.consent_records'  into n;
  exception when insufficient_privilege then v_denied := v_denied + 1; end;

  reset role;

  if v_denied <> 4 then
    raise exception 'ÉCHEC 11 — anon a pu lire %/4 tables de collecte', 4 - v_denied;
  end if;
  raise notice 'OK 11 — anon ne lit aucune table de collecte';
end $$;


-- ═══ 12. anon ne modifie pas le signalement d'un tiers ══════════════════════

do $$
declare
  v_denied boolean := false;
begin
  set local role anon;
  begin
    execute 'update private.question_reports set status = ''rejected''';
  exception when insufficient_privilege then v_denied := true;
  end;
  reset role;

  if not v_denied then
    raise exception 'ÉCHEC 12 — anon a pu modifier un signalement';
  end if;

  -- Et par la voie RPC : la fonction de qualification refuse hors rôle `founder`.
  set local role authenticated;
  set local request.jwt.claim.sub = 'a0000000-0000-0000-0000-000000000004';  -- quidam
  v_denied := false;
  begin
    perform public.admin_update_question_report(
      (select id from private.question_reports limit 1), 'fixed'::private.report_status);
  exception when insufficient_privilege then v_denied := true;
  end;
  reset role;
  reset request.jwt.claim.sub;

  if not v_denied then
    raise exception 'ÉCHEC 12b — un compte non administrateur a pu qualifier un signalement';
  end if;
  raise notice 'OK 12 — signalement d''un tiers inaccessible en écriture';
end $$;


-- ═══ 13. Tableau de bord : refusé au quidam, ouvert au fondateur ════════════

do $$
declare
  v_denied boolean := false;
  n int;
begin
  set local role authenticated;
  set local request.jwt.claim.sub = 'a0000000-0000-0000-0000-000000000004';
  begin
    select count(*) into n from public.admin_question_reports();
  exception when insufficient_privilege then v_denied := true;
  end;
  reset role; reset request.jwt.claim.sub;

  if not v_denied then
    raise exception 'ÉCHEC 13 — un compte non administrateur a lu la file de signalements';
  end if;

  set local role authenticated;
  set local request.jwt.claim.sub = 'a0000000-0000-0000-0000-000000000003';  -- fondateur
  select count(*) into n from public.admin_question_reports();
  if n < 1 then
    raise exception 'ÉCHEC 13b — le fondateur ne voit aucun signalement alors qu''il en existe';
  end if;
  select count(*) into n from public.admin_question_health();
  reset role; reset request.jwt.claim.sub;

  raise notice 'OK 13 — tableau de bord fermé au quidam, ouvert au fondateur';
end $$;


-- ═══ 14. Une IA ne publie pas : approbation sans relecture refusée ══════════

do $$
declare
  v_src uuid;
  v_pos uuid;
  v_ok  boolean := false;
begin
  insert into public.candidates (id, display_name, slug) values ('essai_cand','Essai','essai')
    on conflict (id) do nothing;
  insert into public.elections (id, label_fr) values ('fr_essai','Élection d''essai')
    on conflict (id) do nothing;
  insert into public.sources (url, publisher, title, kind, published_at)
    values ('https://example.org/p','Éditeur','Programme','program','2026-06-01')
    returning id into v_src;

  -- Codage AUTOMATIQUE, puis tentative d'approbation directe.
  insert into public.candidate_positions
    (candidate_id, election_id, question_id, stance, excerpt, coding_rationale,
     primary_source_id, source_date, coder_kind, coder_id, status, data_version)
  values ('essai_cand','fr_essai','ECO_1',4,'extrait exact','raisonnement',
          v_src,'2026-06-01','automated','a0000000-0000-0000-0000-000000000001','coded','v1')
  returning id into v_pos;

  begin
    update public.candidate_positions set status = 'approved' where id = v_pos;
  exception when insufficient_privilege then v_ok := true;
  end;

  if not v_ok then
    raise exception 'ÉCHEC 14 — une position codée automatiquement a été approuvée';
  end if;

  -- Même en codage humain : sans relecture indépendante, refus.
  v_ok := false;
  update public.candidate_positions set coder_kind = 'human' where id = v_pos;
  begin
    update public.candidate_positions set status = 'approved' where id = v_pos;
  exception when insufficient_privilege then v_ok := true;
  end;
  if not v_ok then
    raise exception 'ÉCHEC 14b — approbation sans relecture indépendante acceptée';
  end if;

  -- Auto-relecture par le codeur lui-même : refusée elle aussi.
  insert into public.candidate_position_reviews (position_id, reviewer_id, decision)
    values (v_pos, 'a0000000-0000-0000-0000-000000000001', 'approve');
  v_ok := false;
  begin
    update public.candidate_positions set status = 'approved' where id = v_pos;
  exception when insufficient_privilege then v_ok := true;
  end;
  if not v_ok then
    raise exception 'ÉCHEC 14c — le codeur a pu approuver sa propre position';
  end if;

  raise notice 'OK 14 — publication impossible sans relecture humaine indépendante';
end $$;


-- ═══ 15. Seule une position approuvée ET publiée est publique ══════════════

do $$
declare
  v_pos     uuid;
  v_release uuid;
  v_public  int;
  v_ok      boolean := false;
begin
  select id into v_pos from public.candidate_positions where candidate_id = 'essai_cand' limit 1;

  -- Relecture par un tiers → approbation possible.
  insert into public.candidate_position_reviews (position_id, reviewer_id, decision)
    values (v_pos, 'a0000000-0000-0000-0000-000000000002', 'approve');
  update public.candidate_positions set status = 'approved' where id = v_pos;

  -- Approuvée mais PAS ENCORE PUBLIÉE : invisible pour anon.
  set local role anon;
  select count(*) into v_public from public.published_candidate_positions where id = v_pos;
  reset role;
  if v_public <> 0 then
    raise exception 'ÉCHEC 15 — une position approuvée non publiée est visible publiquement';
  end if;

  -- Un brouillon ne peut pas entrer dans une release.
  insert into public.publication_releases (version, channel) values ('essai-1','production')
    returning id into v_release;
  insert into public.candidate_positions
    (candidate_id, question_id, coder_kind, status, data_version)
  values ('essai_cand','SOC_9','human','draft','v1');
  begin
    insert into public.publication_release_positions (release_id, position_id)
      values (v_release, (select id from public.candidate_positions where question_id = 'SOC_9'));
  exception when check_violation then v_ok := true;
  end;
  if not v_ok then
    raise exception 'ÉCHEC 15b — un brouillon a été inséré dans une release';
  end if;

  -- Publication de la release → visible.
  insert into public.publication_release_positions (release_id, position_id) values (v_release, v_pos);
  update public.publication_releases set published_at = now() where id = v_release;

  set local role anon;
  select count(*) into v_public from public.published_candidate_positions where id = v_pos;
  reset role;
  if v_public <> 1 then
    raise exception 'ÉCHEC 15c — la position publiée n''est pas lisible publiquement';
  end if;

  -- Release publiée = immuable.
  v_ok := false;
  begin
    update public.publication_releases set notes = 'retouche' where id = v_release;
  exception when restrict_violation then v_ok := true;
  end;
  if not v_ok then
    raise exception 'ÉCHEC 15d — une release publiée a pu être modifiée';
  end if;

  raise notice 'OK 15 — seule une position approuvée et publiée est publique ; release immuable';
end $$;


-- ═══ 16. Un brouillon reste invisible de l'API publique ════════════════════

do $$
declare
  n int;
begin
  set local role anon;
  select count(*) into n from public.candidate_positions where status <> 'approved';
  reset role;

  if n <> 0 then
    raise exception 'ÉCHEC 16 — % position(s) non approuvée(s) lisible(s) par anon', n;
  end if;

  set local role anon;
  select count(*) into n from public.candidate_positions;
  reset role;
  if n <> 1 then
    raise exception 'ÉCHEC 16b — anon voit % positions, une seule est publiée', n;
  end if;
  raise notice 'OK 16 — brouillons invisibles de l''API publique';
end $$;


-- ═══ 17. Le retrait du consentement arrête ET efface ═══════════════════════

do $$
declare
  v_anon uuid := '99999999-9999-9999-9999-999999999999';
  n int;
  v_ok boolean := false;
begin
  perform private.record_consent(jsonb_build_object(
    'anonymous_session_id', v_anon, 'purpose','political_analytics','granted', false,
    'policy_version','2026-08','text_hash','sha256:essai'));

  select count(*) into n from private.quiz_attempts where anonymous_session_id = v_anon;
  if n <> 0 then
    raise exception 'ÉCHEC 17 — % passation(s) survivent au retrait du consentement', n;
  end if;

  -- Et toute nouvelle collecte est refusée.
  begin
    perform private.ingest_attempt(jsonb_build_object(
      'attempt_id', gen_random_uuid(), 'anonymous_session_id', v_anon,
      'questionnaire_version','q','scoring_version','s','mode','discovery','consent_version','2026-08'));
  exception when insufficient_privilege then v_ok := true;
  end;
  if not v_ok then
    raise exception 'ÉCHEC 17b — la collecte a repris après retrait';
  end if;

  -- La PREUVE, elle, subsiste : trois décisions journalisées, aucune écrasée.
  select count(*) into n from private.consent_records where anonymous_session_id = v_anon;
  if n <> 2 then
    raise exception 'ÉCHEC 17c — journal de consentement incomplet (% lignes, 2 attendues)', n;
  end if;

  raise notice 'OK 17 — retrait effectif, preuve conservée';
end $$;


-- ═══ 18. Le journal de consentement est append-only ════════════════════════

do $$
declare
  v_blocked int := 0;
begin
  begin
    update private.consent_records set granted = true;
  exception when restrict_violation then v_blocked := v_blocked + 1; end;

  begin
    delete from private.consent_records;
  exception when restrict_violation then v_blocked := v_blocked + 1; end;

  if v_blocked <> 2 then
    raise exception 'ÉCHEC 18 — %/2 réécritures de la preuve de consentement bloquées', v_blocked;
  end if;
  raise notice 'OK 18 — preuve de consentement inaltérable';
end $$;


-- ═══ 19. Colonnes utilisateur d'un signalement immuables ═══════════════════

do $$
declare
  v_ok boolean := false;
  v_id uuid;
begin
  select id into v_id from private.question_reports limit 1;

  begin
    update private.question_reports set comment = 'réécrit par l''équipe' where id = v_id;
  exception when restrict_violation then v_ok := true;
  end;
  if not v_ok then
    raise exception 'ÉCHEC 19 — le commentaire d''un utilisateur a pu être réécrit';
  end if;

  -- La qualification éditoriale, elle, fonctionne.
  update private.question_reports set status = 'triaged', priority = 1, admin_notes = 'à revoir'
   where id = v_id;

  raise notice 'OK 19 — commentaire utilisateur immuable, qualification éditoriale possible';
end $$;


-- ═══ 20. Rétention : purge effective et déclarative ════════════════════════

do $$
declare
  v_anon    uuid := '88888888-8888-8888-8888-888888888888';
  v_attempt uuid := '33333333-3333-3333-3333-333333333333';
  v_summary jsonb;
  n int;
begin
  perform private.record_consent(jsonb_build_object(
    'anonymous_session_id', v_anon, 'purpose','political_analytics','granted', true,
    'policy_version','2026-08','text_hash','sha256:essai'));

  perform private.ingest_attempt(jsonb_build_object(
    'attempt_id', v_attempt, 'anonymous_session_id', v_anon,
    'questionnaire_version','q','scoring_version','s','mode','discovery','consent_version','2026-08'));

  perform private.ingest_responses(v_attempt, jsonb_build_array(
    jsonb_build_object('question_id','ECO_1','questionnaire_version','q',
      'response_state','no_opinion','active_dwell_ms',5000,
      'client_updated_at','2026-08-10T10:00:00Z','mutation_id', gen_random_uuid())));

  -- Vieillissement artificiel au-delà de la durée « abandoned_attempts » (90 jours).
  update private.quiz_attempts
     set last_activity_at = now() - interval '200 days', started_at = now() - interval '200 days'
   where id = v_attempt;

  v_summary := private.run_retention();

  select count(*) into n from private.quiz_attempts where id = v_attempt;
  if n <> 0 then
    raise exception 'ÉCHEC 20 — la passation abandonnée n''a pas été purgée (résumé : %)', v_summary;
  end if;

  -- La purge a pu supprimer un « sans opinion » — c'est le SEUL contexte autorisé, et le
  -- garde-fou doit être redevenu actif juste après.
  if (select count(*) from private.retention_runs) < 1 then
    raise exception 'ÉCHEC 20b — exécution de rétention non journalisée';
  end if;

  raise notice 'OK 20 — rétention appliquée et journalisée';
end $$;


-- ═══ 21. Le drapeau de purge ne fuit pas hors de la transaction ════════════

do $$
declare
  v_anon    uuid := '77777777-7777-7777-7777-777777777777';
  v_attempt uuid := '44444444-3333-3333-3333-333333333333';
  v_ok boolean := false;
begin
  perform private.record_consent(jsonb_build_object(
    'anonymous_session_id', v_anon, 'purpose','political_analytics','granted', true,
    'policy_version','2026-08','text_hash','sha256:essai'));
  perform private.ingest_attempt(jsonb_build_object(
    'attempt_id', v_attempt, 'anonymous_session_id', v_anon,
    'questionnaire_version','q','scoring_version','s','mode','discovery','consent_version','2026-08'));
  perform private.ingest_responses(v_attempt, jsonb_build_array(
    jsonb_build_object('question_id','SOC_2','questionnaire_version','q',
      'response_state','no_opinion','client_updated_at','2026-08-10T10:00:00Z',
      'mutation_id', gen_random_uuid())));

  begin
    delete from private.quiz_responses where attempt_id = v_attempt and question_id = 'SOC_2';
  exception when restrict_violation then v_ok := true;
  end;

  if not v_ok then
    raise exception 'ÉCHEC 21 — le drapeau de purge est resté actif après run_retention()';
  end if;
  raise notice 'OK 21 — drapeau de purge strictement local à sa transaction';
end $$;


-- ═══ 22. Le pont d'ingestion est fermé aux clients ═════════════════════════
--
-- `public.ingest_v1` vit dans un schéma EXPOSÉ par PostgREST. Si `anon` pouvait
-- l'exécuter, tout le dispositif (CORS, taille, allowlist, débit) serait contournable par
-- un simple appel REST — l'Edge Function ne serait plus qu'une politesse.

do $$
declare
  v_denied int := 0;
begin
  set local role anon;
  begin
    perform public.ingest_v1('report', '{}'::jsonb);
  exception when insufficient_privilege then v_denied := v_denied + 1;
            when others then null;
  end;
  begin
    perform public.ingest_rate_limit_v1('x', 1, 60);
  exception when insufficient_privilege then v_denied := v_denied + 1;
            when others then null;
  end;
  reset role;

  set local role authenticated;
  set local request.jwt.claim.sub = 'a0000000-0000-0000-0000-000000000004';
  begin
    perform public.ingest_v1('report', '{}'::jsonb);
  exception when insufficient_privilege then v_denied := v_denied + 1;
            when others then null;
  end;
  reset role; reset request.jwt.claim.sub;

  if v_denied <> 3 then
    raise exception 'ÉCHEC 22 — le pont d''ingestion est joignable par un client (%/3 refus)', v_denied;
  end if;
  raise notice 'OK 22 — pont d''ingestion réservé à service_role';
end $$;


-- ═══ 23. Aucune colonne d'empreinte de terminal dans la collecte ═══════════
--
-- Test STRUCTUREL : il échouera si quelqu'un ajoute un jour `user_agent` ou `ip` à une
-- table de `private`. Une promesse de confidentialité tenue par la seule relecture de code
-- finit toujours par se périmer.

do $$
declare
  v_bad text[];
begin
  select coalesce(array_agg(c.table_name || '.' || c.column_name), '{}')
    into v_bad
    from information_schema.columns c
   where c.table_schema = 'private'
     and (c.column_name ~* '(user_agent|^ua$|^ip$|ip_address|referrer|referer|fingerprint|postal|latitude|longitude)');

  if array_length(v_bad, 1) > 0 then
    raise exception
      'ÉCHEC 23 — colonne(s) d''empreinte de terminal dans private : %', array_to_string(v_bad, ', ');
  end if;
  raise notice 'OK 23 — aucune colonne d''empreinte de terminal dans la collecte';
end $$;


-- ─── 24. Cloisonnement des identifiants par finalité ────────────────────────
-- Une ligne de consentement politique portant un identifiant de compte créerait la
-- correspondance entre le pseudonyme des opinions et le compte. La base doit la REFUSER,
-- pas seulement le client : un appel direct à l'API contournerait tout garde-fou frontend.
do $$
declare
  v_refuse boolean := false;
begin
  begin
    insert into private.consent_records
      (anonymous_session_id, user_id, purpose, granted, policy_version, text_hash, decided_at)
    values (gen_random_uuid(), gen_random_uuid(), 'political_analytics', true, 'test', 'h', now());
  exception when check_violation then
    v_refuse := true;
  end;

  if not v_refuse then
    raise exception
      'ÉCHEC 24 — une ligne political_analytics a pu porter un user_id : le pseudonyme '
      'politique est relié au compte';
  end if;
  raise notice 'OK 24 — political_analytics refuse tout identifiant de compte';
end $$;

do $$
declare
  v_refuse boolean := false;
begin
  begin
    insert into private.consent_records
      (anonymous_session_id, user_id, purpose, granted, policy_version, text_hash, decided_at)
    values (gen_random_uuid(), gen_random_uuid(), 'cloud_save', true, 'test', 'h', now());
  exception when check_violation then
    v_refuse := true;
  end;

  if not v_refuse then
    raise exception
      'ÉCHEC 25 — une ligne cloud_save a pu porter un pseudonyme d''analyse : le lien est '
      'recréé par l''autre bout';
  end if;
  raise notice 'OK 25 — cloud_save refuse tout pseudonyme d''analyse';
end $$;


-- ═══ 26. Aucune décision sans SUJET, quelle que soit la finalité ════════════
--
-- La contrainte précédente n'exigeait un sujet que pour `cloud_save`. Une ligne
-- `political_analytics` avec `null / null` passait : une décision de consentement qui
-- n'établit le consentement de personne, et pour un retrait une demande de suppression que
-- le serveur ne peut rattacher à aucune donnée — pendant que le client affiche
-- « suppression en cours ».

do $$
declare
  v_purpose private.consent_purpose;
  v_refuse  boolean;
begin
  foreach v_purpose in array array['measurement', 'political_analytics', 'cloud_save', 'research']::private.consent_purpose[]
  loop
    v_refuse := false;
    begin
      insert into private.consent_records
        (anonymous_session_id, user_id, purpose, granted, policy_version, text_hash, decided_at)
      values (null, null, v_purpose, false, 'test', 'h', now());
    exception when check_violation then
      v_refuse := true;
    end;
    if not v_refuse then
      raise exception 'ÉCHEC 26 — % a pu être écrite sans aucun sujet technique', v_purpose;
    end if;
  end loop;
  raise notice 'OK 26 — aucune finalité n''accepte une décision sans sujet';
end $$;


-- ═══ 27. Aucune décision avec les DEUX identifiants ═════════════════════════

do $$
declare
  v_purpose private.consent_purpose;
  v_refuse  boolean;
begin
  foreach v_purpose in array array['measurement', 'political_analytics', 'cloud_save', 'research']::private.consent_purpose[]
  loop
    v_refuse := false;
    begin
      insert into private.consent_records
        (anonymous_session_id, user_id, purpose, granted, policy_version, text_hash, decided_at)
      values (gen_random_uuid(), 'a0000000-0000-0000-0000-000000000004', v_purpose, true, 'test', 'h', now());
    exception when check_violation then
      v_refuse := true;
    end;
    if not v_refuse then
      raise exception 'ÉCHEC 27 — % a pu porter à la fois un pseudonyme et un compte', v_purpose;
    end if;
  end loop;
  raise notice 'OK 27 — aucune finalité n''accepte deux identifiants';
end $$;


-- ═══ 28. Les QUATRE formes valides sont acceptées ═══════════════════════════
--
-- Une contrainte qui refuserait aussi les formes correctes bloquerait le produit. On prouve
-- donc les deux sens : ce qui doit passer passe.

do $$
declare
  v_purpose private.consent_purpose;
  v_n       bigint;
begin
  -- Trois finalités pseudonymisées : pseudonyme seul.
  foreach v_purpose in array array['measurement', 'political_analytics', 'research']::private.consent_purpose[]
  loop
    insert into private.consent_records
      (anonymous_session_id, user_id, purpose, granted, policy_version, text_hash, decided_at)
    values (gen_random_uuid(), null, v_purpose, true, 'forme-valide', 'h', now());
  end loop;

  -- Sauvegarde : compte seul.
  insert into private.consent_records
    (anonymous_session_id, user_id, purpose, granted, policy_version, text_hash, decided_at)
  values (null, 'a0000000-0000-0000-0000-000000000004', 'cloud_save', true, 'forme-valide', 'h', now());

  select count(*) into v_n
    from private.consent_records where policy_version = 'forme-valide';
  if v_n <> 4 then
    raise exception 'ÉCHEC 28 — % forme(s) valide(s) acceptée(s) sur 4', v_n;
  end if;
  raise notice 'OK 28 — les quatre formes valides sont acceptées';
end $$;


-- ═══ 29. La quarantaine existe et ne peut pas produire de consentement ══════

do $$
begin
  if to_regclass('private.consent_records_quarantine') is null then
    raise exception 'ÉCHEC 29 — la table de quarantaine des lignes sans sujet est absente';
  end if;
  -- Elle ne doit alimenter AUCUNE autorisation : `has_consent()` ne lit que le journal.
  if pg_get_functiondef('private.has_consent(uuid, uuid, private.consent_purpose)'::regprocedure)
     like '%consent_records_quarantine%' then
    raise exception
      'ÉCHEC 29b — la quarantaine est consultée pour autoriser une collecte : une décision '
      'sans sujet redeviendrait un consentement';
  end if;
  raise notice 'OK 29 — quarantaine présente, et hors de tout chemin d''autorisation';
end $$;


select 'TOUS LES TESTS DE LA PLATEFORME DE DONNÉES SONT PASSÉS' as resultat;
