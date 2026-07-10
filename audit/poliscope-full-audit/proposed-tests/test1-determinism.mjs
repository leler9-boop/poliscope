#!/usr/bin/env node
// TEST 1 — Determinisme
// Les memes reponses doivent TOUJOURS produire le meme profil (themes, axes,
// confiance). Deux appels a calculateProfile() avec le meme objet `answers`
// doivent renvoyer un resultat strictement identique (deep-equal).
//
// Execution : node test1-determinism.mjs

import { register } from 'node:module';
register('./_json-import-loader.mjs', import.meta.url);

const { calculateProfile } = await import('../../../src/engine/scorer.js');
const { questions } = await import('../../../src/data/questions.js');

// Construit un jeu de reponses realiste couvrant les 8 themes (jusqu'a 5 questions/theme,
// valeurs Likert variees 1..5) a partir de la banque de questions REELLEMENT servie par
// l'app (questions actives, non-dupliquees).
function buildSampleAnswers() {
  const byTheme = {};
  questions.forEach(q => { (byTheme[q.theme] ??= []).push(q); });

  const answers = {};
  Object.values(byTheme).forEach(list => {
    list.slice(0, 5).forEach((q, i) => { answers[q.id] = (i % 5) + 1; });
  });
  return answers;
}

const answers = buildSampleAnswers();
const run1 = calculateProfile(answers);
const run2 = calculateProfile(answers);

const s1 = JSON.stringify(run1);
const s2 = JSON.stringify(run2);
const pass = s1 === s2;

console.log('=== TEST 1: Determinisme de calculateProfile ===');
console.log('Nombre de reponses testees :', Object.keys(answers).length, '/', questions.length, 'questions actives');
console.log('Run 1 -> themes:', run1.themes);
console.log('Run 2 -> themes:', run2.themes);
console.log('Run 1 -> axes:', run1.axes, '| confidence:', run1.confidence);
console.log('Run 2 -> axes:', run2.axes, '| confidence:', run2.confidence);
console.log(pass
  ? 'RESULTAT: PASS -- les deux executions sont rigoureusement identiques.'
  : 'RESULTAT: FAIL -- divergence detectee entre les deux executions.');
if (!pass) {
  console.log('run1 JSON:', s1);
  console.log('run2 JSON:', s2);
}

process.exit(pass ? 0 : 1);
