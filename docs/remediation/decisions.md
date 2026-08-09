# Décisions de remise à niveau

Journal des arbitrages non évidents. Une décision qui n'est pas ici n'a pas été prise
consciemment — elle doit être rediscutée.

Date de la campagne : **2026-08-09**.

---

## D-01 · Corriger les identifiants dans les données plutôt qu'ajouter une couche d'alias

**Problème** : `specificQuestions[].positions` utilisait `lepen`/`melenchon` alors que les
candidats `fr_2027` s'appellent `lepen_2027`/`melenchon_2027`. Idem `letta`/`letta_it` et
`diaz`/`diaz_es`.

**Options** : (a) résoudre les alias à l'exécution ; (b) renommer les clés dans les données.

**Retenu : (b)**, plus un registre canonique séparé.
Une couche d'alias à l'exécution masque le défaut au lieu de l'éliminer : le fichier reste
incohérent et le prochain contributeur reproduit l'erreur. Les clés de positions ne sont
persistées nulle part côté utilisateur (`electionAnswers` est indexé par identifiant de
question), donc le renommage n'a aucun impact sur les données existantes.

**Conséquence** : 50 lignes `positions:` modifiées, 0 régression sur les données utilisateurs.
Verrouillé par `tests/data/elections.integrity.test.mjs`.

---

## D-02 · Le registre canonique porte l'identité, pas les scores

`src/data/candidateRegistry.js` est la source de vérité de **qui** est une personne, de son
statut de candidature et de ce qui est publiable à son sujet. Les scores restent pour l'instant
dans `elections.js`.

**Pourquoi ne pas tout déplacer d'un coup** : déplacer les profils exige de les reconstruire
position par position avec sources — c'est un chantier éditorial, pas un refactoring. Créer
dès maintenant deux sources de vérité concurrentes pour les scores aurait été pire que le
statu quo. Les profils existants sont marqués `profileSource: 'legacy-manual-v1'` et ne
reçoivent **aucune** provenance rétroactive inventée.

---

## D-03 · Unifier le veto sur 6 thèmes, y compris pour la page Élection

La page Élection appliquait un veto à 5 thèmes (GLOBAL manquant). L'unification **change les
scores affichés sur cette page** pour les candidats en fort désaccord sur l'axe européen /
souverainiste.

**Assumé** : c'était une divergence, pas une variante voulue. Deux surfaces qui classent
différemment la même personne est un défaut plus grave qu'un déplacement de score.

---

## D-04 · Un thème de poids nul ne peut plus déclencher de veto

Un utilisateur qui met 0 point sur l'immigration voyait quand même son score écrasé par le
veto immigration. Le poids explicite prime désormais : `MATCH_CONFIG.vetoIgnoresZeroWeightThemes`.
Sans cela, la pondération personnalisée était partiellement décorative.

---

## D-05 · Le v1 reste le moteur par défaut ; le v2 existe mais n'est pas activé

`calculateProfileV2()` est implémenté, testé et documenté. Il **n'est pas** branché sur
l'application.

**Pourquoi** : basculer les utilisateurs sur le v2 change tous les scores existants (thèmes
inconnus passant de 50 à « non déterminé », suppression de l'étirement). C'est une décision
produit, avec une communication à prévoir — pas un effet de bord d'un chantier technique.
Le v1 est figé par des tests de caractérisation pour que le basculement, quand il aura lieu,
soit mesurable.

**À trancher** : date de bascule, sort des profils déjà calculés (recalcul ou conservation
en v1 avec mention de version).

---

## D-06 · « Passer » et « sans opinion » ne sont pas distingués

Un seul état d'inconnu, par minimisation des données. Aucun bénéfice produit identifié à
distinguer « je n'ai pas d'avis » de « je ne veux pas répondre », et les distinguer signifierait
enregistrer une information de plus sur un sujet sensible.

Le bouton existait déjà mais ne faisait que sauter la question sans rien enregistrer. Il
enregistre désormais `NO_OPINION`, ce qui permet de compter la couverture et évite de reservir
indéfiniment la même question en mode approfondissement.

---

## D-07 · Le tirage devient reproductible, sans prétendre à l'équivalence

Graine tirée une fois par passation, persistée (`queueSeed`). Mélange par strate de statut
(CORE → PRIMARY → SECONDARY) avec un RNG dérivé de `(graine, thème)`.

**Ce que cela ne fait pas** : rendre les modes 16/32/64 statistiquement équivalents. Cela
demande une calibration psychométrique (`docs/methodology/validation-roadmap.md`). La
reproductibilité en est le prérequis, pas le substitut.

---

## D-08 · Ajouter les candidats manquants au registre, pas au classement

David Lisnard (déclaré le 31 mars 2026, programme officiel structuré), Nicolas Dupont-Aignan,
Nathalie Arthaud, Xavier Bertrand, Bernard Cazeneuve, Ségolène Royal, Dominique de Villepin
(pressenti) entrent au registre avec statut, date et source — **sans profil thématique**.

**Pourquoi ne pas leur écrire huit scores** : ce serait exactement le défaut que l'audit
reproche aux dix profils existants, en pire (aucun travail éditorial antérieur). Ils
apparaissent dans un bloc « Suivis, pas encore comparables » sur la page Élection.

**Priorité éditoriale** : Lisnard d'abord, son programme est le plus codable.

---

## D-09 · Statut d'Éric Zemmour : contradiction laissée ouverte

Le produit le classe `conditional`. Une source secondaire consultée le 2026-08-09 le classe
parmi les personnalités ayant renoncé. **Aucune modification faite** : trancher sur une source
secondaire contredirait la règle de hiérarchie des sources. Marqué `needsHumanReview: true`
et inscrit dans les cas à contrôler du prompt de veille.

---

## D-10 · Mesure d'audience : fail-closed, avec conséquence assumée

Aucun identifiant persistant n'est déposé et aucun événement n'est envoyé tant que la mesure
d'audience n'a pas été positivement acceptée (case décochée par défaut dans `ConsentModal`).

**Conséquence directe** : le tableau de bord fondateur ne recevra de données que des visiteurs
ayant coché la case. Le volume va baisser, nettement. C'est le prix de la conformité par
défaut ; l'inverse — collecter d'abord, demander ensuite — n'était pas défendable pour un
traceur persistant.

---

## D-11 · Aucune dépendance de test ajoutée

Tests écrits pour `node --test` (intégré à Node ≥ 18), avec un loader ESM maison pour les
imports JSON. Ni Vitest, ni jsdom, ni Playwright.

**Pourquoi** : les invariants à protéger — intégrité des données, moteurs de calcul — sont
tous testables sur des fonctions pures. Ajouter un navigateur headless au projet pour cela
aurait coûté plus en maintenance qu'il n'aurait rapporté.

**Conséquence assumée** : pas de test de rendu ni de parcours E2E. Les parcours critiques
listés dans le méga-prompt restent à couvrir — c'est une dette explicite, pas un oubli.

> **Mise à jour 2026-08-09 (contre-audit)** : les parcours sont désormais couverts par 22 tests
> d'INTÉGRATION du store (`tests/integration/session.test.mjs`, doubles `localStorage`/`crypto`,
> toujours sans dépendance ajoutée) et par un garde-fou de terminologie sur les sources. Il
> n'existe toujours aucun test de RENDU — voir D-23.

