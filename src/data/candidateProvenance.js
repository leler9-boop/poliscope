// POLISCOP — Provenance structurée : documents sources et positions candidates.
//
// POURQUOI CE FICHIER
// -------------------
// `candidateRegistry.js` porte l'identité et le statut ; son champ `statusSource` était du
// texte libre — lisible par un humain, inexploitable par un programme. Impossible d'en
// extraire une URL, de dater une vérification, de détecter une source périmée ou de suivre
// l'historique d'un statut.
//
// Ce fichier introduit les deux briques manquantes :
//   • `SOURCE_DOCUMENTS`   — les documents, avec URL canonique, éditeur, niveau, dates ;
//   • `CANDIDATE_POSITIONS` — une position par (candidat, question), sourcée ou EXPLICITEMENT
//                             à instruire.
//
// RÈGLE CARDINALE : `stance: null` signifie « position inconnue ». Ce n'est PAS 0 (position
// intermédiaire), ce n'est PAS 3 (réponse neutre). Une entrée `null` est une tâche de revue,
// pas une donnée. Aucune position n'est publiée sans `sourceIds` non vide et `reviewedBy`.

/** Niveau de source, par ordre de préséance décroissante (cf. prompts/election-watch-2027.md). */
export const SOURCE_LEVEL = {
  /** Site officiel de campagne, programme PDF, discours intégral. */
  PRIMARY_OFFICIAL: 'primary_official',
  /** Institution : Conseil constitutionnel, JO, Assemblée, Sénat, juridiction. */
  INSTITUTIONAL: 'institutional',
  /** Commission des sondages, document original d'institut. */
  POLLING_AUTHORITY: 'polling_authority',
  /** Presse nationale reconnue — détection et corroboration, jamais preuve unique d'un programme. */
  PRESS: 'press',
  /** Encyclopédie collaborative — signal de recherche, à confirmer par une source supérieure. */
  TERTIARY: 'tertiary',
};

/** Statut de revue d'une position. */
export const REVIEW_STATUS = {
  /** Détectée, non instruite. Ne doit JAMAIS alimenter un score. */
  TO_REVIEW: 'to_review',
  /** Codée par un humain, en attente de relecture. */
  PENDING_REVIEW: 'pending_review',
  /** Relue et validée. Seul statut publiable. */
  APPROVED: 'approved',
  /** Écartée — motif obligatoire. */
  REJECTED: 'rejected',
};

// ─── Documents sources ───────────────────────────────────────────────────────
//
// `verifiedAt` est la date à laquelle un humain a ouvert l'URL et confirmé qu'elle dit bien
// ce qu'on lui fait dire. Une source non revérifiée depuis longtemps est signalée par la
// veille, pas silencieusement conservée.

