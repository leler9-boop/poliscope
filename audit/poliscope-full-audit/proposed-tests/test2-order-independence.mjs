#!/usr/bin/env node
// TEST 2 — Independance a l'ordre des reponses
// Construire le MEME jeu de reponses en inserant les cles (id de question) dans
// des ordres differents ne doit RIEN changer au profil calcule. calculateProfile
// itere sur la liste des questions (pas sur Object.keys(answers)), donc le
// resultat doit etre invariant par permutation des cles de l'objet `answers`.
//
// Execution : node test2-order-independence.mjs

import { register } from 'node:module';
register('./_json-import-loader.mjs', import.meta.url);

const { calculateProfile } = await import('../../../src/engine/scorer.js');
const { questions } = await import('../../../src/data/questions.js');

function buildSampleAnswers() {
  const byTheme = {};
  questions.forEach(q => { (byTheme[q.theme] ??= []).push(q); });
  const answers = {};
  Object.values(byTheme).forEach(list => {
    list.slice(0, 6).forEach((q, i) => { answers[q.id] = (i % 5) + 1; });
  });
  return answers;
}

const baseline = buildSampleAnswers();
const entries = Object.entries(baseline);

// Ordre A : tel que genere (ordre "naturel" des questions actives)
const answersA = {};
entries.forEach(([k, v]) => { answersA[k] = v; });

// Ordre B : insertion inversee
const answersB = {};
[...entries].reverse().forEach(([k, v]) => { answersB[k] = v; });

// Ordre C : insertion triee alphabetiquement par id (ordre encore different de A et B)
const answersC = {};
[...entries]
  .sort((a, b) => a[0].localeCompare(b[0]))
  .forEach(([k, v]) => { answersC[k] = v; });

// Ordre D : insertion "melangee" deterministe (par longueur d'id puis id)
const answersD = {};
[...entries]
  .sort((a, b) => (a[0].length - b[0].length) || b[0].localeCompare(a[0]))
  .forEach(([k, v]) => { answersD[k] = v; });

const rA = calculateProfile(answersA);
const rB = calculateProfile(answersB);
const rC = calculateProfile(answersC);
const rD = calculateProfile(answersD);

const sA = JSON.stringify(rA);
const sB = JSON.stringify(rB);
const sC = JSON.stringify(rC);
const sD = JSON.stringify(rD);
const pass = sA === sB && sA === sC && sA === sD;

console.log('=== TEST 2: Independance a l\'ordre d\'insertion des reponses ===');
console.log('Cles, ordre A (naturel)  :', Object.keys(answersA).slice(0, 5), '...');
console.log('Cles, ordre B (inverse)  :', Object.keys(answersB).slice(0, 5), '...');
console.log('Cles, ordre C (alpha)    :', Object.keys(answersC).slice(0, 5), '...');
console.log('Cles, ordre D (melange)  :', Object.keys(answersD).slice(0, 5), '...');
console.log('themes (ordre A):', rA.themes);
console.log('themes (ordre B):', rB.themes);
console.log('themes (ordre C):', rC.themes);
console.log('themes (ordre D):', rD.themes);
console.log(pass
  ? 'RESULTAT: PASS -- le profil est identique quel que soit l\'ordre d\'insertion des cles.'
  : 'RESULTAT: FAIL -- le profil calcule depend de l\'ordre d\'insertion des cles (bug potentiel).');

process.exit(pass ? 0 : 1);
