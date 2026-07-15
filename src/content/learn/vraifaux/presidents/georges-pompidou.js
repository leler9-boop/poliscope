/**
 * Items « Vrai ou faux ? » — fiche président Georges Pompidou.
 * Uniquement les items NOUVEAUX référencés par la fiche
 * (src/content/learn/presidents/georges-pompidou.js).
 *
 * verdict : 'vrai' | 'faux' | 'partiel' | 'trompeur' | 'sans-contexte'
 */

export default {

  'vf-pompidou-continuateur': {
    categorie: 'presidents',
    enonce: { fr: `Pompidou n'a été qu'un continuateur sans relief de de Gaulle.` },
    verdict: 'trompeur',
    explication: {
      fr: `La continuité est réelle : mêmes institutions, même lecture présidentielle du régime, même famille politique — c'était d'ailleurs sa promesse de campagne (« le changement dans la continuité »). Mais les inflexions sont tout aussi réelles et assumées. Sur l'Europe, il lève dès décembre 1969, au sommet de La Haye, le veto que de Gaulle opposait à l'entrée du Royaume-Uni dans la CEE — l'adhésion devient effective en 1973, avec le Danemark et l'Irlande. Sur l'économie, il fait de l'« impératif industriel » la priorité du mandat : Airbus, Concorde, Fos-sur-Mer, autoroutes, préparation du nucléaire civil. Sur la société, son quinquennat voit naître le SMIC (1970), la mensualisation des salaires et le premier ministère de l'Environnement (1971) — même s'il a freiné la « Nouvelle société » de Chaban-Delmas. Réduire ce bilan à une simple gestion de l'héritage gaulliste ne correspond pas aux faits ; certains gaullistes orthodoxes lui reprochaient au contraire d'avoir trop infléchi la ligne du Général.`,
    },
    sources: [
      { label: `Vie-publique.fr — chronologies de la présidence Pompidou (1969-1974)`, year: 2025 },
      { label: `Éric Roussel, Georges Pompidou, JC Lattès (rééd. 2004)`, year: 2004 },
    ],
    related: ['georges-pompidou'],
  },

  'vf-pompidou-beaubourg': {
    categorie: 'presidents',
    enonce: { fr: `C'est Georges Pompidou qui a créé le Centre Pompidou.` },
    verdict: 'partiel',
    explication: {
      fr: `Il est bien à l'origine du projet : grand amateur d'art contemporain, il décide en 1969 la création d'un grand centre consacré à l'art moderne et à la lecture publique sur le plateau Beaubourg, à Paris, et suit personnellement le concours d'architecture remporté par Renzo Piano et Richard Rogers. Mais il n'a jamais vu le bâtiment achevé : le centre ouvre en janvier 1977, près de trois ans après sa mort en fonction (2 avril 1974), et c'est à ce moment-là qu'il est nommé « Centre national d'art et de culture Georges-Pompidou » en son honneur. Dire qu'il l'a « créé » est donc vrai pour la décision politique, faux si l'on imagine qu'il a inauguré ou dirigé l'institution qui porte son nom.`,
    },
    sources: [
      { label: `Centre Pompidou — histoire de l'institution (ouverture le 31 janvier 1977)`, year: 1977 },
      { label: `Vie-publique.fr — la présidence Pompidou et la politique culturelle`, year: 2025 },
    ],
    related: ['georges-pompidou'],
  },

  'vf-pompidou-loi-1973': {
    categorie: 'presidents',
    enonce: { fr: `La loi de 1973 sur la Banque de France a interdit à l'État d'emprunter gratuitement et est à l'origine de la dette publique.` },
    verdict: 'trompeur',
    explication: {
      fr: `Ce récit, très répandu sous le nom de « loi Pompidou-Giscard-Rothschild », prête à la loi du 3 janvier 1973 un rôle qu'elle n'a pas eu. Cette loi modernise les statuts de la Banque de France ; son article 25 encadre les avances directes au Trésor, mais celles-ci restaient possibles dans des conditions fixées par convention — et l'État empruntait déjà largement sur les marchés avant 1973. Surtout, la chronologie contredit la thèse : la dette publique française reste modérée pendant les années 1970 et n'explose qu'à partir des déficits budgétaires répétés d'après 1974, dans le contexte des chocs pétroliers, puis des décennies suivantes. Les historiens de l'économie qui ont examiné ce récit le jugent largement infondé : c'est l'accumulation des déficits, pas un texte de 1973, qui a créé la dette. L'interdiction stricte du financement monétaire des États viendra d'ailleurs plus tard, avec le traité de Maastricht (1992).`,
    },
    sources: [
      { label: `Légifrance — loi n° 73-7 du 3 janvier 1973 sur la Banque de France`, year: 1973 },
      { label: `INSEE — séries longues de dette publique et de déficits, années 1970-1990`, year: 1995 },
    ],
    related: ['georges-pompidou'],
  },

};
