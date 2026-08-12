import React, { useId, useRef, useState } from 'react';

/**
 * POLISCOP — Le classement des candidats : UN SEUL verdict à la fois.
 *
 * ⚠ CE QUE CE COMPOSANT REMPLACE
 * ------------------------------
 * La page Profil présentait TROIS verdicts concurrents : une carte « ressemblance », une
 * carte « priorités », puis une ancienne liste « Candidats 2027 » calculée séparément par
 * un autre appel du moteur. Trois nombres pour la même question, sans que rien n'indique
 * lequel fait foi. Une personne qui voyait un nom en haut et un autre plus bas ne pouvait
 * pas savoir laquelle des deux lectures était la sienne.
 *
 * Ici, un sélecteur choisit la LECTURE, et absolument tout en découle : la liste, le
 * premier candidat, les compteurs et le détail. Changer de lecture change tout l'ensemble
 * d'un coup — c'est ce qui rend les deux lectures comparables au lieu de concurrentes.
 *
 * ⚠ AFFICHAGE. Un score se lit « 64/100 », jamais « 64 % ». Un pourcentage suggère une part
 * mesurée d'une population ; ces nombres sont des indices de proximité calculés sur un
 * nombre de questions déclaré à côté d'eux.
 *
 * ACCESSIBILITÉ. Le sélecteur est un vrai groupe de boutons radio pilotable au clavier :
 * flèches pour changer de lecture, `aria-checked` porté par l'option réellement active.
 * Un `<div>` cliquable aurait été invisible au lecteur d'écran.
 */

export const RANKING_MODE = Object.freeze({
  IDEOLOGICAL: 'ideological',
  ELECTORAL:   'electoral',
});

const LABELS = {
  fr: {
    [RANKING_MODE.IDEOLOGICAL]: 'Ressemblance politique',
    [RANKING_MODE.ELECTORAL]:   'Priorités pour mon vote',
    legend: 'Choisir la façon de comparer',
    compared: 'questions comparées',
    available: 'positions disponibles',
    unknown: 'positions inconnues',
    updated: 'Mis à jour le',
    estimate: 'Estimation éditoriale Poliscop',
    verified: 'Positions vérifiées',
    mixed: 'Positions vérifiées et estimations',
    none: 'Aucune position disponible',
    explainIdeological: 'Vos réponses comparées à celles attribuées aux candidats, sans pondération. Toutes les questions comptent pareil.',
    explainElectoral: 'Les mêmes réponses, pondérées par l’importance que vous donnez aux thèmes et par les décisions qui peuvent influencer votre vote.',
    weighted: 'questions pesant dans le calcul',
    influences: 'décisions utilisées ici',
    themes: 'thèmes évalués',
  },
  en: {
    [RANKING_MODE.IDEOLOGICAL]: 'Political resemblance',
    [RANKING_MODE.ELECTORAL]:   'Priorities for my vote',
    legend: 'Choose how to compare',
    compared: 'questions compared',
    available: 'positions available',
    unknown: 'unknown positions',
    updated: 'Updated on',
    estimate: 'Poliscop editorial estimate',
    verified: 'Verified positions',
    mixed: 'Verified positions and estimates',
    none: 'No position available',
    explainIdeological: 'Your answers compared to those attributed to candidates, unweighted. Every question counts the same.',
    explainElectoral: 'The same answers, weighted by the importance you give to themes and by the decisions that could influence your vote.',
    weighted: 'questions carrying weight',
    influences: 'decisions used here',
    themes: 'themes rated',
  },
};

/** Nature du corpus ayant produit CE score — jamais déduite d'un défaut de données. */
function corpusNature(match, t) {
  const verified = match?.verifiedPositionsUsed ?? 0;
  const estimated = match?.estimatedPositionsUsed ?? 0;
  if (verified > 0 && estimated > 0) return t.mixed;
  if (verified > 0) return t.verified;
  if (estimated > 0) return t.estimate;
  return t.none;
}

