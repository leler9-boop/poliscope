/**
 * Items « Vrai ou faux ? » — fiche président François Hollande.
 * Uniquement les items NOUVEAUX référencés par la fiche.
 *
 * verdict : 'vrai' | 'faux' | 'partiel' | 'trompeur' | 'sans-contexte'
 */

export default {

  'vf-hollande-entreprises': {
    categorie: 'presidents',
    enonce: { fr: `François Hollande n'a pris aucune mesure favorable aux entreprises.` },
    verdict: 'faux',
    explication: {
      fr: `C'est même le contraire qui a marqué son quinquennat : le CICE (crédit d'impôt pour la compétitivité et l'emploi, 2013) puis le pacte de responsabilité (annoncé en janvier 2014, environ 40 milliards d'euros d'allègements) représentent des dizaines de milliards orientés vers les entreprises, complétés par la loi Macron (2015) et la loi travail (2016). Ce tournant pro-entreprises est précisément ce que lui a reproché l'aile gauche de sa propre majorité — les « frondeurs » —, jusqu'à provoquer la démission de ministres en août 2014. On peut débattre de l'efficacité de ces mesures, pas de leur existence.`,
    },
    sources: [{ label: `Vie-publique.fr — le CICE (2013) et le pacte de responsabilité (2014)`, url: 'https://www.vie-publique.fr', year: 2014 }],
    related: ['francois-hollande'],
  },

  'vf-hollande-courbe-chomage': {
    categorie: 'presidents',
    enonce: { fr: `François Hollande a inversé la courbe du chômage.` },
    verdict: 'partiel',
    explication: {
      fr: `La baisse a bien eu lieu, mais tardivement. Hollande avait promis l'inversion pour fin 2013 ; le chômage a continué de monter jusqu'à un pic d'environ 10,5 % en 2015 (au sens du BIT), avant d'amorcer une décrue fin 2016, dans les derniers mois du mandat. L'affirmation est donc partiellement vraie : la courbe s'est inversée, mais trois ans après l'échéance annoncée, et les économistes débattent encore de la part attribuable à sa politique (CICE, pacte de responsabilité) et de celle qui revient à la reprise européenne générale. Ni « promesse tenue » ni « échec total » ne résument honnêtement les données.`,
    },
    sources: [{ label: `INSEE — taux de chômage au sens du BIT, séries trimestrielles 2012-2017`, url: 'https://www.insee.fr', year: 2017, perimetre: `France hors Mayotte, définition BIT` }],
    related: ['francois-hollande'],
  },

  'vf-hollande-mariage-sans-debat': {
    categorie: 'presidents',
    enonce: { fr: `Le mariage pour tous a été imposé sans débat.` },
    verdict: 'faux',
    explication: {
      fr: `Le débat a été exceptionnellement long et public. Au Parlement, le texte a occupé 136 heures 46 de discussions à l'Assemblée nationale et au Sénat avant son adoption, et la loi a été promulguée le 17 mai 2013 après validation par le Conseil constitutionnel. Dans le pays, le sujet a dominé l'actualité pendant des mois, avec de très grandes manifestations des opposants comme des partisans. On peut considérer que le gouvernement aurait dû organiser un référendum ou davantage de concertation — c'est une opinion —, mais affirmer qu'il n'y a pas eu de débat est factuellement inexact : ce fut l'un des débats parlementaires et publics les plus intenses de la décennie.`,
    },
    sources: [{ label: `Assemblée nationale — dossier législatif de la loi n° 2013-404 du 17 mai 2013 ouvrant le mariage aux couples de personnes de même sexe`, url: 'https://www.assemblee-nationale.fr', year: 2013 }],
    related: ['francois-hollande'],
  },

  'vf-hollande-renoncement': {
    categorie: 'presidents',
    enonce: { fr: `François Hollande est le seul président de la Ve République à avoir renoncé à se représenter.` },
    verdict: 'vrai',
    explication: {
      fr: `Le 1er décembre 2016, avec une cote de popularité tombée sous les 15 %, Hollande annonce qu'il ne briguera pas de second mandat : aucun président sortant de la Ve République n'avait fait ce choix avant lui. Précision utile pour éviter les confusions : d'autres présidents n'ont pas fait deux mandats complets, mais pour d'autres raisons — de Gaulle a démissionné en 1969 après un référendum perdu, Pompidou est mort en fonction en 1974, et Giscard d'Estaing, Sarkozy (2012) comme Hollande ont fait un seul mandat, mais les deux premiers s'étaient représentés et avaient été battus. Le renoncement volontaire à candidater reste, à ce jour, unique.`,
    },
    sources: [{ label: `Vie-publique.fr — allocution du 1er décembre 2016 et chronologie du quinquennat`, url: 'https://www.vie-publique.fr', year: 2016 }],
    related: ['francois-hollande'],
  },

};
