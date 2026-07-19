/**
 * academyConcepts.js — the single source of truth for "quiz explanation → Academy" links.
 *
 * A concept here is an editorial identifier (chosen by whoever writes a question's
 * explanation) that resolves to a precise page — and optionally a precise section —
 * in Poliscop Academy (src/content/learn/). The concept id is deliberately independent
 * from both the visible link text (chosen per-explanation, see questionExplanations.js)
 * and from the Academy slug (so a slug rename only requires updating the entry below,
 * not every explanation that references it).
 *
 * @typedef {Object} AcademyConcept
 * @property {{fr: string, en?: string}} label   - default display label
 * @property {string}   [shortLabel]              - short form (e.g. an acronym)
 * @property {string[]} [aliases]                 - natural-language variants (dev tooling only)
 * @property {string}   section                   - LEARN_MANIFEST section (debats, dico, institutions…)
 * @property {string}   slug                      - LEARN_MANIFEST slug
 * @property {string}   [anchor]                  - default level3 section id to deep-link to
 * @property {'published'|'draft'} [status]       - 'draft' concepts are never linked (see resolveAcademyLink)
 *
 * @typedef {{ type: 'text', value: string }} TextSegment
 * @typedef {{ type: 'academy-concept', conceptId: string, label: string, anchor?: string }} ConceptSegment
 * @typedef {TextSegment | ConceptSegment} ExplanationSegment
 */

import { findEntry } from '../content/learn/manifest.js';

/** @type {Record<string, AcademyConcept>} */
export const ACADEMY_CONCEPTS = {
  immigration: {
    label: { fr: "L'immigration" },
    aliases: ['immigration', 'immigré', 'immigrés'],
    section: 'debats',
    slug: 'immigration',
    status: 'published',
  },
  oqtf: {
    label: { fr: 'Obligation de quitter le territoire français' },
    shortLabel: 'OQTF',
    aliases: ['OQTF', 'obligation de quitter le territoire français', "obligation de quitter le territoire"],
    section: 'debats',
    slug: 'oqtf',
    status: 'published',
  },
  'droit-asile': {
    label: { fr: "Le droit d'asile" },
    aliases: ['droit d’asile', "droit d'asile", 'demandeur d’asile', "demandeurs d'asile", 'asile'],
    section: 'debats',
    slug: 'immigration',
    anchor: 'asile',
    status: 'published',
  },
  laicite: {
    label: { fr: 'La laïcité' },
    aliases: ['laïcité', 'laicite'],
    section: 'debats',
    slug: 'laicite',
    status: 'published',
  },
  'union-europeenne': {
    label: { fr: "L'Union européenne" },
    aliases: ['union européenne', "l'ue", 'union europeenne'],
    section: 'debats',
    slug: 'union-europeenne',
    status: 'published',
  },
  retraites: {
    label: { fr: 'Les retraites' },
    aliases: ['retraite', 'retraites', 'répartition', 'capitalisation'],
    section: 'debats',
    slug: 'retraites',
    status: 'published',
  },
  'dette-publique': {
    label: { fr: 'La dette publique' },
    aliases: ['dette publique', 'dette de la france'],
    section: 'dico',
    slug: 'dette-publique',
    status: 'published',
  },
  proportionnelle: {
    label: { fr: 'La proportionnelle' },
    aliases: ['proportionnelle', 'scrutin proportionnel', 'mode de scrutin'],
    section: 'dico',
    slug: 'proportionnelle',
    status: 'published',
  },
  'conseil-constitutionnel': {
    label: { fr: 'Le Conseil constitutionnel' },
    aliases: ['conseil constitutionnel', 'qpc'],
    section: 'institutions',
    slug: 'conseil-constitutionnel',
    status: 'published',
  },
};

/**
 * Backward-compatible redirects for concept ids (not Academy slugs — those are
 * LEARN_MANIFEST's own concern). Populate this if a concept id is ever renamed,
 * so explanations already shipped referencing the old id keep resolving.
 * @type {Record<string, string>}
 */
export const ACADEMY_CONCEPT_ALIASES = {};

/**
 * Resolves a concept id to a safe, real Academy URL — or null if it can't be
 * linked (unknown id, draft status, or the target has vanished from
 * LEARN_MANIFEST since this registry entry was written). Never returns a
 * fabricated or broken URL.
 *
 * @param {string} conceptId
 * @param {{ anchor?: string, registry?: Record<string, AcademyConcept> }} [opts]
 *   `anchor` overrides the concept's default anchor for this specific usage.
 *   `registry` is an injection point for tests; defaults to ACADEMY_CONCEPTS.
 * @returns {{ url: string, label: string } | null}
 */
export function resolveAcademyLink(conceptId, { anchor, registry = ACADEMY_CONCEPTS } = {}) {
  const resolvedId = registry[conceptId] ? conceptId : ACADEMY_CONCEPT_ALIASES[conceptId];
  const concept = resolvedId ? registry[resolvedId] : undefined;
  if (!concept || concept.status === 'draft') return null;

  const entry = findEntry(concept.section, concept.slug);
  if (!entry) return null; // registry drifted from the real manifest — never link

  const effectiveAnchor = anchor ?? concept.anchor ?? null;
  // Anchors only exist inside level3 ("Tout comprendre") — force that reading level so the
  // target section actually renders. See LearnPage.jsx's hash-handling effect.
  const query = effectiveAnchor ? '?niveau=3' : '';
  const hash = effectiveAnchor ? `#${effectiveAnchor}` : '';

  return {
    url: `/learn/${concept.section}/${concept.slug}${query}${hash}`,
    label: concept.shortLabel ?? concept.label?.fr ?? conceptId,
  };
}
