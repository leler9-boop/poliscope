/**
 * ProfileShareModal — Share Card V3
 *
 * Design principles:
 *  - Treat the card as a SOCIAL OBJECT, not a UI component
 *  - Spotify Wrapped × Apple Design: premium, modern, youth-first
 *  - 3-second rule: WHO AM I → HOW RARE → WHO AM I CLOSE TO → MY DNA
 *  - Viral hooks: rarity badge, huge match %, political DNA fingerprint
 *  - Dual-color system: archetype color (identity) + candidate color (match)
 */

import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { getRarityLine, ARCHETYPE_RARITY } from '../data/archetypeRarity.js';
import { THEME_COLORS, THEMES_ORDER } from '../data/questions.js';
import { trackProfileShared, trackProfileDownloaded } from '../lib/analytics.js';

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

// ── Viral data helpers ──────────────────────────────────────────────────────

/**
 * Return ultra-short single-char labels for the DNA bars.
 * Using initials only — at 7px they're decorative anyway.
 */
const THEME_INITIAL = {
  ECONOMY: 'É', SOCIAL: 'S', IMMIGRATION: 'I', SECURITY: 'Sé',
  ENVIRONMENT: 'Ec', DEMOCRACY: 'D', GLOBAL: 'M', PUBLIC_SERVICES: 'P',
};
const THEME_INITIAL_EN = {
  ECONOMY: 'Ec', SOCIAL: 'So', IMMIGRATION: 'Im', SECURITY: 'Se',
  ENVIRONMENT: 'En', DEMOCRACY: 'De', GLOBAL: 'Gl', PUBLIC_SERVICES: 'Ps',
};

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

  const lang          = language === 'fr' ? 'fr' : 'en';
  const accentColor   = topArchetype?.color ?? '#2563eb';
  const topCandidate  = rankedCandidates?.[0] ?? null;
  const candidateColor = topCandidate?.color ?? accentColor;

  // Rarity
  const rarityLine = topArchetype?.id ? getRarityLine(topArchetype.id, lang) : '';
  const rarityPct  = topArchetype?.id ? (ARCHETYPE_RARITY[topArchetype.id] ?? null) : null;
  const isUltraRare = rarityPct != null && rarityPct <= 2;
  const isRare      = rarityPct != null && rarityPct <= 5;

  // Signature position
  const signature = getSignaturePosition(themes, lang);

  // Archetype
  const archName = topArchetype?.name?.[lang] ?? topArchetype?.name?.fr
    ?? (lang === 'fr' ? 'Profil en cours…' : 'Profile in progress…');
  const traits = topArchetype?.traits?.[lang] ?? topArchetype?.traits?.fr ?? [];

  const resolvedShareUrl = shareUrl ?? 'https://poliscop.org';

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
  //
  // 8 vertical bars, one per theme, height = score/100 of max bar height.
  // Each bar is a colored column rising from a dark baseline.
  // Visually: like a music equalizer — each person's bars are unique.

  const DNA_HEIGHT = 52;   // px, max bar height
  const themeInitials = lang === 'fr' ? THEME_INITIAL : THEME_INITIAL_EN;

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
              SHARE CARD V3 — social object
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

              {/* Archetype name — the identity hero */}
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

              {/* Rarity badge — status signal */}
              {rarityLine ? (
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  backgroundColor: isRare ? hexAlpha(accentColor, 0.16) : 'rgba(255,255,255,0.06)',
                  border: `1px solid ${isRare ? hexAlpha(accentColor, 0.38) : 'rgba(255,255,255,0.10)'}`,
                  borderRadius: 99, padding: '5px 11px', marginBottom: 18,
                }}>
                  {isUltraRare && (
                    <span style={{ fontSize: 8, color: accentColor, letterSpacing: '0.1em' }}>◆◆</span>
                  )}
                  {isRare && !isUltraRare && (
                    <span style={{ fontSize: 8, color: accentColor }}>◆</span>
                  )}
                  <span style={{
                    fontSize: 10, fontWeight: 600,
                    color: isRare ? hexAlpha(accentColor, 0.95) : 'rgba(255,255,255,0.40)',
                    letterSpacing: '0.01em',
                  }}>
                    {rarityLine}
                  </span>
                </div>
              ) : (
                <div style={{ marginBottom: 18 }} />
              )}

              {/* ── Divider ── */}
              <div style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.08)', marginBottom: 18 }} />

              {/* ══ ZONE 2: MATCH — the BIG NUMBER ═══════════════════════ */}

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

              {/* ══ ZONE 3: DNA FINGERPRINT ═══════════════════════════════
                  8 vertical bars — one per political theme.
                  Each person's bar pattern is unique — like a fingerprint.
                  Colors = theme colors. Height = user's score on that theme.
              ════════════════════════════════════════════════════════════ */}
              {themes && (
                <div style={{ marginBottom: 16 }}>
                  <p style={{
                    fontSize: 9, fontWeight: 700,
                    color: 'rgba(255,255,255,0.25)',
                    textTransform: 'uppercase', letterSpacing: '0.16em',
                    marginBottom: 10,
                  }}>
                    {lang === 'fr' ? 'Ton ADN politique' : 'Your political DNA'}
                  </p>

                  {/* The equalizer bars */}
                  <div style={{
                    display: 'flex', alignItems: 'flex-end',
                    gap: 5, height: DNA_HEIGHT,
                  }}>
                    {THEMES_ORDER.map(theme => {
                      const score = themes[theme] ?? 50;
                      const barH  = Math.max(3, Math.round((score / 100) * DNA_HEIGHT));
                      const emptyH = DNA_HEIGHT - barH;
                      const color = THEME_COLORS[theme] ?? '#6b7280';

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

                  {/* Theme initial labels */}
                  <div style={{ display: 'flex', gap: 5 }}>
                    {THEMES_ORDER.map(theme => (
                      <div key={theme} style={{ flex: 1, textAlign: 'center' }}>
                        <span style={{
                          fontSize: 7, fontWeight: 600,
                          color: hexAlpha(THEME_COLORS[theme] ?? '#6b7280', 0.65),
                          display: 'block', letterSpacing: '-0.02em',
                        }}>
                          {themeInitials[theme] ?? '?'}
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
                  {lang === 'fr' ? 'Et toi, quel est ton archétype ?' : 'What's your archetype?'}
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
