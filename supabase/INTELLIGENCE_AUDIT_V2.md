# POLISCOP — Intelligence Architecture Audit V2
**Date:** 2026-06-14  
**Scope:** Full audit of data architecture, event tracking, analytics intelligence, GDPR posture, and implementation roadmap.  
**Status of Supabase project `xjpzqaqzoygcwtcpumfo`:** INACTIVE — paused >90 days, cannot be restored. A new project is required before live data can be collected.

---

## PHASE 1 — CURRENT STATE: COMPLETE DATA MAP

### Tables in production schema

| Table | Purpose | Is it populated? | Quality | Intelligence value |
|---|---|---|---|---|
| `user_answers` | One row per (user, question). Raw Likert answers 1–5. | Yes — on every answer | High | **Critical** — raw data for all political analysis |
| `user_profiles` | Computed snapshot: theme_scores (JSONB), axes, confidence, answered_count | Yes — upserted on every answer | High | **Critical** — all 8 theme scores + 4 axes queryable |
| `user_demographics` | age_range, education_level, postal_code | Partial — only users who complete onboarding | Medium | **High** — enables demographic cross-tabs |
| `anonymous_sessions` | One row per anonymous visitor: UUID, UA string, lang, timestamps | Yes | Low | **Low** — session count only, no funnel data |
| `anonymous_answers` | Answers saved before login, merged on sign-in | Yes — used for guest-to-user migration | High | **Medium** — ensures no answer loss on signup |
| `events` | Generic event log: event_name + JSONB props | **Was empty until schema_v2 deployment** | N/A | **Critical** — all funnel intelligence lives here |
| `profiles` (legacy) | Deprecated duplicate of user_profiles | Possibly | Low | **Dead — do not use** |

### Columns added in schema_v2 (deployed but not yet run on production)

**user_profiles:**
- `created_at` — cohort analysis anchor
- `archetype_id` — computed archetype slug (e.g. `social_democrate`)
- `top_candidate_id` — best-matching 2027 candidate
- `top_candidate_alignment` — alignment score 0–100

**user_demographics:**
- `gender` — not yet collected in UI
- `region` — not yet collected or computed from postal_code
- `employment_status` — not yet collected in UI

**anonymous_sessions:**
- `referrer` — not yet captured in anonymous.js
- `utm_source`, `utm_medium`, `utm_campaign` — not yet captured
- `answered_count` — not yet updated
- `completed` — not yet updated

### Critical finding: schema_v2 migrations have NOT been run on production

The `schema_v2.sql` file was written but the Supabase project has been INACTIVE since before it was committed. All v2 columns, indexes, and views exist only in the SQL file — not in the live database. The entire `events` table has zero rows.

**Consequence: Poliscop has collected zero funnel analytics since launch.**

---

## PHASE 2 — EVENT TRACKING: COMPLETE AUDIT

### Events currently implemented (analytics.js)

| Event | Where fired | When | Key props | Is it sufficient? |
|---|---|---|---|---|
| `landing_view` | Landing.jsx | On mount | lang, has_profile | ✓ Yes |
| `test_start` | useStore.startTest | Mode selected | mode, lang | ✓ Yes |
| `test_complete` | useStore.nextQuestion / finishQuestionnaire | Last question answered | mode, answered_count, total_count, lang | ✓ Yes |
| `improve_started` | useStore.startImproveMode | Improve mode entered | — | ✓ Minimal but OK |
| `improve_completed` | useStore.stopImproveMode | Improve mode exited | answered_count | ✓ Yes |
| `profile_viewed` | Profile.jsx | Profile page mounts | answered_count, archetype_id, top_candidate_id | ✓ Yes |
| `profile_shared` | ProfileShareModal.jsx | Share action taken | method, archetype_id, top_candidate_id, top_candidate_alignment | ✓ Yes |
| `profile_downloaded` | ProfileShareModal.jsx | Image saved | archetype_id | ✓ Yes |
| `profile_exported` | Profile.jsx | JSON exported | — | ⚠️ Should add archetype_id |
| `signup_completed` | auth.jsx | New account created | method (email/google) | ✓ Yes |
| `login_completed` | auth.jsx | Existing user logs in | method | ✓ Yes |
| `demographics_completed` | OnboardingModal.jsx | Form submitted | age_range, education_level, has_postal_code | ✓ Yes |
| `demographics_skipped` | OnboardingModal.jsx | Skipped | — | ✓ Yes |
| `concept_opened` | (QuestionCard path) | Concept explainer opened | concept_key, question_index | ✓ Yes |
| `beginner_opened` | (Beginner path) | Learn page opened | section | ✓ Yes |

