// POLISCOP — Aucun consentement, aucun retrait, sans SUJET TECHNIQUE valide.
//
// DÉFAUT CORRIGÉ (P0-2, 2026-08-14)
// ---------------------------------
// `buildConsentRecords()` savait recevoir quatre identifiants — pseudonyme d'analyse,
// compte, pseudonyme de mesure, pseudonyme de recherche. Le CHEMIN RÉEL, lui, n'en
// transmettait que deux : `userId` et `language`. Aucun code de production ne créait ni ne
// fournissait `measurementId` ou `researchId`.
//
// Pire, `setConsent()` reconstruisait les enregistrements de TOUTES les finalités déjà
// décidées à chaque changement. Cocher la mesure d'audience réémettait donc la décision
// politique prise trois semaines plus tôt, et produisait des lignes sans sujet :
//   • un refus `measurement` ou `research` sans identifiant ;
//   • un refus initial `political_analytics` sans pseudonyme ;
//   • une TOMBSTONE sans sujet, que le serveur ne pourra jamais exécuter — affichée à
//     l'utilisateur comme « suppression en cours ».
//
// ⚠ CES TESTS PASSENT PAR LE VRAI CHEMIN. Les tests précédents n'appelaient que le helper
// `buildConsentRecords()` : ils vérifiaient une fonction que la production n'utilisait pas
// comme eux. Ici, on espionne l'objet `attemptSession` RÉELLEMENT importé par le store.

