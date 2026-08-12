// POLISCOP — Journal de la SECONDE LECTURE des positions codées.
//
// POURQUOI CE FICHIER EXISTE SÉPARÉMENT
// -------------------------------------
// `candidateProvenance.js` porte le CODAGE : ce qu'on affirme d'un candidat, et sur quelle
// source. Ce fichier-ci porte la RELECTURE : qui a rouvert la source, quand, et ce qu'il a
// constaté. Les garder ensemble laisserait croire qu'une position relue et une position
// simplement codée ont le même statut de preuve.
//
// ⚠ RÈGLE CENTRALE. Une estimation éditoriale n'est JAMAIS promue automatiquement en position
// vérifiée. Le passage à `approved` exige qu'un relecteur ait ouvert la source, retrouvé
// l'extrait, et jugé que la déclaration répond bien à la question posée — les trois, pas
// deux sur trois.
//
// ⚠ CE QUE CETTE RELECTURE N'EST PAS. Elle a été conduite par un modèle (voir `reviewerType`),
// pas par un second rédacteur humain. Elle vaut donc comme contrôle documentaire — la source
// dit-elle ce qu'on lui fait dire ? — et non comme validation éditoriale indépendante. Les
// positions que le relecteur a lui-même recodées restent `pending_review`, faute de quoi il
// se relirait lui-même.
//
// Codage d'origine : `codex-source-pass-2026-08-10`.

export const REVIEW_PASS_VERSION = 'second-reading-2026-08-12';

/** Ce qu'une relecture peut conclure. */
export const REVIEW_VERDICT = {
  /** Source ouverte, extrait retrouvé, intensité défendable. */
  APPROVED: 'approved',
  /** Source ouverte, mais l'intensité ou la portée codée dépasse ce qu'elle soutient. */
  CORRECTED: 'corrected',
  /** Source ouverte, mais elle ne répond pas à la question posée. */
  REJECTED: 'rejected',
  /** Source inaccessible ou illisible avec les moyens disponibles : rien n'est conclu. */
  UNVERIFIED: 'unverified',
};

const REVIEWER = Object.freeze({
  reviewedBy: 'claude-opus-5',
  reviewerType: 'model',
  reviewerVersion: REVIEW_PASS_VERSION,
  reviewedAt: '2026-08-12',
});

/**
 * Une entrée par position relue. `sourceOpened` dit si l'URL a réellement été ouverte
 * pendant CETTE passe — pas si elle est réputée valide.
 */
