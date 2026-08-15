// POLISCOP — Le retrait promis doit exister, et arrêter le TRANSPORT.
//
// DÉFAUT CORRIGÉ (P0-B)
// ---------------------
// L'écran d'entrée affirmait « vous pouvez changer d'avis à tout moment depuis Mes données ».
// Or `DataControlsModal` ne lisait pas `collectionConsent`, n'appelait jamais
// `withdrawCollectionConsent()` et ne montrait que la sauvegarde liée au COMPTE. Les
// visiteurs sans compte n'avaient aucune commande. La promesse affichée était fausse.
//
// ⚠ Ces tests observent ce qui PART, pas ce que le store contient. Un état Zustand correct
// avec un transport qui continue d'émettre serait un retrait de façade.

import { test, before } from 'node:test';
import assert from 'node:assert/strict';

let h, renderToStaticMarkup, useStore, CollectionConsentControl;
let PURPOSES, emptyConsentState, createAttemptSession, canCollectAttemptData;

before(async () => {
  ({ createElement: h } = await import('react'));
  ({ renderToStaticMarkup } = await import('react-dom/server'));
  CollectionConsentControl = (await import('../../src/components/CollectionConsentControl.jsx')).default;
  ({ useStore } = await import('../../src/store/useStore.js'));
  ({ PURPOSES, emptyConsentState, canCollectAttemptData } = await import('../../src/lib/consent.js'));
  ({ createAttemptSession } = await import('../../src/lib/attemptSession.js'));
});

function memoryStorage() {
  const map = new Map();
  return {
    getItem: k => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => map.set(k, String(v)),
    removeItem: k => map.delete(k),
    _map: map,
  };
}

/** Session instrumentée : on capture tout ce qui partirait réellement. */
function spySession() {
  const storage = memoryStorage();
  const envoyes = [];
  const session = createAttemptSession({
    storage,
    transport: async (batch) => { envoyes.push(batch); },
  });
  return { session, envoyes, storage };
}

const accord = () => ({ ...emptyConsentState(), [PURPOSES.POLITICAL_ANALYTICS]: true });
const refus  = () => ({ ...emptyConsentState(), [PURPOSES.POLITICAL_ANALYTICS]: false });

// ─── Le transport ───────────────────────────────────────────────────────────

test('après retrait, plus aucune réponse ne part', async () => {
  const { session, envoyes } = spySession();
  await session.setConsent(accord(), { anonymousSessionId: 'sid-test' });
  session.begin({ mode: 'deep', questionnaireVersion: 'v', scoringVersion: 'v', language: 'fr' });
  session.showQuestion('ECO_1', 0);
  session.recordAnswer('ECO_1', 'answered', 4);

  await session.setConsent(refus(), { anonymousSessionId: 'sid-test' });
  const avant = envoyes.length;

  session.showQuestion('ECO_2', 1);
  session.recordAnswer('ECO_2', 'answered', 5);
  await session.flushOnUnload?.();

  assert.equal(envoyes.length, avant,
    'une réponse est partie APRÈS le retrait : le retrait est décoratif');
});

test('le retrait efface les identifiants déposés sur cet appareil', async () => {
  const { session, storage } = spySession();
  await session.setConsent(accord(), { anonymousSessionId: 'sid-test' });
  session.begin({ mode: 'deep', questionnaireVersion: 'v', scoringVersion: 'v', language: 'fr' });
  assert.ok(storage._map.size > 0, 'l’accord doit bien déposer quelque chose');

  await session.setConsent(refus(), { anonymousSessionId: 'sid-test' });
  const restants = [...storage._map.keys()].filter(k => /attempt|analytics_sid/.test(k));
  assert.deepEqual(restants, [],
    'laisser un identifiant en place fait survivre le traceur au retrait');
});

test('un refus initial n’émet jamais rien', async () => {
  const { session, envoyes } = spySession();
  await session.setConsent(refus(), {});
  session.begin({ mode: 'quick', questionnaireVersion: 'v', scoringVersion: 'v', language: 'fr' });
  session.showQuestion('ECO_1', 0);
  session.recordAnswer('ECO_1', 'answered', 3);
  await session.flushOnUnload?.();
  assert.equal(envoyes.length, 0);
});

test('la garde de collecte refuse tout état non explicitement accordé', () => {
  assert.equal(canCollectAttemptData(emptyConsentState()), false);
  assert.equal(canCollectAttemptData(refus()), false);
  assert.equal(canCollectAttemptData(accord()), true);
});

// ─── L'état enregistré ──────────────────────────────────────────────────────

test('le retrait enregistre un REFUS daté, il n’efface pas la décision', () => {
  useStore.setState({ collectionConsent: {}, language: 'fr' });
  useStore.getState().recordCollectionConsent({ [PURPOSES.POLITICAL_ANALYTICS]: true }, { language: 'fr' });
  useStore.getState().withdrawCollectionConsent([PURPOSES.POLITICAL_ANALYTICS], { language: 'fr' });

  const d = useStore.getState().collectionConsent[PURPOSES.POLITICAL_ANALYTICS];
  assert.equal(d.granted, false);
  assert.ok(d.decidedAt, 'effacer perdrait la preuve qu’un accord avait été donné puis repris');
  assert.ok(d.textHash);
});

