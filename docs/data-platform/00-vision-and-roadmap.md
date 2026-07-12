# Poliscop Data Platform — Vision et feuille de route

**Mission 2026-07-11.** Dossier complet : [01 audit de l'existant](01-current-state-audit.md) · [02 architecture cible](02-target-architecture.md) + [`schema_v6_data_platform.sql`](../../supabase/schema_v6_data_platform.sql) · [03 catalogue démographique](03-demographics-catalog.md) · [04 catalogue d'analyses](04-insights-catalog.md) · [05 dashboards](05-dashboards-spec.md) · [06 consentements & UX](06-rgpd-consent-ux.md) · [07 qualité & discipline scientifique](07-data-quality.md) · [08 valorisation](08-monetization.md).

## La thèse
L'actif de Poliscop n'est pas « des réponses sauvegardées », c'est un **panel longitudinal consenti d'opinions politiques multidimensionnelles, versionné et documenté** — une chose qu'aucun institut français ne possède en continu. Toute l'architecture découle de trois invariants :

1. **Une réponse est un fait immuable** (journal append-only, versions de question/scoring) — jamais un champ écrasé.
2. **Le consentement est une preuve** (ledger, garde serveur dans le RLS) — jamais une case en mémoire.
3. **Un agrégat sous le plancher n'existe pas** (k-anonymat structurel, provenance de chaque chiffre publié) — jamais une discipline volontaire.

Le reste — dashboards, études, revenus — sont des vues au-dessus de ces invariants.

## Ce que cette mission change à l'existant
L'audit (doc 01) a trouvé, au-delà des manques connus, **deux failles critiques nouvelles** : le registre de consentement actuel s'écrase à chaque changement (aucune preuve art. 7 conservée) et les RPC du dashboard fondateur sont appelables par n'importe qui avec la clé anon publique, sans plancher d'effectif. La v6 les corrige structurellement (ledger `consent_events`, `is_admin()` + planchers en base). Le projet Supabase lié étant INACTIVE et sans utilisateur réel, la recommandation est de **repartir sur un projet neuf avec `schema_v6` seul** plutôt que d'empiler v1→v5+correctifs.

## Feuille de route

### Phase 0 — Fondations (avant tout utilisateur réel ; ~1 semaine de travail)
1. Créer le projet Supabase neuf (région EU), activer pg_cron + auth anonyme ; appliquer `schema_v6_data_platform.sql` ; smoke-tests (le DDL n'a **pas** pu être exécuté pendant cette mission — aucun Postgres disponible localement ; c'est la première chose à faire).
2. Peupler les référentiels : `question_registry` (script `scripts/seed-question-registry.mjs`, livré), `scoring_configs` (version 2026.07 du moteur actuel), `consent_texts` (textes du doc 06 **après validation juridique**).
3. Câbler le client (ordre : signInAnonymously au consentement → consent_events → quiz_sessions + response_events → user_answers/profiles versionnés → FounderDashboard sur `admin_*` + login réel).
4. Planifier les 4 jobs pg_cron (partitions, purge, qualité, refresh mv).

### Phase 1 — Bêta privée (0 → 1 000 répondants)
Cockpit fondateur (dashboard A), moments de consentement 2-3 (doc 06), calibration des seuils qualité sur les vraies distributions, page méthodologie publique v1.

### Phase 2 — Bêta publique (1 000 → 20 000)
Dashboards B+C, moments 4-5 et variables Tier 2, Observatoire mensuel (première publication = premier `stats_release`), monitoring anti-brigading.

### Phase 3 — Machine à études (20 000+)
Explorateur de segments (dashboard D), redressement (≥10 k consentants recherche), partenariats médias/chercheurs (horizon 2 du doc 08).

### Trajectoire de charge
10 k users : tout tient trivialement. 100 k : les mv absorbent la lecture, les partitions absorbent l'écriture — tier Pro suffisant. 1 M : même modèle ; si l'analytique lourde déborde Postgres, export parquet quotidien vers DuckDB/BigQuery **sans changer le modèle de données** (prévu par la couche événementielle). L'architecture n'a pas de falaise cachée connue.

## Décisions qui vous appartiennent (rien d'autre ne bloque la Phase 0)

| # | Décision | Options | Recommandation (non décidée à votre place) |
|---|---|---|---|
| 1 | Projet neuf vs réactivation de l'ancien | neuf / réactiver+migrer | Neuf (aucune donnée réelle à sauver ; historique v1→v5 conservé en doc) |
| 2 | Mineurs | A : quiz libre, données 15+ (case) / B : 18+ / C : flux parental | A, avec validation DPO (doc 06 §5) |
| 3 | Textes de consentement | Textes proposés doc 06 §3 | À faire relire par un professionnel avant mise en ligne — non négociable |
| 4 | Seuils de publication | 30 interne / 200 publication (défauts v6) | Conserver ; ajustables dans `platform_config` |
| 5 | Données legacy de l'ancien projet | re-consentement / purge | Purge si projet neuf (option 1) — le point devient sans objet |
| 6 | Variables sensibles écartées (religion, vote passé) | maintenir l'exclusion / rouvrir avec AIPD | Maintenir l'exclusion (doc 03 Tier 4) |
| 7 | Observatoire gratuit vs payant | — | Gratuit (doc 08) |

## Définition du succès
La plateforme data est « prête » quand : une réponse donnée aujourd'hui sera interprétable dans 10 ans (versions) ; aucun chiffre ne peut sortir sous le plancher même par erreur (structurel) ; chaque chiffre publié a sa facture de provenance (`stats_releases`) ; l'utilisateur peut tout voir, tout exporter, tout supprimer en self-service ; et le fondateur répond à « que pensent les médecins de moins de 35 ans ? » en trois clics — avec le n affiché à côté.
