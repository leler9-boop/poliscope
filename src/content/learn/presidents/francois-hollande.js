/**
 * Fiche président « François Hollande » — modèle president en 15 rubriques
 * (docs/jyconnaisrien/02, §5). Mapping niveaux : N1 = portrait 30 s ·
 * N2 = pourquoi élu + en une phrase + 5 dates + 5 mesures ·
 * N3 = programme, mesures, événements, gouverner, bilan, défenseurs, opposants,
 * héritage (ids requis par le script de contrôle) · N4 = pour aller plus loin.
 */

export default {
  slug: 'francois-hollande',
  type: 'president',
  porte: 'D1',
  title: { fr: `François Hollande`, en: 'François Hollande' },
  icon: '🤝',
  difficulty: 2,
  famille: 'dossier',
  updatedAt: '2026-07-12',
  freshness: { type: 'periodic', reviewEveryMonths: 12, lastReviewedAt: '2026-07-12' },

  // ── 1. Portrait en 30 secondes (N1) ─────────────────────────────────────────
  level1: {
    fr: `François Hollande (né en 1954), socialiste, président de 2012 à 2017. Élu face à Nicolas Sarkozy en promettant d'être un « président normal », il gouverne dans un contexte de chômage record et d'attentats majeurs. Son quinquennat — mariage pour tous, tournant social-libéral de 2014, fracture de la gauche, impopularité record — s'achève par une décision unique dans l'histoire de la Ve République : il renonce à se représenter.`,
  },

  // ── N2 : pourquoi élu (2) + en une phrase (12) + 5 dates (13) + 5 mesures (14) ──
  level2: {
    sections: [
      {
        titre: { fr: `Pourquoi a-t-il été élu ?` },
        corps: {
          fr: `En 2012, la France sort de la crise financière de 2008 et de la crise de la zone euro : chômage en hausse, pouvoir d'achat sous pression, austérité en débat partout en Europe. Le président sortant, Nicolas Sarkozy, est très impopulaire et son style clivant a usé une partie de son propre camp. En face, Hollande, longtemps premier secrétaire du PS, incarne le rejet du sortant plus qu'un projet de rupture : il promet d'être un « président normal », de renégocier le traité budgétaire européen et de taxer à 75 % les revenus au-dessus d'un million d'euros. Son discours du Bourget (22 janvier 2012), où il désigne « le monde de la finance » comme son véritable adversaire, marque la campagne. Il l'emporte au second tour, le 6 mai 2012, avec 51,64 % des voix.`,
        },
        sources: [{ label: `Conseil constitutionnel — résultats officiels de l'élection présidentielle de 2012`, url: 'https://www.conseil-constitutionnel.fr', year: 2012 }],
      },
      {
        titre: { fr: `Sa présidence en une phrase` },
        brique: 'a-retenir',
        corps: {
          fr: `Un quinquennat pris en tenaille entre un chômage record, des attentats sans précédent et une gauche qui se fracture sur son tournant pro-entreprises — et qui se termine par un geste inédit sous la Ve République : un président qui renonce de lui-même à se représenter.`,
        },
      },
      {
        titre: { fr: `Sa présidence en cinq dates` },
        brique: 'glossaire',
        termes: [
          { nom: { fr: '6 mai 2012' }, def: { fr: `Victoire face à Nicolas Sarkozy (51,64 %). Deuxième président socialiste de la Ve République, dix-sept ans après le départ de Mitterrand.` } },
          { nom: { fr: '17 mai 2013' }, def: { fr: `Promulgation de la loi ouvrant le mariage aux couples de même sexe, portée par Christiane Taubira — après un long débat parlementaire et de grandes manifestations d'opposition.` } },
          { nom: { fr: 'Janvier 2014' }, def: { fr: `Annonce du pacte de responsabilité (environ 40 milliards d'euros d'allègements pour les entreprises) : le tournant social-libéral du quinquennat, qui fracture la majorité.` } },
          { nom: { fr: '13 novembre 2015' }, def: { fr: `Attentats de Paris et Saint-Denis (130 morts), après ceux de janvier (Charlie Hebdo, Hyper Cacher). État d'urgence déclaré, puis prolongé.` } },
          { nom: { fr: '1er décembre 2016' }, def: { fr: `Impopularité record : Hollande annonce qu'il ne briguera pas de second mandat — une première pour un président sortant de la Ve République.` } },
        ],
      },
      {
        titre: { fr: `Sa présidence en cinq mesures` },
        brique: 'glossaire',
        termes: [
          { nom: { fr: `Mariage pour tous (loi du 17 mai 2013)` }, def: { fr: `Ouverture du mariage et de l'adoption aux couples de même sexe. Très contestée à l'époque, la mesure n'est plus sérieusement remise en cause depuis.` } },
          { nom: { fr: `CICE (2013) puis pacte de responsabilité (2014)` }, def: { fr: `Des dizaines de milliards d'allègements de charges et de crédits d'impôt pour les entreprises — le cœur de la politique économique, et de la fracture avec l'aile gauche du PS.` } },
          { nom: { fr: `Lois transparence et parquet national financier (2013)` }, def: { fr: `Créés après l'affaire Cahuzac : déclarations de patrimoine des élus (HATVP) et parquet spécialisé dans la délinquance financière.` } },
          { nom: { fr: `Accord de Paris sur le climat (COP21, décembre 2015)` }, def: { fr: `Premier accord climatique universel, négocié et signé à Paris sous présidence française — complété par la loi de transition énergétique (2015).` } },
          { nom: { fr: `Loi travail El Khomri (2016)` }, def: { fr: `Assouplissement du droit du travail, adopté par 49.3 face au mouvement Nuit debout et à l'opposition d'une partie de la majorité.` } },
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
          fr: `Le programme de 2012 (les « 60 engagements pour la France ») promet un redressement « dans la justice » : taxe exceptionnelle de 75 % sur la part des revenus dépassant un million d'euros, réforme fiscale, séparation des activités bancaires spéculatives, renégociation du traité budgétaire européen pour y ajouter un volet de croissance, création de 60 000 postes dans l'éducation, emplois d'avenir pour les jeunes, retour à 60 ans du droit à la retraite pour les carrières longues, mariage et adoption pour les couples de même sexe, droit de vote des étrangers aux élections locales (jamais réalisé, faute de majorité constitutionnelle).\n\nLe ton de la campagne est donné au Bourget, le 22 janvier 2012 : « mon véritable adversaire… c'est le monde de la finance ». En pratique, le quinquennat s'écartera vite de cette tonalité : le traité budgétaire est ratifié quasiment en l'état dès l'automne 2012 (complété par un pacte de croissance européen dont la portée est débattue), la taxe à 75 % est censurée puis appliquée sous une forme temporaire, et à partir de 2014 la politique économique devient ouvertement favorable à l'offre et aux entreprises. L'écart entre le discours de 2012 et la politique menée est l'une des clés de la crise de confiance qui suivra.`,
        },
        sources: [{ label: `Les 60 engagements pour la France (2012) — texte disponible via vie-publique.fr ; discours du Bourget, 22 janvier 2012 (INA)`, url: 'https://www.vie-publique.fr', year: 2012 }],
      },
      {
        id: 'mesures',
        titre: { fr: `Les principales mesures, une par une` },
        corps: {
          fr: `Mariage pour tous (loi du 17 mai 2013) : ouverture du mariage et de l'adoption aux couples de même sexe, portée par la garde des Sceaux Christiane Taubira, après 136 heures 46 de débats à l'Assemblée et au Sénat et de très grandes manifestations d'opposition. La mesure la plus durable du quinquennat.\n\nTaxe à 75 % : censurée par le Conseil constitutionnel en décembre 2012, puis appliquée sous une forme temporaire payée par les employeurs (2013-2014) avant de s'éteindre.\n\nCICE (crédit d'impôt pour la compétitivité et l'emploi, 2013) puis pacte de responsabilité (annoncé en janvier 2014, environ 40 milliards d'euros d'allègements) : le virage vers une politique de l'offre, défendu comme nécessaire à la compétitivité, dénoncé à gauche comme un cadeau sans contreparties vérifiées.\n\nLois sur la transparence de la vie publique et création du parquet national financier (2013), en réponse à l'affaire Cahuzac.\n\nLoi de transition énergétique (2015) et accord de Paris sur le climat (COP21, décembre 2015).\n\nLoi Macron (2015) puis loi travail El Khomri (2016), toutes deux adoptées par 49.3 : libéralisation de secteurs d'activité, puis assouplissement du droit du travail. Enfin, le prélèvement à la source de l'impôt sur le revenu est décidé en 2016 (appliqué en 2019).`,
        },
        sources: [
          { label: `Légifrance — loi du 17 mai 2013, lois du 11 octobre 2013 (transparence), loi du 6 août 2015 (Macron), loi du 8 août 2016 (travail)`, url: 'https://www.legifrance.gouv.fr', year: 2016 },
          { label: `Vie-publique.fr — chronologies des réformes 2012-2017`, url: 'https://www.vie-publique.fr', year: 2025 },
        ],
      },
      {
        id: 'evenements',
        titre: { fr: `Les grands événements du mandat` },
        corps: {
          fr: `2013 : intervention militaire au Mali (opération Serval, janvier) contre les groupes djihadistes ; affaire Cahuzac (avril) — le ministre du Budget démissionne pour avoir caché un compte à l'étranger, choc majeur pour un pouvoir élu sur la « République exemplaire » ; adoption du mariage pour tous dans un climat de fortes manifestations ; affaire Léonarda (octobre), où sa proposition télévisée à une collégienne expulsée est critiquée de tous côtés.\n\n2014 : pacte de responsabilité, nomination de Manuel Valls à Matignon, puis démission d'Arnaud Montebourg et de Benoît Hamon (août) — la fracture avec l'aile gauche du PS (les « frondeurs ») est ouverte. Sur le plan personnel, l'affaire Gayet (janvier) et la rupture avec Valérie Trierweiler, suivie de son livre, installent une exposition médiatique inédite de la vie privée présidentielle.\n\n2015 : attentats de janvier (Charlie Hebdo, Hyper Cacher) puis du 13 novembre (Bataclan, Stade de France, terrasses — 130 morts) ; état d'urgence déclaré et prolongé ; COP21 et accord de Paris en décembre.\n\n2016 : abandon en mars du projet de déchéance de nationalité, qui a profondément divisé la gauche ; loi travail au 49.3 et mouvement Nuit debout ; parution en octobre du livre de confidences « Un président ne devrait pas dire ça… » ; renoncement du 1er décembre.`,
        },
        sources: [{ label: `Vie-publique.fr — chronologie du quinquennat 2012-2017 ; INA — archives des événements cités`, url: 'https://www.vie-publique.fr', year: 2025 }],
      },
      {
        id: 'gouverner',
        titre: { fr: `Sa manière de gouverner` },
        corps: {
          fr: `Hollande a voulu rompre avec l'hyperprésidence de son prédécesseur : un « président normal », accessible, qui banalise la fonction. La normalité revendiquée s'est retournée contre lui — épisodes privés médiatisés (le scooter de janvier 2014, les livres de rupture), petites phrases, et surtout les confidences régulières accordées pendant tout le mandat aux journalistes Gérard Davet et Fabrice Lhomme, publiées en octobre 2016 dans « Un président ne devrait pas dire ça… » : des jugements crus sur ses ministres, les magistrats ou les footballeurs, aux dégâts politiques majeurs, y compris chez ses soutiens.\n\nSa méthode : la synthèse. Formé à diriger un PS divisé, il tranche tard, cherche l'équilibre entre les ailes de sa majorité, et assume rarement frontalement ses tournants — le virage pro-entreprises de 2014 n'a jamais été présenté comme tel. Ses adversaires y voient de l'indécision, ses défenseurs un art du compromis dans un pays fracturé. Trois Premiers ministres se succèdent : Jean-Marc Ayrault (2012-2014), Manuel Valls (2014-2016), Bernard Cazeneuve (2016-2017). Face aux frondeurs qui privent le gouvernement de majorité fiable, l'exécutif recourt plusieurs fois au 49.3 (loi Macron, loi travail) — un aveu de faiblesse parlementaire autant qu'un outil d'autorité. Après les attentats, en revanche, sa posture de chef de l'État protecteur est, sur le moment, largement saluée.`,
        },
        sources: [{ label: `Gérard Davet et Fabrice Lhomme, Un président ne devrait pas dire ça…, Stock, 2016`, year: 2016 }],
      },
      {
        id: 'bilan',
        titre: { fr: `Le bilan économique et social — en distinguant ce qui lui revient` },
        corps: {
          fr: `Évolutions constatées : le chômage, déjà élevé en 2012, continue de monter jusqu'à un pic d'environ 10,5 % en 2015, avant d'amorcer une baisse fin 2016 — l'« inversion de la courbe », promise pour fin 2013, arrive donc, mais tardivement, et les économistes débattent de sa cause (CICE et pacte de responsabilité, reprise européenne, ou les deux). La croissance reste faible sur l'ensemble du quinquennat. Le déficit public est ramené sous 3,5 % du PIB en fin de mandat, au prix d'une hausse des prélèvements en début de quinquennat puis d'économies.\n\nCe qui relève de ses choix : la forte hausse d'impôts de 2012-2013 (le « ras-le-bol fiscal » entre dans le vocabulaire par la voix de son propre ministre des Finances), puis le tournant de l'offre de 2014 — des dizaines de milliards vers les entreprises, assumés comme un pari sur l'investissement et l'embauche, dont les contreparties en emplois restent discutées. Ce qui relève du contexte : une zone euro en crise jusqu'en 2013, une demande européenne atone, des règles budgétaires contraignantes, et le coût économique et sécuritaire des attentats de 2015-2016. Comme pour ses prédécesseurs, les lectures « tout est de sa faute » et « il n'y pouvait rien » sont l'une et l'autre indéfendables.`,
        },
        sources: [
          { label: `INSEE — taux de chômage au sens du BIT, séries trimestrielles 2012-2017 (pic à environ 10,5 % en 2015, décrue à partir de fin 2016)`, url: 'https://www.insee.fr', year: 2017, perimetre: `France hors Mayotte, définition BIT` },
        ],
      },
      {
        id: 'defenseurs',
        titre: { fr: `Ce que ses défenseurs retiennent` },
        corps: {
          fr: `Le réformateur de société : le mariage pour tous, tenu malgré des manifestations massives, est devenu un acquis que presque plus personne ne conteste. Le chef de l'État dans l'épreuve : la gestion des attentats de 2015, l'unité nationale, les interventions extérieures (le Mali en 2013, saluées alors bien au-delà de son camp). Le président de l'accord de Paris : la COP21 est présentée comme un succès diplomatique français majeur. Le courage économique : avoir engagé, contre son propre camp, une politique pro-entreprises jugée nécessaire, dont la baisse du chômage fin 2016 et le redressement des comptes seraient les premiers fruits — récoltés, disent ses défenseurs, par son successeur. L'exemplarité institutionnelle : les lois transparence et le parquet national financier après Cahuzac, et un renoncement de 2016 lu comme un acte de lucidité rare chez un président.`,
        },
      },
      {
        id: 'opposants',
        titre: { fr: `Ce que ses opposants retiennent` },
        corps: {
          fr: `À droite : le « matraquage fiscal » de 2012-2013, un chômage laissé à des niveaux records pendant l'essentiel du mandat, une autorité jugée défaillante — sur les frondeurs comme sur l'ordre public — et des promesses de 2012 non tenues, à commencer par la renégociation du traité budgétaire européen, ratifié presque en l'état.\n\nÀ gauche de la gauche : la trahison du discours du Bourget — le CICE et le pacte de responsabilité comme cadeaux au patronat sans contreparties, la loi travail imposée au 49.3 contre la rue et une partie de sa majorité, et le projet de déchéance de nationalité, vécu comme un reniement moral qui a déchiré la gauche pour rien, puisqu'il fut abandonné.\n\nEt une critique transversale, au-delà des camps : l'indécision érigée en méthode, la parole présidentielle abîmée — par les petites phrases, les épisodes privés, et surtout le livre de confidences de 2016, jugé incompréhensible venant d'un président en exercice. L'impopularité record (cote sous 15 % fin 2016) nourrit l'image d'un quinquennat empêché.`,
        },
      },
      {
        id: 'heritage',
        titre: { fr: `Son héritage aujourd'hui` },
        corps: {
          fr: `Politique : le quinquennat Hollande précède directement la recomposition de 2017. Emmanuel Macron, son ministre de l'Économie, part fonder son propre mouvement ; le PS, déchiré entre frondeurs et sociaux-libéraux, s'effondre à la présidentielle suivante. Une partie de la politique menée après 2017 (transformation du CICE en baisses de charges, réforme du droit du travail par ordonnances) prolonge des chantiers ouverts sous son mandat.\n\nJuridique et institutionnel : le mariage pour tous est entré dans les mœurs ; la HATVP et le parquet national financier sont devenus des institutions durables de la vie publique ; plusieurs outils de l'état d'urgence de 2015 ont ensuite été transposés dans le droit commun — un héritage sécuritaire toujours débattu entre impératif de protection et libertés publiques.\n\nInternational : l'accord de Paris (2015) reste le cadre de référence de la diplomatie climatique mondiale, et les opérations extérieures engagées (Mali, puis Sahel) ont pesé sur la politique africaine de la France pendant une décennie.\n\nMémoire : longtemps symbole d'impopularité, Hollande a entamé après l'Élysée une réhabilitation progressive — livres, interventions publiques, puis retour surprise à l'Assemblée nationale comme député de Corrèze en 2024. Le débat sur son bilan — social-démocratie assumée ou renoncement — reste, au fond, la continuation du débat ouvert en 1983.`,
        },
      },
    ],
  },

  // ── Chronologie ──────────────────────────────────────────────────────────────
  chronologie: {
    titre: { fr: `2012-2017 : le quinquennat` },
    events: [
      { date: '6 mai 2012', titre: { fr: `L'élection` }, detail: { fr: `Hollande bat Nicolas Sarkozy (51,64 %). Deuxième alternance à gauche de la Ve République ; les législatives de juin donnent une majorité absolue au PS et à ses alliés. Jean-Marc Ayrault est nommé à Matignon.` }, source: { label: `Conseil constitutionnel — résultats 2012`, year: 2012 } },
      { date: 'janvier 2013', titre: { fr: `Le Mali` }, detail: { fr: `Opération Serval : l'armée française intervient au Mali pour stopper la progression des groupes djihadistes vers Bamako. Décision saluée alors très au-delà de son camp.` } },
      { date: 'avril 2013', titre: { fr: `L'affaire Cahuzac` }, detail: { fr: `Le ministre du Budget, chargé de la lutte contre la fraude, avoue un compte caché à l'étranger et démissionne. En réponse : lois sur la transparence de la vie publique et création du parquet national financier.` } },
      { date: '17 mai 2013', titre: { fr: `Le mariage pour tous` }, detail: { fr: `Promulgation de la loi ouvrant le mariage et l'adoption aux couples de même sexe, portée par Christiane Taubira, après un long débat parlementaire et de grandes manifestations d'opposition.` }, source: { label: `Légifrance — loi n° 2013-404 du 17 mai 2013`, year: 2013 } },
      { date: 'janvier-août 2014', titre: { fr: `Le tournant social-libéral` }, detail: { fr: `Pacte de responsabilité (environ 40 milliards d'allègements pour les entreprises), nomination de Manuel Valls, puis départ d'Arnaud Montebourg et de Benoît Hamon : la fracture avec l'aile gauche du PS — les « frondeurs » — est consommée.` } },
      { date: '7-9 janvier 2015', titre: { fr: `Charlie Hebdo et l'Hyper Cacher` }, detail: { fr: `Attentats contre la rédaction de Charlie Hebdo, une policière et un supermarché casher. Marches du 11 janvier dans toute la France, avec de nombreux chefs d'État et de gouvernement à Paris.` } },
      { date: '13 novembre 2015', titre: { fr: `Les attentats de Paris` }, detail: { fr: `Attaques coordonnées au Bataclan, au Stade de France et sur des terrasses parisiennes : 130 morts. État d'urgence déclaré, puis prolongé à plusieurs reprises.` } },
      { date: 'décembre 2015', titre: { fr: `La COP21` }, detail: { fr: `Adoption à Paris de l'accord sur le climat, premier accord universel visant à limiter le réchauffement — aboutissement d'une année de diplomatie française, quelques semaines après les attentats.` }, source: { label: `Vie-publique.fr — l'accord de Paris (COP21, décembre 2015)`, year: 2015 } },
      { date: '2016', titre: { fr: `Loi travail et Nuit debout` }, detail: { fr: `Abandon en mars du projet de déchéance de nationalité qui a divisé la gauche ; loi travail El Khomri adoptée par 49.3 face au mouvement Nuit debout ; en octobre, le livre de confidences « Un président ne devrait pas dire ça… » achève d'affaiblir le président.` } },
      { date: '1er décembre 2016', titre: { fr: `Le renoncement` }, detail: { fr: `Avec une cote de popularité tombée sous 15 %, Hollande annonce qu'il ne se représentera pas — une première pour un président sortant de la Ve République. Il quitte l'Élysée en mai 2017 ; il redeviendra député de Corrèze en 2024.` } },
    ],
  },

  vraiFaux: ['vf-hollande-entreprises', 'vf-hollande-courbe-chomage', 'vf-hollande-mariage-sans-debat', 'vf-hollande-renoncement'],

  quiz: [
    {
      question: { fr: `Pourquoi le 1er décembre 2016 est-il une date singulière de la Ve République ?` },
      options: [
        { fr: `Hollande annonce qu'il ne se représentera pas — aucun président sortant ne l'avait fait avant lui` },
        { fr: `Hollande dissout l'Assemblée nationale` },
        { fr: `Hollande est renversé par une motion de censure` },
        { fr: `Hollande démissionne de la présidence` },
      ],
      bonneReponse: 0,
      explication: { fr: `Il ne démissionne pas et va au bout de son mandat (mai 2017), mais renonce à briguer un second mandat — un geste sans précédent pour un président sortant de la Ve République, sur fond d'impopularité record (cote sous 15 % fin 2016).` },
    },
    {
      question: { fr: `Que sont le CICE (2013) et le pacte de responsabilité (2014) ?` },
      options: [
        { fr: `Des hausses d'impôts sur les entreprises` },
        { fr: `Des allègements massifs de charges et crédits d'impôt en faveur des entreprises` },
        { fr: `Des programmes de nationalisations` },
        { fr: `Des plans d'embauche de fonctionnaires` },
      ],
      bonneReponse: 1,
      explication: { fr: `Des dizaines de milliards d'euros orientés vers les entreprises pour restaurer leur compétitivité — le cœur du tournant social-libéral de 2014, et la principale cause de la rupture avec l'aile gauche du PS, les « frondeurs ».` },
    },
    {
      question: { fr: `Comment la loi travail El Khomri a-t-elle été adoptée en 2016 ?` },
      options: [
        { fr: `Par référendum` },
        { fr: `À la quasi-unanimité du Parlement` },
        { fr: `Par l'article 49.3, sans vote de l'Assemblée, face au mouvement Nuit debout` },
        { fr: `Elle n'a jamais été adoptée` },
      ],
      bonneReponse: 2,
      explication: { fr: `Privé de majorité fiable par les frondeurs, le gouvernement Valls engage sa responsabilité (article 49.3) pour faire passer le texte, comme déjà pour la loi Macron en 2015. La contestation sociale (Nuit debout, manifestations) n'empêche pas l'adoption.` },
    },
    {
      question: { fr: `Qui a porté la loi du 17 mai 2013 ouvrant le mariage aux couples de même sexe ?` },
      options: [
        { fr: `Manuel Valls` },
        { fr: `Christiane Taubira, garde des Sceaux` },
        { fr: `Jean-Marc Ayrault` },
        { fr: `Najat Vallaud-Belkacem` },
      ],
      bonneReponse: 1,
      explication: { fr: `La ministre de la Justice Christiane Taubira a défendu le texte pendant 136 heures 46 de débats à l'Assemblée et au Sénat, dans un climat de très grandes manifestations pour et contre. La loi est promulguée le 17 mai 2013.` },
    },
    {
      question: { fr: `Qu'est devenue la taxe à 75 % sur les très hauts revenus promise en 2012 ?` },
      options: [
        { fr: `Elle est toujours en vigueur` },
        { fr: `Elle a été censurée fin 2012, puis appliquée sous une forme temporaire payée par les employeurs (2013-2014)` },
        { fr: `Elle n'a jamais été présentée au Parlement` },
        { fr: `Elle a été étendue à tous les revenus` },
      ],
      bonneReponse: 1,
      explication: { fr: `Le Conseil constitutionnel censure la première version en décembre 2012. Une contribution temporaire, acquittée par les entreprises sur les rémunérations dépassant un million d'euros, s'applique en 2013 et 2014 avant de s'éteindre.` },
    },
  ],

  // ── 15. Pour aller plus loin (N4) ────────────────────────────────────────────
  level4: {
    items: [
      { kind: 'discours', titre: { fr: `Discours du Bourget — 22 janvier 2012 (INA)` }, note: { fr: `« Mon véritable adversaire… c'est le monde de la finance. » Le discours fondateur de la campagne de 2012 — à relire à la lumière du quinquennat.` }, url: 'https://www.ina.fr' },
      { kind: 'discours', titre: { fr: `Allocution du 1er décembre 2016 — le renoncement (INA)` }, note: { fr: `Le moment sans précédent où un président sortant de la Ve République annonce qu'il ne se représentera pas.` }, url: 'https://www.ina.fr' },
      { kind: 'discours', titre: { fr: `Discours devant le Congrès à Versailles — 16 novembre 2015` }, note: { fr: `Trois jours après les attentats du 13 novembre : la réponse de l'État, l'état d'urgence, et le projet — finalement abandonné — de déchéance de nationalité.` }, url: 'https://www.vie-publique.fr' },
      { kind: 'texte', titre: { fr: `Les 60 engagements pour la France (2012)` }, note: { fr: `Le programme de campagne, à comparer point par point avec la politique menée.` }, url: 'https://www.vie-publique.fr' },
      { kind: 'donnees', titre: { fr: `INSEE — taux de chômage trimestriel 2012-2017` }, note: { fr: `Pour vérifier soi-même le pic de 2015 et la décrue de fin de mandat — et se faire une idée sur l'« inversion de la courbe ».` }, url: 'https://www.insee.fr' },
      { kind: 'biblio', titre: { fr: `Gérard Davet et Fabrice Lhomme, Un président ne devrait pas dire ça… — Stock, 2016` }, note: { fr: `Les confidences accordées pendant tout le mandat : un document exceptionnel sur l'exercice du pouvoir, et un événement politique en soi.` } },
      { kind: 'lien', titre: { fr: `Vie-publique.fr — dossier « le quinquennat de François Hollande »` }, note: { fr: `Chronologies, textes de loi et bilans institutionnels du mandat.` }, url: 'https://www.vie-publique.fr' },
    ],
  },

  figuresLiees: [
    { nom: 'Manuel Valls', note: { fr: `Premier ministre 2014-2016, visage du tournant social-libéral — fiche à venir` } },
    { nom: 'Christiane Taubira', note: { fr: `garde des Sceaux, mariage pour tous — fiche à venir` } },
    { nom: 'Emmanuel Macron', note: { fr: `ministre de l'Économie devenu successeur — fiche à venir` } },
    { nom: 'Nicolas Sarkozy', note: { fr: `l'adversaire battu de 2012 — fiche à venir` } },
    { nom: 'Jean-Marc Ayrault', note: { fr: `premier Premier ministre du quinquennat (2012-2014) — fiche à venir` } },
  ],

  motsAssocies: ['49-3', 'motion-de-censure', 'dette-publique'],
  continuerAvec: [
    { slug: 'francois-mitterrand' },
    { slug: 'president-de-la-republique' },
    { slug: 'nicolas-sarkozy' },
  ],

  sources: [
    { label: `Conseil constitutionnel — résultats officiels de la présidentielle de 2012 ; décision de décembre 2012 sur la taxe à 75 %`, url: 'https://www.conseil-constitutionnel.fr', year: 2012 },
    { label: `Légifrance — textes des lois citées (2013-2016)`, url: 'https://www.legifrance.gouv.fr', year: 2016 },
    { label: `INSEE — taux de chômage au sens du BIT, séries 2012-2017`, url: 'https://www.insee.fr', year: 2017, perimetre: `France hors Mayotte, définition BIT` },
    { label: `Vie-publique.fr — dossiers et chronologies du quinquennat 2012-2017`, url: 'https://www.vie-publique.fr', year: 2025 },
    { label: `Gérard Davet et Fabrice Lhomme, Un président ne devrait pas dire ça…, Stock, 2016`, year: 2016 },
  ],
};
