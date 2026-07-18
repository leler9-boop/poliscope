/**
 * Items « Vrai ou faux ? » — fiche débat « L'Union européenne ».
 * verdict : 'vrai' | 'faux' | 'partiel' | 'trompeur' | 'sans-contexte'
 */

export default {

  'vf-ue-80-pourcent-lois': {
    categorie: 'europe',
    enonce: { fr: `80 % de nos lois viennent de Bruxelles.` },
    verdict: 'trompeur',
    explication: {
      fr: `Ce chiffre légendaire vient d'une déclaration prospective de Jacques Delors (1988) sur la législation économique — transformée au fil des reprises en statistique établie. Les études sérieuses trouvent des parts très variables selon les domaines : élevées en agriculture, environnement ou normes techniques (parfois plus de 50 %), faibles en fiscalité directe, éducation, logement ou droit pénal. Selon les méthodes de comptage, la part globale des textes français d'origine européenne est estimée entre environ 20 % et 40 % — aucun chiffre unique n'est honnête. L'influence européenne est réelle et importante ; « 80 % » est un slogan, pas une mesure.`,
    },
    sources: [{ label: `Études du Secrétariat général du gouvernement et travaux académiques sur la part des normes d'origine européenne (synthèse : vie-publique.fr / toutel'europe.eu)`, url: 'https://www.vie-publique.fr', year: 2024 }],
    related: ['union-europeenne'],
  },

  'vf-ue-pas-democratique': {
    categorie: 'europe',
    enonce: { fr: `L'Union européenne n'est pas démocratique.` },
    verdict: 'sans-contexte',
    explication: {
      fr: `Les faits d'abord : le Parlement européen est élu au suffrage universel direct depuis 1979 et co-décide la plupart des lois ; le Conseil est composé de ministres issus de gouvernements élus ; la Commission est investie par le Parlement, qui peut la censurer. Mais la chaîne de responsabilité est longue et peu lisible, la Commission n'est pas élue directement, et aucun « peuple européen » ne peut renvoyer une majorité comme dans un État. Selon le critère retenu — existence d'élections ou capacité des citoyens à changer la politique menée — la réponse diffère. C'est un vrai débat de science politique, pas une question à trancher par oui ou non.`,
    },
    sources: [{ label: `Traité sur l'Union européenne, articles 10, 14, 17 (eur-lex) ; vie-publique.fr — le « déficit démocratique » en débat`, url: 'https://www.vie-publique.fr', year: 2024 }],
    related: ['union-europeenne'],
  },

  'vf-ue-france-paie-sans-recevoir': {
    categorie: 'europe',
    enonce: { fr: `La France paie pour l'Europe sans rien recevoir en retour.` },
    verdict: 'trompeur',
    explication: {
      fr: `La France est bien contributrice nette au budget européen — de l'ordre de 6 à 9 milliards d'euros par an selon les années et les modes de calcul. Mais s'arrêter là est doublement trompeur : elle est aussi la première bénéficiaire de la politique agricole commune (environ 9 milliards par an pour ses agriculteurs), et le solde budgétaire ne mesure pas les gains du marché unique (exportations sans droits de douane vers le premier partenaire commercial du pays), d'Erasmus, ou des programmes communs. On peut débattre du rapport coût-bénéfice global — les économistes le font — mais pas en ne regardant qu'une colonne du tableau.`,
    },
    sources: [{ label: `Commission européenne / rapport annuel sur le budget de l'UE ; Cour des comptes — le prélèvement sur recettes au profit de l'UE`, url: 'https://www.ccomptes.fr', year: 2024, perimetre: `soldes budgétaires sensibles au mode de calcul (avec ou sans ressources propres traditionnelles)` }],
    related: ['union-europeenne'],
  },

  'vf-ue-conseil-europe': {
    categorie: 'europe',
    enonce: { fr: `Le Conseil de l'Europe fait partie de l'Union européenne.` },
    verdict: 'faux',
    explication: {
      fr: `Ce sont deux organisations distinctes — et la confusion est constante, y compris chez des responsables politiques. Le Conseil de l'Europe (Strasbourg, fondé en 1949, 46 États membres) est l'organisation de la Convention européenne des droits de l'homme et de sa Cour (CEDH) : le Royaume-Uni, la Suisse ou la Turquie en sont membres sans être dans l'UE. À ne pas confondre non plus avec le Conseil européen (les chefs d'État de l'UE) ni avec le Conseil de l'Union européenne (les ministres). Trois « Conseils » différents : c'est mal nommé, et c'est précisément pour cela qu'il faut le savoir.`,
    },
    sources: [{ label: `Conseil de l'Europe (coe.int) ; toutel'europe.eu — « Conseil européen, Conseil de l'UE, Conseil de l'Europe : les différences »`, url: 'https://www.touteleurope.eu', year: 2024 }],
    related: ['union-europeenne'],
  },

  'vf-ue-commission-decide-seule': {
    categorie: 'europe',
    enonce: { fr: `La Commission européenne décide seule des lois européennes.` },
    verdict: 'faux',
    explication: {
      fr: `La Commission a le monopole de l'initiative — elle propose les textes — mais elle ne les adopte pas : dans la procédure ordinaire, une loi européenne (règlement ou directive) doit être votée par le Parlement européen ET par le Conseil de l'UE, où siègent les ministres des États membres. La France participe donc deux fois à la décision : par ses eurodéputés et par son gouvernement. La Commission dispose en revanche de pouvoirs propres réels en matière de concurrence et d'exécution — c'est là que la critique de son pouvoir est la plus documentée, pas sur la fabrique des lois.`,
    },
    sources: [{ label: `Traité sur le fonctionnement de l'UE, article 294 (procédure législative ordinaire) — eur-lex`, url: 'https://eur-lex.europa.eu', year: 2024 }],
    related: ['union-europeenne'],
  },

};
