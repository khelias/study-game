/* eslint-disable react-refresh/only-export-components -- Constants co-located with PieceSvg by design */
import React from 'react';
import { ShapeType } from '../../types/game';

// Standard 100x100 viewBox
// All shapes centered at 50,50 for correct rotation
// NO PADDING: Shapes touch the edges (0,0 to 100,100) where appropriate.

export const SHAPE_PATHS: Record<ShapeType, string> = {
  // Triangle pointing UP.
  triangle: 'M50,0 L100,100 L0,100 Z',

  // Right-angled triangle (bottom-left corner is 90 deg)
  half_square: 'M0,0 L100,100 L0,100 Z',

  // Square filling the box
  square: 'M0,0 L100,0 L100,100 L0,100 Z',

  // Rectangle - landscape by default
  rectangle: 'M0,25 L100,25 L100,75 L0,75 Z',

  // Diamond
  diamond: 'M50,0 L100,50 L50,100 L0,50 Z',

  // Hexagon
  hexagon: 'M25,0 L75,0 L100,50 L75,100 L25,100 L0,50 Z',

  // Circle
  circle: 'M50,50 m-50,0 a50,50 0 1,0 100,0 a50,50 0 1,0 -100,0',
};

// Map logical colors to Tailwind classes or Hex values
// We use hex for SVG fill to ensure it works in all contexts
export const SHAPE_COLORS: Record<string, { fill: string; stroke: string; strokeWidth: number }> = {
  red: { fill: '#ef4444', stroke: '#b91c1c', strokeWidth: 2 },
  blue: { fill: '#3b82f6', stroke: '#1d4ed8', strokeWidth: 2 },
  green: { fill: '#22c55e', stroke: '#15803d', strokeWidth: 2 },
  yellow: { fill: '#eab308', stroke: '#a16207', strokeWidth: 2 },
  purple: { fill: '#a855f7', stroke: '#7e22ce', strokeWidth: 2 },
  orange: { fill: '#f97316', stroke: '#c2410c', strokeWidth: 2 },
  pink: { fill: '#ec4899', stroke: '#be185d', strokeWidth: 2 },
  cyan: { fill: '#06b6d4', stroke: '#0e7490', strokeWidth: 2 },
  brown: { fill: '#92400e', stroke: '#78350f', strokeWidth: 2 },
  white: { fill: '#f8fafc', stroke: '#94a3b8', strokeWidth: 3 }, // Distinct stroke for white
  gold: { fill: '#fbbf24', stroke: '#b45309', strokeWidth: 2 },
  gray: { fill: '#64748b', stroke: '#334155', strokeWidth: 2 },
};

const DEFAULT_STYLE = { fill: '#64748b', stroke: '#334155', strokeWidth: 2 };

export const getShapeStyle = (
  colorName: string,
): { fill: string; stroke: string; strokeWidth: number } => {
  return SHAPE_COLORS[colorName] ?? DEFAULT_STYLE;
};

interface PieceSvgProps {
  type: ShapeType;
  color: string;
  rotation?: number;
  className?: string;
  opacity?: number;
  dropShadow?: boolean;
}

export const PieceSvg: React.FC<PieceSvgProps> = ({
  type,
  color,
  rotation = 0,
  className = '',
  opacity = 1,
  dropShadow = false,
}) => {
  const { fill, stroke, strokeWidth } = getShapeStyle(color);

  return (
    <svg
      viewBox="0 0 100 100"
      className={`${className} ${dropShadow ? 'filter drop-shadow-md' : ''}`}
      style={{
        transform: `rotate(${rotation}deg)`,
        opacity,
        overflow: 'visible', // Allow shadow to spill
      }}
    >
      <path
        d={SHAPE_PATHS[type] || SHAPE_PATHS.square}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        vectorEffect="non-scaling-stroke"
        strokeLinejoin="round"
      />
    </svg>
  );
};
