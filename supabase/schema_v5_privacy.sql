-- ═══════════════════════════════════════════════════════════════════════════════
-- POLISCOP — Schema V5 : Correctifs de confidentialité (RGPD, mission 2026-07-11)
-- Run AFTER schema.sql + schema_v2.sql + schema_v3.sql + schema_v4.sql.
-- Safe to run on an existing database — uses DROP POLICY IF EXISTS / IF NOT EXISTS throughout.
--
-- Contexte : audit ciblé du flux de données politiques, voir
-- audit/rgpd-remediation-2026-07/01-cartographie-flux-donnees.md pour le détail complet.
-- Non exécuté sur la base de production au moment de l'écriture — le projet Supabase
-- lié à ce dépôt (xjpzqaqzoygcwtcpumfo) est inactif (voir INTELLIGENCE_AUDIT_V2.md,
-- « permanently paused »). À exécuter sur le prochain projet actif, avant toute mise
-- en production, dans l'ordre schema.sql → v2 → v3 → v4 → v5 (ce fichier).
-- ═══════════════════════════════════════════════════════════════════════════════


-- ─────────────────────────────────────────────────────────────────────────────
-- 1. anonymous_answers — corriger la même faille RLS déjà identifiée et corrigée
--    sur anonymous_sessions dans schema_v2.sql, mais jamais appliquée ici.
-- ─────────────────────────────────────────────────────────────────────────────
-- Avant : FOR ALL USING (true) WITH CHECK (true) — n'importe quel détenteur de la
-- clé anon publique (par construction exposée dans le bundle JS) peut lire les
-- réponses politiques individuelles de TOUS les visiteurs anonymes via
-- `SELECT * FROM anonymous_answers`. C'est une fuite de données, pas seulement un
-- problème de traçabilité.
--
-- Après : même schéma que anonymous_sessions — INSERT ouvert (nécessaire, un
-- nouveau visiteur n'a pas d'identité préalable à vérifier), UPDATE/DELETE ouverts
-- mais SELECT non accordé à la clé anon. Un client légitime qui connaît déjà son
-- propre anonymous_id (stocké dans son localStorage) peut toujours mettre à jour ou
-- supprimer SES propres lignes en le précisant explicitement dans sa requête.
--
-- ⚠️ Limite assumée, à documenter et non à présenter comme une garantie absolue :
-- sans authentification anonyme réelle (supabase.auth.signInAnonymously(), qui donnerait
-- un auth.uid() vérifiable côté serveur), Postgres RLS ne peut pas prouver qu'un
-- appelant est le propriétaire légitime d'un anonymous_id donné — seule l'absence de
-- SELECT empêche l'énumération en masse. Une attaque ciblée sachant déjà un
-- anonymous_id précis (fuite par ailleurs) resterait possible sur UPDATE/DELETE.
-- Une migration vers l'authentification anonyme Supabase donnerait une garantie
-- cryptographique réelle ; c'est un changement d'architecture plus large, proposé
-- mais non appliqué dans cette migration (voir le rapport de mission pour le détail).

DROP POLICY IF EXISTS "anonymous_answers: open insert/update" ON public.anonymous_answers;

CREATE POLICY "anonymous_answers: open insert"
  ON public.anonymous_answers FOR INSERT
  WITH CHECK (true);

CREATE POLICY "anonymous_answers: update own row (best-effort)"
  ON public.anonymous_answers FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "anonymous_answers: delete own row (best-effort)"
  ON public.anonymous_answers FOR DELETE
  USING (true);

-- SELECT intentionnellement non accordé à la clé anon — cf. anonymous_sessions
-- dans schema_v2.sql, § 4, qui applique déjà ce même principe.


-- ─────────────────────────────────────────────────────────────────────────────
-- 2. quiz_sessions — même correctif préventif, bien que la table ne soit
--    actuellement appelée par aucun code applicatif (vérifié par recherche
--    exhaustive dans src/, 2026-07-11). Corrigé par cohérence avant qu'elle
--    ne soit un jour câblée sans que ce correctif soit repensé.
-- ─────────────────────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "quiz_sessions: open update" ON public.quiz_sessions;

CREATE POLICY "quiz_sessions: update own row (best-effort)"
  ON public.quiz_sessions FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- L'INSERT ouvert (quiz_sessions: open insert, schema_v3.sql) reste inchangé.
-- SELECT toujours non accordé à la clé anon (aucune policy SELECT définie).


