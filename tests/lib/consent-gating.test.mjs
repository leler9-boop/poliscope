// POLISCOP — Consentement : la garantie centrale.
//
// « Aucune réponse politique ne quitte l'appareil avant l'acceptation explicite. »
// Cette phrase est une promesse produit. Les tests ci-dessous en font une propriété
// vérifiée du code : ils observent le TRANSPORT et échouent si le moindre octet part.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  PURPOSES, ALL_PURPOSES, CONSENT_POLICY_VERSION, RETENTION_MONTHS,
  emptyConsentState, normalizeConsent, isGranted, decisionOf,
  canTransmitPoliticalData, canCollectAttemptData,
  buildConsentRecords, consentTextFor, textFingerprint,
} from '../../src/lib/consent.js';
import { createAttemptSession } from '../../src/lib/attemptSession.js';

function memoryStorage() {
  const map = new Map();
  return {
    getItem: k => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => map.set(k, String(v)),
    removeItem: k => map.delete(k),
  };
}

/** Session instrumentée : on capture tout ce qui serait envoyé. */
function spySession() {
  const sent = [];
  const session = createAttemptSession({
    storage: memoryStorage(),
    transport: async (batch) => { sent.push({ type: 'responses', batch }); },
  });
  return { session, sent };
}

const grantAll = () => ({
  ...emptyConsentState(),
  [PURPOSES.POLITICAL_ANALYTICS]: true,
  [PURPOSES.MEASUREMENT]: true,
});

// ─── État par défaut ─────────────────────────────────────────────────────────

test('l’état vierge n’autorise RIEN — aucune case précochée', () => {
  const state = emptyConsentState();
  for (const purpose of ALL_PURPOSES) {
    assert.equal(state[purpose], null, `« ${purpose} » n’est pas à l’état non décidé`);
    assert.equal(isGranted(state, purpose), false);
  }
  assert.equal(canTransmitPoliticalData(state), false);
  assert.equal(canCollectAttemptData(state), false);
});

test('« non décidé » vaut refus, et se distingue d’un refus explicite', () => {
  assert.equal(isGranted({ [PURPOSES.RESEARCH]: null },      PURPOSES.RESEARCH), false);
  assert.equal(isGranted({ [PURPOSES.RESEARCH]: undefined }, PURPOSES.RESEARCH), false);
  assert.equal(isGranted({ [PURPOSES.RESEARCH]: false },     PURPOSES.RESEARCH), false);
  assert.equal(isGranted({ [PURPOSES.RESEARCH]: true },      PURPOSES.RESEARCH), true);
  // Seul un `true` STRICT ouvre : ni 1, ni 'yes', ni un objet.
  for (const truthy of [1, 'true', 'yes', {}]) {
    assert.equal(isGranted({ [PURPOSES.RESEARCH]: truthy }, PURPOSES.RESEARCH), false);
  }
});

test('les quatre finalités sont distinctes et « research » n’est jamais déduite', () => {
  assert.deepEqual([...ALL_PURPOSES].sort(),
    ['cloud_save', 'measurement', 'political_analytics', 'research']);

  // ⚠ Ce test affirmait auparavant que `politicalData: true` accordait AUSSI
  // `political_analytics`. C'était le défaut P0-3 : le texte de 2026-07 ne décrivait ni le
  // temps par question, ni l'identifiant pseudonyme d'analyse. La règle est maintenant
  // vérifiée sur les onze combinaisons héritées dans tests/lib/consent-migration.test.mjs.
  const migrated = normalizeConsent({ politicalData: true, measurement: true, version: '2026-07' });
  assert.equal(isGranted(migrated, PURPOSES.POLITICAL_ANALYTICS), false,
    'un accord de 2026-07 a été converti en accord à un texte de 2026-08');
  assert.equal(isGranted(migrated, PURPOSES.CLOUD_SAVE), true,
    'la sauvegarde compte était bien décrite par le texte de 2026-07');
  assert.equal(isGranted(migrated, PURPOSES.RESEARCH), false,
    'la recherche a été déduite d’un autre consentement — elle n’a jamais été présentée');
});

test('accepter la mesure d’audience n’autorise PAS la collecte politique', () => {
  const state = { ...emptyConsentState(), [PURPOSES.MEASUREMENT]: true };
  assert.equal(canTransmitPoliticalData(state), false);
  assert.equal(canCollectAttemptData(state), false);
});

test('accepter l’analyse politique n’autorise pas le traceur d’audience', () => {
  const state = { ...emptyConsentState(), [PURPOSES.POLITICAL_ANALYTICS]: true };
  assert.equal(isGranted(state, PURPOSES.MEASUREMENT), false);
});

// ─── Preuve ──────────────────────────────────────────────────────────────────

