/**
 * Items « Vrai ou faux ? » — dossier « Le centre ».
 * Uniquement les items NOUVEAUX référencés par la fiche (aucun ne préexiste
 * dans la banque principale, src/content/learn/vraifaux/bank.js).
 *
 * verdict : 'vrai' | 'faux' | 'partiel' | 'trompeur' | 'sans-contexte'
 */

export default {

  'vf-centre-sans-opinion': {
    categorie: 'familles',
    enonce: { fr: `Être centriste, c'est ne pas avoir d'opinion.` },
    verdict: 'faux',
    explication: {
      fr: `Le centre français dispose d'un corpus doctrinal réel et documenté, nourri par trois traditions : la démocratie chrétienne (dignité de la personne, corps intermédiaires, Europe — le MRP de Robert Schuman après-guerre), le radicalisme (laïcité, école publique, classes moyennes — le Parti radical, fondé en juin 1901, est le plus ancien parti français encore existant) et le libéralisme social. On y retrouve des positions constantes sur un siècle : l'intégration européenne (de la déclaration Schuman de 1950 au oui massif à Maastricht en 1992), la décentralisation, le scrutin proportionnel, une économie de marché corrigée par la solidarité. On peut juger ces positions bonnes ou mauvaises — mais dire qu'elles n'existent pas est factuellement faux.`,
    },
    sources: [
      { label: `Sylvie Guillaume, Le Centrisme en France aux XIXe et XXe siècles : un échec ?, MSHA, 2005`, year: 2005 },
      { label: `Vie-publique.fr — fiches « partis politiques » et « construction européenne »`, url: 'https://www.vie-publique.fr', year: 2025 },
    ],
    related: ['centre'],
  },

  'vf-centre-toujours-droite': {
    categorie: 'familles',
    enonce: { fr: `Le centre finit toujours par s'allier à la droite.` },
    verdict: 'partiel',
    explication: {
      fr: `C'est le cas le plus fréquent sous la Ve République : Centre démocrate, CDS, UDF, Nouveau Centre puis UDI ont gouverné avec la droite — en grande partie parce que le scrutin majoritaire à deux tours force à choisir un bloc avant l'élection pour exister au Parlement. Mais « toujours » est excessif : les radicaux de gauche sont alliés à la gauche depuis 1972 et ont participé à ses gouvernements ; lors de l'« ouverture » de 1988, des ministres venus du centre sont entrés dans les gouvernements de Michel Rocard ; et François Bayrou, après avoir refusé tout ralliement à droite en 2007, a annoncé voter François Hollande au second tour de 2012. La formule exacte : une inclination structurelle vers la droite, largement fabriquée par le mode de scrutin, avec des contre-exemples réels.`,
    },
    sources: [
      { label: `Vie-publique.fr — fiches sur les partis politiques et les gouvernements de la Ve République`, url: 'https://www.vie-publique.fr', year: 2025 },
      { label: `Sylvie Guillaume, Le Centrisme en France aux XIXe et XXe siècles : un échec ?, MSHA, 2005`, year: 2005 },
    ],
    related: ['centre'],
  },

  'vf-centre-presidentielle': {
    categorie: 'familles',
    enonce: { fr: `Un centriste peut gagner une élection présidentielle.` },
    verdict: 'sans-contexte',
    explication: {
      fr: `Impossible de répondre sans préciser de qui l'on parle. Fait établi : aucun candidat purement centriste, autonome des deux grands blocs, n'a jamais gagné — ni même atteint le second tour — sous la Ve République. Les meilleurs scores restent 15,57 % pour Jean Lecanuet en 1965 et 18,57 % pour François Bayrou en 2007 (troisième position), résultats officiels du Conseil constitutionnel. Reste le cas d'Emmanuel Macron, élu en 2017 sur un positionnement « et de droite et de gauche » avec le soutien du MoDem : si on le classe au centre, un centriste a gagné ; mais ce classement est précisément débattu par les politistes, dont plusieurs situent son bloc au centre-droit, surtout depuis 2022. La réponse dépend donc entièrement de la définition retenue du mot « centriste ».`,
    },
    sources: [
      { label: `Conseil constitutionnel — résultats officiels des élections présidentielles de 1965, 2007 et 2017`, url: 'https://www.conseil-constitutionnel.fr', year: 2017 },
    ],
    related: ['centre'],
  },

};
