// POLISCOP — Moteur de scoring : caractérisation du v1 et invariants du v2.
//
// Les tests « v1 » figent le comportement historique AVANT toute refonte. Ils servent de
// filet de sécurité, pas de justification : le fait que le v1 fasse quelque chose n'est pas
// un argument pour que le v2 le reproduise (thème vide = 50, étirement 0,75…).

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { calculateProfile, calculateProfileV2, recalculateAxes, NO_OPINION, isScorable } from '../../src/engine/scorer.js';
import { questions, THEMES_ORDER } from '../../src/data/questions.js';

const byTheme = theme => questions.filter(q => q.theme === theme);
const answerAll = value => Object.fromEntries(questions.map(q => [q.id, value]));

// ─── v1 — caractérisation ────────────────────────────────────────────────────

test('v1 : toutes réponses neutres → tous les thèmes à 50', () => {
  const p = calculateProfile(answerAll(3));
  for (const t of THEMES_ORDER) assert.equal(p.themes[t], 50, `${t} devrait valoir 50`);
});

test('v1 : scores toujours finis et bornés 0–100 (aucun NaN)', () => {
  for (const v of [1, 2, 3, 4, 5]) {
    const p = calculateProfile(answerAll(v));
    for (const t of THEMES_ORDER) {
      assert.ok(Number.isFinite(p.themes[t]), `${t} non fini pour réponse ${v}`);
      assert.ok(p.themes[t] >= 0 && p.themes[t] <= 100, `${t} hors bornes pour réponse ${v}`);
    }
    for (const [k, val] of Object.entries(p.axes)) {
      assert.ok(Number.isFinite(val) && val >= 0 && val <= 100, `axe ${k} invalide`);
    }
  }
});

test('v1 : l’ordre d’insertion des réponses ne change pas le résultat', () => {
  const entries = questions.slice(0, 40).map((q, i) => [q.id, (i % 5) + 1]);
  const forward = Object.fromEntries(entries);
  const backward = Object.fromEntries([...entries].reverse());
  assert.deepEqual(calculateProfile(forward).themes, calculateProfile(backward).themes);
});

test('v1 : déterminisme — deux appels identiques donnent le même profil', () => {
  const a = Object.fromEntries(questions.slice(0, 30).map((q, i) => [q.id, (i % 5) + 1]));
  assert.deepEqual(calculateProfile(a), calculateProfile(a));
});

test('v1 : un thème sans réponse vaut 50 (comportement historique conservé)', () => {
  // Ce test documente un défaut assumé du v1 : « inconnu » y est indiscernable de « centriste ».
  // Le v2 le corrige (test plus bas). Ne pas « réparer » le v1 : d'anciens résultats en dépendent.
  const answers = {};
  byTheme('ECONOMY').forEach(q => { answers[q.id] = 5; });
  const p = calculateProfile(answers);
  assert.equal(p.themes.SOCIAL, 50);
});

test('v1 : monotonie — répondre dans le sens de la question fait monter le thème', () => {
  for (const theme of THEMES_ORDER) {
    const qs = byTheme(theme).filter(q => q.direction === 1);
    if (qs.length === 0) continue;
    const low  = calculateProfile(Object.fromEntries(qs.map(q => [q.id, 1])));
    const high = calculateProfile(Object.fromEntries(qs.map(q => [q.id, 5])));
    assert.ok(high.themes[theme] > low.themes[theme], `${theme} : non monotone`);
  }
});

// ─── « Sans opinion » ────────────────────────────────────────────────────────

test('NO_OPINION n’est pas une réponse exploitable', () => {
  assert.equal(isScorable(NO_OPINION), false);
  assert.equal(isScorable(3), true);
  assert.equal(isScorable(0), false);
  assert.equal(isScorable(6), false);
  assert.equal(isScorable(null), false);
  assert.equal(isScorable('3'), false);
});

test('« sans opinion » ≠ réponse neutre : il ne produit pas un score de 50', () => {
  const eco = byTheme('ECONOMY');
  const neutre     = calculateProfile(Object.fromEntries(eco.map(q => [q.id, 3])));
  const sansOpinion = calculateProfileV2(Object.fromEntries(eco.map(q => [q.id, NO_OPINION])));

  assert.equal(neutre.themes.ECONOMY, 50, 'la réponse neutre reste une position centrale');
  assert.equal(sansOpinion.themes.ECONOMY, null, '« sans opinion » doit rester indéterminé');
});

test('« sans opinion » ne gonfle pas le nombre de réponses comptabilisées', () => {
  const eco = byTheme('ECONOMY');
  const p = calculateProfile(Object.fromEntries(eco.map(q => [q.id, NO_OPINION])));
  assert.equal(p.answeredCount, 0);
});

// ─── v2 — invariants ─────────────────────────────────────────────────────────

test('v2 : un thème sans réponse exploitable vaut null, jamais 50', () => {
  const answers = {};
  byTheme('ECONOMY').forEach(q => { answers[q.id] = 5; });
  const p = calculateProfileV2(answers);
  assert.notEqual(p.themes.ECONOMY, null);
  for (const t of THEMES_ORDER.filter(t => t !== 'ECONOMY')) {
    assert.equal(p.themes[t], null, `${t} devrait être indéterminé`);
  }
});

