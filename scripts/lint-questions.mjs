// POLISCOP — Contrôle éditorial de la banque de questions.
//
//   node scripts/lint-questions.mjs [THEME|DUPLICATES]
//
// ⚠ CE CONTRÔLE EST BLOQUANT depuis 2026-08. Il sortait auparavant toujours en code 0 :
// il imprimait des signalements que rien n'obligeait à traiter, et la banque a accumulé
// des questions composites, du franglais et des thèmes entiers dont toutes les formulations
// tiraient dans le même sens. Un signalement sur une question ACTIVE fait maintenant échouer
// la commande. Les entrées exclues (doublons, questions retirées) restent listées pour
// traçabilité mais ne bloquent pas.
//
// Les heuristiques vivent dans scripts/lib/question-rules.mjs et sont partagées avec
// tests/data/questions.editorial.test.mjs : un seul jeu de règles, pas deux.
import { register } from 'node:module';
import { readFileSync } from 'node:fs';
import { pathToFileURL, fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url)).replace(/\/$/, '');
register(new URL('./lib/json-import-loader.mjs', import.meta.url));

const { questions, THEMES_ORDER, DIRECTION_MAP, EDITORIAL_CORE_IDS, EDITORIALLY_RETIRED_IDS } =
  await import(`${pathToFileURL(ROOT).href}/src/data/questions.js`);
const rawAll = (await import(`${pathToFileURL(ROOT).href}/src/data/questions_final.json`, { with: { type: 'json' } })).default;
const { questionHints } = await import(`${pathToFileURL(ROOT).href}/src/data/questionHints.js`);
const { QUESTION_EXPLANATIONS } = await import(`${pathToFileURL(ROOT).href}/src/data/questionExplanations.js`);
const { QUESTION_CONCEPTS } = await import(`${pathToFileURL(ROOT).href}/src/data/conceptMap.js`);

const {
  analyseQuestion, directionBalance, nearDuplicatePairs,
  RULE_EXCEPTIONS, MIN_MINORITY_DIRECTION,
} = await import('./lib/question-rules.mjs');

const registry = JSON.parse(readFileSync(`${ROOT}/docs/questions/retired-ids.json`, 'utf8'));

const themeArg = process.argv[2];
const byId = new Map(questions.map(q => [q.id, q]));
const rawById = new Map(rawAll.map(q => [q.id, q]));

let blocking = 0;
const problem = msg => { console.log(`  ✖ ${msg}`); blocking++; };

// ─── 1. Question par question ────────────────────────────────────────────────

const results = rawAll.map(raw => {
  const processed = byId.get(raw.id);
  return {
    id: raw.id,
    isLive: !!processed,
    isDuplicate: !!raw.isDuplicate,
    theme: processed?.theme ?? null,
    flags: analyseQuestion(raw, processed),
  };
});

const filtered = themeArg && themeArg !== 'DUPLICATES'
  ? results.filter(r => r.theme === themeArg)
  : themeArg === 'DUPLICATES'
  ? results.filter(r => r.isDuplicate)
  : results;

const live = filtered.filter(r => r.isLive);
const excluded = filtered.filter(r => !r.isLive);

console.log(`Entrées inspectées : ${filtered.length} (actives ${live.length}, exclues ${excluded.length})\n`);

console.log('─── Questions actives ───');
const liveFlagged = live.filter(r => r.flags.length);
if (!liveFlagged.length) console.log('  aucun signalement.');
for (const r of liveFlagged) {
  for (const f of r.flags) {
    const line = `${r.id}\t${r.theme}\t${f.rule}: ${f.detail}`;
    if (f.level === 'error') problem(line);
    else console.log(`  · ${line}`);
  }
}

if (excluded.length) {
  const counts = {};
  excluded.forEach(r => r.flags.forEach(f => { counts[f.rule] = (counts[f.rule] || 0) + 1; }));
  console.log(`\n─── Entrées exclues (traçabilité, non bloquant) ───`);
  console.log(`  ${excluded.length} entrées, signalements : ${JSON.stringify(counts)}`);
}

// ─── 2. Quasi-doublons ───────────────────────────────────────────────────────

console.log('\n─── Quasi-doublons parmi les questions actives ───');
const pairs = nearDuplicatePairs(questions);
if (!pairs.length) console.log('  aucune paire au-dessus du seuil.');
for (const p of pairs) {
  problem(`quasi-doublon ${p.a} ~ ${p.b} (similarité ${p.score})`);
  console.log(`      ${p.a} : ${rawById.get(p.a)?.text}`);
  console.log(`      ${p.b} : ${rawById.get(p.b)?.text}`);
}

// ─── 3. Équilibre du sens des formulations ───────────────────────────────────

console.log('\n─── Sens des formulations par thème ───');
for (const b of directionBalance(questions, THEMES_ORDER)) {
  const line = `${b.theme.padEnd(16)} accord→haut ${String(b.plus).padStart(2)} | accord→bas ${String(b.minus).padStart(2)} | minoritaire ${b.minority}`;
  if (b.ok) console.log(`  · ${line}`);
  else problem(`${line}  (minimum ${MIN_MINORITY_DIRECTION})`);
}

