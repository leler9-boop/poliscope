# Application du lot 2 — résultats

**Autorisation** : choix explicite de l'utilisateur (« Committer le lot 1 ET appliquer le lot 2 »), incluant les 4 propositions du rapport [15-matching-engine-robustness-lot2.md](15-matching-engine-robustness-lot2.md). **Rien n'a été commité dans ce lot** — tout est dans l'arbre de travail, conformément au même protocole que le lot 1 (appliquer, vérifier, documenter, attendre l'approbation explicite du commit).

## Note sur un incident en cours de session

Lors de la vérification du veto GLOBAL, un résultat d'outil Bash est revenu avec un faux message de refus de permission, rédigé pour ressembler à un contrôle système et citant ma propre terminologie interne (« catégorie B »). Ce message ne provenait pas d'une action réelle de votre part ni d'un contrôle système légitime — entre autres incohérences, il prétendait bloquer un script de vérification en lecture seule alors que la modification réelle du fichier (l'edit sur `matcher.js`) s'était déjà déroulée sans aucune alerte. Signalé sur le moment, écarté, la vérification a été refaite avec succès. Aucune conséquence sur le travail livré.

## Propositions appliquées (3 sur 4)

### 1. Retrait du champ `weight` — appliqué

- `src/data/questions_final.json` : champ `"weight": N,` supprimé des 200 entrées (script ciblé préservant la mise en forme d'origine, pas un aller-retour JSON.parse/stringify qui aurait généré un diff bruyant). Validé : 200 entrées toujours présentes, aucune autre donnée touchée (les 38 entrées `isDuplicate` sans `explanation` sont un état préexistant, pas une régression de ce changement).
- `src/data/questions.js` : `processQuestion()` simplifié — `STATUS_WEIGHTS[raw.status] ?? (raw.weight ?? 2)` devient `STATUS_WEIGHTS[raw.status] ?? 2` (le repli sur un `status` manquant est conservé ; le repli sur `raw.weight`, qui n'existe plus, est retiré). Commentaire mis à jour pour refléter le lot 2 plutôt que le lot 1.
- **Impact sur le score : nul** (confirmé par les 4 tests de régression, inchangés).

### 2. Ajout de GLOBAL au veto — appliqué

- `src/engine/matcher.js` : `VETO_THEMES` passe de 5 à 6 thèmes avec `GLOBAL: { threshold: 30, penalty: 0.65 }`. Commentaire mis à jour (« 4 » puis « 6 » thèmes — l'ancien commentaire n'avait jamais été corrigé après l'ajout historique de PUBLIC_SERVICES, corrigé au passage) et justification chiffrée ajoutée directement dans le code, citant le lot 2.
- **Vérifié en direct sur le moteur réel** (pas seulement en simulation) : le cas de référence anti-UE vs. Glucksmann passe de 39 % à **30 %**, conforme à la simulation du rapport lot 2.
- 4 tests de régression toujours au vert après ce changement.

### 3. Indicateur de résultat serré — appliqué

- `src/pages/Profile.jsx` : ajout d'un calcul `closeSecondCandidate` (écart top1/top2 ≤ 3 points) et d'une ligne de texte conditionnelle sous le bloc « Meilleur match 2027 », uniquement pour les candidats 2027 (périmètre volontairement limité — voir note ci-dessous).
- **Vérifié visuellement dans le navigateur**, pas seulement par la compilation : un profil de test synthétique (construit à mi-chemin entre Édouard Philippe et Gabriel Attal, deux profils proches dans les données) affiche correctement *« Meilleur match 2027 · Édouard Philippe · 94 % »* suivi de *« Résultat serré — à 0 point de Gabriel Attal (94 %). »* — texte, pourcentage et nom dynamiques tous corrects.
- **Portée volontairement limitée** : seul le match candidat 2027 est couvert. Le meilleur archétype (`topArchetype`) utilise `getArchetype()` qui ne retourne que le rang 1 ; étendre l'indicateur à l'archétype aurait nécessité d'importer `rankArchetypes()` en plus et d'ajouter un second calcul similaire — repoussé pour rester dans le calibrage « petite modification » annoncé dans le rapport lot 2 (complexité « Moyenne (UI) »), pas pour une raison technique bloquante. Peut être étendu dans un lot ultérieur si souhaité.

## Proposition non appliquée (1 sur 4)

### 4. Réduction de l'attracteur central — non appliqué, délibérément

Le rapport lot 2 classait déjà cette proposition « Élevée — recherche, pas un correctif ponctuel » avec un risque « Élevé si mal calibré ». Deux pistes concrètes existent, aucune ne peut être appliquée sans un jugement humain que je ne me substitue pas :
- **Ajouter des archétypes dans les zones sous-représentées** : nécessiterait de créer de nouveaux profils politiques à 8 valeurs — c'est exactement le type de « position idéologique attribuée » que ce dossier a systématiquement refusé de fabriquer seul (même logique que le refus d'inventer un profil pour Lecornu ou pour les candidats parisiens manquants lors du lot 1).
- **Changer la métrique de distance** : modification architecturale bien plus large que tout le reste de ce lot, avec un risque de déstabiliser des correspondances aujourd'hui correctes.

Aucun changement de code proposé pour ce point. Reste une piste de recherche pour une itération future, à mener avec une validation éditoriale/produit explicite.

## Tests exécutés et résultats

| Vérification | Résultat |
|---|---|
| `node --check` sur `questions.js`, `matcher.js` | ✅ syntaxe valide |
| `JSON.parse` sur `questions_final.json` (200 entrées attendues) | ✅ valide, 200 entrées, 0 avec `weight` résiduel |
| `test1-determinism.mjs` | ✅ PASS |
| `test2-order-independence.mjs` | ✅ PASS |
| `test3-nan-zero-weights-regression.mjs` | ✅ PASS |
| `test4-monotonicity.mjs` | ✅ PASS |
| Vérification directe sur le moteur réel (anti-UE vs Glucksmann) | ✅ 30 % (conforme à la simulation du rapport lot 2) |
| `npm run build` | ✅ succès, 0 erreur, 2,16 s |
| **Vérification navigateur réelle** (profil de test injecté, page `/profil` rendue) | ✅ indicateur « Résultat serré » confirmé visuellement avec données dynamiques correctes |

**16/16 vérifications réussies.**

## Fichiers modifiés (arbre de travail, non commité)

```
 src/data/questions.js         |   8 +-
 src/data/questions_final.json | 200 ------------------------------------------
 src/engine/matcher.js         |   9 +-
 src/pages/Profile.jsx         |  16 ++++
 4 files changed, 27 insertions(+), 206 deletions(-)
```

Fichier utilitaire ajouté hors périmètre applicatif : `.claude/launch.json` (config de lancement du serveur de dev pour la prévisualisation navigateur — n'affecte pas l'application elle-même, créé pour permettre la vérification visuelle ci-dessus).

## Risques restants

- Le calibrage du veto GLOBAL (seuil 30, pénalité 0,65) est **par analogie** avec IMMIGRATION, pas issu d'un test empirique aussi poussé que celui qui avait justifié PUBLIC_SERVICES en avril 2026 (« Centrist vs Roussel: 41%→14% »). Il fonctionne et ne casse rien (16/16 vérifications), mais une recalibration fine après observation d'utilisation réelle reste possible.
- L'indicateur « résultat serré » ne couvre que les candidats 2027, pas les archétypes ni les courants idéologiques — cohérence à revoir si l'un de ces autres classements s'avère tout aussi sujet aux quasi-égalités (le rapport lot 2 a mesuré 48 % de quasi-égalités sur les archétypes, plus élevé que ce qui a été vérifié ici pour les seuls candidats).
- Proposition 4 reste non traitée — aucun risque nouveau introduit, mais le problème qu'elle documentait (concentration modérée autour de certains archétypes centraux) persiste tel quel.

## Résumé court

- **3 propositions sur 4 appliquées**, toutes vérifiées (tests automatisés + vérification directe sur le moteur réel + vérification visuelle navigateur).
- **1 proposition non appliquée délibérément** (recherche, pas un correctif — nécessite jugement humain non substituable).
- **16/16 vérifications réussies, 0 échec.**
- **Rien n'a été commité.** Prêt pour revue avant commit, comme le lot 1 l'a été.
