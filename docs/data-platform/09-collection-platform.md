# Plateforme de collecte — schéma, consentements, rétention

**État au 2026-08-10.** Tout ce qui suit est **écrit et testé dans le dépôt**, et **rien n'est
appliqué en production** (voir `11-production-connection.md` pour la raison exacte).

Ce document décrit ce qui est réellement implémenté. Il ne décrit pas une cible : les fichiers
cités existent, les contraintes citées sont vérifiées par `npm run test:migrations`.

---

## 1. Vue d'ensemble

```
Navigateur                    Edge Function                    Postgres
──────────                    ─────────────                    ────────
questionTiming.js  ─┐
mutationQueue.js   ─┼─ POST ─►  ingest/       ─ service_role ─►  private.*
consent.js         ─┘          (validation,                     (RLS forcée,
                                CORS, débit)                     aucune policy)
                                                                     │
FounderDashboard  ◄── RPC admin_* (is_founder_admin) ────────────────┘
```

Deux principes structurent l'ensemble :

1. **Le schéma `private` n'est pas exposé par PostgREST** (`supabase/config.toml`). Il n'existe
   aucune route HTTP vers les tables de collecte. La RLS est une seconde barrière, pas la
   première.
2. **Le consentement est vérifié deux fois** : dans le client (`canTransmitPoliticalData()`) et
   dans la base (`private.has_consent()`). Un frontend se contourne ; une fonction Postgres non.

---

## 2. Schéma final

### 2.1 Schéma `private` — collecte (jamais exposé)

| Table | Rôle | Points notables |
|---|---|---|
| `consent_records` | Journal **append-only** des décisions | UPDATE/DELETE bloqués par trigger. Une révocation = une nouvelle ligne. |
| `quiz_attempts` | Une passation | Aucun User-Agent, aucune IP. Rattachement à un compte impossible sans `link_consent_id`. |
| `quiz_responses` | Une ligne par (passation, question) | `response_state` porte l'état ; « sans opinion » n'est **jamais** une ligne absente. |
| `question_reports` | Signalements réels | Colonnes utilisateur immuables ; colonnes éditoriales modifiables. |
| `ingest_rate_limits` | Compteurs de débit | Clé = haché **salé**, jamais une IP. |
| `retention_policies` | Durées de conservation | Lues par la purge : documenter et appliquer ne peuvent pas diverger. |
| `retention_runs` | Journal des purges | |

**Vue** `private.consent_current` — dernière décision par (sujet, finalité).

#### `quiz_attempts` — colonnes

`id`, `anonymous_session_id`, `user_id` (nullable), `link_consent_id`, `linked_at`,
`questionnaire_version`, `scoring_version`, `mode`, `started_at`, `completed_at`,
`abandoned_at`, `last_activity_at`, `question_count_shown`, `question_count_answered`,
`consent_version`, `client_release`, `language`, `device_category`, `created_at`, `updated_at`.

`device_category` est un énuméré à **trois valeurs** (`mobile` / `tablet` / `desktop`), dérivé de
la largeur de viewport côté client — jamais du User-Agent, qui est un vecteur d'empreinte.

Contrainte `quiz_attempts_link_requires_consent` : `user_id` ne peut être renseigné que si
`link_consent_id` et `linked_at` le sont aussi. **Le rattachement silencieux d'une passation
anonyme à un compte est structurellement impossible**, pas seulement déconseillé.

#### `quiz_responses` — le point central

`attempt_id`, `question_id`, `questionnaire_version`, `response_state`, `answer_value`,
`first_shown_at`, `last_shown_at`, `answered_at`, `active_dwell_ms`, `total_elapsed_ms`,
`dwell_capped`, `presentation_count`, `change_count`, `sequence_index`, `client_updated_at`,
`mutation_id`, `created_at`, `updated_at`.

Quatre états distincts, tous représentables :

| Situation | Ligne | `response_state` | `answer_value` |
|---|---|---|---|
| Jamais vue | aucune | — | — |
| Vue, sans réponse | oui | `null` | `null` |
| « Sans opinion » | oui | `no_opinion` | `null` |
| Répondue | oui | `answered` | 1–5 |

Contraintes imposées **par la base** :

- `quiz_responses_answered_requires_value` : `answered` ⇒ valeur entre 1 et 5 ;
- `quiz_responses_no_opinion_requires_null` : `no_opinion` ⇒ `answer_value IS NULL` ;
- `quiz_responses_value_requires_answered` : une valeur sans état `answered` est refusée ;
- trigger `forbid_no_opinion_delete` : **supprimer un « sans opinion » lève une exception**, sauf
  sous le drapeau de purge (`poliscop.purge`, local à la transaction).

