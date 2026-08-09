# Provenance des données candidats

Dernière mise à jour : 2026-08-10
Code : `src/data/candidateRegistry.js`, `src/data/candidateProvenance.js`

## État public actuel

- **37 personnes** sont suivies pour la présidentielle 2027, avec un statut explicite et des
  sources vérifiées.
- **17 candidatures** sont classées comme déclarées ou investies dans l'annuaire éditorial.
  Ce nombre ne désigne pas la liste officielle du Conseil constitutionnel, qui n'existera
  qu'après les parrainages.
- **0 position candidat est approuvée** et **0 candidat est classé** par le moteur public.
- Les anciens profils `legacy-manual-v1` restent dans les données pour compatibilité, mais ne
  sont plus lus par le matching ni par les vues publiques.

L'absence actuelle de classement est volontaire : aucune valeur non sourcée ne doit être
présentée comme une mesure de la position politique réelle d'une personne.

## Les deux sources de vérité

### Registre canonique

`candidateRegistry.js` fixe l'identité, le parti, le statut de candidature, la date du statut,
ses sources et la maturité du programme. Les identifiants historiques restent conservés pour
ne pas casser les liens et exports existants.

Un candidat présent dans un sondage n'est pas automatiquement déclaré. Un candidat déclaré
n'est pas automatiquement comparable. Le champ historique `matchReady` n'est plus pris comme
une déclaration manuelle : `isMatchReady()` constate la comparabilité réelle dans les
positions approuvées.

### Provenance structurée

`candidateProvenance.js` contient :

- `SOURCE_DOCUMENTS` : URL canonique, éditeur, niveau de preuve, dates de publication,
  d'événement, de découverte et de vérification ;
- `CANDIDATE_POSITIONS` : une entrée par candidat et question, avec valeur, sources, court
  extrait, raisonnement, confiance, dates, codeur et relecteur.

Niveaux de source :

- `primary_official` : programme, discours ou publication officielle ;
- `primary_direct` : enregistrement direct ou transcription verbatim de la personne ;
- `institutional` et `polling_authority` : documents d'autorité ;
- `press` : détection et corroboration, pas preuve unique d'une mesure de programme ;
- `tertiary` : signal de recherche uniquement.

`verifiedAt: null` rend une source irrecevable pour le score.

## Premier corpus : David Lisnard

Les 17 questions 2027 existent dans la file éditoriale :

| État | Nombre | Effet public |
|---|---:|---|
| Codées, en attente de relecture indépendante | 11 | Aucun |
| Encore inconnues (`to_review`) | 6 | Aucun |
| Approuvées | 0 | Aucun |

Les 11 propositions codées reposent sur le programme Nouvelle Énergie, des discours intégraux
et des prises de parole directes. Elles couvriraient, **si une autre personne les valide**, les
quatre thèmes exigés par le moteur : économie, environnement, mondialisation et sécurité.

Le test `sourced-matching.test.mjs` simule cette future relecture avec un relecteur fictif et
prouve qu'un score deviendrait calculable. Cette simulation ne modifie pas les données réelles :
elles restent toutes `pending_review`.

Le dossier opérationnel est dans `docs/data/david-lisnard-2027-review.md`.

## Deuxième corpus : Gabriel Attal

Le site `attalpresident.fr` publie quatre « chantiers capitaux », deux « dettes à résorber »
et plusieurs prises de position de campagne. Il indique aussi que les contributions alimentent
encore le programme et annonce certaines stratégies complètes pour plus tard. Sa maturité
reste donc **M2 — propositions thématiques**, pas « programme final ».

| État | Nombre | Effet public |
|---|---:|---|
| Codées, en attente de relecture indépendante | 6 | Aucun |
| Encore inconnues (`to_review`) | 11 | Aucun |
| Approuvées | 0 | Aucun |

Les positions codées portent sur les retraites, l'immigration, l'Europe, la fiscalité des
sociétés, l'Ukraine et la dissuasion. L'intensité est volontairement modérée quand la source
donne une orientation sans engagement 2027 complet. Même après validation, ce corpus ne couvre
que deux thèmes avec deux preuves : Attal resterait hors classement jusqu'à l'obtention de deux
thèmes robustes supplémentaires.

Le dossier opérationnel est dans `docs/data/gabriel-attal-2027-review.md`.

## Troisième corpus : Fabien Roussel

Fabien Roussel reste secrétaire national du **Parti communiste français** et sa candidature
2027 est conditionnée au vote des militants annoncé pour septembre 2026. Il n'a pas publié de
programme présidentiel final 2027. Poliscop ne réutilise donc pas automatiquement son programme
de 2022 ; seules des déclarations officielles de 2025–2026 sont codées.

| État | Nombre | Effet public |
|---|---:|---|
| Codées, en attente de relecture indépendante | 6 | Aucun |
| Encore inconnues (`to_review`) | 11 | Aucun |
| Approuvées | 0 | Aucun |

Le corpus actuel confirme directement l'abrogation des 64 ans, une forte hausse du SMIC, un
plan pour les soignants et enseignants, un programme nucléaire massif, la priorité diplomatique
sur l'Ukraine et une position nuancée sur la laïcité. Même toutes relues, ces six positions ne
rendraient robuste que le thème économie : aucun score ne doit donc être affiché.

Le dossier opérationnel est dans `docs/data/fabien-roussel-2027-review.md`.

## Contrat de publication

Une position ne contribue au matching que si toutes les conditions suivantes sont réunies :

1. `reviewStatus === 'approved'` ;
2. `stance` appartient à {-2, -1, 0, +1, +2} ;
3. toutes les sources existent et ont une date `verifiedAt` ;
4. un extrait ou un raisonnement explique le codage ;
5. `codedBy`, `reviewedBy` et `validFrom` sont renseignés ;
6. le relecteur est différent du codeur.

Deux positions approuvées sont nécessaires pour qu'un thème soit considéré comme connu. Au
moins quatre thèmes connus sont nécessaires pour classer un candidat. Une position isolée ne
peut donc pas résumer un thème entier, ni déclencher seule un veto.

## Règles éditoriales

- Mapper une déclaration vers une question concrète ; sans correspondance directe, laisser
  `stance: null`.
- L'absence d'information vaut `null`, jamais 0 et jamais 50.
- Ne jamais déduire une position à partir du parti ou de l'étiquette idéologique.
- Distinguer une mesure explicite d'une inférence ; ne pas transformer une doctrine générale
  en réponse précise.
- Un revirement crée une nouvelle entrée datée avec `supersedesId` ; il n'efface pas l'histoire.
- Aucun codeur ne valide son propre travail.

## Migration de l'existant

Les huit nombres historiques des profils `legacy-manual-v1` ne reçoivent aucune provenance
rétroactive inventée. Ils sont exclus du produit public. Chaque candidat reviendra dans le
classement uniquement après codage question par question, sources vérifiées, relecture
indépendante et seuil de couverture atteint.
