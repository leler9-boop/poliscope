import React from 'react';
import { motion } from 'motion/react';

function interpLabel(score, leftLabel, rightLabel, language) {
  const s = score ?? 50;
  const ll = leftLabel?.toLowerCase() ?? '';
  const rl = rightLabel?.toLowerCase() ?? '';
  if (s <= 20) return language === 'fr' ? `Très ${ll}`    : `Very ${ll}`;
  if (s <= 38) return language === 'fr' ? `Plutôt ${ll}`  : `Rather ${ll}`;
  if (s <= 62) return language === 'fr' ? 'Modéré'        : 'Moderate';
  if (s <= 80) return language === 'fr' ? `Plutôt ${rl}`  : `Rather ${rl}`;
  return              language === 'fr' ? `Très ${rl}`    : `Very ${rl}`;
}

/**
 * Horizontal axis bar — ideological position.
 * score: 0–100 (0 = leftLabel, 100 = rightLabel)
 */
export default function AxisBar({ label, score, leftLabel, rightLabel, color, language = 'en', delay = 0 }) {
  const s        = Math.max(0, Math.min(100, score ?? 50));
  const isRight  = s >= 50;
  const dotColor = color ?? (isRight ? '#2563EB' : '#64748B');
  const interp   = interpLabel(s, leftLabel, rightLabel, language);

  const fillStyle = {
    left:            isRight ? '50%' : `${s}%`,
    right:           isRight ? `${100 - s}%` : '50%',
    backgroundColor: dotColor,
    opacity:         0.14,
  };

  return (
    <div className="mb-5 last:mb-0">
      {/* Label axe + interp on one line for mobile density */}
      <div className="flex items-baseline justify-between mb-2">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
          {label}
        </span>
        <motion.span
          className="text-[11px] font-semibold capitalize"
          style={{ color: dotColor }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35, delay: delay + 0.55 }}
        >
          {interp}
        </motion.span>
      </div>

      {/* Piste */}
      <div className="relative h-2 rounded-full bg-slate-100">
        {/* Fill directionnel depuis le centre */}
        <div className="absolute top-0 h-full rounded-full transition-all" style={fillStyle} />
        {/* Tick central */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-px h-3 bg-slate-200"
          style={{ left: '50%' }}
        />
        {/* Marqueur animé */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white border-2"
          style={{
            borderColor: dotColor,
            boxShadow: `0 1px 3px rgba(15,23,42,0.12)`,
          }}
          initial={{ left: 'calc(50% - 7px)' }}
          animate={{ left: `calc(${s}% - 7px)` }}
          transition={{ duration: 1.0, delay, ease: [0.34, 1.12, 0.64, 1] }}
        />
      </div>

      {/* Pôles */}
      <div className="flex justify-between mt-1.5">
        <span className="text-[10px] text-slate-400">{leftLabel}</span>
        <span className="text-[10px] text-slate-400">{rightLabel}</span>
      </div>
    </div>
  );
}
