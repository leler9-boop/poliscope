# Baseline — état du dépôt avant remise à niveau

**Date** : 2026-08-09
**Dépôt** : `/Users/arnaudlery/Desktop/poliscope copy/`, branche `main`
**Point de départ** : audit externe `AUDIT_POLISCOP_DEPOT_REEL_2026-08-09.md`

Chaque constat ci-dessous a été **reproduit dans le code**, pas repris de l'audit. Les écarts
avec l'audit sont signalés.

---

## État Git au démarrage

Travail non commité déjà présent, **conservé sans modification** :

| Fichier | Nature |
|---|---|
| `public/images/candidates/ruffin.svg` | ajouté (staged) |
| `scripts/check-brand.mjs` | exclusion du dossier personnel `Poliscop/` |
| `src/data/candidatePolicies.js` | ajout de blurbs Ruffin |
| `src/data/elections.js` | mise à jour du casting 2027 (bardella/castets → ruffin/zemmour, roussel) |
| `src/pages/CandidateProfile.jsx` | repli `baseId()` pour les identifiants suffixés `_2027` |

## Commandes exécutées

```bash
npm run build                          # ✅ exit 0
node scripts/check-profile-conventions.mjs   # ✅ PASS
node scripts/lint-questions.mjs        # ⚠️ 1 alerte éditoriale + chemin absolu en dur
node scripts/check-freshness.mjs       # ⚠️ 12 alertes (dont échéances dépassées)
node scripts/check-brand.mjs           # ✅
node scripts/check-learn-content.mjs   # ✅ 34 fiches · 104 vrai/faux · 0 erreur
```

Aucun script `npm test`, aucune CI, aucun test bloquant sur les données électorales.

---

## Constats reproduits

### 1. Identifiants désalignés — couverture spécifique nulle · **CONFIRMÉ, ET PLUS LARGE**

L'audit signalait `fr_2027`. Le contrôle systématique sur les 10 élections en a trouvé **trois** :

```
❌ fr_2027   lepen_2027 : 0/17 · melenchon_2027 : 0/17   | clés orphelines : lepen, melenchon
❌ it_2022   letta_it   : 0/8                            | clé orpheline  : letta
❌ es_2023   diaz_es    : 0/8                            | clé orpheline  : diaz
```

`it_2022` et `es_2023` **n'étaient pas dans l'audit externe**.

### 2. Un thème sans réponse vaut 50 · CONFIRMÉ
`src/engine/scorer.js` : `if (d.totalWeight === 0) themes[theme] = 50`. « Inconnu » et
« centriste » produisent le même profil et le même matching.

### 3. Confiance = nombre de réponses / 64 · CONFIRMÉ
Libellés « Profil robuste » (32 réponses) et « Profil très fiable » (64) sans aucune
validation empirique. Ni cohérence interne, ni couverture par thème, ni incertitude.

### 4. Tirage non reproductible · CONFIRMÉ
`getQuestionQueue()` utilisait `Math.random()`, sans graine sauvegardée.
Distribution mesurée : Découverte 16 CORE · Standard 16 CORE + 16 SECONDARY ·
Approfondi 16 CORE + 2 PRIMARY + 46 SECONDARY.

> **Correction d'une hypothèse de l'audit** : l'audit supposait que la quasi-absence de
> PRIMARY venait d'un ordre de tirage accidentel. Vérification : la banque active ne contient
> que **3 questions PRIMARY** (`ECO_4`, `ECO_28`, `DEM_26`) sur 128, contre 16 CORE et
> 109 SECONDARY. C'est une propriété des données, pas un bug de tirage.

### 5. Banque de questions · CONFIRMÉ
128 questions actives, exactement 16 par thème sur les 8 thèmes.

### 6. Logique de matching dupliquée et divergente · CONFIRMÉ
`src/engine/matcher.js` : veto sur **6** thèmes (dont GLOBAL).
`src/pages/ElectionDetail.jsx` : copie avec **5** thèmes — GLOBAL absent — et `themeWeights`
jamais transmis. Les deux surfaces pouvaient donc classer différemment la même personne.

### 7. Axes obsolètes après ajustement manuel · CONFIRMÉ
`src/pages/Profile.jsx` lisait `profile.axes` (calculé sur les thèmes bruts) alors que thèmes
et matching utilisaient `buildAdjustedThemes(...)`.

### 8. Import JSON sans recalcul · CONFIRMÉ
`importProfile()` faisait `set({ profile: data.profile })` : un fichier fabriqué imposait
n'importe quels scores.

### 9. PIN fondateur en clair dans le bundle · CONFIRMÉ
`src/pages/FounderDashboard.jsx:21` — `const DASHBOARD_PIN = 'poliscop2027'`.
Vérifié dans l'artefact publié : la chaîne apparaissait littéralement dans
`dist/assets/FounderDashboard-*.js`.

### 10. Identifiant analytique persistant sans consentement · CONFIRMÉ
`src/lib/anonymous.js` créait un UUID dans `localStorage` au premier chargement et
l'envoyait avec `navigator.userAgent` et `navigator.language`, sans consentement à la mesure.

### 11. Générations de schéma Supabase incompatibles · CONFIRMÉ
`schema.sql` → `schema_v6_data_platform.sql` coexistent. Le frontend écrit dans `user_answers`
et `user_consents` ; la v6 attend `question_version`, `consent_events`, `response_events`.

### 12. Profils candidats sans provenance par position · CONFIRMÉ
Huit nombres statiques par candidat, aucune source, date ni confiance attachée à chaque valeur.

---

## Non vérifié / bloqué

| Sujet | Raison |
|---|---|
| Politiques RLS et GRANT réellement déployés | Projet Supabase de production inaccessible depuis cet environnement. Voir `docs/security/production-audit-runbook.md`. |
| Rendu visuel dans le navigateur | Le navigateur intégré est resté bloqué sur une vérification de politique ; `curl` sur le serveur de dev n'aboutissait pas non plus. Vérification faite par build de production complet + tests. |
| Équivalence psychométrique des formes courtes | Aucune donnée utilisateur réelle. Voir `docs/methodology/validation-roadmap.md`. |
