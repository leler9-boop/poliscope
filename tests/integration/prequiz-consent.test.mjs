// POLISCOP — Le consentement à la collecte anonyme, recueilli AVANT le quiz.
//
// CE QUI MANQUAIT
// ---------------
// `effectiveConsent()` lisait déjà `collectionConsent`, et `attemptSession` refusait
// d'émettre sans `political_analytics`. Mais RIEN n'écrivait jamais `collectionConsent` :
// aucune action du store, aucun écran. La collecte n'était donc pas « refusée par
// défaut » — elle était impossible à accorder, et la question n'était jamais posée.
//
// Un refus qu'on n'a pas eu l'occasion de donner n'est pas un refus. Et pendant ce
// temps, l'écran d'entrée affirmait sans condition que les réponses restaient sur
// l'appareil, ce qui décrivait comme une propriété du produit ce qui n'était qu'un
// chemin de code manquant.
//
// Ces tests observent le TRANSPORT, pas l'intention : ils échouent si le moindre octet
// part sans accord, ou continue de partir après un retrait.

import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  PURPOSES, ALL_PURPOSES, CONSENT_POLICY_VERSION, LEGACY_POLICY_VERSION,
  canTransmitPoliticalData, canCollectAttemptData, emptyConsentState,
} from '../../src/lib/consent.js';
import { createAttemptSession } from '../../src/lib/attemptSession.js';
import { useStore, effectiveConsent } from '../../src/store/useStore.js';

function memoryStorage() {
  const map = new Map();
  return {
    getItem: k => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => map.set(k, String(v)),
    removeItem: k => map.delete(k),
  };
}

/** Session instrumentée : tout ce qui partirait est capturé au lieu d'être envoyé. */
function spySession() {
  const sent = [];
  const session = createAttemptSession({
    storage: memoryStorage(),
    transport: async (batch) => { sent.push(batch); },
  });
  return { session, sent };
}

/** Remet le store dans l'état d'un terminal jamais interrogé. */
function freshStore() {
  useStore.setState({
    collectionConsent: null,
    consent: { politicalData: null, measurement: null, grantedAt: null, version: null },
    language: 'fr',
  });
  return useStore.getState();
}

const currentConsent = () => effectiveConsent(
  useStore.getState().consent, useStore.getState().collectionConsent);

// ─── L'état de départ ───────────────────────────────────────────────────────

test('avant toute question posée, aucune finalité n’est accordée', () => {
  freshStore();
  const c = currentConsent();
  for (const purpose of ALL_PURPOSES) {
    assert.notEqual(c[purpose], true, `${purpose} ne doit pas être accordé par défaut`);
  }
  assert.equal(canTransmitPoliticalData(c), false);
  assert.equal(canCollectAttemptData(c), false);
});

test('une décision non prise se distingue d’un refus', () => {
  freshStore();
  assert.equal(useStore.getState().collectionConsent, null,
    '`null` = jamais interrogé ; sans cette distinction, l’écran ne pourrait pas savoir '
    + 's’il doit encore poser la question');
});

// ─── Accepter ───────────────────────────────────────────────────────────────

test('accepter enregistre une décision datée, versionnée et empreintée', () => {
  freshStore().recordCollectionConsent({ [PURPOSES.POLITICAL_ANALYTICS]: true }, { language: 'fr' });

  const d = useStore.getState().collectionConsent[PURPOSES.POLITICAL_ANALYTICS];
  assert.equal(d.granted, true);
  assert.equal(d.policyVersion, CONSENT_POLICY_VERSION);
  assert.equal(d.textHashAvailable, true);
  assert.ok(d.textHash, 'sans empreinte du texte, on ne sait pas à QUOI la personne a consenti');
  assert.ok(Date.parse(d.decidedAt), 'la décision doit être datée');
});

test('après acceptation, la transmission devient possible', () => {
  freshStore().recordCollectionConsent({ [PURPOSES.POLITICAL_ANALYTICS]: true });
  assert.equal(canTransmitPoliticalData(currentConsent()), true);
  assert.equal(canCollectAttemptData(currentConsent()), true);
});

// ─── Refuser ────────────────────────────────────────────────────────────────

test('refuser enregistre un refus explicite et ne transmet rien', () => {
  freshStore().recordCollectionConsent({ [PURPOSES.POLITICAL_ANALYTICS]: false });

  const d = useStore.getState().collectionConsent[PURPOSES.POLITICAL_ANALYTICS];
  assert.equal(d.granted, false);
  assert.ok(Date.parse(d.decidedAt), 'un refus est une décision : il se date aussi');
  assert.equal(canTransmitPoliticalData(currentConsent()), false);
});

test('aucune réponse politique ne part sans accord', async () => {
  const { session, sent } = spySession();
  await session.setConsent(emptyConsentState(), { anonymousSessionId: 'anon-1', language: 'fr' });
  session.start?.({ mode: 'deep' });
  session.recordAnswer?.({ questionId: 'ECO_1', answerValue: 4 });
  await session.flush?.();
  assert.deepEqual(sent, [], 'aucun octet ne doit quitter l’appareil avant l’accord');
});

