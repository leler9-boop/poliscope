// Chargé via `node --import ./tests/helpers/register-loader.mjs` (voir package.json).
//
// Trois capacités, indispensables pour exécuter les modules applicatifs tels quels :
//  1. `import x from './y.json'` sans attribut d'import (json-import-loader) ;
//  2. transformation du JSX à la volée (jsx-loader), sans quoi `tests/ui/**` — les seuls
//     tests qui RENDENT réellement des composants — ne pourrait pas tourner sous `npm test`.
//     Sans cela, un test de rendu vert en local resterait invisible en CI, ce qui est
//     exactement le trou par lequel deux pages publiques blanches sont passées.
//  3. interdiction de tout appel réseau réel (no-network), pour qu'un transport non simulé
//     échoue immédiatement au lieu de suspendre la suite. Voir `no-network.mjs`.
import { register } from 'node:module';
import './no-network.mjs';
register(new URL('../../scripts/lib/json-import-loader.mjs', import.meta.url));
register(new URL('./jsx-loader.mjs', import.meta.url));
