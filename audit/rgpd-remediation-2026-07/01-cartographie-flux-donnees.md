# 01 — Cartographie ciblée du flux de données politiques

Cartographie limitée aux fichiers effectivement impliqués dans le flux de réponses (pas un audit complet du repository) : `src/lib/supabase.js`, `src/lib/anonymous.js`, `src/lib/analytics.js`, `src/lib/auth.jsx`, `src/store/useStore.js`, `src/pages/Questionnaire.jsx`, `src/pages/FounderDashboard.jsx` (accès), `supabase/schema*.sql` (4 fichiers), `supabase/INTELLIGENCE_AUDIT_V2.md` (audit interne de l'équipe, 2026-06-14).

## Constat principal

**Chaque réponse au questionnaire déclenche, dès qu'une réponse est donnée, jusqu'à 3 écritures distinctes vers Supabase — sans aucune vérification de consentement, dans le code actuel.** Ce n'est pas seulement l'écriture de sauvegarde de profil déjà identifiée par l'audit précédent (POL-AUDIT-043) : une deuxième voie, la voie « analytics », transmet également la valeur exacte de chaque réponse politique (1 à 5) à une table `events`, indépendamment de toute intention de sauvegarde de la part de l'utilisateur.

## Réponses aux 11 questions posées

**1. Quelles réponses sont enregistrées localement ?**
Toutes. `useStore.js` (Zustand + middleware `persist`) écrit `answers` (`{questionId: value}`), `profile` calculé, `profileLastUpdated`, `priorityOrder`, `electionAnswers`, `profileAdjustments`, `themeWeights` dans `localStorage` sous la clé `poliscop_state`, pour 100 % des utilisateurs (avec ou sans compte, avec ou sans Supabase configuré). C'est la seule couche qui fonctionne toujours, y compris hors-ligne.

**2. Quelles réponses sont envoyées à Supabase ?**
- La réponse individuelle à **chaque question** (`question_id`, `answer_value` 1–5) — voie « sauvegarde ».
- Le **profil calculé** complet (`theme_scores` par les 8 thèmes, `axes` à 4 dimensions, `confidence`, `answered_count`) — voie « sauvegarde », uniquement si connecté.
- La réponse individuelle à **chaque question, une deuxième fois**, via la voie « analytics » : `question_id`, `theme`, `value` (1–5), `question_index`, `mode`, `is_improve` — table `events`, event `question_answered`. **Cette deuxième voie fonctionne que l'utilisateur ait ou non l'intention de sauvegarder son profil.**
- L'archétype et le candidat le mieux aligné (`archetype_id`, `top_candidate_id`, `top_candidate_alignment`) — dérivés du profil, eux aussi une donnée politique interprétable.
- Les données démographiques optionnelles (genre, tranche d'âge, type de commune, statut professionnel, niveau d'études, code postal) si l'onboarding est rempli.

**3. À quel moment sont-elles envoyées ?**
Immédiatement, à chaque clic de réponse (`Questionnaire.jsx:handleAnswer` → `answerQuestion()` dans `useStore.js` → écriture Supabase synchrone dans le même tick, plus l'appel `trackQuestionAnswered()` séparé, également synchrone). Aucun différé, aucun groupement, aucune confirmation préalable. Idem à la connexion (fusion des réponses anonymes + synchronisation complète du profil cloud, voir point 9).

**4. Rattachées à un compte ou non ?**
Les deux cas existent et sont traités différemment côté table, mais **aucun des deux n'est actuellement conditionné à un consentement** :
- Utilisateur non connecté → table `anonymous_answers`, clé `anonymous_id` (UUID généré côté client, voir point 5).
- Utilisateur connecté → table `user_answers` + `user_profiles`, clé `user_id` (identifiant Supabase Auth, donc une personne identifiée au sens RGPD).
- À la connexion, `mergeAnonymousAnswers()` déplace les lignes `anonymous_answers` vers `user_answers` (clé `anonymous_id` → `user_id`) et supprime les lignes anonymes — un utilisateur qui répond en anonyme puis se connecte voit ses réponses automatiquement rattachées à son compte, sans étape de confirmation intermédiaire.

**5. Quels identifiants techniques sont enregistrés ?**
- `anonymous_id` : UUID v4 généré par `crypto.randomUUID()`, stocké dans `localStorage` (`poliscop_anon_id`), **stable indéfiniment sur le même appareil/navigateur** (jamais renouvelé automatiquement). C'est un identifiant pseudonyme persistant, pas un identifiant de session.
- `user_id` : UUID Supabase Auth, directement lié à l'email du compte (`auth.users`).
- Aucun cookie tiers, aucun identifiant publicitaire détecté dans le code applicatif.

**6. Quelles métadonnées accompagnent les réponses ?**
- `anonymous_sessions` : `device` (chaîne `navigator.userAgent` **complète, non résumée**), `lang` (`navigator.language`), `last_seen_at`. Écrit une seule fois par appareil (`INSERT ... ignoreDuplicates`), à chaque chargement de l'app.
- `events` : `anonymous_id` ou `user_id`, `event_name`, `props` (JSONB — contenu variable selon l'événement, inclut la réponse politique pour `question_answered`), `created_at`.
- `user_demographics` (si rempli) : genre, tranche d'âge, type de commune, statut professionnel, niveau d'études, **code postal en clair**.
- Note : le serveur Supabase (couche infrastructure, hors code applicatif) voit nécessairement l'adresse IP de chaque requête — non stockée explicitement dans les tables applicatives observées (à l'exception d'`ip_hash`, un SHA-256, dans la table `user_consents` non encore utilisée, voir point 11), mais susceptible d'apparaître dans les logs d'infrastructure Supabase eux-mêmes, hors du contrôle direct de ce code.

**7. Combien de temps sont-elles conservées ?**
Aucune limite technique active. `schema_v2.sql` documente une commande de purge manuelle (`DELETE FROM events WHERE created_at < now() - INTERVAL '24 months'`) mais **elle n'est ni automatisée (pas de cron), ni exécutée** — c'est une instruction en commentaire, pas un mécanisme. Aucune table n'a de TTL, de tâche planifiée, ni de politique de rétention appliquée. `user_answers`, `user_profiles`, `anonymous_answers`, `events` sont donc conservées indéfiniment par défaut.

**8. Comment sont-elles supprimées ?**
- Suppression de compte (`auth.users`) → `ON DELETE CASCADE` sur `profiles`, `user_answers`, `user_profiles`, `user_demographics` (défini dans `schema.sql`) : la suppression fonctionne au niveau base de données **si** un mécanisme de suppression de compte existe côté client — **aucun bouton ou fonction de suppression de compte n'a été trouvé dans le code applicatif actuel** (`auth.jsx` n'expose ni `deleteAccount()` ni `deleteAnswers()` ni `deleteProfile()`).
- `events.user_id` a `ON DELETE SET NULL` (pas de cascade) : les événements analytiques d'un compte supprimé restent en base, seul le lien vers l'utilisateur est retiré — la donnée `question_answered` (réponse politique) survit donc à la suppression du compte.
- `anonymous_answers`/`anonymous_sessions`/`events` (voie anonyme) n'ont **aucun mécanisme de suppression** accessible à l'utilisateur : rien ne permet à un visiteur anonyme de faire effacer ses données autrement qu'en vidant lui-même son `localStorage` (ce qui ne supprime pas les lignes déjà envoyées à Supabase, puisque l'`anonymous_id` reste dans la base même si le `localStorage` est vidé).

**9. Un utilisateur anonyme peut-il être indirectement identifiable ?**
Oui, avec un niveau de confiance qui dépend de la politique RLS effectivement appliquée en base (voir le point critique ci-dessous) :
- `anonymous_id` est stable par appareil → toutes les réponses d'un même visiteur sur plusieurs sessions sont corrélables entre elles nativement.
- `anonymous_sessions.device` (user-agent complet) + `lang` constituent un fingerprint partiel.
- **Découverte critique** : la politique RLS de `anonymous_answers` (définie dans `schema.sql`, jamais corrigée dans `schema_v2/v3/v4.sql`) est `FOR ALL USING (true) WITH CHECK (true)`. Contrairement à `anonymous_sessions`, dont exactement la même faiblesse a été identifiée et corrigée dans `schema_v2.sql` (commentaire explicite : *« The original policy used USING (true) for ALL which allows cross-session reads »*, remplacée par un accès en lecture non accordé à la clé anonyme), **`anonymous_answers` n'a jamais reçu le même correctif**. En l'état de ce fichier SQL, n'importe qui disposant de la clé publique anonyme (par construction exposée dans le bundle JS servi au navigateur) peut exécuter `SELECT * FROM anonymous_answers` et lire les réponses politiques individuelles de **tous** les visiteurs anonymes, sans restriction. C'est une vraie fuite de données, pas seulement une question de traçabilité — voir Étape 2 pour la correction.

**10. Les réponses peuvent-elles être utilisées pour des statistiques ou de l'analytics ?**
Oui, et c'est une fonction délibérément construite, pas un effet de bord : `question_analytics` (table d'agrégats, `schema_v3.sql`) et des vues comme `v_archetype_by_age`, `v_candidate_distribution`, `v_archetype_distribution` (`schema_v2/v4.sql`) sont conçues pour croiser opinions politiques et démographie (ex. « les femmes sont-elles plus favorables à l'IVG ? », en-tête de `schema_v4.sql`). Ces tables/vues ne sont interrogeables qu'avec la clé `service_role` (pas exposées au client), donc pas accessibles publiquement — mais elles constituent un traitement statistique de données d'opinion politique par l'éditeur lui-même, ce qui reste un traitement RGPD nécessitant une base légale, indépendamment de qui peut le consulter.
**Incohérence relevée dans l'audit interne de l'équipe** (`INTELLIGENCE_AUDIT_V2.md`) : sa section RGPD (Phase 6) affirme que la table `events` est *« CNIL-compliant without explicit consent »* car elle ne contiendrait « no PII » ; sa propre section Phase 7, écrite dans le même document, qualifie pourtant l'événement `question_answered` de *« **CRITICAL** — Per-question political distribution »*. Les deux affirmations ne sont pas compatibles : un événement dont la valeur (la réponse politique elle-même) sert explicitement à une analyse politique individuelle n'est pas un événement anonyme « sans PII » au sens de l'Article 9. C'est exactement l'angle mort que ce chantier doit corriger.

**11. Quels fichiers et tables interviennent ?**
Fichiers : `src/lib/supabase.js`, `src/lib/anonymous.js`, `src/lib/analytics.js`, `src/lib/auth.jsx`, `src/store/useStore.js` (fonction `answerQuestion`), `src/pages/Questionnaire.jsx` (`handleAnswer`/`handleSkip`).
Tables (base, `schema.sql`) : `profiles` (legacy), `user_answers`, `user_profiles`, `user_demographics`, `anonymous_sessions`, `anonymous_answers`, `events`.
Tables (conçues mais **jamais appelées depuis le code applicatif** — confirmé par recherche exhaustive dans `src/`, aucune occurrence) : `user_consents` (`schema_v3.sql` — la table de consentement RGPD Article 9 déjà designée par l'équipe, jamais câblée), `quiz_sessions`, `question_analytics`.

## Point de contexte important pour la suite : migration de projet Supabase en cours

Le projet Supabase actuellement lié à ce compte (`xjpzqaqzoygcwtcpumfo`, « Poliscop v1 ») est **INACTIVE** — confirmé par une tentative de connexion en lecture seule (timeout). `INTELLIGENCE_AUDIT_V2.md` (§ « How to activate this in production ») explique pourquoi : ce projet est *« permanently paused and cannot be restored after 90 days »*, et l'équipe prévoyait de créer un nouveau projet et d'y rejouer `schema.sql` + `schema_v2.sql` + `schema_v3.sql` avant mise en production. **Aucun second projet n'existe à ce jour sur le compte connecté.**

Conséquence directe : à l'instant présent, si les variables d'environnement pointent encore vers ce projet mort, **aucune écriture Supabase ne réussit réellement** (toutes échouent silencieusement en `catch`/`.then(({error}) => console.error(...))`, sans jamais bloquer l'interface — confirmé en observant ces mêmes erreurs dans la console pendant les vérifications navigateur de la mission précédente). Cela ne réduit pas l'urgence de corriger le code : le jour où un nouveau projet actif sera configuré (migration déjà planifiée par l'équipe), le comportement actuel du code se mettrait à fonctionner immédiatement, avec exactement les mêmes lacunes de consentement. La correction doit être en place **avant** cette bascule, pas après.

## Limite de vérification

Le projet Supabase étant inactif, l'état réel des politiques RLS en production n'a pas pu être vérifié par une requête directe — cette cartographie s'appuie sur les 4 fichiers `schema*.sql` du dépôt comme meilleure source disponible, en présumant qu'ils reflètent (ou refléteront, lors de la prochaine mise en service) l'état réellement appliqué. À vérifier par une requête directe (`list_tables` avec un projet actif) si un doute subsiste au moment de la mise en production.
