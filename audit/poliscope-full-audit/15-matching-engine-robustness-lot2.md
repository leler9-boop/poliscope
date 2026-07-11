# Lot 2 — Robustesse scientifique du moteur de matching

**Portée** : recherche et simulation uniquement. **Aucun fichier source n'a été modifié dans ce lot** (confirmé : `git status --porcelain -- src/` montre exactement les 7 fichiers déjà modifiés lors du lot 1 / de la revue pré-commit, rien de plus). Aucun subagent utilisé. Aucun nouvel audit relancé — travail fondé sur l'historique git du dépôt (déjà présent, non recréé) et sur des scripts de simulation écrits et exécutés pour cette mission, non persistés dans le dépôt (exécutés depuis le scratchpad de session).

## 1. Analyse historique du champ `weight` — bug ou choix devenu inutile ?

**Verdict : choix historique devenu inutile, pas un bug d'implémentation.**

Preuve directe (`git log -p -- src/data/questions.js`, commit `7fdd90b`, 19 avril 2026, « v2: scoring redesign — new weights... ») :

```diff
-    weight:      raw.weight ?? 1,
+    weight:      STATUS_WEIGHTS[raw.status] ?? (raw.weight ?? 2),
```

Avant ce commit, `raw.weight` était **l'unique** mécanisme de pondération par question (avec un simple repli à 1 si absent). Le même commit — explicitement titré « new weights » — a introduit `STATUS_WEIGHTS` (CORE=10, PRIMARY=5, SECONDARY=2) comme nouveau système à 3 paliers, plus cohérent et plus interprétable qu'une valeur numérique libre par question, et l'a fait primer sur `raw.weight`. C'est une décision de conception délibérée, pas une erreur : le développeur a sciemment remplacé un système de poids arbitraires par un système à paliers standardisés.

**Ce qui n'a pas suivi** : le champ `weight` brut n'a jamais été retiré du schéma de `questions_final.json`. Il continue d'être rédigé pour les 200 entrées (ex. `ENV_1`/`PUB_1` : `weight: 5`), sans plus jamais influencer le score en pratique (confirmé lors du lot 1 : seul `scorer.js:40` consomme la valeur *calculée*, jamais la valeur brute).

**Recommandation (proposée, non appliquée)** : retirer le champ `weight` de `questions_final.json` (200 entrées) lors d'une prochaine passe éditoriale sur le corpus de questions, ou à défaut ajouter une validation de build qui échoue si `raw.weight` diverge fortement de `STATUS_WEIGHTS[status]` pour empêcher toute confusion future. Catégorie A (aucun impact sur le score, risque nul), mais non appliqué ici car il s'agit d'une modification portant sur 200 lignes d'un fichier de données déjà volumineux — jugé plus prudent de le proposer que de le faire sans revue dédiée.

## 2. Système de veto — l'absence de GLOBAL

### 2.1 Reconstitution historique

Le veto multiplicatif est né le même jour (19 avril 2026) en 3 étapes rapprochées :

