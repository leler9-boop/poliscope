import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useStore } from '../store/useStore.js';
import { createTranslator } from '../i18n/translations.js';
import { elections } from '../data/elections.js';
import { THEMES_ORDER, THEME_LABELS, THEME_COLORS } from '../data/questions.js';
import { ThemeComparisonThree } from '../components/CompareBar.jsx';


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

  // Redirect in an effect, not during render — calling navigate() (a state
  // setter) synchronously in the render body trips React's "Cannot update a
  // component while rendering a different component" warning.
  useEffect(() => {
    if (!r1 || !r2) navigate('elections');
  }, [r1, r2]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!r1 || !r2) return null;

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

      {/* Unified axis comparison — three-marker dual-axis */}
      <section className="mb-8">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
          {language === 'fr' ? 'Comparaison par thème' : 'Theme comparison'}
        </h2>
        <ThemeComparisonThree
          userThemes={userThemes}
          themes1={c1.profile}
          themes2={c2.profile}
          name1={c1.name}
          name2={c2.name}
          language={language}
        />
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
