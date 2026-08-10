// POLISCOP — Mesure du temps ACTIF par question.
//
// CE QUE « TEMPS ACTIF » VEUT DIRE ICI
// ------------------------------------
// Pas `answered_at - first_shown_at`. Cette différence compte l'onglet laissé ouvert
// pendant le déjeuner, la modale de concept ouverte par-dessus la question, et le temps
// passé sur une autre page. Elle ne mesure pas la difficulté d'une question, elle mesure
// le hasard. Le temps actif est la somme des intervalles pendant lesquels la question
// était RÉELLEMENT visible et au premier plan.
//
// HORLOGE MONOTONE
// ----------------
// `performance.now()`, jamais `Date.now()`. `Date.now()` recule quand l'horloge système est
// resynchronisée (NTP, changement d'heure, réveil de veille) et produit alors des durées
// négatives. Les horodatages absolus (`first_shown_at`…) restent en `Date`, parce qu'ils
// doivent être comparables entre appareils — mais aucune DURÉE n'est calculée à partir
// d'eux.
//
// REACT STRICT MODE
// -----------------
// En développement, React monte, démonte puis remonte chaque effet. Un compteur naïf
// enregistrerait deux présentations pour une seule question affichée. La parade est ici
// explicite et déterministe : une réapparition de la MÊME question moins de
// `STRICT_MODE_GRACE_MS` après sa disparition est traitée comme la CONTINUATION de la même
// présentation, pas comme une nouvelle. Déterministe ⇒ testable avec une horloge injectée,
// contrairement à un `setTimeout` de contournement.

/** Fenêtre en deçà de laquelle une réapparition est une continuation, pas une présentation. */
export const STRICT_MODE_GRACE_MS = 120;

/** Plafond du temps actif par question — miroir de `private.max_active_dwell_ms()`. */
export const MAX_ACTIVE_DWELL_MS = 600000;

const defaultNow = () =>
  (typeof performance !== 'undefined' && typeof performance.now === 'function')
    ? performance.now()
    : Date.now();

const defaultWallClock = () => new Date().toISOString();

/**
 * @param {{now?: () => number, wallClock?: () => string}} [options]
 *   `now` DOIT être monotone. Injectable pour les tests — c'est la seule façon de prouver
 *   le comportement de pause/reprise sans dépendre du temps réel.
 */
