# 14 — Sujets techniques du consentement, et ce qu'on ne transmet pas

*2026-08-14 — décisions prises dans le lot P0-2. Elles ont des conséquences visibles : lire
avant de « compléter » quoi que ce soit.*

## Le défaut corrigé

`buildConsentRecords()` savait recevoir quatre identifiants : pseudonyme d'analyse politique,
identifiant de compte, pseudonyme de mesure d'audience, pseudonyme de recherche. Le chemin
réel — `useStore.syncAttemptConsent()` → `attemptSession.setConsent()` — n'en transmettait que
deux : `userId` et `language`. Aucun code de production ne créait ni ne fournissait
`measurementId` ou `researchId`.

Deuxième défaut, cumulatif : `setConsent()` reconstruisait les enregistrements de **toutes**
les finalités déjà décidées à chaque changement. Cocher la mesure d'audience réémettait donc
la décision politique prise trois semaines plus tôt — redatée, retentée, et parfois sans son
sujet, l'identifiant correspondant ayant pu être effacé entre-temps.

Conséquences observées dans le code : un refus `measurement` ou `research` sans identifiant,
un refus initial `political_analytics` sans pseudonyme, et — le pire — une **tombstone sans
sujet**, c'est-à-dire une demande de suppression que le serveur ne peut rattacher à aucune
donnée, pendant que l'interface annonçait « suppression en cours ».

## Règle appliquée

Une action de consentement transmet **uniquement les finalités réellement modifiées**
(`changedPurposes`). Une réhydratation n'en déclare aucune : relire un état persisté n'est pas
prendre une décision.

Chaque ligne transmise porte exactement une des quatre formes valides :

