// POLISCOP — Loader ESM transformant le JSX à la volée, pour des tests de RENDU réels.
//
// POURQUOI
// --------
// Le 4e contre-audit a montré qu'une suite entièrement verte peut coexister avec deux pages
// publiques blanches : `MatchCard.jsx` appelait `formatProximity()` sans l'importer, et aucun
// test ne rendait le composant. Les tests de terminologie ne faisaient que lire le source.
//
// Ce loader utilise `esbuild` — déjà présent comme dépendance de Vite, aucune installation —
// pour transformer `.jsx` en JavaScript exécutable sous `node --test`. Combiné à
// `react-dom/server`, il permet de RENDRE un composant et de constater une `ReferenceError`
// au lieu de la deviner.
//
// Il gère aussi les imports `.json` sans attribut (comme scripts/lib/json-import-loader.mjs)
// et neutralise les imports CSS, que Vite résout au build mais que Node ignore.

import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
// `transformSync` et non `transform` : le service esbuild asynchrone démarre un processus
// enfant qui ne se termine pas proprement depuis un worker de loader ESM — le runner restait
// bloqué indéfiniment.
import { transformSync } from 'esbuild';

export async function resolve(specifier, context, nextResolve) {
  if (specifier.endsWith('.json')) {
    const result = await nextResolve(specifier, context);
    return { ...result, importAttributes: { ...(context.importAttributes ?? {}), type: 'json' } };
  }
  if (specifier.endsWith('.css')) {
    // Les feuilles de style n'ont aucun sens côté serveur : on les remplace par un module vide.
    return { url: 'data:text/javascript,export default {}', shortCircuit: true, format: 'module' };
  }
  return nextResolve(specifier, context);
}

export async function load(url, context, nextLoad) {
  if (!url.endsWith('.jsx')) return nextLoad(url, context);

  const source = await readFile(fileURLToPath(url), 'utf8');
  const { code } = transformSync(source, {
    loader: 'jsx',
    format: 'esm',
    target: 'node20',
    jsx: 'automatic',
    // `import.meta.env` n'existe pas sous Node : les modules applicatifs y accèdent en
    // optionnel (`import.meta?.env?.…`), donc aucune substitution n'est nécessaire.
    sourcefile: url,
  });
  return { format: 'module', source: code, shortCircuit: true };
}
