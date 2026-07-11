-- ═══════════════════════════════════════════════════════════════════════════════
-- POLISCOP — Schema V6 : Data Platform
-- Conception : docs/data-platform/02-target-architecture.md (lire d'abord)
--
-- AUTONOME : ce fichier crée une base complète sur un projet Supabase NEUF.
-- Il ne dépend PAS de schema.sql → v5 (qui restent l'historique de l'ancien
-- projet). Si on réactive l'ancien projet avec ses données de test, voir la
-- section MIGRATION LEGACY tout en bas.
--
-- Prérequis projet : activer les extensions pg_cron et pgcrypto
-- (Dashboard → Database → Extensions), et l'auth anonyme
-- (Dashboard → Authentication → Providers → Anonymous sign-ins).
-- ═══════════════════════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────────────────────────────────────────
-- 0. Socle : suivi des migrations, config plateforme, helpers
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.schema_migrations (
  version     text PRIMARY KEY,           -- 'v6', 'v6.1', …
  applied_at  timestamptz NOT NULL DEFAULT now(),
  notes       text
);
ALTER TABLE public.schema_migrations ENABLE ROW LEVEL SECURITY; -- aucun accès client

-- Paramètres opérés par la plateforme (seuils k-anonymes, rétention…).
-- Une seule ligne ; les fonctions d'agrégat la lisent.
CREATE TABLE IF NOT EXISTS public.platform_config (
  id                 boolean PRIMARY KEY DEFAULT true CHECK (id), -- singleton
  min_cell_size      int  NOT NULL DEFAULT 30,   -- plancher pour tout agrégat servi
  min_publish_size   int  NOT NULL DEFAULT 200,  -- plancher pour publication externe
  retention_events_months int NOT NULL DEFAULT 24,
  updated_at         timestamptz NOT NULL DEFAULT now()
);
INSERT INTO public.platform_config DEFAULT VALUES ON CONFLICT DO NOTHING;
ALTER TABLE public.platform_config ENABLE ROW LEVEL SECURITY; -- service_role only

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. Administration : qui a le droit de voir les agrégats internes
-- ─────────────────────────────────────────────────────────────────────────────
-- Remplace le PIN client du FounderDashboard (faille F2 de l'audit 01).
-- Ajouter le fondateur après création de son compte :
--   INSERT INTO admin_users (user_id, label) VALUES ('<uuid>', 'founder');

CREATE TABLE IF NOT EXISTS public.admin_users (
  user_id    uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  label      text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY; -- géré via SQL editor only

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid());
$$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. RÉFÉRENTIELS VERSIONNÉS (append-only)
-- ─────────────────────────────────────────────────────────────────────────────

-- 2a. Registre des questions : une ligne par VERSION de chaque question.
-- Peuplé par scripts/seed-question-registry.mjs à chaque commit éditorial.
-- Une réponse enregistrée référence (question_id, question_version) : le texte
-- exact auquel l'utilisateur a répondu est retrouvable pour toujours.
CREATE TABLE IF NOT EXISTS public.question_registry (
  question_id   text     NOT NULL,              -- 'ECO_13'
  version       int      NOT NULL,              -- 1, 2, …
  text          text     NOT NULL,              -- texte FR au moment de la version
  text_hash     text     NOT NULL,              -- sha256(text) — détection de dérive
  direction     smallint NOT NULL CHECK (direction IN (-1, 1)),
  status        text     NOT NULL CHECK (status IN ('CORE','PRIMARY','SECONDARY')),
  theme         text     NOT NULL,
  is_active     boolean  NOT NULL DEFAULT true, -- false = retirée du corpus
  valid_from    timestamptz NOT NULL DEFAULT now(),
  notes         text,                           -- ex. 'polarité inversée vs v1'
  PRIMARY KEY (question_id, version)
);
ALTER TABLE public.question_registry ENABLE ROW LEVEL SECURITY;
CREATE POLICY "question_registry: public read"
  ON public.question_registry FOR SELECT USING (true); -- contenu public par nature

-- 2b. Registre des configurations de scoring (exposant, vetos, poids, stretch).
-- Le moteur JS émet sa version ; le serveur peut recalculer n'importe quel
-- profil historique à partir de response_events + question_registry + ceci.
CREATE TABLE IF NOT EXISTS public.scoring_configs (
  version     text PRIMARY KEY,               -- '2026.07' (date du dernier changement moteur)
  config      jsonb NOT NULL,                 -- {exponent:2.4, vetoes:{...}, statusWeights:{...}, stretch:0.75}
  valid_from  timestamptz NOT NULL DEFAULT now(),
  notes       text
);
ALTER TABLE public.scoring_configs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "scoring_configs: public read"
  ON public.scoring_configs FOR SELECT USING (true);

-- 2c. Registre des textes de consentement (preuve art. 7 : quel wording exact
-- l'utilisateur a-t-il accepté ?). Voir docs/data-platform/06 pour les textes.
CREATE TABLE IF NOT EXISTS public.consent_texts (
  purpose     text NOT NULL,                  -- 'cloud_save' | 'research' | 'demographics' | 'marketing'
  version     text NOT NULL,                  -- '2026-07'
  lang        text NOT NULL DEFAULT 'fr',
  body        text NOT NULL,                  -- le texte intégral montré à l'utilisateur
  valid_from  timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (purpose, version, lang)
);
ALTER TABLE public.consent_texts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "consent_texts: public read"
  ON public.consent_texts FOR SELECT USING (true);

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. CONSENTEMENT : ledger append-only (remplace user_consents, faille F1)
-- ─────────────────────────────────────────────────────────────────────────────
-- Une ligne par événement. JAMAIS d'UPDATE/DELETE, même par l'utilisateur :
-- retirer son consentement = INSÉRER un événement 'withdraw'. C'est la preuve
-- exigée par l'art. 7 RGPD, dans les deux sens.

CREATE TABLE IF NOT EXISTS public.consent_events (
  id            bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id       uuid  NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  purpose       text  NOT NULL CHECK (purpose IN ('cloud_save','research','demographics','marketing')),
  action        text  NOT NULL CHECK (action IN ('grant','withdraw')),
  text_version  text  NOT NULL,               -- → consent_texts.version
  created_at    timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.consent_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "consent_events: insert own"
  ON public.consent_events FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "consent_events: read own"
  ON public.consent_events FOR SELECT
  USING (auth.uid() = user_id);
-- Pas de policy UPDATE/DELETE : append-only par construction.

CREATE INDEX IF NOT EXISTS consent_events_user_purpose_idx
  ON public.consent_events (user_id, purpose, created_at DESC);

-- État courant du consentement (dernier événement par finalité).
CREATE OR REPLACE VIEW public.v_consent_current AS
SELECT DISTINCT ON (user_id, purpose)
  user_id, purpose,
  (action = 'grant') AS granted,
  text_version, created_at AS decided_at
FROM public.consent_events
ORDER BY user_id, purpose, created_at DESC;

-- Garde serveur utilisée par les policies d'écriture sensibles.
CREATE OR REPLACE FUNCTION public.has_consent(p_user uuid, p_purpose text)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT COALESCE((
    SELECT action = 'grant'
    FROM public.consent_events
    WHERE user_id = p_user AND purpose = p_purpose
    ORDER BY created_at DESC LIMIT 1
  ), false);
$$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. SESSIONS DE QUIZ (qualité + versions) — v2 de la table jamais câblée de v3
-- ─────────────────────────────────────────────────────────────────────────────
-- Une ligne par tentative. INSERT au démarrage, UPDATE à la complétion/abandon.
-- Porte les métadonnées qui rendent les réponses interprétables et filtrables.

CREATE TABLE IF NOT EXISTS public.quiz_sessions (
  id                     uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mode                   text CHECK (mode IN ('discovery','standard','deep','improve','refine')),
  questionnaire_version  text NOT NULL,       -- hash du corpus actif (émis par le client, vérifiable)
  scoring_version        text NOT NULL,       -- → scoring_configs.version
  app_version            text,                -- version du build front
  lang                   text,
  device_class           text CHECK (device_class IN ('mobile','tablet','desktop')),
  acquisition_source     text,               -- utm_source ou referrer host, nettoyé côté client
  started_at             timestamptz NOT NULL DEFAULT now(),
  completed_at           timestamptz,
  questions_shown        int  NOT NULL DEFAULT 0,
  questions_answered     int  NOT NULL DEFAULT 0,
  questions_skipped      int  NOT NULL DEFAULT 0,
  total_duration_ms      bigint,              -- somme des response_ms (calculée à la complétion)
  median_response_ms     int,                 -- signal qualité (cf. docs 07)
  straightline_run_max   int,                 -- plus longue suite de réponses identiques
  quality_flags          text[] NOT NULL DEFAULT '{}' -- ex. {'too_fast','straightline'} (posés par un job serveur)
);
ALTER TABLE public.quiz_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "quiz_sessions: insert own with consent"
  ON public.quiz_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id AND public.has_consent(auth.uid(), 'cloud_save'));
CREATE POLICY "quiz_sessions: update own"
  ON public.quiz_sessions FOR UPDATE
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "quiz_sessions: read own"
  ON public.quiz_sessions FOR SELECT USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS quiz_sessions_user_idx    ON public.quiz_sessions (user_id, started_at DESC);
CREATE INDEX IF NOT EXISTS quiz_sessions_started_idx ON public.quiz_sessions (started_at DESC);

-- ─────────────────────────────────────────────────────────────────────────────
-- 5. RESPONSE_EVENTS : le journal de réponses — l'actif central (décision D2)
-- ─────────────────────────────────────────────────────────────────────────────
-- Append-only, partitionné par mois. Une ligne par présentation de question :
-- réponse (value 1–5), skip (value NULL + skipped=true), ou révision d'une
-- réponse antérieure (is_revision=true).

CREATE TABLE IF NOT EXISTS public.response_events (
  id                bigint GENERATED ALWAYS AS IDENTITY,
  user_id           uuid  NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id        uuid  NOT NULL,             -- → quiz_sessions.id (pas de FK cross-partition nécessaire)
  question_id       text  NOT NULL,
  question_version  int   NOT NULL,             -- → question_registry
  value             smallint CHECK (value BETWEEN 1 AND 5),
  skipped           boolean NOT NULL DEFAULT false,
  is_revision       boolean NOT NULL DEFAULT false, -- réponse modifiée après coup
  seq               int,                        -- position de présentation dans la session
  response_ms       int,                        -- temps entre affichage et réponse
  created_at        timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (id, created_at),
  CONSTRAINT response_value_or_skip CHECK (skipped OR value IS NOT NULL)
) PARTITION BY RANGE (created_at);

ALTER TABLE public.response_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "response_events: insert own with consent"
  ON public.response_events FOR INSERT
  WITH CHECK (auth.uid() = user_id AND public.has_consent(auth.uid(), 'cloud_save'));
CREATE POLICY "response_events: read own"
  ON public.response_events FOR SELECT USING (auth.uid() = user_id);
-- Pas d'UPDATE : une réponse modifiée est un nouvel événement is_revision=true.
-- DELETE own autorisé (droit à l'effacement ciblé) :
CREATE POLICY "response_events: delete own"
  ON public.response_events FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS response_events_user_idx
  ON public.response_events (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS response_events_question_idx
  ON public.response_events (question_id, created_at DESC);
CREATE INDEX IF NOT EXISTS response_events_session_idx
  ON public.response_events (session_id);

-- Partitions initiales (la fonction §9 en crée automatiquement ensuite)
CREATE TABLE IF NOT EXISTS public.response_events_2026_07 PARTITION OF public.response_events
  FOR VALUES FROM ('2026-07-01') TO ('2026-08-01');
CREATE TABLE IF NOT EXISTS public.response_events_2026_08 PARTITION OF public.response_events
  FOR VALUES FROM ('2026-08-01') TO ('2026-09-01');

-- ─────────────────────────────────────────────────────────────────────────────
-- 6. ÉTAT COURANT (caches produit, reconstructibles depuis response_events)
-- ─────────────────────────────────────────────────────────────────────────────

-- 6a. Dernière réponse par question (le produit lit ceci, jamais le journal)
CREATE TABLE IF NOT EXISTS public.user_answers (
  user_id           uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id       text NOT NULL,
  question_version  int  NOT NULL,
  answer_value      smallint NOT NULL CHECK (answer_value BETWEEN 1 AND 5),
  updated_at        timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, question_id)
);
ALTER TABLE public.user_answers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_answers: manage own with consent"
  ON public.user_answers FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id AND public.has_consent(auth.uid(), 'cloud_save'));

-- 6b. Snapshot du profil calculé (versionné)
CREATE TABLE IF NOT EXISTS public.user_profiles (
  user_id                 uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  theme_scores            jsonb NOT NULL DEFAULT '{}',
  axes                    jsonb NOT NULL DEFAULT '{}',
  archetype_id            text,
  top_candidate_id        text,
  top_candidate_alignment smallint,
  confidence              text NOT NULL DEFAULT 'very_low',
  answered_count          int  NOT NULL DEFAULT 0,
  quiz_mode               text,
  questionnaire_version   text,
  scoring_version         text,
  created_at              timestamptz NOT NULL DEFAULT now(),
  updated_at              timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_profiles: manage own with consent"
  ON public.user_profiles FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id AND public.has_consent(auth.uid(), 'cloud_save'));
DROP TRIGGER IF EXISTS set_user_profiles_updated_at ON public.user_profiles;
CREATE TRIGGER set_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE INDEX IF NOT EXISTS user_profiles_archetype_idx
  ON public.user_profiles (archetype_id) WHERE archetype_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS user_profiles_candidate_idx
  ON public.user_profiles (top_candidate_id) WHERE top_candidate_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS user_profiles_created_idx
  ON public.user_profiles (created_at DESC);

-- 6c. Démographie déclarative — champs typés + CHECK (catalogue : docs 03).
-- Chaque champ est optionnel ('prefer_not_say' compte comme une réponse).
-- Gated par la finalité 'demographics' (consentement distinct de cloud_save).
CREATE TABLE IF NOT EXISTS public.user_demographics (
  user_id           uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  age_range         text CHECK (age_range IN ('15-17','18-24','25-34','35-44','45-54','55-64','65+')),
  gender            text CHECK (gender IN ('homme','femme','autre','prefer_not_say')),
  education_level   text CHECK (education_level IN ('brevet_ou_moins','cap_bep','bac','bac_2','bac_3_4','bac_5_plus','doctorat')),
  employment_status text CHECK (employment_status IN ('etudiant','salarie_prive','salarie_public','independant','chef_entreprise','sans_emploi','retraite','au_foyer','autre')),
  pcs_category      text CHECK (pcs_category IN ('agriculteurs','artisans_commercants','cadres_pi','professions_intermediaires','employes','ouvriers','sans_activite','na')), -- nomenclature PCS-INSEE niveau 1
  sector            text CHECK (sector IN ('public','prive','independant','na')),
  income_bracket    text CHECK (income_bracket IN ('lt_1500','1500_2500','2500_4000','4000_6000','gt_6000','prefer_not_say')), -- € net mensuel du foyer
  housing_status    text CHECK (housing_status IN ('proprietaire','locataire','heberge','autre')),
  commune_type      text CHECK (commune_type IN ('grande_ville','ville_moyenne','petite_ville','rural')),
  dept_code         text,                       -- '44', '2A', '976' — jamais le code postal complet (minimisation)
  has_children      boolean,
  couple_status     text CHECK (couple_status IN ('seul','couple','prefer_not_say')),
  lived_abroad      text CHECK (lived_abroad IN ('jamais','moins_1an','1_5ans','plus_5ans')),
  union_member      boolean,
  politics_interest text CHECK (politics_interest IN ('faible','moyen','fort','tres_fort')),
  news_frequency    text CHECK (news_frequency IN ('rarement','hebdo','quotidien','plusieurs_fois_jour')),
  main_news_source  text CHECK (main_news_source IN ('tv','radio','presse','sites_info','reseaux_sociaux','entourage','autre')),
  updated_at        timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.user_demographics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_demographics: manage own with consent"
  ON public.user_demographics FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id AND public.has_consent(auth.uid(), 'demographics'));
DROP TRIGGER IF EXISTS set_user_demographics_updated_at ON public.user_demographics;
CREATE TRIGGER set_user_demographics_updated_at
  BEFORE UPDATE ON public.user_demographics
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
-- NB : religion / vote passé / orientation déclarée = art. 9 supplémentaires,
-- DÉLIBÉRÉMENT absents du schéma v6 (option C du doc 03 §sensibles — décision fondateur+DPO).

-- 6d. Qualité par utilisateur (posée par le job serveur, cf. docs 07)
CREATE TABLE IF NOT EXISTS public.user_quality (
  user_id        uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  quality_score  numeric(3,2) CHECK (quality_score BETWEEN 0 AND 1), -- 1 = fiable
  flags          text[] NOT NULL DEFAULT '{}', -- {'too_fast','straightline','incoherent','duplicate_suspect'}
  computed_at    timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.user_quality ENABLE ROW LEVEL SECURITY; -- service_role only : jamais montré à l'utilisateur

-- ─────────────────────────────────────────────────────────────────────────────
-- 7. APP_EVENTS : télémétrie produit (partitionnée, purgée à 24 mois)
-- ─────────────────────────────────────────────────────────────────────────────
-- Séparée des réponses : la télémétrie est jetable, les réponses ne le sont pas.

CREATE TABLE IF NOT EXISTS public.app_events (
  id          bigint GENERATED ALWAYS AS IDENTITY,
  user_id     uuid REFERENCES auth.users(id) ON DELETE SET NULL, -- NULL = pré-consentement impossible : pas d'écriture sans uid
  event_name  text NOT NULL,
  props       jsonb,
  created_at  timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (id, created_at)
) PARTITION BY RANGE (created_at);

ALTER TABLE public.app_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "app_events: insert own"
  ON public.app_events FOR INSERT
  WITH CHECK (auth.uid() = user_id);
-- Pas de SELECT client.

CREATE INDEX IF NOT EXISTS app_events_name_time_idx ON public.app_events (event_name, created_at DESC);
CREATE INDEX IF NOT EXISTS app_events_time_brin     ON public.app_events USING brin (created_at);

CREATE TABLE IF NOT EXISTS public.app_events_2026_07 PARTITION OF public.app_events
  FOR VALUES FROM ('2026-07-01') TO ('2026-08-01');
CREATE TABLE IF NOT EXISTS public.app_events_2026_08 PARTITION OF public.app_events
  FOR VALUES FROM ('2026-08-01') TO ('2026-09-01');

-- ─────────────────────────────────────────────────────────────────────────────
-- 8. PUBLICATIONS : provenance de chaque chiffre publié (décision D8)
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.stats_releases (
  id                     uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title                  text NOT NULL,        -- 'Baromètre jeunes & Europe — juillet 2026'
  query_text             text NOT NULL,        -- la requête SQL exacte
  result                 jsonb NOT NULL,       -- le résultat figé au moment de la publication
  n_total                int  NOT NULL,        -- taille d'échantillon
  questionnaire_version  text,
  scoring_version        text,
  released_at            timestamptz NOT NULL DEFAULT now(),
  released_by            uuid REFERENCES auth.users(id),
  channel                text                  -- 'article' | 'twitter' | 'presse' | 'rapport'
);
ALTER TABLE public.stats_releases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "stats_releases: admin manage"
  ON public.stats_releases FOR ALL
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ─────────────────────────────────────────────────────────────────────────────
-- 9. MAINTENANCE AUTOMATIQUE (pg_cron)
-- ─────────────────────────────────────────────────────────────────────────────

-- 9a. Création des partitions du mois suivant (à exécuter chaque mois)
CREATE OR REPLACE FUNCTION public.ensure_next_month_partitions()
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  next_month date := date_trunc('month', now()) + interval '1 month';
  after_next date := next_month + interval '1 month';
  suffix text := to_char(next_month, 'YYYY_MM');
BEGIN
  EXECUTE format(
    'CREATE TABLE IF NOT EXISTS public.response_events_%s PARTITION OF public.response_events FOR VALUES FROM (%L) TO (%L)',
    suffix, next_month, after_next);
  EXECUTE format(
    'CREATE TABLE IF NOT EXISTS public.app_events_%s PARTITION OF public.app_events FOR VALUES FROM (%L) TO (%L)',
    suffix, next_month, after_next);
END; $$;

-- 9b. Purge de rétention : app_events > N mois (les response_events ne sont PAS
-- purgés — c'est l'actif ; leur droit à l'effacement est individuel, pas temporel)
CREATE OR REPLACE FUNCTION public.purge_old_app_events()
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE months int := (SELECT retention_events_months FROM public.platform_config);
BEGIN
  -- DROP des partitions entièrement expirées (instantané, pas de DELETE ligne à ligne)
  PERFORM 1; -- les DROP de partitions se font via un job dédié listant pg_inherits ;
             -- en attendant : DELETE borné, exécuté hors pointe
  EXECUTE format('DELETE FROM public.app_events WHERE created_at < now() - interval ''%s months''', months);
END; $$;

-- 9c. Recalcul des flags qualité de session (cf. docs 07 pour les seuils)
CREATE OR REPLACE FUNCTION public.refresh_session_quality()
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  UPDATE public.quiz_sessions qs SET quality_flags = sub.flags
  FROM (
    SELECT session_id,
      ARRAY_REMOVE(ARRAY[
        CASE WHEN percentile_cont(0.5) WITHIN GROUP (ORDER BY response_ms) < 1200 THEN 'too_fast' END,
        CASE WHEN MAX(run_len) >= 12 THEN 'straightline' END
      ], NULL) AS flags
    FROM (
      SELECT session_id, response_ms, value,
        COUNT(*) OVER (PARTITION BY session_id, grp) AS run_len
      FROM (
        SELECT session_id, response_ms, value,
          ROW_NUMBER() OVER (PARTITION BY session_id ORDER BY seq)
          - ROW_NUMBER() OVER (PARTITION BY session_id, value ORDER BY seq) AS grp
        FROM public.response_events WHERE NOT skipped
      ) runs
    ) t GROUP BY session_id
  ) sub
  WHERE qs.id = sub.session_id;
END; $$;

-- Planification (exécuter une fois, après activation de pg_cron) :
-- SELECT cron.schedule('partitions',      '0 3 25 * *', $$SELECT public.ensure_next_month_partitions()$$);
-- SELECT cron.schedule('purge-events',    '0 4 1 * *',  $$SELECT public.purge_old_app_events()$$);
-- SELECT cron.schedule('session-quality', '0 2 * * *',  $$SELECT public.refresh_session_quality()$$);
-- SELECT cron.schedule('refresh-mv',      '30 * * * *', $$SELECT public.refresh_analytics()$$);

-- ─────────────────────────────────────────────────────────────────────────────
-- 10. COUCHE ANALYTIQUE — agrégats matérialisés + accès k-anonyme
-- ─────────────────────────────────────────────────────────────────────────────

-- 10a. Population « fiable » : la base de tout agrégat (exclut la mauvaise qualité
-- et exige le consentement recherche pour être compté dans les statistiques)
CREATE OR REPLACE VIEW public.v_research_population AS
SELECT up.*
FROM public.user_profiles up
JOIN public.v_consent_current cc
  ON cc.user_id = up.user_id AND cc.purpose = 'research' AND cc.granted
LEFT JOIN public.user_quality uq ON uq.user_id = up.user_id
WHERE COALESCE(uq.quality_score, 1) >= 0.5
  AND NOT COALESCE(uq.flags && ARRAY['duplicate_suspect','bot_suspect']::text[], false);

-- 10b. Agrégats matérialisés (exemples fondateurs ; le catalogue complet des
-- vues v4 est regénéré sur ce modèle — même SELECT, source = v_research_population)
CREATE MATERIALIZED VIEW IF NOT EXISTS public.mv_theme_by_demo AS
SELECT
  d.age_range, d.gender, d.commune_type, d.employment_status,
  -- Masque GROUPING : identifie de quel jeu (simple ou croisé) provient la ligne,
  -- pour que les fonctions d'accès ne mélangent pas les niveaux d'agrégation.
  GROUPING(d.age_range, d.gender, d.commune_type, d.employment_status) AS grouping_mask,
  COUNT(*) AS n,
  ROUND(AVG((p.theme_scores->>'ECONOMY')::numeric), 1)         AS economy,
  ROUND(AVG((p.theme_scores->>'SOCIAL')::numeric), 1)          AS social,
  ROUND(AVG((p.theme_scores->>'IMMIGRATION')::numeric), 1)     AS immigration,
  ROUND(AVG((p.theme_scores->>'SECURITY')::numeric), 1)        AS security,
  ROUND(AVG((p.theme_scores->>'ENVIRONMENT')::numeric), 1)     AS environment,
  ROUND(AVG((p.theme_scores->>'DEMOCRACY')::numeric), 1)       AS democracy,
  ROUND(AVG((p.theme_scores->>'GLOBAL')::numeric), 1)          AS global,
  ROUND(AVG((p.theme_scores->>'PUBLIC_SERVICES')::numeric), 1) AS public_services
FROM public.v_research_population p
JOIN public.user_demographics d ON d.user_id = p.user_id
GROUP BY GROUPING SETS (
  (d.age_range), (d.gender), (d.commune_type), (d.employment_status),
  (d.age_range, d.gender), (d.age_range, d.commune_type)
);
-- NB : pas de plancher ICI (vue interne, jamais GRANTée) — le plancher est
-- appliqué par les fonctions d'accès (10c), seule surface exposée.

CREATE MATERIALIZED VIEW IF NOT EXISTS public.mv_question_stats AS
SELECT
  re.question_id,
  re.question_version,
  COUNT(*) FILTER (WHERE NOT re.skipped)                    AS responses,
  COUNT(*) FILTER (WHERE re.skipped)                        AS skips,
  ROUND(AVG(re.value) FILTER (WHERE NOT re.skipped), 2)     AS mean_value,
  ROUND(STDDEV(re.value) FILTER (WHERE NOT re.skipped), 2)  AS std_dev,
  ROUND(AVG(re.response_ms) FILTER (WHERE NOT re.skipped))  AS avg_response_ms
FROM public.response_events re
GROUP BY re.question_id, re.question_version;

CREATE OR REPLACE FUNCTION public.refresh_analytics()
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  REFRESH MATERIALIZED VIEW public.mv_theme_by_demo;
  REFRESH MATERIALIZED VIEW public.mv_question_stats;
END; $$;

-- 10c. Seule surface d'accès exposée : fonctions admin avec plancher k-anonyme.
-- Pattern à répliquer pour chaque agrégat servi au dashboard.
CREATE OR REPLACE FUNCTION public.admin_theme_by_demo(p_dimension text)
RETURNS TABLE (bucket text, n bigint, economy numeric, social numeric, immigration numeric,
               security numeric, environment numeric, democracy numeric, global numeric, public_services numeric)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  k int := (SELECT min_cell_size FROM public.platform_config);
  -- Masque GROUPING attendu pour chaque dimension simple (bits : age=8, gender=4,
  -- commune=2, employment=1 ; bit à 1 = colonne agrégée, donc absente du jeu).
  mask int := CASE p_dimension
    WHEN 'age_range'         THEN 7   -- (age)        → gender+commune+employment agrégés
    WHEN 'gender'            THEN 11  -- (gender)     → age+commune+employment agrégés
    WHEN 'commune_type'      THEN 13
    WHEN 'employment_status' THEN 14
    ELSE NULL END;
BEGIN
  IF NOT public.is_admin() THEN RAISE EXCEPTION 'admin only'; END IF;
  IF mask IS NULL THEN RAISE EXCEPTION 'unknown dimension %', p_dimension; END IF;
  RETURN QUERY EXECUTE format(
    'SELECT %I::text, n::bigint, economy, social, immigration, security, environment, democracy, global, public_services
     FROM public.mv_theme_by_demo
     WHERE grouping_mask = %s AND %I IS NOT NULL AND n >= %s
     ORDER BY n DESC',
    p_dimension, mask, p_dimension, k);
END; $$;
REVOKE ALL ON FUNCTION public.admin_theme_by_demo(text) FROM PUBLIC, anon;
GRANT  EXECUTE ON FUNCTION public.admin_theme_by_demo(text) TO authenticated; -- le garde is_admin() fait le tri

-- ─────────────────────────────────────────────────────────────────────────────
-- 11. DROITS UTILISATEUR (export / effacement)
-- ─────────────────────────────────────────────────────────────────────────────

-- Export portabilité (art. 20) : tout ce que la plateforme sait de l'utilisateur.
CREATE OR REPLACE FUNCTION public.export_my_data()
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE uid uuid := auth.uid();
BEGIN
  IF uid IS NULL THEN RAISE EXCEPTION 'not authenticated'; END IF;
  RETURN jsonb_build_object(
    'exported_at',   now(),
    'profile',       (SELECT to_jsonb(p) FROM public.user_profiles p WHERE p.user_id = uid),
    'answers',       (SELECT COALESCE(jsonb_agg(to_jsonb(a)), '[]') FROM public.user_answers a WHERE a.user_id = uid),
    'response_log',  (SELECT COALESCE(jsonb_agg(to_jsonb(r)), '[]') FROM public.response_events r WHERE r.user_id = uid),
    'demographics',  (SELECT to_jsonb(d) FROM public.user_demographics d WHERE d.user_id = uid),
    'consents',      (SELECT COALESCE(jsonb_agg(to_jsonb(c)), '[]') FROM public.consent_events c WHERE c.user_id = uid),
    'sessions',      (SELECT COALESCE(jsonb_agg(to_jsonb(s)), '[]') FROM public.quiz_sessions s WHERE s.user_id = uid)
  );
END; $$;

-- Effacement (art. 17) : purge toutes les données du demandeur, PLUS le compte
-- auth lui-même — enfin possible en self-service via une fonction DEFINER
-- (résout la limite « email au support » de la v5). Le ledger de consentement
-- est purgé aussi : après effacement total il n'y a plus de traitement à prouver.
CREATE OR REPLACE FUNCTION public.delete_my_account()
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE uid uuid := auth.uid();
BEGIN
  IF uid IS NULL THEN RAISE EXCEPTION 'not authenticated'; END IF;
  DELETE FROM public.response_events   WHERE user_id = uid;
  DELETE FROM public.user_answers      WHERE user_id = uid;
  DELETE FROM public.user_profiles     WHERE user_id = uid;
  DELETE FROM public.user_demographics WHERE user_id = uid;
  DELETE FROM public.quiz_sessions     WHERE user_id = uid;
  DELETE FROM public.app_events        WHERE user_id = uid;
  DELETE FROM public.user_quality      WHERE user_id = uid;
  DELETE FROM public.consent_events    WHERE user_id = uid;
  DELETE FROM auth.users               WHERE id = uid; -- supprime le compte lui-même
END; $$;
-- NB : les agrégats matérialisés déjà calculés ne sont pas dé-cumulés (position
-- standard : un agrégat k-anonyme n'est plus une donnée personnelle) ; le
-- prochain refresh reflète la suppression.

REVOKE ALL ON FUNCTION public.export_my_data()    FROM PUBLIC, anon;
GRANT  EXECUTE ON FUNCTION public.export_my_data()    TO authenticated;
REVOKE ALL ON FUNCTION public.delete_my_account() FROM PUBLIC, anon;
GRANT  EXECUTE ON FUNCTION public.delete_my_account() TO authenticated;

-- ─────────────────────────────────────────────────────────────────────────────
-- 12. MIGRATION LEGACY (uniquement si l'ancien projet est réactivé avec données)
-- ─────────────────────────────────────────────────────────────────────────────
-- 1. user_consents → consent_events :
--    INSERT INTO consent_events (user_id, purpose, action, text_version, created_at)
--    SELECT user_id, 'cloud_save', CASE WHEN granted THEN 'grant' ELSE 'withdraw' END,
--           version, updated_at FROM public.user_consents;
-- 2. user_answers (ancien) → response_events (une ligne rétroactive par réponse,
--    question_version = version active à la date updated_at, sinon 1) puis
--    réécriture de user_answers au nouveau format.
-- 3. events → app_events (INSERT SELECT par tranche de mois).
-- 4. profiles, anonymous_answers, anonymous_sessions, user_consents, events :
--    DROP après vérification.

INSERT INTO public.schema_migrations (version, notes)
VALUES ('v6', 'data platform : referentiels versionnés, ledger consentement, response_events partitionné, k-anonymat, admin auth')
ON CONFLICT (version) DO NOTHING;
