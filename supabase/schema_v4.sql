-- ═══════════════════════════════════════════════════════════════════════════════
-- POLISCOP — Schema V4 : Intelligence politique croisée
-- Run AFTER schema.sql + schema_v2.sql + schema_v3.sql
-- Safe: uses ALTER TABLE IF NOT EXISTS, CREATE OR REPLACE VIEW throughout.
--
-- Objectif : répondre aux questions fondamentales :
--   • Quel % des utilisateurs sont compatibles avec Glucksmann / Philippe ?
--   • Quels archétypes dominent chez les 18-24 ans ?
--   • Les étudiants sont-ils plus pro-européens ?
--   • Les habitants ruraux sont-ils plus souverainistes ?
--   • Les femmes sont-elles plus favorables à l'IVG ?
--   • Quelles questions divisent le plus les Français ?
--   • Quelles tendances évoluent dans le temps ?
-- ═══════════════════════════════════════════════════════════════════════════════


-- ─────────────────────────────────────────────────────────────────────────────
-- 1. user_demographics — nouvelles colonnes haute valeur analytique
-- ─────────────────────────────────────────────────────────────────────────────

-- commune_type: type de commune de résidence
-- Values: 'grande_ville' (>100K) | 'ville_moyenne' (10K–100K) | 'petite_ville' (2K–10K) | 'rural' (<2K)
-- Intelligence: rural vs urbain est la variable la plus prédictive du vote en France
ALTER TABLE public.user_demographics
  ADD COLUMN IF NOT EXISTS commune_type text;

-- Index pour requêtes rural/urbain
CREATE INDEX IF NOT EXISTS user_demographics_commune_type_idx
  ON public.user_demographics (commune_type)
  WHERE commune_type IS NOT NULL;

-- Index sur gender (pour cross-tabs IVG, féminisme, etc.)
CREATE INDEX IF NOT EXISTS user_demographics_gender_idx
  ON public.user_demographics (gender)
  WHERE gender IS NOT NULL;

-- Index sur employment_status (étudiant vs retraité vs salarié)
CREATE INDEX IF NOT EXISTS user_demographics_employment_status_idx
  ON public.user_demographics (employment_status)
  WHERE employment_status IS NOT NULL;


-- ─────────────────────────────────────────────────────────────────────────────
-- 2. user_profiles — ajouter le mode du quiz
-- ─────────────────────────────────────────────────────────────────────────────

-- mode: quiz mode used to generate this profile ('quick' | 'standard' | 'full')
-- Intelligence: les profils "full" sont plus fiables statistiquement
ALTER TABLE public.user_profiles
  ADD COLUMN IF NOT EXISTS quiz_mode text;

-- Index pour filtrer par mode de quiz
CREATE INDEX IF NOT EXISTS user_profiles_quiz_mode_idx
  ON public.user_profiles (quiz_mode)
  WHERE quiz_mode IS NOT NULL;


-- ─────────────────────────────────────────────────────────────────────────────
-- 3. Vues cross-tabs haute intelligence politique
-- ─────────────────────────────────────────────────────────────────────────────
-- Ces vues permettent de répondre aux questions :
-- "Les femmes soutiennent-elles davantage l'IVG ?"
-- "Les ruraux sont-ils plus souverainistes ?"
-- "Les étudiants sont-ils plus pro-européens ?"
-- Toutes les vues : service_role uniquement (agrégats, jamais de PII)

-- ── 3a. Candidat × genre ──────────────────────────────────────────────────────
-- "Quel % des hommes sont compatibles avec Glucksmann ?"
-- "Quel % des femmes sont compatibles avec Philippe ?"
CREATE OR REPLACE VIEW public.v_candidate_by_gender AS
SELECT
  up.top_candidate_id,
  ud.gender,
  COUNT(*)                                   AS user_count,
  ROUND(AVG(up.top_candidate_alignment), 1)  AS avg_alignment,
  ROUND(AVG((up.theme_scores->>'SOCIAL')::numeric), 1)       AS avg_social,
  ROUND(AVG((up.theme_scores->>'IMMIGRATION')::numeric), 1)  AS avg_immigration,
  ROUND(AVG((up.theme_scores->>'ENVIRONMENT')::numeric), 1)  AS avg_environment,
  ROUND(AVG((up.axes->>'economic')::numeric), 1)             AS avg_economic_axis,
  ROUND(AVG((up.axes->>'social')::numeric), 1)               AS avg_social_axis