---

## D-12 · Le tableau de bord refuse l'accès tant que la migration admin n'est pas appliquée

Le PIN est retiré ; l'autorisation passe par `is_founder_admin()` côté Postgres. Cette
fonction n'existe pas encore en production. Le frontend **refuse** l'accès dans ce cas
(`rpc_unavailable`) plutôt que de laisser passer.

> **Mise à jour 2026-08-09 (contre-audit)** : la migration citée à l'origine
> (`schema_v7_admin_security.sql`) n'était pas exécutable — voir D-15. Elle est remplacée par
> `supabase/migrations/20260809120000_admin_authorization.sql`, testée localement.

Fail-closed volontaire : un tableau de bord temporairement inaccessible est un incident
d'exploitation ; un tableau de bord ouvert à tous est un incident de sécurité.

---

# Suite au contre-audit du 2026-08-09

---

## D-13 · « Sans opinion » ne part pas au cloud (solution transitoire assumée)

`user_answers.answer_value` est un `smallint` contraint 1–5. La chaîne `'no_opinion'` y était
envoyée par quatre chemins, faisant échouer l'upsert — et pour les chemins par lot, **tout le
lot**, laissant l'appareil et le cloud silencieusement divergents.

**Retenu : ne synchroniser que les réponses 1–5.** « Sans opinion » reste local. Quand une
réponse passe en « sans opinion », la ligne distante est **supprimée**, pour que le cloud ne
conserve pas une position retirée. Une seule frontière : `src/lib/cloudAnswers.js`.

**Jamais 0, jamais 3.** Encoder l'inconnu comme une valeur du domaine fabriquerait une position.

**Limite assumée** : sur un second appareil, une question « sans opinion » réapparaît comme non
posée. La reprise multi-appareils ne reproduit donc pas fidèlement la passation. La cible
(`response_state` distinct de `answer_value`, expand/contract) est spécifiée dans
`supabase/migrations/20260809T120000_response_state_target.sql` — écrite, non appliquée.

---

## D-14 · Le flux de mesure d'audience ne transporte plus aucune opinion

La case de consentement affirmait qu'aucune réponse politique n'était associée à l'identifiant
du terminal. C'était faux : `trackQuestionAnswered()` passait la valeur de la réponse à
`track()`, qui l'attache au UUID persistant. « Anonyme » ne supprime pas cette association.

**Retenu : séparation totale** (option préférée du contre-audit), pas un troisième consentement.
Le gate `politicalData` d'`analytics.js` est **supprimé** : il ne protégeait rien, il autorisait
l'envoi. Un filtre par denylist (`stripOpinionPayload`) retire réponse, question, thème,
archétype, candidat, priorités et démographie avant tout envoi, et alerte en développement.

**Conséquence assumée** : le tableau de bord fondateur perd cette source. Les tendances
politiques doivent être agrégées depuis les tables de compte (`user_answers`, `user_profiles`),
déjà soumises au consentement, avec contrôle serveur et seuils.

---

## D-15 · La migration admin enveloppe les fonctions au lieu de les recopier

