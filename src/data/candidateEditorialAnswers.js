// POLISCOP — Réponses éditoriales des candidats (voie `editorial-estimate-v2`).
//
// POURQUOI CETTE VOIE EXISTE
// --------------------------
// La voie stricte (`sourced-positions`, candidateProvenance.js) exige par position : source
// vérifiée, extrait, raisonnement, codage, relecture, date. Elle est la cible. Au 2026-08-10,
// elle ne contient AUCUNE position approuvée, donc aucun candidat n'est comparable et le
// produit n'affiche plus rien.
//
// Cette voie-ci est la meilleure estimation raisonnable disponible aujourd'hui : ce que
// Poliscop pense qu'un candidat répondrait, à partir de ses déclarations, de son programme,
// de son groupe parlementaire et de la ligne qu'il endosse. Elle est PUBLIQUE, mais toujours
// présentée comme une estimation, jamais comme une vérification.
//
// ⚠ LES DEUX VOIES NE SE MÉLANGENT PAS SILENCIEUSEMENT. Une estimation n'entre jamais dans un
// résultat étiqueté « vérifié », et `pending_review` ne devient pas admissible dans le moteur
// strict. Le mode éditorial doit être demandé explicitement par l'appelant.
//
// ORIGINE DES VALEURS
// -------------------
// Les réponses spécifiques à l'élection proviennent de
// `elections.js → specificQuestions[].positions`. Les réponses générales sont un corpus
// explicite de 128 questions × 11 candidats : 16 CORE ci-dessous et 112 non-CORE dans
// candidateEditorialCorpus2027.js. Ce corpus ne remplace pas la voie stricte : il permet une
// V1 produit complète en disant clairement qu'il s'agit d'estimations.

import { elections } from './elections.js';
import {
  GENERAL_CANDIDATE_ORDER,
  NON_CORE_ANSWERS,
} from './candidateEditorialCorpus2027.js';
import { QUESTIONNAIRE_VERSION } from '../engine/versions.js';
import { resolveCandidateId } from './candidateRegistry.js';

/** Version du jeu de réponses éditoriales. À incrémenter à toute révision de fond. */
export const EDITORIAL_ANSWERS_VERSION = 'editorial-estimate-v2';

/** Date de la relecture éditoriale de ce jeu. */
export const EDITORIAL_REVIEWED_AT = '2026-08-10';

/**
 * Bases de codage admises, de la plus probante à la plus faible.
 * Une base doit dire D'OÙ vient l'estimation, pas à quel point on y croit.
 */
export const ANSWER_BASIS = Object.freeze({
  DIRECT_CURRENT:      'direct-current',           // déclaration explicite et récente
  DIRECT_OLDER:        'direct-older',             // déclaration explicite mais ancienne
  OFFICIAL_PROGRAMME:  'official-programme',       // programme publié du candidat
  PARTY_ENDORSED:      'party-endorsed',           // ligne du parti que le candidat endosse
  PARLIAMENTARY_RECORD:'parliamentary-record',     // votes et amendements
  CONSISTENT_RECORD:   'consistent-public-record', // constance sur plusieurs années
  SECONDARY_REPORT:    'reliable-secondary-report',
  EDITORIAL_INFERENCE: 'editorial-inference',      // déduction argumentée, non déclarée
  UNKNOWN:             'unknown',
});

/** États possibles d'une réponse candidate. */
export const ANSWER_STATE = Object.freeze({
  ESTIMATED:  'estimated',
  UNKNOWN:    'unknown',
  SUPERSEDED: 'superseded',
});

/**
 * Normalise la documentation individuelle d'une estimation.
 *
 * Une justification éditoriale explique la valeur, mais ne prouve pas à elle seule qu'elle
 * vient d'un programme officiel, d'un vote parlementaire ou d'une déclaration directe. Une
 * base forte n'est donc conservée que lorsque des identifiants de sources sont effectivement
 * enregistrés. Les entrées historiques sous forme de texte restent des déductions éditoriales.
 */
