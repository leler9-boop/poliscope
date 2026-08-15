// POLISCOP — Moteur de proximité : cohérence entre surfaces, veto, couverture.
//
// Le défaut central corrigé ici : la page Élection portait sa propre copie de la logique
// (veto à 5 thèmes au lieu de 6, `themeWeights` ignoré). Ces tests verrouillent le fait
// qu'il n'existe désormais qu'un seul chemin de calcul.

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { calculateAlignment, buildWeightMap, rankByAlignment } from '../../src/engine/matcher.js';
import { computeCandidateMatch, rankCandidates } from '../../src/engine/candidateMatch.js';
import { VETO_THEMES, computeVeto, MATCH_CONFIG } from '../../src/engine/matchConfig.js';
import { THEMES_ORDER } from '../../src/data/questions.js';
import { elections } from '../../src/data/elections.js';

const flat = v => Object.fromEntries(THEMES_ORDER.map(t => [t, v]));
const fr2027 = elections.find(e => e.id === 'fr_2027');

// ─── Positions approuvées de test ────────────────────────────────────────────
//
// Depuis le 3e contre-audit, le moteur public n'accepte QUE des positions approuvées :
// `candidate.profile` et `specificQuestions[].positions` n'alimentent plus aucun score.
// Les tests qui vérifiaient la mécanique de calcul doivent donc fournir des preuves.

function approvedFor(questionId, stance) {
  return {
    candidateId: 'x', questionId, stance,
    sourceIds: ['s1'], excerpt: 'extrait', reasoning: 'codage',
    evidenceType: 'programme', confidence: 0.9,
    reviewStatus: 'approved', codedBy: 'a', reviewedBy: 'b',
    validFrom: '2026-01-01', supersedesId: null,
  };
}

/** Positions couvrant tous les thèmes possibles, dérivées d'un profil cible 0–100. */
function positionsFromProfile(profile) {
  return fr2027.specificQuestions.map(q => {
    const target = profile[q.theme] ?? 50;
    const normalized = target / 100;                       // 0…1 dans la convention du thème
    const raw = q.direction === 1 ? normalized : 1 - normalized;
    const stance = Math.max(-2, Math.min(2, Math.round(raw * 4 - 2)));
    return approvedFor(q.id, stance);
  });
}

/**
 * Paramètres complets pour un candidat comparable : positions approuvées + la liste de
 * questions qui leur donne un thème et une direction. Sans `questions`, toute position est
 * rejetée comme « question inconnue » — et le candidat n'obtient aucun score.
 */
const withPositions = (profile, extra = {}) => ({
  approvedPositions: positionsFromProfile(profile),
  sourceIsVerified: () => true,
  questions: fr2027.specificQuestions,
  ...extra,
});

// ─── Pondérations ────────────────────────────────────────────────────────────

test('une allocation themeWeights complète prime sur priorityOrder', () => {
  const weights = Object.fromEntries(THEMES_ORDER.map((t, i) => [t, i === 0 ? 100 : 0]));
  const map = buildWeightMap([...THEMES_ORDER].reverse(), weights);
  assert.equal(map[THEMES_ORDER[0]], 100);
  assert.equal(map[THEMES_ORDER[1]], 0);
});

test('priorityOrder seul → poids 8 → 1 selon le rang', () => {
  const map = buildWeightMap([...THEMES_ORDER], null);
  assert.equal(map[THEMES_ORDER[0]], 8);
  assert.equal(map[THEMES_ORDER[7]], 1);
});

test('une allocation entièrement nulle ne produit ni NaN ni résultat arbitraire', () => {
  const zero = Object.fromEntries(THEMES_ORDER.map(t => [t, 0]));
  const map = buildWeightMap(null, zero);
  assert.ok(THEMES_ORDER.every(t => map[t] === 1), 'repli documenté : poids égaux');

  const score = calculateAlignment(flat(50), flat(50), null, zero);
  assert.ok(Number.isFinite(score) && score >= 0 && score <= 100);
});