test('chaque décision est datée, versionnée et porte l’empreinte du texte accepté', () => {
  const records = buildConsentRecords(grantAll(), {
    anonymousSessionId: '11111111-1111-1111-1111-111111111111',
    language: 'fr',
  });

  assert.equal(records.length, 2, 'seules les finalités DÉCIDÉES produisent une ligne');
  for (const record of records) {
    assert.equal(record.policy_version, CONSENT_POLICY_VERSION);
    assert.equal(record.text_hash, textFingerprint(consentTextFor(record.purpose, 'fr')));
    assert.match(record.decided_at, /^\d{4}-\d{2}-\d{2}T/);
    assert.ok(record.retention_until || record.purpose === PURPOSES.CLOUD_SAVE,
      'une durée de conservation doit accompagner une acceptation');
  }
});

test('une finalité NON DÉCIDÉE ne produit aucune ligne — ne pas décider n’est pas refuser', () => {
  const records = buildConsentRecords(emptyConsentState(), {
    anonymousSessionId: '11111111-1111-1111-1111-111111111111',
  });
  assert.deepEqual(records, []);
});

test('un refus explicite est enregistré comme tel', () => {
  const records = buildConsentRecords(
    { ...emptyConsentState(), [PURPOSES.POLITICAL_ANALYTICS]: false },
    { anonymousSessionId: '11111111-1111-1111-1111-111111111111' },
  );
  assert.equal(records.length, 1);
  assert.equal(records[0].granted, false);
  assert.equal(records[0].retention_until, null, 'un refus n’ouvre aucune conservation');
});

test('l’empreinte change si le texte change — sinon la version ne prouve rien', () => {
  assert.notEqual(textFingerprint('Texte A'), textFingerprint('Texte B'));
  assert.equal(textFingerprint('Texte A'), textFingerprint('Texte A'));
});

test('chaque finalité annonce une durée de conservation', () => {
  for (const purpose of ALL_PURPOSES) {
    assert.ok(purpose in RETENTION_MONTHS, `« ${purpose} » n’annonce aucune durée`);
    const text = consentTextFor(purpose, 'fr');
    assert.ok(text.length > 40, `le texte de « ${purpose} » est trop court pour être compréhensible`);
    assert.match(text, /[Cc]onservation/, `« ${purpose} » n’annonce pas sa durée à l’utilisateur`);
  }
});

// ─── Le comportement réel de la collecte ────────────────────────────────────

test('AVANT consentement : répondre n’envoie STRICTEMENT rien', async () => {
  const { session, sent } = spySession();
  session.begin({ mode: 'discovery', questionnaireVersion: 'q', scoringVersion: 'v1', language: 'fr' });

  session.showQuestion('ECO_1', 0);
  session.recordAnswer('ECO_1', 'answered', 4);
  session.showQuestion('SOC_1', 1);
  session.recordAnswer('SOC_1', 'no_opinion', null);

  await session.queue.flush();

  assert.deepEqual(sent, [], 'des réponses politiques sont parties sans consentement');
  assert.equal(session.queue.getStatus().pending, 0,
    'rien ne doit même être mis en file avant consentement');
});

test('la MESURE locale continue sans consentement — seule la transmission est suspendue', () => {
  const { session } = spySession();
  session.begin({ mode: 'discovery', questionnaireVersion: 'q', scoringVersion: 'v1' });

  session.showQuestion('ECO_1', 0);
  session.recordAnswer('ECO_1', 'answered', 4);

  const snapshot = session.timer.snapshot('ECO_1');
  assert.ok(snapshot, 'le chronomètre local doit fonctionner sans consentement');
  assert.equal(snapshot.answer_value, 4);
});

test('APRÈS consentement : la collecte démarre, mais SANS rattraper le passé', async () => {
  // ⚠ Ce test exigeait auparavant l'inverse : que la réponse donnée avant l'accord soit
  // « rattrapée ». C'était le défaut P0-5. Consentir à une collecte future n'autorise pas
  // la divulgation de ce qui a été mesuré avant la décision.
  const { session, sent } = spySession();
  session.begin({ mode: 'discovery', questionnaireVersion: 'q', scoringVersion: 'v1', language: 'fr' });

  session.showQuestion('ECO_1', 0);
  session.recordAnswer('ECO_1', 'answered', 4);      // avant l'accord

  await session.setConsent(grantAll(), { anonymousSessionId: '11111111-1111-1111-1111-111111111111' });

  session.showQuestion('SOC_3', 1);
  session.recordAnswer('SOC_3', 'answered', 2);      // après l'accord
  await session.queue.flush();

  const questions = sent.flatMap(s => s.batch.items.map(i => i.question_id));
  assert.ok(!questions.includes('ECO_1'), 'une réponse antérieure à l’accord a été transmise');
  assert.deepEqual(questions, ['SOC_3'], 'la collecte doit démarrer à l’accord, et seulement là');
});