**Total: 15 events tracked.**

### MISSING EVENTS — CRITICAL GAPS

#### 1. `question_answered` ← **MOST IMPORTANT MISSING EVENT**

Without this, you cannot answer any of the following:
- Which question causes the most dropouts?
- Which questions are most polarising (highest answer variance)?
- Which questions split users 50/50 (most controversial)?
- What is the answer distribution per question across the electorate?
- At what question index does engagement drop off?
- Do users who answer immigration questions early produce different profiles?

**What to capture:**
```json
{
  "question_id": "ECO_1",
  "theme": "ECONOMY",
  "value": 4,
  "question_index": 5,
  "mode": "standard",
  "is_improve": false
}
```

**Where to fire:** `Questionnaire.jsx → handleAnswer(val)` — after `answerQuestion(question.id, val)`, only on first answer (not re-selection, same guard as auto-advance).

#### 2. `question_skipped`

Users can skip questions (handleSkip in Questionnaire.jsx). This is a direct signal of friction or controversy.

**What to capture:**
```json
{
  "question_id": "IMM_3",
  "theme": "IMMIGRATION",
  "question_index": 12,
  "mode": "standard"
}
```

#### 3. `retake_started`

When a user resets their profile and starts a new test. This is a retention signal — it tells you the product is sticky enough to replay. Currently, `resetProfile()` in useStore.js fires no event.

#### 4. `share_modal_opened`

Currently, `profile_shared` fires only on a completed share action. You cannot distinguish between:
- Users who opened the share modal and did nothing (intent without completion)
- Users who opened and actually shared

The share funnel should be: `share_modal_opened → profile_shared`.

**What to capture:**
```json
{ "archetype_id": "social_democrate" }
```

#### 5. `priority_ranking_completed`

The priority ranking page (PriorityRanking.jsx) lets users order themes before the test. No event fires when they confirm the ranking. This tells you:
- What fraction of users configure priorities vs. skip straight to default
- Which priority configurations are most common

#### 6. `candidate_viewed`

CandidateProfile.jsx is never tracked. At 100K users, knowing which candidates users click to learn more about is politically significant intelligence.

#### 7. `election_viewed`

ElectionDetail.jsx is never tracked. Knowing which elections users explore tells you the product's electoral focus.

#### 8. `historical_figure_viewed`

HistoricalFigures.jsx / FrenchFigures.jsx — which figures attract clicks from which archetypes?

#### 9. `compare_started`

CandidateCompare.jsx is never tracked. Feature adoption signal.

#### 10. `election_quiz_completed`

The election questionnaire (inside ElectionDetail.jsx) has its own quiz flow with `answerElectionQuestion`. No completion event fires.

### Complete desired event funnel

```
landing_view
  ↓ test_start (mode)
    ↓ priority_ranking_completed (optional)
      ↓ question_answered × N (question_id, theme, value, index)
      ↓ question_skipped × M
    ↓ test_complete (mode, answered_count)
      ↓ profile_viewed (archetype_id, top_candidate_id)
        ↓ share_modal_opened (archetype_id) [optional]
          ↓ profile_shared (method, ...)
          ↓ profile_downloaded
        ↓ candidate_viewed (candidate_id) [optional]
        ↓ improve_started → improve_completed [optional]
        ↓ retake_started → test_start [optional]
  ↓ signup_completed (method)
    ↓ demographics_completed | demographics_skipped
  ↓ login_completed
  ↓ beginner_opened (section) [optional]
  ↓ election_viewed (election_id) [optional]
    ↓ election_quiz_completed (election_id, answered_count)
  ↓ historical_figure_viewed (figure_id) [optional]
  ↓ compare_started (id1, id2) [optional]
```