function candidateEvidence(row, candidateId) {
  const entry = row?.evidence?.[candidateId];
  if (!entry) {
    return { basis: ANSWER_BASIS.EDITORIAL_INFERENCE, rationale: null, sourceIds: [] };
  }

  const rationale = typeof entry === 'string' ? entry : (entry.rationale ?? null);
  const sourceIds = typeof entry === 'object' && Array.isArray(entry.sourceIds)
    ? entry.sourceIds.filter(Boolean)
    : [];
  const requestedBasis = typeof entry === 'object' && entry.basis ? entry.basis : row?.basis;

  return {
    basis: sourceIds.length > 0
      ? (requestedBasis ?? ANSWER_BASIS.EDITORIAL_INFERENCE)
      : ANSWER_BASIS.EDITORIAL_INFERENCE,
    rationale,
    sourceIds,
  };
}

/**
 * Relecture des 17 questions de `fr_2027`.
 *
 * ⚠ CORRECTION 2026-08-10 : `basis` s'appliquait autrefois à la LIGNE ENTIÈRE, donc aux dix
 * candidats d'un coup. Une question entière portait `official-programme` alors que
 * `sourceIds` était vide et que huit candidats sur dix n'avaient aucun raisonnement
 * individuel : 285 réponses sur 330 affichaient une provenance forte que rien ne soutenait.
 *
 * La provenance vit maintenant au niveau du COUPLE candidat × question. `basis` ci-dessous
 * n'est plus qu'un DÉFAUT DOCUMENTAIRE : il ne s'applique qu'aux candidats listés dans
 * `evidence`, c'est-à-dire ceux pour lesquels un raisonnement individuel existe. Tous les
 * autres reçoivent `editorial-inference`, qui est la vérité : une déduction éditoriale
 * argumentée mais non individuellement documentée.
 */