export function createQuestionTimer({ now = defaultNow, wallClock = defaultWallClock } = {}) {
  /** @type {Map<string, Object>} état par question */
  const records = new Map();

  /** Question actuellement présentée, ou `null`. */
  let currentId = null;
  /** Instant monotone du début de l'intervalle actif en cours, ou `null` si en pause. */
  let runningSince = null;
  /**
   * Raisons pour lesquelles la question n'est pas réellement visible : onglet caché,
   * modale couvrante, bannière de transition de thème… Un ENSEMBLE et non un booléen :
   * fermer une modale alors que l'onglet est encore caché ne doit pas relancer le compteur.
   */
  const blockers = new Set();
  /** Dernière disparition (question + instant), pour la fenêtre Strict Mode. */
  let lastHidden = null;

  function blank(questionId) {
    return {
      questionId,
      firstShownAt: null,
      lastShownAt: null,
      answeredAt: null,
      activeMs: 0,
      presentationCount: 0,
      changeCount: 0,
      sequenceIndex: null,
      responseState: null,
      answerValue: null,
      hasAnswer: false,
    };
  }

  function get(questionId) {
    if (!records.has(questionId)) records.set(questionId, blank(questionId));
    return records.get(questionId);
  }

  /** Solde l'intervalle en cours dans le cumul de la question courante. */
  function settle() {
    if (currentId == null || runningSince == null) return;
    const delta = now() - runningSince;
    // `Math.max(0, …)` : ceinture et bretelles. Si `now` n'était pas monotone (fallback
    // `Date.now()` sur un très vieux navigateur), un delta négatif ne doit JAMAIS diminuer
    // un cumul — une durée négative en base est une donnée fausse, pas une donnée manquante.
    if (delta > 0) get(currentId).activeMs += delta;
    runningSince = null;
  }

  /** Relance le compteur si, et seulement si, plus rien ne masque la question. */
  function resumeIfVisible() {
    if (currentId != null && runningSince == null && blockers.size === 0) {
      runningSince = now();
    }
  }

  return {
    /**
     * La question devient visible. Idempotent : appelé deux fois de suite pour la même
     * question, le second appel ne fait rien (Strict Mode, re-render).
     * @param {string} questionId
     * @param {{sequenceIndex?: number}} [meta]
     */
    show(questionId, { sequenceIndex } = {}) {
      if (currentId === questionId && runningSince != null) return;   // déjà en cours

      if (currentId != null && currentId !== questionId) this.hide();

      const record = get(questionId);
      if (sequenceIndex != null) record.sequenceIndex = sequenceIndex;

      const isStrictModeRemount =
        lastHidden != null &&
        lastHidden.questionId === questionId &&
        (now() - lastHidden.at) < STRICT_MODE_GRACE_MS;

      if (!isStrictModeRemount) {
        record.presentationCount += 1;
        record.lastShownAt = wallClock();
        if (record.firstShownAt == null) record.firstShownAt = record.lastShownAt;
      }

      currentId = questionId;
      lastHidden = null;
      resumeIfVisible();
    },

    /** La question cesse d'être visible (changement de question, démontage, sortie de page). */
    hide() {
      if (currentId == null) return;
      settle();
      lastHidden = { questionId: currentId, at: now() };
      currentId = null;
    },

    /**
     * Quelque chose masque réellement la question : onglet caché, modale par-dessus.
     * @param {string} reason clé stable ('hidden', 'modal:concept', 'modal:report'…)
     */
    block(reason) {
      const wasEmpty = blockers.size === 0;
      blockers.add(reason);
      if (wasEmpty) settle();     // on solde AVANT de considérer la question masquée
    },

    /** La raison de masquage disparaît. Le compteur ne repart que si plus aucune ne subsiste. */
    unblock(reason) {
      blockers.delete(reason);
      resumeIfVisible();
    },

    /**
     * Enregistre une réponse. Le compte de MODIFICATIONS ne s'incrémente qu'à partir de la
     * deuxième réponse : la première n'est pas un changement d'avis.
     * @param {string} questionId
     * @param {'answered'|'no_opinion'|'dont_know'|'prefer_not_to_answer'} responseState
     * @param {number|null} answerValue
     */
    recordAnswer(questionId, responseState, answerValue = null) {
      const record = get(questionId);
      if (record.hasAnswer) record.changeCount += 1;
      record.hasAnswer = true;
      record.responseState = responseState;
      // « Sans opinion » n'est JAMAIS encodé par un nombre : ni 0, ni 3. Le nombre serait
      // une position que la personne a explicitement refusé d'exprimer.
      record.answerValue = responseState === 'answered' ? answerValue : null;
      record.answeredAt = wallClock();
      // Le temps écoulé jusqu'à la réponse est acquis, même si la question reste affichée
      // (auto-avance différée) : on solde puis on repart d'un intervalle neuf.
      settle();
      resumeIfVisible();
    },

    /**
     * Instantané prêt pour l'ingestion. Ne modifie pas l'état : appelable à tout moment,
     * y compris pendant que la question est encore affichée.
     * @param {string} questionId
     */
    snapshot(questionId) {
      const record = records.get(questionId);
      if (!record) return null;

      // Le temps de l'intervalle EN COURS est inclus sans être soldé : sinon une réponse
      // envoyée pendant que la question est visible perdrait systématiquement les dernières
      // secondes, celles de la décision.
      const pending = (currentId === questionId && runningSince != null)
        ? Math.max(0, now() - runningSince)
        : 0;

      const active = Math.round(record.activeMs + pending);
      const total = (record.firstShownAt && record.answeredAt)
        ? Math.max(0, new Date(record.answeredAt) - new Date(record.firstShownAt))
        : null;

      return {
        question_id: questionId,
        response_state: record.responseState,
        answer_value: record.answerValue,
        first_shown_at: record.firstShownAt,
        last_shown_at: record.lastShownAt,
        answered_at: record.answeredAt,
        // Plafonné côté client ET côté base : deux barrières indépendantes, parce que le
        // client peut être une version ancienne restée en cache.
        active_dwell_ms: Math.min(active, MAX_ACTIVE_DWELL_MS),
        total_elapsed_ms: total == null ? null : Math.round(total),
        presentation_count: record.presentationCount,
        change_count: record.changeCount,
        sequence_index: record.sequenceIndex,
      };
    },

    /** Toutes les questions vues, pour un envoi de fin de passation. */
    snapshotAll() {
      return [...records.keys()].map(id => this.snapshot(id)).filter(Boolean);
    },

    /** Diagnostic (tests, débogage). */
    debugState() {
      return {
        currentId,
        running: runningSince != null,
        blockers: [...blockers],
        tracked: records.size,
      };
    },

    reset() {
      records.clear();
      currentId = null;
      runningSince = null;
      lastHidden = null;
      blockers.clear();
    },
  };
}

/**
 * Instance partagée par l'application. Les tests créent la leur avec une horloge injectée
 * plutôt que de manipuler celle-ci.
 */
export const questionTimer = createQuestionTimer();

/**
 * Branche la pause automatique sur la visibilité de l'onglet.
 * @returns {() => void} fonction de désinscription
 */
export function attachVisibilityPause(timer = questionTimer) {
  if (typeof document === 'undefined') return () => {};

  const onVisibilityChange = () => {
    if (document.visibilityState === 'hidden') timer.block('hidden');
    else timer.unblock('hidden');
  };

  // `pagehide` couvre le cas iOS où `visibilitychange` n'est pas émis de façon fiable
  // lors du passage en arrière-plan.
  const onPageHide = () => timer.block('hidden');
  const onPageShow = () => timer.unblock('hidden');

  document.addEventListener('visibilitychange', onVisibilityChange);
  window.addEventListener('pagehide', onPageHide);
  window.addEventListener('pageshow', onPageShow);

  // État initial : un onglet ouvert en arrière-plan ne doit pas démarrer « visible ».
  if (document.visibilityState === 'hidden') timer.block('hidden');

  return () => {
    document.removeEventListener('visibilitychange', onVisibilityChange);
    window.removeEventListener('pagehide', onPageHide);
    window.removeEventListener('pageshow', onPageShow);
  };
}
