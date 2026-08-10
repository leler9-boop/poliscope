// POLISCOP — File de mutations sérialisée.
//
// CE QU'ELLE REMPLACE
// -------------------
// Un `upsert` indépendant tiré à chaque clic (`useStore.answerQuestion`). Quatre défauts
// structurels, tous reproductibles :
//   • deux requêtes concurrentes se terminent dans un ordre arbitraire — la plus ANCIENNE
//     peut arriver en dernier et écraser le dernier choix de l'utilisateur ;
//   • hors ligne, l'écriture échoue et la réponse est perdue SANS que rien ne l'indique ;
//   • un rejeu réseau applique deux fois la même écriture ;
//   • le profil enregistré ne correspond pas forcément à l'état de réponses envoyé.
//
// GARANTIES APPORTÉES
// -------------------
//   1. UNE SEULE requête en vol à la fois — la sérialisation est la file elle-même ;
//   2. `mutation_id` unique par mutation, index unique côté base ⇒ écriture idempotente ;
//   3. `client_updated_at` transmis et VÉRIFIÉ côté base (une écriture plus ancienne que la
//      ligne stockée est ignorée, voir `private.ingest_responses`) ;
//   4. coalescence par clé : une nouvelle réponse à la même question REMPLACE la précédente
//      en attente, jamais l'inverse ;
//   5. persistance locale : une mutation en attente survit à un rechargement et à une
//      coupure réseau ;
//   6. l'échec est OBSERVABLE (`getStatus().lastError`) et rejouable — jamais avalé.
//
// La file ne connaît ni React ni Supabase : `transport` et `storage` sont injectés. C'est
// ce qui la rend testable sans navigateur.

export const DEFAULT_FLUSH_INTERVAL_MS = 4000;
export const DEFAULT_MAX_BATCH = 50;
/** Repli exponentiel borné : 1 s, 2 s, 4 s… plafonné à 30 s. */
const BACKOFF_BASE_MS = 1000;
const BACKOFF_MAX_MS  = 30000;

const memoryStorage = () => {
  const map = new Map();
  return {
    getItem: k => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => map.set(k, v),
    removeItem: k => map.delete(k),
  };
};

function safeLocalStorage() {
  try {
    if (typeof localStorage === 'undefined') return memoryStorage();
    // Safari en navigation privée lève sur toute écriture : on teste réellement.
    localStorage.setItem('__poliscop_probe__', '1');
    localStorage.removeItem('__poliscop_probe__');
    return localStorage;
  } catch {
    return memoryStorage();
  }
}

const randomUuid = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  // Repli déterministe en forme d'UUID v4 : la base exige ce format.
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
 * @param {Object} options
 * @param {(batch: {attemptId: string, items: Array}) => Promise<void>} options.transport
 *   Envoie un lot. DOIT rejeter en cas d'échec — une promesse résolue vaut accusé de
 *   réception et la file supprime définitivement les mutations concernées.
 * @param {Storage} [options.storage]
 * @param {string}  [options.storageKey]
 * @param {() => number} [options.now]
 */
