#!/usr/bin/env node
/**
 * generate-seo.mjs — pré-rendu SEO/IA post-build (npm run build l'exécute).
 *
 * Pour chaque fiche du manifeste + les pages learn statiques, génère
 * dist/<route>/index.html à partir du template dist/index.html avec :
 *   - <title>, meta description, canonical, Open Graph par page ;
 *   - JSON-LD : Article + BreadcrumbList + FAQPage (à partir des vrai/faux) ;
 *   - le CONTENU RÉEL (N1, N2, N3, sources, liens internes) injecté dans #root —
 *     lisible par Google et par les crawlers d'IA (GPTBot, ClaudeBot…) qui
 *     n'exécutent pas le JavaScript ; React remplace ce contenu au chargement.
 * Génère aussi dist/sitemap.xml.
 *
 * Vercel sert les fichiers du filesystem avant le rewrite SPA : ces pages
 * statiques priment donc sur index.html pour leurs URL exactes.
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const DIST = join(ROOT, 'dist');
const SITE = 'https://poliscop.org';

const { LEARN_MANIFEST, SECTIONS } = await import('../src/content/learn/manifest.js');
const { VRAIFAUX_BANK, VERDICT_LABELS } = await import('../src/content/learn/vraifaux/bank.js');

const template = readFileSync(join(DIST, 'index.html'), 'utf8');

/* ── helpers ─────────────────────────────────────────────────────────────── */

