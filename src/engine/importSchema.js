// POLISCOP — Schéma d'import versionné.
//
// POURQUOI CE FICHIER
// -------------------
// La première passe de durcissement avait corrigé le pire (le profil est recalculé et non
// plus lu depuis le fichier), mais le contre-audit a relevé qu'il restait trop permissif :
//   • aucune version de format n'était exigée — un fichier sans `version` passait ;
//   • `themeWeights` n'était ni validé ni importé : les poids DÉJÀ présents dans le
//     navigateur continuaient donc de pondérer un profil importé d'ailleurs, silencieusement ;
//   • `testMode`, `questionIds` et la file n'étaient pas restaurés ;
//   • la graine acceptait n'importe quelle chaîne, de n'importe quelle longueur.
//
// RÈGLE DIRECTRICE : un champ absent est RÉINITIALISÉ explicitement, jamais hérité de l'état
// courant. Un import est le remplacement d'une session, pas une fusion.

import { THEMES_ORDER, getQuestionQueue } from '../data/questions.js';
import {
  EXPORT_FORMAT_VERSION, QUESTIONNAIRE_VERSION, QUEUE_ALGORITHM_VERSION,
  SCORING_VERSION_V1, SCORING_VERSION_V2, AXIS_VERSION,
} from './versions.js';

/** Nombre de questions attendu par mode. Un export qui ne colle pas n'est pas reproductible. */
export const MODE_LENGTHS = Object.freeze({
  discovery: 16, standard: 32, deep: 64,
  quick: 16, medium: 32, full: 64,   // alias hérités
});

/** Versions de scoring et d'axes que ce build sait relire. */
const KNOWN_SCORING_VERSIONS = [SCORING_VERSION_V1, SCORING_VERSION_V2];
const KNOWN_AXIS_VERSIONS = [AXIS_VERSION];

/** Formats acceptés en lecture, du plus ancien au plus récent. */
export const SUPPORTED_IMPORT_FORMATS = Object.freeze(['1.0', '2.0']);

const MAX_BYTES        = 512 * 1024; // un export légitime pèse quelques dizaines de Ko
const MAX_SEED_LENGTH  = 64;
const SEED_PATTERN     = /^[A-Za-z0-9_-]{1,64}$/;
const VALID_MODES      = new Set(['discovery', 'standard', 'deep', 'quick', 'medium', 'full']);
const WEIGHT_SUM_TOLERANCE = 1; // les poids sont saisis sur 100 points, arrondis à l'entier

/**
 * Valide une allocation `themeWeights`.
 * @returns {{ok: true, value: Object} | {ok: false, error: string}}
 */
export function validateThemeWeights(raw) {
  if (raw == null) return { ok: true, value: null };
  if (typeof raw !== 'object' || Array.isArray(raw)) return { ok: false, error: 'weights_malformed' };

  const keys = Object.keys(raw);
  if (keys.length !== THEMES_ORDER.length) return { ok: false, error: 'weights_wrong_theme_count' };
  if (!THEMES_ORDER.every(t => Object.prototype.hasOwnProperty.call(raw, t))) {
    return { ok: false, error: 'weights_unknown_theme' };
  }

  let sum = 0;
  const value = {};
  for (const theme of THEMES_ORDER) {
    const w = raw[theme];
    if (typeof w !== 'number' || !Number.isFinite(w) || w < 0) {
      return { ok: false, error: 'weights_invalid_value' };
    }
    value[theme] = w;
    sum += w;
  }

  // Somme attendue : 100 points. Une allocation entièrement nulle est refusée — elle ne
  // décrit aucune préférence et le moteur devrait alors inventer un repli.
  if (sum === 0) return { ok: false, error: 'weights_all_zero' };
  if (Math.abs(sum - 100) > WEIGHT_SUM_TOLERANCE) return { ok: false, error: 'weights_bad_sum' };

  return { ok: true, value };
}

/** Valide un ordre de priorité : permutation exacte des thèmes connus. */
export function validatePriorityOrder(raw) {
  if (raw == null) return { ok: true, value: null };
  if (!Array.isArray(raw)) return { ok: false, error: 'priority_malformed' };
  if (raw.length !== THEMES_ORDER.length) return { ok: false, error: 'priority_wrong_length' };
  if (new Set(raw).size !== THEMES_ORDER.length) return { ok: false, error: 'priority_duplicate' };
  if (!raw.every(t => THEMES_ORDER.includes(t))) return { ok: false, error: 'priority_unknown_theme' };
  return { ok: true, value: [...raw] };
}

