// POLISCOP — Export et import des priorités électorales.
//
// DÉFAUT REPRODUIT : `exportProfile()` ne connaissait ni `themeImportance` ni `voteInfluence`.
// Un export perdait donc TOUTES les décisions de priorité — huit évaluations de thèmes et
// chaque influence déclarée — sans le moindre message. Réimporter son propre fichier revenait
// à repartir de zéro sur ces données.

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { buildPriorityExport, parsePriorityImport } from '../../src/engine/priorityTransfer.js';
import {
  IMPORTANCE_LEVEL, VOTE_INFLUENCE_LEVEL, PRIORITY_SOURCE, PRIORITY_CONTRACT_VERSION,
  isExplicitlyAnswered, answeredThemeCount, themeMultiplier, voteInfluenceMultiplier,
  normalizeThemeImportance,
} from '../../src/engine/priorityWeights.js';
import { THEMES_ORDER, questions } from '../../src/data/questions.js';

const KNOWN = new Set(questions.map(q => q.id));
const roundTrip = (state) => parsePriorityImport(buildPriorityExport(state), { knownQuestionIds: KNOWN });

const richState = () => ({
  themeImportance: {
    levels: {
      ...Object.fromEntries(THEMES_ORDER.map(t => [t, null])),
      [THEMES_ORDER[0]]: IMPORTANCE_LEVEL.VERY_HIGH,
      [THEMES_ORDER[1]]: IMPORTANCE_LEVEL.MEDIUM,
      [THEMES_ORDER[2]]: IMPORTANCE_LEVEL.NOT,
    },
    answered: {
      ...Object.fromEntries(THEMES_ORDER.map(t => [t, false])),
      [THEMES_ORDER[0]]: true, [THEMES_ORDER[1]]: true, [THEMES_ORDER[2]]: true,
    },
    source: PRIORITY_SOURCE.INDEPENDENT,
    updatedAt: '2026-08-11T09:00:00.000Z',
  },
  voteInfluence: {
    ENV_26: { level: VOTE_INFLUENCE_LEVEL.NONE, multiplier: 0, askedAt: '2026-08-11T09:00:00.000Z', answeredAt: '2026-08-11T09:01:00.000Z' },
    SOC_28: { level: null, declined: true, askedAt: '2026-08-11T09:02:00.000Z', answeredAt: '2026-08-11T09:03:00.000Z' },
    DEM_26: { level: VOTE_INFLUENCE_LEVEL.STRONG, multiplier: 1.5, askedAt: null, answeredAt: null },
  },
});

// ─── 1. Aller-retour moderne complet ────────────────────────────────────────

test('aller-retour complet : rien n’est perdu', () => {
  const out = roundTrip(richState());
  assert.equal(answeredThemeCount(out.themeImportance), 3);
  assert.equal(out.themeImportance.levels[THEMES_ORDER[0]], IMPORTANCE_LEVEL.VERY_HIGH);
  assert.equal(out.themeImportance.source, PRIORITY_SOURCE.INDEPENDENT);
  assert.equal(Object.keys(out.voteInfluence).length, 3);
});

test('l’export porte les deux versions de contrat', () => {
  const payload = buildPriorityExport(richState());
  assert.equal(payload.priorityContractVersion, PRIORITY_CONTRACT_VERSION);
  assert.ok(payload.electoralMatchVersion, 'version du matching pondéré absente');
});

// ─── 5–6. Influence nulle et refus survivent ────────────────────────────────

test('une influence « pas du tout » survit à l’aller-retour', () => {
  const out = roundTrip(richState());
  assert.equal(out.voteInfluence.ENV_26.level, VOTE_INFLUENCE_LEVEL.NONE);
  assert.equal(voteInfluenceMultiplier(out.voteInfluence, 'ENV_26'), 0,
    '« pas du tout » doit rester 0, pas retomber sur le neutre');
});

test('un refus de répondre reste distinct d’une influence nulle', () => {
  const out = roundTrip(richState());
  assert.equal(out.voteInfluence.SOC_28.declined, true);
  assert.equal(out.voteInfluence.SOC_28.level, null);
  assert.equal(voteInfluenceMultiplier(out.voteInfluence, 'SOC_28'), 1,
    'un refus laisse le multiplicateur NEUTRE, il ne vaut pas zéro');
});

// ─── 7–8. Moyen explicite contre non renseigné ──────────────────────────────

test('« moyennement important » explicite ne devient pas un thème non renseigné', () => {
  const out = roundTrip(richState());
  assert.equal(isExplicitlyAnswered(out.themeImportance, THEMES_ORDER[1]), true);
  assert.equal(out.themeImportance.levels[THEMES_ORDER[1]], IMPORTANCE_LEVEL.MEDIUM);
});

test('un thème non renseigné le reste, avec un multiplicateur neutre', () => {
  const out = roundTrip(richState());
  const t = THEMES_ORDER[5];
  assert.equal(isExplicitlyAnswered(out.themeImportance, t), false);
  assert.equal(themeMultiplier(out.themeImportance, t), 1);
});

