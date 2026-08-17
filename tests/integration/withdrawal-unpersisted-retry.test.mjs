// POLISCOP — Un retrait que le stockage refuse d'enregistrer doit rester RÉESSAYABLE,
//            et un reçu ne doit conserver aucun identifiant.
//
// DÉFAUTS CORRIGÉS (P0-3 et P0-4 du contre-audit du 2026-08-14)
// -------------------------------------------------------------
// P0-3. `enqueueWithdrawal()` rendait bien l'entrée quand l'écriture échouait, mais personne
// ne la gardait. Le bouton « Réessayer maintenant » appelait `retryWithdrawals()`, qui
// relisait une file vide et ne réessayait donc RIEN. Le bouton était décoratif exactement
// dans le seul cas où il constitue l'unique recours — et l'interface, elle, l'affichait.
//
// P0-4. Après confirmation, le reçu conservait `subject`, c'est-à-dire le pseudonyme. Or la
// phrase affichée juste à côté affirme que « les identifiants déposés sur cet appareil sont
// effacés ». Le reçu survit précisément à l'effacement du pseudonyme : y garder ce pseudonyme
// laissait sur le terminal un identifiant rattachable aux opinions, en contradiction directe
// avec la promesse. Le reçu n'est pas la preuve opposable — celle-ci vit dans le journal
// append-only du serveur — il n'a donc besoin que de l'identifiant de la DEMANDE.

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { createAttemptSession } from '../../src/lib/attemptSession.js';
import {
  WITHDRAWAL_STATE, RECEIPT_KEY, withdrawalReceipts, withdrawalState, replayWithdrawals,
  enqueueWithdrawal, dropReceipt, RECEIPT_MAX_AGE_MS,
} from '../../src/lib/withdrawalQueue.js';
import { PURPOSES, emptyConsentState, currentDecision } from '../../src/lib/consent.js';

function memoryStorage(seed = {}) {
  const map = new Map(Object.entries(seed));
  return {
    getItem: k => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => map.set(k, String(v)),
    removeItem: k => map.delete(k),
    _map: map,
  };
}

/** Stockage qui accepte la LECTURE et refuse toute écriture — Safari en navigation privée. */
function stockageEnPanne() {
  return {
    getItem: () => null,
    setItem: () => { throw new Error('QuotaExceededError'); },
    removeItem: () => { throw new Error('QuotaExceededError'); },
  };
}

const etat = decisions => {
  const s = { ...emptyConsentState() };
  for (const [p, g] of Object.entries(decisions)) s[p] = currentDecision(g, { purpose: p, language: 'fr' });
  return s;
};
const ACCORD = () => etat({ [PURPOSES.POLITICAL_ANALYTICS]: true });
const REFUS  = () => etat({ [PURPOSES.POLITICAL_ANALYTICS]: false });
const POLITIQUE = { changedPurposes: [PURPOSES.POLITICAL_ANALYTICS] };

// ─── P0-3 : le bouton « Réessayer » réessaie RÉELLEMENT ─────────────────────

