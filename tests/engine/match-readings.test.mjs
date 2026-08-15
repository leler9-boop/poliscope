// POLISCOP — Deux lectures RÉELLEMENT indépendantes, jamais mélangées.
//
// DÉFAUT CORRIGÉ (P0-3, 2026-08-14)
// ---------------------------------
// Le commit `2530d18` avait créé deux objets de SEUIL, mais pas deux CALCULS. Dans
// `computeCandidateMatch()` :
//   1. les positions propres au scrutin servaient à dériver un profil thématique ;
//   2. ce profil devait franchir le seuil thématique, sinon TOUT était refusé ;
//   3. les mêmes positions produisaient ensuite le score direct sur les questions ;
//   4. les deux résultats étaient mélangés 65/35.
//
// Conséquences mesurées :
//   • les mêmes preuves comptaient deux fois ;
//   • aucun score électoral direct n'était possible tant que le profil thématique général
//     n'atteignait pas quatre thèmes — David Lisnard, avec sept positions approuvées et
//     relues sur les dix-sept questions de fr_2027, restait « non comparable » ;
//   • changer une réponse au scrutin déplaçait la proximité GÉNÉRALE, et changer le profil
//     général déplaçait la proximité ÉLECTORALE.

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { computeCandidateMatch, MATCH_READING } from '../../src/engine/candidateMatch.js';
import { ELECTION_DIRECT_CONTRACT, resolveDirectElectionContract } from '../../src/engine/matchContracts.js';
import { THEMES_ORDER } from '../../src/data/questions.js';
import { elections } from '../../src/data/elections.js';
import { CANDIDATE_POSITIONS, REVIEW_STATUS, getSource } from '../../src/data/candidateProvenance.js';
import { resolveCandidateId } from '../../src/data/candidateRegistry.js';

const FR2027 = elections.find(e => e.id === 'fr_2027');
const QUESTIONS = FR2027.specificQuestions;
const flat = v => Object.fromEntries(THEMES_ORDER.map(t => [t, v]));
const toutesReponses = valeur => Object.fromEntries(QUESTIONS.map(q => [q.id, valeur]));
const sourceIsVerified = id => Boolean(getSource(id)?.verifiedAt);

const candidatDe = id => FR2027.candidates.find(c => c.id === id);
const approuvees = id => CANDIDATE_POSITIONS.filter(
  p => p.candidateId === resolveCandidateId(id)
    && p.reviewStatus === REVIEW_STATUS.APPROVED
    && QUESTIONS.some(q => q.id === p.questionId),
);

const match = (id, extra = {}) => computeCandidateMatch({
  userThemes: flat(50),
  candidate: candidatDe(id),
  questions: QUESTIONS,
  electionAnswers: toutesReponses(3),
  sourceIsVerified,
  ...extra,
});

// ─── Aucun mélange ──────────────────────────────────────────────────────────

test('le résultat n’expose AUCUN indice combiné', () => {
  const m = match('lisnard');
  assert.ok(m.general && typeof m.general === 'object');
  assert.ok(m.election && typeof m.election === 'object');
  // La lecture demandée est reflétée telle quelle — jamais une moyenne pondérée des deux.
  assert.equal(m.score, m.general.score, 'la lecture générale doit être rendue à l’identique');

  const electorale = match('lisnard', { reading: MATCH_READING.ELECTION });
  assert.equal(electorale.score, electorale.election.score);
});

test('aucune preuve n’est comptée deux fois : chaque lecture a son propre dénominateur', () => {
  const m = match('lisnard');
  // Lecture générale : des THÈMES, agrégés depuis les positions.
  assert.ok('themesKnown' in m.general.coverage);
  assert.ok(!('positionsCompared' in m.general.coverage));
  // Lecture électorale : des POSITIONS, comparées une à une.
  assert.ok('positionsCompared' in m.election.coverage);
  assert.ok(!('themesKnown' in m.election.coverage));
});