FROM public.user_profiles up
JOIN public.user_demographics ud ON ud.user_id = up.user_id
WHERE up.top_candidate_id IS NOT NULL
  AND ud.gender IS NOT NULL
  AND ud.gender NOT IN ('ne_se_prononce', '')
GROUP BY up.top_candidate_id, ud.gender
ORDER BY up.top_candidate_id, user_count DESC;


-- ── 3b. Candidat × âge ───────────────────────────────────────────────────────
-- "Quel % des 18-24 ans sont compatibles avec Glucksmann ?"
-- "Les retraités sont-ils plus compatibles avec Philippe ?"
CREATE OR REPLACE VIEW public.v_candidate_by_age AS
SELECT
  up.top_candidate_id,
  ud.age_range,
  COUNT(*)                                   AS user_count,
  ROUND(AVG(up.top_candidate_alignment), 1)  AS avg_alignment,
  ROUND(AVG((up.axes->>'economic')::numeric), 1) AS avg_economic_axis,
  ROUND(AVG((up.axes->>'social')::numeric), 1)   AS avg_social_axis,
  ROUND(AVG((up.theme_scores->>'IMMIGRATION')::numeric), 1) AS avg_immigration,
  ROUND(AVG((up.theme_scores->>'ENVIRONMENT')::numeric), 1) AS avg_environment
FROM public.user_profiles up
JOIN public.user_demographics ud ON ud.user_id = up.user_id
WHERE up.top_candidate_id IS NOT NULL
  AND ud.age_range IS NOT NULL
GROUP BY up.top_candidate_id, ud.age_range
ORDER BY up.top_candidate_id, ud.age_range;


-- ── 3c. Candidat × type de commune ──────────────────────────────────────────
-- "Les ruraux sont-ils plus compatibles avec le RN ?"
-- "Les grandes villes sont-elles plus à gauche ?"
CREATE OR REPLACE VIEW public.v_candidate_by_commune AS
SELECT
  up.top_candidate_id,
  ud.commune_type,
  COUNT(*)                                   AS user_count,
  ROUND(AVG(up.top_candidate_alignment), 1)  AS avg_alignment,
  ROUND(AVG((up.axes->>'economic')::numeric), 1)  AS avg_economic_axis,
  ROUND(AVG((up.axes->>'social')::numeric), 1)    AS avg_social_axis,
  ROUND(AVG((up.theme_scores->>'IMMIGRATION')::numeric), 1)  AS avg_immigration,
  ROUND(AVG((up.theme_scores->>'SECURITY')::numeric), 1)     AS avg_security,
  ROUND(AVG((up.theme_scores->>'ENVIRONMENT')::numeric), 1)  AS avg_environment
FROM public.user_profiles up
JOIN public.user_demographics ud ON ud.user_id = up.user_id
WHERE up.top_candidate_id IS NOT NULL
  AND ud.commune_type IS NOT NULL
GROUP BY up.top_candidate_id, ud.commune_type
ORDER BY up.top_candidate_id, user_count DESC;


-- ── 3d. Candidat × statut professionnel ─────────────────────────────────────
-- "Les étudiants sont-ils plus compatibles avec la gauche ?"
-- "Les indépendants sont-ils plus libéraux ?"
CREATE OR REPLACE VIEW public.v_candidate_by_employment AS
SELECT
  up.top_candidate_id,
  ud.employment_status,
  COUNT(*)                                   AS user_count,
  ROUND(AVG(up.top_candidate_alignment), 1)  AS avg_alignment,
  ROUND(AVG((up.axes->>'economic')::numeric), 1)  AS avg_economic_axis,
  ROUND(AVG((up.axes->>'social')::numeric), 1)    AS avg_social_axis,
  ROUND(AVG((up.theme_scores->>'ECONOMY')::numeric), 1)  AS avg_economy
FROM public.user_profiles up
JOIN public.user_demographics ud ON ud.user_id = up.user_id
WHERE up.top_candidate_id IS NOT NULL
  AND ud.employment_status IS NOT NULL
GROUP BY up.top_candidate_id, ud.employment_status
ORDER BY up.top_candidate_id, user_count DESC;


