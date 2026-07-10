# Progress log — Poliscope full audit

## Phase 1 — Cartographie ✅ TERMINÉE (2026-07-10)

**Fichiers examinés** : `CLAUDE.md`, `DEPLOYMENT.md`, `package.json`, arborescence complète (`find`), `knowledge-base/*.md` (7 fichiers), `supabase/INTELLIGENCE_AUDIT.md` + `INTELLIGENCE_AUDIT_V2.md`, `src/App.jsx`, `src/lib/router.js`, `src/store/useStore.js`, `src/engine/scorer.js`, `src/engine/matcher.js`, `src/engine/profileSummary.js`, `src/engine/archetypeEngine.js`, têtes de fichiers (`head`/`grep`) de `questions.js`, `questions_final.json`, `elections.js`, `candidateDetails.js`, `candidatePolicies.js`, `frenchFigures.js`, `historicalFigures.js`, `archetypes.js`, `ideologicalCurrents.js`.

**Constats majeurs** :
- Documentation projet (`CLAUDE.md`, `DEPLOYMENT.md`) substantiellement périmée (routing, nombre de questions, modes de quiz).
- Donnée électorale critique probablement obsolète : verdict d'appel Le Pen attendu 2026-07-07, audit exécuté 2026-07-10 (voir `elections.js`).
- Absence confirmée (par `grep`) de consentement RGPD Art. 9, malgré alerte interne du 2026-06-14 (`INTELLIGENCE_AUDIT_V2.md`).
- `MEMORY.md` de session précédente est partiellement périmée (exposant matcher 2.8→2.4 réel ; ancien modèle « extreme penalty » remplacé par un veto multiplicatif à 5 seuils).
- Deux audits internes déjà réalisés (analytics/RGPD) — non dupliqués, cités comme source.
- `notebooklm-py/` (dépôt git imbriqué) et artefacts de build égarés à la racine — hors périmètre, hygiène seulement.

**Incertitudes documentées** : statut actuel (actif/suspendu) du projet Supabase non re-vérifié en direct (pas d'accès MCP autorisé) ; traité comme risque documenté, pas comme fait confirmé.

**Recherches externes évitées à ce stade** : aucune recherche web effectuée pendant la cartographie — réservée à la Phase 7 (Subagent 3), sur les faits à forte volatilité uniquement.

**Prochaine phase** : lancement des Subagents 1 (code/architecture) + 2 (scoring/matching) en parallèle.

---

## Phase 2+5+6 — Subagents 1+2 ✅ TERMINÉE (2026-07-10)

**Subagent 1 (code-and-architecture)** — 8 constats, dont 1 CRITIQUE : la fusion invité→compte ne met jamais à jour `user_profiles.answered_count` (`src/lib/anonymous.js:38-59`, `src/lib/auth.jsx:44-52,103-114`), cassant la synchro multi-appareil — un utilisateur peut voir un quiz vierge alors que ses réponses existent en base. Autres constats notables : migration de clé localStorage à risque de perte silencieuse (F2, élevé) ; `SyncConflictModal` ne fusionne pas les réponses distantes uniques (F3, moyen) ; `startRefinement` ne répartit pas les questions par thème (F4, moyen) ; commentaire de code trompeur dans `auth.jsx` sur une colonne `updated_at` qui existe pourtant. Confirmé : pas de perte/double-comptage de réponse, ordre des questions sans effet sur le score, retour arrière sûr, `Math.random()` n'affecte que la sélection de questions en mode improve, jamais le calcul du profil.

**Subagent 2 (scoring-and-matchmaking)** — constat le plus grave de tout l'audit à ce stade : **`src/data/ideologicalCurrents.js:298`** — le courant « Conservatisme national » a `GLOBAL: 85` (très pro-UE) alors que sa description et ses `keyBeliefs` sont explicitement souverainistes/anti-mondialistes ; preuve chiffrée : un utilisateur europhile matche à 96% avec ce courant contre 78% pour un utilisateur réellement souverainiste — **le système recommande le mauvais courant politique**. Sévérité **critique**, confiance high. Autres constats élevés : inversion de signe GLOBAL sur 3 curseurs de `refinementThemes.js` (les curseurs bougent le score dans le sens inverse de l'intention) ; GLOBAL absent des thèmes vétoïsés (un utilisateur anti-UE peut afficher « Forte compatibilité » avec une figure pro-UE malgré un désaccord quasi maximal) ; biais d'ordre implicite quand aucune priorité n'est fournie (jusqu'à 13 points d'écart selon la position d'un thème dans un tableau). Vérification structurelle automatisée sur la **totalité** des 170 profils de référence (pas un échantillon) : 100% structurellement valides. 12/15 profils synthétiques obtiennent le match attendu ; 2/15 révèlent un trou de couverture (souverainisme modéré non-extrême absent des archétypes, confondu avec l'extrême droite) ; comportement correct confirmé pour un profil hétérogène (pas de faux match fort). Bon point : le veto lissé ne produit aucun saut brutal au franchissement de seuil.

**Incertitudes/limites documentées** : Agent 1 a consulté 2 fichiers hors périmètre initial (`schema.sql`, `schema_v2.sql`) pour étayer un constat, justifié explicitement. Agent 2 n'a pas pu vérifier l'usage réel de `refinementThemes.js` côté composant React (hors périmètre) — l'inversion de signe est confirmée au niveau des données, pas encore au niveau de l'effet UI final.

**Prochaine phase** : lancement des Subagents 3 (factuel politique) + 4 (questions/biais/tests) en parallèle.

---

## Phase 7+3+4+8+9 — Subagents 3+4 ✅ TERMINÉE (2026-07-10)

