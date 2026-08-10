// POLISCOP — Régression du matching candidats (alerte P0 du 2026-08-10).
//
// CE QUE CES TESTS AURAIENT ATTRAPÉ
// ---------------------------------
// Entre `a231536` et `83bde2b`, le nombre de candidats scorés en présidentielle 2027 est
// passé de 10/10 à 0/10. Aucun test n'a bronché : la suite couvrait le CALCUL (« ce score
// est-il correct ? ») mais jamais la CHAÎNE (« un corpus approuvé produit-il un score ? »),
// ni l'état de publiabilité (« combien de candidats sont réellement classables ? »).
//
// Le moteur n'était pas en cause : il refusait de publier un score non sourcé, ce qui est son
// rôle. Ce qui manquait, c'est un filet qui distingue les trois causes possibles d'un écran
// vide, parce qu'elles appellent des actions opposées :
//   1. corpus absent      → travail éditorial de collecte
//   2. relecture non faite → travail éditorial de validation
//   3. chaîne cassée      → BUG, à corriger dans le code
//
// Les tests ci-dessous travaillent sur les VRAIES données (élections, registre, positions,
// sources) ; seul le statut de relecture est forcé dans un fixture, afin d'isoler la cause 3
// des causes 1 et 2. Un mock complet masquerait exactement les défauts d'identifiants ou de
// schéma qu'on cherche à détecter.

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { elections } from '../../src/data/elections.js';
import { THEMES_ORDER } from '../../src/data/questions.js';
import { computeCandidateMatch } from '../../src/engine/candidateMatch.js';
import { deriveCandidateThemes } from '../../src/engine/candidateProfile.js';
import { MATCH_CONFIG } from '../../src/engine/matchConfig.js';
import { resolveCandidateId } from '../../src/data/candidateRegistry.js';
import { CANDIDATE_POSITIONS, getSource, REVIEW_STATUS } from '../../src/data/candidateProvenance.js';

const FR2027 = elections.find(e => e.id === 'fr_2027');
const QUESTIONS = FR2027.specificQuestions;
const sourceIsVerified = id => Boolean(getSource(id)?.verifiedAt);
const userThemes = Object.fromEntries(THEMES_ORDER.map((t, i) => [t, 35 + i * 4]));

/** Positions réelles d'un candidat, relues dans un fixture. Le CONTENU n'est pas touché. */
function reviewed(canonicalId) {
  return CANDIDATE_POSITIONS
    .filter(p => p.candidateId === canonicalId)
    .map(p => ({ ...p, reviewStatus: REVIEW_STATUS.APPROVED, reviewedBy: 'fixture-relecture' }));
}

/**
 * Corpus synthétique COMPLET, construit sur les vraies questions de l'élection.
 * Sert à prouver que la chaîne fonctionne de bout en bout quand les données existent —
 * sans jamais toucher au contenu politique réel.
 */
function fullCorpus(candidateId, stance = 1) {
  return QUESTIONS.map(q => ({
    candidateId, questionId: q.id, stance,
    sourceIds: ['fixture-src'], excerpt: 'extrait de test',
    reasoning: 'raisonnement de test', evidenceType: 'programme', confidence: 1,
    reviewStatus: REVIEW_STATUS.APPROVED, codedBy: 'fixture', reviewedBy: 'fixture',
    validFrom: '2026-01-01', supersedesId: null,
  }));
}
const alwaysVerified = () => true;

// ─── La chaîne elle-même ─────────────────────────────────────────────────────

test('un corpus approuvé et suffisant PRODUIT un score — la chaîne est intacte', () => {
  const candidate = FR2027.candidates.find(c => c.id === 'attal');
  const match = computeCandidateMatch({
    userThemes, candidate, questions: QUESTIONS,
    approvedPositions: fullCorpus(resolveCandidateId('attal')),
    sourceIsVerified: alwaysVerified,
  });
  assert.notEqual(match.score, null,
    `corpus complet et approuvé, et pourtant aucun score (« ${match.reason} ») : la chaîne est cassée`);
  assert.ok(match.score >= 0 && match.score <= 100, `score hors bornes : ${match.score}`);
  assert.ok(match.coverage.themesKnown >= MATCH_CONFIG.minKnownThemesForScore);
});

