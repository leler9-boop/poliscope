# Méthodologie de scoring — reconstruction et audit mathématique

Fichier audité : `src/engine/scorer.js` (178 lignes). Reconstruction confirmée par relecture directe (coordinateur + Subagent 2, indépendamment).

## 1. Modèle mathématique complet

### 1.1 Score par thème

Pour chaque question répondue $q$ de thème $t$ :

$$\text{normalized}(q) = \frac{\text{answer}(q) - 1}{4} \in [0,1] \quad (\text{answer} \in \{1,2,3,4,5\})$$

$$\text{contribution}(q) = \begin{cases} \text{normalized}(q) & \text{si } \text{direction}(q) = 1 \\ 1 - \text{normalized}(q) & \text{si } \text{direction}(q) = -1 \end{cases}$$

$$\text{poids appliqué}(q) = \text{STATUS\_WEIGHTS}[\text{status}(q)] \quad (\text{CORE}=10,\ \text{PRIMARY}=5,\ \text{SECONDARY}=2)$$

$$\text{raw}(t) = \text{round}\left(100 \times \frac{\sum_{q \in t} \text{contribution}(q) \times \text{poids}(q)}{\sum_{q \in t} \text{poids}(q)}\right)$$

Si aucune question de $t$ n'est répondue : $\text{theme}(t) = 50$ (valeur par défaut, centre).

### 1.2 `stretchScore()` — transformation non-linéaire (point critique, non documenté hors code)

$$\text{theme}(t) = 50 + \text{sign}(raw(t)-50) \times \left(\frac{|raw(t)-50|}{50}\right)^{0.75} \times 50$$

Fonction monotone, centre-préservante (50→50), qui **écarte tous les scores non-centraux vers les extrêmes**. Valeurs réellement produites par la fonction (vérifiées par exécution directe par le Subagent 2, qui corrige les exemples donnés dans le commentaire du code source lui-même) :

| Entrée | Commentaire du code affirme | Valeur réelle produite |
|---|---|---|
| 60 | ~65 | 65 (exact) |
| 70 | ~77 | **75** |
| 80 | ~86 | **84** |
| 90 | ~93 | **92** |

**Constat POL-AUDIT-022 (faible)** : le commentaire explicatif de `stretchScore()` (`scorer.js:12-14`) contient des exemples numériquement faux sur 3 des 4 cas cités. La formule elle-même est cohérente et déterministe ; seule la documentation inline est erronée.

**Aucune trace de `stretchScore()` n'apparaît sur la page publique de méthodologie (`Transparency.jsx`)** — voir §4.

### 1.3 Axes dérivés (calculés à partir des thèmes DÉJÀ étirés par `stretchScore`)

$$\text{economic} = 0.5 \times \text{ECONOMY} + 0.5 \times (100 - \text{PUBLIC\_SERVICES})$$
$$\text{social} = 0.45 \times \text{SOCIAL} + 0.30 \times (100-\text{IMMIGRATION}) + 0.25 \times (100-\text{SECURITY})$$
$$\text{institutional} = 0.60 \times \text{DEMOCRACY} + 0.25 \times (100-\text{SECURITY}) + 0.15 \times \text{GLOBAL}$$
$$\text{international} = 0.55 \times \text{GLOBAL} + 0.25 \times (100-\text{IMMIGRATION}) + 0.20 \times \text{DEMOCRACY}$$

Les 4 combinaisons sont convexes (coefficients positifs sommant à 1), donc bornées dans [0,100] — pas de risque de dépassement d'intervalle. Aucune inversion de signe détectée dans ces 4 formules.

### 1.4 Confiance

$$\text{confidenceScore} = \min\left(100, \text{round}\left(\frac{\text{answeredCount}}{64} \times 100\right)\right)$$

