-- Retrait de la contrainte de cloisonnement des identifiants par finalité.
-- ⚠ La revenir en arrière REAUTORISE l'écriture d'une ligne political_analytics portant un
-- identifiant de compte. À n'utiliser que pour un diagnostic, jamais comme état durable.
begin;
alter table private.consent_records
  drop constraint if exists consent_records_purpose_identifier_isolation;
commit;
