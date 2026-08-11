// POLISCOP — Le mode « modification des priorités » doit survivre à un rechargement.
//
// DÉFAUT REPRODUIT : `priorityEditMode` n'est pas persisté — volontairement, pour ne pas
// laisser quelqu'un coincé dans un mode d'édition après avoir rouvert l'application. Mais
// recharger /priorities PENDANT une modification retombait alors en mode création : le bouton
// redevenait « Commencer le questionnaire » et la validation relançait un quiz, effaçant le
// parcours en cours. L'intention doit donc être portée par l'URL.

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { useStore } from '../../src/store/useStore.js';

/** Reproduit la lecture faite par PriorityRanking. */
const editModeFromUrl = (search) => new URLSearchParams(search).get('mode') === 'edit';

test('ouvrir l’éditeur depuis le profil marque l’intention dans l’URL', () => {
  useStore.setState({ priorityEditMode: false });
  useStore.getState().openPriorityEditor();
  assert.equal(useStore.getState().priorityEditMode, true);
});

test('après rechargement, l’URL suffit à restaurer le mode modification', () => {
  // Le drapeau mémoire est perdu (nouveau chargement de page) ; l'URL, elle, subsiste.
  useStore.setState({ priorityEditMode: false });
  assert.equal(editModeFromUrl('?mode=edit'), true,
    'le mode modification doit être déductible de la seule URL');
});

test('un accès normal à /priorities reste en création', () => {
  assert.equal(editModeFromUrl(''), false);
  assert.equal(editModeFromUrl('?mode=create'), false);
  assert.equal(editModeFromUrl('?autre=1'), false);
});

test('fermer l’éditeur ramène au profil sans toucher aux réponses ni à la file', () => {
  useStore.setState({
    priorityEditMode: true,
    answers: { ECO_1: 4 },
    queueQuestionIds: ['ECO_1', 'SOC_7'],
    currentQuestionIndex: 1,
  });
  useStore.getState().closePriorityEditor();
  const s = useStore.getState();
  assert.equal(s.priorityEditMode, false);
  assert.equal(s.currentPage, 'profile');
  assert.deepEqual(s.answers, { ECO_1: 4 }, 'les réponses ont été touchées');
  assert.deepEqual(s.queueQuestionIds, ['ECO_1', 'SOC_7'], 'la file a été touchée');
  assert.equal(s.currentQuestionIndex, 1);
});