test('un thème de poids nul ne déclenche pas de veto (pas de porte dérobée)', () => {
  // L'utilisateur a explicitement écarté l'immigration ; un désaccord maximal sur ce thème
  // ne doit pas écraser le score par la porte du veto.
  const user   = { ...flat(50), IMMIGRATION: 0 };
  const target = { ...flat(50), IMMIGRATION: 100 };
  const weights = Object.fromEntries(THEMES_ORDER.map(t => [t, t === 'IMMIGRATION' ? 0 : 14]));

  const { multiplier, triggered } = computeVeto(user, target, buildWeightMap(null, weights));
  assert.equal(multiplier, 1);
  assert.equal(triggered.length, 0);
});

// ─── Veto ────────────────────────────────────────────────────────────────────

test('le veto couvre exactement 6 thèmes, dont GLOBAL', () => {
  assert.equal(Object.keys(VETO_THEMES).length, 6);
  assert.ok('GLOBAL' in VETO_THEMES, 'GLOBAL était absent de la copie utilisée par la page Élection');
  assert.ok(!('DEMOCRACY' in VETO_THEMES));
  assert.ok(!('ENVIRONMENT' in VETO_THEMES));
});

test('le veto est continu : franchir le seuil d’un point ne fait pas de falaise', () => {
  const cfg = VETO_THEMES.IMMIGRATION;
  const at   = computeVeto({ ...flat(50), IMMIGRATION: 50 }, { ...flat(50), IMMIGRATION: 50 + cfg.threshold });
  const just = computeVeto({ ...flat(50), IMMIGRATION: 50 }, { ...flat(50), IMMIGRATION: 50 + cfg.threshold + 1 });
  assert.equal(at.multiplier, 1);
  assert.ok(Math.abs(just.multiplier - 1) < 0.02, 'saut trop brutal au franchissement du seuil');
});

test('un thème inconnu (scoring v2) ne peut pas fonder un désaccord majeur', () => {
  const user = { ...flat(50), IMMIGRATION: null };
  const { multiplier } = computeVeto(user, { ...flat(50), IMMIGRATION: 100 });
  assert.equal(multiplier, 1);
});

// ─── computeCandidateMatch ───────────────────────────────────────────────────

test('déterminisme : deux appels identiques renvoient le même score', () => {
  const params = { userThemes: flat(60), candidate: fr2027.candidates[0], priorityOrder: [...THEMES_ORDER] };
  assert.equal(computeCandidateMatch(params).score, computeCandidateMatch(params).score);
});

test('un candidat doté de positions approuvées obtient un score fini et borné', () => {
  for (const c of fr2027.candidates) {
    const m = computeCandidateMatch({
      userThemes: flat(50), candidate: c, priorityOrder: [...THEMES_ORDER],
      ...withPositions(flat(50)),
    });
    assert.ok(Number.isFinite(m.score), `${c.id} : score non fini`);
    assert.ok(m.score >= 0 && m.score <= 100, `${c.id} : score hors bornes`);
  }
});

test('la couverture spécifique ne compte que les positions approuvées ET répondues', () => {
  const questions = fr2027.specificQuestions;
  const answers = Object.fromEntries(questions.slice(0, 5).map(q => [q.id, 4]));
  // Seules 5 questions sont sourcées : la couverture ne doit pas prétendre en utiliser 17.
  const positions = questions.slice(0, 5).map(q => approvedFor(q.id, 1));

  const m = computeCandidateMatch({
    userThemes: flat(50), candidate: fr2027.candidates[0], priorityOrder: [...THEMES_ORDER],
    electionAnswers: answers, questions,
    approvedPositions: positions, sourceIsVerified: () => true,
  });
  assert.equal(m.coverage.answeredSpecific, 5);
  assert.equal(m.coverage.positionsUsed, 5);
  assert.equal(m.coverage.sourcedPositions, 5);
});