test('aucune surface visible ne promet encore un score « 65 % global + 35 % local »', async () => {
  // ⚠ Le calcul avait été supprimé du moteur, mais la note « Comment ce score est calculé ? »
  // de la page Élection l'annonçait toujours à l'utilisateur. Un moteur corrigé derrière un
  // texte faux reste un mensonge affiché — c'est la même faute que « aucun corpus approuvé à
  // ce jour », dans un autre fichier.
  const { readdirSync, statSync, readFileSync } = await import('node:fs');
  const { join } = await import('node:path');
  const { fileURLToPath } = await import('node:url');
  const racine = fileURLToPath(new URL('../../src', import.meta.url));

  const fichiers = [];
  (function walk(dir) {
    for (const nom of readdirSync(dir)) {
      const p = join(dir, nom);
      if (statSync(p).isDirectory()) walk(p);
      else if (/\.jsx?$/.test(nom)) fichiers.push(p);
    }
  })(racine);

  // ⚠ Les COMMENTAIRES doivent pouvoir citer l'ancien calcul — c'est même la seule façon
  // d'expliquer pourquoi il a disparu. On les retire donc AVANT de chercher, blocs compris :
  // un filtre ligne à ligne laissait passer les lignes de continuation d'un `{/* … */}`.
  const sansCommentaires = src => src
    .replace(/\{?\/\*[\s\S]*?\*\/\}?/g, ' ')
    .split('\n').filter(l => !l.trim().startsWith('//')).join('\n');

  const coupables = [];
  for (const f of fichiers) {
    const texte = sansCommentaires(readFileSync(f, 'utf8'));
    if (/65\s*%[^\n]{0,80}35\s*%|profil global \(65|global profile \(65/.test(texte)) {
      coupables.push(f.replace(racine, 'src'));
    }
  }
  assert.deepEqual(coupables, [],
    `un texte visible annonce encore le mélange 65/35 supprimé : ${coupables.join(', ')}`);
});

test('aucune pondération entre les deux lectures ne subsiste dans la configuration', async () => {
  const { MATCH_CONFIG } = await import('../../src/engine/matchConfig.js');
  assert.equal('blend' in MATCH_CONFIG, false,
    'un mélange global/électoral recompterait les mêmes positions ; s’il revient, il lui faut '
    + 'son propre nom, sa propre version et son propre dénominateur');

  const { readFile } = await import('node:fs/promises');
  const src = await readFile(new URL('../../src/engine/candidateMatch.js', import.meta.url), 'utf8');
  const code = src.split('\n').filter(l => !l.trim().startsWith('//')).join('\n');
  assert.ok(!/MATCH_CONFIG\.blend/.test(code), 'le moteur mélange encore les deux lectures');
});

// ─── Indépendance dans les deux sens ────────────────────────────────────────

test('changer les réponses électorales ne modifie PAS le score général', () => {
  const a = match('lisnard', { electionAnswers: toutesReponses(1) });
  const b = match('lisnard', { electionAnswers: toutesReponses(5) });
  assert.equal(a.general.score, b.general.score);
  assert.deepEqual(a.general.coverage, b.general.coverage);
});

test('changer le profil général ne modifie PAS le score électoral direct', () => {
  const a = match('lisnard', { userThemes: flat(10), reading: MATCH_READING.ELECTION });
  const b = match('lisnard', { userThemes: flat(90), reading: MATCH_READING.ELECTION });
  assert.notEqual(a.election.score, null, 'le fixture doit produire une lecture électorale');
  assert.equal(a.election.score, b.election.score,
    'le veto thématique s’appliquait au score électoral : deux lectures liées par la porte de derrière');
});

test('les priorités de thèmes ne déplacent pas la lecture électorale directe', () => {
  const a = match('lisnard', { priorityOrder: [...THEMES_ORDER], reading: MATCH_READING.ELECTION });
  const b = match('lisnard', {
    priorityOrder: [...THEMES_ORDER].reverse(), reading: MATCH_READING.ELECTION,
  });
  assert.equal(a.election.score, b.election.score);
});

// ─── Le cas Lisnard : comparable électoralement, pas généralement ───────────

test('Lisnard : sept positions approuvées, évaluées par le contrat ÉLECTORAL direct', () => {
  const positions = approuvees('lisnard');
  assert.equal(positions.length, 7, 'le corpus a changé : réviser ce test et le rapport');

  const m = match('lisnard', { reading: MATCH_READING.ELECTION });
  const c = m.election.coverage;

  assert.equal(c.positionsCompared, 7);
  assert.equal(c.positionsAvailable, 7);
  assert.equal(c.questionnaireSize, QUESTIONS.length);
  assert.ok(c.themesRepresented >= ELECTION_DIRECT_CONTRACT.minThemesRepresented);
  assert.equal(m.election.contract.satisfied, true);
  assert.notEqual(m.election.score, null,
    'sept positions relues, couvrant six thèmes sur dix-sept questions, doivent produire un résultat');
  // ⚠ Aucun résultat forcé : le score reste un calcul, pas une valeur plancher.
  assert.ok(m.election.score >= 0 && m.election.score <= 100);
});

test('Lisnard reste NON comparable en lecture générale — et le motif le dit', () => {
  const m = match('lisnard');
  assert.equal(m.general.score, null);
  assert.equal(m.general.reason, 'insufficient_coverage');
  assert.ok(m.general.coverage.themesKnown < m.general.contract.minKnownThemes,
    'le refus général doit venir de la couverture thématique, pas d’un effet de bord');
});

// ─── Attal et Roussel : sous le seuil, et ils le restent ────────────────────

for (const [id, attendu] of [['attal', 3], ['roussel_2027', 2]]) {
  test(`${id} : ${attendu} positions approuvées, sous le seuil électoral — indisponible`, () => {
    assert.equal(approuvees(id).length, attendu, 'le corpus a changé : réviser ce test');

    const m = match(id, { reading: MATCH_READING.ELECTION });
    assert.equal(m.election.coverage.positionsCompared, attendu);
    assert.equal(m.election.contract.satisfied, false);
    assert.equal(m.election.score, null,
      'abaisser le seuil pour faire apparaître un score serait fabriquer une comparabilité');
    assert.equal(m.election.reason, 'too_few_compared_positions');
  });
}

// ─── L'inverse : comparable généralement, trop peu de positions électorales ─

test('un candidat comparable généralement peut manquer de positions ÉLECTORALES', () => {
  // Corpus construit pour la démonstration : assez de positions pour connaître quatre thèmes
  // (contrat général), mais l'utilisateur n'a répondu qu'à deux des questions concernées.
  const parTheme = {};
  for (const q of QUESTIONS) (parTheme[q.theme] ??= []).push(q);
  const choisies = Object.values(parTheme).filter(l => l.length >= 2).slice(0, 4).flat();
  assert.ok(choisies.length >= 8, 'le questionnaire fr_2027 doit permettre ce montage');

  const corpus = choisies.map((q, i) => ({
    candidateId: resolveCandidateId('lisnard'),
    questionId: q.id,
    stance: i % 2 === 0 ? 1 : 0,
    reviewStatus: REVIEW_STATUS.APPROVED,
    sourceIds: ['src-test'],
    excerpt: 'extrait de démonstration',
    codedBy: 'test', reviewedBy: 'test', validFrom: '2026-01-01',
  }));

  const deuxReponses = Object.fromEntries(choisies.slice(0, 2).map(q => [q.id, 3]));
  const m = computeCandidateMatch({
    userThemes: flat(50),
    candidate: candidatDe('lisnard'),
    questions: QUESTIONS,
    electionAnswers: deuxReponses,
    approvedPositions: corpus,
    sourceIsVerified: () => true,
  });

  assert.notEqual(m.general.score, null, 'quatre thèmes connus doivent suffire à la lecture générale');
  assert.equal(m.election.score, null);
  assert.equal(m.election.reason, 'too_few_compared_positions');
  assert.equal(m.election.coverage.positionsCompared, 2);
  assert.equal(m.election.coverage.positionsAvailable, choisies.length,
    'le dénominateur doit montrer ce qui EXISTE, pas seulement ce qui a été comparé');
});

// ─── Le contrat direct lui-même ─────────────────────────────────────────────

test('le contrat direct distingue « pas assez de positions » de « pas assez de réponses »', () => {
  const sansPosition = resolveDirectElectionContract({ compared: 0, available: 0, questionnaireSize: 17, themes: 0 });
  assert.equal(sansPosition.reason, 'no_election_positions');

  const sansReponse = resolveDirectElectionContract({ compared: 0, available: 9, questionnaireSize: 17, themes: 0 });
  assert.equal(sansReponse.reason, 'no_common_answers',
    'les deux se réparent par des gestes opposés : coder des positions, ou répondre');
});

test('le contrat direct exige une part réelle du questionnaire', () => {
  // Cinq positions comparées sur cinquante questions : le seuil de nombre est atteint, la
  // part ne l'est pas. On ne se prononce pas sur l'élection avec 10 % du questionnaire.
  const c = resolveDirectElectionContract({ compared: 5, available: 5, questionnaireSize: 50, themes: 4 });
  assert.equal(c.satisfied, false);
  assert.equal(c.reason, 'questionnaire_share_too_small');
});

test('le contrat direct exige une diversité minimale de thèmes', () => {
  const c = resolveDirectElectionContract({ compared: 6, available: 6, questionnaireSize: 10, themes: 2 });
  assert.equal(c.satisfied, false);
  assert.equal(c.reason, 'too_few_themes_represented');
});

test('le contrat direct est versionné', () => {
  const c = resolveDirectElectionContract({ compared: 6, available: 6, questionnaireSize: 10, themes: 3 });
  assert.equal(c.satisfied, true);
  assert.equal(c.contract, ELECTION_DIRECT_CONTRACT.id);
  assert.equal(c.version, ELECTION_DIRECT_CONTRACT.version);
});

// ─── L'importance électorale déclarée ───────────────────────────────────────

test('l’importance déclarée pondère la lecture électorale sans écarter de question', () => {
  const base = match('lisnard', { reading: MATCH_READING.ELECTION, electionAnswers: toutesReponses(4) });
  const pondere = match('lisnard', {
    reading: MATCH_READING.ELECTION,
    electionAnswers: toutesReponses(4),
    electoralWeights: Object.fromEntries(approuvees('lisnard').map((p, i) => [p.questionId, i === 0 ? 5 : 1])),
  });
  assert.equal(base.election.coverage.positionsCompared, pondere.election.coverage.positionsCompared,
    'une pondération ne doit jamais changer le dénominateur affiché');
  assert.notEqual(base.election.score, null);
  assert.notEqual(pondere.election.score, null);
});

test('un poids nul ou absurde ne fait pas disparaître une question', () => {
  const poidsAbsurdes = Object.fromEntries(approuvees('lisnard').map(p => [p.questionId, 0]));
  const m = match('lisnard', {
    reading: MATCH_READING.ELECTION, electoralWeights: poidsAbsurdes,
  });
  assert.equal(m.election.coverage.positionsCompared, 7);
  assert.notEqual(m.election.score, null, 'un poids invalide doit valoir 1, pas supprimer la preuve');
});
