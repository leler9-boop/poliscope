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
 * @property {{fr: string, en?: string}} label   - canonical display label (popover title)
 * @property {string}   [shortLabel]              - short form (e.g. an acronym), preferred for the popover title
 * @property {string}   definition                - short (1-2 sentence), neutral definition shown in the popover
 * @property {string}   ctaLabel                   - grammatically-correct CTA prefix, e.g. "Comprendre les OQTF"
 *                                                    (French article agreement can't be derived automatically,
 *                                                    so it's authored per concept rather than computed from label)
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
    definition:
      "L'immigration désigne l'installation en France de personnes qui vivaient auparavant dans un autre pays. Elle recouvre plusieurs situations différentes : immigration de travail, familiale, étudiante ou liée à l'asile.",
    ctaLabel: "Comprendre l'immigration",
    section: 'debats',
    slug: 'immigration',
    status: 'published',
  },
  oqtf: {
    label: { fr: 'Obligation de quitter le territoire français' },
    shortLabel: 'OQTF',
    aliases: ['OQTF', 'obligation de quitter le territoire français', "obligation de quitter le territoire"],
    definition:
      "Une obligation de quitter le territoire français (OQTF) est une décision administrative — non une condamnation pénale — qui oblige une personne étrangère à quitter la France dans un délai déterminé, ou parfois immédiatement.",
    ctaLabel: 'Comprendre les OQTF',
    section: 'debats',
    slug: 'oqtf',
    status: 'published',
  },
  'droit-asile': {
    label: { fr: "Le droit d'asile" },
    aliases: ['droit d’asile', "droit d'asile", 'demandeur d’asile', "demandeurs d'asile", 'asile'],
    definition:
      "Le droit d'asile permet à une personne persécutée ou gravement menacée dans son pays de demander une protection en France, le temps que sa demande soit examinée.",
    ctaLabel: "Comprendre le droit d'asile",
    section: 'debats',
    slug: 'immigration',
    anchor: 'asile',
    status: 'published',
  },
  laicite: {
    label: { fr: 'La laïcité' },
    aliases: ['laïcité', 'laicite'],
    definition:
      "La laïcité est le principe qui sépare l'État et les religions en France : elle garantit la liberté de croire ou de ne pas croire, et impose la neutralité religieuse aux agents publics dans l'exercice de leurs fonctions.",
    ctaLabel: 'Comprendre la laïcité',
    section: 'debats',
    slug: 'laicite',
    status: 'published',
  },
  'union-europeenne': {
    label: { fr: "L'Union européenne" },
    aliases: ['union européenne', "l'ue", 'union europeenne'],
    definition:
      "L'Union européenne (UE) est une union politique et économique de 27 pays, dont la France, qui décident ensemble dans certains domaines (commerce, monnaie, environnement) tout en restant des États souverains.",
    ctaLabel: "Comprendre l'Union européenne",
    section: 'debats',
    slug: 'union-europeenne',
    status: 'published',
  },
  retraites: {
    label: { fr: 'Les retraites' },
    aliases: ['retraite', 'retraites', 'répartition', 'capitalisation'],
    definition:
      "En France, les retraites fonctionnent par répartition : les cotisations des actifs financent directement les pensions des retraités d'aujourd'hui.",
    ctaLabel: 'Comprendre les retraites',
    section: 'debats',
    slug: 'retraites',
    status: 'published',
  },
  'dette-publique': {
    label: { fr: 'La dette publique' },
    aliases: ['dette publique', 'dette de la france'],
    definition:
      "La dette publique est l'ensemble de l'argent que l'État a emprunté et n'a pas encore remboursé ; elle augmente quand l'État dépense plus qu'il ne perçoit en impôts.",
    ctaLabel: 'Comprendre la dette publique',
    section: 'dico',
    slug: 'dette-publique',
    status: 'published',
  },
  proportionnelle: {
    label: { fr: 'La proportionnelle' },
    aliases: ['proportionnelle', 'scrutin proportionnel', 'mode de scrutin'],
    definition:
      "La proportionnelle est un mode de scrutin où les sièges sont répartis en proportion des voix obtenues, contrairement au scrutin majoritaire utilisé aux élections législatives françaises.",
    ctaLabel: 'Comprendre la proportionnelle',
    section: 'dico',
    slug: 'proportionnelle',
    status: 'published',
  },
  'conseil-constitutionnel': {
    label: { fr: 'Le Conseil constitutionnel' },
    aliases: ['conseil constitutionnel', 'qpc'],
    definition:
      "Le Conseil constitutionnel vérifie que les lois votées par le Parlement respectent la Constitution ; il peut censurer un texte avant sa promulgation ou, depuis 2010, après son entrée en vigueur via une question prioritaire de constitutionnalité (QPC).",
    ctaLabel: 'Comprendre le Conseil constitutionnel',
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

function lookupConcept(conceptId, registry) {
  const resolvedId = registry[conceptId] ? conceptId : ACADEMY_CONCEPT_ALIASES[conceptId];
  return resolvedId ? registry[resolvedId] : undefined;
}

/**
 * Returns the raw concept entry (label, definition, ctaLabel…) for display —
 * or null if unknown/draft. Use this for the popover's content; use
 * resolveAcademyLink() for the Academy URL itself.
 *
 * @param {string} conceptId
 * @param {{ registry?: Record<string, AcademyConcept> }} [opts]
 * @returns {AcademyConcept | null}
 */
export function getAcademyConcept(conceptId, { registry = ACADEMY_CONCEPTS } = {}) {
  const concept = lookupConcept(conceptId, registry);
  return concept && concept.status !== 'draft' ? concept : null;
}

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
  const concept = lookupConcept(conceptId, registry);
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