---

## PHASE 3 — FOUNDER DASHBOARD DESIGN

### Section 1: Traffic & Funnel (weekly)

| Metric | SQL source | What it tells you |
|---|---|---|
| Unique visitors | `COUNT(DISTINCT anonymous_id) WHERE event = 'landing_view'` | Total reach |
| Test starts | `COUNT(*) WHERE event = 'test_start'` | Interest rate |
| Completions | `COUNT(*) WHERE event = 'test_complete'` | Completion rate |
| Completion rate | `completions / starts × 100` | Product quality signal |
| Profile shares | `COUNT(*) WHERE event = 'profile_shared'` | Viral coefficient |
| Share rate | `shares / completions × 100` | Virality signal |
| Signups | `COUNT(*) WHERE event = 'signup_completed'` | Conversion |
| Signup rate | `signups / completions × 100` | Retention signal |

**Key weekly query (v_weekly_stats view):**
```sql
SELECT * FROM v_weekly_stats ORDER BY week DESC LIMIT 8;
```

### Section 2: Political Distribution

| Metric | SQL source | Political intelligence value |
|---|---|---|
| Archetype distribution | `GROUP BY archetype_id, COUNT(*)` from user_profiles | Ideological map of Poliscop users |
| Archetype trend (week) | Time-series on user_profiles.created_at + archetype_id | Is the electorate shifting? |
| Candidate distribution | `GROUP BY top_candidate_id` from user_profiles | Proxy election poll |
| Left/Right distribution | `AVG(axes->>'economic')` from user_profiles | Mean economic position |
| Progressive/Conservative | `AVG(axes->>'social')` | Mean social position |
| Most shared archetype | `profile_shared.props->>'archetype_id'` | Which profiles go viral? |
| Average theme scores | `AVG((theme_scores->>'ECONOMY')::numeric)` per week | Ideological drift over time |

### Section 3: Demographics Intelligence

| Metric | Source | Political value |
|---|---|---|
| Age × archetype | user_profiles JOIN user_demographics on age_range | Youth politics signature |
| Age × candidate | user_profiles JOIN user_demographics on age_range | Electoral age cohort map |
| Education × economic axis | axes + education_level | Populism index by education |
| Region × candidate | region derived from postal_code | Regional political geography |
| Coverage rate | `COUNT(demographics) / COUNT(users)` | How much demo data do we actually have? |

### Section 4: Behavioural Intelligence (needs question_answered event)

| Metric | SQL source | Political value |
|---|---|---|
| Drop-off at question N | Last `question_answered.question_index` per session | Where does the quiz lose users? |
| Most skipped questions | `question_skipped.question_id` frequency | Most uncomfortable/confusing topics |
| Most controversial questions | `STDDEV(value) BY question_id` from question_answered | Highest disagreement questions |
| 50/50 split questions | `AVG(value) NEAR 3.0 BY question_id` | True political divides in the sample |
| Theme engagement rate | `COUNT(*) BY theme` from question_answered | Which themes attract most answers |
| Mode distribution | `test_start.props->>'mode'` | Quick vs standard vs full |
| Concept opens per question | `concept_opened.concept_key` frequency | Which topics need more explanation |

### Section 5: Retention

| Metric | Source | What it tells you |
|---|---|---|
| Return users | `COUNT(DISTINCT user_id) WHERE event = 'login_completed'` | Active registered users |
| Retake rate | `retake_started / test_complete` | Product stickiness |
| Profile revisit | `profile_viewed` with existing archetype_id | Ongoing engagement |
| Improve mode adoption | `improve_started / profile_viewed` | Feature adoption rate |

---

## PHASE 4 — POLITICAL INTELLIGENCE ROADMAP

### Tier 1: Insights available with 1,000 responses

**The ideological fingerprint of Poliscop users**
- Which archetype has the most users?
- Left/right distribution vs. national polls
- Which candidate matches the median Poliscop user?
- Most agreed-upon positions (high-answer, low-variance questions)

