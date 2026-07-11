# Résumé final — Mission RGPD, couverture thématique, fraîcheur (2026-07-11)

10 commits locaux, non poussés vers le dépôt distant (`origin`), conformément
à la consigne. Les 3 chantiers sont terminés dans l'ordre demandé.

## 1. Commits créés

**Chantier 1 — Sécurisation des données politiques et RGPD (6 commits)**
1. `c96b5b3` — Cartographie du flux de données + fermeture de l'exposition RLS sur `anonymous_answers`
2. `dc1cf04` — Mode local par défaut (suppression du chemin d'écriture `anonymous_answers`)
3. `3dac5b5` — Consentement explicite avant toute sauvegarde serveur des réponses
4. `750fcc5` — Contrôles utilisateur : retrait du consentement, suppression des données, export
5. `8f09a5c` — Rapport de tests et vérification RGPD
6. `d9d4385` — Correctif : verrouillage des données démographiques sur le même consentement (trouvé par l'audit indépendant de l'étape 5)

**Chantier 2 — Couverture thématique manquante (3 commits)**
7. `23f9eb8` — `ECO_28` + `DEM_26` (technologie/IA/gouvernance des données)
8. `1081ddc` — `SEC_25` (accountability policière)
9. `61f8169` — `SOC_27` (égalité salariale femmes-hommes)

**Chantier 3 — Maintenance factuelle (1 commit)**
10. `38cba0d` — Contrôle de fraîcheur (`sources.json` enrichi + `scripts/check-freshness.mjs`)

## 2. Flux de données — avant / après

**Avant** : jusqu'à 3 écritures Supabase indépendantes par réponse, aucune
consentie explicitement. Compte créé = déclenchait une synchronisation
automatique complète (réponses + profil) sans étape de consentement. Les
invités écrivaient leurs réponses dans `anonymous_answers`, table dont la
policy RLS permettait la lecture par quiconque détient la clé anonyme
publique. Les événements analytics porteurs d'opinion (`question_answered`,
etc.) partaient sans filtre.

**Après** : un invité (sans compte) n'a, par construction du code, plus aucun
chemin d'écriture serveur possible — `localStorage` est l'unique copie de ses
réponses. Un compte créé sans consentement explicite reste dans le même état :
aucune réponse, profil, archétype ou candidat le mieux aligné n'est envoyé au
serveur tant que l'utilisateur n'a pas explicitement accepté via `ConsentModal`
(déclenché uniquement par un clic sur « Enregistrer » ou la bannière de
migration — jamais automatiquement, jamais mêlé à l'inscription). Chaque
fonction d'écriture (`saveAnswers`, `saveUserProfile`, `saveProfileMeta`,
`saveDemographics`) vérifie individuellement le consentement avant d'agir,
en plus des points d'appel déjà filtrés côté interface — défense en
profondeur. La policy RLS de `anonymous_answers` a été corrigée dans
`schema_v5_privacy.sql` (non appliquée à une base réelle — le projet Supabase
lié au dépôt est injoignable, voir limite ci-dessous).

## 3. Éléments RGPD implémentés

- Consentement explicite, spécifique, non pré-coché, dissocié de la création
  de compte (article 9 RGPD — opinions politiques).
- Retrait du consentement en un clic (`DataControlsModal`), sans supprimer les
  données déjà stockées (action distincte, plus radicale).
- Suppression des données en ligne (réponses, profil, données démographiques)
  sur demande, avec explication claire des conséquences avant confirmation.
- Export des données (fonctionnalité déjà existante, mise en avant dans le
  nouveau panneau de confidentialité).
- Traçabilité du consentement côté serveur (`user_consents`), synchronisée
  entre appareils à la connexion.
- Base légale corrigée dans la politique de confidentialité publique
  (`Privacy.jsx`) : consentement explicite (art. 9.2.a), pas intérêt légitime,
  pour tout traitement lié aux opinions politiques — avec un bandeau
  signalant que cette mise à jour n'a pas encore été validée par un
  professionnel du droit.
- Suppression de plusieurs affirmations de confidentialité inexactes
  (« tout est anonymisé ») répétées à trois endroits différents de
  l'interface, remplacées par des formulations exactes et conditionnelles.

## 4. Limitations nécessitant une validation juridique professionnelle

Explicitement signalées comme provisoires, non tranchées ici :
- La base légale reformulée dans `Privacy.jsx` (art. 9.2.a vs intérêt
  légitime) — juridiquement cohérente sur le principe, mais jamais relue par
  un professionnel du droit.
- L'absence de preuve cryptographique de propriété d'un `anonymous_id` côté
  RLS (limite technique documentée dans `schema_v5_privacy.sql`) — une
  attaque ciblée connaissant déjà un identifiant précis reste possible en
  théorie sur `UPDATE`/`DELETE`.
- La suppression complète du compte Supabase Auth (email/identifiants) reste
  hors de portée du code client (nécessite une clé `service_role` absente de
  cette architecture) — les utilisateurs sont orientés vers un email de
  contact, un traitement manuel, pas un vrai self-service.
- Le traitement des données déjà stockées avant ce correctif (« legacy ») —
  deux options documentées dans `schema_v5_privacy.sql` (redemander le
  consentement vs. purger), volontairement non tranchées, la décision
  n'étant pas purement technique.