-- ── 3e. Archétype × genre ────────────────────────────────────────────────────
-- "Les femmes sont-elles plus 'Progressiste Social' ?"
-- "Les hommes sont-ils plus 'Souverainiste' ?"
CREATE OR REPLACE VIEW public.v_archetype_by_gender AS
SELECT
  up.archetype_id,
  ud.gender,
  COUNT(*)                                   AS user_count,
  ROUND(AVG(up.top_candidate_alignment), 1)  AS avg_top_alignment,
  ROUND(AVG((up.axes->>'economic')::numeric), 1) AS avg_economic,
  ROUND(AVG((up.axes->>'social')::numeric), 1)   AS avg_social
FROM public.user_profiles up
JOIN public.user_demographics ud ON ud.user_id = up.user_id
WHERE up.archetype_id IS NOT NULL
  AND ud.gender IS NOT NULL
  AND ud.gender NOT IN ('ne_se_prononce', '')
GROUP BY up.archetype_id, ud.gender
ORDER BY up.archetype_id, user_count DESC;


-- ── 3f. Archétype × type de commune ─────────────────────────────────────────
-- "Quels archétypes dominent dans les zones rurales ?"
CREATE OR REPLACE VIEW public.v_archetype_by_commune AS
SELECT
  up.archetype_id,
  ud.commune_type,
  COUNT(*)                                   AS user_count,
  ROUND(AVG(up.top_candidate_alignment), 1)  AS avg_top_alignment,
  ROUND(AVG((up.axes->>'economic')::numeric), 1) AS avg_economic,
  ROUND(AVG((up.axes->>'social')::numeric), 1)   AS avg_social
FROM public.user_profiles up
JOIN public.user_demographics ud ON ud.user_id = up.user_id
WHERE up.archetype_id IS NOT NULL
  AND ud.commune_type IS NOT NULL
GROUP BY up.archetype_id, ud.commune_type
ORDER BY up.archetype_id, user_count DESC;


-- ── 3g. Archétype × statut professionnel ────────────────────────────────────
-- "Quels archétypes dominent chez les étudiants ?"
-- "Les retraités sont-ils plus conservateurs ?"
CREATE OR REPLACE VIEW public.v_archetype_by_employment AS
SELECT
  up.archetype_id,
  ud.employment_status,
  COUNT(*)                                   AS user_count,
  ROUND(AVG(up.top_candidate_alignment), 1)  AS avg_top_alignment,
  ROUND(AVG((up.axes->>'economic')::numeric), 1) AS avg_economic,
  ROUND(AVG((up.axes->>'social')::numeric), 1)   AS avg_social
FROM public.user_profiles up
JOIN public.user_demographics ud ON ud.user_id = up.user_id
WHERE up.archetype_id IS NOT NULL
  AND ud.employment_status IS NOT NULL
GROUP BY up.archetype_id, ud.employment_status
ORDER BY up.archetype_id, user_count DESC;


-- ── 3h. Thème × genre — pour "Les femmes et l'IVG" ──────────────────────────
-- "Quelle est la différence hommes/femmes sur chaque thème ?"
CREATE OR REPLACE VIEW public.v_theme_scores_by_gender AS
SELECT
  ud.gender,
  COUNT(*)                                                         AS user_count,
  ROUND(AVG((up.theme_scores->>'ECONOMY')::numeric), 1)           AS avg_economy,
  ROUND(AVG((up.theme_scores->>'SOCIAL')::numeric), 1)            AS avg_social,
  ROUND(AVG((up.theme_scores->>'IMMIGRATION')::numeric), 1)       AS avg_immigration,
  ROUND(AVG((up.theme_scores->>'SECURITY')::numeric), 1)          AS avg_security,
  ROUND(AVG((up.theme_scores->>'ENVIRONMENT')::numeric), 1)       AS avg_environment,
  ROUND(AVG((up.theme_scores->>'DEMOCRACY')::numeric), 1)         AS avg_democracy,
  ROUND(AVG((up.theme_scores->>'GLOBAL')::numeric), 1)            AS avg_global,
  ROUND(AVG((up.theme_scores->>'PUBLIC_SERVICES')::numeric), 1)   AS avg_public_services,
  ROUND(AVG((up.axes->>'economic')::numeric), 1)                  AS avg_economic_axis,
  ROUND(AVG((up.axes->>'social')::numeric), 1)                    AS avg_social_axis
FROM public.user_profiles up
JOIN public.user_demographics ud ON ud.user_id = up.user_id
WHERE ud.gender IS NOT NULL
  AND ud.gender NOT IN ('ne_se_prononce', '')
GROUP BY ud.gender
ORDER BY user_count DESC;


