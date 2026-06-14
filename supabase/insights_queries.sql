-- ═══════════════════════════════════════════════════════════════════════════════
-- POLISCOP — Insights Queries
-- Requêtes prêtes à copier pour répondre aux vraies questions politiques.
--
-- Pré-requis : schema.sql + schema_v2.sql + schema_v3.sql + schema_v4.sql exécutés.
-- Usage     : Coller directement dans l'éditeur SQL Supabase.
-- ═══════════════════════════════════════════════════════════════════════════════


-- ═══════════════════════════════════════════════════════════════════════════════
-- SECTION 1 — SANTÉ DES DONNÉES
-- Avant toute analyse, vérifier qu'on a assez de données pour être significatifs.
-- ═══════════════════════════════════════════════════════════════════════════════

-- 1.1 — Vue globale de la qualité des données
SELECT * FROM public.v_data_quality;
-- Attend : demographics_coverage_pct > 30% pour des analyses fiables.

-- 1.2 — Combien d'utilisateurs avons-nous par groupe démographique ?
-- Seuil minimum recommandé : n >= 50 pour une conclusion publiable.
SELECT
  'gender'          AS variable,
  gender            AS valeur,
  COUNT(*)          AS n
FROM public.user_demographics
WHERE gender IS NOT NULL AND gender != ''
GROUP BY gender

UNION ALL

SELECT
  'age_range',
  age_range,
  COUNT(*)
FROM public.user_demographics
WHERE age_range IS NOT NULL
GROUP BY age_range

UNION ALL

SELECT
  'commune_type',
  commune_type,
  COUNT(*)
FROM public.user_demographics
WHERE commune_type IS NOT NULL
GROUP BY commune_type

UNION ALL

SELECT
  'employment_status',
  employment_status,
  COUNT(*)
FROM public.user_demographics
WHERE employment_status IS NOT NULL
GROUP BY employment_status

ORDER BY variable, n DESC;


-- ═══════════════════════════════════════════════════════════════════════════════
-- SECTION 2 — COMPATIBILITÉ CANDIDATS
-- "Quel % des utilisateurs sont compatibles avec Glucksmann / Philippe ?"
-- ═══════════════════════════════════════════════════════════════════════════════

-- 2.1 — Compatibilité globale par candidat
-- Tri par nombre de top-matches (candidat favori).
SELECT * FROM public.v_candidate_compatibility
ORDER BY total_users DESC;
-- Lit : "X% des utilisateurs sont compatibles (>= 60%) avec [candidat]"

-- 2.2 — Quel est le candidat numéro 1 de chaque tranche d'âge ?
SELECT
  ud.age_range,
  up.top_candidate_id,
  COUNT(*) AS n,
  ROUND(AVG(up.top_candidate_alignment), 1) AS avg_align,
  ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (PARTITION BY ud.age_range), 1) AS pct_du_groupe
FROM public.user_profiles up
JOIN public.user_demographics ud ON ud.user_id = up.user_id
WHERE ud.age_range IS NOT NULL
  AND up.top_candidate_id IS NOT NULL
GROUP BY ud.age_range, up.top_candidate_id
ORDER BY ud.age_range, n DESC;

-- 2.3 — Quel est le candidat numéro 1 par genre ?
SELECT
  ud.gender,
  up.top_candidate_id,
  COUNT(*) AS n,
  ROUND(AVG(up.top_candidate_alignment), 1) AS avg_align,
  ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (PARTITION BY ud.gender), 1) AS pct_du_groupe
FROM public.user_profiles up
JOIN public.user_demographics ud ON ud.user_id = up.user_id
WHERE ud.gender IN ('homme', 'femme')
  AND up.top_candidate_id IS NOT NULL
GROUP BY ud.gender, up.top_candidate_id
ORDER BY ud.gender, n DESC;