`schema_v7_admin_security.sql` révoquait les droits puis vérifiait un garde interne qu'elle
n'ajoutait jamais : elle échouait toujours. Neutralisée (le fichier est désormais un renvoi).

`20260809120000_admin_authorization.sql` **renomme** chaque implémentation en `founder_impl_*`
puis crée un wrapper de même signature portant le garde. Recopier les corps aurait garanti une
divergence au premier changement.

**Rôles réels, pas décoratifs** : `analyst` accède à la volumétrie ; `founder` seul aux
croisements opinion × démographie (genre, commune) et aux agrégats nommant un candidat ou un
archétype — les plus ré-identifiants. Vérifié par le test 6 du banc d'essai.

Testée sur un vrai Postgres jetable (`./supabase/tests/run-migration-tests.sh`) : 11 assertions,
idempotence, rollback. Le banc prouve aussi l'état de départ — **9 fonctions `founder_*` étaient
bien exécutables par `anon`**.

---

## D-16 · Le seuil de couverture est appliqué, et un candidat non scoré reste visible

`minKnownThemesForScore` était déclaré et jamais lu. Il l'est désormais dans le moteur central :
sous 4 thèmes connus, `score: null` et `reason: 'insufficient_coverage'`.

Les réponses spécifiques à l'élection **ne compensent pas** : 5 questions sur 17 ne remplacent
pas un profil, et le score obtenu ne serait pas comparable aux autres. `rankCandidates()` renvoie
`unscored` pour que l'interface le dise plutôt que de faire disparaître les candidats.

---

## D-17 · La couverture v2 exige la file réelle, sinon elle l'admet

`calculateProfileV2()` comptait `asked` sur toute la banque : en mode Découverte (2 questions par
thème), la couverture était rapportée sur 16 — faux d'un facteur 8.

`askedQuestionIds` est désormais un paramètre. Les compteurs sont renommés sans ambiguïté :
`inQueue` (posées), `inBank` (plafond de la banque), `answered`, `noOpinion`, `unanswered`.
Sans file fournie, `inQueue` et `unanswered` valent `null` et `basedOnQueue` vaut `false` —
plutôt qu'un dénominateur inventé.

---

## D-18 · La reprise persiste des IDs, pas la file

`questionsQueue` contient les objets complets : les persister alourdirait `localStorage` et
figerait le texte des questions à leur version du jour de la passation. On persiste
`queueQuestionIds` + `currentQuestionIndex` + `queueMeta`, et la file est reconstruite à la
réhydratation.

**La reprise est refusée**, avec un motif affiché, si la version du questionnaire ou de
l'algorithme de file a changé, ou si une question a disparu. Reprendre une file amputée sans le
dire serait pire qu'un écran d'erreur. Les réponses déjà données sont toujours conservées.

---

## D-19 · Un import remplace la session, il ne fusionne pas

Schéma versionné dans `src/engine/importSchema.js`. Version de format **exigée** (`1.0` ou `2.0`).

Chaque champ de session est écrit explicitement, y compris à `null`. Aucun `?? étatCourant` :
c'est ce qui laissait les `themeWeights` du navigateur pondérer un profil importé d'ailleurs.
Un champ invalide est écarté avec un avertissement plutôt que de faire échouer l'import —
une session reste utilisable sans sa graine.

Une file contenant une question inconnue est refusée **en bloc**, jamais tronquée.

---

## D-20 · Le v2 reste inactif, mais la bascule est outillée

`src/engine/scoringVersion.js` : drapeau `VITE_SCORING_VERSION`, défaut `v1`.
`compareScoringVersions()` mesure l'écart réel (déplacement max et moyen par thème, thèmes
passant à « inconnu ») pour décider sur données plutôt qu'à l'intuition.

**Le problème méthodologique n'est donc PAS corrigé en production** : la méthode active reste
le v1 (thème sans réponse = 50, étirement 0,75). Le dire fait partie du contrat.

---

## D-21 · Aucune date de tour n'est affirmée

Le prompt de veille donnait « 18 avril » et « 2 mai 2027 » comme des faits. Service-Public ne
publie que l'année : les dates ne seront officielles qu'au décret de convocation, pris au moins
dix semaines avant le premier tour. Retirées du prompt et de `elections.js`, remplacées par
« 2027, dates à confirmer par décret ». Détecter la publication du décret devient une **alerte
critique** de la veille.

