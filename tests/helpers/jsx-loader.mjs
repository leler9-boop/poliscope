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

  const chemin = fileURLToPath(url);
  const source = await readFile(chemin, 'utf8');

  // ⚠ UN MODULE VIDE EST UN ÉCHEC, PAS UN MODULE.
  //
  // Sur ce poste, plusieurs fichiers SUIVIS PAR GIT se lisent à zéro octet depuis Node alors
  // que `ls` annonce leur taille et que `git show HEAD:…` rend leur contenu complet : le
  // dossier est synchronisé dans le nuage et le contenu peut être évincé (fichier
  // « dataless »). Un `cat` le rematérialise. Constaté le 2026-08-14 sur trois migrations.
  //
  // Laissé passer, un module vide n'exporte rien : le `default` importé vaut `undefined`, le
  // rendu échoue en aval — ou l'import reste suspendu, et le runner annule le fichier entier
  // avec `Promise resolution is still pending but the event loop has already resolved`. C'est
  // le symptôme exact qui rendait `npm run verify` non terminant. Mieux vaut une erreur qui
  // nomme la cause qu'un fichier de test annulé sans explication.
  if (source.length === 0) {
    throw new Error(
      `[poliscop/tests] Module lu VIDE : ${chemin}\n`
      + 'Le fichier existe mais son contenu n’est pas matérialisé sur ce poste (synchronisation '
      + 'dans le nuage). Rematérialiser avant de relancer :\n'
      + '  find src scripts supabase tests -type f -exec cat {} + > /dev/null',
    );
  }

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