-- ── 3i. Thème × âge — pour "Les jeunes et l'Europe" ────────────────────────
-- "Comment les opinions évoluent-elles selon l'âge ?"
CREATE OR REPLACE VIEW public.v_theme_scores_by_age AS
SELECT
  ud.age_range,
  COUNT(*)                                                         AS user_count,
  ROUND(AVG((up.theme_scores->>'ECONOMY')::numeric), 1)           AS avg_economy,
  ROUND(AVG((up.theme_scores->>'SOCIAL')::numeric), 1)            AS avg_social,
  ROUND(AVG((up.theme_scores->>'IMMIGRATION')::numeric), 1)       AS avg_immigration,
  ROUND(AVG((up.theme_scores->>'SECURITY')::numeric), 1)          AS avg_security,
  ROUND(AVG((up.theme_scores->>'ENVIRONMENT')::numeric), 1)       AS avg_environment,
  ROUND(AVG((up.theme_scores->>'DEMOCRACY')::numeric), 1)         AS avg_democracy,
  ROUND(AVG((up.theme_scores->>'GLOBAL')::numeric), 1)            AS avg_global,
  ROUND(AVG((up.theme_scores->>'PUBLIC_SERVICES')::numeric), 1)   AS avg_public_services,
  ROUND(AVG((up.axes->>'economic')::numeric), 1)                  AS avg_economic_axis,
  ROUND(AVG((up.axes->>'social')::numeric), 1)                    AS avg_social_axis
FROM public.user_profiles up
JOIN public.user_demographics ud ON ud.user_id = up.user_id
WHERE ud.age_range IS NOT NULL
GROUP BY ud.age_range
ORDER BY ud.age_range;


-- ── 3j. Thème × commune — pour "Les ruraux et l'immigration" ───────────────
CREATE OR REPLACE VIEW public.v_theme_scores_by_commune AS
SELECT
  ud.commune_type,
  COUNT(*)                                                         AS user_count,
  ROUND(AVG((up.theme_scores->>'ECONOMY')::numeric), 1)           AS avg_economy,
  ROUND(AVG((up.theme_scores->>'SOCIAL')::numeric), 1)            AS avg_social,
  ROUND(AVG((up.theme_scores->>'IMMIGRATION')::numeric), 1)       AS avg_immigration,
  ROUND(AVG((up.theme_scores->>'SECURITY')::numeric), 1)          AS avg_security,
  ROUND(AVG((up.theme_scores->>'ENVIRONMENT')::numeric), 1)       AS avg_environment,
  ROUND(AVG((up.theme_scores->>'DEMOCRACY')::numeric), 1)         AS avg_democracy,
  ROUND(AVG((up.theme_scores->>'GLOBAL')::numeric), 1)            AS avg_global,
  ROUND(AVG((up.theme_scores->>'PUBLIC_SERVICES')::numeric), 1)   AS avg_public_services,
  ROUND(AVG((up.axes->>'economic')::numeric), 1)                  AS avg_economic_axis,
  ROUND(AVG((up.axes->>'social')::numeric), 1)                    AS avg_social_axis
FROM public.user_profiles up
JOIN public.user_demographics ud ON ud.user_id = up.user_id
WHERE ud.commune_type IS NOT NULL
GROUP BY ud.commune_type
ORDER BY user_count DESC;


-- ── 3k. Thème × statut professionnel ────────────────────────────────────────
-- "Les étudiants sont-ils plus favorables à la redistribution ?"
-- "Les indépendants sont-ils plus libéraux ?"
CREATE OR REPLACE VIEW public.v_theme_scores_by_employment AS
SELECT
  ud.employment_status,
  COUNT(*)                                                         AS user_count,
  ROUND(AVG((up.theme_scores->>'ECONOMY')::numeric), 1)           AS avg_economy,
  ROUND(AVG((up.theme_scores->>'SOCIAL')::numeric), 1)            AS avg_social,
  ROUND(AVG((up.theme_scores->>'IMMIGRATION')::numeric), 1)       AS avg_immigration,
  ROUND(AVG((up.theme_scores->>'SECURITY')::numeric), 1)          AS avg_security,
  ROUND(AVG((up.theme_scores->>'ENVIRONMENT')::numeric), 1)       AS avg_environment,
  ROUND(AVG((up.theme_scores->>'DEMOCRACY')::numeric), 1)         AS avg_democracy,
  ROUND(AVG((up.theme_scores->>'GLOBAL')::numeric), 1)            AS avg_global,
  ROUND(AVG((up.theme_scores->>'PUBLIC_SERVICES')::numeric), 1)   AS avg_public_services,
  ROUND(AVG((up.axes->>'economic')::numeric), 1)                  AS avg_economic_axis,
  ROUND(AVG((up.axes->>'social')::numeric), 1)                    AS avg_social_axis
