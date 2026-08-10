// POLISCOP — Garde-fou éditorial de la banque de questions.
//
// Le contrôle historique (`npm run check:questions`) est INFORMATIF : il imprime des
// signalements et sort toujours en code 0. Rien n'empêchait donc de committer une question
// composite, du franglais ou un thème dont toutes les formulations tirent dans le même sens.
// Ce fichier rend bloquant ce qui doit l'être, en réutilisant EXACTEMENT les heuristiques du
// linter (scripts/lib/question-rules.mjs) pour qu'il n'existe qu'un seul jeu de règles.
//
// Ce que ces tests NE prouvent PAS : qu'aucune question n'est ambiguë. Ils prouvent qu'aucun
// défaut mécaniquement détectable ne subsiste. Les arbitrages sémantiques sont consignés
// dans docs/questions/2026-08-revision-matrix.md.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import {
  questions,
  THEMES_ORDER,
  DIRECTION_MAP,
  EDITORIAL_CORE_IDS,
  EDITORIALLY_RETIRED_IDS,
} from '../../src/data/questions.js';
import rawQuestions from '../../src/data/questions_final.json';
import { questionHints } from '../../src/data/questionHints.js';
import { QUESTION_EXPLANATIONS } from '../../src/data/questionExplanations.js';
import { QUESTION_CONCEPTS } from '../../src/data/conceptMap.js';
import { QUESTIONNAIRE_VERSION } from '../../src/engine/versions.js';
import {
  analyseQuestion,
  directionBalance,
  nearDuplicatePairs,
  RULE_EXCEPTIONS,
  MIN_MINORITY_DIRECTION,
} from '../../scripts/lib/question-rules.mjs';

const ROOT = fileURLToPath(new URL('../..', import.meta.url)).replace(/\/$/, '');
const retiredRegistry = JSON.parse(readFileSync(`${ROOT}/docs/questions/retired-ids.json`, 'utf8'));

const ACTIVE_COUNT = 128;
const PER_THEME = 16;
const CORE_PER_THEME = 2;

const rawById = new Map(rawQuestions.map(q => [q.id, q]));
const activeById = new Map(questions.map(q => [q.id, q]));

// ─── Structure ───────────────────────────────────────────────────────────────

test('la banque active compte 128 questions, 16 par thème', () => {
  assert.equal(questions.length, ACTIVE_COUNT);
  for (const theme of THEMES_ORDER) {
    assert.equal(
      questions.filter(q => q.theme === theme).length,
      PER_THEME,
      `${theme} n'a pas ${PER_THEME} questions actives`,
    );
  }
});

test('chaque thème expose exactement 2 questions CORE', () => {
  for (const theme of THEMES_ORDER) {
    const core = questions.filter(q => q.theme === theme && q.status === 'CORE');
    assert.equal(core.length, CORE_PER_THEME, `${theme} : ${core.map(q => q.id).join(', ')}`);
  }
});

test('aucune question active ne tombe sur la direction par défaut', () => {
  // processQuestion() applique `DIRECTION_MAP[id] ?? 1` : un oubli produit une question
  // scorée à l'envers sans aucun signal. On exige une entrée explicite.
  const missing = questions.filter(q => !(q.id in DIRECTION_MAP)).map(q => q.id);
  assert.deepEqual(missing, [], `directions absentes de DIRECTION_MAP : ${missing.join(', ')}`);
  for (const q of questions) {
    assert.ok([1, -1].includes(q.direction), `${q.id} : direction ${q.direction}`);
  }
});

test('questions.js et questions_final.json restent cohérents', () => {
  for (const q of questions) {
    assert.ok(rawById.has(q.id), `${q.id} actif mais absent de questions_final.json`);
  }
  for (const id of Object.keys(DIRECTION_MAP)) {
    assert.ok(rawById.has(id), `DIRECTION_MAP référence ${id}, absent de questions_final.json`);
  }
  for (const id of EDITORIAL_CORE_IDS) {
    assert.ok(activeById.has(id), `EDITORIAL_CORE_IDS référence ${id}, qui n'est pas actif`);
  }
  for (const id of EDITORIALLY_RETIRED_IDS) {
    assert.ok(rawById.has(id), `EDITORIALLY_RETIRED_IDS référence ${id}, inconnu du JSON`);
    assert.ok(!activeById.has(id), `${id} est à la fois retiré et actif`);
  }
  const ids = rawQuestions.map(q => q.id);
  assert.equal(new Set(ids).size, ids.length, 'identifiant dupliqué dans questions_final.json');
});

// ─── Qualité rédactionnelle ──────────────────────────────────────────────────

test('aucune question active ne déclenche de règle éditoriale bloquante', () => {
  const failures = [];
  for (const q of questions) {
    const raw = rawById.get(q.id);
    const errors = analyseQuestion(raw, q).filter(f => f.level === 'error');
    if (errors.length) {
      failures.push(`${q.id} — ${errors.map(e => `${e.rule}: ${e.detail}`).join(' | ')}`);
    }
  }
  assert.deepEqual(failures, [], `\n${failures.join('\n')}\n`);
});

test('aucun quasi-doublon parmi les questions actives', () => {
  const pairs = nearDuplicatePairs(questions);
  assert.deepEqual(
    pairs,
    [],
    `paires trop proches : ${pairs.map(p => `${p.a}~${p.b} (${p.score})`).join(', ')}`,
  );
});