*(Les documents `docs/business/` et `docs/growth/` de l'utilisateur mentionnent encore ces dates ;
ils ne sont pas suivis par cette campagne et n'ont pas été modifiés.)*

---

## D-22 · La veille est un pipeline en deux temps, sans recherche simulée

`scripts/election-watch/run.mjs --prepare` / `--finalize` : verrou de concurrence, fenêtre
calculée depuis `last_successful_run` avec chevauchement de 48 h, contrôles d'intégrité,
génération des 12 fichiers au bon schéma, puis validation stricte du paquet rempli par l'agent.

**Le script n'effectue aucune recherche web** — Node n'a pas d'agent de recherche, et produire
un `NO_VERIFIED_CHANGE` sans avoir rien contrôlé serait un mensonge daté et archivé. La
recherche est faite entre les deux étapes par un agent suivant `prompts/election-watch-2027.md`.

`--finalize` **refuse** : un fichier manquant, un JSON invalide, un résumé non rempli
(marqueur `TODO_UNFILLED`), une proposition sans source, `reviewerRequired: false`, ou un
`stance: 0` non confirmé. En cas de refus, `last_successful_run` n'avance pas.

---

## D-23 · Vérification par rendu navigateur : toujours bloquée

Le navigateur intégré reste sur « Policy check in progress » puis « pane hidden » ; les
connexions vers `127.0.0.1:5173` échouent depuis l'environnement d'exécution, alors que le
serveur Vite démarre normalement. Le contre-audit indépendant a rencontré le même blocage.

**Le build n'est pas présenté comme un substitut aux tests E2E.** Les parcours sont désormais
couverts par 22 tests d'intégration du store (session, reprise, import, consentements, cloud)
et par un garde-fou de terminologie sur les sources — mais aucun test de RENDU n'existe, et
aucun parcours n'a été observé dans un navigateur.

---

# Suite au 2e contre-audit du 2026-08-09

---

## D-24 · ~~DÉFAUT BLOQUANT~~ — **VERDICT ERRONÉ, RÉTRACTÉ le 2026-08-09**

> ### ⛔ Ce constat était FAUX. Le questionnaire fonctionne.
>
> Un contre-audit indépendant a rejoué le parcours sur le dépôt courant : Découverte,
> Q1 → Q7, « sans opinion » sur Q7, passage à Q8, **rechargement complet**, reprise exacte
> sur Q8, réponses jusqu'à Q16, profil final avec **15 réponses exploitables** — cohérent avec
> un `NO_OPINION`. La carte change à chaque question, la progression reste synchronisée.
>
> **Ce que j'ai mal fait** : j'ai déplacé les hooks avant le retour conditionnel (le correctif,
> qui est bon et présent dans le diff), puis j'ai continué à tester avec des clics scriptés
> qui heurtaient l'auto-avance et les animations. J'ai attribué à l'application ce qui venait
> de mon harnais, j'ai « reproduit » le symptôme sur HEAD par la même méthode fautive, et
> j'en ai conclu un blocage produit. Le déplacement des hooks reste justifié — les hooks après
> un retour conditionnel sont une vraie violation — mais il ne corrigeait pas un blocage,
> il prévenait un risque.
>
> **Leçon retenue, appliquée depuis** : ne jamais conclure à un défaut produit à partir d'un
> harnais scripté sans reproduire d'abord à cadence humaine, après rechargement complet, sur
> le code courant. Le texte d'origine est conservé ci-dessous, barré, pour que la rétractation
> soit lisible plutôt que effacée.

### ~~Constat d'origine (erroné)~~

**Premier parcours navigateur jamais exécuté sur ce produit.** Il a immédiatement révélé un
défaut que 166 tests automatisés ne voyaient pas.

**Symptôme** : après avoir répondu à la question 1, la carte de question **ne change plus**.
L'en-tête de progression avance (« 2 / 16 », « 3 / 16 »…) et `currentQuestionIndex` avance
dans le store, mais la carte affichée reste celle de la question 1. Chaque clic suivant
réécrit donc la **réponse de la question 1** avec la valeur cliquée, au lieu de répondre à la
question affichée dans la barre de progression.

**Reproduction** (serveur de dev, `npm run dev`) :
1. Accueil → « Construire mon profil » → Découverte → Commencer → Confirmer → « C'est parti »
2. Répondre à la Q1 (n'importe quelle valeur) → l'auto-avance passe à « 2 / 16 »
3. Répondre à nouveau → `localStorage.poliscop_state.state.answers` ne contient toujours
   qu'une seule entrée, `ECO_8`, dont la valeur est écrasée. `currentQuestionIndex` reste 1.

**Attribution — vérifiée, pas supposée** : `git show HEAD:src/pages/Questionnaire.jsx` a été
restauré temporairement et le défaut **se reproduit à l'identique**. Il est donc
**PRÉEXISTANT** au chantier de remise à niveau, et non introduit par lui. Le bloc
`AnimatePresence`/`QuestionCard` n'a d'ailleurs pas été modifié (`diff` vide sur ce bloc).

**Cause probable, non confirmée** : `<AnimatePresence mode="wait">` ne monte la carte suivante
qu'après la fin de l'animation de sortie de la précédente. Si cette sortie ne se termine
jamais, la carte reste figée pendant que le reste de l'interface suit l'état. Ce n'est pas
démontré — je n'ai pas eu le budget pour l'établir.

**Non corrigé, délibérément.** Toucher au mode d'animation en fin de session, sans budget pour
valider le résultat sur plusieurs parcours, aurait été un correctif à l'aveugle sur un chemin
critique. **Ce point doit être traité avant toute mise en ligne** : dans cet état, un
utilisateur ne peut pas produire de profil.

**Réserve honnête** : constaté dans le navigateur intégré de cet environnement. Une
vérification sur un navigateur de bureau ordinaire reste à faire avant de conclure que tous les
utilisateurs sont touchés.

---

## D-25 · Deny-by-default sur TOUT le schéma public, pas seulement `founder_*`

La première migration de durcissement se contentait d'ASSERTER qu'aucune fonction publique
n'était exécutable par `anon`. Appliquée sur la vraie chaîne de migrations, elle échouait :

```
ERROR:  Fonctions encore exécutables par anon : set_updated_at()
```

`public.set_updated_at()` est une fonction de trigger créée par
`20260612_fix_rls_and_constraints.sql` — que le banc d'essai **sautait**, d'où l'illusion que
la migration passait. Comme toute fonction PostgreSQL, elle reçoit `EXECUTE` à `PUBLIC` à la
création. Une assertion ne corrige rien : il faut révoquer.

La migration révoque désormais sur **toutes** les fonctions de `public`, puis re-GRANT selon
une allowlist nommée. Trois catégories :
- **fonctions de trigger** → jamais de droit client. PostgreSQL ne vérifie `EXECUTE` qu'au
  `CREATE TRIGGER`, pas au déclenchement : révoquer est sans effet fonctionnel, ce que le
  **test 12** prouve sur une `UPDATE` réelle jouée en rôle `authenticated` sous RLS ;
- **allowlist** (`is_founder_admin`, wrappers `founder_*`, RPC de libre-service RGPD
  `delete_my_account` / `export_my_data` / `has_consent`) → `authenticated` ;
- **toute autre fonction ouverte et inconnue** → la migration ÉCHOUE avec la liste. C'est un
  arbitrage humain : la révoquer à l'aveugle pourrait casser le frontend.

---

## D-26 · Un seul fichier par version dans `supabase/migrations/`

`20260809120000_admin_authorization.sql` et `..._rollback.sql` partageaient la même version :
la CLI Supabase les aurait appliqués tous les deux, le rollback défaisant la migration juste
après elle. `20260809T120000_response_state_target.sql` était une spécification qu'un
`db push` aurait exécutée.

Rollbacks → `supabase/rollbacks/`. Spécifications → `docs/data-model/`.
`tests/data/migrations-layout.test.mjs` refuse désormais une version dupliquée, un nom non
conforme, un rollback égaré, et vérifie que le banc d'essai applique bien **toute** la chaîne
historique — la régression exacte qui masquait `set_updated_at()`.

---

## D-27 · Le consentement serveur n'était jamais écrit

`grantConsent()` — seule fonction écrivant la preuve dans `user_consents` — était exportée et
**appelée nulle part**. `ConsentModal` n'appelait que `useStore.setConsent()`. Un compte
connecté pouvait donc voir ses opinions synchronisées sans aucune trace de consentement côté
serveur.

Ordre désormais imposé : écriture serveur → **puis seulement** activation locale. En cas
d'échec, `politicalData` reste refusé, aucune opinion ne part, et la modale reste ouverte avec
un message explicite. Le choix de mesure d'audience, lui, est local au terminal et n'est plus
remis à `false` par `grantConsent()`.

---

## D-28 · Allowlist par événement, point d'émission unique

La denylist `stripOpinionPayload()` était contournée : **19 des 27** fonctions exportées
appelaient `track()` directement — `candidate_viewed`, `historical_figure_viewed`,
`compare_started`, `explanation_toggled`, `academy_concept_clicked`… Le filtre ne protégeait
que 8 événements.

`analytics.js` a été réécrit : `emit()` est le seul appelant de `track()`, chaque événement
déclare la liste exhaustive de ses propriétés (`EVENT_ALLOWLIST`), un événement inconnu n'est
pas émis. Deux contrôles statiques échouent si `track()` réapparaît ailleurs ou si un module
produit l'importe. `anonymous_sessions` ne stocke plus ni user-agent ni langue (minimisation).

---

## D-29 · Une file importée doit être RÉGÉNÉRABLE, pas seulement plausible

L'import acceptait toute file dont les identifiants existaient. Un export bricolé — 12
questions en mode « standard », doublons, ordre modifié — produisait une « reprise » sans
rapport avec la passation d'origine.

La file n'est désormais acceptée que si elle se **régénère à l'identique** depuis
(mode, priorityOrder, graine, version d'algorithme), ordre compris. Sinon les réponses sont
importées et l'interface dit que la file n'est pas restaurable. Sept tests négatifs couvrent
chaque cas.

---

# Suite au 3e contre-audit du 2026-08-09

---

## D-30 · Le score public ne repose plus QUE sur des positions approuvées

**Le P0 produit.** Le moteur classait encore les candidats 2027 à partir de deux sources non
sourcées : `candidate.profile` (huit nombres `legacy-manual-v1`) et un repli sur
`specificQuestions[].positions`. Avec **zéro** position approuvée, l'interface affichait
« Meilleur match 2027 — Fabien Roussel — 66/100 ».

Pire : le test « le repli legacy s'applique donc partout » verrouillait **l'inverse** de
l'exigence produit.

**Maintenant** : `src/engine/candidateProfile.js` dérive le profil thématique candidat des
seules positions recevables — `approved`, `stance != null`, source **vérifiée**
(`verifiedAt` non nul), extrait ou raisonnement, codeur, relecteur, date de validité.
Les revirements sont résolus par `supersedesId` et `validFrom`. Aucune valeur par défaut :
un thème sans assez de preuves reste `null`, jamais 50.

Le repli legacy est **supprimé** de `candidateMatch.js`. `candidate.profile` n'y est plus lu.
Deux seuils versionnés dans `matchConfig.js` : `minSourcedPositionsPerTheme` (2) et
`minKnownThemesForScore` (4).

**Conséquence assumée, vérifiée en navigateur** : `/profile` n'affiche plus de « Meilleur
match 2027 » mais « Aucun classement 2027 disponible — aucune position de candidat n'est
encore sourcée et relue […] 10 candidats sont suivis ». C'est le comportement honnête tant
qu'aucune position n'a été relue.

`rankByAlignment()` reste utilisé pour les **courants idéologiques** et les **figures** —
des profils de référence documentés, pas des candidats à une élection en cours.

---

## D-31 · L'ordre des migrations est celui de la CLI, et il est prouvé

Le banc appliquait `20260809130000` **avant** `20260809120000` : un ordre que
`supabase db push` ne produit jamais. Les deux étapes étaient écrites à la main.

Le runner découvre désormais les fichiers, les trie lexicalement, journalise l'ordre
réellement appliqué et **échoue** s'il diffère de l'ordre attendu. Deux bases sont créées
dans le cluster jetable :
- `poliscop_before` — fixture + migrations historiques, pour prouver l'état de départ
  (9 fonctions `founder_*` ouvertes à `anon`) ;
- `poliscop_full` — la chaîne complète dans l'ordre exact.

Sans ce découpage, la preuve de l'état initial disparaissait dès que le durcissement était
appliqué dans la même passe.

---

## D-32 · « Rester local » n'écrase plus le choix de mesure d'audience

Cocher « mesure d'audience » puis cliquer « Non merci, je reste en local » appelait
`revokeConsent()` sans transmettre ce choix, et `withdrawConsent()` forçait les deux à
`false`. La combinaison `politicalData = false, measurement = true` — décrite comme possible —
était donc inatteignable : la case affichée était ignorée.

`withdrawConsent({ measurement })` accepte désormais le choix. Sans argument, il refuse les
deux (comportement d'un « tout refuser »).

---

## D-33 · La veille ne peut plus mentir sur son propre échec

Trois corrections :
- suppression du `|| true` : le code de sortie de l'agent est propagé, `collected=true`
  n'est plus écrit après une panne ;
- suppression de `continue-on-error: true` sur la validation : un paquet refusé ne produit
  plus une PR d'apparence normale ;
- version de Claude Code **pinnée** au lieu de `@latest`.

`--finalize` cherche désormais `TODO_UNFILLED` dans **tous** les fichiers, pas seulement le
résumé : le changelog pouvait rester un gabarit sans que rien ne le signale.

**Non résolu, et dit comme tel dans le workflow** : `--add-dir` *ajoute* un répertoire
accessible, il ne rend pas le dépôt en lecture seule, et `--permission-mode acceptEdits`
accepte les modifications. Le commentaire qui affirmait le contraire est retiré et remplacé
par un avertissement : **ne pas configurer `ANTHROPIC_API_KEY`** tant que la collecte et la
création de PR ne sont pas séparées en deux jobs aux permissions distinctes.

---

## D-34 · Deux pages publiques étaient blanches ; la suite de tests était verte à 100 %

**Le défaut.** `src/components/MatchCard.jsx` appelait `formatProximity()` sans l'importer.
Une référence libre est du JavaScript valide : Vite compile, le build passe, et l'erreur ne
survient qu'au rendu. Les deux seules pages qui utilisent ce composant — `/france` et
`/figures` — étaient **entièrement blanches**, sans limite d'erreur pour le rattraper.

Reproduit en navigateur avant toute modification :

```
ReferenceError: formatProximity is not defined
  at MatchCard (http://localhost:5173/src/components/MatchCard.jsx:22:3)
  at FrenchFigures (…/FrenchFigures.jsx:532:20)
→ /france : bodyTextLength 0, rootChildren 0
```

**Ce que cela dit des tests, et non du code.** 181 tests passaient. Aucun ne RENDAIT un
composant : `tests/data/ui-terminology.test.mjs` lisait les sources comme du texte. Un test qui
ne fait que lire ne peut pas constater qu'une page ne s'affiche pas. C'est la leçon, pas le
correctif ponctuel.

**Trois occurrences, pas une.** En corrigeant la première, j'en ai introduit une deuxième
(`scoreToCssPercent` ajouté dans trois pages sans import — pages à nouveau blanches). Le
balayage statique écrit pour l'occasion en a immédiatement révélé une troisième, jusque-là
inconnue : `ProfileShareModal.jsx` utilisait `formatProximity` et `coverageLabel` sans import,
le modal de partage aurait planté à l'ouverture.

**Garde-fous, du plus précis au plus général.**

1. `npm run check:undef` — ESLint `no-undef` (`eslint.config.js`), branché dans `npm run lint`
   donc dans `npm run verify`. Seule règle activée : aucun avis de style, uniquement la classe
   de défaut qui produit un écran blanc. **Vérifié en le mettant au rouge** : import retiré →
   `126:16 'formatProximity' is not defined` + `148:24 'scoreToCssPercent' is not defined` ;
   import remis → vert.
2. `tests/ui/routes.test.mjs` — 12 routes publiques rendues via `MemoryRouter` ; échoue si une
   page lève ou rend moins de 40 caractères de texte. Couvre l'EFFET quelle qu'en soit la cause.
3. `tests/ui/render.test.mjs` — rendus réels de `MatchCard` et `ProfileReveal`, plus un balayage
   qui vérifie que tout symbole exporté par `src/engine/*` est importé là où il est utilisé.

`tests/helpers/register-loader.mjs` enregistre désormais aussi le loader JSX, sinon
`tests/ui/**` n'aurait pas tourné sous `npm test` — un test de rendu vert en local mais absent
de la CI aurait reproduit exactement le trou qu'il est censé fermer.

**Texte et géométrie séparés.** La conversion vers « /100 » avait produit
`width: ${formatProximity(x)}` → `width: "67/100"`, une règle CSS invalide : barres invisibles.
Deux contrats distincts et testés : `formatProximity(67)` → « 67/100 » (lu),
`scoreToCssPercent(67)` → « 67% » (géométrie, bornée 0–100). Sept sites convertis.

**La largeur d'une barre ne dépend plus d'une animation.** `MatchCard` la définissait par
`initial={{width:'0%'}}` + `animate={{width:…}}`. Sans frame d'animation, la barre restait à
0 px avec un score affiché correct. La largeur est désormais déclarative ; seule la transition
reste cosmétique.

⚠️ **Ce dernier point a d'abord été observé via un artefact de mon harnais**, pas en conditions
réelles : l'onglet était en arrière-plan (`document.visibilityState === "hidden"`, donc aucun
`requestAnimationFrame`, `document.getAnimations().length === 0`) et la fenêtre avait une
largeur nulle. Conformément à la règle tirée de D-24, ce n'est **pas** compté comme un défaut
constaté en production. La correction est retenue sur son mérite propre — une géométrie qui
n'existe qu'après une animation est fragile — et non sur une reproduction utilisateur.

**Vocabulaire.** « compat. » sous chaque score abrégeait un terme banni : remplacé par
« proximité » / « proximity ». « ✓ Profil fiable » → nombre de réponses prises en compte.
« scores d'alignement précis » (page d'accueil) → « à partir de positions sourcées et relues ».
`ProfileReveal` sans candidat ne promet plus de « meilleur match » et explique pourquoi le
classement est vide.

**Preuve navigateur après correction** (parcours par navigation interne, collecteur d'erreurs
installé dans la page) :

| Route | Texte | Scores `/100` | `%` en texte | Largeur CSS invalide | Erreurs |
|---|---|---|---|---|---|
| `/france` | 9 246 car. | 56 | 0 | non | 0 |
| `/figures` | 17 057 car. | 120 | 0 | non | 0 |
| `/france` (retour) | 9 246 car. | 56 | 0 | non | 0 |
| `/profile` | 2 683 car. | 2 | 0 | non | 0 |

Proportionnalité vérifiée par mesure : 119 px / 186 px = 64 % pour « 64/100 » ;
151/235 = 64 % ; 141/235 = 60 % ; 173/220 = 79 % ; 156/220 = 71 %.

`npm test` : **202 tests, 0 échec**.

---

## D-35 · Le moteur avait cessé de lire le legacy ; l'interface, non

**Le décalage.** Depuis D-30, `computeCandidateMatch()` ne lit plus `candidate.profile` ni
`specificQuestions[].positions`. Les COMPOSANTS, eux, continuaient — sept surfaces :

| Fichier | Fonction | Lecture |
|---|---|---|
| `ElectionDetail.jsx` | `getQuestionBreakdown()` | `q.positions[candidate.id]` |
| | `getThemeAgreementsFallback()` | `candidate.profile` |
| | `getMatchSentence()` | idem, par transitivité |
| | `generateProfileAnalysis()` | `top.profile?.[theme] ?? 50` |
| | `ThemeBreakdown()` | `candidate.profile?.[theme] ?? 50` |
| | `ComparePanel()` | `c.profile?.[theme] ?? 50` |
| `CandidateProfile.jsx` | « Positions idéologiques » | `candidate.profile` |

Le score affiché était donc honnête — « aucune donnée comparable » — pendant que le texte
juste en dessous affirmait « Proches sur l'économie, plus éloignés sur l'immigration ». Une
affirmation sur les positions d'une personne réelle, sans source, sous un score qui disait
précisément qu'aucune source n'existait.

**Le `?? 50` était le cœur du problème.** Il convertit « on ne sait pas » en « exactement au
centre ». Un thème sans la moindre position codée s'affichait comme une position mesurée, et
alimentait un « Δ32 vs vous » dans le comparateur côte à côte.

**Ce qui a été fait.**

- Le moteur expose `derivedThemes` dans ses trois sorties — profil thématique dérivé des seules
  positions approuvées, `null` par thème non couvert. Les vues n'ont plus aucune raison de lire
  la donnée brute du candidat.
- Les quatre helpers legacy sont supprimés. `getMatchSentence()` est réécrit sur `derivedThemes`
  et renvoie `null` — donc n'affiche rien — dès que moins de deux thèmes sont comparables.
- Le repli theme-level du bloc accords/désaccords est supprimé. À la place, une phrase qui dit
  pourquoi il n'y a pas de détail. **On ne comble pas le vide.**
- `ThemeBreakdown` et `ComparePanel` affichent « non sourcé » au lieu d'un nombre et d'une barre.
  Aucun `Δ vs vous` n'est calculé contre une valeur inconnue.
- `generateProfileAnalysis` EXCLUT les thèmes non sourcés au lieu de les supposer au centre, et
  supprime ses phrases de comparaison quand moins de deux thèmes sont comparables. La partie
  qui décrit le profil de l'utilisateur — fondée sur ses propres réponses — est conservée.
- `CandidateProfile.jsx` remplace ses « Positions idéologiques » par le profil dérivé, et par un
  encart explicite quand rien n'est sourcé.
- Deux largeurs CSS résiduelles (`width: ${alignment}%`, `width: ${score}%`) passent par
  `scoreToCssPercent()`. Un « compat. » supplémentaire est remplacé par « proximité ».

**`matchReady` : constaté, plus déclaré.** Le champ stocké est un booléen saisi à la main.
Mesure : **48 entrées le portent à `true`, 0 est réellement comparable** — soit exactement les
candidats que le moteur refuse de noter. `isMatchReady()` (`candidateRegistry.js`) dérive
désormais la comparabilité des positions approuvées et du seuil versionné
`MATCH_CONFIG.minKnownThemesForScore`. Le champ stocké est conservé (des données utilisateur y
font référence) mais **plus rien ne le consomme comme une vérité** : `getTrackedNotMatchReady()`
passe par la fonction dérivée.

**Tests** — `tests/data/legacy-purge.test.mjs`, 6 cas :

1. balayage statique : aucun `.jsx` ne lit `candidate.profile` ni `q.positions` (commentaires
   retirés du fichier entier, un commentaire JSX s'étendant sur plusieurs lignes) ;
2. un candidat purement legacy ne fournit ni score, ni accords, ni thème dérivé non nul ;
3. **un candidat fictif entièrement sourcé obtient bien un score et des thèmes dérivés** — sans
   ce cas, les autres seraient satisfaits par un moteur qui ne renvoie jamais rien ;
4. chez un candidat partiellement sourcé, les thèmes sans preuve restent `null` ;
5. `isMatchReady()` refuse tout profil non `sourced-positions` ;
6. `isMatchReady()` s'aligne exactement sur le refus du moteur — l'interface ne peut pas
   promettre un classement que le calcul ne produira jamais.

**Preuve navigateur** — `/elections/fr_2027`, profil complet injecté, parcours jusqu'aux
résultats : 0 candidat classé ; les 10 candidats listés sous « NON CLASSÉS » avec
« Aucune donnée comparable pour ce candidat » ; section « SUIVIS, PAS ENCORE COMPARABLES »
avec statut daté et sourcé ; aucun score `/100` ; aucun terme banni ; 0 erreur console.

`npm test` : **208 tests, 0 échec**. `npm run verify` : vert.

---

## D-36 · Deux preuves par thème restent obligatoires ; le corpus doit atteindre le seuil

**Fausse bonne idée rejetée.** La présidentielle 2027 ne contient qu'une question pour
certains thèmes. Abaisser automatiquement le seuil thématique de deux preuves à une aurait
rendu ces thèmes « connus » sur une seule déclaration et aurait pu déclencher un veto majeur
sur cette base. Le seuil n'est donc pas adaptatif : `minSourcedPositionsPerTheme` reste à 2.

**Solution retenue.** Une prise de parole directe de David Lisnard contre l'abaissement de
l'âge de la retraite a été rattachée à q1. Avec q8, l'économie rejoint l'environnement, la
mondialisation et la sécurité : après relecture indépendante des 11 codages, quatre thèmes
atteignent chacun le seuil de deux positions.

Un test simule uniquement cette future relecture et exige un score fini avec exactement quatre
thèmes connus. Les données réelles restent à 0 `APPROVED` : le codeur n'est pas devenu son
propre relecteur et aucun score public n'est débloqué par cette décision.

La release de données candidats passe à `2026-08-10`. La version du moteur ne change pas,
puisque ses formules et seuils sont inchangés.

---

## D-37 · Les « chantiers » Attal sont codables, mais ne deviennent pas un programme final

Le site officiel de campagne publie quatre chantiers et deux dettes, tout en invitant les
citoyens à alimenter le programme et en annonçant encore des propositions complètes à venir.
La maturité reste donc M2. Six positions directes sont codées `PENDING_REVIEW` ; onze restent
inconnues lorsque la formulation précise de Poliscop n'est pas satisfaite.

Trois intensités sont volontairement limitées à ±1 : opposition à la retraite à 60 ans mais
pas à tout seuil inférieur à 64, orientation favorable à la baisse de l'impôt sur les sociétés
sans engagement chiffré 2027, et dissuasion renforcée dans un cadre européen plutôt
qu'autonomie française explicitement exclusive.

Le champ `profileSource` de Lisnard et Attal passe à `sourced-positions` pour décrire la nature
réelle de leur corpus. Cela ne les rend pas comparables : `isMatchReady()` exige toujours des
positions approuvées et quatre thèmes au seuil. Lisnard en atteindrait quatre après relecture ;
Attal seulement deux et reste donc exclu même dans cette simulation.
