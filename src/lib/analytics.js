/**
 * POLISCOP — Mesure d'audience.
 *
 * MODÈLE — allowlist par événement, point d'émission unique
 * ---------------------------------------------------------
 * Deux versions successives de ce module ont échoué :
 *
 *   1. Un gate `politicalData` : il n'empêchait pas l'envoi de l'opinion vers l'identifiant
 *      de terminal, il l'AUTORISAIT dès que l'utilisateur avait accepté l'analyse de ses
 *      opinions. La case « mesure d'audience » affirmait pourtant le contraire.
 *   2. Une denylist (`stripOpinionPayload`) appliquée par une fonction `trackAudience()`
 *      que 19 des 27 fonctions exportées n'utilisaient pas : `candidate_viewed`,
 *      `historical_figure_viewed`, `compare_started`, `explanation_toggled`,
 *      `academy_concept_clicked` et d'autres appelaient `track()` directement. Le filtre
 *      était donc contourné pour la majorité des événements.
 *
 * Modèle actuel :
 *   • `emit()` est le SEUL point d'envoi ; il est privé au module.
 *   • Chaque événement déclare la liste EXHAUSTIVE de ses propriétés autorisées
 *     (`EVENT_ALLOWLIST`). Toute clé non déclarée est supprimée.
 *   • Un événement inconnu de l'allowlist est refusé.
 *   • `tests/data/analytics-allowlist.test.mjs` échoue si `track()` est appelé ailleurs
 *     que dans `emit()`, ou si une propriété interdite apparaît dans l'allowlist.
 *
 * CE QUI NE PEUT PAS TRANSITER, quelle que soit la fonction appelée : une valeur de réponse,
 * un identifiant de question, un thème, un concept, un candidat, une figure, un archétype,
 * un ordre de priorités, un identifiant d'élection, une donnée démographique.
 *
 * Les tendances politiques doivent être agrégées depuis les tables de COMPTE
 * (`user_answers`, `user_profiles`), soumises au consentement `politicalData`, avec contrôle
 * serveur et seuils de population — pas depuis un flux d'événements de terminal.
 *
 * Le consentement applicable ici est `measurement` : `track()` (anonymous.js) refuse d'émettre
 * sans lui et ne dépose aucun identifiant.
 */

import { track } from './anonymous.js';

// ─── Allowlist ───────────────────────────────────────────────────────────────

/**
 * Propriétés autorisées, par événement. Une clé absente d'ici est supprimée avant envoi.
 *
 * Règle de rédaction : n'ajouter une clé que si elle décrit un COMPORTEMENT (quel écran,
 * quelle étape, combien, quelle langue, quel mode). Jamais un CONTENU d'opinion.
 */
export const EVENT_ALLOWLIST = Object.freeze({
  // Acquisition
  landing_view:              ['lang', 'has_profile'],
  // Entonnoir du questionnaire
  test_start:                ['mode', 'lang'],
  test_complete:             ['mode', 'answered_count', 'total_count', 'lang'],
  improve_started:           [],
  improve_completed:         ['answered_count'],
  retake_started:            [],
  // Question : index et mode seulement. Ni `question_id`, ni `theme`, ni `value` —
  // savoir quelles questions une personne passe est déjà un signal d'opinion.
  question_answered:         ['question_index', 'mode', 'is_improve'],
  question_skipped:          ['question_index', 'mode'],
  // Profil : jamais d'archétype ni de candidat, ce sont des opinions dérivées.
  profile_viewed:            ['answered_count'],
  profile_shared:            ['method'],
  profile_downloaded:        [],
  profile_exported:          [],
  share_modal_opened:        [],
  // Le simple fait d'avoir ordonné ses priorités est un signal de parcours ; l'ordre lui-même
  // est un signal de valeurs et n'est donc pas transmis.
  priority_ranking_completed: [],
  // Compte
  signup_completed:          ['method'],
  login_completed:           ['method'],
  // Démographie : seul le fait de compléter ou passer le formulaire est compté.
  demographics_completed:    ['has_postal_code'],
  demographics_skipped:      [],
  // Pédagogie : position dans le parcours, jamais le concept ni la question concernée.
  concept_opened:            ['question_index'],
  beginner_opened:           ['section'],
  explanation_toggled:       ['open'],
  academy_definition_opened: ['position'],
  academy_concept_clicked:   ['position'],
  // Consultation de contenu : le compteur d'ouvertures, jamais QUI est consulté.
  candidate_viewed:          [],
  election_viewed:           [],
  historical_figure_viewed:  ['section'],
  compare_started:           [],
});

/**
 * Clés formellement interdites, quelle que soit l'allowlist. Double sécurité : si quelqu'un
 * ajoute par mégarde `theme` à un événement, l'émission est refusée en développement.
 */
export const OPINION_PAYLOAD_KEYS = Object.freeze([
  'value', 'answer', 'answer_value',
  'question_id', 'theme', 'themes',
  'concept_key', 'concept_id',
  'archetype_id', 'top_candidate_id', 'candidate_id', 'top_candidate_alignment',
  'election_id', 'figure_id', 'id1', 'id2',
  'priority_order', 'theme_weights', 'current_id',
  'gender', 'age_range', 'commune_type', 'employment_status', 'education_level',
]);

const isDev = () => Boolean(import.meta?.env?.DEV);

/**
 * Filtre un payload selon l'allowlist de son événement.
 * Exportée pour les tests ; l'application passe toujours par `emit()`.
 * @returns {{props: Object, dropped: string[], forbidden: string[]}}
 */
