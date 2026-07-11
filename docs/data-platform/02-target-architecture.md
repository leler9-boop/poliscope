# 02 — Architecture data cible (« v6 »)

Le DDL complet, commenté et exécutable est dans [`supabase/schema_v6_data_platform.sql`](../../supabase/schema_v6_data_platform.sql). Ce document explique les décisions.

## Principe directeur

> Une réponse à une question politique n'est pas un champ à mettre à jour : c'est un **fait daté, versionné, irréversible**. Tout le reste (profil, scores, matchs) est un **calcul reconstructible**.

L'architecture sépare donc quatre couches :

```
RÉFÉRENTIELS (versionnés, append-only)     ÉVÉNEMENTS (append-only, l'actif)
  question_registry                           response_events   ← le joyau
  scoring_configs                             consent_events    ← la preuve
  consent_texts                               app_events        ← la télémétrie (partitionnée)

ÉTAT COURANT (caches reconstructibles)     ANALYTIQUE (dérivé, k-anonyme)
  user_answers (état présent)                 mv_* (agrégats matérialisés, pg_cron)
  user_profiles (+ versions)                  stats_releases (provenance des chiffres publiés)
  user_demographics                           fonctions d'accès à plancher n minimal
  quiz_sessions (qualité)
```

## Les 8 décisions structurantes

### D1 — Identité : `signInAnonymously()` remplace l'anonymous_id maison
**Problème réglé** : F4 (RLS non prouvable, policies « best-effort »), fusion invité→compte fragile.
**Choix** : dès qu'un visiteur **consent** à une écriture serveur (sauvegarde ou contribution recherche), l'app crée une session Supabase anonyme → un `auth.uid()` réel et vérifiable. Créer un compte = attacher un email à ce même uid (`updateUser`) : **aucune fusion de données nécessaire, jamais** — l'uid ne change pas. Le mode local-par-défaut est inchangé : zéro appel réseau avant consentement.
**Conséquences** : toutes les policies deviennent `auth.uid() = user_id`, y compris pour les « invités » ; `anonymous_sessions`/`anonymous_answers` disparaissent du chemin d'écriture (conservées en lecture le temps de la migration legacy). Coût : les sessions anonymes comptent dans le MAU Supabase — acceptable, elles n'existent qu'après consentement.

