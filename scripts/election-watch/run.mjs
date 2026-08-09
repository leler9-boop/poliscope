#!/usr/bin/env node
// POLISCOP — Orchestrateur de veille électorale 2027.
//
// CE QUE CE SCRIPT FAIT
// ---------------------
// Il prépare et clôt un cycle de veille : verrou de concurrence, calcul de la fenêtre depuis
// `last_successful_run`, contrôles d'intégrité locaux, création du dossier de sortie daté avec
// tous les fichiers au bon schéma, validation de ce que l'agent y a écrit, mise à jour de
// l'état. Déclenchement manuel comme planifié.
//
// CE QU'IL NE FAIT PAS — ET POURQUOI
// ----------------------------------
// Il n'effectue AUCUNE recherche web. Node n'a pas d'agent de recherche, et simuler une veille
// qui n'a pas eu lieu serait pire que de ne rien faire : cela produirait un dossier daté,
// d'apparence normale, contenant `NO_VERIFIED_CHANGE` alors que rien n'a été contrôlé.
//
// La recherche est faite par un agent (Claude Code ou équivalent) à qui l'on fournit
// `prompts/election-watch-2027.md`. Le pipeline est donc en deux temps :
//
//   1. node scripts/election-watch/run.mjs --prepare
//        → crée veille/2027/<date>/ avec les 12 fichiers vides au bon schéma + CONTEXT.md
//   2. l'agent remplit ces fichiers en suivant le prompt
//   3. node scripts/election-watch/run.mjs --finalize
//        → valide les schémas, refuse un paquet incomplet, met à jour last_successful_run
//
// Aucune étape n'écrit dans src/data/ ni dans la base : la sortie est une PROPOSITION.

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('../..', import.meta.url)).replace(/\/$/, '');
const STATE_PATH = join(ROOT, 'veille', '2027', 'state.json');
const LOCK_PATH  = join(ROOT, 'veille', '2027', '.lock');
const OUT_ROOT   = join(ROOT, 'veille', '2027');

/** Chevauchement de sécurité : on re-balaie 48 h avant la dernière exécution réussie. */
const OVERLAP_HOURS = 48;
/** Un verrou plus vieux que cela est considéré comme abandonné (processus tué). */
const LOCK_STALE_HOURS = 6;

/** Les douze fichiers exigés par le prompt, avec leur contenu initial. */
const REQUIRED_OUTPUTS = {
  // Le marqueur TODO_UNFILLED est ce que --finalize cherche pour refuser un paquet non
  // rempli. Ne pas le retirer des gabarits, et le supprimer en remplissant le fichier.
  'executive_summary.md':          '# Résumé exécutif\n\nTODO_UNFILLED — 10 lignes maximum.\n',
  'critical_alerts.json':          '[]',
  'candidate_status_changes.json': '[]',
  'program_releases.json':         '[]',
  'position_proposals.json':       '[]',
  'poll_updates.json':             '[]',
  'stale_or_incomplete_profiles.json': '[]',
  'rejected_signals.json':         '[]',
  'tests_run.json':                '[]',
  'human_review_queue.json':       '[]',
  'proposed.patch':                '',
  'changelog.md':                  '# Journal\n\nTODO_UNFILLED\n',
};

/** Champs obligatoires de toute proposition affectant une position. */
const PROPOSAL_FIELDS = [
  'before', 'after', 'sourceIds', 'confidence', 'reasoning',
  'impactOnMatching', 'reviewerRequired', 'rollback',
];

// ─── Utilitaires ─────────────────────────────────────────────────────────────

function readJson(path, fallback) {
  try { return JSON.parse(readFileSync(path, 'utf8')); } catch { return fallback; }
}

function isoDate(d = new Date()) { return d.toISOString().slice(0, 10); }

function acquireLock() {
  mkdirSync(dirname(LOCK_PATH), { recursive: true });
  if (existsSync(LOCK_PATH)) {
    const held = readJson(LOCK_PATH, null);
    const ageH = held?.at ? (Date.now() - new Date(held.at).getTime()) / 36e5 : Infinity;
    if (ageH < LOCK_STALE_HOURS) {
      throw new Error(
        `Une exécution est déjà en cours depuis ${ageH.toFixed(1)} h (pid ${held?.pid}). ` +
        `Deux runs concurrents produiraient deux paquets divergents. ` +
        `Si le processus est mort, supprimer ${LOCK_PATH}.`,
      );
    }
    console.warn(`⚠ Verrou périmé (${ageH.toFixed(1)} h) — reprise.`);
  }
  writeFileSync(LOCK_PATH, JSON.stringify({ pid: process.pid, at: new Date().toISOString() }, null, 2));
}

function releaseLock() { try { rmSync(LOCK_PATH, { force: true }); } catch {} }

