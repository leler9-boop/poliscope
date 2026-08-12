// POLISCOP — Le profil doit transmettre toute la banque au matching éditorial.
//
// Ce verrou est volontairement placé au niveau de la surface : le moteur et le corpus pouvaient
// gérer 128 questions tout en restant invisibles, parce que Profile.jsx lui passait uniquement
// les 16 CORE.
//
// ⚠ MÉCANISME MIS À JOUR. Ce test cherchait l'univers complet DANS l'appel
// `rankCandidatesForSurface(...)`. Cet appel a disparu : la page en faisait un second, avec
// ses propres arguments, ce qui produisait un troisième verdict pouvant désigner une autre
// personne que la liste affichée. Le classement passe désormais par `rankBothWays()` seul.
//
// L'INTENTION est inchangée et reste vérifiée — aucune surface ne doit restreindre la
// comparaison aux CORE. Seul l'appel observé change.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const profileSource = readFileSync(new URL('../../src/pages/Profile.jsx', import.meta.url), 'utf8');

test('la page Profil ne limite plus le matching candidat aux questions CORE', () => {
  assert.doesNotMatch(profileSource, /questions\s*:\s*coreQuestions/);
  assert.doesNotMatch(profileSource, /\bcoreQuestions\b/,
    'la page ne doit même plus importer la banque restreinte');
});

test('le classement candidat passe par le point d’entrée unique, avec la banque complète', () => {
  // On cherche `questions,` — la banque complète — et non `questions: coreQuestions`.
  assert.match(profileSource, /rankBothWays\s*\(\s*\{[\s\S]{0,400}?\bquestions\b\s*,/,
    'la banque générale complète doit être transmise au moteur');
  assert.match(profileSource, /questionSet:\s*'general'/);
});

test('la page ne recalcule pas un second classement en parallèle', () => {
  // Deux appels, deux résultats, aucune garantie qu'ils désignent la même personne.
  // Seules les INVOCATIONS comptent : l'import et les mentions en commentaire n'ouvrent
  // pas d'objet d'arguments.
  const appels = (profileSource.match(/rankBothWays\s*\(\s*\{/g) ?? []).length;
  assert.equal(appels, 1, `le classement est calculé ${appels} fois : une seule est correcte`);
});
