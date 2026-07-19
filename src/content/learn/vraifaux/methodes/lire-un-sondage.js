/**
 * Items « Vrai ou faux ? » — fiche méthode « Comment lire un sondage ».
 * Uniquement les items NOUVEAUX référencés par la fiche.
 * NB : l'item vf-elections-sondages-predisent (fiche « Les élections ») couvre
 * déjà « les sondages prédisent le résultat » — ces trois énoncés sont distincts.
 *
 * verdict : 'vrai' | 'faux' | 'partiel' | 'trompeur' | 'sans-contexte'
 */

export default {

  'vf-sondage-2-points-avance': {
    categorie: 'methodes',
    enonce: { fr: `Un candidat donné à 22 % dans un sondage devance forcément un candidat donné à 20 %.` },
    verdict: 'faux',
    explication: {
      fr: `Chaque score d'un sondage porte une marge d'erreur — environ ±2 à 3 points pour un échantillon de 1 000 personnes. Le candidat « à 22 % » se situe donc, très probablement, quelque part entre 19,5 % et 24,5 % ; celui « à 20 % » entre 17,5 % et 22,5 %. Les deux fourchettes se recouvrent largement : l'enquête ne permet pas de dire qui est devant, seulement que les deux sont au coude-à-coude. Un écart n'est interprétable que s'il dépasse nettement la marge d'erreur, ou s'il se confirme d'enquête en enquête chez un même institut. Depuis 2016, la loi impose de publier ces marges avec chaque sondage : elles figurent dans la notice — beaucoup plus rarement dans les titres qui proclament qu'un candidat « passe devant ».`,
    },
    sources: [{ label: `Loi du 19 juillet 1977 modifiée en 2016 — publication obligatoire des marges d'erreur (Légifrance) ; Commission des sondages`, url: 'https://www.legifrance.gouv.fr', year: 2016 }],
    related: ['lire-un-sondage'],
  },

  'vf-sondage-se-trompent-toujours': {
    categorie: 'methodes',
    enonce: { fr: `Les sondages se trompent tout le temps : ils ne valent plus rien.` },
    verdict: 'trompeur',
    explication: {
      fr: `Les grands échecs sont réels et il faut s'en souvenir : en avril 2002, la plupart des enquêtes donnaient Lionel Jospin qualifié pour le second tour (résultat : Le Pen 16,86 %, Jospin 16,18 %) ; le Brexit et l'élection de Donald Trump en 2016 ont aussi surpris — dans ce dernier cas, les enquêtes nationales étaient proches du vote national, mais pas celles des États décisifs. Pour autant, « tout le temps » est faux : les travaux comparatifs internationaux (Jennings et Wlezien, 2018, sur plus de 30 000 sondages dans 45 pays) montrent une erreur moyenne stable depuis des décennies, autour de 2 à 3 points par candidat, et les présidentielles françaises de 2017 et 2022 ont été correctement estimées. La vraie leçon : un sondage est fiable à ±3 points près — ce qui suffit quand l'écart est large, et ne suffit jamais quand la qualification se joue à un point.`,
    },
    sources: [
      { label: `W. Jennings et C. Wlezien, « Election polling errors across time and space », Nature Human Behaviour`, year: 2018 },
      { label: `Conseil constitutionnel — résultats officiels du premier tour de la présidentielle 2002`, url: 'https://www.conseil-constitutionnel.fr', year: 2002 },
    ],
    related: ['lire-un-sondage'],
  },

  'vf-sondage-en-ligne-institut': {
    categorie: 'methodes',
    enonce: { fr: `Un sondage en ligne ouvert à tous, sur X (Twitter) ou un site, vaut un sondage d'institut.` },
    verdict: 'faux',
    explication: {
      fr: `Un vote ouvert où « chacun peut participer » n'est pas un sondage : l'échantillon s'auto-sélectionne. Ne répondent que les personnes qui voient la publication et sont assez motivées pour cliquer — souvent la communauté d'un compte, mobilisée pour l'occasion, parfois en votant plusieurs fois. Rien ne garantit que ce public ressemble au pays en âge, sexe, profession ou région, et aucun redressement n'est appliqué. Un tel vote mesure la mobilisation d'une communauté, pas l'opinion publique — même avec 500 000 réponses, car la taille ne remplace jamais la représentativité. Un institut, lui, construit un échantillon par quotas reproduisant la structure de la population, redresse les réponses, et publie sa méthode sous le contrôle de la Commission des sondages. Attention : les instituts sérieux interrogent aussi « en ligne » — la différence n'est pas le canal, c'est l'échantillonnage contrôlé.`,
    },
    sources: [{ label: `Commission des sondages — champ de la loi du 19 juillet 1977 et notices méthodologiques (méthode des quotas)`, url: 'https://www.commission-des-sondages.fr', year: 2024 }],
    related: ['lire-un-sondage'],
  },

};