export default function CandidateRankingPanel({
  dualRanking,
  language = 'fr',
  themesAnsweredCount = 0,
  onSelectCandidate = null,
  mode: controlledMode = null,
  onModeChange = null,
}) {
  // Contrôlable depuis la page : l'aperçu de l'en-tête doit suivre la même lecture, sinon
  // deux endroits de l'écran désigneraient à nouveau deux personnes différentes.
  const [uncontrolledMode, setUncontrolledMode] = useState(RANKING_MODE.IDEOLOGICAL);
  const mode = controlledMode ?? uncontrolledMode;
  const setMode = (next) => {
    setUncontrolledMode(next);
    onModeChange?.(next);
  };
  const groupId = useId();
  const refs = useRef({});
  const t = LABELS[language] ?? LABELS.fr;

  const active = dualRanking?.[mode];
  const results = active?.results ?? [];
  const order = [RANKING_MODE.IDEOLOGICAL, RANKING_MODE.ELECTORAL];

  // Flèches : on déplace la sélection ET le focus, comme un vrai groupe radio.
  const onKeyDown = (event) => {
    const keys = ['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp'];
    if (!keys.includes(event.key)) return;
    event.preventDefault();
    const step = (event.key === 'ArrowRight' || event.key === 'ArrowDown') ? 1 : -1;
    const next = order[(order.indexOf(mode) + step + order.length) % order.length];
    setMode(next);
    refs.current[next]?.focus();
  };

  if (!dualRanking) return null;

  const winner = results[0] ?? null;
  const m = winner?.match ?? null;

  return (
    <section className="mb-6 sm:mb-8 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
      <h2 className="font-bold text-slate-900 text-lg tracking-tight mb-1">
        {language === 'fr' ? 'Les candidats, selon votre lecture' : 'Candidates, by your reading'}
      </h2>

      {/* ── Sélecteur : une seule lecture active, tout en découle ───────────── */}
      <div
        role="radiogroup"
        aria-label={t.legend}
        onKeyDown={onKeyDown}
        className="flex flex-col sm:flex-row gap-2 mt-3 mb-3"
      >
        {order.map(value => (
          <button
            key={value}
            id={`${groupId}-${value}`}
            ref={el => { refs.current[value] = el; }}
            type="button"
            role="radio"
            aria-checked={mode === value}
            tabIndex={mode === value ? 0 : -1}
            onClick={() => setMode(value)}
            className={`flex-1 px-3.5 py-2.5 rounded-xl border text-sm font-semibold transition-colors ${
              mode === value
                ? 'border-slate-900 bg-slate-900 text-white'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            {t[value]}
          </button>
        ))}
      </div>

      <p className="text-xs text-slate-500 leading-relaxed mb-4">
        {mode === RANKING_MODE.IDEOLOGICAL ? t.explainIdeological : t.explainElectoral}
      </p>

      {/* ── La liste. Le premier élément EST le gagnant : pas de carte séparée
             qui pourrait diverger de la liste. ─────────────────────────────── */}
      {results.length === 0 ? (
        <p className="text-xs text-slate-600 leading-relaxed">
          {language === 'fr'
            ? 'Aucun candidat n’est comparable dans cette lecture pour le moment.'
            : 'No candidate is comparable in this reading for now.'}
        </p>
      ) : (
        <ol className="space-y-1.5">
          {results.map((entry, index) => {
            const c = entry.candidate;
            const row = (
              <>
                <span className="w-5 text-[11px] tabular-nums text-slate-400 shrink-0">{index + 1}</span>
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: c.color ?? '#94a3b8' }}
                  aria-hidden="true"
                />
                <span className={`truncate flex-1 text-sm ${index === 0 ? 'font-bold text-slate-900' : 'text-slate-700'}`}>
                  {c.name}
                </span>
                <span className="text-sm font-bold tabular-nums text-slate-900 shrink-0">
                  {entry.match.score}
                  <span className="text-[11px] font-medium text-slate-400">/100</span>
                </span>
              </>
            );
            const className = `w-full flex items-center gap-2.5 px-3 py-2 rounded-xl border text-left ${
              index === 0 ? 'border-slate-300 bg-slate-50' : 'border-slate-100 bg-white'
            }`;
            return (
              <li key={c.id}>
                {onSelectCandidate ? (
                  <button type="button" onClick={() => onSelectCandidate(c)} className={`${className} hover:bg-slate-100 transition-colors`}>
                    {row}
                  </button>
                ) : (
                  <div className={className}>{row}</div>
                )}
              </li>
            );
          })}
        </ol>
      )}

      {/* ── Compteurs du mode sélectionné, jamais d'un autre calcul ─────────── */}
      {m && (
        <div className="mt-3 pt-3 border-t border-slate-100">
          <p className="text-[11px] text-slate-500 leading-relaxed">
            {m.questionsCompared} {t.compared}
            {' · '}{m.estimatedPositionsUsed + m.verifiedPositionsUsed} {t.available}
            {' · '}{m.unknownPositions} {t.unknown}
            {mode === RANKING_MODE.ELECTORAL && (
              <>
                {' · '}{m.questionsWeighted} {t.weighted}
                {' · '}{m.influenceDeclared} {t.influences}
                {' · '}{themesAnsweredCount} {t.themes}
              </>
            )}
          </p>
          <p className="text-[11px] text-slate-500 leading-relaxed mt-1">
            {corpusNature(m, t)}
            {m.updatedAt ? ` · ${t.updated} ${m.updatedAt}` : ''}
          </p>
        </div>
      )}
    </section>
  );
}
