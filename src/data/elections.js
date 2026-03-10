// POLISCOPE — Election & Candidate Data
// Profile scores represent each candidate/party's position on each theme (0–100).
// Theme scale:
//   ECONOMY:         0 = far left / statist,         100 = far right / market
//   SOCIAL:          0 = very conservative,           100 = very progressive
//   IMMIGRATION:     0 = very open / pro-immigration, 100 = very restrictive
//   SECURITY:        0 = civil liberties focus,       100 = law & order focus
//   ENVIRONMENT:     0 = growth / climate-skeptic,    100 = environmentalist
//   DEMOCRACY:       0 = anti-democratic / populist,  100 = pro-democratic
//   GLOBAL:          0 = globalist / pro-EU,          100 = nationalist / sovereignist
//   PUBLIC_SERVICES: 0 = minimal state,               100 = strong welfare state
//
// specificQuestions.positions: candidate stance on each question (1–5 scale)
//   1 = Strongly against the statement
//   5 = Strongly for the statement

export const elections = [
  {
    id: `fr_2022`,
    image: `/images/elections/fr_2022.svg`,
    title: {
      en: `French Presidential Election 2022`,
      fr: `Présidentielle française 2022`,
    },
    country: `France`,
    flag: `🇫🇷`,
    year: 2022,
    description: {
      en: `Emmanuel Macron defeated Marine Le Pen in the second round. Eight candidates competed in the first round.`,
      fr: `Emmanuel Macron a été réélu face à Marine Le Pen au second tour. Huit candidats se sont affrontés au premier tour.`,
    },

    // Short intro — assume user knows nothing
    context: {
      en: [
        `France is a country in western Europe. It has a presidential system, which means the president holds strong executive power and is elected by all French citizens every five years.`,
        `The 2022 election took place at a tense moment. Inflation was rising, wages felt squeezed, and France had just emerged from the COVID-19 pandemic. The main debates were about the retirement age, energy (France relies heavily on nuclear power), immigration, and France's role in the European Union and NATO.`,
        `Twelve candidates competed in the first round. The two who advanced to the decisive second round were centrist Emmanuel Macron and nationalist Marine Le Pen. Macron won with 58.5% of the vote.`,
      ],
      fr: [
        `La France est un pays d'Europe de l'Ouest. Elle dispose d'un système présidentiel, ce qui signifie que le président détient un fort pouvoir exécutif et est élu par tous les citoyens français tous les cinq ans.`,
        `L'élection de 2022 s'est déroulée dans un contexte tendu. L'inflation augmentait, les salaires semblaient insuffisants et la France sortait tout juste de la pandémie de COVID-19. Les principaux débats portaient sur l'âge de la retraite, l'énergie (la France dépend fortement du nucléaire), l'immigration et le rôle de la France au sein de l'Union européenne et de l'OTAN.`,
        `Douze candidats ont concouru au premier tour. Les deux finalistes — le centriste Emmanuel Macron et la nationaliste Marine Le Pen — se sont affrontés au second tour. Macron l'a emporté avec 58,5 % des voix.`,
      ],
    },

    // Expandable deeper context
    deeperContext: {
      en: [
        `France's political landscape in 2022 was unusually fragmented. The traditional left-right divide had broken down. Instead, politics split along new lines: pro-EU centrists versus anti-establishment populists; urban educated voters versus working-class towns.`,
        `The main political camps:\n• The centre — Macron's En Marche: pro-EU, economically liberal, socially progressive.\n• The far right — Le Pen's Rassemblement National and Zemmour's Reconquête: strongly anti-immigration, nationalist, Eurosceptic.\n• The radical left — Mélenchon's La France Insoumise: pro-redistribution, anti-NATO, environmentalist.\n• The traditional left — Socialists (Hidalgo) and Greens (Jadot), in historic decline.\n• The traditional right — Les Républicains (Pécresse), collapsing in support.`,
        `Key fault lines: France has a strict principle of laïcité (separation of church and state), making debates about Islam and national identity particularly intense. A second major division: should France deepen EU integration or reassert national sovereignty?`,
      ],
      fr: [
        `Le paysage politique français en 2022 était inhabituellement fragmenté. Le clivage traditionnel gauche-droite s'était effondré. La politique se divisait désormais selon de nouvelles lignes : centristes pro-UE contre populistes anti-système ; électeurs urbains diplômés contre villes ouvrières.`,
        `Les principaux courants politiques :\n• Le centre — En Marche de Macron : pro-UE, libéral économiquement, progressiste socialement.\n• L'extrême droite — RN de Le Pen et Reconquête de Zemmour : fortement anti-immigration, nationaliste, eurosceptique.\n• La gauche radicale — La France Insoumise de Mélenchon : pro-redistribution, anti-OTAN, écologiste.\n• La gauche traditionnelle — Socialistes (Hidalgo) et Verts (Jadot), en déclin historique.\n• La droite traditionnelle — Les Républicains (Pécresse), en chute libre.`,
        `Lignes de fracture clés : la France a un principe strict de laïcité (séparation de l'Église et de l'État), rendant les débats sur l'islam et l'identité nationale particulièrement intenses. Une autre division majeure : la France doit-elle approfondir l'intégration européenne ou réaffirmer sa souveraineté nationale ?`,
      ],
    },

    // Election-specific questions
    specificQuestions: [
      {
        id: `fr_2022_q1`,
        text: {
          en: `The retirement age in France should be raised to 65 years.`,
          fr: `L'âge de la retraite en France devrait être porté à 65 ans.`,
        },
        theme: `ECONOMY`,
        direction: 1,
        info: {
          en: `France's pension system has been a major political battleground. Macron proposed raising the retirement age from 62 to 65 to maintain fiscal balance.`,
          fr: `Le système de retraite français est un enjeu politique majeur. Macron a proposé de porter l'âge légal de 62 à 65 ans pour maintenir l'équilibre financier.`,
        },
        positions: {
          macron: 4, lepen: 2, melenchon: 1, zemmour: 4,
          jadot: 1, hidalgo: 1, pecresse: 5, roussel: 1,
        },
      },
      {
        id: `fr_2022_q2`,
        text: {
          en: `Nuclear energy should remain the backbone of France's electricity production.`,
          fr: `L'énergie nucléaire doit rester le pilier de la production d'électricité française.`,
        },
        theme: `ENVIRONMENT`,
        direction: -1,
        info: {
          en: `France produces about 70% of its electricity from nuclear power. Whether to maintain, expand, or phase out nuclear was a central energy debate.`,
          fr: `La France produit environ 70 % de son électricité grâce au nucléaire. Maintenir, développer ou sortir du nucléaire était un débat énergétique central.`,
        },
        positions: {
          macron: 5, lepen: 5, melenchon: 2, zemmour: 5,
          jadot: 1, hidalgo: 3, pecresse: 5, roussel: 4,
        },
      },
      {
        id: `fr_2022_q3`,
        text: {
          en: `Immigration to France should be significantly reduced.`,
          fr: `L'immigration vers la France devrait être significativement réduite.`,
        },
        theme: `IMMIGRATION`,
        direction: 1,
        info: {
          en: `Immigration was the top issue for many voters, particularly on the right. Candidates held very different positions, from open borders (Mélenchon) to near-zero immigration (Zemmour).`,
          fr: `L'immigration était la première préoccupation de nombreux électeurs, notamment à droite. Les candidats avaient des positions très différentes, allant aux frontières ouvertes (Mélenchon) à l'immigration quasi nulle (Zemmour).`,
        },
        positions: {
          macron: 3, lepen: 5, melenchon: 1, zemmour: 5,
          jadot: 1, hidalgo: 1, pecresse: 4, roussel: 2,
        },
      },
      {
        id: `fr_2022_q4`,
        text: {
          en: `France should deepen its integration within the European Union.`,
          fr: `La France devrait approfondir son intégration au sein de l'Union européenne.`,
        },
        theme: `GLOBAL`,
        direction: -1,
        info: {
          en: `European integration was a clear dividing line. Macron was the strongest pro-EU candidate; Le Pen and Zemmour called for partial EU withdrawal.`,
          fr: `L'intégration européenne était une ligne de fracture claire. Macron était le candidat le plus pro-UE ; Le Pen et Zemmour appelaient à un retrait partiel de l'UE.`,
        },
        positions: {
          macron: 5, lepen: 1, melenchon: 3, zemmour: 1,
          jadot: 5, hidalgo: 4, pecresse: 4, roussel: 2,
        },
      },
      {
        id: `fr_2022_q5`,
        text: {
          en: `The state should significantly increase spending on public services and social protection.`,
          fr: `L'État devrait augmenter considérablement les dépenses de services publics et de protection sociale.`,
        },
        theme: `PUBLIC_SERVICES`,
        direction: 1,
        info: {
          en: `Public services — hospitals, schools, transport — had been weakened by years of austerity. The debate was how much to invest and how to pay for it.`,
          fr: `Les services publics — hôpitaux, écoles, transports — avaient été fragilisés par des années d'austérité. Le débat portait sur le montant des investissements et leur financement.`,
        },
        positions: {
          macron: 2, lepen: 3, melenchon: 5, zemmour: 2,
          jadot: 4, hidalgo: 5, pecresse: 1, roussel: 5,
        },
      },
      {
        id: `fr_2022_q6`,
        text: {
          en: `France should set ambitious legally binding targets to cut carbon emissions by 2030.`,
          fr: `La France devrait fixer des objectifs légalement contraignants et ambitieux pour réduire les émissions de carbone d'ici 2030.`,
        },
        theme: `ENVIRONMENT`,
        direction: 1,
        info: {
          en: `Climate policy was urgent for some candidates (Jadot, Hidalgo) and secondary for others (Le Pen, Zemmour). France had committed to EU climate targets.`,
          fr: `La politique climatique était urgente pour certains candidats (Jadot, Hidalgo) et secondaire pour d'autres (Le Pen, Zemmour). La France s'était engagée sur des objectifs climatiques européens.`,
        },
        positions: {
          macron: 3, lepen: 2, melenchon: 4, zemmour: 1,
          jadot: 5, hidalgo: 5, pecresse: 3, roussel: 3,
        },
      },
      {
        id: `fr_2022_q7`,
        text: {
          en: `Police and law enforcement powers should be strengthened.`,
          fr: `Les pouvoirs de la police et des forces de l'ordre devraient être renforcés.`,
        },
        theme: `SECURITY`,
        direction: 1,
        info: {
          en: `Security was a major campaign theme. The right called for stronger policing; the left emphasized civil liberties and the need to address root causes of crime.`,
          fr: `La sécurité était un thème majeur de la campagne. La droite appelait à un renforcement des forces de l'ordre ; la gauche mettait l'accent sur les libertés civiles et la lutte contre les causes profondes de la criminalité.`,
        },
        positions: {
          macron: 4, lepen: 5, melenchon: 1, zemmour: 5,
          jadot: 1, hidalgo: 2, pecresse: 4, roussel: 2,
        },
      },
      {
        id: `fr_2022_q8`,
        text: {
          en: `France should increase its military spending and defense capabilities.`,
          fr: `La France devrait augmenter ses dépenses militaires et ses capacités de défense.`,
        },
        theme: `SECURITY`,
        direction: 1,
        info: {
          en: `With the war in Ukraine beginning in February 2022, defense spending became urgent. France had committed to NATO's 2% GDP target.`,
          fr: `Avec la guerre en Ukraine débutant en février 2022, les dépenses de défense sont devenues urgentes. La France s'était engagée sur l'objectif OTAN de 2 % du PIB.`,
        },
        positions: {
          macron: 5, lepen: 4, melenchon: 2, zemmour: 5,
          jadot: 2, hidalgo: 3, pecresse: 4, roussel: 3,
        },
      },
      {
        id: `fr_2022_q9`,
        text: {
          en: `The government should regulate private companies more strictly.`,
          fr: `Le gouvernement devrait réguler plus strictement les entreprises privées.`,
        },
        theme: `ECONOMY`,
        direction: -1,
        info: {
          en: `The left called for stronger regulation of corporations, price controls, and windfall taxes. The right and centre favored lighter regulation to attract investment.`,
          fr: `La gauche réclamait une réglementation plus stricte des entreprises, des contrôles des prix et des taxes sur les superprofits. La droite et le centre préféraient une réglementation plus légère pour attirer les investissements.`,
        },
        positions: {
          macron: 2, lepen: 3, melenchon: 5, zemmour: 2,
          jadot: 4, hidalgo: 4, pecresse: 1, roussel: 5,
        },
      },
      {
        id: `fr_2022_q10`,
        text: {
          en: `Higher education should be completely free for all students.`,
          fr: `L'enseignement supérieur devrait être totalement gratuit pour tous les étudiants.`,
        },
        theme: `PUBLIC_SERVICES`,
        direction: 1,
        info: {
          en: `French public universities already have low tuition fees. The debate was whether to extend full subsidization and increase access for students from lower-income families.`,
          fr: `Les universités publiques françaises ont déjà des frais d'inscription bas. Le débat portait sur l'extension de la gratuité totale et l'amélioration de l'accès pour les étudiants des familles à faibles revenus.`,
        },
        positions: {
          macron: 3, lepen: 3, melenchon: 5, zemmour: 2,
          jadot: 4, hidalgo: 5, pecresse: 2, roussel: 5,
        },
      },
      {
        id: `fr_2022_q11`,
        text: {
          en: `France should reduce its dependence on global supply chains and prioritize domestic production.`,
          fr: `La France devrait réduire sa dépendance aux chaînes d'approvisionnement mondiales et privilégier la production nationale.`,
        },
        theme: `GLOBAL`,
        direction: 1,
        info: {
          en: `The COVID-19 crisis exposed France's dependence on global supply chains, especially for medicines and technology. This fueled debate about industrial relocation.`,
          fr: `La crise COVID-19 a exposé la dépendance de la France aux chaînes d'approvisionnement mondiales, notamment pour les médicaments et la technologie, alimentant le débat sur la relocalisation industrielle.`,
        },
        positions: {
          macron: 3, lepen: 5, melenchon: 4, zemmour: 4,
          jadot: 3, hidalgo: 3, pecresse: 3, roussel: 4,
        },
      },
      {
        id: `fr_2022_q12`,
        text: {
          en: `France's laïcité principle (strict separation of church and state) should be applied more rigorously.`,
          fr: `Le principe de laïcité (séparation stricte de l'Église et de l'État) devrait être appliqué plus rigoureusement en France.`,
        },
        theme: `SOCIAL`,
        direction: -1,
        info: {
          en: `Laïcité is a cornerstone of French republican identity. Debates about religious symbols in public life, particularly Islam, were central to the campaign.`,
          fr: `La laïcité est un pilier de l'identité républicaine française. Les débats sur les symboles religieux dans la vie publique, notamment l'islam, étaient au cœur de la campagne.`,
        },
        positions: {
          macron: 3, lepen: 5, melenchon: 4, zemmour: 5,
          jadot: 2, hidalgo: 4, pecresse: 4, roussel: 3,
        },
      },
    ],

    candidates: [
      {
        id: `macron`,
        image: `/images/candidates/macron.svg`,
        name: `Emmanuel Macron`,
        party: { en: `La République En Marche`, fr: `La République En Marche` },
        color: `#FFD700`,
        result: { en: `Winner (58.5% — 2nd round)`, fr: `Élu (58,5% — 2e tour)` },
        profile: {
          ECONOMY: 68, SOCIAL: 72, IMMIGRATION: 45, SECURITY: 58,
          ENVIRONMENT: 58, DEMOCRACY: 82, GLOBAL: 22, PUBLIC_SERVICES: 48,
        },
        description: {
          en: `Centrist liberal reformer. Pro-EU, economically liberal, socially progressive, moderate on immigration.`,
          fr: `Réformiste libéral centriste. Pro-UE, libéral sur l'économie, progressiste sur le social, modéré sur l'immigration.`,
        },
      },
      {
        id: `lepen`,
        image: `/images/candidates/lepen.svg`,
        name: `Marine Le Pen`,
        party: { en: `Rassemblement National`, fr: `Rassemblement National` },
        color: `#003189`,
        result: { en: `41.5% — 2nd round`, fr: `41,5% — 2e tour` },
        profile: {
          ECONOMY: 42, SOCIAL: 15, IMMIGRATION: 92, SECURITY: 85,
          ENVIRONMENT: 30, DEMOCRACY: 44, GLOBAL: 82, PUBLIC_SERVICES: 58,
        },
        description: {
          en: `Economic nationalist, very anti-immigration, socially conservative, sovereignist.`,
          fr: `Nationaliste économique, très anti-immigration, conservatrice sur le social, souverainiste.`,
        },
      },
      {
        id: `melenchon`,
        image: `/images/candidates/melenchon.svg`,
        name: `Jean-Luc Mélenchon`,
        party: { en: `La France Insoumise`, fr: `La France Insoumise` },
        color: `#CC0000`,
        result: { en: `21.95% — 1st round`, fr: `21,95% — 1er tour` },
        profile: {
          ECONOMY: 12, SOCIAL: 88, IMMIGRATION: 12, SECURITY: 24,
          ENVIRONMENT: 82, DEMOCRACY: 62, GLOBAL: 45, PUBLIC_SERVICES: 90,
        },
        description: {
          en: `Radical left. Strong welfare state, very pro-immigration, very progressive, environmentalist.`,
          fr: `Gauche radicale. État-providence fort, très pro-immigration, très progressiste, écologiste.`,
        },
      },
      {
        id: `zemmour`,
        image: `/images/candidates/zemmour.svg`,
        name: `Éric Zemmour`,
        party: { en: `Reconquête`, fr: `Reconquête` },
        color: `#00009A`,
        result: { en: `7.07% — 1st round`, fr: `7,07% — 1er tour` },
        profile: {
          ECONOMY: 55, SOCIAL: 8, IMMIGRATION: 97, SECURITY: 90,
          ENVIRONMENT: 18, DEMOCRACY: 38, GLOBAL: 88, PUBLIC_SERVICES: 38,
        },
        description: {
          en: `Far-right. Extremely anti-immigration, very conservative socially, nationalist.`,
          fr: `Extrême droite. Extrêmement anti-immigration, très conservateur socialement, nationaliste.`,
        },
      },
      {
        id: `jadot`,
        image: `/images/candidates/jadot.svg`,
        name: `Yannick Jadot`,
        party: { en: `Europe Écologie Les Verts`, fr: `Europe Écologie Les Verts` },
        color: `#00A550`,
        result: { en: `4.63% — 1st round`, fr: `4,63% — 1er tour` },
        profile: {
          ECONOMY: 28, SOCIAL: 85, IMMIGRATION: 12, SECURITY: 28,
          ENVIRONMENT: 96, DEMOCRACY: 88, GLOBAL: 18, PUBLIC_SERVICES: 68,
        },
        description: {
          en: `Green/ecological. Strong climate action, pro-immigration, very progressive, pro-EU.`,
          fr: `Écologiste. Action climatique forte, pro-immigration, très progressiste, pro-UE.`,
        },
      },
      {
        id: `hidalgo`,
        image: `/images/candidates/hidalgo.svg`,
        name: `Anne Hidalgo`,
        party: { en: `Parti Socialiste`, fr: `Parti Socialiste` },
        color: `#E75480`,
        result: { en: `1.75% — 1st round`, fr: `1,75% — 1er tour` },
        profile: {
          ECONOMY: 22, SOCIAL: 85, IMMIGRATION: 15, SECURITY: 32,
          ENVIRONMENT: 72, DEMOCRACY: 82, GLOBAL: 20, PUBLIC_SERVICES: 84,
        },
        description: {
          en: `Socialist. Strong public services, pro-immigration, very progressive, environmentalist.`,
          fr: `Socialiste. Services publics forts, pro-immigration, très progressiste, écologiste.`,
        },
      },
      {
        id: `pecresse`,
        image: `/images/candidates/pecresse.svg`,
        name: `Valérie Pécresse`,
        party: { en: `Les Républicains`, fr: `Les Républicains` },
        color: `#0066CC`,
        result: { en: `4.78% — 1st round`, fr: `4,78% — 1er tour` },
        profile: {
          ECONOMY: 72, SOCIAL: 35, IMMIGRATION: 68, SECURITY: 75,
          ENVIRONMENT: 48, DEMOCRACY: 74, GLOBAL: 42, PUBLIC_SERVICES: 38,
        },
        description: {
          en: `Conservative right. Economically liberal, tough on immigration, traditional social values.`,
          fr: `Droite conservatrice. Libérale sur l'économie, ferme sur l'immigration, valeurs sociales traditionnelles.`,
        },
      },
      {
        id: `roussel`,
        image: `/images/candidates/roussel.svg`,
        name: `Fabien Roussel`,
        party: { en: `Parti Communiste Français`, fr: `Parti Communiste Français` },
        color: `#AA0000`,
        result: { en: `2.28% — 1st round`, fr: `2,28% — 1er tour` },
        profile: {
          ECONOMY: 8, SOCIAL: 75, IMMIGRATION: 10, SECURITY: 38,
          ENVIRONMENT: 62, DEMOCRACY: 68, GLOBAL: 52, PUBLIC_SERVICES: 95,
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
    image: `/images/elections/us_2020.svg`,
    title: {
      en: `US Presidential Election 2020`,
      fr: `Présidentielle américaine 2020`,
    },
    country: `USA`,
    flag: `🇺🇸`,
    year: 2020,
    description: {
      en: `Joe Biden defeated incumbent Donald Trump, winning 306 electoral votes to Trump's 232.`,
      fr: `Joe Biden a battu Donald Trump, remportant 306 grands électeurs contre 232.`,
    },

    context: {
      en: [
        `The United States is the world's largest economy and most powerful military. The president is elected every four years, not directly by citizens but through the Electoral College — a system where each state's votes are counted separately.`,
        `The 2020 election happened during one of the most turbulent years in modern American history. The COVID-19 pandemic had killed hundreds of thousands and crashed the economy. Protests erupted across the country after the death of George Floyd, a Black man killed by police in Minneapolis.`,
        `Democrat Joe Biden, former Vice President under Barack Obama, challenged Republican incumbent Donald Trump. Biden won with 81 million popular votes — the most ever received by a presidential candidate — and 306 electoral college votes.`,
      ],
      fr: [
        `Les États-Unis sont la plus grande économie et la plus puissante armée du monde. Le président est élu tous les quatre ans, non pas directement par les citoyens, mais par le biais du Collège électoral — un système où les votes de chaque État sont comptés séparément.`,
        `L'élection de 2020 s'est déroulée lors de l'une des années les plus turbulentes de l'histoire américaine moderne. La pandémie de COVID-19 avait tué des centaines de milliers de personnes et effondré l'économie. Des manifestations ont éclaté dans tout le pays après la mort de George Floyd.`,
        `Le démocrate Joe Biden, ancien vice-président sous Barack Obama, a défié le président républicain sortant Donald Trump. Biden a remporté 81 millions de votes populaires — le plus jamais enregistré — et 306 grands électeurs.`,
      ],
    },

    deeperContext: {
      en: [
        `American politics in 2020 was deeply polarized — arguably more than at any point since the 1960s. The dividing lines were cultural, racial, and economic.`,
        `The two parties:\n• Democrats — A broad coalition from moderate centrists to democratic socialists. Biden represented the moderate wing, favored by older voters, suburban women, and college-educated whites.\n• Republicans — Transformed under Trump into a nationalist, populist movement. Strong on immigration restriction, trade protectionism, and "America First" foreign policy. Supported strongly by white working-class voters and rural communities.`,
        `Key issues:\n• Healthcare: The US has no universal health system. Biden wanted to expand the Affordable Care Act; Trump wanted to repeal it.\n• Race and policing: The Black Lives Matter movement demanded police reform. Trump ran on "Law and Order."\n• Climate: Biden promised to rejoin the Paris Agreement and invest in clean energy. Trump had withdrawn from Paris and backed fossil fuels.\n• COVID-19: Biden called for a national mask mandate and science-led response. Trump downplayed the virus.`,
      ],
      fr: [
        `La politique américaine en 2020 était profondément polarisée — plus que jamais depuis les années 1960. Les lignes de division étaient culturelles, raciales et économiques.`,
        `Les deux partis :\n• Démocrates — Une large coalition allant des centristes modérés aux socialistes démocrates. Biden représentait l'aile modérée, soutenu par les électeurs plus âgés, les femmes de banlieue et les blancs diplômés.\n• Républicains — Transformés sous Trump en un mouvement nationaliste et populiste. Forte restriction de l'immigration, protectionnisme commercial et politique étrangère "America First". Soutenus fortement par la classe ouvrière blanche et les communautés rurales.`,
        `Enjeux clés :\n• Santé : Les États-Unis n'ont pas de système de santé universel. Biden voulait élargir l'Affordable Care Act ; Trump voulait l'abolir.\n• Race et police : Le mouvement Black Lives Matter exigeait une réforme de la police. Trump a misé sur "La loi et l'ordre".\n• Climat : Biden a promis de rejoindre l'Accord de Paris et d'investir dans les énergies propres. Trump avait quitté l'accord et soutenu les combustibles fossiles.`,
      ],
    },

    specificQuestions: [
      {
        id: `us_2020_q1`,
        text: {
          en: `The US should establish a universal healthcare system covering all Americans.`,
          fr: `Les États-Unis devraient mettre en place un système de santé universel couvrant tous les Américains.`,
        },
        theme: `PUBLIC_SERVICES`,
        direction: 1,
        info: {
          en: `The US is the only wealthy country without universal healthcare. The debate is between expanding government coverage (Democrats) and relying on private insurance (Republicans).`,
          fr: `Les États-Unis sont le seul pays riche sans couverture médicale universelle. Le débat oppose l'extension de la couverture gouvernementale (Démocrates) au recours à l'assurance privée (Républicains).`,
        },
        positions: { biden: 3, trump: 1 },
      },
      {
        id: `us_2020_q2`,
        text: {
          en: `The federal minimum wage should be raised to $15 per hour.`,
          fr: `Le salaire minimum fédéral devrait être porté à 15 dollars de l'heure.`,
        },
        theme: `ECONOMY`,
        direction: -1,
        info: {
          en: `The federal minimum wage of $7.25/hour had not been raised since 2009. Democrats proposed $15; Republicans argued it would kill jobs.`,
          fr: `Le salaire minimum fédéral de 7,25 $/heure n'avait pas été augmenté depuis 2009. Les Démocrates proposaient 15 $ ; les Républicains arguaient que cela détruirait des emplois.`,
        },
        positions: { biden: 4, trump: 2 },
      },
      {
        id: `us_2020_q3`,
        text: {
          en: `Immigration at the US-Mexico border should be strictly controlled and reduced.`,
          fr: `L'immigration à la frontière américano-mexicaine devrait être strictement contrôlée et réduite.`,
        },
        theme: `IMMIGRATION`,
        direction: 1,
        info: {
          en: `Trump built sections of a border wall and implemented strict policies. Biden promised to undo many of these and offer a path to citizenship for millions of undocumented immigrants.`,
          fr: `Trump a construit des sections d'un mur frontalier et a mis en œuvre des politiques strictes. Biden a promis de défaire bon nombre de ces mesures et d'offrir une voie vers la citoyenneté pour des millions d'immigrés sans papiers.`,
        },
        positions: { biden: 2, trump: 5 },
      },
      {
        id: `us_2020_q4`,
        text: {
          en: `The US should rejoin international agreements, such as the Paris Climate Accord.`,
          fr: `Les États-Unis devraient rejoindre des accords internationaux tels que l'Accord de Paris sur le climat.`,
        },
        theme: `GLOBAL`,
        direction: -1,
        info: {
          en: `Trump withdrew the US from the Paris Agreement and the WHO. Biden pledged to rejoin both on his first day in office — which he did.`,
          fr: `Trump a retiré les États-Unis de l'Accord de Paris et de l'OMS. Biden s'est engagé à rejoindre les deux dès son premier jour au bureau — ce qu'il a fait.`,
        },
        positions: { biden: 5, trump: 1 },
      },
      {
        id: `us_2020_q5`,
        text: {
          en: `The federal government should make major investments to address climate change.`,
          fr: `Le gouvernement fédéral devrait réaliser des investissements majeurs pour lutter contre le changement climatique.`,
        },
        theme: `ENVIRONMENT`,
        direction: 1,
        info: {
          en: `Biden proposed a $2 trillion climate plan. Trump had rolled back hundreds of environmental regulations and called climate change a "hoax."`,
          fr: `Biden a proposé un plan climatique de 2 000 milliards de dollars. Trump avait supprimé des centaines de réglementations environnementales et qualifié le changement climatique d'"imposture".`,
        },
        positions: { biden: 5, trump: 1 },
      },
      {
        id: `us_2020_q6`,
        text: {
          en: `The government should impose stricter gun control regulations.`,
          fr: `Le gouvernement devrait imposer des réglementations plus strictes sur le contrôle des armes à feu.`,
        },
        theme: `SECURITY`,
        direction: -1,
        info: {
          en: `Gun violence kills over 40,000 Americans per year. Democrats favor expanded background checks and assault weapon bans. Republicans prioritize Second Amendment rights.`,
          fr: `La violence par armes à feu tue plus de 40 000 Américains par an. Les Démocrates favorisent les vérifications d'antécédents élargies et l'interdiction des armes d'assaut. Les Républicains privilégient les droits du Second Amendement.`,
        },
        positions: { biden: 4, trump: 1 },
      },
      {
        id: `us_2020_q7`,
        text: {
          en: `Corporate tax rates should be reduced to stimulate economic growth.`,
          fr: `Les taux d'imposition des entreprises devraient être réduits pour stimuler la croissance économique.`,
        },
        theme: `ECONOMY`,
        direction: 1,
        info: {
          en: `Trump cut corporate taxes from 35% to 21% in 2017. Biden proposed raising them back to 28% to fund social programs.`,
          fr: `Trump a réduit les taxes sur les sociétés de 35 % à 21 % en 2017. Biden a proposé de les relever à 28 % pour financer des programmes sociaux.`,
        },
        positions: { biden: 1, trump: 5 },
      },
      {
        id: `us_2020_q8`,
        text: {
          en: `The US should adopt protectionist trade policies to protect American workers.`,
          fr: `Les États-Unis devraient adopter des politiques commerciales protectionnistes pour protéger les travailleurs américains.`,
        },
        theme: `GLOBAL`,
        direction: 1,
        info: {
          en: `Trump imposed tariffs on Chinese and European goods. Biden favored multilateral trade agreements but also emphasized "buying American."`,
          fr: `Trump a imposé des droits de douane sur les marchandises chinoises et européennes. Biden favorisait les accords commerciaux multilatéraux mais a aussi mis l'accent sur le "Buy American".`,
        },
        positions: { biden: 2, trump: 5 },
      },
      {
        id: `us_2020_q9`,
        text: {
          en: `Abortion should remain legal and accessible in all US states.`,
          fr: `L'avortement devrait rester légal et accessible dans tous les États américains.`,
        },
        theme: `SOCIAL`,
        direction: 1,
        info: {
          en: `Roe v. Wade protected abortion rights federally until 2022. Trump appointed three Supreme Court justices who later voted to overturn it. Biden strongly supported abortion access.`,
          fr: `Roe v. Wade protégeait les droits à l'avortement jusqu'en 2022. Trump a nommé trois juges à la Cour suprême qui ont voté pour l'annuler. Biden soutenait fermement l'accès à l'avortement.`,
        },
        positions: { biden: 5, trump: 1 },
      },
      {
        id: `us_2020_q10`,
        text: {
          en: `The federal government should take strong action to reduce racial inequality.`,
          fr: `Le gouvernement fédéral devrait prendre des mesures fortes pour réduire les inégalités raciales.`,
        },
        theme: `SOCIAL`,
        direction: 1,
        info: {
          en: `Following the killing of George Floyd, racial justice became a central issue. Biden called for police reform and racial equity programs. Trump rejected the "systemic racism" framing.`,
          fr: `Suite à la mort de George Floyd, la justice raciale est devenue un enjeu central. Biden a appelé à la réforme de la police et à des programmes d'équité raciale. Trump a rejeté le concept de "racisme systémique".`,
        },
        positions: { biden: 5, trump: 1 },
      },
      {
        id: `us_2020_q11`,
        text: {
          en: `The US should increase its military spending.`,
          fr: `Les États-Unis devraient augmenter leurs dépenses militaires.`,
        },
        theme: `SECURITY`,
        direction: 1,
        info: {
          en: `The US already spends more on defense than the next 10 countries combined. Trump increased military spending; Biden proposed modest increases.`,
          fr: `Les États-Unis dépensent déjà plus pour la défense que les 10 pays suivants réunis. Trump a augmenté les dépenses militaires ; Biden a proposé des augmentations modestes.`,
        },
        positions: { biden: 2, trump: 4 },
      },
      {
        id: `us_2020_q12`,
        text: {
          en: `The US should maintain strong multilateral alliances such as NATO.`,
          fr: `Les États-Unis devraient maintenir de solides alliances multilatérales telles que l'OTAN.`,
        },
        theme: `GLOBAL`,
        direction: -1,
        info: {
          en: `Trump repeatedly questioned NATO's value and demanded allies pay more. Biden called NATO "a sacred commitment" and promised to restore US leadership in international institutions.`,
          fr: `Trump a à plusieurs reprises remis en question la valeur de l'OTAN. Biden a qualifié l'OTAN d'"engagement sacré" et promis de restaurer le leadership américain dans les institutions internationales.`,
        },
        positions: { biden: 5, trump: 2 },
      },
    ],

    candidates: [
      {
        id: `biden`,
        image: `/images/candidates/biden.svg`,
        name: `Joe Biden`,
        party: { en: `Democratic Party`, fr: `Parti démocrate` },
        color: `#003594`,
        result: { en: `Winner — 306 electoral votes`, fr: `Élu — 306 grands électeurs` },
        profile: {
          ECONOMY: 40, SOCIAL: 78, IMMIGRATION: 28, SECURITY: 52,
          ENVIRONMENT: 72, DEMOCRACY: 85, GLOBAL: 20, PUBLIC_SERVICES: 65,
        },
        description: {
          en: `Center-left Democrat. Moderate on economy, progressive on social issues, strongly pro-multilateralism.`,
          fr: `Démocrate de centre-gauche. Modéré sur l'économie, progressiste sur le social, fortement pro-multilatéralisme.`,
        },
      },
      {
        id: `trump`,
        image: `/images/candidates/trump.svg`,
        name: `Donald Trump`,
        party: { en: `Republican Party`, fr: `Parti républicain` },
        color: `#CC0000`,
        result: { en: `232 electoral votes`, fr: `232 grands électeurs` },
        profile: {
          ECONOMY: 62, SOCIAL: 18, IMMIGRATION: 90, SECURITY: 85,
          ENVIRONMENT: 15, DEMOCRACY: 35, GLOBAL: 88, PUBLIC_SERVICES: 28,
        },
        description: {
          en: `Economic nationalist. Very anti-immigration, climate-skeptic, culturally conservative, sovereignist.`,
          fr: `Nationaliste économique. Très anti-immigration, climato-sceptique, conservateur culturellement, souverainiste.`,
        },
      },
    ],
  },
];
