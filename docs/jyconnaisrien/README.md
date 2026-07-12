# Refonte « J'y connais rien » — dossier d'architecture

> Livrable 1 du brief maître (2026-07-12). Ce dossier définit l'architecture complète de la
> future base de connaissances politique de Poliscop **avant** toute production de contenu de masse.
> Règle du brief : ne pas rédiger des centaines de contenus isolés sans architecture cohérente.

## Contenu du dossier

| Fichier | Contenu |
|---|---|
| [00-vision-et-principes.md](00-vision-et-principes.md) | Mission, principe « du petit vers le grand », ton, neutralité, garde-fous éditoriaux, critères de validation |
| [01-arborescence.md](01-arborescence.md) | Arborescence complète : page d'accueil éditorialisée, 9 portes d'entrée, sous-catégories, niveaux de lecture, schéma d'URL, navigation, recherche |
| [02-modeles-de-contenu.md](02-modeles-de-contenu.md) | Les 12 modèles : fiche générique, idéologie, parti (avec périodes idéologiques), président, Premier ministre, figure, institution, grand débat (grille de positions variable), définition, fiche méthode, vrai/faux, comparateur (2-4 entités) & chronologie |
| [03-parcours-pedagogiques.md](03-parcours-pedagogiques.md) | Les 6 parcours guidés (dont « Comment le sait-on ? ») + personnalisation post-quiz |
| [04-priorites-100-premieres-pages.md](04-priorites-100-premieres-pages.md) | Liste priorisée et numérotée des 100 premières pages à produire |
| [05-architecture-technique.md](05-architecture-technique.md) | Modèle de données, routes, migration de l'existant (`Beginner.jsx`, `conceptMap.js`), recherche, script de validation |

## État de l'existant (au 2026-07-12)

La rubrique existe déjà sous forme embryonnaire, route `/learn` (clé store `beginner`) :

- `src/pages/Beginner.jsx` (1 562 lignes) — tout le contenu codé en dur : 14 sujets à 2 niveaux
  (`TOPICS`), 1 seul dossier multi-niveaux (`DEEP_DIVES` : retraites, 5 niveaux), 3 crises
  (`CRISES`), un glossaire par catégories (`GLOSSARY_CATEGORIES`, ~30 termes à 4 champs).
- `src/data/conceptMap.js` — concepts pédagogiques in-quiz à 2 niveaux, reliés à Beginner via `articleKey`.

Ce modèle monolithique ne peut pas accueillir l'objectif final (300-500 définitions, 50-100 fiches,
centaines de vrai/faux). L'architecture cible (fichier 05) migre ce contenu **sans le jeter** :
tout l'existant se convertit dans le nouveau modèle.

## Étapes suivantes (livrable 2 du brief)

Prototypage en **deux temps** (détail fichier 04) :

1. **6 prototypes d'expérimentation** `[PROTO-1]`, chacun testant une partie différente du
   système : page d'accueil `/learn` · la droite · l'OQTF · le président de la République ·
   François Mitterrand · l'inflation. Rien d'autre n'est produit tant qu'ils ne sont pas validés.
2. **Second lot** `[PROTO-2]` après validation : la gauche · immigration · laïcité ·
   Union européenne · de Gaulle · Chirac · Sarkozy · Hollande · Macron.

## Note sur le nom (correction de cap 2026-07-12)

Deux marques : **« J'y connais rien »** = le nom public de la partie débutante (`/learn`) ;
**« Poliscop Academy »** = la section avancée (`/learn/academy`, grandes fiches complètes,
présidents, comparateurs, chronologies). Le projet s'appelle **Poliscop** (sans « e ») —
contrôle automatique : `node scripts/check-brand.mjs`. Voir fichier 00, §1.
