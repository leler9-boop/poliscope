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
import { secondReadingFor, REVIEW_VERDICT, REVIEW_PASS_VERSION } from './candidateReviewLog.js';

/**
 * Applique le verdict de SECONDE LECTURE à une position codée.
 *
 * ⚠ LIEN DÉTERMINISTE, PAS RECOPIE. Le statut publiable DÉCOULE du journal ; il n'est pas
 * saisi ici. Deux sources de vérité divergent au premier oubli — et c'est exactement ce qui
 * s'était produit : le journal portait douze constats concluants pendant que `check-matching`
 * annonçait zéro position approuvée.
 *
 * ⚠ `approved` NE VEUT PAS DIRE « validé par un humain ». `reviewerType: 'model'` voyage avec
 * chaque position : la voie stricte s'appuie ici sur un contrôle documentaire, pas sur une
 * validation éditoriale indépendante. Ne jamais présenter ces positions autrement.
 */
function applySecondReading(base) {
  const review = base.codedBy ? secondReadingFor(base.candidateId, base.questionId) : null;
  if (!review) return base;

  const trace = {
    reviewLogRef: `${REVIEW_PASS_VERSION}:${base.candidateId}:${base.questionId}`,
    reviewedBy: review.reviewedBy,
    reviewerType: review.reviewerType,
    reviewVersion: review.reviewerVersion,
    reviewedAt: review.reviewedAt,
    reviewVerdict: review.verdict,
  };

  // Une position CODÉE PAR LE RELECTEUR ne peut jamais être approuvée par lui, quel que soit
  // le verdict porté sur le codage précédent : il se relirait lui-même.
  if (base.codedBy.startsWith(review.reviewedBy)) {
    return {
      ...base,
      reviewLogRef: trace.reviewLogRef,
      reviewerType: review.reviewerType,
      reviewedBy: null,
      reviewStatus: REVIEW_STATUS.PENDING_REVIEW,
      reviewVerdict: 'recoded_by_reviewer',
    };
  }

  if (review.verdict === REVIEW_VERDICT.APPROVED) {
    return { ...base, ...trace, reviewStatus: REVIEW_STATUS.APPROVED };
  }
  if (review.verdict === REVIEW_VERDICT.CORRECTED) {
    return {
      ...base, ...trace,
      stance: review.suggestedStance,
      codedBy: `${review.reviewedBy}-recode-${review.reviewedAt}`,
      // ⚠ PAS de `supersedesId` ici. La correction ne crée pas une SECONDE ligne : elle
      // amende celle-ci. Pointer vers une position qui n'existe pas comme entrée distincte
      // fabriquerait une référence morte. La trace du codage antérieur vit dans le journal
      // de relecture (`reviewLogRef`, avec `codedStance` et `suggestedStance`).
      reviewedBy: null,
      reviewStatus: REVIEW_STATUS.PENDING_REVIEW,
    };
  }
  if (review.verdict === REVIEW_VERDICT.REJECTED) {
    return { ...base, ...trace, reviewStatus: REVIEW_STATUS.REJECTED };
  }
  // `unverified` : rien n'est conclu, la position reste où elle était.
  return { ...base, ...trace, reviewStatus: REVIEW_STATUS.PENDING_REVIEW, reviewedBy: null };
}

