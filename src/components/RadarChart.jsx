import React from 'react';
import { THEMES_ORDER, THEME_LABELS, THEME_COLORS } from '../data/questions.js';

/**
 * Custom SVG Radar (Spider) Chart for political profile visualization.
 */
export default function RadarChart({ themes, language = 'en', size = 280 }) {
  if (!themes) return null;

  const cx = size / 2;
  const cy = size / 2;
  const maxRadius = size * 0.38;
  const labelOffset = size * 0.48;
  const n = THEMES_ORDER.length;
  const levels = [20, 40, 60, 80, 100];

  // Angle for each axis (starting from top, going clockwise)
  const angleFor = (i) => (Math.PI * 2 * i) / n - Math.PI / 2;

  // Convert (angle, radius) to (x, y)
  const polar = (angle, r) => ({
    x: cx + r * Math.cos(angle),
    y: cy + r * Math.sin(angle),
  });

  // Background circles
  const circles = levels.map(lvl => {
    const r = (lvl / 100) * maxRadius;
    const pts = Array.from({ length: n }, (_, i) => polar(angleFor(i), r));
    const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(' ') + ' Z';
    return { d, lvl };
  });

  // User data polygon
  const dataPoints = THEMES_ORDER.map((theme, i) => {
    const score = themes[theme] ?? 50;
    const r = (score / 100) * maxRadius;
    return polar(angleFor(i), r);
  });
  const dataPath = dataPoints
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
    .join(' ') + ' Z';

  // Axis lines
  const axes = THEMES_ORDER.map((_, i) => {
    const end = polar(angleFor(i), maxRadius);
    return { x1: cx, y1: cy, x2: end.x, y2: end.y };
  });

  // Label positions
  const labelData = THEMES_ORDER.map((theme, i) => {
    const angle = angleFor(i);
    const pos = polar(angle, labelOffset);
    const label = THEME_LABELS[language]?.[theme] ?? theme;
    const score = themes[theme] ?? 50;
    const color = THEME_COLORS[theme] ?? '#6b7280';
    // Text anchor based on position
    let anchor = 'middle';
    const cosA = Math.cos(angle);
    if (cosA > 0.2) anchor = 'start';
    else if (cosA < -0.2) anchor = 'end';
    return { pos, label, score, color, anchor, i };
  });

  return (
    <div className="flex flex-col items-center">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label="Political profile radar chart"
        className="overflow-visible"
      >
        {/* Background polygons */}
        {circles.map(({ d, lvl }) => (
          <path
            key={lvl}
            d={d}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="1"
          />
        ))}

        {/* Level labels */}
        {[20, 40, 60, 80].map(lvl => {
          const r = (lvl / 100) * maxRadius;
          const pos = polar(-Math.PI / 2 + 0.01, r);
          return (
            <text key={lvl} x={pos.x + 3} y={pos.y} fontSize="8" fill="#9ca3af">
              {lvl}
            </text>
          );
        })}

        {/* Axis lines */}
        {axes.map((axis, i) => (
          <line
            key={i}
            x1={axis.x1} y1={axis.y1}
            x2={axis.x2} y2={axis.y2}
            stroke="#e5e7eb"
            strokeWidth="1"
          />
        ))}

        {/* Data polygon — fill */}
        <path
          d={dataPath}
          fill="#2563eb"
          fillOpacity="0.15"
          stroke="none"
          className="radar-area"
        />

        {/* Data polygon — stroke */}
        <path
          d={dataPath}
          fill="none"
          stroke="#2563eb"
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {dataPoints.map((pt, i) => (
          <circle
            key={i}
            cx={pt.x}
            cy={pt.y}
            r="4"
            fill={THEME_COLORS[THEMES_ORDER[i]] ?? '#2563eb'}
            stroke="white"
            strokeWidth="1.5"
          />
        ))}

        {/* Labels */}
        {labelData.map(({ pos, label, score, color, anchor }) => (
          <g key={label}>
            <text
              x={pos.x}
              y={pos.y - 5}
              textAnchor={anchor}
              fontSize="9"
              fontWeight="600"
              fill={color}
              className="select-none"
            >
              {label}
            </text>
            <text
              x={pos.x}
              y={pos.y + 8}
              textAnchor={anchor}
              fontSize="9"
              fill="#6b7280"
              className="select-none"
            >
              {score}
            </text>
          </g>
        ))}

        {/* Center dot */}
        <circle cx={cx} cy={cy} r="3" fill="#d1d5db" />
      </svg>
    </div>
  );
}
