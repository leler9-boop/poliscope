/**
 * Parcours guidés — séquences ordonnées de fiches existantes (aucun contenu propre,
 * sauf une phrase d'intro par étape). La progression est persistée dans le store
 * (parcoursDone) ; chaque étape est marquée lue quand la fiche est visitée depuis
 * le parcours. Terminer un parcours rapporte des points de connaissance.
 *
 * Toute étape DOIT référencer une entrée du manifeste (contrôlé par
 * scripts/check-learn-content.mjs).
 */

export const PARCOURS_LIST = [
  {
    slug: 'je-pars-de-zero',
    icon: '🌱',
    titre: { fr: `Je pars de zéro` },
    description: { fr: `Tout comprendre dans le bon ordre : les camps, les institutions, le vote — et un premier grand débat pour mettre en pratique.` },
    difficulty: 1,
    etapes: [
      { section: 'familles', slug: 'droite', pourquoi: { fr: `On commence par les repères que tout le monde utilise : qu'est-ce que « la droite » — et pourquoi il y en a plusieurs.` } },
      { section: 'familles', slug: 'gauche', pourquoi: { fr: `Le miroir : les gauches, leurs valeurs, leurs divisions.` } },
      { section: 'familles', slug: 'centre', pourquoi: { fr: `Ni neutre ni sans opinion : le troisième pôle du paysage.` } },
      { section: 'institutions', slug: 'president-de-la-republique', pourquoi: { fr: `L'institution la plus puissante — et la plus mal comprise.` } },
      { section: 'institutions', slug: 'assemblee-nationale', pourquoi: { fr: `Qui vote vraiment les lois, et comment tombe un gouvernement.` } },
      { section: 'bases', slug: 'elections', pourquoi: { fr: `Comment la France vote : scrutins, tours, abstention.` } },
      { section: 'debats', slug: 'inflation', pourquoi: { fr: `Un premier grand débat pour mettre tout ça en pratique — celui du pouvoir d'achat.` } },
    ],
  },
  {
    slug: 'comprendre-les-elections',
    icon: '🗳️',
    titre: { fr: `Comprendre les élections` },
    description: { fr: `Scrutins, candidats, sondages, second tour, abstention — et les camps en présence.` },
    difficulty: 1,
    etapes: [
      { section: 'bases', slug: 'elections', pourquoi: { fr: `Le mode d'emploi complet : qui vote, comment, pour quels scrutins.` } },
      { section: 'dico', slug: 'proportionnelle', pourquoi: { fr: `Le mode de scrutin dont la France débat depuis quarante ans.` } },
      { section: 'methodes', slug: 'lire-un-sondage', pourquoi: { fr: `Un sondage n'est jamais une prédiction : les réflexes pour les lire.` } },
      { section: 'institutions', slug: 'president-de-la-republique', pourquoi: { fr: `L'élection reine : parrainages, deux tours, quinquennat.` } },
      { section: 'institutions', slug: 'assemblee-nationale', pourquoi: { fr: `Les législatives : 577 circonscriptions qui font les majorités.` } },
      { section: 'partis', slug: 'partis', pourquoi: { fr: `Qui est qui : les partis en présence, un par un.` } },
    ],
  },
  {
    slug: 'comprendre-economie-politique',
    icon: '💶',
    titre: { fr: `Comprendre l'économie politique` },
    description: { fr: `Marché, inflation, dette, retraites — et ce que chaque camp propose d'en faire.` },
    difficulty: 2,
    etapes: [
      { section: 'dico', slug: 'economie-de-marche', pourquoi: { fr: `Le point de départ : marché et État, le débat central.` } },
      { section: 'debats', slug: 'inflation', pourquoi: { fr: `D'où viennent les hausses de prix, qui décide vraiment.` } },
      { section: 'dico', slug: 'dette-publique', pourquoi: { fr: `3 000 milliards : ce que c'est, pourquoi ça divise.` } },
      { section: 'debats', slug: 'retraites', pourquoi: { fr: `Le débat économique qui revient à chaque élection.` } },
      { section: 'methodes', slug: 'lire-une-statistique', pourquoi: { fr: `Moyenne, médiane, périmètres : les réflexes pour ne pas se faire avoir.` } },
      { section: 'familles', slug: 'gauche', pourquoi: { fr: `Les visions économiques de la gauche — du blocage des prix à la social-démocratie.` } },
      { section: 'familles', slug: 'droite', pourquoi: { fr: `Les visions économiques de la droite — du libéralisme à l'État stratège.` } },
    ],
  },
  {
    slug: 'comprendre-immigration',
    icon: '🌍',
    titre: { fr: `Comprendre l'immigration` },
    description: { fr: `Les mots exacts, les chiffres sourcés, le droit réel — avant les opinions.` },
    difficulty: 2,
    etapes: [
      { section: 'debats', slug: 'immigration', pourquoi: { fr: `Le dossier complet : définitions, chiffres, positions de chaque camp.` } },
      { section: 'debats', slug: 'oqtf', pourquoi: { fr: `Le sigle le plus cité et le plus mal compris du débat.` } },
      { section: 'debats', slug: 'laicite', pourquoi: { fr: `Le débat voisin : intégration, école, ce que dit vraiment la loi de 1905.` } },
      { section: 'debats', slug: 'union-europeenne', pourquoi: { fr: `La dimension européenne : Schengen, asile, pacte migratoire.` } },
      { section: 'methodes', slug: 'lire-une-statistique', pourquoi: { fr: `Les chiffres migratoires s'utilisent dans tous les sens : les réflexes pour vérifier.` } },
    ],
  },
  {
    slug: 'comprendre-union-europeenne',
    icon: '🇪🇺',
    titre: { fr: `Comprendre l'Union européenne` },
    description: { fr: `Qui décide quoi à Bruxelles, l'euro, Maastricht — et les visions qui s'affrontent.` },
    difficulty: 2,
    etapes: [
      { section: 'debats', slug: 'union-europeenne', pourquoi: { fr: `Le dossier complet : institutions, budget, primauté du droit, Brexit.` } },
      { section: 'presidents', slug: 'francois-mitterrand', pourquoi: { fr: `Maastricht, le « petit oui » de 1992 : le moment fondateur, raconté par la fiche Mitterrand.` } },
      { section: 'debats', slug: 'inflation', pourquoi: { fr: `L'euro au quotidien : pourquoi c'est la BCE, et pas Paris, qui fixe les taux.` } },
      { section: 'familles', slug: 'centre', pourquoi: { fr: `L'europhilie comme marqueur : la famille politique la plus constante sur l'Europe.` } },
      { section: 'familles', slug: 'droite', pourquoi: { fr: `Et la fracture : pourquoi la droite est divisée sur l'Europe depuis de Gaulle.` } },
    ],
  },
  {
    slug: 'comment-le-sait-on',
    icon: '🔬',
    titre: { fr: `Comment le sait-on ?` },
    description: { fr: `Sondages, statistiques, graphiques, faits et opinions : la boîte à outils du citoyen autonome.` },
    difficulty: 1,
    etapes: [
      { section: 'methodes', slug: 'fait-opinion-prediction', pourquoi: { fr: `La distinction la plus utile du débat public.` } },
      { section: 'methodes', slug: 'lire-un-sondage', pourquoi: { fr: `Estimation, marge d'erreur, jamais une prédiction.` } },
      { section: 'methodes', slug: 'lire-une-statistique', pourquoi: { fr: `Moyenne ou médiane, points ou pourcentages, périmètres.` } },
      { section: 'methodes', slug: 'graphique-trompeur', pourquoi: { fr: `Exact mais trompeur : les pièges visuels à repérer.` } },
      { section: 'bases', slug: 'elections', pourquoi: { fr: `Application : sondages électoraux, abstention, vote blanc — relire les chiffres avec les bons réflexes.` } },
    ],
  },
];

export function getParcours(slug) {
  return PARCOURS_LIST.find(p => p.slug === slug) || null;
}

export const stepKey = (e) => `${e.section}/${e.slug}`;
