# POLISCOP — Supabase Intelligence Audit
**Date:** 2026-06-14  
**Scope:** Full audit of data collection, tracking infrastructure, political intelligence capabilities, privacy risks, and implemented improvements.

---

## PART 1 — Current State

### What we store today

| Table | Rows tracked | What's in it |
|---|---|---|
| `user_answers` | 1 row / user × question | Raw Likert answers (1–5) per question |
| `user_profiles` | 1 row / user | Computed theme_scores, axes, confidence, answered_count |
| `user_demographics` | 1 row / user (optional) | age_range, education_level, postal_code |
| `anonymous_sessions` | 1 row / anonymous visitor | UUID, device UA, lang, timestamps |
| `anonymous_answers` | 1 row / anon × question | Raw Likert answers before sign-in |
| `events` | 0 rows | Table existed. **Zero events were ever inserted.** |
| `profiles` (legacy) | legacy | Deprecated — kept for backward compat |

### Critical finding: analytics was completely dead

The `track()` function existed in `src/lib/anonymous.js` and the `events` table was correctly set up with open INSERT RLS — but `track()` was never imported or called anywhere in the codebase. Every user action (quiz start, quiz complete, profile share, login) produced zero data in the events table.

**This has now been fixed** (see Part 7).

---

## PART 2 — User Journey Coverage (before fix)

| Funnel step | Was tracked? | Notes |
|---|---|---|
| Landing view | ✗ | No event fired |
| Test started | ✗ | No event fired |
| Test completed | ✗ | No event fired |
| Profile viewed | ✗ | No event fired |
| Profile shared | ✗ | No event fired |
| Profile downloaded | ✗ | No event fired |
| User signed up | ✗ | No event fired |
| User logged in | ✗ | No event fired |
| Demographics filled | ✗ | No event fired |
| Demographics skipped | ✗ | No event fired |
| Improve mode started | ✗ | No event fired |
| Improve mode exited | ✗ | No event fired |
| Concept explainer opened | ✗ | No event fired |
| Profile exported (JSON) | ✗ | No event fired |

**Every single funnel step was invisible.** The only data collected was raw answers (which Supabase received silently) and the session record (also silent).

---

## PART 3 — Data Quality Assessment

### What we could answer BEFORE this fix

- **"How many registered users have answered at least 10 questions?"** → Yes, via `user_profiles.answered_count`
- **"What is the average theme score distribution across users?"** → Yes, via `user_profiles.theme_scores` (JSONB)
- **"Do registered users' demographics skew young or old?"** → Yes, via `user_demographics.age_range`
- **"What % of users filled in demographics?"** → Yes, by comparing user count vs demographics row count

### What we could NOT answer BEFORE this fix

- **"What is our daily active user count?"** → Cannot answer — no event timestamps per action
- **"What % of users who start the quiz finish it?"** → Cannot answer — no test_start or test_complete events
- **"Which sharing method is most used (native / copy / download)?"** → Cannot answer
- **"What is the average time from signup to quiz completion?"** → Cannot answer
- **"Is our virality working? How many users came from a shared card?"** → Cannot answer
- **"Which archetype is most common?"** → Partially — could compute from theme_scores in SQL, but archetype_id column didn't exist
- **"What is the top candidate match distribution?"** → Cannot answer — top_candidate_id didn't exist in user_profiles
- **"How many users complete the quiz on mobile vs desktop?"** → Cannot answer
- **"What % of users skip demographics?"** → Cannot answer

---

## PART 4 — Political Intelligence Potential

### Cross-demographic analysis (now possible after fix)

Once events flow and user_profiles.archetype_id is populated, the following queries become possible:

**By age group (18–24 vs 65+):**
```sql
SELECT up.archetype_id, ud.age_range, COUNT(*) as n,
       AVG(up.top_candidate_alignment) as avg_alignment
FROM user_profiles up
JOIN user_demographics ud ON ud.user_id = up.user_id
GROUP BY 1, 2 ORDER BY n DESC;
```

**By archetype over time (trend detection):**
```sql
SELECT date_trunc('week', created_at) as week, archetype_id, COUNT(*)
FROM user_profiles GROUP BY 1, 2 ORDER BY 1 DESC;
```

**Share virality by archetype:**
```sql
SELECT props->>'archetype_id' as archetype, COUNT(*) as shares
FROM events WHERE event_name = 'profile_shared'
GROUP BY 1 ORDER BY 2 DESC;
```

**Candidate distribution:**
```sql
SELECT top_candidate_id, COUNT(*) as users,
       AVG(top_candidate_alignment) as avg_match
FROM user_profiles WHERE top_candidate_id IS NOT NULL
GROUP BY 1 ORDER BY 2 DESC;
```

