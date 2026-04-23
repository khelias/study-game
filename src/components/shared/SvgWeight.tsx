/**
 * SvgWeight Component
 *
 * Weight tokens for the balance scale. Clean, rounded style to match the rest of the app.
 */

import React, { useMemo, useId } from 'react';

export interface SvgWeightProps {
  x: number;
  y: number;
  num?: number;
  label?: string;
  color: 'blue' | 'red' | 'neutral';
  dashed?: boolean;
  /** sm = compact, scale = on pans (slightly bigger), md = default */
  size?: 'sm' | 'scale' | 'md';
}

const SIZE = {
  sm: { w: 32, h: 32, rx: 8, font: 14, shadowRy: 4 },
  scale: { w: 38, h: 38, rx: 9, font: 16, shadowRy: 5 },
  md: { w: 40, h: 40, rx: 10, font: 20, shadowRy: 5 },
} as const;

export const SvgWeight: React.FC<SvgWeightProps> = ({
  x,
  y,
  num,
  label,
  color,
  dashed,
  size: sizeProp = 'md',
}) => {
  const uid = useId();
  const displayText = label ?? String(num ?? '');
  const s = SIZE[sizeProp];
  const fontSize = label ? Math.round(s.font * 0.9) : s.font;

  const safeId = uid.replace(/:/g, '');
  const gradId = `swGrad-${safeId}`;
  const shadowId = `swShadow-${safeId}`;
  const palette = useMemo(() => {
    if (color === 'blue') {
      return {
        stroke: '#2563eb',
        textFill: '#ffffff',
        textStroke: '#1e40af',
        stops: [
          { offset: '0%', color: '#60a5fa' },
          { offset: '100%', color: '#2563eb' },
        ],
      };
    }
    if (color === 'red') {
      return {
        stroke: '#dc2626',
        textFill: '#ffffff',
        textStroke: '#991b1b',
        stops: [
          { offset: '0%', color: '#f87171' },
          { offset: '100%', color: '#dc2626' },
        ],
      };
    }
    return {
      stroke: '#94a3b8',
      textFill: '#475569',
      textStroke: 'transparent',
      stops: [
        { offset: '0%', color: '#e2e8f0' },
        { offset: '100%', color: '#cbd5e1' },
      ],
    };
  }, [color]);

  return (
    <g transform={`translate(${x}, ${y})`}>
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="0%" y2="100%">
          {palette.stops.map((stop) => (
            <stop key={stop.offset} offset={stop.offset} stopColor={stop.color} />
          ))}
        </linearGradient>
        <filter id={shadowId}>
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.2" />
        </filter>
      </defs>

      {/* Shadow on tray – just below weight base so it reads as cast on the pan */}
      <ellipse
        cx="0"
        cy={s.h / 2 + 4}
        rx={s.w * 0.5}
        ry={s.shadowRy + 2}
        fill="#000"
        opacity="0.12"
      />

      {/* Weight body – solid block, slight bevel for “weight” look */}
      <rect
        x={-s.w / 2}
        y={-s.h / 2 - 2}
        width={s.w}
        height={s.h}
        rx={s.rx}
        ry={s.rx}
        fill={`url(#${gradId})`}
        stroke={palette.stroke}
        strokeWidth="2"
        strokeDasharray={dashed ? '6 4' : undefined}
        filter={`url(#${shadowId})`}
      />
      {/* Bottom edge – suggests thickness / metal weight */}
      <rect
        x={-s.w / 2 + 2}
        y={s.h / 2 - 6}
        width={s.w - 4}
        height="4"
        rx="1"
        fill="rgba(0,0,0,0.15)"
      />
      {/* Top highlight */}
      <rect
        x={-s.w / 2 + 2}
        y={-s.h / 2}
        width={s.w - 4}
        height={Math.round(s.h * 0.26)}
        rx={s.rx - 2}
        fill="rgba(255,255,255,0.3)"
      />

      {/* Number or label – vertically centered in weight */}
      <text
        x="0"
        y={-2}
        textAnchor="middle"
        fontSize={fontSize}
        fontWeight="800"
        fontFamily="system-ui, sans-serif"
        fill={palette.textFill}
        stroke={palette.textStroke}
        strokeWidth={color === 'neutral' ? 0 : 0.5}
        dominantBaseline="middle"
      >
        {displayText}
      </text>
    </g>
  );
};
