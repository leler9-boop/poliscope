# 03 — Contre-audit des questions

## A. Les 26 questions modifiées + 4 ajoutées : relues individuellement

Méthode : texte + explication actuels lus intégralement, direction croisée avec `DIRECTION_MAP`, faits croisés avec le rapport 05.

**Résultat : 30/30 conformes. Aucune erreur de polarité, aucune régression de sens, aucun fait faux détecté.** Le travail éditorial est de qualité professionnelle : une seule proposition par question, explications en structure contexte/pour/contre, chiffres datés, français naturel.

Vérifications de direction sensibles, toutes correctes :
- `ECO_13` (bascule -1) : accord = plus de régulation = pôle statiste ✓.
- `ENV_8` (réécriture sans bascule) : accord = abandon du PIB-objectif = même pôle qu'avant ✓.
- `SOC_21` (recentrage liberté individuelle) : direction 1 conservée ✓, angle réellement distinct de SEC_9 (efficacité pénale) ✓.
- `ECO_24`/`ECO_27` (dé-doublonnage inter-thème) : directions -1 conservées ✓, nuances (niveau du taux ; droits ciblés vs protectionnisme général) réellement discriminantes ✓.
- Nouvelles : `ECO_28` -1 (régulation IA = interventionnisme) ✓ ; `DEM_26` +1 ✓ ; `SEC_25` -1 (contrainte sur la police) ✓ ; `SOC_27` +1 ✓.

Réserves mineures (aucune bloquante) :
1. **SEC_5** — l'explication ouvre par « Des études montrent que la certitude d'être puni est plus dissuasive que la sévérité » (fait) avant « certains estiment » (opinion) : asymétrie empirique/opinion légèrement défavorable au camp répressif. Factuel exact, mais le cadrage penche.
2. **PUB_4** — « exclusivement… sans aucune part de » : double qualificatif absolutiste ; un partisan de la répartition « à 95 % » ne sait pas trop où se placer. Acceptable (mesure la position dure), à surveiller.
3. **ENV_11** — « ne doivent pas être poursuivis » : négation simple dans la question (la règle anti-double-négation est respectée, mais l'accord-avec-une-négation reste cognitivement plus coûteux pour un public de 12 ans).
4. **PUB_23** — « jusqu'à environ 3 900 € par an depuis un décret de mai 2026 » : le *principe* des frais différenciés hors-UE date de 2019 ; seul le montant a été révisé en mai 2026. Formulation légèrement trompeuse sur l'origine.

## B. Échantillon stratifié de 16 questions non modifiées (2/thème, CORE+SECONDARY)

ECO_1, ECO_15, SOC_5, SOC_16, IMM_5, IMM_13, SEC_9, SEC_16, ENV_4, ENV_23, DEM_8, DEM_21, GLO_1, GLO_15, PUB_13, PUB_19.

**16/16 conformes** : proposition unique, échelle compatible, explications équilibrées, faits stables (loi 1995, loi 2004, Portugal, PiS au passé, réforme 2008). Réserve unique : DEM_21 affirme « Cela fragilise l'État de droit » comme fait (défendable — consensus État de droit — mais c'est le seul endroit de l'échantillon où l'explication tranche).

**Conclusion B : l'affirmation « les questions non modifiées sont suffisamment bonnes » est crédible.** Le seuil de correction des lots n'était pas trop permissif — les lots 5-6 (1 modif chacun) reflètent une vraie qualité de base, pas un contrôle allégé.

## C. Structure du corpus — constats nouveaux du contre-audit

- 204 entrées brutes, **166 actives**, 0 sans explication, 0 orpheline de DIRECTION_MAP, champ `weight` totalement purgé. En-tête de questions.js périmé (« 180 questions, 22 doublons ») — cosmétique.
- **Distribution des statuts très asymétrique : 28 CORE / 3 PRIMARY / 135 SECONDARY**, et CORE par thème très inégal : ECONOMY 7, SOCIAL 6, SECURITY 5, IMMIGRATION 3, GLOBAL 3, DEMOCRACY 2, **ENVIRONMENT 1, PUBLIC_SERVICES 1**. Conséquences : (a) en mode Découverte (2/thème), ENVIRONMENT et PUBLIC_SERVICES reposent sur 1 CORE + 1 SECONDARY aléatoire — fiabilité inter-thème inégale ; (b) le niveau intermédiaire PRIMARY (poids 5) est quasi inutilisé — l'échelle 10/5/2 est de facto binaire 10/2.
- **Questions CORE jamais mélangées** dans `getQuestionQueue` (les CORE sont servies dans l'ordre du fichier) : le mode Découverte est déterministe pour les thèmes à ≥2 CORE — tous les utilisateurs Découverte répondent aux mêmes questions. Déjà signalé comme tâche de suivi par la mission RGPD ; confirmé ici. Impact produit faible, impact statistique réel (les CORE tardives dans le fichier, dont SEC_25/SOC_27 nouvelles, sont sous-servies en mode court).

## Verdict questions : **conserver l'intégralité du travail éditorial**. Les 4 réserves A sont des retouches de confort, pas des correctifs urgents.
