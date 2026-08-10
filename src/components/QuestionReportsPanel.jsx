/**
 * POLISCOP — Tableau de bord éditorial des questions signalées.
 *
 * Répond à la question que l'équipe se pose réellement : « quelles questions faut-il
 * réécrire en premier ? » Elle ne se tranche pas sur le seul nombre de signalements — une
 * question peu signalée mais dont le temps médian double et dont le taux de « sans opinion »
 * grimpe est souvent plus abîmée qu'une question signalée trois fois par la même personne.
 * Les trois signaux sont donc affichés CÔTE À CÔTE, jamais séparément.
 *
 * ⚠ Toutes les données viennent de RPC `security definer` qui vérifient `is_founder_admin()`
 * dans leur corps. Ce composant ne protège rien : il masque une interface. Si les RPC
 * étaient ouvertes, cacher le bouton ne servirait à rien.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseEnabled } from '../lib/supabase.js';
import { QUESTIONNAIRE_VERSION } from '../engine/versions.js';

const STATUS_LABELS = {
  new:       'Nouveau',
  triaged:   'Trié',
  confirmed: 'Confirmé',
  rejected:  'Rejeté',
  fixed:     'Corrigé',
};

const CATEGORY_LABELS = {
  unclear:    'Pas claire',
  biased:     'Biaisée',
  irrelevant: 'Pas pertinente',
  fact_error: 'Erreur factuelle',
  outdated:   'Dépassée',
  technical:  'Problème technique',
  other:      'Autre',
};

const STATUS_COLORS = {
  new:       'bg-blue-50 text-blue-700 border-blue-200',
  triaged:   'bg-amber-50 text-amber-700 border-amber-200',
  confirmed: 'bg-orange-50 text-orange-700 border-orange-200',
  rejected:  'bg-gray-50 text-gray-600 border-gray-200',
  fixed:     'bg-green-50 text-green-700 border-green-200',
};

async function rpc(name, args = {}) {
  if (!isSupabaseEnabled || !supabase) return { data: null, error: 'Supabase non configuré' };
  const { data, error } = await supabase.rpc(name, args);
  return { data, error: error?.message ?? null };
}

/** Millisecondes → « 4,2 s ». Les temps de question se lisent en secondes, pas en ms. */
function seconds(ms) {
  if (ms == null) return '–';
  return `${(Number(ms) / 1000).toFixed(1)} s`;
}

function percent(rate) {
  if (rate == null) return '–';
  return `${(Number(rate) * 100).toFixed(1)} %`;
}

/**
 * Export CSV des AGRÉGATS. Jamais les commentaires libres ni les identifiants de session :
 * un export de lignes brutes serait une extraction d'opinions pseudonymes hors du périmètre
 * de collecte annoncé aux utilisateurs.
 */
