// POLISCOP — Export et import des priorités électorales.
//
// POURQUOI CES FONCTIONS SONT PURES ET SÉPARÉES DU STORE
// -------------------------------------------------------
// `exportProfile()` construit un Blob et déclenche un téléchargement : rien n'y est testable.
// Les nouveaux champs (`themeImportance`, `voteInfluence`) sont précisément ceux qu'on ne peut
// pas se permettre de perdre en silence — ils encodent des décisions que la personne a prises
// une par une. La sérialisation vit donc ici, en fonctions pures, vérifiées par des
// aller-retours complets.
//
// RÈGLE : un import ne fait JAMAIS confiance au fichier. Les thèmes inconnus, les niveaux
// illisibles, les identifiants de questions disparus et les dates invalides sont écartés — pas
// « corrigés » silencieusement, ce qui reviendrait à inventer des décisions.

import { THEMES_ORDER } from '../data/questions.js';
import {
  PRIORITY_CONTRACT_VERSION, PRIORITY_SOURCE,
  IMPORTANCE_MULTIPLIER, VOTE_INFLUENCE_MULTIPLIER,
  blankImportance, normalizeThemeImportance,
} from './priorityWeights.js';
import { EDITORIAL_MATCH_CONFIG } from './editorialMatch.js';

const isKnownTheme = t => THEMES_ORDER.includes(t);
const isKnownLevel = l => typeof l === 'string' && l in IMPORTANCE_MULTIPLIER;
const isKnownInfluence = l => typeof l === 'string' && l in VOTE_INFLUENCE_MULTIPLIER;
const isIsoDate = d => typeof d === 'string' && !Number.isNaN(Date.parse(d));

/** Bloc de priorités à joindre à un export. */
export function buildPriorityExport({ themeImportance, voteInfluence } = {}) {
  const importance = normalizeThemeImportance({ themeImportance });
  return {
    priorityContractVersion: PRIORITY_CONTRACT_VERSION,
    electoralMatchVersion: EDITORIAL_MATCH_CONFIG.version,
    themeImportance: {
      levels: { ...importance.levels },
      answered: { ...importance.answered },
      source: importance.source,
      updatedAt: isIsoDate(themeImportance?.updatedAt) ? themeImportance.updatedAt : null,
    },
    // Recopie CONTRÔLÉE : on ne réémet que des entrées structurées, jamais l'objet brut.
    voteInfluence: Object.fromEntries(
      Object.entries(voteInfluence ?? {})
        .filter(([, e]) => e && typeof e === 'object')
        .map(([questionId, e]) => [questionId, {
          level: isKnownInfluence(e.level) ? e.level : null,
          declined: e.declined === true,
          askedAt: isIsoDate(e.askedAt) ? e.askedAt : null,
          answeredAt: isIsoDate(e.answeredAt) ? e.answeredAt : null,
        }]),
    ),
  };
}

/**
 * Relit un bloc de priorités importé.
 *
 * @param {Object} data              contenu du fichier
 * @param {Set<string>|Array} knownQuestionIds identifiants de questions encore servis
 * @returns {{themeImportance: Object, voteInfluence: Object, dropped: Object}}
 */
export function parsePriorityImport(data, { knownQuestionIds } = {}) {
  const known = knownQuestionIds instanceof Set ? knownQuestionIds : new Set(knownQuestionIds ?? []);
  const dropped = { themes: [], levels: [], questions: [], influences: [] };

  // ── Importance thématique ────────────────────────────────────────────────
  const raw = data?.themeImportance;
  const levels = {};
  const answered = {};
  for (const theme of THEMES_ORDER) { levels[theme] = null; answered[theme] = false; }

  if (raw && typeof raw === 'object' && raw.levels && typeof raw.levels === 'object') {
    for (const [theme, level] of Object.entries(raw.levels)) {
      if (!isKnownTheme(theme)) { dropped.themes.push(theme); continue; }
      if (level == null) continue;                       // non renseigné : état légitime
      if (!isKnownLevel(level)) { dropped.levels.push(`${theme}:${level}`); continue; }
      levels[theme] = level;
      // Un niveau valide n'est un CHOIX que si le fichier le déclare. Sans `answered`, on
      // conserve la valeur mais pas le statut de décision : inventer le second fabriquerait
      // une intention.
      answered[theme] = raw.answered?.[theme] === true;
    }
  }

  const answeredCount = THEMES_ORDER.filter(t => answered[t]).length;
  const declaredSource = raw?.source;
  const source = answeredCount === 0
    ? null
    : ([PRIORITY_SOURCE.EQUAL, PRIORITY_SOURCE.RANKING, PRIORITY_SOURCE.INDEPENDENT]
      .includes(declaredSource) ? declaredSource : PRIORITY_SOURCE.INDEPENDENT);

  const themeImportance = answeredCount === 0 && !Object.values(levels).some(Boolean)
    ? blankImportance()
    : { levels, answered, source, updatedAt: isIsoDate(raw?.updatedAt) ? raw.updatedAt : null };

  // ── Influence électorale ─────────────────────────────────────────────────
  const voteInfluence = {};
  const rawInfluence = data?.voteInfluence;
  if (rawInfluence && typeof rawInfluence === 'object') {
    for (const [questionId, entry] of Object.entries(rawInfluence)) {
      if (!known.has(questionId)) { dropped.questions.push(questionId); continue; }
      if (!entry || typeof entry !== 'object') { dropped.influences.push(questionId); continue; }

      const declined = entry.declined === true;
      const level = isKnownInfluence(entry.level) ? entry.level : null;
      // Ni niveau lisible ni refus : l'entrée ne porte aucune décision, on l'écarte plutôt
      // que d'enregistrer un objet vide qui ressemblerait à une réponse.
      if (level == null && !declined) { dropped.influences.push(questionId); continue; }

      voteInfluence[questionId] = {
        level,
        multiplier: level != null ? VOTE_INFLUENCE_MULTIPLIER[level] : null,
        declined,
        askedAt: isIsoDate(entry.askedAt) ? entry.askedAt : null,
        answeredAt: isIsoDate(entry.answeredAt) ? entry.answeredAt : null,
      };
    }
  }

  return { themeImportance, voteInfluence, dropped };
}