-- 2.4 — Quel est le candidat numéro 1 par type de commune ?
SELECT
  ud.commune_type,
  up.top_candidate_id,
  COUNT(*) AS n,
  ROUND(AVG(up.top_candidate_alignment), 1) AS avg_align,
  ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (PARTITION BY ud.commune_type), 1) AS pct_du_groupe
FROM public.user_profiles up
JOIN public.user_demographics ud ON ud.user_id = up.user_id
WHERE ud.commune_type IS NOT NULL
  AND up.top_candidate_id IS NOT NULL
GROUP BY ud.commune_type, up.top_candidate_id
ORDER BY ud.commune_type, n DESC;

-- 2.5 — Compatibilité détaillée d'UN candidat par groupe (remplacer 'glucksmann')
SELECT * FROM public.v_candidate_by_gender WHERE top_candidate_id = 'glucksmann';
SELECT * FROM public.v_candidate_by_age   WHERE top_candidate_id = 'glucksmann';
SELECT * FROM public.v_candidate_by_commune WHERE top_candidate_id = 'glucksmann';

-- 2.6 — Score moyen d'alignement avec chaque candidat (toutes les combinaisons)
-- Plus utile pour comparer la "cible" de chaque candidat.
SELECT
  up.top_candidate_id,
  COUNT(*)                                         AS total_top_matches,
  ROUND(AVG(up.top_candidate_alignment), 1)        AS avg_alignment,
  ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 1) AS pct_of_all_users
FROM public.user_profiles
WHERE top_candidate_id IS NOT NULL
GROUP BY top_candidate_id
ORDER BY total_top_matches DESC;


-- ═══════════════════════════════════════════════════════════════════════════════
-- SECTION 3 — ARCHÉTYPES PAR GROUPE
-- "Quels archétypes dominent chez les 18-24 ans ?"
-- "Les étudiants sont-ils plus 'Progressiste Social' ?"
-- ═══════════════════════════════════════════════════════════════════════════════

-- 3.1 — Distribution des archétypes chez les 18-24 ans
SELECT
  up.archetype_id,
  COUNT(*) AS n,
  ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 1) AS pct
FROM public.user_profiles up
JOIN public.user_demographics ud ON ud.user_id = up.user_id
WHERE ud.age_range = '18-24'
  AND up.archetype_id IS NOT NULL
GROUP BY up.archetype_id
ORDER BY n DESC;

-- 3.2 — Archétype dominant par tranche d'âge (comparaison générationnelle)
SELECT * FROM public.v_archetype_by_employment ORDER BY archetype_id, user_count DESC;
SELECT * FROM public.v_archetype_by_commune ORDER BY archetype_id, user_count DESC;
SELECT * FROM public.v_archetype_by_gender ORDER BY archetype_id, user_count DESC;

-- 3.3 — Archétype le plus fréquent chez les ÉTUDIANTS
SELECT
  up.archetype_id,
  COUNT(*) AS n,
  ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 1) AS pct
FROM public.user_profiles up
JOIN public.user_demographics ud ON ud.user_id = up.user_id
WHERE ud.employment_status = 'etudiant'
  AND up.archetype_id IS NOT NULL
GROUP BY up.archetype_id
ORDER BY n DESC;

-- 3.4 — Archétype le plus fréquent chez les RURAUX
SELECT
  up.archetype_id,
  COUNT(*) AS n,
  ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 1) AS pct
FROM public.user_profiles up
JOIN public.user_demographics ud ON ud.user_id = up.user_id
WHERE ud.commune_type = 'rural'
  AND up.archetype_id IS NOT NULL
GROUP BY up.archetype_id
ORDER BY n DESC;

-- 3.5 — Vue matérialisée enrichie des archétypes (mise à jour manuellement)
SELECT * FROM public.mv_archetype_distribution ORDER BY user_count DESC;
-- Pour rafraîchir : SELECT public.refresh_analytics_views();


