import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
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

/** Single bar row: label | ████░░░ | score */
function ThemeBarRow({ label, score, color, delay = 0 }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-16 flex-shrink-0 text-xs text-gray-500 text-right truncate">{label}</span>
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.85, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
        />
      </div>
      <span className="w-7 flex-shrink-0 text-right text-xs font-semibold tabular-nums text-gray-500">{score}</span>
    </div>
  );
}

/** Two candidates (+ optional user) — one labeled bar per row, same scale */
function CompareAxis({ s1, s2, userScore, color1, color2, leftLabel, rightLabel, diff, sentence, c1Name, c2Name, language, delay = 0 }) {
  const hasUser  = userScore != null;
  const n1       = c1Name.split(' ').pop();
  const n2       = c2Name.split(' ').pop();
  const youLabel = language === 'fr' ? 'Vous' : 'You';

  return (
    <div className="space-y-2">
      {/* Row 1 — user (if available) */}
      {hasUser && (
        <ThemeBarRow label={youLabel} score={Math.round(userScore)} color="#1f2937" delay={delay} />
      )}
      {/* Row 2 — candidate 1 */}
      <ThemeBarRow label={n1} score={Math.round(s1)} color={color1} delay={delay + (hasUser ? 0.08 : 0)} />
      {/* Row 3 — candidate 2 */}
      <ThemeBarRow label={n2} score={Math.round(s2)} color={color2} delay={delay + (hasUser ? 0.16 : 0.08)} />

      {/* Pole labels aligned with bars */}
      <div className="flex items-center gap-3">
        <div className="w-16 flex-shrink-0" />
        <div className="flex-1 flex justify-between">
          <span className="text-[10px] text-gray-300">{leftLabel}</span>
          <span className="text-[10px] text-gray-300">{rightLabel}</span>
        </div>
        <div className="w-7 flex-shrink-0" />
      </div>

      {/* Diff label + sentence */}
      <div className="flex items-start gap-3">
        <div className="w-16 flex-shrink-0" />
        <div className="flex-1 pb-1">
          <span className="text-xs font-semibold" style={{ color: diffColor(diff) }}>
            {diffLabel(diff, language)}
          </span>
          <motion.p
            className="text-xs text-gray-400 leading-relaxed mt-0.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + 0.8 }}
          >
            {sentence}
          </motion.p>
        </div>
        <div className="w-7 flex-shrink-0" />
      </div>
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

  // Support direct URL access (/compare/:id1/:id2)
  const { id1: paramId1, id2: paramId2 } = useParams();

  useEffect(() => {
    if (paramId1 && paramId2 && (paramId1 !== compareIds[0] || paramId2 !== compareIds[1])) {
      useStore.setState({ compareIds: [paramId1, paramId2], currentPage: 'compareView' });
    }
  }, [paramId1, paramId2]); // eslint-disable-line react-hooks/exhaustive-deps

  const [id1, id2] = (paramId1 && paramId2) ? [paramId1, paramId2] : (compareIds ?? []);
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
              ? 'Votre position (gris foncé) et celles des deux candidats.'
              : 'Your position (dark) alongside both candidates.'}
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
