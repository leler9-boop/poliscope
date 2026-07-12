# 01 — Arborescence complète

## 1. Vue d'ensemble

La page d'entrée `/learn` est un **hub éditorialisé** (§1bis) donnant accès à 9 portes d'entrée +
3 outils transverses. Chaque porte correspond à une catégorie de contenu avec son type de fiche
(fichier 02) et son préfixe d'URL. Tous les contenus partagent le système de niveaux N1→N4 et les
trois familles éditoriales (fichier 00, §2). Deux marques (fichier 00, §1) : **« J'y connais rien »**
(le hub débutant, `/learn`) et **« Poliscop Academy »** (la section avancée, `/learn/academy`).

```
J'y connais rien (/learn) · Poliscop Academy (/learn/academy)
│
├── A. Les bases de la politique            /learn/bases/:slug         (type: fiche-base)
├── B. Les familles politiques              /learn/familles/:slug      (type: ideologie)
├── C. Les partis politiques                /learn/partis/:slug        (type: parti)
├── D. Les personnalités                    /learn/figures/:slug       (type: figure)
│     ├── Présidents de la Ve République    /learn/presidents/:slug    (type: president)
│     └── Premiers ministres                /learn/premiers-ministres/:slug (type: premier-ministre)
├── E. Comment fonctionne vraiment la France /learn/institutions/:slug (type: institution)
├── F. Les débats qui structurent la France /learn/debats/:slug        (type: debat)
├── G. Le dictionnaire politique            /learn/dico[/:slug]        (type: definition)
├── H. Vrai ou faux ?                       /learn/vrai-ou-faux[/:categorie] (type: vraifaux)
├── I. Comment le sait-on ?                 /learn/methodes/:slug      (type: fiche-methode)
│
├── Outil 1. Parcours guidés                /learn/parcours/:slug      (type: parcours)
├── Outil 2. Comparateur                    /learn/comparer/:slug      (type: comparateur, 2-4 entités)
└── Outil 3. Chronologies                   /learn/chronologies/:slug  (type: chronologie)
```

## 1bis. La page d'accueil `/learn` (hub éditorialisé)

La page d'accueil est un **livrable en soi** — le **prototype initial**, en position #0 de la
liste des priorités (fichier 04) : elle doit éviter
l'effet « annuaire de 500 fiches ». Hiérarchie retenue, de haut en bas :

1. **Comprendre rapidement** — grande barre de recherche :
   *« Une question politique ? Écrivez-la simplement. »* (§13)
2. **J'y connais rien — Commencer de zéro** — le parcours principal en 7 étapes (P1),
   avec reprise de progression si entamé.
3. **Comprendre les grands repères** — 6 cartes : la gauche · la droite · le centre ·
   les institutions · les élections · les partis.
4. **Comprendre l'actualité** — 3-4 grandes fiches mises en avant, **datées**
   (sélection éditoriale, champ `misEnAvant` du manifeste).
5. **J'entends ce mot partout** — mots du moment : OQTF · 49.3 · dette publique ·
   proportionnelle · motion de censure (liste éditorialisée, renouvelée).
6. **Vrai ou faux ?** — une carte interactive (un item aléatoire, réponse en place, lien banque).
7. **Explorer autrement** — chronologies · comparateurs · personnalités · dictionnaire.

Les portes A-I complètes restent accessibles via « Explorer autrement » et la navigation ;
le hub n'expose jamais de listes exhaustives.

---

## 2. Porte A — Les bases de la politique

Sous-catégories et pages (13 fiches fondamentales, type `fiche-base`) :

**A1. La politique et l'État**
- À quoi sert la politique ?
- Qu'est-ce qu'un État ?
- Quelle différence entre l'État, le gouvernement et l'administration ?
- Qu'est-ce qu'une loi ?
- Qu'est-ce que la Constitution ?

**A2. La démocratie et le vote**
- Qu'est-ce qu'une démocratie ?
- À quoi sert un gouvernement ?
- Pourquoi vote-t-on ?
- Qu'est-ce que l'abstention ?

**A3. Les idées et les camps**
- Qu'est-ce qu'un parti politique ?
- Qu'est-ce qu'une idéologie ?
- Qu'est-ce qu'être de gauche ou de droite ?
- Comment se forme une opinion politique ?

---

