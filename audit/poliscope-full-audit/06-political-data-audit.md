# Audit des données politiques — candidats, partis, personnalités

**Date de référence de l'audit : 2026-07-10.** Recherche externe menée en priorité sur sources officielles/institutionnelles, complétées par la presse nationale reconnue (voir méthode et sources complètes dans [07-sources-and-freshness.md](07-sources-and-freshness.md) et `sources.json`).

## 1. Constat critique — statut de Marine Le Pen et Jordan Bardella pour 2027

### Ce qui s'est réellement passé (vérifié, confiance haute, 7 sources indépendantes convergentes)

Le **7 juillet 2026**, la cour d'appel de Paris a rendu son verdict dans l'affaire des assistants parlementaires du FN/RN :
- La condamnation pour détournement de fonds publics européens est **confirmée**.
- La peine est **réduite** : 3 ans de prison (1 an ferme sous bracelet électronique), 100 000 € d'amende, et **45 mois d'inéligibilité dont 30 avec sursis** — soit 15 mois fermes, décomptés depuis l'exécution provisoire du 31 mars 2025, **déjà entièrement purgés au 30 juin 2026**.
- **Conséquence directe : Marine Le Pen est éligible à la présidentielle de 2027.** Elle l'a annoncé publiquement le jour même (TF1), précisant former un pourvoi en cassation (sans effet suspensif sur sa candidature).
- Le RN se retrouve donc avec Le Pen elle-même comme candidate naturelle, Bardella restant président du parti à ses côtés plutôt que candidat de substitution — retournement complet par rapport au scénario qui prévalait avant le 7 juillet.

### Écart avec `src/data/elections.js` — sept emplacements concernés, dont une incohérence interne préexistante

| Emplacement | Contenu actuel | Problème |
|---|---|---|
| `elections.js:844-845` (description EN) | *« Jordan Bardella leads polls after Marine Le Pen's ineligibility conviction »* | Prémisse caduque depuis le 7 juillet |
| `elections.js:851` (context EN) | *« convicted and declared ineligible… (appeal verdict: July 7, 2026) »* + avertissement *« statuses as of June 2026 »* | Présente comme acquis l'inverse du résultat réel, et le propre avertissement de fraîcheur du fichier est dépassé |
| `elections.js:856` (context FR) | Liste Le Pen parmi les personnalités qui « se positionnent », **sans mentionner sa condamnation** | Incohérence interne EN/FR **préexistante au verdict** — les deux langues racontaient déjà des histoires différentes |
| `elections.js:861` (deeperContext EN) | *« …allowing Le Pen through to a run-off she would be favoured to win »* | Contredit à la fois le §851 juste au-dessus et la fiche candidat §999 |
| `elections.js:865` (deeperContext FR) | *« Bardella est désormais le candidat naturel du RN après la condamnation de Le Pen »* | Une troisième version différente de la situation |
| `elections.js:999-1001` (fiche `lepen_2027`) | `ineligible: true`, `candidacyStatus: 'ineligible'` — **champ structuré alimentant un badge UI visible** (`CandidateProfile.jsx:142-151`) | Badge affiché aux utilisateurs objectivement faux depuis le 7 juillet |
| `elections.js:1077-1080` (fiche `bardella`) | `candidacyStatus: 'declared'`, « leading polls… de facto standard-bearer » | Cadrage inversé |
| `frenchFigures.js:709-746` (fiche Le Pen, fichier distinct) | « fait face à un procès en 2025… risque d'inéligibilité » (présent) | Même défaut, dans un second fichier — le procès ET l'appel sont désormais terminés |

