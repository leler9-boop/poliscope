/** Helpers partagés des composants « J'y connais rien » / Poliscop Academy. */

// Contenu FR d'abord : renvoie la langue demandée, sinon le français.
export const L = (field, language) => field?.[language] ?? field?.fr ?? '';

export function formatDate(iso, language) {
  if (!iso) return '';
  try {
    return new Date(iso + 'T00:00:00').toLocaleDateString(
      language === 'fr' ? 'fr-FR' : 'en-GB',
      { day: 'numeric', month: 'long', year: 'numeric' },
    );
  } catch { return iso; }
}

export const DIFFICULTY = {
  1: { fr: 'Découverte', en: 'Beginner', cls: 'bg-emerald-50 border-emerald-200 text-emerald-700' },
  2: { fr: 'Intermédiaire', en: 'Intermediate', cls: 'bg-blue-50 border-blue-200 text-blue-700' },
  3: { fr: 'Avancé', en: 'Advanced', cls: 'bg-purple-50 border-purple-200 text-purple-700' },
};

export const VERDICT_STYLE = {
  vrai: 'bg-emerald-50 border-emerald-200 text-emerald-700',
  faux: 'bg-rose-50 border-rose-200 text-rose-700',
  partiel: 'bg-amber-50 border-amber-200 text-amber-700',
  trompeur: 'bg-orange-50 border-orange-200 text-orange-700',
  'sans-contexte': 'bg-gray-100 border-gray-200 text-gray-600',
};

export const VISION_STYLE = {
  blue:   'bg-blue-50 border-blue-200 text-blue-800',
  purple: 'bg-purple-50 border-purple-200 text-purple-800',
  green:  'bg-emerald-50 border-emerald-200 text-emerald-800',
  amber:  'bg-amber-50 border-amber-200 text-amber-800',
  rose:   'bg-rose-50 border-rose-200 text-rose-800',
};
