# Ingestion anonyme — Edge Function, contrôles et fiabilité

Implémentation : `supabase/functions/ingest/index.ts`, validation partagée dans
`supabase/functions/_shared/protocol.js`. Tests : `tests/lib/ingest-protocol.test.mjs` (21),
`tests/lib/mutation-queue.test.mjs` (12), tests SQL 1–9 et 22.

---

## 1. Pourquoi une Edge Function plutôt qu'un accès direct

Le schéma `private` n'est pas exposé par PostgREST : il n'existe **aucune** route HTTP vers les
tables de collecte. L'écriture passe donc par une fonction qui détient la clé `service_role` —
laquelle ne quitte jamais l'environnement de la fonction.

Le frontend POSTe une enveloppe :

```json
{ "protocol_version": 1, "type": "responses", "payload": { … } }
```

Quatre types, et quatre seulement : `consent`, `attempt`, `responses`, `report`.

---

## 2. `verify_jwt = false` et ses contreparties

Un visiteur non connecté n'a pas de JWT, et l'essentiel des passations est anonyme :
la vérification doit être désactivée. **Elle n'est pas désactivée sans contrepartie.** Les sept
contrôles qui la remplacent :

| # | Contrôle | Où | Comportement en cas d'échec |
|---|---|---|---|
| 1 | Méthode `POST` + origine dans une **liste blanche** | Edge Function | 403, aucun en-tête CORS. Jamais de `*`. |
| 2 | Taille du payload, mesurée **en octets** avant désérialisation | Edge Function | 413 |
| 3 | Version de protocole exacte | `protocol.js` | 422 |
| 4 | **Allowlist** des types et des champs | `protocol.js` | 422 |
| 5 | Limitation de débit par fenêtre | `private.check_rate_limit` | 429 |
| 6 | Consentement **revérifié en base** | `private.has_consent` | 403 `consent_required` |
| 7 | `service_role` lue depuis l'environnement | Edge Function | 503 si absente |

**Fail-closed partout.** Si le compteur de débit est inaccessible, la requête est **refusée**
(503) et non acceptée : accepter « pour ne pas perdre de données » supprimerait la protection
précisément au moment où elle sert. De même, la fonction refuse de démarrer sans
`POLISCOP_RATE_LIMIT_SALT`, parce qu'un haché d'IP non salé est réversible par force brute sur
l'espace IPv4 — donc une IP stockée.

### Liste blanche, jamais liste noire

Un champ non déclaré est **retiré** ; un type non déclaré est **refusé**. Une denylist finit
toujours par oublier un champ — c'est l'erreur que `src/lib/analytics.js` a déjà commise une
fois, avec 19 des 27 fonctions qui contournaient le filtre.

En complément, une courte liste de champs **formellement interdits** (`user_agent`, `ip`,
`referrer`, `fingerprint`, `postal_code`…) fait échouer le payload **entier**, y compris
imbriqué. On veut le savoir, pas le nettoyer en silence : un client qui tente d'envoyer un
User-Agent signale un bug ou une tentative.

> **Une régression réelle attrapée par ces tests** : `VALIDATORS[type]` avec
> `type = "__proto__"` renvoyait un objet hérité *truthy mais non appelable*. La fonction
> plantait en 500 au lieu de refuser proprement en 422. Corrigé par `Object.hasOwn` +
> contrôle de type ; le test « un type d'événement non déclaré est refusé » le couvre.

### CORS et `sendBeacon`

Le beacon de fin de page envoie un Blob `text/plain`, **pas** `application/json` : `text/plain`
est un type sûr au sens CORS, donc sans requête préliminaire. Un Blob `application/json` en
déclencherait une, et `sendBeacon` est incapable d'en émettre pendant le déchargement de la
page — l'envoi échouerait systématiquement et silencieusement. L'Edge Function lit le corps en
texte puis le désérialise ; elle ne se fie pas à l'en-tête.

---

## 3. Ordre, idempotence, hors ligne

`src/lib/mutationQueue.js` remplace l'`upsert` indépendant tiré à chaque clic. Les quatre
défauts de ce modèle, et leur correctif :