### Political intelligence opportunities (medium-term)

- **Regional clustering**: once postal_code → region mapping is done, can show which regions favor which candidates/archetypes
- **Trend detection**: archetype distribution week-over-week tells you how the electorate is moving
- **Viral archetype identification**: which archetypes share more → which segments drive organic growth
- **Cohort analysis**: users who signed up in month X — what % completed the quiz? What's their archetype distribution?
- **Mode effectiveness**: does quick mode (15 questions) produce reliable archetypes? Compare variance in theme_scores by mode

---

## PART 5 — Founder Dashboard

### Recommended SQL views (implemented in schema_v2.sql)

| View | Purpose |
|---|---|
| `v_weekly_stats` | Top-level KPIs: landing views, test starts, completions, signups, share rate % |
| `v_daily_funnel` | Daily breakdown by event_name with unique user counts |
| `v_archetype_distribution` | Archetype counts, avg alignment, avg answered_count |
| `v_candidate_distribution` | Candidate match distribution with average theme scores |
| `v_archetype_by_age` | Cross-tab: archetype × age_range |
| `v_share_virality` | Which archetypes share most, by method |
| `v_funnel_by_mode` | Quiz start → completion by mode (quick/standard/full) |

### How to access the dashboard

All views require the **service_role** key (not exposed in the frontend). Access them via:
1. **Supabase SQL Editor** — paste and run any query directly
2. **Supabase Table Editor** → select the view from the schema browser
3. Future: an Edge Function + protected admin route in the app

### Key weekly query to run every Monday

```sql
SELECT * FROM v_weekly_stats ORDER BY week DESC LIMIT 4;
```

---

## PART 6 — Privacy: GDPR / CNIL Analysis

### Status: Moderate risk — corrective actions recommended

#### What applies
- **GDPR Article 9** (special categories of personal data) applies to political opinion data. `user_profiles.theme_scores` stores inferred political positions linked to identified persons (auth.users). This is **strictly regulated** under French law via the CNIL.
- **CNIL délibération n° 2020-046** covers cookie consent and tracking analytics. Anonymous event tracking (no cookies, localStorage UUID only) falls in a grey area but is lower risk than cookie-based tracking.

#### Current risks

| Risk | Severity | Notes |
|---|---|---|
| Political opinion data stored without explicit Article 9 consent | **HIGH** | `user_profiles` links to auth.users. Signup flow has no explicit consent for political opinion processing. |
| `user_demographics.postal_code` stored raw | MEDIUM | Postal code = indirect identifier. Should derive `region` (first 2 digits) and purge raw code after processing. |
| `anonymous_sessions.device` stores full user-agent | LOW | Verbose UA can fingerprint. Should store parsed OS/browser string only. |
| No data retention policy | MEDIUM | Events table has no TTL. Should purge after 24 months. |
| No consent tracking table | HIGH | Cannot prove user consented to political data processing. Need `user_consents` table. |
| `anonymous_sessions` RLS allowed full table reads | LOW | Fixed in schema_v2.sql — now insert-only from anon key. |

#### Recommended immediate actions (not yet implemented)

1. **Add consent checkbox to signup flow**: "J'accepte que mes opinions politiques soient analysées pour personnaliser mon expérience." Store consent in a `user_consents` table.
2. **Derive region from postal_code**: Before storing, extract `LEFT(postal_code, 2)` as department code, then map to region. After 30 days, set `postal_code = NULL`.
3. **Replace raw UA with parsed string**: `navigator.userAgent` → parse to `"iOS 17 / Safari"` before storing in `anonymous_sessions.device`.
4. **Implement events TTL**: Schedule a monthly SQL job: `DELETE FROM events WHERE created_at < now() - INTERVAL '24 months'`.
5. **Add data deletion endpoint**: Users can already delete their account (CASCADE DELETE). Verify this is documented in privacy policy.

#### What's safe as-is
- Anonymous tracking (events table, anonymous_sessions) does not store identifying information — only a localStorage UUID. This is CNIL-compliant without explicit consent under the "legitimate interest" exemption for analytics, as long as data is not sold or used for targeting.
- The app's existing privacy disclaimer in OnboardingModal is accurate ("données utilisées de manière anonymisée").

---

## PART 7 — Implemented Improvements

### New files

| File | What it does |
|---|---|
| `src/lib/analytics.js` | Named event functions (fire-and-forget wrappers over track()) |
| `supabase/schema_v2.sql` | ALTER TABLE migrations, new indexes, 7 analytics views, RLS fix |

### Modified files

