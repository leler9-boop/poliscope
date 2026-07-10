# Couverture thématique et idéologique

**Méthode** : les 162 questions actives ont été classées par thème et comparées à la liste des sous-dimensions attendues du paysage politique français listée dans la mission d'audit. Les poids indiqués sont les **poids effectifs réellement appliqués par le moteur** (`STATUS_WEIGHTS` : CORE=10, PRIMARY=5, SECONDARY=2), et non le champ `weight` brut du JSON, qui n'a plus d'effet réel (voir [02-question-audit.md](02-question-audit.md) §7 et [04-scoring-methodology.md](04-scoring-methodology.md)).

## Tableau par thème (8 THEMES du code)

| Thème | Nb questions | CORE / PRIMARY / SECONDARY | Poids effectif total | Déséquilibre / manques |
|---|---|---|---|---|
| ECONOMY | 24 | 7 / 1 / 16 | 107 | Thème le mieux doté. Droit du travail (flexibilité, code du travail au-delà du SMIC/syndicats) sous-représenté. |
| SOCIAL | 19 | 5 / 0 / 14 | 78 | **Égalité femmes-hommes absente en tant que sujet autonome** — présente comme item CORE dans le brouillon (`knowledge-base/questions.md`), disparue du corpus final sans trace documentée. |
| IMMIGRATION | 19 | 3 / 0 / 16 | 62 | Couverture dense et diversifiée (volume, asile, intégration, droit du sol). |
| SECURITY | 19 | 4 / 0 / 15 | 70 | **Contrôle/accountability de la police absent au-delà de la vidéosurveillance** — également présent dans le brouillon, disparu du corpus final. |
| ENVIRONMENT | 18 | 1 / 0 / 17 | 44 | **Le moins bien doté avec PUBLIC_SERVICES : un seul CORE.** Agriculture couverte a minima (2 items). |
| DEMOCRACY | 21 | 2 / 0 / 19 | 58 | **Décentralisation totalement absente** (aucune question sur les compétences des collectivités territoriales, régions, communes). |
| GLOBAL | 22 | 3 / 0 / 19 | 68 | Thème le plus dense (22 questions) mais aussi le plus redondant en interne (voir doublons intra-thème ci-dessous). |
| PUBLIC_SERVICES | 20 | 1 / 0 / 19 | 48 | Un seul CORE, comme ENVIRONMENT. Logement/éducation/santé bien couverts par ailleurs. |

**Total : 162 questions, poids effectif cumulé 535.**

## Sous-thèmes de la liste attendue — absents ou très sous-représentés

| Sous-thème attendu | Statut | Détail |
|---|---|---|
| Décentralisation | **Absent à 100%** | Aucune des 162 questions actives ne porte sur les compétences des collectivités territoriales. |
| Intelligence artificielle | **Absent** | Les items adjacents (`SEC_4` reconnaissance faciale, `SEC_12` chiffrement, `SEC_10` fake news, `SOC_15` responsabilité des réseaux sociaux) couvrent surveillance et plateformes, mais aucune question ne porte sur la régulation de l'IA ou la décision algorithmique — sujet politique structurant 2024-2026 (AI Act européen) absent. |
| Données personnelles (entreprises) | **Quasi absent** | `SEC_1`/`SEC_16` couvrent la surveillance étatique ; rien sur la collecte de données par les plateformes/entreprises privées. |
| Égalité femmes-hommes | **Disparu du corpus final** | Présent comme item CORE dans `knowledge-base/questions.md`, absent de `questions_final.json` — seule la discrimination liée à l'origine (`SOC_26`) subsiste comme proxy partiel. |
| Accountability policière | **Disparu du corpus final** | Idem — présent dans le brouillon, absent du corpus final. |
| Agriculture | Sous-représenté | 2 questions seulement dans ENVIRONMENT (18 items). |
| Droit du travail (hors salaire) | Sous-représenté | SMIC, syndicats, semaine de 4 jours couverts ; flexibilité/licenciement/code du travail peu présents. |

Ces deux disparitions (égalité F/H, accountability policière) entre le brouillon éditorial et le corpus final en production sont exactement le type de divergence non documentée que la mission demande de signaler explicitement — rien dans le code ou la documentation n'explique pourquoi ces items CORE du brouillon ont été retirés.

## Impact concret du déséquilibre CORE sur le mode Découverte (16 questions)

`getQuestionQueue()` sert les questions CORE en priorité, plafonnées par mode (`discovery`=2/thème, `standard`=4/thème, `deep`=8/thème). Pour **ENVIRONMENT** et **PUBLIC_SERVICES** (1 seul CORE chacun), le mode Découverte — probablement le plus utilisé, le plus court — ne peut fournir qu'1 question CORE + 1 question SECONDARY **tirée au hasard** (`shuffle()`, `questions.js`) pour compléter le quota de 2. Les 6 autres thèmes disposent d'un « banc » de 2 à 7 CORE et affichent donc un signal éditorial pleinement maîtrisé dès le mode le plus court. **Conséquence concrète** : le score ENVIRONMENT ou PUBLIC_SERVICES d'un utilisateur du mode Découverte dépend pour moitié d'un item choisi aléatoirement parmi 17-19 candidats de moindre priorité éditoriale, contrairement aux 6 autres thèmes — un facteur de bruit non signalé à l'utilisateur.

## Sur-représentation détectée (au-delà des doublons `isDuplicate`)

Le champ `cluster` est peu discriminant : 85-90% des questions de chaque thème partagent le même tag générique (ex. IMMIGRATION : 16/19 questions au tag `imm`), donc inutilisable seul pour détecter la sur-représentation. Une lecture manuelle a identifié des paires quasi-redondantes **intra-thème**, en plus des 3 paires **inter-thèmes** déjà signalées dans [02-question-audit.md](02-question-audit.md) :

| Paire | Sujet |
|---|---|
| `GLO_1` ↔ `GLO_5` | Intérêt national vs traités internationaux (GLO_5 = version renforcée) |
| `GLO_9` ↔ `GLO_22` | Protection de la culture française face à l'influence étrangère |
| `PUB_5` ↔ `PUB_23` | Gratuité de l'université (PUB_23 = version renforcée) |
| `DEM_3` ↔ `DEM_24` | Référendum d'initiative citoyenne |
| `GLO_7` ↔ `GLO_20` | Sanctions internationales |

Ces paires intra-thème sont moins graves que les 3 paires inter-thèmes (elles amplifient un poids à l'intérieur d'un même thème plutôt que de créer une fausse corrélation entre deux thèmes distincts), mais contribuent à la densité inhabituelle du thème GLOBAL (22 questions, la plus élevée des 8).

## Verdict de couverture

Le paysage politique français est couvert de façon globalement solide sur les dimensions classiques (économie, immigration, sécurité, Europe, société), avec un vrai souci de diversité des positions au sein de chaque thème (confirmé par l'audit éditorial). Les angles morts sont concentrés sur des dimensions **récentes ou institutionnelles** plutôt que sur les clivages traditionnels gauche-droite : décentralisation, régulation de l'IA/numérique, et deux dimensions qui existaient dans le brouillon éditorial mais ont disparu sans explication (égalité F/H, accountability policière). Aucun signe de sur-pondération délibérée d'un camp — les déséquilibres trouvés sont structurels (CORE inégalement distribués) plutôt qu'idéologiques.
