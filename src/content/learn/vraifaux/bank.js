/**
 * Banque « Vrai ou faux ? » — chaque item vit ici une seule fois et est référencé
 * par les fiches (champ vraiFaux: [ids]) et par la carte interactive du hub.
 *
 * verdict : 'vrai' | 'faux' | 'partiel' | 'trompeur' | 'sans-contexte'
 * Jamais de réponse binaire forcée — l'explication précise en quoi c'est nuancé.
 */


import VF_DEGAULLE from './presidents/charles-de-gaulle.js';
import VF_POMPIDOU from './presidents/georges-pompidou.js';
import VF_VGE from './presidents/valery-giscard-destaing.js';
import VF_CHIRAC from './presidents/jacques-chirac.js';
import VF_SARKOZY from './presidents/nicolas-sarkozy.js';
import VF_HOLLANDE from './presidents/francois-hollande.js';
import VF_MACRON from './presidents/emmanuel-macron.js';

import VF_GAUCHE from './familles/gauche.js';
import VF_ED from './familles/extreme-droite.js';
import VF_EG from './familles/extreme-gauche.js';
import VF_CENTRE from './familles/centre.js';
import VF_IMMIGRATION from './debats/immigration.js';
import VF_LAICITE from './debats/laicite.js';
import VF_UE from './debats/union-europeenne.js';
import VF_AN from './institutions/assemblee-nationale.js';
import VF_CC from './institutions/conseil-constitutionnel.js';
import VF_ELECTIONS from './bases/elections.js';

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
  /* ── OQTF (fiche débat) ── */

  'vf-oqtf-expulsion-immediate': {
    categorie: 'immigration',
    enonce: { fr: `Toute personne sous OQTF est immédiatement expulsée.` },
    verdict: 'faux',
    explication: {
      fr: `La plupart des OQTF prévoient un délai de départ volontaire (en général 30 jours), et une grande partie n'est jamais exécutée : annulation par le juge, absence de laissez-passer consulaire, personne introuvable, protections familiales ou médicales, capacités de rétention limitées. Les chiffres publics situent le taux d'exécution mesuré le plus souvent entre 5 % et 15 % selon les années et les modes de calcul.`,
    },
    sources: [{ label: `Cour des comptes — rapport sur la lutte contre l'immigration irrégulière, janvier 2024`, url: 'https://www.ccomptes.fr', year: 2024 }],
    related: ['oqtf'],
  },

  'vf-oqtf-recours': {
    categorie: 'immigration',
    enonce: { fr: `Une personne sous OQTF ne peut exercer aucun recours.` },
    verdict: 'faux',
    explication: {
      fr: `L'OQTF peut être contestée devant le tribunal administratif, dans des délais courts qui dépendent de la procédure. Le recours suspend en général l'éloignement jusqu'à la décision du juge — et le juge annule une partie significative des décisions, ce qui est le fonctionnement normal du contrôle de l'administration dans un État de droit.`,
    },
    sources: [{ label: `CESEDA, livre VI — procédures contentieuses (Légifrance)`, url: 'https://www.legifrance.gouv.fr', year: 2026 }],
    related: ['oqtf'],
  },

  'vf-oqtf-dangereux': {
    categorie: 'immigration',
    enonce: { fr: `Toutes les OQTF concernent des personnes dangereuses.` },
    verdict: 'faux',
    explication: {
      fr: `Une OQTF sanctionne une situation administrative — l'absence de droit au séjour — pas un comportement. La grande majorité des personnes visées n'a commis aucune infraction pénale : déboutés de l'asile, titres non renouvelés, personnes jamais enregistrées. Les cas de menace à l'ordre public existent et relèvent de dispositions spécifiques, mais ils sont minoritaires dans la masse des décisions.`,
    },
    sources: [{ label: `Ministère de l'Intérieur — statistiques de l'éloignement ; CESEDA, livre VI`, url: 'https://www.interieur.gouv.fr', year: 2024 }],
    related: ['oqtf'],
  },

  'vf-oqtf-refus-agir': {
    categorie: 'immigration',
    enonce: { fr: `Si une OQTF n'est pas exécutée, c'est que l'État refuse d'agir.` },
    verdict: 'trompeur',
    explication: {
      fr: `La non-exécution résulte le plus souvent de causes que l'État ne contrôle que partiellement : annulations par le juge, refus de laissez-passer par les pays d'origine, personnes introuvables, contraintes matérielles. On peut critiquer les choix (prononcer massivement, moyens insuffisants, diplomatie inefficace) — mais présenter chaque OQTF non exécutée comme un simple refus d'agir déforme un problème documenté comme multifactoriel, en France comme chez ses voisins.`,
    },
    sources: [{ label: `Cour des comptes (2024) ; Eurostat — retours effectifs dans l'UE`, url: 'https://www.ccomptes.fr', year: 2024 }],
    related: ['oqtf'],
  },

  /* ── Président de la République ── */

  'vf-president-ecrit-lois': {
    categorie: 'institutions',
    enonce: { fr: `Le président écrit et vote les lois.` },
    verdict: 'faux',
    explication: {
      fr: `Les projets de loi sont préparés par le gouvernement, les propositions par les parlementaires — et seul le Parlement vote. Le président promulgue les lois votées (il ne peut pas s'y opposer durablement : il peut seulement demander une nouvelle délibération ou saisir le Conseil constitutionnel). Son influence réelle passe par sa majorité parlementaire, pas par un pouvoir législatif propre.`,
    },
    sources: [{ label: `Constitution de 1958, articles 10, 24, 39 (Légifrance)`, url: 'https://www.legifrance.gouv.fr', year: 1958 }],
    related: ['president-de-la-republique'],
  },

  'vf-president-regime-us': {
    categorie: 'institutions',
    enonce: { fr: `La France est un régime présidentiel, comme les États-Unis.` },
    verdict: 'faux',
    explication: {
      fr: `La France est un régime dit « semi-présidentiel » : le président élu au suffrage direct coexiste avec un Premier ministre responsable devant l'Assemblée — qui peut être renversé par une motion de censure, ce qui n'existe pas aux États-Unis. Inversement, le président français peut dissoudre l'Assemblée, ce que le président américain ne peut pas faire avec le Congrès. Les deux systèmes ne fonctionnent pas du tout de la même façon.`,
    },
    sources: [{ label: `Vie-publique.fr — régimes présidentiel, parlementaire et semi-présidentiel`, url: 'https://www.vie-publique.fr', year: 2025 }],
    related: ['president-de-la-republique'],
  },

  'vf-president-demission-pm': {
    categorie: 'institutions',
    enonce: { fr: `Le président peut révoquer le Premier ministre quand il le veut.` },
    verdict: 'partiel',
    explication: {
      fr: `Juridiquement, la Constitution prévoit que le président met fin aux fonctions du Premier ministre « sur la présentation par celui-ci de la démission du gouvernement » : il ne peut pas le révoquer unilatéralement. En pratique, hors cohabitation, les Premiers ministres remettent leur démission quand le président le demande — c'est une convention politique solidement établie, pas une obligation juridique. En cohabitation, le président ne peut pas se débarrasser d'un Premier ministre soutenu par l'Assemblée.`,
    },
    sources: [{ label: `Constitution de 1958, article 8`, url: 'https://www.legifrance.gouv.fr', year: 1958 }],
    related: ['president-de-la-republique'],
  },

  /* ── François Mitterrand ── */

  'vf-mitterrand-programme-14-ans': {
    categorie: 'presidents',
    enonce: { fr: `Mitterrand a intégralement appliqué un programme socialiste pendant quatorze ans.` },
    verdict: 'faux',
    explication: {
      fr: `La politique de rupture (nationalisations, retraite à 60 ans, hausse des salaires) n'a duré que deux ans : face à l'inflation, aux déficits et à trois dévaluations du franc, le « tournant de la rigueur » de mars 1983 réoriente la politique vers la désinflation et le maintien dans le système monétaire européen. Suivront deux cohabitations avec la droite (1986-1988, 1993-1995) et des privatisations. Les quatorze années Mitterrand contiennent en réalité plusieurs politiques économiques successives, parfois opposées.`,
    },
    sources: [{ label: `Vie-publique.fr — le tournant de la rigueur de 1983`, url: 'https://www.vie-publique.fr', year: 2025 }],
    related: ['francois-mitterrand'],
  },

  'vf-abolition-opinion': {
    categorie: 'presidents',
    enonce: { fr: `La peine de mort a été abolie parce que l'opinion publique le réclamait.` },
    verdict: 'faux',
    explication: {
      fr: `En 1981, les sondages donnaient une majorité de Français favorables au maintien de la peine de mort (environ 60 % selon les enquêtes de l'époque). Mitterrand avait annoncé sa position abolitionniste pendant la campagne, en assumant d'aller contre l'opinion majoritaire ; la loi portée par Robert Badinter a été votée le 9 octobre 1981. C'est un exemple classique de décision prise contre l'opinion du moment et jamais remise en cause depuis — l'abolition est constitutionnalisée depuis 2007.`,
    },
    sources: [{ label: `Vie-publique.fr — l'abolition de la peine de mort (loi du 9 octobre 1981) ; révision constitutionnelle de 2007 (article 66-1)`, url: 'https://www.vie-publique.fr', year: 2025 }],
    related: ['francois-mitterrand'],
  },

  'vf-mitterrand-renie-1981': {
    categorie: 'presidents',
    enonce: { fr: `Le tournant de la rigueur de 1983 a annulé tout ce qui avait été fait en 1981-1982.` },
    verdict: 'partiel',
    explication: {
      fr: `Le tournant de 1983 a bien enterré la politique de relance et la logique de rupture avec le capitalisme. Mais l'essentiel des réformes de société et de structure est resté : abolition de la peine de mort, retraite à 60 ans, cinquième semaine de congés payés, 39 heures, décentralisation, lois Auroux, radios libres, remboursement de l'IVG. Ce qui a changé, c'est la politique macroéconomique — pas les acquis sociaux et sociétaux des deux premières années.`,
    },
    sources: [{ label: `Vie-publique.fr — chronologie des réformes 1981-1983`, url: 'https://www.vie-publique.fr', year: 2025 }],
    related: ['francois-mitterrand'],
  },

  'vf-mitterrand-fondateur-europe': {
    categorie: 'presidents',
    enonce: { fr: `Mitterrand a fait entrer la France dans l'Union européenne.` },
    verdict: 'trompeur',
    explication: {
      fr: `La France est un pays fondateur de la construction européenne (traité de Rome, 1957) — bien avant Mitterrand. En revanche, il a joué un rôle décisif dans son approfondissement : relance avec Helmut Kohl, Acte unique (1986), et surtout traité de Maastricht (1992), qu'il a soumis à référendum et qui a créé l'Union européenne et programmé l'euro. Dire qu'il a « fait entrer la France dans l'UE » confond fondation et approfondissement.`,
    },
    sources: [{ label: `Vie-publique.fr — les traités européens ; Conseil constitutionnel — référendum du 20 septembre 1992 (oui : 51,04 %)`, url: 'https://www.vie-publique.fr', year: 1992 }],
    related: ['francois-mitterrand'],
  },

  /* ── Inflation ── */

  'vf-monnaie-inflation': {
    categorie: 'economie',
    enonce: { fr: `Créer de la monnaie provoque toujours immédiatement de l'inflation.` },
    verdict: 'trompeur',
    explication: {
      fr: `Le lien entre création monétaire et inflation existe mais n'est ni automatique ni immédiat. Les banques centrales ont créé des quantités massives de monnaie après 2008 sans inflation notable pendant une décennie ; l'inflation de 2021-2023 s'explique d'abord par les prix de l'énergie, les chaînes d'approvisionnement et la reprise post-Covid — la politique monétaire y a contribué, dans des proportions débattues par les économistes. Tout dépend d'où va la monnaie créée et de l'état de l'économie.`,
    },
    sources: [{ label: `Banque de France / BCE — analyses des causes de l'inflation 2021-2023`, url: 'https://www.banque-france.fr', year: 2023 }],
    related: ['inflation'],
  },

  'vf-inflation-tous-pareil': {
    categorie: 'economie',
    enonce: { fr: `L'inflation appauvrit tout le monde de la même façon.` },
    verdict: 'faux',
    explication: {
      fr: `L'inflation frappe très inégalement. Les ménages modestes consacrent une part plus grande de leur budget à l'énergie et à l'alimentation — les postes qui ont le plus augmenté en 2021-2023 — et ont moins d'épargne pour amortir. À l'inverse, l'inflation allège le poids réel des dettes : elle avantage les emprunteurs (dont l'État) au détriment des épargnants. Il y a des perdants et des gagnants — c'est précisément pour cela que c'est un sujet politique.`,
    },
    sources: [{ label: `INSEE — inflation par catégorie de ménages (analyses 2022-2023)`, url: 'https://www.insee.fr', year: 2023 }],
    related: ['inflation'],
  },

  'vf-inflation-baisse-prix': {
    categorie: 'economie',
    enonce: { fr: `Quand l'inflation baisse, les prix baissent.` },
    verdict: 'faux',
    explication: {
      fr: `Quand l'inflation passe de 6 % à 2 %, les prix continuent d'augmenter — simplement moins vite. C'est la désinflation. Une vraie baisse des prix s'appelle la déflation ; elle est rare et redoutée des économistes (elle pousse à reporter les achats et peut paralyser l'économie). Les prix atteints pendant la poussée de 2021-2023 sont donc, pour l'essentiel, restés acquis — ce qui explique que le ressenti reste dégradé même quand « l'inflation est vaincue ».`,
    },
    sources: [{ label: `INSEE — indice des prix à la consommation, définitions`, url: 'https://www.insee.fr', year: 2025 }],
    related: ['inflation'],
  },

  'vf-inflation-salaires': {
    categorie: 'economie',
    enonce: { fr: `Les salaires ont suivi l'inflation de 2021-2023.` },
    verdict: 'sans-contexte',
    explication: {
      fr: `Impossible de répondre en bloc : cela dépend du salaire, du secteur et de la période. Le SMIC est indexé sur l'inflation et a suivi mécaniquement ; les salaires proches du SMIC ont été tirés vers le haut. En revanche, le salaire moyen réel (corrigé de l'inflation) a reculé en 2022 avant de se redresser ensuite — avec de grandes différences entre branches. Toute affirmation générale sur « les salaires » sans préciser lesquels et sur quelle période est invérifiable.`,
    },
    sources: [{ label: `INSEE / DARES — évolution des salaires réels 2021-2024`, url: 'https://www.insee.fr', year: 2024 }],
    related: ['inflation'],
  },


  /* ── Items des fiches présidents (un fichier par président) ── */
  ...VF_DEGAULLE,
  ...VF_POMPIDOU,
  ...VF_VGE,
  ...VF_CHIRAC,
  ...VF_SARKOZY,
  ...VF_HOLLANDE,
  ...VF_MACRON,

  /* ── Items des fiches familles / débats / institutions / bases ── */
  ...VF_GAUCHE,
  ...VF_ED,
  ...VF_EG,
  ...VF_CENTRE,
  ...VF_IMMIGRATION,
  ...VF_LAICITE,
  ...VF_UE,
  ...VF_AN,
  ...VF_CC,
  ...VF_ELECTIONS,
};

/** Résout une liste d'ids en items ; ignore les ids inconnus. */
export function getVraiFaux(ids = []) {
  return ids.map(id => (VRAIFAUX_BANK[id] ? { id, ...VRAIFAUX_BANK[id] } : null)).filter(Boolean);
}

export const VRAIFAUX_IDS = Object.keys(VRAIFAUX_BANK);
