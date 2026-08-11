// POLISCOP — La demande d'influence ne doit pas pouvoir être contournée.
//
// DÉFAUT P0-A REPRODUIT
// ---------------------
// L'auto-avance était bien suspendue quand la demande était ouverte, mais le bouton manuel
// « Suivant » restait actif dès qu'une réponse politique existait (`disabled={!hasAnswer}`).
// Il suffisait donc de répondre puis de cliquer « Suivant » pour quitter la question sans
// avoir choisi d'influence NI utilisé « Je préfère ne pas répondre » — la demande devenait
// décorative.
//
// La garde vit ici, dans une fonction PURE, et non dans le composant : un garde-fou enfermé
// dans du JSX n'est testable que par un rendu complet, et c'est exactement ce qui a permis au
// bouton « Suivant » d'échapper à la règle appliquée à l'auto-avance.

import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  canLeaveQuestion, shouldOpenInfluencePrompt, resolveOpenPrompt,
} from '../../src/engine/influenceGate.js';
import { NO_OPINION } from '../../src/engine/scorer.js';
import { VOTE_INFLUENCE_LEVEL } from '../../src/engine/priorityWeights.js';

const marked = { id: 'ENV_26', voteInfluencePrompt: true };
const plain = { id: 'ECO_1', voteInfficePrompt: false, voteInfluencePrompt: false };

// ─── La garde de navigation ─────────────────────────────────────────────────

test('« Suivant » ne peut pas quitter une question marquée dont la demande est ouverte', () => {
  assert.equal(
    canLeaveQuestion({ question: marked, currentAnswer: 4, influencePromptFor: 'ENV_26', voteInfluence: {} }),
    false,
    'le bouton manuel contourne la demande',
  );
});

test('la garde s’applique aussi à la DERNIÈRE question du quiz', () => {
  assert.equal(
    canLeaveQuestion({
      question: marked, currentAnswer: 4, influencePromptFor: 'ENV_26', voteInfluence: {}, isLast: true,
    }),
    false,
    'terminer le quiz ne doit pas contourner la demande',
  );
});

test('une fois l’influence choisie, la navigation se rouvre', () => {
  assert.equal(
    canLeaveQuestion({
      question: marked, currentAnswer: 4, influencePromptFor: 'ENV_26',
      voteInfluence: { ENV_26: { level: VOTE_INFLUENCE_LEVEL.NONE } },
    }),
    true,
  );
});

test('« Je préfère ne pas répondre » rouvre aussi la navigation', () => {
  assert.equal(
    canLeaveQuestion({
      question: marked, currentAnswer: 4, influencePromptFor: 'ENV_26',
      voteInfluence: { ENV_26: { level: null, declined: true } },
    }),
    true,
  );
});

test('une question NON marquée n’est jamais bloquée', () => {
  assert.equal(canLeaveQuestion({ question: plain, currentAnswer: 3, influencePromptFor: null, voteInfluence: {} }), true);
});

test('sans réponse politique, la garde d’influence ne s’applique pas', () => {
  // Le blocage « pas de réponse » relève d'une autre règle ; ici on vérifie seulement que la
  // garde d'influence ne prétend pas gérer ce cas.
  assert.equal(canLeaveQuestion({ question: marked, currentAnswer: null, influencePromptFor: null, voteInfluence: {} }), true);
});

test('un prompt ouvert pour une AUTRE question ne bloque pas la question courante', () => {
  assert.equal(
    canLeaveQuestion({ question: marked, currentAnswer: 4, influencePromptFor: 'SOC_28', voteInfluence: {} }),
    true,
    'un influencePromptFor orphelin ne doit pas geler une question sans rapport',
  );
});

// ─── Réouverture après rechargement ou retour arrière ───────────────────────

test('la demande réapparaît sur une question marquée déjà répondue mais sans influence', () => {
  assert.equal(shouldOpenInfluencePrompt({ question: marked, currentAnswer: 4, voteInfluence: {} }), true);
});

test('la demande ne réapparaît pas si une influence est déjà enregistrée', () => {
  assert.equal(
    shouldOpenInfluencePrompt({
      question: marked, currentAnswer: 4, voteInfluence: { ENV_26: { level: VOTE_INFLUENCE_LEVEL.STRONG } },
    }),
    false,
  );
  assert.equal(
    shouldOpenInfluencePrompt({
      question: marked, currentAnswer: 4, voteInfluence: { ENV_26: { level: null, declined: true } },
    }),
    false,
    'un refus enregistré est une décision : ne pas redemander',
  );
});

test('« sans opinion » ne déclenche pas la demande', () => {
  // Aucune décision politique à qualifier : demander l'influence n'aurait pas de sens.
  assert.equal(shouldOpenInfluencePrompt({ question: marked, currentAnswer: NO_OPINION, voteInfluence: {} }), false);
});

test('une question non marquée n’ouvre jamais la demande', () => {
  assert.equal(shouldOpenInfluencePrompt({ question: plain, currentAnswer: 5, voteInfluence: {} }), false);
});

// ─── Pas d'état orphelin ────────────────────────────────────────────────────

test('un prompt ouvert pour une question qu’on a quittée est nettoyé', () => {
  assert.equal(resolveOpenPrompt({ openFor: 'SOC_28', question: marked, currentAnswer: 4, voteInfluence: {} }), 'ENV_26',
    'la demande doit se recaler sur la question affichée');
  assert.equal(resolveOpenPrompt({ openFor: 'SOC_28', question: plain, currentAnswer: 4, voteInfluence: {} }), null,
    'aucune demande ne doit rester ouverte sur une question non marquée');
});

test('un prompt déjà satisfait est refermé', () => {
  assert.equal(
    resolveOpenPrompt({
      openFor: 'ENV_26', question: marked, currentAnswer: 4,
      voteInfluence: { ENV_26: { level: VOTE_INFLUENCE_LEVEL.LIKELY } },
    }),
    null,
  );
});

test('resolveOpenPrompt est idempotent', () => {
  const args = { openFor: 'ENV_26', question: marked, currentAnswer: 4, voteInfluence: {} };
  assert.equal(resolveOpenPrompt(args), resolveOpenPrompt({ ...args, openFor: resolveOpenPrompt(args) }));
});

test('aucune entrée invalide ne fait planter la garde', () => {
  for (const bad of [
    { question: null, currentAnswer: 4, influencePromptFor: 'X', voteInfluence: {} },
    { question: marked, currentAnswer: 4, influencePromptFor: 'ENV_26', voteInfluence: null },
    {},
  ]) {
    assert.equal(typeof canLeaveQuestion(bad), 'boolean');
    assert.equal(typeof shouldOpenInfluencePrompt(bad), 'boolean');
  }
});
