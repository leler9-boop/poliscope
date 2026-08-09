// Chargé via `node --import ./tests/helpers/register-jsx.mjs`.
// Ajoute la transformation JSX (esbuild) aux imports JSON déjà gérés — voir jsx-loader.mjs.
import { register } from 'node:module';
register(new URL('./jsx-loader.mjs', import.meta.url));