test('un niveau valide sans marqueur de choix n’invente pas une décision', () => {
  const out = parsePriorityImport({
    themeImportance: { levels: { [THEMES_ORDER[0]]: IMPORTANCE_LEVEL.HIGH }, answered: {}, source: PRIORITY_SOURCE.INDEPENDENT },
  }, { knownQuestionIds: KNOWN });
  assert.equal(isExplicitlyAnswered(out.themeImportance, THEMES_ORDER[0]), false);
});

// ─── 2–4. Anciens exports et données invalides ──────────────────────────────

test('un ancien export sans priorités donne un état neutre, pas une erreur', () => {
  const out = parsePriorityImport({ answers: { ECO_1: 4 } }, { knownQuestionIds: KNOWN });
  assert.equal(answeredThemeCount(out.themeImportance), 0);
  assert.deepEqual(out.voteInfluence, {});
  for (const t of THEMES_ORDER) assert.equal(themeMultiplier(out.themeImportance, t), 1);
});

test('un niveau invalide est écarté, le reste est conservé', () => {
  const out = parsePriorityImport({
    themeImportance: {
      levels: { [THEMES_ORDER[0]]: 'catastrophique', [THEMES_ORDER[1]]: IMPORTANCE_LEVEL.HIGH },
      answered: { [THEMES_ORDER[0]]: true, [THEMES_ORDER[1]]: true },
      source: PRIORITY_SOURCE.INDEPENDENT,
    },
  }, { knownQuestionIds: KNOWN });
  assert.equal(isExplicitlyAnswered(out.themeImportance, THEMES_ORDER[0]), false);
  assert.equal(isExplicitlyAnswered(out.themeImportance, THEMES_ORDER[1]), true);
  assert.ok(out.dropped.levels.length > 0, 'le rejet doit être signalé');
});

test('un thème inconnu est écarté', () => {
  const out = parsePriorityImport({
    themeImportance: { levels: { THEME_MARTIEN: IMPORTANCE_LEVEL.HIGH }, answered: { THEME_MARTIEN: true } },
  }, { knownQuestionIds: KNOWN });
  assert.ok(out.dropped.themes.includes('THEME_MARTIEN'));
  assert.equal(answeredThemeCount(out.themeImportance), 0);
});

test('une influence sur une question inconnue est retirée', () => {
  const out = parsePriorityImport({
    voteInfluence: {
      QUESTION_DISPARUE: { level: VOTE_INFLUENCE_LEVEL.STRONG },
      ENV_26: { level: VOTE_INFLUENCE_LEVEL.LIKELY },
    },
  }, { knownQuestionIds: KNOWN });
  assert.ok(out.dropped.questions.includes('QUESTION_DISPARUE'));
  assert.ok(!('QUESTION_DISPARUE' in out.voteInfluence));
  assert.equal(out.voteInfluence.ENV_26.level, VOTE_INFLUENCE_LEVEL.LIKELY);
});

test('une date invalide est neutralisée sans perdre la décision', () => {
  const out = parsePriorityImport({
    voteInfluence: { ENV_26: { level: VOTE_INFLUENCE_LEVEL.NONE, answeredAt: 'hier matin' } },
  }, { knownQuestionIds: KNOWN });
  assert.equal(out.voteInfluence.ENV_26.level, VOTE_INFLUENCE_LEVEL.NONE);
  assert.equal(out.voteInfluence.ENV_26.answeredAt, null);
});

test('une entrée d’influence sans aucune décision est écartée', () => {
  const out = parsePriorityImport({
    voteInfluence: { ENV_26: { level: 'inconnu', declined: false } },
  }, { knownQuestionIds: KNOWN });
  assert.ok(!('ENV_26' in out.voteInfluence));
  assert.ok(out.dropped.influences.includes('ENV_26'));
});

// ─── 9. Aucune fuite de l'état précédent ────────────────────────────────────

test('importer dans un état déjà rempli ne laisse rien fuir de l’ancien', () => {
  // Le résultat de l'import ne dépend QUE du fichier : il énumère toujours les huit thèmes,
  // ce qui permet à l'appelant de remplacer l'état sans conserver de résidu.
  const out = parsePriorityImport({
    themeImportance: {
      levels: { [THEMES_ORDER[7]]: IMPORTANCE_LEVEL.LOW },
      answered: { [THEMES_ORDER[7]]: true },
      source: PRIORITY_SOURCE.INDEPENDENT,
    },
    voteInfluence: { DEM_26: { level: VOTE_INFLUENCE_LEVEL.LIKELY } },
  }, { knownQuestionIds: KNOWN });

  assert.equal(answeredThemeCount(out.themeImportance), 1);
  for (const t of THEMES_ORDER.slice(0, 7)) {
    assert.equal(out.themeImportance.levels[t], null, `${t} porte une valeur absente du fichier`);
  }
  assert.deepEqual(Object.keys(out.voteInfluence), ['DEM_26']);
});

test('la normalisation ultérieure ne dégrade pas un import valide', () => {
  const out = roundTrip(richState());
  const renormalized = normalizeThemeImportance({ themeImportance: out.themeImportance });
  assert.equal(answeredThemeCount(renormalized), 3);
  assert.equal(renormalized.source, PRIORITY_SOURCE.INDEPENDENT);
});
