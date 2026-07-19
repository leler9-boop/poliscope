import React from 'react';
import AcademyConceptLink from './AcademyConceptLink.jsx';
import { markFirstOccurrences } from '../lib/explanationSegments.js';

/**
 * Renders a question's explanation panel content. Purely presentational: it
 * only decides HOW to render `content`, never fetches or resolves anything
 * itself (that's AcademyConceptLink's job).
 *
 * `content` may be:
 *  - an array of ExplanationSegment (migrated questions, see questionExplanations.js)
 *  - a plain string (the existing questionHints.js / questions_final.json explanation)
 *  - a {fr, en} bilingual object (legacy shape already supported by QuestionCard)
 *
 * @param {{
 *   content: import('../data/academyConcepts.js').ExplanationSegment[] | string | {fr?: string, en?: string},
 *   language?: 'fr' | 'en',
 *   questionId?: string,
 *   theme?: string,
 * }} props
 */
export default function ExplanationContent({ content, language = 'fr', questionId, theme }) {
  if (Array.isArray(content)) {
    const segments = markFirstOccurrences(content);
    return (
      <>
        {segments.map((seg, i) => {
          if (seg.type === 'text') {
            return <React.Fragment key={i}>{seg.value}</React.Fragment>;
          }
          if (seg.type === 'academy-concept') {
            if (!seg.isFirstOccurrence) {
              return <React.Fragment key={i}>{seg.label}</React.Fragment>;
            }
            return (
              <AcademyConceptLink
                key={i}
                conceptId={seg.conceptId}
                anchor={seg.anchor}
                questionId={questionId}
                theme={theme}
                position={i}
              >
                {seg.label}
              </AcademyConceptLink>
            );
          }
          return null;
        })}
      </>
    );
  }

  if (typeof content === 'string') return content;
  return content?.[language] ?? content?.fr ?? content?.en ?? null;
}
