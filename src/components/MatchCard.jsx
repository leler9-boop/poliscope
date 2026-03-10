import React, { useState } from 'react';
import { alignmentBarColor, alignmentColorClass, alignmentLabel } from '../engine/matcher.js';

export default function MatchCard({
  target,
  rank,
  language = 'en',
  showDetails = true,
  isTopMatch = false,
  whyMatch = null,
}) {
  const [expanded, setExpanded] = useState(isTopMatch);
  const { name, alignment, color, description, disclaimer, political_context } = target;

  const barColor  = alignmentBarColor(alignment);
  const textColor = alignmentColorClass(alignment);
  const label     = alignmentLabel(alignment, language);

  const bio     = description      ? (typeof description      === 'object' ? description[language]      : description)      : null;
  const context = political_context ? (typeof political_context === 'object' ? political_context[language] : political_context) : null;
  const disc    = disclaimer       ? (typeof disclaimer       === 'object' ? disclaimer[language]       : disclaimer)       : null;

  return (
    <div className={`bg-white rounded-2xl border overflow-hidden transition-all hover:shadow-sm ${
      isTopMatch ? 'border-gray-300 shadow-sm' : 'border-gray-200'
    }`}>
      {/* Top match accent bar */}
      {isTopMatch && (
        <div className="h-0.5 bg-gray-900" />
      )}

      <div className={`p-5 sm:p-6 ${isTopMatch ? '' : ''}`}>
        {/* Top match label */}
        {isTopMatch && (
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
            {language === 'fr' ? 'Meilleure correspondance' : 'Closest match'}
          </p>
        )}

        <div className="flex items-start gap-3 sm:gap-4">
          {/* Rank */}
          {rank != null && (
            <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
              isTopMatch ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-500'
            }`}>
              {rank}
            </div>
          )}

          {/* Name + meta */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              {color && <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />}
              <h3 className={`font-semibold truncate ${isTopMatch ? 'text-gray-900 text-base' : 'text-gray-900 text-sm'}`}>{name}</h3>
              {target.flag && <span className="text-base leading-none flex-shrink-0">{target.flag}</span>}
            </div>
            {target.party && (
              <p className="text-xs text-gray-400 mb-0.5">
                {typeof target.party === 'object' ? target.party[language] : target.party}
              </p>
            )}
            {target.role && (
              <p className="text-xs text-gray-400">
                {typeof target.role === 'object' ? target.role[language] : target.role}
                {target.years && <span className="ml-1 text-gray-300">· {target.years}</span>}
              </p>
            )}
            {context && (
              <p className="text-xs text-blue-700 bg-blue-50 rounded-md px-2 py-0.5 mt-1.5 inline-block">
                {context}
              </p>
            )}
          </div>

          {/* Score */}
          <div className="text-right flex-shrink-0">
            <div className={`font-bold tabular-nums ${isTopMatch ? 'text-3xl' : 'text-2xl'} ${textColor}`}>{alignment}%</div>
            <div className="text-xs text-gray-400 mt-0.5">{language === 'fr' ? 'compat.' : 'match'}</div>
          </div>
        </div>

        {/* Alignment bar */}
        <div className="mt-4">
          <div className={`rounded-full overflow-hidden ${isTopMatch ? 'h-1.5' : 'h-1'} bg-gray-100`}>
            <div
              className="h-full rounded-full match-bar-fill"
              style={{ width: `${alignment}%`, backgroundColor: barColor }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-1.5">{label}</p>
        </div>

        {/* Why match */}
        {whyMatch && (
          <p className="mt-3 text-xs text-gray-500 leading-relaxed">{whyMatch}</p>
        )}

        {/* Toggle biography */}
        {showDetails && (bio || disc) && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-4 text-xs font-medium text-gray-400 hover:text-gray-700 transition-colors flex items-center gap-1"
          >
            <span>{expanded ? '▲' : '▼'}</span>
            <span>{expanded
              ? (language === 'fr' ? 'Masquer' : 'Hide')
              : (language === 'fr' ? 'Biographie' : 'Biography')}</span>
          </button>
        )}

        {expanded && (
          <div className="mt-3 pt-3 border-t border-gray-100 space-y-3">
            {bio && <p className="text-sm text-gray-600 leading-relaxed">{bio}</p>}
            {disc && (
              <p className="text-xs text-gray-400 leading-relaxed border-l-2 border-gray-200 pl-3">
                {disc}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
