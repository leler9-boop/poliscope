# Connexion à la production — état réel et opérations bloquées

**Établi le 2026-08-10, par vérification directe.** Ce document remplace, sur ce point, la
mémoire de projet antérieure : elle désignait `xjpzqaqzoygcwtcpumfo` comme la production.
**C'est faux.**

---

## 1. Trois projets, et une confusion à lever

| Ref | Nom | Dans le compte MCP | Joignable | Rôle réel |
|---|---|---|---|---|
| `gpvqsftyrninbwzhkaed` | inconnu | ❌ **non** | ✅ **oui** (HTTP 401) | **C'est la production** — c'est ce que le `.env` et le bundle utilisent |
| `xjpzqaqzoygcwtcpumfo` | Poliscope v1 *(nom exact du projet Supabase ; brand-check:allow)* | ✅ oui | ❌ non (DNS/connexion échoue) | ancien projet, `INACTIVE` |
| `bcdwqujiektuvysmhoxn` | arnaud-claude-memory | ✅ oui | — | sans rapport avec l'application |

### Comment cela a été établi

```bash
# Le projet réellement utilisé par l'application
grep VITE_SUPABASE_URL .env
# → https://gpvqsftyrninbwzhkaed.supabase.co

# Confirmé dans le bundle produit : la clé embarquée porte role=anon, ref=gpvqsftyrninbwzhkaed
npm run build && grep -o 'eyJhbGciOi[A-Za-z0-9_.-]*' dist/assets/index-*.js

# Liveness des deux candidats
curl -s -o /dev/null -w "%{http_code}\n" https://gpvqsftyrninbwzhkaed.supabase.co/rest/v1/   # → 401 : VIVANT
curl -s -o /dev/null -w "%{http_code}\n" https://xjpzqaqzoygcwtcpumfo.supabase.co/rest/v1/   # → 000 : INJOIGNABLE
```

Un `401` signifie que PostgREST répond et réclame une clé : le projet tourne. Un `000` signifie
que la connexion n'aboutit pas.

La clé embarquée dans le bundle porte bien `"role": "anon"` — **aucune clé de service ne fuit
côté client**, ce qui est le point critique. Elle pointe simplement vers un projet que le compte
Supabase connecté à cette session ne voit pas.

---

## 2. Ce qui est donc bloqué

Les tools Supabase de cette session s'authentifient sur un compte qui **ne contient pas**
`gpvqsftyrninbwzhkaed`. Les opérations suivantes, demandées par la mission, **n'ont pas pu être
réalisées** :

| Opération | Pourquoi elle est bloquée |
|---|---|
| Lister les migrations réellement appliquées | Nécessite l'API de gestion sur ce ref |
| Inventorier tables, colonnes, fonctions, vues, policies, privilèges | Idem |
| Lancer les advisors sécurité et performance | Idem |
| Comparer production ↔ dépôt | Découle des trois précédentes |
| Créer une sauvegarde | Idem |
| Appliquer sur une branche Supabase / un environnement de préproduction | Idem |
| Préparer la migration de production | Interdit tant que l'inventaire n'est pas fait |

**Aucune écriture n'a été tentée sur aucun projet.** La seule requête émise vers
`gpvqsftyrninbwzhkaed` a été la sonde de disponibilité ci-dessus, sans clé et sans lecture de
données.

Un inventaire partiel serait possible en interrogeant la production avec la clé `anon` présente
dans `.env` — cela révélerait ce qu'un visiteur anonyme peut lire, ce qui est en soi une donnée
de sécurité utile. **Cela n'a pas été fait** : la consigne était de ne pas toucher à la
production tant qu'elle n'est pas correctement connectée. C'est une décision à prendre
explicitement, pas à supposer.

---

## 3. Débloquer — deux options

**Option A (recommandée)** — donner à la session l'accès au bon projet : connecter le compte
Supabase propriétaire de `gpvqsftyrninbwzhkaed`, ou inviter le compte actuel comme membre de son
organisation. L'inventaire complet devient alors possible en quelques minutes.

