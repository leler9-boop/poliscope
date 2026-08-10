// POLISCOP — Règles éditoriales de la banque de questions.
//
// SOURCE UNIQUE. `scripts/lint-questions.mjs` (contrôle informatif détaillé) et
// `tests/data/questions.editorial.test.mjs` (garde-fou bloquant) importent tous les deux
// ce module. Deux jeux d'heuristiques divergents avaient déjà produit le cas classique :
// un linter vert et une banque non conforme.
//
// ⚠ Ces heuristiques sont des DÉTECTEURS, pas des preuves. Elles attrapent les défauts
// mécaniquement repérables (longueur, coordination, franglais, intensificateurs, quasi-
// doublons). Elles n'attrapent PAS l'ambiguïté sémantique, la tautologie, ni le biais
// d'argumentation : ceux-là relèvent de la relecture humaine consignée dans
// docs/questions/2026-08-revision-matrix.md.

// ─── Seuils ──────────────────────────────────────────────────────────────────

/** Au-delà, une question active échoue. Le viseur éditorial reste 8–20 mots. */
export const MAX_WORDS = 24;
/** Cible éditoriale : au-delà, signalement informatif seulement. */
export const TARGET_MAX_WORDS = 20;
/** Nombre minimum de questions par thème dont l'accord pousse le score dans le sens minoritaire. */
export const MIN_MINORITY_DIRECTION = 4;
/** Similarité Jaccard (mots pleins) au-delà de laquelle deux questions actives sont quasi-doublons. */
export const NEAR_DUPLICATE_THRESHOLD = 0.55;
/** Longueur minimale d'une explication, en mots. */
export const MIN_EXPLANATION_WORDS = 15;
/** Longueur maximale d'une explication, en mots. */
export const MAX_EXPLANATION_WORDS = 260;

// ─── Listes lexicales ────────────────────────────────────────────────────────

/**
 * Franglais et calques interdits dans le contenu public.
 * Le questionnaire public est en français : aucun de ces termes n'a de raison d'y figurer.
 */
export const FRANGLAIS = [
  'process', 'fact-checking', 'factchecking', 'mainstream', 'accountability',
  'welfare', 'profiling', 'testing', 'challenge', 'focus', 'timing',
  'impacter', 'impacté', 'implémenter', 'supporter le', 'supporter la',
  'opportunité', 'définitivement', 'in fine', 'agenda politique', 'lobbying',
  'benchmark', 'reporting', 'compliance', 'workflow', 'digital',
];

/**
 * Intensificateurs et verbes-valise sans périmètre mesurable.
 *
 * Ligne de partage assumée : un COMPARATIF (« plus de », « plus strictes », « moins »)
 * énonce un sens et reste répondable ; un INTENSIFICATEUR (« fortement », « massivement »)
 * énonce un degré que personne ne peut situer. Seuls les seconds sont bloquants.
 */
export const VAGUE_TERMS = [
  'davantage', 'fortement', 'massivement', 'sensiblement', 'strictement',
  'rapidement', 'largement', 'significativement', 'activement', 'notablement',
  'priorité absolue', 'mieux prendre en compte', 'pleinement',
  'renforcer', 'renforcées', 'renforcés', 'renforcée', 'renforcé',
  'durcir', 'faciliter', 'améliorer le système', 'moderniser',
];

/**
 * Sigles admis sans glose dans une question : d'usage courant en France et compris
 * hors contexte politique. Tout autre sigle doit être développé dans la question même.
 */
export const KNOWN_ACRONYMS = new Set(['ONU', 'OTAN', 'SMIC', 'TVA', 'PIB', 'UE', 'RSA', 'CO', 'CO2']);

/** Mots-outils ignorés dans le calcul de similarité. */
const STOPWORDS = new Set([
  'le', 'la', 'les', 'un', 'une', 'des', 'du', 'de', 'd', 'l', 'à', 'au', 'aux',
  'et', 'ou', 'en', 'dans', 'sur', 'pour', 'par', 'avec', 'sans', 'que', 'qui',
  'ne', 'pas', 'plus', 'est', 'sont', 'doit', 'doivent', 'être', 'a', 'ont',
  'se', 'sa', 'son', 'ses', 'leur', 'leurs', 'ce', 'cette', 'ces', 'il', 'elle',
  'on', 'y', 'même', 'tout', 'tous', 'toute', 'toutes', 'chaque', 'plutôt', 'si',
]);

// ─── Exceptions explicites ───────────────────────────────────────────────────

/**
 * Exceptions nominatives aux heuristiques. Volontairement courte : chaque entrée est
 * un arbitrage humain daté, pas un moyen de faire taire le contrôle.
 * Toute entrée doit citer la règle contournée ET la raison.
 *
 * Une exception qui ne se déclenche plus est signalée comme périmée par le test
 * « aucune exception éditoriale inutile » : on la retire alors.
 */