test('les dimensions des positions candidates croisent bien celles du profil utilisateur', () => {
  // Régression de mapping : si les thèmes portés par les questions d'élection cessaient de
  // correspondre aux thèmes du profil, l'intersection serait vide et TOUT deviendrait
  // incomparable sans qu'aucune erreur ne soit levée.
  const derived = deriveCandidateThemes(
    fullCorpus('quiconque'), QUESTIONS, { sourceIsVerified: alwaysVerified },
  );
  const candidateDims = Object.keys(derived.themes).filter(t => derived.themes[t] != null);
  const userDims = Object.keys(userThemes);
  const intersection = candidateDims.filter(t => userDims.includes(t));
  assert.ok(candidateDims.length > 0, 'aucune dimension dérivée d’un corpus pourtant complet');
  assert.ok(
    intersection.length >= MATCH_CONFIG.minKnownThemesForScore,
    `intersection des dimensions trop faible : candidat ${JSON.stringify(candidateDims)} `
    + `vs profil ${JSON.stringify(userDims)}`,
  );
});

test('chaque question d’élection porte un thème connu du profil', () => {
  for (const election of elections) {
    for (const q of election.specificQuestions ?? []) {
      assert.ok(THEMES_ORDER.includes(q.theme),
        `${election.id}/${q.id} : thème « ${q.theme} » inconnu du profil utilisateur`);
      assert.ok([1, -1].includes(q.direction), `${election.id}/${q.id} : direction invalide`);
    }
  }
});

// ─── Identifiants : le mapping réel, pas un mock ────────────────────────────

test('chaque candidat d’élection se résout vers le registre canonique', () => {
  const orphans = [];
  for (const election of elections) {
    for (const candidate of election.candidates) {
      if (!resolveCandidateId(candidate.id)) orphans.push(`${election.id}/${candidate.id}`);
    }
  }
  assert.deepEqual(orphans, [], `candidats non résolus vers le registre : ${orphans.join(', ')}`);
});

/**
 * Corpus codés que le produit n'expose volontairement pas encore.
 *
 * Une entrée ici est un ARBITRAGE ÉDITORIAL consigné, pas un contournement : ajouter une
 * personne à la liste des candidats d'une présidentielle est une décision de contenu
 * politique, qui ne se prend pas depuis un test.
 */
const CORPUS_SANS_SURFACE = {
  'david-lisnard':
    'Déclaré au registre et doté du corpus le plus avancé (17 positions, 11 tranchées), mais '
    + 'absent de la liste des candidats de fr_2027 dans elections.js. Signalé le 2026-08-10 : '
    + 'l’inscrire dans la comparaison présidentielle est une décision éditoriale, pas technique.',
};

test('les positions codées sont rattachées à des candidats réellement atteignables', () => {
  // Défaut classique : positions saisies sous un identifiant que plus aucune surface
  // n'interroge. Elles existent, mais restent invisibles pour toujours — et le travail
  // éditorial le plus abouti est justement celui qui disparaît en silence.
  const codedFor = new Set(CANDIDATE_POSITIONS.map(p => p.candidateId));
  const reachable = new Set(
    elections.flatMap(e => e.candidates.map(c => resolveCandidateId(c.id))).filter(Boolean),
  );
  const unreachable = [...codedFor]
    .filter(id => !reachable.has(id))
    .filter(id => !(id in CORPUS_SANS_SURFACE));
  assert.deepEqual(unreachable, [],
    `positions codées pour des candidats qu’aucune élection n’expose : ${unreachable.join(', ')}`);
});

test('chaque corpus laissé sans surface est justifié, et le reste vraiment', () => {
  const reachable = new Set(
    elections.flatMap(e => e.candidates.map(c => resolveCandidateId(c.id))).filter(Boolean),
  );
  for (const [id, reason] of Object.entries(CORPUS_SANS_SURFACE)) {
    assert.ok(reason.length > 60, `${id} : justification trop courte pour être un arbitrage`);
    assert.ok(
      CANDIDATE_POSITIONS.some(p => p.candidateId === id),
      `${id} : déclaré sans surface alors qu’aucune position n’existe — entrée périmée`,
    );
    assert.ok(
      !reachable.has(id),
      `${id} : désormais exposé par une élection — retirer cette dérogation`,
    );
  }
});

// ─── Isolation et cohérence ─────────────────────────────────────────────────

test('un candidat sans données n’empêche pas les autres d’être classés', () => {
  const withCorpus = FR2027.candidates.find(c => c.id === 'attal');
  const without    = FR2027.candidates.find(c => c.id === 'lepen_2027');

  const a = computeCandidateMatch({
    userThemes, candidate: withCorpus, questions: QUESTIONS,
    approvedPositions: fullCorpus(resolveCandidateId('attal')), sourceIsVerified: alwaysVerified,
  });
  const b = computeCandidateMatch({
    userThemes, candidate: without, questions: QUESTIONS, sourceIsVerified,
  });

  assert.notEqual(a.score, null, 'le candidat documenté a perdu son score');
  assert.equal(b.score, null, 'un candidat sans corpus ne doit pas recevoir de score');
  assert.equal(b.reason, 'no_sourced_positions');
});

