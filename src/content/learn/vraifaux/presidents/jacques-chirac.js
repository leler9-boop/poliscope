/**
 * Items « Vrai ou faux ? » — fiche président Jacques Chirac.
 * Uniquement les items NOUVEAUX référencés par la fiche.
 *
 * verdict : 'vrai' | 'faux' | 'partiel' | 'trompeur' | 'sans-contexte'
 */

export default {

  'vf-chirac-rien-reforme': {
    categorie: 'presidents',
    enonce: { fr: `Chirac n'a rien réformé en douze ans.` },
    verdict: 'trompeur',
    explication: {
      fr: `Des réformes durables existent : le quinquennat (2000), la fin du service militaire obligatoire (1997), la réforme des retraites de 2003, la loi de 2004 sur les signes religieux à l'école, la Charte de l'environnement (2005) — sans compter le geste mémoriel du Vél d'Hiv. Mais le jugement d'un bilan réformateur limité n'est pas infondé : le plan Juppé est amputé de son volet retraites en 1995, le CPE est retiré en 2006, la dissolution de 1997 offre cinq ans de pouvoir à la gauche, et la dette progresse. Le vrai débat n'est pas « rien » contre « beaucoup », mais l'écart entre les ambitions affichées en 1995 et ce qui a été mené à terme.`,
    },
    sources: [{ label: `Vie-publique.fr — chronologies des réformes 1995-2007 ; Légifrance — textes cités`, url: 'https://www.vie-publique.fr', year: 2025 }],
    related: ['jacques-chirac'],
  },

  'vf-chirac-non-2005-respecte': {
    categorie: 'presidents',
    enonce: { fr: `Le non des Français au référendum de 2005 a été respecté.` },
    verdict: 'partiel',
    explication: {
      fr: `Le traité établissant une Constitution pour l'Europe, rejeté par 54,67 % des votants le 29 mai 2005, n'est jamais entré en vigueur : en ce sens strict, le vote a été suivi d'effet. Mais le traité de Lisbonne, négocié en 2007 et ratifié par la France par voie parlementaire en février 2008 (sous Nicolas Sarkozy, donc après Chirac), a repris une grande partie du contenu institutionnel du texte rejeté, en abandonnant le vocabulaire constitutionnel. Ses défenseurs soulignent que des différences réelles existent et que la ratification parlementaire est parfaitement légale ; ses critiques y voient un contournement du suffrage. Les deux lectures se discutent — c'est l'un des épisodes les plus débattus du rapport entre référendum et construction européenne.`,
    },
    sources: [
      { label: `Conseil constitutionnel — proclamation des résultats du référendum du 29 mai 2005`, url: 'https://www.conseil-constitutionnel.fr', year: 2005 },
      { label: `Vie-publique.fr — du traité constitutionnel au traité de Lisbonne (2005-2008)`, url: 'https://www.vie-publique.fr', year: 2008 },
    ],
    related: ['jacques-chirac'],
  },

  'vf-chirac-35-heures': {
    categorie: 'presidents',
    enonce: { fr: `Les 35 heures, c'est Chirac.` },
    verdict: 'faux',
    explication: {
      fr: `Les 35 heures sont l'œuvre du gouvernement de Lionel Jospin (lois Aubry de 1998 et 2000), arrivé à Matignon après la dissolution ratée de 1997 — pendant la cohabitation, c'est le gouvernement qui conduit la politique économique et sociale, pas le président. Chirac et sa majorité y étaient opposés ; les gouvernements Raffarin et Villepin en ont ensuite assoupli l'application sans les abroger. On ne peut donc ni lui attribuer la mesure, ni la lui reprocher directement — tout au plus peut-on rappeler que sans sa dissolution de 1997, la gauche n'aurait pas gouverné à ce moment-là.`,
    },
    sources: [{ label: `Légifrance — lois du 13 juin 1998 et du 19 janvier 2000 (lois Aubry)`, url: 'https://www.legifrance.gouv.fr', year: 2000 }],
    related: ['jacques-chirac'],
  },

  'vf-chirac-82-adhesion': {
    categorie: 'presidents',
    enonce: { fr: `En 2002, 82 % des Français ont approuvé le programme de Chirac.` },
    verdict: 'trompeur',
    explication: {
      fr: `Le chiffre est exact — 82,21 % au second tour du 5 mai 2002 — mais l'interprétation ne l'est pas. Ce score s'explique par l'élimination surprise de Lionel Jospin au premier tour (le « choc du 21 avril ») : face à Jean-Marie Le Pen, la gauche a massivement voté Chirac pour faire barrage à l'extrême droite, souvent en le disant explicitement. Au premier tour, celui qui mesure les adhésions, Chirac n'avait recueilli que 19,88 % des suffrages exprimés. Présenter les 82 % comme un plébiscite de son programme confond un vote de barrage et un vote d'adhésion — une confusion qui a d'ailleurs pesé sur la légitimité perçue des réformes du second mandat.`,
    },
    sources: [{ label: `Conseil constitutionnel — résultats officiels de l'élection présidentielle de 2002 (deux tours)`, url: 'https://www.conseil-constitutionnel.fr', year: 2002 }],
    related: ['jacques-chirac'],
  },

};
