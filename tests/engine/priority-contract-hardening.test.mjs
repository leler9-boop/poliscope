// POLISCOP — Durcissement du contrat de priorités (lot P0+P1).
//
// QUATRE DÉFAUTS REPRODUITS AVANT CORRECTION
// ------------------------------------------
// A. « Aucun choix » était indiscernable de « Moyennement important ». L'écran initialisait
//    les huit thèmes à MEDIUM ; quelqu'un qui ne touchait à rien produisait exactement l'état
//    de quelqu'un ayant cliqué huit fois. La donnée récoltée ne disait plus rien.
//
// C. Le plafond « une question ne pèse jamais plus de deux questions normales » était vérifié
//    sur la fonction INTERMÉDIAIRE, puis annulé par la redistribution par thème. Mesuré sur
//    les poids réellement utilisés dans le score : une question isolée dans un thème très
//    important captait 0,333 de la masse là où le plafond promettait 0,125 — soit 2,7 fois
//    trop. La promesse produit était fausse.
//
// D. Les entrées invalides étaient partiellement appliquées. `importanceFromRanking()`
//    acceptait n'importe quelle liste de longueur 8, doublons compris : un classement
//    ['ECONOMY', 'ECONOMY', …] produisait des poids silencieusement faux.
//
// (Le défaut B est un libellé public : il est couvert par tests/ui.)

import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  IMPORTANCE_LEVEL, PRIORITY_SOURCE, VOTE_INFLUENCE_LEVEL,
  MAX_EFFECTIVE_WEIGHT_RATIO,
  equalImportance, importanceFromRanking, normalizeThemeImportance,
  themeMultiplier, voteInfluenceMultiplier, isExplicitlyAnswered, answeredThemeCount,
  computeEffectiveQuestionWeight, balanceWeightsAcrossThemes, capQuestionShares,
} from '../../src/engine/priorityWeights.js';
import { THEMES_ORDER } from '../../src/data/questions.js';

// ─── A. Absence de choix ≠ « Moyennement important » ────────────────────────

test('un thème jamais touché n’est pas enregistré comme un choix explicite', () => {
  const vierge = normalizeThemeImportance({});
  for (const theme of THEMES_ORDER) {
    assert.equal(isExplicitlyAnswered(vierge, theme), false,
      `${theme} est compté comme choisi alors que personne n’y a touché`);
  }
  assert.equal(answeredThemeCount(vierge), 0);
});

test('un thème mis explicitement à « moyennement important » est bien un choix', () => {
  const state = normalizeThemeImportance({
    themeImportance: {
      levels: { [THEMES_ORDER[0]]: IMPORTANCE_LEVEL.MEDIUM },
      answered: { [THEMES_ORDER[0]]: true },
      source: PRIORITY_SOURCE.INDEPENDENT,
    },
  });
  assert.equal(isExplicitlyAnswered(state, THEMES_ORDER[0]), true);
  assert.equal(answeredThemeCount(state), 1);
  // Les autres restent non renseignés.
  assert.equal(isExplicitlyAnswered(state, THEMES_ORDER[1]), false);
});

test('les deux états produisent le MÊME multiplicateur mais restent distinguables', () => {
  const vierge = normalizeThemeImportance({});
  const choisi = normalizeThemeImportance({
    themeImportance: {
      levels: Object.fromEntries(THEMES_ORDER.map(t => [t, IMPORTANCE_LEVEL.MEDIUM])),
      answered: Object.fromEntries(THEMES_ORDER.map(t => [t, true])),
      source: PRIORITY_SOURCE.INDEPENDENT,
    },
  });
  // Même effet sur le calcul — un non-choix vaut neutre, il ne pénalise pas.
  assert.equal(themeMultiplier(vierge, THEMES_ORDER[0]), themeMultiplier(choisi, THEMES_ORDER[0]));
  // Mais la donnée récoltée n'est pas la même.
  assert.notEqual(answeredThemeCount(vierge), answeredThemeCount(choisi));
});