**Subagent 3 (political-content-and-factuality)** — confirme et **inverse** le constat de départ : le verdict d'appel Le Pen du 7 juillet 2026 a bien eu lieu, la condamnation est confirmée mais la peine d'inéligibilité est réduite à 15 mois fermes, **déjà purgés au 30 juin 2026 → Marine Le Pen est éligible en 2027**, contrairement à ce qu'affiche `elections.js` à 7 emplacements distincts (dont un badge de statut de candidature visible en UI, `candidacyStatus: 'ineligible'`). Incohérence interne préexistante EN/FR également détectée. Second constat majeur : le vrai Premier ministre (Sébastien Lecornu, en poste depuis le 10/09/2025) est totalement absent de `frenchFigures.js`, qui affiche toujours Bayrou (démissionnaire) comme actuel. Bonne nouvelle : aucune des ~19 personnalités internationales à risque (Berlusconi, Sunak, Scholz, etc.) n'est mal représentée — toutes correctement cantonnées à des blocs d'élections historiques déjà closes. `paris_2026` correctement présentée au passé mais sans le résultat final (Grégoire élu) ni 2 candidats réels (Bournazel, Knafo). 14 sources consignées dans `sources.json`.

**Subagent 4 (qa-and-adversarial-testing)** — a corrigé le brief du coordinateur : le corpus réel est de **162 questions actives** (200 brutes, 38 dupliquées), pas 158. Audit des 162 questions : 31 (19%) obtiennent ≤3/5, dominées par des questions doubles (17 cas). Trouvaille structurelle : le champ `weight` du JSON est **systématiquement écrasé** par `STATUS_WEIGHTS` et n'a donc **aucun effet réel** sur le score — piège pour tout futur éditeur de contenu. Couverture thématique : décentralisation absente à 100%, IA/données personnelles quasi absentes, égalité F/H et contrôle des violences policières présentes dans le brouillon mais disparues du corpus final sans documentation. 3 doublons sémantiques inter-thèmes non détectés par `isDuplicate` (ex. taxe mondiale minimum comptée à la fois dans ECONOMY et GLOBAL). Biais UI confirmés : taxonomie de filtre asymétrique (catégorie « extrême droite » filtrable/colorée, aucun équivalent « extrême gauche »), couleur rouge/danger unique au thème IMMIGRATION, effet de seuil (cliff effect) entre 49% et 51% de compatibilité changeant à la fois couleur et libellé. A écrit ET exécuté 4 tests Node réels dans `proposed-tests/` : déterminisme ✅, indépendance à l'ordre ✅, monotonie ✅ (108 questions testées, 0 violation), régression NaN ❌ (échec attendu, confirme par la preuve le bug déjà trouvé par l'agent 2).

**Vérification directe du coordinateur (Phase 10)** : `src/pages/Transparency.jsx` (page publique de méthodologie) est bien écrite et honnête sur l'esprit, mais contient deux inexactitudes factuelles vérifiées par lecture directe du code : (1) elle omet entièrement le système de veto multiplicatif ; (2) elle affirme *« si vous ignorez le classement des priorités, tous les sujets sont pondérés à parts égales »*, ce qui est **faux** — `useStore.js:65` initialise `priorityOrder` à l'ordre de déclaration des thèmes (`[...THEMES_ORDER]`), produisant des poids 8→1, pas des poids égaux ; (3) elle affirme que les réponses *« ne quittent jamais l'appareil sauf création de compte »*, contredit par `useStore.js:247-257` qui envoie les réponses des utilisateurs anonymes vers Supabase (`anonymous_answers`) dès que Supabase est configuré. Confirmé aussi : `generateWhyMatch()` et le badge `candidacyStatus` sont bien câblés en UI (bonnes pratiques d'explicabilité), ce qui aggrave l'impact du constat Le Pen/Bardella (badge visible, pas une donnée enfouie).

**4 subagents utilisés au total (limite respectée), 0 sous-subagent, aucune modification de fichier source (seul `audit/` et les 5 fichiers de `proposed-tests/` ont été écrits — confirmé par `git status --porcelain`).**

**Prochaine phase** : synthèse et rédaction de tous les livrables restants par le coordinateur (pas de nouveau subagent).

---

## Phases 8-11 + synthèse finale ✅ TERMINÉE (2026-07-10)

Vérification directe par le coordinateur de `Transparency.jsx`/`Mission.jsx` (Phase 10) et confirmation du gap RGPD (Phase 11, déjà documenté ci-dessus). Rédaction de l'ensemble des 13 livrables restants : `02` à `10` + `00-executive-summary.md`, `issues.json` (44 constats consolidés, validé JSON, 0 doublon d'ID), `sources.json` (15 sources, validé JSON), 3 patches dans `proposed-patches/` (générés via `diff -u` sur copies temporaires plutôt qu'à la main, puis vérifiés `git apply --check` — deux tentatives initiales à la main avaient produit des patches corrompus à cause d'erreurs d'indentation/numérotation, corrigées par cette méthode plus fiable).

**Vérification finale** : `git status --porcelain` ne montre que `audit/` comme nouveau contenu — aucun fichier source du dépôt n'a été modifié à aucun moment de la mission. Mémoire de session (`MEMORY.md` + nouveau fichier `project_poliscope_full_audit_2026_07.md`) mise à jour avec les coefficients corrects du matcher et les 3 constats critiques.

**Total ressources utilisées** : 4 subagents (limite respectée), 0 sous-subagent, aucune recherche web par le coordinateur lui-même (déléguée uniquement à l'agent 3, sur les points prioritaires identifiés dès la cartographie).

**Mission terminée.**
