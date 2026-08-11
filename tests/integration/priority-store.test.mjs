// POLISCOP — Contrat de priorités côté store (défaut P0-B).
//
// DÉFAUT REPRODUIT
// ----------------
// `setThemeImportanceLevel()` reconstruisait `{levels, source, updatedAt}` SANS reporter
// `answered`. Chaque modification effaçait donc les marqueurs des autres thèmes, et un
// « moyennement important » explicitement choisi redevenait indiscernable d'un niveau non
// renseigné — la distinction établie par le correctif du défaut A disparaissait au premier
// changement d'avis.

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { useStore } from '../../src/store/useStore.js';
import {
  IMPORTANCE_LEVEL, PRIORITY_SOURCE, normalizeThemeImportance,
  isExplicitlyAnswered, answeredThemeCount,
} from '../../src/engine/priorityWeights.js';
import { THEMES_ORDER } from '../../src/data/questions.js';

const reset = () => useStore.setState({ themeImportance: null, priorityOrder: [...THEMES_ORDER] });

test('des modifications successives conservent TOUS les marqueurs answered', () => {
  reset();
  const { setThemeImportanceLevel } = useStore.getState();

  setThemeImportanceLevel(THEMES_ORDER[0], IMPORTANCE_LEVEL.VERY_HIGH);
  setThemeImportanceLevel(THEMES_ORDER[1], IMPORTANCE_LEVEL.NOT);
  setThemeImportanceLevel(THEMES_ORDER[2], IMPORTANCE_LEVEL.MEDIUM);

  const state = normalizeThemeImportance({ themeImportance: useStore.getState().themeImportance });
  assert.equal(answeredThemeCount(state), 3, 'des marqueurs ont été perdus en cours de route');
  assert.equal(state.levels[THEMES_ORDER[0]], IMPORTANCE_LEVEL.VERY_HIGH);
  assert.equal(state.levels[THEMES_ORDER[1]], IMPORTANCE_LEVEL.NOT);
  assert.equal(state.levels[THEMES_ORDER[2]], IMPORTANCE_LEVEL.MEDIUM);
  for (const t of THEMES_ORDER.slice(3)) {
    assert.equal(isExplicitlyAnswered(state, t), false, `${t} marqué à tort comme choisi`);
  }
});

test('un « moyennement important » explicite reste un choix après une autre modification', () => {
  reset();
  const { setThemeImportanceLevel } = useStore.getState();
  setThemeImportanceLevel(THEMES_ORDER[0], IMPORTANCE_LEVEL.MEDIUM);
  setThemeImportanceLevel(THEMES_ORDER[5], IMPORTANCE_LEVEL.HIGH);

  const state = normalizeThemeImportance({ themeImportance: useStore.getState().themeImportance });
  assert.equal(isExplicitlyAnswered(state, THEMES_ORDER[0]), true,
    'le choix explicite « moyennement important » a été dégradé en non-réponse');
  assert.equal(state.levels[THEMES_ORDER[0]], IMPORTANCE_LEVEL.MEDIUM);
});

test('changer d’avis sur un même thème ne duplique ni ne perd le marqueur', () => {
  reset();
  const { setThemeImportanceLevel } = useStore.getState();
  setThemeImportanceLevel(THEMES_ORDER[0], IMPORTANCE_LEVEL.LOW);
  setThemeImportanceLevel(THEMES_ORDER[0], IMPORTANCE_LEVEL.VERY_HIGH);

  const state = normalizeThemeImportance({ themeImportance: useStore.getState().themeImportance });
  assert.equal(answeredThemeCount(state), 1);
  assert.equal(state.levels[THEMES_ORDER[0]], IMPORTANCE_LEVEL.VERY_HIGH);
});

test('la modification depuis Profil emploie le même contrat que l’écran initial', () => {
  reset();
  useStore.getState().setThemeImportance({
    levels: Object.fromEntries(THEMES_ORDER.map(t => [t, IMPORTANCE_LEVEL.MEDIUM])),
    answered: Object.fromEntries(THEMES_ORDER.map(t => [t, true])),
    source: PRIORITY_SOURCE.EQUAL,
  });
  useStore.getState().setThemeImportanceLevel(THEMES_ORDER[3], IMPORTANCE_LEVEL.VERY_HIGH);

  const state = normalizeThemeImportance({ themeImportance: useStore.getState().themeImportance });
  assert.equal(answeredThemeCount(state), THEMES_ORDER.length,
    'modifier un thème après le raccourci ne doit pas effacer les sept autres décisions');
  assert.equal(state.source, PRIORITY_SOURCE.INDEPENDENT,
    'après une évaluation individuelle, la source doit refléter ce parcours');
});

test('la modification ne touche JAMAIS aux réponses politiques', () => {
  reset();
  useStore.setState({ answers: { ECO_1: 4, SOC_7: 2 } });
  useStore.getState().setThemeImportanceLevel(THEMES_ORDER[0], IMPORTANCE_LEVEL.NOT);
  assert.deepEqual(useStore.getState().answers, { ECO_1: 4, SOC_7: 2 });
});
