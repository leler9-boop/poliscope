/**
 * Fiche méthode « Reconnaître un graphique trompeur » — porte I
 * (« Comment le sait-on ? »). Un graphique peut être exact ET trompeur :
 * cette fiche décrit les pièges classiques par des exemples textuels
 * (pas d'images) et donne les réflexes pour les repérer.
 */

export default {
  slug: 'graphique-trompeur',
  type: 'fiche-methode',
  porte: 'I',
  title: { fr: `Reconnaître un graphique trompeur`, en: 'Spotting a misleading chart' },
  icon: '📉',
  difficulty: 1,
  famille: 'dossier',
  updatedAt: '2026-07-12',
  freshness: { type: 'stable', reviewEveryMonths: 24, lastReviewedAt: '2026-07-12' },

  // ── N1 ──────────────────────────────────────────────────────────────────────
  level1: {
    fr: `Un graphique peut être exact et pourtant trompeur : les chiffres sont vrais, mais la présentation oriente le regard — axe tronqué, période bien choisie, échelles bricolées, effets 3D. La bonne nouvelle, c'est que ces pièges sont peu nombreux et se repèrent en quelques réflexes simples. Avant de vous laisser impressionner par une courbe « spectaculaire », posez trois questions : où commence l'axe ? sur quelle période ? avec quelles unités ?`,
  },

  // ── N2 ──────────────────────────────────────────────────────────────────────
  level2: {
    sections: [
      {
        titre: { fr: `L'axe tronqué : le piège n°1 des débats télévisés` },
        corps: {
          fr: `Imaginez un graphique en barres comparant un taux passé de 95 à 97. Si l'axe vertical commence à zéro, les deux barres sont presque identiques : la hausse de 2 % est visible mais modeste. Si l'axe commence à 95, la seconde barre est infiniment plus haute que la première : la même hausse de 2 % devient une explosion visuelle. Les données n'ont pas changé d'un iota — seul le point de départ de l'axe a changé.\n\nC'est le procédé le plus courant dans les infographies de plateaux télévisés et les visuels partagés sur les réseaux sociaux : il ne demande aucune falsification, juste un cadrage. Le réflexe : chercher où commence l'axe vertical. S'il ne part pas de zéro et que rien ne le signale (échelle affichée, coupure marquée sur l'axe), méfiance — quelqu'un a peut-être voulu grossir l'effet.`,
        },
        sources: [{ label: `Alberto Cairo, How Charts Lie, W. W. Norton — chapitre sur les axes et les échelles`, url: 'https://www.albertocairo.com', year: 2019 }],
      },
      {
        titre: { fr: `La période choisie : demander toujours « et avant ? »` },
        corps: {
          fr: `Une courbe du chômage qui démarre au point le plus haut d'un cycle économique ne peut que descendre : le graphique « prouve » que la politique menée fonctionne. La même courbe démarrée au point le plus bas ne peut que monter : elle « prouve » l'échec. Aucun des deux graphiques ne ment sur les valeurs — chacun ment par le cadrage temporel.\n\nLe choix de la première date d'une courbe est une décision éditoriale, jamais neutre. Un gouvernement fera volontiers commencer les séries à son arrivée au pouvoir ; un opposant les fera commencer juste avant une amélioration, pour se l'attribuer ou la minimiser. Le réflexe : demander « et avant ? ». Une série longue — dix, vingt ans — replace presque toujours la variation vantée dans un mouvement plus ancien, souvent moins flatteur pour celui qui présente le graphique.`,
        },
        sources: [{ label: `INSEE — séries longues du chômage au sens du BIT : l'outil de référence pour vérifier un cadrage temporel`, url: 'https://www.insee.fr', year: 2025 }],
      },
      {
        titre: { fr: `Le double axe : des corrélations fabriquées à l'œil` },
        corps: {
          fr: `Superposez deux courbes sur un même graphique, avec une échelle à gauche pour la première et une échelle différente à droite pour la seconde. En étirant ou compressant l'une des deux échelles, on peut faire coller visuellement presque n'importe quelles courbes : l'immigration et le chômage, les dépenses publiques et la délinquance, tout se « corrèle » si l'on ajuste les axes jusqu'à ce que les lignes se suivent.\n\nLe double axe n'est pas toujours malhonnête — il peut servir à comparer deux grandeurs d'unités différentes — mais il donne à celui qui fabrique le graphique un pouvoir énorme : celui de créer une impression de lien là où rien n'est démontré. Le réflexe : repérer les deux échelles, vérifier leurs unités et leurs points de départ, et se rappeler qu'une superposition visuelle n'est jamais une preuve. Deux courbes qui se ressemblent, ce n'est pas une cause — c'est, au mieux, une question à creuser.`,
        },
        sources: [{ label: `Alberto Cairo, How Charts Lie, W. W. Norton — corrélations visuelles et doubles axes`, url: 'https://www.albertocairo.com', year: 2019 }],
      },
      {
        titre: { fr: `Surfaces et 3D : quand l'œil multiplie tout seul` },
        corps: {
          fr: `Pour représenter une valeur deux fois plus grande, un graphique à bulles dessine souvent un cercle deux fois plus large. Problème : un cercle deux fois plus large a une surface quatre fois plus grande — et c'est la surface que l'œil perçoit. La différence réelle est doublée visuellement, sans qu'aucun chiffre soit faux.\n\nMême mécanique avec la 3D : dans un camembert en perspective, la part placée « devant » paraît systématiquement plus grosse que sa valeur réelle, parce que la perspective l'étire vers le spectateur. Un secteur de 20 % placé au premier plan peut sembler dominer un secteur de 30 % relégué au fond. Les pictogrammes agrandis produisent le même effet : un billet de banque dessiné deux fois plus haut ET deux fois plus large paraît quatre fois plus gros. Le réflexe : se méfier de tout graphique qui encode une quantité dans une surface ou un volume, et de toute 3D décorative — elle n'ajoute jamais d'information, seulement de la distorsion.`,
        },
        sources: [{ label: `INSEE — bonnes pratiques de datavisualisation : proportionnalité des représentations et abandon des effets 3D`, url: 'https://www.insee.fr', year: 2024 }],
      },
      {
        titre: { fr: `À retenir : les 5 réflexes` },
        brique: 'a-retenir',
        corps: {
          fr: `Devant n'importe quel graphique, cinq questions suffisent :\n\n1. Où commence l'axe ? Un axe vertical qui ne part pas de zéro sans le signaler grossit artificiellement les écarts.\n2. Quelle période ? La date de départ d'une courbe est un choix — demandez « et avant ? » et cherchez la série longue.\n3. Quelles unités ? Valeurs brutes ou pourcentages, euros courants ou corrigés de l'inflation, points ou pour cent : le même chiffre change de sens selon l'unité.\n4. Quelle source ? Un graphique sans source vérifiable ne vaut rien, aussi soigné soit-il. Chiffre sans date ni périmètre = drapeau rouge.\n5. Que dirait le même graphique avec un autre cadrage ? C'est le test ultime : si un axe partant de zéro, une période plus longue ou une échelle unique raconteraient une autre histoire, c'est que le graphique vous en racontait une.`,
        },
      },
    ],
  },

  // ── N3 ──────────────────────────────────────────────────────────────────────
  level3: {
    sections: [
      {
        id: 'cartes-electorales-trompeuses',
        titre: { fr: `Les cartes électorales : la surface n'est pas la population` },
        corps: {
          fr: `Au lendemain d'une élection, les cartes coloriées commune par commune ou circonscription par circonscription envahissent les écrans. Elles ont un défaut structurel : elles colorient des surfaces, alors que les élections comptent des personnes. Une commune rurale de 200 habitants peut couvrir des dizaines de kilomètres carrés ; un arrondissement urbain de 200 000 habitants tient sur quelques-uns. Résultat : le camp majoritaire dans les zones rurales peu peuplées paraît écraser la carte, même quand il est minoritaire en voix.\n\nUne carte presque entièrement d'une couleur peut ainsi correspondre à une élection serrée, voire perdue par le camp qui « domine » visuellement. Ce n'est la faute de personne en particulier — c'est la géométrie — mais c'est un terrain rêvé pour les récits du type « la France entière a voté X ».\n\nDes alternatives existent : les cartes par points (un point = un nombre fixe d'électeurs), les cartes pondérées par la densité de population, et les anamorphoses — ces cartes déformées où chaque territoire est redimensionné selon sa population, familières aux lecteurs de la presse de données. Elles sont moins immédiates à lire, mais elles répondent à la bonne question : non pas « quelle surface a voté X ? », mais « combien de personnes ont voté X ? ».`,
        },
        sources: [{ label: `Ministère de l'Intérieur — résultats officiels des élections (les données brutes derrière toute carte électorale)`, url: 'https://www.interieur.gouv.fr', year: 2024 }],
      },
      {
        id: 'le-cherry-picking-visuel',
        titre: { fr: `Le cherry-picking visuel : choisir LE chiffre qui arrange` },
        corps: {
          fr: `Le « cherry-picking » — la cueillette des cerises — consiste à ne montrer que les données qui servent votre thèse : LE mois où la délinquance a baissé, LE pays européen qui fait moins bien que la France, LA courbe qui monte parmi dix indicateurs qui stagnent. Chaque donnée montrée est exacte ; c'est la sélection qui ment, par tout ce qu'elle laisse hors champ.\n\nEn version graphique, le procédé est particulièrement efficace parce qu'un graphique semble exhaustif : il montre « les données », et l'œil ne voit pas celles qui manquent. Un graphique comparant la France à deux pays choisis pour l'occasion suggère un classement général ; une courbe sur six mois suggère une tendance de fond ; un indicateur isolé (les effectifs de police, mais pas les faits constatés ; les créations d'emplois, mais pas la population active) suggère un bilan complet.\n\nL'antidote est toujours le même : la série longue et la comparaison complète. Devant un graphique sélectif, demandez : que donnent les autres mois, les autres pays, les autres indicateurs ? Si la réponse est introuvable ou si la source refuse de la donner, la sélection n'était probablement pas innocente. Les données publiques (INSEE, Eurostat) permettent presque toujours de reconstituer le tableau entier.`,
        },
        sources: [{ label: `Eurostat — bases de données comparatives européennes : l'outil pour vérifier une comparaison internationale sélective`, url: 'https://ec.europa.eu/eurostat', year: 2025 }],
      },
      {
        id: 'exact-mais-trompeur',
        titre: { fr: `« Exact mais trompeur » : la désinformation la plus difficile à contrer` },
        corps: {
          fr: `Le cas d'école de cette fiche mérite d'être nommé : le graphique dont chaque point est vrai et dont l'ensemble ment. Axe tronqué, période cueillie, double échelle, carte par surfaces — aucun de ces procédés ne falsifie une donnée. Un vérificateur qui contrôlerait chaque chiffre un par un conclurait : tout est exact. Et pourtant l'impression laissée au lecteur — « explosion », « effondrement », « le pays entier » — est fausse.\n\nC'est précisément ce qui rend cette forme de manipulation plus redoutable qu'un chiffre inventé. Un chiffre faux se réfute en une phrase et expose son auteur. Un graphique techniquement vrai se défend : « les données sont publiques, vérifiez ». La réfutation, elle, demande d'expliquer un cadrage, une échelle, une sélection — plusieurs phrases contre une image instantanée. En communication, l'image gagne presque toujours ce duel.\n\nD'où la conclusion pratique de cette fiche : ne demandez pas seulement « est-ce vrai ? », demandez « qu'est-ce qu'on veut me faire conclure, et le même graphique autrement cadré le montrerait-il encore ? ». L'exactitude des points se vérifie ; l'honnêteté d'un graphique se juge sur l'ensemble — ce qu'il montre, ce qu'il tait, et ce que son cadrage fait à votre perception.`,
        },
        sources: [{ label: `Alberto Cairo, How Charts Lie, W. W. Norton — le concept central du livre : des graphiques exacts qui trompent`, url: 'https://www.albertocairo.com', year: 2019 }],
      },
    ],
  },

  vraiFaux: ['vf-graph-donnees-exactes-honnete', 'vf-graph-axe-zero', 'vf-graph-cartes-electorales'],

  quiz: [
    {
      question: { fr: `Un graphique en barres montre un taux passant de 95 à 97, avec un axe vertical qui commence à 95. Quel est l'effet produit ?` },
      options: [
        { fr: `Aucun : les données sont exactes, le graphique est neutre` },
        { fr: `La hausse de 2 % paraît énorme, car la seconde barre semble plusieurs fois plus haute que la première` },
        { fr: `La hausse est minimisée, car l'axe est resserré` },
        { fr: `Le graphique devient illisible` },
      ],
      bonneReponse: 1,
      explication: { fr: `C'est l'axe tronqué : en faisant commencer l'axe à 95 au lieu de 0, tout l'espace visuel est consacré à l'écart entre 95 et 97. Une variation modeste devient une « explosion » — sans qu'aucun chiffre soit faux.` },
    },
    {
      question: { fr: `Un taux passe de 8 % à 10 %. Laquelle de ces formulations est la plus neutre ?` },
      options: [
        { fr: `« Une hausse de 2 % »` },
        { fr: `« Une hausse de 25 % »` },
        { fr: `« Une hausse de 2 points de pourcentage »` },
        { fr: `Les trois sont équivalentes` },
      ],
      bonneReponse: 2,
      explication: { fr: `De 8 % à 10 %, il y a +2 points de pourcentage — mais aussi +25 % en valeur relative (2/8). Les deux calculs sont justes ; celui qui veut dramatiser dira « +25 % », celui qui veut minimiser dira « +2 % ». « Points de pourcentage » est la formulation qui ne choisit pas pour vous.` },
    },
    {
      question: { fr: `Sur un graphique à bulles, une bulle deux fois plus large qu'une autre paraît…` },
      options: [
        { fr: `Deux fois plus grosse, comme la valeur qu'elle représente` },
        { fr: `Quatre fois plus grosse, car l'œil perçoit la surface, qui croît au carré de la largeur` },
        { fr: `Identique : la largeur ne change pas la perception` },
        { fr: `Plus petite, par effet d'optique` },
      ],
      bonneReponse: 1,
      explication: { fr: `Doubler la largeur d'un cercle multiplie sa surface par quatre — et c'est la surface que l'œil compare. Un graphique honnête fait varier la surface (et non le diamètre) proportionnellement aux valeurs ; beaucoup ne le font pas.` },
    },
    {
      question: { fr: `Une courbe du chômage démarre exactement au mois où un gouvernement est arrivé au pouvoir, à un sommet du cycle économique. Quel est le bon réflexe ?` },
      options: [
        { fr: `Vérifier chaque valeur de la courbe une par une` },
        { fr: `Demander « et avant ? » et chercher la série longue, car le choix de la date de départ oriente tout le récit` },
        { fr: `Rejeter le graphique : il est forcément falsifié` },
        { fr: `Comparer avec un autre pays` },
      ],
      bonneReponse: 1,
      explication: { fr: `Une courbe qui démarre en haut de cycle ne peut que descendre, une courbe démarrée en bas ne peut que monter. Les valeurs peuvent être toutes exactes : c'est le cadrage temporel qui fabrique le récit. La série longue le replace dans son contexte.` },
    },
    {
      question: { fr: `Un graphique superpose deux courbes avec deux échelles différentes (une à gauche, une à droite) et elles se suivent parfaitement. Que peut-on en conclure ?` },
      options: [
        { fr: `Que la première grandeur cause la seconde` },
        { fr: `Qu'il existe un lien statistique démontré entre les deux` },
        { fr: `Rien de solide : en ajustant les échelles, on peut faire coller visuellement presque n'importe quelles courbes` },
        { fr: `Que les données proviennent de la même source` },
      ],
      bonneReponse: 2,
      explication: { fr: `Le double axe donne à l'auteur du graphique le pouvoir d'étirer ou de compresser chaque échelle jusqu'à ce que les courbes coïncident. Une superposition visuelle n'est ni une corrélation mesurée ni, a fortiori, une causalité — c'est au mieux une question à creuser.` },
    },
  ],

  // ── N4 ──────────────────────────────────────────────────────────────────────
  level4: {
    items: [
      { kind: 'lien', titre: { fr: `INSEE — bonnes pratiques de datavisualisation` }, note: { fr: `Les règles que s'impose la statistique publique française : axes explicites, proportionnalité des surfaces, pas de 3D décorative. Un bon étalon pour juger les graphiques des autres.` }, url: 'https://www.insee.fr' },
      { kind: 'livre', titre: { fr: `Alberto Cairo — How Charts Lie (W. W. Norton, 2019)` }, note: { fr: `La référence sur les graphiques trompeurs, par un professeur de journalisme visuel : comment des graphiques exacts trompent, et comment devenir un lecteur de graphiques averti. En anglais, très accessible.` }, url: 'https://www.albertocairo.com' },
      { kind: 'lien', titre: { fr: `CLEMI — éducation aux médias et à l'information` }, note: { fr: `L'opérateur public de l'éducation aux médias : ressources pédagogiques sur la lecture critique des images, des chiffres et des infographies, utilisées dans les classes françaises.` }, url: 'https://www.clemi.fr' },
    ],
  },

  motsAssocies: [
    { label: { fr: `Cherry-picking` }, soon: true },
    { label: { fr: `Corrélation ≠ causalité` }, soon: true },
    { label: { fr: `Anamorphose` }, soon: true },
  ],
  continuerAvec: [
    { slug: 'lire-une-statistique', label: { fr: `Lire une statistique` }, soon: true },
    { slug: 'lire-un-sondage', label: { fr: `Lire un sondage` }, soon: true },
    { slug: 'fait-opinion-prediction', label: { fr: `Fait, opinion, prédiction` }, soon: true },
  ],

  sources: [
    { label: `Alberto Cairo, How Charts Lie: Getting Smarter about Visual Information, W. W. Norton & Company`, url: 'https://www.albertocairo.com', year: 2019 },
    { label: `INSEE — bonnes pratiques de datavisualisation et séries longues de la statistique publique`, url: 'https://www.insee.fr', year: 2025 },
    { label: `CLEMI — ressources d'éducation aux médias et à l'information : lecture critique des chiffres et des images`, url: 'https://www.clemi.fr', year: 2025 },
    { label: `Eurostat — bases de données comparatives européennes, pour vérifier les comparaisons internationales sélectives`, url: 'https://ec.europa.eu/eurostat', year: 2025 },
  ],
};