test('une réactivation volontaire produit une décision NEUVE et datée', async () => {
  useStore.setState({ collectionConsent: {}, language: 'fr' });
  useStore.getState().recordCollectionConsent({ [PURPOSES.POLITICAL_ANALYTICS]: false }, { language: 'fr' });
  const refusee = useStore.getState().collectionConsent[PURPOSES.POLITICAL_ANALYTICS];

  await new Promise(r => setTimeout(r, 5));
  useStore.getState().recordCollectionConsent({ [PURPOSES.POLITICAL_ANALYTICS]: true }, { language: 'fr' });
  const accordee = useStore.getState().collectionConsent[PURPOSES.POLITICAL_ANALYTICS];

  assert.equal(accordee.granted, true);
  assert.notEqual(accordee.decidedAt, refusee.decidedAt);
});

test('retirer la collecte ne touche pas la sauvegarde liée au compte', () => {
  useStore.setState({
    collectionConsent: {},
    consent: { politicalData: true, measurement: false, grantedAt: 'x', version: 'y' },
    language: 'fr',
  });
  useStore.getState().recordCollectionConsent({ [PURPOSES.POLITICAL_ANALYTICS]: true }, { language: 'fr' });
  useStore.getState().withdrawCollectionConsent([PURPOSES.POLITICAL_ANALYTICS], { language: 'fr' });
  assert.equal(useStore.getState().consent.politicalData, true,
    'ce sont deux finalités distinctes : retirer l’une ne décide pas de l’autre');
});

// ─── L'interface, réellement rendue ─────────────────────────────────────────
//
// ⚠ On rend le composant PUR, pas le modal branché sur le store : zustand v5 sert l'état
// INITIAL à `useSyncExternalStore` côté serveur. Un rendu du modal afficherait donc toujours
// « aucune décision », quel que soit le consentement réel — un test qui passe sans rien voir.

const decision = granted => ({
  granted, decidedAt: '2026-08-12T10:00:00.000Z',
  policyVersion: '2026-08-b', textHash: 'fnv1a32:abcd', textHashAvailable: true,
});

const rendreControle = props => renderToStaticMarkup(
  h(CollectionConsentControl, { language: 'fr', onGrant: () => {}, onWithdraw: () => {}, ...props }),
);

test('« Mes données » montre l’état de la collecte, sa date et sa version', () => {
  const html = rendreControle({ decision: decision(true) });
  assert.ok(html.includes('collection-consent-status'));
  const texte = html.replace(/<[^>]+>/g, ' ');
  assert.ok(texte.includes('Collecte autorisée'));
  assert.ok(/décision du 2026-08-12/.test(texte));
  assert.ok(/texte 2026-08-b/.test(texte));
});

test('la commande proposée correspond à l’état : retrait si accordée', () => {
  const html = rendreControle({ decision: decision(true) });
  assert.ok(html.includes('withdraw-collection'));
  assert.ok(!html.includes('grant-collection'));
});

test('la commande proposée correspond à l’état : autorisation si refusée', () => {
  const html = rendreControle({ decision: decision(false) });
  assert.ok(html.includes('grant-collection'));
  assert.ok(!html.includes('withdraw-collection'));
  assert.ok(html.replace(/<[^>]+>/g, ' ').includes('Collecte refusée'));
});

test('la commande existe SANS aucune décision, donc sans compte', () => {
  const html = rendreControle({ decision: null });
  assert.ok(html.includes('grant-collection'),
    'les visiteurs sans compte étaient les seuls à n’avoir aucune commande');
  assert.ok(html.replace(/<[^>]+>/g, ' ').includes('Aucune décision enregistrée'));
});

test('la collecte est présentée comme distincte de la sauvegarde du compte', () => {
  const texte = rendreControle({ decision: null }).replace(/<[^>]+>/g, ' ');
  assert.ok(/ind[ée]pendant/i.test(texte));
  assert.ok(/aucun compte/i.test(texte));
});

