/**
 * POLISCOP — Tooltips pédagogiques (niveau collège)
 * Format : { [questionId]: string }
 * Intégration : <QuestionCard hint={questionHints[question.id]} />
 */

export const questionHints = {
  // ── ÉCONOMIE ────────────────────────────────────────────────────────────
  ECO_1: "En France, les gens qui gagnent beaucoup paient un pourcentage plus élevé d'impôts. Certains veulent augmenter encore cet écart pour financer les services publics. D'autres pensent que ça décourage les entreprises de créer des emplois.",
  ECO_2: "Le SMIC est le salaire minimum légal en France (environ 1 800 € brut/mois en 2024). L'augmenter aide les travailleurs pauvres, mais certains craignent que ça coûte trop cher aux petites entreprises.",
  ECO_3: "Quand les impôts sur les entreprises baissent, certaines viennent s'installer en France et créent des emplois. Mais ça réduit les recettes de l'État, donc il peut moins financer les hôpitaux ou les écoles.",
  ECO_8: "Nationaliser = l'État rachète et gère une entreprise (comme SNCF ou EDF). Avantage : les profits servent à tous. Inconvénient : l'État est souvent moins efficace qu'une entreprise privée.",
  ECO_10: "Un revenu de base = l'État donne chaque mois un montant fixe à chaque citoyen, sans condition. L'idée : garantir la survie de tous. Le débat : est-ce que ça décourage de travailler ?",
  ECO_23: "Faut-il d'abord faire grandir l'économie (plus de richesses globales) ou d'abord réduire les inégalités (mieux répartir les richesses existantes) ? Ce choix divise fortement droite et gauche.",

  // ── SOCIAL ──────────────────────────────────────────────────────────────
  SOC_1: "En France, le mariage pour tous existe depuis 2013. Cette question demande si les couples homosexuels doivent avoir exactement les mêmes droits que les autres (mariage, adoption, PMA, etc.).",
  SOC_2: "L'IVG (interruption volontaire de grossesse) est légale en France depuis 1975. Certains veulent la rendre encore plus accessible. D'autres s'y opposent pour des raisons morales ou religieuses.",
  SOC_5: "La France est un pays laïc : la religion et l'État sont séparés depuis 1905. Mais certains pensent que les valeurs religieuses devraient davantage guider nos lois. D'autres défendent une laïcité stricte.",
  SOC_7: "La famille 'traditionnelle' désigne le modèle père-mère-enfants. Certains estiment que l'État devrait encourager ce modèle. D'autres pensent que toutes les formes de famille sont également valables.",

  // ── IMMIGRATION ──────────────────────────────────────────────────────────
  IMM_1: "La France accueille chaque année environ 250 000 immigrés légaux. Ce chiffre doit-il baisser ? C'est l'un des sujets les plus clivants de la politique française aujourd'hui.",
  IMM_2: "Les réfugiés fuient des guerres ou des persécutions. En France, ils ont accès à certaines aides, mais pas toutes. Faut-il leur ouvrir immédiatement tous les droits sociaux, ou attendre leur régularisation ?",

  // ── SÉCURITÉ ────────────────────────────────────────────────────────────
  SEC_1: "La surveillance de masse = l'État surveille les communications de tout le monde (mails, appels, SMS) pour détecter les terroristes. Avantage : plus de sécurité. Risque : atteinte à la vie privée de tous.",
  SEC_2: "Donner plus de budget à la police permet d'avoir plus de policiers et de meilleurs équipements. Mais certains estiment que l'argent serait mieux dépensé en prévention (éducation, social).",

  // ── ENVIRONNEMENT ───────────────────────────────────────────────────────
  ENV_1: "Une taxe carbone fait payer davantage ceux qui polluent (voitures, avions, industries). Ça incite à polluer moins, mais ça pèse surtout sur les gens qui n'ont pas d'autre choix (zones rurales, etc.).",
  ENV_3: "Le nucléaire ne produit presque pas de CO₂, mais crée des déchets radioactifs difficiles à stocker. La France en dépend à 70%. Faut-il continuer, ou miser sur le solaire et l'éolien ?",

  // ── DÉMOCRATIE ──────────────────────────────────────────────────────────
  DEM_1: "Le référendum permet aux citoyens de voter directement sur une loi ou une décision (comme le Brexit). C'est plus de démocratie directe, mais certains craignent les résultats impulsifs ou manipulés.",
  DEM_4: "Le mandat unique = un élu ne peut faire qu'un seul mandat puis doit partir. L'idée : empêcher les dynasties politiques et renouveler les idées. Mais on perd aussi l'expérience acquise.",

  // ── MONDIALISATION ──────────────────────────────────────────────────────
  GLO_1: "Le libre-échange = les pays commercent sans barrières (pas de taxes sur les importations). Avantage : produits moins chers. Inconvénient : les industries locales souffrent de la concurrence étrangère.",
  GLO_3: "La souveraineté nationale = décider seul, sans dépendre d'organisations internationales comme l'UE ou l'ONU. Certains veulent plus d'indépendance, d'autres pensent qu'on est plus forts ensemble.",

  // ── SERVICES PUBLICS ────────────────────────────────────────────────────
  PUB_1: "La sécurité sociale rembourse les soins médicaux de tous les Français. La renforcer coûte de l'argent public. La privatiser partiellement peut réduire les coûts mais crée des inégalités d'accès aux soins.",
  PUB_4: "L'école privée peut recevoir des subventions de l'État (contrat d'association). Certains veulent supprimer ces aides pour tout mettre dans l'école publique. D'autres défendent le libre choix des familles.",
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
