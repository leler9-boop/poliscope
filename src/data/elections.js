// POLISCOPE — Election & Candidate Data
// Profile scores represent each candidate/party's position on each theme (0–100).
// Theme scale:
//   ECONOMY:         0 = far left / statist,       100 = far right / market
//   SOCIAL:          0 = very conservative,         100 = very progressive
//   IMMIGRATION:     0 = very open / pro-immigration, 100 = very restrictive
//   SECURITY:        0 = civil liberties focus,     100 = law & order focus
//   ENVIRONMENT:     0 = growth / skeptic,          100 = environmentalist
//   DEMOCRACY:       0 = anti-democratic / populist, 100 = pro-democratic
//   GLOBAL:          0 = globalist / pro-EU,         100 = nationalist / sovereignist
//   PUBLIC_SERVICES: 0 = minimal state,             100 = strong welfare state

export const elections = [
  {
    id: `fr_2022`,
    title: {
      en: `French Presidential Election 2022`,
      fr: `Élection présidentielle française 2022`,
    },
    country: `France`,
    flag: `🇫🇷`,
    year: 2022,
    description: {
      en: `The 2022 French presidential election saw Emmanuel Macron re-elected against Marine Le Pen in the second round. Eight major candidates competed in the first round.`,
      fr: `L'élection présidentielle française de 2022 a vu Emmanuel Macron réélu face à Marine Le Pen au second tour. Huit candidats majeurs se sont affrontés au premier tour.`,
    },
    candidates: [
      {
        id: `macron`,
        name: `Emmanuel Macron`,
        party: { en: `La République En Marche`, fr: `La République En Marche` },
        color: `#FFD700`,
        result: { en: `Winner (58.5% — 2nd round)`, fr: `Élu (58,5% — 2e tour)` },
        profile: {
          ECONOMY: 68,
          SOCIAL: 72,
          IMMIGRATION: 45,
          SECURITY: 58,
          ENVIRONMENT: 58,
          DEMOCRACY: 82,
          GLOBAL: 22,
          PUBLIC_SERVICES: 48,
        },
        description: {
          en: `Centrist liberal reformer. Pro-EU, economically liberal, socially progressive, moderate on immigration.`,
          fr: `Réformiste libéral centriste. Pro-UE, libéral sur l'économie, progressiste sur les questions sociales, modéré sur l'immigration.`,
        },
      },
      {
        id: `lepen`,
        name: `Marine Le Pen`,
        party: { en: `Rassemblement National`, fr: `Rassemblement National` },
        color: `#003189`,
        result: { en: `41.5% — 2nd round`, fr: `41,5% — 2e tour` },
        profile: {
          ECONOMY: 42,
          SOCIAL: 15,
          IMMIGRATION: 92,
          SECURITY: 85,
          ENVIRONMENT: 30,
          DEMOCRACY: 44,
          GLOBAL: 82,
          PUBLIC_SERVICES: 58,
        },
        description: {
          en: `Economic nationalist, very anti-immigration, socially conservative, sovereignist, pro-Putin.`,
          fr: `Nationaliste économique, très anti-immigration, conservatrice sur les questions sociales, souverainiste, pro-Poutine.`,
        },
      },
      {
        id: `melenchon`,
        name: `Jean-Luc Mélenchon`,
        party: { en: `La France Insoumise`, fr: `La France Insoumise` },
        color: `#CC0000`,
        result: { en: `21.95% — 1st round`, fr: `21,95% — 1er tour` },
        profile: {
          ECONOMY: 12,
          SOCIAL: 88,
          IMMIGRATION: 12,
          SECURITY: 24,
          ENVIRONMENT: 82,
          DEMOCRACY: 62,
          GLOBAL: 45,
          PUBLIC_SERVICES: 90,
        },
        description: {
          en: `Radical left. Strong welfare state, very pro-immigration, very progressive socially, environmentalist.`,
          fr: `Gauche radicale. État-providence fort, très pro-immigration, très progressiste socialement, écologiste.`,
        },
      },
      {
        id: `zemmour`,
        name: `Éric Zemmour`,
        party: { en: `Reconquête`, fr: `Reconquête` },
        color: `#00009A`,
        result: { en: `7.07% — 1st round`, fr: `7,07% — 1er tour` },
        profile: {
          ECONOMY: 55,
          SOCIAL: 8,
          IMMIGRATION: 97,
          SECURITY: 90,
          ENVIRONMENT: 18,
          DEMOCRACY: 38,
          GLOBAL: 88,
          PUBLIC_SERVICES: 38,
        },
        description: {
          en: `Far-right. Extremely anti-immigration, very conservative socially, nationalist, authoritarian tendencies.`,
          fr: `Extrême droite. Extrêmement anti-immigration, très conservateur socialement, nationaliste, tendances autoritaires.`,
        },
      },
      {
        id: `jadot`,
        name: `Yannick Jadot`,
        party: { en: `Europe Écologie Les Verts`, fr: `Europe Écologie Les Verts` },
        color: `#00A550`,
        result: { en: `4.63% — 1st round`, fr: `4,63% — 1er tour` },
        profile: {
          ECONOMY: 28,
          SOCIAL: 85,
          IMMIGRATION: 12,
          SECURITY: 28,
          ENVIRONMENT: 96,
          DEMOCRACY: 88,
          GLOBAL: 18,
          PUBLIC_SERVICES: 68,
        },
        description: {
          en: `Green/ecological. Strong climate action, pro-immigration, very progressive, pro-EU.`,
          fr: `Écologiste. Action climatique forte, pro-immigration, très progressiste, pro-UE.`,
        },
      },
      {
        id: `hidalgo`,
        name: `Anne Hidalgo`,
        party: { en: `Parti Socialiste`, fr: `Parti Socialiste` },
        color: `#E75480`,
        result: { en: `1.75% — 1st round`, fr: `1,75% — 1er tour` },
        profile: {
          ECONOMY: 22,
          SOCIAL: 85,
          IMMIGRATION: 15,
          SECURITY: 32,
          ENVIRONMENT: 72,
          DEMOCRACY: 82,
          GLOBAL: 20,
          PUBLIC_SERVICES: 84,
        },
        description: {
          en: `Socialist. Strong public services, pro-immigration, very progressive, environmentalist.`,
          fr: `Socialiste. Services publics forts, pro-immigration, très progressiste, écologiste.`,
        },
      },
      {
        id: `pecresse`,
        name: `Valérie Pécresse`,
        party: { en: `Les Républicains`, fr: `Les Républicains` },
        color: `#0066CC`,
        result: { en: `4.78% — 1st round`, fr: `4,78% — 1er tour` },
        profile: {
          ECONOMY: 72,
          SOCIAL: 35,
          IMMIGRATION: 68,
          SECURITY: 75,
          ENVIRONMENT: 48,
          DEMOCRACY: 74,
          GLOBAL: 42,
          PUBLIC_SERVICES: 38,
        },
        description: {
          en: `Conservative right. Economically liberal, tough on immigration, traditional social values.`,
          fr: `Droite conservatrice. Libérale sur l'économie, ferme sur l'immigration, valeurs sociales traditionnelles.`,
        },
      },
      {
        id: `roussel`,
        name: `Fabien Roussel`,
        party: { en: `Parti Communiste Français`, fr: `Parti Communiste Français` },
        color: `#CC0000`,
        result: { en: `2.28% — 1st round`, fr: `2,28% — 1er tour` },
        profile: {
          ECONOMY: 8,
          SOCIAL: 75,
          IMMIGRATION: 10,
          SECURITY: 38,
          ENVIRONMENT: 62,
          DEMOCRACY: 68,
          GLOBAL: 52,
          PUBLIC_SERVICES: 95,
        },
        description: {
          en: `Communist. Maximum welfare state, very pro-immigration, progressive, strongly statist economy.`,
          fr: `Communiste. État-providence maximal, très pro-immigration, progressiste, économie fortement étatiste.`,
        },
      },
    ],
  },
  {
    id: `us_2020`,
    title: {
      en: `US Presidential Election 2020`,
      fr: `Élection présidentielle américaine 2020`,
    },
    country: `USA`,
    flag: `🇺🇸`,
    year: 2020,
    description: {
      en: `Joe Biden defeated incumbent Donald Trump in the 2020 US presidential election, winning 306 electoral votes to Trump's 232.`,
      fr: `Joe Biden a battu le président sortant Donald Trump lors de l'élection présidentielle américaine de 2020, remportant 306 grands électeurs contre 232.`,
    },
    candidates: [
      {
        id: `biden`,
        name: `Joe Biden`,
        party: { en: `Democratic Party`, fr: `Parti démocrate` },
        color: `#003594`,
        result: { en: `Winner — 306 electoral votes`, fr: `Élu — 306 grands électeurs` },
        profile: {
          ECONOMY: 40,
          SOCIAL: 78,
          IMMIGRATION: 28,
          SECURITY: 52,
          ENVIRONMENT: 72,
          DEMOCRACY: 85,
          GLOBAL: 20,
          PUBLIC_SERVICES: 65,
        },
        description: {
          en: `Center-left Democrat. Moderate on economy, progressive on social issues, pro-multilateralism.`,
          fr: `Démocrate de centre-gauche. Modéré sur l'économie, progressiste sur les questions sociales, pro-multilatéralisme.`,
        },
      },
      {
        id: `trump`,
        name: `Donald Trump`,
        party: { en: `Republican Party`, fr: `Parti républicain` },
        color: `#CC0000`,
        result: { en: `232 electoral votes`, fr: `232 grands électeurs` },
        profile: {
          ECONOMY: 62,
          SOCIAL: 18,
          IMMIGRATION: 90,
          SECURITY: 85,
          ENVIRONMENT: 15,
          DEMOCRACY: 35,
          GLOBAL: 88,
          PUBLIC_SERVICES: 28,
        },
        description: {
          en: `Economic nationalist. Very anti-immigration, climate-skeptic, culturally conservative, sovereignist.`,
          fr: `Nationaliste économique. Très anti-immigration, climato-sceptique, conservateur culturellement, souverainiste.`,
        },
      },
    ],
  },
];

