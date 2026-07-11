# Chantier 1, Étape 5 — Tests et vérification RGPD

Date : 2026-07-11. Périmètre : les 7 parcours listés dans la mission, plus une
vérification indépendante de l'absence de transmission involontaire.

## Contrainte d'environnement (rappel de 01-cartographie-flux-donnees.md)

Le projet Supabase actuellement lié à ce dépôt (`xjpzqaqzoygcwtcpumfo`) est
inactif et injoignable (timeout confirmé via l'outil MCP Supabase, `list_tables`
n'a jamais répondu). Conséquence directe pour cette étape : **aucun parcours
nécessitant un aller-retour réseau réel vers Supabase n'a pu être exécuté
en conditions réelles** (création de compte, connexion, écriture/lecture de
`user_consents`, `user_answers`, etc.). Ces parcours ont été vérifiés par
relecture de code ciblée à la place, avec la limite explicitement indiquée
ci-dessous pour chacun. Le parcours invité (sans compte), lui, ne dépend
d'aucun réseau — il a été testé en conditions réelles dans le navigateur.

## 1. Absence de compte (invité)

**Testé en conditions réelles**, navigateur Chrome embarqué, serveur de dev
local (`npm run dev`) :
- Quiz complété partiellement (3 réponses réelles, cliquées) → profil calculé
  et affiché correctement sur `/profile`.
- Bouton d'action visible : `☁ Connexion` (pas de bouton `Enregistrer`) —
  cohérent avec `user` absent.
- Aucune erreur console sur `/`, `/test`, `/quiz`, `/profile`, `/auth`,
  `/privacy`, `/transparency`.
- Aucun appel réseau vers Supabase déclenché par la saisie de réponses —
  confirmé architecturalement : le chemin d'écriture `anonymous_answers` a
  été supprimé du code (Étape 2, commit `dc1cf04`), pas seulement désactivé.
  `localStorage['poliscop_state']` contient bien les réponses ; c'est la
  seule copie qui existe.

**Résultat : conforme.** Un visiteur qui ne crée pas de compte ne peut, par
construction du code, transmettre aucune réponse politique au serveur.

## 2. Compte sans consentement

**Vérifié par relecture de code** (non testable en direct — nécessite un
compte réel via Supabase Auth, injoignable) :
- `saveAnswers()`, `saveUserProfile()`, `saveProfileMeta()` dans `auth.jsx`
  vérifient chacune `hasPoliticalDataConsent()` immédiatement après le garde
  `isSupabaseEnabled`/`user`, et retournent avant tout appel Supabase si le
  consentement n'est pas `true`.
- `smartSync()` (déclenché automatiquement à la connexion) a le même garde.
- L'effet de sauvegarde automatique dans `App.jsx` ne déclenche même plus
  l'appel : `if (!isAuthenticated || !profile || !hasConsent) return;`
  (évite un appel réseau inutile *et* le toast « Erreur » trompeur qui
  serait sinon montré à quelqu'un ayant délibérément refusé).
- Les événements analytics porteurs d'opinion (`trackQuestionAnswered`,
  `trackProfileViewed`, etc.) passent par `trackIfConsented()`, qui vérifie
  `_politicalDataConsent` — `false` par défaut, y compris pendant la fenêtre
  de réhydratation asynchrone du store au chargement de la page (voir § 6).

**Résultat : conforme selon la relecture.** Point non couvert par un test en
conditions réelles : confirmé par relecture uniquement.

## 3. Compte avec consentement

**Vérifié par relecture de code** (même limite que ci-dessus) :
- Le clic sur « J'accepte la sauvegarde en ligne » dans `ConsentModal`
  appelle `setConsent(true)`, qui met à jour l'état local *et* appelle
  `setAnalyticsConsent(true)` dans le même tick.
- `handleConsentDecided(true)` dans `Profile.jsx` déclenche ensuite
  immédiatement `performCloudSave()` — l'utilisateur n'a pas besoin de
  recliquer sur « Enregistrer » après avoir donné son accord.
- `grantConsent()` dans `auth.jsx` écrit la ligne `user_consents` côté
  serveur (`upsert`, clé `user_id + consent_type`).
- Politique RLS de `user_answers`/`user_profiles`/`user_consents` (toutes
  dans `schema.sql`/`schema_v3.sql`) : `USING (auth.uid() = user_id)` — un
  utilisateur authentifié ne peut lire/écrire que ses propres lignes.

**Résultat : conforme selon la relecture.**

## 4. Retrait du consentement

**Vérifié par relecture de code** :
- `revokeConsent()` (bouton « Retirer mon accord » dans `DataControlsModal`)
  met `consent.politicalData` à `false` localement et pousse `granted: false`
  dans `user_consents` (conservé comme preuve d'audit, pas supprimé).
- `setAnalyticsConsent(false)` coupe immédiatement le tracking porteur
  d'opinion, dans le même tick.
- Ne supprime pas les données déjà enregistrées — comportement voulu et
  documenté dans le composant (« Delete my data » est une action séparée).

**Résultat : conforme selon la relecture.**

## 5. Suppression

**Vérifié par relecture de code** :
- `deleteMyData()` supprime `user_answers`, `user_profiles` et
  `user_demographics` pour le compte (RLS déjà correctement scopée à
  `auth.uid()` sur les trois tables — aucune migration supplémentaire requise
  pour que ceci fonctionne sur un projet actif).
- Appelle ensuite `revokeConsent()` — plus rien à consentir une fois les
  données supprimées.
- L'étape de confirmation dans `DataControlsModal` énonce explicitement les
  conséquences avant l'action (irréversible, ne touche pas l'appareil local)
  — voir Étape 4.
- Ne supprime pas le compte Supabase Auth (email/identifiants) — limite
  documentée, hors de portée d'un client sans clé `service_role` ; utilisateur
  redirigé vers `contact@poliscop.org`.

**Résultat : conforme selon la relecture**, sous réserve de la limite
documentée sur la suppression de compte elle-même.

## 6. Absence de transmission involontaire

Vérification à deux niveaux, délibérément menées indépendamment l'une de
l'autre pour maximiser les chances de détecter un angle mort : relecture
ciblée par l'auteur de cette étape (ci-dessous), et audit exhaustif par
sous-agent de chaque appel d'écriture Supabase du dépôt
(`insert`/`upsert`/`update`/`rpc`), rapporté plus bas.

Points vérifiés directement par l'auteur de cette étape :
- **Race condition au chargement de page** : `analytics.js` initialise
  `_politicalDataConsent = false` de façon synchrone au chargement du module,
  *avant* que le middleware `persist` de Zustand n'ait fini de réhydrater
  l'état depuis `localStorage` (opération asynchrone). Le hook
  `onRehydrateStorage` ne positionne le flag à sa vraie valeur qu'une fois la
  réhydratation terminée. Fenêtre de course possible : un utilisateur déjà
  consentant qui répondrait à une question avant la fin de la réhydratation
  verrait cet événement précis non transmis (sous-comptage analytique mineur).
  Dans l'autre sens — transmettre alors que le consentement réel est `false`
  — impossible par construction : le défaut est fermé (*fail-closed*). C'est
  la seule direction qui compte pour la conformité RGPD.
- **`mergeAnonymousAnswers()`** (`lib/anonymous.js`) : son unique point
  d'appel (`auth.jsx`, événement `SIGNED_IN`) est gardé par
  `if (hasPoliticalDataConsent())`. Elle est de toute façon rendue inopérante
  en pratique par deux mécanismes indépendants : (a) `anonymous_answers`
  n'est plus jamais écrite depuis l'Étape 2 (le chemin d'écriture a été
  supprimé, pas juste désactivé) — donc rien à fusionner pour toute session
  anonyme créée après ce correctif ; (b) `schema_v5_privacy.sql` retire tout
  droit `SELECT` sur `anonymous_answers`, donc même d'anciennes lignes ne
  seraient plus lisibles une fois cette migration appliquée. Sans danger de
  laisser ce code en l'état (échoue silencieusement), mais fonctionnellement
  mort pour toute nouvelle donnée — signalé ici pour information, pas comme
  un correctif à appliquer maintenant.
- **`initAnonymousSession()`** (fire-and-forget à chaque chargement) : écrit
  `{ id, last_seen_at, device: navigator.userAgent, lang }` dans
  `anonymous_sessions` — aucune opinion politique dans ce payload, gating non
  nécessaire. Confirmé par lecture directe du fichier.
- **`SyncConflictModal.jsx`** : appelle `saveAnswers(answers)` sans vérifier
  lui-même le consentement. Sûr quand même *par construction* : ce composant
  ne peut apparaître que si `syncConflict` est non nul, et `setSyncConflict()`
  n'est appelé qu'à l'intérieur de `smartSync()`, *après* son propre garde
  `hasPoliticalDataConsent()` (`auth.jsx`, ligne ~36). Un utilisateur sans
  consentement n'atteint donc jamais cet écran. Pas un bug, mais une
  dépendance implicite à documenter : si `smartSync()` était un jour modifié
  pour appeler `setSyncConflict()` avant son garde de consentement, ce
  composant deviendrait une brèche silencieuse. À garder à l'esprit pour
  toute future modification de `smartSync()`.

### Audit indépendant par sous-agent (recherche exhaustive de tous les appels d'écriture)

Un sous-agent a recherché systématiquement tous les appels `.insert(`,
`.upsert(`, `.update(`, `.rpc(` du dépôt (14 sites au total, aucun `.update(`
n'existe nulle part) et remonté chacun à son déclencheur réel, plutôt que de
se fier aux commentaires du code. Confirmations et écart trouvé :

**Confirmé conforme**, indépendamment de la relecture ci-dessus : les 11
autres sites d'écriture (`user_answers`, `user_profiles`, `user_consents` —
tous les chemins — et les 7 événements `events` porteurs d'opinion listés en
§ 1 de `01-cartographie-flux-donnees.md`) sont soit correctement gardés par
`hasPoliticalDataConsent()`/`trackIfConsented()`, soit ne portent aucune
opinion par nature (écriture du consentement lui-même, heartbeat de session
anonyme, lectures RPC agrégées du tableau de bord fondateur).

**Écart réel trouvé, corrigé dans la foulée** : `saveDemographics()`
(`auth.jsx`) et son jumeau analytique `trackDemographicsCompleted()`
(`analytics.js`) n'avaient **aucun garde de consentement**, alors qu'ils
écrivent genre/tranche d'âge/commune/emploi/études/code postal liés à
`user_id` — déclenchés automatiquement dès l'ouverture d'`OnboardingModal`
(y compris en cliquant « Passer », qui écrivait quand même une ligne de
valeurs nulles). Prises isolément, ces données ne sont pas une catégorie
particulière au sens de l'article 9 RGPD — mais le texte même du modal
d'onboarding et les répartitions `byGender`/`byCommune` du tableau de bord
fondateur montrent qu'elles sont précisément collectées pour être croisées
avec les opinions politiques : le traitement croisé rend l'ensemble sensible
même si aucun champ pris seul ne l'est. Corrigé dans ce même commit :
- `saveDemographics()` vérifie désormais `hasPoliticalDataConsent()` et
  n'écrit rien sans consentement (échec silencieux, même logique que
  `saveProfileMeta()` — ne bloque pas le flux d'onboarding).
- `trackDemographicsCompleted()` passe par `trackIfConsented()` au lieu de
  `track()` direct.
- Le texte d'`OnboardingModal` a été rendu conditionnel : il annonce
  désormais correctement que rien n'est envoyé au serveur tant que le
  consentement politique n'a pas été donné, plutôt que d'affirmer
  inconditionnellement que les données « restent liées à ton compte ».

Cet écart n'a pas été détecté lors de la relecture manuelle initiale
(Étapes 2-4) parce que l'attention portait sur les données d'opinion
politique elles-mêmes (réponses, profil, archétype) — la donnée
démographique n'avait pas été reconsidérée sous cet angle avant cet audit
croisé. C'est exactement le type d'angle mort qu'une seconde vérification
indépendante est censée attraper ; conservé ici tel quel plutôt que
minimisé.

## 7. Comportement en cas d'échec Supabase

**Vérifié par relecture de code, et confirmé empiriquement** : cette session
entière de tests navigateur s'est déroulée avec `isSupabaseEnabled = true`
(variables d'environnement renseignées) mais un backend injoignable — soit
exactement le scénario « échec Supabase » du début à la fin. Aucun blocage
observé : l'application a chargé, le quiz a fonctionné, le profil s'est
affiché, aucune boucle de chargement infinie.

Explication trouvée dans le code :
- `loading` (état interne de `AuthProvider`, censé refléter la vérification
  initiale de session) n'est **consommé nulle part** dans l'application —
  vérifié par recherche exhaustive de tous les appels `useAuth()`. Même bloqué
  indéfiniment, il ne peut rien geler.
- Dans les deux points d'entrée (`getSession().then(...)` et
  `onAuthStateChange`), `setUser(u)` s'exécute *avant* les appels réseau
  potentiellement bloquants (`syncConsentFromServer`, `smartSync`) — l'état
  « connecté » de l'interface ne dépend donc jamais de la réussite de ces
  appels annexes.
- Les fonctions Supabase de ce dépôt utilisent presque partout le pattern
  `{ data, error }` (jamais d'exception levée pour une erreur applicative) ;
  les erreurs réseau réelles (rejet de promesse) ne sont pas systématiquement
  entourées d'un `try/catch`, mais restent des rejets de promesses non
  gérées — invisibles pour React, qui ne les traite pas comme des erreurs de
  rendu. Le résultat observé est une dégradation silencieuse et sûre, jamais
  un plantage.

**Résultat : conforme, avec confirmation empirique** (contrairement aux
sections 2 à 5, ce point a pu être réellement observé en conditions de panne
tout au long de cette session, pas seulement déduit du code).

## Build et tests de régression

Exécutés après chaque commit de ce chantier (Étapes 2, 3, 4) :
- `npm run build` : succès à chaque fois, seul avertissement pré-existant
  (chunk principal > 500 kB, sans lien avec ce travail).
- Les 4 tests de régression (`audit/poliscope-full-audit/proposed-tests/`) :
  PASS à chaque exécution — déterminisme, indépendance à l'ordre des clés,
  protection contre poids nuls, monotonie. Ces tests couvrent le moteur de
  scoring/matching, pas le nouveau code de consentement (aucun framework de
  test n'est configuré dans ce dépôt — voir CLAUDE.md — donc pas de test
  automatisé dédié au nouveau code ; la vérification de ce dernier repose sur
  la relecture de code et les tests navigateur en direct décrits ci-dessus).

## Limite globale à retenir

Les sections 2 à 5 (tout ce qui nécessite un compte réel) n'ont pas pu être
exercées de bout en bout contre un vrai backend. C'est la même limite que
celle déjà déclarée dans `01-cartographie-flux-donnees.md`, pas une nouvelle
découverte. Elle doit être revérifiée en conditions réelles dès qu'un projet
Supabase actif est disponible, avant toute mise en production — voir le
rapport de synthèse final pour ce point porté comme item bloquant.
