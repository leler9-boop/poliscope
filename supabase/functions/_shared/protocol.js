// POLISCOP — Protocole d'ingestion : validation pure, partagée.
//
// POURQUOI CE FICHIER EST EN JAVASCRIPT SIMPLE, SANS API DENO
// -----------------------------------------------------------
// La validation est la seule barrière entre un POST anonyme et le schéma `private`. Une
// barrière non testée n'en est pas une. En la gardant pure (aucun `Deno.*`, aucun `fetch`,
// aucun accès réseau), elle est importable À L'IDENTIQUE par :
//   • l'Edge Function (`supabase/functions/ingest/index.ts`), sous Deno ;
//   • les tests Node (`tests/data/ingest-protocol.test.mjs`).
// Il n'existe donc pas deux versions de l'allowlist qui pourraient diverger.
//
// RÈGLE DE CONCEPTION : liste blanche, jamais liste noire. Un champ non déclaré est
// SUPPRIMÉ, un type d'événement non déclaré est REFUSÉ. Une denylist oublie toujours un
// champ ; c'est l'erreur que `src/lib/analytics.js` a déjà commise une fois.

/** Version du protocole. Le client l'envoie, le serveur refuse tout ce qui diffère. */
export const PROTOCOL_VERSION = 1;

/** Plafond de payload, vérifié AVANT désérialisation. 256 Kio ≈ 3 passations complètes. */
export const MAX_PAYLOAD_BYTES = 256 * 1024;

/** Nombre maximal de réponses dans un seul lot. */
export const MAX_BATCH_ITEMS = 200;

/** Longueur maximale du commentaire libre d'un signalement. */
export const MAX_COMMENT_LENGTH = 1000;

// ─── Vocabulaires fermés ─────────────────────────────────────────────────────

export const CONSENT_PURPOSES = Object.freeze([
  'measurement', 'political_analytics', 'cloud_save', 'research',
]);

export const RESPONSE_STATES = Object.freeze([
  'answered', 'dont_know', 'no_opinion', 'prefer_not_to_answer',
]);

export const DEVICE_CATEGORIES = Object.freeze(['mobile', 'tablet', 'desktop']);

/**
 * Modes canoniques, alignés sur `TEST_MODES` (src/data/questions.js) : 16 / 32 / 64 questions.
 * Les alias historiques `quick` / `medium` / `full` sont normalisés côté client par
 * `canonicalMode()` et sont donc REFUSÉS ici — les accepter ferait coexister deux valeurs
 * pour un même mode et fausserait toute comparaison par mode.
 */
export const QUIZ_MODES = Object.freeze(['discovery', 'standard', 'deep']);

export const REPORT_CATEGORIES = Object.freeze([
  'unclear', 'biased', 'irrelevant', 'fact_error', 'outdated', 'technical', 'other',
]);

export const ORIGIN_SCREENS = Object.freeze([
  'questionnaire', 'improve', 'election_detail', 'profile', 'learn', 'other',
]);

export const LANGUAGES = Object.freeze(['fr', 'en']);

/**
 * Types d'événements acceptés, et pour chacun la liste EXHAUSTIVE des champs autorisés.
 * Tout champ absent d'ici est retiré silencieusement — un client trop bavard ne doit pas
 * pouvoir faire entrer une donnée non prévue.
 */
export const EVENT_FIELDS = Object.freeze({
  consent: Object.freeze([
    'anonymous_session_id', 'user_id', 'purpose', 'granted',
    'policy_version', 'text_hash', 'decided_at', 'retention_until',
    'client_release', 'language',
  ]),
  attempt: Object.freeze([
    'attempt_id', 'anonymous_session_id', 'user_id',
    'questionnaire_version', 'scoring_version', 'mode',
    'started_at', 'completed_at', 'abandoned_at', 'last_activity_at',
    'question_count_shown', 'question_count_answered',
    'consent_version', 'client_release', 'language', 'device_category',
  ]),
  responses: Object.freeze(['attempt_id', 'items']),
  report: Object.freeze([
    'question_id', 'questionnaire_version', 'attempt_id',
    'anonymous_session_id', 'user_id',
    'category', 'comment', 'language', 'client_release', 'origin_screen',
  ]),
});