function toCsv(rows) {
  const headers = ['question_id', 'questionnaire_version', 'category', 'status',
                   'report_count', 'first_reported_at', 'last_reported_at'];
  const escape = (value) => {
    const text = value == null ? '' : String(value);
    return /[",\n;]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  };
  return [headers.join(';'), ...rows.map(r => headers.map(h => escape(r[h])).join(';'))].join('\n');
}

function downloadCsv(rows, filename) {
  const blob = new Blob([`﻿${toCsv(rows)}`], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export default function QuestionReportsPanel() {
  const [reports, setReports] = useState({ loading: true, data: [], error: null });
  const [health,  setHealth]  = useState({ loading: true, data: [], error: null });
  const [filters, setFilters] = useState({ status: '', category: '', version: '' });
  const [busyId,  setBusyId]  = useState(null);

  const load = useCallback(async () => {
    setReports(s => ({ ...s, loading: true }));
    setHealth(s => ({ ...s, loading: true }));

    const [reportsResult, healthResult] = await Promise.all([
      rpc('admin_question_reports', {
        p_status: filters.status || null,
        p_category: filters.category || null,
        p_questionnaire_version: filters.version || null,
        p_limit: 200,
      }),
      rpc('admin_question_health', {
        p_questionnaire_version: filters.version || null,
        p_mode: null,
      }),
    ]);

    setReports({ loading: false, data: reportsResult.data ?? [], error: reportsResult.error });
    setHealth({ loading: false, data: healthResult.data ?? [], error: healthResult.error });
  }, [filters]);

  useEffect(() => { load(); }, [load]);

  async function updateStatus(reportId, status) {
    setBusyId(reportId);
    const { error } = await rpc('admin_update_question_report', {
      p_report_id: reportId,
      p_status: status,
      // La version corrigée n'est renseignée QUE sur « corrigé » : c'est elle qui permettra
      // ensuite de distinguer « encore vrai » d'« ancien signalement déjà traité ».
      p_fixed_in_version: status === 'fixed' ? QUESTIONNAIRE_VERSION : null,
    });
    setBusyId(null);
    if (error) { window.alert(`Échec de la mise à jour : ${error}`); return; }
    await load();
  }

  async function exportAggregates() {
    const { data, error } = await rpc('admin_export_report_aggregates', {
      p_questionnaire_version: filters.version || null,
    });
    if (error) { window.alert(`Export impossible : ${error}`); return; }
    downloadCsv(data ?? [], `poliscop-signalements-${new Date().toISOString().slice(0, 10)}.csv`);
  }

  // Fusion des trois signaux, triée par nombre de signalements.
  const healthByQuestion = new Map((health.data ?? []).map(h => [h.question_id, h]));
  const ranked = [...(health.data ?? [])]
    .filter(h => h.report_count > 0 || h.no_opinion_rate > 0.25)
    .sort((a, b) => (b.report_count - a.report_count) || (b.no_opinion_rate - a.no_opinion_rate))
    .slice(0, 25);

  return (
    <div className="mb-10">
      <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">
        🚩 Questions signalées
      </h2>

      {/* ── Filtres ── */}
      <div className="flex flex-wrap gap-2 mb-4">
        <select
          value={filters.status}
          onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}
          className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white"
        >
          <option value="">Tous les statuts</option>
          {Object.entries(STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>

        <select
          value={filters.category}
          onChange={e => setFilters(f => ({ ...f, category: e.target.value }))}
          className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white"
        >
          <option value="">Toutes les catégories</option>
          {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>

        <input
          type="text"
          value={filters.version}
          onChange={e => setFilters(f => ({ ...f, version: e.target.value }))}
          placeholder={`Version (ex. ${QUESTIONNAIRE_VERSION})`}
          className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white flex-1 min-w-[200px]"
        />

        <button
          onClick={exportAggregates}
          className="text-sm px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
        >
          Exporter les agrégats (CSV)
        </button>
      </div>

      {/* ── Classement croisé ── */}
      <h3 className="text-sm font-medium text-gray-700 mb-1">
        Questions à revoir en priorité
      </h3>
      <p className="text-xs text-gray-400 mb-3">
        Signalements, temps médian et taux de « sans opinion » côte à côte. Les temps sont des
        PERCENTILES : une moyenne serait déplacée de plusieurs minutes par un seul onglet
        laissé ouvert.
      </p>

      {health.loading ? (
        <p className="text-sm text-gray-400 py-4">Chargement…</p>
      ) : health.error ? (
        <p className="text-sm text-red-500 py-4">{health.error}</p>
      ) : ranked.length === 0 ? (
        <p className="text-sm text-gray-400 py-4">
          Aucune donnée de passation collectée pour l’instant.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-100">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
              <tr>
                <th className="px-3 py-2 text-left font-medium">Question</th>
                <th className="px-3 py-2 text-right font-medium">Signalements</th>
                <th className="px-3 py-2 text-right font-medium">Vues</th>
                <th className="px-3 py-2 text-right font-medium">Sans opinion</th>
                <th className="px-3 py-2 text-right font-medium">Modifications</th>
                <th className="px-3 py-2 text-right font-medium">p25</th>
                <th className="px-3 py-2 text-right font-medium">Médiane</th>
                <th className="px-3 py-2 text-right font-medium">p75</th>
                <th className="px-3 py-2 text-right font-medium">p90</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {ranked.map(row => (
                <tr key={`${row.question_id}-${row.questionnaire_version}`} className="hover:bg-gray-50/50">
                  <td className="px-3 py-2 font-medium text-gray-800">
                    {row.question_id}
                    <span className="ml-2 text-[10px] text-gray-400">{row.questionnaire_version}</span>
                  </td>
                  <td className="px-3 py-2 text-right">
                    {row.report_count > 0
                      ? <span className="font-semibold text-orange-600">{row.report_count}</span>
                      : <span className="text-gray-300">0</span>}
                  </td>
                  <td className="px-3 py-2 text-right text-gray-500">{row.shown_count}</td>
                  <td className={`px-3 py-2 text-right ${row.no_opinion_rate > 0.3 ? 'text-red-600 font-semibold' : 'text-gray-600'}`}>
                    {percent(row.no_opinion_rate)}
                  </td>
                  <td className="px-3 py-2 text-right text-gray-600">{percent(row.change_rate)}</td>
                  <td className="px-3 py-2 text-right text-gray-400">{seconds(row.dwell_p25_ms)}</td>
                  <td className="px-3 py-2 text-right text-gray-800 font-medium">{seconds(row.dwell_median_ms)}</td>
                  <td className="px-3 py-2 text-right text-gray-400">{seconds(row.dwell_p75_ms)}</td>
                  <td className="px-3 py-2 text-right text-gray-400">{seconds(row.dwell_p90_ms)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── File de signalements ── */}
      <h3 className="text-sm font-medium text-gray-700 mb-1 mt-8">
        File de signalements
      </h3>
      <p className="text-xs text-gray-400 mb-3">
        Un signalement portant sur une version de questionnaire ANTÉRIEURE est marqué comme
        tel : le problème a pu être corrigé depuis.
      </p>

      {reports.loading ? (
        <p className="text-sm text-gray-400 py-4">Chargement…</p>
      ) : reports.error ? (
        <p className="text-sm text-red-500 py-4">{reports.error}</p>
      ) : reports.data.length === 0 ? (
        <p className="text-sm text-gray-400 py-4">Aucun signalement pour ces filtres.</p>
      ) : (
        <div className="space-y-2">
          {reports.data.map(report => {
            const isStale = report.questionnaire_version !== QUESTIONNAIRE_VERSION;
            const stats = healthByQuestion.get(report.question_id);
            return (
              <div key={report.id} className="border border-gray-100 rounded-xl p-3 bg-white">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="font-semibold text-gray-800 text-sm">{report.question_id}</span>
                  <span className={`text-[11px] px-2 py-0.5 rounded-full border ${STATUS_COLORS[report.status]}`}>
                    {STATUS_LABELS[report.status] ?? report.status}
                  </span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full border border-gray-200 text-gray-600">
                    {CATEGORY_LABELS[report.category] ?? report.category}
                  </span>
                  {isStale && (
                    <span className="text-[11px] px-2 py-0.5 rounded-full border border-purple-200 bg-purple-50 text-purple-700">
                      version {report.questionnaire_version} (ancienne)
                    </span>
                  )}
                  {report.fixed_in_version && (
                    <span className="text-[11px] text-green-600">
                      corrigé en {report.fixed_in_version}
                    </span>
                  )}
                  <span className="text-[11px] text-gray-400 ml-auto">
                    {new Date(report.created_at).toLocaleDateString('fr-FR')}
                  </span>
                </div>

                {report.comment && (
                  <p className="text-sm text-gray-600 italic mb-2 pl-2 border-l-2 border-gray-200">
                    « {report.comment} »
                  </p>
                )}

                {stats && (
                  <p className="text-[11px] text-gray-400 mb-2">
                    {stats.shown_count} vues · médiane {seconds(stats.dwell_median_ms)} ·
                    {' '}sans opinion {percent(stats.no_opinion_rate)}
                  </p>
                )}

                <div className="flex flex-wrap gap-1.5">
                  {['triaged', 'confirmed', 'fixed', 'rejected'].map(status => (
                    <button
                      key={status}
                      disabled={busyId === report.id || report.status === status}
                      onClick={() => updateStatus(report.id, status)}
                      className={`text-xs px-2.5 py-1 rounded-lg border transition-colors ${
                        report.status === status
                          ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-default'
                          : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {STATUS_LABELS[status]}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
