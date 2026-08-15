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
import {
  enqueueWithdrawal, replayWithdrawals, pendingWithdrawals, withdrawalState,
  WITHDRAWAL_STATE, storageIsWritable,
} from './withdrawalQueue.js';
import {
  canCollectAttemptData, buildConsentDecisions, CONSENT_POLICY_VERSION,
  isGranted, ALL_PURPOSES,
} from './consent.js';
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

/**
 * Lit le pseudonyme d'analyse SANS le créer ni l'effacer.
 *
 * ⚠ Indispensable au retrait. `analyticsSessionId(false, …)` EFFACE l'identifiant et rend
 * `null` : appelée avant de construire la tombstone, elle supprimait le seul élément qui
 * permet au serveur de savoir quoi supprimer. Après un rechargement — donc sans copie en
 * mémoire — la demande de suppression partait sans sujet, et l'interface annonçait quand
 * même « suppression en cours ».
 */
export function readAnalyticsSessionId(storage = typeof localStorage !== 'undefined' ? localStorage : null) {
  try { return storage?.getItem(ANALYTICS_SID_KEY) ?? null; } catch { return null; }
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
  // Transport du CONSENTEMENT, injectable et distinct de celui des réponses : c'est lui
  // qu'on doit pouvoir faire échouer dans un test pour prouver qu'un retrait survit à une
  // panne réseau. Renvoie `true` UNIQUEMENT sur réponse 2xx.
  consentTransport = async (record) => {
    if (!isIngestEnabled) return false;
    await postEnvelope('consent', record);
    return true;
  },
} = {}) {
  const queue = createMutationQueue({ transport });

  let attemptId = null;
  let anonymousSessionId = null;
  let started = false;
  let consentState = null;
  let meta = {};
  const detach = [];

  /**
   * Instant de l'accord à l'analyse politique. `null` tant qu'il n'a pas été donné.
   *
   * Sert de FRONTIÈRE : seul ce qui se produit après cet instant peut être transmis. Une
   * réponse donnée avant reste locale définitivement, même si l'accord arrive ensuite —
   * consentir à une collecte future n'est pas consentir à la divulgation du passé.
   */
  let consentGrantedAt = null;

  /**
   * Écrit la passation sur le terminal.
   *
   * ⚠ CORRECTION P0-5 (2026-08-10). `begin()` appelait ceci sans condition, et le blob
   * contenait un identifiant aléatoire persistant — donc un traceur déposé avant toute
   * décision (art. 82 loi Informatique et Libertés). Le test qui surveillait ce point ne
   * regardait que `poliscop_analytics_sid` et n'appelait jamais `begin()` : l'identifiant
   * passait par l'autre clé. Rien n'est écrit tant que l'analyse politique n'est pas accordée.
   */
  function persistAttempt() {
    if (!canCollectAttemptData(consentState)) return;
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
    /**
     * @param {Object} nextConsentState
     * @param {Object} [options]
     * @param {string[]} [options.changedPurposes] finalités RÉELLEMENT modifiées par ce geste.
     *   ⚠ Par défaut : AUCUNE. Une réhydratation, une reprise de session ou un simple
     *   rafraîchissement d'état ne doivent RIEN réémettre — la version précédente
     *   reconstruisait toutes les décisions connues à chaque appel, ce qui rejouait une
     *   décision ancienne sans rapport avec l'action courante. Les appelants qui prennent
     *   une décision passent la liste explicitement.
     * @returns {Promise<{withdrawals: Array, emitted: Array, skipped: Array,
     *                    storageWritable: boolean}>} résultat EXPLICITE : l'interface s'en
     *   sert pour dire ce qui s'est réellement passé, au lieu de le deviner après un délai.
     */
    async setConsent(nextConsentState, {
      anonymousSessionId: anonId, userId, language,
      changedPurposes = [],
      measurementId = null,
    } = {}) {
      const previousState = consentState;
      const wasAllowed = canCollectAttemptData(consentState);
      const isAllowed  = canCollectAttemptData(nextConsentState);

      // ⚠ LIRE AVANT D'EFFACER. Le pseudonyme est le sujet de la demande de suppression :
      // le lire après `analyticsSessionId(false, …)` reviendrait à demander au serveur
      // d'effacer « rien ».
      const pseudonymeAvant = anonId ?? readAnalyticsSessionId(storage) ?? anonymousSessionId;

      consentState = nextConsentState;
      // L'identifiant est créé à l'acceptation et EFFACÉ au retrait, dans le même geste.
      anonymousSessionId = anonId ?? analyticsSessionId(isAllowed, storage) ?? anonymousSessionId;
      // La frontière temporelle est posée à l'accord, et retirée au retrait.
      if (!wasAllowed && isAllowed) consentGrantedAt = Date.now();
      if (!isAllowed) consentGrantedAt = null;

      const changed = (Array.isArray(changedPurposes) ? changedPurposes : [changedPurposes])
        .filter(p => ALL_PURPOSES.includes(p));

      // La DÉCISION elle-même est enregistrée, accord comme refus : c'est la preuve.
      // ⚠ RETRAIT DURABLE. Un envoi qui échoue n'est PAS « retenté au prochain changement » :
      // il n'y aurait pas forcément de prochain changement, et l'identifiant nécessaire pour
      // formuler la demande aura été effacé entre-temps. Chaque retrait part en file
      // persistante AVANT toute tentative, et n'en sort que sur confirmation du serveur.
      const { records, skipped } = buildConsentDecisions(nextConsentState, {
        // Le retrait doit porter le pseudonyme d'AVANT l'effacement, sinon il n'a pas de sujet.
        anonymousSessionId: pseudonymeAvant,
        userId,
        measurementId,
        purposes: changed,
        language,
        clientRelease: CLIENT_RELEASE,
      });

      const withdrawals = [];
      for (const record of records.filter(r => r.granted === false)) {
        // ⚠ UN REFUS N'EST PAS UN RETRAIT. Une finalité jamais accordée n'a rien produit
        // côté serveur : en faire une demande de suppression fabriquerait une « suppression
        // en cours » portant sur un corpus inexistant, puis une « suppression confirmée »
        // qui ne prouverait rien. La décision est transmise, sans tombstone.
        if (!isGranted(previousState, record.purpose)) {
          try { await consentTransport(record); } catch { /* réémis à la prochaine décision */ }
          withdrawals.push({
            purpose: record.purpose,
            requestId: null,
            state: WITHDRAWAL_STATE.NONE,
            persisted: true,
            reason: 'declined_without_prior_grant',
          });
          continue;
        }
        const issue = enqueueWithdrawal(storage, { purpose: record.purpose, record });
        withdrawals.push({
          purpose: record.purpose,
          requestId: issue.requestId,
          state: issue.state,
          persisted: issue.persisted,
          reason: issue.reason,
        });
      }

      // Une finalité retirée SANS sujet transmissible : rien à demander au serveur, et
      // surtout rien à annoncer comme supprimé. On le remonte tel quel.
      for (const s of skipped.filter(x => x.granted === false)) {
        withdrawals.push({
          purpose: s.purpose,
          requestId: null,
          state: WITHDRAWAL_STATE.NONE,
          persisted: true,
          reason: s.reason,
        });
      }

      // Les ACCORDS peuvent partir directement : leur perte n'efface aucune donnée et sera
      // rejouée par la prochaine décision. Un retrait, lui, ne se rattrape pas.
      const emitted = [];
      for (const record of records.filter(r => r.granted === true)) {
        try {
          await consentTransport(record);
          emitted.push({ purpose: record.purpose, ok: true });
        } catch {
          emitted.push({ purpose: record.purpose, ok: false });
        }
      }
      const replay = await replayWithdrawals(storage, consentTransport);

      if (!isAllowed) {
        // Sans autorisation, aucune passation ne doit rester écrite sur le terminal — y
        // compris celles déposées AVANT le correctif P0-5, qui survivaient sur les appareils
        // déjà visités. Empêcher les nouvelles écritures ne suffit pas : il faut effacer
        // l'identifiant déjà déposé, sinon le traceur reste en place indéfiniment.
        try { storage?.removeItem(ATTEMPT_KEY); } catch { /* stockage indisponible */ }
      }

      if (wasAllowed && !isAllowed) {
        // RETRAIT : on cesse d'émettre ET on vide ce qui attendait. La suppression de ce
        // qui est déjà en base est faite côté serveur par `private.record_consent`.
        queue.clear();
        started = false;
      }

      if (!wasAllowed && isAllowed && attemptId) {
        // Accord donné en cours de passation : la passation est déclarée, et l'état local
        // devient persistable. Les réponses ANTÉRIEURES à l'accord ne sont PAS rejouées.
        //
        // ⚠ CORRECTION P0-5 (2026-08-10). Le code précédent rejouait `timer.snapshotAll()`,
        // c'est-à-dire tout ce qui avait été mesuré avant la décision. Une personne qui
        // répond à dix questions puis accepte voyait partir ses dix réponses, alors qu'elle
        // n'a autorisé la collecte qu'à cet instant. Consentir pour la suite n'est pas
        // consentir pour ce qui précède.
        persistAttempt();
        await this.declareAttempt(meta);
      }

      // Résultat EXPLICITE. L'interface n'a plus à deviner l'issue après un délai : elle
      // attend cette valeur, puis relit la file pour l'état durable.
      return {
        withdrawals: withdrawals.map(w => ({
          ...w,
          // Le rejeu vient de se produire : une demande confirmée à l'instant l'est bien
          // POUR CETTE demande, identifiée par son `requestId`.
          state: replay.receipts.some(r => r.requestId && r.requestId === w.requestId)
            ? WITHDRAWAL_STATE.CONFIRMED
            : w.state,
          confirmedAt: replay.receipts.find(r => r.requestId && r.requestId === w.requestId)?.confirmedAt ?? null,
        })),
        emitted,
        skipped,
        storageWritable: storageIsWritable(storage),
      };
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
      // L'identifiant pseudonyme n'est PAS créé ici : il naît à l'accord, dans setConsent().
      // `attemptId` reste en mémoire tant que rien n'est accordé — persistAttempt() refuse
      // d'écrire sans consentement, donc aucun identifiant ne touche le terminal.
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

      // ⚠ Un retrait demandé hors ligne doit repartir SANS action de l'utilisateur : au
      // démarrage, puis à chaque retour du réseau. Sans cela, la suppression resterait
      // suspendue à une visite ultérieure ET à une nouvelle décision de consentement.
      void replayWithdrawals(storage, consentTransport);
      if (typeof window !== 'undefined') {
        const onOnline = () => { void replayWithdrawals(storage, consentTransport); };
        window.addEventListener('online', onOnline);
        detach.push(() => window.removeEventListener('online', onOnline));
      }

      if (typeof window !== 'undefined') {
        const onUnload = () => this.flushOnUnload();
        window.addEventListener('pagehide', onUnload);
        detach.push(() => window.removeEventListener('pagehide', onUnload));
      }
      return () => { for (const fn of detach.splice(0)) fn(); };
    },

    /** Retraits demandés mais non confirmés par le serveur. */
    pendingWithdrawals() { return pendingWithdrawals(storage); },

    /** État à AFFICHER — dérivé de la file, jamais d'un changement d'état d'interface. */
    withdrawalState(purpose) { return withdrawalState(storage, { purpose }); },

    /** Rejeu, à appeler au retour du réseau et au démarrage. */
    async retryWithdrawals() { return replayWithdrawals(storage, consentTransport); },

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