## 3. Porte B — Les familles politiques

**B0. Les 5 grands repères** (dossiers approfondis, N4 inclus) :
gauche · droite · centre · extrême gauche · extrême droite.

Les dossiers « gauche » et « droite » sont les deux dossiers spéciaux du brief (§5-6) : ils
comportent en plus la cartographie de leurs familles internes, la liste de questions traitées
(en accordéons N3) et la galerie de figures (liens vers la porte D). Contenu obligatoire des deux
dossiers spéciaux — voir modèle `ideologie` variante « dossier-pivot » (fichier 02, §3).

**B1. Familles de la gauche** : socialisme · social-démocratie · communisme · marxisme ·
anarchisme · écologie politique · féminisme politique · progressisme.

**B2. Familles du centre et du libéralisme** : libéralisme · social-libéralisme ·
radicalisme · démocratie chrétienne / christianisme démocrate · technocratisme.

**B3. Familles de la droite** : conservatisme · gaullisme · souverainisme · nationalisme ·
bonapartisme · libertarianisme.

**B4. Familles transversales ou historiques** : populisme · républicanisme · fascisme ·
fédéralisme européen · euroscepticisme.

Chaque fiche suit le modèle `ideologie` (fichier 02, §3) : définition, vision de l'être humain /
de la société / de l'État / de l'économie / de l'égalité / de la liberté / de l'autorité /
de la nation / de l'Europe, positions immigration & écologie, courants internes, histoire, figures,
partis qui s'en réclament, critiques, évolutions. Chaque fiche est reliée aux 12 courants du moteur
(`ideologicalCurrents.js`) quand une correspondance existe — le profil quiz peut alors pointer vers
« comprendre ce courant ».

---

## 4. Porte C — Les partis politiques

**C1. Fiches partis** (type `parti`, modèle fichier 02 §4) :
Renaissance · Les Républicains · Rassemblement national · La France insoumise · Parti socialiste ·
Les Écologistes · Parti communiste français · MoDem · Horizons · UDI · Debout la France ·
Reconquête · Place publique · Parti radical · NPA · Lutte ouvrière · Génération.s · UPR ·
principaux partis régionalistes · principales coalitions récentes (NUPES/NFP, Ensemble, etc. —
une fiche « coalition » utilise le même modèle avec un champ `estCoalition`).

**C2. La mécanique des partis** (fiches transverses, type `fiche-base`) :
pourquoi les partis changent de nom · coalition · groupe parlementaire · investiture · primaire ·
ligne de parti · discipline de vote · parti de gouvernement · parti protestataire ·
front républicain · désistement électoral.
(Les plus courtes de ces notions vivent au dictionnaire, la porte C2 liste et relie.)

---

## 5. Porte D — Les personnalités

**D1. Présidents de la Ve République** (`/learn/presidents`) : page principale avec frise
chronologique 1958→aujourd'hui + une fiche par président (de Gaulle, Pompidou, Giscard, Mitterrand,
Chirac, Sarkozy, Hollande, Macron — extensible). Modèle `president` en 15 sections obligatoires
(fichier 02, §5).

**D2. Premiers ministres marquants** : Debré, Pompidou, Chaban-Delmas, Messmer, Chirac, Barre,
Mauroy, Fabius, Rocard, Cresson, Balladur, Juppé, Jospin, Raffarin, Villepin, Fillon, Ayrault,
Valls, Philippe, Castex, Borne, Attal, + successeurs. Modèle `premier-ministre` (fichier 02, §6).

**D3. Grandes figures de l'histoire politique** (type `figure`, fichier 02 §7) :
- *Révolution et République* : Montesquieu, Voltaire, Rousseau, Robespierre, Danton,
  Olympe de Gouges, Napoléon Bonaparte, Thiers, Gambetta, Clemenceau, Jaurès.
- *XXe siècle* : Blum, Pétain, de Gaulle, Mendès France, Monnet, Schuman, Simone Veil,
  Mitterrand, Chirac, Badinter.
- *Penseurs internationaux* : Locke, Smith, Marx, Engels, Tocqueville, Mill, Arendt, Keynes,
  Hayek, Friedman, Gramsci, Beauvoir, Fanon, Foucault, Bourdieu.
