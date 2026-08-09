// POLISCOP — Registre canonique des personnalités politiques.
//
// POURQUOI CE FICHIER EXISTE
// --------------------------
// Jusqu'à l'audit du 2026-08-09, l'identité d'une personne était encodée directement dans
// `src/data/elections.js`, avec un identifiant différent par élection (`lepen` en 2022,
// `lepen_2027` en 2027). Les clés de `specificQuestions[].positions` utilisaient une
// convention encore différente, ce qui a produit un bug silencieux : Marine Le Pen et
// Jean-Luc Mélenchon avaient 0/17 positions exploitables (le même défaut existait sur
// it_2022 et es_2023). Corrigé, mais la cause racine est l'absence d'identité canonique.
//
// Ce registre est la source de vérité de l'IDENTITÉ (qui est cette personne, quel est son
// statut de candidature, quelles données la concernant sont publiables). Il n'est PAS la
// source de vérité des SCORES — ceux-ci restent dans `elections.js` en attendant la
// reconstruction position par position décrite dans docs/data/candidate-provenance.md.
//
// CONVENTIONS
// -----------
// - `id`             : identifiant canonique, stable dans le temps, indépendant de l'élection.
// - `legacyIds`      : tous les identifiants historiques utilisés dans elections.js,
//                      candidatePolicies.js, candidateDetails.js ou dans des URLs partagées.
//                      Ne JAMAIS en supprimer un : des liens et des exports utilisateurs
//                      les contiennent.
// - `status`         : voir CANDIDACY_STATUS. Un candidat testé dans un sondage n'est PAS
//                      « déclaré » ; un candidat déclaré n'est pas nécessairement comparable.
// - `matchReady`     : true seulement si un profil thématique existe ET que la couverture
//                      documentée est suffisante. Une personne peut figurer à l'annuaire
//                      sans être classée.
// - `profileSource`  : provenance du profil 0–100 affiché. `legacy-manual-v1` = huit nombres
//                      saisis éditorialement, sans preuve par position. Ne pas leur inventer
//                      rétroactivement des sources.
//
// Toute donnée de statut doit porter `statusDate` et `statusSource`.
//
// `statusSource` reste une phrase lisible ; `statusSourceIds` référence les documents
// structurés de `src/data/candidateProvenance.js` (URL, éditeur, niveau de source, dates de
// publication et de vérification). Le contre-audit du 2026-08-09 relevait à juste titre que
// du texte libre n'est ni vérifiable ni exploitable par un programme : c'est `statusSourceIds`
// qui permet à la veille de détecter une source périmée ou contredite.

/** Statuts autorisés — alignés sur prompts/election-watch-2027.md. */
// `isMatchReady()` constate la comparabilité au lieu de la déclarer : elle a besoin des
// positions, des sources et du seuil de couverture versionné.
// Aucun cycle d'import : ni `candidateProfile.js` ni `candidateProvenance.js` ne dépendent
// de ce registre (`candidateMatch.js`, lui, en dépend — d'où le sens unique).
import { deriveCandidateThemes } from '../engine/candidateProfile.js';
import { getPositions, getSource } from './candidateProvenance.js';
import { MATCH_CONFIG } from '../engine/matchConfig.js';

export const CANDIDACY_STATUS = {
  DECLARED: 'declared',                 // déclaration publique officielle
  INVESTED: 'invested',                 // désigné par son parti
  PRIMARY_CANDIDATE: 'primary_candidate', // engagé dans une primaire non tranchée
  CONDITIONAL: 'conditional',           // candidature annoncée sous condition explicite
  POTENTIAL: 'potential',               // pressenti, non déclaré
  CONTINGENCY: 'contingency',           // plan B d'un autre candidat
  WITHDRAWN: 'withdrawn',
  INELIGIBLE: 'ineligible',
  OFFICIALLY_VALIDATED: 'officially_validated', // parrainages validés par le Conseil constitutionnel
};

/** Provenance d'un profil thématique publié. */
export const PROFILE_SOURCE = {
  /** 8 nombres saisis à la main par l'équipe éditoriale, sans preuve par position. */
  LEGACY_MANUAL_V1: 'legacy-manual-v1',
  /** Agrégé depuis des positions sourcées et relues (cible — aucun profil n'y est encore). */
  SOURCED_POSITIONS: 'sourced-positions',
  /** Aucun profil publiable. */
  NONE: 'none',
};

const DEFAULT_2027_STATUS_SOURCE = ['src-lcp-candidats-2027-2026-07-10'];

const CANDIDACY_STATUS_ORDER = {
  [CANDIDACY_STATUS.OFFICIALLY_VALIDATED]: 0,
  [CANDIDACY_STATUS.INVESTED]: 1,
  [CANDIDACY_STATUS.DECLARED]: 2,
  [CANDIDACY_STATUS.PRIMARY_CANDIDATE]: 3,
  [CANDIDACY_STATUS.CONDITIONAL]: 4,
  [CANDIDACY_STATUS.CONTINGENCY]: 5,
  [CANDIDACY_STATUS.POTENTIAL]: 6,
  [CANDIDACY_STATUS.WITHDRAWN]: 7,
  [CANDIDACY_STATUS.INELIGIBLE]: 8,
};

/**
 * Valeurs communes aux personnes suivies pour 2027.
 *
 * programMaturity décrit l'état d'un corpus 2027, pas la quantité d'idées déjà défendues
 * au cours d'une carrière : M0 aucune donnée, M1 orientations générales, M2 propositions
 * thématiques, M3 programme officiel partiel, M4 complet, M5 version électorale archivée.
 */
