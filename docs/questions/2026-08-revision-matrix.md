# Révision éditoriale du questionnaire — août 2026

Version de banque : `2026.07-128q` → `2026.08-128q` → **`2026.08-128q-r2`** (`src/engine/versions.js`).

> ⚠️ **Correction du 2026-08-10.** La première publication de cette révision affirmait qu'aucun
> identifiant conservé n'avait changé de sens. **C'était faux.** Un contre-audit a établi que
> 44 des 93 questions réécrites avaient conservé leur identifiant malgré un changement de
> population, de seuil, de bénéficiaire, de dispositif ou de niveau institutionnel. 38 ont vu
> leur sens restauré, 6 ont été retirées et remplacées par de nouveaux identifiants. La
> classification des 93, question par question, est dans
> [`id-semantics-2026-08.json`](id-semantics-2026-08.json) et vérifiée par
> `tests/data/questions.id-semantics.test.mjs`.

Objectif : un questionnaire politique français lisible par un élève de 5e, où chaque question
mesure **une seule** proposition politique, et où aucun thème ne peut classer quelqu'un à une
extrémité simplement parce qu'il répond « d'accord » à tout.

Ce document est la trace des **arbitrages humains**. Les contrôles automatiques
(`npm run check:questions`, `tests/data/questions.editorial.test.mjs`) prouvent l'absence de
défauts *mécaniquement détectables* — pas l'absence d'ambiguïté. Les deux sont nécessaires ;
aucun ne remplace l'autre.

## Bilan chiffré

| | Avant | Après |
|---|---|---|
| Questions actives | 128 | 128 |
| Questions par thème | 16 | 16 |
| Questions CORE | 16 (2/thème) | 16 (2/thème) |
| Conservées telles quelles | — | **13** |
| Reformulées (même identifiant) | — | **93** |
| Retirées de la file active | — | **22** |
| Créées | — | **22** |
| Identifiants figés au registre | 38 | **60** |

## Règle d'identifiant appliquée

Un identifiant de question est une **clé de données** : des réponses persistées y sont
rattachées, dans `localStorage` comme dans `user_answers`. La règle suivante est celle qui
aurait dû être appliquée dès la première passe ; elle l'est maintenant, et elle est **vérifiée
par test** — la classification humaine des 93 réécritures est figée dans un registre, et un
identifiant classé « changement matériel » ne peut plus rester actif :

- **Même identifiant** — la proposition politique testée est préservée. Sont concernés : le
  registre de langue, la longueur, le passage à la voix active, la glose d'un terme technique,
  la suppression d'un intensificateur sans périmètre, la suppression d'une clause persuasive
  (« … pour protéger les travailleurs »). *Un répondant cohérent donne la même réponse.*
- **Nouvel identifiant, ancien retiré** — la proposition testée change : branche supprimée
  d'une question composite, mécanisme différent, périmètre restreint. *Un répondant cohérent
  peut donner une réponse différente.*

Le test décisif, appliqué aux 93 : *une réponse donnée à l'ancien texte reste-t-elle
strictement interprétable de la même manière avec le nouveau ?* Résultat :

| Verdict | Nombre | Catégories rencontrées |
|---|---|---|
| **Conservé** — simplification ou précision sans effet de sens | 49 | `simplification`, `precision` |
| **Restauré** — l'élément sémantique perdu a été remis dans la question | 38 | `population`, `seuil`, `mecanisme`, `beneficiaire`, `institution`, `perimetre` |
| **Nouvel identifiant** — changement irréductible, ancien retiré | 6 | `politique`, `institution`, `mecanisme`, `perimetre` |

Aucune direction de score n'a été inversée sur un identifiant conservé. Rééquilibrer les
comptes en basculant `direction: 1` en `-1` aurait faussé tous les profils déjà enregistrés
sans changer une seule phrase — c'est explicitement ce qu'il fallait ne pas faire.

Les 28 identifiants retirés restent lisibles dans `questions_final.json` et sont figés avec
leur libellé de l'époque dans `docs/questions/retired-ids.json`. Le test
« aucun identifiant retiré n'est réutilisé pour une autre opinion » échoue si l'un d'eux se met
à porter une autre proposition politique.

## Sens des formulations, avant / après

Nombre de questions dont l'accord fait **monter** le score du thème, contre celles dont
l'accord le fait **baisser**. Seuil retenu : au moins 4 formulations dans le sens minoritaire
par thème de 16.

| Thème | Avant | Après | |
|---|---|---|---|
| Économie | 5 / 11 | 5 / 11 | déjà conforme |
| Questions sociales | 12 / 4 | 12 / 4 | conforme, composition modifiée |
| Immigration | 9 / 7 | 8 / 8 | équilibré |
| Sécurité | 7 / 9 | 7 / 9 | déjà conforme |
| Environnement | 13 / **3** | 12 / **4** | corrigé |
| Démocratie | 15 / **1** | 12 / **4** | corrigé |
| Mondialisation | 8 / 8 | 8 / 8 | déjà conforme |
| Services publics | 13 / **3** | 12 / **4** | corrigé |

Aucun 50/50 n'a été forcé : la cohérence de chaque dimension prime. Les quatre thèmes corrigés
l'ont été en **écrivant de nouvelles questions de sens inverse** portant sur des sous-dimensions
qui n'étaient pas couvertes (verticalité de l'exécutif, technocratie, énergies renouvelables,
instruments de la transition, assurance chômage), pas en retournant des métadonnées.

## Ce qui a été corrigé, par famille de défaut

