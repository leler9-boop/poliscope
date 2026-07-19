/**
 * Fiche méthode « Comment lire un sondage » — porte I (« Comment le sait-on ? »).
 * Objectif : rendre le lecteur autonome face aux chiffres d'intentions de vote,
 * sans discréditer l'outil ni le sacraliser (docs/jyconnaisrien/00, §5 :
 * « ne jamais présenter un sondage comme une prédiction certaine »).
 */

export default {
  slug: 'lire-un-sondage',
  type: 'fiche-methode',
  porte: 'I',
  title: { fr: `Comment lire un sondage`, en: 'How to read a poll' },
  icon: '📊',
  difficulty: 1,
  famille: 'dossier',
  updatedAt: '2026-07-12',
  freshness: { type: 'stable', reviewEveryMonths: 24, lastReviewedAt: '2026-07-12' },

  // ── N1 ──────────────────────────────────────────────────────────────────────
  level1: {
    fr: `Un sondage est une estimation, pas une prédiction : il photographie les intentions déclarées d'environ 1 000 personnes à un instant donné, avec une marge d'erreur de 2 à 3 points. Deux candidats donnés à 20 % et 22 % sont donc statistiquement indiscernables. Entre l'enquête et le vote, les indécis tranchent, l'abstention varie, les opinions bougent. Bien lu — qui l'a commandé, quand, comment —, un sondage informe ; lu comme un résultat d'avance, il trompe.`,
  },

  // ── N2 ──────────────────────────────────────────────────────────────────────
  level2: {
    sections: [
      {
        titre: { fr: `Comment un sondage est fabriqué` },
        corps: {
          fr: `Un institut n'interroge pas tout le monde : il interroge un échantillon, en général autour de 1 000 personnes (parfois 2 000 pour affiner). Pour que ce petit groupe ressemble à la population, les instituts français utilisent surtout la méthode des quotas : l'échantillon doit reproduire la structure du pays en sexe, âge, profession, région, taille de commune. Aujourd'hui, la plupart des enquêtes politiques se font en ligne, auprès de panels de personnes recrutées à l'avance.\n\nDernière étape, la moins connue : le redressement. Les réponses brutes sont corrigées, notamment à partir du vote passé déclaré (« pour qui avez-vous voté à la dernière présidentielle ? »), car certains électorats répondent moins volontiers ou avouent moins facilement leur vote. Ce réglage repose sur des choix de l'institut — c'est une part de cuisine interne, encadrée mais pas entièrement publique. Un chiffre de sondage est donc le produit d'une méthode, pas une mesure directe.`,
        },
        sources: [{ label: `Commission des sondages — notices méthodologiques des enquêtes publiées`, url: 'https://www.commission-des-sondages.fr', year: 2024 }],
      },
      {
        titre: { fr: `La marge d'erreur : le chiffre qui manque toujours` },
        corps: {
          fr: `Interroger 1 000 personnes au lieu de 48 millions d'électeurs a un coût statistique : une incertitude d'environ ±2 à 3 points sur chaque score (elle est maximale, environ ±3 points, pour un score proche de 50 %, un peu plus faible pour les petits scores). Exemple concret : un candidat donné à 20 % se situe en réalité, très probablement, entre 17,5 % et 22,5 %. Un rival donné à 22 % se situe entre 19,5 % et 24,5 %. Les deux fourchettes se recouvrent largement : le sondage ne dit PAS qui est devant — il dit que les deux sont au coude-à-coude.\n\nC'est la lecture la plus souvent fautive dans les médias : titrer sur un candidat qui « passe devant » ou « décroche » pour un mouvement d'un ou deux points, c'est commenter du bruit statistique. Un écart n'est significatif que s'il dépasse nettement la marge d'erreur, ou s'il se confirme d'enquête en enquête. Depuis 2016, la loi impose d'ailleurs de publier les marges d'erreur avec chaque sondage — elles figurent dans la notice, rarement dans les titres.`,
        },
        sources: [{ label: `Loi du 19 juillet 1977 modifiée en 2016 — obligation de publication des marges d'erreur (Légifrance)`, url: 'https://www.legifrance.gouv.fr', year: 2016 }],
      },
      {
        titre: { fr: `Les 5 réflexes avant de croire un chiffre` },
        brique: 'a-retenir',
        corps: {
          fr: `Qui a commandé le sondage ? Un média, un parti, un acteur intéressé au résultat — le commanditaire est toujours indiqué dans la notice. Quand a-t-il été réalisé ? Un sondage vieux de trois semaines photographie une situation qui n'existe peut-être plus. Combien de personnes ont été interrogées ? Autour de 1 000, la marge est de 2 à 3 points ; sur un sous-groupe (« les jeunes », « les ouvriers »), elle explose. Quelle question a été posée, exactement ? La formulation peut orienter la réponse. Quelle est la marge d'erreur ? Si l'écart commenté est plus petit qu'elle, il ne prouve rien. Ces cinq informations sont légalement disponibles pour tout sondage publié en France — les vérifier prend deux minutes sur le site de la Commission des sondages.`,
        },
      },
      {
        titre: { fr: `Ce qu'un sondage ne peut pas faire : prédire` },
        corps: {
          fr: `Même parfaitement réalisé, un sondage mesure des intentions déclarées à un instant donné — pas des bulletins dans l'urne. Entre les deux : l'abstention (dire qu'on ira voter et y aller sont deux choses différentes), les indécis (une part importante des électeurs choisit dans les derniers jours, voire dans l'isoloir) et les mouvements tardifs de campagne, qu'aucune enquête antérieure ne peut capter.\n\nL'exemple le plus documenté reste le 21 avril 2002 : la plupart des enquêtes publiées donnaient Lionel Jospin qualifié pour le second tour de la présidentielle, généralement 2 à 4 points devant Jean-Marie Le Pen. Résultat officiel : Le Pen 16,86 %, Jospin 16,18 % — un écart final de 0,7 point, très inférieur à la marge d'erreur, dans un premier tour à 16 candidats où la dispersion des voix et une abstention record ont déjoué les intentions mesurées. La leçon n'est pas « les sondages mentent » : c'est qu'un écart de quelques points entre deux candidats ne garantit rien.`,
        },
        sources: [{ label: `Conseil constitutionnel — résultats officiels du premier tour de l'élection présidentielle 2002`, url: 'https://www.conseil-constitutionnel.fr', year: 2002 }],
      },
      {
        titre: { fr: `Intentions de vote, popularité : deux choses différentes` },
        brique: 'confusion',
        corps: {
          fr: `Un sondage d'intentions de vote (« pour qui voteriez-vous si l'élection avait lieu dimanche ? ») n'est pas un résultat — l'élection n'a pas lieu dimanche, et l'hypothèse testée (la liste des candidats) peut changer. Autre confusion fréquente : les baromètres de popularité (« avez-vous une bonne opinion de… ? ») ne mesurent pas du tout la même chose. On peut trouver une personnalité sympathique ou compétente sans jamais envisager de voter pour elle — et inversement. Une personnalité en tête des cotes de popularité n'est pas « favorite » pour une élection ; un chiffre de popularité additionne des opinions venues d'électorats opposés qui ne se retrouveront jamais dans une même urne. Avant d'interpréter un chiffre, toujours vérifier quelle question a été posée.`,
        },
      },
    ],
  },

  // ── N3 ──────────────────────────────────────────────────────────────────────
  level3: {
    sections: [
      {
        id: 'encadrement',
        titre: { fr: `Qui surveille les sondages en France` },
        corps: {
          fr: `Les sondages électoraux sont encadrés par la loi du 19 juillet 1977, complétée notamment en 2016. Une autorité dédiée, la Commission des sondages, composée de hauts magistrats, contrôle chaque sondage électoral publié : elle peut exiger la publication d'une mise au point lorsqu'une enquête ou sa présentation est trompeuse.\n\nDepuis la réforme de 2016, toute publication d'un sondage doit s'accompagner d'informations obligatoires : nom de l'institut, commanditaire et acheteur, dates de réalisation, taille de l'échantillon, texte exact des questions posées, et marges d'erreur. La notice méthodologique complète est consultable auprès de la Commission. Autre règle : interdiction de publier ou commenter tout sondage électoral la veille et le jour du scrutin — jusqu'en 2002, l'interdiction couvrait toute la dernière semaine ; elle a été réduite parce que les chiffres circulaient de toute façon sur des sites étrangers. Ce cadre fait de la France l'un des pays où les sondages électoraux sont les plus strictement encadrés — il garantit la transparence de la méthode, pas l'exactitude du résultat.`,
        },
        sources: [
          { label: `Loi n° 77-808 du 19 juillet 1977 relative à la publication et à la diffusion de certains sondages d'opinion, version consolidée (Légifrance)`, url: 'https://www.legifrance.gouv.fr', year: 2016 },
          { label: `Commission des sondages — rôle, mises au point et notices`, url: 'https://www.commission-des-sondages.fr', year: 2024 },
        ],
      },
      {
        id: 'les-pieges-classiques',
        titre: { fr: `Les pièges classiques` },
        corps: {
          fr: `La question orientée : « Faut-il réduire le gaspillage de l'argent public ? » obtiendra toujours un score massif — le mot « gaspillage » contient déjà la réponse. Deux formulations différentes sur le même sujet peuvent produire des écarts de dizaines de points ; c'est pourquoi la loi impose de publier le texte exact des questions.\n\nLe faux sondage en ligne : un vote ouvert sur un réseau social ou un site (« votez ! ») n'est pas un sondage — l'échantillon s'auto-sélectionne, les plus motivés votent plusieurs fois, rien n'est redressé. Ces consultations mesurent la mobilisation d'une communauté, pas l'opinion du pays.\n\nLe sondage « maison » : une enquête commandée par un parti ou un candidat, et publiée seulement quand elle lui est favorable. Le sondage peut être techniquement correct — c'est la sélection de ce qui est publié qui biaise.\n\nLa comparaison entre instituts : chaque institut a sa méthode de redressement ; comparer le chiffre d'un institut A cette semaine au chiffre d'un institut B la semaine dernière et conclure à une « dynamique » mélange deux thermomètres différents. Une tendance ne se lit que chez le même institut, avec la même méthode.\n\nLe « rolling » : ces enquêtes quotidiennes ne renouvellent chaque jour qu'une fraction de l'échantillon — commenter chaque frémissement quotidien revient à amplifier du bruit statistique.`,
        },
        sources: [{ label: `Commission des sondages — mises au point publiées ; loi du 19 juillet 1977 modifiée, article 2 (texte des questions)`, url: 'https://www.commission-des-sondages.fr', year: 2024 }],
      },
      {
        id: 'ce-que-disent-les-chercheurs',
        titre: { fr: `Ce que disent les chercheurs sur la fiabilité` },
        corps: {
          fr: `Contrairement à une idée répandue, les sondages ne deviennent pas moins fiables. Les travaux comparatifs internationaux — notamment ceux de Will Jennings et Christopher Wlezien, publiés en 2018 sur plus de 30 000 sondages dans 45 pays — concluent que l'erreur moyenne des enquêtes de fin de campagne est restée stable depuis des décennies, de l'ordre de 2 à 3 points par candidat. Les présidentielles françaises récentes (2017, 2022) ont été globalement bien estimées au premier tour.\n\nDeux nuances documentées. D'abord, les sondages français ont historiquement sous-estimé certains votes — celui du Front national dans les années 1990-2000, notamment, une partie de ses électeurs déclarant moins volontiers leur choix ; les instituts ont corrigé leurs redressements, au point que la sous-estimation n'est plus systématique aujourd'hui. Ensuite, une erreur de 2 à 3 points est indolore quand l'écart est large, décisive quand la qualification se joue à moins d'un point — 2002 en France, le Brexit ou l'élection de Donald Trump en 2016 (où les enquêtes nationales étaient proches du vote national, mais pas les enquêtes des États décisifs) le rappellent.\n\nEnfin, les chercheurs convergent sur un point pratique : l'agrégation de nombreuses enquêtes — moyennes glissantes combinant instituts et méthodes — est plus robuste que n'importe quelle enquête isolée, car les erreurs propres à chaque institut s'y compensent en partie. Face à un sondage isolé et surprenant, le bon réflexe est d'attendre les suivants.`,
        },
        sources: [
          { label: `W. Jennings et C. Wlezien, « Election polling errors across time and space », Nature Human Behaviour`, year: 2018 },
          { label: `Commission des sondages — bilans publiés après les scrutins nationaux`, url: 'https://www.commission-des-sondages.fr', year: 2022 },
        ],
      },
      {
        id: 'sondages-et-democratie',
        titre: { fr: `Sondages et démocratie : information ou fabrique de l'opinion ?` },
        corps: {
          fr: `Au-delà de la technique, un débat de fond divise chercheurs et responsables politiques : les sondages informent-ils la démocratie, ou la déforment-ils ?\n\nPour leurs défenseurs, ils donnent en continu une voix à l'ensemble des citoyens, entre deux élections : sans eux, l'« opinion publique » serait racontée par les seuls éditorialistes, manifestants ou groupes organisés. Ils obligent aussi les responsables à tenir compte de préoccupations qu'ils préféreraient ignorer.\n\nPour leurs critiques — dont le sociologue Pierre Bourdieu, auteur en 1972 d'un texte resté célèbre, « L'opinion publique n'existe pas », ou Loïc Blondiaux dans La Fabrique de l'opinion —, le sondage ne mesure pas une opinion préexistante : il la fabrique en partie, en imposant des questions que les gens ne se posaient pas, en forçant une réponse là où domine l'indifférence, et en donnant le même poids à des avis d'intensité très différente.\n\nS'y ajoute le débat sur les effets des sondages sur le vote lui-même : effet « bandwagon » (rallier le probable vainqueur), effet inverse de mobilisation derrière le présumé perdant, ou vote stratégique — voter pour un candidat « donné haut » pour éviter un second tour redouté. Ces effets sont plausibles et documentés dans certains contextes, mais leur ampleur réelle reste discutée : les études peinent à les isoler des autres dynamiques de campagne. Le fait établi, c'est que les sondages structurent la campagne elle-même — qui est invité dans les médias, quels candidats paraissent « utiles » — et c'est précisément pour cela que leur lecture critique est un enjeu démocratique.`,
        },
        sources: [
          { label: `L. Blondiaux, La Fabrique de l'opinion. Une histoire sociale des sondages, Seuil`, year: 1998 },
          { label: `P. Bourdieu, « L'opinion publique n'existe pas », exposé de 1972 repris dans Questions de sociologie, Minuit`, year: 1984 },
        ],
      },
    ],
  },

  vraiFaux: ['vf-sondage-2-points-avance', 'vf-sondage-se-trompent-toujours', 'vf-sondage-en-ligne-institut'],

  quiz: [
    {
      question: { fr: `Un sondage donne un candidat A à 22 % et un candidat B à 20 % (1 000 personnes interrogées). Que peut-on en conclure ?` },
      options: [
        { fr: `A est en tête, c'est mesuré` },
        { fr: `A a 2 points d'avance garantis` },
        { fr: `Rien de sûr : l'écart est inférieur à la marge d'erreur, les deux sont au coude-à-coude` },
        { fr: `B va perdre l'élection` },
      ],
      bonneReponse: 2,
      explication: { fr: `Avec environ 1 000 personnes, chaque score porte une incertitude de ±2 à 3 points : A se situe probablement entre 19,5 % et 24,5 %, B entre 17,5 % et 22,5 %. Les fourchettes se recouvrent — le sondage ne dit pas qui est devant.` },
    },
    {
      question: { fr: `Qui contrôle les sondages électoraux publiés en France ?` },
      options: [
        { fr: `Personne : les instituts s'autorégulent` },
        { fr: `La Commission des sondages, créée par la loi du 19 juillet 1977` },
        { fr: `Le ministère de l'Intérieur` },
        { fr: `Les chaînes de télévision` },
      ],
      bonneReponse: 1,
      explication: { fr: `Cette autorité composée de hauts magistrats peut exiger des mises au point en cas d'enquête ou de présentation trompeuse. Depuis 2016, chaque publication doit indiquer commanditaire, dates, échantillon, texte des questions et marges d'erreur.` },
    },
    {
      question: { fr: `Que s'est-il passé le 21 avril 2002 par rapport aux sondages ?` },
      options: [
        { fr: `Les sondages avaient annoncé exactement le résultat` },
        { fr: `La plupart des enquêtes donnaient Lionel Jospin qualifié ; c'est Jean-Marie Le Pen qui l'a été, pour 0,7 point` },
        { fr: `Les sondages avaient été interdits toute l'année` },
        { fr: `Aucun sondage n'avait été publié avant le vote` },
      ],
      bonneReponse: 1,
      explication: { fr: `Résultat officiel : Le Pen 16,86 %, Jospin 16,18 %. Un écart final bien inférieur à la marge d'erreur, dans un premier tour à 16 candidats — l'illustration la plus documentée de ce qu'un sondage ne peut pas prédire.` },
    },
    {
      question: { fr: `Pourquoi environ 1 000 personnes suffisent-elles à estimer l'opinion de millions d'électeurs ?` },
      options: [
        { fr: `Parce qu'on interroge uniquement des experts` },
        { fr: `Parce que l'échantillon reproduit, par quotas, la structure de la population (sexe, âge, profession, région), moyennant une marge d'erreur` },
        { fr: `Ça ne suffit pas : seuls les sondages à 1 million de réponses sont fiables` },
        { fr: `Parce que tous les Français pensent pareil` },
      ],
      bonneReponse: 1,
      explication: { fr: `C'est un résultat statistique : un échantillon bien construit de 1 000 personnes donne une estimation à ±2-3 points près. Un vote en ligne à 500 000 réponses auto-sélectionnées est, lui, sans valeur : la taille ne remplace pas la représentativité.` },
    },
    {
      question: { fr: `Qu'est-ce qu'une « question orientée » ?` },
      options: [
        { fr: `Une question posée uniquement dans certaines régions` },
        { fr: `Une question dont la formulation suggère la réponse, comme « faut-il réduire le gaspillage de l'argent public ? »` },
        { fr: `Une question sur l'orientation politique` },
        { fr: `Une question posée à l'oral plutôt qu'en ligne` },
      ],
      bonneReponse: 1,
      explication: { fr: `Le mot « gaspillage » contient déjà le jugement : le score sera massif quelle que soit l'opinion réelle. C'est pourquoi la loi impose de publier le texte exact des questions — le vérifier est l'un des 5 réflexes.` },
    },
  ],

  // ── Pour aller plus loin (N4) ────────────────────────────────────────────────
  level4: {
    items: [
      { kind: 'lien', titre: { fr: `Commission-des-sondages.fr — les notices et mises au point` }, note: { fr: `Pour tout sondage électoral publié, la notice méthodologique complète (questions exactes, échantillon, marges) est consultable ici, ainsi que les mises au point imposées aux instituts.` }, url: 'https://www.commission-des-sondages.fr' },
      { kind: 'texte', titre: { fr: `Loi n° 77-808 du 19 juillet 1977 relative à la publication et à la diffusion de certains sondages d'opinion (Légifrance)` }, note: { fr: `Le texte fondateur, dans sa version consolidée après la réforme de 2016 : mentions obligatoires, marges d'erreur, interdiction de publication la veille et le jour du scrutin. Court et lisible.` }, url: 'https://www.legifrance.gouv.fr' },
      { kind: 'biblio', titre: { fr: `Loïc Blondiaux, La Fabrique de l'opinion. Une histoire sociale des sondages — Seuil, 1998` }, note: { fr: `L'histoire de l'invention des sondages et la critique de fond : comment l'outil a construit l'« opinion publique » qu'il prétend mesurer. La référence du débat sondages et démocratie.` } },
      { kind: 'lien', titre: { fr: `Les notices méthodologiques des instituts (Ifop, Ipsos, Elabe, OpinionWay, Harris…)` }, note: { fr: `Chaque institut publie avec ses enquêtes une notice : la lire une fois suffit pour comprendre concrètement quotas, redressement et marges — et repérer ce que les titres de presse omettent.` } },
    ],
  },

  motsAssocies: [
    'elections',
    { label: { fr: `La marge d'erreur` }, soon: true },
    { label: { fr: `L'abstention` }, soon: true },
    { label: { fr: `L'opinion publique` }, soon: true },
  ],
  continuerAvec: [
    { slug: 'elections' },
    { slug: 'fait-opinion-prediction' },
    { slug: 'lire-une-statistique' },
  ],

  sources: [
    { label: `Loi n° 77-808 du 19 juillet 1977 relative à la publication et à la diffusion de certains sondages d'opinion, version consolidée après la loi du 25 avril 2016 (Légifrance)`, url: 'https://www.legifrance.gouv.fr', year: 2016 },
    { label: `Commission des sondages — notices méthodologiques, mises au point et bilans post-électoraux`, url: 'https://www.commission-des-sondages.fr', year: 2024 },
    { label: `Conseil constitutionnel — résultats officiels du premier tour de l'élection présidentielle du 21 avril 2002`, url: 'https://www.conseil-constitutionnel.fr', year: 2002 },
    { label: `W. Jennings et C. Wlezien, « Election polling errors across time and space », Nature Human Behaviour`, year: 2018 },
    { label: `L. Blondiaux, La Fabrique de l'opinion. Une histoire sociale des sondages, Seuil`, year: 1998 },
  ],
};
