#!/usr/bin/env node
/**
 * check-learn-content.mjs — contrôle automatique du contenu « J'y connais rien » /
 * Poliscop Academy (docs/jyconnaisrien/05, §7). À lancer avant tout commit de contenu.
 *
 * Vérifie : schémas (champs requis par type), cohérence manifeste ↔ fiche,
 * niveaux (famille ↔ hasLevels ↔ niveaux réellement rédigés, N1 = 40-80 mots),
 * fraîcheur (régimes, dates parsables, revues en retard), sources (globales et
 * granulaires), liens internes (motsAssocies, continuerAvec, parentFiche),
 * IDs vrai/faux, sections obligatoires (président, débat, dossier-pivot),
 * et lexique à risque (warnings).
 *
 * Sortie : erreurs (exit 1) + warnings (exit 0).
 */

const { LEARN_MANIFEST, UPCOMING } = await import('../src/content/learn/manifest.js');
const { VRAIFAUX_BANK } = await import('../src/content/learn/vraifaux/bank.js');

const errors = [];
const warnings = [];
const err = (slug, msg) => errors.push(`✗ [${slug}] ${msg}`);
const warn = (slug, msg) => warnings.push(`⚠ [${slug}] ${msg}`);

const FRESHNESS = { stable: 24, periodic: 12, live: 3 };
const FAMILLES = { court: [1, 2], intermediaire: [1, 2, 3], dossier: [1, 2, 3, 4] };
const TODAY = new Date('2026-07-12'); // date de la dernière campagne éditoriale ; à terme : new Date()

const REQUIRED_SECTIONS = {
  president: ['programme', 'mesures', 'evenements', 'gouverner', 'bilan', 'defenseurs', 'opposants', 'heritage'],
  debat: ['positions', 'mesures-prises', 'se-faire-une-opinion'],
};

const LEXIQUE_RISQUE = [
  /tous les demandeurs d'asile sont/i,
  /toujours raison|toujours tort/i,
  /tous les (immigrés|étrangers|musulmans|juifs) (sont|veulent)/i,
  /\bforcément un délinquant\b/i,
];

const knownSlugs = new Set([...LEARN_MANIFEST.map(e => e.slug), ...UPCOMING.map(u => u.slug)]);

// ── 1. Manifeste ─────────────────────────────────────────────────────────────
const seenKeys = new Set();
const seenSlugs = new Map();
for (const e of LEARN_MANIFEST) {
  const key = `${e.section}/${e.slug}`;
  if (seenKeys.has(key)) err(key, `entrée dupliquée dans le manifeste`);
  seenKeys.add(key);
  // collision de slug entre sections : tolérée uniquement si l'une est searchable: false
  if (seenSlugs.has(e.slug)) {
    const other = seenSlugs.get(e.slug);
    if (e.searchable !== false && other.searchable !== false) {
      err(key, `slug « ${e.slug} » en double (${other.section}) sans searchable:false — findBySlug devient ambigu`);
    }
  } else seenSlugs.set(e.slug, e);

  for (const field of ['slug', 'section', 'type', 'icon', 'famille', 'updatedAt', 'lastReviewedAt', 'freshnessType', 'hasLevels', 'langs', 'load']) {
    if (e[field] === undefined) err(key, `champ manifeste manquant : ${field}`);
  }
  if (!e.title?.fr) err(key, `title.fr manquant`);
  if (!e.hook?.fr) err(key, `hook.fr manquant`);
  if (!e.aliases?.fr?.length) warn(key, `aucun alias de recherche`);
  if (![1, 2, 3].includes(e.difficulty)) err(key, `difficulty invalide : ${e.difficulty}`);
  if (!FAMILLES[e.famille]) err(key, `famille inconnue : ${e.famille}`);
  if (!FRESHNESS[e.freshnessType]) err(key, `freshnessType inconnu : ${e.freshnessType}`);
}

// ── 2. Fiches ────────────────────────────────────────────────────────────────
function collectSections(content) {
  return [...(content.level2?.sections || []), ...(content.level3?.sections || [])];
}

function checkSources(key, list, ctx) {
  for (const s of list || []) {
    if (!s.label) err(key, `source sans label (${ctx})`);
    if (s.year && (s.year < 1700 || s.year > 2100)) err(key, `année de source invalide (${ctx}) : ${s.year}`);
  }
}

