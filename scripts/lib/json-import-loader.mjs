// POLISCOP — Loader ESM partagé (tests + scripts de contrôle).
//
// Pourquoi : `src/data/questions.js` fait `import raw from './questions_final.json'`
// sans attribut d'import. Vite/Rollup gèrent cet import nativement ; le ESM natif de
// Node (>= 20.10) exige `with { type: 'json' }` et lève ERR_IMPORT_ATTRIBUTE_MISSING.
// Ce loader ajoute l'attribut à la volée pour tout specifier `.json`, ce qui permet
// d'exécuter les moteurs applicatifs tels quels sous `node --test` sans toucher à src/.
//
// Usage :
//   import { register } from 'node:module';
//   register(new URL('../scripts/lib/json-import-loader.mjs', import.meta.url));
//   const { calculateProfile } = await import('../src/engine/scorer.js');
export async function resolve(specifier, context, nextResolve) {
  if (specifier.endsWith('.json')) {
    const result = await nextResolve(specifier, context);
    return { ...result, importAttributes: { ...(context.importAttributes ?? {}), type: 'json' } };
  }
  return nextResolve(specifier, context);
}