Paliers : <8 `very_low` · <16 `low` · <32 `medium` · <64 `high` · ≥64 `very_high`. Calibré sur le mode le plus long (Approfondi, 64 questions) — cohérent avec la restructuration récente des modes 16/32/64 (commit `7465142`).

## 2. Constats — scoring

**POL-AUDIT-028 [ÉLEVÉ, confiance high]** — *Le champ `weight` du JSON n'a aucun effet réel sur le score.*
Preuve : `questions.js:145`, `STATUS_WEIGHTS[raw.status] ?? (raw.weight ?? 2)` — dès que `status` est défini (le cas pour 100% du corpus), c'est **toujours** `STATUS_WEIGHTS` qui l'emporte, jamais `raw.weight`. Exemple concret : `ENV_1` et `PUB_1` affichent `weight: 5` dans les données mais leur poids réellement appliqué est 2 (SECONDARY). Impact : un rédacteur de contenu modifiant `weight` en pensant changer l'importance d'une question n'a aucun effet réel — risque de confusion silencieuse pour toute maintenance éditoriale future, et incohérence entre l'intention affichée dans les données et le comportement du moteur. Correctif : supprimer le champ `weight` du schéma JSON (source de confusion sans effet), ou modifier `questions.js` pour qu'il soit réellement pris en compte (ex. multiplicateur fin à l'intérieur d'un statut).

**POL-AUDIT-018 [MOYEN, confiance high]** — *Asymétrie de seuils non documentée dans `profileSummary.js`.*
`getSpecialConcernSentence()` (`profileSummary.js:82-89`) : `ENVIRONMENT`/`SECURITY`/`GLOBAL` (haut et bas) sont tous à seuil symétrique 72. `DEMOCRACY` (haut) = 76 (plus strict de 4 pts), `DEMOCRACY_LOW` (bas, soit `DEMOCRACY≤38`) = 62 (plus laxiste de 10 pts). Aucun commentaire ne justifie cette asymétrie. Effet concret : un utilisateur à DEMOCRACY=38 (12 pts sous le centre) déclenche la phrase « sceptique envers les institutions », alors qu'un utilisateur à SECURITY=35 (15 pts sous le centre, écart plus marqué) ne déclenche pas la phrase équivalente (seuil 72 non atteint : 100-35=65<72). N'affecte que le texte de résumé, pas le classement — sévérité limitée au texte affiché, pas au matching.

**POL-AUDIT-014 [MOYEN, confiance high]** — *Division par zéro / NaN si tous les poids de thème sont nuls.* Voir détail dans [05-matchmaking-audit.md](05-matchmaking-audit.md) (le bug est dans `matcher.js`, pas `scorer.js`, mais documenté ici car directement lié à la chaîne de calcul du profil). **Confirmé par exécution directe à deux reprises indépendamment** (Subagent 2 par calcul direct, Subagent 4 par test automatisé — `proposed-tests/test3-nan-zero-weights-regression.mjs`, résultat `NaN` reproductible).

## 3. Vérifications passées avec succès (aucune anomalie)

- Aucune inversion de signe dans `scorer.js` lui-même (les 3 inversions trouvées sont dans `refinementThemes.js`, un fichier de données consommé séparément — voir [05-matchmaking-audit.md](05-matchmaking-audit.md)).
- Aucun risque de division par zéro dans `calculateProfile`/`calculateAxes` (combinaisons linéaires pures, pas de division).
- Déterminisme confirmé par test automatisé exécuté réellement (`proposed-tests/test1-determinism.mjs`, PASS) : mêmes réponses → même profil, à chaque appel.
- Indépendance à l'ordre confirmée par test automatisé exécuté réellement (`proposed-tests/test2-order-independence.mjs`, PASS) : 4 ordres d'insertion différents testés sur 48 réponses → profil `themes` strictement identique.
- Monotonie confirmée par test automatisé exécuté réellement (`proposed-tests/test4-monotonicity.mjs`, PASS) : 108 questions à `direction=1` balayées de 1 à 5, **0 violation** de monotonie détectée.
- Aucune dépendance à l'ordre d'itération des objets JS repérée (agrégation par `THEMES_ORDER`, tableau fixe).
- Les valeurs par défaut (thème non répondu → 50) ne créent pas de biais directionnel — c'est un choix de conception neutre assumé, mais son **absence de signalement à l'utilisateur** est documentée comme constat UX (voir F6, [01-project-map.md](01-project-map.md)).

