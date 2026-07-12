# 00 — Vision et principes éditoriaux

## 1. Mission

Faire de cette rubrique la base de connaissances politique la plus accessible, progressive et
complète pour le grand public français. Pas un glossaire : un **parcours de compréhension** allant
du plus simple au plus approfondi.

### Nom public — arrêté (correction de cap 2026-07-12)

- **« J'y connais rien »** est le **nom public de la partie débutante** (`/learn`) : direct,
  accessible, assumé. Promesse : « La politique expliquée simplement, sans vous prendre pour
  un idiot. »
- **« Poliscop Academy »** (`/learn/academy`) est la **section avancée** : grandes fiches
  complètes, idéologies, dossiers historiques, présidents, comparateurs, chronologies, sources.
- Articulation : J'y connais rien = commencer simplement, apprendre progressivement ;
  Academy = accéder aux dossiers approfondis (les fiches sont partagées — l'Academy ouvre
  directement le niveau « Tout comprendre » via `?niveau=3`).
- La structure d'URL `/learn` est conservée telle quelle.
- ⚠️ Le projet s'appelle **Poliscop** (sans « e »), site poliscop.org — contrôle automatique
  `scripts/check-brand.mjs`.

Logique centrale : **Je découvre → je comprends → j'approfondis → je maîtrise.**

Une personne qui ne connaît rien à la politique doit pouvoir, progressivement :
comprendre les mots des médias, les familles politiques, les partis et personnalités,
les institutions, les grands débats et leur contexte historique ; distinguer faits, opinions,
arguments et idées reçues ; approfondir sans jamais être submergée.

## 2. Le principe structurant : du petit vers le grand

**Tout contenu existe à plusieurs niveaux de lecture.** C'est la colonne vertébrale de la rubrique,
transversale à tous les types de pages (voir modèles, fichier 02).

| Niveau | Nom UI | Format | Contrainte |
|---|---|---|---|
| **N1** | « En 20 secondes » | 40-80 mots | Répond à « qu'est-ce que c'est, concrètement ? ». Toujours suivi d'un CTA « Comprendre un peu mieux → » |
| **N2** | « En 3 minutes » | 1 fiche intermédiaire | Idée générale, valeurs, sensibilités internes, origine, arguments pour/contre, figures, exemples. CTA « Tout comprendre sur ce sujet → » |
| **N3** | « Tout comprendre » | Page dédiée, longue | Découpée en **sections courtes et repliables** (accordéons). L'utilisateur n'est jamais obligé de tout lire |
| **N4** | « Pour aller encore plus loin » | Annexes | Textes fondateurs, discours, données, comparaisons internationales, bibliographies, sources institutionnelles. Réservé aux sujets structurants |

**Les niveaux ne sont pas rigides : trois familles éditoriales** fixent la profondeur attendue
(imposer 4 niveaux partout créerait artificiellement du contenu) :

| Famille | Niveaux | Exemple |
|---|---|---|
| **Contenu court** | N1 + N2 | bulletin nul, triangulaire |
| **Contenu intermédiaire** | N1 + N2 + N3 | motion de censure, un Premier ministre |
| **Dossier structurant** | N1 + N2 + N3 + N4 | gauche, droite, immigration, présidents |

La famille est déclarée par page (`famille` dans le manifeste, fichier 05) et le script de
validation vérifie la cohérence famille ↔ niveaux rédigés.

