-- Retour à la contrainte partielle de cloisonnement (20260812100000).
--
-- ⚠ CE QUE CE ROLLBACK RÉAUTORISE. La contrainte restaurée n'exige un sujet que pour
-- `cloud_save` : une ligne `political_analytics`, `measurement` ou `research` pourra de
-- nouveau être écrite avec `anonymous_session_id = null` et `user_id = null` — une décision
-- de consentement qui n'établit le consentement de personne, et un retrait que le serveur ne
-- pourra jamais exécuter. À n'utiliser que pour un diagnostic, jamais comme état durable.
--
-- Les lignes déjà mises en quarantaine ne sont PAS réinjectées : leur absence de sujet est
-- un fait, pas un effet de la contrainte. `private.consent_records_quarantine` est conservée.

begin;

alter table private.consent_records
  drop constraint if exists consent_records_purpose_identifier_form;

alter table private.consent_records
  add constraint consent_records_purpose_identifier_isolation
  check (
    not (anonymous_session_id is not null and user_id is not null)
    and case purpose
      when 'cloud_save' then user_id is not null
      else user_id is null
    end
  );

commit;
