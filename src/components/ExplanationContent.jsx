import React, { useState } from 'react';
import AcademyConceptTerm from './AcademyConceptTerm.jsx';
import { markFirstOccurrences } from '../lib/explanationSegments.js';

/**
 * Renders a question's explanation panel content. Purely presentational: it
 * only decides HOW to render `content` and owns which single concept term's
 * definition popover is open (AcademyConceptTerm itself never navigates or
 * resolves anything — that's academyConcepts.js's job).
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
  // Only one term's definition popover open at a time within this explanation
  // (an explanation can embed several concepts — e.g. IMM_1 has two).
  const [openIndex, setOpenIndex] = useState(null);

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
              <AcademyConceptTerm
                key={i}
                conceptId={seg.conceptId}
                anchor={seg.anchor}
                questionId={questionId}
                theme={theme}
                position={i}
                isOpen={openIndex === i}
                onOpen={() => setOpenIndex(i)}
                onClose={() => setOpenIndex((cur) => (cur === i ? null : cur))}
              >
                {seg.label}
              </AcademyConceptTerm>
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