/** Champs autorisés dans un élément de `responses.items`. */
export const RESPONSE_ITEM_FIELDS = Object.freeze([
  'question_id', 'questionnaire_version', 'response_state', 'answer_value',
  'first_shown_at', 'last_shown_at', 'answered_at',
  'active_dwell_ms', 'total_elapsed_ms',
  'presentation_count', 'change_count', 'sequence_index',
  'client_updated_at', 'mutation_id',
]);

/**
 * Champs formellement interdits, quel que soit l'événement. Double sécurité : si un futur
 * développeur ajoute par mégarde `ip` ou `user_agent` à une allowlist, la validation refuse
 * le payload entier au lieu de l'accepter.
 */
export const FORBIDDEN_FIELDS = Object.freeze([
  'ip', 'ip_address', 'user_agent', 'ua', 'referrer', 'referer',
  'email', 'postal_code', 'latitude', 'longitude', 'geo',
  'device', 'screen', 'fingerprint', 'gender', 'age', 'age_range',
]);

// ─── Primitives ──────────────────────────────────────────────────────────────

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const ISO_RE  = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,6})?(Z|[+-]\d{2}:\d{2})$/;
// Identifiants de question du produit : `ECO_12`, `PUB_3`… Volontairement étroit.
const QUESTION_ID_RE = /^[A-Z]{2,4}_\d{1,4}$/;
const VERSION_RE     = /^[A-Za-z0-9._-]{1,64}$/;

const isUuid    = v => typeof v === 'string' && UUID_RE.test(v);
const isIso     = v => typeof v === 'string' && ISO_RE.test(v);
const isVersion = v => typeof v === 'string' && VERSION_RE.test(v);
const isBool    = v => typeof v === 'boolean';
const inSet     = (v, set) => typeof v === 'string' && set.includes(v);

function isCount(v, max) {
  return Number.isInteger(v) && v >= 0 && v <= max;
}

/** Retire tout champ non déclaré. Retourne aussi ce qui a été retiré, pour les tests. */
export function pickAllowed(obj, allowed) {
  const out = {};
  const dropped = [];
  for (const [k, v] of Object.entries(obj ?? {})) {
    if (allowed.includes(k)) out[k] = v;
    else dropped.push(k);
  }
  return { value: out, dropped };
}

const fail = (message) => ({ ok: false, error: message });

// ─── Validation par type d'événement ─────────────────────────────────────────

function validateConsent(raw) {
  const { value } = pickAllowed(raw, EVENT_FIELDS.consent);

  if (!inSet(value.purpose, CONSENT_PURPOSES)) return fail('purpose inconnu');
  if (!isBool(value.granted))                  return fail('granted doit être un booléen');
  if (!isVersion(value.policy_version))        return fail('policy_version invalide');
  if (typeof value.text_hash !== 'string' || value.text_hash.length > 128) {
    return fail('text_hash invalide');
  }
  if (!isUuid(value.anonymous_session_id) && !isUuid(value.user_id)) {
    return fail('un sujet (anonymous_session_id ou user_id) est obligatoire');
  }
  for (const k of ['decided_at', 'retention_until']) {
    if (value[k] != null && !isIso(value[k])) return fail(`${k} doit être une date ISO 8601`);
  }
  if (value.language != null && !inSet(value.language, LANGUAGES)) return fail('language invalide');
  return { ok: true, value };
}

