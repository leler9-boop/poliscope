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
    image: `https://commons.wikimedia.org/wiki/Special:FilePath/Tour_Eiffel_Wikimedia_Commons.jpg?width=1200`,
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
      {
        id: `fr_2022_q13`,
        text: {
          en: `A major wealth tax on assets above €1 million should be introduced or restored.`,
          fr: `Une grande taxe sur les fortunes supérieures à 1 million d'euros devrait être instaurée ou rétablie.`,
        },
        theme: `ECONOMY`,
        direction: -1,
        info: {
          en: `Macron abolished the ISF (wealth tax) in 2017 and replaced it with a property-only tax. The left called for its full restoration; the right backed the change.`,
          fr: `Macron a supprimé l'ISF en 2017 et l'a remplacé par une taxe uniquement sur l'immobilier. La gauche a réclamé son rétablissement ; la droite a soutenu la suppression.`,
        },
        positions: {
          macron: 1, lepen: 3, melenchon: 5, zemmour: 2,
          jadot: 5, hidalgo: 5, pecresse: 1, roussel: 5,
        },
      },
      {
        id: `fr_2022_q14`,
        text: {
          en: `Same-sex couples should have the same adoption and parenting rights as heterosexual couples.`,
          fr: `Les couples de même sexe devraient avoir les mêmes droits d'adoption et de parentalité que les couples hétérosexuels.`,
        },
        theme: `SOCIAL`,
        direction: 1,
        info: {
          en: `Same-sex marriage was legalised in France in 2013. The debate continued on medically assisted reproduction (PMA) for same-sex female couples, eventually legalised in 2021.`,
          fr: `Le mariage pour tous a été légalisé en France en 2013. Le débat a continué sur la PMA pour les couples de femmes, finalement légalisée en 2021.`,
        },
        positions: {
          macron: 5, lepen: 2, melenchon: 5, zemmour: 1,
          jadot: 5, hidalgo: 5, pecresse: 3, roussel: 4,
        },
      },
      {
        id: `fr_2022_q15`,
        text: {
          en: `France should transition to a fully proportional electoral system.`,
          fr: `La France devrait adopter un système électoral entièrement proportionnel.`,
        },
        theme: `DEMOCRACY`,
        direction: 1,
        info: {
          en: `France uses a two-round majority system which tends to produce absolute majorities. Critics argue proportional representation would better reflect voter diversity; supporters argue it enables stable governance.`,
          fr: `La France utilise un scrutin majoritaire à deux tours qui tend à produire des majorités absolues. Les partisans de la proportionnelle estiment qu'elle reflète mieux la diversité des électeurs.`,
        },
        positions: {
          macron: 2, lepen: 3, melenchon: 5, zemmour: 2,
          jadot: 5, hidalgo: 4, pecresse: 2, roussel: 5,
        },
      },
      {
        id: `fr_2022_q16`,
        text: {
          en: `The state should make major new investments in rail and public transport infrastructure.`,
          fr: `L'État devrait réaliser de grands investissements dans les infrastructures ferroviaires et les transports en commun.`,
        },
        theme: `PUBLIC_SERVICES`,
        direction: 1,
        info: {
          en: `France's regional rail network has suffered from years of underinvestment. The debate is whether to prioritise new TGV lines or maintain and restore everyday regional networks.`,
          fr: `Le réseau ferroviaire régional français a souffert des années de sous-investissement. Le débat porte sur la priorité à donner aux nouvelles lignes TGV ou à l'entretien des réseaux régionaux quotidiens.`,
        },
        positions: {
          macron: 3, lepen: 3, melenchon: 5, zemmour: 2,
          jadot: 5, hidalgo: 5, pecresse: 2, roussel: 5,
        },
      },
      {
        id: `fr_2022_q17`,
        text: {
          en: `France should accelerate its transition to renewable energy beyond nuclear power.`,
          fr: `La France devrait accélérer sa transition vers les énergies renouvelables au-delà du nucléaire.`,
        },
        theme: `ENVIRONMENT`,
        direction: 1,
        info: {
          en: `France has the EU's highest nuclear share in its electricity mix. The Greens and left called for a rapid renewable transition; most other parties wanted to keep nuclear as a base.`,
          fr: `La France a la plus grande part de nucléaire dans son mix électrique en Europe. Les Verts et la gauche réclamaient une transition rapide vers les renouvelables ; la plupart des autres partis voulaient conserver le nucléaire.`,
        },
        positions: {
          macron: 3, lepen: 2, melenchon: 4, zemmour: 1,
          jadot: 5, hidalgo: 4, pecresse: 2, roussel: 3,
        },
      },
      {
        id: `fr_2022_q18`,
        text: {
          en: `The judiciary should be more independent from the executive branch.`,
          fr: `La justice devrait être plus indépendante du pouvoir exécutif.`,
        },
        theme: `DEMOCRACY`,
        direction: 1,
        info: {
          en: `France's constitution gives the president significant influence over the judiciary, including the appointment of senior judges. Critics argue this compromises judicial independence.`,
          fr: `La Constitution française donne au président une influence significative sur la justice, notamment dans la nomination des hauts magistrats. Les critiques estiment que cela compromet l'indépendance judiciaire.`,
        },
        positions: {
          macron: 3, lepen: 3, melenchon: 5, zemmour: 3,
          jadot: 5, hidalgo: 4, pecresse: 3, roussel: 4,
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
    image: `https://commons.wikimedia.org/wiki/Special:FilePath/US_Capitol_west_side.JPG?width=1200`,
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
      {
        id: `us_2020_q13`,
        text: {
          en: `The federal government should cancel a significant portion of student loan debt.`,
          fr: `Le gouvernement fédéral devrait annuler une part importante de la dette étudiante.`,
        },
        theme: `PUBLIC_SERVICES`,
        direction: 1,
        info: {
          en: `Americans hold over $1.7 trillion in student debt. Biden cancelled some debt via executive action; Trump opposed federal cancellation as unfair to those who did not attend college.`,
          fr: `Les Américains détiennent plus de 1 700 milliards de dollars de dettes étudiantes. Biden en a annulé une partie par décret ; Trump s'est opposé à l'annulation fédérale comme injuste pour ceux qui n'ont pas fait d'études.`,
        },
        positions: { biden: 3, trump: 1 },
      },
      {
        id: `us_2020_q14`,
        text: {
          en: `Significant police reform is needed to address systemic racism in law enforcement.`,
          fr: `Une réforme importante de la police est nécessaire pour lutter contre le racisme systémique dans les forces de l'ordre.`,
        },
        theme: `SOCIAL`,
        direction: 1,
        info: {
          en: `The killing of George Floyd sparked nationwide protests. Biden backed police reform legislation; Trump ran on a "Law and Order" platform and opposed the "defund the police" movement.`,
          fr: `La mort de George Floyd a déclenché des manifestations nationales. Biden a soutenu une législation de réforme de la police ; Trump a misé sur la "Loi et l'Ordre" et s'est opposé au mouvement "Defund the police".`,
        },
        positions: { biden: 4, trump: 1 },
      },
      {
        id: `us_2020_q15`,
        text: {
          en: `The wealthiest Americans should pay significantly higher income taxes.`,
          fr: `Les Américains les plus riches devraient payer des impôts sur le revenu nettement plus élevés.`,
        },
        theme: `ECONOMY`,
        direction: -1,
        info: {
          en: `Biden proposed raising the top marginal income tax rate from 37% to 39.6% and increasing capital gains taxes. Trump\'s 2017 tax cuts had disproportionately benefited upper-income earners.`,
          fr: `Biden a proposé de relever le taux marginal d'imposition de 37 % à 39,6 % et d'augmenter les taxes sur les plus-values. Les baisses fiscales de Trump en 2017 avaient profité de manière disproportionnée aux hauts revenus.`,
        },
        positions: { biden: 4, trump: 1 },
      },
      {
        id: `us_2020_q16`,
        text: {
          en: `Marijuana should be legalised at the federal level.`,
          fr: `La marijuana devrait être légalisée au niveau fédéral.`,
        },
        theme: `SOCIAL`,
        direction: 1,
        info: {
          en: `Many US states had already legalised marijuana, but it remained illegal federally. Biden supported decriminalisation and expunging prior convictions; Trump maintained the status quo.`,
          fr: `De nombreux États avaient déjà légalisé la marijuana, mais elle restait illégale au niveau fédéral. Biden soutenait la dépénalisation ; Trump maintenait le statu quo.`,
        },
        positions: { biden: 3, trump: 1 },
      },
      {
        id: `us_2020_q17`,
        text: {
          en: `Large technology companies should be more strictly regulated by the federal government.`,
          fr: `Les grandes entreprises technologiques devraient être plus strictement réglementées par le gouvernement fédéral.`,
        },
        theme: `ECONOMY`,
        direction: -1,
        info: {
          en: `Growing concern over the market power of Amazon, Google, Apple, and Facebook led both parties to consider antitrust action, though for different reasons. Democrats focused on privacy and fair competition; Republicans on alleged censorship of conservative voices.`,
          fr: `La préoccupation croissante pour le pouvoir de marché d'Amazon, Google, Apple et Facebook a poussé les deux partis à envisager des mesures antitrust, pour des raisons différentes.`,
        },
        positions: { biden: 3, trump: 3 },
      },
      {
        id: `us_2020_q18`,
        text: {
          en: `The US should significantly invest in rebuilding its infrastructure (roads, bridges, broadband).`,
          fr: `Les États-Unis devraient investir massivement dans la reconstruction de leurs infrastructures (routes, ponts, haut débit).`,
        },
        theme: `PUBLIC_SERVICES`,
        direction: 1,
        info: {
          en: `Infrastructure has been a consistent talking point across administrations. Biden passed the $1.2 trillion Bipartisan Infrastructure Law in 2021. Trump repeatedly promised infrastructure bills during his presidency.`,
          fr: `Les infrastructures ont été un point de discussion constant. Biden a adopté la loi bipartisane de 1 200 milliards de dollars en 2021. Trump avait promis des projets de loi sur les infrastructures pendant sa présidence.`,
        },
        positions: { biden: 5, trump: 3 },
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

  // ── fr_2027 ─────────────────────────────────────────────────────────────
  {
    id: `fr_2027`,
    image: `https://commons.wikimedia.org/wiki/Special:FilePath/Arc_de_Triomphe_de_Paris.jpg?width=1200`,
    title: { en: `French Presidential Election 2027`, fr: `Présidentielle française 2027` },
    country: `France`,
    flag: `🇫🇷`,
    year: 2027,
    description: {
      en: `France will elect a new president in spring 2027. Emmanuel Macron cannot stand again. No candidates are officially declared yet.`,
      fr: `La France élira un nouveau président au printemps 2027. Emmanuel Macron ne peut pas se représenter. Aucun candidat n'est officiellement déclaré à ce stade.`,
    },
    context: {
      en: [
        `France is a republic in western Europe with a directly elected president who holds strong executive power. The president is elected every five years in a two-round system. The 2027 election follows Emmanuel Macron's second and final term.`,
        `Key issues expected to dominate the campaign:\n• Cost of living and purchasing power\n• Immigration and national identity\n• Public services — hospitals, schools, housing\n• Energy: nuclear investment vs. renewable transition\n• France's role in the EU and support for Ukraine`,
        `With Macron unable to stand, the race is unusually open. Several figures are publicly positioning themselves — including Marine Le Pen (RN), Édouard Philippe (Horizons), and Gabriel Attal (Renaissance) on one side, and Raphaël Glucksmann and Marine Tondelier on the left — but no formal candidacy has been announced.\n\n⚠ Candidates shown are based on public signals as of early 2026. No official declarations have been made.`,
      ],
      fr: [
        `La France est une république avec un président élu au suffrage direct disposant d'un fort pouvoir exécutif. Le président est élu tous les cinq ans au scrutin à deux tours. L'élection de 2027 suit le deuxième et dernier mandat d'Emmanuel Macron.`,
        `Les principaux enjeux attendus :\n• Pouvoir d'achat et coût de la vie\n• Immigration et identité nationale\n• Services publics — hôpitaux, écoles, logement\n• Énergie : nucléaire vs. transition renouvelable\n• Rôle de la France dans l'UE et soutien à l'Ukraine`,
        `Macron ne pouvant se représenter, la course est inhabituellement ouverte. Plusieurs personnalités se positionnent publiquement — dont Marine Le Pen (RN), Édouard Philippe (Horizons) et Gabriel Attal (Renaissance) d'un côté, et Raphaël Glucksmann et Marine Tondelier à gauche — mais aucune candidature officielle n'a été annoncée.\n\n⚠ Les candidats présentés sont basés sur des signaux publics début 2026. Aucune déclaration officielle n'a été faite.`,
      ],
    },
    deeperContext: {
      en: [
        `The macroniste centre has weakened after two terms. Its two heirs — Attal (who served as prime minister in 2024) and Philippe (former prime minister 2017–2020) — may split the centrist vote, potentially allowing Le Pen through to a run-off she would be favoured to win.`,
        `Key fault lines:\n• Cost of living and purchasing power — salaries versus prices\n• Immigration and national identity — the dominant issue on the right\n• Climate versus deindustrialisation — can France decarbonise without destroying jobs?\n• European sovereignty — how deep into EU integration should France go?\n• Institutional trust — polls show record-low confidence in politicians`,
      ],
      fr: [
        `Le centre macroniste s'est affaibli après deux mandats. Ses deux héritiers — Attal (Premier ministre en 2024) et Philippe (Premier ministre 2017–2020) — risquent de diviser le vote centriste, permettant potentiellement à Le Pen d'accéder à un second tour qu'elle serait favorisée à remporter.`,
        `Lignes de fracture clés :\n• Coût de la vie et pouvoir d'achat\n• Immigration et identité nationale — sujet dominant à droite\n• Climat versus désindustrialisation\n• Souveraineté européenne\n• Confiance institutionnelle — niveau historiquement bas`,
      ],
    },
    specificQuestions: [
      {
        id: `fr_2027_q1`,
        text: { en: `The retirement age in France should be kept at 64 or lowered.`, fr: `L'âge de la retraite en France devrait être maintenu à 64 ans ou abaissé.` },
        theme: `ECONOMY`, direction: -1,
        info: { en: `The 2023 pension reform raised the retirement age to 64, triggering mass protests. The 2027 election will partly be a verdict on that reform.`, fr: `La réforme des retraites de 2023 a porté l'âge légal à 64 ans, déclenchant des manifestations massives. L'élection 2027 sera en partie un verdict sur cette réforme.` },
        positions: { lepen: 4, philippe: 2, attal: 2, melenchon: 5, glucksmann: 4, tondelier: 5, retailleau: 1 },
      },
      {
        id: `fr_2027_q2`,
        text: { en: `Immigration to France should be drastically reduced.`, fr: `L'immigration vers la France devrait être drastiquement réduite.` },
        theme: `IMMIGRATION`, direction: 1,
        info: { en: `Immigration remains the defining issue for the French right. The far right calls for near-zero immigration; the left argues migration is economically necessary.`, fr: `L'immigration reste le sujet central de la droite française. L'extrême droite réclame une immigration quasi nulle ; la gauche estime que la migration est économiquement nécessaire.` },
        positions: { lepen: 5, philippe: 4, attal: 3, melenchon: 1, glucksmann: 2, tondelier: 1, retailleau: 5 },
      },
      {
        id: `fr_2027_q3`,
        text: { en: `France should invest heavily in nuclear energy for the coming decades.`, fr: `La France devrait investir massivement dans l'énergie nucléaire pour les prochaines décennies.` },
        theme: `ENVIRONMENT`, direction: -1,
        info: { en: `France has the most nuclear-dependent electricity grid in the world. Building new reactors is supported by most of the right and centre; the Greens oppose it.`, fr: `La France a le réseau électrique le plus dépendant du nucléaire au monde. La construction de nouveaux réacteurs est soutenue par la droite et le centre ; les Verts s'y opposent.` },
        positions: { lepen: 5, philippe: 5, attal: 5, melenchon: 2, glucksmann: 3, tondelier: 1, retailleau: 5 },
      },
      {
        id: `fr_2027_q4`,
        text: { en: `France should strengthen its role within the European Union.`, fr: `La France devrait renforcer son rôle au sein de l'Union européenne.` },
        theme: `GLOBAL`, direction: -1,
        info: { en: `EU integration remains a core dividing line. Le Pen and Retailleau advocate national sovereignty; the centre and left are broadly pro-EU.`, fr: `L'intégration européenne reste un clivage central. Le Pen et Retailleau défendent la souveraineté nationale ; le centre et la gauche sont globalement pro-UE.` },
        positions: { lepen: 1, philippe: 4, attal: 5, melenchon: 3, glucksmann: 5, tondelier: 4, retailleau: 2 },
      },
      {
        id: `fr_2027_q5`,
        text: { en: `The state should significantly raise public spending on hospitals and schools.`, fr: `L'État devrait augmenter significativement les dépenses publiques pour les hôpitaux et les écoles.` },
        theme: `PUBLIC_SERVICES`, direction: 1,
        info: { en: `Years of underfunding have left French public services under strain. The left calls for large reinvestment; the centre-right prioritises fiscal balance.`, fr: `Des années de sous-financement ont fragilisé les services publics français. La gauche appelle à un grand réinvestissement ; le centre-droit privilégie l'équilibre budgétaire.` },
        positions: { lepen: 3, philippe: 2, attal: 3, melenchon: 5, glucksmann: 5, tondelier: 5, retailleau: 1 },
      },
      {
        id: `fr_2027_q6`,
        text: { en: `France should take stronger measures to protect the climate, even if they raise costs for households.`, fr: `La France devrait prendre des mesures plus fortes pour protéger le climat, même si cela augmente les coûts pour les ménages.` },
        theme: `ENVIRONMENT`, direction: 1,
        info: { en: `Climate ambition versus cost of living is a core tension. The Greens and radical left push for urgency; the right argues ecological transition must not hurt workers.`, fr: `L'ambition climatique contre le coût de la vie est une tension centrale. Les Verts et la gauche radicale poussent à l'urgence ; la droite estime que la transition ne doit pas pénaliser les travailleurs.` },
        positions: { lepen: 1, philippe: 3, attal: 3, melenchon: 4, glucksmann: 4, tondelier: 5, retailleau: 2 },
      },
      {
        id: `fr_2027_q7`,
        text: { en: `Police and security forces should be given more resources and powers.`, fr: `Les forces de police et de sécurité devraient recevoir plus de moyens et de pouvoirs.` },
        theme: `SECURITY`, direction: 1,
        info: { en: `Law and order is a key concern for French voters. The right calls for more policing and tougher sentences; the left emphasises civil liberties and root causes of crime.`, fr: `La sécurité est une préoccupation clé des électeurs français. La droite réclame plus de police et des peines plus sévères ; la gauche met l'accent sur les libertés civiles.` },
        positions: { lepen: 5, philippe: 4, attal: 4, melenchon: 1, glucksmann: 2, tondelier: 1, retailleau: 5 },
      },
      {
        id: `fr_2027_q8`,
        text: { en: `Corporate taxes in France should be lowered to attract investment.`, fr: `Les impôts sur les sociétés en France devraient être abaissés pour attirer les investissements.` },
        theme: `ECONOMY`, direction: 1,
        info: { en: `France has reduced corporate tax rates since 2017. The right wants to go further; the left wants to raise them back to fund public services.`, fr: `La France a réduit les taux d'imposition des sociétés depuis 2017. La droite veut aller plus loin ; la gauche veut les relever pour financer les services publics.` },
        positions: { lepen: 3, philippe: 4, attal: 4, melenchon: 1, glucksmann: 2, tondelier: 1, retailleau: 5 },
      },
      {
        id: `fr_2027_q9`,
        text: { en: `France should support Ukraine militarily for as long as necessary.`, fr: `La France devrait soutenir militairement l'Ukraine aussi longtemps que nécessaire.` },
        theme: `GLOBAL`, direction: -1,
        info: { en: `The war in Ukraine has divided French politics. Macron strongly backed Ukraine; Le Pen and Mélenchon have been more ambiguous about their support.`, fr: `La guerre en Ukraine a divisé la politique française. Macron a fermement soutenu l'Ukraine ; Le Pen et Mélenchon ont été plus ambigus.` },
        positions: { lepen: 2, philippe: 5, attal: 5, melenchon: 2, glucksmann: 5, tondelier: 4, retailleau: 4 },
      },
      {
        id: `fr_2027_q10`,
        text: { en: `France should introduce stricter rules on religion in public spaces.`, fr: `La France devrait introduire des règles plus strictes sur la religion dans les espaces publics.` },
        theme: `SOCIAL`, direction: -1,
        info: { en: `France's laïcité principle restricts religious expression in public institutions. Debates focus on Islamic dress, halal food in schools, and religious communities.`, fr: `Le principe de laïcité restreint l'expression religieuse dans les institutions publiques. Les débats portent sur le voile islamique, les repas halal à l'école et les communautés religieuses.` },
        positions: { lepen: 5, philippe: 4, attal: 3, melenchon: 3, glucksmann: 3, tondelier: 2, retailleau: 5 },
      },
      {
        id: `fr_2027_q11`,
        text: { en: `The minimum wage should be raised significantly above inflation.`, fr: `Le salaire minimum devrait être augmenté significativement au-dessus de l'inflation.` },
        theme: `ECONOMY`, direction: -1,
        info: { en: `Purchasing power is the top concern for French voters. The left calls for large SMIC increases; the right warns of job losses if labour costs rise too fast.`, fr: `Le pouvoir d'achat est la première préoccupation des électeurs français. La gauche réclame de fortes hausses du SMIC ; la droite met en garde contre les pertes d'emplois.` },
        positions: { lepen: 4, philippe: 2, attal: 2, melenchon: 5, glucksmann: 4, tondelier: 5, retailleau: 1 },
      },
      {
        id: `fr_2027_q12`,
        text: { en: `France should introduce strict rent controls in major cities.`, fr: `La France devrait introduire un contrôle strict des loyers dans les grandes villes.` },
        theme: `PUBLIC_SERVICES`, direction: 1,
        info: { en: `Housing costs have surged in French cities. Paris tried rent controls from 2015; the left wants stronger national rent control. The right argues controls reduce housing supply.`, fr: `Les coûts du logement ont explosé dans les villes françaises. Paris a expérimenté l'encadrement des loyers depuis 2015 ; la gauche veut un contrôle national plus fort. La droite estime que les contrôles réduisent l'offre.` },
        positions: { lepen: 3, philippe: 2, attal: 2, melenchon: 5, glucksmann: 4, tondelier: 5, retailleau: 1 },
      },
      {
        id: `fr_2027_q13`,
        text: { en: `University tuition should be free for all students in France.`, fr: `Les frais universitaires devraient être gratuits pour tous les étudiants en France.` },
        theme: `PUBLIC_SERVICES`, direction: 1,
        info: { en: `French public universities already charge very low fees. The radical left wants full fee abolition; the right wants to introduce more differentiated pricing for better university funding.`, fr: `Les universités publiques françaises facturent déjà des frais très bas. La gauche radicale veut leur suppression complète ; la droite veut une tarification différenciée pour mieux financer les universités.` },
        positions: { lepen: 3, philippe: 2, attal: 2, melenchon: 5, glucksmann: 4, tondelier: 5, retailleau: 1 },
      },
      {
        id: `fr_2027_q14`,
        text: { en: `France should set a strict timetable to eliminate fossil fuels from its energy mix by 2040.`, fr: `La France devrait fixer un calendrier strict pour éliminer les énergies fossiles de son mix énergétique d'ici 2040.` },
        theme: `ENVIRONMENT`, direction: 1,
        info: { en: `France imports most of its gas and oil. Phasing out fossil fuels would require massive renewable expansion and industrial transformation, with major economic implications for workers in affected sectors.`, fr: `La France importe la majeure partie de son gaz et de son pétrole. Éliminer les fossiles nécessiterait une expansion massive des renouvelables et une transformation industrielle.` },
        positions: { lepen: 1, philippe: 2, attal: 3, melenchon: 4, glucksmann: 4, tondelier: 5, retailleau: 2 },
      },
      {
        id: `fr_2027_q15`,
        text: { en: `Citizens should be able to initiate referendums on major policy decisions.`, fr: `Les citoyens devraient pouvoir initier des référendums sur les grandes décisions politiques.` },
        theme: `DEMOCRACY`, direction: 1,
        info: { en: `Citizen-initiated referendums (RIC) were a key demand of the Yellow Vest movement. The left and populist right broadly support them; mainstream parties have resisted.`, fr: `Les référendums d'initiative citoyenne (RIC) étaient une demande clé du mouvement des Gilets jaunes. La gauche et la droite populiste les soutiennent globalement ; les partis mainstream y résistent.` },
        positions: { lepen: 4, philippe: 2, attal: 2, melenchon: 5, glucksmann: 3, tondelier: 5, retailleau: 3 },
      },
      {
        id: `fr_2027_q16`,
        text: { en: `France should expand its nuclear deterrent and maintain full strategic autonomy.`, fr: `La France devrait étendre sa dissuasion nucléaire et maintenir une pleine autonomie stratégique.` },
        theme: `SECURITY`, direction: 1,
        info: { en: `France is the only EU member state with nuclear weapons. All mainstream parties defend the deterrent, but disagree on whether to share it with European partners or keep it exclusively French.`, fr: `La France est le seul État membre de l'UE à posséder des armes nucléaires. Tous les partis défendent la dissuasion, mais divergent sur son partage éventuel avec des partenaires européens.` },
        positions: { lepen: 5, philippe: 4, attal: 4, melenchon: 2, glucksmann: 4, tondelier: 2, retailleau: 5 },
      },
      {
        id: `fr_2027_q17`,
        text: { en: `Large digital companies should pay much higher taxes in France.`, fr: `Les grandes entreprises numériques devraient payer des impôts beaucoup plus élevés en France.` },
        theme: `ECONOMY`, direction: -1,
        info: { en: `France introduced a digital services tax in 2019 targeting companies like Google and Amazon. The debate is whether to go further nationally or push for an EU-wide digital tax.`, fr: `La France a introduit une taxe sur les services numériques en 2019 ciblant des entreprises comme Google et Amazon. Le débat porte sur la possibilité d'aller plus loin nationalement ou de pousser pour une taxe numérique européenne.` },
        positions: { lepen: 4, philippe: 3, attal: 3, melenchon: 5, glucksmann: 4, tondelier: 5, retailleau: 2 },
      },
    ],
    candidates: [
      {
        id: `lepen_2027`,
        image: `/images/candidates/lepen.svg`,
        name: `Marine Le Pen`,
        party: { en: `Rassemblement National`, fr: `Rassemblement National` },
        color: `#003189`,
        result: { en: `Projected candidate`, fr: `Candidate pressentie` },
        profile: { ECONOMY: 42, SOCIAL: 12, IMMIGRATION: 95, SECURITY: 88, ENVIRONMENT: 25, DEMOCRACY: 40, GLOBAL: 85, PUBLIC_SERVICES: 55 },
        description: { en: `Far-right nationalist. Very anti-immigration, socially conservative, economically statist on purchasing power.`, fr: `Nationaliste d'extrême droite. Très anti-immigration, conservatrice socialement, statiste sur le pouvoir d'achat.` },
      },
      {
        id: `philippe`,
        image: `/images/candidates/philippe.svg`,
        name: `Édouard Philippe`,
        party: { en: `Horizons`, fr: `Horizons` },
        color: `#1a3d7c`,
        result: { en: `Projected candidate`, fr: `Candidat pressenti` },
        profile: { ECONOMY: 68, SOCIAL: 58, IMMIGRATION: 48, SECURITY: 62, ENVIRONMENT: 55, DEMOCRACY: 78, GLOBAL: 28, PUBLIC_SERVICES: 45 },
        description: { en: `Centre-right liberal. Pro-EU, fiscally conservative, moderate on immigration, pragmatic reformer.`, fr: `Libéral de centre-droit. Pro-UE, conservateur sur les finances publiques, modéré sur l'immigration, réformiste pragmatique.` },
      },
      {
        id: `attal`,
        image: `/images/candidates/attal.svg`,
        name: `Gabriel Attal`,
        party: { en: `Renaissance`, fr: `Renaissance` },
        color: `#a08500`,
        result: { en: `Projected candidate`, fr: `Candidat pressenti` },
        profile: { ECONOMY: 65, SOCIAL: 65, IMMIGRATION: 45, SECURITY: 60, ENVIRONMENT: 58, DEMOCRACY: 80, GLOBAL: 25, PUBLIC_SERVICES: 48 },
        description: { en: `Centrist liberal. Macron's political heir, pro-EU, socially progressive, economically liberal.`, fr: `Libéral centriste. Héritier politique de Macron, pro-UE, progressiste socialement, libéral économiquement.` },
      },
      {
        id: `melenchon_2027`,
        image: `/images/candidates/melenchon.svg`,
        name: `Jean-Luc Mélenchon`,
        party: { en: `La France Insoumise`, fr: `La France Insoumise` },
        color: `#CC0000`,
        result: { en: `Projected candidate`, fr: `Candidat pressenti` },
        profile: { ECONOMY: 12, SOCIAL: 88, IMMIGRATION: 12, SECURITY: 24, ENVIRONMENT: 82, DEMOCRACY: 62, GLOBAL: 45, PUBLIC_SERVICES: 90 },
        description: { en: `Radical left. Maximum welfare state, very pro-immigration, environmentalist, sovereignist left.`, fr: `Gauche radicale. État social maximal, très pro-immigration, écologiste, souverainisme de gauche.` },
      },
      {
        id: `glucksmann`,
        image: `/images/candidates/glucksmann.svg`,
        name: `Raphaël Glucksmann`,
        party: { en: `Parti Socialiste / Place Publique`, fr: `Parti Socialiste / Place Publique` },
        color: `#E75480`,
        result: { en: `Projected candidate`, fr: `Candidat pressenti` },
        profile: { ECONOMY: 28, SOCIAL: 82, IMMIGRATION: 18, SECURITY: 38, ENVIRONMENT: 72, DEMOCRACY: 85, GLOBAL: 22, PUBLIC_SERVICES: 78 },
        description: { en: `Social democrat. Pro-EU, strong social protection, progressive, firm supporter of Ukraine.`, fr: `Social-démocrate. Pro-UE, forte protection sociale, progressiste, ferme soutien de l'Ukraine.` },
      },
      {
        id: `tondelier`,
        image: `/images/candidates/tondelier.svg`,
        name: `Marine Tondelier`,
        party: { en: `Les Écologistes (EELV)`, fr: `Les Écologistes (EELV)` },
        color: `#00A550`,
        result: { en: `Projected candidate`, fr: `Candidate pressentie` },
        profile: { ECONOMY: 22, SOCIAL: 88, IMMIGRATION: 15, SECURITY: 28, ENVIRONMENT: 94, DEMOCRACY: 85, GLOBAL: 20, PUBLIC_SERVICES: 72 },
        description: { en: `Green ecologist. Strong climate action, pro-immigration, very progressive, anti-nuclear.`, fr: `Écologiste verte. Action climatique forte, pro-immigration, très progressiste, antinucléaire.` },
      },
      {
        id: `retailleau`,
        image: `/images/candidates/retailleau.svg`,
        name: `Bruno Retailleau`,
        party: { en: `Les Républicains`, fr: `Les Républicains` },
        color: `#0066CC`,
        result: { en: `Projected candidate`, fr: `Candidat pressenti` },
        profile: { ECONOMY: 72, SOCIAL: 28, IMMIGRATION: 78, SECURITY: 80, ENVIRONMENT: 42, DEMOCRACY: 68, GLOBAL: 52, PUBLIC_SERVICES: 38 },
        description: { en: `Conservative right. Tough on immigration, economically liberal, traditional social values.`, fr: `Droite conservatrice. Ferme sur l'immigration, libéral économiquement, valeurs sociales traditionnelles.` },
      },
    ],
  },

  // ── paris_2026 ───────────────────────────────────────────────────────────
  {
    id: `paris_2026`,
    image: `https://commons.wikimedia.org/wiki/Special:FilePath/Sacre_Coeur_3.jpg?width=1200`,
    title: { en: `Paris Municipal Election 2026`, fr: `Municipales Paris 2026` },
    country: `France`,
    flag: `🇫🇷`,
    year: 2026,
    description: {
      en: `Paris held its municipal election in March 2026 with a renewed field. Anne Hidalgo announced in November 2024 that she would not seek a third term. Emmanuel Grégoire (PS) ran as head of a unified left coalition (PS, EELV, PCF), Rachida Dati (LR) led the right-wing opposition, and Sophia Chikirou carried the LFI banner.`,
      fr: `Paris a tenu ses élections municipales en mars 2026 avec un renouvellement du champ politique. Anne Hidalgo a annoncé en novembre 2024 qu'elle ne briguerait pas un troisième mandat. Emmanuel Grégoire (PS) a conduit une liste d'union de la gauche (PS, EELV, PCF), Rachida Dati (LR) a porté l'opposition de droite, et Sophia Chikirou a représenté LFI.`,
    },
    context: {
      en: [
        `Paris is France's capital, with 2.1 million residents and around 12 million in the greater region. The mayor is elected by city councillors following proportional municipal elections across all 20 arrondissements. Paris has been governed by the left since 1995 — first by Bertrand Delanoë (PS, 2001–2014), then by Anne Hidalgo (PS, 2014–2026).`,
        `Key issues for 2026:\n• Public cleanliness — consistently the top complaint of Parisians, used heavily against the outgoing majority\n• Social housing — waitlists exceed 10 years; the Grégoire list pledges 30,000 new units\n• Cycling network revision — outer arrondissements demand a review of lanes that removed parking\n• Airbnb and short-term rentals — 80,000+ listings reducing housing stock\n• Municipal police — the right calls for a larger, better-equipped force\n• Post-Olympics budget legacy — the 2024 Games left a significant municipal debt`,
        `Emmanuel Grégoire (PS) served as First Deputy Mayor under Hidalgo and is positioned as the continuity candidate, pledging improvements on cleanliness and housing. Rachida Dati (LR) campaigns on security, business competitiveness, and reversing car restrictions. Sophia Chikirou (LFI) focuses on housing rights and social inequality. Pierre-Yves Bournazel (Horizons) is also a declared candidate on a centrist platform.`,
      ],
      fr: [
        `Paris est la capitale de la France, avec 2,1 millions d'habitants et environ 12 millions dans la région. Le maire est élu par les conseillers municipaux à l'issue d'élections proportionnelles dans les 20 arrondissements. Paris est gouvernée par la gauche depuis 1995 — d'abord Bertrand Delanoë (PS, 2001–2014), puis Anne Hidalgo (PS, 2014–2026).`,
        `Enjeux clés pour 2026 :\n• Propreté — première préoccupation des Parisiens, utilisée comme argument central contre la majorité sortante\n• Logement social — listes d'attente supérieures à 10 ans ; la liste Grégoire promet 30 000 nouveaux logements\n• Révision du réseau cyclable — les arrondissements périphériques réclament une révision des pistes ayant supprimé des places de stationnement\n• Airbnb et locations courte durée — 80 000+ annonces réduisant l'offre de logements\n• Police municipale — la droite réclame un corps plus nombreux et mieux équipé\n• Héritage budgétaire post-JO 2024 — les Jeux ont laissé une dette municipale significative`,
        `Emmanuel Grégoire (PS) était premier adjoint d'Hidalgo. Il incarne la continuité tout en proposant des améliorations sur la propreté et le logement. Rachida Dati (LR) axe sa campagne sur la sécurité, la compétitivité économique et l'assouplissement des restrictions de circulation. Sophia Chikirou (LFI) met en avant le droit au logement et les inégalités. Pierre-Yves Bournazel (Horizons) est également candidat déclaré sur une plateforme centriste.`,
      ],
    },
    deeperContext: {
      en: [
        `Paris politics mirror national divides but with local specificities. The city has voted left at every municipal election since 1995. Hidalgo's two terms were defined by a cycling and climate agenda that proved divisive: popular in the inner arrondissements, resisted in the outer ones where car dependency is higher.`,
        `Key structural debates:\n• Car restrictions vs. economic access — Paris has removed roughly 60,000 parking spaces since 2014\n• Housing tenure — over half of Paris households are renters; rent control and Airbnb regulation are central\n• Municipal budget — the city's debt increased significantly during the Olympic infrastructure period\n• Public order — drug markets in Stalingrad, Gare du Nord, and several parks have become campaign flashpoints\n• Gentrification — rising costs are pushing lower-income residents to outer arrondissements and the suburbs`,
      ],
      fr: [
        `La politique parisienne reflète les clivages nationaux avec des spécificités locales. La ville vote à gauche à chaque municipale depuis 1995. Les deux mandats d'Hidalgo ont été définis par un agenda vélo et climatique clivant : populaire dans les arrondissements centraux, contesté en périphérie où la dépendance à la voiture est plus forte.`,
        `Débats structurels :\n• Restrictions voiture vs. accès économique — Paris a supprimé environ 60 000 places de stationnement depuis 2014\n• Statut résidentiel — plus de la moitié des ménages parisiens sont locataires ; encadrement des loyers et Airbnb sont centraux\n• Budget municipal — la dette de la ville a augmenté significativement pendant la période olympique\n• Ordre public — marchés de drogues à Stalingrad, Gare du Nord et plusieurs parcs sont devenus des points chauds de campagne\n• Gentrification — la hausse des coûts repousse les ménages modestes vers les arrondissements périphériques et la banlieue`,
      ],
    },
    specificQuestions: [
      {
        id: `paris_2026_q1`,
        text: { en: `More streets in Paris should be made car-free or significantly restricted for private vehicles.`, fr: `Davantage de rues parisiennes devraient être interdites ou très restreintes aux voitures particulières.` },
        theme: `ENVIRONMENT`, direction: 1,
        info: { en: `Hidalgo's majority removed roughly 60,000 parking spaces and created extensive cycling lanes. Outer arrondissements are particularly opposed. Dati promised to reopen some lanes and restore parking; Grégoire pledged to maintain the gains while improving maintenance.`, fr: `La majorité Hidalgo a supprimé environ 60 000 places de stationnement et créé de nombreuses pistes cyclables. Les arrondissements périphériques y sont particulièrement opposés. Dati a promis de rouvrir certaines voies ; Grégoire s'est engagé à maintenir les acquis tout en améliorant l'entretien.` },
        positions: { gregoire_paris: 4, dati: 1, chikirou_paris: 4 },
      },
      {
        id: `paris_2026_q2`,
        text: { en: `The city should dramatically increase construction of social housing, including on public land.`, fr: `La ville devrait fortement augmenter la construction de logements sociaux, y compris sur des terrains publics.` },
        theme: `PUBLIC_SERVICES`, direction: 1,
        info: { en: `Social housing waitlists in Paris exceed 10 years. Grégoire pledged 30,000 new social housing units. Chikirou called for requisitioning vacant properties. Dati favoured incentivising private construction over expanding the public stock.`, fr: `Les listes d'attente de logements sociaux à Paris dépassent 10 ans. Grégoire a promis 30 000 nouveaux logements sociaux. Chikirou a appelé à la réquisition de logements vacants. Dati a privilégié les incitations au secteur privé plutôt qu'à l'extension du parc public.` },
        positions: { gregoire_paris: 4, dati: 2, chikirou_paris: 5 },
      },
      {
        id: `paris_2026_q3`,
        text: { en: `Paris should significantly expand its municipal police force to tackle disorder in public spaces.`, fr: `Paris devrait significativement agrandir sa police municipale pour lutter contre les désordres dans les espaces publics.` },
        theme: `SECURITY`, direction: 1,
        info: { en: `Paris has a relatively small municipal police compared to other major French cities. Dati called for tripling its size and granting it more powers. Grégoire favoured incremental growth; Chikirou opposed expanding a force she said would disproportionately target minority communities.`, fr: `Paris a une police municipale relativement réduite par rapport à d'autres grandes villes françaises. Dati a demandé son triplement. Grégoire a favorisé une croissance progressive ; Chikirou s'y est opposée, estimant qu'elle ciblerait de manière disproportionnée les minorités.` },
        positions: { gregoire_paris: 3, dati: 5, chikirou_paris: 1 },
      },
      {
        id: `paris_2026_q4`,
        text: { en: `Paris should impose strict caps and reduced quotas on short-term tourist rentals like Airbnb.`, fr: `Paris devrait imposer des plafonds stricts et des quotas réduits sur les locations touristiques de courte durée comme Airbnb.` },
        theme: `SOCIAL`, direction: 1,
        info: { en: `Paris has over 80,000 short-term rental listings, which reduce long-term housing supply. The city has already capped listings at 120 nights per year per primary residence, but enforcement is limited and the cap does not apply to secondary residences.`, fr: `Paris compte plus de 80 000 annonces de location courte durée, qui réduisent l'offre de logements longue durée. La ville a déjà plafonné les annonces à 120 nuits par an pour la résidence principale, mais l'application est limitée et le plafond ne s'applique pas aux résidences secondaires.` },
        positions: { gregoire_paris: 4, dati: 2, chikirou_paris: 5 },
      },
      {
        id: `paris_2026_q5`,
        text: { en: `The city should invest more in cleaning public spaces, even if it means raising local taxes.`, fr: `La ville devrait investir davantage dans la propreté des espaces publics, même si cela implique d'augmenter les impôts locaux.` },
        theme: `PUBLIC_SERVICES`, direction: 1,
        info: { en: `Cleanliness has ranked as Parisians' top grievance in surveys for a decade. All major candidates pledged more resources, but differed on financing: Dati promised savings through private contracts; Grégoire and Chikirou proposed budget reallocation.`, fr: `La propreté est depuis dix ans la première doléance des Parisiens dans les sondages. Tous les grands candidats ont promis plus de moyens, mais divergent sur le financement : Dati a proposé des économies via des contrats privés ; Grégoire et Chikirou ont opté pour une réallocation budgétaire.` },
        positions: { gregoire_paris: 4, dati: 4, chikirou_paris: 4 },
      },
      {
        id: `paris_2026_q6`,
        text: { en: `The city should prioritise reducing municipal debt over new public spending commitments.`, fr: `La ville devrait prioriser la réduction de la dette municipale plutôt que de nouveaux engagements de dépenses publiques.` },
        theme: `ECONOMY`, direction: -1,
        info: { en: `Paris's municipal debt grew significantly during the 2024 Olympics preparation period. Dati made fiscal responsibility central to her platform. Grégoire defended the investment as necessary; Chikirou argued for taxing large businesses and vacant properties instead.`, fr: `La dette municipale de Paris a significativement augmenté pendant la période de préparation des JO 2024. Dati a fait de la responsabilité budgétaire le cœur de son programme. Grégoire a défendu cet investissement comme nécessaire ; Chikirou a préconisé une fiscalité sur les grandes entreprises et les logements vacants.` },
        positions: { gregoire_paris: 2, dati: 4, chikirou_paris: 1 },
      },
      {
        id: `paris_2026_q7`,
        text: { en: `Paris should revise its cycling network, including restoring some parking spaces in outer arrondissements.`, fr: `Paris devrait réviser son réseau cyclable, notamment en rétablissant des places de stationnement dans les arrondissements périphériques.` },
        theme: `ENVIRONMENT`, direction: -1,
        info: { en: `The rapid expansion of cycling lanes under Hidalgo generated backlash in the 13th, 14th, 15th and 16th arrondissements, where businesses reported lost customers and residents lost access. The debate is about recalibrating rather than reversing the cycling agenda.`, fr: `L'extension rapide des pistes cyclables sous Hidalgo a suscité un retour de bâton dans les 13e, 14e, 15e et 16e arrondissements. Le débat porte sur un recalibrage plutôt qu'un retour en arrière.` },
        positions: { gregoire_paris: 3, dati: 5, chikirou_paris: 2 },
      },
      {
        id: `paris_2026_q8`,
        text: { en: `Paris should use its zoning powers to prevent further gentrification and protect working-class neighbourhoods.`, fr: `Paris devrait utiliser ses leviers d'urbanisme pour freiner la gentrification et protéger les quartiers populaires.` },
        theme: `SOCIAL`, direction: 1,
        info: { en: `Several traditionally working-class arrondissements (10th, 11th, 18th, 19th, 20th) have seen sharp rent increases. Chikirou made anti-gentrification a flagship issue. Grégoire supported social housing targets; Dati argued that restrictions on construction made the problem worse.`, fr: `Plusieurs arrondissements traditionnellement populaires (10e, 11e, 18e, 19e, 20e) ont connu de fortes hausses de loyers. Chikirou a fait de l'anti-gentrification un axe central. Grégoire a soutenu des objectifs de logement social ; Dati a estimé que les restrictions à la construction aggravaient le problème.` },
        positions: { gregoire_paris: 3, dati: 1, chikirou_paris: 5 },
      },
    ],
    candidates: [
      {
        id: `gregoire_paris`,
        image: `/images/candidates/gregoire.svg`,
        name: `Emmanuel Grégoire`,
        party: { en: `PS + EELV + PCF (Union de la Gauche)`, fr: `PS + EELV + PCF (Union de la Gauche)` },
        color: `#E75480`,
        result: { en: `Head of the PS+EELV+PCF coalition list`, fr: `Tête de liste PS+EELV+PCF` },
        profile: { ECONOMY: 28, SOCIAL: 82, IMMIGRATION: 22, SECURITY: 40, ENVIRONMENT: 70, DEMOCRACY: 80, GLOBAL: 22, PUBLIC_SERVICES: 80 },
        description: { en: `First Deputy Mayor under Hidalgo 2014–2026. Leads a unified PS+Greens+PCF list. Pledges 30,000 new social housing units, maintains the cycling agenda, and promises improvements on cleanliness.`, fr: `Premier adjoint d'Hidalgo de 2014 à 2026. Conduit une liste d'union PS+Verts+PCF. Promet 30 000 nouveaux logements sociaux, maintient l'agenda vélo et s'engage sur la propreté.` },
      },
      {
        id: `dati`,
        image: `/images/candidates/dati.svg`,
        name: `Rachida Dati`,
        party: { en: `Les Républicains`, fr: `Les Républicains` },
        color: `#0066CC`,
        result: { en: `LR candidate, Mayor of the 7th arrondissement since 2008`, fr: `Candidate LR, maire du 7e arrondissement depuis 2008` },
        profile: { ECONOMY: 65, SOCIAL: 38, IMMIGRATION: 62, SECURITY: 78, ENVIRONMENT: 38, DEMOCRACY: 70, GLOBAL: 40, PUBLIC_SERVICES: 40 },
        description: { en: `Mayor of the 7th arrondissement since 2008, former Justice Minister. Conservative platform: expand the municipal police, restore parking, reduce municipal debt, revise car restrictions.`, fr: `Maire du 7e arrondissement depuis 2008, ancienne ministre de la Justice. Programme conservateur : développer la police municipale, rétablir des places de stationnement, réduire la dette, réviser les restrictions de circulation.` },
      },
      {
        id: `chikirou_paris`,
        image: `/images/candidates/chikirou.svg`,
        name: `Sophia Chikirou`,
        party: { en: `La France Insoumise`, fr: `La France Insoumise` },
        color: `#CC2200`,
        result: { en: `LFI candidate`, fr: `Candidate LFI` },
        profile: { ECONOMY: 15, SOCIAL: 92, IMMIGRATION: 12, SECURITY: 20, ENVIRONMENT: 78, DEMOCRACY: 88, GLOBAL: 18, PUBLIC_SERVICES: 90 },
        description: { en: `LFI campaign director and close Mélenchon ally. Platform centred on housing rights, requisitioning vacant properties, anti-gentrification, and expanding free public services.`, fr: `Directrice de campagne de LFI et proche de Mélenchon. Programme centré sur le droit au logement, la réquisition des logements vacants, l'anti-gentrification et l'expansion des services publics gratuits.` },
      },
    ],
  },

  // ── stras_2026 ───────────────────────────────────────────────────────────
  {
    id: `stras_2026`,
    image: `https://commons.wikimedia.org/wiki/Special:FilePath/Strasbourg_-_Petite_France.jpg?width=1200`,
    title: { en: `Strasbourg Municipal Election 2026`, fr: `Municipales Strasbourg 2026` },
    country: `France`,
    flag: `🇫🇷`,
    year: 2026,
    description: {
      en: `Strasbourg held its municipal election in March 2026. Incumbent mayor Jeanne Barseghian (EELV), elected in 2020, sought a second term. The election featured a competitive field: Catherine Trautmann (PS), Jean-Philippe Vetter (LR/UDI), Barseghian (EELV), and Florian Kobryn (LFI).`,
      fr: `Strasbourg a tenu ses élections municipales en mars 2026. La maire sortante Jeanne Barseghian (EELV), élue en 2020, briguait un second mandat. L'élection a vu s'affronter Catherine Trautmann (PS), Jean-Philippe Vetter (LR/UDI), Barseghian (EELV) et Florian Kobryn (LFI).`,
    },
    context: {
      en: [
        `Strasbourg is the capital of Alsace and the seat of the European Parliament and the Council of Europe. With around 290,000 inhabitants, it is France's seventh largest city and has a distinctive bilingual character shaped by its French-German history.\n\nPolitical history: from 1959 to 1989, Strasbourg was governed by the centre-right (Pflimlin, Münch, Spielmann — roughly 30 years of right-wing rule). Catherine Trautmann (PS) then held the mayoralty from 1989 to 2001 (12 years). Fabienne Keller (UMP) won in 2001 and served until 2008 (7 years). Roland Ries (PS) governed from 2008 to 2020 (12 years), followed by Jeanne Barseghian (EELV) from 2020.`,
        `Key issues for 2026:\n• Urban mobility — the tram network extension and the balance between cycling and parking\n• Housing — rising rents driven by 60,000 students and EU institutions; long social housing waitlists\n• Rhine crossing — a new bridge or tunnel linking Strasbourg to Kehl remains a contested infrastructure project\n• European capital status — preserving the European Parliament against Brussels lobbying\n• Security and social inequality — the Neuhof and Hautepierre districts face persistent difficulties\n• Municipal debt — Barseghian's mandate was criticised by the right for rising borrowing`,
        `Catherine Trautmann (PS), former mayor (1989–2001) and MEP, re-entered local politics with a centre-left platform. Jean-Philippe Vetter (LR/UDI) leads the main right-of-centre list on a platform of public order and economic competitiveness. Barseghian defends her ecological record seeking a second term. Florian Kobryn heads the LFI list.`,
      ],
      fr: [
        `Strasbourg est la capitale de l'Alsace et le siège du Parlement européen et du Conseil de l'Europe. Avec environ 290 000 habitants, c'est la septième ville de France, marquée par une double culture franco-allemande.\n\nHistoire politique : de 1959 à 1989, Strasbourg a été gouvernée par la droite (Pflimlin, Münch, Spielmann — environ 30 ans). Catherine Trautmann (PS) a ensuite occupé la mairie de 1989 à 2001 (12 ans). Fabienne Keller (UMP) a gagné en 2001 et gouverné jusqu'en 2008 (7 ans). Roland Ries (PS) a dirigé la ville de 2008 à 2020 (12 ans), suivi de Jeanne Barseghian (EELV) depuis 2020.`,
        `Enjeux clés pour 2026 :\n• Mobilité urbaine — extension du réseau de trams et équilibre entre cyclistes et automobilistes\n• Logement — hausse des loyers portée par 60 000 étudiants et les institutions européennes ; longues listes d'attente de logements sociaux\n• Traversée du Rhin — un nouveau pont ou tunnel entre Strasbourg et Kehl reste un projet d'infrastructure contesté\n• Statut de capitale européenne — préserver le Parlement européen face aux pressions en faveur de Bruxelles\n• Sécurité et inégalités sociales — les quartiers Neuhof et Hautepierre connaissent des difficultés persistantes\n• Dette municipale — le mandat Barseghian a été critiqué par la droite pour la hausse de l'endettement`,
        `Catherine Trautmann (PS), ancienne maire (1989–2001) et eurodéputée, est revenue en politique locale avec un programme centre-gauche. Jean-Philippe Vetter (LR/UDI) conduit la principale liste de droite sur un programme d'ordre public et de compétitivité économique. Barseghian défend son bilan écologique pour un second mandat. Florian Kobryn conduit la liste LFI.`,
      ],
    },
    deeperContext: {
      en: [
        `Strasbourg's political geography is distinctive in France. As a permanent seat of EU institutions, European affairs have concrete local weight — MEPs, Council of Europe staff, and lobbyists shape the rental market and the city's economic base. The Grande Île (historic island centre) is a UNESCO World Heritage site, making urban planning decisions unusually constrained.`,
        `Key structural debates:\n• Tram nord extension — a northern extension of the tram network is planned but contested on cost grounds\n• Cycling vs. parking — Barseghian's mandate significantly reduced city-centre parking; the right seeks partial reversal\n• Cross-Rhine cooperation — over 30,000 people commute daily between Strasbourg and Kehl (Germany); a new Rhine crossing is debated\n• University housing shortage — Strasbourg's 60,000 students face an acute shortage of affordable accommodation\n• European Parliament — a recurring diplomatic battle over whether all EU plenary sessions should move to Brussels permanently`,
      ],
      fr: [
        `La géographie politique de Strasbourg est distinctive en France. En tant que siège permanent d'institutions européennes, les affaires européennes ont un poids local concret — les eurodéputés, le personnel du Conseil de l'Europe et les lobbyistes influencent le marché locatif et l'économie de la ville. La Grande Île est inscrite au patrimoine mondial de l'UNESCO, ce qui rend les décisions d'urbanisme particulièrement contraintes.`,
        `Débats structurels clés :\n• Extension du tram nord — une extension nord du réseau est prévue mais contestée pour son coût\n• Vélo vs. stationnement — le mandat Barseghian a fortement réduit les places de parking en centre-ville ; la droite cherche un recul partiel\n• Coopération transfrontalière — plus de 30 000 personnes font la navette quotidiennement entre Strasbourg et Kehl ; un nouveau franchissement du Rhin est débattu\n• Crise du logement étudiant — les 60 000 étudiants de Strasbourg font face à une pénurie aiguë de logements abordables\n• Parlement européen — une bataille diplomatique récurrente sur le transfert permanent de toutes les séances plénières à Bruxelles`,
      ],
    },
    specificQuestions: [
      {
        id: `stras_2026_q1`,
        text: { en: `Strasbourg should continue to restrict car access and expand cycling infrastructure in the city centre.`, fr: `Strasbourg devrait poursuivre la restriction de l'accès automobile et développer les infrastructures cyclables en centre-ville.` },
        theme: `ENVIRONMENT`, direction: 1,
        info: { en: `Strasbourg is already one of France's most cycling-friendly cities. Barseghian further reduced city-centre parking during her mandate. Vetter and Trautmann both called for a more balanced approach, restoring some parking and slowing the pace of restrictions.`, fr: `Strasbourg est déjà l'une des villes les plus cyclables de France. Barseghian a encore réduit le stationnement en centre-ville. Vetter et Trautmann ont tous deux réclamé une approche plus équilibrée, avec un rétablissement partiel du stationnement.` },
        positions: { barseghian: 5, vetter_stras: 1, trautmann_stras: 3, kobryn_stras: 4 },
      },
      {
        id: `stras_2026_q2`,
        text: { en: `The city should significantly increase social and student housing construction.`, fr: `La ville devrait augmenter significativement la construction de logements sociaux et étudiants.` },
        theme: `PUBLIC_SERVICES`, direction: 1,
        info: { en: `Strasbourg's 60,000 students face an acute housing shortage. Social housing waitlists are long. All left candidates supported more public construction; Vetter favoured private sector incentives.`, fr: `Les 60 000 étudiants de Strasbourg sont confrontés à une pénurie aiguë de logements. Les listes d'attente de logements sociaux sont longues. Tous les candidats de gauche ont soutenu plus de construction publique ; Vetter a privilégié les incitations au secteur privé.` },
        positions: { barseghian: 5, vetter_stras: 2, trautmann_stras: 4, kobryn_stras: 5 },
      },
      {
        id: `stras_2026_q3`,
        text: { en: `Strasbourg should actively defend its status as the permanent seat of the European Parliament against proposals to concentrate all EU sessions in Brussels.`, fr: `Strasbourg devrait défendre activement son statut de siège permanent du Parlement européen face aux propositions de regrouper toutes les sessions à Bruxelles.` },
        theme: `GLOBAL`, direction: -1,
        info: { en: `The European Parliament holds 12 plenary sessions per year in Strasbourg, generating €600m annually in economic activity. Brussels MEPs regularly propose consolidating all sessions in Brussels. All major Strasbourg candidates support defending the seat, but with varying intensity.`, fr: `Le Parlement européen tient 12 sessions plénières par an à Strasbourg, générant 600 M€ d'activité économique annuelle. Des eurodéputés bruxellois proposent régulièrement de concentrer toutes les sessions à Bruxelles. Tous les grands candidats strasbourgeois soutiennent la défense du siège, avec des intensités variables.` },
        positions: { barseghian: 5, vetter_stras: 5, trautmann_stras: 5, kobryn_stras: 4 },
      },
      {
        id: `stras_2026_q4`,
        text: { en: `Public safety and police presence in Strasbourg should be significantly reinforced, particularly in the Neuhof and Hautepierre districts.`, fr: `La sécurité publique et la présence policière à Strasbourg devraient être significativement renforcées, notamment dans les quartiers Neuhof et Hautepierre.` },
        theme: `SECURITY`, direction: 1,
        info: { en: `The Neuhof and Hautepierre districts face persistent social difficulties including drug trafficking and public disorder. Vetter made security a central plank; Trautmann backed targeted policing paired with social investment; Barseghian and Kobryn prioritised social programmes.`, fr: `Les quartiers Neuhof et Hautepierre sont confrontés à des difficultés sociales persistantes, dont trafics de drogues et désordres publics. Vetter a fait de la sécurité un axe central ; Trautmann a soutenu une police ciblée couplée à l'investissement social ; Barseghian et Kobryn ont priorisé les programmes sociaux.` },
        positions: { barseghian: 2, vetter_stras: 5, trautmann_stras: 3, kobryn_stras: 2 },
      },
      {
        id: `stras_2026_q5`,
        text: { en: `Strasbourg should prioritise building a new cross-Rhine link (bridge or tunnel) to Kehl.`, fr: `Strasbourg devrait prioriser la construction d'une nouvelle liaison transfrontalière (pont ou tunnel) vers Kehl.` },
        theme: `GLOBAL`, direction: -1,
        info: { en: `Over 30,000 people commute daily between Strasbourg and Kehl. The existing bridge network is at capacity during peak hours. A new crossing has been under study for years but disputed on cost and environmental grounds.`, fr: `Plus de 30 000 personnes font la navette quotidiennement entre Strasbourg et Kehl. Les ponts existants sont saturés aux heures de pointe. Un nouveau franchissement est à l'étude depuis des années mais disputé pour son coût et son impact environnemental.` },
        positions: { barseghian: 3, vetter_stras: 4, trautmann_stras: 4, kobryn_stras: 3 },
      },
      {
        id: `stras_2026_q6`,
        text: { en: `Strasbourg should reduce municipal borrowing and prioritise fiscal responsibility over new public spending.`, fr: `Strasbourg devrait réduire l'endettement municipal et prioriser la responsabilité budgétaire plutôt que de nouvelles dépenses publiques.` },
        theme: `ECONOMY`, direction: -1,
        info: { en: `Barseghian's mandate was marked by increased municipal borrowing to fund ecological and social housing programmes. Vetter made debt reduction a flagship commitment. Trautmann argued for selective investment; Kobryn opposed austerity entirely.`, fr: `Le mandat Barseghian s'est accompagné d'une hausse de l'endettement municipal pour financer les programmes écologiques et de logement social. Vetter a fait de la réduction de la dette un engagement central. Trautmann a plaidé pour un investissement sélectif ; Kobryn s'est opposé à toute austérité.` },
        positions: { barseghian: 2, vetter_stras: 5, trautmann_stras: 3, kobryn_stras: 1 },
      },
      {
        id: `stras_2026_q7`,
        text: { en: `Strasbourg should extend the northern tram line (tram nord) even if it significantly increases municipal debt.`, fr: `Strasbourg devrait prolonger la ligne de tram nord même si cela augmente significativement la dette municipale.` },
        theme: `PUBLIC_SERVICES`, direction: 1,
        info: { en: `The planned northern tram extension would serve under-served districts but is estimated to cost several hundred million euros. Barseghian and Kobryn supported proceeding; Vetter called for deferral until the city's finances improved; Trautmann favoured a phased approach.`, fr: `Le prolongement prévu du tram nord desservirait des quartiers peu couverts mais est estimé à plusieurs centaines de millions d'euros. Barseghian et Kobryn ont soutenu le projet ; Vetter a demandé un report jusqu'à l'assainissement des finances ; Trautmann a préconisé une approche progressive.` },
        positions: { barseghian: 5, vetter_stras: 1, trautmann_stras: 3, kobryn_stras: 5 },
      },
    ],
    candidates: [
      {
        id: `trautmann_stras`,
        image: `/images/candidates/trautmann.svg`,
        name: `Catherine Trautmann`,
        party: { en: `Parti Socialiste`, fr: `Parti Socialiste` },
        color: `#E75480`,
        result: { en: `PS candidate, former Mayor of Strasbourg (1989–2001)`, fr: `Candidate PS, ancienne maire de Strasbourg (1989–2001)` },
        profile: { ECONOMY: 30, SOCIAL: 80, IMMIGRATION: 25, SECURITY: 45, ENVIRONMENT: 60, DEMOCRACY: 78, GLOBAL: 18, PUBLIC_SERVICES: 78 },
        description: { en: `Former Mayor of Strasbourg (1989–2001) and MEP. Centre-left platform: defend the European Parliament seat, targeted policing combined with social investment, phased tram extension, pragmatic housing policy.`, fr: `Ancienne maire de Strasbourg (1989–2001) et eurodéputée. Programme centre-gauche : défendre le siège du Parlement européen, police ciblée couplée à l'investissement social, prolongement progressif du tram, politique du logement pragmatique.` },
      },
      {
        id: `vetter_stras`,
        image: `/images/candidates/vetter.svg`,
        name: `Jean-Philippe Vetter`,
        party: { en: `Les Républicains / UDI`, fr: `Les Républicains / UDI` },
        color: `#0066CC`,
        result: { en: `LR/UDI candidate`, fr: `Candidat LR/UDI` },
        profile: { ECONOMY: 65, SOCIAL: 35, IMMIGRATION: 60, SECURITY: 78, ENVIRONMENT: 38, DEMOCRACY: 68, GLOBAL: 35, PUBLIC_SERVICES: 40 },
        description: { en: `Conservative right-of-centre. Platform focused on public safety, debt reduction, restoring city-centre parking, and private-sector economic development. Opposed the tram nord extension pending fiscal consolidation.`, fr: `Droite conservatrice. Programme centré sur la sécurité publique, la réduction de la dette, le rétablissement du stationnement en centre-ville et le développement économique privé. Opposé à l'extension du tram nord avant l'assainissement des finances.` },
      },
      {
        id: `barseghian`,
        image: `/images/candidates/barseghian.svg`,
        name: `Jeanne Barseghian`,
        party: { en: `Les Écologistes (EELV)`, fr: `Les Écologistes (EELV)` },
        color: `#00A550`,
        result: { en: `Incumbent mayor (elected 2020)`, fr: `Maire sortante (élue en 2020)` },
        profile: { ECONOMY: 22, SOCIAL: 82, IMMIGRATION: 20, SECURITY: 28, ENVIRONMENT: 90, DEMOCRACY: 82, GLOBAL: 20, PUBLIC_SERVICES: 75 },
        description: { en: `Incumbent mayor (2020–present). Green ecologist. Reduced city-centre parking, expanded cycling infrastructure, increased social housing construction, and championed Strasbourg's European identity.`, fr: `Maire sortante (depuis 2020). Écologiste. A réduit le stationnement en centre-ville, développé les pistes cyclables, augmenté la construction de logements sociaux et renforcé l'identité européenne de Strasbourg.` },
      },
      {
        id: `kobryn_stras`,
        image: `/images/candidates/kobryn.svg`,
        name: `Florian Kobryn`,
        party: { en: `La France Insoumise`, fr: `La France Insoumise` },
        color: `#CC2200`,
        result: { en: `LFI candidate`, fr: `Candidat LFI` },
        profile: { ECONOMY: 15, SOCIAL: 90, IMMIGRATION: 15, SECURITY: 20, ENVIRONMENT: 78, DEMOCRACY: 88, GLOBAL: 20, PUBLIC_SERVICES: 90 },
        description: { en: `LFI candidate. Platform: expand public services, oppose austerity, prioritise social and student housing, strengthen residents' rights against rising rents.`, fr: `Candidat LFI. Programme : développer les services publics, s'opposer à l'austérité, prioriser le logement social et étudiant, renforcer les droits des locataires face à la hausse des loyers.` },
      },
    ],
  },

  // ── eu_2024 ──────────────────────────────────────────────────────────────
  {
    id: `eu_2024`,
    image: `https://commons.wikimedia.org/wiki/Special:FilePath/European_Parliament_Strasbourg_Hemicycle_-_Diliff.jpg?width=1200`,
    title: { en: `European Parliament Election 2024`, fr: `Élections européennes 2024` },
    country: `European Union`,
    flag: `🇪🇺`,
    year: 2024,
    description: {
      en: `Voters across 27 EU member states elected 720 MEPs in June 2024. The centre-right EPP remained the largest group; hard-right parties made significant gains.`,
      fr: `Les électeurs de 27 États membres ont élu 720 eurodéputés en juin 2024. Le PPE de centre-droit est resté le premier groupe ; les partis de droite dure ont enregistré des gains significatifs.`,
    },
    context: {
      en: [
        `The European Parliament is the only directly elected institution of the European Union. Its 720 members (MEPs) represent 450 million EU citizens. Elections take place every five years across all 27 member states simultaneously.`,
        `The 2024 election happened against a backdrop of the war in Ukraine, rising cost of living, concerns about migration, and growing climate policy pushback. Voter turnout was 51% — the highest in 30 years.`,
        `The main result: the centre-right EPP (European People's Party) won the most seats. The hard right made major gains, with the Patriots for Europe group (including Orbán's Fidesz and Le Pen's RN) becoming a major force. The Greens lost heavily.`,
      ],
      fr: [
        `Le Parlement européen est la seule institution de l'Union européenne élue directement. Ses 720 membres (eurodéputés) représentent 450 millions de citoyens. Les élections se tiennent tous les cinq ans.`,
        `Les élections de 2024 se sont déroulées sur fond de guerre en Ukraine, de hausse du coût de la vie, de préoccupations migratoires et d'un retour de bâton sur la politique climatique. La participation était de 51 %, le niveau le plus élevé depuis 30 ans.`,
        `Le résultat principal : le PPE a remporté le plus de sièges. La droite dure a enregistré des gains majeurs, avec le groupe Patriotes pour l'Europe (incluant le Fidesz d'Orbán et le RN de Le Pen) devenant une force majeure. Les Verts ont lourdement chuté.`,
      ],
    },
    deeperContext: {
      en: [
        `EU elections are fought in each country under national rules, but MEPs then sit in transnational political groups. A candidate voting for the EPP in Germany (CDU) and in France (LR) is voting for the same group, though on separate national lists.`,
        `The main groups after 2024:\n• EPP (centre-right) — 188 seats. Christian-democratic and conservative. Supports EU integration, free markets, and moderate climate action.\n• S&D (centre-left) — 136 seats. Social democrats. Pro-welfare, pro-EU, progressive.\n• Patriots for Europe (hard right) — 84 seats. Nationalist, anti-immigration, Eurosceptic.\n• ECR (national-conservative right) — 78 seats. Includes Meloni's Brothers of Italy. Eurosceptic but less extreme than Patriots.\n• Renew Europe (liberal) — 77 seats. Pro-EU, economically liberal, socially progressive.\n• Greens/EFA — 53 seats. Environmental, federalist, progressive.`,
      ],
      fr: [
        `Les élections européennes se déroulent dans chaque pays selon des règles nationales, mais les eurodéputés siègent ensuite dans des groupes politiques transnationaux.`,
        `Les principaux groupes après 2024 :\n• PPE (centre-droit) — 188 sièges. Chrétiens-démocrates et conservateurs.\n• S&D (centre-gauche) — 136 sièges. Social-démocrates. Pro-welfare, pro-UE.\n• Patriotes pour l'Europe (droite dure) — 84 sièges. Nationaliste, anti-immigration, eurosceptique.\n• ECR (droite national-conservatrice) — 78 sièges. Inclut les Frères d'Italie de Meloni.\n• Renew Europe (libéraux) — 77 sièges. Pro-UE, libéral, progressiste.\n• Verts/ALE — 53 sièges. Environnementaliste, fédéraliste.`,
      ],
    },
    specificQuestions: [
      {
        id: `eu_2024_q1`,
        text: { en: `The EU should significantly increase its climate ambitions, including a faster transition away from fossil fuels.`, fr: `L'UE devrait accroître significativement ses ambitions climatiques, notamment en accélérant la transition hors des énergies fossiles.` },
        theme: `ENVIRONMENT`, direction: 1,
        info: { en: `The EU's Green Deal was the centrepiece of the 2019–2024 Commission. In 2024, a backlash from farmers and industry led parties to row back on some targets.`, fr: `Le Pacte Vert européen était le pilier de la Commission 2019-2024. En 2024, un retour de bâton des agriculteurs et de l'industrie a conduit les partis à reculer sur certains objectifs.` },
        positions: { epp: 3, pse: 5, renew: 4, greens_eu: 5, ecr: 2, patriots: 1 },
      },
      {
        id: `eu_2024_q2`,
        text: { en: `The EU should adopt a common migration and asylum policy with strict border controls.`, fr: `L'UE devrait adopter une politique commune de migration et d'asile avec des contrôles aux frontières stricts.` },
        theme: `IMMIGRATION`, direction: 1,
        info: { en: `Migration was the top issue in EU elections. The EU's Pact on Migration and Asylum passed in 2024, creating a common framework but with contested enforcement rules.`, fr: `La migration était le premier sujet des élections européennes. Le Pacte sur la migration et l'asile a été adopté en 2024, créant un cadre commun mais avec des règles d'application contestées.` },
        positions: { epp: 4, pse: 2, renew: 3, greens_eu: 1, ecr: 5, patriots: 5 },
      },
      {
        id: `eu_2024_q3`,
        text: { en: `EU member states should transfer more powers to European institutions.`, fr: `Les États membres de l'UE devraient transférer davantage de pouvoirs aux institutions européennes.` },
        theme: `GLOBAL`, direction: -1,
        info: { en: `The debate between European federalism (deeper integration) and intergovernmentalism (keeping power with member states) is the oldest in EU politics.`, fr: `Le débat entre fédéralisme européen (intégration plus profonde) et intergouvernementalisme (garder le pouvoir aux États membres) est le plus ancien de la politique européenne.` },
        positions: { epp: 3, pse: 4, renew: 5, greens_eu: 5, ecr: 1, patriots: 1 },
      },
      {
        id: `eu_2024_q4`,
        text: { en: `The EU should provide strong, long-term military and financial support to Ukraine.`, fr: `L'UE devrait fournir un soutien militaire et financier fort et durable à l'Ukraine.` },
        theme: `GLOBAL`, direction: -1,
        info: { en: `The war in Ukraine tested EU unity. Most mainstream parties backed Ukraine firmly; the hard right (Patriots) was more equivocal about continued support.`, fr: `La guerre en Ukraine a mis à l'épreuve l'unité européenne. La plupart des partis mainstream ont soutenu fermement l'Ukraine ; la droite dure (Patriotes) était plus équivoque.` },
        positions: { epp: 5, pse: 5, renew: 5, greens_eu: 4, ecr: 3, patriots: 2 },
      },
      {
        id: `eu_2024_q5`,
        text: { en: `The EU should reduce regulations on businesses to improve economic competitiveness.`, fr: `L'UE devrait réduire les réglementations pesant sur les entreprises pour améliorer la compétitivité économique.` },
        theme: `ECONOMY`, direction: 1,
        info: { en: `The Draghi report on EU competitiveness warned that excessive regulation and fragmented markets were holding Europe back vs the US and China.`, fr: `Le rapport Draghi sur la compétitivité européenne alertait que la réglementation excessive et les marchés fragmentés freinaient l'Europe face aux États-Unis et à la Chine.` },
        positions: { epp: 4, pse: 2, renew: 4, greens_eu: 2, ecr: 4, patriots: 3 },
      },
      {
        id: `eu_2024_q6`,
        text: { en: `The EU should invest more in common defence and reduce dependence on US security guarantees.`, fr: `L'UE devrait investir davantage dans une défense commune et réduire sa dépendance aux garanties sécuritaires américaines.` },
        theme: `SECURITY`, direction: 1,
        info: { en: `The war in Ukraine and uncertainty over US commitments under Trump renewed the debate about European strategic autonomy.`, fr: `La guerre en Ukraine et l'incertitude sur les engagements américains sous Trump ont relancé le débat sur l'autonomie stratégique européenne.` },
        positions: { epp: 4, pse: 4, renew: 5, greens_eu: 3, ecr: 3, patriots: 2 },
      },
      {
        id: `eu_2024_q7`,
        text: { en: `The EU should adopt a common social minimum — a basic income floor across all member states.`, fr: `L'UE devrait adopter un plancher social commun — un revenu minimum de base dans tous les États membres.` },
        theme: `PUBLIC_SERVICES`, direction: 1,
        info: { en: `Social Europe — harmonising welfare standards — is championed by the left to prevent a "race to the bottom." The right argues social policy should remain national.`, fr: `L'Europe sociale — harmoniser les normes sociales — est défendue par la gauche pour éviter le "nivellement par le bas". La droite estime que la politique sociale doit rester nationale.` },
        positions: { epp: 2, pse: 5, renew: 3, greens_eu: 5, ecr: 1, patriots: 2 },
      },
      {
        id: `eu_2024_q8`,
        text: { en: `The EU should accelerate the phase-out of combustion-engine cars by 2035.`, fr: `L'UE devrait accélérer la suppression des voitures à moteur thermique d'ici 2035.` },
        theme: `ENVIRONMENT`, direction: 1,
        info: { en: `The EU had agreed to ban new petrol/diesel cars from 2035. In 2024 this faced a strong backlash from the EPP and the automotive industry.`, fr: `L'UE avait convenu d'interdire les nouvelles voitures essence/diesel à partir de 2035. En 2024, cela s'est heurté à un fort retour de bâton du PPE et de l'industrie automobile.` },
        positions: { epp: 2, pse: 4, renew: 3, greens_eu: 5, ecr: 1, patriots: 1 },
      },
      {
        id: `eu_2024_q9`,
        text: { en: `The EU's borders should be more strictly controlled to reduce irregular migration.`, fr: `Les frontières de l'UE devraient être plus strictement contrôlées pour réduire la migration irrégulière.` },
        theme: `IMMIGRATION`, direction: 1,
        info: { en: `Frontex, the EU border agency, has been criticised both for pushbacks (by the left) and for being too lax (by the right). External border management is a top EU political issue.`, fr: `Frontex, l'agence frontalière européenne, a été critiquée pour les refoulements (par la gauche) et pour être trop laxiste (par la droite).` },
        positions: { epp: 4, pse: 2, renew: 3, greens_eu: 1, ecr: 5, patriots: 5 },
      },
      {
        id: `eu_2024_q10`,
        text: { en: `The EU should introduce a minimum corporate tax rate for all member states.`, fr: `L'UE devrait introduire un taux minimum d'imposition des sociétés pour tous les États membres.` },
        theme: `ECONOMY`, direction: -1,
        info: { en: `The OECD global minimum corporate tax of 15% was implemented in the EU in 2024. The debate continues on whether to raise it further and close loopholes.`, fr: `Le taux minimum mondial d'imposition des sociétés de l'OCDE à 15 % a été mis en œuvre dans l'UE en 2024. Le débat se poursuit sur son relèvement éventuel.` },
        positions: { epp: 3, pse: 5, renew: 4, greens_eu: 5, ecr: 2, patriots: 2 },
      },
    ],
    candidates: [
      {
        id: `epp`,
        image: `/images/candidates/epp.svg`,
        name: `EPP — European People's Party`,
        party: { en: `European People's Party`, fr: `Parti populaire européen` },
        color: `#1a3080`,
        result: { en: `188 seats (largest group)`, fr: `188 sièges (premier groupe)` },
        profile: { ECONOMY: 68, SOCIAL: 42, IMMIGRATION: 58, SECURITY: 62, ENVIRONMENT: 52, DEMOCRACY: 75, GLOBAL: 28, PUBLIC_SERVICES: 48 },
        description: { en: `Centre-right. Christian-democratic, pro-EU integration, economically liberal, moderate climate action.`, fr: `Centre-droit. Chrétien-démocrate, pro-intégration européenne, libéral économiquement, action climatique modérée.` },
      },
      {
        id: `pse`,
        image: `/images/candidates/pse.svg`,
        name: `S&D — Socialists & Democrats`,
        party: { en: `Progressive Alliance of Socialists and Democrats`, fr: `Alliance progressiste des socialistes et démocrates` },
        color: `#CC0000`,
        result: { en: `136 seats`, fr: `136 sièges` },
        profile: { ECONOMY: 28, SOCIAL: 78, IMMIGRATION: 22, SECURITY: 42, ENVIRONMENT: 72, DEMOCRACY: 82, GLOBAL: 22, PUBLIC_SERVICES: 78 },
        description: { en: `Centre-left. Social democratic, strong welfare, pro-EU, progressive on social issues and climate.`, fr: `Centre-gauche. Social-démocrate, welfare fort, pro-UE, progressiste sur le social et le climat.` },
      },
      {
        id: `renew`,
        image: `/images/candidates/renew.svg`,
        name: `Renew Europe`,
        party: { en: `Renew Europe`, fr: `Renew Europe` },
        color: `#c4950a`,
        result: { en: `77 seats`, fr: `77 sièges` },
        profile: { ECONOMY: 65, SOCIAL: 68, IMMIGRATION: 32, SECURITY: 52, ENVIRONMENT: 62, DEMOCRACY: 82, GLOBAL: 18, PUBLIC_SERVICES: 52 },
        description: { en: `Liberal. Pro-EU federalism, economically liberal, socially progressive, pro-Ukraine.`, fr: `Libéral. Pro-fédéralisme européen, libéral économiquement, progressiste socialement, pro-Ukraine.` },
      },
      {
        id: `greens_eu`,
        image: `/images/candidates/greens_eu.svg`,
        name: `Greens/EFA`,
        party: { en: `Greens–European Free Alliance`, fr: `Verts/Alliance libre européenne` },
        color: `#009900`,
        result: { en: `53 seats (heavy losses)`, fr: `53 sièges (lourdes pertes)` },
        profile: { ECONOMY: 25, SOCIAL: 85, IMMIGRATION: 15, SECURITY: 30, ENVIRONMENT: 94, DEMOCRACY: 85, GLOBAL: 20, PUBLIC_SERVICES: 68 },
        description: { en: `Green/left. Radical climate action, pro-immigration, federalist, civil liberties.`, fr: `Vert/gauche. Action climatique radicale, pro-immigration, fédéraliste, libertés civiles.` },
      },
      {
        id: `ecr`,
        image: `/images/candidates/ecr.svg`,
        name: `ECR — European Conservatives`,
        party: { en: `European Conservatives and Reformists`, fr: `Conservateurs et réformistes européens` },
        color: `#1a2d50`,
        result: { en: `78 seats`, fr: `78 sièges` },
        profile: { ECONOMY: 65, SOCIAL: 28, IMMIGRATION: 78, SECURITY: 72, ENVIRONMENT: 32, DEMOCRACY: 52, GLOBAL: 68, PUBLIC_SERVICES: 38 },
        description: { en: `National-conservative. Eurosceptic, anti-immigration, socially conservative, anti-Green Deal.`, fr: `National-conservateur. Eurosceptique, anti-immigration, conservateur socialement, anti-Pacte vert.` },
      },
      {
        id: `patriots`,
        image: `/images/candidates/patriots.svg`,
        name: `Patriots for Europe`,
        party: { en: `Patriots for Europe`, fr: `Patriotes pour l'Europe` },
        color: `#002288`,
        result: { en: `84 seats`, fr: `84 sièges` },
        profile: { ECONOMY: 45, SOCIAL: 15, IMMIGRATION: 92, SECURITY: 82, ENVIRONMENT: 22, DEMOCRACY: 35, GLOBAL: 85, PUBLIC_SERVICES: 52 },
        description: { en: `Far-right nationalist. Very anti-immigration, sovereignist, Eurosceptic, populist.`, fr: `Nationaliste d'extrême droite. Très anti-immigration, souverainiste, eurosceptique, populiste.` },
      },
    ],
  },

  // ── de_2025 ──────────────────────────────────────────────────────────────
  {
    id: `de_2025`,
    image: `https://commons.wikimedia.org/wiki/Special:FilePath/Brandenburger_Tor_abends.jpg?width=1200`,
    title: { en: `German Federal Election 2025`, fr: `Élections fédérales allemandes 2025` },
    country: `Germany`,
    flag: `🇩🇪`,
    year: 2025,
    description: {
      en: `Friedrich Merz's CDU/CSU won the February 2025 election. The AfD came second. Olaf Scholz's SPD suffered its worst result in decades.`,
      fr: `La CDU/CSU de Friedrich Merz a remporté les élections de février 2025. L'AfD est arrivée deuxième. Le SPD d'Olaf Scholz a subi son pire résultat depuis des décennies.`,
    },
    context: {
      en: [
        `Germany is Europe's largest economy and uses a proportional voting system where parties must cross a 5% threshold to enter the Bundestag. Governments are almost always formed by coalition.`,
        `The 2025 election was called early after the collapse of Scholz's three-party coalition in late 2024. The campaign focused on economic stagnation, energy costs, migration, and the role of the state in the economy.`,
        `CDU/CSU won ~29%, AfD came second with ~20%, SPD fell to ~16%. The FDP narrowly failed to enter parliament. Friedrich Merz formed a grand coalition with the SPD.`,
      ],
      fr: [
        `L'Allemagne est la plus grande économie d'Europe et utilise un système proportionnel où les partis doivent franchir un seuil de 5 % pour entrer au Bundestag. Les gouvernements sont presque toujours des coalitions.`,
        `Les élections de 2025 ont été déclenchées après l'effondrement de la coalition à trois partis de Scholz fin 2024. La campagne portait sur la stagnation économique, les coûts de l'énergie, la migration et le rôle de l'État.`,
        `La CDU/CSU a remporté ~29 %, l'AfD est arrivée deuxième avec ~20 %, le SPD est tombé à ~16 %. Le FDP n'a pas réussi à entrer au Parlement. Friedrich Merz a formé une grande coalition avec le SPD.`,
      ],
    },
    deeperContext: {
      en: [
        `Germany's political crisis in 2024–25 reflected a deeper structural problem: the economy had contracted for two consecutive years. The transition away from Russian gas and the decline of the automotive industry left Germany struggling to find a new industrial model.`,
        `Key parties:\n• CDU/CSU — Christian-democratic centre-right. Pro-business, moderate on migration, pro-NATO.\n• SPD — Social-democratic. Pro-welfare, pro-minimum wage, moderate left.\n• AfD — Far-right. Anti-immigration, Eurosceptic, soft on Russia, climate-sceptic.\n• Greens — Environmental, federalist, progressive, socially liberal.\n• FDP — Free-market liberal. Fiscal conservatism, deregulation, individual liberty.\n• BSW (Sahra Wagenknecht) — Hybrid left-right. Anti-immigration but strong welfare, anti-NATO, anti-sanctions on Russia.`,
      ],
      fr: [
        `La crise politique allemande de 2024-25 reflétait un problème structurel plus profond : l'économie s'était contractée deux années consécutives. La transition hors du gaz russe et le déclin de l'industrie automobile ont laissé l'Allemagne en difficulté.`,
        `Partis clés :\n• CDU/CSU — Centre-droit chrétien-démocrate. Pro-entreprises, modéré sur la migration, pro-OTAN.\n• SPD — Social-démocrate. Pro-welfare, pro-salaire minimum.\n• AfD — Extrême droite. Anti-immigration, eurosceptique, climatosceptique.\n• Verts — Écologiste, fédéraliste, progressiste.\n• FDP — Libéral de marché. Conservatisme fiscal, déréglementation.\n• BSW — Hybride gauche-droite. Anti-immigration mais welfare fort, anti-OTAN.`,
      ],
    },
    specificQuestions: [
      {
        id: `de_2025_q1`,
        text: { en: `Germany should significantly cut government spending to reduce the national debt.`, fr: `L'Allemagne devrait significativement réduire les dépenses publiques pour réduire la dette nationale.` },
        theme: `ECONOMY`, direction: 1,
        info: { en: `Germany's constitutional "debt brake" (Schuldenbremse) limits borrowing. The FDP insisted on strict fiscal rules; others wanted to reform or suspend the brake to invest.`, fr: `Le "frein à la dette" constitutionnel allemand (Schuldenbremse) limite les emprunts. Le FDP insistait sur des règles budgétaires strictes ; d'autres voulaient réformer ou suspendre ce mécanisme pour investir.` },
        positions: { merz: 4, scholz: 2, weidel: 3, habeck: 1, lindner: 5, wagenknecht: 1 },
      },
      {
        id: `de_2025_q2`,
        text: { en: `Germany should significantly increase defence spending beyond 2% of GDP.`, fr: `L'Allemagne devrait significativement augmenter ses dépenses de défense au-delà de 2 % du PIB.` },
        theme: `SECURITY`, direction: 1,
        info: { en: `After the 2022 Zeitenwende (turning point), Germany began increasing defence spending. The question is how far and how fast — the AfD and BSW are more reluctant.`, fr: `Après la "Zeitenwende" (tournant) de 2022, l'Allemagne a commencé à augmenter ses dépenses de défense. La question est jusqu'où et à quelle vitesse.` },
        positions: { merz: 5, scholz: 3, weidel: 2, habeck: 3, lindner: 4, wagenknecht: 1 },
      },
      {
        id: `de_2025_q3`,
        text: { en: `Immigration to Germany should be substantially reduced.`, fr: `L'immigration vers l'Allemagne devrait être substantiellement réduite.` },
        theme: `IMMIGRATION`, direction: 1,
        info: { en: `Germany received over 350,000 asylum seekers in 2023. Migration became the dominant issue. Even mainstream parties moved toward tougher positions after a wave of crimes involving migrants.`, fr: `L'Allemagne a accueilli plus de 350 000 demandeurs d'asile en 2023. La migration est devenue le sujet dominant. Même les partis du courant principal ont durci leurs positions.` },
        positions: { merz: 4, scholz: 3, weidel: 5, habeck: 1, lindner: 4, wagenknecht: 4 },
      },
      {
        id: `de_2025_q4`,
        text: { en: `Germany should phase out coal power as quickly as possible.`, fr: `L'Allemagne devrait sortir du charbon aussi rapidement que possible.` },
        theme: `ENVIRONMENT`, direction: 1,
        info: { en: `Germany closed its last nuclear plants in 2023. Coal still provides a significant share of electricity. The Greens and left want rapid coal exit; the right argues for energy security.`, fr: `L'Allemagne a fermé ses dernières centrales nucléaires en 2023. Le charbon fournit encore une part importante de l'électricité. Les Verts veulent une sortie rapide du charbon ; la droite invoque la sécurité énergétique.` },
        positions: { merz: 3, scholz: 3, weidel: 1, habeck: 5, lindner: 3, wagenknecht: 2 },
      },
      {
        id: `de_2025_q5`,
        text: { en: `Germany should reduce corporate taxes and regulations to improve business competitiveness.`, fr: `L'Allemagne devrait réduire les impôts sur les sociétés et les réglementations pour améliorer la compétitivité des entreprises.` },
        theme: `ECONOMY`, direction: 1,
        info: { en: `Germany's business model faced structural challenges. International competitiveness was falling. The FDP and CDU called for tax cuts; the left argued for public investment instead.`, fr: `Le modèle économique allemand faisait face à des défis structurels. Le FDP et la CDU préconisaient des baisses d'impôts ; la gauche prônait l'investissement public.` },
        positions: { merz: 5, scholz: 2, weidel: 4, habeck: 2, lindner: 5, wagenknecht: 1 },
      },
      {
        id: `de_2025_q6`,
        text: { en: `Germany should continue to provide military support to Ukraine.`, fr: `L'Allemagne devrait continuer à fournir un soutien militaire à l'Ukraine.` },
        theme: `GLOBAL`, direction: -1,
        info: { en: `Germany became one of Ukraine's largest arms suppliers after 2022. The AfD and BSW opposed continued support; mainstream parties backed it.`, fr: `L'Allemagne est devenue l'un des principaux fournisseurs d'armes de l'Ukraine après 2022. L'AfD et le BSW s'opposaient à la poursuite du soutien.` },
        positions: { merz: 5, scholz: 4, weidel: 1, habeck: 4, lindner: 4, wagenknecht: 1 },
      },
      {
        id: `de_2025_q7`,
        text: { en: `The minimum wage in Germany should be raised significantly.`, fr: `Le salaire minimum en Allemagne devrait être augmenté de manière significative.` },
        theme: `ECONOMY`, direction: -1,
        info: { en: `Germany introduced a statutory minimum wage in 2015. The SPD and left want to raise it to €15/hour; the CDU and FDP are more cautious about the economic impact.`, fr: `L'Allemagne a introduit un salaire minimum légal en 2015. Le SPD et la gauche veulent le porter à 15 €/heure ; la CDU et le FDP sont plus prudents quant à l'impact économique.` },
        positions: { merz: 2, scholz: 5, weidel: 3, habeck: 4, lindner: 1, wagenknecht: 5 },
      },
      {
        id: `de_2025_q8`,
        text: { en: `Germany should reintroduce nuclear energy as part of its energy mix.`, fr: `L'Allemagne devrait réintroduire l'énergie nucléaire dans son mix énergétique.` },
        theme: `ENVIRONMENT`, direction: -1,
        info: { en: `Germany shut its last nuclear plants in April 2023. Energy costs surged after Russia cut gas supplies. Some parties now argue nuclear should be reconsidered.`, fr: `L'Allemagne a fermé ses dernières centrales nucléaires en avril 2023. Les coûts de l'énergie ont augmenté après la coupure du gaz russe. Certains partis arguent désormais que le nucléaire devrait être reconsidéré.` },
        positions: { merz: 4, scholz: 1, weidel: 4, habeck: 1, lindner: 4, wagenknecht: 2 },
      },
      {
        id: `de_2025_q9`,
        text: { en: `Germany should normalise relations with Russia once conditions allow.`, fr: `L'Allemagne devrait normaliser ses relations avec la Russie dès que les conditions le permettront.` },
        theme: `GLOBAL`, direction: 1,
        info: { en: `Germany's economic model was built partly on cheap Russian energy. The AfD and BSW favour rapprochement; mainstream parties insist on security conditions being met first.`, fr: `Le modèle économique allemand était en partie construit sur l'énergie russe bon marché. L'AfD et le BSW favorisent le rapprochement ; les partis du courant principal insistent sur des conditions de sécurité préalables.` },
        positions: { merz: 2, scholz: 2, weidel: 5, habeck: 1, lindner: 2, wagenknecht: 5 },
      },
      {
        id: `de_2025_q10`,
        text: { en: `The welfare state should be expanded to better protect those left behind by economic change.`, fr: `L'État social devrait être élargi pour mieux protéger ceux laissés pour compte par les transformations économiques.` },
        theme: `PUBLIC_SERVICES`, direction: 1,
        info: { en: `Deindustrialisation and automation are hitting German workers in manufacturing. The SPD, Greens and BSW want stronger social safety nets; the CDU and FDP prefer labour market flexibility.`, fr: `La désindustrialisation et l'automatisation touchent les travailleurs allemands dans la manufacture. Le SPD, les Verts et le BSW veulent des filets de sécurité sociale plus solides.` },
        positions: { merz: 2, scholz: 4, weidel: 3, habeck: 4, lindner: 1, wagenknecht: 5 },
      },
    ],
    candidates: [
      {
        id: `merz`,
        image: `/images/candidates/merz.svg`,
        name: `Friedrich Merz`,
        party: { en: `CDU/CSU`, fr: `CDU/CSU` },
        color: `#1a1a1a`,
        result: { en: `Winner — ~29% (CDU/CSU)`, fr: `Vainqueur — ~29 % (CDU/CSU)` },
        profile: { ECONOMY: 72, SOCIAL: 35, IMMIGRATION: 68, SECURITY: 68, ENVIRONMENT: 48, DEMOCRACY: 78, GLOBAL: 35, PUBLIC_SERVICES: 42 },
        description: { en: `Conservative. Pro-business, fiscally strict, tough on migration, pro-NATO, traditionalist.`, fr: `Conservateur. Pro-entreprises, rigueur budgétaire, ferme sur la migration, pro-OTAN, traditionaliste.` },
      },
      {
        id: `scholz`,
        image: `/images/candidates/scholz.svg`,
        name: `Olaf Scholz`,
        party: { en: `SPD`, fr: `SPD` },
        color: `#CC0000`,
        result: { en: `~16% (SPD) — coalition junior partner`, fr: `~16 % (SPD) — partenaire junior de coalition` },
        profile: { ECONOMY: 38, SOCIAL: 72, IMMIGRATION: 38, SECURITY: 52, ENVIRONMENT: 65, DEMOCRACY: 80, GLOBAL: 25, PUBLIC_SERVICES: 68 },
        description: { en: `Social democrat. Pro-minimum wage, welfare expansion, moderate climate action, pro-NATO.`, fr: `Social-démocrate. Pro-salaire minimum, expansion du welfare, action climatique modérée, pro-OTAN.` },
      },
      {
        id: `weidel`,
        image: `/images/candidates/weidel.svg`,
        name: `Alice Weidel`,
        party: { en: `AfD`, fr: `AfD` },
        color: `#009EE0`,
        result: { en: `~20% (AfD)`, fr: `~20 % (AfD)` },
        profile: { ECONOMY: 55, SOCIAL: 15, IMMIGRATION: 95, SECURITY: 85, ENVIRONMENT: 18, DEMOCRACY: 32, GLOBAL: 82, PUBLIC_SERVICES: 45 },
        description: { en: `Far-right. Extremely anti-immigration, Eurosceptic, climate-sceptic, soft on Russia.`, fr: `Extrême droite. Extrêmement anti-immigration, eurosceptique, climatosceptique, douce envers la Russie.` },
      },
      {
        id: `habeck`,
        image: `/images/candidates/habeck.svg`,
        name: `Robert Habeck`,
        party: { en: `Greens (Bündnis 90/Die Grünen)`, fr: `Les Verts (Bündnis 90/Die Grünen)` },
        color: `#46962B`,
        result: { en: `~11.6% (Greens)`, fr: `~11,6 % (Verts)` },
        profile: { ECONOMY: 32, SOCIAL: 82, IMMIGRATION: 22, SECURITY: 38, ENVIRONMENT: 92, DEMOCRACY: 85, GLOBAL: 22, PUBLIC_SERVICES: 68 },
        description: { en: `Green. Radical climate transition, pro-immigration, socially progressive, pro-EU, pro-Ukraine.`, fr: `Vert. Transition climatique radicale, pro-immigration, progressiste, pro-UE, pro-Ukraine.` },
      },
      {
        id: `lindner`,
        image: `/images/candidates/lindner.svg`,
        name: `Christian Lindner`,
        party: { en: `FDP`, fr: `FDP` },
        color: `#c4b000`,
        result: { en: `~4.3% (FDP — below threshold)`, fr: `~4,3 % (FDP — sous le seuil)` },
        profile: { ECONOMY: 82, SOCIAL: 62, IMMIGRATION: 45, SECURITY: 52, ENVIRONMENT: 45, DEMOCRACY: 80, GLOBAL: 28, PUBLIC_SERVICES: 28 },
        description: { en: `Free-market liberal. Fiscal orthodoxy, deregulation, individual liberty, pro-EU, anti-debt.`, fr: `Libéral de marché. Orthodoxie budgétaire, déréglementation, liberté individuelle, pro-UE, anti-dette.` },
      },
      {
        id: `wagenknecht`,
        image: `/images/candidates/wagenknecht.svg`,
        name: `Sahra Wagenknecht`,
        party: { en: `BSW (Sahra Wagenknecht Alliance)`, fr: `BSW (Alliance Sahra Wagenknecht)` },
        color: `#7C1D6F`,
        result: { en: `~4.97% (BSW — narrowly missed threshold)`, fr: `~4,97 % (BSW — seuil manqué de peu)` },
        profile: { ECONOMY: 18, SOCIAL: 45, IMMIGRATION: 65, SECURITY: 52, ENVIRONMENT: 55, DEMOCRACY: 55, GLOBAL: 72, PUBLIC_SERVICES: 82 },
        description: { en: `Left-nationalist. Strong welfare, anti-NATO, anti-Ukraine support, anti-immigration, anti-sanctions on Russia.`, fr: `Gauche nationaliste. Welfare fort, anti-OTAN, contre le soutien à l'Ukraine, anti-immigration, anti-sanctions contre la Russie.` },
      },
    ],
  },

  // ── it_2022 ──────────────────────────────────────────────────────────────
  {
    id: `it_2022`,
    image: `https://commons.wikimedia.org/wiki/Special:FilePath/Colosseum_in_Rome,_Italy_-_April_2007.jpg?width=1200`,
    title: { en: `Italian General Election 2022`, fr: `Élections législatives italiennes 2022` },
    country: `Italy`,
    flag: `🇮🇹`,
    year: 2022,
    description: {
      en: `Giorgia Meloni's Fratelli d'Italia won the most votes, leading a right-wing coalition to a parliamentary majority. Meloni became Italy's first female prime minister.`,
      fr: `Le parti Fratelli d'Italia de Giorgia Meloni a remporté le plus de votes, menant une coalition de droite à la majorité parlementaire. Meloni est devenue la première femme Premier ministre d'Italie.`,
    },
    context: {
      en: [
        `Italy uses a mixed electoral system with both proportional and first-past-the-post elements. Governments are formed by coalition. Italy has had over 65 governments since 1945, making political stability a perennial concern.`,
        `The 2022 election followed the collapse of Mario Draghi's technocratic unity government. Italy was dealing with the energy crisis from the Ukraine war, high public debt, and persistent North-South economic inequality.`,
        `The right-wing coalition (Meloni's FdI, Salvini's Lega, and Berlusconi's Forza Italia) won a combined majority. Meloni's FdI came first with 26%. The centre-left PD came third with 19%. Conte's M5S came second with 15%.`,
      ],
      fr: [
        `L'Italie utilise un système électoral mixte avec des éléments proportionnels et majoritaires. Les gouvernements sont formés par coalition. L'Italie a eu plus de 65 gouvernements depuis 1945.`,
        `Les élections de 2022 ont suivi l'effondrement du gouvernement d'unité technocratique de Mario Draghi. L'Italie faisait face à la crise énergétique liée à la guerre en Ukraine, à une dette publique élevée et à l'inégalité économique persistante Nord-Sud.`,
        `La coalition de droite (FdI de Meloni, Lega de Salvini, Forza Italia de Berlusconi) a remporté une majorité combinée. Le FdI de Meloni est arrivé premier avec 26 %. Le PD de centre-gauche est arrivé troisième avec 19 %. Le M5S de Conte est arrivé deuxième avec 15 %.`,
      ],
    },
    deeperContext: {
      en: [
        `Fratelli d'Italia has roots in post-fascist politics (Movimento Sociale Italiano), which Meloni has tried to distance herself from. She positions FdI as a mainstream conservative-nationalist party, pro-NATO and broadly pro-EU, but strongly anti-immigration and culturally conservative.`,
        `Key parties:\n• FdI (Brothers of Italy) — National-conservative. Strong on immigration, law and order, traditional values, pro-NATO.\n• Lega — Originally a northern regionalist party turned national populist. Very anti-immigration, Eurosceptic.\n• Forza Italia — Berlusconi's centre-right. Pro-business, moderately Europhile.\n• PD (Democratic Party) — Centre-left. Social democratic, pro-EU.\n• M5S (Five Star Movement) — Anti-establishment populist. Strong welfare, anti-corruption, ambiguous on EU.`,
      ],
      fr: [
        `Fratelli d'Italia a des racines dans la politique post-fasciste (Movimento Sociale Italiano), dont Meloni s'est efforcée de se distancer. Elle positionne le FdI comme un parti conservateur-nationaliste du courant principal, pro-OTAN et globalement pro-UE, mais fortement anti-immigration et culturellement conservateur.`,
        `Partis clés :\n• FdI — National-conservateur. Ferme sur l'immigration, l'ordre public, les valeurs traditionnelles, pro-OTAN.\n• Lega — Parti régionaliste du Nord devenu populiste national. Très anti-immigration, eurosceptique.\n• Forza Italia — Centre-droit de Berlusconi. Pro-entreprises, modérément europhile.\n• PD — Centre-gauche social-démocrate, pro-UE.\n• M5S — Populiste anti-système. Welfare fort, anti-corruption.`,
      ],
    },
    specificQuestions: [
      {
        id: `it_2022_q1`,
        text: { en: `Italy should significantly reduce immigration from outside the EU.`, fr: `L'Italie devrait réduire significativement l'immigration en provenance de pays hors UE.` },
        theme: `IMMIGRATION`, direction: 1,
        info: { en: `Italy is a major entry point for migrants crossing the Mediterranean. Meloni promised to block boats; the left called for legal pathways and EU burden-sharing.`, fr: `L'Italie est un point d'entrée majeur pour les migrants traversant la Méditerranée. Meloni a promis de bloquer les bateaux ; la gauche réclamait des voies légales et un partage du fardeau européen.` },
        positions: { meloni: 5, letta: 1, salvini: 5, berlusconi: 4, conte: 3 },
      },
      {
        id: `it_2022_q2`,
        text: { en: `Italy should cut taxes, even if it means increasing the national debt.`, fr: `L'Italie devrait réduire les impôts, même si cela signifie accroître la dette nationale.` },
        theme: `ECONOMY`, direction: 1,
        info: { en: `Italy has one of Europe's highest public debts (over 140% of GDP). The right promised tax cuts; the EU and financial markets watched nervously.`, fr: `L'Italie a l'une des dettes publiques les plus élevées d'Europe (plus de 140 % du PIB). La droite promettait des baisses d'impôts ; l'UE et les marchés financiers observaient avec nervosité.` },
        positions: { meloni: 4, letta: 1, salvini: 5, berlusconi: 4, conte: 3 },
      },
      {
        id: `it_2022_q3`,
        text: { en: `The state should expand social protections and the minimum income guarantee.`, fr: `L'État devrait élargir les protections sociales et la garantie de revenu minimum.` },
        theme: `PUBLIC_SERVICES`, direction: 1,
        info: { en: `M5S introduced the Reddito di Cittadinanza (citizenship income) in 2019. The right wanted to abolish or restrict it; the left defended it.`, fr: `Le M5S a introduit le Reddito di Cittadinanza (revenu de citoyenneté) en 2019. La droite voulait le supprimer ou le restreindre ; la gauche le défendait.` },
        positions: { meloni: 1, letta: 4, salvini: 2, berlusconi: 2, conte: 5 },
      },
      {
        id: `it_2022_q4`,
        text: { en: `Italy should maintain strong support for the European Union.`, fr: `L'Italie devrait maintenir un soutien fort à l'Union européenne.` },
        theme: `GLOBAL`, direction: -1,
        info: { en: `Italy's relationship with the EU is fraught — public debt, migration, and budget rules cause constant tension. Meloni positioned herself as critical but not exit-seeking.`, fr: `La relation de l'Italie avec l'UE est tendue — dette publique, migration et règles budgétaires créent des tensions constantes. Meloni s'est positionnée comme critique mais pas en faveur d'une sortie.` },
        positions: { meloni: 3, letta: 5, salvini: 2, berlusconi: 4, conte: 3 },
      },
      {
        id: `it_2022_q5`,
        text: { en: `Italy should invest more in renewable energy and accelerate its green transition.`, fr: `L'Italie devrait investir davantage dans les énergies renouvelables et accélérer sa transition verte.` },
        theme: `ENVIRONMENT`, direction: 1,
        info: { en: `Italy has committed to EU climate targets but relies heavily on gas imports. The energy crisis from the Ukraine war made energy policy central to the 2022 campaign.`, fr: `L'Italie s'est engagée sur les objectifs climatiques européens mais dépend fortement des importations de gaz. La crise énergétique liée à la guerre en Ukraine a rendu la politique énergétique centrale.` },
        positions: { meloni: 2, letta: 4, salvini: 2, berlusconi: 3, conte: 4 },
      },
      {
        id: `it_2022_q6`,
        text: { en: `Italy should strengthen law and order and increase police powers.`, fr: `L'Italie devrait renforcer l'ordre public et accroître les pouvoirs de la police.` },
        theme: `SECURITY`, direction: 1,
        info: { en: `Organised crime remains a serious issue in southern Italy. The right called for tougher measures; the left focused on social causes and judicial reform.`, fr: `La criminalité organisée reste un problème grave dans le sud de l'Italie. La droite réclamait des mesures plus dures ; la gauche se concentrait sur les causes sociales et la réforme judiciaire.` },
        positions: { meloni: 5, letta: 2, salvini: 5, berlusconi: 4, conte: 3 },
      },
      {
        id: `it_2022_q7`,
        text: { en: `Italy should support the rights of same-sex couples, including adoption rights.`, fr: `L'Italie devrait soutenir les droits des couples homosexuels, y compris le droit à l'adoption.` },
        theme: `SOCIAL`, direction: 1,
        info: { en: `Italy does not have same-sex marriage. Civil unions exist since 2016. Meloni strongly opposed extension of rights; the left supported full equality.`, fr: `L'Italie n'a pas de mariage pour tous. Les unions civiles existent depuis 2016. Meloni s'opposait fermement à l'extension des droits ; la gauche soutenait l'égalité complète.` },
        positions: { meloni: 1, letta: 5, salvini: 1, berlusconi: 2, conte: 3 },
      },
      {
        id: `it_2022_q8`,
        text: { en: `Italy should use the EU recovery funds primarily to invest in the south of the country.`, fr: `L'Italie devrait utiliser les fonds de relance européens principalement pour investir dans le sud du pays.` },
        theme: `PUBLIC_SERVICES`, direction: 1,
        info: { en: `Italy received €200bn+ from the EU's NextGenerationEU fund. Allocating it between north and south, and between investment and debt reduction, was highly contested.`, fr: `L'Italie a reçu plus de 200 milliards d'euros du fonds NextGenerationEU de l'UE. La répartition entre nord et sud, et entre investissement et réduction de la dette, était très contestée.` },
        positions: { meloni: 3, letta: 4, salvini: 2, berlusconi: 2, conte: 5 },
      },
    ],
    candidates: [
      {
        id: `meloni`,
        image: `/images/candidates/meloni.svg`,
        name: `Giorgia Meloni`,
        party: { en: `Fratelli d'Italia`, fr: `Fratelli d'Italia` },
        color: `#2B3D8B`,
        result: { en: `Winner — 26% (FdI)`, fr: `Gagnante — 26 % (FdI)` },
        profile: { ECONOMY: 55, SOCIAL: 18, IMMIGRATION: 88, SECURITY: 82, ENVIRONMENT: 28, DEMOCRACY: 48, GLOBAL: 72, PUBLIC_SERVICES: 42 },
        description: { en: `National-conservative. Anti-immigration, traditional social values, pro-NATO, anti-Green Deal.`, fr: `National-conservatrice. Anti-immigration, valeurs sociales traditionnelles, pro-OTAN, anti-Pacte vert.` },
      },
      {
        id: `letta_it`,
        image: `/images/candidates/letta_it.svg`,
        name: `Enrico Letta`,
        party: { en: `Partito Democratico`, fr: `Partito Democratico` },
        color: `#CC0000`,
        result: { en: `19% (PD)`, fr: `19 % (PD)` },
        profile: { ECONOMY: 38, SOCIAL: 78, IMMIGRATION: 22, SECURITY: 42, ENVIRONMENT: 72, DEMOCRACY: 85, GLOBAL: 18, PUBLIC_SERVICES: 72 },
        description: { en: `Centre-left. Pro-EU, social democratic, progressive on social issues, pro-climate.`, fr: `Centre-gauche. Pro-UE, social-démocrate, progressiste socialement, pro-climat.` },
      },
      {
        id: `conte`,
        image: `/images/candidates/conte.svg`,
        name: `Giuseppe Conte`,
        party: { en: `Movimento 5 Stelle`, fr: `Movimento 5 Stelle` },
        color: `#EEA800`,
        result: { en: `15% (M5S)`, fr: `15 % (M5S)` },
        profile: { ECONOMY: 28, SOCIAL: 62, IMMIGRATION: 38, SECURITY: 48, ENVIRONMENT: 65, DEMOCRACY: 68, GLOBAL: 48, PUBLIC_SERVICES: 78 },
        description: { en: `Anti-establishment populist. Strong welfare, anti-corruption, cautious on Ukraine support.`, fr: `Populiste anti-système. Welfare fort, anti-corruption, prudent sur le soutien à l'Ukraine.` },
      },
      {
        id: `salvini`,
        image: `/images/candidates/salvini.svg`,
        name: `Matteo Salvini`,
        party: { en: `Lega`, fr: `Lega` },
        color: `#00A550`,
        result: { en: `8.9% (Lega)`, fr: `8,9 % (Lega)` },
        profile: { ECONOMY: 52, SOCIAL: 22, IMMIGRATION: 92, SECURITY: 85, ENVIRONMENT: 22, DEMOCRACY: 45, GLOBAL: 78, PUBLIC_SERVICES: 48 },
        description: { en: `Populist right. Very anti-immigration, Eurosceptic, law and order, soft on Russia.`, fr: `Droite populiste. Très anti-immigration, eurosceptique, ordre public, douce envers la Russie.` },
      },
      {
        id: `berlusconi`,
        image: `/images/candidates/berlusconi.svg`,
        name: `Silvio Berlusconi`,
        party: { en: `Forza Italia`, fr: `Forza Italia` },
        color: `#0066CC`,
        result: { en: `8.1% (Forza Italia)`, fr: `8,1 % (Forza Italia)` },
        profile: { ECONOMY: 72, SOCIAL: 35, IMMIGRATION: 68, SECURITY: 65, ENVIRONMENT: 38, DEMOCRACY: 55, GLOBAL: 38, PUBLIC_SERVICES: 38 },
        description: { en: `Centre-right. Pro-business, moderately Europhile, traditional social values.`, fr: `Centre-droit. Pro-entreprises, modérément europhile, valeurs sociales traditionnelles.` },
      },
    ],
  },

  // ── es_2023 ──────────────────────────────────────────────────────────────
  {
    id: `es_2023`,
    image: `https://commons.wikimedia.org/wiki/Special:FilePath/Palacio_Real_de_Madrid_-_01.jpg?width=1200`,
    title: { en: `Spanish General Election 2023`, fr: `Élections législatives espagnoles 2023` },
    country: `Spain`,
    flag: `🇪🇸`,
    year: 2023,
    description: {
      en: `Pedro Sánchez's PSOE narrowly formed a government after the July 2023 election resulted in a hung parliament. The PP won most seats but failed to secure a majority.`,
      fr: `Pedro Sánchez (PSOE) a formé de justesse un gouvernement après que les élections de juillet 2023 ont abouti à un parlement suspendu. Le PP a remporté le plus de sièges mais n'a pas réussi à obtenir une majorité.`,
    },
    context: {
      en: [
        `Spain uses proportional representation and has a constitutional monarchy. The country is divided into 17 autonomous communities, and regional politics (especially Catalan and Basque independence) shape national politics.`,
        `The July 2023 election was called early by Sánchez after his party lost regional elections. The result was a close race: PP won 137 seats, PSOE 121. Neither right (PP+Vox) nor left (PSOE+Sumar) had an outright majority.`,
        `Sánchez secured a second term through a controversial deal with Catalan and Basque nationalist parties, including an amnesty law for independence leaders — a major source of political tension.`,
      ],
      fr: [
        `L'Espagne utilise la représentation proportionnelle et est une monarchie constitutionnelle. Le pays est divisé en 17 communautés autonomes, et la politique régionale (notamment l'indépendance catalane et basque) façonne la politique nationale.`,
        `Les élections de juillet 2023 ont été déclenchées par Sánchez après que son parti a perdu les élections régionales. Le résultat était serré : le PP a remporté 137 sièges, le PSOE 121. Ni la droite ni la gauche n'avaient une majorité absolue.`,
        `Sánchez a obtenu un second mandat grâce à un accord controversé avec des partis nationalistes catalans et basques, incluant une loi d'amnistie pour les leaders indépendantistes.`,
      ],
    },
    deeperContext: {
      en: [
        `Spain's political landscape has fragmented since 2015. The old two-party system (PP vs PSOE) gave way to a four-or-five party system. Far-right Vox entered parliament in 2019; left-wing Sumar (successor to Podemos) holds the left flank.`,
        `Key issues:\n• Catalan independence — the most explosive fault line. PP and Vox firmly oppose; PSOE negotiates.\n• Cost of living — housing costs in cities have surged.\n• Labour reform — Sánchez reversed some PP-era labour market liberalisation.\n• EU funds — Spain received major NextGenerationEU money.\n• Migration — Spain is a major entry point for African migrants via the Canaries.`,
      ],
      fr: [
        `Le paysage politique espagnol s'est fragmenté depuis 2015. L'ancien bipartisme (PP vs PSOE) a cédé la place à un système à quatre ou cinq partis. Vox d'extrême droite est entré au parlement en 2019 ; Sumar de gauche occupe le flanc gauche.`,
        `Enjeux clés :\n• Indépendance catalane — la ligne de fracture la plus explosive.\n• Coût de la vie — les coûts de logement dans les villes ont explosé.\n• Réforme du travail — Sánchez a inversé certaines libéralisations du marché du travail de l'ère PP.\n• Fonds européens — l'Espagne a reçu de grands fonds NextGenerationEU.\n• Migration — l'Espagne est un point d'entrée majeur pour les migrants africains via les Canaries.`,
      ],
    },
    specificQuestions: [
      {
        id: `es_2023_q1`,
        text: { en: `Spain should give more autonomy and self-governance to its regions.`, fr: `L'Espagne devrait accorder plus d'autonomie et d'auto-gouvernance à ses régions.` },
        theme: `DEMOCRACY`, direction: 1,
        info: { en: `Spain's 17 autonomous communities already have significant powers, but Catalan and Basque nationalists want more. PP and Vox favour centralism; PSOE has negotiated with regionalists.`, fr: `Les 17 communautés autonomes d'Espagne ont déjà des pouvoirs significatifs, mais les nationalistes catalans et basques en veulent davantage. PP et Vox favorisent le centralisme.` },
        positions: { sanchez: 4, feijoo: 1, abascal: 1, diaz: 4 },
      },
      {
        id: `es_2023_q2`,
        text: { en: `Immigration to Spain should be more strictly controlled.`, fr: `L'immigration vers l'Espagne devrait être plus strictement contrôlée.` },
        theme: `IMMIGRATION`, direction: 1,
        info: { en: `Spain faces large irregular migration flows, especially via the Canary Islands. Vox demands a hard line; PSOE and Sumar favour managed legal pathways.`, fr: `L'Espagne fait face à d'importants flux migratoires irréguliers, notamment via les Îles Canaries. Vox exige une ligne dure ; PSOE et Sumar favorisent des voies légales gérées.` },
        positions: { sanchez: 2, feijoo: 4, abascal: 5, diaz: 1 },
      },
      {
        id: `es_2023_q3`,
        text: { en: `Spain should strengthen workers' rights and raise the minimum wage.`, fr: `L'Espagne devrait renforcer les droits des travailleurs et augmenter le salaire minimum.` },
        theme: `ECONOMY`, direction: -1,
        info: { en: `Sánchez raised Spain's minimum wage by over 50% between 2018 and 2023. Business groups complained; trade unions and the left saw it as essential for reducing inequality.`, fr: `Sánchez a augmenté le salaire minimum espagnol de plus de 50 % entre 2018 et 2023. Les groupes d'entreprises se sont plaints ; les syndicats et la gauche y voient une nécessité pour réduire les inégalités.` },
        positions: { sanchez: 4, feijoo: 2, abascal: 3, diaz: 5 },
      },
      {
        id: `es_2023_q4`,
        text: { en: `Spain should adopt an amnesty for those prosecuted for the 2017 Catalan independence referendum.`, fr: `L'Espagne devrait adopter une amnistie pour les personnes poursuivies pour le référendum d'indépendance catalan de 2017.` },
        theme: `DEMOCRACY`, direction: 1,
        info: { en: `Sánchez controversially agreed to an amnesty law for Catalan independence leaders in exchange for their parliamentary support. PP and Vox called it unconstitutional.`, fr: `Sánchez a accepté de manière controversée une loi d'amnistie pour les leaders indépendantistes catalans en échange de leur soutien parlementaire. PP et Vox l'ont jugé inconstitutionnel.` },
        positions: { sanchez: 5, feijoo: 1, abascal: 1, diaz: 4 },
      },
      {
        id: `es_2023_q5`,
        text: { en: `Spain should make large investments in renewable energy and phase out fossil fuels.`, fr: `L'Espagne devrait faire de grands investissements dans les énergies renouvelables et éliminer progressivement les combustibles fossiles.` },
        theme: `ENVIRONMENT`, direction: 1,
        info: { en: `Spain has excellent solar and wind resources. Sánchez positioned Spain as a European green energy hub. The right accepted renewable growth but opposed rushed fossil fuel phase-outs.`, fr: `L'Espagne dispose d'excellentes ressources solaires et éoliennes. Sánchez a positionné l'Espagne comme un hub européen d'énergie verte. La droite acceptait la croissance des renouvelables mais s'opposait à l'abandon précipité des fossiles.` },
        positions: { sanchez: 5, feijoo: 3, abascal: 1, diaz: 5 },
      },
      {
        id: `es_2023_q6`,
        text: { en: `The state should increase spending on public health and education.`, fr: `L'État devrait augmenter les dépenses de santé publique et d'éducation.` },
        theme: `PUBLIC_SERVICES`, direction: 1,
        info: { en: `Spain's public services recovered after severe austerity cuts in 2011–2014. PSOE and Sumar want further investment; PP argues for private sector involvement and fiscal sustainability.`, fr: `Les services publics espagnols se sont redressés après de sévères coupes d'austérité en 2011-2014. PSOE et Sumar veulent de nouveaux investissements ; PP plaide pour l'implication du secteur privé.` },
        positions: { sanchez: 4, feijoo: 2, abascal: 2, diaz: 5 },
      },
      {
        id: `es_2023_q7`,
        text: { en: `Spain should introduce stricter regulation of the housing market to reduce rental costs.`, fr: `L'Espagne devrait introduire une réglementation plus stricte du marché immobilier pour réduire les coûts locatifs.` },
        theme: `PUBLIC_SERVICES`, direction: 1,
        info: { en: `Housing costs in Spanish cities have surged. The 2023 housing law introduced rent controls; the PP and property sector opposed it.`, fr: `Les coûts du logement dans les villes espagnoles ont explosé. La loi sur le logement de 2023 a introduit des contrôles des loyers ; le PP et le secteur immobilier s'y sont opposés.` },
        positions: { sanchez: 4, feijoo: 1, abascal: 2, diaz: 5 },
      },
      {
        id: `es_2023_q8`,
        text: { en: `Spain should maintain traditional family values in law and education.`, fr: `L'Espagne devrait maintenir les valeurs familiales traditionnelles dans la loi et l'éducation.` },
        theme: `SOCIAL`, direction: -1,
        info: { en: `Spain legalised same-sex marriage in 2005 under Zapatero. Vox advocates rolling back LGBTQ+ rights; the left opposes any reversal.`, fr: `L'Espagne a légalisé le mariage homosexuel en 2005 sous Zapatero. Vox défend un retour en arrière sur les droits LGBTQ+ ; la gauche s'y oppose.` },
        positions: { sanchez: 1, feijoo: 3, abascal: 5, diaz: 1 },
      },
    ],
    candidates: [
      {
        id: `sanchez`,
        image: `/images/candidates/sanchez.svg`,
        name: `Pedro Sánchez`,
        party: { en: `PSOE`, fr: `PSOE` },
        color: `#CC0000`,
        result: { en: `Winner (coalition) — PSOE 121 seats`, fr: `Gagnant (coalition) — PSOE 121 sièges` },
        profile: { ECONOMY: 32, SOCIAL: 82, IMMIGRATION: 22, SECURITY: 40, ENVIRONMENT: 72, DEMOCRACY: 80, GLOBAL: 20, PUBLIC_SERVICES: 78 },
        description: { en: `Social democrat. Pro-EU, pro-renewable energy, labour rights, negotiations with regionalists.`, fr: `Social-démocrate. Pro-UE, pro-énergies renouvelables, droits du travail, négociations avec les régionalistes.` },
      },
      {
        id: `feijoo`,
        image: `/images/candidates/feijoo.svg`,
        name: `Alberto Núñez Feijóo`,
        party: { en: `Partido Popular`, fr: `Partido Popular` },
        color: `#0066CC`,
        result: { en: `PP 137 seats (largest party, no majority)`, fr: `PP 137 sièges (premier parti, sans majorité)` },
        profile: { ECONOMY: 68, SOCIAL: 42, IMMIGRATION: 58, SECURITY: 68, ENVIRONMENT: 48, DEMOCRACY: 72, GLOBAL: 35, PUBLIC_SERVICES: 45 },
        description: { en: `Conservative. Pro-business, Europhile, moderate on social issues, centralised state.`, fr: `Conservateur. Pro-entreprises, europhile, modéré socialement, État centralisé.` },
      },
      {
        id: `abascal`,
        image: `/images/candidates/abascal.svg`,
        name: `Santiago Abascal`,
        party: { en: `Vox`, fr: `Vox` },
        color: `#63BE21`,
        result: { en: `Vox 33 seats`, fr: `Vox 33 sièges` },
        profile: { ECONOMY: 58, SOCIAL: 12, IMMIGRATION: 92, SECURITY: 88, ENVIRONMENT: 18, DEMOCRACY: 38, GLOBAL: 82, PUBLIC_SERVICES: 32 },
        description: { en: `Far-right nationalist. Against Catalan autonomy, very anti-immigration, very conservative socially.`, fr: `Nationaliste d'extrême droite. Contre l'autonomie catalane, très anti-immigration, très conservateur socialement.` },
      },
      {
        id: `diaz_es`,
        image: `/images/candidates/diaz_es.svg`,
        name: `Yolanda Díaz`,
        party: { en: `Sumar`, fr: `Sumar` },
        color: `#AC145A`,
        result: { en: `Sumar 31 seats`, fr: `Sumar 31 sièges` },
        profile: { ECONOMY: 18, SOCIAL: 88, IMMIGRATION: 15, SECURITY: 28, ENVIRONMENT: 82, DEMOCRACY: 82, GLOBAL: 22, PUBLIC_SERVICES: 88 },
        description: { en: `Left-wing feminist. Strong welfare, workers' rights, green transition, feminist, pro-immigration.`, fr: `Gauche féministe. Welfare fort, droits des travailleurs, transition verte, féministe, pro-immigration.` },
      },
    ],
  },

  // ── uk_2024 ──────────────────────────────────────────────────────────────
  {
    id: `uk_2024`,
    image: `https://commons.wikimedia.org/wiki/Special:FilePath/Houses.of.parliament.overall.arp.jpg?width=1200`,
    title: { en: `UK General Election 2024`, fr: `Élections législatives britanniques 2024` },
    country: `United Kingdom`,
    flag: `🇬🇧`,
    year: 2024,
    description: {
      en: `Labour under Keir Starmer won a landslide majority in July 2024, ending 14 years of Conservative government. The Conservatives suffered their worst result since 1832.`,
      fr: `Le Labour de Keir Starmer a remporté une majorité écrasante en juillet 2024, mettant fin à 14 ans de gouvernement conservateur. Les Conservateurs ont subi leur pire résultat depuis 1832.`,
    },
    context: {
      en: [
        `The United Kingdom uses a first-past-the-post electoral system where the party winning the most seats in each constituency forms the government. This produces large parliamentary majorities from moderate vote shares.`,
        `The 2024 election was called by Conservative PM Rishi Sunak. After 14 years of Conservative rule marked by Brexit, COVID-19, Boris Johnson's scandals, Liz Truss's disastrous mini-budget, and economic stagnation, the party suffered a historic collapse.`,
        `Labour won 412 seats (34% of the vote). Conservatives fell to 121 seats (24%). Reform UK under Nigel Farage won 4 seats but 14% of the vote. Lib Dems surged to 72 seats despite only 12% of votes.`,
      ],
      fr: [
        `Le Royaume-Uni utilise un système majoritaire uninominal à un tour où le parti remportant le plus de circonscriptions forme le gouvernement. Cela produit de grandes majorités parlementaires à partir de parts de votes modérées.`,
        `Les élections de 2024 ont été déclenchées par le Premier ministre conservateur Rishi Sunak. Après 14 ans de gouvernement conservateur marqués par le Brexit, la COVID-19, les scandales de Boris Johnson, le mini-budget désastreux de Liz Truss et la stagnation économique, le parti a subi un effondrement historique.`,
        `Le Labour a remporté 412 sièges (34 % des voix). Les Conservateurs sont tombés à 121 sièges (24 %). Reform UK de Nigel Farage a remporté 4 sièges mais 14 % des voix. Les Lib Dems ont bondi à 72 sièges malgré seulement 12 % des voix.`,
      ],
    },
    deeperContext: {
      en: [
        `Brexit reshaped UK politics fundamentally. The Leave/Remain divide cut across the old class-based Labour/Conservative split. Post-Brexit Britain struggled with trade friction, labour shortages, and a cost of living crisis.`,
        `Key parties:\n• Labour — Centre-left. Starmer moved Labour to the moderate centre after Corbyn's hard-left period. NHS investment, workers' rights, clean energy transition.\n• Conservative — Centre-right. Traditionally pro-business, small state, Brexit. Collapsed in 2024 after internal chaos.\n• Reform UK — Hard-right populist. Anti-immigration, anti-net zero, Eurosceptic. Took votes from soft Conservatives.\n• Liberal Democrats — Social-liberal centrist. Pro-Remain, pro-NHS, environmental. Strong in suburban Tory seats.\n• SNP (Scotland) — Scottish nationalist, centre-left. Advocates Scottish independence.`,
      ],
      fr: [
        `Le Brexit a profondément reconfiguré la politique britannique. La division Leave/Remain a traversé l'ancien clivage de classe Labour/Conservateurs. La Grande-Bretagne post-Brexit a souffert des frictions commerciales, des pénuries de main-d'œuvre et d'une crise du coût de la vie.`,
        `Partis clés :\n• Labour — Centre-gauche. Starmer a ramené le Labour au centre modéré après la période de gauche dure de Corbyn.\n• Conservateurs — Centre-droit. Traditionnellement pro-business, petit État, Brexit. Effondré en 2024.\n• Reform UK — Populiste de droite dure. Anti-immigration, anti-zéro net, eurosceptique.\n• Lib Dems — Centriste social-libéral. Pro-Remain, pro-NHS, environnemental.\n• SNP (Écosse) — Nationaliste écossais, centre-gauche. Défend l'indépendance de l'Écosse.`,
      ],
    },
    specificQuestions: [
      {
        id: `uk_2024_q1`,
        text: { en: `The UK should invest significantly more in the NHS to reduce waiting lists.`, fr: `Le Royaume-Uni devrait investir significativement plus dans le NHS pour réduire les listes d'attente.` },
        theme: `PUBLIC_SERVICES`, direction: 1,
        info: { en: `NHS waiting lists reached record highs under the Conservatives. Starmer made NHS reform his central promise. All parties agreed on the problem but differed on solutions.`, fr: `Les listes d'attente du NHS ont atteint des niveaux records sous les Conservateurs. Starmer a fait de la réforme du NHS sa promesse centrale. Tous les partis s'accordaient sur le problème mais divergeaient sur les solutions.` },
        positions: { starmer: 5, sunak: 3, davey: 5, farage: 3 },
      },
      {
        id: `uk_2024_q2`,
        text: { en: `Immigration to the UK should be significantly reduced.`, fr: `L'immigration vers le Royaume-Uni devrait être significativement réduite.` },
        theme: `IMMIGRATION`, direction: 1,
        info: { en: `Net migration hit record highs under the Conservatives despite their pledges to reduce it. Reform made it a central issue; Labour promised managed reduction.`, fr: `La migration nette a atteint des niveaux records sous les Conservateurs malgré leurs promesses de la réduire. Reform en a fait un enjeu central ; le Labour promettait une réduction gérée.` },
        positions: { starmer: 3, sunak: 4, davey: 2, farage: 5 },
      },
      {
        id: `uk_2024_q3`,
        text: { en: `The UK should reach net zero carbon emissions well before 2050.`, fr: `Le Royaume-Uni devrait atteindre la neutralité carbone bien avant 2050.` },
        theme: `ENVIRONMENT`, direction: 1,
        info: { en: `The UK had a legally binding net zero target for 2050. Starmer and Davey wanted to accelerate; Sunak weakened near-term targets; Farage called net zero "a disaster."`, fr: `Le Royaume-Uni avait un objectif légalement contraignant de zéro net pour 2050. Starmer et Davey voulaient accélérer ; Sunak a assoupli les objectifs à court terme ; Farage a qualifié le zéro net de "désastre".` },
        positions: { starmer: 4, sunak: 2, davey: 5, farage: 1 },
      },
      {
        id: `uk_2024_q4`,
        text: { en: `The UK should raise taxes on high earners and corporations to fund public services.`, fr: `Le Royaume-Uni devrait augmenter les impôts sur les hauts revenus et les entreprises pour financer les services publics.` },
        theme: `ECONOMY`, direction: -1,
        info: { en: `After a decade of austerity, public services were strained. Labour proposed modest tax rises on business and non-doms; Conservatives promised to cut taxes; Reform promised large cuts.`, fr: `Après une décennie d'austérité, les services publics étaient fragilisés. Le Labour proposait des hausses modestes d'impôts sur les entreprises ; les Conservateurs promettaient des baisses.` },
        positions: { starmer: 4, sunak: 1, davey: 4, farage: 1 },
      },
      {
        id: `uk_2024_q5`,
        text: { en: `The UK should strengthen its relationship with the European Union.`, fr: `Le Royaume-Uni devrait renforcer sa relation avec l'Union européenne.` },
        theme: `GLOBAL`, direction: -1,
        info: { en: `Post-Brexit Britain struggled with trade barriers with the EU. Starmer wanted a closer relationship (veterinary agreement, security cooperation) without rejoining the single market.`, fr: `La Grande-Bretagne post-Brexit souffrait de barrières commerciales avec l'UE. Starmer voulait une relation plus étroite sans rejoindre le marché unique.` },
        positions: { starmer: 4, sunak: 2, davey: 5, farage: 1 },
      },
      {
        id: `uk_2024_q6`,
        text: { en: `The government should build significantly more housing to address the affordability crisis.`, fr: `Le gouvernement devrait construire beaucoup plus de logements pour répondre à la crise d'accessibilité.` },
        theme: `PUBLIC_SERVICES`, direction: 1,
        info: { en: `UK house prices and rents surged to record unaffordability. Starmer promised 1.5 million homes in five years through planning reform. Local opposition to development is fierce.`, fr: `Les prix de l'immobilier et les loyers au Royaume-Uni ont atteint des niveaux d'inaccessibilité records. Starmer a promis 1,5 million de logements en cinq ans par la réforme de l'urbanisme.` },
        positions: { starmer: 5, sunak: 3, davey: 4, farage: 3 },
      },
      {
        id: `uk_2024_q7`,
        text: { en: `Workers' rights should be significantly strengthened, including stronger rights to strike.`, fr: `Les droits des travailleurs devraient être significativement renforcés, notamment les droits de grève.` },
        theme: `ECONOMY`, direction: -1,
        info: { en: `The Conservatives passed legislation restricting strike action. Labour's first major legislation reversed this and strengthened workers' rights significantly.`, fr: `Les Conservateurs ont adopté une législation restreignant les grèves. La première grande législation du Labour a inversé cela et renforcé significativement les droits des travailleurs.` },
        positions: { starmer: 5, sunak: 1, davey: 4, farage: 1 },
      },
      {
        id: `uk_2024_q8`,
        text: { en: `The UK should maintain strong defence commitments and NATO membership.`, fr: `Le Royaume-Uni devrait maintenir de solides engagements de défense et l'appartenance à l'OTAN.` },
        theme: `SECURITY`, direction: 1,
        info: { en: `All mainstream parties backed NATO and Ukraine support. Farage caused controversy by suggesting NATO provoked Russia; he later reversed his position.`, fr: `Tous les partis du courant principal soutenaient l'OTAN et le soutien à l'Ukraine. Farage a provoqué la controverse en suggérant que l'OTAN avait provoqué la Russie.` },
        positions: { starmer: 5, sunak: 5, davey: 5, farage: 3 },
      },
      {
        id: `uk_2024_q9`,
        text: { en: `The UK should introduce proportional representation to replace first-past-the-post elections.`, fr: `Le Royaume-Uni devrait introduire la représentation proportionnelle pour remplacer le scrutin majoritaire uninominal.` },
        theme: `DEMOCRACY`, direction: 1,
        info: { en: `First-past-the-post produces disproportionate results. In 2024, Reform won 14% but 4 seats; Lib Dems won 12% but 72 seats. Electoral reform is backed by smaller parties and opposed by the two big ones.`, fr: `Le scrutin uninominal produit des résultats disproportionnés. En 2024, Reform a remporté 14 % mais 4 sièges ; les Lib Dems 12 % mais 72 sièges. La réforme électorale est soutenue par les petits partis.` },
        positions: { starmer: 2, sunak: 1, davey: 5, farage: 3 },
      },
      {
        id: `uk_2024_q10`,
        text: { en: `The UK should ban new oil and gas licences in the North Sea.`, fr: `Le Royaume-Uni devrait interdire les nouvelles licences pétrolières et gazières en mer du Nord.` },
        theme: `ENVIRONMENT`, direction: 1,
        info: { en: `Starmer controversially (from the left) granted some North Sea licences while committing to no new coal. Davey called for a complete ban; Farage and Sunak backed continued extraction.`, fr: `Starmer a accordé de manière controversée (de la gauche) certaines licences en mer du Nord tout en s'engageant à ne pas ouvrir de nouvelles mines de charbon. Davey réclamait une interdiction totale.` },
        positions: { starmer: 3, sunak: 1, davey: 5, farage: 1 },
      },
    ],
    candidates: [
      {
        id: `starmer`,
        image: `/images/candidates/starmer.svg`,
        name: `Keir Starmer`,
        party: { en: `Labour Party`, fr: `Parti travailliste` },
        color: `#E4003B`,
        result: { en: `Winner — Labour 412 seats`, fr: `Gagnant — Labour 412 sièges` },
        profile: { ECONOMY: 38, SOCIAL: 78, IMMIGRATION: 45, SECURITY: 52, ENVIRONMENT: 72, DEMOCRACY: 78, GLOBAL: 28, PUBLIC_SERVICES: 72 },
        description: { en: `Centre-left. NHS investment, workers' rights, closer EU ties, clean energy, moderate immigration.`, fr: `Centre-gauche. Investissement dans le NHS, droits des travailleurs, liens UE plus étroits, énergie propre, immigration modérée.` },
      },
      {
        id: `sunak`,
        image: `/images/candidates/sunak.svg`,
        name: `Rishi Sunak`,
        party: { en: `Conservative Party`, fr: `Parti conservateur` },
        color: `#003087`,
        result: { en: `Conservatives 121 seats (historic defeat)`, fr: `Conservateurs 121 sièges (défaite historique)` },
        profile: { ECONOMY: 72, SOCIAL: 42, IMMIGRATION: 62, SECURITY: 68, ENVIRONMENT: 50, DEMOCRACY: 65, GLOBAL: 40, PUBLIC_SERVICES: 38 },
        description: { en: `Conservative. Pro-business, fiscal conservatism, tough on immigration, post-Brexit sovereignty.`, fr: `Conservateur. Pro-entreprises, conservatisme fiscal, ferme sur l'immigration, souveraineté post-Brexit.` },
      },
      {
        id: `davey`,
        image: `/images/candidates/davey.svg`,
        name: `Ed Davey`,
        party: { en: `Liberal Democrats`, fr: `Libéraux-démocrates` },
        color: `#FAA61A`,
        result: { en: `Lib Dems 72 seats (major surge)`, fr: `Lib Dems 72 sièges (forte progression)` },
        profile: { ECONOMY: 55, SOCIAL: 78, IMMIGRATION: 28, SECURITY: 45, ENVIRONMENT: 78, DEMOCRACY: 88, GLOBAL: 18, PUBLIC_SERVICES: 62 },
        description: { en: `Social-liberal. Pro-EU alignment, NHS, proportional representation, climate ambition, civil liberties.`, fr: `Social-libéral. Alignement pro-UE, NHS, représentation proportionnelle, ambition climatique, libertés civiles.` },
      },
      {
        id: `farage`,
        image: `/images/candidates/farage.svg`,
        name: `Nigel Farage`,
        party: { en: `Reform UK`, fr: `Reform UK` },
        color: `#12B6CF`,
        result: { en: `Reform UK 4 seats (14% of votes)`, fr: `Reform UK 4 sièges (14 % des voix)` },
        profile: { ECONOMY: 60, SOCIAL: 22, IMMIGRATION: 92, SECURITY: 80, ENVIRONMENT: 18, DEMOCRACY: 45, GLOBAL: 88, PUBLIC_SERVICES: 32 },
        description: { en: `Hard-right populist. Anti-immigration, anti-net zero, Eurosceptic, anti-establishment.`, fr: `Populiste de droite dure. Anti-immigration, anti-zéro net, eurosceptique, anti-establishment.` },
      },
    ],
  },
];
