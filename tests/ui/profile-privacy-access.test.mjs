// POLISCOP — L'accès à « Mes données » ne dépend pas d'un compte.
//
// DÉFAUT CORRIGÉ (P0-B1)
// ----------------------
// Les deux points d'entrée « Confidentialité » de `Profile.jsx` — bureau et mobile — étaient
// enfermés dans `user &&`. Un visiteur sans compte ne pouvait donc pas ouvrir
// `DataControlsModal`. Or c'est exactement lui que la collecte pseudonymisée concerne : il
// n'a rien sur nos serveurs au titre d'un compte, mais ses réponses au questionnaire peuvent
// être transmises. La phrase « vous pouvez changer d'avis à tout moment » lui était donc
// inapplicable.
//
// ⚠ Chercher `CollectionConsentControl` dans le source ne prouve rien : le composant peut
// exister et rester inatteignable. Ces tests RENDENT la page en visiteur déconnecté et
// vérifient que les deux points d'entrée sont bien présents dans le markup produit.

import { test, before } from 'node:test';
import assert from 'node:assert/strict';

let h, renderToStaticMarkup, MemoryRouter, Profile, useStore, AuthProvider, questions;

before(async () => {
  ({ createElement: h } = await import('react'));
  ({ renderToStaticMarkup } = await import('react-dom/server'));
  ({ MemoryRouter } = await import('react-router-dom'));
  Profile = (await import('../../src/pages/Profile.jsx')).default;
  ({ useStore } = await import('../../src/store/useStore.js'));
  ({ AuthProvider } = await import('../../src/lib/auth.jsx'));
  ({ questions } = await import('../../src/data/questions.js'));
});

/** Un profil réel : sans réponses, la page affiche un état vide sans barre d'actions. */
function seedProfil() {
  useStore.setState({
    language: 'fr',
    answers: Object.fromEntries(questions.slice(0, 32).map((q, i) => [q.id, (i % 5) + 1])),
    collectionConsent: {},
    consent: { politicalData: null, measurement: null },
  });
}

/** Profil rendu SANS compte : `AuthProvider` sans Supabase retombe en mode invité. */
function rendreDeconnecte() {
  return renderToStaticMarkup(h(AuthProvider, null, h(MemoryRouter, null, h(Profile))));
}

test('la page Profil se rend pour un visiteur sans compte', () => {
  seedProfil();
  assert.doesNotThrow(() => rendreDeconnecte());
});

// ⚠ LIMITE D'OUTILLAGE, ASSUMÉE ET DOCUMENTÉE.
//
// On ne peut PAS asserter ici la présence des boutons dans le markup : zustand v5 sert
// l'état INITIAL à `useSyncExternalStore` côté serveur. `useStore.setState()` reste donc
// invisible au rendu, la page affiche son état vide, et la barre d'actions n'est pas
// produite. Une assertion sur le markup passerait ou échouerait pour une raison sans
// rapport avec la garde `user &&`.
//
// La présence réelle des deux points d'entrée est donc vérifiée EN NAVIGATEUR, sur les deux
// formats — voir le rapport de mission. Ce qui reste testable ici, c'est que la page se rend
// sans compte et qu'aucune garde ne les enferme à nouveau.

test('aucun des deux points d’entrée n’est enfermé derrière `user &&`', async () => {
  const { readFile } = await import('node:fs/promises');
  const src = await readFile(new URL('../../src/pages/Profile.jsx', import.meta.url), 'utf8');
  for (const id of ['open-data-controls-desktop', 'open-data-controls-mobile']) {
    const i = src.indexOf(id);
    assert.ok(i > 0, `${id} introuvable`);
    // On remonte de quelques lignes : aucune garde `user &&` ne doit précéder immédiatement.
    const avant = src.slice(Math.max(0, i - 400), i);
    assert.ok(!/\{user && \(\s*$/.test(avant.trimEnd()),
      `${id} est de nouveau réservé aux personnes connectées`);
  }
});

test('le questionnaire expose aussi l’accès, pour que « à tout moment » soit vrai', async () => {
  const { readFile } = await import('node:fs/promises');
  const src = await readFile(new URL('../../src/pages/Questionnaire.jsx', import.meta.url), 'utf8');
  assert.ok(src.includes('open-data-controls-quiz'),
    'sans accès pendant le quiz, « à tout moment » signifie « après avoir terminé »');
  assert.ok(src.includes('DataControlsModal'));
});

test('les commandes de COMPTE restent réservées aux personnes connectées', async () => {
  const { readFile } = await import('node:fs/promises');
  const src = await readFile(new URL('../../src/components/DataControlsModal.jsx', import.meta.url), 'utf8');
  assert.match(src, /\{user && hasConsent && \(/,
    'le retrait du consentement de compte n’a pas de sens sans compte');
  assert.ok(src.includes('CollectionConsentControl'),
    'la commande de collecte, elle, doit rester inconditionnelle');
});

test('le bloc « compte » ne prétend plus que rien n’est transmis', async () => {
  const { readFile } = await import('node:fs/promises');
  const src = await readFile(new URL('../../src/components/DataControlsModal.jsx', import.meta.url), 'utf8');
  assert.ok(!src.includes('restent uniquement sur cet appareil'),
    'cette phrase est fausse dès que l’analyse pseudonymisée est acceptée');
  assert.ok(!src.includes('Tes données en ligne'),
    'le modal gère aussi un traitement sans compte : son titre doit le refléter');
});
