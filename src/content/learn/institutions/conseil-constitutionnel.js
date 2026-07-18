/**
 * Fiche institution « Le Conseil constitutionnel » — modèle institution
 * (docs/jyconnaisrien/02, §2/§8) : schéma simple, section « ce qu'il ne peut PAS
 * faire » obligatoire, comparaison internationale.
 */

export default {
  slug: 'conseil-constitutionnel',
  type: 'institution',
  porte: 'E2',
  title: { fr: `Le Conseil constitutionnel`, en: 'The Constitutional Council' },
  icon: '⚖️',
  difficulty: 2,
  famille: 'dossier',
  updatedAt: '2026-07-12',
  freshness: { type: 'periodic', reviewEveryMonths: 12, lastReviewedAt: '2026-07-12' },

  // ── N1 ──────────────────────────────────────────────────────────────────────
  level1: {
    fr: `Le Conseil constitutionnel vérifie que les lois respectent la Constitution. Ses neuf membres, nommés pour neuf ans, peuvent censurer un texte avant sa promulgation — ou après, depuis 2010, quand un justiciable soulève une question prioritaire de constitutionnalité (QPC). Créé en 1958 pour surveiller le Parlement, il est devenu le gardien des droits fondamentaux. Il valide aussi les élections nationales et les référendums. Puissant, mais contesté : ses membres ne sont pas forcément juristes.`,
  },

  // ── N2 ──────────────────────────────────────────────────────────────────────
  level2: {
    sections: [
      {
        titre: { fr: `À quoi il sert` },
        corps: {
          fr: `Sa mission principale : vérifier que les lois votées par le Parlement respectent la Constitution — et les droits qu'elle garantit (liberté d'expression, égalité, droit de propriété…). Si un article est jugé contraire, il est « censuré » : il disparaît du texte et ne s'appliquera jamais. Le contrôle peut avoir lieu avant la promulgation de la loi, ou après son entrée en vigueur via une QPC.\n\nDeuxième mission, moins connue : le Conseil est le juge des élections nationales. Il veille à la régularité de l'élection présidentielle et en proclame les résultats, tranche les contestations des élections législatives et sénatoriales, et contrôle les opérations de référendum. C'est aussi lui qui valide les 500 parrainages des candidats à la présidentielle.`,
        },
        sources: [{ label: `Constitution du 4 octobre 1958, titre VII, articles 56 à 63 (Légifrance)`, url: 'https://www.legifrance.gouv.fr', year: 1958 }],
      },
      {
        titre: { fr: `Qui le compose` },
        corps: {
          fr: `Neuf membres nommés : trois par le président de la République, trois par le président de l'Assemblée nationale, trois par celui du Sénat. Mandat de neuf ans, non renouvelable, avec un renouvellement par tiers tous les trois ans — chaque autorité nomme donc un membre tous les trois ans. Le président du Conseil est désigné par le président de la République parmi les neuf.\n\nS'y ajoutent les anciens présidents de la République, membres de droit à vie — une particularité française héritée de 1958. En pratique, de moins en moins y siègent : Valéry Giscard d'Estaing l'a fait régulièrement, Jacques Chirac et Nicolas Sarkozy ont cessé après quelques années, François Hollande n'y a jamais siégé. Beaucoup jugent cette présence d'anciens acteurs politiques incompatible avec le rôle de juge, et sa suppression a été proposée à plusieurs reprises — sans aboutir à ce jour.`,
        },
        sources: [{ label: `Constitution, article 56 ; Conseil constitutionnel — les membres`, url: 'https://www.conseil-constitutionnel.fr', year: 2025 }],
      },
      {
        titre: { fr: `Comment on le saisit` },
        corps: {
          fr: `Deux voies. Avant la promulgation d'une loi (contrôle « a priori ») : peuvent saisir le Conseil le président de la République, le Premier ministre, le président de l'Assemblée nationale, celui du Sénat — et, depuis 1974, 60 députés ou 60 sénateurs. Cette dernière voie a tout changé : l'opposition peut désormais contester presque chaque grand texte, et elle ne s'en prive pas.\n\nAprès l'entrée en vigueur (contrôle « a posteriori ») : depuis le 1er mars 2010, tout justiciable peut, à l'occasion d'un procès, soutenir qu'une loi déjà appliquée viole ses droits constitutionnels. C'est la question prioritaire de constitutionnalité (QPC). Elle passe par un filtrage : la Cour de cassation ou le Conseil d'État vérifient que la question est sérieuse et nouvelle avant de la transmettre. Certaines lois s'appliquaient depuis des décennies quand une QPC les a fait tomber.`,
        },
        sources: [{ label: `Constitution, articles 61 et 61-1 ; Vie-publique.fr — la saisine du Conseil constitutionnel`, url: 'https://www.vie-publique.fr', year: 2025 }],
      },
      {
        titre: { fr: `Ce qu'il ne peut PAS faire` },
        brique: 'a-retenir',
        corps: {
          fr: `Le Conseil constitutionnel ne peut pas s'autosaisir : si personne ne lui défère une loi avant sa promulgation, elle entre en vigueur — et ne pourra être contestée ensuite que par une QPC, ciblée sur des droits précis. Il ne juge pas l'opportunité politique d'une loi : une réforme peut être jugée mauvaise, injuste ou impopulaire et parfaitement constitutionnelle — son rôle s'arrête à la conformité à la Constitution. Il ne peut pas réviser la Constitution : ce pouvoir appartient au pouvoir constituant (Parlement réuni en Congrès ou référendum). Et il ne juge aucun procès ordinaire : condamner un voleur ou trancher un litige avec l'administration, c'est le travail des tribunaux judiciaires (chapeautés par la Cour de cassation) et administratifs (chapeautés par le Conseil d'État) — deux institutions distinctes avec lesquelles on le confond souvent.`,
        },
      },
    ],
  },

  // ── N3 ──────────────────────────────────────────────────────────────────────
  level3: {
    sections: [
      {
        id: 'naissance-1958',
        titre: { fr: `1958 : un « chien de garde » de l'exécutif` },
        corps: {
          fr: `À sa création, le Conseil constitutionnel n'est pas pensé comme un protecteur des libertés — l'idée même de contrôler la loi, « expression de la volonté générale », est alors presque sacrilège en France. Les rédacteurs de la Constitution de 1958 lui donnent un rôle précis : empêcher le Parlement de déborder du domaine que la Constitution lui assigne, comme il l'avait fait sous les IIIe et IVe Républiques. C'est un « chien de garde » au service de l'exécutif, chargé de faire respecter le « parlementarisme rationalisé ». Ses premières années sont discrètes : peu de saisines, des décisions techniques, une institution que beaucoup considèrent comme secondaire. Rien ne laisse alors deviner ce qu'elle deviendra.`,
        },
        sources: [{ label: `Vie-publique.fr — la création du Conseil constitutionnel en 1958`, url: 'https://www.vie-publique.fr', year: 2025 }],
      },
      {
        id: '1971-la-revolution',
        titre: { fr: `1971 : la décision qui change tout` },
        corps: {
          fr: `Le 16 juillet 1971, le Conseil censure une loi qui aurait permis à l'administration de bloquer la création d'associations jugées indésirables — le gouvernement visait notamment des groupes d'extrême gauche. Pour le faire, il s'appuie sur le Préambule de la Constitution, qui renvoie à la Déclaration des droits de l'homme de 1789 et au préambule de la Constitution de 1946 : ces textes, jusque-là considérés comme de grands principes sans force juridique directe, deviennent des normes que les lois doivent respecter. Les juristes appellent l'ensemble le « bloc de constitutionnalité ».\n\nCette décision « Liberté d'association » (71-44 DC) est un basculement : le Conseil, conçu pour surveiller le Parlement au profit de l'exécutif, censure une loi voulue par le gouvernement au nom d'une liberté fondamentale. Il vient de s'inventer un nouveau rôle — protecteur des droits — qu'aucun texte ne lui avait explicitement confié. C'est la décision la plus célèbre de son histoire, parfois comparée à l'arrêt Marbury v. Madison de la Cour suprême américaine.`,
        },
        sources: [{ label: `Conseil constitutionnel — décision 71-44 DC du 16 juillet 1971, Liberté d'association`, url: 'https://www.conseil-constitutionnel.fr', year: 1971 }],
      },
      {
        id: '1974-l-ouverture',
        titre: { fr: `1974 : l'opposition obtient une arme` },
        corps: {
          fr: `Jusqu'en 1974, seuls quatre personnages peuvent saisir le Conseil : président de la République, Premier ministre, présidents des deux chambres — c'est-à-dire, la plupart du temps, la majorité elle-même, qui n'a aucune raison de contester ses propres lois. La révision constitutionnelle du 29 octobre 1974, voulue par Valéry Giscard d'Estaing, ouvre la saisine à 60 députés ou 60 sénateurs.\n\nLa conséquence est mécanique : l'opposition, quelle qu'elle soit, dispose désormais d'un recours contre les textes de la majorité. Le contrôle de constitutionnalité, jusque-là exceptionnel, devient quasi systématique sur les grands textes — budgets, réformes de société, lois sécuritaires. Le Conseil passe d'une dizaine de décisions par décennie à un rôle central dans chaque bataille législative. La gauche, qui avait dénoncé la réforme comme un gadget, en devient la première utilisatrice après 1974, comme la droite après 1981 : chaque camp découvre les vertus du Conseil quand il est dans l'opposition.`,
        },
        sources: [{ label: `Loi constitutionnelle du 29 octobre 1974 (Légifrance) ; Vie-publique.fr — l'élargissement de la saisine`, url: 'https://www.legifrance.gouv.fr', year: 1974 }],
      },
      {
        id: 'la-qpc',
        titre: { fr: `La QPC : le citoyen entre en scène` },
        corps: {
          fr: `Jusqu'en 2010, une loi promulguée devenait intouchable : même manifestement contraire à la Constitution, elle s'appliquait. La révision constitutionnelle de 2008 crée la question prioritaire de constitutionnalité, en vigueur depuis le 1er mars 2010 : tout justiciable peut désormais, au cours d'un procès, contester la loi qu'on lui applique. La Cour de cassation ou le Conseil d'État filtrent les questions (sérieuses, nouvelles, applicables au litige) avant transmission.\n\nLe succès dépasse les attentes : plus de 1 000 décisions QPC rendues depuis 2010, sur des sujets qui touchent la vie concrète. L'exemple le plus parlant reste la garde à vue : le 30 juillet 2010, le Conseil juge le régime français contraire aux droits de la défense — des centaines de milliers de gardes à vue se déroulaient chaque année sans avocat présent aux interrogatoires. Le législateur a dû réformer en 2011 : l'assistance d'un avocat dès le début de la garde à vue est une conséquence directe d'une QPC. Le contrôle de constitutionnalité, longtemps affaire de parlementaires, est devenu un droit du citoyen.`,
        },
        sources: [{ label: `Conseil constitutionnel — décision du 30 juillet 2010 sur la garde à vue et bilan des QPC`, url: 'https://www.conseil-constitutionnel.fr', year: 2010 }],
      },
      {
        id: 'decisions-marquantes',
        titre: { fr: `Quatre décisions pour comprendre son pouvoir` },
        corps: {
          fr: `Nationalisations, 16 janvier 1982 : la gauche arrive au pouvoir avec un programme de nationalisations massives. Le Conseil ne les interdit pas, mais censure les modalités d'indemnisation des actionnaires, jugées insuffisantes au regard du droit de propriété (Déclaration de 1789). Le Parlement revote avec une indemnisation plus élevée. Première démonstration qu'il peut contraindre un programme politique majeur — la gauche crie alors au « gouvernement des juges ».\n\nIVG : la loi Veil de 1975 n'a jamais été censurée, et le Conseil a constamment validé les élargissements successifs du droit à l'avortement. Le 8 mars 2024, une révision constitutionnelle inscrit dans l'article 34 la « liberté garantie » de recourir à l'IVG — la France est le premier pays au monde à protéger cette liberté à ce niveau dans sa Constitution. Ce n'est pas une décision du Conseil, mais un choix du pouvoir constituant, en partie motivé par le précédent américain (revirement de la Cour suprême en 2022).\n\nRetraites, 14 avril 2023 : contrairement à une idée répandue, le Conseil valide l'essentiel de la réforme portant l'âge légal à 64 ans, y compris son passage par une loi de financement rectificative. Il censure uniquement des dispositions annexes (comme l'« index seniors »), étrangères à ce type de loi, et rejette deux demandes de référendum d'initiative partagée.\n\nImmigration, 25 janvier 2024 : le Conseil censure environ 40 % des articles de la loi — mais très majoritairement comme « cavaliers législatifs », c'est-à-dire des dispositions ajoutées par amendement sans lien suffisant avec le texte initial. C'est une censure de procédure : sur le fond de la plupart de ces mesures (quotas migratoires, restrictions des prestations sociales…), le Conseil ne s'est pas prononcé — elles pourraient revenir dans un autre texte. La nuance a souvent été perdue dans le débat public.`,
        },
        sources: [
          { label: `Conseil constitutionnel — décision 81-132 DC du 16 janvier 1982 (nationalisations)`, url: 'https://www.conseil-constitutionnel.fr', year: 1982 },
          { label: `Conseil constitutionnel — décision 2023-849 DC du 14 avril 2023 (réforme des retraites)`, url: 'https://www.conseil-constitutionnel.fr', year: 2023 },
          { label: `Conseil constitutionnel — décision 2023-863 DC du 25 janvier 2024 (loi immigration)`, url: 'https://www.conseil-constitutionnel.fr', year: 2024 },
          { label: `Loi constitutionnelle du 8 mars 2024 relative à la liberté de recourir à l'IVG (Légifrance)`, url: 'https://www.legifrance.gouv.fr', year: 2024 },
        ],
      },
      {
        id: 'les-nominations-en-debat',
        titre: { fr: `Les nominations : des juges très politiques` },
        corps: {
          fr: `Aucune condition de diplôme, d'âge ou de compétence juridique n'est exigée pour être nommé au Conseil constitutionnel — singularité parmi les grandes cours du monde. Les autorités de nomination étant elles-mêmes politiques, les membres sont souvent d'anciens ministres, parlementaires ou proches collaborateurs, parfois juristes, parfois non. Depuis la révision de 2008, chaque nomination passe par une audition publique devant les commissions des lois du Parlement, qui peuvent la bloquer par un avis négatif aux trois cinquièmes des suffrages exprimés — un veto jamais atteint à ce jour, le seuil étant très élevé.\n\nLes présidences récentes illustrent le débat : Laurent Fabius, ancien Premier ministre socialiste, préside le Conseil de 2016 à 2025 ; Richard Ferrand, ancien président de l'Assemblée nationale, est nommé en 2025 par Emmanuel Macron, dont il fut l'un des plus proches compagnons politiques — une nomination contestée précisément pour cette proximité avec le chef de l'État, et validée de justesse lors des auditions parlementaires. Les défenseurs du système répondent que l'expérience politique aide à mesurer les effets concrets des décisions, que le mandat unique de neuf ans protège l'indépendance (un membre n'a rien à attendre de celui qui l'a nommé), et que les grandes décisions contrariant les nominateurs ne manquent pas.`,
        },
        sources: [{ label: `Constitution, articles 13 et 56 ; Vie-publique.fr — la nomination des membres du Conseil constitutionnel`, url: 'https://www.vie-publique.fr', year: 2025 }],
      },
      {
        id: 'gouvernement-des-juges',
        titre: { fr: `Le « gouvernement des juges » : le grand débat` },
        corps: {
          fr: `Neuf personnes non élues peuvent-elles défaire ce qu'ont voté les représentants du peuple ? C'est le débat le plus profond autour du Conseil, et il traverse tous les camps.\n\nPour ses défenseurs, le contrôle de constitutionnalité est un pilier de l'État de droit : la démocratie n'est pas seulement la loi de la majorité, c'est aussi la garantie que cette majorité ne peut pas écraser les droits des minorités ni les libertés de chacun. Une Constitution qui ne s'imposerait pas au législateur ne protégerait personne ; l'histoire du XXe siècle montre ce que des majorités élues peuvent faire sans contre-pouvoirs. Et le dernier mot reste au peuple : une révision constitutionnelle peut toujours surmonter une censure.\n\nPour ses critiques, des juges — de surcroît nommés et non nécessairement juristes — n'ont pas la légitimité d'annuler la volonté générale exprimée par le Parlement : quand le Conseil censure, il fait un choix qui est aussi politique, derrière un vocabulaire juridique. Le risque : que les grandes questions (immigration, économie, société) soient tranchées par neuf personnes plutôt que par le débat démocratique.\n\nFait révélateur : chaque camp reprend l'argument à son tour. La gauche dénonçait le « gouvernement des juges » après la censure des nationalisations en 1982 ; la droite et l'extrême droite l'ont dénoncé après la censure partielle de la loi immigration en 2024, quand la gauche saluait un « rempart de l'État de droit » — et inversement lors de la validation de la réforme des retraites en 2023. L'appréciation du Conseil dépend souvent moins de principes que de la décision du jour.`,
        },
        sources: [{ label: `Vie-publique.fr — le débat sur le contrôle de constitutionnalité et l'État de droit`, url: 'https://www.vie-publique.fr', year: 2025 }],
      },
      {
        id: 'comparaison',
        titre: { fr: `Et ailleurs ? Trois cours pour comparer` },
        brique: 'comparaison',
        rows: [
          { pays: { fr: '🇫🇷 France' }, valeur: 'Conseil constitutionnel', desc: { fr: `Neuf membres nommés pour neuf ans (mandat court, non renouvelable), sans exigence de qualification juridique, profils souvent politiques. Contrôle a priori rapide (avant promulgation) + QPC depuis 2010.` } },
          { pays: { fr: '🇺🇸 États-Unis' }, valeur: 'Cour suprême', desc: { fr: `Neuf juges nommés à vie par le président (confirmés par le Sénat), tous juristes. Pouvoir immense : ses revirements (avortement, armes) redessinent la société américaine, et chaque nomination est une bataille politique majeure.` } },
          { pays: { fr: '🇩🇪 Allemagne' }, valeur: 'Cour de Karlsruhe', desc: { fr: `Seize juges obligatoirement juristes qualifiés, élus aux deux tiers par le Parlement — un seuil qui impose des compromis entre partis et écarte les profils partisans. Souvent citée comme modèle de légitimité.` } },
        ],
      },
      {
        id: 'critiques-et-reformes',
        titre: { fr: `Les réformes en débat` },
        corps: {
          fr: `Trois pistes reviennent régulièrement. Exiger une compétence juridique des membres : la plupart des grandes cours constitutionnelles du monde le font, et la critique du « juge non juriste » est l'une des plus consensuelles chez les constitutionnalistes. Supprimer les membres de droit : la présence à vie des anciens présidents de la République — juges de lois qu'ils ont parfois eux-mêmes portées — a été jugée anachronique par des comités successifs, et sa suppression figurait dans plusieurs projets de révision constitutionnelle, tous avortés faute d'aboutir au Congrès. Transformer le Conseil en véritable cour constitutionnelle : nom de « Cour », procédure plus contradictoire, opinions dissidentes publiées comme aux États-Unis ou en Allemagne, mode de nomination exigeant une majorité qualifiée.\n\nAucune de ces réformes n'a abouti à ce jour : elles supposent une révision constitutionnelle, donc un accord politique large — et les majorités en place ont rarement intérêt à réformer une institution dont elles nomment les membres. Le Conseil a lui-même fait évoluer ses pratiques (audiences publiques pour les QPC, publication des saisines et des « portes étroites » — les contributions extérieures), sans toucher à son architecture.`,
        },
        sources: [{ label: `Vie-publique.fr — les projets de réforme du Conseil constitutionnel`, url: 'https://www.vie-publique.fr', year: 2025 }],
      },
    ],
  },

  // ── Chronologie ──────────────────────────────────────────────────────────────
  chronologie: {
    titre: { fr: `Le Conseil constitutionnel, de 1958 à aujourd'hui` },
    events: [
      { date: '1958', titre: { fr: `Création par la Constitution de la Ve République` }, detail: { fr: `Le Conseil est conçu comme un gardien des frontières du Parlement, au service du « parlementarisme rationalisé » — pas comme un protecteur des libertés.` }, source: { label: `Constitution du 4 octobre 1958, titre VII`, year: 1958 } },
      { date: '1971', titre: { fr: `Décision Liberté d'association` }, detail: { fr: `Le 16 juillet 1971, le Conseil intègre le Préambule (Déclaration de 1789, préambule de 1946) au « bloc de constitutionnalité » et censure une loi liberticide : il devient protecteur des droits fondamentaux.` }, source: { label: `Décision 71-44 DC du 16 juillet 1971`, year: 1971 } },
      { date: '1974', titre: { fr: `La saisine ouverte à 60 députés ou 60 sénateurs` }, detail: { fr: `La révision du 29 octobre 1974 donne à l'opposition le droit de saisir le Conseil : le contrôle de constitutionnalité devient systématique sur les grands textes.` }, source: { label: `Loi constitutionnelle du 29 octobre 1974`, year: 1974 } },
      { date: '1982', titre: { fr: `Censure des modalités des nationalisations` }, detail: { fr: `Le 16 janvier 1982, le Conseil impose une meilleure indemnisation des actionnaires au nom du droit de propriété. Première confrontation majeure avec un programme de gouvernement — et premier procès en « gouvernement des juges ».` }, source: { label: `Décision 81-132 DC du 16 janvier 1982`, year: 1982 } },
      { date: '2008', titre: { fr: `La révision qui crée la QPC` }, detail: { fr: `La loi constitutionnelle du 23 juillet 2008 instaure le contrôle a posteriori (article 61-1) et soumet les nominations à audition parlementaire avec veto possible aux trois cinquièmes négatifs.` }, source: { label: `Loi constitutionnelle du 23 juillet 2008`, year: 2008 } },
      { date: '2010', titre: { fr: `Premières QPC` }, detail: { fr: `Le mécanisme entre en vigueur le 1er mars 2010. Dès le 30 juillet, la censure du régime de la garde à vue impose une réforme majeure de la procédure pénale.` }, source: { label: `Conseil constitutionnel — premières décisions QPC`, year: 2010 } },
      { date: 'janv. 2024', titre: { fr: `Censure partielle de la loi immigration` }, detail: { fr: `Le 25 janvier 2024, environ 40 % des articles sont censurés — très majoritairement comme cavaliers législatifs, une censure de procédure qui ne tranche pas le fond des mesures écartées.` }, source: { label: `Décision 2023-863 DC du 25 janvier 2024`, year: 2024 } },
      { date: 'mars 2024', titre: { fr: `L'IVG dans la Constitution` }, detail: { fr: `Le 8 mars 2024, le Congrès inscrit à l'article 34 la « liberté garantie » de recourir à l'IVG — protection constitutionnelle explicite unique au monde à ce niveau.` }, source: { label: `Loi constitutionnelle du 8 mars 2024`, year: 2024 } },
    ],
  },

  vraiFaux: ['vf-cc-annuler-toute-loi', 'vf-cc-membres-juges', 'vf-cc-retraites-2023', 'vf-cc-immigration-fond'],

  quiz: [
    {
      question: { fr: `Comment les neuf membres du Conseil constitutionnel sont-ils désignés ?` },
      options: [
        { fr: `Élus par les citoyens` },
        { fr: `Trois nommés par le président de la République, trois par le président de l'Assemblée nationale, trois par celui du Sénat` },
        { fr: `Tirés au sort parmi les magistrats` },
        { fr: `Nommés par le Conseil d'État` },
      ],
      bonneReponse: 1,
      explication: { fr: `Mandat de neuf ans, non renouvelable, avec un renouvellement par tiers tous les trois ans. S'y ajoutent les anciens présidents de la République, membres de droit — mais de moins en moins y siègent.` },
    },
    {
      question: { fr: `Qu'a changé la révision constitutionnelle de 1974 ?` },
      options: [
        { fr: `Elle a créé le Conseil constitutionnel` },
        { fr: `Elle a permis à 60 députés ou 60 sénateurs de saisir le Conseil` },
        { fr: `Elle a supprimé les membres de droit` },
        { fr: `Elle a rendu les décisions du Conseil facultatives` },
      ],
      bonneReponse: 1,
      explication: { fr: `Avant 1974, seuls le président de la République, le Premier ministre et les présidents des deux chambres pouvaient saisir le Conseil. L'ouverture à 60 parlementaires a donné une arme à l'opposition : le contrôle est devenu systématique sur les grands textes.` },
    },
    {
      question: { fr: `Qu'est-ce que la QPC (question prioritaire de constitutionnalité) ?` },
      options: [
        { fr: `Une question posée au gouvernement chaque mercredi` },
        { fr: `La possibilité pour tout justiciable, depuis 2010, de contester une loi déjà en vigueur qui violerait ses droits constitutionnels` },
        { fr: `Un référendum d'initiative citoyenne` },
        { fr: `Le droit du président de bloquer une loi` },
      ],
      bonneReponse: 1,
      explication: { fr: `Créée par la révision de 2008 et en vigueur depuis le 1er mars 2010, la QPC passe par un filtrage de la Cour de cassation ou du Conseil d'État. Plus de 1 000 décisions ont été rendues — dont la censure de la garde à vue sans avocat en 2010.` },
    },
    {
      question: { fr: `Pourquoi la décision « Liberté d'association » du 16 juillet 1971 est-elle historique ?` },
      options: [
        { fr: `Elle a créé les associations loi 1901` },
        { fr: `Elle a dissous le Conseil constitutionnel` },
        { fr: `Le Conseil y intègre la Déclaration de 1789 et le préambule de 1946 au « bloc de constitutionnalité » : il devient protecteur des droits fondamentaux` },
        { fr: `Elle a interdit les partis politiques extrémistes` },
      ],
      bonneReponse: 2,
      explication: { fr: `Conçu en 1958 comme un « chien de garde » de l'exécutif face au Parlement, le Conseil s'invente en 1971 un rôle de gardien des libertés en donnant force juridique aux grands textes de droits — un basculement qu'aucun texte ne prévoyait explicitement.` },
    },
    {
      question: { fr: `Le Conseil constitutionnel peut-il censurer une loi parce qu'il la juge politiquement mauvaise ?` },
      options: [
        { fr: `Oui, c'est son rôle principal` },
        { fr: `Non : il ne contrôle que la conformité à la Constitution, pas l'opportunité politique d'une loi` },
        { fr: `Oui, mais seulement en période électorale` },
        { fr: `Non, il ne peut jamais censurer une loi` },
      ],
      bonneReponse: 1,
      explication: { fr: `Une loi peut être impopulaire, contestée, jugée injuste — et parfaitement constitutionnelle : le Conseil la valide alors, comme la réforme des retraites en avril 2023. Juger l'opportunité d'une politique appartient au débat démocratique, pas au juge constitutionnel.` },
    },
  ],

  // ── Pour aller plus loin (N4) ────────────────────────────────────────────────
  level4: {
    items: [
      { kind: 'lien', titre: { fr: `Conseil-constitutionnel.fr — la base de toutes les décisions depuis 1958` }, note: { fr: `Chaque décision est publiée avec son commentaire officiel et le dossier de saisine. Commencer par la 71-44 DC (liberté d'association).` }, url: 'https://www.conseil-constitutionnel.fr' },
      { kind: 'texte', titre: { fr: `Constitution du 4 octobre 1958, titre VII (articles 56 à 63)` }, note: { fr: `Le statut complet du Conseil en huit articles — composition, saisine, effets des décisions. Court et lisible.` }, url: 'https://www.legifrance.gouv.fr' },
      { kind: 'lien', titre: { fr: `Vie-publique.fr — fiches et dossiers sur le Conseil constitutionnel et la QPC` }, note: { fr: `Synthèses institutionnelles pédagogiques et à jour, avec les chiffres clés du contentieux.` }, url: 'https://www.vie-publique.fr' },
      { kind: 'biblio', titre: { fr: `Dominique Rousseau, Droit du contentieux constitutionnel — LGDJ` }, note: { fr: `Le manuel de référence, régulièrement réédité : histoire, procédure, grandes décisions et débats doctrinaux.` } },
      { kind: 'lien', titre: { fr: `Titre VII — la revue du Conseil constitutionnel` }, note: { fr: `Revue semestrielle en accès libre : des constitutionnalistes y débattent des décisions récentes et des réformes de l'institution.` }, url: 'https://www.conseil-constitutionnel.fr' },
    ],
  },

  motsAssocies: ['49-3', 'motion-de-censure', { label: { fr: `L'État de droit` }, soon: true }],
  continuerAvec: [
    { slug: 'president-de-la-republique' },
    { label: { fr: `L'Assemblée nationale` }, soon: true },
    { slug: 'oqtf' },
  ],

  sources: [
    { label: `Constitution du 4 octobre 1958, titre VII, articles 56 à 63, texte consolidé (Légifrance)`, url: 'https://www.legifrance.gouv.fr', year: 2026 },
    { label: `Conseil constitutionnel — base des décisions (71-44 DC, 81-132 DC, 2023-849 DC, 2023-863 DC) et pages institutionnelles`, url: 'https://www.conseil-constitutionnel.fr', year: 2025 },
    { label: `Vie-publique.fr — fiches « le Conseil constitutionnel », « la QPC », « la nomination des membres »`, url: 'https://www.vie-publique.fr', year: 2025 },
    { label: `Loi constitutionnelle du 8 mars 2024 relative à la liberté de recourir à l'IVG (Légifrance)`, url: 'https://www.legifrance.gouv.fr', year: 2024 },
    { label: `Dominique Rousseau, Droit du contentieux constitutionnel, LGDJ (manuel de référence)`, year: 2023 },
  ],
};