| Commit | Heure | Changement |
|---|---|---|
| `7fdd90b` | 14:36 | Introduction du veto multiplicatif sur **4** thèmes : IMMIGRATION, ECONOMY, SOCIAL, SECURITY (remplace l'ancien modèle additif à seuil unique 0.38/coefficient 0.25) |
| `acb2ec3` | 16:42 | Retuning des 4 seuils/pénalités existants, ajout du commentaire « Thresholds set at 50-55 to avoid crushing moderate profiles » |
| `54c6581` | 18:44 | Resserrement des seuils **et ajout de PUBLIC_SERVICES comme 5e thème vétoïsé**, justifié dans le message de commit par un cas de test précis : *« Centrist vs Roussel: 41% → 14% ✓ »* |

**Constat clé** : le système de veto a été construit par **itération empirique sur des cas de test précis** (un profil centriste matchait trop fort avec Roussel/PCF — 41% jugé trop élevé — le développeur a resserré les seuils et ajouté PUBLIC_SERVICES jusqu'à obtenir 14%, jugé correct), et non par une analyse systématique et exhaustive des 8 axes pour décider a priori lesquels méritent une protection anti-faux-positif. **Aucune trace dans l'historique git (messages de commit, corps de commit, commentaires de code) n'indique que GLOBAL, DEMOCRACY ou ENVIRONMENT aient été explicitement examinés puis écartés** — le registre est simplement silencieux sur ce point, ce qui ne permet de conclure ni à une exclusion volontaire ni à un oubli. C'est une information manquante, pas une preuve dans un sens ou dans l'autre.

### 2.2 Simulation : impact d'un veto GLOBAL

Calibrage testé, par analogie directe avec IMMIGRATION (même nature de clivage identitaire/civilisationnel) : `GLOBAL: { threshold: 30, penalty: 0.65 }`.

**Cas de référence de l'audit initial** (profil anti-UE synthétique vs. Glucksmann, pondération égale) :
- Sans veto GLOBAL : 39% de compatibilité
- Avec veto GLOBAL : 30% de compatibilité (−9 points)

**Impact sur l'ensemble des 18 archétypes** (3000 profils aléatoires uniformes, poids égaux) :
- **13,1 %** des profils voient leur meilleur archétype (top-1) changer.
- **Effet ciblé confirmé** : chez les profils avec une position européenne tranchée (|GLOBAL−50| > 25 points), le taux de changement monte à **18,0 %** ; chez les profils avec une position modérée, il retombe à **5,9 %** (bruit de fond attendu près des zones de quasi-égalité, sans rapport avec GLOBAL). L'effet est donc bien concentré sur la population que le correctif est censé aider, pas dispersé aléatoirement.
- Archétypes qui « récupèrent » le plus souvent un match qui leur échappait à tort : `liberal_progressiste`, `gaulliste_social`, `centriste_republicain`, `reformiste_liberal`, `social_patriote`, `liberal_conservateur` — un mélange cohérent de profils modérés de tous bords, consistant avec l'explication : sans protection GLOBAL, un profil par ailleurs modéré mais europhile/souverainiste tranché se voyait mal orienté vers un archétype centriste générique plutôt que vers l'archétype qui partage réellement sa position européenne.

**Absence de nouvel effet de seuil brutal** (vérifié en balayant la distance réelle user↔target autour de 30, pas à pas) :

| Distance | 26 | 27 | 28 | 29 | **30** | 31 | 32 | 33 | 34 |
|---|---|---|---|---|---|---|---|---|---|
| Alignement | 92% | 92% | 92% | 92% | **91%** | 90% | 90% | 89% | 88% |

Transition lisse, cohérente avec le mécanisme de rampe linéaire déjà utilisé pour les 5 thèmes vétoïsés actuels — aucun palier brutal introduit.

### 2.3 Recommandation (proposée, non appliquée)

Ajouter GLOBAL à `VETO_THEMES` avec `threshold: 30, penalty: 0.65`. **Catégorie B** — impact réel et non négligeable (13,1 % des profils, 18,0 % pour la sous-population concernée), donc à valider par un humain avant application, malgré la précédence méthodologique claire (même logique que l'ajout historique de PUBLIC_SERVICES) et l'absence de risque technique nouveau (pas de nouveau cliff, mécanisme identique aux 5 vetos existants).

## 3. Stabilité du matchmaking — simulation

**Méthode** : 3000 profils aléatoires uniformes (poids égaux, pour isoler le comportement du moteur de tout biais de pondération par défaut déjà documenté ailleurs), classés contre les 18 archétypes.

| Mesure | Résultat |
|---|---|
| Archétypes jamais classés en top-1 sur 3000 tirages | 0/18 (tous atteignables) |
| Répartition la plus fréquente en top-1 | `gaulliste_social` : 17,9 % (vs. 5,6 % attendu si uniforme) |
| Répartition la plus rare en top-1 | `humaniste_gauche` : 0,5 % |
| Indice de concentration (Herfindahl) | 0,0885 (uniforme parfait = 0,0556) — concentration modérée, ~1,6× la référence |
| Profils avec marge top1/top2 ≤ 1 point | **48,1 %** |
| Marge moyenne top1 − top2 | 2,35 points |

**Interprétation** : le système n'est pas dégénéré (tous les archétypes sont atteignables, la concentration est modérée et non extrême), mais confirme quantitativement « l'effet d'attracteur central » déjà repéré qualitativement lors de l'audit initial — certains archétypes structurellement plus centraux dans l'espace à 8 dimensions captent une part disproportionnée des profils peu différenciés. **Constat le plus important de cette section** : pour près d'un profil sur deux, le meilleur et le deuxième meilleur match sont à moins d'un point d'écart. Le produit affiche pourtant un unique « meilleur match » sans indiquer cette proximité — un problème d'expérience utilisateur plus que de calcul (déjà noté indirectement dans l'audit initial, désormais quantifié précisément : ~48 %, pas un cas marginal).

**Précision de récupération** (un profil = un archétype connu + bruit aléatoire ; le système retrouve-t-il l'archétype d'origine en top-1 ?) :

| Bruit | Taux de récupération |
|---|---|
| ±5 points/thème | 96,4 % |
| ±10 points/thème | 83,7 % |
| ±20 points/thème | 55,8 % |

Dégradation progressive et attendue avec le bruit — aucun effondrement brutal, comportement mathématiquement sain.

## 4. Sensibilité aux petites variations

**Méthode** : 500 triplets (utilisateur, cible A, cible B) aléatoires, chaque thème perturbé de ±1 point indépendamment (8 000 perturbations), mesure du changement d'alignement et des inversions de classement A↔B.

| Mesure | Résultat |
|---|---|
| Delta d'alignement = 0 pour une perturbation de 1 point | 67,2 % des cas |
| Delta = 1 (proportionné) | 32,8 % des cas |
| Delta ≥ 2 (disproportionné) | **0 cas sur 8000** |
| Inversions de classement A↔B causées par 1 point | 52/8000 (0,65 %) |
| Répartition des inversions par thème | Homogène (4 à 10 par thème sur 8) — **pas de concentration sur un thème précis, y compris les thèmes vétoïsés** |

**Résultat rassurant et directement lié au lot 1** : aucune réponse disproportionnée à une perturbation d'un point n'a été observée. C'est la conséquence directe du correctif POL-AUDIT-019 (suppression du double-arrondi) appliqué lors du lot 1 — avant ce correctif, un delta de 2 points pour une perturbation de 1 point était possible dans de rares cas (mesuré à 0,04 % lors de l'audit initial) ; il n'a pas été reproduit une seule fois sur les 8000 perturbations testées ici. Les inversions de classement qui subsistent (0,65 %) sont réparties uniformément entre les 8 thèmes, y compris ceux non vétoïsés — elles ne trahissent pas un défaut du système de veto, mais l'effet mathématiquement inévitable de comparer deux cibles proches d'une position de quasi-égalité (n'importe quel système continu produit ce phénomène près d'une frontière de décision).

**Sensibilité au réordonnancement des priorités** (300 échanges aléatoires de deux thèmes adjacents dans le classement de priorité) :
- Delta maximal observé pour un simple échange de rang adjacent : **3 points**.
- Confirme et quantifie, à une échelle plus fine, le constat déjà documenté (POL-AUDIT-013) : même un réordonnancement minimal (échanger deux thèmes voisins, pas un bouleversement complet) a un effet mesurable sur le résultat affiché.

## 5. Améliorations proposées (non appliquées) — synthèse

| # | Proposition | Catégorie | Impact attendu | Risque | Complexité |
|---|---|---|---|---|---|
| 1 | Retirer le champ `weight` de `questions_final.json` (200 entrées) | A | Nul sur le score ; supprime un risque de confusion éditoriale future | Faible (modification mécanique large, non testée ici) | Faible |
| 2 | Ajouter GLOBAL à `VETO_THEMES` (seuil 30, pénalité 0,65) | B | Corrige 13,1 % des profils aléatoires, 18,0 % des profils à position européenne tranchée ; aucun nouveau cliff | Faible techniquement, modéré fonctionnellement (change un résultat déjà affiché à des utilisateurs réels) | Faible (1 ligne), mais nécessite validation humaine du calibrage exact |
| 3 | Afficher une marge d'incertitude / un indicateur de proximité quand le top1/top2 est serré (< 2-3 points, ~48 % des cas selon la simulation) | Hors A/B/C (proposition produit, pas un correctif moteur) | Améliore la perception de fiabilité sans changer aucun score | Nul (affichage uniquement) | Moyenne (UI) |
| 4 | Étudier une méthode pour réduire l'attracteur central (Herfindahl 0,0885 vs 0,0556 uniforme) — ex. archétypes additionnels dans les zones sous-représentées, ou métrique de distance alternative | B | Rééquilibrage progressif de la distribution des matchs ; effet non quantifiable sans une refonte plus large | Élevé si mal calibré (peut déstabiliser des matchs aujourd'hui corrects) | Élevée — recherche, pas un correctif ponctuel |

