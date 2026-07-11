# 02 — Contre-audit du moteur de scoring et du matchmaking

## Verdict d'ensemble
Le **moteur** (scorer.js + matcher.js) est sain : les corrections du lot 1/2 sont réelles et bien faites. En revanche, le premier audit et les remédiations ont **manqué le plus gros problème du produit : deux fichiers de données de référence étaient encodés dans une convention d'échelle incompatible avec le moteur**, rendant deux surfaces entières de l'app politiquement absurdes. Corrigé par ce contre-audit (commits `52ce639`, `19e4309`, garde-fou `d46ffb8`).

## 1. Découverte majeure — conventions d'échelle incohérentes (CRITIQUE, corrigé)

Convention canonique du moteur (scorer.js `calculateAxes`, CompareBar, ProfileShareModal, elections.js, archetypes.js, historicalFigures.js) : IMMIGRATION haut = restrictif ; SECURITY haut = sécuritaire ; GLOBAL haut = multilatéral/pro-UE.

**a) `frenchFigures.js` — IMMIGRATION et SECURITY inversés sur les 28 figures.**
Preuve mécanique : la même personne avait deux profils miroirs dans la même app — Bardella `IMMIGRATION: 5` en figure vs `96` en candidat fr_2027 (écart 91), Le Pen 5/95, Retailleau 15/82, Tondelier 90/15, Mélenchon 88/12. Effet mesuré sur le moteur réel (banc de 12 profils synthétiques) : un profil droite nationale obtenait comme « meilleure correspondance » sur la page /france **Carole Delga et Dupont-Aignan à 34 %**, Le Pen reléguée en bas de classement ; un écologiste obtenait Olivier Faure à 46 % au lieu de Tondelier. Le graphique de comparaison affichait Le Pen à 5/100 côté « Ouvert ». Après correction (100−x, mécanique, aucune position réestimée) : droite nationale → Le Pen 91 %/Bardella 91 %/Dupont-Aignan 84 % ; écologiste → Tondelier 87 %/Hidalgo 83 %/Jadot 83 %. Pire écart croisé résiduel figure/candidat : 26 pts (nuance légitime), contre 91 avant.

**b) `ideologicalCurrents.js` — GLOBAL inversé (convention v1 « haut = souverainiste ») sur 11 des 12 courants.**
Preuve interne : chaque valeur contredisait les `keyBeliefs` du même objet — social-démocratie GLOBAL 25 avec « Coopération internationale et multilatéralisme », libéralisme 22 avec « Institutions internationales », libéralisme classique 20 avec « Libre-échange et mondialisation économique », démocratie chrétienne 38 avec « Pro-intégration européenne », progressisme 18 avec « Solidarité internationale ». `questions.js` documente lui-même que la direction GLO est « inversée par rapport à v1 » — le fichier des courants était resté en v1. **Relecture du fix POL-AUDIT-010** : `GLOBAL: 85` pour le conservatisme national était *cohérent dans la convention d'origine du fichier* ; le passage à 18 allait dans le bon sens au niveau moteur mais le diagnostic (« une valeur aberrante ») était incomplet — après ce fix, le conservatisme national était le SEUL courant correct, et les 11 autres pénalisaient les utilisateurs pro-UE au profil pourtant conforme (un social-démocrate pro-UE matchait Social-démocratie à 79 % avec un veto GLOBAL absurde ; 96 % après correction). Corrigé par 100−x sur les 11 courants, national_conservatism préservé.

**c) Étiquettes de pôles UI également inversées à 2 endroits** (Profile.jsx, FrenchFigures.jsx) — la page profil affichait « IMMIGRATION : Très Ouverte » pour un score de 92 tout en disant dans son texte de synthèse « contrôle strict de l'immigration ». Corrigé (`4620eb0`), vérifié en navigateur.

**Pourquoi c'était invisible** : la vérification « 170/170 profils structurellement valides » du premier audit était structurelle, pas sémantique ; ses tests synthétiques ont apparemment tourné contre les archétypes (corrects) ; et sur la page /france, données ET étiquettes étant inversées ensemble, l'affichage individuel *semblait* cohérent — seuls le classement par alignement et la comparaison croisée trahissaient le bug. Le garde-fou `scripts/check-profile-conventions.mjs` (miroir figure↔candidat + 7 ancrages sémantiques) rend la récidive détectable mécaniquement.

## 2. Vérifications du moteur lui-même (tout est conforme)

