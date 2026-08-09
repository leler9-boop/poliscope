// POLISCOP — Invariants de données électorales (test bloquant).
//
// Origine : audit 2026-08-09. Les questions spécifiques de fr_2027 utilisaient les clés
// `lepen`/`melenchon` alors que les candidats s'appellent `lepen_2027`/`melenchon_2027` :
// les 17 réponses électorales de l'utilisateur étaient silencieusement ignorées pour ces
// deux candidats (couverture 0/17). Le même défaut existait sur it_2022 (`letta`) et
// es_2023 (`diaz`) — non détecté par l'audit externe.
//
// Ces tests échouent au moindre retour de cette famille de bugs.

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { elections } from '../../src/data/elections.js';
import { THEMES_ORDER } from '../../src/data/questions.js';
import { CANDIDATE_REGISTRY, resolveCandidateId } from '../../src/data/candidateRegistry.js';

const withQuestions = elections.filter(e => (e.specificQuestions ?? []).length > 0);

test('chaque élection a des identifiants de candidats uniques', () => {
  for (const e of elections) {
    const ids = (e.candidates ?? []).map(c => c.id);
    assert.equal(new Set(ids).size, ids.length, `doublon d'id candidat dans ${e.id}`);
  }
});

test('aucune clé de position orpheline (position sans candidat correspondant)', () => {
  for (const e of withQuestions) {
    const candIds = new Set((e.candidates ?? []).map(c => c.id));
    for (const q of e.specificQuestions) {
      for (const key of Object.keys(q.positions ?? {})) {
        assert.ok(
          candIds.has(key),
          `${e.id}/${q.id} : clé de position « ${key} » ne correspond à aucun candidat. ` +
          `Candidats connus : ${[...candIds].join(', ')}`,
        );
      }
    }
  }
});

test('aucun candidat n’a une couverture spécifique de 0 (bug Le Pen/Mélenchon)', () => {
  for (const e of withQuestions) {
    const total = e.specificQuestions.length;
    for (const c of e.candidates ?? []) {
      const n = e.specificQuestions.filter(q => q.positions?.[c.id] != null).length;
      assert.notEqual(
        n, 0,
        `${e.id}/${c.id} (${c.name}) : 0/${total} positions exploitables — ` +
        `les réponses spécifiques n'auront aucun effet sur son score.`,
      );
    }
  }
});

test('couverture spécifique complète pour tout candidat publié', () => {
  // Une couverture partielle n'est pas un bug en soi, mais elle doit être explicite :
  // ce test verrouille l'état actuel (100 %) pour qu'une régression silencieuse soit visible.
  const partial = [];
  for (const e of withQuestions) {
    const total = e.specificQuestions.length;
    for (const c of e.candidates ?? []) {
      const n = e.specificQuestions.filter(q => q.positions?.[c.id] != null).length;
      if (n < total) partial.push(`${e.id}/${c.id} ${n}/${total}`);
    }
  }
  assert.deepEqual(partial, [], `couverture partielle non documentée : ${partial.join(', ')}`);
});

test('les positions spécifiques sont des entiers 1–5 (jamais 0 pour « inconnu »)', () => {
  for (const e of withQuestions) {
    for (const q of e.specificQuestions) {
      for (const [key, v] of Object.entries(q.positions ?? {})) {
        assert.ok(
          Number.isInteger(v) && v >= 1 && v <= 5,
          `${e.id}/${q.id}/${key} : position « ${v} » hors domaine 1–5. ` +
          `Une absence de position se code par omission de la clé, jamais par 0.`,
        );
      }
    }
  }
});

test('chaque question spécifique porte un thème connu et une direction ±1', () => {
  for (const e of withQuestions) {
    for (const q of e.specificQuestions) {
      assert.ok(THEMES_ORDER.includes(q.theme), `${e.id}/${q.id} : thème inconnu « ${q.theme} »`);
      assert.ok([1, -1].includes(q.direction), `${e.id}/${q.id} : direction invalide « ${q.direction} »`);
    }
  }
});

test('les profils candidats couvrent les 8 thèmes, bornés 0–100', () => {
  for (const e of elections) {
    for (const c of e.candidates ?? []) {
      if (!c.profile) continue; // profil absent = candidat non comparable, traité ailleurs
      for (const theme of THEMES_ORDER) {
        const v = c.profile[theme];
        assert.ok(
          typeof v === 'number' && v >= 0 && v <= 100,
          `${e.id}/${c.id} : thème ${theme} = ${v} (attendu : nombre 0–100)`,
        );
      }
    }
  }
});

test('chaque candidat d’élection est résolvable dans le registre canonique', () => {
  const missing = [];
  for (const e of elections) {
    for (const c of e.candidates ?? []) {
      if (!resolveCandidateId(c.id)) missing.push(`${e.id}/${c.id}`);
    }
  }
  assert.deepEqual(missing, [], `candidats absents du registre canonique : ${missing.join(', ')}`);
});

test('un alias du registre ne pointe jamais vers deux personnes différentes', () => {
  const seen = new Map();
  for (const person of CANDIDATE_REGISTRY) {
    for (const alias of [person.id, ...(person.legacyIds ?? [])]) {
      const prev = seen.get(alias);
      assert.equal(
        prev, undefined,
        `l'alias « ${alias} » est revendiqué par ${prev} et ${person.id}`,
      );
      seen.set(alias, person.id);
    }
  }
});
