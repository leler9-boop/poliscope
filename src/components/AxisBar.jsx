import React from 'react';
import { motion } from 'motion/react';

/**
 * Horizontal axis bar showing ideological position.
 * score: 0–100 (0 = left label, 100 = right label)
 * Marker animates from center to position on mount.
 */
export default function AxisBar({ label, score, leftLabel, rightLabel }) {
  const clampedScore = Math.max(0, Math.min(100, score ?? 50));
  const markerPct = clampedScore;
  const isRight = clampedScore >= 50;
  const fillColor = isRight ? '#2563eb' : '#6b7280';

  const fillStyle = {
    left:            isRight ? '50%' : `${clampedScore}%`,
    right:           isRight ? `${100 - clampedScore}%` : '50%',
    backgroundColor: fillColor,
    opacity:         0.28,
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">{label}</span>
        <motion.span
          key={clampedScore}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="text-xs font-bold tabular-nums"
          style={{ color: fillColor }}
        >
          {clampedScore}
        </motion.span>
      </div>

      <div className="relative h-2 rounded-full bg-gray-100">
        {/* Directional fill from center */}
        <div className="absolute top-0 h-full rounded-full" style={fillStyle} />
        {/* Center tick */}
        <div className="absolute top-1/2 -translate-y-1/2 w-px h-4 bg-gray-300" style={{ left: '50%' }} />
        {/* Animated position marker */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white border-2 shadow-md"
          style={{ borderColor: fillColor }}
          initial={{ left: 'calc(50% - 7px)' }}
          animate={{ left: `calc(${markerPct}% - 7px)` }}
          transition={{ duration: 1.0, ease: [0.34, 1.2, 0.64, 1] }}
        />
      </div>

      <div className="flex justify-between mt-1.5">
        <span className="text-xs text-gray-400">{leftLabel}</span>
        <span className="text-xs text-gray-400">{rightLabel}</span>
      </div>
    </div>
  );
}