export function createMutationQueue({
  transport,
  storage = safeLocalStorage(),
  storageKey = 'poliscop_pending_mutations',
  now = () => Date.now(),
  flushIntervalMs = DEFAULT_FLUSH_INTERVAL_MS,
  maxBatch = DEFAULT_MAX_BATCH,
  // Injectable : `globalThis.navigator` est en lecture seule sous Node, et prouver le
  // comportement hors ligne est trop important pour dépendre d'un objet non modifiable.
  isOnline = () => (typeof navigator === 'undefined' ? true : navigator.onLine !== false),
} = {}) {
  /** Mutations en attente, indexées par clé de coalescence. @type {Map<string, Object>} */
  let pending = new Map();
  /** Mutations actuellement en vol. Séparées : une nouvelle saisie ne doit pas les rejoindre. */
  let inflight = new Map();

  let flushing = false;
  let lastError = null;
  let lastSuccessAt = null;
  let consecutiveFailures = 0;
  let timer = null;
  const listeners = new Set();

  // ── Persistance ────────────────────────────────────────────────────────────

  function persist() {
    try {
      // On persiste `pending` ET `inflight` : si l'onglet est fermé pendant un envoi, la
      // mutation en vol n'a peut-être jamais atteint le serveur. La rejouer est sans
      // conséquence (idempotence par `mutation_id`) ; la perdre serait irréversible.
      const all = [...inflight.values(), ...pending.values()];
      storage.setItem(storageKey, JSON.stringify(all));
    } catch {
      // Quota dépassé ou stockage indisponible : la file continue en mémoire. On ne casse
      // pas la passation en cours pour un problème de persistance.
    }
  }

  function restore() {
    try {
      const raw = storage.getItem(storageKey);
      if (!raw) return;
      const items = JSON.parse(raw);
      if (!Array.isArray(items)) return;
      for (const item of items) {
        if (item && item.key) pending.set(item.key, item);
      }
    } catch {
      storage.removeItem(storageKey);
    }
  }

  restore();

  function notify() {
    const status = api.getStatus();
    for (const fn of listeners) {
      try { fn(status); } catch { /* un abonné défaillant ne bloque pas la file */ }
    }
  }

  // ── API ────────────────────────────────────────────────────────────────────

  const api = {
    /**
     * Met une réponse en file.
     * @param {string} attemptId
     * @param {Object} item  instantané issu de `questionTimer.snapshot()`
     */
    enqueue(attemptId, item) {
      if (!attemptId || !item?.question_id) return null;

      // Clé de coalescence : une passation, une question. Une nouvelle réponse à la même
      // question REMPLACE celle en attente — c'est le dernier choix qui compte, et cela
      // borne la taille de la file quel que soit le nombre d'hésitations.
      const key = `${attemptId}:${item.question_id}`;
      const mutation = {
        key,
        attemptId,
        mutation_id: randomUuid(),
        client_updated_at: new Date(now()).toISOString(),
        item,
      };
      pending.set(key, mutation);
      persist();
      notify();
      this.scheduleFlush();
      return mutation.mutation_id;
    },

    /** Programme un envoi différé — regroupe les clics rapprochés en un seul appel réseau. */
    scheduleFlush() {
      if (timer != null || flushing) return;
      const delay = consecutiveFailures > 0
        ? Math.min(BACKOFF_BASE_MS * (2 ** (consecutiveFailures - 1)), BACKOFF_MAX_MS)
        : flushIntervalMs;
      timer = setTimeout(() => { timer = null; this.flush(); }, delay);
      // Ne maintient pas le processus Node en vie dans les tests.
      if (typeof timer?.unref === 'function') timer.unref();
    },

    /**
     * Envoie le lot en attente. Sérialisé : un second appel pendant un envoi ne déclenche
     * pas de requête concurrente, il programme simplement la suite.
     * @returns {Promise<{sent: number, error: Error|null}>}
     */
    async flush() {
      if (flushing) return { sent: 0, error: null };
      if (pending.size === 0) return { sent: 0, error: null };
      if (!isOnline()) {
        // Hors ligne : on ne consomme pas la file. Rien n'est perdu, tout est reprogrammé
        // par l'écouteur `online`.
        return { sent: 0, error: null };
      }

      flushing = true;
      notify();

      // Une passation par lot : `ingest_responses` prend un `attempt_id` unique.
      const first = pending.values().next().value;
      const attemptId = first.attemptId;
      const batch = [];
      for (const [key, mutation] of pending) {
        if (mutation.attemptId !== attemptId) continue;
        if (batch.length >= maxBatch) break;
        batch.push(mutation);
        pending.delete(key);
        inflight.set(key, mutation);
      }
      persist();

      try {
        await transport({
          attemptId,
          items: batch.map(m => ({
            ...m.item,
            mutation_id: m.mutation_id,
            client_updated_at: m.client_updated_at,
          })),
        });

        for (const m of batch) inflight.delete(m.key);
        lastError = null;
        consecutiveFailures = 0;
        lastSuccessAt = now();
        persist();
        return { sent: batch.length, error: null };

      } catch (error) {
        // ⚠ LE POINT CRITIQUE. On remet en file — SAUF si une saisie plus récente est
        // arrivée pendant l'envoi pour la même clé. Sans ce test, un échec ressusciterait
        // une réponse périmée par-dessus le dernier choix de l'utilisateur : exactement le
        // défaut que cette file existe pour corriger.
        for (const m of batch) {
          inflight.delete(m.key);
          if (!pending.has(m.key)) pending.set(m.key, m);
        }
        lastError = error instanceof Error ? error : new Error(String(error));
        consecutiveFailures += 1;
        persist();
        this.scheduleFlush();
        return { sent: 0, error: lastError };

      } finally {
        flushing = false;
        notify();
        if (pending.size > 0) this.scheduleFlush();
      }
    },

    /**
     * Dernière tentative à la fermeture de la page. Retourne `true` si l'envoi a été REMIS
     * au navigateur — jamais « garanti » : `sendBeacon` ne rend aucun compte de la
     * réception, et l'interface ne doit donc rien promettre à l'utilisateur.
     */
    flushOnUnload(sendBeacon) {
      if (pending.size === 0 && inflight.size === 0) return false;
      if (typeof sendBeacon !== 'function') return false;
      const all = [...inflight.values(), ...pending.values()];
      const first = all[0];
      try {
        return sendBeacon({
          attemptId: first.attemptId,
          items: all
            .filter(m => m.attemptId === first.attemptId)
            .map(m => ({ ...m.item, mutation_id: m.mutation_id, client_updated_at: m.client_updated_at })),
        }) === true;
      } catch {
        return false;
      }
    },

    /** Rejeu manuel après une erreur affichée à l'utilisateur. */
    retry() {
      consecutiveFailures = 0;
      lastError = null;
      if (timer != null) { clearTimeout(timer); timer = null; }
      return this.flush();
    },

    getStatus() {
      return {
        pending: pending.size,
        inflight: inflight.size,
        flushing,
        lastError,
        lastSuccessAt,
        consecutiveFailures,
        online: isOnline(),
      };
    },

    subscribe(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },

    /** Purge totale — retrait de consentement, « effacer mes données ». */
    clear() {
      pending = new Map();
      inflight = new Map();
      lastError = null;
      consecutiveFailures = 0;
      if (timer != null) { clearTimeout(timer); timer = null; }
      try { storage.removeItem(storageKey); } catch { /* stockage indisponible */ }
      notify();
    },
  };

  return api;
}

/**
 * Relance la file dès le retour du réseau.
 * @returns {() => void} désinscription
 */
export function attachOnlineFlush(queue) {
  if (typeof window === 'undefined') return () => {};
  const onOnline = () => queue.flush();
  window.addEventListener('online', onOnline);
  return () => window.removeEventListener('online', onOnline);
}
