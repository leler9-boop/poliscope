// POLISCOP — État réel de publiabilité du matching candidats.
//
// POURQUOI CE CONTRÔLE EXISTE
// ---------------------------
// Le 2026-08-10, l'utilisateur a signalé que TOUS les candidats de la présidentielle 2027
// affichaient « Aucune donnée comparable ». Bissection : 10/10 candidats scorés en `a231536`,
// 0/10 dès `83bde2b` (bascule vers le matching sourcé). Entre les deux, aucun test n'a
// bronché, aucun contrôle n'a signalé quoi que ce soit, et la panne s'est découverte en
// production plusieurs commits plus tard.
//
// Le moteur n'était pas cassé : il refusait — correctement — de publier un score non sourcé.
// Ce qui manquait, c'est un contrôle qui RENDE VISIBLE l'état du corpus. C'est celui-ci.
//
// Il n'échoue PAS parce que le corpus est incomplet : un corpus incomplet est un état de
// travail normal, pas une régression. Il échoue si la CHAÎNE est cassée — c'est-à-dire si des
// positions approuvées et suffisantes existent sans produire le moindre score.
import { register } from 'node:module';
import { pathToFileURL, fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url)).replace(/\/$/, '');
register(new URL('./lib/json-import-loader.mjs', import.meta.url));
const base = pathToFileURL(ROOT).href;

const { elections } = await import(`${base}/src/data/elections.js`);
const { CANDIDATE_POSITIONS, getSource, REVIEW_STATUS } = await import(`${base}/src/data/candidateProvenance.js`);
const { resolveCandidateId } = await import(`${base}/src/data/candidateRegistry.js`);
const { computeCandidateMatch } = await import(`${base}/src/engine/candidateMatch.js`);
const { MATCH_CONFIG } = await import(`${base}/src/engine/matchConfig.js`);
const { THEMES_ORDER } = await import(`${base}/src/data/questions.js`);

const sourceIsVerified = id => Boolean(getSource(id)?.verifiedAt);
const neutralProfile = Object.fromEntries(THEMES_ORDER.map(t => [t, 50]));

// Deux niveaux, parce que deux natures de problème :
//   • RÉGRESSION TECHNIQUE — la chaîne est cassée. Toujours bloquant.
//   • LIMITE STRUCTURELLE CONNUE — le questionnaire d'une élection ne peut pas atteindre le
//     seuil strict. C'est documenté, ce n'est pas une régression, et faire échouer la CI
//     là-dessus rendrait la commande inutilisable : elle sortirait en erreur en permanence.
// `--strict` rend les limites connues bloquantes, pour un audit volontaire.
const STRICT = process.argv.includes('--strict');
let broken = 0;
let warnings = 0;
const fail = msg => { console.log(`  ✖ ${msg}`); broken++; };
const warn = msg => { console.log(`  ⚠ ${msg}`); warnings++; };

console.log('Matching candidats — état de publiabilité\n');
console.log(`Seuils (matchConfig.js) : ${MATCH_CONFIG.minSourcedPositionsPerTheme} position(s) sourcée(s) par thème, `
  + `${MATCH_CONFIG.minKnownThemesForScore} thèmes connus minimum pour publier un score.\n`);