**Key query:**
```sql
SELECT 
  archetype_id,
  COUNT(*) AS n,
  ROUND(AVG((theme_scores->>'ECONOMY')::numeric), 1) AS avg_economy,
  ROUND(AVG((axes->>'economic')::numeric), 1) AS avg_econ_axis
FROM user_profiles
WHERE archetype_id IS NOT NULL
GROUP BY archetype_id
ORDER BY n DESC;
```

### Tier 2: Insights available with 10,000 responses

**The political geography of France**
- Which regions lean which way? (requires postal_code collection)
- Do Ile-de-France users differ from Provence/PACA?
- Youth vs. senior political divide — which archetype dominates under-25s?

**The viral archetype map**
- Which archetypes share their profile most? (viral coefficient by ideology)
- Does the far-right share more than the centre? Does the left?
- Which sharing method (link/image/download) correlates with which archetype?

**Controversial question ranking**
```sql
SELECT 
  props->>'question_id' AS question_id,
  props->>'theme' AS theme,
  AVG((props->>'value')::numeric) AS mean_answer,
  STDDEV((props->>'value')::numeric) AS std_dev,
  COUNT(*) AS n
FROM events
WHERE event_name = 'question_answered'
GROUP BY props->>'question_id', props->>'theme'
ORDER BY std_dev DESC
LIMIT 20;
```

### Tier 3: Insights available with 100,000 responses (2027 target)

**Poliscop as a poll**
- What % of users align with Macron, Le Pen, Mélenchon, etc.?
- How does the Poliscop user distribution compare to actual 2022 results?
- Week-over-week shifts in candidate distribution = proxy tracking of political climate
- Which themes are gaining/losing salience over time?

**The question dropout map**
- At exactly which question does engagement collapse?
- Do users from certain age groups drop off earlier?
- Are immigration questions causing early exits among certain demographics?

**Cohort analysis**
- Users who signed up in March 2027 vs. January 2027 — same archetype distribution?
- Mode effectiveness: do quick-mode users produce reliable profiles vs. full-mode?

**The archetype evolution chart**
- Are users shifting left? Right? Toward ecological?
- Week-over-week: is La France Insoumise archetype growing or shrinking?
- Can Poliscop detect the Mélenchon → Macron migration (2022 second round reality)?

### The 5 killer insights that would make Poliscop a media story

1. **"The youngest French voters are the most radical — left AND right"** (age × archetype bimodal distribution)
2. **"Immigration is the most polarising question in France"** (highest std dev across 100K responses)
3. **"The Macron voter is disappearing"** (top_candidate_id distribution shift over time)
4. **"Poliscop users who share their profiles are 3× more likely to be at the political extremes"** (archetype × share rate)
5. **"Education predicts economic axis better than age"** (regression on education_level vs axes)

---

## PHASE 5 — SCHEMA IMPROVEMENTS

### New tables needed

#### `question_analytics` (aggregate, refreshed periodically)

Stores pre-computed per-question stats derived from `events`. Avoids scanning the entire events table on every dashboard load.

```sql
CREATE TABLE question_analytics (
  question_id   text PRIMARY KEY,
  theme         text NOT NULL,
  response_count int NOT NULL DEFAULT 0,
  skip_count    int NOT NULL DEFAULT 0,
  mean_answer   numeric(4,2),
  std_dev       numeric(4,2),
  controversy_score numeric(4,2),  -- std_dev normalised 0–100
  last_updated  timestamptz NOT NULL DEFAULT now()
);
```

#### `user_consents` (GDPR critical)

Currently Poliscop stores political opinion data (GDPR Article 9 sensitive category) for registered users without a structured consent record. This is a HIGH legal risk.

```sql
CREATE TABLE user_consents (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  consent_type  text NOT NULL,   -- 'political_data_processing' | 'analytics' | 'marketing'
  granted       boolean NOT NULL DEFAULT false,
  version       text NOT NULL,   -- consent text version, e.g. '2026-01'
  ip_hash       text,            -- hashed IP at time of consent
  created_at    timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT user_consents_user_type_unique UNIQUE (user_id, consent_type)
);
```

#### `quiz_sessions` (session-level analytics)

