#!/usr/bin/env node
/**
 * POLISCOP — Génération du snapshot statique des positions candidats.
 *
 * INVERSION DE LA SOURCE DE VÉRITÉ
 * --------------------------------
 * Aujourd'hui, `src/data/elections.js` EST la source éditoriale : huit nombres saisis à la
 * main, sans preuve par position (`legacy-manual-v1`). Demain, Supabase l'est, et ce
 * fichier n'est plus qu'un ARTEFACT DE PUBLICATION :
 *
 *     Supabase (release publiée, immuable)  →  ce script  →  JSON versionné  →  bundle
 *
 * Ce que cela change concrètement :
 *   • le site continue de fonctionner si Supabase est indisponible (le JSON est dans le
 *     bundle) — la robustesse actuelle n'est pas sacrifiée ;
 *   • il n'y a plus DEUX endroits où corriger une position, donc plus de divergence
 *     possible entre la page Profil et la page Élection ;
 *   • le snapshot porte le numéro de release : un résultat de matching reste reproductible
 *     des mois plus tard, ce qui est la condition de toute défense méthodologique.
 *
 * ⚠ Le script LIT uniquement `public.published_candidate_positions` — une vue qui ne
 * contient que des positions `approved` appartenant à une release publiée. Un brouillon ne
 * peut donc pas se retrouver dans le bundle, même par erreur de manipulation.
 *
 * Usage :
 *   node scripts/build-candidate-snapshot.mjs            # écrit le snapshot
 *   node scripts/build-candidate-snapshot.mjs --check    # vérifie sans écrire (CI)
 *
 * Sans variables d'environnement Supabase, le script NE FAIT RIEN et sort en succès : le
 * build hors ligne doit rester possible, et le snapshot déjà commité fait foi.
 */

import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url)).replace(/\/$/, '');
const OUTPUT_DIR = join(ROOT, 'src/data/generated');
const OUTPUT_FILE = join(OUTPUT_DIR, 'candidate-positions.json');

const CHECK_ONLY = process.argv.includes('--check');

const SUPABASE_URL = process.env.VITE_SUPABASE_URL ?? process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY;

const log = (message) => process.stdout.write(`${message}\n`);

/**
 * Lecture par la clé ANON, délibérément.
 *
 * Utiliser `service_role` ici « pour être sûr de tout voir » serait une erreur de
 * conception : le script vérifierait alors quelque chose de différent de ce que le public
 * peut lire. En passant par `anon`, le snapshot est par construction un sous-ensemble de ce
 * qui est déjà public — et si la RLS était mal configurée, le script le révélerait au lieu
 * de le masquer.
 */
async function fetchPublished() {
  const url = `${SUPABASE_URL.replace(/\/$/, '')}/rest/v1/published_candidate_positions`
    + '?select=*&order=candidate_id.asc,question_id.asc';

  const response = await fetch(url, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
  });

  if (!response.ok) {
    throw new Error(`lecture impossible (HTTP ${response.status}) : ${await response.text()}`);
  }
  return response.json();
}

function buildSnapshot(rows) {
  // Une release et une seule. Si plusieurs cohabitent, la publication est incohérente et il
  // vaut mieux s'arrêter que produire un snapshot moitié-moitié, silencieusement faux.
  const releases = [...new Set(rows.map(r => r.release_version))];
  if (releases.length > 1) {
    throw new Error(
      `plusieurs releases publiées simultanément (${releases.join(', ')}) — `
      + 'la vue publique doit en exposer une seule sur le canal production');
  }

  const byCandidate = {};
  for (const row of rows) {
    (byCandidate[row.candidate_id] ??= []).push({
      question_id: row.question_id,
      stance: row.stance,
      excerpt: row.excerpt,
      coding_rationale: row.coding_rationale,
      source_date: row.source_date,
      valid_from: row.valid_from,
      valid_until: row.valid_until,
      source: {
        url: row.source_url,
        archive_url: row.source_archive_url,
        publisher: row.source_publisher,
        title: row.source_title,
      },
    });
  }

  return {
    // `generated_at` est délibérément ABSENT : il changerait à chaque exécution et rendrait
    // le fichier bruyant en diff, sans rien apprendre. La release identifie la version.
    release_version: releases[0] ?? null,
    release_published_at: rows[0]?.release_published_at ?? null,
    position_count: rows.length,
    candidate_count: Object.keys(byCandidate).length,
    positions: byCandidate,
  };
}

async function main() {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    log('· Supabase non configuré — snapshot inchangé (le fichier commité fait foi).');
    return 0;
  }

  let rows;
  try {
    rows = await fetchPublished();
  } catch (error) {
    // Un échec réseau ne doit PAS casser le build : le snapshot commité reste valable.
    // C'est tout l'intérêt d'un artefact de publication plutôt que d'un appel à l'exécution.
    log(`⚠ Lecture Supabase impossible : ${error.message}`);
    log('  Snapshot inchangé. Le build continue avec les données déjà commitées.');
    return 0;
  }

  if (rows.length === 0) {
    log('· Aucune position publiée pour l’instant — snapshot inchangé.');
    log('  (Attendu tant que la migration éditoriale n’a pas commencé.)');
    return 0;
  }

  const snapshot = buildSnapshot(rows);
  const serialized = `${JSON.stringify(snapshot, null, 2)}\n`;

  const previous = existsSync(OUTPUT_FILE) ? readFileSync(OUTPUT_FILE, 'utf8') : null;

  if (CHECK_ONLY) {
    if (previous !== serialized) {
      log('✖ Le snapshot commité diffère de la release publiée.');
      log('  Exécuter : node scripts/build-candidate-snapshot.mjs, puis commiter le résultat.');
      return 1;
    }
    log(`✓ Snapshot à jour (release ${snapshot.release_version}, ${snapshot.position_count} positions).`);
    return 0;
  }

  if (previous === serialized) {
    log(`· Snapshot déjà à jour (release ${snapshot.release_version}).`);
    return 0;
  }

  mkdirSync(dirname(OUTPUT_FILE), { recursive: true });
  writeFileSync(OUTPUT_FILE, serialized);
  log(`✓ Snapshot écrit : release ${snapshot.release_version}, `
    + `${snapshot.position_count} positions sur ${snapshot.candidate_count} candidats.`);
  return 0;
}

process.exit(await main());