Règles :
- N1 et N2 sont **obligatoires** pour toute page publiée. N3 (quand la famille l'exige) peut
  arriver dans une itération ultérieure (la page affiche alors « fiche complète à venir »).
- Chaque niveau doit être autosuffisant : on peut s'arrêter à N1 et avoir une réponse honnête.
- Le passage de niveau est toujours un choix explicite de l'utilisateur (bouton), jamais du
  scroll infini.

## 3. Ton

Simple, direct, calme, précis, neutre, intelligent. **Jamais** professoral, militant ou condescendant.
Compréhensible par un collégien, intéressant pour un adulte.

- **Expliquer simplement ne signifie pas supprimer les nuances.**
- Ne jamais infantiliser ni prendre l'utilisateur pour un idiot.
- Aucun jargon sans explication immédiate (idéalement : lien vers l'entrée du dictionnaire).
- Vocabulaire type : « Les politiques qualifiées de néolibérales cherchent généralement à laisser
  davantage de place au marché… Le terme est toutefois contesté » — et non « le paradigme néolibéral
  repose sur une dérégulation des mécanismes économiques ».

## 4. Neutralité

Sur tout sujet controversé, présenter dans l'ordre :

1. les faits établis ;
2. les arguments des défenseurs ;
3. les arguments des opposants ;
4. les incertitudes ;
5. les données disponibles ;
6. les limites de ces données.

**La neutralité n'est pas la fausse équivalence** : ne jamais présenter une affirmation documentée
et une affirmation manifestement fausse comme également plausibles. Le module Vrai/Faux admet
5 verdicts (vrai / faux / partiellement vrai / trompeur / impossible à répondre sans contexte)
précisément pour ne pas forcer de réponse binaire.

## 5. Garde-fous éditoriaux (checklist bloquante avant publication)

Ne jamais :

- inventer une citation ;
- attribuer une position à un parti sans source ;
- confondre programme et action gouvernementale ;
- présenter un sondage comme une prédiction certaine ;
- utiliser une statistique sans **date** ni **périmètre** ;
- résumer une idéologie uniquement à travers ses opposants, ni un parti uniquement à travers son propre discours ;
- confondre : extrême droite / droite / droite conservatrice ; extrême gauche / gauche radicale /
  social-démocratie ; immigré / étranger / réfugié / demandeur d'asile ; déficit / dette ;
  impôt / cotisation sociale ; mise en examen / culpabilité ; illégalité / délinquance ;
  données françaises / données étrangères.

Et rappeler que la politique n'est **pas un axe unique** : une personne peut être de gauche sur
l'économie et conservatrice sur les sujets de société, libérale économiquement et progressiste
socialement, souverainiste de gauche ou de droite, écologiste sans être alignée sur un parti
écologiste, centriste sans être « sans opinion ». Chaque fiche idéologie/famille l'explicite.

## 6. Sources

Priorité aux sources primaires et institutionnelles : Vie-publique.fr, Légifrance, INSEE, INED,
ministères, Assemblée nationale, Sénat, Conseil constitutionnel, Conseil d'État, Cour des comptes,
Défenseur des droits, OFPRA, Eurostat, institutions de l'UE, OCDE, Banque mondiale, FMI, ONU,
publications académiques, ouvrages historiques reconnus.

Les médias servent à **contextualiser l'actualité**, jamais comme unique source d'un contenu de fond.
Chaque chiffre porte : source, année, périmètre, limite méthodologique (champ `sources[]` +
convention de citation dans le modèle de données, fichier 05). Ce dossier réutilise l'infrastructure
`sources.json` + script de contrôle de fraîcheur créés au chantier RGPD/coverage/freshness 2026-07.

## 7. Gestion de l'actualité et de la fraîcheur

Une fiche sur Montesquieu ne se périme pas comme une fiche sur l'OQTF. Chaque page déclare un
**régime de fraîcheur** explicite (schéma complet fichier 05, §3) :

```
freshness: { type: 'stable' | 'periodic' | 'live', reviewEveryMonths: 24 | 12 | 3, lastReviewedAt }
```

- `stable` (revue ~24 mois) : idéologies historiques, penseurs, définitions intemporelles (démocratie).
- `periodic` (revue ~12 mois) : présidents passés, Premiers ministres, chronologies.
- `live` (revue ~3 mois) : partis actuels, débats d'actualité, droit de l'asile, conflits en cours.

**Trois dates distinctes**, car une correction typographique ne vaut pas vérification juridique :
`updatedAt` (dernière modification) ≠ `lastReviewedAt` (dernière vérification factuelle) ≠ l'année
des données de chaque chiffre. L'UI affiche `lastReviewedAt` (« vérifié le… ») sur les contenus
`live`/`periodic`.

Toute fiche liée à l'actualité affiche en outre : éléments nouveaux, éléments incertains,
évolutions législatives, dernières données.

Toujours distinguer les stades : annonce → proposition → projet de loi → vote parlementaire →
promulgation → décret d'application → mesure réellement en vigueur. Ne jamais présenter comme
définitive une proposition non adoptée.

## 8. Critères de validation d'une page (les 10 questions finales)

1. Une personne de 13 ans comprend-elle l'essentiel ?
2. Un adulte non politisé apprend-il réellement quelque chose ?
3. Une personne déjà informée trouve-t-elle des nuances intéressantes ?
4. Les mots compliqués sont-ils expliqués ?
5. Les faits sont-ils séparés des opinions ?
6. Les arguments opposés sont-ils honnêtement présentés ?
7. Les informations sont-elles datées et sourcées ?
8. Le contenu simplifie-t-il sans déformer ?
9. L'utilisateur sait-il naturellement où cliquer pour approfondir ?
10. Le contenu aide-t-il à se faire une opinion plutôt qu'à en imposer une ?

## 9. Langues

Le modèle de données reste bilingue `{fr, en}` (cohérent avec tout le site), mais la production est
**FR d'abord** : une page peut être publiée en FR seul (l'UI affiche alors un repli propre côté EN).
La version EN suit selon les priorités produit. Décision réversible sans changer le modèle.

## 10. Design

Fidèle à Poliscop : minimaliste, moderne, très lisible, élégant, sans surcharge, mobile-first.
Composants récurrents (voir fichier 02, §Briques UI) : cartes courtes, accordéons, frises,
comparaisons, schémas, encadrés « À retenir », blocs « Attention à la confusion »,
blocs « Vrai ou faux ? », boutons « En savoir plus », barre de progression.
Pas de spider/radar charts (interdit projet — voir mémoire design).
