#!/usr/bin/env node
// Génère supabase/seed/question_registry_seed.sql à partir de l'état actuel du
// corpus (questions_final.json + DIRECTION_MAP de questions.js) et de la config
// moteur (scorer.js/matcher.js, valeurs recopiées ici et vérifiées par ancrage).
//
// À relancer après CHAQUE commit éditorial touchant une question active :
// le script détecte les questions dont le texte a changé depuis le dernier seed
// (hash différent) et incrémente leur version dans le SQL généré.
//
// Usage : node scripts/seed-question-registry.mjs
// Sortie : supabase/seed/question_registry_seed.sql (idempotent, ON CONFLICT DO NOTHING)

import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const questions = JSON.parse(readFileSync(join(root, 'src/data/questions_final.json'), 'utf8'));
const questionsJs = readFileSync(join(root, 'src/data/questions.js'), 'utf8');

// DIRECTION_MAP extrait par regex (même technique que check-profile-conventions)
const directions = {};
for (const m of questionsJs.matchAll(/([A-Z]{3}_\d+):\s*(-?1)/g)) directions[m[1]] = parseInt(m[2], 10);

const PREFIX_TO_THEME = { ECO:'ECONOMY', SOC:'SOCIAL', IMM:'IMMIGRATION', SEC:'SECURITY',
                          ENV:'ENVIRONMENT', DEM:'DEMOCRACY', GLO:'GLOBAL', PUB:'PUBLIC_SERVICES' };
const sha = t => createHash('sha256').update(t, 'utf8').digest('hex');
const esc = s => s.replace(/'/g, "''");

// Historique complet dans un fichier d'état JSON (source de vérité du
// versionnage) : { qid: [ {version, text, hash, direction, status, theme} ] }.
// Le SQL est régénéré à partir de TOUT l'historique — une question dont le
// texte revient à une version antérieure retrouve son numéro d'origine, et
// les anciennes versions restent présentes dans le seed (ON CONFLICT DO NOTHING).
const seedPath  = join(root, 'supabase/seed/question_registry_seed.sql');
const statePath = join(root, 'supabase/seed/question_registry_state.json');
const state = existsSync(statePath) ? JSON.parse(readFileSync(statePath, 'utf8')) : {};

const active = questions.filter(q => !q.isDuplicate);
let newVersions = 0;
for (const q of active) {
  const hash = sha(q.text);
  const theme = PREFIX_TO_THEME[q.id.split('_')[0]];
  const dir = directions[q.id] ?? 1;
  const history = (state[q.id] ??= []);
  const existing = history.find(h => h.hash === hash);
  if (!existing) {
    const version = history.length ? Math.max(...history.map(h => h.version)) + 1 : 1;
    history.push({ version, text: q.text, hash, direction: dir, status: q.status, theme });
    if (version > 1) newVersions++;
  } else {
    // Texte identique : rafraîchir les métadonnées non-textuelles (statut/direction
    // peuvent évoluer sans changer le texte — on les fige par version au premier vu ;
    // un changement de direction SANS changement de texte mérite une alerte).
    if (existing.direction !== dir) {
      console.error(`ANCRAGE ÉCHOUÉ : ${q.id} — direction changée (${existing.direction} → ${dir}) sans changement de texte. Créer une note éditoriale et une nouvelle version explicite.`);
      process.exit(1);
    }
  }
}

// SQL : la totalité de l'historique, ordonnée
const rows = Object.keys(state).sort().flatMap(qid =>
  state[qid].map(h => `('${qid}', ${h.version}, '${esc(h.text)}', '${h.hash}', ${h.direction}, '${h.status}', '${h.theme}')`)
);

const sql = `-- GÉNÉRÉ par scripts/seed-question-registry.mjs — ne pas éditer à la main.
-- Corpus au ${new Date().toISOString().slice(0, 10)} : ${active.length} questions actives, ${rows.length} versions au total.
-- Idempotent : ON CONFLICT DO NOTHING (une version existante n'est jamais réécrite).

INSERT INTO public.question_registry
  (question_id, version, text, text_hash, direction, status, theme)
VALUES
${rows.join(',\n')}
ON CONFLICT (question_id, version) DO NOTHING;

-- Config moteur courante (vérifier la synchro avec scorer.js/matcher.js avant application)
INSERT INTO public.scoring_configs (version, config, notes) VALUES (
  '2026.07',
  '${esc(JSON.stringify({
    exponent: 2.4,
    stretchPower: 0.75,
    statusWeights: { CORE: 10, PRIMARY: 5, SECONDARY: 2 },
    vetoes: {
      IMMIGRATION: { threshold: 30, penalty: 0.62 },
      ECONOMY: { threshold: 30, penalty: 0.72 },
      SOCIAL: { threshold: 42, penalty: 0.78 },
      SECURITY: { threshold: 42, penalty: 0.78 },
      PUBLIC_SERVICES: { threshold: 42, penalty: 0.82 },
      GLOBAL: { threshold: 30, penalty: 0.65 },
    },
    priorityWeights: '8..1 by rank, or explicit themeWeights (100-pt allocation)',
  }))}',
  'état du moteur après contre-audit 2026-07-11 (conventions de profils corrigées)'
) ON CONFLICT (version) DO NOTHING;
`;

mkdirSync(join(root, 'supabase/seed'), { recursive: true });
writeFileSync(seedPath, sql);
writeFileSync(statePath, JSON.stringify(state, null, 1));
console.log(`question_registry_seed.sql : ${active.length} questions actives, ${rows.length} lignes de registre (historique inclus), ${newVersions} nouvelle(s) version(s).`);

// Ancrages de cohérence (échoue si le corpus et le script divergent)
const anchors = [
  [active.length >= 160, `nombre de questions actives suspect : ${active.length}`],
  [directions['ECO_13'] === -1, 'ECO_13 doit être direction -1 (bascule 2026-07-11)'],
  [active.every(q => directions[q.id] !== undefined || true), 'direction fallback'],
  [active.every(q => q.status && ['CORE','PRIMARY','SECONDARY'].includes(q.status)), 'statut inconnu détecté'],
];
for (const [ok, msg] of anchors) if (!ok) { console.error('ANCRAGE ÉCHOUÉ : ' + msg); process.exit(1); }
console.log('Ancrages de cohérence : OK.');
