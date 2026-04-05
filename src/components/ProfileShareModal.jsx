import React, { useRef, useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { rankByAlignment } from '../engine/matcher.js';
import { historicalFigures } from '../data/historicalFigures.js';
import { THEMES_ORDER, THEME_COLORS } from '../data/questions.js';

const canNativeShare = typeof navigator !== 'undefined' && !!navigator.share;

// ─── Axis definitions: pole labels + full labels for context ─────────────────

const THEME_AXES = {
  ECONOMY:         { en: { name: 'Economy',      left: 'Redistrib.',   right: 'Free market',  leftFull: 'redistribution',  rightFull: 'free market'             },
                     fr: { name: 'Économie',      left: 'Redistrib.',   right: 'Marché libre', leftFull: 'redistribution',  rightFull: 'marché libre'            } },
  SOCIAL:          { en: { name: 'Social',        left: 'Traditional',  right: 'Progressive',  leftFull: 'tradition',       rightFull: 'progressisme'            },
                     fr: { name: 'Social',         left: 'Trad.',        right: 'Progressiste', leftFull: 'tradition',       rightFull: 'progressisme'            } },
  IMMIGRATION:     { en: { name: 'Immigration',   left: 'Restrictive',  right: 'Open',         leftFull: 'restriction',     rightFull: 'openness'                },
                     fr: { name: 'Immigration',    left: 'Restrictif',   right: 'Ouverture',    leftFull: 'restriction',     rightFull: "ouverture"               } },
  SECURITY:        { en: { name: 'Security',      left: 'State sec.',   right: 'Civil lib.',   leftFull: 'state security',  rightFull: 'civil liberties'         },
                     fr: { name: 'Sécurité',       left: 'État',         right: 'Libertés',     leftFull: "sécurité d'État", rightFull: 'libertés civiles'        } },
  ENVIRONMENT:     { en: { name: 'Environment',   left: 'Growth first', right: 'Ecology',      leftFull: 'growth',          rightFull: 'ecology'                 },
                     fr: { name: 'Environnement',  left: 'Croissance',   right: 'Écologie',     leftFull: 'croissance',      rightFull: 'écologie'                } },
  DEMOCRACY:       { en: { name: 'Democracy',     left: 'Strong state', right: 'Participative',leftFull: 'strong state',    rightFull: 'participatory democracy' },
                     fr: { name: 'Démocratie',     left: 'État fort',    right: 'Participatif', leftFull: 'état fort',       rightFull: 'démocratie participative'} },
  GLOBAL:          { en: { name: 'Global',         left: 'Sovereignty',  right: 'Multilateral.',leftFull: 'sovereignty',     rightFull: 'multilateralism'         },
                     fr: { name: 'Mondial',         left: 'Souverain.',   right: 'Multilatér.',  leftFull: 'souveraineté',    rightFull: 'multilatéralisme'        } },
  PUBLIC_SERVICES: { en: { name: 'Public services',left: 'Private',      right: 'Public',       leftFull: 'private sector',  rightFull: 'public services'         },
                     fr: { name: 'Services pub.',   left: 'Privé',        right: 'Public',       leftFull: 'secteur privé',   rightFull: 'services publics'        } },
};

function positionContext(score, poles, lang) {
  const { leftFull, rightFull } = poles;
  if (score < 20) return lang === 'fr' ? `Très orienté vers ${leftFull}`      : `Strongly towards ${leftFull}`;
  if (score < 38) return lang === 'fr' ? `Orienté vers ${leftFull}`           : `Leaning towards ${leftFull}`;
  if (score < 46) return lang === 'fr' ? `Légèrement vers ${leftFull}`        : `Slightly towards ${leftFull}`;
  if (score <= 54) return lang === 'fr' ? `Position équilibrée`               : `Balanced position`;
  if (score <= 62) return lang === 'fr' ? `Légèrement vers ${rightFull}`      : `Slightly towards ${rightFull}`;
  if (score <= 80) return lang === 'fr' ? `Orienté vers ${rightFull}`         : `Leaning towards ${rightFull}`;
  return              lang === 'fr' ? `Très orienté vers ${rightFull}`        : `Strongly towards ${rightFull}`;
}

function hexAlpha(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getPersonalPhrases(themes, lang) {
  const { ECONOMY, SOCIAL, IMMIGRATION, SECURITY, ENVIRONMENT, PUBLIC_SERVICES, GLOBAL, DEMOCRACY } = themes;
  const econScore   = Math.round((ECONOMY + (100 - PUBLIC_SERVICES)) / 2);
  const socialScore = Math.round((SOCIAL  + (100 - IMMIGRATION))     / 2);

  const phraseEcon = (() => {
    if (econScore < 35) return { fr: `Je privilégie les services publics et la redistribution.`,    en: `I prioritise public services and redistribution.` };
    if (econScore < 50) return { fr: `Je suis pour un État-providence fort, avec une économie ouverte.`, en: `I favour a strong welfare state alongside an open economy.` };
    if (econScore < 65) return { fr: `Je préfère un équilibre entre marché libre et intervention de l'État.`, en: `I prefer a balance between free market and state intervention.` };
    return                     { fr: `Je préfère la liberté économique et un État moins interventionniste.`, en: `I favour economic freedom and limited government.` };
  })();

  const phraseSocial = (() => {
    if (socialScore < 35) return { fr: `Je tiens à des valeurs traditionnelles et des frontières maîtrisées.`, en: `I value traditional principles and controlled borders.` };
    if (socialScore < 50) return { fr: `Je suis prudent(e) face aux changements sociaux rapides.`,            en: `I am cautious about rapid social change.` };
    if (socialScore < 65) return { fr: `Je suis pour des politiques sociales ouvertes et inclusives.`,        en: `I favour open and inclusive social policies.` };
    return                       { fr: `Je défends les libertés civiles et l'accueil des migrants.`,           en: `I strongly support civil liberties and welcoming migrants.` };
  })();

  const phraseThird = (() => {
    if (ENVIRONMENT >= 65) return { fr: `Je place l'écologie au cœur de mes priorités.`,              en: `I place ecology at the heart of my priorities.` };
    if (ENVIRONMENT <= 30) return { fr: `Je préfère une transition écologique progressive et réaliste.`, en: `I prefer a gradual, realistic ecological transition.` };
    if (SECURITY    >= 68) return { fr: `Je privilégie la sécurité et la fermeté de l'État.`,          en: `I prioritise security and a firm rule of law.` };
    if (GLOBAL      >= 68) return { fr: `Je crois à la coopération internationale.`,                   en: `I believe in international cooperation.` };
    if (DEMOCRACY   >= 72) return { fr: `Je suis attaché(e) à une démocratie forte et participative.`, en: `I am committed to a strong, participatory democracy.` };
    return                        { fr: `Je cherche des solutions pragmatiques et équilibrées.`,        en: `I look for pragmatic, balanced solutions.` };
  })();

  return [phraseEcon, phraseSocial, phraseThird].map(p => p[lang] ?? p.en);
}

function getSubtitle(themes, lang) {
  const { ECONOMY, SOCIAL, IMMIGRATION, PUBLIC_SERVICES } = themes;
  const econScore   = Math.round((ECONOMY + (100 - PUBLIC_SERVICES)) / 2);
  const socialScore = Math.round((SOCIAL  + (100 - IMMIGRATION))     / 2);

  const isCenter = econScore >= 40 && econScore <= 60 && socialScore >= 40 && socialScore <= 60;
  if (isCenter) return lang === 'fr' ? 'Profil modéré et pragmatique' : 'Moderate, pragmatic profile';

  const econAdj   = econScore   < 40 ? { fr: 'social',      en: 'social'      }
                  : econScore   > 60 ? { fr: 'libéral',      en: 'liberal'     }
                  :                    { fr: 'équilibré',     en: 'balanced'    };

  const socialAdj = socialScore < 40 ? { fr: 'conservateur', en: 'conservative' }
                  : socialScore > 60 ? { fr: 'progressiste',  en: 'progressive'  }
                  :                    { fr: 'modéré',        en: 'moderate'     };

  if (lang === 'fr') return `Profil ${socialAdj.fr} et ${econAdj.fr}`;
  const s = socialAdj.en;
  return `${s.charAt(0).toUpperCase() + s.slice(1)}, ${econAdj.en} profile`;
}

// ─── Component ───────────────────────────────────────────────────────────────

function getReliabilityLabel(pct, lang) {
  if (pct >= 80) return lang === 'fr' ? 'Profil solide, peu susceptible de changer.' : 'Solid profile, unlikely to shift much.';
  if (pct >= 50) return lang === 'fr' ? 'Profil partiel, à affiner avec plus de réponses.' : 'Partial profile — more answers would refine it.';
  return lang === 'fr' ? 'Encore en construction — mais déjà révélateur.' : 'Still in progress — but already revealing.';
}

export default function ProfileShareModal({ themes, rankedCurrents, language, answeredCount = 0, totalCount = 120, onClose }) {
  const cardRef = useRef(null);
  const [copyStatus,     setCopyStatus]     = useState(null);
  const [downloadStatus, setDownloadStatus] = useState(null);
  const [shareStatus,    setShareStatus]    = useState(null);

  const topCurrent  = rankedCurrents?.[0];
  const accentColor = topCurrent?.color ?? '#2563eb';
  const lang        = language === 'fr' ? 'fr' : 'en';

  const topFigure = useMemo(() => {
    if (!themes) return null;
    const ranked = rankByAlignment({ themes }, historicalFigures, []);
    return ranked[0] ?? null;
  }, [themes]);

  const phrases  = useMemo(() => themes ? getPersonalPhrases(themes, lang) : [], [themes, lang]);
  const subtitle = useMemo(() => themes ? getSubtitle(themes, lang)        : '', [themes, lang]);

  const reliabilityPct   = totalCount > 0 ? Math.round((answeredCount / totalCount) * 100) : 0;
  const reliabilityLabel = getReliabilityLabel(reliabilityPct, lang);

  const shareText = lang === 'fr'
    ? `Je viens de cartographier mon profil politique sur Poliscop. Curieux(se) de savoir où tu te situes ? Essaie ici → https://poliscop.org`
    : `I just mapped my political profile on Poliscop. Curious where you stand? Try it → https://poliscop.org`;

  const handleNativeShare = async () => {
    if (!canNativeShare) return;
    setShareStatus('sharing');
    try {
      await navigator.share({
        title: lang === 'fr' ? 'Mon profil politique – Poliscop' : 'My political profile – Poliscop',
        text:  shareText,
        url:   'https://poliscop.org',
      });
      setShareStatus('done');
      setTimeout(() => setShareStatus(null), 2500);
    } catch { setShareStatus(null); }
  };

  const handleCopyLink = async () => {
    try { await navigator.clipboard.writeText(shareText); } catch { /* silent */ }
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
      link.download = 'poliscop-profile.png';
      link.href = dataUrl;
      link.click();
      setDownloadStatus('done');
      setTimeout(() => setDownloadStatus(null), 2500);
    } catch {
      setDownloadStatus('error');
      setTimeout(() => setDownloadStatus(null), 2500);
    }
  };

  // ── Card styles (all inline — required for html-to-image) ──────────────────

  const card = {
    root: {
      background: '#0f172a',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
      borderRadius: 20,
      overflow: 'hidden',
      width: '100%',
    },
    accent: { height: 3, background: accentColor },
    inner: { padding: '20px 22px 18px' },

    // Header
    brandRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    brandName: { fontSize: 11, fontWeight: 800, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase' },
    brandSub:  { fontSize: 10, color: 'rgba(255,255,255,0.18)', letterSpacing: '0.06em' },

    // Ideology block
    isoLabel: { fontSize: 10, fontWeight: 500, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.04em', marginBottom: 6 },
    isoRow:   { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 4 },
    isoName:  { fontSize: 22, fontWeight: 800, color: accentColor, letterSpacing: '-0.02em', lineHeight: 1.1, flex: 1, minWidth: 0 },
    isoScore: { fontSize: 28, fontWeight: 800, color: accentColor, letterSpacing: '-0.03em', flexShrink: 0, lineHeight: 1 },
    isoSub:   { fontSize: 11, color: 'rgba(255,255,255,0.32)', fontStyle: 'italic', letterSpacing: '0.01em', marginBottom: 18 },

    divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.07)', margin: '14px 0' },

    // Theme axes
    axesLabel:    { fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.22)', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 10 },
    axisBlock:    { marginBottom: 10 },
    axisHeader:   { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 },
    axisName:     { fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase', letterSpacing: '0.08em' },
    axisRow:      { display: 'flex', alignItems: 'center', gap: 5 },
    axisPoleLeft: { width: 48, flexShrink: 0, fontSize: 8, color: 'rgba(255,255,255,0.2)', textAlign: 'right', overflow: 'hidden', whiteSpace: 'nowrap' },
    axisPoleRight:{ width: 48, flexShrink: 0, fontSize: 8, color: 'rgba(255,255,255,0.2)', overflow: 'hidden', whiteSpace: 'nowrap' },
    axisTrack:    { flex: 1, position: 'relative', height: 14, display: 'flex', alignItems: 'center' },
    axisLine:     { position: 'absolute', left: 0, right: 0, height: 2, borderRadius: 1 },
    axisContext:  { fontSize: 8, fontStyle: 'italic', color: 'rgba(255,255,255,0.2)', marginTop: 3 },

    // Phrases
    phraseLabel: { fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.22)', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 10 },
    phraseRow:   { display: 'flex', alignItems: 'flex-start', gap: 7, marginBottom: 7 },
    phraseDash:  { color: accentColor, fontSize: 12, lineHeight: 1.5, flexShrink: 0 },
    phraseText:  { fontSize: 11, color: 'rgba(255,255,255,0.68)', lineHeight: 1.5, margin: 0 },

    // Figure row
    figureRow: {
      display: 'flex', alignItems: 'center', gap: 9,
      backgroundColor: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 10, padding: '8px 11px', marginTop: 14,
    },
    figureEmoji:  { fontSize: 18, lineHeight: 1, flexShrink: 0 },
    figureText:   { flex: 1, fontSize: 11, color: 'rgba(255,255,255,0.5)', margin: 0, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' },
    figureScore:  { fontSize: 13, fontWeight: 800, color: accentColor, flexShrink: 0 },

    // Reliability
    reliabilityRow:   { display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 14 },
    reliabilityLabel: { fontSize: 9, fontWeight: 600, color: 'rgba(255,255,255,0.22)', textTransform: 'uppercase', letterSpacing: '0.1em', flexShrink: 0 },
    reliabilityPct:   { fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.32)' },
    reliabilitySub:   { fontSize: 9, color: 'rgba(255,255,255,0.2)', fontStyle: 'italic', marginTop: 2 },

    // Footer
    footer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.07)', marginTop: 10 },
    footerCta:  { fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.01em' },
    footerUrl:  { fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.14em', textTransform: 'uppercase' },
  };

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

        {/* ── Share card ── */}
        <div ref={cardRef} style={card.root}>
          <div style={card.accent} />

          <div style={card.inner}>

            {/* Brand row */}
            <div style={card.brandRow}>
              <span style={card.brandName}>POLISCOP</span>
              <span style={card.brandSub}>{lang === 'fr' ? 'profil politique' : 'political profile'}</span>
            </div>

            {/* Ideology block */}
            <p style={card.isoLabel}>{lang === 'fr' ? 'Je suis plutôt' : 'I am rather'}</p>
            <div style={card.isoRow}>
              <span style={card.isoName} title={topCurrent?.name[language]}>
                {topCurrent?.icon && <span style={{ marginRight: 6 }}>{topCurrent.icon}</span>}
                {topCurrent?.name[language]}
              </span>
              <span style={card.isoScore}>{topCurrent?.alignment ?? '—'}%</span>
            </div>
            <p style={card.isoSub}>{subtitle}</p>

            {/* Theme axes */}
            <div style={card.divider} />
            <p style={card.axesLabel}>{lang === 'fr' ? 'Par thème' : 'By theme'}</p>
            <div>
              {THEMES_ORDER.map((theme, idx) => {
                const score   = Math.round(themes?.[theme] ?? 50);
                const tColor  = THEME_COLORS[theme] ?? '#6b7280';
                const poles   = THEME_AXES[theme]?.[lang] ?? THEME_AXES[theme]?.en ?? {};
                const context = positionContext(score, poles, lang);
                return (
                  <div key={theme} style={{ ...card.axisBlock, marginBottom: idx < THEMES_ORDER.length - 1 ? 10 : 0 }}>
                    {/* Name + score */}
                    <div style={card.axisHeader}>
                      <span style={card.axisName}>{poles.name ?? theme}</span>
                      <span style={{ fontSize: 11, fontWeight: 800, color: tColor, letterSpacing: '-0.01em' }}>{score}</span>
                    </div>
                    {/* Axis row: left pole | track+dot | right pole */}
                    <div style={card.axisRow}>
                      <span style={card.axisPoleLeft}>{poles.left}</span>
                      <div style={card.axisTrack}>
                        <div style={{
                          ...card.axisLine,
                          background: `linear-gradient(to right, rgba(255,255,255,0.06), ${hexAlpha(tColor, 0.35)})`,
                        }} />
                        <div style={{
                          position: 'absolute',
                          left: `${score}%`,
                          transform: 'translateX(-50%)',
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          backgroundColor: tColor,
                          boxShadow: `0 0 6px 2px ${hexAlpha(tColor, 0.45)}`,
                          flexShrink: 0,
                        }} />
                      </div>
                      <span style={card.axisPoleRight}>{poles.right}</span>
                    </div>
                    {/* Context sentence */}
                    <p style={card.axisContext}>{context}</p>
                  </div>
                );
              })}
            </div>

            {/* Personal phrases */}
            <div style={card.divider} />
            <p style={card.phraseLabel}>{lang === 'fr' ? 'En quelques mots' : 'In a few words'}</p>
            <div>
              {phrases.map((phrase, i) => (
                <div key={i} style={{ ...card.phraseRow, marginBottom: i < phrases.length - 1 ? 7 : 0 }}>
                  <span style={card.phraseDash}>—</span>
                  <p style={card.phraseText}>{phrase}</p>
                </div>
              ))}
            </div>

            {/* Closest historical figure */}
            {topFigure && (
              <div style={card.figureRow}>
                <span style={card.figureEmoji}>{topFigure.emoji ?? '👤'}</span>
                <p style={card.figureText}>
                  <span style={{ color: 'rgba(255,255,255,0.35)' }}>
                    {lang === 'fr' ? 'Proche de ' : 'Close to '}
                  </span>
                  <span style={{ color: 'rgba(255,255,255,0.72)', fontWeight: 600 }}>{topFigure.name}</span>
                </p>
                <span style={card.figureScore}>{topFigure.alignment}%</span>
              </div>
            )}

            {/* Reliability */}
            <div style={{ marginTop: 14 }}>
              <div style={card.reliabilityRow}>
                <span style={card.reliabilityLabel}>{lang === 'fr' ? 'Fiabilité du profil' : 'Profile reliability'}</span>
                <span style={card.reliabilityPct}>{reliabilityPct}%</span>
              </div>
              <p style={card.reliabilitySub}>{reliabilityLabel}</p>
            </div>

            {/* Footer */}
            <div style={card.footer}>
              <span style={card.footerCta}>{lang === 'fr' ? 'Et toi ?' : 'What about you?'}</span>
              <span style={card.footerUrl}>poliscop.org</span>
            </div>

          </div>
        </div>

        {/* ── Action buttons ── */}
        <div className="flex flex-col gap-2.5 mt-4">

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
                ? (lang === 'fr' ? 'Texte copié !' : 'Text copied!')
                : (lang === 'fr' ? 'Copier le message' : 'Copy share text')}
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
               : downloadStatus === 'done'  ? (lang === 'fr' ? 'Téléchargé !' : 'Downloaded!')
               : downloadStatus === 'error' ? (lang === 'fr' ? 'Erreur'       : 'Error')
               :                              (lang === 'fr' ? 'Image'        : 'Save image')}
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
                  ? (lang === 'fr' ? 'Copié !'        : 'Copied!')
                  : (lang === 'fr' ? 'Copier le lien' : 'Copy link')}
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
          {lang === 'fr' ? 'Fermer' : 'Close'}
        </button>

      </motion.div>
    </motion.div>
  );
}
