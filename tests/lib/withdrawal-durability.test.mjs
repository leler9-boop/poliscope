// POLISCOP — Un retrait demandé hors ligne doit survivre au rechargement,
//            et ne jamais être annoncé comme confirmé sans preuve.
//
// DÉFAUT CORRIGÉ (P0-B3, 2026-08-10)
// ----------------------------------
// `setConsent()` tentait l'envoi, avalait l'erreur, et un commentaire promettait un rejeu
// « au prochain changement ». Il n'existait aucune file persistante, et l'identifiant
// pseudonyme était effacé dans la foulée.
//
// DÉFAUT CORRIGÉ (P0-1, 2026-08-14)
// ---------------------------------
// `withdrawalState()` ne rendait que `pending` ou `none` — `CONFIRMED` était déclaré et
// jamais retourné. L'interface affichait donc « Suppression confirmée par le serveur » par
// ÉLIMINATION, c'est-à-dire à partir de l'ABSENCE d'entrée en file. Ces tests vérifient que
// la confirmation est une PREUVE POSITIVE, rattachée à une demande précise.
//
// ⚠ Ces tests font ÉCHOUER le transport. Un test qui n'utilise qu'un transport heureux ne
// distingue pas un retrait durable d'un retrait qui disparaît à la première coupure.

import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  enqueueWithdrawal, replayWithdrawals, pendingWithdrawals, withdrawalState,
  withdrawalReceipts, clearWithdrawals, WITHDRAWAL_STATE, TOMBSTONE_KEY, RECEIPT_KEY,
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

/** Stockage HORS SERVICE : Safari en navigation privée lève sur toute écriture. */
function brokenStorage() {
  return {
    getItem: () => null,
    setItem: () => { throw new Error('QuotaExceededError'); },
    removeItem: () => { throw new Error('QuotaExceededError'); },
  };
}

const record = (purpose = PURPOSES.POLITICAL_ANALYTICS, sid = 'sid-1') => ({
  purpose, granted: false, anonymous_session_id: sid, user_id: null,
});

const accord = () => ({ ...emptyConsentState(), [PURPOSES.POLITICAL_ANALYTICS]: true });
const refus  = () => ({ ...emptyConsentState(), [PURPOSES.POLITICAL_ANALYTICS]: false });
const POLITIQUE = { changedPurposes: [PURPOSES.POLITICAL_ANALYTICS] };

const etat = (storage, purpose = PURPOSES.POLITICAL_ANALYTICS) =>
  withdrawalState(storage, { purpose }).state;

// ─── La file elle-même ──────────────────────────────────────────────────────

test('un échec réseau LAISSE le retrait en attente', async () => {
  const storage = memoryStorage();
  enqueueWithdrawal(storage, { purpose: PURPOSES.POLITICAL_ANALYTICS, record: record() });

  const r = await replayWithdrawals(storage, async () => { throw new Error('offline'); });
  assert.equal(r.confirmed, 0);
  assert.equal(r.remaining, 1);
  assert.equal(etat(storage), WITHDRAWAL_STATE.PENDING);
});

test('un transport qui répond « faux » ne vide PAS la file', async () => {
  const storage = memoryStorage();
  enqueueWithdrawal(storage, { purpose: PURPOSES.POLITICAL_ANALYTICS, record: record() });
  await replayWithdrawals(storage, async () => false);
  assert.equal(pendingWithdrawals(storage).length, 1,
    'seule une confirmation 2xx explicite autorise à annoncer la suppression');
  assert.equal(etat(storage), WITHDRAWAL_STATE.PENDING);
});

test('une réponse AMBIGUË ne vaut pas confirmation', async () => {
  // `Promise.resolve({})` est « véridique » et ne prouve rien. Le contrat est `=== true`.
  for (const reponse of [undefined, null, {}, 'ok', 1, [], 'true']) {
    const storage = memoryStorage();
    enqueueWithdrawal(storage, { purpose: PURPOSES.POLITICAL_ANALYTICS, record: record() });
    const r = await replayWithdrawals(storage, async () => reponse);
    assert.equal(r.confirmed, 0, `« ${JSON.stringify(reponse)} » a été pris pour une confirmation`);
    assert.notEqual(etat(storage), WITHDRAWAL_STATE.CONFIRMED);
    assert.deepEqual(withdrawalReceipts(storage), []);
  }
});

