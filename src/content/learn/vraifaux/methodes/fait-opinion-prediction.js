/**
 * Items « Vrai ou faux ? » — fiche méthode Fait, opinion, prédiction.
 * Uniquement les items NOUVEAUX référencés par la fiche (champ vraiFaux).
 *
 * verdict : 'vrai' | 'faux' | 'partiel' | 'trompeur' | 'sans-contexte'
 */

export default {

  'vf-fop-opinion-partagee': {
    categorie: 'methodes',
    enonce: { fr: `Une opinion largement partagée devient un fait.` },
    verdict: 'faux',
    explication: {
      fr: `La vérité d'un énoncé factuel ne dépend pas du nombre de personnes qui y croient : c'est le sophisme classique de l'appel à la majorité. Les enquêtes comparant perceptions et données mesurées le montrent régulièrement — les sondés de nombreux pays, France comprise, surestiment par exemple fortement la part des personnes immigrées dans la population par rapport aux chiffres de l'INSEE. L'opinion majoritaire reste précieuse en démocratie : elle dit ce que les gens pensent et veulent, et c'est elle qui tranche les élections. Mais elle répond à la question « que voulons-nous ? », jamais à la question « qu'est-ce qui est vrai ? ». Un fait se vérifie contre des sources ; il ne se vote pas.`,
    },
    sources: [
      { label: `INSEE — « L'essentiel sur… les immigrés et les étrangers » : part mesurée dans la population`, url: 'https://www.insee.fr', year: 2024 },
      { label: `CLEMI — éducation aux médias : distinguer faits et opinions, biais et sophismes courants`, url: 'https://www.clemi.fr', year: 2025 },
    ],
    related: ['fait-opinion-prediction'],
  },

  'vf-fop-debattre-de-tout': {
    categorie: 'methodes',
    enonce: { fr: `On peut débattre de tout.` },
    verdict: 'partiel',
    explication: {
      fr: `On débat des opinions, des priorités et des interprétations : faut-il plus ou moins d'impôts, que faire de tel constat — c'est la matière légitime du débat démocratique, et là, oui, tout se discute. Mais un fait établi ne se « débat » pas : il se vérifie. Mettre en scène un débat entre une donnée documentée et une affirmation démentie par les sources n'est pas du pluralisme, c'est une fausse équivalence — les principes éditoriaux de Poliscop l'excluent explicitement. Nuance importante : la frontière elle-même se discute parfois. Ce qui compte comme « établi » (quel périmètre, quelle méthode de mesure, quelle marge d'incertitude) peut faire l'objet d'un débat légitime — mais c'est alors un débat de méthode, avec des arguments vérifiables, pas un concours d'opinions.`,
    },
    sources: [
      { label: `CLEMI — fact-checking et traitement du débat : le piège de la fausse équivalence`, url: 'https://www.clemi.fr', year: 2024 },
      { label: `Vie-publique.fr — fiches méthodologiques : données publiques, sources et incertitudes`, url: 'https://www.vie-publique.fr', year: 2024 },
    ],
    related: ['fait-opinion-prediction'],
  },

  'vf-fop-chiffres-mentent-pas': {
    categorie: 'methodes',
    enonce: { fr: `Les chiffres ne mentent pas.` },
    verdict: 'trompeur',
    explication: {
      fr: `Un chiffre exact peut parfaitement tromper. Par le périmètre : « le chômage », c'est environ 7,4 % de la population active fin 2024 au sens du BIT (INSEE), mais plusieurs millions d'inscrits à France Travail toutes catégories confondues — deux chiffres vrais, qui ne mesurent pas la même chose, et le choix de l'un ou l'autre change le récit. Par la période : démarrer une courbe une année exceptionnelle fabrique une hausse ou une baisse spectaculaire. Par la présentation : valeur absolue ou pourcentage, moyenne qui masque les écarts, axe tronqué qui amplifie une variation minime. Le chiffre lui-même ne ment pas ; le cadrage, si. D'où le réflexe : pour tout chiffre, exiger la source, la date, le périmètre — et se demander à quoi il est comparé.`,
    },
    sources: [
      { label: `INSEE — chômage au sens du BIT : définition, séries et écart avec les inscriptions à France Travail (Dares)`, url: 'https://www.insee.fr', year: 2025 },
      { label: `CLEMI — lire les chiffres et les graphiques dans les médias : périmètres, échelles, comparaisons`, url: 'https://www.clemi.fr', year: 2025 },
    ],
    related: ['fait-opinion-prediction'],
  },

};
