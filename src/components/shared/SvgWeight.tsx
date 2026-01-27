/**
 * SvgWeight Component
 * 
 * SVG weight component for balance scale visualization.
 */

import React, { useMemo, useId } from 'react';

export interface SvgWeightProps {
  x: number;
  y: number;
  num?: number;
  label?: string;
  color: 'blue' | 'red' | 'neutral';
  dashed?: boolean;
}

export const SvgWeight: React.FC<SvgWeightProps> = ({ x, y, num, label, color, dashed }) => {
  const uid = useId();
  const palette = useMemo(() => {
    if (color === 'blue') {
      return {
        mainTop: '#93c5fd',
        mainBottom: '#3b82f6',
        sideFrom: '#2563eb',
        sideTo: '#1e40af',
        stroke: '#1d4ed8',
        highlight: '#bfdbfe',
        textFill: '#ffffff',
        textStroke: '#1e3a8a'
      };
    }
    if (color === 'red') {
      return {
        mainTop: '#fda4af',
        mainBottom: '#ef4444',
        sideFrom: '#dc2626',
        sideTo: '#b91c1c',
        stroke: '#dc2626',
        highlight: '#fecaca',
        textFill: '#ffffff',
        textStroke: '#7f1d1d'
      };
    }
    return {
      mainTop: '#f3f4f6',
      mainBottom: '#d1d5db',
      sideFrom: '#9ca3af',
      sideTo: '#6b7280',
      stroke: '#9ca3af',
      highlight: '#e5e7eb',
      textFill: '#ef4444',
      textStroke: '#dc2626'
    };
  }, [color]);
  const displayText = label ?? String(num ?? '');
  const fontSize = label ? 22 : 20;
  return (
    <g transform={`translate(${x}, ${y})`}>
      <defs>
        <linearGradient id={`weightGradTop-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={palette.mainTop} stopOpacity="1" />
          <stop offset="100%" stopColor={palette.mainBottom} stopOpacity="1" />
        </linearGradient>
        <linearGradient id={`weightGradSide-${uid}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={palette.sideFrom} stopOpacity="1" />
          <stop offset="100%" stopColor={palette.sideTo} stopOpacity="1" />
        </linearGradient>
        <filter id={`weightShadow-${uid}`}>
          <feDropShadow dx="2" dy="3" stdDeviation="2.5" floodOpacity="0.35"/>
        </filter>
      </defs>
      
      {/* Shadow from bottom */}
      <ellipse cx="0" cy="8" rx="16" ry="4" fill="black" opacity="0.18" filter={`url(#weightShadow-${uid})`} />
      
      {/* 3D weight - front */}
      <rect x="-16" y="-22" width="32" height="32" rx="5" ry="5" 
            fill={`url(#weightGradTop-${uid})`} 
            stroke={palette.stroke} 
            strokeWidth="2.25"
            strokeDasharray={dashed ? '5 3' : undefined}
            filter={`url(#weightShadow-${uid})`} />
      
      {/* 3D effect - right side (depth) */}
      <path d="M 16 -22 L 20 -18 L 20 10 L 16 10 Z" 
            fill={`url(#weightGradSide-${uid})`} 
            opacity="0.7" />
      
      {/* Top curvature (3D effect) */}
      <ellipse cx="0" cy="-22" rx="16" ry="6" fill={palette.highlight} opacity="0.65" />
      
      {/* Number background */}
      <circle cx="0" cy="-5" r="10" fill="white" opacity="0.25" />
      
      {/* Number */}
      <text x="0" y="2" textAnchor="middle"
            fontSize={fontSize} fontWeight="900" fontFamily="Arial, sans-serif"
            fill={palette.textFill}
            stroke={palette.textStroke} strokeWidth="1"
            style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}
            dominantBaseline="middle">
        {displayText}
      </text>
      
      {/* Glow effect */}
      <ellipse cx="-8" cy="-18" rx="4" ry="3" fill="white" opacity="0.35" />
    </g>
  );
};
