// POLISCOP — Question Bank
// Source: questions_final.json. The live bank is deliberately capped at 16 items
// per theme; legacy and retired items remain in the JSON for traceability.

import rawQuestions from './questions_final.json';
import { createRng, seededShuffle } from '../engine/rng.js';

// ─── Themes ──────────────────────────────────────────────────────────────────

export const THEMES = {
  ECONOMY:         `ECONOMY`,
  SOCIAL:          `SOCIAL`,
  IMMIGRATION:     `IMMIGRATION`,
  SECURITY:        `SECURITY`,
  ENVIRONMENT:     `ENVIRONMENT`,
  DEMOCRACY:       `DEMOCRACY`,
  GLOBAL:          `GLOBAL`,
  PUBLIC_SERVICES: `PUBLIC_SERVICES`,
};

export const THEMES_ORDER = [
  THEMES.ECONOMY,
  THEMES.SOCIAL,
  THEMES.IMMIGRATION,
  THEMES.SECURITY,
  THEMES.ENVIRONMENT,
  THEMES.DEMOCRACY,
  THEMES.GLOBAL,
  THEMES.PUBLIC_SERVICES,
];

export const THEME_LABELS = {
  en: {
    ECONOMY:         `Economy`,
    SOCIAL:          `Social issues`,
    IMMIGRATION:     `Immigration`,
    SECURITY:        `Security`,
    ENVIRONMENT:     `Environment`,
    DEMOCRACY:       `Democracy`,
    GLOBAL:          `Globalization`,
    PUBLIC_SERVICES: `Public services`,
  },
  fr: {
    ECONOMY:         `Économie`,
    SOCIAL:          `Questions sociales`,
    IMMIGRATION:     `Immigration`,
    SECURITY:        `Sécurité`,
    ENVIRONMENT:     `Environnement`,
    DEMOCRACY:       `Démocratie`,
    GLOBAL:          `Mondialisation`,
    PUBLIC_SERVICES: `Services publics`,
  },
};

export const THEME_COLORS = {
  ECONOMY:         `#f59e0b`,
  SOCIAL:          `#8b5cf6`,
  IMMIGRATION:     `#ef4444`,
  SECURITY:        `#6b7280`,
  ENVIRONMENT:     `#10b981`,
  DEMOCRACY:       `#3b82f6`,
  GLOBAL:          `#06b6d4`,
  PUBLIC_SERVICES: `#f97316`,
};

// ─── Mapping helpers ─────────────────────────────────────────────────────────

const PREFIX_TO_THEME = {
  ECO: THEMES.ECONOMY,
  SOC: THEMES.SOCIAL,
  IMM: THEMES.IMMIGRATION,
  SEC: THEMES.SECURITY,
  ENV: THEMES.ENVIRONMENT,
  DEM: THEMES.DEMOCRACY,
  GLO: THEMES.GLOBAL,
  PUB: THEMES.PUBLIC_SERVICES,
};

