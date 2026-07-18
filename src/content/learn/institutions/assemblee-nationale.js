/**
 * Fiche institution « L'Assemblée nationale » — modèle institution
 * (docs/jyconnaisrien/02, §2/§8) : schéma simple, section « ce qu'elle ne peut
 * PAS faire » obligatoire, comparaison internationale.
 */

export default {
  slug: 'assemblee-nationale',
  type: 'institution',
  porte: 'E1',
  title: { fr: `L'Assemblée nationale`, en: 'The National Assembly' },
  icon: '🏟️',
  difficulty: 1,
  famille: 'dossier',
  updatedAt: '2026-07-12',
  freshness: { type: 'periodic', reviewEveryMonths: 12, lastReviewedAt: '2026-07-12' },

  // ── N1 ──────────────────────────────────────────────────────────────────────
  level1: {
    fr: `L'Assemblée nationale, ce sont les 577 députés élus directement par les citoyens. Elle vote les lois et le budget, contrôle le gouvernement et peut le renverser par une motion de censure — ce qui n'est arrivé que deux fois, en 1962 et en décembre 2024. En cas de désaccord avec le Sénat, c'est elle qui a le dernier mot. C'est le cœur parlementaire de la Ve République, longtemps encadré par un exécutif fort.`,
  },

  // ── N2 ──────────────────────────────────────────────────────────────────────
  level2: {
    sections: [
      {
        titre: { fr: `Le schéma simple` },
        corps: {
          fr: `577 députés sont élus par les citoyens, un par circonscription. Ensemble, ils votent les lois et le budget de l'État, contrôlent l'action du gouvernement (questions, commissions d'enquête) et peuvent le renverser en votant une motion de censure à la majorité absolue — 289 voix.\n\nTout découle de l'arithmétique : si le président dispose d'une majorité absolue de députés, l'Assemblée vote ses textes et il gouverne réellement. Sans majorité absolue — la situation depuis 2022 —, chaque loi devient une négociation, et la menace de censure redevient réelle.`,
        },
      },
      {
        titre: { fr: `Ce qu'elle fait vraiment` },
        corps: {
          fr: `Voter les lois : chaque texte fait la navette entre l'Assemblée et le Sénat jusqu'à un accord — et en cas de désaccord persistant, le gouvernement peut donner le dernier mot à l'Assemblée. L'essentiel du travail se fait en commissions (lois, finances, affaires sociales…), qui examinent et amendent les textes avant la séance publique.\n\nContrôler le gouvernement : questions au gouvernement chaque semaine, retransmises en direct ; commissions d'enquête dotées de pouvoirs d'investigation (convocations sous serment) ; évaluation des politiques publiques. Et l'arme ultime : la motion de censure, qui oblige le gouvernement démissionnaire à partir si elle est adoptée.`,
        },
        sources: [{ label: `Constitution du 4 octobre 1958, articles 24, 45, 48-51 (Légifrance)`, url: 'https://www.legifrance.gouv.fr', year: 1958 }],
      },
      {
        titre: { fr: `Ce qu'elle ne peut PAS faire` },
        brique: 'a-retenir',
        corps: {
          fr: `L'Assemblée ne peut pas renverser le président de la République : la censure vise le gouvernement, jamais le chef de l'État (seule la procédure de destitution de l'article 68, devant la Haute Cour, peut l'atteindre). Les députés ne peuvent pas non plus augmenter les dépenses publiques ou réduire les recettes de leur propre initiative : l'article 40 de la Constitution déclare ces propositions irrecevables — seul le gouvernement peut le faire. Enfin, l'Assemblée ne peut pas s'auto-dissoudre ni décider seule de la date de nouvelles élections : la dissolution appartient au président.`,
        },
      },
      {
        titre: { fr: `Comment on devient député` },
        corps: {
          fr: `Scrutin uninominal majoritaire à deux tours, dans 577 circonscriptions : chaque électeur vote pour un candidat (et son suppléant, qui le remplace s'il devient ministre par exemple). Pour se maintenir au second tour, il faut avoir obtenu au moins 12,5 % des électeurs inscrits — d'où les « triangulaires » quand la participation monte. Il faut avoir 18 ans et être électeur. Les partis qui ne présentent pas autant de femmes que d'hommes voient leur financement public réduit : c'est la parité dite « financière », incitative plutôt qu'obligatoire.`,
        },
        sources: [{ label: `Vie-publique.fr — « Comment les députés sont-ils élus ? »`, url: 'https://www.vie-publique.fr', year: 2024 }],
      },
    ],
  },

  // ── N3 ──────────────────────────────────────────────────────────────────────
  level3: {
    sections: [
      {
        id: 'une-loi-comment-ca-marche',
        titre: { fr: `Une loi, comment ça marche ?` },
        corps: {
          fr: `Un texte de loi naît soit du gouvernement (projet de loi — la grande majorité des lois adoptées), soit d'un parlementaire (proposition de loi). Il est d'abord examiné en commission, où les députés l'amendent article par article, puis en séance publique, où il est de nouveau débattu, amendé et voté. Il part ensuite au Sénat, qui fait de même : c'est la navette. Si les deux chambres n'arrivent pas au même texte, une commission mixte paritaire (7 députés, 7 sénateurs) cherche un compromis ; en cas d'échec, le gouvernement peut donner le dernier mot à l'Assemblée nationale (article 45).\n\nUne fois voté, le texte peut être soumis au Conseil constitutionnel, puis il est promulgué par le président et publié au Journal officiel. Mais une loi promulguée ne s'applique pas toute seule : beaucoup de ses articles attendent des décrets d'application — parfois pendant des mois. Entre « la loi est votée » et « la mesure s'applique vraiment », il y a toujours un délai.`,
        },
        sources: [{ label: `Vie-publique.fr — « Comment est élaborée une loi ? » ; Constitution, articles 39, 44-45`, url: 'https://www.vie-publique.fr', year: 2024 }],
      },
      {
        id: 'le-parlement-rationalise',
        titre: { fr: `1958 : un Parlement volontairement bridé` },
        corps: {
          fr: `La Constitution de 1958 est écrite contre l'instabilité des IIIe et IVe Républiques, où les assemblées faisaient et défaisaient les gouvernements. Les constitutionnalistes parlent de « parlementarisme rationalisé » : l'ordre du jour a longtemps été maîtrisé par le gouvernement, l'article 40 interdit aux parlementaires d'aggraver les charges publiques, l'article 41 permet d'écarter les amendements qui sortent du domaine de la loi, le « vote bloqué » (article 44.3) force un vote unique sur un texte, et le 49.3 permet de faire adopter un texte sans vote, sauf censure (voir l'entrée du dictionnaire).\n\nLa révision constitutionnelle de 2008 a desserré l'étau : ordre du jour désormais partagé entre gouvernement et Parlement, semaines réservées au contrôle, journées d'initiative laissées aux groupes d'opposition (les « niches parlementaires »), discussion en séance sur le texte de la commission et non plus celui du gouvernement, et limitation du 49.3 hors budgets à un seul texte par session.`,
        },
        sources: [{ label: `Loi constitutionnelle du 23 juillet 2008 (Légifrance) ; Vie-publique.fr — « le parlementarisme rationalisé »`, url: 'https://www.legifrance.gouv.fr', year: 2008 }],
      },
      {
        id: 'controle-du-gouvernement',
        titre: { fr: `Contrôler le gouvernement : questions, enquêtes, censure` },
        corps: {
          fr: `Le contrôle prend plusieurs formes, de la plus courante à la plus lourde. Les questions au gouvernement, chaque semaine en séance télévisée, et les questions écrites, auxquelles les ministres doivent répondre. Les commissions d'enquête, créées à la demande des groupes (chaque groupe peut en obtenir une par an) : elles convoquent des témoins qui déposent sous serment, et leurs rapports ont parfois un fort retentissement. Les missions d'information et l'évaluation des politiques publiques, moins visibles mais continues.\n\nEt l'arme ultime : la motion de censure (voir le dictionnaire), qui exige la signature d'un dixième des députés puis 289 voix pour être adoptée. Seules deux censures ont abouti dans toute l'histoire de la Ve République : en octobre 1962 et en décembre 2024. L'écart entre ces deux dates dit à quel point le fait majoritaire a longtemps neutralisé cette arme.`,
        },
        sources: [{ label: `Assemblée nationale — le contrôle parlementaire ; Constitution, articles 49-51`, url: 'https://www.assemblee-nationale.fr', year: 2024 }],
      },
      {
        id: 'groupes-politiques',
        titre: { fr: `Les groupes politiques : la vraie unité de base` },
        corps: {
          fr: `À l'Assemblée, presque tout passe par les groupes : il faut au moins 15 députés pour en former un. Un groupe donne des moyens matériels et humains, du temps de parole en séance, des postes dans les commissions, le droit de demander une commission d'enquête ou une journée de « niche » pour ses propres textes. Les groupes d'opposition disposent de droits spécifiques depuis 2008.\n\nLes députés qui n'appartiennent à aucun groupe — les « non-inscrits » — ont beaucoup moins de moyens et de temps de parole. C'est pourquoi des députés d'horizons proches se rassemblent parfois dans des groupes techniques. La discipline de vote au sein des groupes est une réalité (les positions sont arrêtées collectivement), mais elle n'a rien de juridique : le vote de chaque député est personnel, et les « frondes » internes existent.`,
        },
        sources: [{ label: `Règlement de l'Assemblée nationale, article 19 ; Assemblée nationale — les groupes politiques`, url: 'https://www.assemblee-nationale.fr', year: 2024 }],
      },
      {
        id: 'statut-du-depute',
        titre: { fr: `Le statut du député : immunité, indemnité, cumul` },
        corps: {
          fr: `L'immunité parlementaire recouvre deux choses distinctes. L'irresponsabilité : un député ne peut jamais être poursuivi pour les opinions ou les votes émis dans l'exercice de son mandat — protection absolue du débat. L'inviolabilité : pour le reste (une infraction ordinaire), il peut être poursuivi comme tout citoyen, mais les mesures privatives de liberté exigent l'accord du bureau de l'Assemblée — et cette protection peut être levée, ce qui arrive régulièrement.\n\nCôté moyens : une indemnité parlementaire d'environ 7 600 € bruts par mois (indemnité de base plus indemnité de résidence, chiffres 2024), une avance de frais de mandat contrôlée, et un crédit pour rémunérer des collaborateurs. Depuis 2017, un député ne peut plus cumuler son mandat avec une fonction exécutive locale (maire, président de département ou de région) : la fin du cumul a profondément renouvelé le profil des élus.`,
        },
        sources: [{ label: `Assemblée nationale — statut du député, indemnités et moyens (données 2024)`, url: 'https://www.assemblee-nationale.fr', year: 2024 }],
      },
      {
        id: 'le-senat-et-la-navette',
        titre: { fr: `Et le Sénat dans tout ça ?` },
        corps: {
          fr: `La France a deux chambres, mais elles ne sont pas égales : c'est le « bicamérisme inégalitaire ». Le Sénat, élu au suffrage indirect par les élus locaux, examine tous les textes et les amende — la navette améliore réellement la qualité juridique des lois. Mais en cas de désaccord persistant, le gouvernement peut donner le dernier mot à l'Assemblée nationale, parce qu'elle seule est élue au suffrage direct.\n\nDeux exceptions où l'Assemblée n'a pas le dernier mot : les révisions constitutionnelles, qui exigent l'accord des deux chambres dans les mêmes termes, et les lois organiques relatives au Sénat. Le Sénat ne peut pas non plus renverser le gouvernement — et ne peut pas être dissous.`,
        },
        sources: [{ label: `Constitution, articles 24, 45, 46, 89 ; Vie-publique.fr — « le bicamérisme »`, url: 'https://www.vie-publique.fr', year: 2024 }],
      },
      {
        id: 'le-perchoir-et-lorganisation',
        titre: { fr: `Le perchoir et l'organisation interne` },
        corps: {
          fr: `Le président de l'Assemblée nationale — installé au « perchoir », le fauteuil surélevé qui domine l'hémicycle — dirige les débats, veille au règlement et représente l'institution : il est protocolairement le quatrième personnage de l'État. Il nomme aussi des membres du Conseil constitutionnel et doit être consulté par le président de la République avant une dissolution.\n\nAutour de lui, le bureau (vice-présidents, questeurs chargés du budget interne, secrétaires) administre l'Assemblée, et la conférence des présidents — présidents de groupes et de commissions — organise l'ordre du jour. Huit commissions permanentes se répartissent tous les textes. Ce fonctionnement interne, fixé par le Règlement de l'Assemblée, est contrôlé par le Conseil constitutionnel.`,
        },
        sources: [{ label: `Assemblée nationale — l'organisation de l'Assemblée ; Règlement de l'Assemblée nationale`, url: 'https://www.assemblee-nationale.fr', year: 2024 }],
      },
      {
        id: 'l-assemblee-fragmentee',
        titre: { fr: `2022-2024 : l'Assemblée fragmentée, une nouvelle ère` },
        corps: {
          fr: `Pendant soixante ans, le « fait majoritaire » a dominé : le président élu obtenait dans la foulée une majorité absolue de députés, et l'Assemblée votait ses textes. 2022 a rompu ce mécanisme : pour la première fois depuis 1988, le camp présidentiel n'a obtenu qu'une majorité relative. La dissolution de juin 2024 a accentué la fragmentation : trois blocs sans majorité, aucun ne pouvant gouverner seul.\n\nConséquence directe : le 4 décembre 2024, l'Assemblée a censuré le gouvernement de Michel Barnier (331 voix) — la première censure aboutie depuis le 5 octobre 1962, qui visait le gouvernement Pompidou. Le pouvoir réel s'est déplacé vers l'hémicycle : compromis texte par texte, négociations entre groupes, gouvernements fragiles. C'est un fonctionnement banal dans la plupart des démocraties parlementaires européennes, mais inédit à cette échelle sous la Ve République.`,
        },
        sources: [{ label: `Assemblée nationale — scrutin sur la motion de censure du 4 décembre 2024 ; Vie-publique.fr — les législatives de 2022 et 2024`, url: 'https://www.assemblee-nationale.fr', year: 2024 }],
      },
      {
        id: 'critiques-et-reformes',
        titre: { fr: `Les critiques et les réformes en débat` },
        corps: {
          fr: `L'absentéisme, critique la plus populaire, est en partie un malentendu : l'hémicycle clairsemé des débats techniques s'explique parce que le travail se fait surtout en commission le matin et en circonscription — même si de vrais écarts d'assiduité existent et sont mesurés (des retenues financières s'appliquent aux absences répétées en commission). Autre reproche récurrent : des députés « godillots » qui suivraient aveuglément leur groupe — la discipline est réelle, mais les frondes, les milliers d'amendements et les votes dissidents aussi.\n\nCôté réformes, deux serpents de mer : l'introduction d'une dose de proportionnelle (voir le dictionnaire), promise par plusieurs présidents et jamais adoptée depuis 1986 — ses partisans y voient une meilleure représentation, ses opposants un risque d'instabilité ; et la réduction du nombre de députés, régulièrement proposée (ses partisans invoquent l'efficacité, ses opposants l'éloignement de l'élu et le poids accru des circonscriptions). Aucune ne fait consensus.`,
        },
        sources: [{ label: `Vie-publique.fr — les modes de scrutin et les projets de réforme institutionnelle`, url: 'https://www.vie-publique.fr', year: 2024 }],
      },
      {
        id: 'comparaison',
        titre: { fr: `Et ailleurs ? Trois parlements pour comparer` },
        brique: 'comparaison',
        rows: [
          { pays: { fr: '🇫🇷 France' }, valeur: '577 députés', desc: { fr: `Scrutin majoritaire à deux tours, chambre basse dominante mais longtemps encadrée par l'exécutif (49.3, article 40). Peut renverser le gouvernement, peut être dissoute.` } },
          { pays: { fr: '🇩🇪 Allemagne' }, valeur: 'Bundestag', desc: { fr: `Scrutin mixte avec forte dose proportionnelle : les coalitions y sont la norme, pas l'exception. Le Bundestag élit lui-même le chancelier et ne peut le renverser qu'en en élisant un autre (censure « constructive »).` } },
          { pays: { fr: '🇬🇧 Royaume-Uni' }, valeur: 'Communes', desc: { fr: `Scrutin majoritaire à un seul tour, qui fabrique généralement des majorités nettes. Le Premier ministre est issu des Communes et responsable devant elles ; pas de 49.3 — le gouvernement doit convaincre sa propre majorité.` } },
          { pays: { fr: '🇺🇸 États-Unis' }, valeur: 'Congrès', desc: { fr: `La Chambre des représentants ne peut pas renverser le président, qui ne peut pas la dissoudre. En échange, le Congrès a un pouvoir budgétaire bien plus fort que le Parlement français — rien d'équivalent à l'article 40.` } },
        ],
      },
    ],
  },

  // ── Chronologie ──────────────────────────────────────────────────────────────
  chronologie: {
    titre: { fr: `L'Assemblée, de 1789 à aujourd'hui` },
    events: [
      { date: '1789', titre: { fr: `La naissance : le serment du Jeu de paume` }, detail: { fr: `Les députés du tiers état se proclament « Assemblée nationale » le 17 juin 1789 et jurent, le 20 juin au Jeu de paume, de ne pas se séparer avant d'avoir donné une Constitution à la France. L'idée fondatrice : la souveraineté appartient à la nation représentée, pas au roi.` }, source: { label: `Assemblée nationale — histoire de l'institution`, year: 1789 } },
      { date: '1945', titre: { fr: `Les premières femmes députées` }, detail: { fr: `Les femmes votent pour la première fois en 1945 et 33 d'entre elles entrent à l'Assemblée constituante. La parité restera très lente : il faudra attendre les années 2000 et les lois sur la parité pour que leur part progresse nettement.` }, source: { label: `Assemblée nationale — les femmes en politique`, year: 1945 } },
      { date: '1958', titre: { fr: `Le parlementarisme rationalisé` }, detail: { fr: `La Constitution de la Ve République encadre étroitement l'Assemblée, jugée responsable de l'instabilité passée : ordre du jour maîtrisé par le gouvernement, article 40, vote bloqué, 49.3. Le centre de gravité du régime bascule vers l'exécutif.` }, source: { label: `Constitution du 4 octobre 1958 (Légifrance)`, year: 1958 } },
      { date: '5 octobre 1962', titre: { fr: `La seule censure aboutie… pendant 62 ans` }, detail: { fr: `L'Assemblée censure le gouvernement Pompidou pour protester contre le référendum sur l'élection directe du président. De Gaulle dissout, gagne les législatives — et aucune censure n'aboutira plus jusqu'en 2024.` }, source: { label: `Assemblée nationale — la motion de censure du 5 octobre 1962`, year: 1962 } },
      { date: '1974', titre: { fr: `60 députés peuvent saisir le Conseil constitutionnel` }, detail: { fr: `La révision de 1974 ouvre la saisine du Conseil constitutionnel à 60 députés ou 60 sénateurs : l'opposition parlementaire gagne une arme juridique majeure, très utilisée depuis, contre les lois de la majorité.` }, source: { label: `Loi constitutionnelle du 29 octobre 1974 (Légifrance)`, year: 1974 } },
      { date: '2008', titre: { fr: `La révision qui redonne de l'air au Parlement` }, detail: { fr: `Ordre du jour partagé, semaines de contrôle, niches des groupes d'opposition, débat sur le texte de la commission, 49.3 limité hors budgets à un texte par session : la révision de 2008 rééquilibre partiellement le rapport de force.` }, source: { label: `Loi constitutionnelle du 23 juillet 2008 (Légifrance)`, year: 2008 } },
      { date: '2017', titre: { fr: `La fin du cumul des mandats` }, detail: { fr: `Un député ne peut plus être en même temps maire ou président d'un exécutif local. Appliquée à partir des législatives de 2017, la réforme renouvelle le profil des élus — et nourrit un débat toujours ouvert sur leur ancrage local.` }, source: { label: `Lois organique et ordinaire du 14 février 2014, application 2017 (Légifrance)`, year: 2017 } },
      { date: '2022', titre: { fr: `La majorité relative` }, detail: { fr: `Pour la première fois depuis 1988, le camp du président réélu n'obtient pas la majorité absolue. Chaque texte doit désormais être négocié — ou passé au 49.3. L'Assemblée redevient le lieu où se joue la politique nationale.` }, source: { label: `Vie-publique.fr — les législatives de juin 2022`, year: 2022 } },
      { date: '4 décembre 2024', titre: { fr: `La censure du gouvernement Barnier` }, detail: { fr: `Après un 49.3 sur le budget de la Sécurité sociale, l'Assemblée issue de la dissolution de juin 2024 censure le gouvernement de Michel Barnier par 331 voix — la deuxième censure aboutie de la Ve République, 62 ans après la première.` }, source: { label: `Assemblée nationale — scrutin du 4 décembre 2024`, year: 2024 } },
    ],
  },

  vraiFaux: ['vf-an-senat-inutile', 'vf-an-godillots', 'vf-an-renverser-president', 'vf-an-absenteisme'],

  quiz: [
    {
      question: { fr: `Combien faut-il de voix pour qu'une motion de censure renverse le gouvernement ?` },
      options: [
        { fr: `La majorité des députés présents ce jour-là` },
        { fr: `289 voix : la majorité absolue des 577 députés` },
        { fr: `Les deux tiers de l'Assemblée` },
        { fr: `Une majorité à l'Assemblée ET au Sénat` },
      ],
      bonneReponse: 1,
      explication: { fr: `Il faut la majorité absolue des membres de l'Assemblée (289 sur 577), pas seulement des présents : les abstentions comptent donc de fait pour le gouvernement. Le Sénat, lui, ne vote jamais la censure.` },
    },
    {
      question: { fr: `En cas de désaccord persistant entre l'Assemblée et le Sénat sur une loi ordinaire…` },
      options: [
        { fr: `Le texte est abandonné` },
        { fr: `Le président de la République tranche` },
        { fr: `Le gouvernement peut donner le dernier mot à l'Assemblée nationale` },
        { fr: `Le Conseil constitutionnel choisit la meilleure version` },
      ],
      bonneReponse: 2,
      explication: { fr: `Après la navette et l'échec éventuel de la commission mixte paritaire, l'article 45 permet au gouvernement de demander à l'Assemblée de statuer définitivement — parce qu'elle seule est élue au suffrage direct. Exceptions : les révisions constitutionnelles et les lois organiques relatives au Sénat.` },
    },
    {
      question: { fr: `Que peut renverser l'Assemblée nationale ?` },
      options: [
        { fr: `Le président de la République` },
        { fr: `Le gouvernement, par une motion de censure` },
        { fr: `Le Sénat` },
        { fr: `Le Conseil constitutionnel` },
      ],
      bonneReponse: 1,
      explication: { fr: `La censure vise le gouvernement, jamais le président : lui ne peut être atteint que par la procédure de destitution de l'article 68 (Haute Cour), jamais menée à terme à ce jour. C'est arrivé deux fois pour un gouvernement : 1962 et 2024.` },
    },
    {
      question: { fr: `Un député peut-il proposer une loi qui crée une nouvelle dépense publique ?` },
      options: [
        { fr: `Oui, comme toute proposition de loi` },
        { fr: `Oui, mais seulement avec l'accord du Sénat` },
        { fr: `Non : l'article 40 de la Constitution déclare irrecevable toute initiative parlementaire qui aggrave les charges publiques` },
        { fr: `Non, sauf pendant l'examen du budget` },
      ],
      bonneReponse: 2,
      explication: { fr: `C'est l'un des verrous du parlementarisme rationalisé de 1958 : seul le gouvernement peut créer ou aggraver une dépense. Les députés contournent parfois l'obstacle en « gageant » leurs propositions sur une recette nouvelle — pour les recettes, une compensation est admise.` },
    },
    {
      question: { fr: `Pourquoi parle-t-on de « triangulaires » aux élections législatives ?` },
      options: [
        { fr: `Parce que trois partis se partagent toujours l'Assemblée` },
        { fr: `Parce qu'un candidat peut se maintenir au second tour s'il a obtenu au moins 12,5 % des inscrits — quand la participation monte, trois candidats peuvent franchir la barre` },
        { fr: `Parce que le scrutin comporte trois tours` },
        { fr: `Parce que chaque circonscription élit trois députés` },
      ],
      bonneReponse: 1,
      explication: { fr: `Le seuil de maintien est calculé sur les inscrits, pas sur les votants. À forte abstention, seuls deux candidats l'atteignent ; à forte participation, comme en 2024, des dizaines de triangulaires deviennent possibles — beaucoup se résolvent par des désistements avant le second tour.` },
    },
  ],

  // ── N4 ──────────────────────────────────────────────────────────────────────
  level4: {
    items: [
      { kind: 'texte', titre: { fr: `Constitution du 4 octobre 1958, titres IV et V (Légifrance)` }, note: { fr: `Les articles fondamentaux sur le Parlement (24-33) et sur ses rapports avec le gouvernement (34-51) : domaine de la loi, article 40, navette de l'article 45, censure de l'article 49.` }, url: 'https://www.legifrance.gouv.fr' },
      { kind: 'lien', titre: { fr: `assemblee-nationale.fr — séances en direct et dossiers législatifs` }, note: { fr: `Toutes les séances sont diffusées en direct et archivées ; chaque texte a son dossier législatif complet (amendements, comptes rendus, scrutins nominatifs — on peut vérifier le vote de son propre député).` }, url: 'https://www.assemblee-nationale.fr' },
      { kind: 'texte', titre: { fr: `Le Règlement de l'Assemblée nationale` }, note: { fr: `Le mode d'emploi interne : groupes, commissions, temps de parole, discipline des débats. Aride mais précis — c'est là que se joue une grande partie du rapport de force réel.` }, url: 'https://www.assemblee-nationale.fr' },
      { kind: 'lien', titre: { fr: `Vie-publique.fr — fiches « Le Parlement »` }, note: { fr: `Des fiches pédagogiques institutionnelles sur la procédure législative, le bicamérisme, le contrôle parlementaire et les réformes en débat, tenues à jour.` }, url: 'https://www.vie-publique.fr' },
      { kind: 'donnees', titre: { fr: `data.assemblee-nationale.fr — l'open data de l'Assemblée` }, note: { fr: `Amendements, scrutins, présences en commission, activité de chaque député : les données brutes qui alimentent les observatoires citoyens de l'activité parlementaire.` }, url: 'https://data.assemblee-nationale.fr' },
    ],
  },

  motsAssocies: ['49-3', 'motion-de-censure', 'proportionnelle'],
  continuerAvec: [
    { slug: 'president-de-la-republique' },
    { slug: 'conseil-constitutionnel' },
    { slug: 'emmanuel-macron' },
  ],

  sources: [
    { label: `Constitution du 4 octobre 1958, texte consolidé (Légifrance) — articles 24-51, 68, 89`, url: 'https://www.legifrance.gouv.fr', year: 2026 },
    { label: `Assemblée nationale — fiches de synthèse sur l'organisation, la procédure législative et le statut du député (données 2024)`, url: 'https://www.assemblee-nationale.fr', year: 2024 },
    { label: `Vie-publique.fr — fiches « Le Parlement », « le bicamérisme », « les modes de scrutin »`, url: 'https://www.vie-publique.fr', year: 2024 },
    { label: `Assemblée nationale — scrutins publics : motions de censure du 5 octobre 1962 et du 4 décembre 2024`, url: 'https://www.assemblee-nationale.fr', year: 2024 },
  ],
};
