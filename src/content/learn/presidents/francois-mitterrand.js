/**
 * Fiche président « François Mitterrand » — modèle president en 15 rubriques
 * (docs/jyconnaisrien/02, §5). Mapping niveaux : N1 = portrait 30 s ·
 * N2 = pourquoi élu + en une phrase + 5 dates + 5 mesures ·
 * N3 = programme, mesures, événements, gouverner, bilan, défenseurs, opposants,
 * héritage (ids requis par le script de contrôle) · N4 = pour aller plus loin.
 */

export default {
  slug: 'francois-mitterrand',
  type: 'president',
  porte: 'D1',
  title: { fr: `François Mitterrand`, en: 'François Mitterrand' },
  icon: '🌹',
  difficulty: 2,
  famille: 'dossier',
  updatedAt: '2026-07-12',
  freshness: { type: 'periodic', reviewEveryMonths: 12, lastReviewedAt: '2026-07-12' },

  // ── 1. Portrait en 30 secondes (N1) ─────────────────────────────────────────
  level1: {
    fr: `François Mitterrand (1916-1996), socialiste, président de 1981 à 1995 — le plus long mandat de la Ve République. Son élection du 10 mai 1981 fait accéder la gauche au pouvoir pour la première fois sous la Ve. Sa présidence tient en une tension : deux années de réformes profondes, puis l'apprentissage des contraintes économiques et européennes, deux cohabitations — et un héritage toujours disputé.`,
  },

  // ── N2 : pourquoi élu (2) + en une phrase (12) + 5 dates (13) + 5 mesures (14) ──
  level2: {
    sections: [
      {
        titre: { fr: `Pourquoi a-t-il été élu ?` },
        corps: {
          fr: `En 1981, la France sort de deux chocs pétroliers : inflation à deux chiffres, chômage en forte hausse, sentiment d'usure après vingt-trois ans de pouvoir de la droite. Le président sortant, Valéry Giscard d'Estaing, est affaibli par la crise, l'affaire des diamants et la guerre ouverte avec Jacques Chirac, qui divise son camp. En face, Mitterrand a patiemment unifié la gauche (programme commun avec les communistes en 1972) puis s'en est émancipé. Sa campagne « la force tranquille » et ses 110 propositions promettent le changement sans l'aventure. Il l'emporte au second tour avec 51,76 % des voix.`,
        },
        sources: [{ label: `Conseil constitutionnel — résultats officiels de l'élection présidentielle de 1981`, url: 'https://www.conseil-constitutionnel.fr', year: 1981 }],
      },
      {
        titre: { fr: `Sa présidence en une phrase` },
        brique: 'a-retenir',
        corps: {
          fr: `Le président qui a prouvé que l'alternance était possible et que la gauche pouvait gouverner — et qui a découvert dès 1983, avant tous ses successeurs, que les contraintes économiques et européennes encadrent désormais tout gouvernement, quel que soit son camp.`,
        },
      },
      {
        titre: { fr: `Sa présidence en cinq dates` },
        brique: 'glossaire',
        termes: [
          { nom: { fr: '10 mai 1981' }, def: { fr: `Première victoire de la gauche à une présidentielle de la Ve République. Liesse place de la Bastille ; le 21 mai, il dépose une rose au Panthéon.` } },
          { nom: { fr: '9 octobre 1981' }, def: { fr: `Promulgation de la loi abolissant la peine de mort, portée par Robert Badinter — contre l'opinion majoritaire de l'époque.` } },
          { nom: { fr: 'Mars 1983' }, def: { fr: `Le « tournant de la rigueur » : après trois dévaluations du franc, le choix de l'Europe et de la désinflation l'emporte sur la relance. La politique de rupture s'arrête.` } },
          { nom: { fr: '16 mars 1986' }, def: { fr: `La droite gagne les législatives : première cohabitation de la Ve République, avec Jacques Chirac à Matignon.` } },
          { nom: { fr: '20 septembre 1992' }, def: { fr: `Référendum sur le traité de Maastricht : le « oui » l'emporte de justesse (51,04 %). L'Union européenne et la future monnaie unique sont lancées.` } },
        ],
      },
      {
        titre: { fr: `Sa présidence en cinq mesures` },
        brique: 'glossaire',
        termes: [
          { nom: { fr: `Abolition de la peine de mort (1981)` }, def: { fr: `Jamais remise en cause depuis, constitutionnalisée en 2007.` } },
          { nom: { fr: `Retraite à 60 ans, 39 heures, 5e semaine de congés payés (1982)` }, def: { fr: `Le cœur social des débuts — la retraite à 60 ans sera progressivement remise en cause à partir de 2010.` } },
          { nom: { fr: `Décentralisation (lois Defferre, 1982)` }, def: { fr: `Transfert de pouvoirs de l'État vers les régions, départements et communes : l'organisation territoriale actuelle en descend directement.` } },
          { nom: { fr: `Nationalisations (1982)… puis rigueur (1983)` }, def: { fr: `Cinq grands groupes industriels et l'essentiel des banques nationalisés — avant le tournant de 1983 et les privatisations des cohabitations.` } },
          { nom: { fr: `RMI (1988)` }, def: { fr: `Le revenu minimum d'insertion, créé sous Rocard, ancêtre du RSA : un filet de sécurité universel voté à la quasi-unanimité.` } },
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
          fr: `Les « 110 propositions pour la France » (1981) : rupture économique — nationalisation des grands groupes industriels et des banques, relance par les salaires et la consommation, impôt sur les grandes fortunes ; conquêtes sociales — retraite à 60 ans, 35 heures (objectif affiché, 39 réalisées), cinquième semaine de congés payés, droits nouveaux pour les travailleurs ; libertés — abolition de la peine de mort, dépénalisation de l'homosexualité, radios libres, décentralisation ; et une politique étrangère d'indépendance dans la fidélité à l'alliance atlantique.\n\nEn 1988, sa réélection se fait sur un programme inverse dans la méthode : la « Lettre à tous les Français », prudente, recentrée, promettant « ni nationalisations ni privatisations » (le fameux « ni-ni »). Les deux campagnes disent le trajet parcouru en sept ans.`,
        },
        sources: [{ label: `Les 110 propositions (1981) et la Lettre à tous les Français (1988) — textes disponibles via la Fondation François Mitterrand et vie-publique.fr`, url: 'https://www.vie-publique.fr', year: 1988 }],
      },
      {
        id: 'mesures',
        titre: { fr: `Les principales mesures, une par une` },
        corps: {
          fr: `Abolition de la peine de mort (loi du 9 octobre 1981) : décidée contre l'opinion majoritaire, défendue par Robert Badinter ; toujours en vigueur, constitutionnalisée en 2007.\n\nRetraite à 60 ans (ordonnance de mars 1982), 39 heures et cinquième semaine de congés payés (janvier 1982) : arguments d'époque — partager le travail et récompenser les travailleurs ; critiques — coût pour l'économie dans un contexte de crise. La retraite à 60 ans a tenu près de trente ans (report à 62 ans en 2010, 64 en 2023) ; la cinquième semaine et la durée légale hebdomadaire existent toujours.\n\nNationalisations (loi du 11 février 1982) : cinq grands groupes industriels et l'essentiel du secteur bancaire. Défendues comme un outil de politique industrielle, critiquées comme coûteuses et dirigistes ; l'histoire a tranché par étapes — privatisations de 1986-1988 puis 1993-1995, sans retour en arrière.\n\nDécentralisation (lois Defferre, à partir du 2 mars 1982) : fin de la tutelle préfectorale a priori, exécutifs élus dans les régions et départements. Rarement contestée depuis, elle structure toujours l'organisation du pays.\n\nLois Auroux (1982) sur les droits des travailleurs, remboursement de l'IVG (1982), dépénalisation de l'homosexualité (loi du 4 août 1982), libération des ondes (radios libres), impôt sur les grandes fortunes (1982, supprimé en 1987, rétabli en 1989 sous le nom d'ISF). Et sous le second mandat : RMI (loi du 1er décembre 1988) et création de la CSG (1990) — cette dernière, contestée à sa naissance, est devenue un pilier du financement social.`,
        },
        sources: [
          { label: `Légifrance — lois du 9 octobre 1981, 11 février 1982, 2 mars 1982, 4 août 1982, 1er décembre 1988`, url: 'https://www.legifrance.gouv.fr', year: 1988 },
          { label: `Vie-publique.fr — chronologies des réformes 1981-1995`, url: 'https://www.vie-publique.fr', year: 2025 },
        ],
      },
      {
        id: 'evenements',
        titre: { fr: `Les grands événements du mandat` },
        corps: {
          fr: `1981-1983 : état de grâce, puis crise — trois dévaluations du franc encadrent la marche à la rigueur. 1984 : immense manifestation pour l'école privée, retrait de la loi Savary, départ de Pierre Mauroy, arrivée de Laurent Fabius. 1985 : l'affaire du Rainbow Warrior (navire de Greenpeace coulé par les services français en Nouvelle-Zélande) coûte son poste au ministre de la Défense. 1986-1988 : première cohabitation avec Jacques Chirac. 1988 : réélection face à Chirac (54 %). 1989-1991 : chute du mur de Berlin et réunification allemande — sa prudence initiale reste débattue —, guerre du Golfe (participation française, 1991). 1992 : référendum de Maastricht gagné de justesse. 1993-1995 : seconde cohabitation (Édouard Balladur), santé déclinante, révélations sur son passé vichyssois (livre de Pierre Péan, 1994) et sur les écoutes de l'Élysée. Il meurt le 8 janvier 1996, huit mois après avoir quitté l'Élysée.`,
        },
        sources: [{ label: `Vie-publique.fr — chronologie des deux septennats ; INA — archives des événements cités`, url: 'https://www.vie-publique.fr', year: 2025 }],
      },
      {
        id: 'gouverner',
        titre: { fr: `Sa manière de gouverner` },
        corps: {
          fr: `Un président stratège et secret, qui cultive les équilibres entre courants du PS et use ses Premiers ministres (sept en quatorze ans : Mauroy, Fabius, Chirac, Rocard, Cresson, Bérégovoy, Balladur — dont deux de cohabitation). Rapport à l'opinion distant, goût des symboles (le Panthéon, les grands travaux : pyramide du Louvre, Grande Arche, Opéra Bastille, Bibliothèque nationale de France), maîtrise du temps long et des ambiguïtés — ses adversaires disaient « le Florentin ». Il a aussi montré que l'institution présidentielle pouvait absorber la cohabitation sans crise de régime : un précédent décisif pour la Ve République.\n\nZones d'ombre documentées : les écoutes téléphoniques de l'Élysée (condamnations judiciaires prononcées en 2005, après sa mort), la dissimulation de son cancer dès 1981 malgré la promesse de bulletins de santé, l'amitié maintenue avec René Bousquet, et un parcours de jeunesse passé par Vichy (fonctionnaire décoré de la francisque) avant la Résistance — révélé au grand public en 1994.`,
        },
        sources: [{ label: `Pierre Péan, Une jeunesse française, Fayard, 1994 ; jugement du procès des écoutes de l'Élysée (2005)`, year: 2005 }],
      },
      {
        id: 'bilan',
        titre: { fr: `Le bilan économique et social — en distinguant ce qui lui revient` },
        corps: {
          fr: `Évolutions constatées : l'inflation, environ 13 % en 1981, tombe sous 3 % en 1986 — la désinflation est le grand succès macroéconomique du septennat, au prix de la rigueur salariale. Le chômage, lui, passe d'environ 1,7 million de demandeurs d'emploi en 1981 à plus de 3 millions au début des années 1990 : c'est l'échec assumé (« contre le chômage, on a tout essayé », dira-t-il en 1993 — formule elle-même discutée). La dette publique reste alors modérée par rapport aux niveaux actuels, mais les déficits deviennent structurels.\n\nCe qui relève de ses choix : la relance isolée de 1981-1982 (jugée à contretemps par la plupart des économistes), puis le choix de 1983 de rester dans le système monétaire européen — le « franc fort ». Ce qui relève du contexte : la crise mondiale post-chocs pétroliers, la désindustrialisation engagée avant 1981, les taux d'intérêt américains très élevés du début des années 1980. Les économistes débattent encore du poids respectif de ces facteurs — les deux lectures extrêmes (« tout est de sa faute » / « il n'y pouvait rien ») sont l'une et l'autre indéfendables.`,
        },
        sources: [
          { label: `INSEE — séries longues : inflation (13,4 % en 1981 ; 2,7 % en 1986), demandeurs d'emploi 1981-1995`, url: 'https://www.insee.fr', year: 1995, perimetre: `France métropolitaine ; définitions du chômage différentes des séries actuelles — comparer avec prudence` },
        ],
      },
      {
        id: 'defenseurs',
        titre: { fr: `Ce que ses défenseurs retiennent` },
        corps: {
          fr: `L'homme de l'alternance : il a prouvé que la gauche pouvait gouverner la Ve République et que les institutions survivaient au changement de camp — démocratiquement, ce n'est pas rien. Les acquis irréversibles : abolition de la peine de mort, décentralisation, libertés nouvelles, cinquième semaine, RMI. Le bâtisseur européen : le couple franco-allemand avec Helmut Kohl (la photo de Verdun, main dans la main, 1984), l'Acte unique, Maastricht. Et un réalisme revendiqué : le tournant de 1983 aurait été non un reniement mais la preuve qu'il savait gouverner dans le réel.`,
        },
      },
      {
        id: 'opposants',
        titre: { fr: `Ce que ses opposants retiennent` },
        corps: {
          fr: `À droite : les deux années 1981-1983 comme faute économique (relance à contretemps, nationalisations coûteuses), le chômage doublé, et un rapport au pouvoir jugé monarchique — l'Élysée comme cour, les affaires (écoutes, financements du PS des années 1980).\n\nÀ gauche de la gauche : la trahison des promesses — la rigueur de 1983, la CSG proportionnelle, l'Europe libérale de Maastricht ; la conversion d'une partie du PS à l'économie de marché sans le dire.\n\nEt une critique morale transversale, alimentée à partir de 1994 : le mensonge comme méthode — sur sa santé, sur son passé, sur Bousquet. Ses biographes les plus sévères et les plus admiratifs se disputent la part du cynisme et celle de la complexité.`,
        },
      },
      {
        id: 'heritage',
        titre: { fr: `Son héritage aujourd'hui` },
        corps: {
          fr: `Institutionnel : la cohabitation apprivoisée, la preuve que l'alternance ne casse pas le régime. Social : l'abolition, la décentralisation, la cinquième semaine, le RMI/RSA, la CSG — des acquis que plus personne ne propose sérieusement d'abroger. Européen : l'euro est l'enfant de Maastricht ; la contrainte européenne qu'il a acceptée en 1983 encadre depuis tous les gouvernements — c'est peut-être sa décision la plus durable. Politique : le PS qu'il a porté au sommet a dominé la gauche pendant trente ans avant de s'effondrer en 2017 ; le débat interne à la gauche française (gouverner dans le marché ou le contester) est toujours, au fond, un débat sur 1983.\n\nDans la mémoire collective, il reste l'un des présidents les plus clivants : régulièrement en tête des classements des présidents « préférés » à gauche, symbole des renoncements pour une partie de la gauche radicale, et adversaire historique respecté à droite.`,
        },
      },
    ],
  },

  // ── Chronologie ──────────────────────────────────────────────────────────────
  chronologie: {
    titre: { fr: `1981-1995 : les quatorze années` },
    events: [
      { date: '10 mai 1981', titre: { fr: `L'alternance` }, detail: { fr: `Mitterrand bat Giscard d'Estaing (51,76 %). Premier président socialiste de la Ve République. La dissolution donne dans la foulée une large majorité PS à l'Assemblée.` }, source: { label: `Conseil constitutionnel — résultats 1981`, year: 1981 } },
      { date: '1981-1982', titre: { fr: `Les grandes réformes` }, detail: { fr: `Abolition de la peine de mort, retraite à 60 ans, 39 heures, cinquième semaine, nationalisations, décentralisation, lois Auroux, radios libres, dépénalisation de l'homosexualité.` } },
      { date: 'mars 1983', titre: { fr: `Le tournant de la rigueur` }, detail: { fr: `Après trois dévaluations, le choix du maintien dans le système monétaire européen impose la désinflation : blocage relatif des salaires, hausse d'impôts, fin de la relance. Le moment le plus commenté de toute la présidence.` }, source: { label: `Vie-publique.fr — le tournant de mars 1983`, year: 2025 } },
      { date: '1984', titre: { fr: `L'école privée fait reculer le pouvoir` }, detail: { fr: `Manifestation géante contre la loi Savary sur l'école privée ; le texte est retiré, Mauroy part, Fabius devient Premier ministre. Les communistes quittent le gouvernement.` } },
      { date: '1985', titre: { fr: `Rainbow Warrior` }, detail: { fr: `Les services secrets français coulent le navire de Greenpeace à Auckland (un mort). Le scandale coûte son poste au ministre de la Défense Charles Hernu.` } },
      { date: '1986-1988', titre: { fr: `Première cohabitation` }, detail: { fr: `La droite gagne les législatives ; Chirac gouverne, privatise, et Mitterrand se réinvente en arbitre au-dessus des partis — avant de battre Chirac en 1988 (54 %).` }, source: { label: `Conseil constitutionnel — résultats 1988`, year: 1988 } },
      { date: '1988-1991', titre: { fr: `Rocard et le RMI` }, detail: { fr: `Second mandat ouvert sur la « France unie » : RMI (1988), CSG (1990), discours de La Baule sur la démocratisation en Afrique (1990).` } },
      { date: '1989-1991', titre: { fr: `La fin de la guerre froide` }, detail: { fr: `Chute du mur de Berlin, réunification allemande (sa prudence initiale reste débattue), guerre du Golfe avec participation française (1991).` } },
      { date: '20 sept. 1992', titre: { fr: `Maastricht` }, detail: { fr: `Le référendum sur le traité créant l'Union européenne et programmant la monnaie unique est gagné de justesse : 51,04 % de oui. Mitterrand, malade, avait défendu le traité dans un grand débat télévisé face à Philippe Séguin.` }, source: { label: `Conseil constitutionnel — proclamation des résultats, septembre 1992`, year: 1992 } },
      { date: '1993-1995', titre: { fr: `Seconde cohabitation et crépuscule` }, detail: { fr: `Déroute du PS aux législatives de 1993, gouvernement Balladur, santé déclinante, révélations sur la jeunesse vichyssoise (Péan, 1994). Il quitte l'Élysée en mai 1995 et meurt le 8 janvier 1996.` } },
    ],
  },

  vraiFaux: ['vf-mitterrand-programme-14-ans', 'vf-abolition-opinion', 'vf-mitterrand-renie-1981', 'vf-mitterrand-fondateur-europe'],

  quiz: [
    {
      question: { fr: `Qu'est-ce que le « tournant de la rigueur » de mars 1983 ?` },
      options: [
        { fr: `L'abandon de la relance : priorité à la lutte contre l'inflation et au maintien du franc dans le système monétaire européen` },
        { fr: `L'arrivée de la droite au pouvoir` },
        { fr: `La création du RMI` },
        { fr: `Le lancement des nationalisations` },
      ],
      bonneReponse: 0,
      explication: { fr: `Après trois dévaluations, Mitterrand choisit l'Europe et la désinflation contre la poursuite de la relance. C'est le moment charnière de sa présidence — et un tournant durable pour toute la gauche de gouvernement.` },
    },
    {
      question: { fr: `L'abolition de la peine de mort en 1981…` },
      options: [
        { fr: `Répondait à une demande majoritaire de l'opinion` },
        { fr: `A été votée contre l'opinion majoritaire de l'époque, qui était pour le maintien` },
        { fr: `A été décidée par référendum` },
        { fr: `N'existait dans aucun autre pays européen` },
      ],
      bonneReponse: 1,
      explication: { fr: `Les sondages de 1981 donnaient une majorité de Français favorables au maintien. Mitterrand avait annoncé sa position pendant la campagne et l'a assumée ; la loi Badinter est votée le 9 octobre 1981.` },
    },
    {
      question: { fr: `Combien de cohabitations Mitterrand a-t-il connues ?` },
      options: [
        { fr: `Aucune` },
        { fr: `Une` },
        { fr: `Deux : 1986-1988 avec Chirac, 1993-1995 avec Balladur` },
        { fr: `Trois` },
      ],
      bonneReponse: 2,
      explication: { fr: `Les deux premières cohabitations de la Ve République ont eu lieu sous ses mandats — et ont prouvé que les institutions pouvaient fonctionner avec un exécutif politiquement divisé.` },
    },
    {
      question: { fr: `Parmi ces mesures, laquelle n'a PAS été prise sous Mitterrand ?` },
      options: [
        { fr: `L'abolition de la peine de mort` },
        { fr: `La cinquième semaine de congés payés` },
        { fr: `Le passage aux 35 heures` },
        { fr: `Le RMI` },
      ],
      bonneReponse: 2,
      explication: { fr: `Les 35 heures figuraient dans les 110 propositions, mais ce sont les 39 heures qui ont été réalisées en 1982. Les 35 heures seront instaurées sous Lionel Jospin (lois Aubry, 1998-2000).` },
    },
    {
      question: { fr: `Quel a été le résultat du référendum de Maastricht (1992) ?` },
      options: [
        { fr: `Non à 55 %` },
        { fr: `Oui à 51,04 % — une victoire de justesse` },
        { fr: `Oui à 82 %` },
        { fr: `Le référendum a été annulé` },
      ],
      bonneReponse: 1,
      explication: { fr: `Le « petit oui » du 20 septembre 1992 a lancé l'Union européenne et la future monnaie unique — et révélé une fracture européenne durable, à droite comme à gauche.` },
    },
  ],

  // ── 15. Pour aller plus loin (N4) ────────────────────────────────────────────
  level4: {
    items: [
      { kind: 'discours', titre: { fr: `Discours de Robert Badinter à l'Assemblée nationale — 17 septembre 1981` }, note: { fr: `« J'ai l'honneur, au nom du gouvernement de la République, de demander à l'Assemblée nationale l'abolition de la peine de mort en France. »` }, url: 'https://www.assemblee-nationale.fr' },
      { kind: 'discours', titre: { fr: `Débat télévisé Mitterrand-Séguin sur Maastricht — 3 septembre 1992 (INA)` }, note: { fr: `Le président malade défend le traité face au chef de file du « non ». Un sommet du débat politique télévisé.` }, url: 'https://www.ina.fr' },
      { kind: 'texte', titre: { fr: `Les 110 propositions pour la France (1981) et la Lettre à tous les Français (1988)` }, note: { fr: `Les deux programmes, à lire côte à côte pour mesurer le trajet.` } },
      { kind: 'donnees', titre: { fr: `INSEE — séries longues inflation et emploi 1980-1995` }, note: { fr: `Pour vérifier soi-même le bilan macroéconomique.` }, url: 'https://www.insee.fr' },
      { kind: 'biblio', titre: { fr: `Pierre Péan, Une jeunesse française — Fayard, 1994` }, note: { fr: `L'enquête qui a révélé le parcours de jeunesse (Vichy, la francisque, la Résistance).` } },
      { kind: 'biblio', titre: { fr: `Michel Winock, François Mitterrand — Gallimard, 2015` }, note: { fr: `Biographie de référence, équilibrée et accessible.` } },
      { kind: 'lien', titre: { fr: `Institut François Mitterrand — archives et discours` }, note: { fr: `Source partisane par nature, utile pour les textes originaux.` }, url: 'https://www.mitterrand.org' },
    ],
  },

  figuresLiees: [
    { nom: 'Robert Badinter', note: { fr: `garde des Sceaux, abolition — fiche à venir` } },
    { nom: 'Michel Rocard', note: { fr: `Premier ministre 1988-1991, RMI — fiche à venir` } },
    { nom: 'Jacques Chirac', note: { fr: `adversaire et Premier ministre de cohabitation — fiche à venir` } },
    { nom: 'Helmut Kohl', note: { fr: `le couple franco-allemand — fiche à venir` } },
    { nom: 'Philippe Séguin', note: { fr: `le « non » à Maastricht — fiche à venir` } },
  ],

  motsAssocies: ['proportionnelle', 'motion-de-censure', 'dette-publique'],
  continuerAvec: [
    { slug: 'president-de-la-republique' },
    { slug: 'droite' },
    { label: { fr: 'La gauche' }, soon: true },
  ],

  sources: [
    { label: `Conseil constitutionnel — résultats officiels des scrutins de 1981, 1986, 1988, 1992, 1993`, url: 'https://www.conseil-constitutionnel.fr', year: 1993 },
    { label: `Légifrance — textes des lois citées (1981-1990)`, url: 'https://www.legifrance.gouv.fr', year: 1990 },
    { label: `INSEE — séries longues inflation et chômage`, url: 'https://www.insee.fr', year: 1995, perimetre: `définitions d'époque, à comparer avec prudence aux séries actuelles` },
    { label: `Vie-publique.fr — dossiers « les années Mitterrand »`, url: 'https://www.vie-publique.fr', year: 2025 },
    { label: `Michel Winock, François Mitterrand, Gallimard, 2015 ; Pierre Péan, Une jeunesse française, Fayard, 1994`, year: 2015 },
  ],
};
