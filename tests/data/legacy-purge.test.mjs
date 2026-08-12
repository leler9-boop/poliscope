// POLISCOP — Aucune surface publique ne dérive un affichage de données non sourcées.
//
// CE QUE CES TESTS VERROUILLENT
// -----------------------------
// Le moteur avait cessé de lire `candidate.profile` et `specificQuestions[].positions`
// (voir tests/engine/sourced-matching.test.mjs). Les COMPOSANTS, eux, continuaient :
//
//   ElectionDetail.jsx  getQuestionBreakdown()       → `q.positions[candidate.id]`
//                       getThemeAgreementsFallback() → `candidate.profile`
//                       getMatchSentence()           → idem, par transitivité
//                       generateProfileAnalysis()    → `top.profile?.[theme] ?? 50`
//                       ThemeBreakdown()             → `candidate.profile?.[theme] ?? 50`
//                       ComparePanel()               → `c.profile?.[theme] ?? 50`
//   CandidateProfile.jsx  « Positions idéologiques » → `candidate.profile`
//
// Le score affiché était donc honnête (« pas de score »), pendant que le texte juste en
// dessous affirmait « Proches sur l'économie, plus éloignés sur l'immigration » — une
// affirmation sur les positions d'une personne réelle, sans aucune source.
//
// Le `?? 50` est le cœur du problème : il transforme « on ne sait pas » en « exactement au
// centre ». Une absence de donnée devenait une position mesurée.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { computeCandidateMatch } from '../../src/engine/candidateMatch.js';
import { MATCH_CONFIG } from '../../src/engine/matchConfig.js';
import { THEMES_ORDER } from '../../src/data/questions.js';
import { elections } from '../../src/data/elections.js';
import { REVIEW_STATUS } from '../../src/data/candidateProvenance.js';
import { CANDIDATE_REGISTRY, PROFILE_SOURCE, isMatchReady } from '../../src/data/candidateRegistry.js';

const fr2027 = elections.find(e => e.id === 'fr_2027');
const flat = v => Object.fromEntries(THEMES_ORDER.map(t => [t, v]));

// ─── 1. Balayage statique des surfaces publiques ────────────────────────────

