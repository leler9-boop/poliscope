# Audit du matchmaking

Fichiers audités : `src/engine/matcher.js` (176 lignes), `src/engine/archetypeEngine.js` (49 lignes), `src/data/archetypes.js` (18 archétypes), `src/data/ideologicalCurrents.js` (12 courants), `src/data/refinementThemes.js`. Vérification structurelle automatisée exhaustive (script Node, pas un échantillon) sur les **170 profils de référence** existants (archétypes + courants + `frenchFigures.js` + `historicalFigures.js` + candidats/partis d'`elections.js`).

## 1. Modèle mathématique complet

$$\text{poids}(t) = \begin{cases} \text{themeWeights}[t] & \text{si allocation manuelle 100 pts fournie} \\ 8 - \text{rang}(t) & \text{sinon, dérivé de } priorityOrder \text{ (rang 1} \to 8,\ \text{rang 8} \to 1) \end{cases}$$

$$\text{distance}(t) = \frac{|\text{userThemes}(t) - \text{targetProfile}(t)|}{100} \in [0,1]$$

$$\text{meanDistance} = \frac{\sum_t \text{poids}(t) \times \text{distance}(t)}{\sum_t \text{poids}(t)}$$

$$\text{baseAlignment} = \text{round}\left((1-\text{meanDistance})^{2.4} \times 100\right)$$

**Veto multiplicatif** (mécanisme non trivial, seul décrit dans les commentaires de code, absent de toute documentation utilisateur) sur exactement 5 des 8 thèmes :

| Thème vétoïsé | Seuil | Pénalité plancher |
|---|---|---|
| IMMIGRATION | 30 | 0.62 |
| ECONOMY | 30 | 0.72 |
| SOCIAL | 42 | 0.78 |
| SECURITY | 42 | 0.78 |
| PUBLIC_SERVICES | 42 | 0.82 |

DEMOCRACY, ENVIRONMENT et **GLOBAL** en sont exclus. Pour chaque thème vétoïsé où `dist(t) = |userThemes(t) - target(t)| > seuil(t)` :

$$\tau = \frac{\text{dist}(t) - \text{seuil}(t)}{100 - \text{seuil}(t)}, \qquad \text{multiplicateur}(t) = 1 - \tau \times (1-\text{pénalité}(t))$$

$$\text{vetoMultiplier} = \prod_{t \in \text{vétoïsés, dist}(t)>\text{seuil}} \text{multiplicateur}(t) \qquad \text{(cumulatif)}$$

$$\text{alignment} = \text{clamp}_{[0,100]}\big(\text{round}(\text{baseAlignment} \times \text{vetoMultiplier})\big)$$

## 2. Constats

**POL-AUDIT-010 [CRITIQUE, confiance high]** — *Valeur GLOBAL incohérente pour le courant « Conservatisme national ».*
`src/data/ideologicalCurrents.js:298` (bloc `national_conservatism`) : `profile.GLOBAL = 85` (très pro-UE/mondialiste selon la convention `0=nationalist, 100=globalist` en vigueur partout ailleurs), alors que `shortDesc`/`keyBeliefs` du même bloc sont explicitement souverainistes (« souveraineté face à l'intégration mondiale », « rejet du mondialisme »). Les archétypes analogues (`national_populiste`, `patriote_social`) ont `GLOBAL` entre 18 et 20. **Preuve chiffrée** : deux utilisateurs identiques sur 7 thèmes, ne différant que sur GLOBAL (15 vs 90), obtiennent respectivement 78% et 96% de compatibilité avec ce courant — **le système recommande un courant souverainiste plus fortement à un utilisateur europhile qu'à un utilisateur réellement souverainiste.** C'est le problème le plus grave de tout l'audit : une inversion directe et mesurable du résultat pour un courant politique entier. Correctif immédiat, sans risque : corriger `GLOBAL` à ~15-20.

**POL-AUDIT-011 [ÉLEVÉ, confiance medium]** — *Inversion de signe GLOBAL sur 3 curseurs de `refinementThemes.js`.*
`refinementThemes.js:65` (`trade`, « Libre-échange » → `GLOBAL: -2`), `:268` (`intl_cooperation`, « Multilatéralisme » → `GLOBAL: -5`), `:290` (`sovereignty`, « Nation d'abord » → `GLOBAL: +5`). Les 3 sont cohérents entre eux mais **inversés** par rapport à la convention documentée : pousser vers « Nation d'abord »/souveraineté **augmente** GLOBAL (devrait baisser) ; pousser vers « Multilatéralisme »/libre-échange le **diminue** (devrait augmenter). Confiance medium : l'effet en base de données est confirmé, l'effet final côté UI (composant React consommant ce fichier) n'a pas été vérifié dans le cadre de cet audit — à confirmer avant correction.

**POL-AUDIT-012 [ÉLEVÉ, confiance high]** — *GLOBAL absent des thèmes vétoïsés.*
Un utilisateur anti-UE (GLOBAL=5) face à une figure très pro-UE (Glucksmann, GLOBAL=82 — distance 77/100, quasi maximale) obtient **48 à 55%** selon pondération. Or `alignmentLabel()` (`matcher.js:153-176`) affiche « Forte compatibilité » dès 50%. **Un désaccord quasi total et fondamental sur l'appartenance européenne peut donc s'afficher comme « Forte compatibilité »** — alors qu'IMMIGRATION, un clivage identitaire comparable, est bien vétoïsé. Recommandation : évaluer l'ajout de GLOBAL à `VETO_THEMES` (seuil ~35-40, pénalité ~0.65-0.70, cohérent avec IMMIGRATION).

**POL-AUDIT-013 [ÉLEVÉ, confiance high]** — *Poids par défaut non égaux quand l'utilisateur ne reclasse pas ses priorités.*
`useStore.js:65` initialise `priorityOrder: [...THEMES_ORDER]` (ordre de déclaration fixe : ECONOMY, SOCIAL, IMMIGRATION, SECURITY, ENVIRONMENT, DEMOCRACY, GLOBAL, PUBLIC_SERVICES). `calculateAlignment()` traduit ce classement en poids 8→1 dès qu'aucune allocation manuelle n'est fournie. **Preuve chiffrée** (cible neutre à 50 partout, écart identique de 30 points sur un seul thème) : un écart sur ECONOMY (poids 8) donne 85% ; le même écart sur PUBLIC_SERVICES (poids 1) donne 98% — 13 points d'écart dus uniquement à la position dans un tableau qui ne devrait être qu'un registre neutre. **Ce constat est direct et à fort impact : la majorité des utilisateurs qui ne réordonnent pas manuellement l'écran de priorités sont concernés**, et `Transparency.jsx` affirme explicitement (et à tort) que la pondération est égale dans ce cas — voir [04-scoring-methodology.md](04-scoring-methodology.md) §4. Le même défaut affecte spécifiquement `archetypeEngine.js:19,31,34` (`priorityOrder ?? []` — un tableau vide retombe silencieusement sur `THEMES_ORDER` dans `matcher.js`). Correctif : poids égaux par défaut tant que l'utilisateur n'a pas explicitement classé ses priorités.

**POL-AUDIT-014 [MOYEN, confiance high]** — *NaN si tous les poids de thème sont à zéro.* `matcher.js:55`, `weightedDistanceSum / totalWeight` sans garde. Confirmé par calcul direct ET par test automatisé exécutable (`proposed-tests/test3-nan-zero-weights-regression.mjs`, échoue comme attendu — sortie réelle : `NaN`). Correctif trivial : `totalWeight > 0 ? ... : 0.5`.

**POL-AUDIT-015 [MOYEN, confiance high]** — *Cumul multiplicatif du veto : désaccord modéré multi-axes ≈ désaccord extrême mono-axe.* Désaccord modéré (distance 60/100, pas extrême) simultané sur les 5 thèmes vétoïsés → `vetoMultiplier = 0.6038`. Désaccord **total** (distance 100/100) sur **1 seul** thème → `vetoMultiplier = 0.62`. Quasiment identique. Le commentaire du code ne documente que le cas mono-thème. Non nécessairement un bug (peut être un choix de modélisation défendable : un désaccord généralisé sur plusieurs sujets clivants est peut-être réellement disqualifiant), mais **non documenté et jamais testé comme tel** — à trancher explicitement plutôt qu'à laisser comme effet de bord non spécifié.

**POL-AUDIT-016 [MOYEN, confiance high]** — *Une pondération de priorité très concentrée peut diluer le veto sur un profil par ailleurs extrême.* Profil testé : SOCIAL=10, IMMIGRATION=95, SECURITY=92 (extrême) mais ECONOMY=65, avec 80/100 points alloués à ECONOMY seul → 64% avec un centriste (Bayrou) contre 26% avec le candidat le plus proche idéologiquement sur les autres axes (Le Pen). Reflète les priorités déclarées par l'utilisateur (pas nécessairement un bug), mais peut produire un résultat contre-intuitif à l'écran — à documenter dans l'explication du résultat.

**POL-AUDIT-017 [MOYEN, confiance high]** — *Effet d'attracteur central pour les profils sous-déterminés.* Deux utilisateurs opposés sur un seul axe (ex. ECONOMY=35 vs 65, reste à 50 par défaut) matchent tous deux en top-1 avec le même archétype central (`gaulliste_social`, 74%/79%). Mathématiquement cohérent (distance minimale au profil le plus central de l'espace), mais réduit la valeur discriminante du matching pour les profils peu renseignés (mode Découverte, 16 questions) — limite connue à documenter plutôt qu'à corriger structurellement.

**POL-AUDIT-019 [FAIBLE, confiance high]** — *Double-arrondi pouvant inverser un classement.* `matcher.js:63,88` arrondit `baseAlignment` avant le veto puis ré-arrondit après. Simulation Monte-Carlo (200 000 triplets aléatoires) : 79 inversions de classement (0,04%), toujours d'un seul point. Correctif simple et sans risque : un seul `Math.round`, après le veto.

**POL-AUDIT-021 [MOYEN, confiance high]** — *Trou de couverture : pas d'archétype « souverainiste modéré non-extrême ».* Les profils synthétiques « droite souverainiste » et « fortement eurosceptique » (économiquement/socialement modérés mais GLOBAL très bas) sont classés avec `patriote_social`/`national_populiste` (archétypes d'extrême droite), faute d'alternative modérée. Impact utilisateur réel : un souverainiste modéré (type gaulliste) peut se voir étiqueter « extrême droite » par le système. Pas un bug de calcul — un manque de données de référence.

**POL-AUDIT-020 [FAIBLE, confiance high]** — `historicalFigures.js:1` affirme « 40 figures » ; le fichier en contient réellement 60 (vérifié par script, 0 doublon d'ID). Cosmétique, à corriger dans le même mouvement que les autres corrections de documentation.

## 3. Tableau des 15 profils synthétiques (Phase 6.3)

Calculés avec le moteur réel, poids égaux sur les 8 thèmes (pour neutraliser POL-AUDIT-013 et isoler le comportement du veto/de l'exposant).

| Profil | Top match obtenu | Attendu | Écart | Sévérité |
|---|---|---|---|---|
| Gauche économique et progressiste | humaniste_gauche 88% (insoumis 85%) | gauche radicale/insoumis | Faible — 2 archétypes proches, plausible | Faible |
| Gauche souverainiste | souverainiste_gauche 98% | souverainiste_gauche | Aucun | — |
| Social-démocrate | social_democrate 96% | social_democrate | Aucun | — |
| Écologiste | ecologiste_engage 96% | ecologiste_engage | Aucun | — |
| Centriste libéral | centriste_republicain 95% ≈ reformiste_liberal 95% | centriste_republicain | Quasi ex æquo (redondance de données) | Faible |
| Libéral économique et progressiste | liberal_progressiste 79% | liberal_progressiste | Direction correcte, score modéré — pas d'archétype « libéral fort + progressiste fort » dédié | Faible |
| Conservateur libéral | liberal_conservateur 100% | liberal_conservateur | Aucun | — |
| Droite républicaine | republicain_conservateur 95% | republicain_conservateur | Aucun | — |
| Droite souverainiste | patriote_social 81% (national_populiste 78%) | souverainiste modéré (type gaulliste) | Collision avec extrême droite — trou de couverture (POL-AUDIT-021) | Moyen |
| Droite nationale | national_populiste 97% | national_populiste | Aucun | — |
| Autoritaire interventionniste | patriote_social 77% | patriote_social/social_patriote | Cohérent | Faible |
| Libertarien | liberal_progressiste 51% (archétypes) / libertarianism 92% (courants) | libertarianism | Plafond bas côté archétypes, comblé par la couche courants (bon point de conception) | Faible |
| Fortement pro-européen | progressiste_europeen 81% ≈ liberal_progressiste 81% | progressiste_europeen | Quasi ex æquo, cohérent | Faible |
| Fortement eurosceptique | patriote_social 75% | souverainiste modéré | Même trou de couverture que « droite souverainiste » | Moyen |
| Hétérogène/contradictoire | centriste_republicain 40% ≈ gaulliste_social 40% | aucun bon match attendu | **Conforme** — tous les scores restent bas (<41%), pas de faux match fort fabriqué | — (succès) |

**Bilan : 12/15 profils obtiennent le match attendu avec un score fort ; 2/15 révèlent le trou de couverture « souverainisme modéré » ; 1/15 confirme le bon comportement attendu pour un profil incohérent (pas de faux positif).**

## 4. Tests par contradiction (Phase 6.4)

1. **Deux profils opposés → même top match** : confirmé (effet d'attracteur central, POL-AUDIT-017).
2. **Bascule autour d'un seuil de veto** (IMMIGRATION, seuil=30) : dist=28→92%, 29→92%, 30→91%, 31→91%, 32→90%. **Aucun saut brutal** — le veto lissé fonctionne comme conçu, contrairement à la crainte initiale du coordinateur. **Bon point de conception à souligner.**
3. **Utilisateur extrême classé proche d'un candidat modéré** : confirmé (POL-AUDIT-016).
4. **Utilisateur anti-européen classé avec une figure pro-européenne, label « Forte compatibilité »** : confirmé (POL-AUDIT-012).

## 5. Cohérence structurelle des profils de référence (vérification exhaustive, pas un échantillon)

| Fichier | Profils vérifiés | Résultat |
|---|---|---|
| `archetypes.js` | 18/18 | 100% valides (8 clés exactes, valeurs ∈[0,100]) |
| `ideologicalCurrents.js` | 12/12 | 100% structurellement valides ; **1 incohérence sémantique majeure** (POL-AUDIT-010) |
| `frenchFigures.js` | 28/28 | 100% valides |
| `historicalFigures.js` | 60/60 (commentaire dit 40 — POL-AUDIT-020) | 100% valides, 0 doublon d'ID |
| `elections.js` (candidats/partis, 10 scrutins) | 52/52 | 100% valides |

**Total : 170 profils vérifiés, 0 clé manquante, 0 valeur hors [0,100], 0 NaN.** L'intégrité structurelle est excellente — le seul problème trouvé (POL-AUDIT-010) est un problème de **valeur sémantiquement incorrecte**, invisible à toute validation de schéma automatique, ce qui souligne l'intérêt d'une relecture éditoriale humaine périodique des profils de référence en plus de toute validation technique.

## 6. Synthèse

Le moteur de matching est robuste sur le plan structurel (aucune anomalie de schéma sur 170 profils, veto lissé sans effet de seuil brutal, bon comportement sur profil incohérent) mais contient **un bug de données à impact direct et démontré sur un résultat politique affiché** (POL-AUDIT-010, sévérité critique) et **trois angles morts autour de la dimension européenne/souverainiste** (GLOBAL non vétoïsé, GLOBAL inversé dans les curseurs de raffinement, pas d'archétype souverainiste modéré) qui, ensemble, désavantagent systématiquement la capacité du système à représenter fidèlement le clivage pro-UE/souverainiste — pourtant l'un des axes structurants du paysage politique français actuel.