test('v2 : la couverture est comptée séparément du score', () => {
  const answers = {};
  byTheme('ECONOMY').slice(0, 3).forEach(q => { answers[q.id] = 4; });
  byTheme('SOCIAL').slice(0, 2).forEach(q => { answers[q.id] = NO_OPINION; });
  const p = calculateProfileV2(answers);

  assert.equal(p.coverage.themesKnown, 1);
  assert.equal(p.coverage.themesTotal, 8);
  assert.equal(p.coverage.answeredCount, 3);
  assert.equal(p.coverage.noOpinionCount, 2);
  assert.equal(p.coverage.perTheme.SOCIAL.noOpinion, 2);
  assert.equal(p.coverage.perTheme.SOCIAL.answered, 0);
});

test('v2 : la couverture distingue « non posée », « sans opinion » et « répondue »', () => {
  const eco = byTheme('ECONOMY');
  const queue = eco.slice(0, 5).map(q => q.id);           // 5 posées sur 16 en banque
  const answers = {
    [eco[0].id]: 4, [eco[1].id]: 2,                        // 2 répondues
    [eco[2].id]: NO_OPINION,                               // 1 sans opinion
    // eco[3] et eco[4] posées mais laissées vides
  };

  const p = calculateProfileV2(answers, { askedQuestionIds: queue });
  const ecoCov = p.coverage.perTheme.ECONOMY;
  assert.equal(ecoCov.inQueue, 5, 'questions réellement posées');
  assert.equal(ecoCov.inBank, 16, 'taille de la banque — plafond, pas couverture');
  assert.equal(ecoCov.answered, 2);
  assert.equal(ecoCov.noOpinion, 1);
  assert.equal(ecoCov.unanswered, 2);
  assert.equal(p.coverage.askedCount, 5);
  assert.equal(p.coverage.basedOnQueue, true);

  // Thème jamais servi : rien n'a été posé, ce n'est pas « 16 questions ratées ».
  assert.equal(p.coverage.perTheme.SOCIAL.inQueue, 0);
  assert.equal(p.coverage.perTheme.SOCIAL.unanswered, 0);
});

test('v2 : sans file fournie, la couverture le déclare au lieu d’inventer un dénominateur', () => {
  const eco = byTheme('ECONOMY');
  const p = calculateProfileV2({ [eco[0].id]: 4 });
  assert.equal(p.coverage.basedOnQueue, false);
  assert.equal(p.coverage.askedCount, null);
  assert.equal(p.coverage.perTheme.ECONOMY.inQueue, null);
  assert.equal(p.coverage.perTheme.ECONOMY.unanswered, null);
  assert.equal(p.coverage.perTheme.ECONOMY.inBank, 16, 'la taille de banque reste connue');
});

test('v2 : aucune incertitude numérique n’est inventée', () => {
  assert.equal(calculateProfileV2(answerAll(4)).uncertainty, null);
});

test('v2 : pas d’étirement — un score reste la moyenne pondérée brute', () => {
  const eco = byTheme('ECONOMY').filter(q => q.direction === 1);
  if (eco.length === 0) return;
  const v1 = calculateProfile(Object.fromEntries(eco.map(q => [q.id, 5])));
  const v2 = calculateProfileV2(Object.fromEntries(eco.map(q => [q.id, 5])));
  // Aux extrêmes l'étirement change peu ; on vérifie sur une valeur intermédiaire.
  const mid1 = calculateProfile(Object.fromEntries(eco.map(q => [q.id, 4])));
  const mid2 = calculateProfileV2(Object.fromEntries(eco.map(q => [q.id, 4])));
  assert.ok(mid1.themes.ECONOMY > mid2.themes.ECONOMY,
    'le v1 doit produire un score plus éloigné du centre que le v2');
  assert.ok(Number.isFinite(v1.themes.ECONOMY) && Number.isFinite(v2.themes.ECONOMY));
});

test('v2 : un axe dont un composant est inconnu vaut null', () => {
  const answers = {};
  byTheme('ECONOMY').forEach(q => { answers[q.id] = 4; });
  const p = calculateProfileV2(answers);
  assert.equal(p.axes.economic, null, 'PUBLIC_SERVICES inconnu → axe économique indéterminé');
  assert.equal(p.axes.social, null);
});

test('les axes se recalculent après modification des thèmes (bug ajustement manuel)', () => {
  const base = calculateProfile(answerAll(3));
  const ajuste = { ...base.themes, ECONOMY: 90, PUBLIC_SERVICES: 10 };
  const axes = recalculateAxes(ajuste);
  assert.notDeepEqual(axes, base.axes, 'les axes doivent suivre les thèmes ajustés');
  assert.equal(axes.economic, 90, '0.5×90 + 0.5×(100−10) = 90');
});

test('tout profil v1 embarque ses versions de calcul', () => {
  const p = calculateProfile(answerAll(3));
  assert.equal(p.versions.scoring, 'v1');
  assert.ok(p.versions.questionnaire);
  assert.ok(p.versions.matching);
});
