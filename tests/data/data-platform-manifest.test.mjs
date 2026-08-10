// POLISCOP — Manifeste de la plateforme de données.
//
// Tests STRUCTURELS sur les fichiers eux-mêmes. Ils ne remplacent pas les tests SQL
// (`supabase/tests/data_platform.test.sql`, exécutés sur un vrai Postgres) : ils attrapent
// les régressions qui ne nécessitent pas de base — un schéma exposé par mégarde, une clé
// de service qui s'invite dans le frontend, une durée documentée qui diverge du code.
//
// Ces contrôles tournent dans `npm test`, donc sur CHAQUE PR, y compris là où Postgres
// n'est pas installé.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { RETENTION_MONTHS, PURPOSES, ALL_PURPOSES } from '../../src/lib/consent.js';

const ROOT = fileURLToPath(new URL('../..', import.meta.url)).replace(/\/$/, '');
const read = (relative) => readFileSync(join(ROOT, relative), 'utf8');

const MIGRATIONS_DIR = join(ROOT, 'supabase/migrations');
const migrationFiles = readdirSync(MIGRATIONS_DIR).filter(f => f.endsWith('.sql')).sort();
const allMigrations = migrationFiles.map(f => read(`supabase/migrations/${f}`)).join('\n');

// ─── Le schéma de collecte n'est pas exposé ─────────────────────────────────

