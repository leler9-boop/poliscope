# 04 — Explications et hints : sources de vérité et contenu réellement affiché

## Mécanisme vérifié dans le code (Questionnaire.jsx:315)
```
questionHints[question.id] ? { ...question, info: hint } : explanation ? { ...question, info: explanation } : question
```
Le hint a **priorité totale et silencieuse** sur `explanation`. Fallback correct si ni l'un ni l'autre (cas vide géré). Vérifié en navigateur : ECO_1 affiche bien son hint (contenu simplifié « niveau collège »).

## Contrôle des 19 entrées actuelles de questionHints.js
Comparaison programmatique hint ↔ question actuelle : **19/19 alignées** en sujet ET en chiffres (SMIC 1 867 €, 384 000 titres — synchronisés avec les explications corrigées). Aucune entrée morte ni orpheline (`lint HINT_ORPHANED_*` : 0). La réconciliation `c196659` a tenu ; le suivi promis (DEM_1/DEM_4, GLO_1/GLO_3, SOC_5/SOC_7) a bien été fait.

## Avis architectural
Deux sources de vérité pour « la » explication d'une question restent un piège structurel, même réconciliées :
1. **Le remplacement total est une perte d'information non signalée** : pour 19 questions (dont 6 CORE très servies : ECO_1, SOC_5, IMM_1, GLO_1, PUB_1, ENV_1), l'utilisateur ne voit JAMAIS l'explication riche et équilibrée sur laquelle a porté l'essentiel du travail éditorial — il voit la version simplifiée. Le travail des 8 lots est invisible sur précisément les questions les plus vues.
2. **La dérive de sujet reste indétectable mécaniquement** (le lint ne voit que les IDs) : le bug de juillet 2026 se reproduira à la prochaine reformulation d'une question couverte par un hint, sauf discipline manuelle.

**Recommandation (non appliquée — choix produit)** : fusionner en un champ unique dans `questions_final.json` (`explanation` + `simpleExplanation` optionnel), supprimer `questionHints.js`, et décider en UI qui voit quoi (toggle « version simple », ou simple par défaut + « en savoir plus » dépliant l'explication riche). Coût : ~1 h. Bénéfice : une seule source de vérité, dérive impossible, le travail éditorial redevient visible.

## Verdict : contenu actuellement affiché **sain** ; architecture **à fusionner avant d'agrandir le corpus**.
