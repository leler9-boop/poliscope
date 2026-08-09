// POLISCOP — Frontière unique entre les réponses locales et la colonne Supabase.
//
// LE PROBLÈME QUE CE MODULE RÉSOUT
// --------------------------------
// `NO_OPINION` vaut la chaîne `'no_opinion'`. La colonne `user_answers.answer_value` est un
// `smallint` (contrainte 1–5 en v6). Quatre chemins distincts envoyaient directement les
// valeurs de `answers` vers cette colonne :
//   • useStore.answerQuestion()      — upsert unitaire à chaque réponse
//   • auth._pushLocalToCloud()       — upload du lot local à la connexion
//   • auth.saveAnswers()             — sauvegarde manuelle depuis la page Profil
//   • SyncConflictModal              — résolution de conflit local/cloud
// Résultat : dès qu'un utilisateur connecté et consentant cliquait « sans opinion », l'upsert
// échouait — et pour les chemins par lot, c'est le LOT ENTIER qui échouait, laissant l'appareil
// et le cloud silencieusement divergents.
//
// DÉCISION RETENUE — solution transitoire (voir docs/remediation/decisions.md D-13)
// --------------------------------------------------------------------------------
// Seules les réponses scorables 1–5 sont synchronisées. « Sans opinion » reste local.
// `NO_OPINION` n'est JAMAIS encodé comme 0 ni comme 3 : ce serait fabriquer une position.
// Quand une réponse passe de « 1–5 » à « sans opinion », la ligne distante est SUPPRIMÉE,
// pour que le cloud ne conserve pas une position que l'utilisateur a retirée.
//
// LIMITE ASSUMÉE : sur un second appareil, une question « sans opinion » réapparaît comme
// non posée. La reprise multi-appareils ne reproduit donc pas fidèlement la passation.
// La cible (`response_state` distinct de `answer_value`, migration expand/contract) est
// spécifiée dans docs/data-model/response-state-target.sql — écrite hors du répertoire de
// migrations pour qu'aucun `db push` ne puisse l'appliquer par inadvertance.
//
// RÈGLE : aucun autre fichier ne doit construire de ligne `user_answers` à la main.

import { isScorable, NO_OPINION } from '../engine/scorer.js';

export { NO_OPINION };

/** Une valeur peut-elle être écrite dans `answer_value` (smallint 1–5) ? */
export function isCloudPersistable(value) {
  return isScorable(value);
}

/**
 * Construit les lignes `user_answers` à partir des réponses locales.
 * @param {string} userId
 * @param {Object} answers { [questionId]: 1–5 | NO_OPINION }
 * @returns {{rows: Array, skippedNoOpinion: string[], skippedInvalid: string[]}}
 */
export function toCloudAnswerRows(userId, answers) {
  const rows = [];
  const skippedNoOpinion = [];
  const skippedInvalid = [];

  for (const [question_id, value] of Object.entries(answers ?? {})) {
    if (value === NO_OPINION) { skippedNoOpinion.push(question_id); continue; }
    if (!isCloudPersistable(value)) { skippedInvalid.push(question_id); continue; }
    rows.push({ user_id: userId, question_id, answer_value: value });
  }

  return { rows, skippedNoOpinion, skippedInvalid };
}

/**
 * Ligne unique, ou `null` si la valeur n'est pas persistable.
 * `null` signifie « ne rien écrire », PAS « écrire une valeur par défaut ».
 */
export function toCloudAnswerRow(userId, questionId, value) {
  if (!isCloudPersistable(value)) return null;
  return { user_id: userId, question_id: questionId, answer_value: value };
}

/**
 * Valide les lignes venant de Supabase avant de les injecter dans l'état local.
 * Une colonne numérique peut contenir des données héritées ou corrompues ; on ne fait pas
 * confiance à la base plus qu'à un fichier importé.
 * @returns {{answers: Object, dropped: string[]}}
 */
