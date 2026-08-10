// POLISCOP — Edge Function d'ingestion anonyme.
//
// SEUL chemin d'écriture des passations, réponses, consentements et signalements.
// Le frontend ne parle jamais directement aux tables : il POSTe ici.
//
// `verify_jwt = false` (voir supabase/config.toml) : un visiteur non connecté n'a pas de
// JWT, et l'essentiel des passations est anonyme. Les contrôles qui REMPLACENT cette
// vérification sont listés ci-dessous et testés — désactiver `verify_jwt` sans eux serait
// une porte ouverte sur le schéma `private`.
//
//   1. Méthode et CORS      — POST uniquement, origine dans une liste blanche, jamais `*`
//   2. Taille               — plafond vérifié AVANT désérialisation
//   3. Protocole            — version obligatoire, refus si différente
//   4. Allowlist            — types d'événements et champs, liste blanche stricte
//   5. Débit                — fenêtre glissante sur un haché SALÉ (jamais d'IP en clair)
//   6. Consentement         — revérifié EN BASE (private.has_consent) avant toute écriture
//   7. service_role         — lue depuis l'environnement de la fonction, jamais côté client
//
// La clé `SUPABASE_SERVICE_ROLE_KEY` n'est JAMAIS renvoyée, journalisée, ni incluse dans
// une réponse d'erreur : `tests/data/no-service-role-in-bundle.test.mjs` vérifie de plus
// qu'aucune clé de ce type ne peut se retrouver dans le bundle frontend.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import {
  validateEnvelope,
  MAX_PAYLOAD_BYTES,
  byteLength,
} from '../_shared/protocol.js';

// ─── Configuration ───────────────────────────────────────────────────────────

const SUPABASE_URL      = Deno.env.get('SUPABASE_URL') ?? '';
const SERVICE_ROLE_KEY  = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
// Sel de hachage des seaux de débit. SANS LUI, `bucket_key` serait un haché d'IP
// réversible par force brute sur l'espace des adresses IPv4 — donc une IP stockée.
const RATE_LIMIT_SALT   = Deno.env.get('POLISCOP_RATE_LIMIT_SALT') ?? '';

// Liste blanche d'origines. Une origine absente reçoit un refus SANS en-tête CORS.
const ALLOWED_ORIGINS = (Deno.env.get('POLISCOP_ALLOWED_ORIGINS') ??
  'https://poliscop.fr,https://www.poliscop.fr,http://localhost:5173')
  .split(',').map(o => o.trim()).filter(Boolean);

const RATE_LIMIT_MAX_HITS       = Number(Deno.env.get('POLISCOP_RATE_LIMIT_MAX') ?? 120);
const RATE_LIMIT_WINDOW_SECONDS = Number(Deno.env.get('POLISCOP_RATE_LIMIT_WINDOW') ?? 60);

// ─── Utilitaires ─────────────────────────────────────────────────────────────

function corsHeaders(origin: string | null): Record<string, string> {
  // Pas de repli sur `*` : une origine inconnue n'obtient aucun en-tête CORS, donc le
  // navigateur bloque la lecture de la réponse. `Vary: Origin` évite qu'un cache serve
  // les en-têtes d'une origine à une autre.
  if (!origin || !ALLOWED_ORIGINS.includes(origin)) {
    return { 'Vary': 'Origin' };
  }
  return {
    'Access-Control-Allow-Origin':  origin,
    'Access-Control-Allow-Headers': 'content-type, authorization, apikey',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Max-Age':       '86400',
    'Vary': 'Origin',
  };
}

function json(body: unknown, status: number, origin: string | null): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
  });
}

/**
 * Clé de seau : SHA-256 salé de l'adresse source. L'adresse elle-même n'est ni stockée,
 * ni journalisée, ni transmise à Postgres — seul le haché circule.
 */
async function bucketKey(req: Request): Promise<string> {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const data = new TextEncoder().encode(`${RATE_LIMIT_SALT}:${ip}`);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest)).slice(0, 16)
    .map(b => b.toString(16).padStart(2, '0')).join('');
}

// ─── Point d'entrée ──────────────────────────────────────────────────────────

