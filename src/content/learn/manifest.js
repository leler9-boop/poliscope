/**
 * Manifeste « Comprendre la politique » — index léger de TOUT le contenu publié.
 * C'est la seule source de vérité pour l'UI : une page absente d'ici n'existe pas.
 * Le corps des fiches est chargé en lazy (load()) → code-splitting par Vite.
 *
 * Voir docs/jyconnaisrien/05-architecture-technique.md.
 */

export const SECTIONS = {
  bases:                { fr: 'Les bases' },
  familles:             { fr: 'Les familles politiques' },
  partis:               { fr: 'Les partis' },
  figures:              { fr: 'Les personnalités' },
  presidents:           { fr: 'Les présidents' },
  'premiers-ministres': { fr: 'Les Premiers ministres' },
  institutions:         { fr: 'Les institutions' },
  debats:               { fr: 'Les grands débats' },
  dico:                 { fr: 'Le dictionnaire' },
  methodes:             { fr: 'Comment le sait-on ?' },
};

export const LEARN_MANIFEST = [
  {
    slug: 'droite',
    section: 'familles',
    type: 'ideologie',
    title: { fr: `La droite`, en: 'The Right' },
    hook: { fr: `Ordre, mérite, marché… et au moins huit droites différentes. Le dossier complet.` },
    icon: '📘',
    difficulty: 2,
    famille: 'dossier',
    updatedAt: '2026-07-12',
    lastReviewedAt: '2026-07-12',
    freshnessType: 'periodic',
    hasLevels: [1, 2, 3, 4],
    langs: ['fr'],
    aliases: { fr: [`c'est quoi la droite`, `être de droite`, `les droites`, `droite politique`, `différence droite extrême droite`, `gaullisme`, `conservateur`, `libéral`] },
    load: () => import('./familles/droite.js').then(m => m.default),
  },
  {
    slug: 'retraites',
    section: 'debats',
    type: 'debat',
    title: { fr: `Les retraites`, en: 'Pensions' },
    hook: { fr: `Pourquoi ce débat revient à chaque élection — répartition, démographie, et trois visions qui s'affrontent.` },
    icon: '🧓',
    difficulty: 2,
    famille: 'dossier',
    updatedAt: '2026-07-12',
    lastReviewedAt: '2026-07-12',
    freshnessType: 'live',
    hasLevels: [1, 2, 3],
    langs: ['fr'],
    aliases: { fr: [`réforme des retraites`, `âge de départ`, `64 ans`, `répartition`, `pension`] },
    load: () => import('./debats/retraites.js').then(m => m.default),
  },
  {
    slug: 'oqtf',
    section: 'dico',
    categorie: 'immigration',
    type: 'definition',
    title: { fr: `L'OQTF`, en: 'OQTF' },
    hook: { fr: `Une décision administrative, pas une condamnation pénale — ce qu'elle est, qui décide, pourquoi toutes ne sont pas exécutées.` },
    icon: '📄',
    difficulty: 2,
    famille: 'intermediaire',
    updatedAt: '2026-07-12',
    lastReviewedAt: '2026-07-12',
    freshnessType: 'live',
    hasLevels: [1, 2],
    langs: ['fr'],
    aliases: { fr: [`c'est quoi une oqtf`, `obligation de quitter le territoire`, `oqtf expulsion`, `oqtf définition`] },
    load: () => import('./dico/immigration.js').then(m => m.TERMS['oqtf']),
  },
  {
    slug: '49-3',
    section: 'dico',
    categorie: 'institutions',
    type: 'definition',
    title: { fr: `Le 49.3`, en: 'Article 49.3' },
    hook: { fr: `L'article qui permet d'adopter une loi sans vote — et le bras de fer qu'il déclenche.` },
    icon: '🏛️',
    difficulty: 1,
    famille: 'intermediaire',
    updatedAt: '2026-07-12',
    lastReviewedAt: '2026-07-12',
    freshnessType: 'periodic',
    hasLevels: [1, 2],
    langs: ['fr'],
    aliases: { fr: [`c'est quoi le 49.3`, `49 3`, `quarante-neuf trois`, `article 49 alinéa 3`, `loi sans vote`] },
    load: () => import('./dico/institutions.js').then(m => m.TERMS['49-3']),
  },
  {
    slug: 'motion-de-censure',
    section: 'dico',
    categorie: 'institutions',
    type: 'definition',
    title: { fr: `La motion de censure`, en: 'Motion of no confidence' },
    hook: { fr: `Le vote qui peut faire tomber un gouvernement — comment ça marche, quand ça a réussi.` },
    icon: '🗳️',
    difficulty: 1,
    famille: 'intermediaire',
    updatedAt: '2026-07-12',
    lastReviewedAt: '2026-07-12',
    freshnessType: 'periodic',
    hasLevels: [1, 2],
    langs: ['fr'],
    aliases: { fr: [`c'est quoi une motion de censure`, `renverser le gouvernement`, `censure assemblée`] },
    load: () => import('./dico/institutions.js').then(m => m.TERMS['motion-de-censure']),
  },
  {
    slug: 'proportionnelle',
    section: 'dico',
    categorie: 'institutions',
    type: 'definition',
    title: { fr: `La proportionnelle`, en: 'Proportional representation' },
    hook: { fr: `20 % des voix, 20 % des sièges : le mode de scrutin dont la France débat depuis quarante ans.` },
    icon: '📊',
    difficulty: 1,
    famille: 'court',
    updatedAt: '2026-07-12',
    lastReviewedAt: '2026-07-12',
    freshnessType: 'periodic',
    hasLevels: [1, 2],
    langs: ['fr'],
    aliases: { fr: [`c'est quoi la proportionnelle`, `scrutin proportionnel`, `mode de scrutin`, `proportionnelle législatives`] },
    load: () => import('./dico/institutions.js').then(m => m.TERMS['proportionnelle']),
  },
  {
    slug: 'dette-publique',
    section: 'dico',
    categorie: 'economie',
    type: 'definition',
    title: { fr: `La dette publique`, en: 'Public debt' },
    hook: { fr: `Plus de 3 000 milliards d'euros : ce que c'est vraiment, et pourquoi les économistes ne sont pas d'accord.` },
    icon: '📉',
    difficulty: 1,
    famille: 'intermediaire',
    updatedAt: '2026-07-12',
    lastReviewedAt: '2026-07-12',
    freshnessType: 'live',
    hasLevels: [1, 2],
    langs: ['fr'],
    aliases: { fr: [`c'est quoi la dette publique`, `dette de la france`, `3000 milliards`, `dette et déficit`] },
    load: () => import('./dico/economie.js').then(m => m.TERMS['dette-publique']),
  },
  {
    slug: 'economie-de-marche',
    section: 'dico',
    categorie: 'economie',
    type: 'definition',
    title: { fr: `L'économie de marché`, en: 'Market economy' },
    hook: { fr: `Offre, demande, prix — et la vraie question politique : quelle place pour l'État ?` },
    icon: '🏪',
    difficulty: 1,
    famille: 'court',
    updatedAt: '2026-07-12',
    lastReviewedAt: '2026-07-12',
    freshnessType: 'stable',
    hasLevels: [1, 2],
    langs: ['fr'],
    aliases: { fr: [`économie de marché`, `capitalisme`, `marché et état`] },
    load: () => import('./dico/economie.js').then(m => m.TERMS['economie-de-marche']),
  },
];

