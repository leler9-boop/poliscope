/**
 * Items « Vrai ou faux ? » — fiche méthode « Reconnaître un graphique trompeur ».
 * Uniquement les items NOUVEAUX référencés par la fiche.
 *
 * verdict : 'vrai' | 'faux' | 'partiel' | 'trompeur' | 'sans-contexte'
 */

export default {

  'vf-graph-donnees-exactes-honnete': {
    categorie: 'methodes',
    enonce: { fr: `Si les données d'un graphique sont exactes, alors le graphique est honnête.` },
    verdict: 'faux',
    explication: {
      fr: `Un graphique peut être exact point par point et tromper par sa présentation. Un axe qui commence à 95 au lieu de 0 transforme une hausse de 2 % en explosion visuelle ; une courbe démarrée au sommet d'un cycle « prouve » une amélioration ; un double axe aux échelles ajustées fabrique une corrélation ; une bulle deux fois plus large paraît quatre fois plus grosse. Dans tous ces cas, aucun chiffre n'est faux — c'est le cadrage qui ment. C'est même la forme de désinformation la plus difficile à contrer : elle se défend en disant « vérifiez, les données sont exactes ». L'honnêteté d'un graphique se juge sur l'ensemble : le point de départ des axes, la période retenue, les unités, et ce que le même graphique dirait avec un autre cadrage.`,
    },
    sources: [{ label: `Alberto Cairo, How Charts Lie, W. W. Norton — des graphiques exacts qui trompent`, url: 'https://www.albertocairo.com', year: 2019 }],
    related: ['graphique-trompeur'],
  },

  'vf-graph-axe-zero': {
    categorie: 'methodes',
    enonce: { fr: `Un axe vertical doit toujours commencer à zéro.` },
    verdict: 'partiel',
    explication: {
      fr: `Pour des quantités — des voix, des euros, des effectifs — représentées par des barres, oui en général : la hauteur de la barre encode la valeur, et tronquer l'axe grossit artificiellement les écarts. Mais la règle n'est pas absolue. Pour des températures, des taux qui varient dans une bande étroite ou des cours de bourse, un axe resserré peut être légitime, voire nécessaire : une courbe de fièvre tracée depuis 0 °C serait illisible, et le zéro n'y a pas de sens particulier. L'important n'est pas le zéro en soi, c'est la transparence : une échelle affichée clairement, une coupure d'axe signalée, et un choix qui sert la lecture plutôt que la dramatisation. Le réflexe reste le même : toujours regarder où commence l'axe avant de juger l'ampleur d'une variation.`,
    },
    sources: [{ label: `INSEE — bonnes pratiques de datavisualisation ; Alberto Cairo, How Charts Lie (2019)`, url: 'https://www.insee.fr', year: 2024 }],
    related: ['graphique-trompeur'],
  },

  'vf-graph-cartes-electorales': {
    categorie: 'methodes',
    enonce: { fr: `Les cartes électorales coloriées par communes montrent qui a gagné l'élection.` },
    verdict: 'trompeur',
    explication: {
      fr: `Ces cartes colorient des surfaces, alors qu'une élection compte des personnes — et la surface n'est pas la population. Une commune rurale de 200 habitants peut couvrir des dizaines de kilomètres carrés quand un arrondissement urbain de 200 000 habitants tient sur quelques-uns : le camp majoritaire dans les zones rurales peu peuplées paraît donc écraser la carte, même s'il est minoritaire en voix. Une carte presque entièrement d'une couleur peut correspondre à une élection serrée, voire perdue par le camp qui domine visuellement. Le résultat réel est dans les totaux de voix publiés par le ministère de l'Intérieur, pas dans les kilomètres carrés. Des représentations plus fidèles existent : cartes par points, cartes pondérées par la densité, ou anamorphoses, qui redimensionnent chaque territoire selon sa population.`,
    },
    sources: [{ label: `Ministère de l'Intérieur — résultats officiels des élections (totaux de voix par candidat)`, url: 'https://www.interieur.gouv.fr', year: 2024 }],
    related: ['graphique-trompeur'],
  },

};
