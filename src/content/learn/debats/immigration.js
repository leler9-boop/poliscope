/**
 * Fiche débat « L'immigration » — dossier structurant (docs/jyconnaisrien/02, §9).
 * Sujet le plus sensible du catalogue : chaque chiffre est daté, sourcé et périmétré ;
 * chaque camp est présenté par ses propres arguments. Garde-fou central : ne JAMAIS
 * confondre immigré / étranger / réfugié / demandeur d'asile (00-vision, §5).
 * Régime live : données annuelles (INSEE, Intérieur, OFPRA) et droit mouvant.
 */

export default {
  slug: 'immigration',
  type: 'debat',
  porte: 'F3',
  title: { fr: `L'immigration`, en: 'Immigration' },
  icon: '🌍',
  difficulty: 2,
  famille: 'dossier',
  updatedAt: '2026-07-12',
  freshness: { type: 'live', reviewEveryMonths: 3, lastReviewedAt: '2026-07-12' },

  // ── N1 ──────────────────────────────────────────────────────────────────────
  level1: {
    fr: `Un immigré est une personne née étrangère à l'étranger et installée en France — environ 7 millions de personnes, soit un peu plus de 10 % de la population (INSEE, 2023), dont environ un tiers sont devenues françaises. Le débat mélange trois questions distinctes : combien accueillir, comment réussir l'intégration, et ce que l'immigration change au pays. Première étape pour s'y retrouver : les mots, car immigré, étranger, réfugié et demandeur d'asile ne désignent pas les mêmes personnes.`,
  },

  // ── N2 ──────────────────────────────────────────────────────────────────────
  level2: {
    sections: [
      {
        titre: { fr: `Pourquoi en parle-t-on ?` },
        corps: {
          fr: `L'immigration est l'un des sujets les plus présents du débat politique français depuis quarante ans, et l'un de ceux où l'écart entre les perceptions et les données mesurées est le plus documenté. Trois raisons à cette place centrale : c'est un sujet où se croisent économie, démographie, identité et politique internationale ; c'est un marqueur qui sépare fortement les familles politiques, de la libre circulation revendiquée à la réduction drastique ; et c'est un terrain où circulent énormément de chiffres faux ou sortis de leur périmètre — dans tous les camps. Cette fiche donne les définitions, les ordres de grandeur sourcés et les vraies lignes de désaccord, pour suivre le débat sans le subir.`,
        },
      },
      {
        titre: { fr: `Les mots indispensables` },
        brique: 'glossaire',
        termes: [
          { nom: { fr: 'Immigré' }, def: { fr: `Personne née étrangère à l'étranger et résidant en France (définition statistique de l'INSEE). On reste immigré toute sa vie — y compris après être devenu français, ce qui est le cas d'environ un tiers des immigrés.` } },
          { nom: { fr: 'Étranger' }, def: { fr: `Personne qui n'a pas la nationalité française, où qu'elle soit née. Un étranger peut être né en France (environ 0,8 million de personnes) ; un immigré peut être français. Les deux mots ne sont pas synonymes.` } },
          { nom: { fr: `Descendant d'immigré` }, def: { fr: `Personne née en France dont au moins un parent est immigré (la « deuxième génération » des statistiques). Un descendant d'immigré n'est pas un immigré — et il est le plus souvent français.` } },
          { nom: { fr: `Demandeur d'asile` }, def: { fr: `Personne qui demande une protection à la France en tant que persécutée ou menacée dans son pays, et dont la demande est en cours d'examen. Ce n'est ni un statut définitif, ni un synonyme de « réfugié ».` } },
          { nom: { fr: 'Réfugié' }, def: { fr: `Personne dont la demande d'asile a été acceptée : la France lui reconnaît une protection au titre de la convention de Genève de 1951 (ou une protection subsidiaire, régime voisin).` } },
          { nom: { fr: 'Titre de séjour' }, def: { fr: `Document autorisant un étranger non européen à résider légalement en France (étudiant, familial, économique, humanitaire…). Environ 320 000 à 330 000 premiers titres sont délivrés par an ces dernières années (ministère de l'Intérieur).` } },
          { nom: { fr: 'Régularisation' }, def: { fr: `Délivrance d'un titre de séjour à une personne présente sans droit au séjour, au cas par cas et selon des critères (ancienneté, travail, famille — circulaire Valls de 2012, puis loi de 2024 pour les métiers en tension).` } },
        ],
      },
      {
        titre: { fr: `Les faits principaux` },
        corps: {
          fr: `Les grands ordres de grandeur, à connaître avant tout débat : environ 7 millions d'immigrés vivent en France, soit un peu plus de 10 % de la population (INSEE, recensement, données 2022-2023) — une proportion proche de la moyenne de l'Union européenne. Environ un tiers d'entre eux ont acquis la nationalité française. Les étrangers sont environ 5,6 millions (8,2 % de la population), dont 0,8 million nés en France. S'y ajoutent environ 7,5 millions de descendants d'immigrés, nés en France.\n\nCôté flux : environ 320 000 à 330 000 premiers titres de séjour délivrés par an ces dernières années (dont environ un tiers pour études, un quart pour motif familial et 15 % pour motif économique), et 140 000 à 160 000 demandes d'asile par an (OFPRA). Les premiers pays de naissance des immigrés restent l'Algérie, le Maroc, le Portugal, la Tunisie, l'Italie, la Turquie et l'Espagne — l'immigration européenne, souvent oubliée du débat, en représente une part importante.`,
        },
        sources: [
          { label: `INSEE — Immigrés et étrangers en France, chiffres clés du recensement`, url: 'https://www.insee.fr', year: 2023, perimetre: `France, définitions statistiques INSEE (immigré = né étranger à l'étranger)` },
          { label: `Ministère de l'Intérieur (DGEF) — statistiques annuelles des titres de séjour`, url: 'https://www.interieur.gouv.fr', year: 2024, perimetre: `premiers titres, ressortissants de pays tiers (hors citoyens de l'UE)` },
        ],
      },
      {
        titre: { fr: `Immigré ≠ étranger` },
        brique: 'confusion',
        corps: {
          fr: `C'est LA confusion qui fausse le plus de débats. « Immigré » décrit un lieu de naissance (né étranger à l'étranger) ; « étranger » décrit une nationalité (ne pas être français aujourd'hui). Entre un quart et un tiers des immigrés sont devenus français par acquisition de nationalité : ils sont immigrés et français. Inversement, environ 0,8 million d'étrangers sont nés en France : ils sont étrangers sans être immigrés. Un chiffre sur « les immigrés » et un chiffre sur « les étrangers » ne comptent donc pas les mêmes personnes — vérifiez toujours lequel des deux mots est utilisé, et méfiez-vous de toute phrase qui les échange en cours de route.`,
        },
        sources: [{ label: `INSEE — définitions « immigré » et « étranger » (recensement)`, url: 'https://www.insee.fr', year: 2023 }],
      },
    ],
  },

  // ── N3 ──────────────────────────────────────────────────────────────────────
  level3: {
    sections: [
      {
        id: 'chiffres',
        titre: { fr: `Les stocks et les flux — et les limites des chiffres` },
        corps: {
          fr: `Deux familles de chiffres, à ne jamais mélanger. Les « stocks » décrivent la population présente : environ 7 millions d'immigrés (un peu plus de 10 % de la population — INSEE, 2022-2023), environ 5,6 millions d'étrangers (8,2 %), environ 7,5 millions de descendants d'immigrés. Les « flux » décrivent les mouvements d'une année : environ 320 000 à 330 000 premiers titres de séjour délivrés par an, 140 000 à 160 000 demandes d'asile, et un solde migratoire (entrées moins sorties, toutes nationalités confondues, Français inclus) estimé entre +150 000 et +200 000 personnes par an ces dernières années.\n\nTrois limites méthodologiques réelles. 1) Le solde migratoire est une composante estimée du recensement, avec de vraies marges d'erreur — l'INSEE le révise régulièrement. 2) L'immigration irrégulière n'est, par définition, mesurée par aucune statistique directe : tous les chiffres qui circulent sont des estimations indirectes et contestées, à manier avec prudence. 3) Un titre de séjour délivré n'est pas une « entrée » : une partie des titres régularise ou prolonge des présences déjà anciennes, et les étudiants repartent en majorité. Un chiffre sans définition ni périmètre ne prouve rien — dans un sens comme dans l'autre.`,
        },
        sources: [
          { label: `INSEE — Immigrés et descendants d'immigrés en France, Insee Références`, url: 'https://www.insee.fr', year: 2023, perimetre: `stocks au recensement, France` },
          { label: `INSEE — bilan démographique annuel (solde migratoire estimé et ses révisions)`, url: 'https://www.insee.fr', year: 2024, perimetre: `toutes nationalités, y compris Français ; composante estimée` },
          { label: `Ministère de l'Intérieur (DGEF) — L'essentiel de l'immigration, séries annuelles`, url: 'https://www.interieur.gouv.fr', year: 2024, perimetre: `premiers titres de séjour, pays tiers` },
        ],
      },
      {
        id: 'histoire',
        titre: { fr: `Une histoire plus ancienne qu'on ne le croit` },
        corps: {
          fr: `La France est un vieux pays d'immigration — le principal d'Europe pendant une bonne partie des XIXe et XXe siècles. Belges puis Italiens dès la fin du XIXe siècle, Polonais des mines du Nord dans l'entre-deux-guerres, Espagnols fuyant la guerre civile en 1939, puis, pendant les Trente Glorieuses, Portugais, Espagnols, Italiens et travailleurs du Maghreb recrutés — parfois activement — pour l'industrie et le bâtiment. Chaque vague a suscité en son temps des rejets violents (Italiens tués à Aigues-Mortes en 1893) avant de se fondre dans la population : l'idée d'une immigration ancienne « facile » et d'une immigration récente « impossible » ne résiste pas aux archives.\n\nLe tournant date de 1974 : face à la crise économique, le gouvernement suspend l'immigration de travail. L'immigration ne s'arrête pas, elle change de nature : le regroupement familial, encadré par un décret de 1976 (et consacré comme droit par le Conseil d'État en 1978), devient un motif central, et la part des origines extra-européennes augmente. À partir des années 1980, le sujet devient un enjeu électoral majeur et le droit se met à changer en permanence : plus d'une vingtaine de lois sur l'immigration et l'asile depuis 1980, un rythme sans équivalent dans les autres politiques publiques.`,
        },
        sources: [
          { label: `Musée national de l'histoire de l'immigration — repères chronologiques`, url: 'https://www.histoire-immigration.fr', year: 2024 },
          { label: `Vie-publique.fr — chronologie des lois sur l'immigration depuis 1980`, url: 'https://www.vie-publique.fr', year: 2025 },
        ],
      },
      {
        id: 'economie',
        titre: { fr: `Coût ou contribution : ce que dit vraiment la recherche` },
        corps: {
          fr: `C'est le terrain où les chiffres chocs abondent — « l'immigration coûte X milliards », « l'immigration rapporte Y milliards » — et où l'état de la recherche est pourtant assez clair : les études qui appliquent les méthodes standards (OCDE, travaux académiques français et internationaux, note du Conseil d'analyse économique) concluent le plus souvent à un impact budgétaire net FAIBLE, compris entre légèrement négatif et légèrement positif selon les hypothèses — de l'ordre de plus ou moins 0,5 point de PIB. La raison est simple : les immigrés paient des impôts et cotisations et reçoivent des prestations, comme le reste de la population, et le solde dépend surtout de leur âge et de leur taux d'emploi, pas de leur origine.\n\nLes grands chiffres spectaculaires, dans un camp comme dans l'autre, reposent généralement sur des choix méthodologiques non standards : imputer aux immigrés une part forfaitaire de toutes les dépenses publiques (défense, dette…), ou à l'inverse ne compter que leurs cotisations. Ce qui reste réellement débattu entre chercheurs : les effets à long terme (démographie, innovation, retraites), les effets localisés sur certains salaires peu qualifiés (faibles en moyenne, discutés à la marge), et la composition de l'immigration (l'impact dépend fortement du taux d'emploi — d'où le débat politique sur la « sélection »). Retenez surtout ceci : l'économie ne tranche pas ce débat, ni dans un sens ni dans l'autre.`,
        },
        sources: [
          { label: `OCDE — Perspectives des migrations internationales (chapitres sur l'impact budgétaire des migrations)`, url: 'https://www.oecd.org', year: 2021, perimetre: `comparaison des pays de l'OCDE, méthodes comptables explicites` },
          { label: `Conseil d'analyse économique — note « L'immigration en France » (Auriol, Rapoport)`, url: 'https://www.cae-eco.fr', year: 2021, perimetre: `synthèse de la littérature, France` },
          { label: `France Stratégie / CEPII — travaux sur l'impact économique et budgétaire de l'immigration`, url: 'https://www.strategie.gouv.fr', year: 2019 },
        ],
      },
      {
        id: 'emploi-logement-services',
        titre: { fr: `Emploi, logement, services publics : des tensions réelles, mais localisées` },
        corps: {
          fr: `Dire que l'impact budgétaire moyen est faible ne veut pas dire que rien ne se passe sur le terrain. Les données montrent des concentrations fortes : l'immigration récente s'installe majoritairement dans les grandes agglomérations, et certains territoires (Seine-Saint-Denis, quartiers prioritaires, Guyane et Mayotte outre-mer) cumulent arrivées nombreuses, parc de logements saturé et services publics déjà sous tension — écoles, urgences, hébergement d'urgence. Ces tensions locales sont documentées et nourrissent légitimement le débat, même quand les moyennes nationales sont rassurantes.\n\nSur l'emploi, deux faits nuancés coexistent : les immigrés occupent une part importante d'emplois dits « de deuxième ligne » (nettoyage, aide à domicile, bâtiment, restauration — l'INSEE l'a mesuré pendant la crise sanitaire de 2020) et certains secteurs déclarent des pénuries de main-d'œuvre ; en même temps, le taux de chômage des immigrés reste nettement supérieur à celui des non-immigrés (environ le double pour les non-européens, INSEE, années récentes), signe de difficultés d'accès à l'emploi — discriminations mesurées par testing comprises. Le débat honnête ne consiste pas à nier ces tensions, mais à ne pas les généraliser à tout le territoire ni les attribuer à une cause unique.`,
        },
        sources: [
          { label: `INSEE — emploi et chômage des immigrés, enquête Emploi`, url: 'https://www.insee.fr', year: 2023, perimetre: `France, taux comparés immigrés / non-immigrés` },
          { label: `France Stratégie — travaux sur la ségrégation résidentielle et les quartiers`, url: 'https://www.strategie.gouv.fr', year: 2020 },
        ],
      },
      {
        id: 'integration',
        titre: { fr: `L'intégration : ce que mesurent les enquêtes` },
        corps: {
          fr: `« L'intégration marche / ne marche pas » : les deux slogans existent, les données sont plus intéressantes. La grande source est l'enquête Trajectoires et Origines (INSEE-INED, deux éditions, la dernière collectée en 2019-2020), qui suit langue, école, emploi, mixité conjugale et sentiment d'appartenance sur plusieurs générations.\n\nCe qui progresse de génération en génération, de façon mesurée : la maîtrise du français (quasi générale à la deuxième génération), le niveau de diplôme (les descendants d'immigrés dépassent souvent le niveau de leurs parents, et les filles y réussissent particulièrement), les unions mixtes (une majorité des descendants d'immigrés vivent en couple avec une personne non immigrée), et le sentiment d'être français (très majoritaire à la deuxième génération). Ce qui reste documenté comme difficulté : un accès à l'emploi plus difficile à diplôme égal (les testings mesurent des discriminations à l'embauche significatives, notamment pour les origines maghrébine et subsaharienne), une concentration résidentielle persistante dans certains quartiers, et un sentiment de discrimination élevé chez une partie des descendants d'immigrés. Autrement dit : les indicateurs classiques de l'intégration avancent, et les blocages sont surtout du côté de l'emploi, du logement et des discriminations — un constat qui alimente des conclusions politiques opposées.`,
        },
        sources: [
          { label: `INSEE-INED — enquête Trajectoires et Origines 2 (collecte 2019-2020), synthèses publiées`, url: 'https://www.ined.fr', year: 2023, perimetre: `France métropolitaine, immigrés et descendants` },
          { label: `INSEE — Immigrés et descendants d'immigrés en France, Insee Références`, url: 'https://www.insee.fr', year: 2023 },
        ],
      },
      {
        id: 'asile',
        titre: { fr: `L'asile : une procédure à part` },
        corps: {
          fr: `L'asile n'est pas une immigration « choisie » par l'État : c'est une protection due, encadrée par la convention de Genève de 1951 et le droit européen, à toute personne persécutée ou gravement menacée dans son pays. La demande est examinée par l'OFPRA (Office français de protection des réfugiés et apatrides), établissement public dont les décisions peuvent être contestées devant une juridiction spécialisée, la CNDA (Cour nationale du droit d'asile).\n\nLes ordres de grandeur récents : environ 140 000 à 160 000 demandes par an (OFPRA, années récentes) — la France est l'un des premiers pays de destination en Europe en volume, derrière l'Allemagne. Le taux de protection final, en comptant les recours devant la CNDA, se situe autour de 30 à 40 % selon les années : la majorité des demandes sont rejetées, et une personne déboutée devient éloignable (c'est l'un des principaux viviers d'OQTF — voir la fiche dédiée). Deux confusions à éviter absolument : un demandeur d'asile n'est pas un fraudeur par défaut (le taux de protection le montre… dans les deux sens : ni tous protégés, ni tous rejetés) ; et l'asile ne représente qu'une partie minoritaire de l'immigration légale totale — loin derrière les motifs étudiant et familial.`,
        },
        sources: [
          { label: `OFPRA — rapport d'activité annuel (demandes, décisions, taux de protection)`, url: 'https://www.ofpra.gouv.fr', year: 2024, perimetre: `demandes introduites en France, protection OFPRA + CNDA` },
          { label: `CNDA — rapport d'activité annuel`, url: 'https://www.cnda.fr', year: 2024 },
        ],
      },
      {
        id: 'positions',
        titre: { fr: `Les grandes positions dans le débat` },
        brique: 'visions',
        visions: [
          {
            label: { fr: `Réduction drastique — droite nationale et une partie de la droite` },
            couleur: 'purple',
            corps: { fr: `L'immigration actuelle serait trop importante en volume et trop éloignée culturellement pour être intégrée ; elle pèserait sur les services publics et la cohésion. Propositions types : quotas très bas voire « immigration zéro », restriction du regroupement familial et de l'asile, priorité nationale dans certaines prestations, référendum sur l'immigration, remise en cause du droit du sol. Certaines de ces mesures supposeraient de réviser la Constitution ou les engagements européens de la France — leurs promoteurs l'assument, leurs critiques y voient une impasse juridique.` },
          },
          {
            label: { fr: `Maîtrise et sélection — droite de gouvernement, partie du centre` },
            couleur: 'blue',
            corps: { fr: `L'immigration n'est ni un mal ni un bien en soi : l'État doit choisir qui il accueille selon ses besoins (« immigration choisie », formule portée par Nicolas Sarkozy dès 2005-2006). Propositions types : quotas ou objectifs chiffrés débattus au Parlement, priorité à l'immigration de travail qualifiée et étudiante, conditions d'intégration renforcées (langue, emploi), fermeté sur l'exécution des éloignements. La critique adressée à cette ligne : trente ans de lois « de maîtrise » n'ont pas fait bouger les grands volumes, largement déterminés par des droits (famille, asile) et non par des guichets.` },
          },
          {
            label: { fr: `Statu quo régulé — centre, gouvernements successifs en pratique` },
            couleur: 'teal',
            corps: { fr: `C'est la position rarement revendiquée mais le plus souvent pratiquée : maintenir les grands équilibres du droit actuel (asile protégé, regroupement familial encadré, immigration étudiante et de travail ajustée), corriger à la marge par des lois régulières, et régulariser au cas par cas. Ses défenseurs y voient le seul point d'équilibre entre les engagements internationaux de la France et l'opinion ; ses critiques — des deux côtés — y voient une absence de choix qui entretient le sentiment de perte de contrôle et la précarité des personnes en attente.` },
          },
          {
            label: { fr: `Accueil élargi et régularisations — gauche, associations` },
            couleur: 'green',
            corps: { fr: `Les migrations sont un fait durable qu'on ne « stoppe » pas, seulement qu'on rend plus ou moins dignes ; la priorité est l'accueil, l'intégration et les droits. Propositions types : régularisation large des travailleurs sans papiers et des familles enracinées, voies légales d'immigration élargies (pour tarir les traversées dangereuses), accueil des demandeurs d'asile dès l'arrivée, lutte contre les discriminations. La critique adressée à cette ligne : l'effet d'appel d'air supposé des régularisations — contesté empiriquement, mais central dans le débat — et le risque de décrochage avec une opinion majoritairement favorable à plus de fermeté dans les enquêtes récentes.` },
          },
          {
            label: { fr: `Libre circulation revendiquée — position minoritaire, présente aux deux extrémités de l'échiquier` },
            couleur: 'orange',
            corps: { fr: `Position assumée par une partie de la gauche radicale et internationaliste, et — pour des raisons opposées — par certains économistes libéraux et libertariens : les frontières fermées seraient à la fois inefficaces, coûteuses et injustes, et la liberté de circulation devrait être la règle, comme elle l'est déjà à l'intérieur de l'Union européenne. Aucun parti français de gouvernement ne la porte ; elle structure pourtant le débat en servant de repoussoir (« laxisme ») ou d'horizon (« monde ouvert »), et l'exemple de la libre circulation européenne — réelle depuis des décennies, sans effondrement — est son principal argument.` },
          },
        ],
      },
      {
        id: 'desaccords',
        titre: { fr: `Trois débats distincts, presque toujours mélangés` },
        corps: {
          fr: `Le « débat sur l'immigration » est en réalité trois débats différents, et beaucoup de dialogues de sourds viennent de leur confusion. 1) Le débat sur les VOLUMES : combien de personnes accueillir, par quelles voies, avec quels critères — un débat de chiffres et de droit, où les données existent. 2) Le débat sur l'INTÉGRATION : que faire pour que les personnes présentes — qui, pour l'essentiel, resteront — apprennent la langue, travaillent, vivent sans ghettos ni discriminations — un débat de politiques publiques (école, logement, emploi) qui concerne surtout des Français et des résidents durables. 3) Le débat sur l'IDENTITÉ : ce que l'immigration change à ce qu'est la France — un débat de valeurs, où les données éclairent peu et ne trancheront jamais.\n\nOn peut vouloir moins d'immigration et plus de moyens pour l'intégration, ou l'inverse ; être inquiet pour l'identité sans contester les chiffres ; accepter les volumes actuels en jugeant l'intégration défaillante. S'y ajoute un quatrième thème récurrent, le lien entre immigration et insécurité : les données disponibles (statistiques de mise en cause, surreprésentation carcérale) existent mais sont d'interprétation difficile — effets de structure d'âge, de conditions sociales, de contrôles différenciés — et leur lecture fait l'objet d'un désaccord scientifique et politique réel ; méfiez-vous de quiconque les présente comme évidentes, dans un sens comme dans l'autre. Repérer dans quel débat se situe votre interlocuteur est le meilleur outil de cette fiche.`,
        },
      },
      {
        id: 'ailleurs',
        titre: { fr: `Ce que font les autres pays — et pourquoi rien n'est transposable tel quel` },
        corps: {
          fr: `Trois expériences reviennent sans cesse dans le débat français. L'Allemagne de 2015 : plus d'un million de demandeurs d'asile accueillis en 2015-2016 (« Wir schaffen das » — « nous y arriverons » — d'Angela Merkel), un effort d'intégration massif, des résultats d'accès à l'emploi meilleurs que prévu à moyen terme selon les études allemandes, mais aussi un choc politique durable (montée de l'AfD) et un net durcissement des politiques allemandes ensuite. Le Danemark : un gouvernement social-démocrate y assume depuis 2019 l'une des politiques les plus restrictives d'Europe (objectif « zéro demandeur d'asile » spontané, externalisation envisagée de l'examen des demandes, politiques de dispersion résidentielle contestées devant les juridictions européennes) — preuve que la ligne restrictive n'est pas partout une exclusivité de la droite. Le Canada : un système « à points » qui sélectionne l'immigration économique sur des critères (diplôme, langue, âge, emploi) avec des cibles annuelles élevées et un large consensus public — mais le Canada choisit ses flux parce que sa géographie le protège des arrivées spontanées (pas de frontière terrestre avec des régions en crise), ce qui n'est le cas d'aucun pays européen ; et le consensus canadien lui-même s'est fissuré récemment sur le logement.\n\nLeçon commune : chaque modèle repose sur une géographie, un droit et une histoire particuliers. S'en inspirer est légitime ; les brandir comme des recettes prêtes à l'emploi ne l'est pas.`,
        },
        sources: [
          { label: `OCDE — Perspectives des migrations internationales (comparaisons de politiques par pays)`, url: 'https://www.oecd.org', year: 2023, perimetre: `pays de l'OCDE, définitions harmonisées` },
          { label: `Eurostat — demandes d'asile par État membre`, url: 'https://ec.europa.eu/eurostat', year: 2024, perimetre: `UE, définitions distinctes des statistiques nationales` },
        ],
      },
      {
        id: 'mesures-prises',
        titre: { fr: `Ce qui a déjà été fait en France` },
        corps: {
          fr: `Le droit des étrangers est l'un des plus réformés de tout le droit français : plus d'une vingtaine de lois depuis 1980, portées par tous les camps de gouvernement. Repères principaux : lois Pasqua (1993 — restriction de l'accès à la nationalité et au séjour, « immigration zéro » comme horizon affiché) ; loi Chevènement (1998 — rééquilibrage, création du titre « vie privée et familiale ») ; lois Sarkozy (2003 et 2006 — « immigration choisie », conditions durcies pour le regroupement familial et le séjour) ; loi Hortefeux (2007 — restée dans les mémoires pour l'épisode contesté des tests ADN, jamais appliqués) ; circulaire Valls (2012 — critères de régularisation au cas par cas, toujours en vigueur pour l'essentiel) ; loi Collomb (2018 — délais d'asile raccourcis, rétention allongée à 90 jours) ; enfin loi du 26 janvier 2024, adoptée après une crise politique majeure, dont le Conseil constitutionnel a censuré une part importante (essentiellement pour des raisons de procédure — « cavaliers législatifs ») le 25 janvier 2024 : le texte final simplifie le contentieux, durcit l'éloignement des personnes représentant une menace à l'ordre public et crée une régularisation encadrée dans les métiers en tension. Sur l'exécution des éloignements et le débat OQTF, voir la fiche dédiée.\n\nBilan d'ensemble, constaté par la Cour des comptes et les chercheurs : malgré ce rythme législatif exceptionnel, les grands volumes d'immigration ont peu varié — car ils dépendent surtout de droits (famille, asile, études) et de facteurs internationaux, peu sensibles aux lois nationales. C'est le paradoxe central du sujet : jamais un domaine n'a été autant légiféré pour des effets aussi discutés.`,
        },
        sources: [
          { label: `Vie-publique.fr — chronologie des lois sur l'immigration depuis 1980 et dossier « loi du 26 janvier 2024 »`, url: 'https://www.vie-publique.fr', year: 2024 },
          { label: `Conseil constitutionnel — décision n° 2023-863 DC du 25 janvier 2024`, url: 'https://www.conseil-constitutionnel.fr', year: 2024 },
          { label: `Cour des comptes — L'entrée, le séjour et le premier accueil des personnes étrangères (rapport public)`, url: 'https://www.ccomptes.fr', year: 2020 },
        ],
      },
      {
        id: 'se-faire-une-opinion',
        titre: { fr: `Questions pour se faire sa propre opinion` },
        corps: {
          fr: `Parmi les trois débats — volumes, intégration, identité — lequel compte le plus pour vous, et acceptez-vous qu'on puisse répondre différemment aux trois ? Sur les volumes : faut-il des objectifs chiffrés votés par le Parlement, et que fait-on quand un droit (asile, vie familiale) entre en conflit avec un chiffre ? Sur l'intégration : préférez-vous investir dans la langue, l'emploi et la lutte contre les discriminations, ou conditionner davantage le séjour aux résultats d'intégration ? Sur les personnes présentes sans droit au séjour : régulariser celles qui travaillent, ou considérer que toute régularisation en attire d'autres ? Et à quelles sources faites-vous confiance pour en juger — un chiffre daté, sourcé et périmétré, ou un chiffre choc entendu en débat ? Vos réponses dessinent une position cohérente — quelle qu'elle soit, elle vaudra mieux que les slogans qu'elle remplace.`,
        },
      },
    ],
  },

  // ── Tableau comparatif ────────────────────────────────────────────────────────
  tableauComparatif: {
    titre: { fr: `Trois modèles migratoires types` },
    note: { fr: `Simplification pédagogique : chaque pays combine en réalité plusieurs logiques, et aucun modèle n'est transposable tel quel (géographies et droits différents).` },
    colonnes: [{ fr: `Sélection à points (type Canada)` }, { fr: `Guichets et régularisations (type France)` }, { fr: `Restrictif assumé (type Danemark)` }],
    lignes: [
      { label: { fr: 'Principe' }, cells: [{ fr: `L'État fixe des cibles chiffrées et sélectionne l'immigration économique sur critères (diplôme, langue, âge)` }, { fr: `Des droits (famille, asile, études) ouvrent le séjour ; l'irrégulier est traité au cas par cas (régularisations)` }, { fr: `Décourager les arrivées spontanées par tous les leviers légaux, y compris symboliques` }] },
      { label: { fr: 'Point fort revendiqué' }, cells: [{ fr: `Lisibilité, consensus public, immigration corrélée aux besoins économiques` }, { fr: `Respect des engagements internationaux et des situations individuelles` }, { fr: `Volumes d'asile effectivement réduits, message de fermeté clair` }] },
      { label: { fr: 'Limite documentée' }, cells: [{ fr: `Suppose une géographie protégée des arrivées spontanées ; tensions récentes sur le logement` }, { fr: `Sentiment de non-choix, délais longs, personnes durablement en attente ou sans statut` }, { fr: `Contentieux avec le droit européen, coût humain critiqué, main-d'œuvre manquante` }] },
      { label: { fr: `Qui s'en réclame en France` }, cells: [{ fr: `Droite de gouvernement, partie du centre (« immigration choisie »)` }, { fr: `Pratique effective des gouvernements successifs, défendue par le centre` }, { fr: `Droite nationale — qui cite volontiers le précédent social-démocrate danois` }] },
    ],
    sources: [{ label: `Synthèse d'après OCDE, Perspectives des migrations internationales, et documentation des politiques nationales`, year: 2023 }],
  },

  vraiFaux: ['vf-immig-tous-etrangers', 'vf-immig-rocard-misere', 'vf-immig-droit-du-sol', 'vf-immig-cout-massif', 'vf-immig-france-accueille-plus'],

  quiz: [
    {
      question: { fr: `Qu'est-ce qu'un « immigré » au sens des statistiques françaises ?` },
      options: [
        { fr: `Toute personne de nationalité étrangère` },
        { fr: `Une personne née étrangère à l'étranger et vivant en France — même si elle est devenue française depuis` },
        { fr: `Une personne née en France de parents étrangers` },
        { fr: `Une personne en situation irrégulière` },
      ],
      bonneReponse: 1,
      explication: { fr: `La définition INSEE repose sur le lieu de naissance et la nationalité à la naissance, pas sur la nationalité actuelle : environ un tiers des immigrés sont français. « Immigré » et « étranger » ne comptent pas les mêmes personnes.` },
    },
    {
      question: { fr: `Quelle part de la population française les immigrés représentent-ils environ ?` },
      options: [
        { fr: `Environ 3 %` },
        { fr: `Un peu plus de 10 %` },
        { fr: `Environ 25 %` },
        { fr: `Environ 40 %` },
      ],
      bonneReponse: 1,
      explication: { fr: `Environ 7 millions de personnes, soit un peu plus de 10 % de la population (INSEE, données 2022-2023) — une proportion proche de la moyenne de l'Union européenne, et régulièrement surestimée dans les enquêtes d'opinion.` },
    },
    {
      question: { fr: `Quel est le premier motif de délivrance des premiers titres de séjour ces dernières années ?` },
      options: [
        { fr: `L'asile` },
        { fr: `Le motif économique` },
        { fr: `Les études — environ un tiers des premiers titres` },
        { fr: `Il n'existe pas de statistiques` },
      ],
      bonneReponse: 2,
      explication: { fr: `Sur environ 320 000 à 330 000 premiers titres annuels (ministère de l'Intérieur, années récentes), les étudiants représentent environ un tiers, le motif familial environ un quart, le motif économique environ 15 % — loin de l'image d'une immigration principalement d'asile.` },
    },
    {
      question: { fr: `Qui examine les demandes d'asile en France ?` },
      options: [
        { fr: `Le préfet, seul` },
        { fr: `L'OFPRA, avec un recours possible devant la CNDA` },
        { fr: `La police aux frontières` },
        { fr: `Le maire de la commune d'arrivée` },
      ],
      bonneReponse: 1,
      explication: { fr: `L'OFPRA instruit les demandes ; ses refus peuvent être contestés devant la Cour nationale du droit d'asile. Le taux de protection final, recours compris, se situe autour de 30 à 40 % selon les années.` },
    },
    {
      question: { fr: `Que conclut la recherche économique standard sur l'impact budgétaire de l'immigration en France ?` },
      options: [
        { fr: `Un coût massif, de plusieurs points de PIB` },
        { fr: `Un gain massif, de plusieurs points de PIB` },
        { fr: `Un impact net faible — entre légèrement négatif et légèrement positif selon les hypothèses` },
        { fr: `Rien : aucune étude n'existe` },
      ],
      bonneReponse: 2,
      explication: { fr: `Les études aux méthodes standards (OCDE, Conseil d'analyse économique) convergent vers un impact budgétaire net de l'ordre de plus ou moins 0,5 point de PIB. Les chiffres spectaculaires des deux camps reposent sur des conventions de calcul non standards.` },
    },
  ],

  // ── N4 ──────────────────────────────────────────────────────────────────────
  level4: {
    items: [
      { kind: 'lien', titre: { fr: `INSEE — Immigrés et descendants d'immigrés en France (Insee Références, éditions récentes)` }, note: { fr: `La référence statistique : définitions, stocks, flux, origines, intégration. Le point de départ de tout chiffre sérieux.` }, url: 'https://www.insee.fr' },
      { kind: 'lien', titre: { fr: `OCDE — Perspectives des migrations internationales (rapport annuel)` }, note: { fr: `Les comparaisons internationales harmonisées : flux, politiques, impact budgétaire par pays. L'antidote aux comparaisons de chiffres non comparables.` }, url: 'https://www.oecd.org' },
      { kind: 'biblio', titre: { fr: `Conseil d'analyse économique — note « L'immigration en France » (E. Auriol, H. Rapoport, 2021)` }, note: { fr: `Une synthèse accessible de la littérature économique, avec ses conclusions et ses incertitudes assumées.` }, url: 'https://www.cae-eco.fr' },
      { kind: 'lien', titre: { fr: `France Stratégie — travaux sur l'immigration, l'intégration et le marché du travail` }, note: { fr: `L'expertise publique rattachée à Matignon : études d'impact, ségrégation résidentielle, emploi.` }, url: 'https://www.strategie.gouv.fr' },
      { kind: 'lien', titre: { fr: `INED — enquête Trajectoires et Origines (TeO2, collecte 2019-2020)` }, note: { fr: `La grande enquête française sur l'intégration sur plusieurs générations : langue, école, emploi, discriminations, sentiment d'appartenance.` }, url: 'https://www.ined.fr' },
      { kind: 'lien', titre: { fr: `Musée national de l'histoire de l'immigration (Paris)` }, note: { fr: `Deux siècles d'immigration en France, vagues par vagues — le recul historique qui manque le plus au débat quotidien.` }, url: 'https://www.histoire-immigration.fr' },
    ],
  },

  motsAssocies: [
    { slug: 'oqtf', label: { fr: `L'OQTF` } },
    { label: { fr: 'Droit du sol' }, soon: true },
    { label: { fr: 'Regroupement familial' }, soon: true },
    { label: { fr: `Demandeur d'asile` }, soon: true },
  ],
  continuerAvec: [
    { slug: 'oqtf' },
    { slug: 'extreme-droite', label: { fr: `L'extrême droite` }, soon: true },
    { slug: 'gauche', label: { fr: `La gauche` }, soon: true },
  ],

  sources: [
    { label: `INSEE — Immigrés et descendants d'immigrés en France, Insee Références et chiffres clés du recensement`, url: 'https://www.insee.fr', year: 2023, perimetre: `France ; définitions statistiques (immigré = né étranger à l'étranger, étranger = nationalité)` },
    { label: `Ministère de l'Intérieur (DGEF) — L'essentiel de l'immigration, statistiques annuelles des titres de séjour`, url: 'https://www.interieur.gouv.fr', year: 2024, perimetre: `premiers titres de séjour, ressortissants de pays tiers (hors UE)` },
    { label: `OFPRA — rapport d'activité annuel`, url: 'https://www.ofpra.gouv.fr', year: 2024, perimetre: `demandes d'asile introduites en France, taux de protection OFPRA + CNDA` },
    { label: `OCDE — Perspectives des migrations internationales`, url: 'https://www.oecd.org', year: 2023, perimetre: `pays de l'OCDE, définitions harmonisées — distinctes des statistiques nationales` },
    { label: `Conseil d'analyse économique — note sur l'immigration (2021) ; France Stratégie / CEPII — travaux sur l'impact budgétaire`, url: 'https://www.cae-eco.fr', year: 2021, perimetre: `synthèses de la littérature économique, France` },
    { label: `Eurostat — population étrangère et demandes d'asile dans l'UE`, url: 'https://ec.europa.eu/eurostat', year: 2024, perimetre: `comparaisons UE, définitions distinctes des sources françaises — à manier avec prudence` },
  ],
};
