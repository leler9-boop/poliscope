# Poliscop — Plan d'audit intégral

**Date d'exécution de l'audit :** 2026-07-10
**Périmètre :** application Poliscop (React + Vite SPA), questionnaire, moteur de scoring, moteur de matching, données politiques (candidats, partis, personnalités, courants, élections), infrastructure de données utilisateur.
**Hors périmètre (signalé mais non audité) :** `notebooklm-py/` (dépôt git imbriqué, outil Python sans rapport avec Poliscop), `./assets/*` à la racine (artefacts de build égarés), fichiers `vite.config.js.timestamp-*.mjs`.

## 1. Constat de départ

La cartographie rapide (Phase 1) montre une application **beaucoup plus avancée et évoluée** que ne le laissent penser `CLAUDE.md` et `DEPLOYMENT.md` : 27 commits récents couvrant des refontes majeures du scoring (exposant 2.8→2.4, système de veto multiplicatif), une restructuration des modes de quiz (16/32/64 questions), l'ajout de dizaines de figures politiques et candidats 2027, et deux audits internes déjà réalisés le 2026-06-14 sur l'infrastructure de données (`supabase/INTELLIGENCE_AUDIT.md`, `INTELLIGENCE_AUDIT_V2.md`).

Deux constats structurent tout le reste du plan :

1. **La documentation du projet est significativement périmée.** `CLAUDE.md` (source d'instructions pour Claude Code) et `DEPLOYMENT.md` décrivent une architecture antérieure (pas de router, 120 questions, 40 figures, pas de modes 16/32/64). Voir [01-project-map.md](01-project-map.md) pour le détail. Ceci est traité comme un risque de gouvernance (Phase 11) plutôt que comme une erreur de contenu politique.
2. **Une donnée électorale critique et datée a été repérée dès la cartographie** : `src/data/elections.js` affiche « Marine Le Pen… appeal verdict: July 7, 2026 » — soit **3 jours avant la date d'exécution de cet audit**. C'est exactement le type de fait à durée de vie courte que la Phase 7 doit vérifier en priorité absolue, avec une source primaire, avant toute autre recherche externe.

## 2. Hypothèses prudentes posées à ce stade (à documenter, ne bloquent pas la mission)

- Le statut du projet Supabase (signalé « INACTIVE, paused >90 days » dans `INTELLIGENCE_AUDIT_V2.md` du 2026-06-14) n'est **pas re-vérifié en direct** (pas d'accès MCP Supabase autorisé dans cette session) ; le `.env` local contient des valeurs non vides pour `VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY`, mais on ne sait pas si elles pointent vers un projet actif ou l'ancien projet suspendu. Traité comme risque Élevé documenté, pas comme fait confirmé.
- L'absence de table `user_consents` / de case de consentement RGPD a été **confirmée par grep** (aucune occurrence de « consent » dans `auth.jsx`, `OnboardingModal.jsx`, `FounderDashboard.jsx`) — traité comme fait à confiance **high**, pas une hypothèse.
- Les fichiers `knowledge-base/*.md` sont traités comme **matériel de référence/seed**, pas comme source de vérité runtime (aucun import depuis `src/`), sauf preuve contraire. `src/data/questions_final.json` + `src/data/questions.js` sont la source de vérité pour les questions réellement servies.
- Les deux fichiers `supabase/INTELLIGENCE_AUDIT.md` et `INTELLIGENCE_AUDIT_V2.md` couvrent déjà en détail l'infrastructure analytics/RGPD ; cet audit **ne duplique pas** ce travail et se contente de le citer et de vérifier si les correctifs qu'ils recommandaient ont été appliqués.

## 3. Méthodologie — déroulement des 11 phases