FROM public.user_profiles up
JOIN public.user_demographics ud ON ud.user_id = up.user_id
WHERE ud.employment_status IS NOT NULL
GROUP BY ud.employment_status
ORDER BY user_count DESC;


-- ── 3l. Questions les plus polarisantes par groupe démographique ─────────────
-- "Quelles questions créent les plus gros écarts entre générations ?"
-- Nécessite que les events question_answered soient populés.
CREATE OR REPLACE VIEW public.v_question_by_age AS
SELECT
  (e.props->>'question_id')                             AS question_id,
  (e.props->>'theme')                                   AS theme,
  ud.age_range,
  COUNT(*)                                              AS response_count,
  ROUND(AVG((e.props->>'value')::numeric), 2)           AS mean_answer,
  ROUND(STDDEV((e.props->>'value')::numeric), 2)        AS std_dev,
  ROUND(100.0 * SUM(CASE WHEN (e.props->>'value')::int >= 4 THEN 1 ELSE 0 END) / COUNT(*), 1) AS pct_agree,
  ROUND(100.0 * SUM(CASE WHEN (e.props->>'value')::int <= 2 THEN 1 ELSE 0 END) / COUNT(*), 1) AS pct_disagree
FROM public.events e
JOIN public.user_demographics ud ON ud.user_id = e.user_id
WHERE e.event_name = 'question_answered'
  AND e.props->>'question_id' IS NOT NULL
  AND ud.age_range IS NOT NULL
GROUP BY e.props->>'question_id', e.props->>'theme', ud.age_range
HAVING COUNT(*) >= 20
ORDER BY e.props->>'question_id', ud.age_range;


-- ── 3m. Questions les plus polarisantes par genre ───────────────────────────
CREATE OR REPLACE VIEW public.v_question_by_gender AS
SELECT
  (e.props->>'question_id')                             AS question_id,
  (e.props->>'theme')                                   AS theme,
  ud.gender,
  COUNT(*)                                              AS response_count,
  ROUND(AVG((e.props->>'value')::numeric), 2)           AS mean_answer,
  ROUND(STDDEV((e.props->>'value')::numeric), 2)        AS std_dev,
  ROUND(100.0 * SUM(CASE WHEN (e.props->>'value')::int >= 4 THEN 1 ELSE 0 END) / COUNT(*), 1) AS pct_agree,
  ROUND(100.0 * SUM(CASE WHEN (e.props->>'value')::int <= 2 THEN 1 ELSE 0 END) / COUNT(*), 1) AS pct_disagree
FROM public.events e
JOIN public.user_demographics ud ON ud.user_id = e.user_id
WHERE e.event_name = 'question_answered'
  AND e.props->>'question_id' IS NOT NULL
  AND ud.gender IN ('homme', 'femme')
GROUP BY e.props->>'question_id', e.props->>'theme', ud.gender
HAVING COUNT(*) >= 20
ORDER BY e.props->>'question_id', ud.gender;


-- ── 3n. Évolution temporelle des thèmes (mensuelle) ─────────────────────────
-- "Y a-t-il un glissement vers la gauche ou la droite depuis le lancement ?"
CREATE OR REPLACE VIEW public.v_theme_trend_monthly AS
SELECT
  date_trunc('month', up.created_at AT TIME ZONE 'Europe/Paris')  AS month,
  COUNT(*)                                                          AS user_count,
  ROUND(AVG((up.theme_scores->>'ECONOMY')::numeric), 1)            AS avg_economy,
  ROUND(AVG((up.theme_scores->>'SOCIAL')::numeric), 1)             AS avg_social,
  ROUND(AVG((up.theme_scores->>'IMMIGRATION')::numeric), 1)        AS avg_immigration,
  ROUND(AVG((up.theme_scores->>'SECURITY')::numeric), 1)           AS avg_security,
  ROUND(AVG((up.theme_scores->>'ENVIRONMENT')::numeric), 1)        AS avg_environment,
  ROUND(AVG((up.theme_scores->>'GLOBAL')::numeric), 1)             AS avg_global,
  ROUND(AVG((up.axes->>'economic')::numeric), 1)                   AS avg_economic_axis,
  ROUND(AVG((up.axes->>'social')::numeric), 1)                     AS avg_social_axis
