# Revue finale du lot 1 avant commit

**Méthode** : aucun subagent, aucun nouvel audit relancé. Travail à partir des livrables 11-13 déjà écrits, avec une exception assumée : une recherche web ciblée (pas un subagent) a été menée sur un seul point — le statut exact de la candidature et du pourvoi de Marine Le Pen — parce que l'utilisateur a signalé que ma formulation précédente semblait déjà obsolète, et parce qu'un jour s'est écoulé depuis la vérification du lot 1. Cette recherche a confirmé le signalement de l'utilisateur et révélé une seconde imprécision (le sens de l'effet suspensif du pourvoi) que je n'avais pas identifiée moi-même.

## 1. Dernières corrections effectuées

### 1.1 Statut Le Pen — correction de précision (motif de cette revue)

Ma formulation du lot 1 (« candidature non formellement déclarée », « a formé un pourvoi en cassation », « sans effet suspensif ») contenait **trois imprécisions**, confirmées par re-vérification :

| Point | Lot 1 (2026-07-10) | Corrigé (2026-07-11) | Source |
|---|---|---|---|
| Candidature | « non formellement déclarée » | **Déclarée publiquement** le 7 juillet 2026 sur TF1 (« Je suis candidate à l'élection présidentielle et je ne changerai pas d'avis ») | franceinfo, 7 juil. 2026 |
| Pourvoi en cassation | « a formé un pourvoi en cassation » (accompli) | **Annoncé**, non confirmé déposé. Délai légal : 10 jours à compter de l'arrêt (~17 juillet 2026) | franceinfo, 8 juil. 2026 |
| Effet suspensif | « sans effet suspensif » | **Suspensif** une fois déposé (droit pénal français) — le sens était inversé | franceinfo + Le Club des Juristes |
| Investiture RN | (non traité) | Aucun processus d'investiture interne formalisé documenté ; campagne commune Le Pen/Bardella rapportée (La Flèche, Sarthe), Bardella présenté par la presse comme Premier ministre pressenti, pas comme un statut officiel | France 24, 8 juil. 2026 |
| Éligibilité actuelle | Fondée sur la peine déjà purgée uniquement | **Deux fondements convergents** : (a) peine ferme de 15 mois déjà purgée au 30/06/2026, ET (b) la cour d'appel n'a pas ordonné l'exécution provisoire de la nouvelle peine | franceinfo, 8 juil. 2026 |

**Distinction appliquée dans le code**, conformément à la demande :
- Candidature **publiquement annoncée** : oui, confirmée, haute confiance.
- Investiture officielle RN : **non documentée** — décrite comme telle dans le code (pas d'affirmation d'un processus formel).
- Éligibilité juridique actuelle : oui, confirmée, sur deux fondements distincts.
- Pourvoi : **annoncé**, non confirmé déposé — c'est la formulation retenue partout, conformément à la consigne de ne conserver « en cours »/« formé » que si le dépôt effectif était confirmé (il ne l'est pas).

`candidacyStatus` de `lepen_2027` passe de `probable` à **`declared`** (même barre que Mélenchon : annonce personnelle, publique, sans ambiguïté). `candidacyStatus` de `bardella` passe de `declared` à **`speculative`** — choix éditorial mineur signalé séparément ci-dessous (§4), puisqu'aucune valeur de l'énumération existante ne décrit exactement « s'est effacé au profit d'un proche pour devenir Premier ministre pressenti ».

### 1.2 Fichiers de données corrigés