// Direction preserved from original scoring logic (1 = agree shifts score up, -1 = down)
const DIRECTION_MAP = {
  ECO_1: -1, ECO_2: -1, ECO_3:  1, ECO_4: -1, ECO_5:  1, ECO_6: -1, ECO_7:  1, ECO_8: -1,
  ECO_9: -1, ECO_10:-1, ECO_11: 1, ECO_12:-1, ECO_13:-1, ECO_14:-1, ECO_15: 1, // ECO_13 flipped: reworded from a double negation to a positive framing, meaning of agreement is unchanged
  ECO_16:-1, ECO_17: 1, ECO_18:-1, ECO_19:-1, ECO_20:-1, ECO_21:-1, ECO_22:-1, ECO_23: 1,

  SOC_1:  1, SOC_2:  1, SOC_3:  1, SOC_4:  1, SOC_5: -1, SOC_6:  1, SOC_7: -1, SOC_8:  1,
  SOC_9:  1, SOC_10: 1, SOC_11: 1, SOC_12: 1, SOC_13: 1, SOC_14:-1, SOC_15: 1,
  SOC_16: 1, SOC_17: 1, SOC_18: 1, SOC_19:-1, SOC_20: 1, SOC_21: 1, SOC_22: 1, SOC_23: 1,

  IMM_1:  1, IMM_2: -1, IMM_3: -1, IMM_4:  1, IMM_5:  1, IMM_6:  1, IMM_7: -1,
  IMM_8: -1, IMM_9: -1, IMM_10:-1, IMM_11:-1, IMM_12: 1, IMM_13: 1, IMM_14: 1, IMM_15: 1,
  IMM_16: 1, IMM_17:-1, IMM_18:-1, IMM_19: 1, IMM_20: 1, IMM_21:-1, IMM_22: 1,

  SEC_1: -1, SEC_2:  1, SEC_3:  1, SEC_4: -1, SEC_5:  1, SEC_6: -1, SEC_7:  1,
  SEC_8: -1, SEC_9: -1, SEC_10: 1, SEC_11: 1, SEC_12: 1, SEC_13:-1, SEC_14:-1, SEC_15: 1,
  SEC_16: 1, SEC_17:-1, SEC_18: 1, SEC_19: 1, SEC_20: 1, SEC_21:-1, SEC_22: 1,

  ENV_1:  1, ENV_2:  1, ENV_3:  1, ENV_4:  1, ENV_5:  1, ENV_6:  1, ENV_7:  1,
  ENV_8:  1, ENV_9:  1, ENV_10: 1, ENV_11:-1, ENV_12: 1, ENV_13: 1, ENV_14: 1, ENV_15: 1,
  ENV_16: 1, ENV_17: 1, ENV_18: 1, ENV_19: 1, ENV_20: 1, ENV_21: 1, ENV_22: 1, ENV_23: 1,

  DEM_1:  1, DEM_2:  1, DEM_3:  1, DEM_4:  1, DEM_5:  1, DEM_6:  1, DEM_7:  1,
  DEM_8:  1, DEM_9:  1, DEM_10: 1, DEM_11: 1, DEM_12: 1, DEM_13: 1, DEM_14: 1, DEM_15: 1,
  DEM_16: 1, DEM_17: 1, DEM_18: 1, DEM_19: 1, DEM_20:-1, DEM_21:-1, DEM_22: 1, DEM_23: 1,

  // GLO: HIGH = pro-mondialisation/pro-UE (direction inversée par rapport à v1)
  GLO_1: -1, GLO_2: -1, GLO_3:  1, GLO_4:  1, GLO_5: -1, GLO_6: -1, GLO_7:  1,
  GLO_8:  1, GLO_9: -1, GLO_10: 1, GLO_11:-1, GLO_12: 1, GLO_13: 1, GLO_14:-1, GLO_15: 1,
  GLO_16:-1, GLO_17:-1, GLO_18: 1, GLO_19: 1, GLO_20: 1, GLO_21: 1, GLO_22:-1,

  PUB_1:  1, PUB_2:  1, PUB_3: -1, PUB_4:  1, PUB_5:  1, PUB_6:  1, PUB_7:  1,
  PUB_8:  1, PUB_9:  1, PUB_10: 1, PUB_11: 1, PUB_12: 1, PUB_13:-1, PUB_14: 1, PUB_15:-1,
  PUB_16: 1, PUB_17: 1, PUB_18: 1, PUB_19: 1, PUB_20: 1, PUB_21: 1, PUB_22: 1, PUB_23: 1,

  // Nouvelles questions clivantes ajoutées v2
  ECO_24:-1, ECO_25:-1,
  SOC_24: 1, SOC_25: 1,
  IMM_23:-1,
  SEC_23: 1,
  ENV_24:-1,  // sortir du nucléaire = anti-nucléaire = scores ENVIRONMENT down (nucléaire = faibles émissions)
  DEM_24: 1,
  GLO_23:-1, GLO_24: 1,  // inversé: quitter OTAN = anti-mondialiste = -1, UE fédérale = mondialiste = +1

  // Nouvelles questions clivantes v3 — 2027 landscape
  ECO_26:-1,  // annuler réforme retraites 64 ans = gauche = ECONOMY down
  GLO_25: 1,  // soutien Ukraine = pro-occident = GLOBAL up
  ENV_25:-1,  // normes agricoles trop strictes = anti-environnement = ENVIRONMENT down
  PUB_24: 1,  // médecins zones désert = interventionnisme = PUBLIC_SERVICES up
  PUB_25: 1,  // hôpitaux investissement = pro-public = PUBLIC_SERVICES up
  SOC_26: 1,  // réduire discriminations = progressiste = SOCIAL up
  DEM_25: 1,  // concentration médias = pro-pluralisme = DEMOCRACY up
  SEC_24: 1,  // banlieues police > aides = sécuritaire = SECURITY up
  ECO_27:-1,  // protectionnisme = anti-libre-échange = ECONOMY down

  // Chantier 2 (2026-07-11) — comblement de lacunes thématiques (tech/IA, égalité F/H, accountability policière)
  ECO_28:-1,  // régulation stricte de l'IA = interventionnisme = ECONOMY down (même sens que ECO_9)
  DEM_26: 1,  // transparence des algorithmes publics = accountability = DEMOCRACY up (même sens que DEM_8/15/16/25)
  SEC_25:-1,  // enquête indépendante de la police = limite le pouvoir policier = SECURITY down (même sens que SEC_1/4/8/13/21)
  SOC_27: 1,  // sanctionner les écarts de salaire = progressiste = SOCIAL up (même sens que SOC_26)
};

