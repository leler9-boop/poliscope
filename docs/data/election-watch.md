# Veille électorale 2027 — mode d'emploi

Prompt versionné : [`prompts/election-watch-2027.md`](../../prompts/election-watch-2027.md)
Cadence : toutes les 72 à 96 heures · Dernière révision : 2026-08-09

---

## Le principe

La cible n'est **pas** « un agent modifie `elections.js` tous les quatre jours ». C'est une
chaîne de proposition et de revue où l'humain garde la décision :

```
sources officielles · notices Commission des sondages · presse de contrôle
  → détection
  → archivage des métadonnées
  → extraction de faits
  → résolution des alias candidats
  → proposition de position / claim
  → validation de schéma
  → tests de couverture et d'impact
  → REVUE HUMAINE
  → release de données versionnée
  → génération des artefacts frontend
```

L'agent ne publie jamais. Il produit un dossier daté, un patch non appliqué et une file de
revue triée par impact.

## Exécution — pipeline en deux temps

```bash
npm run watch:prepare
```

Crée `veille/2027/<AAAA-MM-JJ>/` avec les 12 fichiers au bon schéma, un `CONTEXT.md` (fenêtre
de recherche calculée depuis `last_successful_run` avec 48 h de chevauchement, résultats des
contrôles d'intégrité), et pose un verrou de concurrence.

Fournir ensuite à l'agent `prompts/election-watch-2027.md` **et** le `CONTEXT.md` du run, avec
accès en **lecture seule** au dépôt. L'agent remplit les fichiers du dossier.

```bash
npm run watch:finalize
```

Valide le paquet et met à jour `last_successful_run`. **Refuse** — sans faire avancer l'état —
si : un fichier manque, un JSON est invalide, le résumé porte encore le marqueur
`TODO_UNFILLED`, une proposition n'a pas de source, `reviewerRequired` vaut `false`, ou un
`stance: 0` n'est pas explicitement confirmé (l'inconnu se code `null`).

> **`scripts/election-watch/run.mjs` n'effectue AUCUNE recherche web.** Node n'a pas d'agent de
> recherche. Produire un `NO_VERIFIED_CHANGE` sans avoir rien contrôlé serait un mensonge daté
> et archivé : le script prépare et valide, l'agent cherche.

### Planification

Deux options, aucune n'exige de secret en clair :

- **GitHub Actions** — lundi et jeudi, plus `workflow_dispatch` pour le déclenchement manuel.
  Le job ne doit produire qu'une pull request de proposition, jamais un commit sur `main`.
- **Orchestrateur local** — une tâche planifiée qui exécute le prompt et dépose le dossier.

Dans les deux cas : conserver `last_successful_run`, empêcher deux exécutions concurrentes,
échouer bruyamment si la recherche ou la validation échoue, notifier un humain sur alerte
critique.

> **À ne pas faire** : si l'environnement ne permet pas une vraie recherche web, implémenter
> le pipeline et les validateurs, mais ne pas simuler une veille qui n'a pas eu lieu.

## Contrôles bloquants

`npm test` échoue si :

- une clé de `positions` ne correspond à aucun candidat ;
- un candidat publié tombe à 0 position exploitable ;
- la couverture spécifique passe sous 100 % sans être documentée ;
- une position sort du domaine 1–5 (une absence se code par omission, jamais par 0) ;
- un alias du registre désigne deux personnes ;
- un candidat d'élection est absent du registre canonique.

C'est ce filet qui empêche le retour du bug « Le Pen 0/17 ».

## Sorties attendues

`executive_summary.md` · `critical_alerts.json` · `candidate_status_changes.json` ·
`program_releases.json` · `position_proposals.json` · `poll_updates.json` ·
`stale_or_incomplete_profiles.json` · `rejected_signals.json` · `tests_run.json` ·
`human_review_queue.json` · `proposed.patch` · `changelog.md`

Chaque proposition : `before`, `after`, `sourceIds`, `confidence`, `reasoning`,
`impactOnMatching`, `reviewerRequired`, `rollback`.

Aucune nouveauté vérifiable ⇒ `NO_VERIFIED_CHANGE` et **aucune** position créée.

## Auto-publication

Autorisée uniquement pour des métadonnées factuelles à très forte confiance (correction d'une
URL morte, date de publication d'un document déjà référencé).

**Jamais** pour une position qui affecte un score.

## Points chauds au 2026-08-09

- **David Lisnard** au registre, pas `matchReady`. Programme officiel structuré : premier à coder.
- **Éric Zemmour** : statut contradictoire non tranché (`needsHumanReview: true`).
- **Gabriel Attal** : distinguer chantier participatif, proposition et programme officiel (M2).
- **Primaires** : gauche unitaire 11 octobre 2026 · pôle socialiste 9-11 et 16-18 octobre 2026 ·
  militants PCF 6 septembre 2026.

## Sondages

Stockés à part, jamais utilisés seuls pour décider qu'une personne est candidate.
Ne jamais fusionner intention de vote, souhait de voir gagner, potentiel électoral, popularité,
second tour, et hypothèses de premier tour différentes. Toujours rattacher la notice de la
Commission des sondages et la source primaire.
