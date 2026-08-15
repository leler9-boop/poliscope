// POLISCOP — Moteur unique de proximité utilisateur ↔ candidat.
//
// Ce module remplace la logique qui vivait dans `src/pages/ElectionDetail.jsx`. Le composant
// React y dupliquait la table de veto (en oubliant GLOBAL) et ignorait complètement
// `themeWeights` : la même personne pouvait obtenir un classement différent selon qu'elle
// regardait la page Profil ou la page Élection. Fonction pure, testable, versionnée.
//
// CONTRAT DE PREUVE (2026-08-09, 3e contre-audit)
// -----------------------------------------------
// Une contribution candidat n'entre dans un score PUBLIC que si elle provient d'une position
// `approved`, sourcée par un document VÉRIFIÉ, codée, relue et datée. Il n'existe plus aucun
// repli :
//   • `candidate.profile` (`legacy-manual-v1`, huit nombres saisis à la main) n'alimente plus
//     le classement public ;
//   • `specificQuestions[].positions` n'est plus utilisé comme position de secours.
// Avec zéro position approuvée, le comportement honnête est : aucun candidat classé.
// Les données legacy restent lisibles pour comparaison interne et migration — jamais pour
// produire un « meilleur match ».
//
// CE QUE LE SCORE EST — et n'est pas
// ----------------------------------
// C'est un INDICE DE PROXIMITÉ éditorial sur 100, pas un pourcentage. Ce n'est ni une
// probabilité de vote, ni une proportion de positions communes. Il combine :
//   • une distance thématique pondérée par les priorités de l'utilisateur,
//   • une amplification non linéaire assumée (exposant 2,4),
//   • des pénalités multiplicatives sur 6 thèmes clivants.
// L'interface doit l'afficher comme « xx/100 » avec sa couverture, jamais comme « xx % »
// sans dénominateur. Voir docs/methodology/matching.md.

import { THEMES_ORDER, THEME_LABELS } from '../data/questions.js';
import { MATCH_CONFIG, computeVeto } from './matchConfig.js';
import { resolveCandidateId } from '../data/candidateRegistry.js';
import { getPositions, getSource } from '../data/candidateProvenance.js';
import { deriveCandidateThemes, CANDIDATE_PROFILE_VERSION } from './candidateProfile.js';
import { buildWeightMap } from './matcher.js';
import { MATCHING_VERSION, CANDIDATE_DATA_RELEASE } from './versions.js';
import { resolveGeneralContract, resolveDirectElectionContract } from './matchContracts.js';

/**
 * Les DEUX lectures du produit. Elles répondent à deux questions différentes et peuvent
 * désigner deux candidats différents : c'est une information, pas une incohérence.
 *
 *   `general`  — « De manière générale, quel candidat possède les idées les plus proches
 *                 des miennes ? » Profil utilisateur contre corpus du candidat, huit thèmes.
 *   `election` — « Sur les questions propres à cette élection auxquelles j'ai répondu, de
 *                 quel candidat suis-je le plus proche ? » Comparaison directe, question par
 *                 question, sur l'intersection réelle.
 *
 * ⚠ IL N'Y A PAS DE TROISIÈME INDICE COMBINÉ. Le mélange 65/35 comptait deux fois les mêmes
 * positions : elles servaient d'abord à dériver un profil thématique, puis à produire le
 * score direct. Voir `docs/methodology/matching.md`.
 */
export const MATCH_READING = Object.freeze({
  GENERAL:  'general',
  ELECTION: 'election',
});

/**
 * @typedef {Object} MatchResult
 * @property {number}  score              indice de proximité final 0–100
 * @property {number}  globalScore        composante « profil global »
 * @property {number|null} electionScore  composante « questions de l'élection », null si aucune
 * @property {Object}  coverage           { themesKnown, themesTotal, positionsUsed, positionsTotal, answeredSpecific }
 * @property {Array}   vetoTriggered      désaccords majeurs ayant pesé sur le score
 * @property {Array}   agreements         principaux accords (questions spécifiques si disponibles)
 * @property {Array}   disagreements      principaux désaccords
 * @property {Object}  versions           versions du calcul
 */

