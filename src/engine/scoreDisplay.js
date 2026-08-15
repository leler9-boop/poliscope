// POLISCOP — Formatage unique des scores et de la couverture affichés.
//
// POURQUOI
// --------
// Le score de matching était affiché partout suffixé d'un `%`. Or ce n'est pas un
// pourcentage : ni une proportion de positions communes, ni une probabilité, ni une part
// d'un tout. C'est un indice éditorial sur 100 (distance pondérée, amplifiée par un exposant
// 2,4, puis multipliée par des pénalités). Écrire « 78 % de compatibilité » promet une
// mesure qui n'existe pas.
//
// De même, « Profil robuste » (32 réponses) et « Profil très fiable » (64) laissaient
// entendre une fiabilité validée. Rien ne la valide : ces libellés ne décrivent qu'un
// NIVEAU DE DÉTAIL. Voir docs/methodology/validation-roadmap.md.
//
// Toute surface affichant un score doit passer par ce module. Les `%` restant dans le code
// pour des largeurs CSS (`width: 62%`) ne sont pas concernés — ils ne sont pas lus.

/**
 * Indice de proximité, formaté pour l'affichage.
 * @param {number|null} score 0–100, ou null si non calculable
 * @returns {string} par ex. « 78/100 », ou « — » si indéterminé
 */
export function formatProximity(score) {
  if (score == null || !Number.isFinite(score)) return '—';
  return `${Math.round(score)}/100`;
}

/**
 * Largeur CSS d'une barre de progression — un POURCENTAGE VISUEL, pas un score affiché.
 *
 * Le 4e contre-audit a trouvé des barres invisibles : la conversion mécanique vers « /100 »
 * avait remplacé des largeurs par `width: ${formatProximity(x)}`, soit « 67/100 » — une
 * valeur CSS invalide. Les deux contrats sont désormais séparés et testés :
 *
 *   formatProximity(67)   → « 67/100 »   texte lu par l'utilisateur
 *   scoreToCssPercent(67) → « 67% »      géométrie
 *
 * Borné et défensif : `null`, `NaN`, négatif et > 100 produisent une largeur valide plutôt
 * qu'une règle CSS ignorée par le navigateur.
 */
export function scoreToCssPercent(score) {
  const n = Number(score);
  if (!Number.isFinite(n)) return '0%';
  return `${Math.round(Math.max(0, Math.min(100, n)))}%`;
}

/** Version compacte pour les listes denses : « 78 » suivi d'un « /100 » discret. */
export function proximityParts(score) {
  if (score == null || !Number.isFinite(score)) return { value: '—', unit: '' };
  return { value: String(Math.round(score)), unit: '/100' };
}

/** Intitulé du nombre, à placer à côté d'un score. */
export function proximityLabel(lang = 'fr') {
  return lang === 'fr' ? 'indice de proximité' : 'proximity index';
}

/**
 * Motif affiché quand aucun score n'est calculable.
 * Les clés correspondent à `MatchResult.reason` (src/engine/candidateMatch.js).
 */
export function noScoreReason(reason, lang = 'fr') {
  const fr = {
    insufficient_coverage: 'Trop peu de thèmes renseignés pour calculer un indice fiable.',
    no_weighted_theme:     'Tous les thèmes comparables ont un poids nul dans vos priorités.',
    // ⚠ Distinct du précédent : « vous n'avez pas encore répondu » et « vous avez tout mis à
    // zéro » se réparent par des gestes opposés.
    no_user_profile:       'Faites le test pour obtenir cette comparaison.',
    no_comparable_data:    'Aucune donnée comparable pour ce candidat.',
  };
  const en = {
    insufficient_coverage: 'Too few themes answered to compute a meaningful index.',
    no_weighted_theme:     'Every comparable theme has zero weight in your priorities.',
    no_user_profile:       'Take the test to get this comparison.',
    no_comparable_data:    'No comparable data for this candidate.',
  };
  const dict = lang === 'fr' ? fr : en;
  return dict[reason] ?? dict.no_comparable_data;
}

/**
 * Libellé de COUVERTURE — remplace « Profil robuste » / « Profil très fiable ».
 * Décrit combien de questions ont été répondues, sans rien promettre sur la validité.
 * @param {string} confidence clé historique du scorer (very_low → very_high)
 */
export function coverageLabel(confidence, lang = 'fr') {
  const fr = {
    very_low:  'Couverture minimale',
    low:       'Couverture partielle',
    medium:    'Couverture standard',
    high:      'Bonne couverture',
    very_high: 'Couverture complète',
  };
  const en = {
    very_low:  'Minimal coverage',
    low:       'Partial coverage',
    medium:    'Standard coverage',
    high:      'Good coverage',
    very_high: 'Full coverage',
  };
  const dict = lang === 'fr' ? fr : en;
  return dict[confidence] ?? dict.very_low;
}

/** Intitulé de l'indicateur de couverture (remplace « Précision du profil »). */
export function coverageTitle(lang = 'fr') {
  return lang === 'fr' ? 'Couverture du profil' : 'Profile coverage';
}

/**
 * Phrase courte expliquant ce que la couverture mesure — et ce qu'elle ne mesure pas.
 * À afficher au moins une fois par surface qui montre un score.
 */
export function coverageCaption(answered, total, lang = 'fr') {
  return lang === 'fr'
    ? `${answered} question${answered > 1 ? 's' : ''} prise${answered > 1 ? 's' : ''} en compte sur ${total}. La couverture indique le niveau de détail de votre profil, pas sa fiabilité scientifique.`
    : `${answered} of ${total} questions taken into account. Coverage indicates how detailed your profile is, not how scientifically reliable it is.`;
}