## 5. Questions ajoutées ou écartées

**4 questions ajoutées**, chacune vérifiée contre l'intégralité du corpus
pour éviter les doublons, chacune dans un commit séparé :
- `ECO_28` (PRIMARY) — régulation de l'intelligence artificielle
- `DEM_26` (PRIMARY) — transparence des algorithmes publics (Parcoursup, CAF)
- `SEC_25` (CORE) — enquête indépendante sur l'usage excessif de la force policière
- `SOC_27` (CORE) — sanctions financières pour écarts de salaire femmes-hommes

**Candidates délibérément écartées** (nombre minimal, pas les 6 IA proposées
par l'audit précédent) : labeling des contenus IA (faible pouvoir
discriminant une fois la régulation générale couverte), souveraineté
numérique européenne (se réduit à l'axe souveraineté déjà couvert par
GLO_11/GLO_16), taxe automatisation/robots (se réduit à l'axe redistribution
déjà couvert par ECO_1/ECO_25/PUB_13), consentement données privées pour
IA (jugée la plus « coupable » par sa propre recherche, abandonnée pour
tenir le compte à 2 plutôt que 3 sur ce sujet), congé paternité égalisé
(axe trop corrélé avec SOC_27 pour ajouter un signal réellement distinct).

## 6. Contrôles de fraîcheur créés

`scripts/check-freshness.mjs` (nouveau) + `sources.json` enrichi de deux
champs (`freshnessCategory`, `nextCheckDue`/`nextCheckRule`) sur ses 31
entrées existantes, plus 4 nouvelles pour les questions du Chantier 2.
Détecté et corrigé en conditions réelles dès sa première exécution : `ECO_28`
était déjà légèrement obsolète au moment de l'écrire (report de calendrier
européen). Détail complet : `03-controle-fraicheur.md`.

## 7. Tests et résultats de build

Exécutés après chaque commit de contenu (10 fois au total) :
- `npm run build` : succès à chaque fois, seul avertissement pré-existant
  (chunk principal > 500 kB, sans lien avec ce travail).
- Les 4 tests de régression existants (déterminisme, indépendance à l'ordre
  des clés, protection poids nuls, monotonie) : PASS à chaque exécution.
- `scripts/lint-questions.mjs` : propre sur les 4 nouvelles questions après
  un correctif de formulation (DEM_26 : faux positif type "ou"-liste
  d'exemples, corrigé par précaution malgré un précédent accepté SOC_26).
- Vérification navigateur en direct pour chaque changement observable :
  parcours invité testé de bout en bout plusieurs fois (aucune régression),
  nouvelles questions confirmées atteignables via le vrai moteur de tirage
  de quiz, `ECO_28` corrigée confirmée chargée correctement par l'app réelle.
- **Limite assumée** : le parcours compte-avec-consentement/retrait/
  suppression n'a pas pu être testé de bout en bout contre un vrai backend —
  le projet Supabase lié à ce dépôt est injoignable pendant toute la durée de
  cette session (confirmé, pas supposé). Vérifié par relecture de code
  ciblée à la place ; à revérifier en conditions réelles dès qu'un projet
  actif est disponible, avant toute mise en production.

## 8. Points bloquants restants avant une bêta publique

Par ordre de priorité :
1. **Le projet Supabase lié au dépôt est inactif.** Aucun des correctifs
   RGPD de ce chantier n'a pu être appliqué à une base réelle ni vérifié en
   conditions live — uniquement par relecture de code. C'est le blocage
   principal : appliquer `schema.sql` → `v2` → `v3` → `v4` → `v5` (dans
   l'ordre) sur le prochain projet actif, puis reproduire tous les tests de
   parcours de l'Étape 5 en conditions réelles, avant toute mise en
   production.
2. Validation juridique professionnelle des points listés en § 4 — non
   négociable avant une bêta destinée à un public réel, vu la nature
   sensible des données traitées (opinions politiques).
3. Décision produit sur le traitement des données déjà stockées avant ce
   correctif (§ 4, dernier point) — nécessite un arbitrage humain, pas
   seulement technique.
4. `mergeAnonymousAnswers()` est désormais fonctionnellement morte pour
   toute nouvelle session anonyme (le chemin d'écriture qu'elle lit a été
   supprimé à l'Étape 2) — sans danger à laisser en l'état, mais à nettoyer
   dans une passe de code future.
5. Trois tâches de suivi indépendantes ont été signalées séparément pendant
   ce travail (visibles comme suggestions dans l'interface) : sécurité du
   tableau de bord fondateur (PIN faible protégeant potentiellement des
   agrégats croisant démographie et opinions politiques), absence totale
   d'accès mobile aux actions secondaires de la page profil (y compris les
   nouveaux contrôles RGPD), et un bug de mélange des questions CORE qui
   rend certains modes de quiz déterministes plutôt qu'aléatoires. Aucune
   n'est bloquante pour une bêta, mais la première mérite un examen avant
   un lancement public élargi.
6. Profil manquant pour le Premier ministre actuel (Sébastien Lecornu) dans
   les fiches de personnalités — signalé séparément, pas bloquant.