/**
 * Score de proximité global (profil 8 thèmes contre profil candidat).
 * Gère les thèmes inconnus (`null`, scoring v2) : ils sont exclus de la moyenne au lieu
 * d'être assimilés à 50, qui confondait « je ne sais pas » et « centriste ».
 */
function globalProximity(userThemes, targetThemes, weightMap, contract = null) {
  let weightedDistanceSum = 0;
  let totalWeight = 0;
  let themesKnown = 0;

  for (const theme of THEMES_ORDER) {
    const u = userThemes?.[theme];
    const t = targetThemes?.[theme];
    if (u == null || t == null) continue;      // thème inconnu → hors calcul
    const weight = weightMap[theme] ?? 1;
    if (!(weight > 0)) continue;               // thème explicitement écarté par l'utilisateur
    themesKnown++;
    weightedDistanceSum += weight * (Math.abs(u - t) / 100);
    totalWeight += weight;
  }

  if (totalWeight === 0) {
    // ⚠ DEUX CAUSES TRÈS DIFFÉRENTES, longtemps confondues sous un seul motif. « Vous n'avez
    // pas encore fait le test » et « vous avez mis à zéro tous les thèmes comparables » se
    // réparent par des gestes opposés ; afficher le second à qui n'a jamais répondu est
    // incompréhensible.
    const profilVide = THEMES_ORDER.every(t => userThemes?.[t] == null);
    return { score: null, themesKnown, reason: profilVide ? 'no_user_profile' : 'no_weighted_theme' };
  }

  // Seuil de couverture minimale — RÉELLEMENT appliqué depuis le 2026-08-09.
  // `MATCH_CONFIG.minKnownThemesForScore` existait mais n'était consulté nulle part :
  // un score pouvait être calculé, affiché et classé à partir d'un seul thème connu.
  //
  // ⚠ LE SEUIL DÉPEND DÉSORMAIS DU CONTRAT. Le profil général exige quatre thèmes sur huit ;
  // une élection exige ce que son questionnaire rend atteignable, plafonné à quatre et
  // jamais sous trois. Appliquer le seuil général à un questionnaire qui ne couvre que trois
  // thèmes lui imposait une condition qu'aucun corpus ne pourrait remplir — et le refus
  // ressemblait alors à un simple manque de données. Voir `matchContracts.js`.
  if (contract && contract.structurallyPossible === false) {
    return { score: null, themesKnown, reason: contract.reason, contract };
  }
  const seuil = contract?.minKnownThemes ?? MATCH_CONFIG.minKnownThemesForScore;
  if (themesKnown < seuil) {
    return { score: null, themesKnown, reason: 'insufficient_coverage', contract };
  }

  const meanDistance = weightedDistanceSum / totalWeight;
  const base = Math.pow(1 - meanDistance, MATCH_CONFIG.distanceExponent) * 100;
  const { multiplier, triggered } = computeVeto(userThemes, targetThemes, weightMap);

  return {
    score: Math.max(0, Math.min(100, Math.round(base * multiplier))),
    themesKnown,
    vetoTriggered: triggered,
  };
}

/**
 * Correspondance ÉLECTORALE DIRECTE — « sur les questions de cette élection auxquelles j'ai
 * répondu, de quel candidat suis-je le plus proche ? »
 *
 * ⚠ CE QU'ELLE NE FAIT PLUS (P0-3, 2026-08-14).
 *
 * Elle ne dépend d'AUCUNE dérivation thématique. Auparavant, les mêmes positions servaient
 * deux fois : une première pour construire un profil en huit thèmes, une seconde pour ce
 * score direct — puis les deux étaient mélangés 65/35. Les mêmes preuves étaient donc
 * comptées deux fois, et un candidat dont le profil thématique n'atteignait pas quatre
 * thèmes ne pouvait obtenir AUCUN score électoral, même avec sept positions approuvées et
 * relues sur le questionnaire du scrutin.
 *
 * Elle n'applique pas non plus le veto : celui-ci compare deux profils THÉMATIQUES. L'y
 * appliquer faisait varier le score électoral quand le profil général de l'utilisateur
 * changeait, alors que ses réponses à l'élection n'avaient pas bougé.
 *
 * SEULES les positions approuvées comptent. Le repli `q.positions[candidateId]` — des valeurs
 * éditoriales non sourcées — reste supprimé.
 *
 * @param {Object} electionAnswers  { [questionId]: 1–5 }
 * @param {Array}  questions        questionnaire du scrutin
 * @param {Array}  usablePositions  positions approuvées et recevables du candidat
 * @param {Object} [electoralWeights] importance déclarée par question ({ [id]: number > 0 })
 */
