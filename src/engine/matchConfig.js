// POLISCOP — Configuration versionnée du matching.
//
// AVANT (audit 2026-08-09) : la logique de veto existait en DEUX exemplaires — dans
// `matcher.js` (6 thèmes) et recopiée dans `src/pages/ElectionDetail.jsx` (5 thèmes, GLOBAL
// oublié). Les deux surfaces produisaient donc des classements différents pour la même
// personne. Un composant React ne doit pas porter de règle métier : ce fichier est la source
// unique, `matcher.js` et `candidateMatch.js` la consomment tous les deux.
//
// ⚠ Ces valeurs sont ÉDITORIALES, pas calibrées sur des données. Elles reflètent un choix
// assumé (amplifier les écarts, modéliser les « dealbreakers ») et doivent être présentées
// comme tel à l'utilisateur. Voir docs/methodology/matching.md.

/**
 * Thèmes « clivants » : un écart important y écrase le score, même si le reste concorde.
 * `threshold` = écart 0–100 au-delà duquel la pénalité démarre.
 * `penalty`   = multiplicateur atteint à l'écart maximal (100). La rampe est linéaire :
 *               pas de falaise, un point de plus ne fait pas basculer brutalement le score.
 * Les pénalités des différents thèmes se multiplient entre elles.
 *
 * DEMOCRACY et ENVIRONMENT restent volontairement hors veto : aucune base suffisante
 * n'a été trouvée pour les y ajouter (décision 2026-07-11).
 */
export const VETO_THEMES = Object.freeze({
  IMMIGRATION:     { threshold: 30, penalty: 0.62 },
  ECONOMY:         { threshold: 30, penalty: 0.72 },
  SOCIAL:          { threshold: 42, penalty: 0.78 },
  SECURITY:        { threshold: 42, penalty: 0.78 },
  PUBLIC_SERVICES: { threshold: 42, penalty: 0.82 },
  GLOBAL:          { threshold: 30, penalty: 0.65 },
});

export const MATCH_CONFIG = Object.freeze({
  /** Exposant appliqué à (1 − distance). Plus il est élevé, plus les écarts sont amplifiés. */
  distanceExponent: 2.4,
  /** Idem pour la composante propre à une élection (17 questions 2027, etc.). */
  electionDistanceExponent: 2.2,
  /** Répartition du score final entre profil global et réponses spécifiques à l'élection. */
  blend: { global: 0.65, election: 0.35 },
  /**
   * Un thème dont le poids utilisateur est nul ne doit PAS pouvoir déclencher un veto :
   * sinon un thème explicitement écarté redevient dominant par une porte dérobée.
   */
  vetoIgnoresZeroWeightThemes: true,
  /**
   * En dessous de ce nombre de thèmes CONNUS DU CÔTÉ CANDIDAT (dérivés de positions
   * approuvées), aucun score public n'est produit. Le candidat sort du classement avec un
   * motif affiché, au lieu d'être noté sur une base trop mince.
   */
  minKnownThemesForScore: 4,

  /**
   * Nombre minimal de positions approuvées et indépendantes pour qu'un THÈME candidat soit
   * considéré comme connu. Une seule prise de position ne résume pas un thème entier.
   * Valeur éditoriale, à réviser quand un corpus réel existera.
   */
  minSourcedPositionsPerTheme: 2,
  /**
   * Écart en points en dessous duquel deux candidats sont déclarés « trop proches pour
   * être départagés ». Versionné : le modifier change ce que l'utilisateur voit.
   */
  tieThreshold: 3,
});

/**
 * Calcule le multiplicateur de veto pour un couple (utilisateur, cible).
 * @param {Object} userThemes    scores 0–100 (ou null si inconnu en v2)
 * @param {Object} targetThemes  scores 0–100
 * @param {Object|null} weightMap poids par thème ; un poids 0 neutralise le veto du thème
 * @returns {{multiplier: number, triggered: Array<{theme: string, distance: number, multiplier: number}>}}
 */
export function computeVeto(userThemes, targetThemes, weightMap = null) {
  let multiplier = 1;
  const triggered = [];

  for (const [theme, cfg] of Object.entries(VETO_THEMES)) {
    if (MATCH_CONFIG.vetoIgnoresZeroWeightThemes && weightMap && weightMap[theme] === 0) continue;

    const u = userThemes?.[theme];
    const t = targetThemes?.[theme];
    // v2 : un thème inconnu ne peut pas fonder un désaccord majeur.
    if (u == null || t == null) continue;

    const distance = Math.abs(u - t);
    if (distance <= cfg.threshold) continue;

    const ramp = (distance - cfg.threshold) / (100 - cfg.threshold); // 0 au seuil → 1 au max
    const m = 1 - ramp * (1 - cfg.penalty);
    multiplier *= m;
    triggered.push({ theme, distance, multiplier: m });
  }

  return { multiplier, triggered };
}