function tracked2027(entry) {
  return {
    legacyIds: [],
    elections: [],
    trackedFor: ['fr_2027'],
    matchReady: false,
    profileSource: PROFILE_SOURCE.NONE,
    programMaturity: 'M1',
    statusSourceIds: DEFAULT_2027_STATUS_SOURCE,
    lastReviewed: '2026-08-10',
    ...entry,
  };
}

// ─── Registre ────────────────────────────────────────────────────────────────
//
// `elections` liste les scrutins où la personne apparaît DANS l'application.
// Une personne suivie mais absente de l'app a `elections: []` et `matchReady: false`.

export const CANDIDATE_REGISTRY = [
  // ── France — présidentielle 2027 : profils publiés dans l'application ──────
  {
    id: 'marine-le-pen', displayName: 'Marine Le Pen', legacyIds: ['lepen', 'lepen_2027'],
    party: 'Rassemblement National', elections: ['fr_2022', 'fr_2027'],
    status: CANDIDACY_STATUS.DECLARED, statusDate: '2026-07-07',
    statusSource: 'Candidate déclarée le 7 juillet 2026 après l’arrêt d’appel ; l’enquête Ifop des 7–8 juillet mesure cette configuration.',
    statusSourceIds: ['src-lcp-lepen-declaration-2026-07-07', 'src-ifop-intentions-2027-2026-07-08'],
    trackedFor: ['fr_2027'], matchReady: false, profileSource: PROFILE_SOURCE.LEGACY_MANUAL_V1,
    programMaturity: 'M1', lastReviewed: '2026-08-10',
  },
  {
    id: 'edouard-philippe', displayName: 'Édouard Philippe', legacyIds: ['philippe'],
    party: 'Horizons', elections: ['fr_2027'],
    status: CANDIDACY_STATUS.DECLARED, statusDate: '2024-09-03',
    statusSource: 'Candidature annoncée le 3 septembre 2024 ; campagne officiellement lancée à l’été 2026.',
    statusSourceIds: ['src-philippe-campagne-2027', 'src-lcp-candidats-2027-2026-07-10'],
    trackedFor: ['fr_2027'], matchReady: false, profileSource: PROFILE_SOURCE.LEGACY_MANUAL_V1,
    programMaturity: 'M1', programSourceIds: ['src-philippe-campagne-2027'], lastReviewed: '2026-08-10',
  },
  {
    id: 'gabriel-attal', displayName: 'Gabriel Attal', legacyIds: ['attal'],
    party: 'Renaissance', elections: ['fr_2027'],
    status: CANDIDACY_STATUS.DECLARED, statusDate: '2026-05-22',
    statusSource: 'Déclaration à Mur-de-Barrez (Aveyron)',
    statusSourceIds: ['src-attal-campagne-2027', 'src-lcp-candidats-2027-2026-07-10'],
    trackedFor: ['fr_2027'], matchReady: false, profileSource: PROFILE_SOURCE.LEGACY_MANUAL_V1,
    programMaturity: 'M2', programSourceIds: ['src-attal-campagne-2027'], lastReviewed: '2026-08-10',
  },
  {
    id: 'jean-luc-melenchon', displayName: 'Jean-Luc Mélenchon', legacyIds: ['melenchon', 'melenchon_2027'],
    party: 'La France Insoumise', elections: ['fr_2022', 'fr_2027'],
    status: CANDIDACY_STATUS.DECLARED, statusDate: '2026-05-03',
    statusSource: 'Candidature publiquement confirmée ; LFI prépare la version 2027 de L’Avenir en commun.',
    statusSourceIds: ['src-lcp-melenchon-declaration-2026-05-03'],
    trackedFor: ['fr_2027'], matchReady: false, profileSource: PROFILE_SOURCE.LEGACY_MANUAL_V1,
    programMaturity: 'M3', programSourceIds: ['src-lfi-avenir-en-commun-2025', 'src-lfi-programme-2027-contributions'], lastReviewed: '2026-08-10',
  },
  {
    id: 'raphael-glucksmann', displayName: 'Raphaël Glucksmann', legacyIds: ['glucksmann'],
    party: 'Place publique', elections: ['fr_2027'],
    status: CANDIDACY_STATUS.POTENTIAL, statusDate: '2026-07-10',
    statusSource: 'Son entourage indique le 10 juillet 2026 qu’aucun élément ne confirme sa participation à la primaire fermée du PS ; décision annoncée pour le début de l’automne 2026',
    statusSourceIds: ['src-lcp-candidats-2027-2026-07-10'], trackedFor: ['fr_2027'],
    matchReady: false, profileSource: PROFILE_SOURCE.LEGACY_MANUAL_V1, programMaturity: 'M1', lastReviewed: '2026-08-10',
  },
  {
    id: 'marine-tondelier', displayName: 'Marine Tondelier', legacyIds: ['tondelier'],
    party: 'Les Écologistes', elections: ['fr_2027'],
    status: CANDIDACY_STATUS.CONDITIONAL, statusDate: '2026-07-10',
    statusSource: 'Désignée par Les Écologistes, mais le projet de primaire unitaire a été remis en cause après le vote du PS ; nouvelle stratégie annoncée.',
    statusSourceIds: ['src-lcp-candidats-2027-2026-07-10'], trackedFor: ['fr_2027'],
    matchReady: false, profileSource: PROFILE_SOURCE.LEGACY_MANUAL_V1, programMaturity: 'M1', lastReviewed: '2026-08-10',
  },
  {
    id: 'bruno-retailleau', displayName: 'Bruno Retailleau', legacyIds: ['retailleau'],
    party: 'Les Républicains', elections: ['fr_2027'],
    status: CANDIDACY_STATUS.INVESTED, statusDate: '2026-04-19',
    statusSource: 'Désigné candidat de LR par les adhérents les 18 et 19 avril 2026.',
    statusSourceIds: ['src-lr-retailleau-designation-2026-04-20'], trackedFor: ['fr_2027'],
    matchReady: false, profileSource: PROFILE_SOURCE.LEGACY_MANUAL_V1, programMaturity: 'M1', lastReviewed: '2026-08-10',
  },
  {
    id: 'francois-ruffin', displayName: 'François Ruffin', legacyIds: ['ruffin'],
    party: 'Debout !', elections: ['fr_2027'],
    status: CANDIDACY_STATUS.CONDITIONAL, statusDate: '2026-07-10',
    statusSource: 'Avait rejoint le projet de primaire unitaire ; a indiqué qu’il se présenterait seul si cette primaire n’avait pas lieu.',
    statusSourceIds: ['src-lcp-candidats-2027-2026-07-10'], trackedFor: ['fr_2027'],
    matchReady: false, profileSource: PROFILE_SOURCE.LEGACY_MANUAL_V1, programMaturity: 'M1', lastReviewed: '2026-08-10',
  },
  {
    id: 'fabien-roussel', displayName: 'Fabien Roussel', legacyIds: ['roussel', 'roussel_2027'],
    party: 'Parti Communiste Français', elections: ['fr_2022', 'fr_2027'],
    status: CANDIDACY_STATUS.CONDITIONAL, statusDate: '2026-07-05',
    statusSource: 'Réélu à la tête du PCF (congrès de Lille) ; désignation soumise au vote des militants du 6 septembre 2026',
    statusSourceIds: ['src-lcp-candidats-2027-2026-07-10'], trackedFor: ['fr_2027'],
    matchReady: false, profileSource: PROFILE_SOURCE.LEGACY_MANUAL_V1, programMaturity: 'M1', lastReviewed: '2026-08-10',
  },
  {
    id: 'eric-zemmour', displayName: 'Éric Zemmour', legacyIds: ['zemmour', 'zemmour_2027'],
    party: 'Reconquête', elections: ['fr_2022', 'fr_2027'],
    status: CANDIDACY_STATUS.CONDITIONAL, statusDate: '2026-07-10',
    statusSource: 'A indiqué qu’il serait candidat si aucune primaire de la droite n’était organisée, ou candidat à cette primaire si elle avait lieu.',
    statusSourceIds: ['src-lcp-candidats-2027-2026-07-10'], trackedFor: ['fr_2027'],
    matchReady: false, profileSource: PROFILE_SOURCE.LEGACY_MANUAL_V1, programMaturity: 'M1', lastReviewed: '2026-08-10',
  },

  // ── France — présidentielle 2027 : suivis, PAS encore comparables ──────────
  //
  // Ces personnes sont vérifiées et déclarées, mais aucun profil thématique sourcé n'existe
  // pour elles. Conformément à la règle « mieux vaut exclure du matching que publier un score
  // non sourcé », elles apparaissent à l'annuaire et jamais dans le classement.
  {
    id: 'david-lisnard', displayName: 'David Lisnard', legacyIds: [],
    party: 'Nouvelle Énergie', elections: [],
    trackedFor: ['fr_2027'],
    status: CANDIDACY_STATUS.DECLARED, statusDate: '2026-03-31',
    statusSource: 'Candidature officialisée fin mars 2026 ; programme officiel structuré sur le site de Nouvelle Énergie.',
    statusSourceIds: ['src-lcp-candidats-2027-2026-07-10', 'src-lisnard-programme-2027'],
    matchReady: false,
    notMatchReadyReason: 'Aucune position sourcée codée. Programme officiel disponible (maturité M3+) : à coder en priorité — c’est l’absence la plus visible du produit.',
    profileSource: PROFILE_SOURCE.NONE, programMaturity: 'M3',
    programSourceIds: ['src-lisnard-programme-2027'], lastReviewed: '2026-08-10',
  },
  {
    id: 'nicolas-dupont-aignan', displayName: 'Nicolas Dupont-Aignan', legacyIds: [],
    party: 'Debout la France', elections: [],
    trackedFor: ['fr_2027'],
    status: CANDIDACY_STATUS.DECLARED, statusDate: '2025-03-08',
    statusSource: 'Candidature officialisée ; recensée parmi les seize déclarées par LCP.',
    statusSourceIds: ['src-lcp-candidats-2027-2026-07-10'],
    matchReady: false, notMatchReadyReason: 'Aucune position sourcée codée.',
    profileSource: PROFILE_SOURCE.NONE, programMaturity: 'M1', lastReviewed: '2026-08-10',
  },
  {
    id: 'nathalie-arthaud', displayName: 'Nathalie Arthaud', legacyIds: [],
    party: 'Lutte ouvrière', elections: [],
    trackedFor: ['fr_2027'],
    status: CANDIDACY_STATUS.DECLARED, statusDate: '2025-12-08',
    statusSource: 'Candidate annoncée par Lutte ouvrière ; recensée parmi les seize déclarées par LCP.',
    statusSourceIds: ['src-lcp-candidats-2027-2026-07-10'],
    matchReady: false, notMatchReadyReason: 'Aucune position sourcée codée.',
    profileSource: PROFILE_SOURCE.NONE, programMaturity: 'M1', lastReviewed: '2026-08-10',
  },
  {
    id: 'xavier-bertrand', displayName: 'Xavier Bertrand', legacyIds: [],
    party: 'Nous France', elections: [],
    trackedFor: ['fr_2027'],
    status: CANDIDACY_STATUS.DECLARED, statusDate: '2024-02-03',
    statusSource: 'A confirmé son intention de se présenter ; recensé parmi les seize déclarés par LCP.',
    statusSourceIds: ['src-lcp-candidats-2027-2026-07-10'],
    matchReady: false, notMatchReadyReason: 'Aucune position sourcée codée.',
    profileSource: PROFILE_SOURCE.NONE, programMaturity: 'M1', lastReviewed: '2026-08-10',
  },
  {
    id: 'bernard-cazeneuve', displayName: 'Bernard Cazeneuve', legacyIds: [],
    party: 'La Convention', elections: [],
    trackedFor: ['fr_2027'],
    status: CANDIDACY_STATUS.DECLARED, statusDate: '2026-07-16',
    statusSource: 'A présenté sa candidature le 16 juillet 2026 hors primaire socialiste ; site de campagne actif.',
    statusSourceIds: ['src-cazeneuve-candidature-2026-07-16'],
    matchReady: false, notMatchReadyReason: 'Aucune position sourcée codée.',
    profileSource: PROFILE_SOURCE.NONE, programMaturity: 'M1', lastReviewed: '2026-08-10',
  },
  {
    id: 'segolene-royal', displayName: 'Ségolène Royal', legacyIds: [],
    party: 'Parti Socialiste', elections: [],
    trackedFor: ['fr_2027'],
    status: CANDIDACY_STATUS.PRIMARY_CANDIDATE, statusDate: '2026-07-10',
    statusSource: 'Candidate annoncée à la primaire fermée du pôle socialiste ; pas encore candidate désignée pour le premier tour.',
    statusSourceIds: ['src-france24-royal-2026-05-24'],
    matchReady: false, notMatchReadyReason: 'Aucune position sourcée codée.',
    profileSource: PROFILE_SOURCE.NONE, programMaturity: 'M1', lastReviewed: '2026-08-10',
  },
  {
    id: 'dominique-de-villepin', displayName: 'Dominique de Villepin', legacyIds: [],
    party: 'La France humaniste', elections: [],
    trackedFor: ['fr_2027'],
    status: CANDIDACY_STATUS.POTENTIAL, statusDate: '2026-07-10',
    statusSource: 'Prépare une collecte de parrainages mais n’a pas officialisé de candidature.',
    statusSourceIds: ['src-lcp-candidats-2027-2026-07-10'],
    matchReady: false, notMatchReadyReason: 'Non déclaré et aucune position sourcée codée.',
    profileSource: PROFILE_SOURCE.NONE, programMaturity: 'M0', lastReviewed: '2026-08-10',
  },

  // Autres candidatures officialisées dans l'état des lieux LCP du 10 juillet.
  // Lorsque le jour exact de déclaration n'est pas établi, statusDate est une borne haute
  // explicite (statusDatePrecision: on_or_before) et non une fausse date précise.
  tracked2027({
    id: 'delphine-batho', displayName: 'Delphine Batho', party: 'Génération écologie',
    status: CANDIDACY_STATUS.DECLARED, statusDate: '2026-07-10', statusDatePrecision: 'on_or_before',
    statusSource: 'Candidature officialisée au plus tard le 10 juillet 2026.',
  }),
  tracked2027({
    id: 'jerome-guedj', displayName: 'Jérôme Guedj', party: 'Parti Socialiste',
    status: CANDIDACY_STATUS.DECLARED, statusDate: '2026-07-10', statusDatePrecision: 'on_or_before',
    statusSource: 'Candidature officialisée au plus tard le 10 juillet 2026.',
  }),
  tracked2027({
    id: 'karim-bouamrane', displayName: 'Karim Bouamrane', party: 'Parti Socialiste',
    status: CANDIDACY_STATUS.DECLARED, statusDate: '2026-07-10', statusDatePrecision: 'on_or_before',
    statusSource: 'Candidature officialisée au plus tard le 10 juillet 2026.',
  }),
  tracked2027({
    id: 'florian-philippot', displayName: 'Florian Philippot', party: 'Les Patriotes',
    status: CANDIDACY_STATUS.DECLARED, statusDate: '2026-05-09',
    statusSource: 'Candidature officialisée ; recensée parmi les seize déclarées par LCP.',
  }),
  tracked2027({
    id: 'francois-asselineau', displayName: 'François Asselineau', party: 'Union populaire républicaine',
    status: CANDIDACY_STATUS.DECLARED, statusDate: '2026-07-10', statusDatePrecision: 'on_or_before',
    statusSource: 'Candidature officialisée au plus tard le 10 juillet 2026.',
  }),
  tracked2027({
    id: 'clara-egger', displayName: 'Clara Egger', party: 'Solution démocratique',
    status: CANDIDACY_STATUS.DECLARED, statusDate: '2026-07-10', statusDatePrecision: 'on_or_before',
    statusSource: 'Candidature officialisée au plus tard le 10 juillet 2026.',
  }),
  tracked2027({
    id: 'antoine-mikolajczak', displayName: 'Antoine Mikolajczak', party: 'Équinoxe',
    status: CANDIDACY_STATUS.DECLARED, statusDate: '2026-07-10', statusDatePrecision: 'on_or_before',
    statusSource: 'Candidature officialisée au plus tard le 10 juillet 2026.',
  }),

  // Candidatures conditionnelles et processus de primaire.
  tracked2027({
    id: 'clementine-autain', displayName: 'Clémentine Autain', party: 'L’Après',
    status: CANDIDACY_STATUS.CONDITIONAL, statusDate: '2026-07-10',
    statusSource: 'Candidate du processus unitaire dont le format est devenu incertain après le retrait du PS.',
  }),
  tracked2027({
    id: 'lydie-massard', displayName: 'Lydie Massard', party: 'Union démocratique bretonne',
    status: CANDIDACY_STATUS.CONDITIONAL, statusDate: '2026-07-10',
    statusSource: 'Candidate du processus unitaire dont le format est devenu incertain après le retrait du PS.',
  }),
  tracked2027({
    id: 'olivier-faure', displayName: 'Olivier Faure', party: 'Parti Socialiste',
    status: CANDIDACY_STATUS.POTENTIAL, statusDate: '2026-07-10',
    statusSource: 'Participation éventuelle à la primaire socialiste ; aucune candidature officialisée à cette date.',
    programMaturity: 'M0',
  }),
  tracked2027({
    id: 'philippe-brun', displayName: 'Philippe Brun', party: 'Parti Socialiste',
    status: CANDIDACY_STATUS.PRIMARY_CANDIDATE, statusDate: '2026-07-10',
    statusSource: 'Prétendant à la primaire du pôle socialiste ; pas candidat désigné au premier tour.',
  }),
  tracked2027({
    id: 'boris-vallaud', displayName: 'Boris Vallaud', party: 'Parti Socialiste',
    status: CANDIDACY_STATUS.POTENTIAL, statusDate: '2026-07-10',
    statusSource: 'Cité parmi les prétendants socialistes ; candidature non officialisée.',
    programMaturity: 'M0',
  }),
  tracked2027({
    id: 'francois-hollande', displayName: 'François Hollande', party: 'Parti Socialiste',
    status: CANDIDACY_STATUS.POTENTIAL, statusDate: '2026-07-10',
    statusSource: 'Se prépare selon plusieurs sources mais n’a pas officialisé de candidature.',
    programMaturity: 'M0',
  }),
  tracked2027({
    id: 'elisabeth-borne', displayName: 'Élisabeth Borne', party: 'Renaissance',
    status: CANDIDACY_STATUS.POTENTIAL, statusDate: '2026-07-10',
    statusSource: 'Publie des pistes politiques mais n’a pas officialisé de candidature.',
    programMaturity: 'M1',
  }),
  tracked2027({
    id: 'gerald-darmanin', displayName: 'Gérald Darmanin', party: 'Renaissance',
    status: CANDIDACY_STATUS.POTENTIAL, statusDate: '2026-07-10',
    statusSource: 'Se positionne pour 2027 mais n’a pas officialisé de candidature.',
    programMaturity: 'M1',
  }),
  tracked2027({
    id: 'bruno-le-maire', displayName: 'Bruno Le Maire', party: 'Renaissance',
    status: CANDIDACY_STATUS.POTENTIAL, statusDate: '2026-07-10',
    statusSource: 'A annoncé qu’il rendrait sa décision en octobre 2026.',
    programMaturity: 'M0',
  }),
  tracked2027({
    id: 'olivier-becht', displayName: 'Olivier Becht', party: 'Ensemble pour la République',
    status: CANDIDACY_STATUS.POTENTIAL, statusDate: '2026-07-10',
    statusSource: 'Envisage une candidature mais ne l’a pas officialisée.',
    programMaturity: 'M0',
  }),
  tracked2027({
    id: 'jordan-bardella', displayName: 'Jordan Bardella', party: 'Rassemblement National',
    status: CANDIDACY_STATUS.CONTINGENCY, statusDate: '2026-07-08',
    statusSource: 'N’est pas candidat à ce stade après la déclaration de Marine Le Pen ; reste le scénario de remplacement du RN en cas d’empêchement.',
    statusSourceIds: ['src-ifop-intentions-2027-2026-07-08', 'src-lcp-candidats-2027-2026-07-10'],
    programMaturity: 'M0',
  }),
  tracked2027({
    id: 'benjamin-lucas', displayName: 'Benjamin Lucas', party: 'Génération.s',
    status: CANDIDACY_STATUS.WITHDRAWN, statusDate: '2026-07-07',
    statusSource: 'A retiré sa candidature au processus unitaire le 7 juillet 2026.',
    programMaturity: 'M0',
  }),
  tracked2027({
    id: 'sarah-knafo', displayName: 'Sarah Knafo', party: 'Reconquête',
    status: CANDIDACY_STATUS.WITHDRAWN, statusDate: '2026-07-10',
    statusSource: 'A écarté une candidature personnelle et déclaré souhaiter qu’Éric Zemmour soit le candidat de Reconquête.',
    programMaturity: 'M0',
  }),

  // ── France 2022 (rétrospectif) ────────────────────────────────────────────
  { id: 'emmanuel-macron',  displayName: 'Emmanuel Macron',  legacyIds: ['macron'],   party: 'La République En Marche',   elections: ['fr_2022'], status: CANDIDACY_STATUS.WITHDRAWN, statusDate: '2022-04-24', statusSource: 'Élu — non rééligible en 2027 (art. 6 de la Constitution)', matchReady: true, profileSource: PROFILE_SOURCE.LEGACY_MANUAL_V1 },
  { id: 'yannick-jadot',    displayName: 'Yannick Jadot',    legacyIds: ['jadot'],    party: 'Europe Écologie Les Verts', elections: ['fr_2022'], status: CANDIDACY_STATUS.WITHDRAWN, statusDate: '2022-04-10', statusSource: 'Candidat 2022', matchReady: true, profileSource: PROFILE_SOURCE.LEGACY_MANUAL_V1 },
  { id: 'anne-hidalgo',     displayName: 'Anne Hidalgo',     legacyIds: ['hidalgo'],  party: 'Parti Socialiste',          elections: ['fr_2022'], status: CANDIDACY_STATUS.WITHDRAWN, statusDate: '2022-04-10', statusSource: 'Candidate 2022', matchReady: true, profileSource: PROFILE_SOURCE.LEGACY_MANUAL_V1 },
  { id: 'valerie-pecresse', displayName: 'Valérie Pécresse', legacyIds: ['pecresse'], party: 'Les Républicains',          elections: ['fr_2022'], status: CANDIDACY_STATUS.WITHDRAWN, statusDate: '2022-04-10', statusSource: 'Candidate 2022', matchReady: true, profileSource: PROFILE_SOURCE.LEGACY_MANUAL_V1 },

  // ── Municipales françaises ────────────────────────────────────────────────
  { id: 'emmanuel-gregoire',   displayName: 'Emmanuel Grégoire',   legacyIds: ['gregoire_paris'],   party: 'Union de la Gauche', elections: ['paris_2026'],  status: CANDIDACY_STATUS.DECLARED, matchReady: true, profileSource: PROFILE_SOURCE.LEGACY_MANUAL_V1 },
  { id: 'rachida-dati',        displayName: 'Rachida Dati',        legacyIds: ['dati'],             party: 'Les Républicains',   elections: ['paris_2026'],  status: CANDIDACY_STATUS.DECLARED, matchReady: true, profileSource: PROFILE_SOURCE.LEGACY_MANUAL_V1 },
  { id: 'sophia-chikirou',     displayName: 'Sophia Chikirou',     legacyIds: ['chikirou_paris'],   party: 'La France Insoumise', elections: ['paris_2026'], status: CANDIDACY_STATUS.DECLARED, matchReady: true, profileSource: PROFILE_SOURCE.LEGACY_MANUAL_V1 },
  { id: 'catherine-trautmann', displayName: 'Catherine Trautmann', legacyIds: ['trautmann_stras'],  party: 'Parti Socialiste',   elections: ['stras_2026'],  status: CANDIDACY_STATUS.DECLARED, matchReady: true, profileSource: PROFILE_SOURCE.LEGACY_MANUAL_V1 },
  { id: 'jean-philippe-vetter', displayName: 'Jean-Philippe Vetter', legacyIds: ['vetter_stras'],  party: 'Les Républicains / UDI', elections: ['stras_2026'], status: CANDIDACY_STATUS.DECLARED, matchReady: true, profileSource: PROFILE_SOURCE.LEGACY_MANUAL_V1 },
  { id: 'jeanne-barseghian',   displayName: 'Jeanne Barseghian',   legacyIds: ['barseghian'],       party: 'Les Écologistes',    elections: ['stras_2026'],  status: CANDIDACY_STATUS.DECLARED, matchReady: true, profileSource: PROFILE_SOURCE.LEGACY_MANUAL_V1 },
  { id: 'florian-kobryn',      displayName: 'Florian Kobryn',      legacyIds: ['kobryn_stras'],     party: 'La France Insoumise', elections: ['stras_2026'], status: CANDIDACY_STATUS.DECLARED, matchReady: true, profileSource: PROFILE_SOURCE.LEGACY_MANUAL_V1 },

  // ── International ─────────────────────────────────────────────────────────
  { id: 'joe-biden',      displayName: 'Joe Biden',      legacyIds: ['biden'],  party: 'Parti démocrate',   elections: ['us_2020'], status: CANDIDACY_STATUS.WITHDRAWN, matchReady: true, profileSource: PROFILE_SOURCE.LEGACY_MANUAL_V1 },
  { id: 'donald-trump',   displayName: 'Donald Trump',   legacyIds: ['trump'],  party: 'Parti républicain', elections: ['us_2020'], status: CANDIDACY_STATUS.WITHDRAWN, matchReady: true, profileSource: PROFILE_SOURCE.LEGACY_MANUAL_V1 },
  { id: 'friedrich-merz',      displayName: 'Friedrich Merz',      legacyIds: ['merz'],        party: 'CDU/CSU',    elections: ['de_2025'], status: CANDIDACY_STATUS.WITHDRAWN, matchReady: true, profileSource: PROFILE_SOURCE.LEGACY_MANUAL_V1 },
  { id: 'olaf-scholz',         displayName: 'Olaf Scholz',         legacyIds: ['scholz'],      party: 'SPD',        elections: ['de_2025'], status: CANDIDACY_STATUS.WITHDRAWN, matchReady: true, profileSource: PROFILE_SOURCE.LEGACY_MANUAL_V1 },
  { id: 'alice-weidel',        displayName: 'Alice Weidel',        legacyIds: ['weidel'],      party: 'AfD',        elections: ['de_2025'], status: CANDIDACY_STATUS.WITHDRAWN, matchReady: true, profileSource: PROFILE_SOURCE.LEGACY_MANUAL_V1 },
  { id: 'robert-habeck',       displayName: 'Robert Habeck',       legacyIds: ['habeck'],      party: 'Bündnis 90/Die Grünen', elections: ['de_2025'], status: CANDIDACY_STATUS.WITHDRAWN, matchReady: true, profileSource: PROFILE_SOURCE.LEGACY_MANUAL_V1 },
  { id: 'christian-lindner',   displayName: 'Christian Lindner',   legacyIds: ['lindner'],     party: 'FDP',        elections: ['de_2025'], status: CANDIDACY_STATUS.WITHDRAWN, matchReady: true, profileSource: PROFILE_SOURCE.LEGACY_MANUAL_V1 },
  { id: 'sahra-wagenknecht',   displayName: 'Sahra Wagenknecht',   legacyIds: ['wagenknecht'], party: 'BSW',        elections: ['de_2025'], status: CANDIDACY_STATUS.WITHDRAWN, matchReady: true, profileSource: PROFILE_SOURCE.LEGACY_MANUAL_V1 },
  { id: 'giorgia-meloni',      displayName: 'Giorgia Meloni',      legacyIds: ['meloni'],      party: "Fratelli d'Italia", elections: ['it_2022'], status: CANDIDACY_STATUS.WITHDRAWN, matchReady: true, profileSource: PROFILE_SOURCE.LEGACY_MANUAL_V1 },
  { id: 'enrico-letta',        displayName: 'Enrico Letta',        legacyIds: ['letta', 'letta_it'], party: 'Partito Democratico', elections: ['it_2022'], status: CANDIDACY_STATUS.WITHDRAWN, matchReady: true, profileSource: PROFILE_SOURCE.LEGACY_MANUAL_V1 },
  { id: 'giuseppe-conte',      displayName: 'Giuseppe Conte',      legacyIds: ['conte'],       party: 'Movimento 5 Stelle', elections: ['it_2022'], status: CANDIDACY_STATUS.WITHDRAWN, matchReady: true, profileSource: PROFILE_SOURCE.LEGACY_MANUAL_V1 },
  { id: 'matteo-salvini',      displayName: 'Matteo Salvini',      legacyIds: ['salvini'],     party: 'Lega',       elections: ['it_2022'], status: CANDIDACY_STATUS.WITHDRAWN, matchReady: true, profileSource: PROFILE_SOURCE.LEGACY_MANUAL_V1 },
  { id: 'silvio-berlusconi',   displayName: 'Silvio Berlusconi',   legacyIds: ['berlusconi'],  party: 'Forza Italia', elections: ['it_2022'], status: CANDIDACY_STATUS.WITHDRAWN, matchReady: true, profileSource: PROFILE_SOURCE.LEGACY_MANUAL_V1 },
  { id: 'pedro-sanchez',       displayName: 'Pedro Sánchez',       legacyIds: ['sanchez'],     party: 'PSOE',       elections: ['es_2023'], status: CANDIDACY_STATUS.WITHDRAWN, matchReady: true, profileSource: PROFILE_SOURCE.LEGACY_MANUAL_V1 },
  { id: 'alberto-nunez-feijoo', displayName: 'Alberto Núñez Feijóo', legacyIds: ['feijoo'],   party: 'Partido Popular', elections: ['es_2023'], status: CANDIDACY_STATUS.WITHDRAWN, matchReady: true, profileSource: PROFILE_SOURCE.LEGACY_MANUAL_V1 },
  { id: 'santiago-abascal',    displayName: 'Santiago Abascal',    legacyIds: ['abascal'],     party: 'Vox',        elections: ['es_2023'], status: CANDIDACY_STATUS.WITHDRAWN, matchReady: true, profileSource: PROFILE_SOURCE.LEGACY_MANUAL_V1 },
  { id: 'yolanda-diaz',        displayName: 'Yolanda Díaz',        legacyIds: ['diaz', 'diaz_es'], party: 'Sumar',  elections: ['es_2023'], status: CANDIDACY_STATUS.WITHDRAWN, matchReady: true, profileSource: PROFILE_SOURCE.LEGACY_MANUAL_V1 },
  { id: 'keir-starmer',        displayName: 'Keir Starmer',        legacyIds: ['starmer'],     party: 'Parti travailliste', elections: ['uk_2024'], status: CANDIDACY_STATUS.WITHDRAWN, matchReady: true, profileSource: PROFILE_SOURCE.LEGACY_MANUAL_V1 },
  { id: 'rishi-sunak',         displayName: 'Rishi Sunak',         legacyIds: ['sunak'],       party: 'Parti conservateur', elections: ['uk_2024'], status: CANDIDACY_STATUS.WITHDRAWN, matchReady: true, profileSource: PROFILE_SOURCE.LEGACY_MANUAL_V1 },
  { id: 'ed-davey',            displayName: 'Ed Davey',            legacyIds: ['davey'],       party: 'Libéraux-démocrates', elections: ['uk_2024'], status: CANDIDACY_STATUS.WITHDRAWN, matchReady: true, profileSource: PROFILE_SOURCE.LEGACY_MANUAL_V1 },
  { id: 'nigel-farage',        displayName: 'Nigel Farage',        legacyIds: ['farage'],      party: 'Reform UK',  elections: ['uk_2024'], status: CANDIDACY_STATUS.WITHDRAWN, matchReady: true, profileSource: PROFILE_SOURCE.LEGACY_MANUAL_V1 },

  // ── Groupes politiques européens (entités, pas des personnes) ─────────────
  { id: 'eu-epp',       displayName: 'PPE',                legacyIds: ['epp'],       party: 'Parti populaire européen', elections: ['eu_2024'], status: CANDIDACY_STATUS.WITHDRAWN, isGroup: true, matchReady: true, profileSource: PROFILE_SOURCE.LEGACY_MANUAL_V1 },
  { id: 'eu-sd',        displayName: 'S&D',                legacyIds: ['pse'],       party: 'Socialistes et démocrates', elections: ['eu_2024'], status: CANDIDACY_STATUS.WITHDRAWN, isGroup: true, matchReady: true, profileSource: PROFILE_SOURCE.LEGACY_MANUAL_V1 },
  { id: 'eu-renew',     displayName: 'Renew Europe',       legacyIds: ['renew'],     party: 'Renew Europe', elections: ['eu_2024'], status: CANDIDACY_STATUS.WITHDRAWN, isGroup: true, matchReady: true, profileSource: PROFILE_SOURCE.LEGACY_MANUAL_V1 },
  { id: 'eu-greens',    displayName: 'Verts/ALE',          legacyIds: ['greens_eu'], party: 'Verts/Alliance libre européenne', elections: ['eu_2024'], status: CANDIDACY_STATUS.WITHDRAWN, isGroup: true, matchReady: true, profileSource: PROFILE_SOURCE.LEGACY_MANUAL_V1 },
  { id: 'eu-ecr',       displayName: 'CRE',                legacyIds: ['ecr'],       party: 'Conservateurs et réformistes européens', elections: ['eu_2024'], status: CANDIDACY_STATUS.WITHDRAWN, isGroup: true, matchReady: true, profileSource: PROFILE_SOURCE.LEGACY_MANUAL_V1 },
  { id: 'eu-patriots',  displayName: 'Patriotes pour l’Europe', legacyIds: ['patriots'], party: 'Patriotes pour l’Europe', elections: ['eu_2024'], status: CANDIDACY_STATUS.WITHDRAWN, isGroup: true, matchReady: true, profileSource: PROFILE_SOURCE.LEGACY_MANUAL_V1 },
];

