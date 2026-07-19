/**
 * Pure positioning math for the desktop concept-definition popover
 * (src/components/AcademyConceptTerm.jsx). No DOM access here — the caller
 * measures the real trigger/popover rects and passes plain numbers in, which
 * keeps this fully unit-testable without a browser.
 */

/**
 * Computes a viewport-clamped {top, left} for a popover anchored below (or,
 * if there isn't room, above) a trigger element.
 *
 * @param {{
 *   triggerRect: { top: number, bottom: number, left: number, right: number },
 *   popoverWidth: number,
 *   popoverHeight: number,
 *   viewportWidth: number,
 *   viewportHeight: number,
 *   margin?: number,  // minimum distance kept from any viewport edge
 *   gap?: number,      // spacing between the trigger and the popover
 * }} opts
 * @returns {{ top: number, left: number, placement: 'above' | 'below' }}
 */
export function computePopoverPosition({
  triggerRect,
  popoverWidth,
  popoverHeight,
  viewportWidth,
  viewportHeight,
  margin = 8,
  gap = 6,
}) {
  const spaceBelow = viewportHeight - triggerRect.bottom;
  const spaceAbove = triggerRect.top;
  const fitsBelow = spaceBelow >= popoverHeight + gap;
  const placement = fitsBelow || spaceAbove <= spaceBelow ? 'below' : 'above';

  const rawTop = placement === 'below'
    ? triggerRect.bottom + gap
    : triggerRect.top - popoverHeight - gap;
  const top = Math.max(margin, Math.min(rawTop, viewportHeight - popoverHeight - margin));

  const rawLeft = triggerRect.left;
  const left = Math.max(margin, Math.min(rawLeft, viewportWidth - popoverWidth - margin));

  return { top, left, placement };
}
