// POLISCOP — File de mutations.
//
// Les quatre défauts de l'écriture « un upsert par clic » sont reproduits ici sous forme de
// tests : si l'un d'eux réapparaît, le test échoue au lieu de produire des données fausses
// en silence.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createMutationQueue } from '../../src/lib/mutationQueue.js';

/** Stockage en mémoire, imitant l'API `Storage`. */
function memoryStorage(seed = {}) {
  const map = new Map(Object.entries(seed));
  return {
    getItem: k => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => map.set(k, String(v)),
    removeItem: k => map.delete(k),
    _dump: () => Object.fromEntries(map),
  };
}

/** Transport contrôlé : on décide quand chaque envoi se résout, et dans quel ordre. */
function controllableTransport() {
  const calls = [];
  let mode = 'resolve';
  return {
    calls,
    fail() { mode = 'reject'; },
    succeed() { mode = 'resolve'; },
    async send(batch) {
      calls.push(structuredClone(batch));
      if (mode === 'reject') throw new Error('réseau indisponible');
    },
  };
}

const ATTEMPT = '11111111-1111-1111-1111-111111111111';
const item = (questionId, value) => ({
  question_id: questionId,
  response_state: value == null ? 'no_opinion' : 'answered',
  answer_value: value,
  questionnaire_version: 'q-test',
});

test('chaque mutation reçoit un identifiant UNIQUE', () => {
  const transport = controllableTransport();
  const queue = createMutationQueue({
    transport: transport.send, storage: memoryStorage(), flushIntervalMs: 10_000,
  });

  const first  = queue.enqueue(ATTEMPT, item('ECO_1', 4));
  const second = queue.enqueue(ATTEMPT, item('SOC_1', 2));

  assert.match(first, /^[0-9a-f-]{36}$/);
  assert.notEqual(first, second);
});

test('la coalescence garde le DERNIER choix pour une même question', async () => {
  const transport = controllableTransport();
  const queue = createMutationQueue({
    transport: transport.send, storage: memoryStorage(), flushIntervalMs: 10_000,
  });

  queue.enqueue(ATTEMPT, item('ECO_1', 4));
  queue.enqueue(ATTEMPT, item('ECO_1', 1));
  queue.enqueue(ATTEMPT, item('ECO_1', 5));

  assert.equal(queue.getStatus().pending, 1, 'les hésitations ne doivent pas gonfler la file');

  await queue.flush();
  assert.equal(transport.calls.length, 1);
  assert.equal(transport.calls[0].items.length, 1);
  assert.equal(transport.calls[0].items[0].answer_value, 5);
});

test('un échec ne ressuscite PAS une réponse périmée par-dessus un choix plus récent', async () => {
  const transport = controllableTransport();
  const queue = createMutationQueue({
    transport: transport.send, storage: memoryStorage(), flushIntervalMs: 10_000,
  });

  queue.enqueue(ATTEMPT, item('ECO_1', 4));
  transport.fail();
  const flight = queue.flush();

  // Pendant que l'envoi de « 4 » est en vol, l'utilisateur choisit « 1 ».
  queue.enqueue(ATTEMPT, item('ECO_1', 1));
  await flight;

  transport.succeed();
  await queue.flush();

  const lastBatch = transport.calls[transport.calls.length - 1];
  assert.equal(lastBatch.items[0].answer_value, 1,
    'la mutation échouée a écrasé le choix plus récent de l’utilisateur');
  assert.equal(queue.getStatus().pending, 0);
});

test('un seul envoi en vol à la fois : la sérialisation est la file elle-même', async () => {
  let concurrent = 0;
  let maxConcurrent = 0;
  const queue = createMutationQueue({
    storage: memoryStorage(),
    flushIntervalMs: 10_000,
    transport: async () => {
      concurrent += 1;
      maxConcurrent = Math.max(maxConcurrent, concurrent);
      await new Promise(resolve => setTimeout(resolve, 5));
      concurrent -= 1;
    },
  });

  queue.enqueue(ATTEMPT, item('ECO_1', 4));
  await Promise.all([queue.flush(), queue.flush(), queue.flush()]);

  assert.equal(maxConcurrent, 1, 'plusieurs requêtes concurrentes ont été émises');
});

test('hors ligne : rien n’est envoyé, rien n’est perdu', async () => {
  const transport = controllableTransport();
  const storage = memoryStorage();
  let online = false;

  const queue = createMutationQueue({
    transport: transport.send, storage, flushIntervalMs: 10_000,
    isOnline: () => online,
  });
  queue.enqueue(ATTEMPT, item('ECO_1', 4));

  const result = await queue.flush();
  assert.equal(result.sent, 0);
  assert.equal(transport.calls.length, 0, 'un envoi a été tenté hors ligne');
  assert.equal(queue.getStatus().pending, 1, 'la réponse a été perdue hors ligne');

  // Retour du réseau : la mutation mise de côté part enfin.
  online = true;
  await queue.flush();
  assert.equal(transport.calls.length, 1);
  assert.equal(transport.calls[0].items[0].answer_value, 4);
  assert.equal(queue.getStatus().pending, 0);
});