const FR2027_REVIEW = {
  fr_2027_q1:  { basis: ANSWER_BASIS.OFFICIAL_PROGRAMME,
    evidence: { lepen_2027: 'Le RN a défendu la retraite à 60 ans puis reculé vers 62 : position moins tranchée que la gauche.',
      lisnard: { rationale: 'Rejette explicitement l’abaissement de l’âge légal proposé par le RN.', basis: ANSWER_BASIS.DIRECT_CURRENT, sourceIds: ['src-lisnard-bfmtv-retraites-2025-11-18'] } } },
  fr_2027_q2:  { basis: ANSWER_BASIS.OFFICIAL_PROGRAMME,
    evidence: { ruffin: 'Ruffin refuse le cadrage identitaire mais ne défend pas l’ouverture des frontières, d’où une position médiane.',
             roussel_2027: 'Le PCF lie immigration et dumping social : ni fermeture, ni accueil inconditionnel.',
             lisnard: { rationale: 'Propose notamment de diviser par huit le nombre de titres de séjour.', sourceIds: ['src-lisnard-programme-immigration-2027'] } } },
  fr_2027_q3:  { basis: ANSWER_BASIS.PARTY_ENDORSED,
    evidence: { roussel_2027: 'Divergence majeure avec le reste de la gauche : le PCF est ouvertement pro-nucléaire.',
             melenchon_2027: 'LFI défend la sortie du nucléaire, à l’opposé du PCF.',
             lisnard: { rationale: 'Défend de nouveaux EPR2 et de petits réacteurs modulaires.', basis: ANSWER_BASIS.DIRECT_CURRENT, sourceIds: ['src-lisnard-strategy-2026-06-29'] } } },
  fr_2027_q4:  { basis: ANSWER_BASIS.CONSISTENT_RECORD,
    evidence: { melenchon_2027: 'Souverainisme de gauche : opposition à l’intégration, distincte du rejet identitaire du RN.',
      lisnard: { rationale: 'Juge l’Union nécessaire mais refuse le fédéralisme et veut redistribuer ses compétences.', basis: ANSWER_BASIS.OFFICIAL_PROGRAMME, sourceIds: ['src-lisnard-programme-institutions-2027'] } } },
  fr_2027_q5:  { basis: ANSWER_BASIS.OFFICIAL_PROGRAMME,
    evidence: { lisnard: { rationale: 'Promet des moyens ciblés, notamment pour les enseignants, mais présente la santé comme un problème d’organisation plutôt que de dépense globale.', sourceIds: ['src-lisnard-programme-sante-2027', 'src-lisnard-programme-education-2027'] } } },
  fr_2027_q6:  { basis: ANSWER_BASIS.PARTY_ENDORSED,
    evidence: { roussel_2027: 'Le PCF conditionne l’effort climatique au pouvoir d’achat des ménages modestes.',
      lisnard: { rationale: 'Rejette explicitement l’écologie punitive et les mesures qui renchérissent la vie quotidienne.', basis: ANSWER_BASIS.DIRECT_CURRENT, sourceIds: ['src-lisnard-saint-raphael-2026-07-03'] } } },
  fr_2027_q7:  { basis: ANSWER_BASIS.CONSISTENT_RECORD,
    evidence: { roussel_2027: 'Roussel assume une ligne sécuritaire nettement plus marquée que LFI.',
      lisnard: { rationale: 'Propose plus de moyens et de pouvoirs pour les forces de sécurité.', basis: ANSWER_BASIS.OFFICIAL_PROGRAMME, sourceIds: ['src-lisnard-programme-security-2027'] } } },
  fr_2027_q8:  { basis: ANSWER_BASIS.OFFICIAL_PROGRAMME,
    evidence: { lepen_2027: 'Le RN ne défend pas la baisse de l’impôt sur les sociétés comme la droite libérale.',
      lisnard: { rationale: 'Propose une baisse de l’impôt sur les sociétés à 20 % et des impôts de production.', sourceIds: ['src-lisnard-fiscalite-2027', 'src-lisnard-programme-ambition-2027'] } } },
  fr_2027_q9:  { basis: ANSWER_BASIS.DIRECT_CURRENT,
    evidence: { melenchon_2027: 'LFI soutient l’Ukraine mais refuse la livraison d’armes ; position basse, non nulle.',
             zemmour_2027: 'Position la plus défavorable au soutien militaire.',
             lisnard: { rationale: 'Soutient l’Ukraine et le renforcement des capacités européennes de défense, sans engagement littéral illimité.', sourceIds: ['src-lisnard-strategy-2026-06-29'] } } },
  fr_2027_q10: { basis: ANSWER_BASIS.CONSISTENT_RECORD,
    evidence: { roussel_2027: 'Laïcité stricte assumée, contrairement à LFI.',
             melenchon_2027: 'LFI conteste la laïcité dite « de combat ».',
             lisnard: { rationale: 'Propose notamment l’interdiction du voile à l’université, sans interdiction générale dans tout espace public.', basis: ANSWER_BASIS.OFFICIAL_PROGRAMME, sourceIds: ['src-lisnard-programme-security-2027'] } } },
  fr_2027_q11: { basis: ANSWER_BASIS.OFFICIAL_PROGRAMME,
    evidence: { lisnard: { rationale: 'Privilégie l’augmentation du salaire net par la baisse des charges plutôt qu’une hausse administrée du SMIC.', sourceIds: ['src-lisnard-saint-raphael-2026-07-03'] } } },
  fr_2027_q12: { basis: ANSWER_BASIS.OFFICIAL_PROGRAMME,
    evidence: { lisnard: { rationale: 'Privilégie la libération de l’offre et de la propriété plutôt que l’encadrement des loyers.', sourceIds: ['src-lisnard-logement-2027'] } } },
  fr_2027_q13: { basis: ANSWER_BASIS.PARTY_ENDORSED,
    evidence: { lisnard: 'Aucune position directe trouvée sur la gratuité universitaire ; valeur prudente déduite de sa doctrine de financement et de libre choix.' } },
  fr_2027_q14: { basis: ANSWER_BASIS.PARTY_ENDORSED,
    evidence: { roussel_2027: 'Sortie des fossiles adossée au nucléaire, pas aux seules renouvelables.',
      lisnard: { rationale: 'Soutient la décarbonation mais rejette les calendriers contraints jugés irréalistes ; le délai exact de 2040 n’est pas documenté.', basis: ANSWER_BASIS.OFFICIAL_PROGRAMME, sourceIds: ['src-lisnard-ppe3-2027'] } } },
  fr_2027_q15: { basis: ANSWER_BASIS.OFFICIAL_PROGRAMME,
    evidence: { lepen_2027: 'Le RN défend le référendum d’initiative citoyenne, comme une partie de la gauche.',
      lisnard: { rationale: 'Promet de rendre praticable le référendum d’initiative populaire.', basis: ANSWER_BASIS.DIRECT_CURRENT, sourceIds: ['src-lisnard-bayeux-2026-06-17'] } } },
  fr_2027_q16: { basis: ANSWER_BASIS.CONSISTENT_RECORD,
    evidence: { roussel_2027: 'Le PCF a rompu avec sa tradition de désarmement unilatéral.',
      lisnard: { rationale: 'Demande une réévaluation à la hausse de l’arsenal et le maintien de l’autonomie stratégique.', basis: ANSWER_BASIS.DIRECT_CURRENT, sourceIds: ['src-lisnard-dissuasion-2026-03-06'] } } },
  fr_2027_q17: { basis: ANSWER_BASIS.PARTY_ENDORSED,
    evidence: { lisnard: { rationale: 'Sa doctrine fiscale vise une baisse générale des prélèvements et de l’impôt sur les sociétés, donc pas une forte hausse sectorielle.', basis: ANSWER_BASIS.OFFICIAL_PROGRAMME, sourceIds: ['src-lisnard-fiscalite-2027'] } } },
};