test('config.toml n’expose PAS le schéma private à PostgREST', () => {
  const config = read('supabase/config.toml');
  const match = config.match(/^schemas\s*=\s*\[(.*)\]/m);
  assert.ok(match, 'la liste des schémas exposés est introuvable dans config.toml');

  const schemas = match[1].split(',').map(s => s.trim().replace(/["']/g, ''));
  assert.equal(schemas.includes('private'), false,
    'le schéma `private` est exposé par PostgREST : toutes les tables de collecte '
    + 'deviennent joignables en HTTP. C’est la clé de voûte du modèle, elle ne se négocie pas.');
  assert.ok(schemas.includes('public'), 'le schéma public doit rester exposé');
});

test('les tables de collecte vivent dans `private`, pas dans `public`', () => {
  const collection = ['quiz_attempts', 'quiz_responses', 'question_reports', 'consent_records'];
  for (const table of collection) {
    assert.match(allMigrations, new RegExp(`create table if not exists private\\.${table}`),
      `la table ${table} n’est pas créée dans le schéma private`);
    assert.equal(new RegExp(`create table[^;]*public\\.${table}\\b`).test(allMigrations), false,
      `la table ${table} existe aussi dans public — le modèle de confidentialité est contourné`);
  }
});

test('chaque table de collecte a RLS activée ET forcée', () => {
  // `enable` seul laisse passer le propriétaire de la table ; `force` ferme aussi ce cas.
  assert.match(allMigrations, /alter table private\.%I enable row level security/);
  assert.match(allMigrations, /alter table private\.%I force\s+row level security/);
});

// ─── Aucune clé de service côté frontend ────────────────────────────────────

test('aucune clé service_role n’est référencée dans src/', () => {
  const offenders = [];
  const walk = (dir) => {
    for (const entry of readdirSync(join(ROOT, dir), { withFileTypes: true })) {
      const relative = `${dir}/${entry.name}`;
      if (entry.isDirectory()) { walk(relative); continue; }
      if (!/\.(js|jsx|mjs|ts|tsx)$/.test(entry.name)) continue;
      const content = read(relative);
      // On cherche l'USAGE d'une clé de service, pas le mot dans un commentaire :
      // `service_role` apparaît légitimement dans la documentation interne des modules.
      if (/SERVICE_ROLE_KEY|SUPABASE_SERVICE_KEY|VITE_SUPABASE_SERVICE/.test(content)) {
        offenders.push(relative);
      }
    }
  };
  walk('src');

  assert.deepEqual(offenders, [],
    `clé de service référencée côté frontend : ${offenders.join(', ')}. `
    + 'Tout ce qui est dans src/ finit dans le bundle public.');
});

test('la clé service_role n’est lue que dans l’Edge Function', () => {
  const fn = read('supabase/functions/ingest/index.ts');
  assert.match(fn, /Deno\.env\.get\('SUPABASE_SERVICE_ROLE_KEY'\)/,
    'l’Edge Function doit lire la clé depuis son environnement');
  // Et ne jamais la renvoyer au client.
  assert.equal(/SERVICE_ROLE_KEY[^\n]*(json\(|return new Response)/.test(fn), false,
    'la clé de service apparaît dans un chemin de réponse HTTP');
});

test('aucune clé de service dans les variables d’environnement d’exemple', () => {
  if (!existsSync(join(ROOT, '.env.example'))) return;
  const example = read('.env.example');
  assert.equal(/SERVICE_ROLE/.test(example), false,
    '.env.example suggère une clé de service au développeur : elle finirait dans un .env.local '
    + 'lu par Vite, donc dans le bundle');
});

// ─── Privilèges déclarés dans les migrations ────────────────────────────────

test('toute fonction d’ingestion est révoquée de public avant d’être accordée', () => {
  const ingest = read('supabase/migrations/20260810110000_ingest_api.sql');
  const bridge = read('supabase/migrations/20260810150000_ingest_rpc_bridge.sql');

  for (const [name, sql] of [['ingest_api', ingest], ['bridge', bridge]]) {
    assert.match(sql, /revoke all on function %s from public/,
      `${name} : révocation de public absente — PostgreSQL accorde EXECUTE à public par défaut`);
    assert.match(sql, /grant execute on function %s to service_role/,
      `${name} : aucun GRANT à service_role`);
  }

  // Le pont ne doit JAMAIS être ouvert à un client.
  assert.equal(/grant execute on function %s to authenticated/.test(bridge), false,
    'le pont d’ingestion est accordé à `authenticated` : CORS, taille et débit deviennent '
    + 'contournables par un simple appel REST');
});

test('les RPC du tableau de bord vérifient l’autorisation dans leur corps', () => {
  const admin = read('supabase/migrations/20260810140000_admin_dashboard_api.sql');
  const functions = [...admin.matchAll(/create or replace function (public\.admin_\w+)/g)]
    .map(m => m[1]);

  assert.ok(functions.length >= 5, 'les RPC du tableau de bord sont introuvables');

  // Chaque fonction doit contenir un contrôle d'autorisation. Le GRANT à `authenticated`
  // ouvre l'APPEL ; seul ce contrôle protège la DONNÉE.
  const guards = admin.match(/if not public\.(is_founder_admin|has_admin_role)/g) ?? [];
  assert.ok(guards.length >= functions.length,
    `${functions.length} RPC pour seulement ${guards.length} contrôles d’autorisation`);
});

test('toute fonction SECURITY DEFINER fige son search_path', () => {
  const files = ['20260810110000_ingest_api.sql', '20260810120000_editorial_candidates.sql',
                 '20260810130000_retention_and_purge.sql', '20260810140000_admin_dashboard_api.sql',
                 '20260810150000_ingest_rpc_bridge.sql'];
  let total = 0;
  for (const file of files) {
    // Les commentaires PARLENT de `security definer` (c'est même le sujet de plusieurs
    // en-têtes) : les compter produirait un échec permanent et sans rapport. Seul le code
    // exécutable est examiné.
    const sql = read(`supabase/migrations/${file}`)
      .split('\n')
      .filter(line => !line.trim().startsWith('--'))
      .join('\n');
    const definers = (sql.match(/^\s*security definer\s*$/gim) ?? []).length;
    const searchPaths = (sql.match(/^\s*set search_path\s*=/gim) ?? []).length;
    total += definers;
    assert.ok(searchPaths >= definers,
      `${file} : ${definers} fonctions SECURITY DEFINER pour ${searchPaths} search_path figés — `
      + 'un objet piégé dans un schéma temporaire pourrait détourner la résolution de noms');
  }

  // `editorial_candidates.sql` n'en contient légitimement AUCUNE : ses fonctions sont des
  // triggers, qui s'exécutent avec les droits de l'appelant — c'est voulu, seul
  // `service_role` écrit dans ces tables. Le décompte global évite pour autant que ce test
  // ne devienne vide si les fonctions à privilèges disparaissaient toutes.
  assert.ok(total >= 8, `seulement ${total} fonctions SECURITY DEFINER trouvées — test inopérant`);
});

// ─── Rétention : le texte affiché et le code appliqué disent la même chose ──

test('les durées annoncées à l’utilisateur correspondent à celles réellement appliquées', () => {
  const retention = read('supabase/migrations/20260810130000_retention_and_purge.sql');

  // `political_analytics` → politique `quiz_responses`.
  const responsesPolicy = retention.match(/'quiz_responses',\s*interval '(\d+) months'/);
  assert.ok(responsesPolicy, 'politique de rétention des réponses introuvable');
  assert.equal(Number(responsesPolicy[1]), RETENTION_MONTHS[PURPOSES.POLITICAL_ANALYTICS],
    'la durée annoncée dans le texte de consentement diffère de celle appliquée par la purge');
});

test('aucune finalité ne prévoit une conservation illimitée par défaut', () => {
  for (const purpose of ALL_PURPOSES) {
    const months = RETENTION_MONTHS[purpose];
    if (months === null) {
      // Seul `cloud_save` est adossé à la durée de vie du compte, ce qui est une limite
      // réelle : le compte supprimé emporte les données.
      assert.equal(purpose, PURPOSES.CLOUD_SAVE,
        `« ${purpose} » n’annonce aucune durée alors qu’il n’est pas lié à un compte`);
      continue;
    }
    assert.ok(months > 0 && months <= 36,
      `« ${purpose} » annonce ${months} mois — hors de toute justification raisonnable`);
  }
});

test('chaque classe de données purgée porte sa justification', () => {
  const retention = read('supabase/migrations/20260810130000_retention_and_purge.sql');
  const classes = [...retention.matchAll(/\('([a-z_]+)',\s*interval/g)].map(m => m[1]);
  assert.ok(classes.length >= 6, `seulement ${classes.length} classes de rétention déclarées`);

  // La colonne `rationale` est `not null` : la contrainte existe déjà en base. On vérifie
  // ici que les justifications ne sont pas des chaînes vides déguisées.
  for (const dataClass of classes) {
    const block = retention.slice(retention.indexOf(`('${dataClass}'`));
    const rationale = block.slice(0, 900);
    assert.ok(rationale.length > 200,
      `la justification de « ${dataClass} » est trop courte pour en être une`);
  }
});

// ─── Cohérence du protocole ─────────────────────────────────────────────────

test('les états de réponse du protocole correspondent au type SQL', () => {
  const schema = read('supabase/migrations/20260810100000_data_platform_private_schema.sql');
  for (const state of ['answered', 'dont_know', 'no_opinion', 'prefer_not_to_answer']) {
    assert.match(schema, new RegExp(`'${state}'`), `l’état ${state} manque au type SQL`);
  }
});

test('les finalités de consentement du client correspondent au type SQL', () => {
  const schema = read('supabase/migrations/20260810100000_data_platform_private_schema.sql');
  for (const purpose of ALL_PURPOSES) {
    assert.match(schema, new RegExp(`'${purpose}'`),
      `la finalité ${purpose} existe côté client mais pas dans le type SQL`);
  }
});

test('la contrainte « answered ⇒ 1–5 » et « no_opinion ⇒ null » existe en base', () => {
  const schema = read('supabase/migrations/20260810100000_data_platform_private_schema.sql');
  assert.match(schema, /quiz_responses_answered_requires_value/);
  assert.match(schema, /quiz_responses_no_opinion_requires_null/);
  assert.match(schema, /answer_value between 1 and 5/);
});

test('aucune colonne de User-Agent ou d’IP dans les migrations de collecte', () => {
  const schema = read('supabase/migrations/20260810100000_data_platform_private_schema.sql');
  // On cible les DÉFINITIONS de colonne, pas les commentaires qui expliquent l'absence.
  const columnDefinitions = schema
    .split('\n')
    .filter(line => !line.trim().startsWith('--'))
    .join('\n');
  for (const forbidden of ['user_agent', 'ip_address', 'raw_ua', 'referrer']) {
    assert.equal(new RegExp(`^\\s*${forbidden}\\s`, 'm').test(columnDefinitions), false,
      `colonne « ${forbidden} » définie dans le schéma de collecte`);
  }
});
