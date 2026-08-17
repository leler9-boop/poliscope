// POLISCOP — Le diagnostic affiché doit nommer la BONNE cause.
//
// DÉFAUT CORRIGÉ (P1 du contre-audit du 2026-08-14)
// -------------------------------------------------
// `scripts/check-matching.mjs` affichait « relecture non faite » sur la ligne « élection »
// dès qu'aucune position n'était approuvée — y compris quand il n'en existait AUCUNE. Le
// rapport reprochait donc une relecture manquante pour des candidats dont personne n'a jamais
// codé la moindre position.
//
// Ce n'est pas cosmétique : les deux situations se réparent par des gestes opposés — coder,
// ou faire relire. Un diagnostic faux envoie le travail au mauvais endroit. C'est la même
// famille de défaut que « aucun corpus approuvé à ce jour » écrit en dur.

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { diagnoseGeneral, diagnoseElection, diagnoseCorpus } from '../../scripts/lib/matching-diagnostics.mjs';
import { ELECTION_DIRECT_CONTRACT } from '../../src/engine/matchContracts.js';

const CONTRAT = ELECTION_DIRECT_CONTRACT;

// ─── La distinction elle-même ───────────────────────────────────────────────

test('aucune position codée → « aucun corpus », jamais « relecture non faite »', () => {
  assert.equal(diagnoseCorpus({ positions: 0, approved: 0 }), 'aucun corpus');
});

test('des positions codées mais aucune approuvée → « relecture non faite »', () => {
  assert.equal(diagnoseCorpus({ positions: 6, approved: 0 }), 'relecture non faite');
});

test('la lecture ÉLECTORALE ne reproche plus une relecture inexistante', () => {
  // Le cas exact du rapport : un candidat sans aucune position codée.
  const libelle = diagnoseElection({
    positions: 0, approved: 0, compared: 0, questionnaireSize: 17,
    themesRepresented: 0, contract: CONTRAT, score: null,
  });
  assert.equal(libelle, 'aucun corpus',
    'reprocher une relecture là où rien n’a été codé envoie le travail au mauvais endroit');
});

test('la lecture GÉNÉRALE faisait déjà la distinction — elle la garde', () => {
  assert.equal(diagnoseGeneral({ positions: 0, approved: 0 }), 'aucun corpus');
  assert.equal(diagnoseGeneral({ positions: 6, approved: 0 }), 'relecture non faite');
});

// ─── Les autres libellés restent justes ─────────────────────────────────────

test('corpus relu mais trop étroit : la lecture générale le dit', () => {
  assert.equal(
    diagnoseGeneral({ positions: 17, approved: 7, themesReady: 1, minKnownThemes: 4, score: null }),
    'corpus trop étroit pour un profil général',
  );
});

test('intersection sous le contrat direct : la lecture électorale le dit', () => {
  assert.equal(
    diagnoseElection({
      positions: 17, approved: 3, compared: 3, questionnaireSize: 17,
      themesRepresented: 3, contract: CONTRAT, score: null,
    }),
    'intersection sous le contrat direct',
  );
});

test('contrat rempli mais aucun score : CHAÎNE CASSÉE, et c’est bloquant', () => {
  assert.equal(
    diagnoseElection({
      positions: 17, approved: 7, compared: 7, questionnaireSize: 17,
      themesRepresented: 6, contract: CONTRAT, score: null,
    }),
    'CHAÎNE CASSÉE',
    'une intersection conforme qui ne produit rien est un défaut du moteur, pas du corpus',
  );
});

test('un score produit ne signale aucun blocage', () => {
  assert.equal(
    diagnoseElection({
      positions: 17, approved: 7, compared: 7, questionnaireSize: 17,
      themesRepresented: 6, contract: CONTRAT, score: 33,
    }),
    '—',
  );
  assert.equal(
    diagnoseGeneral({ positions: 17, approved: 9, themesReady: 4, minKnownThemes: 4, score: 51 }),
    '—',
  );
});

test('le script consomme bien ces fonctions au lieu de recopier la logique', async () => {
  const { readFile } = await import('node:fs/promises');
  const src = await readFile(new URL('../../scripts/check-matching.mjs', import.meta.url), 'utf8');
  assert.match(src, /diagnoseGeneral\(/);
  assert.match(src, /diagnoseElection\(/);
  const code = src.split('\n').filter(l => !l.trim().startsWith('//')).join('\n');
  assert.ok(!/approved\.length === 0 \? 'relecture non faite'/.test(code),
    'la logique recopiée dans le script échapperait à ces tests');
});
