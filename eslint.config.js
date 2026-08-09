// POLISCOP — Configuration ESLint minimale, ciblée sur UNE classe de défaut.
//
// POURQUOI CE FICHIER EXISTE
// --------------------------
// Trois fois de suite, le même bug a produit une page publique entièrement blanche :
// un identifiant utilisé sans être importé.
//
//   1. `MatchCard.jsx`          → `formatProximity`   → `/france` et `/figures` blanches
//   2. `FrenchFigures.jsx`,
//      `HistoricalFigures.jsx`,
//      `Profile.jsx`            → `scoreToCssPercent` → mêmes pages, à nouveau blanches
//   3. `ProfileShareModal.jsx`  → `formatProximity`,
//                                 `coverageLabel`     → plantage du modal de partage
//
// Vite ne signale rien : une référence libre est du JavaScript valide au build, et
// l'erreur ne survient qu'à l'exécution, au moment du rendu. La suite de tests était
// verte à 100 % pendant que deux pages publiques ne s'affichaient pas.
//
// `no-undef` est la seule règle qui attrape cette classe mécaniquement, sur TOUT le
// code, sans dépendre d'un test qui penserait à rendre le bon composant.
// Volontairement minimal : aucune règle de style, aucun avis sur le formatage.
// L'objectif n'est pas d'imposer des conventions, c'est d'empêcher un écran blanc.

import globals from 'globals';

// Le code porte déjà des `// eslint-disable-next-line react-hooks/exhaustive-deps`.
// Sans définition, ESLint échoue sur « Definition for rule was not found » — ce qui ferait
// tomber `npm run verify` pour une raison sans rapport avec les écrans blancs.
// On déclare donc des règles inertes : les directives se résolvent, rien n'est signalé.
// Installer `eslint-plugin-react-hooks` est un autre chantier, avec ses propres arbitrages.
const reactHooksStub = {
  rules: {
    'exhaustive-deps': { create: () => ({}) },
    'rules-of-hooks': { create: () => ({}) },
  },
};

export default [
  {
    // Les directives `eslint-disable` héritées visent des règles de plugins non installés :
    // elles sont inertes, mais ESLint les signale. Ce n'est pas l'objet de ce contrôle.
    linterOptions: { reportUnusedDisableDirectives: 'off' },
    files: ['src/**/*.{js,jsx}'],
    plugins: { 'react-hooks': reactHooksStub },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        // Les composants sont écrits en JSX ; sans cela le parseur échoue dès le premier `<div>`.
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
        // Transformation JSX automatique de Vite : `React` n'a pas besoin d'être en portée,
        // mais reste importé dans la plupart des fichiers. Déclaré pour éviter un faux positif.
        React: 'readonly',
      },
    },
    rules: {
      'no-undef': 'error',
    },
  },
  {
    // Scripts Node : mêmes règles, environnement différent.
    files: ['scripts/**/*.mjs', 'tests/**/*.mjs'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.node },
    },
    rules: { 'no-undef': 'error' },
  },
];
