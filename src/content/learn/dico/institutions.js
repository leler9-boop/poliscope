/**
 * Dictionnaire — catégorie « Institutions et vie politique ».
 * Un fichier par catégorie ; chaque terme suit le modèle definition
 * (niveau 1 = une phrase, niveau 2 = simple/concrètement/exemple/débat).
 */

export const TERMS = {

  '49-3': {
    slug: '49-3',
    type: 'definition',
    categorie: 'institutions',
    title: { fr: `Le 49.3`, en: 'Article 49.3' },
    icon: '🏛️',
    difficulty: 1,
    famille: 'intermediaire',
    updatedAt: '2026-07-12',
    freshness: { type: 'periodic', reviewEveryMonths: 12, lastReviewedAt: '2026-07-12' },
    level1: {
      fr: `Le 49.3 est un article de la Constitution qui permet au Premier ministre de faire adopter une loi sans vote à l'Assemblée nationale — au prix d'un risque : les députés peuvent répliquer en tentant de renverser le gouvernement.`,
    },
    level2: {
      sections: [
        {
          titre: { fr: 'Concrètement' },
          corps: {
            fr: `Normalement, les lois doivent être votées par les députés. Avec le 49.3, le gouvernement engage sa responsabilité sur un texte : la loi est considérée comme adoptée sans vote. Les députés peuvent répondre en déposant une motion de censure. Si elle échoue, la loi passe. Si elle est adoptée (289 voix sur 577), le gouvernement tombe et le texte est rejeté. En pratique, le 49.3 est surtout utilisé quand le gouvernement n'a pas de majorité stable.`,
          },
        },
        {
          titre: { fr: 'Exemple' },
          corps: {
            fr: `En 2023, la Première ministre Élisabeth Borne a utilisé le 49.3 pour faire adopter la réforme des retraites reculant l'âge légal de 62 à 64 ans — sans vote final à l'Assemblée nationale. La motion de censure qui a suivi a échoué à neuf voix près.`,
          },
        },
        {
          titre: { fr: 'Ce qui fait débat' },
          corps: {
            fr: `Ses partisans y voient un outil nécessaire pour gouverner quand l'Assemblée est fragmentée — prévu par la Constitution précisément pour cela. Ses opposants estiment qu'il contourne le débat démocratique et affaiblit le Parlement. Son usage répété tend à nourrir la défiance envers les institutions.`,
          },
        },
      ],
    },
    motsAssocies: ['motion-de-censure'],
    sources: [
      { label: `Constitution du 4 octobre 1958, article 49 (Légifrance)`, url: 'https://www.legifrance.gouv.fr', year: 1958 },
      { label: `Vie-publique.fr — fiche « Qu'est-ce que l'article 49.3 ? »`, url: 'https://www.vie-publique.fr', year: 2025 },
    ],
    vraiFaux: ['vf-493-president'],
  },

  'motion-de-censure': {
    slug: 'motion-de-censure',
    type: 'definition',
    categorie: 'institutions',
    title: { fr: `La motion de censure`, en: 'Motion of no confidence' },
    icon: '🗳️',
    difficulty: 1,
    famille: 'intermediaire',
    updatedAt: '2026-07-12',
    freshness: { type: 'periodic', reviewEveryMonths: 12, lastReviewedAt: '2026-07-12' },
    level1: {
      fr: `Une motion de censure est un vote des députés pour renverser le gouvernement : si elle est adoptée, le Premier ministre doit démissionner.`,
    },
    level2: {
      sections: [
        {
          titre: { fr: 'Concrètement' },
          corps: {
            fr: `Les députés qui s'opposent au gouvernement peuvent rassembler des signatures (au moins un dixième de l'Assemblée) et déposer une motion de censure. Elle est débattue puis votée : il faut une majorité absolue — 289 voix sur 577 — pour qu'elle soit adoptée. Seuls les votes « pour » sont comptés. C'est le principal contrepoids du Parlement face au gouvernement dans la Ve République.`,
          },
        },
        {
          titre: { fr: 'Exemple' },
          corps: {
            fr: `En décembre 2024, une motion de censure a renversé le gouvernement de Michel Barnier après seulement 89 jours — le plus court de la Ve République. C'était la première censure aboutie depuis 1962.`,
          },
        },
        {
          titre: { fr: 'Ce qui fait débat' },
          corps: {
            fr: `Certains y voient un outil démocratique vital pour obliger le gouvernement à rendre des comptes. D'autres estiment que, dans une Assemblée fragmentée, elle produit de l'instabilité et rend le pays difficile à gouverner. Les deux lectures décrivent le même mécanisme — vu du Parlement ou vu du gouvernement.`,
          },
        },
      ],
    },
    motsAssocies: ['49-3'],
    sources: [
      { label: `Constitution du 4 octobre 1958, article 49 (Légifrance)`, url: 'https://www.legifrance.gouv.fr', year: 1958 },
      { label: `Assemblée nationale — engagements de responsabilité et motions de censure`, url: 'https://www.assemblee-nationale.fr', year: 2025 },
    ],
    vraiFaux: ['vf-493-president'],
  },

  'proportionnelle': {
    slug: 'proportionnelle',
    type: 'definition',
    categorie: 'institutions',
    title: { fr: `La proportionnelle`, en: 'Proportional representation' },
    icon: '📊',
    difficulty: 1,
    famille: 'court',
    updatedAt: '2026-07-12',
    freshness: { type: 'periodic', reviewEveryMonths: 12, lastReviewedAt: '2026-07-12' },
    level1: {
      fr: `La proportionnelle est un mode de scrutin où les sièges sont répartis en proportion des voix : un parti qui obtient 20 % des voix obtient environ 20 % des sièges.`,
    },
    level2: {
      sections: [
        {
          titre: { fr: 'Concrètement' },
          corps: {
            fr: `Elle s'oppose au scrutin majoritaire, où le candidat arrivé en tête dans une circonscription remporte le siège — ce qui avantage les grands partis et peut donner une majorité nette à un camp minoritaire en voix. En France, les députés sont élus au scrutin majoritaire à deux tours ; les élections européennes, en revanche, se font à la proportionnelle. La proportionnelle a été utilisée une seule fois pour les législatives sous la Ve République, en 1986.`,
          },
        },
        {
          titre: { fr: 'Ce qui fait débat' },
          corps: {
            fr: `Ses partisans soulignent qu'elle représente plus fidèlement la diversité des opinions et évite que des millions d'électeurs n'aient aucun élu. Ses opposants craignent qu'elle rende toute majorité impossible et oblige à des coalitions instables. L'introduction d'une « dose de proportionnelle » aux législatives revient régulièrement dans le débat français — annoncée plusieurs fois, jamais adoptée à ce jour.`,
          },
        },
      ],
    },
    motsAssocies: ['motion-de-censure'],
    sources: [
      { label: `Vie-publique.fr — fiche « Les modes de scrutin »`, url: 'https://www.vie-publique.fr', year: 2025 },
    ],
    vraiFaux: [],
  },
};

export default TERMS;