export function filterEventProps(eventName, props = {}) {
  const allowed = EVENT_ALLOWLIST[eventName];
  if (!allowed) return { props: null, dropped: [], forbidden: [], unknownEvent: true };

  const out = {};
  const dropped = [];
  const forbidden = [];

  for (const [key, value] of Object.entries(props ?? {})) {
    if (OPINION_PAYLOAD_KEYS.includes(key)) { forbidden.push(key); continue; }
    if (!allowed.includes(key)) { dropped.push(key); continue; }
    out[key] = value;
  }
  return { props: out, dropped, forbidden };
}

/**
 * SEUL point d'émission du module. Privé : rien d'autre n'appelle `track()`.
 */
function emit(eventName, props = {}) {
  const { props: clean, forbidden, unknownEvent } = filterEventProps(eventName, props);

  if (unknownEvent) {
    if (isDev()) {
      console.error(`[Poliscop] Événement « ${eventName} » absent de EVENT_ALLOWLIST — non émis.`);
    }
    return;
  }
  if (forbidden.length > 0 && isDev()) {
    console.error(
      `[Poliscop] Clés d'opinion refusées sur « ${eventName} » : ${forbidden.join(', ')}. ` +
      `Voir l'en-tête de src/lib/analytics.js.`,
    );
  }

  track(eventName, Object.keys(clean).length > 0 ? clean : {});
}

// ─── Acquisition ─────────────────────────────────────────────────────────────

export function trackLandingView({ lang, hasProfile } = {}) {
  emit('landing_view', { lang: lang ?? null, has_profile: hasProfile ?? false });
}

// ─── Entonnoir du questionnaire ──────────────────────────────────────────────

export function trackTestStart({ mode, lang } = {}) {
  emit('test_start', { mode: mode ?? null, lang: lang ?? null });
}

export function trackTestComplete({ mode, answeredCount, totalCount, lang } = {}) {
  emit('test_complete', {
    mode: mode ?? null,
    answered_count: answeredCount ?? null,
    total_count: totalCount ?? null,
    lang: lang ?? null,
  });
}

export function trackImproveStarted() { emit('improve_started'); }

export function trackImproveCompleted({ answeredCount } = {}) {
  emit('improve_completed', { answered_count: answeredCount ?? null });
}

export function trackRetakeStarted() { emit('retake_started'); }

/**
 * Une question reçoit une réponse. La VALEUR, l'identifiant de question et le thème sont
 * volontairement absents : seule la progression est mesurée.
 */
export function trackQuestionAnswered({ questionIndex, mode, isImprove } = {}) {
  emit('question_answered', {
    question_index: questionIndex ?? null,
    mode: mode ?? null,
    is_improve: isImprove ?? false,
  });
}

/** Une question est passée. Le thème n'est pas transmis : les sujets évités sont un signal. */
export function trackQuestionSkipped({ questionIndex, mode } = {}) {
  emit('question_skipped', { question_index: questionIndex ?? null, mode: mode ?? null });
}

// ─── Profil ──────────────────────────────────────────────────────────────────

export function trackProfileViewed({ answeredCount } = {}) {
  emit('profile_viewed', { answered_count: answeredCount ?? null });
}

export function trackProfileShared({ method } = {}) {
  emit('profile_shared', { method: method ?? null });
}

export function trackProfileDownloaded() { emit('profile_downloaded'); }
export function trackProfileExported()   { emit('profile_exported'); }
export function trackShareModalOpened()  { emit('share_modal_opened'); }

/** L'ordre choisi n'est pas transmis — c'est en soi un signal de valeurs. */
export function trackPriorityCompleted() { emit('priority_ranking_completed'); }

// ─── Compte ──────────────────────────────────────────────────────────────────

export function trackSignupCompleted({ method } = {}) {
  emit('signup_completed', { method: method ?? null });
}

export function trackLoginCompleted({ method } = {}) {
  emit('login_completed', { method: method ?? null });
}

// ─── Démographie ─────────────────────────────────────────────────────────────
//
// Destinés à être croisés avec les opinions, ces champs rendraient le traitement sensible.
// Seul le fait de compléter le formulaire est compté.

export function trackDemographicsCompleted({ hasPostalCode } = {}) {
  emit('demographics_completed', { has_postal_code: hasPostalCode ?? false });
}

export function trackDemographicsSkipped() { emit('demographics_skipped'); }

// ─── Pédagogie ───────────────────────────────────────────────────────────────

export function trackConceptOpened({ questionIndex } = {}) {
  emit('concept_opened', { question_index: questionIndex ?? null });
}

export function trackBeginnerOpened({ section } = {}) {
  emit('beginner_opened', { section: section ?? null });
}

export function trackExplanationToggled({ open } = {}) {
  emit('explanation_toggled', { open: open ?? null });
}

export function trackAcademyDefinitionOpened({ position } = {}) {
  emit('academy_definition_opened', { position: position ?? null });
}

export function trackAcademyConceptClicked({ position } = {}) {
  emit('academy_concept_clicked', { position: position ?? null });
}

// ─── Consultation de contenu ─────────────────────────────────────────────────
//
// On compte les ouvertures, pas QUI est consulté : « a ouvert la fiche Le Pen » est une
// donnée d'opinion dès qu'elle est attachée à un identifiant de terminal persistant.

export function trackCandidateViewed()        { emit('candidate_viewed'); }
export function trackElectionViewed()         { emit('election_viewed'); }
export function trackCompareStarted()         { emit('compare_started'); }

export function trackFigureViewed({ section } = {}) {
  emit('historical_figure_viewed', { section: section ?? null });
}
