/**
 * CompareBar — Dual-row axis comparison.
 *
 * DESIGN RATIONALE:
 * Previous design: two markers on ONE shared track → markers overlap, confusing.
 * New design: TWO SEPARATE rows — one for "Vous", one for the target.
 * User understands position at a glance without decoding overlapping symbols.
 *
 * Layout per theme:
 *   ÉCONOMIE                              Δ 9 · Très proches
 *   Vous         ──────────────●────────  54
 *   Gabriel Attal ─────────────────●───── 63
 *
 * Exports:
 *   CompareBar            — single theme, user vs. one target
 *   CompareBarThree       — single theme, user vs. two targets (3-row layout)
 *   AutoInsights          — top agreements / divergences
 *   ThemeComparison       — all 8 themes, user vs. one target
 *   ThemeComparisonThree  — all 8 themes, user vs. two targets
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
  if (diff < 45) return language === 'fr' ? 'Différence notable' : 'Notable gap';
  return language === 'fr' ? 'Désaccord marqué' : 'Strong gap';
}

// ── Axis pole labels ───────────────────────────────────────────────────────────

const THEME_AXES = {
  ECONOMY:         { en: { left: 'Redistribution', right: 'Free market'    }, fr: { left: 'Redistribution', right: 'Marché libre'   } },
  SOCIAL:          { en: { left: 'Traditional',    right: 'Progressive'    }, fr: { left: 'Traditionnel',   right: 'Progressiste'   } },
  IMMIGRATION:     { en: { left: 'Open',           right: 'Restrictive'    }, fr: { left: 'Ouvert',         right: 'Restrictif'     } },
  SECURITY:        { en: { left: 'Civil liberties', right: 'Law & order'   }, fr: { left: 'Libertés',       right: 'Sécurité'       } },
  ENVIRONMENT:     { en: { left: 'Growth first',   right: 'Ecology'        }, fr: { left: 'Croissance',     right: 'Écologie'       } },
  DEMOCRACY:       { en: { left: 'Strong state',   right: 'Participative'  }, fr: { left: 'État fort',      right: 'Participatif'   } },
  GLOBAL:          { en: { left: 'Sovereignty',    right: 'Multilateral'   }, fr: { left: 'Souveraineté',   right: 'Multilatéral'   } },
  PUBLIC_SERVICES: { en: { left: 'Private',        right: 'Public services'}, fr: { left: 'Privé',          right: 'Services publics'} },
};

// ── ScoreRow — one labeled bar ─────────────────────────────────────────────────
// label | ════════════════●══════════ | score

function ScoreRow({ label, score, color, isUser = false, delay = 0, showPoles = false, leftPole, rightPole, language }) {
  const pct = Math.round(score ?? 50);

  return (
    <div>
      {showPoles && (
        <div className="flex justify-between mb-0.5">
          <span className="text-[9px] text-slate-300 hidden sm:block">{leftPole}</span>
          <span className="text-[9px] text-slate-300 hidden sm:block">{rightPole}</span>
        </div>
      )}
      <div className="flex items-center gap-2.5">
        {/* Label */}
        <span
          className={`text-[11px] w-[90px] flex-shrink-0 truncate font-medium ${isUser ? 'text-slate-700' : ''}`}
          style={{ color: isUser ? '#334155' : color }}
        >
          {label}
        </span>

        {/* Track */}
        <div className="relative flex-1 h-[5px] bg-slate-100 rounded-full">
          {/* Fill from left to marker */}
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full"
            style={{ backgroundColor: isUser ? '#334155' : color, opacity: isUser ? 0.35 : 0.22 }}
            initial={{ width: '50%' }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.8, delay, ease: [0.34, 1.12, 0.64, 1] }}
          />

          {/* Marker dot */}
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full shadow-sm"
            style={{
              width: isUser ? 11 : 11,
              height: isUser ? 11 : 11,
              backgroundColor: isUser ? '#1e293b' : 'white',
              border: isUser ? 'none' : `2.5px solid ${color}`,
            }}
            initial={{ left: '50%', opacity: 0, scale: 0.4 }}
            animate={{ left: `${pct}%`, opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay, ease: [0.34, 1.12, 0.64, 1] }}
          />
        </div>

        {/* Score */}
        <span
          className="text-[12px] font-bold tabular-nums w-[26px] text-right flex-shrink-0"
          style={{ color: isUser ? '#334155' : color }}
        >
          {pct}
        </span>
      </div>
      {showPoles && (
        <div className="flex justify-between mt-0.5 sm:hidden">
          <span className="text-[9px] text-slate-300">{leftPole}</span>
          <span className="text-[9px] text-slate-300">{rightPole}</span>
        </div>
      )}
    </div>
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
      <div className="flex items-center justify-between mb-2">
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

      {/* Two rows */}
      <div className="space-y-2">
        {hasUser && (
          <ScoreRow
            label={youLabel}
            score={u}
            color={themeColor}
            isUser
            delay={delay}
            showPoles
            leftPole={leftPole}
            rightPole={rightPole}
            language={language}
          />
        )}
        <ScoreRow
          label={targetName}
          score={t}
          color={themeColor}
          isUser={false}
          delay={hasUser ? delay + 0.1 : delay}
          showPoles={!hasUser}
          leftPole={leftPole}
          rightPole={rightPole}
          language={language}
        />
      </div>

      {/* Optional policy text */}
      {policyText && (
        <motion.p
          className="text-xs text-gray-500 leading-relaxed mt-2.5 pl-3 border-l-2 border-gray-200"
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
// Three rows: Vous / Candidat 1 / Candidat 2

export function CompareBarThree({
  themeLabel, themeColor, leftPole, rightPole,
  userScore, score1, score2, name1, name2,
  language, delay = 0,
}) {
  const u  = Math.round(userScore ?? 50);
  const s1 = Math.round(score1 ?? 50);
  const s2 = Math.round(score2 ?? 50);
  const hasUser = userScore != null;

  const n1short = name1.split(' ').pop();
  const n2short = name2.split(' ').pop();
  const youLabel = language === 'fr' ? 'Vous' : 'You';

  const diff12 = Math.abs(s1 - s2);

  // Second color: slightly muted version of the theme color
  const color2 = themeColor + 'bb';

  return (
    <div className="py-3 last:pb-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: themeColor }} />
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            {themeLabel}
          </span>
        </div>
        <span
          className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
          style={{ backgroundColor: diffBg(diff12), color: diffColor(diff12) }}
        >
          {n1short} vs {n2short} · Δ {diff12}
        </span>
      </div>

      {/* Three rows */}
      <div className="space-y-2">
        {hasUser && (
          <ScoreRow
            label={youLabel}
            score={u}
            color={themeColor}
            isUser
            delay={delay}
            showPoles
            leftPole={leftPole}
            rightPole={rightPole}
            language={language}
          />
        )}
        <ScoreRow
          label={n1short}
          score={s1}
          color={themeColor}
          isUser={false}
          delay={delay + 0.08}
          showPoles={!hasUser}
          leftPole={leftPole}
          rightPole={rightPole}
          language={language}
        />
        <ScoreRow
          label={n2short}
          score={s2}
          color={color2}
          isUser={false}
          delay={delay + 0.16}
          language={language}
        />
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

      {/* Insights */}
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
