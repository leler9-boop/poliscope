// POLISCOP — Factual freshness control (Chantier 3, RGPD/coverage mission 2026-07).
// Flags candidates for human review; never re-verifies anything itself and never
// auto-rewrites content. Produces a targeted list, not an exhaustive external
// research pass — see audit/rgpd-remediation-2026-07/ for the mission this
// implements. Run: node scripts/check-freshness.mjs [--json]
import { register } from 'node:module';
import { pathToFileURL } from 'node:url';
const ROOT = '/Users/arnaudlery/Desktop/poliscope copy';
register(pathToFileURL(`${ROOT}/audit/poliscope-full-audit/proposed-tests/_json-import-loader.mjs`), import.meta.url);

const { questions } = await import(`${ROOT}/src/data/questions.js`);
const sources = (await import(`${ROOT}/audit/poliscope-full-audit/sources.json`, { with: { type: 'json' } })).default;

// This script has no reliable notion of "today" other than the machine clock —
// unlike Workflow scripts, plain `node` execution is fine using Date directly.
const TODAY = new Date();
const todayISO = TODAY.toISOString().slice(0, 10);
function daysBetween(isoDate) {
  return Math.round((TODAY - new Date(isoDate)) / 86_400_000);
}

// ── 1. sources.json: overdue / stale / superseded checks ──────────────────────

const STALE_THRESHOLD_DAYS = 180; // ~6 months — "lightweight", not aggressive

const sourceFindings = [];
for (const s of sources) {
  const label = `${s.entityId} :: ${s.claim.slice(0, 60)}…`;

  if (s.nextCheckDue && daysBetween(s.nextCheckDue) > 0) {
    sourceFindings.push({
      flag: 'SOURCE_OVERDUE',
      label,
      detail: `nextCheckDue ${s.nextCheckDue} — ${daysBetween(s.nextCheckDue)} jour(s) dépassé(s). Règle : ${s.nextCheckRule ?? '(aucune)'}`,
    });
  }

  if (s.freshnessCategory !== 'stable' && s.freshnessCategory !== 'superseded' && !s.nextCheckDue) {
    const age = daysBetween(s.verifiedAt);
    if (age > STALE_THRESHOLD_DAYS) {
      sourceFindings.push({
        flag: 'SOURCE_STALE',
        label,
        detail: `verifiedAt ${s.verifiedAt} — ${age} jours (seuil ${STALE_THRESHOLD_DAYS}j), freshnessCategory=${s.freshnessCategory}, aucune date de recheck fixée.`,
      });
    }
  }

  if (s.freshnessCategory === 'superseded') {
    sourceFindings.push({
      flag: 'SOURCE_SUPERSEDED_PRESENT',
      label,
      detail: `Marquée superseded — vérifier manuellement qu'aucun texte du site (questions, bios, pages) ne cite encore cette formulation. ${s.nextCheckRule ?? ''}`,
    });
  }

  if (s.actionNote) {
    sourceFindings.push({
      flag: 'SOURCE_ACTION_NOTE',
      label,
      detail: s.actionNote,
    });
  }
}

// ── 2. Question explanations: unsourced time-sensitive content ────────────────

