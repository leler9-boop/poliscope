# 03 — Catalogue des variables démographiques

Grille d'évaluation de chaque variable sur 4 critères : **valeur analytique** (pouvoir explicatif des opinions politiques, au vu de la littérature électorale française), **coût de friction** (volonté de répondre), **sensibilité** (RGPD + perception), **périssabilité** (la donnée vieillit-elle ?). Le schéma v6 implémente les tiers 1 et 2 ; le tiers 3 est optionnel ; le tiers 4 est écarté avec justification.

## Règles transversales (non négociables)
1. **Toujours par tranches/catégories, jamais en valeur exacte** : pas de date de naissance (tranche d'âge), pas de salaire (fourchette), pas de code postal complet (département), pas d'employeur (secteur/PCS).
2. **Chaque question est passable** (« Je préfère ne pas répondre » est une réponse de première classe, stockée comme telle — elle a une valeur analytique propre).
3. **Aucune donnée art. 9 supplémentaire** dans le socle (religion, vote passé, orientation) — voir §Sensibles.
4. Le résultat du quiz n'est **jamais conditionné** à la moindre réponse démographique.

## Tier 1 — Très forte valeur (le socle : 7 variables, ~60 secondes)

| Variable | Format v6 | Pourquoi c'est le socle |
|---|---|---|
| **Tranche d'âge** | 7 tranches (15-17 → 65+) | Première variable explicative de presque tout (Europe, environnement, immigration, retraites). Indispensable au moindre redressement. |
| **Genre** | homme/femme/autre/ne se prononce pas | Écarts H/F documentés (sécurité, égalité, écologie) ; nécessaire au redressement. |
| **Type de commune** | grande ville / ville moyenne / petite ville / rural | Le clivage géographique est LE clivage français post-2017 (métropoles vs périphéries). Plus discriminant que la région. |
| **Département** | code dept (44, 2A, 976) | Assez fin pour les cartes et le rural/urbain vérifié, assez large pour la minimisation (≥ ~300 k hab/dept). Remplace le code postal brut de v1 (qui identifie un village). |
| **Niveau d'études** | 7 niveaux (brevet → doctorat) | 2e variable la plus prédictive du vote en France (cf. clivage diplômés/non-diplômés). |
| **Statut d'activité** | étudiant / salarié privé / salarié public / indépendant / chef d'entreprise / sans emploi / retraité / au foyer | Sépare les grands blocs électoraux (étudiants, retraités, fonction publique). Public/privé est un clivage français spécifique et sous-étudié → différenciant pour Poliscop. |
| **Intérêt pour la politique** | faible/moyen/fort/très fort | Variable de **qualité** autant que d'analyse : permet de segmenter « grand public » vs « politisés » (l'échantillon Poliscop sera biaisé politisé — il faut pouvoir le mesurer). |

## Tier 2 — Forte valeur (proposées plus tard, jamais en bloc : 8 variables)

| Variable | Format v6 | Valeur | Réserve |
|---|---|---|---|
| **PCS (catégorie socio-pro)** | 7 groupes INSEE niveau 1 | « Les ouvriers / les cadres pensent… » — le vocabulaire standard des études françaises ; comparable aux enquêtes existantes (CEVIPOF) | Demander en libellés clairs, pas en jargon INSEE |
| **Fourchette de revenus du foyer** | 5 fourchettes + ne se prononce pas | Croisement redistribution×revenu = contenu à très fort potentiel | Friction maximale — à poser en dernier, jamais obligatoire |
| **Propriétaire / locataire** | 4 valeurs | Clivage patrimonial fort (logement, fiscalité, ISF) | Faible friction, haute valeur — presque tier 1 |
| **Enfants (oui/non)** | boolean | Écarts documentés (école, sécurité, environnement long-terme) | Oui/non suffit — pas le nombre |
| **En couple / seul** | 3 valeurs | Variable d'ajustement classique | — |
| **Expérience à l'étranger** | jamais / <1 an / 1-5 ans / >5 ans | Corrélation ouverture/mobilité — question originale, différenciante éditorialement | — |
| **Syndiqué** | boolean | Petit segment mais très parlant (taux réel ~10 % → utile pour comparer aux enquêtes) | Petits n : publiable tardivement |
| **Rapport à l'information** | fréquence (4) + source principale (7) | « Ceux qui s'informent sur les réseaux sociaux pensent… » = or éditorial ; et variable de contrôle de biais d'acquisition | 2 questions max, pas une batterie média |