test('le modal branche réellement la commande sur les actions du store', async () => {
  const { readFile } = await import('node:fs/promises');
  const src = await readFile(new URL('../../src/components/DataControlsModal.jsx', import.meta.url), 'utf8');
  assert.ok(src.includes('CollectionConsentControl'));
  assert.match(src, /withdrawCollectionConsent\(\[PURPOSES\.POLITICAL_ANALYTICS\]/);
  assert.match(src, /recordCollectionConsent\(\{ \[PURPOSES\.POLITICAL_ANALYTICS\]: true \}/);
});

// ─── P0-1 : cinq états, cinq phrases, aucune déduction ──────────────────────
//
// ⚠ CE QUE CES TESTS ATTRAPENT. `CollectionConsentControl` affichait « Suppression confirmée
// par le serveur » dès que l'état n'était pas `pending` — c'est-à-dire aussi bien pour un
// refus initial que pour une tombstone jamais écrite. La confirmation était produite par
// ÉLIMINATION. Elle doit désormais exiger un reçu portant l'identifiant de la demande.

const sansTags = html => html.replace(/<[^>]+>/g, ' ');

test('refus initial : aucune mention de suppression, confirmée ou non', () => {
  const texte = sansTags(rendreControle({
    decision: decision(false),
    withdrawal: { state: 'none', purpose: PURPOSES.POLITICAL_ANALYTICS, requestId: null, confirmedAt: null },
  }));
  assert.ok(texte.includes('Collecte refusée. Aucune nouvelle donnée ne sera envoyée.'),
    'un refus initial doit dire ce qu’il est : un refus, pas une suppression');
  assert.ok(!/[Ss]uppression confirmée/.test(texte),
    'rien n’avait été collecté : annoncer une suppression confirmée est un mensonge');
  assert.ok(!/suppression serveur/i.test(texte));
});

test('sans information sur le retrait, le composant ne confirme RIEN', () => {
  // Cas de la lecture trop précoce : la propriété n'est pas encore arrivée.
  const texte = sansTags(rendreControle({ decision: decision(false) }));
  assert.ok(!/confirmée/.test(texte),
    'l’absence d’information n’est pas une preuve de suppression');
});

for (const etat of ['requested', 'pending']) {
  test(`retrait ${etat} : l’attente est annoncée, jamais la confirmation`, () => {
    const html = rendreControle({
      decision: decision(false),
      withdrawal: { state: etat, purpose: PURPOSES.POLITICAL_ANALYTICS, requestId: 'req-1', confirmedAt: null },
      onRetry: () => {},
    });
    const texte = sansTags(html);
    assert.ok(/pas encore confirmée/.test(texte));
    assert.ok(!/confirmée par le serveur/.test(texte));
    assert.ok(html.includes('retry-withdrawal'), 'la personne doit pouvoir relancer elle-même');
  });
}

test('retrait confirmé : la preuve est affichée — demande, finalité, date', () => {
  const texte = sansTags(rendreControle({
    decision: decision(false),
    withdrawal: {
      state: 'confirmed', purpose: PURPOSES.POLITICAL_ANALYTICS,
      requestId: 'ab12cd34-0000-4000-8000-000000000000',
      confirmedAt: '2026-08-14T09:30:00.000Z',
    },
  }));
  assert.ok(/Suppression confirmée par le serveur le 2026-08-14/.test(texte));
  assert.ok(texte.includes('ab12cd34'), 'la confirmation doit être rattachée à UNE demande');
  assert.ok(texte.includes('political_analytics'), 'et à UNE finalité');
});

test('stockage indisponible : on ne promet AUCUN rejeu automatique', () => {
  const texte = sansTags(rendreControle({
    decision: decision(false),
    withdrawal: { state: 'unpersisted', purpose: PURPOSES.POLITICAL_ANALYTICS, requestId: 'req-2', confirmedAt: null },
  }));
  assert.ok(/n’a pas pu y être enregistrée/.test(texte));
  assert.ok(!/réessayée automatiquement/.test(texte),
    'sans stockage, la demande ne survit pas à la fermeture de l’onglet');
  assert.ok(!/confirmée/.test(texte));
});

test('aucun setTimeout ne sert à deviner la fin d’un retrait', async () => {
  const { readFile } = await import('node:fs/promises');
  for (const fichier of ['DataControlsModal.jsx', 'CollectionConsentControl.jsx']) {
    const src = await readFile(new URL(`../../src/components/${fichier}`, import.meta.url), 'utf8');
    assert.ok(!/setTimeout/.test(src),
      `${fichier} utilise setTimeout : deviner la fin d’une opération asynchrone par un délai `
      + 'affichait « suppression confirmée » quand la course était perdue');
  }
});

test('le modal ATTEND le résultat du store avant de relire l’état', async () => {
  const { readFile } = await import('node:fs/promises');
  const src = await readFile(new URL('../../src/components/DataControlsModal.jsx', import.meta.url), 'utf8');
  assert.match(src, /await withdrawCollectionConsent\(/,
    'sans attendre, la lecture de la file précède l’écriture de la tombstone');
});

// ─── P0-1 : le store rend un résultat explicite, pas rien ───────────────────

test('withdrawCollectionConsent rend une promesse et un résultat exploitable', async () => {
  useStore.setState({ collectionConsent: {}, language: 'fr' });
  const issue = await useStore.getState().withdrawCollectionConsent(
    [PURPOSES.POLITICAL_ANALYTICS], { language: 'fr' },
  );
  assert.ok(issue && typeof issue === 'object',
    'l’interface ne peut pas attendre un résultat qui n’existe pas');
  assert.ok(Array.isArray(issue.withdrawals));
});