for (const e of LEARN_MANIFEST) {
  const key = `${e.section}/${e.slug}`;
  let c;
  try {
    c = await e.load();
  } catch (ex) {
    err(key, `load() échoue : ${ex.message}`);
    continue;
  }
  if (!c) { err(key, `load() renvoie null/undefined`); continue; }

  // cohérence manifeste ↔ fiche
  if (c.slug !== e.slug) err(key, `slug fiche (${c.slug}) ≠ manifeste`);
  if (c.type !== e.type) err(key, `type fiche (${c.type}) ≠ manifeste (${e.type})`);
  if (c.famille !== e.famille) err(key, `famille fiche (${c.famille}) ≠ manifeste (${e.famille})`);
  if (c.updatedAt !== e.updatedAt) err(key, `updatedAt fiche (${c.updatedAt}) ≠ manifeste (${e.updatedAt})`);
  if (c.freshness?.type !== e.freshnessType) err(key, `freshness.type (${c.freshness?.type}) ≠ manifeste (${e.freshnessType})`);
  if (c.freshness?.lastReviewedAt !== e.lastReviewedAt) err(key, `lastReviewedAt fiche ≠ manifeste`);

  // fraîcheur
  const expectedMonths = FRESHNESS[c.freshness?.type];
  if (c.freshness?.reviewEveryMonths !== expectedMonths) {
    err(key, `reviewEveryMonths (${c.freshness?.reviewEveryMonths}) ≠ régime ${c.freshness?.type} (${expectedMonths})`);
  }
  for (const [f, v] of [['updatedAt', c.updatedAt], ['lastReviewedAt', c.freshness?.lastReviewedAt]]) {
    if (!v || isNaN(Date.parse(v))) err(key, `${f} manquant ou non parsable : ${v}`);
  }
  if (c.freshness?.lastReviewedAt) {
    const ageMonths = (TODAY - new Date(c.freshness.lastReviewedAt)) / (30.44 * 24 * 3600 * 1000);
    if (ageMonths > expectedMonths) warn(key, `revue en retard : vérifié il y a ${ageMonths.toFixed(1)} mois (régime ${c.freshness.type} = ${expectedMonths})`);
  }

  // niveaux
  const written = [
    c.level1 ? 1 : null,
    c.level2?.sections?.length ? 2 : null,
    c.level3?.sections?.length ? 3 : null,
    c.level4?.items?.length ? 4 : null,
  ].filter(Boolean);
  if (JSON.stringify(written) !== JSON.stringify(e.hasLevels)) {
    err(key, `hasLevels manifeste [${e.hasLevels}] ≠ niveaux rédigés [${written}]`);
  }
  const allowed = FAMILLES[c.famille] || [];
  for (const l of written) {
    if (!allowed.includes(l)) err(key, `niveau N${l} rédigé mais famille « ${c.famille} » ne le prévoit pas`);
  }
  if (!c.level1?.fr) err(key, `N1 manquant`);
  else {
    const words = c.level1.fr.trim().split(/\s+/).length;
    // modèle définition : « définition en une phrase » (docs/jyconnaisrien/02 §10) → 15-80 mots ;
    // tous les autres types : « en 20 secondes » → 40-80 mots.
    const min = c.type === 'definition' ? 15 : 40;
    if (words < min || words > 80) err(key, `N1 = ${words} mots (attendu ${min}-80 pour le type ${c.type})`);
  }
  if (!c.level2?.sections?.length) err(key, `N2 manquant (obligatoire pour toute page publiée)`);

  // sources globales + granulaires
  if (!c.sources?.length) err(key, `aucune source globale`);
  else if (c.famille === 'dossier' && c.sources.length < 3) warn(key, `dossier avec seulement ${c.sources.length} source(s) globale(s)`);
  checkSources(key, c.sources, 'globales');
  for (const s of collectSections(c)) checkSources(key, s.sources, `section « ${s.titre?.fr || s.id} »`);
  for (const ev of c.chronologie?.events || []) if (ev.source) checkSources(key, [ev.source], `chronologie ${ev.date}`);
  checkSources(key, c.tableauComparatif?.sources, 'tableau comparatif');
  if (c.famille === 'dossier') {
    const granular = collectSections(c).filter(s => s.sources?.length).length;
    if (granular === 0) warn(key, `dossier sans aucune source granulaire de section`);
  }

  // liens internes
  const checkRef = (ref, ctx) => {
    const obj = typeof ref === 'string' ? { slug: ref } : ref;
    if (obj.soon || (!obj.slug && obj.label)) return; // chip « bientôt » assumée
    if (obj.slug && !knownSlugs.has(obj.slug)) err(key, `${ctx} pointe vers un slug inconnu : ${obj.slug}`);
  };
  (c.motsAssocies || []).forEach(m => checkRef(m, 'motsAssocies'));
  (c.continuerAvec || []).forEach(m => checkRef(m, 'continuerAvec'));
  if (c.parentFiche && !knownSlugs.has(c.parentFiche)) err(key, `parentFiche inconnu : ${c.parentFiche}`);

  // vrai/faux
  for (const id of c.vraiFaux || []) {
    if (!VRAIFAUX_BANK[id]) err(key, `vraiFaux id inconnu dans la banque : ${id}`);
  }

  // quiz
  for (const [i, q] of (c.quiz || []).entries()) {
    if (!q.options?.length || q.bonneReponse === undefined || !q.options[q.bonneReponse]) {
      err(key, `quiz #${i + 1} : bonneReponse invalide`);
    }
    if (!q.explication?.fr) err(key, `quiz #${i + 1} : explication manquante`);
  }

  // sections obligatoires par type
  const required = REQUIRED_SECTIONS[c.type];
  if (required) {
    const ids = new Set((c.level3?.sections || []).map(s => s.id));
    for (const r of required) if (!ids.has(r)) err(key, `section obligatoire manquante pour le type ${c.type} : « ${r} »`);
  }
  if (c.variante === 'dossier-pivot') {
    if (!c.carte?.length) err(key, `dossier-pivot sans cartographie (carte)`);
    for (const item of c.carte || []) {
      if (!(c.level3?.sections || []).some(s => s.id === item.id)) err(key, `carte pointe vers une section N3 inexistante : ${item.id}`);
    }
  }
  if (c.type === 'institution') {
    const briques = collectSections(c).map(s => s.brique).filter(Boolean);
    if (!briques.includes('a-retenir')) warn(key, `institution sans encadré « ce qu'il ne peut pas faire » (brique a-retenir)`);
  }

  // lexique à risque (revue humaine)
  const textDump = JSON.stringify(c);
  for (const re of LEXIQUE_RISQUE) {
    if (re.test(textDump)) warn(key, `lexique à risque détecté : ${re}`);
  }
}