test('stockage en panne : la demande survit à l’onglet et le rejeu aboutit', async () => {
  const storage = stockageEnPanne();
  let enLigne = false;
  const emis = [];
  const s = createAttemptSession({
    storage,
    transport: async () => {},
    consentTransport: async (record) => {
      if (!enLigne) throw new Error('offline');
      emis.push(record);
      return true;
    },
  });

  // Accord, puis retrait — les deux avec un stockage qui refuse tout.
  await s.setConsent(ACCORD(), { anonymousSessionId: 'sid-memoire', ...POLITIQUE });
  const retrait = await s.setConsent(REFUS(), { anonymousSessionId: 'sid-memoire', ...POLITIQUE });

  const demande = retrait.withdrawals.find(w => w.purpose === PURPOSES.POLITICAL_ANALYTICS);
  assert.ok(demande?.requestId, 'la demande doit être identifiée même sans stockage');
  assert.equal(demande.persisted, false);
  assert.equal(demande.state, WITHDRAWAL_STATE.UNPERSISTED);

  // Elle est VISIBLE, et son état ne retombe pas à « rien à supprimer ».
  const avant = s.withdrawalState(PURPOSES.POLITICAL_ANALYTICS);
  assert.equal(avant.state, WITHDRAWAL_STATE.UNPERSISTED);
  assert.equal(avant.requestId, demande.requestId);
  assert.equal(s.pendingWithdrawals().length, 1,
    'sans conservation en mémoire, le bouton « Réessayer » relit une file vide');

  // Premier clic, toujours hors ligne : rien ne change, l'état reste honnête.
  const echec = await s.retryWithdrawals();
  assert.equal(echec.confirmed, 0);
  assert.equal(s.withdrawalState(PURPOSES.POLITICAL_ANALYTICS).state, WITHDRAWAL_STATE.UNPERSISTED);

  // Second clic, en ligne : la demande part RÉELLEMENT, avec son sujet d'origine.
  enLigne = true;
  const succes = await s.retryWithdrawals();
  assert.equal(succes.confirmed, 1, 'la demande gardée en mémoire n’a pas été réessayée');
  const envoye = emis.find(r => r.granted === false);
  assert.equal(envoye.anonymous_session_id, 'sid-memoire',
    'le sujet ne doit jamais être reconstruit depuis un identifiant déjà effacé');

  const apres = s.withdrawalState(PURPOSES.POLITICAL_ANALYTICS);
  assert.equal(apres.state, WITHDRAWAL_STATE.CONFIRMED);
  assert.equal(apres.requestId, demande.requestId, 'la confirmation doit porter la MÊME demande');
  assert.ok(apres.confirmedAt);
  assert.equal(apres.subject, null, 'même en mémoire, un reçu ne porte aucun identifiant');
});

test('un nouvel échec laisse l’état « unpersisted », jamais « confirmé »', async () => {
  const s = createAttemptSession({
    storage: stockageEnPanne(),
    transport: async () => {},
    consentTransport: async () => { throw new Error('offline'); },
  });
  await s.setConsent(ACCORD(), { anonymousSessionId: 'sid-x', ...POLITIQUE });
  await s.setConsent(REFUS(), { anonymousSessionId: 'sid-x', ...POLITIQUE });
  await s.retryWithdrawals();
  await s.retryWithdrawals();
  assert.equal(s.withdrawalState(PURPOSES.POLITICAL_ANALYTICS).state, WITHDRAWAL_STATE.UNPERSISTED);
});

// ─── P0-4 : le reçu, et rien de plus ────────────────────────────────────────

const CHAMPS_AUTORISES = ['requestId', 'purpose', 'requestedAt', 'confirmedAt', 'attempts'];

test('un reçu ne contient QUE le minimum — ni pseudonyme, ni compte, ni record', async () => {
  const storage = memoryStorage();
  enqueueWithdrawal(storage, {
    purpose: PURPOSES.POLITICAL_ANALYTICS,
    record: {
      purpose: PURPOSES.POLITICAL_ANALYTICS, granted: false,
      anonymous_session_id: 'sid-secret', user_id: null,
      policy_version: '2026-08-b', text_hash: 'fnv1a32:abcd',
    },
  });
  await replayWithdrawals(storage, async () => true);

  const [recu] = withdrawalReceipts(storage);
  assert.deepEqual(Object.keys(recu).sort(), [...CHAMPS_AUTORISES].sort());
  assert.ok(recu.requestId && recu.purpose && recu.confirmedAt);

  // La preuve la plus directe : le pseudonyme n'apparaît nulle part dans ce qui est écrit.
  const brut = storage.getItem(RECEIPT_KEY);
  assert.ok(!brut.includes('sid-secret'),
    'le reçu survit à l’effacement du pseudonyme : il ne doit pas le contenir');
  assert.ok(!brut.includes('fnv1a32'), 'ni l’enregistrement complet de la décision');
});

