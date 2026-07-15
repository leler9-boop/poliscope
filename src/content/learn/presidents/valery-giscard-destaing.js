/**
 * Fiche président « Valéry Giscard d'Estaing » — modèle president en 15 rubriques
 * (docs/jyconnaisrien/02, §5). Mapping niveaux : N1 = portrait 30 s ·
 * N2 = pourquoi élu + en une phrase + 5 dates + 5 mesures ·
 * N3 = programme, mesures, événements, gouverner, bilan, défenseurs, opposants,
 * héritage (ids requis par le script de contrôle) · N4 = pour aller plus loin.
 */

export default {
  slug: 'valery-giscard-destaing',
  type: 'president',
  porte: 'D1',
  title: { fr: `Valéry Giscard d'Estaing`, en: `Valéry Giscard d'Estaing` },
  icon: '🚄',
  difficulty: 2,
  famille: 'dossier',
  updatedAt: '2026-07-12',
  freshness: { type: 'periodic', reviewEveryMonths: 12, lastReviewedAt: '2026-07-12' },

  // ── 1. Portrait en 30 secondes (N1) ─────────────────────────────────────────
  level1: {
    fr: `Valéry Giscard d'Estaing (1926-2020), président de 1974 à 1981. Élu à 48 ans, il incarne une droite libérale non gaulliste qui veut moderniser la France : majorité à 18 ans, loi Veil sur l'IVG, divorce par consentement mutuel. Mais les chocs pétroliers ferment les Trente Glorieuses : chômage et inflation s'installent, sa majorité se déchire avec Jacques Chirac, et il est battu par François Mitterrand en 1981.`,
  },

  // ── N2 : pourquoi élu (2) + en une phrase (12) + 5 dates (13) + 5 mesures (14) ──
  level2: {
    sections: [
      {
        titre: { fr: `Pourquoi a-t-il été élu ?` },
        corps: {
          fr: `L'élection de 1974 est anticipée : le président Georges Pompidou meurt en fonction le 2 avril. Giscard d'Estaing, ministre des Finances sous de Gaulle puis Pompidou, n'est pas gaulliste : il vient des Républicains indépendants, la droite libérale. À 48 ans, il incarne la jeunesse et la modernité face au candidat gaulliste Jacques Chaban-Delmas — affaibli au premier tour, notamment parce que Jacques Chirac et une partie des gaullistes soutiennent Giscard. Au second tour, il bat François Mitterrand, candidat de la gauche unie, avec 50,81 % des voix : l'un des seconds tours les plus serrés de la Ve République. Il promet de moderniser la société sans rupture — ce qu'il appellera la « société libérale avancée ».`,
        },
        sources: [{ label: `Conseil constitutionnel — résultats officiels de l'élection présidentielle de mai 1974`, url: 'https://www.conseil-constitutionnel.fr', year: 1974 }],
      },
      {
        titre: { fr: `Sa présidence en une phrase` },
        brique: 'a-retenir',
        corps: {
          fr: `Le président qui a modernisé la société française en dix-huit mois — majorité à 18 ans, IVG, divorce par consentement mutuel — avant que la crise économique mondiale et la guerre ouverte avec Jacques Chirac ne transforment la fin du septennat en épreuve, conclue par la défaite de 1981.`,
        },
      },
      {
        titre: { fr: `Sa présidence en cinq dates` },
        brique: 'glossaire',
        termes: [
          { nom: { fr: '19 mai 1974' }, def: { fr: `Élu à 48 ans face à François Mitterrand (50,81 %), après la mort de Georges Pompidou. Premier président non gaulliste de la Ve République.` } },
          { nom: { fr: '17 janvier 1975' }, def: { fr: `Promulgation de la loi Veil dépénalisant l'IVG, portée par Simone Veil et votée grâce aux voix de la gauche, contre une partie de sa propre majorité.` } },
          { nom: { fr: 'Novembre 1975' }, def: { fr: `Sommet de Rambouillet : premier G6 (futur G7), réuni à son initiative avec le chancelier allemand Helmut Schmidt pour coordonner les grandes économies face à la crise.` } },
          { nom: { fr: '25 août 1976' }, def: { fr: `Démission de Jacques Chirac — seul Premier ministre de la Ve République à partir de lui-même. Raymond Barre le remplace ; Chirac fonde le RPR en décembre.` } },
          { nom: { fr: '10 mai 1981' }, def: { fr: `Battu par François Mitterrand au second tour (48,24 % des voix) : premier président sortant de la Ve République battu dans les urnes.` } },
        ],
      },
      {
        titre: { fr: `Sa présidence en cinq mesures` },
        brique: 'glossaire',
        termes: [
          { nom: { fr: `Majorité à 18 ans (loi du 5 juillet 1974)` }, def: { fr: `Abaissée de 21 à 18 ans dans les premières semaines du mandat : droit de vote, contrat, mariage sans autorisation. Jamais remise en cause depuis.` } },
          { nom: { fr: `Loi Veil sur l'IVG (1975)` }, def: { fr: `Dépénalisation de l'interruption volontaire de grossesse, défendue par Simone Veil. D'abord votée pour cinq ans, pérennisée en 1979, inscrite dans la Constitution en 2024.` } },
          { nom: { fr: `Divorce par consentement mutuel (loi du 11 juillet 1975)` }, def: { fr: `Fin de l'obligation de prouver une « faute » pour divorcer : le droit de la famille rejoint les mœurs.` } },
          { nom: { fr: `Collège unique (loi Haby, 1975)` }, def: { fr: `Tous les élèves entrent dans le même collège, sans filières séparées à l'entrée en sixième. Structure toujours en vigueur — et toujours débattue.` } },
          { nom: { fr: `Relance européenne (1974-1979)` }, def: { fr: `Création du Conseil européen (1974), élection du Parlement européen au suffrage direct (1979), Système monétaire européen (1979) — précurseur de l'euro, conçu avec Helmut Schmidt.` } },
        ],
      },
    ],
  },

  // ── N3 : rubriques 3-11 du modèle président ─────────────────────────────────
  level3: {
    sections: [
      {
        id: 'programme',
        titre: { fr: `Les grandes lignes de son programme` },
        corps: {
          fr: `La campagne de 1974 est courte — l'élection est anticipée par la mort de Pompidou — et Giscard d'Estaing ne présente pas un catalogue détaillé comme le seront les « 110 propositions » de Mitterrand en 1981. Sa promesse tient en une idée : le changement dans la stabilité. Moderniser la société française sans basculer à gauche.\n\nConcrètement, trois axes. D'abord les réformes de société : adapter le droit aux mœurs réelles des Français (majorité à 18 ans, IVG, divorce), décrisper la vie politique, ouvrir l'audiovisuel en éclatant l'ORTF. Ensuite l'économie : un libéralisme assumé — il vient des Républicains indépendants, pas du gaullisme — qui fait confiance au marché tout en poursuivant les grands programmes d'État (nucléaire, transports). Enfin l'Europe : relancer la construction européenne avec l'Allemagne, en faire l'échelle de réponse à la crise.\n\nIl théorisera cette vision en 1976 dans son livre Démocratie française : une « société libérale avancée », gouvernée au centre, réconciliant liberté économique et progrès social. C'est un programme de temps calme — que les chocs pétroliers vont percuter de plein fouet dès les premières années.`,
        },
        sources: [{ label: `Valéry Giscard d'Estaing, Démocratie française, Fayard, 1976 ; Vie-publique.fr — dossier sur le septennat 1974-1981`, url: 'https://www.vie-publique.fr', year: 2025 }],
      },
      {
        id: 'mesures',
        titre: { fr: `Les principales mesures, une par une` },
        corps: {
          fr: `Majorité à 18 ans (loi du 5 juillet 1974) : votée dans les premières semaines du mandat, elle donne le droit de vote à environ deux millions et demi de jeunes. Jamais contestée depuis.\n\nLoi Veil (promulguée le 17 janvier 1975) : la dépénalisation de l'IVG, portée par la ministre de la Santé Simone Veil dans des débats d'une rare violence. Le texte est adopté en décembre 1974 grâce aux voix de la gauche, une partie de la majorité votant contre. D'abord provisoire (cinq ans), la loi est pérennisée en 1979.\n\nDivorce par consentement mutuel (loi du 11 juillet 1975) : on peut divorcer sans prouver une faute.\n\nÉclatement de l'ORTF (1974) : l'office unique de la radio-télévision publique est scindé en sept sociétés (TF1, Antenne 2, FR3, Radio France…), premier pas vers un paysage audiovisuel moins contrôlé par l'État.\n\nCollège unique (loi Haby, 1975) : suppression des filières à l'entrée en sixième.\n\nPlans Barre (1976-1981) : priorité à la lutte contre l'inflation — modération salariale, vérité des prix, rigueur budgétaire.\n\nGrands programmes : poursuite massive du nucléaire civil (plan Messmer lancé en 1974), décision du TGV Paris-Lyon (inauguré en septembre 1981), préparation du minitel. Côté européen : Conseil européen (1974), Parlement européen élu au suffrage direct (1979), Système monétaire européen (1979).`,
        },
        sources: [
          { label: `Légifrance — lois du 5 juillet 1974, du 17 janvier 1975 (loi Veil), du 11 juillet 1975 (divorce)`, url: 'https://www.legifrance.gouv.fr', year: 1975 },
          { label: `Vie-publique.fr — chronologie des réformes 1974-1981`, url: 'https://www.vie-publique.fr', year: 2025 },
        ],
      },
      {
        id: 'evenements',
        titre: { fr: `Les grands événements du mandat` },
        corps: {
          fr: `Le septennat est encadré par deux chocs pétroliers. Celui de 1973, juste avant son élection, a déjà mis fin aux Trente Glorieuses : l'inflation dépasse les 10 % et le chômage commence sa longue montée. 1974-1975 : la France connaît sa première récession d'après-guerre, pendant que s'enchaînent les grandes réformes de société.\n\nAoût 1976 : Jacques Chirac démissionne de Matignon avec fracas — il s'estime empêché de gouverner. Raymond Barre, présenté par Giscard comme le « meilleur économiste de France », le remplace et engage ses plans de rigueur. En décembre, Chirac fonde le RPR : la guerre des droites est ouverte. Elle culmine en 1977 quand Chirac conquiert la mairie de Paris contre le candidat soutenu par l'Élysée. En 1978, la majorité gagne pourtant les législatives ; les giscardiens se regroupent dans l'UDF.\n\n1979 : second choc pétrolier, qui relance l'inflation et casse la reprise. En octobre, le Canard enchaîné révèle l'affaire des diamants : des cadeaux offerts par Jean-Bedel Bokassa, dictateur centrafricain, quand Giscard était ministre des Finances. La défense présidentielle, tardive et embarrassée, laisse des traces.\n\n1981 : Chirac se présente contre lui, obtient 18 % au premier tour et refuse de le soutenir clairement au second. Le 10 mai, Mitterrand l'emporte.`,
        },
        sources: [{ label: `Vie-publique.fr — chronologie du septennat ; INA — archives des événements cités ; Le Canard enchaîné, octobre 1979 (révélation de l'affaire des diamants)`, url: 'https://www.vie-publique.fr', year: 2025 }],
      },
      {
        id: 'gouverner',
        titre: { fr: `Sa manière de gouverner` },
        corps: {
          fr: `Giscard d'Estaing veut « décrisper » la fonction présidentielle, jugée trop solennelle depuis de Gaulle. Les images sont restées : il descend les Champs-Élysées à pied le jour de son investiture, s'invite à dîner chez des Français « ordinaires », joue de l'accordéon à la télévision, reçoit les éboueurs de l'Élysée. C'est une communication politique nouvelle, qui séduit d'abord — puis se retourne contre lui quand la crise s'installe : le style détendu paraît décalé, et ses adversaires dénoncent au contraire une pratique du pouvoir de plus en plus solitaire et distante en fin de mandat.\n\nSur le fond, c'est un président technicien : polytechnicien, énarque, inspecteur des finances, il gouverne en expert, dossiers en main, et s'appuie sur un Premier ministre économiste (Barre) plutôt que sur un chef politique. Sa faiblesse structurelle est parlementaire : sa famille politique (les Républicains indépendants, puis l'UDF créée en 1978) est minoritaire dans sa propre majorité, dominée par les gaullistes. Toute sa présidence se joue dans cette tension avec le RPR de Chirac — une majorité qui le soutient sans l'aimer, et qui finira par contribuer à sa chute.`,
        },
      },
      {
        id: 'bilan',
        titre: { fr: `Le bilan économique et social — en distinguant ce qui lui revient` },
        corps: {
          fr: `Évolutions constatées : le chômage passe d'environ 500 000 demandeurs d'emploi début 1974 à environ 1,5 million en 1981 ; l'inflation reste à deux chiffres sur l'essentiel du septennat (autour de 13 % en 1981). La croissance ralentit durablement : les Trente Glorieuses sont finies.\n\nCe qui relève du contexte : les deux chocs pétroliers (1973 et 1979) frappent toutes les économies occidentales — le chômage et l'inflation montent partout, pas seulement en France. Aucun gouvernement de l'époque n'a de recette éprouvée contre la « stagflation », combinaison inédite de stagnation et d'inflation.\n\nCe qui relève de ses choix : la relance Chirac de 1975 (jugée coûteuse et vite abandonnée), puis le pari inverse des plans Barre — rigueur, modération salariale, vérité des prix — qui ne fait reculer ni l'inflation de façon décisive ni le chômage avant 1981. À son actif durable : les grands programmes d'investissement — le nucléaire civil, qui fournira l'essentiel de l'électricité française pendant des décennies, et le TGV, décidé sous son mandat.\n\nLes économistes débattent encore de la part du contexte et des politiques suivies dans la montée du chômage ; ce qui est établi, c'est que la gauche héritera en 1981 des mêmes contraintes — et s'y heurtera à son tour dès 1983.`,
        },
        sources: [
          { label: `INSEE — séries longues : demandeurs d'emploi 1974-1981, inflation (environ 13 % en 1981)`, url: 'https://www.insee.fr', year: 1981, perimetre: `France métropolitaine ; définitions du chômage différentes des séries actuelles — comparer avec prudence` },
        ],
      },
      {
        id: 'defenseurs',
        titre: { fr: `Ce que ses défenseurs retiennent` },
        corps: {
          fr: `Le grand modernisateur de la société française : en dix-huit mois, majorité à 18 ans, IVG, divorce par consentement mutuel, éclatement de l'ORTF — des réformes qu'aucun gouvernement n'a défaites depuis, accomplies par un président de droite contre une partie de son propre camp. Pour ses défenseurs, cela suffit à réfuter l'idée que la droite serait par nature incapable de réformes de société.\n\nLe bâtisseur européen : le Conseil européen, le Parlement européen élu au suffrage direct, le Système monétaire européen — l'architecture qui mènera à l'euro doit beaucoup au tandem qu'il forme avec Helmut Schmidt. À l'échelle mondiale, le G7 naît à Rambouillet, à son initiative.\n\nL'investisseur de long terme : le nucléaire civil et le TGV, décidés ou amplifiés sous son mandat, structurent encore l'énergie et les transports français un demi-siècle plus tard.\n\nEnfin, un argument de contexte : gouverner pendant deux chocs pétroliers, sans majorité dévouée, et ne perdre qu'avec 48,24 % des voix face à une gauche unie — ce serait moins un échec qu'une défaite honorable dans des conditions historiques défavorables.`,
        },
      },
      {
        id: 'opposants',
        titre: { fr: `Ce que ses opposants retiennent` },
        corps: {
          fr: `À gauche : un président de la bourgeoisie, élu de justesse, dont le libéralisme économique fait payer la crise aux salariés — les plans Barre riment avec modération salariale et montée du chômage, sans résultat décisif sur l'inflation. Les réformes de société de 1974-1975 sont saluées, mais la gauche rappelle que la loi Veil n'est passée que grâce à ses voix.\n\nChez les gaullistes : un président qui a affaibli l'héritage — trop européen, trop atlantiste, trop libéral, et coupable d'avoir contribué à éliminer Chaban-Delmas en 1974. La rupture avec Chirac en 1976 transforme cette méfiance en guerre ouverte.\n\nCritique transversale de fin de mandat : l'usure et la distance. Le président « décrispé » de 1974 paraît en 1981 hautain et coupé du pays ; l'affaire des diamants, mal gérée pendant des mois, symbolise ce décalage — moins par la gravité des faits que par le silence embarrassé qui a suivi.\n\nEnfin, une critique de méthode : avoir voulu gouverner au centre sans base politique solide, et laissé la rivalité des droites dévorer le septennat au lieu de la trancher.`,
        },
      },
      {
        id: 'heritage',
        titre: { fr: `Son héritage aujourd'hui` },
        corps: {
          fr: `Sociétal : la majorité à 18 ans, l'IVG et le divorce par consentement mutuel sont toujours en vigueur — l'IVG a même été inscrite dans la Constitution en 2024. Le collège unique structure encore l'école, débats compris. Ces réformes restent le contre-exemple central à l'idée reçue selon laquelle la droite française n'aurait jamais porté de réformes de société.\n\nEuropéen : c'est peut-être l'héritage le plus profond. Le Conseil européen qu'il a créé en 1974 est devenu le centre de décision de l'Union ; le Système monétaire européen a préparé l'euro ; le Parlement européen élu au suffrage direct existe depuis 1979. Après sa présidence, il présidera la Convention européenne (2002-2003) qui rédige le projet de Constitution européenne — rejeté par référendum en France en 2005, mais largement repris par le traité de Lisbonne.\n\nMatériel : le parc nucléaire et le TGV, toujours au cœur de l'énergie et des transports français.\n\nPolitique : l'UDF fondée en 1978 a structuré le centre-droit pendant trente ans ; la question giscardienne — une droite libérale et européenne peut-elle exister durablement face à la droite nationale-conservatrice ? — traverse encore la politique française. Il meurt le 2 décembre 2020, des suites du Covid, à 94 ans.`,
        },
        sources: [{ label: `Vie-publique.fr — dossiers sur la construction européenne et la Convention 2002-2003 ; Conseil constitutionnel — loi constitutionnelle du 8 mars 2024 (IVG)`, url: 'https://www.vie-publique.fr', year: 2025 }],
      },
    ],
  },

  // ── Chronologie ──────────────────────────────────────────────────────────────
  chronologie: {
    titre: { fr: `1974-1981 : le septennat` },
    events: [
      { date: '19 mai 1974', titre: { fr: `Élu à 48 ans` }, detail: { fr: `Après la mort de Georges Pompidou (2 avril), Giscard d'Estaing bat François Mitterrand avec 50,81 % des voix — l'un des seconds tours les plus serrés de la Ve République. Jacques Chirac devient Premier ministre.` }, source: { label: `Conseil constitutionnel — résultats de mai 1974`, year: 1974 } },
      { date: '5 juillet 1974', titre: { fr: `Majorité à 18 ans` }, detail: { fr: `L'une des toutes premières lois du mandat : la majorité passe de 21 à 18 ans. La même année, l'ORTF est éclaté en sept sociétés.` } },
      { date: '17 janvier 1975', titre: { fr: `Loi Veil sur l'IVG` }, detail: { fr: `Promulgation de la loi dépénalisant l'avortement, portée par Simone Veil et adoptée en décembre 1974 grâce aux voix de la gauche, contre une partie de la majorité.` }, source: { label: `Légifrance — loi n° 75-17 du 17 janvier 1975`, year: 1975 } },
      { date: '11 juillet 1975', titre: { fr: `L'année des réformes de société` }, detail: { fr: `Divorce par consentement mutuel ; la même année, la loi Haby crée le collège unique. En dix-huit mois, le droit a rejoint les mœurs.` } },
      { date: 'nov. 1975', titre: { fr: `Rambouillet : naissance du G6` }, detail: { fr: `À son initiative, avec Helmut Schmidt, les dirigeants des six grandes économies occidentales se réunissent pour la première fois face à la crise — le futur G7.` } },
      { date: '25 août 1976', titre: { fr: `Chirac claque la porte` }, detail: { fr: `Jacques Chirac démissionne — seul Premier ministre de la Ve République à partir de lui-même — et fonde le RPR en décembre. Raymond Barre le remplace et lance ses plans de rigueur contre l'inflation.` } },
      { date: 'mars 1978', titre: { fr: `Législatives gagnées, majorité divisée` }, detail: { fr: `La majorité l'emporte contre la gauche, donnée favorite. Les giscardiens se regroupent dans l'UDF, face au RPR de Chirac, maire de Paris depuis 1977.` }, source: { label: `Conseil constitutionnel — législatives de mars 1978`, year: 1978 } },
      { date: '1979', titre: { fr: `L'Europe avance, la crise revient` }, detail: { fr: `Système monétaire européen (mars), première élection du Parlement européen au suffrage direct (juin) — et second choc pétrolier, qui relance l'inflation.` } },
      { date: 'oct. 1979', titre: { fr: `L'affaire des diamants` }, detail: { fr: `Le Canard enchaîné révèle des cadeaux en diamants offerts par le dictateur centrafricain Bokassa quand Giscard était ministre des Finances. La défense présidentielle, tardive, laisse des traces durables.` } },
      { date: '10 mai 1981', titre: { fr: `La défaite` }, detail: { fr: `Battu par François Mitterrand (48,24 % des voix), affaibli par le chômage, l'usure et la candidature de Chirac, qui refuse de le soutenir clairement au second tour. Il se consacrera ensuite à l'Europe, jusqu'à présider la Convention européenne (2002-2003).` }, source: { label: `Conseil constitutionnel — résultats de mai 1981`, year: 1981 } },
    ],
  },

  vraiFaux: ['vf-vge-ivg-createur', 'vf-vge-droite-reformes-societe', 'vf-vge-diamants-defaite'],

  quiz: [
    {
      question: { fr: `Comment Valéry Giscard d'Estaing arrive-t-il au pouvoir en 1974 ?` },
      options: [
        { fr: `Il bat le président sortant Georges Pompidou` },
        { fr: `Il est élu lors d'une élection anticipée après la mort de Pompidou, en battant Mitterrand de justesse (50,81 %)` },
        { fr: `Il est nommé par référendum` },
        { fr: `Il succède automatiquement à Pompidou en tant que Premier ministre` },
      ],
      bonneReponse: 1,
      explication: { fr: `La mort de Georges Pompidou le 2 avril 1974 provoque une élection anticipée. Giscard, ministre des Finances et candidat de la droite non gaulliste, bat François Mitterrand au second tour avec 50,81 % — l'un des scores les plus serrés de la Ve République.` },
    },
    {
      question: { fr: `La loi de 1975 dépénalisant l'IVG…` },
      options: [
        { fr: `A été votée par la seule majorité de droite` },
        { fr: `A été adoptée par référendum` },
        { fr: `A été portée par Simone Veil et adoptée grâce aux voix de la gauche, contre une partie de la majorité` },
        { fr: `A été imposée par ordonnance, sans vote du Parlement` },
      ],
      bonneReponse: 2,
      explication: { fr: `Simone Veil, ministre de la Santé, défend le texte dans des débats d'une grande violence. Une partie de la majorité de droite vote contre : ce sont les voix de la gauche qui permettent l'adoption en décembre 1974. Giscard a soutenu la loi, mais ne l'a ni portée ni fait voter par son seul camp.` },
    },
    {
      question: { fr: `Qui ont été ses Premiers ministres ?` },
      options: [
        { fr: `Raymond Barre, puis Jacques Chirac` },
        { fr: `Jacques Chirac (1974-1976), puis Raymond Barre (1976-1981)` },
        { fr: `Pierre Mauroy, puis Jacques Chirac` },
        { fr: `Jacques Chirac pendant tout le septennat` },
      ],
      bonneReponse: 1,
      explication: { fr: `Chirac démissionne avec fracas en août 1976 — seul Premier ministre de la Ve République à partir de sa propre initiative — puis fonde le RPR. Raymond Barre, que Giscard présente comme le « meilleur économiste de France », gouverne ensuite jusqu'en 1981 avec ses plans de rigueur anti-inflation.` },
    },
    {
      question: { fr: `Que s'est-il passé au château de Rambouillet en novembre 1975 ?` },
      options: [
        { fr: `La signature du traité créant l'Union européenne` },
        { fr: `Le premier sommet du G6 (futur G7), réuni à l'initiative de Giscard et d'Helmut Schmidt` },
        { fr: `La création de l'ONU` },
        { fr: `Le premier Conseil européen` },
      ],
      bonneReponse: 1,
      explication: { fr: `Face à la crise économique mondiale, Giscard réunit les dirigeants des six grandes économies occidentales — une première. Le sommet devient annuel : c'est la naissance du G7. Le Conseil européen, lui aussi créé sous son impulsion en 1974, est une institution distincte, propre à l'Europe.` },
    },
    {
      question: { fr: `Parmi ces mesures, laquelle n'a PAS été prise sous Giscard d'Estaing ?` },
      options: [
        { fr: `La majorité à 18 ans` },
        { fr: `La loi Veil sur l'IVG` },
        { fr: `L'abolition de la peine de mort` },
        { fr: `Le divorce par consentement mutuel` },
      ],
      bonneReponse: 2,
      explication: { fr: `L'abolition de la peine de mort date de 1981, sous François Mitterrand (loi Badinter). Sous Giscard, malgré le débat, la peine de mort reste en vigueur. Les trois autres mesures appartiennent bien à la vague de réformes de société de 1974-1975.` },
    },
  ],

  // ── 15. Pour aller plus loin (N4) ────────────────────────────────────────────
  level4: {
    items: [
      { kind: 'discours', titre: { fr: `Discours de Simone Veil à l'Assemblée nationale — 26 novembre 1974` }, note: { fr: `La défense de la loi sur l'IVG devant une Assemblée presque exclusivement masculine et largement hostile. Un des grands discours parlementaires du XXe siècle.` }, url: 'https://www.assemblee-nationale.fr' },
      { kind: 'discours', titre: { fr: `Débat télévisé Giscard-Mitterrand — 10 mai 1974 (INA)` }, note: { fr: `Le premier grand débat d'entre-deux-tours de la Ve République, resté célèbre pour la réplique de Giscard sur le « monopole du cœur ». À comparer avec leur revanche de 1981.` }, url: 'https://www.ina.fr' },
      { kind: 'texte', titre: { fr: `Loi n° 75-17 du 17 janvier 1975 relative à l'interruption volontaire de grossesse` }, note: { fr: `Le texte original de la loi Veil, sur Légifrance.` }, url: 'https://www.legifrance.gouv.fr' },
      { kind: 'donnees', titre: { fr: `INSEE — séries longues inflation et emploi 1974-1981` }, note: { fr: `Pour vérifier soi-même le bilan macroéconomique du septennat.` }, url: 'https://www.insee.fr' },
      { kind: 'biblio', titre: { fr: `Valéry Giscard d'Estaing, Démocratie française — Fayard, 1976` }, note: { fr: `Son manifeste de la « société libérale avancée ». Source partisane par nature, utile pour comprendre le projet de l'intérieur.` } },
      { kind: 'biblio', titre: { fr: `Valéry Giscard d'Estaing, Le Pouvoir et la Vie — Compagnie 12, à partir de 1988` }, note: { fr: `Ses mémoires présidentiels, en plusieurs tomes. Même précaution : c'est sa version des faits.` } },
      { kind: 'lien', titre: { fr: `Vie-publique.fr — dossier « le septennat de Valéry Giscard d'Estaing »` }, note: { fr: `Chronologies, textes et fiches institutionnelles sur la période 1974-1981.` }, url: 'https://www.vie-publique.fr' },
    ],
  },

  figuresLiees: [
    { nom: 'Simone Veil', note: { fr: `ministre de la Santé, loi sur l'IVG — fiche à venir` } },
    { nom: 'Jacques Chirac', note: { fr: `Premier ministre 1974-1976, puis rival — fiche à venir` } },
    { nom: 'Raymond Barre', note: { fr: `Premier ministre 1976-1981, plans de rigueur — fiche à venir` } },
    { nom: 'Helmut Schmidt', note: { fr: `chancelier allemand, tandem européen (SME, G7) — fiche à venir` } },
    { nom: 'Georges Pompidou', note: { fr: `son prédécesseur, mort en fonction en avril 1974 — fiche à venir` } },
  ],

  motsAssocies: ['economie-de-marche', 'dette-publique', 'proportionnelle'],
  continuerAvec: [
    { slug: 'francois-mitterrand' },
    { slug: 'president-de-la-republique' },
    { slug: 'droite' },
  ],

  sources: [
    { label: `Conseil constitutionnel — résultats officiels des scrutins de 1974, 1978 et 1981`, url: 'https://www.conseil-constitutionnel.fr', year: 1981 },
    { label: `Légifrance — textes des lois citées (1974-1975)`, url: 'https://www.legifrance.gouv.fr', year: 1975 },
    { label: `INSEE — séries longues inflation et chômage 1974-1981`, url: 'https://www.insee.fr', year: 1981, perimetre: `définitions d'époque, à comparer avec prudence aux séries actuelles` },
    { label: `Vie-publique.fr — dossiers sur le septennat 1974-1981 et la construction européenne`, url: 'https://www.vie-publique.fr', year: 2025 },
    { label: `Valéry Giscard d'Estaing, Démocratie française, Fayard, 1976 ; Le Pouvoir et la Vie (mémoires, à partir de 1988)`, year: 1988 },
  ],
};
