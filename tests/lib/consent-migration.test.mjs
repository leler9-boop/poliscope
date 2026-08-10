// POLISCOP — Ne jamais fabriquer un consentement (contre-audit P0-3 et P0-5).
//
// CE QUE CES TESTS AURAIENT ATTRAPÉ
// ---------------------------------
// 1. `normalizeConsent({ politicalData: true })` activait `political_analytics` ET
//    `cloud_save`. Or le texte de 2026-07 parlait d'une sauvegarde liée à un COMPTE et de
//    tendances agrégées ; il ne mentionnait ni la mesure du temps passé sur chaque question,
//    ni un identifiant pseudonyme d'analyse, ni la conservation de « sans opinion » et des
//    questions ignorées. Reporter l'accord sur `political_analytics` revenait à déclarer
//    qu'une personne a accepté un texte qu'elle n'a jamais lu.
//
// 2. `buildConsentRecords()` estampillait TOUTE décision avec `CONSENT_POLICY_VERSION`
//    (2026-08) et l'empreinte du texte 2026-08 — y compris une décision prise en 2026-07.
//    La preuve de consentement devenait fausse : version, hash et texte ne correspondaient
//    plus à ce qui avait été montré.
//
// 3. `begin()` créait un identifiant aléatoire et le persistait AVANT toute décision, dans
//    la clé `poliscop_attempt`. Le test existant ne regardait que `poliscop_analytics_sid`
//    et n'appelait jamais `begin()` : l'identifiant passait donc au travers.
//
// 4. À l'acceptation, `setConsent()` rejouait tout ce qui avait été mesuré AVANT l'accord.
//    Le consentement n'autorise que les événements produits après son acceptation.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  PURPOSES, CONSENT_POLICY_VERSION, LEGACY_POLICY_VERSION,
  emptyConsentState, normalizeConsent, isGranted,
  buildConsentRecords, consentTextFor, textFingerprint,
  decisionOf, canTransmitPoliticalData, canCollectAttemptData,
} from '../../src/lib/consent.js';
import { createAttemptSession } from '../../src/lib/attemptSession.js';

function memoryStorage() {
  const map = new Map();
  return {
    getItem: k => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => map.set(k, String(v)),
    removeItem: k => map.delete(k),
    _dump: () => [...map.entries()],
  };
}

const UUID_RE = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;

// ─── P0-3 — migration des anciens consentements ─────────────────────────────

test('un ancien accord n’est JAMAIS transformé en accord à l’analyse politique', () => {
  // La combinaison la plus dangereuse : l'ancien « oui » global.
  const migrated = normalizeConsent({ politicalData: true, measurement: true, version: '2026-07' });
  assert.equal(
    isGranted(migrated, PURPOSES.POLITICAL_ANALYTICS), false,
    'un consentement de 2026-07 a été converti en accord à l’analyse politique de 2026-08',
  );
  assert.equal(
    decisionOf(migrated, PURPOSES.POLITICAL_ANALYTICS).granted, null,
    '« non décidé » est le seul état honnête : le texte n’a jamais été présenté',
  );
});

test('toutes les combinaisons héritées sont couvertes et aucune n’invente de décision', () => {
  const CAS = [
    // [entrée héritée,                              cloud_save, measurement, political_analytics]
    [{ politicalData: true,  measurement: true  },   true,  true,  null],
    [{ politicalData: true,  measurement: false },   true,  false, null],
    [{ politicalData: true,  measurement: null  },   true,  null,  null],
    [{ politicalData: false, measurement: true  },   false, true,  null],
    [{ politicalData: false, measurement: false },   false, false, null],
    [{ politicalData: null,  measurement: true  },   null,  true,  null],
    [{ politicalData: null,  measurement: null  },   null,  null,  null],
    [{ politicalData: undefined, measurement: undefined }, null, null, null],
    [{},                                             null,  null,  null],
    [null,                                           null,  null,  null],
    [undefined,                                      null,  null,  null],
  ];
  for (const [legacy, cloud, measurement, analytics] of CAS) {
    const m = normalizeConsent(legacy);
    const label = JSON.stringify(legacy);
    assert.equal(decisionOf(m, PURPOSES.CLOUD_SAVE).granted,          cloud,       `cloud_save — ${label}`);
    assert.equal(decisionOf(m, PURPOSES.MEASUREMENT).granted,         measurement, `measurement — ${label}`);
    assert.equal(decisionOf(m, PURPOSES.POLITICAL_ANALYTICS).granted, analytics,   `political_analytics — ${label}`);
    // `research` n'a jamais été présentée sous aucun ancien texte.
    assert.equal(decisionOf(m, PURPOSES.RESEARCH).granted, null, `research — ${label}`);
  }
});