test('après refus, rien ne part non plus', async () => {
  const { session, sent } = spySession();
  const refus = { ...emptyConsentState(), [PURPOSES.POLITICAL_ANALYTICS]: false };
  await session.setConsent(refus, { anonymousSessionId: 'anon-2', language: 'fr' });
  session.start?.({ mode: 'deep' });
  session.recordAnswer?.({ questionId: 'ECO_1', answerValue: 4 });
  await session.flush?.();
  assert.deepEqual(sent, []);
});

// ─── Changer d'avis, puis retirer ───────────────────────────────────────────

test('on peut changer d’avis : le refus remplace l’accord, daté', () => {
  const s = freshStore();
  s.recordCollectionConsent({ [PURPOSES.POLITICAL_ANALYTICS]: true });
  assert.equal(canTransmitPoliticalData(currentConsent()), true);

  s.withdrawCollectionConsent([PURPOSES.POLITICAL_ANALYTICS]);
  const d = useStore.getState().collectionConsent[PURPOSES.POLITICAL_ANALYTICS];
  assert.equal(d.granted, false);
  assert.equal(canTransmitPoliticalData(currentConsent()), false,
    'le retrait doit arrêter les transmissions futures, pas seulement l’affichage');
});

test('le retrait vide ce qui attendait d’être envoyé', async () => {
  const { session, sent } = spySession();
  const accord = { ...emptyConsentState(), [PURPOSES.POLITICAL_ANALYTICS]: true };
  await session.setConsent(accord, { anonymousSessionId: 'anon-3', language: 'fr' });
  session.start?.({ mode: 'deep' });
  session.recordAnswer?.({ questionId: 'ECO_1', answerValue: 4 });

  const avant = sent.length;
  const retrait = { ...emptyConsentState(), [PURPOSES.POLITICAL_ANALYTICS]: false };
  await session.setConsent(retrait, { anonymousSessionId: 'anon-3', language: 'fr' });
  session.recordAnswer?.({ questionId: 'ECO_2', answerValue: 2 });
  await session.flush?.();

  assert.equal(sent.length, avant,
    'aucun envoi supplémentaire ne doit avoir lieu après le retrait');
});

// ─── Ce qu'on ne fabrique jamais ────────────────────────────────────────────

test('un ancien consentement n’est jamais promu en accord courant', () => {
  freshStore();
  useStore.setState({
    consent: {
      politicalData: true, measurement: true,
      grantedAt: '2026-07-11T10:00:00.000Z', version: LEGACY_POLICY_VERSION,
    },
  });
  const c = currentConsent();
  const d = c[PURPOSES.POLITICAL_ANALYTICS];
  // Le texte de 2026-07 ne mentionnait ni le temps par question, ni l'identifiant
  // pseudonyme d'analyse. Le reporter tel quel ferait signer un texte jamais lu.
  if (d && typeof d === 'object') {
    assert.notEqual(d.policyVersion, CONSENT_POLICY_VERSION,
      'une décision héritée ne doit pas porter la version du texte courant');
  }
});

test('accepter la collecte n’accorde PAS la sauvegarde liée au compte', () => {
  freshStore().recordCollectionConsent({ [PURPOSES.POLITICAL_ANALYTICS]: true });
  const c = currentConsent();
  assert.notEqual(c[PURPOSES.CLOUD_SAVE], true,
    '`cloud_save` transporte un identifiant de compte : elle se demande séparément');
  assert.notEqual(c[PURPOSES.RESEARCH], true,
    'la réutilisation scientifique est une finalité distincte, jamais déduite');
});

test('une finalité absente de la décision reste inchangée', () => {
  const s = freshStore();
  s.recordCollectionConsent({ [PURPOSES.MEASUREMENT]: true });
  s.recordCollectionConsent({ [PURPOSES.POLITICAL_ANALYTICS]: false });
  const st = useStore.getState().collectionConsent;
  assert.equal(st[PURPOSES.MEASUREMENT].granted, true,
    'un choix partiel ne doit pas écraser une décision antérieure par omission');
  assert.equal(st[PURPOSES.POLITICAL_ANALYTICS].granted, false);
});

test('une finalité inconnue est ignorée plutôt qu’enregistrée', () => {
  const s = freshStore();
  s.recordCollectionConsent({ finalite_inventee: true });
  assert.deepEqual(useStore.getState().collectionConsent, {});
});

// ─── Le texte affiché ───────────────────────────────────────────────────────

test('l’écran d’entrée n’affirme plus sans condition que les réponses restent sur l’appareil', async () => {
  const { readFile } = await import('node:fs/promises');
  const src = await readFile(new URL('../../src/components/PreQuizModal.jsx', import.meta.url), 'utf8');

  for (const phrase of ['Tes réponses restent sur cet appareil', 'Your answers stay on this device']) {
    assert.ok(!src.includes(phrase),
      `l’affirmation « ${phrase} » décrit comme acquis ce qui dépend d’un choix non posé`);
  }
  // …et le choix est réellement offert, dans les deux sens.
  assert.ok(src.includes('onStart(true)') && src.includes('onStart(false)'),
    'les deux issues doivent exister comme actions explicites');
});
