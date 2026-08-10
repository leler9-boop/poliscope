// POLISCOP — Finalités de consentement.
//
// QUATRE FINALITÉS DISTINCTES, QUATRE DÉCISIONS DISTINCTES
// --------------------------------------------------------
// Le modèle précédent en avait deux (`politicalData`, `measurement`) et mélangeait sous
// « données politiques » deux traitements que le RGPD ne permet pas de confondre :
// l'analyse statistique anonyme et la sauvegarde personnelle rattachée à un compte.
//
//   measurement          — audience : écrans, étapes, compteurs. AUCUN contenu politique.
//   political_analytics  — réponses anonymes, temps par question, données de passation.
//   cloud_save           — sauvegarde personnelle liée à un compte (multi-appareils).
//   research             — réutilisation scientifique ultérieure. JAMAIS précoché, jamais
//                          déduit d'une autre acceptation.
//
// RÈGLE ABSOLUE : aucune réponse politique ne quitte l'appareil sans `political_analytics`
// OU `cloud_save`. La vérification vit dans `canTransmitPoliticalData()` ci-dessous, et
// elle est doublée côté base par `private.has_consent()` — deux barrières indépendantes,
// parce qu'un frontend se contourne.

/** Version de la FORMULATION. À incrémenter dès que le texte affiché change en substance. */
export const CONSENT_POLICY_VERSION = '2026-08';

export const PURPOSES = Object.freeze({
  MEASUREMENT:         'measurement',
  POLITICAL_ANALYTICS: 'political_analytics',
  CLOUD_SAVE:          'cloud_save',
  RESEARCH:            'research',
});

export const ALL_PURPOSES = Object.freeze(Object.values(PURPOSES));

/**
 * Durée de conservation ANNONCÉE, par finalité. Ces chaînes sont affichées à l'utilisateur
 * ET envoyées avec la décision (`retention_until`) : ce qui est promis est enregistré.
 * Elles doivent rester cohérentes avec `private.retention_policies`
 * (20260810130000_retention_and_purge.sql) — `tests/data/consent-retention.test.mjs` échoue
 * si un couple diverge.
 */
export const RETENTION_MONTHS = Object.freeze({
  [PURPOSES.MEASUREMENT]:         13,
  [PURPOSES.POLITICAL_ANALYTICS]: 25,
  [PURPOSES.CLOUD_SAVE]:          null,   // tant que le compte existe — supprimé avec lui
  [PURPOSES.RESEARCH]:            25,
});

/**
 * Textes exacts soumis à l'utilisateur. Leur empreinte accompagne chaque décision : sans
 * elle, « version 2026-08 » est une affirmation invérifiable a posteriori.
 */
export const CONSENT_TEXTS = Object.freeze({
  fr: Object.freeze({
    [PURPOSES.MEASUREMENT]:
      'Mesurer l’audience du site : écrans consultés, étapes franchies, compteurs. '
      + 'Aucune de vos réponses, aucun thème, aucun candidat n’est transmis. '
      + 'Conservation : 13 mois.',
    [PURPOSES.POLITICAL_ANALYTICS]:
      'Analyser de façon anonyme vos réponses au questionnaire et le temps passé sur '
      + 'chaque question, pour améliorer la formulation des questions et publier des '
      + 'statistiques agrégées. Vos réponses ne sont reliées à aucun compte. '
      + 'Conservation : 25 mois.',
    [PURPOSES.CLOUD_SAVE]:
      'Enregistrer votre profil et vos réponses sur votre compte, pour les retrouver sur '
      + 'un autre appareil. Conservation : tant que votre compte existe ; supprimé avec lui.',
    [PURPOSES.RESEARCH]:
      'Autoriser la réutilisation de vos réponses anonymes dans des travaux de recherche '
      + 'publics sur les opinions politiques. Indépendant des autres choix. '
      + 'Conservation : 25 mois.',
  }),
  en: Object.freeze({
    [PURPOSES.MEASUREMENT]:
      'Measure site audience: screens viewed, steps completed, counters. '
      + 'None of your answers, themes or candidates are transmitted. Retention: 13 months.',
    [PURPOSES.POLITICAL_ANALYTICS]:
      'Anonymously analyse your questionnaire answers and the time spent on each question, '
      + 'to improve question wording and publish aggregate statistics. Your answers are not '
      + 'linked to any account. Retention: 25 months.',
    [PURPOSES.CLOUD_SAVE]:
      'Save your profile and answers to your account so you can find them on another '
      + 'device. Retention: as long as your account exists; deleted with it.',
    [PURPOSES.RESEARCH]:
      'Allow your anonymous answers to be reused in public research on political opinions. '
      + 'Independent of your other choices. Retention: 25 months.',
  }),
});

