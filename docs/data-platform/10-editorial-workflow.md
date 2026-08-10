# Candidats, positions, publication — modèle éditorial

**État au 2026-08-10.** Schéma écrit et testé (`supabase/migrations/20260810120000_editorial_candidates.sql`),
**non appliqué en production**. Aucune donnée candidat n'a encore été migrée.

---

## 1. Le problème à résoudre

Aujourd'hui, un profil candidat est **huit nombres saisis à la main** dans
`src/data/elections.js`, marqués `legacy-manual-v1`, sans preuve par position
(`docs/data/candidate-provenance.md`). Personne — pas même l'équipe — ne peut répondre à
« d'où vient le 72 en ÉCONOMIE pour ce candidat ? ».

Pour un outil qui prétend orienter un choix électoral, c'est le point faible principal. Le
modèle ci-dessous rend chaque position **vérifiable par un tiers** ou l'empêche d'être publiée.

---

## 2. Ce qu'une position doit porter

`public.candidate_positions` :

| Champ | Rôle |
|---|---|
| `candidate_id`, `election_id`, `question_id` | de qui, pour quelle élection, sur quelle question |
| `stance` (1–5) | la position, sur l'échelle du questionnaire |
| `excerpt` | **l'extrait exact** du programme ou de la déclaration |
| `coding_rationale` | comment on passe de l'extrait à la note |
| `primary_source_id`, `source_date` | la source et sa date |
| `valid_from`, `valid_until` | période de validité |
| `coder_id`, `coder_kind` | qui a codé (`human` / `assisted` / `automated`) |
| `reviewer_id` | qui a relu |
| `status` | `draft` → `coded` → `in_review` → `approved` / `rejected` / `superseded` |
| `supersedes_id` | position remplacée en cas de revirement — l'ancienne **reste en base** |
| `data_version` | release de données |

Tables satellites : `candidate_position_sources` (corroboration / contradiction),
`candidate_position_reviews` (relectures), `candidate_position_revisions` (**historique
append-only**, alimenté automatiquement par trigger — la piste d'audit ne dépend pas de la
discipline de l'appelant).

---

## 3. Workflow

```
1. collecte de sources        → sources, program_documents
2. brouillon                  → candidate_positions (status = draft)
3. codage assisté             → status = coded, coder_kind ∈ {human, assisted, automated}
4. relecture HUMAINE indépendante → candidate_position_reviews (decision = approve)
5. approbation                → status = approved          ← 3 garde-fous ci-dessous
6. release publiée            → publication_releases.published_at
7. consommation par le matching ← lit UNIQUEMENT la release publiée
```

### Une IA ne publie jamais — trois triggers, pas une consigne

`public.enforce_position_workflow()` refuse `status = 'approved'` si :

1. **`coder_kind = 'automated'`** — une veille ou une assistance IA prépare, elle ne publie pas ;
2. **la preuve est incomplète** — `stance`, `excerpt`, `coding_rationale`, `primary_source_id`
   et `source_date` sont tous obligatoires. Une position approuvée sans extrait ni source n'est
   pas vérifiable, c'est-à-dire sans valeur ;
3. **aucune relecture `approve` par un relecteur ≠ codeur** — `reviewer_id <> coder_id` est la
   condition d'indépendance ; sans elle, « relu » ne veut rien dire.

`public.enforce_release_only_approved()` refuse par ailleurs l'entrée d'un brouillon dans une
release, et `public.enforce_release_immutability()` gèle une release dès sa publication.

Ces quatre règles sont vérifiées par les tests SQL 14, 15 et 16
(`supabase/tests/data_platform.test.sql`), qui échouent notamment si une position codée
automatiquement peut être approuvée, ou si un codeur peut approuver sa propre position.

---

## 4. Ce que le public peut lire

Une seule surface : la vue `public.published_candidate_positions`, filtrée sur
`status = 'approved'` **et** release publiée sur le canal `production`.

La policy RLS de `candidate_positions` applique **la même condition** : la vue n'est pas la
sécurité, elle est la commodité. Test 16 : `anon` ne voit aucune position non approuvée.

---

## 5. Plan de migration des candidats

L'objectif n'est pas de tout basculer d'un coup — c'est le meilleur moyen de casser le site.
Supabase devient la **source de vérité**, le fichier statique devient un **artefact de
publication**.

```
Supabase (release publiée, immuable)
        │
        ▼  npm run snapshot:candidates      (scripts/build-candidate-snapshot.mjs)
src/data/generated/candidate-positions.json   ← versionné, commité
        │
        ▼  build Vite
bundle                                        ← fonctionne même si Supabase est indisponible
```

### Étapes, dans l'ordre

| # | Étape | Condition de passage |
|---|---|---|
| 1 | Appliquer les migrations sur une **branche Supabase** | `npm run test:migrations` vert |
| 2 | Peupler `candidates` / `elections` depuis `candidateRegistry.js` (identité seule, pas de score) | comptes identiques entre fichier et base |
| 3 | Saisir les **sources** des candidats déjà travaillés (Lisnard, Attal, Roussel — cf. commits récents) | chaque source a une date et une URL d'archive |
| 4 | Coder les positions, question par question, avec extrait et raisonnement | statut `coded` |
| 5 | Relecture indépendante | statut `approved` |
| 6 | Créer et publier une release `candidates-AAAA-MM-JJ` | vue publique non vide |
| 7 | `npm run snapshot:candidates`, commiter le JSON | `npm run check:snapshot` vert en CI |
| 8 | Basculer `candidateMatch.js` sur le snapshot, **candidat par candidat** | tests de matching inchangés pour les autres |
| 9 | Retirer les scores manuels de `elections.js` **une fois le candidat entièrement sourcé** | `npm test` vert |

**Règle de bascule** : un candidat ne quitte `elections.js` que lorsqu'il a une position
approuvée pour **chacune** des questions qui pèsent dans le matching. Un candidat à moitié
migré donnerait un score calculé sur un sous-ensemble arbitraire — pire que le statu quo.

### Pourquoi un snapshot plutôt qu'un appel à l'exécution

- le site survit à une panne Supabase (le JSON est dans le bundle) ;
- un résultat de matching reste **reproductible** des mois plus tard, condition de toute
  défense méthodologique ;
- il n'y a plus deux endroits où corriger une position — c'était la cause des divergences
  entre la page Profil et la page Élection.

Le script lit avec la clé **`anon`**, délibérément : il vérifie ainsi exactement ce que le
public peut lire. Utiliser `service_role` « pour être sûr de tout voir » masquerait une RLS mal
configurée au lieu de la révéler.

### Comportement dégradé, voulu

Sans variables d'environnement, ou si Supabase est injoignable, le script **ne fait rien** et
sort en succès : le snapshot commité fait foi et le build continue. Une release publiée
incohérente (deux releases production simultanées) le fait en revanche **échouer** plutôt que
produire un snapshot moitié-moitié.
