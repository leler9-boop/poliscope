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

let broken = 0;
const fail = msg => { console.log(`  ✖ ${msg}`); broken++; };

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
    fail(`${election.id} : même un corpus PARFAIT ne peut pas produire de score `
      + `(${reachableThemes} thèmes atteignables < ${MATCH_CONFIG.minKnownThemesForScore} requis). `
      + 'Le questionnaire ou le seuil doit changer.');
  }

  let scored = 0;
  const rows = [];
  for (const candidate of election.candidates) {
    const canonical = resolveCandidateId(candidate.id);
    const all = CANDIDATE_POSITIONS.filter(p => p.candidateId === canonical);
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

console.log('════════════════════════════════════════════════════════════');
if (broken) {
  console.log(`ÉCHEC — ${broken} anomalie(s) de CHAÎNE.`);
  console.log('Un corpus incomplet n’échoue pas ici ; une chaîne cassée, oui.');
  process.exit(1);
}
console.log('OK — la chaîne de matching est intacte.');
console.log('Un candidat sans score l’est faute de corpus approuvé, pas faute de moteur.');