FROM public.user_profiles up
GROUP BY month
ORDER BY month DESC;


-- ── 3o. Compatibilité candidat globale ───────────────────────────────────────
-- "Quel % des utilisateurs sont compatibles avec Glucksmann (alignment >= 60) ?"
CREATE OR REPLACE VIEW public.v_candidate_compatibility AS
SELECT
  top_candidate_id,
  COUNT(*)                                            AS total_users,
  SUM(CASE WHEN top_candidate_alignment >= 70 THEN 1 ELSE 0 END) AS strong_match,
  SUM(CASE WHEN top_candidate_alignment >= 60 THEN 1 ELSE 0 END) AS good_match,
  SUM(CASE WHEN top_candidate_alignment >= 50 THEN 1 ELSE 0 END) AS moderate_match,
  ROUND(100.0 * SUM(CASE WHEN top_candidate_alignment >= 60 THEN 1 ELSE 0 END) / COUNT(*), 1) AS pct_compatible_60,
  ROUND(100.0 * SUM(CASE WHEN top_candidate_alignment >= 70 THEN 1 ELSE 0 END) / COUNT(*), 1) AS pct_compatible_70,
  ROUND(AVG(top_candidate_alignment), 1) AS avg_alignment
FROM public.user_profiles
WHERE top_candidate_id IS NOT NULL
GROUP BY top_candidate_id
ORDER BY total_users DESC;


-- ── 3p. Distribution des axes politiques — boussole idéologique ─────────────
-- Pour visualiser le "centre de gravité" des utilisateurs
CREATE OR REPLACE VIEW public.v_political_compass AS
SELECT
  -- Quadrant idéologique
  CASE
    WHEN (axes->>'economic')::numeric >= 50 AND (axes->>'social')::numeric >= 50
      THEN 'gauche_progressiste'
    WHEN (axes->>'economic')::numeric < 50 AND (axes->>'social')::numeric >= 50
      THEN 'droite_progressiste'
    WHEN (axes->>'economic')::numeric >= 50 AND (axes->>'social')::numeric < 50
      THEN 'gauche_conservatrice'
    ELSE
      'droite_conservatrice'
  END AS quadrant,
  COUNT(*)                                            AS user_count,
  ROUND(AVG((axes->>'economic')::numeric), 1)         AS avg_economic,
  ROUND(AVG((axes->>'social')::numeric), 1)           AS avg_social,
  ROUND(AVG(top_candidate_alignment), 1)              AS avg_top_alignment
FROM public.user_profiles
WHERE axes IS NOT NULL
  AND axes->>'economic' IS NOT NULL
  AND axes->>'social' IS NOT NULL
GROUP BY quadrant
ORDER BY user_count DESC;


-- ─────────────────────────────────────────────────────────────────────────────
-- 4. Vue qualité des données — monitoring pour le fondateur
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE VIEW public.v_data_quality AS
SELECT
  -- Utilisateurs totaux
  (SELECT COUNT(*) FROM auth.users)                             AS total_users,
  -- Profils créés
  (SELECT COUNT(*) FROM public.user_profiles)                   AS profiles_created,
  -- Profils avec archétype
  (SELECT COUNT(*) FROM public.user_profiles WHERE archetype_id IS NOT NULL) AS profiles_with_archetype,
  -- Profils avec données démographiques
  (SELECT COUNT(*) FROM public.user_demographics)               AS demographics_filled,
  -- Démographies avec genre
  (SELECT COUNT(*) FROM public.user_demographics WHERE gender IS NOT NULL AND gender != '') AS demographics_with_gender,
  -- Démographies avec commune
  (SELECT COUNT(*) FROM public.user_demographics WHERE commune_type IS NOT NULL) AS demographics_with_commune,
  -- Démographies avec emploi
  (SELECT COUNT(*) FROM public.user_demographics WHERE employment_status IS NOT NULL) AS demographics_with_employment,
  -- Events trackés au total
  (SELECT COUNT(*) FROM public.events)                          AS total_events,
  -- Réponses aux questions trackées
  (SELECT COUNT(*) FROM public.events WHERE event_name = 'question_answered') AS question_answers_tracked,
  -- Taux de couverture démographique
  ROUND(
    100.0 * (SELECT COUNT(*) FROM public.user_demographics)
    / NULLIF((SELECT COUNT(*) FROM public.user_profiles), 0), 1
  )                                                             AS demographics_coverage_pct,
  -- Taux de couverture genre
  ROUND(
    100.0 * (SELECT COUNT(*) FROM public.user_demographics WHERE gender IS NOT NULL AND gender != '')
    / NULLIF((SELECT COUNT(*) FROM public.user_demographics), 0), 1
  )                                                             AS gender_coverage_pct;


