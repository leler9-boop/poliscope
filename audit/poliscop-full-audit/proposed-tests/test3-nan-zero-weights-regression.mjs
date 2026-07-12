#!/usr/bin/env node
// TEST 3 — Regression NaN/Infinity (division par zero dans calculateAlignment)
//
// calculateAlignment() DEVRAIT toujours renvoyer un entier fini dans [0, 100].
// Ce script reproduit le bug mathematique deja confirme par un autre agent de
// l'audit (biais de score / division par zero) : quand `themeWeights` alloue un
// poids de 0 aux 8 themes (allocation utilisateur "Priorites" non remplie ou
// remise a zero avant soumission), `totalWeight` vaut 0 dans
// calculateAlignment(), et `meanDistance = weightedDistanceSum / totalWeight`
// devient 0/0 = NaN, qui se propage jusqu'au score final.
//
// STATUT ATTENDU AU MOMENT DE CET AUDIT : CE TEST ECHOUE (exit code 1).
// C'est volontaire : le but n'est pas de faire passer le test, mais de
// DOCUMENTER PAR LA PREUVE l'existence du bug via un cas reproductible. Une
// fois le bug corrige dans matcher.js (ex: fallback sur un poids uniforme
// quand totalWeight === 0), ce test devra passer sans modification.
//
// Execution : node test3-nan-zero-weights-regression.mjs

import { register } from 'node:module';
register('./_json-import-loader.mjs', import.meta.url);

const { calculateAlignment } = await import('../../../src/engine/matcher.js');
const { THEMES_ORDER } = await import('../../../src/data/questions.js');

const userThemes    = Object.fromEntries(THEMES_ORDER.map(t => [t, 60]));
const targetProfile = Object.fromEntries(THEMES_ORDER.map(t => [t, 40]));
// Allocation "Priorites" degenerescente : 0 point alloue a chacun des 8 themes.
const zeroWeights = Object.fromEntries(THEMES_ORDER.map(t => [t, 0]));

console.log('=== TEST 3: Regression NaN/Infinity quand tous les poids de theme sont a 0 ===');
console.log('userThemes    :', userThemes);
console.log('targetProfile :', targetProfile);
console.log('themeWeights envoye (allocation utilisateur degenerescente) :', zeroWeights);

const result = calculateAlignment(userThemes, targetProfile, undefined, zeroWeights);

console.log('Resultat de calculateAlignment(userThemes, targetProfile, undefined, zeroWeights) =', result);

const isFinite_ = Number.isFinite(result);
const inRange   = isFinite_ && result >= 0 && result <= 100;

if (inRange) {
  console.log('RESULTAT: PASS -- le moteur protege correctement contre une allocation de poids totalement nulle.');
} else {
  console.log(`RESULTAT: FAIL (ATTENDU) -- calculateAlignment renvoie ${result} au lieu d'un score entier 0-100.`);
  console.log('Cause racine (matcher.js, calculateAlignment) : meanDistance = weightedDistanceSum / totalWeight');
  console.log('  -> avec themeWeights tous a 0, totalWeight = 0 et weightedDistanceSum = 0, donc meanDistance = 0/0 = NaN.');
  console.log('  -> NaN se propage a travers Math.pow(...), puis Math.round(...), et Math.max(0, Math.min(100, NaN)) = NaN.');
}

process.exit(inRange ? 0 : 1);
