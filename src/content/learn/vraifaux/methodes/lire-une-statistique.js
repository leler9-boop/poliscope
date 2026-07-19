/**
 * Items « Vrai ou faux ? » — fiche méthode « Comment lire une statistique ».
 * Uniquement les items NOUVEAUX référencés par la fiche.
 *
 * verdict : 'vrai' | 'faux' | 'partiel' | 'trompeur' | 'sans-contexte'
 */

export default {

  'vf-stat-salaire-moyen-typique': {
    categorie: 'methodes',
    enonce: { fr: `Le salaire moyen reflète ce que gagne un Français typique.` },
    verdict: 'trompeur',
    explication: {
      fr: `Le salaire moyen existe et il est exact — mais il ne décrit pas le salarié « typique ». Dans le secteur privé, le salaire net moyen est d'environ 2 600 € par mois, alors que le salaire médian est d'environ 2 100 € (INSEE, données d'environ 2023, en équivalent temps plein). L'écart vient des très hauts salaires : rares, mais suffisants pour tirer la moyenne vers le haut. La médiane, elle, coupe la population en deux — la moitié des salariés gagne moins de ~2 100 €, l'autre moitié gagne plus — et c'est donc elle qui décrit le mieux la situation courante. Concrètement : la majorité des salariés gagne moins que le salaire « moyen ». Celui qui cite la moyenne plutôt que la médiane (ou l'inverse) ne ment pas, mais il choisit le chiffre qui sert son récit — c'est exactement le réflexe à repérer.`,
    },
    sources: [{ label: `INSEE — « Salaires dans le secteur privé » : salaire net moyen et médian en équivalent temps plein`, url: 'https://www.insee.fr', year: 2023 }],
    related: ['lire-une-statistique'],
  },

  'vf-stat-courbes-causalite': {
    categorie: 'methodes',
    enonce: { fr: `Si deux courbes montent ensemble, c'est que l'une cause l'autre.` },
    verdict: 'faux',
    explication: {
      fr: `Deux courbes qui évoluent ensemble sont corrélées — mais la corrélation ne prouve aucune causalité. Trois explications sont toujours possibles : A cause B, B cause A, ou un troisième facteur cause les deux. L'exemple classique : les ventes de glaces et les noyades augmentent les mêmes mois, non pas parce que l'une provoque l'autre, mais parce que l'été fait monter les deux. Le hasard pur produit aussi des corrélations spectaculaires quand on compare assez de séries entre elles. En politique, le piège est constant : « depuis la réforme X, l'indicateur Y s'améliore » n'établit rien tant qu'on n'a pas examiné la conjoncture, les tendances déjà engagées et ce qui se serait passé sans la réforme. Établir une causalité demande des méthodes dédiées (comparaisons, groupes témoins, données sur la durée) — jamais une simple superposition de courbes.`,
    },
    sources: [{ label: `INSEE — « Comprendre les statistiques » : corrélation et causalité ; littérature méthodologique standard (ex. Darrell Huff, « How to Lie with Statistics », 1954)`, url: 'https://www.insee.fr', year: 2024 }],
    related: ['lire-une-statistique'],
  },

  'vf-stat-chomage-truque': {
    categorie: 'methodes',
    enonce: { fr: `Les chiffres du chômage sont truqués.` },
    verdict: 'trompeur',
    explication: {
      fr: `Ce qui nourrit ce soupçon est réel : plusieurs chiffres du chômage coexistent et ne disent pas la même chose. Mais ils sont tous publics, documentés et calculés selon des définitions différentes — pas falsifiés. Le taux de chômage au sens du BIT, mesuré par l'INSEE par enquête (environ 7,5 % en 2024), ne compte que les personnes sans aucun emploi, disponibles et en recherche active ; les demandeurs d'emploi en catégorie A de France Travail sont un décompte administratif des inscrits ; les catégories B et C ajoutent ceux qui ont un peu travaillé dans le mois. La statistique publique française est indépendante du pouvoir politique : méthodes publiées, calendriers fixés à l'avance, contrôle de l'Autorité de la statistique publique. Le vrai débat — légitime — porte sur le choix de l'indicateur le plus pertinent, et sur ce que chacun laisse dans l'ombre (halo du chômage, temps partiel subi). C'est une discussion de périmètre, pas une affaire de trucage.`,
    },
    sources: [
      { label: `INSEE — taux de chômage au sens du BIT (enquête Emploi) et note sur le « halo » autour du chômage`, url: 'https://www.insee.fr', year: 2024 },
      { label: `DARES / France Travail — demandeurs d'emploi inscrits par catégorie ; Autorité de la statistique publique — indépendance de la statistique publique`, url: 'https://dares.travail-emploi.gouv.fr', year: 2024 },
    ],
    related: ['lire-une-statistique'],
  },

};