export function fromCloudAnswerRows(rows) {
  const answers = {};
  const dropped = [];
  for (const row of rows ?? []) {
    const value = typeof row?.answer_value === 'string'
      ? Number(row.answer_value)   // certains pilotes renvoient les entiers en texte
      : row?.answer_value;
    if (!row?.question_id || !isScorable(value)) { dropped.push(row?.question_id ?? '?'); continue; }
    answers[row.question_id] = value;
  }
  return { answers, dropped };
}

/**
 * Nombre de réponses réellement exploitables — c'est cette valeur qui doit alimenter
 * `user_profiles.answered_count`, utilisée pour arbitrer les conflits local/cloud.
 * `Object.keys(answers).length` comptait les « sans opinion » et faisait gagner à tort
 * l'appareil qui en avait le plus.
 */
export function cloudAnsweredCount(answers) {
  return Object.values(answers ?? {}).filter(isCloudPersistable).length;
}

/**
 * Fusionne les réponses distantes avec l'état local en PRÉSERVANT tout « sans opinion » local.
 *
 * Un `NO_OPINION` local gagne TOUJOURS sur une valeur distante, même présente. Raison : le
 * cloud ne sait pas représenter « sans opinion » (colonne smallint), donc une valeur distante
 * pour une question passée localement est nécessairement ANTÉRIEURE à la décision de la
 * passer. Laisser le cloud gagner ressusciterait une position que l'utilisateur a retirée.
 *
 * La version précédente ne préservait le `NO_OPINION` que si le cloud n'avait rien — elle
 * laissait donc une vieille valeur écraser silencieusement un retrait explicite.
 */
export function mergeCloudIntoLocal(cloudAnswers, localAnswers) {
  const merged = { ...cloudAnswers };
  for (const [id, value] of Object.entries(localAnswers ?? {})) {
    if (value === NO_OPINION) merged[id] = NO_OPINION;
  }
  return merged;
}

/**
 * PRIMITIVE UNIQUE de synchronisation des réponses vers Supabase.
 *
 * Tous les chemins d'écriture passent par ici : sauvegarde manuelle, upload à la connexion,
 * résolution de conflit. Elle fait DEUX choses indissociables :
 *   1. `upsert` des réponses 1–5 ;
 *   2. `delete` des lignes correspondant aux questions repassées en « sans opinion ».
 *
 * L'étape 2 était manquante ou sautée. Conséquences réelles :
 *   • `_pushLocalToCloud()` ne supprimait jamais rien → une position retirée survivait au cloud
 *     et revenait au prochain rechargement ;
 *   • `saveAnswers()` retournait avant la suppression quand `rows.length === 0`, c'est-à-dire
 *     précisément quand l'utilisateur avait tout passé ;
 *   • une erreur de suppression était masquée par un upsert réussi.
 *
 * @param {Object} client   client Supabase (ou double de test)
 * @param {string} userId
 * @param {Object} answers  état local complet
 * @returns {Promise<{error: Error|null, upserted: number, deleted: number, stage: string|null}>}
 */
export async function syncAnswersToCloud(client, userId, answers) {
  const { rows, skippedNoOpinion } = toCloudAnswerRows(userId, answers);
  let upserted = 0;
  let deleted = 0;

  if (rows.length > 0) {
    const { error } = await client
      .from('user_answers')
      .upsert(rows, { onConflict: 'user_id,question_id' });
    if (error) return { error, upserted: 0, deleted: 0, stage: 'upsert' };
    upserted = rows.length;
  }

  // JAMAIS de retour anticipé avant cette étape : un lot entièrement « sans opinion » est
  // exactement le cas où la suppression est indispensable.
  if (skippedNoOpinion.length > 0) {
    const { error } = await client
      .from('user_answers')
      .delete()
      .eq('user_id', userId)
      .in('question_id', skippedNoOpinion);
    // L'erreur est REMONTÉE, pas avalée : un upsert réussi ne rend pas la synchronisation
    // correcte si les positions retirées sont restées au cloud.
    if (error) return { error, upserted, deleted: 0, stage: 'delete' };
    deleted = skippedNoOpinion.length;
  }

  return { error: null, upserted, deleted, stage: null };
}