-- ═══════════════════════════════════════════════════════════════════════════════
-- SECTION 4 — THÈMES PAR GROUPE DÉMOGRAPHIQUE
-- "Les étudiants sont-ils plus pro-européens ?"
-- "Les ruraux sont-ils plus souverainistes ?"
-- "Les femmes sont-elles plus favorables au social ?"
-- ═══════════════════════════════════════════════════════════════════════════════

-- 4.1 — Scores par genre (les 8 thèmes + axes)
SELECT * FROM public.v_theme_scores_by_gender;
-- Interprétation : SOCIAL > 60 = progressiste sur les questions de société.
-- IMMIGRATION < 40 = restrictif sur l'immigration.
-- GLOBAL > 60 = pro-européen / internationaliste.

-- 4.2 — Scores par tranche d'âge — tableau générationnel
SELECT * FROM public.v_theme_scores_by_age ORDER BY age_range;
-- Lit : comment les 18-24 diffèrent des 65+ sur l'environnement, l'immigration...

-- 4.3 — Scores par type de commune — fossé urbain/rural
SELECT * FROM public.v_theme_scores_by_commune ORDER BY user_count DESC;

-- 4.4 — Scores par statut professionnel
SELECT * FROM public.v_theme_scores_by_employment ORDER BY user_count DESC;

-- 4.5 — "Les étudiants sont-ils plus pro-européens ?"
-- GLOBAL = thème ouverture internationale / Europe
SELECT
  ud.employment_status,
  COUNT(*)                                                       AS n,
  ROUND(AVG((up.theme_scores->>'GLOBAL')::numeric), 1)           AS avg_global,
  ROUND(AVG((up.theme_scores->>'ENVIRONMENT')::numeric), 1)      AS avg_environment,
  ROUND(AVG((up.theme_scores->>'ECONOMY')::numeric), 1)          AS avg_economy
FROM public.user_profiles up
JOIN public.user_demographics ud ON ud.user_id = up.user_id
WHERE ud.employment_status IS NOT NULL
GROUP BY ud.employment_status
ORDER BY avg_global DESC;
-- Hypothèse testée : etudiant aura avg_global le plus élevé.

-- 4.6 — "Les ruraux sont-ils plus souverainistes ?"
-- Souverainisme = GLOBAL bas (anti-Europe) + IMMIGRATION bas (restrictif) + SECURITY haut
SELECT
  ud.commune_type,
  COUNT(*)                                                       AS n,
  ROUND(AVG((up.theme_scores->>'GLOBAL')::numeric), 1)           AS avg_global,
  ROUND(AVG((up.theme_scores->>'IMMIGRATION')::numeric), 1)      AS avg_immigration,
  ROUND(AVG((up.theme_scores->>'SECURITY')::numeric), 1)         AS avg_security,
  -- Score composite "souverainisme" (inverse de GLOBAL + inverse de IMMIGRATION)
  ROUND(AVG(100 - (up.theme_scores->>'GLOBAL')::numeric
            + 100 - (up.theme_scores->>'IMMIGRATION')::numeric) / 2, 1) AS composite_souverainisme
FROM public.user_profiles up
JOIN public.user_demographics ud ON ud.user_id = up.user_id
WHERE ud.commune_type IS NOT NULL
GROUP BY ud.commune_type
ORDER BY composite_souverainisme DESC;
-- Hypothèse testée : rural aura composite_souverainisme le plus élevé.

-- 4.7 — "Les femmes sont-elles plus favorables au social ?"
-- Thème SOCIAL inclut : droits reproductifs, IVG, égalité H/F, LGBTQ+
SELECT
  ud.gender,
  COUNT(*)                                                       AS n,
  ROUND(AVG((up.theme_scores->>'SOCIAL')::numeric), 1)           AS avg_social,
  ROUND(AVG((up.theme_scores->>'ENVIRONMENT')::numeric), 1)      AS avg_environment,
  ROUND(AVG((up.theme_scores->>'IMMIGRATION')::numeric), 1)      AS avg_immigration,
  ROUND(AVG((up.axes->>'social')::numeric), 1)                   AS avg_social_axis
