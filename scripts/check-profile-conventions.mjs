#!/usr/bin/env node
// Garde-fou : cohérence des conventions d'échelle entre les fichiers de profils politiques.
//
// Convention canonique (celle de scorer.js / matcher.js / CompareBar.jsx) :
//   ECONOMY    haut = marché libre        SOCIAL  haut = progressiste
//   IMMIGRATION haut = restrictif         SECURITY haut = sécuritaire ("law & order")
//   ENVIRONMENT haut = écologie           DEMOCRACY haut = participatif
//   GLOBAL      haut = multilatéral/pro-UE PUBLIC_SERVICES haut = pro-services publics
//
// Contexte : en 2026-07, frenchFigures.js avait IMMIGRATION/SECURITY inversés (haut = ouvert)
// et ideologicalCurrents.js avait GLOBAL inversé (haut = souverainiste) pour 11 courants sur 12 —
// la même personne (ex. Bardella) avait IMMIGRATION 5 en figure et 96 en candidat 2027.
// Ce script détecte mécaniquement ce type de dérive. Exécution : node scripts/check-profile-conventions.mjs

import { register } from 'node:module';
register(new URL('../audit/poliscop-full-audit/proposed-tests/_json-import-loader.mjs', import.meta.url));

const { frenchFigures } = await import('../src/data/frenchFigures.js');
const { elections } = await import('../src/data/elections.js');
const { ideologicalCurrents } = await import('../src/data/ideologicalCurrents.js');

const THEMES = ['ECONOMY','SOCIAL','IMMIGRATION','SECURITY','ENVIRONMENT','DEMOCRACY','GLOBAL','PUBLIC_SERVICES'];
const MAX_CROSS_FILE_DELTA = 35; // au-delà, la même personne a deux positions incompatibles
let failures = 0;

// 1) Miroir figure ↔ candidat d'élection (toutes élections, correspondance par nom exact)
const allCandidates = elections.flatMap(e => (e.candidates ?? []).map(c => ({ ...c, election: e.id })));
for (const fig of frenchFigures) {
  for (const cand of allCandidates.filter(c => c.name === fig.name && c.profile)) {
    for (const t of THEMES) {
      const d = Math.abs((fig.profile[t] ?? 50) - (cand.profile[t] ?? 50));
      if (d > MAX_CROSS_FILE_DELTA) {
        failures++;
        console.error(`✗ ${fig.name} — ${t}: figure=${fig.profile[t]} vs ${cand.election}=${cand.profile[t]} (écart ${d})`);
      }
    }
  }
}

// 2) Ancrages sémantiques non ambigus (valeurs qui ne peuvent pas être du mauvais côté de 50)
const ANCHORS = [
  ['figure', () => frenchFigures.find(f => f.name === 'Marine Le Pen')?.profile.IMMIGRATION, v => v > 50, 'Le Pen IMMIGRATION doit être côté restrictif (>50)'],
  ['figure', () => frenchFigures.find(f => f.name === 'Marine Tondelier')?.profile.ENVIRONMENT, v => v > 50, 'Tondelier ENVIRONMENT doit être côté écologie (>50)'],
  ['figure', () => frenchFigures.find(f => f.name === 'Emmanuel Macron')?.profile.GLOBAL, v => v > 50, 'Macron GLOBAL doit être côté multilatéral (>50)'],
  ['courant', () => ideologicalCurrents.find(c => c.id === 'national_conservatism')?.profile.GLOBAL, v => v < 50, 'national_conservatism GLOBAL doit être côté souveraineté (<50)'],
  ['courant', () => ideologicalCurrents.find(c => c.id === 'social_democracy')?.profile.GLOBAL, v => v > 50, 'social_democracy GLOBAL doit être côté multilatéral (>50)'],
  ['courant', () => ideologicalCurrents.find(c => c.id === 'classical_liberalism')?.profile.GLOBAL, v => v > 50, 'classical_liberalism GLOBAL doit être côté libre-échange mondial (>50)'],
  ['courant', () => ideologicalCurrents.find(c => c.id === 'progressivism')?.profile.IMMIGRATION, v => v < 50, 'progressivism IMMIGRATION doit être côté ouvert (<50)'],
];
for (const [kind, get, ok, msg] of ANCHORS) {
  const v = get();
  if (v == null || !ok(v)) { failures++; console.error(`✗ ancrage ${kind} : ${msg} (valeur actuelle : ${v})`); }
}

if (failures) {
  console.error(`\nRESULTAT: FAIL — ${failures} incohérence(s) de convention détectée(s).`);
  process.exit(1);
}
console.log('RESULTAT: PASS — conventions cohérentes entre frenchFigures.js, elections.js et ideologicalCurrents.js.');