## Tier 3 — Valeur moyenne (optionnelles, phase 3+)
- **Secteur d'activité détaillé** (santé, éducation, tech, BTP… ~12 catégories) : permet « les soignants », « les profs » — fort potentiel médiatique mais n suffisants seulement à grande échelle. À activer vers 50 k+ utilisateurs.
- **Taille d'entreprise** (indép/TPE/PME/grande) : intéressant pour l'axe économique, friction moyenne.
- **Langues parlées** : faible pouvoir explicatif propre (corrèle avec diplôme/mobilité déjà mesurés).
- **Moyen de transport principal** : bon angle écologie/ZFE, mais dérivable en partie de commune_type ; à réserver à un module thématique ponctuel (« mini-sondage du mois », cf. doc 06 §UX).
- **Perception du niveau de vie** (« je m'en sors difficilement/… ») : complément subjectif utile au revenu, moins intrusif — bon candidat si le revenu objectif fait trop fuir.

## Tier 4 — Écartées (avec raison)

| Variable | Raison du rejet |
|---|---|
| **Religion / pratique religieuse** | Art. 9 supplémentaire. Croisement religion×opinions politiques = la combinaison la plus explosive possible en France. La valeur analytique est réelle mais le risque (juridique, réputationnel, sécurité des données) la dépasse largement au stade actuel. Réexaminable un jour avec AIPD dédiée, consentement séparé et avis DPO — pas avant. |
| **Vote passé (2022…) / proximité partisane déclarée** | Art. 9. Redondant avec ce que Poliscop **mesure déjà** mieux (166 questions > 1 déclaration). Le seul usage sérieux serait la calibration/redressement politique — à ce moment-là seulement, en opt-in séparé, anonymisé à la source. Pas dans le socle. |
| **Origine / nationalité des parents** | Art. 9 (origine ethnique). Rejet net. |
| **Santé / handicap** | Art. 9, hors sujet produit. |
| **Orientation sexuelle** | Art. 9, la valeur analytique ne justifie pas le risque. |
| **Code postal complet** | Identifiant quasi-direct en zone rurale combiné à âge+genre+profession. Le département + type de commune capturent 95 % de la valeur pour 5 % du risque. |
| **Animaux de compagnie, sport, conso de viande, usages culturels** | Amusants pour du contenu viral, mais : friction (chaque question coûte), n requis énormes pour des corrélations qui s'effondrent après contrôle (cf. doc 07), et image « sondage gadget » qui abîme le positionnement sérieux. À traiter éventuellement en **mini-sondages ponctuels thématiques** (opt-in, jetables) plutôt qu'en variables de profil permanentes. |

## Correspondance avec les référentiels externes
Chaque variable Tier 1-2 est alignée sur une nomenclature comparable : tranches d'âge INSEE, PCS niveau 1, type de commune (grille communale de densité INSEE simplifiée), niveaux de diplôme (nomenclature nationale). **But : pouvoir comparer chaque distribution Poliscop au recensement** — c'est ce qui permet (a) de mesurer les biais d'échantillon, (b) de redresser, (c) de dire honnêtement en quoi l'échantillon diffère de la France (cf. doc 07).

## Ce que ça change au schéma
Le schéma v6 (`user_demographics`) implémente Tier 1 + Tier 2 en colonnes typées avec CHECK — voir DDL. Tier 3 s'ajoutera par `ALTER TABLE ADD COLUMN` sans casse. Les mini-sondages ponctuels (Tier 4 récréatif) utiliseraient une table dédiée `micro_survey_responses(survey_id, user_id, answers jsonb)` à créer le moment venu — hors socle.