test('une décision migrée conserve SA version de texte, pas la version courante', () => {
  const migrated = normalizeConsent({ politicalData: true, measurement: true });
  for (const purpose of [PURPOSES.CLOUD_SAVE, PURPOSES.MEASUREMENT]) {
    const d = decisionOf(migrated, purpose);
    assert.equal(d.policyVersion, LEGACY_POLICY_VERSION, `${purpose} : version réécrite`);
    assert.notEqual(d.policyVersion, CONSENT_POLICY_VERSION, `${purpose} : estampillée 2026-08`);
  }
});

test('aucune décision migrée ne porte l’empreinte d’un texte de 2026-08', () => {
  const migrated = normalizeConsent({ politicalData: true, measurement: true });
  const hashes2026_08 = new Set(
    Object.values(PURPOSES).map(p => textFingerprint(consentTextFor(p, 'fr'))),
  );
  const records = buildConsentRecords(migrated, { anonymousSessionId: 'sid' });
  for (const r of records) {
    assert.ok(
      !hashes2026_08.has(r.text_hash),
      `${r.purpose} : la décision porte l’empreinte d’un texte 2026-08 jamais présenté`,
    );
    assert.equal(r.policy_version, LEGACY_POLICY_VERSION, `${r.purpose} : version incorrecte`);
  }
});

test('une décision migrée est marquée comme non vérifiable par empreinte', () => {
  // L'interface de 2026-07 ne calculait aucune empreinte. Il n'y en a donc pas à produire —
  // et en fabriquer une aujourd'hui recréerait exactement la fausse preuve qu'on corrige.
  const migrated = normalizeConsent({ politicalData: true });
  const d = decisionOf(migrated, PURPOSES.CLOUD_SAVE);
  assert.equal(d.textHash, null, 'une empreinte a été fabriquée après coup');
  const [record] = buildConsentRecords(migrated, { anonymousSessionId: 'sid' });
  assert.equal(record.text_hash, null);
  assert.equal(record.text_hash_available, false,
    'la décision doit dire explicitement que son empreinte est indisponible');
});

test('une décision prise sous le texte courant porte bien sa version et son empreinte', () => {
  const fresh = { ...emptyConsentState() };
  fresh[PURPOSES.POLITICAL_ANALYTICS] = true;
  const [record] = buildConsentRecords(fresh, { anonymousSessionId: 'sid', language: 'fr' });
  assert.equal(record.purpose, PURPOSES.POLITICAL_ANALYTICS);
  assert.equal(record.policy_version, CONSENT_POLICY_VERSION);
  assert.equal(record.text_hash, textFingerprint(consentTextFor(PURPOSES.POLITICAL_ANALYTICS, 'fr')));
  assert.equal(record.text_hash_available, true);
});

test('un consentement migré n’autorise pas la collecte de passation', () => {
  const migrated = normalizeConsent({ politicalData: true, measurement: true });
  assert.equal(canCollectAttemptData(migrated), false,
    'le temps par question serait collecté sous un accord qui ne le mentionnait pas');
  // La sauvegarde compte, elle, est bien couverte par l'ancien texte.
  assert.equal(canTransmitPoliticalData(migrated), true);
});

// ─── P0-5 — aucun identifiant persistant avant la décision ──────────────────

test('begin() ne dépose AUCUN identifiant persistant avant consentement', async () => {
  const storage = memoryStorage();
  const session = createAttemptSession({ storage, transport: async () => {} });

  session.begin({ mode: 'discovery', questionnaireVersion: 'q', scoringVersion: 'v1', language: 'fr' });
  session.showQuestion('ECO_1', 0);
  session.recordAnswer('ECO_1', 'answered', 4);

  const dump = storage._dump();
  const offenders = dump.filter(([, v]) => UUID_RE.test(String(v)));
  assert.deepEqual(
    offenders.map(([k]) => k), [],
    'un identifiant aléatoire a été écrit sur le terminal avant toute décision',
  );
});

test('le questionnaire fonctionne intégralement sans décision', () => {
  const storage = memoryStorage();
  const session = createAttemptSession({ storage, transport: async () => {} });
  const id = session.begin({ mode: 'discovery', questionnaireVersion: 'q', scoringVersion: 'v1' });
  assert.ok(id, 'aucune passation ouverte : le produit ne fonctionne plus sans consentement');
  session.showQuestion('ECO_1', 0);
  session.recordAnswer('ECO_1', 'answered', 4);
  assert.equal(session.timer.snapshot('ECO_1')?.response_state, 'answered',
    'la mesure locale doit continuer — seule la transmission est suspendue');
});

