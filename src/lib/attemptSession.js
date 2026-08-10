// POLISCOP — Cycle de vie d'une passation.
//
// Colle entre quatre pièces qui, seules, ne suffisent pas :
//   • `consent.js`          — a-t-on le droit de collecter ?
//   • `questionTiming.js`   — combien de temps ACTIF sur chaque question ?
//   • `mutationQueue.js`    — comment envoyer sans perdre ni désordonner ?
//   • `ingestClient.js`     — par où ?
//
// RÈGLE DE FONCTIONNEMENT : rien ne part avant que `political_analytics` ne soit accordé.
// Tant que le consentement n'est pas là, la passation vit en local — le questionnaire
// fonctionne intégralement, c'est la TRANSMISSION qui est suspendue, pas le produit.

import { createMutationQueue, attachOnlineFlush } from './mutationQueue.js';
import { questionTimer, attachVisibilityPause } from './questionTiming.js';
import { postEnvelope, beaconEnvelope, isIngestEnabled, CLIENT_RELEASE } from './ingestClient.js';
import { canCollectAttemptData, buildConsentRecords, CONSENT_POLICY_VERSION } from './consent.js';
import { canonicalMode } from '../data/questions.js';

const ATTEMPT_KEY = 'poliscop_attempt';
/**
 * Identifiant pseudonyme de l'analyse politique.
 *
 * ⚠ DISTINCT de `poliscop_anon_id` (mesure d'audience, `src/lib/anonymous.js`), et ce
 * n'est pas un détail d'implémentation. Réutiliser le même identifiant pour les deux
 * relierait le parcours de navigation aux opinions : le traceur d'audience deviendrait
 * rétroactivement un traceur d'opinions politiques, c'est-à-dire une donnée de l'article 9
 * du RGPD. Deux finalités, deux identifiants, deux consentements.
 */
const ANALYTICS_SID_KEY = 'poliscop_analytics_sid';

const randomUuid = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  const hex = '0123456789abcdef';
  let out = '';
  for (let i = 0; i < 36; i++) {
    if (i === 8 || i === 13 || i === 18 || i === 23) out += '-';
    else if (i === 14) out += '4';
    else out += hex[Math.floor(Math.random() * 16)];
  }
  return out;
};

/**
 * Catégorie d'appareil, dérivée de la LARGEUR DE VIEWPORT — jamais du User-Agent.
 * Un User-Agent est un vecteur d'empreinte de terminal ; trois valeurs de largeur ne le
 * sont pas. Les seuils suivent les points de rupture Tailwind du produit.
 */
export function detectDeviceCategory(width) {
  const w = width ?? (typeof window !== 'undefined' ? window.innerWidth : null);
  // Une largeur nulle ou absente signifie « inconnue » (rendu hors écran, navigateur
  // instrumenté). Renvoyer `null` plutôt que `mobile` : une catégorie inventée fausserait
  // les comparaisons par appareil plus sûrement qu'une donnée manquante.
  if (w == null || w <= 0) return null;
  if (w < 640)  return 'mobile';
  if (w < 1024) return 'tablet';
  return 'desktop';
}

/**
 * Identifiant pseudonyme d'analyse. N'est créé QUE si la finalité est accordée — c'est le
 * même principe fail-closed que pour la mesure d'audience : tant que rien n'est décidé,
 * aucun identifiant persistant n'est déposé sur le terminal (art. 82 loi I&L).
 * @param {boolean} granted
 * @returns {string|null}
 */
export function analyticsSessionId(granted, storage = typeof localStorage !== 'undefined' ? localStorage : null) {
  if (!storage) return null;
  try {
    if (!granted) { storage.removeItem(ANALYTICS_SID_KEY); return null; }
    let id = storage.getItem(ANALYTICS_SID_KEY);
    if (!id) { id = randomUuid(); storage.setItem(ANALYTICS_SID_KEY, id); }
    return id;
  } catch {
    return null;   // stockage indisponible : la passation reste purement locale
  }
}