for (const election of elections) {
  const questions = election.specificQuestions ?? [];
  if (!questions.length) continue;
  const byId = new Map(questions.map(q => [q.id, q]));

  // Plafond structurel : un thème représenté par une seule question ne peut JAMAIS atteindre
  // le seuil de deux positions. C'est une propriété du questionnaire, pas du corpus.
  const questionsPerTheme = {};
  for (const q of questions) questionsPerTheme[q.theme] = (questionsPerTheme[q.theme] ?? 0) + 1;
  const reachableThemes = Object.values(questionsPerTheme)
    .filter(n => n >= MATCH_CONFIG.minSourcedPositionsPerTheme).length;

  console.log(`── ${election.id} — ${election.candidates.length} candidats, ${questions.length} questions`);
  console.log(`   thèmes atteignables au mieux : ${reachableThemes} / ${THEMES_ORDER.length}`);
  if (reachableThemes < MATCH_CONFIG.minKnownThemesForScore) {
    (STRICT ? fail : warn)(`${election.id} : même un corpus PARFAIT ne peut pas produire de score `
      + `(${reachableThemes} thèmes atteignables < ${MATCH_CONFIG.minKnownThemesForScore} requis). `
      + 'Le questionnaire ou le seuil doit changer.');
  }

  let scored = 0;
  const rows = [];
  for (const candidate of election.candidates) {
    const canonical = resolveCandidateId(candidate.id);
    // Filtrage par les questions DE CETTE élection : sans lui, les positions de Roussel
    // codées sur fr_2027 étaient comptées comme corpus de fr_2022, où elles ne peuvent
    // rien produire (le moteur les rejette en `unknown_question`, mais le rapport mentait).
    const all = CANDIDATE_POSITIONS.filter(p => p.candidateId === canonical && byId.has(p.questionId));
    const coded = all.filter(p => p.stance != null);
    const approved = all.filter(p => p.reviewStatus === REVIEW_STATUS.APPROVED);

    // Thèmes qui atteindraient le seuil SI toutes les positions codées étaient approuvées.
    const perTheme = {};
    for (const p of coded) {
      const theme = byId.get(p.questionId)?.theme;
      if (theme) perTheme[theme] = (perTheme[theme] ?? 0) + 1;
    }
    const themesReady = Object.values(perTheme)
      .filter(n => n >= MATCH_CONFIG.minSourcedPositionsPerTheme).length;

    const match = computeCandidateMatch({
      userThemes: neutralProfile, candidate, questions, sourceIsVerified,
    });
    if (match.score != null) scored++;

    rows.push({
      id: candidate.id, canonical,
      positions: all.length, coded: coded.length, approved: approved.length,
      themesReady, score: match.score, reason: match.reason ?? null,
      blocage: all.length === 0 ? 'aucun corpus'
        : approved.length === 0 ? 'relecture non faite'
        : themesReady < MATCH_CONFIG.minKnownThemesForScore ? 'corpus trop étroit'
        : match.score == null ? 'CHAÎNE CASSÉE' : '—',
    });
  }

  for (const r of rows) {
    console.log(`   ${String(r.id).padEnd(16)} pos ${String(r.positions).padStart(2)} `
      + `· codées ${String(r.coded).padStart(2)} · approuvées ${String(r.approved).padStart(2)} `
      + `· thèmes prêts ${r.themesReady} · score ${r.score ?? '—'}  ${r.blocage}`);
  }
  console.log(`   → ${scored}/${election.candidates.length} candidats scorés\n`);

  // LE contrôle : une position approuvée et suffisante DOIT produire un score. Si ce n'est
  // pas le cas, le défaut est dans le moteur ou le mapping, pas dans le corpus.
  for (const r of rows) {
    if (r.blocage === 'CHAÎNE CASSÉE') {
      fail(`${r.id} : ${r.approved} positions approuvées couvrant ${r.themesReady} thèmes, `
        + `et pourtant aucun score (« ${r.reason} »). Moteur ou mapping en cause.`);
    }
  }
}

// ─── Voie éditoriale V1 ──────────────────────────────────────────────────────

console.log('════════════════════════════════════════════════════════════');
console.log('Matching éditorial V1 (estimations, jamais « vérifié »)\n');

const { getEditorialAnswers, editorialCoverage, candidatesWithEditorialAnswers } =
  await import(`${base}/src/data/candidateEditorialAnswers.js`);
const { rankEditorialMatches } = await import(`${base}/src/engine/editorialMatch.js`);

const withEditorial = new Set(candidatesWithEditorialAnswers());
for (const election of elections) {
  const questions = election.specificQuestions ?? [];
  if (!questions.length) continue;
  const covered = election.candidates.filter(c => withEditorial.has(resolveCandidateId(c.id)));
  if (!covered.length) {
    console.log(`── ${election.id} : aucun profil éditorial`);
    continue;
  }
  // Profil neutre : sert uniquement à vérifier que la chaîne produit un score, pas à juger.
  const neutralAnswers = Object.fromEntries(questions.map(q => [q.id, 3]));
  const { results, unscored } = rankEditorialMatches(election.candidates, {
    userAnswers: neutralAnswers, questions,
    answersFor: c => getEditorialAnswers(c.id, election.id),
  });
  console.log(`── ${election.id} — ${results.length}/${election.candidates.length} candidats comparables`);
  for (const { candidate } of results) {
    const c = editorialCoverage(candidate.id, election.id);
    console.log(`   ${String(candidate.id).padEnd(16)} ${c.known}/${c.total} réponses estimées`
      + `${c.unknown ? ` · ${c.unknown} inconnues` : ''}`);
  }
  for (const { candidate, match } of unscored) {
    console.log(`   ${String(candidate.id).padEnd(16)} non comparable — ${match.reason}`);
  }
  console.log('');
}

console.log('════════════════════════════════════════════════════════════');
if (broken) {
  console.log(`ÉCHEC — ${broken} régression(s) technique(s) de la chaîne de matching.`);
  console.log('Un corpus incomplet n’échoue pas ici ; une chaîne cassée, oui.');
  process.exit(1);
}
console.log('OK — la chaîne de matching est intacte.');
if (warnings) {
  console.log(`${warnings} limite(s) structurelle(s) connue(s) signalée(s) en avertissement.`);
  console.log('Ce sont des questionnaires d’élection trop étroits pour le seuil strict, pas des');
  console.log('régressions. `node scripts/check-matching.mjs --strict` les rend bloquantes.');
}
console.log('Voie stricte : aucun corpus approuvé à ce jour — aucun candidat n’y est scorable.');
console.log('Voie éditoriale V1 : opérationnelle, résultats étiquetés « estimation ».');
