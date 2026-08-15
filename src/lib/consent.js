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
export const CONSENT_POLICY_VERSION = '2026-08-b';

/**
 * Version de la formulation présentée par `ConsentModal.jsx` avant août 2026.
 *
 * Ce texte décrivait : la sauvegarde du profil et des réponses sur un COMPTE, retrouvables
 * sur un autre appareil, et l'exploitation « de façon groupée, jamais avec ton nom » des
 * tendances politiques. Il ne mentionnait NI le temps passé sur chaque question, NI un
 * identifiant pseudonyme d'analyse, NI la conservation des questions ignorées et des
 * « sans opinion ». Il couvre donc `cloud_save` — et RIEN d'autre.
 *
 * L'interface de l'époque ne calculait aucune empreinte de texte. Il n'y en a donc pas à
 * restituer, et en fabriquer une aujourd'hui recréerait la fausse preuve qu'on corrige :
 * les décisions migrées portent `textHash: null` et `textHashAvailable: false`.
 */
export const LEGACY_POLICY_VERSION = '2026-07';

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
    // ⚠ NE PAS ÉCRIRE « anonyme » ICI. Le flux dépose un identifiant pseudonyme persistant
    // (`poliscop_analytics_sid`) pour relier les étapes d'une même passation. C'est de la
    // pseudonymisation, pas de l'anonymat : le mot « anonyme » promettrait davantage que ce
    // que le dispositif fait, et c'est précisément ce que le texte doit éviter.
    [PURPOSES.POLITICAL_ANALYTICS]:
      'Analyser vos réponses au questionnaire et le temps passé sur chaque question, pour '
      + 'améliorer la formulation des questions et publier des statistiques agrégées. Un '
      + 'identifiant aléatoire, distinct de votre compte, sert à relier les étapes d’une même '
      + 'passation. Vos réponses ne sont reliées à aucun compte, ni à votre nom, ni à votre '
      + 'adresse électronique. Conservation : 25 mois.',
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
      'Analyse your questionnaire answers and the time spent on each question, to improve '
      + 'question wording and publish aggregate statistics. A random identifier, separate '
      + 'from your account, links the steps of a single session. Your answers are not linked '
      + 'to any account, name or email address. Retention: 25 months.',
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
 * Décision relative à une finalité, sous forme normalisée.
 *
 * Une décision porte SA PROPRE provenance — la version du texte réellement présenté, son
 * empreinte, la date. Un état global « version : 2026-08 » ne dit rien de ce qu'une personne
 * a vu quand elle a cliqué, et c'est précisément ce qui permettait d'estampiller une décision
 * de 2026-07 avec le texte de 2026-08.
 *
 * @typedef {{granted: boolean|null, decidedAt: string|null, policyVersion: string|null,
 *            textHash: string|null, textHashAvailable: boolean}} ConsentDecision
 */

/** Décision « rien de décidé ». */
function undecided() {
  return { granted: null, decidedAt: null, policyVersion: null, textHash: null, textHashAvailable: false };
}

/**
 * Lit la décision d'une finalité, quelle que soit la forme stockée.
 *
 * Accepte les trois formes qui coexistent : `null` (non décidé), un booléen nu (forme
 * historique, sans provenance) et l'objet complet. Toute lecture passe par ici — c'est ce
 * qui permet de faire évoluer la forme sans réécrire chaque appelant.
 *
 * @returns {ConsentDecision}
 */
export function decisionOf(consentState, purpose) {
  const raw = consentState?.[purpose];
  if (raw === true || raw === false) {
    // Booléen nu : la provenance n'est portée que par l'état global. Sans version, la
    // décision vient de l'interface courante ; avec une version antérieure, son texte n'est
    // pas celui d'aujourd'hui et aucune empreinte courante ne peut lui être attribuée.
    const policyVersion = consentState?.version ?? null;
    return {
      granted: raw,
      decidedAt: consentState?.decidedAt ?? null,
      policyVersion,
      textHash: null,
      textHashAvailable: policyVersion == null || policyVersion === CONSENT_POLICY_VERSION,
    };
  }
  if (raw && typeof raw === 'object') return { ...undecided(), ...raw };
  return undecided();
}

