/**
 * Dossier « L'extrême gauche » — modèle ideologie (docs/jyconnaisrien/02, §3).
 * 4 niveaux de lecture : N1 (20 s) → N2 (3 min) → N3 (tout comprendre, repliable) → N4.
 * Même exigence que le dossier « La droite » : critères, histoire, zéro caricature.
 */

export default {
  slug: 'extreme-gauche',
  type: 'ideologie',
  porte: 'B',
  title: { fr: `L'extrême gauche`, en: 'The Far Left' },
  icon: '📔',
  difficulty: 3,
  famille: 'dossier',
  updatedAt: '2026-07-12',
  freshness: { type: 'periodic', reviewEveryMonths: 12, lastReviewedAt: '2026-07-12' },

  // ── N1 — En 20 secondes ─────────────────────────────────────────────────────
  level1: {
    fr: `L'extrême gauche désigne les mouvements qui veulent rompre avec le capitalisme par une transformation révolutionnaire de la société — et qui jugent la social-démocratie, c'est-à-dire la gauche de gouvernement, incapable de changer réellement les choses. En France : trotskistes, communistes révolutionnaires, anarchistes. Précision importante d'entrée : pour la plupart des politistes, « extrême gauche » ne veut pas dire « gauche radicale » — La France insoumise, par exemple, relève de la seconde catégorie, pas de la première.`,
  },

  // ── N2 — En 3 minutes ───────────────────────────────────────────────────────
  level2: {
    sections: [
      {
        titre: { fr: `Les critères` },
        corps: {
          fr: `Trois critères reviennent chez les politistes pour définir l'extrême gauche : la rupture révolutionnaire (le capitalisme ne peut pas être réformé, il doit être remplacé — collectivisation des grands moyens de production, pouvoir des travailleurs) ; le refus de la social-démocratie (gérer loyalement l'économie de marché, même en la corrigeant, c'est trahir la transformation sociale) ; et un rapport instrumental aux élections (on y participe pour se faire entendre, pas parce qu'on croit que le pouvoir réel s'y joue). Être très à gauche sur les impôts ou les salaires ne suffit donc pas : c'est le projet de rupture qui fait le classement.`,
        },
      },
      {
        titre: { fr: `D'où vient-elle ?` },
        corps: {
          fr: `De deux héritages. D'abord la tradition révolutionnaire française : 1793, les insurrections du XIXe siècle, et surtout la Commune de Paris (1871), écrasée dans le sang, devenue la référence fondatrice de tous les courants. Ensuite la révolution russe de 1917 : au congrès de Tours (1920), la majorité des socialistes français choisit de rejoindre l'Internationale communiste de Lénine — le communisme français naît d'une scission avec la gauche réformiste. Les courants actuels (trotskistes, anarchistes, communistes révolutionnaires) descendent tous, par des chemins différents, de ces deux moments.`,
        },
      },
      {
        titre: { fr: `Extrême gauche ou gauche radicale ?` },
        corps: {
          fr: `C'est la distinction la plus importante — et la plus maltraitée dans le débat public. La plupart des politistes réservent « extrême gauche » aux organisations révolutionnaires anticapitalistes (Lutte ouvrière, NPA) et classent La France insoumise dans la « gauche radicale » : elle conteste vivement le libéralisme économique, mais participe pleinement au jeu institutionnel (élections, Assemblée, candidatures présidentielles avec vocation de gouverner) et son programme — keynésien radical, forte redistribution — ne prévoit pas d'abolition révolutionnaire du capitalisme ni de l'État. Une partie du débat public et médiatique emploie pourtant « extrême gauche » pour LFI. Poliscop présente les deux usages ; les critères ci-dessus permettent de comprendre le désaccord au lieu de le subir.`,
        },
      },
      {
        titre: { fr: `Les grandes familles` },
        corps: {
          fr: `Le trotskisme, courant dominant en France, issu de Léon Trotski, opposant à Staline : lui-même divisé en trois traditions (Lutte ouvrière, la LCR devenue NPA, les lambertistes). Le communisme révolutionnaire, fidèle à l'horizon d'une révolution que le PCF, devenu parti de gouvernement, a progressivement abandonné. Le maoïsme, important autour de Mai 68, aujourd'hui disparu comme force organisée. Et l'anarchisme, plus ancien que le marxisme en France, qui refuse l'État lui-même — y compris un État révolutionnaire — et privilégie l'action directe des travailleurs, souvent hors des élections. Ces familles s'opposent entre elles au moins autant qu'elles s'opposent au reste de la gauche.`,
        },
      },
      {
        titre: { fr: `Repères électoraux` },
        corps: {
          fr: `Le poids électoral est faible, avec un pic historique : au premier tour de la présidentielle de 2002, les trois candidats trotskistes cumulent environ 10,4 % des suffrages exprimés (Arlette Laguiller 5,72 %, Olivier Besancenot 4,25 %, Daniel Gluckstein 0,47 %). Depuis, le reflux est net : en 2022, Nathalie Arthaud (LO) obtient 0,56 % et Philippe Poutou (NPA) 0,77 %. Autre repère à connaître : Arlette Laguiller fut en 1974 la première femme candidate à une élection présidentielle française — elle s'est présentée six fois, de 1974 à 2007.`,
        },
        sources: [{ label: `Conseil constitutionnel — résultats officiels des élections présidentielles (1974-2022)`, url: 'https://www.conseil-constitutionnel.fr', year: 2022 }],
      },
      {
        titre: { fr: `Ce que disent ses défenseurs` },
        corps: {
          fr: `Le capitalisme produit structurellement l'exploitation, les crises et la destruction écologique : l'aménager ne suffit pas, il faut en sortir. Les conquêtes sociales (congés payés, Sécurité sociale, retraites) n'ont jamais été offertes : elles ont été arrachées par les grèves et les mobilisations — d'où la priorité donnée aux luttes plutôt qu'aux alternances électorales. Et l'histoire de la gauche de gouvernement, de 1914 aux tournants d'austérité, prouverait qu'une fois au pouvoir, elle gère le système plus qu'elle ne le change.`,
        },
      },
      {
        titre: { fr: `Ce que disent ses critiques` },
        corps: {
          fr: `Le projet révolutionnaire aurait montré son vrai visage partout où il a été appliqué : les régimes se réclamant du communisme ont produit des dictatures — objection à laquelle les trotskistes répondent qu'ils ont été les premières victimes du stalinisme, et les anarchistes qu'ils n'ont jamais voulu d'État du tout. Autres critiques récurrentes : l'irréalisme économique (comment fonctionne une économie sans marché ni propriété privée ?), la posture protestataire (critiquer sans jamais assumer de responsabilités), et la division permanente en petites organisations rivales. Ses militants répondent que la fidélité aux principes vaut mieux que les compromissions — le débat est ancien et toujours ouvert.`,
        },
      },
      {
        titre: { fr: `Extrême gauche, gauche radicale, gauche` },
        brique: 'confusion',
        corps: {
          fr: `Trois catégories que le débat public écrase souvent en une seule. La gauche (PS, écologistes…) veut corriger le capitalisme par la redistribution et accepte pleinement les institutions. La gauche radicale (LFI, PCF pour la plupart des politistes) veut une rupture avec le libéralisme économique, mais par les élections et dans le cadre institutionnel. L'extrême gauche (LO, NPA, anarchistes) vise le remplacement révolutionnaire du capitalisme et ne croit pas que les élections puissent l'accomplir. Employer « extrême gauche » pour toute la gauche contestataire, c'est perdre l'information la plus utile : ce que chacun veut vraiment faire.`,
        },
      },
    ],
  },

  // ── N3 — Tout comprendre (sections repliables) ──────────────────────────────
  level3: {
    sections: [
      {
        id: 'criteres',
        sources: [{ label: `Philippe Raynaud, L'Extrême gauche plurielle, Autrement, 2006`, year: 2006 }, { label: `Luke March, Radical Left Parties in Europe, Routledge, 2011 (distinction radical left / extreme left)`, year: 2011 }],
        titre: { fr: `Qu'est-ce qui définit l'extrême gauche ?` },
        corps: {
          fr: `Les politistes ne classent pas à l'extrême gauche selon l'intensité des convictions, mais selon des critères de contenu. Premier critère : l'anticapitalisme de rupture — le capitalisme n'est pas un système à corriger (par l'impôt, les services publics, la régulation) mais à remplacer, par la propriété collective des grands moyens de production et le pouvoir des travailleurs. Deuxième critère : le refus de la social-démocratie — depuis le ralliement des socialistes à l'union sacrée en 1914, puis les expériences de gouvernement, l'extrême gauche considère que la gauche réformiste finit toujours par gérer loyalement le système qu'elle prétendait dépasser. Troisième critère : le rapport aux institutions — les élections et le Parlement sont au mieux des tribunes, jamais le lieu où se joue le pouvoir réel, qui résiderait dans l'économie et dans la rue.\n\nLa littérature comparatiste (Luke March notamment) distingue sur cette base la « gauche radicale » (radical left), qui conteste le néolibéralisme dans le cadre institutionnel, de l'« extrême gauche » (extreme left), révolutionnaire et anticapitaliste. C'est cette grille qui conduit la plupart des chercheurs à classer Lutte ouvrière et le NPA à l'extrême gauche, et La France insoumise ou le PCF dans la gauche radicale. Enfin, une précision d'honnêteté : contrairement à l'extrême droite, le terme « extrême gauche » est souvent revendiqué ou accepté sans drame par les intéressés — Lutte ouvrière se dit ouvertement communiste révolutionnaire.`,
        },
      },
      {
        id: 'heritages-revolutionnaires',
        titre: { fr: `Les héritages révolutionnaires : 1793, 1871` },
        corps: {
          fr: `L'extrême gauche française puise dans une tradition antérieure au marxisme. La Révolution française d'abord : l'an II (1793-1794), la République jacobine et, à sa marge, Gracchus Babeuf et la Conjuration des Égaux (1796) — première tentative organisée d'imposer une société sans propriété privée, considérée par les historiens comme un ancêtre du communisme moderne. Le XIXe siècle ensuite, siècle des insurrections (1830, 1848, la révolte des canuts lyonnais) où se forge l'idée que l'émancipation des travailleurs viendra de leur propre action.\n\nEt surtout la Commune de Paris : du 18 mars au 28 mai 1871, Paris insurgé s'administre lui-même — élus révocables, séparation de l'Église et de l'État, mesures sociales — avant d'être écrasé par l'armée versaillaise lors de la Semaine sanglante (des milliers de morts, chiffre exact toujours débattu par les historiens, suivis de dizaines de milliers d'arrestations et de déportations). Marx en fait aussitôt l'exemple du « gouvernement de la classe ouvrière » ; Lénine s'en réclamera. Pour toutes les familles de l'extrême gauche, jusqu'à aujourd'hui, la Commune reste le moment fondateur : la preuve qu'un autre pouvoir est possible, et le rappel que les possédants ne le tolèrent pas.`,
        },
      },
      {
        id: 'tours-1920',
        sources: [{ label: `Vie-publique.fr — le congrès de Tours et la naissance du Parti communiste français`, url: 'https://www.vie-publique.fr', year: 2025 }],
        titre: { fr: `1920 : le congrès de Tours, la grande scission` },
        corps: {
          fr: `Décembre 1920, Tours. Le parti socialiste SFIO, traumatisé par la boucherie de 1914-1918 et fasciné par la révolution russe de 1917, doit trancher : rejoindre ou non l'Internationale communiste fondée par Lénine, qui impose 21 conditions strictes (discipline, rupture avec les réformistes). La majorité des délégués vote l'adhésion et fonde la Section française de l'Internationale communiste — le futur Parti communiste français. La minorité, derrière Léon Blum, refuse de « garder la vieille maison » aux conditions de Moscou et conserve la SFIO.\n\nCe moment fonde durablement la géographie de la gauche française : d'un côté une gauche réformiste qui gouvernera (Blum en 1936, Mitterrand en 1981), de l'autre un communisme révolutionnaire aligné sur Moscou. Ironie de l'histoire : le PCF, né de cette rupture révolutionnaire, deviendra lui-même un parti d'élections et de gouvernement — et verra surgir sur sa gauche des courants (trotskistes, maoïstes) qui lui reprocheront exactement ce qu'il avait reproché à la SFIO. L'extrême gauche française contemporaine naît largement de cette seconde vague de dissidences.`,
        },
      },
      {
        id: 'trotskisme',
        sources: [{ label: `Christophe Bourseiller, Histoire générale de l'ultra-gauche, Denoël, 2003`, year: 2003 }],
        titre: { fr: `Le trotskisme et ses trois familles` },
        corps: {
          fr: `Léon Trotski, organisateur de l'Armée rouge devenu principal opposant à Staline, exclu d'URSS puis assassiné au Mexique en 1940, fonde en 1938 la IVe Internationale : le socialisme par la révolution, contre le capitalisme et contre la bureaucratie stalinienne. En France, où le trotskisme a été plus durable que presque partout ailleurs, il s'est divisé en trois traditions principales.\n\nLutte ouvrière (courant dit « ouvriériste ») : construite dans la discrétion autour de Robert Barcia, dit Hardy, priorité absolue à l'implantation dans les entreprises, dont Arlette Laguiller fut le visage public pendant plus de trente ans. La Ligue communiste révolutionnaire (LCR), issue de la Jeunesse communiste révolutionnaire d'Alain Krivine et de Mai 68 : plus ouverte aux mouvements sociaux (féminisme, écologie, immigration), elle s'est dissoute en 2009 pour fonder le NPA. Les lambertistes enfin, du nom de Pierre Lambert : implantés dans certains syndicats (Force ouvrière notamment), organisés dans l'OCI puis le Parti des travailleurs et le POI — courant le plus discret, connu du grand public surtout depuis que Lionel Jospin a reconnu en 2001 y avoir milité dans sa jeunesse. Trois cultures très différentes, souvent rivales, qui ne se sont jamais durablement unies.`,
        },
      },
      {
        id: 'mai-68-et-le-gauchisme',
        titre: { fr: `Mai 68 et le « gauchisme »` },
        corps: {
          fr: `Mai-juin 1968 : la plus grande grève générale de l'histoire de France (plusieurs millions de grévistes) part d'une révolte étudiante. Or les organisations qui animent le mouvement étudiant ne sont pas le PCF — qui s'en méfie et dénonce les « aventuristes » — mais de petits groupes révolutionnaires que la presse baptise « gauchistes » : la JCR trotskiste d'Alain Krivine, les maoïstes de l'UJC(ml), le Mouvement du 22-Mars de Daniel Cohn-Bendit, d'inspiration libertaire. Le mot « gauchisme », insulte léniniste à l'origine, devient l'étiquette de toute une génération militante.\n\nL'après-68 est l'âge d'or de cette mouvance : la Gauche prolétarienne maoïste (dissoute par le gouvernement en 1970, auto-dissoute en 1973) envoie ses militants « s'établir » en usine ; son journal La Cause du peuple est défendu par Jean-Paul Sartre ; d'anciens maoïstes fondent le journal Libération en 1973. Le maoïsme s'effondre ensuite avec la révélation de la réalité de la Chine de Mao, tandis que les trotskistes, mieux organisés, durent. Beaucoup de figures intellectuelles, médiatiques et politiques françaises des décennies suivantes sont passées par ces organisations — un point important pour comprendre l'influence culturelle durable de cette séquence, sans rapport avec ses scores électoraux.`,
        },
      },
      {
        id: 'annees-de-plomb',
        sources: [{ label: `Vie-publique.fr / archives judiciaires — Action directe : dissolution par décret (août 1982), attentats, procès`, url: 'https://www.vie-publique.fr', year: 2025 }],
        titre: { fr: `La violence politique : Action directe, l'exception française` },
        corps: {
          fr: `Dans les années 1970-1980, l'Italie (Brigades rouges) et l'Allemagne (Fraction armée rouge) connaissent un terrorisme d'extrême gauche meurtrier — des centaines de morts en Italie pendant les « années de plomb ». La France, elle, fait figure d'exception : la quasi-totalité de son extrême gauche, trotskistes en tête, a toujours rejeté la lutte armée, et la Gauche prolétarienne elle-même s'est dissoute sans franchir ce seuil.\n\nL'exception s'appelle Action directe : un groupe armé actif à partir de 1979, dissous par décret gouvernemental dès août 1982, qui poursuit ses attentats dans la clandestinité — jusqu'à l'assassinat du général René Audran (1985) et de Georges Besse, PDG de Renault (17 novembre 1986). Ses principaux dirigeants sont arrêtés en février 1987 dans une ferme du Loiret, jugés et condamnés à la réclusion à perpétuité. Le groupe n'a jamais compté que quelques dizaines de membres, isolés et publiquement désavoués par les organisations d'extrême gauche. Retenir les deux faits ensemble : cette violence a existé, et elle est restée très marginale — assimiler l'extrême gauche française à Action directe est aussi inexact que de la nier.`,
        },
      },
      {
        id: 'anarchisme',
        titre: { fr: `L'anarchisme et les traditions libertaires` },
        corps: {
          fr: `L'anarchisme est antérieur au marxisme en France : Pierre-Joseph Proudhon (« la propriété, c'est le vol », 1840) puis Bakounine, adversaire de Marx au sein de la Première Internationale, posent le principe : l'émancipation ne viendra ni du capital ni de l'État — pas même d'un État révolutionnaire, qui recréerait une oppression. D'où le refus, constant, de la conquête du pouvoir : l'anarchisme mise sur l'auto-organisation (syndicats, coopératives, communes libres) et, pour la plupart de ses courants, sur l'abstention électorale.\n\nSon âge d'or français est le syndicalisme révolutionnaire : la CGT d'avant 1914, avec la charte d'Amiens (1906) qui proclame l'indépendance du syndicat envers les partis et vise l'expropriation capitaliste par la grève générale. Après une période sombre (les attentats « propagande par le fait » des années 1890, vite abandonnés), le mouvement se reconstruit : Fédération anarchiste (1945), CNT française d'inspiration anarcho-syndicaliste, presse et radios libertaires (Radio libertaire émet depuis 1981). Marginal numériquement, l'anarchisme irrigue pourtant bien au-delà de ses rangs : autogestion, assemblées générales, méfiance envers les chefs et les appareils — autant de réflexes présents dans les mouvements sociaux contemporains qui viennent de cette tradition.`,
        },
      },
      {
        id: 'lutte-ouvriere',
        sources: [{ label: `Conseil constitutionnel — résultats officiels des présidentielles de 1974 à 2022`, url: 'https://www.conseil-constitutionnel.fr', year: 2022 }],
        titre: { fr: `Lutte ouvrière, d'Arlette Laguiller à Nathalie Arthaud` },
        corps: {
          fr: `Lutte ouvrière est l'organisation la plus stable de l'extrême gauche française : trotskiste, centrée sur l'implantation en entreprise, connue du grand public par sa fête annuelle de Presles et surtout par Arlette Laguiller. Employée de banque, porte-parole de l'organisation, elle est en 1974 la première femme candidate à une élection présidentielle française (2,33 %). Elle se présente six fois, de 1974 à 2007, ouvrant chaque intervention par son adresse restée célèbre : « Travailleuses, travailleurs ».\n\nSes scores racontent une histoire politique : autour de 2 % dans les années 1970-1980, puis une percée à 5,30 % en 1995 et un sommet à 5,72 % en 2002 — au moment où une partie de l'électorat populaire déçu de la gauche de gouvernement cherche une voix protestataire. Après 2007 (1,33 %), Nathalie Arthaud, professeure d'économie-gestion, reprend le flambeau : 0,56 % en 2012, 0,64 % en 2017, 0,56 % en 2022. LO assume ces scores modestes : sa raison d'être n'est pas électorale — les campagnes servent de tribune pour « faire entendre le camp des travailleurs », et l'essentiel du travail militant se joue ailleurs, dans les entreprises.`,
        },
      },
      {
        id: 'lcr-npa',
        sources: [{ label: `Conseil constitutionnel — résultats officiels des présidentielles 2002-2022`, url: 'https://www.conseil-constitutionnel.fr', year: 2022 }],
        titre: { fr: `De la LCR au NPA : Besancenot, Poutou` },
        corps: {
          fr: `L'autre grande famille trotskiste vient de Mai 68 : la Ligue communiste d'Alain Krivine (candidat en 1969 et 1974), devenue Ligue communiste révolutionnaire (LCR), ouverte aux « nouveaux » combats — féminisme, antiracisme, écologie — autant qu'aux luttes d'entreprise. Sa surprise historique s'appelle Olivier Besancenot : facteur de 27 ans, il obtient 4,25 % à la présidentielle de 2002, puis 4,08 % en 2007, devenant l'une des personnalités politiques les plus populaires des enquêtes d'opinion de l'époque.\n\nPour transformer l'essai, la LCR se dissout et fonde en février 2009 le Nouveau Parti anticapitaliste (NPA), qui ambitionne de rassembler l'ensemble de la gauche anticapitaliste au-delà du seul trotskisme. Le pari n'est pas tenu : concurrencé par le Front de gauche puis par La France insoumise sur le terrain de la contestation, traversé de débats internes, le NPA décline. Philippe Poutou, ouvrier de l'automobile connu pour son franc-parler dans les débats télévisés, porte ses couleurs : 1,15 % en 2012, 1,09 % en 2017, 0,77 % en 2022. L'itinéraire LCR-NPA illustre une constante : les percées de l'extrême gauche dépendent moins de ses organisations que des déceptions de la gauche de gouvernement.`,
        },
      },
      {
        id: 'rapport-aux-elections',
        titre: { fr: `Participer sans y croire : les élections comme tribune` },
        corps: {
          fr: `Pourquoi se présenter à des élections quand on ne croit pas qu'elles puissent changer la société ? La réponse de l'extrême gauche tient en un mot hérité de Lénine : la tribune. Une campagne présidentielle offre un accès égal aux médias audiovisuels, des affiches officielles, des débats — une occasion unique de faire entendre des idées absentes du reste du paysage. LO et le NPA se présentent donc pour compter leurs soutiens, former leurs militants et porter la parole de leur camp, sans faire de l'élection un objectif en soi ; ils n'appellent généralement pas à gouverner, et les consignes de vote au second tour y font à chaque fois débat (barrage à l'extrême droite ou refus de choisir « entre deux politiques du capital »).\n\nCe rapport instrumental distingue radicalement l'extrême gauche de la gauche radicale : LFI se présente pour gagner et gouverner. Il explique aussi une partie de ses scores : voter pour un candidat qui annonce qu'il ne gouvernera pas est un vote d'expression, pas d'adhésion à un programme de gouvernement. Quant aux anarchistes, la plupart poussent la logique jusqu'au bout et ne se présentent pas du tout — l'abstention ou le vote blanc y sont des positions politiques assumées.`,
        },
      },
      {
        id: 'rapport-a-lfi-et-a-la-gauche',
        sources: [{ label: `Luke March, Radical Left Parties in Europe, Routledge, 2011 ; Philippe Raynaud, L'Extrême gauche plurielle, Autrement, 2006`, year: 2011 }],
        titre: { fr: `LFI, le PCF et la gauche : qui classe-t-on où ?` },
        corps: {
          fr: `La question qui fâche : La France insoumise est-elle d'extrême gauche ? La majorité des politistes répond non, et la classe dans la « gauche radicale » : LFI participe pleinement au jeu institutionnel (groupes parlementaires, candidatures présidentielles avec vocation de gouverner, primaires de coalition), son programme relève d'un keynésianisme radical — relance, planification écologique, VIe République — et ne prévoit ni abolition révolutionnaire du capitalisme ni disparition de l'État. Sur les critères exposés en tête de dossier, elle ne coche pas les cases de l'extrême gauche. Un classement « extrême gauche » existe néanmoins dans une partie du débat public et médiatique, nourri par la radicalité de son style d'opposition et de certaines de ses positions ; le ministère de l'Intérieur a lui-même rangé des candidats LFI dans des nuances diversement contestées. Poliscop expose les deux lectures : à vous de juger, critères en main.\n\nMême grille pour le PCF : révolutionnaire à sa naissance en 1920, il a participé à des gouvernements (1944-1947, 1981-1984, 1997-2002) et se situe aujourd'hui dans la gauche radicale institutionnelle. L'extrême gauche proprement dite (LO, NPA) entretient d'ailleurs avec cette gauche radicale un rapport critique constant : elle lui reproche par avance ce qu'elle a reproché à toutes les gauches de gouvernement — gérer le système au lieu d'en sortir.`,
        },
      },
      {
        id: 'electorat-et-influence',
        titre: { fr: `Électorat et influence réelle : au-delà des scores` },
        corps: {
          fr: `Juger l'extrême gauche à ses seuls résultats électoraux serait passer à côté de l'essentiel : son influence syndicale, intellectuelle et sociale a toujours excédé son poids dans les urnes. Sur le terrain syndical, des militants trotskistes ou libertaires animent une partie des syndicats SUD (nés avec SUD-PTT en 1988) et de l'union Solidaires, sont présents dans certains secteurs de la CGT et de FSU, et pèsent dans les mobilisations — grèves de 1995, luttes contre les réformes des retraites, conflits d'entreprise. Leur culture militante (assemblées générales, coordination de base, méfiance envers les directions confédérales) marque durablement les mouvements sociaux français.\n\nSur le terrain des idées, l'empreinte est tout aussi réelle : maisons d'édition, revues, historiens et économistes issus de ces traditions, sans compter le nombre remarquable de responsables politiques, de journalistes et d'intellectuels passés dans leur jeunesse par une organisation trotskiste ou maoïste. Sociologiquement, son électorat restant est plus populaire et plus jeune que la moyenne, mais modeste. Le paradoxe se résume ainsi : électoralement marginale, l'extrême gauche est une école de formation militante dont les anciens élèves sont partout — y compris chez ses adversaires.`,
        },
      },
      {
        id: 'international',
        titre: { fr: `Ses équivalents à l'étranger` },
        corps: {
          fr: `Le cas français est singulier : peu de pays comparables ont vu le trotskisme durer aussi longtemps comme force visible, avec des candidats présidentiels réguliers. Ailleurs, la mouvance a existé sous d'autres formes : le courant Militant dans le Labour britannique des années 1980 (avant son exclusion), de multiples organisations aux États-Unis et en Amérique latine — où des partis trotskistes pèsent encore en Argentine. L'anarchisme, lui, a eu son heure historique en Espagne : la CNT anarcho-syndicaliste, forte de plus d'un million de membres, a joué un rôle central pendant la guerre civile (1936-1939).\n\nAttention à ne pas tout confondre : les partis souvent cités comme « gauche radicale » européenne — Syriza en Grèce (au gouvernement de 2015 à 2019), Podemos en Espagne, Die Linke en Allemagne, le Bloco de Esquerda portugais — relèvent précisément de la gauche radicale au sens des politistes, pas de l'extrême gauche : ils gouvernent ou aspirent à gouverner dans le cadre institutionnel. La distinction que ce dossier applique à la France vaut partout en Europe, et la littérature comparatiste l'utilise systématiquement.`,
        },
      },
      {
        id: 'critiques',
        titre: { fr: `Les critiques qui lui sont adressées` },
        corps: {
          fr: `Critique historique, la plus lourde : partout où des révolutionnaires se réclamant du marxisme ont pris le pouvoir, le résultat a été la dictature — URSS, Chine, Cambodge. Les trotskistes répondent que le stalinisme fut précisément la trahison de la révolution, et qu'ils l'ont payé de leur vie (Trotski assassiné en 1940) ; les anarchistes, qu'ils avaient prédit dès Bakounine qu'un État révolutionnaire deviendrait oppresseur. Le débat reste entier : peut-on imputer ces régimes au projet lui-même ou à sa confiscation ?\n\nCritique économique : la collectivisation des moyens de production n'a jamais fonctionné à grande échelle sans pénuries ni contrainte ; l'extrême gauche répond que le capitalisme produit ses propres désastres (crises, inégalités, climat) et que l'alternative reste à inventer démocratiquement. Critique démocratique : le centralisme des organisations léninistes, la discipline interne de certaines d'entre elles, interrogent leur rapport au pluralisme. Critique stratégique enfin, venue souvent de la gauche : en refusant les compromis et parfois les fronts communs, l'extrême gauche affaiblirait le camp du progrès social sans rien construire — « tribuns sans tribunes ». Ses militants assument : témoigner pour une autre société vaut mieux, à leurs yeux, que cogérer celle-ci. À chacun de juger — ce dossier donne les arguments, pas le verdict.`,
        },
      },
      {
        id: 'idees-recues',
        titre: { fr: `Les idées reçues` },
        corps: {
          fr: `« L'extrême gauche est violente » : l'histoire française dit largement l'inverse — un légalisme militant quasi général, une exception (Action directe) marginale et désavouée, sans commune mesure avec l'Italie ou l'Allemagne des années 1970. « L'extrême gauche n'a jamais compté » : électoralement faible, elle a pourtant pesé — Mai 68, ~10,4 % cumulés en 2002, influence syndicale et intellectuelle durable. « LFI est d'extrême gauche » : la majorité des politistes la classe gauche radicale ; le débat existe, les critères permettent de le comprendre (voir la section dédiée). « Extrême gauche et extrême droite, c'est pareil » : la théorie dite « du fer à cheval » est très contestée en science politique — les projets, les histoires et les rapports à l'égalité de ces deux familles sont opposés, ce qui n'empêche pas de comparer précisément tel ou tel point (rapport aux institutions, par exemple) quand c'est documenté.\n\nCes affirmations sont traitées une par une, avec sources, dans le module « Vrai ou faux ? » en bas de page.`,
        },
      },
    ],
  },

  // ── N4 — Pour aller encore plus loin ────────────────────────────────────────
  level4: {
    items: [
      { kind: 'biblio', titre: { fr: `Christophe Bourseiller, Histoire générale de l'ultra-gauche — Denoël, 2003` }, note: { fr: `La somme de référence sur les courants révolutionnaires minoritaires français, de 1920 à nos jours.` } },
      { kind: 'biblio', titre: { fr: `Philippe Raynaud, L'Extrême gauche plurielle — Autrement, 2006` }, note: { fr: `Une analyse de politiste : ce qui unit et sépare trotskistes, libertaires et altermondialistes.` } },
      { kind: 'biblio', titre: { fr: `Luke March, Radical Left Parties in Europe — Routledge, 2011` }, note: { fr: `La distinction comparatiste entre gauche radicale et extrême gauche, appliquée à toute l'Europe.` } },
      { kind: 'lien', titre: { fr: `INA — archives des campagnes et débats d'Arlette Laguiller (1974-2007)` }, note: { fr: `Six campagnes présidentielles en archives : la tribune électorale de l'extrême gauche en pratique.` }, url: 'https://www.ina.fr' },
      { kind: 'lien', titre: { fr: `Conseil constitutionnel — résultats officiels des élections présidentielles` }, note: { fr: `Tous les scores cités dans ce dossier, à la source.` }, url: 'https://www.conseil-constitutionnel.fr' },
    ],
  },

  // ── Chronologie interactive ──────────────────────────────────────────────────
  chronologie: {
    titre: { fr: `Un siècle et demi d'extrême gauche française` },
    events: [
      { date: '1871', titre: { fr: `La Commune de Paris` }, detail: { fr: `Du 18 mars au 28 mai, Paris insurgé s'administre lui-même avant d'être écrasé lors de la Semaine sanglante. La référence fondatrice de tous les courants révolutionnaires — marxistes comme libertaires.` } },
      { date: '1920', titre: { fr: `Le congrès de Tours` }, detail: { fr: `La majorité de la SFIO rejoint l'Internationale communiste de Lénine et fonde le futur PCF. Le communisme français naît d'une scission avec la gauche réformiste de Léon Blum.` } },
      { date: '1938', titre: { fr: `La IVe Internationale` }, detail: { fr: `Trotski, exilé et traqué par Staline (il sera assassiné en 1940), fonde une internationale révolutionnaire opposée à la fois au capitalisme et au stalinisme. Le trotskisme français en descend.` } },
      { date: '1968', titre: { fr: `Mai 68 et les « gauchistes »` }, detail: { fr: `La plus grande grève générale de l'histoire de France. Les petits groupes trotskistes, maoïstes et libertaires — pas le PCF — animent le mouvement étudiant. Toute une génération militante en sort.` } },
      { date: '1974', titre: { fr: `Arlette Laguiller, première femme candidate` }, source: { label: `Conseil constitutionnel — résultats de l'élection présidentielle de 1974`, year: 1974 }, detail: { fr: `La porte-parole de Lutte ouvrière est la première femme candidate à une présidentielle française (2,33 %). Elle se présentera six fois, jusqu'en 2007.` } },
      { date: '1986-1987', titre: { fr: `La fin d'Action directe` }, detail: { fr: `Après l'assassinat de Georges Besse, PDG de Renault (novembre 1986), les dirigeants du groupe armé — dissous par décret dès 1982 et désavoué par toute l'extrême gauche organisée — sont arrêtés en février 1987. L'exception violente se referme.` } },
      { date: '1995', titre: { fr: `La percée de Laguiller` }, source: { label: `Conseil constitutionnel — résultats de l'élection présidentielle de 1995`, year: 1995 }, detail: { fr: `5,30 % à la présidentielle : l'extrême gauche capte une partie de l'électorat populaire déçu de la gauche de gouvernement, quelques mois avant les grandes grèves de décembre 1995.` } },
      { date: '2002', titre: { fr: `Le sommet : ~10,4 % cumulés` }, source: { label: `Conseil constitutionnel — résultats de l'élection présidentielle 2002`, year: 2002 }, detail: { fr: `Au premier tour du 21 avril, les trois candidats trotskistes cumulent environ 10,4 % : Laguiller 5,72 %, Besancenot 4,25 %, Gluckstein 0,47 %. Le plus haut niveau électoral de l'histoire de l'extrême gauche française.` } },
      { date: '2009', titre: { fr: `La LCR devient le NPA` }, detail: { fr: `Portée par les scores d'Olivier Besancenot, la LCR se dissout pour fonder le Nouveau Parti anticapitaliste, ouvert au-delà du trotskisme. L'élargissement espéré n'aura pas lieu.` } },
      { date: '2022', titre: { fr: `Le reflux électoral` }, source: { label: `Conseil constitutionnel — résultats de l'élection présidentielle 2022`, year: 2022 }, detail: { fr: `Nathalie Arthaud (LO) obtient 0,56 %, Philippe Poutou (NPA) 0,77 %. La contestation sociale s'exprime désormais surtout via la gauche radicale — mais l'influence syndicale et militante de l'extrême gauche demeure.` } },
    ],
  },

  // ── Modules liés ─────────────────────────────────────────────────────────────
  vraiFaux: ['vf-eg-lfi', 'vf-eg-violence', 'vf-eg-jamais-compte', 'vf-eg-laguiller-premiere-femme'],

  quiz: [
    {
      question: { fr: `Pour la plupart des politistes, qu'est-ce qui distingue l'extrême gauche de la gauche radicale ?` },
      options: [
        { fr: `L'intensité des convictions : la gauche radicale est simplement moins motivée` },
        { fr: `Le projet : rupture révolutionnaire avec le capitalisme et rapport instrumental aux élections d'un côté, contestation du libéralisme dans le cadre institutionnel de l'autre` },
        { fr: `Rien, ce sont deux mots pour la même chose` },
        { fr: `L'âge des militants` },
      ],
      bonneReponse: 1,
      explication: { fr: `L'extrême gauche (LO, NPA) veut remplacer le capitalisme par la révolution et voit les élections comme une tribune ; la gauche radicale (LFI, PCF pour la plupart des politistes) conteste le libéralisme économique mais participe pleinement au jeu institutionnel pour gouverner.` },
    },
    {
      question: { fr: `Que s'est-il passé au congrès de Tours, en 1920 ?` },
      options: [
        { fr: `La fondation de la SFIO` },
        { fr: `La majorité des socialistes français a rejoint l'Internationale communiste de Lénine, fondant le futur PCF — une scission avec la gauche réformiste` },
        { fr: `L'unification de toute la gauche française` },
        { fr: `La création de Lutte ouvrière` },
      ],
      bonneReponse: 1,
      explication: { fr: `En décembre 1920, la majorité de la SFIO vote l'adhésion à la IIIe Internationale et fonde la Section française de l'Internationale communiste, futur PCF. La minorité de Léon Blum garde « la vieille maison » socialiste. Le communisme français naît d'une scission.` },
    },
    {
      question: { fr: `Qui a été la première femme candidate à une élection présidentielle française ?` },
      options: [
        { fr: `Simone Veil` },
        { fr: `Ségolène Royal` },
        { fr: `Arlette Laguiller, porte-parole de Lutte ouvrière, en 1974` },
        { fr: `Marine Le Pen` },
      ],
      bonneReponse: 2,
      explication: { fr: `En 1974, Arlette Laguiller (Lutte ouvrière) devient la première femme candidate à une présidentielle française. Elle se présentera six fois, de 1974 à 2007, avec un meilleur score de 5,72 % en 2002.` },
    },
    {
      question: { fr: `Que représente le 21 avril 2002 pour l'extrême gauche française ?` },
      options: [
        { fr: `Son plus haut niveau électoral : les trois candidats trotskistes cumulent environ 10,4 % des suffrages` },
        { fr: `Sa disparition définitive` },
        { fr: `Sa première participation à un gouvernement` },
        { fr: `Rien de particulier` },
      ],
      bonneReponse: 0,
      explication: { fr: `Au premier tour de la présidentielle de 2002, Arlette Laguiller (5,72 %), Olivier Besancenot (4,25 %) et Daniel Gluckstein (0,47 %) cumulent environ 10,4 % — le sommet historique. En 2022, les scores étaient retombés sous 1,5 % cumulés.` },
    },
    {
      question: { fr: `La France a-t-elle connu un terrorisme d'extrême gauche comparable aux Brigades rouges italiennes ?` },
      options: [
        { fr: `Oui, à la même échelle` },
        { fr: `Non : la quasi-totalité de l'extrême gauche française est restée légaliste ; Action directe, dissoute par décret en 1982 et démantelée par les arrestations de 1987, fut une exception marginale et désavouée` },
        { fr: `Non, il n'y a jamais eu aucune violence politique en France` },
        { fr: `Oui, mais dans les années 1990` },
      ],
      bonneReponse: 1,
      explication: { fr: `Contrairement à l'Italie des « années de plomb » ou à l'Allemagne de la RAF, la violence armée d'extrême gauche est restée très marginale en France : Action directe (quelques dizaines de membres, assassinat de Georges Besse en 1986, dirigeants arrêtés en 1987) a été désavouée par l'ensemble des organisations d'extrême gauche.` },
    },
  ],

  motsAssocies: ['economie-de-marche', 'proportionnelle', 'motion-de-censure'],

  continuerAvec: [
    { slug: 'gauche', label: { fr: 'La gauche' }, soon: true },
    { slug: 'extreme-droite', label: { fr: `L'extrême droite` }, soon: true },
    { slug: 'droite' },
  ],

  figuresLiees: [
    { nom: 'Arlette Laguiller', note: { fr: 'Lutte ouvrière, première femme candidate à une présidentielle — fiche à venir' } },
    { nom: 'Alain Krivine', note: { fr: 'fondateur de la Ligue communiste révolutionnaire — fiche à venir' } },
    { nom: 'Olivier Besancenot', note: { fr: 'LCR puis NPA, 4,25 % en 2002 — fiche à venir' } },
    { nom: 'Philippe Poutou', note: { fr: 'NPA, candidat en 2012, 2017 et 2022 — fiche à venir' } },
    { nom: 'Nathalie Arthaud', note: { fr: 'porte-parole de Lutte ouvrière depuis 2008 — fiche à venir' } },
  ],

  partisLies: [
    { nom: 'Lutte ouvrière', note: { fr: 'trotskisme « ouvriériste » — fiche à venir' } },
    { nom: 'Nouveau Parti anticapitaliste', note: { fr: 'héritier de la LCR, fondé en 2009 — fiche à venir' } },
    { nom: 'La France insoumise', note: { fr: `n'est volontairement pas listée ici : la plupart des politistes la classent dans la gauche radicale, pas l'extrême gauche (voir la section dédiée)` } },
  ],

  sources: [
    { label: `Christophe Bourseiller, Histoire générale de l'ultra-gauche, Denoël, 2003`, year: 2003 },
    { label: `Philippe Raynaud, L'Extrême gauche plurielle, Autrement, 2006`, year: 2006 },
    { label: `Luke March, Radical Left Parties in Europe, Routledge, 2011`, year: 2011 },
    { label: `Conseil constitutionnel — résultats officiels des élections présidentielles (1969-2022)`, url: 'https://www.conseil-constitutionnel.fr', year: 2022 },
    { label: `Vie-publique.fr — fiches « vie politique » : congrès de Tours, partis politiques, chronologies`, url: 'https://www.vie-publique.fr', year: 2025 },
  ],
};
