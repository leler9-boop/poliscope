/**
 * FounderDashboard — Tableau de bord fondateur
 *
 * Accessible sur /founder (non indexé, non lié dans le Header).
 * Requiert un mot de passe simple pour éviter l'accès public accidentel.
 *
 * Sections :
 *   1. Croissance      — nouveaux profils, events
 *   2. Politique       — candidats, archétypes, boussole idéologique
 *   3. Sociologie      — analyses par genre, âge, commune, emploi
 *   4. Questions       — les plus polarisantes / les plus skippées
 *   5. Qualité données — couverture démographique, tracking health
 */

import React, { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseEnabled } from '../lib/supabase.js';

// ─── Config ──────────────────────────────────────────────────────────────────
// Mot de passe local basique — empêche l'accès accidentel public.
// Ce n'est PAS une sécurité forte : les données sont des agrégats anonymisés.
const DASHBOARD_PIN = 'poliscop2027';

// ─── Utilities ───────────────────────────────────────────────────────────────

async function rpc(name, args = {}) {
  if (!isSupabaseEnabled || !supabase) return { data: null, error: 'Supabase non configuré' };
  const { data, error } = await supabase.rpc(name, args);
  return { data, error: error?.message ?? null };
}

function fmt(n, decimals = 0) {
  if (n == null) return '–';
  return Number(n).toLocaleString('fr-FR', { maximumFractionDigits: decimals });
}

