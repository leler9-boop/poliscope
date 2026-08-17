// POLISCOP — File durable des PREUVES de consentement, et registre des preuves CONFIRMÉES.
//
// DÉFAUT CORRIGÉ (P0-2 du contre-audit du 2026-08-14)
// ---------------------------------------------------
// `setConsent()` envoyait les accords « au fil de l'eau », en avalant l'échec, sous ce
// commentaire : « leur perte n'efface aucune donnée et sera rejouée par la prochaine
// décision ». Cette phrase était devenue fausse le jour même où l'on a cessé de réémettre
// les finalités inchangées (P0-2 du lot précédent) : il n'y a plus de « prochaine décision »
// qui rejoue quoi que ce soit. Un accord donné hors ligne était donc simplement perdu — et
// avec lui la preuve, côté serveur, que la personne avait consenti.
//
// TROIS ÉTATS, TROIS CHOSES DIFFÉRENTES — ne jamais les confondre :
//
//   1. LE CHOIX LOCAL         — ce que la personne a coché. Vit dans le store (`collectionConsent`).
//   2. LA PREUVE CONFIRMÉE    — le serveur a accusé réception de ce choix (2xx). Vit ici.
//   3. L'AUTORISATION D'ÉMETTRE — conséquence des deux : on ne transmet une réponse politique
//      que si le choix est « oui » ET que la preuve est confirmée POUR LE PSEUDONYME COURANT.
//
// Confondre 1 et 3 revenait à envoyer des opinions vers un serveur qui n'a aucune preuve
// recevable de leur consentement — exactement ce que `private.has_consent()` refuse, et donc
// des lots rejetés en boucle, ou pire, acceptés sans preuve.
//
// ⚠ TROIS FILES DISTINCTES, JAMAIS INTERCHANGEABLES :
//   • `poliscop_pending_mutations` — les RÉPONSES (mutationQueue.js) ;
//   • `poliscop_withdrawal_pending` — les SUPPRESSIONS (withdrawalQueue.js) ;
//   • `poliscop_consent_proofs`    — les PREUVES de décision, ici.
// Réutiliser une file pour un autre rôle ferait relire une entrée par un chemin qui ne la
// comprend pas. C'est précisément pour cela que la tombstone a sa propre clé.

import { ALL_PURPOSES } from './consent.js';

/** File des preuves en attente de confirmation serveur. */
export const PROOF_KEY = 'poliscop_consent_proofs';

/**
 * Registre des preuves CONFIRMÉES par le serveur, par finalité.
 *
 * ⚠ Il porte le SUJET, et c'est nécessaire : l'autorisation d'émettre doit être vérifiée
 * pour le pseudonyme COURANT. Une confirmation obtenue pour un pseudonyme effacé puis
 * recréé n'autorise rien. Ce registre disparaît avec le pseudonyme, au retrait — il ne
 * survit donc jamais à ce qu'il décrit, contrairement au reçu de suppression, qui doit
 * survivre et n'a pour cette raison AUCUN identifiant (voir `withdrawalQueue.js`).
 */
export const CONFIRMED_KEY = 'poliscop_consent_confirmed';

/**
 * Borne dure du nombre d'entrées relues. Une file lue depuis le stockage est une entrée
 * NON FIABLE : un autre onglet, une version antérieure ou une main malveillante peuvent
 * l'avoir écrite. Sans borne, un tableau de dix mille entrées bloquerait le démarrage.
 */
export const MAX_PROOFS = 32;