test('l’identifiant persistant n’apparaît qu’APRÈS l’accord explicite', async () => {
  const storage = memoryStorage();
  const session = createAttemptSession({ storage, transport: async () => {} });
  session.begin({ mode: 'discovery', questionnaireVersion: 'q', scoringVersion: 'v1' });

  assert.equal(storage.getItem('poliscop_analytics_sid'), null);
  await session.setConsent({ ...emptyConsentState(), [PURPOSES.POLITICAL_ANALYTICS]: true });
  assert.match(String(storage.getItem('poliscop_analytics_sid')), UUID_RE,
    'aucun identifiant après un accord explicite');
});

// ─── P0-5 — aucun envoi rétroactif ──────────────────────────────────────────

test('les réponses données AVANT l’accord ne sont jamais transmises', async () => {
  const sent = [];
  const storage = memoryStorage();
  const session = createAttemptSession({
    storage, transport: async (batch) => { sent.push(batch); },
  });
  session.begin({ mode: 'discovery', questionnaireVersion: 'q', scoringVersion: 'v1' });

  session.showQuestion('ECO_1', 0);
  session.recordAnswer('ECO_1', 'answered', 4);      // AVANT
  session.showQuestion('SOC_3', 1);
  session.recordAnswer('SOC_3', 'no_opinion', null); // AVANT

  await session.setConsent({ ...emptyConsentState(), [PURPOSES.POLITICAL_ANALYTICS]: true });
  await session.queue.flush();

  const transmis = sent.flatMap(b => b.items.map(i => i.question_id));
  assert.ok(!transmis.includes('ECO_1'), 'une réponse antérieure à l’accord a été transmise');
  assert.ok(!transmis.includes('SOC_3'), 'une réponse antérieure à l’accord a été transmise');
});

test('seules les réponses postérieures à l’accord partent', async () => {
  const sent = [];
  const storage = memoryStorage();
  const session = createAttemptSession({
    storage, transport: async (batch) => { sent.push(batch); },
  });
  session.begin({ mode: 'discovery', questionnaireVersion: 'q', scoringVersion: 'v1' });
  session.showQuestion('ECO_1', 0);
  session.recordAnswer('ECO_1', 'answered', 4);      // AVANT

  await session.setConsent({ ...emptyConsentState(), [PURPOSES.POLITICAL_ANALYTICS]: true });

  session.showQuestion('IMM_1', 1);
  session.recordAnswer('IMM_1', 'answered', 2);      // APRÈS
  await session.queue.flush();

  const transmis = sent.flatMap(b => b.items.map(i => i.question_id));
  assert.deepEqual(transmis, ['IMM_1'],
    'la transmission doit porter exactement sur les réponses postérieures à l’accord');
});

test('changer une réponse APRÈS l’accord la rend transmissible', async () => {
  // Décision produit : on n'envoie pas rétroactivement, mais une question RÉPONDUE à nouveau
  // après l'accord produit un événement postérieur à l'accord, donc transmissible.
  const sent = [];
  const session = createAttemptSession({
    storage: memoryStorage(), transport: async (batch) => { sent.push(batch); },
  });
  session.begin({ mode: 'discovery', questionnaireVersion: 'q', scoringVersion: 'v1' });
  session.showQuestion('ECO_1', 0);
  session.recordAnswer('ECO_1', 'answered', 4);

  await session.setConsent({ ...emptyConsentState(), [PURPOSES.POLITICAL_ANALYTICS]: true });

  session.showQuestion('ECO_1', 0);
  session.recordAnswer('ECO_1', 'answered', 2);   // l'utilisateur change d'avis, après l'accord
  await session.queue.flush();

  const item = sent.flatMap(b => b.items).find(i => i.question_id === 'ECO_1');
  assert.ok(item, 'une réponse modifiée après l’accord doit partir');
  assert.equal(item.answer_value, 2);
});

test('un refus explicite ne déclenche aucune requête', async () => {
  const sent = [];
  const session = createAttemptSession({
    storage: memoryStorage(), transport: async (batch) => { sent.push(batch); },
  });
  session.begin({ mode: 'discovery', questionnaireVersion: 'q', scoringVersion: 'v1' });
  await session.setConsent({ ...emptyConsentState(), [PURPOSES.POLITICAL_ANALYTICS]: false });

  session.showQuestion('ECO_1', 0);
  session.recordAnswer('ECO_1', 'answered', 4);
  await session.queue.flush();

  assert.deepEqual(sent, [], 'un refus a laissé passer une transmission');
});
