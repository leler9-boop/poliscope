// POLISCOP — Reproductibilité de la file de questions.
//
// Avant : `Math.random()` sans graine. Deux passations du même mode ne posaient pas les
// mêmes questions et rien ne permettait de reconstituer celles qui avaient été servies.

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { getQuestionQueue, questions, THEMES_ORDER } from '../../src/data/questions.js';
import { createRng, seededShuffle, generateSeed } from '../../src/engine/rng.js';

const MODES = { discovery: 16, standard: 32, deep: 64 };

test('chaque mode sert exactement le nombre de questions annoncé', () => {
  for (const [mode, expected] of Object.entries(MODES)) {
    assert.equal(getQuestionQueue(mode, null, 'seed').length, expected, `mode ${mode}`);
  }
});

test('même graine + même mode = file strictement identique', () => {
  for (const mode of Object.keys(MODES)) {
    const a = getQuestionQueue(mode, null, 'graine-fixe').map(q => q.id);
    const b = getQuestionQueue(mode, null, 'graine-fixe').map(q => q.id);
    assert.deepEqual(a, b, `mode ${mode} non reproductible`);
  }
});

test('deux graines différentes produisent des files différentes (hors mode Découverte)', () => {
  for (const mode of ['standard', 'deep']) {
    const a = getQuestionQueue(mode, null, 'graine-A').map(q => q.id).join();
    const b = getQuestionQueue(mode, null, 'graine-B').map(q => q.id).join();
    assert.notEqual(a, b, `mode ${mode} : la graine n'a aucun effet`);
  }
});

test('le mode Découverte est entièrement déterministe (16 CORE, aucun tirage)', () => {
  const a = getQuestionQueue('discovery', null, 'X').map(q => q.id);
  const b = getQuestionQueue('discovery', null, 'Y').map(q => q.id);
  assert.deepEqual(a, b);
  assert.ok(a.every(id => questions.find(q => q.id === id).status === 'CORE'));
});

test('les quotas par thème sont respectés', () => {
  const caps = { discovery: 2, standard: 4, deep: 8 };
  for (const [mode, cap] of Object.entries(caps)) {
    const queue = getQuestionQueue(mode, null, 'seed');
    for (const theme of THEMES_ORDER) {
      assert.equal(queue.filter(q => q.theme === theme).length, cap, `${mode}/${theme}`);
    }
  }
});

test('aucun doublon dans une file', () => {
  for (const mode of Object.keys(MODES)) {
    const ids = getQuestionQueue(mode, null, 'seed').map(q => q.id);
    assert.equal(new Set(ids).size, ids.length, `doublon en mode ${mode}`);
  }
});

test('les questions CORE sont toujours servies', () => {
  const core = questions.filter(q => q.status === 'CORE').map(q => q.id);
  for (const mode of Object.keys(MODES)) {
    const ids = new Set(getQuestionQueue(mode, null, 'seed').map(q => q.id));
    for (const id of core) assert.ok(ids.has(id), `${id} absente en mode ${mode}`);
  }
});

test('l’ordre de priorité change l’ordre de présentation, pas le contenu', () => {
  const seed = 'ordre';
  const normal   = getQuestionQueue('standard', [...THEMES_ORDER], seed);
  const inverse  = getQuestionQueue('standard', [...THEMES_ORDER].reverse(), seed);
  assert.deepEqual(
    [...normal.map(q => q.id)].sort(),
    [...inverse.map(q => q.id)].sort(),
    'le contenu de la file ne doit pas dépendre de l’ordre des thèmes',
  );
  assert.notDeepEqual(normal.map(q => q.id), inverse.map(q => q.id));
});

test('le PRNG seedé est déterministe et borné dans [0, 1)', () => {
  const a = Array.from({ length: 200 }, createRng('s'));
  const rngA = createRng('s'); const rngB = createRng('s');
  for (let i = 0; i < 200; i++) {
    const v = rngA();
    assert.equal(v, rngB());
    assert.ok(v >= 0 && v < 1, `valeur hors bornes : ${v}`);
  }
  assert.equal(a.length, 200);
});

test('seededShuffle ne modifie pas le tableau d’entrée et conserve les éléments', () => {
  const input = [1, 2, 3, 4, 5, 6, 7, 8];
  const copy = [...input];
  const out = seededShuffle(input, createRng('x'));
  assert.deepEqual(input, copy, 'le tableau d’entrée a été muté');
  assert.deepEqual([...out].sort((a, b) => a - b), copy);
});

test('generateSeed produit des graines distinctes', () => {
  const seeds = new Set(Array.from({ length: 50 }, generateSeed));
  assert.ok(seeds.size > 45, 'collisions trop fréquentes sur les graines');
});