test('les anciens reçus sont NETTOYÉS à la lecture, pas seulement les nouveaux', () => {
  // Reçu écrit par la version précédente, avec le pseudonyme et le record complet.
  const storage = memoryStorage({
    [RECEIPT_KEY]: JSON.stringify([{
      requestId: 'req-legacy', purpose: PURPOSES.POLITICAL_ANALYTICS,
      subject: { kind: 'anonymous_session_id', value: 'sid-legacy' },
      record: { anonymous_session_id: 'sid-legacy' },
      requestedAt: '2026-08-01T00:00:00.000Z', confirmedAt: '2026-08-02T00:00:00.000Z', attempts: 1,
    }]),
  });

  const [recu] = withdrawalReceipts(storage);
  assert.deepEqual(Object.keys(recu).sort(), [...CHAMPS_AUTORISES].sort());
  assert.ok(!storage.getItem(RECEIPT_KEY).includes('sid-legacy'),
    'lire sans purger laisserait le pseudonyme sur le terminal indéfiniment');
});

test('un seul reçu par finalité', async () => {
  const storage = memoryStorage();
  for (const sid of ['sid-1', 'sid-2']) {
    enqueueWithdrawal(storage, {
      purpose: PURPOSES.POLITICAL_ANALYTICS,
      record: { purpose: PURPOSES.POLITICAL_ANALYTICS, granted: false, anonymous_session_id: sid },
    });
    await replayWithdrawals(storage, async () => true);
  }
  assert.equal(withdrawalReceipts(storage).length, 1);
});

test('un reçu périmé cesse d’être affiché plutôt que de mentir sur son objet', () => {
  const vieux = new Date(Date.now() - RECEIPT_MAX_AGE_MS - 1000).toISOString();
  const storage = memoryStorage({
    [RECEIPT_KEY]: JSON.stringify([{
      requestId: 'req-vieux', purpose: PURPOSES.POLITICAL_ANALYTICS,
      requestedAt: vieux, confirmedAt: vieux, attempts: 1,
    }]),
  });
  assert.deepEqual(withdrawalReceipts(storage), []);
  assert.equal(withdrawalState(storage, { purpose: PURPOSES.POLITICAL_ANALYTICS }).state,
    WITHDRAWAL_STATE.NONE);
});

test('une nouvelle décision invalide le reçu de sa finalité', async () => {
  const storage = memoryStorage();
  enqueueWithdrawal(storage, {
    purpose: PURPOSES.POLITICAL_ANALYTICS,
    record: { purpose: PURPOSES.POLITICAL_ANALYTICS, granted: false, anonymous_session_id: 'sid-1' },
  });
  await replayWithdrawals(storage, async () => true);
  assert.equal(withdrawalReceipts(storage).length, 1);

  dropReceipt(storage, PURPOSES.POLITICAL_ANALYTICS);
  assert.deepEqual(withdrawalReceipts(storage), [],
    'garder « Suppression confirmée » à côté d’un consentement en cours décrit un état révolu');
});

test('réautoriser la collecte efface le reçu par le chemin réel', async () => {
  const storage = memoryStorage();
  const s = createAttemptSession({
    storage, transport: async () => {}, consentTransport: async () => true,
  });
  await s.setConsent(ACCORD(), { anonymousSessionId: 'sid-1', ...POLITIQUE });
  await s.setConsent(REFUS(), { anonymousSessionId: 'sid-1', ...POLITIQUE });
  assert.equal(s.withdrawalState(PURPOSES.POLITICAL_ANALYTICS).state, WITHDRAWAL_STATE.CONFIRMED);

  await s.setConsent(ACCORD(), { anonymousSessionId: 'sid-2', ...POLITIQUE });
  assert.equal(s.withdrawalState(PURPOSES.POLITICAL_ANALYTICS).state, WITHDRAWAL_STATE.NONE);
});