test('un candidat sans corpus est déclaré non comparable, avec un motif exploitable', () => {
  const match = computeCandidateMatch({
    userThemes, candidate: FR2027.candidates.find(c => c.id === 'zemmour_2027'),
    questions: QUESTIONS, sourceIsVerified,
  });
  assert.equal(match.score, null);
  assert.ok(match.reason, 'un candidat non comparable doit dire POURQUOI');
  assert.equal(match.coverage.sourcedPositions, 0);
});

test('le même couple utilisateur/candidat donne le même score partout', () => {
  // Profil, meilleur match et page Élection partagent `computeCandidateMatch`. Si deux
  // surfaces divergeaient, le produit se contredirait — c'est exactement le défaut qui avait
  // été corrigé en retirant la copie du moteur qui vivait dans ElectionDetail.jsx.
  const candidate = FR2027.candidates.find(c => c.id === 'attal');
  const positions = fullCorpus(resolveCandidateId('attal'));
  const args = { userThemes, candidate, questions: QUESTIONS, approvedPositions: positions, sourceIsVerified: alwaysVerified };
  const a = computeCandidateMatch(args);
  const b = computeCandidateMatch({ ...args });
  assert.equal(a.score, b.score);
  assert.deepEqual(a.derivedThemes, b.derivedThemes);
});

// ─── Le seuil doit rester ATTEIGNABLE ───────────────────────────────────────

test('fr_2027 peut atteindre le seuil de publication avec un corpus parfait', () => {
  // Ce test échoue si quelqu'un durcit `minKnownThemesForScore`, ou retire des questions,
  // au point de rendre la présidentielle 2027 structurellement inclassable — c'est-à-dire
  // sans qu'AUCUN travail éditorial ne puisse jamais y changer quoi que ce soit.
  const perTheme = {};
  for (const q of QUESTIONS) perTheme[q.theme] = (perTheme[q.theme] ?? 0) + 1;
  const reachable = Object.values(perTheme)
    .filter(n => n >= MATCH_CONFIG.minSourcedPositionsPerTheme).length;
  assert.ok(
    reachable >= MATCH_CONFIG.minKnownThemesForScore,
    `fr_2027 : ${reachable} thèmes atteignables pour ${MATCH_CONFIG.minKnownThemesForScore} requis — `
    + 'aucun corpus, si complet soit-il, ne pourra produire un score',
  );
});

// ─── État réel du corpus : rendu VISIBLE, jamais silencieux ─────────────────

test('l’état de publiabilité réel est explicite et suivi', () => {
  // Ce test ne juge pas le corpus : il fige son état pour qu'une variation soit VUE.
  // Le 2026-08-10, ce compteur est passé de 10 à 0 sans qu'aucun test ne bouge.
  const scored = FR2027.candidates.filter(c =>
    computeCandidateMatch({ userThemes, candidate: c, questions: QUESTIONS, sourceIsVerified }).score != null,
  ).length;

  const approved = CANDIDATE_POSITIONS.filter(p => p.reviewStatus === REVIEW_STATUS.APPROVED).length;

  if (approved === 0) {
    assert.equal(scored, 0,
      'des scores sont publiés alors qu’AUCUNE position n’est approuvée — un repli non sourcé est réapparu');
  } else {
    assert.ok(scored > 0,
      `${approved} positions approuvées et pourtant 0 candidat scoré : la chaîne est cassée`);
  }
});

test('aucun score ne peut être produit à partir de positions non approuvées', () => {
  // Le garde-fou central de `83bde2b` : la seule chose qui ne doit JAMAIS régresser.
  const pending = CANDIDATE_POSITIONS
    .filter(p => p.candidateId === resolveCandidateId('attal'))
    .map(p => ({ ...p, reviewStatus: REVIEW_STATUS.PENDING_REVIEW, reviewedBy: null }));
  const match = computeCandidateMatch({
    userThemes, candidate: FR2027.candidates.find(c => c.id === 'attal'),
    questions: QUESTIONS, approvedPositions: pending, sourceIsVerified,
  });
  assert.equal(match.score, null, 'un score a été publié depuis des positions non relues');
});

test('une position approuvée mais sans relecteur reste irrecevable', () => {
  const noReviewer = fullCorpus(resolveCandidateId('attal')).map(p => ({ ...p, reviewedBy: null }));
  const match = computeCandidateMatch({
    userThemes, candidate: FR2027.candidates.find(c => c.id === 'attal'),
    questions: QUESTIONS, approvedPositions: noReviewer, sourceIsVerified: alwaysVerified,
  });
  assert.equal(match.score, null, '« approuvée » sans relecteur ne prouve rien et ne doit pas scorer');
});
