// POLISCOP — Réponses éditoriales des candidats (voie `editorial-estimate-v1`).
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
// Les 170 valeurs proviennent de `elections.js → specificQuestions[].positions`, qui servaient
// déjà de repli silencieux avant `83bde2b`. Elles ne sont PAS réactivées telles quelles : chaque
// ligne de question a été relue le 2026-08-10, sa base de codage déclarée, et les divergences
// individuelles par rapport à la ligne du parti explicitement notées ci-dessous.

import { elections } from './elections.js';
import { QUESTIONNAIRE_VERSION } from '../engine/versions.js';
import { resolveCandidateId } from './candidateRegistry.js';

/** Version du jeu de réponses éditoriales. À incrémenter à toute révision de fond. */
export const EDITORIAL_ANSWERS_VERSION = 'editorial-estimate-v1';

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
    evidence: { lepen_2027: 'Le RN a défendu la retraite à 60 ans puis reculé vers 62 : position moins tranchée que la gauche.' } },
  fr_2027_q2:  { basis: ANSWER_BASIS.OFFICIAL_PROGRAMME,
    evidence: { ruffin: 'Ruffin refuse le cadrage identitaire mais ne défend pas l’ouverture des frontières, d’où une position médiane.',
             roussel_2027: 'Le PCF lie immigration et dumping social : ni fermeture, ni accueil inconditionnel.' } },
  fr_2027_q3:  { basis: ANSWER_BASIS.PARTY_ENDORSED,
    evidence: { roussel_2027: 'Divergence majeure avec le reste de la gauche : le PCF est ouvertement pro-nucléaire.',
             melenchon_2027: 'LFI défend la sortie du nucléaire, à l’opposé du PCF.' } },
  fr_2027_q4:  { basis: ANSWER_BASIS.CONSISTENT_RECORD,
    evidence: { melenchon_2027: 'Souverainisme de gauche : opposition à l’intégration, distincte du rejet identitaire du RN.' } },
  fr_2027_q5:  { basis: ANSWER_BASIS.OFFICIAL_PROGRAMME, evidence: {} },
  fr_2027_q6:  { basis: ANSWER_BASIS.PARTY_ENDORSED,
    evidence: { roussel_2027: 'Le PCF conditionne l’effort climatique au pouvoir d’achat des ménages modestes.' } },
  fr_2027_q7:  { basis: ANSWER_BASIS.CONSISTENT_RECORD,
    evidence: { roussel_2027: 'Roussel assume une ligne sécuritaire nettement plus marquée que LFI.' } },
  fr_2027_q8:  { basis: ANSWER_BASIS.OFFICIAL_PROGRAMME,
    evidence: { lepen_2027: 'Le RN ne défend pas la baisse de l’impôt sur les sociétés comme la droite libérale.' } },
  fr_2027_q9:  { basis: ANSWER_BASIS.DIRECT_CURRENT,
    evidence: { melenchon_2027: 'LFI soutient l’Ukraine mais refuse la livraison d’armes ; position basse, non nulle.',
             zemmour_2027: 'Position la plus défavorable au soutien militaire.' } },
  fr_2027_q10: { basis: ANSWER_BASIS.CONSISTENT_RECORD,
    evidence: { roussel_2027: 'Laïcité stricte assumée, contrairement à LFI.',
             melenchon_2027: 'LFI conteste la laïcité dite « de combat ».' } },
  fr_2027_q11: { basis: ANSWER_BASIS.OFFICIAL_PROGRAMME, evidence: {} },
  fr_2027_q12: { basis: ANSWER_BASIS.OFFICIAL_PROGRAMME, evidence: {} },
  fr_2027_q13: { basis: ANSWER_BASIS.PARTY_ENDORSED, evidence: {} },
  fr_2027_q14: { basis: ANSWER_BASIS.PARTY_ENDORSED,
    evidence: { roussel_2027: 'Sortie des fossiles adossée au nucléaire, pas aux seules renouvelables.' } },
  fr_2027_q15: { basis: ANSWER_BASIS.OFFICIAL_PROGRAMME,
    evidence: { lepen_2027: 'Le RN défend le référendum d’initiative citoyenne, comme une partie de la gauche.' } },
  fr_2027_q16: { basis: ANSWER_BASIS.CONSISTENT_RECORD,
    evidence: { roussel_2027: 'Le PCF a rompu avec sa tradition de désarmement unilatéral.' } },
  fr_2027_q17: { basis: ANSWER_BASIS.PARTY_ENDORSED, evidence: {} },
};

