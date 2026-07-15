/**
 * Fiche président « Georges Pompidou » — modèle president en 15 rubriques
 * (docs/jyconnaisrien/02, §5). Mapping niveaux : N1 = portrait 30 s ·
 * N2 = pourquoi élu + en une phrase + 5 dates + 5 mesures ·
 * N3 = programme, mesures, événements, gouverner, bilan, défenseurs, opposants,
 * héritage (ids requis par le script de contrôle) · N4 = pour aller plus loin.
 */

export default {
  slug: 'georges-pompidou',
  type: 'president',
  porte: 'D1',
  title: { fr: `Georges Pompidou`, en: 'Georges Pompidou' },
  icon: '🏭',
  difficulty: 2,
  famille: 'dossier',
  updatedAt: '2026-07-12',
  freshness: { type: 'periodic', reviewEveryMonths: 12, lastReviewedAt: '2026-07-12' },

  // ── 1. Portrait en 30 secondes (N1) ─────────────────────────────────────────
  level1: {
    fr: `Georges Pompidou (1911-1974), gaulliste, président de 1969 à 1974, après avoir été le Premier ministre le plus durable de de Gaulle (1962-1968). Élu en 1969 face au centriste Alain Poher, il incarne « le changement dans la continuité » : fidélité aux institutions, mais industrialisation accélérée, ouverture de l'Europe au Royaume-Uni et goût de l'art contemporain. Malade, il meurt en fonction le 2 avril 1974, à la toute fin des Trente Glorieuses.`,
  },

  // ── N2 : pourquoi élu (2) + en une phrase (12) + 5 dates (13) + 5 mesures (14) ──
  level2: {
    sections: [
      {
        titre: { fr: `Pourquoi a-t-il été élu ?` },
        corps: {
          fr: `Le 28 avril 1969, de Gaulle démissionne après avoir perdu son référendum. Pompidou, qui a dirigé le gouvernement pendant six ans et négocié les accords de Grenelle en mai 1968, est le candidat naturel de la majorité : il rassure les gaullistes par la continuité et attire une partie des centristes par son ouverture, notamment européenne. En face, la gauche part divisée et est éliminée dès le premier tour. Le second tour l'oppose à Alain Poher, président centriste du Sénat, que le Parti communiste renvoie dos à dos avec lui — « bonnet blanc et blanc bonnet » — en appelant à l'abstention. Pompidou l'emporte le 15 juin 1969 avec environ 58,2 % des voix.`,
        },
        sources: [{ label: `Conseil constitutionnel — résultats officiels de l'élection présidentielle des 1er et 15 juin 1969`, url: 'https://www.conseil-constitutionnel.fr', year: 1969 }],
      },
      {
        titre: { fr: `Sa présidence en une phrase` },
        brique: 'a-retenir',
        corps: {
          fr: `Le président qui a prouvé que la Ve République pouvait survivre à son fondateur, et qui a mis la France à l'heure industrielle — usines, autoroutes, Airbus, nucléaire — tout en ouvrant l'Europe au Royaume-Uni, avant de mourir en fonction, sa maladie dissimulée aux Français.`,
        },
      },
      {
        titre: { fr: `Sa présidence en cinq dates` },
        brique: 'glossaire',
        termes: [
          { nom: { fr: '15 juin 1969' }, def: { fr: `Élu président au second tour face à Alain Poher, avec environ 58,2 % des voix. La gauche, éliminée au premier tour, était absente du duel.` } },
          { nom: { fr: '1er-2 décembre 1969' }, def: { fr: `Sommet européen de La Haye : Pompidou lève le veto que de Gaulle opposait à l'entrée du Royaume-Uni dans la CEE. L'adhésion devient effective en 1973.` } },
          { nom: { fr: '23 avril 1972' }, def: { fr: `Référendum sur l'élargissement de la CEE : environ 68 % de oui, mais environ 40 % d'abstention — une victoire arithmétique, une déception politique.` } },
          { nom: { fr: 'Octobre 1973' }, def: { fr: `Premier choc pétrolier : le prix du pétrole s'envole après la guerre du Kippour. La fin des Trente Glorieuses se joue dans les derniers mois du mandat.` } },
          { nom: { fr: '2 avril 1974' }, def: { fr: `Mort en fonction, emporté par la maladie de Waldenström qu'il avait dissimulée. Deuxième président de la Ve République à ne pas achever son mandat.` } },
        ],
      },
      {
        titre: { fr: `Sa présidence en cinq mesures` },
        brique: 'glossaire',
        termes: [
          { nom: { fr: `Création du SMIC (1970)` }, def: { fr: `Le salaire minimum de croissance, indexé sur la croissance et non plus seulement sur les prix, remplace le SMIG. Il existe toujours.` } },
          { nom: { fr: `Entrée du Royaume-Uni dans la CEE (1969-1973)` }, def: { fr: `La levée du veto gaulliste au sommet de La Haye relance la construction européenne : l'Europe des Six devient l'Europe des Neuf en 1973.` } },
          { nom: { fr: `L'« impératif industriel »` }, def: { fr: `Soutien aux champions nationaux : Airbus (premier vol de l'A300 en 1972), Concorde, complexe sidérurgique de Fos-sur-Mer, autoroutes, études du futur TGV.` } },
          { nom: { fr: `Mensualisation des salaires (1970)` }, def: { fr: `Engagée par accord entre patronat et syndicats sous l'impulsion du gouvernement Chaban-Delmas : les ouvriers payés à l'heure deviennent progressivement des salariés mensualisés.` } },
          { nom: { fr: `Décision du Centre Beaubourg (1969)` }, def: { fr: `Un grand centre d'art moderne et de lecture publique au cœur de Paris. Ouvert en 1977, après sa mort, il porte son nom : le Centre Pompidou.` } },
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
          fr: `Sa campagne de 1969 tient dans une formule : « le changement dans la continuité ». Continuité, car il se présente en héritier de de Gaulle et en garant des institutions de la Ve République, face à un Alain Poher soupçonné de vouloir revenir à un régime plus parlementaire. Changement, car il assume trois inflexions : l'ouverture européenne (il annonce qu'il ne s'opposera plus à la candidature britannique à la CEE), l'ouverture politique vers les centristes — plusieurs figures du centre, comme Jacques Duhamel ou Joseph Fontanet, rejoindront sa majorité —, et la priorité donnée à la modernisation économique.\n\nSur le fond, son projet est avant tout industriel : faire de la France une grande puissance industrielle capable de rivaliser avec l'Allemagne, en soutenant des champions nationaux et de grands programmes d'équipement. Le volet social existe — son Premier ministre Jacques Chaban-Delmas y ajoutera l'ambitieux projet de « Nouvelle société » — mais, pour Pompidou lui-même, le progrès social découle d'abord de la croissance. Pas de rupture institutionnelle promise : il défend la lecture présidentielle du régime héritée de de Gaulle, tout en lançant plus tard, en 1973, un projet de quinquennat qui n'aboutira pas.`,
        },
        sources: [
          { label: `Conseil constitutionnel — élection présidentielle de juin 1969`, url: 'https://www.conseil-constitutionnel.fr', year: 1969 },
          { label: `Éric Roussel, Georges Pompidou, JC Lattès (rééd. 2004) — chapitres sur la campagne de 1969`, year: 2004 },
        ],
      },
      {
        id: 'mesures',
        titre: { fr: `Les principales mesures, une par une` },
        corps: {
          fr: `Création du SMIC (loi du 2 janvier 1970) : le salaire minimum interprofessionnel de croissance remplace le SMIG et est indexé en partie sur la croissance, pour que les plus bas salaires suivent l'enrichissement du pays. Toujours en vigueur.\n\nMensualisation des salaires (accord interprofessionnel de 1970) : négociée sous l'impulsion du gouvernement Chaban-Delmas, elle fait progressivement passer les ouvriers du paiement à l'heure au salaire mensuel, avec les garanties associées.\n\nLevée du veto britannique (sommet de La Haye, décembre 1969) : le Royaume-Uni, le Danemark et l'Irlande entrent dans la CEE le 1er janvier 1973, après un référendum français d'approbation le 23 avril 1972.\n\nL'« impératif industriel » : soutien à l'aérospatiale (Airbus — premier vol de l'A300 en octobre 1972 —, Concorde, dont le premier vol a lieu en mars 1969), complexe sidérurgique de Fos-sur-Mer, programme autoroutier accéléré, études préparant le futur TGV. En mars 1974, sous le gouvernement Messmer, le plan Messmer engage massivement la France dans le nucléaire civil, en réponse au choc pétrolier.\n\nCréation du ministère de l'Environnement (janvier 1971) : le premier du genre en France, confié à Robert Poujade.\n\nLoi du 3 janvier 1973 sur la Banque de France : modernisation des statuts de la banque centrale, devenue l'objet d'un récit contesté sur la dette (voir Vrai/Faux).\n\nEt un projet resté inabouti : le quinquennat, voté par les deux chambres en 1973 mais jamais soumis au Congrès, faute de majorité suffisante.`,
        },
        sources: [
          { label: `Légifrance — loi du 2 janvier 1970 (SMIC), loi du 3 janvier 1973 sur la Banque de France`, url: 'https://www.legifrance.gouv.fr', year: 1973 },
          { label: `Vie-publique.fr — chronologies de la présidence Pompidou (1969-1974)`, url: 'https://www.vie-publique.fr', year: 2025 },
        ],
      },
      {
        id: 'evenements',
        titre: { fr: `Les grands événements du mandat` },
        corps: {
          fr: `1969 : élection en juin, sommet de La Haye en décembre — la relance européenne est le premier acte fort du mandat. 9 novembre 1970 : mort de de Gaulle ; Pompidou annonce aux Français que « la France est veuve » — l'une des rares phrases de lui que tout le monde retient. 1971 : la grâce partielle accordée à Paul Touvier, ancien milicien, provoque une vive polémique lorsqu'elle est révélée en 1972. 23 avril 1972 : référendum sur l'élargissement de la CEE — environ 68 % de oui, mais environ 40 % d'abstention, résultat politiquement décevant qui affaiblit l'exécutif. Juillet 1972 : Chaban-Delmas, dont le projet de « Nouvelle société » indisposait l'Élysée, est remplacé par Pierre Messmer. Mars 1973 : les législatives voient la majorité résister à la gauche, unie depuis le programme commun de 1972. 1973 : lancement du projet de quinquennat, jamais mené à terme. Octobre 1973 : la guerre du Kippour déclenche le premier choc pétrolier — le prix du pétrole quadruple en quelques mois, ébranlant le modèle de croissance sur lequel reposait toute la politique du mandat. Hiver 1973-1974 : l'état de santé du président, officiellement nié, devient visible de tous. 2 avril 1974 : Georges Pompidou meurt en fonction, à 62 ans.`,
        },
        sources: [
          { label: `Vie-publique.fr et INA — chronologie et archives de la présidence Pompidou`, url: 'https://www.vie-publique.fr', year: 2025 },
          { label: `Conseil constitutionnel — référendum du 23 avril 1972, législatives de mars 1973`, url: 'https://www.conseil-constitutionnel.fr', year: 1973 },
        ],
      },
      {
        id: 'gouverner',
        titre: { fr: `Sa manière de gouverner` },
        corps: {
          fr: `Un parcours atypique pour un président : normalien, agrégé de lettres, professeur, puis banquier chez Rothschild, il n'a jamais été élu à rien avant d'être nommé Premier ministre en 1962 — où il reste six ans, record de longévité à Matignon sous la Ve République, survivant même à la seule motion de censure jamais adoptée (octobre 1962). En mai 1968, c'est lui qui négocie les accords de Grenelle ; en juillet, de Gaulle le remercie, ce qui laissera des traces entre les deux hommes.\n\nDevenu président, il pratique une lecture très présidentielle des institutions : l'Élysée pilote, Matignon exécute. L'expérience Chaban-Delmas le montre — le projet de « Nouvelle société » (dialogue social, contractualisation, libéralisation de l'information) est freiné par l'Élysée et ses conseillers, notamment Pierre Juillet et Marie-France Garaud, avant que Chaban ne soit remplacé par le plus docile Pierre Messmer en 1972.\n\nL'homme est à double face : provincial du Cantal attaché à la France des terroirs, et amateur passionné d'art contemporain qui fait entrer des œuvres modernes à l'Élysée, publie une anthologie de la poésie française et décide Beaubourg. Face secrète aussi : atteint de la maladie de Waldenström, il gouverne malade en le dissimulant — une question de transparence que la Ve République retrouvera après lui.`,
        },
        sources: [
          { label: `Éric Roussel, Georges Pompidou, JC Lattès (rééd. 2004)`, year: 2004 },
          { label: `Assemblée nationale — motion de censure adoptée le 5 octobre 1962 contre le gouvernement Pompidou`, url: 'https://www.assemblee-nationale.fr', year: 1962 },
        ],
      },
      {
        id: 'bilan',
        titre: { fr: `Le bilan économique et social — en distinguant ce qui lui revient` },
        corps: {
          fr: `Évolutions constatées : les années 1969-1973 comptent parmi les plus fortes croissances de l'histoire économique française — environ 5 à 6 % par an selon les séries de l'INSEE —, avec un chômage encore très faible (autour de 2 à 3 % de la population active au début des années 1970, selon les définitions de l'époque). L'industrie française monte en gamme, l'équipement du pays (autoroutes, téléphone, logement) s'accélère. En contrepartie, l'inflation s'installe — environ 6 % par an au début des années 1970, avant de s'emballer avec le choc pétrolier de 1973.\n\nCe qui relève de ses choix : la stratégie des champions nationaux et des grands programmes (Airbus, nucléaire préparé puis décidé en 1974, Fos-sur-Mer), qui structureront l'économie française pendant des décennies ; le pari du tout-automobile et de l'adaptation des villes à la voiture, très critiqué depuis ; les avancées sociales négociées (SMIC, mensualisation), prolongement des accords de Grenelle.\n\nCe qui relève du contexte : il gouverne pendant les dernières années des Trente Glorieuses, une période de croissance mondiale exceptionnelle qu'aucun gouvernement français n'a « créée ». Le choc pétrolier d'octobre 1973 survient en toute fin de mandat : la crise qui suit sera pour ses successeurs. Les historiens de l'économie débattent surtout d'une question : le modèle pompidolien — productiviste, énergivore, centré sur l'industrie lourde — préparait-il bien la France aux années 1970-1980, ou en a-t-il retardé les adaptations ?`,
        },
        sources: [
          { label: `INSEE — séries longues de croissance, d'inflation et d'emploi, années 1969-1974`, url: 'https://www.insee.fr', year: 1974, perimetre: `définitions d'époque, notamment pour le chômage — comparer avec prudence aux séries actuelles` },
        ],
      },
      {
        id: 'defenseurs',
        titre: { fr: `Ce que ses défenseurs retiennent` },
        corps: {
          fr: `Le président de la prospérité : sous son mandat, la France connaît le plein emploi, des salaires en hausse et l'une des croissances les plus fortes de son histoire — et il en profite pour équiper durablement le pays. Le modernisateur industriel : Airbus, la préparation du nucléaire civil, les autoroutes, les études du TGV — une grande partie de l'appareil productif et des infrastructures dont la France vit encore vient de ces années-là. L'Européen pragmatique : en levant le veto britannique, il a débloqué la construction européenne sans renier l'attachement gaulliste à l'indépendance nationale. Le garant des institutions : après le départ puis la mort de de Gaulle, et après la secousse de 1968, il a prouvé que la Ve République tenait debout sans son fondateur — ce qui n'allait pas de soi. Ses défenseurs ajoutent l'honnête homme cultivé : le professeur de lettres devenu président, l'anthologie de poésie, Beaubourg — une certaine idée de l'État qui n'oppose pas industrie et culture. Enfin, le social par la négociation : Grenelle hier, SMIC et mensualisation ensuite, plutôt que l'affrontement.`,
        },
      },
      {
        id: 'opposants',
        titre: { fr: `Ce que ses opposants retiennent` },
        corps: {
          fr: `À gauche : un pouvoir conservateur et autoritaire dans l'après-68 — la loi dite « anti-casseurs » de 1970, durcissement pénal contre les manifestations, abrogée en 1981 ; une télévision publique sous contrôle étroit du pouvoir ; le blocage des réformes de la « Nouvelle société » de Chaban-Delmas, jugées trop audacieuses par l'Élysée. La grâce partielle accordée en 1971 à l'ancien milicien Paul Touvier reste une tache morale largement dénoncée.\n\nChez les gaullistes orthodoxes : l'entrée du Royaume-Uni dans la CEE est vécue comme une entorse à l'héritage du Général, et certains ne lui pardonnent pas d'avoir préparé sa candidature du vivant de de Gaulle, dès 1969 à Rome.\n\nCritique écologique et urbaine, largement rétrospective : le tout-voiture assumé — voies express sur les berges de la Seine, adaptation revendiquée de la ville à l'automobile —, le productivisme, le béton, Fos-sur-Mer. Une grande partie des politiques urbaines menées depuis les années 2000 consiste précisément à défaire cet héritage.\n\nEnfin, la dissimulation de sa maladie : gouverner en cachant aux Français un état de santé déclinant pose une question démocratique que ses successeurs, à commencer par Mitterrand, n'ont pas mieux résolue.`,
        },
      },
      {
        id: 'heritage',
        titre: { fr: `Son héritage aujourd'hui` },
        corps: {
          fr: `Matériel d'abord : Airbus est devenu le premier avionneur mondial, le parc nucléaire décidé dans la foulée du plan Messmer fournit encore l'essentiel de l'électricité française, le réseau autoroutier et les grandes zones industrielles portent sa marque. Le Centre Pompidou, ouvert en 1977, a fait entrer son nom dans le quotidien de millions de visiteurs — ironie de l'histoire pour un président souvent réduit à l'industrie.\n\nPolitique ensuite : le « pompidolisme » désigne une droite de gouvernement pragmatique, économiquement moderne et socialement prudente ; Jacques Chirac, lancé en politique dans son sillage, s'en est longtemps réclamé. Institutionnellement, sa présidence a prouvé que la Ve République survivait à son fondateur, et son projet avorté de quinquennat annonçait la réforme adoptée en 2000.\n\nHéritage débattu enfin : le modèle productiviste et le tout-voiture sont devenus des contre-exemples dans le débat urbain et écologique ; et la loi de 1973 sur la Banque de France alimente, très au-delà des faits, un récit complotiste sur l'origine de la dette publique — signe qu'un mandat court, dense et longtemps consensuel est redevenu un enjeu d'interprétation. Reste une singularité : Pompidou demeure l'un des présidents les moins contestés dans la mémoire collective, peut-être parce que la crise a commencé juste après lui.`,
        },
      },
    ],
  },

  // ── Chronologie ──────────────────────────────────────────────────────────────
  chronologie: {
    titre: { fr: `1962-1974 : de Matignon à l'Élysée` },
    events: [
      { date: '1962-1968', titre: { fr: `Premier ministre de de Gaulle` }, detail: { fr: `Six ans à Matignon, record de longévité sous la Ve République. Son gouvernement est renversé par la seule motion de censure jamais adoptée (octobre 1962) ; de Gaulle dissout, gagne, et le reconduit.` }, source: { label: `Assemblée nationale — motion de censure du 5 octobre 1962`, year: 1962 } },
      { date: 'mai-juillet 1968', titre: { fr: `Grenelle, puis le renvoi` }, detail: { fr: `Il négocie les accords de Grenelle qui contribuent à dénouer la crise de mai 68. Après la victoire écrasante des législatives de juin, de Gaulle le remplace par Maurice Couve de Murville.` } },
      { date: '15 juin 1969', titre: { fr: `Élu président` }, detail: { fr: `Après la démission de de Gaulle (avril 1969), il bat Alain Poher au second tour avec environ 58,2 % des voix. La gauche, éliminée au premier tour, était absente ; le PCF avait appelé à l'abstention (« bonnet blanc et blanc bonnet »).` }, source: { label: `Conseil constitutionnel — résultats de juin 1969`, year: 1969 } },
      { date: '1er-2 déc. 1969', titre: { fr: `Sommet de La Haye` }, detail: { fr: `Pompidou lève le veto français à l'entrée du Royaume-Uni dans la CEE et relance la construction européenne. L'adhésion britannique devient effective le 1er janvier 1973.` } },
      { date: '1969-1972', titre: { fr: `Chaban-Delmas et la « Nouvelle société »` }, detail: { fr: `Le Premier ministre porte un projet de modernisation sociale (dialogue social, contractualisation, mensualisation, SMIC en 1970) — progressivement freiné par l'Élysée.` } },
      { date: '9 nov. 1970', titre: { fr: `Mort de de Gaulle` }, detail: { fr: `Pompidou annonce le décès du Général aux Français. Il est désormais seul dépositaire de l'héritage gaulliste au pouvoir.` } },
      { date: '23 avril 1972', titre: { fr: `Référendum sur l'élargissement` }, detail: { fr: `Environ 68 % de oui à l'entrée du Royaume-Uni, du Danemark et de l'Irlande dans la CEE, mais environ 40 % d'abstention : le succès arithmétique est une déception politique.` }, source: { label: `Conseil constitutionnel — référendum du 23 avril 1972`, year: 1972 } },
      { date: 'juillet 1972', titre: { fr: `Messmer remplace Chaban` }, detail: { fr: `Pierre Messmer, gaulliste de fidélité, succède à Chaban-Delmas. Le cap devient plus conservateur ; les législatives de mars 1973 sont gagnées face à la gauche unie.` } },
      { date: 'octobre 1973', titre: { fr: `Premier choc pétrolier` }, detail: { fr: `Après la guerre du Kippour, le prix du pétrole quadruple. La France du tout-pétrole vacille ; le plan Messmer (mars 1974) engagera massivement le pays dans le nucléaire civil.` } },
      { date: '2 avril 1974', titre: { fr: `Mort en fonction` }, detail: { fr: `Emporté par la maladie de Waldenström, dissimulée jusqu'au bout, il meurt à 62 ans sans achever son mandat. Valéry Giscard d'Estaing lui succède après l'intérim d'Alain Poher.` } },
    ],
  },

  vraiFaux: ['vf-pompidou-continuateur', 'vf-pompidou-beaubourg', 'vf-pompidou-loi-1973'],

  quiz: [
    {
      question: { fr: `Qui Georges Pompidou a-t-il battu au second tour de la présidentielle de 1969 ?` },
      options: [
        { fr: `François Mitterrand` },
        { fr: `Alain Poher, président centriste du Sénat` },
        { fr: `Jacques Duclos` },
        { fr: `Valéry Giscard d'Estaing` },
      ],
      bonneReponse: 1,
      explication: { fr: `Second tour inédit : deux candidats de droite et du centre, la gauche ayant été éliminée au premier tour. Le PCF de Jacques Duclos appelle à l'abstention (« bonnet blanc et blanc bonnet ») et Pompidou l'emporte avec environ 58,2 % des voix.` },
    },
    {
      question: { fr: `Quelle décision européenne majeure prend-il dès décembre 1969 ?` },
      options: [
        { fr: `La sortie de la France de la CEE` },
        { fr: `La création de l'euro` },
        { fr: `La levée du veto français à l'entrée du Royaume-Uni dans la CEE` },
        { fr: `L'élection du Parlement européen au suffrage universel` },
      ],
      bonneReponse: 2,
      explication: { fr: `Au sommet de La Haye, Pompidou renonce au veto que de Gaulle opposait à la candidature britannique. Le Royaume-Uni, le Danemark et l'Irlande entrent dans la CEE le 1er janvier 1973, après un référendum français d'approbation en avril 1972.` },
    },
    {
      question: { fr: `Qu'a fait exactement Pompidou pour le Centre Pompidou ?` },
      options: [
        { fr: `Il l'a inauguré en personne en 1977` },
        { fr: `Il a décidé sa création en 1969 ; le centre a ouvert après sa mort et a été nommé en son honneur` },
        { fr: `Il n'a aucun lien avec le projet, seulement avec le nom` },
        { fr: `Il l'a fait construire pour y installer sa collection personnelle` },
      ],
      bonneReponse: 1,
      explication: { fr: `Grand amateur d'art contemporain, Pompidou décide en 1969 la création d'un centre d'art moderne et de lecture publique sur le plateau Beaubourg. Ouvert en 1977, trois ans après sa mort, le bâtiment est nommé en son honneur.` },
    },
    {
      question: { fr: `Quel projet institutionnel lancé en 1973 n'a pas abouti sous sa présidence ?` },
      options: [
        { fr: `Le quinquennat, voté par les deux chambres mais jamais soumis au Congrès` },
        { fr: `L'élection du président au suffrage universel direct` },
        { fr: `La suppression du Sénat` },
        { fr: `Le référendum d'initiative citoyenne` },
      ],
      bonneReponse: 0,
      explication: { fr: `Pompidou propose en 1973 de réduire le mandat présidentiel de sept à cinq ans. Le texte est voté par l'Assemblée et le Sénat, mais jamais soumis au Congrès, faute de majorité des trois cinquièmes assurée. Le quinquennat n'arrivera qu'en 2000.` },
    },
    {
      question: { fr: `Quel poste Pompidou occupait-il avant d'être président ?` },
      options: [
        { fr: `Ministre de l'Économie` },
        { fr: `Président de l'Assemblée nationale` },
        { fr: `Premier ministre de de Gaulle pendant six ans (1962-1968), record de longévité à Matignon sous la Ve` },
        { fr: `Maire de Paris` },
      ],
      bonneReponse: 2,
      explication: { fr: `Jamais élu auparavant, ce normalien passé par la banque Rothschild dirige le gouvernement de 1962 à 1968 — il négocie notamment les accords de Grenelle en mai 1968, avant d'être remplacé en juillet 1968.` },
    },
  ],

  // ── 15. Pour aller plus loin (N4) ────────────────────────────────────────────
  level4: {
    items: [
      { kind: 'discours', titre: { fr: `Allocution du 9 novembre 1970 annonçant la mort du général de Gaulle (INA)` }, note: { fr: `Deux minutes sobres, dont la phrase restée célèbre : « la France est veuve ».` }, url: 'https://www.ina.fr' },
      { kind: 'discours', titre: { fr: `Conférences de presse présidentielles 1969-1973 (INA / vie-publique.fr)` }, note: { fr: `L'exercice où il détaille l'« impératif industriel », l'Europe et sa conception des institutions.` }, url: 'https://www.vie-publique.fr' },
      { kind: 'texte', titre: { fr: `Georges Pompidou, Le Nœud gordien — Plon, 1974` }, note: { fr: `Essai rédigé avant sa mort et publié en 1974 : ses réflexions sur la société industrielle, l'ordre et le pouvoir.` } },
      { kind: 'texte', titre: { fr: `Georges Pompidou, Anthologie de la poésie française — Hachette/Le Livre de poche, 1961` }, note: { fr: `Le président par la face lettrée : son choix personnel de poèmes, toujours réédité.` } },
      { kind: 'donnees', titre: { fr: `INSEE — séries longues croissance, inflation et emploi 1969-1974` }, note: { fr: `Pour vérifier soi-même le bilan des dernières années des Trente Glorieuses.` }, url: 'https://www.insee.fr' },
      { kind: 'biblio', titre: { fr: `Éric Roussel, Georges Pompidou — JC Lattès (rééd. 2004)` }, note: { fr: `La biographie de référence, nourrie d'archives et d'entretiens.` } },
      { kind: 'lien', titre: { fr: `Institut Georges Pompidou — archives, discours et travaux d'historiens` }, note: { fr: `Source mémorielle par nature, utile pour les textes originaux et les colloques.` }, url: 'https://www.georges-pompidou.org' },
    ],
  },

  figuresLiees: [
    { nom: 'Charles de Gaulle', note: { fr: `son mentor, qu'il servit six ans à Matignon avant la brouille de 1968-1969 — voir la fiche` } },
    { nom: 'Jacques Chaban-Delmas', note: { fr: `Premier ministre 1969-1972, la « Nouvelle société » freinée par l'Élysée — fiche à venir` } },
    { nom: 'Pierre Messmer', note: { fr: `Premier ministre 1972-1974, le plan nucléaire de mars 1974 — fiche à venir` } },
    { nom: 'Alain Poher', note: { fr: `l'adversaire centriste de 1969, deux fois président par intérim — fiche à venir` } },
    { nom: `Valéry Giscard d'Estaing`, note: { fr: `son ministre des Finances, élu pour lui succéder en 1974 — fiche à venir` } },
  ],

  motsAssocies: ['motion-de-censure', 'dette-publique', 'economie-de-marche'],
  continuerAvec: [
    { slug: 'charles-de-gaulle' },
    { slug: 'president-de-la-republique' },
    { slug: 'droite' },
  ],

  sources: [
    { label: `Conseil constitutionnel — résultats officiels : présidentielle de juin 1969, référendum du 23 avril 1972, législatives de mars 1973`, url: 'https://www.conseil-constitutionnel.fr', year: 1973 },
    { label: `Légifrance — loi du 2 janvier 1970 (SMIC), loi du 3 janvier 1973 sur la Banque de France`, url: 'https://www.legifrance.gouv.fr', year: 1973 },
    { label: `Vie-publique.fr — dossiers et chronologies de la présidence Pompidou`, url: 'https://www.vie-publique.fr', year: 2025 },
    { label: `INSEE — séries longues croissance, inflation, emploi 1969-1974`, url: 'https://www.insee.fr', year: 1974, perimetre: `définitions d'époque, notamment pour le chômage — comparer avec prudence aux séries actuelles` },
    { label: `Éric Roussel, Georges Pompidou, JC Lattès (rééd. 2004)`, year: 2004 },
  ],
};