Aucune de ces 4 propositions n'a été appliquée. Aucun profil politique de référence n'a été modifié dans ce lot (seule une reconfiguration ADDITIVE et réversible du dictionnaire `VETO_THEMES` est proposée pour #2 — les valeurs `profile:` des candidats/archétypes/courants restent strictement inchangées).

## 6. Tests exécutés

| Test | Type | Résultat |
|---|---|---|
| Historique git — origine de `STATUS_WEIGHTS`/`weight` | Investigation (pas un test automatisé) | Confirmé : `7fdd90b`, 19/04/2026 |
| Historique git — origine et évolution du veto | Investigation | Confirmé : `7fdd90b`→`acb2ec3`→`54c6581`→`dcf6230`→`7fcde95`→`0dbdab6` |
| Simulation d'impact veto GLOBAL (3000 profils + cas de référence + segmentation + continuité) | Script ad hoc, exécuté | Résultats ci-dessus §2.2, reproductible (PRNG à seed fixe) |
| Simulation de stabilité (3000 profils, poids égaux) | Script ad hoc, exécuté | Résultats ci-dessus §3 |
| Simulation de précision de récupération (3×18×50 = 2700 profils bruités) | Script ad hoc, exécuté | Résultats ci-dessus §3 |
| Simulation de sensibilité (500×8×2 = 8000 perturbations) | Script ad hoc, exécuté | Résultats ci-dessus §4 |
| Simulation de sensibilité au réordonnancement (300 échanges) | Script ad hoc, exécuté | Résultats ci-dessus §4 |
| Suite de régression existante (`proposed-tests/*.mjs`) | Re-exécutée par précaution bien qu'aucun fichier source n'ait changé | 4/4 PASS (inchangé depuis la revue pré-commit) |

Scripts exécutés depuis le scratchpad de session, non persistés dans le dépôt (ce sont des analyses exploratoires ponctuelles, pas des tests de non-régression destinés à tourner en continu — à la différence des 4 scripts de `proposed-tests/`). Échelle volontairement mesurée (3000-8000 échantillons par simulation, pas des millions), conformément à la consigne de coût maîtrisé — suffisant pour des pourcentages stables à ±1-2 points près, largement suffisant pour éclairer une décision de calibrage.

## 7. Estimation de l'amélioration de la précision du matching

**Prudence méthodologique** : il n'existe pas de vérité terrain (« ground truth ») externe pour mesurer une « précision » absolue du matching politique — contrairement à un problème de classification supervisée classique. Les estimations ci-dessous mesurent la **cohérence interne** du système (le système retrouve-t-il un profil connu ? corrige-t-il les cas que sa propre logique déclare pathologiques ?), pas une validation externe contre un jugement humain indépendant à grande échelle.

- **Ajout du veto GLOBAL seul** : corrige le classement de ~13 % des profils dans l'ensemble, et ~18 % des profils ayant une position européenne tranchée — cette dernière figure est la plus pertinente, puisque c'est exactement la population pour laquelle un problème avait été démontré (cas Glucksmann de l'audit initial). **Estimation : amélioration de la précision de classement pour environ 1 utilisateur sur 5 à 6 parmi ceux ayant une opinion européenne affirmée**, sans effet sur les ~94 % de profils à position européenne modérée.
- **Correctif POL-AUDIT-019 déjà appliqué (lot 1)** : confirmé lors de cette simulation comme ayant éliminé 100 % des cas de réponse disproportionnée détectés (0/8000 vs. 0,04 % avant correctif) — amélioration mesurée, pas seulement théorique.
- **Retrait du champ `weight` mort** : aucun impact sur la précision du matching (le champ n'a déjà aucun effet) — bénéfice purement sur la maintenabilité future.
- **Affichage d'une marge d'incertitude** : n'améliore pas la précision du calcul lui-même, mais réduit le risque de sur-confiance perçue pour ~48 % des utilisateurs dont le résultat affiché est en réalité une quasi-égalité.

**Chiffre de synthèse le plus défendable** : sur la seule dimension testée ici (le clivage européen/souverainiste), le correctif proposé améliorerait la fiabilité du top-1 match pour environ **18 % des utilisateurs ayant une position européenne tranchée** — une amélioration ciblée et non marginale, mais qui ne concerne qu'un seul des 8 axes du modèle ; elle ne doit pas être extrapolée à une amélioration globale de « 18 % » sur l'ensemble du produit.

## Résumé court

- **0 fichier source modifié** dans ce lot (recherche et simulation uniquement, conformément à la consigne).
- **Priorité 1** : champ `weight` = choix historique devenu inutile (preuve git directe), pas un bug.
- **Priorité 2** : absence de GLOBAL dans le veto = angle mort historique probable (silence du registre, pas une exclusion documentée) ; ajout simulé, chiffré, confirmé sans risque technique nouveau — **proposé, non appliqué**.
- **Priorité 3** : matchmaking globalement stable (0 archétype inatteignable, dégradation progressive avec le bruit) mais avec un effet d'attracteur central mesuré (Herfindahl 1,6× la référence uniforme) et une proximité top1/top2 fréquente (48 %).
- **Priorité 4** : aucune réponse disproportionnée détectée à une perturbation d'un point (0/8000) — confirme l'efficacité du correctif du lot 1 ; sensibilité modeste mais réelle au réordonnancement des priorités (jusqu'à 3 points par échange adjacent).
- **Priorité 5** : 4 propositions documentées avec impact/risque/complexité, aucune appliquée.
- **Lot 3 non lancé automatiquement.**
