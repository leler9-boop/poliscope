import { supabase, isSupabaseEnabled } from './supabase.js';

const ANON_ID_KEY = 'poliscop_anon_id';

// ─── Consentement à la mesure d'audience ─────────────────────────────────────
//
// AVANT : un UUID persistant était écrit dans localStorage dès le premier chargement, puis
// envoyé à Supabase avec le user-agent et la langue du navigateur, sans qu'aucun consentement
// à la mesure d'audience n'ait été demandé. L'absence de contenu politique dans certains
// événements ne règle pas la question : un identifiant persistant déposé sur le terminal
// relève de l'article 82 de la loi Informatique et Libertés (ePrivacy), indépendamment de
// ce qu'on en fait ensuite.
//
// MAINTENANT : fail-closed. Tant que la décision n'est pas positivement enregistrée, aucun
// identifiant n'est créé, aucune session n'est ouverte, aucun événement n'est envoyé.
// `null` = non décidé ⇒ pas de collecte. C'est l'état par défaut au premier chargement.
let _measurementConsent = false;

/** Appelé par useStore.js à chaque changement de consentement et à la réhydratation. */
export function setMeasurementConsent(granted) {
  _measurementConsent = granted === true;
  if (!_measurementConsent) purgeAnonymousId();
}

/** Efface l'identifiant local. Appelé au retrait du consentement et par « Effacer mes données ». */
export function purgeAnonymousId() {
  try { localStorage.removeItem(ANON_ID_KEY); } catch { /* stockage indisponible */ }
}

/**
 * @returns {string|null} identifiant de mesure, ou `null` si la mesure n'est pas consentie.
 * Les appelants DOIVENT traiter le `null` comme « ne rien envoyer ».
 */
export function getOrCreateAnonymousId() {
  if (!_measurementConsent) return null;
  // Safari en navigation privée lève sur tout accès, et Node n'expose pas `localStorage` :
  // sans cette garde, lire l'identifiant pour l'attacher à une preuve de consentement
  // faisait échouer l'enregistrement de la décision elle-même.
  try {
    if (typeof localStorage === 'undefined') return null;
    let id = localStorage.getItem(ANON_ID_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(ANON_ID_KEY, id);
    }
    return id;
  } catch {
    return null;
  }
}

export async function initAnonymousSession() {
  if (!isSupabaseEnabled || !supabase) return;
  const id = getOrCreateAnonymousId();
  if (!id) return;
  // INSERT with ignoreDuplicates — avoids triggering the UPDATE path which is blocked by RLS.
  // last_seen_at is only recorded on first visit; that's acceptable for session tracking.
  // MINIMISATION (2e contre-audit) : `device` (user-agent complet) et `lang` ont été retirés.
  // Le user-agent est un vecteur d'empreinte de terminal, et rien dans le produit n'en dépend ;
  // la langue est déjà portée par les événements qui en ont besoin (`landing_view`,
  // `test_start`). Ne stocker que ce qui est réellement utilisé — le texte de consentement
  // affiché parle d'« écrans, étapes et compteurs », il doit rester exact.
  await supabase.from('anonymous_sessions').insert(
    { id, last_seen_at: new Date().toISOString() },
    { ignoreDuplicates: true }
  );
}

export async function track(event_name, props = {}) {
  if (!isSupabaseEnabled || !supabase) return;
  const anonymous_id = getOrCreateAnonymousId();
  if (!anonymous_id) return; // mesure d'audience non consentie → aucun envoi
  const { user_id, ...rest } = props;
  supabase.from('events').insert({
    anonymous_id,
    user_id: user_id ?? null,
    event_name,
    props: Object.keys(rest).length > 0 ? rest : null,
  }).then(({ error }) => {
    if (error) console.error('[Poliscop] track error:', error.message);
  });
}

export async function mergeAnonymousAnswers(userId) {
  if (!isSupabaseEnabled || !supabase) return;
  const anonymous_id = getOrCreateAnonymousId();
  // Sans identifiant de mesure, il n'y a par construction aucune réponse anonyme à
  // rattacher. Filtrer sur `null` aurait ramené des lignes n'appartenant à personne.
  if (!anonymous_id) return;

  const { data, error } = await supabase
    .from('anonymous_answers')
    .select('question_id, answer_value')
    .eq('anonymous_id', anonymous_id);

  if (error) { console.error('[Poliscop] merge fetch error:', error.message); return; }
  if (!data || data.length === 0) return;

  const rows = data.map(({ question_id, answer_value }) => ({ user_id: userId, question_id, answer_value }));

  const { error: upsertError } = await supabase
    .from('user_answers')
    .upsert(rows, { onConflict: 'user_id,question_id' });

  if (upsertError) { console.error('[Poliscop] merge upsert error:', upsertError.message); return; }

  await supabase.from('anonymous_answers').delete().eq('anonymous_id', anonymous_id);
}