// REDONDANCE OBSERVÉE — à ne pas décrire de travers.
//
// `fr_2027_q1` (abaisser l'âge de la retraite) et `fr_2027_q11` (augmenter le SMIC) reçoivent
// produisaient exactement la même ligne de dix réponses avant l’ajout de Lisnard. De même
// `q12` et `q13` ne
// diffèrent que sur un candidat.
//
// Ce n'est PAS un « pouvoir discriminant nul » : chacune sépare fortement les candidats, et
// prise seule chacune est informative. Le défaut est un défaut de PAIRE — elles produisent la
// même séparation, donc la seconde n'apporte aucune information par rapport à la première
// dans le corpus candidat actuel. Le poids de ce clivage économique est ainsi compté deux fois.
//
// Constat consigné, questions conservées : il faudra vérifier si la redondance vient des
// questions elles-mêmes ou d'un codage trop grossier, ce que ce corpus réduit ne suffit pas à
// trancher.

/**
 * Construit les réponses éditoriales d'une élection depuis ses `positions` relues.
 * Une valeur absente devient `unknown` — jamais `3`. Le centre est une opinion, pas un vide.
 */
function buildFromElection(electionId, review) {
  const election = elections.find(e => e.id === electionId);
  if (!election) return [];
  const out = [];
  for (const question of election.specificQuestions ?? []) {
    const row = review[question.id];
    for (const candidate of election.candidates) {
      const value = question.positions?.[candidate.id];
      const known = [1, 2, 3, 4, 5].includes(value);
      // Provenance INDIVIDUELLE : une base forte exige un raisonnement et une source propres.
      const individual = candidateEvidence(row, candidate.id);
      out.push({
        candidateId: resolveCandidateId(candidate.id) ?? candidate.id,
        electionCandidateId: candidate.id,
        questionId: question.id,
        questionSet: electionId,
        answerValue: known ? value : null,
        answerState: known ? ANSWER_STATE.ESTIMATED : ANSWER_STATE.UNKNOWN,
        basis: known ? individual.basis : ANSWER_BASIS.UNKNOWN,
        rationale: individual.rationale,
        sourceIds: known ? individual.sourceIds : [],
        validFrom: EDITORIAL_REVIEWED_AT,
        reviewedAt: EDITORIAL_REVIEWED_AT,
        supersedesId: null,
        questionnaireVersion: QUESTIONNAIRE_VERSION,
        questionSetVersion: `${electionId}@${EDITORIAL_REVIEWED_AT}`,
        codedBy: 'poliscop-editorial-2026-08',
        provenance: EDITORIAL_ANSWERS_VERSION,
      });
    }
  }
  return out;
}

