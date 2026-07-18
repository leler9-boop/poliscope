/**
 * Items « Vrai ou faux ? » — fiche débat « L'immigration ».
 * Items NOUVEAUX référencés par la fiche (src/content/learn/debats/immigration.js,
 * champ vraiFaux). À importer dans la banque principale (vraifaux/bank.js) au câblage.
 *
 * verdict : 'vrai' | 'faux' | 'partiel' | 'trompeur' | 'sans-contexte'
 */

export default {

  'vf-immig-tous-etrangers': {
    categorie: 'immigration',
    enonce: { fr: `Tous les immigrés vivant en France sont des étrangers.` },
    verdict: 'faux',
    explication: {
      fr: `« Immigré » décrit un lieu de naissance (né étranger à l'étranger), « étranger » une nationalité. Entre un quart et un tiers des quelque 7 millions d'immigrés vivant en France ont acquis la nationalité française : ils sont immigrés ET français (INSEE, données 2022-2023). Inversement, environ 0,8 million d'étrangers sont nés en France — étrangers sans être immigrés. Un chiffre sur « les immigrés » et un chiffre sur « les étrangers » ne comptent donc pas les mêmes personnes : le mélange des deux mots est l'erreur la plus fréquente du débat, et elle change les ordres de grandeur du tout au tout.`,
    },
    sources: [{ label: `INSEE — Immigrés et étrangers en France, définitions et chiffres clés du recensement`, url: 'https://www.insee.fr', year: 2023 }],
    related: ['immigration'],
  },

  'vf-immig-rocard-misere': {
    categorie: 'immigration',
    enonce: { fr: `Michel Rocard a dit que « la France ne peut pas accueillir toute la misère du monde ».` },
    verdict: 'trompeur',
    explication: {
      fr: `Il a bien prononcé ces mots, en 1989-1990, sous plusieurs formulations — mais la phrase documentée continuait : « …mais elle doit en prendre fidèlement sa part ». Citée tronquée, elle sert d'argument d'autorité aux deux camps : la première moitié pour justifier la fermeté, l'oubli de la seconde pour dénoncer un reniement de la gauche. Rocard lui-même est revenu à plusieurs reprises sur l'usage fait de sa phrase, notamment dans une tribune du Monde en 1996, pour rappeler qu'elle appelait à la fois à la lucidité sur les capacités d'accueil et au devoir d'accueillir. Une citation amputée de sa moitié n'est pas une citation — c'est un slogan.`,
    },
    sources: [{ label: `Michel Rocard, déclarations 1989-1990 et tribune « La part de la France », Le Monde, 24 août 1996`, year: 1996 }],
    related: ['immigration'],
  },

  'vf-immig-droit-du-sol': {
    categorie: 'immigration',
    enonce: { fr: `Un enfant né en France de parents étrangers est automatiquement français à la naissance.` },
    verdict: 'faux',
    explication: {
      fr: `Le droit du sol français est « différé » : un enfant né en France de deux parents étrangers naît étranger, et devient français à sa majorité s'il réside en France et y a résidé au moins cinq ans depuis l'âge de 11 ans (il peut aussi réclamer la nationalité dès 13 ou 16 ans sous conditions). Les exceptions à la naissance existent mais sont précises : le « double droit du sol » (un parent lui-même né en France, ou né en Algérie avant l'indépendance de 1962) et le cas de l'enfant qui serait autrement apatride. La nationalité automatique à la naissance pour tous n'existe ni en France ni dans la quasi-totalité de l'Europe — c'est le modèle américain, pas le nôtre.`,
    },
    sources: [{ label: `Code civil, articles 19-3 et 21-7 et suivants ; Vie-publique.fr — fiche « droit du sol »`, url: 'https://www.vie-publique.fr', year: 2024 }],
    related: ['immigration'],
  },

  'vf-immig-cout-massif': {
    categorie: 'immigration',
    enonce: { fr: `L'impact économique de l'immigration est massivement négatif (ou massivement positif, selon le camp).` },
    verdict: 'trompeur',
    explication: {
      fr: `Les deux affirmations symétriques circulent, et aucune ne résiste aux méthodes standards. Les études de référence (OCDE, Perspectives des migrations internationales ; note du Conseil d'analyse économique, 2021) concluent le plus souvent à un impact budgétaire net FAIBLE — entre légèrement négatif et légèrement positif selon les hypothèses, de l'ordre de plus ou moins 0,5 point de PIB : les immigrés paient impôts et cotisations et reçoivent des prestations, et le solde dépend surtout de l'âge et du taux d'emploi. Les grands chiffres chocs des deux camps reposent sur des conventions non standards (imputer une part forfaitaire de toutes les dépenses publiques, ou ne compter que les recettes). Restent réellement débattus : les effets à long terme et la composition des flux — pas l'ordre de grandeur.`,
    },
    sources: [
      { label: `OCDE — Perspectives des migrations internationales, chapitres sur l'impact budgétaire`, url: 'https://www.oecd.org', year: 2021 },
      { label: `Conseil d'analyse économique — note « L'immigration en France » (Auriol, Rapoport)`, url: 'https://www.cae-eco.fr', year: 2021 },
    ],
    related: ['immigration'],
  },

  'vf-immig-france-accueille-plus': {
    categorie: 'immigration',
    enonce: { fr: `La France est le pays d'Europe qui accueille le plus d'immigrés.` },
    verdict: 'faux',
    explication: {
      fr: `Ni en proportion, ni en volume. En proportion, la part des immigrés en France (un peu plus de 10 % de la population, INSEE 2022-2023) est proche de la moyenne de l'Union européenne, derrière notamment l'Allemagne, l'Autriche ou la Suède — sans parler de cas particuliers comme le Luxembourg ou l'Irlande. En volume annuel, l'Allemagne accueille nettement plus, y compris pour l'asile, où elle reçoit depuis des années plus de demandes que la France (Eurostat). La France se distingue en revanche sur un point précis : elle est l'un des tout premiers pays de destination des demandes d'asile en Europe et le pays qui prononce le plus de décisions de retour. Être « dans la moyenne » n'est ni un argument pour ni contre une politique — mais c'est le point de départ factuel exact.`,
    },
    sources: [
      { label: `Eurostat — population née à l'étranger et demandes d'asile par État membre`, url: 'https://ec.europa.eu/eurostat', year: 2024, perimetre: `UE, définitions harmonisées, distinctes des statistiques nationales` },
      { label: `INSEE — Immigrés et descendants d'immigrés en France`, url: 'https://www.insee.fr', year: 2023 },
    ],
    related: ['immigration'],
  },

};
