import test from 'node:test';
import assert from 'node:assert/strict';

import {
  CANDIDATE_REGISTRY,
  CANDIDACY_STATUS,
  PROFILE_SOURCE,
  getTrackedCandidates,
  getTrackedNotMatchReady,
} from '../../src/data/candidateRegistry.js';
import { getSource, SOURCE_LEVEL } from '../../src/data/candidateProvenance.js';

const tracked2027 = CANDIDATE_REGISTRY.filter(person => person.trackedFor?.includes('fr_2027'));

test('les 16 candidatures officialisées par LCP au 10 juillet sont présentes et déclarées ou investies', () => {
  const expected = [
    'edouard-philippe', 'gabriel-attal', 'bruno-retailleau', 'david-lisnard',
    'xavier-bertrand', 'marine-le-pen', 'jean-luc-melenchon', 'delphine-batho',
    'jerome-guedj', 'karim-bouamrane', 'nathalie-arthaud', 'nicolas-dupont-aignan',
    'florian-philippot', 'francois-asselineau', 'clara-egger', 'antoine-mikolajczak',
  ];

  const declaredStatuses = new Set([CANDIDACY_STATUS.DECLARED, CANDIDACY_STATUS.INVESTED]);
  for (const id of expected) {
    const person = tracked2027.find(candidate => candidate.id === id);
    assert.ok(person, `${id} manque au registre 2027`);
    assert.ok(declaredStatuses.has(person.status), `${id} a le statut incohérent « ${person.status} »`);
  }
});

test('le registre compte 17 candidatures déclarées ou investies après l’annonce de Bernard Cazeneuve', () => {
  const confirmedStatuses = new Set([
    CANDIDACY_STATUS.OFFICIALLY_VALIDATED,
    CANDIDACY_STATUS.INVESTED,
    CANDIDACY_STATUS.DECLARED,
  ]);
  const confirmed = tracked2027.filter(person => confirmedStatuses.has(person.status));
  assert.equal(confirmed.length, 17);
  assert.ok(confirmed.some(person => person.id === 'bernard-cazeneuve'));
});

test('l’annuaire distingue explicitement les principaux cas non déclarés', () => {
  const expectedStatuses = {
    'raphael-glucksmann': CANDIDACY_STATUS.POTENTIAL,
    'fabien-roussel': CANDIDACY_STATUS.CONDITIONAL,
    'marine-tondelier': CANDIDACY_STATUS.CONDITIONAL,
    'francois-ruffin': CANDIDACY_STATUS.CONDITIONAL,
    'jordan-bardella': CANDIDACY_STATUS.CONTINGENCY,
    'benjamin-lucas': CANDIDACY_STATUS.WITHDRAWN,
    'sarah-knafo': CANDIDACY_STATUS.WITHDRAWN,
  };

  for (const [id, status] of Object.entries(expectedStatuses)) {
    assert.equal(
      tracked2027.find(candidate => candidate.id === id)?.status,
      status,
      `${id} ne doit pas être présenté comme candidat déclaré`,
    );
  }
});

test('chaque personne suivie pour 2027 porte une date, une source vérifiée et une maturité de programme', () => {
  for (const person of tracked2027) {
    assert.match(person.statusDate ?? '', /^\d{4}-\d{2}-\d{2}$/, `${person.id}: statusDate absente`);
    assert.match(person.programMaturity ?? '', /^M[0-5]$/, `${person.id}: maturité programme absente`);
    assert.ok(person.statusSource, `${person.id}: explication de statut absente`);
    assert.ok(person.statusSourceIds?.length, `${person.id}: source structurée absente`);

    for (const sourceId of person.statusSourceIds) {
      const source = getSource(sourceId);
      assert.ok(source, `${person.id}: source inconnue ${sourceId}`);
      assert.ok(source.verifiedAt, `${person.id}: source non vérifiée ${sourceId}`);
    }
  }
});

test('aucun profil 2027 manuel ou absent ne se déclare comparable', () => {
  const falsePromises = tracked2027.filter(person =>
    person.matchReady === true && person.profileSource !== PROFILE_SOURCE.SOURCED_POSITIONS
  );
  assert.deepEqual(falsePromises, []);
});

test('tout programme 2027 annoncé comme partiel ou complet renvoie à une source officielle', () => {
  for (const person of tracked2027.filter(candidate => ['M3', 'M4', 'M5'].includes(candidate.programMaturity))) {
    assert.ok(person.programSourceIds?.length, `${person.id}: programme ${person.programMaturity} sans document`);
    const sources = person.programSourceIds.map(getSource);
    assert.ok(sources.every(Boolean), `${person.id}: référence programmatique inconnue`);
    assert.ok(
      sources.some(source => source.level === SOURCE_LEVEL.PRIMARY_OFFICIAL),
      `${person.id}: programme ${person.programMaturity} sans source primaire officielle`,
    );
  }
});

test('les annonces directes de Le Pen et Mélenchon ne reposent plus sur une source programmatique ou un sondage', () => {
  const lePen = tracked2027.find(candidate => candidate.id === 'marine-le-pen');
  const melenchon = tracked2027.find(candidate => candidate.id === 'jean-luc-melenchon');

  assert.ok(lePen.statusSourceIds.includes('src-lcp-lepen-declaration-2026-07-07'));
  assert.ok(melenchon.statusSourceIds.includes('src-lcp-melenchon-declaration-2026-05-03'));
});

test('l’annuaire visible ne ramasse que les personnes rattachées à fr_2027 et reste non comparable', () => {
  const directory = getTrackedNotMatchReady('fr_2027');
  assert.ok(directory.length >= 25, 'l’annuaire 2027 doit couvrir au-delà des dix fiches historiques');
  assert.ok(directory.every(person => person.trackedFor?.includes('fr_2027')));
  assert.ok(directory.every(person => person.profileSource === PROFILE_SOURCE.NONE));
});

test('l’annuaire public complet expose aussi les dix profils historiques du test', () => {
  const directory = getTrackedCandidates('fr_2027');
  assert.equal(directory.length, tracked2027.length);
  assert.ok(directory.length >= 35, 'le public doit voir le registre complet, pas seulement dix cartes');
  assert.ok(directory.some(person => person.id === 'fabien-roussel'));
  assert.ok(directory.some(person => person.id === 'david-lisnard'));
  assert.ok(directory.some(person => person.id === 'jordan-bardella'));
});
