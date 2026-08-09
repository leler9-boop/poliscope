// POLISCOP — Dérivation du profil thématique d'un candidat à partir de ses POSITIONS.
//
// POURQUOI CE MODULE
// ------------------
// Jusqu'au 2026-08-09, le classement public 2027 reposait sur deux sources non sourcées :
//   1. `candidate.profile` — huit nombres saisis à la main (`legacy-manual-v1`) ;
//   2. `specificQuestions[].positions` — un repli utilisé dès qu'aucune position approuvée
//      n'existait, c'est-à-dire TOUJOURS, puisqu'il n'y en a aucune.
// L'interface annonçait « Meilleur match 2027 — Fabien Roussel — 66/100 » sans qu'une seule
// preuve n'ait été relue.
//
// Le profil candidat est désormais DÉRIVÉ, question par question, des seules positions
// approuvées. Aucune valeur par défaut : un thème sans preuve suffisante reste `null`.
//
// CHAÎNE
//   positions approuvées → filtre de recevabilité → résolution des revirements
//   → normalisation de direction → agrégation par thème → couverture → profil
//
// Le seuil de positions par thème et le seuil de couverture globale vivent dans
// `matchConfig.js`, versionnés.

import { THEMES_ORDER } from '../data/questions.js';
import { MATCH_CONFIG } from './matchConfig.js';
import { REVIEW_STATUS } from '../data/candidateProvenance.js';

/** Version de l'algorithme de dérivation. À incrémenter à tout changement de règle. */
export const CANDIDATE_PROFILE_VERSION = 'v1-sourced';

/**
 * Une position est-elle RECEVABLE pour alimenter un score public ?
 *
 * Toutes les conditions sont cumulatives. Chacune correspond à une exigence explicite :
 * une position doit être approuvée, avoir une valeur, une source vérifiée, une trace de
 * codage et de relecture, et une date de validité.
 *
 * @param {Object} p
 * @param {(sourceId: string) => boolean} sourceIsVerified
 * @returns {{ok: true} | {ok: false, reason: string}}
 */
export function isAdmissiblePosition(p, sourceIsVerified) {
  if (p?.reviewStatus !== REVIEW_STATUS.APPROVED) return { ok: false, reason: 'not_approved' };
  if (p.stance == null) return { ok: false, reason: 'stance_null' };
  if (![-2, -1, 0, 1, 2].includes(p.stance)) return { ok: false, reason: 'stance_out_of_range' };
  if (!Array.isArray(p.sourceIds) || p.sourceIds.length === 0) return { ok: false, reason: 'no_source' };
  // Une source jamais ouverte ni confirmée (`verifiedAt: null`) ne prouve rien.
  if (!p.sourceIds.every(id => sourceIsVerified(id))) return { ok: false, reason: 'source_unverified' };
  if (!p.excerpt && !p.reasoning) return { ok: false, reason: 'no_evidence_text' };
  if (!p.codedBy) return { ok: false, reason: 'no_coder' };
  if (!p.reviewedBy) return { ok: false, reason: 'no_reviewer' };
  if (!p.validFrom) return { ok: false, reason: 'no_valid_from' };
  return { ok: true };
}

/**
 * Résout les revirements : pour un couple (candidat, question), ne conserve que la position
 * la plus récente valide à la date donnée. Une position remplacée n'est jamais comptée.
 */
function resolveSupersessions(positions, asOf) {
  const superseded = new Set(positions.map(p => p.supersedesId).filter(Boolean));
  const byQuestion = new Map();

  for (const p of positions) {
    const key = `${p.candidateId}|${p.questionId}|${p.validFrom ?? 'null'}`;
    if (superseded.has(key)) continue;                       // remplacée par une plus récente
    if (asOf && p.validFrom && p.validFrom > asOf) continue;  // pas encore en vigueur

    const current = byQuestion.get(p.questionId);
    if (!current || (p.validFrom ?? '') > (current.validFrom ?? '')) {
      byQuestion.set(p.questionId, p);
    }
  }
  return [...byQuestion.values()];
}

/**
 * Dérive un profil thématique 0–100 depuis des positions approuvées.
 *
 * @param {Array}  positions   positions du candidat (tous statuts ; le filtre est ici)
 * @param {Array}  questions   questions de référence, portant `theme` et `direction`
 * @param {Object} [options]
 * @param {(id: string) => boolean} [options.sourceIsVerified] défaut : refuse tout
 * @param {string} [options.asOf] date ISO pour la résolution des revirements
 * @returns {{themes: Object, coverage: Object, usable: Array, rejected: Array, version: string}}
 */
export function deriveCandidateThemes(positions, questions, options = {}) {
  const { sourceIsVerified = () => false, asOf = null } = options;
  const byId = new Map(questions.map(q => [q.id, q]));

  const rejected = [];
  const admissible = [];
  for (const p of positions ?? []) {
    const verdict = isAdmissiblePosition(p, sourceIsVerified);
    if (!verdict.ok) { rejected.push({ questionId: p?.questionId, reason: verdict.reason }); continue; }
    if (!byId.has(p.questionId)) { rejected.push({ questionId: p.questionId, reason: 'unknown_question' }); continue; }
    admissible.push(p);
  }

  const usable = resolveSupersessions(admissible, asOf);

  const acc = {};
  THEMES_ORDER.forEach(t => { acc[t] = { sum: 0, count: 0 }; });

  for (const p of usable) {
    const q = byId.get(p.questionId);
    const bucket = acc[q.theme];
    if (!bucket) continue;
    // stance -2…+2 → 0…1, puis application de la direction de la question, exactement comme
    // pour une réponse d'utilisateur : les deux côtés vivent dans la même échelle.
    const normalized = (p.stance + 2) / 4;
    bucket.sum += q.direction === 1 ? normalized : 1 - normalized;
    bucket.count++;
  }

  const themes = {};
  const perTheme = {};
  for (const t of THEMES_ORDER) {
    const d = acc[t];
    const enough = d.count >= MATCH_CONFIG.minSourcedPositionsPerTheme;
    // AUCUNE valeur par défaut : un thème sans preuve suffisante reste indéterminé.
    themes[t] = enough ? Math.round((d.sum / d.count) * 100) : null;
    perTheme[t] = { sourced: d.count, sufficient: enough };
  }

  return {
    themes,
    coverage: {
      themesKnown: THEMES_ORDER.filter(t => themes[t] != null).length,
      themesTotal: THEMES_ORDER.length,
      sourcedPositions: usable.length,
      perTheme,
    },
    usable,
    rejected,
    version: CANDIDATE_PROFILE_VERSION,
  };
}
