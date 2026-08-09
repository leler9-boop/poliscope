# Méthodologie — indice de proximité

Version du moteur : `v1-editorial` · Dernière mise à jour : 2026-08-09
Code : `src/engine/candidateMatch.js`, `src/engine/matchConfig.js`, `src/engine/matcher.js`

---

## En une phrase

Le nombre affiché à côté d'un candidat est un **indice de proximité sur 100**, construit à
partir de la distance entre vos scores thématiques et les siens, pondérée par vos priorités,
puis volontairement amplifiée pour différencier les profils.

## Ce qu'il n'est pas

Il ne s'agit **pas** :

- d'un pourcentage de positions communes ;
- d'une probabilité que vous votiez pour cette personne ;
- d'une mesure scientifique validée ;
- d'une recommandation de vote.

Il n'existe pas de dénominateur qui rende « 78 % » littéralement vrai. C'est pourquoi
l'interface affiche « 78/100 » accompagné de sa couverture, et non « 78 % » tout court.

---

## Comment il est calculé

### 1. Distance thématique pondérée

Pour chacun des 8 thèmes connus des deux côtés :

```
distance_thème = |score_utilisateur − score_candidat| / 100
```

Moyenne pondérée par vos priorités :

- si vous avez réparti 100 points entre les thèmes, ce sont ces poids qui s'appliquent ;
- sinon, l'ordre de priorité donne des poids de 8 (rang 1) à 1 (rang 8) ;
- un thème de poids 0 est **entièrement** exclu — y compris du veto (voir plus bas) ;
- si tous les poids sont nuls, on retombe sur des poids égaux, explicitement.

Un thème inconnu d'un côté ou de l'autre est exclu du calcul — il n'est pas remplacé par 50.
*(Cette règle s'applique au scoring v2 ; le v1, encore actif par défaut, traite un thème
sans réponse comme valant 50.)*

### 2. Amplification

```
base = (1 − distance_moyenne) ^ 2,4 × 100
```

L'exposant 2,4 est un **choix éditorial**, pas une calibration. Il élargit l'écart entre
profils proches et profils opposés.

| distance moyenne | indice |
|---|---|
| 0,05 | 89 |
| 0,15 | 71 |
| 0,25 | 53 |
| 0,35 | 37 |
| 0,50 | 19 |

### 3. Désaccords majeurs (« veto »)

Sur 6 thèmes jugés clivants, un écart important réduit le score multiplicativement :

| Thème | Seuil | Pénalité maximale |
|---|---:|---:|
| Immigration | 30 | ×0,62 |
| Économie | 30 | ×0,72 |
| Mondialisation | 30 | ×0,65 |
| Questions sociales | 42 | ×0,78 |
| Sécurité | 42 | ×0,78 |
| Services publics | 42 | ×0,82 |

Démocratie et Environnement sont volontairement hors veto — aucune base suffisante n'a été
trouvée pour les y ajouter.

La pénalité est **continue** : elle vaut 1,0 au seuil et atteint son maximum à un écart de 100.
Franchir le seuil d'un point ne fait donc pas basculer le score. Les pénalités de plusieurs
thèmes se multiplient entre elles.

⚠ **Le veto agit en plus de la distance**, qui pénalise déjà le désaccord. C'est un double
effet, assumé mais non calibré.

### 4. Questions propres à l'élection

Si vous répondez aux questions spécifiques (17 pour la présidentielle 2027) :

```
score_final = 0,65 × score_global + 0,35 × score_spécifique
```

Le score spécifique utilise l'exposant 2,2 et subit le même veto. **Seules** les questions à
la fois répondues par vous et documentées pour le candidat sont comptées — c'est ce nombre
qui est affiché (« 12 positions comparables sur 17 »).

Si aucune position n'est disponible pour un candidat, le score se réduit au score global et
l'interface le dit explicitement. Elle ne prétend jamais que vos réponses ont été prises en
compte alors qu'elles ne l'ont pas été.

> **Historique** : jusqu'au 2026-08-09, Marine Le Pen et Jean-Luc Mélenchon avaient 0 position
> exploitable à cause d'identifiants désalignés. Répondre aux 17 questions ne changeait rien
> pour eux alors que cela changeait le score de leurs concurrents. Corrigé, et verrouillé par
> un test bloquant.

---

## Effet de vos priorités

Vos priorités changent le poids de chaque thème dans la distance moyenne. Elles sont désormais
transmises **identiquement** sur la page Profil et sur la page Élection — ce n'était pas le cas
avant le 2026-08-09, où la page Élection ignorait la répartition sur 100 points.

## Résultats trop proches

Quand les deux premiers candidats sont séparés de moins de 3 points, l'interface le signale.
Un ordre catégorique entre deux scores aussi proches ne serait pas soutenu par la méthode.

Ce seuil est une **sensibilité**, pas une marge d'erreur statistique : aucun intervalle de
confiance n'est calculé aujourd'hui.

---

## Ce qui reste à valider

- L'exposant 2,4 et les seuils de veto n'ont jamais été estimés sur des données.
- Les profils candidats sont saisis à la main (`legacy-manual-v1`) et ne proviennent pas du
  même questionnaire que le vôtre — voir `docs/data/candidate-provenance.md`.
- Aucune incertitude n'est calculée. Voir `docs/methodology/validation-roadmap.md`.
