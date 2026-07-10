# Plan de remédiation priorisé

Basé sur les 44 constats consolidés dans `issues.json` (3 critiques, 10 élevés, 20 moyens, 11 faibles). Organisé selon les 5 horizons demandés par la mission. Les correctifs marqués 🩹 disposent d'un patch prêt à revue dans `proposed-patches/` (vérifié `git apply --check`, non appliqué).

## Immédiat (avant toute communication publique sur les résultats actuels)

1. **POL-AUDIT-023** — Corriger le statut Le Pen/Bardella pour `fr_2027` (7 emplacements dans `elections.js` + 1 dans `frenchFigures.js`). `requiresPoliticalReview: true` — la situation est encore fluide (pourvoi en cassation, pas de déclaration RN définitive) ; rédiger le nouveau texte avec une relecture humaine, pas seulement un correctif mécanique de champ.
2. **POL-AUDIT-010** 🩹 — Corriger `ideologicalCurrents.js` GLOBAL=85→18 pour « Conservatisme national ». Patch prêt, sans risque, à appliquer immédiatement après revue rapide.
3. **POL-AUDIT-041** — Ajouter la capture de consentement RGPD Art. 9 avant toute nouvelle collecte d'opinions politiques liées à un compte (bloquant légalement, pas seulement produit).

## Avant bêta publique

4. **POL-AUDIT-013** — Poids égaux par défaut quand l'utilisateur ne classe pas ses priorités (ou a minima corriger l'affirmation trompeuse de `Transparency.jsx`, POL-AUDIT-042) — affecte potentiellement la majorité des utilisateurs.
5. **POL-AUDIT-011** 🩹 — Corriger les 3 inversions de signe GLOBAL dans `refinementThemes.js`. Patch prêt ; vérifier l'effet réel côté composant React consommateur avant merge (non vérifié dans le cadre de cet audit, périmètre hors composants React de raffinement).
6. **POL-AUDIT-014** 🩹 — Garde-fou NaN dans `matcher.js`. Patch prêt, sans risque.
7. **POL-AUDIT-012** — Décider si GLOBAL doit rejoindre les thèmes vétoïsés. `requiresPoliticalReview: true` (choix de calibration, pas une correction d'erreur).
8. **POL-AUDIT-024** — Ajouter Sébastien Lecornu, corriger le statut de Bayrou.
9. **POL-AUDIT-028** — Décider du sort du champ `weight` mort (suppression ou réactivation).
10. **POL-AUDIT-035** — Ajouter une catégorie `far_left` symétrique dans le filtre `FrenchFigures.jsx`, ou uniformiser la taxonomie.
11. **POL-AUDIT-037** — Harmoniser les seuils de couleur/libellé de compatibilité ; envisager d'afficher une fourchette plutôt qu'un chiffre unique.
12. **POL-AUDIT-043** — Corriger la promesse de confidentialité de `Transparency.jsx` ou le comportement réel du code (les deux doivent correspondre).
13. **POL-AUDIT-001** — Corriger la fusion invité→compte pour maintenir `user_profiles.answered_count` à jour (casse la synchro multi-appareil).
14. **POL-AUDIT-039** / **POL-AUDIT-040** — Réviser les 17 questions à structure double et `IMM_13` (présupposé le plus explicite du corpus). `requiresPoliticalReview: true` pour `IMM_13`.
15. **POL-AUDIT-033** — Trancher explicitement le sort de l'égalité F/H et de l'accountability policière (réintégrer ou documenter le retrait).

## Avant lancement (mise en avant publique / croissance des utilisateurs)

16. POL-AUDIT-002, 003 — Robustesse de la synchronisation multi-appareil (migration localStorage, fusion de conflit).
17. POL-AUDIT-015, 016, 017, 021 — Calibration et documentation du système de veto ; ajout d'un archétype souverainiste modéré.
18. POL-AUDIT-025, 026 — Compléter les données `paris_2026` (résultat, candidats manquants) et corriger le cadrage « majorité absolue ».
19. POL-AUDIT-030, 031, 034, 036, 038 — Nettoyage éditorial du corpus de questions (doublons inter-thèmes, décentralisation, déséquilibre CORE, couleur IMMIGRATION, biais d'explication).
20. POL-AUDIT-004, 018 — Cohérence de `startRefinement` et des seuils de `profileSummary.js`.
21. Implémenter la politique de fraîcheur structurée décrite dans [07-sources-and-freshness.md](07-sources-and-freshness.md) (champs `_meta.verifiedAt`/`sourceUrl`, affichés en UI sur les fiches candidats).
22. Ajouter une mention de marge d'incertitude et une section « méthodologie » accessible depuis l'écran de résultat lui-même (au-delà du lien vers `/transparency`), conformément à la Phase 10 de la mission.

## Après lancement

23. POL-AUDIT-005, 006, 007, 008, 019, 020, 022, 027, 029 — Corrections mineures/cosmétiques (tie-break `updated_at`, signalement de thème non répondu, incohérence API interne, timer d'auto-avance, double-arrondi, commentaires de documentation obsolètes).
24. Étendre la suite de tests (`proposed-tests/` comme point de départ) avec un vrai framework (`vitest` recommandé, léger et compatible Vite) et les 4 tests supplémentaires proposés dans [09-test-results.md](09-test-results.md) §5.
25. Simulation à échantillon limité (200-500 profils synthétiques aléatoires) pour détecter une éventuelle concentration anormale de résultats — non prioritaire, extension naturelle plutôt que prérequis.

## Maintenance continue

26. **POL-AUDIT-044, 045** — Régénérer `CLAUDE.md`/`DEPLOYMENT.md` à partir de l'état réel du code ; documenter explicitement quel schéma Supabase fait foi et vérifier l'état réel du projet en production (signalé « INACTIVE » au 2026-06-14, non re-vérifié dans cette session).
27. **POL-AUDIT-046** — Hygiène du dépôt : retirer `notebooklm-py/` (dépôt git imbriqué sans rapport avec Poliscope) et gitignorer les artefacts de build égarés (`./assets/*` racine, `vite.config.js.timestamp-*.mjs`).
28. Mettre en place la politique de fraîcheur hebdomadaire pour les données électorales critiques en période électorale, recommandée dans [07-sources-and-freshness.md](07-sources-and-freshness.md) — le cas Le Pen/Bardella (donnée fausse 3 jours après l'événement) est l'exemple concret qui justifie cette cadence.
29. Revue éditoriale périodique des profils de référence (au-delà de la validation de schéma automatique) — POL-AUDIT-010 était structurellement invisible à toute validation technique, seule une relecture humaine du sens l'a révélé.

## Patches prêts à l'emploi (proposed-patches/, non appliqués)

| Fichier | Constat | Vérifié `git apply --check` |
|---|---|---|
| `POL-AUDIT-010-ideologicalCurrents-global-value.patch` | GLOBAL 85→18 | ✅ |
| `POL-AUDIT-011-refinementThemes-global-sign.patch` | 3 inversions de signe GLOBAL | ✅ |
| `POL-AUDIT-014-matcher-nan-guard.patch` | Garde-fou division par zéro | ✅ |

Ces 3 patches ont été vérifiés uniquement en mode `--check` (aucune modification du répertoire de travail). Ils doivent être relus par un humain avant application, en particulier POL-AUDIT-011 dont l'effet côté composant React de raffinement n'a pas été vérifié dans le périmètre de cet audit.
