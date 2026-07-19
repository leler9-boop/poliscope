/**
 * Fiche panorama « Les partis politiques français » — le dernier grand repère
 * du hub (porte C). Carte de type 'fiche-base' : le paysage partisan en trois
 * blocs, une section par parti (structure identique pour chacun), et la
 * mécanique commune (financement, groupes, militantisme).
 *
 * Régime de fraîcheur 'live' : paysage mouvant, dirigeants datés — chaque
 * dirigeant est donné « à la date de vérification de cette fiche ».
 */

export default {
  slug: 'partis',
  type: 'fiche-base',
  porte: 'C',
  title: { fr: `Les partis politiques français`, en: 'French political parties' },
  icon: '🎪',
  difficulty: 2,
  famille: 'dossier',
  updatedAt: '2026-07-12',
  freshness: { type: 'live', reviewEveryMonths: 3, lastReviewedAt: '2026-07-12' },

  // ── N1 — En 20 secondes ─────────────────────────────────────────────────────
  level1: {
    fr: `Depuis 2017, le paysage politique français s'organise en trois grands blocs — la gauche, le centre et la droite prolongée par l'extrême droite — au lieu de l'ancienne alternance entre deux partis dominants. Les partis sont affaiblis : moins d'adhérents, des noms qui changent, des coalitions mouvantes. Ils restent pourtant incontournables : ce sont eux qui investissent les candidats, financent les campagnes et structurent les débats au Parlement.`,
  },

  // ── N2 — En 3 minutes ───────────────────────────────────────────────────────
  level2: {
    sections: [
      {
        titre: { fr: `Trois blocs depuis 2017` },
        corps: {
          fr: `Pendant des décennies, la vie politique française a tourné autour de deux pôles de gouvernement : la gauche menée par le Parti socialiste, la droite menée par le RPR puis l'UMP-LR. En 2016-2017, tout bascule : Emmanuel Macron fonde En Marche et attire les modérés des deux camps, Jean-Luc Mélenchon lance La France insoumise, et les candidats des deux partis dominants s'effondrent à la présidentielle.\n\nDepuis, le paysage s'organise en trois blocs : un bloc de gauche (LFI, PS, Écologistes, PCF), un bloc central (Renaissance, MoDem, Horizons) et un bloc de droite et d'extrême droite dominé par le RN, avec LR affaibli entre les deux. Attention : un « bloc » n'est pas un parti — chacun est traversé de rivalités, et les frontières bougent à chaque élection. La Constitution, elle, ne connaît que les partis : son article 4 dit qu'ils « concourent à l'expression du suffrage ».`,
        },
        sources: [{ label: `Constitution du 4 octobre 1958, article 4 (Légifrance) ; Vie-publique.fr — « La recomposition de la vie politique depuis 2017 »`, url: 'https://www.vie-publique.fr', year: 2025 }],
      },
      {
        titre: { fr: `Comment lire un parti : discours, programme, action` },
        corps: {
          fr: `Pour juger un parti, il faut distinguer trois choses qui ne coïncident jamais tout à fait. Son discours : ce qu'il dit dans les médias, calibré pour convaincre. Son programme : ses engagements écrits, plus précis et vérifiables. Son action au pouvoir, national ou local : ce qu'il fait réellement quand il gouverne, avec les contraintes du réel — budget, coalitions, droit européen.\n\nDeux erreurs symétriques à éviter : croire un parti sur parole (le résumer à son propre discours), ou le résumer à ce qu'en disent ses adversaires. Cette fiche donne donc, pour chaque parti, les deux faces : la principale réussite qu'il revendique et la principale critique qui lui est adressée. Et pour les partis qui n'ont jamais gouverné nationalement, gardez en tête qu'on compare alors un bilan réel avec des promesses non testées.`,
        },
      },
      {
        titre: { fr: `Pourquoi les partis changent si souvent de nom` },
        brique: 'a-retenir',
        corps: {
          fr: `Un changement de nom sert à tourner une page : défaite, scandale, changement de ligne ou d'image. Quatre généalogies suffisent à s'orienter. RPR (1976) → UMP (2002) → Les Républicains (2015) pour la droite héritière du gaullisme. Front national (1972) → Rassemblement national (2018). En Marche (2016) → La République en marche (2017) → Renaissance (2022). Les Verts (1984) → Europe Écologie-Les Verts (2010) → Les Écologistes (2023). Le nom change, mais la structure, les cadres et l'essentiel de l'électorat restent le plus souvent les mêmes — c'est pourquoi chaque section de cette fiche commence par la généalogie du parti.`,
        },
      },
      {
        titre: { fr: `Parti ≠ groupe parlementaire ≠ coalition électorale` },
        brique: 'confusion',
        corps: {
          fr: `Trois mots que l'actualité mélange sans cesse. Le parti est une organisation durable, qui existe en dehors des élections (Renaissance, LR, PS…). Le groupe parlementaire est une réunion d'élus — au moins 15 députés à l'Assemblée nationale, au moins 10 sénateurs au Sénat — qui donne des droits (temps de parole, commissions) : un groupe peut mêler plusieurs partis, et un parti peut avoir des élus dans plusieurs groupes. La coalition électorale est une alliance conclue pour une élection donnée — la NUPES puis le Nouveau Front populaire à gauche, Ensemble au centre — et qui peut se défaire dès le scrutin passé. Quand on lit « le NFP a obtenu tant de sièges », il s'agit donc d'une coalition de plusieurs partis, pas d'un parti.`,
        },
      },
    ],
  },

  // ── N3 — Tout comprendre : une section par parti, puis la mécanique ─────────
  level3: {
    sections: [
      {
        id: 'renaissance',
        titre: { fr: `Renaissance` },
        corps: {
          fr: `Généalogie : fondé en avril 2016 par Emmanuel Macron sous le nom En Marche, devenu La République en marche après la victoire de 2017, puis Renaissance en septembre 2022. Positionnement : le parti se dit central, « et de droite et de gauche » ; les politistes débattent — centre pour les uns, centre-droit pour d'autres, surtout au vu des politiques menées depuis 2022 (voir les fiches centre et droite). Idées principales : construction européenne, réformes favorables aux entreprises, dépassement revendiqué du clivage gauche-droite. Électorat en une ligne : plutôt âgé, diplômé, urbain et aisé. Dirigeant : Gabriel Attal, secrétaire général depuis fin 2024, à la date de vérification de cette fiche. Résultats marquants : deux présidentielles gagnées (2017, 2022), perte de la majorité absolue en 2022, net recul aux législatives de 2024. Principale critique : un parti construit autour d'un seul homme, sans implantation locale solide. Principale réussite revendiquée : avoir gagné deux présidentielles consécutives et gouverné depuis 2017.`,
        },
        sources: [{ label: `Vie-publique.fr — fiches partis ; Conseil constitutionnel — résultats des présidentielles 2017 et 2022`, url: 'https://www.vie-publique.fr', year: 2025 }],
      },
      {
        id: 'les-republicains',
        titre: { fr: `Les Républicains` },
        corps: {
          fr: `Généalogie : l'héritier de la lignée gaulliste — RPF (1947), UNR (1958), UDR, RPR fondé par Jacques Chirac en 1976, UMP en 2002, Les Républicains en 2015. En juin 2024, le parti se scinde : son président Éric Ciotti part fonder l'UDR, alliée au RN. Positionnement : droite, de sensibilité libérale-conservatrice. Idées principales : autorité et sécurité, maîtrise des dépenses publiques, réduction de l'immigration, défense des territoires. Électorat en une ligne : plutôt âgé, périurbain et rural, catholique. Dirigeant : Bruno Retailleau, élu président en mai 2025, à la date de vérification de cette fiche. Résultats marquants : parti dominant de la droite pendant des décennies (Chirac, Sarkozy), puis effondrement présidentiel — Valérie Pécresse obtient 4,78 % en 2022. Principale critique : pris en étau entre le bloc central et le RN, il peine à trancher sa ligne. Principale réussite revendiquée : le réseau d'élus locaux et de sénateurs le plus dense de la droite.`,
        },
        sources: [{ label: `Conseil constitutionnel — résultats de l'élection présidentielle 2022 ; Vie-publique.fr — les élections législatives de 2024`, url: 'https://www.conseil-constitutionnel.fr', year: 2024 }],
      },
      {
        id: 'rassemblement-national',
        titre: { fr: `Rassemblement national` },
        corps: {
          fr: `Généalogie : Front national, fondé en octobre 1972, renommé Rassemblement national en juin 2018. Positionnement : classé à l'extrême droite par la plupart des politistes (certains préfèrent « droite radicale ») — classement que le parti conteste ; la fiche extrême droite détaille les critères de ce débat. Idées principales : réduction drastique de l'immigration, priorité nationale, sécurité, pouvoir d'achat. Électorat en une ligne : le plus populaire des grands partis — ouvriers, employés, zones périurbaines et rurales. Dirigeants : Jordan Bardella, président depuis 2022, et Marine Le Pen, présidente du groupe à l'Assemblée, à la date de vérification de cette fiche. Résultats marquants : second tour présidentiel en 2017 et 2022, premier parti en voix aux législatives de 2024. En mars 2025, Marine Le Pen et plusieurs cadres ont été condamnés en première instance (détournement de fonds publics) ; elle a fait appel, et la présomption d'innocence s'applique aux faits qu'elle conteste. Principale critique : un projet jugé contraire au principe d'égalité par ses opposants. Principale réussite revendiquée : être devenu le premier parti de France en voix.`,
        },
        sources: [{ label: `Ministère de l'Intérieur — résultats officiels des législatives 2024 ; Vie-publique.fr — fiches partis`, url: 'https://www.interieur.gouv.fr', year: 2024 }],
      },
      {
        id: 'la-france-insoumise',
        titre: { fr: `La France insoumise` },
        corps: {
          fr: `Généalogie : mouvement fondé en février 2016 par Jean-Luc Mélenchon, en dehors des structures partisanes classiques. Positionnement : gauche radicale pour la majorité des politistes ; le mouvement, lui, préfère parler de « gauche populaire ». Particularité : LFI n'est pas un parti classique — pas d'adhésion traditionnelle ni de congrès élisant la direction, un fonctionnement critiqué jusque dans ses propres rangs (critique interne documentée sur la gouvernance). Idées principales : rupture avec les politiques libérales, VIe République, planification écologique, hausse des salaires. Électorat en une ligne : jeune, urbain, présent dans les quartiers populaires. Dirigeant : Manuel Bompard, coordinateur, à la date de vérification de cette fiche. Résultats marquants : Mélenchon obtient 19,58 % en 2017 puis 21,95 % en 2022, à moins de deux points du second tour ; moteur de la NUPES (2022) puis du NFP (2024). Principale critique : une gouvernance jugée verticale, sans réels contre-pouvoirs internes. Principale réussite revendiquée : avoir refait de sa ligne la première force électorale de la gauche.`,
        },
        sources: [{ label: `Conseil constitutionnel — résultats des présidentielles 2017 et 2022`, url: 'https://www.conseil-constitutionnel.fr', year: 2022 }],
      },
      {
        id: 'parti-socialiste',
        titre: { fr: `Parti socialiste` },
        corps: {
          fr: `Généalogie : héritier de la SFIO fondée en 1905 (Jean Jaurès), devenu Parti socialiste en 1969 et refondé au congrès d'Épinay en 1971 autour de François Mitterrand. Positionnement : gauche sociale-démocrate, gauche « de gouvernement ». Idées principales : redistribution, services publics, Europe sociale, transition écologique. Électorat en une ligne : fonction publique, diplômés des métropoles et villes moyennes, retraités de gauche. Dirigeant : Olivier Faure, premier secrétaire, réélu en 2025, à la date de vérification de cette fiche. Résultats marquants : deux présidents de la République (Mitterrand 1981-1995, Hollande 2012-2017) ; effondrement en 2017 (6,36 %) puis en 2022 (1,75 %) ; remontée relative via la NUPES puis le NFP, et aux européennes de 2024 avec la liste commune menée par Raphaël Glucksmann (environ 13,8 %). Principale critique : une ligne indécise, entre alliance avec LFI et social-démocratie autonome. Principale réussite revendiquée : les grandes réformes de ses gouvernements — abolition de la peine de mort (1981), 35 heures, mariage pour tous (2013).`,
        },
        sources: [{ label: `Ministère de l'Intérieur — résultats officiels des élections européennes 2024 ; Conseil constitutionnel — présidentielles 2017 et 2022`, url: 'https://www.interieur.gouv.fr', year: 2024 }],
      },
      {
        id: 'les-ecologistes',
        titre: { fr: `Les Écologistes` },
        corps: {
          fr: `Généalogie : Les Verts, fondés en 1984, devenus Europe Écologie-Les Verts en 2010 puis Les Écologistes en 2023. Positionnement : écologie politique, ancrée à gauche. Idées principales : transition climatique rapide, sortie du nucléaire, justice sociale, féminisme. Électorat en une ligne : urbain, jeune, très diplômé. Dirigeante : Marine Tondelier, secrétaire nationale, à la date de vérification de cette fiche. Résultats marquants : les européennes sont leur meilleur scrutin — 13,5 % en 2019 — et les municipales de 2020 leur ont donné de grandes villes (Lyon, Strasbourg, Bordeaux) ; la présidentielle reste leur point faible, Yannick Jadot obtenant 4,63 % en 2022. Membres de la NUPES puis du NFP. Principale critique : des divisions internes récurrentes et une incapacité à transformer les succès intermédiaires en poids national. Principale réussite revendiquée : avoir imposé le climat dans l'agenda de tous les partis et fait leurs preuves à la tête de grandes métropoles.`,
        },
        sources: [{ label: `Ministère de l'Intérieur — résultats officiels des européennes 2019 et des municipales 2020`, url: 'https://www.interieur.gouv.fr', year: 2020 }],
      },
      {
        id: 'parti-communiste',
        titre: { fr: `Parti communiste français` },
        corps: {
          fr: `Généalogie : fondé au congrès de Tours, en décembre 1920, par scission de la SFIO. Positionnement : gauche, tradition communiste. Idées principales : hausse des salaires, défense des services publics, souveraineté industrielle, paix. Électorat en une ligne : ouvrier et populaire historiquement, aujourd'hui vieillissant et concentré dans ses bastions municipaux. Dirigeant : Fabien Roussel, secrétaire national, à la date de vérification de cette fiche. Résultats marquants : premier parti de gauche jusqu'aux années 1970 — Georges Marchais obtient encore 15,35 % en 1981 —, participation aux gouvernements de la Libération, de 1981-1984 et de 1997-2002 ; déclin électoral profond depuis (Roussel : 2,28 % en 2022), mais un ancrage municipal persistant, héritage de la « banlieue rouge ». Principale critique : un long alignement passé sur l'URSS et un déclin jamais enrayé. Principale réussite revendiquée : un rôle central dans les conquêtes sociales de la Libération — Sécurité sociale, statut des électriciens-gaziers, comités d'entreprise.`,
        },
        sources: [{ label: `Conseil constitutionnel — résultats des présidentielles 1981 et 2022 ; Vie-publique.fr — fiches partis`, url: 'https://www.conseil-constitutionnel.fr', year: 2022 }],
      },
      {
        id: 'modem',
        titre: { fr: `Mouvement démocrate (MoDem)` },
        corps: {
          fr: `Généalogie : fondé en 2007 par François Bayrou, héritier de l'UDF et de la tradition démocrate-chrétienne du centre. Positionnement : centre — la fiche centre détaille cette famille. Idées principales : construction européenne, scrutin proportionnel, sérieux budgétaire, moralisation de la vie publique. Électorat en une ligne : modéré, plutôt âgé et diplômé, attaché au compromis. Dirigeant : François Bayrou, président du parti — nommé Premier ministre en décembre 2024 —, à la date de vérification de cette fiche. Résultats marquants : 18,57 % pour Bayrou à la présidentielle de 2007, meilleur score du centre indépendant sous la Ve République ; allié d'Emmanuel Macron depuis 2017, le MoDem est un groupe pivot des majorités successives. Principale critique : une forte dépendance à son fondateur et à l'alliance avec le bloc présidentiel. Principale réussite revendiquée : avoir fait vivre un centre autonome pendant près de vingt ans, jusqu'à Matignon.`,
        },
        sources: [{ label: `Conseil constitutionnel — résultats de l'élection présidentielle 2007`, url: 'https://www.conseil-constitutionnel.fr', year: 2007 }],
      },
      {
        id: 'horizons',
        titre: { fr: `Horizons` },
        corps: {
          fr: `Généalogie : fondé en octobre 2021 par Édouard Philippe, ancien Premier ministre (2017-2020) venu des Républicains, qu'il avait quittés après son ralliement à Emmanuel Macron. Positionnement : droite libérale, compatible avec le bloc central — membre de la coalition présidentielle tout en cultivant son autonomie. Idées principales : sérieux budgétaire, valorisation du travail, décentralisation, relance du nucléaire. Électorat en une ligne : centre-droit modéré, cadres, élus locaux. Dirigeant : Édouard Philippe, président, à la date de vérification de cette fiche ; il a annoncé dès 2024 sa candidature à la présidentielle de 2027. Résultats marquants : un groupe parlementaire propre depuis 2022 et un réseau croissant de maires — dont Le Havre, la ville de son fondateur. Le parti n'a encore jamais affronté seul une élection nationale. Principale critique : une écurie présidentielle personnelle plus qu'un parti d'idées. Principale réussite revendiquée : une implantation rapide chez les élus locaux et une position charnière dans la majorité.`,
        },
        sources: [{ label: `Vie-publique.fr — fiches partis et résultats des législatives 2022`, url: 'https://www.vie-publique.fr', year: 2024 }],
      },
      {
        id: 'reconquete',
        titre: { fr: `Reconquête` },
        corps: {
          fr: `Généalogie : fondé en décembre 2021 par Éric Zemmour, polémiste venu des médias. Positionnement : classé à l'extrême droite par les politistes (voir la fiche extrême droite), sur une ligne plus identitaire que le RN — il reprend notamment l'expression « grand remplacement », théorie que les chercheurs qualifient de complotiste. Idées principales : réduction drastique de l'immigration, assimilation, union des droites ; libéral en économie, à la différence du RN. Électorat en une ligne : droite radicale plutôt urbaine et aisée, jeunes militants venus du RN et de LR. Dirigeant : Éric Zemmour, président, à la date de vérification de cette fiche. Résultats marquants : 7,07 % à la présidentielle de 2022, aucun député en 2022 ni en 2024 ; après les européennes de 2024, Marion Maréchal et de nombreux cadres quittent le parti. Principale critique : l'échec de la stratégie d'« union des droites » et l'hémorragie de ses cadres. Principale réussite revendiquée : avoir imposé ses thèmes dans la campagne présidentielle de 2022.`,
        },
        sources: [{ label: `Conseil constitutionnel — résultats de l'élection présidentielle 2022 ; Ministère de l'Intérieur — européennes 2024`, url: 'https://www.conseil-constitutionnel.fr', year: 2024 }],
      },
      {
        id: 'autres-partis',
        titre: { fr: `Les autres partis, en bref` },
        corps: {
          fr: `UDI : centre-droit, fondée en 2012 par Jean-Louis Borloo pour fédérer les héritiers de l'UDF ; alliée selon les scrutins à LR ou au bloc central. Debout la France : souverainiste, fondé en 2008 par Nicolas Dupont-Aignan, ancien du RPR. Génération.s : gauche écologiste, fondé en 2017 par Benoît Hamon après sa défaite présidentielle. Place publique : fondé en 2018 autour de Raphaël Glucksmann, allié du PS aux européennes de 2019 et 2024. NPA : extrême gauche, fondé en 2009, héritier de la Ligue communiste révolutionnaire (Philippe Poutou en fut le candidat). Lutte ouvrière : trotskiste, présente à toutes les présidentielles depuis 1974 (Arlette Laguiller, puis Nathalie Arthaud). Partis régionalistes : autonomistes corses (Femu a Corsica), bretons (UDB), basques ou ultramarins — faibles nationalement, ils pèsent dans leurs territoires et comptent des élus au Parlement. Ces formations rappellent qu'entre les grands blocs, le paysage reste peuplé de partis petits mais durables.`,
        },
        sources: [{ label: `Vie-publique.fr — fiches partis ; CNCCFP — liste des partis et groupements politiques`, url: 'https://www.cnccfp.fr', year: 2025 }],
      },
      {
        id: 'financement-des-partis',
        titre: { fr: `Comment les partis sont financés` },
        corps: {
          fr: `Depuis les lois de 1988-1995, l'argent des partis est encadré et contrôlé. Le financement public est versé en deux fractions : la première selon les résultats aux législatives — environ 1,64 € par voix et par an (montant 2024), sous conditions de score, avec une retenue pour les partis qui ne respectent pas la parité des candidatures — ; la seconde selon le nombre de parlementaires, environ 37 000 € par parlementaire et par an (montant 2024). S'y ajoutent les cotisations des adhérents et des élus, et les dons de particuliers, plafonnés à 7 500 € par personne et par an. Les dons des entreprises et de toutes les « personnes morales » sont interdits depuis 1995 — le financement public est la contrepartie de cette interdiction. Chaque parti dépose des comptes certifiés auprès de la CNCCFP, qui les contrôle et les publie. Pour la plupart des grands partis, l'argent public et les contributions d'élus forment l'essentiel des ressources : les résultats électoraux déterminent donc aussi la santé financière.`,
        },
        sources: [
          { label: `CNCCFP — financement des partis : aide publique, plafonds de dons, publication des comptes (montants 2024)`, url: 'https://www.cnccfp.fr', year: 2024 },
          { label: `Loi du 19 janvier 1995 relative au financement de la vie politique (Légifrance)`, url: 'https://www.legifrance.gouv.fr', year: 1995 },
        ],
      },
      {
        id: 'groupes-et-coalitions',
        titre: { fr: `Groupes parlementaires et coalitions : la mécanique des alliances` },
        corps: {
          fr: `Le parti fait campagne ; le groupe parlementaire agit au Parlement ; la coalition gagne (ou perd) les élections. Un groupe exige au moins 15 députés à l'Assemblée nationale (10 sénateurs au Sénat) et donne des moyens concrets : temps de parole, postes en commission, journées d'initiative parlementaire. D'où des mariages de raison : des petits partis s'agrègent à un groupe plus grand, et un même parti peut avoir des élus dans plusieurs groupes. Les coalitions électorales, elles, se nouent avant le scrutin pour éviter l'éparpillement des voix : la NUPES en 2022 puis le Nouveau Front populaire en 2024 à gauche, Ensemble au centre — chaque parti y garde son existence, ses instances et son financement propres. Ces alliances peuvent se défaire vite : la NUPES n'a pas survécu à la législature. Réflexe utile devant un résultat d'élection : toujours vérifier si le chiffre annoncé compte un parti, un groupe ou une coalition — les trois donnent des classements différents.`,
        },
        sources: [{ label: `Règlement de l'Assemblée nationale (article 19) et du Sénat — constitution des groupes ; Vie-publique.fr — « les coalitions électorales »`, url: 'https://www.assemblee-nationale.fr', year: 2024 }],
      },
      {
        id: 'declin-et-mutation-du-militantisme',
        titre: { fr: `Le déclin — et la mutation — du militantisme` },
        corps: {
          fr: `Dans les années 1970-1980, adhérer à un parti était un engagement de masse : le PCF revendiquait à lui seul des centaines de milliers de cartes. Aujourd'hui, tous les partis français cumulés revendiquent quelques centaines de milliers d'adhérents — et encore ces chiffres sont-ils déclaratifs et invérifiables : aucun organisme indépendant ne les contrôle, et chaque parti a intérêt à les gonfler. Les politistes y voient moins une dépolitisation qu'une mutation : l'engagement se fait plus ponctuel (pétitions, manifestations, campagnes en ligne), les adhésions à quelques euros remplacent la carte militante, et l'action passe aussi par les associations ou les collectifs. Conséquence pour les partis : devenus des machines électorales resserrées, financées surtout par l'argent public, ils ont moins de vie locale et de remontées de terrain — ce qui alimente en retour la défiance à leur égard. Le paradoxe est là : jamais les partis n'ont eu si peu de membres, et jamais les institutions n'ont autant reposé sur eux.`,
        },
        sources: [{ label: `Vie-publique.fr — « Les partis politiques en France : quelle évolution du militantisme ? » (chiffres d'adhérents déclaratifs)`, url: 'https://www.vie-publique.fr', year: 2025 }],
      },
    ],
  },

  // ── Chronologie ──────────────────────────────────────────────────────────────
  chronologie: {
    titre: { fr: `Un siècle de partis français` },
    events: [
      { date: '1901', titre: { fr: `La loi sur les associations` }, detail: { fr: `La loi du 1er juillet 1901 crée la liberté d'association : c'est sous ce simple statut que vivront les partis politiques français. La Constitution de 1958 (article 4) leur reconnaîtra ensuite un rôle propre : « concourir à l'expression du suffrage ».` } },
      { date: '1920', titre: { fr: `Le congrès de Tours` }, detail: { fr: `La SFIO se scinde : la majorité fonde ce qui deviendra le Parti communiste français, la minorité conserve la « vieille maison » socialiste. La gauche française restera durablement partagée entre ces deux traditions.` } },
      { date: '1971', titre: { fr: `Le congrès d'Épinay` }, detail: { fr: `François Mitterrand prend la tête du nouveau Parti socialiste et engage l'union de la gauche. Le PS supplantera le PCF comme premier parti de gauche et conquerra l'Élysée en 1981.` } },
      { date: '1972', titre: { fr: `Fondation du Front national` }, detail: { fr: `Le Front national est fondé en octobre 1972, avec Jean-Marie Le Pen à sa tête. Marginal pendant une décennie, il perce aux européennes de 1984 et s'installe durablement dans le paysage.` } },
      { date: '1976', titre: { fr: `Chirac fonde le RPR` }, detail: { fr: `Jacques Chirac transforme le mouvement gaulliste (RPF, puis UNR et UDR) en Rassemblement pour la République. Le RPR dominera la droite jusqu'à sa fusion dans l'UMP.` } },
      { date: '2002', titre: { fr: `L'UMP unifie la droite` }, detail: { fr: `Après le choc du 21 avril 2002, RPR, Démocratie libérale et une partie de l'UDF fusionnent dans l'UMP derrière Jacques Chirac — la tentative d'unification de la droite la plus aboutie, rebaptisée Les Républicains en 2015.` } },
      { date: '2016-2017', titre: { fr: `La grande recomposition` }, detail: { fr: `En février 2016, Jean-Luc Mélenchon lance La France insoumise ; en avril, Emmanuel Macron fonde En Marche. En 2017, les candidats du PS et de LR sont éliminés dès le premier tour : les deux partis qui alternaient au pouvoir depuis 1981 s'effondrent, et le paysage se réorganise en trois blocs.` } },
      { date: '2018', titre: { fr: `Le FN devient le RN` }, detail: { fr: `Le Front national se rebaptise Rassemblement national — un changement de nom au service de la stratégie de normalisation engagée par Marine Le Pen, analysée dans la fiche extrême droite.` } },
      { date: '2022', titre: { fr: `L'ère des coalitions : NUPES et Ensemble` }, detail: { fr: `Aux législatives, les partis de gauche s'unissent dans la NUPES tandis que le bloc présidentiel se présente sous la bannière Ensemble. La vie politique se structure désormais par coalitions autant que par partis.` } },
      { date: '2024', titre: { fr: `NFP et scission des Républicains` }, source: { label: `Vie-publique.fr — les élections législatives de 2024`, year: 2024 }, detail: { fr: `Après la dissolution, la gauche se rassemble dans le Nouveau Front populaire ; à droite, le président de LR Éric Ciotti annonce une alliance avec le RN et fait scission pour fonder l'UDR. Le RN devient le premier parti en voix, sans majorité.` } },
    ],
  },

  vraiFaux: ['vf-partis-argent-public', 'vf-partis-tous-pareils', 'vf-partis-rn-premier-parti', 'vf-partis-carte-obligatoire'],

  quiz: [
    {
      question: { fr: `Quel parti actuel est l'héritier de la lignée gaulliste RPR → UMP ?` },
      options: [
        { fr: `Renaissance` },
        { fr: `Les Républicains` },
        { fr: `Le Rassemblement national` },
        { fr: `Horizons` },
      ],
      bonneReponse: 1,
      explication: { fr: `La généalogie complète : RPF (1947) → UNR (1958) → UDR → RPR (1976, Chirac) → UMP (2002) → Les Républicains (2015). Horizons est une création récente (2021) et le RN descend du Front national, une histoire distincte.` },
    },
    {
      question: { fr: `Depuis 1995, qui n'a plus le droit de financer les partis politiques ?` },
      options: [
        { fr: `Les particuliers` },
        { fr: `Les adhérents` },
        { fr: `Les entreprises et toutes les personnes morales` },
        { fr: `L'État` },
      ],
      bonneReponse: 2,
      explication: { fr: `La loi du 19 janvier 1995 interdit tout don des personnes morales (entreprises, associations…). En contrepartie, l'État verse une aide publique calculée sur les résultats électoraux et le nombre de parlementaires. Les dons de particuliers restent possibles, plafonnés à 7 500 € par an.` },
    },
    {
      question: { fr: `Depuis 2017, le paysage politique français s'organise principalement en…` },
      options: [
        { fr: `Deux blocs, comme avant : la gauche et la droite` },
        { fr: `Trois blocs : gauche, centre, droite-extrême droite` },
        { fr: `Un parti unique dominant` },
        { fr: `Une multitude de partis sans structure` },
      ],
      bonneReponse: 1,
      explication: { fr: `L'élection de 2017 a fait éclater l'alternance PS/LR au profit d'une tripartition : bloc de gauche, bloc central, bloc de droite et d'extrême droite dominé par le RN. Les législatives de 2022 et 2024 ont confirmé cette structure — mouvante, mais durable.` },
    },
    {
      question: { fr: `La NUPES (2022) et le Nouveau Front populaire (2024) sont…` },
      options: [
        { fr: `Des partis politiques` },
        { fr: `Des groupes parlementaires` },
        { fr: `Des coalitions électorales réunissant plusieurs partis` },
        { fr: `Des syndicats` },
      ],
      bonneReponse: 2,
      explication: { fr: `Ce sont des alliances conclues pour une élection : chaque parti membre (LFI, PS, Écologistes, PCF…) garde son existence, ses instances et son financement. Une coalition peut se défaire après le scrutin — la NUPES n'a pas survécu à la législature.` },
    },
    {
      question: { fr: `Qui contrôle les comptes des partis politiques en France ?` },
      options: [
        { fr: `Le ministère de l'Intérieur` },
        { fr: `La CNCCFP, une commission indépendante` },
        { fr: `Personne : les comptes sont secrets` },
        { fr: `Les partis se contrôlent entre eux` },
      ],
      bonneReponse: 1,
      explication: { fr: `La Commission nationale des comptes de campagne et des financements politiques (CNCCFP) reçoit chaque année les comptes certifiés des partis, les contrôle et les publie. Un parti qui ne dépose pas ses comptes peut perdre son financement public.` },
    },
  ],

  // ── N4 — Pour aller encore plus loin ────────────────────────────────────────
  level4: {
    items: [
      { kind: 'lien', titre: { fr: `CNCCFP — les comptes des partis politiques` }, note: { fr: `L'autorité indépendante qui contrôle et publie chaque année les comptes des partis : la source la plus fiable sur leur financement réel.` }, url: 'https://www.cnccfp.fr' },
      { kind: 'lien', titre: { fr: `Vie-publique.fr — fiches « partis politiques »` }, note: { fr: `Fiches publiques, gratuites et sourcées : histoire des partis, financement de la vie politique, résultats électoraux.` }, url: 'https://www.vie-publique.fr' },
      { kind: 'biblio', titre: { fr: `Michel Offerlé, Les Partis politiques — PUF, coll. « Que sais-je ? »` }, note: { fr: `Une synthèse de science politique courte et accessible sur ce qu'est un parti, comment il vit et à quoi il sert.` } },
      { kind: 'biblio', titre: { fr: `Rémi Lefebvre et Frédéric Sawicki, La Société des socialistes — Éditions du Croquant, 2006` }, note: { fr: `Une enquête de référence sur le militantisme et la transformation d'un grand parti — utile pour comprendre, au-delà du cas socialiste, ce que devient une organisation partisane.` } },
      { kind: 'lien', titre: { fr: `Les sites officiels des partis` }, note: { fr: `Chaque parti publie son programme et ses statuts sur son site : sources utiles mais partisanes par nature — elles présentent le discours du parti sur lui-même, à croiser avec les sources indépendantes.` } },
    ],
  },

  motsAssocies: [
    'proportionnelle',
    'motion-de-censure',
    { label: { fr: `Groupe parlementaire` }, soon: true },
    { label: { fr: `Primaire` }, soon: true },
  ],

  continuerAvec: [
    { slug: 'droite' },
    { slug: 'gauche' },
    { slug: 'elections' },
  ],

  sources: [
    { label: `CNCCFP — publication des comptes des partis, aide publique et plafonds de dons (montants 2024)`, url: 'https://www.cnccfp.fr', year: 2024 },
    { label: `Vie-publique.fr — fiches « partis politiques », « financement de la vie politique », « recomposition depuis 2017 »`, url: 'https://www.vie-publique.fr', year: 2025 },
    { label: `Conseil constitutionnel — résultats officiels des élections présidentielles (1981-2022)`, url: 'https://www.conseil-constitutionnel.fr', year: 2022 },
    { label: `Ministère de l'Intérieur — résultats officiels des législatives et des européennes 2024`, url: 'https://www.interieur.gouv.fr', year: 2024 },
    { label: `Légifrance — lois du 11 mars 1988 et du 19 janvier 1995 sur le financement de la vie politique ; Constitution, article 4`, url: 'https://www.legifrance.gouv.fr', year: 1995 },
  ],
};