test('la tombstone ne disparaît qu’APRÈS confirmation, et laisse un REÇU', async () => {
  const storage = memoryStorage();
  enqueueWithdrawal(storage, { purpose: PURPOSES.POLITICAL_ANALYTICS, record: record() });

  await replayWithdrawals(storage, async () => false);
  assert.equal(etat(storage), WITHDRAWAL_STATE.PENDING);

  const r = await replayWithdrawals(storage, async () => true);
  assert.equal(r.confirmed, 1);
  assert.equal(pendingWithdrawals(storage).length, 0);

  // ⚠ LE cœur du P0-1 : une file vide ne prouve rien. C'est le reçu qui prouve.
  const apres = withdrawalState(storage, { purpose: PURPOSES.POLITICAL_ANALYTICS });
  assert.equal(apres.state, WITHDRAWAL_STATE.CONFIRMED);
  assert.ok(apres.requestId, 'la confirmation doit porter l’identifiant de la demande');
  assert.match(apres.confirmedAt, /^\d{4}-\d{2}-\d{2}T/, 'et sa date');
  assert.equal(apres.purpose, PURPOSES.POLITICAL_ANALYTICS, 'et sa finalité');
});

test('une file vide SANS reçu ne vaut PAS confirmation', () => {
  // Le cas exact que l'ancienne interface présentait comme « Suppression confirmée » :
  // rien en file, parce que rien n'a jamais été demandé.
  const storage = memoryStorage();
  const s = withdrawalState(storage, { purpose: PURPOSES.POLITICAL_ANALYTICS });
  assert.equal(s.state, WITHDRAWAL_STATE.NONE);
  assert.equal(s.confirmedAt, null);
});

test('le retrait survit à un RECHARGEMENT : la file est persistée, pas en mémoire', async () => {
  const disque = memoryStorage();
  enqueueWithdrawal(disque, { purpose: PURPOSES.POLITICAL_ANALYTICS, record: record() });
  await replayWithdrawals(disque, async () => { throw new Error('offline'); });

  // Nouveau « démarrage » : même stockage, tout le reste reconstruit.
  const apresRechargement = memoryStorage(Object.fromEntries(disque._map));
  const restants = pendingWithdrawals(apresRechargement);
  assert.equal(restants.length, 1);
  assert.equal(restants[0].record.anonymous_session_id, 'sid-1',
    'sans le pseudonyme conservé, la demande de suppression serait inexprimable');
  assert.equal(etat(apresRechargement), WITHDRAWAL_STATE.PENDING,
    'après rechargement, l’attente doit rester visible');
});

test('le pseudonyme survit dans une clé DÉDIÉE, jamais dans celle de la collecte', () => {
  const storage = memoryStorage();
  enqueueWithdrawal(storage, { purpose: PURPOSES.POLITICAL_ANALYTICS, record: record() });
  const cles = [...storage._map.keys()];
  assert.deepEqual(cles, [TOMBSTONE_KEY]);
  assert.ok(!cles.includes('poliscop_analytics_sid'),
    'réutiliser la clé de collecte permettrait à un chemin de collecte de la relire');
});

test('redemander le même retrait ne fait pas grossir la file indéfiniment', () => {
  const storage = memoryStorage();
  for (let i = 0; i < 5; i++) {
    enqueueWithdrawal(storage, { purpose: PURPOSES.POLITICAL_ANALYTICS, record: record() });
  }
  assert.equal(pendingWithdrawals(storage).length, 1);
});

test('deux pseudonymes distincts restent deux demandes distinctes', () => {
  const storage = memoryStorage();
  enqueueWithdrawal(storage, { purpose: PURPOSES.POLITICAL_ANALYTICS, record: record(PURPOSES.POLITICAL_ANALYTICS, 'sid-1') });
  enqueueWithdrawal(storage, { purpose: PURPOSES.POLITICAL_ANALYTICS, record: record(PURPOSES.POLITICAL_ANALYTICS, 'sid-2') });
  assert.equal(pendingWithdrawals(storage).length, 2,
    'confirmer la suppression d’un pseudonyme ne doit pas effacer la demande d’un autre');
});

test('une file illisible ne fait pas planter le démarrage', () => {
  const storage = memoryStorage({ [TOMBSTONE_KEY]: '{{{ pas du JSON' });
  assert.deepEqual(pendingWithdrawals(storage), []);
  assert.equal(etat(storage), WITHDRAWAL_STATE.NONE);
});

// ─── Le sujet : sans lui, pas de demande ────────────────────────────────────

