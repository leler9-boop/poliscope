// POLISCOP — Rendu RÉEL de la page Questionnaire.
//
// CE QUE CE TEST AURAIT ATTRAPÉ
// -----------------------------
// Le commit b169982 a ajouté un `useEffect` en haut du composant, qui lisait `question` et
// `currentAnswer` — déclarés une centaine de lignes plus bas, après le `return` conditionnel
// de la file vide. Le tableau de dépendances étant évalué à CHAQUE rendu, toute ouverture du
// quiz levait « Cannot access 'question' before initialization ». Le questionnaire était
// entièrement cassé.
//
// Ni `vite build` ni la suite ne l'ont vu : la compilation ne détecte pas une zone temporelle
// morte, et aucun test ne RENDAIT cette page. C'est exactement le trou par lequel deux pages
// blanches étaient déjà passées en juillet, et qui avait motivé tests/ui/render.test.mjs —
// mais Questionnaire n'y figurait pas.

import { test, before } from 'node:test';
import assert from 'node:assert/strict';

let h, renderToStaticMarkup, MemoryRouter, Questionnaire, useStore, questions;

before(async () => {
  ({ createElement: h } = await import('react'));
  ({ renderToStaticMarkup } = await import('react-dom/server'));
  ({ MemoryRouter } = await import('react-router-dom'));
  Questionnaire = (await import('../../src/pages/Questionnaire.jsx')).default;
  ({ useStore } = await import('../../src/store/useStore.js'));
  ({ questions } = await import('../../src/data/questions.js'));
});

const render = () => renderToStaticMarkup(h(MemoryRouter, null, h(Questionnaire)));

/** File réelle de trois questions, dont une marquée. */
function seedQueue({ index = 0, answers = {}, voteInfluence = {} } = {}) {
  const marked = questions.find(q => q.voteInfluencePrompt);
  const plain = questions.filter(q => !q.voteInfluencePrompt).slice(0, 2);
  const queue = [plain[0], marked, plain[1]];
  useStore.setState({
    questionsQueue: queue,
    queueQuestionIds: queue.map(q => q.id),
    currentQuestionIndex: index,
    answers,
    voteInfluence,
    testMode: 'standard',
    language: 'fr',
  });
  return queue;
}

test('la page se rend avec une file valide et une question courante', () => {
  // ⚠ On ne peut PAS mesurer la longueur du markup ici : la page est entièrement enveloppée
  // dans `AnimatePresence`/`motion`, qui ne produisent aucun markup statique côté serveur.
  // Vérifié : le rendu vaut 0 caractère avant comme après la régression. Le signal utile est
  // donc l'ABSENCE D'EXCEPTION — c'est exactement ce que la zone temporelle morte violait.
  seedQueue({ index: 0 });
  assert.doesNotThrow(() => render());
});

test('la page se rend sur une question MARQUÉE déjà répondue', () => {
  // Cas le plus exposé : l'effet d'ouverture de la demande lit `question` et `currentAnswer`.
  const queue = seedQueue({ index: 1, answers: {} });
  useStore.setState({ answers: { [queue[1].id]: 4 } });
  assert.doesNotThrow(() => render());
});

test('la page se rend sans file (avant hydratation)', () => {
  useStore.setState({ questionsQueue: [], queueQuestionIds: [], currentQuestionIndex: 0, answers: {} });
  assert.doesNotThrow(() => render());
});

test('la page se rend avec une file absente', () => {
  useStore.setState({ questionsQueue: undefined, queueQuestionIds: [], currentQuestionIndex: 0, answers: {} });
  assert.doesNotThrow(() => render());
});

test('un index hors limites ne fait pas planter la page', () => {
  seedQueue({ index: 99 });
  assert.doesNotThrow(() => render());
});

test('un index négatif ne fait pas planter la page', () => {
  seedQueue({ index: -1 });
  assert.doesNotThrow(() => render());
});

test('la page se rend sur chaque position de la file', () => {
  const queue = seedQueue({ index: 0 });
  for (let i = 0; i < queue.length; i++) {
    useStore.setState({ currentQuestionIndex: i });
    assert.doesNotThrow(() => render(), `plantage à l’index ${i}`);
  }
});

test('la page se rend avec une influence déjà enregistrée', () => {
  const queue = seedQueue({ index: 1 });
  useStore.setState({
    answers: { [queue[1].id]: 5 },
    voteInfluence: { [queue[1].id]: { level: 'none', multiplier: 0 } },
  });
  assert.doesNotThrow(() => render());
});
