/**
 * Fiche débat « La laïcité » — modèle debat (docs/jyconnaisrien/02, §9).
 * Thèse éditoriale : tout le monde s'en réclame, peu savent ce que dit vraiment
 * le droit. Régime periodic : les grands textes bougent lentement, mais l'école
 * et la jurisprudence produisent régulièrement du nouveau.
 * Seules citations autorisées : loi de 1905 (art. 1 et 2), Constitution de 1958 (art. 1er).
 */

export default {
  slug: 'laicite',
  type: 'debat',
  porte: 'F6',
  title: { fr: `La laïcité`, en: 'Secularism (laïcité)' },
  icon: '🕊️',
  difficulty: 2,
  famille: 'dossier',
  updatedAt: '2026-07-12',
  freshness: { type: 'periodic', reviewEveryMonths: 12, lastReviewedAt: '2026-07-12' },

  // ── N1 ──────────────────────────────────────────────────────────────────────
  level1: {
    fr: `La laïcité est le principe qui sépare l'État des religions en France. La loi de 1905 garantit d'abord une liberté : croire, ne pas croire, changer de conviction, pratiquer un culte. Elle impose la neutralité à l'État et à ses agents — pas aux citoyens. Tout le monde s'en réclame dans le débat politique, mais tous ne lui donnent pas le même sens : c'est là que commence le vrai désaccord.`,
  },

  // ── N2 ──────────────────────────────────────────────────────────────────────
  level2: {
    sections: [
      {
        titre: { fr: `Pourquoi en parle-t-on ?` },
        corps: {
          fr: `La laïcité est probablement le mot le plus invoqué et le moins défini du débat français. Chaque polémique — voile, menus de cantine, burkini, abaya, crèches de Noël en mairie — est présentée comme une « affaire de laïcité », et chaque camp accuse l'autre de la trahir. Or beaucoup de ces controverses se règlent en réalité par des textes précis, que peu de gens ont lus : la loi de 1905 tient en quelques articles, et le mot « laïcité » n'y figure même pas. Connaître ce que le droit dit — et ne dit pas — permet de repérer immédiatement quand un débat porte vraiment sur la laïcité, et quand il porte sur autre chose sous son nom.`,
        },
      },
      {
        titre: { fr: `Ce que dit vraiment la loi de 1905` },
        corps: {
          fr: `La loi du 9 décembre 1905 de séparation des Églises et de l'État commence par une garantie, pas par une interdiction. Article 1er : « La République assure la liberté de conscience. Elle garantit le libre exercice des cultes sous les seules restrictions édictées ci-après dans l'intérêt de l'ordre public. » Article 2 : « La République ne reconnaît, ne salarie ni ne subventionne aucun culte. »\n\nL'ordre de ces deux articles n'est pas un détail : la laïcité protège d'abord la liberté de croire et de ne pas croire ; la neutralité de l'État (article 2) est le moyen de cette liberté, pas une arme contre les religions. La Constitution de 1958 l'a hissée au rang de principe fondateur, dès son article 1er : « La France est une République indivisible, laïque, démocratique et sociale. »`,
        },
        sources: [
          { label: `Loi du 9 décembre 1905 concernant la séparation des Églises et de l'État — texte intégral (Légifrance)`, url: 'https://www.legifrance.gouv.fr', year: 1905 },
          { label: `Constitution du 4 octobre 1958, article 1er (Légifrance)`, url: 'https://www.legifrance.gouv.fr', year: 1958 },
        ],
      },
      {
        titre: { fr: `Qui doit être neutre ?` },
        brique: 'a-retenir',
        corps: {
          fr: `La neutralité religieuse s'impose à l'État et à ses agents : fonctionnaires et contractuels, enseignants des écoles publiques, policiers, personnels d'accueil — dans l'exercice de leurs fonctions. Elle ne s'impose PAS aux usagers des services publics ni aux passants dans la rue : un citoyen peut porter un signe religieux à la mairie, à l'hôpital ou dans le bus. Les restrictions qui existent (élèves des écoles publiques en 2004, dissimulation du visage en 2010) sont des exceptions précises, votées par des lois spécifiques — pas des conséquences automatiques de la laïcité.`,
        },
      },
      {
        titre: { fr: `Les mots indispensables` },
        brique: 'glossaire',
        termes: [
          { nom: { fr: 'Neutralité' }, def: { fr: `Obligation de ne pas manifester ses convictions religieuses (ou de ne pas favoriser un culte) dans l'exercice d'une mission publique. Elle pèse sur l'institution et ses agents, pas sur les citoyens.` } },
          { nom: { fr: 'Agent public / usager' }, def: { fr: `Distinction clé : l'agent (celui qui incarne le service public) est tenu à la neutralité ; l'usager (celui qui l'utilise) ne l'est pas, sauf exception prévue par une loi.` } },
          { nom: { fr: 'Signes ostensibles' }, def: { fr: `Terme de la loi du 15 mars 2004 : signes et tenues qui manifestent ostensiblement une appartenance religieuse (grand voile, kippa, grande croix), interdits aux élèves des écoles, collèges et lycées publics.` } },
          { nom: { fr: 'Espace public' }, def: { fr: `La rue, les parcs, les transports… La laïcité n'y impose aucune neutralité générale : la seule restriction nationale est l'interdiction de dissimuler son visage (loi de 2010), fondée sur l'ordre public.` } },
          { nom: { fr: 'Concordat' }, def: { fr: `Accord entre un État et un culte organisant leurs relations (reconnaissance, financement). Celui de 1801 a été abrogé par la loi de 1905 — sauf en Alsace-Moselle, où il s'applique toujours.` } },
        ],
      },
      {
        titre: { fr: `Laïcité ≠ athéisme d'État` },
        brique: 'confusion',
        corps: {
          fr: `Première confusion : la laïcité ne consiste pas à faire reculer les religions ni à promouvoir l'incroyance. Un État athée qui combattrait les cultes violerait la loi de 1905 autant qu'un État confessionnel — dans les deux cas, l'État prendrait parti sur la religion au lieu d'être neutre.\n\nSeconde confusion : la neutralité des agents publics n'est pas une neutralité des citoyens. Exiger d'un passant, d'un client, d'un étudiant ou d'un usager qu'il « soit laïque » comme un fonctionnaire renverse le principe : c'est l'État qui est laïque pour que les citoyens soient libres.`,
        },
      },
    ],
  },

  // ── N3 ──────────────────────────────────────────────────────────────────────
  level3: {
    sections: [
      {
        id: 'histoire',
        titre: { fr: `D'où vient la laïcité française` },
        corps: {
          fr: `1789 : la Révolution proclame la liberté religieuse et retire au catholicisme son statut de religion d'État — le lien entre citoyenneté et religion commence à se défaire. En 1801, Napoléon organise au contraire une cohabitation : le concordat reconnaît et salarie les cultes (catholique, puis protestants et israélite). C'est ce régime que la IIIe République va démonter, en commençant par l'école : lois Ferry de 1881 (école gratuite) et 1882 (instruction obligatoire, enseignement public laïque), puis loi Goblet de 1886, qui confie l'enseignement public à un personnel exclusivement laïque.\n\nLa séparation elle-même, en 1905, se fait dans la douleur : elle arrive après vingt-cinq ans d'affrontement entre républicains anticléricaux et Église catholique, et son application déclenche la querelle des inventaires (1906) — l'inventaire des biens des églises tourne à l'affrontement physique dans plusieurs régions, avec des morts. Le texte finalement porté par Aristide Briand est pourtant un compromis : séparation, mais liberté de culte garantie. L'apaisement vient en quelques décennies, et la laïcité devient un principe constitutionnel en 1946 puis en 1958. Détail révélateur : le mot « laïcité » ne figure pas dans la loi de 1905 — c'est la Constitution qui l'emploie.`,
        },
        sources: [
          { label: `Jean Baubérot, Histoire de la laïcité en France, PUF, « Que sais-je ? »`, year: 2021 },
          { label: `Vie-publique.fr — dossier « La laïcité » (chronologie 1789-1905)`, url: 'https://www.vie-publique.fr', year: 2025 },
        ],
      },
      {
        id: 'ce-que-la-loi-permet-et-interdit',
        titre: { fr: `Ce que le droit permet et interdit, précisément` },
        corps: {
          fr: `Agents publics : neutralité stricte pendant le service — aucun signe religieux, aucune manifestation de conviction. La loi du 24 août 2021 a étendu cette obligation aux salariés des entreprises privées qui exécutent un service public (transports, par exemple).\n\nÉlèves des écoles publiques : la loi du 15 mars 2004 interdit les signes et tenues manifestant ostensiblement une appartenance religieuse dans les écoles, collèges et lycées publics — et seulement là. Les signes discrets restent autorisés.\n\nEspace public : la loi du 11 octobre 2010 interdit la dissimulation du visage (voile intégral notamment). Nuance importante et documentée : ce texte n'est pas fondé sur la laïcité mais sur l'ordre public et les exigences de la vie en société — c'est sur ce terrain que la Cour européenne des droits de l'homme l'a validé en 2014. En dehors du visage dissimulé, porter un signe religieux dans la rue est parfaitement légal.\n\nUsagers des services publics : aucune obligation générale de neutralité — à la mairie, à l'hôpital, au tribunal, on peut porter un signe religieux.\n\nEntreprises privées : pas de laïcité au sens strict (la loi de 1905 vise l'État), mais le règlement intérieur peut restreindre l'expression religieuse sous conditions posées par la jurisprudence française et européenne : clause générale et indifférenciée, justifiée par la nature de l'activité, proportionnée. Le code du travail le prévoit expressément depuis 2016.\n\nUniversités : les étudiants sont des usagers majeurs — la loi de 2004 ne s'applique pas à eux. Leurs enseignants, agents publics, restent tenus à la neutralité.`,
        },
        sources: [
          { label: `Légifrance — lois du 15 mars 2004, du 11 octobre 2010 et du 24 août 2021`, url: 'https://www.legifrance.gouv.fr', year: 2021 },
          { label: `CEDH, S.A.S. c. France, 1er juillet 2014 — validation de la loi de 2010`, url: 'https://hudoc.echr.coe.int', year: 2014 },
        ],
      },
      {
        id: 'alsace-moselle',
        titre: { fr: `Alsace-Moselle : là où 1905 ne s'applique pas` },
        corps: {
          fr: `En 1905, l'Alsace et la Moselle sont allemandes (annexées depuis 1871) : la loi de séparation n'y a jamais été appliquée. À leur retour à la France en 1918, les gouvernements successifs choisissent de maintenir le droit local — dont le régime concordataire de 1801 : quatre cultes reconnus (catholique, luthérien, réformé, israélite), dont les ministres — prêtres, pasteurs, rabbins — sont salariés par l'État, et un enseignement religieux organisé à l'école publique, avec possibilité de dispense.\n\nCette exception a survécu à tous les projets d'alignement, par attachement local et prudence politique de tous les bords. Le Conseil constitutionnel l'a jugée conforme à la Constitution en 2013 : le principe de laïcité n'a pas entendu remettre en cause les régimes particuliers antérieurs maintenus par la République. D'autres régimes dérogatoires existent outre-mer, notamment en Guyane. La « République laïque » salarie donc bel et bien des ministres du culte sur une partie de son territoire — l'exception française à la française, qu'aucun gouvernement n'a voulu rouvrir.`,
        },
        sources: [
          { label: `Conseil constitutionnel — décision n° 2012-297 QPC du 21 février 2013 (traitement des pasteurs des églises consistoriales)`, url: 'https://www.conseil-constitutionnel.fr', year: 2013 },
        ],
      },
      {
        id: 'financements',
        titre: { fr: `L'argent public et les cultes : les vraies règles` },
        corps: {
          fr: `« Ne subventionne aucun culte » se lit avec ses exceptions, toutes prévues ou organisées par la loi. Les édifices religieux construits avant 1905 (l'immense majorité des églises) appartiennent aux communes — aux départements et à l'État pour les cathédrales — qui en assument l'entretien : de l'argent public finance donc massivement des bâtiments cultuels, au titre du patrimoine. La loi de 1905 elle-même autorise le financement des aumôneries (prisons, hôpitaux, armées, internats), précisément pour garantir le libre exercice du culte à ceux qui ne peuvent pas sortir.\n\nS'y ajoute l'école : la loi Debré de 1959 permet aux écoles privées — très majoritairement catholiques — de passer contrat avec l'État, qui paie leurs enseignants en contrepartie du respect des programmes et de l'accueil de tous les élèves. Enfin, les dons aux associations cultuelles ouvrent droit à des réductions d'impôt, et les communes peuvent faciliter la construction de lieux de culte par des baux de très longue durée à loyer modique. La séparation financière est donc réelle, mais moins absolue que le slogan.`,
        },
        sources: [
          { label: `Loi n° 59-1557 du 31 décembre 1959 (loi Debré) — Légifrance`, url: 'https://www.legifrance.gouv.fr', year: 1959 },
          { label: `Vie-publique.fr — fiches « le financement des cultes » et « les édifices religieux »`, url: 'https://www.vie-publique.fr', year: 2025 },
        ],
      },
      {
        id: 'deux-conceptions',
        titre: { fr: `Deux laïcités se disputent le même mot` },
        corps: {
          fr: `Derrière l'unanimité de façade, deux conceptions s'affrontent — et c'est le point central pour comprendre le débat. La laïcité « libérale » lit 1905 comme une loi de liberté : l'État et ses agents sont neutres, et cette neutralité s'arrête là ; les individus — usagers, étudiants, passants, salariés — expriment leurs convictions comme ils l'entendent, sous la seule limite de l'ordre public. La laïcité « extensive », dite parfois « de combat », estime que la visibilité religieuse fait pression sur la société : elle veut étendre la neutralité au-delà des agents — aux usagers, à l'université, au sport, voire à la rue.\n\nLes deux camps se réclament de 1905, textes à l'appui : les libéraux citent l'article 1er (la liberté d'abord), les extensifs invoquent l'esprit d'émancipation de la loi. Et ce clivage TRAVERSE les familles politiques au lieu de les séparer : la gauche est divisée entre tradition anticléricale stricte et défense des libertés individuelles ; la droite entre libéralisme, attachement aux racines chrétiennes (peu compatible avec une neutralité totale) et fermeté vis-à-vis de l'islam. Aucun camp n'est homogène sur ce sujet — quiconque présente la laïcité comme un marqueur simple gauche-droite se trompe ou simplifie.`,
        },
        sources: [
          { label: `Patrick Weil, De la laïcité en France, Grasset, 2021`, year: 2021 },
          { label: `Jean Baubérot, Histoire de la laïcité en France, PUF, « Que sais-je ? » — typologie des laïcités`, year: 2021 },
        ],
      },
      {
        id: 'ecole',
        titre: { fr: `L'école, front principal depuis 140 ans` },
        corps: {
          fr: `La laïcité française s'est construite à l'école et s'y rejoue sans cesse : c'est là que la République forme des citoyens supposés libres de tout dogme, et là que passent les enfants de toutes les familles. Après les lois Ferry et Goblet, le front se déplace en 1989 avec l'affaire des collégiennes voilées de Creil : le Conseil d'État, consulté, répond que le port d'un signe religieux par une élève n'est pas en soi incompatible avec la laïcité — tout dépend du comportement. Quinze ans de gestion au cas par cas suivent, jusqu'à la loi du 15 mars 2004, qui tranche pour l'interdiction des signes ostensibles à l'école publique. Une charte de la laïcité est affichée dans les établissements depuis 2013.\n\nDeux dates récentes ont marqué le sujet. Le 16 octobre 2020, Samuel Paty, professeur d'histoire-géographie, est assassiné pour avoir montré des caricatures de Mahomet lors d'un cours sur la liberté d'expression — un choc national qui a replacé la protection des enseignants au centre du débat. En septembre 2023, le ministère interdit le port de l'abaya à l'école ; saisi en référé, le Conseil d'État rejette le recours et laisse la mesure s'appliquer. À chaque rentrée, l'école reste le lieu où la France teste les limites de son modèle.`,
        },
        sources: [
          { label: `Loi n° 2004-228 du 15 mars 2004 — Légifrance ; Conseil d'État, avis du 27 novembre 1989`, url: 'https://www.legifrance.gouv.fr', year: 2004 },
          { label: `Conseil d'État — ordonnance de référé du 7 septembre 2023 (abaya)`, url: 'https://www.conseil-etat.fr', year: 2023 },
        ],
      },
      {
        id: 'positions',
        titre: { fr: `Les grandes positions dans le débat` },
        brique: 'visions',
        visions: [
          {
            label: { fr: `Laïcité libérale — défendue à gauche, au centre et chez une partie des juristes` },
            couleur: 'green',
            corps: { fr: `La loi de 1905 est une loi de liberté : l'État est neutre pour que les citoyens ne le soient pas. Il faut appliquer les textes existants sans les étendre — pas de neutralité pour les usagers, les étudiants ou les accompagnatrices scolaires, et des restrictions uniquement en cas de trouble à l'ordre public. Étendre sans cesse la neutralité stigmatiserait de fait une religion et trahirait l'esprit de 1905.` },
          },
          {
            label: { fr: `Laïcité républicaine stricte — présente à gauche comme à droite` },
            couleur: 'blue',
            corps: { fr: `L'école et les services publics doivent rester des sanctuaires : défense ferme de la loi de 2004, de la neutralité des agents et des enseignants, vigilance active contre les pressions religieuses sur les services publics (contestations de cours, demandes d'aménagements). Cette position ne demande pas d'étendre la neutralité à la rue, mais refuse tout recul dans la sphère publique au sens strict.` },
          },
          {
            label: { fr: `Laïcité extensive — portée surtout par la droite nationale et une partie de la droite, avec des relais à gauche` },
            couleur: 'purple',
            corps: { fr: `La visibilité religieuse — surtout islamique — est vue comme une pression communautaire sur la société : il faudrait étendre la neutralité aux usagers des services publics, aux accompagnatrices de sorties scolaires, à l'université, au sport, voire à certains espaces publics. Chez certains, l'argument laïque se mêle à un argument identitaire sur la culture française — qui dépasse la laïcité juridique de 1905, laquelle protège tous les cultes également.` },
          },
          {
            label: { fr: `Coopération et accommodements — élus locaux, représentants des cultes, tradition démocrate-chrétienne` },
            couleur: 'amber',
            corps: { fr: `Plutôt qu'une séparation rigide, une relation organisée : défense du régime d'Alsace-Moselle, dialogue institutionnel avec les cultes, financement encadré des lieux de culte pour limiter la dépendance à des fonds étrangers. Cette position, minoritaire dans le discours mais influente dans la pratique locale, rappelle que la République négocie avec les religions depuis 1905 — aumôneries, écoles sous contrat, entretien des églises.` },
          },
        ],
      },
      {
        id: 'desaccords',
        titre: { fr: `Ce qui fait vraiment désaccord` },
        corps: {
          fr: `Trois questions structurent le débat, indépendamment des étiquettes partisanes. D'abord le périmètre de la neutralité : doit-elle s'arrêter aux agents de l'État (lecture libérale), englober tout ce qui touche au service public (lecture stricte), ou s'étendre à l'espace social (lecture extensive) ? Ensuite, la nature du risque principal : les uns voient d'abord une pression religieuse croissante sur la société — l'école en première ligne — les autres d'abord un risque de stigmatisation d'une minorité sous couvert de principe universel. Enfin, la lecture même de 1905 : loi de liberté qui protège les croyants de l'État, ou loi d'émancipation qui protège la société des religions ?\n\nCes trois lignes de fracture ne recoupent pas le clivage gauche-droite : on trouve des « stricts » et des « libéraux » dans presque chaque parti. C'est pourquoi les majorités parlementaires sur ces sujets (2004, 2010, 2021) ont été larges et transpartisanes — et pourquoi les désaccords les plus vifs ont souvent lieu à l'intérieur des camps.`,
        },
      },
      {
        id: 'ailleurs',
        titre: { fr: `Ce qui existe dans d'autres pays` },
        corps: {
          fr: `La France n'est pas le seul pays à séparer l'État des religions — mais son modèle est singulier. Les États-Unis pratiquent une séparation constitutionnelle stricte (l'État ne peut établir aucune religion) tout en laissant la religion très présente dans la vie publique : serments, devise nationale à référence religieuse, discours politiques. Le Royaume-Uni fait l'inverse : une religion officiellement établie (l'Église d'Angleterre, avec le monarque à sa tête), mais une approche multiculturaliste très tolérante envers les signes religieux, y compris chez les policiers. L'Allemagne et l'Italie ont des régimes de coopération : impôt d'Église collecté par l'administration allemande, concordats et accords avec les Églises, cours de religion à l'école publique. La Turquie et le Mexique ont inscrit des laïcités parfois plus combatives que la française dans leurs constitutions.\n\nLa singularité française n'est donc pas la séparation elle-même, mais sa combinaison : neutralité stricte des agents publics, école publique laïque conçue comme creuset de la citoyenneté, et mémoire d'un conflit fondateur avec l'Église catholique. Comparer aide à distinguer ce qui relève du principe et ce qui relève de l'histoire nationale.`,
        },
        sources: [
          { label: `Vie-publique.fr — la laïcité dans le monde : panorama comparé`, url: 'https://www.vie-publique.fr', year: 2025 },
        ],
      },
      {
        id: 'mesures-prises',
        titre: { fr: `Ce qui a déjà été fait en France` },
        corps: {
          fr: `Depuis vingt ans, le droit a été précisé par touches successives, à chaque fois par des majorités larges. La loi du 15 mars 2004 a interdit les signes ostensibles aux élèves des écoles publiques. La loi du 11 octobre 2010 a interdit la dissimulation du visage dans l'espace public — sur le fondement de l'ordre public, et validée par la Cour européenne des droits de l'homme en 2014. Des chartes ont formalisé les règles : charte de la laïcité dans les services publics (2007), charte de la laïcité à l'école, affichée dans tous les établissements (2013). Un Observatoire de la laïcité a fonctionné de 2013 à 2021, remplacé par un Comité interministériel de la laïcité.\n\nDernier grand texte : la loi du 24 août 2021 « confortant le respect des principes de la République », qui a créé le contrat d'engagement républicain pour les associations subventionnées, étendu la neutralité aux salariés des délégataires de service public, soumis l'instruction en famille à autorisation, renforcé le contrôle des associations cultuelles et de leurs financements étrangers, et créé un délit de menaces contre les agents publics à des fins d'obtention de dérogations. En 2023, la note de service interdisant l'abaya à l'école a été confirmée par le juge des référés du Conseil d'État. Toutes ces mesures sont en vigueur.`,
        },
        sources: [
          { label: `Loi n° 2021-1109 du 24 août 2021 confortant le respect des principes de la République — Légifrance`, url: 'https://www.legifrance.gouv.fr', year: 2021 },
          { label: `Vie-publique.fr — dossier « loi confortant le respect des principes de la République »`, url: 'https://www.vie-publique.fr', year: 2021 },
        ],
      },
      {
        id: 'se-faire-une-opinion',
        titre: { fr: `Questions pour se faire sa propre opinion` },
        corps: {
          fr: `La neutralité religieuse doit-elle s'arrêter aux agents de l'État, ou s'étendre à d'autres — usagers, étudiants, accompagnatrices scolaires, sportifs ? Voyez-vous dans l'affichage religieux en société l'exercice d'une liberté, ou une pression sur ceux qui ne croient pas — et votre réponse serait-elle la même pour toutes les religions ? Faut-il aligner l'Alsace-Moselle sur le droit commun, au nom de la cohérence, ou préserver un régime qui fonctionne, au nom de l'histoire ? L'État doit-il aider au financement de lieux de culte pour limiter les influences étrangères, ou s'en tenir à une abstention totale ? Enfin : ce qui vous dérange dans telle ou telle polémique relève-t-il de la laïcité au sens du droit, ou d'autre chose — sécurité, égalité femmes-hommes, identité culturelle ? Répondre à ces cinq questions situe précisément votre conception de la laïcité — et vous permet de reconnaître celle de ceux qui parlent en son nom.`,
        },
      },
    ],
  },

  vraiFaux: ['vf-laicite-espace-public', 'vf-laicite-1905-voile', 'vf-laicite-seul-pays', 'vf-laicite-alsace-moselle'],

  quiz: [
    {
      question: { fr: `Que dit l'article 1er de la loi de 1905 ?` },
      options: [
        { fr: `Il interdit les signes religieux dans l'espace public` },
        { fr: `Il assure la liberté de conscience et garantit le libre exercice des cultes` },
        { fr: `Il proclame que la France est athée` },
        { fr: `Il interdit le financement des écoles privées` },
      ],
      bonneReponse: 1,
      explication: { fr: `La loi de 1905 commence par une garantie de liberté — croire, ne pas croire, pratiquer — sous la seule réserve de l'ordre public. La neutralité de l'État (article 2 : ne reconnaît, ne salarie ni ne subventionne aucun culte) est au service de cette liberté.` },
    },
    {
      question: { fr: `Qui est tenu à la neutralité religieuse ?` },
      options: [
        { fr: `Tous les citoyens, partout` },
        { fr: `Les agents publics dans l'exercice de leurs fonctions — pas les usagers ni les passants` },
        { fr: `Uniquement les ministres du gouvernement` },
        { fr: `Toute personne entrant dans un bâtiment public` },
      ],
      bonneReponse: 1,
      explication: { fr: `La neutralité pèse sur l'État et ceux qui l'incarnent. Les usagers des services publics peuvent porter un signe religieux à la mairie, à l'hôpital ou au tribunal. Les exceptions (élèves des écoles publiques depuis 2004, visage dissimulé depuis 2010) résultent de lois spécifiques.` },
    },
    {
      question: { fr: `À qui s'applique la loi du 15 mars 2004 sur les signes ostensibles ?` },
      options: [
        { fr: `À tout le monde dans la rue` },
        { fr: `Aux étudiants des universités` },
        { fr: `Aux élèves des écoles, collèges et lycées publics` },
        { fr: `Aux salariés des entreprises privées` },
      ],
      bonneReponse: 2,
      explication: { fr: `Le périmètre de la loi de 2004 est précis : les élèves des établissements scolaires publics. Les étudiants à l'université, usagers majeurs, ne sont pas concernés ; les entreprises privées relèvent d'autres règles (règlement intérieur sous conditions posées par la jurisprudence).` },
    },
    {
      question: { fr: `Sur quel fondement la loi de 2010 interdit-elle la dissimulation du visage ?` },
      options: [
        { fr: `Sur la laïcité et la loi de 1905` },
        { fr: `Sur l'ordre public et les exigences de la vie en société` },
        { fr: `Sur une directive européenne` },
        { fr: `Sur le règlement intérieur des communes` },
      ],
      bonneReponse: 1,
      explication: { fr: `Nuance importante : la loi du 11 octobre 2010 n'est pas un texte de laïcité au sens strict. Elle repose sur l'ordre public et le vivre-ensemble — et c'est sur ce terrain que la Cour européenne des droits de l'homme l'a validée en 2014. La laïcité, elle, n'impose rien aux passants.` },
    },
    {
      question: { fr: `Qu'est-ce qui distingue l'Alsace-Moselle du reste de la France ?` },
      options: [
        { fr: `La loi de 1905 y est appliquée plus strictement` },
        { fr: `Le régime concordataire y subsiste : des ministres du culte y sont salariés par l'État` },
        { fr: `Les religions y sont interdites à l'école` },
        { fr: `Rien, le droit y est identique` },
      ],
      bonneReponse: 1,
      explication: { fr: `Allemandes en 1905, l'Alsace et la Moselle n'ont jamais été soumises à la loi de séparation. Le concordat de 1801 y survit : quatre cultes reconnus, ministres salariés par l'État, enseignement religieux à l'école publique avec dispense possible. Le Conseil constitutionnel a jugé ce régime conforme en 2013.` },
    },
  ],

  // ── N4 ──────────────────────────────────────────────────────────────────────
  level4: {
    items: [
      { kind: 'texte', titre: { fr: `Loi du 9 décembre 1905 concernant la séparation des Églises et de l'État — texte intégral` }, note: { fr: `Quelques pages seulement : le texte le plus invoqué et le moins lu du débat français mérite dix minutes de lecture directe.` }, url: 'https://www.legifrance.gouv.fr' },
      { kind: 'texte', titre: { fr: `CEDH, S.A.S. c. France — arrêt du 1er juillet 2014` }, note: { fr: `La Cour européenne valide la loi de 2010 sur la dissimulation du visage, au nom du vivre-ensemble — en écartant l'argument de la laïcité. Le raisonnement éclaire la différence entre les deux fondements.` }, url: 'https://hudoc.echr.coe.int' },
      { kind: 'donnees', titre: { fr: `Rapports annuels de l'Observatoire de la laïcité (2013-2021), puis travaux du Comité interministériel de la laïcité` }, note: { fr: `États des lieux documentés, cas concrets et rappels du droit applicable — la mémoire administrative du sujet.` }, url: 'https://www.gouvernement.fr' },
      { kind: 'biblio', titre: { fr: `Jean Baubérot, Histoire de la laïcité en France — PUF, « Que sais-je ? »` }, note: { fr: `La synthèse historique de référence, par l'historien qui a théorisé la pluralité des laïcités françaises.` } },
      { kind: 'biblio', titre: { fr: `Patrick Weil, De la laïcité en France — Grasset, 2021` }, note: { fr: `Une défense argumentée de la lecture libérale de 1905, appuyée sur l'histoire de la loi et sa jurisprudence.` } },
      { kind: 'lien', titre: { fr: `Vie-publique.fr — dossier « La laïcité »` }, note: { fr: `Chronologies, fiches sur le financement des cultes, l'école et les textes en vigueur — la porte d'entrée institutionnelle la plus claire.` }, url: 'https://www.vie-publique.fr' },
    ],
  },

  motsAssocies: [
    { label: { fr: `Liberté d'expression` }, soon: true },
    { label: { fr: 'Communautarisme' }, soon: true },
    { slug: 'oqtf' },
  ],
  continuerAvec: [
    { slug: 'gauche' },
    { slug: 'droite' },
    { slug: 'immigration', label: { fr: `L'immigration (grand débat)` }, soon: true },
  ],

  sources: [
    { label: `Loi du 9 décembre 1905 concernant la séparation des Églises et de l'État (Légifrance)`, url: 'https://www.legifrance.gouv.fr', year: 1905, perimetre: `non applicable en Alsace-Moselle ; régimes particuliers outre-mer` },
    { label: `Légifrance — lois du 15 mars 2004, du 11 octobre 2010 et du 24 août 2021`, url: 'https://www.legifrance.gouv.fr', year: 2021 },
    { label: `Conseil constitutionnel — décision n° 2012-297 QPC du 21 février 2013 (régime des cultes d'Alsace-Moselle)`, url: 'https://www.conseil-constitutionnel.fr', year: 2013 },
    { label: `CEDH, S.A.S. c. France, 1er juillet 2014 — dissimulation du visage`, url: 'https://hudoc.echr.coe.int', year: 2014 },
    { label: `Vie-publique.fr — dossier « La laïcité » : chronologies, financement des cultes, école`, url: 'https://www.vie-publique.fr', year: 2025 },
  ],
};
