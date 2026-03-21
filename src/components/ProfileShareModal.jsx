import React, { useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { rankByAlignment } from '../engine/matcher.js';
import { historicalFigures } from '../data/historicalFigures.js';
import RadarChart from './RadarChart.jsx';

const canNativeShare = typeof navigator !== 'undefined' && !!navigator.share;

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

function getTendencyTags(themes, lang) {
  const { ECONOMY, SOCIAL, IMMIGRATION, SECURITY, ENVIRONMENT, PUBLIC_SERVICES, GLOBAL, DEMOCRACY } = themes;
  const econScore   = Math.round((ECONOMY + (100 - PUBLIC_SERVICES)) / 2);
  const socialScore = Math.round((SOCIAL  + (100 - IMMIGRATION))     / 2);

  const tag1 = econScore < 43   ? { fr: 'solidarité',       en: 'solidarity'    }
             : econScore > 57   ? { fr: 'liberté',           en: 'freedom'       }
             :                    { fr: 'pragmatisme',        en: 'pragmatism'    };

  const tag2 = socialScore < 43 ? { fr: 'stabilité',        en: 'stability'     }
             : socialScore > 57 ? { fr: 'progressisme',      en: 'progressivism' }
             :                    { fr: 'compromis',          en: 'compromise'    };

  // Third: most deviant from 50 among remaining themes
  const candidates = { ENVIRONMENT, SECURITY, GLOBAL, DEMOCRACY };
  const [maxKey, maxVal] = Object.entries(candidates).reduce((a, b) =>
    Math.abs(b[1] - 50) > Math.abs(a[1] - 50) ? b : a
  );
  const hi = maxVal >= 50;
  const tag3 = {
    ENVIRONMENT: hi ? { fr: 'écologie',      en: 'ecology'      } : { fr: 'croissance',    en: 'growth'       },
    SECURITY:    hi ? { fr: 'sécurité',       en: 'security'     } : { fr: 'libertés',      en: 'freedoms'     },
    GLOBAL:      hi ? { fr: 'coopération',    en: 'cooperation'  } : { fr: 'souveraineté',  en: 'sovereignty'  },
    DEMOCRACY:   hi ? { fr: 'participation',  en: 'participation'} : { fr: 'autorité',      en: 'authority'    },
  }[maxKey] ?? { fr: 'équilibre', en: 'balance' };

  return [tag1, tag2, tag3].map(t => t[lang] ?? t.en);
}

function getSubtitle(themes, lang) {
  const { ECONOMY, SOCIAL, IMMIGRATION, PUBLIC_SERVICES } = themes;
  const econScore   = Math.round((ECONOMY + (100 - PUBLIC_SERVICES)) / 2);
  const socialScore = Math.round((SOCIAL  + (100 - IMMIGRATION))     / 2);

  const isCenter = econScore >= 40 && econScore <= 60 && socialScore >= 40 && socialScore <= 60;
  if (isCenter) return lang === 'fr' ? 'Profil modéré et pragmatique' : 'Moderate, pragmatic profile';

  const econAdj   = econScore   < 40 ? { fr: 'social',        en: 'social'        }
                  : econScore   > 60 ? { fr: 'libéral',        en: 'liberal'       }
                  :                    { fr: 'équilibré',       en: 'balanced'      };

  const socialAdj = socialScore < 40 ? { fr: 'conservateur',   en: 'conservative'  }
                  : socialScore > 60 ? { fr: 'progressiste',    en: 'progressive'   }
                  :                    { fr: 'modéré',          en: 'moderate'      };

  if (lang === 'fr') return `Profil ${socialAdj.fr} et ${econAdj.fr}`;
  const s = socialAdj.en;
  return `${s.charAt(0).toUpperCase() + s.slice(1)}, ${econAdj.en} profile`;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ProfileShareModal({
  themes,
  rankedCurrents,
  language,
  onClose,
}) {
  const cardRef = useRef(null);
  const [copyStatus,     setCopyStatus]     = useState(null);
  const [downloadStatus, setDownloadStatus] = useState(null);
  const [shareStatus,    setShareStatus]    = useState(null);

  const topCurrent  = rankedCurrents?.[0];
  const accentColor = topCurrent?.color ?? '#2563eb';
  const lang = language === 'fr' ? 'fr' : 'en';

  const topFigure = useMemo(() => {
    if (!themes) return null;
    const ranked = rankByAlignment({ themes }, historicalFigures, []);
    return ranked[0] ?? null;
  }, [themes]);

  const phrases     = useMemo(() => themes ? getPersonalPhrases(themes, lang) : [], [themes, lang]);
  const tags        = useMemo(() => themes ? getTendencyTags(themes, lang)    : [], [themes, lang]);
  const subtitle    = useMemo(() => themes ? getSubtitle(themes, lang)        : '', [themes, lang]);

  const shareText = lang === 'fr'
    ? `Je viens de cartographier mon profil politique sur Poliscope. Curieux(se) de savoir où tu te situes ? Essaie ici → https://poliscope.app`
    : `I just mapped my political profile on Poliscope. Curious where you stand? Try it → https://poliscope.app`;

  const handleNativeShare = async () => {
    if (!canNativeShare) return;
    setShareStatus('sharing');
    try {
      await navigator.share({
        title: lang === 'fr' ? 'Mon profil politique – Poliscope' : 'My political profile – Poliscope',
        text: shareText,
        url: 'https://poliscope.app',
      });
      setShareStatus('done');
      setTimeout(() => setShareStatus(null), 2500);
    } catch {
      setShareStatus(null);
    }
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
            background: 'linear-gradient(145deg, #0f172a 0%, #1a2540 55%, #0f172a 100%)',
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
          }}
        >
          {/* Accent top bar */}
          <div style={{ height: 4, background: `linear-gradient(90deg, ${accentColor}, ${accentColor}88)` }} />

          <div style={{ padding: '22px 24px 20px' }}>

            {/* Brand row */}
            <motion.div
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}
              {...fadeUp(0.04)}
            >
              <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase' }}>
                POLISCOPE
              </span>
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.05em' }}>
                {lang === 'fr' ? 'profil politique' : 'political profile'}
              </span>
            </motion.div>

            {/* "Je suis plutôt" + current name */}
            <motion.div {...fadeUp(0.1)}>
              <p style={{ fontSize: 11, fontWeight: 500, color: 'rgba(255,255,255,0.38)', marginBottom: 4, letterSpacing: '0.02em' }}>
                {lang === 'fr' ? 'Je suis plutôt' : 'I am rather'}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                {topCurrent?.icon && (
                  <span style={{ fontSize: 22, lineHeight: 1, flexShrink: 0 }}>{topCurrent.icon}</span>
                )}
                <h2 style={{
                  fontSize: 26,
                  fontWeight: 800,
                  margin: 0,
                  color: accentColor,
                  letterSpacing: '-0.02em',
                  lineHeight: 1.1,
                }}>
                  {topCurrent?.name[language]}
                </h2>
              </div>
              {/* Subtitle */}
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginBottom: 18, fontStyle: 'italic', letterSpacing: '0.01em' }}>
                {subtitle}
              </p>
            </motion.div>

            {/* Divider */}
            <div style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.06)', marginBottom: 16 }} />

            {/* Personal phrases */}
            <motion.div style={{ marginBottom: 18 }} {...fadeUp(0.18)}>
              {phrases.map((phrase, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: i < phrases.length - 1 ? 8 : 0 }}>
                  <span style={{ color: accentColor, fontSize: 13, lineHeight: 1.45, flexShrink: 0, marginTop: 1 }}>—</span>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', lineHeight: 1.45, margin: 0 }}>
                    {phrase}
                  </p>
                </div>
              ))}
            </motion.div>

            {/* Divider */}
            <div style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.06)', marginBottom: 16 }} />

            {/* Radar + tendency tags */}
            <motion.div
              style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}
              {...fadeUp(0.26)}
            >
              <div style={{ flexShrink: 0 }}>
                <RadarChart themes={themes} language={language} size={110} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 8 }}>
                  {lang === 'fr' ? 'Mes tendances' : 'My tendencies'}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {tags.map((tag, i) => (
                    <div key={i} style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      backgroundColor: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 20,
                      padding: '4px 10px',
                      width: 'fit-content',
                    }}>
                      <div style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: accentColor, opacity: 0.75, flexShrink: 0 }} />
                      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>{tag}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Closest historical figure */}
            {topFigure && (
              <motion.div
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  borderRadius: 10, padding: '9px 12px',
                  marginBottom: 18,
                  border: '1px solid rgba(255,255,255,0.07)',
                }}
                {...fadeUp(0.34)}
              >
                <span style={{ fontSize: 20, lineHeight: 1, flexShrink: 0 }}>{topFigure.emoji ?? '👤'}</span>
                <p style={{ flex: 1, fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.65)', margin: 0, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                  {lang === 'fr' ? `Profil proche de ` : `Profile close to `}
                  <span style={{ color: 'white', fontWeight: 700 }}>{topFigure.name}</span>
                </p>
                <span style={{ fontSize: 15, fontWeight: 800, color: accentColor, flexShrink: 0 }}>
                  {topFigure.alignment}%
                </span>
              </motion.div>
            )}

            {/* Footer CTA */}
            <motion.div
              style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                paddingTop: 14,
                borderTop: '1px solid rgba(255,255,255,0.07)',
              }}
              {...fadeUp(0.4)}
            >
              <span style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.02em' }}>
                {lang === 'fr' ? 'Et toi ?' : 'What about you?'}
              </span>
              <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.22)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                poliscope.app
              </span>
            </motion.div>

          </div>
        </div>

        {/* ── Action buttons ── */}
        <div className="flex flex-col gap-2.5 mt-4">

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
                ? (lang === 'fr' ? 'Partagé !' : 'Shared!')
                : (lang === 'fr' ? 'Partager mon profil' : 'Share my profile')}
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
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.15 }}
            >
              {downloadStatus === 'loading' ? <span className="opacity-60 text-xs">…</span>
               : downloadStatus === 'done'  ? '✓'
               : downloadStatus === 'error' ? '✗'
               : '↓'}
              {downloadStatus === 'loading' ? (lang === 'fr' ? 'Export…'        : 'Exporting…')
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
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.15 }}
              >
                {copyStatus === 'copied' ? '✓' : '🔗'}
                {copyStatus === 'copied'
                  ? (lang === 'fr' ? 'Copié !'       : 'Copied!')
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