-- ─────────────────────────────────────────────────────────────────────────────
-- 5. Mise à jour des vues materialisées pour inclure commune_type et gender
-- ─────────────────────────────────────────────────────────────────────────────

-- Recréer mv_archetype_distribution avec nouveaux champs démographiques agrégés
DROP MATERIALIZED VIEW IF EXISTS public.mv_archetype_distribution;
CREATE MATERIALIZED VIEW public.mv_archetype_distribution AS
SELECT
  up.archetype_id,
  COUNT(*)                                              AS user_count,
  ROUND(AVG(up.top_candidate_alignment), 1)             AS avg_top_alignment,
  ROUND(AVG(up.answered_count), 0)                      AS avg_answered_count,
  ROUND(AVG((up.axes->>'economic')::numeric), 1)        AS avg_economic_axis,
  ROUND(AVG((up.axes->>'social')::numeric), 1)          AS avg_social_axis,
  -- % d'hommes et de femmes dans cet archétype
  ROUND(100.0 * SUM(CASE WHEN ud.gender = 'homme' THEN 1 ELSE 0 END) / COUNT(*), 1) AS pct_homme,
  ROUND(100.0 * SUM(CASE WHEN ud.gender = 'femme' THEN 1 ELSE 0 END) / COUNT(*), 1) AS pct_femme,
  -- % de ruraux
  ROUND(100.0 * SUM(CASE WHEN ud.commune_type = 'rural' THEN 1 ELSE 0 END) / COUNT(*), 1) AS pct_rural,
  -- % d'étudiants
  ROUND(100.0 * SUM(CASE WHEN ud.employment_status = 'etudiant' THEN 1 ELSE 0 END) / COUNT(*), 1) AS pct_etudiant,
  MIN(up.created_at) AS first_seen,
  MAX(up.updated_at) AS last_seen
FROM public.user_profiles up
LEFT JOIN public.user_demographics ud ON ud.user_id = up.user_id
WHERE up.archetype_id IS NOT NULL
GROUP BY up.archetype_id
ORDER BY user_count DESC;

CREATE UNIQUE INDEX IF NOT EXISTS mv_archetype_distribution_archetype_idx
  ON public.mv_archetype_distribution (archetype_id);


-- ─────────────────────────────────────────────────────────────────────────────
-- 6. Fonctions RPC supplémentaires (SECURITY DEFINER — sûres pour le frontend)
-- ─────────────────────────────────────────────────────────────────────────────

