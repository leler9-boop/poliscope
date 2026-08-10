import React, { useState, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useStore } from '../store/useStore.js';
// selectCandidate is accessed via useStore inside CandidateResultCard
import { createTranslator } from '../i18n/translations.js';
import { elections } from '../data/elections.js';
import { alignmentBarColor, alignmentColorClass, alignmentLabel } from '../engine/matcher.js';
import { computeCandidateMatch } from '../engine/candidateMatch.js';
import { rankCandidatesForSurface, MATCH_MODE } from '../engine/candidateRanking.js';
import { EDITORIAL_ANSWERS_VERSION } from '../data/candidateEditorialAnswers.js';
import EstimateNotice from '../components/EstimateNotice.jsx';
import { formatProximity, noScoreReason, scoreToCssPercent } from '../engine/scoreDisplay.js';
import { getRegistryEntry, getTrackedCandidates, getTrackedNotMatchReady } from '../data/candidateRegistry.js';
import { getSource } from '../data/candidateProvenance.js';
import { THEME_LABELS, THEMES_ORDER, THEME_COLORS } from '../data/questions.js';
import LazyImage, { CandidateAvatar } from '../components/LazyImage.jsx';
import { trackElectionViewed } from '../lib/analytics.js';

const CANDIDACY_LABELS = {
  declared:          { fr: 'Candidature déclarée', en: 'Declared candidacy' },
  invested:          { fr: 'Investi par son parti', en: 'Party nominee' },
  officially_validated: { fr: 'Validée par le Conseil constitutionnel', en: 'Officially validated' },
  primary_candidate: { fr: 'Candidat à une primaire', en: 'Primary candidate' },
  conditional:       { fr: 'Candidature conditionnelle', en: 'Conditional candidacy' },
  potential:         { fr: 'Pressenti — non déclaré', en: 'Potential — not declared' },
  contingency:       { fr: 'Scénario de remplacement — non candidat', en: 'Contingency — not a candidate' },
  withdrawn:         { fr: 'Candidature retirée ou écartée', en: 'Withdrawn or ruled out' },
  ineligible:        { fr: 'Inéligible', en: 'Ineligible' },
};

function candidacyLabel(status, language) {
  return CANDIDACY_LABELS[status]?.[language] ?? status;
}

function candidacyBadgeClass(status) {
  if (status === 'declared' || status === 'invested' || status === 'officially_validated') return 'bg-green-50 text-green-700 border-green-200';
  if (status === 'conditional' || status === 'primary_candidate') return 'bg-amber-50 text-amber-700 border-amber-200';
  return 'bg-gray-50 text-gray-600 border-gray-200';
}

const DIRECTORY_GROUPS = [
  {
    id: 'confirmed',
    statuses: new Set(['officially_validated', 'invested', 'declared']),
    fr: 'Candidatures déclarées ou investies',
    en: 'Declared candidacies and party nominees',
  },
  {
    id: 'process',
    statuses: new Set(['primary_candidate', 'conditional']),
    fr: 'Primaires et candidatures conditionnelles',
    en: 'Primaries and conditional candidacies',
  },
  {
    id: 'potential',
    statuses: new Set(['potential', 'contingency']),
    fr: 'Personnes pressenties et scénarios de remplacement',
    en: 'Potential candidates and contingency scenarios',
  },
  {
    id: 'out',
    statuses: new Set(['withdrawn', 'ineligible']),
    fr: 'Retraits ou candidatures écartées',
    en: 'Withdrawn or ruled-out candidacies',
  },
];