const esc = (s) => String(s ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const ficheTitle = (e) => {
  const t = e.title.fr;
  switch (e.type) {
    case 'president': return `${t} : bilan, mesures, dates — sa présidence expliquée | Poliscop`;
    case 'debat': return `${t} : comprendre le débat simplement | Poliscop`;
    case 'ideologie': return `${t} : définition, histoire, courants | Poliscop`;
    case 'institution': return `${t} : rôle, pouvoirs, fonctionnement | Poliscop`;
    case 'definition': return `${t} : définition simple et complète | Poliscop`;
    default: return `${t} — expliqué simplement | Poliscop`;
  }
};

function paragraphs(text) {
  return String(text || '').split('\n\n').map(p => `<p>${esc(p)}</p>`).join('\n');
}

function sectionHtml(s, tag = 'h2') {
  let body = '';
  if (s.corps?.fr) body = paragraphs(s.corps.fr);
  else if (s.termes) body = s.termes.map(t => `<p><strong>${esc(t.nom?.fr)}</strong> — ${esc(t.def?.fr)}</p>`).join('\n');
  else if (s.rows) body = s.rows.map(r => `<p><strong>${esc(r.pays?.fr)} (${esc(r.valeur)})</strong> — ${esc(r.desc?.fr)}</p>`).join('\n');
  else if (s.visions) body = s.visions.map(v => `<p><strong>${esc(v.label?.fr)}</strong> — ${esc(v.corps?.fr)}</p>`).join('\n');
  const srcs = (s.sources || []).map(x => x.label).join(' · ');
  return `<section>\n<${tag}>${esc(s.titre?.fr)}</${tag}>\n${body}${srcs ? `\n<p><em>Source : ${esc(srcs)}</em></p>` : ''}\n</section>`;
}

/** Remplace la balise si elle existe dans le template, sinon l'injecte avant </head>. */
function upsert(html, regex, tag) {
  if (regex.test(html)) return html.replace(regex, tag);
  return html.replace('</head>', `    ${tag}\n  </head>`);
}

/** Remplace head + #root du template. */
function renderPage({ path, title, description, ogType, jsonLd, bodyHtml }) {
  const url = SITE + path;
  let html = template;

  html = upsert(html, /<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`);
  html = upsert(html, /<meta name="description" content="[^"]*"\s*\/>/, `<meta name="description" content="${esc(description)}" />`);
  html = upsert(html, /<link rel="canonical" href="[^"]*"\s*\/>/, `<link rel="canonical" href="${url}" />`);
  html = upsert(html, /<meta property="og:title" content="[^"]*"\s*\/>/, `<meta property="og:title" content="${esc(title)}" />`);
  html = upsert(html, /<meta property="og:description" content="[^"]*"\s*\/>/, `<meta property="og:description" content="${esc(description)}" />`);
  html = upsert(html, /<meta property="og:type" content="[^"]*"\s*\/>/, `<meta property="og:type" content="${ogType}" />`);
  html = upsert(html, /<meta property="og:url" content="[^"]*"\s*\/>/, `<meta property="og:url" content="${url}" />`);
  html = upsert(html, /<meta name="twitter:title" content="[^"]*"\s*\/>/, `<meta name="twitter:title" content="${esc(title)}" />`);
  html = upsert(html, /<meta name="twitter:description" content="[^"]*"\s*\/>/, `<meta name="twitter:description" content="${esc(description)}" />`);
  // JSON-LD supplémentaire (on garde le bloc Organization/WebSite du template)
  if (jsonLd) {
    html = html.replace('</head>', `<script type="application/ld+json">\n${JSON.stringify(jsonLd)}\n</script>\n</head>`);
  }
  // contenu statique dans #root (remplacé par React au chargement)
  html = html.replace('<div id="root"></div>', `<div id="root">${bodyHtml}</div>`);

  const dir = join(DIST, ...path.split('/').filter(Boolean));
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), html);
  return url;
}

/* ── pages fiches ────────────────────────────────────────────────────────── */

const wrap = (inner) => `
<div class="max-w-2xl mx-auto px-4 sm:px-6 py-10">
<nav><a href="/learn">J'y connais rien</a> › <a href="/learn/academy">Poliscop Academy</a></nav>
${inner}
<footer><p><a href="/learn">← Toutes les fiches « J'y connais rien »</a> · <a href="/test">Faire le test politique Poliscop</a></p>
<p>Poliscop — outil analytique et éducatif. Pas une recommandation de vote.</p></footer>
</div>`;

const urls = [];

for (const e of LEARN_MANIFEST) {
  const content = await e.load();
  const path = `/learn/${e.section}/${e.slug}`;
  const title = ficheTitle(e);
  const description = (e.hook?.fr || '').slice(0, 158);

  const vfItems = (content.vraiFaux || []).map(id => VRAIFAUX_BANK[id]).filter(Boolean);

  const inner = [
    `<article>`,
    `<p>${esc(SECTIONS[e.section]?.fr || '')}</p>`,
    `<h1>${esc(e.title.fr)}</h1>`,
    `<p><em>Dernière vérification factuelle : ${esc(content.freshness?.lastReviewedAt || e.lastReviewedAt)}</em></p>`,
    `<section><h2>En 20 secondes</h2>${paragraphs(content.level1?.fr)}</section>`,
    ...(content.level2?.sections || []).map(s => sectionHtml(s, 'h2')),
    ...(content.level3?.sections || []).map(s => sectionHtml(s, 'h2')),
    ...(content.chronologie ? [`<section><h2>${esc(content.chronologie.titre?.fr || 'Chronologie')}</h2>${
      content.chronologie.events.map(ev => `<p><strong>${esc(ev.date)}</strong> — ${esc(ev.titre?.fr)} : ${esc(ev.detail?.fr)}</p>`).join('\n')
    }</section>`] : []),
    ...(vfItems.length ? [`<section><h2>Idées reçues : vrai ou faux ?</h2>${
      vfItems.map(it => `<p><strong>« ${esc(it.enonce?.fr)} »</strong> — ${esc(VERDICT_LABELS[it.verdict]?.fr)}. ${esc(it.explication?.fr)}</p>`).join('\n')
    }</section>`] : []),
    ...(content.sources?.length ? [`<section><h2>Sources</h2><ul>${
      content.sources.map(x => `<li>${x.url ? `<a href="${esc(x.url)}" rel="noopener">${esc(x.label)}</a>` : esc(x.label)}</li>`).join('')
    }</ul></section>`] : []),
    // maillage interne : fiches liées résolues via le manifeste
    (() => {
      const refs = [...(content.continuerAvec || []), ...(content.motsAssocies || [])]
        .map(r => (typeof r === 'string' ? r : r.slug)).filter(Boolean);
      const links = [...new Set(refs)]
        .map(slug => LEARN_MANIFEST.find(x => x.slug === slug))
        .filter(Boolean)
        .map(x => `<li><a href="/learn/${x.section}/${x.slug}">${esc(x.title.fr)}</a> — ${esc(x.hook?.fr || '')}</li>`);
      return links.length ? `<section><h2>À lire ensuite sur Poliscop</h2><ul>${links.join('')}</ul></section>` : '';
    })(),
    `</article>`,
  ].join('\n');

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': `${SITE}${path}#article`,
        headline: e.title.fr,
        description,
        inLanguage: 'fr',
        dateModified: content.updatedAt,
        author: { '@id': `${SITE}/#org` },
        publisher: { '@id': `${SITE}/#org` },
        mainEntityOfPage: `${SITE}${path}`,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: `J'y connais rien`, item: `${SITE}/learn` },
          { '@type': 'ListItem', position: 2, name: SECTIONS[e.section]?.fr || e.section, item: `${SITE}/learn/academy` },
          { '@type': 'ListItem', position: 3, name: e.title.fr, item: `${SITE}${path}` },
        ],
      },
      ...(vfItems.length ? [{
        '@type': 'FAQPage',
        mainEntity: vfItems.map(it => ({
          '@type': 'Question',
          name: it.enonce?.fr,
          acceptedAnswer: { '@type': 'Answer', text: `${VERDICT_LABELS[it.verdict]?.fr}. ${it.explication?.fr}` },
        })),
      }] : []),
    ],
  };

  urls.push({ url: renderPage({ path, title, description, ogType: 'article', jsonLd, bodyHtml: wrap(inner) }), lastmod: content.updatedAt, priority: 0.8 });
}