/** Valide une graine de tirage : chaîne courte, alphanumérique. */
export function validateSeed(raw) {
  if (raw == null) return { ok: true, value: null };
  if (typeof raw !== 'string') return { ok: false, error: 'seed_malformed' };
  if (raw.length > MAX_SEED_LENGTH || !SEED_PATTERN.test(raw)) return { ok: false, error: 'seed_invalid' };
  return { ok: true, value: raw };
}

/** Valide un mode de questionnaire. */
export function validateTestMode(raw) {
  if (raw == null) return { ok: true, value: null };
  if (typeof raw !== 'string' || !VALID_MODES.has(raw)) return { ok: false, error: 'mode_invalid' };
  return { ok: true, value: raw };
}

/**
 * Analyse et valide un export Poliscop.
 *
 * @param {string} jsonText
 * @param {{knownQuestionIds: Set<string>, isAcceptableAnswer: (v:any)=>boolean}} deps
 * @returns {{ok: true, value: Object, warnings: string[]} | {ok: false, error: string}}
 *
 * `value` contient TOUS les champs de session, y compris ceux à réinitialiser (`null`).
 * L'appelant doit les appliquer tels quels — ne jamais faire `?? étatCourant`.
 */
export function parseImport(jsonText, { knownQuestionIds, isAcceptableAnswer }) {
  if (typeof jsonText !== 'string' || jsonText.length === 0) return { ok: false, error: 'malformed' };
  if (jsonText.length > MAX_BYTES) return { ok: false, error: 'too_large' };

  let data;
  try { data = JSON.parse(jsonText); }
  catch { return { ok: false, error: 'malformed' }; }

  if (!data || typeof data !== 'object' || Array.isArray(data)) return { ok: false, error: 'malformed' };

  // Version de format EXIGÉE. Un fichier sans version n'est pas un export Poliscop : le
  // laisser passer revenait à accepter n'importe quel JSON contenant une clé `answers`.
  const version = data.version;
  if (typeof version !== 'string') return { ok: false, error: 'missing_format_version' };
  if (!SUPPORTED_IMPORT_FORMATS.includes(version)) return { ok: false, error: 'unsupported_format_version' };

  if (!data.answers || typeof data.answers !== 'object' || Array.isArray(data.answers)) {
    return { ok: false, error: 'no_answers' };
  }

  const warnings = [];

  // ── Réponses ──────────────────────────────────────────────────────────────
  const answers = {};
  let droppedAnswers = 0;
  for (const [id, value] of Object.entries(data.answers)) {
    if (!knownQuestionIds.has(id) || !isAcceptableAnswer(value)) { droppedAnswers++; continue; }
    answers[id] = value;
  }
  if (Object.keys(answers).length === 0) return { ok: false, error: 'no_valid_answers' };
  if (droppedAnswers > 0) warnings.push(`${droppedAnswers} réponse(s) écartée(s)`);

  // ── Champs de session ─────────────────────────────────────────────────────
  // Chaque champ invalide est ÉCARTÉ (remis à null) avec un avertissement, plutôt que de
  // faire échouer tout l'import : une session reste utilisable sans sa graine.
  const checks = {
    priorityOrder: validatePriorityOrder(data.priorityOrder),
    themeWeights:  validateThemeWeights(data.themeWeights),
    queueSeed:     validateSeed(data.queueSeed),
    testMode:      validateTestMode(data.testMode),
  };
  const value = {};
  for (const [field, res] of Object.entries(checks)) {
    if (res.ok) { value[field] = res.value; }
    else { value[field] = null; warnings.push(`${field} ignoré (${res.error})`); }
  }

  // ── Versions de calcul ────────────────────────────────────────────────────
  // Une version inconnue signifie que le fichier a été produit par un moteur que ce build
  // ne sait pas relire. On refuse plutôt que d'appliquer nos règles à des données étrangères.
  const declaredScoring = data.versions?.scoring;
  if (declaredScoring != null && !KNOWN_SCORING_VERSIONS.includes(declaredScoring)) {
    return { ok: false, error: 'unknown_scoring_version' };
  }
  const declaredAxis = data.versions?.axis;
  if (declaredAxis != null && !KNOWN_AXIS_VERSIONS.includes(declaredAxis)) {
    return { ok: false, error: 'unknown_axis_version' };
  }

  // ── File de questions : REPRODUCTIBILITÉ, pas seulement des IDs connus ────
  //
  // La version précédente se contentait de vérifier que chaque identifiant existait. Un
  // export bricolé — 12 questions en mode « standard », doublons, ordre modifié — passait
  // et produisait une « reprise » qui n'avait rien à voir avec la passation d'origine.
  //
  // Règle : la file est acceptée UNIQUEMENT si on peut la RÉGÉNÉRER à l'identique depuis
  // (mode, priorityOrder, graine, version d'algorithme). Sinon on garde les réponses et on
  // dit que la file n'est pas restaurable.
  let questionIds = null;
  if (Array.isArray(data.questionIds) && data.questionIds.length > 0) {
    const ids = data.questionIds;
    const reason = (() => {
      if (!ids.every(id => typeof id === 'string' && knownQuestionIds.has(id))) return 'identifiant inconnu';
      if (new Set(ids).size !== ids.length) return 'doublon';
      if (!value.testMode) return 'mode absent';
      const expectedLength = MODE_LENGTHS[value.testMode];
      if (expectedLength && ids.length !== expectedLength) {
        return `longueur ${ids.length} incompatible avec le mode ${value.testMode} (${expectedLength} attendues)`;
      }
      if (!value.queueSeed) return 'graine absente';
      const declaredQueueAlgo = data.versions?.queueAlgorithm;
      if (declaredQueueAlgo != null && declaredQueueAlgo !== QUEUE_ALGORITHM_VERSION) {
        return 'version d’algorithme de file différente';
      }
      const declaredQuestionnaire = typeof data.questionnaireVersion === 'string'
        ? data.questionnaireVersion : data.versions?.questionnaire;
      if (declaredQuestionnaire != null && declaredQuestionnaire !== QUESTIONNAIRE_VERSION) {
        return 'version de questionnaire différente';
      }
      // Régénération et comparaison EXACTE, ordre compris.
      const regenerated = getQuestionQueue(value.testMode, value.priorityOrder, value.queueSeed)
        .map(q => q.id);
      if (regenerated.length !== ids.length || regenerated.some((id, i) => id !== ids[i])) {
        return 'la file ne se régénère pas à l’identique depuis la graine';
      }
      return null;
    })();

    if (reason) warnings.push(`file de questions ignorée (${reason})`);
    else questionIds = [...ids];
  }
  value.questionIds = questionIds;

  // Le format 1.0 ne portait ni versions, ni graine, ni file : on le lit, mais on ne
  // prétend pas savoir comment il a été calculé.
  if (version === '1.0') {
    warnings.push('format 1.0 : ni graine ni versions de calcul — la passation n’est pas reproductible');
  }

  return {
    ok: true,
    warnings,
    value: {
      formatVersion: version,
      answers,
      droppedAnswers,
      // Ces quatre champs sont TOUJOURS présents, éventuellement à null : l'appelant les
      // applique tels quels, ce qui garantit qu'aucune valeur locale antérieure ne survit.
      priorityOrder: value.priorityOrder,
      themeWeights:  value.themeWeights,
      queueSeed:     value.queueSeed,
      testMode:      value.testMode,
      questionIds:   value.questionIds,
      questionnaireVersion: typeof data.questionnaireVersion === 'string'
        ? data.questionnaireVersion
        : (typeof data.versions?.questionnaire === 'string' ? data.versions.questionnaire : null),
      queueAlgorithmVersion: typeof data.versions?.queueAlgorithm === 'string'
        ? data.versions.queueAlgorithm
        : null,
      scoringVersion: typeof declaredScoring === 'string' ? declaredScoring : null,
      /** La file est-elle reproductible ? Faux ⇒ seules les réponses sont importées. */
      queueReproducible: questionIds != null,
    },
  };
}

export { EXPORT_FORMAT_VERSION };
