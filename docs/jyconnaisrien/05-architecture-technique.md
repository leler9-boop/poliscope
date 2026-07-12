# 05 — Architecture technique

Objectif : accueillir 500+ contenus sans faire exploser le bundle (déjà >500 kB), sans base de
données (le site doit rester 100 % fonctionnel en mode invité), et en réutilisant les conventions
du projet (données en modules JS bilingues, scripts de contrôle dans `scripts/`).

## 1. Organisation des fichiers

```
src/content/learn/
├── manifest.js                  ← index léger de TOUT le contenu (chargé eagerly)
├── schema.md                    ← copie de référence des schémas ci-dessous
├── bases/…                      ← 1 fichier par page, ex. gauche-ou-droite.js
├── familles/…                   ex. gauche.js, socialisme.js
├── partis/…                     ex. rassemblement-national.js
├── presidents/…                 ex. francois-mitterrand.js
├── premiers-ministres/…
├── figures/…
├── institutions/…
├── debats/…                     ex. oqtf.js, inflation.js
├── dico/                        ← groupés par catégorie : institutions.js, economie.js…
├── vraifaux/                    ← groupés par catégorie
├── parcours/…
├── comparateurs/…
└── chronologies/…
```

- **Un fichier = une page** (sauf dico/vraifaux : un fichier = une catégorie).
- Chaque fichier exporte `default` un objet conforme au schéma (§3).
- Chargement **lazy** : les pages contenu sont importées via `import()` dynamique (React.lazy ou
  loader maison) → code-splitting automatique par Vite. Seul `manifest.js` est dans le bundle
  principal. C'est ce qui rend les 500+ contenus tenables.

## 2. Le manifeste

