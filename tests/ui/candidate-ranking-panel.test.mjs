// POLISCOP — Un seul classement de candidats, piloté par un sélecteur.
//
// DÉFAUT CORRIGÉ
// --------------
// La page Profil affichait TROIS verdicts pour la même question : une carte
// « ressemblance », une carte « priorités », puis une liste « Candidats 2027 » issue d'un
// SECOND appel du moteur (`rankCandidatesForSurface`) — avec ses propres arguments, donc
// sans aucune garantie de désigner la même personne. Rien à l'écran n'indiquait lequel
// faisait foi.
//
// Ces tests interdisent le retour du second appel, vérifient que tout découle de la lecture
// choisie, et couvrent le clavier — un sélecteur inaccessible n'est pas un sélecteur.

import { test, before } from 'node:test';
import assert from 'node:assert/strict';

let h, renderToStaticMarkup, Panel, RANKING_MODE;

before(async () => {
  ({ createElement: h } = await import('react'));
  ({ renderToStaticMarkup } = await import('react-dom/server'));
  const mod = await import('../../src/components/CandidateRankingPanel.jsx');
  Panel = mod.default;
  ({ RANKING_MODE } = mod);
});

const match = (over = {}) => ({
  score: 64, questionsCompared: 64, questionsAvailable: 128, userAnswered: 64,
  estimatedPositionsUsed: 128, verifiedPositionsUsed: 0, unknownPositions: 0,
  questionsWeighted: 64, influenceDeclared: 9, updatedAt: '2026-08-10',
  ...over,
});

const dual = () => ({
  ideological: {
    results: [
      { candidate: { id: 'a', name: 'Candidate A', color: '#111' }, match: match({ score: 71 }) },
      { candidate: { id: 'b', name: 'Candidate B', color: '#222' }, match: match({ score: 64 }) },
    ],
    unscored: [],
  },
  electoral: {
    results: [
      { candidate: { id: 'b', name: 'Candidate B', color: '#222' }, match: match({ score: 68, questionsWeighted: 55 }) },
      { candidate: { id: 'a', name: 'Candidate A', color: '#111' }, match: match({ score: 60 }) },
    ],
    unscored: [],
  },
  sameWinner: false,
});

const render = (props = {}) =>
  renderToStaticMarkup(h(Panel, { dualRanking: dual(), language: 'fr', ...props }));

// ─── Une seule lecture à la fois ────────────────────────────────────────────

test('la liste affichée est celle de la lecture sélectionnée', () => {
  const ideo = render({ mode: RANKING_MODE.IDEOLOGICAL });
  const elec = render({ mode: RANKING_MODE.ELECTORAL });
  // En ressemblance, A précède B ; en priorités, l'ordre s'inverse.
  assert.ok(ideo.indexOf('Candidate A') < ideo.indexOf('Candidate B'));
  assert.ok(elec.indexOf('Candidate B') < elec.indexOf('Candidate A'));
});

test('le premier de la liste EST le candidat en tête — pas une carte séparée', () => {
  const elec = render({ mode: RANKING_MODE.ELECTORAL });
  // Le gagnant électoral est B : son nom doit apparaître AVANT tout autre nom de candidat.
  const premier = Math.min(...['Candidate A', 'Candidate B'].map(n => elec.indexOf(n)));
  assert.equal(elec.slice(premier, premier + 11), 'Candidate B');
});

test('les compteurs proviennent de la lecture affichée', () => {
  const elec = render({ mode: RANKING_MODE.ELECTORAL });
  assert.ok(elec.includes('55'), 'le nombre de questions pesantes du mode électoral doit être affiché');
  const ideo = render({ mode: RANKING_MODE.IDEOLOGICAL });
  assert.ok(!ideo.includes('décisions utilisées ici'),
    'les compteurs propres à la pondération n’ont aucun sens en lecture idéologique');
});

// ─── Ce qu'on affiche, et comment ───────────────────────────────────────────

