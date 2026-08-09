// POLISCOP — Tests d'intégration du store (session complète).
//
// Le store dépend de `localStorage`, de `crypto` et du routeur. On les remplace ici par des
// doubles minimaux, ce qui permet d'exercer les VRAIES actions du store sous `node --test`
// sans navigateur — donc de couvrir ce que les tests unitaires ne voyaient pas :
// persistance, reprise après rechargement, import, consentements, sauvegarde cloud.
//
// Ces tests ont été ajoutés après le contre-audit du 2026-08-09, qui relevait que les
// 82 tests existants ne protégeaient aucun parcours.

import { test, before, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

// ─── Doubles d'environnement navigateur ─────────────────────────────────────

class MemoryStorage {
  constructor() { this.map = new Map(); }
  getItem(k) { return this.map.has(k) ? this.map.get(k) : null; }
  setItem(k, v) { this.map.set(k, String(v)); }
  removeItem(k) { this.map.delete(k); }
  clear() { this.map.clear(); }
}

globalThis.localStorage = new MemoryStorage();
globalThis.sessionStorage = new MemoryStorage();
if (!globalThis.crypto?.randomUUID) {
  let n = 0;
  globalThis.crypto = { ...(globalThis.crypto ?? {}), randomUUID: () => `00000000-0000-4000-8000-${String(++n).padStart(12, '0')}` };
}
globalThis.window = globalThis.window ?? { location: { href: 'http://localhost/' } };

let useStore, NO_OPINION, questions, THEMES_ORDER, EXPORT_FORMAT_VERSION, QUESTIONNAIRE_VERSION;
let QUEUE_ALGORITHM_VERSION, getQuestionQueue, toCloudAnswerRows, cloudAnsweredCount;

before(async () => {
  ({ useStore } = await import('../../src/store/useStore.js'));
  ({ NO_OPINION } = await import('../../src/engine/scorer.js'));
  ({ questions, THEMES_ORDER } = await import('../../src/data/questions.js'));
  ({ EXPORT_FORMAT_VERSION, QUESTIONNAIRE_VERSION, QUEUE_ALGORITHM_VERSION } = await import('../../src/engine/versions.js'));
  ({ toCloudAnswerRows, cloudAnsweredCount } = await import('../../src/lib/cloudAnswers.js'));
  ({ getQuestionQueue } = await import('../../src/data/questions.js'));
});

const S = () => useStore.getState();

beforeEach(() => {
  S().reset?.();
  useStore.setState({
    answers: {}, profile: null, questionsQueue: [], queueQuestionIds: [], queueMeta: null,
    currentQuestionIndex: 0, themeWeights: null, queueSeed: null, testMode: null,
    consent: { politicalData: null, measurement: null, grantedAt: null, version: null },
    userId: null,
  });
});

// ─── 1. Questionnaire : neutre + sans opinion ───────────────────────────────

test('parcours : réponse neutre et « sans opinion » sont enregistrés différemment', () => {
  S().startTest('discovery');
  const queue = S().questionsQueue;
  assert.equal(queue.length, 16);

  S().answerQuestion(queue[0].id, 3);            // neutre = position centrale
  S().answerQuestion(queue[1].id, NO_OPINION);   // sans opinion = pas une position

  assert.equal(S().answers[queue[0].id], 3);
  assert.equal(S().answers[queue[1].id], NO_OPINION);
  assert.equal(S().profile.answeredCount, 1, '« sans opinion » ne compte pas comme réponse');
});

// ─── 2. Reprise après rechargement ──────────────────────────────────────────

test('reprise : après « rechargement », la même file et la même question réapparaissent', () => {
  S().startTest('standard');
  const originalIds = S().questionsQueue.map(q => q.id);
  const seed = S().queueSeed;
  S().answerQuestion(originalIds[0], 4);
  S().nextQuestion();
  S().nextQuestion();
  const indexAvant = S().currentQuestionIndex;

  // Simule un rechargement : la file d'objets est perdue, les champs persistés survivent.
  useStore.setState({ questionsQueue: [] });

  const res = S().resumeQuestionnaire();
  assert.equal(res.resumed, true, `reprise refusée : ${res.reason}`);
  assert.deepEqual(S().questionsQueue.map(q => q.id), originalIds, 'file différente après reprise');
  assert.equal(S().currentQuestionIndex, indexAvant, 'position perdue');
  assert.equal(S().queueSeed, seed);
  assert.equal(S().answers[originalIds[0]], 4, 'réponses perdues');
});

test('reprise : refusée si le questionnaire a changé de version', () => {
  S().startTest('discovery');
  useStore.setState({
    questionsQueue: [],
    queueMeta: { ...S().queueMeta, questionnaireVersion: 'une-autre-version' },
  });
  const res = S().resumeQuestionnaire();
  assert.equal(res.resumed, false);
  assert.equal(res.reason, 'questionnaire_version_changed');
});

test('reprise : refusée si une question de la file n’existe plus', () => {
  S().startTest('discovery');
  useStore.setState({
    questionsQueue: [],
    queueQuestionIds: [...S().queueQuestionIds.slice(0, 3), 'QUESTION_SUPPRIMEE'],
  });
  const res = S().resumeQuestionnaire();
  assert.equal(res.resumed, false);
  assert.equal(res.reason, 'questions_missing');
});

test('reprise : un index persisté aberrant ne produit pas d’écran vide', () => {
  S().startTest('discovery');
  const ids = S().queueQuestionIds;
  useStore.setState({ questionsQueue: [], currentQuestionIndex: 9999 });
  assert.equal(S().resumeQuestionnaire().resumed, true);
  assert.equal(S().currentQuestionIndex, ids.length - 1, 'index non borné');
});

// ─── 3. Import ──────────────────────────────────────────────────────────────

/**
 * Export de test REPRODUCTIBLE : la file provient réellement de (mode, priorityOrder, graine).
 * Un export dont la file ne se régénère pas à l'identique n'est plus accepté — c'est le
 * durcissement demandé par le 2e contre-audit.
 */
const SEED = 'graine-de-test';
// Calculé paresseusement : les modules ne sont importés que dans le hook `before`.
const order = () => [...THEMES_ORDER].reverse();

function realQueue(mode = 'standard') {
  return getQuestionQueue(mode, order(), SEED).map(q => q.id);
}

function exportPayload(overrides = {}) {
  const q = questions.slice(0, 12);
  return JSON.stringify({
    version: EXPORT_FORMAT_VERSION,
    questionnaireVersion: QUESTIONNAIRE_VERSION,
    answers: Object.fromEntries(q.map((x, i) => [x.id, (i % 5) + 1])),
    priorityOrder: order(),
    versions: { questionnaire: QUESTIONNAIRE_VERSION, queueAlgorithm: QUEUE_ALGORITHM_VERSION, scoring: 'v1' },
    ...overrides,
  });
}

test('import : un fichier sans version de format est refusé', () => {
  const payload = JSON.stringify({ answers: { [questions[0].id]: 3 } });
  assert.deepEqual(S().importProfile(payload), { error: 'missing_format_version' });
});

test('import : une version de format inconnue est refusée', () => {
  assert.deepEqual(S().importProfile(exportPayload({ version: '99.0' })), { error: 'unsupported_format_version' });
});

test('import : un profil fourni dans le fichier ne peut pas imposer les scores', () => {
  const forged = { ECONOMY: 100, SOCIAL: 100, IMMIGRATION: 0, SECURITY: 0,
                   ENVIRONMENT: 100, DEMOCRACY: 100, GLOBAL: 100, PUBLIC_SERVICES: 100 };
  assert.equal(S().importProfile(exportPayload({ profile: { themes: forged } })), true);
  assert.notDeepEqual(S().profile.themes, forged);
});

test('import : les themeWeights locaux antérieurs ne survivent PAS à un import', () => {
  // Le défaut relevé par le contre-audit : des poids saisis dans ce navigateur continuaient
  // de pondérer un profil importé d'ailleurs, sans que rien ne le signale.
  const local = Object.fromEntries(THEMES_ORDER.map((t, i) => [t, i === 0 ? 100 : 0]));
  useStore.setState({ themeWeights: local });

  assert.equal(S().importProfile(exportPayload()), true);
  assert.equal(S().themeWeights, null, 'les poids locaux ont survécu à l’import');
});

test('import : des themeWeights valides sont repris tels quels', () => {
  const weights = Object.fromEntries(THEMES_ORDER.map(t => [t, 12.5]));
  assert.equal(S().importProfile(exportPayload({ themeWeights: weights })), true);
  assert.deepEqual(S().themeWeights, weights);
});

test('import : des themeWeights de somme invalide sont écartés, pas « corrigés »', () => {
  const weights = Object.fromEntries(THEMES_ORDER.map(t => [t, 5])); // somme = 40
  assert.equal(S().importProfile(exportPayload({ themeWeights: weights })), true);
  assert.equal(S().themeWeights, null);
  assert.ok(S().importedFrom.warnings.some(w => w.includes('themeWeights')));
});

test('import : une graine aberrante est écartée sans faire échouer l’import', () => {
  assert.equal(S().importProfile(exportPayload({ queueSeed: 'x'.repeat(500) })), true);
  assert.equal(S().queueSeed, null);
});

test('import : la file est restaurée quand elle est RÉGÉNÉRABLE depuis la graine', () => {
  const ids = realQueue('standard');
  assert.equal(S().importProfile(exportPayload({ questionIds: ids, testMode: 'standard', queueSeed: SEED })), true);
  assert.deepEqual(S().questionsQueue.map(q => q.id), ids);
  assert.equal(S().importedFrom.queueRestored, true);
});

// ─── Tests NÉGATIFS de reproductibilité ─────────────────────────────────────
// Chacun décrit un export qui passait avant : la file était acceptée dès lors que ses
// identifiants existaient, sans qu'elle corresponde à la passation d'origine.

function assertQueueRejected(overrides, motif) {
  const res = S().importProfile(exportPayload(overrides));
  assert.equal(res, true, 'les réponses doivent rester importées');
  assert.equal(S().questionsQueue.length, 0, `file acceptée à tort (${motif})`);
  assert.equal(S().importedFrom.queueRestored, false);
  assert.ok(
    S().importedFrom.warnings.some(w => w.startsWith('file de questions ignorée')),
    `aucun avertissement pour : ${motif}`,
  );
}

test('import : 12 questions annoncées en mode standard → file refusée', () => {
  assertQueueRejected(
    { questionIds: realQueue('standard').slice(0, 12), testMode: 'standard', queueSeed: SEED },
    'longueur incompatible avec le mode',
  );
});

test('import : file contenant un doublon → refusée', () => {
  const ids = realQueue('standard');
  assertQueueRejected(
    { questionIds: [...ids.slice(0, 31), ids[0]], testMode: 'standard', queueSeed: SEED },
    'doublon',
  );
});

test('import : mauvaise graine → la file ne se régénère pas, refusée', () => {
  assertQueueRejected(
    { questionIds: realQueue('standard'), testMode: 'standard', queueSeed: 'autre-graine' },
    'graine différente',
  );
});

test('import : bonne composition mais ordre modifié → refusée', () => {
  const ids = realQueue('standard');
  const permuted = [...ids];
  [permuted[0], permuted[1]] = [permuted[1], permuted[0]];
  assertQueueRejected(
    { questionIds: permuted, testMode: 'standard', queueSeed: SEED },
    'ordre différent',
  );
});

test('import : bonne longueur mais mauvaise composition → refusée', () => {
  const ids = realQueue('standard');
  const others = questions.map(q => q.id).filter(id => !ids.includes(id));
  assertQueueRejected(
    { questionIds: [...ids.slice(0, 31), others[0]], testMode: 'standard', queueSeed: SEED },
    'composition différente',
  );
});

test('import : file sans graine → refusée (non reproductible)', () => {
  assertQueueRejected(
    { questionIds: realQueue('standard'), testMode: 'standard' },
    'graine absente',
  );
});

test('import : une version de scoring inconnue fait échouer tout l’import', () => {
  const res = S().importProfile(exportPayload({
    versions: { questionnaire: QUESTIONNAIRE_VERSION, scoring: 'v42' },
  }));
  assert.deepEqual(res, { error: 'unknown_scoring_version' });
});

test('import : format hérité 1.0 → réponses seules, file non restaurable', () => {
  const q = questions.slice(0, 10);
  const res = S().importProfile(JSON.stringify({
    version: '1.0',
    answers: Object.fromEntries(q.map((x, i) => [x.id, (i % 5) + 1])),
  }));
  assert.equal(res, true);
  assert.equal(S().questionsQueue.length, 0);
  assert.ok(S().importedFrom.warnings.some(w => w.includes('format 1.0')));
});

// ─── 4. Consentements ───────────────────────────────────────────────────────

test('consentement : les quatre combinaisons produisent l’état attendu', () => {
  const cases = [
    [false, false], [true, false], [false, true], [true, true],
  ];
  for (const [political, measurement] of cases) {
    S().setConsent(political, { measurement });
    assert.equal(S().consent.politicalData, political, `politicalData pour ${political}/${measurement}`);
    assert.equal(S().consent.measurement, measurement, `measurement pour ${political}/${measurement}`);
  }
});

test('consentement : la mesure d’audience est refusée par défaut', () => {
  S().setConsent(true);                       // aucune option passée
  assert.equal(S().consent.measurement, false, 'la mesure ne doit jamais démarrer par défaut');
});

test('consentement : la réhydratation serveur ne perd pas le choix local de mesure', () => {
  // Le défaut relevé : `hydrateConsent()` réécrivait l'objet sans `measurement`, si bien
  // que se connecter effaçait silencieusement la décision prise sur cet appareil.
  S().setConsent(false, { measurement: true });
  S().hydrateConsent({ granted: true, grantedAt: '2026-01-01T00:00:00Z', version: '2026-07' });

  assert.equal(S().consent.politicalData, true, 'le serveur fait foi pour les données politiques');
  assert.equal(S().consent.measurement, true, 'le choix local de mesure a été perdu');
  assert.equal(S().consent.grantedAt, '2026-01-01T00:00:00Z');
});

test('consentement : un retrait sans précision refuse aussi la mesure', () => {
  S().setConsent(true, { measurement: true });
  S().withdrawConsent();
  assert.equal(S().consent.politicalData, false);
  assert.equal(S().consent.measurement, false);
});

test('consentement : « rester local » PEUT conserver la mesure d’audience', () => {
  // Le 3e contre-audit relevait que cocher la mesure puis cliquer « Non merci, je reste en
  // local » écrasait ce choix : la combinaison décrite comme possible ne l'était pas.
  S().setConsent(false, { measurement: false });
  S().withdrawConsent({ measurement: true });
  assert.equal(S().consent.politicalData, false, 'les opinions doivent rester locales');
  assert.equal(S().consent.measurement, true, 'le choix de mesure affiché a été ignoré');
});

// ─── 5. Sauvegarde cloud de réponses mixtes ─────────────────────────────────

test('cloud : aucune chaîne n’est envoyée dans la colonne numérique', () => {
  const q = questions.slice(0, 6);
  const answers = {
    [q[0].id]: 1, [q[1].id]: 5, [q[2].id]: NO_OPINION,
    [q[3].id]: 3, [q[4].id]: NO_OPINION, [q[5].id]: 'valeur_corrompue',
  };
  const { rows, skippedNoOpinion, skippedInvalid } = toCloudAnswerRows('u-1', answers);

  assert.equal(rows.length, 3);
  for (const r of rows) {
    assert.equal(typeof r.answer_value, 'number', `valeur non numérique pour ${r.question_id}`);
    assert.ok(r.answer_value >= 1 && r.answer_value <= 5);
  }
  assert.deepEqual(skippedNoOpinion.sort(), [q[2].id, q[4].id].sort());
  assert.deepEqual(skippedInvalid, [q[5].id]);
});

test('cloud : un questionnaire mixte ne fait pas échouer le lot entier', () => {
  const q = questions.slice(0, 20);
  const answers = Object.fromEntries(q.map((x, i) => [x.id, i % 3 === 0 ? NO_OPINION : (i % 5) + 1]));
  const { rows } = toCloudAnswerRows('u-1', answers);
  assert.ok(rows.length > 0, 'toutes les lignes ont été écartées');
  assert.equal(rows.length + Object.values(answers).filter(v => v === NO_OPINION).length, q.length);
});

test('cloud : answered_count ne compte que les réponses exploitables', () => {
  const q = questions.slice(0, 10);
  const answers = Object.fromEntries(q.map((x, i) => [x.id, i < 4 ? NO_OPINION : 3]));
  assert.equal(cloudAnsweredCount(answers), 6);
  assert.notEqual(cloudAnsweredCount(answers), Object.keys(answers).length);
});

// ─── 6. Flux de mesure d'audience ───────────────────────────────────────────
// Couvert en profondeur par tests/integration/cloud-and-consent.test.mjs : les 27 fonctions
// exportées y sont appelées une par une, et un contrôle statique interdit tout appel à
// `track()` hors du point d'émission unique.
