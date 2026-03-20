import React, { useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { rankByAlignment } from '../engine/matcher.js';
import { historicalFigures } from '../data/historicalFigures.js';
import { THEMES_ORDER, THEME_LABELS, THEME_COLORS } from '../data/questions.js';
import RadarChart from './RadarChart.jsx';

const canNativeShare = typeof navigator !== 'undefined' && !!navigator.share;

export default function ProfileShareModal({
  themes,
  rankedCurrents,
  language,
  onClose,
}) {
  const cardRef = useRef(null);
  const [copyStatus,     setCopyStatus]     = useState(null); // null | 'copied'
  const [downloadStatus, setDownloadStatus] = useState(null); // null | 'loading' | 'done' | 'error'
  const [shareStatus,    setShareStatus]    = useState(null); // null | 'sharing' | 'done' | 'error'

  const topCurrent  = rankedCurrents?.[0];
  const accentColor = topCurrent?.color ?? '#2563eb';

  // Closest historical figure
  const topFigure = useMemo(() => {
    if (!themes) return null;
    const ranked = rankByAlignment({ themes }, historicalFigures, []);
    return ranked[0] ?? null;
  }, [themes]);

  // All 8 themes for bars
  const allThemes = THEMES_ORDER.map(theme => ({
    theme,
    score: themes?.[theme] ?? 50,
    label: THEME_LABELS[language]?.[theme] ?? theme,
    color: THEME_COLORS[theme] ?? '#6b7280',
  }));

  const shareText = language === 'fr'
    ? `Je viens de cartographier mon profil politique sur Poliscope. Curieux(se) de savoir où tu te situes ? Essaie ici → https://poliscope.app`
    : `I just mapped my political profile on Poliscope. Curious where you stand? Try it → https://poliscope.app`;

  const handleNativeShare = async () => {
    if (!canNativeShare) return;
    setShareStatus('sharing');
    try {
      await navigator.share({
        title: language === 'fr' ? 'Mon profil politique – Poliscope' : 'My political profile – Poliscope',
        text: shareText,
        url: 'https://poliscope.app',
      });
      setShareStatus('done');
      setTimeout(() => setShareStatus(null), 2500);
    } catch {
      setShareStatus(null); // user cancelled — no feedback needed
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
    } catch { /* silent */ }
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
      link.download = 'poliscope-profile.png';
      link.href = dataUrl;
      link.click();
      setDownloadStatus('done');
      setTimeout(() => setDownloadStatus(null), 2500);
    } catch {
      setDownloadStatus('error');
      setTimeout(() => setDownloadStatus(null), 2500);
    }
  };

  // Stagger helper
  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, delay, ease: [0.25, 0.46, 0.45, 0.94] },
  });

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
      style={{ backgroundColor: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(8px)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
    >
      <motion.div
        className="w-full max-w-sm my-auto"
        initial={{ scale: 0.88, opacity: 0, y: 28 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.93, opacity: 0, y: 14 }}
        transition={{ duration: 0.42, ease: [0.34, 1.08, 0.64, 1] }}
        onClick={e => e.stopPropagation()}
      >

        {/* ── Shareable card ── */}
        <div
          ref={cardRef}
          className="rounded-2xl overflow-hidden"
          style={{
            background: 'linear-gradient(145deg, #0f172a 0%, #1a2540 50%, #0f172a 100%)',
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
          }}
        >
          {/* Accent top bar */}
          <div style={{ height: 4, background: `linear-gradient(90deg, ${accentColor}, ${accentColor}99)` }} />

          <div style={{ padding: '26px 26px 22px' }}>

            {/* Brand row */}
            <motion.div
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}
              {...fadeUp(0.05)}
            >
              <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>
                POLISCOPE
              </span>
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.22)', letterSpacing: '0.05em' }}>
                {language === 'fr' ? 'profil politique' : 'political profile'}
              </span>
            </motion.div>

            {/* "I am rather" label */}
            <motion.p
              style={{ fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.4)', marginBottom: 5, letterSpacing: '0.02em' }}
              {...fadeUp(0.12)}
            >
              {language === 'fr' ? 'Je suis plutôt' : 'I am rather'}
            </motion.p>

            {/* Current name */}
            <motion.div
              style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}
              {...fadeUp(0.18)}
            >
              {topCurrent?.icon && (
                <span style={{ fontSize: 24, lineHeight: 1 }}>{topCurrent.icon}</span>
              )}
              <h2 style={{
                fontSize: 28,
                fontWeight: 800,
                margin: 0,
                color: accentColor,
                letterSpacing: '-0.025em',
                lineHeight: 1.1,
              }}>
                {topCurrent?.name[language]}
              </h2>
            </motion.div>

            {/* Short description */}
            <motion.p
              style={{ fontSize: 12, color: 'rgba(255,255,255,0.42)', lineHeight: 1.55, marginBottom: 22, maxWidth: 260 }}
              {...fadeUp(0.24)}
            >
              {topCurrent?.shortDesc[language]}
            </motion.p>

            {/* Radar chart */}
            <motion.div
              style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}
              {...fadeUp(0.3)}
            >
              <RadarChart themes={themes} language={language} size={160} />
            </motion.div>

            {/* Theme score bars — all 8 */}
            <motion.div style={{ marginBottom: 18 }} {...fadeUp(0.36)}>
              {allThemes.map(({ theme, score, label, color }) => (
                <div key={theme} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: color, flexShrink: 0 }} />
                  <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', width: 84, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                    {label}
                  </span>
                  <div style={{ flex: 1, height: 3, backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${score}%`, backgroundColor: color, opacity: 0.7, borderRadius: 2 }} />
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.5)', width: 24, textAlign: 'right' }}>
                    {score}
                  </span>
                </div>
              ))}
            </motion.div>

            {/* Closest historical figure */}
            {topFigure && (
              <motion.div
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  backgroundColor: 'rgba(255,255,255,0.055)',
                  borderRadius: 12, padding: '10px 14px',
                  marginBottom: 20,
                  border: '1px solid rgba(255,255,255,0.07)',
                }}
                {...fadeUp(0.42)}
              >
                <span style={{ fontSize: 22, lineHeight: 1, flexShrink: 0 }}>{topFigure.emoji ?? '👤'}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    {language === 'fr' ? 'Figure la plus proche' : 'Closest figure'}
                  </p>
                  <p style={{ fontSize: 13, fontWeight: 600, color: 'white', margin: 0, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                    {topFigure.name}
                  </p>
                </div>
                <span style={{ fontSize: 17, fontWeight: 800, color: accentColor, flexShrink: 0 }}>
                  {topFigure.alignment}%
                </span>
              </motion.div>
            )}

            {/* Footer */}
            <motion.div
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.07)' }}
              {...fadeUp(0.48)}
            >
              <span style={{ fontSize: 10, fontWeight: 800, color: 'rgba(255,255,255,0.22)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                poliscope.app
              </span>
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.22)' }}>
                {language === 'fr' ? 'Découvrez le vôtre →' : 'Discover yours →'}
              </span>
            </motion.div>

          </div>
        </div>

        {/* ── Action buttons ── */}
        <div className="flex flex-col gap-2.5 mt-4">

          {/* Primary: native share (mobile) OR copy text (desktop) */}
          {canNativeShare ? (
            <motion.button
              onClick={handleNativeShare}
              className="w-full flex items-center justify-center gap-2 bg-white text-gray-900 font-semibold py-3.5 rounded-2xl text-sm"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.15 }}
            >
              {shareStatus === 'done' ? '✓' : '↗'}
              {shareStatus === 'done'
                ? (language === 'fr' ? 'Partagé !' : 'Shared!')
                : (language === 'fr' ? 'Partager mon profil' : 'Share my profile')}
            </motion.button>
          ) : (
            <motion.button
              onClick={handleCopyLink}
              className="w-full flex items-center justify-center gap-2 bg-white text-gray-900 font-semibold py-3.5 rounded-2xl text-sm"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.15 }}
            >
              {copyStatus === 'copied' ? '✓' : '🔗'}
              {copyStatus === 'copied'
                ? (language === 'fr' ? 'Texte copié !' : 'Text copied!')
                : (language === 'fr' ? 'Copier le message' : 'Copy share text')}
            </motion.button>
          )}

          {/* Secondary row: download + (copy if native share exists) */}
          <div className="flex gap-2.5">
            <motion.button
              onClick={handleDownload}
              className="flex-1 flex items-center justify-center gap-2 font-semibold py-3 rounded-2xl text-sm border"
              style={{ backgroundColor: 'rgba(255,255,255,0.07)', borderColor: 'rgba(255,255,255,0.12)', color: 'white' }}
              whileHover={{ backgroundColor: 'rgba(255,255,255,0.12)' }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.15 }}
            >
              {downloadStatus === 'loading' ? <span className="opacity-60 text-xs">…</span>
               : downloadStatus === 'done'  ? '✓'
               : downloadStatus === 'error' ? '✗'
               : '↓'}
              {downloadStatus === 'loading' ? (language === 'fr' ? 'Export…' : 'Exporting…')
               : downloadStatus === 'done'  ? (language === 'fr' ? 'Téléchargé !' : 'Downloaded!')
               : downloadStatus === 'error' ? (language === 'fr' ? 'Erreur' : 'Error')
               :                              (language === 'fr' ? 'Image' : 'Save image')}
            </motion.button>

            {canNativeShare && (
              <motion.button
                onClick={handleCopyLink}
                className="flex-1 flex items-center justify-center gap-2 font-semibold py-3 rounded-2xl text-sm border"
                style={{ backgroundColor: 'rgba(255,255,255,0.07)', borderColor: 'rgba(255,255,255,0.12)', color: 'white' }}
                whileHover={{ backgroundColor: 'rgba(255,255,255,0.12)' }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.15 }}
              >
                {copyStatus === 'copied' ? '✓' : '🔗'}
                {copyStatus === 'copied'
                  ? (language === 'fr' ? 'Copié !' : 'Copied!')
                  : (language === 'fr' ? 'Copier le lien' : 'Copy link')}
              </motion.button>
            )}
          </div>
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          className="mt-3 w-full text-xs py-2 transition-colors"
          style={{ color: 'rgba(255,255,255,0.32)' }}
          onMouseEnter={e => e.target.style.color = 'rgba(255,255,255,0.58)'}
          onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.32)'}
        >
          {language === 'fr' ? 'Fermer' : 'Close'}
        </button>

      </motion.div>
    </motion.div>
  );
}