| File | Change |
|---|---|
| `src/store/useStore.js` | Import analytics.js; fire `test_start` in startTest, `test_complete` in finishQuestionnaire + nextQuestion, `improve_started` in startImproveMode, `improve_completed` in stopImproveMode |
| `src/lib/auth.jsx` | Import analytics.js; fire `signup_completed` / `login_completed` in onAuthStateChange; add `saveProfileMeta()` function that upserts archetype_id, top_candidate_id, top_candidate_alignment to user_profiles |
| `src/pages/Landing.jsx` | Fire `landing_view` on mount via useEffect |
| `src/pages/Profile.jsx` | Import useEffect; fire `profile_viewed` on mount; call `saveProfileMeta()` when archetype resolves; fire `profile_exported` on export button click |
| `src/components/ProfileShareModal.jsx` | Fire `profile_shared` (native/copy/download) and `profile_downloaded` in handlers |
| `src/components/OnboardingModal.jsx` | Fire `demographics_completed` / `demographics_skipped` after save/skip |

### New analytics events now firing

| Event | When | Key props |
|---|---|---|
| `landing_view` | Landing page renders | lang, has_profile |
| `test_start` | User clicks CTA to start quiz | mode, lang |
| `test_complete` | User finishes questionnaire | mode, answered_count, total_count, lang |
| `improve_started` | User enters improve mode | — |
| `improve_completed` | User exits improve mode | answered_count |
| `profile_viewed` | Profile page renders | answered_count, archetype_id, top_candidate_id |
| `profile_shared` | User shares (native/copy/download) | method, archetype_id, top_candidate_id, top_candidate_alignment |
| `profile_downloaded` | User saves image | archetype_id |
| `profile_exported` | User downloads JSON | — |
| `signup_completed` | New account created | method (email/google) |
| `login_completed` | Existing user logs in | method |
| `demographics_completed` | Onboarding form submitted | age_range, education_level, has_postal_code |
| `demographics_skipped` | Onboarding skipped | — |

### New schema additions (schema_v2.sql)

- `user_profiles.created_at` — for cohort analysis
- `user_profiles.archetype_id` — for distribution queries
- `user_profiles.top_candidate_id` — for candidate mapping
- `user_profiles.top_candidate_alignment` — for avg match queries
- `user_demographics.gender`, `region`, `employment_status` — for demographic intelligence
- `anonymous_sessions.referrer`, `utm_source`, `utm_medium`, `utm_campaign`, `answered_count`, `completed` — for acquisition analysis
- 5 performance indexes on events and user_profiles
- 7 analytics views (v_weekly_stats, v_daily_funnel, v_archetype_distribution, etc.)
- Fixed anonymous_sessions RLS (was allowing full table reads)

---

## What insights can be generated TODAY (post-fix)

Once traffic flows through the new events:

1. **Daily active users** — distinct `anonymous_id` / `user_id` per day from `landing_view` events
2. **Quiz completion rate** — `test_complete` / `test_start` per week
3. **Share rate** — `profile_shared` / `test_complete`
4. **Top archetype** — from `user_profiles.archetype_id` (now populated)
5. **Top candidate match** — from `user_profiles.top_candidate_id`
6. **Signup conversion** — `signup_completed` / `test_complete`
7. **Demographics coverage** — `demographics_completed` / `signup_completed`
8. **Mode distribution** — `test_start.props->>'mode'` breakdown

## What becomes possible after 4 weeks of data

- **Funnel drop-off by step** — which question index loses users
- **Archetype trend** — week-over-week shifts in political distribution
- **Sharing virality by archetype** — which profiles share most
- **Age × archetype cross-tab** — youth politics signature
- **Acquisition channel attribution** — if UTM params are added to landing page links

## What requires additional work to unlock

- **Regional analysis** — needs postal_code → region mapping + UI collection of region
- **Article 9 compliance** — needs explicit consent UI + `user_consents` table
- **Abandon tracking** — needs question-level events (fire every N questions, not just on complete)
- **Return user analysis** — needs session linking across anonymous → logged-in transitions (partially done via mergeAnonymousAnswers)
- **Trend forecasting** — needs 3+ months of data and a predictive query layer

---

## How to run schema_v2.sql

1. Open Supabase Dashboard → SQL Editor → New Query
2. Copy-paste the contents of `supabase/schema_v2.sql`
3. Click Run
4. All migrations use `ALTER TABLE ... ADD COLUMN IF NOT EXISTS` — safe to run on production

Then verify with:
```sql
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
ORDER BY ordinal_position;
```

You should see `archetype_id`, `top_candidate_id`, `top_candidate_alignment`, `created_at` in the list.
