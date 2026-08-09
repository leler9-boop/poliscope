// POLISCOP — Tests de RENDU réels (react-dom/server), pas d'analyse statique.
//
// CE QUE CES TESTS AURAIENT ATTRAPÉ
// ---------------------------------
// Le 4e contre-audit a trouvé `/france` et `/figures` entièrement blanches alors que
// 181 tests passaient : `MatchCard.jsx` appelait `formatProximity()` sans l'importer.
// Erreur navigateur exacte :
//
//     ReferenceError: formatProximity is not defined
//         at MatchCard (src/components/MatchCard.jsx:22:3)
//         at FrenchFigures (src/pages/FrenchFigures.jsx:532:20)
//
// Les tests existants lisaient le source avec des expressions régulières : ils ne pouvaient
// pas voir une référence non importée. Ceux-ci RENDENT les composants.
//
// Le fichier est en `.mjs` sans JSX (`createElement`) : le runner de Node ne ramasse que les
// extensions qu'il connaît, et seules les SOURCES ont besoin d'être transformées — ce que
// fait `tests/helpers/jsx-loader.mjs` via esbuild.

import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

let h, renderToStaticMarkup, MemoryRouter, Routes, Route, MatchCard, ProfileReveal, CandidateProfile, ElectionDetail,
  formatProximity, scoreToCssPercent;

before(async () => {
  ({ createElement: h } = await import('react'));
  ({ renderToStaticMarkup } = await import('react-dom/server'));
  ({ MemoryRouter, Routes, Route } = await import('react-router-dom'));
  MatchCard     = (await import('../../src/components/MatchCard.jsx')).default;
  ProfileReveal = (await import('../../src/components/ProfileReveal.jsx')).default;
  CandidateProfile = (await import('../../src/pages/CandidateProfile.jsx')).default;
  ElectionDetail = (await import('../../src/pages/ElectionDetail.jsx')).default;
  ({ formatProximity, scoreToCssPercent } = await import('../../src/engine/scoreDisplay.js'));
});

const figure = {
  id: 'test-figure',
  name: 'Figure de test',
  alignment: 67,
  color: '#2563eb',
  role: { fr: 'Rôle', en: 'Role' },
  era: { fr: 'Époque', en: 'Era' },
  description: { fr: 'Description', en: 'Description' },
  profile: {},
};

const archetype = {
  id: 'a', name: { fr: 'Archétype', en: 'Archetype' },
  color: '#2563eb', traits: { fr: [], en: [] },
};

// ─── Rendu ───────────────────────────────────────────────────────────────────

test('MatchCard se rend sans ReferenceError', () => {
  // Le défaut exact : un identifiant utilisé sans import. Seul un rendu le révèle.
  const html = renderToStaticMarkup(h(MatchCard, { target: figure, rank: 1, language: 'fr' }));
  assert.ok(html.length > 0, 'MatchCard n’a produit aucun balisage');
  assert.ok(html.includes('Figure de test'), 'le nom de la figure devrait apparaître');
});

test('MatchCard affiche le score en /100, jamais suffixé d’un %', () => {
  const html = renderToStaticMarkup(h(MatchCard, { target: figure, rank: 1, language: 'fr' }));
  assert.ok(html.includes('67/100'), 'le score texte doit être « 67/100 »');
});

// ─── Géométrie : une largeur CSS reste un pourcentage ────────────────────────

test('scoreToCssPercent produit une largeur CSS valide et bornée', () => {
  assert.equal(scoreToCssPercent(67), '67%');
  assert.equal(scoreToCssPercent(0), '0%');
  assert.equal(scoreToCssPercent(100), '100%');
  // Valeurs aberrantes : jamais de CSS invalide, jamais de débordement.
  assert.equal(scoreToCssPercent(-10), '0%');
  assert.equal(scoreToCssPercent(140), '100%');
  assert.equal(scoreToCssPercent(null), '0%');
  assert.equal(scoreToCssPercent(undefined), '0%');
  assert.equal(scoreToCssPercent(NaN), '0%');
  assert.equal(scoreToCssPercent(66.6), '67%');
});

test('les deux contrats sont bien distincts', () => {
  assert.equal(formatProximity(67), '67/100');
  assert.equal(scoreToCssPercent(67), '67%');
});

