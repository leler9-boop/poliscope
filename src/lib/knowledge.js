/**
 * Score de connaissance politique — gamification 100 % locale (store persisté,
 * aucune donnée envoyée nulle part : c'est de l'engagement, pas de l'opinion).
 *
 * Le score est CALCULÉ à partir des données brutes (idempotent) :
 *   - quiz : bonne réponse du premier coup 10 pts, tentative 2 pts
 *   - vrai/faux (carte du hub) : bonne intuition 5 pts, tentative 1 pt
 *   - fiches lues : N1 atteint 2 pts, N2 5 pts, N3+ 10 pts (par fiche, niveau max)
 *   - parcours terminé : 25 pts
 */

export const NIVEAUX = [
  { n: 1, min: 0, icon: '🌱', nom: { fr: 'Novice' }, phrase: { fr: `Tout le monde commence quelque part — et vous avez commencé.` } },
  { n: 2, min: 50, icon: '🔍', nom: { fr: 'Curieux' }, phrase: { fr: `Vous posez les bonnes questions.` } },
  { n: 3, min: 150, icon: '💡', nom: { fr: 'Citoyen éclairé' }, phrase: { fr: `Les mots du débat n'ont plus de secret pour vous.` } },
  { n: 4, min: 300, icon: '📚', nom: { fr: 'Connaisseur' }, phrase: { fr: `Vous distinguez les faits, les opinions et les slogans.` } },
  { n: 5, min: 500, icon: '🎓', nom: { fr: 'Expert du débat' }, phrase: { fr: `Vous pourriez animer le débat vous-même.` } },
  { n: 6, min: 800, icon: '🏛️', nom: { fr: 'Maître Poliscop' }, phrase: { fr: `Le niveau maximal. Chapeau bas.` } },
];

export const POINTS = { quizCorrect: 10, quizTried: 2, vfCorrect: 5, vfTried: 1, ficheN1: 2, ficheN2: 5, ficheN3: 10, parcours: 25 };

/** knowledge = { quiz: {qid: bool}, vf: {id: bool}, fiches: {slug: maxLevel} } ; parcoursDone = { slug: [stepKeys] } */
export function computeScore(knowledge = {}, parcoursDone = {}, parcoursList = []) {
  const quiz = knowledge.quiz || {};
  const vf = knowledge.vf || {};
  const fiches = knowledge.fiches || {};

  let points = 0;
  const quizCorrect = Object.values(quiz).filter(Boolean).length;
  const quizTotal = Object.keys(quiz).length;
  points += quizCorrect * POINTS.quizCorrect + (quizTotal - quizCorrect) * POINTS.quizTried;

  const vfCorrect = Object.values(vf).filter(Boolean).length;
  const vfTotal = Object.keys(vf).length;
  points += vfCorrect * POINTS.vfCorrect + (vfTotal - vfCorrect) * POINTS.vfTried;

  let fichesLues = 0;
  for (const lvl of Object.values(fiches)) {
    fichesLues++;
    points += lvl >= 3 ? POINTS.ficheN3 : lvl >= 2 ? POINTS.ficheN2 : POINTS.ficheN1;
  }

  let parcoursTermines = 0;
  for (const p of parcoursList) {
    const done = parcoursDone[p.slug] || [];
    if (p.etapes.every(e => done.includes(`${e.section}/${e.slug}`))) {
      parcoursTermines++;
      points += POINTS.parcours;
    }
  }

  let niveau = NIVEAUX[0];
  for (const lv of NIVEAUX) if (points >= lv.min) niveau = lv;
  const suivant = NIVEAUX.find(lv => lv.min > points) || null;
  const progression = suivant
    ? Math.round(((points - niveau.min) / (suivant.min - niveau.min)) * 100)
    : 100;

  return {
    points,
    niveau,
    suivant,
    progression,
    stats: { quizCorrect, quizTotal, vfCorrect, vfTotal, fichesLues, parcoursTermines },
  };
}