L'énuméré prévoit `dont_know` et `prefer_not_to_answer` pour rester extensible sans migration de
contrainte. **Aucun bouton ne les émet** : le produit n'a qu'un état d'inconnu, par minimisation
et pour ne pas multiplier les boutons sans justification UX.

### 2.2 Schéma `public` — éditorial (exposé, RLS restrictive)

`candidates`, `elections`, `election_candidates`, `candidate_election_status`, `sources`,
`program_documents`, `candidate_positions`, `candidate_position_sources`,
`candidate_position_reviews`, `candidate_position_revisions`, `publication_releases`,
`publication_release_positions`, plus la vue `published_candidate_positions`.

Détail complet et workflow : `10-editorial-workflow.md`.

---

## 3. Consentements et finalités

Quatre finalités **distinctes**, chacune avec sa case, non précochée, révocable
(`src/lib/consent.js`) :

| Finalité | Ce qu'elle autorise | Conservation annoncée |
|---|---|---|
| `measurement` | Audience : écrans, étapes, compteurs. **Aucun contenu politique.** | 13 mois |
| `political_analytics` | Réponses anonymes, temps par question, données de passation. | 25 mois |
| `cloud_save` | Sauvegarde personnelle rattachée au compte. | durée de vie du compte |
| `research` | Réutilisation scientifique ultérieure. | 25 mois |

**Règles tenues par le code, pas par la documentation :**

- l'état vierge vaut `null` pour les quatre — *non décidé*, distinct de *refusé*, et n'autorise
  rien (`tests/lib/consent-gating.test.mjs`) ;
- seul un `true` **strict** ouvre : ni `1`, ni `'yes'`, ni un objet ;
- `research` n'est **jamais déduite** d'une autre acceptation — même lors de la migration depuis
  l'ancien modèle à deux champs ;
- accepter la mesure d'audience n'autorise pas la collecte politique, et réciproquement ;
- chaque décision est enregistrée avec sa **version de politique** et l'**empreinte du texte
  exact** accepté (`text_hash`). Sans le hash, « version 2026-08 » est invérifiable a posteriori.

### Deux identifiants pseudonymes, jamais un seul

| Clé locale | Finalité | Créé quand |
|---|---|---|
| `poliscop_anon_id` | `measurement` | à l'acceptation de la mesure |
| `poliscop_analytics_sid` | `political_analytics` | à l'acceptation de l'analyse |

Les réunir relierait le parcours de navigation aux opinions : le traceur d'audience deviendrait
rétroactivement un traitement de données de l'**article 9** du RGPD. Deux finalités, deux
identifiants, deux consentements. Chacun est **effacé** au retrait de sa finalité.

---

## 4. Données collectées / volontairement non collectées

### Collectées (sous `political_analytics`)

Identifiant de session pseudonyme, mode, versions (questionnaire, scoring, consentement,
client), langue, catégorie d'appareil (3 valeurs), horodatages de passation, compteurs de
questions, et par question : état de réponse, valeur 1–5, temps actif, temps total, nombre de
présentations, nombre de modifications, position dans la file.

### Volontairement **non** collectées

| Donnée | Pourquoi |
|---|---|
| User-Agent brut | Vecteur d'empreinte de terminal. Aucune fonctionnalité n'en dépend. |
| Adresse IP | Jamais persistée, sous aucune forme. Le seau de débit stocke un haché **salé** tronqué. |
| Referrer, URL d'origine | Une URL porte des paramètres, donc potentiellement des données personnelles. L'écran d'origine est une valeur d'une **liste fermée**. |
| Démographie dans la collecte | Croisée avec l'opinion, elle rendrait le traitement massivement ré-identifiant. |
| Géolocalisation, code postal | Idem. |