- *Figures contemporaines* citées dans les dossiers gauche/droite (Mélenchon, Le Pen, Bardella,
  Zemmour, Glucksmann, Tondelier, Roussel, Retailleau, Wauquiez, Bertrand, Pécresse, É. Philippe…) —
  fiches plus courtes, mêmes champs, mise à jour continue.

**Une personne = une entité, plusieurs vues.** Une fiche unique sur de Gaulle devrait couvrir à
la fois l'homme du 18 Juin, le chef de la France libre, le fondateur de la Ve, le président et le
gaullisme — confus. On garde une seule entité (`personne: 'charles-de-gaulle'`, biographie
centrale partagée), mais chaque URL répond à une **intention différente** :
`/learn/figures/charles-de-gaulle` (l'homme, le parcours, l'influence),
`/learn/presidents/charles-de-gaulle` (le mandat : les 15 sections du modèle président),
`/learn/familles/gaullisme` (le courant). Chaque vue rappelle en une ligne l'existence des autres.
Pour les personnes sans double intention (la majorité), une seule vue suffit.
Passerelle avec `frenchFigures.js`/`historicalFigures.js` : quand la figure existe dans le moteur
de matching, la fiche affiche « Votre alignement avec X » (si profil disponible).

---

## 6. Porte E — Comment fonctionne vraiment la France

Type `institution` (fichier 02, §8). Ouvre sur le **schéma simple** (citoyens → députés → lois →
gouvernement → juges), nuancé aux niveaux supérieurs.

**E1. Les pouvoirs nationaux** : président de la République · Premier ministre · gouvernement ·
Assemblée nationale · Sénat · ministères & administrations · préfets.

**E2. Les juges et le droit** : Conseil constitutionnel · Conseil d'État · Cour de cassation ·
les tribunaux · la séparation des pouvoirs · l'État de droit · la justice est-elle indépendante ?

**E3. Les territoires** : collectivités territoriales · communes · départements · régions ·
décentralisation.

**E4. L'Europe** : l'Union européenne dans les institutions françaises (fiche pivot, reliée au
dossier UE de la porte F et au parcours UE).

**E5. Les questions essentielles** (fiches Q/R courtes, N1+N2, souvent adossées au dictionnaire) :
qui décide réellement en France ? · à quoi sert le président ? le Premier ministre ? ·
ministre vs député · comment une loi est adoptée · pourquoi deux chambres · le Sénat peut-il
bloquer une loi ? · décret · ordonnance · 49.3 · motion de censure · dissolution · cohabitation ·
référendum · majorité absolue/relative · gouvernement démissionnaire · « expédier les affaires
courantes » · à quoi sert le Conseil constitutionnel ? · pourquoi le président a-t-il autant de
pouvoir sous la Ve République ?

---

## 7. Porte F — Les débats qui structurent la France

Type `debat`, modèle en 16 sections (fichier 02, §9). Fiches **actualisées régulièrement**
(`updatedAt` affiché). 7 domaines :

**F1. Économie et pouvoir d'achat** : inflation · salaires & SMIC · fiscalité (entreprises,
patrimoine, revenu, TVA) · dette & déficit · dépenses publiques · compétitivité &
réindustrialisation · chômage & précarité · temps de travail · retraites · assurance chômage ·
revenu universel · partage de la valeur · héritage · logement (loyers, accession).

**F2. Services publics** : hôpital · déserts médicaux · école · université · justice · police ·
transports · fonction publique · décentralisation · fracture territoriale.

**F3. Immigration et intégration** : politique d'asile · immigration économique · frontières ·
intégration & assimilation · naturalisation · regroupement familial · régularisation · OQTF ·
droit du sol · quotas migratoires · étudiants étrangers · mineurs non accompagnés ·
coût et contribution économique de l'immigration · statistiques migratoires · liens
immigration/emploi/logement/sécurité.

**F4. Sécurité et justice** : délinquance · narcotrafic · terrorisme · violences urbaines ·
violences faites aux femmes · récidive · surpopulation carcérale · moyens de la justice ·
maintien de l'ordre & violences policières · légitime défense · vidéosurveillance ·
reconnaissance faciale.

**F5. Écologie** : changement climatique · nucléaire · renouvelables · taxe carbone ·
voiture électrique & ZFE · agriculture & pesticides · biodiversité · consommation de viande ·
décroissance vs croissance verte · sobriété · rénovation énergétique · justice climatique ·
adaptation.