export const SOURCE_LEVEL = {
  /** Site officiel de campagne, programme PDF, discours intégral. */
  PRIMARY_OFFICIAL: 'primary_official',
  /** Enregistrement direct ou transcription verbatim d'une prise de parole du candidat. */
  PRIMARY_DIRECT: 'primary_direct',
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
    id: 'src-lcp-lepen-declaration-2026-07-07',
    url: 'https://lcp.fr/actualites/ce-soir-je-suis-candidate-a-l-election-presidentielle-annonce-marine-le-pen-438886',
    title: '« Ce soir, je suis candidate à l’élection présidentielle », annonce Marine Le Pen',
    publisher: 'LCP — Assemblée nationale',
    level: SOURCE_LEVEL.PRESS,
    type: 'declaration_candidature',
    language: 'fr',
    publishedAt: '2026-07-07',
    eventAt: '2026-07-07',
    discoveredAt: '2026-08-10',
    verifiedAt: '2026-08-10',
    status: 'active',
    note: 'Annonce explicite faite au journal de 20 heures de TF1 après l’arrêt d’appel ; remplace les formulations antérieures conditionnées par l’éligibilité.',
  },
  {
    id: 'src-lcp-melenchon-declaration-2026-05-03',
    url: 'https://lcp.fr/actualites/presidentielle-jean-luc-melenchon-officialise-sa-candidature-pour-2027-435851',
    title: 'Jean-Luc Mélenchon officialise sa candidature pour 2027',
    publisher: 'LCP — Assemblée nationale',
    level: SOURCE_LEVEL.PRESS,
    type: 'declaration_candidature',
    language: 'fr',
    publishedAt: '2026-05-03',
    eventAt: '2026-05-03',
    discoveredAt: '2026-08-10',
    verifiedAt: '2026-08-10',
    status: 'active',
    note: 'Annonce explicite au journal de 20 heures de TF1 et lancement du site de soutien 2027.',
  },
  {
    id: 'src-lcp-campagnes-2027-2026-07-23',
    url: 'https://lcp.fr/actualites/presidentielle-2027-a-quoi-va-ressembler-l-ete-des-candidats-439912',
    title: 'Présidentielle 2027 : à quoi va ressembler l’été des candidats ?',
    publisher: 'LCP — Assemblée nationale',
    level: SOURCE_LEVEL.PRESS,
    type: 'etat_de_campagne',
    language: 'fr',
    publishedAt: '2026-07-23',
    eventAt: '2026-07-23',
    discoveredAt: '2026-08-10',
    verifiedAt: '2026-08-10',
    status: 'active',
    note: 'Contrôle récent de l’activité de campagne ; confirme notamment Attal, Philippe, Retailleau, Le Pen, Mélenchon, Tondelier et Ruffin sans transformer les invités d’un événement en candidats déclarés.',
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
    note: 'Page officielle ouverte et vérifiée. Elle présente le corpus programmatique et renvoie vers les chapitres détaillés utilisés pour le codage question par question.',
  },
  {
    id: 'src-lisnard-programme-institutions-2027',
    url: 'https://www.unenouvelleenergie.fr/notre-programme/etre-maitre-de-notre-destin/',
    title: 'Être maître de notre destin — institutions, dette et Europe',
    publisher: 'Nouvelle Énergie (parti de David Lisnard)',
    level: SOURCE_LEVEL.PRIMARY_OFFICIAL,
    type: 'programme',
    language: 'fr',
    publishedAt: null,
    eventAt: null,
    discoveredAt: '2026-08-10',
    verifiedAt: '2026-08-10',
    status: 'active',
    note: 'Chapitre officiel détaillant notamment la doctrine européenne et la réforme institutionnelle.',
  },
  {
    id: 'src-lisnard-programme-ambition-2027',
    url: 'https://www.unenouvelleenergie.fr/notre-programme/reussir-une-nouvelle-ambition-francaise/',
    title: 'Réussir une nouvelle ambition française — économie et cohésion',
    publisher: 'Nouvelle Énergie (parti de David Lisnard)',
    level: SOURCE_LEVEL.PRIMARY_OFFICIAL,
    type: 'programme',
    language: 'fr',
    publishedAt: null,
    eventAt: null,
    discoveredAt: '2026-08-10',
    verifiedAt: '2026-08-10',
    status: 'active',
    note: 'Chapitre officiel détaillant notamment la baisse de la fiscalité de production.',
  },
  {
    id: 'src-lisnard-programme-security-2027',
    url: 'https://www.unenouvelleenergie.fr/notre-programme/securite/',
    title: 'Sécurité — le projet de David Lisnard',
    publisher: 'Nouvelle Énergie (parti de David Lisnard)',
    level: SOURCE_LEVEL.PRIMARY_OFFICIAL,
    type: 'programme',
    language: 'fr',
    publishedAt: null,
    eventAt: null,
    discoveredAt: '2026-08-10',
    verifiedAt: '2026-08-10',
    status: 'active',
    note: 'Chapitre officiel sur les moyens et pouvoirs de sécurité et les règles visant l’islamisme.',
  },
  {
    id: 'src-lisnard-programme-immigration-2027',
    url: 'https://www.unenouvelleenergie.fr/notre-programme/immigration/',
    title: 'Immigration — le projet de David Lisnard',
    publisher: 'Nouvelle Énergie (parti de David Lisnard)',
    level: SOURCE_LEVEL.PRIMARY_OFFICIAL,
    type: 'programme',
    language: 'fr',
    publishedAt: null,
    eventAt: null,
    discoveredAt: '2026-08-10',
    verifiedAt: '2026-08-10',
    status: 'active',
    note: 'Chapitre officiel chiffrant une réduction par huit des titres de séjour.',
  },
  {
    id: 'src-lisnard-programme-sante-2027',
    url: 'https://www.unenouvelleenergie.fr/notre-programme/sante/',
    title: 'Santé — le projet de David Lisnard',
    publisher: 'Nouvelle Énergie (parti de David Lisnard)',
    level: SOURCE_LEVEL.PRIMARY_OFFICIAL,
    type: 'programme',
    language: 'fr',
    publishedAt: null,
    eventAt: null,
    discoveredAt: '2026-08-10',
    verifiedAt: '2026-08-10',
    status: 'active',
    note: 'Chapitre officiel : priorité donnée à la réorganisation, à la formation et à l’autonomie locale plutôt qu’à une hausse générale des dépenses.',
  },
  {
    id: 'src-lisnard-programme-education-2027',
    url: 'https://www.unenouvelleenergie.fr/notre-programme/education/',
    title: 'Éducation — le projet de David Lisnard',
    publisher: 'Nouvelle Énergie (parti de David Lisnard)',
    level: SOURCE_LEVEL.PRIMARY_OFFICIAL,
    type: 'programme',
    language: 'fr',
    publishedAt: null,
    eventAt: null,
    discoveredAt: '2026-08-10',
    verifiedAt: '2026-08-10',
    status: 'active',
    note: 'Chapitre officiel : libre choix de l’établissement, autonomie, rémunération au mérite et hausse de salaire des enseignants liée à une réorganisation.',
  },
  {
    id: 'src-lisnard-logement-2027',
    url: 'https://www.unenouvelleenergie.fr/theme/logement/',
    title: 'Logement — propositions de Nouvelle Énergie',
    publisher: 'Nouvelle Énergie (parti de David Lisnard)',
    level: SOURCE_LEVEL.PRIMARY_OFFICIAL,
    type: 'programme',
    language: 'fr',
    publishedAt: null,
    eventAt: null,
    discoveredAt: '2026-08-10',
    verifiedAt: '2026-08-10',
    status: 'active',
    note: 'Corpus officiel privilégiant l’offre, la propriété et l’allègement des contraintes plutôt qu’un encadrement renforcé des loyers.',
  },
  {
    id: 'src-lisnard-fiscalite-2027',
    url: 'https://www.unenouvelleenergie.fr/changer-de-logiciel-fiscal/',
    title: 'Changer de logiciel fiscal',
    publisher: 'Nouvelle Énergie (parti de David Lisnard)',
    level: SOURCE_LEVEL.PRIMARY_OFFICIAL,
    type: 'proposition',
    language: 'fr',
    publishedAt: null,
    eventAt: null,
    discoveredAt: '2026-08-10',
    verifiedAt: '2026-08-10',
    status: 'active',
    note: 'Propose 100 milliards d’euros de baisse globale des prélèvements et un impôt sur les sociétés ramené à 20 %.',
  },
  {
    id: 'src-lisnard-ppe3-2027',
    url: 'https://www.unenouvelleenergie.fr/ppe3-une-faute-strategique-democratique-et-economique/',
    title: 'PPE3 : une faute stratégique, démocratique et économique',
    publisher: 'David Lisnard / Nouvelle Énergie',
    level: SOURCE_LEVEL.PRIMARY_OFFICIAL,
    type: 'proposition',
    language: 'fr',
    publishedAt: null,
    eventAt: null,
    discoveredAt: '2026-08-10',
    verifiedAt: '2026-08-10',
    status: 'active',
    note: 'Soutient la décarbonation et l’électrification mais rejette un calendrier imposé jugé irréaliste et coûteux.',
  },
  {
    id: 'src-lisnard-bayeux-2026-06-17',
    url: 'https://www.unenouvelleenergie.fr/app/uploads/2026/06/Discours-de-David-Lisnard-a-Bayeux-17062026.pdf',
    title: 'Discours de Bayeux — institutions et référendum',
    publisher: 'David Lisnard / Nouvelle Énergie',
    level: SOURCE_LEVEL.PRIMARY_OFFICIAL,
    type: 'discours_integral',
    language: 'fr',
    publishedAt: '2026-06-17',
    eventAt: '2026-06-17',
    discoveredAt: '2026-08-10',
    verifiedAt: '2026-08-10',
    status: 'active',
    note: 'Texte intégral officiel annonçant un référendum d’initiative populaire rendu praticable.',
  },
  {
    id: 'src-lisnard-strategy-2026-06-29',
    url: 'https://www.unenouvelleenergie.fr/le-grand-entretien-avec-david-lisnard-quelle-strategie-pour-la-france-dans-le-nouveau-desordre-mondial/',
    title: 'Le Grand Entretien — stratégie internationale, Ukraine et nucléaire',
    publisher: 'David Lisnard / Nouvelle Énergie',
    level: SOURCE_LEVEL.PRIMARY_OFFICIAL,
    type: 'interview_integrale',
    language: 'fr',
    publishedAt: '2026-06-29',
    eventAt: '2026-06-29',
    discoveredAt: '2026-08-10',
    verifiedAt: '2026-08-10',
    status: 'active',
    note: 'Entretien officiel détaillant EPR2, petits réacteurs modulaires, soutien à l’Ukraine et capacités de défense.',
  },
  {
    id: 'src-lisnard-saint-raphael-2026-07-03',
    url: 'https://www.unenouvelleenergie.fr/a-saint-raphael-david-lisnard-lance-sa-campagne-pour-faire-gagner-la-france-qui-fait/',
    title: 'Discours de lancement de campagne à Saint-Raphaël',
    publisher: 'David Lisnard / Nouvelle Énergie',
    level: SOURCE_LEVEL.PRIMARY_OFFICIAL,
    type: 'discours_integral',
    language: 'fr',
    publishedAt: '2026-07-10',
    eventAt: '2026-07-03',
    discoveredAt: '2026-08-10',
    verifiedAt: '2026-08-10',
    status: 'active',
    note: 'Discours officiel de campagne sur sécurité, salaires nets, nucléaire et écologie non punitive.',
  },
  {
    id: 'src-lisnard-dissuasion-2026-03-06',
    url: 'https://www.unenouvelleenergie.fr/dissuasion-nucleaire-ce-que-le-discours-du-president-de-la-republique-dit-et-ce-quil-ne-dit-pas/',
    title: 'Dissuasion nucléaire — doctrine et capacités',
    publisher: 'David Lisnard / Nouvelle Énergie',
    level: SOURCE_LEVEL.PRIMARY_OFFICIAL,
    type: 'chronique',
    language: 'fr',
    publishedAt: '2026-03-06',
    eventAt: '2026-03-06',
    discoveredAt: '2026-08-10',
    verifiedAt: '2026-08-10',
    status: 'active',
    note: 'Position explicite en faveur d’une réévaluation à la hausse de l’arsenal et du renouvellement des composantes.',
  },
  {
    id: 'src-lisnard-bfmtv-retraites-2025-11-18',
    url: 'https://x.com/BFMTV/status/1990691225695813743',
    title: 'Interview BFMTV — âge de départ à la retraite',
    publisher: 'BFMTV — enregistrement vidéo direct de David Lisnard',
    level: SOURCE_LEVEL.PRIMARY_DIRECT,
    type: 'interview_video',
    language: 'fr',
    publishedAt: '2025-11-18',
    eventAt: '2025-11-18',
    discoveredAt: '2026-08-10',
    verifiedAt: '2026-08-10',
    status: 'active',
    note: 'Enregistrement direct : David Lisnard rejette explicitement la proposition du RN d’abaisser l’âge de départ à la retraite.',
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
    id: 'src-attal-travail-salaires-2027',
    url: 'https://attalpresident.fr/programme/travail-salaires',
    title: 'Chantier capital — Travail & salaires',
    publisher: 'Campagne présidentielle de Gabriel Attal',
    level: SOURCE_LEVEL.PRIMARY_OFFICIAL,
    type: 'programme_partiel',
    language: 'fr',
    publishedAt: null,
    eventAt: null,
    discoveredAt: '2026-08-10',
    verifiedAt: '2026-08-10',
    status: 'active',
    note: 'Chantier officiel 2027 ; annonce encore une stratégie salariale complète ultérieure, donc maturité M2.',
  },
  {
    id: 'src-attal-frontieres-2027',
    url: 'https://attalpresident.fr/programme/frontieres',
    title: 'Chantier capital — Frontières',
    publisher: 'Campagne présidentielle de Gabriel Attal',
    level: SOURCE_LEVEL.PRIMARY_OFFICIAL,
    type: 'programme_partiel',
    language: 'fr',
    publishedAt: null,
    eventAt: null,
    discoveredAt: '2026-08-10',
    verifiedAt: '2026-08-10',
    status: 'active',
    note: 'Chantier officiel 2027 sur immigration, Ukraine, défense, dissuasion et souveraineté européenne.',
  },
  {
    id: 'src-attal-europe-2026-06-24',
    url: 'https://attalpresident.fr/actualites/gabriel-attal-pour-le-retour-du-royaume-uni-dans-l-union-europeenne-dans-le-figaro',
    title: 'Pour le retour du Royaume-Uni dans l’Union européenne',
    publisher: 'Campagne présidentielle de Gabriel Attal',
    level: SOURCE_LEVEL.PRIMARY_OFFICIAL,
    type: 'tribune_republiee',
    language: 'fr',
    publishedAt: '2026-06-24',
    eventAt: '2026-06-24',
    discoveredAt: '2026-08-10',
    verifiedAt: '2026-08-10',
    status: 'active',
    note: 'Position officielle en faveur d’une Europe des coalitions et d’une future réadhésion britannique.',
  },
  {
    id: 'src-attal-profile-2026-05-22',
    url: 'https://attalpresident.fr/gabriel-attal',
    title: 'Gabriel Attal — parcours et orientations économiques',
    publisher: 'Campagne présidentielle de Gabriel Attal',
    level: SOURCE_LEVEL.PRIMARY_OFFICIAL,
    type: 'site_campagne',
    language: 'fr',
    publishedAt: '2026-05-22',
    eventAt: null,
    discoveredAt: '2026-08-10',
    verifiedAt: '2026-08-10',
    status: 'active',
    note: 'Page officielle mise à jour le 22 mai 2026 ; mentionne explicitement la baisse des impôts sur les sociétés.',
  },
  {
    id: 'src-attal-tf1-rn-2026-07-07',
    url: 'https://attalpresident.fr/actualites/gabriel-attal-sur-tf1-le-choix-du-rassemblement-national-est-un-choix-qui-nous-emmenerait-dans-le-mur',
    title: 'Réaction de Gabriel Attal au programme du RN sur TF1',
    publisher: 'Campagne présidentielle de Gabriel Attal',
    level: SOURCE_LEVEL.PRIMARY_OFFICIAL,
    type: 'interview_republiee',
    language: 'fr',
    publishedAt: '2026-07-07',
    eventAt: '2026-07-07',
    discoveredAt: '2026-08-10',
    verifiedAt: '2026-08-10',
    status: 'active',
    note: 'Le site officiel résume son opposition explicite au financement d’une retraite à 60 ans.',
  },
  {
    id: 'src-lemonde-attal-campagne-2026-08-08',
    url: 'https://www.lemonde.fr/en/politics/article/2026/08/08/most-french-presidential-candidates-are-vacationing-not-gabriel-attal_6756292_5.html',
    title: 'Most French presidential candidates are vacationing. Not Gabriel Attal',
    publisher: 'Le Monde',
    level: SOURCE_LEVEL.PRESS,
    type: 'etat_de_campagne',
    language: 'en',
    publishedAt: '2026-08-08',
    eventAt: '2026-08-08',
    discoveredAt: '2026-08-10',
    verifiedAt: '2026-08-10',
    status: 'active',
    note: 'Point de campagne récent : quatre priorités (école, salaires, frontières, intelligence artificielle) et propositions sur l’emploi public, l’immigration et le déficit. Cela confirme M2, pas un programme final.',
  },
  {
    id: 'src-roussel-marseille-2025-11-23',
    url: 'https://www.pcf.fr/meeting_marseille_231125_discours_fr',
    title: 'Meeting de Marseille — discours de Fabien Roussel',
    publisher: 'Parti communiste français',
    level: SOURCE_LEVEL.PRIMARY_OFFICIAL,
    type: 'discours_integral',
    language: 'fr',
    publishedAt: '2025-11-26',
    eventAt: '2025-11-23',
    discoveredAt: '2026-08-10',
    verifiedAt: '2026-08-10',
    status: 'active',
    note: 'Discours officiel récent sur retraites, SMIC, services publics et énergie ; ne constitue pas un programme 2027 final.',
  },
  {
    id: 'src-roussel-energie-2026-04-08',
    url: 'https://www.pcf.fr/face_explosion_des_prix_le_gouvernement_doit_declarer_l_etat_d_urgence_energetique',
    title: 'Face à l’explosion des prix, le Gouvernement doit déclarer l’état d’urgence énergétique',
    publisher: 'Parti communiste français — Fabien Roussel',
    level: SOURCE_LEVEL.PRIMARY_OFFICIAL,
    type: 'propositions_thematiques',
    language: 'fr',
    publishedAt: '2026-04-08',
    eventAt: '2026-04-08',
    discoveredAt: '2026-08-10',
    verifiedAt: '2026-08-10',
    status: 'active',
    note: 'Propositions énergétiques signées Fabien Roussel, dont 20 EPR2 et 12 petits réacteurs modulaires d’ici 2050.',
  },
  {
    id: 'src-roussel-laicite-2025-11-13',
    url: 'https://www.pcf.fr/13_novembre2025_declaration_fabienroussel',
    title: 'D’un 13 novembre à l’autre, le combat à poursuivre contre le terrorisme et pour la République',
    publisher: 'Parti communiste français — Fabien Roussel',
    level: SOURCE_LEVEL.PRIMARY_OFFICIAL,
    type: 'declaration',
    language: 'fr',
    publishedAt: '2025-11-13',
    eventAt: '2025-11-13',
    discoveredAt: '2026-08-10',
    verifiedAt: '2026-08-10',
    status: 'active',
    note: 'Déclaration personnelle distinguant lutte contre l’intégrisme et règles visant les croyants dans l’espace public.',
  },
  {
    id: 'src-roussel-cn-2025-05-17',
    url: 'https://23.pcf.fr/sites/default/files/rapport_f._roussel_1.pdf',
    title: 'Rapport de Fabien Roussel au Conseil national du PCF',
    publisher: 'Parti communiste français — Fabien Roussel',
    level: SOURCE_LEVEL.PRIMARY_OFFICIAL,
    type: 'discours_integral_pdf',
    language: 'fr',
    publishedAt: '2025-05-17',
    eventAt: '2025-05-17',
    discoveredAt: '2026-08-10',
    verifiedAt: '2026-08-10',
    status: 'active',
    note: 'Rapport intégral et daté : SMIC à 2 000 euros brut et priorité à une issue diplomatique, non militaire, en Ukraine.',
  },
  {
    id: 'src-roussel-presidentielle-2026-07-06',
    url: 'https://po.pcf.fr/40e-congres/fabien-roussel-nous-sommes-prets-a-aller-a-la-presidentielle-la-marseillaise/',
    title: 'Fabien Roussel : « Nous sommes prêts à aller à la présidentielle »',
    publisher: 'Fédération des Pyrénées-Orientales du Parti communiste français',
    level: SOURCE_LEVEL.PRIMARY_OFFICIAL,
    type: 'interview_republiee',
    language: 'fr',
    publishedAt: '2026-07-06',
    eventAt: '2026-07-06',
    discoveredAt: '2026-08-10',
    verifiedAt: '2026-08-10',
    status: 'active',
    note: 'Confirme que la candidature reste soumise à l’aval des militants en septembre 2026.',
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
    id: 'src-lfi-avenir-en-commun-2025',
    url: 'https://programme.lafranceinsoumise.fr/wp-content/uploads/2025/avenir_en_commun_2025.pdf',
    title: 'L’Avenir en commun — édition 2025',
    publisher: 'La France insoumise',
    level: SOURCE_LEVEL.PRIMARY_OFFICIAL,
    type: 'programme_de_reference',
    language: 'fr',
    publishedAt: null,
    eventAt: null,
    discoveredAt: '2026-08-10',
    verifiedAt: '2026-08-10',
    status: 'active',
    note: 'Corpus officiel complet servant de base au programme 2027 ouvert aux amendements en mai 2026 ; ne pas le présenter comme l’édition électorale 2027 définitive.',
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
    id: 'src-lemonde-philippe-vision-2026-07-06',
    url: 'https://www.lemonde.fr/en/politics/article/2026/07/06/2027-presidential-election-philippe-outlines-moderate-right-wing-vision-for-french-recovery_6755200_5.html',
    title: '2027 presidential election: Philippe outlines moderate right-wing vision for French recovery',
    publisher: 'Le Monde',
    level: SOURCE_LEVEL.PRESS,
    type: 'etat_de_campagne',
    language: 'en',
    publishedAt: '2026-07-06',
    eventAt: '2026-07-05',
    discoveredAt: '2026-08-10',
    verifiedAt: '2026-08-10',
    status: 'active',
    note: 'Confirme le lancement de campagne et une orientation de droite modérée, mais pas encore une liste détaillée de mesures ; maturité maintenue à M1.',
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
// Le premier passage de codage s'appuie uniquement sur des pages, discours et entretiens
// officiels. Une position explicite devient PENDING_REVIEW ; une question que le corpus ne
// tranche pas reste à `stance: null`. Aucun de ces codages n'alimente le score avant une
// relecture indépendante.
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
  ...FR2027_QUESTION_IDS.map(questionId => {
    const coded = {
      fr_2027_q1: {
        stance: -2,
        sourceIds: ['src-lisnard-bfmtv-retraites-2025-11-18'],
        excerpt: 'Un parti comme le RN qui vous dit qu’on va abaisser l’âge de la retraite se fout du monde !',
        reasoning: 'La déclaration rejette directement un abaissement de l’âge de départ par rapport au droit actuel à 64 ans.',
        evidenceType: 'interview', confidence: 0.98, validFrom: '2025-11-18',
      },
      fr_2027_q2: {
        stance: 2,
        sourceIds: ['src-lisnard-programme-immigration-2027'],
        excerpt: 'Diviser par huit la délivrance de titres de séjour',
        reasoning: 'La réduction proposée est explicite et nettement plus forte qu’un simple ajustement des flux.',
        evidenceType: 'programme', confidence: 0.99, validFrom: '2026-08-10',
      },
      fr_2027_q3: {
        stance: 2,
        sourceIds: ['src-lisnard-strategy-2026-06-29'],
        excerpt: 'prolonger le parc, exécuter l’EPR2, lancer les petits réacteurs modulaires',
        reasoning: 'Le corpus prévoit plusieurs investissements nucléaires lourds et de long terme.',
        evidenceType: 'interview', confidence: 0.98, validFrom: '2026-06-29',
      },
      fr_2027_q4: {
        stance: 1,
        sourceIds: ['src-lisnard-programme-institutions-2027'],
        excerpt: 'L’Europe institutionnelle est une conquête et un outil nécessaire',
        reasoning: 'Le projet veut renforcer des coopérations européennes concrètes tout en rapatriant certaines compétences : accord, mais non fédéraliste.',
        evidenceType: 'programme', confidence: 0.88, validFrom: '2026-08-10',
      },
      fr_2027_q6: {
        stance: -2,
        sourceIds: ['src-lisnard-saint-raphael-2026-07-03'],
        excerpt: 'L’écologie passera par la croissance, la science, la recherche, l’innovation et l’investissement.',
        reasoning: 'Le discours rejette explicitement une écologie punitive qui renchérit les coûts des ménages, tout en soutenant l’action climatique technologique.',
        evidenceType: 'discours', confidence: 0.9, validFrom: '2026-07-03',
      },
      fr_2027_q7: {
        stance: 2,
        sourceIds: ['src-lisnard-programme-security-2027'],
        excerpt: 'accès aux fichiers, possibilité de verbalisation renforcée',
        reasoning: 'Le projet accroît explicitement les outils, pouvoirs et moyens des forces de sécurité et de la justice.',
        evidenceType: 'programme', confidence: 0.98, validFrom: '2026-08-10',
      },
      // ⚠ RECODÉE APRÈS SECONDE LECTURE. Le codage d'origine s'appuyait sur une page ne
      // traitant que des impôts de PRODUCTION (C3S, CVAE) — un autre prélèvement, un autre
      // débat. La question porte sur l'impôt sur les SOCIÉTÉS. Source remplacée par la page
      // fiscale, qui l'énonce. Codée par le relecteur : elle attend la lecture d'un tiers.
      fr_2027_q8: {
        stance: 2,
        codedBy: 'claude-opus-5-recode-2026-08-12',
        sourceIds: ['src-lisnard-fiscalite-2027'],
        excerpt: 'L’IS serait ramené à 20 % au niveau national, avec une liberté de taux local (entre 0 et 5%)',
        reasoning: 'Le taux national de l’impôt sur les sociétés est explicitement ramené à 20 %, dans un ensemble visant 100 milliards de baisse nette des prélèvements. La mesure porte bien sur l’IS, distinct des impôts de production traités séparément dans la même page.',
        evidenceType: 'programme', confidence: 0.95, validFrom: '2026-08-12',
      },
      fr_2027_q9: {
        stance: 1,
        sourceIds: ['src-lisnard-strategy-2026-06-29'],
        excerpt: 'l’OTAN, le soutien à l’Ukraine, le renforcement de la base industrielle de défense européenne',
        reasoning: 'Le soutien est explicite, mais la source ne formule pas un engagement littéral sans limite de durée.',
        evidenceType: 'interview', confidence: 0.82, validFrom: '2026-06-29',
      },
      fr_2027_q10: {
        stance: 1,
        sourceIds: ['src-lisnard-programme-security-2027'],
        excerpt: 'interdiction du voile à l’université',
        reasoning: 'Le projet propose des restrictions religieuses supplémentaires dans une institution publique, sans énoncer une interdiction générale dans tout espace public.',
        evidenceType: 'programme', confidence: 0.86, validFrom: '2026-08-10',
      },
      fr_2027_q15: {
        stance: 2,
        sourceIds: ['src-lisnard-bayeux-2026-06-17'],
        excerpt: 'Le référendum d’initiative populaire sera vraiment institué et rendu praticable',
        reasoning: 'La proposition répond directement à l’initiative citoyenne de référendums, avec seuil et vote garanti.',
        evidenceType: 'discours', confidence: 0.99, validFrom: '2026-06-17',
      },
      fr_2027_q16: {
        stance: 2,
        sourceIds: ['src-lisnard-dissuasion-2026-03-06'],
        excerpt: 'la réévaluation à la hausse de notre arsenal',
        reasoning: 'La chronique approuve une hausse de l’arsenal, le renouvellement des composantes et l’autonomie stratégique.',
        evidenceType: 'interview', confidence: 0.98, validFrom: '2026-03-06',
      },
    }[questionId];

    return applySecondReading({
      candidateId: 'david-lisnard',
      questionId,
      stance: coded?.stance ?? null,
      sourceIds: coded?.sourceIds ?? ['src-lisnard-programme-2027'],
      excerpt: coded?.excerpt ?? null,
      reasoning: coded?.reasoning ?? null,
      evidenceType: coded?.evidenceType ?? 'programme',
      confidence: coded?.confidence ?? null,
      reviewStatus: coded ? REVIEW_STATUS.PENDING_REVIEW : REVIEW_STATUS.TO_REVIEW,
      codedBy: coded ? (coded.codedBy ?? 'codex-source-pass-2026-08-10') : null,
      reviewedBy: null,
      validFrom: coded?.validFrom ?? null,
      supersedesId: null,
    });
  }),
  ...FR2027_QUESTION_IDS.map(questionId => {
    const coded = {
      fr_2027_q1: {
        stance: -1,
        sourceIds: ['src-attal-tf1-rn-2026-07-07'],
        excerpt: 'Il critique un programme qui prévoit de financer la retraite à 60 ans',
        reasoning: 'La campagne critique explicitement le retour à 60 ans, sans exclure littéralement tout ajustement inférieur à 64 ans : désaccord modéré.',
        evidenceType: 'interview', confidence: 0.82, validFrom: '2026-07-07',
      },
      fr_2027_q2: {
        stance: 1,
        sourceIds: ['src-attal-frontieres-2027'],
        excerpt: 'accueillir moins pour accueillir mieux',
        reasoning: 'Le chantier propose une baisse des flux et du regroupement familial, mais pas une réduction qualifiée de drastique.',
        evidenceType: 'programme', confidence: 0.93, validFrom: '2026-08-10',
      },
      fr_2027_q4: {
        stance: 2,
        sourceIds: ['src-attal-europe-2026-06-24'],
        excerpt: 'cette puissance passe par l’Europe',
        reasoning: 'La tribune propose une Europe des coalitions plus intégrée dans l’action et une future réadhésion britannique.',
        evidenceType: 'programme', confidence: 0.97, validFrom: '2026-06-24',
      },
      fr_2027_q8: {
        stance: 1,
        sourceIds: ['src-attal-profile-2026-05-22'],
        excerpt: 'la baisse des impôts — notamment sur les sociétés',
        reasoning: 'La page officielle lui attribue cette orientation, mais ne la formule pas encore comme un engagement chiffré du programme 2027.',
        evidenceType: 'inference', confidence: 0.86, validFrom: '2026-05-22',
      },
      fr_2027_q9: {
        stance: 2,
        sourceIds: ['src-attal-frontieres-2027'],
        excerpt: 'Nous allons continuer sans relâche à soutenir l’Ukraine.',
        reasoning: 'La formulation répond directement au soutien prolongé aussi longtemps que nécessaire.',
        evidenceType: 'programme', confidence: 0.99, validFrom: '2026-08-10',
      },
      fr_2027_q16: {
        stance: 1,
        sourceIds: ['src-attal-frontieres-2027'],
        excerpt: 'Notre dissuasion nucléaire doit être un outil de puissance',
        reasoning: 'Le chantier renforce la dissuasion, mais l’inscrit dans une protection européenne plutôt que dans une autonomie française littéralement exclusive.',
        evidenceType: 'programme', confidence: 0.88, validFrom: '2026-08-10',
      },
    }[questionId];

    return applySecondReading({
      candidateId: 'gabriel-attal',
      questionId,
      stance: coded?.stance ?? null,
      sourceIds: coded?.sourceIds ?? ['src-attal-campagne-2027'],
      excerpt: coded?.excerpt ?? null,
      reasoning: coded?.reasoning ?? null,
      evidenceType: coded?.evidenceType ?? 'programme',
      confidence: coded?.confidence ?? null,
      reviewStatus: coded ? REVIEW_STATUS.PENDING_REVIEW : REVIEW_STATUS.TO_REVIEW,
      codedBy: coded ? (coded.codedBy ?? 'codex-source-pass-2026-08-10') : null,
      reviewedBy: null,
      validFrom: coded?.validFrom ?? null,
      supersedesId: null,
    });
  }),
  ...FR2027_QUESTION_IDS.map(questionId => {
    const coded = {
      fr_2027_q1: {
        stance: 2,
        sourceIds: ['src-roussel-marseille-2025-11-23'],
        excerpt: 'nous abrogerons vraiment la réforme des retraites à 64 ans',
        reasoning: 'L’abrogation explicite de la réforme implique un âge légal inférieur aux 64 ans actuels.',
        evidenceType: 'discours', confidence: 0.98, validFrom: '2025-11-23',
      },
      fr_2027_q3: {
        stance: 2,
        sourceIds: ['src-roussel-energie-2026-04-08'],
        excerpt: '20 réacteurs EPR2 et de 12 petits réacteurs modulaires d’ici 2050',
        reasoning: 'Le nombre et l’horizon proposés constituent un investissement nucléaire massif sur plusieurs décennies.',
        evidenceType: 'proposition', confidence: 0.99, validFrom: '2026-04-08',
      },
      fr_2027_q5: {
        stance: 2,
        sourceIds: ['src-roussel-marseille-2025-11-23'],
        excerpt: 'un vaste plan de formation de soignants et d’enseignants',
        reasoning: 'Le discours promet un plan public de grande ampleur pour les deux secteurs visés par la question.',
        evidenceType: 'discours', confidence: 0.91, validFrom: '2025-11-23',
      },
      fr_2027_q9: {
        stance: -2,
        sourceIds: ['src-roussel-cn-2025-05-17'],
        excerpt: 'L’issue du conflit sera diplomatique et non militaire.',
        reasoning: 'Cette formulation rejette la poursuite indéfinie d’une solution militaire au profit d’une issue diplomatique.',
        evidenceType: 'discours', confidence: 0.94, validFrom: '2025-05-17',
      },
      fr_2027_q10: {
        stance: -1,
        sourceIds: ['src-roussel-laicite-2025-11-13'],
        excerpt: 'La laïcité ne doit pas être instrumentalisée pour en faire un vecteur de ségrégation et d’exclusion.',
        reasoning: 'Roussel défend une laïcité ferme contre l’intégrisme mais refuse son extension en règles générales d’exclusion dans l’espace public.',
        evidenceType: 'declaration', confidence: 0.84, validFrom: '2025-11-13',
      },
      fr_2027_q11: {
        stance: 2,
        sourceIds: ['src-roussel-cn-2025-05-17'],
        excerpt: 'indexation des salaires et des pensions sur l’inflation, SMIC à 2000 euros brut',
        reasoning: 'L’objectif chiffré de 2 000 euros brut, ajouté à l’indexation, dépasse nettement la seule compensation de l’inflation.',
        evidenceType: 'discours', confidence: 0.99, validFrom: '2025-05-17',
      },
    }[questionId];

    return applySecondReading({
      candidateId: 'fabien-roussel',
      questionId,
      stance: coded?.stance ?? null,
      sourceIds: coded?.sourceIds ?? ['src-roussel-presidentielle-2026-07-06'],
      excerpt: coded?.excerpt ?? null,
      reasoning: coded?.reasoning ?? null,
      evidenceType: coded?.evidenceType ?? 'programme',
      confidence: coded?.confidence ?? null,
      reviewStatus: coded ? REVIEW_STATUS.PENDING_REVIEW : REVIEW_STATUS.TO_REVIEW,
      codedBy: coded ? (coded.codedBy ?? 'codex-source-pass-2026-08-10') : null,
      reviewedBy: null,
      validFrom: coded?.validFrom ?? null,
      supersedesId: null,
    });
  }),
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
