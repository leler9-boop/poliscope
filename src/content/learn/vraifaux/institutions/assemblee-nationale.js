/**
 * Items « Vrai ou faux ? » — fiche institution L'Assemblée nationale.
 * Uniquement les items NOUVEAUX référencés par la fiche (champ vraiFaux).
 *
 * verdict : 'vrai' | 'faux' | 'partiel' | 'trompeur' | 'sans-contexte'
 */

export default {

  'vf-an-senat-inutile': {
    categorie: 'institutions',
    enonce: { fr: `Le Sénat ne sert à rien.` },
    verdict: 'trompeur',
    explication: {
      fr: `Le débat sur le rôle du Sénat est ancien et légitime — de Gaulle a lui-même tenté de le réformer par référendum en 1969, et perdu. Mais « ne sert à rien » ignore ce qu'il fait concrètement : chaque loi passe par lui (la navette), et ses amendements, souvent techniques, améliorent la qualité juridique des textes — une part importante en est conservée dans les lois finales. Il représente aussi les collectivités territoriales, et 60 sénateurs peuvent saisir le Conseil constitutionnel. Sa vraie limite est ailleurs : en cas de désaccord persistant, le gouvernement peut donner le dernier mot à l'Assemblée nationale (article 45), sauf pour les révisions constitutionnelles et les lois organiques relatives au Sénat. Une chambre de réflexion et de freinage, donc — pas une chambre décorative.`,
    },
    sources: [{ label: `Constitution, articles 24 et 45 ; Vie-publique.fr — « le bicamérisme » et « à quoi sert le Sénat ? »`, url: 'https://www.vie-publique.fr', year: 2024 }],
    related: ['assemblee-nationale'],
  },

  'vf-an-godillots': {
    categorie: 'institutions',
    enonce: { fr: `Les députés votent les yeux fermés ce qu'on leur dit.` },
    verdict: 'trompeur',
    explication: {
      fr: `La discipline de groupe existe réellement : les positions de vote sont arrêtées collectivement, et un député qui s'en écarte trop s'expose à des sanctions internes (jusqu'à l'exclusion du groupe). Mais l'image du « godillot » écrase le reste : les députés déposent des milliers d'amendements par an, dont beaucoup sont adoptés et modifient réellement les textes ; les « frondes » internes sont documentées sous toutes les majorités (quinquennat Hollande, réformes des retraites…) ; et depuis 2022, l'absence de majorité absolue oblige à construire les votes texte par texte. La discipline est d'ailleurs politique, pas juridique : la Constitution fait du vote un droit personnel du député. Ni parlement de marionnettes, ni assemblée d'électrons libres.`,
    },
    sources: [{ label: `Constitution, article 27 ; données ouvertes de l'Assemblée nationale — amendements et scrutins publics`, url: 'https://data.assemblee-nationale.fr', year: 2024 }],
    related: ['assemblee-nationale'],
  },

  'vf-an-renverser-president': {
    categorie: 'institutions',
    enonce: { fr: `L'Assemblée nationale peut renverser le président de la République.` },
    verdict: 'faux',
    explication: {
      fr: `La motion de censure renverse le gouvernement — le Premier ministre et ses ministres —, jamais le président, qui n'est pas responsable devant le Parlement. C'est arrivé deux fois : le 5 octobre 1962 (gouvernement Pompidou) et le 4 décembre 2024 (gouvernement Barnier, 331 voix). Dans les deux cas, le président est resté en fonction et a nommé la suite. La seule procédure qui peut écarter un président en cours de mandat est la destitution de l'article 68 : le Parlement réuni en Haute Cour, à la majorité des deux tiers, « en cas de manquement à ses devoirs manifestement incompatible avec l'exercice de son mandat » — jamais menée à terme à ce jour. Confondre les deux, c'est confondre les deux têtes de l'exécutif.`,
    },
    sources: [{ label: `Constitution, articles 49-50 et 68 ; Assemblée nationale — scrutins des 5 octobre 1962 et 4 décembre 2024`, url: 'https://www.assemblee-nationale.fr', year: 2024 }],
    related: ['assemblee-nationale'],
  },

  'vf-an-absenteisme': {
    categorie: 'institutions',
    enonce: { fr: `Un député absent de l'hémicycle ne travaille pas.` },
    verdict: 'trompeur',
    explication: {
      fr: `L'image de l'hémicycle aux trois quarts vide est réelle — mais elle est prise, le plus souvent, pendant l'examen technique de textes qui ne concernent directement qu'une partie des députés. L'essentiel du travail législatif se fait en commission, généralement le matin, où l'assiduité est d'ailleurs surveillée : des retenues financières s'appliquent aux absences répétées. S'y ajoutent les séances de nuit, les missions d'information et les jours en circonscription (permanences, terrain), invisibles à la télévision. Cela dit, tout n'est pas un malentendu : de vrais écarts d'assiduité entre députés existent et sont mesurables dans les données publiques de l'Assemblée. Le bon réflexe n'est pas de compter les sièges vides à l'image, mais de regarder l'activité complète d'un député — elle est publique.`,
    },
    sources: [{ label: `Règlement de l'Assemblée nationale (assiduité en commission) ; data.assemblee-nationale.fr — activité des députés`, url: 'https://data.assemblee-nationale.fr', year: 2024 }],
    related: ['assemblee-nationale'],
  },

};