1. Cartographie (fait — voir [01-project-map.md](01-project-map.md))
2. Audit fonctionnel du parcours complet (flux réponses → profil → matching, non-perte, non-double-comptage, reproductibilité) — Subagent 1
3. Audit éditorial des 158 questions vives (`questions_final.json` filtré) — Subagent 4
4. Couverture idéologique et thématique — Subagent 4
5. Audit mathématique du scoring (`scorer.js`, `stretchScore`, axes) — Subagent 2
6. Audit du matchmaking (`matcher.js`, veto multiplicatif, archétypes, tests synthétiques et contradictoires) — Subagent 2
7. Audit factuel et politique actuel (recherche externe, sources officielles prioritaires) — Subagent 3
8. Biais et neutralité (éditorial, mathématique, données, présentation) — synthèse croisée des 4 subagents, par le coordinateur
9. Tests automatisés et adversariaux — Subagent 4 (questions/biais) + Subagent 2 (propriétés du scoring), matérialisés par le coordinateur
10. Audit de l'expérience de résultat — coordinateur (lecture directe de `Profile.jsx`, `Transparency.jsx`, `Beginner.jsx`)
11. Sécurité, intégrité et gouvernance des données — coordinateur (s'appuie sur les audits internes existants + vérifications ciblées)

## 4. Gestion des subagents (limite stricte respectée)

Maximum 4 subagents sur toute la mission, maximum 2 en parallèle, aucun sous-subagent, aucune duplication de lecture. Rôles :

| # | Rôle | Fichiers assignés | Ne doit PAS analyser |
|---|---|---|---|
| 1 | `code-and-architecture-auditor` | `useStore.js`, `Questionnaire.jsx`, `SelectTest.jsx`, `PriorityRanking.jsx`, `anonymous.js`, `auth.jsx`, `SyncConflictModal.jsx`, `QuestionCard.jsx` (App.jsx/router.js déjà lus par le coordinateur) | contenu politique, exactitude mathématique du scoring, qualité éditoriale des questions, recherche externe |
| 2 | `scoring-and-matchmaking-auditor` | `scorer.js`, `matcher.js`, `archetypeEngine.js`, `profileSummary.js`, `archetypes.js`, `ideologicalCurrents.js`, `refinementThemes.js` + échantillonnage ciblé des blocs `profile:` dans `elections.js`/`frenchFigures.js`/`historicalFigures.js` | exactitude factuelle des positions politiques, wording des questions, recherche externe |
| 3 | `political-content-and-factuality-auditor` | `elections.js`, `frenchFigures.js`, `historicalFigures.js`, `candidateDetails.js`, `candidatePolicies.js` + recherche web (sources officielles prioritaires) | mathématiques du scoring, architecture technique, wording des questions |
| 4 | `qa-and-adversarial-testing-auditor` | `questions_final.json`, `questions.js`, `knowledge-base/questions*.md` (comparaison) | exactitude factuelle politique, ré-audit des mathématiques de `matcher.js` (peut citer les résultats de l'agent 2) |

Pairage : (1+2) en parallèle d'abord, puis (3+4) en parallèle. Chaque agent reçoit une mission écrite précise (fichiers, questions à répondre, exclusions, limite de travail) avant lancement, conformément à la consigne.

## 5. Contrôle des coûts appliqué

- Les gros fichiers de données (`elections.js` 2133 lignes, `historicalFigures.js` 1719, `frenchFigures.js` 1613, `questions_final.json` 1839, `candidatePolicies.js` 827) n'ont **pas** été lus intégralement par le coordinateur — seule leur structure (têtes de fichier, `grep` ciblés) a été inspectée. Leur lecture complète est déléguée aux subagents concernés, une seule fois chacun.
- `notebooklm-py/` (dépôt imbriqué) et les artefacts de build égarés sont exclus de toute analyse.
- La recherche externe (Phase 7) est concentrée sur les faits à forte volatilité (statut de candidature, condamnations, fonctions actuelles) plutôt que sur une revalidation exhaustive de chaque phrase.
- Les correctifs triviaux et sans risque (fichiers `.timestamp-*.mjs` à ignorer, incohérences de documentation) sont **listés**, pas appliqués, et regroupés dans le plan de remédiation plutôt que traités un par un.

## 6. Livrables

Voir la liste complète dans la consigne de mission. Statut : ce document et [01-project-map.md](01-project-map.md) sont livrés en premier ; le reste suit l'ordre des phases ci-dessus et sera ajouté au fur et à mesure dans ce même dossier, avec mise à jour de `progress.md` après chaque étape majeure.
