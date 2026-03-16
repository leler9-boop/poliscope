import React from 'react';
import { useStore } from '../store/useStore.js';
import { createTranslator } from '../i18n/translations.js';
import { elections } from '../data/elections.js';
import { THEMES_ORDER, THEME_LABELS, THEME_COLORS } from '../data/questions.js';

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
  const language     = useStore(s => s.language);
  const navigate     = useStore(s => s.navigate);
  const compareIds   = useStore(s => s.compareIds);
  const selectCandidate = useStore(s => s.selectCandidate);
  const profile      = useStore(s => s.profile);
  const profileAdjustments = useStore(s => s.profileAdjustments);

  const [id1, id2] = compareIds ?? [];
  const r1 = id1 ? findCandidate(id1) : null;
  const r2 = id2 ? findCandidate(id2) : null;

  if (!r1 || !r2) {
    navigate('elections');
    return null;
  }

  const c1 = r1.candidate;
  const c2 = r2.candidate;

  // Adjusted user themes for reference
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
            className="flex flex-col items-center gap-2 p-4 bg-white border border-gray-200 rounded-2xl hover:border-gray-400 hover:shadow-sm transition-all text-left"
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

      {/* Theme comparison table */}
      <section className="mb-8">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
          {language === 'fr' ? 'Comparaison par thème' : 'Theme comparison'}
        </h2>

        {/* Column labels */}
        <div className="grid grid-cols-[1fr_auto_auto] gap-x-3 mb-2 px-1">
          <div />
          <div className="w-24 text-center text-xs font-medium text-gray-500 truncate">{c1.name.split(' ').pop()}</div>
          <div className="w-24 text-center text-xs font-medium text-gray-500 truncate">{c2.name.split(' ').pop()}</div>
        </div>

        <div className="space-y-4">
          {THEMES_ORDER.map(theme => {
            const label = THEME_LABELS[language]?.[theme] ?? theme;
            const color = THEME_COLORS[theme] ?? '#6b7280';
            const s1 = c1.profile?.[theme] ?? 50;
            const s2 = c2.profile?.[theme] ?? 50;
            const diff = Math.abs(s1 - s2);

            return (
              <div key={theme}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm text-gray-600">{label}</span>
                  {diff >= 25 && (
                    <span className="text-xs font-semibold px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-600">
                      Δ{diff}
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[{ c: c1, s: s1 }, { c: c2, s: s2 }].map(({ c, s }) => (
                    <div key={c.id}>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${s}%`, backgroundColor: color }} />
                        </div>
                        <span className="text-xs tabular-nums text-gray-500 w-6 text-right flex-shrink-0">{s}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* User reference section (only if profile exists) */}
      {userThemes && (
        <section className="mb-8 bg-blue-50 border border-blue-100 rounded-2xl p-5">
          <h2 className="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-4">
            {language === 'fr' ? 'Votre profil (référence)' : 'Your profile (reference)'}
          </h2>
          <div className="space-y-2.5">
            {THEMES_ORDER.map(theme => {
              const label = THEME_LABELS[language]?.[theme] ?? theme;
              const color = THEME_COLORS[theme] ?? '#6b7280';
              const u = userThemes[theme] ?? 50;
              const s1 = c1.profile?.[theme] ?? 50;
              const s2 = c2.profile?.[theme] ?? 50;
              const d1 = Math.abs(u - s1);
              const d2 = Math.abs(u - s2);
              // Who is closer
              const closer = d1 < d2 ? c1 : d2 < d1 ? c2 : null;
              return (
                <div key={theme} className="flex items-center gap-3">
                  <span className="text-xs text-blue-700 w-28 flex-shrink-0">{label}</span>
                  <div className="flex-1 h-1.5 bg-blue-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${u}%`, backgroundColor: '#3b82f6' }} />
                  </div>
                  <span className="text-xs tabular-nums text-blue-500 w-6 text-right flex-shrink-0">{u}</span>
                  {closer && (
                    <span className="text-xs text-blue-400 flex-shrink-0" style={{ minWidth: 60 }}>
                      → {closer.name.split(' ').pop()}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

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
