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

### 4. Deux lectures, jamais fusionnées *(révision 2026-08-14)*

Jusqu'au 2026-08-13, un seul nombre était produit :

```
score_final = 0,65 × score_global + 0,35 × score_spécifique      ← SUPPRIMÉ
```

Cette formule avait deux défauts, et le second était bloquant.

**Elle comptait deux fois les mêmes preuves.** Les positions propres au scrutin servaient
d'abord à dériver un profil thématique, puis, les mêmes, à produire le score direct sur les
questions. Les deux résultats étaient ensuite mélangés.

**Elle interdisait toute lecture électorale à un corpus étroit.** La composante spécifique ne
pouvait pas contourner le seuil de quatre thèmes du score global. David Lisnard, avec sept
positions approuvées, relues et datées sur les dix-sept questions du scrutin, restait « non
comparable » — non pas faute de preuves sur l'élection, mais faute d'un profil général que
cette lecture n'utilise pas.

Le moteur produit désormais **deux résultats indépendants**, rendus séparément et affichés
séparément. Il n'y a pas de troisième indice combiné.

| | Proximité générale | Proximité sur cette élection |
|---|---|---|
| Question | « De manière générale, quelles idées ressemblent le plus aux miennes ? » | « Sur les questions de ce scrutin auxquelles j'ai répondu, de qui suis-je le plus proche ? » |
| Compare | profil utilisateur 8 thèmes ↔ corpus général du candidat | réponses de l'utilisateur ↔ positions du candidat, question par question |
| Contrat | 4 thèmes connus, 2 positions relues par thème | 5 positions comparées, 25 % du questionnaire, 3 thèmes représentés |
| Exposant | 2,4 | 2,2 |
| Veto thématique | oui | **non** — il compare des profils, pas des questions |
| Dénominateur affiché | *n*/8 thèmes connus | *n*/*m* positions comparées, sur un questionnaire de *k* |

Conséquences directes, toutes voulues :

- un candidat peut être comparable **électoralement** sans l'être **généralement** ;
- l'inverse est également possible ;
- modifier ses réponses au scrutin ne déplace **pas** la proximité générale ;
- modifier son profil général ne déplace **pas** la proximité électorale directe.

L'importance électorale déclarée peut pondérer les questions de la lecture directe. Une
pondération absente ou invalide vaut 1 : elle ne fait jamais disparaître une question, donc
jamais changer le dénominateur affiché.

Si un indice combiné devait revenir un jour, il lui faudrait son propre nom, sa propre
version, l'explication de son calcul, et une construction qui ne recompte pas les mêmes
positions. Il ne remplacerait pas les deux lectures.

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
- Au 2026-08-14, **12 positions sont approuvées** et 11 codées attendent encore une relecture
  indépendante. En lecture générale, **aucune candidature** n'atteint son contrat ; en lecture
  électorale directe, **une seule** — David Lisnard, 7 positions comparées sur 17 questions,
  6 thèmes représentés. Ces décomptes sont recalculés par `node scripts/check-matching.mjs` :
  ne pas les recopier à la main dans un message de sortie, c'est exactement ce qui avait
  laissé la phrase « aucun corpus approuvé à ce jour » à l'écran pendant que douze positions
  l'étaient.
- La priorité immédiate reste la relecture indépendante. Le corpus Attal (3 approuvées) et le
  corpus Roussel (2 approuvées) sont sous le contrat direct comme sous le contrat général : ils
  ne doivent pas être classés par anticipation.