test('aucune largeur CSS du produit n’est alimentée par formatProximity', () => {
  // `width: ${formatProximity(x)}` produisait « 67/100 » : la barre disparaissait.
  const root = fileURLToPath(new URL('../../src', import.meta.url));
  const files = [];
  (function walk(dir) {
    for (const name of readdirSync(dir)) {
      const p = join(dir, name);
      if (statSync(p).isDirectory()) walk(p);
      // `scoreDisplay.js` DÉFINIT les deux contrats : son commentaire cite le motif fautif.
      else if (/\.jsx?$/.test(name) && !p.endsWith('scoreDisplay.js')) files.push(p);
    }
  })(root);

  const offenders = [];
  for (const f of files) {
    readFileSync(f, 'utf8').split('\n').forEach((line, i) => {
      if (/width:\s*`?\$\{[^}]*formatProximity/.test(line)) {
        offenders.push(`${f.replace(root, 'src')}:${i + 1}`);
      }
    });
  }
  assert.deepEqual(offenders, [],
    `largeur CSS alimentée par formatProximity (produit « 67/100 ») : ${offenders.join(', ')}`);
});

// ─── ProfileReveal sans candidat ─────────────────────────────────────────────

test('ProfileReveal sans candidat ne promet aucun « meilleur match »', () => {
  // Constat navigateur : la modale affichait « Voir mon meilleur match 2027 → » puis
  // « Votre meilleur match 2027 — Aucun candidat disponible. »
  const html = renderToStaticMarkup(h(ProfileReveal, {
    themes: { ECONOMY: 60 }, topArchetype: archetype, topCandidate: null,
    language: 'fr', answeredCount: 15, onClose: () => {},
  }));
  assert.ok(!/meilleur match/i.test(html),
    'la modale promet un meilleur match alors qu’aucun candidat n’est comparable');
  assert.ok(!/best .{0,6}match/i.test(html));
});

// ─── Fiches 2027 : le registre sourcé doit être la source de vérité ─────────

test('une candidature 2027 suivie hors des dix anciennes fiches possède une page factuelle', () => {
  const html = renderToStaticMarkup(h(MemoryRouter, { initialEntries: ['/candidates/david-lisnard'] },
    h(Routes, null, h(Route, { path: '/candidates/:id', element: h(CandidateProfile) }))));

  assert.match(html, /David Lisnard/);
  assert.match(html, /Nouvelle Énergie/);
  assert.match(html, /Candidature déclarée/);
  assert.match(html, /Programme officiel partiel/);
  assert.match(html, /unenouvelleenergie\.fr/);
  assert.match(html, /x\.com\/BFMTV/);
  assert.match(html, /11\/17 positions codées/);
  assert.match(html, /0\/17 positions validées/);
  assert.match(html, /relecture indépendante/);
});

test('une fiche 2027 ne republie pas les anciennes positions éditoriales non sourcées', () => {
  const html = renderToStaticMarkup(h(MemoryRouter, { initialEntries: ['/candidates/roussel_2027'] },
    h(Routes, null, h(Route, { path: '/candidates/:id', element: h(CandidateProfile) }))));

  assert.match(html, /Parti Communiste Français/);
  assert.doesNotMatch(html, /Positions clés/);
  assert.doesNotMatch(html, /Fortement pro-immigration/);
  assert.match(html, /Sources vérifiées/);
});

test('la page 2027 expose l’annuaire complet sans le présenter comme une liste officielle', () => {
  const html = renderToStaticMarkup(h(MemoryRouter, { initialEntries: ['/elections/fr_2027'] },
    h(Routes, null, h(Route, { path: '/elections/:id', element: h(ElectionDetail) }))));

  assert.match(html, /Annuaire présidentiel 2027/);
  assert.match(html, /37 profils suivis/);
  assert.match(html, /17 déclarés ou investis/);
  assert.match(html, /n’est pas la liste officielle du premier tour/);
  assert.match(html, /Candidatures déclarées ou investies/);
  assert.match(html, /Parti Communiste Français/);
  assert.match(html, /David Lisnard/);
  assert.match(html, /Jordan Bardella/);
  assert.match(html, /Pressenti — non déclaré/);
  assert.match(html, /Candidature conditionnelle/);
});

// ─── Garde-fou générique : toute fonction d'un module engine doit être importée ──
//
// Deux fois de suite, la même classe de bug a produit une page blanche : un identifiant
// utilisé sans import (`formatProximity`, puis `scoreToCssPercent`). Vite ne le détecte pas
// au build, et un test de rendu ne couvre que les composants qu'il rend explicitement.
// Ce contrôle balaie TOUT `src/` et vérifie, pour chaque symbole exporté par les modules
// `src/engine/*.js`, que tout fichier qui l'utilise l'importe bien.

test('aucun symbole de src/engine n’est utilisé sans import', () => {
  const src = fileURLToPath(new URL('../../src', import.meta.url));
  const engineDir = join(src, 'engine');

  // Symboles exportés par les modules moteur.
  const exported = new Set();
  for (const name of readdirSync(engineDir)) {
    if (!name.endsWith('.js')) continue;
    const text = readFileSync(join(engineDir, name), 'utf8');
    for (const m of text.matchAll(/export\s+(?:async\s+)?function\s+([A-Za-z_$][\w$]*)/g)) exported.add(m[1]);
    for (const m of text.matchAll(/export\s+(?:const|let)\s+([A-Za-z_$][\w$]*)/g)) exported.add(m[1]);
  }
  assert.ok(exported.size > 5, 'aucun symbole moteur détecté — le balayage est cassé');

  const files = [];
  (function walk(dir) {
    for (const name of readdirSync(dir)) {
      const p = join(dir, name);
      if (statSync(p).isDirectory()) walk(p);
      else if (/\.jsx?$/.test(name) && !p.startsWith(engineDir)) files.push(p);
    }
  })(src);

  // Les commentaires sont retirés : documenter « `computeCandidateMatch()` fait X » ne doit
  // pas être confondu avec un appel. Seul le code exécuté est contrôlé.
  const stripComments = t => t
    .replace(/\/\*[\s\S]*?\*\//g, m => m.replace(/[^\n]/g, ' '))
    .replace(/(^|[^:])\/\/[^\n]*/g, (m, p1) => p1 + ' '.repeat(m.length - p1.length));

  const offenders = [];
  for (const f of files) {
    const text = stripComments(readFileSync(f, 'utf8'));
    // Symboles importés dans ce fichier (toutes provenances), y compris sous alias.
    const imported = new Set();
    for (const m of text.matchAll(/import\s*\{([^}]*)\}\s*from/g)) {
      for (const part of m[1].split(',')) {
        const [orig, alias] = part.split(/\s+as\s+/).map(x => x.trim());
        imported.add(alias || orig);
        imported.add(orig);
      }
    }
    // Déclarations locales du même nom (fonction ou const) : pas un import manquant.
    for (const m of text.matchAll(/(?:function|const|let)\s+([A-Za-z_$][\w$]*)/g)) imported.add(m[1]);

    for (const symbol of exported) {
      const used = new RegExp(`(^|[^.\\w$])${symbol}\\s*\\(`, 'm').test(text);
      if (used && !imported.has(symbol)) {
        offenders.push(`${f.replace(src, 'src')} → ${symbol}`);
      }
    }
  }
  assert.deepEqual(offenders, [],
    `symbole moteur utilisé sans import (ReferenceError au rendu, page blanche) : ${offenders.join(', ')}`);
});

// ─── La géométrie d'une barre ne doit jamais dépendre d'une animation ────────────
//
// `MatchCard` définissait la largeur de la barre par `initial={{width:'0%'}}` +
// `animate={{width:...}}`. Sans frame d'animation — onglet en arrière-plan (aucun rAF),
// `prefers-reduced-motion`, capture avant le premier rendu animé — la barre restait à 0 px
// alors que le score affiché était juste. Constaté en navigateur : `visibilityState:"hidden"`,
// `document.getAnimations().length === 0`, `getBoundingClientRect().width === 0`.
// La largeur doit être une fonction de la donnée, pas un état d'animation.

test('MatchCard rend une barre proportionnelle sans animation', () => {
  const html = renderToStaticMarkup(h(MatchCard, {
    target: { name: 'Test', color: '#123456', alignment: 67 }, language: 'fr',
  }));
  const barre = html.match(/class="h-full rounded-full"[^>]*style="([^"]*)"/);
  assert.ok(barre, 'barre de progression introuvable dans le rendu statique');
  assert.match(barre[1], /width:\s*67%/,
    'la largeur doit être présente dès le rendu initial, pas produite par une animation');
});

test('MatchCard borne la largeur des scores hors domaine', () => {
  for (const [entree, attendu] of [[140, '100%'], [-10, '0%'], [null, '0%']]) {
    const html = renderToStaticMarkup(h(MatchCard, {
      target: { name: 'Test', alignment: entree }, language: 'fr',
    }));
    const barre = html.match(/class="h-full rounded-full"[^>]*style="([^"]*)"/);
    assert.match(barre[1], new RegExp(`width:\\s*${attendu.replace('%', '%')}`),
      `alignment=${entree} doit produire width:${attendu}`);
  }
});