// ─── Banque générale : les 16 questions CORE ────────────────────────────────
//
// Les CORE couvrent les huit thèmes, deux par thème : c'est le socle du mode Découverte.
// Les 112 autres questions actives sont codées dans candidateEditorialCorpus2027.js.

/**
 * Réponses attribuées sur les questions CORE.
 *
 * Codées AVANT tout calcul de profil, à partir des déclarations publiques, des programmes et
 * de la ligne endossée — pas en ajustant jusqu'à obtenir un classement voulu. Les écarts par
 * rapport au parti sont notés : ce sont eux qui empêchent un candidat de devenir la copie de
 * sa famille politique.
 */
const CORE_ANSWERS = {
  //            LePen Phil Attal Mélen Gluck Tond Retail Ruffin Rouss Zemm Lisn
  ECO_23: { v: [   2,   4,    4,    1,    2,   1,     4,     1,    2,   4,   5], basis: ANSWER_BASIS.CONSISTENT_RECORD,
    evidence: { lepen_2027: 'Ligne social-nationaliste : le RN ne défend pas la croissance au prix des inégalités.',
      lisnard: { rationale: 'Place la croissance, l’entreprise et la baisse des prélèvements au cœur de son projet.', basis: ANSWER_BASIS.OFFICIAL_PROGRAMME, sourceIds: ['src-lisnard-fiscalite-2027'] } } },
  SOC_7:  { v: [   4,   2,    1,    1,    1,   1,     5,     2,    2,   5,   3], basis: ANSWER_BASIS.CONSISTENT_RECORD,
    evidence: { attal: 'Position personnelle nettement progressiste, distincte d’une partie de sa majorité.',
             retailleau: 'Engagement constant et ancien contre le mariage pour tous.',
             lisnard: 'Aucune proposition suffisamment directe sur la famille dans le corpus actuel : valeur médiane, à revoir.' } },
  SOC_16: { v: [   1,   2,    1,    4,    2,   4,     1,     2,    1,   1,   1], basis: ANSWER_BASIS.PARLIAMENTARY_RECORD,
    evidence: { attal: 'A interdit l’abaya comme ministre de l’Éducation : laïcité stricte malgré un profil progressiste.',
             roussel_2027: 'Laïcité stricte assumée, à l’opposé de LFI sur ce point précis.',
             melenchon_2027: 'LFI conteste l’extension des interdictions de signes religieux.',
             lisnard: { rationale: 'Défend une laïcité stricte et des interdictions supplémentaires dans l’enseignement.', basis: ANSWER_BASIS.OFFICIAL_PROGRAMME, sourceIds: ['src-lisnard-programme-security-2027'] } } },
  IMM_1:  { v: [   5,   4,    3,    1,    2,   1,     5,     3,    2,   5,   5], basis: ANSWER_BASIS.OFFICIAL_PROGRAMME,
    evidence: { ruffin: 'Refuse le cadrage identitaire sans défendre l’ouverture : position médiane assumée.',
      lisnard: { rationale: 'Propose une réduction très forte des titres de séjour.', sourceIds: ['src-lisnard-programme-immigration-2027'] } } },
  SEC_3:  { v: [   5,   4,    4,    1,    3,   2,     5,     2,    3,   5,   4], basis: ANSWER_BASIS.PARLIAMENTARY_RECORD,
    evidence: { roussel_2027: 'Ligne sécuritaire plus ferme que le reste de la gauche.',
      lisnard: { rationale: 'Défend des pouvoirs de sécurité renforcés, sans documenter ici une suspension générale des libertés.', basis: ANSWER_BASIS.OFFICIAL_PROGRAMME, sourceIds: ['src-lisnard-programme-security-2027'] } } },
  DEM_8:  { v: [   3,   2,    3,    5,    4,   5,     2,     5,    5,   2,   3], basis: ANSWER_BASIS.PARTY_ENDORSED,
    evidence: { lisnard: 'Aucune position directe trouvée sur l’interdiction des grands dons privés : valeur médiane, à revoir.' } },
  DEM_21: { v: [   3,   1,    1,    2,    1,   1,     2,     2,    1,   4,   1], basis: ANSWER_BASIS.EDITORIAL_INFERENCE,
    evidence: { zemmour_2027: 'Seul à défendre ouvertement une reprise en main de la magistrature.',
      lisnard: { rationale: 'Son projet institutionnel maintient la séparation des pouvoirs et ne donne pas au gouvernement ce pouvoir de révocation.', basis: ANSWER_BASIS.OFFICIAL_PROGRAMME, sourceIds: ['src-lisnard-programme-institutions-2027'] } } },
  GLO_1:  { v: [   5,   2,    2,    4,    1,   1,     4,     4,    4,   5,   5], basis: ANSWER_BASIS.CONSISTENT_RECORD,
    evidence: { melenchon_2027: 'Souverainisme de gauche : primauté nationale sans rejet identitaire.',
             roussel_2027: 'Même souverainisme, motivé par la protection sociale et industrielle.',
             lisnard: { rationale: 'Défend explicitement la primauté nationale quand les règles européennes excèdent les compétences consenties.', basis: ANSWER_BASIS.OFFICIAL_PROGRAMME, sourceIds: ['src-lisnard-programme-institutions-2027'] } } },
  GLO_8:  { v: [   1,   4,    5,    1,    5,   4,     2,     1,    1,   1,   2], basis: ANSWER_BASIS.OFFICIAL_PROGRAMME,
    evidence: { glucksmann: 'Fédéraliste assumé : c’est ce qui le sépare le plus nettement de LFI.',
      lisnard: { rationale: 'Soutient la coopération européenne mais refuse une Europe fédérale qui déciderait davantage à la place des États.', sourceIds: ['src-lisnard-programme-institutions-2027'] } } },
  PUB_13: { v: [   2,   4,    3,    1,    1,   1,     4,     1,    1,   4,   5], basis: ANSWER_BASIS.OFFICIAL_PROGRAMME,
    evidence: { lepen_2027: 'Le RN défend la dépense sociale pour les nationaux : ni libéral, ni redistributif universel.',
      lisnard: { rationale: 'La baisse des dépenses publiques et le recentrage de l’État sont des piliers explicites du projet.', sourceIds: ['src-lisnard-programme-institutions-2027', 'src-lisnard-fiscalite-2027'] } } },
  IMM_23: { v: [   1,   3,    3,    5,    5,   5,     1,     4,    4,   1,   1], basis: ANSWER_BASIS.OFFICIAL_PROGRAMME,
    evidence: { retailleau: 'Remise en cause du droit du sol portée personnellement.',
      lisnard: { rationale: 'Propose de mettre fin à l’automaticité du droit du sol.', sourceIds: ['src-lisnard-programme-immigration-2027'] } } },
  ENV_25: { v: [   5,   4,    4,    2,    2,   1,     5,     3,    4,   5,   5], basis: ANSWER_BASIS.DIRECT_CURRENT,
    evidence: { roussel_2027: 'Soutien aux agriculteurs qui le distingue du reste de la gauche.',
      lisnard: 'Doctrine générale d’allègement des normes appliquée ici à l’agriculture ; source directe spécifique encore à ajouter.' } },
  PUB_25: { v: [   4,   3,    3,    5,    4,   5,     3,     5,    5,   2,   2], basis: ANSWER_BASIS.OFFICIAL_PROGRAMME,
    evidence: { lisnard: { rationale: 'Dit explicitement que les difficultés de la santé ne viennent pas d’un manque global d’argent et privilégie une réorganisation.', sourceIds: ['src-lisnard-programme-sante-2027'] } } },
  SEC_25: { v: [   1,   3,    3,    5,    4,   5,     1,     4,    3,   1,   3], basis: ANSWER_BASIS.CONSISTENT_RECORD,
    evidence: { roussel_2027: 'Plus réservé que le reste de la gauche sur le contrôle de la police.',
      lisnard: 'Aucune position directe trouvée sur ce mécanisme précis de contrôle de l’usage de la force : valeur médiane, à revoir.' } },
  ECO_29: { v: [   4,   2,    2,    5,    3,   4,     2,     5,    5,   3,   1], basis: ANSWER_BASIS.OFFICIAL_PROGRAMME,
    evidence: { lepen_2027: 'Le RN défend la renationalisation de l’énergie, contrairement à la droite libérale.',
      lisnard: { rationale: 'Doctrine libérale de réduction du périmètre économique de l’État, sans proposition de nationalisation énergétique.', sourceIds: ['src-lisnard-programme-ambition-2027'] } } },
  ENV_31: { v: [   1,   3,    3,    2,    4,   4,     1,     1,    1,   1,   1], basis: ANSWER_BASIS.CONSISTENT_RECORD,
    evidence: { melenchon_2027: 'LFI rejette la taxe carbone sur les ménages, comme le PCF.',
             roussel_2027: 'Opposition constante à la fiscalité carbone pesant sur les ménages modestes.',
             ruffin: 'Hostile à toute écologie punitive pour les classes populaires.',
             lisnard: { rationale: 'Rejette une politique climatique qui augmenterait directement le coût supporté par les ménages.', basis: ANSWER_BASIS.DIRECT_CURRENT, sourceIds: ['src-lisnard-saint-raphael-2026-07-03', 'src-lisnard-ppe3-2027'] } } },
};

