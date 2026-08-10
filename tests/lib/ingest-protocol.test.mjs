// POLISCOP — Protocole d'ingestion : validation.
//
// Ce module est la seule barrière entre un POST anonyme et le schéma `private`. Les tests
// ci-dessous portent sur le fichier RÉELLEMENT utilisé par l'Edge Function : il n'existe
// pas de seconde copie de l'allowlist qui pourrait diverger de celle qui s'exécute.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  validateEnvelope, pickAllowed, byteLength,
  PROTOCOL_VERSION, MAX_PAYLOAD_BYTES, MAX_BATCH_ITEMS,
  EVENT_FIELDS, FORBIDDEN_FIELDS,
} from '../../supabase/functions/_shared/protocol.js';

const UUID_A = '11111111-1111-1111-1111-111111111111';
const UUID_B = '22222222-2222-2222-2222-222222222222';
const NOW    = '2026-08-10T10:00:00Z';

const envelope = (type, payload) => ({ protocol_version: PROTOCOL_VERSION, type, payload });

const validAttempt = () => ({
  attempt_id: UUID_A,
  anonymous_session_id: UUID_B,
  questionnaire_version: '2026.08-128q',
  scoring_version: 'v1',
  mode: 'discovery',
  consent_version: '2026-08',
});

const validItem = (over = {}) => ({
  question_id: 'ECO_1',
  questionnaire_version: '2026.08-128q',
  response_state: 'answered',
  answer_value: 4,
  client_updated_at: NOW,
  mutation_id: UUID_A,
  ...over,
});

// ─── Enveloppe ───────────────────────────────────────────────────────────────

test('une version de protocole différente est REFUSÉE', () => {
  const result = validateEnvelope({ protocol_version: 99, type: 'attempt', payload: validAttempt() });
  assert.equal(result.ok, false);
  assert.match(result.error, /protocole/i);
});

test('un type d’événement non déclaré est refusé', () => {
  for (const type of ['profile', 'demographics', 'sql', '__proto__', null]) {
    const result = validateEnvelope(envelope(type, {}));
    assert.equal(result.ok, false, `le type « ${type} » a été accepté`);
  }
});

test('les quatre types déclarés sont exactement ceux acceptés', () => {
  assert.deepEqual(Object.keys(EVENT_FIELDS).sort(),
    ['attempt', 'consent', 'report', 'responses']);
});

test('les modes acceptés sont les modes CANONIQUES, pas les alias historiques', () => {
  // Régression trouvée en pilotant l'application : le protocole n'acceptait que les alias
  // `quick`/`medium`/`full`, que le produit n'émet plus depuis le passage à 16/32/64.
  for (const mode of ['discovery', 'standard', 'deep']) {
    assert.equal(validateEnvelope(envelope('attempt', { ...validAttempt(), mode })).ok, true,
      `le mode canonique « ${mode} » a été refusé`);
  }
  for (const mode of ['quick', 'medium', 'full', 'express']) {
    assert.equal(validateEnvelope(envelope('attempt', { ...validAttempt(), mode })).ok, false,
      `l’alias « ${mode} » a été accepté : deux valeurs coexisteraient pour un même mode`);
  }
});

// ─── Liste blanche ───────────────────────────────────────────────────────────

test('un champ non déclaré est RETIRÉ, pas transmis', () => {
  const result = validateEnvelope(envelope('attempt', {
    ...validAttempt(),
    secret_field: 'valeur',
    theme_scores: { ECONOMY: 72 },
  }));

  assert.equal(result.ok, true);
  assert.equal('secret_field' in result.value, false);
  assert.equal('theme_scores' in result.value, false,
    'un profil calculé a traversé la validation d’une passation');
});

test('un champ INTERDIT fait échouer tout le payload, il n’est pas nettoyé en silence', () => {
  for (const field of ['user_agent', 'ip', 'referrer', 'postal_code', 'gender']) {
    const result = validateEnvelope(envelope('attempt', { ...validAttempt(), [field]: 'x' }));
    assert.equal(result.ok, false, `le champ interdit « ${field} » a été accepté`);
    assert.match(result.error, /interdit/i);
  }
});

test('un champ interdit IMBRIQUÉ est détecté', () => {
  const result = validateEnvelope(envelope('responses', {
    attempt_id: UUID_A,
    items: [{ ...validItem(), device: { screen: '1920x1080' } }],
  }));
  assert.equal(result.ok, false);
});

test('la liste des champs interdits couvre l’empreinte de terminal', () => {
  for (const field of ['user_agent', 'ip', 'ip_address', 'fingerprint', 'latitude', 'longitude']) {
    assert.ok(FORBIDDEN_FIELDS.includes(field), `« ${field} » absent de la liste interdite`);
  }
});

test('pickAllowed signale ce qu’il a retiré', () => {
  const { value, dropped } = pickAllowed({ a: 1, b: 2, c: 3 }, ['a', 'c']);
  assert.deepEqual(value, { a: 1, c: 3 });
  assert.deepEqual(dropped, ['b']);
});

// ─── Règles métier ───────────────────────────────────────────────────────────

test('« answered » EXIGE une valeur entre 1 et 5', () => {
  for (const value of [null, undefined, 0, 6, 3.5, '4']) {
    const result = validateEnvelope(envelope('responses', {
      attempt_id: UUID_A,
      items: [validItem({ answer_value: value })],
    }));
    assert.equal(result.ok, false, `answer_value=${value} a été accepté`);
  }
});

