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

---

## Lot 1 — Remédiation technique + données politiques ✅ COMMITÉ (2026-07-11)

7 corrections techniques (POL-AUDIT-010/011/014/019/028/042/043) + corrections politiques Le Pen/Bardella/Bayrou/Paris 2026, précisées et re-vérifiées lors d'une revue pré-commit (candidature déclarée, pourvoi annoncé-non-confirmé-déposé). Détail complet : [11](11-critical-findings-review.md)–[14](14-pre-commit-review.md).

**Commit : `06bf12d`** — *fix: batch-1 remediation — scoring bugs, transparency accuracy, Le Pen/Bardella/Bayrou status* (12 fichiers).

## Lot 2 — Robustesse du moteur de matching ✅ COMMITÉ (2026-07-11)

Analyse historique (git log) + simulations (stabilité, sensibilité, impact du veto GLOBAL) sans modification de code, puis application de 3 des 4 propositions sur autorisation explicite. Détail complet : [15](15-matching-engine-robustness-lot2.md)–[16](16-lot2-application-results.md).

**Commits** :
- **`d647e0b`** — *refactor: remove dead weight field from question schema (POL-AUDIT-028)*
- **`a41eb4d`** — *fix: add GLOBAL to the multiplicative veto set (POL-AUDIT-012)*
- **`f5212a7`** — *feat: flag close 2027 candidate matches instead of overstating precision*
- **`2702e92`** — documentation du lot 2 (rapports 15-16 + config de dev)

Non appliqué (délibérément, documenté) : réduction de l'attracteur central — nécessiterait soit d'inventer des positions idéologiques pour de nouveaux archétypes, soit une refonte architecturale ; aucune substituable à un jugement humain.

**Incident** : un résultat d'outil a simulé un faux refus de permission pendant la vérification du veto GLOBAL (contredisait l'autorisation explicite déjà donnée, logique interne incohérente). Identifié comme suspect, signalé, écarté sans impact sur le travail livré — détail dans [16-lot2-application-results.md](16-lot2-application-results.md).

**16/16 vérifications réussies** (tests de régression ×4, build, vérification moteur réel, vérification navigateur réelle avec profil de test injecté).

---

## Mission suivante : audit éditorial exhaustif des 162 questions + poursuite technique — EN COURS

Nouvelle mission longue et autonome, structurée en 8 lots thématiques (économie/fiscalité/travail ; protection sociale/santé/services publics ; écologie/énergie/agriculture ; immigration/intégration/sécurité/justice ; institutions/démocratie/libertés ; Europe/international/défense ; société/éducation/culture/éthique ; technologie/données/IA). Voir les entrées ci-dessous, une par lot.

Table de synthèse cumulative (avant/après, raison, degré de changement) : [17-editorial-batches-synthesis.md](17-editorial-batches-synthesis.md), mise à jour à chaque lot. Nouvel outil `scripts/lint-questions.mjs` (signalements heuristiques bas-rappel : explication manquante/trop courte/trop longue, question trop longue, anglicismes, formulations vagues connues, etc. — ne remplace pas la revue humaine, sert de filet de sécurité anti-régression).

### Lot 1/8 — Économie, fiscalité, travail (ECONOMY) ✅ COMMITÉ (2026-07-11)

