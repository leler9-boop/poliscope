/**
 * Fiche débat « L'Union européenne » — mi-institution, mi-débat : qui décide quoi
 * à Bruxelles (schéma simple, qui est qui, ce que l'UE ne décide PAS), et les
 * visions qui s'affrontent — un clivage qui traverse gauche et droite depuis
 * Maastricht. Modèle debat (docs/jyconnaisrien/02, §9).
 */

export default {
  slug: 'union-europeenne',
  type: 'debat',
  porte: 'F7',
  title: { fr: `L'Union européenne`, en: 'The European Union' },
  icon: '🇪🇺',
  difficulty: 2,
  famille: 'dossier',
  updatedAt: '2026-07-12',
  freshness: { type: 'periodic', reviewEveryMonths: 12, lastReviewedAt: '2026-07-12' },

  // ── N1 ──────────────────────────────────────────────────────────────────────
  level1: {
    fr: `L'Union européenne, ce sont 27 pays qui décident ensemble dans certains domaines — commerce, monnaie, environnement — tout en restant des États souverains. Le circuit de base : la Commission propose, le Parlement élu et les ministres des États votent, chaque pays applique. Mais l'essentiel du quotidien politique français — impôts, école, santé, retraites — reste décidé à Paris. Depuis Maastricht en 1992, l'Europe divise les Français bien au-delà du clivage gauche-droite.`,
  },

  // ── N2 ──────────────────────────────────────────────────────────────────────
  level2: {
    sections: [
      {
        titre: { fr: `Pourquoi en parle-t-on ?` },
        corps: {
          fr: `« Bruxelles a décidé… » : la formule revient sans cesse, souvent sans que personne n'explique qui, à Bruxelles, a décidé quoi — ni si c'était vraiment Bruxelles. L'UE est à la fois une machine institutionnelle complexe (plusieurs « Conseils », une Commission, un Parlement) et l'un des désaccords politiques les plus profonds du pays : les deux référendums européens français ont coupé le pays en deux (oui à 51 % en 1992, non à 55 % en 2005), et chacun a divisé la gauche comme la droite. Comprendre le circuit de décision est le préalable pour se faire une opinion sur le fond.`,
        },
      },
      {
        titre: { fr: `Le schéma simple` },
        corps: {
          fr: `Pour l'essentiel des lois européennes, le circuit tient en quatre temps. 1) La Commission européenne propose : elle a le quasi-monopole de l'initiative des textes. 2) Deux « chambres » votent : le Parlement européen (élu directement par les citoyens) et le Conseil de l'UE (les ministres des 27 gouvernements) — un texte doit convaincre les deux. 3) Les États appliquent : les règlements s'imposent directement, les directives doivent être transposées dans le droit national par chaque pays. 4) La Cour de justice de l'UE contrôle : elle sanctionne les États ou les institutions qui ne respectent pas les règles communes.\n\nEn arrière-plan, le Conseil européen — les chefs d'État et de gouvernement — fixe les grandes orientations, sans voter les lois. Retenir ce circuit permet déjà de repérer la plupart des raccourcis du débat public.`,
        },
        sources: [{ label: `Traité sur l'Union européenne et traité sur le fonctionnement de l'UE, versions consolidées (EUR-Lex) — articles 14-17 TUE, 289-294 TFUE`, url: 'https://eur-lex.europa.eu', year: 2016 }],
      },
      {
        titre: { fr: `Qui est qui à Bruxelles (et à Strasbourg, et à Francfort)` },
        brique: 'glossaire',
        termes: [
          { nom: { fr: 'Commission européenne' }, def: { fr: `L'« exécutif » de l'UE : 27 commissaires (un par État), qui proposent les lois, veillent à l'application des traités et négocient les accords commerciaux. Son président ou sa présidente est proposé par les chefs d'État puis élu par le Parlement.` } },
          { nom: { fr: 'Conseil européen' }, def: { fr: `Les chefs d'État et de gouvernement des 27 (pour la France, le président de la République), réunis en « sommets ». Il fixe les grandes orientations et tranche les crises — mais ne vote pas les lois.` } },
          { nom: { fr: `Conseil de l'UE` }, def: { fr: `Aussi appelé « Conseil des ministres » : les ministres nationaux, réunis par domaine (agriculture, finances…). Avec le Parlement, c'est l'une des deux chambres qui votent les lois européennes.` } },
          { nom: { fr: 'Parlement européen' }, def: { fr: `La seule institution de l'UE élue au suffrage direct, depuis 1979. 720 eurodéputés depuis 2024, dont 81 élus en France. Il vote les lois et le budget avec le Conseil, et peut censurer la Commission.` } },
          { nom: { fr: `Cour de justice de l'UE (CJUE)` }, def: { fr: `Basée à Luxembourg, elle garantit que le droit de l'UE est appliqué de la même façon partout — et peut condamner un État qui ne le respecte pas. À ne pas confondre avec la CEDH (qui ne relève pas de l'UE).` } },
          { nom: { fr: 'Banque centrale européenne (BCE)' }, def: { fr: `Basée à Francfort, indépendante des gouvernements, elle conduit la politique monétaire des pays de la zone euro : fixer les taux d'intérêt, garantir la stabilité des prix.` } },
        ],
      },
      {
        titre: { fr: `Ce que l'UE décide — et ce qu'elle ne décide PAS` },
        brique: 'a-retenir',
        corps: {
          fr: `L'UE n'agit que dans les domaines que les traités lui confient. Compétences exclusives (l'UE décide seule) : le commerce extérieur, les règles de concurrence du marché intérieur, la monnaie pour les pays de l'euro. Compétences partagées (l'UE et les États décident, chacun dans son couloir) : le marché intérieur, l'environnement, l'agriculture, les transports, l'énergie.\n\nEt tout le reste demeure national : les impôts directs, le système de santé, l'école, les retraites, le droit du travail pour l'essentiel, la nationalité, la police et la justice au quotidien — c'est-à-dire la majorité des sujets qui dominent le débat politique français. Quand un responsable politique impute ces sujets à « Bruxelles », c'est le premier réflexe de vérification à avoir.`,
        },
        sources: [{ label: `Traité sur le fonctionnement de l'UE, articles 2 à 6 — catégories de compétences (EUR-Lex)`, url: 'https://eur-lex.europa.eu', year: 2016 }],
      },
      {
        titre: { fr: `Conseil européen ≠ Conseil de l'UE ≠ Conseil de l'Europe` },
        brique: 'confusion',
        corps: {
          fr: `Trois noms presque identiques, trois choses différentes. Le Conseil européen : les chefs d'État et de gouvernement de l'UE, qui fixent le cap. Le Conseil de l'UE : les ministres de l'UE, qui votent les lois avec le Parlement. Le Conseil de l'Europe, lui, n'est PAS l'UE : c'est une organisation distincte, créée en 1949, qui regroupe 46 États (bien au-delà de l'UE) et dont relève la Cour européenne des droits de l'homme (CEDH), à Strasbourg. Quand un débat porte sur la CEDH, il ne porte donc pas sur l'Union européenne — la confusion est pourtant quasi quotidienne dans le débat public.`,
        },
      },
    ],
  },

  // ── N3 ──────────────────────────────────────────────────────────────────────
  level3: {
    sections: [
      {
        id: 'histoire',
        titre: { fr: `D'où vient l'UE : 75 ans de construction par étapes` },
        corps: {
          fr: `Le 9 mai 1950, cinq ans après la guerre, Robert Schuman propose de placer le charbon et l'acier français et allemands sous une autorité commune — pour rendre la guerre « matériellement impossible ». La CECA naît en 1951 avec six pays (France, Allemagne de l'Ouest, Italie, Belgique, Pays-Bas, Luxembourg). Le traité de Rome (25 mars 1957) crée la Communauté économique européenne : un marché commun. L'Acte unique (1986) programme le grand marché intérieur. Le traité de Maastricht, signé en février 1992, transforme la Communauté en Union européenne et programme l'euro — ratifié en France par référendum le 20 septembre 1992, avec 51,04 % de oui seulement.\n\nEn 2005, le projet de traité établissant une Constitution pour l'Europe est rejeté par référendum en France (54,67 % de non le 29 mai). Le traité de Lisbonne, signé en 2007 et entré en vigueur en 2009, reprend l'essentiel du contenu institutionnel du texte rejeté, ratifié cette fois par voie parlementaire — démarche parfaitement légale pour ses défenseurs, contournement du vote populaire pour ses critiques. Cet épisode nourrit encore aujourd'hui une partie de la défiance envers la construction européenne.`,
        },
        sources: [
          { label: `Déclaration Schuman du 9 mai 1950 — texte intégral (union-europeenne.europa.eu)`, url: 'https://european-union.europa.eu', year: 1950 },
          { label: `Conseil constitutionnel — résultats des référendums du 20 septembre 1992 et du 29 mai 2005`, url: 'https://www.conseil-constitutionnel.fr', year: 2005 },
          { label: `Vie-publique.fr — du traité constitutionnel au traité de Lisbonne (2005-2008)`, url: 'https://www.vie-publique.fr', year: 2008 },
        ],
      },
      {
        id: 'comment-se-decide-une-loi-europeenne',
        titre: { fr: `Comment se décide une loi européenne` },
        corps: {
          fr: `La procédure de droit commun s'appelle la « procédure législative ordinaire » (longtemps dite codécision). La Commission propose un texte ; le Parlement européen et le Conseil de l'UE l'amendent et le votent chacun de leur côté ; s'ils divergent, des négociations à trois — les « trilogues » (Parlement, Conseil, Commission) — cherchent un compromis. Ces trilogues, informels et à huis clos, sont efficaces mais régulièrement critiqués pour leur opacité : l'essentiel des compromis s'y joue.\n\nAu Conseil, la plupart des textes se votent à la « majorité qualifiée » : au moins 55 % des États représentant au moins 65 % de la population — aucun pays n'a de veto. Mais des domaines sensibles restent à l'unanimité : la fiscalité et la politique étrangère notamment, ainsi que la révision des traités. Un seul État peut donc y bloquer les 26 autres — c'est pourquoi les projets de taxation commune ou les sanctions traînent souvent, et pourquoi le passage à la majorité qualifiée sur ces sujets est lui-même un débat récurrent.`,
        },
        sources: [{ label: `TFUE, articles 289 à 294 (procédure législative ordinaire) ; TUE, article 16 (majorité qualifiée) — EUR-Lex`, url: 'https://eur-lex.europa.eu', year: 2016 }],
      },
      {
        id: 'primaute-du-droit',
        titre: { fr: `La primauté du droit européen — et ses contestations` },
        corps: {
          fr: `Depuis l'arrêt Costa contre ENEL (1964), la Cour de justice juge que le droit européen prime le droit national : sans cette règle, chaque État pourrait écarter les règles communes qui le dérangent, et le marché commun se déferait. Cette primauté n'est pas inscrite en toutes lettres dans les traités — une simple déclaration annexée au traité de Lisbonne la rappelle — et elle est périodiquement contestée.\n\nCes dernières années, la contestation est venue de cours suprêmes nationales : la Cour constitutionnelle allemande a jugé en 2020 qu'une décision de la BCE validée par la CJUE outrepassait les compétences conférées (arrêt dit « PSPP ») ; le Tribunal constitutionnel polonais a contesté frontalement la primauté en 2021, en plein conflit sur l'État de droit. En France, le Conseil d'État et le Conseil constitutionnel acceptent la primauté du droit de l'UE sur les lois, mais réservent la suprématie de la Constitution dans l'ordre interne (notion d'« identité constitutionnelle de la France »). Derrière la technique juridique, la question est politique : qui a le dernier mot, le juge européen ou les nations ? C'est l'un des points durs du débat souverainiste.`,
        },
        sources: [
          { label: `CJCE, arrêt Costa c/ ENEL, 15 juillet 1964, affaire 6/64 (EUR-Lex)`, url: 'https://eur-lex.europa.eu', year: 1964 },
          { label: `Vie-publique.fr — la primauté du droit de l'UE et ses contestations récentes (Allemagne 2020, Pologne 2021)`, url: 'https://www.vie-publique.fr', year: 2022 },
        ],
      },
      {
        id: 'budget',
        titre: { fr: `Le budget : qui paie, qui reçoit ?` },
        corps: {
          fr: `Le budget de l'UE représente environ 1 % du revenu national brut européen — à comparer aux dépenses publiques françaises, environ 57 % du PIB national : l'UE reste un petit budget adossé à de grandes règles. Le cadre 2021-2027 s'élève à environ 1 074 milliards d'euros sur sept ans, auxquels s'ajoute NextGenerationEU : 750 milliards d'euros empruntés en commun en 2020 pour la relance post-Covid — une première à cette échelle, que certains voudraient pérenniser et d'autres considèrent comme une exception à ne pas renouveler.\n\nLa France est contributrice nette : elle verse plus qu'elle ne reçoit, de l'ordre de 6 à 9 milliards d'euros par an selon les années et les modes de calcul (avec ou sans les rabais accordés à certains pays, selon le traitement des ressources propres — le chiffre est très sensible à la méthode). Mais elle est aussi le premier bénéficiaire de la politique agricole commune, avec environ 9 milliards d'euros par an versés à son agriculture. Citer l'un des deux chiffres sans l'autre est le procédé le plus courant du débat budgétaire européen — dans les deux sens. Et aucun des deux ne mesure les gains (ou coûts) économiques du marché unique lui-même, qui ne passent pas par le budget.`,
        },
        sources: [
          { label: `Commission européenne — rapport financier annuel sur le budget de l'UE (dépenses et contributions par État membre)`, url: 'https://commission.europa.eu', year: 2024, perimetre: `soldes nets : mode de calcul débattu, plusieurs méthodes coexistent` },
          { label: `Vie-publique.fr — la contribution de la France au budget de l'UE et les retours PAC`, url: 'https://www.vie-publique.fr', year: 2024 },
        ],
      },
      {
        id: 'euro-et-bce',
        titre: { fr: `L'euro et la BCE` },
        corps: {
          fr: `Vingt des 27 États membres partagent l'euro, créé en 1999 pour les paiements scripturaux et en 2002 pour les pièces et billets. La politique monétaire — fixer les taux d'intérêt, contenir l'inflation autour de 2 % — appartient à la BCE, indépendante des gouvernements. Les budgets, eux, restent nationaux, encadrés par des règles communes de déficit et de dette : cet attelage — monnaie unique, budgets séparés — est au cœur des crises de la zone euro (crise des dettes souveraines des années 2010) et du débat sur son avenir.\n\nPartisans : l'euro a apporté la stabilité monétaire, des taux bas et la fin des dévaluations compétitives entre voisins. Critiques : il prive les États d'un outil d'ajustement (dévaluer, monétiser) et impose une discipline budgétaire jugée excessive. Pour le fonctionnement concret de la monnaie, de la BCE et de l'inflation, voir la fiche « L'inflation », qui traite ces mécanismes en détail.`,
        },
        sources: [{ label: `BCE / Banque de France — l'euro et la politique monétaire de la zone euro`, url: 'https://www.banque-france.fr', year: 2024 }],
      },
      {
        id: 'schengen',
        titre: { fr: `Schengen : la libre circulation, avec des exceptions` },
        corps: {
          fr: `L'espace Schengen permet de circuler sans contrôle aux frontières intérieures. Il regroupe la quasi-totalité des pays de l'UE (l'Irlande et Chypre restent à l'écart) plus quatre États non membres : Norvège, Islande, Suisse, Liechtenstein — preuve que Schengen et UE ne se recoupent pas exactement. En contrepartie, les contrôles sont renforcés aux frontières extérieures communes.\n\nLa libre circulation n'est pas absolue : un État peut rétablir temporairement des contrôles à ses frontières en cas de menace pour l'ordre public ou la sécurité. La France l'a fait de manière continue depuis 2015 (attentats, puis crises migratoires et sanitaires), comme plusieurs voisins — au point que la « temporarité » de ces rétablissements est devenue un sujet de contentieux et de débat en soi.`,
        },
        sources: [{ label: `Vie-publique.fr — l'espace Schengen et le rétablissement des contrôles aux frontières intérieures`, url: 'https://www.vie-publique.fr', year: 2024 }],
      },
      {
        id: 'elargissements-et-brexit',
        titre: { fr: `Élargissements, Brexit : qui entre, qui sort` },
        corps: {
          fr: `De 6 pays fondateurs en 1957, l'UE est passée à 9 (1973, dont le Royaume-Uni), 12 (Grèce 1981, Espagne et Portugal 1986), 15 (1995), 25 (2004 — le grand élargissement à l'Est), 27 (2007), puis 28 avec la Croatie (2013). Le Brexit l'a ramenée à 27 : les Britanniques ont voté la sortie par référendum le 23 juin 2016 (51,9 %), effective le 31 janvier 2020 — premier et seul retrait de l'histoire de l'Union.\n\nLa file d'attente reste longue : les Balkans occidentaux négocient depuis des années, la Turquie est officiellement candidate mais ses négociations sont gelées, et l'Ukraine comme la Moldavie ont obtenu le statut de candidat en 2022, après l'invasion russe. Chaque élargissement repose la même question : une Union plus grande est-elle plus forte (poids géopolitique) ou plus faible (décision plus difficile à 30 qu'à 15) ? Aucun pays n'a rejoint l'UE depuis 2013.`,
        },
        sources: [
          { label: `Vie-publique.fr — les élargissements de l'UE et le Brexit (chronologies)`, url: 'https://www.vie-publique.fr', year: 2024 },
          { label: `Conseil européen — décisions accordant le statut de candidat à l'Ukraine et à la Moldavie (juin 2022)`, url: 'https://www.consilium.europa.eu', year: 2022 },
        ],
      },
      {
        id: 'positions',
        titre: { fr: `Les grandes positions dans le débat` },
        brique: 'visions',
        visions: [
          {
            label: { fr: `Fédéralistes — aller vers une Europe politique intégrée` },
            couleur: 'blue',
            corps: { fr: `L'échelle des défis (climat, géants technologiques, puissances continentales) dépasse les nations : il faut un vrai budget commun, une défense européenne, la fin de l'unanimité, une Commission responsable devant le Parlement — des « États-Unis d'Europe » assumés. Position portée en France par une partie du centre et des écologistes, historiquement minoritaire mais constante.` },
          },
          {
            label: { fr: `Pro-européens réformistes — approfondir sans fédéralisme assumé` },
            couleur: 'green',
            corps: { fr: `L'UE est un acquis à défendre et un levier de puissance, mais elle doit se réformer : « Europe puissance », préférence européenne, politique industrielle, protection aux frontières du marché unique. On avance projet par projet, sans saut fédéral que les opinions refuseraient. Position dominante au centre, dans une partie de la droite et de la gauche sociale-démocrate — celle de la plupart des gouvernements français récents.` },
          },
          {
            label: { fr: `Europe des nations, souverainistes — rendre la main aux États` },
            couleur: 'amber',
            corps: { fr: `L'UE a dépossédé les peuples : il faut restaurer la primauté du droit national sur le droit européen, réduire les compétences de la Commission, refuser de nouveaux élargissements et transferts de souveraineté — coopérer entre nations plutôt qu'intégrer. Position portée par la droite nationale et une partie de la droite ; il en existe une version de gauche, qui vise d'abord le « carcan libéral » des traités (concurrence, discipline budgétaire).` },
          },
          {
            label: { fr: `Sortie ou désobéissance — rompre avec le cadre actuel` },
            couleur: 'rose',
            corps: { fr: `Pour les uns, sortir de l'UE ou de l'euro (« Frexit ») — position devenue marginale dans les programmes après le Brexit. Pour d'autres, à la gauche radicale surtout, « désobéir aux traités » : appliquer son programme national même s'il viole les règles européennes, et assumer le rapport de force pour les renégocier. Les adversaires de ces positions y voient un saut dans l'inconnu ; leurs partisans, la seule manière sérieuse de changer des traités verrouillés par l'unanimité.` },
          },
        ],
      },
      {
        id: 'desaccords',
        titre: { fr: `Ce qui fait vraiment désaccord` },
        corps: {
          fr: `Premier désaccord : la démocratie. Le Parlement européen est élu, les Conseils sont composés d'élus nationaux — mais la chaîne de responsabilité est longue, et la Commission n'est pas élue directement. Le système du « Spitzenkandidat » (la tête de liste du parti européen arrivé en tête devient président de la Commission) devait y répondre : appliqué en 2014, il a été écarté en 2019, montrant ses limites — au final, ce sont les chefs d'État qui proposent, le Parlement qui confirme. Les deux lectures se défendent : « déficit démocratique » structurel pour les uns, démocratie réelle mais indirecte — comme bien des institutions nationales — pour les autres.\n\nDeuxième désaccord : souveraineté contre efficacité. L'unanimité protège chaque nation mais paralyse l'action commune ; la majorité qualifiée rend l'UE efficace mais peut imposer une décision à un pays contre son vote. Troisième désaccord : élargir ou approfondir. Accueillir l'Ukraine et les Balkans renforce le poids géopolitique de l'Union mais rendrait la décision à 30 ou plus encore plus difficile — et bouleverserait le budget, la PAC en premier. Ces trois tensions ne sont pas des anomalies à corriger : ce sont les termes permanents du choix européen.`,
        },
      },
      {
        id: 'ce-que-lue-a-change-concretement',
        titre: { fr: `Ce que l'UE a changé concrètement` },
        corps: {
          fr: `Au-delà des institutions, quelques traces tangibles dans la vie quotidienne. Erasmus, depuis 1987 : des millions d'étudiants (et désormais d'apprentis) partis étudier dans un autre pays européen. La monnaie : plus de change à faire dans 20 pays. Le roaming : depuis 2017, téléphoner et utiliser ses données ailleurs dans l'UE sans surcoût. Le RGPD, depuis 2018 : le règlement sur les données personnelles qui s'impose aux géants du numérique mondial — un cas d'école de la « puissance normative » européenne, l'UE exportant ses standards par la taille de son marché. Et l'épaisseur invisible des normes communes : sécurité des produits, qualité de l'eau et de l'air, droits des passagers aériens, chargeur universel.\n\nCette normalisation a un revers dans le débat : ceux qui y voient une protection du consommateur et de l'environnement, et ceux qui y voient une bureaucratie tatillonne qui étouffe les entreprises. Les deux camps citent d'ailleurs souvent les mêmes textes.`,
        },
        sources: [{ label: `Toute l'Europe — « ce que l'UE change au quotidien » (Erasmus, roaming, RGPD, normes)`, url: 'https://www.touteleurope.eu', year: 2024 }],
      },
      {
        id: 'mesures-prises',
        titre: { fr: `Ce qui a été fait récemment` },
        corps: {
          fr: `Pas de nouveau traité depuis Lisbonne (2009) — l'unanimité requise rend toute révision improbable — mais l'UE a beaucoup légiféré. Le pacte vert européen a durci le marché carbone : le système de quotas d'émission (créé en 2005) a été réformé en 2023, avec extension programmée au bâtiment et au transport routier et création d'un mécanisme d'ajustement carbone aux frontières, pour taxer le carbone des importations. Le pacte sur la migration et l'asile, adopté en mai 2024 après huit ans de blocage, réorganise l'examen des demandes d'asile aux frontières et crée un mécanisme de « solidarité obligatoire » entre États — jugé trop dur par une partie de la gauche et des ONG, insuffisant par la droite nationale.\n\nS'y ajoutent l'emprunt commun NextGenerationEU (2020), les grands règlements numériques (données, marchés et services en ligne, intelligence artificielle) et les paquets de sanctions contre la Russie depuis 2022. Attention au stade de chaque texte : entre l'adoption d'un règlement européen et son application effective s'écoulent souvent des années — le pacte migration, adopté en 2024, prévoit ainsi une mise en application en 2026.`,
        },
        sources: [
          { label: `Vie-publique.fr — le pacte sur la migration et l'asile (adopté en mai 2024)`, url: 'https://www.vie-publique.fr', year: 2024 },
          { label: `Conseil de l'UE / Parlement européen — réforme du marché carbone et mécanisme d'ajustement aux frontières (2023)`, url: 'https://www.consilium.europa.eu', year: 2023 },
        ],
      },
      {
        id: 'se-faire-une-opinion',
        titre: { fr: `Questions pour se faire sa propre opinion` },
        corps: {
          fr: `À quelle échelle chaque problème se traite-t-il le mieux — climat, commerce, immigration, impôts : nation, Europe, ou les deux ? Acceptez-vous qu'une décision prise à la majorité des États s'applique à la France contre son vote, si la réciproque vaut pour les autres ? La contribution nette au budget vous paraît-elle un coût sec, ou le prix d'un marché et d'une stabilité qui rapportent par ailleurs ? Une Commission non élue directement mais contrôlée par un Parlement élu vous semble-t-elle un déficit démocratique réel, ou une démocratie indirecte acceptable ? Et faut-il élargir l'Union à l'Ukraine et aux Balkans, quitte à la réformer de fond en comble ? Vos réponses dessinent votre position sur l'Europe — qui, l'histoire des référendums le montre, ne se déduit ni de votre camp ni de votre vote habituel.`,
        },
      },
    ],
  },

  // ── N4 ──────────────────────────────────────────────────────────────────────
  level4: {
    items: [
      { kind: 'texte', titre: { fr: `Déclaration Schuman — 9 mai 1950 (texte intégral)` }, note: { fr: `Trois pages fondatrices : mettre le charbon et l'acier en commun pour rendre la guerre « matériellement impossible ». La date est devenue la « journée de l'Europe ».` }, url: 'https://european-union.europa.eu' },
      { kind: 'texte', titre: { fr: `Les traités consolidés (TUE et TFUE) sur EUR-Lex` }, note: { fr: `Le droit primaire de l'UE, en français, dans sa version en vigueur — pour vérifier soi-même qui a compétence sur quoi (articles 2 à 6 du TFUE notamment).` }, url: 'https://eur-lex.europa.eu' },
      { kind: 'lien', titre: { fr: `Toute l'Europe — touteleurope.eu` }, note: { fr: `Le site public de référence français sur les questions européennes : fiches pédagogiques, comparatifs par pays, suivi des textes en cours.` }, url: 'https://www.touteleurope.eu' },
      { kind: 'lien', titre: { fr: `Vie-publique.fr — dossiers Union européenne` }, note: { fr: `Fiches institutionnelles, chronologies des traités et des élargissements, dossiers sur les référendums français de 1992 et 2005.` }, url: 'https://www.vie-publique.fr' },
      { kind: 'donnees', titre: { fr: `Commission européenne — rapport financier annuel du budget de l'UE` }, note: { fr: `Dépenses et contributions par État membre, année par année : la source pour vérifier les chiffres de « solde net » cités dans le débat — et mesurer leur sensibilité au mode de calcul.` }, url: 'https://commission.europa.eu' },
      { kind: 'biblio', titre: { fr: `Olivier Costa et Nathalie Brack, Le fonctionnement de l'Union européenne — Éditions de l'Université de Bruxelles` }, note: { fr: `Le manuel universitaire de référence en français sur les institutions européennes, régulièrement réédité : précis, à jour, lisible au-delà du public étudiant.` } },
    ],
  },

  vraiFaux: ['vf-ue-80-pourcent-lois', 'vf-ue-pas-democratique', 'vf-ue-france-paie-sans-recevoir', 'vf-ue-conseil-europe', 'vf-ue-commission-decide-seule'],

  quiz: [
    {
      question: { fr: `Qui propose les lois européennes ?` },
      options: [
        { fr: `Le Parlement européen` },
        { fr: `La Commission européenne — le Parlement et le Conseil de l'UE les votent ensuite` },
        { fr: `Le Conseil de l'Europe` },
        { fr: `Chaque État membre à tour de rôle` },
      ],
      bonneReponse: 1,
      explication: { fr: `La Commission a le quasi-monopole de l'initiative, mais elle ne décide pas seule : un texte doit être voté à la fois par le Parlement européen (élu) et par le Conseil de l'UE (les ministres des États).` },
    },
    {
      question: { fr: `Le Conseil de l'Europe fait-il partie de l'Union européenne ?` },
      options: [
        { fr: `Oui, c'est son organe principal` },
        { fr: `Non — c'est une organisation distincte de 46 États, dont relève la CEDH` },
        { fr: `Oui, c'est l'autre nom du Conseil européen` },
        { fr: `Il en fait partie depuis le traité de Lisbonne` },
      ],
      bonneReponse: 1,
      explication: { fr: `Le Conseil de l'Europe (1949, 46 États, Cour européenne des droits de l'homme) n'est pas une institution de l'UE. Dans l'UE, il existe le Conseil européen (chefs d'État) et le Conseil de l'UE (ministres) — trois noms proches, trois choses différentes.` },
    },
    {
      question: { fr: `Lequel de ces sujets est décidé pour l'essentiel au niveau national, pas par l'UE ?` },
      options: [
        { fr: `Les règles de concurrence du marché intérieur` },
        { fr: `La politique commerciale extérieure` },
        { fr: `Les retraites, l'école et les impôts directs` },
        { fr: `La monnaie des pays de la zone euro` },
      ],
      bonneReponse: 2,
      explication: { fr: `Commerce, concurrence et monnaie sont des compétences exclusives de l'UE. Mais les retraites, la santé, l'école, les impôts directs ou la nationalité restent nationaux — c'est-à-dire l'essentiel des sujets qui dominent le débat politique français.` },
    },
    {
      question: { fr: `Qu'ont répondu les Français lors des deux référendums européens de 1992 et 2005 ?` },
      options: [
        { fr: `Deux oui massifs` },
        { fr: `Deux non massifs` },
        { fr: `Oui à Maastricht de justesse (51,04 %), puis non au traité constitutionnel (54,67 %)` },
        { fr: `Ils n'ont jamais voté directement sur l'Europe` },
      ],
      bonneReponse: 2,
      explication: { fr: `Le 20 septembre 1992, le oui à Maastricht ne l'emporte que de justesse ; le 29 mai 2005, le traité constitutionnel est nettement rejeté — et chaque fois, gauche et droite ont été divisées en interne. Le traité de Lisbonne (2007) a ensuite repris l'essentiel institutionnel du texte de 2005 par voie parlementaire, épisode encore débattu.` },
    },
    {
      question: { fr: `Quel est l'ordre de grandeur du budget de l'Union européenne ?` },
      options: [
        { fr: `Environ 1 % du revenu national brut européen` },
        { fr: `Environ 25 % du RNB européen` },
        { fr: `Plus de la moitié des dépenses publiques des États membres` },
        { fr: `L'UE n'a pas de budget propre` },
      ],
      bonneReponse: 0,
      explication: { fr: `Le budget de l'UE pèse environ 1 % du RNB européen — loin des budgets nationaux (les dépenses publiques françaises avoisinent 57 % du PIB). L'emprunt commun NextGenerationEU (750 milliards d'euros, 2020) a toutefois marqué un changement d'échelle ponctuel.` },
    },
  ],

  motsAssocies: [
    'inflation',
    'dette-publique',
    { label: { fr: 'Schengen' }, soon: true },
    { label: { fr: `L'euro` }, soon: true },
  ],
  continuerAvec: [
    { slug: 'inflation' },
    { slug: 'droite' },
    { slug: 'gauche', label: { fr: `La gauche` }, soon: true },
  ],

  sources: [
    { label: `Traité sur l'Union européenne et traité sur le fonctionnement de l'UE, versions consolidées (EUR-Lex)`, url: 'https://eur-lex.europa.eu', year: 2016, perimetre: `droit primaire en vigueur depuis Lisbonne (2009)` },
    { label: `Conseil constitutionnel — résultats officiels des référendums du 20 septembre 1992 (oui : 51,04 %) et du 29 mai 2005 (non : 54,67 %)`, url: 'https://www.conseil-constitutionnel.fr', year: 2005 },
    { label: `Commission européenne — rapport financier annuel du budget de l'UE (contributions et dépenses par État membre)`, url: 'https://commission.europa.eu', year: 2024, perimetre: `soldes nets sensibles au mode de calcul — plusieurs méthodes coexistent` },
    { label: `Parlement européen — composition issue des élections de juin 2024 (720 sièges, dont 81 pour la France)`, url: 'https://www.europarl.europa.eu', year: 2024 },
    { label: `Vie-publique.fr — dossiers Union européenne : traités, élargissements, Brexit, pacte migration et asile`, url: 'https://www.vie-publique.fr', year: 2024 },
    { label: `Toute l'Europe (touteleurope.eu) — fiches pédagogiques sur les institutions et politiques de l'UE`, url: 'https://www.touteleurope.eu', year: 2024 },
  ],
};
