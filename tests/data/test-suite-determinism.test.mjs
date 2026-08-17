// POLISCOP — La suite doit TERMINER, et échouer vite quand elle ne le peut pas.
//
// DÉFAUT CORRIGÉ (P0-4, 2026-08-14)
// ---------------------------------
// Une contre-vérification indépendante n'a pas reproduit le « 654/654 » annoncé.
// `npm run verify` ne s'est pas terminé : après environ trois minutes, l'arrêt manuel a
// montré 605 tests découverts, 599 passés, 6 fichiers suspendus ou annulés, le message
// `Promise resolution is still pending but the event loop has already resolved`, et un build
// jamais atteint.
//
// Deux causes structurelles, corrigées ensemble :
//
//   1. DES PROMESSES FLOTTANTES. Chaque décision de consentement lançait son propre
//      `import('../lib/attemptSession.js')`, que personne n'attendait. Quand la boucle
//      d'événements se vide avant la résolution, Node émet ce message et ANNULE le fichier.
//      L'import est désormais mémoïsé, et toutes les actions de consentement rendent une
//      promesse que l'appelant attend.
//
//   2. AUCUN GARDE-FOU RÉSEAU. Rien n'empêchait un test d'atteindre le réseau. Une requête
//      sans délai d'expiration suspend la suite au lieu de la faire échouer.
//
// Ces tests verrouillent les deux parades. Ils ne remplacent pas l'exécution réelle de
// `npm run verify` — ils empêchent la régression silencieuse qui l'a rendue non terminante.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('../..', import.meta.url)).replace(/\/$/, '');
const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));

// ─── Le réseau est fermé, et il échoue VITE ─────────────────────────────────

test('tout appel réseau depuis un test lève immédiatement', () => {
  assert.throws(() => globalThis.fetch('https://exemple.invalid/ingest'), /Appel réseau interdit/);
});

test('le refus nomme le remède, pas seulement l’interdiction', () => {
  try {
    globalThis.fetch('https://exemple.invalid/ingest');
    assert.fail('fetch aurait dû lever');
  } catch (e) {
    assert.match(e.message, /consentTransport/, 'le message doit dire quoi injecter');
    assert.match(e.message, /exemple\.invalid/, 'et quelle cible a été tentée');
  }
});

test('le garde-fou réseau est chargé par le point d’entrée de TOUS les tests', () => {
  const loader = readFileSync(join(ROOT, 'tests/helpers/register-loader.mjs'), 'utf8');
  assert.match(loader, /no-network\.mjs/,
    'sans cela, seul le fichier qui l’importe serait protégé');
});

// ─── Un blocage échoue au lieu de suspendre ─────────────────────────────────

test('chaque script de test impose un délai maximal — un blocage ÉCHOUE, il ne pend pas', () => {
  // ⚠ CE N'EST PAS « augmenter le délai maximal ». Par défaut, `node --test` n'en a AUCUN :
  // un test bloqué reste bloqué indéfiniment, et c'est exactement ce qui est arrivé. Poser
  // une borne transforme une suspension silencieuse en échec daté et localisé.
  const scripts = Object.entries(pkg.scripts).filter(([nom]) => /^test(:|$)/.test(nom));
  assert.ok(scripts.length >= 5, 'les scripts de test doivent être trouvés');
  for (const [nom, cmd] of scripts) {
    if (!cmd.includes('--test')) continue;      // test:migrations est un script shell
    assert.match(cmd, /--test-timeout=\d+/, `${nom} n’impose aucun délai maximal`);
  }
});

// ─── Un fichier suivi qui se lit VIDE fait échouer vite, avec la cause ──────

test('aucun fichier suivi ne se lit à zéro octet', () => {
  // ⚠ CAUSE RÉELLE, CONSTATÉE LE 2026-08-14. Trois migrations suivies par git se lisaient à
  // zéro octet depuis Node — `ls` annonçait leur taille, `git show HEAD:…` rendait leur
  // contenu complet, et un simple `cat` les rematérialisait. Le dépôt est dans un dossier
  // synchronisé dans le nuage, qui évince le contenu des fichiers.
  //
  // Sept tests ont échoué ainsi, sans rapport avec le code. Et un module applicatif lu vide
  // ne suspend pas seulement un test : il fait annuler le FICHIER entier avec
  // `Promise resolution is still pending…` — le symptôme même qui rendait `npm run verify`
  // non terminant. Ce test transforme une panne de poste en diagnostic explicite.
  // `docs/questions` EST inclus : deux tests de données y lisent des JSON, et c'est
  // précisément par là que la panne est repassée après le premier correctif.
  const dossiers = ['src', 'scripts', 'supabase/migrations', 'tests', 'docs/questions'];
  const vides = [];
  const parcourir = (dir) => {
    for (const nom of readdirSync(dir)) {
      const p = join(dir, nom);
      if (nom === 'node_modules' || nom.startsWith('.')) continue;
      if (statSync(p).isDirectory()) { parcourir(p); continue; }
      if (!/\.(mjs|js|jsx|sql|json|toml)$/.test(nom)) continue;
      if (statSync(p).size > 0 && readFileSync(p, 'utf8').length === 0) {
        vides.push(p.replace(`${ROOT}/`, ''));
      }
    }
  };
  for (const d of dossiers) parcourir(join(ROOT, d));

  assert.deepEqual(vides, [],
    `${vides.length} fichier(s) suivi(s) se lisent vides alors que leur taille est non nulle : `
    + `${vides.join(', ')}. Contenu non matérialisé (synchronisation dans le nuage). `
    + 'Rematérialiser : `find src scripts supabase tests -type f -exec cat {} + > /dev/null`');
});

test('le chargeur de modules refuse un module vide au lieu de le laisser passer', () => {
  const loader = readFileSync(join(ROOT, 'tests/helpers/jsx-loader.mjs'), 'utf8');
  assert.match(loader, /source\.length === 0/,
    'un module vide n’exporte rien : le laisser passer produit une page blanche ou un import '
    + 'suspendu, jamais un message utile');
});

// ─── Aucune promesse flottante sur le chemin du consentement ────────────────

test('le store mémoïse son import dynamique au lieu d’en lancer un par décision', () => {
  const src = readFileSync(join(ROOT, 'src/store/useStore.js'), 'utf8');
  const code = src.split('\n').filter(l => !l.trim().startsWith('//') && !l.trim().startsWith('*')).join('\n');
  const imports = code.match(/import\('\.\.\/lib\/attemptSession\.js'\)/g) ?? [];
  assert.equal(imports.length, 1,
    `${imports.length} imports dynamiques de attemptSession : chacun est une promesse que `
    + 'personne n’attend, et une chance d’annuler un fichier de test');
  assert.match(code, /moduleSession \?\?= import\('\.\.\/lib\/attemptSession\.js'\)/);
});

test('les actions de consentement rendent une promesse attendable', () => {
  const src = readFileSync(join(ROOT, 'src/store/useStore.js'), 'utf8');
  assert.match(src, /return syncAttemptConsent\(/,
    'sans retour, l’interface ne peut qu’attendre « un peu » et espérer');
  assert.match(src, /export function consentSyncSettled/,
    'la synchronisation lancée par la réhydratation doit rester observable');
});