-- 6a. Compatibilité candidat par groupe démographique
-- Permet d'afficher sur le profil : "X% des utilisateurs de ton groupe
-- sont compatibles avec [candidat]"
CREATE OR REPLACE FUNCTION public.get_candidate_compat_by_group(
  p_candidate_id  text,
  p_group_type    text,   -- 'gender' | 'age_range' | 'commune_type' | 'employment_status'
  p_group_value   text    -- e.g. 'femme' | '18-24' | 'rural' | 'etudiant'
)
RETURNS TABLE(
  group_label         text,
  total_users         bigint,
  pct_compatible_60   numeric,
  avg_alignment       numeric
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    p_group_value::text,
    COUNT(*),
    ROUND(100.0 * SUM(CASE WHEN up.top_candidate_alignment >= 60 THEN 1 ELSE 0 END) / NULLIF(COUNT(*), 0), 1),
    ROUND(AVG(up.top_candidate_alignment), 1)
  FROM public.user_profiles up
  JOIN public.user_demographics ud ON ud.user_id = up.user_id
  WHERE up.top_candidate_id = p_candidate_id
    AND (
      (p_group_type = 'gender'            AND ud.gender            = p_group_value) OR
      (p_group_type = 'age_range'         AND ud.age_range         = p_group_value) OR
      (p_group_type = 'commune_type'      AND ud.commune_type      = p_group_value) OR
      (p_group_type = 'employment_status' AND ud.employment_status  = p_group_value)
    );
END;
$$;


-- 6b. Top 5 questions les plus clivantes entre deux groupes
-- "Quelles questions créent les plus gros écarts hommes/femmes ?"
CREATE OR REPLACE FUNCTION public.get_top_divisive_questions_between_groups(
  p_group_type   text,    -- 'gender' | 'age_range' | 'commune_type'
  p_group_a      text,    -- e.g. 'homme'
  p_group_b      text,    -- e.g. 'femme'
  p_limit        int DEFAULT 10
)
RETURNS TABLE(
  question_id  text,
  theme        text,
  mean_a       numeric,
  mean_b       numeric,
  delta        numeric,
  responses_a  bigint,
  responses_b  bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  WITH group_a AS (
    SELECT
      (e.props->>'question_id') AS qid,
      (e.props->>'theme')       AS theme,
      AVG((e.props->>'value')::numeric) AS mean_val,
      COUNT(*) AS n
    FROM public.events e
    JOIN public.user_demographics ud ON ud.user_id = e.user_id
    WHERE e.event_name = 'question_answered'
      AND e.props->>'question_id' IS NOT NULL
      AND (
        (p_group_type = 'gender'       AND ud.gender       = p_group_a) OR
        (p_group_type = 'age_range'    AND ud.age_range    = p_group_a) OR
        (p_group_type = 'commune_type' AND ud.commune_type = p_group_a)
      )
    GROUP BY e.props->>'question_id', e.props->>'theme'
    HAVING COUNT(*) >= 20
  ),
  group_b AS (
    SELECT
      (e.props->>'question_id') AS qid,
      AVG((e.props->>'value')::numeric) AS mean_val,
      COUNT(*) AS n
    FROM public.events e
    JOIN public.user_demographics ud ON ud.user_id = e.user_id
    WHERE e.event_name = 'question_answered'
      AND e.props->>'question_id' IS NOT NULL
      AND (
        (p_group_type = 'gender'       AND ud.gender       = p_group_b) OR
        (p_group_type = 'age_range'    AND ud.age_range    = p_group_b) OR
        (p_group_type = 'commune_type' AND ud.commune_type = p_group_b)
      )
    GROUP BY e.props->>'question_id'
    HAVING COUNT(*) >= 20
  )
  SELECT
    a.qid,
    a.theme,
    ROUND(a.mean_val, 2),
    ROUND(b.mean_val, 2),
    ROUND(ABS(a.mean_val - b.mean_val), 2) AS delta,
    a.n,
    b.n
  FROM group_a a
  JOIN group_b b ON b.qid = a.qid
  ORDER BY ABS(a.mean_val - b.mean_val) DESC
  LIMIT p_limit;
END;
$$;


-- ─────────────────────────────────────────────────────────────────────────────
-- 7. Notes
-- ─────────────────────────────────────────────────────────────────────────────
-- ORDRE D'EXÉCUTION :
--   1. schema.sql       (tables de base)
--   2. schema_v2.sql    (colonnes d'intelligence + vues de base)
--   3. schema_v3.sql    (user_consents, quiz_sessions, question_analytics, vues avancées)
--   4. schema_v4.sql    (ce fichier — commune_type, vues cross-tabs, insights)
--
-- VUES CLÉS POUR LES MÉDIAS :
--   v_theme_scores_by_gender     → "Les femmes et l'IVG"
--   v_theme_scores_by_age        → "Les 18-24 ans et l'Europe"
--   v_theme_scores_by_commune    → "Les ruraux et l'immigration"
--   v_candidate_by_gender        → "Les femmes votent Glucksmann ?"
--   v_candidate_compatibility    → "X% compatibles avec Philippe"
--   v_political_compass          → "La France est-elle de gauche ?"
--   v_question_by_gender         → "Questions qui divisent hommes/femmes"
--   v_data_quality               → État des données en temps réel
--
-- FONCTIONS CLÉS :
--   get_candidate_compat_by_group(candidat, type, valeur)
--     → "X% des étudiants sont compatibles avec Glucksmann"
--   get_top_divisive_questions_between_groups(type, A, B, n)
--     → "Top 10 questions qui divisent les ruraux et les urbains"
--
-- POUR UN ARTICLE DE PRESSE :
--   SELECT * FROM v_theme_scores_by_age ORDER BY age_range;
--   → Montre l'évolution des opinions sur 8 thèmes par génération
