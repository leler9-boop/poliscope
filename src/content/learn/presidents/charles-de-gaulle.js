/**
 * Fiche président « Charles de Gaulle » — modèle president en 15 rubriques
 * (docs/jyconnaisrien/02, §5). Mapping niveaux : N1 = portrait 30 s ·
 * N2 = pourquoi élu + en une phrase + 5 dates + 5 mesures ·
 * N3 = programme, mesures, événements, gouverner, bilan, défenseurs, opposants,
 * héritage (ids requis par le script de contrôle) · N4 = pour aller plus loin.
 *
 * Périmètre : LA PRÉSIDENCE (1959-1969). L'homme du 18 Juin (1940) et le chef
 * du gouvernement provisoire ne sont évoqués qu'en contexte bref.
 */

export default {
  slug: 'charles-de-gaulle',
  type: 'president',
  porte: 'D1',
  title: { fr: `Charles de Gaulle`, en: 'Charles de Gaulle' },
  icon: '🇫🇷',
  difficulty: 2,
  famille: 'dossier',
  updatedAt: '2026-07-12',
  freshness: { type: 'periodic', reviewEveryMonths: 12, lastReviewedAt: '2026-07-12' },

  // ── 1. Portrait en 30 secondes (N1) ─────────────────────────────────────────
  level1: {
    fr: `Charles de Gaulle (1890-1970), fondateur de la Ve République, président de 1959 à 1969. L'homme du 18 Juin revient au pouvoir en 1958 sur fond de crise algérienne, dote la France de nouvelles institutions, mène l'Algérie à l'indépendance et affirme l'indépendance nationale face aux deux blocs — avant de démissionner en 1969 après un référendum perdu. Une figure dominante, admirée et contestée, dont presque tous les camps politiques se réclament aujourd'hui.`,
  },

  // ── N2 : pourquoi élu (2) + en une phrase (12) + 5 dates (13) + 5 mesures (14) ──
  level2: {
    sections: [
      {
        titre: { fr: `Pourquoi a-t-il été élu ?` },
        corps: {
          fr: `En mai 1958, la guerre d'Algérie fait vaciller la IVe République : à Alger, militaires et partisans de l'Algérie française se soulèvent, et beaucoup craignent une guerre civile. De Gaulle, retiré de la vie politique depuis 1946, apparaît comme le seul recours accepté à la fois par l'armée et par une grande partie de la classe politique. Investi dernier président du Conseil de la IVe République, il fait approuver une nouvelle Constitution par référendum (28 septembre 1958, plus de 80 % de oui), puis est élu président en décembre 1958 — non par les citoyens, mais par un collège élargi d'environ 80 000 élus, avec 78,5 % des voix. Il ne sera élu au suffrage universel direct qu'en décembre 1965, au second tour face à François Mitterrand (55,2 %), après avoir été mis en ballottage au premier.`,
        },
        sources: [{ label: `Conseil constitutionnel — résultats officiels des scrutins de 1958 et 1965`, url: 'https://www.conseil-constitutionnel.fr', year: 1965 }],
      },
      {
        titre: { fr: `Sa présidence en une phrase` },
        brique: 'a-retenir',
        corps: {
          fr: `Le président qui a construit les institutions dans lesquelles la France vit encore, sorti le pays de la guerre d'Algérie et affirmé son indépendance sur la scène mondiale — au prix d'une pratique très personnelle du pouvoir, qu'il a lui-même soumise au verdict des urnes jusqu'à en partir, en 1969, sur un référendum perdu.`,
        },
      },
      {
        titre: { fr: `Sa présidence en cinq dates` },
        brique: 'glossaire',
        termes: [
          { nom: { fr: '21 décembre 1958' }, def: { fr: `Élu premier président de la Ve République par un collège d'environ 80 000 élus (78,5 %). Il entre en fonction le 8 janvier 1959.` } },
          { nom: { fr: '18 mars 1962' }, def: { fr: `Accords d'Évian : cessez-le-feu en Algérie, approuvé par référendum à 90,8 % en avril. L'Algérie devient indépendante en juillet 1962.` } },
          { nom: { fr: '28 octobre 1962' }, def: { fr: `Référendum instaurant l'élection du président au suffrage universel direct (62 % de oui), contre l'avis de la plupart des partis. La décision qui structure encore toute la vie politique française.` } },
          { nom: { fr: 'Mai-juin 1968' }, def: { fr: `Crise étudiante puis grève générale — la plus grande de l'histoire du pays. Après un moment de flottement, de Gaulle dissout l'Assemblée et remporte un raz-de-marée électoral en juin.` } },
          { nom: { fr: '28 avril 1969' }, def: { fr: `Démission, le lendemain du référendum perdu sur la régionalisation et la réforme du Sénat (52,4 % de non), conformément à son engagement. Il se retire à Colombey et meurt le 9 novembre 1970.` } },
        ],
      },
      {
        titre: { fr: `Sa présidence en cinq mesures` },
        brique: 'glossaire',
        termes: [
          { nom: { fr: `La Constitution de la Ve République (1958) et l'élection du président au suffrage direct (1962)` }, def: { fr: `Un exécutif fort et stable : les institutions actuelles de la France, toujours en vigueur près de soixante-dix ans plus tard.` } },
          { nom: { fr: `Plan Rueff et nouveau franc (1958-1960)` }, def: { fr: `Redressement financier par la rigueur et la dévaluation, création du nouveau franc : la base monétaire de la forte croissance des années 1960.` } },
          { nom: { fr: `La force de frappe nucléaire (première bombe en 1960)` }, def: { fr: `La dissuasion nucléaire indépendante, cœur de la doctrine de défense française — jamais remise en cause depuis, par aucune majorité.` } },
          { nom: { fr: `Retrait du commandement intégré de l'OTAN (1966)` }, def: { fr: `La France reste dans l'Alliance atlantique mais reprend le contrôle total de ses forces. Le retour dans le commandement intégré n'aura lieu qu'en 2009.` } },
          { nom: { fr: `Participation et intéressement (ordonnance de 1967)` }, def: { fr: `Associer les salariés aux résultats de l'entreprise : la « troisième voie » sociale gaulliste, entre capitalisme libéral et collectivisme, toujours en vigueur sous forme d'intéressement et de participation.` } },
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
          fr: `De Gaulle ne revient pas au pouvoir avec un programme de parti : il revient avec un projet de refondation. D'abord les institutions — la Constitution du 4 octobre 1958, approuvée massivement par référendum, donne à l'exécutif la stabilité et l'autorité qui manquaient à la IVe République, dans la ligne de ses idées exposées dès le discours de Bayeux (1946). Ensuite le redressement économique : le plan Rueff (décembre 1958) combine rigueur budgétaire, dévaluation et création du nouveau franc (1960), pour préparer l'ouverture de l'économie française à la concurrence du Marché commun. Enfin, « une certaine idée de la France » : l'indépendance nationale dans tous les domaines — défense autonome avec la force de frappe, diplomatie refusant la logique des blocs, État stratège pilotant la modernisation industrielle.\n\nSur l'Algérie, la question qui l'a ramené au pouvoir, ses intentions initiales restent débattues par les historiens : le « Je vous ai compris » lancé à Alger le 4 juin 1958 était volontairement ambigu, et sa politique a évolué par étapes, de l'ambiguïté vers l'autodétermination (septembre 1959) puis l'indépendance. En 1965, il fait une campagne tardive et minimale, sur le thème de la stabilité et de la poursuite de l'œuvre engagée.`,
        },
        sources: [
          { label: `Discours de Bayeux, 16 juin 1946, et conférence de presse du 4 juin 1958 — textes via la Fondation Charles de Gaulle et vie-publique.fr`, url: 'https://www.vie-publique.fr', year: 1958 },
          { label: `Julian Jackson, De Gaulle, Seuil, 2019 — sur le débat historiographique autour de ses intentions algériennes`, year: 2019 },
        ],
      },
      {
        id: 'mesures',
        titre: { fr: `Les principales mesures, une par une` },
        corps: {
          fr: `Les institutions : Constitution de 1958, puis révision de 1962 instaurant l'élection du président au suffrage universel direct (référendum du 28 octobre 1962, 62 % de oui) — la mesure la plus durable de toute la présidence.\n\nL'économie : plan Rueff-Pinay (décembre 1958) et nouveau franc (1960) ; planification indicative et grands programmes industriels (aéronautique, spatial, nucléaire civil) portés par un État stratège, dans le contexte de forte croissance des Trente Glorieuses.\n\nLa défense et la diplomatie : première bombe atomique française (13 février 1960, à Reggane, au Sahara), construction de la force de dissuasion ; retrait du commandement intégré de l'OTAN (1966) sans quitter l'Alliance ; double veto à l'entrée du Royaume-Uni dans la CEE (1963 et 1967) ; reconnaissance de la Chine populaire (1964) ; traité de l'Élysée avec le chancelier Adenauer (22 janvier 1963), acte fondateur de la réconciliation franco-allemande.\n\nLe social et la culture : ordonnance de 1967 sur la participation et l'intéressement des salariés ; création du ministère des Affaires culturelles confié à André Malraux (1959), maisons de la culture ; création de l'ORTF (1964) — un audiovisuel public dont le contrôle gouvernemental de l'information sera l'une des critiques majeures adressées au régime.`,
        },
        sources: [
          { label: `Légifrance — Constitution du 4 octobre 1958, loi référendaire du 6 novembre 1962, ordonnance du 17 août 1967 sur la participation`, url: 'https://www.legifrance.gouv.fr', year: 1967 },
          { label: `Vie-publique.fr — chronologies de la présidence de Gaulle (1959-1969)`, url: 'https://www.vie-publique.fr', year: 2025 },
        ],
      },
      {
        id: 'evenements',
        titre: { fr: `Les grands événements du mandat` },
        corps: {
          fr: `1959-1962 : la sortie de la guerre d'Algérie domine tout. Autodétermination proposée en 1959, semaine des barricades à Alger (1960), putsch des généraux (avril 1961, échoué), accords d'Évian (18 mars 1962, approuvés par référendum à 90,8 %), indépendance en juillet 1962. L'OAS, organisation clandestine partisane de l'Algérie française, multiplie les attentats : de Gaulle échappe de peu à celui du Petit-Clamart (22 août 1962). Cette période comporte aussi des pages sombres côté répression : la manifestation d'Algériens du 17 octobre 1961 à Paris, réprimée par la police avec des dizaines de morts selon les travaux des historiens, et la manifestation anti-OAS du métro Charonne (février 1962, neuf morts).\n\nOctobre-novembre 1962 : crise institutionnelle majeure — l'Assemblée censure le gouvernement Pompidou (seule motion de censure adoptée de toute la Ve République jusqu'en 2024), de Gaulle dissout, gagne le référendum sur le suffrage universel direct puis les législatives. Décembre 1965 : mis en ballottage au premier tour, il est réélu face à Mitterrand (55,2 %). 1966-1967 : OTAN, discours de Phnom Penh contre la guerre du Vietnam, « Vive le Québec libre » à Montréal (juillet 1967, incident diplomatique avec le Canada). Mai-juin 1968 : crise étudiante puis grève générale (autour de 7 à 10 millions de grévistes selon les estimations, chiffre débattu), accords de Grenelle (hausse du SMIG d'environ 35 %), disparition d'une journée à Baden-Baden (29 mai), discours du 30 mai, dissolution et victoire électorale écrasante en juin. Avril 1969 : référendum perdu, démission.`,
        },
        sources: [
          { label: `Vie-publique.fr — chronologie 1958-1969 ; INA — archives des événements cités`, url: 'https://www.vie-publique.fr', year: 2025 },
          { label: `Sur le 17 octobre 1961 : bilan documenté par les travaux des historiens (dossier vie-publique.fr et historiographie citée par Julian Jackson, De Gaulle, Seuil, 2019)`, year: 2019 },
        ],
      },
      {
        id: 'gouverner',
        titre: { fr: `Sa manière de gouverner` },
        corps: {
          fr: `Une pratique verticale et personnelle du pouvoir, assumée. De Gaulle gouverne au-dessus des partis, qu'il méprise ouvertement, et réserve à l'Élysée les grands domaines — défense, diplomatie, Algérie —, laissant l'intendance à ses Premiers ministres : Michel Debré (1959-1962), Georges Pompidou (1962-1968), Maurice Couve de Murville (1968-1969). Ses outils de prédilection : le référendum, qu'il transforme en question de confiance en menaçant de partir en cas de non — ses adversaires parlent de plébiscite —, la dissolution, les conférences de presse théâtrales et l'allocution télévisée, dont il est le premier grand utilisateur.\n\nCette pratique nourrit la principale critique de l'époque : le « pouvoir personnel ». François Mitterrand en fait un livre, Le Coup d'État permanent (1964), qui accuse le régime d'être une monarchie déguisée. Le contrôle gouvernemental de l'information à l'ORTF — où les journaux télévisés sont étroitement surveillés par le pouvoir — est documenté et régulièrement dénoncé par les oppositions. À l'inverse, de Gaulle revendique une légitimité directe, scellée dans les urnes : il aura engagé son mandat sur chaque référendum, et sera effectivement parti le lendemain du seul qu'il ait perdu — cohérence que même ses adversaires lui ont reconnue.`,
        },
        sources: [{ label: `François Mitterrand, Le Coup d'État permanent, Plon, 1964 ; Jean Lacouture, De Gaulle, t. 3 Le Souverain, Seuil, 1986`, year: 1986 }],
      },
      {
        id: 'bilan',
        titre: { fr: `Le bilan économique et social — en distinguant ce qui lui revient` },
        corps: {
          fr: `Évolutions constatées : la décennie 1959-1969 est l'une des plus prospères de l'histoire française — croissance forte (environ 5 % par an en moyenne sur les années 1960, selon les séries longues de l'INSEE), quasi-plein emploi, industrialisation rapide, monnaie stabilisée après le plan Rueff, hausse continue du niveau de vie.\n\nCe qui relève de ses choix : le redressement financier de 1958-1960, douloureux à court terme mais qui a permis d'entrer dans le Marché commun en position de force ; la stabilité institutionnelle, qui a mis fin à la valse des gouvernements ; les grands programmes technologiques et industriels, dont certains fruits (nucléaire, aéronautique, spatial) structurent encore l'économie. Ce qui relève du contexte : la croissance exceptionnelle était générale dans le monde occidental (les Trente Glorieuses), portée par la reconstruction, le baby-boom et le rattrapage technologique — la France n'était pas une exception, même si elle a fait mieux que plusieurs voisins.\n\nCe que les historiens débattent : la part de la modernisation qui revient à la Ve République naissante et celle qui prolongeait les dynamiques engagées sous la IVe (planification, Europe, baby-boom) ; et l'envers social du décor — salaires contenus, société jugée rigide et autoritaire par la jeunesse — qui éclate en mai 1968. Le paradoxe du bilan gaullien est là : une réussite matérielle incontestable, et une crise sociale majeure à son terme.`,
        },
        sources: [
          { label: `INSEE — séries longues de croissance et d'emploi, années 1960`, url: 'https://www.insee.fr', year: 1969, perimetre: `séries reconstituées, définitions d'époque — comparer avec prudence aux séries actuelles` },
          { label: `Jean Lacouture, De Gaulle, t. 3, Seuil, 1986 ; Julian Jackson, De Gaulle, Seuil, 2019 — chapitres sur le bilan économique et Mai 68`, year: 2019 },
        ],
      },
      {
        id: 'defenseurs',
        titre: { fr: `Ce que ses défenseurs retiennent` },
        corps: {
          fr: `Le fondateur : des institutions stables qui ont survécu à toutes les crises — cohabitations, alternances, dissolutions — quand les régimes précédents s'effondraient ; aucune majorité n'a proposé sérieusement d'en sortir. Le décolonisateur réaliste : avoir sorti la France de la guerre d'Algérie sans guerre civile en métropole, contre une partie de son propre camp et au péril de sa vie. L'homme de l'indépendance : la dissuasion nucléaire, une diplomatie qui parle à tous (Moscou, Pékin, le tiers-monde) sans quitter le camp occidental, la réconciliation franco-allemande — un « rang » retrouvé pour un pays moyen. Le modernisateur : monnaie assainie, industrie transformée, niveau de vie en forte hausse. Et une éthique du pouvoir : désintéressement matériel notoire, refus des honneurs, départ immédiat après le référendum perdu de 1969 — l'exact contraire de l'homme accroché au pouvoir que dénonçaient ses adversaires, répondent ses défenseurs.`,
        },
      },
      {
        id: 'opposants',
        titre: { fr: `Ce que ses opposants retiennent` },
        corps: {
          fr: `À gauche : le « pouvoir personnel » — un régime taillé pour un homme, des référendums-plébiscites, une Assemblée abaissée, une information verrouillée à l'ORTF ; c'est la charge du Coup d'État permanent de Mitterrand (1964). S'y ajoutent les pages sombres de la fin de la guerre d'Algérie : la répression du 17 octobre 1961 et de Charonne (février 1962), longtemps minorées, ainsi que le sort des harkis, ces supplétifs algériens de l'armée française massivement abandonnés après 1962 — des dossiers documentés par les historiens et reconnus officiellement des décennies plus tard.\n\nChez les partisans de l'Algérie française et une partie de la droite : la « trahison » d'Évian, après des engagements jugés contraires. Chez les européistes : l'Europe bloquée — double veto au Royaume-Uni, crise de la « chaise vide » (1965-1966) contre la supranationalité. Chez les libéraux : un État jugé trop dirigiste et une télévision d'État. Et pour la génération de 1968 : un pouvoir vieilli, paternaliste, incapable de comprendre la société qu'il avait contribué à transformer.`,
        },
      },
      {
        id: 'heritage',
        titre: { fr: `Son héritage aujourd'hui` },
        corps: {
          fr: `Institutionnel : la France vit toujours dans les institutions de 1958-1962. L'élection du président au suffrage universel direct structure toute la vie politique, et le débat récurrent sur l'« hyper-présidence » ou la « monarchie républicaine » est, au fond, un débat sur l'héritage gaullien. Stratégique : la dissuasion nucléaire indépendante reste le socle de la défense française, jamais remise en cause ; la voix « indépendante » de la France dans les crises internationales se réclame régulièrement de lui.\n\nPolitique : le gaullisme comme famille a porté la droite française pendant des décennies (UDR, RPR, puis UMP et LR s'en réclament), mais l'héritage a largement débordé son camp — des responsables de gauche, souverainistes, centristes et même d'extrême droite invoquent aujourd'hui de Gaulle, souvent pour des raisons contradictoires. Cette captation générale est le signe le plus sûr de son statut : il est devenu une référence nationale plus qu'un marqueur partisan.\n\nMémoriel : il domine régulièrement les classements des personnalités préférées de l'histoire de France, et des milliers de rues, places et établissements portent son nom. Les zones d'ombre — 17 octobre 1961, harkis, ORTF — sont désormais documentées et débattues publiquement, sans effacer le reste : c'est le propre des très grandes figures que d'être discutées en entier.`,
        },
      },
    ],
  },

  // ── Chronologie ──────────────────────────────────────────────────────────────
  chronologie: {
    titre: { fr: `1958-1969 : la décennie fondatrice` },
    events: [
      { date: '21 déc. 1958', titre: { fr: `Premier président de la Ve République` }, detail: { fr: `Après le retour au pouvoir de mai-juin 1958 et l'adoption de la nouvelle Constitution par référendum, de Gaulle est élu président par un collège d'environ 80 000 élus (78,5 %). Entrée en fonction le 8 janvier 1959.` }, source: { label: `Conseil constitutionnel — résultats 1958`, year: 1958 } },
      { date: '13 févr. 1960', titre: { fr: `Première bombe atomique française` }, detail: { fr: `Essai « Gerboise bleue » à Reggane, au Sahara : la France devient la quatrième puissance nucléaire. La force de frappe devient le pilier de la défense nationale.` } },
      { date: 'avril 1961', titre: { fr: `Le putsch des généraux` }, detail: { fr: `Quatre généraux tentent un coup de force à Alger contre la politique d'autodétermination. Le putsch échoue en quelques jours, notamment après l'allocution télévisée de de Gaulle appelant les soldats à refuser d'obéir.` } },
      { date: '18 mars 1962', titre: { fr: `Les accords d'Évian` }, detail: { fr: `Cessez-le-feu en Algérie après près de huit ans de guerre. Les accords sont approuvés par référendum à 90,8 % en avril ; l'Algérie devient indépendante en juillet 1962. L'OAS poursuit ses attentats — dont celui du Petit-Clamart contre de Gaulle (22 août 1962).` }, source: { label: `Vie-publique.fr — la fin de la guerre d'Algérie`, year: 2025 } },
      { date: '28 oct. 1962', titre: { fr: `Le président élu par les Français` }, detail: { fr: `Référendum instaurant l'élection du président au suffrage universel direct (62 % de oui), contre l'avis de la plupart des partis. L'Assemblée avait censuré le gouvernement Pompidou (5 octobre) ; de Gaulle dissout et gagne les législatives dans la foulée.` }, source: { label: `Conseil constitutionnel — référendum du 28 octobre 1962`, year: 1962 } },
      { date: '22 janv. 1963', titre: { fr: `Le traité de l'Élysée` }, detail: { fr: `Traité d'amitié franco-allemand signé avec le chancelier Adenauer : l'acte fondateur du « couple » franco-allemand. La même année, premier veto à l'entrée du Royaume-Uni dans la CEE (second veto en 1967).` } },
      { date: '19 déc. 1965', titre: { fr: `Réélu — après un ballottage` }, detail: { fr: `Première présidentielle au suffrage universel direct : mis en ballottage au premier tour, de Gaulle bat François Mitterrand au second (55,2 %). Le mythe de l'unanimité autour du Général en sort écorné.` }, source: { label: `Conseil constitutionnel — résultats 1965`, year: 1965 } },
      { date: '1966-1967', titre: { fr: `L'indépendance tous azimuts` }, detail: { fr: `Retrait du commandement intégré de l'OTAN (1966), discours de Phnom Penh contre la guerre du Vietnam (1966), reconnaissance de la Chine populaire dès 1964 — et « Vive le Québec libre » à Montréal (24 juillet 1967), qui provoque un incident diplomatique avec le Canada.` } },
      { date: 'mai-juin 1968', titre: { fr: `La grande crise` }, detail: { fr: `Révolte étudiante puis grève générale (environ 7 à 10 millions de grévistes selon les estimations). Accords de Grenelle (SMIG relevé d'environ 35 %), disparition d'une journée à Baden-Baden (29 mai), discours du 30 mai, dissolution — et raz-de-marée gaulliste aux législatives de juin.` } },
      { date: '28 avril 1969', titre: { fr: `Le départ` }, detail: { fr: `Le référendum sur la régionalisation et la réforme du Sénat est rejeté (52,4 % de non) : de Gaulle démissionne le lendemain, comme il s'y était engagé. Retiré à Colombey-les-Deux-Églises, il rédige ses Mémoires et meurt le 9 novembre 1970.` }, source: { label: `Conseil constitutionnel — référendum du 27 avril 1969`, year: 1969 } },
    ],
  },

  vraiFaux: ['vf-degaulle-classique', 'vf-degaulle-elu-1958', 'vf-degaulle-mai68', 'vf-degaulle-algerie-intentions'],

  quiz: [
    {
      question: { fr: `Comment de Gaulle a-t-il été élu président en 1958 ?` },
      options: [
        { fr: `Au suffrage universel direct, par tous les électeurs` },
        { fr: `Par un collège élargi d'environ 80 000 élus, avec 78,5 % des voix` },
        { fr: `Par référendum` },
        { fr: `Par l'Assemblée nationale seule` },
      ],
      bonneReponse: 1,
      explication: { fr: `En 1958, le président est élu par un collège de grands électeurs (parlementaires, élus locaux…). L'élection au suffrage universel direct n'est instaurée que par le référendum de 1962 — première application en 1965.` },
    },
    {
      question: { fr: `Que décide le référendum du 28 octobre 1962 ?` },
      options: [
        { fr: `L'indépendance de l'Algérie` },
        { fr: `L'entrée de la France dans le Marché commun` },
        { fr: `L'élection du président de la République au suffrage universel direct` },
        { fr: `La création du Sénat` },
      ],
      bonneReponse: 2,
      explication: { fr: `Adoptée à 62 % contre l'avis de la plupart des partis, cette réforme fait du président l'élu direct des Français. C'est la décision institutionnelle la plus durable de la présidence — elle structure encore toute la vie politique.` },
    },
    {
      question: { fr: `Que se passe-t-il à la présidentielle de décembre 1965 ?` },
      options: [
        { fr: `De Gaulle est élu triomphalement dès le premier tour` },
        { fr: `De Gaulle est mis en ballottage, puis réélu au second tour face à François Mitterrand (55,2 %)` },
        { fr: `De Gaulle est battu par François Mitterrand` },
        { fr: `L'élection est annulée à cause de la guerre d'Algérie` },
      ],
      bonneReponse: 1,
      explication: { fr: `Première élection présidentielle au suffrage universel direct de la Ve République : contre toute attente, de Gaulle n'obtient pas la majorité au premier tour. Il l'emporte au second face à Mitterrand, candidat unique de la gauche.` },
    },
    {
      question: { fr: `Pourquoi de Gaulle démissionne-t-il le 28 avril 1969 ?` },
      options: [
        { fr: `Il est renversé par une motion de censure` },
        { fr: `Il est battu à une élection présidentielle` },
        { fr: `Mai 68 le contraint immédiatement au départ` },
        { fr: `Il perd le référendum sur la régionalisation et la réforme du Sénat (52,4 % de non), et part comme il s'y était engagé` },
      ],
      bonneReponse: 3,
      explication: { fr: `De Gaulle avait lié son maintien au pouvoir au résultat du référendum du 27 avril 1969. Le non l'emporte : il démissionne dès le lendemain — près d'un an après avoir gagné massivement les législatives de juin 1968.` },
    },
    {
      question: { fr: `Que signifie le retrait de l'OTAN décidé en 1966 ?` },
      options: [
        { fr: `La France quitte le commandement militaire intégré, mais reste membre de l'Alliance atlantique` },
        { fr: `La France quitte totalement l'Alliance atlantique et devient neutre` },
        { fr: `La France rejoint le pacte de Varsovie` },
        { fr: `La France abandonne son armée nucléaire` },
      ],
      bonneReponse: 0,
      explication: { fr: `De Gaulle retire la France du commandement intégré pour garder le contrôle total de ses forces, sans quitter l'Alliance : la France reste dans le camp occidental. Elle ne réintégrera le commandement intégré qu'en 2009.` },
    },
  ],

  // ── 15. Pour aller plus loin (N4) ────────────────────────────────────────────
  level4: {
    items: [
      { kind: 'texte', titre: { fr: `Discours de Bayeux — 16 juin 1946` }, note: { fr: `Le texte fondateur de sa conception des institutions, douze ans avant la Ve République : un chef de l'État au-dessus des partis, garant de la continuité nationale.` }, url: 'https://www.vie-publique.fr' },
      { kind: 'discours', titre: { fr: `Allocution du 23 avril 1961 face au putsch des généraux (INA)` }, note: { fr: `« Un quarteron de généraux en retraite » : l'allocution en uniforme qui contribue à faire échouer le putsch d'Alger, écoutée sur les transistors jusque dans les casernes.` }, url: 'https://www.ina.fr' },
      { kind: 'discours', titre: { fr: `Allocution du 30 mai 1968 (INA)` }, note: { fr: `Le discours radiodiffusé qui retourne la crise de Mai 68 : refus de partir, dissolution de l'Assemblée — suivi le jour même d'une immense manifestation de soutien sur les Champs-Élysées.` }, url: 'https://www.ina.fr' },
      { kind: 'donnees', titre: { fr: `Conseil constitutionnel — résultats des scrutins 1958-1969` }, note: { fr: `Élections de 1958 et 1965, référendums de 1961, 1962 (avril et octobre) et 1969 : les chiffres officiels, pour vérifier soi-même.` }, url: 'https://www.conseil-constitutionnel.fr' },
      { kind: 'biblio', titre: { fr: `Jean Lacouture, De Gaulle (3 tomes) — Seuil, 1984-1986` }, note: { fr: `La grande biographie française classique ; le tome 3, Le Souverain, couvre la présidence.` } },
      { kind: 'biblio', titre: { fr: `Julian Jackson, De Gaulle — Seuil, 2019` }, note: { fr: `La biographie de référence la plus récente, par un historien britannique : distanciée, très documentée, attentive aux zones d'ombre comme aux réussites.` } },
      { kind: 'lien', titre: { fr: `Fondation Charles de Gaulle — archives, discours et chronologies` }, note: { fr: `Source mémorielle par nature, utile pour les textes originaux et les documents d'époque.` }, url: 'https://www.charles-de-gaulle.org' },
    ],
  },

  figuresLiees: [
    { nom: 'Michel Debré', note: { fr: `Premier ministre 1959-1962, rédacteur de la Constitution — fiche à venir` } },
    { nom: 'André Malraux', note: { fr: `ministre des Affaires culturelles 1959-1969 — fiche à venir` } },
    { nom: 'Konrad Adenauer', note: { fr: `le traité de l'Élysée et la réconciliation franco-allemande — fiche à venir` } },
    { nom: 'Maurice Couve de Murville', note: { fr: `ministre des Affaires étrangères puis Premier ministre — fiche à venir` } },
    { nom: `Valéry Giscard d'Estaing`, note: { fr: `ministre des Finances, puis la fronde du « oui, mais » — fiche à venir` } },
  ],

  motsAssocies: ['motion-de-censure', '49-3', { label: { fr: 'Référendum' }, soon: true }],
  continuerAvec: [
    { slug: 'georges-pompidou' },
    { slug: 'president-de-la-republique' },
    { slug: 'droite' },
  ],

  sources: [
    { label: `Conseil constitutionnel — résultats officiels des scrutins de 1958, 1961, 1962, 1965, 1969`, url: 'https://www.conseil-constitutionnel.fr', year: 1969 },
    { label: `Légifrance — Constitution du 4 octobre 1958 et textes cités (1958-1967)`, url: 'https://www.legifrance.gouv.fr', year: 1967 },
    { label: `Vie-publique.fr — dossiers « les années de Gaulle » et chronologies de la Ve République`, url: 'https://www.vie-publique.fr', year: 2025 },
    { label: `Jean Lacouture, De Gaulle, 3 tomes, Seuil, 1984-1986`, year: 1986 },
    { label: `Julian Jackson, De Gaulle, Seuil, 2019`, year: 2019 },
  ],
};
