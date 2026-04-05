import { supabase, isSupabaseEnabled } from './supabase.js';

const ANON_ID_KEY = 'poliscop_anon_id';

export function getOrCreateAnonymousId() {
  let id = localStorage.getItem(ANON_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(ANON_ID_KEY, id);
  }
  return id;
}

export async function initAnonymousSession() {
  if (!isSupabaseEnabled || !supabase) return;
  const id = getOrCreateAnonymousId();
  await supabase.from('anonymous_sessions').upsert(
    { id, last_seen_at: new Date().toISOString(), device: navigator.userAgent, lang: navigator.language },
    { onConflict: 'id' }
  );
}

export async function track(event_name, props = {}) {
  if (!isSupabaseEnabled || !supabase) return;
  const { user_id, ...rest } = props;
  supabase.from('events').insert({
    anonymous_id: getOrCreateAnonymousId(),
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