```js
// manifest.js — UNE entrée par page, ~150-300 octets/entrée
export const LEARN_MANIFEST = [
  {
    slug: 'oqtf',
    type: 'debat',                 // fiche-base|ideologie|parti|president|premier-ministre|
                                   // figure|institution|debat|definition|vraifaux|parcours|
                                   // comparateur|chronologie|fiche-methode
    porte: 'F3',
    title: { fr: `L'OQTF`, en: 'OQTF (order to leave France)' },
    icon: '📄',
    difficulty: 2,                 // 1 découverte | 2 intermédiaire | 3 avancé
    famille: 'dossier',            // 'court' (N1-N2) | 'intermediaire' (N1-N3) | 'dossier' (N1-N4)
    updatedAt: '2026-07-12',       // dernière modification (≠ vérification)
    freshness: { type: 'live', reviewEveryMonths: 3, lastReviewedAt: '2026-07-12' },
                                   // 'stable' (24 mois) | 'periodic' (12) | 'live' (3) — cf. fichier 00 §7
    hasLevels: [1, 2, 3, 4],       // niveaux réellement rédigés (doit ⊆ la famille)
    langs: ['fr'],                 // 'en' ajouté quand traduit
    personne: null,                // slug d'entité personne si la page est une VUE d'une personne
                                   // (ex. 'charles-de-gaulle' partagé entre figures/ et presidents/)
    misEnAvant: false,             // sélection éditoriale du hub « Comprendre l'actualité »
    aliases: { fr: [`c'est quoi une oqtf`, `obligation de quitter le territoire`], en: [] },
    related: ['immigration', 'demandeur-asile', 'retention-administrative'],
    load: () => import('./debats/oqtf.js'),
  },
  …
];
```

Le manifeste alimente : le hub, les listes par porte, la recherche, les blocs « Continuer avec »,
les recommandations post-quiz. Il est la **seule** source de vérité sur ce qui est publié —
une page absente du manifeste n'existe pas pour l'UI (mise en ligne progressive).

## 3. Schéma d'une page de contenu

Champs communs (tous types) :

```js
export default {
  slug, type, title: {fr,en}, icon,
  updatedAt: 'YYYY-MM-DD',            // obligatoire — dernière modification
  freshness: { type, reviewEveryMonths, lastReviewedAt },  // obligatoire — cf. fichier 00 §7 ;
                                      // l'UI affiche lastReviewedAt (« vérifié le… ») sur live/periodic
  sources: [ { label, url, year, perimetre?, limite? } ],
  level1: {fr,en},                    // 40-80 mots — obligatoire
  level2: { sections: [ {titre:{fr,en}, corps:{fr,en}, brique?} ] },   // obligatoire
  level3: { sections: [ … ] },        // accordéons — optionnel à la publication
  level4: { items: [ {titre, url|corps, kind:'discours'|'texte'|'donnees'|'biblio'|'lien'} ] },
  vraiFaux: ['id-item-1', …],         // refs vers la banque
  motsAssocies: ['slug-dico', …],
  quiz: [ {question:{fr,en}, options, bonneReponse, explication:{fr,en}} ],  // « Testez-vous »
}
```

- `brique` typée pour les encadrés : `'a-retenir' | 'confusion' | 'chiffre' | 'tableau' |
  'frise' | 'schema' | 'citation' | 'visions'` (réutilise les rendus existants de Beginner :
  glossary/comparison/visions).
- Champs additionnels par type (grille des 9 visions pour `ideologie`, 15 sections `president`,
  16 sections `debat`, `estCoalition`/`predecesseurs`/`periodesIdeologiques[]` pour `parti`,
  `entities[2..4]` pour `comparateur`, etc.) : voir fichier 02 ; le script de validation (§7)
  impose leur présence.
- Un chiffre est toujours un objet `{valeur, source, annee, perimetre, limite, methode?}` — jamais
  un nombre nu dans le texte quand il est central à l'argument. `methode` pointe vers une fiche
  de la porte I (« comment lit-on ce chiffre ? »).
- **Personnes à vues multiples** : la biographie centrale d'une personne vit dans
  `src/content/learn/personnes/<slug>.js` (non routé) ; les vues (`figures/…`, `presidents/…`)
  l'importent et déclarent `personne: '<slug>'`. Chaque vue répond à une intention distincte et
  référence les autres vues.

## 4. Routes et navigation

`react-router` : ajouter les routes dynamiques
`/learn/:section/:slug` + `/learn/dico`, `/learn/vrai-ou-faux`, `/learn/comparer/:slug`
(le slug identifie une comparaison éditorialisée, qui porte 2 à 4 entités).
`PAGE_TO_PATH`/`PATH_TO_PAGE` (`src/lib/router.js`) conservent `beginner: '/learn'` pour le hub ;
les sous-pages sont résolues dynamiquement comme `electionDetail` aujourd'hui.
`vercel.json` (SPA rewrite) couvre déjà ces URL. Prévoir `<title>`/meta par page (SEO — enjeu
majeur du playbook growth) : chaque page rend son titre + description depuis le manifeste.

Composants nouveaux (remplaçant progressivement l'intérieur de `Beginner.jsx`) :
`LearnHub`, `LearnPage` (rendu générique par type + niveaux), `LevelSwitcher`, `Accordion`,
`DicoIndex`, `VraiFauxDeck`, `ParcoursRunner`, `Comparateur`, `Frise`, `LearnSearch`.

## 5. Recherche

Client-side, sans dépendance lourde : normalisation (minuscules, accents), tokenisation, score
sur `title + aliases + related + type`, avec préfixes de questions naturelles ignorés
(« c'est quoi », « pourquoi », « quelle différence entre »…). Le manifeste suffit — pas d'index
du corps des textes en v1. Résultat : N1 de la meilleure correspondance affiché inline
(le N1 est alors dupliqué dans le manifeste OU chargé lazy à l'affichage du résultat — trancher
en implémentation ; commencer par lazy).

## 6. Migration de l'existant (rien n'est jeté)

| Existant | Devient |
|---|---|
| `TOPICS` (14 sujets, definition/example/extended) | fiches `debat` ou `fiche-base` : definition→level1, example→brique exemple du level2, extended→sections level2/level3 |
| `DEEP_DIVES.retraites` (5 niveaux) | `debats/retraites.js` — déjà quasi conforme (niveaux, glossaire, comparaison internationale, visions) |
| `CRISES` (3) | encadrés « pourquoi en parle-t-on ? » des débats liés + événements de chronologies |
| `GLOSSARY_CATEGORIES` (~30 termes : simple/concretement/exemple/debat) | entrées `dico/` — structure conservée telle quelle (§ fichier 02, §10) |
| `conceptMap.js` `articleKey` | renommé `learnSlug`, pointe vers les slugs du manifeste |
| `Beginner.jsx` | devient `LearnHub` ; les composants de rendu (TopicCard, DeepDiveCard, GlossaryCard…) sont extraits et généralisés |

Migration = première étape de la vague 1, **avant** toute rédaction nouvelle : elle valide le
modèle de données sur du contenu réel.

## 7. Script de validation (`scripts/check-learn-content.mjs`)

Sur le modèle de `check-profile-conventions.mjs` (à lancer avant tout commit de contenu) :

- schéma : champs obligatoires par type, sections obligatoires (15 pour président, 16 pour débat,
  `periodesIdeologiques` pour les partis multi-époques, 2 ≤ `entities` ≤ 4 pour les comparateurs) ;
- N1 entre 40 et 80 mots (fr) ;
- cohérence `famille` ↔ `hasLevels` (un contenu court n'a pas de N3/N4 ; un dossier sans N3
  rédigé = warning « fiche complète à venir ») ;
- `updatedAt` et `freshness.lastReviewedAt` présents et parsables ; **alerte si
  `lastReviewedAt` dépasse `reviewEveryMonths`** (3 mois pour `live`, 12 pour `periodic`,
  24 pour `stable`) ;
- tout chiffre structuré a source + année + périmètre ;
- `related`, `motsAssocies`, `vraiFaux`, `parentFiche` pointent vers des slugs/ids existants ;
- slugs uniques ; entrée manifeste ↔ fichier cohérents (title, type, hasLevels) ;
- lexique interdit (détection brute à revue humaine) : présence de « tous les demandeurs d'asile »,
  « forcément », superlatifs militants… → warning.

S'intègre au contrôle de fraîcheur factuelle existant (`sources.json`).

## 8. Ce que cette architecture ne fait PAS (v1)

- Pas de CMS ni de backend : le contenu est versionné dans le repo (revue par PR = revue
  éditoriale). Si le rythme de production le justifie plus tard, le même schéma peut être servi
  depuis Supabase — le modèle de données est prêt, la décision est découplée.
- Pas de recherche sémantique/LLM : les `aliases` couvrent les formulations naturelles en v1.
- Pas de traduction EN systématique (fichier 00, §9).
