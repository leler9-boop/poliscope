import React from 'react';
import { motion } from 'motion/react';
import { useStore } from '../store/useStore.js';
import { createTranslator } from '../i18n/translations.js';
import { elections } from '../data/elections.js';
import { candidateDetails } from '../data/candidateDetails.js';
import { THEMES_ORDER, THEME_LABELS, THEME_COLORS } from '../data/questions.js';

// Pole labels for each theme (0 = left pole, 100 = right pole)
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
  if (diff < 12) return language === 'fr' ? 'Très proches' : 'Very close';
  if (diff < 28) return language === 'fr' ? 'Proches' : 'Close';
  if (diff < 45) return language === 'fr' ? 'Différence modérée' : 'Moderate difference';
  return language === 'fr' ? 'Désaccord marqué' : 'Strong disagreement';
}

function diffSentence(diff, themeLabel, candidateName, language) {
  const name = candidateName.split(' ').pop();
  if (!diff && diff !== 0) return null;
  if (language === 'fr') {
    if (diff < 12) return `Vous et ${name} partagez des positions très similaires sur ${themeLabel.toLowerCase()}.`;
    if (diff < 28) return `Vos positions sur ${themeLabel.toLowerCase()} sont assez proches.`;
    if (diff < 45) return `Vous avez des différences modérées avec ${name} sur ${themeLabel.toLowerCase()}.`;
    return `Vous et ${name} avez des positions opposées sur ${themeLabel.toLowerCase()}.`;
  }
  if (diff < 12) return `You and ${name} share very similar views on ${themeLabel.toLowerCase()}.`;
  if (diff < 28) return `Your views on ${themeLabel.toLowerCase()} are fairly close to ${name}'s.`;
  if (diff < 45) return `You and ${name} have moderate differences on ${themeLabel.toLowerCase()}.`;
  return `You and ${name} hold opposing views on ${themeLabel.toLowerCase()}.`;
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

/** User vs candidate — two aligned bars on the same scale */
function ThemeAxis({ score, userScore, color, leftLabel, rightLabel, diff, themeLabel, candidateName, language, delay = 0 }) {
  const hasUser  = userScore != null;
  const shortName = candidateName.split(' ').pop();
  const youLabel  = language === 'fr' ? 'Vous' : 'You';

  return (
    <div className="space-y-2">
      {/* Row 1 — user */}
      {hasUser && (
        <ThemeBarRow label={youLabel} score={Math.round(userScore)} color="#1f2937" delay={delay} />
      )}
      {/* Row 2 — candidate */}
      <ThemeBarRow label={shortName} score={Math.round(score)} color={color} delay={delay + (hasUser ? 0.1 : 0)} />

      {/* Pole labels aligned with bars */}
      <div className="flex items-center gap-3">
        <div className="w-16 flex-shrink-0" />
        <div className="flex-1 flex justify-between">
          <span className="text-[10px] text-gray-300">{leftLabel}</span>
          <span className="text-[10px] text-gray-300">{rightLabel}</span>
        </div>
        <div className="w-7 flex-shrink-0" />
      </div>

      {/* Diff label + interpretation */}
      {hasUser && diff != null && (
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
              transition={{ delay: delay + 0.7 }}
            >
              {diffSentence(diff, themeLabel, candidateName, language)}
            </motion.p>
          </div>
          <div className="w-7 flex-shrink-0" />
        </div>
      )}
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

function baseId(id) {
  return id?.replace(/_2027$/, '').replace(/_paris$/, '') ?? id;
}

function Portrait({ candidate, size = 80 }) {
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
        className="rounded-full object-cover flex-shrink-0"
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <div
      className="rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
      style={{ width: size, height: size, backgroundColor: candidate.color ?? '#374151', fontSize: size / 3.5 }}
    >
      {initials}
    </div>
  );
}

export default function CandidateProfile() {
  const language            = useStore(s => s.language);
  const navigate            = useStore(s => s.navigate);
  const selectedCandidateId = useStore(s => s.selectedCandidateId);
  const startCompare        = useStore(s => s.startCompare);
  const profile             = useStore(s => s.profile);
  const profileAdjustments  = useStore(s => s.profileAdjustments);
  const t = createTranslator(language);

  const found = findCandidate(selectedCandidateId);

  if (!found) {
    navigate('elections');
    return null;
  }

  const { candidate, election } = found;
  const details   = candidateDetails[selectedCandidateId] ?? candidateDetails[baseId(selectedCandidateId)] ?? {};
  const timeline  = details.timeline ?? [];
  const positions = details.positions?.[language] ?? [];

  // Build adjusted user themes for comparison
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

      {/* Header */}
      <div className="flex items-start gap-5 mb-8">
        <Portrait candidate={candidate} size={80} />
        <div>
          <h1 className="text-2xl font-bold text-gray-900 leading-tight">{candidate.name}</h1>
          {candidate.party && (
            <p className="text-sm text-gray-500 mt-1">
              {typeof candidate.party === 'object' ? candidate.party[language] : candidate.party}
            </p>
          )}
          {candidate.result && (
            <p className="text-xs text-gray-400 mt-1">
              {election.flag} {election.title[language]}
              {' · '}
              {typeof candidate.result === 'object' ? candidate.result[language] : candidate.result}
            </p>
          )}
          <div className="mt-2">
            <span
              className="inline-block text-xs font-semibold text-white px-2.5 py-1 rounded-full"
              style={{ backgroundColor: candidate.color ?? '#374151' }}
            >
              {typeof candidate.party === 'object' ? candidate.party[language] : candidate.party}
            </span>
          </div>
        </div>
      </div>

      {/* Bio */}
      {candidate.description && (
        <section className="mb-8">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
            {language === 'fr' ? 'Profil' : 'Profile'}
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {typeof candidate.description === 'object' ? candidate.description[language] : candidate.description}
          </p>
        </section>
      )}

      {/* Key positions */}
      {positions.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
            {language === 'fr' ? 'Positions clés' : 'Key positions'}
          </h2>
          <ul className="space-y-2">
            {positions.map((pos, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700 leading-snug">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: candidate.color ?? '#9ca3af' }} />
                {pos}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Timeline */}
      {timeline.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
            {language === 'fr' ? 'Parcours' : 'Timeline'}
          </h2>
          <div className="relative pl-5 border-l-2 border-gray-100 space-y-4">
            {timeline.map((item, i) => (
              <div key={i} className="relative">
                <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-white border-2 border-gray-300" />
                <div className="flex gap-3 items-start">
                  <span className="text-xs font-bold text-gray-400 w-10 flex-shrink-0 pt-0.5">{item.year}</span>
                  <span className="text-sm text-gray-700 leading-snug">{item[language] ?? item.en}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Ideological positions — axis per theme */}
      <section className="mb-8">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">
          {language === 'fr' ? 'Positions idéologiques' : 'Ideological positions'}
        </h2>
        {userThemes && (
          <p className="text-xs text-gray-400 mb-5">
            {language === 'fr'
              ? 'Votre position (gris foncé) comparée à celle du candidat.'
              : 'Your position (dark) compared to the candidate\'s.'}
          </p>
        )}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 divide-y divide-gray-50">
          {THEMES_ORDER.map((theme, idx) => {
            const score      = candidate.profile?.[theme] ?? 50;
            const userScore  = userThemes?.[theme];
            const label      = THEME_LABELS[language]?.[theme] ?? theme;
            const color      = THEME_COLORS[theme] ?? '#6b7280';
            const poles      = THEME_AXES[theme]?.[language] ?? THEME_AXES[theme]?.en ?? {};
            const diff       = userScore != null ? Math.abs(score - userScore) : null;
            return (
              <div key={theme} className={idx > 0 ? 'pt-5' : ''}>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">{label}</p>
                <ThemeAxis
                  score={score}
                  userScore={userScore}
                  color={color}
                  leftLabel={poles.left}
                  rightLabel={poles.right}
                  diff={diff}
                  themeLabel={label}
                  candidateName={candidate.name}
                  language={language}
                  delay={0.08 + idx * 0.05}
                />
              </div>
            );
          })}
        </div>
      </section>

      {/* Compare with others */}
      {election.candidates.filter(c => c.id !== candidate.id).length > 0 && (
        <section className="border-t border-gray-100 pt-6">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
            {language === 'fr' ? 'Comparer avec' : 'Compare with'}
          </h2>
          <div className="flex flex-wrap gap-2">
            {election.candidates
              .filter(c => c.id !== candidate.id)
              .map(c => {
                const initials = c.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
                return (
                  <button
                    key={c.id}
                    onClick={() => startCompare(candidate.id, c.id)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 text-xs font-medium text-gray-600 hover:border-gray-800 hover:text-gray-900 bg-white transition-all"
                  >
                    {c.image ? (
                      <img src={c.image} alt={c.name} width={18} height={18} className="rounded-full object-cover flex-shrink-0" style={{ width: 18, height: 18 }} />
                    ) : (
                      <span className="rounded-full flex-shrink-0 flex items-center justify-center text-white" style={{ width: 18, height: 18, backgroundColor: c.color ?? '#374151', fontSize: 8 }}>{initials}</span>
                    )}
                    vs {c.name}
                  </button>
                );
              })}
          </div>
        </section>
      )}
    </div>
  );
}