// ─── 4. Cohérence structurelle JSON ↔ questions.js ───────────────────────────

console.log('\n─── Cohérence questions_final.json ↔ questions.js ───');
const structural = [];
for (const q of questions) {
  if (!rawById.has(q.id)) structural.push(`${q.id} actif mais absent du JSON`);
  if (!(q.id in DIRECTION_MAP)) structural.push(`${q.id} sans direction explicite (repli silencieux à +1)`);
}
for (const id of Object.keys(DIRECTION_MAP)) {
  if (!rawById.has(id)) structural.push(`DIRECTION_MAP référence ${id}, inconnu du JSON`);
}
for (const id of EDITORIAL_CORE_IDS) {
  if (!byId.has(id)) structural.push(`EDITORIAL_CORE_IDS référence ${id}, non actif`);
}
for (const id of EDITORIALLY_RETIRED_IDS) {
  if (!rawById.has(id)) structural.push(`EDITORIALLY_RETIRED_IDS référence ${id}, inconnu du JSON`);
  if (byId.has(id)) structural.push(`${id} est à la fois retiré et actif`);
}
const ids = rawAll.map(q => q.id);
if (new Set(ids).size !== ids.length) structural.push('identifiant dupliqué dans questions_final.json');
for (const theme of THEMES_ORDER) {
  const n = questions.filter(q => q.theme === theme).length;
  if (n !== 16) structural.push(`${theme} : ${n} questions actives au lieu de 16`);
  const core = questions.filter(q => q.theme === theme && q.status === 'CORE').length;
  if (core !== 2) structural.push(`${theme} : ${core} questions CORE au lieu de 2`);
}
if (!structural.length) console.log('  aucune incohérence.');
structural.forEach(problem);

// ─── 5. Identifiants retirés : pas de réaffectation silencieuse ──────────────

console.log('\n─── Registre des identifiants retirés ───');
const registryIssues = [];
for (const entry of registry.retired) {
  const raw = rawById.get(entry.id);
  if (!raw) { registryIssues.push(`${entry.id} : absent de questions_final.json`); continue; }
  if (raw.text !== entry.textAtRetirement) {
    registryIssues.push(`${entry.id} : texte modifié après retrait — un identifiant retiré ne doit jamais porter une autre opinion`);
  }
  if (byId.has(entry.id)) registryIssues.push(`${entry.id} : retiré au registre mais servi en file active`);
}
for (const id of EDITORIALLY_RETIRED_IDS) {
  if (!registry.retired.some(e => e.id === id)) registryIssues.push(`${id} : retiré du questionnaire mais absent du registre`);
}
console.log(`  ${registry.retired.length} identifiants retirés, ${registry.created.length} créés.`);
if (!registryIssues.length) console.log('  aucune réaffectation détectée.');
registryIssues.forEach(problem);

// ─── 6. Contenus pédagogiques rattachés ──────────────────────────────────────

console.log('\n─── Contenus pédagogiques ───');
const orphans = [];
const checkOrphans = (label, keys) => {
  for (const id of keys) {
    if (!rawById.has(id)) orphans.push(`${label} → ${id} (identifiant inconnu)`);
    else if (!byId.has(id)) orphans.push(`${label} → ${id} (question exclue : contenu jamais affiché)`);
  }
};
checkOrphans('questionHints', Object.keys(questionHints));
checkOrphans('questionExplanations', Object.keys(QUESTION_EXPLANATIONS));
checkOrphans('conceptMap', Object.keys(QUESTION_CONCEPTS));
console.log(`  questionHints ${Object.keys(questionHints).length} · questionExplanations ${Object.keys(QUESTION_EXPLANATIONS).length} · conceptMap ${Object.keys(QUESTION_CONCEPTS).length}`);
if (!orphans.length) console.log('  aucun orphelin.');
orphans.forEach(problem);

// ─── 7. Exceptions ──────────────────────────────────────────────────────────

console.log('\n─── Exceptions éditoriales déclarées ───');
if (!Object.keys(RULE_EXCEPTIONS).length) console.log('  aucune.');
for (const [id, e] of Object.entries(RULE_EXCEPTIONS)) {
  console.log(`  · ${id} — règles ${e.rules.join(', ')}`);
  console.log(`      ${e.reason}`);
  if (!byId.has(id)) problem(`exception ${id} : la question n'est pas active`);
}

// ─── Verdict ─────────────────────────────────────────────────────────────────

console.log('\n════════════════════════════════════════════════════════════');
if (blocking) {
  console.log(`ÉCHEC — ${blocking} anomalie(s) bloquante(s) sur les questions actives.`);
  console.log('Corriger la banque, ou déclarer une exception motivée dans');
  console.log('scripts/lib/question-rules.mjs (RULE_EXCEPTIONS). Pas de contournement silencieux.');
  process.exit(1);
}
console.log('OK — aucune anomalie bloquante sur les 128 questions actives.');
console.log('Rappel : ce contrôle ne prouve pas l’absence d’ambiguïté sémantique.');
console.log('Les arbitrages humains sont consignés dans docs/questions/2026-08-revision-matrix.md.');
