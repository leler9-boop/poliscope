// POLISCOPE — Profile Refinement Themes
//
// Structure: each main theme has 3–4 subthemes.
// Each subtheme maps a slider position (-2 to +2) to theme score adjustments.
//
// adjustment: { THEME: pointsPerStep }
//   "More" (slider +1) adds +adjustment per theme.
//   "Less" (slider -1) adds -adjustment per theme.
//   Values are clamped to 0–100 on application.
//
// lessLabel / moreLabel: human-readable ends of the slider.

export const refinementThemes = [
  {
    id: 'economy',
    emoji: '💰',
    label: { en: 'Economy', fr: 'Économie' },
    desc: {
      en: 'Taxes, welfare, government intervention, markets and redistribution.',
      fr: 'Impôts, protection sociale, intervention de l\'État, marchés et redistribution.',
    },
    subthemes: [
      {
        id: 'market_role',
        label: { en: 'Role of the state in the economy', fr: 'Rôle de l\'État dans l\'économie' },
        desc: {
          en: 'Should the state control or regulate economic activity, or leave it to free markets?',
          fr: 'L\'État doit-il contrôler ou réguler l\'activité économique, ou la laisser aux marchés libres ?',
        },
        lessLabel: { en: 'Free market', fr: 'Marché libre' },
        moreLabel: { en: 'State control', fr: 'Contrôle étatique' },
        adjustment: { ECONOMY: -5 },
      },
      {
        id: 'public_spending',
        label: { en: 'Public spending & welfare', fr: 'Dépenses publiques et protection sociale' },
        desc: {
          en: 'How much should the state spend on social programs, healthcare, education and pensions?',
          fr: 'Combien l\'État devrait-il dépenser pour les programmes sociaux, la santé, l\'éducation et les retraites ?',
        },
        lessLabel: { en: 'Minimal state', fr: 'État minimal' },
        moreLabel: { en: 'Strong welfare state', fr: 'État-providence fort' },
        adjustment: { PUBLIC_SERVICES: 5 },
      },
      {
        id: 'taxation',
        label: { en: 'Taxation & redistribution', fr: 'Fiscalité et redistribution' },
        desc: {
          en: 'Should taxes be higher on the wealthy to fund public services, or lower to encourage growth?',
          fr: 'Les impôts doivent-ils être plus élevés sur les riches pour financer les services publics, ou plus bas pour favoriser la croissance ?',
        },
        lessLabel: { en: 'Lower taxes', fr: 'Impôts bas' },
        moreLabel: { en: 'Progressive taxation', fr: 'Fiscalité progressive' },
        adjustment: { ECONOMY: -4, PUBLIC_SERVICES: 3 },
      },
      {
        id: 'trade',
        label: { en: 'Free trade & globalization', fr: 'Libre-échange et mondialisation' },
        desc: {
          en: 'Should trade be open and international, or protected to favor domestic production?',
          fr: 'Le commerce doit-il être ouvert et international, ou protégé pour favoriser la production nationale ?',
        },
        lessLabel: { en: 'Protectionism', fr: 'Protectionnisme' },
        moreLabel: { en: 'Free trade', fr: 'Libre-échange' },
        adjustment: { ECONOMY: 4, GLOBAL: -2 },
      },
    ],
  },

  {
    id: 'society',
    emoji: '🏳️',
    label: { en: 'Society', fr: 'Société' },
    desc: {
      en: 'Social values, civil rights, personal freedoms and cultural questions.',
      fr: 'Valeurs sociales, droits civiques, libertés personnelles et questions culturelles.',
    },
    subthemes: [
      {
        id: 'social_values',
        label: { en: 'Social & cultural values', fr: 'Valeurs sociales et culturelles' },
        desc: {
          en: 'Where do you stand on issues like gender equality, LGBTQ+ rights and social progressivism?',
          fr: 'Quelle est votre position sur des questions comme l\'égalité des genres, les droits LGBTQ+ et le progressisme social ?',
        },
        lessLabel: { en: 'Traditional', fr: 'Traditionnel' },
        moreLabel: { en: 'Progressive', fr: 'Progressiste' },
        adjustment: { SOCIAL: 5 },
      },
      {
        id: 'personal_freedom',
        label: { en: 'Personal autonomy', fr: 'Autonomie personnelle' },
        desc: {
          en: 'Should individuals have maximum freedom in their personal choices, or should society set norms?',
          fr: 'Les individus doivent-ils avoir une liberté maximale dans leurs choix personnels, ou la société doit-elle fixer des normes ?',
        },
        lessLabel: { en: 'Communal norms', fr: 'Normes communautaires' },
        moreLabel: { en: 'Individual autonomy', fr: 'Autonomie individuelle' },
        adjustment: { SOCIAL: 4, SECURITY: -2 },
      },
      {
        id: 'religion_public',
        label: { en: 'Religion in public life', fr: 'Religion dans la vie publique' },
        desc: {
          en: 'Should religion play a stronger role in public and political life, or should it be kept private?',
          fr: 'La religion devrait-elle jouer un rôle plus important dans la vie publique et politique, ou rester dans la sphère privée ?',
        },
        lessLabel: { en: 'Secular', fr: 'Laïque' },
        moreLabel: { en: 'More religious influence', fr: 'Plus d\'influence religieuse' },
        adjustment: { SOCIAL: -4 },
      },
    ],
  },

  {
    id: 'immigration',
    emoji: '🌍',
    label: { en: 'Immigration', fr: 'Immigration' },
    desc: {
      en: 'Border control, immigration levels, asylum policy and integration.',
      fr: 'Contrôle des frontières, niveaux d\'immigration, politique d\'asile et intégration.',
    },
    subthemes: [
      {
        id: 'immigration_levels',
        label: { en: 'Immigration levels', fr: 'Niveaux d\'immigration' },
        desc: {
          en: 'How much immigration should your country accept overall?',
          fr: 'Quelle quantité d\'immigration votre pays devrait-il accepter globalement ?',
        },
        lessLabel: { en: 'Very restrictive', fr: 'Très restrictif' },
        moreLabel: { en: 'Very open', fr: 'Très ouvert' },
        adjustment: { IMMIGRATION: -5 },
      },
      {
        id: 'border_control',
        label: { en: 'Border & asylum policy', fr: 'Frontières et politique d\'asile' },
        desc: {
          en: 'Should borders be strictly controlled? Should asylum be granted generously or restrictively?',
          fr: 'Les frontières doivent-elles être strictement contrôlées ? L\'asile doit-il être accordé généreusement ou restrictivement ?',
        },
        lessLabel: { en: 'Open borders', fr: 'Frontières ouvertes' },
        moreLabel: { en: 'Strict control', fr: 'Contrôle strict' },
        adjustment: { IMMIGRATION: 5, SECURITY: 1 },
      },
      {
        id: 'integration',
        label: { en: 'Cultural integration', fr: 'Intégration culturelle' },
        desc: {
          en: 'Should immigrants be required to integrate fully into the dominant culture, or can they maintain distinct identities?',
          fr: 'Les immigrés doivent-ils s\'intégrer pleinement dans la culture dominante, ou peuvent-ils maintenir des identités distinctes ?',
        },
        lessLabel: { en: 'Multiculturalism', fr: 'Multiculturalisme' },
        moreLabel: { en: 'Full assimilation', fr: 'Assimilation complète' },
        adjustment: { IMMIGRATION: 4, SOCIAL: -2 },
      },
    ],
  },

  {
    id: 'environment',
    emoji: '🌿',
    label: { en: 'Environment', fr: 'Environnement' },
    desc: {
      en: 'Climate action, environmental regulation, energy policy and sustainability.',
      fr: 'Action climatique, réglementation environnementale, politique énergétique et durabilité.',
    },
    subthemes: [
      {
        id: 'climate_priority',
        label: { en: 'Climate action urgency', fr: 'Urgence de l\'action climatique' },
        desc: {
          en: 'How urgent is it to act on climate change, even at economic cost?',
          fr: 'À quel point est-il urgent d\'agir sur le changement climatique, même à un coût économique ?',
        },
        lessLabel: { en: 'Economy first', fr: 'Économie en priorité' },
        moreLabel: { en: 'Climate first', fr: 'Climat en priorité' },
        adjustment: { ENVIRONMENT: 5 },
      },
      {
        id: 'env_regulation',
        label: { en: 'Environmental regulations', fr: 'Réglementations environnementales' },
        desc: {
          en: 'Should environmental rules on businesses and individuals be stricter or lighter?',
          fr: 'Les règles environnementales sur les entreprises et les individus doivent-elles être plus strictes ou plus légères ?',
        },
        lessLabel: { en: 'Fewer rules', fr: 'Moins de règles' },
        moreLabel: { en: 'Stricter rules', fr: 'Règles plus strictes' },
        adjustment: { ENVIRONMENT: 4 },
      },
      {
        id: 'energy_transition',
        label: { en: 'Energy transition', fr: 'Transition énergétique' },
        desc: {
          en: 'How fast should the energy system shift from fossil fuels to renewables?',
          fr: 'À quelle vitesse le système énergétique doit-il passer des combustibles fossiles aux énergies renouvelables ?',
        },
        lessLabel: { en: 'Gradual change', fr: 'Changement graduel' },
        moreLabel: { en: 'Rapid transition', fr: 'Transition rapide' },
        adjustment: { ENVIRONMENT: 5 },
      },
    ],
  },

  {
    id: 'security',
    emoji: '🛡️',
    label: { en: 'Security', fr: 'Sécurité' },
    desc: {
      en: 'Law enforcement, civil liberties, criminal justice and surveillance.',
      fr: 'Forces de l\'ordre, libertés civiles, justice pénale et surveillance.',
    },
    subthemes: [
      {
        id: 'law_enforcement',
        label: { en: 'Law enforcement powers', fr: 'Pouvoirs des forces de l\'ordre' },
        desc: {
          en: 'Should police and law enforcement have stronger or more limited powers?',
          fr: 'La police et les forces de l\'ordre devraient-elles avoir des pouvoirs plus forts ou plus limités ?',
        },
        lessLabel: { en: 'Lighter policing', fr: 'Police moins présente' },
        moreLabel: { en: 'Stronger policing', fr: 'Police renforcée' },
        adjustment: { SECURITY: 5 },
      },
      {
        id: 'civil_liberties',
        label: { en: 'Civil liberties vs. security', fr: 'Libertés civiles vs. sécurité' },
        desc: {
          en: 'When security and individual freedoms conflict, which should take priority?',
          fr: 'Quand la sécurité et les libertés individuelles entrent en conflit, laquelle doit primer ?',
        },
        lessLabel: { en: 'Security first', fr: 'Sécurité en priorité' },
        moreLabel: { en: 'Freedoms first', fr: 'Libertés en priorité' },
        adjustment: { SECURITY: -5 },
      },
      {
        id: 'criminal_justice',
        label: { en: 'Criminal justice', fr: 'Justice pénale' },
        desc: {
          en: 'Should the justice system focus on punishment and deterrence, or rehabilitation?',
          fr: 'Le système judiciaire doit-il se concentrer sur la punition et la dissuasion, ou sur la réhabilitation ?',
        },
        lessLabel: { en: 'Rehabilitation', fr: 'Réhabilitation' },
        moreLabel: { en: 'Punishment', fr: 'Punition' },
        adjustment: { SECURITY: 4 },
      },
    ],
  },

  {
    id: 'foreign_policy',
    emoji: '🌐',
    label: { en: 'Foreign Policy', fr: 'Politique étrangère' },
    desc: {
      en: 'National sovereignty, international cooperation, military spending and alliances.',
      fr: 'Souveraineté nationale, coopération internationale, dépenses militaires et alliances.',
    },
    subthemes: [
      {
        id: 'intl_cooperation',
        label: { en: 'International cooperation', fr: 'Coopération internationale' },
        desc: {
          en: 'Should your country work closely with international bodies, or prioritize its own sovereignty?',
          fr: 'Votre pays doit-il coopérer étroitement avec les organismes internationaux, ou privilégier sa propre souveraineté ?',
        },
        lessLabel: { en: 'National sovereignty', fr: 'Souveraineté nationale' },
        moreLabel: { en: 'Multilateralism', fr: 'Multilatéralisme' },
        adjustment: { GLOBAL: -5 },
      },
      {
        id: 'military',
        label: { en: 'Military spending', fr: 'Dépenses militaires' },
        desc: {
          en: 'Should defense spending be increased or reduced?',
          fr: 'Les dépenses de défense doivent-elles être augmentées ou réduites ?',
        },
        lessLabel: { en: 'Reduce military', fr: 'Réduire le militaire' },
        moreLabel: { en: 'Increase military', fr: 'Augmenter le militaire' },
        adjustment: { SECURITY: 4 },
      },
      {
        id: 'sovereignty',
        label: { en: 'National sovereignty', fr: 'Souveraineté nationale' },
        desc: {
          en: 'Should your country prioritize its own laws and decisions over international agreements?',
          fr: 'Votre pays doit-il privilégier ses propres lois et décisions par rapport aux accords internationaux ?',
        },
        lessLabel: { en: 'Global integration', fr: 'Intégration mondiale' },
        moreLabel: { en: 'National first', fr: 'Nation d\'abord' },
        adjustment: { GLOBAL: 5 },
      },
    ],
  },

  {
    id: 'democracy',
    emoji: '🗳️',
    label: { en: 'Democracy', fr: 'Démocratie' },
    desc: {
      en: 'Democratic institutions, the rule of law, checks and balances, and citizen participation.',
      fr: 'Institutions démocratiques, état de droit, contre-pouvoirs et participation citoyenne.',
    },
    subthemes: [
      {
        id: 'institutions',
        label: { en: 'Trust in institutions', fr: 'Confiance dans les institutions' },
        desc: {
          en: 'How much do you trust established democratic institutions — courts, parliament, independent bodies?',
          fr: 'Quelle confiance accordez-vous aux institutions démocratiques établies — tribunaux, parlement, organes indépendants ?',
        },
        lessLabel: { en: 'Skeptical', fr: 'Sceptique' },
        moreLabel: { en: 'Strong trust', fr: 'Grande confiance' },
        adjustment: { DEMOCRACY: 5 },
      },
      {
        id: 'direct_democracy',
        label: { en: 'Direct democracy', fr: 'Démocratie directe' },
        desc: {
          en: 'Should citizens vote directly on major decisions via referendums?',
          fr: 'Les citoyens doivent-ils voter directement sur les grandes décisions par référendum ?',
        },
        lessLabel: { en: 'Representative only', fr: 'Représentatif uniquement' },
        moreLabel: { en: 'More referendums', fr: 'Plus de référendums' },
        adjustment: { DEMOCRACY: 3 },
      },
      {
        id: 'rule_of_law',
        label: { en: 'Rule of law & accountability', fr: 'État de droit et responsabilité' },
        desc: {
          en: 'Should no one — including politicians — be above the law? Should power always be checked?',
          fr: 'Personne — y compris les politiques — ne devrait-il être au-dessus des lois ? Le pouvoir doit-il toujours être contrôlé ?',
        },
        lessLabel: { en: 'Flexible governance', fr: 'Gouvernance flexible' },
        moreLabel: { en: 'Strict rule of law', fr: 'État de droit strict' },
        adjustment: { DEMOCRACY: 5 },
      },
    ],
  },

  {
    id: 'public_services',
    emoji: '🏥',
    label: { en: 'Public Services', fr: 'Services publics' },
    desc: {
      en: 'Healthcare, education, housing, transport and the delivery of essential services.',
      fr: 'Santé, éducation, logement, transports et fourniture des services essentiels.',
    },
    subthemes: [
      {
        id: 'healthcare',
        label: { en: 'Healthcare system', fr: 'Système de santé' },
        desc: {
          en: 'Should healthcare be publicly provided and funded, or primarily private?',
          fr: 'La santé devrait-elle être publiquement fournie et financée, ou principalement privée ?',
        },
        lessLabel: { en: 'Private healthcare', fr: 'Santé privée' },
        moreLabel: { en: 'Universal public healthcare', fr: 'Santé publique universelle' },
        adjustment: { PUBLIC_SERVICES: 5 },
      },
      {
        id: 'education',
        label: { en: 'Education & access', fr: 'Éducation et accès' },
        desc: {
          en: 'Should education at all levels be free and publicly funded, or include private and fee-paying options?',
          fr: 'L\'éducation à tous les niveaux devrait-elle être gratuite et financée par l\'État, ou inclure des options privées et payantes ?',
        },
        lessLabel: { en: 'Private and fee-based', fr: 'Privé et payant' },
        moreLabel: { en: 'Free and universal', fr: 'Gratuit et universel' },
        adjustment: { PUBLIC_SERVICES: 4 },
      },
      {
        id: 'privatisation',
        label: { en: 'Public vs. private delivery', fr: 'Public vs. privé' },
        desc: {
          en: 'Should essential services like transport, energy and utilities be run by the state or private companies?',
          fr: 'Les services essentiels comme les transports, l\'énergie et les utilités doivent-ils être gérés par l\'État ou par des entreprises privées ?',
        },
        lessLabel: { en: 'Privatize', fr: 'Privatiser' },
        moreLabel: { en: 'Nationalize', fr: 'Nationaliser' },
        adjustment: { PUBLIC_SERVICES: 5, ECONOMY: -2 },
      },
    ],
  },
];
