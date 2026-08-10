// POLISCOP — Le profil doit transmettre toute la banque au matching éditorial.
//
// Ce verrou est volontairement placé au niveau de la surface : le moteur et le corpus pouvaient
// gérer 128 questions tout en restant invisibles, parce que Profile.jsx lui passait uniquement
// les 16 CORE.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const profileSource = readFileSync(new URL('../../src/pages/Profile.jsx', import.meta.url), 'utf8');

test('la page Profil ne limite plus le matching candidat aux questions CORE', () => {
  assert.doesNotMatch(profileSource, /questions\s*:\s*coreQuestions/);
  assert.match(profileSource, /rankCandidatesForSurface\s*\(\s*\{[\s\S]*?questions,\s*\n\s*questionSet:\s*'general'/);
});