/* ── pages d'index learn ─────────────────────────────────────────────────── */

const ficheLinks = LEARN_MANIFEST.filter(e => e.searchable !== false)
  .map(e => `<li><a href="/learn/${e.section}/${e.slug}">${esc(e.title.fr)}</a> — ${esc(e.hook?.fr || '')}</li>`).join('\n');

urls.push({
  url: renderPage({
    path: '/learn',
    title: `J'y connais rien — la politique expliquée simplement | Poliscop`,
    description: `Comprendre la politique sans jargon : chaque sujet en 20 secondes, 3 minutes ou en profondeur. Gauche, droite, institutions, immigration, laïcité — expliqués simplement et sourcés.`,
    ogType: 'website',
    bodyHtml: wrap(`<h1>J'y connais rien — la politique expliquée simplement</h1>
<p>La politique expliquée simplement, sans vous prendre pour un idiot. Chaque sujet en 20 secondes, en 3 minutes, ou en profondeur — avec sources officielles et dates de vérification.</p>
<h2>Toutes les fiches</h2><ul>${ficheLinks}</ul>`),
  }), lastmod: '2026-07-12', priority: 0.9,
});

urls.push({
  url: renderPage({
    path: '/learn/academy',
    title: `Poliscop Academy — les grands dossiers de la politique française`,
    description: `Familles politiques, grands débats, institutions, les 8 présidents de la Ve République : des dossiers complets, sourcés et vérifiés, du résumé au niveau expert.`,
    ogType: 'website',
    bodyHtml: wrap(`<h1>Poliscop Academy</h1>
<p>Les grands dossiers de la politique française : fiches complètes, histoire, comparaisons, chronologies — tout est sourcé, daté et vérifié.</p>
<h2>Les dossiers</h2><ul>${ficheLinks}</ul>`),
  }), lastmod: '2026-07-12', priority: 0.9,
});

const dicoLinks = LEARN_MANIFEST.filter(e => e.type === 'definition')
  .map(e => `<li><a href="/learn/${e.section}/${e.slug}">${esc(e.title.fr)}</a> — ${esc(e.hook?.fr || '')}</li>`).join('\n');
urls.push({
  url: renderPage({
    path: '/learn/dico',
    title: `Dictionnaire politique — chaque mot expliqué simplement | Poliscop`,
    description: `OQTF, 49.3, motion de censure, dette publique, proportionnelle… chaque mot du débat politique français expliqué en trois niveaux, avec sources officielles.`,
    ogType: 'website',
    bodyHtml: wrap(`<h1>Le dictionnaire politique</h1><ul>${dicoLinks}</ul>`),
  }), lastmod: '2026-07-12', priority: 0.7,
});

/* ── sitemap ─────────────────────────────────────────────────────────────── */

const staticUrls = [
  { url: `${SITE}/`, priority: 1.0 },
  { url: `${SITE}/test`, priority: 1.0 },
  { url: `${SITE}/mission`, priority: 0.5 },
  { url: `${SITE}/transparency`, priority: 0.5 },
  { url: `${SITE}/elections`, priority: 0.6 },
  { url: `${SITE}/figures`, priority: 0.5 },
  { url: `${SITE}/france`, priority: 0.5 },
];

const all = [...staticUrls, ...urls];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${all.map(u => `  <url><loc>${u.url}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}<priority>${u.priority ?? 0.5}</priority></url>`).join('\n')}
</urlset>
`;
writeFileSync(join(DIST, 'sitemap.xml'), sitemap);

console.log(`✓ generate-seo : ${urls.length} pages pré-rendues + sitemap.xml (${all.length} URL).`);
