// POLISCOP — Le score public ne repose QUE sur des positions approuvées.
//
// CE QUE CES TESTS VERROUILLENT
// -----------------------------
// Le 3e contre-audit a montré que le moteur classait encore les candidats 2027 à partir de
// deux sources non sourcées :
//   1. `candidate.profile` — 8 nombres saisis à la main (`legacy-manual-v1`) ;
//   2. `specificQuestions[].positions` — repli quand aucune position approuvée n'existe.
// Avec ZÉRO position approuvée, l'interface affichait pourtant « Meilleur match 2027 —
// Fabien Roussel — 66/100 ».
//
// Le test précédent (« le repli legacy s'applique donc partout ») verrouillait exactement
// l'inverse de l'exigence. Il est remplacé par ceux-ci.

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { computeCandidateMatch, rankCandidates } from '../../src/engine/candidateMatch.js';
import { deriveCandidateThemes } from '../../src/engine/candidateProfile.js';
import { MATCH_CONFIG } from '../../src/engine/matchConfig.js';
import { THEMES_ORDER } from '../../src/data/questions.js';
import { elections } from '../../src/data/elections.js';
import { CANDIDATE_POSITIONS, REVIEW_STATUS } from '../../src/data/candidateProvenance.js';

const fr2027 = elections.find(e => e.id === 'fr_2027');
const flat = v => Object.fromEntries(THEMES_ORDER.map(t => [t, v]));
const allAnswers = Object.fromEntries(fr2027.specificQuestions.map(q => [q.id, 3]));

// ─── État actuel des données ────────────────────────────────────────────────

test('constat : zéro position approuvée dans le dépôt', () => {
  const approved = CANDIDATE_POSITIONS.filter(p => p.reviewStatus === REVIEW_STATUS.APPROVED);
  assert.equal(approved.length, 0,
    'si ce test échoue, des positions ont été approuvées : mettre à jour le rapport et la doc');
});

// ─── Le cœur du P0 ──────────────────────────────────────────────────────────

test('aucun candidat 2027 n’obtient de score public sans position approuvée', () => {
  for (const c of fr2027.candidates) {
    const m = computeCandidateMatch({
      userThemes: flat(50),
      candidate: c,
      priorityOrder: [...THEMES_ORDER],
      electionAnswers: allAnswers,
      questions: fr2027.specificQuestions,
    });
    assert.equal(m.score, null,
      `${c.id} obtient ${m.score}/100 alors qu'aucune de ses positions n'est sourcée et relue`);
    assert.equal(m.reason, 'no_sourced_positions', `${c.id} : motif inattendu « ${m.reason} »`);
  }
});

test('le classement public est VIDE tant qu’aucun candidat n’est comparable', () => {
  const { results, unscored } = rankCandidates(
    {
      userThemes: flat(50),
      priorityOrder: [...THEMES_ORDER],
      electionAnswers: allAnswers,
      questions: fr2027.specificQuestions,
    },
    fr2027.candidates,
  );
  assert.equal(results.length, 0, 'des candidats sont classés sans preuve sourcée');
  assert.equal(unscored.length, fr2027.candidates.length,
    'les candidats non comparables doivent rester visibles, avec leur motif');
});

test('un profil legacy complet ne produit AUCUN score public', () => {
  // Le candidat porte ses 8 nombres historiques : c'est exactement le cas qui produisait
  // « 66/100 » à l'écran.
  const legacy = { id: 'roussel_2027', name: 'Test', profile: flat(60) };
  const m = computeCandidateMatch({
    userThemes: flat(55), candidate: legacy, priorityOrder: [...THEMES_ORDER],
  });
  assert.equal(m.score, null);
  assert.equal(m.reason, 'no_sourced_positions');
});

// ─── Dérivation du profil candidat depuis les positions ─────────────────────

/** Fabrique une position approuvée conforme (source vérifiée, relecteur, extrait). */
function approved(questionId, stance, overrides = {}) {
  return {
    candidateId: 'test-candidate', questionId, stance,
    sourceIds: ['src-lisnard-programme-2027'],
    excerpt: 'extrait probant', reasoning: 'codage',
    evidenceType: 'programme', confidence: 0.9,
    reviewStatus: REVIEW_STATUS.APPROVED,
    codedBy: 'a', reviewedBy: 'b',
    validFrom: '2026-01-01', supersedesId: null,
    ...overrides,
  };
}

