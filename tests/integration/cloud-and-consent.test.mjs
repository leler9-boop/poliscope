// POLISCOP — Chemins cloud et consentement, exercés avec un FAUX client Supabase.
//
// Le 1er contre-audit avait été satisfait par des tests de fonctions pures. Le 2e a montré
// la limite : `stripOpinionPayload()` était testé, mais 19 fonctions sur 27 ne passaient pas
// par lui ; et la suppression des positions retirées n'était testée nulle part.
//
// Ici on appelle les VRAIES fonctions exportées et on inspecte ce qui atterrit dans le faux
// client — la table `events` et la table `user_answers`.

import { test, before, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

// ─── Doubles d'environnement ────────────────────────────────────────────────

class MemoryStorage {
  constructor() { this.map = new Map(); }
  getItem(k) { return this.map.has(k) ? this.map.get(k) : null; }
  setItem(k, v) { this.map.set(k, String(v)); }
  removeItem(k) { this.map.delete(k); }
  clear() { this.map.clear(); }
}
globalThis.localStorage = new MemoryStorage();
globalThis.sessionStorage = new MemoryStorage();
let uuidSeq = 0;
// `globalThis.crypto` est en lecture seule sous Node : on complète l'objet existant.
if (!globalThis.crypto?.randomUUID) {
  Object.defineProperty(globalThis.crypto ?? (globalThis.crypto = {}), 'randomUUID', {
    value: () => `00000000-0000-4000-8000-${String(++uuidSeq).padStart(12, '0')}`,
    configurable: true,
  });
}

/**
 * Faux client Supabase — enregistre chaque opération et sait échouer sur demande.
 * Reproduit la forme chaînée réellement utilisée :
 *   .from(t).upsert(rows, opts)
 *   .from(t).delete().eq(c, v).in(c, vals)
 *   .from(t).insert(row)
 */
function makeFakeClient({ failOn = null } = {}) {
  const calls = [];
  const rows = { user_answers: [], events: [], anonymous_sessions: [] };

  const result = op => (failOn === op ? { error: new Error(`échec simulé : ${op}`) } : { error: null });

  function from(table) {
    const ctx = { table, filters: {} };
    const api = {
      upsert(payload, opts) {
        calls.push({ table, op: 'upsert', payload, opts });
        const res = result('upsert');
        if (!res.error) {
          for (const r of [].concat(payload)) {
            const i = rows[table].findIndex(x => x.user_id === r.user_id && x.question_id === r.question_id);
            if (i >= 0) rows[table][i] = r; else rows[table].push(r);
          }
        }
        return Promise.resolve(res);
      },
      insert(payload) {
        calls.push({ table, op: 'insert', payload });
        const res = result('insert');
        if (!res.error) rows[table] = [...(rows[table] ?? []), ...[].concat(payload)];
        return Promise.resolve(res);
      },
      delete() { ctx.op = 'delete'; return api; },
      eq(col, val) { ctx.filters[col] = val; return api; },
      in(col, vals) {
        ctx.filters[col] = vals;
        calls.push({ table, op: 'delete', filters: { ...ctx.filters } });
        const res = result('delete');
        if (!res.error) {
          rows[table] = rows[table].filter(
            r => !(r.user_id === ctx.filters.user_id && vals.includes(r.question_id)),
          );
        }
        return Promise.resolve(res);
      },
    };
    // `then` permet d'attendre une chaîne terminée par .eq() sans .in()
    api.then = (res, rej) => Promise.resolve({ error: null }).then(res, rej);
    return api;
  }

  return { from, calls, rows, _seed: r => { rows.user_answers = r; } };
}

let cloud, analytics, anon, scorer, questions;

before(async () => {
  cloud     = await import('../../src/lib/cloudAnswers.js');
  analytics = await import('../../src/lib/analytics.js');
  anon      = await import('../../src/lib/anonymous.js');
  scorer    = await import('../../src/engine/scorer.js');
  ({ questions } = await import('../../src/data/questions.js'));
});

const Q = n => questions.slice(0, n).map(q => q.id);

// ═══════════════════════════════════════════════════════════════════════════
// PHASE 3 — réconciliation NO_OPINION
// ═══════════════════════════════════════════════════════════════════════════

test('lot ENTIÈREMENT « sans opinion » : la suppression a bien lieu', async () => {
  // Régression exacte : `saveAnswers()` retournait avant la suppression quand
  // `rows.length === 0` — c'est-à-dire précisément dans ce cas.
  const ids = Q(4);
  const client = makeFakeClient();
  client._seed(ids.map(id => ({ user_id: 'u1', question_id: id, answer_value: 3 })));

  const res = await cloud.syncAnswersToCloud(
    client, 'u1', Object.fromEntries(ids.map(id => [id, scorer.NO_OPINION])),
  );

  assert.equal(res.error, null);
  assert.equal(res.upserted, 0);
  assert.equal(res.deleted, 4, 'aucune suppression alors que tout a été passé');
  assert.equal(client.rows.user_answers.length, 0, 'les anciennes positions sont restées au cloud');
});

test('lot mixte : upsert des 1–5 ET suppression des « sans opinion »', async () => {
  const ids = Q(6);
  const client = makeFakeClient();
  client._seed(ids.map(id => ({ user_id: 'u1', question_id: id, answer_value: 3 })));

  const answers = Object.fromEntries(ids.map((id, i) => [id, i < 3 ? (i + 1) : scorer.NO_OPINION]));
  const res = await cloud.syncAnswersToCloud(client, 'u1', answers);

  assert.equal(res.error, null);
  assert.equal(res.upserted, 3);
  assert.equal(res.deleted, 3);
  assert.deepEqual(client.rows.user_answers.map(r => r.question_id).sort(), ids.slice(0, 3).sort());
  for (const r of client.rows.user_answers) {
    assert.equal(typeof r.answer_value, 'number', 'une chaîne a atteint la colonne numérique');
  }
});

test('échec de la suppression : l’erreur est REMONTÉE, pas masquée par l’upsert réussi', async () => {
  const ids = Q(4);
  const client = makeFakeClient({ failOn: 'delete' });
  const answers = { [ids[0]]: 4, [ids[1]]: 2, [ids[2]]: scorer.NO_OPINION, [ids[3]]: scorer.NO_OPINION };

  const res = await cloud.syncAnswersToCloud(client, 'u1', answers);

  assert.ok(res.error, 'une erreur de suppression a été avalée');
  assert.equal(res.stage, 'delete');
  assert.equal(res.upserted, 2, 'l’upsert réussi doit rester rapporté');
  assert.equal(res.deleted, 0);
});

test('échec de l’upsert : aucune suppression n’est tentée', async () => {
  const ids = Q(3);
  const client = makeFakeClient({ failOn: 'upsert' });
  const res = await cloud.syncAnswersToCloud(
    client, 'u1', { [ids[0]]: 4, [ids[1]]: scorer.NO_OPINION, [ids[2]]: scorer.NO_OPINION },
  );
  assert.ok(res.error);
  assert.equal(res.stage, 'upsert');
  assert.equal(client.calls.filter(c => c.op === 'delete').length, 0);
});

test('hydratation : une valeur cloud obsolète n’écrase pas un « sans opinion » local', async () => {
  // La version précédente ne préservait le NO_OPINION que si le cloud n'avait RIEN.
  // Une position retirée localement ressuscitait donc au rechargement.
  const ids = Q(3);
  const cloudAnswers = { [ids[0]]: 5, [ids[1]]: 2, [ids[2]]: 4 };
  const localAnswers = { [ids[1]]: scorer.NO_OPINION };

  const merged = cloud.mergeCloudIntoLocal(cloudAnswers, localAnswers);

  assert.equal(merged[ids[1]], scorer.NO_OPINION, 'le retrait local a été écrasé par le cloud');
  assert.equal(merged[ids[0]], 5);
  assert.equal(merged[ids[2]], 4);
});

test('conflit résolu en faveur du local : le cloud est aligné, suppressions comprises', async () => {
  const ids = Q(5);
  const client = makeFakeClient();
  client._seed(ids.map(id => ({ user_id: 'u1', question_id: id, answer_value: 3 })));

  // L'utilisateur garde son état local : 2 réponses, 3 questions passées.
  const local = { [ids[0]]: 5, [ids[1]]: 1,
                  [ids[2]]: scorer.NO_OPINION, [ids[3]]: scorer.NO_OPINION, [ids[4]]: scorer.NO_OPINION };
  const res = await cloud.syncAnswersToCloud(client, 'u1', local);

  assert.equal(res.error, null);
  assert.deepEqual(
    client.rows.user_answers.map(r => `${r.question_id}=${r.answer_value}`).sort(),
    [`${ids[0]}=5`, `${ids[1]}=1`].sort(),
    'le cloud ne reflète pas exactement le choix local',
  );
});

// ═══════════════════════════════════════════════════════════════════════════
// PHASE 2 — flux de mesure d'audience
// ═══════════════════════════════════════════════════════════════════════════

/** Toutes les fonctions exportées d'analytics.js, avec un payload volontairement pollué. */
const ANALYTICS_CALLS = [
  ['trackLandingView',            { lang: 'fr', hasProfile: true }],
  ['trackTestStart',              { mode: 'standard', lang: 'fr' }],
  ['trackTestComplete',           { mode: 'deep', answeredCount: 60, totalCount: 64, lang: 'fr' }],
  ['trackImproveStarted',         {}],
  ['trackImproveCompleted',       { answeredCount: 12 }],
  ['trackRetakeStarted',          {}],
  ['trackQuestionAnswered',       { questionId: 'ECO_1', theme: 'ECONOMY', value: 5, questionIndex: 3, mode: 'deep', isImprove: false }],
  ['trackQuestionSkipped',        { questionId: 'IMM_1', theme: 'IMMIGRATION', questionIndex: 4, mode: 'deep' }],
  ['trackProfileViewed',          { answeredCount: 32, archetypeId: 'a1', topCandidateId: 'lepen_2027' }],
  ['trackProfileShared',          { method: 'copy', archetypeId: 'a1', topCandidateId: 'lepen_2027', topCandidateAlignment: 78 }],
  ['trackProfileDownloaded',      { archetypeId: 'a1' }],
  ['trackProfileExported',        {}],
  ['trackShareModalOpened',       { archetypeId: 'a1' }],
  ['trackPriorityCompleted',      { priorityOrder: ['ECONOMY', 'SOCIAL'] }],
  ['trackSignupCompleted',        { method: 'email' }],
  ['trackLoginCompleted',         { method: 'email' }],
  ['trackDemographicsCompleted',  { gender: 'f', ageRange: '25-34', communeType: 'rural', employmentStatus: 'x', educationLevel: 'y', hasPostalCode: true }],
  ['trackDemographicsSkipped',    {}],
  ['trackConceptOpened',          { conceptKey: 'laicite', questionIndex: 2 }],
  ['trackBeginnerOpened',         { section: 'bases' }],
  ['trackExplanationToggled',     { questionId: 'ECO_1', theme: 'ECONOMY', open: true }],
  ['trackAcademyDefinitionOpened',{ conceptId: 'c1', questionId: 'ECO_1', theme: 'ECONOMY', position: 2 }],
  ['trackAcademyConceptClicked',  { conceptId: 'c1', questionId: 'ECO_1', theme: 'ECONOMY', position: 2 }],
  ['trackCandidateViewed',        { candidateId: 'lepen_2027' }],
  ['trackElectionViewed',         { electionId: 'fr_2027' }],
  ['trackFigureViewed',           { figureId: 'degaulle', section: 'historical' }],
  ['trackCompareStarted',         { id1: 'lepen_2027', id2: 'attal' }],
];

test('toutes les fonctions analytics sont couvertes par ce test', () => {
  const exported = Object.keys(analytics).filter(k => k.startsWith('track'));
  const covered = ANALYTICS_CALLS.map(([name]) => name);
  const missing = exported.filter(n => !covered.includes(n));
  assert.deepEqual(missing, [],
    `fonctions analytics non testées : ${missing.join(', ')} — une seule non couverte peut fuiter`);
});

test('aucune fonction analytics ne laisse passer une clé d’opinion', () => {
  // Ce que la denylist précédente ne faisait PAS : elle testait le filtre, pas les
  // 19 fonctions sur 27 qui ne l'appelaient pas. Ici on appelle chaque fonction exportée
  // avec un payload volontairement pollué, et on vérifie le résultat du filtrage réel.
  const forbidden = new Set(analytics.OPINION_PAYLOAD_KEYS);
  const offenders = [];

  for (const [name, payload] of ANALYTICS_CALLS) {
    assert.doesNotThrow(() => analytics[name](payload), `${name} a levé`);
  }

  // a) aucune allowlist ne déclare une clé d'opinion
  for (const [event, allowed] of Object.entries(analytics.EVENT_ALLOWLIST)) {
    for (const key of allowed) {
      if (forbidden.has(key)) offenders.push(`allowlist ${event} → ${key}`);
    }
  }

  // b) le filtrage supprime effectivement chaque clé interdite, événement par événement
  const polluted = Object.fromEntries(analytics.OPINION_PAYLOAD_KEYS.map(k => [k, 'X']));
  for (const event of Object.keys(analytics.EVENT_ALLOWLIST)) {
    const { props } = analytics.filterEventProps(event, polluted);
    for (const key of Object.keys(props)) {
      if (forbidden.has(key)) offenders.push(`${event} a laissé passer ${key}`);
    }
  }

  assert.deepEqual(offenders, [], offenders.join(' | '));
});

test('track() n’est appelé nulle part ailleurs que dans emit()', () => {
  // Contrôle STATIQUE : c'est exactement la faille du modèle précédent — une fonction de
  // filtrage existait, mais la majorité des appels l'ignorait et appelait `track()` en direct.
  const src = readFileSync(new URL('../../src/lib/analytics.js', import.meta.url), 'utf8');
  const callLines = src.split('\n')
    .map((line, i) => ({ line, n: i + 1 }))
    .filter(({ line }) => /(^|[^.\w])track\(/.test(line) && !line.trimStart().startsWith('*')
                          && !line.trimStart().startsWith('//'));

  assert.equal(callLines.length, 1,
    `track() doit être appelé une seule fois, dans emit(). Trouvé aux lignes : ${
      callLines.map(c => c.n).join(', ')}`);

  // …et cette unique ligne doit bien être celle d'emit()
  const emitBody = src.slice(src.indexOf('function emit('), src.indexOf('// ─── Acquisition'));
  assert.ok(emitBody.includes('track('), 'l’unique appel à track() n’est pas dans emit()');
});

// Aucun fichier produit ne doit importer `track` directement.
test('aucun composant ni page n’importe track() depuis anonymous.js', () => {
  const files = [];
  const walk = dir => {
    for (const name of readdirSync(dir)) {
      const p = join(dir, name);
      if (statSync(p).isDirectory()) walk(p);
      else if (/\.jsx?$/.test(name)) files.push(p);
    }
  };
  walk(fileURLToPath(new URL('../../src', import.meta.url)));

  const offenders = files.filter(f => {
    if (/lib[/\\](analytics|anonymous)\.js$/.test(f)) return false;
    return /import\s*\{[^}]*\btrack\b[^}]*\}\s*from\s*['"][^'"]*anonymous\.js['"]/.test(readFileSync(f, 'utf8'));
  });
  assert.deepEqual(offenders, [], `track() importé hors du module bas niveau : ${offenders.join(', ')}`);
});