function pct(n) {
  if (n == null) return '–';
  return `${Number(n).toFixed(1)}%`;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Section({ title, children }) {
  return (
    <div className="mb-10">
      <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">
        {title}
      </h2>
      {children}
    </div>
  );
}

function Card({ title, value, sub, color = 'gray' }) {
  const colors = {
    blue:   'bg-blue-50 border-blue-100 text-blue-700',
    green:  'bg-green-50 border-green-100 text-green-700',
    orange: 'bg-orange-50 border-orange-100 text-orange-700',
    red:    'bg-red-50 border-red-100 text-red-700',
    gray:   'bg-gray-50 border-gray-100 text-gray-700',
  };
  return (
    <div className={`rounded-xl border p-4 ${colors[color]}`}>
      <p className="text-xs font-medium opacity-70 mb-1">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
      {sub && <p className="text-xs opacity-60 mt-1">{sub}</p>}
    </div>
  );
}

function Table({ headers, rows, emptyMsg = 'Aucune donnée' }) {
  if (!rows || rows.length === 0) {
    return <p className="text-sm text-gray-400 py-4">{emptyMsg}</p>;
  }
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-100">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
          <tr>
            {headers.map(h => (
              <th key={h} className="px-4 py-2 text-left font-medium">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {rows.map((row, i) => (
            <tr key={i} className="hover:bg-gray-50/50 transition-colors">
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-2 text-gray-700">{cell ?? '–'}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Bar({ label, value, max, color = '#3b82f6' }) {
  const pctWidth = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="flex items-center gap-3 py-1">
      <span className="text-xs text-gray-600 w-32 flex-shrink-0 truncate">{label}</span>
      <div className="flex-1 bg-gray-100 rounded-full h-2">
        <div
          className="h-2 rounded-full transition-all"
          style={{ width: `${pctWidth}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-xs text-gray-500 w-12 text-right">{fmt(value)}</span>
    </div>
  );
}

function Loader() {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="w-5 h-5 rounded-full border-2 border-gray-200 border-t-blue-500 animate-spin" />
    </div>
  );
}

function StatError({ msg }) {
  return <p className="text-xs text-red-400 py-2">{msg}</p>;
}

// ─── Data hooks ───────────────────────────────────────────────────────────────

function useQuery(fn, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fn();
      if (result?.error) setError(result.error);
      else setData(result?.data ?? result);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => { load(); }, [load]);

  return { data, loading, error, reload: load };
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

function Dashboard() {
  const [lastRefresh, setLastRefresh] = useState(new Date());

  // ── Croissance ──────────────────────────────────────────────────────────────
  // RPC: founder_get_growth() — bypasses RLS via SECURITY DEFINER
  const growth = useQuery(async () => {
    const { data, error } = await rpc('founder_get_growth');
    if (error) return { error };
    if (!data) return { error: 'Aucune donnée' };
    return {
      totalProfiles:    data.total_profiles,
      last7d:           data.profiles_7d,
      last30d:          data.profiles_30d,
      today:            data.profiles_24h,
      totalEvents:      data.total_events,
      totalDemographics: data.total_demographics,
      demographicsRate: data.total_profiles > 0
        ? ((data.total_demographics / data.total_profiles) * 100).toFixed(1)
        : 0,
    };
  });

  // ── Politique — candidats ──────────────────────────────────────────────────
  const candidates = useQuery(async () => {
    const { data, error } = await rpc('founder_get_candidates');
    if (error) return { error };
    // data is an array of {id, count, avg_alignment, pct}
    return (data ?? []).map(c => ({
      id:  c.id,
      n:   c.count,
      avg: c.avg_alignment,
      pctTotal: c.pct,
    }));
  });

  // ── Archétypes ────────────────────────────────────────────────────────────
  const archetypes = useQuery(async () => {
    const { data, error } = await rpc('founder_get_archetypes');
    if (error) return { error };
    return (data ?? []).map(a => ({ id: a.id, n: a.count, pct: a.pct }));
  });

  // ── Boussole politique ────────────────────────────────────────────────────
  const compass = useQuery(async () => {
    const { data, error } = await rpc('founder_get_compass');
    if (error) return { error };
    if (!data || !data.n) return null;
    return {
      avgEconomic: data.avg_economic,
      avgSocial:   data.avg_social,
      n:           data.n,
    };
  });

  // ── Sociologie — scores par genre ─────────────────────────────────────────
  const byGender = useQuery(async () => {
    const { data, error } = await rpc('founder_get_gender_scores');
    if (error) return { error };
    return (data ?? []).map(r => ({
      genre:       r.genre,
      n:           r.n,
      social:      r.social,
      immigration: r.immigration,
      global:      r.global,
      environment: r.environment,
    }));
  });

  // ── Sociologie — scores par commune ──────────────────────────────────────
  const byCommune = useQuery(async () => {
    const { data, error } = await rpc('founder_get_commune_scores');
    if (error) return { error };
    return (data ?? []).map(r => ({
      commune:     r.commune.replace('_', ' '),
      n:           r.n,
      immigration: r.immigration,
      global:      r.global,
      security:    r.security,
    }));
  });

  // ── Questions — top 10 les plus skippées ─────────────────────────────────
  const topSkipped = useQuery(async () => {
    const { data, error } = await rpc('founder_get_top_skipped', { limit_n: 10 });
    if (error) return { error };
    return (data ?? []).map(r => ({ id: r.id, n: r.count }));
  });

  // ── Events 7 derniers jours ───────────────────────────────────────────────
  const eventBreakdown = useQuery(async () => {
    const { data, error } = await rpc('founder_get_events', { days_back: 7 });
    if (error) return { error };
    return (data ?? []).map(r => ({ event: r.event, n: r.count }));
  });

  const reload = () => {
    setLastRefresh(new Date());
    [growth, candidates, archetypes, compass, byGender, byCommune, topSkipped, eventBreakdown]
      .forEach(q => q.reload());
  };

  const g = growth.data;
  const maxCandidateCount = candidates.data?.[0]?.n ?? 1;
  const maxArchetypeCount = archetypes.data?.[0]?.n ?? 1;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-start justify-between mb-10">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-400 mt-1">
            Mis à jour le {lastRefresh.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
          </p>
          {!isSupabaseEnabled && (
            <p className="mt-2 text-sm text-orange-600 bg-orange-50 border border-orange-200 rounded-lg px-3 py-1.5 inline-block">
              ⚠️ Supabase non configuré — données réelles non disponibles
            </p>
          )}
        </div>
        <button
          onClick={reload}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium border border-blue-200 rounded-lg px-3 py-1.5 transition-colors"
        >
          ↻ Actualiser
        </button>
      </div>

      {/* ── 1. CROISSANCE ─────────────────────────────────────────────────── */}
      <Section title="📈 Croissance">
        {growth.loading ? <Loader /> : growth.error ? <StatError msg={growth.error} /> : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
              <Card title="Profils total"     value={fmt(g?.totalProfiles)}  color="blue" />
              <Card title="Profils 7 jours"   value={fmt(g?.last7d)}         color="green" />
              <Card title="Profils 24h"        value={fmt(g?.today)}          color="green" />
              <Card title="Events total"       value={fmt(g?.totalEvents)}    color="gray" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Card
                title="Démographies remplies"
                value={fmt(g?.totalDemographics)}
                sub={`${g?.demographicsRate}% des profils`}
                color={g?.demographicsRate >= 30 ? 'green' : 'orange'}
              />
              <Card
                title="Taux de couverture démo"
                value={`${g?.demographicsRate ?? '–'}%`}
                sub="Objectif : > 30% pour analyses fiables"
                color={g?.demographicsRate >= 30 ? 'green' : 'orange'}
              />
            </div>
          </>
        )}
      </Section>

      {/* ── 2. POLITIQUE ──────────────────────────────────────────────────── */}
      <Section title="🗳️ Politique">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Candidats */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Top candidats (matches)</h3>
            {candidates.loading ? <Loader /> : candidates.error ? <StatError msg={candidates.error} /> :
              (candidates.data ?? []).slice(0, 8).map(c => (
                <Bar
                  key={c.id}
                  label={c.id}
                  value={c.n}
                  max={maxCandidateCount}
                  color="#3b82f6"
                />
              ))
            }
          </div>
          {/* Archétypes */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Archétypes dominants</h3>
            {archetypes.loading ? <Loader /> : archetypes.error ? <StatError msg={archetypes.error} /> :
              (archetypes.data ?? []).slice(0, 8).map(a => (
                <Bar
                  key={a.id}
                  label={a.id}
                  value={a.n}
                  max={maxArchetypeCount}
                  color="#8b5cf6"
                />
              ))
            }
          </div>
        </div>

        {/* Boussole */}
        {compass.loading ? <Loader /> : compass.data && (
          <div className="mt-4 rounded-xl bg-gray-50 border border-gray-100 p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Boussole idéologique — centre de gravité</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xs text-gray-500 mb-1">Axe économique</p>
                <p className="text-xl font-bold text-blue-600">{compass.data.avgEconomic}</p>
                <p className="text-xs text-gray-400">/100 · gauche = 0, droite = 100</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Axe sociétal</p>
                <p className="text-xl font-bold text-purple-600">{compass.data.avgSocial}</p>
                <p className="text-xs text-gray-400">/100 · conservateur = 0, progressiste = 100</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Profils analysés</p>
                <p className="text-xl font-bold text-gray-700">{fmt(compass.data.n)}</p>
              </div>
            </div>
          </div>
        )}
      </Section>

      {/* ── 3. SOCIOLOGIE ─────────────────────────────────────────────────── */}
      <Section title="👥 Sociologie">
        {/* Par genre */}
        <h3 className="text-sm font-medium text-gray-700 mb-2">Scores thématiques par genre (0–100)</h3>
        {byGender.loading ? <Loader /> : byGender.error ? <StatError msg={byGender.error} /> : (
          <Table
            headers={['Genre', 'N', 'Social', 'Immigration', 'Global (Europe)', 'Environnement']}
            rows={(byGender.data ?? []).map(r => [
              r.genre,
              fmt(r.n),
              r.social,
              r.immigration,
              r.global,
              r.environment,
            ])}
            emptyMsg="Pas assez de données démographiques (genre)"
          />
        )}

        {/* Par commune */}
        <h3 className="text-sm font-medium text-gray-700 mb-2 mt-6">Scores par type de commune (0–100)</h3>
        <p className="text-xs text-gray-400 mb-3">
          Immigration bas = restrictif · Global bas = souverainiste
        </p>
        {byCommune.loading ? <Loader /> : byCommune.error ? <StatError msg={byCommune.error} /> : (
          <Table
            headers={['Commune', 'N', 'Immigration', 'Global (Europe)', 'Sécurité']}
            rows={(byCommune.data ?? []).map(r => [
              r.commune,
              fmt(r.n),
              r.immigration,
              r.global,
              r.security,
            ])}
            emptyMsg="commune_type non encore collecté (schema_v4 requis)"
          />
        )}
      </Section>

      {/* ── 4. QUESTIONS ──────────────────────────────────────────────────── */}
      <Section title="❓ Questions">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Top 10 questions les plus skippées</h3>
        <p className="text-xs text-gray-400 mb-3">
          Les skips révèlent les questions qui créent de la friction ou de l'inconfort.
        </p>
        {topSkipped.loading ? <Loader /> : topSkipped.error ? <StatError msg={topSkipped.error} /> : (
          <Table
            headers={['Question ID', 'Nombre de skips']}
            rows={(topSkipped.data ?? []).map(r => [r.id, fmt(r.n)])}
            emptyMsg="Aucun event question_skipped pour l'instant"
          />
        )}
      </Section>

      {/* ── 5. QUALITÉ DES DONNÉES ────────────────────────────────────────── */}
      <Section title="🔬 Qualité des données (7 derniers jours)">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Répartition des events</h3>
        {eventBreakdown.loading ? <Loader /> : eventBreakdown.error ? <StatError msg={eventBreakdown.error} /> : (
          <Table
            headers={['Événement', 'N (7j)']}
            rows={(eventBreakdown.data ?? []).map(r => [r.event, fmt(r.n)])}
            emptyMsg="Aucun event dans les 7 derniers jours"
          />
        )}

        <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
          <p className="text-sm font-medium text-blue-800 mb-2">🧭 Requêtes SQL avancées</p>
          <p className="text-xs text-blue-600">
            Pour les analyses politiques complètes (candidat × genre, ruraux × souverainisme,
            questions les plus clivantes...), utilise les requêtes dans{' '}
            <code className="bg-blue-100 px-1 rounded">supabase/insights_queries.sql</code> directement
            dans l'éditeur SQL Supabase.
          </p>
        </div>
      </Section>

      <footer className="mt-10 pt-6 border-t border-gray-100 text-center">
        <p className="text-xs text-gray-400">
          POLISCOP · Dashboard fondateur · Non indexé · Données anonymisées agrégées
        </p>
      </footer>
    </div>
  );
}

// ─── Auth Gate ────────────────────────────────────────────────────────────────

export default function FounderDashboard() {
  const [unlocked, setUnlocked] = useState(() => {
    try { return sessionStorage.getItem('founder_unlocked') === 'yes'; } catch { return false; }
  });
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (pin === DASHBOARD_PIN) {
      try { sessionStorage.setItem('founder_unlocked', 'yes'); } catch {}
      setUnlocked(true);
    } else {
      setError(true);
      setPin('');
      setTimeout(() => setError(false), 2000);
    }
  }

  if (unlocked) return <Dashboard />;

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 w-full max-w-sm text-center">
        <div className="text-3xl mb-4">📊</div>
        <h1 className="text-lg font-bold text-gray-900 mb-1">Dashboard POLISCOP</h1>
        <p className="text-sm text-gray-400 mb-6">Accès fondateur uniquement</p>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={pin}
            onChange={e => setPin(e.target.value)}
            placeholder="Mot de passe"
            autoFocus
            className={[
              'w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 mb-4',
              error
                ? 'border-red-300 ring-red-200 bg-red-50 text-red-700'
                : 'border-gray-200 ring-blue-200',
            ].join(' ')}
          />
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-black transition-colors"
          >
            Accéder
          </button>
        </form>
        {error && (
          <p className="text-xs text-red-500 mt-3">Mot de passe incorrect</p>
        )}
      </div>
    </div>
  );
}