test('une tombstone SANS sujet est REFUSÉE — le serveur ne pourrait rien supprimer', () => {
  const storage = memoryStorage();
  const issue = enqueueWithdrawal(storage, {
    purpose: PURPOSES.POLITICAL_ANALYTICS,
    record: { purpose: PURPOSES.POLITICAL_ANALYTICS, granted: false, anonymous_session_id: null, user_id: null },
  });
  assert.equal(issue.ok, false);
  assert.equal(issue.reason, 'no_subject');
  assert.equal(pendingWithdrawals(storage).length, 0,
    'une demande sans sujet produirait une « suppression en cours » qui ne peut jamais aboutir');
  assert.equal(etat(storage), WITHDRAWAL_STATE.NONE);
});

test('une tombstone rattachée à un COMPTE est acceptée : c’est un sujet valide', () => {
  const storage = memoryStorage();
  const issue = enqueueWithdrawal(storage, {
    purpose: PURPOSES.CLOUD_SAVE,
    record: { purpose: PURPOSES.CLOUD_SAVE, granted: false, anonymous_session_id: null, user_id: 'compte-1' },
  });
  assert.equal(issue.ok, true);
  assert.equal(pendingWithdrawals(storage)[0].subject.kind, 'user_id');
});

// ─── Stockage indisponible : dire la vérité ─────────────────────────────────

test('sans stockage, la demande n’est PAS annoncée comme rejouable', () => {
  const storage = brokenStorage();
  const issue = enqueueWithdrawal(storage, { purpose: PURPOSES.POLITICAL_ANALYTICS, record: record() });
  assert.equal(issue.ok, true, 'la demande est prise en compte pour ce processus');
  assert.equal(issue.persisted, false);
  assert.equal(issue.state, WITHDRAWAL_STATE.UNPERSISTED,
    'promettre un rejeu après redémarrage serait faux : rien n’a pu être écrit');
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

  await session.setConsent(accord(), { anonymousSessionId: 'sid-1', ...POLITIQUE });
  session.begin({ mode: 'deep', questionnaireVersion: 'v', scoringVersion: 'v', language: 'fr' });
  session.showQuestion('ECO_1', 0);
  session.recordAnswer('ECO_1', 'answered', 4);

  const issue = await session.setConsent(refus(), { anonymousSessionId: 'sid-1', ...POLITIQUE });
  const avant = envoyes.length;

  assert.equal(session.withdrawalState(PURPOSES.POLITICAL_ANALYTICS).state, WITHDRAWAL_STATE.PENDING,
    'le retrait doit être en attente, pas perdu');
  assert.equal(issue.withdrawals[0].purpose, PURPOSES.POLITICAL_ANALYTICS);
  assert.ok(issue.withdrawals[0].requestId, 'la demande doit être identifiée');

  session.showQuestion('ECO_2', 1);
  session.recordAnswer('ECO_2', 'answered', 5);
  await session.flushOnUnload?.();
  assert.equal(envoyes.length, avant, 'une réponse est partie après le retrait');
});

test('le rejeu confirme quand le réseau revient — et l’attente restait visible avant', async () => {
  const storage = memoryStorage();
  let enLigne = false;
  const session = createAttemptSession({
    storage,
    transport: async () => {},
    consentTransport: async () => { if (!enLigne) throw new Error('offline'); return true; },
  });

  await session.setConsent(accord(), { anonymousSessionId: 'sid-1', ...POLITIQUE });
  const horsLigne = await session.setConsent(refus(), { anonymousSessionId: 'sid-1', ...POLITIQUE });
  assert.equal(session.withdrawalState(PURPOSES.POLITICAL_ANALYTICS).state, WITHDRAWAL_STATE.PENDING);
  const demande = horsLigne.withdrawals[0].requestId;

  // Rechargement hors ligne : l'attente doit rester visible sans aucune action.
  const apresRechargement = memoryStorage(Object.fromEntries(storage._map));
  assert.equal(etat(apresRechargement), WITHDRAWAL_STATE.PENDING);

  enLigne = true;
  const r = await session.retryWithdrawals();
  assert.equal(r.confirmed, 1);
  const final = session.withdrawalState(PURPOSES.POLITICAL_ANALYTICS);
  assert.equal(final.state, WITHDRAWAL_STATE.CONFIRMED);
  assert.equal(final.requestId, demande,
    'la confirmation doit porter sur LA demande formulée, pas sur « une » suppression');
});

