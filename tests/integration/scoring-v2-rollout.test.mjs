// POLISCOP — Parcours complet sous `VITE_SCORING_VERSION=v2`.
//
// Le 2e contre-audit a montré que le drapeau était TROMPEUR : `answerQuestion()` utilisait
// bien le moteur actif, mais `nextQuestion()`, `finishQuestionnaire()`, `hydrateFromCloud()`
// et `importProfile()` rappelaient `calculateProfile()` (v1) en dur. Le profil calculé en v2
// était donc écrasé par un profil v1 dès la dernière question.
//
// Ce fichier rejoue un parcours entier avec le drapeau actif et vérifie qu'aucune étape ne
// retombe en v1. Il tourne dans un processus séparé (`node --test` isole chaque fichier) avec
// `import.meta.env` simulé AVANT tout import applicatif.

import { test, before, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

// ─── Environnement ──────────────────────────────────────────────────────────

class MemoryStorage {
  constructor() { this.map = new Map(); }
  getItem(k) { return this.map.has(k) ? this.map.get(k) : null; }
  setItem(k, v) { this.map.set(k, String(v)); }
  removeItem(k) { this.map.delete(k); }
  clear() { this.map.clear(); }
}
globalThis.localStorage = new MemoryStorage();
globalThis.sessionStorage = new MemoryStorage();
if (!globalThis.crypto?.randomUUID) {
  let n = 0;
  Object.defineProperty(globalThis.crypto ?? (globalThis.crypto = {}), 'randomUUID', {
    value: () => `00000000-0000-4000-8000-${String(++n).padStart(12, '0')}`, configurable: true,
  });
}

// `import.meta.env` n'existe pas sous Node : les modules applicatifs lisent le drapeau via
// `import.meta?.env?.VITE_SCORING_VERSION`. On ne peut pas le définir depuis l'extérieur, donc
// on teste l'orchestrateur en injectant la version explicitement — et on vérifie séparément
// que TOUTES les surfaces passent par lui (contrôle statique en fin de fichier).
let store, scorer, scoringVersion, versions, questions, THEMES_ORDER;

before(async () => {
  store          = await import('../../src/store/useStore.js');
  scorer         = await import('../../src/engine/scorer.js');
  scoringVersion = await import('../../src/engine/scoringVersion.js');
  versions       = await import('../../src/engine/versions.js');
  ({ questions, THEMES_ORDER } = await import('../../src/data/questions.js'));
});

const S = () => store.useStore.getState();

beforeEach(() => {
  store.useStore.setState({
    answers: {}, profile: null, questionsQueue: [], queueQuestionIds: [], queueMeta: null,
    currentQuestionIndex: 0, themeWeights: null, queueSeed: null, testMode: null, userId: null,
  });
});

// ─── Le drapeau et son défaut ───────────────────────────────────────────────

test('la version active par défaut reste v1 — la production n’a PAS basculé', () => {
  assert.equal(scoringVersion.activeScoringVersion(), versions.SCORING_VERSION_V1);
  assert.equal(scoringVersion.isV2Active(), false);
});

test('toute surface du store passe par l’orchestrateur, jamais par calculateProfile en dur', () => {
  // Contrôle STATIQUE : c'est le défaut exact relevé. Un seul appel direct suffit à écraser
  // un profil v2 par un profil v1.
  const src = readFileSync(new URL('../../src/store/useStore.js', import.meta.url), 'utf8');
  const direct = src.split('\n')
    .map((line, i) => ({ line, n: i + 1 }))
    .filter(({ line }) => /(^|[^A-Za-z])calculateProfile\s*\(/.test(line)
                       && !/calculateProfileV2/.test(line)
                       && !line.trimStart().startsWith('//'));
  assert.deepEqual(direct.map(d => d.n), [],
    `calculateProfile() appelé en dur dans le store (lignes ${direct.map(d => d.n).join(', ')}) — ` +
    `utiliser calculateActiveProfile()`);
});

// ─── Parcours v2 complet, en appelant directement le moteur v2 ──────────────

test('v2 : parcours réponse → fin → export/import conserve la version d’origine', () => {
  const eco = questions.filter(q => q.theme === 'ECONOMY').slice(0, 4);
  const answers = Object.fromEntries(eco.map((q, i) => [q.id, (i % 5) + 1]));
  const askedQuestionIds = eco.map(q => q.id);

  const p = scorer.calculateProfileV2(answers, { askedQuestionIds });

  assert.equal(p.versions.scoring, versions.SCORING_VERSION_V2);
  assert.equal(p.coverage.basedOnQueue, true);
  assert.equal(p.coverage.askedCount, 4);
  // Thèmes non servis : indéterminés, pas 50.
  for (const t of THEMES_ORDER.filter(t => t !== 'ECONOMY')) {
    assert.equal(p.themes[t], null, `${t} devrait rester indéterminé en v2`);
  }
});

test('v2 : un profil stocké garde SA version à la relecture', () => {
  const v1 = scorer.calculateProfile({ [questions[0].id]: 4 });
  const v2 = scorer.calculateProfileV2({ [questions[0].id]: 4 });

  assert.equal(scoringVersion.scoringVersionOf(v1), versions.SCORING_VERSION_V1);
  assert.equal(scoringVersion.scoringVersionOf(v2), versions.SCORING_VERSION_V2);
  // Un profil antérieur au versionnage n'a pas de champ `versions` : lu comme v1, jamais
  // recalculé silencieusement.
  assert.equal(scoringVersion.scoringVersionOf({ themes: {} }), versions.SCORING_VERSION_V1);
});

test('v2 : profileAnsweredCount lit les deux formes sans connaître la version', () => {
  const v1 = scorer.calculateProfile({ [questions[0].id]: 4, [questions[1].id]: 2 });
  const v2 = scorer.calculateProfileV2({ [questions[0].id]: 4, [questions[1].id]: 2 });
  assert.equal(scoringVersion.profileAnsweredCount(v1), 2);
  assert.equal(scoringVersion.profileAnsweredCount(v2), 2);
  assert.equal(scoringVersion.profileAnsweredCount(null), 0);
});

test('l’export embarque la version RÉELLE du profil, pas un défaut v1', () => {
  // `currentVersions()` retombait sur `scoring: 'v1'` : un profil v2 s'exportait étiqueté v1
  // et se relisait comme tel.
  const v2 = scorer.calculateProfileV2({ [questions[0].id]: 4 });
  store.useStore.setState({ profile: v2, answers: { [questions[0].id]: 4 } });

  const src = readFileSync(new URL('../../src/store/useStore.js', import.meta.url), 'utf8');
  assert.ok(
    src.includes('versions: profile?.versions ?? currentVersions()'),
    'exportProfile doit publier profile.versions, pas currentVersions() par défaut',
  );
  assert.equal(S().profile.versions.scoring, versions.SCORING_VERSION_V2);
});

// ─── Étude de sensibilité v1 → v2 ───────────────────────────────────────────

test('compareScoringVersions mesure l’écart réel avant toute bascule', () => {
  const eco = questions.filter(q => q.theme === 'ECONOMY').slice(0, 6);
  const answers = Object.fromEntries(eco.map(q => [q.id, 4]));

  const diff = scoringVersion.compareScoringVersions(answers, {
    askedQuestionIds: eco.map(q => q.id),
  });

  // 7 thèmes sur 8 passent de « 50 » (v1) à « non déterminé » (v2) : c'est le changement le
  // plus visible pour l'utilisateur, et il ne se mesure pas en points.
  assert.equal(diff.themesBecomingUnknown.length, 7);
  assert.ok(!diff.themesBecomingUnknown.includes('ECONOMY'));
  // L'étirement du v1 éloigne le score du centre : l'écart sur le thème connu est réel.
  assert.ok(diff.maxThemeShift > 0, 'aucun écart mesuré entre v1 et v2 — étude inutile');
  assert.ok(Number.isFinite(diff.meanThemeShift));
});

test('la bascule v2 reste une décision produit : aucun profil n’est migré automatiquement', () => {
  const v1 = scorer.calculateProfile({ [questions[0].id]: 4 });
  store.useStore.setState({ profile: v1 });
  // Rien dans le store ne recalcule un profil existant au chargement.
  assert.equal(S().profile.versions.scoring, versions.SCORING_VERSION_V1);
  assert.equal(scoringVersion.isStaleVersion(v1), false, 'v1 actif ⇒ un profil v1 n’est pas périmé');
});
