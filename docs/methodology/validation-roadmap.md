# Feuille de route — validation scientifique

Rédigé le 2026-08-09. **Rien de ce qui suit n'a été fait.** Ce document existe pour empêcher
que l'absence de validation soit confondue avec sa présence.

---

## Vocabulaire imposé tant que rien n'est validé

| À utiliser | À ne pas utiliser |
|---|---|
| couverture | fiabilité |
| niveau de détail | précision |
| sensibilité | marge d'erreur |
| indice de proximité | pourcentage de compatibilité |
| indice éditorial | mesure scientifique |
| état de l'opinion | prédiction |

Les libellés « Profil robuste » et « Profil très fiable » du scoring v1 ne reposent que sur le
nombre de réponses. Ils doivent être remplacés par des libellés de couverture — c'est un
changement de texte, pas de calcul, et il reste **à faire**.

---

## Ce qui manque, dans l'ordre

### 1. Test-retest
Deux passations espacées de 2 à 4 semaines sur le même échantillon. Corrélation par thème.
Sans cela, impossible de dire si un écart de 8 points entre deux profils est un signal ou du bruit.

### 2. Cohérence interne par thème
Méthodes adaptées aux items ordinaux (alpha ordinal, oméga), pas l'alpha de Cronbach classique
appliqué à des Likert traités comme continus.

### 3. Structure factorielle
Analyse factorielle ordinale confirmatoire : les 8 thèmes déclarés correspondent-ils à la
structure réelle des réponses ? Une réduction à 5 ou 6 dimensions est un résultat plausible et
acceptable.

### 4. Propriétés des items (IRT / MIRT)
Discrimination et difficulté par question, si l'échantillon le permet. Identifie les questions
qui n'apportent rien et celles qui portent l'essentiel du signal.

### 5. Fonctionnement différentiel des items
Une même position politique produit-elle la même réponse selon l'âge, le niveau de diplôme, la
région ? Uniquement sur des sous-groupes légalement traitables et avec base juridique établie.

### 6. Formulations ambiguës et redondances
Repérage empirique des doubles questions (« et »/« ou »), des questions comprises différemment
selon le répondant, et des paires quasi identiques.

### 7. Formes courtes équivalentes
C'est seulement ici qu'on pourra affirmer que les modes 16 / 32 / 64 mesurent la même chose.
La reproductibilité du tirage (déjà en place) en est le prérequis, pas la démonstration.

### 8. Questionnaire adaptatif
Optionnel, calibré, et seulement après les étapes 4 et 7.

### 9. Intervalles d'incertitude
Objectif : afficher « 62 ± 7 » au lieu de « 62 ». Aujourd'hui `calculateProfileV2()` renvoie
volontairement `uncertainty: null` — inventer un intervalle serait pire que ne pas en afficher.

---

## Décisions à prendre après les mesures

- **L'étirement 0,75** (`stretchScore` du v1) : le retirer, le conserver comme transformation
  d'affichage désactivable, ou le garder en variante expérimentale. Il n'a jamais été estimé
  sur des données et ne doit jamais être appelé « calibration ».
- **L'exposant 2,4** du matching et les **seuils de veto** : même statut.
- **Les poids CORE=10 / PRIMARY=5 / SECONDARY=2** : rapport d'influence de 1 à 5 entre deux
  questions du même thème, d'origine éditoriale. Ne pas les remplacer par d'autres nombres
  « plus raisonnables » sans preuve — mesurer d'abord.
- **Les 4 axes** : formules éditoriales encodant des hypothèses politiques fortes (une position
  ouverte sur l'immigration augmente automatiquement l'axe international *et* l'axe social).
  À confronter à la structure factorielle réelle.

---

## Conditions de faisabilité

- Taille d'échantillon calculée **avant** collecte, pas après.
- Pré-enregistrement du protocole et des hypothèses.
- Base juridique et consentement explicite pour tout usage de recherche — distinct du
  consentement produit.
- Séparation stricte entre amélioration du produit et recherche : ne pas présenter une
  itération produit comme un résultat de recherche.

---

## Règle de communication

Tant que ces étapes ne sont pas franchies, Poliscop ne peut pas se présenter comme un outil
validé scientifiquement. Il peut se présenter comme un outil **transparent** : c'est ce que
la remise à niveau du 2026-08-09 a cherché à rendre vrai — versions affichées, couverture
affichée, transformations éditoriales nommées comme telles.
