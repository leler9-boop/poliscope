/**
 * CompareBar — Dual-marker axis comparison.
 *
 * Shows USER and TARGET positions on a shared 0–100 ideological spectrum.
 * A dot at each position; the gap between dots = political distance.
 * Theme color identifies the theme, not the person.
 *
 * Exports:
 *   CompareBar            — single theme row, user vs. one target
 *   CompareBarThree       — single theme row, user vs. two targets
 *   AutoInsights          — auto-generated top agreements / divergences
 *   ThemeComparison       — all 8 themes + insights, user vs. one target
 *   ThemeComparisonThree  — all 8 themes + insights, user vs. two targets
 */

import React from 'react';
import { motion } from 'motion/react';
import { THEMES_ORDER, THEME_LABELS, THEME_COLORS } from '../data/questions.js';

// ── Diff helpers ───────────────────────────────────────────────────────────────

function diffColor(diff) {
  if (diff < 12) return '#16a34a';
  if (diff < 28) return '#2563eb';
  if (diff < 45) return '#d97706';
  return '#dc2626';
}

function diffBg(diff) {
  if (diff < 12) return '#f0fdf4';
  if (diff < 28) return '#eff6ff';
  if (diff < 45) return '#fffbeb';
  return '#fef2f2';
}

function diffLabel(diff, language) {
  if (diff < 12) return language === 'fr' ? 'Très proches' : 'Very similar';
  if (diff < 28) return language === 'fr' ? 'Proches' : 'Close';
  if (diff < 45) return language === 'fr' ? 'Différence modérée' : 'Moderate';
  return language === 'fr' ? 'Désaccord marqué' : 'Strong gap';
}

// ── Axis pole labels ───────────────────────────────────────────────────────────

const THEME_AXES = {
  ECONOMY:         { en: { left: 'Redistribution', right: 'Free market'    }, fr: { left: 'Redistribution', right: 'Marché libre'   } },
  SOCIAL:          { en: { left: 'Traditional',    right: 'Progressive'    }, fr: { left: 'Traditionnel',   right: 'Progressiste'   } },
  IMMIGRATION:     { en: { left: 'Restrictive',    right: 'Open'           }, fr: { left: 'Restrictif',     right: 'Ouvert'         } },
  SECURITY:        { en: { left: 'State security', right: 'Civil liberties'}, fr: { left: 'Sécurité',       right: 'Libertés'       } },
  ENVIRONMENT:     { en: { left: 'Growth first',   right: 'Ecology'        }, fr: { left: 'Croissance',     right: 'Écologie'       } },
  DEMOCRACY:       { en: { left: 'Strong state',   right: 'Participative'  }, fr: { left: 'État fort',      right: 'Participatif'   } },
  GLOBAL:          { en: { left: 'Sovereignty',    right: 'Multilateral'   }, fr: { left: 'Souveraineté',   right: 'Multilatéral'   } },
  PUBLIC_SERVICES: { en: { left: 'Private',        right: 'Public services'}, fr: { left: 'Privé',          right: 'Services publics'} },
};

// ── USER marker (dark square) ──────────────────────────────────────────────────

function UserMarker({ position, delay }) {
  return (
    <motion.div
      className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-sm bg-slate-800 z-20 shadow-sm"
      initial={{ left: '50%', opacity: 0, scale: 0.5 }}
      animate={{ left: `${position}%`, opacity: 1, scale: 1 }}
      transition={{ duration: 0.85, delay, ease: [0.34, 1.12, 0.64, 1] }}
    />
  );
}

// ── TARGET marker (outlined circle) ────────────────────────────────────────────