test('« tous les sujets comptent autant » est une décision explicite, pas un défaut', () => {
  const eq = equalImportance();
  assert.equal(eq.source, PRIORITY_SOURCE.EQUAL);
  assert.equal(answeredThemeCount(eq), THEMES_ORDER.length,
    'le raccourci doit valoir décision sur les huit thèmes');
});

test('la source « évaluations indépendantes » n’est pas enregistrée sans aucune évaluation', () => {
  const rien = normalizeThemeImportance({
    themeImportance: { levels: {}, answered: {}, source: PRIORITY_SOURCE.INDEPENDENT },
  });
  assert.notEqual(rien.source, PRIORITY_SOURCE.INDEPENDENT,
    'prétendre que la personne a évalué les thèmes alors qu’elle n’a rien touché');
});

// ─── C. Le plafond doit porter sur les poids FINAUX ─────────────────────────

/** Part d'une question dans le score, une fois toutes les étapes appliquées. */
function finalShares(entries) {
  const balanced = balanceWeightsAcrossThemes(entries);
  const capped = capQuestionShares(balanced, { maxRatio: MAX_EFFECTIVE_WEIGHT_RATIO });
  const total = capped.reduce((s, e) => s + e.weight, 0);
  return capped.map(e => ({ ...e, share: total > 0 ? e.weight / total : 0 }));
}

test('une question isolée dans un thème très important ne dépasse pas le plafond FINAL', () => {
  // Quatre thèmes. Le thème A ne contient qu'une question, très pondérée, très influente,
  // dans un thème déclaré « très important ». Les trois autres ont cinq questions normales.
  const entries = [{
    id: 'iso', theme: 'A', themeFactor: 1.5,
    ownWeight: computeEffectiveQuestionWeight({ influenceFactor: 1.5, editorialWeight: 10, baselineWeight: 2 }),
  }];
  for (const t of ['B', 'C', 'D']) {
    for (let i = 0; i < 5; i++) entries.push({ id: `${t}${i}`, theme: t, ownWeight: 2, themeFactor: 1 });
  }

  const shares = finalShares(entries);
  const positives = shares.filter(e => e.weight > 0);
  const maxShare = MAX_EFFECTIVE_WEIGHT_RATIO / positives.length;
  const iso = shares.find(e => e.id === 'iso');

  assert.ok(
    iso.share <= maxShare + 1e-9,
    `la question isolée capte ${iso.share.toFixed(4)} de la masse pour un plafond de ${maxShare.toFixed(4)}`,
  );
});

test('le surplus retiré à une question plafonnée ne lui est pas réinjecté', () => {
  const entries = [
    { id: 'gros', theme: 'A', ownWeight: 100, themeFactor: 1.5 },
    ...Array.from({ length: 9 }, (_, i) => ({ id: `n${i}`, theme: 'B', ownWeight: 2, themeFactor: 1 })),
  ];
  const shares = finalShares(entries);
  const maxShare = MAX_EFFECTIVE_WEIGHT_RATIO / shares.filter(e => e.weight > 0).length;
  assert.ok(shares.find(e => e.id === 'gros').share <= maxShare + 1e-9);
  const total = shares.reduce((s, e) => s + e.share, 0);
  assert.ok(Math.abs(total - 1) < 1e-9, `les parts doivent sommer à 1, obtenu ${total}`);
});

test('le plafonnement conserve des poids finis et positifs', () => {
  const entries = [
    { id: 'a', theme: 'A', ownWeight: 2, themeFactor: 1 },
    { id: 'b', theme: 'A', ownWeight: 0, themeFactor: 1 },
    { id: 'c', theme: 'B', ownWeight: 2, themeFactor: 0 },
  ];
  for (const e of finalShares(entries)) {
    assert.ok(Number.isFinite(e.weight) && e.weight >= 0, `poids invalide : ${e.weight}`);
    assert.ok(Number.isFinite(e.share) && e.share >= 0);
  }
});

test('le plafonnement n’écrase pas une répartition déjà conforme', () => {
  const entries = Array.from({ length: 8 }, (_, i) => ({
    id: `q${i}`, theme: i < 4 ? 'A' : 'B', ownWeight: 2, themeFactor: 1,
  }));
  const shares = finalShares(entries);
  for (const e of shares) assert.ok(Math.abs(e.share - 1 / 8) < 1e-9);
});