Bridges the gap between anonymous_sessions (one row per visitor) and events (many rows per visitor). Tracks one complete quiz attempt.

```sql
CREATE TABLE quiz_sessions (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  anonymous_id      text,
  user_id           uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  mode              text,              -- 'quick' | 'standard' | 'full'
  started_at        timestamptz NOT NULL DEFAULT now(),
  completed_at      timestamptz,
  questions_shown   int NOT NULL DEFAULT 0,
  questions_answered int NOT NULL DEFAULT 0,
  questions_skipped  int NOT NULL DEFAULT 0,
  archetype_id      text,
  top_candidate_id  text,
  lang              text
);
```

### New views needed (schema_v3.sql)

See `schema_v3.sql` for full implementation. Summary:

| View | Purpose |
|---|---|
| `v_question_controversy` | Ranks questions by answer std dev — the political hot zones |
| `v_archetype_trend` | Week-over-week archetype distribution |
| `v_candidate_trend` | Week-over-week candidate match distribution |
| `v_dropout_by_question` | Last question answered per session — where users leave |
| `v_demographic_archetype` | age × archetype cross-tab |
| `v_share_virality_by_archetype` | Which archetypes share most |
| `v_mode_effectiveness` | Profile confidence by quiz mode |
| `v_geographic_distribution` | Archetype × region (available when postal_code data exists) |

### Materialized views (for 100K+ scale)

At 100K users × 100 questions = 10M event rows. Regular views will be slow. Materialized views + scheduled refresh are required.

```sql
CREATE MATERIALIZED VIEW mv_weekly_funnel AS ...
REFRESH MATERIALIZED VIEW CONCURRENTLY mv_weekly_funnel;
```

### Missing indexes

```sql
-- Events: most queries filter by event_name + time range
CREATE INDEX events_name_created_at_idx ON events (event_name, created_at DESC);

-- Events: filter by question_id inside JSONB props (for question analytics)
CREATE INDEX events_props_question_id_idx ON events ((props->>'question_id')) 
WHERE event_name = 'question_answered';

-- Events: filter by archetype_id inside props (for viral analysis)
CREATE INDEX events_props_archetype_id_idx ON events ((props->>'archetype_id'))
WHERE event_name = 'profile_shared';

-- user_profiles: archetype distribution queries
CREATE INDEX user_profiles_archetype_id_idx ON user_profiles (archetype_id)
WHERE archetype_id IS NOT NULL;

-- user_profiles: candidate distribution
CREATE INDEX user_profiles_top_candidate_id_idx ON user_profiles (top_candidate_id)
WHERE top_candidate_id IS NOT NULL;

-- user_profiles: time-series for trend analysis
CREATE INDEX user_profiles_created_at_idx ON user_profiles (created_at DESC);

-- user_demographics: cross-tabs
CREATE INDEX user_demographics_age_range_idx ON user_demographics (age_range)
WHERE age_range IS NOT NULL;
```

---

## PHASE 6 — GDPR / CNIL AUDIT

### Risk matrix

| Risk | Severity | Status | Action required |
|---|---|---|---|
| Political opinion data stored without Article 9 consent | **CRITICAL** | Not fixed | Add consent checkbox at signup + user_consents table |
| No consent tracking table | **HIGH** | Not fixed | Implement user_consents (in schema_v3.sql) |
| `user_profiles.theme_scores` links to identified person | **HIGH** | By design | OK if explicit consent obtained |
| `user_demographics.postal_code` stored raw | **MEDIUM** | Not fixed | Derive region, then nullify after 30 days |
| `anonymous_sessions.device` stores full UA string | **LOW** | Not fixed | Parse to OS/browser summary before storing |
| Events table has no TTL | **MEDIUM** | Not fixed | Monthly DELETE WHERE created_at < now() - 24 months |
| No data deletion endpoint documented | **MEDIUM** | Partial | CASCADE DELETE works; document in Privacy Policy |
| No data portability endpoint | **LOW** | Not fixed | Export function exists (profile JSON download) |

### What is safe without consent (CNIL "legitimate interest" for analytics)

