// POLISCOP — Corpus éditorial général 2027, hors questions CORE.
//
// Chaque ligne répond à la question suivante : « au vu de sa ligne publique actuelle,
// que répondrait vraisemblablement ce candidat à cette formulation précise ? »
//
// Échelle : 1 = pas du tout d'accord, 5 = tout à fait d'accord.
// Ces valeurs sont des ESTIMATIONS ÉDITORIALES. Elles ne deviennent jamais, par leur seule
// présence ici, des positions vérifiées. Les sources fortes restent gérées séparément dans
// candidateProvenance.js.

export const GENERAL_CANDIDATE_ORDER = Object.freeze([
  'lepen_2027', 'philippe', 'attal', 'melenchon_2027', 'glucksmann',
  'tondelier', 'retailleau', 'ruffin', 'roussel_2027', 'zemmour_2027', 'lisnard',
]);

// L'ordre des colonnes est celui de GENERAL_CANDIDATE_ORDER.
// Les commentaires décrivent le dispositif testé ; ils empêchent de recoder une valeur en
// ne regardant que l'identifiant ou l'axe général de la question.
export const NON_CORE_ANSWERS = Object.freeze({
  // ── Économie ─────────────────────────────────────────────────────────────
  ECO_1:  { v: [4,2,2,5,4,5,1,5,5,1,1] }, // augmenter l'impôt sur les hauts revenus
  ECO_3:  { v: [3,4,4,1,2,1,5,1,1,4,5] }, // baisser l'impôt sur les bénéfices
  ECO_4:  { v: [3,1,1,5,4,5,1,5,5,1,1] }, // rétablir un impôt sur la fortune financière
  ECO_5:  { v: [3,5,5,1,2,1,5,1,1,4,5] }, // réduire les dépenses publiques
  ECO_6:  { v: [3,2,2,5,4,5,1,5,5,1,1] }, // renforcer le pouvoir des syndicats
  ECO_9:  { v: [4,2,2,5,4,5,1,5,5,1,1] }, // encadrer davantage la finance
  ECO_10: { v: [2,1,1,2,2,4,1,2,1,1,1] }, // revenu universel inconditionnel
  ECO_11: { v: [2,5,5,1,3,1,5,1,1,4,5] }, // faire de la dette une priorité
  ECO_13: { v: [4,2,3,5,5,5,2,5,5,2,2] }, // protéger les travailleurs des plateformes
  ECO_15: { v: [1,3,3,1,2,1,4,1,1,3,4] }, // privatiser davantage d'entreprises publiques
  ECO_19: { v: [2,1,1,3,3,4,1,4,4,1,1] }, // semaine de quatre jours inscrite dans la loi
  ECO_24: { v: [4,3,4,5,5,5,2,5,5,2,1] }, // impôt mondial minimum plus élevé
  ECO_26: { v: [4,2,2,5,4,5,1,5,5,1,1] }, // ramener l'âge de la retraite sous 64 ans
  ECO_28: { v: [3,2,2,4,4,5,2,4,4,2,1] }, // réguler strictement l'intelligence artificielle

  // ── Société ──────────────────────────────────────────────────────────────
  SOC_3:  { v: [2,2,3,5,4,5,1,4,2,1,1] }, // légaliser le cannabis sous contrôle de l'État
  SOC_5:  { v: [1,1,1,1,1,1,1,1,1,1,1] }, // donner plus d'influence aux religions dans la loi
  SOC_6:  { v: [1,3,4,5,5,5,1,4,4,1,2] }, // changement de sexe à l'état civil sans avis médical
  SOC_8:  { v: [2,4,5,4,5,5,3,4,4,1,3] }, // punir plus sévèrement les discours de haine
  SOC_10: { v: [3,4,4,5,5,5,2,4,5,2,4] }, // aide active à mourir en cas de maladie incurable
  SOC_14: { v: [5,5,5,4,5,5,5,4,5,5,5] }, // vérification d'âge sur les sites pornographiques
  SOC_20: { v: [1,2,2,4,4,5,1,4,3,1,1] }, // dépénaliser la prostitution et ses clients
  SOC_22: { v: [5,5,5,5,5,4,5,5,5,5,5] }, // protéger la liberté de critiquer les religions
  SOC_23: { v: [3,5,5,5,5,5,3,5,5,2,4] }, // enseigner le consentement à l'école
  SOC_27: { v: [4,3,4,5,5,5,2,5,5,2,2] }, // sanctionner les écarts de salaire femmes-hommes
  SOC_28: { v: [5,4,3,2,2,1,5,2,3,5,4] }, // maintenir l'interdiction de la GPA
  SOC_29: { v: [4,5,5,5,5,5,2,5,5,2,4] }, // protéger l'avortement dans la Constitution
  SOC_30: { v: [2,4,5,5,5,5,1,5,5,1,3] }, // ouvrir la PMA aux femmes seules
  SOC_31: { v: [3,3,4,5,5,5,2,5,5,1,2] }, // contrôles publics contre les discriminations à l'embauche

  // ── Immigration ──────────────────────────────────────────────────────────
  IMM_2:  { v: [1,2,2,5,5,5,1,4,4,1,1] }, // permettre aux demandeurs d'asile de travailler immédiatement
  IMM_3:  { v: [1,2,2,5,4,5,1,4,3,1,1] }, // régulariser après plusieurs années de présence
  IMM_5:  { v: [5,4,4,1,2,1,5,3,4,5,5] }, // rétablir des contrôles systématiques aux frontières
  IMM_7:  { v: [1,2,2,5,4,5,1,3,3,1,1] }, // aider à préserver la culture d'origine
  IMM_8:  { v: [1,4,4,5,5,5,2,5,5,1,3] }, // mêmes droits sociaux pour les travailleurs en règle
  IMM_9:  { v: [1,2,2,5,4,5,1,4,4,1,1] }, // accueillir davantage de réfugiés climatiques
  IMM_12: { v: [5,5,5,2,3,2,5,3,4,5,5] }, // expulser un étranger condamné pour un crime grave
  IMM_14: { v: [5,4,4,1,2,1,5,2,3,5,5] }, // examiner les demandes d'asile hors de France
  IMM_16: { v: [5,4,5,1,2,1,5,2,3,5,5] }, // fixer des quotas annuels d'immigration
  IMM_20: { v: [5,5,5,4,4,4,5,4,4,5,5] }, // exiger l'apprentissage du français pour rester
  IMM_21: { v: [1,4,5,3,5,5,1,3,3,1,2] }, // répartition obligatoire de l'asile dans l'Union européenne
  IMM_24: { v: [5,4,4,1,2,1,5,2,3,5,5] }, // condition de revenus au regroupement familial
  IMM_25: { v: [1,3,3,5,5,5,1,5,5,1,1] }, // soins gratuits pour les personnes sans papiers
  IMM_26: { v: [5,4,4,1,2,1,5,2,3,5,5] }, // expulser tous les demandeurs d'asile déboutés

  // ── Sécurité ─────────────────────────────────────────────────────────────
  SEC_1:  { v: [1,2,2,5,4,5,1,4,3,1,2] }, // limiter la surveillance aux personnes soupçonnées
  SEC_4:  { v: [1,2,2,5,4,5,1,4,3,1,1] }, // interdire la reconnaissance faciale à la police
  SEC_5:  { v: [5,4,4,1,2,1,5,2,3,5,5] }, // allonger les peines de prison
  SEC_6:  { v: [2,3,3,5,4,5,1,5,4,1,2] }, // donner la priorité à la réinsertion en prison
  SEC_8:  { v: [2,3,3,5,5,5,2,5,4,1,3] }, // renforcer le contrôle parlementaire du renseignement
  SEC_9:  { v: [1,2,2,4,4,5,1,4,2,1,1] }, // ne plus punir pénalement la détention de drogue
  SEC_11: { v: [5,4,4,1,2,1,5,2,3,5,5] }, // retirer la nationalité aux terroristes binationaux
  SEC_12: { v: [5,4,4,2,3,2,5,3,3,5,5] }, // accès ciblé aux messages chiffrés des suspects
  SEC_13: { v: [3,4,4,5,5,5,3,5,4,2,4] }, // caméra-piéton allumée pendant les interventions
  SEC_14: { v: [1,2,2,5,4,5,1,4,3,1,1] }, // peines moins sévères pour les mineurs
  SEC_19: { v: [5,5,5,1,2,1,5,2,3,5,5] }, // rétention après une peine pour terrorisme
  SEC_21: { v: [3,4,4,5,5,5,3,5,5,3,4] }, // mieux protéger les lanceurs d'alerte
  SEC_26: { v: [5,4,4,1,2,1,5,2,3,5,5] }, // contrôles d'identité sans motif précis
  SEC_27: { v: [5,4,4,2,3,2,5,3,3,5,5] }, // faire exécuter toutes les peines de prison prononcées

  // ── Environnement ────────────────────────────────────────────────────────
  ENV_1:  { v: [1,3,3,5,5,5,2,4,3,1,2] }, // faire du climat la première priorité
  ENV_2:  { v: [5,5,5,2,3,1,5,3,5,5,5] }, // construire de nouveaux réacteurs nucléaires
  ENV_4:  { v: [1,2,2,4,4,5,1,3,3,1,1] }, // maintenir les normes écologiques malgré les emplois menacés
  ENV_7:  { v: [1,3,3,4,5,5,1,3,3,1,1] }, // interdire les voitures thermiques neuves avant 2035
  ENV_8:  { v: [1,1,1,5,2,5,1,4,3,1,1] }, // ne plus faire de la croissance un objectif de l'État
  ENV_9:  { v: [1,1,1,2,3,5,1,1,1,1,1] }, // taxer davantage la viande
  ENV_10: { v: [1,2,2,5,4,5,1,4,4,1,1] }, // réparations climatiques aux pays pauvres
  ENV_15: { v: [2,3,3,5,5,5,2,5,4,1,2] }, // interdire totalement le plastique à usage unique
  ENV_22: { v: [1,3,3,4,4,5,1,4,3,1,2] }, // limiter la voiture individuelle en ville
  ENV_26: { v: [2,2,2,4,4,5,1,3,3,1,1] }, // interdire un pesticide dangereux sans alternative disponible
  ENV_27: { v: [5,4,4,2,2,1,5,2,3,5,5] }, // condamner les blocages routiers pour le climat
  ENV_28: { v: [5,2,1,1,1,1,4,2,3,5,3] }, // arrêter la construction d'éoliennes
  ENV_29: { v: [5,5,5,2,3,1,5,3,4,5,5] }, // préférer les incitations aux interdictions écologiques
  ENV_30: { v: [2,3,3,5,5,5,2,5,4,1,2] }, // interdire la location des passoires thermiques

  // ── Démocratie ───────────────────────────────────────────────────────────
  DEM_5:  { v: [5,2,3,5,5,5,2,5,5,4,3] }, // élire les députés à la proportionnelle
  DEM_6:  { v: [2,2,3,5,5,5,1,5,5,1,2] }, // droit de vote à 16 ans
  DEM_10: { v: [1,2,2,4,5,5,1,4,4,1,3] }, // fin automatique de l'état d'urgence après 30 jours
  DEM_14: { v: [5,3,4,5,5,5,4,5,5,4,4] }, // réduire l'immunité parlementaire
  DEM_16: { v: [2,5,5,4,5,5,3,4,4,1,4] }, // permettre l'annulation des lois inconstitutionnelles
  DEM_19: { v: [3,3,3,5,5,5,2,5,5,2,2] }, // renforcer le financement public des partis
  DEM_25: { v: [4,3,3,5,5,5,3,5,5,2,2] }, // plafonner la concentration des médias
  DEM_26: { v: [4,4,5,5,5,5,4,5,5,3,4] }, // publier les règles des algorithmes publics
  DEM_27: { v: [4,4,4,2,2,1,4,2,2,5,2] }, // laisser le président décider seul en période de crise
  DEM_28: { v: [3,2,2,1,1,1,3,1,1,4,1] }, // permettre au gouvernement d'imposer une loi sans vote
  DEM_29: { v: [2,4,4,1,2,1,2,1,1,1,1] }, // confier davantage de décisions à des experts non élus
  DEM_30: { v: [4,2,2,5,3,5,3,5,5,3,4] }, // permettre la révocation d'un élu par les citoyens
  DEM_31: { v: [4,4,4,5,5,5,4,5,5,3,4] }, // imposer un temps de parole équilibré à la télévision
  DEM_32: { v: [5,2,2,5,3,5,3,5,4,4,5] }, // référendum déclenché par un nombre de signatures

  // ── Monde et Europe ──────────────────────────────────────────────────────
  GLO_3:  { v: [2,5,5,1,5,4,5,2,3,2,5] }, // considérer l'OTAN indispensable
  GLO_4:  { v: [1,3,3,5,5,5,1,4,4,1,2] }, // augmenter l'aide aux pays pauvres
  GLO_6:  { v: [5,2,2,5,3,4,3,5,5,5,2] }, // droits de douane pour protéger les usines françaises
  GLO_7:  { v: [2,4,4,3,5,5,4,4,3,1,4] }, // sanctionner les régimes autoritaires
  GLO_11: { v: [5,4,5,4,5,5,5,5,5,4,5] }, // réduire la dépendance à la Chine
  GLO_12: { v: [1,1,1,4,4,5,1,3,3,1,1] }, // réparations financières liées à la colonisation
  GLO_13: { v: [2,5,5,4,5,5,4,5,4,1,4] }, // soutenir la Cour pénale internationale
  GLO_14: { v: [5,4,4,5,4,4,5,5,5,5,4] }, // limiter les achats étrangers d'entreprises stratégiques
  GLO_15: { v: [2,4,4,2,5,3,4,2,2,2,4] }, // intervenir contre un génocide sans accord de l'ONU
  GLO_23: { v: [4,1,1,5,1,2,1,4,3,4,1] }, // quitter le commandement intégré de l'OTAN
  GLO_25: { v: [2,5,5,2,5,4,4,3,3,1,4] }, // poursuivre l'aide militaire à l'Ukraine
  GLO_26: { v: [4,1,1,5,1,2,1,4,4,5,1] }, // rester neutre entre les grandes puissances
  GLO_27: { v: [5,4,4,5,4,4,5,5,5,5,5] }, // produire en France l'essentiel de l'énergie consommée
  GLO_28: { v: [5,3,3,3,2,2,4,4,4,5,3] }, // majorité de chansons françaises à la radio

  // ── Services publics et protection sociale ───────────────────────────────
  PUB_3:  { v: [2,4,4,1,2,1,4,1,1,3,5] }, // ouvrir les services essentiels à la concurrence
  PUB_4:  { v: [5,3,3,5,5,5,2,5,5,4,2] }, // financer les retraites par les cotisations
  PUB_6:  { v: [3,2,3,5,5,5,2,5,5,2,2] }, // construire beaucoup plus de logements sociaux
  PUB_7:  { v: [2,1,1,2,2,4,1,2,1,1,1] }, // revenu de base remplaçant plusieurs aides
  PUB_11: { v: [3,2,2,5,4,5,1,5,5,1,1] }, // encadrer les loyers dans les zones tendues
  PUB_12: { v: [2,2,2,5,4,5,1,5,5,1,1] }, // rendre gratuits les transports publics
  PUB_14: { v: [2,1,1,5,3,4,1,5,5,1,1] }, // garantir un emploi public aux chômeurs de longue durée
  PUB_15: { v: [1,3,3,1,1,1,3,1,1,3,3] }, // moins rembourser les soins jugés peu prioritaires
  PUB_19: { v: [5,2,2,5,4,5,1,5,5,4,1] }, // maintenir les pensions même si les cotisations augmentent
  PUB_23: { v: [3,2,2,5,4,5,1,5,5,2,2] }, // maintenir l'université publique gratuite
  PUB_24: { v: [4,2,3,5,4,5,2,5,5,3,1] }, // obliger des médecins à exercer dans les déserts médicaux
  PUB_26: { v: [4,2,2,5,4,5,1,5,5,2,1] }, // interdire les dépassements d'honoraires
  PUB_27: { v: [4,2,3,5,5,5,2,5,5,2,2] }, // crèche gratuite pour toutes les familles
  PUB_28: { v: [2,5,5,1,2,1,5,1,1,4,5] }, // raccourcir la durée d'indemnisation du chômage
});