/** Construit une décision prise SOUS LE TEXTE COURANT, empreinte comprise. */
export function currentDecision(granted, { purpose, language = 'fr', decidedAt } = {}) {
  if (granted !== true && granted !== false) return undecided();
  return {
    granted,
    decidedAt: decidedAt ?? new Date().toISOString(),
    policyVersion: CONSENT_POLICY_VERSION,
    textHash: textFingerprint(consentTextFor(purpose, language)),
    textHashAvailable: true,
  };
}

/**
 * Convertit l'ancien état à deux champs (`{politicalData, measurement}`) vers les quatre
 * finalités, sans jamais INVENTER un consentement.
 *
 * ⚠ CORRECTION P0-3 (2026-08-10). La version précédente reportait `politicalData: true` sur
 * `political_analytics` ET `cloud_save`. C'était fabriquer un consentement : le texte de
 * 2026-07 ne mentionnait ni la mesure du temps par question, ni l'identifiant pseudonyme
 * d'analyse, ni la conservation des questions ignorées. Une personne n'a pas pu accepter un
 * texte qui n'existait pas.
 *
 * Règle appliquée :
 *   • `cloud_save`          ← `politicalData`, avec la version 2026-07 (le texte le couvrait) ;
 *   • `measurement`         ← `measurement`,   avec la version 2026-07 ;
 *   • `political_analytics` ← TOUJOURS non décidé : à redemander sous le texte courant ;
 *   • `research`            ← TOUJOURS non décidé : jamais présentée.
 */
export function normalizeConsent(legacy) {
  if (!legacy) return emptyConsentState();

  // Déjà au nouveau format ?
  if (PURPOSES.POLITICAL_ANALYTICS in legacy) {
    return { ...emptyConsentState(), ...legacy };
  }

  const legacyDecision = (value) => {
    if (value !== true && value !== false) return null;
    return {
      granted: value,
      decidedAt: legacy.grantedAt ?? null,
      policyVersion: LEGACY_POLICY_VERSION,
      textHash: null,          // jamais calculée à l'époque ; ne pas en fabriquer une
      textHashAvailable: false,
    };
  };

  return {
    [PURPOSES.MEASUREMENT]:         legacyDecision(legacy.measurement),
    [PURPOSES.POLITICAL_ANALYTICS]: null,
    [PURPOSES.CLOUD_SAVE]:          legacyDecision(legacy.politicalData),
    [PURPOSES.RESEARCH]:            null,
    decidedAt: legacy.grantedAt ?? null,
    version:   legacy.version ?? LEGACY_POLICY_VERSION,
  };
}