function validateAttempt(raw) {
  const { value } = pickAllowed(raw, EVENT_FIELDS.attempt);

  if (!isUuid(value.attempt_id))           return fail('attempt_id doit être un UUID');
  if (!isUuid(value.anonymous_session_id)) return fail('anonymous_session_id doit être un UUID');
  if (value.user_id != null && !isUuid(value.user_id)) return fail('user_id invalide');
  if (!isVersion(value.questionnaire_version)) return fail('questionnaire_version invalide');
  if (!isVersion(value.scoring_version))       return fail('scoring_version invalide');
  if (!inSet(value.mode, QUIZ_MODES))          return fail('mode inconnu');
  if (!isVersion(value.consent_version))       return fail('consent_version invalide');

  for (const k of ['started_at', 'completed_at', 'abandoned_at', 'last_activity_at']) {
    if (value[k] != null && !isIso(value[k])) return fail(`${k} doit être une date ISO 8601`);
  }
  for (const k of ['question_count_shown', 'question_count_answered']) {
    if (value[k] != null && !isCount(value[k], 1000)) return fail(`${k} invalide`);
  }
  if (value.language != null && !inSet(value.language, LANGUAGES)) return fail('language invalide');
  if (value.device_category != null && !inSet(value.device_category, DEVICE_CATEGORIES)) {
    return fail('device_category doit valoir mobile, tablet ou desktop');
  }
  if (value.client_release != null && !isVersion(value.client_release)) {
    return fail('client_release invalide');
  }
  return { ok: true, value };
}

function validateResponseItem(raw) {
  const { value } = pickAllowed(raw, RESPONSE_ITEM_FIELDS);

  if (!QUESTION_ID_RE.test(String(value.question_id ?? ''))) return fail('question_id invalide');
  if (!isVersion(value.questionnaire_version)) return fail('questionnaire_version invalide');
  if (!isUuid(value.mutation_id))              return fail('mutation_id doit être un UUID');
  if (!isIso(value.client_updated_at))         return fail('client_updated_at doit être une date ISO 8601');

  if (value.response_state != null && !inSet(value.response_state, RESPONSE_STATES)) {
    return fail('response_state inconnu');
  }

  // La règle métier, revalidée ici : `answered` ⇒ 1–5 ; tout autre état ⇒ pas de valeur.
  if (value.response_state === 'answered') {
    if (!Number.isInteger(value.answer_value) || value.answer_value < 1 || value.answer_value > 5) {
      return fail('answered exige une valeur entière entre 1 et 5');
    }
  } else if (value.answer_value != null) {
    return fail('seule une réponse « answered » porte une valeur numérique');
  }

  for (const k of ['first_shown_at', 'last_shown_at', 'answered_at']) {
    if (value[k] != null && !isIso(value[k])) return fail(`${k} doit être une date ISO 8601`);
  }
  // Un temps négatif n'est jamais accepté : une horloge monotone ne recule pas, une valeur
  // négative traduit un défaut de mesure qu'il vaut mieux refuser que stocker.
  for (const k of ['active_dwell_ms', 'total_elapsed_ms']) {
    if (value[k] != null && !(Number.isInteger(value[k]) && value[k] >= 0)) {
      return fail(`${k} doit être un entier positif ou nul`);
    }
  }
  for (const k of ['presentation_count', 'change_count', 'sequence_index']) {
    if (value[k] != null && !isCount(value[k], 10000)) return fail(`${k} invalide`);
  }
  return { ok: true, value };
}

function validateResponses(raw) {
  const { value } = pickAllowed(raw, EVENT_FIELDS.responses);

  if (!isUuid(value.attempt_id)) return fail('attempt_id doit être un UUID');
  if (!Array.isArray(value.items) || value.items.length === 0) {
    return fail('items doit être un tableau non vide');
  }
  if (value.items.length > MAX_BATCH_ITEMS) {
    return fail(`lot trop grand (${value.items.length} > ${MAX_BATCH_ITEMS})`);
  }

  const items = [];
  for (let i = 0; i < value.items.length; i++) {
    const res = validateResponseItem(value.items[i]);
    if (!res.ok) return fail(`items[${i}] : ${res.error}`);
    items.push(res.value);
  }
  return { ok: true, value: { attempt_id: value.attempt_id, items } };
}

