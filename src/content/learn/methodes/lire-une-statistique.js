/**
 * Fiche méthode « Comment lire une statistique » — porte I (« Comment le sait-on ? »).
 * Objectif : donner les réflexes de lecture d'un chiffre entendu dans le débat
 * public (moyenne/médiane, points vs %, périmètre, corrélation), sans jargon
 * et sans complotisme. Tous les chiffres sont datés, périmétrés, « environ ».
 */

export default {
  slug: 'lire-une-statistique',
  type: 'fiche-methode',
  porte: 'I',
  title: { fr: `Comment lire une statistique`, en: 'How to read a statistic' },
  icon: '🧮',
  difficulty: 1,
  famille: 'dossier',
  updatedAt: '2026-07-12',
  freshness: { type: 'stable', reviewEveryMonths: 24, lastReviewedAt: '2026-07-12' },

  // ── N1 ──────────────────────────────────────────────────────────────────────
  level1: {
    fr: `Un chiffre n'est jamais faux ou vrai tout seul : tout dépend de ce qu'il mesure, quand, et sur qui. Le « salaire moyen » et le « salaire médian » racontent deux histoires différentes ; « +2 points » et « +20 % » peuvent décrire la même évolution. Avant de croire — ou de rejeter — une statistique, posez trois questions : quelle source ? quelle année ? quel périmètre ? Cette fiche vous donne les réflexes.`,
  },

  // ── N2 ──────────────────────────────────────────────────────────────────────
  level2: {
    sections: [
      {
        titre: { fr: `Moyenne ou médiane ? Deux chiffres, deux récits` },
        corps: {
          fr: `Dans le secteur privé, le salaire moyen est d'environ 2 600 € net par mois, et le salaire médian d'environ 2 100 € (INSEE, données d'environ 2023). Les deux sont exacts — mais ils ne disent pas la même chose. La moyenne additionne tous les salaires et divise : elle est tirée vers le haut par les très hauts salaires, même rares. La médiane coupe la population en deux : la moitié des salariés gagne moins, l'autre moitié gagne plus. C'est pourquoi la médiane décrit mieux le salarié « typique ». Quand quelqu'un choisit la moyenne plutôt que la médiane (ou l'inverse), il choisit aussi son récit : « les Français gagnent 2 600 € » et « un salarié sur deux gagne moins de 2 100 € » sont deux phrases justes… qui ne produisent pas le même effet.`,
        },
        sources: [{ label: `INSEE — « Salaires dans le secteur privé » (salaire net moyen et médian en équivalent temps plein)`, url: 'https://www.insee.fr', year: 2023 }],
      },
      {
        titre: { fr: `Pourcentage ou points de pourcentage ?` },
        brique: 'confusion',
        corps: {
          fr: `Si un taux passe de 10 % à 12 %, on peut dire deux choses exactes : il a augmenté de 2 points de pourcentage… ou de 20 % (car 2 est le cinquième de 10). Les deux formulations sont mathématiquement justes — et racontent des histoires opposées : « +2 points » paraît modeste, « +20 % » paraît spectaculaire. Le choix de l'une ou l'autre n'est jamais neutre. Réflexe : quand on vous annonce une hausse « de X % » sur un taux (chômage, impôt, popularité), demandez toujours les valeurs de départ et d'arrivée. Un taux qui passe de 1 % à 2 % a « doublé » (+100 %) tout en ne gagnant qu'un point : petit chiffre, gros titre.`,
        },
      },
      {
        titre: { fr: `Périmètre et définition : de quoi parle-t-on exactement ?` },
        corps: {
          fr: `Le « chômage » est l'exemple parfait : plusieurs chiffres justes coexistent, parce qu'ils ne mesurent pas la même chose. Le taux de chômage au sens du BIT (Bureau international du travail), mesuré par l'INSEE par enquête, était d'environ 7,5 % en 2024 : il ne compte que les personnes sans aucun emploi, disponibles et en recherche active. Les « demandeurs d'emploi en catégorie A » de France Travail forment un autre chiffre, issu des inscriptions administratives — et si l'on ajoute les catégories B et C (personnes ayant travaillé un peu dans le mois), le total est encore plus élevé. Trois chiffres, trois définitions, trois réalités — aucun n'est « truqué ». Quand deux personnes brandissent des chiffres du chômage différents, elles parlent souvent de périmètres différents. Réflexe : toujours demander LA définition utilisée.`,
        },
        sources: [
          { label: `INSEE — taux de chômage au sens du BIT (enquête Emploi)`, url: 'https://www.insee.fr', year: 2024 },
          { label: `DARES / France Travail — demandeurs d'emploi inscrits par catégorie (A, B, C…)`, url: 'https://dares.travail-emploi.gouv.fr', year: 2024 },
        ],
      },
      {
        titre: { fr: `Corrélation n'est pas causalité` },
        corps: {
          fr: `Deux courbes qui montent ensemble ne prouvent pas que l'une cause l'autre. Exemple classique : les ventes de glaces et les noyades augmentent les mêmes mois — non pas parce que les glaces font couler, mais parce qu'un troisième facteur (l'été, la chaleur) fait monter les deux. En politique, ce piège est partout : si un indicateur s'améliore après une réforme, la réforme n'en est pas forcément la cause — la conjoncture mondiale, une tendance déjà engagée ou une autre mesure peuvent expliquer le mouvement. Établir une causalité demande bien plus qu'une coïncidence de courbes : des comparaisons, des groupes témoins, du temps. Réflexe : devant « depuis que X, on observe Y », demandez ce qui se serait passé sans X — c'est la vraie question, et c'est la plus difficile.`,
        },
      },
      {
        titre: { fr: `À retenir : les 5 questions à poser à tout chiffre` },
        brique: 'a-retenir',
        corps: {
          fr: `1. Quelle source ? (statistique publique, institut privé, think tank, chiffre repris sans origine ?)\n2. Quelle année ? (un chiffre sans date peut avoir dix ans)\n3. Quel périmètre ? (quelle définition, quelle population, France entière ou champ restreint ?)\n4. Évolution ou niveau ? (« en hausse » ne dit pas si c'est haut ; « élevé » ne dit pas si ça monte)\n5. Comparé à quoi ? (un chiffre isolé ne dit rien : il prend son sens face au passé, aux voisins européens, ou à un ordre de grandeur)`,
        },
      },
    ],
  },

  // ── N3 ──────────────────────────────────────────────────────────────────────
  level3: {
    sections: [
      {
        id: 'base-100-et-evolutions',
        titre: { fr: `Comparer des évolutions : la base 100 et le choix de l'année de départ` },
        corps: {
          fr: `Pour comparer des évolutions (salaires et prix, deux pays, deux périodes), les statisticiens ramènent souvent tout à une « base 100 » : chaque série vaut 100 l'année de départ, et on lit directement les pourcentages d'écart. L'outil est honnête — mais le choix de l'année de départ ne l'est pas toujours. Partir d'un point exceptionnellement bas fait paraître la hausse spectaculaire ; partir d'un pic fait paraître la baisse dramatique. C'est le « cherry-picking » de l'année de départ : par exemple, mesurer une évolution économique « depuis 2020 » — année du confinement, où tout s'était effondré — garantit des chiffres de rebond impressionnants qui ne disent rien de la tendance longue. Réflexe : quand une évolution vous surprend, regardez ce qui se passe si l'on décale le point de départ de deux ou trois ans. Si la conclusion s'inverse, c'est que le chiffre tenait au choix de la fenêtre, pas au phénomène.`,
        },
      },
      {
        id: 'valeurs-absolues-et-relatives',
        titre: { fr: `« 10 milliards » : beaucoup ou pas ? Les ordres de grandeur qui sauvent` },
        corps: {
          fr: `« 10 milliards d'euros » : le chiffre impressionne, mais impressionner n'est pas informer. Pour juger, il faut un point de comparaison. Le budget de l'État représente environ 450 milliards d'euros de dépenses nettes par an (données d'environ 2024), et le PIB de la France environ 2 800 milliards d'euros (environ 2023). Dix milliards, c'est donc environ 2 % du budget de l'État et moins de 0,4 % du PIB — significatif, mais très loin de « ruiner » ou de « sauver » le pays. Le même exercice vaut dans l'autre sens : une économie de « 50 millions d'euros » annoncée en fanfare représente environ un dix-millième du budget de l'État. Réflexe : garder en tête trois ordres de grandeur (budget de l'État ~450 Md€, PIB ~2 800 Md€, population ~68 millions d'habitants) et systématiquement rapporter les milliards annoncés à l'un des trois. Diviser par la population aide aussi : 10 milliards, c'est environ 150 € par habitant.`,
        },
        sources: [
          { label: `Direction du budget / loi de finances — dépenses nettes du budget général de l'État`, url: 'https://www.budget.gouv.fr', year: 2024 },
          { label: `INSEE — produit intérieur brut de la France (comptes nationaux annuels)`, url: 'https://www.insee.fr', year: 2023 },
        ],
      },
      {
        id: 'qui-produit-les-chiffres',
        titre: { fr: `Qui produit les chiffres ? Toutes les sources ne se valent pas` },
        corps: {
          fr: `En France, la statistique publique — INSEE, et les services statistiques des ministères comme la DARES (travail) ou la DREES (santé, solidarités) — obéit à des règles d'indépendance professionnelle : méthodes publiées, données accessibles, calendriers de publication fixés à l'avance, et une Autorité de la statistique publique qui veille sur cette indépendance. Au niveau européen, Eurostat harmonise les définitions pour permettre de vraies comparaisons entre pays. Viennent ensuite les instituts privés (sondages, études commandées) : souvent sérieux, mais leurs méthodes et leurs commanditaires méritent d'être regardés. Puis les think tanks et associations militantes : leurs chiffres peuvent être exacts, mais la sélection des indicateurs et la présentation servent une thèse — c'est leur rôle, il faut juste le savoir. Dire cela n'est pas du complotisme, c'est de la hiérarchie des sources : un chiffre INSEE et un chiffre de tract n'ont pas le même statut, même quand les deux sont techniquement justes.`,
        },
        sources: [{ label: `Autorité de la statistique publique — indépendance et bonnes pratiques de la statistique publique française`, url: 'https://www.autorite-statistique-publique.fr', year: 2024 }],
      },
      {
        id: 'quand-deux-chiffres-se-contredisent',
        titre: { fr: `Quand deux chiffres se contredisent : le réflexe avant de crier à la manipulation` },
        corps: {
          fr: `Un ministre annonce que la délinquance baisse, une association qu'elle explose ; un économiste dit que le pouvoir d'achat monte, votre caddie dit le contraire. Avant de conclure que quelqu'un ment, vérifiez l'hypothèse la plus fréquente : deux périmètres différents. Faits constatés par la police ou enquêtes de victimation ? Pouvoir d'achat global ou par unité de consommation, moyenne nationale ou ressenti sur les produits achetés chaque semaine ? Chômage BIT ou inscrits à France Travail ? Dans l'immense majorité des cas, la « contradiction » disparaît quand on aligne les définitions — et ce qui reste est un vrai désaccord, plus petit et plus intéressant, sur le choix du bon indicateur. Ce choix-là est légitime et politique : mesurer, c'est déjà décider ce qui compte. Le réflexe final de cette fiche : face à deux chiffres qui se contredisent, chercher d'abord les deux définitions. C'est presque toujours là que se trouve l'explication — pas dans un mensonge.`,
        },
      },
    ],
  },

  vraiFaux: ['vf-stat-salaire-moyen-typique', 'vf-stat-courbes-causalite', 'vf-stat-chomage-truque'],

  quiz: [
    {
      question: { fr: `Dans le secteur privé, le salaire moyen (~2 600 € net) est plus élevé que le salaire médian (~2 100 €). Pourquoi ?` },
      options: [
        { fr: `Parce que la médiane ne compte pas les cadres` },
        { fr: `Parce que la moyenne est tirée vers le haut par les très hauts salaires` },
        { fr: `Parce que la médiane est calculée avant impôts` },
        { fr: `C'est une erreur : les deux devraient être égaux` },
      ],
      bonneReponse: 1,
      explication: { fr: `La moyenne additionne tout et divise : quelques très hauts salaires suffisent à la faire monter. La médiane coupe la population en deux — la moitié gagne moins — et décrit donc mieux le salarié « typique » (INSEE, données ~2023).` },
    },
    {
      question: { fr: `Un taux passe de 10 % à 12 %. Laquelle de ces affirmations est exacte ?` },
      options: [
        { fr: `Il a augmenté de 2 %` },
        { fr: `Il a augmenté de 12 %` },
        { fr: `Il a augmenté de 2 points, soit une hausse de 20 %` },
        { fr: `Il a augmenté de 20 points` },
      ],
      bonneReponse: 2,
      explication: { fr: `+2 points de pourcentage (12 − 10), ce qui représente une hausse relative de 20 % (2 est le cinquième de 10). Les deux formulations sont justes — et ne produisent pas du tout le même effet dans un titre de presse.` },
    },
    {
      question: { fr: `Le taux de chômage BIT de l'INSEE et le nombre de demandeurs d'emploi en catégorie A donnent des chiffres différents. Que faut-il en conclure ?` },
      options: [
        { fr: `L'un des deux organismes truque ses chiffres` },
        { fr: `Ils mesurent deux choses différentes, avec deux définitions publiques et légitimes` },
        { fr: `Il faut faire la moyenne des deux` },
        { fr: `Seul le chiffre le plus élevé est le vrai` },
      ],
      bonneReponse: 1,
      explication: { fr: `Le taux BIT (~7,5 % en 2024) est mesuré par enquête selon une définition internationale stricte ; les catégories de France Travail comptent les inscrits administratifs. Deux périmètres, deux chiffres justes — le réflexe est de demander la définition, pas de crier à la manipulation.` },
    },
    {
      question: { fr: `On vous annonce une mesure à « 10 milliards d'euros ». Quel est le bon réflexe pour juger si c'est beaucoup ?` },
      options: [
        { fr: `Un milliard, c'est toujours énorme : la question ne se pose pas` },
        { fr: `Comparer à un ordre de grandeur : ~450 Md€ de budget de l'État, ~2 800 Md€ de PIB` },
        { fr: `Regarder si le chiffre est rond ou précis` },
        { fr: `Convertir en dollars` },
      ],
      bonneReponse: 1,
      explication: { fr: `10 milliards ≈ 2 % du budget de l'État (~450 Md€ de dépenses nettes, ~2024) et moins de 0,4 % du PIB (~2 800 Md€, ~2023) — soit environ 150 € par habitant. Sans point de comparaison, un « gros chiffre » n'informe pas, il impressionne.` },
    },
    {
      question: { fr: `Les ventes de glaces et les noyades augmentent les mêmes mois. Qu'est-ce que cela prouve ?` },
      options: [
        { fr: `Que manger des glaces augmente le risque de noyade` },
        { fr: `Que les noyades font vendre des glaces` },
        { fr: `Rien en soi : un troisième facteur (l'été) explique les deux hausses` },
        { fr: `Que les deux statistiques sont fausses` },
      ],
      bonneReponse: 2,
      explication: { fr: `C'est l'exemple classique de corrélation sans causalité : la chaleur estivale fait monter les deux courbes. En politique, même réflexe devant « depuis la réforme X, l'indicateur Y s'améliore » — la vraie question est : que se serait-il passé sans X ?` },
    },
  ],

  // ── N4 ──────────────────────────────────────────────────────────────────────
  level4: {
    items: [
      { kind: 'lien', titre: { fr: `INSEE — « Comprendre les statistiques »` }, note: { fr: `Les définitions officielles (chômage BIT, salaire médian, pouvoir d'achat…), les méthodes d'enquête et des articles pédagogiques de l'institut national de la statistique.` }, url: 'https://www.insee.fr' },
      { kind: 'lien', titre: { fr: `DARES — statistiques du ministère du Travail` }, note: { fr: `Les données sur l'emploi, le chômage par catégories et les salaires, avec la documentation méthodologique qui explique chaque périmètre.` }, url: 'https://dares.travail-emploi.gouv.fr' },
      { kind: 'livre', titre: { fr: `Darrell Huff — « How to Lie with Statistics » (trad. fr.)` }, note: { fr: `Le petit classique (1954) sur les manipulations statistiques courantes : moyennes trompeuses, graphiques truqués, échantillons biaisés. Court, drôle, toujours d'actualité.` } },
      { kind: 'lien', titre: { fr: `Eurostat — statistiques européennes harmonisées` }, note: { fr: `Pour comparer la France à ses voisins avec les mêmes définitions : chômage, inflation, dette, dépenses publiques. L'antidote aux comparaisons internationales bricolées.` }, url: 'https://ec.europa.eu/eurostat' },
    ],
  },

  motsAssocies: ['dette-publique', 'inflation'],
  continuerAvec: [
    { slug: 'lire-un-sondage' },
    { slug: 'graphique-trompeur' },
    { slug: 'inflation' },
  ],

  sources: [
    { label: `INSEE — « Salaires dans le secteur privé » : salaire net moyen (~2 600 €) et médian (~2 100 €) en équivalent temps plein`, url: 'https://www.insee.fr', year: 2023, perimetre: `secteur privé, équivalent temps plein, France` },
    { label: `INSEE — taux de chômage au sens du BIT (enquête Emploi, ~7,5 % en 2024)`, url: 'https://www.insee.fr', year: 2024, perimetre: `France hors Mayotte, définition du Bureau international du travail` },
    { label: `DARES / France Travail — demandeurs d'emploi inscrits par catégorie (A, B, C…)`, url: 'https://dares.travail-emploi.gouv.fr', year: 2024 },
    { label: `INSEE — comptes nationaux : PIB de la France (~2 800 Md€) ; Direction du budget — dépenses nettes de l'État (~450 Md€)`, url: 'https://www.insee.fr', year: 2024 },
    { label: `Autorité de la statistique publique — indépendance de la statistique publique française`, url: 'https://www.autorite-statistique-publique.fr', year: 2024 },
  ],
};
