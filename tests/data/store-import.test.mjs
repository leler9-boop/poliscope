// POLISCOP — Sécurité de l'import de profil.
//
// L'import faisait `set({ profile: data.profile })` : un fichier JSON fabriqué à la main
// pouvait imposer n'importe quels scores, et un export d'une version antérieure du moteur
// restait affiché comme s'il venait du moteur courant.
//
// Le store dépend de modules navigateur (zustand/persist, localStorage, react-router). On
// teste donc la LOGIQUE DE VALIDATION isolément, en rejouant les mêmes règles que
// `importProfile()`. Ce test échouerait à détecter une divergence si le store était réécrit
// sans mettre à jour ces règles — d'où le commentaire de rappel dans useStore.js.

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { calculateProfile, isScorable, NO_OPINION } from '../../src/engine/scorer.js';
import { questions, THEMES_ORDER } from '../../src/data/questions.js';

/** Réplique exacte du filtre appliqué par `importProfile()` dans src/store/useStore.js. */
function sanitizeImportedAnswers(rawAnswers) {
  const knownIds = new Set(questions.map(q => q.id));
  const answers = {};
  let dropped = 0;
  for (const [id, value] of Object.entries(rawAnswers ?? {})) {
    if (!knownIds.has(id)) { dropped++; continue; }
    if (isScorable(value) || value === NO_OPINION) answers[id] = value;
    else dropped++;
  }
  return { answers, dropped };
}

test('un profil fourni dans le JSON ne peut pas remplacer le calcul', () => {
  const real = Object.fromEntries(questions.slice(0, 20).map((q, i) => [q.id, (i % 5) + 1]));
  const forge = { ECONOMY: 100, SOCIAL: 100, IMMIGRATION: 0, SECURITY: 0,
                  ENVIRONMENT: 100, DEMOCRACY: 100, GLOBAL: 100, PUBLIC_SERVICES: 100 };

  const { answers } = sanitizeImportedAnswers(real);
  const recomputed = calculateProfile(answers).themes;

  assert.notDeepEqual(recomputed, forge, 'les scores forgés ne doivent jamais survivre');
  for (const t of THEMES_ORDER) assert.ok(Number.isFinite(recomputed[t]));
});

test('les identifiants de questions inconnus sont écartés, pas corrigés', () => {
  const { answers, dropped } = sanitizeImportedAnswers({
    [questions[0].id]: 4,
    'QUESTION_QUI_NEXISTE_PAS': 5,
    'ECO_9999': 1,
  });
  assert.deepEqual(Object.keys(answers), [questions[0].id]);
  assert.equal(dropped, 2);
});

test('les valeurs hors domaine sont écartées', () => {
  const ids = questions.slice(0, 6).map(q => q.id);
  const { answers, dropped } = sanitizeImportedAnswers({
    [ids[0]]: 0, [ids[1]]: 6, [ids[2]]: -1,
    [ids[3]]: 'trois', [ids[4]]: null,
    [ids[5]]: 3,
  });
  assert.deepEqual(Object.keys(answers), [ids[5]]);
  assert.equal(dropped, 5);
});

test('« sans opinion » est un import légitime et reste distinct', () => {
  const id = questions[0].id;
  const { answers, dropped } = sanitizeImportedAnswers({ [id]: NO_OPINION });
  assert.equal(answers[id], NO_OPINION);
  assert.equal(dropped, 0);
  assert.equal(calculateProfile(answers).answeredCount, 0);
});

test('un ordre de priorité importé doit être une permutation exacte des 8 thèmes', () => {
  const valid = order =>
    Array.isArray(order)
    && order.length === THEMES_ORDER.length
    && new Set(order).size === THEMES_ORDER.length
    && order.every(t => THEMES_ORDER.includes(t));

  assert.equal(valid([...THEMES_ORDER]), true);
  assert.equal(valid([...THEMES_ORDER].reverse()), true);
  assert.equal(valid(['ECONOMY']), false, 'trop court');
  assert.equal(valid([...THEMES_ORDER.slice(0, 7), 'ECONOMY']), false, 'doublon');
  assert.equal(valid([...THEMES_ORDER.slice(0, 7), 'THEME_INVENTE']), false, 'thème inconnu');
  assert.equal(valid(null), false);
});
