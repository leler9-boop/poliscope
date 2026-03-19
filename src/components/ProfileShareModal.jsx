import React, { useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { rankByAlignment } from '../engine/matcher.js';
import { historicalFigures } from '../data/historicalFigures.js';
import { THEMES_ORDER, THEME_LABELS, THEME_COLORS } from '../data/questions.js';
import RadarChart from './RadarChart.jsx';

export default function ProfileShareModal({
  themes,
  rankedCurrents,
  language,
  onClose,
}) {
  const cardRef = useRef(null);
  const [copyStatus,     setCopyStatus]     = useState(null); // null | 'copied'
  const [downloadStatus, setDownloadStatus] = useState(null); // null | 'loading' | 'done' | 'error'

  const topCurrent  = rankedCurrents?.[0];
  const accentColor = topCurrent?.color ?? '#2563eb';

  // Closest historical figure — computed here, read-only
  const topFigure = useMemo(() => {
    if (!themes) return null;
    const ranked = rankByAlignment({ themes }, historicalFigures, []);
    return ranked[0] ?? null;
  }, [themes]);

  // Top 4 themes for mini bar display
  const topThemes = THEMES_ORDER.slice(0, 4).map(theme => ({
    theme,
    score: themes?.[theme] ?? 50,
    label: THEME_LABELS[language]?.[theme] ?? theme,
    color: THEME_COLORS[theme] ?? '#6b7280',
  }));

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText('https://poliscope.app');
      setCopyStatus('copied');
      setTimeout(() => setCopyStatus(null), 2500);
    } catch {
      setCopyStatus('copied'); // silent fail — still show feedback
      setTimeout(() => setCopyStatus(null), 2500);
    }
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
        style: { borderRadius: '0' }, // avoid clip issues
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

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
      style={{ backgroundColor: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
    >
      <motion.div
        className="w-full max-w-sm my-auto"
        initial={{ scale: 0.88, opacity: 0, y: 24 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 12 }}
        transition={{ duration: 0.38, ease: [0.34, 1.1, 0.64, 1] }}
        onClick={e => e.stopPropagation()}
      >

        {/* ── Shareable card ── */}
        <div
          ref={cardRef}
          className="rounded-2xl overflow-hidden"
          style={{
            background: 'linear-gradient(140deg, #0f172a 0%, #1e293b 55%, #0f172a 100%)',
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
          }}
        >
          {/* Accent top bar */}
          <div style={{ height: 3, backgroundColor: accentColor }} />

          <div style={{ padding: '28px 28px 24px' }}>

            {/* Brand row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase' }}>
                POLISCOPE
              </span>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>
                {language === 'fr' ? 'Profil politique' : 'Political profile'}
              </span>
            </div>

            {/* Identity */}
            <p style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.45)', marginBottom: 6 }}>
              {language === 'fr' ? 'Vous êtes plutôt' : 'You lean'}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              {topCurrent?.icon && (
                <span style={{ fontSize: 22, lineHeight: 1 }}>{topCurrent.icon}</span>
              )}
              <h2 style={{ fontSize: 26, fontWeight: 800, margin: 0, color: accentColor, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                {topCurrent?.name[language]}
              </h2>
            </div>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', lineHeight: 1.5, marginBottom: 24, maxWidth: 260 }}>
              {topCurrent?.shortDesc[language]}
            </p>

            {/* Radar chart */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
              <RadarChart themes={themes} language={language} size={170} />
            </div>

            {/* Mini theme bars */}
            <div style={{ marginBottom: 20 }}>
              {topThemes.map(({ theme, score, label, color }) => (
                <div key={theme} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: color, flexShrink: 0 }} />
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', width: 90, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                    {label}
                  </span>
                  <div style={{ flex: 1, height: 4, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${score}%`, backgroundColor: color, opacity: 0.75, borderRadius: 2 }} />
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.6)', width: 28, textAlign: 'right' }}>
                    {score}
                  </span>
                </div>
              ))}
            </div>

            {/* Closest historical figure */}
            {topFigure && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 12,
                backgroundColor: 'rgba(255,255,255,0.05)',
                borderRadius: 12, padding: '10px 14px',
                marginBottom: 22,
              }}>
                <span style={{ fontSize: 24, lineHeight: 1, flexShrink: 0 }}>{topFigure.emoji ?? '👤'}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    {language === 'fr' ? 'Figure la plus proche' : 'Closest figure'}
                  </p>
                  <p style={{ fontSize: 13, fontWeight: 600, color: 'white', margin: 0, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                    {topFigure.name}
                  </p>
                </div>
                <span style={{ fontSize: 18, fontWeight: 800, color: 'rgba(255,255,255,0.75)', flexShrink: 0 }}>
                  {topFigure.alignment}%
                </span>
              </div>
            )}

            {/* Footer */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                poliscope.app
              </span>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>
                {language === 'fr' ? 'Découvrez le vôtre →' : 'Discover yours →'}
              </span>
            </div>

          </div>
        </div>

        {/* ── Action buttons ── */}
        <div className="flex gap-3 mt-4">
          <motion.button
            onClick={handleDownload}
            className="flex-1 flex items-center justify-center gap-2 bg-white text-gray-900 font-semibold py-3.5 rounded-2xl text-sm"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.15 }}
          >
            {downloadStatus === 'loading' ? (
              <span className="opacity-60 text-xs">…</span>
            ) : downloadStatus === 'done' ? '✓' : downloadStatus === 'error' ? '✗' : '↓'}
            {downloadStatus === 'loading' ? (language === 'fr' ? 'Export…' : 'Exporting…')
             : downloadStatus === 'done'  ? (language === 'fr' ? 'Téléchargé !' : 'Downloaded!')
             : downloadStatus === 'error' ? (language === 'fr' ? 'Erreur' : 'Error')
             :                              (language === 'fr' ? 'Télécharger' : 'Download')}
          </motion.button>

          <motion.button
            onClick={handleCopyLink}
            className="flex-1 flex items-center justify-center gap-2 font-semibold py-3.5 rounded-2xl text-sm border"
            style={{ backgroundColor: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.12)', color: 'white' }}
            whileHover={{ backgroundColor: 'rgba(255,255,255,0.14)' }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.15 }}
          >
            {copyStatus === 'copied' ? '✓' : '🔗'}
            {copyStatus === 'copied'
              ? (language === 'fr' ? 'Copié !' : 'Copied!')
              : (language === 'fr' ? 'Copier le lien' : 'Copy link')}
          </motion.button>
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          className="mt-3 w-full text-xs py-2 transition-colors"
          style={{ color: 'rgba(255,255,255,0.35)' }}
          onMouseEnter={e => e.target.style.color = 'rgba(255,255,255,0.6)'}
          onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.35)'}
        >
          {language === 'fr' ? 'Fermer' : 'Close'}
        </button>

      </motion.div>
    </motion.div>
  );
}
