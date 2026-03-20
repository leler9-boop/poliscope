import React from 'react';
import { motion } from 'motion/react';

/** Returns a short readable label for a score on a named axis. */
function interpLabel(score, leftLabel, rightLabel, language) {
  const s = score ?? 50;
  const ll = leftLabel?.toLowerCase() ?? '';
  const rl = rightLabel?.toLowerCase() ?? '';
  if (s <= 20) return language === 'fr' ? `Très ${ll}` : `Very ${ll}`;
  if (s <= 38) return language === 'fr' ? `Plutôt ${ll}` : `Rather ${ll}`;
  if (s <= 62) return language === 'fr' ? 'Modéré' : 'Moderate';
  if (s <= 80) return language === 'fr' ? `Plutôt ${rl}` : `Rather ${rl}`;
  return language === 'fr' ? `Très ${rl}` : `Very ${rl}`;
}

/**
 * Horizontal axis bar showing ideological position.
 * score: 0–100 (0 = leftLabel, 100 = rightLabel)
 * Marker animates from center to position on mount.
 * Props: label, score, leftLabel, rightLabel, color (optional), language
 */
export default function AxisBar({ label, score, leftLabel, rightLabel, color, language = 'en', delay = 0 }) {
  const clampedScore = Math.max(0, Math.min(100, score ?? 50));
  const isRight = clampedScore >= 50;
  const dotColor = color ?? (isRight ? '#2563eb' : '#6b7280');
  const interp = interpLabel(clampedScore, leftLabel, rightLabel, language);

  const fillStyle = {
    left:            isRight ? '50%' : `${clampedScore}%`,
    right:           isRight ? `${100 - clampedScore}%` : '50%',
    backgroundColor: dotColor,
    opacity:         0.18,
  };

  return (
    <div className="mb-6 last:mb-0">
      {/* Axis name */}
      <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest block mb-3">
        {label}
      </span>

      {/* Track */}
      <div className="relative h-2 rounded-full bg-gray-100">
        {/* Directional fill from center */}
        <div className="absolute top-0 h-full rounded-full" style={fillStyle} />
        {/* Center tick */}
        <div className="absolute top-1/2 -translate-y-1/2 w-px h-4 bg-gray-200" style={{ left: '50%' }} />
        {/* Animated dot */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white shadow-md border-[2.5px]"
          style={{ borderColor: dotColor }}
          initial={{ left: 'calc(50% - 8px)' }}
          animate={{ left: `calc(${clampedScore}% - 8px)` }}
          transition={{ duration: 1.1, delay, ease: [0.34, 1.15, 0.64, 1] }}
        />
      </div>

      {/* Pole labels */}
      <div className="flex justify-between mt-1.5">
        <span className="text-xs text-gray-400">{leftLabel}</span>
        <span className="text-xs text-gray-400">{rightLabel}</span>
      </div>

      {/* Interpretation label */}
      <motion.p
        className="text-xs font-medium mt-1 capitalize"
        style={{ color: dotColor }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: delay + 0.6 }}
      >
        {interp}
      </motion.p>
    </div>
  );
}
