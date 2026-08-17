// POLISCOP — Le retrait de consentement doit SURVIVRE à une panne réseau,
//            et ne jamais être annoncé comme fait tant qu'il ne l'est pas.
//
// DÉFAUT CORRIGÉ (P0-B3, 2026-08-10)
// ----------------------------------
// `attemptSession.setConsent()` tentait d'envoyer la décision, avalait toute erreur, et un
// commentaire affirmait qu'elle serait « retentée au prochain changement ». Aucune file
// persistante n'existait, et l'identifiant pseudonyme était effacé localement dans la foulée.
// Le serveur conservait les données, l'interface disait « c'est fait ».
//
// DÉFAUT CORRIGÉ (P0-1, 2026-08-14) — CELUI QUI COMPTE ICI
// -------------------------------------------------------
// La file existait, mais l'état affichable n'avait que deux valeurs : `pending` ou `none`.
// `WITHDRAWAL_STATE.CONFIRMED` était déclaré et jamais retourné. L'interface en déduisait
// « Suppression confirmée par le serveur » par ÉLIMINATION — c'est-à-dire à partir de
// l'ABSENCE d'entrée dans la file. Quatre situations très différentes affichaient donc la
// même confirmation mensongère :
//
//   1. un refus initial, alors que rien n'avait jamais été collecté ni transmis ;
//   2. une demande qui n'a jamais pu être mise en file (stockage indisponible) ;
//   3. une demande sans sujet, que le serveur n'aurait de toute façon pas pu exécuter ;
//   4. une lecture faite avant que la tombstone n'ait été écrite (course `setTimeout(0)`).
//
// RÈGLE DÉSORMAIS : une confirmation est une PREUVE POSITIVE, jamais une déduction. Elle est
// écrite dans un reçu dédié — `poliscop_withdrawal_receipts` — au moment où le transport
// répond 2xx, et elle porte l'identifiant de la demande, la finalité, le sujet et la date.
// L'absence d'entrée dans la file ne prouve rien et ne produit plus aucun message.
//
// PRINCIPE INCHANGÉ : on n'efface l'identifiant qu'APRÈS confirmation du serveur. Entre-temps
// il vit dans une TOMBSTONE — une entrée dédiée à la suppression, jamais réutilisable pour
// collecter. C'est une clé distincte, précisément pour qu'aucun chemin de collecte ne puisse
// la relire par erreur.

/** Clé de la file de retraits en attente de confirmation. */
export const TOMBSTONE_KEY = 'poliscop_withdrawal_pending';

/**
 * Clé des REÇUS de confirmation. Séparée de la file, et c'est le cœur du correctif : tant
 * que la confirmation se déduisait de l'absence d'entrée, une file vide pour une bonne
 * raison (rien à supprimer) et une file vide pour une mauvaise (écriture impossible)
 * produisaient le même message.
 */
export const RECEIPT_KEY = 'poliscop_withdrawal_receipts';

/**
 * États affichables. Ne JAMAIS afficher « supprimé » sans reçu.
 *
 * Chacun correspond à une phrase différente à l'écran, parce que chacun correspond à une
 * situation différente pour la personne concernée.
 */
export const WITHDRAWAL_STATE = Object.freeze({
  /**
   * Rien n'a jamais été demandé ni confirmé pour cette finalité : soit la collecte n'a
   * jamais été autorisée (refus initial), soit aucune donnée n'avait été transmise. Il n'y
   * a RIEN à supprimer, et l'interface ne doit pas parler de suppression.
   */
  NONE: 'none',
  /** Demande enregistrée durablement, aucune tentative d'envoi encore effectuée. */
  REQUESTED: 'requested',
  /** Au moins une tentative a échoué ; la demande reste en file et sera rejouée. */
  PENDING: 'pending',
  /** Le serveur a répondu 2xx POUR CETTE DEMANDE. Seul état autorisant « supprimé ». */
  CONFIRMED: 'confirmed',
  /**
   * Le stockage local est indisponible : la demande n'a PAS pu être rendue durable. Elle ne
   * sera pas rejouée après un rechargement, et l'interface doit le dire au lieu de promettre
   * une reprise automatique qui n'aura pas lieu.
   */
  UNPERSISTED: 'unpersisted',
});

