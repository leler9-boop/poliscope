-- POLISCOP — Cloisonnement des identifiants par finalité, imposé par la base.
--
-- DÉFAUT CORRIGÉ (P0-B2)
-- ----------------------
-- `buildConsentRecords()` estampillait chaque enregistrement avec `anonymous_session_id` ET
-- `user_id`. Une ligne `political_analytics` portait donc en même temps le pseudonyme
-- politique et l'identifiant de compte — exactement la table de correspondance que le texte
-- de consentement promet de ne pas créer.
--
-- Le correctif client est nécessaire mais insuffisant : il suffirait d'un appel direct à
-- l'API d'ingestion, d'un script de reprise ou d'une régression pour réintroduire le lien.
-- Une donnée de l'article 9 ne doit pas dépendre du seul bon comportement d'un client.
-- La règle est donc portée par une CONTRAINTE, qui refuse l'écriture.
--
-- RÈGLE
--   • political_analytics : pseudonyme SEUL, `user_id` obligatoirement NULL ;
--   • research            : pseudonyme SEUL, `user_id` obligatoirement NULL ;
--   • measurement         : pseudonyme SEUL (le sien, distinct), `user_id` NULL ;
--   • cloud_save          : compte SEUL, `anonymous_session_id` obligatoirement NULL.
--
-- Aucune ligne, quelle que soit la finalité, ne peut porter les deux.

begin;

-- Nettoyage préalable : sans lui, la contrainte échouerait sur d'éventuelles lignes déjà
-- écrites par la version fautive. On DÉLIE plutôt que de supprimer — la décision de
-- consentement est une preuve, seul le rattachement au compte est en trop.
update private.consent_records
   set user_id = null
 where purpose in ('political_analytics', 'research', 'measurement')
   and user_id is not null;

update private.consent_records
   set anonymous_session_id = null
 where purpose = 'cloud_save'
   and anonymous_session_id is not null;

alter table private.consent_records
  drop constraint if exists consent_records_purpose_identifier_isolation;

alter table private.consent_records
  add constraint consent_records_purpose_identifier_isolation
  check (
    -- Jamais les deux, quelle que soit la finalité.
    not (anonymous_session_id is not null and user_id is not null)
    and case purpose
      when 'cloud_save' then user_id is not null
      -- Les finalités pseudonymes n'acceptent AUCUN identifiant de compte.
      else user_id is null
    end
  );

comment on constraint consent_records_purpose_identifier_isolation
  on private.consent_records is
  'Interdit de relier le pseudonyme politique au compte. Une ligne political_analytics '
  'portant un user_id créerait la correspondance que le texte de consentement promet de '
  'ne pas créer — donnée de l''article 9. Voir src/lib/consent.js, identifiersFor().';

commit;
