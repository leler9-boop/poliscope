import React from 'react';

/**
 * Horizontal axis bar showing ideological position.
 * score: 0–100 (0 = left label, 100 = right label)
 */
export default function AxisBar({ label, score, leftLabel, rightLabel }) {
  const clampedScore = Math.max(0, Math.min(100, score ?? 50));

  // Color based on position (subtle)
  const trackColor = '#e5e7eb';

  // Marker position
  const markerPct = clampedScore;

  return (
    <div className="mb-5">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</span>
        <span className="text-xs font-bold text-gray-700">{clampedScore}</span>
      </div>

      {/* Track */}
      <div className="relative h-2 rounded-full bg-gray-200">
        {/* Gradient fill from center */}
        <div
          className="absolute top-0 h-full rounded-full"
          style={{
            left:  clampedScore >= 50 ? '50%' : `${clampedScore}%`,
            right: clampedScore >= 50 ? `${100 - clampedScore}%` : '50%',
            background: clampedScore >= 50
              ? 'linear-gradient(to right, #93c5fd, #2563eb)'
              : 'linear-gradient(to right, #dc2626, #fca5a5)',
          }}
        />
        {/* Marker */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white border-2 border-gray-400 shadow-sm"
          style={{ left: `calc(${markerPct}% - 7px)` }}
        />
      </div>

      {/* Labels */}
      <div className="flex justify-between mt-1.5">
        <span className="text-xs text-gray-400">{leftLabel}</span>
        <span className="text-xs text-gray-400">{rightLabel}</span>
      </div>
    </div>
  );
}
