/**
 * Banque « Vrai ou faux ? » — chaque item vit ici une seule fois et est référencé
 * par les fiches (champ vraiFaux: [ids]) et par la carte interactive du hub.
 *
 * verdict : 'vrai' | 'faux' | 'partiel' | 'trompeur' | 'sans-contexte'
 * Jamais de réponse binaire forcée — l'explication précise en quoi c'est nuancé.
 */

export const VERDICT_LABELS = {
  vrai: { fr: 'Vrai', en: 'True' },
  faux: { fr: 'Faux', en: 'False' },
  partiel: { fr: 'Partiellement vrai', en: 'Partly true' },
  trompeur: { fr: 'Trompeur', en: 'Misleading' },
  'sans-contexte': { fr: 'Impossible à répondre sans contexte', en: 'Cannot answer without context' },
};

export const VRAIFAUX_BANK = {

  'vf-droite-etat-minimal': {
    categorie: 'familles',
    enonce: { fr: `La droite veut toujours moins d'État.` },
    verdict: 'partiel',
    explication: {
      fr: `C'est vrai pour la droite libérale, qui veut réduire les dépenses publiques et laisser plus de place au marché. Mais la droite gaulliste défend historiquement un État fort et stratège (grands programmes industriels, indépendance nationale), et presque toutes les droites veulent un État renforcé dans ses missions dites régaliennes : police, justice, défense. La vraie question n'est pas « plus ou moins d'État » mais « l'État pour faire quoi ? ».`,
    },
    sources: [{ label: `René Rémond, Les Droites en France, Aubier, 1982`, year: 1982 }],
    related: ['droite'],
  },

  'vf-droite-extreme': {
    categorie: 'familles',
    enonce: { fr: `Droite et extrême droite, c'est la même chose.` },
    verdict: 'faux',
    explication: {
      fr: `Ce sont des catégories distinctes en science politique. Le classement à l'extrême droite repose sur des critères précis : conception de la nation fondée sur l'identité plutôt que sur la citoyenneté, désignation d'un groupe comme menace principale, rapport critique au pluralisme et aux contre-pouvoirs. La droite dite « de gouvernement » (libérale, conservatrice, gaulliste) accepte l'alternance et le cadre républicain sans le contester. La frontière entre les deux fait elle-même débat — mais l'existence de cette frontière est documentée, pas une opinion.`,
    },
    sources: [{ label: `Jean-François Sirinelli (dir.), Histoire des droites en France, Gallimard, 1992`, year: 1992 }],
    related: ['droite'],
  },

  'vf-droite-impots': {
    categorie: 'familles',
    enonce: { fr: `Toutes les droites veulent baisser tous les impôts.` },
    verdict: 'partiel',
    explication: {
      fr: `La baisse des impôts est un thème récurrent à droite, surtout pour les impôts sur la production, les successions ou les hauts revenus. Mais dans la pratique, des gouvernements de droite ont aussi créé ou augmenté des prélèvements (la CSG a par exemple été augmentée sous des majorités différentes), et la droite souverainiste ou sociale accepte des impôts élevés si l'objectif lui semble légitime (défense, sécurité, famille). L'écart entre le discours d'opposition et l'action au pouvoir est documenté pour tous les camps.`,
    },
    sources: [{ label: `Vie-publique.fr — repères sur les prélèvements obligatoires`, url: 'https://www.vie-publique.fr', year: 2025 }],
    related: ['droite'],
  },

  'vf-degaulle-classique': {
    categorie: 'familles',
    enonce: { fr: `De Gaulle était simplement un homme de droite classique.` },
    verdict: 'trompeur',
    explication: {
      fr: `De Gaulle est généralement classé à droite, mais il refusait lui-même l'étiquette et son action ne correspond pas à la droite libérale classique : État très interventionniste (planification, grands programmes industriels et nucléaires), politique sociale de la « participation », indépendance vis-à-vis des États-Unis (retrait du commandement intégré de l'OTAN en 1966), et une partie de son électorat venait des classes populaires. Le gaullisme est une famille à part, revendiquée depuis par des courants très différents.`,
    },
    sources: [{ label: `Discours de Bayeux, 16 juin 1946 (texte fondateur)`, year: 1946 }],
    related: ['droite'],
  },

  'vf-droite-ecologie': {
    categorie: 'familles',
    enonce: { fr: `On ne peut pas être écologiste et de droite.` },
    verdict: 'faux',
    explication: {
      fr: `Rien n'empêche d'être de droite et de considérer la protection de l'environnement comme une priorité : il existe une écologie conservatrice (préserver les paysages, la ruralité, le patrimoine — « conserver » est même au cœur du mot conservatisme) et une écologie libérale (miser sur l'innovation, le nucléaire, les incitations de marché). En revanche, les partis de droite français font rarement de l'écologie leur thème central, et critiquent souvent l'écologie dite « punitive » (normes, interdictions, taxes). Être écologiste ne dit donc pas votre camp — cela dit votre priorité.`,
    },
    related: ['droite'],
  },

  'vf-493-president': {
    categorie: 'institutions',
    enonce: { fr: `Le 49.3 permet au président de la République d'adopter seul une loi.` },
    verdict: 'faux',
    explication: {
      fr: `Le 49.3 est un outil du Premier ministre, pas du président. Il permet au gouvernement de faire adopter un texte sans vote à l'Assemblée nationale — mais les députés peuvent répliquer en déposant une motion de censure. Si elle est adoptée (289 voix), le gouvernement tombe et le texte est rejeté. Le 49.3 n'est donc pas un pouvoir absolu : c'est un bras de fer, avec un risque réel pour le gouvernement.`,
    },
    sources: [{ label: `Constitution du 4 octobre 1958, article 49 alinéa 3 (Légifrance)`, url: 'https://www.legifrance.gouv.fr', year: 1958 }],
    related: ['49-3', 'motion-de-censure'],
  },

  'vf-oqtf-peine': {
    categorie: 'immigration',
    enonce: { fr: `Une OQTF est une condamnation pénale.` },
    verdict: 'faux',
    explication: {
      fr: `Une OQTF (obligation de quitter le territoire français) est une décision administrative, prise par un préfet — pas par un juge pénal. Elle ne signifie pas que la personne a commis un délit : elle constate qu'elle n'a pas (ou plus) de droit au séjour. Elle peut être contestée devant le juge administratif. Une personne sous OQTF n'est donc ni « condamnée » ni forcément « dangereuse » — et inversement, une condamnation pénale ne déclenche pas automatiquement une OQTF.`,
    },
    sources: [{ label: `Code de l'entrée et du séjour des étrangers et du droit d'asile (CESEDA), livre VI (Légifrance)`, url: 'https://www.legifrance.gouv.fr', year: 2026 }],
    related: ['oqtf'],
  },
};

/** Résout une liste d'ids en items ; ignore les ids inconnus. */
export function getVraiFaux(ids = []) {
  return ids.map(id => (VRAIFAUX_BANK[id] ? { id, ...VRAIFAUX_BANK[id] } : null)).filter(Boolean);
}

export const VRAIFAUX_IDS = Object.keys(VRAIFAUX_BANK);
