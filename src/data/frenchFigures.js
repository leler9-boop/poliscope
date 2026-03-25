// POLISCOPE — French Political Figures
// 28 figures active in the last 5 years (2021–2026)
// Profile scores 0–100 per theme (see questions.js for scale definitions)

export const frenchFigures = [

  // ── Centre / Macronisme ────────────────────────────────────────────────────

  {
    id: `macron`,
    name: `Emmanuel Macron`,
    flag: `🇫🇷`,
    emoji: `🏛️`,
    family: `center`,
    party: { fr: `Renaissance`, en: `Renaissance` },
    role: { fr: `Président de la République`, en: `President of the Republic` },
    short_summary: {
      fr: `Président depuis 2017, figure du centrisme libéral et pro-européen.`,
      en: `President since 2017, emblematic of liberal, pro-European centrism.`,
    },
    description: {
      fr: `Emmanuel Macron est élu président en 2017 et réélu en 2022, portant un programme de réforme libérale de l'économie française et d'intégration européenne renforcée. Son mandat est marqué par les réformes des retraites, la gestion de la pandémie et le soutien à l'Ukraine. Sa ligne politique a progressivement durci sur l'immigration et la sécurité, brouillant sa position initiale de « ni gauche ni droite ». Il gouverne sans majorité absolue depuis 2022, ce qui a profondément modifié l'équilibre institutionnel.`,
      en: `Emmanuel Macron was elected president in 2017 and re-elected in 2022, promoting liberal economic reforms and deeper European integration. His term has been marked by pension reforms, pandemic management, and strong support for Ukraine. His line gradually hardened on immigration and security, blurring his initial "neither left nor right" positioning. He has governed without an absolute majority since 2022, fundamentally reshaping the institutional balance.`,
    },
    key_positions: {
      fr: [
        `Réforme des retraites : report de l'âge légal à 64 ans (2023).`,
        `Soutien militaire et financier massif à l'Ukraine depuis 2022.`,
        `Plan « France 2030 » : 54 milliards pour la réindustrialisation et les technologies d'avenir.`,
        `Durcissement migratoire : loi immigration adoptée en 2023 avec des voix de droite.`,
        `Relance du nucléaire : construction de 6 nouveaux EPR annoncée.`,
      ],
      en: [
        `Pension reform: raising the legal retirement age to 64 (2023).`,
        `Massive military and financial support for Ukraine since 2022.`,
        `"France 2030" plan: €54 billion for reindustrialisation and future technologies.`,
        `Tighter immigration: 2023 immigration law passed with right-wing votes.`,
        `Nuclear revival: construction of 6 new EPR reactors announced.`,
      ],
    },
    key_facts: {
      fr: [
        `Sa réforme des retraites, adoptée sans vote via le 49.3, a déclenché plusieurs mois de mobilisation sociale.`,
        `A gouverné sans majorité absolue à l'Assemblée nationale de 2022 à 2024, inédit sous la Ve République.`,
      ],
      en: [
        `His pension reform, passed without a vote via Article 49.3, triggered months of social unrest.`,
        `Governed without an absolute majority in the National Assembly from 2022 to 2024 — unprecedented under the Fifth Republic.`,
      ],
    },
    career_timeline: [
      { year: 2016, fr: `Fonde le mouvement En Marche !`, en: `Founded the En Marche! movement.` },
      { year: 2017, fr: `Élu président au second tour avec 66,1 %.`, en: `Elected President in the second round with 66.1%.` },
      { year: 2022, fr: `Réélu face à Marine Le Pen avec 58,55 %.`, en: `Re-elected against Marine Le Pen with 58.55%.` },
    ],
    disclaimer: {
      fr: `Son positionnement a évolué vers des positions plus sécuritaires et souverainistes sur l'immigration depuis 2022, brouillant sa ligne libérale initiale.`,
      en: `His positioning has shifted toward more security-focused and sovereignist stances on immigration since 2022, blurring his initial liberal line.`,
    },
    profile: {
      ECONOMY: 70, SOCIAL: 65, IMMIGRATION: 42, SECURITY: 42,
      ENVIRONMENT: 55, DEMOCRACY: 48, GLOBAL: 80, PUBLIC_SERVICES: 38,
    },
  },

  {
    id: `attal`,
    name: `Gabriel Attal`,
    flag: `🇫🇷`,
    emoji: `🎙️`,
    family: `center`,
    party: { fr: `Renaissance`, en: `Renaissance` },
    role: { fr: `Ancien Premier ministre`, en: `Former Prime Minister` },
    short_summary: {
      fr: `Plus jeune Premier ministre de la Ve République, figure montante du macronisme.`,
      en: `Youngest Prime Minister of the Fifth Republic and a rising figure of Macronism.`,
    },
    description: {
      fr: `Gabriel Attal est nommé Premier ministre en janvier 2024, devenant le plus jeune chef de gouvernement de la Ve République. Connu pour son style offensif en communication, il a marqué son passage par une politique éducative ferme et une approche sécuritaire assumée. Il démissionne après la dissolution de l'Assemblée en juin 2024.`,
      en: `Gabriel Attal was appointed Prime Minister in January 2024, becoming the youngest head of government in the Fifth Republic. Known for his assertive communication style, he left his mark with firm education policy and an avowed security agenda. He resigned following the dissolution of the Assembly in June 2024.`,
    },
    key_positions: {
      fr: [
        `Interdiction de l'abaya à l'école au nom de la laïcité.`,
        `Politique de sécurité publique renforcée, notamment contre les violences des mineurs.`,
        `Soutien à la réindustrialisation et aux investissements verts.`,
        `Pro-européen, partisan d'une défense commune renforcée.`,
        `Favorable au Service national universel (SNU).`,
      ],
      en: [
        `Banned the abaya in schools in the name of secularism.`,
        `Strengthened public security policy, especially against youth violence.`,
        `Supporter of reindustrialisation and green investment.`,
        `Pro-European, advocate of a strengthened common defence.`,
        `In favour of the Universal National Service (SNU).`,
      ],
    },
    key_facts: {
      fr: [
        `Premier Premier ministre ouvertement homosexuel en France.`,
        `Sa durée à Matignon (7 mois) est l'une des plus courtes de la Ve République.`,
      ],
      en: [
        `First openly gay Prime Minister in France.`,
        `His tenure at Matignon (7 months) is one of the shortest under the Fifth Republic.`,
      ],
    },
    career_timeline: [
      { year: 2017, fr: `Élu député pour la première fois sous l'étiquette LREM.`, en: `First elected MP under the LREM banner.` },
      { year: 2022, fr: `Nommé ministre de l'Éducation nationale.`, en: `Appointed Minister of National Education.` },
      { year: 2024, fr: `Nommé Premier ministre, démissionne 7 mois plus tard.`, en: `Appointed Prime Minister, resigned 7 months later.` },
    ],
    disclaimer: {
      fr: `Ses positions sur la laïcité et la sécurité ont parfois suscité des tensions avec l'aile progressiste de Renaissance.`,
      en: `His positions on secularism and security have at times created tensions with the progressive wing of Renaissance.`,
    },
    profile: {
      ECONOMY: 68, SOCIAL: 68, IMMIGRATION: 40, SECURITY: 42,
      ENVIRONMENT: 55, DEMOCRACY: 55, GLOBAL: 78, PUBLIC_SERVICES: 40,
    },
  },

  {
    id: `philippe`,
    name: `Édouard Philippe`,
    flag: `🇫🇷`,
    emoji: `⚓`,
    family: `center`,
    party: { fr: `Horizons`, en: `Horizons` },
    role: { fr: `Maire du Havre, ancien Premier ministre`, en: `Mayor of Le Havre, former Prime Minister` },
    short_summary: {
      fr: `Ancien Premier ministre, figure de la droite modérée au sein de la coalition macroniste.`,
      en: `Former Prime Minister and moderate right-wing figure within the Macronist coalition.`,
    },
    description: {
      fr: `Édouard Philippe a été Premier ministre de 2017 à 2020, avant de fonder le parti Horizons et de se recentrer sur son mandat de maire du Havre. Il est perçu comme une figure de droite modérée au sein de la coalition macroniste. Candidat potentiel à la présidentielle de 2027, il cultive une image de sérieux et de compétence gestionnaire.`,
      en: `Édouard Philippe served as Prime Minister from 2017 to 2020, before founding the Horizons party and refocusing on his role as Mayor of Le Havre. He is seen as a moderate right-wing figure within the Macronist coalition. A potential 2027 presidential candidate, he cultivates an image of seriousness and managerial competence.`,
    },
    key_positions: {
      fr: [
        `Maîtrise des dépenses publiques et réduction du déficit.`,
        `Fermeté sur l'immigration et la sécurité, dans une ligne républicaine.`,
        `Pro-européen pragmatique, favorable à une autonomie stratégique européenne.`,
        `Développement économique territorial (modèle du Havre).`,
        `Réforme des retraites : architecte du projet initial de 2019.`,
      ],
      en: [
        `Control of public spending and deficit reduction.`,
        `Firmness on immigration and security within a republican framework.`,
        `Pragmatic pro-European, in favour of European strategic autonomy.`,
        `Territorial economic development (Le Havre model).`,
        `Pension reform: architect of the original 2019 project.`,
      ],
    },
    key_facts: {
      fr: [
        `Son taux de popularité est resté élevé tout au long de son mandat à Matignon, rare sous Macron.`,
        `Il est régulièrement cité comme favori dans les sondages pour la présidentielle 2027.`,
      ],
      en: [
        `His approval rating remained consistently high throughout his Matignon tenure, rare under Macron.`,
        `He is regularly cited as a frontrunner in polls for the 2027 presidential election.`,
      ],
    },
    career_timeline: [
      { year: 2010, fr: `Élu maire du Havre pour la première fois.`, en: `First elected Mayor of Le Havre.` },
      { year: 2017, fr: `Nommé Premier ministre par Emmanuel Macron.`, en: `Appointed Prime Minister by Emmanuel Macron.` },
      { year: 2022, fr: `Fonde le parti Horizons, allié à Renaissance.`, en: `Founded the Horizons party, allied with Renaissance.` },
    ],
    disclaimer: {
      fr: `Issu de LR, son profil est plus à droite que la moyenne macroniste, notamment sur les questions économiques et sécuritaires.`,
      en: `Coming from LR, his profile is further right than the average Macronist, particularly on economic and security issues.`,
    },
    profile: {
      ECONOMY: 72, SOCIAL: 50, IMMIGRATION: 38, SECURITY: 40,
      ENVIRONMENT: 50, DEMOCRACY: 52, GLOBAL: 72, PUBLIC_SERVICES: 38,
    },
  },

  {
    id: `borne`,
    name: `Élisabeth Borne`,
    flag: `🇫🇷`,
    emoji: `🚆`,
    family: `center`,
    party: { fr: `Renaissance`, en: `Renaissance` },
    role: { fr: `Ancienne Première ministre`, en: `Former Prime Minister` },
    short_summary: {
      fr: `Première femme PM depuis Cresson, technocrate de gauche convertie au macronisme.`,
      en: `First female PM since Cresson, a left-leaning technocrat who joined Macronism.`,
    },
    description: {
      fr: `Élisabeth Borne a été Première ministre de 2022 à 2024, première femme à occuper ce poste depuis Édith Cresson. Technocrate de formation passée par la gauche, elle a piloté la réforme controversée des retraites et mis l'accent sur la transition écologique et l'emploi. Sa gestion sans majorité absolue a nécessité un usage intense du 49.3.`,
      en: `Élisabeth Borne served as Prime Minister from 2022 to 2024, the first woman to hold the post since Édith Cresson. A trained technocrat with a left-wing background, she steered the controversial pension reform and focused on ecological transition and employment. Governing without an absolute majority forced extensive use of Article 49.3.`,
    },
    key_positions: {
      fr: [
        `Réforme des retraites : portage politique et défense face au mouvement social.`,
        `Plan de sobriété énergétique face à la crise de l'énergie (2022-2023).`,
        `« Plein emploi » comme objectif central de sa politique économique.`,
        `Soutien à l'Ukraine, continuité de la ligne Macron.`,
        `Renforcement de la politique industrielle verte.`,
      ],
      en: [
        `Pension reform: political ownership and defence against social unrest.`,
        `Energy sobriety plan in response to the energy crisis (2022-2023).`,
        `"Full employment" as the central goal of her economic policy.`,
        `Support for Ukraine, continuity with Macron's line.`,
        `Strengthening green industrial policy.`,
      ],
    },
    key_facts: {
      fr: [
        `A utilisé le 49.3 à 23 reprises, un record sous la Ve République.`,
        `Renversée par une motion de censure de la gauche en janvier 2024.`,
      ],
      en: [
        `Used Article 49.3 a record 23 times under the Fifth Republic.`,
        `Brought down by a left-wing no-confidence motion in January 2024.`,
      ],
    },
    career_timeline: [
      { year: 2017, fr: `Nommée ministre chargée des Transports.`, en: `Appointed Minister for Transport.` },
      { year: 2022, fr: `Nommée Première ministre — deuxième femme à ce poste.`, en: `Appointed Prime Minister — second woman to hold the post.` },
      { year: 2024, fr: `Démissionne après une motion de censure.`, en: `Resigned following a no-confidence vote.` },
    ],
    disclaimer: {
      fr: `Son passage au gouvernement est avant tout défini par la réforme des retraites, adoptée sans vote à l'Assemblée via le 49.3.`,
      en: `Her time in government is primarily defined by the pension reform, passed without a vote via Article 49.3.`,
    },
    profile: {
      ECONOMY: 62, SOCIAL: 60, IMMIGRATION: 48, SECURITY: 45,
      ENVIRONMENT: 60, DEMOCRACY: 52, GLOBAL: 75, PUBLIC_SERVICES: 48,
    },
  },

  {
    id: `le_maire`,
    name: `Bruno Le Maire`,
    flag: `🇫🇷`,
    emoji: `💼`,
    family: `center`,
    party: { fr: `Renaissance`, en: `Renaissance` },
    role: { fr: `Ancien ministre de l'Économie`, en: `Former Minister of Economy` },
    short_summary: {
      fr: `Ministre de l'Économie pendant 7 ans, défenseur du libéralisme économique et de la souveraineté industrielle européenne.`,
      en: `Economy Minister for 7 years, champion of economic liberalism and European industrial sovereignty.`,
    },
    description: {
      fr: `Bruno Le Maire a été ministre de l'Économie de 2017 à 2024, l'un des plus longs mandats à ce poste sous la Ve République. Partisan d'un libéralisme économique assumé, il a défendu la réindustrialisation de la France et l'autonomie stratégique européenne tout en gérant la crise Covid et la hausse des prix.`,
      en: `Bruno Le Maire served as Minister of Economy from 2017 to 2024, one of the longest tenures in that role under the Fifth Republic. A committed economic liberal, he championed French reindustrialisation and European strategic autonomy while managing the Covid crisis and inflation.`,
    },
    key_positions: {
      fr: [
        `Baisse des impôts sur les entreprises (IS de 33 % à 25 %).`,
        `Réindustrialisation via le plan « France 2030 ».`,
        `Régulation des GAFAM au niveau européen (DSA, DMA).`,
        `Souveraineté économique et technologique européenne.`,
        `Bouclier tarifaire sur l'énergie pour protéger les ménages.`,
      ],
      en: [
        `Cut in corporate tax rate (from 33% to 25%).`,
        `Reindustrialisation via the "France 2030" plan.`,
        `Regulation of Big Tech at European level (DSA, DMA).`,
        `European economic and technological sovereignty.`,
        `Energy price shield to protect households.`,
      ],
    },
    key_facts: {
      fr: [
        `A géré les crises successives : Covid, inflation, choc énergétique, en mobilisant plus de 400 milliards d'euros de soutien public.`,
        `Romancier publié, il entretient une image d'intellectuel atypique dans le milieu politique.`,
      ],
      en: [
        `Managed successive crises — Covid, inflation, energy shock — mobilising over €400 billion in public support.`,
        `A published novelist, he maintains an atypical intellectual image in political circles.`,
      ],
    },
    career_timeline: [
      { year: 2004, fr: `Conseiller politique à l'Élysée sous Chirac.`, en: `Political adviser at the Élysée under Chirac.` },
      { year: 2017, fr: `Nommé ministre de l'Économie et des Finances.`, en: `Appointed Minister of Economy and Finance.` },
      { year: 2024, fr: `Quitte le gouvernement après les législatives anticipées.`, en: `Left government after the snap legislative elections.` },
    ],
    disclaimer: {
      fr: `Ses positions libérales sur l'économie tranchent avec son orientation plus conservatrice sur les questions de société, héritée de ses années au sein de l'UMP.`,
      en: `His liberal economic positions contrast with his more conservative stance on social issues, inherited from his years in the UMP.`,
    },
    profile: {
      ECONOMY: 80, SOCIAL: 55, IMMIGRATION: 45, SECURITY: 45,
      ENVIRONMENT: 45, DEMOCRACY: 48, GLOBAL: 75, PUBLIC_SERVICES: 30,
    },
  },

  {
    id: `darmanin`,
    name: `Gérald Darmanin`,
    flag: `🇫🇷`,
    emoji: `🔒`,
    family: `center`,
    party: { fr: `Renaissance`, en: `Renaissance` },
    role: { fr: `Ancien ministre de l'Intérieur`, en: `Former Minister of the Interior` },
    short_summary: {
      fr: `Ministre de l'Intérieur de 2020 à 2024, incarnation de la ligne sécuritaire et régalienne au sein du macronisme.`,
      en: `Interior Minister from 2020 to 2024, embodiment of the security-focused line within Macronism.`,
    },
    description: {
      fr: `Gérald Darmanin a été ministre de l'Intérieur de 2020 à 2024, pilotant une politique sécuritaire marquée par le durcissement des règles sur l'immigration et le maintien de l'ordre. Il a notamment porté la loi immigration controversée de 2023. Son profil est nettement plus à droite que la moyenne macroniste sur ces sujets.`,
      en: `Gérald Darmanin served as Minister of the Interior from 2020 to 2024, overseeing a security-focused agenda including tougher immigration rules and law enforcement. He championed the controversial 2023 immigration law. His profile is markedly further right than the average Macronist on these issues.`,
    },
    key_positions: {
      fr: [
        `Loi immigration 2023 : durcissement des conditions de séjour et d'expulsion.`,
        `Maintien de l'ordre renforcé lors des manifestations contre la réforme des retraites.`,
        `Dissolution de groupes d'extrême gauche jugés violents.`,
        `Lutte contre le « séparatisme islamiste » (loi confortant les principes républicains, 2021).`,
        `Augmentation des effectifs policiers et de leurs moyens.`,
      ],
      en: [
        `2023 Immigration law: tougher residency and expulsion conditions.`,
        `Strengthened order maintenance during pension reform protests.`,
        `Dissolution of far-left groups deemed violent.`,
        `Fight against "Islamist separatism" (2021 Republican principles law).`,
        `Increase in police staffing and resources.`,
      ],
    },
    key_facts: {
      fr: [
        `A été mis en examen pour viol en 2020 ; la procédure a abouti à un non-lieu en 2022.`,
        `Sa loi immigration a été partiellement censurée par le Conseil constitutionnel en 2024.`,
      ],
      en: [
        `Was placed under formal investigation for rape in 2020; the case was dismissed in 2022.`,
        `His immigration law was partially struck down by the Constitutional Council in 2024.`,
      ],
    },
    career_timeline: [
      { year: 2017, fr: `Nommé ministre de l'Action et des Comptes publics.`, en: `Appointed Minister of Public Action and Accounts.` },
      { year: 2020, fr: `Nommé ministre de l'Intérieur.`, en: `Appointed Minister of the Interior.` },
      { year: 2024, fr: `Quitte le gouvernement après les législatives anticipées.`, en: `Left government after the snap legislative elections.` },
    ],
    disclaimer: {
      fr: `Son profil est nettement plus à droite que la moyenne macroniste sur l'immigration et la sécurité.`,
      en: `His profile is markedly further right than the average Macronist on immigration and security.`,
    },
    profile: {
      ECONOMY: 65, SOCIAL: 40, IMMIGRATION: 22, SECURITY: 22,
      ENVIRONMENT: 45, DEMOCRACY: 38, GLOBAL: 62, PUBLIC_SERVICES: 42,
    },
  },

  {
    id: `bayrou`,
    name: `François Bayrou`,
    flag: `🇫🇷`,
    emoji: `🕊️`,
    family: `center`,
    party: { fr: `MoDem`, en: `MoDem` },
    role: { fr: `Premier ministre`, en: `Prime Minister` },
    short_summary: {
      fr: `Centriste historique, Premier ministre depuis décembre 2024, allié fidèle de Macron depuis 2017.`,
      en: `Veteran centrist, Prime Minister since December 2024, loyal Macron ally since 2017.`,
    },
    description: {
      fr: `François Bayrou est nommé Premier ministre en décembre 2024, après avoir été l'un des alliés centraux de Macron depuis 2017. Fondateur du MoDem, il incarne un centrisme humaniste attaché à la démocratie participative et au dialogue social. Candidat à trois élections présidentielles (2002, 2007, 2012), il n'avait jamais accédé à de hautes fonctions exécutives avant 2024.`,
      en: `François Bayrou was appointed Prime Minister in December 2024, having been one of Macron's central allies since 2017. Founder of MoDem, he embodies a humanist centrism committed to participatory democracy and social dialogue. A candidate in three presidential elections (2002, 2007, 2012), he had never held high executive office before 2024.`,
    },
    key_positions: {
      fr: [
        `Réforme des institutions et renforcement de la proportionnelle.`,
        `Réduction du déficit public sans austérité brutale.`,
        `Dialogue social comme méthode de gouvernement.`,
        `Attachement à l'enseignement public et à la culture.`,
        `Pro-européen de longue date, favorable à une Europe fédérale.`,
      ],
      en: [
        `Institutional reform and expansion of proportional representation.`,
        `Reducing the public deficit without brutal austerity.`,
        `Social dialogue as a governing method.`,
        `Commitment to public education and culture.`,
        `Long-standing pro-European, in favour of a federal Europe.`,
      ],
    },
    key_facts: {
      fr: [
        `Mis en examen dans l'affaire des assistants parlementaires du MoDem au Parlement européen.`,
        `A obtenu 18,57 % à la présidentielle de 2007, son meilleur score, depuis jamais retrouvé.`,
      ],
      en: [
        `Under formal investigation in the MoDem parliamentary assistants affair at the European Parliament.`,
        `Obtained 18.57% in the 2007 presidential election, his best score, never repeated since.`,
      ],
    },
    career_timeline: [
      { year: 2007, fr: `Obtient 18,57 % à la présidentielle, refuse de rejoindre Sarkozy.`, en: `Obtained 18.57% in presidential race, refused to join Sarkozy.` },
      { year: 2016, fr: `Soutient Macron dès le lancement d'En Marche.`, en: `Backed Macron from the launch of En Marche.` },
      { year: 2024, fr: `Nommé Premier ministre par Macron en décembre.`, en: `Appointed Prime Minister by Macron in December.` },
    ],
    disclaimer: {
      fr: `Ses positions sont difficiles à classer sur l'axe gauche-droite : libéral sur l'économie, attaché à des valeurs sociales-chrétiennes sur certaines questions de société.`,
      en: `His positions are hard to classify on the left-right axis: liberal on economics, yet attached to Christian social values on certain social issues.`,
    },
    profile: {
      ECONOMY: 60, SOCIAL: 52, IMMIGRATION: 42, SECURITY: 50,
      ENVIRONMENT: 55, DEMOCRACY: 58, GLOBAL: 72, PUBLIC_SERVICES: 50,
    },
  },

  // ── Droite ─────────────────────────────────────────────────────────────────

  {
    id: `wauquiez`,
    name: `Laurent Wauquiez`,
    flag: `🇫🇷`,
    emoji: `🦅`,
    family: `right`,
    party: { fr: `Les Républicains`, en: `The Republicans` },
    role: { fr: `Président de LR, Président de la Région Auvergne-Rhône-Alpes`, en: `LR President, President of Auvergne-Rhône-Alpes Region` },
    short_summary: {
      fr: `Chef de file de la droite dure, président de la région AuRA et de LR depuis 2017.`,
      en: `Leader of the hard right, president of the AuRA region and LR since 2017.`,
    },
    description: {
      fr: `Laurent Wauquiez préside Les Républicains depuis 2017 et la région Auvergne-Rhône-Alpes depuis 2015. Il défend une ligne droite dure sur l'immigration, la sécurité et les valeurs conservatrices, cherchant à positionner LR comme une alternative crédible à l'extrême droite. Son virage droitier a provoqué des départs au sein du parti.`,
      en: `Laurent Wauquiez has led Les Républicains since 2017 and the Auvergne-Rhône-Alpes region since 2015. He advocates a hard right line on immigration, security and conservative values, seeking to position LR as a credible alternative to the far right. His rightward shift has triggered departures within the party.`,
    },
    key_positions: {
      fr: [
        `Immigration : « zéro immigration économique », durcissement des conditions d'accueil.`,
        `Sécurité : peines plancher, suppression de la remise de peine automatique.`,
        `Refus de tout accord avec le RN au niveau national.`,
        `Gestion libérale de la région AuRA, coupes dans les associations subventionnées.`,
        `Opposition à l'aide médicale d'État (AME).`,
      ],
      en: [
        `Immigration: "zero economic immigration", tougher reception conditions.`,
        `Security: minimum sentences, abolition of automatic sentence reductions.`,
        `Refusal of any national-level deal with the RN.`,
        `Liberal management of AuRA region, cuts to subsidised associations.`,
        `Opposition to State Medical Aid (AME).`,
      ],
    },
    key_facts: {
      fr: [
        `A supprimé les financements de nombreuses associations culturelles en AuRA, suscitant des polémiques.`,
        `Plusieurs figures de LR l'ont quitté pour rejoindre la majorité macroniste, affaiblissant le parti.`,
      ],
      en: [
        `Cut funding to numerous cultural associations in AuRA, sparking controversy.`,
        `Several LR figures left to join the Macronist majority, weakening the party.`,
      ],
    },
    career_timeline: [
      { year: 2015, fr: `Élu président de la région Auvergne-Rhône-Alpes.`, en: `Elected president of the Auvergne-Rhône-Alpes region.` },
      { year: 2017, fr: `Élu président de LR après la déroute de la droite.`, en: `Elected LR president after the right's electoral rout.` },
      { year: 2019, fr: `Démissionne de la présidence de LR, puis revient en 2022.`, en: `Resigned from LR presidency, then returned in 2022.` },
    ],
    disclaimer: {
      fr: `Son virage droitier a été perçu comme une tentative de récupérer l'électorat du RN, alimentant le débat sur l'identité de LR.`,
      en: `His rightward shift has been seen as an attempt to recapture RN voters, fuelling debate over LR's identity.`,
    },
    profile: {
      ECONOMY: 78, SOCIAL: 28, IMMIGRATION: 18, SECURITY: 20,
      ENVIRONMENT: 35, DEMOCRACY: 40, GLOBAL: 38, PUBLIC_SERVICES: 28,
    },
  },

  {
    id: `bertrand`,
    name: `Xavier Bertrand`,
    flag: `🇫🇷`,
    emoji: `🔧`,
    family: `right`,
    party: { fr: `Les Républicains`, en: `The Republicans` },
    role: { fr: `Président de la Région Hauts-de-France`, en: `President of Hauts-de-France Region` },
    short_summary: {
      fr: `Droite sociale et pragmatique, président des Hauts-de-France, proche des préoccupations ouvrières.`,
      en: `Social and pragmatic right, president of Hauts-de-France, close to working-class concerns.`,
    },
    description: {
      fr: `Xavier Bertrand préside la région Hauts-de-France depuis 2015. Il représente une droite modérée sociale, attachée à la protection des travailleurs et à une approche pragmatique de la gouvernance. Il a envisagé une candidature présidentielle en 2022 mais y a renoncé. Son style direct et son ancrage territorial le distinguent du profil technocratique habituel de la droite.`,
      en: `Xavier Bertrand has presided over the Hauts-de-France region since 2015. He represents a moderate social right, committed to worker protection and a pragmatic approach to governance. He considered a 2022 presidential run but stepped back. His direct style and territorial roots distinguish him from the usual right-wing technocratic profile.`,
    },
    key_positions: {
      fr: [
        `Défense du pouvoir d'achat des classes moyennes et populaires.`,
        `Fermeté sur l'immigration mais refus des positions les plus extrêmes de LR.`,
        `Réindustrialisation du Nord : fort engagement sur l'emploi local.`,
        `Opposition à la politique énergétique trop rapide de sortie du nucléaire.`,
        `Dialogue avec les syndicats plutôt que confrontation.`,
      ],
      en: [
        `Defence of purchasing power for middle and working classes.`,
        `Firm on immigration but rejects the most extreme LR positions.`,
        `Reindustrialisation of the North: strong commitment to local employment.`,
        `Opposition to too-rapid nuclear phase-out energy policy.`,
        `Dialogue with unions rather than confrontation.`,
      ],
    },
    key_facts: {
      fr: [
        `Réélu président de région en 2021 avec 52 % face au RN, démontrant sa capacité à barrer la route à l'extrême droite.`,
        `A quitté LR en 2017 avant d'y revenir, symptôme des turbulences du parti.`,
      ],
      en: [
        `Re-elected regional president in 2021 with 52% against the RN, demonstrating his ability to hold back the far right.`,
        `Left LR in 2017 before returning, symptomatic of the party's turbulence.`,
      ],
    },
    career_timeline: [
      { year: 2004, fr: `Ministre de la Santé sous Raffarin.`, en: `Health Minister under Raffarin.` },
      { year: 2015, fr: `Élu président de la région Nord-Pas-de-Calais-Picardie.`, en: `Elected president of Nord-Pas-de-Calais-Picardie region.` },
      { year: 2021, fr: `Réélu en Hauts-de-France en barrant la route au RN.`, en: `Re-elected in Hauts-de-France, blocking the RN.` },
    ],
    disclaimer: {
      fr: `Il est perçu comme moins idéologique que Wauquiez, davantage focalisé sur l'efficacité gestionnaire et le dialogue social.`,
      en: `He is seen as less ideological than Wauquiez, with more focus on managerial effectiveness and social dialogue.`,
    },
    profile: {
      ECONOMY: 72, SOCIAL: 38, IMMIGRATION: 28, SECURITY: 28,
      ENVIRONMENT: 42, DEMOCRACY: 48, GLOBAL: 52, PUBLIC_SERVICES: 38,
    },
  },

  {
    id: `pecresse`,
    name: `Valérie Pécresse`,
    flag: `🇫🇷`,
    emoji: `📊`,
    family: `right`,
    party: { fr: `Les Républicains`, en: `The Republicans` },
    role: { fr: `Présidente de la Région Île-de-France`, en: `President of Île-de-France Region` },
    short_summary: {
      fr: `Candidate LR à la présidentielle 2022, technocrate libérale-conservatrice, présidente d'Île-de-France.`,
      en: `LR candidate in 2022, liberal-conservative technocrat, president of Île-de-France.`,
    },
    description: {
      fr: `Valérie Pécresse est candidate de LR à la présidentielle de 2022, obtenant 4,78 % des voix — le plus mauvais score d'un candidat LR depuis des décennies. Elle préside la région Île-de-France depuis 2015 et défend une ligne libérale-conservatrice sur l'économie et l'immigration. Sa campagne, marquée par plusieurs maladresses, n'a pas réussi à enrayer la dynamique du RN.`,
      en: `Valérie Pécresse was LR's candidate in the 2022 presidential election, obtaining 4.78% — the worst score for an LR candidate in decades. She has presided over the Île-de-France region since 2015 and defends a liberal-conservative line on economics and immigration. Her campaign, marked by several missteps, failed to stem the RN's momentum.`,
    },
    key_positions: {
      fr: [
        `Réduction de 10 % des dépenses de l'État.`,
        `Immigration : révision du droit du sol, maîtrise des flux migratoires.`,
        `Sécurité : doublement du budget des forces de l'ordre.`,
        `Réforme de l'assurance-chômage pour inciter au retour à l'emploi.`,
        `Investissements dans les transports franciliens (Grand Paris Express).`,
      ],
      en: [
        `10% reduction in state spending.`,
        `Immigration: revision of birthright citizenship, migration control.`,
        `Security: doubling the law enforcement budget.`,
        `Unemployment insurance reform to incentivise return to work.`,
        `Investments in Île-de-France transport (Grand Paris Express).`,
      ],
    },
    key_facts: {
      fr: [
        `Son score de 4,78 % en 2022 a symbolisé l'effondrement du centre-droit traditionnel.`,
        `A dû rembourser des dettes de campagne, LR étant incapable de financer seul.`,
      ],
      en: [
        `Her 4.78% in 2022 symbolised the collapse of the traditional centre-right.`,
        `Had to repay campaign debts, as LR was unable to fund them alone.`,
      ],
    },
    career_timeline: [
      { year: 2004, fr: `Secrétaire d'État au Budget sous Raffarin.`, en: `Junior Budget Minister under Raffarin.` },
      { year: 2015, fr: `Élue présidente de la région Île-de-France.`, en: `Elected president of the Île-de-France region.` },
      { year: 2022, fr: `Candidate LR à la présidentielle, obtient 4,78 %.`, en: `LR presidential candidate, obtains 4.78%.` },
    ],
    disclaimer: {
      fr: `Son score catastrophique à la présidentielle a symbolisé le déclin du centre-droit traditionnel face aux polarisations macroniste et RN.`,
      en: `Her catastrophic presidential score symbolised the decline of the traditional centre-right in the face of Macronist and RN polarisation.`,
    },
    profile: {
      ECONOMY: 75, SOCIAL: 35, IMMIGRATION: 22, SECURITY: 28,
      ENVIRONMENT: 40, DEMOCRACY: 48, GLOBAL: 55, PUBLIC_SERVICES: 30,
    },
  },

  {
    id: `ciotti`,
    name: `Éric Ciotti`,
    flag: `🇫🇷`,
    emoji: `🏔️`,
    family: `right`,
    party: { fr: `Union des droites pour la République (UXD)`, en: `Union of the Rights for the Republic (UXD)` },
    role: { fr: `Ancien président de LR, député des Alpes-Maritimes`, en: `Former LR president, MP for Alpes-Maritimes` },
    short_summary: {
      fr: `Ancien président de LR, exclu pour avoir proposé une alliance avec le RN en 2024.`,
      en: `Former LR president, expelled for proposing an alliance with the RN in 2024.`,
    },
    description: {
      fr: `Éric Ciotti a présidé Les Républicains de 2022 à 2024 avant d'être exclu du parti après avoir proposé une alliance avec le Rassemblement national lors des législatives. Il a fondé l'UXD pour représenter une droite nationale souverainiste. Issu du département des Alpes-Maritimes, il défend des positions parmi les plus dures de la droite républicaine.`,
      en: `Éric Ciotti led Les Républicains from 2022 to 2024 before being expelled from the party after proposing an alliance with the Rassemblement national during the legislative elections. He founded UXD to represent a national sovereignist right. From the Alpes-Maritimes, he defends some of the hardest positions on the Republican right.`,
    },
    key_positions: {
      fr: [
        `Immigration : remise en cause du droit du sol, expulsions massives.`,
        `Alliance stratégique avec le RN jugée nécessaire pour gouverner.`,
        `Sécurité : peines plancher, durcissement des sanctions pénales.`,
        `Refus de l'aide médicale d'État.`,
        `Souverainisme : critique de l'Union européenne et de ses politiques migratoires.`,
      ],
      en: [
        `Immigration: questioning of birthright citizenship, mass deportations.`,
        `Strategic alliance with the RN deemed necessary for governance.`,
        `Security: minimum sentences, harsher criminal penalties.`,
        `Opposition to State Medical Aid.`,
        `Sovereignism: criticism of the EU and its migration policies.`,
      ],
    },
    key_facts: {
      fr: [
        `Son alliance avec le RN a provoqué une crise interne chez LR et sa propre exclusion du parti.`,
        `Réélu député en 2024 sous l'étiquette UXD, il conserve un ancrage local solide.`,
      ],
      en: [
        `His alliance with the RN triggered an internal LR crisis and his own expulsion from the party.`,
        `Re-elected MP in 2024 under the UXD banner, he retains a solid local base.`,
      ],
    },
    career_timeline: [
      { year: 2007, fr: `Élu député des Alpes-Maritimes pour la première fois.`, en: `First elected MP for Alpes-Maritimes.` },
      { year: 2022, fr: `Élu président de LR.`, en: `Elected LR president.` },
      { year: 2024, fr: `Exclu de LR après avoir proposé un accord avec le RN ; fonde l'UXD.`, en: `Expelled from LR after proposing a deal with the RN; founded UXD.` },
    ],
    disclaimer: {
      fr: `Son alliance avec le RN a divisé la droite traditionnelle et illustre le repositionnement d'une partie du conservatisme vers l'extrême droite.`,
      en: `His alliance with the RN divided the traditional right and illustrates the ongoing shift of part of conservatism toward the far right.`,
    },
    profile: {
      ECONOMY: 75, SOCIAL: 18, IMMIGRATION: 12, SECURITY: 15,
      ENVIRONMENT: 30, DEMOCRACY: 32, GLOBAL: 22, PUBLIC_SERVICES: 25,
    },
  },

  {
    id: `retailleau`,
    name: `Bruno Retailleau`,
    flag: `🇫🇷`,
    emoji: `⚖️`,
    family: `right`,
    party: { fr: `Les Républicains`, en: `The Republicans` },
    role: { fr: `Ministre de l'Intérieur`, en: `Minister of the Interior` },
    short_summary: {
      fr: `Ministre de l'Intérieur depuis 2024, représentant de l'aile catholique et conservatrice de LR.`,
      en: `Interior Minister since 2024, representing the Catholic and conservative wing of LR.`,
    },
    description: {
      fr: `Bruno Retailleau est nommé ministre de l'Intérieur en septembre 2024. Sénateur de Vendée depuis 2004, il est connu pour ses positions très conservatrices sur l'immigration, la sécurité et les valeurs familiales. Il représente l'aile la plus à droite de LR et a parfois tenu des propos controversés sur l'État de droit.`,
      en: `Bruno Retailleau was appointed Minister of the Interior in September 2024. Senator for Vendée since 2004, he is known for his highly conservative positions on immigration, security and family values. He represents the furthest right wing of LR and has sometimes made controversial statements on the rule of law.`,
    },
    key_positions: {
      fr: [
        `Immigration : expulsions accélérées, remise en cause des protections juridiques des étrangers.`,
        `Opposition au mariage pour tous, à la PMA pour les femmes seules et à l'euthanasie.`,
        `Sécurité : fermeté absolue, peine de mort évoquée de manière allusive.`,
        `Défense de l'identité nationale et des valeurs chrétiennes de la France.`,
        `Réduction du nombre de fonctionnaires territoriaux.`,
      ],
      en: [
        `Immigration: accelerated deportations, challenging legal protections for foreigners.`,
        `Opposition to same-sex marriage, IVF for single women and euthanasia.`,
        `Security: absolute firmness, death penalty alluded to.`,
        `Defence of national identity and France's Christian values.`,
        `Reduction in the number of local government civil servants.`,
      ],
    },
    key_facts: {
      fr: [
        `A déclaré en 2024 que "l'État de droit ne devait pas être un frein à l'action politique", suscitant une vive polémique.`,
        `A voté contre la constitutionnalisation de l'IVG en 2024.`,
      ],
      en: [
        `Declared in 2024 that "the rule of law should not be a brake on political action", sparking sharp controversy.`,
        `Voted against the constitutionalisation of abortion in 2024.`,
      ],
    },
    career_timeline: [
      { year: 2004, fr: `Élu sénateur de la Vendée.`, en: `Elected Senator for Vendée.` },
      { year: 2015, fr: `Président du groupe LR au Sénat.`, en: `President of the LR group in the Senate.` },
      { year: 2024, fr: `Nommé ministre de l'Intérieur dans le gouvernement Barnier.`, en: `Appointed Interior Minister in the Barnier government.` },
    ],
    disclaimer: {
      fr: `Ses déclarations sur l'État de droit et ses positions contre certaines libertés civiles ont suscité des controverses au sein même de la coalition gouvernementale.`,
      en: `His statements on the rule of law and positions against certain civil liberties have sparked controversy even within the governing coalition.`,
    },
    profile: {
      ECONOMY: 72, SOCIAL: 22, IMMIGRATION: 15, SECURITY: 15,
      ENVIRONMENT: 35, DEMOCRACY: 38, GLOBAL: 32, PUBLIC_SERVICES: 28,
    },
  },

  // ── Extrême droite ─────────────────────────────────────────────────────────

  {
    id: `le_pen`,
    name: `Marine Le Pen`,
    flag: `🇫🇷`,
    emoji: `🌊`,
    family: `far_right`,
    party: { fr: `Rassemblement national`, en: `National Rally` },
    role: { fr: `Présidente du groupe RN à l'Assemblée nationale`, en: `Leader of RN group in National Assembly` },
    short_summary: {
      fr: `Principale figure de l'extrême droite française, finaliste de la présidentielle en 2017 et 2022.`,
      en: `Leading figure of the French far right, presidential runner-up in 2017 and 2022.`,
    },
    description: {
      fr: `Marine Le Pen a présidé le Front national puis le Rassemblement national de 2011 à 2021. Candidate à la présidentielle en 2012, 2017 et 2022, elle arrive au second tour face à Macron en 2022, obtenant 41,45 % des voix. Sa stratégie de « dédiabolisation » a contribué à normaliser le RN dans le paysage politique français. Elle fait face à un procès en 2025 pour détournement de fonds européens.`,
      en: `Marine Le Pen led the Front national then Rassemblement national from 2011 to 2021. A presidential candidate in 2012, 2017 and 2022, she reached the second round against Macron in 2022, obtaining 41.45%. Her "de-demonisation" strategy helped normalise the RN in French politics. She faces trial in 2025 for misappropriation of European funds.`,
    },
    key_positions: {
      fr: [
        `Immigration : préférence nationale, remise en cause du droit du sol, expulsions massives.`,
        `Sortie de l'Union européenne à terme, refus de la monnaie unique dans certains scénarios.`,
        `Protectionnisme économique et défense des services publics.`,
        `Retrait de l'OTAN ou réduction de l'engagement atlantiste.`,
        `Laïcité : interdiction du voile dans l'espace public.`,
      ],
      en: [
        `Immigration: national preference, challenging birthright citizenship, mass deportations.`,
        `Long-term EU exit, rejection of the single currency in some scenarios.`,
        `Economic protectionism and defence of public services.`,
        `NATO withdrawal or reduced Atlanticist engagement.`,
        `Secularism: ban on the veil in public spaces.`,
      ],
    },
    key_facts: {
      fr: [
        `Jugée en 2025 pour détournement de fonds européens via des assistants parlementaires fictifs — risque d'inéligibilité.`,
        `A obtenu 41,45 % au second tour de la présidentielle 2022, record historique pour l'extrême droite française.`,
      ],
      en: [
        `Tried in 2025 for misappropriating European funds via fictitious parliamentary assistants — at risk of ineligibility.`,
        `Obtained 41.45% in the 2022 presidential second round, a historic record for the French far right.`,
      ],
    },
    career_timeline: [
      { year: 2011, fr: `Élue présidente du Front national.`, en: `Elected president of the Front national.` },
      { year: 2017, fr: `Finaliste de la présidentielle, obtient 33,9 % au second tour.`, en: `Presidential runner-up, obtains 33.9% in the second round.` },
      { year: 2022, fr: `Finaliste à nouveau avec 41,45 % face à Macron.`, en: `Runner-up again with 41.45% against Macron.` },
    ],
    disclaimer: {
      fr: `Sa « dédiabolisation » du RN a permis une montée en puissance électorale, mais les enquêtes judiciaires en cours pèsent sur sa candidature future.`,
      en: `Her "de-demonisation" of the RN enabled an electoral rise, but ongoing judicial proceedings weigh on her future candidacy.`,
    },
    profile: {
      ECONOMY: 40, SOCIAL: 15, IMMIGRATION: 5, SECURITY: 10,
      ENVIRONMENT: 28, DEMOCRACY: 30, GLOBAL: 10, PUBLIC_SERVICES: 55,
    },
  },

  {
    id: `bardella`,
    name: `Jordan Bardella`,
    flag: `🇫🇷`,
    emoji: `📢`,
    family: `far_right`,
    party: { fr: `Rassemblement national`, en: `National Rally` },
    role: { fr: `Président du Rassemblement national`, en: `President of the National Rally` },
    short_summary: {
      fr: `Président du RN depuis 2021, figure emblématique de la stratégie jeunesse et réseaux sociaux du parti.`,
      en: `RN president since 2021, emblematic figure of the party's youth and social media strategy.`,
    },
    description: {
      fr: `Jordan Bardella préside le Rassemblement national depuis 2021 et a été la tête de liste du parti aux élections européennes de 2024, où le RN obtient le premier score national. Très présent sur les réseaux sociaux, il cible particulièrement la jeunesse. Son style policé masque un positionnement idéologique aligné avec les lignes dures du parti.`,
      en: `Jordan Bardella has presided over the Rassemblement national since 2021 and led the party's list in the 2024 European elections, where the RN obtained the top national score. Highly active on social media, he particularly targets young voters. His polished style conceals an ideological positioning aligned with the party's hard lines.`,
    },
    key_positions: {
      fr: [
        `Immigration zéro : suspension de l'immigration légale, expulsions massives.`,
        `Priorité nationale dans l'accès aux aides sociales et à l'emploi.`,
        `Retrait de la France des traités qui « entravent la souveraineté nationale ».`,
        `Refus de l'aide militaire supplémentaire à l'Ukraine.`,
        `Défense du pouvoir d'achat par la baisse de la TVA sur l'énergie et l'alimentation.`,
      ],
      en: [
        `Zero immigration: suspension of legal immigration, mass deportations.`,
        `National priority in access to social benefits and employment.`,
        `Withdrawal from treaties that "hinder national sovereignty".`,
        `Refusal of further military aid to Ukraine.`,
        `Defence of purchasing power through cuts to VAT on energy and food.`,
      ],
    },
    key_facts: {
      fr: [
        `Le RN est devenu le premier parti de France aux européennes 2024 sous sa direction, avec plus de 31 % des voix.`,
        `Ancien assistant parlementaire au Parlement européen, il est cité dans l'affaire des assistants fictifs du RN.`,
      ],
      en: [
        `The RN became France's leading party in the 2024 European elections under his leadership, with over 31% of the vote.`,
        `A former parliamentary assistant at the European Parliament, he is mentioned in the RN fictitious assistants affair.`,
      ],
    },
    career_timeline: [
      { year: 2019, fr: `Tête de liste RN aux élections européennes (23,3 %).`, en: `Led RN list in European elections (23.3%).` },
      { year: 2021, fr: `Élu président du Rassemblement national.`, en: `Elected president of the Rassemblement national.` },
      { year: 2024, fr: `Mène le RN à 31,4 % aux européennes ; candidat manqué à Matignon.`, en: `Led RN to 31.4% in European elections; failed candidate for PM.` },
    ],
    disclaimer: {
      fr: `Son profil public très lisse masque un positionnement idéologique aligné avec les lignes dures du RN sur l'immigration et le rejet du multiculturalisme.`,
      en: `His very polished public profile conceals an ideological positioning aligned with the RN's hard lines on immigration and rejection of multiculturalism.`,
    },
    profile: {
      ECONOMY: 45, SOCIAL: 12, IMMIGRATION: 5, SECURITY: 8,
      ENVIRONMENT: 22, DEMOCRACY: 28, GLOBAL: 10, PUBLIC_SERVICES: 52,
    },
  },

  {
    id: `zemmour`,
    name: `Éric Zemmour`,
    flag: `🇫🇷`,
    emoji: `📖`,
    family: `far_right`,
    party: { fr: `Reconquête`, en: `Reconquête` },
    role: { fr: `Président de Reconquête, candidat présidentiel 2022`, en: `President of Reconquête, 2022 presidential candidate` },
    short_summary: {
      fr: `Essayiste et polémiste devenu politique, prône un nationalisme civilisationnel radical.`,
      en: `Essayist and polemicist turned politician, advocating radical civilisationist nationalism.`,
    },
    description: {
      fr: `Éric Zemmour est un polémiste et essayiste qui fonde le parti Reconquête en 2021 avant de se présenter à la présidentielle de 2022, obtenant 7,07 % des voix. Il prône une vision civilisationniste et nationaliste radicale, dépassant en dureté le programme du RN sur l'immigration et l'identité. Il a été condamné à plusieurs reprises pour incitation à la haine raciale.`,
      en: `Éric Zemmour is a polemicist and essayist who founded the Reconquête party in 2021 before running in the 2022 presidential election, obtaining 7.07%. He advocates a radical civilisationist and nationalist vision, harder than the RN's programme on immigration and identity. He has been convicted several times for incitement to racial hatred.`,
    },
    key_positions: {
      fr: [
        `Immigration : arrêt total de l'immigration légale, renvoi des étrangers en situation irrégulière.`,
        `Remise en cause du regroupement familial et du droit du sol.`,
        `Identité nationale : défense d'une France « gauloise » et chrétienne, contre l'islam politique.`,
        `Souverainisme radical : sortie de l'OTAN, révision des traités européens.`,
        `Économie libérale : baisse des impôts, réduction de la dépense publique.`,
      ],
      en: [
        `Immigration: complete halt to legal immigration, return of irregular migrants.`,
        `Challenging family reunification and birthright citizenship.`,
        `National identity: defence of a "Gallic" and Christian France, against political Islam.`,
        `Radical sovereignism: NATO exit, revision of European treaties.`,
        `Liberal economics: tax cuts, reduction of public spending.`,
      ],
    },
    key_facts: {
      fr: [
        `Condamné à plusieurs reprises pour provocation à la haine raciale et religieuse.`,
        `Reconquête n'a obtenu aucun député lors des législatives 2022 malgré son score présidentiel.`,
      ],
      en: [
        `Convicted multiple times for incitement to racial and religious hatred.`,
        `Reconquête won no MPs in the 2022 legislative elections despite his presidential score.`,
      ],
    },
    career_timeline: [
      { year: 2014, fr: `Publication du Suicide français, best-seller qui lance sa carrière politique.`, en: `Published Le Suicide français, a bestseller that launched his political career.` },
      { year: 2021, fr: `Fonde Reconquête et annonce sa candidature présidentielle.`, en: `Founded Reconquête and announced his presidential candidacy.` },
      { year: 2022, fr: `Obtient 7,07 % au premier tour de la présidentielle.`, en: `Obtained 7.07% in the first round of the presidential election.` },
    ],
    disclaimer: {
      fr: `Condamné à plusieurs reprises pour incitation à la haine raciale, ses positions sur l'islam et l'immigration font l'objet de vifs débats judiciaires et académiques.`,
      en: `Convicted several times for incitement to racial hatred, his positions on Islam and immigration are the subject of intense judicial and academic debate.`,
    },
    profile: {
      ECONOMY: 72, SOCIAL: 5, IMMIGRATION: 3, SECURITY: 5,
      ENVIRONMENT: 20, DEMOCRACY: 22, GLOBAL: 5, PUBLIC_SERVICES: 22,
    },
  },

  {
    id: `marechal`,
    name: `Marion Maréchal`,
    flag: `🇫🇷`,
    emoji: `🌹`,
    family: `far_right`,
    party: { fr: `Reconquête`, en: `Reconquête` },
    role: { fr: `Vice-présidente de Reconquête, ancienne députée`, en: `Vice-president of Reconquête, former MP` },
    short_summary: {
      fr: `Petite-fille de Jean-Marie Le Pen, figure de la droite catholique et identitaire radicale.`,
      en: `Jean-Marie Le Pen's granddaughter, figure of radical Catholic and identitarian right.`,
    },
    description: {
      fr: `Marion Maréchal, petite-fille de Jean-Marie Le Pen, a été la plus jeune députée de l'histoire de la Ve République en 2012. Après une pause politique, elle rejoint Reconquête en 2022, représentant l'aile catholique-conservatrice et identitaire du mouvement. Son positionnement dépasse Zemmour sur les questions sociétales par son ancrage dans le conservatisme social traditionnel.`,
      en: `Marion Maréchal, granddaughter of Jean-Marie Le Pen, was the youngest MP in the history of the Fifth Republic in 2012. After a political break, she joined Reconquête in 2022, representing the Catholic-conservative and identitarian wing of the movement. Her positioning goes beyond Zemmour on social issues through her anchoring in traditional social conservatism.`,
    },
    key_positions: {
      fr: [
        `Défense d'une identité catholique et civilisationnelle de la France.`,
        `Opposition ferme à l'avortement, au mariage pour tous et à la PMA.`,
        `Immigration : identitarisme, remigration comme terme assumé.`,
        `Éducation : défense de l'enseignement privé catholique.`,
        `Souverainisme culturel : contre le multiculturalisme et le wokisme.`,
      ],
      en: [
        `Defence of a Catholic and civilisational identity for France.`,
        `Firm opposition to abortion, same-sex marriage and IVF.`,
        `Immigration: identitarianism, remigration as an openly used term.`,
        `Education: defence of Catholic private education.`,
        `Cultural sovereignism: against multiculturalism and "wokism".`,
      ],
    },
    key_facts: {
      fr: [
        `Élue député à 22 ans en 2012, la plus jeune de la Ve République.`,
        `Sa rupture avec sa tante Marine Le Pen illustre les fractures au sein de la famille Le Pen.`,
      ],
      en: [
        `Elected MP at 22 in 2012, the youngest in the Fifth Republic.`,
        `Her split from her aunt Marine Le Pen illustrates the fractures within the Le Pen family.`,
      ],
    },
    career_timeline: [
      { year: 2012, fr: `Élue députée du Vaucluse à 22 ans.`, en: `Elected MP for Vaucluse at age 22.` },
      { year: 2017, fr: `Se retire de la vie politique, fonde Sciences Po Libertés et Nations.`, en: `Withdrew from politics, founded Sciences Po Libertés et Nations.` },
      { year: 2022, fr: `Rejoint Reconquête et soutient la candidature de Zemmour.`, en: `Joined Reconquête and backed Zemmour's candidacy.` },
    ],
    disclaimer: {
      fr: `Son départ du FN et ses positions inspirées du conservatisme américain la distinguent de sa tante Marine Le Pen, avec qui les relations sont distantes.`,
      en: `Her departure from the FN and positions inspired by American conservatism distinguish her from her aunt Marine Le Pen, with whom relations are distant.`,
    },
    profile: {
      ECONOMY: 68, SOCIAL: 8, IMMIGRATION: 5, SECURITY: 8,
      ENVIRONMENT: 22, DEMOCRACY: 28, GLOBAL: 8, PUBLIC_SERVICES: 28,
    },
  },

  {
    id: `dupont_aignan`,
    name: `Nicolas Dupont-Aignan`,
    flag: `🇫🇷`,
    emoji: `🐓`,
    family: `far_right`,
    party: { fr: `Debout la France`, en: `Debout la France` },
    role: { fr: `Président de Debout la France, député de l'Essonne`, en: `President of Debout la France, MP for Essonne` },
    short_summary: {
      fr: `Souverainiste gaulliste, critique de l'UE et de la mondialisation, sur une ligne moins radicale que le RN.`,
      en: `Gaullist sovereignist, critic of the EU and globalisation, on a less radical line than the RN.`,
    },
    description: {
      fr: `Nicolas Dupont-Aignan préside Debout la France depuis 2007 et a été candidat à plusieurs élections présidentielles. Il défend un gaullisme souverainiste critique de l'Union européenne et de la mondialisation, sur une ligne nationaliste moins radicale que le RN. Son soutien à Marine Le Pen en 2017 et ses positions anti-vaccin ont marginalisé sa présence dans le débat national.`,
      en: `Nicolas Dupont-Aignan has led Debout la France since 2007 and has run in several presidential elections. He defends a sovereignist Gaullism critical of the EU and globalisation, on a less radical nationalist line than the RN. His support for Marine Le Pen in 2017 and his anti-vaccine positions have marginalised him in the national debate.`,
    },
    key_positions: {
      fr: [
        `Sortie ou refonte profonde de l'Union européenne.`,
        `Retour au franc ou refonte de la zone euro.`,
        `Maîtrise de l'immigration dans une logique souverainiste.`,
        `Retour à la retraite à 60 ans, défense du modèle social français.`,
        `Industrie française : relocalisation, protectionnisme ciblé.`,
      ],
      en: [
        `Exit from or deep reform of the European Union.`,
        `Return to the franc or reform of the eurozone.`,
        `Control of immigration through a sovereignist logic.`,
        `Return to retirement at 60, defence of the French social model.`,
        `French industry: relocalisation, targeted protectionism.`,
      ],
    },
    key_facts: {
      fr: [
        `A soutenu Marine Le Pen au second tour de 2017, ce qui a durablement entaché son image de républicain.`,
        `Ses positions sceptiques sur les vaccins Covid ont alimenté sa marginalisation politique.`,
      ],
      en: [
        `Backed Marine Le Pen in the 2017 second round, permanently damaging his image as a republican.`,
        `His sceptical positions on Covid vaccines contributed to his political marginalisation.`,
      ],
    },
    career_timeline: [
      { year: 2007, fr: `Fonde Debout la République, futur Debout la France.`, en: `Founded Debout la République, future Debout la France.` },
      { year: 2012, fr: `Obtient 1,79 % à la présidentielle.`, en: `Obtained 1.79% in the presidential election.` },
      { year: 2017, fr: `Soutient Le Pen au second tour après avoir obtenu 4,7 % au premier.`, en: `Backed Le Pen in the second round after obtaining 4.7% in the first.` },
    ],
    disclaimer: {
      fr: `Son soutien à Marine Le Pen en 2017 et ses positions anti-vaccin l'ont écarté du débat politique central malgré un enracinement local solide.`,
      en: `His support for Marine Le Pen in 2017 and his anti-vaccine positions have marginalised him despite a solid local base.`,
    },
    profile: {
      ECONOMY: 48, SOCIAL: 22, IMMIGRATION: 18, SECURITY: 22,
      ENVIRONMENT: 35, DEMOCRACY: 42, GLOBAL: 10, PUBLIC_SERVICES: 52,
    },
  },

  // ── Gauche ─────────────────────────────────────────────────────────────────

  {
    id: `melenchon`,
    name: `Jean-Luc Mélenchon`,
    flag: `🇫🇷`,
    emoji: `✊`,
    family: `left`,
    party: { fr: `La France insoumise`, en: `La France Insoumise` },
    role: { fr: `Fondateur de LFI, ancien candidat présidentiel`, en: `Founder of LFI, former presidential candidate` },
    short_summary: {
      fr: `Fondateur de LFI, principale figure de la gauche radicale française, troisième à la présidentielle 2022.`,
      en: `Founder of LFI and leading figure of the French radical left, third in the 2022 presidential election.`,
    },
    description: {
      fr: `Jean-Luc Mélenchon a fondé La France insoumise en 2016, après avoir quitté le Parti socialiste. Candidat à la présidentielle en 2012, 2017 et 2022, il arrive troisième avec 21,95 % en 2022. Il défend un programme de rupture avec l'Union européenne telle qu'elle existe, la planification écologique et le partage des richesses. Ses positions de politique étrangère sont très controversées, y compris à gauche.`,
      en: `Jean-Luc Mélenchon founded La France Insoumise in 2016 after leaving the Socialist Party. A presidential candidate in 2012, 2017 and 2022, he came third with 21.95% in 2022. He advocates a programme of rupture with the EU as it stands, ecological planning and wealth redistribution. His foreign policy positions are highly controversial, including within the left.`,
    },
    key_positions: {
      fr: [
        `VIe République : constituante, proportionnelle, dissolution du Sénat.`,
        `SMIC à 1 600 € nets, retraite à 60 ans, semaine de 32 heures.`,
        `Planification écologique : investissements publics massifs dans la transition.`,
        `Service public de l'énergie, renationalisation d'EDF.`,
        `Politique étrangère non-alignée : critique de l'OTAN, soutien à la Palestine.`,
      ],
      en: [
        `Sixth Republic: constitutional assembly, proportional representation, dissolution of the Senate.`,
        `Minimum wage of €1,600 net, retirement at 60, 32-hour week.`,
        `Ecological planning: massive public investment in the transition.`,
        `Public energy service, renationalisation of EDF.`,
        `Non-aligned foreign policy: criticism of NATO, support for Palestine.`,
      ],
    },
    key_facts: {
      fr: [
        `Ses positions sur la Russie, le Venezuela et la Palestine ont suscité des accusations de complaisance envers des régimes autoritaires.`,
        `LFI est sous enquête judiciaire pour des irrégularités dans la gestion du parti.`,
      ],
      en: [
        `His positions on Russia, Venezuela and Palestine have drawn accusations of complacency towards authoritarian regimes.`,
        `LFI is under judicial investigation for irregularities in party management.`,
      ],
    },
    career_timeline: [
      { year: 2008, fr: `Fonde le Parti de gauche après avoir quitté le PS.`, en: `Founded the Left Party after leaving the Socialist Party.` },
      { year: 2016, fr: `Crée La France insoumise.`, en: `Created La France Insoumise.` },
      { year: 2022, fr: `Obtient 21,95 % à la présidentielle ; crée la NUPES.`, en: `Obtained 21.95% in the presidential race; created the NUPES coalition.` },
    ],
    disclaimer: {
      fr: `Ses positions sur la politique étrangère (Russie, Venezuela, Palestine) sont très controversées, y compris au sein de la gauche française.`,
      en: `His positions on foreign policy (Russia, Venezuela, Palestine) are highly controversial, including within the French left.`,
    },
    profile: {
      ECONOMY: 8, SOCIAL: 85, IMMIGRATION: 88, SECURITY: 82,
      ENVIRONMENT: 78, DEMOCRACY: 72, GLOBAL: 35, PUBLIC_SERVICES: 92,
    },
  },

  {
    id: `ruffin`,
    name: `François Ruffin`,
    flag: `🇫🇷`,
    emoji: `🎬`,
    family: `left`,
    party: { fr: `Indépendant (ex-LFI)`, en: `Independent (former LFI)` },
    role: { fr: `Député de la Somme, cinéaste`, en: `MP for Somme, filmmaker` },
    short_summary: {
      fr: `Député de la Somme, cinéaste engagé, voix d'une gauche populaire ancrée dans les classes ouvrières.`,
      en: `MP for Somme, committed filmmaker, voice of a popular left rooted in the working classes.`,
    },
    description: {
      fr: `François Ruffin est député de la Somme depuis 2017, fondateur du journal Fakir et réalisateur du film « Merci Patron ! ». Après avoir quitté LFI en 2024, il défend une gauche populaire ancrée dans les classes ouvrières, distincte du gauche libérale-culturelle parisienne. Il cherche à reconstruire une gauche moins clivante sur les questions de société.`,
      en: `François Ruffin has been MP for Somme since 2017, founder of the Fakir newspaper and director of "Merci Patron!". After leaving LFI in 2024, he advocates a popular left rooted in the working classes, distinct from the Parisian liberal-cultural left. He seeks to rebuild a less polarising left on social issues.`,
    },
    key_positions: {
      fr: [
        `Défense du pouvoir d'achat des classes populaires : salaires, loyers, énergie.`,
        `Réindustrialisation et relocalisation de la production.`,
        `Critique du « wokisme » perçu comme un obstacle à l'unité de la gauche.`,
        `Services publics : hôpital, école, transports comme priorités absolues.`,
        `Sobriété écologique ancrée dans le quotidien des gens ordinaires.`,
      ],
      en: [
        `Defence of working-class purchasing power: wages, rents, energy.`,
        `Reindustrialisation and relocalisation of production.`,
        `Critique of "wokism" seen as an obstacle to left-wing unity.`,
        `Public services: hospital, school, transport as absolute priorities.`,
        `Ecological sobriety rooted in the everyday lives of ordinary people.`,
      ],
    },
    key_facts: {
      fr: [
        `Son film « Merci Patron ! » (2016) l'a rendu célèbre avant son élection comme député.`,
        `Son départ de LFI en 2024 traduit une rupture profonde avec la ligne Mélenchon.`,
      ],
      en: [
        `His film "Merci Patron!" (2016) made him famous before his election as MP.`,
        `His departure from LFI in 2024 reflects a deep break with the Mélenchon line.`,
      ],
    },
    career_timeline: [
      { year: 2016, fr: `Son film « Merci Patron ! » rencontre un succès inattendu.`, en: `His film "Merci Patron!" achieved unexpected success.` },
      { year: 2017, fr: `Élu député de la Somme sous étiquette LFI.`, en: `Elected MP for Somme under LFI banner.` },
      { year: 2024, fr: `Quitte LFI pour siéger en indépendant.`, en: `Left LFI to sit as an independent.` },
    ],
    disclaimer: {
      fr: `Son départ de LFI traduit des tensions sur la stratégie politique et le style de leadership de Mélenchon.`,
      en: `His departure from LFI reflects tensions over political strategy and Mélenchon's leadership style.`,
    },
    profile: {
      ECONOMY: 12, SOCIAL: 72, IMMIGRATION: 72, SECURITY: 75,
      ENVIRONMENT: 72, DEMOCRACY: 80, GLOBAL: 52, PUBLIC_SERVICES: 90,
    },
  },

  {
    id: `panot`,
    name: `Mathilde Panot`,
    flag: `🇫🇷`,
    emoji: `🔴`,
    family: `left`,
    party: { fr: `La France insoumise`, en: `La France Insoumise` },
    role: { fr: `Présidente du groupe LFI à l'Assemblée nationale`, en: `President of the LFI group in the National Assembly` },
    short_summary: {
      fr: `Présidente du groupe LFI à l'Assemblée, représentante de la ligne la plus radicale du parti.`,
      en: `President of the LFI parliamentary group, representing the party's most radical line.`,
    },
    description: {
      fr: `Mathilde Panot préside le groupe LFI à l'Assemblée nationale depuis 2022. Proche de Mélenchon, elle représente la ligne la plus radicale de LFI sur les questions sociales, environnementales et de politique étrangère. Ses sorties sur le conflit israélo-palestinien ont renforcé l'isolement du groupe au Parlement.`,
      en: `Mathilde Panot has presided over the LFI group in the National Assembly since 2022. Close to Mélenchon, she represents the most radical line of LFI on social, environmental and foreign policy issues. Her statements on the Israeli-Palestinian conflict have reinforced the group's isolation in Parliament.`,
    },
    key_positions: {
      fr: [
        `VIe République, constituante, rupture institutionnelle profonde.`,
        `Planification écologique d'urgence, bifurcation économique radicale.`,
        `Reconnaissance de l'État palestinien, cessez-le-feu immédiat à Gaza.`,
        `Services publics : hôpital, école, énergie comme droits fondamentaux.`,
        `Féminisme intersectionnel et antiracisme comme axes politiques centraux.`,
      ],
      en: [
        `Sixth Republic, constitutional assembly, deep institutional rupture.`,
        `Emergency ecological planning, radical economic bifurcation.`,
        `Recognition of the Palestinian state, immediate ceasefire in Gaza.`,
        `Public services: hospital, school, energy as fundamental rights.`,
        `Intersectional feminism and anti-racism as central political axes.`,
      ],
    },
    key_facts: {
      fr: [
        `Ses propos qualifiant les attaques du Hamas du 7 octobre de « résistance armée » ont provoqué une vive polémique.`,
        `LFI a déposé plus de 200 motions de censure et niches parlementaires en une législature.`,
      ],
      en: [
        `Her statements describing Hamas's October 7th attacks as "armed resistance" sparked sharp controversy.`,
        `LFI tabled over 200 no-confidence motions and parliamentary niche bills in one legislative term.`,
      ],
    },
    career_timeline: [
      { year: 2017, fr: `Élue députée de la 10e circonscription du Val-de-Marne.`, en: `Elected MP for the 10th constituency of Val-de-Marne.` },
      { year: 2020, fr: `Nommée présidente du groupe LFI à l'Assemblée.`, en: `Appointed president of the LFI group in the Assembly.` },
      { year: 2022, fr: `Réélue et maintenue à la tête du groupe LFI.`, en: `Re-elected and kept as head of the LFI group.` },
    ],
    disclaimer: {
      fr: `Ses sorties sur le conflit au Proche-Orient et ses positions sur l'antisionisme ont alimenté les polémiques et renforcé l'isolement du groupe LFI à l'Assemblée.`,
      en: `Her statements on the Middle East conflict and her positions on anti-Zionism have fuelled controversy and reinforced the isolation of the LFI group in the Assembly.`,
    },
    profile: {
      ECONOMY: 10, SOCIAL: 88, IMMIGRATION: 90, SECURITY: 85,
      ENVIRONMENT: 80, DEMOCRACY: 70, GLOBAL: 40, PUBLIC_SERVICES: 92,
    },
  },

  {
    id: `glucksmann`,
    name: `Raphaël Glucksmann`,
    flag: `🇫🇷`,
    emoji: `🌍`,
    family: `left`,
    party: { fr: `Parti socialiste`, en: `Socialist Party` },
    role: { fr: `Député européen`, en: `Member of the European Parliament` },
    short_summary: {
      fr: `Eurodéputé, figure d'une gauche pro-européenne et atlantiste, fermement opposée aux régimes autoritaires.`,
      en: `MEP, figure of a pro-European and Atlanticist left, firmly opposed to authoritarian regimes.`,
    },
    description: {
      fr: `Raphaël Glucksmann est eurodéputé depuis 2019 et a mené la liste PS-Place Publique aux élections européennes de 2024, obtenant 13,83 % des voix. Intellectuel engagé, il défend une gauche pro-européenne, atlantiste et fermement opposée aux régimes autoritaires. Sa ligne le distingue nettement du courant mélenchoniste sur la politique étrangère.`,
      en: `Raphaël Glucksmann has been an MEP since 2019 and led the PS-Place Publique list in the 2024 European elections, obtaining 13.83%. An engaged intellectual, he advocates a pro-European, Atlanticist left firmly opposed to authoritarian regimes. His line clearly distinguishes him from the Mélenchonist current on foreign policy.`,
    },
    key_positions: {
      fr: [
        `Soutien inconditionnel à l'Ukraine face à la Russie.`,
        `Europe fédérale : renforcement de la défense et des institutions communes.`,
        `Justice fiscale européenne : taxation des multinationales et des ultra-riches.`,
        `Transition écologique rapide et juste socialement.`,
        `Droits humains comme boussole de la politique étrangère européenne.`,
      ],
      en: [
        `Unconditional support for Ukraine against Russia.`,
        `Federal Europe: strengthening common defence and institutions.`,
        `European tax justice: taxing multinationals and the ultra-wealthy.`,
        `Rapid and socially just ecological transition.`,
        `Human rights as the compass of European foreign policy.`,
      ],
    },
    key_facts: {
      fr: [
        `A obtenu 13,83 % aux européennes 2024, score historique pour le PS depuis des années.`,
        `Fils du philosophe André Glucksmann, sa trajectoire intellectuelle est atypique en politique.`,
      ],
      en: [
        `Obtained 13.83% in the 2024 European elections, the PS's best score in years.`,
        `Son of philosopher André Glucksmann, his intellectual trajectory is atypical in politics.`,
      ],
    },
    career_timeline: [
      { year: 2019, fr: `Élu eurodéputé sous l'étiquette PS-Place Publique.`, en: `Elected MEP under the PS-Place Publique banner.` },
      { year: 2022, fr: `Publie « Est-ce ainsi que les hommes vivent ? », essai sur la gauche à reconstruire.`, en: `Published an essay on rebuilding the left.` },
      { year: 2024, fr: `Mène la liste PS aux européennes (13,83 %), renaissance du PS.`, en: `Led the PS list in European elections (13.83%), PS revival.` },
    ],
    disclaimer: {
      fr: `Son europhilie et son atlantisme le distinguent nettement du courant mélenchoniste, ouvrant des questions sur l'unité de la gauche.`,
      en: `His Europhilia and Atlanticism clearly distinguish him from the Mélenchonist current, raising questions about left-wing unity.`,
    },
    profile: {
      ECONOMY: 28, SOCIAL: 80, IMMIGRATION: 78, SECURITY: 72,
      ENVIRONMENT: 72, DEMOCRACY: 78, GLOBAL: 82, PUBLIC_SERVICES: 75,
    },
  },

  {
    id: `faure`,
    name: `Olivier Faure`,
    flag: `🇫🇷`,
    emoji: `🌹`,
    family: `left`,
    party: { fr: `Parti socialiste`, en: `Socialist Party` },
    role: { fr: `Premier secrétaire du Parti socialiste`, en: `First Secretary of the Socialist Party` },
    short_summary: {
      fr: `Premier secrétaire du PS depuis 2018, artisan de l'union de la gauche dans le Nouveau Front Populaire.`,
      en: `PS First Secretary since 2018, architect of left-wing unity in the Nouveau Front Populaire.`,
    },
    description: {
      fr: `Olivier Faure dirige le Parti socialiste depuis 2018 et a orienté le parti vers la participation au Nouveau Front Populaire lors des législatives de 2024. Il cherche à positionner le PS comme une force de gouvernement alternative au macronisme et à LFI. Sa stratégie d'union de la gauche est contestée au sein même du parti.`,
      en: `Olivier Faure has led the Socialist Party since 2018 and oriented the party toward participation in the Nouveau Front Populaire in the 2024 legislative elections. He seeks to position the PS as a governing alternative to Macronism and LFI. His left-unity strategy is contested even within the party.`,
    },
    key_positions: {
      fr: [
        `Union de la gauche comme condition nécessaire pour gouverner.`,
        `Augmentation des salaires et du SMIC.`,
        `Service public de l'énergie et de la santé renforcé.`,
        `Transition écologique programmée avec justice sociale.`,
        `Pro-européen, partisan d'une Europe sociale plus affirmée.`,
      ],
      en: [
        `Left-wing unity as a necessary condition for governance.`,
        `Wage increases and minimum wage rise.`,
        `Strengthened public energy and health services.`,
        `Programmed ecological transition with social justice.`,
        `Pro-European, advocate of a more assertive social Europe.`,
      ],
    },
    key_facts: {
      fr: [
        `Le PS a obtenu 64 sièges aux législatives 2024, son meilleur résultat depuis 2012, grâce au NFP.`,
        `Sa stratégie d'alliance avec LFI est vivement critiquée par l'aile droite du parti.`,
      ],
      en: [
        `The PS won 64 seats in the 2024 legislative elections, its best result since 2012, thanks to the NFP.`,
        `His alliance strategy with LFI is strongly criticised by the right wing of the party.`,
      ],
    },
    career_timeline: [
      { year: 2012, fr: `Élu député de Seine-et-Marne.`, en: `Elected MP for Seine-et-Marne.` },
      { year: 2018, fr: `Élu Premier secrétaire du PS.`, en: `Elected PS First Secretary.` },
      { year: 2024, fr: `Pilote l'entrée du PS dans le Nouveau Front Populaire.`, en: `Steered the PS into the Nouveau Front Populaire.` },
    ],
    disclaimer: {
      fr: `Sa stratégie d'union de la gauche avec LFI est contestée au sein même du PS par ceux qui craignent une marginalisation face au radicalisme mélenchoniste.`,
      en: `His strategy of left-wing unity with LFI is contested within the PS itself by those who fear the party being marginalised by Mélenchonist radicalism.`,
    },
    profile: {
      ECONOMY: 22, SOCIAL: 78, IMMIGRATION: 76, SECURITY: 70,
      ENVIRONMENT: 68, DEMOCRACY: 75, GLOBAL: 72, PUBLIC_SERVICES: 80,
    },
  },

  {
    id: `hidalgo`,
    name: `Anne Hidalgo`,
    flag: `🇫🇷`,
    emoji: `🗼`,
    family: `left`,
    party: { fr: `Parti socialiste`, en: `Socialist Party` },
    role: { fr: `Maire de Paris`, en: `Mayor of Paris` },
    short_summary: {
      fr: `Maire de Paris depuis 2014, connue pour ses politiques de mobilité douce et la gestion des JO 2024.`,
      en: `Mayor of Paris since 2014, known for her soft mobility policies and management of the 2024 Olympics.`,
    },
    description: {
      fr: `Anne Hidalgo est maire de Paris depuis 2014 et candidate à la présidentielle de 2022, n'obtenant que 1,75 % des voix. Son mandat à Paris est marqué par une politique cyclable ambitieuse, des projets de piétonnisation et la gestion des Jeux olympiques de 2024. Son score à la présidentielle a illustré l'effacement du PS au niveau national.`,
      en: `Anne Hidalgo has been Mayor of Paris since 2014 and ran in the 2022 presidential election, obtaining only 1.75%. Her Paris mandate has been marked by ambitious cycling policies, pedestrianisation projects and managing the 2024 Olympic Games. Her presidential score illustrated the PS's national decline.`,
    },
    key_positions: {
      fr: [
        `Transformation de Paris en ville cyclable : suppression de voies automobiles.`,
        `Piétonnisation des berges de Seine et de nombreux quartiers.`,
        `Logement social : construction massive pour réduire les prix.`,
        `Gratuité des transports en commun pour les moins de 18 ans.`,
        `Accueil des réfugiés et politique d'intégration active.`,
      ],
      en: [
        `Transforming Paris into a cycling city: removing car lanes.`,
        `Pedestrianisation of the Seine banks and many neighbourhoods.`,
        `Social housing: mass construction to reduce prices.`,
        `Free public transport for under-18s.`,
        `Welcoming refugees and active integration policy.`,
      ],
    },
    key_facts: {
      fr: [
        `Son score de 1,75 % à la présidentielle 2022 a été un choc symbolique pour le PS.`,
        `La gestion des JO 2024 à Paris a été largement saluée comme un succès organisationnel.`,
      ],
      en: [
        `Her 1.75% in the 2022 presidential election was a symbolic shock for the PS.`,
        `The management of the 2024 Paris Olympics was widely hailed as an organisational success.`,
      ],
    },
    career_timeline: [
      { year: 2001, fr: `Adjointe au maire de Paris chargée de l'urbanisme.`, en: `Deputy Mayor of Paris responsible for urban planning.` },
      { year: 2014, fr: `Élue première femme maire de Paris.`, en: `Elected first female Mayor of Paris.` },
      { year: 2022, fr: `Candidate PS à la présidentielle, obtient 1,75 %.`, en: `PS presidential candidate, obtains 1.75%.` },
    ],
    disclaimer: {
      fr: `Sa gestion parisienne est contestée par la droite comme coûteuse et insuffisamment sécuritaire, mais plébiscitée par ses électeurs.`,
      en: `Her Paris management is contested by the right as costly and insufficiently security-focused, but acclaimed by her voters.`,
    },
    profile: {
      ECONOMY: 25, SOCIAL: 82, IMMIGRATION: 82, SECURITY: 68,
      ENVIRONMENT: 78, DEMOCRACY: 72, GLOBAL: 78, PUBLIC_SERVICES: 82,
    },
  },

  {
    id: `roussel`,
    name: `Fabien Roussel`,
    flag: `🇫🇷`,
    emoji: `🌻`,
    family: `left`,
    party: { fr: `Parti communiste français`, en: `French Communist Party` },
    role: { fr: `Secrétaire national du PCF`, en: `National Secretary of the PCF` },
    short_summary: {
      fr: `Secrétaire national du PCF, défenseur d'un communisme républicain attaché à la laïcité et aux services publics.`,
      en: `PCF National Secretary, advocate of republican communism committed to secularism and public services.`,
    },
    description: {
      fr: `Fabien Roussel dirige le Parti communiste français depuis 2018 et a été candidat à la présidentielle de 2022, obtenant 2,28 % des voix. Il défend un communisme républicain attaché à l'industrie, aux services publics et à la laïcité, souvent en tension avec LFI sur des questions sociétales. Son style populaire et ancré dans les territoires le distingue de la gauche culturelle urbaine.`,
      en: `Fabien Roussel has led the French Communist Party since 2018 and ran in the 2022 presidential election, obtaining 2.28%. He defends a republican communism attached to industry, public services and secularism, often in tension with LFI on social issues. His popular and territorially rooted style distinguishes him from the urban cultural left.`,
    },
    key_positions: {
      fr: [
        `Services publics : hôpital, école, énergie comme piliers de la République.`,
        `Industrie française : relocalisation, soutien à la filière nucléaire.`,
        `Laïcité stricte, critique de tout communautarisme.`,
        `Augmentation des salaires et refonte de la fiscalité sur le capital.`,
        `Union de la gauche, mais refus de la dérive identitaire de LFI.`,
      ],
      en: [
        `Public services: hospital, school, energy as pillars of the Republic.`,
        `French industry: relocalisation, support for the nuclear sector.`,
        `Strict secularism, critique of all communitarianism.`,
        `Wage increases and overhaul of capital taxation.`,
        `Left-wing unity, but rejection of LFI's identitarian drift.`,
      ],
    },
    key_facts: {
      fr: [
        `A défendu le droit à « manger de la bonne viande », marquant une rupture avec le discours écolo de la gauche.`,
        `Le PCF soutient le programme nucléaire français, contrairement à LFI et EELV.`,
      ],
      en: [
        `Defended the right to "eat good meat", marking a break with the left's ecological discourse.`,
        `The PCF supports France's nuclear programme, unlike LFI and EELV.`,
      ],
    },
    career_timeline: [
      { year: 2012, fr: `Élu député du Nord.`, en: `Elected MP for Nord.` },
      { year: 2018, fr: `Élu secrétaire national du PCF.`, en: `Elected PCF National Secretary.` },
      { year: 2022, fr: `Candidat à la présidentielle, obtient 2,28 %.`, en: `Presidential candidate, obtains 2.28%.` },
    ],
    disclaimer: {
      fr: `Ses positions sur la laïcité et les traditions ouvrières lui valent parfois des critiques de la part de LFI et des écologistes.`,
      en: `His positions on secularism and working-class traditions earn him criticism from LFI and the Greens at times.`,
    },
    profile: {
      ECONOMY: 5, SOCIAL: 72, IMMIGRATION: 65, SECURITY: 68,
      ENVIRONMENT: 60, DEMOCRACY: 65, GLOBAL: 42, PUBLIC_SERVICES: 95,
    },
  },

  {
    id: `delga`,
    name: `Carole Delga`,
    flag: `🇫🇷`,
    emoji: `🌊`,
    family: `left`,
    party: { fr: `Parti socialiste`, en: `Socialist Party` },
    role: { fr: `Présidente de la Région Occitanie`, en: `President of the Occitanie Region` },
    short_summary: {
      fr: `Présidente d'Occitanie depuis 2016, figure du socialisme territorial pragmatique.`,
      en: `President of Occitanie since 2016, figure of pragmatic territorial socialism.`,
    },
    description: {
      fr: `Carole Delga préside la région Occitanie depuis 2016 et est perçue comme l'une des figures du socialisme territorial français. Elle défend une ligne social-démocrate pragmatique, attachée au développement des services publics régionaux et à la transition énergétique. Son profil de gestionnaire efficace est moins visible sur la scène nationale.`,
      en: `Carole Delga has presided over the Occitanie region since 2016 and is seen as one of the figures of French territorial socialism. She defends a pragmatic social-democratic line committed to regional public services and the energy transition. Her effective manager profile is less visible on the national stage.`,
    },
    key_positions: {
      fr: [
        `Développement des transports ferroviaires régionaux et tarifs sociaux.`,
        `Transition énergétique : objectif 100 % énergies renouvelables pour la région.`,
        `Maintien des services publics de proximité en milieu rural.`,
        `Soutien à l'agriculture et aux filières alimentaires locales.`,
        `Logement : lutte contre la spéculation dans les zones touristiques.`,
      ],
      en: [
        `Development of regional rail transport and social fares.`,
        `Energy transition: 100% renewable energy target for the region.`,
        `Maintaining local public services in rural areas.`,
        `Support for agriculture and local food supply chains.`,
        `Housing: fight against speculation in tourist areas.`,
      ],
    },
    key_facts: {
      fr: [
        `Occitanie est l'une des régions françaises les plus avancées sur les énergies renouvelables.`,
        `Réélude en 2021 avec un score confortable face au RN, confirmant son ancrage territorial.`,
      ],
      en: [
        `Occitanie is one of France's most advanced regions on renewable energy.`,
        `Re-elected in 2021 with a comfortable margin against the RN, confirming her territorial roots.`,
      ],
    },
    career_timeline: [
      { year: 2012, fr: `Secrétaire d'État au Commerce et à l'Artisanat.`, en: `Secretary of State for Trade and Craft.` },
      { year: 2016, fr: `Élue présidente de la région Languedoc-Roussillon-Midi-Pyrénées, rebaptisée Occitanie.`, en: `Elected president of Languedoc-Roussillon-Midi-Pyrénées, renamed Occitanie.` },
      { year: 2021, fr: `Réélue présidente d'Occitanie.`, en: `Re-elected president of Occitanie.` },
    ],
    disclaimer: {
      fr: `Son profil de gestionnaire régionale efficace est parfois moins visible sur la scène nationale.`,
      en: `Her profile as an effective regional manager is sometimes less visible on the national stage.`,
    },
    profile: {
      ECONOMY: 28, SOCIAL: 72, IMMIGRATION: 72, SECURITY: 65,
      ENVIRONMENT: 65, DEMOCRACY: 68, GLOBAL: 68, PUBLIC_SERVICES: 78,
    },
  },

  // ── Écologie ───────────────────────────────────────────────────────────────

  {
    id: `jadot`,
    name: `Yannick Jadot`,
    flag: `🇫🇷`,
    emoji: `🌿`,
    family: `ecology`,
    party: { fr: `Europe Écologie Les Verts (EELV)`, en: `Europe Écologie Les Verts (EELV)` },
    role: { fr: `Eurodéputé, candidat présidentiel 2022`, en: `MEP, 2022 presidential candidate` },
    short_summary: {
      fr: `Eurodéputé EELV, défenseur d'une écologie humaniste et pro-européenne.`,
      en: `EELV MEP, advocate of humanist and pro-European political ecology.`,
    },
    description: {
      fr: `Yannick Jadot est eurodéputé depuis 2009 et candidat de EELV à la présidentielle de 2022, obtenant 4,63 % des voix. Il défend une écologie politique humaniste, pro-européenne et attentive aux libertés individuelles. Son positionnement au centre-gauche de l'écologie politique le conduit à des tensions avec l'aile plus radicale de son parti.`,
      en: `Yannick Jadot has been an MEP since 2009 and was EELV's candidate in the 2022 presidential election, obtaining 4.63%. He defends a humanist, pro-European political ecology attentive to individual freedoms. His positioning at the centre-left of political ecology leads to tensions with the more radical wing of his party.`,
    },
    key_positions: {
      fr: [
        `Sortie accélérée des énergies fossiles et transition vers les renouvelables.`,
        `Green Deal européen ambitieux : taxonomie verte, prix du carbone.`,
        `Agriculture : soutien au bio, réduction des pesticides.`,
        `Droits humains comme colonne vertébrale de la politique commerciale européenne.`,
        `Réforme de la PAC pour favoriser la transition agricole.`,
      ],
      en: [
        `Accelerated phase-out of fossil fuels and transition to renewables.`,
        `Ambitious European Green Deal: green taxonomy, carbon pricing.`,
        `Agriculture: support for organic farming, reduction of pesticides.`,
        `Human rights as the backbone of European trade policy.`,
        `Reform of the CAP to favour agricultural transition.`,
      ],
    },
    key_facts: {
      fr: [
        `Ses 4,63 % à la présidentielle 2022 ont déçu une partie des écologistes qui espéraient un score à deux chiffres.`,
        `A longtemps été le principal opposant à l'accord commercial UE-Mercosur en raison de ses impacts environnementaux.`,
      ],
      en: [
        `His 4.63% in the 2022 presidential election disappointed Greens who had hoped for double digits.`,
        `Long been the main opponent of the EU-Mercosur trade deal due to its environmental impacts.`,
      ],
    },
    career_timeline: [
      { year: 2009, fr: `Élu eurodéputé pour la première fois.`, en: `First elected MEP.` },
      { year: 2019, fr: `Tête de liste EELV aux européennes (13,5 %).`, en: `Led EELV list in European elections (13.5%).` },
      { year: 2022, fr: `Candidat EELV à la présidentielle, obtient 4,63 %.`, en: `EELV presidential candidate, obtains 4.63%.` },
    ],
    disclaimer: {
      fr: `Son positionnement au centre-gauche de l'écologie politique le conduit à des tensions avec l'aile plus radicale de son parti sur la stratégie d'alliance avec LFI.`,
      en: `His positioning at the centre-left of political ecology leads to tensions with the more radical wing of his party on the LFI alliance strategy.`,
    },
    profile: {
      ECONOMY: 38, SOCIAL: 82, IMMIGRATION: 85, SECURITY: 78,
      ENVIRONMENT: 92, DEMOCRACY: 80, GLOBAL: 80, PUBLIC_SERVICES: 68,
    },
  },

  {
    id: `tondelier`,
    name: `Marine Tondelier`,
    flag: `🇫🇷`,
    emoji: `🌱`,
    family: `ecology`,
    party: { fr: `Europe Écologie Les Verts (EELV)`, en: `Europe Écologie Les Verts (EELV)` },
    role: { fr: `Secrétaire nationale de EELV`, en: `National Secretary of EELV` },
    short_summary: {
      fr: `Secrétaire nationale de EELV depuis 2022, architecte du Nouveau Front Populaire, écologie radicale et sociale.`,
      en: `EELV National Secretary since 2022, architect of the NFP, radical and social ecology.`,
    },
    description: {
      fr: `Marine Tondelier est secrétaire nationale de EELV depuis 2022 et a joué un rôle central dans la construction du Nouveau Front Populaire en 2024. Elle représente une écologie radicale et intersectionnelle, attentive aux questions féministes, sociales et antiracistes. Son style de leadership inclusif a modernisé EELV.`,
      en: `Marine Tondelier has been EELV's National Secretary since 2022 and played a central role in building the Nouveau Front Populaire in 2024. She represents a radical and intersectional ecology, attentive to feminist, social and anti-racist issues. Her inclusive leadership style has modernised EELV.`,
    },
    key_positions: {
      fr: [
        `Bifurcation écologique : planification publique de la transition, investissements massifs.`,
        `Justice sociale et écologique indissociables.`,
        `Féminisme intersectionnel comme axe politique central.`,
        `Sortie des énergies fossiles et du nucléaire à terme.`,
        `Union de la gauche comme condition de victoire électorale.`,
      ],
      en: [
        `Ecological bifurcation: public planning of the transition, massive investment.`,
        `Social and ecological justice as inseparable.`,
        `Intersectional feminism as a central political axis.`,
        `Phase-out of fossil fuels and ultimately nuclear energy.`,
        `Left-wing unity as a condition for electoral victory.`,
      ],
    },
    key_facts: {
      fr: [
        `A été conseillère municipale à Hénin-Beaumont, bastion du RN, avant de prendre la tête de EELV.`,
        `Son rôle clé dans la construction du NFP a été salué comme une démonstration de leadership politique.`,
      ],
      en: [
        `Was a municipal councillor in Hénin-Beaumont, an RN stronghold, before leading EELV.`,
        `Her key role in building the NFP was praised as a demonstration of political leadership.`,
      ],
    },
    career_timeline: [
      { year: 2014, fr: `Élue conseillère municipale à Hénin-Beaumont.`, en: `Elected municipal councillor in Hénin-Beaumont.` },
      { year: 2022, fr: `Élue secrétaire nationale de EELV.`, en: `Elected EELV National Secretary.` },
      { year: 2024, fr: `Joue un rôle clé dans la formation du Nouveau Front Populaire.`, en: `Played a key role in forming the Nouveau Front Populaire.` },
    ],
    disclaimer: {
      fr: `Son profil très progressiste peut rebuter des électeurs sensibles à l'écologie sans adhérer à toutes les positions sociétales.`,
      en: `Her strongly progressive profile may put off voters sensitive to ecology without subscribing to all social positions.`,
    },
    profile: {
      ECONOMY: 28, SOCIAL: 88, IMMIGRATION: 90, SECURITY: 80,
      ENVIRONMENT: 95, DEMOCRACY: 85, GLOBAL: 80, PUBLIC_SERVICES: 78,
    },
  },

  {
    id: `rousseau_s`,
    name: `Sandrine Rousseau`,
    flag: `🇫🇷`,
    emoji: `🦋`,
    family: `ecology`,
    party: { fr: `Europe Écologie Les Verts (EELV)`, en: `Europe Écologie Les Verts (EELV)` },
    role: { fr: `Députée de Paris`, en: `MP for Paris` },
    short_summary: {
      fr: `Économiste et députée EELV, voix de l'écologie radicale, féministe et décroissante.`,
      en: `Economist and EELV MP, voice of radical, feminist and degrowth ecology.`,
    },
    description: {
      fr: `Sandrine Rousseau est députée EELV de Paris depuis 2022 et représente l'aile la plus radicale de l'écologie politique française. Économiste de formation, elle défend une décroissance assumée, le féminisme intersectionnel et une critique radicale du capitalisme. Ses positions clivantes alimentent des débats intenses, y compris à gauche.`,
      en: `Sandrine Rousseau has been EELV MP for Paris since 2022 and represents the most radical wing of French political ecology. An economist by training, she advocates avowed degrowth, intersectional feminism and a radical critique of capitalism. Her polarising positions fuel intense debates, including within the left.`,
    },
    key_positions: {
      fr: [
        `Décroissance économique assumée : remettre en cause la croissance comme objectif.`,
        `Réduction du temps de travail comme outil écologique et féministe.`,
        `Partage du travail domestique, reconnaissance des soins non rémunérés.`,
        `Sortie du nucléaire et des énergies fossiles sans compromis.`,
        `Fiscalité punitive sur la sur-consommation et les patrimoines élevés.`,
      ],
      en: [
        `Avowed economic degrowth: challenging growth as a policy goal.`,
        `Reduction of working time as an ecological and feminist tool.`,
        `Sharing of domestic work, recognition of unpaid care.`,
        `Nuclear and fossil fuel phase-out without compromise.`,
        `Punitive taxation on overconsumption and large wealth.`,
      ],
    },
    key_facts: {
      fr: [
        `A dénoncé publiquement des violences sexuelles au sein de EELV, déclenchant une prise de conscience dans le milieu politique.`,
        `Ses positions sur la décroissance et le genre font d'elle l'une des personnalités politiques les plus clivantes de gauche.`,
      ],
      en: [
        `Publicly denounced sexual violence within EELV, triggering awareness across political circles.`,
        `Her positions on degrowth and gender make her one of the most polarising left-wing figures.`,
      ],
    },
    career_timeline: [
      { year: 2021, fr: `Vice-présidente de EELV, candidate aux primaires écologistes pour la présidentielle.`, en: `EELV Vice-President, candidate in Green primaries for presidential race.` },
      { year: 2022, fr: `Élue députée de Paris (9e et 18e arrondissements).`, en: `Elected MP for Paris (9th and 18th arrondissements).` },
      { year: 2024, fr: `Réélue dans le cadre du Nouveau Front Populaire.`, en: `Re-elected within the Nouveau Front Populaire.` },
    ],
    disclaimer: {
      fr: `Ses positions sur la décroissance et ses interventions médiatisées sur les questions de genre la rendent clivante, y compris dans son propre parti et au sein de la gauche.`,
      en: `Her positions on degrowth and her publicised interventions on gender issues make her polarising, including within her own party and the left more broadly.`,
    },
    profile: {
      ECONOMY: 18, SOCIAL: 95, IMMIGRATION: 92, SECURITY: 90,
      ENVIRONMENT: 95, DEMOCRACY: 88, GLOBAL: 82, PUBLIC_SERVICES: 85,
    },
  },

];
