/**
 * Dossier-pivot « La gauche » — modèle ideologie, miroir du dossier « La droite »
 * (docs/jyconnaisrien/02, §3, variante dossier-pivot).
 * 4 niveaux de lecture : N1 (20 s) → N2 (3 min) → N3 (tout comprendre, repliable) → N4.
 */

export default {
  slug: 'gauche',
  type: 'ideologie',
  variante: 'dossier-pivot',
  porte: 'B',
  title: { fr: `La gauche`, en: 'The Left' },
  icon: '📕',
  difficulty: 2,
  famille: 'dossier',
  updatedAt: '2026-07-12',
  freshness: { type: 'periodic', reviewEveryMonths: 12, lastReviewedAt: '2026-07-12' },

  // ── N1 — En 20 secondes ─────────────────────────────────────────────────────
  level1: {
    fr: `La gauche est une grande famille politique qui met généralement en avant l'égalité, la solidarité, la défense des travailleurs et la volonté de transformer la société. Mais il n'existe pas une gauche : il en existe plusieurs, parfois opposées entre elles — socialiste, communiste, sociale-démocrate, écologiste, radicale… Être de gauche ne dit pas, à soi seul, ce que l'on pense de l'Europe, de la laïcité ou de l'immigration.`,
  },

  // ── N2 — En 3 minutes ───────────────────────────────────────────────────────
  level2: {
    sections: [
      {
        titre: { fr: 'Les grandes valeurs' },
        corps: {
          fr: `Quatre idées reviennent dans presque toutes les gauches : l'égalité (réduire les écarts de conditions, pas seulement proclamer des droits), la solidarité (la société est responsable du sort de ses membres les plus fragiles), l'émancipation (permettre à chacun de choisir sa vie, contre les dominations héritées) et le progrès (la société peut et doit être transformée, elle n'est pas un ordre naturel). Ce qui distingue les gauches entre elles, c'est la méthode et le rythme : réformer le capitalisme, le dépasser, ou en sortir.`,
        },
      },
      {
        titre: { fr: `D'où vient la gauche ?` },
        corps: {
          fr: `Le mot naît pendant la Révolution française : à l'été 1789, les partisans du changement se placent à gauche du président de séance, les défenseurs du roi à droite. Au XIXe siècle, la gauche se confond d'abord avec le camp républicain, puis le mouvement ouvrier fait émerger le socialisme. Les historiens — Michel Winock, Jacques Julliard — parlent des gauches au pluriel : républicaine, socialiste, communiste, libertaire… des familles aux origines distinctes, qui ne se sont jamais totalement fondues.`,
        },
      },
      {
        titre: { fr: 'Les principales sensibilités' },
        corps: {
          fr: `On distingue habituellement : la gauche révolutionnaire et communiste (sortir du capitalisme), la gauche socialiste (le transformer en profondeur par les réformes), la gauche sociale-démocrate (le réguler par le compromis social), la gauche sociale-libérale (accepter le marché en corrigeant ses effets), la gauche écologiste (placer les limites planétaires au centre), la gauche radicale dite insoumise (la rupture par les urnes), la gauche libertaire (la méfiance envers tout pouvoir, y compris l'État) et la gauche républicaine-souverainiste (la nation comme cadre du progrès social). La cartographie ci-dessous les détaille une par une.`,
        },
      },
      {
        titre: { fr: `La gauche et l'économie` },
        corps: {
          fr: `La gauche partage une conviction : le marché livré à lui-même produit des inégalités que la puissance publique doit corriger — par l'impôt progressif, les services publics, le droit du travail. Mais l'unanimité s'arrête là : la gauche radicale veut rompre avec le cadre libéral, la gauche socialiste redistribuer fortement, la sociale-démocratie négocier avec le marché. Et au pouvoir, la gauche a fait des choix contrastés : nationalisations en 1981, tournant de la rigueur en 1983, privatisations d'ampleur sous Lionel Jospin. « La gauche » n'a donc pas une politique économique unique.`,
        },
      },
      {
        titre: { fr: `La gauche et l'État social` },
        corps: {
          fr: `La protection sociale est au cœur de l'identité de la gauche : Front populaire de 1936 (congés payés, semaine de 40 heures), lois sociales de 1981-1982, 35 heures et couverture maladie universelle sous Jospin. Attention à une confusion fréquente : la Sécurité sociale de 1945 n'est pas l'œuvre de la seule gauche — elle naît d'un gouvernement d'union dirigé par de Gaulle, sur le programme du Conseil national de la Résistance, avec un ministre communiste, Ambroise Croizat, à la manœuvre. La gauche y a joué un rôle central, mais pas exclusif.`,
        },
      },
      {
        titre: { fr: 'Quelques figures' },
        corps: {
          fr: `Jean Jaurès (fondateur du socialisme démocratique français, assassiné en 1914), Léon Blum (président du Conseil du Front populaire en 1936), Pierre Mendès France (gauche de gouvernement, exigence morale), François Mitterrand (premier président de gauche de la Ve République, 1981-1995), Lionel Jospin (la « gauche plurielle », 1997-2002), Jean-Luc Mélenchon (la gauche radicale contemporaine). Des figures très différentes — c'est le point important : elles ne défendaient pas la même gauche, et certaines se sont durement opposées.`,
        },
      },
      {
        titre: { fr: 'Ce que disent ses défenseurs' },
        corps: {
          fr: `Les grandes conquêtes sociales — retraites, congés payés, assurance maladie, droit du travail — n'ont jamais été spontanées : elles ont été arrachées par les luttes et les lois. L'égalité réelle exige plus que l'égalité des droits : sans redistribution ni services publics, la liberté des plus faibles reste théorique. La solidarité est plus efficace que la charité, car elle est un droit et non une faveur. Et la société peut être améliorée par l'action collective : le fatalisme est un choix politique comme un autre.`,
        },
      },
      {
        titre: { fr: 'Ce que disent ses critiques' },
        corps: {
          fr: `Les politiques de gauche coûteraient trop cher et décourageraient l'initiative : trop d'impôts, trop de dette, trop de normes. Son égalitarisme nivellerait les mérites individuels et son étatisme étoufferait la société civile. Certaines de ses familles auraient été complaisantes envers des régimes autoritaires se réclamant du communisme. La gauche répond que les inégalités non corrigées coûtent plus cher encore, que ses conquêtes sociales sont aujourd'hui défendues par tous les camps, et que les crimes commis au nom du communisme ont été condamnés par la plupart de ses courants — le débat est ancien et toujours ouvert.`,
        },
      },
      {
        titre: { fr: 'Exemples concrets' },
        corps: {
          fr: `Le Front populaire de 1936 : congés payés (deux semaines à l'époque) et semaine de 40 heures, négociés lors des accords Matignon — la réforme sociale par la loi et le rapport de force. L'abolition de la peine de mort (1981), portée par Robert Badinter. Les 35 heures, la couverture maladie universelle et le PACS sous le gouvernement Jospin (1998-2000). Mais aussi le tournant de la rigueur de 1983 et un montant record de privatisations sous ce même gouvernement Jospin : la gauche au pouvoir n'a pas toujours fait ce que son discours laissait attendre — comme tous les camps.`,
        },
      },
    ],
  },

  // ── Cartographie des gauches (rendue en tête du N3, chaque carte ouvre sa section) ──
  carteTitre: { fr: `La carte des gauches — cliquez pour ouvrir` },
  carte: [
    { id: 'gauche-revolutionnaire', nom: { fr: 'Révolutionnaire / communiste' }, resume: { fr: `Sortir du capitalisme — par la révolution hier, par la lutte sociale aujourd'hui.` } },
    { id: 'gauche-socialiste', nom: { fr: 'Socialiste' }, resume: { fr: `Transformer la société en profondeur, mais par les élections et les lois.` } },
    { id: 'gauche-social-democrate', nom: { fr: 'Social-démocrate' }, resume: { fr: `Le compromis : accepter le marché, négocier la protection sociale.` } },
    { id: 'gauche-social-liberale', nom: { fr: 'Social-libérale' }, resume: { fr: `Économie de marché assumée, corrigée par l'égalité des chances.` } },
    { id: 'gauche-ecologiste', nom: { fr: 'Écologiste' }, resume: { fr: `Les limites planétaires d'abord : transformer l'économie pour rester vivable.` } },
    { id: 'gauche-radicale', nom: { fr: 'Radicale / insoumise' }, resume: { fr: `La rupture par les urnes : affronter les puissances économiques et les traités.` } },
    { id: 'gauche-libertaire', nom: { fr: 'Libertaire' }, resume: { fr: `Ni Dieu ni maître : méfiance envers tout pouvoir, y compris l'État.` } },
    { id: 'gauche-republicaine', nom: { fr: 'Républicaine-souverainiste' }, resume: { fr: `La République sociale et laïque, dans le cadre de la nation.` } },
  ],

  // ── N3 — Tout comprendre (sections repliables) ──────────────────────────────
  level3: {
    sections: [
      {
        id: 'origines',
        sources: [{ label: `Jacques Julliard, Les Gauches françaises (1762-2012), Flammarion, 2012`, year: 2012 }, { label: `Michel Winock, La Gauche en France, Perrin`, year: 2006 }],
        titre: { fr: `D'où vient la gauche ?` },
        corps: {
          fr: `Été 1789 : à l'Assemblée constituante, on débat du droit de veto du roi. Ses adversaires se regroupent à gauche du président de séance, ses partisans à droite. Le placement devient une habitude, puis une identité politique.\n\nAu XIXe siècle, « la gauche », c'est d'abord le camp républicain : suffrage universel, école, séparation des Églises et de l'État. Puis la révolution industrielle fait naître la question sociale et le mouvement ouvrier : le socialisme devient la seconde matrice de la gauche, avec ses propres divisions — réforme ou révolution. En 1905, les courants socialistes s'unifient dans la SFIO, autour notamment de Jean Jaurès ; en décembre 1920, le congrès de Tours la coupe en deux : la majorité rejoint l'Internationale communiste (le futur Parti communiste français), la minorité, derrière Léon Blum, garde la « vieille maison » socialiste.\n\nLes historiens des gauches — Winock, Julliard, Becker et Candar — insistent tous sur ce pluriel : gauche républicaine, socialiste, communiste, libertaire ne sont pas des nuances d'une même doctrine, mais des familles distinctes, alliées ou rivales selon les époques.`,
        },
      },
      {
        id: 'vision-etre-humain',
        titre: { fr: `Sa vision de l'être humain` },
        corps: {
          fr: `La gauche hérite du pari des Lumières : l'être humain est perfectible, et ses défauts apparents — violence, égoïsme, ignorance — tiennent moins à sa nature qu'aux conditions dans lesquelles il vit. Changez la société, et vous changerez les comportements : c'est le fondement de la confiance de la gauche dans l'école, la culture et la loi.\n\nDeuxième idée structurante : l'individu n'est pas seul responsable de son sort. Naissance, milieu, santé, conjoncture pèsent sur les trajectoires ; parler uniquement de mérite, c'est ignorer les points de départ. D'où la méfiance de la gauche envers les discours qui expliquent la pauvreté par la paresse. Ses critiques y voient un risque symétrique : à trop insister sur les déterminismes, on déresponsabiliserait les individus. Ce débat — part du choix, part du contexte — est l'un des plus profonds entre gauche et droite.`,
        },
      },
      {
        id: 'vision-societe',
        titre: { fr: 'Sa vision de la société' },
        corps: {
          fr: `Pour la gauche, la société n'est pas un ordre naturel à préserver : c'est une construction, traversée par des rapports de force — entre classes sociales pour la tradition socialiste, entre dominants et dominés au sens large pour les gauches plus récentes (rapports entre hommes et femmes, discriminations liées à l'origine). La politique sert précisément à corriger ces rapports de force par le droit.\n\nLes gauches divergent sur le conflit central : pour les marxistes, tout part de l'économie et des classes ; pour d'autres, les dominations sont multiples et ne se réduisent pas au capital. Ce débat — souvent résumé par l'opposition entre « question sociale » et « questions sociétales » — traverse la gauche contemporaine, certains lui reprochant d'avoir délaissé les classes populaires au profit des causes de société, d'autres répondant que les deux combats sont indissociables.`,
        },
      },
      {
        id: 'vision-etat',
        titre: { fr: `Sa conception de l'État` },
        corps: {
          fr: `Pour la plus grande partie de la gauche, l'État est l'instrument principal de l'égalité : lui seul peut redistribuer les richesses, garantir des services publics identiques pour tous, protéger les faibles contre les forts. D'où les politiques récurrentes de la gauche au pouvoir : impôt progressif, nationalisations (1936, 1945, 1981), statuts protecteurs, services publics étendus.\n\nMais la gauche n'est pas unanimement étatiste : la tradition libertaire et une partie de l'autogestion (très vivante dans les années 1970, notamment autour de la « deuxième gauche » de Michel Rocard) se méfient de l'État central et préfèrent les coopératives, les syndicats, les associations. Et la gauche sociale-libérale accepte un État plus modeste, qui équipe les individus plutôt qu'il n'administre l'économie.\n\nQuand vous entendez « la gauche, c'est toujours plus d'État », vous entendez donc une tendance réelle — mais pas une loi : une partie de la gauche a construit sa pensée contre la toute-puissance de l'État.`,
        },
      },
      {
        id: 'vision-economie',
        sources: [{ label: `Vie-publique.fr — nationalisations de 1982 et politique économique 1981-1983`, url: 'https://www.vie-publique.fr', year: 2025 }],
        titre: { fr: `Sa vision de l'économie` },
        corps: {
          fr: `Le socle commun : la richesse est produite collectivement — par le travail autant que par le capital — et sa répartition est une question politique, pas un simple résultat du marché. D'où l'impôt progressif, le salaire minimum, le droit du travail, la réduction du temps de travail (40 heures en 1936, 39 heures et cinquième semaine de congés en 1982, 35 heures en 1998-2000).\n\nLes divergences sont réelles : sortir du capitalisme (gauche révolutionnaire), le transformer par la loi (gauche socialiste et radicale), le réguler par la négociation (sociale-démocratie), ou l'accepter en corrigeant ses effets (gauche sociale-libérale). L'histoire au pouvoir illustre ces tensions : nationalisations massives en 1981-1982, puis tournant de la rigueur dès mars 1983 ; et le gouvernement Jospin (1997-2002), tout en créant les 35 heures, a procédé à des privatisations et ouvertures de capital d'un montant record — fait documenté, souvent oublié.\n\nSur la dette et les déficits, la gauche assume généralement que l'investissement public se finance, quitte à emprunter ; ses opposants y voient de la facilité budgétaire. Les deux camps ont, au pouvoir, pratiqué tour à tour relance et rigueur : le clivage des discours est plus net que celui des bilans.`,
        },
      },
      {
        id: 'liberte',
        titre: { fr: 'Sa vision de la liberté' },
        corps: {
          fr: `La gauche défend une liberté « réelle » : être libre, ce n'est pas seulement avoir des droits sur le papier, c'est avoir les moyens concrets de les exercer — se soigner, se loger, étudier, quitter un emploi ou un conjoint. Sans ces moyens, dit-elle, la liberté proclamée profite surtout à ceux qui ont déjà tout.\n\nSur les libertés publiques, la gauche revendique un héritage fort : abolition de la peine de mort (1981), dépénalisation de l'homosexualité (1982), libertés syndicales, droits de la défense. Son bilan comporte aussi des zones débattues : des lois sécuritaires votées ou prolongées par des gouvernements de gauche, et, plus loin dans l'histoire, le soutien d'une partie de la gauche communiste à l'URSS. Sur les mœurs (PACS en 1999, mariage pour tous en 2013), la gauche contemporaine est globalement unie — c'est l'un de ses rares points de consensus interne.`,
        },
      },
      {
        id: 'egalite',
        titre: { fr: `Sa vision de l'égalité` },
        corps: {
          fr: `C'est le mot central. La gauche ne se contente pas de l'égalité des droits (acquise en principe depuis 1789) ni de l'égalité des chances (que la droite met en avant) : elle vise l'égalité des conditions — réduire les écarts réels de revenus, de patrimoine, d'accès aux soins et à l'école. Son outil : la redistribution, par l'impôt et les services publics.\n\nLa critique classique : à force de corriger les résultats, on punirait l'effort et l'initiative, et l'égalisation tournerait au nivellement. La gauche répond que les inégalités de départ sont si fortes que le mérite seul ne peut les compenser — un enfant d'ouvrier et un enfant de cadre ne courent pas la même course. Corriger les places ou corriger les règles : ce désaccord avec la droite est probablement le plus structurant de la vie politique.`,
        },
      },
      {
        id: 'travail',
        titre: { fr: 'Sa vision du travail' },
        corps: {
          fr: `La gauche est née, pour une large part, du mouvement ouvrier : syndicats, grèves, conquête de droits — journée de 8 heures, congés payés, conventions collectives, comités d'entreprise. Le travail y est à la fois une valeur (c'est lui qui produit la richesse) et un terrain de lutte (contre l'exploitation, pour la dignité et la sécurité de l'emploi).\n\nDeux sensibilités coexistent : celle qui veut revaloriser le travail — salaires, conditions, reconnaissance — et celle qui veut en libérer du temps — réduction du temps de travail, retraite plus tôt, droit à la paresse revendiqué par certains par provocation. Les 35 heures (lois Aubry, 1998-2000) restent l'emblème contesté de cette seconde ligne : progrès social pour leurs défenseurs, handicap économique pour leurs adversaires — le débat n'est pas clos, y compris à gauche.`,
        },
      },
      {
        id: 'nation',
        titre: { fr: 'Sa vision de la nation' },
        corps: {
          fr: `Le rapport de la gauche à la nation est plus riche que le cliché ne le dit. Historiquement, la nation est une idée de gauche : celle de 1789 et de Valmy, la nation des citoyens contre les rois. Jaurès tenait ensemble patriotisme et internationalisme : défendre la nation, c'est défendre le cadre où les droits sociaux se conquièrent.\n\nMais la gauche porte aussi une tradition internationaliste : les travailleurs de tous les pays auraient plus en commun entre eux qu'avec leurs bourgeoisies nationales. Et une tradition de méfiance envers le nationalisme, associé aux guerres et à l'exclusion. Aujourd'hui, ces héritages coexistent : gauche républicaine attachée à la souveraineté nationale (Jean-Pierre Chevènement en fut la figure), gauches européistes, gauches altermondialistes. La distinction clé reste la même qu'à droite : patriotisme civique (la nation définie par la citoyenneté) contre nationalisme identitaire — la gauche revendique le premier et combat le second.`,
        },
      },
      {
        id: 'europe',
        sources: [{ label: `Résultats officiels du référendum du 29 mai 2005 (Conseil constitutionnel) : « non » 54,67 %`, url: 'https://www.conseil-constitutionnel.fr', year: 2005 }],
        titre: { fr: `Sa vision de l'Europe` },
        corps: {
          fr: `La gauche est divisée sur l'Europe depuis des décennies — au moins autant que la droite. Une partie y voit l'échelle pertinente du progrès : paix, droits sociaux harmonisés, transition écologique, puissance face aux géants mondiaux. C'est la ligne dominante du PS depuis Jacques Delors, président de la Commission européenne de 1985 à 1995, et celle des écologistes, plutôt fédéralistes.\n\nUne autre partie voit dans les traités européens une machine à verrouiller les politiques libérales : concurrence érigée en règle, contraintes budgétaires, monnaie commune sans harmonisation sociale. Le référendum de 2005 sur le traité constitutionnel européen a mis cette fracture en pleine lumière : le « non » l'emporte à 54,67 %, porté notamment par une partie de la gauche — dont Laurent Fabius, figure du PS — contre la position officielle de son propre parti. Cette blessure ne s'est jamais refermée : aujourd'hui, la gauche va des fédéralistes convaincus à ceux qui prônent la désobéissance aux traités, l'essentiel se jouant entre « changer l'Europe de l'intérieur » et « la contraindre par le rapport de force ».`,
        },
      },
      {
        id: 'laicite',
        sources: [{ label: `Loi du 9 décembre 1905 concernant la séparation des Églises et de l'État (Légifrance)`, url: 'https://www.legifrance.gouv.fr', year: 1905 }],
        titre: { fr: `Sa position sur la laïcité` },
        corps: {
          fr: `La laïcité est une conquête de la gauche : la loi de 1905 séparant les Églises et l'État a été portée par le camp républicain et socialiste — Aristide Briand en fut le rapporteur, Jaurès un artisan décisif d'une version d'apaisement plutôt que de revanche anticléricale. Pendant un siècle, être de gauche et être laïque allaient de soi.\n\nPourquoi la gauche est-elle aujourd'hui divisée sur ce sujet ? Parce que deux lectures de la même laïcité s'y affrontent. La première, dite universaliste ou stricte, veut limiter la visibilité des signes religieux dans certains espaces (école, services publics) au nom de la neutralité et de l'émancipation — elle a soutenu la loi de 2004 sur les signes religieux à l'école. La seconde estime que la laïcité de 1905 garantit d'abord la liberté de croire et de manifester sa religion, et que son durcissement viserait en pratique surtout les musulmans, au risque de nourrir les discriminations. Chaque camp accuse l'autre de trahir la laïcité — c'est l'un des débats internes les plus vifs de la gauche contemporaine, et il traverse les partis plus qu'il ne les sépare.`,
        },
      },
      {
        id: 'immigration',
        titre: { fr: `Sa position sur l'immigration` },
        corps: {
          fr: `Tendance générale : la gauche défend les droits des étrangers présents (régularisations, accès aux soins, lutte contre les discriminations) et une politique d'asile protectrice. Mais l'idée qu'être de gauche impliquerait d'être pour l'ouverture des frontières est une simplification que l'histoire dément.\n\nLes divisions sont anciennes et documentées : dans les années 1970-1980, une partie de la gauche communiste et syndicale défendait l'arrêt de l'immigration de travail au nom de la protection des salariés — Georges Marchais, secrétaire général du PCF, prend publiquement cette position en 1980, et des municipalités communistes sont alors impliquées dans des épisodes controversés. À l'inverse, d'autres courants — chrétiens de gauche, droits-de-l'homme, gauche morale — ont fait de l'accueil un marqueur. Les gouvernements de gauche ont eux-mêmes alterné : régularisations (1981-1982, 1997) mais aussi lois de maîtrise des flux et expulsions.\n\nAujourd'hui, le débat persiste entre une ligne humaniste et universaliste, majoritaire dans les discours, et une ligne qui insiste sur la régulation et l'intégration, au nom des classes populaires. Peut-on être de gauche et favorable à une immigration réduite ? La position existe, hier comme aujourd'hui — elle est minoritaire mais réelle.`,
        },
      },
      {
        id: 'ecologie',
        titre: { fr: `Sa position sur l'écologie` },
        corps: {
          fr: `L'écologie politique française s'est construite majoritairement à gauche, mais tardivement et non sans frictions. Le mouvement ouvrier historique était productiviste : produire plus pour redistribuer plus, l'industrie comme horizon. L'écologie, née dans les années 1970 (René Dumont, premier candidat écologiste à la présidentielle en 1974), a d'abord contesté ce productivisme — y compris celui de la gauche.\n\nLa jonction s'est faite progressivement : les Verts participent à la gauche plurielle de Jospin (1997-2002), puis l'urgence climatique pousse toute la gauche à intégrer l'écologie — la gauche radicale parle de « planification écologique », les socialistes de transition juste, les écologistes gardant la primauté du sujet. Des tensions demeurent : le nucléaire (les écologistes historiquement contre, une partie de la gauche pour, au nom du climat et de l'emploi), la croissance (faut-il la verdir ou en sortir ?), et l'articulation entre fin du monde et fin du mois, que le mouvement des Gilets jaunes (2018) a posée à tous les camps.`,
        },
      },
      {
        id: 'gauche-revolutionnaire',
        titre: { fr: 'La gauche révolutionnaire et communiste' },
        corps: {
          fr: `Son idée fondatrice : le capitalisme ne peut pas être durablement corrigé — il faut en sortir, par la révolution pour la tradition léniniste, par la conquête des pouvoirs et la socialisation des moyens de production pour d'autres. En France, elle a été incarnée massivement par le Parti communiste français, né de la scission du congrès de Tours (décembre 1920) et longtemps premier parti de gauche : Georges Marchais obtient encore 15,35 % à la présidentielle de 1981.\n\nLe PCF a profondément marqué le pays — municipalités, CGT, ministres en 1936 (soutien), 1944-1947, 1981-1984, 1997-2002 — mais son lien historique avec l'URSS lui a coûté : le déclin s'amorce dans les années 1980 et ne s'est jamais inversé (Fabien Roussel, 2,28 % à la présidentielle de 2022). À sa gauche subsistent des organisations trotskistes (Lutte ouvrière, le NPA) qui, elles, relèvent de l'extrême gauche au sens strict : refus de gérer les institutions, perspective révolutionnaire assumée. La section « Gauche et extrême gauche » détaille cette distinction.`,
        },
      },
      {
        id: 'gauche-socialiste',
        titre: { fr: 'La gauche socialiste' },
        corps: {
          fr: `Sa conviction : on peut transformer la société en profondeur sans révolution, par le suffrage universel, la loi et l'impôt. C'est la ligne de Jaurès — unifier socialisme et République — puis de Blum, qui théorise la différence entre « conquête du pouvoir » (changer de société) et « exercice du pouvoir » (gouverner dans le cadre existant, comme en 1936).\n\nLe Parti socialiste actuel naît au congrès d'Épinay (1971), quand François Mitterrand en prend la tête avec une stratégie d'union de la gauche — le programme commun signé avec le PCF en 1972, rompu en 1977. La victoire du 10 mai 1981 est son sommet historique : nationalisations, retraite à 60 ans, cinquième semaine de congés payés, abolition de la peine de mort. Puis le tournant de la rigueur de mars 1983 ouvre la question qui la hante depuis : gouverner dans l'économie de marché, est-ce la transformer ou s'y rallier ? L'effondrement de 2017 (6,36 % pour Benoît Hamon à la présidentielle) a laissé cette famille affaiblie mais toujours structurante, notamment dans les collectivités locales.`,
        },
      },
      {
        id: 'gauche-social-democrate',
        titre: { fr: 'La gauche sociale-démocrate' },
        corps: {
          fr: `Historiquement, la social-démocratie désigne les partis ouvriers d'Europe du Nord qui ont choisi le compromis : accepter l'économie de marché et la propriété privée, en échange d'une protection sociale très développée, négociée entre syndicats puissants et patronat. Le modèle suédois ou allemand (le SPD renonce officiellement au marxisme au congrès de Bad Godesberg, en 1959) en est l'illustration.\n\nEn France, le mot a longtemps été péjoratif à gauche — synonyme de renoncement — et la social-démocratie n'a jamais existé sous sa forme nordique, faute de syndicats de masse. Dans les faits, le PS de gouvernement (Michel Rocard, Jacques Delors, Lionel Jospin puis François Hollande, qui assume le terme en 2014) a mené des politiques de type social-démocrate : redistribution forte, mais dans le cadre du marché et de l'Union européenne. La distinction entre « socialiste » et « social-démocrate » est donc en France une affaire de degré et de revendication plus que de frontière nette.`,
        },
      },
      {
        id: 'gauche-social-liberale',
        titre: { fr: 'La gauche sociale-libérale' },
        corps: {
          fr: `Elle assume pleinement l'économie de marché et la mondialisation, et concentre l'action publique sur l'égalité des chances : éducation, formation, mobilité sociale, filets de sécurité — plutôt que sur la propriété publique ou l'encadrement des salaires. Ses références internationales : le New Labour de Tony Blair, les démocrates américains de Bill Clinton, l'« agenda 2010 » du SPD de Gerhard Schröder.\n\nEn France, cette sensibilité a existé au sein du PS (une partie de la « deuxième gauche » rocardienne, puis l'aile réformatrice des années 2000-2010) sans jamais s'y imposer ouvertement. L'élection d'Emmanuel Macron en 2017 — venu de la gauche sociale-libérale, ministre de François Hollande — a siphonné une grande partie de cet électorat vers le bloc central, ce qui alimente un débat non tranché : le macronisme est-il un prolongement de la gauche sociale-libérale ou une sortie de la gauche ? La plupart des politistes classent aujourd'hui le bloc présidentiel au centre ou au centre-droit — la question reste discutée.`,
        },
      },
      {
        id: 'gauche-ecologiste',
        titre: { fr: 'La gauche écologiste' },
        corps: {
          fr: `Son point de départ n'est pas la répartition des richesses mais les limites de la planète : climat, biodiversité, ressources. Elle en tire une conséquence économique radicale à sa manière : la croissance matérielle infinie est impossible, il faut transformer la production, les transports, l'agriculture — et répartir l'effort de façon juste, sans quoi la transition sera rejetée.\n\nOrganisée en parti depuis 1984 (Les Verts, devenus EELV puis Les Écologistes), elle a participé au gouvernement de la gauche plurielle (1997-2002) et dirige plusieurs grandes villes depuis 2020 (Lyon, Bordeaux, Strasbourg…). Ses scores nationaux restent en deçà de ses scores européens et municipaux — l'élection présidentielle lui est structurellement difficile. Ses débats internes recoupent ceux de toute la gauche : alliance ou autonomie vis-à-vis des autres partis, radicalité ou gouvernement, nucléaire, rapport à la croissance. Sa singularité : elle est la seule famille de gauche dont le cœur doctrinal n'est pas né du mouvement ouvrier.`,
        },
      },
      {
        id: 'gauche-radicale',
        titre: { fr: 'La gauche radicale (dite « insoumise »)' },
        corps: {
          fr: `Elle veut la rupture — avec le libéralisme économique, les traités européens actuels, la Ve République — mais par les élections, pas par la révolution : c'est ce qui la distingue de l'extrême gauche au sens strict. En France, elle est incarnée principalement par La France insoumise, fondée en 2016 par Jean-Luc Mélenchon (19,58 % à la présidentielle de 2017, 21,95 % en 2022, premier candidat de gauche les deux fois).\n\nSon programme type : hausse massive des salaires et de l'impôt sur les hauts revenus, planification écologique, VIe République, désobéissance aux règles européennes jugées contraires au programme. Sa stratégie assume la conflictualité — contre les « oligarchies », les médias dominants, parfois les institutions elles-mêmes — ce que ses adversaires qualifient de populisme et que ses défenseurs revendiquent comme le retour du conflit en politique. La plupart des politistes la classent « gauche radicale » et non « extrême gauche » ; la section dédiée explique ces critères. Ses relations avec le reste de la gauche oscillent entre union électorale (NUPES en 2022, Nouveau Front populaire en 2024) et rivalité assumée pour l'hégémonie.`,
        },
      },
      {
        id: 'gauche-libertaire',
        titre: { fr: 'La gauche libertaire' },
        corps: {
          fr: `Elle refuse la domination sous toutes ses formes — du capital, mais aussi de l'État, des Églises, des bureaucraties, y compris celles des partis de gauche. Héritière de l'anarchisme du XIXe siècle (Proudhon, Bakounine) et du syndicalisme révolutionnaire de la CGT des origines (charte d'Amiens, 1906), elle privilégie l'action directe, l'autogestion, les coopératives et la démocratie par en bas.\n\nElle n'a jamais été un grand courant électoral — c'est cohérent avec sa méfiance envers le pouvoir — mais son influence culturelle est réelle : Mai 68, le mouvement autogestionnaire des années 1970 (les horlogers de Lip), une partie de l'écologie radicale (zones à défendre), les mouvements féministes et antiracistes autonomes. Beaucoup d'idées nées à la marge libertaire — assemblée générale, horizontalité, méfiance envers les chefs — ont diffusé dans toute la gauche contemporaine. La retenir permet de comprendre que « gauche » ne veut pas dire « étatiste » : sur l'État, libertaires et communistes ont été des adversaires acharnés.`,
        },
      },
      {
        id: 'gauche-republicaine',
        titre: { fr: 'La gauche républicaine-souverainiste' },
        corps: {
          fr: `Sa matrice n'est pas Marx mais la République : l'école publique, la laïcité, la citoyenneté, la nation comme cadre de la solidarité. Héritière du radicalisme de la IIIe République (Clemenceau, puis le parti radical, pilier des coalitions de gauche jusqu'aux années 1950) et du jacobinisme, elle considère que les droits sociaux ne se défendent que là où le peuple peut trancher : dans la nation.\n\nD'où son souverainisme : méfiance envers les transferts de compétences à l'Union européenne, défense des services publics nationaux, attachement à une laïcité stricte. Jean-Pierre Chevènement en a été la figure contemporaine — quitte à quitter le gouvernement (1983, 1991, 2000) pour rester fidèle à ses positions. Sans grand parti dédié aujourd'hui, cette sensibilité irrigue plusieurs formations, du PS à la gauche radicale, et alimente les débats internes sur l'Europe, la laïcité et l'immigration. Elle rappelle une chose que la carte politique brouille souvent : la souveraineté n'appartient à aucun camp — il existe des souverainistes de gauche comme de droite.`,
        },
      },
      {
        id: 'gauche-vs-extreme-gauche',
        sources: [{ label: `Jean-Jacques Becker, Gilles Candar (dir.), Histoire des gauches en France, La Découverte, 2004`, year: 2004 }, { label: `Vie-publique.fr — fiches sur les familles politiques et les candidatures présidentielles`, url: 'https://www.vie-publique.fr', year: 2025 }],
        titre: { fr: 'Gauche et extrême gauche : quelle différence ?' },
        corps: {
          fr: `Comme à droite, la question mérite des critères plutôt que des étiquettes lancées comme des injures. Les politistes en utilisent principalement trois : 1) le rapport aux institutions — cherche-t-on à gagner les élections et à gouverner dans le cadre constitutionnel, ou considère-t-on que ce cadre lui-même doit être renversé ? ; 2) le projet économique — transformer profondément le capitalisme, ou en sortir par la rupture révolutionnaire ; 3) l'histoire et la culture du mouvement — filiation trotskiste ou anarchiste, refus de participer aux gouvernements.\n\nSur ces critères, l'extrême gauche française au sens strict désigne les organisations révolutionnaires : Lutte ouvrière, le Nouveau Parti anticapitaliste, héritiers du trotskisme, qui se présentent aux élections pour porter leurs idées mais ne cherchent pas à gérer les institutions. La France insoumise, elle, est classée « gauche radicale » par la plupart des politistes : elle veut une rupture profonde (VIe République, désobéissance à certains traités), mais par les urnes et pour gouverner. Ce classement est contesté dans le débat public — une partie des commentateurs et des adversaires de LFI la qualifie d'extrême gauche, en invoquant sa conflictualité et certaines de ses positions. Poliscop présente l'état du débat : le classement « gauche radicale » est majoritaire dans la littérature scientifique, sa contestation est réelle dans le débat politique, et la frontière fait elle-même l'objet de travaux — le verdict n'est pas tranché pour tout le monde.`,
        },
      },
      {
        id: 'debats-internes',
        titre: { fr: 'Les débats internes' },
        corps: {
          fr: `Quatre débats traversent la gauche en permanence. Gouverner dans le marché ou le contester : depuis le tournant de la rigueur de mars 1983, chaque génération rejoue la même question — la gauche au pouvoir doit-elle s'adapter aux contraintes économiques ou les affronter ? Union ou autonomie : de l'union de la gauche de Mitterrand à la NUPES et au Nouveau Front populaire, l'union fait gagner mais exige des compromis que chaque famille vit comme des renoncements — et la question de qui dirige l'union (socialistes hier, insoumis aujourd'hui ?) est explosive. La laïcité : deux lectures de la loi de 1905 s'affrontent (voir la section dédiée). L'Europe : changer l'UE de l'intérieur ou désobéir aux traités (voir la section dédiée).\n\nCes tensions ne sont pas des anomalies : elles reflètent des familles réellement distinctes. Pour les historiens des gauches (Winock, Julliard, Becker et Candar), l'unité de la gauche française a toujours été l'exception — des moments (1936, 1981, 1997, 2024) plutôt qu'un état durable.`,
        },
      },
      {
        id: 'evolutions-historiques',
        sources: [{ label: `Michel Winock, La Gauche en France, Perrin`, year: 2006 }, { label: `Résultats officiels des élections présidentielles (Conseil constitutionnel)`, url: 'https://www.conseil-constitutionnel.fr', year: 2022 }],
        titre: { fr: 'Les grandes évolutions historiques' },
        corps: {
          fr: `XIXe siècle : la gauche, c'est d'abord la République — contre les monarchies, puis pour l'école et la laïcité. La question sociale fait émerger le socialisme, unifié en 1905 dans la SFIO. L'assassinat de Jaurès, le 31 juillet 1914, à la veille de la guerre, prive la gauche de sa figure majeure ; le congrès de Tours (décembre 1920) la coupe en deux pour soixante-dix ans : communistes contre socialistes.\n\n1936 : le Front populaire (Blum) — congés payés, 40 heures, accords Matignon. 1944-1945 : à la Libération, la gauche pèse fortement dans les réformes du programme du CNR (Sécurité sociale, nationalisations), au sein d'un gouvernement d'union dirigé par de Gaulle. Puis la SFIO gouverne au centre, s'use dans les guerres coloniales, et décline. 1971 : Mitterrand prend le nouveau Parti socialiste à Épinay et fait le pari de l'union avec le PCF (programme commun, 1972). 10 mai 1981 : première victoire présidentielle de la gauche sous la Ve République ; mars 1983 : le tournant de la rigueur referme la parenthèse de la relance. 1997-2002 : la gauche plurielle de Jospin (35 heures, CMU, PACS — et privatisations record). 21 avril 2002 : Jospin éliminé au premier tour — traumatisme durable. 2005 : le « non » de gauche au référendum européen fracture le PS. 2012-2017 : le quinquennat Hollande s'achève sur l'éclatement — Macron capte l'aile sociale-libérale, le PS s'effondre (6,36 % en 2017), Mélenchon devient la première force de gauche (19,58 %, puis 21,95 % en 2022). 2022-2024 : la NUPES puis le Nouveau Front populaire (arrivé en tête en sièges de bloc aux législatives de 2024) rejouent l'union — sans trancher la question du leadership ni celle de la ligne.`,
        },
      },
      {
        id: 'figures',
        titre: { fr: 'Les principales figures françaises' },
        corps: {
          fr: `Jean Jaurès — fondateur du socialisme républicain français, unificateur de 1905, assassiné le 31 juillet 1914 ; référence revendiquée aujourd'hui par presque tous les camps. Léon Blum — la « vieille maison » socialiste au congrès de Tours, président du Conseil du Front populaire en 1936. Ambroise Croizat — ministre communiste du Travail à la Libération, artisan de la mise en place de la Sécurité sociale. Pierre Mendès France — président du Conseil 1954-1955, figure de l'exigence morale en politique, référence de la « deuxième gauche ». Guy Mollet — SFIO de gouvernement, dont le rôle dans la guerre d'Algérie reste un passif débattu. François Mitterrand — l'union de la gauche, le 10 mai 1981, deux septennats (voir la fiche dédiée). Michel Rocard — la « deuxième gauche », décentralisatrice et autogestionnaire, Premier ministre 1988-1991. Jacques Delors — la gauche européenne, président de la Commission 1985-1995. Lionel Jospin — la gauche plurielle, Premier ministre 1997-2002. Martine Aubry — les 35 heures. Robert Badinter — l'abolition de la peine de mort (1981). Ségolène Royal, François Hollande — le PS des années 2000-2010 (voir la fiche Hollande). Jean-Luc Mélenchon — la gauche radicale contemporaine. Aujourd'hui : Olivier Faure (PS), Marine Tondelier (Les Écologistes), Fabien Roussel (PCF), Raphaël Glucksmann (Place publique), François Ruffin, Clémentine Autain… Ne rangez jamais toutes ces personnes dans « la même gauche » : plusieurs d'entre elles se sont combattues toute leur vie.`,
        },
      },
      {
        id: 'partis',
        titre: { fr: 'Les partis associés' },
        corps: {
          fr: `Le Parti socialiste (PS) — héritier de la SFIO (1905) via le congrès d'Épinay (1971) ; parti dominant de la gauche de 1981 à 2017, effondré depuis, mais toujours puissant dans les collectivités locales. Le Parti communiste français (PCF) — né du congrès de Tours (1920), premier parti de gauche jusqu'aux années 1970, en déclin électoral depuis. La France insoumise (LFI) — fondée en 2016, première force électorale de la gauche depuis 2017, classée gauche radicale par la plupart des politistes. Les Écologistes (ex-EELV) — l'écologie politique organisée depuis 1984. Génération.s — fondé par Benoît Hamon en 2017. Place publique — fondé en 2018, allié au PS aux européennes (Raphaël Glucksmann). À l'extrême gauche au sens strict : Lutte ouvrière et le NPA, organisations révolutionnaires qui ne cherchent pas à gouverner.\n\nCes partis se sont unis dans la NUPES (2022) puis le Nouveau Front populaire (2024) — des coalitions électorales, pas des fusions : chaque fiche parti détaillera généalogie, électorat, et l'écart éventuel entre discours et action au pouvoir.`,
        },
      },
      {
        id: 'critiques',
        titre: { fr: 'Les critiques qui lui sont adressées' },
        corps: {
          fr: `Critique économique : ses politiques coûteraient trop cher (dépense publique, dette), décourageraient l'investissement et l'emploi (impôts, 35 heures), et auraient échoué à endiguer le chômage de masse. Critique libérale : son étatisme restreindrait les libertés économiques et étoufferait l'initiative. Critique historique : une partie de la gauche a soutenu l'URSS bien après la connaissance des crimes staliniens — un passif que le PCF a mis des décennies à solder. Critique démocratique et sociale, venue parfois de sa propre base : la gauche de gouvernement aurait trahi ses promesses (1983, privatisations sous Jospin, quinquennat Hollande), et ses élites seraient devenues sociologiquement éloignées des classes populaires, qui se sont massivement abstenues ou tournées vers d'autres votes.\n\nSes réponses : les conquêtes sociales qu'elle a portées (retraites, congés payés, assurance maladie, SMIC) sont devenues des acquis que plus personne ne propose d'abolir ; la dette sert aussi à financer l'avenir ; les compromis du pouvoir ne sont pas des trahisons mais le prix du réel ; et la condamnation du stalinisme est acquise dans la quasi-totalité de la gauche actuelle. À chacun de juger — cette fiche vous donne les arguments, pas le verdict.`,
        },
      },
      {
        id: 'idees-recues',
        titre: { fr: 'Les idées reçues' },
        corps: {
          fr: `« La gauche a créé la Sécurité sociale » : partiellement vrai — les ordonnances de 1945 sont l'œuvre d'un gouvernement d'union dirigé par de Gaulle, sur le programme du CNR, avec un ministre communiste (Ambroise Croizat) à la manœuvre ; rôle central de la gauche, mais pas exclusif. « Être de gauche, c'est être pour l'ouverture des frontières » : faux — les divisions sur l'immigration sont historiques et documentées (voir la section dédiée). « La gauche n'a jamais mené de politique de rigueur » : faux — le tournant de mars 1983 et les privatisations record du gouvernement Jospin le démentent. « La gauche, c'est les fonctionnaires et les assistés » : son électorat est plus divers — et une partie des classes populaires vote aujourd'hui ailleurs, ce qui est précisément l'un de ses problèmes stratégiques. « Gauche = extrême gauche » : voir la section dédiée aux critères.\n\nLes affirmations de ce type sont traitées une par une, avec sources, dans le module « Vrai ou faux ? » en bas de page.`,
        },
      },
      {
        id: 'international',
        titre: { fr: `Ses équivalents à l'étranger` },
        corps: {
          fr: `Les étiquettes ne se transposent jamais exactement. Le SPD allemand est la social-démocratie type : compromis avec le marché assumé depuis 1959, syndicats puissants, culture de coalition — y compris avec la droite. Le Labour britannique est né des syndicats plus que du marxisme, et a oscillé entre aile gauche et « New Labour » blairiste. Le Parti démocrate américain n'est pas un parti de gauche au sens européen : c'est une coalition très large, dont l'aile gauche (Bernie Sanders) serait proche de la gauche française, mais dont le centre de gravité est plus favorable au marché que la plupart des droites européennes sur certains sujets — un démocrate américain trouverait la gauche française très étatiste, et l'inverse est vrai.\n\nCes comparaisons servent surtout à comprendre une singularité française : le poids historique du Parti communiste et la faiblesse des syndicats de masse ont donné à la gauche française une culture plus conflictuelle et plus étatiste que celle de ses voisines du Nord — et une méfiance durable envers le mot même de « social-démocratie ».`,
        },
      },
    ],
  },

  // ── N4 — Pour aller encore plus loin ────────────────────────────────────────
  level4: {
    items: [
      { kind: 'discours', titre: { fr: `Discours à la jeunesse — Jean Jaurès, Albi, 1903` }, note: { fr: `Le courage, la paix, la République sociale : le texte le plus cité de Jaurès, prononcé au lycée d'Albi.` }, url: 'https://www.vie-publique.fr' },
      { kind: 'discours', titre: { fr: `Déclaration ministérielle de Léon Blum — juin 1936` }, note: { fr: `Le programme du Front populaire présenté au Parlement, dans la foulée des grèves et des accords Matignon.` }, url: 'https://www.vie-publique.fr' },
      { kind: 'discours', titre: { fr: `Discours de Robert Badinter à l'Assemblée nationale — 17 septembre 1981` }, note: { fr: `La défense de l'abolition de la peine de mort — déjà cité dans la fiche Mitterrand, et à lire en entier.` }, url: 'https://www.assemblee-nationale.fr' },
      { kind: 'discours', titre: { fr: `Discours du Bourget — François Hollande, 22 janvier 2012` }, note: { fr: `Le discours de campagne le plus commenté du quinquennat à venir, notamment pour son passage sur la finance — à comparer ensuite avec l'action au pouvoir.` }, url: 'https://www.vie-publique.fr' },
      { kind: 'biblio', titre: { fr: `Michel Winock, La Gauche en France — Perrin` }, note: { fr: `La synthèse de référence d'un des grands historiens du sujet : cultures, familles, moments de la gauche française.` } },
      { kind: 'biblio', titre: { fr: `Jacques Julliard, Les Gauches françaises (1762-2012) — Flammarion, 2012` }, note: { fr: `Une somme : histoire, politique et imaginaire des gauches, avec une typologie des familles devenue classique.` } },
      { kind: 'lien', titre: { fr: `Vie-publique.fr — dossiers « vie politique » et fiches sur les partis` }, note: { fr: `La documentation publique de référence, gratuite et sourcée.` }, url: 'https://www.vie-publique.fr' },
    ],
  },

  // ── Chronologie interactive ──────────────────────────────────────────────────
  chronologie: {
    titre: { fr: `Deux siècles de gauches françaises` },
    events: [
      { date: '1789', titre: { fr: `Naissance des mots « gauche » et « droite »` }, detail: { fr: `À l'Assemblée constituante, les adversaires du veto royal se placent à gauche du président de séance. Une habitude de placement devient une identité politique.` } },
      { date: '1905', titre: { fr: `Unification socialiste : la SFIO` }, source: { label: `Jacques Julliard, Les Gauches françaises, Flammarion, 2012`, year: 2012 }, detail: { fr: `Les courants socialistes rivaux s'unifient dans la Section française de l'Internationale ouvrière, avec Jean Jaurès pour figure majeure. La même année, la loi de séparation des Églises et de l'État couronne le combat laïque du camp républicain.` } },
      { date: '1914', titre: { fr: `L'assassinat de Jaurès` }, detail: { fr: `Le 31 juillet 1914, à la veille de la Première Guerre mondiale, Jean Jaurès est assassiné à Paris. La gauche perd la figure qui tenait ensemble socialisme, République et combat pour la paix.` } },
      { date: '1920', titre: { fr: `Le congrès de Tours coupe la gauche en deux` }, source: { label: `Jean-Jacques Becker, Gilles Candar (dir.), Histoire des gauches en France, La Découverte, 2004`, year: 2004 }, detail: { fr: `En décembre 1920, la majorité de la SFIO rejoint l'Internationale communiste — c'est la naissance du futur Parti communiste français. La minorité, derrière Léon Blum, garde la « vieille maison » socialiste. La rivalité durera soixante-dix ans.` } },
      { date: '1936', titre: { fr: `Le Front populaire` }, source: { label: `Vie-publique.fr — le Front populaire et les accords Matignon`, year: 1936 }, detail: { fr: `La coalition des gauches porte Léon Blum au pouvoir. Accords Matignon, congés payés (deux semaines à l'époque), semaine de 40 heures : l'expérience reste la matrice de la réforme sociale par la loi.` } },
      { date: '1945', titre: { fr: `La Sécurité sociale — une œuvre d'union` }, source: { label: `Vie-publique.fr — les ordonnances des 4 et 19 octobre 1945`, year: 1945 }, detail: { fr: `À la Libération, les ordonnances de 1945 créent la Sécurité sociale, sur le programme du Conseil national de la Résistance, sous un gouvernement d'union dirigé par de Gaulle, avec le ministre communiste Ambroise Croizat à la manœuvre. Rôle central de la gauche — mais pas exclusif.` } },
      { date: '1971', titre: { fr: `Le congrès d'Épinay` }, detail: { fr: `François Mitterrand prend la tête du nouveau Parti socialiste et fait le pari de l'union de la gauche pour conquérir le pouvoir. Le programme commun avec le PCF est signé en 1972 — et rompu en 1977.` } },
      { date: '1981', titre: { fr: `Le 10 mai : la gauche à l'Élysée` }, source: { label: `Conseil constitutionnel — résultats de l'élection présidentielle de 1981`, year: 1981 }, detail: { fr: `François Mitterrand est le premier président de gauche de la Ve République. Abolition de la peine de mort, retraite à 60 ans, cinquième semaine de congés payés, nationalisations. Georges Marchais (PCF) a obtenu 15,35 % au premier tour — le déclin communiste s'amorce.` } },
      { date: '1983', titre: { fr: `Le tournant de la rigueur` }, detail: { fr: `En mars 1983, face aux déficits et aux attaques contre le franc, le gouvernement choisit de rester dans le système monétaire européen et adopte un plan de rigueur. La question — gouverner dans le marché ou le contester — hante la gauche depuis (voir la fiche Mitterrand).` } },
      { date: '1997', titre: { fr: `La gauche plurielle` }, detail: { fr: `Lionel Jospin gouverne avec communistes et écologistes : 35 heures (lois Aubry, 1998-2000), couverture maladie universelle (1999), PACS (1999), emplois-jeunes — et un montant record de privatisations, fait documenté et souvent oublié.` } },
      { date: '2002', titre: { fr: `Le 21 avril` }, source: { label: `Conseil constitutionnel — résultats de l'élection présidentielle de 2002`, year: 2002 }, detail: { fr: `Lionel Jospin est éliminé au premier tour de la présidentielle, devancé par Jean-Marie Le Pen. Le choc, aggravé par la dispersion des candidatures de gauche, reste un traumatisme stratégique : l'union redevient une obsession.` } },
      { date: '2005', titre: { fr: `Le « non » de gauche au référendum européen` }, source: { label: `Conseil constitutionnel — proclamation des résultats du référendum du 29 mai 2005`, year: 2005 }, detail: { fr: `Le traité constitutionnel européen est rejeté à 54,67 %. Une partie de la gauche — dont Laurent Fabius au PS — a fait campagne pour le « non » contre la position officielle de son parti : la fracture européenne de la gauche est béante.` } },
      { date: '2017', titre: { fr: `L'effondrement du PS et la percée insoumise` }, source: { label: `Conseil constitutionnel — résultats de l'élection présidentielle de 2017`, year: 2017 }, detail: { fr: `Benoît Hamon (PS) obtient 6,36 % ; Jean-Luc Mélenchon (La France insoumise, fondée en 2016) 19,58 %. Emmanuel Macron capte l'aile sociale-libérale. Le centre de gravité de la gauche bascule vers la gauche radicale.` } },
      { date: '2022-2024', titre: { fr: `NUPES puis Nouveau Front populaire` }, source: { label: `Vie-publique.fr — les élections législatives de 2024`, year: 2024 }, detail: { fr: `Après le 21,95 % de Mélenchon à la présidentielle de 2022, la gauche s'unit aux législatives : NUPES en 2022, puis Nouveau Front populaire en 2024, arrivé en tête en sièges de bloc. L'union électorale est refaite — les questions de ligne et de leadership restent ouvertes.` } },
    ],
  },

  // ── Tableau comparatif (simplification pédagogique assumée) ──────────────────
  tableauComparatif: {
    titre: { fr: `Quatre gauches en un coup d'œil` },
    note: { fr: `Simplification pédagogique : chaque case résume une tendance dominante, pas la position de chaque personne ou parti.` },
    sources: [{ label: `Synthèse d'après Michel Winock (La Gauche en France) et Jacques Julliard (Les Gauches françaises, 2012)`, year: 2012 }],
    colonnes: [{ fr: 'Radicale' }, { fr: 'Socialiste' }, { fr: 'Social-démocrate' }, { fr: 'Écologiste' }],
    lignes: [
      { label: { fr: `L'État et l'économie` }, cells: [{ fr: `Rupture avec le libéralisme, planification` }, { fr: `Redistribution forte, marché très encadré` }, { fr: `Compromis négocié avec le marché` }, { fr: `Économie transformée par les limites planétaires` }] },
      { label: { fr: `L'Europe` }, cells: [{ fr: `Désobéir aux traités si nécessaire` }, { fr: `Réorienter l'UE de l'intérieur` }, { fr: `Approfondir l'intégration` }, { fr: `Fédéralisme et transition verte` }] },
      { label: { fr: `La laïcité` }, cells: [{ fr: `Traversée par les deux lectures` }, { fr: `Attachement historique (loi de 1905)` }, { fr: `Laïcité d'apaisement` }, { fr: `Laïcité et lutte contre les discriminations` }] },
      { label: { fr: `Le mot-clé` }, cells: [{ fr: `Rupture` }, { fr: `Égalité` }, { fr: `Compromis` }, { fr: `Limites planétaires` }] },
      { label: { fr: `Partis types` }, cells: [{ fr: `LFI, une partie du PCF` }, { fr: `PS (aile gauche), PCF historique` }, { fr: `PS (ligne gouvernementale), Place publique` }, { fr: `Les Écologistes, Génération.s` }] },
    ],
  },

  // ── Modules liés ─────────────────────────────────────────────────────────────
  vraiFaux: ['vf-gauche-secu', 'vf-gauche-frontieres', 'vf-gauche-rigueur', 'vf-gauche-riche'],

  quiz: [
    {
      question: { fr: `Que s'est-il passé au congrès de Tours, en décembre 1920 ?` },
      options: [
        { fr: `La gauche a remporté les élections législatives` },
        { fr: `La SFIO s'est coupée en deux : la majorité a fondé le futur Parti communiste, la minorité a gardé le parti socialiste` },
        { fr: `Le Front populaire a été créé` },
        { fr: `La Sécurité sociale a été votée` },
      ],
      bonneReponse: 1,
      explication: { fr: `À Tours, la majorité des délégués rejoint l'Internationale communiste (naissance du futur PCF) ; la minorité, derrière Léon Blum, garde la « vieille maison » socialiste. Cette scission structure la gauche française pendant soixante-dix ans.` },
    },
    {
      question: { fr: `Qu'a apporté le Front populaire de 1936 ?` },
      options: [
        { fr: `La retraite à 60 ans et les 35 heures` },
        { fr: `La Sécurité sociale` },
        { fr: `Les congés payés (deux semaines à l'époque) et la semaine de 40 heures, négociés lors des accords Matignon` },
        { fr: `Le droit de vote des femmes` },
      ],
      bonneReponse: 2,
      explication: { fr: `Le gouvernement de Léon Blum instaure les congés payés et la semaine de 40 heures en 1936. La retraite à 60 ans date de 1982, les 35 heures de 1998-2000, la Sécurité sociale de 1945 et le vote des femmes de 1944.` },
    },
    {
      question: { fr: `La Sécurité sociale de 1945 est-elle l'œuvre de la seule gauche ?` },
      options: [
        { fr: `Oui, elle a été créée par un gouvernement socialiste` },
        { fr: `Non, elle a été créée par la droite seule` },
        { fr: `Non : elle naît d'un gouvernement d'union dirigé par de Gaulle, sur le programme du CNR, avec un ministre communiste à la manœuvre` },
        { fr: `Elle date du Front populaire de 1936` },
      ],
      bonneReponse: 2,
      explication: { fr: `Les ordonnances d'octobre 1945 sont prises par le gouvernement provisoire d'union dirigé par de Gaulle, en application du programme du Conseil national de la Résistance ; le ministre communiste Ambroise Croizat en pilote la mise en place. La gauche y a un rôle central — mais pas exclusif.` },
    },
    {
      question: { fr: `Qu'appelle-t-on le « tournant de la rigueur » de 1983 ?` },
      options: [
        { fr: `L'abandon par la gauche au pouvoir de la politique de relance, au profit d'un plan de rigueur et du maintien dans le système monétaire européen` },
        { fr: `Une réforme du code du travail` },
        { fr: `La sortie de la France du système monétaire européen` },
        { fr: `Le passage aux 39 heures` },
      ],
      bonneReponse: 0,
      explication: { fr: `En mars 1983, face aux déficits et à la pression sur le franc, le gouvernement socialiste choisit de rester dans le système monétaire européen et adopte la rigueur budgétaire et salariale. Ce choix ouvre un débat jamais refermé à gauche : gouverner dans le marché ou le contester.` },
    },
    {
      question: { fr: `Comment la plupart des politistes classent-ils La France insoumise ?` },
      options: [
        { fr: `À l'extrême gauche, comme Lutte ouvrière` },
        { fr: `Dans la « gauche radicale » : rupture profonde revendiquée, mais par les élections et pour gouverner` },
        { fr: `Au centre gauche` },
        { fr: `Le classement scientifique est unanime et incontesté` },
      ],
      bonneReponse: 1,
      explication: { fr: `L'extrême gauche au sens strict désigne les organisations révolutionnaires qui ne cherchent pas à gérer les institutions (Lutte ouvrière, NPA). LFI veut une rupture profonde mais par les urnes : la plupart des politistes la classent « gauche radicale ». Ce classement est contesté dans le débat public — la fiche présente les critères plutôt qu'un verdict.` },
    },
  ],

  motsAssocies: ['economie-de-marche', 'dette-publique', 'proportionnelle', '49-3'],

  continuerAvec: [
    { slug: 'droite' },
    { slug: 'francois-mitterrand' },
    { slug: 'retraites' },
  ],

  figuresLiees: [
    { nom: 'Jean Jaurès', note: { fr: `socialisme républicain — fiche à venir` } },
    { nom: 'Léon Blum', note: { fr: `Front populaire — fiche à venir` } },
    { nom: 'Pierre Mendès France', note: { fr: `gauche de gouvernement, exigence morale — fiche à venir` } },
    { nom: 'François Mitterrand', note: { fr: `union de la gauche, 1981 — voir la fiche` } },
    { nom: 'Lionel Jospin', note: { fr: `gauche plurielle — fiche à venir` } },
    { nom: 'Jean-Luc Mélenchon', note: { fr: `gauche radicale contemporaine — fiche à venir` } },
  ],

  partisLies: [
    { nom: 'Parti socialiste', note: { fr: `fiche à venir` } },
    { nom: 'Parti communiste français', note: { fr: `fiche à venir` } },
    { nom: 'La France insoumise', note: { fr: `classée gauche radicale par la plupart des politistes — fiche à venir` } },
    { nom: 'Les Écologistes', note: { fr: `fiche à venir` } },
    { nom: 'Génération.s', note: { fr: `fiche à venir` } },
    { nom: 'Place publique', note: { fr: `fiche à venir` } },
  ],

  sources: [
    { label: `Michel Winock, La Gauche en France, Perrin`, year: 2006 },
    { label: `Jacques Julliard, Les Gauches françaises (1762-2012), Flammarion, 2012`, year: 2012 },
    { label: `Jean-Jacques Becker, Gilles Candar (dir.), Histoire des gauches en France, La Découverte, 2004`, year: 2004 },
    { label: `Vie-publique.fr — fiches « vie politique », « Front populaire », « ordonnances de 1945 », « partis politiques »`, url: 'https://www.vie-publique.fr', year: 2025 },
    { label: `Résultats officiels des élections et référendums : Conseil constitutionnel (1981, 2002, 2005, 2017, 2022)`, url: 'https://www.conseil-constitutionnel.fr', year: 2022 },
  ],
};
