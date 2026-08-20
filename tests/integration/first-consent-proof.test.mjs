// POLISCOP — Le TOUT PREMIER accord anonyme, depuis un stockage vide.
//
// DÉFAUT CORRIGÉ (P0-1 du contre-audit du 2026-08-14)
// ---------------------------------------------------
// Reproduit tel quel sur `7b3f668` :
//
//     { "created": "<uuid>", "sent": 0,
//       "skipped": [{ "purpose": "political_analytics", "granted": true,
//                     "reason": "no_subject" }] }
//
// Enchaînement exact dans `setConsent()` :
//   1. `pseudonymeAvant` était lu AVANT toute création — donc `null` sur un terminal neuf ;
//   2. `analyticsSessionId(true)` créait ensuite le pseudonyme ;
//   3. `buildConsentDecisions()` recevait pourtant `pseudonymeAvant`.
// Le sujet du RETRAIT était donc utilisé pour l'ACCORD. Conséquence : le tout premier
// consentement anonyme du produit — le cas le plus fréquent qui soit — n'envoyait aucune
// preuve, et était écarté en `no_subject`.
//
// ⚠ Les tests verts précédents ne couvraient pas ce chemin : ils passaient tous
// `anonymousSessionId: 'sid-1'` explicitement, ce qui court-circuite exactement la ligne
// fautive. Ici, le stockage est VIDE et aucun identifiant n'est fourni.

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { createAttemptSession } from '../../src/lib/attemptSession.js';
import { PURPOSES, emptyConsentState, currentDecision } from '../../src/lib/consent.js';
import { CONFIRMED_KEY, PROOF_KEY } from '../../src/lib/consentProofQueue.js';

