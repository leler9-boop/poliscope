// POLISCOP — Deux contrats de correspondance, et ce qu'ils n'ont pas le droit de faire.
//
// DÉFAUT CORRIGÉ (§4)
// -------------------
// Un seuil unique — quatre thèmes connus — servait au profil GÉNÉRAL (128 questions, huit
// thèmes) comme à la correspondance ÉLECTORALE (7 à 18 questions, parfois trois thèmes).
// Mesure : `it_2022` ne permet d'atteindre qu'UN thème, `stras_2026` et `es_2023` deux.
// Aucun corpus, même parfait, ne pouvait y produire un score — et le produit renvoyait le
// même « couverture insuffisante » qu'un corpus simplement incomplet. Deux problèmes très
// différents : l'un se répare en codant des positions, l'autre en changeant le questionnaire.
//
// ⚠ CE QUE CES TESTS INTERDISENT SURTOUT : qu'un seuil soit abaissé pour faire apparaître un
// score. Le contrat électoral s'adapte à ce qui est ATTEIGNABLE, jamais à ce qui est
// souhaité, et s'arrête net à un plancher.

import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  GENERAL_MATCH_CONTRACT, ELECTION_MATCH_CONTRACT, ABSOLUTE_MIN_THEMES,
  MATCH_CONTRACTS_VERSION, attainableThemes, resolveElectionContract, resolveGeneralContract,
} from '../../src/engine/matchContracts.js';
import { elections } from '../../src/data/elections.js';
import { THEMES_ORDER } from '../../src/data/questions.js';

const q = (theme, i) => ({ id: `q${theme}${i}`, theme, direction: 1 });
const questionnaire = (parTheme) => Object.entries(parTheme)
  .flatMap(([theme, n]) => Array.from({ length: n }, (_, i) => q(theme, i)));

// ─── Les deux contrats sont distincts et versionnés ─────────────────────────

test('les deux contrats sont versionnés et portent leur justification', () => {
  for (const c of [GENERAL_MATCH_CONTRACT, ELECTION_MATCH_CONTRACT]) {
    assert.equal(c.version, MATCH_CONTRACTS_VERSION);
    assert.ok(c.rationale && c.rationale.length > 60,
      `${c.id} : un seuil sans justification écrite ne peut pas être discuté`);
  }
  assert.notEqual(GENERAL_MATCH_CONTRACT.id, ELECTION_MATCH_CONTRACT.id);
});

test('le contrat général ne dépend d’aucun scrutin', () => {
  const g = resolveGeneralContract();
  assert.equal(g.minKnownThemes, 4, 'la moitié des huit thèmes');
  assert.equal(g.attainable, THEMES_ORDER.length);
  assert.equal(g.structurallyPossible, true);
});

test('une position isolée ne fait pas un thème connu, dans les DEUX contrats', () => {
  assert.equal(GENERAL_MATCH_CONTRACT.minPositionsPerTheme, 2);
  assert.equal(ELECTION_MATCH_CONTRACT.minPositionsPerTheme, 2);
  assert.equal(attainableThemes(questionnaire({ ECONOMY: 1, SOCIAL: 1, SECURITY: 1 })), 0,
    'trois thèmes à une question chacun ne rendent aucun thème connaissable');
});

// ─── Le seuil électoral suit l'ATTEIGNABLE, jamais le souhaitable ───────────

test('un questionnaire large exige le seuil général, pas moins', () => {
  const c = resolveElectionContract(questionnaire({
    ECONOMY: 2, SOCIAL: 2, SECURITY: 2, ENVIRONMENT: 2, GLOBAL: 2,
  }));
  assert.equal(c.attainable, 5);
  assert.equal(c.minKnownThemes, 4, 'le seuil est plafonné au contrat général');
});