function validateReport(raw) {
  const { value } = pickAllowed(raw, EVENT_FIELDS.report);

  if (!QUESTION_ID_RE.test(String(value.question_id ?? ''))) return fail('question_id invalide');
  if (!isVersion(value.questionnaire_version)) return fail('questionnaire_version invalide');
  if (!inSet(value.category, REPORT_CATEGORIES)) return fail('category inconnue');

  if (value.comment != null) {
    if (typeof value.comment !== 'string') return fail('comment doit être une chaîne');
    // Nettoyage : caractères de contrôle retirés, longueur bornée. Le stockage n'est pas
    // du HTML, mais le tableau de bord affiche ce texte — on ne lui transmet pas d'octets
    // de contrôle qui pourraient casser un export CSV.
    value.comment = value.comment
      .replace(/[\u0000-\u001F\u007F]/g, "")
      .trim()
      .slice(0, MAX_COMMENT_LENGTH);
    if (value.comment === '') delete value.comment;
  }

  if (value.attempt_id != null && !isUuid(value.attempt_id)) return fail('attempt_id invalide');
  if (value.anonymous_session_id != null && !isUuid(value.anonymous_session_id)) {
    return fail('anonymous_session_id invalide');
  }
  if (value.user_id != null && !isUuid(value.user_id)) return fail('user_id invalide');
  if (value.language != null && !inSet(value.language, LANGUAGES)) return fail('language invalide');
  if (value.origin_screen != null && !inSet(value.origin_screen, ORIGIN_SCREENS)) {
    return fail('origin_screen doit appartenir à la liste fermée');
  }
  return { ok: true, value };
}

const VALIDATORS = Object.freeze({
  consent:   validateConsent,
  attempt:   validateAttempt,
  responses: validateResponses,
  report:    validateReport,
});

// ─── Enveloppe ───────────────────────────────────────────────────────────────

/**
 * Valide une enveloppe complète `{ protocol_version, type, payload }`.
 * @returns {{ok: true, type: string, value: Object} | {ok: false, error: string}}
 */
export function validateEnvelope(envelope) {
  if (envelope == null || typeof envelope !== 'object' || Array.isArray(envelope)) {
    return fail('enveloppe absente ou mal formée');
  }
  if (envelope.protocol_version !== PROTOCOL_VERSION) {
    return fail(`version de protocole non prise en charge (${envelope.protocol_version})`);
  }

  const type = envelope.type;
  // `Object.hasOwn` + contrôle de type : une simple lecture `VALIDATORS[type]` renvoie un
  // objet TRONQUÉ mais truthy pour `type === '__proto__'` (l'accesseur hérité de
  // Object.prototype), et l'appel plantait au lieu de refuser proprement. Un payload
  // hostile obtenait ainsi une 500 plutôt qu'un 422 — bruit dans les journaux et signal
  // exploitable. Les clés héritées ne sont donc jamais consultées.
  const validator = Object.hasOwn(VALIDATORS, type) ? VALIDATORS[type] : null;
  if (typeof validator !== 'function') return fail(`type d'événement refusé : ${String(type)}`);

  const payload = envelope.payload;
  if (payload == null || typeof payload !== 'object' || Array.isArray(payload)) {
    return fail('payload absent ou mal formé');
  }

  // Refus PUR ET SIMPLE si un champ interdit apparaît, à n'importe quel niveau. Le retirer
  // silencieusement masquerait un client qui tente d'exfiltrer une donnée non prévue :
  // ici on veut le savoir, pas le nettoyer.
  const offending = findForbiddenField(payload);
  if (offending) return fail(`champ interdit dans le payload : ${offending}`);

  const result = validator(payload);
  if (!result.ok) return result;

  return { ok: true, type, value: result.value };
}

function findForbiddenField(node, depth = 0) {
  if (depth > 4 || node == null || typeof node !== 'object') return null;
  if (Array.isArray(node)) {
    for (const item of node) {
      const found = findForbiddenField(item, depth + 1);
      if (found) return found;
    }
    return null;
  }
  for (const [k, v] of Object.entries(node)) {
    if (FORBIDDEN_FIELDS.includes(k.toLowerCase())) return k;
    const found = findForbiddenField(v, depth + 1);
    if (found) return found;
  }
  return null;
}

/** Taille en octets d'une chaîne UTF-8, sans dépendre d'une API de plateforme. */
export function byteLength(text) {
  if (typeof TextEncoder !== 'undefined') return new TextEncoder().encode(text).length;
  return Buffer.byteLength(text, 'utf8');
}