function electionProximity(electionAnswers, questions, usablePositions, electoralWeights = null) {
  const byQuestion = new Map(usablePositions.map(p => [p.questionId, p]));
  // Positions DISPONIBLES : celles du candidat qui portent sur ce questionnaire, répondues
  // ou non. C'est le dénominateur honnête de « positions comparées / disponibles ».
  const available = questions.filter(q => byQuestion.has(q.id));
  const usable = available.filter(q => electionAnswers?.[q.id] != null);
  const themesRepresented = [...new Set(usable.map(q => q.theme).filter(Boolean))];

  const contract = resolveDirectElectionContract({
    compared: usable.length,
    available: available.length,
    questionnaireSize: questions.length,
    themes: themesRepresented.length,
  });

  const coverage = {
    positionsCompared:  usable.length,
    positionsAvailable: available.length,
    questionnaireSize:  questions.length,
    answeredByUser:     questions.filter(q => electionAnswers?.[q.id] != null).length,
    themesRepresented:  themesRepresented.length,
    themes:             themesRepresented,
  };

  if (!contract.satisfied) {
    return { score: null, reason: contract.reason, coverage, contract, usable: [], byQuestion };
  }

  // stance -2…+2 → échelle Likert 1–5, la même que les réponses de l'utilisateur.
  const likert = p => p.stance + 3;
  // L'importance électorale déclarée pondère les questions, sans jamais en écarter une :
  // un poids absent vaut 1. Une pondération qui pourrait annuler une question ferait varier
  // le dénominateur affiché sans que rien ne le montre.
  const poids = q => {
    const w = electoralWeights?.[q.id];
    return Number.isFinite(w) && w > 0 ? w : 1;
  };

  let sommePonderee = 0;
  let sommePoids = 0;
  for (const q of usable) {
    const w = poids(q);
    sommePonderee += w * (Math.abs(electionAnswers[q.id] - likert(byQuestion.get(q.id))) / 4);
    sommePoids += w;
  }
  const meanDist = sommePonderee / sommePoids;

  const raw = Math.pow(1 - meanDist, MATCH_CONFIG.electionDistanceExponent) * 100;
  return {
    score: Math.max(0, Math.min(100, Math.round(raw))),
    reason: null,
    coverage,
    contract,
    usable,
    byQuestion,
  };
}

/**
 * Point d'entrée unique. Toutes les surfaces doivent passer par ici.
 *
 * @param {Object}   p
 * @param {Object}   p.userThemes         scores 0–100 (ou null par thème en scoring v2)
 * @param {Object}   p.candidate          { id, name } — `profile` legacy est IGNORÉ
 * @param {Array}    [p.priorityOrder]
 * @param {Object}   [p.themeWeights]     allocation 100 points ; prioritaire sur priorityOrder
 * @param {Object}   [p.electionAnswers]  { [questionId]: 1–5 }
 * @param {Array}    [p.questions]        specificQuestions de l'élection
 * @param {Array}    [p.approvedPositions] injection pour les tests ; sinon lues du registre
 * @param {Function} [p.sourceIsVerified] injection pour les tests ; sinon `verifiedAt` du document
 * @param {string}   [p.asOf]             date de référence pour les revirements
 * @param {string}   [p.language]
 * @returns {MatchResult}
 */
