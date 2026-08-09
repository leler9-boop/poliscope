# Provenance des données candidats

Dernière mise à jour : 2026-08-09 · Code : `src/data/candidateRegistry.js`

---

## L'état honnête aujourd'hui

**Aucun profil candidat publié n'est sourcé position par position.** Les huit scores 0–100 de
chaque candidat sont des nombres saisis éditorialement. Ils portent tous
`profileSource: 'legacy-manual-v1'`.

Concrètement : il est impossible d'expliquer pourquoi Gabriel Attal vaut 63 en économie plutôt
que 58 ou 68, ni de recalculer son profil quand une mesure nouvelle est publiée.

Ce n'est pas une découverte de l'audit qu'on aurait « corrigée » : c'est un chantier éditorial
qui reste à faire. Ce document en fixe la cible et la règle du jeu.

---

## Ce qui a été mis en place

### Registre canonique

`src/data/candidateRegistry.js` fixe, pour chaque personne :

| Champ | Rôle |
|---|---|
| `id` | identifiant canonique, stable, indépendant de l'élection (`marine-le-pen`) |
| `legacyIds` | tous les identifiants historiques (`lepen`, `lepen_2027`) — **ne jamais en supprimer** |
| `status` + `statusDate` + `statusSource` | statut de candidature, daté et sourcé |
| `matchReady` | la personne entre-t-elle dans le classement ? |
| `notMatchReadyReason` | si non, pourquoi |
| `profileSource` | `legacy-manual-v1` \| `sourced-positions` \| `none` |
| `programMaturity` | M0 à M5 |
| `needsHumanReview` | contradiction non tranchée |

Les identifiants historiques sont conservés parce que des liens partagés et des exports
utilisateurs les contiennent.

### Statuts autorisés

`declared` · `invested` · `primary_candidate` · `conditional` · `potential` · `contingency` ·
`withdrawn` · `ineligible` · `officially_validated`

**Un candidat testé dans un sondage n'est pas déclaré.** Un candidat déclaré n'est pas
nécessairement comparable.

### Maturité du programme

`M0` aucune donnée · `M1` déclarations générales · `M2` propositions thématiques ·
`M3` programme officiel partiel · `M4` programme officiel complet · `M5` version définitive archivée.

---

## Personnes suivies mais pas comparables

Ajoutées au registre le 2026-08-09, **sans profil thématique** :

| Personne | Parti | Statut | Date | Pourquoi pas comparable |
|---|---|---|---|---|
| David Lisnard | Nouvelle Énergie | déclaré | 2026-03-31 | Aucune position codée. Programme officiel structuré (M3) — **à coder en priorité** |
| Nicolas Dupont-Aignan | Debout la France | déclaré | 2025-03-08 | Aucune position codée |
| Nathalie Arthaud | Lutte ouvrière | déclarée | 2025-12-08 | Aucune position codée |
| Xavier Bertrand | Nous France | déclaré | 2024-02-03 | Aucune position codée |
| Bernard Cazeneuve | La Convention | déclaré | 2026-07-16 | Aucune position codée |
| Ségolène Royal | Parti Socialiste | déclarée | 2026-05-24 | Aucune position codée |
| Dominique de Villepin | La France humaniste | **pressenti** | — | Non déclaré, aucune position codée |

Elles apparaissent dans un bloc « Suivis, pas encore comparables » sur la page de l'élection.

**La règle qui a guidé ce choix** : mieux vaut une absence assumée qu'un score inventé.
Leur écrire huit nombres pour « compléter la liste » aurait reproduit, en pire, le défaut
reproché aux profils existants.

---

## Amorce réelle (2026-08-09, après contre-audit)

Le contre-audit relevait à juste titre que `statusSource` était du texte libre : lisible, mais
ni vérifiable ni exploitable par un programme. Deux briques ont été ajoutées dans
`src/data/candidateProvenance.js` :

- **`SOURCE_DOCUMENTS`** — URL canonique, éditeur, niveau de source (`primary_official`,
  `institutional`, `polling_authority`, `press`, `tertiary`), langue, `publishedAt`,
  `discoveredAt`, `verifiedAt`, statut. `verifiedAt: null` signale une source référencée mais
  **jamais ouverte et confirmée** — c'est le cas du programme de Lisnard à ce jour.
- **`CANDIDATE_POSITIONS`** — une entrée par (candidat, question), avec `stance`, `sourceIds`,
  `excerpt`, `reasoning`, `evidenceType`, `confidence`, `reviewStatus`, `codedBy`, `reviewedBy`.

`candidateRegistry.js` porte désormais `statusSourceIds` à côté de `statusSource`, pour que la
veille puisse détecter une source périmée ou contredite.

### Ce qui est amorcé pour David Lisnard

Les **17 questions de `fr_2027`** existent comme entrées de travail : `stance: null`,
`reviewStatus: 'to_review'`, document programmatique rattaché. **Aucune valeur n'est devinée.**
`positionCoverage('david-lisnard')` renvoie donc `0/17`, et il reste hors classement.

C'est une file de revue, pas une donnée. Remplir `stance`, `excerpt`, `reasoning` et faire
relire est le prochain travail éditorial — il n'a pas été fait ici, faute de pouvoir lire et
citer le programme dans cet environnement.

## Cible — comment une position devrait être établie

L'unité de donnée n'est pas `candidate.profile.ECONOMY = 63`. C'est une suite de positions
question par question, sourcées et versionnées, dont le score thématique est un agrégat
reproductible.

Chaque position devrait porter :

- URL et document source, éditeur, date de publication, date de l'événement, date de vérification ;
- extrait probant (25 mots maximum, droit d'auteur) ;
- type de preuve : programme · vote · discours · interview · inférence ;
- confiance ;
- validité temporelle et, en cas de revirement, la position qu'elle remplace ;
- auteur du codage et relecteur ;
- statut de revue.

### Règles de codage

- Mapper la déclaration vers une **question concrète**. Aucune correspondance ⇒ ne rien coder.
- `stance` ∈ {-2, -1, 0, +1, +2}. Absence ⇒ `null`, **jamais 0**.
- Ne jamais déduire une position depuis le parti.
- Une mesure de programme officiel suffit ; une déclaration rapportée exige le document
  intégral ou deux sources concordantes.
- Un revirement crée un événement, il n'écrase rien.
- Toute position qui affecte un score exige une validation humaine.

### Seuils proposés (à tester, pas à appliquer aveuglément)

- pas de publication d'un score thématique sans un minimum de positions indépendantes et
  réparties dans le thème ;
- pas d'inclusion au classement sous 70 % de couverture pertinente ;
- couverture et date affichées dans tous les cas.

Ces seuils devront être figés et versionnés une fois éprouvés.

---

## Migration de l'existant

Les profils actuels sont importés comme `legacy-manual-v1`. **Aucune provenance rétroactive
ne leur est inventée.** Chaque nombre historique non justifié constitue une entrée de la file
de revue éditoriale.

Tant qu'un profil reste `legacy`, l'interface ne doit pas laisser croire à une précision
qu'il n'a pas.
