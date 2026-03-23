/**
 * Concrete policy context shown on CandidateProfile when the user's position
 * is close to a candidate's on a given theme (diff < 28).
 *
 * Applies ONLY to targeted elections: fr_2022, fr_2027, paris_2026, us_2020.
 * Policies are based on well-known, publicly stated positions — no speculation.
 */

export const POLICY_ELECTION_IDS = new Set(['fr_2022', 'fr_2027', 'paris_2026', 'us_2020']);

export const CANDIDATE_POLICIES = {

  // ── FRANCE 2022 ────────────────────────────────────────────────────────────

  macron: {
    ECONOMY: {
      fr: `Macron défend une économie de marché régulée avec des réformes structurelles : réforme des retraites, flexibilisation du marché du travail et politique de plein emploi. Il a lancé un plan de réindustrialisation avec des investissements publics ciblés.`,
      en: `Macron supports a regulated market economy with structural reforms: pension reform, labour market flexibility and a full-employment policy. He launched a reindustrialisation plan with targeted public investment.`,
    },
    SOCIAL: {
      fr: `Macron défend une approche laïque et républicaine, soutenant les droits civiques et les libertés individuelles sans promouvoir d'agenda communautaire. Il s'est appuyé sur le dialogue social tout en maintenant des réformes impopulaires.`,
      en: `Macron supports a secular, republican approach — defending civil rights and individual freedoms without promoting communitarian agendas. He has relied on social dialogue while pushing through unpopular reforms.`,
    },
    IMMIGRATION: {
      fr: `Il défend une politique migratoire européenne coordonnée, avec renforcement des frontières Schengen et accords de réadmission. Il s'oppose à la fois à une ouverture totale et à une fermeture nationaliste des frontières.`,
      en: `He supports a coordinated European migration policy, with stronger Schengen borders and readmission agreements. He opposes both fully open borders and nationalist border closure.`,
    },
    SECURITY: {
      fr: `Son gouvernement a augmenté les effectifs de police et renforcé les moyens de la justice. Il défend l'État de droit et la présomption d'innocence, tout en soutenant les forces de l'ordre.`,
      en: `His government increased police staffing and strengthened judicial resources. He defends the rule of law and presumption of innocence, while supporting law enforcement.`,
    },
    ENVIRONMENT: {
      fr: `Macron a lancé la Convention citoyenne pour le Climat et défend les objectifs européens de neutralité carbone d'ici 2050. Il maintient le nucléaire comme pilier d'une énergie décarbonée.`,
      en: `Macron launched the Citizens' Convention on Climate and supports European carbon-neutrality targets by 2050. He keeps nuclear power as a pillar of decarbonised energy.`,
    },
    DEMOCRACY: {
      fr: `Il a proposé une dose de proportionnelle aux élections législatives. Il défend la démocratie représentative tout en s'appuyant ponctuellement sur des consultations citoyennes comme les conventions citoyennes.`,
      en: `He proposed introducing a degree of proportional representation in legislative elections. He defends representative democracy while using occasional citizen consultations.`,
    },
    GLOBAL: {
      fr: `Macron est le principal promoteur de la souveraineté stratégique européenne. Il défend un multilatéralisme actif et une Europe capable d'agir de façon autonome sur la scène internationale.`,
      en: `Macron is the main advocate of European strategic sovereignty. He supports active multilateralism and an EU capable of acting autonomously on the world stage.`,
    },
    PUBLIC_SERVICES: {
      fr: `Il a défendu une modernisation de la fonction publique tout en maintenant un système de protection sociale étendu. La réforme de l'assurance-chômage et des retraites visait à rééquilibrer les finances publiques.`,
      en: `He advocated modernising the civil service while maintaining a broad social protection system. Unemployment insurance and pension reforms aimed to rebalance public finances.`,
    },
  },

  lepen: {
    ECONOMY: {
      fr: `Le Pen propose la priorité nationale dans les marchés publics et les aides sociales, ainsi qu'une baisse de TVA sur les produits de première nécessité. Elle défend le retour à la retraite à 60 ans pour les carrières longues.`,
      en: `Le Pen proposes giving national priority in public contracts and social benefits, along with a VAT cut on essential goods. She supports restoring retirement at 60 for long careers.`,
    },
    SOCIAL: {
      fr: `Elle défend des valeurs traditionnelles sur la famille, s'oppose à la PMA pour les couples homosexuels et critique les politiques de genre dans l'éducation. Elle est favorable à un référendum sur les grandes questions de société.`,
      en: `She holds traditional family values, opposes PMA for same-sex couples, and criticises gender policies in education. She supports holding referendums on major social questions.`,
    },
    IMMIGRATION: {
      fr: `Le Pen propose un strict contrôle de l'immigration, un référendum sur le droit du sol et la priorité nationale dans l'accès aux droits sociaux. Elle défend l'expulsion systématique des étrangers en situation irrégulière.`,
      en: `Le Pen proposes strict immigration control, a referendum on birthright citizenship, and national priority in social rights. She supports systematic expulsion of undocumented migrants.`,
    },
    SECURITY: {
      fr: `Elle prône la tolérance zéro face à la criminalité, le recrutement massif de policiers et un durcissement des peines pour les récidivistes. Elle défend les forces de l'ordre contre tout discours de défiance.`,
      en: `She advocates zero tolerance on crime, mass police recruitment, and harsher sentences for repeat offenders. She defends law enforcement against any discourse of distrust.`,
    },
    ENVIRONMENT: {
      fr: `Le Pen s'oppose à l'éolien terrestre et défend une transition énergétique progressive qui préserve le pouvoir d'achat. Elle soutient le nucléaire comme colonne vertébrale de la politique énergétique française.`,
      en: `Le Pen opposes onshore wind farms and defends a gradual energy transition that preserves purchasing power. She supports nuclear power as the backbone of French energy policy.`,
    },
    DEMOCRACY: {
      fr: `Elle défend le référendum d'initiative populaire (RIP) comme outil de démocratie directe. Elle veut donner la primauté à la loi française sur le droit européen dans de nombreux domaines.`,
      en: `She supports the people's initiative referendum (RIP) as a direct democracy tool. She wants French law to take precedence over European law in many areas.`,
    },
    GLOBAL: {
      fr: `Souverainiste convaincue, elle veut renégocier les traités européens et réduire l'emprise de l'UE sur la législation française. Elle s'oppose aux traités de libre-échange qu'elle juge défavorables aux travailleurs.`,
      en: `A committed sovereignist, she wants to renegotiate European treaties and reduce EU influence over French legislation. She opposes free-trade agreements she deems harmful to workers.`,
    },
    PUBLIC_SERVICES: {
      fr: `Elle défend le maintien des services publics de proximité en zones rurales (hôpitaux, La Poste). Elle propose la priorité nationale dans l'accès aux aides sociales et aux logements sociaux.`,
      en: `She defends maintaining local public services in rural areas (hospitals, post offices). She proposes national priority in access to social benefits and social housing.`,
    },
  },

  melenchon: {
    ECONOMY: {
      fr: `Mélenchon propose une planification écologique avec nationalisation des secteurs stratégiques (énergie, banques). Il défend une hausse significative du SMIC et la semaine de 32 heures.`,
      en: `Mélenchon proposes ecological planning with nationalisation of strategic sectors (energy, banks). He supports a significant rise in the minimum wage and a 32-hour working week.`,
    },
    SOCIAL: {
      fr: `Il défend une laïcité inclusive, les droits LGBT+, la PMA pour toutes et l'égalité femmes-hommes. Il est favorable à la légalisation du cannabis à usage récréatif.`,
      en: `He supports inclusive secularism, LGBT+ rights, assisted reproduction for all, and gender equality. He backs legalising recreational cannabis.`,
    },
    IMMIGRATION: {
      fr: `Il défend une politique humaniste avec régularisation des sans-papiers et accueil des réfugiés. Il s'oppose aux expulsions et au durcissement du droit d'asile.`,
      en: `He supports a humanitarian policy including regularisation of undocumented migrants and welcoming refugees. He opposes deportations and tightening of asylum rights.`,
    },
    SECURITY: {
      fr: `Il critique les dérives sécuritaires et défend les libertés civiles face aux abus. Il propose une police de proximité et une réforme de la justice pour plus d'équité.`,
      en: `He criticises security overreach and defends civil liberties against abuses. He proposes neighbourhood policing and a justice reform for greater equity.`,
    },
    ENVIRONMENT: {
      fr: `Il défend la « bifurcation écologique » avec une règle verte inscrite dans la Constitution. Il propose la sortie progressive du nucléaire et un investissement massif dans les énergies renouvelables.`,
      en: `He supports "ecological bifurcation" with a green rule enshrined in the Constitution. He proposes a gradual nuclear phase-out and massive investment in renewables.`,
    },
    DEMOCRACY: {
      fr: `Il propose une 6e République avec une assemblée constituante élue. Il défend la proportionnelle intégrale et le référendum d'initiative citoyenne (RIC).`,
      en: `He proposes a Sixth Republic with an elected constituent assembly. He supports full proportional representation and the citizens' initiative referendum (RIC).`,
    },
    GLOBAL: {
      fr: `Il est favorable à la sortie du commandement intégré de l'OTAN et défend un multilatéralisme refondé sans hégémonie. Il s'oppose aux traités de libre-échange et défend la souveraineté alimentaire.`,
      en: `He supports leaving NATO's integrated command and backs a reformed multilateralism without hegemony. He opposes free-trade treaties and defends food sovereignty.`,
    },
    PUBLIC_SERVICES: {
      fr: `Il défend la gratuité des services essentiels (santé, éducation, transports en commun). Il propose la nationalisation de l'énergie et de l'eau comme biens communs.`,
      en: `He supports free essential services (healthcare, education, public transport). He proposes nationalising energy and water as public goods.`,
    },
  },

  zemmour: {
    ECONOMY: {
      fr: `Zemmour défend des baisses d'impôts pour les entreprises et les classes moyennes, et une réduction des dépenses publiques. Il est favorable à une économie de marché libérale avec moins d'intervention de l'État.`,
      en: `Zemmour supports tax cuts for businesses and the middle class, and a reduction in public spending. He backs a liberal market economy with less state intervention.`,
    },
    SOCIAL: {
      fr: `Il défend des valeurs traditionnelles, s'oppose à la PMA pour toutes, aux politiques de genre et à l'idéologie woke dans l'éducation. Il est hostile aux évolutions progressistes récentes.`,
      en: `He holds traditional values, opposes assisted reproduction for all, gender policies and "woke" ideology in education. He is hostile to recent progressive social changes.`,
    },
    IMMIGRATION: {
      fr: `Zemmour propose une immigration quasi nulle, un référendum sur le droit du sol et un programme de « remigration » des étrangers en situation irrégulière. C'est sa principale priorité politique.`,
      en: `Zemmour proposes near-zero immigration, a referendum on birthright citizenship and a "remigration" programme for undocumented migrants. It is his central political priority.`,
    },
    SECURITY: {
      fr: `Il prône une ligne très dure : peines minimales plancher, durcissement de la justice pénale et tolérance zéro. Il défend les forces de l'ordre et critique toute remise en cause de leur autorité.`,
      en: `He advocates a very hard line: minimum mandatory sentences, tougher criminal justice and zero tolerance. He defends law enforcement and rejects any questioning of their authority.`,
    },
    ENVIRONMENT: {
      fr: `Il est sceptique face aux politiques climatiques et s'oppose à l'éolien. Il soutient le nucléaire et défend une transition écologique très progressive qui ne pénalise pas l'économie.`,
      en: `He is sceptical of climate policies and opposes wind farms. He supports nuclear power and backs a very gradual green transition that does not penalise the economy.`,
    },
    DEMOCRACY: {
      fr: `Il défend un exécutif fort et est critique des contre-pouvoirs institutionnels, de la justice indépendante et des médias. Il veut la primauté de la Constitution française sur le droit européen.`,
      en: `He favours a strong executive and is critical of institutional checks, independent courts and media. He wants French constitutional law to take precedence over EU law.`,
    },
    GLOBAL: {
      fr: `Il est nationaliste et souverainiste, prônant une rupture avec le cadre européen si nécessaire. Il est hostile aux traités de libre-échange et défend une France indépendante sur la scène mondiale.`,
      en: `He is a nationalist and sovereignist, ready to break with the European framework if needed. He opposes free-trade deals and defends an independent France on the world stage.`,
    },
    PUBLIC_SERVICES: {
      fr: `Il défend une réduction de l'État-providence universel et la réservation des aides sociales aux nationaux. Il est hostile à l'universalisme des prestations sociales qu'il juge coûteux.`,
      en: `He supports reducing the universal welfare state and restricting social benefits to nationals. He is hostile to universal social entitlements which he considers too costly.`,
    },
  },

  jadot: {
    ECONOMY: {
      fr: `Jadot défend une économie orientée vers la transition écologique, avec investissements verts massifs et une taxe carbone. Il propose un revenu universel et une réforme fiscale pour taxer les patrimoines.`,
      en: `Jadot supports an economy oriented towards the green transition, with massive green investment and a carbon tax. He proposes a universal income and a wealth-based tax reform.`,
    },
    SOCIAL: {
      fr: `Il est progressiste sur toutes les questions de société : droits LGBT+, PMA pour toutes, égalité femmes-hommes. Il défend une laïcité ouverte et la dépénalisation du cannabis.`,
      en: `He is progressive on all social issues: LGBT+ rights, assisted reproduction for all, gender equality. He supports an open secularism and decriminalising cannabis.`,
    },
    IMMIGRATION: {
      fr: `Il défend une politique migratoire humaniste, l'accueil des réfugiés climatiques et la régularisation des sans-papiers. Il s'oppose aux politiques de dissuasion aux frontières.`,
      en: `He supports a humanitarian migration policy, welcoming climate refugees and regularising undocumented migrants. He opposes border deterrence policies.`,
    },
    ENVIRONMENT: {
      fr: `L'écologie est au cœur de son programme : sortie du nucléaire, des énergies fossiles, agriculture biologique et alimentation durable. Il défend une règle verte dans la Constitution.`,
      en: `Ecology is at the heart of his programme: phasing out nuclear and fossil fuels, organic farming and sustainable food. He supports a green rule in the Constitution.`,
    },
    DEMOCRACY: {
      fr: `Il défend la proportionnelle et un renforcement des pouvoirs du Parlement. Il est favorable à des référendums citoyens et à une réforme démocratique profonde des institutions.`,
      en: `He supports proportional representation and strengthening parliamentary powers. He backs citizens' referendums and deep democratic institutional reform.`,
    },
    GLOBAL: {
      fr: `Il défend l'UE et un multilatéralisme fort. Il s'oppose aux traités de libre-échange qui ne respectent pas les normes sociales et environnementales.`,
      en: `He supports the EU and strong multilateralism. He opposes free-trade deals that fail to meet social and environmental standards.`,
    },
    PUBLIC_SERVICES: {
      fr: `Il défend des services publics accessibles à tous, notamment dans la santé et l'éducation. Il propose un service public de l'énergie et des transports décarbonés.`,
      en: `He supports public services accessible to all, especially in healthcare and education. He proposes a public energy service and decarbonised transport.`,
    },
    SECURITY: {
      fr: `Il défend les libertés civiles et s'oppose à une dérive sécuritaire. Il est critique de la surveillance de masse et défend les droits fondamentaux.`,
      en: `He defends civil liberties and opposes security overreach. He is critical of mass surveillance and defends fundamental rights.`,
    },
  },

  hidalgo: {
    ECONOMY: {
      fr: `Hidalgo défend un modèle social-démocrate avec redistribution, investissement public et réduction des inégalités. Elle propose une réforme fiscale progressive et une hausse du SMIC.`,
      en: `Hidalgo supports a social-democratic model with redistribution, public investment and reducing inequality. She proposes progressive tax reform and a minimum wage increase.`,
    },
    SOCIAL: {
      fr: `Elle défend les droits des femmes, des LGBT+ et une politique active d'égalité. Elle soutient la PMA pour toutes et une laïcité ouverte au dialogue.`,
      en: `She defends women's and LGBT+ rights and an active equality policy. She supports assisted reproduction for all and an open, dialogical secularism.`,
    },
    IMMIGRATION: {
      fr: `Elle est favorable à une politique d'accueil et d'intégration. En tant que maire de Paris, elle a soutenu les politiques d'hébergement des migrants et réfugiés.`,
      en: `She supports welcoming and integration policies. As Mayor of Paris, she backed housing policies for migrants and refugees.`,
    },
    ENVIRONMENT: {
      fr: `Elle défend des politiques environnementales ambitieuses, comme à Paris avec les pistes cyclables et la restriction des voitures polluantes. Elle est favorable à une sortie du nucléaire à terme.`,
      en: `She defends ambitious environmental policies, as in Paris with cycling lanes and restricting polluting vehicles. She supports an eventual nuclear phase-out.`,
    },
    PUBLIC_SERVICES: {
      fr: `Elle défend des services publics forts et s'est opposée aux privatisations. Elle a investi massivement dans les crèches, logements sociaux et services de proximité à Paris.`,
      en: `She defends strong public services and opposed privatisation. She invested heavily in crèches, social housing and local services in Paris.`,
    },
    GLOBAL: {
      fr: `Elle est pro-européenne et défend le multilatéralisme et les accords climatiques internationaux. Elle milite pour une gouvernance mondiale plus juste.`,
      en: `She is pro-European and defends multilateralism and international climate agreements. She advocates fairer global governance.`,
    },
    DEMOCRACY: {
      fr: `Elle défend la proportionnelle et une meilleure représentation des citoyens dans les institutions. Elle est favorable aux budgets participatifs comme expérimentés à Paris.`,
      en: `She supports proportional representation and better citizen representation in institutions. She backs participatory budgets as pioneered in Paris.`,
    },
    SECURITY: {
      fr: `Elle défend une approche équilibrée alliant prévention sociale et maintien de l'ordre. Elle s'oppose au « tout répressif » et défend les libertés civiles.`,
      en: `She supports a balanced approach combining social prevention and law enforcement. She opposes purely punitive approaches and defends civil liberties.`,
    },
  },

  pecresse: {
    ECONOMY: {
      fr: `Pécresse défend une réduction de la dette et des impôts sur les entreprises, ainsi que la flexibilité du marché du travail. Elle est favorable à la réforme des retraites et à la promotion du mérite.`,
      en: `Pécresse supports reducing debt and business taxes, along with labour market flexibility. She backs pension reform and promotion of merit.`,
    },
    SOCIAL: {
      fr: `Elle défend des positions conservatrices modérées, acceptant le mariage pour tous mais s'opposant à la PMA pour les couples homosexuels. Elle défend les valeurs familiales républicaines.`,
      en: `She holds moderately conservative positions, accepting same-sex marriage but opposing assisted reproduction for same-sex couples. She defends republican family values.`,
    },
    IMMIGRATION: {
      fr: `Elle défend un contrôle strict de l'immigration et des conditions d'intégration exigeantes. Elle propose un durcissement des conditions de regroupement familial et du droit d'asile.`,
      en: `She supports strict immigration control and demanding integration requirements. She proposes tightening family reunification conditions and asylum law.`,
    },
    SECURITY: {
      fr: `Elle défend le renforcement des forces de l'ordre, des peines plancher pour les récidivistes et une justice plus ferme. Elle soutient la présomption d'innocence des policiers.`,
      en: `She supports strengthening law enforcement, mandatory minimum sentences for repeat offenders and a firmer justice system. She backs presumption of innocence for police.`,
    },
    ENVIRONMENT: {
      fr: `Elle défend une transition écologique pragmatique intégrant le nucléaire comme énergie décarbonée. Elle s'oppose aux politiques vertes qui pénalisent la compétitivité économique.`,
      en: `She supports a pragmatic green transition incorporating nuclear as a low-carbon energy. She opposes green policies that damage economic competitiveness.`,
    },
    GLOBAL: {
      fr: `Elle est pro-européenne mais défend une Europe plus souveraine et moins bureaucratique. Elle s'oppose à un fédéralisme européen trop poussé.`,
      en: `She is pro-European but defends a more sovereign and less bureaucratic EU. She opposes excessive European federalism.`,
    },
    DEMOCRACY: {
      fr: `Elle défend les institutions de la Ve République et s'oppose à une constituante. Elle est favorable à une réforme constitutionnelle mesurée.`,
      en: `She defends Fifth Republic institutions and opposes a constituent assembly. She supports measured constitutional reform.`,
    },
    PUBLIC_SERVICES: {
      fr: `Elle défend une réforme des services publics pour plus d'efficacité, avec une réduction du nombre de fonctionnaires dans l'administration centrale.`,
      en: `She supports public service reform for greater efficiency, including reducing civil servant numbers in central government.`,
    },
  },

  roussel: {
    ECONOMY: {
      fr: `Roussel défend la propriété publique des grands groupes et une planification économique démocratique. Il propose une hausse du SMIC à 1 500 euros nets et une semaine de 32 heures.`,
      en: `Roussel supports public ownership of major corporations and democratic economic planning. He proposes raising the minimum wage to €1,500 net and a 32-hour week.`,
    },
    SOCIAL: {
      fr: `Il défend les droits des travailleurs et une vision républicaine et laïque de la société. Il est attaché aux valeurs de solidarité et d'égalité de la tradition communiste.`,
      en: `He defends workers' rights and a republican, secular vision of society. He is committed to the solidarity and equality values of the communist tradition.`,
    },
    ENVIRONMENT: {
      fr: `Il défend une écologie populaire qui ne sacrifie pas les travailleurs. Il soutient le nucléaire comme énergie de base pour la transition et s'oppose à une écologie punitive.`,
      en: `He defends a popular ecology that does not sacrifice workers. He supports nuclear power as a base energy for the transition and opposes punitive green policies.`,
    },
    PUBLIC_SERVICES: {
      fr: `Il défend la nationalisation des services essentiels (énergie, eau, transports) et un investissement massif dans les services publics. Il s'oppose à toute privatisation.`,
      en: `He supports nationalising essential services (energy, water, transport) and massive public service investment. He opposes all privatisation.`,
    },
    SECURITY: {
      fr: `Il défend une justice sociale et des conditions de vie qui réduisent la délinquance à la source. Il est critique des politiques purement répressives.`,
      en: `He defends social justice and living conditions that reduce crime at the root. He is critical of purely repressive policies.`,
    },
    IMMIGRATION: {
      fr: `Il défend la régularisation des travailleurs sans-papiers et une politique d'accueil des réfugiés. Il s'oppose à toute stigmatisation des populations immigrées.`,
      en: `He supports regularising undocumented workers and welcoming refugees. He opposes all stigmatisation of immigrant communities.`,
    },
    GLOBAL: {
      fr: `Il défend la solidarité internationale et la coopération entre peuples. Il s'oppose aux traités de libre-échange qui favorisent les multinationales.`,
      en: `He defends international solidarity and cooperation between peoples. He opposes free-trade deals that benefit multinationals.`,
    },
    DEMOCRACY: {
      fr: `Il défend une démocratie renforcée avec plus de pouvoirs pour le Parlement et les citoyens. Il est favorable à la proportionnelle et aux référendums d'initiative populaire.`,
      en: `He supports a stronger democracy with more powers for Parliament and citizens. He backs proportional representation and people's initiative referendums.`,
    },
  },

  // ── FRANCE 2027 ────────────────────────────────────────────────────────────

  lepen_2027: {
    ECONOMY: {
      fr: `Le Pen maintient ses propositions de priorité nationale dans les aides sociales et une baisse de TVA sur les produits essentiels. Elle critique la politique de rigueur budgétaire qui pèse sur les classes populaires.`,
      en: `Le Pen maintains her proposals for national priority in social benefits and a VAT cut on essential goods. She criticises austerity policies weighing on working-class households.`,
    },
    IMMIGRATION: {
      fr: `Elle renforce sa ligne avec un référendum sur le droit du sol et un objectif d'immigration zéro. Elle veut inscrire la priorité nationale dans la Constitution.`,
      en: `She intensifies her position with a referendum on birthright citizenship and a zero-immigration target. She wants national priority enshrined in the Constitution.`,
    },
    SECURITY: {
      fr: `Elle propose un plan massif de recrutement policier et un durcissement des peines. Elle défend une politique pénale axée sur la dissuasion et la récidive.`,
      en: `She proposes a massive police recruitment plan and harsher sentences. She backs a criminal policy focused on deterrence and repeat offending.`,
    },
    SOCIAL: {
      fr: `Elle maintient ses positions traditionnelles sur la famille et l'identité nationale. Elle s'oppose aux politiques de genre dans l'éducation et aux évolutions jugées communautaristes.`,
      en: `She maintains traditional positions on family and national identity. She opposes gender policies in education and changes she deems communitarian.`,
    },
    ENVIRONMENT: {
      fr: `Elle soutient le nucléaire et défend une transition énergétique progressive qui préserve le pouvoir d'achat. Elle s'oppose à toute taxation écologique qui pèse sur les ménages modestes.`,
      en: `She supports nuclear power and a gradual energy transition that preserves purchasing power. She opposes green taxes that burden lower-income households.`,
    },
    GLOBAL: {
      fr: `Elle veut renégocier les traités européens pour reprendre le contrôle des frontières et de la politique commerciale. Elle défend une alliance des nations souverainistes en Europe.`,
      en: `She wants to renegotiate European treaties to regain control of borders and trade policy. She defends an alliance of sovereignist nations in Europe.`,
    },
    PUBLIC_SERVICES: {
      fr: `Elle défend les services publics de proximité et la priorité nationale dans les logements sociaux. Elle s'oppose aux coupes dans les hôpitaux de zones rurales.`,
      en: `She defends local public services and national priority in social housing. She opposes cuts to rural hospitals.`,
    },
    DEMOCRACY: {
      fr: `Elle défend le référendum d'initiative populaire pour contourner les élites politiques et donner directement la parole aux citoyens.`,
      en: `She supports the people's initiative referendum to bypass political elites and give citizens a direct voice.`,
    },
  },

  philippe: {
    ECONOMY: {
      fr: `Philippe défend une ligne libérale responsable, avec réduction des déficits et réforme de l'État. Il est favorable à une réforme des retraites et à l'amélioration de la compétitivité des entreprises françaises.`,
      en: `Philippe supports a responsible liberal line, reducing deficits and reforming the state. He backs pension reform and improving French business competitiveness.`,
    },
    SOCIAL: {
      fr: `Il adopte des positions modérées et pragmatiques, acceptant les évolutions sociétales récentes sans activisme progressiste. Il défend les valeurs républicaines classiques.`,
      en: `He holds moderate, pragmatic positions, accepting recent social changes without progressive activism. He defends classic republican values.`,
    },
    IMMIGRATION: {
      fr: `Il défend une immigration maîtrisée avec des exigences d'intégration claires. Il est favorable à une politique européenne coordonnée sur les flux migratoires.`,
      en: `He supports controlled immigration with clear integration requirements. He backs a coordinated European migration policy.`,
    },
    SECURITY: {
      fr: `Il soutient les forces de l'ordre et défend un État de droit ferme. Il est favorable à un renforcement des moyens de la justice.`,
      en: `He supports law enforcement and a firm rule of law. He backs increasing resources for the justice system.`,
    },
    ENVIRONMENT: {
      fr: `Il défend une transition écologique pragmatique intégrant le nucléaire. Il est favorable aux objectifs climatiques européens sans rupture industrielle brutale.`,
      en: `He supports a pragmatic green transition incorporating nuclear power. He backs European climate targets without brutal industrial disruption.`,
    },
    GLOBAL: {
      fr: `Il est pro-européen et défend l'autonomie stratégique de l'UE. Il soutient l'alliance atlantique et la coopération internationale dans le cadre multilatéral.`,
      en: `He is pro-European and defends EU strategic autonomy. He supports the Atlantic alliance and international cooperation in a multilateral framework.`,
    },
    PUBLIC_SERVICES: {
      fr: `Il défend une réforme des services publics pour plus d'efficacité et de sobriété budgétaire. Il s'oppose aux dépenses publiques non financées.`,
      en: `He supports public service reform for greater efficiency and fiscal discipline. He opposes unfunded public spending.`,
    },
    DEMOCRACY: {
      fr: `Il défend les institutions de la Ve République et une gouvernance stable. Il est ouvert à des ajustements constitutionnels mesurés.`,
      en: `He defends Fifth Republic institutions and stable governance. He is open to measured constitutional adjustments.`,
    },
  },

  attal: {
    ECONOMY: {
      fr: `Attal défend la continuité de la politique macroniste : plein emploi, investissement productif et baisse des impôts pour les classes moyennes. Il a défendu la réforme des retraites en tant que Premier ministre.`,
      en: `Attal supports continuity of Macronist policy: full employment, productive investment and tax cuts for the middle class. He defended pension reform as Prime Minister.`,
    },
    SOCIAL: {
      fr: `Il défend les droits des LGBT+ et l'égalité des chances. Il est attaché à la laïcité républicaine et à l'intégration par l'école et le mérite.`,
      en: `He defends LGBT+ rights and equality of opportunity. He is committed to republican secularism and integration through schooling and merit.`,
    },
    IMMIGRATION: {
      fr: `Il défend une politique migratoire ferme dans le cadre européen, avec contrôle des frontières et intégration exigeante.`,
      en: `He supports a firm migration policy within the European framework, with border control and demanding integration requirements.`,
    },
    SECURITY: {
      fr: `Il a défendu l'autorité de l'État et le respect des forces de l'ordre en tant que Premier ministre. Il est favorable à des moyens accrus pour la police et la justice.`,
      en: `He defended state authority and respect for law enforcement as Prime Minister. He backs increased resources for police and justice.`,
    },
    ENVIRONMENT: {
      fr: `Il soutient les objectifs climatiques européens et le maintien du nucléaire. Il défend une transition pragmatique qui préserve la compétitivité industrielle.`,
      en: `He supports European climate targets and nuclear power. He backs a pragmatic transition that preserves industrial competitiveness.`,
    },
    GLOBAL: {
      fr: `Il est résolument pro-européen et défend l'autonomie stratégique de l'UE. Il soutient l'Ukraine et les alliances démocratiques occidentales.`,
      en: `He is firmly pro-European and defends EU strategic autonomy. He supports Ukraine and Western democratic alliances.`,
    },
    PUBLIC_SERVICES: {
      fr: `Il défend une modernisation des services publics pour plus d'efficacité. Il est favorable à l'investissement dans l'éducation et les infrastructures numériques.`,
      en: `He supports modernising public services for greater efficiency. He backs investment in education and digital infrastructure.`,
    },
    DEMOCRACY: {
      fr: `Il défend les institutions actuelles et s'oppose à une rupture constitutionnelle. Il est ouvert à des réformes de la gouvernance locale.`,
      en: `He defends current institutions and opposes constitutional rupture. He is open to local governance reforms.`,
    },
  },

  melenchon_2027: {
    ECONOMY: {
      fr: `Mélenchon maintient son programme de planification écologique avec nationalisations et hausse du SMIC. Il critique la politique de rigueur et défend le pouvoir d'achat des classes populaires.`,
      en: `Mélenchon maintains his ecological planning programme with nationalisations and a minimum wage rise. He criticises austerity and defends working-class purchasing power.`,
    },
    SOCIAL: {
      fr: `Il défend une laïcité inclusive, les droits LGBT+ et une politique anti-discriminations. Il est favorable à la légalisation du cannabis et à une réforme de la justice pénale.`,
      en: `He supports inclusive secularism, LGBT+ rights and anti-discrimination policies. He backs legalising cannabis and reforming criminal justice.`,
    },
    IMMIGRATION: {
      fr: `Il défend la régularisation des sans-papiers et l'accueil des réfugiés. Il critique les politiques de dissuasion et les expulsions massives.`,
      en: `He supports regularising undocumented migrants and welcoming refugees. He criticises deterrence policies and mass deportations.`,
    },
    ENVIRONMENT: {
      fr: `Il défend une règle verte dans la Constitution et la sortie progressive du nucléaire. Il propose une planification publique de la transition énergétique.`,
      en: `He supports a green rule in the Constitution and a gradual nuclear phase-out. He proposes public planning of the energy transition.`,
    },
    DEMOCRACY: {
      fr: `Il propose une 6e République avec constituante. Il défend la proportionnelle et le référendum d'initiative citoyenne (RIC).`,
      en: `He proposes a Sixth Republic with a constituent assembly. He supports proportional representation and the citizens' initiative referendum.`,
    },
    GLOBAL: {
      fr: `Il maintient ses positions anti-OTAN et défend un multilatéralisme refondé. Il s'oppose aux traités de libre-échange.`,
      en: `He maintains his anti-NATO positions and defends a reformed multilateralism. He opposes free-trade treaties.`,
    },
    PUBLIC_SERVICES: {
      fr: `Il défend la gratuité des services essentiels et la nationalisation de l'énergie et de l'eau.`,
      en: `He supports free essential services and nationalising energy and water.`,
    },
    SECURITY: {
      fr: `Il critique la dérive sécuritaire et défend les libertés civiles. Il propose une réforme de la police vers la proximité.`,
      en: `He criticises security overreach and defends civil liberties. He proposes reforming policing towards community engagement.`,
    },
  },

  glucksmann: {
    ECONOMY: {
      fr: `Glucksmann défend un programme social-démocrate avec investissement public massif et redistribution. Il propose une taxe sur les superprofits et un ISF climatique.`,
      en: `Glucksmann supports a social-democratic programme with massive public investment and redistribution. He proposes a windfall profits tax and a climate wealth tax.`,
    },
    SOCIAL: {
      fr: `Il est progressiste sur les droits des femmes, des LGBT+ et l'égalité. Il défend une laïcité inclusive et s'oppose à toute discrimination.`,
      en: `He is progressive on women's rights, LGBT+ rights and equality. He defends inclusive secularism and opposes all discrimination.`,
    },
    IMMIGRATION: {
      fr: `Il défend une politique migratoire humaniste et l'accueil des réfugiés. Il s'oppose aux discours de stigmatisation des populations immigrées.`,
      en: `He supports a humanitarian migration policy and welcoming refugees. He opposes stigmatising discourse about immigrant communities.`,
    },
    ENVIRONMENT: {
      fr: `Il place la transition écologique au cœur de son programme avec un « New Deal vert ». Il est favorable à une sortie progressive du nucléaire.`,
      en: `He puts the green transition at the heart of his programme with a "Green New Deal". He supports a gradual nuclear phase-out.`,
    },
    GLOBAL: {
      fr: `Il est résolument pro-européen et défend un front démocratique face aux régimes autoritaires. Il est un fervent soutien de l'Ukraine et des démocraties libérales.`,
      en: `He is firmly pro-European and defends a democratic front against authoritarian regimes. He is a strong supporter of Ukraine and liberal democracies.`,
    },
    DEMOCRACY: {
      fr: `Il défend la proportionnelle et une réforme des institutions pour plus de représentativité. Il est favorable à un renouveau démocratique face à la défiance citoyenne.`,
      en: `He supports proportional representation and institutional reform for greater representativeness. He backs democratic renewal to address civic distrust.`,
    },
    PUBLIC_SERVICES: {
      fr: `Il défend un investissement massif dans les services publics, notamment l'éducation et la santé. Il s'oppose aux coupes budgétaires dans les services essentiels.`,
      en: `He supports massive investment in public services, especially education and healthcare. He opposes budget cuts to essential services.`,
    },
    SECURITY: {
      fr: `Il défend l'État de droit et les libertés civiles. Il est favorable à une réforme de la justice pour plus d'équité.`,
      en: `He defends the rule of law and civil liberties. He supports justice reform for greater equity.`,
    },
  },

  tondelier: {
    ECONOMY: {
      fr: `Tondelier défend une réorientation de l'économie vers la transition écologique avec taxe carbone aux frontières et investissements verts. Elle propose une réforme fiscale progressive.`,
      en: `Tondelier supports reorienting the economy towards the green transition with border carbon taxes and green investment. She proposes progressive tax reform.`,
    },
    SOCIAL: {
      fr: `Elle est progressiste sur toutes les questions de société. Elle défend les droits des femmes, des LGBT+ et une politique féministe intersectionnelle.`,
      en: `She is progressive on all social issues. She defends women's and LGBT+ rights and an intersectional feminist policy.`,
    },
    ENVIRONMENT: {
      fr: `Elle place l'écologie au cœur de tout : sortie du nucléaire et des énergies fossiles, agriculture biologique et préservation de la biodiversité. C'est sa priorité absolue.`,
      en: `She puts ecology at the heart of everything: phasing out nuclear and fossil fuels, organic farming and biodiversity preservation. It is her absolute priority.`,
    },
    IMMIGRATION: {
      fr: `Elle est favorable à une politique humaniste et à la régularisation des sans-papiers. Elle défend l'accueil des réfugiés climatiques comme obligation morale.`,
      en: `She supports a humanitarian policy and regularising undocumented migrants. She defends welcoming climate refugees as a moral obligation.`,
    },
    DEMOCRACY: {
      fr: `Elle défend la proportionnelle et un référendum constituant. Elle est favorable à une démocratie participative et délibérative.`,
      en: `She supports proportional representation and a constituent referendum. She backs participatory and deliberative democracy.`,
    },
    GLOBAL: {
      fr: `Elle défend le multilatéralisme et les accords climatiques internationaux. Elle est favorable à un fédéralisme européen vert.`,
      en: `She supports multilateralism and international climate agreements. She backs a green European federalism.`,
    },
    PUBLIC_SERVICES: {
      fr: `Elle défend des services publics gratuits et accessibles à tous, notamment dans la santé, l'éducation et les transports. Elle s'oppose à toute privatisation.`,
      en: `She defends free public services accessible to all, especially in health, education and transport. She opposes all privatisation.`,
    },
    SECURITY: {
      fr: `Elle critique les politiques sécuritaires et défend les libertés civiles. Elle est favorable à une approche préventive plutôt que répressive.`,
      en: `She criticises security-heavy policies and defends civil liberties. She backs prevention over repression.`,
    },
  },

  retailleau: {
    ECONOMY: {
      fr: `Retailleau défend une réduction significative des dépenses publiques et de la pression fiscale sur les entreprises. Il est partisan d'un retour rapide à l'équilibre budgétaire.`,
      en: `Retailleau supports a significant reduction in public spending and business tax burdens. He advocates a rapid return to a balanced budget.`,
    },
    SOCIAL: {
      fr: `Il défend des positions conservatrices, notamment son opposition à la PMA pour toutes et sa critique des évolutions progressistes sur les questions de genre et de famille.`,
      en: `He holds conservative positions, including his opposition to assisted reproduction for all and criticism of progressive changes on gender and family issues.`,
    },
    IMMIGRATION: {
      fr: `Il défend une ligne dure : restriction du droit d'asile, reconduites à la frontière massives et durcissement des conditions d'accès au titre de séjour.`,
      en: `He takes a hard line: restricting asylum rights, mass deportations and tightening residence permit conditions.`,
    },
    SECURITY: {
      fr: `Il défend une politique sécuritaire ferme avec peines plancher et renforcement des forces de l'ordre. Il est critique des réformes qui ont selon lui affaibli la justice pénale.`,
      en: `He supports a firm security policy with mandatory minimum sentences and strengthening law enforcement. He is critical of reforms that he says have weakened criminal justice.`,
    },
    ENVIRONMENT: {
      fr: `Il est favorable au nucléaire et à une transition très progressive qui ne pénalise pas la compétitivité. Il s'oppose aux mesures écologiques jugées coûteuses pour les entreprises.`,
      en: `He supports nuclear power and a very gradual transition that does not penalise competitiveness. He opposes environmental measures deemed costly for businesses.`,
    },
    GLOBAL: {
      fr: `Il est eurosceptique sur de nombreux sujets, défendant la primauté du droit national. Il est critique de la bureaucratie européenne et de la perte de souveraineté.`,
      en: `He is eurosceptic on many issues, defending the primacy of national law. He criticises European bureaucracy and loss of sovereignty.`,
    },
    DEMOCRACY: {
      fr: `Il défend les institutions de la Ve République et l'autorité de l'État. Il est opposé à une 6e République et aux réformes constitutionnelles radicales.`,
      en: `He defends Fifth Republic institutions and state authority. He opposes a Sixth Republic and radical constitutional reforms.`,
    },
    PUBLIC_SERVICES: {
      fr: `Il défend une réduction de la taille de l'État et une réforme des services publics axée sur l'efficacité. Il s'oppose à l'extension de l'intervention publique dans l'économie.`,
      en: `He supports reducing the size of the state and public service reform focused on efficiency. He opposes expanding state intervention in the economy.`,
    },
  },

  // ── PARIS 2026 ─────────────────────────────────────────────────────────────

  gregoire_paris: {
    ECONOMY: {
      fr: `Grégoire défend la continuité de la politique économique parisienne, avec soutien aux commerces de proximité et investissements publics dans les quartiers. Il veut renforcer l'attractivité de Paris.`,
      en: `Grégoire supports continuity of Parisian economic policy, with support for local businesses and public investment in neighbourhoods. He wants to strengthen Paris's attractiveness.`,
    },
    SOCIAL: {
      fr: `Il défend les politiques sociales parisiennes d'inclusion, de lutte contre les discriminations et d'aide aux plus vulnérables. Il soutient les associations de solidarité.`,
      en: `He defends Parisian social policies of inclusion, combating discrimination and helping the most vulnerable. He supports solidarity associations.`,
    },
    ENVIRONMENT: {
      fr: `Il soutient le plan vélo parisien, les zones à faibles émissions (ZFE) et la végétalisation de la ville. Il défend la piétonisation des berges et la réduction de la voiture en ville.`,
      en: `He supports the Paris cycling plan, low-emission zones and urban greening. He defends pedestrianisation of riverbanks and reducing cars in the city.`,
    },
    PUBLIC_SERVICES: {
      fr: `Il défend les services publics parisiens, notamment les crèches, les logements sociaux et les centres de santé. Il s'oppose à la privatisation des équipements municipaux.`,
      en: `He defends Parisian public services, especially crèches, social housing and health centres. He opposes privatising municipal facilities.`,
    },
    SECURITY: {
      fr: `Il défend une approche équilibrée entre prévention sociale et maintien de l'ordre. Il soutient le développement de la police municipale parisienne.`,
      en: `He supports a balanced approach between social prevention and law enforcement. He backs developing Paris's municipal police.`,
    },
    IMMIGRATION: {
      fr: `Il défend l'accueil et l'intégration des migrants et réfugiés à Paris. Il soutient les politiques d'hébergement d'urgence et les associations d'aide aux exilés.`,
      en: `He defends welcoming and integrating migrants and refugees in Paris. He supports emergency housing policies and organisations helping exiles.`,
    },
    DEMOCRACY: {
      fr: `Il défend la démocratie participative locale avec des budgets participatifs et des conseils de quartier. Il souhaite associer davantage les Parisiens aux décisions municipales.`,
      en: `He defends local participatory democracy with participatory budgets and neighbourhood councils. He wants to involve Parisians more in municipal decisions.`,
    },
    GLOBAL: {
      fr: `Il défend Paris comme ville-monde engagée dans les coopérations internationales, notamment sur le climat et la solidarité urbaine.`,
      en: `He defends Paris as a global city engaged in international cooperation, particularly on climate and urban solidarity.`,
    },
  },

  dati: {
    ECONOMY: {
      fr: `Dati défend une baisse de la fiscalité locale pour les entreprises et une politique favorable à l'attractivité économique de Paris. Elle est critique de la gestion financière d'Hidalgo.`,
      en: `Dati supports cutting local business taxes and a policy to boost Paris's economic attractiveness. She criticises Hidalgo's financial management.`,
    },
    SOCIAL: {
      fr: `Elle défend des positions modérées-conservatrices sur les questions de société. Elle se présente comme rassembleuse, au-delà des clivages partisans traditionnels.`,
      en: `She holds moderately conservative social positions. She presents herself as a unifier, beyond traditional partisan divides.`,
    },
    SECURITY: {
      fr: `Ancienne garde des Sceaux, Dati défend un renforcement de la sécurité à Paris avec davantage de policiers municipaux et une ligne ferme contre les incivilités.`,
      en: `As a former Justice Minister, Dati supports strengthening security in Paris with more municipal police and a firm line against anti-social behaviour.`,
    },
    ENVIRONMENT: {
      fr: `Elle est moins ambitieuse sur les politiques vertes que ses adversaires. Elle critique les pistes cyclables au détriment des voitures et défend un meilleur équilibre dans la mobilité urbaine.`,
      en: `She is less ambitious on green policies than her rivals. She criticises cycling lanes at the expense of cars and defends better balance in urban mobility.`,
    },
    PUBLIC_SERVICES: {
      fr: `Elle défend une gestion plus efficace et moins coûteuse des services municipaux. Elle critique les dépenses de la mairie actuelle et veut rationaliser la gestion parisienne.`,
      en: `She supports more efficient and less costly management of municipal services. She criticises current city hall spending and wants to streamline Parisian management.`,
    },
    DEMOCRACY: {
      fr: `Elle défend une gestion pragmatique de la ville, en rupture avec la politisation de la mairie actuelle. Elle veut associer les entreprises et acteurs civils aux décisions.`,
      en: `She defends pragmatic city management, breaking with the politicisation of the current city hall. She wants to involve businesses and civil actors in decisions.`,
    },
    IMMIGRATION: {
      fr: `Elle défend une politique d'hébergement plus sélective et un meilleur contrôle des flux migratoires à Paris, critique des politiques d'accueil jugées trop permissives.`,
      en: `She supports more selective housing policy and better management of migration flows in Paris, critical of what she sees as overly permissive welcoming policies.`,
    },
    GLOBAL: {
      fr: `Elle défend le rayonnement international de Paris et son attractivité pour les entreprises et talents étrangers.`,
      en: `She defends Paris's international influence and its attractiveness for foreign businesses and talent.`,
    },
  },

  chikirou_paris: {
    ECONOMY: {
      fr: `Chikirou défend une municipalisation de services actuellement privés et un investissement massif dans les quartiers populaires parisiens. Elle s'oppose à la logique de rentabilité dans les services publics.`,
      en: `Chikirou defends municipalising currently private services and massive investment in working-class Parisian neighbourhoods. She opposes profit-driven logic in public services.`,
    },
    SOCIAL: {
      fr: `Elle défend les droits des quartiers populaires, une politique sociale ambitieuse et la lutte contre toutes les discriminations. Elle est progressiste sur toutes les questions de société.`,
      en: `She defends working-class neighbourhood rights, an ambitious social policy and combating all forms of discrimination. She is progressive on all social issues.`,
    },
    SECURITY: {
      fr: `Elle est critique de la police et défend des politiques de prévention plutôt que de répression. Elle s'oppose à l'extension de la vidéosurveillance à Paris.`,
      en: `She is critical of policing and defends prevention over repression. She opposes expanding surveillance cameras in Paris.`,
    },
    ENVIRONMENT: {
      fr: `Elle place l'écologie sociale au cœur de son programme pour Paris. Elle défend la sortie des énergies fossiles et une transition juste qui ne pénalise pas les plus modestes.`,
      en: `She puts social ecology at the heart of her Paris programme. She defends exiting fossil fuels and a just transition that does not penalise lower-income Parisians.`,
    },
    PUBLIC_SERVICES: {
      fr: `Elle défend la remunicipalisation de services privatisés et un accès universel aux services parisiens. Elle veut étendre les budgets participatifs et le logement social.`,
      en: `She defends remunicipalising privatised services and universal access to Parisian services. She wants to expand participatory budgets and social housing.`,
    },
    DEMOCRACY: {
      fr: `Elle défend la démocratie participative, les budgets citoyens et un renforcement du pouvoir des conseils de quartier.`,
      en: `She defends participatory democracy, citizens' budgets and strengthening the power of neighbourhood councils.`,
    },
    IMMIGRATION: {
      fr: `Elle défend l'accueil et l'intégration des migrants à Paris comme valeur fondamentale. Elle soutient la régularisation des sans-papiers travaillant à Paris.`,
      en: `She defends welcoming and integrating migrants in Paris as a core value. She supports regularising undocumented workers in Paris.`,
    },
    GLOBAL: {
      fr: `Elle défend Paris comme ville de solidarité internationale et souhaite renforcer les liens avec les villes du Sud global.`,
      en: `She defends Paris as a city of international solidarity and wants to strengthen links with cities in the Global South.`,
    },
  },

  // ── USA 2020 ───────────────────────────────────────────────────────────────

  biden: {
    ECONOMY: {
      fr: `Biden a lancé l'American Rescue Plan (1 900 milliards $) et l'Inflation Reduction Act, les plus grands programmes d'investissement public depuis des décennies. Il a soutenu un salaire minimum fédéral à 15 dollars.`,
      en: `Biden launched the American Rescue Plan ($1.9 trillion) and the Inflation Reduction Act, the largest public investment programmes in decades. He supported a $15 federal minimum wage.`,
    },
    SOCIAL: {
      fr: `Il a défendu les droits civiques, les droits des femmes et la lutte contre les discriminations raciales. Il a abrogé les politiques discriminatoires envers les personnes trans dans l'armée.`,
      en: `He defended civil rights, women's rights and combating racial discrimination. He repealed discriminatory policies against transgender people in the military.`,
    },
    IMMIGRATION: {
      fr: `Biden a mis fin à la politique de séparation des familles à la frontière et a défendu un chemin vers la citoyenneté pour les immigrants sans-papiers établis de longue date.`,
      en: `Biden ended the family separation policy at the border and supported a pathway to citizenship for long-established undocumented immigrants.`,
    },
    SECURITY: {
      fr: `Il défend une réforme de la police sans la supprimer, et a soutenu un renforcement du contrôle des armes à feu après des fusillades de masse.`,
      en: `He supports police reform without abolition, and backed strengthening gun control after mass shootings.`,
    },
    ENVIRONMENT: {
      fr: `Biden a réintégré les États-Unis dans l'Accord de Paris dès son entrée en fonctions. L'Inflation Reduction Act représente le plus grand investissement climatique de l'histoire américaine (370 milliards $).`,
      en: `Biden rejoined the Paris Agreement on his first day in office. The Inflation Reduction Act represents the largest climate investment in American history ($370 billion).`,
    },
    DEMOCRACY: {
      fr: `Il a défendu la certification des élections de 2020 face aux contestations. Il a soutenu le John Lewis Voting Rights Act pour protéger le droit de vote.`,
      en: `He defended the certification of the 2020 election against challenges. He backed the John Lewis Voting Rights Act to protect voting rights.`,
    },
    GLOBAL: {
      fr: `Biden est multilatéraliste : il a réintégré l'OMS et les accords de Paris, renforcé l'OTAN et organisé un sommet pour la démocratie mondiale. Il a coordonné le soutien occidental à l'Ukraine.`,
      en: `Biden is multilateralist: he rejoined the WHO and Paris Agreement, strengthened NATO and hosted a Summit for Democracy. He coordinated Western support for Ukraine.`,
    },
    PUBLIC_SERVICES: {
      fr: `Il a défendu un investissement massif dans les infrastructures publiques (1 200 milliards $ via le Bipartisan Infrastructure Law) et a proposé d'étendre Medicare et les aides à la garde d'enfants.`,
      en: `He championed massive public infrastructure investment ($1.2 trillion via the Bipartisan Infrastructure Law) and proposed expanding Medicare and childcare support.`,
    },
  },

  trump: {
    ECONOMY: {
      fr: `Trump a réduit l'impôt sur les sociétés de 35 % à 21 % (Tax Cuts and Jobs Act). Il a imposé des droits de douane élevés sur les importations chinoises et européennes pour protéger l'industrie américaine.`,
      en: `Trump cut corporate tax from 35% to 21% (Tax Cuts and Jobs Act). He imposed high tariffs on Chinese and European imports to protect American industry.`,
    },
    SOCIAL: {
      fr: `Il s'est opposé à l'avortement et a nommé trois juges conservateurs à la Cour suprême, permettant l'annulation de Roe v. Wade. Il est critique des politiques de genre et de l'idéologie woke.`,
      en: `He opposed abortion and appointed three conservative Supreme Court justices, enabling the overturning of Roe v. Wade. He criticises gender policies and "woke" ideology.`,
    },
    IMMIGRATION: {
      fr: `Il a construit 700 km de barrière à la frontière mexicaine et imposé le « Muslim Ban ». Il a drastiquement réduit l'immigration légale et illégale, et durci les conditions d'asile.`,
      en: `He built 700 km of barrier on the Mexican border and imposed the "Muslim Ban". He drastically reduced both legal and illegal immigration and toughened asylum conditions.`,
    },
    SECURITY: {
      fr: `Il défend le droit au port d'armes et s'oppose aux réglementations sur les armes à feu. Il a soutenu les forces de l'ordre face au mouvement Black Lives Matter.`,
      en: `He defends the right to bear arms and opposes gun regulations. He supported law enforcement against the Black Lives Matter movement.`,
    },
    ENVIRONMENT: {
      fr: `Il a retiré les États-Unis de l'Accord de Paris en 2017 et assoupli les réglementations environnementales de l'EPA. Il a promu l'industrie des combustibles fossiles et relancé l'extraction de charbon.`,
      en: `He withdrew the US from the Paris Agreement in 2017 and loosened EPA environmental regulations. He promoted the fossil fuel industry and relaunched coal extraction.`,
    },
    DEMOCRACY: {
      fr: `Il a contesté les résultats de l'élection de 2020, affirmant sans preuve qu'elle avait été volée. Ces affirmations ont conduit aux événements du 6 janvier 2021 au Capitole.`,
      en: `He contested the 2020 election results, claiming without evidence they had been stolen. These claims led to the events of January 6, 2021 at the Capitol.`,
    },
    GLOBAL: {
      fr: `Il a adopté une politique d'« America First », critiquant l'OTAN et l'OMS, se retirant de plusieurs traités multilatéraux et imposant des tarifs douaniers dans une guerre commerciale mondiale.`,
      en: `He adopted an "America First" policy, criticising NATO and the WHO, withdrawing from multiple multilateral treaties and imposing tariffs in a global trade war.`,
    },
    PUBLIC_SERVICES: {
      fr: `Il a cherché à abroger l'Affordable Care Act (Obamacare) sans le remplacer et a défendu des réductions significatives des dépenses fédérales dans les programmes sociaux.`,
      en: `He sought to repeal the Affordable Care Act (Obamacare) without a replacement and advocated significant cuts to federal social spending.`,
    },
  },
};
