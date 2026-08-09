-- ============================================================================
-- POLISCOP — CIBLE : distinguer l'état d'une réponse de sa valeur.
--
-- ⚠ SPÉCIFICATION — NON APPLIQUÉE, ET DÉLIBÉRÉMENT NON HORODATÉE POUR EXÉCUTION.
-- Le nom de fichier contient un `T` précisément pour qu'elle ne soit pas ramassée par un
-- `supabase db push` : elle décrit la cible, elle ne doit pas partir par inadvertance.
--
-- PROBLÈME
-- --------
-- `user_answers.answer_value` est un `smallint` contraint 1–5. « Sans opinion » n'a donc pas
-- de représentation. La solution en vigueur (D-13) est transitoire : ces réponses restent
-- locales et ne sont pas synchronisées. Conséquence — sur un second appareil, une question
-- explicitement passée réapparaît comme jamais posée.
--
-- Encoder « sans opinion » comme 0 ou 3 est EXCLU : ce serait fabriquer une position là où
-- l'utilisateur a dit ne pas en avoir.
--
-- CIBLE
-- -----
-- Une colonne d'ÉTAT à côté de la valeur :
--   response_state = 'answered'    → answer_value ∈ [1,5]
--   response_state = 'no_opinion'  → answer_value IS NULL
-- Une contrainte croisée rend tout autre couple impossible au niveau de la base.
--
-- STRATÉGIE : expand / contract, en quatre déploiements distincts. Chaque étape laisse la
-- production fonctionnelle avec l'ancien ET le nouveau frontend — c'est la seule façon de
-- migrer sans fenêtre de casse.
-- ============================================================================

-- ─── ÉTAPE 1 — EXPAND (compatible avec le frontend actuel) ──────────────────
-- Déployable seule. L'ancien client continue d'écrire `answer_value` sans rien savoir de
-- `response_state`, dont la valeur par défaut le décrit correctement.

alter table public.user_answers
  add column if not exists response_state text not null default 'answered';

alter table public.user_answers
  drop constraint if exists user_answers_response_state_check;
alter table public.user_answers
  add constraint user_answers_response_state_check
  check (response_state in ('answered', 'no_opinion'));

-- La colonne doit devenir nullable pour qu'un « sans opinion » puisse ne porter aucune valeur.
alter table public.user_answers
  alter column answer_value drop not null;

-- Cohérence croisée : impossible d'avoir une valeur sans état, ou un « sans opinion » chiffré.
alter table public.user_answers
  drop constraint if exists user_answers_state_value_coherence;
alter table public.user_answers
  add constraint user_answers_state_value_coherence check (
    (response_state = 'answered'   and answer_value is not null and answer_value between 1 and 5)
    or
    (response_state = 'no_opinion' and answer_value is null)
  );

comment on column public.user_answers.response_state is
  'answered = position exprimée (answer_value 1–5) · no_opinion = pas de position (answer_value NULL). Ne jamais encoder l''absence d''opinion par une valeur du domaine.';


-- ─── ÉTAPE 2 — ÉCRITURE DOUBLE (déploiement frontend) ───────────────────────
-- Le client écrit désormais `response_state` explicitement. Aucune migration SQL : il s'agit
-- de remplacer, dans `src/lib/cloudAnswers.js`, le filtrage transitoire par un mapping complet :
--
--   NO_OPINION → { response_state: 'no_opinion', answer_value: null }
--   1–5        → { response_state: 'answered',   answer_value: v }
--
-- et de supprimer la suppression de ligne compensatoire (D-13), devenue inutile.


-- ─── ÉTAPE 3 — BACKFILL (aucun effet ici : rien à reconstruire) ─────────────
-- Les lignes existantes portent toutes une valeur 1–5, donc `response_state = 'answered'`,
-- ce que le DEFAULT de l'étape 1 a déjà posé. Requête de contrôle à archiver :
--
--   select response_state, count(*), count(answer_value)
--   from public.user_answers group by 1;
--
-- Attendu : une seule ligne `answered`, count(*) = count(answer_value).
--
-- Les « sans opinion » antérieurs à cette migration sont IRRÉCUPÉRABLES : ils n'ont jamais
-- quitté les appareils. Ne pas tenter de les reconstituer — ce serait de l'invention.


-- ─── ÉTAPE 4 — CONTRACT (release ultérieure) ────────────────────────────────
-- Une fois que plus aucun client n'écrit sans `response_state` (surveiller les versions de
-- frontend actives), retirer le DEFAULT pour forcer un état explicite :
--
--   alter table public.user_answers alter column response_state drop default;
--
-- Ne PAS faire cela avant : les navigateurs gardent longtemps un bundle en cache.


-- ─── ROLLBACK ───────────────────────────────────────────────────────────────
-- Réversible tant que l'étape 4 n'est pas franchie ET qu'aucune ligne 'no_opinion' n'existe :
--
--   delete from public.user_answers where response_state = 'no_opinion';  -- ⚠ perte de données
--   alter table public.user_answers drop constraint user_answers_state_value_coherence;
--   alter table public.user_answers drop constraint user_answers_response_state_check;
--   alter table public.user_answers alter column answer_value set not null;
--   alter table public.user_answers drop column response_state;
--
-- Après l'étape 4, un rollback détruit des réponses utilisateur : sauvegarde obligatoire.
-- ============================================================================
