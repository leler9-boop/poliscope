/**
 * Pure helpers for rendering structured question explanations
 * (see src/data/academyConcepts.js for the ExplanationSegment type).
 */

/**
 * Marks each 'academy-concept' segment with whether it's the first occurrence
 * of its conceptId in the list. Only the first occurrence of a repeated
 * concept should render as a link; later mentions render as plain text.
 * @param {import('../data/academyConcepts.js').ExplanationSegment[]} segments
 */
export function markFirstOccurrences(segments) {
  const seen = new Set();
  return segments.map((seg) => {
    if (seg.type !== 'academy-concept') return seg;
    const isFirstOccurrence = !seen.has(seg.conceptId);
    seen.add(seg.conceptId);
    return { ...seg, isFirstOccurrence };
  });
}
