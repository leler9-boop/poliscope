# Poliscop — Cartographie du projet

## Stack et architecture générale

- **Framework** : React 18 + Vite 5, SPA. `react-router-dom` v7 (`BrowserRouter`) — **et non plus** une navigation Zustand pure comme le décrit `CLAUDE.md`. Un pont (`src/lib/router.js`) permet au store Zustand d'appeler `navigate()` sans hook, et le store conserve un champ `currentPage` en parallèle des routes URL (double représentation de l'état de navigation — voir risques).
- **État global** : Zustand (`src/store/useStore.js`, 411 lignes) avec `persist` middleware → `localStorage` (clé `poliscop_state`, migrée depuis une ancienne clé `poliscope_state`).
- **Style** : Tailwind CSS.
- **Backend optionnel** : Supabase (auth + sauvegarde cloud du profil + analytics events). L'app fonctionne intégralement en mode invité sans Supabase configuré.
- **Aucun test, aucun linter configuré** (confirmé — `package.json` ne déclare ni script `test` ni `lint`, aucune dépendance `vitest`/`jest`/`eslint`).
- **Point d'entrée** : `src/main.jsx` → `src/App.jsx` (158 lignes) : définit les 18 routes, les guards (`QuizGuard`, `ProfileGuard`), le chargement lazy des pages secondaires.

## Tableau de cartographie