test('régression Le Pen / Mélenchon : les clés de positions restent alignées sur les IDs', () => {
  // Le bug d'origine (couverture 0/17) portait sur l'ALIGNEMENT DES IDENTIFIANTS dans
  // `elections.js`. Ces données ne produisent plus de score, mais leur cohérence reste un
  // invariant : elles serviront de base au codage sourcé, question par question.
  const questions = fr2027.specificQuestions;
  for (const id of ['lepen_2027', 'melenchon_2027']) {
    const n = questions.filter(q => q.positions?.[id] != null).length;
    assert.equal(n, 17, `${id} : ${n}/17 positions éditoriales — désalignement des identifiants`);
  }
});

test('couverture nulle → le score ne prétend pas tenir compte des réponses spécifiques', () => {
  const questions = fr2027.specificQuestions;
  const answers = Object.fromEntries(questions.map(q => [q.id, 3]));
  // Candidat fictif absent de toutes les positions.
  const ghost = { id: 'candidat-inconnu', name: 'Inconnu', profile: flat(50) };

  const m = computeCandidateMatch({
    userThemes: flat(50), candidate: ghost, priorityOrder: [...THEMES_ORDER],
    electionAnswers: answers, questions,
  });
  assert.equal(m.coverage.positionsUsed, 0);
  assert.equal(m.coverage.specificIgnored, true, 'le drapeau doit permettre à l’UI de le dire');
  assert.equal(m.electionScore, null);
  assert.equal(m.score, m.globalScore);
});

test('les surfaces Profil et Élection produisent le même score pour les mêmes entrées', () => {
  // Le moteur est unique : deux appels identiques doivent donner le même résultat, quel que
  // soit l'appelant. (Le rapprochement avec `calculateAlignment` n'a plus lieu d'être :
  // celui-ci travaille sur des profils legacy, exclus du produit public.)
  const user = { ...flat(50), IMMIGRATION: 20, ECONOMY: 80 };
  for (const c of fr2027.candidates) {
    const params = {
      userThemes: user, candidate: c, priorityOrder: [...THEMES_ORDER], ...withPositions(flat(45)),
    };
    assert.equal(computeCandidateMatch(params).score, computeCandidateMatch(params).score, c.id);
  }
});

test('les pondérations personnalisées modifient bien le classement', () => {
  const user = { ...flat(50), ENVIRONMENT: 95, ECONOMY: 20 };
  const questions = fr2027.specificQuestions;
  const profils = { a: { ...flat(50), ENVIRONMENT: 90 }, b: { ...flat(50), ECONOMY: 15 } };
  const candidats = [
    { id: 'a', name: 'A', positions: positionsFromProfile(profils.a) },
    { id: 'b', name: 'B', positions: positionsFromProfile(profils.b) },
  ];

  const rank = params => candidats
    .map(c => ({ id: c.id, score: computeCandidateMatch({
      ...params, candidate: { id: c.id, name: c.name }, questions,
      approvedPositions: c.positions, sourceIsVerified: () => true,
    }).score }))
    .sort((x, y) => y.score - x.score).map(x => x.id);

  const base = rank({ userThemes: user, priorityOrder: [...THEMES_ORDER] });
  const ecolo = Object.fromEntries(THEMES_ORDER.map(t => [t, t === 'ENVIRONMENT' ? 65 : 5]));
  const pondere = rank({ userThemes: user, themeWeights: ecolo });

  assert.ok(base.length === 2 && pondere.length === 2);
  assert.equal(pondere[0], 'a', 'un poids écrasant sur l’environnement doit faire gagner le profil vert');
});

test('deux premiers trop proches → le classement le signale', () => {
  const positions = positionsFromProfile(flat(50));
  const params = {
    userThemes: flat(50), priorityOrder: [...THEMES_ORDER],
    questions: fr2027.specificQuestions,
    approvedPositions: positions, sourceIsVerified: () => true,
  };
  const { tooClose, results } = rankCandidates(params, [
    { id: 'a', name: 'A' }, { id: 'b', name: 'B' },
  ]);
  assert.equal(results.length, 2, 'les deux candidats doivent être classés');
  assert.equal(tooClose, true);
  assert.ok(MATCH_CONFIG.tieThreshold > 0);
});