test('les scores se lisent « /100 » et jamais en pourcentage', () => {
  const html = render({ mode: RANKING_MODE.IDEOLOGICAL });
  assert.ok(html.includes('/100'), 'l’indice doit porter son dénominateur');
  assert.ok(!/\d\s*%/.test(html.replace(/width:\s*\d+%/g, '')),
    'un pourcentage suggère une part mesurée d’une population : ces nombres n’en sont pas');
});

test('la couverture réelle est affichée : comparées, disponibles, inconnues', () => {
  const html = render({ mode: RANKING_MODE.IDEOLOGICAL });
  for (const attendu of ['questions comparées', 'positions disponibles', 'positions inconnues']) {
    assert.ok(html.includes(attendu), `« ${attendu} » doit être affiché`);
  }
});

test('la nature du corpus et sa date sont annoncées', () => {
  const html = render({ mode: RANKING_MODE.IDEOLOGICAL });
  assert.ok(html.includes('Estimation éditoriale Poliscop'),
    'un score sans sa nature se lit comme une mesure');
  assert.ok(html.includes('2026-08-10'));
});

test('un corpus vérifié n’est jamais annoncé comme tel sans position vérifiée', () => {
  const d = dual();
  d.ideological.results[0].match = match({ verifiedPositionsUsed: 0, estimatedPositionsUsed: 12 });
  const html = renderToStaticMarkup(h(Panel, { dualRanking: d, language: 'fr', mode: RANKING_MODE.IDEOLOGICAL }));
  assert.ok(!html.includes('Positions vérifiées'),
    'une estimation ne doit jamais être promue en position vérifiée par l’affichage');
});

// ─── Accessibilité du sélecteur ─────────────────────────────────────────────

test('le sélecteur est un vrai groupe radio, avec une seule option cochée', () => {
  const html = render({ mode: RANKING_MODE.ELECTORAL });
  assert.ok(html.includes('role="radiogroup"'), 'un div cliquable serait invisible au lecteur d’écran');
  assert.equal((html.match(/role="radio"/g) ?? []).length, 2);
  assert.equal((html.match(/aria-checked="true"/g) ?? []).length, 1,
    'exactement une lecture doit être annoncée comme active');
});

test('seule l’option active est atteignable par tabulation', () => {
  const html = render({ mode: RANKING_MODE.IDEOLOGICAL });
  assert.equal((html.match(/tabindex="0"/gi) ?? []).length, 1);
  assert.equal((html.match(/tabindex="-1"/gi) ?? []).length, 1,
    'le groupe radio se parcourt aux flèches, pas à la tabulation');
});

test('le groupe porte un nom accessible', () => {
  assert.ok(render().includes('aria-label='));
});

// ─── Robustesse ─────────────────────────────────────────────────────────────

test('une lecture sans résultat le dit au lieu d’afficher un classement vide', () => {
  const d = dual();
  d.electoral = { results: [], unscored: [{ candidate: { id: 'a', name: 'A' }, match: { score: null } }] };
  const html = renderToStaticMarkup(h(Panel, { dualRanking: d, language: 'fr', mode: RANKING_MODE.ELECTORAL }));
  assert.ok(html.includes('Aucun candidat'));
});

test('aucun classement du tout ne fait pas planter la page', () => {
  assert.doesNotThrow(() => renderToStaticMarkup(h(Panel, { dualRanking: null, language: 'fr' })));
});

// ─── Le second appel moteur ne doit pas revenir ─────────────────────────────

test('Profil n’appelle plus le moteur une seconde fois pour une liste séparée', async () => {
  const { readFile } = await import('node:fs/promises');
  const src = await readFile(new URL('../../src/pages/Profile.jsx', import.meta.url), 'utf8');
  assert.ok(!src.includes('rankCandidatesForSurface'),
    'un second appel avec ses propres arguments peut désigner une autre personne que la liste');
  assert.ok(src.includes('CandidateRankingPanel'));
});
