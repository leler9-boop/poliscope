// POLISCOP — Rendu réel des 128 questions actives.
//
// La révision éditoriale d'août 2026 a réécrit 93 formulations, retiré 22 questions et en a
// créé 22. Une analyse statique du JSON ne dit rien de ce qui s'affiche vraiment : c'est
// `Questionnaire.jsx` qui choisit la source de l'explication, selon une priorité en cascade
// (QUESTION_EXPLANATIONS > questionHints > explanation). Une question créée dont l'explication
// ne remonterait pas jusqu'à la carte s'afficherait sans aucun contexte, sans qu'aucun test de
// données ne le voie.
//
// Ces tests RENDENT chaque question, avec exactement la même cascade que la page.

import { test, before } from 'node:test';
import assert from 'node:assert/strict';

let h, renderToStaticMarkup, QuestionCard, questions, rawById,
  questionHints, QUESTION_EXPLANATIONS, QUESTION_CONCEPTS;

before(async () => {
  ({ createElement: h } = await import('react'));
  ({ renderToStaticMarkup } = await import('react-dom/server'));
  QuestionCard = (await import('../../src/components/QuestionCard.jsx')).default;
  ({ questions } = await import('../../src/data/questions.js'));
  const raw = (await import('../../src/data/questions_final.json')).default;
  rawById = new Map(raw.map(q => [q.id, q]));
  ({ questionHints } = await import('../../src/data/questionHints.js'));
  ({ QUESTION_EXPLANATIONS } = await import('../../src/data/questionExplanations.js'));
  ({ QUESTION_CONCEPTS } = await import('../../src/data/conceptMap.js'));
});

/** Reproduit la cascade de Questionnaire.jsx. Si elle change là-bas, ce test doit suivre. */
function withInfo(question) {
  const explanation = rawById.get(question.id)?.explanation;
  if (QUESTION_EXPLANATIONS[question.id]) return { ...question, info: QUESTION_EXPLANATIONS[question.id] };
  if (questionHints[question.id]) return { ...question, info: questionHints[question.id] };
  if (explanation) return { ...question, info: explanation };
  return question;
}

function renderQuestion(question, language = 'fr') {
  return renderToStaticMarkup(h(QuestionCard, {
    question: withInfo(question),
    currentAnswer: null,
    onAnswer: () => {},
    onSkip: () => {},
    language,
    concepts: QUESTION_EXPLANATIONS[question.id] ? [] : (QUESTION_CONCEPTS[question.id] ?? []),
    onConceptClick: () => {},
  }));
}

const decode = s => s
  .replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"')
  .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');

test('les 128 questions actives se rendent sans erreur, en français comme en anglais', () => {
  for (const q of questions) {
    for (const language of ['fr', 'en']) {
      const html = renderQuestion(q, language);
      assert.ok(html.length > 200, `${q.id}/${language} : rendu vide ou tronqué`);
    }
  }
});

test('le texte de chaque question apparaît réellement dans la carte', () => {
  for (const q of questions) {
    const text = decode(renderQuestion(q));
    const expected = rawById.get(q.id).text;
    assert.ok(
      text.includes(expected),
      `${q.id} : la formulation ne s'affiche pas.\n  attendu : ${expected}`,
    );
  }
});

test('chaque question active atteint la carte avec une explication non vide', () => {
  // Le piège connu : questionHints ÉCRASE silencieusement `explanation`. Une entrée orpheline
  // ou une question créée sans explication produit une carte « Comprendre cet enjeu » vide.
  for (const q of questions) {
    const withInfoQ = withInfo(q);
    assert.ok(withInfoQ.info, `${q.id} : aucune explication ne remonte jusqu'à la carte`);
    const asText = typeof withInfoQ.info === 'string'
      ? withInfoQ.info
      : JSON.stringify(withInfoQ.info);
    assert.ok(asText.trim().length > 80, `${q.id} : explication trop courte pour être utile`);
  }
});

test('aucune formulation n’est assez longue pour casser la carte sur mobile', () => {
  // Le rendu est vérifié en SSR : impossible de mesurer des pixels ici. Le proxy retenu est
  // la longueur en CARACTÈRES, qui est ce qui déborde réellement sur un écran de 375 px.
  // Plafond calé sur la plus longue question conservée après révision, avec une marge.
  const MAX_CHARS = 110;
  const tooLong = questions
    .map(q => ({ id: q.id, text: rawById.get(q.id).text }))
    .filter(q => q.text.length > MAX_CHARS);
  assert.deepEqual(
    tooLong.map(q => `${q.id} (${q.text.length} car.)`),
    [],
    'formulations trop longues pour un écran étroit',
  );
});

test('la carte expose les libellés de réponse et le bouton « sans opinion »', () => {
  const html = renderQuestion(questions[0]);
  const text = decode(html);
  for (const label of ["Pas du tout d'accord", "Tout à fait d'accord"]) {
    assert.ok(text.includes(label), `libellé manquant : ${label}`);
  }
  assert.match(text, /opinion/i, 'option « sans opinion » absente de la carte');
});
