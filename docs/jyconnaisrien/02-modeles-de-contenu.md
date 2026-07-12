# 02 — Modèles de contenu

Chaque type de page a un modèle **obligatoire** : mêmes sections, même ordre, pour que
l'utilisateur retrouve ses repères d'une fiche à l'autre. Tous les modèles héritent du socle commun.

## 1. Socle commun (tous les types)

```
┌─ En-tête ─────────────────────────────────────────────┐
│ Icône · Titre · badge difficulté · date de mise à jour │
├─ N1 « En 20 secondes » (40-80 mots)                    │
│   [Comprendre un peu mieux →]                          │
├─ N2 « En 3 minutes »                                   │
│   [Tout comprendre sur ce sujet →]                     │
├─ N3 « Tout comprendre » (sections repliables)          │
├─ N4 « Pour aller encore plus loin » (si structurant)   │
├─ Idées reçues (items vrai/faux liés)                   │
├─ Les mots associés (dictionnaire)                      │
├─ Testez-vous (3-5 questions)                           │
├─ Continuer avec (2-3 pages liées)                      │
└─ Sources ─────────────────────────────────────────────┘
```

Le socle s'applique selon la **famille éditoriale** de la page (fichier 00, §2) : contenu court
(N1+N2), intermédiaire (N1-N3), dossier structurant (N1-N4). Les sections « Idées reçues » /
« Testez-vous » sont optionnelles sur les contenus courts. Chaque page porte aussi son régime
`freshness` (fichier 00, §7).

Briques UI disponibles dans les sections N2/N3 : encadré « À retenir » · bloc « Attention à la
confusion » (ex. déficit ≠ dette) · tableau comparatif · frise · schéma · citation sourcée ·
chiffre daté (source + année + périmètre + limite). Barre de progression de lecture sur N3.

## 2. Modèle « fiche générique » (`fiche-base`, `institution`)

- **N1** : réponse directe à la question du titre.
- **N2** : idée générale · comment ça marche concrètement · 1-2 exemples récents · ce qui fait débat.
- **N3** (accordéons) : histoire/origine · fonctionnement détaillé · cas particuliers ·
  controverses · équivalents à l'étranger.
- Pour les institutions : ajout obligatoire d'un **schéma simple** (qui nomme qui, qui contrôle
  qui) nuancé en N3, et d'une section « ce que cette institution ne peut PAS faire » (antidote
  aux idées reçues).

## 3. Modèle « idéologie / famille politique » (`ideologie`)

- **N1** : définition + rappel immédiat « il existe plusieurs X » (jamais présenter une famille
  comme homogène).
- **N2** : idée générale · valeurs principales · sensibilités internes · origine historique ·
  arguments des défenseurs · principales critiques · figures connues · exemples concrets.
- **N3** (accordéons) — grille en 9 « visions » + compléments :
  1. vision de l'être humain ; 2. de la société ; 3. de l'État ; 4. de l'économie ;
  5. de l'égalité ; 6. de la liberté ; 7. de l'autorité ; 8. de la nation ; 9. de l'Europe ;
  - positions immigration et écologie ;
  - courants internes ; histoire et évolutions ; figures ; partis qui s'en réclament ;
    critiques ; débats internes ; équivalents étrangers ; chronologie ; idées reçues.
- **N4** : textes fondateurs, discours, extraits de programmes, bibliographie.
- Champ `courantMoteur` : lien optionnel vers un courant d'`ideologicalCurrents.js`.

**Variante « dossier-pivot »** (gauche, droite, centre, extrême gauche, extrême droite) : ajoute
- la carte des familles internes (ex. pour la gauche : révolutionnaire, communiste, socialiste,
  social-démocratie, réformiste, social-libéralisme, écologiste, radicale, libertaire,
  républicaine, souverainiste ; pour la droite : libérale, conservatrice, gaulliste, sociale,
  nationale, souverainiste, chrétienne-démocrate, républicaine, autoritaire, identitaire,
  européenne, libertarienne) — chaque famille cliquable ;
- la batterie de questions du brief (§5-6) en accordéons N3 (« d'où viennent les mots gauche et
  droite ? », « peut-on être riche et de gauche ? », « quelle différence entre droite nationale et
  extrême droite ? »…) ;
- la galerie de figures (liens porte D), présentées **sans les mettre sur le même plan** et sans
  ranger toutes les figures dans une famille homogène — chaque carte de figure indique sa nuance
  (ex. Simone Veil : son positionnement réel, centre-droit libéral, figure transpartisane).

## 4. Modèle « parti » (`parti`)

- **N1** : ce que c'est, positionnement en une phrase prudente (« généralement classé… »).
- **N2** : nom complet · création · fondateur/origine · positionnement · grandes idées ·
  électorat · personnalités actuelles · dernier résultat électoral marquant.
