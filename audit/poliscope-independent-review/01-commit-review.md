# 01 — Revue des commits (628eefe → HEAD au début du contre-audit)

Tous les commits annoncés dans les rapports existent et correspondent à leur description (vérifié par `git log --stat`). Aucun fichier oublié, aucun commit modifiant plus que son périmètre annoncé.

## Table

| Commit | Finalité | Fichiers | Risque | Tests | Réversible | Avis |
|---|---|---|---|---|---|---|
| `06bf12d` | Lot 1 : bugs scoring + transparence + Le Pen/Bardella/Bayrou | 12 (données + moteur + UI + docs) | Moyen (multi-préoccupations) | 16/16 déclarés | Oui | **Conserver.** Seul reproche : commit trop large (7 correctifs distincts). Le « fix » ideologicalCurrents GLOBAL 85→18 était un bon réflexe mais un diagnostic incomplet — voir rapport 02. |
| `d647e0b` | Suppression champ `weight` mort | 2 | Faible | 4/4 | Oui | **Conserver.** Vérifié : `processQuestion` réinjecte `STATUS_WEIGHTS[status] ?? 2`, le scorer lit le poids traité — aucun corpus à poids 1. |
| `a41eb4d` | Veto GLOBAL (30/0.65) | 1 | Moyen (calibration) | Simulations | Oui | **Conserver** — voir rapport 02 pour l'analyse du double comptage. |
| `f5212a7` | Indicateur résultat serré | 1 | Faible | Navigateur | Oui | **Conserver.** Vérifié fonctionnel en navigateur (« à 1 point de Jordan Bardella »). Wording perfectible à égalité exacte (« à 0 point de » → « ex æquo »). |
| `2702e92` | Docs lot 2 + launch.json | 4 | Nul | — | Oui | Conserver. |
| `e99dd0f` | ECO_13 réécrite + bascule polarité | 2 | Moyen (méthodologique) | Test monotonie dédié | Oui | **Conserver.** Direction -1 vérifiée cohérente avec la nouvelle formulation. Limitation non traitée : les réponses ECO_13 enregistrées avant la bascule changent silencieusement de sens (pas de versionnage) — voir rapport 09. |
| `ef7aa98`→`1968eee` (8 lots éditoriaux + hints) | 26 questions modifiées | questions_final.json, questionHints.js, lint | Faible | 4/4 + lint + build à chaque lot | Oui | **Conserver.** Relecture individuelle des 26 : qualité élevée, aucune erreur de polarité (rapport 03). Discipline de commits exemplaire (docs séparées du contenu, bascule de polarité isolée). |
| `c196659` | Réconciliation questionHints | 2 | Faible | Lint + navigateur | Oui | **Conserver.** Revérifié : les 19 entrées actuelles sont toutes alignées sujet + chiffres avec leur question (rapport 04). |
| `c96b5b3`→`d9d4385` (6 commits RGPD) | Consentement, local-par-défaut, contrôles | store, auth, analytics, modals, schema_v5 | Moyen | Revue de code seulement (backend inaccessible) | Oui | **Conserver.** Spot-checks du contre-audit tous positifs : plus aucun chemin d'écriture `anonymous_answers`, chaque fonction de sauvegarde et chaque événement analytics porteur d'opinion est gaté (`trackIfConsented`, fail-closed), `mergeAnonymousAnswers` gaté aussi. Limite intacte : jamais testé contre une vraie base. |
| `23f9eb8`, `1081ddc`, `61f8169` | 4 nouvelles questions (ECO_28, DEM_26, SEC_25, SOC_27) | 2/commit | Faible | 4/4 + lint | Oui | **Conserver.** Directions vérifiées une à une, contenu factuel exact (rapport 03/05). |
| `38cba0d` | Contrôle de fraîcheur | 4 | Nul | Exécution réelle | Oui | Conserver. Bon outil, catégories datées. |

## Détections négatives (rien de grave)
- `06bf12d` mélange 7 sujets — c'était assumé (« batch ») mais complique un revert sélectif.
- Aucune divergence documentation/commit trouvée. L'erreur de processus du lot 1 (2 questions jamais relues) était correctement documentée et effectivement corrigée au lot 8 (vérifié via la réconciliation et la relecture d'ECO_24/26/27).

## Commits ajoutés par le contre-audit (2026-07-11)
`52ce639` (flip IMM/SEC frenchFigures), `19e4309` (flip GLOBAL courants), `d46ffb8` (garde-fou conventions), `a313320` (résultat Paris 2026), `58d7902` (stats landing), `4620eb0` (étiquettes de pôles Profile/FrenchFigures), `5615c58` (4 rôles périmés), `00f6d40` (poids égaux réels). Tous atomiques, tous réversibles, tests+build verts après chacun.
