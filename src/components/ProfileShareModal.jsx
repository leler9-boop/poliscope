/**
 * ProfileShareModal — Share Card V4
 *
 * Design principles:
 *  - Treat the card as a SOCIAL OBJECT, not a UI component
 *  - Spotify Wrapped × Apple Design: premium, modern, youth-first
 *  - 3-second rule: WHO AM I → HOW RELIABLE → HOW RARE → WHO AM I CLOSE TO → MY DNA
 *  - Viral hooks: rarity badge, huge match %, political signature, confidence signal
 *  - Dual-color system: archetype color (identity) + candidate color (match)
 *
 * V4 changes vs V3:
 *  1. Confidence/reliability module — signal-strength bars + label + answer count
 *  2. DNA labels — readable abbreviations instead of cryptic É S I Sé Ec D M P
 *  3. DNA section header — "TA SIGNATURE POLITIQUE" with flanking decorative lines
 *  4. Match % untouched — still 64px, 900w, candidateColor glow
 *  5. Rarity block — "PROFIL RARE" pill + "Seulement X% des Français" detail line
 */

import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { getRarityLine, ARCHETYPE_RARITY } from '../data/archetypeRarity.js';
import { THEME_COLORS, THEMES_ORDER } from '../data/questions.js';
import { trackProfileShared, trackProfileDownloaded, trackShareModalOpened } from '../lib/analytics.js';

const canNativeShare = typeof navigator !== 'undefined' && !!navigator.share;

// ── Colour helpers ──────────────────────────────────────────────────────────