test('une position non relue ne contribue jamais', () => {
  const pos = [approved('fr_2027_q1', 2, { reviewStatus: REVIEW_STATUS.PENDING_REVIEW })];
  const d = deriveCandidateThemes(pos, fr2027.specificQuestions, { sourceIsVerified: () => true });
  assert.equal(d.usable.length, 0);
  assert.equal(Object.values(d.themes).every(v => v === null), true);
});

test('une position sans source, ou dont la source n’est pas vérifiée, ne contribue jamais', () => {
  const sansSource = [approved('fr_2027_q1', 2, { sourceIds: [] })];
  assert.equal(deriveCandidateThemes(sansSource, fr2027.specificQuestions, { sourceIsVerified: () => true }).usable.length, 0);

  const sourceNonVerifiee = [approved('fr_2027_q1', 2)];
  assert.equal(
    deriveCandidateThemes(sourceNonVerifiee, fr2027.specificQuestions, { sourceIsVerified: () => false }).usable.length,
    0,
    'une source jamais ouverte ni confirmée (verifiedAt null) ne doit pas alimenter un score',
  );
});

test('une position sans relecteur ou sans extrait ne contribue jamais', () => {
  for (const champManquant of [{ reviewedBy: null }, { excerpt: null, reasoning: null }, { codedBy: null }]) {
    const pos = [approved('fr_2027_q1', 2, champManquant)];
    const d = deriveCandidateThemes(pos, fr2027.specificQuestions, { sourceIsVerified: () => true });
    assert.equal(d.usable.length, 0, `champ manquant accepté : ${JSON.stringify(champManquant)}`);
  }
});

test('un thème sous le seuil de positions indépendantes reste inconnu — jamais 50', () => {
  const seuil = MATCH_CONFIG.minSourcedPositionsPerTheme;
  assert.ok(seuil >= 1, 'un seuil doit être déclaré dans la configuration versionnée');

  // ECONOMY a 4 questions dans fr_2027 (q1, q8, q11, q17) : on n'en code qu'une.
  const pos = [approved('fr_2027_q1', 2)];
  const d = deriveCandidateThemes(pos, fr2027.specificQuestions, { sourceIsVerified: () => true });
  if (seuil > 1) {
    assert.equal(d.themes.ECONOMY, null, 'un thème sous le seuil doit rester indéterminé');
  }
  for (const t of THEMES_ORDER.filter(t => t !== 'ECONOMY')) {
    assert.equal(d.themes[t], null, `${t} sans position doit rester null, jamais 50`);
  }
});

test('au seuil, le thème dérivé est déterministe et dans 0–100', () => {
  const eco = fr2027.specificQuestions.filter(q => q.theme === 'ECONOMY');
  const pos = eco.map(q => approved(q.id, 2));
  const a = deriveCandidateThemes(pos, fr2027.specificQuestions, { sourceIsVerified: () => true });
  const b = deriveCandidateThemes(pos, fr2027.specificQuestions, { sourceIsVerified: () => true });

  assert.deepEqual(a.themes, b.themes, 'la dérivation doit être déterministe');
  assert.ok(a.themes.ECONOMY >= 0 && a.themes.ECONOMY <= 100);
  assert.equal(a.coverage.perTheme.ECONOMY.sourced, eco.length);
});

test('la direction de la question est appliquée : deux stances opposées donnent des scores opposés', () => {
  const eco = fr2027.specificQuestions.filter(q => q.theme === 'ECONOMY');
  const pour   = deriveCandidateThemes(eco.map(q => approved(q.id, 2)),  fr2027.specificQuestions, { sourceIsVerified: () => true });
  const contre = deriveCandidateThemes(eco.map(q => approved(q.id, -2)), fr2027.specificQuestions, { sourceIsVerified: () => true });
  assert.notEqual(pour.themes.ECONOMY, contre.themes.ECONOMY);
  assert.equal(pour.themes.ECONOMY + contre.themes.ECONOMY, 100,
    'symétrie attendue autour de 50 pour des stances opposées');
});

test('un revirement : seule la position valide à la date est retenue', () => {
  const ancienne = approved('fr_2027_q1', -2, { validFrom: '2025-01-01' });
  const nouvelle = approved('fr_2027_q1', 2, {
    validFrom: '2026-06-01',
    supersedesId: 'test-candidate|fr_2027_q1|2025-01-01',
  });
  const d = deriveCandidateThemes([ancienne, nouvelle], fr2027.specificQuestions, {
    sourceIsVerified: () => true,
    asOf: '2026-08-09',
  });
  assert.equal(d.usable.length, 1, 'la position remplacée ne doit pas être comptée deux fois');
  assert.equal(d.usable[0].stance, 2, 'c’est la position la plus récente valide qui compte');
});

