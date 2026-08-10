// POLISCOP — Mesure du temps par question.
//
// L'horloge est INJECTÉE : chaque test avance le temps explicitement. Sans cela, prouver
// « le compteur se met en pause quand l'onglet est caché » supposerait d'attendre
// réellement, et le test serait à la fois lent et instable.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createQuestionTimer, STRICT_MODE_GRACE_MS, MAX_ACTIVE_DWELL_MS }
  from '../../src/lib/questionTiming.js';

/** Horloge monotone contrôlée à la milliseconde. */
function fakeClock(start = 1000) {
  let value = start;
  return {
    now: () => value,
    advance: (ms) => { value += ms; },
    set: (ms) => { value = ms; },
  };
}

const newTimer = (clock) => createQuestionTimer({
  now: clock.now,
  wallClock: () => new Date(1_800_000_000_000 + clock.now()).toISOString(),
});

test('le temps actif s’accumule pendant que la question est visible', () => {
  const clock = fakeClock();
  const timer = newTimer(clock);

  timer.show('ECO_1', { sequenceIndex: 0 });
  clock.advance(3000);
  timer.recordAnswer('ECO_1', 'answered', 4);

  assert.equal(timer.snapshot('ECO_1').active_dwell_ms, 3000);
});

test('le compteur se met en PAUSE quand l’onglet est caché, et reprend ensuite', () => {
  const clock = fakeClock();
  const timer = newTimer(clock);

  timer.show('ECO_1');
  clock.advance(2000);          // 2 s visibles

  timer.block('hidden');
  clock.advance(600000);        // 10 minutes onglet caché — ne doivent PAS compter
  timer.unblock('hidden');

  clock.advance(1000);          // 1 s de nouveau visible
  timer.recordAnswer('ECO_1', 'answered', 3);

  assert.equal(timer.snapshot('ECO_1').active_dwell_ms, 3000,
    'le temps passé onglet caché a été compté');
});

test('une modale couvrante suspend le compteur au même titre que l’onglet caché', () => {
  const clock = fakeClock();
  const timer = newTimer(clock);

  timer.show('SOC_1');
  clock.advance(1000);
  timer.block('modal:concept');
  clock.advance(45000);          // lecture d'une fiche de concept
  timer.unblock('modal:concept');
  clock.advance(500);
  timer.recordAnswer('SOC_1', 'answered', 2);

  assert.equal(timer.snapshot('SOC_1').active_dwell_ms, 1500);
});

test('deux causes de masquage simultanées : le compteur ne repart qu’à la dernière levée', () => {
  const clock = fakeClock();
  const timer = newTimer(clock);

  timer.show('SEC_1');
  clock.advance(1000);

  timer.block('hidden');
  timer.block('modal:report');
  clock.advance(10000);

  timer.unblock('modal:report');   // l'onglet est TOUJOURS caché
  clock.advance(10000);
  timer.unblock('hidden');

  clock.advance(500);
  timer.recordAnswer('SEC_1', 'answered', 5);

  assert.equal(timer.snapshot('SEC_1').active_dwell_ms, 1500,
    'fermer une modale a relancé le compteur alors que l’onglet était caché');
});

test('retour à une question précédente : les temps se CUMULENT', () => {
  const clock = fakeClock();
  const timer = newTimer(clock);

  timer.show('ECO_1', { sequenceIndex: 0 });
  clock.advance(4000);
  timer.recordAnswer('ECO_1', 'answered', 4);
  timer.hide();

  timer.show('SOC_1', { sequenceIndex: 1 });
  clock.advance(2000);
  timer.hide();

  // Retour en arrière sur ECO_1, bien au-delà de la fenêtre Strict Mode.
  clock.advance(STRICT_MODE_GRACE_MS + 1);
  timer.show('ECO_1', { sequenceIndex: 0 });
  clock.advance(3000);
  timer.recordAnswer('ECO_1', 'answered', 2);

  const snapshot = timer.snapshot('ECO_1');
  assert.equal(snapshot.active_dwell_ms, 7000, 'cumul incorrect au retour arrière');
  assert.equal(snapshot.presentation_count, 2, 'deux présentations attendues');
  assert.equal(snapshot.change_count, 1, 'un changement d’avis attendu');
  assert.equal(snapshot.answer_value, 2, 'la dernière réponse doit gagner');
});

