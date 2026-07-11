# Plan du lot de remédiation n°1

## Étape 2 — Classement des 23 constats prioritaires

### Catégorie A — correction technique objective (éligible à un patch)
POL-AUDIT-010, 011, 014, 019, 028 (traitement documentaire), 042 (volet « pondération égale » uniquement), 043. Auxquels s'ajoute POL-AUDIT-001, objectivement de catégorie A mais dont le calibre dépasse un lot 1 (2 fichiers, un chemin d'écriture Supabase) — reporté au lot 2.

### Catégorie B — validation éditoriale ou politique requise (non corrigé automatiquement)
POL-AUDIT-012 (GLOBAL doit-il être vétoïsé ?), 013 (le comportement de pondération par défaut doit-il changer, ou seulement sa description ?), 015 (le cumul multiplicatif du veto est-il voulu ?), 016 (dilution du veto par une pondération concentrée — comportement ou bug ?), 017 (effet d'attracteur central — limite acceptée ou à corriger ?), 018 (seuil DEMOCRACY — asymétrie voulue ou coquille ?), 021 (faut-il ajouter un archétype souverainiste modéré, et avec quelles valeurs ?), 035 (faut-il ajouter une catégorie « extrême gauche », et qui y classer ?), 037 (quel jeu de seuils devient la référence unique ?), 042 (volet « explication du veto » — quel degré de détail exposer au public ?). Voir la liste de questions pour décision humaine dans [00-executive-summary.md](00-executive-summary.md) §5 — inchangée, ces constats n'ont pas été retraités ici.

### Catégorie C — validation juridique requise (aucun avis juridique définitif fourni ici)
POL-AUDIT-041 (consentement RGPD Art. 9). Rappel : ce document ne constitue pas un avis juridique ; la mise en œuvre (case à cocher, table `user_consents`, texte de consentement) nécessite une validation par un professionnel du droit avant déploiement, en particulier sur la portée exacte du consentement (bloquant pour tout profil vs bloquant pour la sauvegarde cloud seulement — question posée dans le résumé exécutif, non tranchée ici).

### Traitement séparé — données politiques publiques (Étape 5, hors A/B/C)
POL-AUDIT-023, 024, 025, 026 : traitées à l'Étape 5 de ce document selon un protocole dédié (sourçage, dates, confiance), pas comme des « patches » techniques. POL-AUDIT-027 : laissé en dehors de tout lot pour l'instant — la chronologie exacte n'étant pas confirmée avec certitude, aucune correction n'est proposée ; l'option la plus sûre si une décision est nécessaire rapidement serait de supprimer la parenthèse ambiguë plutôt que d'affirmer une chronologie non vérifiée, mais ce choix est laissé à une prochaine itération plutôt qu'inclus ici pour respecter le plafond de 7 corrections.

## Étape 3 — Lot 1 : 7 corrections proposées

Critères appliqués : certaines, objectives, petites, testables, sans arbitrage politique majeur, sans changement architectural. Aucune donnée politique (candidats, personnalités, positions) n'est touchée dans ce lot — uniquement du code moteur, un commentaire, et deux phrases d'une page de méthodologie.

---

### 1. POL-AUDIT-010 — `src/data/ideologicalCurrents.js`

- **Comportement actuel** : le courant `national_conservatism` (ligne 298) a `profile.GLOBAL = 85`, valeur de mondialiste convaincu, alors que sa description (`shortDesc`, `keyBeliefs`) est explicitement souverainiste.
- **Comportement attendu** : `GLOBAL = 18`, cohérent avec les deux profils analogues du même fichier (lignes 261 et 446, `GLOBAL: 18`).
- **Patch envisagé** : `proposed-patches/POL-AUDIT-010-ideologicalCurrents-global-value.patch` (déjà généré et vérifié `git apply --check` lors de l'audit initial).
- **Test associé** : vérification ad hoc (`node -e`, pas de fichier persisté — un seul nombre à comparer) : calculer `calculateAlignment` entre (a) un profil europhile synthétique et (b) un profil souverainiste synthétique contre `national_conservatism`, avant/après patch — le classement doit s'inverser dans le bon sens (souverainiste > europhile après correction).
- **Risque de régression** : quasi nul — valeur isolée dans un objet non référencé ailleurs ; seul l'alignement avec ce courant spécifique change, aucun autre courant/archétype/candidat/question n'est affecté.
- **Rollback** : `git checkout -- src/data/ideologicalCurrents.js` avant commit ; `git revert <hash>` après.

---

### 2. POL-AUDIT-011 — `src/data/refinementThemes.js`

- **Comportement actuel** : 3 curseurs de raffinement de profil (`trade` l.65, `intl_cooperation` l.268, `sovereignty` l.290) appliquent un ajustement GLOBAL inversé par rapport à la convention (0=nationaliste, 100=mondialiste) et par rapport à leur propre libellé (`moreLabel`/`lessLabel`).
- **Comportement attendu** : déplacer le curseur vers « Libre-échange »/« Multilatéralisme » doit augmenter GLOBAL ; vers « Nation d'abord »/« Souveraineté nationale » doit le diminuer.
- **Patch envisagé** : `proposed-patches/POL-AUDIT-011-refinementThemes-global-sign.patch` (vérifié `git apply --check`).
- **Test associé** : vérification ad hoc (`node -e`) reproduisant `buildAdjustedThemes`/le calcul du gestionnaire de curseur (`Profile.jsx:132-134,1323-1325`) : simuler `sliderValue=+2` sur le curseur `trade` avant/après patch, confirmer que GLOBAL augmente après correction (il diminuait avant).
- **Risque de régression** : faible — confirmé par lecture du code consommateur (Étape 1) : addition simple, aucune négation compensatoire ailleurs qui rendrait ce correctif incorrect. Seul effet : les utilisateurs ayant déjà utilisé ces 3 curseurs avant le correctif verront leur ajustement GLOBAL s'inverser au prochain calcul — acceptable puisque l'ancien comportement était le bug.
- **Rollback** : idem.

---

### 3. POL-AUDIT-014 — `src/engine/matcher.js`

- **Comportement actuel** : `meanDistance = weightedDistanceSum / totalWeight` sans garde ; retourne `NaN` si `totalWeight = 0` (atteignable si `themeWeights` attribue 0 à tous les thèmes).
- **Comportement attendu** : retombe sur une distance neutre (0.5) plutôt que `NaN`.
- **Patch envisagé** : `proposed-patches/POL-AUDIT-014-matcher-nan-guard.patch` (vérifié `git apply --check`).
- **Test associé** : **`proposed-tests/test3-nan-zero-weights-regression.mjs` existe déjà** — actuellement en échec attendu (`FAIL`). Doit passer à `PASS` après application du patch. C'est le test le plus direct de tout le lot 1 : un fichier de test dédié existe déjà pour ce bug précis.
- **Risque de régression** : nul — le cas `totalWeight > 0` (100% des cas normaux) est strictement inchangé ; seul le cas actuellement cassé (`NaN`) est modifié.
- **Rollback** : idem.

---

### 4. POL-AUDIT-019 — `src/engine/matcher.js`

- **Comportement actuel** : `Math.round` appliqué deux fois — une fois sur `baseAlignment` (avant veto), une fois sur `alignment` final (après veto) — pouvant inverser un classement dans de rares cas (0,04% mesuré sur 200 000 tirages lors de l'audit initial).
- **Comportement attendu** : un seul arrondi, appliqué uniquement au résultat final après veto.
- **Patch envisagé** : nouveau, non préparé lors de l'audit initial (seul le constat existait) — à écrire : retirer `Math.round(...)` autour de `baseAlignment` (garder la valeur flottante), ne conserver que le `Math.round` final.
- **Test associé** : vérification ad hoc (`node -e`) — reproduire ~1000 tirages aléatoires (échelle réduite par rapport aux 200 000 de l'audit initial, suffisant pour un test de non-régression rapide) et confirmer 0 divergence entre le résultat simple-arrondi et le résultat double-arrondi original sur ce lot réduit, ou au minimum confirmer que le nombre d'inversions ne peut plus se produire par construction (preuve algébrique : un seul arrondi final ne peut pas produire l'artefact identifié).
- **Risque de régression** : très faible — rend le résultat strictement plus précis ; les scores affichés (déjà arrondis à l'entier en sortie) ne changent que dans les cas limites déjà identifiés comme incorrects.
- **Rollback** : idem.

---

### 5. POL-AUDIT-028 — `src/data/questions.js` (commentaire uniquement, aucun changement de comportement)

- **Comportement actuel** : `weight: STATUS_WEIGHTS[raw.status] ?? (raw.weight ?? 2)` (ligne 145) — le champ `weight` brut du JSON n'a d'effet que si `status` est absent/invalide, ce qui n'arrive jamais en pratique (confirmé : les 162 questions actives ont toutes un `status` valide). Aucun commentaire n'explique cette priorité, ce qui a déjà causé une mauvaise lecture lors de l'audit initial du contenu.
- **Comportement attendu** : même comportement, mais documenté explicitement pour éviter qu'un futur éditeur de contenu modifie `weight` dans `questions_final.json` en pensant que cela a un effet.
- **Patch envisagé** : ajout d'un commentaire d'une ligne au-dessus de la ligne 145, ex. `// STATUS_WEIGHTS always wins when status is set (true for 100% of the live corpus) — raw.weight is a fallback only, editing it has no effect in practice.` Aucune ligne de logique modifiée.
- **Test associé** : aucun — modification purement documentaire, zéro comportement à tester. Vérification suffisante : `npm run build` ne doit produire aucune nouvelle erreur (un commentaire ne peut pas casser un build, mais la vérification est gratuite).
- **Risque de régression** : nul.
- **Rollback** : idem.

---

### 6. POL-AUDIT-042 (volet « pondération égale » uniquement) — `src/pages/Transparency.jsx`

- **Comportement actuel** : le texte (étape 05, EN l.38 / FR l.96) affirme *« Si vous ignorez le classement, tous les sujets sont pondérés à parts égales »* — faux : `useStore.js:65` fixe `priorityOrder` à l'ordre de déclaration des thèmes, traduit en poids 8→1 par `matcher.js`.
- **Comportement attendu** : le texte doit décrire fidèlement le comportement réel actuel (poids par ordre de déclaration), **sans changer le comportement du moteur** — ce lot ne touche pas `useStore.js`/`matcher.js` sur ce point (changer le comportement réel est catégorie B, cf. POL-AUDIT-013).
- **Patch envisagé** : reformulation des 2 phrases (EN + FR), ex. FR : *« Si vous ignorez ce classement, les thèmes sont pris dans un ordre par défaut qui n'est pas neutre — nous recommandons de faire le classement pour un résultat plus fidèle à vos priorités. »* (formulation indicative, à valider éditorialement — voir note ci-dessous).
- **Test associé** : aucun test automatisé (fichier `.jsx`, contenu textuel) — vérification par relecture + `npm run build` pour confirmer l'absence d'erreur de syntaxe JSX.
- **Risque de régression** : nul sur le comportement ; **risque éditorial mineur** — la formulation exacte de remplacement reste un choix rédactionnel. Ce correctif est inclus dans le lot 1 seulement parce que la mission le cite explicitement comme exemple-type de catégorie A (« texte de transparence contredit directement par le code ») ; la reformulation proposée sera signalée séparément pour relecture avant application (voir Étape 4).
- **Rollback** : idem.

---

### 7. POL-AUDIT-043 — `src/pages/Transparency.jsx`

- **Comportement actuel** : le texte (EN l.57 / FR l.115) affirme que les réponses *« ne quittent jamais l'appareil sauf création de compte »* — faux quand Supabase est configuré : `useStore.js:247-257` envoie les réponses des utilisateurs anonymes vers `anonymous_answers` sans création de compte.
- **Comportement attendu** : texte fidèle au comportement réel, sans changer ce comportement dans ce lot (changer le comportement d'upload anonyme touche à la collecte de données sensibles → catégorie C, cf. POL-AUDIT-041).
- **Patch envisagé** : reformulation des 2 phrases, ex. FR : *« Vos réponses sont stockées localement. Si l'application est connectée à un service cloud, une copie anonyme peut être envoyée pour permettre de retrouver votre profil si vous créez un compte plus tard ; aucune information d'identification n'y est associée avant la création d'un compte. »* (formulation indicative, à valider).
- **Test associé** : idem POL-AUDIT-042 — relecture + `npm run build`.
- **Risque de régression** : nul sur le comportement ; même réserve éditoriale que POL-AUDIT-042.
- **Rollback** : idem.

---

## Note sur les 2 corrections de `Transparency.jsx` (042/043)

Conformément à la consigne *« Ne réalise aucune modification éditoriale ou politique impliquant un jugement humain sans la signaler séparément »* : la **décision de corriger ces phrases** est objective (elles contredisent le code, exemple cité explicitement par la mission), mais **la formulation exacte de remplacement** implique un micro-jugement rédactionnel (ton, niveau de détail). Je le signale ici séparément : à l'Étape 4, j'appliquerai une formulation minimale et factuelle plutôt qu'une réécriture élaborée, et je la présenterai explicitement dans le rapport du lot 1 pour validation a posteriori plutôt que de la considérer comme un simple patch mécanique.

## Étape 5 — protocole pour les données politiques urgentes (appliqué séparément, voir [13-remediation-batch-1-results.md](13-remediation-batch-1-results.md))

Ne sont **pas** inclus dans le lot 1 technique ci-dessus. Traités séparément avec le protocole suivant, à partir des sources déjà réunies dans `sources.json` (aucune nouvelle recherche web menée dans cette phase) :

- **Marine Le Pen** (POL-AUDIT-023) : mise à jour de `elections.js` (8 emplacements) + `frenchFigures.js` (1 emplacement) en distinguant explicitement : condamnation confirmée (oui) · peine prononcée (3 ans dont 1 an ferme sous bracelet électronique, 100 000 € d'amende) · inéligibilité (45 mois dont 30 avec sursis, soit 15 mois fermes, déjà purgés au 30 juin 2026) · éligibilité 2027 (oui, confirmée) · candidature déclarée (non officiellement tranchée au 10/07/2026 — elle a annoncé son intention, pas de déclaration formelle RN) · pourvoi en cassation (formé, sans effet suspensif) · date de vérification (2026-07-10) · source primaire (aucune source officielle judiciaire directement citée dans `sources.json` — uniquement presse nationale convergente ; **limite à signaler** : pas de source primaire de type Cour d'appel/Ministère de la Justice dans le lot actuel, seulement 7 sources de presse convergentes).
- **Sébastien Lecornu / Bayrou** (POL-AUDIT-024) : recensement préalable de **tous** les emplacements avant correction (fait à l'Étape 1 : `frenchFigures.js:358,360` pour Bayrou ; 0 occurrence de Lecornu dans les 4 fichiers de données politiques) pour éviter toute contradiction interne.
- **Paris 2026** (POL-AUDIT-025/026) : ajout du résultat final et des candidats manquants, correction du cadrage de majorité.

Ces corrections politiques ne sont **pas** appliquées dans ce document de planification — elles le seront, si validées, dans un lot séparé identifié dans le rapport du lot 1, avec les métadonnées source/date/confiance demandées par la mission.
