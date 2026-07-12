/**
 * Fiche institution « Le président de la République » — modèle institution
 * (docs/jyconnaisrien/02, §2/§8) : schéma simple, section « ce qu'il ne peut PAS
 * faire » obligatoire, comparaison internationale.
 */

export default {
  slug: 'president-de-la-republique',
  type: 'institution',
  porte: 'E1',
  title: { fr: `Le président de la République`, en: 'The President of the Republic' },
  icon: '🏛️',
  difficulty: 1,
  famille: 'dossier',
  updatedAt: '2026-07-12',
  freshness: { type: 'periodic', reviewEveryMonths: 12, lastReviewedAt: '2026-07-12' },

  // ── N1 ──────────────────────────────────────────────────────────────────────
  level1: {
    fr: `Le président de la République est le chef de l'État, élu pour cinq ans au suffrage universel direct. Il nomme le Premier ministre, dirige la diplomatie et les armées, peut dissoudre l'Assemblée nationale — mais il ne vote pas les lois et ne peut pas gouverner seul : sans majorité à l'Assemblée, son pouvoir réel diminue fortement. C'est l'institution la plus puissante de la Ve République, et la plus mal comprise.`,
  },

  // ── N2 ──────────────────────────────────────────────────────────────────────
  level2: {
    sections: [
      {
        titre: { fr: `Le schéma simple` },
        corps: {
          fr: `Les citoyens élisent le président ET les députés — deux légitimités distinctes. Le président nomme le Premier ministre, qui forme un gouvernement ; ce gouvernement propose des lois et les applique ; l'Assemblée les vote et peut renverser le gouvernement (motion de censure) ; les juges — dont le Conseil constitutionnel — vérifient le respect des règles.\n\nTout le système repose sur une question : le président a-t-il une majorité à l'Assemblée ? Si oui, il gouverne réellement (le Premier ministre applique sa politique). Si non, le pouvoir bascule vers le Parlement et le gouvernement — jusqu'à la cohabitation, où le président se replie sur la diplomatie et la défense.`,
        },
      },
      {
        titre: { fr: `Ce qu'il fait vraiment` },
        corps: {
          fr: `Ses pouvoirs « propres » (sans contreseing du gouvernement) : nommer le Premier ministre, dissoudre l'Assemblée nationale, soumettre certains textes à référendum, saisir le Conseil constitutionnel, et — en cas de crise majeure menaçant les institutions — les pouvoirs exceptionnels de l'article 16, très encadrés et utilisés une seule fois (1961).\n\nSes pouvoirs « partagés » (qui exigent la signature du gouvernement) : nommer aux emplois civils et militaires, signer les ordonnances et décrets délibérés en conseil des ministres, promulguer les lois. Il préside le conseil des ministres, est le chef des armées (il détient notamment la décision d'engagement de la dissuasion nucléaire) et conduit la politique étrangère avec le gouvernement.`,
        },
        sources: [{ label: `Constitution du 4 octobre 1958, articles 5 à 19 (Légifrance)`, url: 'https://www.legifrance.gouv.fr', year: 1958 }],
      },
      {
        titre: { fr: `Ce qu'il ne peut PAS faire` },
        brique: 'a-retenir',
        corps: {
          fr: `Le président ne vote pas les lois et n'en écrit pas : c'est le travail du Parlement et du gouvernement. Le 49.3 n'est pas son outil mais celui du Premier ministre. Il ne peut pas renvoyer un député, ni annuler une décision de justice, ni gouverner par décret sur n'importe quel sujet. Il ne peut plus enchaîner plus de deux mandats consécutifs (révision de 2008). Et il ne peut pas démettre un Premier ministre qui refuse de démissionner — en pratique, les Premiers ministres remettent leur démission, mais c'est une convention, pas une obligation juridique.`,
        },
      },
      {
        titre: { fr: `Élection : comment ça marche` },
        corps: {
          fr: `Scrutin uninominal majoritaire à deux tours : si personne n'obtient la majorité absolue au premier tour (jamais arrivé sous la Ve), les deux premiers s'affrontent au second. Pour se présenter, il faut 500 parrainages d'élus (maires, parlementaires…), issus d'au moins 30 départements, rendus publics. Mandat de 5 ans depuis le référendum de 2000 (7 ans auparavant), renouvelable une fois consécutivement depuis 2008.`,
        },
        sources: [{ label: `Conseil constitutionnel — règles de l'élection présidentielle et parrainages`, url: 'https://www.conseil-constitutionnel.fr', year: 2022 }],
      },
    ],
  },

  // ── N3 ──────────────────────────────────────────────────────────────────────
  level3: {
    sections: [
      {
        id: 'pourquoi-si-puissant',
        titre: { fr: `Pourquoi le président français est-il si puissant ?` },
        corps: {
          fr: `Trois raisons cumulées. La Constitution de 1958, écrite pour de Gaulle après l'impuissance de la IVe République, donne à l'exécutif des armes fortes (dissolution, référendum, article 16). La révision de 1962 fait élire le président au suffrage universel direct : il devient le seul élu de toute la nation, ce qu'aucun autre dirigeant d'Europe occidentale parlementaire n'est. Enfin le « fait majoritaire » : depuis 1962, l'élection présidentielle structure la vie politique, et les législatives qui suivent donnent (presque toujours) une majorité au président élu — le quinquennat et l'inversion du calendrier en 2000-2002 ont renforcé ce mécanisme.\n\nRésultat : quand il a une majorité, le président français concentre plus de pouvoir effectif que la plupart de ses homologues démocratiques. Mais ce pouvoir est conditionnel — les élections de 2022 puis la dissolution de 2024, qui ont privé l'exécutif de majorité absolue, l'ont rappelé brutalement.`,
        },
        sources: [{ label: `Vie-publique.fr — « Pourquoi le président de la Ve République a-t-il autant de pouvoirs ? »`, url: 'https://www.vie-publique.fr', year: 2025 }],
      },
      {
        id: 'dissolution',
        titre: { fr: `La dissolution : l'arme à double tranchant` },
        corps: {
          fr: `Le président peut dissoudre l'Assemblée nationale à presque tout moment (pas deux fois en moins d'un an), pour provoquer de nouvelles législatives. C'est un pari : de Gaulle y gagne en 1962 et 1968, Mitterrand en 1981 et 1988 (pour accorder l'Assemblée à sa réélection) — mais Chirac perd sa majorité en 1997, et la dissolution de juin 2024 a produit une Assemblée sans majorité claire. L'arme dissuade le Parlement, mais elle peut se retourner contre celui qui la dégaine.`,
        },
        sources: [{ label: `Constitution, article 12 ; Vie-publique.fr — les dissolutions sous la Ve République`, url: 'https://www.vie-publique.fr', year: 2024 }],
      },
      {
        id: 'cohabitation',
        titre: { fr: `La cohabitation : quand le président perd la main` },
        corps: {
          fr: `Si l'Assemblée est dominée par un camp opposé, le président doit nommer un Premier ministre issu de cette majorité : c'est la cohabitation. La politique intérieure passe alors au gouvernement ; le président conserve un rôle fort en diplomatie et défense (on parle de « domaine réservé », expression d'usage — la Constitution ne l'emploie pas) et un pouvoir d'obstruction ponctuel. Trois cohabitations ont eu lieu : 1986-1988 (Mitterrand/Chirac), 1993-1995 (Mitterrand/Balladur), 1997-2002 (Chirac/Jospin). Le quinquennat les a rendues moins probables, pas impossibles — et les Assemblées sans majorité absolue (depuis 2022) créent une situation intermédiaire inédite : ni présidence toute-puissante, ni cohabitation franche.`,
        },
        sources: [{ label: `Vie-publique.fr — les cohabitations de la Ve République`, url: 'https://www.vie-publique.fr', year: 2025 }],
      },
      {
        id: 'responsabilite',
        titre: { fr: `Est-il responsable ? Peut-on le destituer ?` },
        corps: {
          fr: `Pendant son mandat, le président bénéficie d'une immunité étendue : il ne peut être ni poursuivi ni jugé pour des actes détachables de sa fonction — les procédures reprennent après le mandat (Jacques Chirac a ainsi été jugé et condamné après 2007, dans l'affaire des emplois fictifs de Paris). Deux exceptions : la Cour pénale internationale, et la destitution de l'article 68 — votée par les deux chambres réunies en Haute Cour à la majorité des deux tiers, « en cas de manquement à ses devoirs manifestement incompatible avec l'exercice de son mandat ». Jamais utilisée à ce jour ; des propositions de destitution ont été déposées, aucune n'a franchi les étapes requises.\n\nPolitiquement, le président n'est responsable devant personne entre deux élections : c'est la grande différence avec le Premier ministre, que l'Assemblée peut renverser. Les critiques du « présidentialisme » français partent de là.`,
        },
        sources: [{ label: `Constitution, articles 67-68 (révision de 2007) ; Vie-publique.fr — le statut pénal du chef de l'État`, url: 'https://www.vie-publique.fr', year: 2025 }],
      },
      {
        id: 'president-pm',
        titre: { fr: `Président et Premier ministre : qui fait quoi ?` },
        corps: {
          fr: `Sur le papier, la Constitution fait du Premier ministre le chef du gouvernement, qui « détermine et conduit la politique de la Nation » (article 20 confie cela au gouvernement). En pratique, hors cohabitation, le président fixe le cap et le Premier ministre exécute — les Premiers ministres de la Ve ont souvent servi de « fusible » : quand la politique devient impopulaire, on change de Premier ministre, pas de président. Le déséquilibre entre le texte (parlementaire) et la pratique (présidentielle) est la singularité française : les constitutionnalistes parlent de régime « semi-présidentiel ».`,
        },
        sources: [{ label: `Constitution, articles 8, 20, 21`, url: 'https://www.legifrance.gouv.fr', year: 1958 }],
      },
      {
        id: 'comparaison',
        titre: { fr: `Et ailleurs ? Trois modèles pour comparer` },
        brique: 'comparaison',
        rows: [
          { pays: { fr: '🇫🇷 France' }, valeur: 'semi-présidentiel', desc: { fr: `Président élu au suffrage direct ET Premier ministre responsable devant l'Assemblée. Pouvoir présidentiel très fort avec majorité, réduit sans.` } },
          { pays: { fr: '🇺🇸 États-Unis' }, valeur: 'présidentiel', desc: { fr: `Le président est aussi le chef du gouvernement, mais il ne peut pas dissoudre le Congrès — qui ne peut pas le renverser (sauf procédure d'impeachment). Séparation stricte.` } },
          { pays: { fr: '🇩🇪 Allemagne' }, valeur: 'parlementaire', desc: { fr: `Le président fédéral a un rôle essentiellement protocolaire ; le pouvoir appartient au chancelier, élu par le Bundestag et responsable devant lui.` } },
          { pays: { fr: '🇬🇧 Royaume-Uni' }, valeur: 'parlementaire', desc: { fr: `Pas de président : un monarque sans pouvoir politique réel et un Premier ministre issu de la majorité des Communes, révocable par elle.` } },
        ],
      },
      {
        id: 'critiques-reformes',
        titre: { fr: `Les critiques et les réformes en débat` },
        corps: {
          fr: `Les critiques récurrentes : un « monarque républicain » trop peu contrôlé entre deux élections ; un Parlement affaibli ; une personnalisation excessive de la vie politique. Les réformes régulièrement proposées : passer à un régime parlementaire (le président s'efface) ou au contraire pleinement présidentiel (supprimer le Premier ministre, mais aussi la dissolution et le 49.3) ; introduire la proportionnelle aux législatives ; renforcer le référendum d'initiative partagée ; revenir au septennat non renouvelable. Aucune ne fait consensus : chaque camp veut réformer l'institution… surtout quand il ne la détient pas. Les défenseurs du système répondent qu'il a donné à la France une stabilité que la IVe République n'avait jamais connue.`,
        },
      },
    ],
  },

  // ── Chronologie ──────────────────────────────────────────────────────────────
  chronologie: {
    titre: { fr: `La présidence, de 1958 à aujourd'hui` },
    events: [
      { date: '1958', titre: { fr: `La Constitution de la Ve République` }, detail: { fr: `Rédigée sous l'autorité de de Gaulle et adoptée par référendum (79 % de oui), elle crée un exécutif fort après l'instabilité de la IVe République. Le président est alors élu par un collège d'élus.` }, source: { label: `Conseil constitutionnel — référendum du 28 septembre 1958`, year: 1958 } },
      { date: '1962', titre: { fr: `L'élection au suffrage universel direct` }, detail: { fr: `Après l'attentat du Petit-Clamart, de Gaulle fait adopter par référendum (62 % de oui) l'élection directe du président — contre l'avis de presque tous les partis. C'est le vrai acte de naissance de la présidence moderne.` }, source: { label: `Conseil constitutionnel — référendum du 28 octobre 1962`, year: 1962 } },
      { date: '1965', titre: { fr: `Première élection directe` }, detail: { fr: `De Gaulle est mis en ballottage par François Mitterrand avant de l'emporter au second tour — preuve immédiate que l'élection directe crée un vrai duel national.` } },
      { date: '1986', titre: { fr: `Première cohabitation` }, detail: { fr: `La droite gagne les législatives : Mitterrand nomme Jacques Chirac à Matignon. L'institution démontre qu'elle peut fonctionner avec un exécutif divisé.` } },
      { date: '2000', titre: { fr: `Le quinquennat` }, detail: { fr: `Référendum (73 % de oui, abstention record) : le mandat passe de 7 à 5 ans. Aligné sur celui des députés, il synchronise présidentielle et législatives et renforce le fait majoritaire.` }, source: { label: `Conseil constitutionnel — référendum du 24 septembre 2000`, year: 2000 } },
      { date: '2008', titre: { fr: `Limite des deux mandats consécutifs` }, detail: { fr: `La révision constitutionnelle de 2008 limite à deux le nombre de mandats consécutifs et encadre certains pouvoirs (article 16, nominations) tout en renforçant le Parlement sur d'autres points.` }, source: { label: `Loi constitutionnelle du 23 juillet 2008 (Légifrance)`, year: 2008 } },
      { date: '2022-2024', titre: { fr: `La présidence sans majorité absolue` }, detail: { fr: `Réélu en 2022, Emmanuel Macron ne dispose que d'une majorité relative ; la dissolution de juin 2024 aboutit à une Assemblée fragmentée en trois blocs, censure d'un gouvernement en décembre 2024. Le système présidentiel fonctionne en mode dégradé — le débat institutionnel est relancé.` }, source: { label: `Vie-publique.fr — les élections législatives de 2022 et 2024`, year: 2024 } },
    ],
  },

  vraiFaux: ['vf-president-ecrit-lois', 'vf-493-president', 'vf-president-regime-us', 'vf-president-demission-pm'],

  quiz: [
    {
      question: { fr: `Qui vote les lois en France ?` },
      options: [
        { fr: `Le président de la République` },
        { fr: `Le Parlement (Assemblée nationale et Sénat)` },
        { fr: `Le conseil des ministres` },
        { fr: `Le Conseil constitutionnel` },
      ],
      bonneReponse: 1,
      explication: { fr: `Le président promulgue les lois mais ne les vote pas : le vote appartient aux députés et sénateurs. Le Conseil constitutionnel, lui, vérifie leur conformité à la Constitution.` },
    },
    {
      question: { fr: `Depuis quand le président est-il élu directement par les citoyens ?` },
      options: [
        { fr: `Depuis 1789` },
        { fr: `Depuis 1958` },
        { fr: `Depuis le référendum de 1962 (première élection directe en 1965)` },
        { fr: `Depuis 2000` },
      ],
      bonneReponse: 2,
      explication: { fr: `En 1958, le président était élu par un collège d'élus. De Gaulle a fait adopter l'élection au suffrage universel direct par le référendum de 1962 — contre la plupart des partis de l'époque.` },
    },
    {
      question: { fr: `Que se passe-t-il si l'Assemblée est dominée par le camp opposé au président ?` },
      options: [
        { fr: `Le président démissionne obligatoirement` },
        { fr: `Une cohabitation : le président nomme un Premier ministre de cette majorité, qui conduit la politique intérieure` },
        { fr: `Le président gouverne par décret` },
        { fr: `De nouvelles élections présidentielles sont organisées` },
      ],
      bonneReponse: 1,
      explication: { fr: `C'est arrivé trois fois (1986, 1993, 1997). Le président garde un rôle fort en diplomatie et défense, mais la politique intérieure passe au gouvernement issu de l'Assemblée.` },
    },
    {
      question: { fr: `La dissolution de l'Assemblée nationale…` },
      options: [
        { fr: `Est interdite depuis 2008` },
        { fr: `Garantit toujours une majorité au président` },
        { fr: `Est un pari : elle a réussi à de Gaulle et Mitterrand, mais échoué à Chirac en 1997 et produit une Assemblée fragmentée en 2024` },
        { fr: `Doit être votée par le Sénat` },
      ],
      bonneReponse: 2,
      explication: { fr: `Le président peut dissoudre presque librement (pas deux fois en moins d'un an), mais les électeurs décident du résultat — et il peut se retourner contre lui.` },
    },
    {
      question: { fr: `Le président peut-il être jugé pendant son mandat ?` },
      options: [
        { fr: `Oui, comme tout citoyen` },
        { fr: `Non, jamais, même après son mandat` },
        { fr: `Son immunité suspend les poursuites pendant le mandat ; elles reprennent après — et la destitution (article 68) reste possible par le Parlement` },
        { fr: `Seul le Conseil constitutionnel peut le juger` },
      ],
      bonneReponse: 2,
      explication: { fr: `Jacques Chirac a ainsi été jugé et condamné après la fin de son mandat. La destitution par la Haute Cour (article 68) existe depuis 2007 mais n'a jamais été menée à terme.` },
    },
  ],

  motsAssocies: ['49-3', 'motion-de-censure', 'proportionnelle'],
  continuerAvec: [
    { slug: 'francois-mitterrand' },
    { slug: 'droite' },
    { label: { fr: `L'Assemblée nationale` }, soon: true },
  ],

  sources: [
    { label: `Constitution du 4 octobre 1958, texte consolidé (Légifrance) — articles 5 à 19, 20-21, 49, 67-68`, url: 'https://www.legifrance.gouv.fr', year: 2026 },
    { label: `Vie-publique.fr — fiches « le président de la République », « les cohabitations », « les dissolutions »`, url: 'https://www.vie-publique.fr', year: 2025 },
    { label: `Conseil constitutionnel — résultats officiels des référendums de 1958, 1962 et 2000`, url: 'https://www.conseil-constitutionnel.fr', year: 2000 },
  ],
};
