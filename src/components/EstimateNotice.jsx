import React from 'react';

/**
 * POLISCOP — Bandeau de provenance d'un classement éditorial.
 *
 * RÈGLE PRODUIT : dès qu'une estimation entre dans un calcul, le résultat est présenté comme
 * une estimation. Le mot « vérifié » est réservé aux résultats dont TOUTES les contributions
 * respectent le contrat strict (position sourcée, relue, datée).
 *
 * Ce composant existe parce qu'au 2026-08-10 les scores éditoriaux se sont affichés sur
 * Profil et Élection sans la moindre mention de leur nature : un score sur 100 sans son
 * origine se lit comme une mesure, pas comme une estimation.
 *
 * Ce qu'il ne dira jamais : une probabilité de vote, une « confiance scientifique », une
 * « précision élevée », ou qu'un programme est officiel quand il ne l'est pas.
 */
export default function EstimateNotice({
  language = 'fr',
  questionsCompared = null,
  questionsAvailable = null,
  updatedAt = null,
  compact = false,
}) {
  const fr = language !== 'en';

  const title = fr ? 'Estimation Poliscop' : 'Poliscop estimate';
  const body = fr
    ? 'Ces scores reposent sur les réponses que Poliscop attribue aux candidats, à partir de '
      + 'leurs positions publiques, de leur orientation politique et des programmes disponibles '
      + 'aujourd’hui. Ce sont des estimations, pas des positions vérifiées une par une. Elles '
      + 'sont datées et corrigées au fil des annonces.'
    : 'These scores rely on the answers Poliscop attributes to candidates, based on their '
      + 'public positions, political orientation and currently available programmes. They are '
      + 'estimates, not individually verified positions. They are dated and revised as '
      + 'announcements come.';

  const coverage = questionsCompared != null && questionsAvailable != null
    ? (fr
      ? `Comparaison fondée sur ${questionsCompared} sujets communs sur ${questionsAvailable}.`
      : `Based on ${questionsCompared} shared topics out of ${questionsAvailable}.`)
    : null;

  const updated = updatedAt
    ? (fr ? `Estimation mise à jour le ${updatedAt}.` : `Estimate updated on ${updatedAt}.`)
    : null;

  return (
    <div
      className={`rounded-xl border border-amber-200 bg-amber-50/70 px-3.5 ${compact ? 'py-2.5' : 'py-3'} mb-4`}
      role="note"
    >
      <p className="text-[13px] font-semibold text-amber-900 mb-0.5">{title}</p>
      {!compact && <p className="text-xs text-amber-900/80 leading-relaxed">{body}</p>}
      {(coverage || updated) && (
        <p className="text-[11px] text-amber-900/70 mt-1.5">
          {[coverage, updated].filter(Boolean).join(' ')}
        </p>
      )}
    </div>
  );
}
