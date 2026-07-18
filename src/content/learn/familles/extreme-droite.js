/**
 * Dossier « L'extrême droite » — modèle ideologie (docs/jyconnaisrien/02, §3).
 * Fiche sensible : uniquement des faits sourcés et datés, critères de science
 * politique explicités, classements présentés AVEC leur contestation.
 * 4 niveaux de lecture : N1 (20 s) → N2 (3 min) → N3 (tout comprendre) → N4.
 */

export default {
  slug: 'extreme-droite',
  type: 'ideologie',
  porte: 'B',
  title: { fr: `L'extrême droite`, en: 'The Far Right' },
  icon: '📓',
  difficulty: 3,
  famille: 'dossier',
  updatedAt: '2026-07-12',
  freshness: { type: 'live', reviewEveryMonths: 3, lastReviewedAt: '2026-07-12' },

  // ── N1 — En 20 secondes ─────────────────────────────────────────────────────
  level1: {
    fr: `« Extrême droite » n'est pas une insulte mais une catégorie de science politique, définie par des critères : une nation définie par l'origine plutôt que par la citoyenneté, la désignation d'un groupe — souvent les immigrés — comme menace principale, un rapport critique aux contre-pouvoirs. La grande majorité des chercheurs classe le Rassemblement national et Reconquête dans cette catégorie : un travail scientifique documenté — que ces partis récusent. Cette fiche donne les critères, l'histoire et les débats.`,
  },

  // ── N2 — En 3 minutes ───────────────────────────────────────────────────────
  level2: {
    sections: [
      {
        titre: { fr: `Qu'est-ce qui définit l'extrême droite ? Les critères` },
        corps: {
          fr: `Les politistes n'utilisent pas ce terme comme un jugement moral mais comme une catégorie d'analyse, fondée sur des critères. Les plus courants : le nativisme (l'idée que la nation se définit par l'origine ou la culture héritée, et que les éléments « non natifs » la menacent), l'autoritarisme (une société strictement ordonnée, où les atteintes à l'ordre sont sévèrement punies) et le populisme (la société vue comme l'opposition entre un « vrai peuple » et des « élites corrompues »). S'y ajoutent, dans l'analyse française : la désignation d'un groupe comme menace principale, le rapport aux contre-pouvoirs (juges, presse, associations) et l'histoire du mouvement. C'est la combinaison de ces critères qui fonde le classement — pas la simple fermeté des positions.`,
        },
      },
      {
        titre: { fr: `D'où vient-elle en France ?` },
        corps: {
          fr: `L'historiographie fait remonter cette famille politique à la fin du XIXe siècle : le boulangisme (1886-1889), l'antidreyfusisme, puis les ligues nationalistes de l'entre-deux-guerres, dont la manifestation du 6 février 1934 reste l'épisode le plus connu. Après 1945, elle est marginalisée par le souvenir de l'Occupation, et se reconstruit par étapes : le poujadisme (1956), les nostalgiques de l'Algérie française, puis la fondation du Front national en octobre 1972 par le mouvement Ordre nouveau, avec Jean-Marie Le Pen pour président. Le FN reste marginal jusqu'à la percée des années 1983-1984, avant de s'installer durablement dans le paysage politique.`,
        },
      },
      {
        titre: { fr: `Extrême droite ou « droite radicale » ? Le débat des chercheurs` },
        corps: {
          fr: `Le politiste Cas Mudde, référence internationale du domaine, distingue deux catégories : la « droite radicale », qui accepte le jeu électoral et l'alternance mais conteste des éléments de la démocratie libérale (droits des minorités, contre-pouvoirs), et l'« extrême droite » au sens strict, qui rejette la démocratie elle-même. Dans cette grille, le RN relève de la droite radicale. La plupart des chercheurs français utilisent toutefois « extrême droite » au sens large, pour désigner l'ensemble de la famille — RN et Reconquête compris. Ce n'est pas une contradiction, mais une différence de vocabulaire entre deux traditions de recherche ; les critères d'analyse, eux, sont largement partagés.`,
        },
      },
      {
        titre: { fr: `Pourquoi le classement fait débat` },
        corps: {
          fr: `Le RN se présente comme « ni de droite ni de gauche », conteste l'étiquette « extrême droite » et demande régulièrement aux médias de ne plus l'employer. Ses arguments : le parti participe aux élections, siège dans les institutions, a exclu ses membres tenant des propos négationnistes ou racistes, et son programme économique emprunte à la gauche. Les chercheurs répondent que le classement ne repose pas sur le respect des formes électorales mais sur le contenu du projet — notamment la « priorité nationale », qui réserve des droits selon la nationalité — et sur la continuité historique du mouvement. Poliscop présente les deux faits : un classement scientifique très majoritaire et documenté, et sa contestation constante par les partis concernés.`,
        },
      },
      {
        titre: { fr: `Quelques repères électoraux` },
        corps: {
          fr: `1974 : Jean-Marie Le Pen obtient 0,75 % à la présidentielle. 1984 : première percée nationale aux européennes (environ 11 %). 21 avril 2002 : il atteint le second tour de la présidentielle (16,86 %), battu avec 17,79 % des voix. 2017 : Marine Le Pen est battue au second tour avec 33,90 % ; 2022 : battue avec 41,45 %. Législatives 2022 : 89 députés RN. Européennes 2024 : la liste de Jordan Bardella arrive largement en tête (environ 31,4 %). Législatives 2024 : le RN et ses alliés sont le premier parti en voix (environ 10 millions au premier tour) et le premier groupe unique de l'Assemblée, sans majorité. La progression sur quarante ans est l'une des plus fortes d'Europe occidentale.`,
        },
      },
      {
        titre: { fr: `Ce que disent ses électeurs et défenseurs` },
        corps: {
          fr: `Les enquêtes électorales (Cevipof, Ifop) documentent des motivations multiples : la volonté de réduire l'immigration, mais aussi l'insécurité, le pouvoir d'achat, le sentiment d'abandon des territoires périphériques et une profonde défiance envers les partis de gouvernement. Beaucoup d'électeurs décrivent leur vote comme un vote de rupture : « les autres ont tous échoué, essayons autre chose ». Les défenseurs du RN ajoutent que le parti a exclu ses éléments les plus radicaux, respecte le jeu électoral, et que le qualifier d'« extrême droite » reviendrait à disqualifier moralement des millions d'électeurs plutôt qu'à discuter ses propositions.`,
        },
      },
      {
        titre: { fr: `Ce que disent ses opposants` },
        corps: {
          fr: `Ses opposants — qui vont de la gauche à une partie de la droite — soutiennent que le projet reste fondé sur une inégalité de droits selon l'origine ou la nationalité (la « priorité nationale »), contraire selon eux aux principes constitutionnels d'égalité ; que la normalisation du discours n'a pas effacé la continuité historique du mouvement ; et que les exemples étrangers de partis comparables au pouvoir montrent des pressions sur les juges, la presse et les universités. Ils rappellent aussi les condamnations judiciaires de dirigeants du parti. Les défenseurs contestent chacun de ces points — cette fiche présente les arguments des deux côtés, les sections N3 les détaillent.`,
        },
      },
      {
        titre: { fr: `Extrême droite ≠ droite conservatrice` },
        brique: 'confusion',
        corps: {
          fr: `Être très conservateur sur les mœurs, très ferme sur l'immigration ou très critique de l'Union européenne ne suffit pas à classer un responsable à l'extrême droite. Le critère décisif n'est pas l'intensité des positions mais leur nature : une nation définie par la citoyenneté (droite conservatrice) ou par l'origine et l'identité (extrême droite) ; l'acceptation pleine des contre-pouvoirs et de l'égalité des droits, ou leur remise en cause. Confondre les deux — dans un sens comme dans l'autre — est l'une des erreurs les plus fréquentes du débat public.`,
        },
      },
    ],
  },

  // ── N3 — Tout comprendre (sections repliables) ──────────────────────────────
  level3: {
    sections: [
      {
        id: 'criteres-de-classement',
        sources: [
          { label: `Cas Mudde, The Far Right Today, Polity, 2019`, year: 2019 },
          { label: `Jean-Yves Camus & Nicolas Lebourg, Les Droites extrêmes en Europe, Seuil, 2015`, year: 2015 },
        ],
        titre: { fr: `Les critères de classement — comment travaillent les chercheurs` },
        corps: {
          fr: `Le classement d'un parti à l'extrême droite n'est pas décrété : il résulte de travaux comparant les programmes, les discours, l'histoire et les cadres des mouvements. Les critères les plus utilisés viennent de la littérature comparatiste, notamment de Cas Mudde : le nativisme (la nation doit être habitée et gouvernée par le groupe « natif » ; les éléments jugés étrangers — personnes ou idées — sont perçus comme une menace), l'autoritarisme (croyance en une société strictement ordonnée) et le populisme (le « vrai peuple » contre les « élites corrompues »). Mudde distingue la « droite radicale », qui accepte les élections mais conteste des piliers de la démocratie libérale, de l'« extrême droite » au sens strict, antidémocratique.\n\nEn France, la plupart des politistes emploient « extrême droite » au sens large pour toute cette famille, en y intégrant des critères supplémentaires : la place de la « priorité nationale » dans le programme, le rapport aux contre-pouvoirs et l'histoire du mouvement. Sur ces bases, le classement du RN et de Reconquête à l'extrême droite est très majoritaire dans la recherche — et contesté par les deux partis. Retenir la méthode importe plus que retenir l'étiquette : elle permet de juger sur pièces.`,
        },
      },
      {
        id: 'histoire-avant-1945',
        sources: [{ label: `Jean-Yves Camus & Nicolas Lebourg, Les Droites extrêmes en Europe, Seuil, 2015 (généalogie française)`, year: 2015 }],
        titre: { fr: `Avant 1945 : boulangisme, ligues, Vichy` },
        corps: {
          fr: `La généalogie commence à la fin du XIXe siècle. Le boulangisme (1886-1889) invente un modèle durable : un chef populaire dressé contre le régime parlementaire, mêlant électeurs de droite et déçus de la gauche. L'affaire Dreyfus cristallise ensuite un nationalisme antisémite (Ligue de la patrie française, Action française de Charles Maurras). Dans l'entre-deux-guerres, les ligues (Jeunesses patriotes, Croix-de-Feu, Solidarité française) organisent des dizaines de milliers de militants ; le 6 février 1934, leur manifestation devant l'Assemblée nationale dégénère (une quinzaine de morts) et fait tomber le gouvernement — l'épisode reste débattu : tentative de coup de force pour les uns, émeute sans plan pour les autres.\n\nVichy (1940-1944) occupe une place à part : c'est un régime né de la défaite militaire, pas un parti arrivé au pouvoir par les urnes. Il a mené la « Révolution nationale », collaboré avec l'Allemagne nazie et participé à la déportation des Juifs de France — responsabilité reconnue par le président Chirac en 1995. Les historiens y voient la convergence de plusieurs droites (traditionaliste, technocratique, fasciste), pas le prolongement d'un seul courant. Cette période explique la marginalisation durable de l'extrême droite après la Libération.`,
        },
      },
      {
        id: 'apres-1945',
        titre: { fr: `Après 1945 : poujadisme, OAS, Ordre nouveau` },
        corps: {
          fr: `Après l'épuration, la famille survit dans des groupuscules et des revues. Trois moments la font réémerger. Le poujadisme d'abord : l'Union de défense des commerçants et artisans de Pierre Poujade, mouvement antifiscal et antiparlementaire, obtient 52 députés aux législatives de 1956 — dont Jean-Marie Le Pen, alors le plus jeune élu de l'Assemblée. Le mouvement s'effondre dès 1958.\n\nLa guerre d'Algérie ensuite : l'OAS (Organisation armée secrète, 1961-1962), organisation clandestine opposée à l'indépendance de l'Algérie, mène une campagne d'attentats en Algérie et en métropole. Sa défaite laisse une génération de militants nationalistes en rupture avec le gaullisme, dont certains rejoindront plus tard le FN.\n\nOrdre nouveau enfin : ce mouvement nationaliste fondé en 1969, régulièrement impliqué dans des violences politiques, cherche au début des années 1970 une vitrine électorale respectable. C'est lui qui crée le Front national en 1972, avant d'être dissous par le gouvernement en 1973 après des affrontements violents.`,
        },
      },
      {
        id: 'fn-fondation',
        sources: [{ label: `Valérie Igounet, Le Front national de 1972 à nos jours, Seuil, 2014`, year: 2014 }],
        titre: { fr: `1972 : la fondation du Front national` },
        corps: {
          fr: `Le Front national est fondé en octobre 1972 à l'initiative d'Ordre nouveau, pour présenter une candidature unifiée des droites nationalistes aux législatives de 1973. Jean-Marie Le Pen, ancien député poujadiste puis directeur de campagne du candidat d'extrême droite Jean-Louis Tixier-Vignancour en 1965, en prend la présidence — choisi précisément parce qu'il paraît plus présentable que les fondateurs d'Ordre nouveau.\n\nLe parti fédère des courants hétérogènes : anciens de l'OAS et de l'Algérie française, nationalistes révolutionnaires, catholiques traditionalistes, anciens collaborateurs et, plus tard, transfuges d'autres droites. Cette diversité interne — documentée par l'historienne Valérie Igounet — explique les crises répétées du mouvement. Les débuts électoraux sont très faibles : 0,75 % pour Le Pen à la présidentielle de 1974, et pas assez de parrainages pour se présenter en 1981.`,
        },
      },
      {
        id: 'percee-1980s',
        sources: [{ label: `Vie-publique.fr — repères électoraux ; résultats officiels des européennes de juin 1984`, url: 'https://www.vie-publique.fr', year: 1984 }],
        titre: { fr: `1983-1984 : la percée` },
        corps: {
          fr: `La percée a lieu en deux temps. Septembre 1983, Dreux (Eure-et-Loir) : lors d'une élection municipale partielle, la liste FN de Jean-Pierre Stirbois obtient un score inédit au premier tour, puis fusionne avec la liste RPR-UDF, qui l'emporte — des élus FN entrent à la mairie avec l'accord de la droite locale. L'événement, très commenté, pose pour la première fois la question de la « digue » entre droite et extrême droite.\n\nJuin 1984 : aux élections européennes, la liste menée par Jean-Marie Le Pen obtient environ 11 % des voix et 10 sièges — première percée nationale. En 1986, les législatives organisées à la proportionnelle donnent 35 députés au FN ; le retour au scrutin majoritaire en 1988 les fait presque tous disparaître, ce qui nourrit depuis la revendication de la proportionnelle par le parti. Les chercheurs expliquent cette percée par la conjonction du chômage de masse, des recompositions de la droite après 1981 et de la mise à l'agenda du thème de l'immigration.`,
        },
      },
      {
        id: 'jean-marie-le-pen',
        titre: { fr: `Jean-Marie Le Pen : provocations et condamnations` },
        corps: {
          fr: `Jean-Marie Le Pen (1928-2025) a dirigé le FN de 1972 à 2011. Sa carrière est jalonnée de déclarations qui ont durablement marqué l'image du parti — et donné lieu à des condamnations judiciaires. La plus connue : le 13 septembre 1987, il qualifie les chambres à gaz de « point de détail de l'histoire de la Seconde Guerre mondiale ». Il réitérera ces propos à plusieurs reprises (notamment en 1997 et en 2015) et sera condamné plusieurs fois par la justice française, en particulier pour contestation de crimes contre l'humanité — un délit depuis la loi Gayssot de 1990 — ainsi que pour provocation à la haine ; des condamnations civiles ont également sanctionné le « point de détail » dès 1991, et un jeu de mots antisémite visant un ministre en 1988 a été largement condamné publiquement.\n\nCes prises de position sont un fait central du débat sur le classement du parti : pour les chercheurs, elles documentent le fond idéologique du FN historique ; pour la direction actuelle du RN, elles appartiennent à un passé dont le parti s'est séparé — Jean-Marie Le Pen a précisément été exclu du parti en août 2015 après avoir répété ces propos. Il est mort le 7 janvier 2025.`,
        },
      },
      {
        id: '21-avril-2002',
        sources: [{ label: `Conseil constitutionnel — proclamation des résultats de l'élection présidentielle 2002`, url: 'https://www.conseil-constitutionnel.fr', year: 2002 }],
        titre: { fr: `Le 21 avril 2002` },
        corps: {
          fr: `Au premier tour de la présidentielle du 21 avril 2002, Jean-Marie Le Pen obtient 16,86 % des voix et devance le Premier ministre socialiste Lionel Jospin (16,18 %) : pour la première fois sous la Ve République, un candidat d'extrême droite accède au second tour d'une présidentielle. Le choc politique est immense — manifestations massives entre les deux tours, notamment le 1er mai, et appel de presque toutes les forces politiques à voter Jacques Chirac, réélu le 5 mai avec 82,21 % contre 17,79 %.\n\nL'événement a des effets durables : il installe le « front républicain » comme réflexe électoral (et comme objet de débat), accélère l'unification de la droite de gouvernement dans l'UMP, et démontre qu'une qualification au second tour est possible — ce qui deviendra la norme : l'extrême droite sera présente au second tour de trois des quatre présidentielles suivantes (2017, 2022, et la configuration reste ouverte pour 2027).`,
        },
      },
      {
        id: 'dediabolisation',
        sources: [{ label: `Valérie Igounet, Le Front national de 1972 à nos jours, Seuil, 2014 (stratégie de dédiabolisation)`, year: 2014 }],
        titre: { fr: `2011-2018 : la « dédiabolisation »` },
        corps: {
          fr: `En janvier 2011, au congrès de Tours, Marine Le Pen succède à son père à la présidence du FN. Elle engage la stratégie dite de « dédiabolisation » : abandon des provocations sur la Seconde Guerre mondiale, exclusion de cadres tenant des propos racistes ou négationnistes, recentrage du discours sur la laïcité, le pouvoir d'achat et les « oubliés », et professionnalisation de l'appareil. Les étapes marquantes : l'exclusion de Jean-Marie Le Pen lui-même en août 2015, puis le changement de nom — le FN devient le Rassemblement national en juin 2018.\n\nLes effets électoraux sont documentés : élargissement de l'électorat, notamment féminin et jeune, et banalisation de la présence médiatique du parti. Ce que la stratégie a réellement changé sur le fond fait en revanche débat parmi les chercheurs : c'est l'objet de la section « Normalisation ou continuité ? » plus bas. Les deux faits à retenir : la transformation du style et du vocabulaire est réelle ; le cœur programmatique — la priorité nationale, la réduction drastique de l'immigration — est resté.`,
        },
      },
      {
        id: 'zemmour-reconquete',
        titre: { fr: `2021-2022 : Zemmour et Reconquête` },
        corps: {
          fr: `À l'automne 2021, le polémiste Éric Zemmour, connu pour ses livres et ses chroniques télévisées, se déclare candidat à la présidentielle et fonde le parti Reconquête en décembre 2021. Son positionnement assume une ligne plus identitaire que celle du RN : il reprend notamment l'expression « grand remplacement », théorie que les chercheurs qualifient de complotiste et démentent sur le plan démographique. Zemmour a été condamné à plusieurs reprises pour provocation à la haine ou à la discrimination (condamnation définitive en 2019 pour des propos de 2016 sur l'islam, condamnation en 2022 pour des propos sur les mineurs étrangers isolés) et relaxé dans d'autres procédures.\n\nÀ la présidentielle d'avril 2022, il obtient 7,07 % au premier tour ; Reconquête attire alors plusieurs cadres du RN et de LR (dont Marion Maréchal, qui le quittera en 2024). Le parti n'obtient aucun député en 2022 ni en 2024. Paradoxe analysé par les politistes : la candidature Zemmour, plus radicale dans son discours, a contribué à faire apparaître Marine Le Pen comme plus modérée — accélérant la normalisation de l'image du RN.`,
        },
      },
      {
        id: 'programme-economique',
        titre: { fr: `Le programme économique : des variations historiques fortes` },
        corps: {
          fr: `Contrairement à une idée répandue, l'extrême droite française n'a jamais eu une doctrine économique stable. Le poujadisme des années 1950 était un mouvement antifiscal de petits commerçants. Le FN des années 1980 défendait un programme très libéral, inspiré du reaganisme : baisses d'impôts massives, privatisations, réduction de l'État. À partir des années 2000-2010, le parti opère un tournant social-populiste : défense des services publics, retraite avant 64 ans, baisse de la TVA sur l'énergie, critique de la mondialisation et de l'euro (l'abandon de la sortie de l'euro après 2017 étant lui-même un marqueur de normalisation).\n\nCe qui reste constant, en revanche, c'est l'articulation de l'économique et du national : la « priorité nationale » (réserver des emplois, aides et logements aux nationaux) figure au programme depuis les années 1980 sous des formulations variables. Reconquête assume de son côté une ligne économique plus libérale. Les économistes de tous bords ont contesté le chiffrage de ces programmes ; les chercheurs notent surtout que l'économie reste, pour cette famille, subordonnée à la question identitaire.`,
        },
      },
      {
        id: 'electorat',
        sources: [
          { label: `Nonna Mayer, Ces Français qui votent Le Pen, Flammarion, 2002`, year: 2002 },
          { label: `Enquêtes électorales du Cevipof et de l'Ifop (vagues 2022 et 2024) — sociologie du vote RN`, year: 2024 },
        ],
        titre: { fr: `L'électorat : ce que dit la sociologie électorale` },
        corps: {
          fr: `La sociologie du vote d'extrême droite est l'un des domaines les mieux documentés de la science politique française, depuis les travaux fondateurs de Nonna Mayer. Les grandes tendances, stables d'une enquête à l'autre : une surreprésentation des ouvriers et des employés, des habitants des zones périurbaines et rurales, et des personnes sans diplôme du supérieur ; une sous-représentation dans les centres des grandes métropoles et chez les plus diplômés. Sous Marine Le Pen, l'écart hommes-femmes s'est resserré et le vote a fortement progressé chez les jeunes actifs — en 2024, le RN arrive en tête dans la plupart des classes d'âge intermédiaires.\n\nLes motivations mesurées sont multiples : l'immigration et l'insécurité, mais aussi le pouvoir d'achat, le sentiment de déclassement, la défiance envers les institutions et les partis de gouvernement. Les enquêtes montrent une part croissante de vote d'adhésion à côté du vote de protestation. Deux erreurs symétriques sont à éviter : essentialiser des millions d'électeurs (les réduire à un seul mobile supposé), et nier ce que les enquêtes mesurent (la place centrale du thème de l'immigration dans ce vote). Les chiffres cités ici sont des ordres de grandeur d'enquêtes — pas des vérités individuelles.`,
        },
      },
      {
        id: 'rapports-avec-la-droite',
        titre: { fr: `Les rapports avec la droite : digues, alliances, scission` },
        corps: {
          fr: `L'histoire des relations entre droite et extrême droite alterne cordons sanitaires et rapprochements. Dreux 1983 : première alliance municipale locale, assumée par une partie de la droite, condamnée par une autre. Années 1980 : Jacques Chirac exclut toute alliance nationale ; en 1988, la droite adopte la ligne du « ni-ni » face au FN. 1998 : plusieurs présidents de région UDF ou RPR se font élire avec les voix du FN — la plupart sont désavoués ou exclus par leurs partis. 2011 : l'UMP théorise le « ni-ni » (ni front républicain, ni alliance) pour les duels gauche-FN.\n\nL'épisode le plus spectaculaire est récent : en juin 2024, après la dissolution de l'Assemblée, le président des Républicains Éric Ciotti annonce une alliance électorale avec le RN — sans mandat de ses instances. Le parti se déchire : Ciotti est exclu (décision ensuite contestée en justice), fonde son propre groupe allié au RN (environ 17 députés), et LR se scinde durablement. Pour les politistes, cette séquence illustre le déplacement de la « digue » : ce qui était exclu au niveau national en 1988 est devenu, pour une fraction de la droite, une stratégie assumée en 2024.`,
        },
      },
      {
        id: 'international',
        sources: [{ label: `Cas Mudde, The Far Right Today, Polity, 2019 (comparaisons européennes)`, year: 2019 }],
        titre: { fr: `À l'étranger : des cousins, pas des jumeaux` },
        corps: {
          fr: `La famille existe dans presque toute l'Europe, mais les étiquettes ne se transposent pas d'un pays à l'autre. Au Parlement européen, le RN siège depuis 2024 dans le groupe « Patriotes pour l'Europe », aux côtés notamment du Fidesz hongrois et du FPÖ autrichien. L'AfD allemande, jugée trop radicale, en a été tenue à l'écart — le RN avait rompu avec elle en mai 2024 après des propos d'un de ses dirigeants sur la SS. Fratelli d'Italia, le parti de Giorgia Meloni, issu de la tradition post-fasciste italienne mais siégeant dans un autre groupe (les Conservateurs et réformistes), est classé selon les chercheurs entre droite radicale et extrême droite — son exercice du pouvoir depuis 2022 alimente le débat sur la « normalisation ».\n\nCes comparaisons servent à deux choses : observer ce que font ces partis une fois au pouvoir (Italie, Hongrie, participation gouvernementale du FPÖ en Autriche), et comprendre que chaque classement doit être argumenté pays par pays, sur critères — les généalogies, les programmes et les rapports aux institutions diffèrent réellement.`,
        },
      },
      {
        id: 'normalisation-ou-continuite',
        sources: [
          { label: `Cas Mudde, The Far Right Today, Polity, 2019 (mainstreaming)`, year: 2019 },
          { label: `Jean-Yves Camus & Nicolas Lebourg, Les Droites extrêmes en Europe, Seuil, 2015`, year: 2015 },
        ],
        titre: { fr: `Normalisation ou continuité ? Le débat central des politistes` },
        corps: {
          fr: `C'est aujourd'hui LA question de la recherche sur le RN : la « dédiabolisation » a-t-elle transformé le parti, ou seulement son image ? Trois lectures coexistent. Première lecture : une normalisation réelle mais partielle — le parti a abandonné ses marqueurs les plus radicaux (négationnisme, sortie de l'euro), accepté le cadre institutionnel, et évoluerait vers une droite nationale-populiste comparable à d'autres droites radicales européennes. Deuxième lecture : une continuité sous vernis — le cœur du projet (priorité nationale, vision identitaire de la nation) est inchangé, seule la présentation a changé ; les travaux sur les cadres et les réseaux du parti nourrissent cette lecture. Troisième lecture, celle de Mudde à l'échelle européenne : le phénomène principal n'est pas la modération de l'extrême droite mais le « mainstreaming » — c'est le débat public et les autres partis qui se sont déplacés vers ses thèmes.\n\nAucune de ces lectures n'est marginale ; toutes s'appuient sur des données. L'honnêteté intellectuelle consiste à connaître les trois — et à observer les actes plus que les étiquettes : votes au Parlement, programmes successifs, exercice du pouvoir local, comportement des partis frères au pouvoir à l'étranger.`,
        },
      },
      {
        id: 'critiques',
        titre: { fr: `Les critiques qui lui sont adressées — et ses réponses` },
        corps: {
          fr: `Critique juridique : la « priorité nationale » instaurerait une inégalité de droits entre citoyens et étrangers en situation régulière, contraire selon de nombreux juristes aux principes constitutionnels et au droit européen — sa mise en œuvre supposerait des révisions majeures. Critique démocratique : les opposants pointent le rapport du parti aux contre-pouvoirs, et les précédents étrangers (pressions sur la justice et les médias en Hongrie, documentées par les institutions européennes). Critique historique : la continuité des réseaux et des cadres avec le FN historique. Critique judiciaire : en mars 2025, Marine Le Pen et plusieurs cadres du parti ont été condamnés en première instance dans l'affaire des assistants parlementaires européens (détournement de fonds publics), avec pour elle une peine d'inéligibilité assortie de l'exécution provisoire — elle a fait appel, un procès d'appel est attendu, et la présomption d'innocence s'applique aux faits qu'elle conteste. Critique économique enfin : des chiffrages jugés irréalistes par la plupart des économistes.\n\nLes réponses du parti : la préférence nationale existerait ailleurs sous d'autres formes ; le parti respecte les élections et les institutions ; les condamnations relèveraient selon lui d'un traitement judiciaire et médiatique défavorable — affirmation qu'aucun élément objectif ne permet d'établir, mais qui structure son discours. À chacun de peser ces arguments sur pièces.`,
        },
      },
      {
        id: 'idees-recues',
        titre: { fr: `Les idées reçues` },
        corps: {
          fr: `« L'extrême droite est fasciste » : trompeur — certains courants historiques sont liés au fascisme, mais toutes les formations actuelles classées à l'extrême droite ne se définissent pas ainsi, et le classement repose sur des critères qu'il faut expliquer, pas sur cette assimilation. « Le RN n'est pas d'extrême droite puisqu'il participe aux élections » : la participation électorale n'est pas un critère de classement — la droite radicale au sens de Mudde participe aux élections par définition. « L'extrême droite n'a jamais gouverné en France » : partiel — jamais nationalement sous la Ve République, mais elle dirige des municipalités depuis 1995, et le régime de Vichy reste un cas distinct (un régime issu de la défaite, pas un parti élu). « Voter RN, c'est être raciste » : la sociologie électorale documente des motivations multiples et interdit d'essentialiser des millions d'électeurs.\n\nChacune de ces affirmations est traitée, avec sources et verdict nuancé, dans le module « Vrai ou faux ? » en bas de page.`,
        },
      },
    ],
  },

  // ── N4 — Pour aller encore plus loin ────────────────────────────────────────
  level4: {
    items: [
      { kind: 'biblio', titre: { fr: `Cas Mudde, The Far Right Today — Polity, 2019` }, note: { fr: `La synthèse comparatiste de référence : définitions (droite radicale / extrême droite), causes, effets, réponses démocratiques.` } },
      { kind: 'biblio', titre: { fr: `Jean-Yves Camus & Nicolas Lebourg, Les Droites extrêmes en Europe — Seuil, 2015` }, note: { fr: `La généalogie européenne et française par deux spécialistes reconnus : courants, réseaux, doctrines.` } },
      { kind: 'biblio', titre: { fr: `Nonna Mayer, Ces Français qui votent Le Pen — Flammarion, 2002` }, note: { fr: `Le livre fondateur de la sociologie électorale du vote FN : qui vote, pourquoi, et ce que les enquêtes permettent (et ne permettent pas) de dire.` } },
      { kind: 'biblio', titre: { fr: `Valérie Igounet, Le Front national de 1972 à nos jours — Seuil, 2014` }, note: { fr: `L'histoire interne du parti par une historienne, des origines à la dédiabolisation, fondée sur archives et entretiens.` } },
      { kind: 'lien', titre: { fr: `Conseil constitutionnel — résultats officiels des élections présidentielles` }, note: { fr: `Les proclamations officielles de résultats (1965-2022) : la source primaire pour tous les scores cités dans cette fiche.` }, url: 'https://www.conseil-constitutionnel.fr' },
      { kind: 'lien', titre: { fr: `Vie-publique.fr — dossiers « partis politiques » et chronologies électorales` }, note: { fr: `La documentation publique de référence, gratuite et sourcée.` }, url: 'https://www.vie-publique.fr' },
    ],
  },

  // ── Chronologie interactive ──────────────────────────────────────────────────
  chronologie: {
    titre: { fr: `L'extrême droite française : un siècle de repères` },
    events: [
      { date: '1934', titre: { fr: `Le 6 février des ligues` }, detail: { fr: `La manifestation des ligues nationalistes devant l'Assemblée nationale dégénère (une quinzaine de morts) et fait tomber le gouvernement Daladier. Coup de force manqué ou émeute sans plan : les historiens en débattent encore.` } },
      { date: '1940-1944', titre: { fr: `Vichy — un régime, pas un parti` }, detail: { fr: `Né de la défaite militaire et non des urnes, le régime de Vichy mène la « Révolution nationale » et collabore avec l'Allemagne nazie. Cette période marginalise durablement l'extrême droite après la Libération.` } },
      { date: '1956', titre: { fr: `La vague poujadiste` }, detail: { fr: `Le mouvement antifiscal de Pierre Poujade obtient 52 députés — dont Jean-Marie Le Pen, plus jeune élu de l'Assemblée. Le mouvement s'effondre dès 1958, mais a révélé un électorat protestataire.` } },
      { date: '1961-1962', titre: { fr: `L'OAS` }, detail: { fr: `Opposée à l'indépendance de l'Algérie, l'Organisation armée secrète mène une campagne d'attentats. Sa défaite laisse une génération de militants nationalistes dont certains rejoindront le FN.` } },
      { date: '1972', titre: { fr: `Fondation du Front national` }, detail: { fr: `En octobre 1972, le mouvement Ordre nouveau crée le FN comme vitrine électorale et en confie la présidence à Jean-Marie Le Pen. Débuts très faibles : 0,75 % à la présidentielle de 1974.` } },
      { date: '1983-1984', titre: { fr: `La percée : Dreux, puis les européennes` }, source: { label: `Résultats officiels des élections européennes de juin 1984`, year: 1984 }, detail: { fr: `Alliance locale droite-FN à Dreux en 1983, puis environ 11 % aux européennes de 1984 : le FN s'installe dans le paysage. En 1986, la proportionnelle lui donne 35 députés.` } },
      { date: '1987', titre: { fr: `Le « point de détail »` }, detail: { fr: `Jean-Marie Le Pen qualifie les chambres à gaz de « point de détail de l'histoire de la Seconde Guerre mondiale ». Ces propos, répétés, lui vaudront plusieurs condamnations, notamment pour contestation de crimes contre l'humanité.` } },
      { date: '2002', titre: { fr: `Le 21 avril` }, source: { label: `Conseil constitutionnel — résultats de l'élection présidentielle 2002`, year: 2002 }, detail: { fr: `Jean-Marie Le Pen (16,86 %) élimine Lionel Jospin et accède au second tour — une première sous la Ve République. Jacques Chirac est réélu avec 82,21 % des voix, après des manifestations massives.` } },
      { date: '2011-2018', titre: { fr: `Dédiabolisation : de Marine Le Pen au RN` }, detail: { fr: `Marine Le Pen prend la présidence du FN en janvier 2011, exclut son père en 2015 et rebaptise le parti Rassemblement national en juin 2018. Le style change ; la portée du changement de fond fait débat parmi les chercheurs.` } },
      { date: '2017-2022', titre: { fr: `Deux seconds tours, une progression continue` }, source: { label: `Conseil constitutionnel — résultats des élections présidentielles 2017 et 2022`, year: 2022 }, detail: { fr: `Marine Le Pen est battue au second tour avec 33,90 % en 2017, puis 41,45 % en 2022. Aux législatives de 2022, le RN obtient 89 députés — son premier grand groupe parlementaire. Éric Zemmour (Reconquête) a obtenu 7,07 % au premier tour de 2022.` } },
      { date: '2024', titre: { fr: `Européennes, dissolution, législatives` }, detail: { fr: `La liste Bardella arrive largement en tête des européennes (~31,4 %). Aux législatives anticipées, le RN et ses alliés sont premiers en voix (~10 millions) et premier groupe unique de l'Assemblée (126 députés RN, ~143 avec les alliés ciottistes), mais sans majorité, battus en sièges par le jeu des désistements. LR se scinde après l'alliance annoncée par Éric Ciotti.` } },
      { date: '2025', titre: { fr: `Condamnation en première instance de Marine Le Pen — appel en cours` }, detail: { fr: `En mars 2025, Marine Le Pen et plusieurs cadres du parti sont condamnés en première instance dans l'affaire des assistants parlementaires européens (détournement de fonds publics), avec une peine d'inéligibilité assortie de l'exécution provisoire pour elle. Elle a fait appel ; un procès d'appel est attendu, et la présomption d'innocence s'applique aux faits contestés en appel.` } },
    ],
  },

  // ── Modules liés ─────────────────────────────────────────────────────────────
  vraiFaux: ['vf-ed-fasciste', 'vf-ed-rn-classement', 'vf-ed-jamais-gouverne', 'vf-ed-vote-raciste'],

  quiz: [
    {
      question: { fr: `Sur quoi repose le classement d'un parti à l'extrême droite par les chercheurs ?` },
      options: [
        { fr: `Sur la fermeté de ses positions sur l'immigration` },
        { fr: `Sur des critères : conception de la nation (identitaire ou civique), désignation d'un groupe comme menace, rapport aux contre-pouvoirs, histoire du mouvement` },
        { fr: `Sur un vote des journalistes` },
        { fr: `Sur une décision du gouvernement` },
      ],
      bonneReponse: 1,
      explication: { fr: `Le classement est un travail scientifique fondé sur des critères documentés (nativisme, autoritarisme, populisme chez Cas Mudde), pas un jugement moral ni une décision officielle. C'est la combinaison des critères qui compte — pas l'intensité des positions.` },
    },
    {
      question: { fr: `Quand et par qui le Front national a-t-il été fondé ?` },
      options: [
        { fr: `En 1956, par Pierre Poujade` },
        { fr: `En octobre 1972, à l'initiative du mouvement Ordre nouveau, avec Jean-Marie Le Pen pour président` },
        { fr: `En 1984, par Jean-Marie Le Pen seul` },
        { fr: `En 2011, par Marine Le Pen` },
      ],
      bonneReponse: 1,
      explication: { fr: `Le FN est créé en octobre 1972 comme vitrine électorale d'Ordre nouveau, mouvement nationaliste dissous par le gouvernement en 1973. Jean-Marie Le Pen le présidera jusqu'en 2011.` },
    },
    {
      question: { fr: `Que s'est-il passé le 21 avril 2002 ?` },
      options: [
        { fr: `Jean-Marie Le Pen a été élu président` },
        { fr: `Le FN a remporté les législatives` },
        { fr: `Jean-Marie Le Pen (16,86 %) a accédé au second tour de la présidentielle, avant d'être battu avec 17,79 % des voix` },
        { fr: `Le FN a changé de nom` },
      ],
      bonneReponse: 2,
      explication: { fr: `Première qualification d'un candidat d'extrême droite au second tour d'une présidentielle sous la Ve République. Jacques Chirac est réélu le 5 mai 2002 avec 82,21 % des voix.` },
    },
    {
      question: { fr: `Que distingue le politiste Cas Mudde par les termes « droite radicale » et « extrême droite » ?` },
      options: [
        { fr: `Rien, ce sont des synonymes` },
        { fr: `La droite radicale accepte le jeu électoral mais conteste des éléments de la démocratie libérale ; l'extrême droite au sens strict rejette la démocratie elle-même` },
        { fr: `La droite radicale est plus violente que l'extrême droite` },
        { fr: `La distinction ne concerne que les partis américains` },
      ],
      bonneReponse: 1,
      explication: { fr: `Dans la grille de Mudde, le RN relève de la droite radicale. La plupart des chercheurs français emploient toutefois « extrême droite » au sens large pour toute cette famille — une différence de vocabulaire, pas de méthode.` },
    },
    {
      question: { fr: `Qu'ont donné les élections législatives de 2024 pour le RN ?` },
      options: [
        { fr: `Une majorité absolue à l'Assemblée nationale` },
        { fr: `Premier parti en voix (~10 millions avec ses alliés) et premier groupe unique de l'Assemblée, mais pas de majorité — battu en sièges par le jeu des désistements` },
        { fr: `Aucun député` },
        { fr: `L'entrée au gouvernement` },
      ],
      bonneReponse: 1,
      explication: { fr: `Le RN obtient au moins 126 députés (environ 143 avec les alliés ciottistes) : premier groupe unique de l'Assemblée, sans majorité. L'extrême droite n'a jamais gouverné nationalement sous la Ve République.` },
    },
  ],

  motsAssocies: ['proportionnelle', 'motion-de-censure', '49-3'],

  continuerAvec: [
    { slug: 'droite' },
    { slug: 'gauche', label: { fr: 'La gauche' }, soon: true },
    { slug: 'president-de-la-republique' },
  ],

  figuresLiees: [
    { nom: 'Jean-Marie Le Pen', note: { fr: `fondateur et président du FN (1972-2011), plusieurs fois condamné pour ses propos sur les chambres à gaz — mort en janvier 2025` } },
    { nom: 'Marine Le Pen', note: { fr: `présidente du FN/RN (2011-2021), trois fois candidate à la présidentielle, condamnée en première instance en mars 2025 (appel en cours)` } },
    { nom: 'Jordan Bardella', note: { fr: `président du RN depuis 2022, tête de liste aux européennes de 2024 (~31,4 %)` } },
    { nom: 'Éric Zemmour', note: { fr: `fondateur de Reconquête (2021), 7,07 % à la présidentielle de 2022, condamné à plusieurs reprises pour provocation à la haine` } },
    { nom: 'Bruno Mégret', note: { fr: `numéro deux du FN, à l'origine de la scission de 1998-1999 (MNR)` } },
  ],

  partisLies: [
    { nom: 'Rassemblement national', note: { fr: `ex-Front national (1972), renommé en 2018 — classé à l'extrême droite par la grande majorité des chercheurs, classement que le parti conteste` } },
    { nom: 'Reconquête', note: { fr: `fondé par Éric Zemmour en 2021 — même classement scientifique, également récusé par le parti` } },
  ],

  sources: [
    { label: `Cas Mudde, The Far Right Today, Polity, 2019`, year: 2019 },
    { label: `Jean-Yves Camus & Nicolas Lebourg, Les Droites extrêmes en Europe, Seuil, 2015`, year: 2015 },
    { label: `Nonna Mayer, Ces Français qui votent Le Pen, Flammarion, 2002`, year: 2002 },
    { label: `Valérie Igounet, Le Front national de 1972 à nos jours, Seuil, 2014`, year: 2014 },
    { label: `Conseil constitutionnel — proclamations officielles des résultats des élections présidentielles (2002, 2017, 2022)`, url: 'https://www.conseil-constitutionnel.fr', year: 2022 },
    { label: `Vie-publique.fr — dossiers « partis politiques », chronologies et résultats électoraux`, url: 'https://www.vie-publique.fr', year: 2025 },
  ],
};