| Défaut | Correctif | Test |
|---|---|---|
| Deux requêtes concurrentes se terminent dans un ordre arbitraire : la plus **ancienne** peut arriver en dernier et écraser le dernier choix | Un seul envoi en vol ; côté base, `where excluded.client_updated_at > stored.client_updated_at` | SQL 5, JS « un seul envoi en vol » |
| Hors ligne, l'écriture échoue et la réponse est **perdue sans que rien ne l'indique** | File persistée dans `localStorage`, rejouée au retour du réseau ; erreur exposée par `getStatus().lastError` | JS « hors ligne », « survit à un rechargement » |
| Un rejeu réseau applique **deux fois** la même écriture | `mutation_id` unique + index unique en base ; un rejeu porte le **même** identifiant | SQL 6, JS « un rejeu porte le même mutation_id » |
| Le profil enregistré ne correspond pas à l'état de réponses envoyé | Une seule file, un seul ordre | — |

### Le point subtil : l'échec ne doit pas ressusciter une valeur périmée

Quand un envoi échoue, ses mutations retournent en file — **sauf** si une saisie plus récente
est arrivée pour la même question pendant le vol. Sans ce test, un échec réseau ferait
réapparaître une réponse périmée par-dessus le dernier choix de l'utilisateur : exactement le
défaut que cette file existe pour corriger. Test : « un échec ne ressuscite PAS une réponse
périmée ».

### Coalescence

Une nouvelle réponse à la même question **remplace** celle en attente. Les hésitations ne
gonflent donc pas la file, et c'est bien le dernier choix qui part. Les compteurs
(`change_count`, `presentation_count`) sont portés par le chronomètre, pas par le nombre de
mutations — l'information n'est pas perdue.

### Fermeture de page

`sendBeacon` en dernière tentative. Son retour signifie **« le navigateur a accepté de mettre en
file »**, pas « le serveur a reçu ». La méthode s'appelle `flushOnUnload` et retourne `queued` ;
aucune interface n'affiche de confirmation sur cette base.

---

## 4. Signalements de questions

**Avant** : `handleReportSubmit` faisait `setReportSent(true)` — aucun appel réseau, aucun
stockage. « Votre signalement a été pris en compte » s'affichait pour 100 % des utilisateurs, et
0 % des signalements existait ensuite où que ce soit.

**Maintenant** (`src/lib/questionReports.js`), trois issues distinctes :

| Issue | Condition | Message affiché |
|---|---|---|
| `sent` | réponse serveur **positive** (`ok === true`) | « Votre signalement a bien été enregistré. » |
| `queued` | hors ligne, panne réseau, backend absent, ou réponse ambiguë | « Le signalement sera envoyé lorsque la connexion reviendra. » |
| `failed` | refus **définitif** (payload invalide) | « Envoi impossible… Vous pouvez réessayer. » |

Une réponse ambiguë (`ok !== true` sans erreur) vaut `queued`, jamais `sent` : dans le doute, on
conserve. Un refus définitif n'est pas remis en file — le rejouer échouerait indéfiniment.

Un signalement ne transporte **aucune réponse au questionnaire** : ni valeur, ni état, ni thème,
ni profil. C'est un retour sur le *contenu* du questionnaire, pas une opinion — d'où l'absence
de barrière de consentement sur ce type. Test : « un signalement ne transporte AUCUNE réponse ».

---

## 5. Variables d'environnement de la fonction

| Variable | Obligatoire | Rôle |
|---|---|---|
| `SUPABASE_URL` | ✅ | — |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Écriture dans `private`. **Jamais côté client.** |
| `POLISCOP_RATE_LIMIT_SALT` | ✅ | Sel du haché de débit. Sans lui, la fonction refuse de démarrer. |
| `POLISCOP_ALLOWED_ORIGINS` | — | Liste blanche CORS. Défaut : domaines Poliscop + localhost. |
| `POLISCOP_RATE_LIMIT_MAX` | — | Défaut 120 par fenêtre. |
| `POLISCOP_RATE_LIMIT_WINDOW` | — | Défaut 60 s. |

Côté frontend, seules `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY` sont utilisées.
`tests/data/data-platform-manifest.test.mjs` échoue si une clé de service apparaît dans `src/`
ou dans `.env.example`.