test('un questionnaire étroit exige ce qu’il permet, et non l’impossible', () => {
  const c = resolveElectionContract(questionnaire({ ECONOMY: 2, SOCIAL: 2, SECURITY: 2 }));
  assert.equal(c.attainable, 3);
  assert.equal(c.minKnownThemes, 3,
    'exiger quatre thèmes d’un questionnaire qui n’en permet que trois, c’est exiger l’impossible');
  assert.equal(c.structurallyPossible, true);
});

test('sous le plancher, AUCUN seuil n’est proposé : l’élection est déclarée structurellement insuffisante', () => {
  const c = resolveElectionContract(questionnaire({ ECONOMY: 2, SOCIAL: 2 }));
  assert.equal(c.attainable, 2);
  assert.equal(c.minKnownThemes, null,
    'descendre à deux thèmes rendrait le score scorable ET dénué de sens');
  assert.equal(c.structurallyPossible, false);
  assert.equal(c.reason, 'questionnaire_structurally_insufficient');
});

test('le plancher ne cède jamais, quel que soit le questionnaire', () => {
  for (let n = 0; n <= 8; n++) {
    const c = resolveElectionContract(questionnaire(
      Object.fromEntries(THEMES_ORDER.slice(0, n).map(t => [t, 2])),
    ));
    if (c.minKnownThemes != null) {
      assert.ok(c.minKnownThemes >= ABSOLUTE_MIN_THEMES,
        `seuil ${c.minKnownThemes} sous le plancher avec ${n} thèmes atteignables`);
      assert.ok(c.minKnownThemes <= GENERAL_MATCH_CONTRACT.minKnownThemes,
        'le contrat électoral ne doit jamais être PLUS exigeant que le général');
    }
  }
});

test('le seuil ne dépend jamais du corpus candidat, seulement du questionnaire', () => {
  // Deux appels identiques doivent rendre le même seuil : si le corpus pouvait l'influencer,
  // il suffirait d'ajouter des positions pour faire baisser la barre.
  const qs = questionnaire({ ECONOMY: 2, SOCIAL: 2, SECURITY: 2, GLOBAL: 2 });
  assert.deepEqual(resolveElectionContract(qs), resolveElectionContract(qs));
});

// ─── Sur les élections réelles ──────────────────────────────────────────────

test('chaque élection du dépôt reçoit un contrat explicite', () => {
  for (const e of elections) {
    const c = resolveElectionContract(e.specificQuestions ?? []);
    assert.equal(c.contract, 'election');
    assert.equal(c.version, MATCH_CONTRACTS_VERSION);
    assert.equal(typeof c.attainable, 'number');
    if (c.structurallyPossible) {
      assert.ok(c.minKnownThemes >= ABSOLUTE_MIN_THEMES && c.minKnownThemes <= 4);
      assert.equal(c.reason, null);
    } else {
      assert.equal(c.minKnownThemes, null);
      assert.ok(c.reason, `${e.id} : une insuffisance structurelle doit dire pourquoi`);
    }
  }
});

test('les élections structurellement insuffisantes sont NOMMÉES, pas confondues', () => {
  const impossibles = elections
    .filter(e => !resolveElectionContract(e.specificQuestions ?? []).structurallyPossible)
    .map(e => e.id).sort();
  // Si cette liste change, c'est que le questionnaire d'un scrutin a évolué — ce test doit
  // alors être mis à jour SCIEMMENT, pas contourné.
  assert.deepEqual(impossibles, ['es_2023', 'it_2022', 'stras_2026'],
    'ces scrutins ne peuvent produire aucun score strict, quel que soit le corpus');
});

test('fr_2027 reste soumise au seuil plein : rien n’a été relâché pour elle', () => {
  const c = resolveElectionContract(elections.find(e => e.id === 'fr_2027').specificQuestions);
  assert.equal(c.attainable, 5);
  assert.equal(c.minKnownThemes, 4,
    'le questionnaire 2027 permet quatre thèmes : le seuil général s’y applique tel quel');
});
