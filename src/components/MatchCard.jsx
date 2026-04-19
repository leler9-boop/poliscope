import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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

  const bio     = description       ? (typeof description       === 'object' ? description[language]       : description)       : null;
  const context = political_context ? (typeof political_context === 'object' ? political_context[language] : political_context) : null;
  const disc    = disclaimer        ? (typeof disclaimer        === 'object' ? disclaimer[language]        : disclaimer)        : null;

  const isHighlighted = isTopMatch || (rank != null && rank <= 3);

  return (
    <motion.div
      className={`bg-white rounded-2xl border overflow-hidden ${
        isTopMatch     ? 'border-slate-200 shadow-md'  :
        isHighlighted  ? 'border-slate-200 shadow-sm'  :
                         'border-slate-100'
      }`}
      style={isTopMatch ? { borderLeftWidth: 3, borderLeftColor: barColor } : {}}
      whileHover={{
        y: -2,
        boxShadow: '0 10px 28px rgba(0,0,0,0.09)',
        transition: { duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] },
      }}
    >
      {/* Top accent bar */}
      {isTopMatch && (
        <div className="h-[3px]" style={{ backgroundColor: barColor }} />
      )}

      <div className="p-5 sm:p-6">
        {/* Top match badge */}
        {isTopMatch && (
          <div className="mb-4">
            <span
              className="text-xs font-semibold px-2.5 py-1 rounded-full text-white"
              style={{ backgroundColor: barColor }}
            >
              {language === 'fr' ? '★ Meilleure correspondance' : '★ Closest match'}
            </span>
          </div>
        )}

        <div className="flex items-start gap-3 sm:gap-4">
          {/* Rank badge */}
          {rank != null && (
            <div
              className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
              style={
                isTopMatch    ? { backgroundColor: barColor, color: 'white' } :
                rank <= 3     ? { backgroundColor: `${barColor}22`, color: barColor } :
                                { backgroundColor: '#f3f4f6', color: '#9ca3af' }
              }
            >
              {rank}
            </div>
          )}

          {/* Name + meta */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              {target.emoji && (
                <span className="text-base leading-none flex-shrink-0">{target.emoji}</span>
              )}
              {color && !target.emoji && (
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
              )}
              <h3 className={`font-semibold truncate ${isTopMatch ? 'text-slate-900 text-base' : 'text-slate-900 text-sm'}`}>
                {name}
              </h3>
              {target.flag && <span className="text-sm leading-none flex-shrink-0">{target.flag}</span>}
            </div>
            {target.party && (
              <p className="text-xs text-slate-400 mb-0.5">
                {typeof target.party === 'object' ? target.party[language] : target.party}
              </p>
            )}
            {target.role && (
              <p className="text-xs text-slate-400">
                {typeof target.role === 'object' ? target.role[language] : target.role}
                {target.years && <span className="ml-1 text-slate-300">· {target.years}</span>}
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
            <motion.div
              className={`font-bold tabular-nums ${isTopMatch ? 'text-3xl' : 'text-xl'} ${textColor}`}
              initial={{ opacity: 0, scale: 0.75 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.45, delay: 0.1, ease: [0.34, 1.2, 0.64, 1] }}
            >
              {alignment}%
            </motion.div>
            <div className="text-xs text-slate-400 mt-0.5">{language === 'fr' ? 'compat.' : 'match'}</div>
          </div>
        </div>

        {/* Alignment bar */}
        <div className="mt-4">
          <div className={`rounded-full overflow-hidden ${isTopMatch ? 'h-1.5' : 'h-1'} bg-slate-100`}>
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: barColor }}
              initial={{ width: '0%' }}
              animate={{ width: `${alignment}%` }}
              transition={{ duration: 0.85, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
            />
          </div>
          <p className="text-xs text-slate-400 mt-1.5">{label}</p>
        </div>

        {/* Why match */}
        {whyMatch && (
          <p className="mt-3 text-xs text-slate-500 leading-relaxed italic">{whyMatch}</p>
        )}

        {/* Toggle biography */}
        {showDetails && (bio || disc) && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-4 text-xs font-medium text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-1.5"
          >
            <span className="text-slate-300 text-[10px]">{expanded ? '▲' : '▼'}</span>
            <span>{expanded
              ? (language === 'fr' ? 'Masquer' : 'Hide details')
              : (language === 'fr' ? 'Biographie' : 'Biography')}</span>
          </button>
        )}

        <AnimatePresence>
          {expanded && (
            <motion.div
              className="mt-3 pt-3 border-t border-slate-100 space-y-3 overflow-hidden"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {bio && <p className="text-sm text-slate-600 leading-relaxed">{bio}</p>}
              {disc && (
                <p className="text-xs text-slate-400 leading-relaxed border-l-2 border-slate-200 pl-3">
                  {disc}
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