test('filterEventProps supprime toute clé non déclarée, y compris inoffensive', () => {
  const { props, dropped, forbidden } = analytics.filterEventProps('question_answered', {
    question_index: 3, mode: 'deep', is_improve: false,
    question_id: 'ECO_1', theme: 'ECONOMY', value: 5,
    couleur_preferee: 'bleu',
  });
  assert.deepEqual(props, { question_index: 3, mode: 'deep', is_improve: false });
  assert.deepEqual(forbidden.sort(), ['question_id', 'theme', 'value'].sort());
  assert.deepEqual(dropped, ['couleur_preferee']);
});

test('un événement absent de l’allowlist n’est pas émis', () => {
  const res = analytics.filterEventProps('evenement_invente', { a: 1 });
  assert.equal(res.unknownEvent, true);
  assert.equal(res.props, null);
});

test('consultation de contenu : ni candidat, ni figure, ni élection dans l’allowlist', () => {
  for (const event of ['candidate_viewed', 'election_viewed', 'compare_started', 'historical_figure_viewed']) {
    const allowed = analytics.EVENT_ALLOWLIST[event];
    assert.ok(Array.isArray(allowed), `${event} absent de l'allowlist`);
    for (const key of ['candidate_id', 'election_id', 'figure_id', 'id1', 'id2']) {
      assert.ok(!allowed.includes(key), `${event} autorise « ${key} »`);
    }
  }
});

// ─── Consentement à la mesure ────────────────────────────────────────────────

beforeEach(() => {
  localStorage.clear();
  anon.setMeasurementConsent(false);
});

test('mesure refusée : aucun identifiant n’est déposé', () => {
  assert.equal(anon.getOrCreateAnonymousId(), null);
  assert.equal(localStorage.getItem('poliscop_anon_id'), null);
});

test('mesure acceptée puis retirée : l’identifiant est purgé', () => {
  anon.setMeasurementConsent(true);
  const id = anon.getOrCreateAnonymousId();
  assert.ok(id, 'aucun identifiant créé malgré le consentement');
  assert.equal(localStorage.getItem('poliscop_anon_id'), id);

  anon.setMeasurementConsent(false);
  assert.equal(localStorage.getItem('poliscop_anon_id'), null, 'le traceur a survécu au retrait');
  assert.equal(anon.getOrCreateAnonymousId(), null);
});
