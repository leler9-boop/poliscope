/**
 * Fiche président « Nicolas Sarkozy » — modèle president en 15 rubriques
 * (docs/jyconnaisrien/02, §5). Mapping niveaux : N1 = portrait 30 s ·
 * N2 = pourquoi élu + en une phrase + 5 dates + 5 mesures ·
 * N3 = programme, mesures, événements, gouverner, bilan, défenseurs, opposants,
 * héritage (ids requis par le script de contrôle) · N4 = pour aller plus loin.
 *
 * ⚠️ Volet judiciaire : chaque affaire est présentée avec la décision, sa date
 * et l'état de la procédure (définitive / appel en cours). Rien de postérieur à 2025.
 */

export default {
  slug: 'nicolas-sarkozy',
  type: 'president',
  porte: 'D1',
  title: { fr: `Nicolas Sarkozy`, en: 'Nicolas Sarkozy' },
  icon: '⚡',
  difficulty: 2,
  famille: 'dossier',
  updatedAt: '2026-07-12',
  freshness: { type: 'periodic', reviewEveryMonths: 12, lastReviewedAt: '2026-07-12' },

  // ── 1. Portrait en 30 secondes (N1) ─────────────────────────────────────────
  level1: {
    fr: `Nicolas Sarkozy (né en 1955), président de 2007 à 2012. Élu sur la promesse de « rupture » et le slogan « travailler plus pour gagner plus », il enchaîne les réformes avant que la crise financière de 2008 ne percute son quinquennat. Style hyperactif et clivant, rôle international marqué, réforme des retraites contestée — puis une défaite en 2012 face à François Hollande, et de lourdes affaires judiciaires après le mandat.`,
  },

  // ── N2 : pourquoi élu (2) + en une phrase (12) + 5 dates (13) + 5 mesures (14) ──
  level2: {
    sections: [
      {
        titre: { fr: `Pourquoi a-t-il été élu ?` },
        corps: {
          fr: `En 2007, Jacques Chirac achève un second mandat marqué par l'usure et l'échec du référendum européen de 2005. Sarkozy, ministre de l'Intérieur puis des Finances sous Chirac, s'est rendu omniprésent sur les thèmes de la sécurité, de l'immigration et du pouvoir d'achat. Il promet la « rupture » — y compris avec le bilan de son propre camp — et résume son projet en un slogan : « travailler plus pour gagner plus ». Face à lui, la socialiste Ségolène Royal peine à convaincre sur sa crédibilité présidentielle. Dans un scrutin très mobilisateur (près de 84 % de participation au second tour), il l'emporte le 6 mai 2007 avec 53,06 % des voix.`,
        },
        sources: [{ label: `Conseil constitutionnel — résultats officiels de l'élection présidentielle de 2007`, url: 'https://www.conseil-constitutionnel.fr', year: 2007 }],
      },
      {
        titre: { fr: `Sa présidence en une phrase` },
        brique: 'a-retenir',
        corps: {
          fr: `Le président de la « rupture », élu pour libérer le travail et réformer la France, dont le quinquennat a été percuté dès la deuxième année par la plus grave crise financière mondiale depuis 1929 — et qui reste jugé sur deux registres inséparables : sa gestion de crise, souvent saluée, et son style clivant, qui a durablement divisé.`,
        },
      },
      {
        titre: { fr: `Sa présidence en cinq dates` },
        brique: 'glossaire',
        termes: [
          { nom: { fr: '6 mai 2007' }, def: { fr: `Élection face à Ségolène Royal (53,06 %). François Fillon devient Premier ministre — il le restera cinq ans, cas unique sous la Ve République récente.` } },
          { nom: { fr: '23 juillet 2008' }, def: { fr: `Révision constitutionnelle adoptée à une voix près : limitation à deux mandats consécutifs, création de la question prioritaire de constitutionnalité (QPC), encadrement du 49.3.` } },
          { nom: { fr: 'Automne 2008' }, def: { fr: `Crise financière mondiale : plans de sauvetage des banques, discours de Toulon sur la « refondation du capitalisme » (25 septembre), présidence française de l'UE.` } },
          { nom: { fr: '9 novembre 2010' }, def: { fr: `Promulgation de la réforme des retraites : l'âge légal passe de 60 à 62 ans, après des semaines de très grandes manifestations.` } },
          { nom: { fr: '6 mai 2012' }, def: { fr: `Défaite au second tour face à François Hollande (48,36 %). Premier président sortant battu depuis Giscard d'Estaing en 1981.` } },
        ],
      },
      {
        titre: { fr: `Sa présidence en cinq mesures` },
        brique: 'glossaire',
        termes: [
          { nom: { fr: `Loi TEPA, le « paquet fiscal » (2007)` }, def: { fr: `Défiscalisation des heures supplémentaires, bouclier fiscal à 50 %, allègement des droits de succession. Emblème du quinquennat — largement détricoté après 2012.` } },
          { nom: { fr: `Autonomie des universités — loi LRU (2007)` }, def: { fr: `Les universités gèrent leur budget et leurs recrutements. Contestée à sa naissance, jamais abrogée depuis.` } },
          { nom: { fr: `Révision constitutionnelle (2008)` }, def: { fr: `La QPC permet à tout justiciable de contester une loi devant le Conseil constitutionnel : l'apport institutionnel le plus durable du mandat.` } },
          { nom: { fr: `RSA (2008)` }, def: { fr: `Le revenu de solidarité active, porté par Martin Hirsch, remplace le RMI pour encourager la reprise d'activité. Toujours en vigueur.` } },
          { nom: { fr: `Retraites : 60 → 62 ans (2010)` }, def: { fr: `Report de l'âge légal, avec maintien de départs anticipés pour carrières longues. L'âge sera porté à 64 ans en 2023.` } },
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
          fr: `Le projet de 2007 tient dans deux mots d'ordre : la « rupture » — avec l'immobilisme supposé des années Chirac, dont il fut pourtant ministre — et « travailler plus pour gagner plus ». Concrètement : réhabiliter la « valeur travail » (défiscalisation des heures supplémentaires, conditionner davantage les minima sociaux à la reprise d'activité), baisser les impôts (bouclier fiscal, droits de succession), durcir la politique pénale (peines planchers pour les récidivistes) et migratoire (« immigration choisie »), réformer l'État (non-remplacement d'un fonctionnaire partant à la retraite sur deux), garantir un service minimum dans les transports en cas de grève, et rendre les universités autonomes.\n\nEn politique étrangère, il promet une France plus atlantiste et plus active en Europe, assumant la rupture avec certaines prudences gaullo-chiraquiennes. Le programme est cohérent avec une droite décomplexée sur l'économie et la sécurité — mais il repose sur une hypothèse de croissance que la crise de 2008 pulvérisera dès la deuxième année : une grande partie du quinquennat consistera à gouverner à rebours du programme, en pompier de l'économie mondiale plutôt qu'en libérateur des énergies.`,
        },
        sources: [{ label: `Programme et professions de foi de la campagne 2007 — archives électorales ; Vie-publique.fr, dossier sur l'élection présidentielle de 2007`, url: 'https://www.vie-publique.fr', year: 2007 }],
      },
      {
        id: 'mesures',
        titre: { fr: `Les principales mesures, une par une` },
        corps: {
          fr: `Loi TEPA (21 août 2007) : heures supplémentaires défiscalisées, bouclier fiscal plafonnant l'impôt à 50 % des revenus, allègement des droits de succession. Défendue comme un choc de pouvoir d'achat, critiquée comme un cadeau aux plus aisés et une perte de recettes à la veille de la crise ; l'essentiel sera supprimé après 2012.\n\nLoi LRU (10 août 2007) : autonomie budgétaire des universités. Contestée par de longues grèves étudiantes, conservée par tous les gouvernements suivants.\n\nPeines planchers pour récidivistes (2007) et service minimum dans les transports (2007) : le volet régalien et social de la rentrée 2007 ; les peines planchers seront supprimées en 2014.\n\nRévision constitutionnelle (23 juillet 2008) : limite de deux mandats consécutifs, encadrement du 49.3, et surtout la QPC, qui permet depuis 2010 à tout justiciable de contester une loi en vigueur.\n\nRSA (1er décembre 2008) : remplace le RMI, avec un cumul possible entre allocation et revenus d'activité.\n\nRGPP et suppression de la taxe professionnelle (2009-2010) : réduction des effectifs publics (un départ sur deux non remplacé) et allègement de la fiscalité des entreprises, compensé pour les collectivités.\n\nRéforme des retraites (9 novembre 2010) : âge légal reporté de 60 à 62 ans, départs anticipés pour carrières longues maintenus. Enfin, le « grand emprunt » (2010) finance les « investissements d'avenir » : recherche, universités, numérique.`,
        },
        sources: [
          { label: `Légifrance — lois du 10 août 2007 (LRU), 21 août 2007 (TEPA), 23 juillet 2008 (révision constitutionnelle), 1er décembre 2008 (RSA), 9 novembre 2010 (retraites)`, url: 'https://www.legifrance.gouv.fr', year: 2010 },
          { label: `Vie-publique.fr — chronologies des réformes 2007-2012`, url: 'https://www.vie-publique.fr', year: 2025 },
        ],
      },
      {
        id: 'evenements',
        titre: { fr: `Les grands événements du mandat` },
        corps: {
          fr: `2007 : rentrée réformatrice (TEPA, LRU) et « ouverture » — des personnalités venues de la gauche entrent au gouvernement, dont Bernard Kouchner aux Affaires étrangères. 2008 : la crise financière mondiale éclate à l'automne ; plans de sauvetage des banques, discours de Toulon (25 septembre) appelant à une « refondation du capitalisme ». La même année, la présidence française de l'UE place Sarkozy en médiateur de la guerre entre la Russie et la Géorgie (août 2008), et la révision constitutionnelle passe à une voix près. 2009 : retour de la France dans le commandement intégré de l'OTAN, quitté par de Gaulle en 1966 ; la taxe carbone est censurée par le Conseil constitutionnel. 2010 : le discours de Grenoble (30 juillet), liant sécurité et immigration, provoque une vive controverse, y compris à droite ; la réforme des retraites déclenche de très grandes manifestations ; l'affaire Woerth-Bettencourt fragilise le gouvernement, remanié en novembre. 2011 : intervention militaire en Libye avec le Royaume-Uni, sous couvert de la résolution 1973 de l'ONU ; la crise de la dette de la zone euro fait du duo « Merkozy » (avec Angela Merkel) le centre de gravité européen. Janvier 2012 : la France perd son triple A auprès de l'agence Standard & Poor's. 6 mai 2012 : défaite face à François Hollande.`,
        },
        sources: [{ label: `Vie-publique.fr — chronologie du quinquennat 2007-2012 ; INA — archives des discours de Toulon (2008) et de Grenoble (2010) ; ONU — résolution 1973 (2011)`, url: 'https://www.vie-publique.fr', year: 2025 }],
      },
      {
        id: 'gouverner',
        titre: { fr: `Sa manière de gouverner` },
        corps: {
          fr: `Le mot qui s'impose dès 2007 est « hyperprésidence » : un chef de l'État omniprésent, qui annonce lui-même les réformes, court les plateaux et les sommets, et concentre la décision à l'Élysée. François Fillon, unique Premier ministre du quinquennat (2007-2012), est publiquement qualifié de « collaborateur » par le président — formule authentique et restée célèbre, qui dit le déséquilibre assumé du couple exécutif. La méthode a son efficacité, surtout en temps de crise : décisions rapides, activisme diplomatique. Elle a aussi son revers : personnalisation extrême, usure de l'opinion, et confusion entre la fonction présidentielle et la personne.\n\nCar le style a compté autant que la politique : la soirée au Fouquet's le soir de la victoire, les vacances sur le yacht de l'homme d'affaires Vincent Bolloré, le divorce puis le remariage avec Carla Bruni exposés médiatiquement, et l'altercation du Salon de l'agriculture 2008 — le « casse-toi pauv' con » lancé à un visiteur, citation authentique et abondamment documentée — ont installé l'image d'un président « bling-bling » rompant avec la distance traditionnelle de la fonction. Ses partisans y voyaient une modernité assumée ; ses adversaires, une désacralisation durable de la présidence. Le débat sur la « présidence normale » de 2012 naîtra en réaction directe à ce style.`,
        },
        sources: [{ label: `INA — archives audiovisuelles du quinquennat (Salon de l'agriculture 2008, interventions présidentielles) ; presse de référence, 2007-2012`, url: 'https://www.ina.fr', year: 2012 }],
      },
      {
        id: 'bilan',
        titre: { fr: `Le bilan économique et social — en distinguant ce qui lui revient` },
        corps: {
          fr: `Évolutions constatées : le chômage, autour de 7,5 % début 2008, atteint environ 10 % en 2012. La dette publique bondit d'environ 64 % du PIB fin 2007 à environ 90 % fin 2012. Le pouvoir d'achat, promesse centrale de 2007, stagne à partir de 2008.\n\nCe qui relève du contexte : la crise financière de 2008 puis la crise de la zone euro sont des chocs mondiaux, subis par tous les pays comparables — l'Espagne ou le Royaume-Uni connaissent des dégradations bien pires sur certains indicateurs. L'essentiel de la hausse du chômage et une grande partie de celle de la dette s'expliquent par la récession de 2009 (environ -2,9 % de PIB) et les plans de soutien.\n\nCe qui relève de ses choix : les baisses d'impôts de 2007 (loi TEPA) ont réduit les recettes juste avant la crise — la Cour des comptes a souligné que le déficit français était déjà structurellement dégradé avant 2008, ce qui a amputé les marges de manœuvre. À l'inverse, la gestion de crise elle-même (sauvetage bancaire sans faillite, plan de relance, soutien du G20) est créditée d'avoir évité le pire, et la réforme des retraites de 2010 a réduit les dépenses futures. Les deux lectures extrêmes — « tout est la faute de la crise » ou « tout est la faute de ses choix » — sont l'une et l'autre indéfendables.`,
        },
        sources: [
          { label: `INSEE — taux de chômage au sens du BIT (≈ 7,5 % début 2008 ; ≈ 10 % en 2012) et dette publique au sens de Maastricht (≈ 64 % du PIB fin 2007 ; ≈ 90 % fin 2012)`, url: 'https://www.insee.fr', year: 2012, perimetre: `France ; définitions BIT et Maastricht — comparer avec prudence aux chiffres administratifs de demandeurs d'emploi` },
          { label: `Cour des comptes — rapports sur la situation et les perspectives des finances publiques, 2009-2012`, url: 'https://www.ccomptes.fr', year: 2012 },
        ],
      },
      {
        id: 'defenseurs',
        titre: { fr: `Ce que ses défenseurs retiennent` },
        corps: {
          fr: `Le capitaine dans la tempête : face à la crise de 2008, des décisions rapides — garantie des banques sans faillite majeure en France, plan de relance, activisme au G20 pour une réponse coordonnée — et le discours de Toulon assumant de « refonder le capitalisme ». Un leadership international réel : médiation dans la guerre Russie-Géorgie pendant la présidence française de l'UE, intervention en Libye votée à l'ONU, duo moteur avec Angela Merkel dans la crise de l'euro.\n\nUn réformateur qui a affronté les conservatismes : l'autonomie des universités et le report de l'âge de la retraite, très contestés sur le moment, n'ont été abrogés par aucun successeur — signe, disent ses défenseurs, qu'il avait raison trop tôt. S'y ajoutent le RSA, le service minimum, le grand emprunt pour la recherche, et une modernisation institutionnelle sous-estimée : la QPC a donné aux citoyens un droit nouveau face à la loi. Enfin, l'énergie elle-même : un président qui décide, assume et paie le prix de l'impopularité plutôt que de gérer le déclin.`,
        },
      },
      {
        id: 'opposants',
        titre: { fr: `Ce que ses opposants retiennent` },
        corps: {
          fr: `À gauche : le « président des riches » — le bouclier fiscal et le paquet fiscal de 2007 comme cadeaux aux plus aisés au moment même où la crise frappait les plus modestes, le Fouquet's et le yacht comme symboles ; la RGPP vécue comme une saignée des services publics (hôpital, école) ; la réforme des retraites passée malgré des manifestations massives ; et le discours de Grenoble de 2010, jugé stigmatisant envers les étrangers et les Roms — critiqué jusque dans son propre camp.\n\nÀ droite et au centre, les critiques portent ailleurs : promesses de pouvoir d'achat non tenues, dette envolée, style jugé agité et clivant qui aurait abîmé la fonction présidentielle et, in fine, coûté la réélection. Certains gaullistes n'ont pas pardonné le retour dans le commandement intégré de l'OTAN.\n\nS'y est ajouté après le mandat le poids des affaires judiciaires — condamnations définitives dans les affaires dites « Bismuth » et Bygmalion, procès du financement libyen en cours d'appel — que ses opposants lisent comme la confirmation d'un rapport problématique à l'argent et au pouvoir, et ses défenseurs comme un acharnement. Les décisions de justice, elles, sont datées et publiques (voir « Son héritage aujourd'hui »).`,
        },
      },
      {
        id: 'heritage',
        titre: { fr: `Son héritage aujourd'hui` },
        corps: {
          fr: `Institutionnel : la QPC est devenue un pilier du droit français ; la limite de deux mandats consécutifs et l'encadrement du 49.3 datent de sa révision de 2008. Politique : son quinquennat a durablement déplacé la droite sur les questions d'identité et de sécurité — le discours de Grenoble reste un marqueur de ce déplacement, revendiqué par les uns, dénoncé par les autres. Économique et social : l'autonomie des universités, le RSA et l'âge légal à 62 ans (porté à 64 en 2023) ont survécu à l'alternance ; le bouclier fiscal et la défiscalisation TEPA, non. Style : l'« hyperprésidence » a redéfini — en positif comme en repoussoir — le rapport des présidents suivants à la communication.\n\nAprès le mandat : battu à la primaire de la droite en 2016, il quitte la compétition électorale mais reste influent à droite. Sur le plan judiciaire, à fin 2025 : condamnation définitive dans l'affaire des écoutes dite « Bismuth » (corruption et trafic d'influence — Cour de cassation, décembre 2024, peine aménagée sous bracelet électronique début 2025) ; condamnation définitive dans l'affaire Bygmalion (financement illégal de la campagne de 2012) ; et condamnation en première instance, en septembre 2025, dans l'affaire du financement libyen (association de malfaiteurs) — il a été incarcéré puis libéré sous contrôle judiciaire dans l'attente de son procès en appel, et bénéficie de la présomption d'innocence pour les faits qu'il conteste en appel.`,
        },
        sources: [
          { label: `Cour de cassation — arrêt de décembre 2024, affaire des écoutes dite « Bismuth » (condamnation définitive) ; décisions définitives dans l'affaire Bygmalion`, url: 'https://www.courdecassation.fr', year: 2024 },
          { label: `Tribunal correctionnel de Paris — jugement de première instance de septembre 2025, affaire du financement libyen (appel en cours à la date de vérification de cette fiche)`, year: 2025 },
        ],
      },
    ],
  },

  // ── Chronologie ──────────────────────────────────────────────────────────────
  chronologie: {
    titre: { fr: `2007-2012 : le quinquennat de la rupture et de la crise` },
    events: [
      { date: '6 mai 2007', titre: { fr: `L'élection` }, detail: { fr: `Sarkozy bat Ségolène Royal avec 53,06 % des voix, sur la promesse de « rupture ». François Fillon est nommé à Matignon — il y restera cinq ans.` }, source: { label: `Conseil constitutionnel — résultats 2007`, year: 2007 } },
      { date: 'été 2007', titre: { fr: `La rentrée réformatrice` }, detail: { fr: `Loi TEPA (heures supplémentaires défiscalisées, bouclier fiscal), autonomie des universités (LRU), peines planchers, service minimum — et « ouverture » à des ministres venus de la gauche, dont Bernard Kouchner.` } },
      { date: '23 juillet 2008', titre: { fr: `La révision constitutionnelle` }, detail: { fr: `Adoptée à une voix près par le Congrès : deux mandats consécutifs maximum, encadrement du 49.3, création de la question prioritaire de constitutionnalité (QPC).` }, source: { label: `Légifrance — loi constitutionnelle du 23 juillet 2008`, year: 2008 } },
      { date: 'automne 2008', titre: { fr: `La crise financière mondiale` }, detail: { fr: `Faillite de Lehman Brothers, plans de sauvetage des banques, discours de Toulon sur la « refondation du capitalisme » (25 septembre). Pendant la présidence française de l'UE, Sarkozy joue les médiateurs dans la guerre Russie-Géorgie (août).` } },
      { date: '2008-2009', titre: { fr: `RSA et relance` }, detail: { fr: `Le RSA, porté par Martin Hirsch, remplace le RMI (loi du 1er décembre 2008). Plan de relance face à la récession de 2009 ; la taxe carbone est censurée par le Conseil constitutionnel.` } },
      { date: 'avril 2009', titre: { fr: `Retour dans l'OTAN` }, detail: { fr: `La France réintègre le commandement intégré de l'OTAN, quitté par de Gaulle en 1966 — rupture assumée avec la tradition gaullienne, critiquée jusqu'à droite.` } },
      { date: '2010', titre: { fr: `Grenoble, retraites, Bettencourt` }, detail: { fr: `Discours de Grenoble liant sécurité et immigration (30 juillet, très controversé) ; réforme des retraites (âge légal 60 → 62 ans) adoptée le 9 novembre malgré des manifestations massives ; l'affaire Woerth-Bettencourt précède un large remaniement.` }, source: { label: `Légifrance — loi du 9 novembre 2010 portant réforme des retraites`, year: 2010 } },
      { date: '2011', titre: { fr: `Libye et crise de l'euro` }, detail: { fr: `Intervention militaire en Libye avec le Royaume-Uni (résolution 1973 de l'ONU) ; face à la crise de la dette de la zone euro, le duo « Merkozy » avec Angela Merkel impose la discipline budgétaire européenne.` } },
      { date: '13 janvier 2012', titre: { fr: `La perte du triple A` }, detail: { fr: `L'agence Standard & Poor's retire à la France sa note AAA — coup symbolique dur en pleine campagne présidentielle.` } },
      { date: '6 mai 2012', titre: { fr: `La défaite — puis les affaires` }, detail: { fr: `Battu par François Hollande (48,36 %). Suivront un retour manqué (primaire perdue en 2016) et des condamnations : définitives dans les affaires « Bismuth » (2024) et Bygmalion ; première instance en 2025 dans l'affaire libyenne, appel en cours.` }, source: { label: `Conseil constitutionnel — résultats 2012`, year: 2012 } },
    ],
  },

  vraiFaux: ['vf-sarkozy-retraite-60', 'vf-sarkozy-bouclier-fiscal', 'vf-sarkozy-dette-crise', 'vf-sarkozy-condamnation-libye'],

  quiz: [
    {
      question: { fr: `Quel était le slogan central de la campagne de Nicolas Sarkozy en 2007 ?` },
      options: [
        { fr: `« La force tranquille »` },
        { fr: `« Travailler plus pour gagner plus »` },
        { fr: `« Le changement, c'est maintenant »` },
        { fr: `« La France apaisée »` },
      ],
      bonneReponse: 1,
      explication: { fr: `Le slogan résumait la promesse de réhabiliter la « valeur travail » : défiscalisation des heures supplémentaires, baisses d'impôts. « La force tranquille » était celui de Mitterrand en 1981, « Le changement, c'est maintenant » celui de Hollande en 2012.` },
    },
    {
      question: { fr: `Qui a été Premier ministre pendant le quinquennat Sarkozy ?` },
      options: [
        { fr: `François Fillon, du début à la fin` },
        { fr: `Dominique de Villepin puis François Fillon` },
        { fr: `François Fillon puis Alain Juppé` },
        { fr: `Jean-Pierre Raffarin` },
      ],
      bonneReponse: 0,
      explication: { fr: `François Fillon est resté à Matignon les cinq années du mandat (2007-2012) — une longévité rare. Sarkozy l'avait pourtant publiquement qualifié de « collaborateur », illustrant la concentration du pouvoir à l'Élysée, l'« hyperprésidence ».` },
    },
    {
      question: { fr: `Que change la réforme des retraites de 2010 ?` },
      options: [
        { fr: `Elle supprime la retraite par répartition` },
        { fr: `Elle abaisse l'âge légal de 62 à 60 ans` },
        { fr: `Elle reporte l'âge légal de 60 à 62 ans` },
        { fr: `Elle instaure la retraite à 64 ans` },
      ],
      bonneReponse: 2,
      explication: { fr: `La loi du 9 novembre 2010 reporte progressivement l'âge légal de 60 à 62 ans, en maintenant des départs anticipés pour carrières longues. Le passage à 64 ans date de 2023, sous Emmanuel Macron.` },
    },
    {
      question: { fr: `Qu'apporte la révision constitutionnelle du 23 juillet 2008 ?` },
      options: [
        { fr: `Le quinquennat présidentiel` },
        { fr: `La QPC, la limite de deux mandats consécutifs et l'encadrement du 49.3` },
        { fr: `L'élection du président au suffrage universel direct` },
        { fr: `La suppression du Sénat` },
      ],
      bonneReponse: 1,
      explication: { fr: `Adoptée à une voix près par le Congrès, elle crée la question prioritaire de constitutionnalité — tout justiciable peut contester une loi en vigueur —, limite le président à deux mandats consécutifs et encadre le 49.3. Le quinquennat, lui, date de 2000.` },
    },
    {
      question: { fr: `Que se passe-t-il le 13 janvier 2012 ?` },
      options: [
        { fr: `La France perd son triple A auprès de l'agence Standard & Poor's` },
        { fr: `La France quitte la zone euro` },
        { fr: `Le chômage repasse sous 7 %` },
        { fr: `L'Assemblée censure le gouvernement Fillon` },
      ],
      bonneReponse: 0,
      explication: { fr: `En pleine crise de la dette de la zone euro et à trois mois de la présidentielle, la dégradation de la note souveraine française par S&P est un choc symbolique — les taux d'emprunt français, eux, resteront bas.` },
    },
  ],

  // ── 15. Pour aller plus loin (N4) ────────────────────────────────────────────
  level4: {
    items: [
      { kind: 'discours', titre: { fr: `Discours de Toulon — 25 septembre 2008 (INA / vie-publique.fr)` }, note: { fr: `En pleine tempête financière, le président de droite appelle à « refonder le capitalisme ». Un document sur le choc de 2008.` }, url: 'https://www.vie-publique.fr' },
      { kind: 'discours', titre: { fr: `Discours de Grenoble — 30 juillet 2010 (vie-publique.fr)` }, note: { fr: `Le texte intégral du discours le plus controversé du mandat, à lire pour se faire une opinion sur pièces.` }, url: 'https://www.vie-publique.fr' },
      { kind: 'texte', titre: { fr: `Loi TEPA (21 août 2007) et loi du 9 novembre 2010 sur les retraites — Légifrance` }, note: { fr: `Les deux textes emblématiques du quinquennat, dans leur version d'origine.` }, url: 'https://www.legifrance.gouv.fr' },
      { kind: 'donnees', titre: { fr: `INSEE — séries chômage et dette publique 2007-2012` }, note: { fr: `Pour vérifier soi-même le bilan macroéconomique et le poids de la crise.` }, url: 'https://www.insee.fr' },
      { kind: 'donnees', titre: { fr: `Cour des comptes — rapports sur les finances publiques 2009-2012` }, note: { fr: `La part de la crise et la part des baisses de recettes dans le creusement des déficits, analysées par l'institution de contrôle.` }, url: 'https://www.ccomptes.fr' },
      { kind: 'biblio', titre: { fr: `Franz-Olivier Giesbert, M. le Président — Flammarion, 2011` }, note: { fr: `Chronique journalistique du pouvoir sarkozyste, critique et documentée — à lire comme un témoignage, pas comme une histoire définitive.` } },
    ],
  },

  figuresLiees: [
    { nom: 'François Fillon', note: { fr: `Premier ministre des cinq années du quinquennat — fiche à venir` } },
    { nom: 'Jacques Chirac', note: { fr: `prédécesseur, dont il fut ministre avant de promettre la « rupture » — fiche à venir` } },
    { nom: 'Ségolène Royal', note: { fr: `adversaire du second tour de 2007 — fiche à venir` } },
    { nom: 'Angela Merkel', note: { fr: `le duo « Merkozy » de la crise de l'euro — fiche à venir` } },
    { nom: 'François Hollande', note: { fr: `vainqueur de 2012 — fiche à venir` } },
  ],

  motsAssocies: ['dette-publique', 'economie-de-marche', '49-3'],
  continuerAvec: [
    { slug: 'retraites' },
    { slug: 'president-de-la-republique' },
    { slug: 'droite' },
  ],

  sources: [
    { label: `Conseil constitutionnel — résultats officiels des élections présidentielles de 2007 et 2012`, url: 'https://www.conseil-constitutionnel.fr', year: 2012 },
    { label: `Légifrance — textes des lois citées (2007-2010) et loi constitutionnelle du 23 juillet 2008`, url: 'https://www.legifrance.gouv.fr', year: 2010 },
    { label: `INSEE — taux de chômage (BIT) et dette publique (Maastricht), séries 2007-2012`, url: 'https://www.insee.fr', year: 2012, perimetre: `définitions BIT et Maastricht ; à distinguer des chiffres administratifs de demandeurs d'emploi` },
    { label: `Vie-publique.fr — dossiers et chronologies du quinquennat 2007-2012`, url: 'https://www.vie-publique.fr', year: 2025 },
    { label: `Cour de cassation (décembre 2024, affaire « Bismuth ») et tribunal correctionnel de Paris (septembre 2025, affaire libyenne, appel en cours) — décisions de justice citées`, year: 2025 },
  ],
};
