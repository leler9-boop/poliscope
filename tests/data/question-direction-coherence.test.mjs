// POLISCOP — Cohérence des directions entre la banque générale et les banques d'élection.
//
// CE QUE CE TEST AURAIT ATTRAPÉ
// -----------------------------
// Les questions d'élection alimentent le MÊME score thématique que la banque générale, via
// `deriveCandidateThemes()` et via le blend du profil électoral. Leur `direction` doit donc
// suivre la même convention. Trois questions de `fr_2027` faisaient l'inverse :
//
//   fr_2027_q3  investir dans le nucléaire        dir -1   ENV_2  construire des réacteurs   dir +1
//   fr_2027_q4  renforcer le rôle dans l'UE       dir -1   GLO_8  plus d'intégration UE      dir +1
//   fr_2027_q9  soutenir militairement l'Ukraine  dir -1   GLO_25 envoyer des armes          dir +1
//
// Conséquence : la même position politique faisait MONTER le score d'un thème depuis la
// banque générale et le faisait BAISSER depuis la banque d'élection. Un candidat pro-nucléaire
// et pro-européen ressortait écologiste et souverainiste — ou l'inverse — selon la surface.
//
// Conventions documentées de la banque générale (src/data/questions.js) :
//   ENVIRONMENT haut = pro-climat, et le nucléaire y compte comme faiblement émetteur
//                      (voir le commentaire de ENV_24) ;
//   GLOBAL      haut = pro-mondialisation et pro-UE.

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { DIRECTION_MAP, THEMES_ORDER } from '../../src/data/questions.js';
import { elections } from '../../src/data/elections.js';

/**
 * Couples de questions mesurant LA MÊME orientation politique de part et d'autre.
 * Établis à la main : aucune heuristique ne reconnaît « investir dans le nucléaire » et
 * « construire de nouveaux réacteurs » comme la même position.
 */
const EQUIVALENCES = [
  { election: 'fr_2027_q2',  general: 'IMM_1',  sujet: 'réduire l’immigration' },
  { election: 'fr_2027_q3',  general: 'ENV_2',  sujet: 'développer le nucléaire' },
  { election: 'fr_2027_q4',  general: 'GLO_8',  sujet: 'renforcer l’intégration européenne' },
  { election: 'fr_2027_q5',  general: 'PUB_25', sujet: 'augmenter les moyens des hôpitaux' },
  { election: 'fr_2027_q9',  general: 'GLO_25', sujet: 'soutenir militairement l’Ukraine' },
  { election: 'fr_2027_q15', general: 'DEM_32', sujet: 'référendum d’initiative citoyenne' },
];

const electionQuestions = new Map(
  elections.flatMap(e => (e.specificQuestions ?? []).map(q => [q.id, { ...q, electionId: e.id }])),
);

test('une même position politique pousse le score dans le même sens dans les deux banques', () => {
  const contradictions = [];
  for (const { election, general, sujet } of EQUIVALENCES) {
    const eq = electionQuestions.get(election);
    const gd = DIRECTION_MAP[general];
    assert.ok(eq, `question d’élection inconnue : ${election}`);
    assert.ok(gd != null, `question générale inconnue : ${general}`);
    if (eq.direction !== gd) {
      contradictions.push(
        `${sujet} — ${election} (dir ${eq.direction}) contredit ${general} (dir ${gd})`,
      );
    }
  }
  assert.deepEqual(contradictions, [], `\n${contradictions.join('\n')}\n`);
});

test('une question d’élection porte un thème et une direction exploitables', () => {
  for (const [id, q] of electionQuestions) {
    assert.ok(THEMES_ORDER.includes(q.theme), `${id} : thème « ${q.theme} » hors référentiel`);
    assert.ok([1, -1].includes(q.direction), `${id} : direction ${q.direction} invalide`);
  }
});

test('les équivalences déclarées portent bien sur le même thème', () => {
  // Une équivalence entre deux questions de thèmes différents ne prouverait rien :
  // ce test empêche d'« aligner » deux directions sans rapport pour faire taire le premier.
  for (const { election, general, sujet } of EQUIVALENCES) {
    const eq = electionQuestions.get(election);
    const themeOfGeneral = { IMM_1: 'IMMIGRATION', ENV_2: 'ENVIRONMENT', GLO_8: 'GLOBAL',
      PUB_25: 'PUBLIC_SERVICES', GLO_25: 'GLOBAL', DEM_32: 'DEMOCRACY' }[general];
    assert.equal(eq.theme, themeOfGeneral, `${sujet} : thèmes différents, équivalence douteuse`);
  }
});