test('React Strict Mode : un remontage immédiat ne double PAS le compteur de présentations', () => {
  const clock = fakeClock();
  const timer = newTimer(clock);

  // Séquence exacte produite par Strict Mode en développement : effet, nettoyage, effet.
  timer.show('ECO_1', { sequenceIndex: 0 });
  clock.advance(5);
  timer.hide();
  clock.advance(5);
  timer.show('ECO_1', { sequenceIndex: 0 });

  clock.advance(1000);
  timer.recordAnswer('ECO_1', 'answered', 3);

  assert.equal(timer.snapshot('ECO_1').presentation_count, 1,
    'le double montage de Strict Mode a été compté comme deux présentations');
});

test('la première réponse n’est pas un changement d’avis', () => {
  const clock = fakeClock();
  const timer = newTimer(clock);

  timer.show('IMM_1');
  clock.advance(1000);
  timer.recordAnswer('IMM_1', 'answered', 1);

  assert.equal(timer.snapshot('IMM_1').change_count, 0);
});

test('« sans opinion » est un état, jamais une valeur numérique', () => {
  const clock = fakeClock();
  const timer = newTimer(clock);

  timer.show('DEM_1');
  clock.advance(2000);
  timer.recordAnswer('DEM_1', 'answered', 4);
  timer.recordAnswer('DEM_1', 'no_opinion', null);

  const snapshot = timer.snapshot('DEM_1');
  assert.equal(snapshot.response_state, 'no_opinion');
  assert.equal(snapshot.answer_value, null,
    '« sans opinion » a été encodé par un nombre — c’est fabriquer une position');
  assert.equal(snapshot.change_count, 1);
});

test('aucune durée négative, même si l’horloge recule', () => {
  const clock = fakeClock();
  const timer = newTimer(clock);

  timer.show('ECO_1');
  clock.advance(3000);
  timer.block('hidden');          // solde 3000

  clock.set(0);                   // horloge resynchronisée en arrière (NTP, veille)
  timer.unblock('hidden');
  clock.advance(1000);
  timer.recordAnswer('ECO_1', 'answered', 3);

  const value = timer.snapshot('ECO_1').active_dwell_ms;
  assert.ok(value >= 3000, `durée amputée par un recul d’horloge : ${value}`);
  assert.ok(value >= 0, 'durée négative produite');
});

test('les valeurs aberrantes sont plafonnées côté client', () => {
  const clock = fakeClock();
  const timer = newTimer(clock);

  timer.show('ECO_1');
  clock.advance(MAX_ACTIVE_DWELL_MS * 5);   // onglet resté ouvert
  timer.recordAnswer('ECO_1', 'answered', 3);

  assert.equal(timer.snapshot('ECO_1').active_dwell_ms, MAX_ACTIVE_DWELL_MS);
});

test('l’instantané inclut l’intervalle EN COURS sans le solder deux fois', () => {
  const clock = fakeClock();
  const timer = newTimer(clock);

  timer.show('ECO_1');
  clock.advance(2000);

  // Deux lectures successives sans changement d'état : la seconde ne doit pas doubler.
  assert.equal(timer.snapshot('ECO_1').active_dwell_ms, 2000);
  assert.equal(timer.snapshot('ECO_1').active_dwell_ms, 2000);

  clock.advance(1000);
  assert.equal(timer.snapshot('ECO_1').active_dwell_ms, 3000);
});

test('temps ACTIF et temps TOTAL sont distincts et tous deux conservés', () => {
  const clock = fakeClock();
  const timer = newTimer(clock);

  timer.show('ECO_1');
  clock.advance(1000);
  timer.block('hidden');
  clock.advance(60000);          // une minute d'absence
  timer.unblock('hidden');
  clock.advance(500);
  timer.recordAnswer('ECO_1', 'answered', 4);

  const snapshot = timer.snapshot('ECO_1');
  assert.equal(snapshot.active_dwell_ms, 1500);
  assert.equal(snapshot.total_elapsed_ms, 61500,
    'le temps total doit refléter l’écart réel entre première vue et réponse');
});

test('une question jamais montrée ne produit aucun instantané', () => {
  const timer = newTimer(fakeClock());
  assert.equal(timer.snapshot('JAMAIS_VUE_1'), null);
  assert.deepEqual(timer.snapshotAll(), []);
});
