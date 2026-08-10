// POLISCOP — Transport vers l'Edge Function d'ingestion.
//
// Le frontend n'écrit JAMAIS directement dans les tables de collecte : il POSTe une
// enveloppe `{protocol_version, type, payload}` sur `/functions/v1/ingest`, qui valide,
// limite le débit, revérifie le consentement en base, puis écrit avec la clé
// `service_role` — laquelle ne quitte jamais l'environnement de la fonction.
//
// Le module est SILENCIEUX par défaut si Supabase n'est pas configuré : l'application
// tourne intégralement en mode invité, exactement comme aujourd'hui.

import { PROTOCOL_VERSION } from '../../supabase/functions/_shared/protocol.js';

const env = (key) => {
  try { return import.meta.env?.[key]; } catch { return undefined; }
};

const SUPABASE_URL = env('VITE_SUPABASE_URL');
const ANON_KEY     = env('VITE_SUPABASE_ANON_KEY');
/** Permet de pointer une fonction déployée ailleurs (préproduction, exécution locale). */
const INGEST_URL   = env('VITE_INGEST_URL')
  || (SUPABASE_URL ? `${String(SUPABASE_URL).replace(/\/$/, '')}/functions/v1/ingest` : null);

export const isIngestEnabled = Boolean(INGEST_URL);

/** Version du client, transmise pour pouvoir corréler un défaut de mesure à une release. */
export const CLIENT_RELEASE = env('VITE_CLIENT_RELEASE') || 'dev';

export class IngestError extends Error {
  constructor(message, { status, code } = {}) {
    super(message);
    this.name = 'IngestError';
    this.status = status ?? null;
    /** `consent_required`, `rate_limited`, `invalid_payload`… */
    this.code = code ?? null;
    // Une erreur DÉFINITIVE ne doit pas être réessayée en boucle : un payload invalide le
    // restera, et un refus pour absence de consentement aussi. Seules les pannes et la
    // limitation de débit méritent un nouvel essai.
    this.retryable = !['consent_required', 'invalid_payload', 'origin_not_allowed'].includes(this.code);
  }
}

/**
 * Envoie une enveloppe. Rejette en cas d'échec — la file de mutations s'appuie sur ce
 * contrat pour décider de remettre en attente ou de considérer l'écriture acquise.
 *
 * @param {'consent'|'attempt'|'responses'|'report'} type
 * @param {Object} payload
 * @returns {Promise<Object>} le corps de réponse (`{ok, result}`)
 */
export async function postEnvelope(type, payload, { signal } = {}) {
  if (!isIngestEnabled) {
    // Pas d'erreur : l'absence de backend est un mode de fonctionnement prévu, pas une
    // panne. Retourner un résultat neutre évite de faire échouer la file en mode invité.
    return { ok: false, skipped: 'ingest_disabled' };
  }

  const headers = { 'Content-Type': 'application/json' };
  // `verify_jwt = false` rend l'en-tête facultatif ; on l'envoie quand même pour rester
  // conforme au routage standard de la passerelle Supabase.
  if (ANON_KEY) {
    headers.apikey = ANON_KEY;
    headers.Authorization = `Bearer ${ANON_KEY}`;
  }

  let response;
  try {
    response = await fetch(INGEST_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({ protocol_version: PROTOCOL_VERSION, type, payload }),
      signal,
      // Pas de cookie : l'ingestion est anonyme et ne doit pas emporter de session.
      credentials: 'omit',
      // Pas de `keepalive` ici : il plafonne le corps à 64 Kio, alors qu'un lot de fin de
      // passation peut le dépasser. La fermeture de page a son propre chemin (`beaconEnvelope`).
    });
  } catch (cause) {
    // Coupure réseau : rejetable et RÉESSAYABLE. La file conserve la mutation.
    throw new IngestError(`réseau indisponible : ${cause?.message ?? cause}`, { code: 'network' });
  }

  if (!response.ok) {
    let body = {};
    try { body = await response.json(); } catch { /* corps non JSON */ }
    throw new IngestError(
      body?.detail || body?.error || `HTTP ${response.status}`,
      { status: response.status, code: body?.error ?? null },
    );
  }

  return response.json();
}

/**
 * Dernière tentative à la fermeture de la page.
 *
 * ⚠ `sendBeacon` retourne `true` quand le navigateur a ACCEPTÉ de mettre la requête en
 * file — pas quand le serveur l'a reçue. Aucune interface ne doit donc afficher « envoyé »
 * sur la foi de ce retour. Le nom `queued` plutôt que `sent` est délibéré.
 */
export function beaconEnvelope(type, payload) {
  if (!isIngestEnabled) return false;
  if (typeof navigator === 'undefined' || typeof navigator.sendBeacon !== 'function') return false;

  try {
    // `text/plain` et non `application/json` : c'est un type SÛR au sens CORS, donc sans
    // requête préliminaire. Un Blob `application/json` en déclencherait une — et
    // `sendBeacon` est incapable d'en émettre pendant le déchargement de la page : l'envoi
    // échouerait systématiquement, silencieusement. L'Edge Function lit le corps en texte
    // puis le désérialise, elle ne se fie pas à l'en-tête.
    const blob = new Blob(
      [JSON.stringify({ protocol_version: PROTOCOL_VERSION, type, payload })],
      { type: 'text/plain;charset=UTF-8' },
    );
    return navigator.sendBeacon(INGEST_URL, blob) === true;
  } catch {
    return false;
  }
}
