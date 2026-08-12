// POLISCOP — Le contrat de la graine de tirage, et ce que la file doit garantir.
//
// DÉFAUT REPRODUIT
// ----------------
// Des tests appelaient `getQuestionQueue(mode, THEMES_ORDER, { seed })`. Or le troisième
// paramètre est la graine ELLE-MÊME, interpolée dans une chaîne : `createRng(`${seed}:${t}`)`.
// Un objet y devient `"[object Object]"`, identique pour toute valeur de `seed`. Les trois
// « graines » 1, 7 et 42 produisaient donc la même file, et une matrice présentée comme
// « déterministe sur trois graines » ne mesurait qu'une seule graine trois fois.
//
// C'est le pire genre de test : il passe, il rassure, et il ne teste rien. Les assertions
// ci-dessous exigent donc les DEUX sens — reproductibilité ET variation réelle — car seule
// leur conjonction distingue un tirage à graine d'un tirage figé.

import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  getQuestionQueue, questions, coreQuestions, THEMES_ORDER, TEST_MODES, canonicalMode,
} from '../../src/data/questions.js';

const MODES = [['quick', 16], ['standard', 32], ['deep', 64]];
const SEEDS = [1, 7, 42, 'abc', 12345];

const ids = queue => queue.map(q => q.id);

// ─── Le contrat d'appel ─────────────────────────────────────────────────────

test('la graine est un SCALAIRE : un objet ne fait pas varier le tirage', () => {
  const objetA = ids(getQuestionQueue('deep', THEMES_ORDER, { seed: 1 })).join(',');
  const objetB = ids(getQuestionQueue('deep', THEMES_ORDER, { seed: 42 })).join(',');
  assert.equal(objetA, objetB,
    'deux objets distincts donnent la même file : ils deviennent tous "[object Object]"');

  const scalaireA = ids(getQuestionQueue('deep', THEMES_ORDER, 1)).join(',');
  const scalaireB = ids(getQuestionQueue('deep', THEMES_ORDER, 42)).join(',');
  assert.notEqual(scalaireA, scalaireB,
    'avec de vraies graines, les files DOIVENT différer — sinon la graine ne sert à rien');
});

