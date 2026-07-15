/**
 * Items « Vrai ou faux ? » — fiche président Valéry Giscard d'Estaing.
 * Uniquement les items NOUVEAUX référencés par la fiche.
 *
 * verdict : 'vrai' | 'faux' | 'partiel' | 'trompeur' | 'sans-contexte'
 */

export default {

  'vf-vge-ivg-createur': {
    categorie: 'presidents',
    enonce: { fr: `C'est Giscard d'Estaing qui a créé le droit à l'IVG en France.` },
    verdict: 'partiel',
    explication: {
      fr: `La loi de 1975 a bien été adoptée sous sa présidence, avec son soutien : il en avait fait un engagement et a chargé sa ministre de la Santé de la défendre. Mais c'est Simone Veil qui a porté le texte, dans des débats d'une rare violence, devant une Assemblée largement hostile — et la loi n'a été adoptée en décembre 1974 que grâce aux voix de la gauche, une partie de la majorité de droite votant contre. Attribuer la loi au seul président efface à la fois le rôle central de Simone Veil et le fait que son propre camp était divisé. On peut dire que Giscard a permis la loi ; on ne peut pas dire qu'il l'a « créée » à lui seul.`,
    },
    sources: [{ label: `Légifrance — loi n° 75-17 du 17 janvier 1975 ; Assemblée nationale — débats de novembre-décembre 1974`, url: 'https://www.legifrance.gouv.fr', year: 1975 }],
    related: ['valery-giscard-destaing'],
  },

  'vf-vge-droite-reformes-societe': {
    categorie: 'presidents',
    enonce: { fr: `La droite française n'a jamais fait de réformes de société.` },
    verdict: 'faux',
    explication: {
      fr: `Les années 1974-1975 sont le contre-exemple central : en dix-huit mois, sous un président de droite, la France adopte la majorité à 18 ans (juillet 1974), la dépénalisation de l'IVG (loi Veil, janvier 1975) et le divorce par consentement mutuel (juillet 1975) — trois réformes de société majeures, toutes encore en vigueur. Nuance honnête : ces textes ont divisé la droite elle-même (la loi Veil n'est passée que grâce aux voix de la gauche), et Giscard venait de la droite libérale, pas de sa composante conservatrice. Mais l'affirmation générale est fausse : des réformes de société importantes ont bien été engagées et promulguées par un exécutif de droite.`,
    },
    sources: [{ label: `Légifrance — lois du 5 juillet 1974, du 17 janvier 1975 et du 11 juillet 1975`, url: 'https://www.legifrance.gouv.fr', year: 1975 }],
    related: ['valery-giscard-destaing'],
  },

  'vf-vge-diamants-defaite': {
    categorie: 'presidents',
    enonce: { fr: `Giscard a perdu en 1981 à cause de l'affaire des diamants.` },
    verdict: 'trompeur',
    explication: {
      fr: `L'affaire des diamants de Bokassa, révélée par le Canard enchaîné en octobre 1979 et mal gérée pendant des mois, a incontestablement abîmé son image. Mais en faire la cause unique de la défaite de 1981 efface les autres facteurs, au moins aussi lourds : un chômage passé à environ 1,5 million de demandeurs d'emploi, une inflation à deux chiffres après le second choc pétrolier, l'usure de sept ans de crise, et la division de la droite — Jacques Chirac, candidat contre lui au premier tour (18 %), refuse de le soutenir clairement au second. Mitterrand l'emporte avec 51,76 % : une défaite aux causes multiples, pas le résultat d'un seul scandale.`,
    },
    sources: [{ label: `Conseil constitutionnel — résultats de l'élection présidentielle de 1981 ; INSEE — séries chômage et inflation 1979-1981`, url: 'https://www.conseil-constitutionnel.fr', year: 1981 }],
    related: ['valery-giscard-destaing'],
  },

};