test('aucun composant public ne lit candidate.profile ni q.positions', () => {
  const racine = fileURLToPath(new URL('../../src', import.meta.url));
  const fichiers = [];
  (function walk(dir) {
    for (const nom of readdirSync(dir)) {
      const p = join(dir, nom);
      if (statSync(p).isDirectory()) walk(p);
      else if (/\.jsx$/.test(nom)) fichiers.push(p);
    }
  })(racine);

  // Motifs de LECTURE, hors commentaires : c'est l'exécution qui ment, pas la documentation.
  const motifs = [
    /(?<![\w.])(?:candidate|c|top|second|last)\.profile\s*(?:\?\.)?\[/,
    /\.positions\s*\[\s*candidate\.id\s*\]/,
    /(?<![\w.])(?:candidate|c)\.profile\b(?!\s*est\b)/,
  ];

  // Les commentaires sont retirés du fichier ENTIER avant l'analyse, pas ligne à ligne :
  // un commentaire JSX `{/* … */}` s'étend sur plusieurs lignes dont aucune ne commence par
  // un marqueur. Les documenter est nécessaire ; c'est le code exécuté qui est contrôlé.
  const sansCommentaires = texte => texte
    .replace(/\/\*[\s\S]*?\*\//g, m => m.replace(/[^\n]/g, ' '))  // blocs, longueur préservée
    .replace(/(^|[^:])\/\/[^\n]*/g, (m, p1) => p1 + ' '.repeat(m.length - p1.length));

  const coupables = [];
  for (const f of fichiers) {
    const lignes = sansCommentaires(readFileSync(f, 'utf8')).split('\n');
    lignes.forEach((ligne, i) => {
      if (motifs.some(m => m.test(ligne))) {
        coupables.push(`${f.replace(racine, 'src')}:${i + 1}  ${ligne.trim().slice(0, 90)}`);
      }
    });
  }

  assert.deepEqual(coupables, [],
    `surface publique alimentée par des données non sourcées :\n${coupables.join('\n')}`);
});

// ─── 2. Un candidat purement legacy ne produit aucun affichage dérivé ───────

test('un candidat legacy ne fournit ni score, ni accords, ni profil thématique', () => {
  const legacy = { id: 'roussel_2027', name: 'Test', profile: flat(60) };
  const m = computeCandidateMatch({
    userThemes: flat(55),
    candidate: legacy,
    priorityOrder: [...THEMES_ORDER],
    questions: fr2027.specificQuestions,
    electionAnswers: Object.fromEntries(fr2027.specificQuestions.map(q => [q.id, 3])),
  });

  assert.equal(m.score, null, 'un profil legacy ne doit produire aucun score');
  // ⚠ Le MOTIF a changé avec la réconciliation de la seconde lecture : Roussel possède
  // désormais des positions approuvées, donc le refus ne vient plus de leur absence mais
  // de la couverture thématique. Les deux motifs disent la même chose de fond — rien de
  // publiable — et le test accepte l'un ou l'autre plutôt que de figer un état du corpus.
  assert.ok(['no_sourced_positions', 'no_weighted_theme', 'insufficient_coverage'].includes(m.reason),
    `motif inattendu : ${m.reason}`);
  assert.deepEqual(m.agreements, [], 'aucun accord ne peut être affirmé sans preuve');
  assert.deepEqual(m.disagreements, [], 'aucun désaccord ne peut être affirmé sans preuve');
  assert.equal(m.breakdownSource, 'none');

  // Le point central : aucun des huit nombres saisis à la main ne transparaît. Un thème
  // dérivé peut exister s'il vient d'une position APPROUVÉE — c'est légitime, et c'est même
  // le but ; ce qui reste interdit, c'est qu'une valeur du profil legacy apparaisse.
  assert.ok(m.derivedThemes, 'derivedThemes doit être exposé pour que les vues cessent de lire le legacy');
  for (const t of THEMES_ORDER) {
    assert.notEqual(m.derivedThemes[t], legacy.profile[t],
      `${t} reprend la valeur legacy : les 8 nombres saisis à la main transparaissent`);
  }
});

// ─── 3. Un candidat fictif entièrement sourcé, lui, est comparable ──────────

/**
 * Sans ce cas, les tests ci-dessus seraient satisfaits par un moteur qui ne renvoie JAMAIS
 * rien. Il prouve que la purge n'a pas simplement tout éteint : une preuve recevable produit
 * bien un score et une ventilation par thème.
 */
function positionApprouvee(questionId, stance) {
  return {
    candidateId: 'candidat-fictif-sourcé', questionId, stance,
    sourceIds: ['src-test'], excerpt: 'extrait probant', reasoning: 'codage',
    evidenceType: 'programme', confidence: 0.9,
    reviewStatus: REVIEW_STATUS.APPROVED,
    codedBy: 'codeur', reviewedBy: 'relecteur',
    validFrom: '2026-01-01', supersedesId: null,
  };
}

test('un candidat fictif entièrement sourcé obtient un score et des thèmes dérivés', () => {
  const questions = fr2027.specificQuestions;
  const positions = questions.map(q => positionApprouvee(q.id, 1));

  const m = computeCandidateMatch({
    userThemes: flat(60),
    candidate: { id: 'candidat-fictif-sourcé', name: 'Candidate fictive' },
    priorityOrder: [...THEMES_ORDER],
    questions,
    electionAnswers: Object.fromEntries(questions.map(q => [q.id, 4])),
    approvedPositions: positions,
    sourceIsVerified: () => true,
  });

  assert.equal(typeof m.score, 'number', `score attendu, obtenu ${m.score} (motif : ${m.reason})`);
  assert.ok(m.score >= 0 && m.score <= 100, `score hors domaine : ${m.score}`);
  assert.equal(m.reason, null);
  assert.equal(m.breakdownSource, 'sourced-positions');

  const connus = THEMES_ORDER.filter(t => m.derivedThemes[t] != null);
  assert.ok(connus.length >= MATCH_CONFIG.minKnownThemesForScore,
    `couverture dérivée insuffisante : ${connus.length} thèmes connus`);
  assert.equal(m.coverage.positionProvenance, 'sourced-positions');
});

// ─── 4. Un thème non sourcé reste null, y compris chez un candidat scorable ──

test('chez un candidat partiellement sourcé, les thèmes sans preuve restent null', () => {
  const questions = fr2027.specificQuestions;
  // On ne code que les questions des quatre premiers thèmes présents.
  const themesCodes = [...new Set(questions.map(q => q.theme))].slice(0, 4);
  const positions = questions
    .filter(q => themesCodes.includes(q.theme))
    .map(q => positionApprouvee(q.id, 1));

  const m = computeCandidateMatch({
    userThemes: flat(60),
    candidate: { id: 'candidat-fictif-sourcé', name: 'Partielle' },
    priorityOrder: [...THEMES_ORDER],
    questions,
    approvedPositions: positions,
    sourceIsVerified: () => true,
  });

  for (const t of THEMES_ORDER.filter(t => !themesCodes.includes(t))) {
    assert.equal(m.derivedThemes[t], null,
      `${t} n'a aucune position sourcée : il doit valoir null, jamais 50`);
  }
  assert.notEqual(
    THEMES_ORDER.filter(t => m.derivedThemes[t] != null).length, 0,
    'les thèmes réellement sourcés doivent, eux, être renseignés',
  );
});

// ─── 5. `matchReady` stocké ne peut pas contredire la réalité ───────────────

test('le drapeau matchReady stocké ne déclare jamais comparable un profil non sourcé', () => {
  const menteurs = CANDIDATE_REGISTRY.filter(
    p => p.matchReady === true && p.profileSource !== PROFILE_SOURCE.SOURCED_POSITIONS,
  );

  // Ce constat est VOLONTAIREMENT non bloquant sur le champ stocké : le corriger à la main
  // reviendrait à remplacer un booléen faux par un autre booléen déclaratif. Ce qui doit être
  // vrai, c'est que RIEN dans le produit ne consomme ce champ comme une vérité.
  assert.ok(menteurs.length > 0 || true, 'constat informatif');

  // L'exigence, elle, est stricte : la fonction dérivée doit refuser tous ces cas.
  for (const p of menteurs) {
    assert.equal(isMatchReady(p), false,
      `${p.id} est déclaré matchReady alors que son profil est « ${p.profileSource} » : ` +
      `la comparabilité doit être constatée, pas déclarée`);
  }
});

test('isMatchReady s’aligne exactement sur le refus du moteur', () => {
  // Toute personne du registre que le moteur refuse de noter doit être dite non comparable —
  // sinon l'interface promet un classement que le calcul ne produira jamais.
  for (const p of CANDIDATE_REGISTRY) {
    if (isMatchReady(p, fr2027.specificQuestions)) continue;
    const m = computeCandidateMatch({
      userThemes: flat(50),
      candidate: { id: p.id, name: p.displayName },
      priorityOrder: [...THEMES_ORDER],
      questions: fr2027.specificQuestions,
    });
    assert.equal(m.score, null,
      `${p.id} : isMatchReady dit « non comparable » mais le moteur produit ${m.score}/100`);
  }
});
