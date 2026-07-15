/**
 * Fiche président « Emmanuel Macron » — modèle president en 15 rubriques
 * (docs/jyconnaisrien/02, §5). Mapping niveaux : N1 = portrait 30 s ·
 * N2 = pourquoi élu + en une phrase + 5 dates + 5 mesures ·
 * N3 = programme, mesures, événements, gouverner, bilan, défenseurs, opposants,
 * héritage (ids requis par le script de contrôle) · N4 = pour aller plus loin.
 *
 * ⚠️ MANDAT EN COURS (jusqu'en 2027) : régime de fraîcheur « live » (revue 3 mois),
 * bilan rédigé au provisoire, fiche arrêtée aux événements vérifiables — rien de
 * postérieur à 2025 ; pour la période récente : « à la date de vérification de cette fiche ».
 */

export default {
  slug: 'emmanuel-macron',
  type: 'president',
  porte: 'D1',
  title: { fr: `Emmanuel Macron`, en: 'Emmanuel Macron' },
  icon: '🚶',
  difficulty: 2,
  famille: 'dossier',
  updatedAt: '2026-07-12',
  freshness: { type: 'live', reviewEveryMonths: 3, lastReviewedAt: '2026-07-12' },

  // ── 1. Portrait en 30 secondes (N1) ─────────────────────────────────────────
  level1: {
    fr: `Emmanuel Macron (né en 1977), président depuis 2017, réélu en 2022 — son second mandat court jusqu'en 2027. Élu à 39 ans hors des partis traditionnels, il a bouleversé le paysage politique français. Réformes économiques, crises majeures (gilets jaunes, Covid, guerre en Ukraine), retraite à 64 ans, dissolution surprise de 2024 : cette fiche s'arrête aux événements vérifiables. Le mandat étant en cours, le bilan présenté ici reste provisoire.`,
  },

  // ── N2 : pourquoi élu (2) + en une phrase (12) + 5 dates (13) + 5 mesures (14) ──
  level2: {
    sections: [
      {
        titre: { fr: `Pourquoi a-t-il été élu ?` },
        corps: {
          fr: `En 2017, les deux partis qui alternent au pouvoir depuis des décennies sont à bout de souffle : le quinquennat de François Hollande s'achève dans une impopularité telle que le président sortant renonce à se représenter, et le candidat de la droite, François Fillon, est plombé par une affaire d'emplois présumés fictifs. Macron, ancien ministre de l'Économie de Hollande (2014-2016), a fondé son propre mouvement, En Marche, en avril 2016, en se présentant « et de droite et de gauche ». Il capte à la fois le rejet des partis installés et l'envie de renouvellement : qualifié en tête du premier tour, il bat Marine Le Pen au second avec 66,10 % des voix, le 7 mai 2017 — à 39 ans, le plus jeune président de la Ve République, et le premier élu hors des deux grands partis traditionnels.`,
        },
        sources: [{ label: `Conseil constitutionnel — résultats officiels de l'élection présidentielle de 2017`, url: 'https://www.conseil-constitutionnel.fr', year: 2017 }],
      },
      {
        titre: { fr: `Sa présidence en une phrase (provisoire)` },
        brique: 'a-retenir',
        corps: {
          fr: `Le président qui a fait exploser le clivage droite-gauche traditionnel et enchaîné les crises (gilets jaunes, Covid, Ukraine) en réformant l'économie à marche forcée — jusqu'à la dissolution de 2024, qui a fragmenté l'Assemblée et ouvert une période d'instabilité politique dont l'issue, à la date de vérification de cette fiche, n'est pas écrite.`,
        },
      },
      {
        titre: { fr: `Sa présidence en cinq dates` },
        brique: 'glossaire',
        termes: [
          { nom: { fr: '7 mai 2017' }, def: { fr: `Élu à 39 ans avec 66,10 % face à Marine Le Pen — plus jeune président de la Ve République, premier élu hors des deux grands partis traditionnels.` } },
          { nom: { fr: 'Novembre 2018' }, def: { fr: `Début du mouvement des « gilets jaunes », déclenché par la hausse de la taxe carbone : des mois de manifestations, puis le « grand débat national » et environ 10 milliards d'euros d'annonces.` } },
          { nom: { fr: '17 mars 2020' }, def: { fr: `Premier confinement face à la pandémie de Covid-19. Suivront le « quoi qu'il en coûte », un plan de relance de 100 milliards et le plan France 2030.` } },
          { nom: { fr: '24 avril 2022' }, def: { fr: `Réélu avec 58,55 % face à Marine Le Pen — premier président réélu hors cohabitation depuis de Gaulle. Mais en juin, les législatives ne lui donnent qu'une majorité relative.` } },
          { nom: { fr: '9 juin 2024' }, def: { fr: `Dissolution surprise de l'Assemblée nationale au soir de la défaite aux élections européennes. Résultat : une Assemblée fragmentée en trois blocs et une instabilité gouvernementale durable.` } },
        ],
      },
      {
        titre: { fr: `Sa présidence en cinq mesures` },
        brique: 'glossaire',
        termes: [
          { nom: { fr: `Ordonnances travail (2017)` }, def: { fr: `Réforme du code du travail par ordonnances dès l'été 2017 : plafonnement des indemnités prud'homales, négociation décentralisée dans l'entreprise.` } },
          { nom: { fr: `ISF transformé en IFI + flat tax 30 % (2018)` }, def: { fr: `L'impôt sur la fortune est recentré sur l'immobilier et les revenus du capital taxés à un taux unique de 30 % (PFU) — la mesure la plus disputée politiquement de son premier mandat.` } },
          { nom: { fr: `Suppression progressive de la taxe d'habitation` }, def: { fr: `Supprimée par étapes pour les résidences principales — un gain de pouvoir d'achat pour les ménages, un manque à gagner compensé par l'État pour les communes.` } },
          { nom: { fr: `« Quoi qu'il en coûte » et France 2030` }, def: { fr: `Soutien massif à l'économie pendant le Covid (activité partielle, prêts garantis), plan de relance de 100 milliards, puis plan d'investissement France 2030 — au prix d'un fort endettement.` } },
          { nom: { fr: `Retraite à 64 ans (2023)` }, def: { fr: `Report progressif de l'âge légal de 62 à 64 ans, adopté sans vote grâce au 49.3 après des mois de manifestations massives.` } },
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
          fr: `En 2017, le programme se veut « et de droite et de gauche » : libérer l'économie (réforme du droit du travail, baisse de la fiscalité du capital, allègement de l'impôt sur les sociétés) tout en protégeant (réforme de l'assurance-chômage, reste à charge zéro sur les lunettes et prothèses, dédoublement des classes de CP en éducation prioritaire), moderniser l'État, et bâtir une « Europe souveraine » — thème développé dès le discours de la Sorbonne (septembre 2017). Une réforme des retraites « par points », remplaçant les régimes existants par un système universel, figure au programme : engagée en 2019-2020, elle est abandonnée avec la pandémie.\n\nEn 2022, la campagne est écourtée par la guerre en Ukraine, qui éclate en février. Le programme promet le « plein emploi », le report de l'âge de la retraite (64 ou 65 ans), la relance du nucléaire annoncée à Belfort en février 2022 (six réacteurs EPR2), et une « planification écologique » confiée au Premier ministre. Comme pour tout président, il faut distinguer le programme de ce qui a été réellement fait : les législatives de juin 2022, en ne donnant qu'une majorité relative, ont contraint l'exécutif à négocier ou à passer en force texte par texte.`,
        },
        sources: [
          { label: `Programmes 2017 et 2022 — archives de campagne ; discours de la Sorbonne (26 septembre 2017) et de Belfort (10 février 2022), via vie-publique.fr`, url: 'https://www.vie-publique.fr', year: 2022 },
        ],
      },
      {
        id: 'mesures',
        titre: { fr: `Les principales mesures, une par une` },
        corps: {
          fr: `Ordonnances travail (2017) : réforme du code du travail dès l'été — défendue comme un assouplissement favorable à l'embauche, critiquée comme un recul des protections des salariés.\n\nFiscalité du capital (2018) : l'ISF devient l'IFI, recentré sur l'immobilier, et les revenus du capital sont taxés à 30 % (flat tax, PFU). Défendue comme un outil d'attractivité et d'investissement, dénoncée comme un « cadeau aux riches » ; les évaluations du comité de suivi de France Stratégie concluent à des effets débattus et difficiles à isoler.\n\nRéforme de la SNCF (2018) : fin du recrutement au statut de cheminot, ouverture à la concurrence — adoptée malgré une longue grève.\n\nTaxe d'habitation : supprimée progressivement pour les résidences principales.\n\nLoi « séparatisme » (2021) : renforcement du contrôle des associations et de l'instruction en famille, après l'assassinat de Samuel Paty (2020).\n\nRetraites (2023) : âge légal porté de 62 à 64 ans, adoption par 49.3, contestation sociale massive.\n\nLoi immigration (26 janvier 2024) : durcie au Parlement, puis partiellement censurée par le Conseil constitutionnel, qui écarte de nombreux articles ajoutés en cours de débat.\n\nFace à l'inflation, un « bouclier tarifaire » a plafonné les prix de l'énergie en 2022-2023.`,
        },
        sources: [
          { label: `Légifrance — ordonnances de 2017, lois de finances 2018, loi du 24 août 2021, LFRSS du 14 avril 2023, loi du 26 janvier 2024`, url: 'https://www.legifrance.gouv.fr', year: 2024 },
          { label: `France Stratégie — comité d'évaluation des réformes de la fiscalité du capital, rapports 2019-2023`, url: 'https://www.strategie.gouv.fr', year: 2023 },
        ],
      },
      {
        id: 'evenements',
        titre: { fr: `Les grands événements du mandat` },
        corps: {
          fr: `2018-2019 : les « gilets jaunes » — déclenché par la hausse de la taxe carbone, le mouvement occupe les ronds-points et manifeste chaque samedi pendant des mois ; le pouvoir répond par le gel de la taxe, le « grand débat national » et environ 10 milliards d'euros de mesures. 2020-2022 : la pandémie de Covid-19 — confinements, « quoi qu'il en coûte », plan de relance de 100 milliards, campagne vaccinale, plan France 2030. Octobre 2020 : assassinat de Samuel Paty, qui marque durablement le débat sur la laïcité et l'islamisme. Février 2022 : la Russie envahit l'Ukraine — la France apporte un soutien militaire et financier à Kiev et accueille des réfugiés ; s'ensuivent crise énergétique et poussée d'inflation. 2023 : contestation massive de la réforme des retraites, puis émeutes urbaines en juin-juillet après la mort du jeune Nahel M., tué par un policier lors d'un contrôle. 9 juin 2024 : dissolution surprise après la défaite aux européennes — l'Assemblée sort fragmentée en trois blocs, sans majorité. Décembre 2024 : le gouvernement de Michel Barnier est censuré le 4 décembre (première censure aboutie depuis 1962) ; le même mois, Notre-Dame de Paris rouvre, cinq ans après l'incendie. À l'été 2024, les Jeux olympiques de Paris sont une réussite organisationnelle largement saluée.`,
        },
        sources: [{ label: `Vie-publique.fr — chronologies 2017-2024 ; INA — archives des événements cités`, url: 'https://www.vie-publique.fr', year: 2024 }],
      },
      {
        id: 'gouverner',
        titre: { fr: `Sa manière de gouverner` },
        corps: {
          fr: `Un style présidentiel vertical, souvent qualifié de « jupitérien » : décisions concentrées à l'Élysée, Premiers ministres au rôle d'exécutants — six nommés entre 2017 et fin 2024 (Édouard Philippe, Jean Castex, Élisabeth Borne, Gabriel Attal — plus jeune Premier ministre de la Ve —, Michel Barnier, puis François Bayrou, nommé en décembre 2024 ; pour la suite, se reporter à la date de vérification de cette fiche). Ce style alterne avec des exercices de dialogue direct inventés dans l'urgence : grand débat national après les gilets jaunes, Convention citoyenne pour le climat.\n\nDes formules clivantes, largement documentées, ont marqué les esprits : « traverser la rue » pour trouver un emploi, les gares où l'on croise « des gens qui réussissent et des gens qui ne sont rien » (2017), ou l'envie d'« emmerder » les non-vaccinés (janvier 2022). Ses partisans y voient un franc-parler, ses adversaires un mépris de classe.\n\nAprès 2022, faute de majorité absolue, le recours au 49.3 devient intensif — 23 fois sous le seul gouvernement Borne, essentiellement pour les budgets et la réforme des retraites. Légal et utilisé par la plupart des gouvernements depuis 1958, cet outil est devenu, par sa fréquence, un symbole de la contestation démocratique du second mandat.`,
        },
        sources: [
          { label: `Assemblée nationale — engagements de responsabilité au titre de l'article 49 alinéa 3, XVIe législature`, url: 'https://www.assemblee-nationale.fr', year: 2024 },
          { label: `INA — archives des déclarations citées (2017-2022)`, url: 'https://www.ina.fr', year: 2022 },
        ],
      },
      {
        id: 'bilan',
        titre: { fr: `Le bilan économique et social — provisoire, mandat en cours` },
        corps: {
          fr: `Précaution essentielle : le mandat court jusqu'en 2027 — ce bilan est provisoire, arrêté aux données vérifiables à la date de vérification de cette fiche, et pourra être révisé.\n\nÉvolutions constatées : le chômage, autour de 9,5 % en 2017, est redescendu autour de 7-7,5 % — son plus bas niveau depuis les années 1980 ; l'apprentissage a explosé grâce à des aides massives ; une réindustrialisation partielle est engagée ; la croissance française a mieux résisté que celle de plusieurs voisins européens. En face : la dette publique dépasse 110 % du PIB et le déficit atteint environ 5 à 6 % du PIB en 2023-2024 — parmi les plus élevés de la zone euro.\n\nCe qui relève de ses choix : les politiques de l'offre (fiscalité du capital, réformes du travail et de l'assurance-chômage), l'apprentissage subventionné, le « quoi qu'il en coûte » — défendu comme nécessaire pour éviter l'effondrement pendant le Covid, critiqué comme une dérive budgétaire jamais corrigée. Ce qui relève du contexte : la pandémie mondiale, la crise énergétique liée à la guerre en Ukraine, l'inflation importée. Les économistes débattent du poids respectif de ces facteurs — dans la baisse du chômage comme dans le creusement des déficits, la conjoncture et les mesures de soutien jouent un rôle que personne ne sait chiffrer précisément.`,
        },
        sources: [
          { label: `INSEE — taux de chômage au sens du BIT (séries trimestrielles) ; dette et déficit publics au sens de Maastricht, comptes nationaux 2023-2024`, url: 'https://www.insee.fr', year: 2024, perimetre: `France hors Mayotte pour le chômage ; chiffres arrêtés à la date de vérification de cette fiche` },
        ],
      },
      {
        id: 'defenseurs',
        titre: { fr: `Ce que ses défenseurs retiennent` },
        corps: {
          fr: `Le réformateur : celui qui a fait ce que ses prédécesseurs annonçaient sans le faire — réforme du travail, fiscalité du capital, retraites — et ramené le chômage à son plus bas niveau depuis les années 1980, avec une réindustrialisation engagée et une attractivité record pour les investissements étrangers (sommets « Choose France »). Le protecteur dans la crise : le « quoi qu'il en coûte » aurait évité une vague de faillites et de licenciements pendant le Covid, et le bouclier tarifaire a contenu l'inflation énergétique mieux que chez plusieurs voisins. L'Européen : discours de la Sorbonne, plan de relance européen emprunté en commun, soutien constant à l'Ukraine — l'idée d'« Europe puissance » aurait progressé grâce à lui. Le modernisateur pragmatique : relance assumée du nucléaire (six EPR2 annoncés à Belfort en 2022), plan France 2030 pour les technologies d'avenir, dédoublement des classes de CP, JO de Paris 2024 réussis. Enfin, un argument politique : réélu en 2022, premier président à l'être hors cohabitation depuis de Gaulle — preuve, disent ses soutiens, que les Français ont validé la direction prise, même sans lui donner ensuite de majorité absolue.`,
        },
      },
      {
        id: 'opposants',
        titre: { fr: `Ce que ses opposants retiennent` },
        corps: {
          fr: `À gauche : le « président des riches » — suppression de l'ISF au profit de l'IFI, flat tax, réformes de l'assurance-chômage jugées punitives, retraite à 64 ans imposée par 49.3 contre des mois de manifestations et l'opposition de tous les syndicats. La méthode elle-même est mise en cause : verticalité, passages en force, conventions citoyennes dont les conclusions n'ont été que partiellement reprises.\n\nÀ droite et à l'extrême droite : la dérive des finances publiques (dette au-delà de 110 % du PIB, déficits parmi les plus élevés de la zone euro), une immigration jugée insuffisamment maîtrisée malgré la loi de 2024, et le sentiment d'un désordre croissant — émeutes de 2023, insécurité.\n\nCritique transversale, qui monte après 2022 : l'affaiblissement perçu des contre-pouvoirs et la crise démocratique — usage intensif du 49.3, Parlement contourné, puis la dissolution de 2024, décidée sans concertation, qui a produit une Assemblée ingouvernable et la première censure aboutie depuis 1962. Ses opposants de tous bords y voient la conséquence d'un pouvoir trop solitaire ; ces critiques portent sur des faits établis, mais leur interprétation — faute personnelle ou crise plus profonde du système — reste, elle, débattue.`,
        },
      },
      {
        id: 'heritage',
        titre: { fr: `Son héritage aujourd'hui — impossible à figer, mandat en cours` },
        corps: {
          fr: `Le mandat étant en cours jusqu'en 2027, parler d'« héritage » est prématuré : cette rubrique décrit des effets déjà observables, pas un legs définitif — le bilan reste provisoire et cette fiche s'arrête aux événements vérifiables.\n\nCe qui est déjà acquis : la recomposition du paysage politique. Son élection de 2017 a précipité l'effondrement des deux partis qui structuraient la vie politique depuis des décennies — PS et LR, laminés dès les législatives de 2017 — au profit d'une tripartition entre un bloc central, un bloc de gauche et un bloc d'extrême droite, installée dans les urnes depuis. Que cette recomposition lui survive ou non est précisément l'une des inconnues de 2027.\n\nCe qui est engagé : la relance du nucléaire et France 2030, dont les effets se mesureront sur des décennies ; une dette publique fortement accrue, qui contraindra ses successeurs quels qu'ils soient ; un rôle européen renforcé de la France sur la défense et le soutien à l'Ukraine.\n\nCe qui est ouvert : l'interprétation de la séquence post-dissolution — simple crise passagère ou révélateur d'un épuisement des institutions de la Ve République, le débat traverse tous les camps. L'histoire de cette présidence s'écrira aussi avec sa fin, qui n'a pas eu lieu.`,
        },
      },
    ],
  },

  // ── Chronologie ──────────────────────────────────────────────────────────────
  chronologie: {
    titre: { fr: `Depuis 2017 : une présidence en cours` },
    events: [
      { date: '7 mai 2017', titre: { fr: `L'élection surprise` }, detail: { fr: `Macron bat Marine Le Pen (66,10 %) à 39 ans — plus jeune président de la Ve République, premier élu hors des deux grands partis traditionnels. Les législatives donnent une large majorité à son mouvement ; PS et LR sont laminés.` }, source: { label: `Conseil constitutionnel — résultats 2017`, year: 2017 } },
      { date: '2017-2018', titre: { fr: `Les réformes économiques` }, detail: { fr: `Ordonnances travail, transformation de l'ISF en IFI et flat tax à 30 %, réforme de la SNCF, début de la suppression de la taxe d'habitation.` } },
      { date: 'nov. 2018', titre: { fr: `Les gilets jaunes` }, detail: { fr: `La hausse de la taxe carbone déclenche des mois de mobilisation sur les ronds-points et dans les rues. Réponse : gel de la taxe, grand débat national, environ 10 milliards d'euros d'annonces.` } },
      { date: '2020-2022', titre: { fr: `La pandémie de Covid-19` }, detail: { fr: `Confinements, « quoi qu'il en coûte », plan de relance de 100 milliards, plan France 2030. La réforme des retraites par points, engagée en 2019-2020, est abandonnée.` } },
      { date: 'févr. 2022', titre: { fr: `Guerre en Ukraine et discours de Belfort` }, detail: { fr: `La Russie envahit l'Ukraine : soutien militaire et financier français, accueil de réfugiés, crise énergétique et inflation (bouclier tarifaire). À Belfort, Macron annonce la relance du nucléaire (six EPR2).` } },
      { date: '24 avril 2022', titre: { fr: `Réélection — sans majorité absolue` }, detail: { fr: `Réélu avec 58,55 % face à Marine Le Pen — premier réélu hors cohabitation depuis de Gaulle. Mais en juin, les législatives ne donnent qu'une majorité relative : chaque texte devra être négocié ou imposé.` }, source: { label: `Conseil constitutionnel — résultats 2022`, year: 2022 } },
      { date: '2023', titre: { fr: `Retraites et émeutes` }, detail: { fr: `La retraite à 64 ans est adoptée par 49.3 après des mois de manifestations massives. En juin-juillet, la mort du jeune Nahel M., tué par un policier, déclenche plusieurs nuits d'émeutes urbaines.` } },
      { date: '26 janv. 2024', titre: { fr: `Loi immigration` }, detail: { fr: `La loi immigration, durcie au Parlement, est promulguée après une censure partielle du Conseil constitutionnel, qui écarte de nombreux articles ajoutés en cours de débat.` }, source: { label: `Conseil constitutionnel — décision du 25 janvier 2024`, year: 2024 } },
      { date: '9 juin 2024', titre: { fr: `La dissolution surprise` }, detail: { fr: `Au soir de la défaite aux européennes, Macron dissout l'Assemblée — un choix discrétionnaire que rien ne l'obligeait à faire. Résultat : trois blocs sans majorité, instabilité gouvernementale durable.` } },
      { date: 'été-déc. 2024', titre: { fr: `JO, censure, Notre-Dame` }, detail: { fr: `Les JO de Paris sont une réussite saluée. Le 4 décembre, le gouvernement Barnier est censuré — première censure aboutie depuis 1962 ; François Bayrou est nommé. Notre-Dame rouvre. Pour la suite : à la date de vérification de cette fiche.` } },
    ],
  },

  vraiFaux: ['vf-macron-invente-49-3', 'vf-macron-supprime-isf', 'vf-macron-chomage-merite', 'vf-macron-dissolution-obligatoire'],

  quiz: [
    {
      question: { fr: `Qu'est-ce qui distingue l'élection d'Emmanuel Macron en 2017 ?` },
      options: [
        { fr: `Il est le premier président élu au suffrage universel direct` },
        { fr: `À 39 ans, il est le plus jeune président de la Ve République et le premier élu hors des deux grands partis traditionnels` },
        { fr: `Il est élu dès le premier tour` },
        { fr: `Il est le premier président issu de la droite` },
      ],
      bonneReponse: 1,
      explication: { fr: `Élu le 7 mai 2017 avec 66,10 % face à Marine Le Pen, il devance tous les candidats des partis installés — dont il précipite l'effondrement : PS et LR sont laminés aux législatives qui suivent.` },
    },
    {
      question: { fr: `Comment la réforme des retraites de 2023 (64 ans) a-t-elle été adoptée ?` },
      options: [
        { fr: `Par référendum` },
        { fr: `Par un vote large de l'Assemblée nationale` },
        { fr: `Sans vote, par l'article 49.3 de la Constitution, malgré une contestation sociale massive` },
        { fr: `Elle n'a jamais été adoptée` },
      ],
      bonneReponse: 2,
      explication: { fr: `Faute de majorité absolue depuis juin 2022, le gouvernement Borne engage sa responsabilité (49.3) ; la motion de censure échoue de peu et la loi est promulguée en avril 2023, après des mois de manifestations.` },
    },
    {
      question: { fr: `La dissolution de l'Assemblée nationale du 9 juin 2024 était-elle obligatoire ?` },
      options: [
        { fr: `Oui, la Constitution l'imposait après la défaite aux européennes` },
        { fr: `Oui, le Conseil constitutionnel l'avait exigée` },
        { fr: `Non : c'est un pouvoir discrétionnaire du président, qui a choisi de dissoudre` },
        { fr: `Non, c'est le Premier ministre qui a dissous` },
      ],
      bonneReponse: 2,
      explication: { fr: `La dissolution (article 12) est une décision libre du président. Rien ne l'obligeait à dissoudre après les européennes — c'est un choix personnel, qui a produit une Assemblée fragmentée en trois blocs.` },
    },
    {
      question: { fr: `Qu'est devenu l'ISF sous Emmanuel Macron ?` },
      options: [
        { fr: `Il a été purement et simplement supprimé, sans remplacement` },
        { fr: `Il a été transformé en IFI, recentré sur le patrimoine immobilier, avec en parallèle une flat tax de 30 % sur les revenus du capital` },
        { fr: `Il a été doublé` },
        { fr: `Il n'a pas été modifié` },
      ],
      bonneReponse: 1,
      explication: { fr: `Depuis 2018, l'impôt sur la fortune ne porte plus que sur l'immobilier (IFI) et les revenus du capital sont taxés à 30 % (PFU). Les effets économiques de cette réforme restent débattus (rapports France Stratégie).` },
    },
    {
      question: { fr: `Que s'est-il passé le 4 décembre 2024 ?` },
      options: [
        { fr: `L'Assemblée nationale a censuré le gouvernement de Michel Barnier — première motion de censure aboutie depuis 1962` },
        { fr: `Emmanuel Macron a démissionné` },
        { fr: `Une nouvelle dissolution a été prononcée` },
        { fr: `La réforme des retraites a été abrogée` },
      ],
      bonneReponse: 0,
      explication: { fr: `Conséquence de l'Assemblée sans majorité issue de la dissolution : le gouvernement Barnier tombe après trois mois — la première censure aboutie depuis celle du gouvernement Pompidou en 1962. François Bayrou est ensuite nommé.` },
    },
  ],

  // ── 15. Pour aller plus loin (N4) ────────────────────────────────────────────
  level4: {
    items: [
      { kind: 'discours', titre: { fr: `Discours de la Sorbonne sur l'Europe — 26 septembre 2017` }, note: { fr: `Le texte fondateur de son projet européen (« souveraineté européenne »), à comparer avec ce qui a été réalisé depuis.` }, url: 'https://www.vie-publique.fr' },
      { kind: 'discours', titre: { fr: `Discours de Belfort — 10 février 2022` }, note: { fr: `L'annonce de la relance du nucléaire français : six réacteurs EPR2 et la prolongation du parc existant.` }, url: 'https://www.vie-publique.fr' },
      { kind: 'texte', titre: { fr: `Décision du Conseil constitutionnel sur la loi immigration — 25 janvier 2024` }, note: { fr: `La censure partielle qui a écarté de nombreux articles ajoutés au Parlement : un cas d'école sur le contrôle de constitutionnalité.` }, url: 'https://www.conseil-constitutionnel.fr' },
      { kind: 'donnees', titre: { fr: `INSEE — chômage, dette et déficit publics depuis 2017` }, note: { fr: `Pour vérifier soi-même le bilan macroéconomique provisoire, avec les définitions et les dates exactes.` }, url: 'https://www.insee.fr' },
      { kind: 'donnees', titre: { fr: `France Stratégie — comité d'évaluation des réformes de la fiscalité du capital` }, note: { fr: `Les rapports officiels d'évaluation de la suppression de l'ISF et de la flat tax : effets réels débattus, à lire avant de trancher.` }, url: 'https://www.strategie.gouv.fr' },
      { kind: 'lien', titre: { fr: `Assemblée nationale — engagements au titre de l'article 49 alinéa 3` }, note: { fr: `Le décompte officiel des 49.3, gouvernement par gouvernement, pour remettre la pratique en perspective historique.` }, url: 'https://www.assemblee-nationale.fr' },
    ],
  },

  figuresLiees: [
    { nom: 'Édouard Philippe', note: { fr: `premier Premier ministre (2017-2020) — fiche à venir` } },
    { nom: 'Élisabeth Borne', note: { fr: `Première ministre des retraites et des 49.3 (2022-2024) — fiche à venir` } },
    { nom: 'Marine Le Pen', note: { fr: `son adversaire des seconds tours de 2017 et 2022 — fiche à venir` } },
    { nom: 'François Hollande', note: { fr: `le président dont il fut ministre de l'Économie — fiche à venir` } },
    { nom: 'Gabriel Attal', note: { fr: `plus jeune Premier ministre de la Ve (2024) — fiche à venir` } },
  ],

  motsAssocies: ['49-3', 'motion-de-censure', 'dette-publique', 'inflation'],
  continuerAvec: [
    { slug: 'president-de-la-republique' },
    { slug: 'inflation' },
    { slug: 'oqtf' },
  ],

  sources: [
    { label: `Conseil constitutionnel — résultats officiels des scrutins de 2017, 2022, 2024 ; décision du 25 janvier 2024 sur la loi immigration`, url: 'https://www.conseil-constitutionnel.fr', year: 2024 },
    { label: `Légifrance — textes des lois et ordonnances citées (2017-2024)`, url: 'https://www.legifrance.gouv.fr', year: 2024 },
    { label: `INSEE — taux de chômage au sens du BIT, dette et déficit publics au sens de Maastricht`, url: 'https://www.insee.fr', year: 2024, perimetre: `chiffres arrêtés à la date de vérification de cette fiche — mandat en cours, données susceptibles d'évoluer` },
    { label: `Vie-publique.fr — dossiers et chronologies des quinquennats 2017-2022 et 2022-…`, url: 'https://www.vie-publique.fr', year: 2024 },
    { label: `France Stratégie — comité d'évaluation des réformes de la fiscalité du capital (rapports 2019-2023)`, url: 'https://www.strategie.gouv.fr', year: 2023 },
  ],
};
