// POLISCOP — Political Archetypes
// 18 archetypes covering the French 2027 voter space.
//
// Profile scale (same convention as candidate profiles in elections.js):
//   ECONOMY:         0 = statist/redistribution,    100 = free market
//   SOCIAL:          0 = conservative,               100 = progressive
//   IMMIGRATION:     0 = open/pro-immigration,       100 = restrictive
//   SECURITY:        0 = civil liberties focus,      100 = law & order
//   ENVIRONMENT:     0 = growth first,               100 = ecology first
//   DEMOCRACY:       0 = strong state/populist,      100 = pro-democratic/participative
//   GLOBAL:          0 = nationalist/sovereignist,   100 = globalist/pro-EU
//   PUBLIC_SERVICES: 0 = minimal state,              100 = strong welfare state
//
// traits: 3 short conviction statements, 2nd person, plain French.

export const archetypes = [

  // ── FAR LEFT ──────────────────────────────────────────────────────────────

  {
    id: 'insoumis',
    name: { fr: "L'Insoumis·e", en: 'The Rebel' },
    color: '#cc0000',
    description: {
      fr: "Vous refusez le système en place et croyez en une rupture radicale avec le capitalisme libéral.",
      en: "You reject the current system and believe in a radical break from liberal capitalism.",
    },
    traits: {
      fr: ['Pour la rupture avec le système', 'État social maximal', 'Contre l\'OTAN et les guerres'],
      en: ['For breaking with the system', 'Maximum welfare state', 'Against NATO and wars'],
    },
    primaryCandidate: 'melenchon_2027',
    profile: {
      ECONOMY: 12, SOCIAL: 88, IMMIGRATION: 12, SECURITY: 22,
      ENVIRONMENT: 80, DEMOCRACY: 58, GLOBAL: 28, PUBLIC_SERVICES: 88,
    },
  },

  {
    id: 'communiste_republicain',
    name: { fr: 'Le Communiste Républicain', en: 'The Republican Communist' },
    color: '#b91c1c',
    description: {
      fr: "Vous défendez un État fort au service des travailleurs, avec la laïcité et les services publics comme socle.",
      en: "You defend a strong state in service of workers, with secularism and public services as your foundation.",
    },
    traits: {
      fr: ['Pour les services publics à tout prix', 'Laïcité et République', 'Contre les privatisations'],
      en: ['For public services at all costs', 'Secularism and the Republic', 'Against privatisation'],
    },
    primaryCandidate: 'roussel_2027',
    profile: {
      ECONOMY: 10, SOCIAL: 72, IMMIGRATION: 22, SECURITY: 42,
      ENVIRONMENT: 58, DEMOCRACY: 68, GLOBAL: 40, PUBLIC_SERVICES: 95,
    },
  },

  {
    id: 'souverainiste_gauche',
    name: { fr: 'Le Souverainiste de Gauche', en: 'The Left Sovereignist' },
    color: '#7c3aed',
    description: {
      fr: "Vous combinez des convictions économiques de gauche avec une méfiance envers la mondialisation et les institutions supranationales.",
      en: "You combine left-wing economic convictions with distrust of globalisation and supranational institutions.",
    },
    traits: {
      fr: ['Pour la souveraineté nationale', 'Contre la mondialisation néolibérale', 'Pour la protection des travailleurs'],
      en: ['For national sovereignty', 'Against neoliberal globalisation', 'For workers\' protection'],
    },
    primaryCandidate: 'melenchon_2027',
    profile: {
      ECONOMY: 15, SOCIAL: 72, IMMIGRATION: 35, SECURITY: 30,
      ENVIRONMENT: 62, DEMOCRACY: 52, GLOBAL: 20, PUBLIC_SERVICES: 85,
    },
  },

  // ── LEFT ──────────────────────────────────────────────────────────────────

  {
    id: 'ecologiste_engage',
    name: { fr: "L'Écologiste Engagé·e", en: 'The Committed Ecologist' },
    color: '#16a34a',
    description: {
      fr: "L'urgence climatique est votre boussole. Vous défendez une transition radicale et une société plus solidaire.",
      en: "The climate emergency is your compass. You defend a radical transition and a more caring society.",
    },
    traits: {
      fr: ['Pour une transition écologique urgente', 'Contre le nucléaire', 'Pour l\'accueil des migrants'],
      en: ['For urgent ecological transition', 'Against nuclear energy', 'For welcoming migrants'],
    },
    primaryCandidate: 'tondelier',
    profile: {
      ECONOMY: 22, SOCIAL: 88, IMMIGRATION: 15, SECURITY: 28,
      ENVIRONMENT: 94, DEMOCRACY: 85, GLOBAL: 80, PUBLIC_SERVICES: 72,
    },
  },

  {
    id: 'humaniste_gauche',
    name: { fr: "L'Humaniste de Gauche", en: 'The Left Humanist' },
    color: '#be123c',
    description: {
      fr: "Vous croyez en une gauche solidaire et ouverte, qui remet l'humain au centre face aux logiques du marché.",
      en: "You believe in a caring and open left that puts people at the centre against market logic.",
    },
    traits: {
      fr: ['Pour une société inclusive et solidaire', 'Pour l\'État-providence', 'Contre les inégalités'],
      en: ['For an inclusive and caring society', 'For the welfare state', 'Against inequalities'],
    },
    primaryCandidate: 'castets',
    profile: {
      ECONOMY: 18, SOCIAL: 84, IMMIGRATION: 10, SECURITY: 28,
      ENVIRONMENT: 80, DEMOCRACY: 85, GLOBAL: 70, PUBLIC_SERVICES: 90,
    },
  },

  {
    id: 'social_democrate',
    name: { fr: 'Le·La Social-Démocrate', en: 'The Social Democrat' },
    color: '#e75480',
    description: {
      fr: "Vous voulez réformer le capitalisme par le haut : régulation, redistribution et engagement européen fort.",
      en: "You want to reform capitalism from within: regulation, redistribution and strong European commitment.",
    },
    traits: {
      fr: ['Pour une Europe sociale et puissante', 'Pour la redistribution fiscale', 'Pour les droits progressistes'],
      en: ['For a social and powerful Europe', 'For fiscal redistribution', 'For progressive rights'],
    },
    primaryCandidate: 'glucksmann',
    profile: {
      ECONOMY: 30, SOCIAL: 80, IMMIGRATION: 20, SECURITY: 38,
      ENVIRONMENT: 72, DEMOCRACY: 82, GLOBAL: 82, PUBLIC_SERVICES: 78,
    },
  },

  // ── CENTRE-LEFT ───────────────────────────────────────────────────────────

  {
    id: 'progressiste_europeen',
    name: { fr: 'Le·La Progressiste Européen·ne', en: 'The European Progressive' },
    color: '#2563eb',
    description: {
      fr: "Vous croyez que l'Europe est la meilleure réponse aux défis du siècle, avec un socle social solide.",
      en: "You believe Europe is the best answer to this century's challenges, with a solid social foundation.",
    },
    traits: {
      fr: ['Pour une Europe unie et sociale', 'Pour la démocratie et l\'état de droit', 'Pour le progrès social'],
      en: ['For a united and social Europe', 'For democracy and the rule of law', 'For social progress'],
    },
    primaryCandidate: 'glucksmann',
    profile: {
      ECONOMY: 38, SOCIAL: 75, IMMIGRATION: 28, SECURITY: 40,
      ENVIRONMENT: 68, DEMOCRACY: 82, GLOBAL: 82, PUBLIC_SERVICES: 65,
    },
  },

  {
    id: 'ecologiste_pragmatique',
    name: { fr: "L'Écologiste Pragmatique", en: 'The Pragmatic Ecologist' },
    color: '#059669',
    description: {
      fr: "Vous voulez une transition écologique réelle mais sans sacrifier l'économie ni les emplois.",
      en: "You want a real ecological transition but without sacrificing the economy or jobs.",
    },
    traits: {
      fr: ['Pour le climat sans dogmatisme', 'Pour les renouvelables et le nucléaire', 'Pour une économie verte'],
      en: ['For climate without dogma', 'For renewables and nuclear', 'For a green economy'],
    },
    primaryCandidate: 'glucksmann',
    profile: {
      ECONOMY: 38, SOCIAL: 72, IMMIGRATION: 28, SECURITY: 40,
      ENVIRONMENT: 82, DEMOCRACY: 80, GLOBAL: 72, PUBLIC_SERVICES: 65,
    },
  },

  // ── CENTRE ────────────────────────────────────────────────────────────────

  {
    id: 'centriste_republicain',
    name: { fr: 'Le·La Centriste Républicain·e', en: 'The Republican Centrist' },
    color: '#1a3d7c',
    description: {
      fr: "Vous cherchez l'équilibre et le pragmatisme, loin des extrêmes, avec l'attachement à la République.",
      en: "You seek balance and pragmatism, far from extremes, with attachment to the Republic.",
    },
    traits: {
      fr: ['Pour le pragmatisme et la réforme', 'Pour l\'équilibre des finances publiques', 'Pour une immigration maîtrisée'],
      en: ['For pragmatism and reform', 'For balanced public finances', 'For controlled immigration'],
    },
    primaryCandidate: 'philippe',
    profile: {
      ECONOMY: 65, SOCIAL: 52, IMMIGRATION: 55, SECURITY: 62,
      ENVIRONMENT: 55, DEMOCRACY: 78, GLOBAL: 72, PUBLIC_SERVICES: 45,
    },
  },

  {
    id: 'liberal_progressiste',
    name: { fr: 'Le·La Libéral·e Progressiste', en: 'The Progressive Liberal' },
    color: '#a08500',
    description: {
      fr: "Vous combinez liberté économique et valeurs progressistes, dans une vision résolument pro-européenne.",
      en: "You combine economic freedom and progressive values in a resolutely pro-European vision.",
    },
    traits: {
      fr: ['Pour l\'Europe et l\'ouverture', 'Pour les droits individuels', 'Pour l\'économie de marché réformée'],
      en: ['For Europe and openness', 'For individual rights', 'For a reformed market economy'],
    },
    primaryCandidate: 'attal',
    profile: {
      ECONOMY: 62, SOCIAL: 65, IMMIGRATION: 48, SECURITY: 58,
      ENVIRONMENT: 58, DEMOCRACY: 82, GLOBAL: 78, PUBLIC_SERVICES: 48,
    },
  },

  // ── CENTRE-RIGHT ──────────────────────────────────────────────────────────

  {
    id: 'reformiste_liberal',
    name: { fr: 'Le·La Réformiste Libéral·e', en: 'The Liberal Reformist' },
    color: '#374dad',
    description: {
      fr: "Vous croyez que la croissance et la compétitivité sont les meilleurs outils pour financer le progrès social.",
      en: "You believe growth and competitiveness are the best tools to fund social progress.",
    },
    traits: {
      fr: ['Pour la liberté économique', 'Pour l\'Europe et l\'OTAN', 'Pour une immigration régulée'],
      en: ['For economic freedom', 'For Europe and NATO', 'For regulated immigration'],
    },
    primaryCandidate: 'philippe',
    profile: {
      ECONOMY: 68, SOCIAL: 55, IMMIGRATION: 55, SECURITY: 62,
      ENVIRONMENT: 55, DEMOCRACY: 78, GLOBAL: 74, PUBLIC_SERVICES: 42,
    },
  },

  {
    id: 'gaulliste_social',
    name: { fr: 'Le·La Gaulliste Social·e', en: 'The Social Gaullist' },
    color: '#1e40af',
    description: {
      fr: "Vous croyez en un État fort garant de la cohésion nationale, avec un équilibre entre autorité et protection sociale.",
      en: "You believe in a strong state guaranteeing national cohesion, balancing authority and social protection.",
    },
    traits: {
      fr: ['Pour l\'autorité de l\'État', 'Pour la cohésion nationale', 'Pour la protection sociale républicaine'],
      en: ['For state authority', 'For national cohesion', 'For republican social protection'],
    },
    primaryCandidate: 'philippe',
    profile: {
      ECONOMY: 55, SOCIAL: 35, IMMIGRATION: 60, SECURITY: 65,
      ENVIRONMENT: 48, DEMOCRACY: 65, GLOBAL: 58, PUBLIC_SERVICES: 55,
    },
  },

  // ── RIGHT ─────────────────────────────────────────────────────────────────

  {
    id: 'republicain_conservateur',
    name: { fr: 'Le·La Républicain·e Conservateur·rice', en: 'The Conservative Republican' },
    color: '#0066cc',
    description: {
      fr: "Vous défendez les valeurs traditionnelles, l'ordre républicain et une immigration fortement contrôlée.",
      en: "You defend traditional values, republican order and strongly controlled immigration.",
    },
    traits: {
      fr: ['Pour l\'ordre et l\'autorité', 'Pour une immigration très limitée', 'Pour la liberté économique'],
      en: ['For order and authority', 'For very limited immigration', 'For economic freedom'],
    },
    primaryCandidate: 'retailleau',
    profile: {
      ECONOMY: 70, SOCIAL: 28, IMMIGRATION: 75, SECURITY: 82,
      ENVIRONMENT: 40, DEMOCRACY: 55, GLOBAL: 46, PUBLIC_SERVICES: 38,
    },
  },

  {
    id: 'liberal_conservateur',
    name: { fr: 'Le·La Libéral·e Conservateur·rice', en: 'The Liberal Conservative' },
    color: '#1d4ed8',
    description: {
      fr: "Vous associez une vision économique libérale à des positions sociales conservatrices et une ligne ferme sur la sécurité.",
      en: "You combine a liberal economic vision with conservative social positions and a firm line on security.",
    },
    traits: {
      fr: ['Pour le marché libre et la compétitivité', 'Contre l\'immigration de masse', 'Pour la sécurité et la fermeté'],
      en: ['For free market and competitiveness', 'Against mass immigration', 'For security and firmness'],
    },
    primaryCandidate: 'retailleau',
    profile: {
      ECONOMY: 75, SOCIAL: 25, IMMIGRATION: 78, SECURITY: 80,
      ENVIRONMENT: 35, DEMOCRACY: 52, GLOBAL: 50, PUBLIC_SERVICES: 35,
    },
  },

  // ── FAR RIGHT ─────────────────────────────────────────────────────────────

  {
    id: 'national_populiste',
    name: { fr: 'Le·La National·e Populiste', en: 'The National Populist' },
    color: '#003189',
    description: {
      fr: "Vous faites passer la nation et le peuple avant tout, avec une méfiance profonde envers les élites et l'immigration.",
      en: "You put nation and people first, with deep distrust of elites and immigration.",
    },
    traits: {
      fr: ['Pour stopper l\'immigration', 'Pour la préférence nationale', 'Contre les élites mondialistes'],
      en: ['For stopping immigration', 'For national preference', 'Against globalist elites'],
    },
    primaryCandidate: 'lepen_2027',
    profile: {
      ECONOMY: 40, SOCIAL: 12, IMMIGRATION: 94, SECURITY: 88,
      ENVIRONMENT: 25, DEMOCRACY: 40, GLOBAL: 20, PUBLIC_SERVICES: 55,
    },
  },

  {
    id: 'patriote_social',
    name: { fr: 'Le·La Patriote Social·e', en: 'The Social Patriot' },
    color: '#1e3a8a',
    description: {
      fr: "Vous voulez un État fort qui protège les Français d'abord, contre l'immigration et la mondialisation.",
      en: "You want a strong state that protects French people first, against immigration and globalisation.",
    },
    traits: {
      fr: ['Pour la protection des Français', 'Pour les frontières et la sécurité', 'Pour les services publics français'],
      en: ['For protecting French people', 'For borders and security', 'For French public services'],
    },
    primaryCandidate: 'lepen_2027',
    profile: {
      ECONOMY: 35, SOCIAL: 18, IMMIGRATION: 88, SECURITY: 85,
      ENVIRONMENT: 28, DEMOCRACY: 42, GLOBAL: 18, PUBLIC_SERVICES: 62,
    },
  },

  // ── TRANSVERSAL ───────────────────────────────────────────────────────────

  {
    id: 'democrate_participatif',
    name: { fr: 'Le·La Démocrate Participatif·ve', en: 'The Participatory Democrat' },
    color: '#0369a1',
    description: {
      fr: "La démocratie et la participation citoyenne sont vos priorités absolues, au-delà du clivage gauche-droite.",
      en: "Democracy and citizen participation are your absolute priorities, beyond left-right divides.",
    },
    traits: {
      fr: ['Pour la démocratie directe et le RIC', 'Pour la transparence politique', 'Pour les contre-pouvoirs'],
      en: ['For direct democracy and citizen referendums', 'For political transparency', 'For checks and balances'],
    },
    primaryCandidate: 'glucksmann',
    profile: {
      ECONOMY: 42, SOCIAL: 68, IMMIGRATION: 32, SECURITY: 32,
      ENVIRONMENT: 68, DEMOCRACY: 92, GLOBAL: 72, PUBLIC_SERVICES: 62,
    },
  },

  {
    id: 'social_patriote',
    name: { fr: 'Le·La Républicain·e Populaire', en: 'The Popular Republican' },
    color: '#7c2d12',
    description: {
      fr: "Vous défendez les travailleurs et les services publics dans un cadre républicain et laïque strict, avec une méfiance envers l'immigration de masse.",
      en: "You defend workers and public services within a strict secular republican framework, with wariness toward mass immigration.",
    },
    traits: {
      fr: ['Pour les droits des travailleurs', 'Pour la laïcité stricte', 'Pour une immigration contrôlée'],
      en: ['For workers\' rights', 'For strict secularism', 'For controlled immigration'],
    },
    primaryCandidate: 'roussel_2027',
    profile: {
      ECONOMY: 22, SOCIAL: 42, IMMIGRATION: 68, SECURITY: 62,
      ENVIRONMENT: 52, DEMOCRACY: 58, GLOBAL: 35, PUBLIC_SERVICES: 82,
    },
  },
];
