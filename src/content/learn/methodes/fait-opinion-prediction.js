/**
 * Fiche méthode « Fait, opinion, prédiction » — porte I « Comment le sait-on ? ».
 * La distinction la plus utile du débat public : un fait se vérifie, une opinion
 * se discute, une prédiction s'évalue plus tard. Contenu intemporel → freshness 'stable'.
 */

export default {
  slug: 'fait-opinion-prediction',
  type: 'fiche-methode',
  porte: 'I',
  title: { fr: `Fait, opinion, prédiction`, en: 'Fact, opinion, prediction' },
  icon: '🔬',
  difficulty: 1,
  famille: 'dossier',
  updatedAt: '2026-07-12',
  freshness: { type: 'stable', reviewEveryMonths: 24, lastReviewedAt: '2026-07-12' },

  // ── N1 ──────────────────────────────────────────────────────────────────────
  level1: {
    fr: `Un fait se vérifie : il est daté, sourcé, et n'importe qui peut le contrôler. Une opinion se discute : c'est un jugement de valeur, légitime, mais que les faits ne peuvent pas trancher. Une prédiction s'évalue plus tard : personne ne peut la vérifier aujourd'hui. Dans le débat politique, les trois se déguisent en permanence l'un en l'autre — savoir les distinguer est sans doute le réflexe le plus utile pour s'informer.`,
  },

  // ── N2 ──────────────────────────────────────────────────────────────────────
  level2: {
    sections: [
      {
        titre: { fr: `Qu'est-ce qu'un fait ?` },
        corps: {
          fr: `Un fait est une affirmation que l'on peut vérifier : elle est vraie ou fausse, indépendamment de ce qu'on en pense. Exemple : « selon l'INSEE, le taux de chômage était d'environ 7,4 % de la population active fin 2024 ». Tout y est — un chiffre, une source (l'INSEE), une date (fin 2024), et un périmètre implicite que la source précise (le chômage « au sens du BIT », France hors Mayotte). N'importe qui peut aller contrôler.\n\nAttention : un énoncé factuel peut être faux — c'est même ce qui le définit. « Le chômage a doublé en un an » est un énoncé de fait : il se vérifie, et s'il est contredit par les données, il est faux. Ce qui distingue le fait de l'opinion n'est pas d'être vrai, c'est d'être tranchable. Un fait sans date, sans source et sans périmètre n'est pas encore un fait : c'est une affirmation en attente de vérification.`,
        },
        sources: [{ label: `INSEE — taux de chômage au sens du BIT, séries trimestrielles (définitions et périmètre)`, url: 'https://www.insee.fr', year: 2025 }],
      },
      {
        titre: { fr: `Qu'est-ce qu'une opinion ?` },
        corps: {
          fr: `Une opinion est un jugement de valeur : elle dit ce qui est souhaitable, juste, prioritaire — pas ce qui est. « Il y a trop d'impôts en France » est une opinion, classiquement portée à droite ; « les services publics manquent de moyens » en est une autre, classiquement portée à gauche. Aucune des deux n'est démontrable ni réfutable par les données seules : le niveau des prélèvements et des dépenses publiques est un fait mesurable, mais « trop » et « pas assez » sont des jugements — ils dépendent de ce qu'on attend de l'État.\n\nUne opinion est légitime en démocratie : c'est la matière même du débat politique. Elle peut être plus ou moins informée, plus ou moins cohérente, appuyée sur des faits exacts ou inexacts — mais elle ne devient jamais un fait, même partagée par une large majorité. Et symétriquement : la contester n'est pas « nier les faits », c'est débattre.`,
        },
      },
      {
        titre: { fr: `Qu'est-ce qu'une prédiction ?` },
        corps: {
          fr: `Une prédiction est une affirmation sur l'avenir : « cette réforme créera des emplois », « cette loi fera baisser la délinquance », « sans cette mesure, les déficits exploseront ». Elle est invérifiable au moment où elle est prononcée — c'est sa caractéristique centrale, et c'est pourquoi le débat politique en regorge : on ne peut pas prendre son auteur en défaut le jour même.\n\nUne prédiction n'est pas illégitime : gouverner, c'est faire des paris sur l'avenir, souvent appuyés sur des études d'impact ou des précédents. Mais elle s'évalue plus tard — à condition d'avoir fixé les critères à l'avance : quel indicateur ? à quel horizon ? et par rapport à quoi ? (que se serait-il passé sans la mesure ? c'est la question la plus difficile, celle du « contrefactuel »). Bon réflexe : quand un responsable politique prédit, noter le critère et la date — et y revenir.`,
        },
        sources: [{ label: `Vie-publique.fr — les études d'impact des projets de loi : objet et limites`, url: 'https://www.vie-publique.fr', year: 2024 }],
      },
      {
        titre: { fr: `Le test des trois questions` },
        brique: 'a-retenir',
        corps: {
          fr: `Devant n'importe quel énoncé politique, trois questions suffisent presque toujours à le classer.\n\n1. Puis-je le vérifier aujourd'hui ? Si oui, c'est un énoncé de fait — vrai ou faux, mais tranchable.\n2. Avec quelle source, quelle date, quel périmètre ? Un « fait » qui ne peut citer ni source, ni date, ni périmètre n'est pas encore vérifiable — le suspendre jusqu'à preuve.\n3. Si ce n'est pas vérifiable : est-ce un jugement (une opinion — à discuter) ou un pari sur l'avenir (une prédiction — à évaluer plus tard, avec des critères notés dès maintenant) ?`,
        },
      },
      {
        titre: { fr: `Les hybrides pièges` },
        brique: 'confusion',
        corps: {
          fr: `Le débat public mélange rarement les trois catégories par hasard — chacune emprunte volontiers le costume d'une autre.\n\nLe « fait » sans source : « les chiffres montrent que… », « toutes les études prouvent que… » — lesquels ? lesquelles ? Un habillage factuel sans référence vérifiable n'est qu'une affirmation. L'opinion déguisée en évidence : « chacun sait que… », « il est évident que… », « les Français en ont assez de… » — des formules qui présentent un jugement comme un fait établi, en rendant le désaccord presque impoli. La prédiction assénée au présent : « cette loi crée 100 000 emplois » — le présent de l'indicatif donne à un pari l'allure d'un résultat déjà constaté. Repérer le déguisement ne dit pas qui a raison ; cela dit simplement quel type de preuve exiger.`,
        },
      },
    ],
  },

  // ── N3 ──────────────────────────────────────────────────────────────────────
  level3: {
    sections: [
      {
        id: 'sources-primaires-et-secondaires',
        titre: { fr: `Sources primaires et secondaires : toujours remonter d'un cran` },
        corps: {
          fr: `Une source primaire est le document d'origine : le texte de la loi sur Légifrance, le rapport complet de l'INSEE ou de la Cour des comptes, le discours intégral, le compte rendu officiel d'une séance à l'Assemblée. Une source secondaire en parle : article de presse, éditorial, publication sur les réseaux sociaux, déclaration d'un adversaire politique. La secondaire est utile — elle résume, contextualise, rend lisible — mais chaque intermédiaire peut couper, simplifier ou orienter.\n\nLe réflexe : remonter d'un cran chaque fois que c'est possible. On vous dit « la loi prévoit que… » ? Le texte est public sur Légifrance. « Selon un rapport… » ? Le rapport est presque toujours en ligne, et son résumé médiatique en retient parfois un chiffre sorti de son périmètre. « Il a déclaré que… » ? La citation coupée est l'un des procédés les plus courants du débat politique — le discours intégral ou la vidéo complète permettent de vérifier le contexte. Plus une affirmation est spectaculaire, plus le détour par la source primaire vaut la peine.`,
        },
        sources: [
          { label: `Légifrance — l'accès direct aux textes de loi consolidés`, url: 'https://www.legifrance.gouv.fr', year: 2025 },
          { label: `CLEMI — éducation aux médias et à l'information : évaluer une source`, url: 'https://www.clemi.fr', year: 2025 },
        ],
      },
      {
        id: 'verifier-une-affirmation',
        titre: { fr: `Vérifier une affirmation : le réflexe en quatre étapes` },
        corps: {
          fr: `1. Qui l'affirme ? Un ministre défend son bilan, un opposant le conteste, un institut vit de ses enquêtes, une association porte une cause : personne n'est neutre, et ce n'est pas disqualifiant — mais l'intérêt de l'émetteur indique dans quel sens le doute doit s'exercer.\n\n2. Quelle source primaire ? Chercher le document d'origine. S'il n'existe pas, ou si personne ne peut le produire, l'affirmation reste au statut de « non vérifiée » — ce qui ne veut pas dire fausse, mais pas encore établie.\n\n3. Quelle date, quel périmètre ? Un chiffre de 2019 cité en 2024, une statistique française illustrée par un exemple étranger, un « record » calculé sur deux ans : les données exactes hors de leur cadre sont la matière première des affirmations trompeuses.\n\n4. Qui dit le contraire, et pourquoi ? Chercher activement la meilleure objection : si elle porte sur les valeurs, on est dans le débat d'opinions ; si elle porte sur les données, l'une des deux versions est vérifiable. C'est souvent cette quatrième étape qui révèle la nature réelle du désaccord.`,
        },
        sources: [{ label: `CLEMI — fiches pédagogiques « vérifier l'information » (démarche de vérification)`, url: 'https://www.clemi.fr', year: 2025 }],
      },
      {
        id: 'le-piege-du-vrai-faux-binaire',
        titre: { fr: `Le piège du vrai/faux binaire` },
        corps: {
          fr: `Exiger que tout énoncé politique soit « vrai » ou « faux » est déjà une erreur de méthode. Beaucoup d'affirmations du débat public sont partiellement vraies : exactes sur un point, abusives sur un autre. D'autres sont trompeuses : chaque élément est exact, mais l'assemblage induit en erreur — un chiffre vrai sur une période choisie pour la démonstration, une moyenne vraie qui masque des écarts, une comparaison vraie entre des choses non comparables. D'autres encore sont indécidables en l'état : « les impôts ont augmenté » n'est ni vrai ni faux tant qu'on ne sait pas quels impôts, pour qui, sur quelle période.\n\nC'est exactement pour cette raison que le module Vrai/Faux de Poliscop admet cinq verdicts — vrai, faux, partiellement vrai, trompeur, impossible à répondre sans contexte — au lieu de deux. Ce n'est pas de la prudence excessive : forcer une réponse binaire sur un énoncé hybride, c'est déformer, dans un sens ou dans l'autre. Se méfier, en général, de quiconque présente un sujet politique complexe comme un simple vrai/faux.`,
        },
      },
      {
        id: 'fact-checking-et-limites',
        titre: { fr: `Le fact-checking : utile, pas infaillible` },
        corps: {
          fr: `Depuis les années 2010, la vérification des déclarations politiques est devenue un genre journalistique à part entière : la plupart des grandes rédactions françaises et des agences de presse ont une équipe dédiée. C'est un progrès réel : des affirmations autrefois incontestées sont désormais confrontées publiquement aux sources, avec la méthode expliquée.\n\nMais le fact-checking a ses limites, que ses praticiens sérieux reconnaissent eux-mêmes. Il choisit ses cibles — et ce choix peut être discuté. Il peut se tromper, et les corrections existent. Il traite mieux les énoncés de fait que les hybrides : face à une affirmation mi-factuelle mi-opinion, le verdict dépend de découpages contestables. Et il arrive après coup, quand l'affirmation a déjà circulé. Conclusion pratique : lire les articles de vérification, comparer plusieurs rédactions quand le sujet est disputé — et garder le meilleur réflexe, qui ne dépend de personne : remonter soi-même à la source primaire. Le fact-checking est une aide à la vérification, pas une autorité qui dispenserait de vérifier.`,
        },
        sources: [{ label: `CLEMI — dossier « le fact-checking » : apports et limites du journalisme de vérification`, url: 'https://www.clemi.fr', year: 2024 }],
      },
    ],
  },

  vraiFaux: ['vf-fop-opinion-partagee', 'vf-fop-debattre-de-tout', 'vf-fop-chiffres-mentent-pas'],

  quiz: [
    {
      question: { fr: `« Selon l'INSEE, la France comptait environ 68 millions d'habitants au 1er janvier 2024. » C'est…` },
      options: [
        { fr: `Un fait : daté, sourcé, vérifiable par n'importe qui` },
        { fr: `Une opinion : chacun voit la population comme il veut` },
        { fr: `Une prédiction : la population change tout le temps` },
        { fr: `Impossible à classer` },
      ],
      bonneReponse: 0,
      explication: { fr: `Tout y est : un chiffre, une source (l'INSEE), une date (1er janvier 2024). On peut aller le contrôler — c'est la définition même d'un énoncé de fait. Qu'il soit exact ou non est une autre question : il est tranchable.` },
    },
    {
      question: { fr: `« Il y a trop de fonctionnaires en France. » C'est…` },
      options: [
        { fr: `Un fait, puisque le nombre de fonctionnaires est connu` },
        { fr: `Une opinion : le nombre est un fait, mais « trop » est un jugement de valeur` },
        { fr: `Une prédiction` },
        { fr: `Une affirmation fausse` },
      ],
      bonneReponse: 1,
      explication: { fr: `Le nombre d'agents publics est mesurable (l'INSEE le publie). Mais « trop » dépend de ce qu'on attend de l'État : aucune donnée ne peut trancher ce jugement. Opinion légitime — à débattre, pas à vérifier. L'énoncé inverse (« il en manque ») est exactement dans le même cas.` },
    },
    {
      question: { fr: `« Cette réforme créera des emplois. » C'est…` },
      options: [
        { fr: `Un fait, si le gouvernement fournit une étude d'impact` },
        { fr: `Une opinion` },
        { fr: `Une prédiction : invérifiable aujourd'hui, à évaluer plus tard avec des critères précis` },
        { fr: `Forcément un mensonge` },
      ],
      bonneReponse: 2,
      explication: { fr: `Personne ne peut la vérifier au moment où elle est prononcée — même appuyée sur une étude d'impact, qui reste une estimation. Le bon réflexe : noter le critère (combien d'emplois ?), l'horizon (quand ?) et y revenir. Sans critères fixés à l'avance, la prédiction est invérifiable même après coup.` },
    },
    {
      question: { fr: `« Chacun sait que l'insécurité augmente. » Le piège de cette phrase, c'est…` },
      options: [
        { fr: `Aucun : c'est un fait établi` },
        { fr: `C'est une prédiction déguisée` },
        { fr: `« Chacun sait que » présente comme une évidence une affirmation qui devrait être vérifiée — avec quelles infractions, quelle période, quelle source ?` },
        { fr: `Parler d'insécurité est interdit dans un débat` },
      ],
      bonneReponse: 2,
      explication: { fr: `« L'insécurité augmente » serait vérifiable une fois précisé de quoi on parle (quelles infractions, quelle période, quelles données — les statistiques du ministère de l'Intérieur et les enquêtes de victimation ne racontent pas toujours la même chose). Mais « chacun sait que » court-circuite la vérification : c'est l'habillage classique d'une affirmation en évidence.` },
    },
    {
      question: { fr: `« Le chômage a baissé. » Sans autre précision, c'est…` },
      options: [
        { fr: `Toujours un fait, car le chômage est mesuré` },
        { fr: `Un énoncé de fait incomplet : sans date, périmètre ni source, il n'est pas encore vérifiable` },
        { fr: `Une opinion` },
        { fr: `Une prédiction` },
      ],
      bonneReponse: 1,
      explication: { fr: `Baissé depuis quand ? Mesuré comment — chômage au sens du BIT (INSEE) ou inscrits à France Travail, deux chiffres très différents ? L'énoncé est de nature factuelle, mais il manque tout ce qui permettrait de le trancher. Avant de le classer vrai ou faux, exiger la date, le périmètre et la source.` },
    },
  ],

  // ── N4 ──────────────────────────────────────────────────────────────────────
  level4: {
    items: [
      { kind: 'lien', titre: { fr: `Vie-publique.fr` }, note: { fr: `Des fiches institutionnelles datées et sourcées sur le fonctionnement de l'État, les lois et les débats — un bon point d'entrée pour vérifier une affirmation sur les institutions.` }, url: 'https://www.vie-publique.fr' },
      { kind: 'lien', titre: { fr: `CLEMI — éducation aux médias et à l'information` }, note: { fr: `Les guides du centre public d'éducation aux médias : évaluer une source, vérifier une image, comprendre le fact-checking. Conçus pour l'école, utiles à tout âge.` }, url: 'https://www.clemi.fr' },
      { kind: 'lien', titre: { fr: `INSEE — « comprendre les statistiques »` }, note: { fr: `Les définitions officielles derrière les chiffres du débat public : chômage au sens du BIT, pauvreté, pouvoir d'achat, immigration. Le périmètre exact de chaque indicateur, expliqué par ceux qui le mesurent.` }, url: 'https://www.insee.fr' },
      { kind: 'livre', titre: { fr: `Normand Baillargeon, « Petit cours d'autodéfense intellectuelle » (Lux, 2005)` }, note: { fr: `Un classique accessible de l'esprit critique : langage, chiffres, sophismes, médias. Écrit pour le grand public, sans jargon.` } },
    ],
  },

  motsAssocies: [
    { label: { fr: `Source primaire` }, soon: true },
    { label: { fr: `Fact-checking` }, soon: true },
    { label: { fr: `Étude d'impact` }, soon: true },
  ],
  continuerAvec: [
    { slug: 'lire-un-sondage', label: { fr: `Lire un sondage` }, soon: true },
    { slug: 'lire-une-statistique', label: { fr: `Lire une statistique` }, soon: true },
    { slug: 'elections' },
  ],

  sources: [
    { label: `INSEE — définitions et méthodes : chômage au sens du BIT, population, agents publics (périmètres officiels des indicateurs)`, url: 'https://www.insee.fr', year: 2025 },
    { label: `CLEMI — ressources d'éducation aux médias et à l'information : évaluer une source, démarche de vérification, fact-checking`, url: 'https://www.clemi.fr', year: 2025 },
    { label: `Vie-publique.fr — fiches sur les études d'impact et le processus législatif`, url: 'https://www.vie-publique.fr', year: 2024 },
    { label: `Légifrance — accès direct aux textes de loi (source primaire du droit)`, url: 'https://www.legifrance.gouv.fr', year: 2025 },
  ],
};