function hexAlpha(hex, alpha) {
  if (!hex || hex.length < 7) return `rgba(37,99,235,${alpha})`;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

// Lighten a hex color by mixing with white at `ratio` (0 = original, 1 = white)
function lightenHex(hex, ratio) {
  if (!hex || hex.length < 7) return hex;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const R = Math.round(r + (255 - r) * ratio);
  const G = Math.round(g + (255 - g) * ratio);
  const B = Math.round(b + (255 - b) * ratio);
  return `#${R.toString(16).padStart(2, '0')}${G.toString(16).padStart(2, '0')}${B.toString(16).padStart(2, '0')}`;
}

// ── Theme label helpers ─────────────────────────────────────────────────────
// V4: readable 3–4 char abbreviations replace single cryptic initials (É S I Sé Ec D M P)

const THEME_ABBR_FR = {
  ECONOMY:        'Éco',
  SOCIAL:         'Soc',
  IMMIGRATION:    'Imm',
  SECURITY:       'Séc',
  ENVIRONMENT:    'Écol',
  DEMOCRACY:      'Dém',
  GLOBAL:         'Dipl',
  PUBLIC_SERVICES:'Prot',
};
const THEME_ABBR_EN = {
  ECONOMY:        'Eco',
  SOCIAL:         'Soc',
  IMMIGRATION:    'Imm',
  SECURITY:       'Sec',
  ENVIRONMENT:    'Ecol',
  DEMOCRACY:      'Dem',
  GLOBAL:         'Dipl',
  PUBLIC_SERVICES:'Prot',
};

// ── Confidence helpers ──────────────────────────────────────────────────────
// V4 NEW: wire up the answeredCount prop that V3 received but never displayed

// Calibrated against quiz max (64 questions for Approfondi/deep mode).
// discovery(16q) → 2 bars, standard(32q) → 4 bars, deep(64q) → 5 bars.
// Intermediate thresholds handle improve-mode and partial completions.
function getConfidenceLevel(answeredCount, lang) {
  const n = answeredCount ?? 0;
  if (n >= 64) return { label: lang === 'fr' ? 'Profil très fiable'   : 'Highly reliable profile', bars: 5 };
  if (n >= 32) return { label: lang === 'fr' ? 'Profil robuste'       : 'Robust profile',          bars: 4 };
  if (n >= 24) return { label: lang === 'fr' ? 'Profil en cours'      : 'Profile building',        bars: 3 };
  if (n >= 16) return { label: lang === 'fr' ? 'Première estimation'  : 'First estimation',        bars: 2 };
  return               { label: lang === 'fr' ? 'Profil en cours'     : 'Profile in progress',     bars: 1 };
}

// ── Viral data helpers ──────────────────────────────────────────────────────

/**
 * Find the theme where the user has the strongest position (furthest from 50).
 * Returns { theme, score, label } or null if no clear signature.
 */
function getSignaturePosition(themes, lang) {
  if (!themes) return null;
  let maxDist = 0, maxTheme = null, maxScore = 50;
  Object.entries(themes).forEach(([theme, score]) => {
    const dist = Math.abs(score - 50);
    if (dist > maxDist) { maxDist = dist; maxTheme = theme; maxScore = score; }
  });
  if (!maxTheme || maxDist < 18) return null;

  const isRight = maxScore >= 50;
  const POLE = {
    fr: {
      ECONOMY: ['État fort', 'Libéral·e'],
      SOCIAL: ['Conservateur·rice', 'Progressiste'],
      IMMIGRATION: ['Ouvert·e', 'Restrictif·ve'],
      SECURITY: ['Libertés civiles', 'Ordre et sécurité'],
      ENVIRONMENT: ['Croissance d\'abord', 'Écologiste'],
      DEMOCRACY: ['Autorité forte', 'Démocratie'],
      GLOBAL: ['Souverainiste', 'Mondialiste'],
      PUBLIC_SERVICES: ['État minimal', 'État protecteur'],
    },
    en: {
      ECONOMY: ['Statist', 'Liberal'],
      SOCIAL: ['Conservative', 'Progressive'],
      IMMIGRATION: ['Open borders', 'Restrictive'],
      SECURITY: ['Civil liberties', 'Law & order'],
      ENVIRONMENT: ['Growth first', 'Ecologist'],
      DEMOCRACY: ['Strong authority', 'Democrat'],
      GLOBAL: ['Sovereignist', 'Globalist'],
      PUBLIC_SERVICES: ['Minimal state', 'Welfare state'],
    },
  };
  const label = POLE[lang]?.[maxTheme]?.[isRight ? 1 : 0];
  return label ? { theme: maxTheme, label } : null;
}

// ── Component ──────────────────────────────────────────────────────────────

export default function ProfileShareModal({
  themes,
  topArchetype,
  rankedCandidates,
  language,
  answeredCount = 0,
  totalCount = 120,
  shareUrl,
  onClose,
}) {
  const cardRef = useRef(null);
  const [copyStatus,     setCopyStatus]     = useState(null);
  const [downloadStatus, setDownloadStatus] = useState(null);
  const [shareStatus,    setShareStatus]    = useState(null);

  // Track modal open intent (fires once on mount)
  useEffect(() => {
    trackShareModalOpened({ archetypeId: topArchetype?.id ?? null });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const lang           = language === 'fr' ? 'fr' : 'en';
  const accentColor    = topArchetype?.color ?? '#2563eb';
  const topCandidate   = rankedCandidates?.[0] ?? null;
  const candidateColor = topCandidate?.color ?? accentColor;

  // Rarity
  const rarityLine  = topArchetype?.id ? getRarityLine(topArchetype.id, lang) : '';
  const rarityPct   = topArchetype?.id ? (ARCHETYPE_RARITY[topArchetype.id] ?? null) : null;
  const isUltraRare = rarityPct != null && rarityPct <= 2;
  const isRare      = rarityPct != null && rarityPct <= 5;

  // Confidence (V4 NEW — answers answeredCount prop that was previously unused)
  const confidenceLevel = getConfidenceLevel(answeredCount, lang);

  // Signature position
  const signature = getSignaturePosition(themes, lang);

  // Archetype
  const archName = topArchetype?.name?.[lang] ?? topArchetype?.name?.fr
    ?? (lang === 'fr' ? 'Profil en cours…' : 'Profile in progress…');
  const traits = topArchetype?.traits?.[lang] ?? topArchetype?.traits?.fr ?? [];

  const resolvedShareUrl = shareUrl ?? 'https://poliscop.org';

  // V4: readable abbreviations for DNA labels
  const themeAbbr = lang === 'fr' ? THEME_ABBR_FR : THEME_ABBR_EN;

  // ── Handlers ─────────────────────────────────────────────────────────────

  const handleNativeShare = async () => {
    if (!canNativeShare) return;
    setShareStatus('sharing');
    try {
      await navigator.share({
        title: lang === 'fr' ? 'Mon profil politique – Poliscop 2027' : 'My political profile – Poliscop 2027',
        text:  lang === 'fr' ? 'Découvre mon archétype politique →' : 'Discover my political archetype →',
        url:   resolvedShareUrl,
      });
      setShareStatus('done');
      setTimeout(() => setShareStatus(null), 2500);
      trackProfileShared({
        method:                  'native',
        archetypeId:             topArchetype?.id ?? null,
        topCandidateId:          topCandidate?.id ?? null,
        topCandidateAlignment:   topCandidate?.alignment ?? null,
      });
    } catch { setShareStatus(null); }
  };

  const handleCopyLink = async () => {
    try { await navigator.clipboard.writeText(resolvedShareUrl); } catch { /* silent */ }
    setCopyStatus('copied');
    setTimeout(() => setCopyStatus(null), 2500);
    trackProfileShared({
      method:                'copy',
      archetypeId:           topArchetype?.id ?? null,
      topCandidateId:        topCandidate?.id ?? null,
      topCandidateAlignment: topCandidate?.alignment ?? null,
    });
  };

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setDownloadStatus('loading');
    try {
      const { toPng } = await import('html-to-image');
      const dataUrl = await toPng(cardRef.current, {
        quality: 1,
        pixelRatio: 3,   // 3× for Instagram Story quality
        backgroundColor: '#050810',
      });
      const link = document.createElement('a');
      link.download = 'poliscop-profil.png';
      link.href = dataUrl;
      link.click();
      setDownloadStatus('done');
      setTimeout(() => setDownloadStatus(null), 2500);
      trackProfileDownloaded({ archetypeId: topArchetype?.id ?? null });
      trackProfileShared({
        method:                'download',
        archetypeId:           topArchetype?.id ?? null,
        topCandidateId:        topCandidate?.id ?? null,
        topCandidateAlignment: topCandidate?.alignment ?? null,
      });
    } catch {
      setDownloadStatus('error');
      setTimeout(() => setDownloadStatus(null), 2500);
    }
  };

  // ── Card visual system ────────────────────────────────────────────────────
  //
  // Dual-color scheme: archetype color anchors identity (top-left),
  // candidate color anchors the match result (bottom-right).
  // Where they meet in the middle = the user's political "intersection".

  const bg = [
    `radial-gradient(ellipse at -8% -4%, ${hexAlpha(accentColor, 0.42)} 0%, transparent 52%)`,
    `radial-gradient(ellipse at 106% 106%, ${hexAlpha(candidateColor, 0.30)} 0%, transparent 48%)`,
    '#050810',
  ].join(', ');

  // The gradient accent stripe at the very top
  const accentStripe = `linear-gradient(90deg, ${accentColor} 0%, ${lightenHex(candidateColor, 0.1)} 100%)`;

  // ── DNA bars data ─────────────────────────────────────────────────────────
  const DNA_HEIGHT = 52;   // px, max bar height

  return (
    <motion.div
      className="fixed inset-0 z-50 overflow-y-auto"
      style={{ backgroundColor: 'rgba(0,0,0,0.80)', backdropFilter: 'blur(12px)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      onClick={onClose}
    >
      <div className="flex min-h-full items-start sm:items-center justify-center p-4 py-6">
        <motion.div
          className="w-full max-w-sm flex flex-col gap-3"
          initial={{ scale: 0.86, opacity: 0, y: 32 }}
          animate={{ scale: 1,    opacity: 1, y: 0 }}
          exit={{ scale: 0.93,    opacity: 0, y: 16 }}
          transition={{ duration: 0.40, ease: [0.34, 1.08, 0.64, 1] }}
          onClick={e => e.stopPropagation()}
        >

          {/* ── Action buttons — ABOVE card, always visible ── */}
          <div className="flex flex-col gap-2.5">

            {/* Primary: native share or copy link */}
            {canNativeShare ? (
              <motion.button
                onClick={handleNativeShare}
                className="w-full flex items-center justify-center gap-2.5 font-bold min-h-[54px] rounded-2xl text-sm"
                style={{ backgroundColor: accentColor, color: '#ffffff' }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.13 }}
              >
                <span style={{ fontSize: 16 }}>{shareStatus === 'done' ? '✓' : '↗'}</span>
                {shareStatus === 'done'
                  ? (lang === 'fr' ? 'Partagé !' : 'Shared!')
                  : (lang === 'fr' ? 'Partager mon profil' : 'Share my profile')}
              </motion.button>
            ) : (
              <motion.button
                onClick={handleCopyLink}
                className="w-full flex items-center justify-center gap-2.5 bg-white text-gray-900 font-bold min-h-[54px] rounded-2xl text-sm"
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.13 }}
              >
                <span>{copyStatus === 'copied' ? '✓' : '🔗'}</span>
                {copyStatus === 'copied'
                  ? (lang === 'fr' ? 'Lien copié !' : 'Link copied!')
                  : (lang === 'fr' ? 'Copier le lien' : 'Copy link')}
              </motion.button>
            )}

            {/* Secondary: download image + copy link (if native share available) */}
            <div className="flex gap-2.5">
              <motion.button
                onClick={handleDownload}
                className="flex-1 flex items-center justify-center gap-2 font-semibold min-h-[46px] rounded-2xl text-sm border"
                style={{ backgroundColor: 'rgba(255,255,255,0.07)', borderColor: 'rgba(255,255,255,0.14)', color: 'rgba(255,255,255,0.88)' }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.13 }}
              >
                {downloadStatus === 'loading' ? <span className="text-xs opacity-60">…</span>
                 : downloadStatus === 'done'  ? '✓'
                 : downloadStatus === 'error' ? '✗'
                 : <span style={{ fontSize: 13 }}>↓</span>}
                <span>
                  {downloadStatus === 'loading' ? (lang === 'fr' ? 'Export…'        : 'Exporting…')
                   : downloadStatus === 'done'  ? (lang === 'fr' ? 'Téléchargé !'   : 'Downloaded!')
                   : downloadStatus === 'error' ? (lang === 'fr' ? 'Erreur'         : 'Error')
                   :                              (lang === 'fr' ? 'Sauvegarder'    : 'Save image')}
                </span>
              </motion.button>

              {canNativeShare && (
                <motion.button
                  onClick={handleCopyLink}
                  className="flex-1 flex items-center justify-center gap-2 font-semibold min-h-[46px] rounded-2xl text-sm border"
                  style={{ backgroundColor: 'rgba(255,255,255,0.07)', borderColor: 'rgba(255,255,255,0.14)', color: 'rgba(255,255,255,0.88)' }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.13 }}
                >
                  {copyStatus === 'copied' ? '✓' : '🔗'}
                  <span>
                    {copyStatus === 'copied'
                      ? (lang === 'fr' ? 'Lien copié !' : 'Link copied!')
                      : (lang === 'fr' ? 'Copier lien'  : 'Copy link')}
                  </span>
                </motion.button>
              )}
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════
              SHARE CARD V4 — social object
              All styles are inline (required for html-to-image compatibility).
              No Tailwind classes inside cardRef.
          ══════════════════════════════════════════════════════════════ */}
          <div
            ref={cardRef}
            style={{
              background: bg,
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", system-ui, sans-serif',
              borderRadius: 24,
              overflow: 'hidden',
              width: '100%',
            }}
          >

            {/* Top accent stripe — gradient from archetype color to candidate color */}
            <div style={{ height: 5, background: accentStripe }} />

            <div style={{ padding: '18px 22px 20px' }}>

              {/* ── Brand row ── */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
                <span style={{
                  fontSize: 9, fontWeight: 800, letterSpacing: '0.22em',
                  color: 'rgba(255,255,255,0.18)', textTransform: 'uppercase',
                }}>
                  POLISCOP
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: hexAlpha(accentColor, 0.6) }} />
                  <span style={{
                    fontSize: 9, fontWeight: 700, letterSpacing: '0.14em',
                    color: hexAlpha(accentColor, 0.65), textTransform: 'uppercase',
                  }}>
                    2027
                  </span>
                </div>
              </div>

              {/* ══ ZONE 1: IDENTITY ══════════════════════════════════════ */}

              {/* "Tu es" label */}
              <p style={{
                fontSize: 10, fontWeight: 700, letterSpacing: '0.20em',
                textTransform: 'uppercase', color: hexAlpha(accentColor, 0.95),
                marginBottom: 7,
              }}>
                {lang === 'fr' ? 'Tu es' : 'You are'}
              </p>

              {/* Archetype name — the identity hero, untouched from V3 */}
              <p style={{
                fontSize: 42, fontWeight: 900, color: '#ffffff',
                letterSpacing: '-0.030em', lineHeight: 1.04,
                marginBottom: 10, wordBreak: 'break-word',
                textShadow: [
                  `0 0 120px ${hexAlpha(accentColor, 0.85)}`,
                  `0 0 40px ${hexAlpha(accentColor, 0.55)}`,
                  `0 2px 8px rgba(0,0,0,0.6)`,
                ].join(', '),
              }}>
                {archName}
              </p>

              {/* Traits — editorial, dot-separated */}
              {traits.length > 0 && (
                <p style={{
                  fontSize: 11, fontWeight: 500,
                  color: 'rgba(255,255,255,0.42)',
                  letterSpacing: '0.01em', marginBottom: 12,
                  lineHeight: 1.4,
                }}>
                  {traits.slice(0, 3).join(' · ')}
                </p>
              )}

              {/* ══ [V4 NEW] Confidence / reliability module ══════════════
                  V3 received answeredCount as a prop but never showed it.
                  V4 surfaces it as a compact signal-strength indicator.
                  Design: 5 ascending bars (like iPhone signal) + label + count.
                  Hidden entirely when answeredCount = 0 (profile not started).
              ═════════════════════════════════════════════════════════════ */}
              {answeredCount > 0 && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 9,
                  marginBottom: 12,
                  padding: '6px 10px',
                  borderRadius: 8,
                  backgroundColor: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}>
                  {/* Ascending signal bars */}
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, flexShrink: 0 }}>
                    {[7, 10, 13, 16, 19].map((h, i) => (
                      <div key={i} style={{
                        width: 3,
                        height: h,
                        borderRadius: 2,
                        backgroundColor: i < confidenceLevel.bars
                          ? hexAlpha(accentColor, 0.85)
                          : 'rgba(255,255,255,0.14)',
                      }} />
                    ))}
                  </div>
                  {/* Label + count */}
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
                    <span style={{
                      fontSize: 10, fontWeight: 700,
                      color: 'rgba(255,255,255,0.70)',
                      letterSpacing: '0.01em',
                    }}>
                      {confidenceLevel.label}
                    </span>
                    <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.28)' }}>
                      · {answeredCount} {lang === 'fr' ? 'rép.' : 'ans.'}
                    </span>
                  </div>
                </div>
              )}

              {/* ══ [V4 IMPROVED] Rarity block ════════════════════════════
                  V3: single small pill showing rarityLine text, grayed out.
                  V4: for rare profiles → "PROFIL RARE" uppercase pill
                  + separate "Seulement X% des Français" below.
                  Makes rarity feel like a status signal, not a footnote.
              ═════════════════════════════════════════════════════════════ */}
              {rarityLine ? (
                <div style={{ marginBottom: 18 }}>
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    backgroundColor: isRare ? hexAlpha(accentColor, 0.14) : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${isRare ? hexAlpha(accentColor, 0.30) : 'rgba(255,255,255,0.09)'}`,
                    borderRadius: 99, padding: '4px 11px',
                    marginBottom: (isRare && rarityPct != null) ? 5 : 0,
                  }}>
                    {isUltraRare && (
                      <span style={{ fontSize: 8, color: accentColor, letterSpacing: '0.1em' }}>◆◆</span>
                    )}
                    {isRare && !isUltraRare && (
                      <span style={{ fontSize: 8, color: accentColor }}>◆</span>
                    )}
                    <span style={{
                      fontSize: 10, fontWeight: 700,
                      color: isRare ? hexAlpha(accentColor, 0.95) : 'rgba(255,255,255,0.38)',
                      letterSpacing: isRare ? '0.07em' : '0.01em',
                      textTransform: isRare ? 'uppercase' : 'none',
                    }}>
                      {isUltraRare
                        ? (lang === 'fr' ? 'Profil ultra-rare' : 'Ultra-rare profile')
                        : isRare
                        ? (lang === 'fr' ? 'Profil rare' : 'Rare profile')
                        : rarityLine}
                    </span>
                  </div>
                  {/* % detail — only when we have a real number to show */}
                  {isRare && rarityPct != null && (
                    <p style={{
                      fontSize: 11, fontWeight: 600,
                      color: 'rgba(255,255,255,0.38)',
                      letterSpacing: '0.005em',
                    }}>
                      {lang === 'fr'
                        ? `Seulement ${rarityPct}% des Français`
                        : `Only ${rarityPct}% of people`}
                    </p>
                  )}
                </div>
              ) : (
                <div style={{ marginBottom: 18 }} />
              )}

              {/* ── Divider ── */}
              <div style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.08)', marginBottom: 18 }} />

              {/* ══ ZONE 2: MATCH — the BIG NUMBER ═══════════════════════
                  Untouched from V3. 64px 900w candidateColor glow.
                  This is the most shareable element — do not touch.
              ═════════════════════════════════════════════════════════════ */}

              {topCandidate ? (
                <div style={{ marginBottom: 18 }}>
                  <p style={{
                    fontSize: 9, fontWeight: 700,
                    color: 'rgba(255,255,255,0.28)',
                    textTransform: 'uppercase', letterSpacing: '0.16em',
                    marginBottom: 10,
                  }}>
                    {lang === 'fr' ? 'Compatibilité 2027' : '2027 Match'}
                  </p>

                  {/* The big number — the most shareable element */}
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, marginBottom: 8 }}>
                    <span style={{
                      fontSize: 64, fontWeight: 900, letterSpacing: '-0.045em',
                      lineHeight: 0.92, color: candidateColor,
                      textShadow: [
                        `0 0 80px ${hexAlpha(candidateColor, 0.80)}`,
                        `0 0 28px ${hexAlpha(candidateColor, 0.50)}`,
                        `0 2px 8px rgba(0,0,0,0.5)`,
                      ].join(', '),
                    }}>
                      {topCandidate.alignment}%
                    </span>
                  </div>

                  {/* Candidate info */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {/* Candidate color dot */}
                    <div style={{
                      width: 8, height: 8, borderRadius: '50%',
                      backgroundColor: candidateColor, flexShrink: 0,
                      boxShadow: `0 0 10px ${hexAlpha(candidateColor, 0.7)}`,
                    }} />
                    <div>
                      <p style={{
                        fontSize: 14, fontWeight: 700,
                        color: 'rgba(255,255,255,0.92)',
                        marginBottom: 1,
                        letterSpacing: '-0.01em',
                      }}>
                        {lang === 'fr' ? 'avec ' : 'with '}{topCandidate.name}
                      </p>
                      <p style={{
                        fontSize: 10, color: 'rgba(255,255,255,0.32)',
                      }}>
                        {topCandidate.party?.[lang] ?? topCandidate.party?.fr ?? ''}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ marginBottom: 18 }}>
                  <p style={{
                    fontSize: 11, color: 'rgba(255,255,255,0.28)',
                    fontStyle: 'italic', lineHeight: 1.5,
                  }}>
                    {lang === 'fr'
                      ? 'Réponds à plus de questions pour découvrir tes candidats.'
                      : 'Answer more questions to discover your matches.'}
                  </p>
                </div>
              )}

              {/* ── Divider ── */}
              <div style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.08)', marginBottom: 16 }} />

              {/* ══ ZONE 3: SIGNATURE POLITIQUE ═══════════════════════════
                  V3 problems:
                    - Header "Ton ADN politique" at 9px / 25% opacity = invisible
                    - Labels "É S I Sé Ec D M P" at 7px = unreadable decoration
                  V4 fixes:
                    - Header → "TA SIGNATURE POLITIQUE" flanked by decorative lines
                    - Labels → readable 3-4 char abbreviations at 7.5px / 72% opacity
              ═════════════════════════════════════════════════════════════ */}
              {themes && (
                <div style={{ marginBottom: 16 }}>

                  {/* [V4] Section header — flanking lines create chapter-heading feel */}
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 8, marginBottom: 11,
                  }}>
                    <div style={{ flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.10)' }} />
                    <span style={{
                      fontSize: 8, fontWeight: 800, letterSpacing: '0.20em',
                      color: 'rgba(255,255,255,0.48)', textTransform: 'uppercase',
                      whiteSpace: 'nowrap',
                    }}>
                      {lang === 'fr' ? 'TA SIGNATURE POLITIQUE' : 'YOUR POLITICAL DNA'}
                    </span>
                    <div style={{ flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.10)' }} />
                  </div>

                  {/* The equalizer bars — unchanged from V3 */}
                  <div style={{
                    display: 'flex', alignItems: 'flex-end',
                    gap: 5, height: DNA_HEIGHT,
                  }}>
                    {THEMES_ORDER.map(theme => {
                      const score  = themes[theme] ?? 50;
                      const barH   = Math.max(3, Math.round((score / 100) * DNA_HEIGHT));
                      const emptyH = DNA_HEIGHT - barH;
                      const color  = THEME_COLORS[theme] ?? '#6b7280';

                      return (
                        <div
                          key={theme}
                          style={{
                            flex: 1, height: '100%',
                            display: 'flex', flexDirection: 'column',
                            justifyContent: 'flex-end',
                          }}
                        >
                          {/* Ghost (empty) upper portion */}
                          {emptyH > 0 && (
                            <div style={{
                              height: emptyH,
                              backgroundColor: hexAlpha(color, 0.10),
                              borderRadius: '3px 3px 0 0',
                            }} />
                          )}
                          {/* Colored bar — filled from bottom */}
                          <div style={{
                            height: barH,
                            background: `linear-gradient(to top, ${color}, ${hexAlpha(color, 0.72)})`,
                            borderRadius: emptyH === 0 ? '3px 3px 0 0' : 0,
                          }} />
                        </div>
                      );
                    })}
                  </div>

                  {/* Bar baseline */}
                  <div style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.14)', marginBottom: 5 }} />

                  {/* [V4] Readable abbreviated labels — replaces É S I Sé Ec D M P */}
                  <div style={{ display: 'flex', gap: 5 }}>
                    {THEMES_ORDER.map(theme => (
                      <div key={theme} style={{ flex: 1, textAlign: 'center', overflow: 'hidden' }}>
                        <span style={{
                          fontSize: 7.5, fontWeight: 600,
                          color: hexAlpha(THEME_COLORS[theme] ?? '#6b7280', 0.72),
                          display: 'block',
                          letterSpacing: '-0.02em',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                        }}>
                          {themeAbbr[theme] ?? '?'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Footer ── */}
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                paddingTop: 13, borderTop: '1px solid rgba(255,255,255,0.07)',
              }}>
                <span style={{
                  fontSize: 11, fontWeight: 600,
                  color: 'rgba(255,255,255,0.42)',
                  letterSpacing: '0.005em',
                }}>
                  {lang === 'fr' ? 'Et toi, quel est ton archétype ?' : "What's your archetype?"}
                </span>
                <span style={{
                  fontSize: 9, fontWeight: 800, letterSpacing: '0.18em',
                  textTransform: 'uppercase', color: hexAlpha(accentColor, 0.72),
                }}>
                  poliscop.org
                </span>
              </div>

            </div>
          </div>
          {/* ── End share card ── */}

          {/* Close */}
          <button
            onClick={onClose}
            className="w-full text-sm min-h-[52px] transition-colors flex items-center justify-center font-medium"
            style={{ color: 'rgba(255,255,255,0.32)' }}
            onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.62)'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.32)'}
          >
            {lang === 'fr' ? 'Fermer' : 'Close'}
          </button>

        </motion.div>
      </div>
    </motion.div>
  );
}
