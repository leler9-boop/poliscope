import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useStore } from '../store/useStore.js';
import { LEARN_MANIFEST } from '../content/learn/manifest.js';
import { PARCOURS_LIST } from '../content/learn/parcours/index.js';
import { L } from '../components/learn/helpers.js';
import { setPageMeta } from '../lib/seo.js';
import { computeScore } from '../lib/knowledge.js';

/**
 * Le grand quiz politique — sessions de 10 questions tirées au hasard dans les
 * quiz de toutes les fiches publiées. Chaque bonne réponse nourrit le score de
 * connaissance (100 % local). À la fin : score, niveau, et liens vers les fiches
 * des questions ratées pour réviser.
 */

const SESSION_SIZE = 10;

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

async function buildSession() {
  // Tire des fiches au hasard, charge leurs quiz en lazy, échantillonne 10 questions.
  const entries = shuffle(LEARN_MANIFEST.filter(e => e.searchable !== false));
  const pool = [];
  for (const entry of entries) {
    if (pool.length >= SESSION_SIZE * 2) break;
    try {
      const content = await entry.load();
      for (const [i, q] of (content.quiz || []).entries()) {
        pool.push({ qid: `${entry.slug}#${i}`, entry, q });
      }
    } catch { /* fiche illisible : on passe */ }
  }
  return shuffle(pool).slice(0, SESSION_SIZE);
}