**Sévérité : CRITIQUE.** Fait politique de premier plan affiché via un badge structuré visible, objectivement faux 3 jours après l'événement qui l'invalide, avec une incohérence EN/FR préexistante indépendante du verdict lui-même. `requiresPoliticalReview: true` — la situation reste fluide à J+3 (pas de déclaration officielle RN sur le porteur unique de la candidature au moment de l'audit ; pourvoi en cassation en cours) et la reformulation exacte mérite une relecture humaine avant publication, pas seulement une correction mécanique de champ.

**Statuts `candidacyStatus` actuels relevés pour mémoire** (fr_2027) : `lepen_2027` ineligible · `philippe` probable · `attal` speculative · `melenchon_2027` declared · `glucksmann` probable · `tondelier` speculative · `retailleau` speculative · `bardella` declared · `castets` probable · `roussel_2027` probable.

## 2. Constat élevé — Premier ministre réel absent de la base de figures

Le Premier ministre en fonction au 10 juillet 2026 est **Sébastien Lecornu**, nommé le 10 septembre 2025 (après la démission de François Bayrou le 9 septembre 2025, suite à un vote de confiance perdu 194 pour/364 contre), reconduit après un bref épisode de démission/renomination en octobre 2025, gouvernement remanié le 26 février 2026, toujours en fonction (compte-rendu du Conseil des ministres du 9 juillet 2026, déplacement officiel au Maroc les 15-16 juillet 2026).

`src/data/frenchFigures.js` présente pourtant Bayrou comme Premier ministre actuel (`role` au présent, `career_timeline` sans mention de sa démission) et **`grep -rni "lecornu" src/` ne retourne aucun résultat sur l'ensemble du dépôt** — le titulaire réel de la fonction est absent à 100% d'une base qui se revendique elle-même « 28 figures actives 2021-2026 » (`frenchFigures.js:1-3`).

**Sévérité : ÉLEVÉE.** Recommandation d'ajout prioritaire : fiche `lecornu` dans `frenchFigures.js`, correction du statut de Bayrou vers « ancien Premier ministre ».

## 3. Constat moyen — élection de Paris 2026 : résultat manquant, 2 candidats absents

Les municipales parisiennes ont eu lieu les 15 et 22 mars 2026 (déjà passées à la date d'audit). **Emmanuel Grégoire (union de la gauche) élu maire**, battant Rachida Dati (LR) de 9 points au second tour (>50%). 1ᵉʳ tour : Grégoire 37,98%, Dati 25,46%, Chikirou (LFI) 11,72%, Bournazel (Horizons) 11,34%, **Knafo (Reconquête) 10,4%**.

`elections.js` (bloc `paris_2026`) présente correctement l'élection au passé (contrairement au bloc `fr_2027`), mais : (1) aucun `result` final n'indique le vainqueur dans les fiches `gregoire_paris`/`dati`/`chikirou_paris`, alors que l'issue est connue et vérifiable depuis 4 mois ; (2) **Sarah Knafo (Reconquête, 10,4%, devant Bournazel) est totalement absente** du tableau structuré `candidates`, alors que Bournazel (11,34%) est au moins cité en prose.

**Sévérité : MOYENNE.** Pas d'erreur factuelle stricto sensu, mais incomplétude regrettable pour une élection conclue.

## 4. Personnalités internationales — vérification à 19 figures, aucune erreur trouvée

Vérifié par pays (Allemagne : Merz chancelier depuis mai 2025, Scholz sortant, Lindner hors gouvernement/FDP hors Bundestag depuis 2025, Habeck, Weidel ; Royaume-Uni : Starmer PM depuis juillet 2024 — **a démissionné le 22 juin 2026**, succession Burnham en cours au moment de l'audit ; Italie : Meloni toujours présidente du Conseil, **Berlusconi décédé le 12 juin 2023** ; Espagne : Sánchez toujours en fonction ; États-Unis : Trump président depuis janvier 2025).

**Résultat rassurant** : ces ~19 personnalités n'existent **que** dans les blocs d'élections historiques déjà closes d'`elections.js` (`de_2025`, `it_2022`, `es_2023`, `uk_2024`, `us_2020`), toujours avec un `result` en pourcentages/sièges de l'élection concernée, **jamais** avec une revendication de fonction « actuelle ». `historicalFigures.js` ne les contient pas du tout. **Aucune de ces personnalités n'affiche un statut incorrect.** Seule note : Poliscope ne couvre pas la crise politique britannique de juin-juillet 2026 (démission Starmer) — absence neutre, pas une erreur, qui pourrait justifier un futur module `uk_2026` si l'app veut rester à jour sur ce pays.

## 5. Spot-check de 10 affirmations factuelles (candidateDetails.js / candidatePolicies.js)

| # | Affirmation | Verdict | Confiance |
|---|---|---|---|
| 1 | Macron réélu 2022, 58,5%–41,5% face à Le Pen | Conforme | High |
| 2 | Le Pen finaliste 2017, 34%–66% | Conforme | High |
| 3 | Le Pen 41,5% au 2nd tour 2022 | Conforme | High |
| 4 | Mélenchon 11,1% en 2012 | Conforme | High |
| 5 | Mélenchon 21,95% au 1ᵉʳ tour 2022 | Conforme | High |
| 6 | Renommage FN→RN en 2018 (congrès de Lille, juin 2018) | Conforme | High |
| 7 | Réforme des retraites 2023, âge légal à 64 ans (loi promulguée 15/04/2023) | Conforme sur le fond ; note « (later 65) » dans `candidateDetails.js:19` ambiguë/possiblement inversée chronologiquement | Faible sur ce point précis, non tranché |
| 8 | RN 1ᵉʳ parti aux européennes 2024, 31,37% | Conforme | High |
| 9 | « Gouverne sans majorité absolue depuis 2022 » (présent, `frenchFigures.js:22-23`) vs « de 2022 à 2024 » (borné, `:44/48`) | **Incohérence interne + version bornée obsolète** — l'Assemblée reste sans majorité, absolue ni relative, jusqu'à l'audit (motion de censure 2/07/2026, séance du 6/07/2026, 49.3 répété en janvier 2026) | High |
| 10 | Fiche Le Pen `frenchFigures.js:709-746` : « fait face à un procès… risque d'inéligibilité » | **Obsolète**, même défaut que le constat §1 dans un fichier distinct | High |

## 6. Exhaustivité — acteurs manquants

**Recommandé** : ajout de **Sébastien Lecornu** (voir §2) — priorité la plus haute, correction la plus simple.
**Optionnel** : nommer explicitement **« L'Après »** (scission LFI de François Ruffin, 2024) dans sa fiche `frenchFigures.js:1042-1096` — déjà décrite comme rupture avec LFI, mais le mouvement n'est jamais nommé, alors qu'il est l'un des 4 organisateurs officiels de la primaire de la gauche unitaire du 11 octobre 2026 (déjà correctement mentionnée dans `elections.js`).
**Non recommandé** : aucun autre nouveau parti, scission ou coalition d'ampleur nationale comparable identifié. Le statut RN reste une question de candidature (déjà traitée §1), pas une nouvelle entité à ajouter.

## 7. Bonnes pratiques constatées (à préserver)

- Le champ `candidacyStatus` structuré (`ineligible/probable/speculative/declared`) est une bonne pratique déjà largement alignée avec la demande de la mission — le problème n'est pas l'absence de taxonomie, mais la fraîcheur d'une valeur particulière.
- Le disclaimer présent sur au moins certaines figures historiques (ex. FDR et l'internement des Japonais-Américains) est une bonne pratique de transparence sur les zones d'ombre.
- Les faits chiffrés vérifiables (résultats électoraux historiques, dates de lois) se sont révélés fiables sur l'échantillon vérifié — le problème de fraîcheur identifié est concentré sur des situations **en mouvement rapide au moment de l'audit** (verdict judiciaire à J-3, PM en poste depuis 10 mois), pas sur un manque de rigueur généralisé.
