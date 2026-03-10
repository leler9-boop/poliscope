import React, { useState, useMemo } from 'react';
import { useStore } from '../store/useStore.js';
import { createTranslator } from '../i18n/translations.js';
import { elections } from '../data/elections.js';
import { calculateAlignment, alignmentBarColor, alignmentColorClass, alignmentLabel } from '../engine/matcher.js';
import { THEME_LABELS } from '../data/questions.js';

// ─── Helpers ────────────────────────────────────────────────────────────────

function blendedAlignment(globalProfile, electionAnswers, candidate, questions, priorityOrder) {
  const globalScore = calculateAlignment(globalProfile.themes, candidate.profile, priorityOrder);
  const answered = questions.filter(
    q => electionAnswers[q.id] != null && q.positions[candidate.id] != null
  );
  if (answered.length === 0) return globalScore;

  const meanDist =
    answered.reduce((sum, q) => {
      return sum + Math.abs(electionAnswers[q.id] - q.positions[candidate.id]) / 4;
    }, 0) / answered.length;

  const electionScore = Math.round(Math.pow(1 - meanDist, 2.2) * 100);
  return Math.round(globalScore * 0.65 + electionScore * 0.35);
}

function getQuestionBreakdown(electionAnswers, candidate, questions) {
  return questions
    .filter(q => electionAnswers[q.id] != null && q.positions[candidate.id] != null)
    .map(q => ({
      q,
      distance: Math.abs(electionAnswers[q.id] - q.positions[candidate.id]),
    }))
    .sort((a, b) => a.distance - b.distance);
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function ContextStep({ election, language, t, onStart, onSkip }) {
  const [deeperOpen, setDeeperOpen] = useState(false);
  const ctx = election.context?.[language] ?? [];
  const deeper = election.deeperContext?.[language] ?? [];

  return (
    <div className="max-w-2xl mx-auto">
      {/* Election image header */}
      {election.image ? (
        <div className="relative h-48 sm:h-56 rounded-2xl overflow-hidden bg-gray-900 mb-8">
          <img
            src={election.image}
            alt={election.title[language]}
            className="w-full h-full object-cover object-center"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="absolute bottom-0 left-0 p-5">
            <p className="text-xs font-semibold text-white/60 uppercase tracking-widest mb-1">{election.country} · {election.year}</p>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">{election.title[language]}</h1>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-4 mb-10">
          <span className="text-4xl">{election.flag}</span>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{election.title[language]}</h1>
            <span className="text-sm text-gray-400 mt-0.5 block">{election.country} · {election.year}</span>
          </div>
        </div>
      )}

      {/* Context intro */}
      <div className="mb-8">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-5">
          {t('election_about')}
        </h2>
        <div className="space-y-4">
          {ctx.map((para, i) => (
            <p key={i} className="text-gray-700 leading-relaxed">{para}</p>
          ))}
        </div>
      </div>

      {/* Deeper context accordion */}
      {deeper.length > 0 && (
        <div className="border border-gray-200 rounded-2xl mb-8 overflow-hidden">
          <button
            onClick={() => setDeeperOpen(!deeperOpen)}
            className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
          >
            <span className="font-semibold text-gray-800 text-sm">{t('election_understand_more')}</span>
            <span className="text-gray-400 text-lg leading-none">{deeperOpen ? '−' : '+'}</span>
          </button>
          {deeperOpen && (
            <div className="px-5 pb-5 pt-1 border-t border-gray-100 space-y-4">
              {deeper.map((para, i) => (
                <p key={i} className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{para}</p>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Candidates preview */}
      <div className="mb-8">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
          {language === 'fr' ? 'Candidats' : 'Candidates'}
        </p>
        <div className="flex flex-wrap gap-3">
          {election.candidates.map(c => {
            const initials = c.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
            return (
              <div key={c.id} className="flex items-center gap-2">
                {c.image ? (
                  <img
                    src={c.image}
                    alt={c.name}
                    width={32}
                    height={32}
                    loading="lazy"
                    className="rounded-full object-cover flex-shrink-0 w-8 h-8"
                  />
                ) : (
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                    style={{ backgroundColor: c.color ?? '#374151' }}
                  >
                    {initials}
                  </div>
                )}
                <span className="text-xs font-medium text-gray-700">{c.name}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-8 text-xs text-amber-800">
        {t('election_disclaimer')}
      </div>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-3">
        {election.specificQuestions?.length > 0 && (
          <button
            onClick={onStart}
            className="flex-1 bg-gray-900 hover:bg-gray-800 text-white font-semibold px-6 py-3.5 rounded-xl text-sm transition-colors"
          >
            {t('election_start_quiz')} →
          </button>
        )}
        <button
          onClick={onSkip}
          className="flex-1 border border-gray-300 text-gray-600 hover:bg-gray-50 font-medium px-6 py-3.5 rounded-xl text-sm transition-colors"
        >
          {t('election_skip_quiz')}
        </button>
      </div>
    </div>
  );
}

function QuestionnaireStep({ election, language, t, electionAnswers, answerElectionQuestion, onDone }) {
  const questions = election.specificQuestions ?? [];
  const [index, setIndex] = useState(0);

  const current = questions[index];
  const userAnswer = current ? electionAnswers[current.id] : null;
  const answered = questions.filter(q => electionAnswers[q.id] != null).length;

  const LABELS = {
    en: ['Strongly disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly agree'],
    fr: ['Pas du tout d\'accord', 'Pas d\'accord', 'Neutre', 'D\'accord', 'Tout à fait d\'accord'],
  };
  const labels = LABELS[language] ?? LABELS.en;

  const handleAnswer = (val) => {
    answerElectionQuestion(election.id, current.id, val);
    if (index < questions.length - 1) {
      setTimeout(() => setIndex(index + 1), 180);
    } else {
      setTimeout(onDone, 180);
    }
  };

  if (!current) return null;

  const progress = ((index) / questions.length) * 100;

  return (
    <div className="max-w-xl mx-auto">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-400">
            {t('election_q_progress', { current: index + 1, total: questions.length })}
          </span>
          <button
            onClick={onDone}
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            {language === 'fr' ? 'Voir les résultats →' : 'See results →'}
          </button>
        </div>
        <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gray-800 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Flag + election */}
      <p className="text-xs font-medium text-gray-400 mb-6">
        {election.flag} {election.title[language]}
      </p>

      {/* Question */}
      <div className="mb-8">
        <p className="text-lg font-semibold text-gray-900 leading-snug mb-1">
          {current.text[language]}
        </p>
        {current.info?.[language] && (
          <p className="text-sm text-gray-500 mt-3 leading-relaxed">
            {current.info[language]}
          </p>
        )}
      </div>

      {/* Answer buttons */}
      <div className="grid grid-cols-5 gap-2">
        {[1, 2, 3, 4, 5].map((val) => (
          <button
            key={val}
            onClick={() => handleAnswer(val)}
            className={`py-3 rounded-xl border text-xs font-semibold transition-all ${
              userAnswer === val
                ? 'bg-gray-900 text-white border-gray-900 shadow-sm'
                : 'border-gray-200 text-gray-600 hover:border-gray-400 hover:text-gray-900 bg-white'
            }`}
          >
            {val}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-5 gap-2 mt-1.5">
        {labels.map((l, i) => (
          <p key={i} className="text-center text-gray-400 leading-tight" style={{ fontSize: '10px' }}>
            {l}
          </p>
        ))}
      </div>

      {/* Nav */}
      <div className="flex items-center justify-between mt-8">
        <button
          onClick={() => setIndex(Math.max(0, index - 1))}
          disabled={index === 0}
          className="text-sm text-gray-400 hover:text-gray-700 disabled:opacity-30 transition-colors"
        >
          ← {language === 'fr' ? 'Précédent' : 'Previous'}
        </button>
        {answered > 0 && (
          <span className="text-xs text-gray-400">
            {answered} {language === 'fr' ? 'répondues' : 'answered'}
          </span>
        )}
        {userAnswer != null && index < questions.length - 1 && (
          <button
            onClick={() => setIndex(index + 1)}
            className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors"
          >
            {language === 'fr' ? 'Suivant' : 'Next'} →
          </button>
        )}
        {index === questions.length - 1 && (
          <button
            onClick={onDone}
            className="text-sm font-semibold text-gray-900 hover:text-gray-600 transition-colors"
          >
            {language === 'fr' ? 'Voir les résultats' : 'See results'} →
          </button>
        )}
      </div>
    </div>
  );
}

function ResultsStep({ election, language, t, globalProfile, electionAnswers, priorityOrder, onRetake, onBack }) {
  const [expandedId, setExpandedId] = useState(null);
  const questions = election.specificQuestions ?? [];
  const thisElectionAnswers = electionAnswers[election.id] ?? {};
  const answeredCount = questions.filter(q => thisElectionAnswers[q.id] != null).length;

  const rankedCandidates = useMemo(() => {
    return election.candidates
      .map(c => ({
        ...c,
        alignment: blendedAlignment(globalProfile, thisElectionAnswers, c, questions, priorityOrder),
      }))
      .sort((a, b) => b.alignment - a.alignment);
  }, [election, globalProfile, thisElectionAnswers, priorityOrder]);

  const noteExtra = answeredCount > 0
    ? t('election_results_note_extra', { n: answeredCount })
    : '';
  const note = t('election_results_note', { extra: noteExtra });

  // Tier-split candidates by score
  const strongMatches   = rankedCandidates.filter(c => c.alignment >= 60);
  const moderateMatches = rankedCandidates.filter(c => c.alignment >= 35 && c.alignment < 60);
  const weakMatches     = rankedCandidates.filter(c => c.alignment < 35);

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xl">{election.flag}</span>
          <h1 className="text-2xl font-bold text-gray-900">{t('election_results_title')}</h1>
        </div>
        <p className="text-sm text-gray-500">{note}</p>
      </div>

      {/* Calibration message */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 mb-6">
        <p className="text-xs text-blue-800 leading-relaxed">
          {language === 'fr'
            ? 'Votre profil politique général est ici ajusté avec les questions spécifiques à cette élection, car les enjeux varient d\'un pays et d\'une élection à l\'autre.'
            : 'Your general political profile is adjusted here with election-specific questions, because the issues that matter vary from one country and election to another.'}
        </p>
      </div>

      {/* Strong matches */}
      {strongMatches.length > 0 && (
        <div className="mb-6">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
            {language === 'fr' ? 'Correspondances fortes' : 'Strong matches'}
          </p>
          <div className="space-y-3">
            {strongMatches.map((c, idx) => (
              <CandidateResultCard
                key={c.id}
                candidate={c}
                rank={rankedCandidates.indexOf(c) + 1}
                language={language}
                t={t}
                isTop={idx === 0}
                electionAnswers={thisElectionAnswers}
                questions={questions}
                expanded={idx === 0 || expandedId === c.id}
                onToggle={idx !== 0 ? () => setExpandedId(expandedId === c.id ? null : c.id) : undefined}
              />
            ))}
          </div>
        </div>
      )}

      {/* Moderate matches */}
      {moderateMatches.length > 0 && (
        <div className="mb-6">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
            {language === 'fr' ? 'Correspondances modérées' : 'Moderate matches'}
          </p>
          <div className="space-y-3">
            {moderateMatches.map(c => (
              <CandidateResultCard
                key={c.id}
                candidate={c}
                rank={rankedCandidates.indexOf(c) + 1}
                language={language}
                t={t}
                isTop={false}
                electionAnswers={thisElectionAnswers}
                questions={questions}
                expanded={expandedId === c.id}
                onToggle={() => setExpandedId(expandedId === c.id ? null : c.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Weak matches */}
      {weakMatches.length > 0 && (
        <div className="mb-6">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
            {language === 'fr' ? 'Faibles correspondances' : 'Weak matches'}
          </p>
          <div className="space-y-3">
            {weakMatches.map(c => (
              <CandidateResultCard
                key={c.id}
                candidate={c}
                rank={rankedCandidates.indexOf(c) + 1}
                language={language}
                t={t}
                isTop={false}
                electionAnswers={thisElectionAnswers}
                questions={questions}
                expanded={expandedId === c.id}
                onToggle={() => setExpandedId(expandedId === c.id ? null : c.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Fallback: no tiers — just list all */}
      {strongMatches.length === 0 && moderateMatches.length === 0 && weakMatches.length === 0 && (
        <div className="space-y-3 mb-6">
          {rankedCandidates.map((c, idx) => (
            <CandidateResultCard
              key={c.id}
              candidate={c}
              rank={idx + 1}
              language={language}
              t={t}
              isTop={idx === 0}
              electionAnswers={thisElectionAnswers}
              questions={questions}
              expanded={idx === 0 || expandedId === c.id}
              onToggle={idx !== 0 ? () => setExpandedId(expandedId === c.id ? null : c.id) : undefined}
            />
          ))}
        </div>
      )}

      {/* Overview chart */}
      <div className="bg-white border border-gray-100 rounded-xl p-5 mb-6">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
          {t('election_overview')}
        </h3>
        <div className="space-y-2.5">
          {rankedCandidates.map(c => {
            const barColor = alignmentBarColor(c.alignment);
            return (
              <div key={c.id} className="flex items-center gap-3">
                {c.color && (
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: c.color }} />
                )}
                <span className="text-xs text-gray-600 w-28 flex-shrink-0 truncate">{c.name}</span>
                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${c.alignment}%`, backgroundColor: barColor }}
                  />
                </div>
                <span className="text-xs font-bold w-9 text-right" style={{ color: barColor }}>
                  {c.alignment}%
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Trust note */}
      <p className="text-xs text-gray-400 leading-relaxed mb-6">
        {language === 'fr'
          ? 'Ces scores sont des comparaisons analytiques basées sur les positions politiques, non des recommandations de vote.'
          : 'These scores are analytical comparisons based on policy positions — not voting recommendations.'}
      </p>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        {questions.length > 0 && (
          <button
            onClick={onRetake}
            className="text-sm font-medium text-gray-600 border border-gray-200 px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
          >
            ↺ {t('election_retake')}
          </button>
        )}
        <button
          onClick={onBack}
          className="text-sm font-medium text-gray-600 border border-gray-200 px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
        >
          ← {t('election_back')}
        </button>
      </div>
    </div>
  );
}

function CandidatePortrait({ candidate, size = 48 }) {
  const [imgError, setImgError] = React.useState(false);
  if (candidate.image && !imgError) {
    return (
      <img
        src={candidate.image}
        alt={candidate.name}
        width={size}
        height={size}
        loading="lazy"
        onError={() => setImgError(true)}
        className="rounded-full object-cover flex-shrink-0"
        style={{ width: size, height: size }}
      />
    );
  }
  // Fallback: initials circle
  const initials = candidate.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  return (
    <div
      className="rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold"
      style={{ width: size, height: size, backgroundColor: candidate.color ?? '#374151' }}
    >
      {initials}
    </div>
  );
}

function CandidateResultCard({ candidate, rank, language, t, isTop, electionAnswers, questions, expanded, onToggle }) {
  const { name, color, party, result, description, alignment } = candidate;
  const barColor = alignmentBarColor(alignment);
  const textColor = alignmentColorClass(alignment);
  const label = alignmentLabel(alignment, language);

  const breakdown = getQuestionBreakdown(electionAnswers, candidate, questions);
  const agreements = breakdown.filter(d => d.distance <= 1).slice(0, 2);
  const disagreements = breakdown.filter(d => d.distance >= 3).slice(0, 2);

  return (
    <div className={`bg-white border rounded-2xl overflow-hidden transition-all hover:shadow-sm ${
      isTop ? 'border-gray-300 shadow-sm' : 'border-gray-200'
    }`}>
      {isTop && <div className="h-0.5 bg-gray-900" />}
      <div className="p-5 sm:p-6">
        <div className="flex items-start gap-3 sm:gap-4">
          {/* Portrait */}
          <CandidatePortrait candidate={candidate} size={52} />

          {/* Name + meta */}
          <div className="flex-1 min-w-0">
            <h3 className={`font-semibold text-gray-900 truncate leading-tight ${isTop ? 'text-base' : 'text-sm'}`}>{name}</h3>
            {party && (
              <p className="text-xs text-gray-400 mt-0.5">
                {typeof party === 'object' ? party[language] : party}
              </p>
            )}
            {result && (
              <p className="text-xs text-gray-400 mt-0.5">
                {typeof result === 'object' ? result[language] : result}
              </p>
            )}
          </div>

          {/* Score */}
          <div className="text-right flex-shrink-0">
            <div className={`font-bold tabular-nums ${isTop ? 'text-3xl' : 'text-2xl'} ${textColor}`}>{alignment}%</div>
            <div className="text-xs text-gray-400 mt-0.5">{language === 'fr' ? 'compat.' : 'match'}</div>
          </div>
        </div>

        {/* Bar */}
        <div className="mt-4 mb-1">
          <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full rounded-full match-bar-fill" style={{ width: `${alignment}%`, backgroundColor: barColor }} />
          </div>
          <p className="text-xs text-gray-400 mt-1.5">{label}</p>
        </div>

        {/* Election-specific breakdown */}
        {(expanded || isTop) && breakdown.length > 0 && (
          <div className="mt-4 grid sm:grid-cols-2 gap-3">
            {agreements.length > 0 && (
              <div className="bg-green-50 border border-green-100 rounded-lg p-3">
                <p className="text-xs font-semibold text-green-700 mb-2">✓ {t('election_agreements')}</p>
                <ul className="space-y-1">
                  {agreements.map(({ q }) => (
                    <li key={q.id} className="text-xs text-green-800 leading-snug">
                      {q.text[language]}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {disagreements.length > 0 && (
              <div className="bg-red-50 border border-red-100 rounded-lg p-3">
                <p className="text-xs font-semibold text-red-700 mb-2">✗ {t('election_disagreements')}</p>
                <ul className="space-y-1">
                  {disagreements.map(({ q }) => (
                    <li key={q.id} className="text-xs text-red-800 leading-snug">
                      {q.text[language]}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Bio (expanded) */}
        {(expanded || isTop) && description && (
          <p className="mt-4 text-sm text-gray-500 leading-relaxed border-t border-gray-100 pt-3">
            {typeof description === 'object' ? description[language] : description}
          </p>
        )}

        {/* Toggle */}
        {!isTop && onToggle && (
          <button
            onClick={onToggle}
            className="mt-3 text-xs text-blue-500 hover:text-blue-700 font-medium"
          >
            {expanded
              ? (language === 'fr' ? '▲ Réduire' : '▲ Collapse')
              : (language === 'fr' ? '▼ Voir les détails' : '▼ View details')}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

function applyAdjustments(themes, adjustments) {
  if (!adjustments || Object.keys(adjustments).length === 0) return themes;
  const result = { ...themes };
  Object.entries(adjustments).forEach(([k, v]) => {
    if (result[k] != null) result[k] = Math.max(0, Math.min(100, result[k] + v));
  });
  return result;
}

export default function ElectionDetail() {
  const language           = useStore(s => s.language);
  const profile            = useStore(s => s.profile);
  const profileAdjustments = useStore(s => s.profileAdjustments);
  const priorityOrder      = useStore(s => s.priorityOrder);
  const navigate           = useStore(s => s.navigate);
  const selectedElectionId = useStore(s => s.selectedElectionId);
  const electionAnswers    = useStore(s => s.electionAnswers);
  const answerElectionQuestion = useStore(s => s.answerElectionQuestion);
  const clearElectionAnswers = useStore(s => s.clearElectionAnswers);
  const t = createTranslator(language);

  const adjustedProfile = profile
    ? { ...profile, themes: applyAdjustments(profile.themes, profileAdjustments) }
    : null;

  const [step, setStep] = useState('context'); // 'context' | 'questionnaire' | 'results'

  const election = elections.find(e => e.id === selectedElectionId);

  if (!election) {
    navigate('elections');
    return null;
  }

  if (!adjustedProfile && step === 'results') {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="text-5xl mb-4">{election.flag}</div>
        <h2 className="text-xl font-bold text-gray-900 mb-3">
          {language === 'fr' ? 'Aucun profil trouvé' : 'No profile yet'}
        </h2>
        <p className="text-gray-500 mb-6 text-sm">{t('election_no_profile')}</p>
        <button
          onClick={() => navigate('selectTest')}
          className="bg-gray-900 hover:bg-gray-800 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
        >
          {language === 'fr' ? 'Construire mon profil' : 'Build my profile'}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Back link */}
      <button
        onClick={() => navigate('elections')}
        className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 mb-8 transition-colors"
      >
        ← {t('election_back')}
      </button>

      {step === 'context' && (
        <ContextStep
          election={election}
          language={language}
          t={t}
          onStart={() => setStep('questionnaire')}
          onSkip={() => {
            if (!profile) { navigate('selectTest'); return; }
            setStep('results');
          }}
        />
      )}

      {step === 'questionnaire' && (
        <QuestionnaireStep
          election={election}
          language={language}
          t={t}
          electionAnswers={electionAnswers[election.id] ?? {}}
          answerElectionQuestion={answerElectionQuestion}
          onDone={() => {
            if (!profile) { navigate('selectTest'); return; }
            setStep('results');
          }}
        />
      )}

      {step === 'results' && adjustedProfile && (
        <ResultsStep
          election={election}
          language={language}
          t={t}
          globalProfile={adjustedProfile}
          electionAnswers={electionAnswers}
          priorityOrder={priorityOrder}
          onRetake={() => {
            clearElectionAnswers(election.id);
            setStep('questionnaire');
          }}
          onBack={() => navigate('elections')}
        />
      )}
    </div>
  );
}
