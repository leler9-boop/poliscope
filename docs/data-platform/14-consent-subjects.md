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
