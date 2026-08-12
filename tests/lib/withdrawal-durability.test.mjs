// POLISCOP — Un retrait demandé hors ligne doit survivre au rechargement.
//
// DÉFAUT CORRIGÉ (P0-B3)
// ----------------------
// `setConsent()` tentait l'envoi, avalait l'erreur, et un commentaire promettait un rejeu
// « au prochain changement ». Il n'existait aucune file persistante, et l'identifiant
// pseudonyme était effacé dans la foulée. Enchaînement réel : demande hors ligne → échec
// silencieux → identifiant perdu → au rechargement, le client ne sait plus QUOI faire
// supprimer. Le serveur garde les données, l'interface a dit « c'est fait ».
//
// ⚠ Ces tests font ÉCHOUER le transport. Un test qui n'utilise qu'un transport heureux ne
// distingue pas un retrait durable d'un retrait qui disparaît à la première coupure.

import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  enqueueWithdrawal, replayWithdrawals, pendingWithdrawals, withdrawalState,
  clearWithdrawals, WITHDRAWAL_STATE, TOMBSTONE_KEY,
} from '../../src/lib/withdrawalQueue.js';
import { createAttemptSession } from '../../src/lib/attemptSession.js';
import { PURPOSES, emptyConsentState } from '../../src/lib/consent.js';

function memoryStorage(seed = {}) {
  const map = new Map(Object.entries(seed));
  return {
    getItem: k => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => map.set(k, String(v)),
    removeItem: k => map.delete(k),
    _map: map,
  };
}

const record = (purpose = PURPOSES.POLITICAL_ANALYTICS, sid = 'sid-1') => ({
  purpose, granted: false, anonymous_session_id: sid, user_id: null,
});

const accord = () => ({ ...emptyConsentState(), [PURPOSES.POLITICAL_ANALYTICS]: true });
const refus  = () => ({ ...emptyConsentState(), [PURPOSES.POLITICAL_ANALYTICS]: false });

// ─── La file elle-même ──────────────────────────────────────────────────────

test('un échec réseau LAISSE le retrait en attente', async () => {
  const storage = memoryStorage();
  enqueueWithdrawal(storage, { purpose: PURPOSES.POLITICAL_ANALYTICS, anonymousSessionId: 'sid-1', record: record() });

  const r = await replayWithdrawals(storage, async () => { throw new Error('offline'); });
  assert.equal(r.confirmed, 0);
  assert.equal(r.remaining, 1);
  assert.equal(withdrawalState(storage), WITHDRAWAL_STATE.PENDING);
});

test('un transport qui répond « faux » ne vide PAS la file', async () => {
  const storage = memoryStorage();
  enqueueWithdrawal(storage, { purpose: PURPOSES.POLITICAL_ANALYTICS, anonymousSessionId: 'sid-1', record: record() });
  await replayWithdrawals(storage, async () => false);
  assert.equal(pendingWithdrawals(storage).length, 1,
    'seule une confirmation 2xx explicite autorise à annoncer la suppression');
});

test('la tombstone ne disparaît qu’APRÈS confirmation', async () => {
  const storage = memoryStorage();
  enqueueWithdrawal(storage, { purpose: PURPOSES.POLITICAL_ANALYTICS, anonymousSessionId: 'sid-1', record: record() });

  await replayWithdrawals(storage, async () => false);
  assert.equal(withdrawalState(storage), WITHDRAWAL_STATE.PENDING);

  const r = await replayWithdrawals(storage, async () => true);
  assert.equal(r.confirmed, 1);
  assert.equal(withdrawalState(storage), WITHDRAWAL_STATE.NONE);
  assert.equal(pendingWithdrawals(storage).length, 0);
});

test('le retrait survit à un RECHARGEMENT : la file est persistée, pas en mémoire', async () => {
  const disque = memoryStorage();
  enqueueWithdrawal(disque, { purpose: PURPOSES.POLITICAL_ANALYTICS, anonymousSessionId: 'sid-1', record: record() });
  await replayWithdrawals(disque, async () => { throw new Error('offline'); });

  // Nouveau « démarrage » : même stockage, tout le reste reconstruit.
  const apresRechargement = memoryStorage(Object.fromEntries(disque._map));
  const restants = pendingWithdrawals(apresRechargement);
  assert.equal(restants.length, 1);
  assert.equal(restants[0].record.anonymous_session_id, 'sid-1',
    'sans le pseudonyme conservé, la demande de suppression serait inexprimable');
});

test('le pseudonyme survit dans une clé DÉDIÉE, jamais dans celle de la collecte', async () => {
  const storage = memoryStorage();
  enqueueWithdrawal(storage, { purpose: PURPOSES.POLITICAL_ANALYTICS, anonymousSessionId: 'sid-1', record: record() });
  const cles = [...storage._map.keys()];
  assert.deepEqual(cles, [TOMBSTONE_KEY]);
  assert.ok(!cles.includes('poliscop_analytics_sid'),
    'réutiliser la clé de collecte permettrait à un chemin de collecte de la relire');
});

