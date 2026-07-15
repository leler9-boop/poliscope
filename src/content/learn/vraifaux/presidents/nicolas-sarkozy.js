/**
 * Items « Vrai ou faux ? » — fiche président Nicolas Sarkozy.
 * Uniquement les items NOUVEAUX référencés par la fiche
 * (src/content/learn/presidents/nicolas-sarkozy.js).
 *
 * verdict : 'vrai' | 'faux' | 'partiel' | 'trompeur' | 'sans-contexte'
 */

export default {

  'vf-sarkozy-retraite-60': {
    categorie: 'presidents',
    enonce: { fr: `Sarkozy a supprimé la retraite à 60 ans.` },
    verdict: 'partiel',
    explication: {
      fr: `La réforme du 9 novembre 2010 a reporté l'âge légal de départ de 60 à 62 ans — c'est bien la fin de la « retraite à 60 ans » comme règle générale, instaurée en 1982 sous Mitterrand. Mais la formule « supprimé la retraite à 60 ans » entretient deux confusions. D'abord, la retraite elle-même n'a évidemment pas été supprimée : seul l'âge d'ouverture des droits a été repoussé de deux ans. Ensuite, des départs anticipés ont été maintenus, notamment pour les carrières longues (ceux qui ont commencé à travailler très jeunes), élargis ensuite en 2012 : une partie des salariés a continué à partir à 60 ans ou avant. L'âge légal sera de nouveau reporté, à 64 ans, par la réforme de 2023.`,
    },
    sources: [{ label: `Légifrance — loi du 9 novembre 2010 portant réforme des retraites ; Vie-publique.fr — dossiers retraites 2010 et 2023`, url: 'https://www.legifrance.gouv.fr', year: 2010 }],
    related: ['nicolas-sarkozy'],
  },

  'vf-sarkozy-bouclier-fiscal': {
    categorie: 'presidents',
    enonce: { fr: `Le bouclier fiscal ne profitait qu'aux riches.` },
    verdict: 'sans-contexte',
    explication: {
      fr: `Le bouclier fiscal (loi TEPA, 2007) plafonnait l'ensemble des impôts directs à 50 % des revenus. En principe, tout contribuable pouvait en bénéficier — y compris, cas réel mais marginal, des ménages modestes détenant un patrimoine peu rentable. Dans les faits, les rapports parlementaires et les données de l'administration fiscale ont montré que l'essentiel des montants restitués allait à un petit nombre de très gros patrimoines : quelques milliers de foyers assujettis à l'ISF concentraient la majorité des sommes, avec des restitutions moyennes très élevées pour les patrimoines les plus importants. « Ne profitait qu'aux riches » est donc excessif au sens strict, mais « profitait massivement aux plus riches » est documenté. Le dispositif, devenu politiquement intenable pendant la crise, a été supprimé en 2011 — par la majorité qui l'avait créé.`,
    },
    sources: [{ label: `Rapports parlementaires sur l'application de la loi TEPA et données de la direction générale des finances publiques, 2008-2011 ; Légifrance — loi TEPA du 21 août 2007 et loi de finances rectificative de 2011`, url: 'https://www.legifrance.gouv.fr', year: 2011 }],
    related: ['nicolas-sarkozy'],
  },

  'vf-sarkozy-dette-crise': {
    categorie: 'presidents',
    enonce: { fr: `C'est la crise de 2008 qui a creusé tout le déficit sous Sarkozy.` },
    verdict: 'trompeur',
    explication: {
      fr: `La crise a joué massivement : la récession de 2009 (environ -2,9 % de PIB) a effondré les recettes fiscales et gonflé les dépenses sociales, et les plans de sauvetage et de relance ont pesé — tous les pays comparables ont vu leur dette bondir. Mais dire que « tout » vient de la crise efface l'autre moitié du tableau : les baisses d'impôts décidées dès 2007 (loi TEPA notamment) ont réduit les recettes avant même le choc, et la Cour des comptes a souligné de façon répétée que le déficit français était déjà structurellement dégradé à la veille de la crise, ce qui a réduit les marges de manœuvre. La dette est passée d'environ 64 % du PIB fin 2007 à environ 90 % fin 2012 : la crise en explique la plus grande part, pas la totalité. Les deux lectures partisanes — « tout la crise » ou « tout ses choix » — sont l'une et l'autre indéfendables.`,
    },
    sources: [
      { label: `Cour des comptes — rapports sur la situation et les perspectives des finances publiques, 2009-2012`, url: 'https://www.ccomptes.fr', year: 2012 },
      { label: `INSEE — dette publique au sens de Maastricht, séries 2007-2012`, url: 'https://www.insee.fr', year: 2012 },
    ],
    related: ['nicolas-sarkozy'],
  },

  'vf-sarkozy-condamnation-libye': {
    categorie: 'presidents',
    enonce: { fr: `Nicolas Sarkozy a été définitivement condamné dans l'affaire du financement libyen.` },
    verdict: 'faux',
    explication: {
      fr: `Au regard des décisions rendues jusqu'à fin 2025 : dans l'affaire du financement libyen de la campagne de 2007, Sarkozy a été condamné en première instance en septembre 2025 (pour association de malfaiteurs), incarcéré puis libéré sous contrôle judiciaire — mais il a fait appel, l'affaire sera rejugée, et il bénéficie de la présomption d'innocence pour les faits qu'il conteste : cette condamnation n'est pas définitive. La confusion vient de ce que d'autres condamnations, elles, sont bien définitives : l'affaire des écoutes dite « Bismuth » (corruption et trafic d'influence — pourvoi rejeté par la Cour de cassation en décembre 2024, peine aménagée sous bracelet électronique début 2025) et l'affaire Bygmalion (financement illégal de la campagne de 2012). Distinguer les affaires — et le stade de chaque procédure — est indispensable.`,
    },
    sources: [
      { label: `Cour de cassation — arrêt de décembre 2024, affaire des écoutes dite « Bismuth »`, url: 'https://www.courdecassation.fr', year: 2024 },
      { label: `Tribunal correctionnel de Paris — jugement de septembre 2025, affaire du financement libyen (appel en cours à la date de vérification)`, year: 2025 },
    ],
    related: ['nicolas-sarkozy'],
  },

};