Deno.serve(async (req: Request): Promise<Response> => {
  const origin = req.headers.get('origin');

  // (1) Préflight et méthode.
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders(origin) });
  }
  if (req.method !== 'POST') {
    return json({ error: 'method_not_allowed' }, 405, origin);
  }
  if (!origin || !ALLOWED_ORIGINS.includes(origin)) {
    // Refus explicite plutôt que réponse vide : un déploiement mal configuré doit se voir
    // dans les journaux, pas se manifester par des données manquantes.
    return json({ error: 'origin_not_allowed' }, 403, origin);
  }

  if (!SUPABASE_URL || !SERVICE_ROLE_KEY || !RATE_LIMIT_SALT) {
    // Fail-closed : sans sel, la limitation de débit ne protégerait rien et l'on
    // stockerait un haché d'IP réversible. Mieux vaut refuser de démarrer la collecte.
    console.error('[ingest] configuration incomplète (URL, service_role ou sel absent)');
    return json({ error: 'server_misconfigured' }, 503, origin);
  }

  // (2) Taille — AVANT toute désérialisation. `Content-Length` est un indice, le texte
  // réellement lu est la mesure qui compte : un client peut mentir sur l'en-tête.
  const declared = Number(req.headers.get('content-length') ?? 0);
  if (declared > MAX_PAYLOAD_BYTES) {
    return json({ error: 'payload_too_large' }, 413, origin);
  }

  let raw: string;
  try {
    raw = await req.text();
  } catch {
    return json({ error: 'unreadable_body' }, 400, origin);
  }
  if (byteLength(raw) > MAX_PAYLOAD_BYTES) {
    return json({ error: 'payload_too_large' }, 413, origin);
  }

  let envelope: unknown;
  try {
    envelope = JSON.parse(raw);
  } catch {
    return json({ error: 'invalid_json' }, 400, origin);
  }

  // (3) + (4) Version de protocole, type d'événement, champs : liste blanche stricte.
  const validated = validateEnvelope(envelope);
  if (!validated.ok) {
    return json({ error: 'invalid_payload', detail: validated.error }, 422, origin);
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  // (5) Débit.
  try {
    const key = await bucketKey(req);
    const { data: allowed, error } = await supabase.rpc('ingest_rate_limit_v1', {
      p_bucket_key: key,
      p_max_hits: RATE_LIMIT_MAX_HITS,
      p_window_seconds: RATE_LIMIT_WINDOW_SECONDS,
    });
    if (error) {
      console.error('[ingest] limitation de débit indisponible :', error.message);
      // Fail-CLOSED : si le compteur est inaccessible, on refuse. Accepter « pour ne pas
      // perdre de données » reviendrait à supprimer la protection au pire moment.
      return json({ error: 'rate_limit_unavailable' }, 503, origin);
    }
    if (allowed === false) {
      return json({ error: 'rate_limited' }, 429, origin);
    }
  } catch (e) {
    console.error('[ingest] erreur de limitation de débit :', String(e));
    return json({ error: 'rate_limit_unavailable' }, 503, origin);
  }

  // (6) Écriture. Le consentement est revérifié DANS la base par private.has_consent() :
  // `ingest_attempt` et `ingest_responses` lèvent `insufficient_privilege` sans lui.
  const { data, error } = await supabase.rpc('ingest_v1', {
    p_type: validated.type,
    p_payload: validated.value,
  });

  if (error) {
    // `42501` = insufficient_privilege : consentement absent. C'est un refus MÉTIER
    // attendu, pas une panne — le client doit le distinguer pour ne pas boucler en retry.
    const consentMissing = error.code === '42501' || /consentement/i.test(error.message ?? '');
    if (consentMissing) {
      return json({ error: 'consent_required' }, 403, origin);
    }
    // Le message brut de Postgres peut contenir des valeurs de ligne : il est journalisé
    // côté serveur, jamais renvoyé au client.
    console.error('[ingest] échec d\'écriture :', error.code, error.message);
    return json({ error: 'ingest_failed' }, 500, origin);
  }

  return json({ ok: true, result: data ?? null }, 200, origin);
});
