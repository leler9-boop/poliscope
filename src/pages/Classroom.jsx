import React from 'react';
import { useStore } from '../store/useStore.js';
import { TEST_MODES, MODE_QUESTION_COUNT } from '../data/questions.js';

export default function Classroom() {
  const language = useStore(s => s.language);
  const startClassroomTest = useStore(s => s.startClassroomTest);
  const fr = language === 'fr';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      <section className="rounded-3xl bg-slate-950 text-white px-6 py-10 sm:px-12 sm:py-14 overflow-hidden relative">
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-blue-500/20" />
        <div className="relative max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-300 mb-4">
            {fr ? 'Poliscop Classe · version pilote' : 'Poliscop Classroom · pilot version'}
          </p>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight mb-5 text-white">
            {fr ? 'Comprendre ses idées, sans consigne de vote.' : 'Understand your views, without voting advice.'}
          </h1>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-8">
            {fr
              ? 'Un parcours pédagogique pour explorer huit grands axes du débat politique. Aucun candidat, aucun parti et aucun classement électoral ne sont affichés.'
              : 'An educational journey through eight major political dimensions. No candidates, parties or electoral ranking are shown.'}
          </p>
          <button
            onClick={() => startClassroomTest(TEST_MODES.STANDARD)}
            className="w-full sm:w-auto min-h-[52px] px-6 rounded-xl bg-white text-slate-950 font-bold hover:bg-blue-50 transition-colors"
          >
            {fr
              ? `Commencer · ${MODE_QUESTION_COUNT[TEST_MODES.STANDARD]} questions · environ 12 min`
              : `Start · ${MODE_QUESTION_COUNT[TEST_MODES.STANDARD]} questions · about 12 min`}
          </button>
        </div>
      </section>

      <section className="grid sm:grid-cols-3 gap-4 mt-6">
        {[
          ['◌', fr ? 'Aucune donnée conservée' : 'No data retained', fr ? 'Les réponses restent en mémoire uniquement pendant la session. Elles disparaissent en quittant le mode Classe ou en rechargeant la page.' : 'Answers stay in memory only for the current session. They disappear when leaving Classroom mode or reloading.'],
          ['◇', fr ? 'Aucun candidat' : 'No candidates', fr ? 'Le résultat explique des axes, des courants et des nuances. Il ne recommande jamais un vote.' : 'Results explain dimensions, traditions and nuances. They never recommend a vote.'],
          ['◎', fr ? 'Un support de discussion' : 'A discussion tool', fr ? 'Les scores servent à formuler des questions et à comparer des arguments, pas à coller une étiquette définitive.' : 'Scores help frame questions and compare arguments, not assign a permanent label.'],
        ].map(([icon, title, text]) => (
          <article key={title} className="rounded-2xl bg-white border border-slate-200 p-5">
            <span className="text-2xl text-blue-600">{icon}</span>
            <h2 className="font-bold text-slate-900 mt-3 mb-2">{title}</h2>
            <p className="text-sm text-slate-500 leading-relaxed">{text}</p>
          </article>
        ))}
      </section>

      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
        <h2 className="text-xl font-bold text-slate-900 mb-3">
          {fr ? 'Pour l’enseignant' : 'For teachers'}
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
          {fr
            ? 'Cette première version peut être utilisée comme point de départ d’un débat en EMC, HGGSP ou SES. Demandez aux élèves d’identifier le résultat qui les surprend, de retrouver la question qui l’explique, puis de défendre l’argument opposé avant de formuler leur propre position.'
            : 'This first version can start a classroom discussion. Ask students to identify a surprising result, trace it back to a question, defend the opposing argument, and then formulate their own position.'}
        </p>
      </section>
    </div>
  );
}