/** Construit les réponses éditoriales sur la banque générale. */
function buildGeneralAnswers() {
  const out = [];
  const completeCorpus = { ...CORE_ANSWERS, ...NON_CORE_ANSWERS };
  for (const [questionId, row] of Object.entries(completeCorpus)) {
    GENERAL_CANDIDATE_ORDER.forEach((electionCandidateId, index) => {
      const value = row.v[index];
      const known = [1, 2, 3, 4, 5].includes(value);
      const individual = candidateEvidence(row, electionCandidateId);
      out.push({
        candidateId: resolveCandidateId(electionCandidateId) ?? electionCandidateId,
        electionCandidateId,
        questionId,
        questionSet: 'general',
        answerValue: known ? value : null,
        answerState: known ? ANSWER_STATE.ESTIMATED : ANSWER_STATE.UNKNOWN,
        basis: known ? individual.basis : ANSWER_BASIS.UNKNOWN,
        rationale: individual.rationale,
        sourceIds: known ? individual.sourceIds : [],
        validFrom: EDITORIAL_REVIEWED_AT,
        reviewedAt: EDITORIAL_REVIEWED_AT,
        supersedesId: null,
        questionnaireVersion: QUESTIONNAIRE_VERSION,
        questionSetVersion: `general@${QUESTIONNAIRE_VERSION}`,
        codedBy: 'poliscop-editorial-2026-08',
        provenance: EDITORIAL_ANSWERS_VERSION,
      });
    });
  }
  return out;
}

