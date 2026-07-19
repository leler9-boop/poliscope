/**
 * Items « Vrai ou faux ? » — fiche panorama « Les partis politiques français ».
 * Uniquement les items NOUVEAUX référencés par la fiche.
 *
 * verdict : 'vrai' | 'faux' | 'partiel' | 'trompeur' | 'sans-contexte'
 */

export default {

  'vf-partis-argent-public': {
    categorie: 'partis',
    enonce: { fr: `Les partis politiques vivent de l'argent public.` },
    verdict: 'partiel',
    explication: {
      fr: `Pour la plupart des grands partis, le financement public est bien la ressource principale : une aide versée en deux fractions — selon les voix obtenues aux législatives (environ 1,64 € par voix et par an en 2024, sous conditions) et selon le nombre de parlementaires (environ 37 000 € par parlementaire et par an). Mais ce n'est pas la seule ressource : cotisations des adhérents, contributions des élus, dons de particuliers (plafonnés à 7 500 € par personne et par an) et legs complètent les budgets — et certains petits partis vivent surtout de leurs adhérents. Ce financement public n'est pas un privilège tombé du ciel : c'est la contrepartie d'une interdiction, celle des dons d'entreprises et de toutes les personnes morales, en vigueur depuis 1995 pour limiter les conflits d'intérêts. L'ensemble est contrôlé chaque année par la CNCCFP, qui publie les comptes.`,
    },
    sources: [
      { label: `CNCCFP — financement des partis politiques : aide publique, plafonds de dons, comptes publiés (montants 2024)`, url: 'https://www.cnccfp.fr', year: 2024 },
      { label: `Loi du 19 janvier 1995 relative au financement de la vie politique (Légifrance)`, url: 'https://www.legifrance.gouv.fr', year: 1995 },
    ],
    related: ['partis'],
  },

  'vf-partis-tous-pareils': {
    categorie: 'partis',
    enonce: { fr: `De toute façon, tous les partis sont pareils.` },
    verdict: 'trompeur',
    explication: {
      fr: `Le sentiment est répandu, et il a des causes réelles : les contraintes budgétaires et européennes resserrent les marges de manœuvre de tous les gouvernements, et les déceptions s'accumulent d'alternance en alternance. Mais l'affirmation ne résiste pas à l'examen des votes, qui sont publics et traçables : sur la réforme des retraites de 2023, sur les lois immigration, sur la fiscalité, sur l'Europe ou sur le nucléaire, les partis se sont opposés frontalement, au Parlement comme dans leurs programmes — les fiches débats de Poliscop (retraites, immigration, Union européenne…) documentent ces désaccords point par point. Dire « tous pareils » revient à confondre deux choses : des contraintes communes, qui existent, et des choix politiques identiques, qui ne sont pas au rendez-vous. On peut juger les différences insuffisantes ; on ne peut pas sérieusement les dire inexistantes.`,
    },
    sources: [
      { label: `Assemblée nationale — analyses des scrutins publics (votes par groupe sur les retraites 2023, l'immigration 2024)`, url: 'https://www.assemblee-nationale.fr', year: 2024 },
      { label: `Vie-publique.fr — dossiers comparés des programmes et des votes des partis`, url: 'https://www.vie-publique.fr', year: 2025 },
    ],
    related: ['partis'],
  },

  'vf-partis-rn-premier-parti': {
    categorie: 'partis',
    enonce: { fr: `Le RN est le premier parti de France.` },
    verdict: 'sans-contexte',
    explication: {
      fr: `Tout dépend de la métrique — et la phrase ne la précise jamais. En voix : oui aux dernières élections nationales — le RN et ses alliés sont arrivés premiers en voix aux législatives de 2024 (environ 10 millions au premier tour), après une nette première place aux européennes de 2024. En sièges : c'est plus nuancé — le RN y est le premier groupe unique de l'Assemblée, mais la coalition du Nouveau Front populaire, qui réunit plusieurs partis, a obtenu davantage de sièges, et le RN n'a pas de majorité. En adhérents : impossible à trancher — les chiffres d'adhérents de tous les partis sont déclaratifs et invérifiables, aucun organisme indépendant ne les contrôle. En élus locaux enfin, le RN reste loin derrière LR ou le PS. « Premier parti de France » est donc vrai pour une métrique précise (les voix aux derniers scrutins nationaux), et faux ou invérifiable pour les autres.`,
    },
    sources: [
      { label: `Ministère de l'Intérieur — résultats officiels des élections législatives et européennes 2024`, url: 'https://www.interieur.gouv.fr', year: 2024 },
      { label: `Vie-publique.fr — composition de l'Assemblée nationale issue des législatives 2024`, url: 'https://www.vie-publique.fr', year: 2024 },
    ],
    related: ['partis'],
  },

  'vf-partis-carte-obligatoire': {
    categorie: 'partis',
    enonce: { fr: `Il faut être membre d'un parti pour être élu.` },
    verdict: 'faux',
    explication: {
      fr: `Aucune loi n'exige d'appartenir à un parti pour se présenter à une élection : n'importe quel citoyen éligible peut être candidat, et les élus « sans étiquette » sont très nombreux au niveau local — dans les petites communes, c'est même la norme. Mais le vrai en creux mérite d'être dit : à l'échelle nationale, les partis restent pratiquement incontournables. Ce sont eux qui accordent les investitures et évitent les candidatures concurrentes, eux qui financent les campagnes et bénéficient de l'aide publique, eux qui structurent les groupes parlementaires ; et pour la présidentielle, réunir 500 parrainages d'élus sans réseau partisan est un exploit rare. On peut donc être élu sans carte — cela arrive à chaque scrutin — mais gouverner le pays sans parti, ou contre eux, ne s'est pour l'instant jamais vu sous la Ve République : même les candidats « hors système » finissent par fonder le leur.`,
    },
    sources: [
      { label: `Code électoral (Légifrance) — conditions d'éligibilité ; Conseil constitutionnel — règles de parrainage pour l'élection présidentielle`, url: 'https://www.legifrance.gouv.fr', year: 2025 },
      { label: `Vie-publique.fr — « Faut-il appartenir à un parti pour être candidat ? » et fiches sur les élus sans étiquette`, url: 'https://www.vie-publique.fr', year: 2025 },
    ],
    related: ['partis'],
  },

};
