# 03 — Parcours pédagogiques et personnalisation

## 1. Principe

Un parcours est une **séquence ordonnée de pages existantes** (aucun contenu propre, sauf une
intro d'étape d'une phrase). Progression persistée dans le store (`learnProgress`), reprise
possible, barre de progression, badge de fin. Chaque étape recommande de lire au moins le N2.

Modèle de données :
```
{ slug, titre, description, difficulty, etapes: [{ pageRef, introEtape }] }
```

## 2. Les 6 parcours du lancement

### P1 — « Je pars de zéro » (difficulté 1)
1. Qu'est-ce que la politique ? → `bases/a-quoi-sert-la-politique`
2. La gauche et la droite → `bases/gauche-ou-droite` puis dossiers `familles/gauche`, `familles/droite` (N1-N2)
3. Les institutions → `institutions/qui-decide-vraiment-en-france` + schéma
4. Comment vote-t-on ? → `bases/pourquoi-vote-t-on` + définitions scrutins
5. Les principaux partis → porte C (6-8 fiches, N1)
6. Les grands débats → 3 débats au choix selon centres d'intérêt
7. Comment vérifier une information politique ? → porte I « Comment le sait-on ? »
   (fait/opinion/prédiction, sources, lire un sondage) — ouvre sur le parcours P6

### P2 — « Comprendre les élections » (difficulté 1)
Les différents scrutins → les partis → les candidats → les programmes → les sondages (et leurs
limites : jamais une prédiction) → le premier tour → le second tour → les coalitions → le vote
utile → l'abstention.

### P3 — « Comprendre l'économie politique » (difficulté 2)
PIB → inflation → impôts → dette → déficit → chômage → protection sociale → retraites →
entreprises → commerce international.

### P4 — « Comprendre l'immigration » (difficulté 2)
Étranger, immigré et réfugié (distinctions) → visa et titre de séjour → demande d'asile →
immigration régulière et irrégulière → intégration et naturalisation → OQTF et éloignement →
données migratoires (sources, limites) → le débat politique (fiche débat F3).

### P5 — « Comprendre l'Union européenne » (difficulté 2)
Pourquoi l'UE existe → les institutions → comment les décisions sont prises → l'euro → Schengen →
le droit européen → les critiques de l'Union → les différentes visions de l'Europe.

### P6 — « Comment le sait-on ? » (difficulté 1-2, porte I)
Fait, opinion, prédiction → source primaire et secondaire → lire une statistique
(moyenne/médiane, corrélation/causalité) → comment sont calculés le chômage et l'inflation →
lire un sondage → reconnaître un graphique trompeur → vérifier une citation → une loi est-elle
vraiment en vigueur ? → comment les médias choisissent un angle → conflits d'intérêts.

## 3. Personnalisation post-quiz

Après le quiz Poliscop, la page profil suggère des contenus « J'y connais rien » en fonction :
des thèmes répondus, des hésitations (temps de réponse / réponses neutres si disponibles), des
tensions apparentes entre réponses, du niveau estimé, des centres d'intérêt (priorités classées).

Formulations types (jamais prescriptives — la recommandation ne dit **jamais** quoi penser) :
- « Vous êtes favorable à une forte protection sociale, mais aussi à une réduction importante des
  impôts. Découvrez comment les différents courants cherchent à concilier ces deux objectifs. »
- « Vous semblez attaché à la souveraineté nationale tout en étant favorable à l'intégration
  européenne. Découvrez les différentes visions d'une Europe des nations. »

Implémentation minimale v1 : mapping thème quiz → 2-3 pages recommandées + règle « écart de
réponses au sein d'un même thème → fiche débat correspondante ». Le raffinement (contradictions
inter-thèmes) vient ensuite. ⚠️ Toute personnalisation s'appuie sur des données d'opinion :
elle reste 100 % locale (store) — aucun événement analytics sans le consentement politique déjà
en place (`trackIfConsented`).

## 4. Rattachement aux courants du profil

Chaque courant d'`ideologicalCurrents.js` référence sa fiche `familles/…`. Sur la page profil,
les courants primaires/secondaires deviennent cliquables → « comprendre ce courant » (N1 en
modal, lien fiche). C'est le pont principal entre le produit quiz et la base de connaissances.