export function computeCandidateMatch({
  userThemes,
  candidate,
  priorityOrder,
  themeWeights,
  electionAnswers = {},
  questions = [],
  approvedPositions = null,
  sourceIsVerified = null,
  asOf = null,
  language = 'fr',
  /**
   * LECTURE demandée — `'general'` ou `'election'`. Les DEUX sont toujours calculées et
   * rendues sous `general` et `election` ; ce paramètre ne choisit que celle qui est reflétée
   * au premier niveau (`score`, `reason`, `coverage`, `contract`), pour le classement.
   *
   * ⚠ IL N'Y A PLUS DE SCORE MÉLANGÉ. Le champ `score` valait auparavant
   * `0,65 × général + 0,35 × électoral`, calculés sur les mêmes positions : les mêmes preuves
   * comptaient deux fois. Aucun troisième indice combiné n'a été conservé.
   */
  reading = MATCH_READING.GENERAL,
  /** Importance déclarée par question, propre au scrutin. Ne concerne QUE la lecture électorale. */
  electoralWeights = null,
}) {
  const weightMap = buildWeightMap(priorityOrder, themeWeights);

  // ── Profil candidat DÉRIVÉ des positions approuvées ──────────────────────
  // `candidate.profile` n'est jamais lu ici. C'est le cœur du correctif : les huit nombres
  // `legacy-manual-v1` ne peuvent plus produire de classement public.
  const canonicalId = resolveCandidateId(candidate?.id);
  const positions = approvedPositions ?? (canonicalId ? getPositions(canonicalId) : []);
  const verify = sourceIsVerified ?? (id => Boolean(getSource(id)?.verifiedAt));

  const derived = deriveCandidateThemes(positions, questions, { sourceIsVerified: verify, asOf });

  const versions = {
    matching: MATCHING_VERSION,
    candidateData: CANDIDATE_DATA_RELEASE,
    candidateProfile: derived.version,
  };

  const answeredSpecific = questions.filter(q => electionAnswers?.[q.id] != null).length;

  const baseCoverage = {
    themesKnown: derived.coverage.themesKnown,
    themesTotal: derived.coverage.themesTotal,
    sourcedPositions: derived.coverage.sourcedPositions,
    perTheme: derived.coverage.perTheme,
    positionsTotal: questions.length,
    answeredSpecific,
    positionProvenance: 'sourced-positions',
  };

  // ── LECTURE 1 : proximité GÉNÉRALE ────────────────────────────────────────
  // « De manière générale, quel candidat possède les idées les plus proches des miennes ? »
  // Compare deux profils sur les huit thèmes. Son contrat est le contrat GÉNÉRAL, toujours :
  // le rabaisser parce que le seul corpus disponible est un questionnaire de scrutin
  // reviendrait à faire passer une lecture étroite pour une ressemblance d'ensemble.
  // ⚠ Elle ne lit JAMAIS `electionAnswers`.
  const generalContract = resolveGeneralContract();
  const g = derived.usable.length === 0
    ? { score: null, reason: 'no_sourced_positions', themesKnown: 0 }
    : globalProximity(userThemes, derived.themes, weightMap, generalContract);

  const general = {
    score: g.score ?? null,
    reason: g.score == null ? (g.reason ?? 'insufficient_coverage') : null,
    contract: generalContract,
    vetoTriggered: g.vetoTriggered ?? [],
    coverage: {
      themesKnown: derived.coverage.themesKnown,
      themesTotal: derived.coverage.themesTotal,
      sourcedPositions: derived.coverage.sourcedPositions,
      perTheme: derived.coverage.perTheme,
      positionProvenance: 'sourced-positions',
    },
  };

  // ── LECTURE 2 : proximité ÉLECTORALE DIRECTE ──────────────────────────────
  // « Sur les questions propres à cette élection auxquelles j'ai répondu, de quel candidat
  // suis-je le plus proche ? » Comparaison question par question, sur l'intersection réelle.
  // ⚠ Elle ne lit ni `userThemes`, ni le veto, ni le contrat général : un candidat peut être
  // comparable ici sans l'être là, et c'est le résultat attendu, pas une anomalie.
  const e = questions.length
    ? electionProximity(electionAnswers, questions, derived.usable, electoralWeights)
    : {
      score: null, reason: 'no_election_questionnaire', usable: [], byQuestion: new Map(),
      contract: null,
      coverage: {
        positionsCompared: 0, positionsAvailable: 0, questionnaireSize: 0,
        answeredByUser: 0, themesRepresented: 0, themes: [],
      },
    };

  const election = {
    score: e.score,
    reason: e.reason ?? null,
    contract: e.contract,
    coverage: { ...e.coverage, positionProvenance: 'sourced-positions' },
  };

  // ── La lecture reflétée au premier niveau ─────────────────────────────────
  const choisie = reading === MATCH_READING.ELECTION ? election : general;

  // `coverage` de premier niveau : conservé pour les surfaces existantes, complété par les
  // deux couvertures détaillées. Aucun champ n'est retiré, aucun n'est deviné.
  const coverage = {
    ...baseCoverage,
    positionsUsed: election.coverage.positionsCompared,
    positionsAvailable: election.coverage.positionsAvailable,
    themesRepresented: election.coverage.themesRepresented,
    specificIgnored: answeredSpecific > 0 && election.coverage.positionsCompared === 0,
  };

  return {
    // Deux résultats INDÉPENDANTS, jamais mélangés.
    general,
    election,
    reading,

    score: choisie.score,
    reason: choisie.score == null ? (choisie.reason ?? 'insufficient_coverage') : null,
    contract: choisie.contract,
    coverage,
    vetoTriggered: general.vetoTriggered,

    // ⚠ `globalScore` / `electionScore` restent exposés à l'identique pour les surfaces
    // existantes, mais ne sont plus mélangés nulle part.
    globalScore: general.score,
    electionScore: election.score,

    ...(e.usable.length
      ? breakdown(e.usable, electionAnswers, e.byQuestion, derived.themes, userThemes, language)
      : { agreements: [], disagreements: [], breakdownSource: 'none' }),

    // Profil thématique DÉRIVÉ des seules positions approuvées. Exposé pour que les surfaces
    // d'affichage (ventilation par thème) cessent de lire `candidate.profile`, qui est
    // `legacy-manual-v1` : huit nombres saisis à la main, sans preuve par position.
    // Un thème sans assez de positions sourcées vaut `null` — à afficher comme inconnu,
    // jamais à remplacer par 50.
    derivedThemes: derived.themes,
    versions,
  };
}