function TargetMarker({ position, color, delay, diamond = false }) {
  if (diamond) {
    return (
      <motion.div
        className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 border-2 bg-white z-10 shadow-sm"
        style={{ borderColor: color, transform: 'translateX(-50%) translateY(-50%) rotate(45deg)' }}
        initial={{ left: '50%', opacity: 0 }}
        animate={{ left: `${position}%`, opacity: 0.85 }}
        transition={{ duration: 0.85, delay, ease: [0.34, 1.12, 0.64, 1] }}
      />
    );
  }
  return (
    <motion.div
      className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 bg-white z-10 shadow-sm"
      style={{ borderColor: color }}
      initial={{ left: '50%', opacity: 0, scale: 0.5 }}
      animate={{ left: `${position}%`, opacity: 1, scale: 1 }}
      transition={{ duration: 0.85, delay, ease: [0.34, 1.12, 0.64, 1] }}
    />
  );
}

// ── CompareBar ─────────────────────────────────────────────────────────────────
// Single theme row: user vs. one target.

export function CompareBar({
  themeLabel, themeColor, leftPole, rightPole,
  userScore, targetScore, targetName,
  language, delay = 0, policyText = null,
}) {
  const u    = Math.round(userScore ?? 50);
  const t    = Math.round(targetScore ?? 50);
  const diff = Math.abs(u - t);
  const hasUser = userScore != null;
  const youLabel = language === 'fr' ? 'Vous' : 'You';

  return (
    <div className="py-3 last:pb-0">
      {/* Header: theme label + diff badge */}
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: themeColor }} />
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            {themeLabel}
          </span>
        </div>
        {hasUser && (
          <span
            className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: diffBg(diff), color: diffColor(diff) }}
          >
            Δ {diff} · {diffLabel(diff, language)}
          </span>
        )}
      </div>

      {/* Track */}
      <div className="relative h-2 bg-slate-100 rounded-full">
        {/* Center tick */}
        <div className="absolute inset-y-0 w-px bg-slate-200" style={{ left: '50%' }} />

        {/* Gap fill — colored zone between the two markers */}
        {hasUser && diff > 0 && (
          <motion.div
            className="absolute inset-y-0 rounded-full"
            style={{
              backgroundColor: themeColor,
              opacity: 0.12,
              left: `${Math.min(u, t)}%`,
              width: `${diff}%`,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.12 }}
            transition={{ delay: delay + 0.6, duration: 0.4 }}
          />
        )}

        {/* USER marker */}
        {hasUser && <UserMarker position={u} delay={delay} />}

        {/* TARGET marker */}
        <TargetMarker position={t} color={themeColor} delay={hasUser ? delay + 0.12 : delay} />
      </div>

      {/* Pole labels + Legend */}
      <div className="flex items-center justify-between mt-2">
        <span className="text-[9px] text-slate-300 flex-shrink-0 hidden sm:block">{leftPole}</span>
        <div className="flex items-center gap-3 flex-wrap">
          {hasUser && (
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-sm bg-slate-800 flex-shrink-0" />
              <span className="text-[10px] text-slate-600 font-medium">
                {youLabel} <span className="font-bold tabular-nums">{u}</span>
              </span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <span
              className="w-2.5 h-2.5 rounded-full border-2 bg-white flex-shrink-0"
              style={{ borderColor: themeColor }}
            />
            <span className="text-[10px] font-medium" style={{ color: themeColor }}>
              {targetName} <span className="font-bold tabular-nums">{t}</span>
            </span>
          </div>
        </div>
        <span className="text-[9px] text-slate-300 flex-shrink-0 hidden sm:block">{rightPole}</span>
      </div>

      {/* Pole labels — mobile only, below legend */}
      <div className="flex justify-between mt-0.5 sm:hidden">
        <span className="text-[9px] text-slate-300">{leftPole}</span>
        <span className="text-[9px] text-slate-300">{rightPole}</span>
      </div>

      {/* Optional policy text (shows when positions are close) */}
      {policyText && (
        <motion.p
          className="text-xs text-gray-500 leading-relaxed mt-2 pl-3 border-l-2 border-gray-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.9 }}
        >
          {policyText}
        </motion.p>
      )}
    </div>
  );
}

// ── CompareBarThree ────────────────────────────────────────────────────────────
// Single theme row: user vs. two targets.

