/**
 * Items « Vrai ou faux ? » — fiche président Emmanuel Macron (mandat en cours :
 * items rédigés au provisoire, arrêtés aux événements vérifiables).
 * Uniquement les items NOUVEAUX référencés par la fiche.
 *
 * verdict : 'vrai' | 'faux' | 'partiel' | 'trompeur' | 'sans-contexte'
 */

export default {

  'vf-macron-invente-49-3': {
    categorie: 'presidents',
    enonce: { fr: `C'est Emmanuel Macron qui a créé le 49.3.` },
    verdict: 'faux',
    explication: {
      fr: `L'article 49 alinéa 3 figure dans la Constitution de 1958 : il permet au gouvernement de faire adopter un texte sans vote, sauf motion de censure aboutie. La plupart des gouvernements depuis y ont recouru, et le record appartient aux gouvernements de Michel Rocard (28 utilisations, 1988-1991). Ce qui est vrai, c'est que la pratique est devenue intensive après 2022, faute de majorité absolue : le gouvernement d'Élisabeth Borne l'a engagé 23 fois, surtout pour les budgets et la réforme des retraites. Fréquence inédite sur une période aussi courte — mais l'outil, lui, a près de soixante-dix ans.`,
    },
    sources: [{ label: `Assemblée nationale — décompte officiel des engagements de responsabilité (article 49 al. 3) par gouvernement depuis 1958`, url: 'https://www.assemblee-nationale.fr', year: 2024 }],
    related: ['emmanuel-macron'],
  },

  'vf-macron-supprime-isf': {
    categorie: 'presidents',
    enonce: { fr: `Macron a supprimé l'impôt sur la fortune.` },
    verdict: 'partiel',
    explication: {
      fr: `L'ISF n'a pas disparu purement et simplement : depuis 2018, il est transformé en IFI, un impôt sur la fortune recentré sur le seul patrimoine immobilier, tandis que les revenus du capital (dividendes, intérêts, plus-values) sont taxés à un taux unique de 30 % (la « flat tax », ou PFU). Les valeurs mobilières — actions, placements financiers — sont donc sorties de l'impôt sur la fortune, ce qui fonde la critique du « cadeau aux riches ». Les effets économiques (investissement, retours d'exilés fiscaux) ont été évalués par le comité de suivi de France Stratégie : ils restent débattus et difficiles à isoler de la conjoncture.`,
    },
    sources: [
      { label: `Légifrance — loi de finances pour 2018 (création de l'IFI et du PFU)`, url: 'https://www.legifrance.gouv.fr', year: 2018 },
      { label: `France Stratégie — comité d'évaluation des réformes de la fiscalité du capital, rapports 2019-2023`, url: 'https://www.strategie.gouv.fr', year: 2023 },
    ],
    related: ['emmanuel-macron'],
  },

  'vf-macron-chomage-merite': {
    categorie: 'presidents',
    enonce: { fr: `La baisse du chômage depuis 2017, c'est uniquement grâce à Macron.` },
    verdict: 'sans-contexte',
    explication: {
      fr: `La baisse est réelle : d'environ 9,5 % en 2017, le taux de chômage est redescendu autour de 7-7,5 % à la date de vérification de cette fiche — son plus bas niveau depuis les années 1980. Mais en attribuer la totalité à un seul homme dépasse ce que les données permettent de dire : les politiques de l'offre (réformes du travail, fiscalité) ont joué, tout comme l'apprentissage massivement subventionné (qui améliore mécaniquement les chiffres), la conjoncture européenne et les mesures de soutien du « quoi qu'il en coûte ». Les économistes débattent du poids de chaque facteur, et certains discutent aussi la mesure elle-même (temps partiel subi, halo du chômage). Baisse vraie, causes multiples.`,
    },
    sources: [{ label: `INSEE — taux de chômage au sens du BIT, séries trimestrielles ; DARES — études sur l'apprentissage et l'emploi`, url: 'https://www.insee.fr', year: 2024 }],
    related: ['emmanuel-macron'],
  },

  'vf-macron-dissolution-obligatoire': {
    categorie: 'presidents',
    enonce: { fr: `Après la défaite aux européennes de 2024, Macron était obligé de dissoudre l'Assemblée.` },
    verdict: 'faux',
    explication: {
      fr: `Rien, dans la Constitution ni ailleurs, n'oblige un président à dissoudre après une défaite à des élections européennes — un scrutin qui ne concerne pas l'Assemblée nationale. La dissolution (article 12) est un pouvoir discrétionnaire du chef de l'État, l'un des rares qu'il exerce sans contreseing du Premier ministre. Le 9 juin 2024, c'est donc un choix personnel, qui a surpris jusque dans son propre camp. Ses conséquences sont documentées : une Assemblée fragmentée en trois blocs sans majorité, une instabilité gouvernementale durable et, le 4 décembre 2024, la censure du gouvernement Barnier — première motion de censure aboutie depuis 1962.`,
    },
    sources: [
      { label: `Constitution du 4 octobre 1958, article 12 — Légifrance`, url: 'https://www.legifrance.gouv.fr', year: 1958 },
      { label: `Vie-publique.fr — la dissolution du 9 juin 2024 et ses suites`, url: 'https://www.vie-publique.fr', year: 2024 },
    ],
    related: ['emmanuel-macron'],
  },

};