- `src/data/elections.js` : description (844-845), contexte EN (851) et FR (856), deeperContext FR (865), fiche `lepen_2027` (999-1003), fiche `bardella` (1077-1080) — 6 emplacements.
- `src/data/frenchFigures.js` : description (710-711), key_facts FR/EN (731, 735), disclaimer (745-746) — 4 emplacements.
- `audit/poliscop-full-audit/sources.json` : 5 nouvelles entrées ajoutées (déclaration de candidature, statut du pourvoi, absence d'exécution provisoire, lancement de campagne commun) ; 2 entrées existantes conservées mais annotées comme superseded plutôt que supprimées, conformément à la politique de fraîcheur du dossier (ne jamais remplacer silencieusement une donnée antérieure).

## 2. Liste exacte des fichiers source modifiés (arbre de travail, non commité)

```
 src/data/elections.js           | 30 ++++++++++++++----------------
 src/data/frenchFigures.js       | 26 +++++++++++++-------------
 src/data/ideologicalCurrents.js |  2 +-
 src/data/questions.js           |  3 +++
 src/data/refinementThemes.js    |  6 +++---
 src/engine/matcher.js           |  6 +++--
 src/pages/Transparency.jsx      |  8 +++---
 7 files changed, 43 insertions(+), 38 deletions(-)
```

Fichiers d'audit modifiés/ajoutés (hors périmètre du commit de code applicatif, à considérer séparément) : `sources.json` (mis à jour), `11-critical-findings-review.md`, `12-remediation-batch-1-plan.md`, `13-remediation-batch-1-results.md`, `14-pre-commit-review.md` (nouveaux).

**Aucun autre fichier n'a été touché.** Confirmé par `git status --porcelain` avant et après cette revue.

## 3. Tests exécutés et résultats

| Vérification | Résultat |
|---|---|
| `node --check src/data/elections.js` | ✅ syntaxe valide |
| `node --check src/data/frenchFigures.js` | ✅ syntaxe valide |
| `test1-determinism.mjs` | ✅ PASS |
| `test2-order-independence.mjs` | ✅ PASS |
| `test3-nan-zero-weights-regression.mjs` | ✅ PASS |
| `test4-monotonicity.mjs` | ✅ PASS |
| `npm run build` | ✅ succès, 557 modules, 0 erreur, 2,66 s |
| `issues.json` — `JSON.parse` | ✅ valide, 44 entrées, 0 doublon d'ID |
| `sources.json` — `JSON.parse` | ✅ valide, 19 entrées (était 15), 0 champ manquant sur les 9 champs requis |
| Recherche de contradictions résiduelles (grep ciblé Le Pen/Bardella/Bayrou/Lecornu/Paris 2026/Grégoire/inéligibilité/candidature 2027/Premier ministre sur tout `src/`) | ✅ aucune contradiction réelle — 2 faux positifs identifiés et vérifiés manuellement (correspondances de regex sur une ligne JS unique très longue contenant à la fois « filed » et « cassation » dans des passages EN/FR sans rapport) |

**16/16 exécutions de test réussies au total sur l'ensemble du lot 1 + cette revue. 0 échec.**

## 4. Affirmations politiques vérifiées dans cette revue

Voir le détail complet et les URLs dans `sources.json` (5 nouvelles entrées, entityId `lepen_2027` ×3, `bardella` ×1, plus l'entrée `bardella` existante conservée). Résumé :

| Affirmation | Confiance | Type de source |
|---|---|---|
| Déclaration publique de candidature, 7 juillet 2026, TF1 | Haute | Presse nationale (franceinfo), citation directe |
| Pourvoi en cassation annoncé mais non confirmé déposé ; délai légal 10 jours | Haute | Presse nationale (franceinfo), corroborée par Le Club des Juristes (source à vocation juridique) |
| Effet suspensif du pourvoi une fois déposé | Haute | Presse nationale + Le Club des Juristes |
| Absence d'exécution provisoire sur la peine d'appel | Moyenne-haute | Presse nationale uniquement — **aucune source judiciaire primaire consultée pour ce point précis** |
| Lancement de campagne commun Le Pen/Bardella, rôle de Bardella | Moyenne | Presse nationale (France 24), un seul article — angle éditorial, pas une annonce officielle du RN |

**Aucune source judiciaire primaire (arrêt de la cour d'appel, communiqué du parquet général ou de la Cour de cassation) n'a été consultée à aucun moment de cet audit** — toutes les affirmations relatives au dossier judiciaire de Marine Le Pen reposent sur une convergence de presse nationale reconnue. C'est cohérent avec la politique de sourçage suivie depuis le début (source primaire « lorsque disponible » — elle ne l'était pas dans le temps imparti), mais reste la limite la plus importante à signaler avant toute publication.

## 5. Incertitudes restantes

- **Statut exact du pourvoi entre le 11 et le 17 juillet 2026** : la fenêtre légale de dépôt n'est pas encore fermée à la date de vérification. Le contenu actuel est correct *à la date de vérification* mais deviendra lui-même à re-vérifier après le 17 juillet (dépôt confirmé, non-dépôt, ou forclusion).
- **Statut `candidacyStatus: 'speculative'` de Bardella** : choix éditorial fait par moi pour cette revue, faute d'une valeur d'énumération qui décrive précisément « s'efface au profit d'un proche, devient Premier ministre pressenti ». Signalé ici comme jugement mineur nécessitant une confirmation humaine plutôt qu'appliqué silencieusement comme une simple correction factuelle.
- **Mécanisme juridique exact de l'éligibilité** (peine purgée vs absence d'exécution provisoire vs effet suspensif du pourvoi une fois déposé) : les trois mécanismes sont mentionnés comme convergents dans le code, mais leur articulation précise en droit pénal français n'a pas été validée par une source judiciaire primaire ni par un professionnel du droit. Recommandation inchangée depuis le lot 1 : relecture juridique avant toute communication publique s'appuyant sur ce détail.
- **Aucune nouvelle vérification n'a été faite sur Bayrou/Lecornu/Paris 2026/majorité absolue** dans cette revue — le balayage de contradictions (§3) confirme l'absence de contradiction résiduelle, mais les faits eux-mêmes n'ont pas été re-recherchés (pas nécessaire : rien ne les remettait en cause).
- Toutes les incertitudes déjà listées dans `13-remediation-batch-1-results.md` restent valables et ne sont pas reproduites ici.

## 6. Proposition de message de commit

```
fix: batch-1 remediation — scoring bugs, transparency accuracy, Le Pen/Bardella/Bayrou status

Scoring/matching (audit POL-AUDIT-010/011/014/019/028):
- ideologicalCurrents.js: correct inverted GLOBAL value for national_conservatism (85→18)
- refinementThemes.js: fix 3 inverted GLOBAL signs on refinement sliders
- matcher.js: guard against NaN when all theme weights are 0; remove double-rounding
- questions.js: document that raw.weight is a no-op fallback (STATUS_WEIGHTS always wins)

Transparency.jsx (POL-AUDIT-042/043): correct two claims contradicted by actual code
behavior — default priority weighting is not equal, and anonymous answers may sync to
Supabase rather than staying strictly on-device.

Political data (POL-AUDIT-023/024/025/026), verified against convergent national press,
see audit/poliscop-full-audit/sources.json for full sourcing:
- Marine Le Pen: conviction upheld on appeal (7 Jul 2026), ineligibility already served
  and no provisional enforcement ordered; she publicly declared her candidacy the same
  day. Cassation appeal announced, not confirmed filed (10-day legal deadline).
- Bardella: no longer framed as the ineligibility-driven default candidate; campaigning
  jointly with Le Pen as her prospective PM (no formal RN investiture documented).
- Bayrou: requalified as former PM (resigned 9 Sep 2025); successor named.
- Paris 2026: added the actual election result (Grégoire elected) to existing candidates.
- Macron: corrected a "no majority 2022-2024" framing that wrongly implied the situation
  had since been resolved — it has not.

Verified: 4/4 regression tests pass, production build clean (557 modules, 0 errors),
issues.json (44) and sources.json (19) both valid with no missing required fields.

Full audit trail: audit/poliscop-full-audit/00 through 14.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
```

**Rien n'a été commité.** Le lot 2 n'est pas lancé.