FROM public.user_profiles up
JOIN public.user_demographics ud ON ud.user_id = up.user_id
WHERE ud.gender IN ('homme', 'femme')
GROUP BY ud.gender;
-- Hypothèse testée : femme aura avg_social > homme.


-- ═══════════════════════════════════════════════════════════════════════════════
-- SECTION 5 — QUESTIONS INDIVIDUELLES
-- "Quelles questions divisent le plus les Français ?"
-- "Quelle question crée le plus d'écart entre hommes et femmes ?"
-- ═══════════════════════════════════════════════════════════════════════════════

-- 5.1 — Questions les plus polarisantes (écart-type le plus élevé)
-- Utilise v_question_controversy de schema_v3
SELECT * FROM public.v_question_controversy
ORDER BY std_dev DESC
LIMIT 20;

-- 5.2 — Questions les plus clivantes entre hommes et femmes
SELECT * FROM public.get_top_divisive_questions_between_groups(
  'gender',    -- type de groupe
  'homme',     -- groupe A
  'femme',     -- groupe B
  15           -- top N résultats
);
-- Résultat : "La question X divise le plus les sexes (delta = Y points)"

-- 5.3 — Questions les plus clivantes entre ruraux et grandes villes
SELECT * FROM public.get_top_divisive_questions_between_groups(
  'commune_type',
  'rural',
  'grande_ville',
  15
);

-- 5.4 — Questions les plus clivantes entre 18-24 et 65+
SELECT * FROM public.get_top_divisive_questions_between_groups(
  'age_range',
  '18-24',
  '65+',
  15
);

-- 5.5 — Distribution des réponses à une question spécifique par genre
-- Remplacer 'q_social_01' par l'ID de la question cible
SELECT * FROM public.v_question_by_gender WHERE question_id = 'q_social_01';

-- 5.6 — Distribution des réponses par tranche d'âge
SELECT * FROM public.v_question_by_age WHERE question_id = 'q_social_01';

-- 5.7 — Toutes les réponses à toutes les questions pour un thème par genre
-- (Vue complète pour l'IVG et le genre)
SELECT
  (e.props->>'question_id') AS question_id,
  ud.gender,
  COUNT(*) AS n,
  ROUND(AVG((e.props->>'value')::numeric), 2) AS mean_answer,
  ROUND(100.0 * SUM(CASE WHEN (e.props->>'value')::int >= 4 THEN 1 ELSE 0 END) / COUNT(*), 1) AS pct_agree
FROM public.events e
JOIN public.user_demographics ud ON ud.user_id = e.user_id
WHERE e.event_name = 'question_answered'
  AND e.props->>'theme' = 'SOCIAL'  -- changer par: ECONOMY, IMMIGRATION, SECURITY, etc.
  AND ud.gender IN ('homme', 'femme')
GROUP BY e.props->>'question_id', ud.gender
HAVING COUNT(*) >= 20
ORDER BY e.props->>'question_id', ud.gender;


-- ═══════════════════════════════════════════════════════════════════════════════
-- SECTION 6 — TENDANCES TEMPORELLES
-- "Y a-t-il un glissement idéologique depuis le lancement ?"
-- "Les opinions sur l'immigration évoluent-elles ?"
-- ═══════════════════════════════════════════════════════════════════════════════

-- 6.1 — Tendance mensuelle de tous les thèmes
SELECT * FROM public.v_theme_trend_monthly ORDER BY month;

-- 6.2 — Tendance hebdomadaire plus granulaire
SELECT
  date_trunc('week', up.created_at AT TIME ZONE 'Europe/Paris') AS week,
  COUNT(*) AS new_profiles,
  ROUND(AVG((up.theme_scores->>'IMMIGRATION')::numeric), 1)     AS avg_immigration,
  ROUND(AVG((up.theme_scores->>'ECONOMY')::numeric), 1)         AS avg_economy,
  ROUND(AVG((up.theme_scores->>'ENVIRONMENT')::numeric), 1)     AS avg_environment,
  ROUND(AVG((up.axes->>'economic')::numeric), 1)                AS avg_economic_axis,
  ROUND(AVG((up.axes->>'social')::numeric), 1)                  AS avg_social_axis
FROM public.user_profiles up
GROUP BY week
ORDER BY week;

-- 6.3 — Le candidat préféré change-t-il dans le temps ?
SELECT
  date_trunc('month', up.created_at AT TIME ZONE 'Europe/Paris') AS month,
  up.top_candidate_id,
  COUNT(*) AS n,
  ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (PARTITION BY date_trunc('month', up.created_at)), 1) AS pct_du_mois