// ─── Résolution d'identifiants ───────────────────────────────────────────────

const BY_ANY_ID = new Map();
for (const person of CANDIDATE_REGISTRY) {
  BY_ANY_ID.set(person.id, person);
  for (const legacy of person.legacyIds ?? []) BY_ANY_ID.set(legacy, person);
}

/**
 * Résout n'importe quel identifiant (canonique ou historique) vers l'identifiant canonique.
 * @returns {string|null} id canonique, ou null si inconnu.
 */
export function resolveCandidateId(anyId) {
  return BY_ANY_ID.get(anyId)?.id ?? null;
}

/** Retourne l'entrée complète du registre pour n'importe quel identifiant. */
export function getRegistryEntry(anyId) {
  return BY_ANY_ID.get(anyId) ?? null;
}

/** Annuaire complet des personnes suivies pour une élection donnée. */
export function getTrackedCandidates(electionId) {
  return CANDIDATE_REGISTRY
    .filter(person => person.trackedFor?.includes(electionId))
    .sort((a, b) =>
      (CANDIDACY_STATUS_ORDER[a.status] ?? 99) - (CANDIDACY_STATUS_ORDER[b.status] ?? 99)
      || a.displayName.localeCompare(b.displayName, 'fr')
    );
}

/** Personnes suivies pour une élection donnée mais pas encore comparables. */
export function getTrackedNotMatchReady(electionId) {
  return getTrackedCandidates(electionId)
    .filter(p =>
      !isMatchReady(p)
      && p.profileSource === PROFILE_SOURCE.NONE
    );
}

