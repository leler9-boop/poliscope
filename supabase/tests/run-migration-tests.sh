#!/usr/bin/env bash
# POLISCOP — Test réel des migrations Supabase sur un cluster Postgres jetable.
#
# Ne nécessite ni Docker ni la CLI Supabase : seulement `initdb`/`pg_ctl`/`psql`
# (Homebrew `postgresql@16` suffit). Crée un cluster temporaire, applique la fixture,
# les migrations, puis les tests d'autorisation, et détruit tout à la fin.
#
# Usage :  ./supabase/tests/run-migration-tests.sh
# Sortie :  0 si tous les tests passent, non nul sinon.

set -euo pipefail

# Postgres refuse de démarrer si le postmaster devient multithreadé pendant l'initialisation :
# sur macOS, une locale non résolue déclenche ce cas. C = locale toujours disponible.
export LC_ALL=C LANG=C

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
PORT="${POLISCOP_TEST_PG_PORT:-54329}"
WORKDIR="$(mktemp -d "${TMPDIR:-/tmp}/poliscop-pg.XXXXXX")"
# Le chemin d'une socket Unix est limité à ~103 octets : rester court, sous /tmp.
SOCKDIR="$(mktemp -d /tmp/pgsock.XXXX)"
PGDATA="$WORKDIR/data"

cleanup() {
  pg_ctl -D "$PGDATA" -m immediate stop >/dev/null 2>&1 || true
  rm -rf "$WORKDIR" "$SOCKDIR"
}
trap cleanup EXIT

for bin in initdb pg_ctl psql; do
  command -v "$bin" >/dev/null 2>&1 || {
    echo "PostgreSQL introuvable ($bin). Installer par ex. : brew install postgresql@16" >&2
    exit 127
  }
done

echo "▶ Création d'un cluster jetable (port $PORT)…"
initdb -D "$PGDATA" -U postgres --auth=trust >"$WORKDIR/initdb.log" 2>&1
pg_ctl -D "$PGDATA" -o "-p $PORT -k $SOCKDIR -c listen_addresses=127.0.0.1" \
       -l "$WORKDIR/postgres.log" -w start >/dev/null

PSQL=(psql -h 127.0.0.1 -p "$PORT" -U postgres -d postgres -v ON_ERROR_STOP=1 --quiet)

# ── Deux bases, deux preuves distinctes ────────────────────────────────────
# 1. `before` : fixture + migrations HISTORIQUES uniquement → prouve l'état de départ
#    (les RPC founder_* étaient réellement ouvertes à `anon`).
# 2. `full`   : fixture + TOUTES les migrations dans l'ordre lexical exact, celui que
#    `supabase db push` applique. Le runner enchaînait auparavant `13:00` puis `12:00`,
#    un ordre que la CLI ne produit jamais.
"${PSQL[@]}" -d postgres -c 'create database poliscop_before' >/dev/null
"${PSQL[@]}" -d postgres -c 'create database poliscop_full'   >/dev/null

PSQL_BEFORE=(psql -h 127.0.0.1 -p "$PORT" -U postgres -d poliscop_before -v ON_ERROR_STOP=1 --quiet)
PSQL_FULL=(psql -h 127.0.0.1 -p "$PORT" -U postgres -d poliscop_full   -v ON_ERROR_STOP=1 --quiet)

MIGRATIONS=()
while IFS= read -r m; do MIGRATIONS+=("$m"); done \
  < <(find "$ROOT/supabase/migrations" -maxdepth 1 -name '*.sql' | sort)

echo "▶ [before] Fixture + migrations historiques…"
"${PSQL_BEFORE[@]}" -f "$ROOT/supabase/tests/fixture_supabase_like.sql" >/dev/null
for m in "${MIGRATIONS[@]}"; do
  case "$(basename "$m")" in 20260809*) continue ;; esac
  "${PSQL_BEFORE[@]}" -f "$m" >/dev/null
done

echo "▶ [before] État de départ : anon doit pouvoir appeler les RPC founder_*…"
LEAKS_BEFORE="$("${PSQL_BEFORE[@]}" -t -A -c "
  select count(*) from pg_proc p join pg_namespace n on n.oid = p.pronamespace
  where n.nspname='public' and p.proname like 'founder\\_%'
    and has_function_privilege('anon', p.oid, 'execute');")"
echo "  → $LEAKS_BEFORE fonction(s) founder_* exécutable(s) par anon AVANT durcissement"
if [ "$LEAKS_BEFORE" -eq 0 ]; then
  echo "  ⚠ attendu > 0 : la fixture ne reproduit pas l'état de départ" >&2
  exit 1
fi

echo "▶ [full] Chaîne complète, ordre lexical (identique à la CLI) :"
"${PSQL_FULL[@]}" -f "$ROOT/supabase/tests/fixture_supabase_like.sql" >/dev/null
APPLIED_LOG="$WORKDIR/applied-order.txt"
: > "$APPLIED_LOG"
for m in "${MIGRATIONS[@]}"; do
  echo "   · $(basename "$m")"
  basename "$m" >> "$APPLIED_LOG"
  "${PSQL_FULL[@]}" -f "$m" >/dev/null
done

# L'ordre RÉELLEMENT appliqué est comparé à l'ordre lexical des noms de fichiers : c'est
# celui que `supabase db push` utilise. Le runner appliquait auparavant 13:00 avant 12:00.
EXPECTED_LOG="$WORKDIR/expected-order.txt"
# `xargs -n1 basename` couperait sur l'espace du chemin (« poliscope copy ») : boucle explicite.
: > "$EXPECTED_LOG"
for m in "${MIGRATIONS[@]}"; do basename "$m" >> "$EXPECTED_LOG"; done
sort -o "$EXPECTED_LOG" "$EXPECTED_LOG"
if ! diff -q "$APPLIED_LOG" "$EXPECTED_LOG" >/dev/null; then
  echo "  ⚠ ordre appliqué différent de l'ordre lexical attendu :" >&2
  diff "$EXPECTED_LOG" "$APPLIED_LOG" >&2 || true
  exit 1
fi
echo "  → ordre conforme à la CLI ($(wc -l < "$APPLIED_LOG" | tr -d ' ') migrations)"

echo "▶ [full] Idempotence : seconde application de la migration d'autorisation…"
"${PSQL_FULL[@]}" -f "$ROOT/supabase/migrations/20260809120000_admin_authorization.sql" >/dev/null

# Les tests d'autorisation portent sur la base complète.
PSQL=("${PSQL_FULL[@]}")

echo "▶ Tests d'autorisation…"
"${PSQL[@]}" -f "$ROOT/supabase/tests/admin_authorization.test.sql"

echo "▶ Tests de la plateforme de données…"
"${PSQL[@]}" -f "$ROOT/supabase/tests/data_platform.test.sql"

echo "▶ Rollback…"
"${PSQL[@]}" -f "$ROOT/supabase/rollbacks/20260809120000_admin_authorization_rollback.sql" >/dev/null
RESTORED="$("${PSQL[@]}" -t -A -c "
  select count(*) from pg_proc p join pg_namespace n on n.oid = p.pronamespace
  where n.nspname='public' and p.proname like 'founder\\_%'
    and p.proname not like 'founder\\_impl\\_%';")"
if [ "$RESTORED" -ne 9 ]; then
  echo "  ⚠ rollback incomplet : $RESTORED fonctions founder_* restaurées sur 9" >&2
  exit 1
fi
echo "  → 9 fonctions restaurées"

echo
echo "✅ Toutes les migrations et tests d'autorisation sont passés."
