import React from 'react';
import { useStore } from '../store/useStore.js';
import { createTranslator } from '../i18n/translations.js';
import { elections } from '../data/elections.js';
import { candidateDetails } from '../data/candidateDetails.js';
import { THEMES_ORDER, THEME_LABELS, THEME_COLORS } from '../data/questions.js';

function findCandidate(id) {
  for (const election of elections) {
    const c = election.candidates.find(c => c.id === id);
    if (c) return { candidate: c, election };
  }
  return null;
}

// Normalise variant IDs like lepen_2027 → lepen, hidalgo_paris → hidalgo
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
  const language           = useStore(s => s.language);
  const navigate           = useStore(s => s.navigate);
  const selectedCandidateId = useStore(s => s.selectedCandidateId);
  const startCompare       = useStore(s => s.startCompare);
  const t = createTranslator(language);

  const found = findCandidate(selectedCandidateId);

  if (!found) {
    navigate('elections');
    return null;
  }

  const { candidate, election } = found;
  const details  = candidateDetails[selectedCandidateId] ?? candidateDetails[baseId(selectedCandidateId)] ?? {};
  const timeline  = details.timeline  ?? [];
  const positions = details.positions?.[language] ?? [];

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

      {/* Ideological profile */}
      <section className="mb-8">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
          {language === 'fr' ? 'Profil idéologique' : 'Ideological profile'}
        </h2>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 space-y-3">
          {THEMES_ORDER.map(theme => {
            const score = candidate.profile?.[theme] ?? 50;
            const label = THEME_LABELS[language]?.[theme] ?? theme;
            const color = THEME_COLORS[theme] ?? '#6b7280';
            return (
              <div key={theme}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600">{label}</span>
                  <span className="text-sm font-semibold tabular-nums" style={{ color }}>{score}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${score}%`, backgroundColor: color }} />
                </div>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-gray-400 mt-3 leading-relaxed">
          {language === 'fr'
            ? 'Scores analytiques basés sur les positions publiques. 0 = gauche/progressiste/ouvert, 100 = droite/conservateur/fermé (la signification varie par thème).'
            : 'Analytical scores based on public positions. 0 = left/progressive/open, 100 = right/conservative/restrictive (meaning varies by theme).'}
        </p>
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
                      <span className="w-4.5 h-4.5 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs" style={{ width: 18, height: 18, backgroundColor: c.color ?? '#374151', fontSize: 8 }}>{initials}</span>
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