function windowSince(state) {
  if (!state?.lastSuccessfulRun) return null; // première exécution : pas de borne basse
  const since = new Date(state.lastSuccessfulRun);
  since.setHours(since.getHours() - OVERLAP_HOURS);
  return since.toISOString();
}

// ─── Contrôles d'intégrité locaux ────────────────────────────────────────────

async function runIntegrityChecks() {
  const { register } = await import('node:module');
  register(new URL('../lib/json-import-loader.mjs', import.meta.url));
  const { elections } = await import(`${new URL('../../src/data/elections.js', import.meta.url).href}`);
  const { resolveCandidateId } = await import(`${new URL('../../src/data/candidateRegistry.js', import.meta.url).href}`);

  const results = [];
  const fr = elections.find(e => e.id === 'fr_2027');
  const qs = fr?.specificQuestions ?? [];

  for (const c of fr?.candidates ?? []) {
    const used = qs.filter(q => q.positions?.[c.id] != null).length;
    results.push({
      check: 'specific_coverage',
      candidate: c.id,
      used, total: qs.length,
      status: used === 0 ? 'FAIL' : used < qs.length ? 'WARN' : 'PASS',
    });
  }

  const candIds = new Set((fr?.candidates ?? []).map(c => c.id));
  const orphans = [...new Set(qs.flatMap(q => Object.keys(q.positions ?? {})))].filter(k => !candIds.has(k));
  results.push({ check: 'orphan_position_keys', orphans, status: orphans.length ? 'FAIL' : 'PASS' });

  const unregistered = (fr?.candidates ?? []).filter(c => !resolveCandidateId(c.id)).map(c => c.id);
  results.push({ check: 'registry_resolution', unregistered, status: unregistered.length ? 'FAIL' : 'PASS' });

  return results;
}

// ─── Étape 1 : préparation ───────────────────────────────────────────────────

async function prepare() {
  acquireLock();
  const state = readJson(STATE_PATH, { lastSuccessfulRun: null, runs: [] });
  const since = windowSince(state);
  const date = isoDate();
  const dir = join(OUT_ROOT, date);

  if (existsSync(dir)) {
    throw new Error(`Le dossier ${dir} existe déjà. Le supprimer ou dater le run autrement.`);
  }
  mkdirSync(dir, { recursive: true });

  for (const [name, content] of Object.entries(REQUIRED_OUTPUTS)) {
    writeFileSync(join(dir, name), content);
  }

  const checks = await runIntegrityChecks();
  writeFileSync(join(dir, 'tests_run.json'), JSON.stringify(checks, null, 2));

  const failing = checks.filter(c => c.status === 'FAIL');
  const context = [
    `# Contexte du run de veille — ${date}`,
    '',
    `- Fenêtre de recherche : ${since ? `depuis ${since} (chevauchement ${OVERLAP_HOURS} h inclus)` : 'première exécution — pas de borne basse'}`,
    `- Prompt à suivre : \`prompts/election-watch-2027.md\``,
    `- Dossier de sortie : \`veille/2027/${date}/\``,
    '',
    '## Contrôles d\'intégrité au démarrage',
    '',
    ...checks.map(c => `- [${c.status}] ${c.check}${c.candidate ? ` · ${c.candidate} ${c.used}/${c.total}` : ''}`),
    '',
    failing.length
      ? `⚠ ${failing.length} contrôle(s) en échec — à traiter en priorité, avant toute nouvelle position.`
      : '✅ Aucun contrôle en échec au démarrage.',
    '',
    '## Rappel',
    '',
    "L'agent NE modifie aucun fichier de `src/data/` ni la base. Il remplit uniquement les",
    'fichiers de ce dossier. Toute position affectant un score exige une validation humaine.',
    '',
    "S'il n'existe aucune nouveauté vérifiable : écrire `NO_VERIFIED_CHANGE` dans",
    '`executive_summary.md`, lister les sources contrôlées, et ne créer aucune position.',
    '',
  ].join('\n');
  writeFileSync(join(dir, 'CONTEXT.md'), context);

  releaseLock();
  console.log(`✅ Dossier de run préparé : veille/2027/${date}/`);
  console.log(`   ${Object.keys(REQUIRED_OUTPUTS).length} fichiers créés + CONTEXT.md`);
  if (failing.length) console.log(`   ⚠ ${failing.length} contrôle(s) d'intégrité en échec`);
  console.log(`\nÉtape suivante : fournir prompts/election-watch-2027.md et CONTEXT.md à l'agent,`);
  console.log(`puis : node scripts/election-watch/run.mjs --finalize`);
  return 0;
}

// ─── Étape 2 : validation et clôture ─────────────────────────────────────────

