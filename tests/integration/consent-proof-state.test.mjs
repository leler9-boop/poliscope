// POLISCOP — L'état de la preuve doit être RÉACTIF, et l'écran doit le suivre.
//
// DÉFAUT CORRIGÉ (2026-08-19)
// ---------------------------
// `Questionnaire.jsx` gardait l'état de la preuve dans un `useState` local, alimenté UNE
// SEULE FOIS, au clic de l'écran d'entrée. Or `attemptSession.attach()` rejoue les preuves
// tout seul — au démarrage et au retour du réseau — sans prévenir le composant.
//
// Deux affirmations fausses en découlaient :
//
//   1. accord donné hors ligne puis réseau retrouvé : la preuve est confirmée,
//      `canTransmit()` devient vrai, les réponses suivantes partent — et l'écran continue
//      d'annoncer que tout reste local ;
//   2. rechargement avec un accord valide mais une preuve encore en attente :
//      `handleIntroStart(null)` sort sans rien initialiser, l'état reste `idle`, et AUCUN
//      avertissement n'est affiché alors que rien ne peut partir.
//
// ⚠ LE TEST PRÉCÉDENT NE PROUVAIT RIEN. Il cherchait `setProofState` par expression
// régulière dans le fichier : il aurait continué de passer avec un état figé pour toujours.
// Ceux-ci observent les TRANSITIONS réelles, via l'abonnement.

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { createAttemptSession } from '../../src/lib/attemptSession.js';
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

/** Stockage qui refuse toute écriture — Safari en navigation privée. */
const stockageEnPanne = () => ({
  getItem: () => null,
  setItem: () => { throw new Error('QuotaExceededError'); },
  removeItem: () => { throw new Error('QuotaExceededError'); },
});

const etat = decisions => {
  const s = { ...emptyConsentState() };
  for (const [p, g] of Object.entries(decisions)) s[p] = currentDecision(g, { purpose: p, language: 'fr' });
  return s;
};
const ACCORD = () => etat({ [PURPOSES.POLITICAL_ANALYTICS]: true });
const REFUS  = () => etat({ [PURPOSES.POLITICAL_ANALYTICS]: false });
const POLITIQUE = { changedPurposes: [PURPOSES.POLITICAL_ANALYTICS] };

/** Session + journal des états DIFFUSÉS aux abonnés — c'est ce que verrait l'écran. */
function observer({ enLigne = true, storage = memoryStorage() } = {}) {
  const reponses = [];
  const s = createAttemptSession({
    storage,
    transport: async (batch) => { reponses.push(batch); },
    consentTransport: async () => {
      if (!enLigne) throw new Error('offline');
      return true;
    },
  });
  const vus = [];
  const desabonner = s.subscribeConsentProofState(e => vus.push(e.state));
  return { session: s, vus, reponses, storage, desabonner, brancher: v => { enLigne = v; } };
}

// ─── 1 & 2 : l'état de départ ───────────────────────────────────────────────

test('stockage vide + accord EN LIGNE → confirmed', async () => {
  const o = observer();
  await o.session.setConsent(ACCORD(), { ...POLITIQUE });
  assert.equal(o.session.consentProofState().state, 'confirmed');
  assert.equal(o.vus.at(-1), 'confirmed');
});

test('accord HORS LIGNE → pending', async () => {
  const o = observer({ enLigne: false });
  await o.session.setConsent(ACCORD(), { ...POLITIQUE });
  assert.equal(o.session.consentProofState().state, 'pending');
  assert.equal(o.session.canTransmit(), false);
});

// ─── 3 & 4 : la transition que personne ne voyait ───────────────────────────

test('retour du réseau : la transition pending → confirmed est OBSERVABLE', async () => {
  const o = observer({ enLigne: false });
  await o.session.setConsent(ACCORD(), { ...POLITIQUE });
  assert.equal(o.vus.at(-1), 'pending');

  o.brancher(true);
  // C'est exactement ce que fait `attach()` au retour du réseau — sans aucune action de
  // l'utilisateur, et sans que le gestionnaire de l'écran d'entrée soit rappelé.
  await o.session.replayConsentProofs();

  assert.equal(o.vus.at(-1), 'confirmed',
    'le rejeu automatique ne notifiait personne : l’écran restait sur « pending »');
  assert.deepEqual(o.vus, ['none', 'pending', 'confirmed'],
    'la séquence complète doit être visible par un abonné');
});

