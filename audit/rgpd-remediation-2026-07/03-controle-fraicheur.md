# Chantier 3 — Maintenance factuelle : contrôle de fraîcheur

Date : 2026-07-11. Objectif : prévention légère de l'obsolescence, pas un nouvel
audit exhaustif — conformément à la consigne de la mission (« le contrôle doit
produire une liste ciblée, pas relancer une recherche externe automatique
exhaustive »).

## Ce qui existait déjà

`audit/poliscope-full-audit/sources.json` (créé lors de l'audit d'origine, 31
entrées) trackait déjà : la donnée sourcée, l'URL, le type de source, la date
de publication, la date de vérification et un niveau de confiance. Il manquait
deux champs explicitement demandés par cette mission : une **catégorie de
fraîcheur** et une **date ou règle de prochaine vérification**.

## Ce qui a été ajouté

### 1. Extension du schéma `sources.json`

Deux champs ajoutés à chacune des 31 entrées existantes, **sans nouvelle
recherche externe** — déduits du contenu déjà présent dans chaque `notes`
(plusieurs entrées contenaient déjà, en prose, une règle de re-vérification
explicite, ex. SOC_10 : « À RE-VÉRIFIER après le 15 juillet 2026 » — seulement
formalisée ici en champ structuré) :

- `freshnessCategory` : `stable` (fait permanent/historique) · `volatile`
  (situation fluide, pas d'échéance fixe connue) · `scheduled` (une date ou un
  événement précis va trancher/mettre à jour la donnée) · `superseded`
  (explicitement remplacée par une entrée plus récente, conservée pour
  traçabilité uniquement).
- `nextCheckDue` (date) et/ou `nextCheckRule` (condition en texte libre) selon
  ce qui est pertinent pour chaque entrée.

4 nouvelles entrées ajoutées pour les questions créées au Chantier 2
(`ECO_28`, `DEM_26`, `SEC_25`, `SOC_27`), qui n'avaient pas encore d'entrée
`sources.json` — voir § 3 ci-dessous, une vérification ciblée (3 recherches
web) a été nécessaire pour celles-ci spécifiquement, contrairement au reste
de cette étape.

### 2. `scripts/check-freshness.mjs`

Nouveau script, même style que `scripts/lint-questions.mjs` déjà présent
(signale, ne corrige jamais automatiquement). Deux familles de contrôles :

**Sur `sources.json`** :
- `SOURCE_OVERDUE` — `nextCheckDue` dépassée.
- `SOURCE_STALE` — pas de date de recheck fixée, `verifiedAt` > 180 jours, et
  `freshnessCategory` ni `stable` ni `superseded`.
