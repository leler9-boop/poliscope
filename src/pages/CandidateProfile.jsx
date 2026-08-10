import React, { useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useStore } from '../store/useStore.js';
import { elections } from '../data/elections.js';
import { candidateDetails } from '../data/candidateDetails.js';
import { getRegistryEntry } from '../data/candidateRegistry.js';
import { getPositions, getSource, positionCoverage, REVIEW_STATUS } from '../data/candidateProvenance.js';
import { questions as GENERAL_QUESTIONS, THEMES_ORDER, THEME_LABELS, THEME_COLORS } from '../data/questions.js';
import { CANDIDATE_POLICIES, POLICY_ELECTION_IDS } from '../data/candidatePolicies.js';
import { CandidateAvatar } from '../components/LazyImage.jsx';
import { trackCandidateViewed, trackCompareStarted } from '../lib/analytics.js';
import { ThemeComparison } from '../components/CompareBar.jsx';
import EstimateNotice from '../components/EstimateNotice.jsx';
// La fiche candidat affichait ses « Positions idéologiques » depuis `candidate.profile`,
// c'est-à-dire huit nombres `legacy-manual-v1` saisis à la main, sans preuve par position.
// Le moteur dérive désormais ces thèmes des seules positions approuvées et relues.
import { computeCandidateMatch } from '../engine/candidateMatch.js';
import { deriveEditorialCandidateThemes } from '../engine/editorialMatch.js';