export function CompareBarThree({
  themeLabel, themeColor, leftPole, rightPole,
  userScore, score1, score2, name1, name2,
  language, delay = 0,
}) {
  const u    = Math.round(userScore ?? 50);
  const s1   = Math.round(score1 ?? 50);
  const s2   = Math.round(score2 ?? 50);
  const diff = Math.abs(s1 - s2);
  const hasUser = userScore != null;
  const youLabel = language === 'fr' ? 'Vous' : 'You';

  const n1short = name1.split(' ').pop();
  const n2short = name2.split(' ').pop();

  return (
    <div className="py-3 last:pb-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: themeColor }} />
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            {themeLabel}
          </span>
        </div>
        <span
          className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
          style={{ backgroundColor: diffBg(diff), color: diffColor(diff) }}
        >
          {n1short} vs {n2short} Δ {diff}
        </span>
      </div>

      {/* Track */}
      <div className="relative h-2 bg-slate-100 rounded-full">
        <div className="absolute inset-y-0 w-px bg-slate-200" style={{ left: '50%' }} />

        {/* USER marker */}
        {hasUser && <UserMarker position={u} delay={delay} />}

        {/* Candidate 1 marker (circle) */}
        <TargetMarker position={s1} color={themeColor} delay={delay + 0.12} />

        {/* Candidate 2 marker (diamond) */}
        <TargetMarker position={s2} color={themeColor} delay={delay + 0.22} diamond />
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between mt-2">
        <span className="text-[9px] text-slate-300 flex-shrink-0 hidden sm:block">{leftPole}</span>
        <div className="flex items-center gap-3 flex-wrap">
          {hasUser && (
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-sm bg-slate-800 flex-shrink-0" />
              <span className="text-[10px] text-slate-600 font-bold tabular-nums">{u}</span>
              <span className="text-[9px] text-slate-400">{youLabel}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full border-2 bg-white flex-shrink-0" style={{ borderColor: themeColor }} />
            <span className="text-[10px] font-bold tabular-nums" style={{ color: themeColor }}>{s1}</span>
            <span className="text-[9px]" style={{ color: themeColor }}>{n1short}</span>
          </div>
          <div className="flex items-center gap-1">
            <span
              className="w-2.5 h-2.5 border-2 bg-white flex-shrink-0"
              style={{ borderColor: themeColor, transform: 'rotate(45deg)', opacity: 0.8 }}
            />
            <span className="text-[10px] font-bold tabular-nums" style={{ color: themeColor, opacity: 0.85 }}>{s2}</span>
            <span className="text-[9px]" style={{ color: themeColor, opacity: 0.85 }}>{n2short}</span>
          </div>
        </div>
        <span className="text-[9px] text-slate-300 flex-shrink-0 hidden sm:block">{rightPole}</span>
      </div>

      {/* Pole labels mobile */}
      <div className="flex justify-between mt-0.5 sm:hidden">
        <span className="text-[9px] text-slate-300">{leftPole}</span>
        <span className="text-[9px] text-slate-300">{rightPole}</span>
      </div>
    </div>
  );
}

// ── AutoInsights ───────────────────────────────────────────────────────────────

export function AutoInsights({ userThemes, targetThemes, targetName, language }) {
  const sorted = THEMES_ORDER
    .map(theme => ({
      theme,
      label: THEME_LABELS[language]?.[theme] ?? theme,
      diff: Math.abs((userThemes[theme] ?? 50) - (targetThemes[theme] ?? 50)),
    }))
    .sort((a, b) => a.diff - b.diff);

  const agreements  = sorted.slice(0, 2);
  const divergences = sorted.slice(-2).reverse();

  return (
    <div className="mt-4 pt-4 border-t border-slate-100 space-y-1.5">
      <div className="flex items-start gap-2">
        <span className="text-green-500 text-xs mt-0.5 flex-shrink-0">✓</span>
        <p className="text-[11px] text-slate-500 leading-relaxed">
          <span className="font-semibold text-green-700">
            {language === 'fr' ? 'Plus grands accords :' : 'Closest views:'}
          </span>
          {' '}{agreements.map(a => `${a.label} (Δ${a.diff})`).join(', ')}
        </p>
      </div>
      <div className="flex items-start gap-2">
        <span className="text-red-400 text-xs mt-0.5 flex-shrink-0">✗</span>
        <p className="text-[11px] text-slate-500 leading-relaxed">
          <span className="font-semibold text-red-600">
            {language === 'fr' ? 'Plus grandes différences :' : 'Biggest gaps:'}
          </span>
          {' '}{divergences.map(d => `${d.label} (Δ${d.diff})`).join(', ')}
        </p>
      </div>
    </div>
  );
}

// ── ThemeComparison ────────────────────────────────────────────────────────────
// All 8 themes + insights. User vs. one target.

export function ThemeComparison({
  userThemes, targetThemes, targetName,
  language, card = true, policyTexts = {},
}) {
  const rows = THEMES_ORDER.map((theme, idx) => {
    const themeLabel = THEME_LABELS[language]?.[theme] ?? theme;
    const themeColor = THEME_COLORS[theme] ?? '#6b7280';
    const poles      = THEME_AXES[theme]?.[language] ?? THEME_AXES[theme]?.en ?? {};
    return (
      <CompareBar
        key={theme}
        themeLabel={themeLabel}
        themeColor={themeColor}
        leftPole={poles.left}
        rightPole={poles.right}
        userScore={userThemes?.[theme]}
        targetScore={targetThemes?.[theme]}
        targetName={targetName}
        language={language}
        delay={0.05 + idx * 0.04}
        policyText={policyTexts[theme] ?? null}
      />
    );
  });

  const insights = userThemes && targetThemes ? (
    <AutoInsights
      userThemes={userThemes}
      targetThemes={targetThemes}
      targetName={targetName}
      language={language}
    />
  ) : null;

  if (!card) {
    return (
      <div className="divide-y divide-slate-50">
        {rows}
        {insights}
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 divide-y divide-slate-50">
      {rows}
      {insights}
    </div>
  );
}

// ── ThemeComparisonThree ───────────────────────────────────────────────────────
// All 8 themes + insights. User vs. two targets.

export function ThemeComparisonThree({
  userThemes, themes1, themes2, name1, name2, language,
}) {
  const n1short = name1.split(' ').pop();
  const n2short = name2.split(' ').pop();

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 divide-y divide-slate-50">
      {THEMES_ORDER.map((theme, idx) => {
        const themeLabel = THEME_LABELS[language]?.[theme] ?? theme;
        const themeColor = THEME_COLORS[theme] ?? '#6b7280';
        const poles      = THEME_AXES[theme]?.[language] ?? THEME_AXES[theme]?.en ?? {};
        return (
          <CompareBarThree
            key={theme}
            themeLabel={themeLabel}
            themeColor={themeColor}
            leftPole={poles.left}
            rightPole={poles.right}
            userScore={userThemes?.[theme]}
            score1={themes1?.[theme]}
            score2={themes2?.[theme]}
            name1={name1}
            name2={name2}
            language={language}
            delay={0.05 + idx * 0.04}
          />
        );
      })}

      {/* Insights block */}
      {userThemes && (themes1 || themes2) && (
        <div className="pt-4 space-y-4">
          {themes1 && (
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                {language === 'fr' ? `Vous vs ${n1short}` : `You vs ${n1short}`}
              </p>
              <AutoInsights userThemes={userThemes} targetThemes={themes1} targetName={n1short} language={language} />
            </div>
          )}
          {themes2 && (
            <div className="border-t border-slate-50 pt-4">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                {language === 'fr' ? `Vous vs ${n2short}` : `You vs ${n2short}`}
              </p>
              <AutoInsights userThemes={userThemes} targetThemes={themes2} targetName={n2short} language={language} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default CompareBar;