| Défaut | Nombre | Exemples |
|---|---|---|
| Question composite (deux décisions) | 10 | `ECO_8`, `SEC_20`, `IMM_15`, `SOC_24`, `PUB_9`, `ENV_23`, `GLO_17`, `DEM_15`, `SOC_25`, `SOC_26` |
| Quasi-doublon en miroir | 5 | `SOC_19`~`SOC_6`, `IMM_13`~`IMM_7`, `ENV_24`~`ENV_2`, `PUB_17`~`PUB_3`, `DEM_3`~`DEM_24` |
| Intensificateur sans périmètre | 13 | « sensiblement », « fortement », « massivement », « significativement », « davantage » |
| Franglais dans le contenu public | 3 | « testing », « digital », « lobbying » |
| Tautologie / question non mesurable | 3 | `ENV_11`, `ENV_14`, `IMM_6` |
| Double négation | 1 | `PUB_1` |
| Explication recopiant la question | 3 | `GLO_3`, `IMM_12`, `GLO_13` |
| Clause persuasive orientant la réponse | 8 | `ECO_13`, `IMM_5`, `ENV_9`, `ENV_22`, `PUB_15`, `DEM_7`, `DEM_13`, `ENV_3` |

`ENV_11` mérite un mot : « La désobéissance civile pour le climat doit pouvoir être sanctionnée
lorsqu'elle enfreint la loi » était **tautologique** — enfreindre la loi est sanctionnable par
définition. Elle ne mesurait rien. Aucune heuristique ne détecte ce défaut ; seule la relecture
le voit.

## Ambiguïtés résiduelles assumées

⚠️ **Révisé le 2026-08-10 après contre-audit.** Quatre points de cette liste étaient de faux
arbitrages : c'étaient des défauts à corriger, pas des imprécisions à assumer. Ils l'ont été.

Corrigés depuis :

- **`SOC_20`** — la question laissait deviner qui est puni. Les deux populations sont
  désormais nommées dans la question elle-même : « La loi ne doit punir ni les personnes qui se
  prostituent ni leurs clients. » Une ambiguïté de la question ne se répare pas dans
  l'explication.
- **`GLO_16`** — « produire ce dont elle a besoin » n'avait aucune limite assignable. Retirée,
  remplacée par `GLO_27`, limitée à l'énergie.
- **`GLO_22`** — « défense de la culture française » ne désignait aucune politique publique
  identifiable. Retirée, remplacée par `GLO_28` (quotas de chansons françaises à la radio).
- **`DEM_28`** — « pouvoir politique fort » était une notion abstraite. Remplacée par un
  dispositif nommé : « Le gouvernement doit pouvoir faire adopter une loi sans vote des députés. »

Subsistent volontairement :

1. **`IMM_3` — « depuis longtemps ».** Le débat français sur la régularisation par ancienneté
   n'a pas de seuil consensuel. Inventer « dix ans » aurait fabriqué un chiffre que personne ne
   défend sous cette forme. L'imprécision porte sur la population visée, pas sur la politique.
2. **`ENV_7` — « à essence et diesel ».** Seule coordination conservée dans la banque. Elle
   nomme une catégorie de véhicules par ses deux carburants ; le calendrier européen de 2035
   porte sur cette catégorie prise ensemble. Exception déclarée et testée.
3. **`ECO_28` — « strictement ».** Seul intensificateur conservé. Le degré d'encadrement de
   l'intelligence artificielle EST la ligne de partage politique ; le retirer avait affaibli le
   seuil et changé le sens. Exception déclarée et testée.
4. **`ECO_10` et `PUB_7` — revenu de base.** Deux questions proches mais distinctes :
   l'existence d'un revenu universel (`ECO_10`) et sa substitution aux aides existantes
   (`PUB_7`). Similarité mesurée sous le seuil. Conservées séparément, sciemment.
5. **`GLO_3` et `GLO_23` — OTAN.** L'utilité de l'alliance et l'appartenance au commandement
   intégré sont deux positions distinctes en France ; on peut tenir la première sans la seconde.
6. **`ENV_25` et `ENV_26` — agriculture.** L'allègement des normes européennes et l'interdiction
   des pesticides dangereux sont deux mécanismes différents. Rapprochement assumé :
   l'agriculture est la principale ligne de fracture environnementale française.
7. **`DEM_8` et `DEM_19` — financement des partis.** Interdire les gros dons privés et financer
   les partis par l'État sont deux décisions séparables mais politiquement solidaires, toutes
   deux ↑. Similarité sous le seuil ; le risque est éditorial, pas lexical.
8. **Niveau de lecture.** Aucune mesure automatique de lisibilité française n'a été utilisée :
   elles sont peu fiables sur des phrases de moins de 25 mots. Le contrôle porte sur la
   longueur, les sigles, la voix passive et le jargon, relus un par un.

## Ce que les contrôles automatiques ne prouvent pas

- Qu'aucune personne ne peut interpréter une phrase autrement que prévu.
- Qu'aucune question ne penche subtilement d'un côté par le choix des mots.
- Que la direction de score attribuée à chaque question est la bonne lecture politique.
- Que les explications sont neutres et à jour. **C'est le chantier suivant** : la refonte des
  définitions, contextes et sources (schéma structuré, sources primaires datées) n'est PAS
  couverte par cette révision. Les explications ont seulement été corrigées là où la
  reformulation les rendait fausses, redondantes ou anglicisées.

## Checklist éditoriale humaine — relecture par thème

Relecture à l'aveugle effectuée le 2026-08-10 sur les seules formulations finales, sans les
textes d'origine sous les yeux.

| Thème | Une seule décision par question | Français naturel | Sens des formulations | Couverture |
|---|---|---|---|---|
| Économie | ✔ | ✔ | ✔ 5 minoritaires | fiscalité, redistribution, propriété publique, travail, dette, plateformes, IA |
| Questions sociales | ✔ | ✔ | ✔ 4 minoritaires | droits individuels, famille, laïcité, bioéthique, discriminations, fin de vie |
| Immigration | ✔ | ✔ | ✔ 8 minoritaires | volume, asile, intégration, nationalité, régularisation, frontières, soins, famille |
| Sécurité | ✔ | ✔ | ✔ 7 minoritaires | pouvoirs de police, justice, peine, réinsertion, libertés publiques, renseignement |
| Environnement | ✔ | ✔ | ✔ 4 minoritaires | climat, énergie, transport, agriculture, consommation, logement, instruments |
| Démocratie | ✔ | ✔ | ✔ 4 minoritaires | institutions, scrutin, référendum, contre-pouvoirs, médias, transparence, exécutif |
| Mondialisation | ✔ | ✔ | ✔ 8 minoritaires | Union européenne, défense, alliances, commerce, souveraineté, interventions |
| Services publics | ✔ | ✔ | ✔ 4 minoritaires | santé, école, logement, transport, petite enfance, retraites, chômage |

