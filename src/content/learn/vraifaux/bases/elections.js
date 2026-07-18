/**
 * Items « Vrai ou faux ? » — fiche grand repère « Les élections ».
 * Uniquement les items NOUVEAUX référencés par la fiche.
 *
 * verdict : 'vrai' | 'faux' | 'partiel' | 'trompeur' | 'sans-contexte'
 */

export default {

  'vf-elections-vote-blanc-annule': {
    categorie: 'elections',
    enonce: { fr: `Si le vote blanc arrive en tête, l'élection est annulée.` },
    verdict: 'faux',
    explication: {
      fr: `En droit français, le vote blanc n'a aucun effet sur le résultat. Depuis la loi du 21 février 2014, il est décompté et annoncé séparément des votes nuls — c'est une reconnaissance symbolique — mais il n'entre pas dans les « suffrages exprimés », ceux qui servent à calculer les pourcentages et à désigner le vainqueur. Même majoritaire, le blanc ne ferait donc ni annuler ni refaire l'élection : le candidat en tête des exprimés l'emporte. Le débat existe bel et bien — des propositions de loi visent régulièrement à intégrer le blanc aux exprimés, avec de vrais arguments de part et d'autre (donner un poids au refus de l'offre politique, contre le risque d'élections à répétition) — mais en l'état du droit, la réponse est claire : compté, oui ; comptabilisé, non.`,
    },
    sources: [{ label: `Loi du 21 février 2014 visant à reconnaître le vote blanc aux élections (Légifrance) ; Vie-publique.fr — « Le vote blanc »`, url: 'https://www.legifrance.gouv.fr', year: 2014 }],
    related: ['elections'],
  },

  'vf-elections-voter-sans-inscription': {
    categorie: 'elections',
    enonce: { fr: `On peut voter sans être inscrit sur les listes électorales.` },
    verdict: 'faux',
    explication: {
      fr: `L'inscription sur les listes électorales est la condition pour voter : le jour du scrutin, le bureau de vote vérifie que votre nom figure sur la liste de la commune avant de vous laisser passer à l'urne. Avoir 18 ans et la nationalité française ne suffit pas si l'inscription n'a pas été faite. Elle est automatique à 18 ans quand le recensement citoyen a été effectué vers 16 ans ; dans les autres cas — ou après un déménagement — c'est une démarche à faire soi-même, en ligne ou en mairie, avant une date limite fixée environ six semaines avant le scrutin. Beaucoup d'électeurs découvrent le problème trop tard : les « mal-inscrits », restés rattachés à une ancienne commune, forment une part importante de l'abstention mesurée.`,
    },
    sources: [{ label: `Service-public.fr — « Élections : inscription sur les listes électorales » ; Code électoral (Légifrance)`, url: 'https://www.service-public.fr', year: 2025 }],
    related: ['elections'],
  },

  'vf-elections-sondages-predisent': {
    categorie: 'elections',
    enonce: { fr: `Les sondages prédisent le résultat des élections.` },
    verdict: 'trompeur',
    explication: {
      fr: `Un sondage n'est pas une prédiction : c'est une photographie des intentions de vote à un instant donné, assortie d'une marge d'erreur — de l'ordre de 2 à 3 points pour un échantillon d'environ 1 000 personnes. Deux candidats donnés à 20 % et 18 % sont statistiquement indépartageables. S'y ajoutent les indécis, qui tranchent souvent dans les derniers jours, et le fait que les électorats ne répondent pas tous aussi volontiers aux enquêtes. L'exemple classique reste 2002 : aucun grand sondage publié n'avait donné Jean-Marie Le Pen qualifié pour le second tour de la présidentielle. Les sondages, encadrés par la Commission des sondages et interdits de publication la veille et le jour du vote, restent des outils utiles pour lire des tendances — à condition de ne jamais les confondre avec un résultat.`,
    },
    sources: [{ label: `Commission des sondages — loi du 19 juillet 1977 modifiée ; Conseil constitutionnel — résultats officiels de la présidentielle 2002`, url: 'https://www.commission-des-sondages.fr', year: 2024 }],
    related: ['elections'],
  },

  'vf-elections-abstention-partout': {
    categorie: 'elections',
    enonce: { fr: `L'abstention ne cesse d'augmenter, partout et à chaque élection.` },
    verdict: 'partiel',
    explication: {
      fr: `La tendance de fond est réelle : depuis les années 1980, l'abstention a fortement progressé pour la plupart des scrutins — municipales, législatives, régionales, européennes — jusqu'au record des régionales de 2021, avec environ 66,7 % d'abstention au premier tour. Mais « partout et à chaque élection » est excessif. La présidentielle résiste nettement : elle reste l'élection la plus mobilisatrice (environ 26,3 % d'abstention au premier tour de 2022), et des rebonds de participation existent, comme aux législatives de 2024, dont la participation a nettement dépassé celles de 2017 et 2022. Le phénomène dominant est moins une désertion générale qu'un vote devenu intermittent : beaucoup d'électeurs se déplacent pour la présidentielle et délaissent les scrutins jugés secondaires.`,
    },
    sources: [
      { label: `Ministère de l'Intérieur — participation officielle : régionales 2021, présidentielle 2022, législatives 2024`, url: 'https://www.interieur.gouv.fr', year: 2024 },
      { label: `INSEE — « Participation électorale » : le vote intermittent selon l'âge et la catégorie sociale`, url: 'https://www.insee.fr', year: 2022 },
    ],
    related: ['elections'],
  },

};
