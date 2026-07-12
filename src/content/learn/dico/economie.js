/** Dictionnaire — catégorie « Économie ». */

export const TERMS = {

  'dette-publique': {
    slug: 'dette-publique',
    type: 'definition',
    categorie: 'economie',
    title: { fr: `La dette publique`, en: 'Public debt' },
    icon: '📉',
    difficulty: 1,
    famille: 'intermediaire',
    updatedAt: '2026-07-12',
    freshness: { type: 'live', reviewEveryMonths: 3, lastReviewedAt: '2026-07-12' },
    level1: {
      fr: `La dette publique, c'est l'argent que l'État (et les administrations publiques) a emprunté et n'a pas encore remboursé. Elle augmente quand l'État dépense plus qu'il ne collecte en impôts.`,
    },
    level2: {
      sections: [
        {
          titre: { fr: 'Concrètement' },
          corps: {
            fr: `L'État emprunte en émettant des obligations — des reconnaissances de dette que des investisseurs achètent. Il paie des intérêts, puis rembourse en réempruntant le plus souvent. La dette publique française dépasse 3 000 milliards d'euros, soit environ 110 % du PIB (INSEE, 2025) — au-dessus de la référence européenne de 60 %. Les intérêts coûtent plus de 50 milliards d'euros par an, un montant comparable au budget de l'Éducation nationale.`,
          },
        },
        {
          titre: { fr: 'Attention à la confusion' },
          brique: 'confusion',
          corps: {
            fr: `La dette n'est pas le déficit. Le déficit, c'est le trou d'UNE année (dépenses moins recettes). La dette, c'est l'accumulation de tous les déficits passés. Réduire le déficit ne réduit pas la dette : cela la fait seulement augmenter moins vite.`,
          },
        },
        {
          titre: { fr: 'Ce qui fait débat' },
          corps: {
            fr: `Pour certains économistes, cette dette est un danger : elle transfère des coûts aux générations futures et rend la France vulnérable à une hausse des taux d'intérêt. Pour d'autres, emprunter pour investir (santé, éducation, transition écologique) est rationnel à long terme, et réduire les dépenses trop vite peut casser l'économie. Le désaccord porte moins sur les chiffres que sur le rythme et sur qui doit supporter l'effort.`,
          },
        },
      ],
    },
    motsAssocies: ['economie-de-marche'],
    sources: [
      { label: `INSEE — dette trimestrielle des administrations publiques (au sens de Maastricht)`, url: 'https://www.insee.fr', year: 2025, perimetre: `ensemble des administrations publiques` },
      { label: `Vie-publique.fr — fiche « Dette publique »`, url: 'https://www.vie-publique.fr', year: 2025 },
    ],
    vraiFaux: [],
  },

  'economie-de-marche': {
    slug: 'economie-de-marche',
    type: 'definition',
    categorie: 'economie',
    title: { fr: `L'économie de marché`, en: 'Market economy' },
    icon: '🏪',
    difficulty: 1,
    famille: 'court',
    updatedAt: '2026-07-12',
    freshness: { type: 'stable', reviewEveryMonths: 24, lastReviewedAt: '2026-07-12' },
    level1: {
      fr: `Une économie de marché est un système où les prix, la production et les échanges sont principalement déterminés par l'offre et la demande — c'est-à-dire par les choix des entreprises et des consommateurs, plutôt que par l'État.`,
    },
    level2: {
      sections: [
        {
          titre: { fr: 'Concrètement' },
          corps: {
            fr: `Quand vous achetez un téléphone fabriqué par une entreprise privée, à un prix fixé par la concurrence, c'est le marché qui fonctionne. Quand l'État fixe le prix du livre, plafonne certains loyers ou gère les hôpitaux publics, c'est une intervention dans le marché. Presque tous les pays, dont la France, sont des « économies mixtes » : le débat politique porte sur la part respective du marché et de l'État — pas sur le choix de l'un contre l'autre.`,
          },
        },
      ],
    },
    motsAssocies: ['dette-publique'],
    sources: [
      { label: `INSEE — définitions et concepts économiques`, url: 'https://www.insee.fr', year: 2025 },
    ],
    vraiFaux: [],
  },
};

export default TERMS;