test('aucun appel du dépôt ne passe un objet comme graine', async () => {
  const { readdir, readFile } = await import('node:fs/promises');
  const racines = ['tests', 'src', 'scripts'];
  const fautifs = [];

  async function parcourir(dir) {
    let entries;
    try { entries = await readdir(new URL(`../../${dir}/`, import.meta.url), { withFileTypes: true }); }
    catch { return; }
    for (const e of entries) {
      const chemin = `${dir}/${e.name}`;
      if (e.isDirectory()) { await parcourir(chemin); continue; }
      if (!/\.(mjs|js|jsx)$/.test(e.name)) continue;
      // Ce fichier-ci démontre le défaut à dessein : l'exclure nommément vaut mieux
      // qu'assouplir le motif, qui laisserait alors passer de vrais appels fautifs.
      if (chemin.endsWith('question-queue-seed-contract.test.mjs')) continue;
      const src = await readFile(new URL(`../../${chemin}`, import.meta.url), 'utf8');
      // On cherche un accolade ouvrante en troisième position d'appel.
      if (/getQuestionQueue\([^)]*,\s*\{/.test(src)) fautifs.push(chemin);
    }
  }
  for (const r of racines) await parcourir(r);
  assert.deepEqual(fautifs, [],
    'ces fichiers passent un objet là où la fonction attend une graine scalaire');
});

// ─── Reproductibilité ET variation ──────────────────────────────────────────

test('même graine, même file — pour chaque mode', () => {
  for (const [mode] of MODES) {
    for (const seed of SEEDS) {
      const a = ids(getQuestionQueue(mode, THEMES_ORDER, seed));
      const b = ids(getQuestionQueue(mode, THEMES_ORDER, seed));
      assert.deepEqual(a, b, `${mode} n'est pas reproductible avec la graine ${seed}`);
    }
  }
});

test('graines différentes, questions tirées différentes', () => {
  // Le mode Découverte est intégralement CORE : rien n'y est tiré, donc rien n'y varie.
  // C'est une propriété voulue, pas un défaut — on ne l'exige donc que là où il y a tirage.
  for (const [mode, taille] of MODES) {
    const tirage = queue => ids(queue).filter(id => !coreQuestions.some(c => c.id === id));
    const echantillons = SEEDS.map(s => tirage(getQuestionQueue(mode, THEMES_ORDER, s)).join(','));
    if (taille === coreQuestions.length) {
      assert.deepEqual([...new Set(echantillons)], [''],
        'un mode entièrement CORE ne doit rien tirer au hasard');
      continue;
    }
    assert.ok(new Set(echantillons).size > 1,
      `${mode} produit le même tirage pour ${SEEDS.length} graines : la graine est ignorée`);
  }
});

test('les CORE obligatoires sont les mêmes quelle que soit la graine', () => {
  const attendus = coreQuestions.map(q => q.id).sort();
  for (const [mode] of MODES) {
    for (const seed of SEEDS) {
      const presents = ids(getQuestionQueue(mode, THEMES_ORDER, seed))
        .filter(id => attendus.includes(id)).sort();
      assert.deepEqual(presents, attendus,
        `${mode} (graine ${seed}) ne sert pas toutes les questions CORE`);
    }
  }
});

// ─── Forme de la file ───────────────────────────────────────────────────────

test('chaque mode sert exactement le nombre de questions annoncé', () => {
  for (const [mode, taille] of MODES) {
    for (const seed of SEEDS) {
      assert.equal(getQuestionQueue(mode, THEMES_ORDER, seed).length, taille,
        `${mode} (graine ${seed}) ne sert pas ${taille} questions`);
    }
  }
});

test('aucun doublon dans une file', () => {
  for (const [mode] of MODES) {
    for (const seed of SEEDS) {
      const liste = ids(getQuestionQueue(mode, THEMES_ORDER, seed));
      assert.equal(new Set(liste).size, liste.length,
        `${mode} (graine ${seed}) sert deux fois la même question`);
    }
  }
});

test('les huit thèmes sont représentés dans chaque mode', () => {
  for (const [mode] of MODES) {
    for (const seed of SEEDS) {
      const themes = new Set(getQuestionQueue(mode, THEMES_ORDER, seed).map(q => q.theme));
      assert.equal(themes.size, THEMES_ORDER.length,
        `${mode} (graine ${seed}) ne couvre que ${themes.size} thèmes`);
    }
  }
});

test('la file rend les OBJETS complets attendus par l’interface, pas des identifiants', () => {
  // `Questionnaire.jsx` lit `text`, `theme`, `direction` et `status` directement sur les
  // éléments de la file. Une file d'identifiants passerait tous les tests de comptage et
  // afficherait une page vide.
  for (const [mode] of MODES) {
    for (const q of getQuestionQueue(mode, THEMES_ORDER, 7)) {
      assert.equal(typeof q, 'object', 'la file doit contenir des objets question');
      assert.equal(typeof q.id, 'string');
      assert.ok(q.text && q.text.length > 0, `${q.id} n'a pas de formulation affichable`);
      assert.ok(THEMES_ORDER.includes(q.theme), `${q.id} porte un thème inconnu`);
      assert.ok(q.direction === 1 || q.direction === -1, `${q.id} n'a pas de direction valide`);
      assert.ok(['CORE', 'PRIMARY', 'SECONDARY'].includes(q.status), `${q.id} n'a pas de statut`);
      assert.notEqual(q.isDuplicate, true, `${q.id} est marquée doublon et ne doit pas être servie`);
    }
  }
});

test('les alias de mode donnent la même file que leur forme canonique', () => {
  for (const [alias, canonique] of [['discovery', 'quick'], ['full', 'deep']]) {
    if (canonicalMode(alias) !== canonicalMode(canonique)) continue;
    assert.deepEqual(
      ids(getQuestionQueue(alias, THEMES_ORDER, 3)),
      ids(getQuestionQueue(canonique, THEMES_ORDER, 3)),
      `l'alias ${alias} ne produit pas la file de ${canonique}`,
    );
  }
  assert.ok(Object.values(TEST_MODES).length >= 3);
});

// ─── Les questions spécialisées marquées ────────────────────────────────────

test('exactement 18 questions portent la demande d’influence', () => {
  assert.equal(questions.filter(q => q.voteInfluencePrompt).length, 18);
});

test('aucune question CORE ne porte la demande d’influence', () => {
  const fautives = questions
    .filter(q => q.voteInfluencePrompt && q.status === 'CORE').map(q => q.id);
  assert.deepEqual(fautives, [],
    'les CORE structurent le profil : y greffer une décision précise mélangerait deux rôles');
});

test('chaque question marquée porte une justification non vide', () => {
  const sans = questions
    .filter(q => q.voteInfluencePrompt)
    .filter(q => typeof q.voteInfluenceReason !== 'string' || q.voteInfluenceReason.trim().length < 10)
    .map(q => q.id);
  assert.deepEqual(sans, [],
    'marquer une question sans dire POURQUOI empêche toute relecture éditoriale');
});

test('les questions marquées couvrent plusieurs thèmes', () => {
  const themes = new Set(questions.filter(q => q.voteInfluencePrompt).map(q => q.theme));
  assert.ok(themes.size >= 4,
    `les décisions d'influence ne portent que sur ${themes.size} thème(s) : le dispositif `
    + 'privilégierait structurellement certains sujets');
});