function finalize() {
  const dirs = existsSync(OUT_ROOT)
    ? readdirSync(OUT_ROOT).filter(d => /^\d{4}-\d{2}-\d{2}$/.test(d)).sort()
    : [];
  if (dirs.length === 0) throw new Error('Aucun dossier de run à clôturer. Lancer d\'abord --prepare.');
  const date = dirs[dirs.length - 1];
  const dir = join(OUT_ROOT, date);

  const errors = [];

  for (const name of Object.keys(REQUIRED_OUTPUTS)) {
    const path = join(dir, name);
    if (!existsSync(path)) { errors.push(`fichier manquant : ${name}`); continue; }
    if (name.endsWith('.json')) {
      try { JSON.parse(readFileSync(path, 'utf8')); }
      catch { errors.push(`JSON invalide : ${name}`); }
    }
  }

  const summary = existsSync(join(dir, 'executive_summary.md'))
    ? readFileSync(join(dir, 'executive_summary.md'), 'utf8')
    : '';
  const noChange = summary.includes('NO_VERIFIED_CHANGE');

  const proposals = readJson(join(dir, 'position_proposals.json'), []);
  if (noChange && proposals.length > 0) {
    errors.push('NO_VERIFIED_CHANGE déclaré alors que des positions sont proposées');
  }
  // Le marqueur est cherché dans TOUS les fichiers, pas seulement le résumé : le changelog
  // pouvait rester un gabarit sans que rien ne le signale.
  for (const name of Object.keys(REQUIRED_OUTPUTS)) {
    const path = join(dir, name);
    if (!existsSync(path)) continue;
    if (readFileSync(path, 'utf8').includes('TODO_UNFILLED')) {
      errors.push(`${name} n'a pas été rempli (marqueur TODO_UNFILLED présent)`);
    }
  }

  if (false) {
    // Vaut aussi pour NO_VERIFIED_CHANGE : ce constat doit être ÉCRIT, avec la liste des
    // sources contrôlées. Un dossier généré puis laissé intact n'est pas une veille.
    errors.push('executive_summary.md n\'a pas été rempli (marqueur TODO_UNFILLED présent)');
  }

  proposals.forEach((p, i) => {
    for (const field of PROPOSAL_FIELDS) {
      if (!(field in p)) errors.push(`position_proposals[${i}] : champ « ${field} » manquant`);
    }
    if (Array.isArray(p.sourceIds) && p.sourceIds.length === 0) {
      errors.push(`position_proposals[${i}] : aucune source — non publiable`);
    }
    if (p.reviewerRequired === false) {
      errors.push(`position_proposals[${i}] : reviewerRequired=false interdit pour une position`);
    }
    if (p.after === 0 || p.after?.stance === 0) {
      // 0 est une position intermédiaire réelle ; l'inconnu se code `null`. On ne peut pas
      // trancher automatiquement, donc on demande une confirmation explicite.
      if (p.confirmedZeroIsIntentional !== true) {
        errors.push(`position_proposals[${i}] : stance 0 sans confirmation — « inconnu » se code null, jamais 0`);
      }
    }
  });

  if (errors.length > 0) {
    console.error(`❌ Paquet de veille ${date} REFUSÉ :\n`);
    errors.forEach(e => console.error(`  · ${e}`));
    console.error('\nlast_successful_run n\'est PAS mis à jour : le prochain run reprendra la même fenêtre.');
    return 1;
  }

  const state = readJson(STATE_PATH, { lastSuccessfulRun: null, runs: [] });
  const now = new Date().toISOString();
  state.lastSuccessfulRun = now;
  state.runs = [...(state.runs ?? []), { date, at: now, noChange, proposals: proposals.length }].slice(-50);
  mkdirSync(dirname(STATE_PATH), { recursive: true });
  writeFileSync(STATE_PATH, JSON.stringify(state, null, 2));

  console.log(`✅ Paquet de veille ${date} validé.`);
  console.log(`   ${noChange ? 'NO_VERIFIED_CHANGE' : `${proposals.length} proposition(s) de position`}`);
  console.log(`   last_successful_run → ${now}`);
  console.log(`\n⚠ Rien n'a été appliqué. La revue humaine reste requise avant toute intégration.`);
  return 0;
}

// ─── Entrée ──────────────────────────────────────────────────────────────────

const mode = process.argv.includes('--finalize') ? 'finalize'
  : process.argv.includes('--prepare') ? 'prepare'
  : null;

if (!mode) {
  console.log(`Usage :
  node scripts/election-watch/run.mjs --prepare    prépare un dossier de run daté
  node scripts/election-watch/run.mjs --finalize   valide le paquet et clôt le run

Ce script n'effectue AUCUNE recherche web : elle est réalisée par un agent suivant
prompts/election-watch-2027.md entre les deux étapes. Voir docs/data/election-watch.md.`);
  process.exit(2);
}

try {
  process.exit(mode === 'prepare' ? await prepare() : finalize());
} catch (err) {
  releaseLock();
  console.error(`❌ ${err.message}`);
  process.exit(1);
}
