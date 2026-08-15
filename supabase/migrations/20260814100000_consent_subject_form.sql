-- POLISCOP — Forme EXACTE du sujet d'une décision de consentement, imposée par la base.
--
-- DÉFAUT CORRIGÉ (P0-2, 2026-08-14)
-- ---------------------------------
-- `20260812100000_consent_purpose_isolation.sql` interdisait de porter les DEUX identifiants,
-- et exigeait `user_id is not null` pour `cloud_save`. Il n'exigeait rien pour les finalités
-- pseudonymes : leur forme correcte ne tenait qu'à `consent_records_subject_present`, une
-- contrainte séparée, déclarée dans le `create table if not exists` d'origine.
--
-- Deux conséquences :
--   • sur une base où la table préexistait (donc où le `create table` a été ignoré), la
--     contrainte de présence de sujet peut manquer, et une ligne `political_analytics` avec
--     `anonymous_session_id = null` et `user_id = null` passe ;
--   • la règle réelle n'est écrite nulle part en un seul endroit lisible.
--
-- Une ligne sans sujet n'est pas une preuve incomplète, c'est une NON-PREUVE : elle
-- n'établit le consentement de personne. Et si elle porte `granted = false`, elle est pire
-- encore — une demande de suppression que le serveur ne peut rattacher à aucune donnée,
-- pendant que le client annonce « suppression en cours ».
--
-- RÈGLE, désormais en une seule contrainte auto-suffisante :
--   • cloud_save          ⇒ user_id IS NOT NULL  ET anonymous_session_id IS NULL
--   • political_analytics ⇒ anonymous_session_id IS NOT NULL ET user_id IS NULL
--   • measurement         ⇒ anonymous_session_id IS NOT NULL ET user_id IS NULL
--   • research            ⇒ anonymous_session_id IS NOT NULL ET user_id IS NULL
--
-- Ce sont les QUATRE seules formes acceptées. Tout le reste est refusé, y compris
-- `null / null` et les deux identifiants ensemble.

begin;

-- ─── 1. INVENTAIRE avant toute action ───────────────────────────────────────
--
-- On regarde ce qui existe AVANT de décider quoi en faire. Transformer d'office une ligne
-- sans sujet en décision rattachée à quelqu'un serait fabriquer un consentement — exactement
-- la faute que cette migration corrige.

do $$
declare
  v_total   bigint;
  r         record;
begin
  select count(*) into v_total
    from private.consent_records
   where anonymous_session_id is null and user_id is null;

  raise notice 'INVENTAIRE — % ligne(s) de consentement sans sujet technique', v_total;
  for r in
    select purpose, granted, count(*) as n, min(decided_at) as depuis, max(decided_at) as jusqu_a
      from private.consent_records
     where anonymous_session_id is null and user_id is null
     group by purpose, granted
     order by purpose, granted
  loop
    raise notice '  · % / granted=% : % ligne(s), du % au %',
      r.purpose, r.granted, r.n, r.depuis, r.jusqu_a;
  end loop;
end $$;

-- ─── 2. QUARANTAINE, jamais réattribution ───────────────────────────────────
--
-- DÉCISION DOCUMENTÉE : les lignes sans sujet sont DÉPLACÉES vers une table de quarantaine,
-- pas supprimées et pas complétées.
--   • Pas supprimées : ce sont des traces d'un défaut, et les effacer effacerait la preuve
--     que des décisions ont été mal enregistrées. Une autorité de contrôle a le droit de le
--     constater.
--   • Pas complétées : leur attribuer un sujet reviendrait à décider, aujourd'hui, à la
--     place d'une personne qu'on ne sait pas identifier. C'est précisément ce qu'il ne faut
--     pas faire.
-- La table de quarantaine n'est PAS `private.consent_records` : rien ne l'interroge pour
-- autoriser une collecte. Elle ne peut donc pas produire un consentement par accident.

create table if not exists private.consent_records_quarantine (
  like private.consent_records including defaults,
  quarantined_at timestamptz not null default now(),
  quarantine_reason text not null
);

comment on table private.consent_records_quarantine is
  'Décisions de consentement sans sujet technique, retirées du journal opposable et '
  'conservées telles quelles. Ne JAMAIS les réinjecter ni leur attribuer un sujet : elles '
  'n''établissent le consentement de personne.';

do $$
declare
  v_n bigint := 0;
begin
  if exists (select 1 from private.consent_records
              where anonymous_session_id is null and user_id is null) then
    -- Le journal est append-only par trigger : le déplacement est une opération de
    -- maintenance explicite, tracée ici, et le trigger est immédiatement remis.
    alter table private.consent_records disable trigger consent_records_append_only;

    insert into private.consent_records_quarantine
    select c.*, now(), 'no_subject_p0_2_20260814'
      from private.consent_records c
     where c.anonymous_session_id is null and c.user_id is null;

    delete from private.consent_records
     where anonymous_session_id is null and user_id is null;
    get diagnostics v_n = row_count;

    alter table private.consent_records enable trigger consent_records_append_only;
  end if;
  raise notice 'QUARANTAINE — % ligne(s) déplacée(s) hors du journal opposable', v_n;
end $$;

-- ─── 3. La contrainte, auto-suffisante ──────────────────────────────────────

-- L'ancienne contrainte partielle est remplacée, pas cumulée : deux règles qui se recouvrent
-- rendent les messages d'erreur illisibles et laissent croire qu'on peut en retirer une.
alter table private.consent_records
  drop constraint if exists consent_records_purpose_identifier_isolation;

alter table private.consent_records
  drop constraint if exists consent_records_purpose_identifier_form;

alter table private.consent_records
  add constraint consent_records_purpose_identifier_form
  check (
    case purpose
      -- La sauvegarde est rattachée au COMPTE, et à rien d'autre.
      when 'cloud_save' then user_id is not null and anonymous_session_id is null
      -- Toute finalité pseudonymisée : son propre pseudonyme, jamais le compte, jamais rien.
      else anonymous_session_id is not null and user_id is null
    end
  );

comment on constraint consent_records_purpose_identifier_form
  on private.consent_records is
  'Quatre formes valides, une par finalité. cloud_save porte le compte seul ; '
  'political_analytics, measurement et research portent chacun leur pseudonyme seul. '
  'Interdit à la fois de relier le pseudonyme politique au compte (donnée de l''article 9) '
  'et d''écrire une décision sans sujet — une non-preuve, et pour un retrait une demande de '
  'suppression que le serveur ne peut exécuter. Voir src/lib/consent.js, buildConsentDecisions().';

commit;
