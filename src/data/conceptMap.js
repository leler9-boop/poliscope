/**
 * conceptMap.js — educational concept definitions for the in-quiz system.
 *
 * Each concept has:
 *   label       — display name {fr, en}
 *   icon        — emoji
 *   level1      — ultra-simple, 2-3 sentences {fr, en}
 *   level2      — one paragraph, more detail {fr, en}
 *   articleKey  — optional: links to the J'y connais rien section in Beginner.jsx
 *
 * QUESTION_CONCEPTS maps question IDs → concept key arrays.
 * THEME_INTROS provides short orientation text shown when the quiz theme changes.
 */

// ─── Concept definitions ──────────────────────────────────────────────────────

export const CONCEPTS = {

  retraites: {
    label: { fr: 'Les retraites', en: 'Pensions' },
    icon: '🧓',
    level1: {
      fr: `Les actifs (ceux qui travaillent) financent directement les retraites des retraités. Plus il y a de retraités et moins il y a d'actifs, plus le système coûte cher. C'est le défi central de toute politique des retraites.`,
      en: `Workers directly fund retirees' pensions through contributions. The more retirees and the fewer workers, the more the system costs. This is the central challenge of pension policy.`,
    },
    level2: {
      fr: `La France utilise un système par répartition : les cotisations payées aujourd'hui financent les retraites d'aujourd'hui. Ce système se fragilise avec le vieillissement démographique. En 1960, il y avait 4 actifs pour 1 retraité. Aujourd'hui, 1,7. D'ici 2050, environ 1,4. La réforme de 2023 a repoussé l'âge légal à 64 ans pour corriger ce déséquilibre.`,
      en: `France uses a pay-as-you-go system: today's contributions fund today's pensions. This weakens with an ageing population. In 1960 there were 4 workers per retiree. Today, 1.7. By 2050, around 1.4. The 2023 reform raised the legal retirement age to 64 to correct this imbalance.`,
    },
    articleKey: 'retraites',
  },

  fiscalite: {
    label: { fr: 'La fiscalité', en: 'Taxation' },
    icon: '📊',
    level1: {
      fr: `Les impôts sont la façon dont l'État collecte de l'argent pour financer les services publics. Qui paie, combien, et sur quoi — c'est l'un des grands débats de toute élection.`,
      en: `Taxes are how the state collects money to fund public services. Who pays, how much, and on what — this is one of the great debates of every election.`,
    },
    level2: {
      fr: `La France a l'un des taux de prélèvements les plus élevés d'Europe (environ 45 % du PIB). Ces impôts financent la santé, les retraites, l'école, la justice et la défense. Le débat porte sur leur niveau global, leur progressivité (les riches paient-ils assez ?) et les types de taxes à privilégier : impôt sur le revenu, TVA, impôt sur les sociétés, ISF, taxe carbone. Chaque choix produit des effets différents sur l'économie et les inégalités.`,
      en: `France has one of the highest tax rates in Europe (around 45% of GDP). These taxes fund healthcare, pensions, education, justice and defence. The debate concerns the overall level, progressivity (do the wealthy pay enough?) and which taxes to use: income tax, VAT, corporate tax, wealth tax, carbon tax. Each choice has different effects on the economy and inequality.`,
    },
    articleKey: 'fiscalite',
  },

  dette_publique: {
    label: { fr: 'La dette publique', en: 'Public debt' },
    icon: '📉',
    level1: {
      fr: `La dette publique, c'est l'argent que l'État a emprunté et n'a pas encore remboursé. Elle augmente quand l'État dépense plus qu'il ne collecte en impôts. La dette française dépasse aujourd'hui 3 000 milliards d'euros.`,
      en: `Public debt is money the state has borrowed and not yet repaid. It grows when the state spends more than it collects in taxes. France's debt now exceeds €3,000 billion.`,
    },
    level2: {
      fr: `La France paie plus de 50 milliards d'euros d'intérêts par an sur sa dette — davantage que le budget de l'éducation nationale. Sa dette représente environ 110 % du PIB, au-dessus de la limite européenne de 60 %. Pour certains, cette dette est un danger pour les générations futures. Pour d'autres, emprunter pour investir dans la santé ou l'éducation est rationnel à long terme.`,
      en: `France pays over €50 billion per year in debt interest — more than the entire education budget. Its debt represents about 110% of GDP, above the EU's 60% limit. For some, this debt is a danger to future generations. For others, borrowing to invest in health or education is rational long-term.`,
    },
    articleKey: 'dette_publique',
  },

  libre_echange: {
    label: { fr: 'Le libre-échange', en: 'Free trade' },
    icon: '🌐',
    level1: {
      fr: `Le libre-échange, c'est le commerce entre pays sans droits de douane ni restrictions. Il peut faire baisser les prix pour les consommateurs, mais aussi menacer certains emplois industriels.`,
      en: `Free trade is commerce between countries without tariffs or restrictions. It can lower prices for consumers, but can also threaten some industrial jobs.`,
    },
    level2: {
      fr: `La mondialisation a fait baisser les prix de nombreux produits mais a entraîné des délocalisations. Ses partisans soulignent les gains pour les consommateurs et l'efficacité économique. Ses adversaires pointent les pertes d'emplois, les inégalités et les risques pour les industries stratégiques. En France, le débat porte notamment sur les accords commerciaux de l'UE (CETA, Mercosur) et sur les tarifs américains de 2025.`,
      en: `Globalisation has lowered prices for many products but caused industrial offshoring. Supporters highlight consumer gains and economic efficiency. Critics point to job losses, inequality, and risks to strategic industries. In France, the debate centres on EU trade deals (CETA, Mercosur) and the 2025 US tariffs.`,
    },
    articleKey: 'globalization',
  },

  protectionnisme: {
    label: { fr: 'Le protectionnisme', en: 'Protectionism' },
    icon: '🏭',
    level1: {
      fr: `Le protectionnisme, c'est quand un pays protège ses industries en taxant les importations. Cela protège des emplois locaux, mais peut faire monter les prix et déclencher des guerres commerciales.`,
      en: `Protectionism is when a country protects its industries by taxing imports. It protects local jobs, but can raise prices and trigger trade wars.`,
    },
    level2: {
      fr: `Un droit de douane est une taxe sur les produits importés qui les rend plus chers et avantage les productions locales. Le protectionnisme peut défendre des secteurs stratégiques (agriculture, industrie, défense) contre une concurrence jugée déloyale. Mais il risque de provoquer des mesures de rétorsion et d'augmenter les prix pour les consommateurs. Sous Trump en 2025, les États-Unis ont imposé des tarifs de 25 % sur les produits européens, déclenchant une guerre commerciale transatlantique.`,
      en: `A tariff is a tax on imported goods that makes them more expensive and favours local production. Protectionism can defend strategic sectors (agriculture, industry, defence) against what is seen as unfair competition. But it risks provoking retaliation and raising consumer prices. Under Trump in 2025, the US imposed 25% tariffs on European goods, triggering a transatlantic trade war.`,
    },
  },

  immigration: {
    label: { fr: "L'immigration", en: 'Immigration' },
    icon: '🌍',
    level1: {
      fr: `L'immigration, c'est quand des personnes viennent s'installer dans un pays qui n'est pas le leur. Le débat porte sur combien de personnes accueillir, dans quelles conditions, et avec quels droits.`,
      en: `Immigration is when people come to settle in a country that is not their own. The debate concerns how many people to welcome, under what conditions, and with what rights.`,
    },
    level2: {
      fr: `Il existe plusieurs types d'immigration : économique (travail), familiale (regroupement), humanitaire (asile). Chaque type répond à des règles différentes. La France accueille environ 300 000 à 400 000 nouveaux arrivants par an. Le débat politique porte sur les volumes, les conditions d'intégration, l'accès aux droits sociaux et les expulsions.`,
      en: `There are several types of immigration: economic (work), family (reunification), humanitarian (asylum). Each type follows different rules. France receives around 300,000 to 400,000 newcomers per year. The political debate concerns volumes, integration conditions, access to social rights and deportations.`,
    },
    articleKey: 'immigration',
  },

  asile: {
    label: { fr: "Le droit d'asile", en: 'Right to asylum' },
    icon: '🏳️',
    level1: {
      fr: `L'asile, c'est le droit d'être protégé dans un autre pays quand on fuit des persécutions dans le sien. C'est un droit reconnu par la Convention de Genève de 1951, qui s'applique en France.`,
      en: `Asylum is the right to be protected in another country when fleeing persecution in your own. It is a right recognised by the 1951 Geneva Convention, which applies in France.`,
    },
    level2: {
      fr: `Un demandeur d'asile attend une décision de l'État sur sa demande de protection. Un réfugié est une personne dont la demande a été acceptée. La France a accordé l'asile à environ 60 000 personnes en 2023. Le débat porte sur le délai de traitement des demandes, les droits sociaux pendant l'attente, et les conditions d'expulsion des personnes dont la demande est rejetée.`,
      en: `An asylum seeker is waiting for a state decision on their protection request. A refugee is someone whose claim has been accepted. France granted asylum to about 60,000 people in 2023. The debate concerns processing times, social rights during the wait, and conditions for deporting rejected applicants.`,
    },
  },

  changement_climatique: {
    label: { fr: 'Le changement climatique', en: 'Climate change' },
    icon: '🌡️',
    level1: {
      fr: `L'activité humaine (pétrole, gaz, déforestation) libère du CO₂ qui réchauffe la planète. Les scientifiques sont unanimes : sans action rapide, les conséquences seront graves et irréversibles.`,
      en: `Human activity (oil, gas, deforestation) releases CO₂ that warms the planet. Scientists are unanimous: without rapid action, the consequences will be severe and irreversible.`,
    },
    level2: {
      fr: `L'Accord de Paris (2015) vise à limiter le réchauffement à 1,5 °C. Pour y parvenir, les émissions mondiales doivent atteindre zéro net d'ici 2050. La France vise la neutralité carbone en 2050. Les décisions politiques portent sur la vitesse de la transition, les secteurs à décarboner en priorité (transport, énergie, agriculture) et sur qui supporte les coûts de cette transformation.`,
      en: `The Paris Agreement (2015) aims to limit warming to 1.5°C. To achieve this, global emissions must reach net zero by 2050. France aims for carbon neutrality by 2050. Political decisions concern the pace of transition, which sectors to decarbonise first (transport, energy, agriculture) and who bears the costs.`,
    },
    articleKey: 'ecology',
  },

  nucleaire: {
    label: { fr: "L'énergie nucléaire", en: 'Nuclear energy' },
    icon: '⚛️',
    level1: {
      fr: `La France produit environ 70 % de son électricité grâce au nucléaire, l'un des taux les plus élevés au monde. Le débat : construire de nouveaux réacteurs, ou accélérer vers les énergies renouvelables ?`,
      en: `France produces around 70% of its electricity from nuclear power, one of the highest rates in the world. The debate: build new reactors, or accelerate toward renewable energy?`,
    },
    level2: {
      fr: `Le nucléaire produit de l'électricité sans CO₂ direct, ce qui en fait un outil pour la transition climatique selon ses partisans. Ses adversaires soulignent les risques d'accidents, le problème des déchets radioactifs (dangereux des milliers d'années) et les délais et coûts de construction. La France a décidé de construire 6 nouveaux réacteurs EPR2 et d'en étudier 8 supplémentaires.`,
      en: `Nuclear produces electricity without direct CO₂, making it a climate transition tool according to supporters. Critics highlight accident risks, radioactive waste problems (dangerous for thousands of years) and construction delays and costs. France has decided to build 6 new EPR2 reactors and study 8 more.`,
    },
  },

  taxe_carbone: {
    label: { fr: 'La taxe carbone', en: 'Carbon tax' },
    icon: '💨',
    level1: {
      fr: `Une taxe carbone est un prix mis sur les émissions de CO₂ pour rendre les carburants fossiles plus chers et encourager les alternatives propres. C'est l'outil économique principal de la politique climatique.`,
      en: `A carbon tax is a price put on CO₂ emissions to make fossil fuels more expensive and encourage clean alternatives. It is the main economic tool of climate policy.`,
    },
    level2: {
      fr: `Si polluer coûte de l'argent, les entreprises et les ménages pollueront moins. La France a une taxe carbone intégrée dans le prix des carburants. La hausse de cette taxe en 2018 a déclenché la crise des Gilets Jaunes. Le débat porte sur l'équité (la taxe pèse plus sur les ménages modestes qui dépendent de la voiture) et sur la façon de redistribuer les recettes.`,
      en: `If polluting costs money, companies and households will pollute less. France has a carbon tax built into fuel prices. Raising it in 2018 triggered the Yellow Vests crisis. The debate concerns equity (the tax proportionally hits lower-income households who depend on cars more) and how to redistribute revenues.`,
    },
  },

  decroissance: {
    label: { fr: 'La décroissance', en: 'Degrowth' },
    icon: '🌿',
    level1: {
      fr: `La décroissance, c'est l'idée que pour préserver la planète, il faut réduire volontairement la production et la consommation. C'est une rupture radicale avec l'objectif traditionnel de croissance économique.`,
      en: `Degrowth is the idea that to protect the planet, we must voluntarily reduce production and consumption. It is a radical break with the traditional goal of economic growth.`,
    },
    level2: {
      fr: `Ses partisans soutiennent que la croissance infinie est impossible dans un monde aux ressources limitées. Ils proposent de produire moins, de consommer moins, de travailler moins, et de partager mieux. Leurs adversaires estiment que la technologie permettra de décarboner la croissance sans réduire le niveau de vie, et que la décroissance ferait surtout mal aux plus pauvres.`,
      en: `Supporters argue that infinite growth is impossible in a world of finite resources. They propose producing less, consuming less, working less, and sharing better. Their opponents believe technology will allow decarbonising growth without reducing living standards, and that degrowth would mainly hurt the poorest.`,
    },
  },

  otan: {
    label: { fr: "L'OTAN", en: 'NATO' },
    icon: '🛡️',
    level1: {
      fr: `L'OTAN est une alliance militaire de 32 pays qui s'engagent à se défendre mutuellement. La France en est membre mais a eu une relation complexe avec l'alliance depuis de Gaulle.`,
      en: `NATO is a military alliance of 32 countries that commit to defending each other. France is a member but has had a complex relationship with the alliance since de Gaulle.`,
    },
    level2: {
      fr: `L'article 5 du traité OTAN prévoit qu'une attaque contre un membre est une attaque contre tous. La France a quitté le commandement militaire intégré en 1966 (pour préserver son autonomie) et l'a réintégré en 2009. Depuis l'invasion russe de l'Ukraine en 2022, l'OTAN est redevenu central dans le débat politique — sur les dépenses militaires (France : environ 2 % du PIB) et l'éventuel envoi de troupes.`,
      en: `Article 5 of the NATO treaty states that an attack on one member is an attack on all. France left the integrated military command in 1966 (to preserve autonomy) and rejoined in 2009. Since Russia's 2022 invasion of Ukraine, NATO has become central in political debate — on defence spending (France: ~2% of GDP) and possible troop deployment.`,
    },
    articleKey: 'otan',
  },

  union_europeenne: {
    label: { fr: "L'Union européenne", en: 'European Union' },
    icon: '🇪🇺',
    level1: {
      fr: `L'UE est une union politique et économique de 27 pays partageant un marché commun. La France en est membre fondateur. Le débat : l'intégration européenne bénéficie-t-elle à la France ou nuit-elle à sa souveraineté ?`,
      en: `The EU is a political and economic union of 27 countries sharing a common market. France is a founding member. The debate: does European integration benefit France or undermine its sovereignty?`,
    },
    level2: {
      fr: `L'UE permet la libre circulation des personnes, des biens et des capitaux entre ses membres. Le droit européen prime sur le droit national. La BCE fixe les taux d'intérêt pour les 20 pays de la zone euro. Ses partisans soulignent la puissance collective et la prospérité. Les souverainistes regrettent la perte de contrôle sur la monnaie, l'immigration et certaines réglementations.`,
      en: `The EU allows free movement of people, goods and capital between members. EU law overrides national law. The ECB sets interest rates for the 20 eurozone countries. Supporters highlight collective power and prosperity. Sovereignists regret loss of control over currency, immigration and some regulations.`,
    },
    articleKey: 'union_europeenne',
  },

  souverainete: {
    label: { fr: 'La souveraineté', en: 'Sovereignty' },
    icon: '🏴',
    level1: {
      fr: `La souveraineté, c'est le pouvoir d'un pays de décider pour lui-même, sans être contraint par des règles extérieures. Le débat porte sur combien de souveraineté la France doit partager avec l'UE ou l'OTAN.`,
      en: `Sovereignty is a country's power to decide for itself, without being constrained by external rules. The debate concerns how much sovereignty France should share with the EU or NATO.`,
    },
    level2: {
      fr: `La souveraineté s'exprime dans le contrôle des frontières, de la monnaie, des lois et de la politique étrangère. La France a délégué une partie de ces pouvoirs à l'UE (droit commun, politique commerciale, monnaie). Les souverainistes — à gauche (LFI) comme à droite (RN, Reconquête) — veulent reprendre ces pouvoirs. Les pro-européens estiment que la souveraineté partagée donne plus de poids à chaque membre.`,
      en: `Sovereignty is expressed in control over borders, currency, laws and foreign policy. France has delegated some of these powers to the EU (common law, trade policy, currency). Sovereignists — on the left (LFI) and right (RN, Reconquête) — want to reclaim these powers. Pro-Europeans argue shared sovereignty gives each member more weight.`,
    },
    articleKey: 'souverainete',
  },

  democratie_directe: {
    label: { fr: 'La démocratie directe', en: 'Direct democracy' },
    icon: '🗳️',
    level1: {
      fr: `La démocratie directe permet aux citoyens de voter directement sur des lois ou des décisions, sans passer par des représentants élus. Le référendum en est l'exemple le plus connu.`,
      en: `Direct democracy lets citizens vote directly on laws or decisions, without going through elected representatives. The referendum is the best-known example.`,
    },
    level2: {
      fr: `En France, le référendum existe mais est déclenché par le président ou le parlement, pas par les citoyens. Le RIC (Référendum d'Initiative Citoyenne), revendiqué par les Gilets Jaunes, permettrait aux citoyens de déclencher un référendum via une pétition. Ses partisans y voient un outil de démocratie réelle. Ses adversaires craignent des décisions prises sous l'émotion ou capturées par des démagogues.`,
      en: `In France, referendums exist but are triggered by the president or parliament, not citizens. The RIC (Citizens' Initiative Referendum), demanded by the Yellow Vests, would let citizens trigger a referendum via petition. Supporters see it as a tool for real democracy. Critics fear decisions made under emotion or captured by demagogues.`,
    },
    articleKey: 'democracy',
  },

  laicite: {
    label: { fr: 'La laïcité', en: 'Secularism' },
    icon: '⚖️',
    level1: {
      fr: `La laïcité, c'est la séparation stricte entre l'État et les religions. En France, les fonctionnaires ne peuvent pas porter de signes religieux au travail, et l'État ne finance pas les cultes.`,
      en: `Secularism (laïcité) is the strict separation between the state and religions. In France, civil servants cannot wear religious symbols at work, and the state does not fund religious organisations.`,
    },
    level2: {
      fr: `La loi de 1905 a séparé l'Église et l'État. La loi de 2004 a interdit les signes religieux ostensibles dans les écoles publiques. Pour beaucoup de Français, la laïcité est un pilier de l'identité républicaine et de l'égalité. Pour d'autres, son application stricte limite la liberté de conscience et cible de façon disproportionnée les femmes musulmanes voilées.`,
      en: `The 1905 law separated Church and State. The 2004 law banned conspicuous religious symbols in public schools. For many French people, secularism is a pillar of republican identity and equality. For others, its strict application limits freedom of conscience and disproportionately targets veiled Muslim women.`,
    },
  },

  ivg: {
    label: { fr: "L'avortement (IVG)", en: 'Abortion' },
    icon: '🏥',
    level1: {
      fr: `L'IVG (Interruption Volontaire de Grossesse) est légale en France depuis la loi Veil de 1975. En 2024, la France a inscrit le droit à l'avortement dans sa Constitution — une première mondiale.`,
      en: `Abortion has been legal in France since the Veil Law of 1975. In 2024, France inscribed the right to abortion in its Constitution — a world first.`,
    },
    level2: {
      fr: `En France, l'IVG est remboursée à 100 % par la Sécurité Sociale et peut être pratiquée jusqu'à 14 semaines. La constitutionnalisation de 2024 a été motivée par la décision de la Cour Suprême américaine (Dobbs, 2022) qui a annulé le droit à l'avortement aux États-Unis, ravivant le débat sur la protection juridique de ce droit en Europe.`,
      en: `In France, abortion is 100% covered by Social Security and can be performed up to 14 weeks. The 2024 constitutionalisation was motivated by the US Supreme Court's Dobbs decision (2022) which struck down the right to abortion in the US, reigniting debate about the legal protection of this right in Europe.`,
    },
  },

  sante_publique: {
    label: { fr: 'La santé publique', en: 'Public healthcare' },
    icon: '💊',
    level1: {
      fr: `La France a un système de santé universel financé par les cotisations sociales, qui couvre tous les résidents. Mais il est sous tension : manque de médecins, urgences saturées, déficit croissant.`,
      en: `France has a universal health system funded by social contributions, covering all residents. But it is under strain: doctor shortages, overcrowded emergency rooms, growing deficit.`,
    },
    level2: {
      fr: `La Sécurité Sociale prend en charge en moyenne 77 % des dépenses de santé. Les déserts médicaux touchent de plus en plus de territoires ruraux. Le numerus clausus (nombre limité d'étudiants en médecine) a été supprimé en 2021, mais les effets mettront 10 ans à se faire sentir. Le défi central : soigner une population vieillissante avec moins de professionnels de santé.`,
      en: `Social Security covers an average 77% of healthcare costs. Medical deserts affect more and more rural territories. The numerus clausus (limited medical students) was abolished in 2021, but effects will take 10 years to materialise. The central challenge: caring for an ageing population with fewer health professionals.`,
    },
    articleKey: 'public_services',
  },

  service_public: {
    label: { fr: 'Les services publics', en: 'Public services' },
    icon: '🏛️',
    level1: {
      fr: `Les services publics sont des prestations que l'État fournit à tous : santé, éducation, transports, justice. Le débat porte sur leur financement, leur qualité, et la place du secteur privé.`,
      en: `Public services are services the state provides to everyone: health, education, transport, justice. The debate concerns their funding, quality, and the role of the private sector.`,
    },
    level2: {
      fr: `La France a l'un des secteurs publics les plus développés d'Europe. Ces services sont financés par les impôts et les cotisations sociales avec une logique d'universalité : tout le monde y a accès, indépendamment de ses revenus. Les débats portent sur leur efficacité, leur financement sans aggraver les déficits, et l'opportunité de privatiser certains d'entre eux.`,
      en: `France has one of the most developed public sectors in Europe. These services are funded by taxes and social contributions with a universality logic: everyone has access, regardless of income. Debates concern their efficiency, funding without worsening deficits, and whether to partially privatise some of them.`,
    },
    articleKey: 'public_services',
  },

  etat_providence: {
    label: { fr: "L'État-providence", en: 'Welfare state' },
    icon: '🤝',
    level1: {
      fr: `L'État-providence regroupe toutes les protections sociales de l'État : chômage, retraites, santé, aides familiales. La France a l'un des systèmes les plus généreux au monde.`,
      en: `The welfare state encompasses all state social protections: unemployment, pensions, healthcare, family benefits. France has one of the most generous systems in the world.`,
    },
    level2: {
      fr: `En France, les dépenses sociales représentent environ 32 % du PIB — parmi les plus hauts au monde. Elles financent les retraites (le plus gros poste), la santé, le chômage, les allocations familiales et les minima sociaux. Le débat porte sur son coût (est-il finançable sans réduire la dette ?), son efficacité, et les réformes nécessaires face au vieillissement de la population.`,
      en: `In France, social spending represents around 32% of GDP — among the highest in the world. It funds pensions (the largest item), healthcare, unemployment, family allowances and social minima. The debate concerns its cost (sustainable without reducing debt?), its effectiveness, and reforms needed given population ageing.`,
    },
  },

  pluralisme_medias: {
    label: { fr: 'Le pluralisme des médias', en: 'Media pluralism' },
    icon: '📰',
    level1: {
      fr: `Le pluralisme des médias, c'est la diversité des voix dans l'espace public. En France, plusieurs grands groupes de presse appartiennent à des milliardaires, ce qui alimente un débat sur l'indépendance de l'information.`,
      en: `Media pluralism is the diversity of voices in the public sphere. In France, several major media groups belong to billionaires, fuelling debate about editorial independence.`,
    },
    level2: {
      fr: `Des milliardaires comme Vincent Bolloré (CNews, Europe 1, JDD), Bernard Arnault (Le Parisien, Les Échos), Xavier Niel (Le Monde) ou Rodolphe Saadé (BFMTV) contrôlent une grande partie des médias influents. Les critiques dénoncent une pression commerciale ou idéologique sur les rédactions. Les partisans répondent que l'investissement privé sauve des médias en difficulté. L'ARCOM est chargé de réguler la concentration des médias.`,
      en: `Billionaires like Vincent Bolloré (CNews, Europe 1, JDD), Bernard Arnault (Le Parisien, Les Échos), Xavier Niel (Le Monde) and Rodolphe Saadé (BFMTV) control a large part of influential media. Critics denounce commercial or ideological pressure on newsrooms. Supporters respond that private investment saves struggling media. ARCOM is responsible for regulating media concentration.`,
    },
  },

};

