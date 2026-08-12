// POLISCOP — Le retrait de consentement doit SURVIVRE à une panne réseau.
//
// DÉFAUT CORRIGÉ (P0-B3)
// ----------------------
// `attemptSession.setConsent()` tentait d'envoyer la décision, avalait toute erreur, et un
// commentaire affirmait qu'elle serait « retentée au prochain changement ». Aucune file
// persistante n'existait, et l'identifiant pseudonyme était effacé localement dans la foulée.
//
// Enchaînement réel : la personne demande la suppression hors ligne → l'envoi échoue en
// silence → l'identifiant disparaît → au rechargement, le client ne sait même plus QUOI
// demander de supprimer. Le serveur conserve les données, l'interface a dit « c'est fait ».
// Le pire des deux mondes : la donnée reste, la trace pour la réclamer est perdue.
//
// PRINCIPE : on n'efface l'identifiant qu'APRÈS confirmation du serveur. Entre-temps il vit
// dans une TOMBSTONE — une entrée dédiée à la suppression, jamais réutilisable pour
// collecter. C'est une clé distincte, précisément pour qu'aucun chemin de collecte ne puisse
// la relire par erreur.

/** Clé de la file de retraits en attente de confirmation. */
export const TOMBSTONE_KEY = 'poliscop_withdrawal_pending';

/** États affichables. Ne JAMAIS afficher « supprimé » sans confirmation du serveur. */
export const WITHDRAWAL_STATE = Object.freeze({
  /** Aucun retrait en cours. */
  NONE: 'none',
  /** Collecte arrêtée localement, suppression serveur demandée mais non confirmée. */
  PENDING: 'pending',
  /** Le serveur a confirmé (2xx). */
  CONFIRMED: 'confirmed',
});

function readAll(storage) {
  try {
    const raw = storage?.getItem(TOMBSTONE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(e => e && typeof e === 'object') : [];
  } catch {
    return [];
  }
}

function writeAll(storage, entries) {
  try {
    if (entries.length === 0) storage?.removeItem(TOMBSTONE_KEY);
    else storage?.setItem(TOMBSTONE_KEY, JSON.stringify(entries));
  } catch { /* stockage indisponible : le retrait local reste appliqué */ }
}

/**
 * Enregistre un retrait à confirmer.
 *
 * ⚠ L'identifiant est CONSERVÉ ici, et seulement ici. Il n'est plus utilisable pour
 * collecter — aucun chemin de collecte ne lit cette clé — mais sans lui, la demande de
 * suppression ne pourrait plus jamais être formulée après un rechargement.
 */
export function enqueueWithdrawal(storage, { purpose, anonymousSessionId, record, requestedAt }) {
  if (!purpose || !record) return readAll(storage);
  const entries = readAll(storage);
  // Une seule entrée par (finalité, identifiant) : redemander deux fois la même suppression
  // ne la rend pas plus vraie, et ferait grossir la file indéfiniment hors ligne.
  const cle = e => `${e.purpose}::${e.anonymousSessionId ?? ''}`;
  const nouvelle = {
    purpose,
    anonymousSessionId: anonymousSessionId ?? null,
    record,
    requestedAt: requestedAt ?? new Date().toISOString(),
    attempts: 0,
  };
  const restantes = entries.filter(e => cle(e) !== cle(nouvelle));
  const suivantes = [...restantes, nouvelle];
  writeAll(storage, suivantes);
  return suivantes;
}

/** Retraits encore non confirmés. */
export function pendingWithdrawals(storage) {
  return readAll(storage);
}

/** État à afficher, dérivé de la file — jamais d'un changement d'état d'interface. */
export function withdrawalState(storage, { purpose } = {}) {
  const entries = readAll(storage);
  const concernees = purpose ? entries.filter(e => e.purpose === purpose) : entries;
  return concernees.length > 0 ? WITHDRAWAL_STATE.PENDING : WITHDRAWAL_STATE.NONE;
}

/**
 * Rejoue les retraits en attente.
 *
 * ⚠ Une entrée n'est retirée de la file QUE sur confirmation explicite du transport. Un
 * transport qui échoue, qui lève, ou qui répond faux laisse la tombstone en place : c'est
 * la seule façon d'éviter d'annoncer une suppression qui n'a pas eu lieu.
 *
 * @param {Function} transport  async (record) => boolean — `true` seulement sur réponse 2xx
 * @returns {Promise<{confirmed: number, remaining: number}>}
 */
export async function replayWithdrawals(storage, transport) {
  const entries = readAll(storage);
  if (entries.length === 0) return { confirmed: 0, remaining: 0 };

  const restantes = [];
  let confirmed = 0;

  for (const entry of entries) {
    let ok = false;
    try {
      ok = (await transport(entry.record)) === true;
    } catch {
      ok = false;
    }
    if (ok) confirmed += 1;
    else restantes.push({ ...entry, attempts: (entry.attempts ?? 0) + 1 });
  }

  writeAll(storage, restantes);
  return { confirmed, remaining: restantes.length };
}

/** Vide la file — réservé aux tests et à une purge locale explicite. */
export function clearWithdrawals(storage) {
  writeAll(storage, []);
}
