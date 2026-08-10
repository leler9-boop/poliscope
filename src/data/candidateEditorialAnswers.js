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
 * Relecture ligne par ligne des 17 questions de `fr_2027`.
 *
 * `basis` s'applique à la ligne entière ; `notes` consigne les candidats dont la position
 * s'écarte de la ligne de leur parti — c'est là que le codage cesse d'être une déduction
 * d'étiquette. Sans ces notes, Roussel deviendrait une copie de Mélenchon, ce qu'il n'est pas.
 */
const FR2027_REVIEW = {
  fr_2027_q1:  { basis: ANSWER_BASIS.OFFICIAL_PROGRAMME,
    notes: { lepen_2027: 'Le RN a défendu la retraite à 60 ans puis reculé vers 62 : position moins tranchée que la gauche.' } },
  fr_2027_q2:  { basis: ANSWER_BASIS.OFFICIAL_PROGRAMME,
    notes: { ruffin: 'Ruffin refuse le cadrage identitaire mais ne défend pas l’ouverture des frontières, d’où une position médiane.',
             roussel_2027: 'Le PCF lie immigration et dumping social : ni fermeture, ni accueil inconditionnel.' } },
  fr_2027_q3:  { basis: ANSWER_BASIS.PARTY_ENDORSED,
    notes: { roussel_2027: 'Divergence majeure avec le reste de la gauche : le PCF est ouvertement pro-nucléaire.',
             melenchon_2027: 'LFI défend la sortie du nucléaire, à l’opposé du PCF.' } },
  fr_2027_q4:  { basis: ANSWER_BASIS.CONSISTENT_RECORD,
    notes: { melenchon_2027: 'Souverainisme de gauche : opposition à l’intégration, distincte du rejet identitaire du RN.' } },
  fr_2027_q5:  { basis: ANSWER_BASIS.OFFICIAL_PROGRAMME, notes: {} },
  fr_2027_q6:  { basis: ANSWER_BASIS.PARTY_ENDORSED,
    notes: { roussel_2027: 'Le PCF conditionne l’effort climatique au pouvoir d’achat des ménages modestes.' } },
  fr_2027_q7:  { basis: ANSWER_BASIS.CONSISTENT_RECORD,
    notes: { roussel_2027: 'Roussel assume une ligne sécuritaire nettement plus marquée que LFI.' } },
  fr_2027_q8:  { basis: ANSWER_BASIS.OFFICIAL_PROGRAMME,
    notes: { lepen_2027: 'Le RN ne défend pas la baisse de l’impôt sur les sociétés comme la droite libérale.' } },
  fr_2027_q9:  { basis: ANSWER_BASIS.DIRECT_CURRENT,
    notes: { melenchon_2027: 'LFI soutient l’Ukraine mais refuse la livraison d’armes ; position basse, non nulle.',
             zemmour_2027: 'Position la plus défavorable au soutien militaire.' } },
  fr_2027_q10: { basis: ANSWER_BASIS.CONSISTENT_RECORD,
    notes: { roussel_2027: 'Laïcité stricte assumée, contrairement à LFI.',
             melenchon_2027: 'LFI conteste la laïcité dite « de combat ».' } },
  fr_2027_q11: { basis: ANSWER_BASIS.OFFICIAL_PROGRAMME, notes: {} },
  fr_2027_q12: { basis: ANSWER_BASIS.OFFICIAL_PROGRAMME, notes: {} },
  fr_2027_q13: { basis: ANSWER_BASIS.PARTY_ENDORSED, notes: {} },
  fr_2027_q14: { basis: ANSWER_BASIS.PARTY_ENDORSED,
    notes: { roussel_2027: 'Sortie des fossiles adossée au nucléaire, pas aux seules renouvelables.' } },
  fr_2027_q15: { basis: ANSWER_BASIS.OFFICIAL_PROGRAMME,
    notes: { lepen_2027: 'Le RN défend le référendum d’initiative citoyenne, comme une partie de la gauche.' } },
  fr_2027_q16: { basis: ANSWER_BASIS.CONSISTENT_RECORD,
    notes: { roussel_2027: 'Le PCF a rompu avec sa tradition de désarmement unilatéral.' } },
  fr_2027_q17: { basis: ANSWER_BASIS.PARTY_ENDORSED, notes: {} },
};

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
      out.push({
        candidateId: resolveCandidateId(candidate.id) ?? candidate.id,
        electionCandidateId: candidate.id,
        questionId: question.id,
        questionSet: electionId,
        answerValue: known ? value : null,
        answerState: known ? ANSWER_STATE.ESTIMATED : ANSWER_STATE.UNKNOWN,
        basis: known ? (row?.basis ?? ANSWER_BASIS.EDITORIAL_INFERENCE) : ANSWER_BASIS.UNKNOWN,
        rationale: row?.notes?.[candidate.id] ?? null,
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

/** Toutes les réponses éditoriales connues. */
export const EDITORIAL_ANSWERS = Object.freeze(buildFromElection('fr_2027', FR2027_REVIEW));

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
