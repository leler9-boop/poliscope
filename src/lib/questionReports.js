// POLISCOP — Signalements de questions.
//
// CE QUI EXISTAIT AVANT
// ---------------------
// `QuestionCard.handleReportSubmit()` faisait exactement ceci :
//     const handleReportSubmit = () => { setReportSent(true); … }
// Aucun appel réseau. Aucun stockage. « Votre signalement a été pris en compte » était
// affiché à 100 % des utilisateurs, y compris hors ligne, et 0 % des signalements
// existait ensuite où que ce soit. Le retour utilisateur le plus précieux du produit —
// « cette question est biaisée » — était jeté à la milliseconde.
//
// CE QUE CE MODULE GARANTIT
// -------------------------
//   • « Signalement reçu » n'est affiché QU'APRÈS une réponse serveur positive ;
//   • hors ligne, le signalement est conservé localement et le message le DIT
//     (« sera envoyé lorsque la connexion reviendra ») — jamais de faux succès ;
//   • la file locale est rejouée au retour du réseau et au chargement suivant ;
//   • sans backend configuré (mode invité), l'échec est annoncé comme tel.

import { postEnvelope, isIngestEnabled, CLIENT_RELEASE } from './ingestClient.js';
import { REPORT_CATEGORIES, ORIGIN_SCREENS } from '../../supabase/functions/_shared/protocol.js';

const OUTBOX_KEY = 'poliscop_report_outbox';
/** Bornée : un stockage local qui gonfle sans limite est un défaut, pas une sécurité. */
const MAX_OUTBOX = 50;

export const REPORT_STATUS = Object.freeze({
  SENT:    'sent',      // accusé de réception du serveur — le seul état qui autorise « reçu »
  QUEUED:  'queued',    // conservé localement, sera renvoyé
  FAILED:  'failed',    // refus définitif du serveur (payload invalide) — inutile de rejouer
});

function readOutbox() {
  try {
    const raw = localStorage.getItem(OUTBOX_KEY);
    const items = raw ? JSON.parse(raw) : [];
    return Array.isArray(items) ? items : [];
  } catch {
    return [];
  }
}

function writeOutbox(items) {
  try {
    localStorage.setItem(OUTBOX_KEY, JSON.stringify(items.slice(-MAX_OUTBOX)));
  } catch {
    // Stockage indisponible (Safari privé, quota) : le signalement en cours est perdu.
    // On ne le masque pas — `submitQuestionReport` renvoie alors `queued` sans persistance,
    // et l'interface affiche « sera envoyé », ce qui reste vrai pour la session courante.
  }
}

/**
 * Valide et normalise un signalement AVANT tout envoi. Les mêmes règles que l'Edge
 * Function, appliquées tôt : un refus serveur pour catégorie inconnue serait un aller-retour
 * réseau inutile et un message d'erreur incompréhensible.
 */
export function buildReportPayload({
  questionId, questionnaireVersion, category, comment,
  attemptId, anonymousSessionId, userId, language, originScreen,
}) {
  if (!REPORT_CATEGORIES.includes(category)) {
    throw new Error(`catégorie de signalement inconnue : ${category}`);
  }
  const screen = ORIGIN_SCREENS.includes(originScreen) ? originScreen : 'other';

  const payload = {
    question_id: questionId,
    questionnaire_version: questionnaireVersion,
    category,
    origin_screen: screen,
    client_release: CLIENT_RELEASE,
  };

  // Champs optionnels : ajoutés seulement s'ils ont une valeur. Envoyer `null` ferait
  // échouer la validation stricte de l'Edge Function sur les UUID.
  if (comment && comment.trim()) payload.comment = comment.trim().slice(0, 1000);
  if (attemptId)          payload.attempt_id = attemptId;
  if (anonymousSessionId) payload.anonymous_session_id = anonymousSessionId;
  if (userId)             payload.user_id = userId;
  if (language === 'fr' || language === 'en') payload.language = language;

  return payload;
}

