# 01 — Audit de l'architecture data existante (2026-07-11)

Périmètre : `supabase/schema.sql` → `schema_v5_privacy.sql`, `supabase/migrations/*`, `founder_queries.sql`, `insights_queries.sql`, et tout le code applicatif touchant aux données (`src/lib/auth.jsx`, `anonymous.js`, `analytics.js`, `useStore.js`, `OnboardingModal.jsx`, `FounderDashboard.jsx`).

## 1. Inventaire

### Tables (8)
| Table | Rôle | Clé | RLS | État réel |
|---|---|---|---|---|
| `profiles` | legacy (answers+scores jsonb) | user_id UNIQUE | own-row | Morte, à supprimer en v6 |
| `user_answers` | état courant 1 ligne/(user,question) | (user_id, question_id) UNIQUE | own-row ✓ | Câblée (auth.jsx) |
| `user_profiles` | snapshot profil calculé | user_id UNIQUE | own-row ✓ | Câblée ; +archetype/top_candidate/quiz_mode (v2/v4) |
| `user_demographics` | démographie déclarative | user_id UNIQUE | own-row ✓ | Câblée (OnboardingModal : gender, age_range, commune_type, employment_status, education_level, postal_code) |
| `user_consents` | consentement art. 9 | (user_id, type) UNIQUE | own-row ✓ | Câblée depuis 2026-07-11 — **mais voir F1** |
| `anonymous_sessions` | 1 ligne/visiteur | id=anonymous_id | insert/update open, pas de SELECT | Câblée (initAnonymousSession) |
| `anonymous_answers` | réponses invités | (anon_id, question) | v5 : plus de SELECT anon | **Plus aucun chemin d'écriture** depuis dc1cf04 — table en voie d'extinction (merge legacy en lecture seule) |
| `events` | god-table analytics | — | INSERT open uniquement | Câblée (24 track*) |
| `quiz_sessions` (v3) | 1 ligne/tentative de quiz | — | insert/update open | **Conçue, jamais câblée** (vérifié : aucun appel dans src/) |
| `question_analytics` (v3) | agrégats par question | question_id PK | SELECT public | Jamais alimentée (dépend d'un refresh manuel) |

### Vues (≈25) et vues matérialisées (2)
v2 : funnel quotidien/hebdo, distributions archétype/candidat, virality. v3 : controverse par question, tendances, dropout, dashboard hebdo, `mv_archetype_distribution`, `mv_candidate_distribution`. v4 : 16 cross-tabs (candidat/archétype/thème × genre/âge/commune/emploi), compass, `v_data_quality`. Toutes non exposées à l'anon (pas de GRANT), lisibles via service_role.

### Fonctions
- v3 : `refresh_analytics_views()`, `refresh_question_analytics()`, `get_archetype_distribution()`, `get_top_controversial_questions()` — SECURITY DEFINER, appelables anon.
- v4 : `get_candidate_compat_by_group()`, `get_top_divisive_questions_between_groups()` — SECURITY DEFINER.
- migration 2026-06-14 : 8+ `founder_get_*` — SECURITY DEFINER, **GRANT TO anon**.

### Migrations
Deux dossiers concurrents : les `schema_v*.sql` (à exécuter à la main, dans l'ordre) et `supabase/migrations/` (2 fichiers datés, écrits pour un projet **différent** : `gpvqsftyrninbwzhkaed`, alors que le projet lié actuel est `xjpzqaqzoygcwtcpumfo`, INACTIVE — vérifié par API le 2026-07-11). Aucune table de suivi des migrations appliquées. Personne ne peut dire aujourd'hui quel sous-ensemble a été appliqué où.

## 2. Failles et manques (par gravité)

### F1 — `user_consents` n'est pas un journal de preuve (CRITIQUE au sens RGPD)
Structure `UNIQUE (user_id, consent_type)` + code applicatif en **upsert** (`auth.jsx:158`) : chaque changement **écrase** l'état précédent. Retrait du consentement → la ligne passe à `granted=false` et la preuve que le consentement a existé (et quand, et sous quelle version de texte) disparaît. C'est l'inverse d'un « audit trail » (ce que le commentaire de schema_v3 prétend). L'art. 7.1 RGPD met la charge de la preuve du consentement sur le responsable de traitement — il faut un **ledger append-only** (une ligne par événement grant/withdraw, jamais d'UPDATE), avec une vue « état courant ».

### F2 — Les RPC `founder_get_*` sont publiques (CRITIQUE sécurité)
`GRANT EXECUTE … TO anon` sur toutes les fonctions du dashboard fondateur ; le PIN (`poliscop2027`, en clair dans le bundle) n'est qu'un décor côté client. N'importe qui peut appeler `founder_get_gender_scores()` etc. avec la clé anon publique. Aujourd'hui les agrégats sont pauvres (base vide) ; à 100 k utilisateurs, c'est un robinet public de croisements opinions×démographie **sans plancher de n**. À corriger : révoquer les GRANT anon, réserver au service_role derrière un vrai backend (Edge Function avec secret), ou à un rôle `founder` authentifié.

### F3 — Aucun plancher k-anonyme dans les agrégats (ÉLEVÉ)
`get_candidate_compat_by_group('lepen_2027','gender','non_binaire')` renverra un jour `total_users=2` avec leur alignement moyen. Les vues v4 n'ont pas de `HAVING COUNT(*) >= k` (sauf 2 vues events à ≥10/20). Le principe « aucun petit segment publié » n'existe nulle part dans le code. Doit devenir une contrainte de plateforme (fonction utilitaire unique qui applique le plancher), pas une discipline volontaire.

### F4 — Identité anonyme non prouvable (ÉLEVÉ, connu et documenté en v5)
`anonymous_id` = chaîne en localStorage ; RLS ne peut pas prouver la propriété (UPDATE/DELETE « best-effort »). La vraie solution existe chez Supabase : **`signInAnonymously()`** donne un `auth.uid()` vérifiable, transforme tous les invités en utilisateurs authentifiés anonymes, simplifie la fusion invité→compte (`linkIdentity`), et permet de mettre du RLS propre partout. C'est le choix structurant n°1 de l'architecture cible.

### F5 — Aucun versionnage (ÉLEVÉ — déjà relevé au contre-audit, CTR-008)
Ni version de question (ECO_13 a déjà changé de polarité, 26 reformulations), ni version de scoring (exposant, veto, poids ont tous changé en 2026), ni version du texte de consentement dans un journal fiable (cf. F1). `events.props` n'embarque rien non plus. Toute donnée collectée aujourd'hui deviendrait ininterprétable après la prochaine évolution.

### F6 — `events` god-table sans stratégie de volume (MOYEN)
Tout part dans `events(jsonb)` : à 1 M d'utilisateurs × ~100 événements, ~100 M de lignes non partitionnées, indexées par 6 index dont 3 d'expression JSONB. Les vues analytiques scannent la table entière. Il faut : partitionnement mensuel (declarative partitioning), séparation des **réponses** (données de premier ordre, structurées, typées) du **télémétrie produit** (events), et agrégats matérialisés rafraîchis par pg_cron.

### F7 — `quiz_sessions` conçue mais jamais câblée (MOYEN)
La table qui devait porter la qualité de session (durée, abandon, mode) existe depuis v3 et n'est écrite nulle part. Résultat : le funnel repose sur des events non joints, le dropout est approximé, aucune métrique de qualité (temps/question) n'est mesurable. À câbler en priorité dans l'architecture cible (c'est la clé de la qualité data, cf. doc 07).

