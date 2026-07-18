/**
 * Items « Vrai ou faux ? » — dossier « L'extrême droite ».
 * Uniquement les items NOUVEAUX référencés par la fiche.
 *
 * verdict : 'vrai' | 'faux' | 'partiel' | 'trompeur' | 'sans-contexte'
 */

export default {

  'vf-ed-fasciste': {
    categorie: 'familles',
    enonce: { fr: `L'extrême droite est fasciste.` },
    verdict: 'trompeur',
    explication: {
      fr: `Certains courants historiques de l'extrême droite française ont été liés au fascisme ou à la collaboration, et cette généalogie est documentée par les historiens. Mais toutes les formations actuelles classées à l'extrême droite ne se définissent pas ainsi, et le classement scientifique ne repose pas sur cette assimilation : il s'appuie sur des critères précis — conception identitaire de la nation (nativisme), autoritarisme, populisme, rapport aux contre-pouvoirs. Employer « fasciste » comme synonyme d'« extrême droite » brouille l'analyse dans les deux sens : cela banalise le fascisme historique et dispense d'examiner les programmes actuels sur pièces.`,
    },
    sources: [
      { label: `Cas Mudde, The Far Right Today, Polity, 2019`, year: 2019 },
      { label: `Jean-Yves Camus & Nicolas Lebourg, Les Droites extrêmes en Europe, Seuil, 2015`, year: 2015 },
    ],
    related: ['extreme-droite'],
  },

  'vf-ed-rn-classement': {
    categorie: 'familles',
    enonce: { fr: `Le RN est un parti d'extrême droite.` },
    verdict: 'vrai',
    explication: {
      fr: `C'est le classement très majoritaire de la science politique, fondé sur des critères documentés : conception identitaire de la nation, place de la « priorité nationale » dans le programme, désignation de l'immigration comme menace principale, histoire du mouvement (fondé en 1972 à l'initiative d'Ordre nouveau). Trois précisions honnêtes s'imposent. Le parti conteste constamment cette étiquette et se présente comme « ni de droite ni de gauche ». Certains chercheurs, dans la lignée de Cas Mudde, préfèrent le terme « droite radicale » pour les partis qui, comme le RN, acceptent le jeu électoral — par distinction avec une extrême droite antidémocratique au sens strict. Et le classement décrit le projet du parti, pas les motivations de ses électeurs, qui sont un objet d'étude distinct.`,
    },
    sources: [
      { label: `Cas Mudde, The Far Right Today, Polity, 2019`, year: 2019 },
      { label: `Valérie Igounet, Le Front national de 1972 à nos jours, Seuil, 2014`, year: 2014 },
    ],
    related: ['extreme-droite'],
  },

  'vf-ed-jamais-gouverne': {
    categorie: 'familles',
    enonce: { fr: `L'extrême droite n'a jamais gouverné en France.` },
    verdict: 'partiel',
    explication: {
      fr: `Vrai au niveau national sous la Ve République : aucun parti classé à l'extrême droite n'a exercé le pouvoir gouvernemental depuis 1958, ni participé à un gouvernement. Mais l'affirmation oublie deux réalités. D'une part, l'exercice local du pouvoir : le FN puis le RN dirigent des municipalités depuis 1995 (Toulon, Orange, Marignane, puis Vitrolles en 1997, et une nouvelle vague en 2014 dont Hénin-Beaumont) — un terrain que les chercheurs étudient précisément pour observer les pratiques du parti au pouvoir. D'autre part, le régime de Vichy (1940-1944), qui a mené une politique de collaboration et d'exclusion : il reste toutefois un cas distinct — un régime né de la défaite militaire, pas un parti arrivé au pouvoir par les urnes.`,
    },
    sources: [
      { label: `Valérie Igounet, Le Front national de 1972 à nos jours, Seuil, 2014`, year: 2014 },
      { label: `Vie-publique.fr — repères sur les élections municipales et la vie politique locale`, url: 'https://www.vie-publique.fr', year: 2025 },
    ],
    related: ['extreme-droite'],
  },

  'vf-ed-vote-raciste': {
    categorie: 'familles',
    enonce: { fr: `Voter RN, c'est être raciste.` },
    verdict: 'trompeur',
    explication: {
      fr: `La sociologie électorale, depuis les travaux fondateurs de Nonna Mayer, documente des motivations multiples chez les électeurs du FN puis du RN : la volonté de réduire l'immigration, mais aussi l'insécurité, le pouvoir d'achat, le sentiment de déclassement et la défiance envers les partis de gouvernement. Réduire des millions d'électeurs — environ 10 millions de voix pour le RN et ses alliés au premier tour des législatives de 2024 — à un mobile unique supposé, c'est essentialiser, ce que les enquêtes interdisent précisément de faire. L'inverse serait tout aussi inexact : les mêmes enquêtes (Cevipof, Ifop) montrent que le thème de l'immigration occupe une place centrale et croissante dans ce vote, avec une part d'adhésion au programme qui augmente. Juger un vote n'est pas décrire un électorat : la recherche fait le second, pas le premier.`,
    },
    sources: [
      { label: `Nonna Mayer, Ces Français qui votent Le Pen, Flammarion, 2002`, year: 2002 },
      { label: `Enquêtes électorales du Cevipof (vagues 2022 et 2024) — motivations du vote RN`, year: 2024 },
    ],
    related: ['extreme-droite'],
  },

};
