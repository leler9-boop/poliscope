/**
 * Items « Vrai ou faux ? » — fiche débat « La laïcité ».
 * verdict : 'vrai' | 'faux' | 'partiel' | 'trompeur' | 'sans-contexte'
 */

export default {

  'vf-laicite-espace-public': {
    categorie: 'societe',
    enonce: { fr: `La laïcité interdit les religions dans l'espace public.` },
    verdict: 'faux',
    explication: {
      fr: `C'est l'inverse de son principe : l'article 1er de la loi de 1905 dispose que « la République assure la liberté de conscience » et garantit le libre exercice des cultes. La neutralité s'impose à l'État et à ses agents — pas aux citoyens, qui peuvent porter des signes religieux dans la rue, manifester leur foi et processionner. Les restrictions existantes ont des fondements précis et limités : la loi de 2004 vise les élèves des écoles publiques, celle de 2010 sur la dissimulation du visage repose sur l'ordre public. Confondre laïcité et effacement du religieux est l'erreur la plus répandue sur le sujet — dans tous les camps.`,
    },
    sources: [{ label: `Loi du 9 décembre 1905, articles 1 et 2 (Légifrance)`, url: 'https://www.legifrance.gouv.fr', year: 1905 }],
    related: ['laicite'],
  },

  'vf-laicite-1905-voile': {
    categorie: 'societe',
    enonce: { fr: `La loi de 1905 interdit le voile.` },
    verdict: 'faux',
    explication: {
      fr: `La loi de 1905 ne dit pas un mot des tenues vestimentaires — ni de l'école. Elle organise la séparation des Églises et de l'État : liberté de conscience, fin du financement public des cultes. C'est la loi du 15 mars 2004 qui interdit les signes religieux « ostensibles », et uniquement pour les élèves des écoles, collèges et lycées publics — pas à l'université, pas dans la rue, pas pour les parents accompagnateurs (sujet resté débattu). Dater correctement les règles permet de comprendre ce qui relève de la loi de 1905 et ce qui relève de choix plus récents — et donc discutables comme tels.`,
    },
    sources: [{ label: `Loi du 15 mars 2004 (Légifrance) ; Vie-publique.fr — laïcité à l'école`, url: 'https://www.legifrance.gouv.fr', year: 2004 }],
    related: ['laicite'],
  },

  'vf-laicite-seul-pays': {
    categorie: 'societe',
    enonce: { fr: `La France est le seul pays laïque au monde.` },
    verdict: 'faux',
    explication: {
      fr: `De nombreux pays pratiquent une séparation entre religion et État — les États-Unis l'ont inscrite dans leur Constitution dès 1791, le Mexique, la Turquie ou l'Inde ont leurs propres modèles. Ce qui est singulier en France, c'est la combinaison : une séparation stricte issue d'un conflit historique avec l'Église catholique, une neutralité forte des agents publics et de l'école, et un mot — « laïcité » — devenu un principe constitutionnel (article 1er de la Constitution de 1958) et un marqueur identitaire du débat public. Le modèle français est particulier ; il n'est pas unique.`,
    },
    sources: [{ label: `Jean Baubérot, Histoire de la laïcité en France, PUF « Que sais-je ? » ; Constitution de 1958, article 1er`, year: 2021 }],
    related: ['laicite'],
  },

  'vf-laicite-alsace-moselle': {
    categorie: 'societe',
    enonce: { fr: `En Alsace-Moselle, l'État salarie des ministres du culte.` },
    verdict: 'vrai',
    explication: {
      fr: `C'est l'exception française à la française : l'Alsace et la Moselle étaient allemandes en 1905, la loi de séparation ne s'y est jamais appliquée. Le régime concordataire de 1801 y subsiste — prêtres, pasteurs et rabbins des cultes reconnus y sont rémunérés par l'État, et un enseignement religieux existe à l'école publique (avec dispense possible). Le Conseil constitutionnel a jugé ce régime conforme à la Constitution en 2013, au nom de la tradition républicaine locale. Sa suppression est régulièrement proposée, jamais adoptée — les élus locaux de tous bords y sont majoritairement attachés.`,
    },
    sources: [{ label: `Conseil constitutionnel — décision QPC 2012-297 du 21 février 2013 (traitement des pasteurs) ; Vie-publique.fr — le régime concordataire d'Alsace-Moselle`, url: 'https://www.conseil-constitutionnel.fr', year: 2013 }],
    related: ['laicite'],
  },

};