- `SOURCE_SUPERSEDED_PRESENT` — toute entrée `superseded`, pour rappel manuel
  de vérifier qu'aucun texte du site ne cite encore l'ancienne formulation
  (correspond directement à l'exigence de la mission : « sources marquées
  "superseded" toujours utilisées dans l'interface »).
- `SOURCE_ACTION_NOTE` — entrées portant un `actionNote` (points déjà
  identifiés par l'audit d'origine comme nécessitant une action sur le code,
  qu'elle ait été faite ou non — voir § 4).

**Sur les explications des 166 questions actives** (heuristiques textuelles,
jamais une vérification de fond — un signalement veut dire « à regarder », pas
« confirmé faux ») :
- `EXPL_UNSOURCED_TIMESENSITIVE` — contient une date/pourcentage/montant mais
  aucune entrée `sources.json` correspondante.
- `EXPL_STRONG_PAST_TENSE_UNSOURCED` — affirme qu'une loi/mesure « a été
  adoptée/promulguée/est entrée en vigueur » sans entrée `sources.json` pour
  confirmer que ce n'est pas resté au milieu du processus.
- `EXPL_FUTURE_DEADLINE_LANGUAGE` — formulation au futur (« à partir de »,
  « prévu pour », « entrera en vigueur ») — à vérifier si l'échéance visée est
  maintenant passée.
- `EXPL_OFFICEHOLDER_MENTION_UNSOURCED` — mentionne un titre de fonction
  politique (président, premier ministre, ministre, maire) sans source
  trackée — un script ne peut pas savoir si la personne citée est toujours en
  fonction, seulement le signaler pour confirmation humaine.

Ce que le script **ne fait pas**, volontairement : il ne relance aucune
recherche externe, ne détermine jamais si une personne est « toujours en
fonction » ou si une loi est « vraiment » entrée en vigueur — il détecte des
motifs textuels à risque et les remonte. C'est la lecture correcte de « le
contrôle doit produire une liste ciblée, pas relancer une recherche externe
automatique exhaustive ».

## 3. Ce que le contrôle a trouvé — et corrigé — dès sa première exécution

En construisant ce contrôle, une bogue de rapprochement d'ID dans le script
lui-même a d'abord produit de faux positifs (corrigée avant la version
livrée). Une fois corrigée, l'exécution a immédiatement révélé un vrai
problème, pas hypothétique :

**`ECO_28` (créée quelques heures plus tôt dans cette même session, Chantier
2) était déjà légèrement obsolète au moment de l'écrire.** Son explication
affirmait que « les obligations les plus lourdes [de l'AI Act], pour les
systèmes à haut risque, s'appliquent à partir d'août 2026 » — une recherche
ciblée déclenchée par ce signalement a révélé qu'un accord européen (« Digital
Omnibus »), en cours d'adoption formelle à la date de vérification, reporte la
majorité de ces obligations à décembre 2027 voire août 2028, ne laissant sur
l'échéance initiale d'août 2026 que les obligations de transparence. Corrigé
dans ce commit — voir le diff de `ECO_28` dans `questions_final.json`. C'est
une démonstration concrète, pas seulement théorique, de pourquoi ce contrôle a
de la valeur : même un contenu écrit *dans la même session* peut déjà être
daté par un développement réglementaire récent.

Deux recherches ciblées supplémentaires (`DEM_26`, `SEC_25`) ont confirmé ces
deux questions déjà correctement formulées, sans correction nécessaire — la
recherche pour `SEC_25` a même révélé une proposition de loi sénatorielle
concrète et actuelle visant exactement le mécanisme décrit par la question
(transfert des enquêtes de l'IGPN vers le Défenseur des droits), non citée
dans l'explication d'origine (restée volontairement générique) mais
documentée dans la nouvelle entrée `sources.json` pour référence future.

## 4. Deux signalements confirmés déjà résolus (pas de nouvelle action)

Deux entrées `sources.json` de l'audit d'origine portaient des notes
signalant un désaccord entre le code et la réalité vérifiée (`bayrou` :
« frenchFigures.js présente encore Bayrou comme Premier ministre en fonction »
; `fr_assembly` : « Contredit le cadrage borné "de 2022 à 2024" »). Vérifiées
directement dans le code à l'occasion de ce chantier : **les deux ont déjà été
corrigées** dans une session antérieure (`frenchFigures.js` reflète
correctement la démission de Bayrou et sa succession par Lecornu, avec un
horodatage de vérification ; la formulation sur l'absence de majorité est déjà
à jour). Marquées `actionNote: "RÉSOLU"` dans `sources.json` plutôt que
supprimées, pour garder la trace que le problème a existé et a été traité.

## 5. Ce qui reste dans la liste ciblée (backlog légitime, pas traité ici)

Après les corrections ci-dessus, le contrôle final remonte 10 signalements,
dont 6 constituent un backlog réel mais **pré-existant à ce chantier** (pas
introduit par ce travail) :

- `ECO_2`, `ECO_5`, `ECO_11` — chiffres (SMIC, dette publique) déjà
  fact-checkés lors de l'audit éditorial en 8 lots (voir
  `17-editorial-batches-synthesis.md`, lot 1) mais jamais formellement
  loggés dans `sources.json`.
- `SOC_24` — inscription de l'IVG dans la Constitution (2024), fait stable et
  peu susceptible d'erreur mais non tracké.
- `DEM_11` — signalement bénin (faux positif) : mentionne « le Président »
  au sens institutionnel générique (limite à deux mandats, article 6 de la
  Constitution), pas une personne actuellement en fonction. Vérifié
  manuellement, aucune action requise — même type de faux positif accepté
  que ceux déjà documentés dans `lint-questions.mjs` (ECO_20, SOC_26).
- `GLO_4` — déjà correctement sourcée et datée (`nextCheckDue: 2026-12-15`) ;
  ce signalement supplémentaire vient d'une vérification de tournure de
  phrase indépendante de la couverture par source, pas une lacune.

Volontairement non traités dans ce chantier : les combler nécessiterait une
recherche externe par élément (comme celle faite pour SMIC/dette publique lors
de l'audit d'origine), ce qui sortirait du cadre « léger, liste ciblée » de
cette étape. Ils constituent la liste de travail que ce contrôle est censé
produire.

## Comment l'utiliser à l'avenir

```
node scripts/check-freshness.mjs          # rapport lisible
node scripts/check-freshness.mjs --json   # sortie structurée
```

Recommandé : exécuter avant toute session de contenu touchant aux questions
ou aux fiches de personnalités, et périodiquement (le seuil `SOURCE_STALE` de
180 jours donne un rythme naturel semestriel minimum). Le script n'automatise
rien au-delà de la détection — chaque signalement reste une invitation à une
vérification humaine ciblée, jamais une conclusion.

## Tests exécutés

`npm run build` → succès. Les 4 tests de régression (déterminisme,
indépendance à l'ordre, poids nuls, monotonie) → PASS. `lint-questions.mjs` →
propre sur les 4 questions du Chantier 2 après le correctif `ECO_28`.
`check-freshness.mjs` lui-même exécuté et son propre résultat vérifié
manuellement ligne par ligne (voir § 3-5 ci-dessus) plutôt que supposé
correct.
