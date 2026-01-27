/**
 * BalanceScaleView Component
 * 
 * Game view for balance scale problems.
 */

import React, { useState } from 'react';
import { playSound } from '../../engine/audio';
import type { BalanceScaleProblem } from '../../types/game';
import { SvgWeight } from '../shared/SvgWeight';

interface BalanceScaleViewProps {
  problem: BalanceScaleProblem;
  onAnswer: (isCorrect: boolean) => void;
  soundEnabled: boolean;
}

export const BalanceScaleView: React.FC<BalanceScaleViewProps> = ({ problem, onAnswer, soundEnabled }) => {
  const problemUid: string = problem.uid;
  const [disabled, setDisabled] = useState<number[]>([]);
  const [tilt, setTilt] = useState<number>(-10);
  const [prevUid, setPrevUid] = useState<string>(problemUid);

  // Reset state when problem changes (derived state pattern)
  if (problemUid !== prevUid) {
    setDisabled([]);
    setTilt(-10);
    setPrevUid(problemUid);
  }

  const handleChoice = (weight: number): void => {
    playSound('click', soundEnabled);
    const leftSum: number = problem.display.left.reduce((a, b) => a + b, 0);
    const rightKnown: number = problem.display.right.reduce((a, b) => a + b, 0);
    const totalRight: number = rightKnown + weight;

    let newTilt = 0;
    if (leftSum > totalRight) newTilt = -20;
    else if (totalRight > leftSum) newTilt = 20;
    else newTilt = 0;

    setTilt(newTilt);

    setTimeout(() => {
      if (leftSum === totalRight) {
        onAnswer(leftSum === totalRight);
      } else {
        setDisabled((prev: number[]) => [...prev, weight]);
        setTimeout(() => setTilt(newTilt > 0 ? -15 : newTilt), 300); 
        onAnswer(leftSum === totalRight);
      }
    }, 1000);
  };

  return (
    <div className="w-full flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500 px-2">
      <div className="relative w-full max-w-sm h-56 sm:h-64 mb-3 sm:mb-4 flex justify-center overflow-hidden">
        <svg width="100%" height="100%" viewBox="0 0 340 240" preserveAspectRatio="xMidYMid meet" className="overflow-visible" style={{ minHeight: '240px' }}>
            <defs>
                {/* Golden gradient for scale */}
                <linearGradient id="gradGold" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#fbbf24" />
                  <stop offset="50%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#d97706" />
                </linearGradient>
                <linearGradient id="gradGoldVertical" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#fcd34d" />
                  <stop offset="100%" stopColor="#b45309" />
                </linearGradient>
                <linearGradient id="gradPole" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#92400e" />
                  <stop offset="100%" stopColor="#78350f" />
                </linearGradient>
                <filter id="shadow"><feDropShadow dx="2" dy="3" stdDeviation="3" floodOpacity="0.4"/></filter>
                <filter id="shadowStrong"><feDropShadow dx="3" dy="4" stdDeviation="4" floodOpacity="0.5"/></filter>
            </defs>
            
            {/* Base with 3D effect */}
            <path d="M 120 230 L 220 230 Q 230 230 225 220 L 180 140 L 160 140 L 115 220 Q 110 230 120 230" 
                  fill="url(#gradGoldVertical)" 
                  filter="url(#shadowStrong)" 
                  stroke="#b45309" 
                  strokeWidth="2" />
            {/* Base shadow */}
            <ellipse cx="170" cy="230" rx="55" ry="8" fill="black" opacity="0.3" />
            
            {/* Support post */}
            <rect x="165" y="60" width="10" height="100" 
                  fill="url(#gradPole)" 
                  filter="url(#shadow)"
                  rx="2" />
            <rect x="163" y="58" width="14" height="4" 
                  fill="#92400e" 
                  rx="2" />
            
            <g style={{ transform: `rotate(${tilt}deg)`, transformOrigin: '170px 60px', transition: 'transform 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
                {/* Scale with 3D effect */}
                <rect x="50" y="55" width="240" height="10" rx="5" 
                      fill="url(#gradGold)" 
                      filter="url(#shadowStrong)" 
                      stroke="#b45309" 
                      strokeWidth="1.5" />
                {/* Scale top glow */}
                <rect x="50" y="55" width="240" height="4" rx="5" fill="#fcd34d" opacity="0.6" />
                
                {/* Center point */}
                <circle cx="170" cy="60" r="8" fill="url(#gradGoldVertical)" filter="url(#shadowStrong)" stroke="#b45309" strokeWidth="2" />
                <circle cx="170" cy="60" r="5" fill="#fbbf24" opacity="0.8" />
                <g transform="translate(60, 60)">
                    <g style={{ transform: `rotate(${-tilt}deg)`, transformOrigin: '0px 0px', transition: 'transform 1.2s' }}>
                        {/* Ropes with 3D effect */}
                        <line x1="0" y1="0" x2="-25" y2="90" stroke="#64748b" strokeWidth="3" strokeLinecap="round" />
                        <line x1="0" y1="0" x2="25" y2="90" stroke="#64748b" strokeWidth="3" strokeLinecap="round" />
                        <line x1="0" y1="0" x2="-25" y2="90" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
                        <line x1="0" y1="0" x2="25" y2="90" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
                        
                        {/* Bowl - blue */}
                        <defs>
                          <linearGradient id="bowlBlue" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#eff6ff" />
                            <stop offset="50%" stopColor="#bfdbfe" />
                            <stop offset="100%" stopColor="#93c5fd" />
                          </linearGradient>
                        </defs>
                        <path d="M -45 90 Q 0 125 45 90 Z" fill="url(#bowlBlue)" stroke="#2563eb" strokeWidth="2.5" filter="url(#shadow)" />
                        <path d="M -45 90 Q 0 120 45 90" fill="none" stroke="#93c5fd" strokeWidth="1.5" opacity="0.6" />
                        
                        <SvgWeight x={-15} y={110} num={problem.display.left[0] ?? 0} color="blue" />
                        <SvgWeight x={15} y={110} num={problem.display.left[1] ?? 0} color="blue" />
                    </g>
                </g>
                <g transform="translate(280, 60)">
                    <g style={{ transform: `rotate(${-tilt}deg)`, transformOrigin: '0px 0px', transition: 'transform 1.2s' }}>
                        {/* Ropes with 3D effect */}
                        <line x1="0" y1="0" x2="-25" y2="90" stroke="#64748b" strokeWidth="3" strokeLinecap="round" />
                        <line x1="0" y1="0" x2="25" y2="90" stroke="#64748b" strokeWidth="3" strokeLinecap="round" />
                        <line x1="0" y1="0" x2="-25" y2="90" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
                        <line x1="0" y1="0" x2="25" y2="90" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
                        
                        {/* Bowl - red */}
                        <defs>
                          <linearGradient id="bowlRed" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#fff1f2" />
                            <stop offset="50%" stopColor="#fecaca" />
                            <stop offset="100%" stopColor="#fda4af" />
                          </linearGradient>
                        </defs>
                        <path d="M -45 90 Q 0 125 45 90 Z" fill="url(#bowlRed)" stroke="#dc2626" strokeWidth="2.5" filter="url(#shadow)" />
                        <path d="M -45 90 Q 0 120 45 90" fill="none" stroke="#fda4af" strokeWidth="1.5" opacity="0.6" />
                        
                        <SvgWeight x={-15} y={110} num={problem.display.right[0] ?? 0} color="red" />
                        <SvgWeight x={15} y={110} label="?" color="neutral" dashed />
                    </g>
                </g>
            </g>
        </svg>
      </div>
      <div className="grid grid-cols-3 gap-2 sm:gap-4 w-full max-w-sm mt-2">
        {problem.options.map((opt, idx) => {
          const isDisabled = disabled.includes(opt);
          return (
            <button 
              key={idx}
              disabled={isDisabled}
              onClick={() => handleChoice(opt)}
              className={`h-16 sm:h-20 flex items-center justify-center transition-all ${isDisabled ? 'opacity-30 grayscale cursor-not-allowed scale-90' : 'hover:scale-110 active:scale-95'}`}
            >
               <div className={`relative w-12 h-12 sm:w-16 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-xl border-3 sm:border-4 transition-all ${
                 isDisabled 
                   ? 'bg-slate-400 border-slate-500 text-slate-200' 
                   : 'bg-gradient-to-br from-orange-400 to-orange-600 border-orange-700 text-white hover:from-orange-500 hover:to-orange-700 hover:shadow-2xl'
               }`}>
                   {/* 3D effect - top part */}
                   <div className={`absolute top-0 left-0 right-0 h-1/3 rounded-t-xl sm:rounded-t-2xl ${
                     isDisabled ? 'bg-slate-300' : 'bg-orange-300'
                   } opacity-60`}></div>
                   
                   {/* Ring on top */}
                   <div className={`absolute -top-2 sm:-top-3 left-1/2 -translate-x-1/2 w-4 h-3 sm:w-6 sm:h-4 rounded-t-full border-3 sm:border-4 ${
                     isDisabled ? 'border-slate-500 bg-slate-400' : 'border-orange-700 bg-gradient-to-b from-orange-300 to-orange-500'
                   }`}></div>
                   
                   {/* Number - larger and clearer */}
                   <span className="font-black text-lg sm:text-2xl relative z-10 drop-shadow-md">{opt}</span>
                   
                   {/* Glow effect */}
                   {!isDisabled && (
                     <div className="absolute top-2 left-2 w-3 h-3 bg-white rounded-full opacity-40"></div>
                   )}
               </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