const randomId = () => {
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

/** Sujet technique d'un enregistrement, ou `null`. Une preuve sans sujet ne prouve rien. */
export function subjectValue(record) {
  return record?.anonymous_session_id ?? record?.user_id ?? null;
}

/**
 * Une entrée relue est-elle EXPLOITABLE ? Tout ce qui ne l'est pas est écarté silencieusement
 * — une entrée corrompue ne doit ni faire planter le démarrage, ni être rejouée « au cas où ».
 */
function entreeValide(e) {
  return Boolean(
    e && typeof e === 'object'
    && typeof e.proofId === 'string' && e.proofId.length > 0
    && ALL_PURPOSES.includes(e.purpose)
    && typeof e.granted === 'boolean'
    && Number.isFinite(e.seq)
    && e.record && typeof e.record === 'object'
    && subjectValue(e.record) != null,
  );
}

function readRaw(storage, key) {
  try {
    const raw = storage?.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function write(storage, key, value) {
  try {
    if (value == null) storage?.removeItem(key);
    else storage?.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

/** Preuves en attente, validées, bornées et TRIÉES par ordre de décision. */
export function pendingProofs(storage) {
  const parsed = readRaw(storage, PROOF_KEY);
  if (!Array.isArray(parsed)) return [];
  return parsed
    .filter(entreeValide)
    .sort((a, b) => a.seq - b.seq)
    // On garde les PLUS RÉCENTES : si la file a débordé, l'état courant compte plus que
    // l'historique, et l'historique opposable vit de toute façon côté serveur.
    .slice(-MAX_PROOFS);
}

/** Registre des confirmations, par finalité. */
export function confirmedProofs(storage) {
  const parsed = readRaw(storage, CONFIRMED_KEY);
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
  const out = {};
  for (const [purpose, v] of Object.entries(parsed)) {
    if (!ALL_PURPOSES.includes(purpose)) continue;
    if (!v || typeof v !== 'object') continue;
    if (typeof v.subject !== 'string' || !v.subject) continue;
    out[purpose] = {
      proofId: typeof v.proofId === 'string' ? v.proofId : null,
      subject: v.subject,
      confirmedAt: typeof v.confirmedAt === 'string' ? v.confirmedAt : null,
    };
  }
  return out;
}

/**
 * Une preuve est-elle confirmée pour CE sujet précis ?
 * Un sujet différent — pseudonyme effacé puis recréé — n'autorise rien.
 */
export function proofConfirmedFor(storage, purpose, subject) {
  if (!subject) return null;
  const entry = confirmedProofs(storage)[purpose];
  return entry && entry.subject === subject ? entry : null;
}

/** Écrit (ou remplace) la confirmation d'une finalité. Une seule par finalité. */
export function recordConfirmation(storage, { purpose, subject, proofId, confirmedAt }) {
  const registre = confirmedProofs(storage);
  registre[purpose] = { proofId: proofId ?? null, subject, confirmedAt: confirmedAt ?? new Date().toISOString() };
  return write(storage, CONFIRMED_KEY, registre);
}

/**
 * Retire la confirmation d'une finalité — IMMÉDIATEMENT, au moment de la décision locale.
 *
 * ⚠ Ne pas attendre la confirmation serveur du retrait pour couper l'émission : ce serait
 * continuer à transmettre des opinions pendant toute une panne réseau, alors que la personne
 * a dit non. Le retrait agit localement tout de suite ; sa PREUVE, elle, attend le serveur.
 */
export function revokeConfirmation(storage, purpose) {
  const registre = confirmedProofs(storage);
  if (!(purpose in registre)) return false;
  delete registre[purpose];
  return write(storage, CONFIRMED_KEY, Object.keys(registre).length ? registre : null);
}

/**
 * Retire toute preuve EN ATTENTE pour une finalité.
 *
 * ⚠ Appelé quand un RETRAIT est mis en file : celui-ci vit dans sa propre file (tombstone),
 * donc la supersession interne à `enqueueProof()` ne le voit pas. Sans ce retrait explicite,
 * l'enchaînement « j'accepte hors ligne, je me ravise, le réseau revient » renvoyait l'accord
 * resté en attente : le serveur enregistrait un consentement APRÈS le refus, et la collecte
 * redevenait autorisée par une preuve que la personne avait explicitement reprise.
 */
export function dropPendingProof(storage, purpose) {
  const entries = pendingProofs(storage);
  const restantes = entries.filter(e => e.purpose !== purpose);
  if (restantes.length === entries.length) return false;
  return write(storage, PROOF_KEY, restantes.length ? restantes : null);
}

/** Efface tout — purge locale explicite et tests. */
export function clearProofs(storage) {
  write(storage, PROOF_KEY, null);
  write(storage, CONFIRMED_KEY, null);
}

/**
 * Met une preuve en file AVANT toute tentative d'envoi.
 *
 * ⚠ ORDRE ET SUPERSESSION. Une décision plus récente sur la même finalité REMPLACE la
 * précédente restée en attente. Sans cela, l'enchaînement « j'accepte hors ligne, je me
 * ravise, le réseau revient » rejouerait l'accord après le refus : la collecte redeviendrait
 * autorisée par une preuve que la personne a explicitement reprise.
 *
 * @returns {{ok: boolean, reason: string|null, persisted: boolean, proofId: string|null,
 *            entry: Object|null, entries: Array}}
 */
export function enqueueProof(storage, { purpose, granted, record, proofId, queuedAt } = {}) {
  const entries = pendingProofs(storage);
  if (!ALL_PURPOSES.includes(purpose) || typeof granted !== 'boolean' || !record) {
    return { ok: false, reason: 'invalid_proof', persisted: false, proofId: null, entry: null, entries };
  }
  if (subjectValue(record) == null) {
    // Même règle que pour la tombstone : sans sujet, le serveur ne peut rien rattacher.
    return { ok: false, reason: 'no_subject', persisted: false, proofId: null, entry: null, entries };
  }

  const seq = entries.reduce((max, e) => Math.max(max, e.seq), 0) + 1;
  const entry = {
    proofId: proofId ?? randomId(),
    purpose,
    granted,
    seq,
    record,
    queuedAt: queuedAt ?? new Date().toISOString(),
    attempts: 0,
  };

  const suivantes = [...entries.filter(e => e.purpose !== purpose), entry].slice(-MAX_PROOFS);
  const persisted = write(storage, PROOF_KEY, suivantes);
  return { ok: true, reason: null, persisted, proofId: entry.proofId, entry, entries: suivantes };
}

/**
 * Rejoue les preuves en attente, DANS L'ORDRE des décisions.
 *
 * Une entrée ne sort de la file que sur `=== true`. Une réponse véridique mais non booléenne
 * (`{}`, `'ok'`) ne vaut PAS confirmation : le contrat est strict, parce qu'une confirmation
 * ouvre le droit de transmettre des opinions.
 *
 * ⚠ ARRÊT AU PREMIER ÉCHEC. Poursuivre appliquerait les décisions dans le désordre : un
 * accord postérieur pourrait être confirmé alors que le refus qui le précède est resté en
 * file, et l'autorisation d'émettre serait rétablie à l'envers de la volonté exprimée.
 *
 * @param {Function} transport async (record) => boolean
 * @returns {Promise<{confirmed: Array, remaining: number, blocked: boolean}>}
 */
export async function replayProofs(storage, transport, { now = () => new Date().toISOString() } = {}) {
  const entries = pendingProofs(storage);
  if (entries.length === 0) return { confirmed: [], remaining: 0, blocked: false };

  const confirmed = [];
  let index = 0;
  let blocked = false;

  for (const entry of entries) {
    let ok = false;
    try {
      ok = (await transport(entry.record)) === true;
    } catch {
      ok = false;
    }
    if (!ok) { blocked = true; break; }

    index++;
    const subject = subjectValue(entry.record);
    const confirmedAt = now();
    if (entry.granted) {
      recordConfirmation(storage, { purpose: entry.purpose, subject, proofId: entry.proofId, confirmedAt });
    } else {
      // Un refus confirmé retire l'autorisation. Elle a déjà été retirée localement au moment
      // de la décision ; on le refait ici pour le cas d'une file relue après rechargement.
      revokeConfirmation(storage, entry.purpose);
    }
    confirmed.push({
      proofId: entry.proofId, purpose: entry.purpose, granted: entry.granted, subject, confirmedAt,
    });
  }

  const restantes = entries.slice(index).map(e => (
    blocked && e === entries[index] ? { ...e, attempts: (e.attempts ?? 0) + 1 } : e
  ));
  write(storage, PROOF_KEY, restantes.length ? restantes : null);

  return { confirmed, remaining: restantes.length, blocked };
}
