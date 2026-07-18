/**
 * Items « Vrai ou faux ? » — dossier famille « L'extrême gauche ».
 * Items NOUVEAUX référencés par la fiche src/content/learn/familles/extreme-gauche.js.
 *
 * verdict : 'vrai' | 'faux' | 'partiel' | 'trompeur' | 'sans-contexte'
 */

export default {

  'vf-eg-lfi': {
    categorie: 'familles',
    enonce: { fr: `La France insoumise est un parti d'extrême gauche.` },
    verdict: 'sans-contexte',
    explication: {
      fr: `Tout dépend de la définition retenue — et c'est justement là que se joue le débat. Pour la majorité des politistes, l'« extrême gauche » désigne les organisations révolutionnaires anticapitalistes (Lutte ouvrière, NPA) qui visent le remplacement du capitalisme et voient les élections comme une tribune. Sur ces critères, LFI relève de la « gauche radicale » : elle participe pleinement au jeu institutionnel (groupes parlementaires, candidatures pour gouverner), et son programme — keynésianisme radical, planification écologique, VIe République — ne prévoit ni abolition révolutionnaire du capitalisme ni disparition de l'État. Un classement « extrême gauche » existe néanmoins dans une partie du débat public et médiatique, nourri par la radicalité de son style d'opposition. Répondre exige donc de préciser de quelle définition on parle : au sens des politistes, non ; au sens de certains usages médiatiques, l'étiquette circule — mais elle recouvre alors autre chose que LO ou le NPA.`,
    },
    sources: [{ label: `Luke March, Radical Left Parties in Europe, Routledge, 2011 (distinction radical left / extreme left) ; Philippe Raynaud, L'Extrême gauche plurielle, Autrement, 2006`, year: 2011 }],
    related: ['extreme-gauche'],
  },

  'vf-eg-violence': {
    categorie: 'familles',
    enonce: { fr: `L'extrême gauche est un mouvement violent.` },
    verdict: 'trompeur',
    explication: {
      fr: `L'histoire française dit largement l'inverse : la quasi-totalité de l'extrême gauche — trotskistes en tête — a toujours rejeté la lutte armée et milité dans la légalité (campagnes électorales, syndicats, grèves). Contrairement à l'Italie des Brigades rouges ou à l'Allemagne de la Fraction armée rouge, la France n'a connu qu'une exception : Action directe, groupe de quelques dizaines de membres, dissous par décret dès août 1982, responsable d'attentats dont l'assassinat de Georges Besse, PDG de Renault, en novembre 1986, et démantelé par l'arrestation de ses dirigeants en février 1987 — le tout publiquement désavoué par les organisations d'extrême gauche. Assimiler toute la famille à cette exception marginale est donc trompeur ; la nier le serait tout autant. Comme pour toute famille politique, on peut critiquer ses idées sans caricaturer ses militants.`,
    },
    sources: [{ label: `Christophe Bourseiller, Histoire générale de l'ultra-gauche, Denoël, 2003 ; archives judiciaires du procès d'Action directe`, year: 2003 }],
    related: ['extreme-gauche'],
  },

  'vf-eg-jamais-compte': {
    categorie: 'familles',
    enonce: { fr: `L'extrême gauche n'a jamais compté dans la vie politique française.` },
    verdict: 'trompeur',
    explication: {
      fr: `Électoralement, elle est restée minoritaire — avec tout de même un sommet notable : environ 10,4 % cumulés pour les trois candidats trotskistes au premier tour de la présidentielle de 2002 (Laguiller 5,72 %, Besancenot 4,25 %, Gluckstein 0,47 %), avant un net reflux (Arthaud 0,56 % et Poutou 0,77 % en 2022). Mais réduire son influence à ses scores serait une erreur documentée : ses militants ont animé le mouvement de Mai 68, pèsent dans le syndicalisme (syndicats SUD et union Solidaires, certains secteurs de la CGT), ont marqué la culture des mobilisations sociales (assemblées générales, coordinations), et un nombre remarquable de responsables politiques, journalistes et intellectuels français sont passés par ses organisations. Faible dans les urnes, réelle dans la société : les deux constats sont vrais en même temps.`,
    },
    sources: [{ label: `Conseil constitutionnel — résultats officiels des présidentielles 2002 et 2022 ; Philippe Raynaud, L'Extrême gauche plurielle, Autrement, 2006`, url: 'https://www.conseil-constitutionnel.fr', year: 2022 }],
    related: ['extreme-gauche'],
  },

  'vf-eg-laguiller-premiere-femme': {
    categorie: 'familles',
    enonce: { fr: `La première femme candidate à une élection présidentielle française était une candidate trotskiste.` },
    verdict: 'vrai',
    explication: {
      fr: `En 1974, Arlette Laguiller, employée de banque et porte-parole de Lutte ouvrière (organisation trotskiste), devient la première femme candidate à une élection présidentielle française : elle obtient 2,33 % des suffrages. Elle se présentera six fois au total, de 1974 à 2007, avec un meilleur score de 5,72 % en 2002 — et non en 1995, où elle avait obtenu 5,30 %. Son adresse d'ouverture, « Travailleuses, travailleurs », est restée l'une des formules les plus connues de la vie politique française. Nathalie Arthaud lui a succédé comme porte-parole et candidate à partir de 2008.`,
    },
    sources: [{ label: `Conseil constitutionnel — résultats officiels des élections présidentielles de 1974, 1995 et 2002`, url: 'https://www.conseil-constitutionnel.fr', year: 2002 }],
    related: ['extreme-gauche'],
  },

};