export const RULE_EXCEPTIONS = {
  ECO_28: {
    rules: ['VAGUE'],
    reason:
      '« strictement » est ici la proposition testée, pas un remplissage : l’opposition politique ' +
      'porte précisément sur le DEGRÉ d’encadrement de l’intelligence artificielle. Le retirer ' +
      '(révision 2026-08, « la loi doit encadrer ») avait affaibli le seuil et changé le sens ' +
      'd’une question dont l’identifiant était conservé — défaut relevé au contre-audit P0-1.',
  },
  ENV_7: {
    rules: ['COMPOSITE'],
    reason:
      '« à essence et diesel » nomme UNE catégorie de véhicules par ses deux carburants. Le ' +
      'calendrier européen de 2035 porte sur cette catégorie prise ensemble, et aucun parti ' +
      'français ne défend aujourd’hui d’interdire un seul des deux carburants — ce qui n’exclut ' +
      'pas qu’une telle position existe ou apparaisse. La formulation savante « voitures ' +
      'thermiques » évitait la coordination mais restait opaque pour le niveau de lecture visé.',
  },
};

// ─── Primitives ──────────────────────────────────────────────────────────────

export function wordCount(s) {
  return (s || '').trim().split(/\s+/).filter(Boolean).length;
}

function normalize(s) {
  return (s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')   // diacritiques combinantes issues de NFD
    .replace(/[’']/g, "'");
}

function contentWords(s) {
  return new Set(
    normalize(s)
      .replace(/[^a-z0-9' ]/g, ' ')
      .split(/[\s']+/)
      .filter(w => w.length > 2 && !STOPWORDS.has(w))
      // Troncature grossière tenant lieu de racinisation : « nouveaux »/« nouvelles »
      // ne doivent pas compter comme deux concepts distincts.
      .map(w => w.slice(0, 6)),
  );
}

export function jaccard(a, b) {
  const A = contentWords(a);
  const B = contentWords(b);
  if (!A.size || !B.size) return 0;
  let inter = 0;
  for (const w of A) if (B.has(w)) inter++;
  return inter / (A.size + B.size - inter);
}

// ─── Détecteurs ──────────────────────────────────────────────────────────────

/**
 * Question probablement composite : elle mesure deux décisions politiques.
 *
 * Le test humain reste « peut-on approuver une moitié et refuser l'autre ? ». Aucune
 * heuristique ne tranche ça toute seule : « l'énergie et les transports » (deux politiques)
 * et « essence et diesel » (une seule catégorie) ont la même forme.
 *
 * Choix assumé : on signale TOUTE coordination dans une question active, et chaque
 * coordination légitime doit être justifiée nominativement dans RULE_EXCEPTIONS. La liste
 * d'exceptions devient ainsi la trace écrite des arbitrages humains — pas un moyen de faire
 * taire le contrôle. Un seuil « ≥ 2 et » laissait passer ECO_8 et SEC_20, les deux composites
 * les plus nets de la banque.
 *
 * Note : la comparaison se fait sur le texte accentué, sinon « où » deviendrait « ou ».
 */
export function findComposite(text) {
  const t = (text || '').toLowerCase().replace(/[’']/g, "'");
  const hits = [];
  for (const [label, re] of [
    ['et', /\bet\b/g],
    ['ou', /\bou\b/g],
    ['empilement', /\b(ainsi que|tout en|mais aussi|de même que|et\/ou|à la fois)\b/g],
  ]) {
    const found = t.match(re);
    if (found) hits.push(`${label} ×${found.length}`);
  }
  if (!hits.length) return null;
  // Fragment autour de la première coordination, pour que le signalement soit relisible.
  const m = t.match(/.{0,28}\b(et|ou|ainsi que|tout en|mais aussi)\b.{0,28}/);
  return `${hits.join(', ')}${m ? ` — « …${m[0].trim()}… »` : ''}`;
}

/**
 * Double négation. Heuristique : chaque « ne/n' » ouvre une construction négative,
 * chaque « sans » en est une à lui seul. Deux constructions ou plus = charge cognitive
 * inutile dans une question à échelle d'accord.
 */
export function findDoubleNegation(text) {
  const t = normalize(text);
  const ne = (t.match(/\bn[e']/g) || []).length;
  const sans = (t.match(/\bsans\b/g) || []).length;
  const total = ne + sans;
  return total >= 2 ? `${total} constructions négatives` : null;
}

export function findFranglais(text) {
  const t = normalize(text);
  return FRANGLAIS.filter(w => new RegExp(`\\b${normalize(w).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`).test(t));
}

export function findVagueTerms(text) {
  const t = normalize(text);
  return VAGUE_TERMS.filter(w => new RegExp(`\\b${normalize(w)}\\b`).test(t));
}

/**
 * Sigles non expliqués. Un sigle est accepté s'il est d'usage courant (KNOWN_ACRONYMS)
 * ou s'il est glosé dans la phrase même — « X (forme développée) » ou « forme développée (X) ».
 */
export function findUnglossedAcronyms(text) {
  const raw = text || '';
  const found = raw.match(/\b[A-ZÉÈÀÙÂÊÎÔÛ]{2,}\b/g) || [];
  return [...new Set(found)].filter(a => {
    if (KNOWN_ACRONYMS.has(a)) return false;
    // Glose entre parenthèses, dans un sens ou dans l'autre.
    const glossed = new RegExp(`\\(${a}\\)|${a}\\s*\\([^)]{4,}\\)`).test(raw);
    return !glossed;
  });
}

/** Paires de questions actives trop proches (mots pleins). */
export function nearDuplicatePairs(items, threshold = NEAR_DUPLICATE_THRESHOLD) {
  const pairs = [];
  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      const score = jaccard(items[i].text, items[j].text);
      if (score >= threshold) {
        pairs.push({ a: items[i].id, b: items[j].id, score: Number(score.toFixed(2)) });
      }
    }
  }
  return pairs.sort((x, y) => y.score - x.score);
}

/**
 * L'explication ne doit pas se contenter de reprendre la question.
 * Comparaison sur les 30 premiers caractères normalisés, comme le contrôle historique.
 */
export function explanationEchoesQuestion(text, explanation) {
  const q = normalize(text).replace(/[.,!?]/g, '').trim();
  const e = normalize(explanation).replace(/[.,!?]/g, '').trim();
  if (!q || !e) return false;
  return e.startsWith(q.slice(0, Math.min(30, q.length)));
}

// ─── Analyse d'une question ──────────────────────────────────────────────────

/**
 * @param {{id:string,text:string,explanation?:string}} raw  entrée de questions_final.json
 * @param {{theme?:string,direction?:number,status?:string}} [processed]  question active correspondante
 * @returns {{rule:string,detail:string,level:'error'|'warn'}[]}
 */
export function analyseQuestion(raw, processed) {
  const out = [];
  const text = raw.text || '';
  const expl = raw.explanation || '';
  const exempt = new Set(RULE_EXCEPTIONS[raw.id]?.rules ?? []);
  const push = (rule, detail, level = 'error') => {
    if (!exempt.has(rule)) out.push({ rule, detail, level });
  };

  if (!text.trim()) push('EMPTY_TEXT', 'texte de question vide');
  if (!expl.trim() && !raw.isDuplicate) push('EMPTY_EXPLANATION', 'explication absente');

  const words = wordCount(text);
  if (words > MAX_WORDS) push('TOO_LONG', `${words} mots (max ${MAX_WORDS})`);
  else if (words > TARGET_MAX_WORDS) push('LONG', `${words} mots (cible ${TARGET_MAX_WORDS})`, 'warn');

  const composite = findComposite(text);
  if (composite) push('COMPOSITE', composite);

  const doubleNeg = findDoubleNegation(text);
  if (doubleNeg) push('DOUBLE_NEGATION', doubleNeg);

  const franglais = [...new Set([...findFranglais(text), ...findFranglais(expl)])];
  if (franglais.length) push('FRANGLAIS', franglais.join(', '));

  const vague = findVagueTerms(text);
  if (vague.length) push('VAGUE', vague.join(', '));

  const acronyms = findUnglossedAcronyms(text);
  if (acronyms.length) push('ACRONYM_UNGLOSSED', acronyms.join(', '));

  if (expl.trim()) {
    const ew = wordCount(expl);
    if (ew < MIN_EXPLANATION_WORDS) push('EXPLANATION_TOO_SHORT', `${ew} mots`);
    if (ew > MAX_EXPLANATION_WORDS) push('EXPLANATION_TOO_LONG', `${ew} mots`);
    if (explanationEchoesQuestion(text, expl)) push('EXPLANATION_ECHOES', 'reprend la question mot pour mot');
  }

  if (/ {2,}/.test(text) || / {2,}/.test(expl)) push('DOUBLE_SPACE', 'espace double', 'warn');
  if (!raw.axis) push('AXIS_MISSING', 'champ axis absent');

  if (processed) {
    if (!processed.theme) push('THEME_MISSING', 'thème non résolu');
    if (processed.direction !== 1 && processed.direction !== -1) {
      push('DIRECTION_MISSING', `direction invalide (${processed.direction})`);
    }
    if (!['CORE', 'PRIMARY', 'SECONDARY'].includes(processed.status)) {
      push('STATUS_MISSING', `statut invalide (${processed.status})`);
    }
  }

  return out;
}

/**
 * Équilibre du sens des formulations, thème par thème.
 * @returns {{theme:string,plus:number,minus:number,minority:number,ok:boolean}[]}
 */
export function directionBalance(activeQuestions, themesOrder) {
  return themesOrder.map(theme => {
    const qs = activeQuestions.filter(q => q.theme === theme);
    const plus = qs.filter(q => q.direction === 1).length;
    const minus = qs.length - plus;
    const minority = Math.min(plus, minus);
    return { theme, plus, minus, minority, ok: minority >= MIN_MINORITY_DIRECTION };
  });
}