function findCandidate(id) {
  for (const election of elections) {
    const c = election.candidates.find(c => c.id === id);
    if (c) return { candidate: c, election };
  }

  // L'annuaire 2027 suit davantage de personnes que les dix anciennes fiches codées dans
  // elections.js. Une personne du registre doit malgré tout avoir une page factuelle : son
  // absence du matching ne doit pas la rendre invisible.
  const record = getRegistryEntry(id);
  const electionId = record?.trackedFor?.find(trackedId => trackedId === 'fr_2027');
  const election = elections.find(item => item.id === electionId);
  if (record && election) {
    return {
      election,
      candidate: {
        id: record.id,
        name: record.displayName,
        party: record.party,
        candidacyStatus: record.status,
        color: '#374151',
      },
    };
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

const STATUS_CONFIG = {
  declared:          { fr: 'Candidature déclarée', en: 'Declared candidacy', bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', dot: 'bg-green-500' },
  invested:          { fr: 'Investi par son parti', en: 'Party nominee', bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', dot: 'bg-green-500' },
  officially_validated: { fr: 'Candidature validée par le Conseil constitutionnel', en: 'Candidacy officially validated', bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', dot: 'bg-green-500' },
  primary_candidate: { fr: 'Candidat à une primaire', en: 'Primary candidate', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-400' },
  conditional:       { fr: 'Candidature conditionnelle', en: 'Conditional candidacy', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-400' },
  potential:         { fr: 'Pressenti — non déclaré', en: 'Potential — not declared', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-400' },
  contingency:       { fr: 'Scénario de remplacement — non candidat', en: 'Contingency — not a candidate', bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200', dot: 'bg-gray-400' },
  withdrawn:         { fr: 'Candidature retirée ou écartée', en: 'Withdrawn or ruled out', bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', dot: 'bg-red-400' },
  ineligible:        { fr: 'Inéligible', en: 'Ineligible', bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', dot: 'bg-red-400' },
  probable:          { fr: 'Candidature probable', en: 'Probable candidate', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-400' },
  speculative:       { fr: 'Hypothèse politique', en: 'Political hypothesis', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-400' },
};

const PROGRAM_MATURITY_LABELS = {
  M0: { fr: 'Aucun corpus 2027 identifié', en: 'No 2027 corpus identified' },
  M1: { fr: 'Orientations générales', en: 'Broad directions' },
  M2: { fr: 'Propositions thématiques', en: 'Thematic proposals' },
  M3: { fr: 'Programme officiel partiel', en: 'Partial official programme' },
  M4: { fr: 'Programme officiel complet', en: 'Complete official programme' },
  M5: { fr: 'Version électorale archivée', en: 'Archived electoral version' },
};

export default function CandidateProfile() {
  const language            = useStore(s => s.language);
  const navigate            = useStore(s => s.navigate);
  const selectElection      = useStore(s => s.selectElection);
  const selectedCandidateId = useStore(s => s.selectedCandidateId);
  const startCompare        = useStore(s => s.startCompare);
  const profile             = useStore(s => s.profile);
  const profileAdjustments  = useStore(s => s.profileAdjustments);
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
  const candidate = found?.candidate ?? null;
  const election = found?.election ?? null;
  const registryEntry = getRegistryEntry(candidateId);
  const is2027 = election?.id === 'fr_2027' && registryEntry?.trackedFor?.includes('fr_2027');
  const details   = candidateDetails[candidateId] ?? candidateDetails[baseId(candidateId)] ?? {};
  const timeline  = details.timeline ?? [];
  const positions = details.positions?.[language] ?? [];
  const status = registryEntry?.status ?? candidate?.candidacyStatus;
  const statusDetail = registryEntry?.statusSource
    ?? (typeof candidate?.result === 'object' ? candidate.result[language] : candidate?.result);
  const programSources = (registryEntry?.programSourceIds ?? []).map(getSource).filter(Boolean);
  const editorialPositions = is2027 ? getPositions(registryEntry.id) : [];
  const factSourceIds = [...new Set([
    ...(registryEntry?.statusSourceIds ?? []),
    ...(registryEntry?.programSourceIds ?? []),
    ...editorialPositions.flatMap(position => position.sourceIds ?? []),
  ])];
  const factSources = factSourceIds.map(getSource).filter(Boolean);
  const codedPositionCount = editorialPositions.filter(position => position.stance != null).length;
  const pendingPositionCount = editorialPositions.filter(
    position => position.reviewStatus === REVIEW_STATUS.PENDING_REVIEW,
  ).length;
  const approvedCoverage = is2027 ? positionCoverage(registryEntry.id) : null;

  useEffect(() => {
    if (!found && candidateId) navigate('elections');
  }, [found, candidateId, navigate]);

  // Build adjusted user themes for comparison
  const userThemes = React.useMemo(() => {
    if (!profile?.themes) return null;
    const themes = { ...profile.themes };
    Object.entries(profileAdjustments ?? {}).forEach(([k, v]) => {
      if (themes[k] != null) themes[k] = Math.max(0, Math.min(100, themes[k] + v));
    });
    return themes;
  }, [profile, profileAdjustments]);

  // Voie stricte : conservée séparément pour le jour où un corpus approuvé couvrira assez de
  // thèmes. Elle ne lit jamais les estimations éditoriales.
  const strictThemes = React.useMemo(() => {
    if (!candidate || !election) return null;
    return computeCandidateMatch({
      userThemes: userThemes ?? {},
      candidate,
      questions: election?.specificQuestions ?? [],
      language,
    }).derivedThemes ?? null;
  }, [candidate, election, userThemes, language]);

  // Voie éditoriale : les onze candidats du matching 2027 disposent désormais de 128 réponses
  // explicites. C'est cette voie, clairement étiquetée, qui rend la comparaison par sujet
  // cohérente avec le score général affiché sur Profil.
  const editorialThemeProfile = React.useMemo(() => {
    if (!candidate || !is2027) return null;
    return deriveEditorialCandidateThemes({
      candidateId: candidate.id,
      questions: GENERAL_QUESTIONS,
      questionSet: 'general',
    });
  }, [candidate, is2027]);
  const hasEditorialThemes = (editorialThemeProfile?.knownAnswers ?? 0) > 0;
  const hasStrictThemes = Object.values(strictThemes ?? {}).some(value => value != null);
  const derivedThemes = hasEditorialThemes
    ? editorialThemeProfile.themes
    : hasStrictThemes ? strictThemes : null;

  if (!found || !candidate || !election) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Back */}
      <button
        onClick={() => selectElection(election.id)}
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
          {candidate.result && !is2027 && (
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

      {/* Candidacy status badge */}
      {status && (
        <div className="mb-6">
          {(() => {
            const s = STATUS_CONFIG[status] ?? STATUS_CONFIG.speculative;
            const label = language === 'fr' ? s.fr : s.en;
            return (
              <div className={`inline-flex items-start gap-2 rounded-xl border px-3.5 py-2.5 ${s.bg} ${s.border}`}>
                <span className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${s.dot}`} />
                <div>
                  <p className={`text-xs font-bold ${s.text}`}>{label}</p>
                  {statusDetail && <p className={`text-xs mt-0.5 ${s.text} opacity-75`}>{statusDetail}</p>}
                  {registryEntry?.statusDate && (
                    <p className={`text-[11px] mt-1 ${s.text} opacity-60`}>
                      {language === 'fr' ? 'Situation vérifiée au' : 'Status verified on'} {registryEntry.lastReviewed ?? registryEntry.statusDate}
                    </p>
                  )}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Bio */}
      {is2027 ? (
        <section className="mb-8">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
            {language === 'fr' ? 'Repères vérifiés' : 'Verified facts'}
          </h2>
          <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600 leading-relaxed">
            <p><span className="font-semibold text-gray-800">{language === 'fr' ? 'Formation :' : 'Party:'}</span> {registryEntry.party}</p>
            <p className="mt-1"><span className="font-semibold text-gray-800">{language === 'fr' ? 'Statut :' : 'Status:'}</span> {statusDetail}</p>
            <p className="mt-2 text-xs text-gray-400">
              {language === 'fr'
                ? 'Poliscop sépare les faits de candidature, les documents programmatiques et les positions utilisées pour le matching.'
                : 'Poliscop separates candidacy facts, programme documents and positions used for matching.'}
            </p>
          </div>
        </section>
      ) : candidate.description ? (
        <section className="mb-8">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
            {language === 'fr' ? 'Profil' : 'Profile'}
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {typeof candidate.description === 'object' ? candidate.description[language] : candidate.description}
          </p>
        </section>
      ) : null}

      {/* Programme */}
      <section className="mb-8">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
          {language === 'fr' ? 'Programme' : 'Programme'}
        </h2>
        {is2027 ? (
          <div className="rounded-xl bg-gray-50 border border-gray-200 px-4 py-3 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold text-gray-800">
                {PROGRAM_MATURITY_LABELS[registryEntry.programMaturity]?.[language]
                  ?? registryEntry.programMaturity
                  ?? (language === 'fr' ? 'État non documenté' : 'Undocumented status')}
              </span>
              {registryEntry.programMaturity && (
                <span className="rounded-full bg-white border border-gray-200 px-2 py-0.5 text-[11px] font-semibold text-gray-500">
                  {registryEntry.programMaturity}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              {language === 'fr'
                ? 'Ce niveau décrit le corpus disponible, pas une validation du contenu. Une orientation ou un chantier participatif n’est pas présenté comme un programme électoral définitif.'
                : 'This level describes the available corpus, not an endorsement. Broad directions or participatory work are not presented as a final electoral programme.'}
            </p>
            {programSources.length > 0 ? (
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-1">
                <a href={programSources[0].url} target="_blank" rel="noreferrer" className="text-xs font-medium text-blue-600 hover:underline">
                  {language === 'fr' ? 'Consulter le corpus principal' : 'Open the main corpus'}
                </a>
                <span className="text-xs text-gray-400">
                  {programSources.length} {language === 'fr' ? 'documents officiels rattachés' : 'official documents attached'}
                </span>
              </div>
            ) : (
              <p className="text-xs text-amber-700">
                {language === 'fr'
                  ? 'Aucun document programmatique primaire n’est encore rattaché à cette fiche.'
                  : 'No primary programme document is attached to this page yet.'}
              </p>
            )}
          </div>
        ) : candidate.programme?.[language] ? (
          <p className="text-gray-700 leading-relaxed">{candidate.programme[language]}</p>
        ) : (
          <div className="rounded-xl bg-gray-50 border border-gray-100 px-4 py-3 space-y-1.5">
            <p className="text-sm text-gray-500">
              {language === 'fr'
                ? 'Programme officiel non publié à ce stade.'
                : 'Official programme not yet published.'}
            </p>
            <p className="text-xs text-gray-400 leading-relaxed">
              {language === 'fr'
                ? 'Les informations historiques ci-dessous ne participent pas au matching.'
                : 'The historical information below is not used in matching.'}
            </p>
          </div>
        )}
      </section>

      {/* Key positions */}
      {!is2027 && positions.length > 0 && (
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
      {!is2027 && timeline.length > 0 && (
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
        {hasEditorialThemes && (
          <EstimateNotice
            language={language}
            questionsCompared={editorialThemeProfile.knownAnswers}
            questionsDocumented={editorialThemeProfile.questionsAvailable}
            updatedAt={editorialThemeProfile.updatedAt}
          />
        )}
        {derivedThemes && Object.values(derivedThemes).some(v => v != null) ? (
          <ThemeComparison
            userThemes={userThemes}
            targetThemes={derivedThemes}
            targetName={candidate.name.split(' ').pop()}
            language={language}
            policyTexts={
              !hasEditorialThemes && POLICY_ELECTION_IDS.has(election.id)
                ? Object.fromEntries(
                    Object.entries(CANDIDATE_POLICIES[candidateId] ?? CANDIDATE_POLICIES[baseId(candidateId)] ?? {}).map(([theme, vals]) => [
                      theme,
                      (() => {
                        const uScore = userThemes?.[theme];
                        const cScore = derivedThemes?.[theme];
                        // Sans position sourcée pour ce thème, aucun texte de politique n'est
                        // affiché : le rapprocher du profil de l'utilisateur supposerait une
                        // proximité qu'aucune preuve n'établit.
                        if (uScore == null || cScore == null) return null;
                        return Math.abs(uScore - cScore) < 28 ? (vals?.[language] ?? null) : null;
                      })(),
                    ])
                  )
                : {}
            }
          />
        ) : (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <p className="text-sm text-gray-600 leading-relaxed">
              {language === 'fr'
                ? `Aucune estimation thématique suffisamment complète n'est encore disponible pour ${candidate.name}. Aucun score n'est inventé en l'absence de corpus exploitable.`
                : `No sufficiently complete thematic estimate is available for ${candidate.name} yet. No score is invented without usable data.`}
            </p>
          </div>
        )}
        {is2027 && approvedCoverage && (
          <div className="mt-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400 mb-1.5">
              {language === 'fr' ? 'Progression de la vérification stricte' : 'Strict verification progress'}
            </p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-semibold text-gray-600">
              <span>{codedPositionCount}/{approvedCoverage.total} {language === 'fr' ? 'positions codées' : 'positions coded'}</span>
              <span>{approvedCoverage.approved}/{approvedCoverage.total} {language === 'fr' ? 'positions validées' : 'positions approved'}</span>
            </div>
            {pendingPositionCount > 0 && (
              <p className="text-xs text-amber-700 mt-2 leading-relaxed">
                {language === 'fr'
                  ? `${pendingPositionCount} positions sont en attente d’une relecture indépendante. Elles restent séparées de l’estimation tant que cette validation n’est pas terminée.`
                  : `${pendingPositionCount} positions await independent review. They remain separate from the estimate until validation is complete.`}
              </p>
            )}
          </div>
        )}
      </section>

      {is2027 && factSources.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
            {language === 'fr' ? 'Sources vérifiées' : 'Verified sources'}
          </h2>
          <div className="rounded-xl border border-gray-200 divide-y divide-gray-100 overflow-hidden">
            {factSources.map(source => (
              <a
                key={source.id}
                href={source.url}
                target="_blank"
                rel="noreferrer"
                className="block px-4 py-3 hover:bg-gray-50 transition-colors"
              >
                <p className="text-sm font-medium text-gray-800">{source.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {source.publisher} · {language === 'fr' ? 'vérifiée le' : 'verified on'} {source.verifiedAt}
                </p>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Compare with others */}
      {!is2027 && election.candidates.filter(c => c.id !== candidate.id).length > 0 && (
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