export const SOURCE_DOCUMENTS = [
  {
    id: 'src-interieur-presidentielle-2027',
    url: 'https://www.elections.interieur.gouv.fr/scrutins/lelection-presidentielle',
    title: 'L’élection présidentielle — calendrier 2027',
    publisher: 'Ministère de l’Intérieur',
    level: SOURCE_LEVEL.INSTITUTIONAL,
    type: 'calendrier_electoral',
    language: 'fr',
    publishedAt: null,
    eventAt: null,
    discoveredAt: '2026-08-10',
    verifiedAt: '2026-08-10',
    status: 'active',
    note: 'Confirme le premier tour le 18 avril 2027 et le second tour le 2 mai 2027.',
  },
  {
    id: 'src-lcp-candidats-2027-2026-07-10',
    url: 'https://lcp.fr/actualites/presidentielle-2027-la-liste-des-candidats-deja-en-lice-et-des-pretendants-436373',
    title: 'Présidentielle 2027 : la liste des candidats déjà en lice et des prétendants',
    publisher: 'LCP — Assemblée nationale',
    level: SOURCE_LEVEL.PRESS,
    type: 'etat_des_candidatures',
    language: 'fr',
    publishedAt: '2026-05-15',
    eventAt: '2026-07-10',
    discoveredAt: '2026-08-09',
    verifiedAt: '2026-08-10',
    status: 'active',
    note: 'Photographie éditoriale de référence : 16 candidatures officialisées et 35 personnes déclarées ou putatives au 10 juillet 2026.',
  },
  {
    id: 'src-lisnard-programme-2027',
    url: 'https://www.unenouvelleenergie.fr/notre-programme/',
    title: 'Notre programme — Nouvelle Énergie',
    publisher: 'Nouvelle Énergie (parti de David Lisnard)',
    level: SOURCE_LEVEL.PRIMARY_OFFICIAL,
    type: 'programme',
    language: 'fr',
    publishedAt: null,     // non daté sur la page consultée
    eventAt: null,
    discoveredAt: '2026-08-09',
    verifiedAt: '2026-08-10',
    status: 'active',
    note: 'Page officielle ouverte et vérifiée. Elle présente un projet structuré (prospérité, équité, cohésion ; libéralisme économique, réforme de l’État, décentralisation), mais aucune position n’en est encore dérivée sans codage et double relecture.',
  },
  {
    id: 'src-attal-campagne-2027',
    url: 'https://attalpresident.fr/',
    title: 'Site de campagne de Gabriel Attal',
    publisher: 'Équipe de campagne Gabriel Attal',
    level: SOURCE_LEVEL.PRIMARY_OFFICIAL,
    type: 'site_campagne',
    language: 'fr',
    publishedAt: null,
    eventAt: null,
    discoveredAt: '2026-08-09',
    verifiedAt: '2026-08-10',
    status: 'active',
    note: 'Publie des « chantiers » participatifs — maturité M2. Ne pas traiter comme un programme définitif.',
  },
  {
    id: 'src-lfi-programme-2027-contributions',
    url: 'https://lafranceinsoumise.fr/2026/05/20/la-france-insoumise-ouvre-son-programme-a-contributions-citoyennes/',
    title: 'La France insoumise ouvre son programme 2027 à contributions citoyennes',
    publisher: 'La France insoumise',
    level: SOURCE_LEVEL.PRIMARY_OFFICIAL,
    type: 'programme_partiel',
    language: 'fr',
    publishedAt: '2026-05-20',
    eventAt: '2026-05-20',
    discoveredAt: '2026-08-10',
    verifiedAt: '2026-08-10',
    status: 'active',
    note: 'Confirme qu’une version 2027 de L’Avenir en commun est en préparation et a été ouverte aux contributions ; maturité M3, pas version électorale définitive.',
  },
  {
    id: 'src-philippe-campagne-2027',
    url: 'https://www.edouardphilippe.fr/',
    title: 'Avec Édouard — campagne présidentielle 2027',
    publisher: 'Équipe de campagne Édouard Philippe',
    level: SOURCE_LEVEL.PRIMARY_OFFICIAL,
    type: 'site_campagne',
    language: 'fr',
    publishedAt: null,
    eventAt: '2026-07-05',
    discoveredAt: '2026-08-10',
    verifiedAt: '2026-08-10',
    status: 'active',
    note: 'Site officiel de campagne et meeting du 5 juillet ; aucune liste complète et chiffrée de mesures n’y est publiée à la date de vérification (M1).',
  },
  {
    id: 'src-lr-retailleau-designation-2026-04-20',
    url: 'https://republicains.fr/actualites/2026/04/20/bruno-retailleau-largement-designe-comme-candidat-des-republicains-pour-lelection-presidentielle/',
    title: 'Bruno Retailleau désigné candidat des Républicains',
    publisher: 'Les Républicains',
    level: SOURCE_LEVEL.PRIMARY_OFFICIAL,
    type: 'designation_parti',
    language: 'fr',
    publishedAt: '2026-04-20',
    eventAt: '2026-04-19',
    discoveredAt: '2026-08-10',
    verifiedAt: '2026-08-10',
    status: 'active',
    note: 'Source officielle du parti confirmant la désignation par les adhérents.',
  },
  {
    id: 'src-ifop-intentions-2027-2026-07-08',
    url: 'https://www.ifop.com/article/les-intentions-de-vote-a-lelection-presidentielle-2027-et-lopinion-des-francais-apres-la-declaration-de-candidature-de-marine-le-pen/',
    title: 'Intentions de vote après la déclaration de candidature de Marine Le Pen',
    publisher: 'Ifop',
    level: SOURCE_LEVEL.POLLING_AUTHORITY,
    type: 'sondage',
    language: 'fr',
    publishedAt: '2026-07-09',
    eventAt: '2026-07-08',
    discoveredAt: '2026-08-10',
    verifiedAt: '2026-08-10',
    status: 'active',
    note: 'Enquête menée les 7 et 8 juillet après la déclaration de Marine Le Pen ; sert à contrôler quels noms sont effectivement testés, jamais à transformer une personne testée en candidat déclaré.',
  },
  {
    id: 'src-cazeneuve-candidature-2026-07-16',
    url: 'https://bc2027.fr/',
    title: 'Bernard Cazeneuve — La France, ensemble',
    publisher: 'Équipe de campagne Bernard Cazeneuve',
    level: SOURCE_LEVEL.PRIMARY_OFFICIAL,
    type: 'site_campagne',
    language: 'fr',
    publishedAt: null,
    eventAt: '2026-07-16',
    discoveredAt: '2026-08-10',
    verifiedAt: '2026-08-10',
    status: 'active',
    note: 'Site officiel de candidature, centré à ce stade sur la démarche et la recherche de parrainages ; maturité programmatique M1.',
  },
  {
    id: 'src-wikipedia-presidentielle-2027',
    url: 'https://fr.wikipedia.org/wiki/%C3%89lection_pr%C3%A9sidentielle_fran%C3%A7aise_de_2027',
    title: 'Élection présidentielle française de 2027 — Wikipédia',
    publisher: 'Wikipédia',
    level: SOURCE_LEVEL.TERTIARY,
    type: 'encyclopedie',
    language: 'fr',
    publishedAt: null,
    eventAt: null,
    discoveredAt: '2026-08-09',
    verifiedAt: '2026-08-09',
    status: 'active',
    note: 'Source de DÉTECTION des candidatures déclarées. Suffisante pour inscrire une personne à l’annuaire ; insuffisante pour coder une position ou trancher un statut contesté.',
  },
  {
    id: 'src-france24-royal-2026-05-24',
    url: 'https://www.france24.com/fr/france/20260524-france-presidentielle-2027-qui-sont-les-candidats-officiellement-declares',
    title: 'Présidentielle 2027 : Ségolène Royal s’ajoute à la longue liste des candidats déclarés',
    publisher: 'France 24',
    level: SOURCE_LEVEL.PRESS,
    type: 'article',
    language: 'fr',
    publishedAt: '2026-05-24',
    eventAt: '2026-05-24',
    discoveredAt: '2026-08-09',
    verifiedAt: '2026-08-09',
    status: 'active',
    note: null,
  },
  {
    id: 'src-commission-sondages-2027',
    url: 'https://www.commission-des-sondages.fr/notices/medias/fichiers/bytag/14/2027-Presidentielle',
    title: 'Notices — Présidentielle 2027',
    publisher: 'Commission des sondages',
    level: SOURCE_LEVEL.POLLING_AUTHORITY,
    type: 'notices',
    language: 'fr',
    publishedAt: null,
    eventAt: null,
    discoveredAt: '2026-08-09',
    verifiedAt: '2026-08-10',
    status: 'active',
    note: 'À rattacher à toute donnée de sondage. Aucun sondage n’est stocké dans le produit à ce jour.',
  },
];