/** `true` UNIQUEMENT sur une acceptation explicite. `null` et `undefined` valent refus. */
export function isGranted(consentState, purpose) {
  return decisionOf(consentState, purpose).granted === true;
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
/**
 * Quel identifiant une finalité a-t-elle le droit de porter ?
 *
 * ⚠ CLOISONNEMENT PAR FINALITÉ — LE CŒUR DE LA PROMESSE.
 *
 * Chaque enregistrement portait AUTREFOIS `anonymous_session_id` ET `user_id`, quelle que
 * soit la finalité. Une ligne `political_analytics` contenait donc simultanément le
 * pseudonyme politique et l'identifiant de compte : exactement la table de correspondance
 * que le texte de consentement promet de ne pas créer. Le texte disait « vos réponses ne
 * sont reliées à aucun compte » pendant que la ligne établissait le lien.
 *
 * Les identifiants sont désormais attribués finalité par finalité, et une finalité ne peut
 * jamais en porter deux. Aucune déduction implicite : un identifiant non fourni vaut `null`,
 * il n'est pas emprunté à une autre finalité.
 */
export const PURPOSE_IDENTIFIER = Object.freeze({
  /** Opinions politiques : pseudonyme d'analyse SEUL. Jamais le compte. */
  [PURPOSES.POLITICAL_ANALYTICS]: 'analytics_pseudonym',
  /** Sauvegarde : compte SEUL. Jamais le pseudonyme d'analyse. */
  [PURPOSES.CLOUD_SAVE]:          'account',
  /** Mesure d'audience : son propre pseudonyme, distinct de celui des opinions. */
  [PURPOSES.MEASUREMENT]:         'measurement_pseudonym',
  /** Recherche : identifiant explicite. Rien n'est déduit de l'analyse politique. */
  [PURPOSES.RESEARCH]:            'research_pseudonym',
});

/**
 * Les deux colonnes d'identifiant d'un enregistrement, pour une finalité donnée.
 * Exactement une peut être non nulle — jamais les deux, et jamais aucune.
 */
export function identifiersFor(purpose, { analyticsPseudonym, userId, measurementPseudonym, researchPseudonym } = {}) {
  switch (PURPOSE_IDENTIFIER[purpose]) {
    case 'account':
      return { anonymous_session_id: null, user_id: userId ?? null };
    case 'measurement_pseudonym':
      return { anonymous_session_id: measurementPseudonym ?? null, user_id: null };
    case 'research_pseudonym':
      return { anonymous_session_id: researchPseudonym ?? null, user_id: null };
    case 'analytics_pseudonym':
    default:
      return { anonymous_session_id: analyticsPseudonym ?? null, user_id: null };
  }
}

/**
 * Finalités pour lesquelles une PREUVE SERVEUR est transmise aujourd'hui.
 *
 * ⚠ DÉCISION PRODUIT EXPLICITE (P0-2, 2026-08-14). L'option paresseuse — émettre quand même
 * une ligne, avec un sujet nul — a été écartée : elle produit une ligne que la base refuse
 * (contrainte `consent_records_purpose_identifier_form`) ou, pire, une TOMBSTONE que le
 * serveur ne peut pas exécuter, présentée à l'utilisateur comme « suppression en cours ».
 *
 *   • `political_analytics` — le pseudonyme d'analyse existe et est géré
 *     (`attemptSession.analyticsSessionId`). Preuve transmise.
 *   • `cloud_save`          — le compte existe. Preuve transmise.
 *   • `measurement`         — le pseudonyme de mesure existe et est géré
 *     (`anonymous.js`, `poliscop_anon_id`), DISTINCT de celui des opinions. Preuve transmise
 *     quand il est fourni ; sinon la décision reste locale.
 *   • `research`            — AUCUN flux de recherche n'existe en production : ni pseudonyme
 *     dédié, ni table, ni destinataire. Créer un identifiant persistant pour un traitement
 *     qui n'existe pas serait déposer un traceur sans usage. Aucune preuve serveur n'est donc
 *     transmise ; la décision est conservée localement, datée et empreinte, et sera
 *     transmise le jour où le traitement existera. Ne JAMAIS emprunter le pseudonyme
 *     politique pour la combler.
 */
export const SERVER_PROOF_PURPOSES = Object.freeze([
  PURPOSES.POLITICAL_ANALYTICS,
  PURPOSES.CLOUD_SAVE,
  PURPOSES.MEASUREMENT,
]);

/** Motifs pour lesquels une décision reste locale. Affichés tels quels dans les diagnostics. */
export const SKIP_REASON = Object.freeze({
  /** Aucun sujet technique : le serveur ne saurait ni à qui rattacher, ni quoi supprimer. */
  NO_SUBJECT: 'no_subject',
  /** Finalité sans flux serveur à ce jour (voir `SERVER_PROOF_PURPOSES`). */
  NO_SERVER_FLOW: 'no_server_flow',
});

/**
 * Construit les enregistrements de décision à transmettre.
 *
 * ⚠ DEUX CORRECTIFS STRUCTURELS (P0-2, 2026-08-14).
 *
 * 1. `purposes` RESTREINT l'émission aux finalités RÉELLEMENT MODIFIÉES. La version
 *    précédente reconstruisait toutes les décisions connues à chaque changement : cocher la
 *    mesure d'audience réémettait la décision politique prise trois semaines plus tôt, avec
 *    une nouvelle tentative d'envoi — et, si le pseudonyme correspondant avait été effacé
 *    entre-temps, une ligne sans sujet.
 *
 * 2. Une ligne SANS SUJET n'est jamais produite. Elle est écartée et rendue dans `skipped`,
 *    avec son motif, pour que l'appelant puisse le dire plutôt que de le taire.
 *
 * @returns {{records: Array, skipped: Array<{purpose: string, granted: boolean, reason: string}>}}
 */
export function buildConsentDecisions(consentState, {
  anonymousSessionId,          // pseudonyme d'ANALYSE POLITIQUE
  userId,                      // identifiant de COMPTE
  measurementId = null,        // pseudonyme de MESURE D'AUDIENCE, distinct
  researchId = null,           // pseudonyme de RECHERCHE, explicite
  purposes = ALL_PURPOSES,     // finalités à transmettre — les MODIFIÉES, pas toutes
  language = 'fr',
  clientRelease,
} = {}) {
  const records = [];
  const skipped = [];
  const now = new Date().toISOString();
  const demandees = new Set(Array.isArray(purposes) ? purposes : [purposes]);

  for (const purpose of ALL_PURPOSES) {
    if (!demandees.has(purpose)) continue;
    const decision = decisionOf(consentState, purpose);
    if (decision.granted !== true && decision.granted !== false) continue;

    if (!SERVER_PROOF_PURPOSES.includes(purpose)) {
      skipped.push({ purpose, granted: decision.granted, reason: SKIP_REASON.NO_SERVER_FLOW });
      continue;
    }

    const identifiers = identifiersFor(purpose, {
      analyticsPseudonym: anonymousSessionId,
      userId,
      measurementPseudonym: measurementId,
      researchPseudonym: researchId,
    });

    // ⚠ LE point de contrôle. Sans sujet, une ligne de consentement ne prouve rien et une
    // ligne de retrait ne supprime rien : les deux sont refusées ici, jamais mises en file.
    if (identifiers.anonymous_session_id == null && identifiers.user_id == null) {
      skipped.push({ purpose, granted: decision.granted, reason: SKIP_REASON.NO_SUBJECT });
      continue;
    }

    // ⚠ La provenance vient de la DÉCISION, jamais des constantes du module. Estampiller
    // toute ligne avec CONSENT_POLICY_VERSION revenait à déclarer qu'une personne avait
    // accepté le texte courant, y compris quand sa décision datait d'une version antérieure.
    const underCurrentText = decision.policyVersion === CONSENT_POLICY_VERSION
      || decision.policyVersion == null;
    const policyVersion = decision.policyVersion ?? CONSENT_POLICY_VERSION;
    const textHash = decision.textHash
      ?? (underCurrentText && decision.textHashAvailable !== false
        ? textFingerprint(consentTextFor(purpose, language))
        : null);

    records.push({
      ...identifiers,
      purpose,
      granted:              decision.granted,
      policy_version:       policyVersion,
      text_hash:            textHash,
      // Dit explicitement si l'empreinte est vérifiable. `null` seul serait ambigu : panne
      // de calcul ou texte jamais empreint ? Ici, c'est une propriété connue de la décision.
      text_hash_available:  textHash != null,
      decided_at:           decision.decidedAt ?? now,
      retention_until:      decision.granted ? retentionUntil(purpose) : null,
      client_release:       clientRelease ?? null,
      language,
    });
  }
  return { records, skipped };
}

/** Les seuls enregistrements TRANSMISSIBLES. Voir `buildConsentDecisions` pour les écartés. */
export function buildConsentRecords(consentState, options = {}) {
  return buildConsentDecisions(consentState, options).records;
}

/**
 * La décision enregistrée porte-t-elle sur le texte ACTUELLEMENT affiché ?
 *
 * Une décision reste valable tant que la formulation n'a pas changé. Si le texte évolue, la
 * personne n'a pas consenti à la nouvelle version : il faut redemander, sans jamais reporter
 * l'ancien accord sur le nouveau texte.
 */
export function decisionIsCurrent(decision, { purpose, language = 'fr' } = {}) {
  if (!decision || typeof decision !== 'object') return false;
  if (decision.granted !== true && decision.granted !== false) return false;
  if (decision.policyVersion !== CONSENT_POLICY_VERSION) return false;
  // Sans empreinte disponible (décisions migrées), on ne peut PAS affirmer que le texte lu
  // était celui-ci : on redemande plutôt que de supposer.
  if (decision.textHashAvailable !== true) return false;
  return decision.textHash === textFingerprint(consentTextFor(purpose, language));
}

/**
 * Faut-il (re)poser la question ?
 *
 * ⚠ Ne JAMAIS brancher cet appel sur `sessionStorage`. L'affichage dépendait d'un drapeau de
 * session : une personne ayant accepté — ou refusé — était redemandée à chaque nouvelle
 * session, et chaque clic réécrivait une décision déjà prise, brouillant sa provenance et sa
 * date. Une décision actuelle se respecte jusqu'à modification volontaire.
 */
export function needsCollectionDecision(collectionConsent, { purpose = PURPOSES.POLITICAL_ANALYTICS, language = 'fr' } = {}) {
  return !decisionIsCurrent(collectionConsent?.[purpose], { purpose, language });
}
