# Runbook — audit du Supabase de production

**Statut : BLOQUÉ.** Rédigé le 2026-08-09 mais **jamais exécuté** : le projet Supabase relié
à `poliscop.org` n'était pas accessible depuis l'environnement de travail (le projet
`xjpzqaqzoygcwtcpumfo` expire sur chaque appel, et aucun projet Poliscop n'apparaît dans la
connexion disponible).

**Conséquence à énoncer sans détour** : personne ne sait aujourd'hui quelles politiques RLS,
quels GRANT et quelle génération de schéma sont réellement déployés en production. Tant que
ce runbook n'a pas été exécuté, aucune affirmation de sécurité côté base ne peut être faite.

---

## 0. Prérequis

- Accès propriétaire au projet Supabase servant `poliscop.org`.
- La clé `service_role` ne quitte jamais un navigateur ni un fichier du dépôt.
- Un compte de test **non administrateur** et deux sessions anonymes distinctes.

## 1. Identifier le projet réel

```sql
select current_database(), version();
```

Comparer l'URL du projet avec `VITE_SUPABASE_URL` du déploiement Vercel de production.
Consigner l'identifiant de projet ici une fois vérifié : `__________`.

## 2. Inventaire AVANT toute modification

Cet inventaire est la **base de retour arrière**. L'archiver hors du dépôt.

```sql
-- a) Migrations réellement appliquées
select * from supabase_migrations.schema_migrations order by version;

-- b) Tables, RLS activée ou non
select c.relname,
       c.relrowsecurity  as rls_enabled,
       c.relforcerowsecurity as rls_forced
from pg_class c join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public' and c.relkind = 'r'
order by c.relname;

-- c) Policies
select schemaname, tablename, policyname, cmd, roles, qual, with_check
from pg_policies where schemaname = 'public' order by tablename, policyname;

-- d) Fonctions, SECURITY DEFINER, search_path
select p.oid::regprocedure as signature, p.prosecdef as security_definer, p.proconfig
from pg_proc p join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public' order by 1;

-- e) Ce que anon peut exécuter — le point le plus important
select p.oid::regprocedure
from pg_proc p join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public' and has_function_privilege('anon', p.oid, 'execute');

-- f) Droits de table par rôle
select grantee, table_name, privilege_type
from information_schema.role_table_grants
where table_schema = 'public' and grantee in ('anon','authenticated','public')
order by table_name, grantee;

-- g) Vues (elles peuvent contourner la RLS selon leur configuration)
select c.relname, c.reloptions
from pg_class c join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public' and c.relkind = 'v';
```

Lancer aussi les **advisors** Supabase (sécurité + performance) et archiver le rapport.

## 3. Tests d'accès croisés

À exécuter avec la clé publique (`anon`) puis avec un compte connecté non administrateur :

| # | Test | Attendu |
|---|---|---|
| 1 | `select * from public.admin_users` | refusé dans les deux cas |
| 2 | `select public.founder_get_growth()` en anon | refusé |
| 3 | idem avec un compte connecté non admin | erreur `42501 not_authorized` |
| 4 | lire les `user_answers` d'un autre utilisateur | 0 ligne |
| 5 | `update` d'une ligne `user_consents` d'autrui | refusé |
| 6 | insérer 10 000 lignes dans `events` en anon | doit être limité (rate limit / quota) |
| 7 | lire `anonymous_answers` d'un autre `anonymous_id` | 0 ligne |

> Rappel PostgreSQL : une policy `UPDATE` sans policy `SELECT` cohérente donne souvent un
> résultat contre-intuitif. Tester les deux, pas seulement l'écriture.

## 4. Écart dépôt ↔ production

Confronter l'inventaire de l'étape 2 avec les fichiers `supabase/schema*.sql`. Produire une
matrice : objet · état production · état attendu · action · ordre de déploiement · retour arrière.

**Point connu** : le frontend écrit dans `user_answers` (sans `question_version`) et
`user_consents`, alors que `schema_v6_data_platform.sql` attend `question_version`,
`consent_events` et `response_events`. **Déployer la v6 seule casserait la production.**
Utiliser une migration expand/contract : ajouter les nouvelles structures → écrire dans les
deux → backfill contrôlé → lire les nouvelles → vérifier → retirer l'ancien chemin plus tard.

## 5. Appliquer le durcissement

1. Sauvegarde complète, restauration testée sur une branche Supabase.
2. Appliquer `supabase/migrations/20260809120000_admin_authorization.sql`.
   Elle **vérifie ses préconditions avant toute mutation** et échoue avec un diagnostic clair
   si la production contient des fonctions `founder_*` inconnues du dépôt. Elle renomme chaque
   implémentation en `founder_impl_*` puis crée un wrapper portant le contrôle d'autorisation :
   aucun corps de fonction n'est réécrit à la main.

   Elle a été testée sur un cluster Postgres 16 jetable (11 assertions, idempotence, rollback) :

   ```bash
   ./supabase/tests/run-migration-tests.sh
   ```

   ⚠ `supabase/schema_v7_admin_security.sql` est OBSOLÈTE et ne doit pas être exécuté :
   il révoquait les droits puis exigeait un garde qu'il n'ajoutait jamais, et échouait donc
   systématiquement en annulant toute la transaction.
3. Insérer les administrateurs :
   ```sql
   insert into public.admin_users (user_id, role, note)
   values ('<uuid du compte fondateur>', 'founder', 'ajouté le <date> par <personne>');
   ```
4. Rejouer intégralement l'étape 3.
5. Rejouer les advisors : plus aucune alerte critique attendue.

## 6. Après application

- Activer la MFA sur les comptes administrateurs.
- Définir une durée de conservation par table et une purge planifiée.
- Vérifier qu'aucune clé `service_role` n'est présente dans un bundle frontend ou une
  variable d'environnement exposée au navigateur (`VITE_*`).
- Documenter export et suppression des données utilisateur.
- Faire valider l'analyse d'impact (AIPD) par un professionnel : les opinions politiques
  relèvent de l'article 9 du RGPD. **Ce runbook est technique et ne remplace pas un avis
  juridique.**

## 7. Retour arrière

```bash
psql "$DATABASE_URL" -f supabase/migrations/20260809120000_admin_authorization_rollback.sql
```

Le rollback restaure les neuf fonctions sous leur nom public et leurs droits d'origine, et
supprime les prédicats d'autorisation. ⚠ **Après rollback, les agrégats redeviennent appelables
par `anon`** : ne l'utiliser que pour restaurer un service pendant un incident, et refermer
ensuite. `admin_users` est conservée (la supprimer ferait perdre la liste des administrateurs).

Le tableau de bord refusera l'accès (`rpc_unavailable`) tant que la fonction n'existe pas :
c'est le comportement voulu, pas une panne.