- **N3** : histoire et évolutions idéologiques · résultats électoraux importants · alliances ·
  divisions internes · sujets sur lesquels le parti est souvent mal compris · principales
  critiques · **discours vs action au pouvoir** (section obligatoire quand le parti a gouverné).
- **Les partis changent dans le temps** — champ obligatoire pour tout parti ayant plus d'une
  époque idéologique, pour ne pas figer le parti dans sa position actuelle :
  ```
  periodesIdeologiques: [ { periode, direction, positionnement, changementsMajeurs, contexte } ]
  ```
  Ex. PS : 1981 / tournant de la rigueur / Jospin / contemporain. Idem FN→RN, RPR→UMP→LR,
  En Marche→Renaissance, Verts→EELV→Les Écologistes. Rendu en N3 sous forme de mini-frise.
- Champs spécifiques : `estCoalition`, `predecesseurs[]` (généalogie : UMP→LR, FN→RN…),
  `famillesLiees[]` (liens porte B).
- Règle : jamais résumer un parti uniquement à travers son propre discours ni uniquement à
  travers ses opposants.

## 5. Modèle « président » (`president`) — 15 sections obligatoires

1. **Son portrait en 30 secondes** (= N1) : orientation, dates du mandat, contexte d'élection,
   idée-résumé de la présidence.
2. **Pourquoi a-t-il été élu ?** contexte économique et social, adversaires, promesses, attentes.
3. **Les grandes lignes de son programme** : économie, emploi, fiscalité, protection sociale,
   immigration, sécurité, institutions, Europe, étranger, société, écologie.
4. **Les principales mesures** — pour chacune : décision · pourquoi · arguments favorables ·
   critiques · résultats connus · ce qui existe encore aujourd'hui.
5. **Les grands événements du mandat** : crises, conflits, alternances, cohabitations,
   mouvements sociaux, attentats, réformes, international.
6. **Sa manière de gouverner** : rapport au PM, au Parlement, aux médias, à l'opinion ;
   style ; centralisation/délégation.
7. **Bilan économique et social** — toujours distinguer : évolution constatée · causes
   nationales · contexte international · décisions attribuables au gouvernement · débats
   entre économistes.
8. **Ce que ses défenseurs retiennent.**
9. **Ce que ses opposants retiennent.**
10. **Son héritage aujourd'hui.**
11. **Idées reçues : vrai ou faux ?** (items sourcés de la banque — ex. « Mitterrand a
    intégralement appliqué un programme socialiste pendant quatorze ans », « Sarkozy a supprimé
    la retraite à 60 ans », « Macron a créé le 49.3 »…)
12. **Sa présidence en une phrase** (pédagogique, équilibrée, mémorable).
13. **Sa présidence en cinq dates.**
14. **Sa présidence en cinq mesures.**
15. **Pour aller plus loin** (= N4) : discours, archives, résultats électoraux, documents
    officiels, bibliographie, articles de référence.

Mapping niveaux : N1 = section 1 · N2 = sections 2, 12, 13, 14 (le « portrait 3 minutes ») ·
N3 = sections 3-11 en accordéons · N4 = section 15.

## 6. Modèle « Premier ministre » (`premier-ministre`)

N1 (qui, quand, sous quel président, idée-résumé) puis : contexte de nomination · relation avec
le président · principales réformes · majorité parlementaire · crises rencontrées · bilan ·
raisons du départ. Plus court que le modèle président ; mêmes règles de bilan (section 7 ci-dessus).

## 7. Modèle « figure » (`figure`)

N1 (qui elle était, en quoi elle compte) puis : ses idées principales · son contexte historique ·
son influence · les critiques · ce qui est encore actuel dans sa pensée · œuvres/discours clés (N4).
Pour les figures contemporaines : positionnement précis et daté, différences avec les figures
voisines (jamais de rangement automatique dans un camp homogène).

## 8. Modèle « institution » — voir §2 (variante de la fiche générique avec schéma obligatoire).

## 9. Modèle « grand débat » (`debat`) — 16 sections obligatoires

1. Le sujet en une phrase (= N1).
2. Pourquoi en parle-t-on ?
3. Les mots indispensables (liens dictionnaire).
4. Les faits principaux.
5. Les chiffres disponibles — chaque chiffre : source · année · périmètre · limite méthodologique.
6. Les grandes positions dans le débat — **grille variable selon le sujet, pas de colonnes
   imposées**. Règle : présenter les positions réellement pertinentes pour CE débat, puis
   expliquer quelles familles et quels partis s'en rapprochent. La grille en 7 familles
   (gauche radicale · gauche réformiste · écologistes · centre · droite libérale · droite
   conservatrice · droite nationale) est le **défaut** quand les fractures suivent les camps
   (fiscalité, immigration…), mais sur le nucléaire, la laïcité, l'Europe, la fin de vie ou
   l'Ukraine les fractures traversent les camps — on définit alors les positions propres au
   sujet (ex. nucléaire : antinucléaires · écologistes pragmatiques · partisans d'un mix ·
   pronucléaires · souverainistes énergétiques) et on y rattache familles et partis.
   Toujours préciser que les partis d'une même famille divergent.