FROM public.user_profiles up
WHERE top_candidate_id IS NOT NULL
GROUP BY month, up.top_candidate_id
ORDER BY month, n DESC;

-- 6.4 — Tendance des archétypes dans le temps
SELECT
  date_trunc('month', up.created_at AT TIME ZONE 'Europe/Paris') AS month,
  up.archetype_id,
  COUNT(*) AS n
FROM public.user_profiles up
WHERE archetype_id IS NOT NULL
GROUP BY month, up.archetype_id
ORDER BY month, n DESC;


-- ═══════════════════════════════════════════════════════════════════════════════
-- SECTION 7 — BOUSSOLE POLITIQUE
-- "La France de Poliscop est-elle plutôt à gauche ou à droite ?"
-- "Quel est le centre de gravité idéologique ?"
-- ═══════════════════════════════════════════════════════════════════════════════

-- 7.1 — Distribution en quadrants idéologiques
SELECT * FROM public.v_political_compass ORDER BY user_count DESC;
-- gauche_progressiste = économiquement gauche + socialement progressiste
-- droite_conservatrice = économiquement droite + socialement conservateur

-- 7.2 — Position médiane de l'utilisateur type sur les deux axes principaux
SELECT
  PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY (axes->>'economic')::numeric) AS median_economic,
  PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY (axes->>'social')::numeric)   AS median_social,
  AVG((axes->>'economic')::numeric) AS mean_economic,
  AVG((axes->>'social')::numeric)   AS mean_social,
  COUNT(*) AS n
FROM public.user_profiles
WHERE axes IS NOT NULL;

-- 7.3 — Carte de chaleur des positions politiques (déciles)
-- Utile pour visualiser la densité des positions idéologiques
WITH deciles AS (
  SELECT
    WIDTH_BUCKET((axes->>'economic')::numeric, 0, 100, 10) AS bucket_eco,
    WIDTH_BUCKET((axes->>'social')::numeric, 0, 100, 10)   AS bucket_soc,
    COUNT(*) AS n
  FROM public.user_profiles
  WHERE axes IS NOT NULL
    AND axes->>'economic' IS NOT NULL
    AND axes->>'social' IS NOT NULL
  GROUP BY bucket_eco, bucket_soc
)
SELECT
  bucket_eco * 10 - 5 AS economic_center,  -- Centre du bucket economic (0-100)
  bucket_soc * 10 - 5 AS social_center,    -- Centre du bucket social (0-100)
  n
FROM deciles
ORDER BY n DESC;


-- ═══════════════════════════════════════════════════════════════════════════════
-- SECTION 8 — FUNNEL ET RÉTENTION
-- "Combien d'utilisateurs finissent le quiz ?"
-- "À quelle question abandonnent-ils ?"
-- ═══════════════════════════════════════════════════════════════════════════════

