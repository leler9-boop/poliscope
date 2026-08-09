import { createClient } from '@supabase/supabase-js';

// `import.meta.env` est injecté par Vite au build, mais n'existe pas sous le ESM natif de
// Node : l'optionnel permet d'importer les modules applicatifs dans les tests d'intégration
// sans navigateur. Sans clés, `isSupabaseEnabled` est false et l'app tourne en mode invité —
// exactement le comportement déjà prévu.
const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env?.VITE_SUPABASE_ANON_KEY;

export const isSupabaseEnabled = Boolean(supabaseUrl && supabaseKey);
export const supabase = isSupabaseEnabled ? createClient(supabaseUrl, supabaseKey) : null;