**F6. Société** : laïcité · religions · liberté d'expression · féminisme & égalité femmes-hommes ·
droits LGBT · fin de vie · avortement · GPA/PMA & bioéthique · racisme, antisémitisme,
islamophobie · discriminations · identité nationale & communautarisme · liberté académique ·
réseaux sociaux & désinformation.

**F7. Europe, monde, technologie** : souveraineté & défense européennes · élargissement · euro ·
politique commerciale · États-Unis · Russie & Ukraine · Chine · conflit israélo-palestinien ·
politique africaine de la France · aide au développement · dissuasion nucléaire & OTAN ·
autonomie stratégique · IA & automatisation · régulation des plateformes · données &
cybersécurité · souveraineté numérique · surveillance & algorithmes · deepfakes & influence
étrangère · démocratie numérique.

Les 3 crises déjà rédigées dans `Beginner.jsx` (Gilets jaunes, retraites 2023, crise agricole 2024)
deviennent des encadrés « Pourquoi en parle-t-on ? » des débats correspondants, ou des entrées de
chronologie.

---

## 8. Porte G — Le dictionnaire politique

Type `definition` : **3 niveaux** (définition en 1 phrase → explication simple → fiche complète ou
lien vers la fiche mère quand le terme a une grande fiche, ex. « OQTF » ou « 49.3 »).

Catégories (celles du brief §12, qui absorbent les catégories du glossaire actuel) :

| Catégorie | Exemples (liste complète dans le brief, ~200 termes au total à terme) |
|---|---|
| Institutions et vie politique | alternance, amendement, bicamérisme, cohabitation, Constitution, décret, dissolution, motion de censure, ordonnance, régime parlementaire/présidentiel, scrutins, séparation des pouvoirs, suffrage universel, 49.3… |
| Élections | abstention, blanc/nul, circonscription, triangulaire, second tour, parrainage, procuration, primaire, investiture, proportionnelle, vote utile, front républicain… |
| Économie | dette, déficit, PIB, croissance, inflation, pouvoir d'achat, récession, austérité, impôt progressif, TVA, cotisations, prélèvements obligatoires, brut/net, capital, dividendes, nationalisation, privatisation, protectionnisme, libre-échange, chômage, SMIC, redistribution, revenu universel, niches fiscales, ISF, flat tax… |
| Immigration, nationalité et asile | immigré, étranger, réfugié, demandeur d'asile, sans-papiers, titre de séjour, visa, naturalisation, droit du sol/du sang, regroupement familial, rétention, expulsion, OQTF, OFPRA, CNDA, Dublin, protection subsidiaire, apatride… |
| Justice et sécurité | garde à vue, présomption d'innocence, parquet, procureur, juge d'instruction, récidive, comparution immédiate, légitime défense, état d'urgence, crime/délit/contravention… |
| Société | laïcité, discrimination, égalité/équité, méritocratie, communautarisme, universalisme, intersectionnalité, wokisme, cancel culture, patriarcat, genre, assimilation, intégration, multiculturalisme… |
| Europe et international | UE, Commission, Conseils, Parlement européen, zone euro, Schengen, BCE, OTAN, ONU, veto, sanctions, souveraineté, fédéralisme, multilatéralisme, dissuasion nucléaire… |

Chaque définition porte `related[]` (notions liées) et, si pertinent, `parentFiche` (la grande
fiche qui la traite en profondeur). Les fiches insèrent leurs « mots associés » depuis le
dictionnaire — jamais de double rédaction.

---

## 9. Porte H — Vrai ou faux ?

Banque d'items type `vraifaux` (fichier 02, §11), classés par les mêmes catégories que le
dictionnaire. 5 verdicts possibles : vrai · faux · partiellement vrai · trompeur · impossible à
répondre sans contexte. Chaque item : énoncé, verdict, explication argumentée et sourcée, liens.

Consommation double :
1. page dédiée `/learn/vrai-ou-faux` (mode exploration + mode quiz ludique) ;
2. **embarqués** dans les fiches (section « Idées reçues » des modèles président, débat, idéologie…).
Un item vit à un seul endroit (la banque) et est référencé partout ailleurs.

---

## 9bis. Porte I — Comment le sait-on ?

