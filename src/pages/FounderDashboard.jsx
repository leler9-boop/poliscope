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

async function sql(query) {
  if (!isSupabaseEnabled || !supabase) return { data: null, error: 'Supabase non configuré' };
  const { data, error } = await supabase.rpc('exec_sql_for_founder', { query_text: query });
  // fallback: try direct table access if RPC not available
  return { data, error: error?.message ?? null };
}

async function query(table, options = {}) {
  if (!isSupabaseEnabled || !supabase) return { data: null, error: 'Supabase non configuré' };
  let q = supabase.from(table).select(options.select ?? '*');
  if (options.order)  q = q.order(options.order, { ascending: options.asc ?? false });
  if (options.limit)  q = q.limit(options.limit);
  if (options.filter) q = q.filter(...options.filter);
  return q;
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
  const growth = useQuery(async () => {
    if (!isSupabaseEnabled || !supabase) return { data: null, error: 'Supabase non configuré' };

    const [profilesRes, eventsRes, demoRes] = await Promise.all([
      supabase.from('user_profiles').select('created_at', { count: 'exact', head: false }),
      supabase.from('events').select('created_at', { count: 'exact', head: true }),
      supabase.from('user_demographics').select('id', { count: 'exact', head: true }),
    ]);

    const now = new Date();
    const day7ago = new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString();
    const day30ago = new Date(now - 30 * 24 * 60 * 60 * 1000).toISOString();
    const yesterday = new Date(now - 24 * 60 * 60 * 1000).toISOString();

    const allProfiles = profilesRes.data ?? [];
    const totalProfiles = allProfiles.length;
    const last7d = allProfiles.filter(p => p.created_at >= day7ago).length;
    const last30d = allProfiles.filter(p => p.created_at >= day30ago).length;
    const today = allProfiles.filter(p => p.created_at >= yesterday).length;

    return {
      totalProfiles,
      last7d,
      last30d,
      today,
      totalEvents: eventsRes.count ?? 0,
      totalDemographics: demoRes.count ?? 0,
      demographicsRate: totalProfiles > 0
        ? ((demoRes.count ?? 0) / totalProfiles * 100).toFixed(1)
        : 0,
    };
  });

  // ── Politique — candidats ──────────────────────────────────────────────────
  const candidates = useQuery(async () => {
    if (!isSupabaseEnabled || !supabase) return { data: null };
    const { data } = await supabase
      .from('user_profiles')
      .select('top_candidate_id, top_candidate_alignment')
      .not('top_candidate_id', 'is', null);

    if (!data) return { data: [] };

    const counts = {};
    const aligns = {};
    data.forEach(({ top_candidate_id, top_candidate_alignment }) => {
      counts[top_candidate_id] = (counts[top_candidate_id] || 0) + 1;
      aligns[top_candidate_id] = aligns[top_candidate_id] || [];
      if (top_candidate_alignment) aligns[top_candidate_id].push(top_candidate_alignment);
    });

    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([id, n]) => {
        const avg = aligns[id].length
          ? aligns[id].reduce((s, v) => s + v, 0) / aligns[id].length
          : 0;
        const pctTotal = ((n / data.length) * 100).toFixed(1);
        return { id, n, avg: avg.toFixed(1), pctTotal };
      });
  });

  // ── Archétypes ────────────────────────────────────────────────────────────
  const archetypes = useQuery(async () => {
    if (!isSupabaseEnabled || !supabase) return { data: null };
    const { data } = await supabase
      .from('user_profiles')
      .select('archetype_id')
      .not('archetype_id', 'is', null);

    if (!data) return [];
    const counts = {};
    data.forEach(({ archetype_id }) => {
      counts[archetype_id] = (counts[archetype_id] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([id, n]) => ({ id, n, pct: ((n / data.length) * 100).toFixed(1) }));
  });

  // ── Boussole politique ────────────────────────────────────────────────────
  const compass = useQuery(async () => {
    if (!isSupabaseEnabled || !supabase) return null;
    const { data } = await supabase
      .from('user_profiles')
      .select('axes')
      .not('axes', 'is', null);

    if (!data || data.length === 0) return null;

    let sumEco = 0, sumSoc = 0, n = 0;
    data.forEach(({ axes }) => {
      if (axes?.economic != null && axes?.social != null) {
        sumEco += Number(axes.economic);
        sumSoc += Number(axes.social);
        n++;
      }
    });
    if (n === 0) return null;
    return {
      avgEconomic: (sumEco / n).toFixed(1),
      avgSocial:   (sumSoc / n).toFixed(1),
      n,
    };
  });

  // ── Sociologie — scores par genre ─────────────────────────────────────────
  const byGender = useQuery(async () => {
    if (!isSupabaseEnabled || !supabase) return null;
    const { data } = await supabase
      .from('user_profiles')
      .select('user_id, theme_scores, axes')
      .not('theme_scores', 'is', null);

    if (!data || data.length === 0) return null;

    const { data: demos } = await supabase
      .from('user_demographics')
      .select('user_id, gender')
      .in('gender', ['homme', 'femme']);

    if (!demos) return null;

    const demoMap = {};
    demos.forEach(d => { demoMap[d.user_id] = d.gender; });

    const groups = { homme: { SOCIAL: [], IMMIGRATION: [], GLOBAL: [], ENVIRONMENT: [], n: 0 },
                     femme:  { SOCIAL: [], IMMIGRATION: [], GLOBAL: [], ENVIRONMENT: [], n: 0 } };

    data.forEach(({ user_id, theme_scores }) => {
      const g = demoMap[user_id];
      if (!g || !groups[g] || !theme_scores) return;
      groups[g].SOCIAL.push(Number(theme_scores.SOCIAL ?? 50));
      groups[g].IMMIGRATION.push(Number(theme_scores.IMMIGRATION ?? 50));
      groups[g].GLOBAL.push(Number(theme_scores.GLOBAL ?? 50));
      groups[g].ENVIRONMENT.push(Number(theme_scores.ENVIRONMENT ?? 50));
      groups[g].n++;
    });

    const avg = arr => arr.length ? (arr.reduce((s, v) => s + v, 0) / arr.length).toFixed(1) : '–';

    return Object.entries(groups).map(([genre, scores]) => ({
      genre,
      n: scores.n,
      social:       avg(scores.SOCIAL),
      immigration:  avg(scores.IMMIGRATION),
      global:       avg(scores.GLOBAL),
      environment:  avg(scores.ENVIRONMENT),
    }));
  });

  // ── Sociologie — scores par commune ──────────────────────────────────────
  const byCommune = useQuery(async () => {
    if (!isSupabaseEnabled || !supabase) return null;
    const { data } = await supabase
      .from('user_profiles')
      .select('user_id, theme_scores')
      .not('theme_scores', 'is', null);

    if (!data) return null;

    const { data: demos } = await supabase
      .from('user_demographics')
      .select('user_id, commune_type')
      .not('commune_type', 'is', null);

    if (!demos) return null;

    const demoMap = {};
    demos.forEach(d => { demoMap[d.user_id] = d.commune_type; });

    const groups = {};
    data.forEach(({ user_id, theme_scores }) => {
      const ct = demoMap[user_id];
      if (!ct || !theme_scores) return;
      if (!groups[ct]) groups[ct] = { IMMIGRATION: [], GLOBAL: [], SECURITY: [], n: 0 };
      groups[ct].IMMIGRATION.push(Number(theme_scores.IMMIGRATION ?? 50));
      groups[ct].GLOBAL.push(Number(theme_scores.GLOBAL ?? 50));
      groups[ct].SECURITY.push(Number(theme_scores.SECURITY ?? 50));
      groups[ct].n++;
    });

    const avg = arr => arr.length ? (arr.reduce((s, v) => s + v, 0) / arr.length).toFixed(1) : '–';
    const order = ['grande_ville', 'ville_moyenne', 'petite_ville', 'rural'];

    return order
      .filter(ct => groups[ct])
      .map(ct => ({
        commune: ct.replace('_', ' '),
        n: groups[ct].n,
        immigration: avg(groups[ct].IMMIGRATION),
        global:      avg(groups[ct].GLOBAL),
        security:    avg(groups[ct].SECURITY),
      }));
  });

  // ── Questions — top 10 les plus skippées ─────────────────────────────────
  const topSkipped = useQuery(async () => {
    if (!isSupabaseEnabled || !supabase) return [];
    const { data } = await supabase
      .from('events')
      .select('props')
      .eq('event_name', 'question_skipped');

    if (!data) return [];
    const counts = {};
    data.forEach(({ props }) => {
      const id = props?.question_id;
      if (id) counts[id] = (counts[id] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([id, n]) => ({ id, n }));
  });

  // ── Events today ──────────────────────────────────────────────────────────
  const eventBreakdown = useQuery(async () => {
    if (!isSupabaseEnabled || !supabase) return [];
    const yesterday = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const { data } = await supabase
      .from('events')
      .select('event_name')
      .gte('created_at', yesterday);

    if (!data) return [];
    const counts = {};
    data.forEach(({ event_name }) => {
      counts[event_name] = (counts[event_name] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([event, n]) => ({ event, n }));
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