/**
 * Empreinte de la formulation acceptée.
 *
 * FNV-1a 32 bits : ce n'est PAS un condensat cryptographique et le préfixe le dit. On
 * cherche à détecter qu'un texte a changé, pas à résister à un adversaire — et une
 * fonction synchrone évite de rendre asynchrone tout l'enregistrement du consentement
 * (`crypto.subtle` ne fonctionne d'ailleurs pas en contexte non sécurisé).
 */
export function textFingerprint(text) {
  let hash = 0x811c9dc5;
  const value = String(text ?? '');
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return `fnv1a32:${hash.toString(16).padStart(8, '0')}`;
}

export function consentTextFor(purpose, language = 'fr') {
  const table = CONSENT_TEXTS[language] ?? CONSENT_TEXTS.fr;
  return table[purpose] ?? '';
}

export function retentionUntil(purpose, from = new Date()) {
  const months = RETENTION_MONTHS[purpose];
  if (months == null) return null;
  const date = new Date(from);
  date.setMonth(date.getMonth() + months);
  return date.toISOString();
}

/**
 * État de consentement vierge. `null` = NON DÉCIDÉ, distinct de `false` = refusé.
 * Le défaut est `null` partout : aucune case n'est précochée, et l'absence de décision
 * n'autorise rien.
 */
export function emptyConsentState() {
  return {
    [PURPOSES.MEASUREMENT]:         null,
    [PURPOSES.POLITICAL_ANALYTICS]: null,
    [PURPOSES.CLOUD_SAVE]:          null,
    [PURPOSES.RESEARCH]:            null,
    decidedAt: null,
    version: null,
  };
}

/**
 * Convertit l'ancien état à deux champs (`{politicalData, measurement}`) vers les quatre
 * finalités, sans jamais INVENTER un consentement.
 *
 * Choix de conversion, explicite : `politicalData: true` valait pour la sauvegarde cloud
 * ET pour l'analyse — c'était le défaut du modèle. On reporte donc l'acceptation sur ces
 * deux finalités, qui étaient effectivement décrites dans le texte accepté. `research`
 * reste `null` : elle n'a jamais été présentée, elle ne peut pas être déduite.
 */
export function normalizeConsent(legacy) {
  if (!legacy) return emptyConsentState();

  // Déjà au nouveau format ?
  if (PURPOSES.POLITICAL_ANALYTICS in legacy) {
    return { ...emptyConsentState(), ...legacy };
  }

  const political = legacy.politicalData;
  return {
    [PURPOSES.MEASUREMENT]:         legacy.measurement ?? null,
    [PURPOSES.POLITICAL_ANALYTICS]: political ?? null,
    [PURPOSES.CLOUD_SAVE]:          political ?? null,
    [PURPOSES.RESEARCH]:            null,
    decidedAt: legacy.grantedAt ?? null,
    version:   legacy.version ?? null,
  };
}

/** `true` UNIQUEMENT sur une acceptation explicite. `null` et `undefined` valent refus. */
export function isGranted(consentState, purpose) {
  return consentState?.[purpose] === true;
}

/**
 * LE point de contrôle du produit : une réponse politique peut-elle quitter l'appareil ?
 * Toute surface qui transmet une réponse DOIT passer par ici.
 */
export function canTransmitPoliticalData(consentState) {
  return isGranted(consentState, PURPOSES.POLITICAL_ANALYTICS)
      || isGranted(consentState, PURPOSES.CLOUD_SAVE);
}

/** Les données de passation (temps, abandon, mode) relèvent de la seule analyse politique. */
export function canCollectAttemptData(consentState) {
  return isGranted(consentState, PURPOSES.POLITICAL_ANALYTICS);
}

/**
 * Construit les enregistrements de décision à envoyer, un par finalité DÉCIDÉE.
 * Une finalité laissée à `null` ne produit aucune ligne : ne pas décider n'est pas refuser,
 * et fabriquer un « refus » n'aurait pas la même valeur probatoire.
 */
export function buildConsentRecords(consentState, { anonymousSessionId, userId, language = 'fr', clientRelease } = {}) {
  const records = [];
  const decidedAt = new Date().toISOString();

  for (const purpose of ALL_PURPOSES) {
    const decision = consentState?.[purpose];
    if (decision !== true && decision !== false) continue;

    const text = consentTextFor(purpose, language);
    records.push({
      anonymous_session_id: anonymousSessionId ?? null,
      user_id:              userId ?? null,
      purpose,
      granted:              decision,
      policy_version:       CONSENT_POLICY_VERSION,
      text_hash:            textFingerprint(text),
      decided_at:           decidedAt,
      retention_until:      decision ? retentionUntil(purpose) : null,
      client_release:       clientRelease ?? null,
      language,
    });
  }
  return records;
}