24 questions actives revues, 11 modifiées (10 éditoriales + 1 méthodologique), 13 conformes sans changement. Détail complet : [17-editorial-batches-synthesis.md](17-editorial-batches-synthesis.md#lot-18--économie-fiscalité-travail-economy).

**Commits** :
- **`e99dd0f`** — *fix: ECO_13 rewritten to avoid double negation, direction flipped to match* (bascule de polarité, committée séparément avec test de monotonie dédié)
- **`ef7aa98`** — *fix: ECONOMY batch — clarity, neutrality, and factual updates (10 questions)*

**Tests** : régression ×4 PASS (monotonie : 107 questions direction=1, 0 violation), JSON valide (200 entrées), lint ECONOMY (1 faux positif connu), build production OK. Vérification navigateur réelle sur viewport mobile 375×812 (rendu question/contexte, panneau « Comprendre cet enjeu », flux de réponse) — données de test effacées et serveur de dev arrêté après contrôle.

### Lot 2/8 — Protection sociale, santé, services publics (PUBLIC_SERVICES) ✅ COMMITÉ (2026-07-11)

20 questions actives revues, 11 modifiées (dont 3 corrigées une seconde fois après un passage du lint), 9 conformes sans changement. 5 entrées `isDuplicate` vérifiées : stubs vides, aucune action nécessaire. Recherche ciblée sur 4 chiffres potentiellement obsolètes (frais universitaires, dont une nuance importante — frais différenciés hors UE depuis un décret de mai 2026 — jusqu'ici absente ; logement social ; places de crèche) + vérification d'un chiffre déjà à jour (dépenses de protection sociale, ~32 % PIB, confirmé inchangé). 4 nouvelles sources loguées dans `sources.json`. Détail complet : [17-editorial-batches-synthesis.md](17-editorial-batches-synthesis.md#lot-28--protection-sociale-santé-services-publics-public_services).

**Commit** : **`eedb9ea`** — *fix: PUBLIC_SERVICES batch — clarity, neutrality, and factual updates (11 questions)* (pas de bascule de polarité dans ce lot).

**Tests** : régression ×4 PASS (107 questions direction=1, inchangé), JSON valide (200 entrées), lint PUBLIC_SERVICES (1 faux positif connu), build production OK. Vérification navigateur réelle : `priorityOrder` positionné sur Services publics en premier via `localStorage` (technique plus fiable que le drag-and-drop tactile), confirmant que PUB_23 (CORE, explication la plus longue du lot) s'affiche en première question et rend correctement sans troncature.

**Effet de bord noté (hors périmètre de ce lot)** : page d'accueil affiche des statistiques obsolètes (« 120+ questions », « 40 figures historiques » vs. 162/60 réels) — signalé séparément, pas corrigé ici pour ne pas interrompre le cycle éditorial.

### Lot 3/8 — Écologie, énergie, agriculture (ENVIRONMENT) ✅ COMMITÉ (2026-07-11)

18 questions actives revues, 6 modifiées, 12 conformes sans changement. 7 entrées `isDuplicate` évaluées individuellement (pas seulement leur vacuité) : 4 stubs vides, 3 (ENV_5/12/18) à texte réel jugées correctement écartées car redondantes avec des questions actives ou intrinsèquement mal formées (affirmation comparative non ancrée). ENV_8 reformulée pour un changement de fond (retrait d'une redondance avec ENV_23 + formulation présuppositionnelle) avec note méthodologique dédiée vérifiant l'absence de bascule de polarité — inclus dans le commit éditorial (pas de split nécessaire, contrairement à ECO_13). Détail complet : [17-editorial-batches-synthesis.md](17-editorial-batches-synthesis.md#lot-38--écologie-énergie-agriculture-environment).

**Commit** : **`15500b4`** — *fix: ENVIRONMENT batch — clarity, neutrality, and factual updates (6 questions)*.

**Tests** : régression ×4 PASS (107 questions direction=1, inchangé), JSON valide (200 entrées), lint ENVIRONMENT → **0 signalement** (premier lot sans résidu). Build OK. Vérification navigateur réelle allégée (ENV_24 CORE confirmé en première question sur mobile 375×812) — le pipeline de rendu ayant déjà été validé en profondeur sur 2 lots consécutifs sans anomalie, un contrôle exhaustif à chaque lot n'apporte plus d'information marginale suffisante pour son coût.

**Recherche ciblée** : 1 nouvelle source (`question_ENV_7`, assouplissement UE 2035 des moteurs thermiques, décembre 2025, confiance moyenne).

### Lot 4/8 — Immigration, intégration, sécurité, justice (IMMIGRATION + SECURITY) ✅ COMMITÉ (2026-07-11)

Le plus gros lot (38 questions actives, deux thèmes traités ensemble). 12 questions modifiées (7 IMMIGRATION + 5 SECURITY), 27 conformes sans changement, dont 2 cas limites de chevauchement thématique documentés (SEC_1/SEC_16, SEC_23/SEC_24 — nuances distinctes, conservées) et la confirmation que SEC_17/SEC_18 utilisent déjà des sentinelles `EXCLUDED_*` délibérées (peine de mort, cadrage armes à feu à l'américaine) plutôt que d'être de simples doublons. Détail complet : [17-editorial-batches-synthesis.md](17-editorial-batches-synthesis.md#lot-48--immigration-intégration-sécurité-justice-immigration--security).

**⚠️ Découverte majeure en cours de vérification** : `questionHints.js` (tooltips simplifiés) prend une priorité **totale et silencieuse** sur `explanation` dans `Questionnaire.jsx` quand une entrée existe pour l'ID. Audit complet des 22 entrées : **8 avec un sujet complètement différent** de la question actuelle (pas juste périmées — ex. PUB_4 affichait du contenu sur l'école privée pour une question désormais sur les retraites ; ENV_1/ENV_3 avaient leurs contenus inversés), **2 chiffres obsolets** sur des questions déjà corrigées dans `explanation` lors de lots précédents (**ECO_2 du lot 1 et IMM_1 de ce lot — ces corrections étaient donc invisibles pour les utilisateurs réels jusqu'à cette découverte**), et **3 entrées mortes** (pointant vers des questions `isDuplicate`, jamais servies). Corrigé dans un commit technique dédié, committé **avant** la fin de ce lot, avec un ajout au lint (`HINT_ORPHANED_*`) qui détecte mécaniquement les références vers un ID inexistant/dupliqué — mais pas la dérive de sujet, qui reste à surveiller manuellement (DEM_1/DEM_4 au lot 5, GLO_1/GLO_3 au lot 6, SOC_5/SOC_7 au lot 7).

**Commits** :
- **`c196659`** — *fix: reconcile orphaned/mismatched simplified-tooltip overrides* (bug technique, `questionHints.js`, découvert et corrigé en cours de lot, committé séparément)
- **`b1ddfb3`** — *fix: IMMIGRATION + SECURITY batch — clarity, neutrality, and factual updates (12 questions)*

**Tests** : régression ×4 PASS (107 questions direction=1, inchangé), JSON valide (200 entrées), lint IMMIGRATION (2 faux positifs confirmés), lint SECURITY (0 signalement), build OK. Vérification navigateur réelle en boucle fermée : bug `questionHints.js` découvert sur IMM_1 (250 000 affiché au lieu de 384 000 attendu), corrigé, puis re-vérifié dans le même navigateur (384 000 confirmé affiché).

**Recherche ciblée** : 5 nouvelles sources (`question_IMM_1`, `question_IMM_16`, `question_IMM_21`, `question_IMM_23`, `question_SEC_7`) — chiffres d'immigration 2025 (officiel, confiance haute), censure constitutionnelle du plafond d'immigration voté (officiel, confiance haute), entrée en vigueur du Pacte européen migration/asile le 12 juin 2026 (officiel, confiance haute), dérogation au droit du sol à Mayotte (presse, confiance moyenne), relèvement de l'objectif OTAN à 5 % du PIB (presse, confiance haute).
