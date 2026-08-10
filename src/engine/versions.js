// POLISCOP — Versions des moteurs et des données.
//
// Tout résultat persisté, exporté ou partagé doit embarquer ces versions. Sans elles, un
// ancien résultat devient ininterprétable dès que la méthode change — et rien n'empêche de
// comparer deux scores qui n'ont pas été calculés de la même façon.
//
// Règle : on n'incrémente JAMAIS une version « au passage ». Chaque incrément est une
// décision consignée dans docs/remediation/decisions.md.

/**
 * Banque de questions : incrémenter à tout ajout/retrait/reformulation d'une question active.
 *
 * 2026.08-128q-r2 — révision éditoriale complète, corrigée après contre-audit : 22 questions retirées (composites,
 * tautologiques, non mesurables, quasi-doublons), 22 créées, 93 reformulées. Le nombre de
 * questions actives est inchangé, mais un profil calculé sous 2026.07 ne repose PAS sur les
 * mêmes items : les deux versions ne sont pas comparables item par item.
 *
 * Suffixe -r2 : le contre-audit du 2026-08-10 a établi que 44 questions avaient conservé leur
 * identifiant malgré un changement de population, de seuil, de bénéficiaire ou de dispositif.
 * 38 ont vu leur sens restauré, 6 ont été retirées et remplacées. Voir
 * docs/questions/id-semantics-2026-08.json.
 */
export const QUESTIONNAIRE_VERSION = '2026.08-128q-r2';

/** Algorithme de construction de la file de questions (quotas, ordre, tirage). */
export const QUEUE_ALGORITHM_VERSION = 'v2-seeded';

/** Transformation réponses → scores thématiques. */
export const SCORING_VERSION_V1 = 'v1';   // historique : stretch 0.75, thème vide = 50
export const SCORING_VERSION_V2 = 'v2';   // sans stretch, thème vide = null, couverture séparée

/** Formules des 4 axes dérivés. */
export const AXIS_VERSION = 'v1';

/** Moteur de proximité utilisateur ↔ candidat. */
export const MATCHING_VERSION = 'v1-editorial';

/** Release du jeu de données candidats (profils, statuts, positions). */
export const CANDIDATE_DATA_RELEASE = '2026-08-10';

/** Format des exports JSON. Incrémenter à tout changement de forme non rétrocompatible. */
export const EXPORT_FORMAT_VERSION = '2.0';

/**
 * Bloc de versions à attacher à un résultat.
 * @param {{scoring?: string}} overrides
 */
export function currentVersions({ scoring = SCORING_VERSION_V1 } = {}) {
  return {
    questionnaire: QUESTIONNAIRE_VERSION,
    queueAlgorithm: QUEUE_ALGORITHM_VERSION,
    scoring,
    axis: AXIS_VERSION,
    matching: MATCHING_VERSION,
    candidateData: CANDIDATE_DATA_RELEASE,
  };
}