test('chaque thème couvre au moins 12 sous-dimensions distinctes', () => {
  // Garde-fou de couverture : remplacer les questions difficiles par des variantes d'une même
  // idée ferait monter le poids d'une seule opinion sans que rien ne le signale.
  for (const theme of THEMES_ORDER) {
    const clusters = questions
      .filter(q => q.theme === theme)
      .map(q => rawById.get(q.id).cluster);
    const distinct = new Set(clusters);
    assert.ok(
      distinct.size >= 12,
      `${theme} : ${distinct.size} sous-dimensions pour 16 questions (${[...distinct].join(', ')})`,
    );
    for (const c of clusters) assert.ok(c && c.trim(), `${theme} : sous-dimension vide`);
  }
});

test('chaque thème contient des formulations dans les deux sens', () => {
  const balance = directionBalance(questions, THEMES_ORDER);
  const bad = balance.filter(b => !b.ok);
  assert.deepEqual(
    bad.map(b => `${b.theme}: +1=${b.plus} / -1=${b.minus}`),
    [],
    `un thème doit compter au moins ${MIN_MINORITY_DIRECTION} formulations dans le sens minoritaire`,
  );
});

// ─── Exceptions ──────────────────────────────────────────────────────────────

test('les exceptions éditoriales sont nominatives, actives et utiles', () => {
  for (const [id, entry] of Object.entries(RULE_EXCEPTIONS)) {
    assert.ok(activeById.has(id), `exception sur ${id}, qui n'est pas une question active`);
    assert.ok(entry.reason && entry.reason.length > 40, `${id} : justification trop courte`);
    assert.ok(entry.rules?.length, `${id} : aucune règle visée`);
    // Une exception qui ne supprime plus rien est une dette : la règle a été contournée
    // puis le texte corrigé, ou la règle a changé. Dans les deux cas elle doit disparaître.
    const raw = rawById.get(id);
    const withoutException = analyseQuestion({ ...raw, id: `${id}__probe` }, activeById.get(id));
    const suppressed = withoutException.filter(f => entry.rules.includes(f.rule));
    assert.ok(
      suppressed.length > 0,
      `exception ${id} devenue inutile (aucune règle ${entry.rules.join('/')} ne se déclenche)`,
    );
  }
});

// ─── Identifiants et historique ──────────────────────────────────────────────

test('aucun identifiant retiré n’est réutilisé pour une autre opinion', () => {
  // Un ID de question est un identifiant de DONNÉE : des réponses persistées y sont
  // rattachées. Le registre fige le texte au moment du retrait ; si quelqu'un réaffecte
  // l'ID à une autre proposition politique, ce test tombe.
  for (const entry of retiredRegistry.retired) {
    const raw = rawById.get(entry.id);
    assert.ok(raw, `${entry.id} du registre est absent de questions_final.json`);
    assert.equal(
      raw.text,
      entry.textAtRetirement,
      `${entry.id} : le texte a changé après retrait — un ID retiré ne doit jamais porter une nouvelle opinion`,
    );
    assert.ok(!activeById.has(entry.id), `${entry.id} est retiré mais sert encore`);
    assert.ok(entry.reason?.length > 15, `${entry.id} : motif de retrait non consigné`);
    assert.match(entry.retiredAt, /^\d{4}-\d{2}(-\d{2})?$/, `${entry.id} : date de retrait invalide`);
  }
  const registryIds = new Set(retiredRegistry.retired.map(e => e.id));
  for (const id of EDITORIALLY_RETIRED_IDS) {
    assert.ok(registryIds.has(id), `${id} retiré du questionnaire mais absent du registre`);
  }
});

test('les identifiants créés en 2026-08 ne recyclent aucun identifiant existant', () => {
  const created = retiredRegistry.created ?? [];
  assert.ok(created.length > 0, 'le registre doit consigner les identifiants créés');
  for (const entry of created) {
    assert.ok(activeById.has(entry.id), `${entry.id} déclaré créé mais non actif`);
    assert.ok(!EDITORIALLY_RETIRED_IDS.has(entry.id), `${entry.id} créé ET retiré`);
    assert.ok(entry.reason?.length > 15, `${entry.id} : raison de création non consignée`);
  }
});

test('la version du questionnaire change quand la banque change', () => {
  // Une banque révisée servie sous l'ancienne version rend incomparables deux profils
  // calculés sur des questions différentes.
  assert.match(QUESTIONNAIRE_VERSION, /^2026\.08-/, 'QUESTIONNAIRE_VERSION non incrémentée');
});

// ─── Contenu pédagogique rattaché ────────────────────────────────────────────

test('aucun contenu pédagogique ne pointe vers une question inactive', () => {
  const orphans = [];
  const check = (source, ids) => {
    for (const id of ids) if (!activeById.has(id)) orphans.push(`${source} → ${id}`);
  };
  check('questionHints', Object.keys(questionHints));
  check('questionExplanations', Object.keys(QUESTION_EXPLANATIONS));
  check('conceptMap', Object.keys(QUESTION_CONCEPTS));
  assert.deepEqual(orphans, [], `contenus orphelins :\n${orphans.join('\n')}`);
});

test('chaque question active porte une explication non vide', () => {
  const missing = questions
    .filter(q => !(rawById.get(q.id)?.explanation || '').trim())
    .map(q => q.id);
  assert.deepEqual(missing, [], `explications manquantes : ${missing.join(', ')}`);
});
