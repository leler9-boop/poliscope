// Unit tests for the "quiz explanation → Academy" concept-linking feature.
// Uses Node's built-in test runner (node:test, node:assert) — no new dependency,
// consistent with this project having no test framework installed today.
// Run with: node --test tests/

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { resolveAcademyLink, getAcademyConcept, ACADEMY_CONCEPTS } from '../src/data/academyConcepts.js';
import { markFirstOccurrences } from '../src/lib/explanationSegments.js';
import { computePopoverPosition } from '../src/lib/popoverPlacement.js';
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

describe('getAcademyConcept', () => {
  test('returns the concept entry (definition, ctaLabel) for a valid id', () => {
    const concept = getAcademyConcept('oqtf');
    assert.ok(concept);
    assert.equal(concept.shortLabel, 'OQTF');
    assert.ok(concept.definition.length > 15);
    assert.equal(concept.ctaLabel, 'Comprendre les OQTF');
  });

  test('returns null for an unknown concept id', () => {
    assert.equal(getAcademyConcept('this-concept-does-not-exist'), null);
  });

  test('returns null for a concept marked draft (never shown as a term, not just never linked)', () => {
    const registry = {
      'draft-thing': { label: { fr: 'Brouillon' }, definition: 'Une définition suffisamment longue.', section: 'debats', slug: 'immigration', status: 'draft' },
    };
    assert.equal(getAcademyConcept('draft-thing', { registry }), null);
  });

  test('every concept in the live registry has a real definition and ctaLabel — never an empty popover', () => {
    for (const id of Object.keys(ACADEMY_CONCEPTS)) {
      const concept = getAcademyConcept(id);
      assert.ok(concept.definition && concept.definition.trim().length >= 15, `concept "${id}" needs a real definition`);
      assert.ok(concept.ctaLabel && concept.ctaLabel.trim().length > 0, `concept "${id}" needs a ctaLabel`);
    }
  });
});

describe('computePopoverPosition', () => {
  const viewport = { viewportWidth: 1280, viewportHeight: 800 };

  test('places the popover below the trigger when there is room', () => {
    const result = computePopoverPosition({
      triggerRect: { top: 100, bottom: 120, left: 50, right: 150 },
      popoverWidth: 288,
      popoverHeight: 160,
      ...viewport,
    });
    assert.equal(result.placement, 'below');
    assert.equal(result.top, 126); // bottom (120) + gap (6)
    assert.equal(result.left, 50);
  });

  test('flips above the trigger when there is not enough room below', () => {
    const result = computePopoverPosition({
      triggerRect: { top: 700, bottom: 720, left: 50, right: 150 },
      popoverWidth: 288,
      popoverHeight: 160,
      ...viewport,
    });
    assert.equal(result.placement, 'above');
    assert.equal(result.top, 534); // top (700) - height (160) - gap (6)
  });

  test('clamps the left edge so the popover never overflows the right side of the viewport', () => {
    const result = computePopoverPosition({
      triggerRect: { top: 100, bottom: 120, left: 1200, right: 1250 },
      popoverWidth: 288,
      popoverHeight: 160,
      ...viewport,
    });
    assert.equal(result.left, 1280 - 288 - 8); // viewportWidth - popoverWidth - margin
  });

  test('clamps to the top margin when the trigger sits near the bottom of a short viewport', () => {
    // Trigger near the bottom of a 200px-tall viewport: neither "below" (too little
    // space) nor a naive "above" (would go negative) fits without clamping.
    const result = computePopoverPosition({
      triggerRect: { top: 150, bottom: 170, left: 50, right: 150 },
      popoverWidth: 288,
      popoverHeight: 160,
      viewportWidth: 1280,
      viewportHeight: 200,
    });
    assert.equal(result.top, 8, 'should clamp to the top margin rather than go off-screen');
    assert.ok(result.top + 160 <= 200, 'clamped popover should fully fit within the viewport height');
  });

  test('never returns a negative left position on a narrow viewport', () => {
    const result = computePopoverPosition({
      triggerRect: { top: 100, bottom: 120, left: -20, right: 80 },
      popoverWidth: 288,
      popoverHeight: 160,
      viewportWidth: 375,
      viewportHeight: 800,
    });
    assert.ok(result.left >= 8);
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

  test('every academy-concept segment referenced by a migrated question has a real definition (no empty popovers)', () => {
    for (const [id, segments] of Object.entries(QUESTION_EXPLANATIONS)) {
      for (const seg of segments) {
        if (seg.type === 'academy-concept') {
          const concept = getAcademyConcept(seg.conceptId);
          assert.ok(concept?.definition?.trim().length >= 15, `${id} → "${seg.conceptId}" needs a real definition`);
          assert.ok(concept?.ctaLabel?.trim().length > 0, `${id} → "${seg.conceptId}" needs a ctaLabel`);
        }
      }
    }
  });
});
