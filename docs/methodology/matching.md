# Méthodologie — indice de proximité

Moteur : `v1-editorial` · Données candidats : `2026-08-10` · Mise à jour : 2026-08-10
Code : `src/engine/candidateMatch.js`, `candidateProfile.js`, `matchConfig.js`

## Ce que le nombre signifie

L'indice de proximité sur 100 mesure la distance entre le profil thématique de l'utilisateur
et un profil candidat dérivé de positions concrètes, pondérée par les priorités de
l'utilisateur. Ce n'est ni une probabilité de vote, ni un pourcentage de propositions
communes, ni une recommandation électorale.

L'interface doit écrire `78/100`, avec la couverture utilisée, et jamais `78 %`.

## Condition préalable : des preuves recevables

Le moteur ignore entièrement :

- les huit nombres historiques de `candidate.profile` (`legacy-manual-v1`) ;
- les anciennes valeurs de secours dans `specificQuestions[].positions` ;
- toute position non approuvée, sans source vérifiée, sans date, sans codeur ou sans relecteur.

Une question recevable est normalisée sur 0–100 selon sa direction, puis agrégée dans son
thème. Un thème exige **au moins deux positions approuvées**. Un score candidat exige **au
moins quatre thèmes connus**. Les thèmes inconnus restent `null` : ils ne valent jamais 50.

S'il n'existe aucune position recevable, le résultat est `no_sourced_positions`. Si des
positions existent mais couvrent moins de quatre thèmes, le résultat est
`insufficient_coverage`. Dans les deux cas, aucun score ni classement de secours n'est publié.

## Calcul

### 1. Profil thématique

Pour chaque thème connu des deux côtés :

```
distance_thème = |score_utilisateur − score_candidat| / 100
```

La moyenne est pondérée par l'allocation de priorités de l'utilisateur. À défaut, l'ordre des
priorités donne des poids de 8 à 1. Un thème de poids 0 est exclu du calcul et du veto.

### 2. Amplification éditoriale

```
score_global = (1 − distance_moyenne) ^ 2,4 × 100
```

L'exposant 2,4 différencie davantage les profils ; il n'est pas issu d'une calibration
scientifique.

### 3. Désaccords majeurs

Six thèmes peuvent appliquer une pénalité progressive en cas de grand écart :

| Thème | Début de pénalité | Multiplicateur à l'écart maximal |
|---|---:|---:|
| Immigration | 30 | ×0,62 |
| Économie | 30 | ×0,72 |
| Mondialisation | 30 | ×0,65 |
| Questions sociales | 42 | ×0,78 |
| Sécurité | 42 | ×0,78 |
| Services publics | 42 | ×0,82 |

La pénalité est continue entre le seuil et un écart de 100. Plusieurs pénalités se multiplient.
Ce double effet — distance puis veto — est assumé, mais reste à calibrer empiriquement.

### 4. Questions de l'élection

Quand l'utilisateur répond aux 17 questions 2027, seules celles qui ont aussi une position
candidat recevable entrent dans la composante spécifique :

```
score_final = 0,65 × score_global + 0,35 × score_spécifique
```

La composante spécifique utilise un exposant de 2,2. Elle ne peut jamais contourner le seuil
de quatre thèmes du score global. Le nombre de positions effectivement comparées est affiché.

## Priorités, égalités et versions

Les mêmes poids sont transmis aux pages Profil et Élection. Deux scores séparés de moins de
3 points sont signalés comme trop proches pour être départagés ; ce seuil n'est pas une marge
d'erreur statistique.

Chaque résultat embarque les versions du moteur de matching, des données candidats et de la
dérivation du profil. Modifier une formule nécessite une nouvelle version et une décision
documentée. Ajouter ou corriger des sources candidat nécessite une nouvelle release de données.

## Limites actuelles

- Les exposants et vetos n'ont pas encore été calibrés sur un panel de validation.
- Aucune incertitude statistique n'est calculée.
- Au 2026-08-10, aucune position réelle n'est encore approuvée : le classement public est donc
  volontairement vide.
- La priorité immédiate est la relecture indépendante du corpus Lisnard. Le corpus Attal est
  amorcé mais ne couvre encore que deux thèmes robustes ; il ne doit pas être classé par
  anticipation. Le corpus Roussel confirme six positions actuelles, sans recycler son programme
  2022, mais ne couvre encore qu'un thème robuste.
