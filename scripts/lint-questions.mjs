// POLISCOP — Editorial lint for the question bank.
// Flags candidates for human review; never auto-rewrites. Run: node scripts/lint-questions.mjs [THEME]
import { register } from 'node:module';
import { pathToFileURL } from 'node:url';
const ROOT = '/Users/arnaudlery/Desktop/poliscope copy';
register(pathToFileURL(`${ROOT}/audit/poliscop-full-audit/proposed-tests/_json-import-loader.mjs`), import.meta.url);

const { questions, THEMES_ORDER } = await import(`${ROOT}/src/data/questions.js`);
const rawAll = (await import(`${ROOT}/src/data/questions_final.json`, { with: { type: 'json' } })).default;
const { questionHints } = await import(`${ROOT}/src/data/questionHints.js`);

const ANGLICISMS = [
  'supporter', 'adresser ce', 'adresser cette', 'opportunité', 'réaliser que',
  'définitivement', 'impact(er|é)', 'process\\b', 'challenge\\b', 'focus\\b',
  'en charge de manière', 'implémenter', 'agenda\\b', 'à date\\b', 'in fine',
];
const VAGUE_PATTERNS = [
  /conserver la politique actuelle/i,
  /renforcer les mesures(?! (contre|pour|de|d’|en faveur))/i,
  /réformer le système(?!\s+(de|des|d’))/i,
  /faut-il faire davantage/i,
  /situation (est-elle )?satisfaisante/i,
  /faut-il améliorer\b/i,
  /^pensez-vous que la situation/i,
];

function wordCount(s) { return (s || '').trim().split(/\s+/).filter(Boolean).length; }
function countEt(s) { return ((s || '').match(/\bet\b/gi) || []).length; }
function countOu(s) { return ((s || '').match(/\bou\b/gi) || []).length; }

function lintOne(raw, processed) {
  const flags = [];
  const text = raw.text || '';
  const expl = raw.explanation || '';

  if (!expl.trim() && !raw.isDuplicate) flags.push('EXPL_MISSING');
  if (expl.trim() && wordCount(expl) < 15) flags.push('EXPL_TOO_SHORT');
  if (wordCount(expl) > 200) flags.push('EXPL_TOO_LONG');
  if (expl.trim() && text.trim()) {
    const normQ = text.toLowerCase().replace(/[.,!?]/g, '').trim();
    const normE = expl.toLowerCase().replace(/[.,!?]/g, '').trim();
    if (normE.startsWith(normQ.slice(0, Math.min(30, normQ.length)))) flags.push('EXPL_ECHOES_QUESTION');
  }
  if (wordCount(text) > 20) flags.push('Q_TOO_LONG');
  if (countEt(text) >= 2) flags.push('Q_MULTI_ET');
  if (/\bou\b/i.test(text) && countOu(text) >= 1 && / (droit|choix|option)/i.test(text) === false) flags.push('Q_HAS_OU');
  if (/  /.test(text) || /  /.test(expl)) flags.push('DOUBLE_SPACE');
  for (const pat of ANGLICISMS) {
    if (new RegExp(pat, 'i').test(text) || new RegExp(pat, 'i').test(expl)) flags.push('ANGLICISM:' + pat);
  }
  for (const pat of VAGUE_PATTERNS) {
    if (pat.test(text)) flags.push('VAGUE_FORMULATION');
  }
  if (!raw.axis) flags.push('AXIS_MISSING');
  if (!processed) flags.push('NOT_IN_LIVE_QUEUE'); // duplicate or filtered out
  if (processed && !THEMES_ORDER.includes(processed.theme)) flags.push('THEME_INVALID');

  return flags;
}

const byId = new Map(questions.map(q => [q.id, q]));
const results = rawAll.map(raw => ({
  id: raw.id,
  isDuplicate: !!raw.isDuplicate,
  isLive: byId.has(raw.id),
  theme: byId.get(raw.id)?.theme ?? null,
  status: raw.status,
  flags: lintOne(raw, byId.get(raw.id)),
}));

const themeArg = process.argv[2];
const filtered = themeArg ? results.filter(r => r.theme === themeArg || (themeArg === 'DUPLICATES' && r.isDuplicate)) : results;

const flagged = filtered.filter(r => r.flags.length > 0);
console.log(`Total entrées inspectées: ${filtered.length} (actives: ${filtered.filter(r=>r.isLive).length}, exclues: ${filtered.filter(r=>!r.isLive).length})`);
console.log(`Questions actives avec au moins un signalement éditorial: ${flagged.filter(r=>r.isLive).length}`);
console.log(`Entrées exclues signalées pour traçabilité: ${flagged.filter(r=>!r.isLive).length}\n`);

const counts = {};
flagged.forEach(r => r.flags.forEach(f => { const k = f.split(':')[0]; counts[k] = (counts[k]||0)+1; }));
console.log('Repartition des signalements:', JSON.stringify(counts, null, 2));

console.log('\nDetail (id, theme, flags):');
flagged.forEach(r => console.log(`${r.id}\t${r.theme ?? '(exclue)'}\t${r.flags.join(', ')}`));

// questionHints.js overrides the "Comprendre cet enjeu" panel entirely when present
// (see Questionnaire.jsx) — an orphaned entry (retired/renamed ID, or now pointing at a
// duplicate) silently shows wrong or dead content with no fallback. This only catches
// structural orphaning, NOT topic drift (hint text no longer matching its question's
// current subject) — that requires manual review, which found 8 mismatched entries in a
// full pass on 2026-07-11 (see 17-editorial-batches-synthesis.md, batch 4).
if (!themeArg) {
  const hintIssues = Object.keys(questionHints)
    .map(id => {
      const raw = rawAll.find(r => r.id === id);
      if (!raw) return `${id}\tHINT_ORPHANED_MISSING (no such question id)`;
      if (!byId.has(id)) return `${id}\tHINT_ORPHANED_EXCLUDED (points at an excluded question)`;
      return null;
    })
    .filter(Boolean);
  console.log(`\nquestionHints.js structural check: ${Object.keys(questionHints).length} entries, ${hintIssues.length} orphaned.`);
  hintIssues.forEach(line => console.log(line));
}