## 4. Écart entre la méthodologie publiée et la méthodologie réelle

`src/pages/Transparency.jsx` — page publique dédiée à l'explication du système (« no black box ») — décrit une distance simple convertie en score, avec un exposant qui pénalise davantage le désaccord fort. C'est fidèle à `calculateAlignment()` **avant** l'étape de veto (voir [05-matchmaking-audit.md](05-matchmaking-audit.md)), mais :
- **`stretchScore()` n'est mentionné nulle part** — les scores par thème affichés à l'utilisateur (RadarChart, AxisBar) ne sont pas une simple moyenne pondérée de ses réponses, mais cette moyenne passée dans une transformation qui l'écarte du centre. Un utilisateur ne peut pas recalculer son propre score à la main à partir de la description publiée, contrairement à la promesse de transparence de la page.
- **Le veto multiplicatif est totalement absent de la description** (voir §2 de [05-matchmaking-audit.md](05-matchmaking-audit.md)) — la page affirme que seule une distance pondérée par un exposant détermine le score, alors qu'un second mécanisme peut réduire le score final de 18 à 38% supplémentaires sur 5 thèmes spécifiques.
- **« Si vous ignorez le classement des priorités, tous les sujets sont pondérés à parts égales »** (`Transparency.jsx`, section 1, étape 5) — **affirmation vérifiée fausse** par lecture directe de `src/store/useStore.js:65` : `priorityOrder: [...THEMES_ORDER]` initialise le classement de priorité par défaut à l'**ordre de déclaration des thèmes** (ECONOMY, SOCIAL, IMMIGRATION, SECURITY, ENVIRONMENT, DEMOCRACY, GLOBAL, PUBLIC_SERVICES), pas à une pondération égale. `calculateAlignment()` (`matcher.js:33-39`) traduit ce classement en poids 8→1 (rang 1 = poids 8, rang 8 = poids 1) dès lors qu'aucune allocation manuelle (`themeWeights`) n'est fournie. **Tout utilisateur qui ne réordonne pas manuellement l'écran de priorités (`PriorityRanking.jsx`) — probablement la majorité — obtient donc un score où ECONOMY pèse 8× plus que PUBLIC_SERVICES, sans le savoir et contrairement à ce que lui dit explicitement la page « Transparence ».**

**Constat POL-AUDIT-042 [ÉLEVÉ, confiance high]** — voir [08-bias-and-neutrality.md](08-bias-and-neutrality.md) et [10-prioritized-remediation-plan.md](10-prioritized-remediation-plan.md) pour la remédiation. C'est une inexactitude factuelle sur la page dont la fonction exclusive est d'être honnête sur le fonctionnement du système — sévérité élevée précisément à cause de ce contexte.

## 5. Synthèse

Le moteur `scorer.js` est mathématiquement sain (déterministe, sans division par zéro, sans inversion de signe, monotone — 3 propriétés vérifiées par test automatisé réel). Les problèmes identifiés sont : (a) un champ de données mort (`weight`) créant un risque de confusion éditoriale future, (b) une asymétrie de seuil non documentée dans le texte généré, sans impact sur le classement, et surtout (c) un écart significatif entre ce que la page de méthodologie publique promet (transparence, pondération égale par défaut) et ce que le code fait réellement (transformation non-linéaire non expliquée, pondération par défaut non égale). Ce dernier point est le plus important du point de vue de la promesse produit de neutralité/simplicité.
