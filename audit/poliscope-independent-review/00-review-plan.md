# Plan de contre-audit indépendant — 2026-07-11

Contre-auditeur : Claude (Fable 5), session indépendante des missions précédentes.

## Méthode
Vérification ciblée, pas de re-audit complet. Les rapports existants servent d'index ; le code et les diffs servent de preuve.

## Étapes
1. **Index** — lire 00-executive-summary, issues.json, progress.md, 17-editorial-batches-synthesis, livrables RGPD. Extraction des affirmations à vérifier.
2. **Commits** — reconstituer l'historique depuis `628eefe` (audit initial) ; vérifier que chaque commit annoncé existe et correspond à sa description ; détecter les changements mélangés ou non documentés.
3. **Scoring** — relire intégralement `scorer.js` et `matcher.js` ; vérifier veto (6 thèmes, seuils/pénalités), STATUS_WEIGHTS, NaN, arrondis, suppression de `weight`, national-conservatisme GLOBAL=18.
4. **Matchmaking** — exécuter le moteur réel sur ~12 profils synthétiques (script node local, pas de simulation réinventée) ; contrôler top 3, marges, veto appliqués, indicateur de résultat serré.
5. **Questions modifiées** — relire individuellement les ~26+4 questions modifiées/ajoutées via diffs Git.
6. **Échantillon** — ~25-30 questions non modifiées, stratifié par thème/statut.
7. **Hints** — vérifier questionHints.js vs questions_final.json vs rendu réel (Questionnaire.jsx) ; avis architectural.
8. **Faits instables** — vérifier par recherche web les affirmations à haut risque réellement affichées (Le Pen/Bardella, PM, aide à mourir, OTAN, 2035, pacte migratoire, chiffres datés).
9. **UX** — parcours réel dans le navigateur (quiz court, panneau explicatif, résultat serré, mobile).
10. **Supabase/RGPD** — contre-audit des livrables rgpd-remediation ; test de l'état réel du projet Supabase ; consentement, mineurs, flux local/serveur.
11. **Statistique** — évaluer la préparation analytique (versionnage, qualité, seuils de publication).
12. **Livrables** — rapports 00→10 + issues.json + verdict + notes /100.

## Discipline
- Diffs plutôt que fichiers entiers, sauf scorer.js/matcher.js (centraux).
- Pas de subagents.
- Recherche web limitée aux faits instables visibles.
- Conclusions consignées au fil de l'eau dans les rapports.
