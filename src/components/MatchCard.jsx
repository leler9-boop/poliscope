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

  const bio     = description     ? (typeof description     === 'object' ? description[language]     : description)     : null;
  const context = political_context ? (typeof political_context === 'object' ? political_context[language] : political_context) : null;
  const disc    = disclaimer      ? (typeof disclaimer      === 'object' ? disclaimer[language]      : disclaimer)      : null;

  return (
    <div className={`bg-white rounded-xl border ${isTopMatch ? 'border-blue-200 shadow-md' : 'border-gray-100 shadow-sm'} overflow-hidden transition-shadow hover:shadow-md`}>
      {isTopMatch && (
        <div className="bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white">
          ⭐ {language === 'fr' ? 'Votre meilleure correspondance' : 'Your closest match'}
        </div>
      )}

      <div className="p-4 sm:p-5">
        <div className="flex items-start gap-3">
          {/* Rank */}
          {rank != null && (
            <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
              {rank}
            </div>
          )}

          {/* Name + meta */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              {color && <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />}
              <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{name}</h3>
              {target.flag && <span className="text-base leading-none">{target.flag}</span>}
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
              <p className="text-xs text-blue-700 bg-blue-50 rounded px-2 py-0.5 mt-1.5 inline-block">
                {context}
              </p>
            )}
          </div>

          {/* Alignment score */}
          <div className="text-right flex-shrink-0">
            <div className={`text-2xl font-bold ${textColor}`}>{alignment}%</div>
            <div className="text-xs text-gray-400">{language === 'fr' ? 'compat.' : 'match'}</div>
          </div>
        </div>

        {/* Alignment bar */}
        <div className="mt-3">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>{label}</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full match-bar-fill"
              style={{ width: `${alignment}%`, backgroundColor: barColor }}
            />
          </div>
        </div>

        {/* Why match */}
        {whyMatch && (
          <p className="mt-2 text-xs text-gray-500 italic">{whyMatch}</p>
        )}

        {/* Toggle biography */}
        {showDetails && (bio || disc) && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-3 text-xs text-blue-500 hover:text-blue-700 font-medium"
          >
            {expanded
              ? (language === 'fr' ? '▲ Masquer' : '▲ Hide')
              : (language === 'fr' ? '▼ Biographie' : '▼ Biography')}
          </button>
        )}

        {expanded && (
          <div className="mt-3 space-y-2">
            {bio && <p className="text-sm text-gray-600 leading-relaxed">{bio}</p>}
            {disc && (
              <p className="text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded p-2">
                {disc}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