test('« no_opinion » est accepté SANS valeur, et refusé AVEC', () => {
  const accepted = validateEnvelope(envelope('responses', {
    attempt_id: UUID_A,
    items: [validItem({ response_state: 'no_opinion', answer_value: undefined })],
  }));
  assert.equal(accepted.ok, true, '« sans opinion » doit pouvoir être transmis');
  assert.equal(accepted.value.items[0].response_state, 'no_opinion');

  const refused = validateEnvelope(envelope('responses', {
    attempt_id: UUID_A,
    items: [validItem({ response_state: 'no_opinion', answer_value: 3 })],
  }));
  assert.equal(refused.ok, false,
    '« sans opinion » assorti d’une valeur fabriquerait une position');
});

test('un temps négatif est refusé', () => {
  const result = validateEnvelope(envelope('responses', {
    attempt_id: UUID_A,
    items: [validItem({ active_dwell_ms: -1 })],
  }));
  assert.equal(result.ok, false);
});

test('la catégorie d’appareil est limitée à trois valeurs', () => {
  for (const category of ['mobile', 'tablet', 'desktop']) {
    assert.equal(validateEnvelope(envelope('attempt', { ...validAttempt(), device_category: category })).ok, true);
  }
  for (const category of ['iPhone 15 Pro', 'Mozilla/5.0', 'tv']) {
    assert.equal(validateEnvelope(envelope('attempt', { ...validAttempt(), device_category: category })).ok, false,
      `« ${category} » a été accepté comme catégorie d’appareil`);
  }
});

test('un lot trop grand est refusé', () => {
  const items = Array.from({ length: MAX_BATCH_ITEMS + 1 },
    (_, i) => validItem({ question_id: `ECO_${i + 1}` }));
  const result = validateEnvelope(envelope('responses', { attempt_id: UUID_A, items }));
  assert.equal(result.ok, false);
  assert.match(result.error, /trop grand/i);
});

test('un identifiant de question hors forme attendue est refusé', () => {
  for (const id of ['../etc/passwd', 'DROP TABLE', '', 'eco_1', 'ECO-1']) {
    const result = validateEnvelope(envelope('responses', {
      attempt_id: UUID_A, items: [validItem({ question_id: id })],
    }));
    assert.equal(result.ok, false, `« ${id} » a été accepté comme identifiant de question`);
  }
});

// ─── Consentement ────────────────────────────────────────────────────────────

test('une décision de consentement exige finalité, décision, version et empreinte', () => {
  const base = {
    anonymous_session_id: UUID_B,
    purpose: 'political_analytics',
    granted: true,
    policy_version: '2026-08',
    text_hash: 'fnv1a32:deadbeef',
  };
  assert.equal(validateEnvelope(envelope('consent', base)).ok, true);

  for (const missing of ['purpose', 'granted', 'policy_version', 'text_hash']) {
    const payload = { ...base };
    delete payload[missing];
    assert.equal(validateEnvelope(envelope('consent', payload)).ok, false,
      `une décision sans « ${missing} » a été acceptée — elle ne prouverait rien`);
  }
});

test('une finalité inconnue est refusée', () => {
  const result = validateEnvelope(envelope('consent', {
    anonymous_session_id: UUID_B, purpose: 'tout', granted: true,
    policy_version: '2026-08', text_hash: 'x',
  }));
  assert.equal(result.ok, false);
});

test('les quatre finalités attendues sont acceptées', () => {
  for (const purpose of ['measurement', 'political_analytics', 'cloud_save', 'research']) {
    const result = validateEnvelope(envelope('consent', {
      anonymous_session_id: UUID_B, purpose, granted: true,
      policy_version: '2026-08', text_hash: 'x',
    }));
    assert.equal(result.ok, true, `la finalité « ${purpose} » a été refusée`);
  }
});

// ─── Signalements ────────────────────────────────────────────────────────────

test('un commentaire est nettoyé et borné', () => {
  const long = 'a'.repeat(5000);
  const result = validateEnvelope(envelope('report', {
    question_id: 'ECO_1', questionnaire_version: 'q', category: 'biased',
    comment: `  ${long}   `,
  }));

  assert.equal(result.ok, true);
  assert.equal(result.value.comment.length, 1000);
  assert.equal(/[ -]/.test(result.value.comment), false,
    'des octets de contrôle ont survécu au nettoyage');
});

test('l’écran d’origine appartient à une liste fermée — jamais une URL', () => {
  const result = validateEnvelope(envelope('report', {
    question_id: 'ECO_1', questionnaire_version: 'q', category: 'unclear',
    origin_screen: 'https://poliscop.fr/quiz?token=abc',
  }));
  assert.equal(result.ok, false,
    'une URL arbitraire a été acceptée comme écran d’origine');
});

test('une catégorie de signalement inconnue est refusée', () => {
  const result = validateEnvelope(envelope('report', {
    question_id: 'ECO_1', questionnaire_version: 'q', category: 'nul',
  }));
  assert.equal(result.ok, false);
});

// ─── Taille ──────────────────────────────────────────────────────────────────

test('le plafond de taille est mesuré en OCTETS, pas en caractères', () => {
  // « é » occupe 2 octets en UTF-8 : compter les caractères sous-estimerait la charge.
  assert.equal(byteLength('é'), 2);
  assert.equal(byteLength('ECO_1'), 5);
  assert.ok(MAX_PAYLOAD_BYTES > 0 && MAX_PAYLOAD_BYTES <= 1024 * 1024);
});