Type `fiche-methode` : expliquer **comment sont produites les connaissances politiques**, pour
rendre l'utilisateur réellement autonome. Fiches :

- comment lire un sondage (et pourquoi ce n'est jamais une prédiction) ;
- corrélation ≠ causalité ;
- comment lire une statistique · moyenne ≠ médiane ;
- comment sont calculés le chômage et l'inflation ;
- comment vérifier une citation ;
- source primaire ≠ source secondaire ;
- fait ≠ opinion ≠ prédiction ;
- comment lire un programme électoral ;
- comment savoir si une loi est vraiment entrée en vigueur (annonce → … → en vigueur) ;
- comment les médias choisissent un angle ;
- qu'est-ce qu'un conflit d'intérêts ;
- comment reconnaître un graphique trompeur.

Ces fiches irriguent tout le reste : chaque bloc « chiffre » d'une fiche peut pointer vers la
méthode correspondante (« comment lit-on ce chiffre ? »). Un parcours dédié P6 les ordonne
(fichier 03) et l'étape 7 du parcours « Je pars de zéro » y renvoie.

## 10. Outils transverses

**Parcours guidés** (`/learn/parcours/:slug`) — séquences ordonnées de pages existantes avec
progression persistée (store). 6 parcours au lancement (fichier 03).

**Comparateur** (`/learn/comparer/:slug`) — compare **2 à 4 entités** de même type ou de types
voisins (idéologies, partis, présidents, mesures, régimes, pays, statuts juridiques). Le format à
2 entités reste le défaut ; 3-4 quand le sujet l'exige (immigré/étranger/demandeur d'asile/réfugié ;
président/PM/député/sénateur ; communisme/socialisme/social-démocratie/social-libéralisme).
Affiche : points communs, différences, contexte, nuances, idées reçues. Comparaisons
éditorialisées uniquement (fichier 02, §12) — pas de génération automatique.

**Chronologies** (`/learn/chronologies/:slug`) — frises interactives : Républiques françaises,
Révolution, histoire de la gauche, histoire de la droite, présidents de la Ve, construction
européenne, grandes lois sociales, lois sur l'immigration, réformes des retraites, crises
économiques, droit de vote, droits des femmes, droits LGBT, décolonisation, cohabitations,
généalogie des partis. Chaque événement est cliquable → explication simple + lien fiche.

---

## 11. Niveaux de difficulté et badges

Chaque page porte un champ `difficulty: 1 | 2 | 3` (Découverte / Intermédiaire / Avancé), affiché
en badge et utilisé par la recherche et les recommandations. Ne pas confondre avec les niveaux de
lecture N1-N4 (internes à chaque page).

## 12. Navigation et maillage

- **Fil d'Ariane** : J'y connais rien → porte → fiche (l'Academy a son propre fil).
- **Bloc « Les mots associés »** en bas de chaque fiche (liens dictionnaire).
- **Bloc « Continuer avec »** : 2-3 pages liées (champ `related[]`).
- **Bloc « Testez-vous »** : 3-5 questions vrai/faux liées.
- Les concepts in-quiz (`conceptMap.js`) pointent vers les slugs du nouveau système
  (migration du champ `articleKey`, fichier 05).

## 13. Recherche

Recherche plein texte côté client sur un manifeste léger (fichier 05, §5), capable de comprendre
des formulations naturelles via champ `aliases[]` par page : « c'est quoi une OQTF ? »,
« pourquoi le président peut dissoudre l'Assemblée ? », « différence entre réfugié et migrant »,
« qu'a vraiment fait François Hollande ? »…

Comportement : 1) réponse immédiate (le N1 de la meilleure correspondance, affiché dans les
résultats) ; 2) lien vers la fiche ; 3) notions connexes ; 4) badge de difficulté ; 5) parcours
d'approfondissement suggéré.

## 14. Objectif de volume (rappel des cibles finales)

300-500 définitions · 50-100 grandes fiches thématiques · 1 fiche par président de la Ve ·
fiches Premiers ministres · idéologies · partis · personnalités historiques · débats contemporains ·
plusieurs centaines de vrai/faux · dizaines de comparateurs · plusieurs parcours.
**Ne pas tout afficher immédiatement** : l'architecture (fichier 05) accueille cette profondeur
progressivement — les portes affichent uniquement les contenus publiés.