-- ─────────────────────────────────────────────────────────────────────────────
-- 3. user_consents — confirmer l'usage réel de la table déjà conçue dans
--    schema_v3.sql. Aucune modification de structure : ce fichier documente
--    seulement qu'à partir de cette migration, le code applicatif (src/lib/auth.jsx)
--    lit et écrit effectivement cette table avant toute sauvegarde de données
--    politiques identifiées. Voir audit/rgpd-remediation-2026-07/ pour le détail
--    du parcours de consentement implémenté.
-- ─────────────────────────────────────────────────────────────────────────────


-- ─────────────────────────────────────────────────────────────────────────────
-- 4. Purge de rétention — préparée, NON exécutée automatiquement.
-- ─────────────────────────────────────────────────────────────────────────────
-- Cette migration ne planifie aucune tâche cron (pg_cron n'est pas activé sur ce
-- projet à notre connaissance, et le projet lié est actuellement inactif — non
-- vérifiable). Les commandes ci-dessous sont prêtes à être exécutées manuellement
-- via l'éditeur SQL Supabase, ou à brancher sur pg_cron / une Edge Function
-- planifiée une fois l'infrastructure confirmée active.
--
-- events : purge au-delà de 24 mois (déjà documentée dans schema_v2.sql, jamais
-- automatisée) :
--   DELETE FROM public.events WHERE created_at < now() - INTERVAL '24 months';
--
-- anonymous_answers / anonymous_sessions : un visiteur anonyme qui n'est jamais
-- revenu depuis 12 mois n'a plus d'usage légitime identifié pour Poliscop ;
-- purge suggérée (à valider avant activation, aucune donnée politique identifiée
-- n'est perdue puisque ces lignes ne sont jamais liées à un compte tant qu'aucune
-- fusion n'a eu lieu) :
--   DELETE FROM public.anonymous_answers
--     WHERE anonymous_id IN (
--       SELECT id FROM public.anonymous_sessions WHERE last_seen_at < now() - INTERVAL '12 months'
--     );
--   DELETE FROM public.anonymous_sessions WHERE last_seen_at < now() - INTERVAL '12 months';
--
-- user_consents révoqués depuis longtemps : conserver (c'est la preuve d'audit du
-- retrait de consentement), ne pas purger.


-- ─────────────────────────────────────────────────────────────────────────────
-- 5. Données déjà stockées avant ce correctif (« legacy ») — repérage, non
--    exécuté automatiquement.
-- ─────────────────────────────────────────────────────────────────────────────
-- Avant cette migration, user_answers/user_profiles étaient écrits sur simple
-- connexion, sans passer par un enregistrement de consentement dans
-- user_consents (la table existait depuis schema_v3.sql mais n'était pas
-- encore lue/écrite par le code applicatif — voir § 3 ci-dessus). Toute ligne
-- user_answers/user_profiles pour un user_id n'ayant PAS de ligne
-- user_consents(consent_type='political_data', granted=true) est donc une
-- donnée « historique » : stockée légitimement selon les règles en vigueur au
-- moment de l'écriture, mais sans la preuve de consentement qu'on exigerait
-- aujourd'hui.
--
-- Le projet Supabase actuellement lié à ce dépôt est inactif (voir
-- INTELLIGENCE_AUDIT_V2.md) — cette requête n'a donc pas pu être exécutée pour
-- mesurer l'ampleur réelle du problème. Avant la mise en production sur le
-- prochain projet actif, exécuter ceci pour lister les comptes concernés :
--
--   SELECT ua.user_id, count(*) AS answer_rows
--   FROM public.user_answers ua
--   LEFT JOIN public.user_consents uc
--     ON uc.user_id = ua.user_id AND uc.consent_type = 'political_data' AND uc.granted = true
--   WHERE uc.user_id IS NULL
--   GROUP BY ua.user_id;
--
-- Deux options pour ces comptes, à trancher par une personne habilitée (pas
-- une décision purement technique) avant mise en production :
--   (a) leur redemander un consentement explicite au prochain login (ré-afficher
--       ConsentModal même si des données existent déjà — nécessiterait de ne
--       plus traiter "aucune ligne user_consents" comme équivalent à
--       "jamais demandé" côté UI, ce qui est son comportement actuel) ;
--   (b) purger ces lignes historiques faute de preuve de consentement.
-- Nous recommandons (a) par défaut — moins destructif — sauf avis juridique
-- contraire. Non tranché ici : nécessite une validation professionnelle, pas
-- seulement technique (voir le rapport de mission, chantier 1 étape 5).
