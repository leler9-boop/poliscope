import React, { useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useStore } from '../store/useStore.js';
import { createTranslator } from '../i18n/translations.js';
import { elections } from '../data/elections.js';
import { candidateDetails } from '../data/candidateDetails.js';
import { THEMES_ORDER, THEME_LABELS, THEME_COLORS } from '../data/questions.js';
import { CANDIDATE_POLICIES, POLICY_ELECTION_IDS } from '../data/candidatePolicies.js';
import { CandidateAvatar } from '../components/LazyImage.jsx';
import { trackCandidateViewed, trackCompareStarted } from '../lib/analytics.js';
import { ThemeComparison } from '../components/CompareBar.jsx';


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

  // Support direct URL access (/candidates/:id)
  const { id: paramId } = useParams();
  const candidateId = paramId ?? selectedCandidateId;

  useEffect(() => {
    if (paramId && paramId !== selectedCandidateId) {
      useStore.setState({ selectedCandidateId: paramId, currentPage: 'candidateProfile' });
    }
  }, [paramId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Track candidate view once candidateId is known
  useEffect(() => {
    if (candidateId) trackCandidateViewed({ candidateId });
  }, [candidateId]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCompare = useCallback((id1, id2) => {
    trackCompareStarted({ id1, id2 });
    startCompare(id1, id2);
  }, [startCompare]);

  const found = findCandidate(candidateId);

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

      {/* Ideological positions — dual-marker axis per theme */}
      <section className="mb-8">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
          {language === 'fr' ? 'Positions idéologiques' : 'Ideological positions'}
        </h2>
        <ThemeComparison
          userThemes={userThemes}
          targetThemes={candidate.profile}
          targetName={candidate.name.split(' ').pop()}
          language={language}
          policyTexts={
            POLICY_ELECTION_IDS.has(election.id)
              ? Object.fromEntries(
                  Object.entries(CANDIDATE_POLICIES[candidateId] ?? {}).map(([theme, vals]) => [
                    theme,
                    (() => {
                      const uScore = userThemes?.[theme];
                      const cScore = candidate.profile?.[theme] ?? 50;
                      const diff   = uScore != null ? Math.abs(uScore - cScore) : null;
                      return diff != null && diff < 28 ? (vals?.[language] ?? null) : null;
                    })(),
                  ])
                )
              : {}
          }
        />
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
              .map(c => (
                  <button
                    key={c.id}
                    onClick={() => handleCompare(candidate.id, c.id)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 text-xs font-medium text-gray-600 hover:border-gray-800 hover:text-gray-900 bg-white transition-all"
                  >
                    <CandidateAvatar src={c.image} name={c.name} size={18} />
                    vs {c.name}
                  </button>
                ))}
          </div>
        </section>
      )}
    </div>
  );
}
