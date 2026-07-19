import React, { useState, useRef, useLayoutEffect, useEffect, useId } from 'react';
import { getAcademyConcept, resolveAcademyLink } from '../data/academyConcepts.js';
import { trackAcademyDefinitionOpened, trackAcademyConceptClicked } from '../lib/analytics.js';
import { computePopoverPosition } from '../lib/popoverPlacement.js';

const MOBILE_QUERY = '(max-width: 639px)';
const POPOVER_WIDTH = 288; // px — matches the w-72 class below

/**
 * A word or short phrase embedded inline in a sentence that, on click, reveals
 * a short neutral definition — never a direct navigation. The definition
 * panel then offers an explicit, separate CTA into Poliscop Academy (new tab).
 *
 * Renders plain text (no interactivity) when the concept is unknown, draft,
 * or missing a definition — this component never produces a broken or
 * empty popover.
 *
 * Rendered as a real <button> (not a styled <div>), so it's reachable and
 * operable by keyboard and announced correctly by screen readers. The Academy
 * link lives in the popover's own content, never nested inside this button.
 *
 * Open/close state is controlled by the parent (see ExplanationContent.jsx)
 * so that only one term's popover is open at a time within an explanation.
 *
 * @param {{
 *   conceptId: string,
 *   anchor?: string,
 *   questionId?: string,
 *   theme?: string,
 *   position?: number,
 *   isOpen: boolean,
 *   onOpen: () => void,
 *   onClose: () => void,
 *   children: React.ReactNode,
 * }} props
 */
export default function AcademyConceptTerm({ conceptId, anchor, questionId, theme, position, isOpen, onOpen, onClose, children }) {
  const concept = getAcademyConcept(conceptId);
  const link = resolveAcademyLink(conceptId, { anchor });

  const [isMobile, setIsMobile] = useState(false);
  const [coords, setCoords] = useState(null);
  const [placed, setPlaced] = useState(false);
  const triggerRef = useRef(null);
  const popoverRef = useRef(null);
  const closeBtnRef = useRef(null);
  const popoverId = useId();

  // Reset per-open measurement state whenever the popover closes, so the next
  // open always re-measures rather than reusing a stale position.
  useEffect(() => {
    if (!isOpen) { setPlaced(false); setCoords(null); }
  }, [isOpen]);

  // Two-pass placement: render hidden to measure the popover's real size,
  // then clamp/flip against the viewport and reveal it. Avoids guessing a
  // fixed height for definitions of varying length.
  useLayoutEffect(() => {
    if (!isOpen || isMobile || placed) return;
    const triggerRect = triggerRef.current?.getBoundingClientRect();
    const popoverRect = popoverRef.current?.getBoundingClientRect();
    if (!triggerRect || !popoverRect) return;
    setCoords(
      computePopoverPosition({
        triggerRect,
        popoverWidth: popoverRect.width || POPOVER_WIDTH,
        popoverHeight: popoverRect.height,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
      })
    );
    setPlaced(true);
  }, [isOpen, isMobile, placed]);

  // Move focus into the panel once it's actually visible (mobile: immediately;
  // desktop: once placed, to avoid focusing something still off-screen).
  useEffect(() => {
    if (!isOpen) return;
    if (isMobile || placed) closeBtnRef.current?.focus();
  }, [isOpen, isMobile, placed]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') { onClose(); triggerRef.current?.focus(); }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const onPointerDown = (e) => {
      if (popoverRef.current?.contains(e.target) || triggerRef.current?.contains(e.target)) return;
      onClose();
    };
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [isOpen, onClose]);

  // Desktop only: a stale anchored position is worse than closing on scroll/resize.
  useEffect(() => {
    if (!isOpen || isMobile) return;
    const onScrollOrResize = () => onClose();
    window.addEventListener('scroll', onScrollOrResize, true);
    window.addEventListener('resize', onScrollOrResize);
    return () => {
      window.removeEventListener('scroll', onScrollOrResize, true);
      window.removeEventListener('resize', onScrollOrResize);
    };
  }, [isOpen, isMobile, onClose]);

  if (!concept || !concept.definition) return <>{children}</>;

  const title = concept.shortLabel ?? concept.label?.fr ?? conceptId;

  const handleToggle = () => {
    if (isOpen) {
      onClose();
      return;
    }
    // Computed synchronously here (not in a useEffect after render) so React 18's
    // automatic batching lands it in the SAME render pass as isOpen turning true —
    // otherwise the desktop popover would flash for one frame before flipping to
    // the mobile sheet on an actual phone.
    setIsMobile(window.matchMedia(MOBILE_QUERY).matches);
    onOpen();
    trackAcademyDefinitionOpened({ conceptId, questionId, theme, position: position ?? null });
  };

  const handleClose = () => {
    onClose();
    triggerRef.current?.focus();
  };

  const handleAcademyClick = () => {
    trackAcademyConceptClicked({ conceptId, questionId, theme, position: position ?? null });
  };

  const AcademyCta = link && (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleAcademyClick}
      className="inline-flex items-center gap-1 text-sm font-semibold text-blue-700 hover:text-blue-800"
    >
      {concept.ctaLabel} dans l'Academy
      <span aria-hidden="true">↗</span>
      <span className="sr-only"> (nouvel onglet)</span>
    </a>
  );

  return (
    <>
      <button
        type="button"
        ref={triggerRef}
        onClick={handleToggle}
        aria-expanded={isOpen}
        aria-controls={isOpen ? popoverId : undefined}
        className="font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 underline decoration-blue-300 decoration-dotted underline-offset-2 rounded px-0.5 hover:text-blue-800 hover:decoration-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1 transition-colors cursor-pointer border-0 align-baseline"
      >
        {children}
      </button>

      {isOpen && isMobile && (
        <div
          id={popoverId}
          ref={popoverRef}
          role="dialog"
          aria-label={title}
          className="fixed inset-x-0 bottom-0 z-[55] bg-white border-t border-slate-200 rounded-t-2xl shadow-2xl px-5 pt-3 pb-6"
          style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}
        >
          <div className="w-9 h-1 bg-slate-200 rounded-full mx-auto mb-3" aria-hidden="true" />
          <div className="flex items-start justify-between gap-3 mb-2">
            <p className="font-semibold text-slate-900 text-sm">{title}</p>
            <button
              ref={closeBtnRef}
              type="button"
              onClick={handleClose}
              aria-label="Fermer"
              className="text-slate-400 hover:text-slate-600 w-8 h-8 -mr-1 -mt-1 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors"
            >
              ✕
            </button>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed mb-4">{concept.definition}</p>
          {AcademyCta}
        </div>
      )}

      {isOpen && !isMobile && (
        <div
          id={popoverId}
          ref={popoverRef}
          role="dialog"
          aria-label={title}
          className="fixed z-[55] w-72 bg-white border border-slate-200 rounded-xl shadow-lg p-4"
          style={{
            top: coords?.top ?? -9999,
            left: coords?.left ?? -9999,
            visibility: placed ? 'visible' : 'hidden',
          }}
        >
          <div className="flex items-start justify-between gap-3 mb-1.5">
            <p className="font-semibold text-slate-900 text-sm">{title}</p>
            <button
              ref={closeBtnRef}
              type="button"
              onClick={handleClose}
              aria-label="Fermer"
              className="text-slate-400 hover:text-slate-600 w-6 h-6 -mr-1 -mt-1 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors shrink-0"
            >
              ✕
            </button>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed mb-3">{concept.definition}</p>
          {AcademyCta}
        </div>
      )}
    </>
  );
}
