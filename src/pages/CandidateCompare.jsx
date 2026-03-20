import React from 'react';
import { motion } from 'motion/react';
import { useStore } from '../store/useStore.js';
import { createTranslator } from '../i18n/translations.js';
import { elections } from '../data/elections.js';
import { THEMES_ORDER, THEME_LABELS, THEME_COLORS } from '../data/questions.js';

const THEME_AXES = {
  ECONOMY:         { en: { left: 'Redistribution', right: 'Free market'    }, fr: { left: 'Redistribution', right: 'Marché libre'      } },
  SOCIAL:          { en: { left: 'Traditional',     right: 'Progressive'    }, fr: { left: 'Traditionnel',   right: 'Progressiste'      } },
  IMMIGRATION:     { en: { left: 'Restrictive',     right: 'Open'           }, fr: { left: 'Restrictive',    right: 'Ouverte'           } },
  SECURITY:        { en: { left: 'State security',  right: 'Civil liberties'}, fr: { left: 'Sécurité d\'État','right': 'Libertés civiles'} },
  ENVIRONMENT:     { en: { left: 'Growth first',    right: 'Ecology first'  }, fr: { left: 'Croissance',     right: 'Écologie'          } },
  DEMOCRACY:       { en: { left: 'Strong state',    right: 'Participative'  }, fr: { left: 'État fort',      right: 'Participatif'      } },
  GLOBAL:          { en: { left: 'Sovereignty',     right: 'Multilateralism'}, fr: { left: 'Souveraineté',   right: 'Multilatéralisme'  } },
  PUBLIC_SERVICES: { en: { left: 'Private sector',  right: 'Public services'}, fr: { left: 'Secteur privé',  right: 'Services publics'  } },
};

function diffColor(diff) {
  if (diff < 12) return '#16a34a';
  if (diff < 28) return '#2563eb';
  if (diff < 45) return '#d97706';
  return '#dc2626';
}

function diffLabel(diff, language) {
  if (diff < 12) return language === 'fr' ? 'Très proches' : 'Very similar';
  if (diff < 28) return language === 'fr' ? 'Proches' : 'Close';
  if (diff < 45) return language === 'fr' ? 'Différence modérée' : 'Moderate difference';
  return language === 'fr' ? 'Désaccord marqué' : 'Strong disagreement';
}

function compareSentence(s1, s2, c1Name, c2Name, userScore, themeLabel, language) {
  const diff = Math.abs(s1 - s2);
  const n1 = c1Name.split(' ').pop();
  const n2 = c2Name.split(' ').pop();
  const theme = themeLabel.toLowerCase();

  let base;
  if (language === 'fr') {
    if (diff < 12) base = `${n1} et ${n2} ont des positions très similaires sur ${theme}.`;
    else if (diff < 28) base = `${n1} et ${n2} ont des vues légèrement différentes sur ${theme}.`;
    else if (diff < 45) base = `${n1} et ${n2} diffèrent modérément sur ${theme}.`;
    else base = `${n1} et ${n2} ont des positions opposées sur ${theme}.`;
  } else {
    if (diff < 12) base = `${n1} and ${n2} share very similar views on ${theme}.`;
    else if (diff < 28) base = `${n1} and ${n2} have slightly different views on ${theme}.`;
    else if (diff < 45) base = `${n1} and ${n2} differ moderately on ${theme}.`;
    else base = `${n1} and ${n2} hold opposing views on ${theme}.`;
  }

  if (userScore == null) return base;
  const d1 = Math.abs(userScore - s1);
  const d2 = Math.abs(userScore - s2);
  if (Math.abs(d1 - d2) < 5) {
    return base + (language === 'fr' ? ' Vous êtes à égale distance des deux.' : ' You are equidistant from both.');
  }
  const closer = d1 < d2 ? n1 : n2;
  return base + (language === 'fr' ? ` Votre position se rapproche de ${closer}.` : ` Your views are closer to ${closer}.`);
}

/**
 * Shared axis showing two candidate dots (+ optional user dot).
 * c1 / c2 are candidates, user is optional.
 */
