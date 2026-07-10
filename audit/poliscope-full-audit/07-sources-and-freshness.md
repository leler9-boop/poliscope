# Sources et politique de fraîcheur

## 1. Sources utilisées pendant cet audit

Voir `sources.json` pour le détail structuré (15 entrées). Hiérarchie respectée conformément à la mission : sites/comptes-rendus officiels (Élysée, Assemblée nationale, ministère de l'Intérieur, mairie de Paris, Bundesregierung.de, vie-publique.fr) en priorité, presse nationale reconnue (Touteleurope, France24, Public Sénat, RTS, Euronews, franceinfo) pour compléter/corroborer, jamais de blog partisan ou contenu non sourcé comme source principale. Sur les 15 faits vérifiés : 12 en confiance `high` (recoupement multi-sources ou source officielle directe), 3 en confiance `medium` (recoupement de presse sans source officielle unique, ou situation encore fluide à J+3 d'un événement).

## 2. Aucune donnée politique n'est actuellement structurée avec les champs de fraîcheur recommandés

Vérification directe : `src/data/elections.js`, `frenchFigures.js`, `historicalFigures.js`, `candidateDetails.js`, `candidatePolicies.js` ne contiennent **aucun** des champs `sourceUrl`, `sourceTitle`, `sourceType`, `publishedAt`, `verifiedAt`, `confidence` au niveau des données elles-mêmes. La seule trace de gestion de fraîcheur trouvée dans tout le code est un **avertissement en texte libre** dans `elections.js:851` (« ⚠ Candidacy statuses as of June 2026 ») — non structuré, non affiché à l'utilisateur (c'est un commentaire dans le `deeperContext`, noyé dans un paragraphe narratif), et déjà lui-même dépassé d'un mois à la date d'audit.

**Conséquence directe** : rien dans l'architecture actuelle ne permet de savoir, sans audit manuel comme celui-ci, quelles données sont récentes et lesquelles sont dangereusement datées. C'est la cause structurelle du constat le plus critique de cet audit (statut Le Pen/Bardella, [06-political-data-audit.md](06-political-data-audit.md) §1).

## 3. Politique de fraîcheur proposée (Phase 7.5 de la mission)

| Catégorie de donnée | Fréquence de vérification recommandée | Justification |
|---|---|---|
| Données électorales critiques (candidature, éligibilité, inéligibilité) en période électorale | **Hebdomadaire** | Le cas Le Pen/Bardella montre qu'un délai de 3 jours suffit à rendre une donnée structurée (`candidacyStatus`) visiblement fausse en UI |
| Candidats et investitures | Fréquente (bi-hebdomadaire à mensuelle selon la proximité du scrutin) | Statuts `probable`/`speculative` évoluent vite (primaire gauche du 11/10/2026 à surveiller) |
| Fonctions et affiliations (chef de gouvernement, poste ministériel) | **Mensuelle ou lors d'un événement connu** (démission, remaniement) | Cas Lecornu/Bayrou : un remaniement vieux de 10 mois n'était toujours pas reflété |
| Positions politiques structurantes (programme, réforme) | Lors de la publication d'un nouveau programme officiel | Les faits historiques vérifiés (réformes, résultats électoraux passés) se sont révélés fiables — pas besoin de re-vérification fréquente une fois actés |
| Données historiques (figures du passé, élections closes) | Validation ponctuelle avec source stable | Confirmé fiable sur l'échantillon vérifié (§5 de 06) — risque faible |

## 4. Recommandation d'implémentation minimale

Ajouter, au niveau de chaque bloc candidat/figure sensible (pas nécessairement chaque champ individuel — un objet `_meta` par entité suffirait pour un premier jet) :
```js
_meta: {
  verifiedAt: '2026-07-10',
  sourceUrl: '...',
  sourceType: 'official-government',
  confidence: 'high',
  notes: '...'
}
```
et **afficher `verifiedAt` à l'utilisateur** sur les fiches candidats (`CandidateProfile.jsx`) — actuellement absent de l'UI (voir [10-prioritized-remediation-plan.md](10-prioritized-remediation-plan.md)). Cela transforme un audit ponctuel coûteux en une information consultable en continu, et permet à l'utilisateur de juger lui-même du degré de confiance à accorder à une comparaison, conformément à l'esprit de neutralité et de transparence revendiqué par `Transparency.jsx`.

## 5. Recherches délibérément non menées (contrôle des coûts)

Conformément à la consigne de budget de recherche externe, l'agent factuel n'a pas vérifié individuellement les ~40 personnalités internationales du dossier `public/images/candidates/` (recherche groupée par pays uniquement), n'a pas vérifié l'intégralité des positions politiques listées dans `candidatePolicies.js` (spot-check de 10 affirmations à fort enjeu seulement), et n'a pas recherché de source unique officielle pour le statut de Pedro Sánchez (convergence de presse jugée suffisante, confiance `medium` assumée plutôt que de multiplier les recherches). Ces choix sont documentés ici pour permettre une vérification ultérieure ciblée si nécessaire.
