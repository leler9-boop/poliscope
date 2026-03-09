# Poliscope — Deployment Guide

## Overview

Poliscope is a React + Vite SPA. It works entirely in guest mode without a backend. Supabase is optional and only needed for cloud profile saving.

| Part | Technology | Required |
|------|-----------|----------|
| Frontend hosting | Vercel | ✅ Yes |
| Auth + cloud save | Supabase | ⬜ Optional |

---

## Step 1 — Push to GitHub

```bash
cd poliscope

# Initialize git (if not already done)
git init
git add .
git commit -m "feat: Poliscope MVP — ready for deployment"

# Create a new repo on github.com, then:
git remote add origin https://github.com/YOUR_USERNAME/poliscope.git
git push -u origin main
```

> **Note:** `.env.local` is already in `.gitignore` — your secrets will never be committed.

---

## Step 2 — Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in (GitHub login recommended).
2. Click **"Add New Project"** → Import your `poliscope` repository.
3. Vercel auto-detects **Vite**. The defaults work as-is:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
4. Click **Deploy**.

Your app will be live at `https://poliscope-xxx.vercel.app` within ~1 minute.

> The `vercel.json` in the repo already handles SPA routing (all paths → `index.html`) and caching headers for assets.

---

## Step 3 — Set up Supabase (optional)

Skip this step if you don't need cloud profile saving. The app works fully without it.

### 3a. Create a project

1. Go to [supabase.com](https://supabase.com) → **New Project**.
2. Choose a name (e.g. `poliscope`), a strong database password, and a region close to your users.
3. Wait ~2 minutes for the project to spin up.

### 3b. Run the schema

1. In the Supabase dashboard, open **SQL Editor → New Query**.
2. Paste the contents of `supabase/schema.sql` and click **Run**.
3. This creates the `profiles` table with Row Level Security enabled.

### 3c. Enable email auth

1. Go to **Authentication → Providers**.
2. Ensure **Email** is enabled (it is by default).
3. Optionally disable "Confirm email" during development (Authentication → Settings → "Enable email confirmations").

### 3d. Get your API keys

1. Go to **Settings → API**.
2. Copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon / public key** → `VITE_SUPABASE_ANON_KEY`

---

## Step 4 — Add environment variables to Vercel

1. In the Vercel dashboard, open your project → **Settings → Environment Variables**.
2. Add:

   | Name | Value |
   |------|-------|
   | `VITE_SUPABASE_URL` | `https://xxxx.supabase.co` |
   | `VITE_SUPABASE_ANON_KEY` | `eyJhbGci...` |

3. Select **All Environments** (Production, Preview, Development) or just Production.
4. Click **Save**, then go to **Deployments** and **Redeploy** the latest deployment.

Once redeployed, the "Sign in" button appears in the header and users can save profiles to the cloud.

---

## Step 5 — Custom domain (optional)

1. In Vercel: **Settings → Domains → Add Domain**.
2. Enter your domain (e.g. `poliscope.yourdomain.com`).
3. Add the DNS records Vercel shows you at your DNS provider.
4. SSL is provisioned automatically.

---

## Local development

```bash
# Install dependencies
npm install

# Create local env file
cp .env.example .env.local
# Edit .env.local with your Supabase keys (or leave blank to skip auth)

# Start dev server
npm run dev
# → http://localhost:5173

# Production build
npm run build
npm run preview   # preview the built dist locally
```

---

## Architecture summary

```
poliscope/
├── src/
│   ├── data/
│   │   ├── questions.js          # 120 questions × 8 themes
│   │   └── historicalFigures.js  # 40 historical figures
│   ├── engine/
│   │   └── scorer.js             # Theme scoring + 4-axis calculation
│   ├── lib/
│   │   ├── supabase.js           # Supabase client (graceful degradation)
│   │   └── auth.jsx              # AuthProvider + useAuth hook
│   ├── store/
│   │   └── useStore.js           # Zustand state (persisted to localStorage)
│   ├── pages/
│   │   ├── Landing.jsx           # Home
│   │   ├── SelectTest.jsx        # Choose quiz mode
│   │   ├── PriorityRanking.jsx   # Theme priority drag
│   │   ├── Questionnaire.jsx     # Quiz runner
│   │   ├── Profile.jsx           # Results + cloud save
│   │   ├── HistoricalFigures.jsx # Compare with 40 figures
│   │   ├── Elections.jsx         # Election comparison (placeholder)
│   │   └── Auth.jsx              # Sign in / Sign up
│   └── components/
│       ├── Header.jsx            # Nav + language + auth buttons
│       ├── QuestionCard.jsx      # Question UI with tooltip
│       ├── RadarChart.jsx        # Theme radar visualization
│       └── AxisBar.jsx           # Left-right axis bars
├── public/
│   ├── manifest.json             # PWA manifest
│   ├── sw.js                     # Service worker
│   └── icons/                    # PWA icons (192 + 512 px)
├── supabase/
│   └── schema.sql                # Run once in Supabase SQL editor
├── .env.example                  # Copy to .env.local
├── vercel.json                   # SPA routing + cache headers
└── vite.config.js                # Build config (base: '/')
```

---

## Troubleshooting

**White screen after deploy**
→ Check Vercel build logs. Likely a missing env var or import path issue.

**Auth not working / "Sign in" button not visible**
→ Supabase env vars not set in Vercel. Check Settings → Environment Variables and redeploy.

**Profile saves fail**
→ Ensure you ran `supabase/schema.sql`. Check the Supabase Table Editor for the `profiles` table.

**PWA not installing**
→ HTTPS is required. Works automatically on Vercel. Icons must be at `/icons/icon-192.png` and `/icons/icon-512.png`.
