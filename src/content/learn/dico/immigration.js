/**
 * Dictionnaire — catégorie « Immigration, nationalité et asile ».
 * L'entrée OQTF est le cas d'école de rigueur du dossier d'architecture
 * (docs/jyconnaisrien/02, §10) : chaque affirmation est datée et périmétrée,
 * la grande fiche débat viendra la compléter (parentFiche).
 */

export const TERMS = {

  'oqtf': {
    slug: 'oqtf',
    type: 'definition',
    categorie: 'immigration',
    title: { fr: `L'OQTF`, en: 'OQTF (obligation to leave France)' },
    icon: '📄',
    difficulty: 2,
    famille: 'intermediaire',
    updatedAt: '2026-07-12',
    freshness: { type: 'live', reviewEveryMonths: 3, lastReviewedAt: '2026-07-12' },
    parentFiche: 'oqtf', // → la grande fiche débat (section debats)
    level1: {
      fr: `Une OQTF — obligation de quitter le territoire français — est une décision administrative demandant à une personne étrangère de quitter la France. C'est une décision du préfet, pas une condamnation pénale.`,
    },
    level2: {
      sections: [
        {
          titre: { fr: 'Qui peut en recevoir une, et qui décide ?' },
          corps: {
            fr: `Une OQTF peut viser une personne étrangère qui n'a pas de titre de séjour, dont le titre n'a pas été renouvelé, ou dont la demande d'asile a été définitivement rejetée. La décision est prise par le préfet, sur le fondement du CESEDA (le code qui régit le séjour des étrangers). Certaines personnes sont protégées contre l'éloignement — par exemple, en principe, les mineurs. Chaque situation dépend de conditions juridiques précises, qui évoluent avec la loi : c'est pour cela que cette fiche est datée et revue régulièrement.`,
          },
        },
        {
          titre: { fr: 'OQTF, expulsion : ce n\'est pas la même chose' },
          brique: 'confusion',
          corps: {
            fr: `L'OQTF demande à la personne de partir — souvent avec un délai de départ volontaire (en général 30 jours), parfois sans délai. L'expulsion, elle, est une mesure distincte et plus rare, motivée par une menace grave pour l'ordre public. Dire « expulsé » pour toute personne sous OQTF est donc juridiquement inexact. Autre confusion fréquente : un demandeur d'asile dont la demande est en cours d'examen n'est pas « sous OQTF » — il a le droit de se maintenir sur le territoire pendant l'examen, sauf exceptions prévues par la loi.`,
          },
        },
        {
          titre: { fr: 'Recours, et pourquoi toutes ne sont pas exécutées' },
          corps: {
            fr: `Une OQTF peut être contestée devant le tribunal administratif, dans des délais courts qui dépendent du type de procédure ; le recours suspend en général l'éloignement jusqu'à la décision du juge. Une partie importante des OQTF prononcées n'est pas exécutée : annulations par le juge, absence de « laissez-passer consulaire » du pays d'origine, situations familiales ou médicales protégées, personnes introuvables, capacités limitées des centres de rétention. L'écart entre décisions prononcées et départs effectifs est un fait documenté — ses causes et les réponses à y apporter sont, elles, un débat politique.`,
          },
        },
        {
          titre: { fr: 'Ce qui fait débat' },
          corps: {
            fr: `Les uns mettent en avant la fermeté : une décision de l'État doit être appliquée, sinon elle perd son sens. Les autres mettent en avant les droits fondamentaux : le juge annule une partie des OQTF précisément parce qu'elles étaient illégales ou touchaient des personnes protégées. S'y ajoutent des difficultés diplomatiques (coopération des pays d'origine) et pratiques (moyens des préfectures et de la justice). La grande fiche débat OQTF (lien en haut de page) détaille ces positions — avec les chiffres publics, leurs sources et leurs limites.`,
          },
        },
      ],
    },
    motsAssocies: [],
    sources: [
      { label: `CESEDA, livre VI — décisions d'éloignement (Légifrance)`, url: 'https://www.legifrance.gouv.fr', year: 2026, perimetre: `droit applicable en France métropolitaine ; des régimes spécifiques existent outre-mer` },
      { label: `Vie-publique.fr — fiche « Qu'est-ce qu'une OQTF ? »`, url: 'https://www.vie-publique.fr', year: 2025 },
    ],
    vraiFaux: ['vf-oqtf-peine'],
  },
};

export default TERMS;
