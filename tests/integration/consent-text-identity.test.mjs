// POLISCOP — Le texte AFFICHÉ et le texte ENREGISTRÉ doivent être le même.
//
// DÉFAUT CORRIGÉ (P0-A)
// ---------------------
// `PreQuizModal` affichait une formulation écrite dans le composant, tandis que
// `recordCollectionConsent()` calculait l'empreinte de `CONSENT_TEXTS[political_analytics]`.
// Les deux textes différaient : le texte enregistré mentionnait la publication de
// statistiques agrégées, la conservation de 25 mois et l'absence de rattachement à un compte,
// dont une partie n'était pas visible. Le système gardait donc la preuve d'un texte que
// personne n'avait lu — une preuve qui prouve autre chose que ce qu'elle prétend.
//
// ⚠ Un test qui se contente de chercher `onStart(true)` / `onStart(false)` ne voit rien de
// tout cela. Celui-ci REND le composant, extrait le texte réellement soumis à l'utilisateur,
// et compare son empreinte à celle que le store enregistre.

import { test, before } from 'node:test';
import assert from 'node:assert/strict';

let h, renderToStaticMarkup, PreQuizModal, useStore;
let PURPOSES, consentTextFor, textFingerprint, CONSENT_POLICY_VERSION, needsCollectionDecision;

before(async () => {
  ({ createElement: h } = await import('react'));
  ({ renderToStaticMarkup } = await import('react-dom/server'));
  PreQuizModal = (await import('../../src/components/PreQuizModal.jsx')).default;
  ({ useStore } = await import('../../src/store/useStore.js'));
  ({
    PURPOSES, consentTextFor, textFingerprint, CONSENT_POLICY_VERSION, needsCollectionDecision,
  } = await import('../../src/lib/consent.js'));
});