The events table tracks anonymous_id only (no PII). The anonymous_sessions table has no PII beyond device/lang. This anonymous funnel tracking is CNIL-compliant without explicit consent, provided:
- No cross-referencing with identified persons
- Data is not used for targeting or advertising
- Retention is capped (24 months)

### What requires explicit consent before storage

`user_profiles.theme_scores` linked to `auth.users.id` = **political opinion data on an identified person** = Article 9 special category. Must obtain explicit, specific, freely given consent before creating or updating this row.

**Minimum required consent text:**
> "J'accepte que mes opinions politiques soient analysées par Poliscop pour calculer mon profil politique et me comparer à des candidats. Ces données ne sont jamais vendues ni utilisées à des fins publicitaires."

---

## PHASE 7 — IMPLEMENTATION SUMMARY

### Files created/modified in this session

| File | Action | What it contains |
|---|---|---|
| `supabase/schema_v3.sql` | Created | New tables (question_analytics, user_consents, quiz_sessions), new views, materialized views, RPC functions, indexes |
| `supabase/founder_queries.sql` | Created | 30+ copy-paste SQL queries for every dashboard section |
| `src/lib/analytics.js` | Modified | 9 new event functions added (question_answered, question_skipped, retake_started, share_modal_opened, priority_completed, candidate_viewed, election_viewed, figure_viewed, compare_started) |
| `src/pages/Questionnaire.jsx` | Modified | Wire `question_answered` on handleAnswer, `question_skipped` on handleSkip |
| `src/store/useStore.js` | Modified | Wire `retake_started` in resetProfile |
| `src/pages/PriorityRanking.jsx` | Modified | Wire `priority_ranking_completed` on confirm |
| `src/components/ProfileShareModal.jsx` | Modified | Wire `share_modal_opened` on modal mount |
| `src/pages/CandidateProfile.jsx` | Modified | Wire `candidate_viewed` on mount |
| `src/pages/ElectionDetail.jsx` | Modified | Wire `election_viewed` on mount |

### New analytics events (total: 24 events, up from 15)

| New event | Priority | Intelligence value |
|---|---|---|
| `question_answered` | **CRITICAL** | Per-question political distribution, dropout analysis, controversy detection |
| `question_skipped` | HIGH | Friction detection, uncomfortable topic identification |
| `retake_started` | HIGH | Product stickiness, retention signal |
| `share_modal_opened` | MEDIUM | Share intent vs. completion funnel |
| `priority_ranking_completed` | MEDIUM | Feature adoption, most-prioritised themes |
| `candidate_viewed` | MEDIUM | Content engagement, candidate interest signal |
| `election_viewed` | LOW | Content engagement |
| `historical_figure_viewed` | LOW | Content engagement |
| `compare_started` | LOW | Feature adoption |

### How to activate this in production

1. **Create a new Supabase project** — the old project (xjpzqaqzoygcwtcpumfo) is permanently paused and cannot be restored after 90 days
2. **Run schema.sql** — base schema
3. **Run schema_v2.sql** — analytics columns, indexes, views
4. **Run schema_v3.sql** — question_analytics, user_consents, quiz_sessions, materialized views
5. **Update `.env.local`** with new project URL and anon key
6. **Deploy to Vercel** — push triggers new build; analytics start flowing immediately
7. **Wait 7 days**, then query `v_weekly_stats` for first real data

### First queries to run after 100 responses

```sql
-- How many people completed the quiz?
SELECT COUNT(*) FROM events WHERE event_name = 'test_complete';

-- What archetype distribution are we seeing?
SELECT archetype_id, COUNT(*) n FROM user_profiles 
WHERE archetype_id IS NOT NULL GROUP BY 1 ORDER BY 2 DESC;

-- What is the completion rate?
SELECT 
  SUM(CASE WHEN event_name='test_start' THEN 1 END) starts,
  SUM(CASE WHEN event_name='test_complete' THEN 1 END) completions,
  ROUND(100.0 * SUM(CASE WHEN event_name='test_complete' THEN 1 END) 
    / NULLIF(SUM(CASE WHEN event_name='test_start' THEN 1 END), 0), 1) pct
FROM events WHERE event_name IN ('test_start', 'test_complete');
```