Ces absences sont **testées**, pas promises : `tests/data/data-platform-manifest.test.mjs`
(« aucune colonne de User-Agent ou d'IP ») et le test SQL 23 échouent si une telle colonne
apparaît un jour dans `private`.

Le flux d'audience préexistant (`src/lib/analytics.js`) reste soumis à son allowlist par
événement : il ne transporte ni réponse, ni question, ni thème, ni candidat.

---

## 5. Durées de conservation

Déclarées dans `private.retention_policies`, **lues** par `private.run_retention()` : documenter
et appliquer ne peuvent pas diverger.

| Classe | Durée | Action | Justification (résumé) |
|---|---|---|---|
| `attempt_timing_detail` | 6 mois | **redact** | Horodatages fins = granularité la plus ré-identifiante. Six mois suffisent à corriger l'ergonomie ; l'état de réponse survit. |
| `abandoned_attempts` | 90 jours | delete | Passation jamais terminée : rien ne justifie de garder un parcours partiel au-delà du trimestre. |
| `quiz_responses` | 25 mois | delete | Un cycle électoral complet (présidentielle 18/04/2027 + rétrospective), aligné sur le plafond CNIL de 25 mois. |
| `question_reports` | 12 mois après résolution | **redact** | Le commentaire libre part ; catégorie, question et statut restent (non ré-identifiants, utiles au pilotage). |
| `technical_logs` | 24 heures | delete | Compteurs de débit : utilité opérationnelle en minutes. |
| `consent_records` | 36 mois après la dernière décision | delete | Preuve (art. 7 §1). Conservée **plus longtemps** que ce qu'elle autorise : détruire la preuve avant la donnée rendrait le traitement indéfendable. |

Aucune conservation illimitée. `tests/data/data-platform-manifest.test.mjs` échoue si une
finalité annonce plus de 36 mois ou aucune durée sans être adossée à un compte.

**Activation** : `select private.run_retention();` en tâche quotidienne (`pg_cron`). Tant que la
tâche n'est pas planifiée, les durées sont déclarées mais **pas appliquées** — c'est un point de
la checklist de mise en production.

---

## 6. RLS et privilèges

### `private` — fermeture totale

- `usage` sur le schéma **révoqué** à `anon` et `authenticated` ;
- chaque table : `enable` **et** `force row level security`, **aucune policy** ⇒ personne ne lit,
  même avec un GRANT (`force` couvre aussi le propriétaire de la table) ;
- GRANT uniquement à `service_role` ;
- `alter default privileges … revoke all from public` : les objets créés plus tard sont fermés
  eux aussi.

### Fonctions

| Fonction | `anon` | `authenticated` | `service_role` |
|---|---|---|---|
| `private.ingest_*`, `private.record_consent`, `private.has_consent`, `private.check_rate_limit` | ✗ | ✗ | ✓ |
| `public.ingest_v1`, `public.ingest_rate_limit_v1` | ✗ | ✗ | ✓ |
| `public.admin_*` (6 RPC) | ✗ | ✓ *(appel)* | ✓ |
| `private.run_retention` | ✗ | ✗ | ✓ |

Le GRANT à `authenticated` sur les `admin_*` ouvre **l'appel**, jamais la donnée : chaque
fonction commence par `if not public.is_founder_admin() then raise`. Les deux barrières sont
vérifiées séparément (test SQL 13 : un compte non administrateur reçoit un refus).

`revoke all … from public` précède systématiquement chaque GRANT — PostgreSQL accorde `EXECUTE`
à `public` par défaut sur toute fonction nouvellement créée. C'est exactement la faille corrigée
en 2026-08-09 sur les RPC `founder_*` ; elle n'est pas réintroduite.

### `public` éditorial

Lecture publique de `candidates`, `elections`, `election_candidates`. Les `candidate_positions`
ne sont lisibles que si `status = 'approved'` **et** rattachées à une release publiée sur le
canal production. `program_documents`, `candidate_election_status`, `candidate_position_sources`,
`_reviews` et `_revisions` n'ont **aucune policy** : invisibles pour un client. Ce sont des
données de travail éditorial (relectures nominatives, notes internes, brouillons).

---

## 7. Protocole de mesure du temps

`src/lib/questionTiming.js`. Le détail du raisonnement est dans `12-timing-protocol.md`.

En résumé : horloge **monotone** (`performance.now()`), pause sur onglet caché **et** sur modale
couvrante, cumul au retour arrière, résistance au double montage de React Strict Mode, aucune
durée négative, plafond à 10 minutes avec **marquage** (`dwell_capped`) plutôt que suppression.

Temps **actif** et temps **total** sont conservés séparément : leur écart révèle l'onglet
laissé ouvert, qu'une seule des deux valeurs ne permettrait pas de distinguer d'une question
difficile.

Les analyses exposées (`public.admin_question_health`) sont des **percentiles** — p25, médiane,
p75, p90 — et non des moyennes : un seul onglet oublié déplace une moyenne de plusieurs minutes
et ne déplace pas une médiane.

---

## 8. Fonctionnement hors ligne

`src/lib/mutationQueue.js` et `src/lib/questionReports.js`.

- **Réponses** : mises en file, persistées dans `localStorage`, jamais envoyées hors ligne, et
  rejouées au retour du réseau (`online`) ou au chargement suivant. Une mutation en attente
  survit à un rechargement de page.
- **Signalements** : conservés dans une file locale bornée (50), et l'interface affiche
  « le signalement sera envoyé lorsque la connexion reviendra » — **jamais** un faux succès.
- **Fermeture de page** : `sendBeacon` en dernière tentative. Son retour signifie « le navigateur
  a accepté de mettre en file », **pas** « le serveur a reçu » — d'où le nom `flushOnUnload` qui
  retourne `queued` et non `sent`, et aucune promesse affichée à l'utilisateur.

Ordre et idempotence : voir `13-ingestion.md` §3.