/** Pages non encore publiées mais annoncées sur le hub (cartes « Bientôt »). */
export const UPCOMING = [
  { slug: 'gauche', section: 'familles', title: { fr: `La gauche` }, icon: '📕', hook: { fr: `Égalité, solidarité, services publics… et de nombreuses gauches. Le dossier complet.` } },
  { slug: 'centre', section: 'familles', title: { fr: `Le centre` }, icon: '📙', hook: { fr: `Ni neutre ni sans opinion : ce que veut dire être centriste.` } },
  { slug: 'president-de-la-republique', section: 'institutions', title: { fr: `Le président de la République` }, icon: '🏛️', hook: { fr: `Ce qu'il peut faire, ce qu'il ne peut pas faire — et pourquoi il a autant de pouvoir.` } },
  { slug: 'elections', section: 'bases', title: { fr: `Les élections` }, icon: '🗳️', hook: { fr: `Scrutins, tours, parrainages : comment la France vote.` } },
  { slug: 'partis', section: 'partis', title: { fr: `Les partis` }, icon: '🎪', hook: { fr: `Qui est qui : les principaux partis français, un par un.` } },
];

export function findEntry(section, slug) {
  return LEARN_MANIFEST.find(e => e.section === section && e.slug === slug) || null;
}

export function findBySlug(slug) {
  return LEARN_MANIFEST.find(e => e.slug === slug) || null;
}

/** Recherche naïve : normalise, ignore les préfixes de question, score titre + alias + hook. */
const QUESTION_PREFIXES = /^(c'est quoi|c est quoi|qu'est[- ]ce (que|qu'une?|qu'un)|pourquoi|comment|quelle? (différence|est la différence) entre|définition( de)?|explique[rz]?( moi)?)\s+/i;

function normalize(s) {
  return (s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[«»"'’,?!.]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function searchLearn(query, { limit = 6 } = {}) {
  const q = normalize(query).replace(QUESTION_PREFIXES, '').replace(/^(la |le |les |l |une? |des |du |de la )/, '').trim();
  if (q.length < 2) return [];
  const tokens = q.split(' ').filter(w => w.length > 1);
  const scored = LEARN_MANIFEST.map(entry => {
    const title = normalize(entry.title.fr);
    const aliases = (entry.aliases?.fr || []).map(normalize);
    const hook = normalize(entry.hook?.fr || '');
    let score = 0;
    if (title === q) score += 100;
    if (title.includes(q)) score += 50;
    if (aliases.some(a => a === q)) score += 90;
    if (aliases.some(a => a.includes(q) || q.includes(a))) score += 40;
    for (const tk of tokens) {
      if (title.includes(tk)) score += 12;
      if (aliases.some(a => a.includes(tk))) score += 8;
      if (hook.includes(tk)) score += 3;
    }
    return { entry, score };
  }).filter(r => r.score > 0);
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map(r => r.entry);
}