/** Toutes les réponses éditoriales connues. */
export const EDITORIAL_ANSWERS = Object.freeze([
  ...buildFromElection('fr_2027', FR2027_REVIEW),
  ...buildGeneralAnswers(),
]);

const BY_CANDIDATE = new Map();
for (const answer of EDITORIAL_ANSWERS) {
  if (!BY_CANDIDATE.has(answer.candidateId)) BY_CANDIDATE.set(answer.candidateId, []);
  BY_CANDIDATE.get(answer.candidateId).push(answer);
}

/**
 * Réponses éditoriales d'un candidat, pour un jeu de questions donné.
 * @param {string} candidateId identifiant d'élection ou canonique
 * @param {string} [questionSet] limite au jeu de questions (ex. `fr_2027`)
 */
export function getEditorialAnswers(candidateId, questionSet = null) {
  const canonical = resolveCandidateId(candidateId) ?? candidateId;
  const all = BY_CANDIDATE.get(canonical) ?? [];
  return questionSet ? all.filter(a => a.questionSet === questionSet) : all;
}

/** Couverture éditoriale : combien de réponses connues, sur combien de questions. */
export function editorialCoverage(candidateId, questionSet = null) {
  const answers = getEditorialAnswers(candidateId, questionSet);
  const known = answers.filter(a => a.answerState === ANSWER_STATE.ESTIMATED).length;
  return { known, total: answers.length, unknown: answers.length - known };
}

/** Candidats disposant d'au moins une réponse éditoriale. */
export function candidatesWithEditorialAnswers() {
  return [...BY_CANDIDATE.keys()];
}
