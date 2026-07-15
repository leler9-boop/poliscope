/**
 * Fiche président « Jacques Chirac » — modèle president en 15 rubriques
 * (docs/jyconnaisrien/02, §5). Mapping niveaux : N1 = portrait 30 s ·
 * N2 = pourquoi élu + en une phrase + 5 dates + 5 mesures ·
 * N3 = programme, mesures, événements, gouverner, bilan, défenseurs, opposants,
 * héritage (ids requis par le script de contrôle) · N4 = pour aller plus loin.
 */

export default {
  slug: 'jacques-chirac',
  type: 'president',
  porte: 'D1',
  title: { fr: `Jacques Chirac`, en: 'Jacques Chirac' },
  icon: '🌳',
  difficulty: 2,
  famille: 'dossier',
  updatedAt: '2026-07-12',
  freshness: { type: 'periodic', reviewEveryMonths: 12, lastReviewedAt: '2026-07-12' },

  // ── 1. Portrait en 30 secondes (N1) ─────────────────────────────────────────
  level1: {
    fr: `Jacques Chirac (1932-2019), homme de droite, président de 1995 à 2007. Deux fois Premier ministre, fondateur du RPR, maire de Paris pendant dix-huit ans, il est élu en 1995 sur le thème de la « fracture sociale », puis réélu en 2002 avec 82 % des voix face à Jean-Marie Le Pen. Sa présidence mêle gestes historiques — discours du Vél d'Hiv, refus de la guerre d'Irak — et réformes souvent contrariées par la rue et par les urnes.`,
  },

  // ── N2 : pourquoi élu (2) + en une phrase (12) + 5 dates (13) + 5 mesures (14) ──
  level2: {
    sections: [
      {
        titre: { fr: `Pourquoi a-t-il été élu ?` },
        corps: {
          fr: `En 1995, après quatorze ans de Mitterrand, la France s'inquiète du chômage de masse et de l'exclusion. Chirac, battu en 1981 et 1988, fait campagne sur la « fracture sociale » : il promet de réconcilier une France coupée en deux entre ceux qui profitent de la croissance et ceux qui en sont exclus — un discours plus social que celui de son rival de droite, Édouard Balladur, donné longtemps favori. Il bat Lionel Jospin au second tour, le 7 mai 1995, avec 52,64 % des voix. En 2002, sa réélection est d'une toute autre nature : le 21 avril, Jospin est éliminé au premier tour au profit de Jean-Marie Le Pen ; au second tour, la gauche appelle à voter Chirac pour faire barrage à l'extrême droite, et il obtient 82,21 % — un score record qui ne mesure pas une adhésion à son programme.`,
        },
        sources: [{ label: `Conseil constitutionnel — résultats officiels des élections présidentielles de 1995 et 2002`, url: 'https://www.conseil-constitutionnel.fr', year: 2002 }],
      },
      {
        titre: { fr: `Sa présidence en une phrase` },
        brique: 'a-retenir',
        corps: {
          fr: `Un président élu sur la promesse de réduire la « fracture sociale », vite rattrapé par la rue (1995), les urnes (1997, 2005) et la cohabitation la plus longue de la Ve République — mais dont les grands gestes symboliques (Vél d'Hiv, refus de la guerre d'Irak, alerte climatique) ont marqué plus durablement que ses réformes.`,
        },
      },
      {
        titre: { fr: `Sa présidence en cinq dates` },
        brique: 'glossaire',
        termes: [
          { nom: { fr: '16 juillet 1995' }, def: { fr: `Discours du Vél d'Hiv : Chirac reconnaît la responsabilité de l'État français dans la rafle de 1942 et la déportation des Juifs — rupture avec la doctrine de ses prédécesseurs, qui distinguaient la République du régime de Vichy.` } },
          { nom: { fr: '21 avril 1997' }, def: { fr: `Il annonce la dissolution de l'Assemblée nationale. La droite perd les législatives : cinq ans de cohabitation avec Lionel Jospin, la plus longue de la Ve République.` } },
          { nom: { fr: '5 mai 2002' }, def: { fr: `Réélu avec 82,21 % face à Jean-Marie Le Pen, après le choc du 21 avril (élimination de Jospin au premier tour). Un score de barrage républicain, pas d'adhésion.` } },
          { nom: { fr: '14 février 2003' }, def: { fr: `Au Conseil de sécurité de l'ONU, Dominique de Villepin porte le refus français de la guerre d'Irak. La position de Chirac lui vaut une forte popularité internationale.` } },
          { nom: { fr: '29 mai 2005' }, def: { fr: `Les Français rejettent par référendum le traité établissant une Constitution pour l'Europe (non à 54,67 %). Échec politique majeur : Raffarin est remplacé par Villepin, la fin de mandat est plombée.` } },
        ],
      },
      {
        titre: { fr: `Sa présidence en cinq mesures` },
        brique: 'glossaire',
        termes: [
          { nom: { fr: `Le quinquennat (référendum du 24 septembre 2000)` }, def: { fr: `Le mandat présidentiel passe de sept à cinq ans (oui à 73 %, mais abstention record d'environ 70 %). Toute la vie politique française en découle depuis 2002.` } },
          { nom: { fr: `Loi sur les signes religieux à l'école (15 mars 2004)` }, def: { fr: `Interdiction des signes religieux ostensibles dans les écoles, collèges et lycées publics — une loi de laïcité toujours en vigueur, débattue à l'étranger plus qu'en France.` } },
          { nom: { fr: `Réforme des retraites (loi Fillon, 2003)` }, def: { fr: `Allongement progressif de la durée de cotisation, notamment pour les fonctionnaires. Adoptée malgré de grandes manifestations — l'une des rares grandes réformes sociales menées à terme.` } },
          { nom: { fr: `Charte de l'environnement (2005)` }, def: { fr: `Adossée à la Constitution en mars 2005, elle donne valeur constitutionnelle au droit à un environnement équilibré et au principe de précaution.` } },
          { nom: { fr: `Le passage à l'euro (1er janvier 2002)` }, def: { fr: `Les pièces et billets en euros remplacent le franc. La décision datait de Maastricht (1992, sous Mitterrand), mais la mise en œuvre a lieu sous Chirac.` } },
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
          fr: `La campagne de 1995 est construite contre la « pensée unique » : Chirac dénonce la « fracture sociale », promet de faire de l'emploi la priorité absolue, de revaloriser les bas salaires, de réduire les déficits tout en baissant les impôts — un attelage que ses adversaires jugent d'emblée intenable. Ce positionnement social le distingue de son rival de droite Édouard Balladur, Premier ministre sortant, qui incarne la gestion prudente. Sur les institutions, il défend alors le septennat ; il se ralliera pourtant au quinquennat en 2000.\n\nEn 2002, le contexte a changé : la campagne se joue sur l'insécurité, thème dominant de l'avant-21 avril. Chirac promet un ministère de l'Intérieur fort, des baisses d'impôt sur le revenu (« 30 % en cinq ans ») et la relance de la construction européenne. Mais le second tour face à Jean-Marie Le Pen transforme l'élection en référendum contre l'extrême droite : son programme propre n'est plus vraiment l'enjeu du scrutin, ce qui nourrira ensuite le débat sur la légitimité de ses réformes — ses opposants lui contesteront un mandat pour les mener, ses partisans rappelleront qu'il était arrivé en tête au premier tour.`,
        },
        sources: [{ label: `Vie-publique.fr — dossiers sur les élections présidentielles de 1995 et 2002 ; Conseil constitutionnel — résultats officiels`, url: 'https://www.vie-publique.fr', year: 2002 }],
      },
      {
        id: 'mesures',
        titre: { fr: `Les principales mesures, une par une` },
        corps: {
          fr: `Plan Juppé (1995) : réforme de la Sécurité sociale et des retraites du secteur public. Les grèves de novembre-décembre 1995, les plus dures depuis 1968, font retirer le volet retraites ; la réforme du financement de la Sécu (ordonnances de 1996) est maintenue.\n\nProfessionnalisation des armées : annoncée en février 1996, la suspension du service national est votée en 1997 — la fin du service militaire obligatoire pour les jeunes hommes.\n\nQuinquennat (référendum du 24 septembre 2000) : mandat présidentiel ramené de sept à cinq ans, approuvé à 73 % mais avec environ 70 % d'abstention.\n\nRéforme des retraites (loi Fillon, août 2003) : allongement de la durée de cotisation et alignement progressif public/privé, adoptée malgré un vaste mouvement social.\n\nLoi du 15 mars 2004 : interdiction des signes religieux ostensibles à l'école publique, votée à une large majorité après la commission Stasi.\n\nCharte de l'environnement : adossée à la Constitution par la loi constitutionnelle du 1er mars 2005.\n\nCPE (contrat première embauche, 2006) : contrat pour les moins de 26 ans avec période de « consolidation » de deux ans, adopté via le 49.3 puis retiré en avril 2006 face aux manifestations étudiantes — le symbole des réformes avortées du second mandat.`,
        },
        sources: [
          { label: `Légifrance — ordonnances de 1996, loi du 21 août 2003, loi du 15 mars 2004, loi constitutionnelle du 1er mars 2005`, url: 'https://www.legifrance.gouv.fr', year: 2005 },
          { label: `Vie-publique.fr — chronologies des réformes 1995-2007`, url: 'https://www.vie-publique.fr', year: 2025 },
        ],
      },
      {
        id: 'evenements',
        titre: { fr: `Les grands événements du mandat` },
        corps: {
          fr: `1995 : reprise brève des essais nucléaires à Mururoa (septembre 1995-janvier 1996, avant la signature du traité d'interdiction complète des essais), qui provoque des protestations internationales ; discours du Vél d'Hiv (16 juillet) ; grèves de novembre-décembre contre le plan Juppé. 1997 : dissolution ratée de l'Assemblée — la gauche gagne, Lionel Jospin gouverne cinq ans (35 heures, emplois-jeunes, PACS relèvent de son gouvernement, pas de l'Élysée). 2002 : choc du 21 avril et réélection-barrage ; passage à l'euro en espèces (1er janvier) ; à Johannesburg, Chirac lance « Notre maison brûle et nous regardons ailleurs ». 2003 : refus de la guerre d'Irak, porté à l'ONU par Villepin le 14 février — moment de forte popularité internationale, au prix d'une brouille avec Washington ; réforme des retraites ; canicule d'août (environ 15 000 morts, crise sanitaire et politique majeure). 2005 : non au référendum européen du 29 mai (54,67 %) ; AVC du président en septembre ; émeutes urbaines de l'automne, état d'urgence déclaré. 2006 : crise du CPE, voté puis retiré en avril. 2007 : affaibli, il ne se représente pas et soutient sans enthousiasme Nicolas Sarkozy.`,
        },
        sources: [{ label: `Vie-publique.fr — chronologie des deux mandats ; INA — archives des événements cités`, url: 'https://www.vie-publique.fr', year: 2025 }],
      },
      {
        id: 'gouverner',
        titre: { fr: `Sa manière de gouverner` },
        corps: {
          fr: `Un politique de terrain et de contact — le Salon de l'agriculture comme image d'Épinal —, chaleureux en public, réputé plus indécis dans la décision. Quatre Premiers ministres : Alain Juppé (1995-1997), fidèle cassé par les grèves ; Lionel Jospin (1997-2002), imposé par la cohabitation la plus longue de la Ve République, née de sa propre dissolution ratée d'avril 1997 — une erreur stratégique qu'il a lui-même reconnue ; Jean-Pierre Raffarin (2002-2005) ; Dominique de Villepin (2005-2007), nommé sans avoir jamais été élu.\n\nSon rapport aux Français passe volontiers par le référendum, avec des fortunes inverses : gagné en 2000 sur le quinquennat (mais dans l'indifférence), perdu en 2005 sur l'Europe. Son second mandat est marqué par la rivalité ouverte avec Nicolas Sarkozy, qu'il garde pourtant au gouvernement, et par une usure physique réelle après l'AVC de septembre 2005.\n\nZone d'ombre documentée : les emplois fictifs de la mairie de Paris, pour lesquels il est condamné en décembre 2011 à deux ans de prison avec sursis — premier ancien président de la Ve République condamné par la justice. Les faits dataient de sa période de maire (1977-1995), l'immunité présidentielle ayant gelé les poursuites pendant ses mandats.`,
        },
        sources: [{ label: `Jugement du tribunal correctionnel de Paris, 15 décembre 2011 (emplois fictifs de la Ville de Paris) ; Vie-publique.fr — la dissolution de 1997`, year: 2011 }],
      },
      {
        id: 'bilan',
        titre: { fr: `Le bilan économique et social — en distinguant ce qui lui revient` },
        corps: {
          fr: `Évolutions constatées : le chômage, supérieur à 10 % au milieu des années 1990, baisse nettement entre 1997 et 2001, remonte après 2002 puis reflue en fin de mandat, autour de 8 % en 2007 — sans jamais retrouver le plein emploi. La dette publique passe d'environ 55 % du PIB en 1995 à environ 64 % en 2007. La croissance est forte à la fin des années 1990, molle ensuite. Le passage à l'euro (2002) se fait sans accroc technique, mais reste associé dans l'opinion à un sentiment de hausse des prix que les mesures d'inflation ne confirment qu'en partie.\n\nCe qui complique l'attribution : pendant cinq de ses douze années (1997-2002), c'est le gouvernement Jospin qui conduit la politique économique — 35 heures, emplois-jeunes et la meilleure période de créations d'emplois relèvent de la cohabitation, portée aussi par la conjoncture mondiale. Ce qui relève de ses choix : le couple hausse de TVA/rigueur de 1995, les baisses d'impôt sur le revenu de 2002-2004 non financées selon la Cour des comptes, la réforme des retraites de 2003. Le jugement dominant — bilan réformateur limité au regard des ambitions de 1995 — doit donc être pondéré par un contexte politique qu'il a en partie créé lui-même (la dissolution) et en partie subi.`,
        },
        sources: [
          { label: `INSEE — séries longues : taux de chômage au sens du BIT et dette publique au sens de Maastricht, 1995-2007`, url: 'https://www.insee.fr', year: 2007, perimetre: `France métropolitaine pour le chômage d'époque ; définitions et séries révisées depuis — comparer avec prudence` },
          { label: `Cour des comptes — rapports sur les finances publiques 2002-2007`, url: 'https://www.ccomptes.fr', year: 2007 },
        ],
      },
      {
        id: 'defenseurs',
        titre: { fr: `Ce que ses défenseurs retiennent` },
        corps: {
          fr: `L'homme des grands gestes justes : le Vél d'Hiv en 1995, qui a dit ce qu'aucun président n'avait dit sur la responsabilité de l'État français dans la Shoah ; le refus de la guerre d'Irak en 2003, vu rétrospectivement comme lucide par une large partie de l'opinion, en France et à l'étranger ; l'alerte écologique précoce (« Notre maison brûle », 2002) suivie d'un acte juridique, la Charte de l'environnement constitutionnalisée en 2005.\n\nLe rempart républicain : en 2002, il refuse de débattre avec Jean-Marie Le Pen et incarne, au-delà de son camp, le front commun contre l'extrême droite. Le réformateur discret : quinquennat, professionnalisation des armées, retraites 2003, loi de 2004 sur la laïcité — des changements durables, adoptés sans toujours faire de bruit. Enfin l'humanité du personnage : proximité avec les gens, goût des cultures lointaines (le musée du quai Branly est son grand projet culturel), absence de sectarisme — une qualité que même ses adversaires politiques lui ont reconnue, et qui explique sa grande popularité en fin de vie.`,
        },
      },
      {
        id: 'opposants',
        titre: { fr: `Ce que ses opposants retiennent` },
        corps: {
          fr: `À gauche : la promesse trahie de 1995 — élu sur la « fracture sociale », il lance dès l'automne le plan Juppé et une politique de rigueur ; les baisses d'impôt de 2002-2004 jugées favorables aux plus aisés ; la canicule de 2003 et les émeutes de 2005 comme révélateurs d'un pouvoir coupé des plus fragiles ; et le traité de Lisbonne en germe — le non de 2005 sera pour l'essentiel contourné après lui.\n\nÀ droite, la critique est presque inverse : l'immobilisme. Douze ans de pouvoir, un score de 82 % en 2002, et si peu de réformes structurelles menées à terme — le plan Juppé retiré pour partie, le CPE abandonné, la dette en hausse. Beaucoup y voient des occasions historiques manquées.\n\nCritique transversale : l'opportunisme idéologique. En trente ans, Chirac a défendu des positions successives difficiles à concilier — du dirigisme des années 1970 à l'appel de Cochin contre l'Europe giscardienne (1978), au libéralisme assumé de 1986, puis au discours social de 1995. Ses détracteurs y lisent l'absence de convictions ; ses biographes, un pragmatisme radical. S'y ajoute la condamnation de 2011 pour les emplois fictifs parisiens, qui documente un système de financement politique irrégulier.`,
        },
      },
      {
        id: 'heritage',
        titre: { fr: `Son héritage aujourd'hui` },
        corps: {
          fr: `Institutionnel : le quinquennat a changé la respiration de la vie politique — présidentielle et législatives quasi simultanées, présidence devenue le centre de tout ; c'est peut-être sa décision la plus structurante, et elle reste discutée. Mémoriel : la reconnaissance du Vél d'Hiv est devenue la doctrine officielle de l'État, reprise par tous ses successeurs. Laïcité : la loi de 2004 structure toujours le débat sur les signes religieux. Diplomatique : le non à la guerre d'Irak reste la référence d'une politique étrangère française indépendante, invoquée bien au-delà de son camp. Écologique : « Notre maison brûle » et la Charte de l'environnement font de lui, rétrospectivement, un précurseur de la parole climatique officielle — même si son bilan environnemental concret est jugé modeste.\n\nPolitique : la création de l'UMP en 2002 a unifié la droite qu'il avait lui-même divisée — la famille politique dont sont issus ses successeurs de droite en descend. Judiciaire : sa condamnation de 2011 a établi qu'un ancien président pouvait être jugé et condamné. Dans la mémoire collective, enfin, un paradoxe : impopulaire en fin de mandat, il est devenu après 2007 l'un des anciens présidents préférés des Français — une affection qui porte sur l'homme au moins autant que sur le bilan.`,
        },
      },
    ],
  },

  // ── Chronologie ──────────────────────────────────────────────────────────────
  chronologie: {
    titre: { fr: `1995-2007 : les douze années` },
    events: [
      { date: '7 mai 1995', titre: { fr: `Élu au troisième essai` }, detail: { fr: `Battu en 1981 et 1988, Chirac bat Lionel Jospin (52,64 %) sur le thème de la « fracture sociale », après avoir écarté Édouard Balladur au premier tour.` }, source: { label: `Conseil constitutionnel — résultats 1995`, year: 1995 } },
      { date: '16 juillet 1995', titre: { fr: `Le discours du Vél d'Hiv` }, detail: { fr: `Il reconnaît la responsabilité de l'État français dans la rafle du Vél d'Hiv et la déportation — rupture avec la doctrine de De Gaulle à Mitterrand. Le même été, la reprise des essais nucléaires à Mururoa (sept. 1995-janv. 1996) déclenche un tollé international.` } },
      { date: 'nov.-déc. 1995', titre: { fr: `Les grèves contre le plan Juppé` }, detail: { fr: `Le plan de réforme de la Sécurité sociale et des retraites publiques provoque les plus grandes grèves depuis 1968. Le volet retraites est retiré ; la réforme de la Sécu est maintenue par ordonnances (1996).` } },
      { date: '21 avril 1997', titre: { fr: `La dissolution ratée` }, detail: { fr: `Chirac dissout l'Assemblée pour conforter sa majorité ; la gauche gagne. Lionel Jospin gouverne cinq ans — la cohabitation la plus longue de la Ve République (35 heures, emplois-jeunes, PACS relèvent de ce gouvernement).` }, source: { label: `Conseil constitutionnel — législatives de 1997`, year: 1997 } },
      { date: '24 sept. 2000', titre: { fr: `Le quinquennat` }, detail: { fr: `Référendum : le mandat présidentiel passe de sept à cinq ans (oui à 73 %, abstention record d'environ 70 %). Applicable dès 2002.` }, source: { label: `Conseil constitutionnel — référendum du 24 septembre 2000`, year: 2000 } },
      { date: '21 avril - 5 mai 2002', titre: { fr: `Le choc, puis 82 %` }, detail: { fr: `Jospin est éliminé au premier tour ; face à Jean-Marie Le Pen, Chirac est réélu avec 82,21 % — un vote de barrage républicain. L'UMP, créée dans la foulée, unifie la droite. Le 1er janvier, les Français étaient passés à l'euro en espèces.` }, source: { label: `Conseil constitutionnel — résultats 2002`, year: 2002 } },
      { date: '2003', titre: { fr: `L'Irak, les retraites, la canicule` }, detail: { fr: `Le 14 février, Villepin porte à l'ONU le refus français de la guerre d'Irak. À l'été, la loi Fillon allonge la durée de cotisation malgré de grandes manifestations ; la canicule d'août fait environ 15 000 morts et tourne à la crise politique.` } },
      { date: '29 mai 2005', titre: { fr: `Le non à la Constitution européenne` }, detail: { fr: `Référendum perdu : non à 54,67 %. Raffarin est remplacé par Villepin. En septembre, Chirac est victime d'un AVC ; à l'automne, trois semaines d'émeutes urbaines conduisent à l'état d'urgence.` }, source: { label: `Conseil constitutionnel — référendum du 29 mai 2005`, year: 2005 } },
      { date: 'avril 2006', titre: { fr: `Le retrait du CPE` }, detail: { fr: `Le contrat première embauche, adopté via le 49.3, est retiré après des semaines de manifestations étudiantes — la dernière grande réforme du mandat échoue.` } },
      { date: '2007-2019', titre: { fr: `Après l'Élysée` }, detail: { fr: `Il ne se représente pas en 2007. En décembre 2011, il est condamné à deux ans de prison avec sursis pour les emplois fictifs de la mairie de Paris — premier ancien président condamné sous la Ve République. Très populaire en fin de vie, il meurt le 26 septembre 2019.` }, source: { label: `Tribunal correctionnel de Paris — jugement du 15 décembre 2011`, year: 2011 } },
    ],
  },

  vraiFaux: ['vf-chirac-rien-reforme', 'vf-chirac-non-2005-respecte', 'vf-chirac-35-heures', 'vf-chirac-82-adhesion'],

  quiz: [
    {
      question: { fr: `Pourquoi Chirac a-t-il été réélu avec 82,21 % des voix en 2002 ?` },
      options: [
        { fr: `Son premier mandat était plébiscité par les Français` },
        { fr: `Face à Jean-Marie Le Pen au second tour, la gauche a appelé à voter pour lui afin de faire barrage à l'extrême droite` },
        { fr: `Il était le seul candidat au second tour` },
        { fr: `La droite avait fusionné avec le centre avant l'élection` },
      ],
      bonneReponse: 1,
      explication: { fr: `Le 21 avril 2002, Lionel Jospin est éliminé au premier tour. Au second, les électeurs de gauche votent massivement Chirac pour barrer la route à Le Pen : ce score record mesure un réflexe républicain, pas une adhésion à son programme.` },
    },
    {
      question: { fr: `Que dit le discours du Vél d'Hiv du 16 juillet 1995 ?` },
      options: [
        { fr: `Que seul le régime de Vichy, et non la France, est responsable de la rafle de 1942` },
        { fr: `Que l'État français porte une responsabilité dans la rafle du Vél d'Hiv et la déportation des Juifs` },
        { fr: `Qu'il faut fermer les archives de la Seconde Guerre mondiale` },
        { fr: `Que la France demande pardon à l'Allemagne` },
      ],
      bonneReponse: 1,
      explication: { fr: `Chirac rompt avec la doctrine de ses prédécesseurs, qui distinguaient la République du régime de Vichy : il reconnaît que « la France » a commis l'irréparable en secondant l'occupant. Cette lecture est depuis reprise par tous ses successeurs.` },
    },
    {
      question: { fr: `Sur quoi portait le référendum du 29 mai 2005 ?` },
      options: [
        { fr: `Le passage à l'euro` },
        { fr: `Le quinquennat` },
        { fr: `Le traité établissant une Constitution pour l'Europe — rejeté par 54,67 % de non` },
        { fr: `L'adhésion de la Turquie à l'Union européenne` },
      ],
      bonneReponse: 2,
      explication: { fr: `Le non l'emporte nettement, contre la position de Chirac et de la plupart des grands partis. C'est l'échec politique majeur de son second mandat : Raffarin quitte Matignon et la fin de règne s'installe.` },
    },
    {
      question: { fr: `Qui a créé les 35 heures ?` },
      options: [
        { fr: `Jacques Chirac, au début de son premier mandat` },
        { fr: `Le gouvernement d'Alain Juppé` },
        { fr: `Le gouvernement de Lionel Jospin, pendant la cohabitation de 1997-2002` },
        { fr: `Le gouvernement de Dominique de Villepin` },
      ],
      bonneReponse: 2,
      explication: { fr: `Les lois Aubry (1998 et 2000) relèvent du gouvernement Jospin, issu des législatives qui ont suivi la dissolution ratée de 1997. Pendant une cohabitation, la politique économique et sociale est conduite par le gouvernement, pas par le président.` },
    },
    {
      question: { fr: `Comment le quinquennat a-t-il été adopté ?` },
      options: [
        { fr: `Par un vote du Parlement réuni en Congrès, en 1995` },
        { fr: `Par référendum, le 24 septembre 2000 — oui à 73 %, mais avec une abstention record d'environ 70 %` },
        { fr: `Par une décision du Conseil constitutionnel` },
        { fr: `Il n'a jamais été formellement adopté` },
      ],
      bonneReponse: 1,
      explication: { fr: `Le mandat présidentiel passe de sept à cinq ans, applicable dès 2002. La très faible participation relativise l'enthousiasme, mais la réforme a durablement transformé le rythme de la vie politique française.` },
    },
  ],

  // ── 15. Pour aller plus loin (N4) ────────────────────────────────────────────
  level4: {
    items: [
      { kind: 'discours', titre: { fr: `Discours du Vél d'Hiv — 16 juillet 1995` }, note: { fr: `Le texte fondateur de la doctrine mémorielle actuelle de l'État sur Vichy. Disponible sur le site de l'Élysée et sur vie-publique.fr.` }, url: 'https://www.vie-publique.fr' },
      { kind: 'discours', titre: { fr: `Discours de Dominique de Villepin au Conseil de sécurité de l'ONU — 14 février 2003 (INA)` }, note: { fr: `Le refus français de la guerre d'Irak, applaudi dans l'enceinte du Conseil — fait rarissime.` }, url: 'https://www.ina.fr' },
      { kind: 'discours', titre: { fr: `« Notre maison brûle et nous regardons ailleurs » — sommet de Johannesburg, 2 septembre 2002` }, note: { fr: `L'alerte climatique dans la bouche d'un chef d'État, avant que le sujet ne devienne central.` }, url: 'https://www.vie-publique.fr' },
      { kind: 'texte', titre: { fr: `La Charte de l'environnement (loi constitutionnelle du 1er mars 2005)` }, note: { fr: `Dix articles adossés à la Constitution — dont le principe de précaution, toujours débattu.` }, url: 'https://www.legifrance.gouv.fr' },
      { kind: 'donnees', titre: { fr: `INSEE — chômage et dette publique 1995-2007` }, note: { fr: `Pour vérifier soi-même le bilan macroéconomique, en gardant à l'esprit la cohabitation de 1997-2002.` }, url: 'https://www.insee.fr' },
      { kind: 'biblio', titre: { fr: `Franz-Olivier Giesbert, La Tragédie du président — Flammarion, 2006` }, note: { fr: `Chronique très informée, et très discutée, du second mandat par un journaliste qui l'a suivi trente ans.` } },
      { kind: 'biblio', titre: { fr: `Jacques Chirac, Chaque pas doit être un but (Mémoires, tome 1) — NiL, 2009` }, note: { fr: `Le récit par lui-même — source partisane par nature, utile pour sa version des choix.` } },
    ],
  },

  figuresLiees: [
    { nom: 'Alain Juppé', note: { fr: `Premier ministre 1995-1997, le plan de 1995 — fiche à venir` } },
    { nom: 'Lionel Jospin', note: { fr: `Premier ministre de la cohabitation 1997-2002 — fiche à venir` } },
    { nom: 'Dominique de Villepin', note: { fr: `le discours de l'ONU, puis Matignon et le CPE — fiche à venir` } },
    { nom: 'Nicolas Sarkozy', note: { fr: `rival interne devenu successeur — fiche à venir` } },
    { nom: 'Jean-Marie Le Pen', note: { fr: `l'adversaire du 5 mai 2002 — fiche à venir` } },
  ],

  motsAssocies: ['49-3', 'dette-publique', 'motion-de-censure'],
  continuerAvec: [
    { slug: 'francois-mitterrand' },
    { slug: 'president-de-la-republique' },
    { slug: 'droite' },
  ],

  sources: [
    { label: `Conseil constitutionnel — résultats officiels des scrutins de 1995, 1997, 2000, 2002 et 2005`, url: 'https://www.conseil-constitutionnel.fr', year: 2005 },
    { label: `Légifrance — textes des lois et ordonnances citées (1996-2005)`, url: 'https://www.legifrance.gouv.fr', year: 2005 },
    { label: `INSEE — séries longues chômage (BIT) et dette publique (Maastricht)`, url: 'https://www.insee.fr', year: 2007, perimetre: `définitions d'époque et séries révisées depuis — comparer avec prudence` },
    { label: `Vie-publique.fr — dossiers « les années Chirac », discours du Vél d'Hiv et de Johannesburg`, url: 'https://www.vie-publique.fr', year: 2025 },
    { label: `Franz-Olivier Giesbert, La Tragédie du président, Flammarion, 2006 ; jugement du tribunal correctionnel de Paris, 15 décembre 2011`, year: 2011 },
  ],
};