Point relevé et non corrigé : la **culture** reste absente des services publics (elle n'est
couverte qu'indirectement par `GLO_22`). Ajouter une question culturelle supposerait d'en
retirer une autre ; l'arbitrage est laissé ouvert.

## Matrice détaillée

Colonnes calculées :

- **Sens** — effet de l'accord sur le score du thème (`direction`).
- **Composite avant** — la formulation d'origine contenait-elle une coordination ou une
  locution d'empilement.
- **Acquiescement** — *proxy documenté, pas une mesure* : « faible » si la question expose
  explicitement son coût ou son arbitrage, « élevé » si elle n'énonce qu'un but désirable,
  « moyen » sinon.
- **Lisibilité** — nombre de mots. Cible éditoriale 8–20, plafond bloquant 24.


### Économie (`ECONOMY`)

| ID | Formulation retenue | Sous-dimension | Sens | Niveau | Composite avant | Acquiescement | Lisibilité | Décision |
|---|---|---|---|---|---|---|---|---|
| `ECO_1` | Les impôts sur les plus hauts revenus doivent augmenter. | redistribution des revenus | accord → bas | SECONDARY | non | moyen | facile (9 mots) | conservée |
| `ECO_3` | Les impôts sur les bénéfices des entreprises doivent baisser. | impôt sur les sociétés | accord → haut | SECONDARY | non | moyen | facile (9 mots) | conservée |
| `ECO_4` | L'impôt sur la fortune doit aussi porter sur les placements financiers, pas seulement sur l'immobilier. | impôt sur la fortune | accord → bas | PRIMARY | oui | moyen | moyenne (15 mots) | reformulée |
| `ECO_5` | L'État doit réduire ses dépenses publiques. | dépenses publiques | accord → haut | SECONDARY | non | moyen | facile (6 mots) | conservée |
| `ECO_6` | Les syndicats doivent avoir plus de pouvoir dans les entreprises. | relations sociales en entreprise | accord → bas | SECONDARY | non | moyen | facile (10 mots) | reformulée |
| `ECO_9` | L'État doit imposer des règles plus strictes à la finance. | régulation de la finance | accord → bas | SECONDARY | non | moyen | facile (10 mots) | reformulée |
| `ECO_10` | Un revenu universel de base doit être versé à tous les citoyens, sans conditions. | revenu universel | accord → bas | SECONDARY | non | moyen | moyenne (14 mots) | conservée |
| `ECO_11` | Réduire la dette française doit être la priorité budgétaire. | dette publique | accord → haut | SECONDARY | non | moyen | facile (9 mots) | conservée |
| `ECO_13` | L'État doit imposer plus de règles aux plateformes numériques comme Uber. | travail de plateforme | accord → bas | SECONDARY | non | moyen | facile (11 mots) | reformulée |
| `ECO_15` | Les entreprises publiques doivent être privatisées. | privatisations | accord → haut | SECONDARY | non | moyen | facile (6 mots) | conservée |
| `ECO_19` | La semaine de 4 jours doit être imposée par la loi. | temps de travail | accord → bas | SECONDARY | non | moyen | facile (11 mots) | conservée |
| `ECO_23` | La priorité doit être la croissance économique, même si les inégalités augmentent. | croissance contre égalité | accord → haut | CORE | non | faible | facile (12 mots) | reformulée |
| `ECO_24` | Les multinationales doivent payer un impôt minimum plus élevé dans tous les pays. | fiscalité internationale | accord → bas | SECONDARY | non | moyen | moyenne (13 mots) | reformulée |
| `ECO_26` | L'âge de départ à la retraite doit être abaissé en dessous de 64 ans. | retraites | accord → bas | SECONDARY | non | moyen | moyenne (14 mots) | reformulée |
| `ECO_28` | La loi doit encadrer l'intelligence artificielle, même si cela ralentit l'innovation. | régulation des technologies | accord → bas | PRIMARY | non | faible | facile (11 mots) | reformulée |
| `ECO_29` | L'État doit être propriétaire des grandes entreprises de l'énergie. | propriété publique | accord → bas | CORE | — | moyen | facile (9 mots) | **créée** |

**Retirées de la file active** (conservées dans `questions_final.json` pour les réponses historiques) :

- `ECO_8` — « L'État doit nationaliser les secteurs stratégiques comme l'énergie et les transports. »
  → Question composite : nationaliser l’énergie et nationaliser les transports sont deux décisions distinctes. Remplacée par ECO_29, limitée à l’énergie.

### Questions sociales (`SOCIAL`)

| ID | Formulation retenue | Sous-dimension | Sens | Niveau | Composite avant | Acquiescement | Lisibilité | Décision |
|---|---|---|---|---|---|---|---|---|
| `SOC_3` | Le cannabis doit être vendu légalement sous le contrôle de l'État. | politique des drogues | accord → haut | SECONDARY | oui | moyen | facile (11 mots) | reformulée |
| `SOC_5` | La religion doit avoir plus d'influence sur les lois françaises. | religion et loi | accord → bas | SECONDARY | non | moyen | facile (10 mots) | reformulée |
| `SOC_6` | Une personne transgenre doit pouvoir changer son état civil sans passer par un médecin. | identité de genre | accord → haut | SECONDARY | non | moyen | moyenne (14 mots) | reformulée |
| `SOC_7` | L'État doit encourager le modèle de la famille traditionnelle. | valeurs familiales | accord → bas | CORE | non | moyen | facile (9 mots) | reformulée |
| `SOC_8` | La loi doit punir plus sévèrement les propos haineux. | discours de haine | accord → haut | SECONDARY | non | moyen | facile (9 mots) | reformulée |
| `SOC_10` | L'euthanasie doit être autorisée pour les malades incurables qui la demandent. | fin de vie | accord → haut | SECONDARY | non | moyen | facile (11 mots) | reformulée |
| `SOC_14` | Les sites pornographiques doivent vérifier l'âge de leurs visiteurs. | protection des mineurs en ligne | accord → bas | SECONDARY | non | moyen | facile (9 mots) | reformulée |
| `SOC_16` | Les élèves doivent pouvoir porter des signes religieux visibles à l'école publique. | laïcité à l école | accord → haut | CORE | non | moyen | facile (12 mots) | reformulée |
| `SOC_20` | La loi ne doit pas punir la prostitution entre adultes consentants. | travail du sexe | accord → haut | SECONDARY | non | moyen | facile (11 mots) | reformulée |
| `SOC_22` | On doit pouvoir critiquer les religions, même si cela choque des croyants. | liberté de critique religieuse | accord → haut | SECONDARY | non | faible | facile (12 mots) | reformulée |
| `SOC_23` | L'éducation à la sexualité à l'école doit aborder le consentement. | éducation à la sexualité | accord → haut | SECONDARY | non | moyen | facile (10 mots) | reformulée |
| `SOC_27` | L'État doit infliger des amendes aux entreprises qui paient moins les femmes que les hommes. | égalité salariale | accord → haut | SECONDARY | oui | moyen | moyenne (15 mots) | reformulée |
| `SOC_28` | Le recours à une mère porteuse doit rester interdit en France. | bioéthique | accord → bas | SECONDARY | — | moyen | facile (11 mots) | **créée** |
| `SOC_29` | Le droit à l'avortement doit rester protégé par la Constitution. | avortement | accord → haut | SECONDARY | — | moyen | facile (10 mots) | **créée** |
| `SOC_30` | La procréation médicalement assistée doit rester accessible aux femmes seules. | aide à la procréation | accord → haut | SECONDARY | — | élevé | facile (10 mots) | **créée** |
| `SOC_31` | L'État doit contrôler les entreprises pour repérer les discriminations à l'embauche. | discriminations à l embauche | accord → haut | SECONDARY | — | moyen | facile (11 mots) | **créée** |

**Retirées de la file active** (conservées dans `questions_final.json` pour les réponses historiques) :

- `SOC_19` — « L'identité de genre reconnue par l'état civil doit correspondre au sexe inscrit à la naissance. »
  → Quasi-doublon en miroir de SOC_6 : même sous-dimension (état civil et identité de genre), ce qui doublait le poids de cette seule opinion dans le thème.
- `SOC_24` — « Le droit à l'avortement doit être garanti et accessible à toutes les femmes sur tout le territoire. »
  → Question composite : garantir le droit à l’avortement et le rendre accessible partout sont deux décisions distinctes. Remplacée par SOC_29.
- `SOC_25` — « La procréation médicalement assistée (PMA) doit être accessible aux couples de femmes et aux femmes seules. »
  → Question composite : ouvrir la procréation médicalement assistée aux couples de femmes et aux femmes seules sont deux décisions distinctes. Remplacée par SOC_30.
- `SOC_26` — « L'État doit prendre des mesures concrètes pour réduire les discriminations liées à l'origine ethnique. »
  → Formulation non mesurable (« prendre des mesures concrètes ») et explication contenant du franglais. Remplacée par SOC_31, qui nomme un mécanisme précis.

### Immigration (`IMMIGRATION`)

| ID | Formulation retenue | Sous-dimension | Sens | Niveau | Composite avant | Acquiescement | Lisibilité | Décision |
|---|---|---|---|---|---|---|---|---|
| `IMM_1` | La France doit accueillir moins d'immigrés qu'aujourd'hui. | volume de l immigration | accord → haut | CORE | non | moyen | facile (7 mots) | reformulée |
| `IMM_2` | Les demandeurs d'asile doivent pouvoir travailler dès qu'ils déposent leur demande. | travail des demandeurs d asile | accord → bas | SECONDARY | non | moyen | facile (11 mots) | reformulée |
| `IMM_3` | Les étrangers sans papiers qui vivent en France depuis longtemps doivent pouvoir être régularisés. | régularisation | accord → bas | SECONDARY | non | moyen | moyenne (14 mots) | reformulée |
| `IMM_5` | La France doit rétablir des contrôles systématiques à ses frontières. | frontières | accord → haut | SECONDARY | non | moyen | facile (10 mots) | reformulée |
| `IMM_7` | L'État doit aider les immigrés à préserver leur culture d'origine. | multiculturalisme | accord → bas | SECONDARY | oui | élevé | facile (10 mots) | reformulée |
| `IMM_8` | Les étrangers qui travaillent légalement en France doivent avoir les mêmes aides sociales que les Français. | droits sociaux des étrangers | accord → bas | SECONDARY | oui | moyen | moyenne (16 mots) | reformulée |
| `IMM_9` | La France doit accueillir des personnes qui fuient les catastrophes liées au climat. | déplacements climatiques | accord → bas | SECONDARY | non | moyen | moyenne (13 mots) | reformulée |
| `IMM_12` | Un étranger condamné pour un crime grave doit être expulsé de France. | éloignement après condamnation | accord → haut | SECONDARY | non | moyen | facile (12 mots) | reformulée |
| `IMM_14` | Les demandes d'asile doivent être examinées à l'étranger, avant l'arrivée en France. | asile examiné à l étranger | accord → haut | SECONDARY | non | moyen | facile (12 mots) | reformulée |
| `IMM_16` | La France doit fixer chaque année un nombre maximum d'immigrés à accueillir. | quotas d immigration | accord → haut | SECONDARY | non | moyen | facile (12 mots) | reformulée |
| `IMM_20` | Les immigrés doivent apprendre le français pour pouvoir rester durablement en France. | condition de langue | accord → haut | SECONDARY | non | moyen | facile (12 mots) | reformulée |
| `IMM_21` | Les pays européens doivent être obligés d'accueillir chacun une part des demandeurs d'asile. | répartition européenne de l asile | accord → bas | SECONDARY | non | moyen | moyenne (13 mots) | reformulée |
| `IMM_23` | Tout enfant né en France doit pouvoir devenir français, quelle que soit la nationalité de ses parents. | accès à la nationalité | accord → bas | CORE | non | moyen | moyenne (17 mots) | reformulée |
| `IMM_24` | Un étranger doit avoir des revenus suffisants pour faire venir sa famille en France. | regroupement familial | accord → haut | SECONDARY | — | moyen | moyenne (14 mots) | **créée** |
| `IMM_25` | Les étrangers sans papiers doivent pouvoir se faire soigner gratuitement. | accès aux soins | accord → bas | SECONDARY | — | élevé | facile (10 mots) | **créée** |
| `IMM_26` | La France doit expulser tous les étrangers dont la demande d'asile a été refusée. | éloignement des déboutés | accord → haut | SECONDARY | — | moyen | moyenne (14 mots) | **créée** |

**Retirées de la file active** (conservées dans `questions_final.json` pour les réponses historiques) :

- `IMM_13` — « L'identité nationale française doit primer sur les autres appartenances culturelles dans l'intégration des enfants d'immigrés. »
  → Quasi-doublon en miroir de IMM_7 : même sous-dimension (place des cultures d’origine). Formulation abstraite (« primer sur les appartenances culturelles »).
- `IMM_15` — « Les immigrés qui demandent un titre de séjour doivent passer un test de langue et de valeurs républicaines. »
  → Question composite : test de langue et test de valeurs républicaines sont deux conditions distinctes. Le volet langue reste couvert par IMM_20.
- `IMM_6` — « La délivrance d'un titre de séjour durable doit être conditionnée à une évaluation de l'intégration. »
  → Formulation administrative et non mesurable (« évaluation de l’intégration »), redondante avec IMM_15 et IMM_20. Retirée sans remplacement direct.

### Sécurité (`SECURITY`)

| ID | Formulation retenue | Sous-dimension | Sens | Niveau | Composite avant | Acquiescement | Lisibilité | Décision |
|---|---|---|---|---|---|---|---|---|
| `SEC_1` | La surveillance des communications doit être réservée aux personnes soupçonnées d'un crime. | surveillance des communications | accord → bas | SECONDARY | non | moyen | facile (12 mots) | reformulée |
| `SEC_3` | Il est justifié de limiter certaines libertés pour lutter contre le terrorisme. | sécurité contre libertés | accord → haut | CORE | non | moyen | facile (12 mots) | reformulée |
| `SEC_4` | La reconnaissance faciale par la police doit être interdite. | reconnaissance faciale | accord → bas | SECONDARY | non | moyen | facile (9 mots) | conservée |
| `SEC_5` | Les peines de prison doivent être plus longues. | sévérité des peines | accord → haut | SECONDARY | non | moyen | facile (8 mots) | conservée |
| `SEC_6` | La prison doit d'abord servir à préparer la réinsertion des détenus. | réinsertion | accord → bas | SECONDARY | non | moyen | facile (11 mots) | reformulée |
| `SEC_8` | Le Parlement doit contrôler l'activité des services secrets. | contrôle des services secrets | accord → bas | SECONDARY | non | moyen | facile (8 mots) | reformulée |
| `SEC_9` | Posséder de la drogue pour sa consommation personnelle ne doit plus être un délit. | usage personnel de drogues | accord → bas | SECONDARY | non | moyen | moyenne (14 mots) | reformulée |
| `SEC_11` | L'État doit pouvoir retirer la nationalité française aux personnes condamnées pour terrorisme. | déchéance de nationalité | accord → haut | SECONDARY | non | moyen | facile (12 mots) | reformulée |
| `SEC_12` | La police doit pouvoir lire les messages privés protégés des personnes suspectes. | accès aux messages chiffrés | accord → haut | SECONDARY | non | moyen | facile (12 mots) | reformulée |
| `SEC_13` | Les caméras portées par les policiers doivent filmer en continu pendant leur service. | caméras-piétons | accord → bas | SECONDARY | non | moyen | moyenne (13 mots) | reformulée |
| `SEC_14` | Les mineurs qui commettent un délit doivent être jugés moins sévèrement que les adultes. | justice des mineurs | accord → bas | SECONDARY | non | moyen | moyenne (14 mots) | reformulée |
| `SEC_19` | Une personne condamnée pour terrorisme doit pouvoir rester enfermée après avoir purgé sa peine. | rétention après peine | accord → haut | SECONDARY | non | moyen | moyenne (14 mots) | reformulée |
| `SEC_21` | La loi doit protéger les salariés qui révèlent des faits illégaux commis par leur employeur. | lanceurs d alerte | accord → bas | SECONDARY | non | élevé | moyenne (15 mots) | reformulée |
| `SEC_25` | Les enquêtes sur les policiers accusés de violences doivent être menées par un service indépendant. | contrôle de la police | accord → bas | CORE | non | moyen | moyenne (15 mots) | reformulée |
| `SEC_26` | La police doit pouvoir contrôler l'identité de toute personne, sans motif précis. | pouvoirs de contrôle | accord → haut | SECONDARY | — | moyen | facile (12 mots) | **créée** |
| `SEC_27` | Les personnes condamnées à de la prison doivent toutes exécuter leur peine, même courte. | exécution des peines | accord → haut | SECONDARY | — | moyen | moyenne (14 mots) | **créée** |

**Retirées de la file active** (conservées dans `questions_final.json` pour les réponses historiques) :

- `SEC_20` — « La police doit avoir plus de pouvoirs de contrôle et de fouille. »
  → Question composite : pouvoirs de contrôle et pouvoirs de fouille sont deux décisions distinctes. Remplacée par SEC_26, limitée aux contrôles d’identité.
- `SEC_23` — « La police doit avoir plus de pouvoirs pour maintenir l'ordre dans les quartiers difficiles. »
  → Formulation non mesurable (« plus de pouvoirs ») doublant SEC_20, avec un périmètre stigmatisant (« quartiers difficiles »).

### Environnement (`ENVIRONMENT`)

| ID | Formulation retenue | Sous-dimension | Sens | Niveau | Composite avant | Acquiescement | Lisibilité | Décision |
|---|---|---|---|---|---|---|---|---|
| `ENV_1` | La lutte contre le changement climatique doit être la première priorité du gouvernement. | priorité climatique | accord → haut | SECONDARY | non | moyen | moyenne (13 mots) | reformulée |
| `ENV_2` | La France doit construire de nouveaux réacteurs nucléaires. | nucléaire | accord → haut | SECONDARY | non | moyen | facile (8 mots) | conservée |
| `ENV_3` | Le prix du carbone doit augmenter, même si cela fait monter le prix de l'essence. | prix du carbone | accord → haut | CORE | non | faible | moyenne (15 mots) | reformulée |
| `ENV_4` | Les normes écologiques doivent être maintenues, même si elles coûtent des emplois. | normes contre emplois | accord → haut | SECONDARY | non | faible | facile (12 mots) | reformulée |
| `ENV_7` | Les voitures à essence et diesel doivent être interdites à la vente avant 2035. | transport automobile | accord → haut | SECONDARY | non | moyen | moyenne (14 mots) | reformulée |
| `ENV_8` | L'État doit renoncer à faire de la croissance économique son objectif principal. | décroissance | accord → haut | SECONDARY | non | moyen | facile (12 mots) | reformulée |
| `ENV_9` | La consommation de viande doit être découragée par une taxe. | alimentation | accord → haut | SECONDARY | non | moyen | facile (10 mots) | reformulée |
| `ENV_10` | Les pays riches doivent indemniser les pays pauvres pour les dégâts du changement climatique. | justice climatique internationale | accord → haut | SECONDARY | non | élevé | moyenne (14 mots) | reformulée |
| `ENV_15` | Les plastiques jetables doivent être totalement interdits. | déchets | accord → haut | SECONDARY | non | moyen | facile (7 mots) | reformulée |
| `ENV_22` | La circulation des voitures dans les centres-villes doit être limitée. | mobilité urbaine | accord → haut | SECONDARY | non | moyen | facile (10 mots) | reformulée |
| `ENV_25` | Les règles écologiques imposées aux agriculteurs doivent être allégées. | normes agricoles | accord → bas | CORE | non | moyen | facile (9 mots) | reformulée |
| `ENV_26` | Les pesticides les plus dangereux doivent être interdits, même sans solution de remplacement. | pesticides | accord → haut | SECONDARY | — | faible | moyenne (13 mots) | **créée** |
| `ENV_27` | Les militants qui bloquent une route pour le climat doivent être condamnés. | désobéissance climatique | accord → bas | SECONDARY | — | moyen | facile (12 mots) | **créée** |
| `ENV_28` | La France doit arrêter de construire de nouvelles éoliennes. | énergies renouvelables | accord → bas | SECONDARY | — | moyen | facile (9 mots) | **créée** |
| `ENV_29` | La transition écologique doit reposer sur des incitations plutôt que sur des interdictions. | instruments de la transition | accord → bas | SECONDARY | — | faible | moyenne (13 mots) | **créée** |
| `ENV_30` | Les logements mal isolés ne doivent plus pouvoir être loués. | logement et énergie | accord → haut | SECONDARY | — | moyen | facile (10 mots) | **créée** |

**Retirées de la file active** (conservées dans `questions_final.json` pour les réponses historiques) :

- `ENV_11` — « La désobéissance civile pour le climat doit pouvoir être sanctionnée lorsqu'elle enfreint la loi. »
  → Question tautologique : sanctionner une action « lorsqu’elle enfreint la loi » ne mesure aucune opinion. Remplacée par ENV_27.
- `ENV_14` — « La géo-ingénierie doit être étudiée comme solution climatique. »
  → Terme technique non expliqué (« géo-ingénierie ») et verbe sans portée politique (« doit être étudiée »). Remplacée par ENV_28.
- `ENV_23` — « Une réduction volontaire de la production et de la consommation est nécessaire pour respecter les limites de la planète. »
  → Question composite : réduire la production et réduire la consommation sont deux décisions distinctes. Sujet déjà couvert par ENV_8.
- `ENV_24` — « La France doit sortir du nucléaire dans les vingt prochaines années. »
  → Quasi-doublon en miroir de ENV_2 sur le nucléaire, avec un horizon arbitraire (« vingt prochaines années »).
- `ENV_6` — « L'agriculture intensive doit être fortement réglementée. »
  → Intensificateur sans périmètre (« fortement réglementée ») sur un objet non défini (« agriculture intensive »). Remplacée par ENV_26, qui nomme les pesticides.

### Démocratie (`DEMOCRACY`)

| ID | Formulation retenue | Sous-dimension | Sens | Niveau | Composite avant | Acquiescement | Lisibilité | Décision |
|---|---|---|---|---|---|---|---|---|
| `DEM_5` | Les députés doivent être élus à la proportionnelle, selon le score de chaque parti. | mode de scrutin | accord → haut | SECONDARY | non | moyen | moyenne (14 mots) | reformulée |
| `DEM_6` | L'âge du vote doit être abaissé à 16 ans. | âge du vote | accord → haut | SECONDARY | non | moyen | facile (9 mots) | conservée |
| `DEM_7` | Les électeurs doivent pouvoir révoquer un élu avant la fin de son mandat. | révocation des élus | accord → haut | SECONDARY | non | moyen | moyenne (13 mots) | reformulée |
| `DEM_8` | Les partis politiques ne doivent plus pouvoir recevoir de dons privés. | financement privé des partis | accord → haut | CORE | non | moyen | facile (11 mots) | reformulée |
| `DEM_10` | L'état d'urgence doit prendre fin au bout de 30 jours, sauf prolongation votée par le Parlement. | pouvoirs d urgence | accord → haut | SECONDARY | non | faible | moyenne (16 mots) | reformulée |
| `DEM_13` | L'État doit imposer aux chaînes de télévision un temps de parole équilibré entre les partis. | régulation des médias | accord → haut | SECONDARY | non | moyen | moyenne (15 mots) | reformulée |
| `DEM_14` | Un parlementaire doit pouvoir être poursuivi en justice comme tout autre citoyen. | immunité parlementaire | accord → haut | SECONDARY | non | moyen | facile (12 mots) | reformulée |
| `DEM_16` | Le Conseil constitutionnel doit pouvoir annuler une loi votée par le Parlement. | contrôle de constitutionnalité | accord → haut | SECONDARY | non | moyen | facile (12 mots) | reformulée |
| `DEM_19` | Les partis politiques doivent être financés par l'État. | financement public des partis | accord → haut | SECONDARY | non | moyen | facile (8 mots) | reformulée |
| `DEM_21` | Le gouvernement doit pouvoir révoquer un juge. | indépendance des juges | accord → bas | CORE | non | moyen | facile (7 mots) | reformulée |
| `DEM_24` | Les citoyens doivent pouvoir demander un référendum en réunissant assez de signatures. | démocratie directe | accord → haut | SECONDARY | non | moyen | facile (12 mots) | reformulée |
| `DEM_25` | Une même personne ne doit pas pouvoir posséder plusieurs grands médias. | concentration des médias | accord → haut | SECONDARY | non | moyen | facile (11 mots) | reformulée |
| `DEM_26` | L'administration doit publier les règles des algorithmes qui décident, comme Parcoursup. | transparence des algorithmes | accord → haut | PRIMARY | non | moyen | facile (11 mots) | reformulée |
| `DEM_27` | Le président doit pouvoir prendre seul les décisions importantes en cas de crise grave. | pouvoir exécutif | accord → bas | SECONDARY | — | moyen | moyenne (14 mots) | **créée** |
| `DEM_28` | Un pouvoir politique fort vaut mieux qu'un pouvoir limité par de nombreux contrôles. | contre-pouvoirs | accord → bas | SECONDARY | — | moyen | moyenne (13 mots) | **créée** |
| `DEM_29` | Les grandes décisions politiques doivent être prises par des experts plutôt que par des élus. | expertise contre élection | accord → bas | SECONDARY | — | faible | moyenne (15 mots) | **créée** |

**Retirées de la file active** (conservées dans `questions_final.json` pour les réponses historiques) :

- `DEM_1` — « Le vote doit être obligatoire pour tous. »
  → Rattachement contestable à l’axe démocratique : le vote obligatoire mesure autant une conception de la contrainte que de la participation. Retirée au profit de formulations de sens inverse.
- `DEM_15` — « Le lobbying d'entreprises doit être strictement régulé et transparent. »
  → Question composite (réguler et rendre transparent) contenant en outre un anglicisme non traduit. Remplacée par DEM_28.
- `DEM_3` — « Les citoyens doivent pouvoir déclencher un référendum sur n'importe quelle loi par voie de pétition. »
  → Quasi-doublon de DEM_24, qui nomme le même mécanisme sous son nom français (référendum d’initiative citoyenne).

### Mondialisation (`GLOBAL`)

| ID | Formulation retenue | Sous-dimension | Sens | Niveau | Composite avant | Acquiescement | Lisibilité | Décision |
|---|---|---|---|---|---|---|---|---|
| `GLO_1` | L'intérêt de la France doit passer avant le respect des traités internationaux. | primauté nationale | accord → bas | CORE | non | moyen | facile (12 mots) | reformulée |
| `GLO_3` | L'OTAN est indispensable à la sécurité de la France. | alliance atlantique | accord → haut | SECONDARY | non | moyen | facile (9 mots) | reformulée |
| `GLO_4` | La France doit augmenter l'aide qu'elle verse aux pays pauvres. | aide au développement | accord → haut | SECONDARY | non | moyen | facile (10 mots) | reformulée |
| `GLO_6` | La France doit taxer les produits importés pour protéger ses usines. | protection commerciale | accord → bas | SECONDARY | non | élevé | facile (11 mots) | reformulée |
| `GLO_7` | La France doit sanctionner économiquement les régimes autoritaires. | sanctions économiques | accord → haut | SECONDARY | oui | moyen | facile (8 mots) | reformulée |
| `GLO_8` | L'Union européenne doit décider de plus de choses à la place des États. | intégration européenne | accord → haut | CORE | non | moyen | moyenne (13 mots) | reformulée |
| `GLO_11` | La France doit réduire sa dépendance à la Chine. | dépendance à la Chine | accord → bas | SECONDARY | non | moyen | facile (9 mots) | conservée |
| `GLO_12` | La France doit verser des réparations financières à ses anciennes colonies. | réparations coloniales | accord → haut | SECONDARY | non | moyen | facile (11 mots) | reformulée |
| `GLO_13` | La Cour pénale internationale doit pouvoir juger les crimes de guerre de tous les pays. | justice pénale internationale | accord → haut | SECONDARY | non | moyen | moyenne (15 mots) | reformulée |
| `GLO_14` | La France doit empêcher des entreprises étrangères de racheter ses entreprises stratégiques. | propriété étrangère | accord → bas | SECONDARY | non | moyen | facile (12 mots) | reformulée |
| `GLO_15` | La France doit pouvoir intervenir militairement pour stopper un massacre, même sans accord de l'ONU. | intervention militaire | accord → haut | SECONDARY | non | faible | moyenne (15 mots) | reformulée |
| `GLO_16` | La France doit produire sur son sol ce dont elle a besoin, plutôt que d'importer. | autonomie stratégique | accord → bas | SECONDARY | oui | faible | moyenne (15 mots) | reformulée |
| `GLO_22` | L'État doit financer la défense de la culture française. | politique culturelle | accord → bas | SECONDARY | oui | élevé | facile (9 mots) | reformulée |
| `GLO_23` | La France ne doit plus placer ses armées sous le commandement de l'OTAN. | commandement de l OTAN | accord → bas | SECONDARY | non | moyen | moyenne (13 mots) | reformulée |
| `GLO_25` | La France doit continuer à envoyer des armes à l'Ukraine. | Ukraine | accord → haut | SECONDARY | non | moyen | facile (10 mots) | reformulée |
| `GLO_26` | La France doit rester neutre dans les conflits entre grandes puissances. | non-alignement | accord → bas | SECONDARY | — | moyen | facile (11 mots) | **créée** |

**Retirées de la file active** (conservées dans `questions_final.json` pour les réponses historiques) :

- `GLO_17` — « La France doit adopter une politique étrangère plus neutre et réduire ses engagements militaires à l'étranger. »
  → Question composite : adopter une politique étrangère neutre et réduire les engagements militaires sont deux décisions distinctes. Remplacée par GLO_26, limitée à la neutralité.

### Services publics (`PUBLIC_SERVICES`)

| ID | Formulation retenue | Sous-dimension | Sens | Niveau | Composite avant | Acquiescement | Lisibilité | Décision |
|---|---|---|---|---|---|---|---|---|
| `PUB_3` | Les services publics doivent être ouverts à la concurrence des entreprises privées. | public contre privé | accord → bas | SECONDARY | non | moyen | facile (12 mots) | reformulée |
| `PUB_4` | Les retraites doivent rester financées par les cotisations plutôt que par l'épargne personnelle. | financement des retraites | accord → haut | SECONDARY | non | faible | moyenne (13 mots) | reformulée |
| `PUB_6` | L'État doit construire plus de logements sociaux. | logement social | accord → haut | SECONDARY | non | moyen | facile (7 mots) | reformulée |
| `PUB_7` | Un revenu de base versé à tous doit remplacer les aides sociales actuelles. | revenu de base | accord → haut | SECONDARY | non | moyen | moyenne (13 mots) | reformulée |
| `PUB_11` | L'État doit plafonner les loyers dans les grandes villes. | encadrement des loyers | accord → haut | SECONDARY | non | moyen | facile (9 mots) | conservée |
| `PUB_12` | Les transports en commun doivent être gratuits. | transports publics | accord → haut | SECONDARY | non | élevé | facile (7 mots) | reformulée |
| `PUB_13` | Les dépenses sociales de la France doivent baisser. | dépenses sociales | accord → bas | CORE | non | moyen | facile (8 mots) | reformulée |
| `PUB_14` | L'État doit garantir un emploi à toute personne qui en cherche un. | garantie d emploi | accord → haut | SECONDARY | non | élevé | facile (12 mots) | reformulée |
| `PUB_15` | La Sécurité sociale doit rembourser moins les soins les plus coûteux. | remboursement des soins | accord → bas | SECONDARY | non | moyen | facile (11 mots) | reformulée |
| `PUB_19` | Les retraites doivent être maintenues à leur niveau, même s'il faut augmenter les cotisations. | niveau des pensions | accord → haut | SECONDARY | non | moyen | moyenne (14 mots) | reformulée |
| `PUB_23` | Les études à l'université publique doivent être gratuites. | université | accord → haut | SECONDARY | non | élevé | facile (8 mots) | reformulée |
| `PUB_24` | L'État doit obliger les jeunes médecins à s'installer dans les zones qui manquent de soignants. | déserts médicaux | accord → haut | SECONDARY | non | moyen | moyenne (15 mots) | reformulée |
| `PUB_25` | L'État doit donner plus d'argent aux hôpitaux publics. | hôpital public | accord → haut | CORE | oui | moyen | facile (8 mots) | reformulée |
| `PUB_26` | Les dépassements d'honoraires des médecins doivent être interdits. | accès aux soins | accord → haut | SECONDARY | — | moyen | facile (8 mots) | **créée** |
| `PUB_27` | La crèche doit être gratuite pour toutes les familles. | petite enfance | accord → haut | SECONDARY | — | élevé | facile (9 mots) | **créée** |
| `PUB_28` | La durée pendant laquelle on touche le chômage doit être raccourcie. | assurance chômage | accord → bas | SECONDARY | — | moyen | facile (11 mots) | **créée** |

**Retirées de la file active** (conservées dans `questions_final.json` pour les réponses historiques) :

- `PUB_1` — « Toute personne doit pouvoir accéder aux soins nécessaires sans obstacle financier. »
  → Double négation (« sans obstacle financier ») et formulation si consensuelle qu’elle ne distingue aucun profil. Remplacée par PUB_26.
- `PUB_17` — « Les services publics essentiels (eau, électricité, santé) ne doivent pas être gérés par des entreprises privées à but lucratif. »
  → Quasi-doublon en miroir de PUB_3 sur la gestion privée des services publics, avec une énumération imposant trois secteurs à la fois.
- `PUB_9` — « La garde d'enfants doit être gratuite et accessible à toutes les familles. »
  → Question composite : gratuité et accessibilité de la garde d’enfants sont deux décisions distinctes. Remplacée par PUB_27, limitée à la gratuité.