const SOURCES_BY_ID = new Map(SOURCE_DOCUMENTS.map(s => [s.id, s]));
export function getSource(id) { return SOURCES_BY_ID.get(id) ?? null; }

// ─── Positions candidates ────────────────────────────────────────────────────
//
// AMORCE : David Lisnard.
//
// Le contre-audit demandait de « commencer la provenance question par question avec Lisnard
// sans inventer les positions ». C'est exactement ce que fait le bloc ci-dessous : les 17
// questions de fr_2027 existent comme entrées de travail, avec `stance: null` et le document
// programmatique rattaché. Aucune valeur n'est devinée. Tant que ces entrées ne sont pas
// instruites et relues, Lisnard reste `matchReady: false` et n'apparaît pas au classement.
//
// La forme est volontairement celle de la cible : quand une position sera codée, il suffira
// de remplir `stance`, `sourceIds`, `excerpt`, `reasoning`, `codedBy` et `reviewedBy`.

const FR2027_QUESTION_IDS = [
  'fr_2027_q1', 'fr_2027_q2', 'fr_2027_q3', 'fr_2027_q4', 'fr_2027_q5', 'fr_2027_q6',
  'fr_2027_q7', 'fr_2027_q8', 'fr_2027_q9', 'fr_2027_q10', 'fr_2027_q11', 'fr_2027_q12',
  'fr_2027_q13', 'fr_2027_q14', 'fr_2027_q15', 'fr_2027_q16', 'fr_2027_q17',
];

