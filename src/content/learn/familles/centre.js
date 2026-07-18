/**
 * Dossier « Le centre » — modèle ideologie (docs/jyconnaisrien/02, §3).
 * Thèse de la fiche : le centre n'est ni neutre ni sans opinion — c'est une
 * vraie tradition politique, avec un corpus doctrinal et une histoire.
 * 4 niveaux de lecture : N1 (20 s) → N2 (3 min) → N3 (tout comprendre, repliable) → N4.
 */

export default {
  slug: 'centre',
  type: 'ideologie',
  porte: 'B',
  title: { fr: `Le centre`, en: 'The Centre' },
  icon: '📙',
  difficulty: 2,
  famille: 'dossier',
  updatedAt: '2026-07-12',
  freshness: { type: 'periodic', reviewEveryMonths: 12, lastReviewedAt: '2026-07-12' },

  // ── N1 — En 20 secondes ─────────────────────────────────────────────────────
  level1: {
    fr: `On croit souvent que le centre, c'est « ne pas choisir ». C'est une erreur : le centre est une vraie famille politique, avec des idées constantes — libéralisme tempéré, construction européenne, décentralisation, recherche du compromis — et une histoire longue, de la démocratie chrétienne au radicalisme. Être centriste, ce n'est pas être sans opinion : c'est penser que les meilleures solutions se construisent entre les blocs, pas contre eux.`,
  },

  // ── N2 — En 3 minutes ───────────────────────────────────────────────────────
  level2: {
    sections: [
      {
        titre: { fr: `Être centriste : un contenu, pas une absence` },
        corps: {
          fr: `Le cliché veut que le centriste soit celui qui « coupe la poire en deux ». En réalité, le centre défend des positions qui lui sont propres et qu'on ne trouve telles quelles ni à droite ni à gauche : une économie de marché corrigée par le social, une Europe intégrée, des institutions rééquilibrées (proportionnelle, décentralisation), et le compromis assumé comme méthode de gouvernement — pas comme un renoncement. Sur certains sujets, comme l'Europe, le centre a même été plus constant que les deux grands blocs.`,
        },
      },
      {
        titre: { fr: 'Les grandes valeurs' },
        corps: {
          fr: `Quatre marqueurs reviennent chez presque tous les centristes : un libéralisme tempéré (l'économie de marché, oui, mais encadrée et corrigée par la solidarité) ; l'Europe (le centre est la famille la plus constamment europhile de la vie politique française) ; la décentralisation et les corps intermédiaires (communes, associations, partenaires sociaux — décider au plus près des gens) ; et le compromis comme méthode : chercher l'accord entre forces différentes n'est pas une faiblesse mais une conception du pouvoir, courante dans les démocraties voisines qui votent à la proportionnelle.`,
        },
      },
      {
        titre: { fr: `D'où vient le centre ?` },
        corps: {
          fr: `Le centre français a plusieurs sources. Le radicalisme : le Parti radical, fondé en juin 1901, est le plus ancien parti politique français encore existant — pilier de la IIIe République, défenseur de la laïcité et de la petite propriété. La démocratie chrétienne : issue du catholicisme social, incarnée après-guerre par le MRP de Robert Schuman et Georges Bidault, matrice de la construction européenne. Et le libéralisme orléaniste du XIXe siècle, partagé avec la droite libérale. Trois traditions différentes — c'est pour cela que le centre, comme la droite ou la gauche, est pluriel.`,
        },
      },
      {
        titre: { fr: 'Les principales sensibilités' },
        corps: {
          fr: `On distingue habituellement : la sensibilité démocrate-chrétienne (dignité de la personne, famille, corps intermédiaires, Europe — le MRP hier, une partie du MoDem et de l'UDI aujourd'hui) ; la sensibilité radicale (laïcité, école publique, classes moyennes indépendantes — commerçants, professions libérales) ; et le libéralisme social (accepter le marché tout en corrigeant activement ses inégalités). Ces sensibilités ne disent pas la même chose sur la religion, l'école ou l'économie — mais elles se retrouvent sur l'Europe, les institutions et la méthode du compromis.`,
        },
      },
      {
        titre: { fr: 'Quelques figures' },
        corps: {
          fr: `Robert Schuman (démocrate-chrétien, père fondateur de la construction européenne avec sa déclaration du 9 mai 1950), Jean Lecanuet (candidat centriste face à de Gaulle en 1965 — 15,57 % au premier tour), Simone Veil (centre-droit libéral, figure transpartisane — voir aussi la fiche droite), François Bayrou (18,57 % en 2007, meilleur score d'un candidat centriste autonome sous la Ve République, fondateur du MoDem), Jean-Louis Borloo (fondateur de l'UDI en 2012). Des parcours très différents, unis par le refus de se fondre dans l'un des deux grands blocs.`,
        },
      },
      {
        titre: { fr: 'Ce que disent ses défenseurs' },
        corps: {
          fr: `La vie politique française serait malade de sa brutalité : l'alternance de blocs qui défont ce que l'autre a fait empêcherait les réformes de durer. Le compromis, pratiqué partout en Europe du Nord, produirait des politiques plus stables et mieux acceptées. Le centre serait aussi le seul à tenir ensemble deux exigences que les blocs opposent : la liberté économique et la justice sociale. Enfin, la proportionnelle qu'il réclame rendrait l'Assemblée plus fidèle aux votes réels des Français.`,
        },
      },
      {
        titre: { fr: 'Ce que disent ses critiques' },
        corps: {
          fr: `Le centre serait un positionnement plus qu'un projet : il se définirait par rapport aux autres, pas par lui-même. Sa recherche du compromis masquerait une ambiguïté entretenue — « ni oui ni non » — qui lui permettrait de s'allier au plus offrant. Et dans les faits, sous la Ve République, il aurait presque toujours fini par gouverner avec la droite : son indépendance serait une posture d'entre-deux-élections. Les centristes répondent que leurs constantes (Europe, décentralisation, proportionnelle) sont documentées de longue date — le débat est ouvert, et cette fiche vous donne les éléments des deux côtés.`,
        },
      },
    ],
  },

  // ── N3 — Tout comprendre (sections repliables) ──────────────────────────────
  level3: {
    sections: [
      {
        id: 'contenu-du-centrisme',
        sources: [{ label: `Sylvie Guillaume, Le Centrisme en France aux XIXe et XXe siècles : un échec ?, MSHA, 2005`, year: 2005 }],
        titre: { fr: `Le centrisme a-t-il un contenu ?` },
        corps: {
          fr: `C'est la question que cette fiche prend au sérieux, parce qu'elle structure toutes les critiques adressées au centre. Réponse courte : oui, et il est documenté. Le corpus centriste combine trois héritages doctrinaux réels — la démocratie chrétienne, le radicalisme, le libéralisme social — et des positions constantes que l'on retrouve de décennie en décennie : l'intégration européenne, la décentralisation, le scrutin proportionnel, une économie de marché corrigée par la redistribution et le dialogue social.\n\nCe qui distingue le centre, c'est moins l'absence d'idées que le refus d'un principe unique : là où la gauche part de l'égalité et la droite de l'ordre ou de la liberté économique, le centre revendique l'équilibre entre des principes concurrents — et assume que cet équilibre se négocie. On peut juger cette posture sage ou molle ; on ne peut pas dire qu'elle est vide. Les historiens du centrisme (Sylvie Guillaume notamment) montrent d'ailleurs que son problème historique n'est pas le contenu mais la traduction politique : sous des institutions majoritaires, exister entre deux blocs est structurellement difficile.`,
        },
      },
      {
        id: 'democratie-chretienne',
        titre: { fr: `La démocratie chrétienne : le MRP et Schuman` },
        corps: {
          fr: `Issue du catholicisme social du XIXe siècle, la démocratie chrétienne défend la dignité de la personne, la famille, les corps intermédiaires et la subsidiarité — ne pas faire à l'échelon supérieur ce qui peut être fait plus près des gens. En France, son grand moment est l'après-guerre : le Mouvement républicain populaire (MRP), fondé en 1944, devient l'un des tout premiers partis du pays, avec des figures comme Georges Bidault et Robert Schuman, plusieurs fois président du Conseil et ministre des Affaires étrangères.\n\nC'est de cette famille que naît la construction européenne : la déclaration Schuman du 9 mai 1950 propose de mettre en commun le charbon et l'acier français et allemands — l'acte fondateur de ce qui deviendra l'Union européenne. Le MRP décline ensuite avec la Ve République, mais la sensibilité démocrate-chrétienne ne disparaît pas : elle irrigue le Centre démocrate de Lecanuet, le CDS, puis l'UDF, le MoDem et l'UDI. En Europe, elle reste une force majeure (la CDU allemande en est l'exemple type) — en France, elle survit comme sensibilité plus que comme parti.`,
        },
      },
      {
        id: 'radicalisme',
        titre: { fr: `Le radicalisme : le plus vieux parti de France` },
        corps: {
          fr: `Fondé en juin 1901, le Parti républicain, radical et radical-socialiste — dit Parti radical — est le plus ancien parti politique français encore existant. Sous la IIIe République, il en est le pilier : défense de la laïcité (il est au pouvoir lors de la loi de séparation de 1905), de l'école publique, de la petite propriété et des classes moyennes indépendantes — commerçants, artisans, professions libérales, instituteurs. Selon une boutade célèbre, son électeur avait « le cœur à gauche et le portefeuille à droite » : réformateur en politique, prudent en économie.\n\nSitué à gauche au début du XXe siècle, le radicalisme glisse vers le centre à mesure que le socialisme puis le communisme occupent la gauche. En 1972, il se scinde sur l'alliance avec la gauche : les radicaux de gauche (MRG) rejoignent l'union de la gauche, le Parti radical dit « valoisien » reste au centre-droit et participera à l'UDF puis à l'UDI. Cette scission illustre une constante : le centre français a toujours eu un pied vers chaque bloc.`,
        },
      },
      {
        id: 'orleanisme-liberal',
        sources: [{ label: `René Rémond, Les Droites en France, Aubier, 1982 (grille légitimisme / orléanisme / bonapartisme)`, year: 1982 }],
        titre: { fr: `L'héritage orléaniste : le « juste milieu »` },
        corps: {
          fr: `Troisième source du centre : le libéralisme orléaniste du XIXe siècle, du nom de la monarchie de Juillet (1830-1848), qui revendiquait le « juste milieu » entre la réaction monarchique et la révolution — libertés parlementaires, libertés économiques, gouvernement des modérés. Dans la grille classique de René Rémond, l'orléanisme est l'ancêtre de la droite libérale ; mais il est aussi celui du centre-droit, et c'est précisément pour cela que la frontière entre centre et droite libérale est si poreuse en France.\n\nValéry Giscard d'Estaing en est l'illustration parfaite : libéral, européen, réformateur sur les mœurs, il gouverne au centre-droit et fédère centristes et libéraux dans l'UDF. Des figures comme Simone Veil relèvent du même espace — centre-droit libéral — et sont revendiquées à la fois par le centre et par la droite modérée (la fiche droite lui consacre un portrait). Retenez l'idée : une partie du centre français est un centre-droit qui a choisi de ne pas s'appeler « droite ».`,
        },
      },
      {
        id: 'lecanuet-1965',
        sources: [{ label: `Conseil constitutionnel — résultats officiels de l'élection présidentielle de 1965`, url: 'https://www.conseil-constitutionnel.fr', year: 1965 }],
        titre: { fr: `1965 : Lecanuet face à de Gaulle` },
        corps: {
          fr: `Première présidentielle au suffrage universel direct, premier candidat centriste autonome : Jean Lecanuet, sénateur démocrate-chrétien, mène en 1965 une campagne moderne — jeune, souriant, très présent à la télévision, on le surnomme le « Kennedy français ». Son programme : l'Europe, contre la conception gaullienne de l'« Europe des nations ».\n\nRésultat : 15,57 % au premier tour. C'est insuffisant pour se qualifier, mais suffisant pour priver le général de Gaulle d'une victoire dès le premier tour — le président sortant est mis en ballottage et ne l'emporte qu'au second tour face à François Mitterrand. L'épisode fonde le centrisme d'opposition sous la Ve République : il prouve qu'un espace électoral existe entre le gaullisme et la gauche, et Lecanuet crée dans la foulée le Centre démocrate pour l'organiser. Il montre aussi sa limite, qui ne sera jamais vraiment levée : cet espace pèse, mais ne gagne pas.`,
        },
      },
      {
        id: 'udf-1978',
        titre: { fr: `1978 : l'UDF, la confédération giscardienne` },
        corps: {
          fr: `Élu président en 1974, Valéry Giscard d'Estaing gouverne avec le soutien des gaullistes mais veut une force propre. En février 1978, avant les législatives, ses soutiens créent l'Union pour la démocratie française (UDF) — du titre de son livre Démocratie française. C'est une confédération : elle regroupe le Parti républicain (les libéraux giscardiens), le Centre des démocrates sociaux (CDS, héritier de la démocratie chrétienne) et le Parti radical, entre autres.\n\nPendant vingt ans, l'UDF est l'une des deux jambes de la majorité de droite et du centre, en concurrence permanente avec le RPR de Jacques Chirac. Elle incarne le centre-droit libéral et européen — mais au prix d'une ambiguïté durable : est-elle un centre autonome ou l'aile modérée de la droite ? La question n'a jamais été tranchée, et c'est précisément d'elle que naîtront les choix opposés des années 2000 : se fondre dans l'UMP (2002) ou revendiquer l'indépendance (Bayrou).`,
        },
      },
      {
        id: 'bayrou-2007',
        sources: [{ label: `Conseil constitutionnel — résultats officiels des élections présidentielles de 2002, 2007 et 2012`, url: 'https://www.conseil-constitutionnel.fr', year: 2012 }],
        titre: { fr: `2007 : Bayrou et le pari de l'indépendance` },
        corps: {
          fr: `Après la création de l'UMP en 2002, qui absorbe la majeure partie de l'UDF, François Bayrou fait le choix inverse : maintenir un centre indépendant des deux blocs. Candidat en 2002, il obtient 6,84 %. En 2007, sa campagne « ni droite ni gauche telles qu'elles sont » décolle : 18,57 % au premier tour, troisième position — le meilleur score d'un candidat centriste autonome de toute la Ve République.\n\nDans la foulée, il fonde le Mouvement démocrate (MoDem). Mais le pari a un coût immédiat : la plupart des députés et cadres de l'ex-UDF refusent la rupture avec la droite et créent le Nouveau Centre, allié de Nicolas Sarkozy. Le MoDem, privé d'alliances, s'effondre aux législatives — illustration mécanique du problème centriste sous le scrutin majoritaire : un cinquième des voix, presque pas de sièges. En 2012, Bayrou retombe à 9,13 %. L'expérience 2007-2012 reste le cas d'école du centrisme d'indépendance : électoralement réel, institutionnellement puni.`,
        },
      },
      {
        id: 'macron-et-le-centre',
        titre: { fr: `2017 : Macron — le centre devenu bloc central ?` },
        corps: {
          fr: `En 2017, Emmanuel Macron est élu président sur un positionnement « et de droite et de gauche », avec le soutien décisif de François Bayrou et du MoDem, alliés dès février. Pour la première fois sous la Ve République, un espace se réclamant du dépassement des blocs devient dominant : le « bloc central » gouverne, et le MoDem en est une composante permanente.\n\nMais cette victoire ouvre un débat qui n'est pas tranché : le bloc macroniste est-il encore « le centre » ? Plusieurs travaux de politistes situent Renaissance au centre-droit, surtout depuis 2022, au vu de ses politiques économiques et régaliennes ; d'autres maintiennent le classement au centre — la fiche droite (section « partis ») détaille ce débat, et cette fiche ne l'arbitre pas davantage. Une chose est sûre : le centrisme historique (démocrate-chrétien, radical, social-libéral) et le bloc central macroniste ne se confondent pas entièrement. Le premier est une tradition doctrinale ; le second est une coalition de gouvernement, qui agrège aussi des libéraux venus de droite et des sociaux-démocrates venus de gauche. Dire « Macron a fait gagner le centre » et « le centre s'est dissous dans le macronisme » sont deux lectures défendables du même événement.`,
        },
      },
      {
        id: 'rapport-a-la-droite-et-a-la-gauche',
        titre: { fr: `Le centre, la droite et la gauche` },
        corps: {
          fr: `Le reproche le plus fréquent : « le centre finit toujours par choisir la droite ». Sous la Ve République, c'est le plus souvent vrai — Centre démocrate puis CDS, UDF, Nouveau Centre, UDI ont gouverné avec la droite. Mais la cause est autant institutionnelle qu'idéologique : le scrutin majoritaire à deux tours force chacun à choisir un bloc pour exister au Parlement, et le centre, économiquement libéral, a plus souvent trouvé l'accord avec la droite qu'avec une gauche longtemps alliée aux communistes.\n\nLes contre-exemples existent pourtant : les radicaux de gauche sont alliés à la gauche depuis 1972 et ont participé à tous ses gouvernements ; lors de l'« ouverture » de 1988, des ministres venus du centre et de la droite modérée sont entrés dans les gouvernements de Michel Rocard ; et le MoDem de 2007-2012 a refusé tout ralliement à droite, Bayrou annonçant même voter François Hollande au second tour de 2012. La formule juste serait donc : sous la Ve République, le centre s'allie structurellement à la droite — sauf quand il tente l'indépendance, et il le paie électoralement, ou quand une partie de lui choisit la gauche, et elle devient un satellite. La proportionnelle, revendication centriste constante, vise précisément à sortir de ce dilemme.`,
        },
      },
      {
        id: 'europe',
        sources: [{ label: `Résultats officiels du référendum du 20 septembre 1992 sur le traité de Maastricht : « oui » 51,04 % (Conseil constitutionnel)`, url: 'https://www.conseil-constitutionnel.fr', year: 1992 }],
        titre: { fr: `L'Europe : le marqueur constant` },
        corps: {
          fr: `S'il fallait retenir un seul marqueur du centre français, ce serait celui-là : l'europhilie, constante depuis 1950. La construction européenne est née de la démocratie chrétienne (déclaration Schuman du 9 mai 1950) ; la candidature Lecanuet de 1965 s'est faite au nom de l'Europe contre la conception gaullienne ; l'UDF a porté l'intégration européenne pendant vingt ans ; et lors du référendum de Maastricht en 1992 — approuvé de justesse, à 51,04 % — les centristes ont fait campagne massivement pour le « oui », alors que la droite se déchirait (Séguin, Pasqua) et que la gauche comptait aussi ses opposants.\n\nCette constance a un revers assumé : le centre est la cible naturelle des souverainistes des deux bords, qui voient dans son europhilie un abandon de souveraineté nationale. Les centristes répondent que la souveraineté s'exerce désormais à l'échelle européenne — monnaie, commerce, climat — et que la France seule ne pèse plus. Ce débat de fond est traité en détail dans les fiches consacrées à l'Union européenne ; retenez ici le fait politique : sur l'Europe, le centre n'a jamais varié, ce qui en fait, sur ce sujet au moins, la famille la plus prévisible de la vie politique française.`,
        },
      },
      {
        id: 'critiques',
        titre: { fr: `Les critiques qui lui sont adressées` },
        corps: {
          fr: `La critique du centre a une longue histoire — dès la Révolution, on appelait « le marais » (ou « la Plaine ») les députés qui ne siégeaient ni avec les Montagnards ni avec les Girondins, avec l'idée qu'ils suivaient le vainqueur. Les reproches modernes en descendent : le centre serait un opportunisme (il attend de voir qui gagne pour s'allier), une ambiguïté (« ni oui ni non », des positions floues qui permettent tous les ralliements), un parti de notables (des élus locaux bien implantés, plus soucieux de leurs mandats que d'un projet national), et un contenu introuvable (que propose-t-il qu'on ne trouve ni à droite ni à gauche ?).\n\nLes réponses centristes : le compromis n'est pas l'opportunisme mais une méthode revendiquée, majoritaire dans les démocraties européennes ; les constantes du centre (Europe, décentralisation, proportionnelle, économie sociale de marché) sont documentées sur un siècle ; et l'implantation locale est une force démocratique, pas une tare. Reste une critique plus structurelle, que les centristes eux-mêmes reconnaissent : sous les institutions majoritaires de la Ve République, le centre n'a jamais réussi à gagner seul — son influence passe par les alliances, ce qui alimente sans fin le procès en ambiguïté. À chacun de juger : cette fiche donne les arguments, pas le verdict.`,
        },
      },
      {
        id: 'electorat',
        titre: { fr: `Qui vote au centre ?` },
        corps: {
          fr: `Les études électorales dessinent un portrait relativement stable de l'électorat centriste : plutôt diplômé, plutôt urbain ou périurbain aisé, plus âgé que la moyenne, souvent issu des régions de tradition catholique modérée — l'Ouest en particulier, terre d'élection de la démocratie chrétienne. C'est aussi un électorat modéré au sens propre : il se dit peu attiré par les extrêmes et valorise la stabilité et la compétence.\n\nDeux nuances importantes. D'abord, cet électorat « socle » est étroit : les grandes poussées centristes (Lecanuet 1965, Bayrou 2007) se sont faites en attirant très au-delà de lui, notamment des électeurs déçus des deux blocs — les enquêtes électorales de 2007 (CEVIPOF) ont montré que l'électorat Bayrou venait à la fois de la droite et de la gauche modérées. Ensuite, cet électorat est volatil : il se reporte facilement vers la droite modérée ou le bloc central selon l'offre — ce qui explique que les scores centristes varient du simple au triple d'une élection à l'autre. Précaution habituelle : ces caractéristiques sont des moyennes issues d'enquêtes datées, pas des étiquettes individuelles — des électeurs de tous milieux votent au centre.`,
        },
      },
      {
        id: 'international',
        titre: { fr: `Ses équivalents à l'étranger` },
        corps: {
          fr: `Les étiquettes ne se transposent jamais exactement. Le FDP allemand, parti libéral, joue depuis des décennies le rôle de « faiseur de rois » dans les coalitions — mais il est nettement plus libéral économiquement que le centre français, plus proche de notre droite libérale. Les Libéraux-démocrates britanniques (Lib Dems) sont l'héritier social-libéral le plus comparable au MoDem — europhiles, décentralisateurs, partisans de la proportionnelle — et leur expérience de coalition avec les conservateurs (2010-2015), suivie d'un effondrement électoral, illustre le risque classique du centre allié à un grand bloc.\n\nLa vraie différence est institutionnelle : dans les pays à scrutin proportionnel (Allemagne, Pays-Bas, Scandinavie), les partis centristes existent durablement en autonomie parce que chaque voix compte pour les sièges, et les coalitions se négocient après l'élection. Sous le scrutin majoritaire français, l'alliance se décide avant, ce qui prive le centre de sa monnaie d'échange. Comprendre cela, c'est comprendre pourquoi la proportionnelle est la revendication institutionnelle constante du centre français — et pourquoi ses adversaires y voient un calcul autant qu'un principe.`,
        },
      },
      {
        id: 'idees-recues',
        titre: { fr: `Les idées reçues` },
        corps: {
          fr: `« Le centre, c'est ne pas avoir d'opinion » : faux — le centre a un corpus doctrinal réel (démocratie chrétienne, radicalisme, libéralisme social) et des positions constantes sur l'Europe, les institutions et l'économie. « Le centre finit toujours par choisir la droite » : partiellement vrai — c'est le cas le plus fréquent sous la Ve République, largement à cause du mode de scrutin, mais les radicaux de gauche et les ministres centristes de gouvernements de gauche prouvent que ce n'est pas une loi. « Un centriste ne peut pas gagner une présidentielle » : impossible à trancher sans contexte — aucun candidat purement centriste n'a jamais gagné sous la Ve, et le cas Macron 2017 dépend précisément de la question débattue « Macron est-il centriste ? » (voir la section dédiée).\n\nCes affirmations sont traitées une par une, avec sources et verdicts nuancés, dans le module « Vrai ou faux ? » en bas de page.`,
        },
      },
    ],
  },

  // ── N4 — Pour aller encore plus loin ────────────────────────────────────────
  level4: {
    items: [
      { kind: 'discours', titre: { fr: `Déclaration de Robert Schuman — 9 mai 1950` }, note: { fr: `L'acte fondateur de la construction européenne, proposé par un démocrate-chrétien français. Le 9 mai est devenu la « journée de l'Europe ».` }, url: 'https://www.vie-publique.fr' },
      { kind: 'biblio', titre: { fr: `Sylvie Guillaume, Le Centrisme en France aux XIXe et XXe siècles : un échec ? — MSHA, 2005` }, note: { fr: `La synthèse universitaire de référence sur le centrisme français : son contenu, ses tentatives, ses limites institutionnelles.` } },
      { kind: 'biblio', titre: { fr: `Serge Berstein, Histoire du Parti radical — Presses de Sciences Po, 2 volumes, 1980-1982` }, note: { fr: `L'étude classique du plus ancien parti français, pilier de la IIIe République et matrice d'une part du centre.` } },
      { kind: 'lien', titre: { fr: `Conseil constitutionnel — résultats officiels des élections présidentielles` }, note: { fr: `Les scores exacts de Lecanuet (1965) et Bayrou (2002, 2007, 2012), à la source.` }, url: 'https://www.conseil-constitutionnel.fr' },
      { kind: 'lien', titre: { fr: `Vie-publique.fr — fiches « vie politique » et « partis politiques »` }, note: { fr: `La documentation publique de référence, gratuite et sourcée.` }, url: 'https://www.vie-publique.fr' },
    ],
  },

  // ── Chronologie interactive ──────────────────────────────────────────────────
  chronologie: {
    titre: { fr: `Plus d'un siècle de centrisme français` },
    events: [
      { date: '1901', titre: { fr: `Fondation du Parti radical` }, detail: { fr: `En juin 1901, le Parti républicain, radical et radical-socialiste tient son premier congrès : c'est aujourd'hui le plus ancien parti politique français encore existant. Pilier de la IIIe République, il glissera de la gauche vers le centre au fil du XXe siècle.` } },
      { date: '1944', titre: { fr: `Le MRP, grand parti de l'après-guerre` }, detail: { fr: `Le Mouvement républicain populaire, démocrate-chrétien, devient l'un des tout premiers partis du pays à la Libération, avec Georges Bidault et Robert Schuman. Il gouverne la IVe République et porte la réconciliation franco-allemande.` } },
      { date: '1950', titre: { fr: `La déclaration Schuman` }, detail: { fr: `Le 9 mai 1950, Robert Schuman propose de placer le charbon et l'acier français et allemands sous une autorité commune : l'acte de naissance de la construction européenne — et le marqueur le plus durable du centre français.` } },
      { date: '1965', titre: { fr: `Lecanuet met de Gaulle en ballottage` }, source: { label: `Conseil constitutionnel — résultats de l'élection présidentielle de 1965`, year: 1965 }, detail: { fr: `Jean Lecanuet, candidat centriste et européen, obtient 15,57 % au premier tour de la première présidentielle au suffrage universel direct — contribuant à priver de Gaulle d'une victoire dès le premier tour.` } },
      { date: '1978', titre: { fr: `Création de l'UDF` }, detail: { fr: `Valéry Giscard d'Estaing fédère républicains indépendants, centristes du CDS et radicaux dans l'Union pour la démocratie française : pendant vingt ans, la deuxième jambe de la majorité, face au RPR.` } },
      { date: '1992', titre: { fr: `Maastricht : le centre massivement pour le oui` }, source: { label: `Conseil constitutionnel — proclamation des résultats du référendum du 20 septembre 1992 (oui : 51,04 %)`, year: 1992 }, detail: { fr: `Alors que la droite se déchire et que la gauche compte ses opposants, les centristes font massivement campagne pour le traité de Maastricht, approuvé de justesse. L'europhilie confirme son statut de marqueur central.` } },
      { date: '2007', titre: { fr: `Bayrou à 18,57 % — puis le MoDem` }, source: { label: `Conseil constitutionnel — résultats de l'élection présidentielle de 2007`, year: 2007 }, detail: { fr: `François Bayrou réalise le meilleur score d'un candidat centriste autonome de la Ve République et fonde le Mouvement démocrate. Mais la plupart des élus ex-UDF choisissent l'alliance avec la droite (Nouveau Centre).` } },
      { date: '2012', titre: { fr: `Borloo fonde l'UDI` }, detail: { fr: `Jean-Louis Borloo fédère les centristes restés alliés à la droite (Nouveau Centre, Parti radical, divers) dans l'Union des démocrates et indépendants — le centre « de coalition », face au centre « d'indépendance » du MoDem.` } },
      { date: '2017', titre: { fr: `L'alliance avec Macron : la recomposition` }, detail: { fr: `Le MoDem s'allie dès février 2017 à Emmanuel Macron, élu président. Un espace se réclamant du dépassement droite-gauche devient dominant — en ouvrant un débat non tranché : ce bloc central est-il encore « le centre » ?` } },
      { date: '2024', titre: { fr: `Bayrou nommé Premier ministre` }, detail: { fr: `En décembre 2024, François Bayrou est nommé Premier ministre — une première pour le fondateur du MoDem, trois fois candidat à la présidentielle. Pour la suite de la séquence politique, reportez-vous aux fiches d'actualité : cette fiche est à jour à la date de vérification indiquée en haut de page.` } },
    ],
  },

  // ── Modules liés ─────────────────────────────────────────────────────────────
  vraiFaux: ['vf-centre-sans-opinion', 'vf-centre-toujours-droite', 'vf-centre-presidentielle'],

  quiz: [
    {
      question: { fr: `Quel est le plus ancien parti politique français encore existant ?` },
      options: [
        { fr: `Le Parti socialiste` },
        { fr: `Le Parti radical, fondé en juin 1901` },
        { fr: `Les Républicains` },
        { fr: `Le MoDem` },
      ],
      bonneReponse: 1,
      explication: { fr: `Le Parti républicain, radical et radical-socialiste, fondé en juin 1901, est le doyen des partis français. Pilier de la IIIe République, il a glissé de la gauche vers le centre au fil du XXe siècle.` },
    },
    {
      question: { fr: `Laquelle de ces affirmations sur le centre est la plus juste ?` },
      options: [
        { fr: `Le centre, c'est l'absence d'opinion` },
        { fr: `Le centre est une vraie tradition politique, nourrie par la démocratie chrétienne, le radicalisme et le libéralisme social` },
        { fr: `Le centre est une invention d'Emmanuel Macron en 2017` },
        { fr: `Le centre est simplement la moyenne des positions de la droite et de la gauche` },
      ],
      bonneReponse: 1,
      explication: { fr: `Le centre a un corpus doctrinal documenté et des positions constantes qui lui sont propres — Europe, décentralisation, proportionnelle, économie de marché corrigée par le social. On peut le critiquer, pas dire qu'il est vide.` },
    },
    {
      question: { fr: `Quel est le meilleur score d'un candidat centriste autonome à une présidentielle de la Ve République ?` },
      options: [
        { fr: `Jean Lecanuet en 1965 : 15,57 %` },
        { fr: `François Bayrou en 2007 : 18,57 %` },
        { fr: `François Bayrou en 2012 : 9,13 %` },
        { fr: `Aucun centriste ne s'est jamais présenté` },
      ],
      bonneReponse: 1,
      explication: { fr: `François Bayrou obtient 18,57 % au premier tour en 2007 (troisième position) — devant les 15,57 % de Lecanuet en 1965. Aucun candidat purement centriste n'a en revanche jamais atteint le second tour.` },
    },
    {
      question: { fr: `Quel sujet constitue le marqueur le plus constant du centre français depuis 1950 ?` },
      options: [
        { fr: `La sortie de l'euro` },
        { fr: `La nationalisation des banques` },
        { fr: `La construction européenne` },
        { fr: `Le rétablissement du service militaire` },
      ],
      bonneReponse: 2,
      explication: { fr: `De la déclaration Schuman (1950) à la campagne Lecanuet (1965), du oui à Maastricht (1992) au MoDem, l'europhilie est la constante la plus nette du centre — quand droite et gauche se sont chacune divisées sur l'Europe.` },
    },
    {
      question: { fr: `Pourquoi la proportionnelle est-elle une revendication constante du centre ?` },
      options: [
        { fr: `Parce qu'elle favoriserait mécaniquement les grands partis` },
        { fr: `Parce qu'elle permettrait au centre d'obtenir des sièges à hauteur de ses voix, sans dépendre d'alliances conclues avant l'élection` },
        { fr: `Parce qu'elle supprimerait le président de la République` },
        { fr: `Par tradition, sans raison particulière` },
      ],
      bonneReponse: 1,
      explication: { fr: `Sous le scrutin majoritaire à deux tours, un candidat centriste peut obtenir près de 19 % des voix et presque aucun siège (MoDem, 2007). La proportionnelle traduirait les voix en sièges — ses adversaires y voient donc autant un calcul qu'un principe.` },
    },
  ],

  motsAssocies: ['proportionnelle', 'economie-de-marche'],

  continuerAvec: [
    { slug: 'droite' },
    { slug: 'gauche', label: { fr: 'La gauche' }, soon: true },
    { slug: 'president-de-la-republique' },
  ],

  figuresLiees: [
    { nom: 'Robert Schuman', note: { fr: 'démocratie chrétienne, père de la construction européenne — fiche à venir' } },
    { nom: 'Jean Lecanuet', note: { fr: 'centrisme d\'opposition, candidat de 1965 — fiche à venir' } },
    { nom: 'Simone Veil', note: { fr: 'centre-droit, voir aussi la fiche droite — fiche à venir' } },
    { nom: 'François Bayrou', note: { fr: 'fondateur du MoDem — fiche à venir' } },
    { nom: 'Jean-Louis Borloo', note: { fr: 'fondateur de l\'UDI — fiche à venir' } },
  ],

  partisLies: [
    { nom: 'MoDem', note: { fr: 'fiche à venir' } },
    { nom: 'UDI', note: { fr: 'fiche à venir' } },
    { nom: 'Horizons', note: { fr: 'plutôt droite libérale que centre — voir la fiche droite' } },
    { nom: 'Renaissance', note: { fr: 'classement débattu (centre ou centre-droit) — voir la fiche droite' } },
  ],

  sources: [
    { label: `Sylvie Guillaume, Le Centrisme en France aux XIXe et XXe siècles : un échec ?, Maison des sciences de l'homme d'Aquitaine (MSHA), 2005`, year: 2005 },
    { label: `Serge Berstein, Histoire du Parti radical, Presses de Sciences Po, 2 volumes, 1980-1982`, year: 1982 },
    { label: `Conseil constitutionnel — résultats officiels des élections présidentielles (1965, 2002, 2007, 2012) et du référendum du 20 septembre 1992`, url: 'https://www.conseil-constitutionnel.fr', year: 2012 },
    { label: `Vie-publique.fr — fiches « vie politique », « partis politiques », « construction européenne »`, url: 'https://www.vie-publique.fr', year: 2025 },
    { label: `Déclaration de Robert Schuman du 9 mai 1950 — texte intégral sur les sites institutionnels européens`, url: 'https://www.vie-publique.fr', year: 1950 },
  ],
};
