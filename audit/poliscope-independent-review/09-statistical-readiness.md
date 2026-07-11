# 09 — Préparation statistique et qualité analytique

## Constat central : l'infrastructure de données n'est pas prête à produire des conclusions
La table `user_answers` ne stocke que `(user_id, question_id, answer_value, updated_at)`. Il manque tout ce qui rend une analyse défendable :

| Manquant | Pourquoi c'est bloquant |
|---|---|
| **Version du questionnaire / de la question** | ECO_13 a changé de polarité et 26 questions ont été reformulées le 2026-07-11. Une réponse enregistrée avant/après la reformulation n'a pas le même sens ; sans champ de version, les jeux de données mélangeront des sémantiques incompatibles — et le scorer actuel réinterprète silencieusement les anciennes réponses ECO_13 avec la nouvelle direction. Impact actuel ≈ 0 (pas d'utilisateurs réels), mais à poser AVANT la première collecte. |
| Version du scoring (exposant, veto, STATUS_WEIGHTS) | Les scores dérivés ne sont pas reproductibles rétroactivement sinon. |
| Métadonnées de session (mode 16/32/64, durée, horodatage de session, complétude) | Impossible de filtrer les sessions bâclées (<2 s/question), les réponses uniformes (straight-lining), les abandons. |
| Source d'acquisition | Biais d'échantillonnage inanalysable sans elle. |
| Dédoublonnage inter-appareils | anonymous_id par appareil ; un même humain peut compter N fois. |

Aucune de ces colonnes n'existe dans les schémas v1→v5. À spécifier dans un `schema_v6_analytics.sql` avant le premier utilisateur réel — coût faible maintenant, impossible rétroactivement.

## Biais structurels à traiter côté méthode
- **CORE non mélangées** : tous les répondants du mode Découverte voient les mêmes 2 questions/thème (fichier-ordre) ; les items tardifs (SEC_25, SOC_27) sont structurellement sous-échantillonnés en mode court. Toute statistique par question devra contrôler le mode.
- **CORE inégales par thème** (ENVIRONMENT/PUBLIC_SERVICES : 1 seule) : la fiabilité des scores de thème varie selon le thème — les intervalles de confiance par thème ne seront pas homogènes.
- **stretchScore (0,75) non-linéaire** : les scores de thème stockés ne sont pas des moyennes — documenter pour éviter des interprétations de moyenne de scores étirés.

## Discipline de publication proposée (pour l'observatoire/baromètres/contenus viraux)
1. **Seuil de publication** : aucun croisement publié sous n ≥ 200 par cellule (et n ≥ 50 pour un simple univarié), aucune cellule < 5 même en agrégat téléchargeable.
2. **Toujours l'incertitude** : IC 95 % ou fourchette sur chaque chiffre publié ; pas de décimales trompeuses.
3. **Formulation contrainte** : « parmi les répondants Poliscope » obligatoire ; interdiction éditoriale de « les Français », sauf redressement documenté (quotas âge×sexe×région×diplôme + note méthodo).
4. **Contrôles avant tout titre du type « les propriétaires de chiens sont plus à gauche »** : (a) taille des sous-groupes ; (b) ajustement systématique sur âge, territoire, diplôme, revenu (une régression simple suffit) — la plupart des corrélations « virales » disparaissent après contrôle de l'âge ; (c) correction pour comparaisons multiples si l'on crible des dizaines de croisements (FDR de Benjamini-Hochberg, ou pré-enregistrement des hypothèses de chaque baromètre) ; (d) test de stabilité : re-calculer sur deux sous-périodes, ne publier que si le signe tient.
5. **Registre des analyses** : consigner requête + date + version du questionnaire pour chaque chiffre publié — c'est la traçabilité qui protège la réputation en cas de contestation.

## Verdict : **NOT READY** pour la collecte statistique et les produits data (stade concept). Rien de bloquant côté produit-quiz local ; tout est bloquant côté « actif stratégique data » tant que versionnage + qualité de session + seuils ne sont pas spécifiés.
