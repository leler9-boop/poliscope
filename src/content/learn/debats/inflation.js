/**
 * Fiche débat « L'inflation » — modèle debat, grille de positions variable.
 * Régime live : chiffres INSEE datés, à revoir tous les 3 mois.
 */

export default {
  slug: 'inflation',
  type: 'debat',
  porte: 'F1',
  title: { fr: `L'inflation`, en: 'Inflation' },
  icon: '💶',
  difficulty: 2,
  famille: 'dossier',
  updatedAt: '2026-07-12',
  freshness: { type: 'live', reviewEveryMonths: 3, lastReviewedAt: '2026-07-12' },

  // ── N1 ──────────────────────────────────────────────────────────────────────
  level1: {
    fr: `L'inflation est la hausse générale et durable des prix : avec 100 €, on achète moins cette année que l'an dernier. Elle se mesure par un indice officiel calculé par l'INSEE. Après des décennies de calme, la poussée de 2021-2023 (jusqu'à plus de 6 % sur un an en France) a remis le pouvoir d'achat au centre du débat politique — et les désaccords sur ses causes et ses remèdes sont réels.`,
  },

  // ── N2 ──────────────────────────────────────────────────────────────────────
  level2: {
    sections: [
      {
        titre: { fr: `Comment on la mesure` },
        corps: {
          fr: `L'INSEE relève chaque mois les prix de milliers de produits et services, pondérés selon la consommation moyenne des ménages : c'est l'indice des prix à la consommation (IPC). Quand on dit « l'inflation est à 2 % », cela signifie que ce panier moyen coûte 2 % de plus qu'un an plus tôt.\n\nDeux limites à connaître : votre inflation personnelle dépend de votre panier (un ménage rural qui roule beaucoup a subi la hausse des carburants plus durement qu'un urbain) ; et l'indice mesure une évolution, pas un niveau — il ne dit pas si la vie est « chère », il dit si elle renchérit.`,
        },
        sources: [{ label: `INSEE — méthodologie de l'indice des prix à la consommation`, url: 'https://www.insee.fr', year: 2025 }],
      },
      {
        titre: { fr: `Ce qui s'est passé en 2021-2023` },
        corps: {
          fr: `Après dix ans d'inflation très faible, les prix ont flambé dans le monde entier : reprise brutale post-Covid, chaînes d'approvisionnement désorganisées, puis explosion des prix de l'énergie avec la guerre en Ukraine. En France, l'inflation annuelle a atteint 5,2 % en 2022 et 4,9 % en 2023 (avec un pic au-delà de 6 % sur un an début 2023), avant de revenir vers 2 % en 2024 — des niveaux inédits depuis le début des années 1980, mais parmi les plus bas d'Europe, notamment grâce au « bouclier tarifaire » sur l'énergie et au parc nucléaire.\n\nPoint essentiel : le retour de l'inflation à 2 % ne fait pas baisser les prix — il les stabilise à leur nouveau niveau. C'est pourquoi le ressenti de cherté persiste après la fin de l'épisode.`,
        },
        sources: [
          { label: `INSEE — inflation annuelle : 5,2 % (2022), 4,9 % (2023), 2,0 % (2024)`, url: 'https://www.insee.fr', year: 2024, perimetre: `IPC, moyennes annuelles, France` },
          { label: `Eurostat — inflation comparée dans la zone euro (pic zone euro : 10,6 % sur un an, octobre 2022)`, url: 'https://ec.europa.eu/eurostat', year: 2022 },
        ],
      },
      {
        titre: { fr: `Qui décide quoi ?` },
        corps: {
          fr: `C'est l'un des sujets les plus mal compris : le principal outil contre l'inflation n'est pas entre les mains du gouvernement français. La Banque centrale européenne (BCE), indépendante, fixe les taux d'intérêt pour toute la zone euro avec un objectif de 2 % — elle les a fortement relevés en 2022-2023 pour freiner la demande. Le gouvernement, lui, agit sur les symptômes et la répartition : boucliers tarifaires, chèques, fiscalité, SMIC (indexé automatiquement sur l'inflation, cas unique parmi les grands pays européens). Reprocher — ou attribuer — l'inflation à un gouvernement national, c'est donc presque toujours simplifier à l'excès.`,
        },
        sources: [{ label: `BCE — mandat et décisions de politique monétaire 2022-2023`, url: 'https://www.ecb.europa.eu', year: 2023 }],
      },
      {
        titre: { fr: `Inflation, désinflation, déflation` },
        brique: 'confusion',
        corps: {
          fr: `Quand l'inflation passe de 6 % à 2 %, les prix montent encore — moins vite : c'est la désinflation. Une baisse effective des prix serait une déflation ; elle est rare et redoutée, car elle pousse chacun à reporter ses achats et peut paralyser l'économie. Et le « pouvoir d'achat » compare les prix aux revenus : l'inflation ne le fait baisser que si les revenus suivent moins vite.`,
        },
      },
    ],
  },

  // ── N3 ──────────────────────────────────────────────────────────────────────
  level3: {
    sections: [
      {
        id: 'mecanismes',
        titre: { fr: `D'où vient l'inflation ? Les mécanismes` },
        corps: {
          fr: `Les économistes distinguent classiquement : l'inflation par la demande (trop d'argent pour trop peu de biens — économie en surchauffe) ; l'inflation par les coûts (l'énergie, les matières premières ou les salaires renchérissent, les entreprises répercutent) ; et l'inflation importée (la monnaie se déprécie ou les prix mondiaux montent). S'y ajoutent les anticipations : si chacun s'attend à des hausses, salariés et entreprises les intègrent par avance — c'est la « boucle prix-salaires », que les banques centrales veulent briser à tout prix.\n\nL'épisode 2021-2023 fut d'abord une inflation par les coûts (énergie) et importée, sur fond de demande post-Covid soutenue — un cocktail, pas une cause unique. C'est pourquoi les remèdes proposés divergent autant.`,
        },
        sources: [{ label: `Banque de France — « L'inflation en 2021-2023 : quelles causes ? » (bulletins et blog)`, url: 'https://www.banque-france.fr', year: 2023 }],
      },
      {
        id: 'gagnants-perdants',
        titre: { fr: `Gagnants et perdants : pourquoi c'est un sujet politique` },
        corps: {
          fr: `L'inflation redistribue silencieusement. Perdants : les ménages modestes (l'énergie et l'alimentation — les postes qui ont le plus monté — pèsent plus lourd dans leur budget), les épargnants en livrets mal rémunérés, ceux dont les revenus ne sont pas indexés. Gagnants relatifs : les emprunteurs à taux fixe, dont la dette fond en valeur réelle — l'État au premier chef, dont les recettes (TVA notamment) gonflent avec les prix. Les entreprises se répartissent entre celles qui subissent leurs coûts et celles qui ont le pouvoir de marché pour répercuter, voire au-delà.\n\nC'est cette géographie de gagnants et de perdants — et non le niveau moyen des prix — qui fait de l'inflation une question politique et pas seulement technique.`,
        },
        sources: [{ label: `INSEE — analyses de l'inflation par catégorie de ménages (2022-2023)`, url: 'https://www.insee.fr', year: 2023 }],
      },
      {
        id: 'histoire',
        titre: { fr: `Un peu d'histoire : de Weimar au « franc fort »` },
        corps: {
          fr: `L'hyperinflation allemande de 1923 — les prix doublant en quelques jours, les billets brouettés — reste le traumatisme fondateur de la culture monétaire européenne : c'est en grande partie pour cela que la BCE, construite sur le modèle de la Bundesbank, est indépendante et obsédée par la stabilité des prix.\n\nLa France, elle, a vécu avec une inflation à deux chiffres dans les années 1970-début 1980 (environ 13 % en 1981). La désinflation fut le grand chantier des années 1980 : politique de rigueur à partir de 1983, « franc fort », désindexation des salaires en 1983 — depuis, hors épisode 2021-2023, l'inflation française est restée basse. Ce détour explique un réflexe du débat actuel : toute proposition de réindexation générale des salaires se heurte au souvenir de la spirale des années 1970.`,
        },
        sources: [{ label: `INSEE — séries longues de l'inflation française ; Banque de France — histoire de la désinflation des années 1980`, url: 'https://www.insee.fr', year: 2025 }],
      },
      {
        id: 'greedflation',
        titre: { fr: `Le débat « profits ou salaires » (dit « greedflation »)` },
        corps: {
          fr: `Question très disputée depuis 2022 : les entreprises ont-elles profité de l'épisode pour augmenter leurs marges au-delà de leurs coûts ? Des travaux de la BCE et du FMI (2023) ont estimé qu'une partie significative de la hausse des prix en zone euro reflétait la progression des profits unitaires, notamment dans l'énergie et l'agroalimentaire ; d'autres analyses soulignent que les marges se sont ensuite normalisées et que mesurer une « inflation par cupidité » est méthodologiquement fragile. L'état honnête du débat : contribution des profits réelle sur 2022-2023, ampleur et caractère anormal discutés. Méfiez-vous de quiconque présente ce point comme définitivement tranché — dans un sens comme dans l'autre.`,
        },
        sources: [
          { label: `BCE / FMI — analyses 2023 de la contribution des profits unitaires à l'inflation en zone euro`, url: 'https://www.ecb.europa.eu', year: 2023 },
        ],
      },
      {
        id: 'positions',
        titre: { fr: `Les grandes positions dans le débat français` },
        brique: 'visions',
        visions: [
          {
            label: { fr: `Bloquer les prix, taxer les profits — gauche radicale` },
            couleur: 'rose',
            corps: { fr: `L'inflation vient des marges et de la spéculation : il faut bloquer les prix des produits essentiels (énergie, alimentation), taxer les « superprofits », indexer les salaires sur les prix comme avant 1983. La désindexation a fait payer la crise aux salariés.` },
          },
          {
            label: { fr: `Soutenir les revenus, négocier les salaires — gauche réformiste` },
            couleur: 'blue',
            corps: { fr: `Ni blocage général ni laisser-faire : hausses ciblées (SMIC, minima sociaux, point d'indice), conférences salariales par branche, taxation exceptionnelle des rentes énergétiques, et transition énergétique pour réduire la dépendance aux fossiles — cause profonde de l'épisode.` },
          },
          {
            label: { fr: `Boucliers ciblés, sérieux budgétaire — centre et gouvernements récents` },
            couleur: 'purple',
            corps: { fr: `Amortir le choc sans casser les mécanismes de marché : bouclier tarifaire, chèques ciblés, laisser la BCE faire son travail sur les taux. Refus de l'indexation générale des salaires (risque de spirale) ; sortie progressive des aides pour limiter le coût budgétaire — plus de 50 milliards d'euros pour les seules mesures énergie.` },
          },
          {
            label: { fr: `Baisser taxes et dépenses — droite libérale` },
            couleur: 'green',
            corps: { fr: `L'État est le premier profiteur de l'inflation (TVA, recettes gonflées) : il faut rendre l'argent — baisse des taxes sur l'énergie et les carburants — et réduire la dépense publique, car les déficits nourrissent l'inflation. Les boucliers généralisés coûtent trop cher et faussent les prix.` },
          },
          {
            label: { fr: `Priorité au pouvoir d'achat national — droite nationale` },
            couleur: 'amber',
            corps: { fr: `Baisse massive de la TVA sur l'énergie et les produits essentiels (de 20 % à 5,5 %), sortie des règles européennes du marché de l'électricité jugées responsables des prix, protection des producteurs français. La critique de la BCE et du cadre européen est ici centrale.` },
          },
        ],
      },
      {
        id: 'mesures-prises',
        titre: { fr: `Ce qui a été fait en France (2021-2024)` },
        corps: {
          fr: `Le « bouclier tarifaire » (octobre 2021, prolongé jusqu'en 2024-2025) a plafonné les hausses des prix du gaz puis de l'électricité — la mesure la plus massive, qui explique une bonne part de l'inflation française inférieure à celle des voisins ; coût budgétaire cumulé de plusieurs dizaines de milliards d'euros. S'y sont ajoutés : indemnité inflation de 100 € (fin 2021), remise carburant (2022), chèques énergie exceptionnels, revalorisations anticipées des retraites et minima sociaux, hausses mécaniques du SMIC par indexation, « trimestre anti-inflation » négocié avec la grande distribution (2023).\n\nBilan d'étape documenté : choc amorti et inflation parmi les plus basses d'Europe, au prix d'un coût budgétaire élevé et de débats sur le ciblage — les aides généralisées ont aussi profité à des ménages aisés. L'essentiel des dispositifs a été éteint progressivement avec la décrue de 2024.`,
        },
        sources: [
          { label: `Vie-publique.fr — dossiers « bouclier tarifaire » et mesures pouvoir d'achat 2021-2024`, url: 'https://www.vie-publique.fr', year: 2024 },
          { label: `Cour des comptes — rapports sur le coût des mesures énergie (2023-2024)`, url: 'https://www.ccomptes.fr', year: 2024 },
        ],
      },
      {
        id: 'recherche',
        titre: { fr: `Ce que dit la recherche — et ce qu'on ne sait pas` },
        corps: {
          fr: `Points plutôt consensuels chez les économistes : l'épisode 2021-2023 est venu d'abord des coûts (énergie) et non d'une surchauffe salariale française ; les boucliers ont réduit le pic d'inflation à court terme ; l'indexation généralisée des salaires accroît le risque de spirale durable ; et la hausse des taux de la BCE a contribué à la décrue, avec un délai et un coût (crédit immobilier, construction) réels.\n\nCe qui reste débattu : la part exacte des profits dans la hausse (voir plus haut) ; le bon degré de ciblage des aides (générales = coûteuses, ciblées = plus lentes et moins lisibles) ; l'effet à long terme des boucliers sur les incitations à économiser l'énergie ; et la question institutionnelle — le mandat de la BCE (2 % d'inflation) est-il le bon, faut-il y ajouter l'emploi ou le climat ? Sur ces points, des économistes sérieux défendent des positions opposées.`,
        },
        sources: [{ label: `Banque de France, BCE, OFCE, FMI — publications 2022-2024 sur l'épisode inflationniste (synthèses accessibles sur leurs sites)`, url: 'https://www.banque-france.fr', year: 2024 }],
      },
      {
        id: 'se-faire-une-opinion',
        titre: { fr: `Questions pour se faire sa propre opinion` },
        corps: {
          fr: `Face à un choc de prix, préférez-vous des aides générales (rapides, coûteuses, peu ciblées) ou ciblées (justes, plus lentes) ? Faut-il protéger le pouvoir d'achat en bloquant des prix, en baissant des taxes, ou en augmentant des revenus — et qui paie, dans chaque cas ? L'indexation des salaires sur les prix vous semble-t-elle une protection légitime ou une machine à spirale ? Et qui doit piloter la lutte contre l'inflation : une banque centrale indépendante, ou des gouvernements élus ? Vos réponses dessinent votre position — et aucune ne dispense de regarder les chiffres datés et sourcés.`,
        },
      },
    ],
  },

  // ── Tableau comparatif ────────────────────────────────────────────────────────
  tableauComparatif: {
    titre: { fr: `Trois réponses types à un choc d'inflation` },
    note: { fr: `Simplification pédagogique : les gouvernements combinent en pratique plusieurs approches.` },
    colonnes: [{ fr: 'Bloquer / indexer' }, { fr: 'Amortir (boucliers, chèques)' }, { fr: `Laisser les prix + taux d'intérêt` }],
    lignes: [
      { label: { fr: 'Effet immédiat' }, cells: [{ fr: `Fort sur les prix visés` }, { fr: `Fort sur les ménages aidés` }, { fr: `Lent (12-24 mois)` }] },
      { label: { fr: 'Coût budgétaire' }, cells: [{ fr: `Faible pour l'État, porté par les entreprises` }, { fr: `Très élevé` }, { fr: `Nul directement, mais récession possible` }] },
      { label: { fr: 'Risque principal' }, cells: [{ fr: `Pénuries, rattrapage à la sortie, spirale si indexation` }, { fr: `Aides mal ciblées, signal prix affaibli` }, { fr: `Choc sur le crédit, l'emploi, l'immobilier` }] },
      { label: { fr: 'Qui le défend' }, cells: [{ fr: `Gauche radicale, partie de la droite nationale (TVA)` }, { fr: `Centre, gauche réformiste` }, { fr: `Banques centrales, droite libérale` }] },
    ],
    sources: [{ label: `Synthèse d'après les publications Banque de France / BCE / OFCE 2022-2024`, year: 2024 }],
  },

  vraiFaux: ['vf-monnaie-inflation', 'vf-inflation-tous-pareil', 'vf-inflation-baisse-prix', 'vf-inflation-salaires'],

  quiz: [
    {
      question: { fr: `L'inflation française est repassée autour de 2 % en 2024. Qu'est-il arrivé aux prix ?` },
      options: [
        { fr: `Ils sont revenus à leur niveau de 2021` },
        { fr: `Ils ont continué d'augmenter, mais beaucoup moins vite — les hausses de 2021-2023 restent acquises` },
        { fr: `Ils ont baissé de 2 %` },
        { fr: `Ils sont bloqués par la loi` },
      ],
      bonneReponse: 1,
      explication: { fr: `C'est la désinflation : le rythme ralentit, le niveau reste. Voilà pourquoi le ressenti de cherté persiste après la fin de l'épisode.` },
    },
    {
      question: { fr: `Qui fixe les taux d'intérêt pour lutter contre l'inflation en France ?` },
      options: [
        { fr: `Le gouvernement français` },
        { fr: `L'Assemblée nationale` },
        { fr: `La Banque centrale européenne, indépendante, pour toute la zone euro` },
        { fr: `Les banques commerciales` },
      ],
      bonneReponse: 2,
      explication: { fr: `Depuis l'euro, la politique monétaire est confiée à la BCE, avec un objectif de 2 %. Le gouvernement agit sur les symptômes (boucliers, chèques, fiscalité) — pas sur l'outil principal.` },
    },
    {
      question: { fr: `Pourquoi l'inflation frappe-t-elle plus durement les ménages modestes ?` },
      options: [
        { fr: `Parce que leurs salaires baissent automatiquement` },
        { fr: `Parce que l'énergie et l'alimentation — les postes qui ont le plus augmenté — pèsent plus lourd dans leur budget` },
        { fr: `Parce qu'ils empruntent davantage` },
        { fr: `Ce n'est pas le cas : l'inflation touche tout le monde pareil` },
      ],
      bonneReponse: 1,
      explication: { fr: `La structure du budget fait l'exposition : plus la part contrainte (énergie, alimentation, logement) est grande, plus le choc 2021-2023 a été douloureux — et moins il y a d'épargne pour amortir.` },
    },
    {
      question: { fr: `Qu'est-ce que la « boucle prix-salaires » que les banques centrales redoutent ?` },
      options: [
        { fr: `La baisse simultanée des prix et des salaires` },
        { fr: `Un engrenage où hausses de prix et hausses de salaires se nourrissent mutuellement et installent l'inflation durablement` },
        { fr: `L'indexation du SMIC` },
        { fr: `Un mécanisme européen de contrôle des prix` },
      ],
      bonneReponse: 1,
      explication: { fr: `Si les salaires suivent intégralement les prix, les coûts des entreprises montent, qui remontent les prix, etc. C'est le souvenir des années 1970 — et l'argument central contre l'indexation générale, contesté par ceux qui soulignent que l'épisode 2021-2023 n'a pas déclenché cette spirale.` },
    },
    {
      question: { fr: `Pourquoi l'inflation française a-t-elle été parmi les plus basses d'Europe en 2022-2023 ?` },
      options: [
        { fr: `Parce que la France n'importe pas d'énergie` },
        { fr: `Grâce notamment au bouclier tarifaire sur l'énergie et au poids du nucléaire — au prix d'un coût budgétaire élevé` },
        { fr: `Parce que les salaires y sont bloqués` },
        { fr: `Par hasard statistique` },
      ],
      bonneReponse: 1,
      explication: { fr: `Le plafonnement des prix du gaz et de l'électricité a contenu le choc énergétique — la principale cause de l'épisode — mieux que chez la plupart des voisins. Le débat porte sur son coût (plusieurs dizaines de milliards) et son ciblage.` },
    },
  ],

  motsAssocies: ['dette-publique', 'economie-de-marche', 'proportionnelle'],
  continuerAvec: [
    { slug: 'retraites' },
    { slug: 'dette-publique' },
    { label: { fr: `Le pouvoir d'achat` }, soon: true },
  ],

  sources: [
    { label: `INSEE — indice des prix à la consommation, séries et analyses (inflation 2022 : 5,2 % ; 2023 : 4,9 % ; 2024 : 2,0 %)`, url: 'https://www.insee.fr', year: 2024, perimetre: `IPC France, moyennes annuelles` },
    { label: `Eurostat — inflation harmonisée (IPCH) zone euro`, url: 'https://ec.europa.eu/eurostat', year: 2024 },
    { label: `Banque de France / BCE — analyses des causes de l'épisode 2021-2023 et de la politique monétaire`, url: 'https://www.banque-france.fr', year: 2024 },
    { label: `Vie-publique.fr — mesures pouvoir d'achat 2021-2024 ; Cour des comptes — coût des mesures énergie`, url: 'https://www.vie-publique.fr', year: 2024 },
  ],
};