/**
 * @typedef {Object} CandidatePosition
 * @property {string}  candidateId  identifiant canonique (candidateRegistry.js)
 * @property {string}  questionId
 * @property {number|null} stance   -2 | -1 | 0 | +1 | +2, ou null = INCONNUE
 * @property {string[]} sourceIds   documents étayant la position ; vide ⇒ non publiable
 * @property {string|null} excerpt  extrait probant, 25 mots maximum (droit d'auteur)
 * @property {string|null} reasoning
 * @property {string}  evidenceType 'programme' | 'vote' | 'discours' | 'interview' | 'inference'
 * @property {number|null} confidence 0–1
 * @property {string}  reviewStatus REVIEW_STATUS
 * @property {string|null} codedBy
 * @property {string|null} reviewedBy
 * @property {string|null} validFrom
 * @property {string|null} supersedesId
 */

export const CANDIDATE_POSITIONS = [
  ...FR2027_QUESTION_IDS.map(questionId => ({
    candidateId: 'david-lisnard',
    questionId,
    stance: null,                                   // ← inconnue, PAS neutre
    sourceIds: ['src-lisnard-programme-2027'],      // document à dépouiller
    excerpt: null,
    reasoning: null,
    evidenceType: 'programme',
    confidence: null,
    reviewStatus: REVIEW_STATUS.TO_REVIEW,
    codedBy: null,
    reviewedBy: null,
    validFrom: null,
    supersedesId: null,
  })),
];

// ─── Accès ───────────────────────────────────────────────────────────────────

/** Positions d'un candidat, tous statuts confondus. */
export function getPositions(candidateId) {
  return CANDIDATE_POSITIONS.filter(p => p.candidateId === candidateId);
}

/** Positions PUBLIABLES : relues, sourcées, avec une valeur. */
export function getApprovedPositions(candidateId) {
  return getPositions(candidateId).filter(
    p => p.reviewStatus === REVIEW_STATUS.APPROVED && p.stance != null && p.sourceIds.length > 0,
  );
}

/**
 * Couverture sourcée d'un candidat sur un ensemble de questions.
 * @returns {{approved: number, total: number, ratio: number}}
 */
export function positionCoverage(candidateId, questionIds = FR2027_QUESTION_IDS) {
  const approved = getApprovedPositions(candidateId)
    .filter(p => questionIds.includes(p.questionId)).length;
  return { approved, total: questionIds.length, ratio: questionIds.length ? approved / questionIds.length : 0 };
}

/** File de revue : tout ce qui reste à instruire, trié par candidat. */
export function getReviewQueue() {
  return CANDIDATE_POSITIONS
    .filter(p => p.reviewStatus === REVIEW_STATUS.TO_REVIEW || p.reviewStatus === REVIEW_STATUS.PENDING_REVIEW)
    .map(p => ({ candidateId: p.candidateId, questionId: p.questionId, reviewStatus: p.reviewStatus }));
}

export { FR2027_QUESTION_IDS };