test('redemander le même retrait ne fait pas grossir la file indéfiniment', () => {
  const storage = memoryStorage();
  for (let i = 0; i < 5; i++) {
    enqueueWithdrawal(storage, { purpose: PURPOSES.POLITICAL_ANALYTICS, anonymousSessionId: 'sid-1', record: record() });
  }
  assert.equal(pendingWithdrawals(storage).length, 1);
});

test('deux pseudonymes distincts restent deux demandes distinctes', () => {
  const storage = memoryStorage();
  enqueueWithdrawal(storage, { purpose: PURPOSES.POLITICAL_ANALYTICS, anonymousSessionId: 'sid-1', record: record(PURPOSES.POLITICAL_ANALYTICS, 'sid-1') });
  enqueueWithdrawal(storage, { purpose: PURPOSES.POLITICAL_ANALYTICS, anonymousSessionId: 'sid-2', record: record(PURPOSES.POLITICAL_ANALYTICS, 'sid-2') });
  assert.equal(pendingWithdrawals(storage).length, 2,
    'confirmer la suppression d’un pseudonyme ne doit pas effacer la demande d’un autre');
});

test('une file illisible ne fait pas planter le démarrage', () => {
  const storage = memoryStorage({ [TOMBSTONE_KEY]: '{{{ pas du JSON' });
  assert.deepEqual(pendingWithdrawals(storage), []);
  assert.equal(withdrawalState(storage), WITHDRAWAL_STATE.NONE);
});

// ─── Intégration avec la session ────────────────────────────────────────────

test('un retrait hors ligne dépose la tombstone ET arrête toute émission', async () => {
  const storage = memoryStorage();
  const envoyes = [];
  const session = createAttemptSession({
    storage,
    transport: async (b) => { envoyes.push(b); },
    consentTransport: async () => { throw new Error('offline'); },
  });

  await session.setConsent(accord(), { anonymousSessionId: 'sid-1' });
  session.begin({ mode: 'deep', questionnaireVersion: 'v', scoringVersion: 'v', language: 'fr' });
  session.showQuestion('ECO_1', 0);
  session.recordAnswer('ECO_1', 'answered', 4);

  await session.setConsent(refus(), { anonymousSessionId: 'sid-1' });
  const avant = envoyes.length;

  assert.equal(session.withdrawalState(PURPOSES.POLITICAL_ANALYTICS), WITHDRAWAL_STATE.PENDING,
    'le retrait doit être en attente, pas perdu');

  session.showQuestion('ECO_2', 1);
  session.recordAnswer('ECO_2', 'answered', 5);
  await session.flushOnUnload?.();
  assert.equal(envoyes.length, avant, 'une réponse est partie après le retrait');
});

test('le rejeu confirme et vide la file quand le réseau revient', async () => {
  const storage = memoryStorage();
  let enLigne = false;
  const session = createAttemptSession({
    storage,
    transport: async () => {},
    consentTransport: async () => { if (!enLigne) throw new Error('offline'); return true; },
  });

  await session.setConsent(accord(), { anonymousSessionId: 'sid-1' });
  await session.setConsent(refus(), { anonymousSessionId: 'sid-1' });
  assert.equal(session.withdrawalState(PURPOSES.POLITICAL_ANALYTICS), WITHDRAWAL_STATE.PENDING);

  enLigne = true;
  const r = await session.retryWithdrawals();
  assert.equal(r.confirmed, 1);
  assert.equal(session.withdrawalState(PURPOSES.POLITICAL_ANALYTICS), WITHDRAWAL_STATE.NONE);
});

test('un retrait réussi du premier coup ne laisse aucune tombstone', async () => {
  const storage = memoryStorage();
  const session = createAttemptSession({
    storage, transport: async () => {}, consentTransport: async () => true,
  });
  await session.setConsent(accord(), { anonymousSessionId: 'sid-1' });
  await session.setConsent(refus(), { anonymousSessionId: 'sid-1' });
  assert.equal(session.withdrawalState(PURPOSES.POLITICAL_ANALYTICS), WITHDRAWAL_STATE.NONE);
  assert.equal(session.pendingWithdrawals().length, 0);
});

test('clearWithdrawals ne sert qu’à une purge explicite', () => {
  const storage = memoryStorage();
  enqueueWithdrawal(storage, { purpose: PURPOSES.POLITICAL_ANALYTICS, anonymousSessionId: 'sid-1', record: record() });
  clearWithdrawals(storage);
  assert.equal(pendingWithdrawals(storage).length, 0);
});
