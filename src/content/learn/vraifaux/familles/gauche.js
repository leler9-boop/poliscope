/**
 * Items « Vrai ou faux ? » — dossier-pivot « La gauche ».
 * Uniquement les items NOUVEAUX référencés par la fiche.
 *
 * verdict : 'vrai' | 'faux' | 'partiel' | 'trompeur' | 'sans-contexte'
 */

export default {

  'vf-gauche-secu': {
    categorie: 'familles',
    enonce: { fr: `La gauche a créé la Sécurité sociale.` },
    verdict: 'partiel',
    explication: {
      fr: `La Sécurité sociale naît des ordonnances des 4 et 19 octobre 1945, prises par le gouvernement provisoire d'union nationale dirigé par le général de Gaulle, en application du programme du Conseil national de la Résistance. Le ministre communiste du Travail, Ambroise Croizat, en pilote la mise en place concrète, et les idées de solidarité obligatoire portées par la gauche et le mouvement syndical y sont centrales. Mais l'œuvre est collective : la revendiquer pour la seule gauche efface le rôle du gouvernement d'union et du programme du CNR, qui associait toutes les forces de la Résistance. Rôle central de la gauche : oui. Exclusif : non.`,
    },
    sources: [{ label: `Vie-publique.fr — les ordonnances des 4 et 19 octobre 1945 créant la Sécurité sociale`, url: 'https://www.vie-publique.fr', year: 1945 }],
    related: ['gauche'],
  },

  'vf-gauche-frontieres': {
    categorie: 'familles',
    enonce: { fr: `Être de gauche, c'est être pour l'ouverture des frontières.` },
    verdict: 'faux',
    explication: {
      fr: `Aucune définition de la gauche n'impose cette position, et son histoire la dément. Dans les années 1970-1980, une partie de la gauche communiste et syndicale défendait l'arrêt de l'immigration de travail au nom de la protection des salariés — Georges Marchais, secrétaire général du PCF, prend publiquement cette position en 1980. Les gouvernements de gauche ont eux-mêmes alterné régularisations (1981-1982, 1997) et lois de maîtrise des flux. Aujourd'hui encore, la gauche est traversée par un débat réel entre une ligne d'accueil universaliste et une ligne de régulation au nom des classes populaires. La tendance dominante est plus ouverte que celle de la droite — mais « de gauche » ne signifie pas « pour l'ouverture des frontières ».`,
    },
    sources: [{ label: `Vie-publique.fr — chronologie des politiques d'immigration depuis 1945`, url: 'https://www.vie-publique.fr', year: 2025 }, { label: `Jean-Jacques Becker, Gilles Candar (dir.), Histoire des gauches en France, La Découverte, 2004`, year: 2004 }],
    related: ['gauche'],
  },

  'vf-gauche-rigueur': {
    categorie: 'familles',
    enonce: { fr: `La gauche n'a jamais mené de politique de rigueur.` },
    verdict: 'faux',
    explication: {
      fr: `Deux contre-exemples majeurs suffisent. En mars 1983, après deux ans de relance, le gouvernement socialiste de François Mitterrand adopte le « tournant de la rigueur » : blocage des salaires et des prix, réduction des déficits, maintien du franc dans le système monétaire européen. Et le gouvernement de Lionel Jospin (1997-2002), tout en créant les 35 heures et la couverture maladie universelle, a procédé à des privatisations et ouvertures de capital d'un montant record — supérieur à celui des gouvernements de droite qui l'avaient précédé, fait documenté et souvent oublié. La gauche au pouvoir a donc bien pratiqué la rigueur et la discipline budgétaire ; le débat porte sur le fait de savoir si c'était une trahison ou un réalisme nécessaire — cela, c'est une opinion.`,
    },
    sources: [{ label: `Vie-publique.fr — le tournant de la rigueur de 1983 et la politique économique du gouvernement Jospin`, url: 'https://www.vie-publique.fr', year: 2025 }],
    related: ['gauche'],
  },

  'vf-gauche-riche': {
    categorie: 'familles',
    enonce: { fr: `On ne peut pas être riche et de gauche.` },
    verdict: 'sans-contexte',
    explication: {
      fr: `Impossible à trancher, car ce n'est pas une question de fait mais de cohérence débattue. Factuellement, des personnes aisées votent à gauche et militent à gauche depuis toujours — Léon Blum ou François Mitterrand n'étaient pas des ouvriers, et une partie de l'électorat de gauche actuel est diplômée et urbaine. Être de gauche engage des convictions (accepter l'impôt progressif, soutenir la redistribution), pas un niveau de revenu. Reste le débat légitime que recouvre la question : un mode de vie très aisé est-il cohérent avec un discours sur l'égalité ? Certains y voient une contradiction, d'autres répondent que ce qui compte est la politique défendue, pas le patrimoine de celui qui la défend. C'est un débat d'opinion — pas un fait tranchable.`,
    },
    sources: [{ label: `Michel Winock, La Gauche en France, Perrin (sociologie et cultures de la gauche)`, year: 2006 }],
    related: ['gauche'],
  },

};
