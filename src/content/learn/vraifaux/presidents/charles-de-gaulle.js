/**
 * Items « Vrai ou faux ? » — fiche président Charles de Gaulle.
 * Uniquement les items NOUVEAUX référencés par la fiche (vf-degaulle-classique
 * vit déjà dans la banque principale, src/content/learn/vraifaux/bank.js).
 *
 * verdict : 'vrai' | 'faux' | 'partiel' | 'trompeur' | 'sans-contexte'
 */

export default {

  'vf-degaulle-elu-1958': {
    categorie: 'presidents',
    enonce: { fr: `De Gaulle a été élu président en 1958 au suffrage universel direct.` },
    verdict: 'faux',
    explication: {
      fr: `En décembre 1958, le président de la République est élu par un collège élargi d'environ 80 000 élus (parlementaires, conseillers généraux, représentants des communes) : de Gaulle l'emporte avec 78,5 % des voix. L'élection au suffrage universel direct n'est instaurée que par le référendum du 28 octobre 1962 (62 % de oui), contre l'avis de la plupart des partis. De Gaulle n'est élu directement par les Français qu'en décembre 1965 — au second tour face à François Mitterrand (55,2 %), après avoir été mis en ballottage au premier.`,
    },
    sources: [{ label: `Conseil constitutionnel — résultats des scrutins de 1958, 1962 et 1965`, url: 'https://www.conseil-constitutionnel.fr', year: 1965 }],
    related: ['charles-de-gaulle'],
  },

  'vf-degaulle-mai68': {
    categorie: 'presidents',
    enonce: { fr: `Mai 68 a chassé de Gaulle du pouvoir.` },
    verdict: 'trompeur',
    explication: {
      fr: `C'est l'inverse à court terme : après la crise de mai-juin 1968, de Gaulle dissout l'Assemblée et remporte aux législatives de juin l'une des plus larges victoires de l'histoire de la Ve République. Il ne part que dix mois plus tard, le 28 avril 1969, après avoir perdu un référendum sur la régionalisation et la réforme du Sénat (52,4 % de non) — un scrutin qu'il avait lui-même transformé en question de confiance. Mai 68 a certainement affaibli son autorité et pesé sur ce résultat, mais dire que la crise l'a « chassé » confond deux événements distincts, séparés par une victoire électorale écrasante.`,
    },
    sources: [{ label: `Conseil constitutionnel — législatives de juin 1968 et référendum du 27 avril 1969`, url: 'https://www.conseil-constitutionnel.fr', year: 1969 }],
    related: ['charles-de-gaulle'],
  },

  'vf-degaulle-algerie-intentions': {
    categorie: 'presidents',
    enonce: { fr: `De Gaulle est revenu au pouvoir en 1958 avec l'intention de donner l'indépendance à l'Algérie.` },
    verdict: 'sans-contexte',
    explication: {
      fr: `Ses intentions initiales sont l'un des grands débats de l'historiographie gaullienne, et lui-même a entretenu l'ambiguïté : le « Je vous ai compris » lancé à Alger le 4 juin 1958 pouvait s'entendre dans des sens opposés, et les historiens divergent sur le moment où l'indépendance est devenue pour lui l'issue inévitable. Ce qui est établi, c'est la trajectoire : autodétermination proposée en septembre 1959, négociations, accords d'Évian (18 mars 1962, approuvés par référendum à 90,8 %), indépendance en juillet 1962. Affirmer qu'il avait tout prévu dès 1958 — ou au contraire qu'il a « trahi » une promesse ferme d'Algérie française — dépasse ce que les sources permettent de dire.`,
    },
    sources: [{ label: `Julian Jackson, De Gaulle, Seuil, 2019 — chapitres sur la guerre d'Algérie et le débat historiographique`, year: 2019 }],
    related: ['charles-de-gaulle'],
  },

};