const randomRequestId = () => {
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
 * Le stockage accepte-t-il RÉELLEMENT une écriture ?
 *
 * `typeof localStorage !== 'undefined'` ne suffit pas : Safari en navigation privée expose
 * l'objet et lève à l'écriture. Sans cette sonde, une demande de suppression était annoncée
 * comme « rejouée au retour du réseau » alors qu'elle disparaissait à la fermeture de l'onglet.
 */
export function storageIsWritable(storage) {
  if (!storage) return false;
  try {
    storage.setItem('__poliscop_withdrawal_probe__', '1');
    storage.removeItem('__poliscop_withdrawal_probe__');
    return true;
  } catch {
    return false;
  }
}

function readList(storage, key) {
  try {
    const raw = storage?.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(e => e && typeof e === 'object') : [];
  } catch {
    return [];
  }
}

/** @returns {boolean} l'écriture a-t-elle RÉUSSI ? Le booléen est la moitié utile. */
function writeList(storage, key, entries) {
  try {
    if (entries.length === 0) storage?.removeItem(key);
    else storage?.setItem(key, JSON.stringify(entries));
    return true;
  } catch {
    return false;
  }
}

const readAll = storage => readList(storage, TOMBSTONE_KEY);

/**
 * Durée de vie LOCALE d'un reçu. Bornée et documentée à dessein.
 *
 * Ce reçu n'est PAS la preuve opposable — celle-ci vit dans le journal append-only du
 * serveur, `private.consent_records`. Il n'existe que pour pouvoir répondre honnêtement à
 * l'écran, plus tard, à « ma suppression a-t-elle abouti ? ». Passé ce délai, l'interface
 * revient à `none` : elle ne prétend plus rien, plutôt que d'afficher une confirmation dont
 * elle ne peut plus dire à quoi elle se rapportait.
 */
export const RECEIPT_MAX_AGE_MS = 90 * 24 * 60 * 60 * 1000;   // 90 jours

/**
 * Reçu MINIMAL. Rien de plus n'est conservé, et c'est le cœur du correctif P0-4.
 *
 * ⚠ CE QUI EN A ÉTÉ RETIRÉ : `subject` et `record`. Le reçu survit précisément à
 * l'effacement du pseudonyme — c'est sa raison d'être. Y garder ce pseudonyme, ou
 * l'enregistrement complet de la décision, laissait sur le terminal un identifiant rattachable
 * aux opinions, alors que la même interface affirme dans la phrase d'à côté que « les
 * identifiants déposés sur cet appareil sont effacés ». La promesse et le stockage se
 * contredisaient.
 *
 * `requestId` suffit à rattacher la confirmation à SA demande : c'est un identifiant de
 * demande, tiré au hasard, qui ne désigne ni une personne ni un terminal.
 */
function recuMinimal(entry, confirmedAt) {
  return {
    requestId:   entry.requestId ?? null,
    purpose:     entry.purpose,
    requestedAt: entry.requestedAt ?? null,
    confirmedAt,
    attempts:    (entry.attempts ?? 0) + 1,
  };
}

/**
 * Relit les reçus en les NETTOYANT : les reçus écrits par la version précédente portaient un
 * `subject` (et parfois le record complet). Les lire sans les purger laisserait le pseudonyme
 * sur le terminal indéfiniment — la correction ne servirait qu'aux nouveaux reçus.
 *
 * Applique aussi les deux bornes : un seul reçu par finalité, et pas au-delà de l'âge maximal.
 */
function readReceipts(storage, { now = Date.now() } = {}) {
  const bruts = readList(storage, RECEIPT_KEY);
  const parFinalite = new Map();
  let doitReecrire = false;

  for (const r of bruts) {
    if (!r?.purpose) { doitReecrire = true; continue; }
    if ('subject' in r || 'record' in r || 'anonymousSessionId' in r) doitReecrire = true;
    const age = r.confirmedAt ? now - Date.parse(r.confirmedAt) : Number.NaN;
    if (Number.isFinite(age) && age > RECEIPT_MAX_AGE_MS) { doitReecrire = true; continue; }

    const propre = {
      requestId:   r.requestId ?? null,
      purpose:     r.purpose,
      requestedAt: r.requestedAt ?? null,
      confirmedAt: r.confirmedAt ?? null,
      attempts:    r.attempts ?? 0,
    };
    // Un seul reçu par finalité : le plus récent gagne.
    const existant = parFinalite.get(r.purpose);
    if (existant) doitReecrire = true;
    if (!existant || String(propre.confirmedAt ?? '') >= String(existant.confirmedAt ?? '')) {
      parFinalite.set(r.purpose, propre);
    }
  }

  const propres = [...parFinalite.values()];
  if (doitReecrire) writeList(storage, RECEIPT_KEY, propres);
  return propres;
}

/**
 * Le sujet technique porté par un enregistrement de décision.
 *
 * ⚠ Une tombstone SANS sujet est inutilisable : le serveur ne saurait pas quoi supprimer.
 * En mettre une en file donnerait une « suppression en cours » qui ne peut aboutir — un
 * mensonge à retardement. On refuse plutôt d'enregistrer la demande.
 */
export function subjectOf(record) {
  const anon = record?.anonymous_session_id ?? null;
  const user = record?.user_id ?? null;
  if (anon != null) return { kind: 'anonymous_session_id', value: anon };
  if (user != null) return { kind: 'user_id', value: user };
  return null;
}

/**
 * Enregistre un retrait à confirmer.
 *
 * ⚠ L'identifiant est CONSERVÉ ici, et seulement ici. Il n'est plus utilisable pour
 * collecter — aucun chemin de collecte ne lit cette clé — mais sans lui, la demande de
 * suppression ne pourrait plus jamais être formulée après un rechargement.
 *
 * @returns {{ok: boolean, reason: string|null, persisted: boolean, requestId: string|null,
 *            state: string, entries: Array}}
 */
export function enqueueWithdrawal(storage, { purpose, record, requestedAt, requestId } = {}) {
  const entries = readAll(storage);
  if (!purpose || !record) {
    return { ok: false, reason: 'invalid_request', persisted: false, requestId: null, state: WITHDRAWAL_STATE.NONE, entries };
  }

  const subject = subjectOf(record);
  if (!subject) {
    // Pas de sujet ⇒ pas de demande. Ce n'est pas un échec technique : c'est le cas d'un
    // refus initial, où il n'existe aucun corpus à supprimer. Voir `consent.js`.
    return { ok: false, reason: 'no_subject', persisted: false, requestId: null, state: WITHDRAWAL_STATE.NONE, entries };
  }

  const id = requestId ?? randomRequestId();
  // Une seule entrée par (finalité, sujet) : redemander deux fois la même suppression ne la
  // rend pas plus vraie, et ferait grossir la file indéfiniment hors ligne.
  const cle = e => `${e.purpose}::${e.subject?.value ?? e.anonymousSessionId ?? ''}`;
  const nouvelle = {
    requestId: id,
    purpose,
    subject,
    // Conservé pour les files écrites par la version précédente, qui ne connaissait que ce champ.
    anonymousSessionId: record.anonymous_session_id ?? null,
    record,
    requestedAt: requestedAt ?? new Date().toISOString(),
    attempts: 0,
  };
  const suivantes = [...entries.filter(e => cle(e) !== cle(nouvelle)), nouvelle];
  const persisted = writeList(storage, TOMBSTONE_KEY, suivantes);

  return {
    ok: true,
    reason: null,
    persisted,
    requestId: id,
    // Sans persistance, l'entrée n'existe que dans ce processus : on ne promet pas de rejeu.
    state: persisted ? WITHDRAWAL_STATE.REQUESTED : WITHDRAWAL_STATE.UNPERSISTED,
    entries: suivantes,
  };
}

/** Retraits encore non confirmés. */
export function pendingWithdrawals(storage) {
  return readAll(storage);
}

/** Reçus de confirmation déjà obtenus. */
export function withdrawalReceipts(storage) {
  return readReceipts(storage);
}

/**
 * État à afficher, dérivé de PREUVES : une entrée en file, ou un reçu.
 *
 * ⚠ Ne déduit JAMAIS une confirmation de l'absence d'entrée. Une file vide sans reçu rend
 * `NONE` — « rien à supprimer » — et l'interface doit alors parler de refus, pas de
 * suppression.
 *
 * @returns {{state: string, purpose: string|null, requestId: string|null,
 *            requestedAt: string|null, confirmedAt: string|null, attempts: number,
 *            subject: {kind: string, value: string}|null, storageAvailable: boolean}}
 */
export function withdrawalState(storage, { purpose } = {}) {
  const storageAvailable = storageIsWritable(storage);
  const filtre = list => (purpose ? list.filter(e => e.purpose === purpose) : list);

  const attente = filtre(readAll(storage));
  if (attente.length > 0) {
    // La plus récente demande fait foi : c'est elle qui décrit ce que la personne attend.
    const e = attente[attente.length - 1];
    return {
      state: (e.attempts ?? 0) > 0 ? WITHDRAWAL_STATE.PENDING : WITHDRAWAL_STATE.REQUESTED,
      purpose: e.purpose ?? purpose ?? null,
      requestId: e.requestId ?? null,
      requestedAt: e.requestedAt ?? null,
      confirmedAt: null,
      attempts: e.attempts ?? 0,
      subject: e.subject ?? null,
      storageAvailable,
    };
  }

  const recus = filtre(readReceipts(storage));
  if (recus.length > 0) {
    const r = recus[recus.length - 1];
    return {
      state: WITHDRAWAL_STATE.CONFIRMED,
      purpose: r.purpose ?? purpose ?? null,
      requestId: r.requestId ?? null,
      requestedAt: r.requestedAt ?? null,
      confirmedAt: r.confirmedAt ?? null,
      attempts: r.attempts ?? 0,
      // Le reçu ne porte AUCUN sujet : il survit à l'effacement du pseudonyme.
      subject: null,
      storageAvailable,
    };
  }

  return {
    state: WITHDRAWAL_STATE.NONE,
    purpose: purpose ?? null,
    requestId: null,
    requestedAt: null,
    confirmedAt: null,
    attempts: 0,
    subject: null,
    storageAvailable,
  };
}

/**
 * Rejoue les retraits en attente.
 *
 * ⚠ Une entrée n'est retirée de la file QUE sur confirmation explicite du transport, et sa
 * sortie s'accompagne TOUJOURS de l'écriture d'un reçu. Un transport qui échoue, qui lève,
 * ou qui répond autre chose que `true` laisse la tombstone en place : c'est la seule façon
 * d'éviter d'annoncer une suppression qui n'a pas eu lieu.
 *
 * Une réponse ambiguë (`undefined`, un objet, une chaîne) vaut ÉCHEC. Le contrat est
 * `=== true`, pas « valeur véridique » : `Promise.resolve({})` est véridique et ne prouve rien.
 *
 * @param {Function} transport  async (record) => boolean — `true` seulement sur réponse 2xx
 * @param {{now?: () => string}} [options]
 * @returns {Promise<{confirmed: number, remaining: number, receipts: Array}>}
 */
export async function replayWithdrawals(storage, transport, { now = () => new Date().toISOString() } = {}) {
  const entries = readAll(storage);
  if (entries.length === 0) return { confirmed: 0, remaining: 0, receipts: [] };

  const restantes = [];
  const nouveauxRecus = [];

  for (const entry of entries) {
    let ok = false;
    try {
      ok = (await transport(entry.record)) === true;
    } catch {
      ok = false;
    }
    if (ok) {
      // ⚠ Reçu MINIMAL : ni pseudonyme, ni compte, ni enregistrement complet. Voir
      // `recuMinimal()` — le reçu survit à l'effacement du pseudonyme, donc il ne doit pas
      // le contenir.
      nouveauxRecus.push(recuMinimal(entry, now()));
    } else {
      restantes.push({ ...entry, attempts: (entry.attempts ?? 0) + 1 });
    }
  }

  writeList(storage, TOMBSTONE_KEY, restantes);
  if (nouveauxRecus.length > 0) {
    // Un reçu par (finalité, demande). Une nouvelle demande sur la même finalité remplace le
    // reçu précédent : deux retraits distincts ne partagent jamais leur confirmation.
    const anciens = readReceipts(storage)
      .filter(r => !nouveauxRecus.some(n => n.purpose === r.purpose));
    writeList(storage, RECEIPT_KEY, [...anciens, ...nouveauxRecus]);
  }

  return { confirmed: nouveauxRecus.length, remaining: restantes.length, receipts: nouveauxRecus };
}

/**
 * Invalide le reçu d'une finalité — à appeler dès qu'une NOUVELLE décision est prise sur elle.
 *
 * Sans cela, quelqu'un qui retire, obtient sa confirmation, puis réautorise la collecte,
 * garderait à l'écran « Suppression confirmée le … » à côté d'un consentement en cours : la
 * confirmation porterait sur un état révolu.
 */
export function dropReceipt(storage, purpose) {
  const restants = readReceipts(storage).filter(r => r.purpose !== purpose);
  return writeList(storage, RECEIPT_KEY, restants);
}

/** Vide la file ET les reçus — réservé aux tests et à une purge locale explicite. */
export function clearWithdrawals(storage) {
  writeList(storage, TOMBSTONE_KEY, []);
  writeList(storage, RECEIPT_KEY, []);
}
