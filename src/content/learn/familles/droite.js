/**
 * Dossier-pivot « La droite » — prototype PROTO-1 du modèle ideologie
 * (docs/jyconnaisrien/02, §3, variante dossier-pivot).
 * 4 niveaux de lecture : N1 (20 s) → N2 (3 min) → N3 (tout comprendre, repliable) → N4.
 */

export default {
  slug: 'droite',
  type: 'ideologie',
  variante: 'dossier-pivot',
  porte: 'B',
  title: { fr: `La droite`, en: 'The Right' },
  icon: '📘',
  difficulty: 2,
  famille: 'dossier',
  updatedAt: '2026-07-12',
  freshness: { type: 'periodic', reviewEveryMonths: 12, lastReviewedAt: '2026-07-12' },

  // ── N1 — En 20 secondes ─────────────────────────────────────────────────────
  level1: {
    fr: `La droite est une grande famille politique qui accorde généralement de l'importance à l'ordre, à la responsabilité individuelle, au mérite, à la propriété privée et à l'économie de marché. Mais il n'existe pas une droite : il en existe plusieurs, parfois opposées entre elles — libérale, conservatrice, gaulliste, sociale, souverainiste… Être de droite ne dit pas, à soi seul, ce que l'on pense de l'Europe, de l'écologie ou des services publics.`,
  },

  // ── N2 — En 3 minutes ───────────────────────────────────────────────────────
  level2: {
    sections: [
      {
        titre: { fr: 'Les grandes valeurs' },
        corps: {
          fr: `Quatre idées reviennent dans presque toutes les droites : la responsabilité individuelle (chacun est d'abord comptable de ses choix), l'ordre et l'autorité (une société a besoin de règles respectées), la propriété privée et le mérite (ce que l'on a construit ou gagné doit être protégé), et l'attachement à ce qui a fait ses preuves — institutions, traditions, nation. Ce qui distingue les droites entre elles, c'est la hiérarchie entre ces valeurs : un libéral place la liberté économique en premier, un conservateur la transmission, un gaulliste la nation.`,
        },
      },
      {
        titre: { fr: `D'où vient la droite ?` },
        corps: {
          fr: `Le mot naît pendant la Révolution française : à l'été 1789, les députés favorables au roi se placent à droite du président de séance, les partisans du changement à gauche. L'étiquette est restée, mais son contenu a changé plusieurs fois. L'historien René Rémond a montré qu'il n'y a pas une droite française mais plusieurs, aux origines distinctes — et cette pluralité se voit encore aujourd'hui.`,
        },
      },
      {
        titre: { fr: 'Les principales sensibilités' },
        corps: {
          fr: `On distingue habituellement : la droite libérale (priorité au marché et aux libertés économiques), la droite conservatrice (priorité aux traditions et à la famille), la droite gaulliste (priorité à l'État fort et à la souveraineté), la droite sociale (protection des plus modestes sans étatisme), la droite souverainiste (priorité à l'indépendance nationale, notamment face à l'Union européenne), la droite chrétienne-démocrate, la droite libertarienne — et la droite nationale, dont le classement par rapport à l'extrême droite fait l'objet d'une section entière plus bas. La cartographie ci-dessous les détaille une par une.`,
        },
      },
      {
        titre: { fr: `La droite et l'économie` },
        corps: {
          fr: `La droite défend généralement l'économie de marché, l'entreprise, et une baisse des impôts et des dépenses publiques. Mais l'unanimité s'arrête là : la droite libérale veut ouvrir les marchés et réduire le rôle de l'État, tandis que la droite gaulliste a construit de grands programmes publics (nucléaire, aérospatiale, TGV) et que la droite souverainiste défend des protections commerciales. « La droite » n'a donc pas une politique économique unique — elle en a au moins trois.`,
        },
      },
      {
        titre: { fr: `La droite et l'autorité` },
        corps: {
          fr: `L'ordre public est un marqueur fort : plus de moyens pour la police, une justice perçue comme plus ferme, la défense de l'autorité à l'école. Attention à une confusion fréquente : la droite n'a pas le monopole de l'ordre (une partie de la gauche républicaine y est très attachée), et être attaché à l'autorité ne signifie pas être hostile à l'État de droit — les droites de gouvernement acceptent le contrôle du juge, même quand elles le critiquent.`,
        },
      },
      {
        titre: { fr: 'Quelques figures' },
        corps: {
          fr: `Charles de Gaulle (fondateur de la Ve République, inclassable dans la droite libérale classique), Valéry Giscard d'Estaing (droite libérale et européenne), Jacques Chirac (héritier gaulliste, deux fois président), Simone Veil (centre-droit libéral, figure transpartisane qui a porté la loi de 1975 sur l'IVG), Philippe Séguin (gaullisme social et souverainiste), Nicolas Sarkozy (droite dite « décomplexée »). Des figures très différentes — c'est le point important : elles ne défendaient pas la même droite.`,
        },
      },
      {
        titre: { fr: 'Ce que disent ses défenseurs' },
        corps: {
          fr: `La liberté économique crée la prospérité : quand les entreprises peuvent embaucher, investir et innover sans entraves excessives, tout le monde en profite. La société tient par ses institutions — famille, école, nation — qu'il faut transmettre plutôt que déconstruire. L'État doit protéger (sécurité, justice, défense) plutôt que tout redistribuer. Et récompenser le mérite est plus juste que niveler : l'effort doit payer.`,
        },
      },
      {
        titre: { fr: 'Ce que disent ses critiques' },
        corps: {
          fr: `Les politiques de droite favoriseraient les plus aisés et sous-estimeraient les inégalités de départ : on ne « mérite » pas son milieu de naissance. Son conservatisme freinerait des évolutions de société ensuite largement acceptées. Sa fermeté migratoire et sécuritaire se ferait parfois au détriment des libertés. La droite répond que la prospérité bénéficie à tous, que la prudence n'est pas l'immobilisme, et que la sécurité est la première des libertés — le débat est ancien et toujours ouvert.`,
        },
      },
      {
        titre: { fr: 'Exemples concrets' },
        corps: {
          fr: `Les privatisations de 1986-1988 (gouvernement Chirac) : l'État vend de grandes entreprises publiques — choix typique de la droite libérale. Le programme nucléaire et spatial lancé sous de Gaulle et Pompidou : l'État stratège du gaullisme. Le soutien de la droite parlementaire au report de l'âge de la retraite à 64 ans (2023) : la responsabilité budgétaire avant la protection immédiate. Et la loi Veil de 1975 sur l'IVG, portée par une ministre d'un gouvernement de droite : preuve que « la droite » n'a jamais été un bloc sur les sujets de société.`,
        },
      },
    ],
  },

  // ── Cartographie des droites (rendue en tête du N3, chaque carte ouvre sa section) ──
  carteTitre: { fr: `La carte des droites — cliquez pour ouvrir` },
  carte: [
    { id: 'droite-liberale', nom: { fr: 'Libérale' }, resume: { fr: `Le marché d'abord : moins d'impôts, moins de règles, plus de concurrence.` } },
    { id: 'droite-conservatrice', nom: { fr: 'Conservatrice' }, resume: { fr: `Transmettre : famille, traditions, prudence face aux changements de société.` } },
    { id: 'droite-gaulliste', nom: { fr: 'Gaulliste' }, resume: { fr: `Un État fort, la souveraineté nationale, la grandeur de la France.` } },
    { id: 'droite-sociale', nom: { fr: 'Sociale' }, resume: { fr: `Protéger les plus modestes sans étatisme — l'héritage du gaullisme social.` } },
    { id: 'droite-souverainiste', nom: { fr: 'Souverainiste' }, resume: { fr: `La nation décide : méfiance envers les transferts de pouvoir à l'UE.` } },
    { id: 'droite-nationale', nom: { fr: 'Nationale' }, resume: { fr: `Identité et immigration comme enjeux centraux — un classement débattu.` } },
    { id: 'droite-chretienne-democrate', nom: { fr: 'Chrétienne-démocrate' }, resume: { fr: `Dignité de la personne, corps intermédiaires, construction européenne.` } },
    { id: 'droite-libertarienne', nom: { fr: 'Libertarienne' }, resume: { fr: `Réduire radicalement l'État, dans l'économie comme dans la vie privée.` } },
  ],

  // ── N3 — Tout comprendre (sections repliables) ──────────────────────────────
  level3: {
    sections: [
      {
        id: 'origines',
        titre: { fr: `D'où viennent la droite et la gauche ?` },
        corps: {
          fr: `Été 1789 : à l'Assemblée constituante, on débat du droit de veto du roi. Ses partisans se regroupent à droite du président de séance, ses adversaires à gauche. Le placement devient une habitude, puis une identité politique.\n\nAu XIXe siècle, l'historien René Rémond distingue trois droites d'origines différentes : la droite légitimiste (attachée à la monarchie et à la tradition — ancêtre du conservatisme), la droite orléaniste (favorable aux libertés économiques et au parlement — ancêtre du libéralisme de droite) et la droite bonapartiste (un chef fort appuyé directement sur le peuple — dont on retrouve des traits dans le gaullisme et ailleurs). Cette grille de 1954 reste le point de départ de presque toutes les analyses des droites françaises.\n\nDétail important : pendant des décennies, « droite » a été une étiquette que peu de responsables revendiquaient — on se disait « modéré », « national », « républicain ». L'assumer ouvertement est assez récent.`,
        },
      },
      {
        id: 'vision-etre-humain',
        titre: { fr: `Sa vision de l'être humain` },
        corps: {
          fr: `Deux idées structurent la vision de l'être humain à droite. D'abord, l'individu responsable : chacun est d'abord comptable de ses choix, de son travail, de ses réussites et de ses échecs — d'où la valorisation du mérite et la méfiance envers ce qui est perçu comme de l'assistanat.\n\nEnsuite, chez les conservateurs, une certaine prudence sur la nature humaine : l'être humain n'est pas spontanément bon, il a besoin d'institutions (famille, école, justice) pour canaliser ses passions. C'est le contraire du pari de la gauche héritée des Lumières, pour qui l'homme peut être transformé en changeant la société. La droite libertarienne fait exception : elle part d'un individu souverain, dont la liberté prime sur toute institution.`,
        },
      },
      {
        id: 'vision-societe',
        titre: { fr: 'Sa vision de la société' },
        corps: {
          fr: `Pour la droite conservatrice, la société est un héritage : elle existe avant nous, elle nous survivra, et notre rôle est de la transmettre en bon état. D'où l'importance des « corps intermédiaires » — familles, communes, associations, métiers — qui font tenir la société entre l'individu et l'État.\n\nPour la droite libérale, la société est plutôt la somme d'individus libres qui coopèrent par le contrat et l'échange : elle n'a pas besoin d'être dirigée, seulement encadrée par des règles justes.\n\nCes deux visions s'opposent parfois frontalement — par exemple sur l'ouverture des frontières économiques ou sur l'évolution des mœurs — et c'est l'une des lignes de fracture internes les plus durables de la droite.`,
        },
      },
      {
        id: 'vision-etat',
        titre: { fr: `Sa conception de l'État` },
        corps: {
          fr: `C'est le paradoxe le plus mal compris de la droite : elle veut à la fois moins d'État et plus d'État. Moins d'État dans l'économie et la vie quotidienne (impôts, normes, administration) ; plus d'État dans ses missions dites régaliennes : police, justice, défense, diplomatie, monnaie.\n\nLe gaullisme pousse plus loin : l'État y est un stratège qui fixe le cap de la nation — planification, grands programmes industriels, indépendance énergétique. À l'inverse, la droite libertarienne voudrait réduire l'État à presque rien.\n\nQuand vous entendez « la droite veut détruire l'État » ou « la droite veut un État policier », vous entendez donc deux caricatures du même paradoxe — chacune vraie pour une fraction de la droite, fausse pour les autres.`,
        },
      },
      {
        id: 'vision-economie',
        titre: { fr: `Sa vision de l'économie` },
        corps: {
          fr: `Le socle commun : la richesse est créée par les entreprises et le travail, pas par l'État ; la propriété privée doit être protégée ; la concurrence est plus efficace que le monopole. D'où les politiques récurrentes de la droite au pouvoir : baisses d'impôts (surtout sur la production et la transmission), privatisations (1986-1988, puis 1993-1995), assouplissement du droit du travail.\n\nLes divergences sont réelles : libre-échange (droite libérale) contre protection des industries nationales (droites gaulliste et souverainiste) ; rigueur budgétaire contre grands investissements publics ; fiscalité familiale contre fiscalité individuelle.\n\nSur la dette et les déficits, la droite tient un discours de sérieux budgétaire — que ses opposants relativisent en rappelant que la dette a aussi augmenté sous des gouvernements de droite. Les deux constats sont exacts : le sérieux budgétaire est un objectif affiché, pas toujours un résultat obtenu.`,
        },
      },
      {
        id: 'liberte',
        titre: { fr: 'Sa vision de la liberté' },
        corps: {
          fr: `La liberté défendue en priorité par la droite est concrète : entreprendre, posséder, transmettre, choisir l'école de ses enfants. Elle se méfie de l'égalitarisme, qui, à ses yeux, finit par restreindre la liberté de tous au nom de l'égalité de chacun.\n\nSur les libertés publiques (expression, manifestation, vie privée), l'histoire est plus contrastée : des droites ont défendu ces libertés contre l'État, d'autres ont accepté de les restreindre au nom de l'ordre — état d'urgence, extension de la surveillance, restrictions du droit de manifester. Sur les libertés de mœurs (IVG, mariage pour tous, fin de vie), la droite est structurellement divisée entre sa composante libérale et sa composante conservatrice ; les votes au Parlement le montrent à chaque fois.`,
        },
      },
      {
        id: 'egalite',
        titre: { fr: `Sa vision de l'égalité` },
        corps: {
          fr: `La droite préfère l'égalité des chances à l'égalité des résultats : que chacun parte avec les mêmes règles du jeu, puis que le mérite fasse la différence. Corriger les résultats (par la redistribution massive) lui semble à la fois injuste — on prend à ceux qui ont fait des efforts — et inefficace — on décourage l'initiative.\n\nLa critique classique : l'égalité des chances est une fiction si les points de départ sont trop inégaux (naissance, quartier, capital culturel). La droite répond par l'école, la famille et le travail plutôt que par les transferts sociaux. Ce débat — corriger les places ou corriger les règles — est probablement le désaccord le plus profond entre gauche et droite.`,
        },
      },
      {
        id: 'autorite',
        titre: { fr: `Sa vision de l'autorité` },
        corps: {
          fr: `L'autorité, à droite, n'est pas un gros mot : c'est la condition de la liberté. Sans règles respectées — à l'école, dans la rue, aux frontières — les plus faibles sont les premières victimes du désordre. D'où les politiques récurrentes : moyens accrus pour la police, peines perçues comme plus fermes (les « peines planchers » de 2007, supprimées en 2014), restauration de l'autorité du professeur.\n\nLes débats internes existent : jusqu'où durcir sans fragiliser l'État de droit ? Les droites de gouvernement acceptent le contrôle du juge (constitutionnel, administratif, européen), même quand elles le contestent bruyamment. Une partie de la droite nationale, elle, propose de s'affranchir de certaines de ces contraintes — c'est l'un des critères qui alimentent le débat sur sa classification.`,
        },
      },
      {
        id: 'nation',
        titre: { fr: 'Sa vision de la nation' },
        corps: {
          fr: `L'attachement à la nation traverse toutes les droites, mais ne signifie pas la même chose partout. Pour le gaullisme, la nation est un projet : indépendance, rang mondial, refus des tutelles (américaine hier, bruxelloise pour certains aujourd'hui). Pour les conservateurs, elle est un héritage : langue, histoire, paysages, culture à transmettre. Pour la droite nationale, elle est une identité à protéger, notamment de l'immigration.\n\nLa distinction clé que tout citoyen devrait connaître : le patriotisme civique (la nation définie par la citoyenneté et l'adhésion à des principes — n'importe qui peut devenir français) et le nationalisme identitaire (la nation définie par l'origine ou la culture héritée). La frontière entre droite et extrême droite passe en grande partie par là.`,
        },
      },
      {
        id: 'europe',
        titre: { fr: `Sa vision de l'Europe` },
        corps: {
          fr: `La droite française est divisée sur l'Europe depuis les origines de la construction européenne. Les démocrates-chrétiens (Robert Schuman) en furent les fondateurs ; les libéraux y voient un grand marché et un multiplicateur de puissance ; les gaullistes historiques défendaient une « Europe des nations » qui coopère sans se fondre — de Gaulle a bloqué deux fois l'entrée du Royaume-Uni et pratiqué la politique de la « chaise vide ».\n\nLe traité de Maastricht (référendum de 1992, approuvé à environ 51 %) a coupé la droite en deux : Philippe Séguin et Charles Pasqua ont mené le « non » contre la ligne officielle de leur propre camp. Cette fracture ne s'est jamais refermée : aujourd'hui encore, la droite compte des européens convaincus, des partisans d'une Europe recentrée sur quelques missions, et des souverainistes favorables à la primauté du droit national sur le droit européen.`,
        },
      },
      {
        id: 'immigration',
        titre: { fr: `Sa position sur l'immigration` },
        corps: {
          fr: `Tendance générale : la droite est favorable à une immigration maîtrisée et réduite, avec des conditions d'intégration exigeantes (langue, travail, respect des lois). Mais l'histoire est plus nuancée qu'on ne le croit : dans les années 1960, le patronat et des gouvernements de droite ont organisé l'immigration de travail ; c'est un gouvernement de droite qui a suspendu cette immigration en 1974 ; et le regroupement familial a été encadré sous des majorités des deux bords.\n\nDepuis les années 1980, le centre de gravité de la droite s'est durci sur ce sujet, en partie sous la pression électorale de la droite nationale. Les positions actuelles vont de la sélection par les besoins économiques (droite libérale) à la réduction drastique de toutes les formes d'immigration (droite nationale), en passant par la priorité à l'intégration (droite sociale et chrétienne). Peut-on être de droite et favorable à l'immigration ? Oui — c'est une position minoritaire mais réelle, surtout dans la droite économique.`,
        },
      },
      {
        id: 'ecologie',
        titre: { fr: `Sa position sur l'écologie` },
        corps: {
          fr: `Longtemps secondaire à droite, l'écologie y a pourtant des racines naturelles : « conserver » les paysages, la ruralité, le patrimoine — c'est le cœur du mot conservatisme. La droite défend majoritairement le nucléaire (héritage gaulliste : indépendance énergétique et électricité bas carbone), mise sur l'innovation et les incitations plutôt que sur les interdictions, et critique ce qu'elle appelle « l'écologie punitive » : taxes, normes, restrictions de circulation.\n\nSes opposants lui reprochent de reconnaître le problème climatique tout en refusant les mesures à la hauteur ; elle répond que la transition ne doit être payée ni par les classes moyennes ni par la compétitivité du pays. Le mouvement des Gilets jaunes (2018), déclenché par une taxe carbone, a durablement marqué ce débat pour tous les camps.`,
        },
      },
      {
        id: 'droite-liberale',
        titre: { fr: 'La droite libérale' },
        corps: {
          fr: `Héritière de l'orléanisme du XIXe siècle : libertés économiques, parlement, ouverture. Elle veut baisser les impôts et les dépenses, alléger les normes, privatiser ce qui peut l'être, et voit dans l'Union européenne un grand marché favorable à la France. Figures : Valéry Giscard d'Estaing, Raymond Barre, Alain Madelin ; structures : l'UDF hier, une partie des Républicains et d'Horizons aujourd'hui.\n\nSa tension permanente : elle est économiquement proche du centre macroniste, ce qui pose sans cesse la question de son autonomie politique. Sur les sujets de société, elle est généralement plus ouverte que la droite conservatrice — beaucoup de ses élus ont voté les grandes lois sociétales.`,
        },
      },
      {
        id: 'droite-conservatrice',
        titre: { fr: 'La droite conservatrice' },
        corps: {
          fr: `Sa priorité n'est pas le marché mais la transmission : famille, éducation, racines chrétiennes revendiquées par certains, prudence face aux évolutions rapides des mœurs. Elle s'est fortement mobilisée contre le mariage pour tous en 2013 (la « Manif pour tous », moment fondateur pour toute une génération militante) et reste réservée sur la PMA, la GPA et la fin de vie.\n\nÉconomiquement, elle n'est pas forcément libérale : une partie défend les services publics de proximité et se méfie de la mondialisation. François Fillon en 2016 a incarné une synthèse libérale-conservatrice ; Bruno Retailleau incarne aujourd'hui une ligne d'abord conservatrice et régalienne. Sa question stratégique : s'allier au centre, ou assumer une concurrence frontale avec la droite nationale sur ses thèmes ?`,
        },
      },
      {
        id: 'droite-gaulliste',
        titre: { fr: 'La droite gaulliste' },
        corps: {
          fr: `Le gaullisme n'est pas un programme économique mais une certaine idée de la France : indépendance nationale (dissuasion nucléaire, retrait du commandement intégré de l'OTAN en 1966), État stratège (planification, grands programmes industriels), rassemblement au-dessus des partis, et lien direct entre le chef de l'État et le peuple (référendums).\n\nDe Gaulle refusait l'étiquette de droite, et son électorat a longtemps été interclassiste — y compris populaire. Le mouvement gaulliste (RPF, puis UNR, UDR, RPR) a dominé la droite de 1958 aux années 1990. Aujourd'hui, plus personne n'est « gaulliste » au sens strict, mais presque tout le monde s'en réclame — de la droite libérale à la droite nationale en passant par une partie de la gauche souverainiste. C'est le signe d'un héritage devenu patrimoine commun plus que doctrine.`,
        },
      },
      {
        id: 'droite-sociale',
        titre: { fr: 'La droite sociale' },
        corps: {
          fr: `Elle refuse d'abandonner la question sociale à la gauche. Ses sources : le gaullisme social (la « participation » des salariés aux résultats de l'entreprise, défendue par de Gaulle puis Philippe Séguin) et le catholicisme social (la doctrine sociale de l'Église : dignité du travail, protection des plus faibles). Elle défend les services publics de proximité, les retraites modestes, les territoires périphériques — sans adopter les solutions étatistes de la gauche.\n\nXavier Bertrand s'en réclame explicitement ; Philippe Séguin en reste la référence, avec son discours de 1992 dénonçant une construction européenne coupée des peuples. Sa faiblesse historique : elle n'a jamais structuré de parti durable — elle irrigue les autres droites plus qu'elle n'existe seule.`,
        },
      },
      {
        id: 'droite-souverainiste',
        titre: { fr: 'La droite souverainiste' },
        corps: {
          fr: `Son critère central : qui décide en dernier ressort — la nation ou les institutions supranationales ? Elle défend la primauté du droit national sur le droit européen, le contrôle des frontières, et une politique étrangère indépendante. Moment fondateur : le « non » à Maastricht de 1992 (Séguin, Pasqua). Représentants : Nicolas Dupont-Aignan (Debout la France), des courants au sein des Républicains.\n\nÀ ne pas confondre avec la droite nationale : on peut être souverainiste pour des raisons institutionnelles et démocratiques (« les lois doivent être votées par des élus que l'on peut renvoyer ») sans faire de l'identité ou de l'immigration son sujet central. Il existe d'ailleurs une gauche souverainiste (Jean-Pierre Chevènement) — la souveraineté n'appartient à aucun camp.`,
        },
      },
      {
        id: 'droite-nationale',
        titre: { fr: 'La droite nationale' },
        corps: {
          fr: `Elle fait de l'identité nationale et de l'immigration les enjeux centraux de la politique : priorité nationale dans l'accès aux prestations et à l'emploi, réduction drastique de l'immigration, critique des « élites mondialisées ». En France, elle est incarnée principalement par le Rassemblement national (ex-Front national, fondé en 1972) et par Reconquête (2021).\n\nOù la classer ? Le RN se présente comme « ni de droite ni de gauche » et son programme économique a longtemps emprunté à la gauche (retraite précoce, dépense sociale). La grande majorité des politistes le classe à l'extrême droite, sur des critères précis exposés dans la section suivante — classement que le parti conteste. Poliscop présente les deux faits : le classement scientifique dominant, et sa contestation par les intéressés. La section suivante donne les critères pour comprendre ce débat au lieu de le subir.`,
        },
      },
      {
        id: 'droite-chretienne-democrate',
        titre: { fr: 'La droite chrétienne-démocrate' },
        corps: {
          fr: `Issue du catholicisme social, la démocratie chrétienne défend la dignité de la personne, la famille, les corps intermédiaires et la subsidiarité (ne pas faire à l'échelon supérieur ce qui peut être fait plus près des gens) — et une « économie sociale de marché » qui accepte le marché en l'encadrant. En Europe, c'est une force majeure : la CDU allemande en est l'exemple type, et Robert Schuman, père fondateur de la construction européenne, en était issu.\n\nEn France, le MRP a été un grand parti de l'après-guerre, mais la démocratie chrétienne n'a jamais retrouvé cette puissance : elle s'est diluée dans le centre (UDF, MoDem) et la droite modérée, où elle survit comme sensibilité plus que comme parti.`,
        },
      },
      {
        id: 'droite-libertarienne',
        titre: { fr: 'La droite libertarienne' },
        corps: {
          fr: `Elle pousse la logique libérale à son terme : l'État doit être réduit au strict minimum (sécurité, justice), tout le reste — école, santé, retraites, monnaie pour les plus radicaux — relevant du choix individuel et du marché. À la différence de la droite conservatrice, elle applique cette liberté aussi aux mœurs : ce que font les adultes consentants ne regarde pas l'État.\n\nMarginale électoralement en France (elle n'a pas de parti significatif), elle est devenue très visible dans le débat en ligne et chez certains essayistes, et l'expérience du président argentin Javier Milei, élu en 2023, lui a donné une actualité mondiale. La retenir permet surtout de comprendre que « droite » ne veut pas dire « conservateur » : sur la liberté individuelle, libertariens et conservateurs sont opposés.`,
        },
      },
      {
        id: 'droite-vs-extreme-droite',
        titre: { fr: 'Droite et extrême droite : quelle différence ?' },
        corps: {
          fr: `C'est probablement la question la plus sensible — et elle mérite mieux qu'une insulte ou un déni. Les politistes utilisent des critères, pas des étiquettes morales : 1) la conception de la nation — civique (on est français par la citoyenneté) ou identitaire (on l'est par l'origine ou la culture héritée) ; 2) la désignation d'un groupe (immigrés, musulmans, « élites ») comme menace principale pour la nation ; 3) le rapport au pluralisme — accepte-t-on pleinement les contre-pouvoirs (juges, presse, associations) et les contraintes de l'État de droit ? ; 4) l'histoire du mouvement et de ses cadres.\n\nSur ces critères, la majorité des politistes classe le RN et Reconquête à l'extrême droite — tout en documentant la stratégie de « normalisation » du RN depuis 2011. Historiquement, certains courants d'extrême droite ont été liés au fascisme ou à la collaboration ; cela ne signifie pas que toutes les formations actuelles classées à l'extrême droite se définissent ainsi, ni qu'elles en partagent le projet. À l'inverse, la droite de gouvernement se distingue par l'acceptation pleine de l'alternance, du pluralisme et du cadre républicain. La frontière entre les deux — alliances, reprises de thèmes, digues électorales — est l'un des grands sujets de la vie politique actuelle : la trace la plus nette en est la scission des Républicains en juin 2024, après que leur président Éric Ciotti a annoncé une alliance avec le RN.`,
        },
      },
      {
        id: 'debats-internes',
        titre: { fr: 'Les débats internes' },
        corps: {
          fr: `Trois débats traversent la droite en permanence. L'union des droites : faut-il s'allier avec la droite nationale pour gagner, ou maintenir une « digue » ? La question a fait exploser Les Républicains en 2024. Le rapport au centre : la droite libérale est proche du bloc macroniste — s'y fondre, c'est disparaître ; s'y opposer, c'est perdre des électeurs. Et le curseur économique : libéralisme assumé (moins d'impôts, moins de protections) ou protection des classes moyennes et populaires qui constituent désormais une grande partie de son électorat ?\n\nCes tensions ne sont pas des anomalies : elles reflètent les familles distinctes décrites plus haut. Une droite unie idéologiquement n'a jamais existé en France — ce qui a existé, ce sont des coalitions électorales plus ou moins durables.`,
        },
      },
      {
        id: 'evolutions-historiques',
        titre: { fr: 'Les grandes évolutions historiques' },
        corps: {
          fr: `XIXe siècle : trois droites (légitimiste, orléaniste, bonapartiste) s'affrontent autant qu'elles affrontent la gauche. Sous la IIIe République, une partie de la droite catholique se rallie à la République ; l'affaire Dreyfus recompose les camps. Vichy (1940-1944) reste une blessure : des hommes de droite y ont collaboré, d'autres — de Gaulle en tête — ont incarné la Résistance ; réduire « la droite » à l'un ou l'autre est une erreur historique.\n\nAprès-guerre : démocratie chrétienne (MRP) et modérés (CNIP), puis domination gaulliste à partir de 1958. 1974 : Giscard, libéral, l'emporte — première alternance interne à la droite. Années 1980-1990 : le RPR (Chirac) et l'UDF (libéraux et centristes) se partagent le camp, tandis que le Front national perce à partir de 1983-1984. 2002 : l'UMP unifie la droite de gouvernement. 2017 : l'élection d'Emmanuel Macron siphonne son aile libérale, pendant que le RN progresse — la droite classique perd le monopole de l'opposition à la gauche. Depuis, elle cherche sa place entre un centre qui a pris ses électeurs modérés et une droite nationale qui a pris une partie de ses électeurs populaires. La scission de 2024 (alliance Ciotti-RN) est l'épisode le plus récent de cette recomposition.`,
        },
      },
      {
        id: 'figures',
        titre: { fr: 'Les principales figures françaises' },
        corps: {
          fr: `Charles de Gaulle — fondateur de la Ve République, inclassable dans les cases classiques (voir la section gaullisme). Georges Pompidou — continuité gaulliste et modernisation industrielle. Valéry Giscard d'Estaing — droite libérale et européenne, grandes réformes de société (majorité à 18 ans, IVG portée par sa ministre). Jacques Chirac — héritier gaulliste devenu rassembleur de la droite, président 1995-2007. Simone Veil — centre-droit libéral, loi IVG de 1975, première présidente du Parlement européen élu au suffrage universel : une figure devenue transpartisane. Raymond Barre — libéralisme économique rigoureux. Philippe Séguin — gaullisme social, « non » à Maastricht. Édouard Balladur, Alain Juppé, François Fillon — trois Premiers ministres, trois nuances (libérale, modérée, libérale-conservatrice). Nicolas Sarkozy — droite « décomplexée », président 2007-2012. Aujourd'hui : Laurent Wauquiez et Bruno Retailleau (ligne conservatrice et régalienne chez LR), Xavier Bertrand (droite sociale), Valérie Pécresse (libérale), Édouard Philippe (droite libérale ralliée au bloc central).\n\nMarine Le Pen, Jordan Bardella et Éric Zemmour appartiennent à la droite nationale / extrême droite — leur positionnement précis est traité dans les sections dédiées, avec les critères de classement. Ne rangez jamais toutes ces personnes dans « la même droite » : plusieurs d'entre elles se sont combattues toute leur vie.`,
        },
      },
      {
        id: 'partis',
        titre: { fr: 'Les partis associés' },
        corps: {
          fr: `Les Républicains (LR) — héritiers de la généalogie gaulliste RPF → UNR → UDR → RPR → UMP (2002) → LR (2015) ; affaiblis depuis 2017, scindés en 2024. Horizons (Édouard Philippe) et une partie de l'UDI — droite libérale et centriste compatible avec le bloc central. Debout la France (Dupont-Aignan) — droite souverainiste. Le Rassemblement national et Reconquête relèvent de la droite nationale, classée à l'extrême droite par la plupart des politistes (voir la section dédiée).\n\nPour mémoire, le bloc présidentiel (Renaissance) n'est pas classé à droite : il se définit comme central, même si une partie de ses politiques économiques est qualifiée de « droite » par ses opposants. Chaque parti aura sa fiche détaillée — généalogie, électorat, discours vs action au pouvoir.`,
        },
      },
      {
        id: 'critiques',
        titre: { fr: 'Les critiques qui lui sont adressées' },
        corps: {
          fr: `Critique sociale : ses politiques favoriseraient les détenteurs de capital et les hauts revenus (baisses d'impôts ciblées, réformes du marché du travail), au détriment des plus fragiles. Critique culturelle : son conservatisme aurait freiné des évolutions ensuite largement acceptées — IVG, abolition de la peine de mort (votée en 1981 grâce à la gauche, mais avec des voix de droite), mariage pour tous. Critique libérale (venue de son propre camp) : au pouvoir, elle n'aurait jamais vraiment réduit la dépense publique. Critique démocratique : sa fermeté sécuritaire et migratoire banaliserait des idées longtemps portées par l'extrême droite.\n\nSes réponses : la prospérité créée par l'entreprise bénéficie à tous ; la prudence sur les mœurs n'est pas de l'obscurantisme mais du soin pour ce qui tient une société ; et la fermeté régalienne est ce que demandent les électeurs, y compris populaires. À chacun de juger — cette fiche vous donne les arguments, pas le verdict.`,
        },
      },
      {
        id: 'idees-recues',
        titre: { fr: 'Les idées reçues' },
        corps: {
          fr: `« La droite, c'est les riches » : son électorat est plus âgé et plus aisé en moyenne, mais des millions d'électeurs modestes votent à droite — et une partie des plus aisés vote à gauche ou au centre. « La droite est contre l'État » : voir la section sur l'État — c'est vrai pour une fraction, faux pour le gaullisme. « La droite ne réforme jamais la société » : la loi Veil (1975), la majorité à 18 ans (1974) ou la suppression du service militaire (1997) ont été portées par des gouvernements de droite. « Droite = extrême droite » : voir la section dédiée aux critères.\n\nLes affirmations de ce type sont traitées une par une, avec sources, dans le module « Vrai ou faux ? » en bas de page.`,
        },
      },
      {
        id: 'international',
        titre: { fr: 'Ses équivalents à l\'étranger' },
        corps: {
          fr: `Les étiquettes ne se transposent jamais exactement. Le Parti conservateur britannique combine conservatisme et libéralisme économique, dans une tradition très pragmatique. La CDU/CSU allemande est la grande référence démocrate-chrétienne : plus sociale et plus européenne que la droite française. Le Parti républicain américain est un cas à part : la religion, les armes et une méfiance radicale envers l'État fédéral y jouent un rôle sans équivalent en France — un républicain américain trouverait la droite française étatiste, et l'inverse est vrai.\n\nCes comparaisons servent surtout à comprendre que la droite française a une singularité : le poids du gaullisme y a légitimé un État fort que la plupart des droites étrangères récusent.`,
        },
      },
    ],
  },

  // ── N4 — Pour aller encore plus loin ────────────────────────────────────────
  level4: {
    items: [
      { kind: 'discours', titre: { fr: `Discours de Bayeux — Charles de Gaulle, 16 juin 1946` }, note: { fr: `Le texte fondateur de la vision gaulliste des institutions, mise en œuvre en 1958.` }, url: 'https://www.vie-publique.fr' },
      { kind: 'discours', titre: { fr: `Discours de Simone Veil à l'Assemblée nationale — 26 novembre 1974` }, note: { fr: `La défense de la loi IVG par une ministre d'un gouvernement de droite, devant une majorité divisée.` }, url: 'https://www.assemblee-nationale.fr' },
      { kind: 'discours', titre: { fr: `Discours de Philippe Séguin contre le traité de Maastricht — 5 mai 1992` }, note: { fr: `Le manifeste du souverainisme de droite moderne, prononcé à l'Assemblée nationale.` }, url: 'https://www.assemblee-nationale.fr' },
      { kind: 'biblio', titre: { fr: `René Rémond, Les Droites en France — Aubier, 1982 (1re éd. 1954)` }, note: { fr: `La grille de lecture classique : légitimistes, orléanistes, bonapartistes. Le point de départ de toute l'historiographie.` } },
      { kind: 'biblio', titre: { fr: `Jean-François Sirinelli (dir.), Histoire des droites en France — Gallimard, 1992` }, note: { fr: `Trois volumes de référence : politique, cultures, sensibilités.` } },
      { kind: 'biblio', titre: { fr: `Gilles Richard, Histoire des droites en France (1815-2017) — Perrin, 2017` }, note: { fr: `Une synthèse récente et accessible, qui prolonge Rémond jusqu'à la période actuelle.` } },
      { kind: 'lien', titre: { fr: `Vie-publique.fr — dossiers « vie politique » et fiches sur les partis` }, note: { fr: `La documentation publique de référence, gratuite et sourcée.` }, url: 'https://www.vie-publique.fr' },
    ],
  },

  // ── Chronologie interactive ──────────────────────────────────────────────────
  chronologie: {
    titre: { fr: `Deux siècles de droites françaises` },
    events: [
      { date: '1789', titre: { fr: `Naissance des mots « gauche » et « droite »` }, detail: { fr: `À l'Assemblée constituante, les partisans du veto royal se placent à droite du président de séance. Une habitude de placement devient une identité politique.` } },
      { date: '1815-1848', titre: { fr: `Légitimistes contre orléanistes` }, detail: { fr: `Sous la Restauration puis la monarchie de Juillet, deux droites s'affrontent : celle de la tradition monarchique et celle des libertés économiques et parlementaires. C'est le point de départ de la grille de René Rémond.` } },
      { date: '1852', titre: { fr: `Le bonapartisme` }, detail: { fr: `Louis-Napoléon Bonaparte fonde le Second Empire : un chef fort, appuyé directement sur le peuple par le plébiscite. Cette troisième droite laissera des traces durables dans la culture politique française.` } },
      { date: '1894-1906', titre: { fr: `L'affaire Dreyfus recompose les camps` }, detail: { fr: `L'affaire divise la France et redessine la frontière gauche-droite autour de la République, de l'armée et de l'antisémitisme. Une partie de la droite catholique se rallie progressivement à la République.` } },
      { date: '1940-1944', titre: { fr: `Vichy et la Résistance : la droite déchirée` }, detail: { fr: `Des hommes de droite collaborent au régime de Vichy ; d'autres, de Gaulle en tête, incarnent la Résistance. Réduire « la droite » à l'un ou l'autre camp est une erreur historique.` } },
      { date: '1946', titre: { fr: `Le discours de Bayeux` }, detail: { fr: `De Gaulle expose sa vision des institutions : un exécutif fort au-dessus des partis. Rejetée sur le moment, elle deviendra la Constitution de 1958.` } },
      { date: '1958', titre: { fr: `La Ve République` }, detail: { fr: `De retour au pouvoir, de Gaulle fonde la Ve République. Le gaullisme domine la droite — et la vie politique — pendant une quinzaine d'années.` } },
      { date: '1974', titre: { fr: `Giscard : la droite libérale à l'Élysée` }, detail: { fr: `Valéry Giscard d'Estaing, non gaulliste, l'emporte. Majorité à 18 ans, loi Veil sur l'IVG : la droite libérale réforme la société. Le RPR de Jacques Chirac naît en 1976 en réaction.` } },
      { date: '1986-1988', titre: { fr: `Privatisations et première cohabitation` }, detail: { fr: `Le gouvernement Chirac privatise de grandes entreprises publiques pendant la première cohabitation avec François Mitterrand — le tournant libéral assumé de la droite française.` } },
      { date: '1992', titre: { fr: `Maastricht coupe la droite en deux` }, detail: { fr: `Le référendum sur le traité de Maastricht (oui à ~51 %) fracture la droite : Philippe Séguin et Charles Pasqua mènent le « non » contre la ligne de leur propre camp. La fracture européenne ne s'est jamais refermée.` } },
      { date: '2002', titre: { fr: `L'UMP unifie la droite de gouvernement` }, detail: { fr: `Après le choc du 21 avril (Jean-Marie Le Pen au second tour), la droite se rassemble dans l'UMP derrière Jacques Chirac, réélu avec 82 % des voix.` } },
      { date: '2007-2012', titre: { fr: `Les années Sarkozy` }, detail: { fr: `Nicolas Sarkozy incarne une droite « décomplexée » : travail, autorité, identité nationale. Battu en 2012, il laisse une droite qui cherche sa ligne.` } },
      { date: '2017', titre: { fr: `L'explosion du système` }, detail: { fr: `Emmanuel Macron attire l'aile libérale et modérée de la droite ; le RN progresse sur son aile droite. Prise en étau, la droite de gouvernement perd son rôle central.` } },
      { date: '2024', titre: { fr: `La scission des Républicains` }, detail: { fr: `Le président de LR, Éric Ciotti, annonce une alliance avec le RN : le parti se déchire. L'épisode le plus récent du débat sur la frontière entre droite et extrême droite.` } },
    ],
  },

  // ── Tableau comparatif (simplification pédagogique assumée) ──────────────────
  tableauComparatif: {
    titre: { fr: `Quatre droites en un coup d'œil` },
    note: { fr: `Simplification pédagogique : chaque case résume une tendance dominante, pas la position de chaque personne ou parti.` },
    colonnes: [{ fr: 'Libérale' }, { fr: 'Conservatrice' }, { fr: 'Gaulliste' }, { fr: 'Nationale' }],
    lignes: [
      { label: { fr: `L'État` }, cells: [{ fr: `Le réduire au nécessaire` }, { fr: `Garant des institutions` }, { fr: `Stratège et fort` }, { fr: `Protecteur de l'identité` }] },
      { label: { fr: `L'économie` }, cells: [{ fr: `Marché, libre-échange` }, { fr: `Marché encadré par la morale` }, { fr: `Marché + grands programmes publics` }, { fr: `Protectionnisme, priorité nationale` }] },
      { label: { fr: `L'Europe` }, cells: [{ fr: `Intégration favorable` }, { fr: `Europe prudente des États` }, { fr: `Europe des nations` }, { fr: `Souveraineté d'abord, UE contestée` }] },
      { label: { fr: `L'immigration` }, cells: [{ fr: `Sélection économique` }, { fr: `Réduction, intégration exigeante` }, { fr: `Maîtrise par l'État` }, { fr: `Réduction drastique, enjeu central` }] },
      { label: { fr: `Le mot-clé` }, cells: [{ fr: `Liberté` }, { fr: `Transmission` }, { fr: `Nation` }, { fr: `Identité` }] },
    ],
  },

  // ── Modules liés ─────────────────────────────────────────────────────────────
  vraiFaux: ['vf-droite-etat-minimal', 'vf-droite-extreme', 'vf-droite-impots', 'vf-degaulle-classique', 'vf-droite-ecologie'],

  quiz: [
    {
      question: { fr: `D'où viennent les mots « gauche » et « droite » en politique ?` },
      options: [
        { fr: `De la Révolution française : le placement des députés par rapport au président de séance` },
        { fr: `De la Rome antique` },
        { fr: `Des campagnes présidentielles américaines` },
        { fr: `De la guerre froide` },
      ],
      bonneReponse: 0,
      explication: { fr: `À l'été 1789, les partisans du veto royal se placent à droite du président de séance, ses adversaires à gauche. L'habitude est devenue une identité politique mondiale.` },
    },
    {
      question: { fr: `Laquelle de ces affirmations sur la droite et l'État est la plus juste ?` },
      options: [
        { fr: `Toutes les droites veulent réduire l'État au minimum` },
        { fr: `La droite veut moins d'État dans l'économie, mais un État fort dans ses missions régaliennes — avec de vraies différences entre ses familles` },
        { fr: `La droite veut étendre l'État partout` },
        { fr: `La droite n'a pas de position sur l'État` },
      ],
      bonneReponse: 1,
      explication: { fr: `C'est le paradoxe central : moins d'impôts et de normes, mais plus de police, de justice et de défense. Et le gaullisme assume en plus un État stratège dans l'économie.` },
    },
    {
      question: { fr: `Qu'est-ce qui distingue surtout le gaullisme de la droite libérale ?` },
      options: [
        { fr: `Le gaullisme est plus favorable au libre-échange` },
        { fr: `Rien, c'est la même chose` },
        { fr: `Le rôle donné à l'État (stratège, planificateur) et la priorité à la souveraineté nationale` },
        { fr: `Le gaullisme refuse l'économie de marché` },
      ],
      bonneReponse: 2,
      explication: { fr: `Le gaullisme accepte le marché mais confie à l'État la direction stratégique de la nation (nucléaire, industrie, indépendance). La droite libérale veut au contraire réduire ce rôle.` },
    },
    {
      question: { fr: `Droite et extrême droite : quelle affirmation est la plus exacte ?` },
      options: [
        { fr: `C'est exactement pareil` },
        { fr: `Ce sont des catégories distinctes, séparées par des critères documentés (conception de la nation, rapport au pluralisme) — et la frontière fait elle-même débat` },
        { fr: `L'extrême droite n'existe plus` },
        { fr: `La différence est uniquement une question de style` },
      ],
      bonneReponse: 1,
      explication: { fr: `Les politistes utilisent des critères précis : nation civique ou identitaire, désignation d'un groupe comme menace, acceptation des contre-pouvoirs. Le classement du RN, par exemple, est scientifiquement dominant mais contesté par le parti lui-même.` },
    },
    {
      question: { fr: `La loi de 1975 sur l'IVG a été portée par…` },
      options: [
        { fr: `Un gouvernement de gauche` },
        { fr: `Une ministre d'un gouvernement de droite, Simone Veil — avec les voix de la gauche et une droite divisée` },
        { fr: `Un référendum` },
        { fr: `Le Conseil constitutionnel` },
      ],
      bonneReponse: 1,
      explication: { fr: `Simone Veil, ministre de la Santé de Valéry Giscard d'Estaing, a défendu le texte en novembre 1974. Il a été adopté grâce aux voix de la gauche, la majorité de droite étant divisée — un bon exemple de la pluralité de la droite sur les sujets de société.` },
    },
  ],

  motsAssocies: ['economie-de-marche', 'dette-publique', '49-3', 'proportionnelle'],

  continuerAvec: [
    { slug: 'gauche', label: { fr: 'La gauche' }, soon: true },
    { slug: 'retraites' },
    { slug: 'oqtf' },
  ],

  figuresLiees: [
    { nom: 'Charles de Gaulle', note: { fr: 'gaullisme — fiche à venir' } },
    { nom: 'Simone Veil', note: { fr: 'centre-droit libéral — fiche à venir' } },
    { nom: 'Jacques Chirac', note: { fr: 'héritier gaulliste — fiche à venir' } },
    { nom: 'Philippe Séguin', note: { fr: 'gaullisme social — fiche à venir' } },
    { nom: 'Nicolas Sarkozy', note: { fr: 'droite « décomplexée » — fiche à venir' } },
  ],

  partisLies: [
    { nom: 'Les Républicains', note: { fr: 'fiche à venir' } },
    { nom: 'Horizons', note: { fr: 'fiche à venir' } },
    { nom: 'Debout la France', note: { fr: 'fiche à venir' } },
    { nom: 'Rassemblement national', note: { fr: 'droite nationale / extrême droite — fiche à venir' } },
  ],

  sources: [
    { label: `René Rémond, Les Droites en France, Aubier, 1982 (1re éd. La Droite en France, 1954)`, year: 1982 },
    { label: `Jean-François Sirinelli (dir.), Histoire des droites en France, Gallimard, 1992`, year: 1992 },
    { label: `Gilles Richard, Histoire des droites en France (1815-2017), Perrin, 2017`, year: 2017 },
    { label: `Vie-publique.fr — fiches « vie politique », « partis politiques », « référendum de Maastricht »`, url: 'https://www.vie-publique.fr', year: 2025 },
    { label: `Résultats et textes officiels : Légifrance (loi du 17 janvier 1975), Assemblée nationale (débats de 1974 et 1992)`, url: 'https://www.legifrance.gouv.fr', year: 1975 },
  ],
};