// ─── Question processing ─────────────────────────────────────────────────────

// New weight model: CORE questions carry 5× more weight than SECONDARY
// This sharpens discrimination between profiles
const STATUS_WEIGHTS = { CORE: 10, PRIMARY: 5, SECONDARY: 2 };

const EDITORIAL_CORE_IDS = new Set([
  'ECO_8', 'ECO_23', 'SOC_7', 'SOC_24', 'IMM_1', 'IMM_23',
  'SEC_3', 'SEC_25', 'ENV_3', 'ENV_25', 'DEM_8', 'DEM_21',
  'GLO_1', 'GLO_8', 'PUB_13', 'PUB_25',
]);

// Low-signal, redundant, composite or off-theme items retired by the July 2026
// editorial review. Their IDs remain readable for historical answer data.
const EDITORIALLY_RETIRED_IDS = new Set([
  'ECO_2', 'ECO_7', 'ECO_12', 'ECO_14', 'ECO_17', 'ECO_18', 'ECO_20', 'ECO_25', 'ECO_27',
  'SOC_4', 'SOC_12', 'SOC_15', 'SOC_21',
  'IMM_4', 'IMM_10', 'IMM_11',
  'SEC_7', 'SEC_10', 'SEC_16', 'SEC_24',
  'ENV_13', 'ENV_21',
  'DEM_2', 'DEM_4', 'DEM_9', 'DEM_11', 'DEM_12', 'DEM_23',
  'GLO_2', 'GLO_5', 'GLO_9', 'GLO_10', 'GLO_20', 'GLO_24',
  'PUB_2', 'PUB_5', 'PUB_8', 'PUB_10',
]);

function processQuestion(raw) {
  const prefix = raw.id.split('_')[0];
  const status = EDITORIAL_CORE_IDS.has(raw.id)
    ? 'CORE'
    : raw.status === 'CORE'
    ? 'SECONDARY'
    : raw.status;
  return {
    id:          raw.id,
    text:        raw.text,       // French string
    axis:        raw.axis,
    // POL-AUDIT-028 (lot 2): raw.weight removed from questions_final.json — the field was
    // vestigial (STATUS_WEIGHTS[status] always won once every question had a status). This
    // fallback now only guards a genuinely missing/invalid status, which never occurs today.
    weight:      STATUS_WEIGHTS[status] ?? 2,
    status,
    cluster:     raw.cluster,
    theme:       PREFIX_TO_THEME[prefix] ?? THEMES.ECONOMY,
    direction:   DIRECTION_MAP[raw.id] ?? 1,
    isDuplicate:  raw.isDuplicate ?? false,
    duplicateOf:  raw.duplicateOf ?? null,
    explanation:  raw.explanation ?? null,
  };
}

const allQuestionsRaw = rawQuestions.map(processQuestion);

// questions: non-duplicates only — used by scorer and quiz queue
export const questions = allQuestionsRaw.filter(q =>
  !q.isDuplicate && !EDITORIALLY_RETIRED_IDS.has(q.id)
);

// coreQuestions: CORE status only (fast mode)
export const coreQuestions = questions.filter(q => q.status === 'CORE');

// quiz helper — isFastMode uses CORE questions only
export function getQuiz(isFastMode) {
  return isFastMode ? coreQuestions : questions;
}

const QUESTIONS_BY_ID = new Map(questions.map(q => [q.id, q]));

/**
 * Reconstruit une file à partir d'identifiants persistés.
 *
 * Sert à reprendre un questionnaire après rechargement : on ne persiste que les IDs
 * (la file complète pèserait plusieurs dizaines de Ko dans localStorage et figerait le
 * texte des questions à leur version du jour de la passation).
 *
 * @returns {{queue: Array, missing: string[]}} `missing` liste les IDs absents de la banque
 *   courante — leur présence signifie que le questionnaire a changé depuis la passation et
 *   que la file ne peut pas être reprise fidèlement.
 */
export function getQuestionsByIds(ids) {
  const queue = [];
  const missing = [];
  for (const id of ids ?? []) {
    const q = QUESTIONS_BY_ID.get(id);
    if (q) queue.push(q);
    else missing.push(id);
  }
  return { queue, missing };
}

// ─── Modes de questionnaire ──────────────────────────────────────────────────

/**
 * Modes canoniques et nombre de questions servies. Source unique : le nombre affiché à
 * l'utilisateur et le nombre réellement tiré doivent venir d'ici.
 *
 * Les alias historiques (`quick`, `medium`, `full`) restent acceptés en ENTRÉE — d'anciens
 * `testMode` persistés dans des navigateurs les contiennent — mais ne doivent JAMAIS être
 * comparés en dur dans l'interface : `testMode === 'quick'` ne matchait plus rien depuis le
 * passage à 16/32/64, et le bandeau qui en dépendait ne s'affichait plus pour personne.
 */