import { test, before, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

let useStore, attemptSessionModule, PURPOSES, ALL_PURPOSES, createAttemptSession;
let emptyConsentState, currentDecision, buildConsentDecisions, SERVER_PROOF_PURPOSES;

/** Appels réellement reçus par `attemptSession.setConsent` depuis le store. */
const appels = [];
let setConsentOriginal;

before(async () => {
  attemptSessionModule = await import('../../src/lib/attemptSession.js');
  ({ createAttemptSession } = attemptSessionModule);
  ({ useStore } = await import('../../src/store/useStore.js'));
  ({
    PURPOSES, ALL_PURPOSES, emptyConsentState, currentDecision,
    buildConsentDecisions, SERVER_PROOF_PURPOSES,
  } = await import('../../src/lib/consent.js'));

  // L'espion remplace la méthode sur l'INSTANCE PARTAGÉE : c'est exactement celle que
  // `syncAttemptConsent()` obtient par import dynamique.
  const session = attemptSessionModule.attemptSession;
  setConsentOriginal = session.setConsent.bind(session);
  session.setConsent = async (state, options) => {
    appels.push({ state, options });
    return setConsentOriginal(state, options);
  };
});

beforeEach(() => {
  appels.length = 0;
  useStore.setState({ collectionConsent: {}, language: 'fr', userId: null });
});

// ─── Le vrai chemin transmet ce qu'il faut, et rien de plus ─────────────────

test('le chemin réel ne transmet QUE la finalité modifiée', async () => {
  await useStore.getState().recordCollectionConsent({ [PURPOSES.POLITICAL_ANALYTICS]: true }, { language: 'fr' });
  appels.length = 0;

  await useStore.getState().recordCollectionConsent({ [PURPOSES.MEASUREMENT]: true }, { language: 'fr' });

  assert.equal(appels.length, 1, 'la synchronisation doit être appelée une fois, et attendue');
  assert.deepEqual(appels[0].options.changedPurposes, [PURPOSES.MEASUREMENT],
    'réémettre les décisions déjà prises rejoue un choix sans rapport avec le geste courant');
});

test('les autres finalités ne sont PAS réémises', async () => {
  await useStore.getState().recordCollectionConsent({ [PURPOSES.POLITICAL_ANALYTICS]: true }, { language: 'fr' });
  appels.length = 0;
  await useStore.getState().recordCollectionConsent({ [PURPOSES.MEASUREMENT]: false }, { language: 'fr' });

  const { state, options } = appels[0];
  const { records } = buildConsentDecisions(state, {
    purposes: options.changedPurposes, anonymousSessionId: 'sid', measurementId: 'mid',
  });
  assert.deepEqual(records.map(r => r.purpose), [PURPOSES.MEASUREMENT],
    'la décision politique repartait avec, redatée, sans que personne ne l’ait reprise');
});

test('le pseudonyme de MESURE est fourni par le chemin réel, jamais celui des opinions', async () => {
  await useStore.getState().recordCollectionConsent({ [PURPOSES.MEASUREMENT]: true }, { language: 'fr' });
  const { options } = appels[0];
  assert.ok('measurementId' in options,
    'aucun code de production ne fournissait `measurementId` : la ligne partait sans sujet');
  // Hors navigateur, `localStorage` n'existe pas : l'identifiant vaut `null` et la décision
  // reste locale. Ce qui compte est que le chemin le TRANSMETTE, et qu'il ne substitue
  // jamais le pseudonyme politique.
  assert.notEqual(options.measurementId, options.anonymousSessionId ?? 'jamais-egal');
});

test('une réhydratation ne déclare AUCUNE finalité modifiée', async () => {
  // Relire l'état persisté n'est pas prendre une décision. La version précédente réémettait
  // toutes les décisions connues à chaque démarrage — une preuve de consentement redatée
  // sans que personne n'ait cliqué.
  appels.length = 0;
  useStore.getState().setConsent(true, { measurement: false });
  await useStore.getState().recordCollectionConsent({}, { language: 'fr' });
  const rehydratation = appels[appels.length - 1];
  assert.deepEqual(rehydratation.options.changedPurposes, [],
    'un appel sans décision ne doit rien transmettre');
});

// ─── Aucun enregistrement, aucune tombstone, sans sujet ─────────────────────

function memoryStorage(seed = {}) {
  const map = new Map(Object.entries(seed));
  return {
    getItem: k => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => map.set(k, String(v)),
    removeItem: k => map.delete(k),
    _map: map,
  };
}

/** Session dont on capture tout ce qui partirait vers le serveur. */
function sessionEspionne() {
  const storage = memoryStorage();
  const emis = [];
  const session = createAttemptSession({
    storage,
    transport: async () => {},
    consentTransport: async (record) => { emis.push(record); return true; },
  });
  return { session, emis, storage };
}

const etatAvec = decisions => {
  const s = { ...emptyConsentState() };
  for (const [p, g] of Object.entries(decisions)) s[p] = currentDecision(g, { purpose: p, language: 'fr' });
  return s;
};

test('refus politique INITIAL sans session : aucune ligne, aucune tombstone', async () => {
  const { session, emis, storage } = sessionEspionne();
  await session.setConsent(etatAvec({ [PURPOSES.POLITICAL_ANALYTICS]: false }), {
    changedPurposes: [PURPOSES.POLITICAL_ANALYTICS],
  });
  assert.deepEqual(emis, [],
    'un refus sans pseudonyme n’a pas de sujet : la ligne serait rejetée par la base');
  assert.equal(session.pendingWithdrawals().length, 0);
  assert.equal(storage._map.has('poliscop_withdrawal_pending'), false);
});

test('mesure acceptée puis refusée : chaque ligne porte SON pseudonyme', async () => {
  const { session, emis } = sessionEspionne();
  await session.setConsent(etatAvec({ [PURPOSES.MEASUREMENT]: true }), {
    changedPurposes: [PURPOSES.MEASUREMENT], measurementId: 'mid-1',
  });
  await session.setConsent(etatAvec({ [PURPOSES.MEASUREMENT]: false }), {
    changedPurposes: [PURPOSES.MEASUREMENT], measurementId: 'mid-1',
  });

  assert.equal(emis.length, 2);
  for (const r of emis) {
    assert.equal(r.purpose, PURPOSES.MEASUREMENT);
    assert.equal(r.anonymous_session_id, 'mid-1');
    assert.equal(r.user_id, null);
  }
});

test('mesure refusée SANS pseudonyme : décision locale, rien n’est émis', async () => {
  const { session, emis } = sessionEspionne();
  await session.setConsent(etatAvec({ [PURPOSES.MEASUREMENT]: false }), {
    changedPurposes: [PURPOSES.MEASUREMENT], measurementId: null,
  });
  assert.deepEqual(emis, []);
});

test('recherche acceptée ou refusée : aucune preuve serveur tant que le flux n’existe pas', async () => {
  for (const granted of [true, false]) {
    const { session, emis } = sessionEspionne();
    await session.setConsent(etatAvec({ [PURPOSES.RESEARCH]: granted }), {
      changedPurposes: [PURPOSES.RESEARCH],
    });
    assert.deepEqual(emis, [],
      'aucun pseudonyme de recherche n’existe : une ligne partirait sans sujet ou emprunterait '
      + 'celui des opinions');
  }
  assert.equal(SERVER_PROOF_PURPOSES.includes(PURPOSES.RESEARCH), false);
});

test('cloud_save émis porte le COMPTE seul ; sans compte, rien ne part', async () => {
  const { session, emis } = sessionEspionne();
  await session.setConsent(etatAvec({ [PURPOSES.CLOUD_SAVE]: true }), {
    changedPurposes: [PURPOSES.CLOUD_SAVE], userId: 'compte-7',
  });
  assert.equal(emis.length, 1);
  assert.equal(emis[0].user_id, 'compte-7');
  assert.equal(emis[0].anonymous_session_id, null);

  const sansCompte = sessionEspionne();
  await sansCompte.session.setConsent(etatAvec({ [PURPOSES.CLOUD_SAVE]: true }), {
    changedPurposes: [PURPOSES.CLOUD_SAVE], userId: null,
  });
  assert.deepEqual(sansCompte.emis, []);
});

test('aucune ligne émise par le moteur ne peut être sans sujet', async () => {
  const toutes = Object.fromEntries(ALL_PURPOSES.map(p => [p, true]));
  const { session, emis } = sessionEspionne();
  await session.setConsent(etatAvec(toutes), {
    changedPurposes: ALL_PURPOSES,
    anonymousSessionId: 'sid-pol', userId: 'compte-7', measurementId: 'mid-1',
  });
  assert.ok(emis.length > 0);
  for (const r of emis) {
    assert.ok(r.anonymous_session_id != null || r.user_id != null, `${r.purpose} sans sujet`);
    assert.ok(!(r.anonymous_session_id != null && r.user_id != null), `${r.purpose} avec deux sujets`);
  }
});
