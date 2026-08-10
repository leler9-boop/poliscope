# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:5173)
npm run dev

# Production build (outputs to dist/)
npm run build

# Preview production build locally
npm run preview

# Tests (node:test — aucune dépendance externe)
npm test                  # tous les tests (117)
npm run test:unit         # moteurs (scorer, matcher, queue)
npm run test:data         # intégrité des données + terminologie affichée — BLOQUANT
npm run test:integration  # parcours de session : reprise, import, consentements, cloud
npm run test:lib          # moteurs client de collecte (chronométrage, file, consentement, protocole)
npm run test:migrations   # migrations Supabase sur un Postgres jetable (nécessite psql)
                          # exécute aussi supabase/tests/data_platform.test.sql (23 tests)

# Contrôles
npm run lint          # conventions de profils + marque + contenu Learn
npm run verify        # lint + test + build

# Informatifs, non bloquants
npm run check:freshness   # faits datés à revérifier
npm run check:questions   # lint éditorial de la banque de questions
```

CI : `.github/workflows/ci.yml` exécute lint + tests + build + un contrôle « aucun secret dans
`dist/` » sur chaque PR.

⚠️ **`npm test` est le garde-fou contre le bug de la famille « Le Pen 0/17 »** (identifiants de
candidats désalignés avec les clés de `specificQuestions[].positions`). Ne jamais le contourner
après avoir touché à `src/data/elections.js` ou `src/data/candidateRegistry.js`.

## Environment

Copy `.env.example` to `.env.local` for local development. Supabase env vars are optional — the app runs fully in guest mode without them:

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

## Architecture

Poliscop is a React + Vite SPA with no router — navigation is managed entirely through a Zustand store (`currentPage` field). All state is persisted to `localStorage` via the `persist` middleware.

### Navigation model

`App.jsx` renders a `pages` object keyed by page name and displays `pages[currentPage]`. To navigate, call `useStore(s => s.navigate)('pageName')`. Page keys: `landing`, `selectTest`, `priorities`, `questionnaire`, `profile`, `elections`, `figures`, `auth`.

### Data flow for a quiz session

1. User selects test length in `SelectTest` → store calls `startTest(mode)`
2. `getQuestionQueue(mode, priorityOrder)` from `src/data/questions.js` returns an ordered subset of questions filtered by `priority` field (1=quick, 2=medium, 3=full)
3. `Questionnaire.jsx` iterates through `questionsQueue`, calling `answerQuestion(id, value)` on each answer (Likert 1–5)
4. After each answer, `calculateProfile(answers)` in `src/engine/scorer.js` recomputes the profile immediately
5. On completion, store navigates to `profile` page

### Scoring engine (`src/engine/scorer.js`)

- Questions have a `direction` field (1 or -1): `direction=1` means higher agreement shifts the theme score up; `-1` means it shifts down
- **v1 (actif par défaut)** : `calculateProfile()` — un thème sans réponse vaut 50, étirement
  non linéaire (puissance 0,75) autour du centre. Figé par des tests de caractérisation.
- **v2 (implémenté, PAS branché)** : `calculateProfileV2()` — un thème sans réponse vaut `null`,
  aucun étirement, couverture renvoyée séparément. Le brancher change tous les scores
  existants : décision produit, pas effet de bord. Voir `docs/remediation/decisions.md` D-05.
- `NO_OPINION` : valeur réservée « sans opinion », hors du domaine 1–5. N'entre dans aucune
  moyenne, contrairement à la réponse neutre (3). Toujours filtrer avec `isScorable()`.
- `recalculateAxes(themes)` : **toute** surface qui modifie des thèmes doit repasser par là.
  Les axes étaient auparavant lus tels quels et devenaient faux après un ajustement manuel.

### Matching engine

Point d'entrée unique : **`src/engine/candidateMatch.js` → `computeCandidateMatch()`**.
Configuration versionnée dans `src/engine/matchConfig.js` (veto, exposants, mélange, seuils).

- `calculateAlignment()` (`matcher.js`) reste utilisé pour figures et archétypes ; il consomme
  la même configuration de veto.
- Poids : une allocation `themeWeights` complète prime sur `priorityOrder` (rang 1 = 8 → rang 8 = 1).
  Un thème de poids 0 est exclu de la distance **et** du veto.
- ⚠️ **Ne jamais réintroduire de logique de matching dans un composant React.**
  `ElectionDetail.jsx` en portait une copie divergente (veto à 5 thèmes au lieu de 6,
  `themeWeights` ignoré) : les pages Profil et Élection classaient différemment la même personne.

### Versionnage (`src/engine/versions.js`)

Six versions indépendantes : questionnaire, algorithme de file, scoring, axes, matching,
release de données candidats. Tout résultat persisté ou exporté les embarque.
La file de questions est tirée avec une **graine** (`queueSeed`, `src/engine/rng.js`) —
plus de `Math.random()`, le tirage est reproductible.

### Data files

- `src/data/questions.js` + `questions_final.json` — **128 questions actives**, exactement 16 par
  thème (16 CORE, 3 PRIMARY, 109 SECONDARY). Modes : 16 / 32 / 64.
- `src/data/candidateRegistry.js` — **registre canonique** : identité, alias historiques, statut
  de candidature daté et sourcé, `matchReady`, provenance du profil. Source de vérité de
  l'IDENTITÉ ; les scores restent dans `elections.js`.
- `src/data/elections.js` — 10 élections, candidats et questions spécifiques.
  ⚠️ Les clés de `specificQuestions[].positions` **doivent** correspondre exactement aux
  `candidate.id` de la même élection. `npm test` échoue sinon.
- `src/data/historicalFigures.js` — figures historiques (l'en-tête « 40 » est obsolète).

⚠️ Tous les profils candidats sont `legacy-manual-v1` : huit nombres saisis à la main, sans
preuve par position. Ne pas leur inventer de sources rétroactives — voir
`docs/data/candidate-provenance.md`.

### 8 themes

`ECONOMY`, `SOCIAL`, `IMMIGRATION`, `SECURITY`, `ENVIRONMENT`, `DEMOCRACY`, `GLOBAL`, `PUBLIC_SERVICES`

All UI text is bilingual (EN/FR). Translations live in `src/i18n/translations.js`. The active language is stored in the Zustand store and auto-detected from `navigator.language` on first load. Components receive a `t` translator function: `const t = createTranslator(language)`.

### Plateforme de collecte (2026-08-10) — écrite, testée, NON déployée

Schéma `private` **non exposé par PostgREST** (`supabase/config.toml` — ne jamais y ajouter
`private`), alimenté uniquement par l'Edge Function `supabase/functions/ingest/`.

- `private.quiz_attempts` / `quiz_responses` — **« sans opinion » est un ÉTAT conservé**
  (`response_state = 'no_opinion'`, `answer_value` nul), plus une ligne supprimée. Un trigger
  refuse la suppression d'un `no_opinion` hors purge.
- `private.consent_records` — journal **append-only**, 4 finalités distinctes
  (`measurement`, `political_analytics`, `cloud_save`, `research`), jamais précochées.
- `private.question_reports` — les signalements sont **réellement stockés**. `QuestionCard`
  n'affiche « reçu » qu'après réponse serveur positive ; hors ligne, il annonce la mise en file.
- Client : `src/lib/questionTiming.js` (temps actif, horloge monotone),
  `mutationQueue.js` (sérialisée, idempotente, hors ligne), `consent.js`, `attemptSession.js`.

⚠ **Deux identifiants pseudonymes DISTINCTS** : `poliscop_anon_id` (mesure d'audience) et
`poliscop_analytics_sid` (analyse politique). Les fusionner relierait le parcours de navigation
aux opinions — donnée de l'article 9. Chacun n'est créé qu'à l'acceptation de SA finalité et
effacé à son retrait.

⚠ **La production réelle est `gpvqsftyrninbwzhkaed`** (celle du `.env`, vivante), PAS
`xjpzqaqzoygcwtcpumfo` (« Poliscope v1 » — nom exact du projet Supabase ; brand-check:allow),
qui est injoignable. Le projet vivant n'est pas dans le compte
Supabase connecté : inventaire et déploiement sont bloqués. Voir
`docs/data-platform/11-production-connection.md`.

### Supabase integration

`src/lib/supabase.js` creates the Supabase client and degrades gracefully when env vars are absent (returns `null`). `src/lib/auth.jsx` provides an `AuthProvider` and `useAuth` hook. Cloud profile saving is only available when Supabase is configured.

⚠️ **Sécurité — état au 2026-08-09**

- Le PIN fondateur en clair (`poliscop2027`) a été retiré du bundle. L'autorisation du
  tableau de bord passe par `is_founder_admin()` côté Postgres
  (`supabase/migrations/20260809120000_admin_authorization.sql`, testée localement avec
  `npm run test:migrations`) — **non appliquée en production** ; le tableau de bord refuse
  donc l'accès (fail-closed voulu). ⚠ `schema_v7_admin_security.sql` est OBSOLÈTE : il
  échouait systématiquement, ne pas l'exécuter.
- ⚠️ **`user_answers.answer_value` est un `smallint` 1–5.** « Sans opinion » ne peut pas y être
  écrit : toute écriture cloud passe OBLIGATOIREMENT par `src/lib/cloudAnswers.js`. Ne jamais
  reconstruire une ligne `user_answers` à la main — c'est ce qui faisait échouer des lots entiers.
- ⚠️ **Le flux de mesure d'audience ne transporte aucune opinion.** `stripOpinionPayload()`
  (`src/lib/analytics.js`) retire réponse, question, thème, archétype, candidat, priorités et
  démographie avant tout envoi. Les tendances politiques s'agrègent depuis les tables de compte.
- Six générations de schéma coexistent (`schema.sql` → `schema_v6_data_platform.sql`).
  Déployer la v6 seule **casserait** le frontend actuel : utiliser une migration
  expand/contract. Rien n'a été appliqué en production.
- Mesure d'audience **fail-closed** : aucun identifiant persistant n'est déposé et aucun
  événement n'est envoyé avant acceptation explicite (`consent.measurement`, case décochée
  par défaut). Conséquence assumée : le volume de données du tableau de bord baisse.
- Procédure d'audit de la production : `docs/security/production-audit-runbook.md`.

### Deployment

Deployed on Vercel. `vercel.json` handles SPA routing (all paths → `index.html`) and asset cache headers. The app is also a PWA (`public/manifest.json` + `public/sw.js`).