/**
 * Classe une liste de candidats et signale les ex æquo.
 * Ne présente pas un ordre catégorique quand l'écart est sous le seuil versionné.
 */
export function rankCandidates(params, candidates) {
  // ⚠ Le classement porte sur UNE lecture, choisie par l'appelant. Classer sur un mélange
  // des deux revenait à ordonner selon un nombre qu'aucune question ne définit.
  const all = candidates.map(candidate => ({
    candidate,
    match: computeCandidateMatch({ ...params, candidate }),
  }));

  const results = all
    .filter(r => r.match.score != null)
    .sort((a, b) => b.match.score - a.match.score);

  // Les candidats sans score ne sont pas silencieusement absents : l'appelant reçoit la
  // liste et le motif, pour pouvoir le dire à l'utilisateur.
  const unscored = all.filter(r => r.match.score == null);

  const tooClose = results.length >= 2
    && (results[0].match.score - results[1].match.score) < MATCH_CONFIG.tieThreshold;

  return { results, unscored, tooClose };
}

/**
 * Accords et désaccords, calculés UNIQUEMENT sur des positions approuvées.
 *
 * Le repli « thèmes » de la version précédente comparait le profil legacy du candidat au
 * profil de l'utilisateur : il produisait des affirmations du type « proches sur l'économie »
 * sans qu'aucune position n'ait été relue. Supprimé.
 */
function breakdown(usable, electionAnswers, byQuestion, derivedThemes, userThemes, language) {
  if (!usable?.length) {
    return { agreements: [], disagreements: [], breakdownSource: 'none' };
  }
  const likert = p => p.stance + 3;
  const scored = usable
    .map(q => ({
      q,
      distance: Math.abs(electionAnswers[q.id] - likert(byQuestion.get(q.id))),
      position: byQuestion.get(q.id),
    }))
    .sort((a, b) => a.distance - b.distance);

  return {
    agreements: scored.filter(x => x.distance <= 1).slice(0, 3),
    disagreements: scored.filter(x => x.distance >= 2).slice(-3).reverse(),
    breakdownSource: 'sourced-positions',
  };
}

/** Libellés de thèmes — conservés pour les surfaces qui affichent la couverture par thème. */
export function themeLabel(theme, language = 'fr') {
  return (THEME_LABELS[language] ?? THEME_LABELS.en)[theme] ?? theme;
}