test('rankByAlignment reste trié par score décroissant', () => {
  const ranked = rankByAlignment({ themes: flat(50) }, fr2027.candidates, [...THEMES_ORDER]);
  for (let i = 1; i < ranked.length; i++) {
    assert.ok(ranked[i - 1].alignment >= ranked[i].alignment);
  }
});

// ─── Seuil de couverture minimale ────────────────────────────────────────────
//
// La couverture se compte désormais sur les thèmes connus DES DEUX CÔTÉS : côté candidat,
// un thème n'est connu que s'il est dérivé d'assez de positions approuvées ; côté
// utilisateur, il peut valoir `null` en scoring v2.

/** Profil utilisateur avec exactement `n` thèmes connus, le reste à null (scoring v2). */
const withKnownThemes = n => Object.fromEntries(
  THEMES_ORDER.map((t, i) => [t, i < n ? 60 : null]),
);

test('couverture : candidat entièrement sourcé mais utilisateur trop peu couvert → pas de score', () => {
  for (const n of [0, 1, 3]) {
    const m = computeCandidateMatch({
      userThemes: withKnownThemes(n),
      candidate: fr2027.candidates[0],
      priorityOrder: [...THEMES_ORDER],
      ...withPositions(flat(50)),
    });
    assert.equal(m.score, null, `${n} thème(s) utilisateur : un score a été produit`);
    // `no_user_profile` couvre le cas n = 0 : depuis 2026-08-14, « aucun thème renseigné » et
    // « tous les thèmes mis à zéro » portent deux motifs distincts, parce qu'ils se réparent
    // par des gestes opposés.
    assert.ok(
      ['insufficient_coverage', 'no_weighted_theme', 'no_user_profile'].includes(m.reason),
      `${n} thème(s) : motif inattendu « ${m.reason} »`,
    );
  }
});

test('couverture : un score apparaît quand les deux côtés atteignent le seuil', () => {
  const m = computeCandidateMatch({
    userThemes: flat(50),
    candidate: fr2027.candidates[0],
    priorityOrder: [...THEMES_ORDER],
    ...withPositions(flat(50)),
  });
  assert.ok(Number.isFinite(m.score), `aucun score malgré ${m.coverage.themesKnown} thèmes connus`);
  assert.equal(m.reason, null);
  assert.ok(m.coverage.themesKnown >= MATCH_CONFIG.minKnownThemesForScore);
});

test('couverture : un candidat sans score est exclu du classement mais listé à part', () => {
  // Aucune position injectée ⇒ aucun candidat comparable, exactement l'état actuel du dépôt.
  const params = { userThemes: flat(50), priorityOrder: [...THEMES_ORDER] };
  const { results, unscored } = rankCandidates(params, fr2027.candidates);
  assert.equal(results.length, 0, 'des candidats ont été classés sans preuve sourcée');
  assert.equal(unscored.length, fr2027.candidates.length, 'les non classés doivent rester visibles');
  assert.ok(unscored.every(u => u.match.reason === 'no_sourced_positions'));
});

test('couverture : les réponses spécifiques ne compensent pas un profil trop peu couvert', () => {
  // 5 positions sourcées sur un seul thème : la composante électorale existe, mais le profil
  // reste trop mince pour produire un score comparable aux autres candidats.
  const eco = fr2027.specificQuestions.filter(q => q.theme === 'ECONOMY');
  const answers = Object.fromEntries(fr2027.specificQuestions.map(q => [q.id, 3]));
  const m = computeCandidateMatch({
    userThemes: flat(50), candidate: fr2027.candidates[0], priorityOrder: [...THEMES_ORDER],
    electionAnswers: answers, questions: fr2027.specificQuestions,
    approvedPositions: eco.map(q => approvedFor(q.id, 1)), sourceIsVerified: () => true,
  });
  assert.equal(m.score, null);
  assert.equal(m.reason, 'insufficient_coverage');
  assert.equal(m.coverage.sourcedPositions, eco.length, 'la couverture sourcée reste rapportée');
});
