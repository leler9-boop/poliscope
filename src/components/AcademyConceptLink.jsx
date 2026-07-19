import React from 'react';
import { resolveAcademyLink } from '../data/academyConcepts.js';
import { trackAcademyConceptClicked } from '../lib/analytics.js';

/**
 * Inline link from a quiz explanation to a precise Poliscop Academy page.
 * Centralizes URL construction, new-tab security attributes, the screen-reader
 * "opens in a new tab" hint, and click analytics for this feature.
 *
 * Renders plain text (no link, no styling) when the concept is unknown, marked
 * draft, or its Academy destination can't be resolved — this component never
 * produces a broken link.
 *
 * @param {{
 *   conceptId: string,
 *   anchor?: string,
 *   questionId?: string,
 *   theme?: string,
 *   position?: number,
 *   children: React.ReactNode,
 * }} props
 */
export default function AcademyConceptLink({ conceptId, anchor, questionId, theme, position, children }) {
  const link = resolveAcademyLink(conceptId, { anchor });
  if (!link) return <>{children}</>;

  const handleClick = () => {
    trackAcademyConceptClicked({ conceptId, questionId, theme, position: position ?? null });
  };

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className="font-medium text-blue-700 underline decoration-blue-300 underline-offset-2 hover:text-blue-800 hover:decoration-blue-500 focus-visible:rounded-sm transition-colors"
    >
      {children}
      <span className="sr-only"> (nouvel onglet)</span>
      <svg
        aria-hidden="true"
        width="9"
        height="9"
        viewBox="0 0 16 16"
        fill="none"
        className="inline-block ml-0.5 mb-[2px] opacity-60"
      >
        <path d="M6 3h7v7M13 3L3 13" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </a>
  );
}