// ─── Theme transitions ────────────────────────────────────────────────────────
// Chapter-opening intros — shown when the quiz changes theme.
// V4: replaced administrative list ("Les prochaines questions portent sur X, Y, Z")
// with chapter-opening format: a title + an evocative framing question.
// The banner now stays visible until the user answers the first question
// of the new theme (or manually dismisses it).

export const THEME_INTROS = {
  ECONOMY: {
    icon: '💶',
    chapter: { fr: 'Économie', en: 'Economy' },
    fr: 'Comment l\'argent public doit-il être géré ? Impôts, dette, rôle de l\'État.',
    en: 'How should public money be managed? Taxes, debt, the role of the state.',
  },
  SOCIAL: {
    icon: '🏙️',
    chapter: { fr: 'Questions de société', en: 'Social issues' },
    fr: 'Quelle société voulons-nous construire ? Libertés, laïcité, égalité, identité.',
    en: 'What kind of society do we want to build? Freedoms, secularism, equality, identity.',
  },
  IMMIGRATION: {
    icon: '🌍',
    chapter: { fr: 'Immigration', en: 'Immigration' },
    fr: 'Qui peut entrer, rester, devenir français ? Frontières, intégration, identité nationale.',
    en: 'Who can enter, stay, become French? Borders, integration, national identity.',
  },
  SECURITY: {
    icon: '🛡️',
    chapter: { fr: 'Sécurité & Libertés', en: 'Security & Freedoms' },
    fr: 'Jusqu\'où l\'État peut-il surveiller et punir ? Police, justice, libertés civiles.',
    en: 'How far can the state monitor and punish? Police, justice, civil liberties.',
  },
  ENVIRONMENT: {
    icon: '🌱',
    chapter: { fr: 'Environnement', en: 'Environment' },
    fr: 'Croissance économique ou préservation de la planète ? Climat, nucléaire, sobriété.',
    en: 'Economic growth or protecting the planet? Climate, nuclear, sobriety.',
  },
  DEMOCRACY: {
    icon: '🏛️',
    chapter: { fr: 'Démocratie', en: 'Democracy' },
    fr: 'Qui décide vraiment ? Institutions, référendum, pouvoir citoyen.',
    en: 'Who really decides? Institutions, referendums, citizens\' power.',
  },
  GLOBAL: {
    icon: '🌐',
    chapter: { fr: 'France & Monde', en: 'France & the World' },
    fr: 'Quelle est la place de la France dans le monde ? OTAN, Europe, souveraineté.',
    en: 'What is France\'s place in the world? NATO, Europe, sovereignty.',
  },
  PUBLIC_SERVICES: {
    icon: '🏥',
    chapter: { fr: 'Services publics', en: 'Public services' },
    fr: 'Quelle protection collective voulons-nous ? Hôpitaux, école, retraites, aides sociales.',
    en: 'What collective protection do we want? Hospitals, schools, pensions, social benefits.',
  },
};

