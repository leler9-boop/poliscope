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
```

No test suite is configured. There is no linter configured either.

## Environment

Copy `.env.example` to `.env.local` for local development. Supabase env vars are optional — the app runs fully in guest mode without them:

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

## Architecture

Poliscope is a React + Vite SPA with no router — navigation is managed entirely through a Zustand store (`currentPage` field). All state is persisted to `localStorage` via the `persist` middleware.

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
- Theme scores are 0–100; default is 50 (center) when no questions answered
- Four derived axes (economic, social, institutional, international) are computed from weighted combinations of theme scores

### Matching engine (`src/engine/matcher.js`)

- `calculateAlignment(userThemes, targetProfile, priorityOrder)` computes a 0–100 alignment score using priority-weighted absolute distances between theme scores
- Priority order affects weights: rank 1 theme gets weight 8, rank 8 gets weight 1
- `rankByAlignment` sorts a list of targets (historical figures or election candidates) by alignment

### Data files

- `src/data/questions.js` — 120 questions across 8 themes (15 per theme), with `priority` 1/2/3 for quick/standard/full
- `src/data/historicalFigures.js` — 40 historical figures, each with a `profile` object mapping theme keys to 0–100 scores
- `src/data/elections.js` — election data (placeholder)

### 8 themes

`ECONOMY`, `SOCIAL`, `IMMIGRATION`, `SECURITY`, `ENVIRONMENT`, `DEMOCRACY`, `GLOBAL`, `PUBLIC_SERVICES`

All UI text is bilingual (EN/FR). Translations live in `src/i18n/translations.js`. The active language is stored in the Zustand store and auto-detected from `navigator.language` on first load. Components receive a `t` translator function: `const t = createTranslator(language)`.

### Supabase integration

`src/lib/supabase.js` creates the Supabase client and degrades gracefully when env vars are absent (returns `null`). `src/lib/auth.jsx` provides an `AuthProvider` and `useAuth` hook. Cloud profile saving is only available when Supabase is configured. Run `supabase/schema.sql` once in the Supabase SQL editor to create the `profiles` table with Row Level Security.

### Deployment

Deployed on Vercel. `vercel.json` handles SPA routing (all paths → `index.html`) and asset cache headers. The app is also a PWA (`public/manifest.json` + `public/sw.js`).