### D2 — `response_events` : le journal de réponses est l'actif, `user_answers` n'est qu'un cache
Chaque réponse (et chaque **skip**, et chaque **révision** d'une réponse antérieure) est une ligne immuable : `(user_id, session_id, question_id, question_version, value|null, seq, response_ms, created_at)`. On ne perd plus jamais : l'évolution d'opinion d'un même utilisateur entre deux passages (la promesse produit « suivre l'évolution »), le temps de réponse (qualité, cf. doc 07), l'ordre de présentation (effets d'ordre analysables), la version exacte du texte auquel il a répondu.
`user_answers` reste pour le produit (dernier état, upsert) mais devient officiellement reconstructible : `SELECT DISTINCT ON (question_id) … ORDER BY created_at DESC`.

### D3 — Versionnage total (règle : « interprétable dans 10 ans »)
- `question_registry` : une ligne par **version** de chaque question (texte, direction, statut, thème, hash). ECO_13 v1 (direction 1) et ECO_13 v2 (direction −1) y coexistent. Peuplée depuis `questions_final.json` par le script `scripts/seed-question-registry.mjs` (à créer) et re-poussée à chaque commit éditorial.
- `scoring_configs` : jsonb complet de la config moteur (exposant, vetos, STATUS_WEIGHTS, stretch) + version sémantique. Le profil stocké référence `scoring_version` ; tout score historique est recalculable.
- `consent_texts` : chaque version du wording de chaque finalité. `consent_events.text_version` y pointe.
- `quiz_sessions.questionnaire_version` : hash du corpus actif au moment de la session.

### D4 — Consentement : ledger append-only, par finalité
**Problème réglé** : F1 (upsert écrasant = pas de preuve art. 7).
`consent_events(user_id, purpose, action grant|withdraw, text_version, created_at)` — INSERT only, aucune policy UPDATE/DELETE, même pour l'utilisateur (le retrait est un nouvel événement, pas une rature). Vue `v_consent_current` (DISTINCT ON) pour l'état courant, et fonction `has_consent(uid, purpose)` utilisée par **toutes** les policies d'écriture sensibles — le gating passe du client (contournable) au serveur (structurel) : `WITH CHECK (public.has_consent(auth.uid(), 'cloud_save'))` sur `response_events`, `user_answers`, `user_profiles` ; `'demographics'` sur `user_demographics`.
Finalités (extensibles) : `cloud_save` (sauvegarde de mes réponses), `research` (contribution aux statistiques agrégées), `demographics` (questionnaire socio-démographique), plus tard `marketing`. **Une case par finalité, jamais de couplage** (cf. doc 06).

### D5 — Plancher k-anonyme structurel
**Problème réglé** : F2/F3. Table `platform_config(min_cell_size default 30, min_publish_size 200)`. Toute fonction d'agrégat exposée passe par le même pattern : `HAVING COUNT(*) >= (SELECT min_cell_size …)`, et les lignes sous le plancher sont **absentes** (pas « masquées »). Les vues internes brutes ne reçoivent **aucun** GRANT. Plus personne n'a à « penser à » appliquer le seuil.

### D6 — Accès fondateur authentifié
**Problème réglé** : F2 (RPC publiques + PIN client).
`admin_users(user_id)` + fonction `is_admin()`. Toutes les `founder_get_*` sont recréées avec `REVOKE … FROM anon` et un garde `IF NOT public.is_admin() THEN RAISE`. Le dashboard fondateur se connecte avec un vrai compte (email du fondateur) — le PIN disparaît. Aucune infrastructure supplémentaire nécessaire.

### D7 — Volume : partitionnement + agrégats programmés
`app_events` (télémétrie) : partitionnée **par mois** (declarative), index BRIN sur `created_at`, création de partitions + purge de rétention (24 mois) via **pg_cron**. `response_events` : partitionnée aussi (même mécanique — à 1 M d'utilisateurs × 64 réponses ≈ 64 M lignes, un seul index composite `(question_id, created_at)` + `(user_id, created_at)`). Les dashboards ne lisent jamais les tables brutes : uniquement `mv_*` rafraîchies par pg_cron (horaire pour le cockpit, quotidien pour les études). Ordres de grandeur : à 100 k users c'est confortable sur le tier Supabase Pro ; à 1 M, la même structure tient en lecture (les mv absorbent tout), et si l'analytique lourde devient pénible, l'étape suivante est un export parquet quotidien vers DuckDB/BigQuery — **sans changer le modèle**, c'est prévu par la couche événementielle.

### D8 — Provenance des publications
`stats_releases(id, title, query_text, result jsonb, n_total, questionnaire_version, scoring_version, released_at, released_by)` : chaque chiffre publié (article, tweet, baromètre) est enregistré avec sa requête exacte et les versions des référentiels. C'est la traçabilité qui protège la réputation en cas de contestation publique — et le socle du « registre des analyses » exigé par le doc 09 du contre-audit.

## Ce que devient l'existant

| Existant | Devenir |
|---|---|
| `profiles` (legacy) | DROP (jamais utilisée par le code actuel) |
| `anonymous_sessions` / `anonymous_answers` | Gelées (plus d'écriture), lues une dernière fois pour la fusion legacy, puis DROP après période de grâce |
| `user_answers`, `user_profiles`, `user_demographics` | Conservées (état courant), colonnes de version ajoutées, policies durcies par `has_consent()` |
| `user_consents` | Remplacée par `consent_events` (migration : 1 upsert → 1 événement rétroactif) |
| `events` | Remplacée par `app_events` partitionnée ; `events` gelée puis migrée |
| `quiz_sessions` (jamais câblée) | Recréée en v2 (versions + timing + qualité) et **câblée** (travail client listé en roadmap) |
| Vues v2–v4 | Regénérées au-dessus du nouveau modèle, avec plancher k-anonyme (le catalogue v4 sert de spec) |
| `founder_get_*` | Recréées derrière `is_admin()` |

## Chemin de migration (aucune donnée réelle en production → fenêtre idéale)
Le projet Supabase lié est INACTIVE et aucun utilisateur réel n'existe : **c'est maintenant ou jamais pour repartir propre**. Recommandation : créer un projet neuf, appliquer `schema_v6_data_platform.sql` seul (il est autonome, il n'a pas besoin de v1→v5), et réserver la séquence v1→v5 au seul cas où l'on déciderait de réactiver l'ancien projet avec ses données de test. Une table `schema_migrations` intégrée à v6 met fin au flou « qu'est-ce qui a été appliqué où ».

## Travail client associé (roadmap, non fait ici)
1. `supabase.auth.signInAnonymously()` au moment du consentement ; suppression d'`anonymous_id` maison.
2. Écriture de `response_events` à chaque réponse (avec `response_ms`, `seq`, `question_version`) + `quiz_sessions` début/fin.
3. `consent_events` à la place de l'upsert `user_consents`.
4. `scripts/seed-question-registry.mjs` + hook dans le process éditorial (le lint existant peut vérifier que tout ID actif a une entrée registry à jour).
5. FounderDashboard : login réel + suppression du PIN.