/**
 * Comparabilité RÉELLE d'un candidat — dérivée, jamais déclarée.
 *
 * ⚠️ Le champ stocké `matchReady` est un booléen saisi à la main. Il valait `true` pour
 * 48 personnes dont le `profileSource` est `legacy-manual-v1`, c'est-à-dire précisément
 * celles que le moteur REFUSE de noter depuis que le repli legacy a été supprimé. Le drapeau
 * affirmait donc « comparable » pour des candidats sans une seule position sourcée.
 *
 * La comparabilité ne peut pas être déclarée : elle se constate. Un candidat est comparable
 * si, et seulement si, ses positions approuvées couvrent assez de thèmes pour que
 * `computeCandidateMatch()` produise un score. C'est la même règle, au même endroit, pour
 * l'affichage et pour le calcul — sans quoi l'interface et le moteur se contredisent.
 *
 * @param {Object|string} candidateOrId entrée du registre, ou identifiant
 * @param {Array} [questions] questions de référence ; sans elles, aucun thème n'est dérivable
 * @returns {boolean}
 */
export function isMatchReady(candidateOrId, questions = []) {
  const entry = typeof candidateOrId === 'string'
    ? CANDIDATE_REGISTRY.find(p => p.id === candidateOrId || p.legacyIds?.includes(candidateOrId))
    : candidateOrId;
  if (!entry) return false;

  // Un profil `legacy-manual-v1` ou absent n'est PAS une preuve : il ne rend rien comparable.
  if (entry.profileSource !== PROFILE_SOURCE.SOURCED_POSITIONS) return false;

  const derived = deriveCandidateThemes(getPositions(entry.id), questions, {
    sourceIsVerified: id => Boolean(getSource(id)?.verifiedAt),
  });
  return derived.coverage.themesKnown >= MATCH_CONFIG.minKnownThemesForScore;
}
