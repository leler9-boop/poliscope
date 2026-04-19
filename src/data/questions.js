// POLISCOP — Question Bank
// Source: questions_final.json (180 questions, 22 duplicates excluded from quiz/scoring)

import rawQuestions from './questions_final.json';

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
  ECO_9: -1, ECO_10:-1, ECO_11: 1, ECO_12:-1, ECO_13: 1, ECO_14:-1, ECO_15: 1,
  ECO_16:-1, ECO_17: 1, ECO_18:-1, ECO_19:-1, ECO_20:-1, ECO_21:-1, ECO_22:-1, ECO_23: 1,

  SOC_1:  1, SOC_2:  1, SOC_3:  1, SOC_4:  1, SOC_5: -1, SOC_6:  1, SOC_7: -1, SOC_8:  1,
  SOC_9:  1, SOC_10: 1, SOC_11: 1, SOC_12: 1, SOC_13: 1, SOC_14:-1, SOC_15: 1,
  SOC_16: 1, SOC_17: 1, SOC_18: 1, SOC_19:-1, SOC_20: 1, SOC_21: 1, SOC_22: 1, SOC_23: 1,

  IMM_1:  1, IMM_2: -1, IMM_3: -1, IMM_4:  1, IMM_5:  1, IMM_6:  1, IMM_7: -1,
  IMM_8: -1, IMM_9: -1, IMM_10:-1, IMM_11:-1, IMM_12: 1, IMM_13: 1, IMM_14: 1, IMM_15:-1,
  IMM_16:-1, IMM_17:-1, IMM_18:-1, IMM_19: 1, IMM_20: 1, IMM_21:-1, IMM_22: 1,

  SEC_1: -1, SEC_2:  1, SEC_3:  1, SEC_4: -1, SEC_5:  1, SEC_6: -1, SEC_7:  1,
  SEC_8: -1, SEC_9: -1, SEC_10: 1, SEC_11: 1, SEC_12: 1, SEC_13:-1, SEC_14:-1, SEC_15: 1,
  SEC_16: 1, SEC_17:-1, SEC_18: 1, SEC_19: 1, SEC_20: 1, SEC_21:-1, SEC_22: 1,

  ENV_1:  1, ENV_2:  1, ENV_3:  1, ENV_4:  1, ENV_5:  1, ENV_6:  1, ENV_7:  1,
  ENV_8:  1, ENV_9:  1, ENV_10: 1, ENV_11: 1, ENV_12: 1, ENV_13: 1, ENV_14: 1, ENV_15: 1,
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
  ENV_24: 1,
  DEM_24: 1,
  GLO_23:-1, GLO_24: 1,  // inversé: quitter OTAN = anti-mondialiste = -1, UE fédérale = mondialiste = +1
};

// ─── Question processing ─────────────────────────────────────────────────────

// New weight model: CORE questions carry 5× more weight than SECONDARY
// This sharpens discrimination between profiles
const STATUS_WEIGHTS = { CORE: 10, PRIMARY: 5, SECONDARY: 2 };

function processQuestion(raw) {
  const prefix = raw.id.split('_')[0];
  return {
    id:          raw.id,
    text:        raw.text,       // French string
    axis:        raw.axis,
    weight:      STATUS_WEIGHTS[raw.status] ?? (raw.weight ?? 2),
    status:      raw.status,
    cluster:     raw.cluster,
    theme:       PREFIX_TO_THEME[prefix] ?? THEMES.ECONOMY,
    direction:   DIRECTION_MAP[raw.id] ?? 1,
    isDuplicate: raw.isDuplicate ?? false,
    duplicateOf: raw.duplicateOf ?? null,
  };
}

const allQuestionsRaw = rawQuestions.map(processQuestion);

// questions: non-duplicates only — used by scorer and quiz queue
export const questions = allQuestionsRaw.filter(q => !q.isDuplicate);

// coreQuestions: CORE status only (fast mode)
export const coreQuestions = questions.filter(q => q.status === 'CORE');

// quiz helper — isFastMode uses CORE questions only
export function getQuiz(isFastMode) {
  return isFastMode ? coreQuestions : questions;
}

// ─── Question queue for quiz sessions ────────────────────────────────────────

export function getQuestionQueue(mode, priorityOrder) {
  // Select source pool by mode
  const source = mode === 'quick' ? coreQuestions : questions;

  // Group by theme
  const byTheme = {};
  THEMES_ORDER.forEach(t => { byTheme[t] = []; });
  source.forEach(q => { byTheme[q.theme]?.push(q); });

  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // For medium: up to 7 per theme, CORE first
  THEMES_ORDER.forEach(t => {
    let pool = byTheme[t];
    if (mode === 'medium') {
      const core = pool.filter(q => q.status === 'CORE');
      const rest = shuffle(pool.filter(q => q.status !== 'CORE'));
      pool = [...core, ...rest].slice(0, 7);
    } else {
      pool = shuffle(pool);
    }
    byTheme[t] = pool;
  });

  // Interleave themes round-robin by priority order
  const maxRounds = Math.max(...THEMES_ORDER.map(t => byTheme[t].length));
  const themeOrder = (priorityOrder && priorityOrder.length === THEMES_ORDER.length)
    ? priorityOrder
    : THEMES_ORDER;
  const queue = [];
  for (let round = 0; round < maxRounds; round++) {
    themeOrder.forEach(theme => {
      if (byTheme[theme]?.[round]) queue.push(byTheme[theme][round]);
    });
  }
  return queue;
}
