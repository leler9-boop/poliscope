// POLISCOP — Test de fumée : chaque route publique doit RENDRE quelque chose.
//
// POURQUOI
// --------
// `/france` et `/figures` sont restées entièrement blanches alors que `npm test` était vert
// à 100 %. La cause — un identifiant utilisé sans import — ne se manifeste qu'au rendu.
// `npm run check:undef` (ESLint `no-undef`) attrape désormais cette cause précise ; ce test
// couvre l'EFFET, quelle qu'en soit la cause : composant qui lève, arbre vide, rendu blanc.
//
// Portée assumée : rendu serveur d'un seul passage, sans effets ni interactions. Ce n'est
// PAS un E2E — il ne remplace pas une vérification en navigateur et ne prétend pas le faire.
// Il garantit seulement qu'aucune route ne rend un écran vide au premier rendu.

import { test, before } from 'node:test';
import assert from 'node:assert/strict';

let h, renderToStaticMarkup, MemoryRouter, pages;

before(async () => {
  ({ createElement: h } = await import('react'));
  ({ renderToStaticMarkup } = await import('react-dom/server'));
  ({ MemoryRouter } = await import('react-router-dom'));

  // Import paresseux : une page qui échoue à l'import doit faire échouer SON cas, pas le fichier.
  pages = {
    '/':             () => import('../../src/pages/Landing.jsx'),
    '/test':         () => import('../../src/pages/SelectTest.jsx'),
    '/priorities':   () => import('../../src/pages/PriorityRanking.jsx'),
    '/elections':    () => import('../../src/pages/Elections.jsx'),
    '/figures':      () => import('../../src/pages/HistoricalFigures.jsx'),
    '/france':       () => import('../../src/pages/FrenchFigures.jsx'),
    '/mission':      () => import('../../src/pages/Mission.jsx'),
    '/transparency': () => import('../../src/pages/Transparency.jsx'),
    '/learn':        () => import('../../src/pages/LearnHub.jsx'),
    '/learn/dico':   () => import('../../src/pages/LearnDico.jsx'),
    '/privacy':      () => import('../../src/pages/Privacy.jsx'),
    '/terms':        () => import('../../src/pages/Terms.jsx'),
  };
});

for (const route of ['/', '/test', '/priorities', '/elections', '/figures', '/france',
                     '/mission', '/transparency', '/learn', '/learn/dico', '/privacy', '/terms']) {
  test(`la route ${route} rend un écran non vide`, async () => {
    const mod = await pages[route]();
    const Page = mod.default;
    assert.equal(typeof Page, 'function', `${route} : export par défaut absent ou non composant`);

    let html;
    try {
      html = renderToStaticMarkup(h(MemoryRouter, { initialEntries: [route] }, h(Page)));
    } catch (err) {
      // Le message brut est la seule information utile : `formatProximity is not defined`
      // était exactement l'erreur qui laissait les pages blanches en production.
      assert.fail(`${route} lève au rendu : ${err.message}`);
    }

    const texte = html.replace(/<[^>]*>/g, '').trim();
    assert.ok(texte.length > 40,
      `${route} rend un écran quasi vide (${texte.length} caractères de texte) — écran blanc probable`);
  });
}
