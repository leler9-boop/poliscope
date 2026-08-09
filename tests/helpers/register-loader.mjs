// Chargé via `node --import ./tests/helpers/register-loader.mjs` (voir package.json).
//
// Deux capacités, indispensables pour exécuter les modules applicatifs tels quels :
//  1. `import x from './y.json'` sans attribut d'import (json-import-loader) ;
//  2. transformation du JSX à la volée (jsx-loader), sans quoi `tests/ui/**` — les seuls
//     tests qui RENDENT réellement des composants — ne pourrait pas tourner sous `npm test`.
//     Sans cela, un test de rendu vert en local resterait invisible en CI, ce qui est
//     exactement le trou par lequel deux pages publiques blanches sont passées.
import { register } from 'node:module';
register(new URL('../../scripts/lib/json-import-loader.mjs', import.meta.url));
register(new URL('./jsx-loader.mjs', import.meta.url));