// ─── Couverture globale ─────────────────────────────────────────────────────

test('sous le seuil de couverture globale, le score reste null avec un motif', () => {
  const eco = fr2027.specificQuestions.filter(q => q.theme === 'ECONOMY');
  const candidate = {
    id: 'test-candidate', name: 'Test',
    profile: flat(60),                       // legacy présent : il ne doit RIEN changer
  };
  const m = computeCandidateMatch({
    userThemes: flat(50), candidate, priorityOrder: [...THEMES_ORDER],
    electionAnswers: allAnswers, questions: fr2027.specificQuestions,
    approvedPositions: eco.map(q => approved(q.id, 1)),
    sourceIsVerified: () => true,
  });
  assert.equal(m.score, null, 'un seul thème couvert ne suffit pas à classer un candidat');
  assert.equal(m.reason, 'insufficient_coverage');
  assert.equal(m.coverage.sourcedPositions, eco.length);
});

test('couverture suffisante : un score est produit, et il ignore le profil legacy', () => {
  const seuil = MATCH_CONFIG.minKnownThemesForScore;
  const parTheme = new Map();
  for (const q of fr2027.specificQuestions) {
    if (!parTheme.has(q.theme)) parTheme.set(q.theme, []);
    parTheme.get(q.theme).push(q);
  }
  const themesCouvrables = [...parTheme.entries()]
    .filter(([, qs]) => qs.length >= MATCH_CONFIG.minSourcedPositionsPerTheme)
    .slice(0, Math.max(seuil, 4));

  const positions = themesCouvrables.flatMap(([, qs]) => qs.map(q => approved(q.id, 1)));

  const avecLegacyHaut = computeCandidateMatch({
    userThemes: flat(50), candidate: { id: 'test-candidate', name: 'T', profile: flat(95) },
    priorityOrder: [...THEMES_ORDER], electionAnswers: allAnswers,
    questions: fr2027.specificQuestions, approvedPositions: positions, sourceIsVerified: () => true,
  });
  const avecLegacyBas = computeCandidateMatch({
    userThemes: flat(50), candidate: { id: 'test-candidate', name: 'T', profile: flat(5) },
    priorityOrder: [...THEMES_ORDER], electionAnswers: allAnswers,
    questions: fr2027.specificQuestions, approvedPositions: positions, sourceIsVerified: () => true,
  });

  if (themesCouvrables.length >= seuil) {
    assert.ok(Number.isFinite(avecLegacyHaut.score), `aucun score malgré ${themesCouvrables.length} thèmes couverts`);
  }
  assert.equal(avecLegacyHaut.score, avecLegacyBas.score,
    'le profil legacy influence encore le score : il doit être totalement ignoré');
});

test('le corpus Lisnard devient calculable après — et seulement après — une relecture indépendante', () => {
  // Simulation de la FUTURE validation : le dépôt reste à zéro position APPROVED. Ce test
  // prouve simplement que le corpus éditorial couvre désormais quatre thèmes robustes et
  // qu'une vraie relecture ne débouchera pas sur un candidat toujours inclassable.
  const independentlyApproved = CANDIDATE_POSITIONS
    .filter(position => position.candidateId === 'david-lisnard'
      && position.reviewStatus === REVIEW_STATUS.PENDING_REVIEW)
    .map(position => ({
      ...position,
      reviewStatus: REVIEW_STATUS.APPROVED,
      reviewedBy: 'independent-review-fixture',
    }));

  const m = computeCandidateMatch({
    userThemes: flat(50),
    candidate: { id: 'david-lisnard', name: 'David Lisnard' },
    priorityOrder: [...THEMES_ORDER],
    electionAnswers: allAnswers,
    questions: fr2027.specificQuestions,
    approvedPositions: independentlyApproved,
  });

  assert.equal(independentlyApproved.length, 11);
  assert.equal(m.coverage.themesKnown, 4,
    'le corpus doit couvrir économie, environnement, mondialisation et sécurité');
  assert.ok(Number.isFinite(m.score),
    'le corpus relu devrait produire un score sans abaisser le seuil de deux preuves par thème');
});

test('le résultat embarque les versions de données et de matching', () => {
  const m = computeCandidateMatch({
    userThemes: flat(50), candidate: fr2027.candidates[0], priorityOrder: [...THEMES_ORDER],
  });
  assert.ok(m.versions.matching);
  assert.ok(m.versions.candidateData);
  assert.ok(m.versions.candidateProfile, 'la version de dérivation du profil candidat doit être tracée');
});