// ── 2bis. Parcours : chaque étape référence une fiche du manifeste ──
const { PARCOURS_LIST } = await import('../src/content/learn/parcours/index.js');
for (const pc of PARCOURS_LIST) {
  for (const e2 of pc.etapes) {
    if (!LEARN_MANIFEST.some(x => x.section === e2.section && x.slug === e2.slug)) {
      err(`parcours/${pc.slug}`, `étape inconnue au manifeste : ${e2.section}/${e2.slug}`);
    }
  }
  if (pc.etapes.length < 3) warn(`parcours/${pc.slug}`, `parcours très court (${pc.etapes.length} étapes)`);
}

// ── 3. Banque vrai/faux ──────────────────────────────────────────────────────
const VERDICTS = new Set(['vrai', 'faux', 'partiel', 'trompeur', 'sans-contexte']);
for (const [id, item] of Object.entries(VRAIFAUX_BANK)) {
  if (!VERDICTS.has(item.verdict)) err(id, `verdict inconnu : ${item.verdict}`);
  if (!item.enonce?.fr) err(id, `énoncé manquant`);
  if (!item.explication?.fr || item.explication.fr.length < 80) err(id, `explication absente ou trop courte pour être argumentée`);
  for (const r of item.related || []) {
    if (!knownSlugs.has(r)) warn(id, `related pointe vers un slug inconnu : ${r}`);
  }
}

// ── Sortie ───────────────────────────────────────────────────────────────────
for (const w of warnings) console.log(w);
for (const e2 of errors) console.error(e2);
console.log(`\n${LEARN_MANIFEST.length} fiches · ${Object.keys(VRAIFAUX_BANK).length} items vrai/faux · ${errors.length} erreur(s) · ${warnings.length} warning(s)`);
if (errors.length > 0) process.exit(1);
console.log('✓ check-learn-content : contenu conforme.');