function CompareAxis({ s1, s2, userScore, color1, color2, leftLabel, rightLabel, diff, sentence, c1Name, c2Name, language, delay = 0 }) {
  const hasUser = userScore != null;

  return (
    <div>
      {/* Track */}
      <div className="relative h-2 bg-gray-100 rounded-full">
        {/* Center tick */}
        <div className="absolute top-1/2 -translate-y-1/2 w-px h-4 bg-gray-200" style={{ left: '50%' }} />

        {/* User dot (bottom layer) */}
        {hasUser && (
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-gray-800 border-2 border-gray-800 shadow z-10"
            initial={{ left: 'calc(50% - 8px)' }}
            animate={{ left: `calc(${userScore}% - 8px)` }}
            transition={{ duration: 1.1, delay, ease: [0.34, 1.15, 0.64, 1] }}
          />
        )}

        {/* c1 dot */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-[2.5px] shadow-md z-20"
          style={{ borderColor: color1 }}
          initial={{ left: 'calc(50% - 8px)' }}
          animate={{ left: `calc(${s1}% - 8px)` }}
          transition={{ duration: 1.1, delay: delay + 0.07, ease: [0.34, 1.15, 0.64, 1] }}
        />

        {/* c2 dot */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-[2.5px] shadow-md z-30"
          style={{ borderColor: color2 }}
          initial={{ left: 'calc(50% - 8px)' }}
          animate={{ left: `calc(${s2}% - 8px)` }}
          transition={{ duration: 1.1, delay: delay + 0.14, ease: [0.34, 1.15, 0.64, 1] }}
        />
      </div>

      {/* Pole labels */}
      <div className="flex justify-between mt-1.5 mb-2">
        <span className="text-xs text-gray-400">{leftLabel}</span>
        <span className="text-xs text-gray-400">{rightLabel}</span>
      </div>

      {/* Legend row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs text-gray-500 flex-wrap">
          {hasUser && (
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-gray-800 inline-block" />
              {language === 'fr' ? 'Vous' : 'You'}
            </span>
          )}
          <span className="flex items-center gap-1" style={{ color: color1 }}>
            <span className="w-2.5 h-2.5 rounded-full bg-white border-[2px] inline-block" style={{ borderColor: color1 }} />
            {c1Name.split(' ').pop()}
          </span>
          <span className="flex items-center gap-1" style={{ color: color2 }}>
            <span className="w-2.5 h-2.5 rounded-full bg-white border-[2px] inline-block" style={{ borderColor: color2 }} />
            {c2Name.split(' ').pop()}
          </span>
        </div>
        <span className="text-xs font-semibold flex-shrink-0" style={{ color: diffColor(diff) }}>
          {diffLabel(diff, language)}
        </span>
      </div>

      {/* Sentence */}
      <motion.p
        className="text-xs text-gray-500 mt-1.5 leading-relaxed"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.8 }}
      >
        {sentence}
      </motion.p>
    </div>
  );
}

function findCandidate(id) {
  for (const election of elections) {
    const c = election.candidates.find(c => c.id === id);
    if (c) return { candidate: c, election };
  }
  return null;
}