-- 8.1 — Funnel complet
SELECT
  SUM(CASE WHEN event_name = 'landing_view' THEN 1 ELSE 0 END)       AS landing_views,
  SUM(CASE WHEN event_name = 'test_start' THEN 1 ELSE 0 END)          AS test_starts,
  SUM(CASE WHEN event_name = 'test_complete' THEN 1 ELSE 0 END)       AS test_completions,
  SUM(CASE WHEN event_name = 'profile_viewed' THEN 1 ELSE 0 END)      AS profile_views,
  SUM(CASE WHEN event_name = 'demographics_completed' THEN 1 ELSE 0 END) AS demographics_filled,
  SUM(CASE WHEN event_name = 'profile_shared' THEN 1 ELSE 0 END)      AS shares,
  -- Taux de complétion quiz
  ROUND(
    100.0 * SUM(CASE WHEN event_name = 'test_complete' THEN 1 ELSE 0 END)
    / NULLIF(SUM(CASE WHEN event_name = 'test_start' THEN 1 ELSE 0 END), 0), 1
  ) AS quiz_completion_rate,
  -- Taux de partage
  ROUND(
    100.0 * SUM(CASE WHEN event_name = 'profile_shared' THEN 1 ELSE 0 END)
    / NULLIF(SUM(CASE WHEN event_name = 'profile_viewed' THEN 1 ELSE 0 END), 0), 1
  ) AS share_rate
FROM public.events;

-- 8.2 — Taux de réponse par position de question
-- "Les gens abandonnent-ils à la question 10 ?"
SELECT
  (props->>'question_index')::int AS question_index,
  (props->>'theme')               AS theme,
  COUNT(*)                        AS n_answers
FROM public.events
WHERE event_name = 'question_answered'
  AND props->>'question_index' IS NOT NULL
GROUP BY question_index, theme
ORDER BY question_index;

-- 8.3 — Questions avec le plus de skips (friction maximale)
SELECT
  (props->>'question_id')   AS question_id,
  (props->>'theme')         AS theme,
  COUNT(*)                  AS skip_count
FROM public.events
WHERE event_name = 'question_skipped'
GROUP BY question_id, theme
ORDER BY skip_count DESC
LIMIT 20;

-- 8.4 — Virality : qui partage, et avec quel archétype ?
SELECT
  (props->>'archetype_id')            AS archetype_id,
  COUNT(*)                            AS share_count,
  (props->>'method')                  AS method
FROM public.events
WHERE event_name = 'profile_shared'
GROUP BY archetype_id, method
ORDER BY share_count DESC;


-- ═══════════════════════════════════════════════════════════════════════════════
-- SECTION 9 — DASHBOARD FONDATEUR (vue journalière rapide)
-- ═══════════════════════════════════════════════════════════════════════════════

-- 9.1 — Croissance des 30 derniers jours
SELECT
  date_trunc('day', created_at AT TIME ZONE 'Europe/Paris') AS day,
  COUNT(*) AS new_profiles
FROM public.user_profiles
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY day
ORDER BY day;

-- 9.2 — Tableau de bord résumé (une seule requête)
SELECT
  -- Profils
  (SELECT COUNT(*) FROM public.user_profiles)                              AS total_profiles,
  (SELECT COUNT(*) FROM public.user_profiles WHERE created_at >= NOW() - INTERVAL '7 days') AS profiles_last_7d,
  (SELECT COUNT(*) FROM public.user_profiles WHERE created_at >= NOW() - INTERVAL '1 day')  AS profiles_today,
  -- Démographies
  (SELECT COUNT(*) FROM public.user_demographics)                          AS total_demographics,
  ROUND(
    100.0 * (SELECT COUNT(*) FROM public.user_demographics)
    / NULLIF((SELECT COUNT(*) FROM public.user_profiles), 0), 1
  )                                                                        AS demographics_rate_pct,
  -- Candidat top
  (SELECT top_candidate_id FROM public.user_profiles
   WHERE top_candidate_id IS NOT NULL
   GROUP BY top_candidate_id ORDER BY COUNT(*) DESC LIMIT 1)              AS top_candidate,
  -- Archétype top
  (SELECT archetype_id FROM public.user_profiles
   WHERE archetype_id IS NOT NULL
   GROUP BY archetype_id ORDER BY COUNT(*) DESC LIMIT 1)                  AS top_archetype,
  -- Events totaux
  (SELECT COUNT(*) FROM public.events)                                     AS total_events,
  (SELECT COUNT(*) FROM public.events WHERE created_at >= NOW() - INTERVAL '1 day') AS events_today;