export const TEST_MODES = Object.freeze({
  DISCOVERY: 'discovery',
  STANDARD:  'standard',
  DEEP:      'deep',
});

export const MODE_QUESTION_COUNT = Object.freeze({
  [TEST_MODES.DISCOVERY]: 16,
  [TEST_MODES.STANDARD]:  32,
  [TEST_MODES.DEEP]:      64,
});

const MODE_ALIASES = Object.freeze({
  quick: TEST_MODES.DISCOVERY, medium: TEST_MODES.STANDARD, full: TEST_MODES.DEEP,
});

/** Normalise un mode, alias hérités compris. Retourne `null` si inconnu. */
export function canonicalMode(mode) {
  if (!mode) return null;
  const m = MODE_ALIASES[mode] ?? mode;
  return Object.values(TEST_MODES).includes(m) ? m : null;
}

// ─── Question queue for quiz sessions ────────────────────────────────────────

/**
 * Construit la file de questions d'une passation.
 *
 * @param {string} mode           'discovery' | 'standard' | 'deep' (alias hérités acceptés)
 * @param {Array}  priorityOrder  ordre d'alternance des thèmes
 * @param {string} [seed]         graine de tirage. OBLIGATOIRE en pratique : sans elle le
 *                                tirage n'est pas reproductible et la file de l'utilisateur
 *                                ne peut plus être reconstituée (reprise, partage, audit).
 *                                Un repli `'legacy-unseeded'` est conservé pour les appels
 *                                anciens, mais il produit une file figée, pas aléatoire.
 *
 * Le tirage n'est plus fait avec `Math.random()` : voir src/engine/rng.js.
 * Version de l'algorithme : QUEUE_ALGORITHM_VERSION dans src/engine/versions.js.
 */
export function getQuestionQueue(mode, priorityOrder, seed = 'legacy-unseeded') {
  // Alias hérités normalisés en un seul endroit : voir canonicalMode().
  const m = canonicalMode(mode) ?? TEST_MODES.DEEP;

  // All modes draw from the full question pool; CORE questions are always served first.
  const source = questions;

  // Group by theme
  const byTheme = {};
  THEMES_ORDER.forEach(t => { byTheme[t] = []; });
  source.forEach(q => { byTheme[q.theme]?.push(q); });

  // Per-mode caps: discovery=2/theme (16 total), standard=4/theme (32 total), deep=8/theme (64 total)
  // Matches the question counts advertised on the SelectTest screen.
  const capPerTheme = { discovery: 2, standard: 4, deep: 8 };
  const cap = capPerTheme[m] ?? 8;

  THEMES_ORDER.forEach(t => {
    let pool = byTheme[t];
    // CORE d'abord (plus fort signal), puis PRIMARY, puis SECONDARY — chaque strate mélangée
    // séparément avec un RNG dérivé de (graine, thème) pour que l'ordre des thèmes n'influe pas.
    //
    // L'audit externe supposait que la quasi-absence de PRIMARY en mode Approfondi venait d'un
    // ordre de tirage accidentel. Vérification faite : c'est une propriété de la banque, pas un
    // bug — elle ne contient que 3 questions PRIMARY (ECO_4, ECO_28, DEM_26) sur 128 actives,
    // contre 16 CORE et 109 SECONDARY. Le tri par strate ne « corrige » donc rien ici ; il rend
    // la règle explicite et stable si la répartition des statuts évolue.
    const rng = createRng(`${seed}:${t}`);
    const core      = pool.filter(q => q.status === 'CORE');
    const primary   = seededShuffle(pool.filter(q => q.status === 'PRIMARY'), rng);
    const secondary = seededShuffle(pool.filter(q => q.status === 'SECONDARY'), rng);
    pool = [...core, ...primary, ...secondary].slice(0, cap);
    byTheme[t] = pool;
  });

  // Serve two-question thematic blocks: enough continuity without a long
  // single-theme sequence that would amplify response-context effects.
  const blockSize = 2;
  const maxRounds = Math.max(...THEMES_ORDER.map(t => byTheme[t].length));
  const themeOrder = (priorityOrder && priorityOrder.length === THEMES_ORDER.length)
    ? priorityOrder
    : THEMES_ORDER;
  const queue = [];
  for (let round = 0; round < maxRounds; round += blockSize) {
    themeOrder.forEach(theme => {
      for (let offset = 0; offset < blockSize; offset++) {
        if (byTheme[theme]?.[round + offset]) queue.push(byTheme[theme][round + offset]);
      }
    });
  }
  return queue;
}
