// Unit tests for the "quiz explanation → Academy" concept-linking feature.
// Uses Node's built-in test runner (node:test, node:assert) — no new dependency,
// consistent with this project having no test framework installed today.
// Run with: node --test tests/

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { resolveAcademyLink, ACADEMY_CONCEPTS } from '../src/data/academyConcepts.js';
import { markFirstOccurrences } from '../src/lib/explanationSegments.js';
import { QUESTION_EXPLANATIONS } from '../src/data/questionExplanations.js';

describe('resolveAcademyLink', () => {
  test('resolves a valid published concept to a plain URL when it has no anchor', () => {
    const link = resolveAcademyLink('immigration');
    assert.ok(link);
    assert.equal(link.url, '/learn/debats/immigration');
    assert.equal(link.label, "L'immigration");
  });

  test('returns null for an unknown concept id', () => {
    assert.equal(resolveAcademyLink('this-concept-does-not-exist'), null);
  });

  test('returns null for a concept marked draft', () => {
    const registry = {
      'draft-thing': { label: { fr: 'Brouillon' }, section: 'debats', slug: 'immigration', status: 'draft' },
    };
    assert.equal(resolveAcademyLink('draft-thing', { registry }), null);
  });

  test('returns null when the registry points at a section/slug absent from LEARN_MANIFEST', () => {
    const registry = {
      ghost: { label: { fr: 'Fantôme' }, section: 'debats', slug: 'does-not-exist-anymore', status: 'published' },
    };
    assert.equal(resolveAcademyLink('ghost', { registry }), null);
  });

  test('builds a URL with an explicit anchor override, forcing niveau=3', () => {
    const link = resolveAcademyLink('retraites', { anchor: 'mesures-prises' });
    assert.equal(link.url, '/learn/debats/retraites?niveau=3#mesures-prises');
  });

  test("falls back to the concept's own default anchor when no override is passed", () => {
    const registry = {
      x: { label: { fr: 'X' }, section: 'debats', slug: 'laicite', anchor: 'ecole', status: 'published' },
    };
    const link = resolveAcademyLink('x', { registry });
    assert.equal(link.url, '/learn/debats/laicite?niveau=3#ecole');
  });

  test('a segment-level anchor overrides the concept default anchor', () => {
    const registry = {
      x: { label: { fr: 'X' }, section: 'debats', slug: 'laicite', anchor: 'ecole', status: 'published' },
    };
    const link = resolveAcademyLink('x', { anchor: 'histoire', registry });
    assert.equal(link.url, '/learn/debats/laicite?niveau=3#histoire');
  });

  test('uses shortLabel over label when both are present', () => {
    const link = resolveAcademyLink('oqtf');
    assert.equal(link.label, 'OQTF');
  });

  test('every concept currently in the registry resolves without error', () => {
    for (const id of Object.keys(ACADEMY_CONCEPTS)) {
      const link = resolveAcademyLink(id);
      assert.ok(link, `concept "${id}" should resolve to a valid link`);
      assert.ok(link.url.startsWith('/learn/'), `concept "${id}" should produce an internal /learn/ URL`);
    }
  });
});

describe('markFirstOccurrences', () => {
  test('marks a single mention of a concept as first occurrence', () => {
    const result = markFirstOccurrences([{ type: 'academy-concept', conceptId: 'oqtf', label: 'OQTF' }]);
    assert.equal(result[0].isFirstOccurrence, true);
  });

  test('only the first of two mentions of the same concept is marked first', () => {
    const result = markFirstOccurrences([
      { type: 'academy-concept', conceptId: 'oqtf', label: 'OQTF' },
      { type: 'text', value: ' et encore une OQTF plus loin : ' },
      { type: 'academy-concept', conceptId: 'oqtf', label: 'OQTF' },
    ]);
    assert.equal(result[0].isFirstOccurrence, true);
    assert.equal(result[2].isFirstOccurrence, false);
  });

  test('leaves text segments untouched', () => {
    const result = markFirstOccurrences([{ type: 'text', value: 'bonjour' }]);
    assert.deepEqual(result[0], { type: 'text', value: 'bonjour' });
  });

  test('does not mutate the input array', () => {
    const input = [{ type: 'academy-concept', conceptId: 'oqtf', label: 'OQTF' }];
    markFirstOccurrences(input);
    assert.equal(input[0].isFirstOccurrence, undefined);
  });
});

describe('QUESTION_EXPLANATIONS shape', () => {
  test('every migrated question is an array of at least one segment', () => {
    for (const [id, segments] of Object.entries(QUESTION_EXPLANATIONS)) {
      assert.ok(Array.isArray(segments) && segments.length > 0, `${id} should have at least one segment`);
    }
  });

  test('every academy-concept segment references a concept that exists in the registry', () => {
    for (const [id, segments] of Object.entries(QUESTION_EXPLANATIONS)) {
      for (const seg of segments) {
        if (seg.type === 'academy-concept') {
          assert.ok(ACADEMY_CONCEPTS[seg.conceptId], `${id} references unknown concept "${seg.conceptId}"`);
        }
      }
    }
  });
});