-- 9.3 — Top 5 candidats par nombre de matches
SELECT
  top_candidate_id,
  COUNT(*) AS n,
  ROUND(AVG(top_candidate_alignment), 1) AS avg_alignment
FROM public.user_profiles
WHERE top_candidate_id IS NOT NULL
GROUP BY top_candidate_id
ORDER BY n DESC
LIMIT 5;

-- 9.4 — Top 5 archétypes
SELECT
  archetype_id,
  COUNT(*) AS n,
  ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 1) AS pct
FROM public.user_profiles
WHERE archetype_id IS NOT NULL
GROUP BY archetype_id
ORDER BY n DESC
LIMIT 5;


-- ═══════════════════════════════════════════════════════════════════════════════
-- SECTION 10 — REQUÊTES PRÊTES POUR LA PRESSE
-- Phrases-clés adaptées à un article journalistique.
-- Remplacer les IDs de candidats par les vrais IDs de votre data.
-- ═══════════════════════════════════════════════════════════════════════════════

-- REQUÊTE A : "X% des utilisateurs de Poliscop sont compatibles avec [candidat]"
SELECT
  top_candidate_id AS candidat,
  pct_compatible_60 AS pct_compatible,
  total_users AS n_utilisateurs
FROM public.v_candidate_compatibility
ORDER BY pct_compatible_60 DESC;

-- REQUÊTE B : "Chez les 18-24 ans, le candidat le plus compatible est X (Y% de compatibilité)"
SELECT
  up.top_candidate_id,
  COUNT(*) AS n,
  ROUND(AVG(up.top_candidate_alignment), 1) AS alignement_moyen
FROM public.user_profiles up
JOIN public.user_demographics ud ON ud.user_id = up.user_id
WHERE ud.age_range = '18-24'
GROUP BY up.top_candidate_id
ORDER BY n DESC
LIMIT 3;

-- REQUÊTE C : "Les ruraux sont X points plus restrictifs sur l'immigration que les citadins"
SELECT
  commune_type,
  avg_immigration AS score_immigration,
  avg_global      AS score_global
FROM public.v_theme_scores_by_commune
WHERE commune_type IN ('grande_ville', 'rural')
ORDER BY avg_immigration;

-- REQUÊTE D : "Les femmes sont X points plus progressistes sur les questions de société"
SELECT
  gender,
  avg_social      AS score_social,
  avg_environment AS score_environnement,
  avg_economic_axis,
  avg_social_axis
FROM public.v_theme_scores_by_gender
WHERE gender IN ('homme', 'femme');

-- REQUÊTE E : "La question la plus clivante de France en 2026"
SELECT * FROM public.v_question_controversy LIMIT 5;

-- REQUÊTE F : "Évolution de l'opinion sur l'immigration depuis le lancement"
SELECT
  month,
  user_count,
  avg_immigration,
  avg_global
FROM public.v_theme_trend_monthly
ORDER BY month;

-- REQUÊTE G : "Le profil-type de l'électeur Poliscop"
SELECT
  -- Position idéologique médiane
  ROUND(PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY (axes->>'economic')::numeric), 1) AS median_economique,
  ROUND(PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY (axes->>'social')::numeric), 1)   AS median_social,
  -- Thème le plus fort
  (SELECT key FROM jsonb_each_text(theme_scores) ORDER BY value::numeric DESC LIMIT 1) AS theme_dominant,
  COUNT(*) AS n
FROM public.user_profiles
WHERE axes IS NOT NULL
GROUP BY theme_scores
ORDER BY n DESC
LIMIT 1;