### F8 — Réponses sans historique (MOYEN)
`user_answers` est un upsert : si l'utilisateur refait le test 6 mois plus tard, l'ancienne réponse est écrasée. Pour un produit dont une promesse est « suivre l'évolution de ses opinions », c'est la donnée la plus précieuse qui est jetée. L'architecture cible sépare : **journal de réponses append-only** (l'actif) + état courant (le cache produit).

### F9 — Conflits internes de policies (MOYEN)
`migrations/20260612` recrée `anonymous_sessions` en `FOR ALL USING(true)` (SELECT compris), ce qui **annule** la correction de schema_v2 §4 (pas de SELECT anon). Selon l'ordre d'exécution, la faille de lecture réapparaît. Illustre l'absence de chaîne de migrations unique et ordonnée.

### F10 — Divers (FAIBLE)
- `profiles` (legacy) morte mais toujours créée.
- `postal_code` brut stocké sans politique de purge effective (la note v2 le recommande, rien ne l'applique).
- `user_consents.ip_hash` : hasher l'IP ne la rend pas anonyme (question juridique ouverte : utilité réelle vs minimisation — trancher).
- Rétention : purges documentées en commentaire, jamais planifiées (pg_cron jamais activé).
- `events` n'a pas de policy SELECT du tout (bien), mais pas non plus de protection anti-flood (rate limiting inexistant, cf. doc 07).
- Fuseau : les vues utilisent `AT TIME ZONE 'Europe/Paris'` de façon incohérente (certaines oui, d'autres non).

## 3. Ce qui est bon et à conserver
- La séparation identité (auth.users) / opinions (user_answers, user_profiles) / démographie (user_demographics) est le bon découpage — l'architecture cible la garde et la durcit.
- Le catalogue de vues v4 est une excellente **spécification produit** des analyses voulues ; il sera regénéré au-dessus du nouveau modèle avec plancher k-anonyme.
- Le gating de consentement côté client (contre-audité le 2026-07-11 : irréprochable) reste valable ; la v6 ajoute la défense côté serveur qui manque.
- `question_analytics` (agrégats pré-calculés) est le bon pattern — il sera généralisé (mv + pg_cron).

## 4. Verdict
Le socle actuel est une **bonne v0 pensée par itérations successives**, mais il a trois défauts disqualifiants pour l'ambition « actif data » : la donnée de premier ordre (réponses) est écrasable et non versionnée, la preuve de consentement est écrasable, et l'accès agrégé n'a ni authentification réelle ni plancher statistique. L'architecture cible (doc 02 + `schema_v6_data_platform.sql`) repart des mêmes concepts en corrigeant ces trois axes, plutôt que d'empiler une v6 incrémentale sur des fondations à réparer.