test('un retrait réussi du premier coup est CONFIRMÉ, pas « rien à faire »', async () => {
  const storage = memoryStorage();
  const session = createAttemptSession({
    storage, transport: async () => {}, consentTransport: async () => true,
  });
  await session.setConsent(accord(), { anonymousSessionId: 'sid-1', ...POLITIQUE });
  const issue = await session.setConsent(refus(), { anonymousSessionId: 'sid-1', ...POLITIQUE });

  assert.equal(session.withdrawalState(PURPOSES.POLITICAL_ANALYTICS).state, WITHDRAWAL_STATE.CONFIRMED);
  assert.equal(session.pendingWithdrawals().length, 0);
  assert.equal(issue.withdrawals[0].state, WITHDRAWAL_STATE.CONFIRMED,
    'le résultat rendu à l’interface doit dire lui-même ce qui s’est passé');
});

test('un REFUS INITIAL ne demande aucune suppression — il n’y a rien à supprimer', async () => {
  const storage = memoryStorage();
  const session = createAttemptSession({
    storage, transport: async () => {}, consentTransport: async () => true,
  });
  const issue = await session.setConsent(refus(), { ...POLITIQUE });

  assert.equal(session.pendingWithdrawals().length, 0);
  assert.equal(session.withdrawalState(PURPOSES.POLITICAL_ANALYTICS).state, WITHDRAWAL_STATE.NONE,
    'un refus initial affiché comme « suppression confirmée » invente un corpus puis son effacement');
  assert.deepEqual(withdrawalReceipts(storage), [],
    'aucun reçu ne doit exister : le serveur n’a jamais rien eu à supprimer');
  assert.equal(issue.withdrawals[0]?.state, WITHDRAWAL_STATE.NONE);
});

test('deux retraits distincts ne partagent PAS leur confirmation', async () => {
  const storage = memoryStorage();
  let enLigne = true;
  const session = createAttemptSession({
    storage, transport: async () => {},
    consentTransport: async () => { if (!enLigne) throw new Error('offline'); return true; },
  });

  await session.setConsent(accord(), { anonymousSessionId: 'sid-1', ...POLITIQUE });
  const premier = await session.setConsent(refus(), { anonymousSessionId: 'sid-1', ...POLITIQUE });
  assert.equal(session.withdrawalState(PURPOSES.POLITICAL_ANALYTICS).state, WITHDRAWAL_STATE.CONFIRMED);

  // Nouvel accord, puis nouveau retrait — cette fois hors ligne.
  enLigne = true;
  await session.setConsent(accord(), { anonymousSessionId: 'sid-2', ...POLITIQUE });
  enLigne = false;
  const second = await session.setConsent(refus(), { anonymousSessionId: 'sid-2', ...POLITIQUE });

  const s = session.withdrawalState(PURPOSES.POLITICAL_ANALYTICS);
  assert.equal(s.state, WITHDRAWAL_STATE.PENDING,
    'le reçu du PREMIER retrait a servi à déclarer le second confirmé');
  assert.notEqual(second.withdrawals[0].requestId, premier.withdrawals[0].requestId);
});

test('le pseudonyme est lu AVANT d’être effacé : la demande a toujours un sujet', async () => {
  // Cas du rechargement : rien en mémoire, l'identifiant n'existe que dans le stockage.
  const storage = memoryStorage({ poliscop_analytics_sid: 'sid-persiste' });
  const session = createAttemptSession({
    storage, transport: async () => {}, consentTransport: async () => { throw new Error('offline'); },
  });
  // On rejoue l'état « accordé » lu du disque, sans repasser par un accord explicite.
  await session.setConsent(accord(), {});
  await session.setConsent(refus(), { ...POLITIQUE });

  const [entree] = session.pendingWithdrawals();
  assert.ok(entree, 'aucune demande enregistrée : le sujet a été perdu avant la mise en file');
  assert.equal(entree.record.anonymous_session_id, 'sid-persiste');
});

test('clearWithdrawals purge la file ET les reçus', async () => {
  const storage = memoryStorage();
  enqueueWithdrawal(storage, { purpose: PURPOSES.POLITICAL_ANALYTICS, record: record() });
  await replayWithdrawals(storage, async () => true);
  assert.equal(withdrawalReceipts(storage).length, 1);

  clearWithdrawals(storage);
  assert.equal(pendingWithdrawals(storage).length, 0);
  assert.deepEqual(withdrawalReceipts(storage), []);
  assert.ok(!storage._map.has(RECEIPT_KEY));
});
