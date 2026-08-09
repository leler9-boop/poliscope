// POLISCOP — Terminologie affichée : garde-fou de source.
//
// Le contre-audit du 2026-08-09 relevait que le rapport annonçait une « méthode honnête »
// alors que l'interface affichait toujours le score suffixé d'un `%` et les libellés
// « Profil robuste » / « Profil très fiable » / « Précision du profil ».
//
// Ces tests scannent le code source des surfaces utilisateur. Ils ne remplacent pas un test
// de rendu, mais ils empêchent la réintroduction des formulations précises qui posaient
// problème — ce qu'un test de rendu unitaire ne ferait pas mieux.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { formatProximity, coverageLabel, noScoreReason } from '../../src/engine/scoreDisplay.js';

const ROOT = fileURLToPath(new URL('../..', import.meta.url)).replace(/\/$/, '');

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(jsx?|mjs)$/.test(name)) out.push(p);
  }
  return out;
}

/** Fichiers pouvant contenir ces motifs légitimement : moteur d'affichage et commentaires. */
const EXEMPT = new Set([
  join(ROOT, 'src/engine/scoreDisplay.js'),   // définit les remplacements
  join(ROOT, 'src/engine/scorer.js'),         // commentaire historique documentant l'ancien libellé
]);

const SURFACE_DIRS = ['src/pages', 'src/components', 'src/i18n', 'src/engine'];
const surfaceFiles = SURFACE_DIRS.flatMap(d => walk(join(ROOT, d))).filter(f => !EXEMPT.has(f));

test('aucun score de matching n’est affiché suffixé d’un %', () => {
  // On cherche les interpolations JSX du type `{x.alignment}%` — le `%` d'une largeur CSS
  // (`width: ${x}%`) est explicitement autorisé et ne matche pas ce motif.
  const offenders = [];
  const pattern = /\{[^}]*\balignment\b[^}]*\}\s*%/;
  for (const file of surfaceFiles) {
    readFileSync(file, 'utf8').split('\n').forEach((line, i) => {
      if (line.includes('width') || line.includes('style')) return;
      if (pattern.test(line)) offenders.push(`${file.replace(ROOT + '/', '')}:${i + 1}`);
    });
  }
  assert.deepEqual(offenders, [],
    `l'indice de proximité doit s'afficher via formatProximity() (« xx/100 »), pas suffixé d'un % : ${offenders.join(', ')}`);
});

test('les libellés de fiabilité non validée n’apparaissent plus', () => {
  const FORBIDDEN = [
    'Profil robuste', 'Profil très fiable', 'Robust profile', 'Highly reliable profile',
    'Précision du profil', 'Profile accuracy',
  ];
  const offenders = [];
  for (const file of surfaceFiles) {
    const text = readFileSync(file, 'utf8');
    for (const term of FORBIDDEN) {
      if (text.includes(term)) offenders.push(`${file.replace(ROOT + '/', '')} → « ${term} »`);
    }
  }
  assert.deepEqual(offenders, [],
    `remplacer par un libellé de COUVERTURE (voir coverageLabel) : ${offenders.join(' | ')}`);
});

test('« compatibilité » n’est plus employé pour désigner l’indice', () => {
  const offenders = [];
  for (const file of surfaceFiles) {
    readFileSync(file, 'utf8').split('\n').forEach((line, i) => {
      if (/compatibilit[ée]|compatibility score/i.test(line) && !/html-to-image/.test(line)) {
        offenders.push(`${file.replace(ROOT + '/', '')}:${i + 1}`);
      }
    });
  }
  assert.deepEqual(offenders, [],
    `« proximité » décrit ce que le nombre mesure ; « compatibilité » promet un jugement qu'il ne porte pas : ${offenders.join(', ')}`);
});

test('formatProximity produit « xx/100 », jamais un pourcentage', () => {
  assert.equal(formatProximity(78), '78/100');
  assert.equal(formatProximity(0), '0/100');
  assert.equal(formatProximity(100), '100/100');
  assert.equal(formatProximity(78.6), '79/100');
  assert.equal(formatProximity(null), '—', 'un score absent ne doit pas devenir 0');
  assert.equal(formatProximity(undefined), '—');
  assert.equal(formatProximity(NaN), '—');
  for (const v of [0, 50, 100]) assert.ok(!formatProximity(v).includes('%'));
});

test('les libellés de couverture ne promettent aucune fiabilité', () => {
  const PROMISES = /fiable|reliable|précis|accurate|scientif/i;
  for (const key of ['very_low', 'low', 'medium', 'high', 'very_high']) {
    for (const lang of ['fr', 'en']) {
      const label = coverageLabel(key, lang);
      assert.ok(label && !PROMISES.test(label), `libellé trompeur : « ${label} »`);
    }
  }
});

test('chaque motif d’absence de score a un message utilisateur', () => {
  for (const reason of ['insufficient_coverage', 'no_weighted_theme', 'no_comparable_data']) {
    for (const lang of ['fr', 'en']) {
      const msg = noScoreReason(reason, lang);
      assert.ok(typeof msg === 'string' && msg.length > 10, `message manquant pour ${reason}/${lang}`);
    }
  }
});

test('le partage avertit du caractère sensible du lien', () => {
  const modal = readFileSync(join(ROOT, 'src/components/ProfileShareModal.jsx'), 'utf8');
  assert.ok(
    /contient tes scores politiques|contains your political scores/i.test(modal),
    'le lien de partage encode les huit scores : l’avertissement doit précéder la copie',
  );
});