export default function LearnQuiz() {
  const language = useStore(s => s.language);
  const recordQuiz = useStore(s => s.recordQuiz);
  const knowledge = useStore(s => s.knowledge);
  const parcoursDone = useStore(s => s.parcoursDone);

  const [phase, setPhase] = useState('intro'); // intro | loading | playing | done
  const [session, setSession] = useState([]);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState(null);
  const [results, setResults] = useState([]); // { qid, entry, correct }

  React.useEffect(() => {
    setPageMeta({
      title: `Quiz politique : testez vos connaissances | Poliscop`,
      description: `10 questions tirées de toute la base Poliscop — institutions, familles politiques, présidents, grands débats. Gagnez des points, montez de niveau, révisez avec les fiches.`,
      path: '/learn/quiz',
    });
  }, []);

  const start = async () => {
    setPhase('loading');
    const s = await buildSession();
    setSession(s);
    setIndex(0);
    setResults([]);
    setPicked(null);
    setPhase(s.length > 0 ? 'playing' : 'intro');
  };

  const answer = (i) => {
    if (picked !== null) return;
    const { qid, q, entry } = session[index];
    const correct = i === q.bonneReponse;
    setPicked(i);
    recordQuiz(qid, correct);
    setResults(r => [...r, { qid, entry, correct }]);
  };

  const nextQuestion = () => {
    setPicked(null);
    if (index + 1 >= session.length) setPhase('done');
    else setIndex(index + 1);
  };

  const score = computeScore(knowledge, parcoursDone, PARCOURS_LIST);
  const sessionCorrect = results.filter(r => r.correct).length;
  const missed = results.filter(r => !r.correct);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-14">

      <motion.nav initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-gray-400 mb-6">
        <Link to="/learn" className="hover:text-gray-600 transition-colors">
          {language === 'fr' ? `J'y connais rien` : 'Politics 101'}
        </Link>
        <span className="mx-1.5">›</span>
        <span className="text-gray-600 font-medium">{language === 'fr' ? 'Le grand quiz' : 'The big quiz'}</span>
      </motion.nav>

      {/* Intro */}
      {(phase === 'intro' || phase === 'loading') && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">🏆</span>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              {language === 'fr' ? 'Le grand quiz politique' : 'The big politics quiz'}
            </h1>
          </div>
          <p className="text-gray-500 text-sm leading-relaxed max-w-lg mb-6">
            {language === 'fr'
              ? `10 questions tirées au hasard dans toute la base : institutions, familles politiques, présidents, grands débats. Chaque bonne réponse fait monter votre niveau de connaissance.`
              : `10 questions drawn from the whole library. Every correct answer raises your knowledge level.`}
          </p>

          <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-6">
            <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-2">
              {language === 'fr' ? 'Votre niveau actuel' : 'Your current level'}
            </p>
            <p className="text-lg font-bold text-gray-900">{score.niveau.icon} {L(score.niveau.nom, language)} <span className="text-sm font-semibold text-gray-400">· {score.points} pts</span></p>
            {score.suivant && (
              <p className="text-xs text-gray-500 mt-1">
                {language === 'fr' ? `Prochain niveau à ${score.suivant.min} pts` : `Next level at ${score.suivant.min} pts`}
              </p>
            )}
          </div>

          <button
            onClick={start}
            disabled={phase === 'loading'}
            className="bg-gray-900 hover:bg-gray-800 disabled:opacity-50 text-white text-sm font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            {phase === 'loading'
              ? (language === 'fr' ? 'Préparation…' : 'Loading…')
              : (language === 'fr' ? 'Lancer une session de 10 questions →' : 'Start a 10-question session →')}
          </button>
        </motion.div>
      )}

      {/* Session */}
      {phase === 'playing' && session[index] && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
              {language === 'fr' ? 'Question' : 'Question'} {index + 1} / {session.length}
            </p>
            <p className="text-xs font-semibold text-emerald-600">{sessionCorrect} ✓</p>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-6">
            <div className="h-full bg-gray-900 rounded-full transition-all" style={{ width: `${(index / session.length) * 100}%` }} />
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-4">
            <p className="text-[11px] text-gray-400 mb-2">{session[index].entry.icon} {L(session[index].entry.title, language)}</p>
            <p className="text-[15px] font-medium text-gray-900 mb-4">{L(session[index].q.question, language)}</p>
            <div className="space-y-2">
              {session[index].q.options.map((opt, i) => {
                let cls = 'border-gray-200 hover:border-gray-400 text-gray-700';
                if (picked !== null) {
                  if (i === session[index].q.bonneReponse) cls = 'border-emerald-300 bg-emerald-50 text-emerald-800';
                  else if (i === picked) cls = 'border-rose-300 bg-rose-50 text-rose-700';
                  else cls = 'border-gray-100 text-gray-400';
                }
                return (
                  <button
                    key={i}
                    disabled={picked !== null}
                    onClick={() => answer(i)}
                    className={`w-full text-left text-sm border rounded-xl px-4 py-3 transition-colors ${cls}`}
                  >
                    {L(opt, language)}
                  </button>
                );
              })}
            </div>
            {picked !== null && (
              <>
                <p className="text-sm text-gray-600 leading-relaxed mt-4 bg-gray-50 rounded-lg px-3 py-2.5">
                  {L(session[index].q.explication, language)}
                </p>
                <button
                  onClick={nextQuestion}
                  className="mt-4 bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
                >
                  {index + 1 >= session.length
                    ? (language === 'fr' ? 'Voir mon score →' : 'See my score →')
                    : (language === 'fr' ? 'Question suivante →' : 'Next question →')}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Résultat */}
      {phase === 'done' && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <div className="bg-gray-900 rounded-3xl px-6 py-8 text-center mb-6">
            <p className="text-4xl mb-2">{sessionCorrect >= 8 ? '🏆' : sessionCorrect >= 5 ? '👏' : '💪'}</p>
            <p className="text-2xl font-bold text-white mb-1">{sessionCorrect} / {session.length}</p>
            <p className="text-sm text-gray-400">
              {sessionCorrect >= 8
                ? (language === 'fr' ? 'Impressionnant. Le débat public a besoin de vous.' : 'Impressive.')
                : sessionCorrect >= 5
                  ? (language === 'fr' ? 'Solide ! Les fiches ci-dessous pour viser le sans-faute.' : 'Solid!')
                  : (language === 'fr' ? `C'est exactement pour ça que Poliscop existe — les fiches ci-dessous vous attendent.` : 'The fiches below await.')}
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-6">
            <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-2">
              {language === 'fr' ? 'Votre niveau' : 'Your level'}
            </p>
            <p className="text-lg font-bold text-gray-900">{score.niveau.icon} {L(score.niveau.nom, language)} <span className="text-sm font-semibold text-gray-400">· {score.points} pts</span></p>
            {score.suivant && (
              <div className="mt-2">
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gray-900 rounded-full" style={{ width: `${score.progression}%` }} />
                </div>
                <p className="text-xs text-gray-500 mt-1.5">
                  {language === 'fr'
                    ? `${score.suivant.min - score.points} pts avant le niveau ${score.suivant.icon} ${score.suivant.nom.fr}`
                    : `${score.suivant.min - score.points} pts to ${score.suivant.icon} ${score.suivant.nom.fr}`}
                </p>
              </div>
            )}
          </div>

          {missed.length > 0 && (
            <div className="mb-6">
              <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-2">
                {language === 'fr' ? 'À réviser' : 'To review'}
              </p>
              <div className="flex flex-wrap gap-2">
                {[...new Map(missed.map(m => [m.entry.slug, m.entry])).values()].map(e => (
                  <Link
                    key={e.slug}
                    to={`/learn/${e.section}/${e.slug}`}
                    className="inline-flex items-center gap-1.5 bg-white border border-gray-200 hover:border-gray-400 text-sm text-gray-700 px-3 py-1.5 rounded-full transition-colors"
                  >
                    <span>{e.icon}</span>{L(e.title, language)}
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={start}
              className="bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
            >
              {language === 'fr' ? 'Rejouer →' : 'Play again →'}
            </button>
            <Link
              to="/learn"
              className="bg-white hover:bg-gray-50 border border-gray-300 text-gray-800 text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
            >
              {language === 'fr' ? 'Retour au hub' : 'Back to hub'}
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  );
}
