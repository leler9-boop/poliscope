#!/usr/bin/env node
/**
 * check-brand.mjs — le projet s'appelle « Poliscop » (sans « e »), site poliscop.org.
 * Signale toute occurrence de « Poliscope » dans les fichiers du repo.
 *
 * Usage : node scripts/check-brand.mjs   (exit 1 si une occurrence interdite est trouvée)
 *
 * Exceptions légitimes (jamais signalées) :
 *   - le chemin disque local « …/poliscope copy » (nom du dossier sur la machine) ;
 *   - la clé localStorage historique 'poliscope_state' (données déjà écrites chez les
 *     utilisateurs — la renommer casserait la migration) ;
 *   - toute ligne portant le marqueur « brand-check:allow ».
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const EXCLUDE_DIRS = new Set(['node_modules', '.git', 'dist', 'notebooklm-py', '.claude']);
const EXTS = new Set(['.js', '.jsx', '.mjs', '.md', '.json', '.html', '.sql', '.css', '.txt', '.svg', '.webmanifest', '.example']);
const SKIP_FILES = new Set(['package-lock.json', 'check-brand.mjs']);

const RE = /poliscope/i;
const ALLOWED = [/poliscope copy/i, /poliscope_state/, /brand-check:allow/];

let hits = 0;

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) {
      if (!EXCLUDE_DIRS.has(name)) walk(p);
      continue;
    }
    if (SKIP_FILES.has(name)) continue;
    const ext = extname(name) || extname(name.replace(/^\./, 'x.'));
    if (!EXTS.has(ext) && !name.startsWith('.env')) continue;
    let text;
    try { text = readFileSync(p, 'utf8'); } catch { continue; }
    text.split('\n').forEach((line, i) => {
      if (RE.test(line) && !ALLOWED.some(a => a.test(line))) {
        hits++;
        console.log(`${p.replace(ROOT, '')}:${i + 1}: ${line.trim().slice(0, 120)}`);
      }
    });
  }
}

walk(ROOT);

if (hits > 0) {
  console.error(`\n✗ ${hits} occurrence(s) de « Poliscope » — le projet s'appelle Poliscop (sans e).`);
  process.exit(1);
}
console.log('✓ check-brand : aucune occurrence de « Poliscope ».');