function CandidateDirectory2027({ language }) {
  const candidates = getTrackedCandidates('fr_2027');
  const selectCandidate = useStore(s => s.selectCandidate);
  const fr = language === 'fr';
  const confirmedCount = candidates.filter(candidate => DIRECTORY_GROUPS[0].statuses.has(candidate.status)).length;

  return (
    <section className="mb-8">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
        {fr ? 'Annuaire présidentiel 2027' : '2027 presidential directory'}
      </p>
      <p className="text-xs text-gray-500 leading-relaxed mb-4">
        {fr
          ? `Poliscop suit ${candidates.length} profils. Cet annuaire n’est pas la liste officielle du premier tour : il sépare les candidatures déclarées, les processus en cours, les personnes pressenties et les retraits.`
          : `Poliscop tracks ${candidates.length} profiles. This directory is not the official first-round list: it separates declared candidacies, ongoing processes, potential candidates and withdrawals.`}
      </p>
      <details className="rounded-2xl border border-gray-200 overflow-hidden bg-white">
        <summary className="cursor-pointer list-none px-4 py-3.5 flex items-center justify-between gap-3 hover:bg-gray-50 transition-colors">
          <span className="text-sm font-semibold text-gray-800">
            {candidates.length} {fr ? 'profils suivis' : 'tracked profiles'}
          </span>
          <span className="text-xs text-green-700">
            {confirmedCount} {fr ? 'déclarés ou investis' : 'declared or nominated'}
          </span>
        </summary>
        <div className="border-t border-gray-100 px-4 py-4 space-y-5">
          {DIRECTORY_GROUPS.map(group => {
            const groupCandidates = candidates.filter(candidate => group.statuses.has(candidate.status));
            if (groupCandidates.length === 0) return null;
            return (
              <div key={group.id}>
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  {fr ? group.fr : group.en} · {groupCandidates.length}
                </p>
                <div className="grid sm:grid-cols-2 gap-2">
                  {groupCandidates.map(candidate => (
                    <button
                      key={candidate.id}
                      type="button"
                      onClick={() => selectCandidate(candidate.id)}
                      className="rounded-xl border border-gray-100 px-3 py-2.5 text-left hover:border-gray-300 hover:bg-gray-50 transition-colors"
                    >
                      <span className="flex items-start justify-between gap-2">
                        <span className="min-w-0">
                          <span className="block text-xs font-semibold text-gray-800 truncate">{candidate.displayName}</span>
                          <span className="block text-[11px] text-gray-500 truncate">{candidate.party}</span>
                        </span>
                        <span className="text-[10px] font-semibold text-gray-400 flex-shrink-0">
                          {candidate.programMaturity ?? 'M0'}
                        </span>
                      </span>
                      <span className={`inline-block mt-1.5 rounded-full border px-1.5 py-0.5 text-[9px] font-semibold ${candidacyBadgeClass(candidate.status)}`}>
                        {candidacyLabel(candidate.status, language)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
          <p className="text-[11px] text-gray-400 leading-relaxed">
            {fr
              ? 'M0 à M5 indique uniquement la maturité du corpus programmatique disponible. Ouvrez une fiche pour consulter les dates et les sources.'
              : 'M0 to M5 only indicates the maturity of the available programme corpus. Open a profile to see dates and sources.'}
          </p>
        </div>
      </details>
    </section>
  );
}

// ─── Helpers ────────────────────────────────────────────────────────────────
//
// Le calcul de proximité (mélange global/spécifique, veto, pondérations) vit désormais
// entièrement dans `src/engine/candidateMatch.js`. Ce fichier en contenait une copie
// divergente : table de veto à 5 thèmes au lieu de 6 (GLOBAL manquant) et `themeWeights`
// purement ignoré, si bien que la page Élection et la page Profil ne classaient pas les
// candidats de la même façon. Ne pas réintroduire de règle métier ici.

// ⚠️ Quatre helpers ont été SUPPRIMÉS ici (voir docs/remediation/decisions.md D-35) :
//
//   getQuestionBreakdown()        lisait `q.positions[candidate.id]`
//   getThemeAgreementsFallback()  lisait `candidate.profile`
//   getMatchSentence()            reposait sur le précédent
//   (et `generateProfileAnalysis` lisait `top.profile?.[theme] ?? 50`)
//
// `candidate.profile` est `legacy-manual-v1` : huit nombres saisis à la main, sans preuve
// par position. `specificQuestions[].positions` a la même origine. Le moteur a cessé de les
// lire — mais ces helpers continuaient à en tirer des PHRASES affichées (« Proches sur
// l'économie, plus éloignés sur l'immigration »), c'est-à-dire des affirmations sur les
// positions d'une personne réelle, sans source. Le score était honnête, le commentaire non.
//
// Tout ce qui est affiché vient désormais du résultat du moteur : `match.agreements`,
// `match.disagreements` (positions sourcées, approuvées et relues) et `match.derivedThemes`
// (thème inconnu = `null`, jamais remplacé par 50).

/**
 * Phrase courte sous le score, construite à partir du profil candidat DÉRIVÉ.
 * Renvoie `null` — donc n'affiche rien — dès qu'aucun thème n'est comparable.
 * Ne jamais lui faire supposer une valeur par défaut : « inconnu » n'est pas « au centre ».
 */
function getMatchSentence(userThemes, match, language) {
  const derived = match?.derivedThemes;
  if (!userThemes || !derived) return null;

  const themeLabels = THEME_LABELS[language] ?? THEME_LABELS.en;
  const comparables = THEMES_ORDER
    .filter(theme => derived[theme] != null && userThemes[theme] != null)
    .map(theme => ({
      label: themeLabels[theme] ?? theme,
      diff: Math.abs(userThemes[theme] - derived[theme]),
    }))
    .sort((a, b) => a.diff - b.diff);

  if (comparables.length < 2) return null;

  const agreeStr    = comparables.slice(0, 2).map(a => a.label).join(' et ');
  const disagreeStr = comparables.slice(-2).reverse().map(d => d.label).join(' et ');
  return language === 'fr'
    ? `Proches sur ${agreeStr}, plus éloignés sur ${disagreeStr}.`
    : `Close on ${agreeStr}, further apart on ${disagreeStr}.`;
}

// ─── Profile analysis ────────────────────────────────────────────────────────

function generateProfileAnalysis(userThemes, rankedCandidates, language) {
  if (!userThemes || rankedCandidates.length < 1) return null;

  const fr = language === 'fr';
  const top    = rankedCandidates[0];
  const second = rankedCandidates[1] ?? null;
  const last   = rankedCandidates[rankedCandidates.length - 1];

  const themeLabels = THEME_LABELS[language] ?? THEME_LABELS.en;

  // Distances par thème — profils candidats DÉRIVÉS des positions sourcées.
  // Lisaient auparavant `top.profile?.[theme] ?? 50` : valeur legacy non sourcée, et un thème
  // inconnu compté comme « au centre », ce qui fabriquait une fausse proximité.
  // Un thème non sourcé est maintenant EXCLU de l'analyse au lieu d'être supposé.
  const topThemes    = top.match?.derivedThemes    ?? null;
  const secondThemes = second?.match?.derivedThemes ?? null;

  const themeDiffs = THEMES_ORDER
    .filter(theme => userThemes[theme] != null && topThemes?.[theme] != null)
    .map(theme => ({
      label:      themeLabels[theme] ?? theme,
      user:       userThemes[theme],
      diffTop:    Math.abs(userThemes[theme] - topThemes[theme]),
      diffSecond: secondThemes?.[theme] != null
        ? Math.abs(userThemes[theme] - secondThemes[theme])
        : null,
    }));

  // Aucun thème comparable → aucune phrase de comparaison. Le paragraphe se limitera à la
  // description du profil de l'utilisateur, qui, elle, repose sur ses propres réponses.
  const comparaisonPossible = themeDiffs.length >= 2;

  const byCloseness = [...themeDiffs].sort((a, b) => a.diffTop - b.diffTop);
  const shared1 = byCloseness[0] ?? null;
  const shared2 = byCloseness[1] ?? null;

  const avecSecond = themeDiffs.filter(d => d.diffSecond != null);
  const divergeFromSecond = second && avecSecond.length
    ? [...avecSecond].sort((a, b) => (b.diffSecond - b.diffTop) - (a.diffSecond - a.diffTop))[0]
    : null;

  // Short names
  const topName    = top.name.split(' ').pop();
  const secondName = second?.name.split(' ').pop();
  const lastName   = last.name.split(' ').pop();

  // Positioning descriptors
  const econ   = userThemes.ECONOMY    ?? 50;
  const social = userThemes.SOCIAL     ?? 50;
  const enviro = userThemes.ENVIRONMENT ?? 50;

  const econPhrase = fr
    ? (econ   < 38 ? `une préférence pour davantage d'aides sociales et une économie plus encadrée`
                   : econ > 62 ? `une préférence pour la liberté des entreprises et moins d'impôts`
                   : `une vision économique équilibrée`)
    : (econ   < 38 ? `a preference for public spending and social protection`
                   : econ > 62 ? `a preference for business freedom and lower taxes`
                   : `centrist economic views`);

  const socialPhrase = fr
    ? (social < 38 ? `des valeurs plutôt traditionnelles sur la famille et la religion`
                   : social > 62 ? `des positions ouvertes sur les droits et les libertés individuelles`
                   : `une position modérée sur les questions de société`)
    : (social < 38 ? `traditional values on family and religion`
                   : social > 62 ? `open views on rights and individual freedoms`
                   : `a balanced approach to social issues`);

  const enviroPhrase = enviro > 62
    ? (fr ? `une priorité marquée pour l'écologie` : `a clear environmental priority`)
    : enviro < 38
    ? (fr ? `une priorité donnée à l'économie plutôt qu'à l'environnement` : `a preference for economic growth over environmental concerns`)
    : null;

  // S1 — overall positioning
  const s1 = fr
    ? `Ton profil révèle ${econPhrase}, combiné à ${socialPhrase}${enviroPhrase ? ` et ${enviroPhrase}` : ''}.`
    : `Your profile shows ${econPhrase}, combined with ${socialPhrase}${enviroPhrase ? ` and ${enviroPhrase}` : ''}.`;

  // S2 — closeness to top candidate
  const s2 = !comparaisonPossible ? '' : shared1.diffTop < 20
    ? (fr
        ? `Tu te rapproches de ${topName} surtout sur ${shared1.label.toLowerCase()}${shared2.diffTop < 25 ? ` et ${shared2.label.toLowerCase()}` : ''}, où vos sensibilités convergent.`
        : `You align most with ${topName} particularly on ${shared1.label.toLowerCase()}${shared2.diffTop < 25 ? ` and ${shared2.label.toLowerCase()}` : ''}, where your views converge.`)
    : (fr
        ? `Parmi les candidats, c'est ${topName} qui se rapproche le plus de tes positions, même si des différences subsistent sur plusieurs sujets.`
        : `Among the candidates, ${topName} comes closest to your positions, even though differences remain on several issues.`);

  // S3 — contrast with second candidate
  let s3 = '';
  if (second && comparaisonPossible) {
    const gap = top.alignment - second.alignment;
    if (gap > 15 && divergeFromSecond && divergeFromSecond.diffSecond > 25) {
      s3 = fr
        ? `En revanche, ${divergeFromSecond.label.toLowerCase()} te sépare nettement de ${secondName}.`
        : `On the other hand, ${divergeFromSecond.label.toLowerCase()} clearly sets you apart from ${secondName}.`;
    } else if (gap <= 10) {
      s3 = fr
        ? `Ton profil est assez proche à la fois de ${topName} et de ${secondName} — la différence tient à des nuances sur ${shared1.label.toLowerCase()}.`
        : `Your profile is fairly close to both ${topName} and ${secondName} — the difference comes down to nuances on ${shared1.label.toLowerCase()}.`;
    } else {
      s3 = fr
        ? `Sur certains sujets comme ${divergeFromSecond ? divergeFromSecond.label.toLowerCase() : shared1.label.toLowerCase()}, tu partages moins de terrain avec ${secondName}.`
        : `On issues like ${divergeFromSecond ? divergeFromSecond.label.toLowerCase() : shared1.label.toLowerCase()}, you share less common ground with ${secondName}.`;
    }
  }

  // S4 — distance from last candidate (only if gap is significant)
  let s4 = '';
  if (comparaisonPossible && last.id !== top.id && top.alignment - last.alignment > 30) {
    s4 = fr
      ? `C'est avec ${lastName} que tes positions divergent le plus — des positions très différentes sur la plupart des sujets.`
      : `Your positions diverge most from ${lastName} — very different views on most issues.`;
  }

  // S5 — closing nuance
  const isCentrist = econ > 38 && econ < 62 && social > 38 && social < 62;
  const s5 = fr
    ? (isCentrist
        ? `Globalement, ton profil est difficile à classer dans une seule case politique, ce qui traduit une vision nuancée des sujets.`
        : `Globalement, tes positions sont assez marquées sur plusieurs sujets, ce qui explique la clarté de ton classement.`)
    : (isCentrist
        ? `Overall, your profile doesn't fit neatly into a single political label, which reflects a nuanced view of politics.`
        : `Overall, your positions are fairly clear on several issues, which explains the clarity of your ranking.`);

  return [s1, s2, s3, s4, s5].filter(Boolean).join(' ');
}

function ProfileAnalysis({ userThemes, rankedCandidates, language }) {
  const text = generateProfileAnalysis(userThemes, rankedCandidates, language);
  if (!text) return null;

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-2xl px-5 py-5 mb-6">
      <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-3">
        {language === 'fr' ? `Analyse de ton profil` : 'Profile analysis'}
      </p>
      <p className="text-sm text-gray-700 leading-relaxed">{text}</p>
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function ContextStep({ election, language, t, onStart, onSkip }) {
  const [deeperOpen, setDeeperOpen] = useState(false);
  const selectCandidate = useStore(s => s.selectCandidate);
  const ctx = election.context?.[language] ?? [];
  const deeper = election.deeperContext?.[language] ?? [];
  const is2027 = election.id === 'fr_2027';

  return (
    <div className="max-w-2xl mx-auto">
      {/* Election image header */}
      {election.image ? (
        <div className="relative -mx-4 sm:-mx-6 h-56 sm:h-72 overflow-hidden bg-gray-950 mb-10">
          <LazyImage
            src={election.image}
            alt={election.title[language]}
            className="w-full h-full object-cover object-center"
          />
          {/* Base tint */}
          <div className="absolute inset-0 bg-black/20" />
          {/* Bottom gradient for text legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
          {/* Layered text */}
          <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-6 pb-7">
            <p className="text-[11px] font-semibold text-white/55 uppercase tracking-[0.14em] mb-2.5">
              {election.flag}&ensp;{election.country}&nbsp;·&nbsp;{election.year}
            </p>
            <h1 className="text-2xl sm:text-[28px] font-bold text-white tracking-tight leading-tight mb-2" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              {election.title[language]}
            </h1>
            <p className="text-[13px] text-white/65 leading-snug line-clamp-1 max-w-xl font-normal">
              {typeof election.description === 'object' ? election.description[language] : election.description}
            </p>
          </div>
        </div>
      ) : (
        <div className="-mx-4 sm:-mx-6 bg-gray-950 px-4 sm:px-6 pt-8 pb-8 mb-10">
          <p className="text-[11px] font-semibold text-white/50 uppercase tracking-[0.14em] mb-2.5">
            {election.flag}&ensp;{election.country}&nbsp;·&nbsp;{election.year}
          </p>
          <h1 className="text-2xl sm:text-[28px] font-bold text-white tracking-tight leading-tight mb-2" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            {election.title[language]}
          </h1>
          <p className="text-[13px] text-white/60 leading-snug line-clamp-1 max-w-xl">
            {typeof election.description === 'object' ? election.description[language] : election.description}
          </p>
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

      {/* Annuaire complet en 2027 ; aperçu historique pour les autres scrutins. */}
      {is2027 ? (
        <CandidateDirectory2027 language={language} />
      ) : (
        <div className="mb-8">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
            {language === 'fr' ? 'Candidats' : 'Candidates'}
          </p>
          <div className="grid sm:grid-cols-2 gap-2.5">
            {election.candidates.map(c => {
              const initials = c.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => selectCandidate(c.id)}
                  className="flex items-center gap-2.5 rounded-xl border border-gray-100 p-2.5 text-left hover:border-gray-300 hover:bg-gray-50 transition-colors"
                >
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
                  <span className="block min-w-0 flex-1 text-xs font-medium text-gray-700 truncate">{c.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

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

/**
 * Encart de transparence : ce que le score mesure, sur quelle base, et quand il ne permet
 * pas de départager. Volontairement sobre — deux à quatre lignes, pas un rapport.
 */
function MatchCoverageNotice({ rankedCandidates, answeredCount, totalQuestions, tooClose, language }) {
  if (!rankedCandidates.length) return null;
  const fr = language === 'fr';

  const usedList = rankedCandidates.map(c => c.match?.coverage?.positionsUsed ?? 0);
  const minUsed = Math.min(...usedList);
  const maxUsed = Math.max(...usedList);
  const ignored = rankedCandidates.filter(c => c.match?.coverage?.specificIgnored);

  return (
    <div className="mb-6 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-xs text-gray-600 space-y-1.5">
      <p>
        <span className="font-semibold text-gray-700">
          {fr ? 'Indice de proximité sur 100' : 'Proximity index out of 100'}
        </span>{' '}
        {fr
          // ⚠ « amplifiée volontairement » décrivait l'étirement du moteur STRICT. La voie
          // éditoriale V1 ne l'applique pas : son indice est une moyenne directe des écarts
          // de réponse. Laisser cette phrase ici décrivait un calcul qui n'a pas lieu.
          ? '— ce n’est ni un pourcentage de mesures communes, ni une probabilité de vote, ni une recommandation. C’est la moyenne des écarts entre vos réponses et celles attribuées au candidat, sur les sujets que vous avez tous les deux traités.'
          : '— not a percentage of shared positions, not a probability, not a voting recommendation. It is the average gap between your answers and those attributed to the candidate, over the topics you both covered.'}
      </p>
      {answeredCount > 0 && (
        <p>
          {fr
            ? `Vos réponses à cette élection : ${answeredCount}/${totalQuestions}. Positions comparables selon le candidat : ${minUsed === maxUsed ? minUsed : `${minUsed} à ${maxUsed}`} sur ${totalQuestions}.`
            : `Your answers for this election: ${answeredCount}/${totalQuestions}. Comparable positions per candidate: ${minUsed === maxUsed ? minUsed : `${minUsed}–${maxUsed}`} of ${totalQuestions}.`}
        </p>
      )}
      {ignored.length > 0 && (
        <p className="text-amber-700">
          {fr
            ? `Aucune position documentée pour ${ignored.map(c => c.name).join(', ')} : leur score ne repose que sur le profil général.`
            : `No documented positions for ${ignored.map(c => c.name).join(', ')}: their score rests on the general profile only.`}
        </p>
      )}
      {tooClose && (
        <p className="text-amber-700">
          {fr
            ? 'Les deux premiers résultats sont trop proches pour être départagés avec confiance.'
            : 'The top two results are too close to be ranked with confidence.'}
        </p>
      )}
    </div>
  );
}

/**
 * Candidats suivis mais PAS comparables.
 *
 * Le produit affichait dix profils 2027 et rien d'autre : David Lisnard, déclaré depuis le
 * 31 mars 2026 avec un programme officiel structuré, était simplement invisible. La tentation
 * serait de lui inventer huit scores pour « compléter la liste » — c'est exactement ce qu'il
 * ne faut pas faire. Il figure ici avec son statut, sa date et sa source, et n'entre pas dans
 * le classement tant qu'aucune position sourcée n'a été codée.
 */
function TrackedNotComparable({ electionId, language }) {
  const tracked = getTrackedNotMatchReady(electionId);
  const selectCandidate = useStore(s => s.selectCandidate);
  if (tracked.length === 0) return null;
  const fr = language === 'fr';

  return (
    <div className="mb-6">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">
        {fr ? 'Annuaire 2027 — suivis, pas encore comparables' : '2027 directory — tracked, not yet comparable'}
      </p>
      <p className="text-xs text-gray-500 mb-3 leading-relaxed">
        {fr
          ? 'Cet annuaire distingue les candidatures déclarées, conditionnelles, les primaires, les personnes seulement pressenties et les retraits. Un nom n’entre dans le classement que lorsqu’une estimation éditoriale suffisamment complète a été préparée pour lui.'
          : 'This directory distinguishes declared and conditional candidacies, primaries, potential candidates and withdrawals. A person enters the ranking only after a sufficiently complete editorial estimate has been prepared.'}
        <span className="block mt-1 text-gray-400">
          {fr
            ? 'Programme : M0 aucun corpus 2027 · M1 orientations · M2 propositions thématiques · M3 programme officiel partiel · M4 complet · M5 version électorale archivée.'
            : 'Programme: M0 no 2027 corpus · M1 broad direction · M2 thematic proposals · M3 partial official programme · M4 complete · M5 archived electoral version.'}
        </span>
      </p>
      <div className="rounded-xl border border-gray-200 divide-y divide-gray-100 overflow-hidden">
        {tracked.map(p => (
          <div key={p.id} className="px-4 py-3">
            <div className="flex items-baseline justify-between gap-3">
              <button
                type="button"
                onClick={() => selectCandidate(p.id)}
                className="text-sm font-semibold text-gray-800 text-left hover:underline"
              >
                {p.displayName}
              </button>
              <span className="text-[11px] text-gray-400 whitespace-nowrap">{p.party}</span>
            </div>
            <p className="text-[11px] text-gray-500 mt-0.5">
              {candidacyLabel(p.status, language)}
              {p.statusDate ? ` · ${p.statusDatePrecision === 'on_or_before' ? (fr ? 'au plus tard ' : 'by ') : ''}${p.statusDate}` : ''}
              {p.programMaturity ? ` · programme ${p.programMaturity}` : ''}
            </p>
            {p.statusSource && (
              <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">{p.statusSource}</p>
            )}
            {(p.statusSourceIds ?? []).some(id => getSource(id)) && (
              <p className="text-[10px] mt-1.5 flex flex-wrap gap-x-2 gap-y-1">
                {(p.statusSourceIds ?? []).map(getSource).filter(Boolean).map(source => (
                  <a
                    key={source.id}
                    href={source.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {source.publisher}
                  </a>
                ))}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ResultsStep({ election, language, t, globalProfile, electionAnswers, priorityOrder, themeWeights, onRetake, onBack }) {
  const [expandedId, setExpandedId] = useState(null);
  const [methodOpen, setMethodOpen] = useState(false);
  const selectCandidate = useStore(s => s.selectCandidate);
  const questions = election.specificQuestions ?? [];
  const thisElectionAnswers = electionAnswers[election.id] ?? {};
  const answeredCount = questions.filter(q => thisElectionAnswers[q.id] != null).length;

  // Candidats pour lesquels le moteur refuse de produire un score (couverture insuffisante,
  // tous les thèmes comparables à poids nul, aucune donnée). Ils restent VISIBLES avec leur
  // motif : les faire disparaître laisserait croire qu'ils n'existent pas.
  // 2026-08-10 — la voie stricte reste tentée d'abord. Sans position approuvée, la page
  // affichait « Aucune donnée comparable » pour tous les candidats. Le repli éditorial est
  // demandé EXPLICITEMENT ici, et compare les réponses de l'utilisateur aux 17 questions
  // 2027 avec celles attribuées aux candidats. Tout résultat porte sa provenance.
  const ranking = useMemo(() => {
    const eligible = election.candidates.filter(c => !c.variantOf);
    return rankCandidatesForSurface({
      candidates: eligible,
      userThemes: globalProfile.themes,
      userAnswers: thisElectionAnswers,
      questions,
      questionSet: election.id,
      mode: MATCH_MODE.EDITORIAL,
      electionAnswers: thisElectionAnswers,
      priorityOrder,
      themeWeights,
      language,
    });
  }, [election, globalProfile, thisElectionAnswers, questions, priorityOrder, themeWeights, language]);

  // Candidats pour lesquels le moteur refuse de produire un score. Ils restent VISIBLES avec
  // leur motif : les faire disparaître laisserait croire qu'ils n'existent pas.
  const unscoredCandidates = useMemo(
    () => ranking.unscored.map(({ candidate, match }) => ({ ...candidate, match })),
    [ranking],
  );

  const rankedCandidates = useMemo(
    // `?? 0` afficherait « 0/100 » — un score, faux — là où le moteur dit « pas de score ».
    () => ranking.results.map(({ candidate, match }) => ({ ...candidate, alignment: match.score, match })),
    [ranking],
  );

  // Deux premiers trop proches pour être départagés → on le dit au lieu d'afficher un ordre
  // catégorique que le bruit de mesure ne soutient pas.
  const tooClose = rankedCandidates.length >= 2
    && (rankedCandidates[0].alignment - rankedCandidates[1].alignment) < 3;

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

      {/* Transparence du calcul — couverture réelle, pas seulement un score.
          Sans ce bloc, rien ne distinguait un score appuyé sur 17 positions comparables
          d'un score qui n'en utilisait aucune (le cas Le Pen/Mélenchon d'avant correctif). */}
      <MatchCoverageNotice
        rankedCandidates={rankedCandidates}
        answeredCount={answeredCount}
        totalQuestions={questions.length}
        tooClose={tooClose}
        language={language}
      />

      {/* Profile analysis */}
      {globalProfile?.themes && (
        <ProfileAnalysis
          userThemes={globalProfile.themes}
          rankedCandidates={rankedCandidates}
          language={language}
        />
      )}

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
                globalProfile={globalProfile}
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
                globalProfile={globalProfile}
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
                globalProfile={globalProfile}
                expanded={expandedId === c.id}
                onToggle={() => setExpandedId(expandedId === c.id ? null : c.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Candidats non classables — motif affiché, jamais un score de repli */}
      {unscoredCandidates.length > 0 && (
        <div className="mb-6">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
            {language === 'fr' ? 'Non classés' : 'Not ranked'}
          </p>
          <div className="rounded-xl border border-gray-200 divide-y divide-gray-100 overflow-hidden">
            {unscoredCandidates.map(c => (
              <div key={c.id} className="px-4 py-3">
                <button
                  type="button"
                  onClick={() => selectCandidate(c.id)}
                  className="text-sm font-semibold text-gray-800 text-left hover:underline"
                >
                  {c.name}
                </button>
                <p className="text-xs text-gray-500 mt-0.5">
                  {noScoreReason(c.match.reason, language)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {ranking.mode === MATCH_MODE.EDITORIAL && rankedCandidates.length > 0 && (
        <EstimateNotice
          language={language}
          questionsCompared={rankedCandidates[0]?.match?.questionsCompared ?? null}
          questionsDocumented={rankedCandidates[0]?.match?.questionsAvailable ?? null}
          userAnswered={rankedCandidates[0]?.match?.userAnswered ?? null}
          updatedAt={rankedCandidates[0]?.match?.updatedAt ?? null}
        />
      )}

      {/* Annuaire : personnes suivies mais volontairement hors classement */}
      <TrackedNotComparable electionId={election.id} language={language} />

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
              globalProfile={globalProfile}
              expanded={idx === 0 || expandedId === c.id}
              onToggle={idx !== 0 ? () => setExpandedId(expandedId === c.id ? null : c.id) : undefined}
            />
          ))}
        </div>
      )}

      {/* Compare candidates */}
      {rankedCandidates.length >= 2 && (
        <ComparePanel candidates={rankedCandidates} userThemes={globalProfile?.themes} language={language} />
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
                  {formatProximity(c.alignment)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Collapsible methodology note */}
      <div className="mb-4">
        <button
          onClick={() => setMethodOpen(o => !o)}
          className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1 transition-colors"
        >
          <span>{methodOpen ? '▾' : '▸'}</span>
          {language === 'fr' ? 'Comment ce score est calculé ?' : 'How is this score calculated?'}
        </button>
        {methodOpen && (
          <p className="text-xs text-gray-400 leading-relaxed mt-2 pl-3 border-l border-gray-200">
            {language === 'fr'
              ? 'Votre profil politique général est ajusté avec les questions spécifiques à cette élection, car les enjeux varient d\'un pays et d\'une élection à l\'autre. Le score final combine votre profil global (65 %) et vos réponses aux questions locales (35 %).'
              : 'Your general political profile is adjusted with election-specific questions, because the issues that matter vary from one country and election to another. The final score combines your global profile (65%) and your answers to local questions (35%).'}
          </p>
        )}
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

/**
 * Ventilation par thème — profil candidat DÉRIVÉ des positions sourcées.
 *
 * Lisait auparavant `candidate.profile?.[theme] ?? 50`. Deux mensonges dans une ligne :
 * la valeur venait de `legacy-manual-v1` (huit nombres saisis à la main), et le `?? 50`
 * transformait « on ne sait pas » en « exactement au centre » — un thème inconnu était
 * affiché comme une position mesurée.
 *
 * Un thème sans assez de positions approuvées est désormais montré comme INCONNU : pas de
 * nombre, pas de barre candidat, une mention explicite.
 */
function ThemeBreakdown({ userThemes, match, candidate, language }) {
  const derived = match?.derivedThemes ?? null;
  const connus = THEMES_ORDER.filter(theme => derived?.[theme] != null);

  return (
    <div className="mt-4 border-t border-gray-100 pt-4">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
        {language === 'fr' ? 'Scores par thème' : 'Theme scores'}
      </p>

      {connus.length === 0 && (
        <p className="text-xs text-gray-500 leading-relaxed mb-3">
          {language === 'fr'
            ? `Aucun thème n'est encore comparable pour ce candidat : cela demande au moins deux positions sourcées et relues par thème.`
            : `No theme is comparable for this candidate yet: this requires at least two sourced, reviewed positions per theme.`}
        </p>
      )}

      <div className="space-y-2.5">
        {THEMES_ORDER.map(theme => {
          const userScore      = userThemes?.[theme] ?? null;
          const candidateScore = derived?.[theme] ?? null;   // jamais `?? 50`
          const label = THEME_LABELS[language]?.[theme] ?? theme;
          const color = THEME_COLORS[theme] ?? '#6b7280';
          return (
            <div key={theme}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-500">{label}</span>
                <div className="flex items-center gap-1.5 text-xs tabular-nums">
                  <span style={{ color: '#60a5fa' }}>{userScore ?? '—'}</span>
                  <span className="text-gray-300">·</span>
                  {candidateScore == null ? (
                    <span className="text-gray-400 not-italic">
                      {language === 'fr' ? 'non sourcé' : 'not sourced'}
                    </span>
                  ) : (
                    <span style={{ color }}>{candidateScore}</span>
                  )}
                </div>
              </div>
              <div className="relative h-1.5 bg-gray-100 rounded-full overflow-hidden">
                {userScore != null && (
                  <div
                    className="absolute inset-y-0 left-0 h-full rounded-full"
                    style={{ width: scoreToCssPercent(userScore), backgroundColor: '#3b82f6', opacity: 0.25 }}
                  />
                )}
                {candidateScore != null && (
                  <div
                    className="absolute inset-y-0 left-0 h-full rounded-full"
                    style={{ width: scoreToCssPercent(candidateScore), backgroundColor: color, opacity: 0.75 }}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-5 mt-3">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-1.5 rounded-full inline-block" style={{ backgroundColor: '#3b82f6', opacity: 0.25 }} />
          <span className="text-xs text-gray-400">{language === 'fr' ? 'Vous' : 'You'}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-1.5 rounded-full inline-block" style={{ backgroundColor: candidate.color ?? '#374151' }} />
          <span className="text-xs text-gray-400">{candidate.name}</span>
        </div>
      </div>
    </div>
  );
}

function ComparePanel({ candidates, userThemes, language }) {
  const [selectedIds, setSelectedIds] = React.useState([]);

  const toggleCandidate = (id) => {
    setSelectedIds(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id);
      if (prev.length >= 2) return [prev[1], id];
      return [...prev, id];
    });
  };

  const selected = candidates.filter(c => selectedIds.includes(c.id));

  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden mb-6">
      <div className="p-5 border-b border-gray-100 bg-gray-50">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
          {language === 'fr' ? 'Comparer les candidats' : 'Compare candidates'}
        </p>
        <div className="flex flex-wrap gap-2">
          {candidates.map(c => {
            const isSelected = selectedIds.includes(c.id);
            return (
              <button
                key={c.id}
                onClick={() => toggleCandidate(c.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium transition-all ${
                  isSelected
                    ? 'border-gray-900 bg-gray-900 text-white'
                    : 'border-gray-200 text-gray-600 hover:border-gray-400 bg-white'
                }`}
              >
                <CandidateAvatar src={c.image} name={c.name} size={18} />
                {c.name}
              </button>
            );
          })}
        </div>
        <p className="text-xs text-gray-400 mt-2">
          {selected.length === 0
            ? (language === 'fr' ? 'Sélectionnez 2 candidats pour comparer' : 'Select 2 candidates to compare')
            : selected.length === 1
            ? (language === 'fr' ? 'Sélectionnez 1 candidat de plus' : 'Select 1 more candidate')
            : (language === 'fr' ? `Comparaison : ${selected.map(c => c.name).join(' vs ')}` : `Comparing: ${selected.map(c => c.name).join(' vs ')}`)}
        </p>
      </div>

      {selected.length === 2 && (
        <div className="p-5">
          {/* Candidate headers */}
          <div className="grid gap-3 mb-5" style={{ gridTemplateColumns: '110px 1fr 1fr' }}>
            <div />
            {selected.map(c => (
                <div key={c.id} className="flex flex-col items-center gap-1">
                  <CandidateAvatar src={c.image} name={c.name} size={36} />
                  <p className="text-xs font-semibold text-gray-800 text-center leading-tight">{c.name}</p>
                  <p className="text-xs text-gray-400">{formatProximity(c.alignment)}</p>
                </div>
              ))}
          </div>

          {/* Theme comparison rows */}
          <div className="space-y-3">
            {THEMES_ORDER.map(theme => {
              const label = THEME_LABELS[language]?.[theme] ?? theme;
              const color = THEME_COLORS[theme] ?? '#6b7280';
              const userScore = userThemes?.[theme] ?? 50;
              return (
                <div key={theme} className="grid gap-3 items-center" style={{ gridTemplateColumns: '110px 1fr 1fr' }}>
                  <span className="text-xs text-gray-500 truncate">{label}</span>
                  {selected.map(c => {
                    // Profil DÉRIVÉ des positions sourcées. `c.profile?.[theme] ?? 50` affichait
                    // une barre et un nombre pour un thème dont rien n'est établi : la
                    // comparaison côte à côte de deux candidats donnait un « Δ vs vous » calculé
                    // sur des valeurs inventées. Un thème non sourcé ne se compare pas.
                    const score = c.match?.derivedThemes?.[theme] ?? null;
                    const diff = score == null ? null : Math.abs(score - userScore);
                    return (
                      <div key={c.id}>
                        {score == null ? (
                          <p className="text-xs text-gray-400 italic">
                            {language === 'fr' ? 'non sourcé' : 'not sourced'}
                          </p>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div className="h-full rounded-full" style={{ width: scoreToCssPercent(score), backgroundColor: color }} />
                            </div>
                            <span className="text-xs tabular-nums text-gray-500 w-6 text-right flex-shrink-0">{score}</span>
                          </div>
                        )}
                        {diff != null && diff >= 30 && (
                          <p className="text-xs mt-0.5" style={{ color: '#f59e0b', fontSize: 10 }}>
                            {language === 'fr' ? `Δ${diff} vs vous` : `Δ${diff} vs you`}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>

          {/* User reference */}
          <div className="mt-5 pt-4 border-t border-gray-100">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
              {language === 'fr' ? 'Votre profil (référence)' : 'Your profile (reference)'}
            </p>
            <div className="space-y-1.5">
              {THEMES_ORDER.map(theme => {
                const label = THEME_LABELS[language]?.[theme] ?? theme;
                const color = THEME_COLORS[theme] ?? '#6b7280';
                const userScore = userThemes?.[theme] ?? 50;
                return (
                  <div key={theme} className="flex items-center gap-3">
                    <span className="text-xs text-gray-400 w-28 flex-shrink-0">{label}</span>
                    <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${userScore}%`, backgroundColor: color, opacity: 0.5 }} />
                    </div>
                    <span className="text-xs tabular-nums text-gray-400 w-6 text-right">{userScore}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CandidatePortrait({ candidate, size = 48 }) {
  return <CandidateAvatar src={candidate.image} name={candidate.name} size={size} />;
}

function CandidateResultCard({ candidate, rank, language, t, isTop, electionAnswers, questions, expanded, onToggle, globalProfile }) {
  const selectCandidate = useStore(s => s.selectCandidate);
  const { name, color, party, result, description, alignment } = candidate;
  const barColor = alignmentBarColor(alignment);
  const textColor = alignmentColorClass(alignment);
  const label = alignmentLabel(alignment, language);

  // Accords et désaccords viennent du moteur, donc de positions sourcées, datées, codées et
  // relues. Ils étaient auparavant recalculés ici depuis `q.positions[candidate.id]`.
  const match = candidate.match ?? null;
  const agreements    = match?.agreements    ?? [];
  const disagreements = match?.disagreements ?? [];
  // Les deux voies produisent la même FORME d'accords/désaccords. Ce qui les distingue est
  // dit ailleurs (bandeau d'estimation) : ici, refuser d'afficher les sujets comparés
  // laisserait un score sans la moindre justification visible.
  const aDesPreuves   = match?.breakdownSource === 'sourced-positions'
                     || match?.breakdownSource === EDITORIAL_ANSWERS_VERSION;

  return (
    <div className={`bg-white border rounded-2xl overflow-hidden transition-all hover:shadow-sm ${
      isTop ? 'border-gray-300 shadow-sm' : 'border-gray-200'
    }`}>
      {isTop && <div className="h-0.5 bg-gray-900" />}
      <div className="p-5 sm:p-6">
        <div className="flex items-start gap-3 sm:gap-4">
          {/* Portrait — clickable */}
          <button
            onClick={() => selectCandidate(candidate.id)}
            className="flex-shrink-0 rounded-full hover:opacity-80 transition-opacity"
            aria-label={`View ${name}'s profile`}
          >
            <CandidatePortrait candidate={candidate} size={52} />
          </button>

          {/* Name + meta */}
          <div className="flex-1 min-w-0">
            <button
              onClick={() => selectCandidate(candidate.id)}
              className="hover:underline text-left"
            >
              <h3 className={`font-semibold text-gray-900 truncate leading-tight ${isTop ? 'text-base' : 'text-sm'}`}>{name}</h3>
            </button>
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
            <div className={`font-bold tabular-nums ${isTop ? 'text-3xl' : 'text-2xl'} ${textColor}`}>{formatProximity(alignment)}</div>
            <div className="text-xs text-gray-400 mt-0.5">{language === 'fr' ? 'proximité' : 'proximity'}</div>
          </div>
        </div>

        {/* Bar */}
        <div className="mt-4 mb-1">
          <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full rounded-full match-bar-fill" style={{ width: scoreToCssPercent(alignment), backgroundColor: barColor }} />
          </div>
          <p className="text-xs text-gray-400 mt-1.5">{label}</p>
          {globalProfile?.themes && (
            <p className="text-xs text-gray-500 leading-relaxed mt-1">
              {getMatchSentence(globalProfile.themes, match, language)}
            </p>
          )}
        </div>

        {/* Accords et désaccords — UNIQUEMENT des positions sourcées et approuvées.
            Le repli theme-level qui lisait `candidate.profile` a été supprimé : il produisait
            des affirmations sur les positions d'une personne réelle sans aucune preuve.
            Quand rien n'est sourcé, on l'écrit ; on ne comble pas le vide. */}
        {(expanded || isTop) && (
          aDesPreuves && (agreements.length > 0 || disagreements.length > 0) ? (
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
          ) : (
            <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-3">
              <p className="text-xs text-gray-600 leading-relaxed">
                {language === 'fr'
                  ? `Aucun accord ou désaccord détaillé n'est affiché : cela suppose des positions sourcées, datées et relues, question par question. Le détail apparaîtra à mesure que ces positions seront publiées.`
                  : `No detailed agreements or disagreements are shown: that requires sourced, dated and reviewed positions, question by question. Details will appear as those positions are published.`}
              </p>
            </div>
          )
        )}

        {/* Bio (expanded) */}
        {(expanded || isTop) && description && (
          <p className="mt-4 text-sm text-gray-500 leading-relaxed border-t border-gray-100 pt-3">
            {typeof description === 'object' ? description[language] : description}
          </p>
        )}

        {/* Theme breakdown (expanded) */}
        {(expanded || isTop) && globalProfile?.themes && (
          <ThemeBreakdown userThemes={globalProfile.themes} match={match} candidate={candidate} language={language} />
        )}

        {/* Toggle + profile link */}
        <div className="mt-3 flex items-center gap-4">
          {!isTop && onToggle && (
            <button
              onClick={onToggle}
              className="text-xs text-blue-500 hover:text-blue-700 font-medium"
            >
              {expanded
                ? (language === 'fr' ? '▲ Réduire' : '▲ Collapse')
                : (language === 'fr' ? '▼ Voir les détails' : '▼ View details')}
            </button>
          )}
          {(expanded || isTop) && (
            <button
              onClick={() => selectCandidate(candidate.id)}
              className="text-xs text-gray-400 hover:text-gray-700 font-medium transition-colors"
            >
              {language === 'fr' ? 'Voir le profil →' : 'View profile →'}
            </button>
          )}
        </div>
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
  const themeWeights       = useStore(s => s.themeWeights);
  const navigate           = useStore(s => s.navigate);
  const selectedElectionId = useStore(s => s.selectedElectionId);
  const setSelectedElection = useStore(s => s.selectElection);
  const electionAnswers    = useStore(s => s.electionAnswers);
  const answerElectionQuestion = useStore(s => s.answerElectionQuestion);
  const clearElectionAnswers = useStore(s => s.clearElectionAnswers);
  const t = createTranslator(language);

  // Support direct URL access (/elections/:id)
  const { id: paramId } = useParams();
  const electionId = paramId ?? selectedElectionId;

  // Sync URL param → store so the rest of the app stays in sync
  useEffect(() => {
    if (paramId && paramId !== selectedElectionId) {
      // Update store without re-triggering router navigation
      useStore.setState({ selectedElectionId: paramId, currentPage: 'electionDetail' });
    }
  }, [paramId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Track election view once electionId is known
  useEffect(() => {
    if (electionId) trackElectionViewed({ electionId });
  }, [electionId]); // eslint-disable-line react-hooks/exhaustive-deps

  const adjustedProfile = profile
    ? { ...profile, themes: applyAdjustments(profile.themes, profileAdjustments) }
    : null;

  const [step, setStep] = useState('context'); // 'context' | 'questionnaire' | 'results'

  const election = elections.find(e => e.id === electionId);

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
          themeWeights={themeWeights}
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
