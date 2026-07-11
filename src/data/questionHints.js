/**
 * POLISCOP — Tooltips pédagogiques (niveau collège)
 * Format : { [questionId]: string }
 * Intégration : <QuestionCard hint={questionHints[question.id]} />
 */

export const questionHints = {
  // ── ÉCONOMIE ────────────────────────────────────────────────────────────
  ECO_1: "En France, les gens qui gagnent beaucoup paient un pourcentage plus élevé d'impôts. Certains veulent augmenter encore cet écart pour financer les services publics. D'autres pensent que ça décourage les entreprises de créer des emplois.",
  ECO_2: "Le SMIC est le salaire minimum légal en France (1 867 € brut par mois depuis juin 2026). L'augmenter aide les travailleurs pauvres, mais certains craignent que ça coûte trop cher aux petites entreprises.",
  ECO_3: "Quand les impôts sur les entreprises baissent, certaines viennent s'installer en France et créent des emplois. Mais ça réduit les recettes de l'État, donc il peut moins financer les hôpitaux ou les écoles.",
  ECO_8: "Nationaliser = l'État rachète et gère une entreprise (comme SNCF ou EDF). Avantage : les profits servent à tous. Inconvénient : l'État est souvent moins efficace qu'une entreprise privée.",
  ECO_10: "Un revenu de base = l'État donne chaque mois un montant fixe à chaque citoyen, sans condition. L'idée : garantir la survie de tous. Le débat : est-ce que ça décourage de travailler ?",
  ECO_23: "Faut-il d'abord faire grandir l'économie (plus de richesses globales) ou d'abord réduire les inégalités (mieux répartir les richesses existantes) ? Ce choix divise fortement droite et gauche.",

  // ── SOCIAL ──────────────────────────────────────────────────────────────
  // (SOC_1 and SOC_2 hints removed 2026-07-11: both point at questions marked
  // isDuplicate in questions_final.json — SOC_1 deliberately excluded as
  // EXCLUDED_LAW_2013, SOC_2 a duplicate of SOC_24 — so neither ever reaches
  // the live queue; the hints were dead, unreachable entries.)
  SOC_5: "La France est un pays laïc : la religion et l'État sont séparés depuis 1905. Mais certains pensent que les valeurs religieuses devraient davantage guider nos lois. D'autres défendent une laïcité stricte.",
  SOC_7: "La famille 'traditionnelle' désigne le modèle père-mère-enfants. Certains estiment que l'État devrait encourager ce modèle. D'autres pensent que toutes les formes de famille sont également valables.",

  // ── IMMIGRATION ──────────────────────────────────────────────────────────
  IMM_1: "La France a délivré environ 384 000 nouveaux titres de séjour en 2025, un chiffre en hausse. Faut-il le réduire ? C'est l'un des sujets les plus clivants de la politique française aujourd'hui.",
  IMM_2: "Les demandeurs d'asile ne peuvent pas travailler pendant l'instruction de leur dossier, qui peut durer plusieurs mois voire plus d'un an. Faut-il leur donner le droit de travailler dès le départ, ou attendre la décision ?",

  // ── SÉCURITÉ ────────────────────────────────────────────────────────────
  // (SEC_2 hint removed 2026-07-11: duplicate of SEC_23, never reaches the live queue.)
  SEC_1: "La surveillance de masse = l'État surveille les communications de tout le monde (mails, appels, SMS) pour détecter les terroristes. Avantage : plus de sécurité. Risque : atteinte à la vie privée de tous.",

  // ── ENVIRONNEMENT ───────────────────────────────────────────────────────
  ENV_1: "Le climat se réchauffe à cause des activités humaines. Certains veulent en faire la priorité numéro un du gouvernement ; d'autres pensent que d'autres urgences (pouvoir d'achat, sécurité) ne doivent pas passer au second plan.",
  ENV_3: "Une taxe carbone fait payer davantage ceux qui polluent (voitures, avions, industries). Ça incite à polluer moins, mais ça pèse surtout sur les gens qui n'ont pas d'autre choix (zones rurales, etc.).",

  // ── DÉMOCRATIE ──────────────────────────────────────────────────────────
  DEM_1: "Dans certains pays (Belgique, Australie), voter est obligatoire, avec parfois une amende en cas d'abstention. Cela pourrait renforcer la légitimité des élus, mais certains y voient une atteinte à la liberté de ne pas voter.",
  DEM_4: "En France, le Conseil supérieur de la magistrature encadre la nomination des juges, mais le ministre de la Justice garde un rôle pour le parquet. Certains veulent une indépendance totale ; d'autres estiment qu'un lien avec le pouvoir élu reste légitime.",

  // ── MONDIALISATION ──────────────────────────────────────────────────────
  GLO_1: "La France a des engagements internationaux (traités, UE, ONU) qui peuvent limiter certaines décisions nationales. Faut-il toujours les respecter, ou l'intérêt national doit-il parfois passer avant ?",
  GLO_3: "L'OTAN est une alliance militaire entre pays européens et nord-américains, fondée en 1949. Elle garantit une défense commune, mais certains estiment qu'elle limite l'indépendance stratégique de la France.",

  // ── SERVICES PUBLICS ────────────────────────────────────────────────────
  PUB_1: "La sécurité sociale rembourse les soins médicaux de tous les Français. La renforcer coûte de l'argent public. La privatiser partiellement peut réduire les coûts mais crée des inégalités d'accès aux soins.",
  PUB_4: "En France, les retraites sont payées par les cotisations des actifs (système par répartition), pas par une épargne individuelle (capitalisation). Certains veulent introduire une part de capitalisation ; d'autres défendent la solidarité entre générations du système actuel.",
};

/**
 * Intro thème — affiché avant le premier bloc de questions
 */
export const themeIntros = {
  ECONOMY:         "Ce bloc parle de l'argent : qui paie quoi, combien, et pour qui ?",
  SOCIAL:          "Ce bloc parle de la société : comment on veut vivre ensemble, nos droits et nos valeurs.",
  IMMIGRATION:     "Ce bloc parle des personnes qui viennent s'installer en France et comment on les accueille.",
  SECURITY:        "Ce bloc parle de la sécurité : comment protéger les gens, et jusqu'où peut aller l'État ?",
  ENVIRONMENT:     "Ce bloc parle de la planète : comment protéger l'environnement sans bloquer l'économie ?",
  DEMOCRACY:       "Ce bloc parle de comment on prend les décisions : qui vote, qui décide, comment ?",
  GLOBAL:          "Ce bloc parle de la France dans le monde : ouverte ou protégée ? Européenne ou souveraine ?",
  PUBLIC_SERVICES: "Ce bloc parle des services pour tous : santé, école, transport — public ou privé ?",
};
