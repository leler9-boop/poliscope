/**
 * Fiche débat « L'OQTF » — modèle debat (docs/jyconnaisrien/02, §9) avec grille de
 * positions variable. Régime live : le droit des étrangers évolue vite, chaque
 * affirmation est datée. La définition courte vit au dico (parentFiche inverse).
 */

export default {
  slug: 'oqtf',
  type: 'debat',
  porte: 'F3',
  title: { fr: `L'OQTF`, en: 'OQTF (obligation to leave France)' },
  icon: '📄',
  difficulty: 2,
  famille: 'dossier',
  updatedAt: '2026-07-12',
  freshness: { type: 'live', reviewEveryMonths: 3, lastReviewedAt: '2026-07-12' },

  // ── N1 ──────────────────────────────────────────────────────────────────────
  level1: {
    fr: `Une OQTF — obligation de quitter le territoire français — est une décision administrative par laquelle un préfet demande à une personne étrangère de quitter la France. Ce n'est ni une condamnation pénale, ni une expulsion : la personne peut exercer un recours devant le juge, et une partie importante de ces décisions n'est jamais exécutée. C'est ce dernier point qui alimente le débat politique.`,
  },

  // ── N2 ──────────────────────────────────────────────────────────────────────
  level2: {
    sections: [
      {
        titre: { fr: `Pourquoi en parle-t-on ?` },
        corps: {
          fr: `L'OQTF est devenue un mot du débat quotidien pour deux raisons. D'abord l'écart entre les décisions prononcées et les départs effectifs : l'État ordonne beaucoup, exécute peu, et chaque camp y lit une preuve différente — impuissance publique pour les uns, décisions massives et mal ciblées pour les autres. Ensuite, plusieurs faits divers très médiatisés impliquant des personnes sous OQTF ont transformé un sigle administratif en symbole politique. Comprendre ce que recouvre exactement le sigle est donc indispensable pour suivre le débat sans le subir.`,
        },
      },
      {
        titre: { fr: `Les mots indispensables` },
        brique: 'glossaire',
        termes: [
          { nom: { fr: 'OQTF' }, def: { fr: `Décision du préfet demandant à une personne étrangère de quitter la France, créée par la loi du 24 juillet 2006 et réformée à plusieurs reprises depuis (2011, 2016, 2018, 2024).` } },
          { nom: { fr: 'Délai de départ volontaire' }, def: { fr: `En principe 30 jours pour quitter le pays par ses propres moyens. Le préfet peut le refuser (risque de fuite, menace à l'ordre public) : l'OQTF est alors « sans délai ».` } },
          { nom: { fr: 'Expulsion' }, def: { fr: `Mesure distincte et plus rare, motivée par une menace grave pour l'ordre public. Dire « expulsé » pour toute personne sous OQTF est juridiquement inexact.` } },
          { nom: { fr: 'Rétention administrative' }, def: { fr: `Placement dans un centre fermé (CRA) le temps d'organiser l'éloignement — sur décision administrative, contrôlée par le juge. Ce n'est pas une prison au sens pénal.` } },
          { nom: { fr: 'Laissez-passer consulaire' }, def: { fr: `Document que le pays d'origine doit délivrer pour reprendre son ressortissant sans passeport. Son refus est l'une des grandes causes de non-exécution.` } },
        ],
      },
      {
        titre: { fr: `Les faits principaux` },
        corps: {
          fr: `Qui peut recevoir une OQTF ? Une personne étrangère sans titre de séjour, dont le titre n'a pas été renouvelé, ou dont la demande d'asile a été définitivement rejetée. Certaines personnes en sont protégées — les mineurs ne peuvent pas en recevoir, et des protections existent selon la situation familiale, la santé ou l'ancienneté du séjour (leur périmètre a été réduit par la loi du 26 janvier 2024 pour les cas de menace à l'ordre public).\n\nLa décision peut être contestée devant le tribunal administratif dans des délais courts, qui varient selon la procédure ; le recours suspend en général l'éloignement jusqu'à la décision du juge. Le juge annule une partie significative des OQTF — c'est le contrôle normal de l'État de droit sur l'administration.`,
        },
        sources: [
          { label: `CESEDA, livre VI (Légifrance) — droit applicable en France métropolitaine, régimes spécifiques outre-mer`, url: 'https://www.legifrance.gouv.fr', year: 2026 },
          { label: `Vie-publique.fr — dossier « loi du 26 janvier 2024 pour contrôler l'immigration »`, url: 'https://www.vie-publique.fr', year: 2024 },
        ],
      },
      {
        titre: { fr: `OQTF ≠ délinquance` },
        brique: 'confusion',
        corps: {
          fr: `Une OQTF sanctionne une situation administrative (absence de droit au séjour), pas un comportement : la plupart des personnes visées n'ont commis aucun délit, et une condamnation pénale ne déclenche pas automatiquement une OQTF. Inversement, un demandeur d'asile dont la demande est en cours d'examen a le droit de se maintenir sur le territoire, sauf exceptions prévues par la loi — il n'est pas « sous OQTF ».`,
        },
      },
    ],
  },

  // ── N3 ──────────────────────────────────────────────────────────────────────
  level3: {
    sections: [
      {
        id: 'chiffres',
        titre: { fr: `Les chiffres disponibles — et leurs limites` },
        corps: {
          fr: `Les préfectures prononcent de l'ordre de 130 000 à 140 000 OQTF par an ces dernières années — la France est le pays de l'UE qui prononce le plus de décisions de retour, de loin.\n\nLe taux d'exécution mesuré est faible : selon les années et les modes de calcul, les chiffres publics le situent le plus souvent entre 5 % et 15 %. Attention à trois limites méthodologiques : 1) le numérateur ne compte que les départs contrôlés — les départs volontaires non enregistrés échappent à la statistique ; 2) une même personne peut cumuler plusieurs OQTF successives, ce qui gonfle le dénominateur ; 3) les comparaisons européennes d'Eurostat utilisent des définitions différentes des chiffres ministériels français. Ces chiffres sont donc des ordres de grandeur régulièrement débattus, pas des mesures exactes.\n\nÀ l'échelle de l'Union européenne, environ un quart à un tiers des décisions de retour sont suivies d'un retour effectif constaté : la difficulté d'exécution n'est pas propre à la France, même si ses taux mesurés figurent parmi les plus bas — en partie parce qu'elle prononce beaucoup plus de décisions que ses voisins.`,
        },
        sources: [
          { label: `Ministère de l'Intérieur — statistiques annuelles sur l'éloignement des étrangers en situation irrégulière`, url: 'https://www.interieur.gouv.fr', year: 2024, perimetre: `décisions prononcées et éloignements exécutés, France` },
          { label: `Cour des comptes — rapport sur la politique de lutte contre l'immigration irrégulière (janvier 2024)`, url: 'https://www.ccomptes.fr', year: 2024 },
          { label: `Eurostat — statistiques sur les retours (definitions distinctes des chiffres nationaux)`, url: 'https://ec.europa.eu/eurostat', year: 2024 },
        ],
      },
      {
        id: 'situations',
        titre: { fr: `Dix situations à ne pas confondre` },
        corps: {
          fr: `Le débat public écrase des situations juridiques très différentes. Distinguer au minimum : 1) le demandeur d'asile dont la demande est en cours — droit au maintien, sauf exceptions ; 2) le débouté du droit d'asile — peut recevoir une OQTF ; 3) la personne entrée sans visa et jamais enregistrée ; 4) la personne dont le titre de séjour n'a pas été renouvelé — parfois après des années de séjour régulier ; 5) la personne protégée contre l'éloignement (situation familiale, santé — protections réduites en cas de menace à l'ordre public depuis 2024) ; 6) le mineur — ne peut pas recevoir d'OQTF ; 7) le parent d'enfant français — protections spécifiques ; 8) le ressortissant européen — régime distinct, éloignement très encadré ; 9) la personne placée en rétention — en attente d'éloignement forcé ; 10) la personne assignée à résidence — alternative à la rétention.\n\nToute phrase commençant par « les gens sous OQTF sont… » a de fortes chances d'être fausse pour une partie de ces dix situations.`,
        },
        sources: [{ label: `CESEDA, livre VI — catégories protégées et procédures (Légifrance)`, url: 'https://www.legifrance.gouv.fr', year: 2026 }],
      },
      {
        id: 'pourquoi-non-executees',
        titre: { fr: `Pourquoi tant d'OQTF ne sont pas exécutées` },
        corps: {
          fr: `Les causes documentées se cumulent : annulations par le juge administratif (décisions illégales ou touchant des personnes protégées) ; refus de laissez-passer consulaires par les pays d'origine — sans ce document, aucun éloignement forcé n'est possible ; personnes introuvables à l'expiration du délai de départ ; situations médicales ou familiales bloquantes ; capacités limitées des centres de rétention et coût des éloignements forcés (escortes, vols) ; et le choix français de prononcer des OQTF de manière quasi systématique, y compris quand l'exécution est improbable — là où d'autres pays ne prennent la décision que lorsqu'ils peuvent l'exécuter.\n\nCe dernier point est central pour comparer les pays : prononcer moins pour exécuter mieux, ou prononcer beaucoup pour affirmer la règle — c'est déjà un choix politique.`,
        },
        sources: [{ label: `Cour des comptes (2024) — analyse des causes de non-exécution ; rapports parlementaires sur les laissez-passer consulaires`, url: 'https://www.ccomptes.fr', year: 2024 }],
      },
      {
        id: 'positions',
        titre: { fr: `Les grandes positions dans le débat` },
        brique: 'visions',
        visions: [
          {
            label: { fr: `Exécuter systématiquement — droite nationale, partie de la droite` },
            couleur: 'purple',
            corps: { fr: `Une décision de l'État non appliquée détruit la crédibilité de la règle. Il faut exécuter les OQTF prononcées : plus de places en rétention, pression diplomatique sur les laissez-passer (visas contre coopération), restriction des recours. Certains proposent la « double peine » systématique pour les délinquants étrangers et le conditionnement de l'aide au développement.` },
          },
          {
            label: { fr: `Mieux cibler pour mieux exécuter — centre, partie de la droite et de la gauche` },
            couleur: 'blue',
            corps: { fr: `Le problème est le décalage entre le prononcé massif et les capacités réelles. Il faut concentrer les moyens sur les profils prioritaires (menaces à l'ordre public), simplifier le contentieux (c'était un objectif de la loi de 2024), négocier les accords consulaires — et cesser de mesurer la politique migratoire au seul volume d'OQTF signées.` },
          },
          {
            label: { fr: `Priorité aux droits fondamentaux — gauche, associations` },
            couleur: 'green',
            corps: { fr: `Si le juge annule autant d'OQTF, c'est qu'elles sont trop souvent illégales ou mal instruites. La politique du chiffre fabrique des décisions inexécutables, précarise des personnes intégrées (travailleurs, familles, jeunes majeurs scolarisés) et engorge les tribunaux. Il faut régulariser les situations enracinées et réserver l'éloignement aux cas le justifiant réellement.` },
          },
        ],
      },
      {
        id: 'desaccords',
        titre: { fr: `Ce qui fait vraiment désaccord` },
        corps: {
          fr: `Derrière les slogans, trois désaccords structurent le sujet. Un désaccord de valeurs : la primauté de la souveraineté (l'État décide qui reste) contre la primauté des droits individuels (le juge protège chaque situation). Un désaccord d'efficacité : durcir les règles augmente-t-il les départs, ou surtout le nombre de personnes inexpulsables et sans droits ? Un désaccord de mesure : faut-il juger la politique au nombre de décisions, au taux d'exécution, ou à des indicateurs plus larges (retours volontaires aidés, accords consulaires) ? Selon l'indicateur choisi, le même bilan paraît ferme ou laxiste — c'est pourquoi les chiffres cités à la télévision se contredisent si souvent.`,
        },
      },
      {
        id: 'ailleurs',
        titre: { fr: `Ce qui existe dans d'autres pays` },
        corps: {
          fr: `Tous les pays européens affrontent le même écart entre décisions et retours. L'Allemagne pratique la « Duldung » (tolérance provisoire) : un statut officiel pour les personnes inexpulsables, avec accès encadré au travail — la France n'a pas d'équivalent, ce qui laisse des personnes ni régularisables ni éloignables sans statut. Les pays scandinaves misent davantage sur les retours volontaires aidés (accompagnement financier), moins coûteux et plus exécutés que les retours forcés. L'UE tente d'harmoniser (pacte migration et asile de 2024, en cours de déploiement) et de mutualiser la pression diplomatique sur les pays d'origine. Aucun pays européen n'exécute la totalité de ses décisions de retour.`,
        },
        sources: [{ label: `Eurostat — retours effectifs par État membre ; Vie-publique.fr — pacte européen migration et asile (2024)`, url: 'https://www.vie-publique.fr', year: 2024 }],
      },
      {
        id: 'mesures-prises',
        titre: { fr: `Ce qui a déjà été fait en France` },
        corps: {
          fr: `Le droit a été durci et réformé de façon répétée : une dizaine de lois immigration depuis 2000. Dernier épisode majeur : la loi du 26 janvier 2024, qui a simplifié le contentieux des étrangers (réduction du nombre de procédures de recours), élargi les possibilités d'OQTF en cas de menace à l'ordre public en réduisant certaines protections, et facilité certaines régularisations dans les métiers en tension — après que le Conseil constitutionnel a censuré une part importante du texte voté, essentiellement pour des raisons de procédure (« cavaliers législatifs »), le 25 janvier 2024.\n\nCôté moyens : extension progressive du parc de rétention, objectifs chiffrés donnés aux préfets, négociations bilatérales sur les laissez-passer (avec des résultats variables selon les pays). Bilan d'étape : le volume de décisions reste très élevé, le taux d'exécution mesuré reste faible — les effets de la réforme du contentieux de 2024 sont encore en cours d'évaluation à la date de cette fiche.`,
        },
        sources: [
          { label: `Conseil constitutionnel — décision n° 2023-863 DC du 25 janvier 2024`, url: 'https://www.conseil-constitutionnel.fr', year: 2024 },
          { label: `Vie-publique.fr — chronologie des lois immigration depuis 1980`, url: 'https://www.vie-publique.fr', year: 2025 },
        ],
      },
      {
        id: 'propositions',
        titre: { fr: `Ce qui est proposé aujourd'hui` },
        corps: {
          fr: `Dans le débat à la date de cette fiche : allonger encore la durée maximale de rétention (déjà portée à 90 jours en 2018) ; conditionner visas et aide au développement à la délivrance des laissez-passer ; créer un statut pour les personnes durablement inexpulsables (inspiré de l'Allemagne) ; transférer une partie du contentieux au juge judiciaire ou le simplifier davantage ; élargir les régularisations par le travail ; ou au contraire restreindre l'accès aux protections contre l'éloignement. Attention au stade de chaque proposition : une annonce n'est pas un projet de loi, un projet de loi n'est pas une loi, et une loi votée n'est appliquée qu'après ses décrets — le débat public confond en permanence ces étapes.`,
        },
      },
      {
        id: 'se-faire-une-opinion',
        titre: { fr: `Questions pour se faire sa propre opinion` },
        corps: {
          fr: `Faut-il prononcer moins d'OQTF pour en exécuter une plus grande part, ou maintenir un prononcé large pour affirmer la règle ? L'annulation fréquente par le juge est-elle un dysfonctionnement ou le signe que le contrôle fonctionne ? Que faire des personnes ni régularisables ni expulsables — les laisser sans statut, ou créer un statut ? Quel prix (diplomatique, financier, humain) accepte-t-on de payer pour augmenter les éloignements forcés ? Et quel indicateur vous semble le plus honnête pour juger la politique menée ? Vos réponses à ces cinq questions disent votre position — quelle qu'elle soit, elle sera plus solide que le slogan qu'elle remplace.`,
        },
      },
    ],
  },

  vraiFaux: ['vf-oqtf-peine', 'vf-oqtf-expulsion-immediate', 'vf-oqtf-recours', 'vf-oqtf-dangereux', 'vf-oqtf-refus-agir'],

  quiz: [
    {
      question: { fr: `Qui prend la décision d'une OQTF ?` },
      options: [
        { fr: `Un juge pénal` },
        { fr: `Le préfet — c'est une décision administrative` },
        { fr: `Le ministre de l'Intérieur, au cas par cas` },
        { fr: `La police aux frontières` },
      ],
      bonneReponse: 1,
      explication: { fr: `L'OQTF est prise par le préfet sur le fondement du CESEDA. Elle peut ensuite être contestée devant le tribunal administratif — c'est là que le juge intervient.` },
    },
    {
      question: { fr: `Un demandeur d'asile dont la demande est en cours d'examen…` },
      options: [
        { fr: `Est automatiquement sous OQTF` },
        { fr: `A en principe le droit de rester en France pendant l'examen, sauf exceptions prévues par la loi` },
        { fr: `Doit rester en centre de rétention` },
        { fr: `Ne peut pas faire de recours` },
      ],
      bonneReponse: 1,
      explication: { fr: `Le droit au maintien pendant l'examen de la demande est le principe ; les exceptions (pays d'origine « sûrs », demandes de réexamen…) sont encadrées par la loi. « Demandeur d'asile » et « sous OQTF » ne sont pas synonymes.` },
    },
    {
      question: { fr: `Pourquoi une grande partie des OQTF n'est-elle pas exécutée ?` },
      options: [
        { fr: `Uniquement parce que l'État refuse d'agir` },
        { fr: `Uniquement à cause des recours` },
        { fr: `Plusieurs causes cumulées : annulations par le juge, refus de laissez-passer consulaires, personnes introuvables, capacités de rétention limitées, prononcé massif` },
        { fr: `Parce que la loi interdit de les exécuter` },
      ],
      bonneReponse: 2,
      explication: { fr: `Aucune cause unique n'explique l'écart : la Cour des comptes documente un cumul de causes juridiques, diplomatiques et matérielles — auquel s'ajoute le choix français de prononcer beaucoup plus de décisions que les voisins européens.` },
    },
    {
      question: { fr: `Quelle est la différence entre une OQTF et une expulsion ?` },
      options: [
        { fr: `Aucune, c'est le même mot` },
        { fr: `L'expulsion est une mesure distincte et plus rare, motivée par une menace grave pour l'ordre public` },
        { fr: `L'OQTF est plus grave que l'expulsion` },
        { fr: `L'expulsion est décidée par le maire` },
      ],
      bonneReponse: 1,
      explication: { fr: `L'OQTF constate l'absence de droit au séjour ; l'expulsion sanctionne une menace grave pour l'ordre public. Les deux mots ne sont pas interchangeables, même si les médias les confondent souvent.` },
    },
    {
      question: { fr: `La France prononce-t-elle plus ou moins de décisions de retour que ses voisins européens ?` },
      options: [
        { fr: `Beaucoup plus : c'est le pays de l'UE qui en prononce le plus` },
        { fr: `Beaucoup moins` },
        { fr: `Exactement la moyenne européenne` },
        { fr: `Les statistiques n'existent pas` },
      ],
      bonneReponse: 0,
      explication: { fr: `La France prononce de l'ordre de 130 000 à 140 000 OQTF par an, loin devant les autres États membres. C'est l'une des raisons pour lesquelles son taux d'exécution mesuré paraît plus bas — le dénominateur est beaucoup plus grand.` },
    },
  ],

  motsAssocies: [
    { label: { fr: `Demandeur d'asile` }, soon: true },
    { label: { fr: 'Rétention administrative' }, soon: true },
    { label: { fr: 'Laissez-passer consulaire' }, soon: true },
    { label: { fr: 'Droit du sol' }, soon: true },
  ],
  continuerAvec: [
    { slug: 'immigration', label: { fr: `L'immigration (grand débat)` }, soon: true },
    { slug: 'droite' },
    { slug: 'retraites' },
  ],

  sources: [
    { label: `CESEDA, livre VI — décisions d'éloignement (Légifrance)`, url: 'https://www.legifrance.gouv.fr', year: 2026, perimetre: `droit applicable en métropole ; régimes spécifiques outre-mer` },
    { label: `Cour des comptes — La politique de lutte contre l'immigration irrégulière, rapport public, janvier 2024`, url: 'https://www.ccomptes.fr', year: 2024 },
    { label: `Ministère de l'Intérieur — statistiques annuelles de l'éloignement`, url: 'https://www.interieur.gouv.fr', year: 2024 },
    { label: `Conseil constitutionnel — décision n° 2023-863 DC du 25 janvier 2024 (loi immigration)`, url: 'https://www.conseil-constitutionnel.fr', year: 2024 },
    { label: `Eurostat — décisions de retour et retours effectifs dans l'UE`, url: 'https://ec.europa.eu/eurostat', year: 2024, perimetre: `définitions distinctes des statistiques nationales — comparaisons à manier avec prudence` },
  ],
};