- **STATUS_WEIGHTS réels** : CORE=10/PRIMARY=5/SECONDARY=2 injectés par `processQuestion` ; `q.weight ?? 1` du scorer lit le poids traité. Le commentaire du scorer (« core=5, refinement=3/2 ») est périmé — cosmétique.
- **NaN / poids nuls** : garde `totalWeight > 0` (fallback 0.5) — test 3 PASS.
- **Double arrondi** : un seul `Math.round` après veto ✓ (POL-AUDIT-019 réellement corrigé).
- **Veto** : 6 thèmes, seuils/pénalités conformes aux valeurs documentées ; rampe linéaire sans falaise. DEMOCRACY et ENVIRONMENT restent non vetoïsés — noté comme choix assumé ; conséquence observée : un désaccord identitaire écolo (ENV 95 vs 25) n'écrase jamais un score, alors qu'un désaccord Europe le fait. Asymétrie défendable mais à documenter.
- **Double comptage veto/distance** : réel par construction (la distance IMMIGRATION compte dans la moyenne pondérée ET déclenche le veto). C'est le design voulu (« dealbreaker ») ; le banc synthétique ne montre pas d'effet pervers : les cumuls multiples ne frappent que les profils réellement contradictoires (profil contradictoire → max 36 %, correct).
- **Bornes** : clamp [0,100] ✓. **Profils incomplets** : défaut 50 par thème → attracteur centriste connu et assumé (profil 3 thèmes → Roussel 71 %, plausible).
- **DIRECTION_MAP** : aucune question active orpheline (contrôle programmatique, 166/166 couvertes) ; directions des 4 nouvelles questions vérifiées une à une.
- **Tests de régression** : 4/4 PASS re-exécutés (monotonie 109 questions direction=1, cohérent avec +DEM_26+SOC_27).

## 3. Banc synthétique (moteur réel, 12 profils × 3 cibles) — après corrections

| Profil | Candidats 2027 (top1, marge) | Courants (top1) | Figures FR (top1) | Verdict |
|---|---|---|---|---|
| Social-démocrate pro-UE | Glucksmann 88 % (+15) | Social-démocratie 96 % | Delga 91 % | ✓ |
| Gauche souverainiste | Roussel 77 % (+17) | Social-démocratie 72 % | Roussel 72 % | ✓ (courant discutable mais défendable : pas de courant « gauche souverainiste » dédié) |
| Écologiste radical | Tondelier 89 % (+4) | Politique verte 87 % (+1 sur soc.dém.) | Tondelier 87 % | ✓ |
| Libéral progressiste | Attal 75 % (+5) | Libéralisme 81 % | Macron/Attal 74 % | ✓ |
| Conservateur libéral | Retailleau 85 % (+25) | Conservatisme 85 % | Le Maire 61 % | ✓ |
| Droite nationale | Le Pen 93 % (+1 Bardella) | Conservatisme national 91 % | Le Pen 91 % | ✓ |
| Gaulliste social | Philippe 64 % (+2) | Démocratie chrétienne 80 % | Bayrou 63 % | Défendable — trou « souverainisme modéré » connu, non corrigé (décision produit) |
| Libertarien | Attal 57 % (+1) | Libertarianisme 89 % | Attal 70 % | ✓ (aucun candidat 2027 libertarien — 57 % honnête) |
| Centriste | Attal 83 % (+1) | Centrisme 92 % | Bayrou 90 % | ✓ |
| Contradictoire | max 31 % | max 32 % | max 36 % | ✓ (pas de faux match fort) |
| Quasi-centre peu informé | Attal 76 % (+2) | Centrisme 87 % | Borne 83 % | ✓ mais illustre l'attracteur central |
| Incomplet (3 thèmes) | Roussel 71 % (+13) | Centrisme 68 % | Bayrou 66 % | Acceptable |

Marges top1–top2 ≤2 pts dans 6 cas sur 12 → l'indicateur de résultat serré (`f5212a7`) était une bonne décision, confirmée.

## 4. Points restants (non corrigés, à arbitrer)

- **Cliff 49/51 %** : toujours présent — `alignmentColorClass` (70/50/30) et `alignmentLabel` (70/50/35/20) basculent ensemble à 50 (ambre+« modérée » → bleu+« Forte compatibilité » pour 2 pts). Et les deux échelles divergent entre 30 et 35. POL-AUDIT-037 non traité.
- **Attracteur central** : non retraité (décision différée documentée, légitime).
- **Transparence** : la page décrit désormais correctement la pondération par défaut et évoque « le désaccord fort est pénalisé davantage », mais n'explique ni le veto multiplicatif par thème, ni STATUS_WEIGHTS (CORE ×5 vs SECONDARY), ni `stretchScore(0.75)` — tout en affirmant « pas de pondération cachée ». Incohérence d'affichage à résoudre par ajout d'un paragraphe ou par requalification explicite (« description simplifiée »).

## Verdict scoring/matching
- Moteur : **conserver** tel quel.
- Veto GLOBAL : **conserver** (corrige des cas absurdes réels, aucun effet pervers observé sur le banc post-correction ; la calibration fine attendra des données réelles).
- Données de référence : corrigées ; **faire tourner `check-profile-conventions.mjs` à chaque modification de profils**.