test('les mutations en attente survivent à un rechargement de page', async () => {
  const storage = memoryStorage();
  const transport = controllableTransport();

  const first = createMutationQueue({
    transport: transport.send, storage, flushIntervalMs: 10_000,
  });
  first.enqueue(ATTEMPT, item('ECO_1', 4));
  first.enqueue(ATTEMPT, item('SOC_1', 2));

  // Nouvelle instance = nouvel onglet après rechargement, même stockage.
  const second = createMutationQueue({
    transport: transport.send, storage, flushIntervalMs: 10_000,
  });
  assert.equal(second.getStatus().pending, 2, 'les réponses en attente ont été perdues au rechargement');

  await second.flush();
  assert.equal(transport.calls[0].items.length, 2);
});

test('une erreur est OBSERVABLE et rejouable — jamais avalée', async () => {
  const transport = controllableTransport();
  const queue = createMutationQueue({
    transport: transport.send, storage: memoryStorage(), flushIntervalMs: 10_000,
  });

  queue.enqueue(ATTEMPT, item('ECO_1', 4));
  transport.fail();
  const { error } = await queue.flush();

  assert.ok(error instanceof Error, 'l’échec n’a pas été remonté');
  assert.ok(queue.getStatus().lastError, 'l’échec n’est pas visible dans l’état de la file');
  assert.equal(queue.getStatus().pending, 1);

  transport.succeed();
  const retry = await queue.retry();
  assert.equal(retry.sent, 1);
  assert.equal(queue.getStatus().lastError, null);
});

test('« sans opinion » traverse la file comme un ÉTAT, sans valeur numérique', async () => {
  const transport = controllableTransport();
  const queue = createMutationQueue({
    transport: transport.send, storage: memoryStorage(), flushIntervalMs: 10_000,
  });

  queue.enqueue(ATTEMPT, item('SOC_1', null));
  await queue.flush();

  const sent = transport.calls[0].items[0];
  assert.equal(sent.response_state, 'no_opinion');
  assert.equal(sent.answer_value, null);
  assert.ok('response_state' in sent,
    '« sans opinion » doit être transmis, pas traduit en absence d’envoi');
});

test('chaque envoi porte client_updated_at et mutation_id', async () => {
  const transport = controllableTransport();
  const queue = createMutationQueue({
    transport: transport.send, storage: memoryStorage(), flushIntervalMs: 10_000,
  });

  queue.enqueue(ATTEMPT, item('ECO_1', 4));
  await queue.flush();

  const sent = transport.calls[0].items[0];
  assert.match(sent.mutation_id, /^[0-9a-f-]{36}$/);
  assert.match(sent.client_updated_at, /^\d{4}-\d{2}-\d{2}T/);
});

test('un rejeu porte le MÊME mutation_id : l’idempotence côté base peut jouer', async () => {
  const transport = controllableTransport();
  const queue = createMutationQueue({
    transport: transport.send, storage: memoryStorage(), flushIntervalMs: 10_000,
  });

  queue.enqueue(ATTEMPT, item('ECO_1', 4));
  transport.fail();
  await queue.flush();
  const firstId = transport.calls[0].items[0].mutation_id;

  transport.succeed();
  await queue.retry();
  const secondId = transport.calls[1].items[0].mutation_id;

  assert.equal(firstId, secondId,
    'un nouvel identifiant à chaque tentative ferait échouer la déduplication en base');
});

test('clear() purge la file ET le stockage — retrait de consentement', () => {
  const storage = memoryStorage();
  const queue = createMutationQueue({
    transport: async () => {}, storage, flushIntervalMs: 10_000,
  });

  queue.enqueue(ATTEMPT, item('ECO_1', 4));
  queue.clear();

  assert.equal(queue.getStatus().pending, 0);
  assert.equal(storage.getItem('poliscop_pending_mutations'), null);
});

test('flushOnUnload signale « mis en file », jamais « reçu »', () => {
  const queue = createMutationQueue({
    transport: async () => {}, storage: memoryStorage(), flushIntervalMs: 10_000,
  });
  queue.enqueue(ATTEMPT, item('ECO_1', 4));

  let captured = null;
  const queued = queue.flushOnUnload((payload) => { captured = payload; return true; });

  assert.equal(queued, true);
  assert.equal(captured.items.length, 1);

  // Un navigateur qui refuse renvoie `false` — et la file ne prétend pas avoir envoyé.
  assert.equal(queue.flushOnUnload(() => false), false);
});
