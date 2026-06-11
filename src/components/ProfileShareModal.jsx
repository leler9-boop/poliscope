import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';

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

  const reliabilityPct   = totalCount > 0 ? Math.round((answeredCount / totalCount) * 100) : 0;
  const reliabilityNudge = getReliabilityNudge(reliabilityPct, lang);

  const resolvedShareUrl = shareUrl ?? 'https://poliscop.org';

  const handleNativeShare = async () => {
    if (!canNativeShare) return;
    setShareStatus('sharing');
    try {
      await navigator.share({
        title: lang === 'fr' ? 'Mon profil politique – Poliscope 2027' : 'My political profile – Poliscope 2027',
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
      link.download = 'poliscope-profil.png';
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
      background: `radial-gradient(ellipse at 105% -5%, ${hexAlpha(accentColor, 0.28)} 0%, #0f172a 58%)`,
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      borderRadius: 20,
      overflow: 'hidden',
      width: '100%',
    },
    accent: { height: 6, background: `linear-gradient(90deg, ${accentColor} 0%, ${hexAlpha(accentColor, 0.18)} 100%)` },
    inner:  { padding: '18px 22px 20px' },

    // ── Header ─────────────────────────────────────────────────
    brandRow:  { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    brandName: { fontSize: 10, fontWeight: 800, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.22)', textTransform: 'uppercase' },
    brandDot:  { width: 5, height: 5, borderRadius: '50%', backgroundColor: accentColor, opacity: 0.7 },

    divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.08)', margin: '14px 0' },

    // ── Archetype block ────────────────────────────────────────
    archeLabel: { fontSize: 10, fontWeight: 600, color: hexAlpha(accentColor, 0.75), letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 },
    archeName:  {
      fontSize: 36, fontWeight: 800, color: '#ffffff', letterSpacing: '-0.03em', lineHeight: 1.05, marginBottom: 14,
      textShadow: `0 0 48px ${hexAlpha(accentColor, 0.5)}`,
    },

    // ── Trait pills ───────────────────────────────────────────
    traitWrap: { display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 },
    traitPill: {
      display: 'inline-block', padding: '4px 10px', borderRadius: 99,
      border: `1px solid ${hexAlpha(accentColor, 0.38)}`,
      backgroundColor: hexAlpha(accentColor, 0.13),
      fontSize: 11, fontWeight: 600,
      color: 'rgba(255,255,255,0.80)',
      lineHeight: 1.4,
    },

    // ── Candidate row ──────────────────────────────────────────
    candidateLabel: { fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 9 },
    candidateRow: {
      display: 'flex', alignItems: 'center', gap: 11,
      backgroundColor: 'rgba(255,255,255,0.05)',
      border: `1px solid ${hexAlpha(accentColor, 0.22)}`,
      borderRadius: 12, padding: '10px 13px',
    },
    candidateDot:   { width: 9, height: 9, borderRadius: '50%', flexShrink: 0 },
    candidateInfo:  { flex: 1, minWidth: 0 },
    candidateName:  { fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.90)', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' },
    candidateParty: { fontSize: 10, color: 'rgba(255,255,255,0.32)', marginTop: 1, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' },
    candidateScore: { fontSize: 22, fontWeight: 800, color: accentColor, flexShrink: 0, letterSpacing: '-0.03em', textShadow: `0 0 20px ${hexAlpha(accentColor, 0.6)}` },

    // ── Reliability nudge ──────────────────────────────────────
    nudgeText: { fontSize: 10, fontWeight: 500, color: 'rgba(255,255,255,0.35)', fontStyle: 'italic' },

    // ── Footer ────────────────────────────────────────────────
    footer:    { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: 12 },
    footerCta: { fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.65)', letterSpacing: '0.01em' },
    footerUrl: { fontSize: 9,  fontWeight: 800, color: accentColor, opacity: 0.65, letterSpacing: '0.16em', textTransform: 'uppercase' },
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

            {/* Accent bar */}
            <div style={c.accent} />

            <div style={c.inner}>

              {/* Header */}
              <div style={c.brandRow}>
                <span style={c.brandName}>POLISCOPE 2027</span>
                <div style={c.brandDot} />
              </div>

              {/* Archetype */}
              <p style={c.archeLabel}>{lang === 'fr' ? 'Ton archétype' : 'Your archetype'}</p>
              <p style={c.archeName}>{topArchetype?.name[lang] ?? (lang === 'fr' ? 'Profil en cours…' : 'Profile in progress…')}</p>

              {/* Trait pills */}
              {traits.length > 0 && (
                <div style={c.traitWrap}>
                  {traits.slice(0, 3).map((trait, i) => (
                    <span key={i} style={c.traitPill}>{trait}</span>
                  ))}
                </div>
              )}

              {/* Candidate */}
              {topCandidate && (
                <>
                  <div style={c.divider} />
                  <p style={c.candidateLabel}>
                    {lang === 'fr' ? 'Ton meilleur match 2027' : 'Your best 2027 match'}
                  </p>
                  <div style={c.candidateRow}>
                    <div style={{ ...c.candidateDot, backgroundColor: topCandidate.color ?? accentColor }} />
                    <div style={c.candidateInfo}>
                      <p style={c.candidateName}>{topCandidate.name}</p>
                      <p style={c.candidateParty}>{topCandidate.party?.[lang] ?? topCandidate.party?.fr ?? ''}</p>
                    </div>
                    <span style={c.candidateScore}>{topCandidate.alignment}%</span>
                  </div>
                </>
              )}

              {/* Nudge */}
              <div style={c.divider} />
              <p style={c.nudgeText}>{reliabilityNudge}</p>

              {/* Footer */}
              <div style={c.footer}>
                <span style={c.footerCta}>{lang === 'fr' ? 'Et toi, quel est ton archétype ?' : 'What's your archetype?'}</span>
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
