import React from 'react';
import {
  VOTE_INFLUENCE_ORDER, VOTE_INFLUENCE_LABELS, VOTE_INFLUENCE_LEVEL,
} from '../engine/priorityWeights.js';

/**
 * POLISCOP — « Cette décision pourrait-elle influencer votre vote ? »
 *
 * Posée seulement après les questions SPÉCIALISÉES (`voteInfluencePrompt` dans la banque) :
 * on peut avoir une opinion tranchée sur les quotas de chansons à la radio sans que cela pèse
 * une seconde dans un choix présidentiel. C'est cet écart que le dispositif mesure.
 *
 * ⚠ CE QUE CETTE RÉPONSE NE FAIT PAS. Choisir « Pas du tout » ne touche NI à la réponse
 * politique, NI au profil idéologique, NI au décompte des réponses. Seul le poids de cette
 * question dans le classement électoral tombe à zéro. Ce n'est ni « sans opinion », ni une
 * question ignorée, ni une suppression.
 *
 * « Je préfère ne pas répondre » est distinct de « Pas du tout » : il laisse l'influence NON
 * RENSEIGNÉE, donc au multiplicateur neutre. Sans cette porte de sortie, quelqu'un qui veut
 * seulement avancer serait poussé vers une valeur qu'il ne pense pas.
 */
export default function VoteInfluencePrompt({ language = 'fr', value = null, onChoose, onSkip }) {
  const fr = language !== 'en';
  const labels = VOTE_INFLUENCE_LABELS[fr ? 'fr' : 'en'];

  return (
    <div
      className="mt-3 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3"
      role="group"
      aria-label={fr ? 'Influence de cette décision sur votre vote' : 'Influence of this decision on your vote'}
    >
      <p className="text-[13px] font-medium text-slate-700 mb-2.5">
        {fr
          ? 'Cette décision pourrait-elle influencer votre vote ?'
          : 'Could this decision influence your vote?'}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {VOTE_INFLUENCE_ORDER.map(level => {
          const selected = value === level;
          return (
            <button
              key={level}
              type="button"
              aria-pressed={selected}
              onClick={() => onChoose(level)}
              className={`min-h-[44px] px-3 py-2 rounded-lg text-xs font-medium border transition-colors flex-1 min-w-[calc(50%-0.375rem)] sm:min-w-0 ${
                selected
                  ? 'bg-slate-900 text-white border-transparent'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {labels[level]}
            </button>
          );
        })}
      </div>
      <button
        type="button"
        onClick={onSkip}
        className="mt-2 text-[11px] text-slate-400 hover:text-slate-600 underline underline-offset-2 transition-colors"
      >
        {fr ? 'Je préfère ne pas répondre' : 'I would rather not answer'}
      </button>
      <p className="mt-2 text-[11px] text-slate-400 leading-relaxed">
        {fr
          ? 'Votre réponse à la question reste enregistrée dans votre profil politique, quelle que soit votre réponse ici.'
          : 'Your answer to the question stays in your political profile, whatever you answer here.'}
      </p>
    </div>
  );
}

export { VOTE_INFLUENCE_LEVEL };