// Heuristics only — a hit means "worth a human glance", not "confirmed stale".
const YEAR_RE = /\b20(2[4-9]|3[0-5])\b/;                       // 2024–2035
const FRENCH_DATE_RE = /\b\d{1,2}\s+(janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)\s+20\d{2}\b/i;
const MONTH_YEAR_RE = /\b(janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)\s+20\d{2}\b/i;
const PERCENT_OR_MONEY_RE = /\b\d+([.,]\d+)?\s?(%|€|milliards?|millions?)\b/i;
const OFFICEHOLDER_TITLE_RE = /\b(président(e)?|premier ministre|ministre|chancelier(e)?|maire)\b/i;
const STRONG_PAST_TENSE_RE = /\b(a été adopté|a été promulgué|est entré en vigueur|a été voté|a été censuré)e?s?\b/i;
const FUTURE_DEADLINE_RE = /\b(à partir de|prévu(e)?s? (pour|en|d'ici)|doit entrer en vigueur|entrera en vigueur)\b/i;

// entityId is `question_<THEME>_<NUM>`, or `question_<THEME>_<NUM>_<THEME>_<NUM>`
// for entries covering two questions at once (e.g. question_PUB_5_PUB_23) — match
// THEME_NUM tokens as a unit, not a blind split() which would break the pairing.
const sourcedQuestionIds = new Set(
  sources.filter(s => s.entityId.startsWith('question_'))
    .flatMap(s => [...s.entityId.matchAll(/([A-Z]+_\d+)/g)].map(m => m[1]))
);

const explFindings = [];
for (const q of questions) {
  const text = `${q.text} ${q.explanation ?? ''}`;
  const hasNumericSignal = YEAR_RE.test(text) || PERCENT_OR_MONEY_RE.test(text) || FRENCH_DATE_RE.test(text);
  const hasOfficeholder = OFFICEHOLDER_TITLE_RE.test(q.explanation ?? '');
  const hasStrongPastTense = STRONG_PAST_TENSE_RE.test(q.explanation ?? '');
  const hasFutureDeadline = FUTURE_DEADLINE_RE.test(q.explanation ?? '');
  const isSourced = sourcedQuestionIds.has(q.id);

  if (hasNumericSignal && !isSourced) {
    explFindings.push({
      flag: 'EXPL_UNSOURCED_TIMESENSITIVE',
      label: q.id,
      detail: `Contient une date/pourcentage/montant mais aucune entrée sources.json correspondante. Extrait : "${(q.explanation ?? '').slice(0, 100)}…"`,
    });
  }

  if (hasStrongPastTense && !isSourced) {
    explFindings.push({
      flag: 'EXPL_STRONG_PAST_TENSE_UNSOURCED',
      label: q.id,
      detail: `Affirme qu'une loi/mesure "a été adoptée/promulguée/est entrée en vigueur" sans entrée sources.json pour confirmer que ce n'est pas resté au stade de proposition.`,
    });
  }

  if (hasFutureDeadline) {
    const monthYearMatch = text.match(MONTH_YEAR_RE);
    explFindings.push({
      flag: 'EXPL_FUTURE_DEADLINE_LANGUAGE',
      label: q.id,
      detail: monthYearMatch
        ? `Formulation au futur ("à partir de"/"prévu pour"/"entrera en vigueur") associée à une date (${monthYearMatch[0]}) — vérifier si cette échéance est maintenant passée et si le fait doit passer au passé.`
        : `Formulation au futur ("à partir de"/"prévu pour"/"entrera en vigueur") sans date explicite détectée — vérifier manuellement si l'échéance visée est maintenant passée.`,
    });
  }

  if (hasOfficeholder && !isSourced) {
    explFindings.push({
      flag: 'EXPL_OFFICEHOLDER_MENTION_UNSOURCED',
      label: q.id,
      detail: `Mentionne un titre de fonction politique (président/premier ministre/ministre/maire) sans entrée sources.json — un script ne peut pas savoir si la personne citée est toujours en fonction ; à confirmer manuellement.`,
    });
  }
}

// ── Output ──────────────────────────────────────────────────────────────────

const asJson = process.argv.includes('--json');
const all = [...sourceFindings, ...explFindings];

if (asJson) {
  console.log(JSON.stringify({ generatedAt: todayISO, count: all.length, findings: all }, null, 2));
} else {
  console.log(`Contrôle de fraîcheur — généré le ${todayISO}`);
  console.log(`${sources.length} entrées sources.json, ${questions.length} questions actives inspectées.\n`);

  const counts = {};
  all.forEach(f => { counts[f.flag] = (counts[f.flag] || 0) + 1; });
  console.log('Répartition des signalements:', JSON.stringify(counts, null, 2));

  console.log(`\n${all.length} signalement(s) au total — liste ciblée, pas une recherche automatique :\n`);
  for (const f of all) {
    console.log(`[${f.flag}] ${f.label}`);
    console.log(`  ${f.detail}\n`);
  }
}