function Portrait({ candidate, size = 56 }) {
  const [err, setErr] = React.useState(false);
  const initials = candidate.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  if (candidate.image && !err) {
    return (
      <img
        src={candidate.image}
        alt={candidate.name}
        width={size}
        height={size}
        onError={() => setErr(true)}
        className="rounded-full object-cover"
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <div
      className="rounded-full flex items-center justify-center text-white font-bold"
      style={{ width: size, height: size, backgroundColor: candidate.color ?? '#374151', fontSize: size / 3.5 }}
    >
      {initials}
    </div>
  );
}

export default function CandidateCompare() {
  const language            = useStore(s => s.language);
  const navigate            = useStore(s => s.navigate);
  const compareIds          = useStore(s => s.compareIds);
  const selectCandidate     = useStore(s => s.selectCandidate);
  const profile             = useStore(s => s.profile);
  const profileAdjustments  = useStore(s => s.profileAdjustments);

  const [id1, id2] = compareIds ?? [];
  const r1 = id1 ? findCandidate(id1) : null;
  const r2 = id2 ? findCandidate(id2) : null;

  if (!r1 || !r2) {
    navigate('elections');
    return null;
  }

  const c1 = r1.candidate;
  const c2 = r2.candidate;

  const userThemes = React.useMemo(() => {
    if (!profile?.themes) return null;
    const themes = { ...profile.themes };
    Object.entries(profileAdjustments ?? {}).forEach(([k, v]) => {
      if (themes[k] != null) themes[k] = Math.max(0, Math.min(100, themes[k] + v));
    });
    return themes;
  }, [profile, profileAdjustments]);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Back */}
      <button
        onClick={() => navigate('electionDetail')}
        className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 mb-8 transition-colors"
      >
        ← {language === 'fr' ? 'Retour' : 'Back'}
      </button>

      <h1 className="text-xl font-bold text-gray-900 mb-8">
        {language === 'fr' ? 'Comparaison' : 'Candidate comparison'}
      </h1>

      {/* Candidate header cards */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {[{ r: r1, c: c1 }, { r: r2, c: c2 }].map(({ r, c }) => (
          <button
            key={c.id}
            onClick={() => selectCandidate(c.id)}
            className="flex flex-col items-center gap-2 p-4 bg-white border border-gray-200 rounded-2xl hover:border-gray-400 hover:shadow-sm transition-all"
          >
            <Portrait candidate={c} size={56} />
            <div className="text-center">
              <p className="text-sm font-semibold text-gray-900 leading-tight">{c.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">
                {typeof c.party === 'object' ? c.party[language] : c.party}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                {r.election.flag} {r.election.year}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Unified axis comparison */}
      <section className="mb-8">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">
          {language === 'fr' ? 'Comparaison par thème' : 'Theme comparison'}
        </h2>
        {userThemes && (
          <p className="text-xs text-gray-400 mb-5">
            {language === 'fr'
              ? 'Point sombre = votre position.'
              : 'Dark dot = your position.'}
          </p>
        )}

        <div className="bg-white border border-gray-100 rounded-2xl p-5 divide-y divide-gray-50">
          {THEMES_ORDER.map((theme, idx) => {
            const label  = THEME_LABELS[language]?.[theme] ?? theme;
            const poles  = THEME_AXES[theme]?.[language] ?? THEME_AXES[theme]?.en ?? {};
            const s1     = c1.profile?.[theme] ?? 50;
            const s2     = c2.profile?.[theme] ?? 50;
            const u      = userThemes?.[theme];
            const diff   = Math.abs(s1 - s2);
            const sentence = compareSentence(s1, s2, c1.name, c2.name, u, label, language);

            return (
              <div key={theme} className={idx > 0 ? 'pt-5' : ''}>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">{label}</p>
                <CompareAxis
                  s1={s1}
                  s2={s2}
                  userScore={u}
                  color1={c1.color ?? '#374151'}
                  color2={c2.color ?? '#9ca3af'}
                  leftLabel={poles.left}
                  rightLabel={poles.right}
                  diff={diff}
                  sentence={sentence}
                  c1Name={c1.name}
                  c2Name={c2.name}
                  language={language}
                  delay={0.06 + idx * 0.04}
                />
              </div>
            );
          })}
        </div>
      </section>

      {/* Bio side-by-side */}
      <section className="mb-8">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
          {language === 'fr' ? 'Résumé' : 'Summary'}
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {[c1, c2].map(c => (
            <div key={c.id} className="bg-white border border-gray-100 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: c.color ?? '#374151' }} />
                <p className="text-xs font-semibold text-gray-800">{c.name}</p>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                {typeof c.description === 'object' ? c.description[language] : c.description}
              </p>
              {c.result && (
                <p className="text-xs text-gray-400 mt-2">
                  {typeof c.result === 'object' ? c.result[language] : c.result}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Navigation */}
      <div className="flex flex-wrap gap-3 pt-2">
        <button
          onClick={() => selectCandidate(c1.id)}
          className="text-sm font-medium text-gray-600 border border-gray-200 px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
        >
          {language === 'fr' ? `Profil de ${c1.name.split(' ').pop()}` : `${c1.name.split(' ').pop()}'s profile`}
        </button>
        <button
          onClick={() => selectCandidate(c2.id)}
          className="text-sm font-medium text-gray-600 border border-gray-200 px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
        >
          {language === 'fr' ? `Profil de ${c2.name.split(' ').pop()}` : `${c2.name.split(' ').pop()}'s profile`}
        </button>
        <button
          onClick={() => navigate('electionDetail')}
          className="text-sm font-medium text-gray-600 border border-gray-200 px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
        >
          ← {language === 'fr' ? 'Résultats' : 'Results'}
        </button>
      </div>
    </div>
  );
}