// ─── D. Données invalides ───────────────────────────────────────────────────

test('un classement avec doublons est refusé, pas appliqué à moitié', () => {
  const doublons = [THEMES_ORDER[0], THEMES_ORDER[0], ...THEMES_ORDER.slice(2)];
  assert.equal(doublons.length, THEMES_ORDER.length, 'le fixture doit avoir la bonne longueur');
  const out = importanceFromRanking(doublons);
  // État neutre EXPLICITE : `source: null` et aucun thème marqué comme répondu. Retomber sur
  // `equal_default` enregistrerait une décision « tout compte autant » que personne n'a prise.
  assert.equal(out.source, null, 'un classement invalide doit retomber sur un état neutre EXPLICITE');
  assert.equal(answeredThemeCount(out), 0, 'aucun choix ne doit être inventé depuis une entrée invalide');
  for (const t of THEMES_ORDER) assert.equal(out.levels[t], null);
});

test('un classement incomplet ou étranger aux huit thèmes est refusé', () => {
  for (const bad of [
    THEMES_ORDER.slice(0, 5),
    [...THEMES_ORDER.slice(0, 7), 'THEME_INCONNU'],
    ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
    null, undefined, 'ECONOMY', 42, {},
  ]) {
    const out = importanceFromRanking(bad);
    assert.equal(out.source, null, `entrée acceptée à tort : ${JSON.stringify(bad)}`);
    assert.equal(answeredThemeCount(out), 0);
    for (const t of THEMES_ORDER) assert.ok(out.levels[t] !== undefined);
  }
});

test('un niveau d’importance inconnu retombe sur le neutre, sans planter', () => {
  const state = normalizeThemeImportance({
    themeImportance: {
      levels: { ...Object.fromEntries(THEMES_ORDER.map(t => [t, IMPORTANCE_LEVEL.MEDIUM])), [THEMES_ORDER[0]]: 'catastrophique' },
      answered: Object.fromEntries(THEMES_ORDER.map(t => [t, true])),
      source: PRIORITY_SOURCE.INDEPENDENT,
    },
  });
  assert.equal(themeMultiplier(state, THEMES_ORDER[0]), 1);
  assert.equal(isExplicitlyAnswered(state, THEMES_ORDER[0]), false,
    'un niveau illisible ne peut pas compter comme une réponse valide');
});

test('un niveau d’influence inconnu ou non fini retombe sur le neutre', () => {
  for (const bad of ['jamais_de_la_vie', 42, null, undefined, {}, NaN]) {
    const m = voteInfluenceMultiplier({ Q1: { level: bad } }, 'Q1');
    assert.ok(Number.isFinite(m) && m >= 0, `multiplicateur invalide : ${m}`);
    assert.equal(m, 1, `un niveau illisible doit valoir neutre, obtenu ${m}`);
  }
});

test('un thème inconnu ne casse pas la lecture du multiplicateur', () => {
  const state = equalImportance();
  assert.ok(Number.isFinite(themeMultiplier(state, 'THEME_QUI_NEXISTE_PAS')));
});

test('un état importé partiellement corrompu est ramené à un neutre explicite', () => {
  for (const bad of [
    { themeImportance: { levels: 'oui' } },
    { themeImportance: { levels: null, answered: null } },
    { themeImportance: 42 },
    { priorityOrder: 'ECONOMY,SOCIAL' },
  ]) {
    const out = normalizeThemeImportance(bad);
    assert.ok(out.levels && typeof out.levels === 'object');
    for (const t of THEMES_ORDER) assert.ok(Number.isFinite(themeMultiplier(out, t)));
  }
});

test('une influence explicitement nulle survit à la normalisation', () => {
  const m = voteInfluenceMultiplier({ Q1: { level: VOTE_INFLUENCE_LEVEL.NONE } }, 'Q1');
  assert.equal(m, 0, '« pas du tout » doit rester 0, pas retomber sur le neutre');
});