test('« sans opinion » est transmis comme un ÉTAT, jamais supprimé ni converti', async () => {
  const { session, sent } = spySession();
  session.begin({ mode: 'discovery', questionnaireVersion: 'q', scoringVersion: 'v1' });
  await session.setConsent(grantAll(), { anonymousSessionId: '11111111-1111-1111-1111-111111111111' });

  session.showQuestion('SOC_1', 0);
  session.recordAnswer('SOC_1', 'no_opinion', null);
  await session.queue.flush();

  const item = sent[0].batch.items.find(i => i.question_id === 'SOC_1');
  assert.ok(item, '« sans opinion » n’a pas été transmis du tout');
  assert.equal(item.response_state, 'no_opinion');
  assert.equal(item.answer_value, null);
});

test('« jamais posée » et « sans opinion » restent distincts dans ce qui est envoyé', async () => {
  const { session, sent } = spySession();
  session.begin({ mode: 'discovery', questionnaireVersion: 'q', scoringVersion: 'v1' });
  await session.setConsent(grantAll(), { anonymousSessionId: '11111111-1111-1111-1111-111111111111' });

  session.showQuestion('SOC_1', 0);
  session.recordAnswer('SOC_1', 'no_opinion', null);
  await session.queue.flush();

  const ids = sent[0].batch.items.map(i => i.question_id);
  assert.ok(ids.includes('SOC_1'));
  assert.equal(ids.includes('IMM_1'), false,
    'une question jamais posée ne doit produire aucune ligne');
});

test('RETRAIT : la collecte s’arrête et la file en attente est vidée', async () => {
  const { session, sent } = spySession();
  session.begin({ mode: 'discovery', questionnaireVersion: 'q', scoringVersion: 'v1' });
  await session.setConsent(grantAll(), { anonymousSessionId: '11111111-1111-1111-1111-111111111111' });

  session.showQuestion('ECO_1', 0);
  session.recordAnswer('ECO_1', 'answered', 4);
  assert.equal(session.queue.getStatus().pending, 1);

  // Retrait.
  await session.setConsent({ ...emptyConsentState(), [PURPOSES.POLITICAL_ANALYTICS]: false });

  assert.equal(session.queue.getStatus().pending, 0,
    'des réponses attendaient encore d’être envoyées après le retrait');

  session.showQuestion('SOC_1', 1);
  session.recordAnswer('SOC_1', 'answered', 2);
  await session.queue.flush();

  assert.deepEqual(sent, [], 'la collecte a repris après un retrait de consentement');
});

test('l’identifiant pseudonyme est EFFACÉ au retrait', async () => {
  const storage = memoryStorage();
  const session = createAttemptSession({ storage, transport: async () => {} });

  await session.setConsent(grantAll());
  assert.ok(storage.getItem('poliscop_analytics_sid'),
    'aucun identifiant créé alors que l’analyse est consentie');

  await session.setConsent({ ...emptyConsentState(), [PURPOSES.POLITICAL_ANALYTICS]: false });
  assert.equal(storage.getItem('poliscop_analytics_sid'), null,
    'le traceur est resté déposé sur le terminal après le retrait');
});

test('le mode envoyé est CANONIQUE, jamais un alias historique', async () => {
  // Régression réelle, trouvée en pilotant l'application dans un navigateur : le schéma
  // contraignait `mode` aux alias `quick`/`medium`/`full` alors que le produit produit
  // `discovery`/`standard`/`deep`. Toute passation aurait été rejetée par la base.
  const { session } = spySession();

  session.begin({ mode: 'standard', questionnaireVersion: 'q', scoringVersion: 'v1' });
  assert.equal(session.debugMeta().mode, 'standard');

  // Un `testMode` persisté par une ANCIENNE version du site vaut encore `quick`.
  const legacy = spySession().session;
  legacy.begin({ mode: 'quick', questionnaireVersion: 'q', scoringVersion: 'v1', resume: false });
  assert.equal(legacy.debugMeta().mode, 'discovery',
    'un alias historique a été envoyé tel quel — la base l’aurait rejeté');
});

test('une largeur de viewport inconnue ne produit pas de catégorie inventée', async () => {
  const { detectDeviceCategory } = await import('../../src/lib/attemptSession.js');
  assert.equal(detectDeviceCategory(0), null, 'une largeur nulle a été classée comme un appareil');
  assert.equal(detectDeviceCategory(375), 'mobile');
  assert.equal(detectDeviceCategory(800), 'tablet');
  assert.equal(detectDeviceCategory(1400), 'desktop');
});

test('aucun identifiant pseudonyme n’est déposé tant que rien n’est décidé', async () => {
  const storage = memoryStorage();
  const session = createAttemptSession({ storage, transport: async () => {} });

  await session.setConsent(emptyConsentState());
  assert.equal(storage.getItem('poliscop_analytics_sid'), null,
    'un identifiant a été déposé avant toute décision');
});
