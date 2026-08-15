// POLISCOP — Aucun test ne parle au réseau. Jamais.
//
// POURQUOI CE GARDE-FOU
// ---------------------
// Le 5e contre-audit a vu `npm run verify` ne pas se terminer : six fichiers restaient
// suspendus, avec le message `Promise resolution is still pending but the event loop has
// already resolved`. L'hypothèse examinée était qu'une action du store lançait une
// synchronisation asynchrone — voire un vrai transport réseau — non attendue et non injectée.
//
// Un test qui atteint le réseau est mauvais pour trois raisons cumulatives :
//   • il est LENT et non déterministe (DNS, latence, coupure) ;
//   • il peut SUSPENDRE la suite indéfiniment — c'est exactement le symptôme constaté ;
//   • il envoie des données réelles depuis un banc d'essai.
//
// Plutôt que de faire confiance à la configuration (`isIngestEnabled` vaut `false` sous Node
// parce que `import.meta.env` n'existe pas), on l'IMPOSE : toute tentative d'appel réseau
// lève immédiatement, avec un message qui nomme le transport à injecter. Un transport non
// simulé échoue vite et bruyamment, au lieu de faire traîner la suite.
//
// ⚠ Ce module est chargé par `--import ./tests/helpers/register-loader.mjs`, donc dans CHAQUE
// processus de test — y compris ceux lancés par le runner pour un seul fichier.

/** Message commun : dit quoi faire, pas seulement ce qui est interdit. */
function refus(api, cible) {
  return new Error(
    `[poliscop/tests] Appel réseau interdit depuis un test : ${api}(${cible}).\n`
    + 'Injectez le transport au lieu de l’appeler : `createAttemptSession({ transport, '
    + 'consentTransport })`, `createMutationQueue({ transport })`, ou un double de '
    + '`postEnvelope`. Un test qui atteint le réseau est lent, non déterministe, et peut '
    + 'suspendre toute la suite.',
  );
}

const cible = (x) => {
  try {
    if (typeof x === 'string') return x;
    if (x && typeof x === 'object' && 'url' in x) return String(x.url);
    return String(x);
  } catch { return '<illisible>'; }
};

globalThis.fetch = function fetchInterdit(input) {
  throw refus('fetch', cible(input));
};

if (typeof globalThis.XMLHttpRequest === 'function') {
  globalThis.XMLHttpRequest = class XMLHttpRequestInterdit {
    open(_method, url) { throw refus('XMLHttpRequest.open', cible(url)); }
  };
}

// `navigator` est en lecture seule sous Node : on ne remplace `sendBeacon` que s'il existe et
// que la propriété est configurable. Sinon, `beaconEnvelope()` retourne `false` de lui-même.
try {
  if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
    Object.defineProperty(navigator, 'sendBeacon', {
      configurable: true,
      value: (url) => { throw refus('navigator.sendBeacon', cible(url)); },
    });
  }
} catch { /* propriété non configurable : rien à durcir */ }
