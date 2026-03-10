import React from 'react';

/**
 * Horizontal axis bar showing ideological position.
 * score: 0–100 (0 = left label, 100 = right label)
 */
export default function AxisBar({ label, score, leftLabel, rightLabel }) {
  const clampedScore = Math.max(0, Math.min(100, score ?? 50));
  const markerPct = clampedScore;

  // Subtle fill from centre toward the position
  const fillStyle = {
    left:  clampedScore >= 50 ? '50%' : `${clampedScore}%`,
    right: clampedScore >= 50 ? `${100 - clampedScore}%` : '50%',
    background: '#d1d5db',
    opacity: 0.9,
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">{label}</span>
        <span className="text-xs font-bold text-gray-600 tabular-nums">{clampedScore}</span>
      </div>

      {/* Track */}
      <div className="relative h-1.5 rounded-full bg-gray-100">
        {/* Fill from centre */}
        <div className="absolute top-0 h-full rounded-full" style={fillStyle} />
        {/* Centre marker */}
        <div className="absolute top-1/2 -translate-y-1/2 w-px h-3 bg-gray-300" style={{ left: '50%' }} />
        {/* Position marker */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white border-2 border-gray-500 shadow-sm transition-all duration-500"
          style={{ left: `calc(${markerPct}% - 6px)` }}
        />
      </div>

      {/* Labels */}
      <div className="flex justify-between mt-2">
        <span className="text-xs text-gray-400">{leftLabel}</span>
        <span className="text-xs text-gray-400">{rightLabel}</span>
      </div>
    </div>
  );
}