/** Décode les entités HTML pour comparer au texte source, pas à son échappement. */
const decode = html => html
  .replace(/<[^>]+>/g, '')
  .replace(/&#x27;|&#39;/g, "'")
  .replace(/&quot;/g, '"')
  .replace(/&amp;/g, '&')
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>');

/** Le texte de décision réellement présenté, extrait du markup rendu. */
function texteAffiche(language = 'fr') {
  const html = renderToStaticMarkup(h(PreQuizModal, { language, onStart: () => {}, askConsent: true }));
  const bloc = html.match(/data-testid="consent-canonical-text"[^>]*>([\s\S]*?)<\/p>/);
  assert.ok(bloc, 'le bloc de texte canonique doit être rendu');
  return decode(bloc[1]).trim();
}

// ─── Identité du texte ──────────────────────────────────────────────────────

test('le texte affiché EST le texte canonique, mot pour mot', () => {
  for (const language of ['fr', 'en']) {
    assert.equal(texteAffiche(language), consentTextFor(PURPOSES.POLITICAL_ANALYTICS, language));
  }
});

test('l’empreinte enregistrée est celle du texte réellement soumis', () => {
  useStore.setState({ collectionConsent: {}, language: 'fr', consent: { politicalData: null, measurement: null } });
  useStore.getState().recordCollectionConsent({ [PURPOSES.POLITICAL_ANALYTICS]: true }, { language: 'fr' });

  const decision = useStore.getState().collectionConsent[PURPOSES.POLITICAL_ANALYTICS];
  assert.equal(decision.granted, true);
  assert.equal(decision.textHash, textFingerprint(texteAffiche('fr')),
    'la preuve porte sur un texte qui n’a pas été présenté');
  assert.equal(decision.policyVersion, CONSENT_POLICY_VERSION);
  assert.equal(decision.textHashAvailable, true);
});

test('la durée de conservation est visible AVANT le choix', () => {
  assert.match(texteAffiche('fr'), /25 mois/);
  assert.match(texteAffiche('en'), /25 months/);
});

test('le flux n’est pas présenté comme « anonyme » : un pseudonyme persistant existe', () => {
  const fr = texteAffiche('fr');
  assert.doesNotMatch(fr, /anonyme/i,
    'un identifiant persistant relie les étapes : parler d’anonymat promettrait davantage');
  assert.match(fr, /identifiant aléatoire/i);
  assert.match(fr, /distinct de votre compte/i);
});

test('la liste de ce qui est collecté et de ce qui ne l’est jamais reste affichée', () => {
  const html = renderToStaticMarkup(h(PreQuizModal, { language: 'fr', onStart: () => {}, askConsent: true }));
  const texte = decode(html);
  for (const attendu of ['réponses aux questions politiques', 'temps passé activement', 'mode de quiz']) {
    assert.ok(texte.includes(attendu), `« ${attendu} » doit rester listé`);
  }
  assert.ok(/Jamais dans ce flux/.test(texte));
  assert.ok(/adresse électronique/.test(texte));
});

// ─── P0-C : ne pas redemander, ne pas écraser ───────────────────────────────

test('une décision en cours de validité ne fait plus poser la question', () => {
  useStore.setState({ collectionConsent: {}, language: 'fr' });
  useStore.getState().recordCollectionConsent({ [PURPOSES.POLITICAL_ANALYTICS]: true }, { language: 'fr' });
  const etat = useStore.getState().collectionConsent;
  assert.equal(needsCollectionDecision(etat, { language: 'fr' }), false);
});

test('un REFUS est respecté à la session suivante, comme un accord', () => {
  useStore.setState({ collectionConsent: {}, language: 'fr' });
  useStore.getState().recordCollectionConsent({ [PURPOSES.POLITICAL_ANALYTICS]: false }, { language: 'fr' });
  assert.equal(needsCollectionDecision(useStore.getState().collectionConsent, { language: 'fr' }), false,
    'redemander après un refus transforme le refus en question harcelante');
});

test('un changement de formulation fait REDEMANDER, sans reporter l’ancien accord', () => {
  useStore.setState({ collectionConsent: {}, language: 'fr' });
  useStore.getState().recordCollectionConsent({ [PURPOSES.POLITICAL_ANALYTICS]: true }, { language: 'fr' });
  const etat = useStore.getState().collectionConsent;
  const altere = {
    [PURPOSES.POLITICAL_ANALYTICS]: { ...etat[PURPOSES.POLITICAL_ANALYTICS], textHash: 'fnv1a32:0000' },
  };
  assert.equal(needsCollectionDecision(altere, { language: 'fr' }), true);
});

test('une décision sans empreinte disponible est redemandée plutôt que supposée', () => {
  const migre = {
    [PURPOSES.POLITICAL_ANALYTICS]: {
      granted: true, decidedAt: '2026-07-01T00:00:00.000Z',
      policyVersion: CONSENT_POLICY_VERSION, textHash: null, textHashAvailable: false,
    },
  };
  assert.equal(needsCollectionDecision(migre, { language: 'fr' }), true);
});

test('quand la question n’est pas posée, l’écran n’offre PAS de nouveau choix', () => {
  const html = renderToStaticMarkup(h(PreQuizModal, { language: 'fr', onStart: () => {}, askConsent: false }));
  const texte = decode(html);
  assert.ok(!texte.includes('Accepter et commencer'),
    'reposer le choix ferait réécrire une décision déjà prise et perdrait sa date');
  assert.ok(!/data-testid="consent-canonical-text"/.test(html));
  assert.ok(texte.includes('C’est parti'));
});

test('les conseils d’usage restent affichés même sans question de collecte', () => {
  const html = renderToStaticMarkup(h(PreQuizModal, { language: 'fr', onStart: () => {}, askConsent: false }));
  assert.ok(decode(html).includes('Entre les deux'),
    'les conseils et la décision sont deux choses distinctes');
});

test('la page Questionnaire ne branche plus la décision sur sessionStorage', async () => {
  const { readFile } = await import('node:fs/promises');
  const src = await readFile(new URL('../../src/pages/Questionnaire.jsx', import.meta.url), 'utf8');
  assert.match(src, /needsCollectionDecision\(/);
  // `prequiz_seen` peut subsister pour les CONSEILS, mais ne doit plus piloter le consentement.
  const ligneDecision = src.split('\n').find(l => l.includes('askConsent ='));
  assert.ok(ligneDecision && !ligneDecision.includes('sessionStorage'));
});