// REDONDANCE OBSERVÉE — à ne pas décrire de travers.
//
// `fr_2027_q1` (abaisser l'âge de la retraite) et `fr_2027_q11` (augmenter le SMIC) reçoivent
// exactement la même ligne de dix réponses : 4 2 2 5 4 5 1 5 5 1. De même `q12` et `q13` ne
// diffèrent que sur un candidat.
//
// Ce n'est PAS un « pouvoir discriminant nul » : chacune sépare fortement les candidats, et
// prise seule chacune est informative. Le défaut est un défaut de PAIRE — elles produisent la
// même séparation, donc la seconde n'apporte aucune information par rapport à la première
// dans le corpus candidat actuel. Le poids de ce clivage économique est ainsi compté deux fois.
//
// Constat consigné, questions conservées : il faudra vérifier si la redondance vient des
// questions elles-mêmes ou d'un codage trop grossier, ce que 10 candidats ne suffisent pas à
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
      // Provenance INDIVIDUELLE : une base forte exige un raisonnement propre au candidat.
      const individual = row?.evidence?.[candidate.id] ?? null;
      const basis = !known ? ANSWER_BASIS.UNKNOWN
        : individual ? (row?.basis ?? ANSWER_BASIS.EDITORIAL_INFERENCE)
        : ANSWER_BASIS.EDITORIAL_INFERENCE;
      out.push({
        candidateId: resolveCandidateId(candidate.id) ?? candidate.id,
        electionCandidateId: candidate.id,
        questionId: question.id,
        questionSet: electionId,
        answerValue: known ? value : null,
        answerState: known ? ANSWER_STATE.ESTIMATED : ANSWER_STATE.UNKNOWN,
        basis,
        rationale: individual,
        sourceIds: [],
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
// Les CORE couvrent les huit thèmes, deux par thème : c'est le socle minimal pour dériver un
// profil thématique complet, et c'est exactement le contenu du mode Découverte. Les 112 autres
// questions actives restent à coder — leur absence est déclarée, pas masquée.
//
// Ordre des colonnes, une fois pour toutes :
const GENERAL_CANDIDATE_ORDER = [
  'lepen_2027', 'philippe', 'attal', 'melenchon_2027', 'glucksmann',
  'tondelier', 'retailleau', 'ruffin', 'roussel_2027', 'zemmour_2027',
];

/**
 * Réponses attribuées sur les questions CORE.
 *
 * Codées AVANT tout calcul de profil, à partir des déclarations publiques, des programmes et
 * de la ligne endossée — pas en ajustant jusqu'à obtenir un classement voulu. Les écarts par
 * rapport au parti sont notés : ce sont eux qui empêchent un candidat de devenir la copie de
 * sa famille politique.
 */
const CORE_ANSWERS = {
  //            LePen Phil Attal Mélen Gluck Tond Retail Ruffin Rouss Zemm
  ECO_23: { v: [   2,   4,    4,    1,    2,   1,     4,     1,    2,   4], basis: ANSWER_BASIS.CONSISTENT_RECORD,
    evidence: { lepen_2027: 'Ligne social-nationaliste : le RN ne défend pas la croissance au prix des inégalités.' } },
  SOC_7:  { v: [   4,   2,    1,    1,    1,   1,     5,     2,    2,   5], basis: ANSWER_BASIS.CONSISTENT_RECORD,
    evidence: { attal: 'Position personnelle nettement progressiste, distincte d’une partie de sa majorité.',
             retailleau: 'Engagement constant et ancien contre le mariage pour tous.' } },
  SOC_16: { v: [   1,   2,    1,    4,    2,   4,     1,     2,    1,   1], basis: ANSWER_BASIS.PARLIAMENTARY_RECORD,
    evidence: { attal: 'A interdit l’abaya comme ministre de l’Éducation : laïcité stricte malgré un profil progressiste.',
             roussel_2027: 'Laïcité stricte assumée, à l’opposé de LFI sur ce point précis.',
             melenchon_2027: 'LFI conteste l’extension des interdictions de signes religieux.' } },
  IMM_1:  { v: [   5,   4,    3,    1,    2,   1,     5,     3,    2,   5], basis: ANSWER_BASIS.OFFICIAL_PROGRAMME,
    evidence: { ruffin: 'Refuse le cadrage identitaire sans défendre l’ouverture : position médiane assumée.' } },
  SEC_3:  { v: [   5,   4,    4,    1,    3,   2,     5,     2,    3,   5], basis: ANSWER_BASIS.PARLIAMENTARY_RECORD,
    evidence: { roussel_2027: 'Ligne sécuritaire plus ferme que le reste de la gauche.' } },
  DEM_8:  { v: [   3,   2,    3,    5,    4,   5,     2,     5,    5,   2], basis: ANSWER_BASIS.PARTY_ENDORSED, evidence: {} },
  DEM_21: { v: [   3,   1,    1,    2,    1,   1,     2,     2,    1,   4], basis: ANSWER_BASIS.EDITORIAL_INFERENCE,
    evidence: { zemmour_2027: 'Seul à défendre ouvertement une reprise en main de la magistrature.' } },
  GLO_1:  { v: [   5,   2,    2,    4,    1,   1,     4,     4,    4,   5], basis: ANSWER_BASIS.CONSISTENT_RECORD,
    evidence: { melenchon_2027: 'Souverainisme de gauche : primauté nationale sans rejet identitaire.',
             roussel_2027: 'Même souverainisme, motivé par la protection sociale et industrielle.' } },
  GLO_8:  { v: [   1,   4,    5,    1,    5,   4,     2,     1,    1,   1], basis: ANSWER_BASIS.OFFICIAL_PROGRAMME,
    evidence: { glucksmann: 'Fédéraliste assumé : c’est ce qui le sépare le plus nettement de LFI.' } },
  PUB_13: { v: [   2,   4,    3,    1,    1,   1,     4,     1,    1,   4], basis: ANSWER_BASIS.OFFICIAL_PROGRAMME,
    evidence: { lepen_2027: 'Le RN défend la dépense sociale pour les nationaux : ni libéral, ni redistributif universel.' } },
  IMM_23: { v: [   1,   3,    3,    5,    5,   5,     1,     4,    4,   1], basis: ANSWER_BASIS.OFFICIAL_PROGRAMME,
    evidence: { retailleau: 'Remise en cause du droit du sol portée personnellement.' } },
  ENV_25: { v: [   5,   4,    4,    2,    2,   1,     5,     3,    4,   5], basis: ANSWER_BASIS.DIRECT_CURRENT,
    evidence: { roussel_2027: 'Soutien aux agriculteurs qui le distingue du reste de la gauche.' } },
  PUB_25: { v: [   4,   3,    3,    5,    4,   5,     3,     5,    5,   2], basis: ANSWER_BASIS.OFFICIAL_PROGRAMME, evidence: {} },
  SEC_25: { v: [   1,   3,    3,    5,    4,   5,     1,     4,    3,   1], basis: ANSWER_BASIS.CONSISTENT_RECORD,
    evidence: { roussel_2027: 'Plus réservé que le reste de la gauche sur le contrôle de la police.' } },
  ECO_29: { v: [   4,   2,    2,    5,    3,   4,     2,     5,    5,   3], basis: ANSWER_BASIS.OFFICIAL_PROGRAMME,
    evidence: { lepen_2027: 'Le RN défend la renationalisation de l’énergie, contrairement à la droite libérale.' } },
  ENV_31: { v: [   1,   3,    3,    2,    4,   4,     1,     1,    1,   1], basis: ANSWER_BASIS.CONSISTENT_RECORD,
    evidence: { melenchon_2027: 'LFI rejette la taxe carbone sur les ménages, comme le PCF.',
             roussel_2027: 'Opposition constante à la fiscalité carbone pesant sur les ménages modestes.',
             ruffin: 'Hostile à toute écologie punitive pour les classes populaires.' } },
};

/** Construit les réponses éditoriales sur la banque générale. */
function buildGeneralAnswers() {
  const out = [];
  for (const [questionId, row] of Object.entries(CORE_ANSWERS)) {
    GENERAL_CANDIDATE_ORDER.forEach((electionCandidateId, index) => {
      const value = row.v[index];
      const known = [1, 2, 3, 4, 5].includes(value);
      const individual = row.evidence?.[electionCandidateId] ?? null;
      const basis = !known ? ANSWER_BASIS.UNKNOWN
        : individual ? row.basis
        : ANSWER_BASIS.EDITORIAL_INFERENCE;
      out.push({
        candidateId: resolveCandidateId(electionCandidateId) ?? electionCandidateId,
        electionCandidateId,
        questionId,
        questionSet: 'general',
        answerValue: known ? value : null,
        answerState: known ? ANSWER_STATE.ESTIMATED : ANSWER_STATE.UNKNOWN,
        basis,
        rationale: individual,
        sourceIds: [],
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