**Option B** — exécuter l'inventaire soi-même et fournir les sorties. Requêtes en lecture seule,
dans l'éditeur SQL du projet :

```sql
-- Migrations réellement appliquées
select version, name from supabase_migrations.schema_migrations order by version;

-- Tables et RLS
select n.nspname, c.relname, c.relrowsecurity, c.relforcerowsecurity
  from pg_class c join pg_namespace n on n.oid = c.relnamespace
 where c.relkind = 'r' and n.nspname in ('public','private')
 order by 1, 2;

-- Policies
select schemaname, tablename, policyname, cmd, roles
  from pg_policies where schemaname in ('public','private') order by 1, 2;

-- ⚠ LE PLUS IMPORTANT : ce que `anon` peut exécuter
select p.oid::regprocedure::text as signature, p.prosecdef as security_definer
  from pg_proc p join pg_namespace n on n.oid = p.pronamespace
 where n.nspname = 'public' and has_function_privilege('anon', p.oid, 'execute')
 order by 1;
```

La dernière requête est prioritaire : l'audit de 2026-08-09 avait établi que **neuf RPC
`founder_*` étaient exécutables par `anon`** en production. La migration qui corrige cela
(`20260809120000_admin_authorization.sql`) n'a jamais été appliquée. **Si ces neuf fonctions
répondent encore à `anon`, des agrégats d'opinions politiques sont lisibles publiquement,
aujourd'hui.** C'est le point à vérifier en premier, avant toute autre considération.

---

## 4. Ordre d'application, une fois l'accès obtenu

Rien ne doit être appliqué directement en production. La séquence :

1. `supabase link --project-ref gpvqsftyrninbwzhkaed`
2. `supabase migration list` — comparer à `supabase/migrations/`
3. Inventaire complet (§3) + `get_advisors` sécurité **et** performance
4. **Sauvegarde** (`supabase db dump`) — conservée hors du projet
5. `supabase branches create` → appliquer la chaîne complète sur la branche
6. `npm run test:migrations` puis les tests SQL sur la branche
7. Vérifier sur la branche : `anon` ne lit rien de `private`, les RPC `admin_*` refusent un
   compte non administrateur, `public.ingest_v1` est injoignable par un client
8. Planifier `select private.run_retention();` (pg_cron, quotidien) — sans quoi les durées de
   conservation sont **déclarées mais pas appliquées**
9. Déployer l'Edge Function avec ses secrets :
   `SUPABASE_SERVICE_ROLE_KEY`, `POLISCOP_RATE_LIMIT_SALT` (obligatoire — la fonction refuse de
   démarrer sans lui), `POLISCOP_ALLOWED_ORIGINS`
10. Seulement ensuite, préparer la migration de production

### Migrations à appliquer, dans l'ordre lexical

```
20260612_fix_rls_and_constraints.sql          (préexistante)
20260614_founder_rpc_functions.sql            (préexistante)
20260809120000_admin_authorization.sql        ⚠ jamais appliquée — corrige la fuite anon
20260809130000_profile_versions.sql           ⚠ jamais appliquée
20260810100000_data_platform_private_schema.sql   ← nouvelles
20260810110000_ingest_api.sql
20260810120000_editorial_candidates.sql
20260810130000_retention_and_purge.sql
20260810140000_admin_dashboard_api.sql
20260810150000_ingest_rpc_bridge.sql
```

Toutes sont **additives** : elles créent des schémas, tables et fonctions nouveaux. Aucune ne
modifie ni ne supprime une table existante (`user_answers`, `user_profiles`, `events`…). Le
frontend actuel continue donc de fonctionner pendant et après leur application — c'est la
condition qui rend un déploiement progressif possible.

⚠ `schema_v6_data_platform.sql` et `schema_v7_admin_security.sql` restent **obsolètes** : ne pas
les exécuter. Ils sont remplacés par les migrations ci-dessus.
