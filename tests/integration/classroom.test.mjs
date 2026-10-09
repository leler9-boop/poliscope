import { test } from 'node:test';
import assert from 'node:assert/strict';
import { useStore } from '../../src/store/useStore.js';

test('le mode Classe isole puis restaure le profil personnel présent sur l’appareil', () => {
  const previousState = useStore.getState();
  const personalAnswers = { ECO_1: 5 };
  const personalProfile = { themes: { ECONOMY: 72 }, marker: 'personal' };

  useStore.setState({
    ...previousState,
    classroomMode: false,
    classroomReturnState: null,
    answers: personalAnswers,
    profile: personalProfile,
    profileAdjustments: { ECONOMY: 3 },
    themeWeights: null,
  }, true);

  try {
    useStore.getState().startClassroomTest();
    const during = useStore.getState();
    assert.equal(during.classroomMode, true);
    assert.deepEqual(during.answers, {});
    assert.equal(during.profile, null);
    assert.equal(during.questionsQueue.length, 32);
    assert.deepEqual(during.classroomReturnState.answers, personalAnswers);
    assert.equal(during.classroomReturnState.profile.marker, 'personal');

    during.answerQuestion(during.questionsQueue[0].id, 4);
    assert.notDeepEqual(useStore.getState().answers, personalAnswers);

    useStore.getState().exitClassroom();
    const after = useStore.getState();
    assert.equal(after.classroomMode, false);
    assert.equal(after.classroomReturnState, null);
    assert.deepEqual(after.answers, personalAnswers);
    assert.equal(after.profile.marker, 'personal');
    assert.deepEqual(after.profileAdjustments, { ECONOMY: 3 });
  } finally {
    useStore.setState(previousState, true);
  }
});