test('après la transition, l’avertissement disparaît', async () => {
  const o = observer({ enLigne: false });
  await o.session.setConsent(ACCORD(), { ...POLITIQUE });
  const avertit = e => e === 'pending' || e === 'unpersisted';
  assert.equal(avertit(o.vus.at(-1)), true);

  o.brancher(true);
  await o.session.replayConsentProofs();
  assert.equal(avertit(o.vus.at(-1)), false,
    'l’avertissement doit tomber dès la confirmation, sans message permanent en remplacement');
  assert.equal(o.session.canTransmit(), true);
});

// ─── 5 : rechargement avec une preuve encore en attente ─────────────────────

test('rechargement avec preuve persistée en attente → pending visible DÈS l’abonnement', async () => {
  const premier = observer({ enLigne: false });
  await premier.session.setConsent(ACCORD(), { ...POLITIQUE });

  // Nouveau « démarrage » : même stockage, session reconstruite, AUCUNE nouvelle décision —
  // c'est le cas où `handleIntroStart(null)` sortait sans rien initialiser.
  const apres = memoryStorage(Object.fromEntries(premier.storage._map));
  const session = createAttemptSession({
    storage: apres, transport: async () => {}, consentTransport: async () => { throw new Error('offline'); },
  });
  // La session doit connaître le choix local relu du stockage persistant.
  await session.setConsent(ACCORD(), {});

  const vus = [];
  session.subscribeConsentProofState(e => vus.push(e.state));
  assert.deepEqual(vus, ['pending'],
    'l’état COURANT doit être émis à l’abonnement : sinon un composant monté après un rejeu '
    + 'reste sur sa valeur initiale');
  assert.equal(session.canTransmit(), false);
});

// ─── 6 : stockage indisponible ──────────────────────────────────────────────

test('stockage indisponible → unpersisted visible', async () => {
  const o = observer({ enLigne: false, storage: stockageEnPanne() });
  await o.session.setConsent(ACCORD(), { anonymousSessionId: 'sid-memoire', ...POLITIQUE });
  assert.equal(o.session.consentProofState().state, 'unpersisted');
  assert.equal(o.vus.at(-1), 'unpersisted');
});

// ─── 7 : le retrait retire l'autorisation IMMÉDIATEMENT ─────────────────────

test('retrait → l’état confirmé disparaît immédiatement', async () => {
  const o = observer();
  await o.session.setConsent(ACCORD(), { ...POLITIQUE });
  assert.equal(o.vus.at(-1), 'confirmed');

  await o.session.setConsent(REFUS(), { ...POLITIQUE });
  assert.equal(o.session.consentProofState().state, 'none');
  assert.equal(o.vus.at(-1), 'none',
    'garder « confirmé » après un retrait laisserait croire que la collecte continue');
  assert.equal(o.session.canTransmit(), false);
});

// ─── 8 : rien de rétroactif, malgré la transition ───────────────────────────

test('aucune réponse antérieure à la confirmation n’est rejouée', async () => {
  const o = observer({ enLigne: false });
  await o.session.setConsent(ACCORD(), { ...POLITIQUE });
  o.session.begin({ mode: 'deep', questionnaireVersion: 'v', scoringVersion: 'v', language: 'fr' });
  o.session.showQuestion('ECO_1', 0);
  o.session.recordAnswer('ECO_1', 'answered', 4);      // AVANT la confirmation

  o.brancher(true);
  await o.session.replayConsentProofs();
  await o.session.queue.flush();
  const avant = o.reponses.flatMap(b => b.items.map(i => i.question_id));
  assert.ok(!avant.includes('ECO_1'),
    'la transition ouvre la collecte pour la SUITE, jamais pour ce qui précède');

  o.session.showQuestion('ECO_2', 1);
  o.session.recordAnswer('ECO_2', 'answered', 5);      // APRÈS
  await o.session.queue.flush();
  assert.ok(o.reponses.flatMap(b => b.items.map(i => i.question_id)).includes('ECO_2'));
});

// ─── L'abonnement lui-même ──────────────────────────────────────────────────

test('le désabonnement est effectif — aucun écran démonté n’est notifié', async () => {
  const o = observer({ enLigne: false });
  o.desabonner();
  const avant = o.vus.length;
  await o.session.setConsent(ACCORD(), { ...POLITIQUE });
  assert.equal(o.vus.length, avant,
    'notifier un composant démonté fuit et déclenche des rendus sur un arbre mort');
});

test('un abonné fautif ne casse pas la chaîne de notification', async () => {
  const o = observer({ enLigne: false });
  o.session.subscribeConsentProofState(() => { throw new Error('abonné fautif'); });
  const vus2 = [];
  o.session.subscribeConsentProofState(e => vus2.push(e.state));
  await o.session.setConsent(ACCORD(), { ...POLITIQUE });
  assert.equal(vus2.at(-1), 'pending');
});
