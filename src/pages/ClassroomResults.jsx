import React, { useMemo } from 'react';
import { useStore } from '../store/useStore.js';
import { AXES_LABELS, recalculateAxes } from '../engine/scorer.js';
import { getArchetype } from '../engine/archetypeEngine.js';
import { rankByAlignment } from '../engine/matcher.js';
import { ideologicalCurrents } from '../data/ideologicalCurrents.js';
import { THEMES_ORDER, THEME_LABELS, THEME_COLORS } from '../data/questions.js';
import AxisBar from '../components/AxisBar.jsx';

export default function ClassroomResults({ profileOverride = null, languageOverride = null }) {
  const storedLanguage = useStore(s => s.language);
  const storedProfile = useStore(s => s.profile);
  const language = languageOverride ?? storedLanguage;
  const profile = profileOverride ?? storedProfile;
  const priorityOrder = useStore(s => s.priorityOrder);
  const exitClassroom = useStore(s => s.exitClassroom);
  const startClassroomTest = useStore(s => s.startClassroomTest);
  const fr = language === 'fr';
  const themes = profile?.themes ?? {};
  const axes = useMemo(() => recalculateAxes(themes) ?? {}, [themes]);
  const archetype = useMemo(() => getArchetype(themes, priorityOrder), [themes, priorityOrder]);
  const currents = useMemo(
    () => rankByAlignment({ themes }, ideologicalCurrents, priorityOrder).slice(0, 3),
    [themes, priorityOrder],
  );

  if (!profile) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-14">
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 mb-6">
        <p className="font-bold text-emerald-900">{fr ? 'Résultat pédagogique — aucun candidat affiché' : 'Educational result — no candidates shown'}</p>
        <p className="text-sm text-emerald-800 mt-1">{fr ? 'Rien n’a été envoyé ni conservé. Cette session disparaît si vous rechargez ou quittez ce mode.' : 'Nothing was sent or retained. This session disappears when you reload or leave this mode.'}</p>
      </div>

      <header className="mb-8">
        <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2">Poliscop Classe</p>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-950 mb-3">
          {archetype?.name?.[language] ?? (fr ? 'Votre profil' : 'Your profile')}
        </h1>
        <p className="text-slate-600 leading-relaxed max-w-2xl">
          {archetype?.description?.[language] ?? ''}
        </p>
        <p className="text-xs text-slate-400 mt-3">
          {fr ? 'Ce rapprochement est un outil de lecture, pas une identité définitive.' : 'This comparison is a reading aid, not a permanent identity.'}
        </p>
      </header>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 mb-6">
        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-6">{fr ? 'Trois grands axes' : 'Three main dimensions'}</h2>
        <div className="grid sm:grid-cols-3 gap-x-8">
          {['social', 'institutional', 'international'].map((key, index) => {
            const info = AXES_LABELS[key]?.[language];
            return info ? <AxisBar key={key} label={info.label} score={axes[key]} leftLabel={info.left} rightLabel={info.right} language={language} delay={index * 0.08} /> : null;
          })}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 mb-6">
        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-5">{fr ? 'Vos huit thèmes' : 'Your eight themes'}</h2>
        <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4">
          {THEMES_ORDER.map(theme => (
            <div key={theme}>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="font-semibold text-slate-700">{THEME_LABELS[language]?.[theme]}</span>
                <span className="tabular-nums text-slate-400">{Math.round(themes[theme] ?? 50)}/100</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${Math.round(themes[theme] ?? 50)}%`, backgroundColor: THEME_COLORS[theme] }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 mb-6">
        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">{fr ? 'Courants à explorer' : 'Traditions to explore'}</h2>
        <p className="text-sm text-slate-500 mb-4">{fr ? 'Ces proximités ouvrent des pistes de lecture. Elles ne disent pas pour qui voter.' : 'These similarities suggest topics to explore. They do not say how to vote.'}</p>
        <div className="grid sm:grid-cols-3 gap-3">
          {currents.map(current => (
            <article key={current.id} className="rounded-xl border border-slate-200 p-4">
              <p className="font-bold text-slate-900">{current.name?.[language]}</p>
              <p className="text-xs text-slate-400 mt-1">{current.alignment}/100 {fr ? 'de proximité' : 'alignment'}</p>
              <p className="text-xs text-slate-600 leading-relaxed mt-3">{current.shortDesc?.[language]}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl bg-blue-50 border border-blue-200 p-5 mb-7">
        <h2 className="font-bold text-blue-950 mb-2">{fr ? 'Question pour le débat' : 'Discussion prompt'}</h2>
        <p className="text-sm text-blue-900 leading-relaxed">{fr ? 'Quel résultat vous surprend le plus ? Retrouvez une question qui a pu l’influencer, puis formulez le meilleur argument possible en faveur de la position opposée.' : 'Which result surprises you most? Find a question that may have shaped it, then formulate the strongest possible argument for the opposite position.'}</p>
      </section>

      <div className="flex flex-col sm:flex-row gap-3">
        <button onClick={() => startClassroomTest()} className="min-h-[48px] px-5 rounded-xl bg-slate-950 text-white font-bold hover:bg-slate-800">{fr ? 'Refaire une session' : 'Start another session'}</button>
        <button onClick={exitClassroom} className="min-h-[48px] px-5 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-white">{fr ? 'Quitter et effacer la session' : 'Leave and erase session'}</button>
      </div>
    </div>
  );
}