function memoryStorage(seed = {}) {
  const map = new Map(Object.entries(seed));
  return {
    getItem: k => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => map.set(k, String(v)),
    removeItem: k => map.delete(k),
    _map: map,
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
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

/** Session dont on capture chaque enveloppe de consentement réellement transmise. */
function session({ enLigne = true, storage = memoryStorage() } = {}) {
  const emis = [];
  const reponses = [];
  const s = createAttemptSession({
    storage,
    transport: async (batch) => { reponses.push(batch); },
    consentTransport: async (record) => {
      if (!enLigne) throw new Error('offline');
      emis.push(record);
      return true;
    },
  });
  return {
    session: s, emis, reponses, storage,
    brancher: (v) => { enLigne = v; },
  };
}

// ─── P0-1 : le premier accord porte le pseudonyme qui vient d'être créé ─────

test('premier accord depuis un stockage VIDE : une preuve part, avec le pseudonyme créé', async () => {
  const { session: s, emis, storage } = session();
  assert.equal(storage._map.size, 0, 'le terminal doit être neuf');

  // Aucun `anonymousSessionId` fourni : c'est le chemin réel de l'écran d'entrée du quiz.
  const issue = await s.setConsent(ACCORD(), { ...POLITIQUE });

  const cree = storage.getItem('poliscop_analytics_sid');
  assert.match(String(cree), UUID, 'l’accord doit créer un pseudonyme d’analyse');

  assert.equal(emis.length, 1, `${emis.length} preuve(s) transmise(s) au lieu d’une`);
  assert.equal(emis[0].purpose, PURPOSES.POLITICAL_ANALYTICS);
  assert.equal(emis[0].granted, true);
  assert.equal(emis[0].anonymous_session_id, cree,
    'la preuve d’accord portait le pseudonyme d’AVANT création — donc null sur un terminal neuf');
  assert.equal(emis[0].user_id, null);

  assert.deepEqual(issue.skipped, [],
    'aucune décision ne doit être écartée : c’est le « no_subject » du contre-audit');
  assert.deepEqual(issue.emitted.map(e => [e.purpose, e.ok]), [[PURPOSES.POLITICAL_ANALYTICS, true]]);
});

test('le retrait continue de porter le pseudonyme lu AVANT effacement', async () => {
  const { session: s, emis, storage } = session();
  await s.setConsent(ACCORD(), { ...POLITIQUE });
  const pseudonyme = storage.getItem('poliscop_analytics_sid');
  emis.length = 0;

  await s.setConsent(REFUS(), { ...POLITIQUE });

  assert.equal(storage.getItem('poliscop_analytics_sid'), null, 'le retrait doit effacer le pseudonyme');
  const retrait = emis.find(r => r.granted === false);
  assert.ok(retrait, 'aucune demande de suppression transmise');
  assert.equal(retrait.anonymous_session_id, pseudonyme,
    'sans le pseudonyme d’avant, le serveur ne saurait pas quoi supprimer');
});

// ─── P0-2 : trois états distincts, et la porte de transmission ──────────────

test('rien ne part tant que la preuve n’est pas CONFIRMÉE', async () => {
  const h = session({ enLigne: false });
  const issue = await h.session.setConsent(ACCORD(), { ...POLITIQUE });

  assert.equal(issue.proof.state, 'pending', 'la preuve doit être en file durable');
  assert.equal(issue.transmissionAllowed, false);
  assert.equal(h.session.canTransmit(), false,
    'le choix local vaut « oui », mais le serveur ne peut prouver aucun consentement');

  h.session.begin({ mode: 'deep', questionnaireVersion: 'v', scoringVersion: 'v', language: 'fr' });
  h.session.showQuestion('ECO_1', 0);
  h.session.recordAnswer('ECO_1', 'answered', 4);
  await h.session.complete({ answeredCount: 1, shownCount: 1 });

  assert.equal(h.reponses.length, 0, 'une réponse est partie sans preuve recevable');
  assert.equal(h.session.queue.getStatus().pending, 0,
    'elle ne doit pas non plus être mise en file : elle repartirait rétroactivement');
});

test('le questionnaire reste utilisable hors ligne, en local', async () => {
  const h = session({ enLigne: false });
  await h.session.setConsent(ACCORD(), { ...POLITIQUE });
  h.session.begin({ mode: 'deep', questionnaireVersion: 'v', scoringVersion: 'v', language: 'fr' });
  h.session.showQuestion('ECO_1', 0);
  h.session.recordAnswer('ECO_1', 'answered', 4);
  // La mesure locale continue : c'est la TRANSMISSION qui est suspendue, pas le produit.
  assert.ok(h.session.timer.snapshot('ECO_1'), 'le chronométrage local doit continuer');
});

test('au retour du réseau, la preuve est rejouée et la collecte s’ouvre', async () => {
  const h = session({ enLigne: false });
  await h.session.setConsent(ACCORD(), { ...POLITIQUE });
  assert.equal(h.session.pendingConsentProofs().length, 1);

  h.brancher(true);
  const rejeu = await h.session.replayConsentProofs();

  assert.equal(rejeu.confirmed.length, 1);
  assert.equal(rejeu.confirmed[0].purpose, PURPOSES.POLITICAL_ANALYTICS);
  assert.equal(h.session.pendingConsentProofs().length, 0);
  assert.equal(h.session.canTransmit(), true);
});

test('aucune réponse ANTÉRIEURE à la confirmation n’est envoyée rétroactivement', async () => {
  const h = session({ enLigne: false });
  await h.session.setConsent(ACCORD(), { ...POLITIQUE });
  h.session.begin({ mode: 'deep', questionnaireVersion: 'v', scoringVersion: 'v', language: 'fr' });
  h.session.showQuestion('ECO_1', 0);
  h.session.recordAnswer('ECO_1', 'answered', 4);   // avant confirmation

  h.brancher(true);
  await h.session.replayConsentProofs();
  await h.session.queue.flush();

  const envoyees = h.reponses.flatMap(b => b.items.map(i => i.question_id));
  assert.ok(!envoyees.includes('ECO_1'),
    'consentir n’est pas consentir pour le passé : ECO_1 précède la preuve recevable');

  h.session.showQuestion('ECO_2', 1);
  h.session.recordAnswer('ECO_2', 'answered', 5);   // après confirmation
  await h.session.queue.flush();
  const apres = h.reponses.flatMap(b => b.items.map(i => i.question_id));
  assert.ok(apres.includes('ECO_2'), 'les interactions postérieures, elles, doivent partir');
});

test('accord hors ligne PUIS retrait avant reconnexion : l’accord ne ressuscite pas', async () => {
  const h = session({ enLigne: false });
  await h.session.setConsent(ACCORD(), { ...POLITIQUE });
  await h.session.setConsent(REFUS(), { ...POLITIQUE });

  h.brancher(true);
  await h.session.replayConsentProofs();
  await h.session.retryWithdrawals();

  assert.equal(h.session.canTransmit(), false,
    'un accord resté en file a rétabli la collecte APRÈS un refus explicite');
  const accords = h.emis.filter(r => r.granted === true);
  assert.equal(accords.length, 0,
    'la décision la plus récente doit remplacer la précédente restée en attente');
});

test('une réhydratation sans décision ne met AUCUNE preuve en file', async () => {
  const h = session();
  await h.session.setConsent(ACCORD(), {});      // aucune finalité déclarée modifiée
  assert.equal(h.emis.length, 0);
  assert.equal(h.session.pendingConsentProofs().length, 0);
  assert.equal(h.session.canTransmit(), false);
});

test('une réponse AMBIGUË du transport ne vaut pas confirmation', async () => {
  for (const reponse of [undefined, null, {}, 'ok', 1, []]) {
    const storage = memoryStorage();
    const s = createAttemptSession({
      storage,
      transport: async () => {},
      consentTransport: async () => reponse,
    });
    await s.setConsent(ACCORD(), { ...POLITIQUE });
    assert.equal(s.canTransmit(), false, `« ${JSON.stringify(reponse)} » a été pris pour une confirmation`);
    assert.equal(s.pendingConsentProofs().length, 1, 'la preuve doit rester en file');
  }
});

test('la preuve confirmée est liée au pseudonyme : un autre sujet n’autorise rien', async () => {
  const h = session();
  await h.session.setConsent(ACCORD(), { ...POLITIQUE });
  assert.equal(h.session.canTransmit(), true);

  // Le registre est réécrit pour un pseudonyme étranger — cas d'un identifiant effacé
  // puis recréé, ou d'une écriture par un autre onglet.
  h.storage.setItem(CONFIRMED_KEY, JSON.stringify({
    [PURPOSES.POLITICAL_ANALYTICS]: { subject: 'un-autre-pseudonyme', confirmedAt: '2026-01-01T00:00:00.000Z' },
  }));
  assert.equal(h.session.canTransmit(), false,
    'une confirmation obtenue pour un autre sujet n’autorise pas la collecte du sujet courant');
});

// ─── L'entrée du quiz lit la source de vérité, sans en garder de copie ─────

test('le chemin d’entrée du quiz ATTEND la promesse et n’a AUCUNE copie de l’état', async () => {
  // ⚠ Ce test cherchait auparavant `setProofState` par expression régulière. Il aurait
  // continué de passer avec un état figé pour toujours — ce qui était précisément le défaut.
  // Le COMPORTEMENT est désormais vérifié dans `consent-proof-state.test.mjs` ; il ne reste
  // ici que ce qu'une observation d'exécution ne peut pas voir : l'absence de copie locale.
  const { readFile } = await import('node:fs/promises');
  const src = await readFile(new URL('../../src/pages/Questionnaire.jsx', import.meta.url), 'utf8');

  assert.match(src, /await recordCollectionConsent\(/,
    'la promesse était lancée puis abandonnée : personne ne savait si la preuve était partie');
  assert.match(src, /subscribeConsentProofState\(/,
    'l’écran doit s’abonner à la source de vérité, pas tenir sa propre version');
  assert.ok(!/setProofState/.test(src),
    'une copie locale de l’état redevient périmée dès le premier rejeu automatique');
});

test('les trois files restent distinctes : preuves, réponses, suppressions', async () => {
  const h = session({ enLigne: false });
  await h.session.setConsent(ACCORD(), { ...POLITIQUE });
  const cles = [...h.storage._map.keys()];
  assert.ok(cles.includes(PROOF_KEY));
  assert.ok(!cles.includes('poliscop_withdrawal_pending'),
    'un accord ne doit rien déposer dans la file des suppressions');
  assert.ok(!cles.includes('poliscop_pending_mutations'),
    'ni dans celle des réponses');
});