export const SECOND_READING = Object.freeze([
  // ── David Lisnard ────────────────────────────────────────────────────────
  {
    candidateId: 'david-lisnard', questionId: 'fr_2027_q1', verdict: REVIEW_VERDICT.UNVERIFIED,
    sourceOpened: false, ...REVIEWER,
    notes: 'Source hébergée sur x.com : la page exige une session authentifiée et n’a pas pu '
      + 'être ouverte. L’extrait cité est plausible mais non revérifié. Une position dont la '
      + 'source n’est pas consultable publiquement ne doit pas être approuvée.',
  },
  {
    candidateId: 'david-lisnard', questionId: 'fr_2027_q2', verdict: REVIEW_VERDICT.APPROVED,
    sourceOpened: true, ...REVIEWER,
    notes: '« Diviser par huit la délivrance de titres de séjour » figure littéralement dans le '
      + 'programme, avec quotas, fin de l’automaticité du droit du sol et suppression de l’AME. '
      + 'L’intensité 2 est soutenue par la page elle-même.',
  },
  {
    candidateId: 'david-lisnard', questionId: 'fr_2027_q3', verdict: REVIEW_VERDICT.APPROVED,
    sourceOpened: true, ...REVIEWER,
    notes: 'Entretien du 29/06/2026 attribué nommément à Lisnard : « prolonger le parc, exécuter '
      + 'l’EPR2, lancer les petits réacteurs modulaires », plus fusion et thorium. Investissement '
      + 'lourd et de long terme : intensité 2 justifiée.',
  },
  {
    candidateId: 'david-lisnard', questionId: 'fr_2027_q4', verdict: REVIEW_VERDICT.APPROVED,
    sourceOpened: true, ...REVIEWER,
    notes: 'La phrase citée figure littéralement. Les deux faces coexistent réellement dans la '
      + 'source — outil de puissance européen d’un côté, rapatriement de compétences de l’autre. '
      + 'L’intensité 1 plutôt que 2 est le bon codage : le nuancement était déjà fait.',
  },
  {
    candidateId: 'david-lisnard', questionId: 'fr_2027_q6', verdict: REVIEW_VERDICT.CORRECTED,
    sourceOpened: true, ...REVIEWER,
    suggestedStance: -1, codedStance: -2,
    notes: 'La phrase citée figure bien dans le discours de Saint-Raphaël. Mais le raisonnement '
      + 'affirmait un rejet explicite d’une écologie « qui renchérit les coûts des ménages » : le '
      + 'discours oppose l’écologie d’innovation à une écologie « punitive et bureaucratique » et '
      + 'critique des réglementations jugées inefficaces, sans traiter la clause de coût de la '
      + 'question. Il soutient par ailleurs l’action climatique par la technologie. Une opposition '
      + 'maximale (-2) attribue à la source une portée qu’elle n’a pas ; -1 est défendable.',
  },
  {
    candidateId: 'david-lisnard', questionId: 'fr_2027_q7', verdict: REVIEW_VERDICT.APPROVED,
    sourceOpened: true, ...REVIEWER,
    notes: '« accès aux fichiers, possibilité de verbalisation renforcée » figure littéralement '
      + 'dans la page Sécurité, parmi un ensemble d’outils accrus. Intensité 2 soutenue.',
  },
  {
    candidateId: 'david-lisnard', questionId: 'fr_2027_q8', verdict: REVIEW_VERDICT.REJECTED,
    sourceOpened: true, ...REVIEWER,
    notes: '⚠ La déclaration ne répond pas à la question posée. La question porte sur l’impôt sur '
      + 'les SOCIÉTÉS ; la source ne traite que des impôts de PRODUCTION (C3S, CVAE, 2 % → 1 % du '
      + 'PIB) et ne propose pas de baisse de l’IS. Deux prélèvements distincts, deux débats '
      + 'distincts. À recoder sur une source traitant de l’IS, ou à laisser inconnue.',
  },
  {
    candidateId: 'david-lisnard', questionId: 'fr_2027_q9', verdict: REVIEW_VERDICT.APPROVED,
    sourceOpened: true, ...REVIEWER,
    notes: '« l’OTAN, le soutien à l’Ukraine, le renforcement de la base industrielle de défense '
      + 'européenne » figure dans l’entretien. Le codeur avait explicitement retenu 1 et non 2 '
      + 'faute d’engagement de durée : ce refus de surinterpréter est confirmé par la source.',
  },
  {
    candidateId: 'david-lisnard', questionId: 'fr_2027_q10', verdict: REVIEW_VERDICT.APPROVED,
    sourceOpened: true, ...REVIEWER,
    notes: '« interdiction du voile à l’université » figure littéralement. La mesure vise une '
      + 'institution publique précise, pas l’espace public en général : l’intensité 1 est le bon '
      + 'codage, 2 aurait généralisé.',
  },
  {
    candidateId: 'david-lisnard', questionId: 'fr_2027_q15', verdict: REVIEW_VERDICT.APPROVED,
    sourceOpened: true, ...REVIEWER,
    notes: 'Discours de Bayeux du 17/06/2026, texte extrait du PDF : « Le référendum d’initiative '
      + 'populaire sera vraiment institué et rendu praticable, avec un seuil de signatures '
      + 'atteignable et, au terme du délai, un vote garanti. » Extrait et raisonnement exacts.',
  },
  {
    candidateId: 'david-lisnard', questionId: 'fr_2027_q16', verdict: REVIEW_VERDICT.CORRECTED,
    sourceOpened: true, ...REVIEWER,
    suggestedStance: 1, codedStance: 2,
    notes: 'Chronique signée Lisnard pour l’Opinion. « la réévaluation à la hausse de notre '
      + 'arsenal » figure littéralement, et l’autonomie stratégique est clairement soutenue. Mais '
      + 'la question associe hausse ET extension de la dissuasion : sur l’extension aux '
      + 'partenaires, la source est expressément réservée (risque des vecteurs sur bases '
      + 'étrangères, désaccord avec l’Allemagne, « la France reste la seule et unique '
      + 'décisionnaire »). L’intensité 2 lisse cette réserve.',
  },

  // ── Gabriel Attal ────────────────────────────────────────────────────────
  {
    candidateId: 'gabriel-attal', questionId: 'fr_2027_q1', verdict: REVIEW_VERDICT.UNVERIFIED,
    sourceOpened: false, ...REVIEWER,
    notes: 'Source non ouverte pendant cette passe. Aucun jugement porté.',
  },
  {
    candidateId: 'gabriel-attal', questionId: 'fr_2027_q2', verdict: REVIEW_VERDICT.APPROVED,
    sourceOpened: true, ...REVIEWER,
    notes: '« accueillir moins pour accueillir mieux » figure dans le programme, avec système à '
      + 'points et critères. Réduction réelle mais assumée comme sélective : l’intensité 1 plutôt '
      + 'que 2 correspond à ce que dit la source.',
  },
  {
    candidateId: 'gabriel-attal', questionId: 'fr_2027_q4', verdict: REVIEW_VERDICT.UNVERIFIED,
    sourceOpened: false, ...REVIEWER,
    notes: 'Source non ouverte pendant cette passe. Aucun jugement porté.',
  },
  {
    candidateId: 'gabriel-attal', questionId: 'fr_2027_q8', verdict: REVIEW_VERDICT.UNVERIFIED,
    sourceOpened: false, ...REVIEWER,
    notes: 'Source non ouverte pendant cette passe. Aucun jugement porté.',
  },
  {
    candidateId: 'gabriel-attal', questionId: 'fr_2027_q9', verdict: REVIEW_VERDICT.APPROVED,
    sourceOpened: true, ...REVIEWER,
    notes: '« Nous allons continuer sans relâche à soutenir l’Ukraine », adossé à un argument de '
      + 'dissuasion régionale. Engagement durable et explicite : intensité 2 soutenue.',
  },
  {
    candidateId: 'gabriel-attal', questionId: 'fr_2027_q16', verdict: REVIEW_VERDICT.APPROVED,
    sourceOpened: true, ...REVIEWER,
    notes: '« Notre dissuasion nucléaire doit être un outil de puissance » et « doctrine de '
      + 'dissuasion nucléaire avancée ». La source soutiendrait une intensité plus forte ; le '
      + 'codage à 1 reste défendable et ne surinterprète pas.',
  },

  // ── Fabien Roussel ───────────────────────────────────────────────────────
  {
    candidateId: 'fabien-roussel', questionId: 'fr_2027_q1', verdict: REVIEW_VERDICT.APPROVED,
    sourceOpened: true, ...REVIEWER,
    notes: 'Discours de Marseille du 26/11/2025 attribué à Roussel : « nous abrogerons vraiment '
      + 'la réforme des retraites à 64 ans ». L’abrogation implique un âge inférieur au droit '
      + 'actuel : intensité 2 soutenue. La source ne dit pas « 60 ans » — ne pas l’ajouter.',
  },
  {
    candidateId: 'fabien-roussel', questionId: 'fr_2027_q3', verdict: REVIEW_VERDICT.UNVERIFIED,
    sourceOpened: false, ...REVIEWER,
    notes: 'Source non ouverte pendant cette passe. Aucun jugement porté.',
  },
  {
    candidateId: 'fabien-roussel', questionId: 'fr_2027_q5', verdict: REVIEW_VERDICT.APPROVED,
    sourceOpened: true, ...REVIEWER,
    notes: '« nous investirons dans la production de 20 centrales nucléaires pour atteindre une '
      + 'énergie totalement décarbonée d’ici 2050 ». Investissement massif et daté : intensité 2 '
      + 'soutenue.',
  },
  {
    candidateId: 'fabien-roussel', questionId: 'fr_2027_q9', verdict: REVIEW_VERDICT.UNVERIFIED,
    sourceOpened: true, ...REVIEWER,
    notes: '⚠ Le PDF du rapport a été téléchargé mais son texte n’est pas extractible avec les '
      + 'moyens disponibles (polices encodées) : ni « Ukraine », ni « OTAN », ni « armes » n’ont '
      + 'pu être retrouvés. Une opposition maximale (-2) sur le soutien militaire à l’Ukraine est '
      + 'une affirmation forte : elle ne sera pas approuvée sans avoir lu le passage.',
  },
  {
    candidateId: 'fabien-roussel', questionId: 'fr_2027_q10', verdict: REVIEW_VERDICT.UNVERIFIED,
    sourceOpened: false, ...REVIEWER,
    notes: 'Source non ouverte pendant cette passe. Aucun jugement porté.',
  },
  {
    candidateId: 'fabien-roussel', questionId: 'fr_2027_q11', verdict: REVIEW_VERDICT.UNVERIFIED,
    sourceOpened: true, ...REVIEWER,
    notes: 'Même PDF que q9 : texte non extractible. Aucun jugement porté.',
  },
]);

/** Verdict de seconde lecture pour une position donnée, ou `null` si elle n’a pas été relue. */
export function secondReadingFor(candidateId, questionId) {
  return SECOND_READING.find(r => r.candidateId === candidateId && r.questionId === questionId) ?? null;
}

/** Positions qui attendent encore une relecture réellement concluante. */
export function stillNeedingReview() {
  return SECOND_READING.filter(r => r.verdict !== REVIEW_VERDICT.APPROVED);
}