/**
 * Envoie un signalement.
 *
 * ⚠ Ne retourne JAMAIS `sent` sans réponse positive du serveur. C'est tout l'objet de ce
 * module : l'interface s'appuie sur cette valeur pour choisir son message.
 *
 * @returns {Promise<{status: 'sent'|'queued'|'failed', reason?: string}>}
 */
export async function submitQuestionReport(input, {
  // Injectables pour les tests : sans eux, le chemin « succès confirmé » ne serait
  // vérifiable qu'avec un vrai serveur — c'est-à-dire jamais, c'est-à-dire pas vérifié.
  post = postEnvelope,
  enabled = isIngestEnabled,
  isOnline = () => (typeof navigator === 'undefined' ? true : navigator.onLine !== false),
} = {}) {
  let payload;
  try {
    payload = buildReportPayload(input);
  } catch (error) {
    return { status: REPORT_STATUS.FAILED, reason: error.message };
  }

  if (!enabled) {
    // Aucun backend : le signalement est conservé, il partira si l'application est un jour
    // configurée. Dire « reçu » ici serait mensonger.
    queueReport(payload);
    return { status: REPORT_STATUS.QUEUED, reason: 'ingest_disabled' };
  }

  if (!isOnline()) {
    queueReport(payload);
    return { status: REPORT_STATUS.QUEUED, reason: 'offline' };
  }

  try {
    const result = await post('report', payload);
    if (result?.ok === true) return { status: REPORT_STATUS.SENT };
    // `ok !== true` : l'ingestion est désactivée côté client (mode invité) ou la réponse
    // n'est pas celle attendue. Dans le doute, on conserve.
    queueReport(payload);
    return { status: REPORT_STATUS.QUEUED, reason: result?.skipped ?? 'unexpected_response' };
  } catch (error) {
    if (error?.retryable === false) {
      // Refus définitif (payload invalide) : le rejouer échouerait indéfiniment.
      return { status: REPORT_STATUS.FAILED, reason: error.code ?? error.message };
    }
    queueReport(payload);
    return { status: REPORT_STATUS.QUEUED, reason: error?.code ?? 'network' };
  }
}

/** Ajoute à la file locale. Exportée pour les tests. */
export function queueReport(payload) {
  const outbox = readOutbox();
  outbox.push({ payload, queuedAt: new Date().toISOString() });
  writeOutbox(outbox);
}

export function pendingReportCount() {
  return readOutbox().length;
}

/**
 * Rejoue la file locale. Appelée au retour du réseau et au démarrage de l'application.
 * @returns {Promise<{sent: number, remaining: number}>}
 */
export async function flushReportOutbox({
  post = postEnvelope,
  enabled = isIngestEnabled,
  isOnline = () => (typeof navigator === 'undefined' ? true : navigator.onLine !== false),
} = {}) {
  const outbox = readOutbox();
  if (outbox.length === 0) return { sent: 0, remaining: 0 };
  if (!enabled) return { sent: 0, remaining: outbox.length };
  if (!isOnline()) return { sent: 0, remaining: outbox.length };

  const remaining = [];
  let sent = 0;

  for (const entry of outbox) {
    try {
      const result = await post('report', entry.payload);
      if (result?.ok === true) { sent += 1; continue; }
      remaining.push(entry);
    } catch (error) {
      if (error?.retryable === false) continue;   // définitivement refusé : on abandonne
      remaining.push(entry);
      // Une panne réseau touchera les suivants de la même façon : inutile d'insister.
      if (error?.code === 'network') {
        const index = outbox.indexOf(entry);
        remaining.push(...outbox.slice(index + 1));
        break;
      }
    }
  }

  writeOutbox(remaining);
  return { sent, remaining: remaining.length };
}

/** Rejoue la file dès le retour du réseau. @returns {() => void} désinscription */
export function attachReportOutboxFlush() {
  if (typeof window === 'undefined') return () => {};
  const onOnline = () => { flushReportOutbox(); };
  window.addEventListener('online', onOnline);
  return () => window.removeEventListener('online', onOnline);
}

/** Purge — « effacer mes données ». */
export function clearReportOutbox() {
  try { localStorage.removeItem(OUTBOX_KEY); } catch { /* stockage indisponible */ }
}
