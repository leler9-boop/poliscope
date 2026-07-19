#!/usr/bin/env node
/**
 * check-academy-links.mjs — contrôle des liens « quiz → Poliscop Academy ».
 * À lancer avant tout commit touchant src/data/academyConcepts.js ou
 * src/data/questionExplanations.js.
 *
 * Vérifie : chaque concept du registre résout vers une entrée réelle et
 * actuelle de LEARN_MANIFEST (section+slug), chaque ancre par défaut ou
 * surchargée existe bien parmi les sections N3 réellement chargées de la
 * fiche visée, chaque question migrée existe encore dans la banque de
 * questions live, chaque segment a la forme attendue, et qu'un concept n'est
 * jamais lié plus d'une fois dans la même explication.
 *
 * Sortie : erreurs (exit 1) + warnings (exit 0) — jamais de lien cassé publié.
 */

// src/data/questions.js fait `import rawQuestions from './questions_final.json'` sans
// attribut d'import — Vite le gère nativement, mais l'ESM natif de Node (>=20.10/22) exige
// `with { type: 'json' }`. Même loader partagé que scripts/lint-questions.mjs.
import { register } from 'node:module';
register('../audit/poliscop-full-audit/proposed-tests/_json-import-loader.mjs', import.meta.url);

const { ACADEMY_CONCEPTS } = await import('../src/data/academyConcepts.js');
const { QUESTION_EXPLANATIONS } = await import('../src/data/questionExplanations.js');
const { findEntry } = await import('../src/content/learn/manifest.js');
const { questions } = await import('../src/data/questions.js');

const errors = [];
const warnings = [];
const err = (ctx, msg) => errors.push(`✗ [${ctx}] ${msg}`);
const warn = (ctx, msg) => warnings.push(`⚠ [${ctx}] ${msg}`);

const knownQuestionIds = new Set(questions.map((q) => q.id));

async function sectionIdsOf(concept) {
  const entry = findEntry(concept.section, concept.slug);
  if (!entry) return null;
  const content = await entry.load();
  return new Set((content.level3?.sections ?? []).map((s) => s.id).filter(Boolean));
}

// ── 1. Registre des concepts ────────────────────────────────────────────────
const anchorCache = new Map(); // conceptId -> Set<sectionId> | null (null = manifest entry missing)

for (const [id, concept] of Object.entries(ACADEMY_CONCEPTS)) {
  for (const field of ['label', 'section', 'slug']) {
    if (!concept[field]) err(id, `champ requis manquant : ${field}`);
  }
  if (concept.status === 'draft') continue; // jamais lié — pas besoin de résoudre plus loin

  const entry = findEntry(concept.section, concept.slug);
  if (!entry) {
    err(id, `pointe vers ${concept.section}/${concept.slug}, absent de LEARN_MANIFEST`);
    anchorCache.set(id, null);
    continue;
  }

  const ids = await sectionIdsOf(concept);
  anchorCache.set(id, ids);
  if (concept.anchor && !ids.has(concept.anchor)) {
    err(id, `ancre par défaut « #${concept.anchor} » introuvable dans ${concept.section}/${concept.slug} (ancres connues : ${[...ids].join(', ') || 'aucune'})`);
  }
}

// ── 2. Explications de questions migrées ────────────────────────────────────
for (const [questionId, segments] of Object.entries(QUESTION_EXPLANATIONS)) {
  if (!knownQuestionIds.has(questionId)) {
    err(questionId, `référencé dans questionExplanations mais absent de la banque de questions live (retirée, doublon, ou faute de frappe)`);
  }
  if (!Array.isArray(segments) || segments.length === 0) {
    err(questionId, `doit être un tableau non vide de segments`);
    continue;
  }

  const seenConcepts = new Set();
  for (const [i, seg] of segments.entries()) {
    const ctx = `${questionId}[${i}]`;
    if (!seg || typeof seg !== 'object') { err(ctx, `segment invalide`); continue; }

    if (seg.type === 'text') {
      if (typeof seg.value !== 'string' || !seg.value.length) err(ctx, `segment texte vide ou invalide`);
      continue;
    }

    if (seg.type === 'academy-concept') {
      const concept = ACADEMY_CONCEPTS[seg.conceptId];
      if (!concept) { err(ctx, `concept inconnu : « ${seg.conceptId} »`); continue; }
      if (concept.status === 'draft') err(ctx, `concept « ${seg.conceptId} » est marqué draft — ne doit pas apparaître dans une explication publiée`);
      if (!seg.label) err(ctx, `libellé visible manquant pour le concept « ${seg.conceptId} »`);
      if (seenConcepts.has(seg.conceptId)) {
        warn(ctx, `concept « ${seg.conceptId} » déjà lié plus tôt dans cette explication — seule la première occurrence devrait être un lien`);
      }
      seenConcepts.add(seg.conceptId);

      if (seg.anchor) {
        const ids = anchorCache.get(seg.conceptId);
        if (ids && !ids.has(seg.anchor)) {
          err(ctx, `ancre surchargée « #${seg.anchor} » introuvable dans ${concept.section}/${concept.slug}`);
        }
      }
      continue;
    }

    err(ctx, `type de segment inconnu : « ${seg.type} »`);
  }
}

// ── Sortie ───────────────────────────────────────────────────────────────────
for (const w of warnings) console.log(w);
for (const e of errors) console.error(e);
console.log(
  `\n${Object.keys(ACADEMY_CONCEPTS).length} concept(s) Academy · ${Object.keys(QUESTION_EXPLANATIONS).length} question(s) migrée(s) · ${errors.length} erreur(s) · ${warnings.length} warning(s)`
);
if (errors.length > 0) process.exit(1);
console.log('✓ check-academy-links : aucun lien cassé.');