| Élément | Fichier(s) | Fonction | Niveau de risque | Observations |
|---|---|---|---|---|
| Point d'entrée / routing | `src/main.jsx`, `src/App.jsx`, `src/lib/router.js` | Bootstrap, 18 routes, guards | Faible | **Divergence doc/code** : `CLAUDE.md` affirme « no router » — c'est faux depuis l'introduction de `react-router-dom` |
| Store global | `src/store/useStore.js` | État Zustand persisté ; orchestration quiz/profil/élections/comparaison | **Élevé** | Clé de voûte de toute la logique métier ; écritures Supabase fire-and-forget avec erreurs seulement `console.error` (jamais montrées à l'utilisateur au niveau de la réponse individuelle) |
| Questions — données brutes | `src/data/questions_final.json` (1839 lignes) | 180 questions avec `id`, `text`, `axis`, `weight`, `status` (CORE/SECONDARY), `cluster`, `explanation` | **Élevé** | **Source de vérité éditoriale.** Champ `explanation` = contenu pédagogique affiché à l'utilisateur, à auditer pour neutralité au même titre que la question |
| Questions — logique de filtre/file | `src/data/questions.js` (220 lignes) | Thèmes, exclusion des doublons (180→158 vives), `getQuestionQueue(mode, priorityOrder)`, `getQuiz()` | **Élevé** | Contient la logique de sélection par mode (16/32/64) — cœur de la Phase 2 et 4 |
| Documentation éditoriale (seed) | `knowledge-base/questions.md`, `questions_master.md`, `questions_info_raw.md` | Matériel de référence / brouillon historique | Moyen | **Risque de divergence confirmé** : non importés par le runtime (`grep` négatif dans `src/`), échantillon de `questions.md` déjà en décalage de style avec `questions_final.json` (voir 02) |
| Personnalités (seed) | `knowledge-base/personnalites.md` | 12 figures FR, résumé narratif court | Moyen | Ne mentionne ni Bardella ni la condamnation de Le Pen ni la succession de Premiers ministres après Attal → **périmé par rapport à `frenchFigures.js`**, à traiter comme doc de contexte, pas comme donnée vivante |
| Glossaire / concepts | `knowledge-base/definitions.md`, `concepts.md`, `vision.md` | Contexte pédagogique, mission produit | Faible | Utile pour juger l'intention éditoriale déclarée (neutralité, focus France) — sert de référentiel pour la Phase 8 |
| Moteur de scoring | `src/engine/scorer.js` (178 lignes) | `calculateProfile()` : 8 scores thématiques pondérés + `stretchScore()` (transformation non-linéaire, puissance 0.75) + 4 axes dérivés + confiance | **Critique** | `stretchScore()` n'est documenté nulle part côté utilisateur (pas dans `Transparency.jsx` à vérifier) ; seuils de confiance recalibrés sur 64 questions |
| Moteur de matching | `src/engine/matcher.js` (176 lignes) | `calculateAlignment()` : distance pondérée par priorité, exposant **2.4** (memory précédente indiquait 2.8 — **périmée**), puis **veto multiplicatif** sur 5 thèmes (seuils/pénalités différenciés) | **Critique** | Système de veto complexe (5 thèmes, seuils 30/30/42/42/42, pénalités 0.62–0.82) sans justification écrite du choix de ces 5 thèmes ni de ces valeurs — cœur de la Phase 5/6 |
| Archétypes | `src/engine/archetypeEngine.js` (49 lignes), `src/data/archetypes.js` (375 lignes, 18 archétypes) | Réutilise `rankByAlignment()` de `matcher.js` | Faible | Bonne pratique — pas de duplication de la logique de distance |
| Résumé textuel | `src/engine/profileSummary.js` (160 lignes) | Génération déterministe (pas d'IA) d'un résumé 3-4 phrases | Moyen | Asymétrie de seuils repérée : `DEMOCRACY` haut = 76 vs `DEMOCRACY_LOW` = 62, alors que tous les autres couples (ENVIRONMENT, SECURITY, GLOBAL) sont symétriques à 72/72 — à faire confirmer/justifier par l'agent scoring |
| Figures politiques françaises | `src/data/frenchFigures.js` (1613 lignes) | 28 figures « actives 2021–2026 » (auto-déclaré), profils 8 thèmes, timeline, `key_facts` | **Critique** | Contient déjà la mention de la condamnation de Le Pen et de Bardella — fraîcheur à vérifier en priorité (voir §Risques) |
| Figures historiques | `src/data/historicalFigures.js` (1719 lignes) | 40 figures, profils 8 thèmes, champ `disclaimer` (ex. internement des Japonais-Américains sous FDR) | Moyen | Bonne pratique de transparence (disclaimer) repérée sur au moins 1 entrée — vérifier la cohérence sur les 40 |
| Élections & positions candidats | `src/data/elections.js` (2133 lignes) | 9 élections (`fr_2022`, `fr_2027`, `paris_2026`, `de_2025`, `es_2023`, `eu_2024`, `it_2022`, `uk_2024`, `us_2020`), contexte narratif bilingue, `specificQuestions.positions` par candidat | **Critique** | Contient littéralement : *« Marine Le Pen… appeal verdict: July 7, 2026 »* — **3 jours avant la date d'audit**, et un avertissement interne *« Candidacy statuses as of June 2026 »* déjà daté d'un mois. `paris_2026` (municipales, scrutin prévu mars 2026) est probablement une élection **déjà passée** à la date d'audit — à vérifier si elle est présentée comme en cours |
| Détails candidats étendus | `src/data/candidateDetails.js` (515 lignes) | Timeline + positions longues, gestion de variantes d'ID (`lepen_2027`, `melenchon_2027`, `hidalgo_paris` avec repli sur la clé de base) | Élevé | Cohérence base/variante à vérifier (Phase 6.2 — un candidat et sa variante ne doivent pas diverger sans explication) |
| Contexte politique par candidat | `src/data/candidatePolicies.js` (827 lignes) | Texte affiché quand l'utilisateur est proche d'un candidat (diff < 28) ; limité à `POLICY_ELECTION_IDS = {fr_2022, fr_2027, paris_2026, us_2020}` | Moyen | Asymétrie de profondeur documentaire : les élections `de_2025`, `es_2023`, `eu_2024`, `it_2022`, `uk_2024` n'ont pas ce niveau de détail — biais de données potentiel (Phase 8) |
| Courants idéologiques | `src/data/ideologicalCurrents.js` (450 lignes) | 12 courants, `tier: primary/secondary` | Moyen | Cohérent avec la mémoire de session précédente ; à revérifier pour drift |
| Thèmes d'affinement | `src/data/refinementThemes.js` (384 lignes) | Données UI pour l'ajustement manuel du profil | Faible | — |
| i18n | `src/i18n/translations.js` (362 lignes) | Chaînes FR/EN | Faible/Moyen | Couverture bilingue à spot-checker (risque de chaînes manquantes en anglais) |
| Auth / Supabase | `src/lib/auth.jsx`, `src/lib/supabase.js` | Auth, sauvegarde cloud du profil (dégradation gracieuse si non configuré) | **Critique (RGPD)** | **Confirmé par grep** : aucune capture de consentement RGPD Art. 9 dans `auth.jsx`/`OnboardingModal.jsx`/`FounderDashboard.jsx`, alors que `theme_scores` (opinions politiques) est lié à `auth.users` — risque déjà identifié en interne le 2026-06-14 et **toujours non corrigé** |
| Analytics | `src/lib/analytics.js`, `src/lib/anonymous.js` | Événements produit (24 événements) | Faible | Déjà auto-audité en détail dans `INTELLIGENCE_AUDIT*.md` — non dupliqué ici |
| Schémas Supabase | `supabase/schema.sql`, `schema_v2.sql`, `schema_v3.sql`, `schema_v4.sql`, `migrations/*.sql` | Définition des tables/vues/RLS | Élevé | **4 versions de schéma coexistent** ; `DEPLOYMENT.md` ne connaît que `schema.sql` (périmé) ; projet Supabase signalé « INACTIVE » au 2026-06-14, statut actuel non re-vérifié dans cette session |
| Documentation racine | `CLAUDE.md`, `DEPLOYMENT.md` | Guidance projet | Élevé (gouvernance) | **Toutes deux périmées** sur plusieurs points structurels (routing, nombre de questions ~120 vs 158 réelles, absence des modes 16/32/64, absence de `frenchFigures.js`/`candidatePolicies.js`/`archetypes.js` dans l'architecture décrite) |
| Audits internes existants | `supabase/INTELLIGENCE_AUDIT.md`, `INTELLIGENCE_AUDIT_V2.md` (2026-06-14) | Audit data/analytics/RGPD déjà réalisé | Info | Cité comme source, non dupliqué ; sert à vérifier si les correctifs recommandés ont été appliqués (Phase 11) |
| Pages résultat/méthodologie | `src/pages/Profile.jsx`, `Transparency.jsx`, `Beginner.jsx`, `Mission.jsx` | Affichage du résultat, page méthodologie publique, contenu pédagogique | Élevé | Support direct de la Phase 10 (explicabilité) — à lire directement par le coordinateur |
| Dépôt imbriqué hors périmètre | `notebooklm-py/` (`.git` propre) | Client Python NotebookLM, sans rapport avec Poliscop | Faible (hygiène) | Exclu de l'audit ; probable ajout accidentel au repo |
| Artefacts égarés | `./assets/*.js`/`*.css` (racine), `vite.config.js.timestamp-*.mjs` (×7) | Build output / fichiers temporaires Vite | Faible (hygiène) | Ne devraient pas être versionnés — correctif trivial à lister en fin de plan de remédiation |

## Sources de vérité identifiées

| Domaine | Source de vérité runtime | Matériel non-runtime (référence/historique) |
|---|---|---|
| Questions | `src/data/questions_final.json` + filtre `questions.js` | `knowledge-base/questions*.md` |
| Personnalités françaises | `src/data/frenchFigures.js` | `knowledge-base/personnalites.md` |
| Figures historiques | `src/data/historicalFigures.js` | — |
| Candidats/élections | `src/data/elections.js` (profils + `specificQuestions.positions`), enrichi par `candidateDetails.js` et `candidatePolicies.js` | — |
| Scoring | `src/engine/scorer.js` | `MEMORY.md` de session (partiellement périmée — coefficients à corriger en fin d'audit) |
| Matching | `src/engine/matcher.js` | idem |
| Infrastructure données | `supabase/schema_v3.sql` (le plus récent et complet selon `INTELLIGENCE_AUDIT_V2.md`) | `schema.sql`/`schema_v2.sql`/`schema_v4.sql`, `DEPLOYMENT.md` |

## Risques majeurs déjà identifiés (à confirmer/approfondir dans les phases suivantes)

1. **[CRITIQUE — Phase 7]** Donnée électorale à date de péremption connue et déjà dépassée : verdict d'appel Le Pen attendu le 7 juillet 2026, audit exécuté le 10 juillet 2026. Impact direct sur le statut affiché de deux candidats majeurs (Le Pen, Bardella) pour `fr_2027`.
2. **[CRITIQUE — Phase 11]** Absence confirmée de consentement RGPD Art. 9 pour le traitement d'opinions politiques de personnes identifiées, malgré une alerte interne documentée un mois plus tôt.
3. **[ÉLEVÉ — Phase 5/6]** Système de veto multiplicatif dans `matcher.js` : 5 seuils/pénalités différents sans documentation du raisonnement ; risque de double pénalisation non intentionnelle pour les profils extrêmes sur plusieurs axes simultanément.
4. **[ÉLEVÉ — gouvernance]** Documentation projet (`CLAUDE.md`, `DEPLOYMENT.md`) substantiellement périmée — risque que de futures sessions (humaines ou IA) se fient à une architecture obsolète.
5. **[MOYEN — Phase 8]** Profondeur documentaire inégale entre élections (`candidatePolicies.js` ne couvre que 4 des 9 élections) — biais de données potentiel entre candidats bien et peu documentés.
6. **[MOYEN — Phase 1]** Multiplicité de schémas Supabase (4 versions) sans document indiquant clairement lequel est déployé en production.

## Prochaine étape

Lancement des subagents 1 et 2 (code/architecture, scoring/matching) en parallèle, conformément au plan.
