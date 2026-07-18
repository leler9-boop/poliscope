/**
 * Items « Vrai ou faux ? » — fiche institution « Le Conseil constitutionnel ».
 * Items NOUVEAUX référencés par la fiche (aucun vf-cc-* préexistant dans la
 * banque principale, src/content/learn/vraifaux/bank.js).
 *
 * verdict : 'vrai' | 'faux' | 'partiel' | 'trompeur' | 'sans-contexte'
 */

export default {

  'vf-cc-annuler-toute-loi': {
    categorie: 'institutions',
    enonce: { fr: `Le Conseil constitutionnel peut annuler n'importe quelle loi à tout moment.` },
    verdict: 'faux',
    explication: {
      fr: `Le Conseil ne peut pas s'autosaisir. Avant la promulgation, il n'examine une loi que si on la lui défère — président de la République, Premier ministre, présidents des deux chambres, ou (depuis 1974) 60 députés ou 60 sénateurs. Si personne ne le saisit, la loi entre en vigueur sans contrôle. Après la promulgation, seule une question prioritaire de constitutionnalité (QPC, depuis le 1er mars 2010) permet de la contester : elle doit être soulevée par un justiciable à l'occasion d'un procès, porter sur une atteinte à des droits garantis par la Constitution, et franchir le filtre de la Cour de cassation ou du Conseil d'État. Le Conseil est puissant, mais son intervention dépend toujours d'une saisine.`,
    },
    sources: [{ label: `Constitution du 4 octobre 1958, articles 61 et 61-1 (Légifrance)`, url: 'https://www.legifrance.gouv.fr', year: 2008 }],
    related: ['conseil-constitutionnel'],
  },

  'vf-cc-membres-juges': {
    categorie: 'institutions',
    enonce: { fr: `Les membres du Conseil constitutionnel sont forcément des juges.` },
    verdict: 'faux',
    explication: {
      fr: `Aucun texte n'exige que les membres du Conseil constitutionnel soient juges, magistrats ni même juristes : la Constitution ne pose aucune condition de qualification. Les neuf membres sont nommés par trois autorités politiques (président de la République, présidents de l'Assemblée nationale et du Sénat) et sont souvent d'anciens ministres ou parlementaires — Laurent Fabius, président du Conseil de 2016 à 2025, puis Richard Ferrand, nommé en 2025, sont tous deux d'anciens responsables politiques. C'est une singularité française régulièrement critiquée : en Allemagne, les juges de Karlsruhe doivent être des juristes qualifiés, élus aux deux tiers par le Parlement. Depuis 2008, les nominations passent par une audition parlementaire, avec veto possible aux trois cinquièmes des suffrages exprimés négatifs — jamais atteint à ce jour.`,
    },
    sources: [{ label: `Constitution, articles 13 et 56 ; Vie-publique.fr — la nomination des membres du Conseil constitutionnel`, url: 'https://www.vie-publique.fr', year: 2025 }],
    related: ['conseil-constitutionnel'],
  },

  'vf-cc-retraites-2023': {
    categorie: 'institutions',
    enonce: { fr: `Le Conseil constitutionnel a censuré la réforme des retraites de 2023.` },
    verdict: 'faux',
    explication: {
      fr: `C'est l'inverse pour l'essentiel : dans sa décision du 14 avril 2023, le Conseil valide le cœur de la réforme — le report de l'âge légal à 64 ans — ainsi que le choix contesté de la faire passer par une loi de financement rectificative de la Sécurité sociale. Il ne censure que des dispositions annexes (dont l'« index seniors » et le « CDI seniors »), jugées étrangères au domaine de ce type de loi, sans se prononcer sur leur intérêt. Le même jour, puis le 3 mai 2023, il rejette aussi deux propositions de référendum d'initiative partagée visant la réforme. Rappel utile : le Conseil juge la conformité à la Constitution, pas l'opportunité politique — une réforme massivement contestée dans la rue peut être parfaitement constitutionnelle.`,
    },
    sources: [{ label: `Conseil constitutionnel — décision 2023-849 DC du 14 avril 2023 et décisions RIP des 14 avril et 3 mai 2023`, url: 'https://www.conseil-constitutionnel.fr', year: 2023 }],
    related: ['conseil-constitutionnel'],
  },

  'vf-cc-immigration-fond': {
    categorie: 'institutions',
    enonce: { fr: `La censure de la loi immigration de 2024 a porté sur le fond des mesures.` },
    verdict: 'trompeur',
    explication: {
      fr: `Dans sa décision 2023-863 DC du 25 janvier 2024, le Conseil écarte environ 40 % des articles de la loi — mais très majoritairement comme « cavaliers législatifs » : des dispositions ajoutées par amendement sans lien suffisant avec le projet initial, censurées pour ce vice de procédure. Sur le fond de la plupart de ces mesures (quotas migratoires, conditions de durée pour certaines prestations sociales, durcissement du regroupement familial…), le Conseil ne s'est pas prononcé : rien n'interdit au législateur de les représenter dans un autre texte, où elles seraient alors examinées au fond. Présenter cette décision comme une invalidation sur le fond — ou comme une validation implicite des mesures écartées — déforme dans les deux sens ce que le Conseil a réellement jugé.`,
    },
    sources: [{ label: `Conseil constitutionnel — décision 2023-863 DC du 25 janvier 2024 et communiqué de presse`, url: 'https://www.conseil-constitutionnel.fr', year: 2024 }],
    related: ['conseil-constitutionnel'],
  },

};
