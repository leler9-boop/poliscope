// Poliscope — audit QA — loader partage par les 4 scripts de test de ce dossier.
//
// Pourquoi ce fichier existe :
//   src/data/questions.js fait `import rawQuestions from './questions_final.json';`
//   sans attribut d'import (`with { type: 'json' }`). Vite gere cet import nativement au
//   build, mais le ESM natif de Node.js (>=20.10 / >=22) exige cet attribut et leve
//   ERR_IMPORT_ATTRIBUTE_MISSING sans lui. Comme la consigne d'audit interdit de modifier
//   tout fichier hors de proposed-tests/, ce loader intercepte la resolution des imports
//   `.json` et leur assigne l'attribut `type: "json"` a la volee. Cela permet d'executer
//   les moteurs (scorer.js / matcher.js) tels quels avec un simple `node <script>.mjs`,
//   sans flag CLI ni modification de src/.
//
// Utilisation dans un script de test (voir test1..test4) :
//   import { register } from 'node:module';
//   register('./_json-import-loader.mjs', import.meta.url);
//   const { calculateProfile } = await import('../../../src/engine/scorer.js');
export async function resolve(specifier, context, nextResolve) {
  if (specifier.endsWith('.json')) {
    const result = await nextResolve(specifier, context);
    return { ...result, importAttributes: { ...(context.importAttributes ?? {}), type: 'json' } };
  }
  return nextResolve(specifier, context);
}
