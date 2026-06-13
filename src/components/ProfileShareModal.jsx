import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { getRarityLine } from '../data/archetypeRarity.js';

const canNativeShare = typeof navigator !== 'undefined' && !!navigator.share;

function getReliabilityNudge(pct, lang) {
  if (pct >= 80) return lang === 'fr' ? 'Profil complet ✦' : 'Full profile ✦';
  if (pct >= 50) return lang === 'fr' ? 'Ton profil se précise. Continue →' : 'Your profile is taking shape. Keep going →';
  return lang === 'fr' ? 'Réponds à plus de questions pour affiner ton profil' : 'Answer more questions to sharpen your profile';
}

function hexAlpha(hex, alpha) {
  if (!hex || hex.length < 7) return `rgba(37,99,235,${alpha})`;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

// ─── Component ────────────────────────────────────────────────────────────────

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

  const lang         = language === 'fr' ? 'fr' : 'en';
  const accentColor  = topArchetype?.color ?? '#2563eb';
  const topCandidate = rankedCandidates?.[0] ?? null;
  const rarityLine   = topArchetype?.id ? getRarityLine(topArchetype.id, lang) : '';

  const reliabilityPct   = totalCount > 0 ? Math.round((answeredCount / totalCount) * 100) : 0;
  const reliabilityNudge = getReliabilityNudge(reliabilityPct, lang);

  const resolvedShareUrl = shareUrl ?? 'https://poliscop.org';

  const handleNativeShare = async () => {
    if (!canNativeShare) return;
    setShareStatus('sharing');
    try {
      await navigator.share({
        title: lang === 'fr' ? 'Mon profil politique – Poliscop 2027' : 'My political profile – Poliscop 2027',
        text:  lang === 'fr' ? 'Découvre mon profil politique →' : 'Check out my political profile →',
        url:   resolvedShareUrl,
      });
      setShareStatus('done');
      setTimeout(() => setShareStatus(null), 2500);
    } catch { setShareStatus(null); }
  };

  const handleCopyLink = async () => {
    try { await navigator.clipboard.writeText(resolvedShareUrl); } catch { /* silent */ }
    setCopyStatus('copied');
    setTimeout(() => setCopyStatus(null), 2500);
  };

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setDownloadStatus('loading');
    try {
      const { toPng } = await import('html-to-image');
      const dataUrl = await toPng(cardRef.current, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: '#0f172a',
      });
      const link = document.createElement('a');
      link.download = 'poliscop-profil.png';
      link.href = dataUrl;
      link.click();
      setDownloadStatus('done');
      setTimeout(() => setDownloadStatus(null), 2500);
    } catch {
      setDownloadStatus('error');
      setTimeout(() => setDownloadStatus(null), 2500);
    }
  };

  // ── Card styles (all inline — required for html-to-image) ─────────────────

  const c = {
    root: {
      // Centred radial spotlight sits at ~36% down — right where the name lives
      background: `radial-gradient(ellipse at 52% 36%, ${hexAlpha(accentColor, 0.22)} 0%, transparent 62%), #07111e`,
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      borderRadius: 20,
      overflow: 'hidden',
      width: '100%',
    },
    // 4px solid stripe — confident, not decorative
    accent: { height: 4, background: accentColor },
    inner:  { padding: '18px 22px 20px' },

    // ── Header — micro brand ────────────────────────────────────
    brandRow:  { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
    brandName: { fontSize: 10, fontWeight: 800, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.18)', textTransform: 'uppercase' },
    brandYear: { fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', color: hexAlpha(accentColor, 0.5) },

    // ── Identity hero ───────────────────────────────────────────
    youAre: {
      fontSize: 10, fontWeight: 700, color: hexAlpha(accentColor, 0.9),
      textTransform: 'uppercase', letterSpacing: '0.16em', marginBottom: 9,
    },
    archeName: {
      fontSize: 44, fontWeight: 900, color: '#ffffff',
      letterSpacing: '-0.028em', lineHeight: 1.06, marginBottom: 16,
      textShadow: `0 0 100px ${hexAlpha(accentColor, 0.7)}, 0 0 32px ${hexAlpha(accentColor, 0.38)}`,
    },
    heroLine: {
      width: 40, height: 3, borderRadius: 99,
      background: accentColor, marginBottom: 14,
    },

    // ── Traits — editorial, dot-separated ─────────────────────
    traitLine: {
      fontSize: 11, fontWeight: 500,
      color: 'rgba(255,255,255,0.40)',
      letterSpacing: '0.02em', marginBottom: 0,
    },

    // ── Rarity (optional) ───────────────────────────────────────
    rarityText: {
      fontSize: 10, fontWeight: 600,
      color: hexAlpha(accentColor, 0.72),
      fontStyle: 'italic', marginTop: 8,
    },

    // ── Section divider ─────────────────────────────────────────
    sectionDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.07)', margin: '16px 0' },

    // ── Match section ───────────────────────────────────────────
    matchLabel: {
      fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.22)',
      textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 10,
    },
    matchRow: {
      display: 'flex', alignItems: 'center', gap: 14,
      backgroundColor: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.09)',
      borderRadius: 12, padding: '10px 14px', marginBottom: 16,
    },
    matchPct: {
      fontSize: 28, fontWeight: 900, color: accentColor,
      letterSpacing: '-0.03em', flexShrink: 0, lineHeight: 1,
      textShadow: `0 0 24px ${hexAlpha(accentColor, 0.55)}`,
    },
    matchDivLine: { width: 1, height: 26, backgroundColor: 'rgba(255,255,255,0.10)', flexShrink: 0 },
    matchInfo:   { flex: 1, minWidth: 0 },
    matchName:   { fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.88)', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', marginBottom: 2 },
    matchParty:  { fontSize: 10, color: 'rgba(255,255,255,0.30)', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' },

    // ── Footer ────────────────────────────────────────────────
    footer:    { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.07)' },
    footerCta: { fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.48)', letterSpacing: '0.01em' },
    footerUrl: { fontSize: 9,  fontWeight: 800, color: accentColor, opacity: 0.55, letterSpacing: '0.16em', textTransform: 'uppercase' },
  };

  const traits = topArchetype?.traits?.[lang] ?? topArchetype?.traits?.fr ?? [];

  return (
    <motion.div
      className="fixed inset-0 z-50 overflow-y-auto"
      style={{ backgroundColor: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(8px)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
    >
      {/* min-h-full + flex → correct iOS Safari scroll */}
      <div className="flex min-h-full items-start sm:items-center justify-center p-4 py-6">
        <motion.div
          className="w-full max-w-sm flex flex-col gap-3"
          initial={{ scale: 0.88, opacity: 0, y: 28 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.93, opacity: 0, y: 14 }}
          transition={{ duration: 0.42, ease: [0.34, 1.08, 0.64, 1] }}
          onClick={e => e.stopPropagation()}
        >

          {/* ── Action buttons — FIRST (always visible, no scroll needed) ── */}
          <div className="flex flex-col gap-2.5">

            {canNativeShare ? (
              <motion.button
                onClick={handleNativeShare}
                className="w-full flex items-center justify-center gap-2 bg-white text-gray-900 font-semibold py-3.5 rounded-2xl text-sm"
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.15 }}
              >
                {shareStatus === 'done' ? '✓' : '↗'}
                {shareStatus === 'done'
                  ? (lang === 'fr' ? 'Partagé !' : 'Shared!')
                  : (lang === 'fr' ? 'Partager mon profil' : 'Share my profile')}
              </motion.button>
            ) : (
              <motion.button
                onClick={handleCopyLink}
                className="w-full flex items-center justify-center gap-2 bg-white text-gray-900 font-semibold py-3.5 rounded-2xl text-sm"
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.15 }}
              >
                {copyStatus === 'copied' ? '✓' : '🔗'}
                {copyStatus === 'copied'
                  ? (lang === 'fr' ? 'Lien copié !' : 'Link copied!')
                  : (lang === 'fr' ? 'Copier le lien' : 'Copy link')}
              </motion.button>
            )}

            <div className="flex gap-2.5">
              <motion.button
                onClick={handleDownload}
                className="flex-1 flex items-center justify-center gap-2 font-semibold py-3 rounded-2xl text-sm border"
                style={{ backgroundColor: 'rgba(255,255,255,0.07)', borderColor: 'rgba(255,255,255,0.12)', color: 'white' }}
                whileHover={{ backgroundColor: 'rgba(255,255,255,0.12)' }}
                whileTap={{ scale: 0.97 }} transition={{ duration: 0.15 }}
              >
                {downloadStatus === 'loading' ? <span className="opacity-60 text-xs">…</span>
                 : downloadStatus === 'done'  ? '✓'
                 : downloadStatus === 'error' ? '✗' : '↓'}
                {downloadStatus === 'loading' ? (lang === 'fr' ? 'Export…'       : 'Exporting…')
                 : downloadStatus === 'done'  ? (lang === 'fr' ? 'Téléchargé !'  : 'Downloaded!')
                 : downloadStatus === 'error' ? (lang === 'fr' ? 'Erreur'        : 'Error')
                 :                              (lang === 'fr' ? 'Image'         : 'Save image')}
              </motion.button>

              {canNativeShare && (
                <motion.button
                  onClick={handleCopyLink}
                  className="flex-1 flex items-center justify-center gap-2 font-semibold py-3 rounded-2xl text-sm border"
                  style={{ backgroundColor: 'rgba(255,255,255,0.07)', borderColor: 'rgba(255,255,255,0.12)', color: 'white' }}
                  whileHover={{ backgroundColor: 'rgba(255,255,255,0.12)' }}
                  whileTap={{ scale: 0.97 }} transition={{ duration: 0.15 }}
                >
                  {copyStatus === 'copied' ? '✓' : '🔗'}
                  {copyStatus === 'copied'
                    ? (lang === 'fr' ? 'Lien copié !' : 'Link copied!')
                    : (lang === 'fr' ? 'Copier le lien' : 'Copy link')}
                </motion.button>
              )}
            </div>
          </div>

          {/* ── Share card — preview ── */}
          <div ref={cardRef} style={c.root}>

            {/* Solid accent stripe */}
            <div style={c.accent} />

            <div style={c.inner}>

              {/* Micro brand */}
              <div style={c.brandRow}>
                <span style={c.brandName}>POLISCOP</span>
                <span style={c.brandYear}>2027</span>
              </div>

              {/* Identity hero */}
              <p style={c.youAre}>{lang === 'fr' ? 'Vous êtes' : 'You are'}</p>
              <p style={c.archeName}>
                {topArchetype?.name?.[lang] ?? topArchetype?.name?.fr ?? (lang === 'fr' ? 'Profil en cours…' : 'Profile in progress…')}
              </p>
              <div style={c.heroLine} />

              {/* Traits — editorial, not pills */}
              {traits.length > 0 && (
                <p style={c.traitLine}>{traits.slice(0, 3).join(' · ')}</p>
              )}

              {/* Rarity — only if available */}
              {rarityLine ? <p style={c.rarityText}>{rarityLine}</p> : null}

              {/* Candidate match */}
              {topCandidate && (
                <>
                  <div style={c.sectionDivider} />
                  <p style={c.matchLabel}>
                    {lang === 'fr' ? 'Match 2027' : '2027 Match'}
                  </p>
                  <div style={c.matchRow}>
                    <span style={c.matchPct}>{topCandidate.alignment}%</span>
                    <div style={c.matchDivLine} />
                    <div style={c.matchInfo}>
                      <p style={c.matchName}>{topCandidate.name}</p>
                      <p style={c.matchParty}>{topCandidate.party?.[lang] ?? topCandidate.party?.fr ?? ''}</p>
                    </div>
                  </div>
                </>
              )}

              {/* Footer */}
              <div style={c.footer}>
                <span style={c.footerCta}>{lang === 'fr' ? 'Et toi, quel est ton archétype ?' : 'What’s your archetype?'}</span>
                <span style={c.footerUrl}>poliscop.org</span>
              </div>

            </div>
          </div>

          {/* Close */}
          <button
            onClick={onClose}
            className="w-full text-xs py-3 transition-colors"
            style={{ color: 'rgba(255,255,255,0.32)' }}
            onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.58)'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.32)'}
          >
            {lang === 'fr' ? 'Fermer' : 'Close'}
          </button>

        </motion.div>
      </div>
    </motion.div>
  );
}