| Finalité | `anonymous_session_id` | `user_id` |
|---|---|---|
| `cloud_save` | `null` | **obligatoire** |
| `political_analytics` | **obligatoire** (pseudonyme d'analyse) | `null` |
| `measurement` | **obligatoire** (pseudonyme de mesure, distinct) | `null` |
| `research` | **obligatoire** (pseudonyme de recherche) | `null` |

Toute autre forme — y compris `null / null` — est refusée côté client
(`buildConsentDecisions()`) **et** côté base (contrainte
`consent_records_purpose_identifier_form`, migration `20260814100000`). Deux barrières
indépendantes, parce qu'un frontend se contourne.

## Décision produit : `measurement` et `research`

L'alternative posée était : soit créer et gérer réellement des pseudonymes séparés, soit ne
transmettre aucune preuve serveur tant que le flux n'existe pas. La réponse **diffère par
finalité**, parce que l'état du produit diffère.

**`measurement` — preuve transmise.** Le pseudonyme existe déjà et est géré :
`poliscop_anon_id` (`src/lib/anonymous.js`), créé à l'acceptation, purgé au retrait, distinct
de `poliscop_analytics_sid`. Il est désormais **lu avant toute purge** et joint à la décision.
Sans lui — refus alors qu'aucun identifiant n'a jamais existé — la décision reste locale : il
n'y a aucun corpus à rattacher, donc rien à prouver au serveur.

**`research` — aucune preuve transmise.** Il n'existe en production ni pseudonyme de
recherche, ni table, ni destinataire. Les deux issues possibles étaient toutes deux mauvaises :
émettre une ligne à sujet nul (refusée par la base), ou emprunter le pseudonyme politique —
c'est-à-dire faire entrer les opinions dans un autre traitement, exactement ce que le texte de
consentement promet de ne pas faire. Créer un identifiant persistant dédié pour un traitement
qui n'existe pas reviendrait à déposer un traceur sans usage.

La décision de recherche est donc **conservée localement**, datée et empreinte, et sera
transmise le jour où le traitement existera. `SERVER_PROOF_PURPOSES` (`src/lib/consent.js`) est
l'endroit unique où cette liste vit ; l'ajout de `research` devra s'accompagner de la création
et de la gestion de son pseudonyme, pas seulement d'une ligne dans le tableau.

## Lignes anciennes sans sujet : quarantaine, pas réattribution

La migration `20260814100000` procède dans cet ordre :

1. **inventaire** — un `raise notice` par couple (finalité, `granted`), avec les dates
   extrêmes. On regarde avant d'agir ;
2. **quarantaine** — les lignes sans sujet sont déplacées vers
   `private.consent_records_quarantine`, avec la raison et l'horodatage ;
3. **contrainte** — la forme exacte est ensuite imposée.

Ni suppression, ni complétion. **Pas de suppression** : ce sont les traces d'un défaut, et les
effacer effacerait la preuve que des décisions ont été mal enregistrées — une autorité de
contrôle a le droit de le constater. **Pas de complétion** : leur attribuer un sujet
reviendrait à décider aujourd'hui, à la place d'une personne qu'on ne sait pas identifier.

La table de quarantaine n'est lue par aucun chemin d'autorisation — `private.has_consent()` ne
consulte que le journal. Le test SQL 29 le vérifie : une décision sans sujet ne peut pas
redevenir un consentement par accident.

## Ce qu'il ne faut pas refaire

- Ne pas réintroduire un appel qui reconstruit toutes les finalités décidées « pour être sûr ».
  C'est la source exacte des lignes sans sujet.
- Ne pas lire un pseudonyme après l'avoir purgé. `analyticsSessionId(false, …)` **efface** ;
  utiliser `readAnalyticsSessionId()` pour lire.
- Ne pas « débloquer » une ligne refusée par la contrainte en lui donnant l'autre identifiant.
  Une ligne `political_analytics` portant un `user_id` est une donnée de l'article 9.

---

## Addendum 2026-08-17 — les trois états, et le premier accord

Le contre-audit qui a suivi a trouvé quatre défauts dans ce qui précède. Ils sont corrigés ;
ce qui suit remplace toute lecture antérieure.

### Le premier accord anonyme n'envoyait aucune preuve

`setConsent()` calculait UN seul sujet — le pseudonyme lu **avant** création — et s'en servait
pour l'accord comme pour le retrait. Sur un terminal neuf il valait `null` : la preuve d'accord
était donc écartée en `no_subject`. Le cas le plus fréquent du produit — quelqu'un qui accepte
la collecte pour la première fois — ne transmettait rien.

Il y a désormais **deux sujets explicites** : un accord porte le pseudonyme *qui vient d'être
créé*, un retrait celui *lu avant effacement*. Les tests précédents ne l'avaient pas vu parce
qu'ils passaient tous `anonymousSessionId` explicitement, ce qui court-circuite la ligne
fautive. `tests/integration/first-consent-proof.test.mjs` part d'un stockage vide.

### Une preuve d'accord échouée était perdue

Le commentaire promettait un rejeu « par la prochaine décision ». Cette promesse est devenue
fausse le jour où l'on a cessé de réémettre les finalités inchangées : il n'y a plus de
prochaine décision qui rattrape quoi que ce soit.

Les accords passent maintenant par `poliscop_consent_proofs` — file **durable, ordonnée,
distincte** de celle des réponses et de celle des suppressions. Une entrée n'en sort que sur
`=== true`. Le rejeu s'arrête au premier échec, pour ne jamais appliquer les décisions dans le
désordre. Un retrait supprime tout accord resté en attente sur la même finalité.

### Trois états, à ne jamais confondre

| | |
|---|---|
| **choix local** | ce que la personne a coché (`collectionConsent`) |
| **preuve confirmée** | le serveur a accusé réception (2xx), pour un pseudonyme donné |
| **autorisation d'émettre** | les deux réunis — et rien d'autre n'ouvre la collecte |

`declareAttempt()`, `recordAnswer()` et `complete()` passent tous par cette porte. Hors ligne :
le questionnaire fonctionne, les réponses restent locales, et **rien n'est rejoué
rétroactivement** quand la preuve est enfin confirmée. Seules les interactions postérieures à
la confirmation peuvent être collectées.

L'écran d'entrée du quiz attend désormais la promesse et affiche l'état obtenu — confirmé,
en attente, ou non persistable — au lieu de la lancer et de l'abandonner.

### « Réessayer » fonctionne aussi sans stockage

Une demande de suppression que `localStorage` refuse d'enregistrer est conservée **en mémoire
pour la durée de l'onglet**, avec le même `requestId`. Le bouton la rejoue réellement. Rien
n'est promis au-delà de l'onglet, et l'interface le dit.

### Un reçu ne contient aucun identifiant

`requestId`, `purpose`, `requestedAt`, `confirmedAt`, `attempts`. Rien d'autre. Le reçu survit
à l'effacement du pseudonyme — c'est sa raison d'être — donc il ne doit pas le contenir. Les
reçus écrits par la version précédente sont purgés à la lecture. Un seul reçu par finalité,
remplacé à toute nouvelle décision, et périmé au bout de 90 jours : ce n'est pas la preuve
opposable, qui vit dans `private.consent_records`.

⚠ Le **registre des confirmations** (`poliscop_consent_confirmed`), lui, porte le pseudonyme —
et le doit : l'autorisation d'émettre se vérifie pour le pseudonyme courant. Il disparaît avec
lui au retrait, donc il ne survit jamais à ce qu'il décrit.

### La quarantaine est durcie

`private.consent_records_quarantine` est créée après la migration qui active la RLS : elle
n'en héritait pas. Elle a désormais RLS **activée et forcée**, aucun privilège pour `PUBLIC`,
`anon` ni `authenticated`, et aucune politique. Les tests SQL 30 et 31 le vérifient, ainsi que
le fait qu'aucune fonction ne l'expose.
