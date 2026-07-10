# Tests automatisés et audit adversarial

## 1. État des tests existants avant cet audit

**Aucun.** Confirmé : `package.json` ne déclare ni script `test`, ni dépendance `vitest`/`jest`/toute autre bibliothèque de test. Aucun fichier `*.test.js`/`*.spec.js` dans le dépôt. `CLAUDE.md` le confirme également (« No test suite is configured »). Ce constat de départ est cohérent entre la documentation et le code — pas de divergence ici.

## 2. Tests écrits et **réellement exécutés** pendant cet audit

Quatre scripts Node.js purs (ES modules, sans dépendance React/JSX puisque `scorer.js`/`matcher.js` sont des modules purs) ont été écrits **et exécutés** dans `audit/poliscope-full-audit/proposed-tests/` :

| Script | Propriété testée | Résultat réel | Détail |
|---|---|---|---|
| `test1-determinism.mjs` | Mêmes réponses → même profil | **PASS** | `calculateProfile(answers)` appelé deux fois sur 40 réponses réparties sur les 8 thèmes → sortie JSON strictement identique |
| `test2-order-independence.mjs` | L'ordre d'insertion des réponses ne change pas le score | **PASS** | 48 réponses insérées selon 4 ordres différents (naturel, inversé, alphabétique, mélangé) → profil `themes` strictement identique dans les 4 cas |
| `test3-nan-zero-weights-regression.mjs` | Absence de NaN/Infinity | **FAIL (attendu)** | `calculateAlignment(userThemes, targetProfile, undefined, {8 thèmes à 0})` retourne `NaN` — confirme par la preuve le bug POL-AUDIT-014 ; ce test doit rester en échec tant que le correctif (garde `totalWeight > 0`) n'est pas appliqué |
| `test4-monotonicity.mjs` | Augmenter une réponse dans le sens `direction=1` ne baisse jamais le score du thème | **PASS** | 108 questions à `direction=1` (sur 162 actives) balayées de 1 à 5 avec ligne de base réaliste — **0 violation détectée** |

Note technique : `questions.js` importe `questions_final.json` sans attribut d'import explicite ; Vite le gère nativement mais Node.js ESM natif (testé en v24.14.0) exige `ERR_IMPORT_ATTRIBUTE_MISSING` sans cet attribut. Un hook de résolution minimal (`_json-import-loader.mjs`, enregistré via `node:module`'s `register()`) a été ajouté dans `proposed-tests/` pour contourner cette limite **sans toucher au code source** — chaque script s'exécute avec un simple `node <fichier>.mjs`.

Ces 4 scripts constituent une base de tests de régression directement exploitable : `test3` doit passer de FAIL à PASS le jour où le correctif NaN est appliqué (voir [10-prioritized-remediation-plan.md](10-prioritized-remediation-plan.md)), ce qui en fait un test de non-régression utile immédiatement.

## 3. Propriétés vérifiées par calcul direct (Subagent 2, sans script persistant)

- **Cohérence structurelle exhaustive** des 170 profils de référence (archétypes, courants, figures FR/historiques, candidats d'élections) — 0 clé manquante, 0 valeur hors [0,100], 0 NaN. Voir [05-matchmaking-audit.md](05-matchmaking-audit.md) §5.
- **Absence de saut brutal au franchissement d'un seuil de veto** — testé sur IMMIGRATION (seuil=30) avec un balayage fin (28→32) : progression lisse 92/92/91/91/90%.
- **Simulation Monte-Carlo** (200 000 triplets aléatoires utilisateur/cible A/cible B) pour quantifier l'impact du double-arrondi sur le classement : 79 inversions sur 200 000 (0,04%), toujours d'un seul point — impact réel mais marginal (POL-AUDIT-019).
- **Distance jamais négative, score toujours dans [0,100]** — confirmé par la présence du `clamp` explicite dans `matcher.js:89` et par l'absence de contre-exemple dans tous les calculs effectués pendant l'audit (hors le cas NaN documenté, qui est un cas de division par zéro et non une valeur hors intervalle).

## 4. Propriétés de la mission non vérifiées par un test automatisé dans le temps imparti

- « Supprimer une question non répondue ne doit pas changer le résultat » — vérifié qualitativement par lecture du code (`if (answer == null) return;` dans `scorer.js:30-31`, confirmé par Subagent 1) mais pas par un test automatisé dédié. Recommandé pour une itération future : test simple, faible complexité.
- Comportement à grande échelle (simulation de milliers de profils synthétiques aléatoires pour repérer une concentration anormale autour du centre ou un candidat jamais proposé) — non menée, hors budget de cet audit (la mission demande explicitement de ne pas générer des millions de profils ; les 15 profils synthétiques + 4 tests de contradiction de [05-matchmaking-audit.md](05-matchmaking-audit.md) couvrent l'essentiel du risque à un coût raisonnable). Une simulation à échantillon limité (200-500 profils aléatoires) serait une extension naturelle post-lancement plutôt qu'un prérequis avant bêta.

## 5. Tests supplémentaires proposés (non écrits, à faible complexité)

1. **Test de régression pour POL-AUDIT-010** (`ideologicalCurrents.js` GLOBAL=85) — assertion simple : pour chaque courant `tier: primary`, le signe de `profile.GLOBAL` doit être cohérent avec la présence de mots-clés souverainistes/mondialistes dans `keyBeliefs`. Détecterait ce type d'incohérence sémantique automatiquement à l'avenir sans lecture humaine.
2. **Test de non-régression pour le champ `weight` mort** (POL-AUDIT-028) — assertion : si `raw.weight` et `STATUS_WEIGHTS[raw.status]` divergent de plus d'un facteur 2, lever un avertissement de build — empêcherait la resurgence silencieuse du problème.
3. **Test de validation de schéma pour les nouvelles entités politiques** — avant tout ajout futur à `elections.js`/`frenchFigures.js`, valider automatiquement : 8 clés de thème présentes, valeurs ∈[0,100], `candidacyStatus` ∈ énumération connue.
4. **Test de fraîcheur** — si les champs `_meta.verifiedAt` recommandés dans [07-sources-and-freshness.md](07-sources-and-freshness.md) sont implémentés, un test simple pourrait avertir (pas bloquer) quand une entité électorale critique n'a pas été vérifiée depuis plus de 7 jours en période électorale.

## 6. Synthèse

L'absence totale de tests avant cet audit est cohérente avec un projet en développement rapide et documentée comme telle. Les 4 tests écrits et exécutés dans le cadre de cet audit démontrent que **les propriétés mathématiques fondamentales du moteur de scoring sont saines** (déterminisme, indépendance à l'ordre, monotonie) et fournissent une preuve exécutable — pas seulement une affirmation — du bug NaN déjà identifié par ailleurs. Recommandation : intégrer ces 4 scripts (après adaptation d'un éventuel futur `package.json` avec un vrai test runner) comme première pierre d'une suite de non-régression, en priorité sur `test3` qui documente un bug réel encore ouvert.