/** Transport par défaut : un lot de réponses vers l'Edge Function. */
async function defaultTransport({ attemptId, items }) {
  const result = await postEnvelope('responses', { attempt_id: attemptId, items });
  // `skipped` = ingestion désactivée (mode invité). On ne rejette PAS : la file
  // considérerait l'écriture comme échouée et réessaierait indéfiniment.
  if (result?.ok !== true && !result?.skipped) {
    throw new Error('ingestion refusée');
  }
}

export function createAttemptSession({
  transport = defaultTransport,
  timer = questionTimer,
  storage = typeof localStorage !== 'undefined' ? localStorage : null,
} = {}) {
  const queue = createMutationQueue({ transport });

  let attemptId = null;
  let anonymousSessionId = null;
  let started = false;
  let consentState = null;
  let meta = {};
  const detach = [];

  function persistAttempt() {
    try {
      storage?.setItem(ATTEMPT_KEY, JSON.stringify({ attemptId, anonymousSessionId, meta }));
    } catch { /* stockage indisponible */ }
  }

  function restoreAttempt() {
    try {
      const raw = storage?.getItem(ATTEMPT_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch { return null; }
  }

  return {
    queue,
    timer,

    /** Identifiant courant, ou `null` si aucune passation n'est ouverte. */
    get attemptId() { return attemptId; },

    /** Métadonnées de la passation — diagnostic et tests. */
    debugMeta() { return { ...meta }; },

    /**
     * Le consentement change (accord initial, retrait, réhydratation). Point d'entrée
     * UNIQUE : c'est ici que la collecte démarre ou s'arrête réellement.
     */
    async setConsent(nextConsentState, { anonymousSessionId: anonId, userId, language } = {}) {
      const wasAllowed = canCollectAttemptData(consentState);
      const isAllowed  = canCollectAttemptData(nextConsentState);
      consentState = nextConsentState;
      // L'identifiant est créé à l'acceptation et EFFACÉ au retrait, dans le même geste.
      anonymousSessionId = anonId ?? analyticsSessionId(isAllowed, storage) ?? anonymousSessionId;

      // La DÉCISION elle-même est enregistrée, accord comme refus : c'est la preuve.
      if (isIngestEnabled && anonymousSessionId) {
        const records = buildConsentRecords(nextConsentState, {
          anonymousSessionId, userId, language, clientRelease: CLIENT_RELEASE,
        });
        for (const record of records) {
          try { await postEnvelope('consent', record); }
          catch { /* la décision locale prime ; l'envoi sera retenté au prochain changement */ }
        }
      }

      if (wasAllowed && !isAllowed) {
        // RETRAIT : on cesse d'émettre ET on vide ce qui attendait. La suppression de ce
        // qui est déjà en base est faite côté serveur par `private.record_consent`.
        queue.clear();
        started = false;
      }

      if (!wasAllowed && isAllowed && attemptId) {
        // Accord donné en cours de passation : on déclare la passation puis on envoie ce
        // qui a été mesuré depuis le début. Rien n'avait été transmis avant cet instant.
        await this.declareAttempt(meta);
        for (const snapshot of timer.snapshotAll()) {
          if (snapshot.response_state) queue.enqueue(attemptId, snapshot);
        }
      }
    },

    /**
     * Ouvre (ou reprend) une passation. N'ÉMET RIEN par lui-même : `declareAttempt` s'en
     * charge, et uniquement sous consentement.
     */
    begin({ mode, questionnaireVersion, scoringVersion, language, resume = true } = {}) {
      if (resume) {
        const saved = restoreAttempt();
        if (saved?.attemptId && saved.meta?.mode === mode) {
          attemptId = saved.attemptId;
          anonymousSessionId = saved.anonymousSessionId ?? anonymousSessionId;
          meta = saved.meta;
          return attemptId;
        }
      }

      attemptId = randomUuid();
      if (!anonymousSessionId) anonymousSessionId = randomUuid();
      meta = {
        // NORMALISATION obligatoire : un `testMode` persisté par une ancienne version du
        // site vaut `quick` / `medium` / `full`. Envoyés tels quels, ces alias seraient
        // rejetés par la contrainte de `quiz_attempts.mode` — et toute la passation avec.
        mode: canonicalMode(mode) ?? mode,
        questionnaire_version: questionnaireVersion,
        scoring_version: scoringVersion,
        language,
        device_category: detectDeviceCategory(),
        started_at: new Date().toISOString(),
      };
      timer.reset();
      persistAttempt();
      return attemptId;
    },

    /** Déclare la passation au serveur. Sans consentement : ne fait rien, sans erreur. */
    async declareAttempt(extra = {}) {
      if (!attemptId || !canCollectAttemptData(consentState) || !isIngestEnabled) return false;

      const payload = {
        attempt_id: attemptId,
        anonymous_session_id: anonymousSessionId,
        questionnaire_version: meta.questionnaire_version,
        scoring_version: meta.scoring_version,
        mode: meta.mode,
        started_at: meta.started_at,
        last_activity_at: new Date().toISOString(),
        consent_version: CONSENT_POLICY_VERSION,
        client_release: CLIENT_RELEASE,
        ...extra,
      };
      if (meta.language) payload.language = meta.language;
      if (meta.device_category) payload.device_category = meta.device_category;

      try {
        await postEnvelope('attempt', payload);
        started = true;
        return true;
      } catch {
        // Une passation non déclarée fera échouer ses réponses côté serveur (clé étrangère) ;
        // la file les conservera et retentera. Aucune donnée n'est perdue.
        return false;
      }
    },

    /** La question devient visible. */
    showQuestion(questionId, sequenceIndex) {
      timer.show(questionId, { sequenceIndex });
    },

    /** Une modale, une bannière ou l'onglet masque la question. */
    block(reason)   { timer.block(reason); },
    unblock(reason) { timer.unblock(reason); },

    /**
     * Enregistre une réponse. Le chronomètre est mis à jour DANS TOUS LES CAS — la mesure
     * locale ne dépend pas du consentement, seule la transmission en dépend.
     */
    recordAnswer(questionId, responseState, answerValue = null) {
      timer.recordAnswer(questionId, responseState, answerValue);
      if (!attemptId || !canCollectAttemptData(consentState)) return;

      if (!started) { this.declareAttempt(); }
      const snapshot = timer.snapshot(questionId);
      if (snapshot) queue.enqueue(attemptId, snapshot);
    },

    /** Fin de passation : envoi de l'état terminal et vidage de la file. */
    async complete({ answeredCount, shownCount } = {}) {
      timer.hide();
      if (!attemptId || !canCollectAttemptData(consentState)) return;

      await this.declareAttempt({
        completed_at: new Date().toISOString(),
        question_count_answered: answeredCount,
        question_count_shown: shownCount,
      });
      await queue.flush();
    },

    /**
     * Dernière tentative au déchargement de la page.
     * ⚠ Retourne « mis en file par le navigateur », PAS « reçu par le serveur ».
     */
    flushOnUnload() {
      timer.hide();
      return queue.flushOnUnload(payload =>
        beaconEnvelope('responses', { attempt_id: payload.attemptId, items: payload.items }));
    },

    /** Branche les écouteurs globaux. @returns {() => void} désinscription */
    attach() {
      detach.push(attachVisibilityPause(timer));
      detach.push(attachOnlineFlush(queue));
      if (typeof window !== 'undefined') {
        const onUnload = () => this.flushOnUnload();
        window.addEventListener('pagehide', onUnload);
        detach.push(() => window.removeEventListener('pagehide', onUnload));
      }
      return () => { for (const fn of detach.splice(0)) fn(); };
    },

    /** « Effacer mes données » / retrait : plus rien ne subsiste localement. */
    reset() {
      queue.clear();
      timer.reset();
      attemptId = null;
      started = false;
      anonymousSessionId = null;
      try {
        storage?.removeItem(ATTEMPT_KEY);
        // L'identifiant pseudonyme part avec le reste : « effacer mes données » qui laisse
        // le traceur en place n'efface rien de ce qui compte.
        storage?.removeItem(ANALYTICS_SID_KEY);
      } catch { /* stockage indisponible */ }
    },
  };
}

/** Instance partagée par l'application. */
export const attemptSession = createAttemptSession();