// ─── Question → concept mapping ───────────────────────────────────────────────
// Maps question IDs to arrays of concept keys shown as educational pills.

export const QUESTION_CONCEPTS = {
  // ECONOMY
  ECO_3:  ['fiscalite'],
  ECO_4:  ['fiscalite'],
  ECO_5:  ['dette_publique'],
  ECO_8:  ['service_public'],
  ECO_10: ['etat_providence'],
  ECO_13: ['libre_echange'],
  ECO_17: ['libre_echange'],
  ECO_23: ['fiscalite'],
  ECO_24: ['fiscalite'],
  ECO_26: ['retraites'],
  ECO_27: ['protectionnisme', 'libre_echange'],
  // SOCIAL
  SOC_16: ['laicite'],
  SOC_24: ['ivg'],
  // IMMIGRATION
  IMM_2:  ['asile', 'immigration'],
  IMM_3:  ['immigration'],
  IMM_5:  ['immigration', 'souverainete'],
  IMM_6:  ['immigration'],
  IMM_7:  ['immigration'],
  IMM_8:  ['immigration'],
  IMM_23: ['immigration'],
  // ENVIRONMENT
  ENV_1:  ['changement_climatique'],
  ENV_2:  ['nucleaire'],
  ENV_3:  ['taxe_carbone', 'changement_climatique'],
  ENV_4:  ['changement_climatique'],
  ENV_8:  ['decroissance'],
  ENV_11: ['changement_climatique'],
  ENV_22: ['changement_climatique'],
  ENV_23: ['decroissance'],
  // DEMOCRACY
  DEM_3:  ['democratie_directe'],
  DEM_7:  ['democratie_directe'],
  DEM_25: ['pluralisme_medias'],
  // GLOBAL
  GLO_3:  ['otan'],
  GLO_6:  ['protectionnisme'],
  GLO_8:  ['union_europeenne'],
  GLO_9:  ['souverainete'],
  GLO_16: ['souverainete'],
  GLO_17: ['otan', 'souverainete'],
  GLO_22: ['souverainete'],
  GLO_23: ['otan'],
  GLO_24: ['union_europeenne'],
  // PUBLIC_SERVICES
  PUB_1:  ['sante_publique'],
  PUB_5:  ['service_public'],
  PUB_8:  ['service_public'],
  PUB_9:  ['service_public'],
  PUB_12: ['service_public'],
  PUB_13: ['etat_providence'],
  PUB_17: ['service_public'],
  PUB_19: ['retraites'],
  PUB_25: ['sante_publique'],
};
