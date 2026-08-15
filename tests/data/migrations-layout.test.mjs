// POLISCOP — Structure du répertoire de migrations.
//
// Le 2e contre-audit relevait trois défauts de structure :
//   • `20260809120000_admin_authorization.sql` et `..._rollback.sql` partageaient la MÊME
//     version : la CLI Supabase les aurait tous deux considérés comme des migrations à
//     appliquer, et le rollback aurait défait la migration juste après son application ;
//   • `20260809T120000_response_state_target.sql` était une SPÉCIFICATION posée parmi les
//     migrations — un `db push` l'aurait exécutée ;
//   • rien n'empêchait la réapparition de l'un ou l'autre.
//
// Corrigé par la structure : rollbacks sous `supabase/rollbacks/`, spécifications sous
// `docs/data-model/`. Ces tests verrouillent cette séparation.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('../..', import.meta.url)).replace(/\/$/, '');
const MIGRATIONS = join(ROOT, 'supabase/migrations');

const files = readdirSync(MIGRATIONS).filter(f => f.endsWith('.sql'));

/** Convention Supabase : `<version>_<nom>.sql`, version = 8 ou 14 chiffres. */
const NAME_PATTERN = /^(\d{8}|\d{14})_[a-z0-9_]+\.sql$/;

test('tout fichier de supabase/migrations/ respecte la convention de nommage', () => {
  const invalid = files.filter(f => !NAME_PATTERN.test(f));
  assert.deepEqual(invalid, [],
    `nom non conforme (attendu <version>_<nom>.sql, version de 8 ou 14 chiffres) : ${invalid.join(', ')}`);
});

test('aucune version dupliquée dans supabase/migrations/', () => {
  const byVersion = new Map();
  for (const f of files) {
    const version = f.split('_')[0];
    byVersion.set(version, [...(byVersion.get(version) ?? []), f]);
  }
  const dupes = [...byVersion.entries()].filter(([, list]) => list.length > 1);
  assert.deepEqual(dupes, [],
    `deux fichiers partagent une version — la CLI les appliquerait tous les deux : ${
      dupes.map(([v, l]) => `${v} → ${l.join(' + ')}`).join(' | ')}`);
});

test('aucun rollback ni spécification dans supabase/migrations/', () => {
  const misplaced = files.filter(f => /rollback|_target|\.spec\./i.test(f));
  assert.deepEqual(misplaced, [],
    `un rollback va dans supabase/rollbacks/, une spécification dans docs/data-model/ : ${misplaced.join(', ')}`);
});

test('le rollback de la migration admin existe, hors du répertoire de migrations', () => {
  const path = join(ROOT, 'supabase/rollbacks/20260809120000_admin_authorization_rollback.sql');
  assert.ok(existsSync(path), 'rollback introuvable sous supabase/rollbacks/');
  assert.ok(
    readFileSync(path, 'utf8').includes('founder_impl_'),
    'le rollback doit restaurer les implémentations enveloppées',
  );
});

test('la spécification response_state vit dans docs/, pas dans les migrations', () => {
  assert.ok(
    existsSync(join(ROOT, 'docs/data-model/response-state-target.sql')),
    'spécification introuvable sous docs/data-model/',
  );
  assert.ok(
    !files.some(f => f.includes('response_state')),
    'la spécification ne doit pas pouvoir être appliquée par un db push',
  );
});

test('le banc d’essai découvre les migrations au lieu de les énumérer à la main', () => {
  // Double régression verrouillée ici :
  //   • 2e contre-audit : le banc SAUTAIT 20260612, masquant `public.set_updated_at()` ;
  //   • 3e contre-audit : il appliquait 20260809130000 AVANT 20260809120000, un ordre que
  //     `supabase db push` ne produit jamais.
  // La parade est structurelle : le banc découvre les fichiers et les trie, il ne les cite pas.
  const harness = readFileSync(join(ROOT, 'supabase/tests/run-migration-tests.sh'), 'utf8');

  assert.match(harness, /find\s+"\$ROOT\/supabase\/migrations"[\s\S]{0,60}\|\s*sort/,
    'le banc doit découvrir les migrations par `find … | sort`, pas les énumérer');

  // Aucune migration ne doit être appliquée par un chemin écrit en dur DANS LA BOUCLE
  // d'application. Une seconde application explicite reste permise pour les migrations qui
  // font l'objet d'un test d'idempotence ou de rollback — et cette permission est bornée par
  // l'existence RÉELLE du rollback correspondant, pas par une liste d'exceptions à rallonge.
  const avecRollback = new Set(
    readdirSync(join(ROOT, 'supabase/rollbacks'))
      .filter(f => f.endsWith('.sql'))
      .map(f => f.replace(/_rollback\.sql$/, '')),
  );
  const hardcoded = files.filter(f => new RegExp(`-f\\s+"?\\$\\{?ROOT[^\n]*${f.replace(/[.]/g, '\\.')}`).test(harness));
  const sansJustification = hardcoded.filter(f => !avecRollback.has(f.replace(/\.sql$/, '')));
  assert.deepEqual(sansJustification, [],
    `migration appliquée par chemin codé en dur sans rollback associé : ${sansJustification.join(', ')} — ` +
    `l'ordre cesserait de suivre la CLI dès l'ajout d'un fichier`);

  // Et l'ordre effectivement appliqué doit être comparé à l'ordre attendu, avec échec.
  assert.match(harness, /diff -q "\$APPLIED_LOG" "\$EXPECTED_LOG"/,
    'le banc doit comparer l’ordre réellement appliqué à l’ordre lexical attendu');
});
