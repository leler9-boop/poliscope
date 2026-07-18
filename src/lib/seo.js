/**
 * SEO runtime — met à jour title / description / canonical / Open Graph lors des
 * navigations client (les crawlers qui exécutent le JS, dont Google, les voient).
 * Le premier rendu de chaque URL est servi pré-rendu par scripts/generate-seo.mjs.
 */

export const SITE_URL = 'https://poliscop.org';

const DEFAULT_TITLE = `Test politique gratuit : quel courant vous correspond ? | Poliscop`;
const DEFAULT_DESC = `Découvrez quel parti ou courant politique correspond vraiment à vos idées : test approfondi sur 8 thèmes, comparaison avec candidats et figures historiques — et la politique expliquée simplement.`;

function upsertMeta(attr, key, content) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertLink(rel, href) {
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

/** Applique les métadonnées de la page courante. path = chemin absolu ('/learn/…'). */
export function setPageMeta({ title, description, path } = {}) {
  const t = title || DEFAULT_TITLE;
  const d = (description || DEFAULT_DESC).slice(0, 160);
  const url = SITE_URL + (path || window.location.pathname);
  document.title = t;
  upsertMeta('name', 'description', d);
  upsertMeta('property', 'og:title', t);
  upsertMeta('property', 'og:description', d);
  upsertMeta('property', 'og:url', url);
  upsertMeta('name', 'twitter:title', t);
  upsertMeta('name', 'twitter:description', d);
  upsertLink('canonical', url);
}

/** Gabarits de titres par type de fiche (cohérents avec generate-seo.mjs). */
export function ficheTitle(entry) {
  const t = entry.title.fr;
  switch (entry.type) {
    case 'president': return `${t} : bilan, mesures, dates — sa présidence expliquée | Poliscop`;
    case 'debat': return `${t} : comprendre le débat simplement | Poliscop`;
    case 'ideologie': return `${t} : définition, histoire, courants | Poliscop`;
    case 'institution': return `${t} : rôle, pouvoirs, fonctionnement | Poliscop`;
    case 'definition': return `${t} : définition simple et complète | Poliscop`;
    default: return `${t} — expliqué simplement | Poliscop`;
  }
}
