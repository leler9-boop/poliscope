/**
 * Fiche grand repère « Les élections » — comment la France vote, tous scrutins
 * confondus. Carte de type 'fiche-base' du hub débutant (porte A) : pédagogie
 * maximale, même mécanique de niveaux que les fiches institution.
 */

export default {
  slug: 'elections',
  type: 'fiche-base',
  porte: 'A',
  title: { fr: `Les élections`, en: 'Elections in France' },
  icon: '🗳️',
  difficulty: 1,
  famille: 'dossier',
  updatedAt: '2026-07-12',
  freshness: { type: 'periodic', reviewEveryMonths: 12, lastReviewedAt: '2026-07-12' },

  // ── N1 ──────────────────────────────────────────────────────────────────────
  level1: {
    fr: `En France, on vote à partir de 18 ans, à condition d'être inscrit sur les listes électorales. Présidentielle, législatives, municipales, européennes… chaque scrutin a ses propres règles : deux tours ou proportionnelle, tous les cinq ou six ans. Le vote est un droit, pas une obligation — et comprendre qui élit quoi, et comment, est la première clé pour suivre la vie politique sans se sentir perdu.`,
  },

  // ── N2 ──────────────────────────────────────────────────────────────────────
  level2: {
    sections: [
      {
        titre: { fr: `Qui peut voter — et comment s'inscrire` },
        corps: {
          fr: `Pour voter, il faut avoir 18 ans, la nationalité française et être inscrit sur les listes électorales de sa commune. Exception importante : les citoyens des autres pays de l'Union européenne qui vivent en France peuvent voter aux élections municipales et européennes (un droit créé par le traité de Maastricht en 1992).\n\nL'inscription est automatique à 18 ans si le recensement citoyen a été fait vers 16 ans. Sinon — ou après un déménagement — c'est une démarche à faire soi-même, en ligne ou en mairie, et il y a une date limite : environ six semaines avant le scrutin. Beaucoup de gens qui « ne peuvent pas voter » sont en réalité des « mal-inscrits » : inscrits dans une ancienne commune, loin de chez eux.`,
        },
        sources: [{ label: `Service-public.fr — « Élections : inscription sur les listes électorales »`, url: 'https://www.service-public.fr', year: 2025 }],
      },
      {
        titre: { fr: `Les scrutins en un coup d'œil` },
        brique: 'glossaire',
        termes: [
          { nom: { fr: `Présidentielle` }, def: { fr: `Élit le président de la République pour 5 ans, au suffrage universel direct, en deux tours : si personne n'a la majorité absolue au premier, les deux premiers s'affrontent au second.` } },
          { nom: { fr: `Législatives` }, def: { fr: `Élisent les 577 députés de l'Assemblée nationale, un par circonscription, en deux tours. Elles décident qui peut gouverner : sans majorité à l'Assemblée, le président est très affaibli.` } },
          { nom: { fr: `Municipales` }, def: { fr: `Élisent les conseils municipaux pour 6 ans, au scrutin de liste. Ce sont ensuite les conseillers qui élisent le maire. Les citoyens de l'UE peuvent y voter.` } },
          { nom: { fr: `Européennes` }, def: { fr: `Élisent les députés européens pour 5 ans, à la proportionnelle sur des listes nationales : chaque liste obtient des sièges en fonction de son score (à partir de 5 % des voix).` } },
          { nom: { fr: `Régionales et départementales` }, def: { fr: `Élisent pour 6 ans les conseils régionaux (listes) et départementaux (binômes homme-femme par canton). Souvent organisées le même jour.` } },
          { nom: { fr: `Sénatoriales` }, def: { fr: `Élisent les sénateurs au suffrage indirect : ce ne sont pas les citoyens qui votent, mais environ 162 000 « grands électeurs », surtout des délégués des conseils municipaux.` } },
        ],
      },
      {
        titre: { fr: `Comment se passe un vote, concrètement` },
        corps: {
          fr: `Le jour du scrutin, on se présente à son bureau de vote avec une pièce d'identité. On prend les bulletins et une enveloppe, on passe par l'isoloir — c'est obligatoire, pour garantir le secret du vote —, on glisse l'enveloppe dans l'urne et on signe la liste d'émargement. Le vote est gratuit, aucune machine à payer, aucun intermédiaire.\n\nEmpêché ce jour-là ? La procuration permet de confier son vote à une personne de confiance : la démarche a été simplifiée et peut se faire en grande partie en ligne. À la fermeture du bureau, le dépouillement est public : ce sont des citoyens volontaires, les scrutateurs, qui comptent les bulletins sous le regard de tous. N'importe qui peut assister au comptage — c'est l'une des garanties les plus concrètes de la sincérité du scrutin.`,
        },
        sources: [{ label: `Service-public.fr — « Vote par procuration » et « Déroulement du vote » ; Code électoral, article L62 (isoloir)`, url: 'https://www.service-public.fr', year: 2025 }],
      },
      {
        titre: { fr: `Vote blanc ≠ vote nul ≠ abstention` },
        brique: 'confusion',
        corps: {
          fr: `Trois gestes différents, trois significations différentes. L'abstention, c'est ne pas se déplacer (ou ne pas être inscrit). Le vote nul, c'est un bulletin invalide — déchiré, annoté, enveloppe vide de sens réglementaire — souvent involontaire. Le vote blanc, c'est un choix : se déplacer et voter « aucun des candidats » (enveloppe vide ou bulletin blanc). Depuis une loi du 21 février 2014, les votes blancs sont comptés à part et annoncés avec les résultats — mais ils n'entrent PAS dans les « suffrages exprimés » : ils ne changent donc rien au résultat ni aux pourcentages des candidats. Le blanc est reconnu, pas comptabilisé.`,
        },
        sources: [{ label: `Loi du 21 février 2014 visant à reconnaître le vote blanc aux élections (Légifrance)`, url: 'https://www.legifrance.gouv.fr', year: 2014 }],
      },
    ],
  },

  // ── N3 ──────────────────────────────────────────────────────────────────────
  level3: {
    sections: [
      {
        id: 'majoritaire-ou-proportionnelle',
        titre: { fr: `Majoritaire ou proportionnelle : pourquoi le mode de scrutin change tout` },
        corps: {
          fr: `Deux grandes familles de règles produisent deux paysages politiques différents. Le scrutin majoritaire (présidentielle, législatives) donne le siège au candidat arrivé en tête : il pousse au rassemblement, élimine les petits partis et « fabrique » des majorités claires — au prix d'une déformation : un parti peut obtenir beaucoup de voix au niveau national et très peu de sièges. La proportionnelle (européennes) distribue les sièges en fonction des scores : elle photographie plus fidèlement la diversité des opinions, mais rend les majorités plus rares et oblige à des coalitions.\n\nC'est pour cela que les mêmes électeurs produisent des résultats si différents selon le scrutin : les législatives fabriquent (en principe) une majorité de gouvernement, les européennes dessinent la carte réelle des sensibilités. Aucun système n'est « juste » ou « faux » en soi : chacun arbitre entre stabilité et représentativité — c'est l'un des plus vieux débats de la science politique.`,
        },
        sources: [{ label: `Vie-publique.fr — « Les modes de scrutin : scrutin majoritaire, proportionnel, mixte »`, url: 'https://www.vie-publique.fr', year: 2024 }],
      },
      {
        id: 'presidentielle-mode-demploi',
        titre: { fr: `La présidentielle, mode d'emploi complet` },
        corps: {
          fr: `Pour se présenter, il faut réunir 500 parrainages d'élus (maires, parlementaires, conseillers départementaux et régionaux…), issus d'au moins 30 départements ou collectivités, sans qu'un même département puisse fournir plus d'un dixième des signatures. Depuis 2016, la liste complète des parrains est publiée — chacun peut vérifier qui a parrainé qui.\n\nPendant la campagne, le temps de parole dans les médias audiovisuels est surveillé : d'abord selon un principe d'équité (proportionné au poids politique de chaque candidat), puis, pendant la campagne officielle, selon une égalité stricte entre tous les candidats. Les dépenses sont plafonnées et contrôlées ; en contrepartie, l'État rembourse une partie des frais de campagne : un remboursement forfaitaire (environ 47,5 % du plafond) pour les candidats qui obtiennent au moins 5 % des suffrages exprimés au premier tour. Ce seuil de 5 % explique une partie de la stratégie des « petits » candidats : en dessous, la campagne reste largement à leur charge.`,
        },
        sources: [
          { label: `Conseil constitutionnel — règles de l'élection présidentielle et publication des parrainages`, url: 'https://www.conseil-constitutionnel.fr', year: 2022 },
          { label: `CNCCFP — plafonds et remboursement des dépenses de campagne, élection présidentielle`, url: 'https://www.cnccfp.fr', year: 2022 },
        ],
      },
      {
        id: 'second-tour-et-triangulaires',
        titre: { fr: `Second tour, triangulaires et désistements` },
        corps: {
          fr: `Aux législatives, la règle de qualification pour le second tour est particulière : il faut obtenir les voix d'au moins 12,5 % des électeurs inscrits — pas des votants. Conséquence directe : plus l'abstention est forte, plus la barre est haute en pourcentage des exprimés, et moins il y a de triangulaires (seconds tours à trois candidats) ; quand la participation remonte, comme en 2024, les triangulaires se multiplient.\n\nEntre les deux tours, un candidat qualifié peut se désister — se retirer volontairement — pour favoriser la défaite d'un adversaire. C'est le mécanisme dit du « front républicain » : le retrait réciproque de candidats pour faire battre l'extrême droite, observé notamment en 2002 (présidentielle) et lors de vagues massives de désistements aux législatives de 2024. C'est une pratique politique, pas une règle de droit : rien n'oblige un candidat à se désister, et le débat sur la légitimité et l'efficacité de ces consignes de vote traverse tous les partis.`,
        },
        sources: [{ label: `Code électoral, article L162 (qualification au second tour) ; Vie-publique.fr — les élections législatives`, url: 'https://www.legifrance.gouv.fr', year: 2024 }],
      },
      {
        id: 'financement-et-controle',
        titre: { fr: `L'argent des campagnes : plafonds, dons, contrôles` },
        corps: {
          fr: `Depuis les lois de 1988-1995, l'argent des campagnes est étroitement encadré. Les dons sont limités : 4 600 € maximum par personne et par campagne, 7 500 € par an et par parti — et depuis la loi du 19 janvier 1995, les entreprises et toutes les « personnes morales » n'ont plus le droit de financer ni les campagnes ni les partis. Les dépenses sont plafonnées, et chaque candidat dépose un compte de campagne vérifié par une autorité indépendante, la CNCCFP (Commission nationale des comptes de campagne et des financements politiques). Si le compte est sincère et le score suffisant, l'État rembourse une partie des dépenses.\n\nUn compte peut être rejeté, avec perte du remboursement et sanctions possibles. L'histoire récente fournit des cas d'école : le compte d'Édouard Balladur pour 1995, validé à l'époque malgré de fortes réserves, a vu ses zones d'ombre documentées bien plus tard par la justice ; et le compte de Nicolas Sarkozy pour 2012 a été rejeté pour dépassement du plafond, avant que l'affaire Bygmalion ne révèle un système de fausses factures ayant conduit à sa condamnation (voir la fiche Nicolas Sarkozy). Le contrôle n'est pas théorique : il frappe aussi les favoris.`,
        },
        sources: [
          { label: `CNCCFP — rôle, plafonds de dons et de dépenses, comptes de campagne`, url: 'https://www.cnccfp.fr', year: 2025 },
          { label: `Loi du 19 janvier 1995 relative au financement de la vie politique (Légifrance)`, url: 'https://www.legifrance.gouv.fr', year: 1995 },
        ],
      },
      {
        id: 'sondages',
        titre: { fr: `Les sondages : utiles, encadrés, jamais prophétiques` },
        corps: {
          fr: `Les sondages électoraux sont surveillés par une autorité dédiée, la Commission des sondages, qui vérifie leurs méthodes et peut exiger des mises au point. La loi (de 1977, modifiée en 2002) interdit de publier tout sondage électoral la veille et le jour du scrutin, pour laisser la décision finale hors de leur influence.\n\nUn sondage est une photographie d'un moment, avec une marge d'erreur de l'ordre de 2 à 3 points sur un échantillon d'environ 1 000 personnes — jamais une prédiction. Quand deux candidats sont donnés à 20 % et 18 %, l'ordre d'arrivée n'est tout simplement pas connu. L'histoire l'a montré : en 2002, aucun grand sondage publié n'avait donné Jean-Marie Le Pen qualifié pour le second tour. Les intentions de vote bougent jusqu'au dernier jour, les indécis se décident tard, et les électeurs des différents camps ne répondent pas aux enquêtes avec la même facilité. Bon réflexe de lecture : regarder la tendance sur plusieurs sondages plutôt qu'un chiffre isolé, et toujours vérifier la date, l'échantillon et l'institut.`,
        },
        sources: [
          { label: `Commission des sondages — loi du 19 juillet 1977 modifiée, rôle et avis`, url: 'https://www.commission-des-sondages.fr', year: 2024 },
          { label: `Conseil constitutionnel — résultats officiels du premier tour de l'élection présidentielle 2002`, url: 'https://www.conseil-constitutionnel.fr', year: 2002 },
        ],
      },
      {
        id: 'abstention',
        titre: { fr: `L'abstention : qui ne vote pas, et pourquoi ça compte` },
        corps: {
          fr: `Tendance longue : depuis les années 1980, l'abstention progresse fortement pour presque tous les scrutins — européennes, régionales, départementales, législatives, municipales. Le record pour un scrutin national date des régionales de 2021 : environ 66,7 % d'abstention au premier tour, deux électeurs sur trois restés chez eux. Une exception résiste : la présidentielle, qui demeure de loin l'élection la plus mobilisatrice (environ 26,3 % d'abstention au premier tour de 2022, un niveau élevé pour ce scrutin mais sans commune mesure avec les autres).\n\nL'abstention n'est pas uniforme : les enquêtes de l'INSEE et des instituts de sondage montrent, avec les précautions d'usage, que les jeunes et les milieux populaires s'abstiennent nettement plus que les retraités et les diplômés — souvent en pratiquant un vote « intermittent » (voter à la présidentielle, s'abstenir au reste). Pourquoi ça compte : un scrutin très abstentionniste sur-représente certaines catégories, et aux législatives, l'abstention modifie mécaniquement la barre de qualification du second tour. S'abstenir est un droit ; mais c'est aussi laisser les autres choisir.`,
        },
        sources: [
          { label: `Ministère de l'Intérieur — résultats officiels des élections régionales 2021 et de la présidentielle 2022 (participation)`, url: 'https://www.interieur.gouv.fr', year: 2022 },
          { label: `INSEE — « Participation électorale » : inscription et vote par âge et catégorie sociale`, url: 'https://www.insee.fr', year: 2022 },
        ],
      },
      {
        id: 'debats-actuels',
        titre: { fr: `Les débats actuels : ce qui pourrait changer` },
        corps: {
          fr: `Plusieurs réformes reviennent régulièrement dans le débat — aucune n'est tranchée, chacune a ses partisans et ses opposants.\n\nLa proportionnelle aux législatives : pour — une Assemblée fidèle aux votes, moins de voix « perdues » ; contre — des majorités introuvables et des coalitions négociées après le vote. Le vote obligatoire, comme en Belgique : pour — une participation massive et des élus plus représentatifs ; contre — voter est une liberté, et contraindre ne crée pas de conviction. Le vote à 16 ans, comme en Autriche : pour — des jeunes concernés par les décisions de long terme et une habitude de vote prise tôt ; contre — la cohérence avec la majorité légale à 18 ans. La reconnaissance pleine du vote blanc (l'intégrer aux suffrages exprimés) : pour — donner un poids réel au refus de l'offre politique ; contre — le risque de seconds tours invalidés ou de présidents élus avec des scores affaiblis. Le RIC (référendum d'initiative citoyenne) : pour — redonner la décision directe aux citoyens ; contre — le risque de simplifier des questions complexes en oui/non. Le vote par correspondance ou électronique : pour — faciliter la participation, notamment des Français de l'étranger (qui l'utilisent déjà en partie) ; contre — la sécurité, le secret du vote et la confiance dans le dépouillement, plus difficiles à garantir qu'avec l'urne transparente et le comptage public.`,
        },
        sources: [{ label: `Vie-publique.fr — dossiers « modes de scrutin », « vote obligatoire », « vote blanc », « référendum d'initiative citoyenne »`, url: 'https://www.vie-publique.fr', year: 2025 }],
      },
      {
        id: 'une-election-comment-ca-se-conteste',
        titre: { fr: `Une élection, comment ça se conteste ?` },
        corps: {
          fr: `Un résultat électoral n'est pas incontestable par principe : des juges sont chargés de vérifier la régularité des scrutins, et n'importe quel électeur de la circonscription concernée peut déposer un recours dans des délais courts. Pour la présidentielle et les législatives (comme pour les sénatoriales et les référendums), c'est le Conseil constitutionnel qui juge : il proclame les résultats de la présidentielle et peut annuler l'élection d'un député en cas d'irrégularité grave — cela arrive réellement, avec nouvelle élection à la clé. Pour les élections locales (municipales, départementales, régionales), c'est le juge administratif : tribunal administratif d'abord, Conseil d'État ensuite. Le juge n'annule pas pour une simple erreur : il vérifie si l'irrégularité a pu changer le résultat, compte tenu de l'écart de voix. C'est ce contrôle juridictionnel — ajouté au dépouillement public — qui fonde la confiance dans les résultats français.`,
        },
        sources: [{ label: `Conseil constitutionnel — le contentieux électoral ; Vie-publique.fr — « Qui juge les élections ? »`, url: 'https://www.conseil-constitutionnel.fr', year: 2024 }],
      },
    ],
  },

  // ── Chronologie ──────────────────────────────────────────────────────────────
  chronologie: {
    titre: { fr: `Le droit de vote en France : les grandes dates` },
    events: [
      { date: '1848', titre: { fr: `Le suffrage « universel » masculin` }, detail: { fr: `La IIe République donne le droit de vote à tous les hommes de plus de 21 ans, sans condition de fortune — une première mondiale à cette échelle. « Universel » est entre guillemets : les femmes en restent exclues pendant près d'un siècle.` } },
      { date: '1944', titre: { fr: `Le droit de vote des femmes` }, detail: { fr: `L'ordonnance du 21 avril 1944, prise à Alger par le Comité français de la Libération nationale, accorde aux femmes le droit de voter et d'être élues. Premier vote effectif : les municipales d'avril 1945.` }, source: { label: `Ordonnance du 21 avril 1944 (Légifrance)`, year: 1944 } },
      { date: '1962', titre: { fr: `L'élection directe du président` }, detail: { fr: `Par référendum, les Français décident que le président de la République sera élu au suffrage universel direct. La présidentielle devient l'élection reine de la vie politique française.` } },
      { date: '1974', titre: { fr: `La majorité à 18 ans` }, detail: { fr: `La loi du 5 juillet 1974, voulue par Valéry Giscard d'Estaing, abaisse la majorité de 21 à 18 ans : environ deux millions et demi de jeunes deviennent électeurs d'un coup.` } },
      { date: '1988-1995', titre: { fr: `Les lois sur l'argent en politique` }, detail: { fr: `Après plusieurs scandales, une série de lois (1988, 1990, 1995) plafonne les dépenses de campagne, limite les dons, crée la CNCCFP et interdit tout financement par les entreprises. L'argent des campagnes passe sous contrôle public.` } },
      { date: '1992', titre: { fr: `Maastricht : les citoyens de l'UE aux urnes` }, detail: { fr: `Le traité de Maastricht crée une citoyenneté européenne : les ressortissants de l'UE résidant en France obtiennent le droit de vote aux élections municipales et européennes.` } },
      { date: '2000', titre: { fr: `Le quinquennat` }, detail: { fr: `Par référendum, le mandat présidentiel passe de 7 à 5 ans. Aligné sur celui des députés, il synchronise présidentielle et législatives — et renforce la domination de la présidentielle sur tout le calendrier électoral.` } },
      { date: '2014', titre: { fr: `Le vote blanc compté à part` }, detail: { fr: `La loi du 21 février 2014 impose de décompter et d'annoncer séparément les votes blancs — sans toutefois les intégrer aux suffrages exprimés : ils restent sans effet sur le résultat.` } },
      { date: '2017', titre: { fr: `La fin du cumul des mandats` }, detail: { fr: `Les lois de 2014 sur le non-cumul entrent en application : un député ou un sénateur ne peut plus être en même temps maire ou président d'un exécutif local. Le « député-maire », figure classique de la vie politique française, disparaît.` } },
      { date: '2021', titre: { fr: `Abstention record aux régionales` }, detail: { fr: `Environ 66,7 % des inscrits s'abstiennent au premier tour des régionales et départementales — record pour un scrutin national. L'abstention s'installe au centre du débat démocratique.` }, source: { label: `Ministère de l'Intérieur — résultats des élections régionales 2021`, year: 2021 } },
    ],
  },

  vraiFaux: ['vf-elections-vote-blanc-annule', 'vf-elections-voter-sans-inscription', 'vf-elections-sondages-predisent', 'vf-elections-abstention-partout'],

  quiz: [
    {
      question: { fr: `Qui a le droit de voter aux élections municipales en France ?` },
      options: [
        { fr: `Uniquement les personnes de nationalité française` },
        { fr: `Les Français majeurs inscrits, et les citoyens de l'UE résidant en France` },
        { fr: `Toute personne vivant en France depuis plus de 5 ans` },
        { fr: `Tous les habitants de la commune, quelle que soit leur nationalité` },
      ],
      bonneReponse: 1,
      explication: { fr: `Depuis le traité de Maastricht (1992), les citoyens des autres pays de l'UE peuvent voter aux municipales et aux européennes. Pour tous les autres scrutins (présidentielle, législatives…), il faut la nationalité française.` },
    },
    {
      question: { fr: `Un vote blanc…` },
      options: [
        { fr: `Compte comme un suffrage exprimé et pèse sur le résultat` },
        { fr: `Est identique à un vote nul` },
        { fr: `Est compté et annoncé à part depuis 2014, mais n'a aucun effet sur le résultat` },
        { fr: `Peut faire annuler l'élection s'il dépasse 50 %` },
      ],
      bonneReponse: 2,
      explication: { fr: `Depuis la loi du 21 février 2014, les blancs sont décomptés séparément des nuls — mais ils n'entrent pas dans les suffrages exprimés : ils ne changent ni les pourcentages ni le vainqueur.` },
    },
    {
      question: { fr: `Pour se qualifier au second tour des législatives, un candidat doit obtenir…` },
      options: [
        { fr: `12,5 % des suffrages exprimés` },
        { fr: `Les voix d'au moins 12,5 % des électeurs inscrits — la barre dépend donc de la participation` },
        { fr: `Au moins 20 % des votants` },
        { fr: `Il n'y a pas de seuil : les trois premiers sont toujours qualifiés` },
      ],
      bonneReponse: 1,
      explication: { fr: `Le seuil se calcule sur les inscrits, pas sur les votants. Forte abstention = barre plus haute et peu de triangulaires ; forte participation (comme en 2024) = beaucoup de candidats qualifiés.` },
    },
    {
      question: { fr: `Pour se présenter à l'élection présidentielle, il faut…` },
      options: [
        { fr: `Réunir 500 parrainages d'élus venant d'au moins 30 départements` },
        { fr: `Être investi par un parti politique` },
        { fr: `Recueillir 500 000 signatures de citoyens` },
        { fr: `Avoir déjà exercé un mandat national` },
      ],
      bonneReponse: 0,
      explication: { fr: `500 signatures d'élus (maires, parlementaires…), issues d'au moins 30 départements ou collectivités, sans qu'un département puisse en fournir plus d'un dixième. Depuis 2016, la liste des parrains est intégralement publiée.` },
    },
    {
      question: { fr: `Qui compte les bulletins à la fermeture des bureaux de vote ?` },
      options: [
        { fr: `La police, à huis clos` },
        { fr: `Une entreprise privée agréée par l'État` },
        { fr: `Des citoyens volontaires (les scrutateurs), publiquement, sous le regard de tous` },
        { fr: `Les candidats eux-mêmes` },
      ],
      bonneReponse: 2,
      explication: { fr: `Le dépouillement est public : des électeurs volontaires comptent les bulletins, et n'importe qui peut y assister. C'est l'une des garanties les plus concrètes de la sincérité du vote — avec le contrôle du juge en cas de recours.` },
    },
  ],

  // ── N4 ──────────────────────────────────────────────────────────────────────
  level4: {
    items: [
      { kind: 'lien', titre: { fr: `Code électoral — Légifrance` }, note: { fr: `Le texte de référence : conditions pour voter et être élu, déroulement des scrutins, isoloir, dépouillement, contentieux.` }, url: 'https://www.legifrance.gouv.fr' },
      { kind: 'lien', titre: { fr: `Service-public.fr — élections` }, note: { fr: `Les démarches pratiques : vérifier son inscription, s'inscrire en ligne, faire une procuration, trouver son bureau de vote.` }, url: 'https://www.service-public.fr' },
      { kind: 'lien', titre: { fr: `CNCCFP — Commission nationale des comptes de campagne` }, note: { fr: `L'autorité qui contrôle l'argent des campagnes et des partis : plafonds, comptes déposés, décisions publiées.` }, url: 'https://www.cnccfp.fr' },
      { kind: 'lien', titre: { fr: `Commission des sondages` }, note: { fr: `L'autorité qui surveille les sondages électoraux : textes applicables, mises au point demandées aux instituts.` }, url: 'https://www.commission-des-sondages.fr' },
      { kind: 'lien', titre: { fr: `Vie-publique.fr — dossiers « élections et modes de scrutin »` }, note: { fr: `Des fiches claires et sourcées sur chaque type de scrutin, l'abstention, le vote blanc et les réformes en débat.` }, url: 'https://www.vie-publique.fr' },
    ],
  },

  motsAssocies: [
    'proportionnelle',
    { label: { fr: `Front républicain` }, soon: true },
    { label: { fr: `Vote utile` }, soon: true },
  ],
  continuerAvec: [
    { slug: 'president-de-la-republique' },
    { slug: 'assemblee-nationale', label: { fr: `L'Assemblée nationale` }, soon: true },
    { slug: 'droite' },
  ],

  sources: [
    { label: `Code électoral, texte consolidé (Légifrance) — conditions d'électorat, modes de scrutin, second tour, contentieux`, url: 'https://www.legifrance.gouv.fr', year: 2026 },
    { label: `Vie-publique.fr — fiches « les modes de scrutin », « l'abstention », « le vote blanc », « qui juge les élections ? »`, url: 'https://www.vie-publique.fr', year: 2025 },
    { label: `Service-public.fr — inscription sur les listes électorales, procuration, déroulement du vote`, url: 'https://www.service-public.fr', year: 2025 },
    { label: `CNCCFP — financement des campagnes : plafonds de dons et de dépenses, remboursement`, url: 'https://www.cnccfp.fr', year: 2025 },
    { label: `Ministère de l'Intérieur — résultats officiels et participation (régionales 2021, présidentielle 2022)`, url: 'https://www.interieur.gouv.fr', year: 2022 },
  ],
};
