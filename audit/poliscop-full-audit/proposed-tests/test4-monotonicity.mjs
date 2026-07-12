#!/usr/bin/env node
// TEST 4 — Monotonie
// Pour toute question dont `direction === 1`, augmenter la reponse (1 -> 2 -> 3
// -> 4 -> 5, donc accord croissant) ne doit JAMAIS faire baisser le score du
// theme correspondant. On teste CHAQUE question direction=1 de la banque active
// (pas un echantillon), avec une ligne de base realiste : deux autres questions
// du meme theme deja repondues (valeurs fixes), pour se rapprocher d'un profil
// partiellement rempli plutot que d'un cas trivial a une seule reponse.
//
// Execution : node test4-monotonicity.mjs

import { register } from 'node:module';
register('./_json-import-loader.mjs', import.meta.url);

const { calculateProfile } = await import('../../../src/engine/scorer.js');
const { questions } = await import('../../../src/data/questions.js');

const positiveQuestions = questions.filter(q => q.direction === 1);

console.log('=== TEST 4: Monotonie (questions direction=1) ===');
console.log('Questions actives totales :', questions.length);
console.log('Questions direction=1 testees :', positiveQuestions.length);

const failures = [];

positiveQuestions.forEach(target => {
  // Baseline realiste : jusqu'a 2 autres questions du meme theme deja repondues.
  const sameThemeOthers = questions
    .filter(q => q.theme === target.theme && q.id !== target.id)
    .slice(0, 2);

  const baseline = {};
  sameThemeOthers.forEach((q, i) => { baseline[q.id] = i % 2 === 0 ? 2 : 4; });

  const scores = [1, 2, 3, 4, 5].map(v => {
    const answers = { ...baseline, [target.id]: v };
    return calculateProfile(answers).themes[target.theme];
  });

  for (let i = 1; i < scores.length; i++) {
    if (scores[i] < scores[i - 1]) {
      failures.push({ id: target.id, theme: target.theme, scores });
      break;
    }
  }
});

console.log('Violations de monotonie detectees :', failures.length);
if (failures.length) {
  console.log('Detail (max 10 affichees) :');
  failures.slice(0, 10).forEach(f => {
    console.log(`  - ${f.id} (${f.theme}) : scores pour reponse=1..5 ->`, f.scores);
  });
}

const pass = failures.length === 0;
console.log(pass
  ? 'RESULTAT: PASS -- monotonie verifiee sur les ' + positiveQuestions.length + ' questions direction=1 de la banque active.'
  : 'RESULTAT: FAIL -- ' + failures.length + ' question(s) violent la monotonie attendue.');

process.exit(pass ? 0 : 1);