7. Les arguments favorables.
8. Les arguments défavorables.
9. Les principaux désaccords.
10. Ce que dit la recherche.
11. Ce que l'on ne sait pas encore.
12. Ce qui existe dans d'autres pays.
13. Les idées reçues (banque vrai/faux).
14. Les mesures déjà prises en France (avec leur stade : annonce → … → en vigueur).
15. Les propositions actuellement débattues.
16. Questions pour se faire sa propre opinion.

Mapping : N1 = 1 · N2 = 2-4 (+ résumé de 6) · N3 = 5-15 en accordéons · « Testez-vous » = 16 + 13.

## 10. Modèle « définition » (`definition`)

- **Niveau 1** : définition en une phrase.
- **Niveau 2** : explication simple (1 paragraphe) + exemple concret + si utile « attention à la
  confusion » et « ce qui fait débat » (structure du glossaire actuel : simple / concrètement /
  exemple / débat — conservée).
- **Niveau 3** : fiche complète *ou* lien `parentFiche` vers la grande fiche qui traite le sujet
  (ex. la définition « OQTF » pointe vers le débat OQTF).
- Champs : catégorie, `related[]`, `aliases[]` (pour la recherche naturelle).

### Cas d'école : la fiche OQTF (référence de rigueur pour tout sujet sensible)

- N1 : « Une OQTF est une décision administrative demandant à une personne étrangère de quitter
  le territoire français. »
- N2 : acronyme · qui peut en recevoir une · qui décide · OQTF ≠ expulsion · délai de départ
  volontaire · recours · pourquoi toutes ne sont pas exécutées.
- N3 : distinguer précisément les situations (demandeur d'asile en cours ≠ débouté ≠ sans titre ≠
  titre non renouvelé ≠ personne protégée ≠ mineur ≠ parent d'enfant français ≠ ressortissant
  européen ≠ personne en rétention ≠ assignée à résidence). Interdits éditoriaux : « tous les
  demandeurs d'asile sont sous OQTF », « une personne sous OQTF est forcément un délinquant ».
  Droit exact **daté**, distinction droit théorique / exécution concrète.
- Section « Pourquoi fait-on débat sur les OQTF ? » : fermeté migratoire · droits fondamentaux ·
  difficultés diplomatiques et administratives · laissez-passer consulaires · recours ·
  places en rétention · écart prononcées/exécutées.
- Idées reçues dédiées (7 items du brief §13), chacune contextualisée et sourcée.

## 10bis. Modèle « méthode » (`fiche-methode`, porte I « Comment le sait-on ? »)

- **N1** : la règle en une phrase (ex. « un sondage estime une opinion à un instant donné, avec
  une marge d'erreur — ce n'est jamais une prédiction »).
- **N2** : comment ça marche · le piège classique · un exemple réel récent · le réflexe à adopter
  (encadré « À retenir »).
- **N3** (si intermédiaire) : les cas limites, les débats de méthode, où trouver les données brutes.
- Ces fiches sont référencées par les briques « chiffre » des autres fiches
  (champ `methode: 'lire-un-sondage'`).

## 11. Modèle « vrai ou faux » (`vraifaux`)

```
{ enonce, verdict: 'vrai'|'faux'|'partiel'|'trompeur'|'sans-contexte',
  explication (argumentée, sourcée), sources[], related[], categorie }
```
Ne jamais forcer une réponse binaire. L'explication précise *en quoi* c'est partiel ou trompeur.

## 12. Modèles « comparateur » et « chronologie »

**Comparateur** (`comparateur`) : `entities: ['a','b'(, 'c', 'd')]` — **2 entités par défaut,
jusqu'à 4** quand le sujet l'exige · points communs · différences (par dimensions : économie,
société, institutions, Europe…) · contexte · nuances · idées reçues sur la comparaison.
Comparaisons éditorialisées de départ : socialisme/social-démocratie · droite libérale/droite
conservatrice · gaullisme/souverainisme · communisme/socialisme · progressisme/conservatisme ·
régime parlementaire/présidentiel · Mitterrand/Macron · Ve/IVe République (+ programmes de deux
candidats via les données élections existantes). À 3-4 entités : immigré/étranger/demandeur
d'asile/réfugié · président/PM/député/sénateur · communisme/socialisme/social-démocratie/
social-libéralisme.

**Chronologie** (`chronologie`) : liste ordonnée d'événements `{ date, titre, resume (N1),
detail (N2), lien }` rendue en frise interactive ; chaque événement s'ouvre en place.

## 13. Modèle « parcours » (`parcours`) — voir fichier 03.
