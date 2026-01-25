import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { ArrowRight, ArrowUp, ArrowDown, ArrowLeft, RotateCcw, Play } from 'lucide-react';
import { playSound } from '../engine/audio';
import { useTranslation } from '../i18n/useTranslation';
import { useProfileText } from '../hooks/useProfileText';
import { GameConfig } from '../types/game';
import type { 
  BalanceScaleProblem, 
  WordBuilderProblem, 
  SyllableBuilderProblem,
  PatternProblem,
  SentenceLogicProblem,
  MemoryMathProblem,
  RoboPathProblem,
  TimeMatchProblem,
  LetterMatchProblem,
  UnitConversionProblem,
  LetterObject
} from '../types/game';

interface LevelUpModalProps {
  level: number;
  onNext: () => void;
  gameConfig: GameConfig;
}

export const LevelUpModal: React.FC<LevelUpModalProps> = ({ level, onNext, gameConfig }) => {
  const t = useTranslation();
  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-300"
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        margin: 0,
        padding: '1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div 
        className="bg-gradient-to-br from-white to-slate-50 rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center transform scale-100 animate-bounce-short border-4 border-yellow-400"
        style={{ margin: '0 auto' }}
      >
        <div className="mx-auto w-24 h-24 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full flex items-center justify-center mb-4 text-6xl shadow-inner animate-star-collect">
          🏆
        </div>
        <h2 className="text-3xl font-black text-slate-800 mb-2 bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
          {t.levelUp.level} {level}!
        </h2>
        <p className="text-slate-600 mb-8 font-bold">{t.levelUp.greatWork}</p>
        
        <button 
          onClick={onNext}
          className={`w-full py-4 rounded-xl text-xl font-black text-white shadow-lg active:scale-95 transition-all hover:scale-105 flex items-center justify-center gap-2 ${gameConfig.theme.accent} hover:brightness-110`}
        >
          {t.levelUp.nextLevel} <ArrowRight />
        </button>
      </div>
    </div>
  );
};

// Move SvgWeight outside the component to avoid creating it during render
interface SvgWeightProps {
  x: number;
  y: number;
  num: number;
  color: 'blue' | 'red';
}

const SvgWeight: React.FC<SvgWeightProps> = ({ x, y, num, color }) => {
  const isBlue: boolean = color === 'blue';
  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* 3D efekt - ülemine osa */}
      <defs>
        <linearGradient id={`weightGradTop-${color}-${num}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={isBlue ? '#60a5fa' : '#f87171'} stopOpacity="1" />
          <stop offset="100%" stopColor={isBlue ? '#3b82f6' : '#ef4444'} stopOpacity="1" />
        </linearGradient>
        <linearGradient id={`weightGradSide-${color}-${num}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={isBlue ? '#3b82f6' : '#ef4444'} stopOpacity="1" />
          <stop offset="100%" stopColor={isBlue ? '#1e40af' : '#dc2626'} stopOpacity="1" />
        </linearGradient>
        <filter id={`weightShadow-${color}-${num}`}>
          <feDropShadow dx="2" dy="3" stdDeviation="3" floodOpacity="0.4"/>
        </filter>
      </defs>
      
      {/* Varjutus alt */}
      <ellipse cx="0" cy="8" rx="16" ry="4" fill="black" opacity="0.2" filter={`url(#weightShadow-${color}-${num})`} />
      
      {/* 3D kaal - esikülg */}
      <rect x="-16" y="-22" width="32" height="32" rx="5" ry="5" 
            fill={`url(#weightGradTop-${color}-${num})`} 
            stroke={isBlue ? '#1e40af' : '#991b1b'} 
            strokeWidth="2.5"
            filter={`url(#weightShadow-${color}-${num})`} />
      
      {/* 3D efekt - parem külg (sügavus) */}
      <path d="M 16 -22 L 20 -18 L 20 10 L 16 10 Z" 
            fill={`url(#weightGradSide-${color}-${num})`} 
            opacity="0.7" />
      
      {/* Ülemine kumerus (3D efekt) */}
      <ellipse cx="0" cy="-22" rx="16" ry="6" fill={isBlue ? '#93c5fd' : '#fca5a5'} opacity="0.6" />
      
      {/* Numbri taust (parem loetavus) */}
      <circle cx="0" cy="-5" r="10" fill="white" opacity="0.3" />
      
      {/* Number - suurem ja selgem, alati nähtav */}
      <text x="0" y="2" textAnchor="middle" fill="white" 
            fontSize="20" fontWeight="900" fontFamily="Arial, sans-serif"
            stroke={isBlue ? '#1e3a8a' : '#991b1b'} strokeWidth="1"
            style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}
            dominantBaseline="middle">
        {num}
      </text>
      
      {/* Hiilgus efekt */}
      <ellipse cx="-8" cy="-18" rx="4" ry="3" fill="white" opacity="0.4" />
    </g>
  );
};

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
        setTimeout(() => setTilt(newTilt > 0 ? 15 : -15), 300); 
        onAnswer(leftSum === totalRight);
      }
    }, 1000);
  };

  return (
    <div className="w-full flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500 px-2">
      <div className="relative w-full max-w-sm h-56 sm:h-64 mb-3 sm:mb-4 flex justify-center overflow-hidden">
        <svg width="100%" height="100%" viewBox="0 0 340 240" preserveAspectRatio="xMidYMid meet" className="overflow-visible" style={{ minHeight: '240px' }}>
            <defs>
                {/* Täiustatud kuldne gradient kaalule */}
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
            
            {/* Täiustatud alus - 3D efekt */}
            <path d="M 120 230 L 220 230 Q 230 230 225 220 L 180 140 L 160 140 L 115 220 Q 110 230 120 230" 
                  fill="url(#gradGoldVertical)" 
                  filter="url(#shadowStrong)" 
                  stroke="#b45309" 
                  strokeWidth="2" />
            {/* Aluse varjutus */}
            <ellipse cx="170" cy="230" rx="55" ry="8" fill="black" opacity="0.3" />
            
            {/* Täiustatud tugipost */}
            <rect x="165" y="60" width="10" height="100" 
                  fill="url(#gradPole)" 
                  filter="url(#shadow)"
                  rx="2" />
            <rect x="163" y="58" width="14" height="4" 
                  fill="#92400e" 
                  rx="2" />
            
            <g style={{ transform: `rotate(${tilt}deg)`, transformOrigin: '170px 60px', transition: 'transform 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
                {/* Täiustatud kaal - 3D efekt */}
                <rect x="50" y="55" width="240" height="10" rx="5" 
                      fill="url(#gradGold)" 
                      filter="url(#shadowStrong)" 
                      stroke="#b45309" 
                      strokeWidth="1.5" />
                {/* Kaalu ülemine hiilgus */}
                <rect x="50" y="55" width="240" height="4" rx="5" fill="#fcd34d" opacity="0.6" />
                
                {/* Täiustatud keskpunkt */}
                <circle cx="170" cy="60" r="8" fill="url(#gradGoldVertical)" filter="url(#shadowStrong)" stroke="#b45309" strokeWidth="2" />
                <circle cx="170" cy="60" r="5" fill="#fbbf24" opacity="0.8" />
                <g transform="translate(60, 60)">
                    <g style={{ transform: `rotate(${-tilt}deg)`, transformOrigin: '0px 0px', transition: 'transform 1.2s' }}>
                        {/* Täiustatud köied - 3D efekt */}
                        <line x1="0" y1="0" x2="-25" y2="90" stroke="#64748b" strokeWidth="3" strokeLinecap="round" />
                        <line x1="0" y1="0" x2="25" y2="90" stroke="#64748b" strokeWidth="3" strokeLinecap="round" />
                        <line x1="0" y1="0" x2="-25" y2="90" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
                        <line x1="0" y1="0" x2="25" y2="90" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
                        
                        {/* Täiustatud nõu - sinine */}
                        <defs>
                          <linearGradient id="bowlBlue" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#dbeafe" />
                            <stop offset="50%" stopColor="#bfdbfe" />
                            <stop offset="100%" stopColor="#93c5fd" />
                          </linearGradient>
                        </defs>
                        <path d="M -45 90 Q 0 125 45 90 Z" fill="url(#bowlBlue)" stroke="#3b82f6" strokeWidth="3.5" filter="url(#shadow)" />
                        <path d="M -45 90 Q 0 120 45 90" fill="none" stroke="#60a5fa" strokeWidth="1.5" opacity="0.6" />
                        
                        <SvgWeight x={-15} y={110} num={problem.display.left[0] ?? 0} color="blue" />
                        <SvgWeight x={15} y={110} num={problem.display.left[1] ?? 0} color="blue" />
                    </g>
                </g>
                <g transform="translate(280, 60)">
                    <g style={{ transform: `rotate(${-tilt}deg)`, transformOrigin: '0px 0px', transition: 'transform 1.2s' }}>
                        {/* Täiustatud köied - 3D efekt */}
                        <line x1="0" y1="0" x2="-25" y2="90" stroke="#64748b" strokeWidth="3" strokeLinecap="round" />
                        <line x1="0" y1="0" x2="25" y2="90" stroke="#64748b" strokeWidth="3" strokeLinecap="round" />
                        <line x1="0" y1="0" x2="-25" y2="90" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
                        <line x1="0" y1="0" x2="25" y2="90" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
                        
                        {/* Täiustatud nõu - punane */}
                        <defs>
                          <linearGradient id="bowlRed" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#fee2e2" />
                            <stop offset="50%" stopColor="#fecaca" />
                            <stop offset="100%" stopColor="#fca5a5" />
                          </linearGradient>
                        </defs>
                        <path d="M -45 90 Q 0 125 45 90 Z" fill="url(#bowlRed)" stroke="#ef4444" strokeWidth="3.5" filter="url(#shadow)" />
                        <path d="M -45 90 Q 0 120 45 90" fill="none" stroke="#f87171" strokeWidth="1.5" opacity="0.6" />
                        
                        <SvgWeight x={-15} y={110} num={problem.display.right[0] ?? 0} color="red" />
                        
                        {/* Täiustatud küsimärgi kaal */}
                        <g transform="translate(15, 110)">
                          <defs>
                            <linearGradient id="weightGradTop-question" x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" stopColor="#f3f4f6" />
                              <stop offset="100%" stopColor="#e5e7eb" />
                            </linearGradient>
                          </defs>
                          {/* Varjutus */}
                          <ellipse cx="0" cy="8" rx="16" ry="4" fill="black" opacity="0.2" />
                          {/* 3D kaal */}
                          <rect x="-16" y="-22" width="32" height="32" rx="5" ry="5" 
                                fill="url(#weightGradTop-question)" 
                                stroke="#ef4444" 
                                strokeWidth="2.5"
                                strokeDasharray="5 3"
                                filter="url(#shadow)" />
                          {/* 3D efekt - parem külg */}
                          <path d="M 16 -22 L 20 -18 L 20 10 L 16 10 Z" fill="#d1d5db" opacity="0.7" />
                          {/* Hiilgus */}
                          <ellipse cx="-8" cy="-18" rx="4" ry="3" fill="white" opacity="0.5" />
                          {/* Küsimärk - suurem ja selgem */}
                          <text x="0" y="2" textAnchor="middle" fill="#ef4444" 
                                fontSize="22" fontWeight="900" fontFamily="Arial, sans-serif"
                                stroke="#dc2626" strokeWidth="1"
                                style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}
                                dominantBaseline="middle">?</text>
                        </g>
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
                   {/* 3D efekt - ülemine osa */}
                   <div className={`absolute top-0 left-0 right-0 h-1/3 rounded-t-xl sm:rounded-t-2xl ${
                     isDisabled ? 'bg-slate-300' : 'bg-orange-300'
                   } opacity-60`}></div>
                   
                   {/* Rõngas üleval */}
                   <div className={`absolute -top-2 sm:-top-3 left-1/2 -translate-x-1/2 w-4 h-3 sm:w-6 sm:h-4 rounded-t-full border-3 sm:border-4 ${
                     isDisabled ? 'border-slate-500 bg-slate-400' : 'border-orange-700 bg-gradient-to-b from-orange-300 to-orange-500'
                   }`}></div>
                   
                   {/* Number - suurem ja selgem */}
                   <span className="font-black text-lg sm:text-2xl relative z-10 drop-shadow-md">{opt}</span>
                   
                   {/* Hiilgus efekt */}
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

interface StandardGameViewProps {
  problem: SentenceLogicProblem | LetterMatchProblem;
  onAnswer: (answer: boolean) => void;
  soundEnabled: boolean;
}

export const StandardGameView: React.FC<StandardGameViewProps> = ({ problem, onAnswer, soundEnabled }) => {
  const t = useTranslation();
  const { formatText } = useProfileText();
  const [disabled, setDisabled] = useState<string[]>([]);
  const [hasAnswered, setHasAnswered] = useState(false);
  const problemUid: string = problem.uid;
  
  useEffect(() => { 
    const timer = setTimeout(() => {
      setDisabled([]);
      setHasAnswered(false);
    }, 0);
    return () => clearTimeout(timer);
  }, [problemUid]);


  const handleChoice = (opt: string | { text: string; pos?: string; answer?: boolean; id?: string }): void => {
    // Prevent multiple clicks
    if (hasAnswered) return;
    
    playSound('click', soundEnabled);
    setHasAnswered(true);
    
    const isCorrect = problem.type === 'sentence_logic' 
      ? (typeof opt === 'object' && 'text' in opt ? opt.text === problem.answer : false)
      : opt === problem.answer;
    
    if (isCorrect) {
      onAnswer(true); 
    } else { 
      const optId = typeof opt === 'object' && 'text' in opt ? opt.text : opt;
      setDisabled([...disabled, optId]); 
      onAnswer(false); 
    }
  };

  const renderOptionContent = (opt: string | { text: string; pos?: string; answer?: boolean; a?: { n?: string; e?: string }; s?: { n?: string; e?: string }; sceneName?: string; [key: string]: unknown }, optIdx: number): React.ReactNode => {
    if (problem.type === 'sentence_logic' && typeof opt === 'object' && opt !== null) {
      const sceneBg = (opt.bg as string | undefined) || 'bg-gray-100';
      const position = String(opt.pos || '').trim();
      const subjectEmoji = opt.s?.e || '❓';
      const anchorEmoji = opt.a?.e || '📦';
      
      // Container for the visual scene
      const containerClasses = `relative w-full h-48 sm:h-64 ${sceneBg} rounded-lg sm:rounded-xl overflow-hidden group transition-all duration-300 shadow-inner border-2 border-white/30 hover:shadow-lg hover:scale-[1.02]`;
      
      // NEXT_TO: Side-by-side layout using flexbox
      // Use same size as other positions
      if (position === 'NEXT_TO') {
        const isSubjectLeft = (optIdx % 2) === 0; // Alternate left/right per option
        const baseSize = 'text-6xl sm:text-8xl'; // Same size as other positions
        return (
          <div className={containerClasses}>
            <div className="absolute inset-0 bg-gradient-to-b from-white/15 to-black/8 rounded-lg sm:rounded-xl"></div>
            <div className="relative w-full h-full flex items-center justify-center gap-2 sm:gap-4 px-2 sm:px-4">
              <div className={`${baseSize} filter drop-shadow-2xl animate-pulse-slow flex-shrink-0 ${isSubjectLeft ? 'order-2' : 'order-1'}`}>
                {anchorEmoji}
              </div>
              <div className={`${baseSize} filter drop-shadow-2xl animate-bounce-subtle flex-shrink-0 ${isSubjectLeft ? 'order-1' : 'order-2'}`}>
                {subjectEmoji}
              </div>
            </div>
          </div>
        );
      }
      
      // Use CSS Grid for precise positioning - much more reliable than absolute positioning
      // Create a 5x5 grid where anchor is always in center (3,3) and subject moves relative to it
      const getGridPosition = (pos: string) => {
        const baseSize = 'text-6xl sm:text-8xl';
        
        // Anchor is ALWAYS at grid position (3, 3) - center of 5x5 grid
        const anchorGridArea = '3 / 3 / 4 / 4';
        
        switch (pos) {
          case 'ON':
            // Subject above anchor
            return {
              subjectGridArea: '2 / 3 / 3 / 4', // Row 2, Column 3 (above center)
              anchorGridArea,
              subjectZIndex: 'z-30',
              anchorZIndex: 'z-10',
              sizes: { subject: baseSize, anchor: baseSize }
            };
          
          case 'UNDER':
            // Subject below anchor
            return {
              subjectGridArea: '4 / 3 / 5 / 4', // Row 4, Column 3 (below center)
              anchorGridArea,
              subjectZIndex: 'z-10',
              anchorZIndex: 'z-30', // Anchor on top
              sizes: { subject: baseSize, anchor: baseSize }
            };
          
          case 'IN_FRONT':
            // Subject IN FRONT of anchor - subject overlaps anchor from left
            // Anchor is behind (larger, semi-transparent), subject is in front (normal size)
            return {
              subjectGridArea: '3 / 2 / 4 / 4', // Row 3, spans columns 2-3 (left, overlaps center)
              anchorGridArea,
              subjectZIndex: 'z-40',
              anchorZIndex: 'z-10',
              anchorOpacity: 0.4, // Anchor behind is semi-transparent
              anchorScale: 'scale(1.2)', // Anchor behind is larger
              sizes: { subject: baseSize, anchor: baseSize }
            };
          
          case 'BEHIND':
            // Subject BEHIND anchor - same position, anchor covers subject
            // Subject is behind (larger, semi-transparent), anchor is in front (normal size)
            return {
              subjectGridArea: '3 / 3 / 4 / 4', // Same position as anchor (center)
              anchorGridArea,
              subjectZIndex: 'z-10',
              anchorZIndex: 'z-30', // Anchor on top
              subjectOpacity: 0.4, // Subject behind is semi-transparent
              subjectScale: 'scale(1.2)', // Subject behind is larger
              sizes: { subject: baseSize, anchor: baseSize }
            };
          
          case 'INSIDE':
            // Subject inside anchor (both centered, different sizes)
            return {
              subjectGridArea: '3 / 3 / 4 / 4', // Same as anchor
              anchorGridArea,
              subjectZIndex: 'z-30',
              anchorZIndex: 'z-10',
              subjectScale: 'scale(0.4)',
              anchorScale: 'scale(1.3)',
              sizes: { subject: baseSize, anchor: baseSize }
            };
          
          default:
            return {
              subjectGridArea: '3 / 3 / 4 / 4',
              anchorGridArea,
              subjectZIndex: 'z-20',
              anchorZIndex: 'z-10',
              sizes: { subject: baseSize, anchor: baseSize }
            };
        }
      };
      
      const gridPos = getGridPosition(position);
      
      return (
        <div className={containerClasses}>
          <div className="absolute inset-0 bg-gradient-to-b from-white/15 to-black/8 rounded-lg sm:rounded-xl"></div>
          
          {/* CSS Grid container - 5x5 grid for precise positioning */}
          <div 
            className="absolute inset-0 grid grid-cols-5 grid-rows-5"
            style={{ gridTemplateColumns: 'repeat(5, 1fr)', gridTemplateRows: 'repeat(5, 1fr)' }}
          >
            {/* Anchor - ALWAYS in center (3,3) */}
            <div
              className={`${gridPos.sizes.anchor} filter drop-shadow-2xl ${gridPos.anchorZIndex} animate-pulse-slow flex items-center justify-center`}
              style={{
                gridArea: gridPos.anchorGridArea,
                transform: (gridPos as { anchorScale?: string }).anchorScale || 'scale(1)',
                opacity: (gridPos as { anchorOpacity?: number }).anchorOpacity ?? 1,
                pointerEvents: 'none'
              }}
            >
              {anchorEmoji}
            </div>
            
            {/* Subject - position varies based on spatial relationship */}
            <div
              className={`${gridPos.sizes.subject} filter drop-shadow-2xl ${gridPos.subjectZIndex} animate-bounce-subtle flex items-center justify-center`}
              style={{
                gridArea: gridPos.subjectGridArea,
                transform: (gridPos as { subjectScale?: string }).subjectScale || 'scale(1)',
                opacity: (gridPos as { subjectOpacity?: number }).subjectOpacity ?? 1,
                pointerEvents: 'none'
              }}
            >
              {subjectEmoji}
            </div>
          </div>
        </div>
      );
    }
    
    // For non-sentence_logic types (like letter_match)
    const text = typeof opt === 'string' ? opt : String(opt.text ?? '');
    // Letter match: keep letters lowercase (don't format), other types format normally
    return problem.type === 'letter_match' ? text : formatText(text);
  };

  return (
    <div className="w-full mt-2 sm:mt-4 flex flex-col items-center animate-in fade-in zoom-in duration-300 px-2">
      <div className="mb-4 sm:mb-6 p-3 sm:p-6 bg-white rounded-2xl sm:rounded-3xl border-b-6 sm:border-b-8 border-green-200 shadow-sm text-center w-full">
         {problem.type === 'letter_match' ? (
            <div className="flex justify-center items-center gap-2 sm:gap-4 text-4xl sm:text-6xl font-black text-pink-500">
              {problem.display ?? ''} <ArrowRight size={32} className="sm:w-12 sm:h-12 text-slate-300"/> ?
            </div>
          ) : problem.type === 'sentence_logic' ? (
            <div>
              <div className="text-xs sm:text-sm font-bold text-slate-500 mb-1 sm:mb-2 uppercase tracking-wider">
                {formatText(problem.sceneName || t.gameScreen.sentenceLogic.scene)}
              </div>
              <h2 className="text-base sm:text-xl font-black text-green-700 leading-snug tracking-wide px-2">
                {formatText(problem.display ?? '')}
              </h2>
              <div className="text-[10px] sm:text-xs text-slate-400 mt-1 sm:mt-2">{formatText(t.gameScreen.sentenceLogic.selectCorrectPicture)}</div>
            </div>
          ) : null
         }
      </div>
      <div className={`grid ${problem.type === 'sentence_logic' 
        ? (problem.options.length === 4 ? 'grid-cols-2 gap-2 sm:gap-4' : problem.options.length === 5 ? 'grid-cols-3 gap-2 sm:gap-3' : 'grid-cols-2 gap-2 sm:gap-4')
        : 'grid-cols-3 gap-2 sm:gap-3'} w-full`}>
        {problem.options.map((opt, idx) => {
           const optId = typeof opt === 'object' && 'text' in opt ? opt.text : opt;
           const isDisabled = disabled.includes(optId);
           return (
            <button 
              key={idx}
              disabled={isDisabled}
              onClick={() => handleChoice(opt)}
              className={`
                rounded-xl sm:rounded-2xl border-b-4 sm:border-b-[6px] text-2xl sm:text-3xl font-bold flex items-center justify-center transition-all p-1 shadow-sm
                ${problem.type === 'sentence_logic' 
                  ? `col-span-1 h-48 sm:h-64 bg-white border-slate-200 ${problem.options.length === 5 ? 'col-span-1' : ''}` 
                  : problem.type === 'letter_match' && problem.options.length === 4 
                    ? 'col-span-1 h-20 sm:h-24 bg-white border-pink-200 text-slate-700' 
                    : 'h-20 sm:h-24 bg-white border-pink-200 text-slate-700'}
                ${isDisabled ? 'bg-slate-100 border-slate-100 opacity-40 cursor-not-allowed scale-95' : 'hover:border-green-400 hover:-translate-y-1 hover:shadow-xl hover:scale-[1.02] active:scale-95 active:border-b-0 active:translate-y-1 transition-all duration-200'}
              `}
            >
              {renderOptionContent(opt, idx)}
            </button>
           );
        })}
      </div>
    </div>
  );
};

interface WordGameViewProps {
  problem: WordBuilderProblem;
  onAnswer: (answer: boolean) => void;
  soundEnabled: boolean;
}

export const WordGameView: React.FC<WordGameViewProps> = ({ problem, onAnswer, soundEnabled }) => {
  const [userWord, setUserWord] = useState<Array<{ char: string; id: string }>>([]);
  const [pool, setPool] = useState<Array<{ char: string; id: string }>>(problem.shuffled || []);
  const problemUid: string = problem.uid;
  
  useEffect(() => { 
    const timer = setTimeout(() => {
      setUserWord([]); 
      setPool(problem.shuffled || []); 
    }, 0);
    return () => clearTimeout(timer);
  }, [problemUid, problem.shuffled]);
  
  const handleSelect = (letter: LetterObject): void => {
    playSound('click', soundEnabled);
    const newWord = [...userWord, letter]; 
    setUserWord(newWord); 
    setPool(pool.filter(l => l.id !== letter.id));
    
    if (newWord.length === problem.target.length) {
      if (newWord.map(l => l.char).join('') === problem.target) {
        onAnswer(true);
      } else {
        setTimeout(() => { 
          onAnswer(false); 
          setUserWord([]); 
          setPool(problem.shuffled || []); 
        }, 500);
      }
    }
  };

  const handleRemove = (letter: LetterObject, idx: number): void => {
    playSound('click', soundEnabled);
    const newUserWord = [...userWord]; 
    newUserWord.splice(idx, 1); 
    setUserWord(newUserWord); 
    setPool(prev => [...prev, letter]);
  };

  return (
    <div className="flex flex-col items-center mt-2 sm:mt-4 w-full animate-in fade-in slide-in-from-right-4 duration-500 px-2">
      <div className="text-6xl sm:text-9xl mb-4 sm:mb-8 animate-bounce filter drop-shadow-xl">{problem.emoji}</div>
      <div className="flex gap-1.5 sm:gap-2 mb-4 sm:mb-8 min-h-[3.5rem] sm:min-h-[4.5rem] flex-wrap justify-center">
        {Array.from({ length: problem.target.length }).map((_, i) => (
          <button 
            key={i} 
            onClick={() => userWord[i] && handleRemove(userWord[i], i)} 
            className={`w-12 h-14 sm:w-14 sm:h-16 rounded-xl sm:rounded-2xl border-b-3 sm:border-b-4 flex items-center justify-center text-2xl sm:text-3xl font-black transition-all ${userWord[i] ? 'bg-orange-100 border-orange-400 text-orange-600 scale-100' : 'bg-slate-100 border-slate-200 scale-95'}`}
          >
            {userWord[i] ? userWord[i].char : ''}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
        {pool.map(l => (
          <button 
            key={l.id} 
            onClick={() => handleSelect(l)} 
            className="w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-xl sm:rounded-2xl border-b-[4px] sm:border-b-[6px] border-slate-200 text-2xl sm:text-3xl font-black text-slate-700 shadow-sm active:translate-y-2 active:border-b-0 hover:bg-orange-50 transition-colors"
          >
            {l.char}
          </button>
        ))}
      </div>
    </div>
  );
};

interface SyllableGameViewProps {
  problem: SyllableBuilderProblem;
  onAnswer: (answer: boolean) => void;
  soundEnabled: boolean;
}

export const SyllableGameView: React.FC<SyllableGameViewProps> = ({ problem, onAnswer, soundEnabled }) => {
  const t = useTranslation();
  const { formatText } = useProfileText();
  interface SyllablePart {
    part: { text: string; id: string };
    id: string;
  }
  
  const poolFromProblem = useCallback((): SyllablePart[] => {
    return problem.shuffled.map((p, i) => ({ part: p, id: `${p.text}-${i}` }));
  }, [problem.shuffled]);
  
  const [current, setCurrent] = useState<Array<{ text: string; id: string } | null>>([]);
  const [pool, setPool] = useState<SyllablePart[]>(() => poolFromProblem());
  const [ghost, setGhost] = useState<boolean>(false);
  const colors: string[] = ['bg-orange-100 text-orange-700 border-orange-300', 'bg-teal-100 text-teal-700 border-teal-300', 'bg-blue-100 text-blue-700 border-blue-300', 'bg-pink-100 text-pink-700 border-pink-300'];

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrent([]);
      setPool(poolFromProblem());
      setGhost(false);
    }, 0);
    return () => clearTimeout(timer);
  }, [poolFromProblem]);

  const handleSelect = (item: SyllablePart): void => {
    playSound('click', soundEnabled);
    const next = [...current, item.part];
    setCurrent(next);
    setPool(pool.filter(p => p.id !== item.id));
    if (next.length === problem.syllables.length) {
      const word = next.map(p => p?.text ?? '').join('');
      if (word === problem.target) {
        onAnswer(true);
      } else {
        setGhost(true);
        setTimeout(() => { 
          onAnswer(false); 
          setCurrent([]); 
          setPool(poolFromProblem());
          setGhost(false);
        }, 700);
      }
    }
  };

  const handleRemove = (idx: number): void => {
    playSound('click', soundEnabled);
    const item = current[idx];
    const next = [...current];
    next.splice(idx,1);
    setCurrent(next);
    if (item) {
      setPool(prev => [...prev, { part: item, id: `${item.text}-${Date.now()}` }]);
    }
  };

  return (
    <div className="flex flex-col items-center mt-2 sm:mt-4 w-full animate-in fade-in slide-in-from-right-4 duration-500 px-2">
      <div className="text-3xl sm:text-4xl mb-1 sm:mb-2">{problem.emoji || problem.hint || '🧩'}</div>
      <div className="text-xs sm:text-sm font-semibold text-slate-600 mb-2 px-2 text-center">{formatText(t.gameScreen.syllableBuilder.instruction)}</div>
      {ghost && (
        <div className="mb-2 text-[10px] sm:text-xs font-semibold text-slate-400">
          {formatText(t.gameScreen.syllableBuilder.correct)} {problem.syllables.join('-')}
        </div>
      )}
      <div className="flex gap-1.5 sm:gap-2 mb-4 sm:mb-6 min-h-[3rem] sm:min-h-[3.5rem] flex-wrap justify-center">
        {Array.from({ length: problem.syllables.length }).map((_, i) => (
          <button 
            key={i} 
            onClick={() => current[i] && handleRemove(i)} 
            className={`px-2 sm:px-4 h-12 sm:h-14 rounded-xl sm:rounded-2xl border-b-3 sm:border-b-4 flex items-center justify-center text-lg sm:text-2xl font-black transition-all ${current[i] ? colors[i % colors.length] : 'bg-slate-100 border-slate-200 text-slate-300'}`}
          >
            {current[i]?.text || ''}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
        {pool.map((item, idx) => (
          <button 
            key={item.id} 
            onClick={() => handleSelect(item)} 
            className={`px-2 sm:px-4 h-12 sm:h-14 bg-white rounded-xl sm:rounded-2xl border-b-[4px] sm:border-b-[6px] text-lg sm:text-2xl font-black shadow-sm active:translate-y-2 active:border-b-0 hover:brightness-105 transition-colors ${colors[idx % colors.length]}`}
          >
            {item.part.text}
          </button>
        ))}
      </div>
    </div>
  );
};


interface PatternTrainViewProps {
  problem: PatternProblem;
  onAnswer: (answer: boolean) => void;
  soundEnabled: boolean;
}

export const PatternTrainView: React.FC<PatternTrainViewProps> = ({ problem, onAnswer, soundEnabled }) => {
  const [disabled, setDisabled] = useState<number[]>([]);
  const [trainState, setTrainState] = useState<string>('enter'); 
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const problemUid = problem.uid;
  
  useEffect(() => { 
    const timer = setTimeout(() => {
      setDisabled([]); 
      setTrainState('enter'); 
      setSelectedOption(null);
    }, 0);
    const t = setTimeout(() => setTrainState('idle'), 600); 
    return () => {
      clearTimeout(timer);
      clearTimeout(t);
    };
  }, [problemUid]);

  const handleChoice = (opt: string, idx: number): void => {
    if (disabled.includes(idx) || trainState === 'leave') return;
    
    playSound('click', soundEnabled);
    setSelectedOption(idx);
    
    // Check if answer is correct - compare with emojis
    const isCorrect = opt === problem.answer;
    
    if (isCorrect) { 
      setTrainState('leave'); 
      setTimeout(() => {
        onAnswer(true);
        setSelectedOption(null);
      }, 1000); 
    } else { 
      setDisabled([...disabled, idx]); 
      setTimeout(() => {
        onAnswer(false);
        setSelectedOption(null);
      }, 500);
    }
  };

  return (
    <div className="w-full flex flex-col items-center overflow-hidden px-2">
      {/* Täiustatud rong - värvikam ja atraktiivsem, mobiilile optimeeritud */}
      <div className="relative w-full h-36 sm:h-56 mb-4 sm:mb-6 flex items-center justify-center bg-gradient-to-b from-teal-50 via-cyan-50 to-blue-50 rounded-2xl sm:rounded-3xl border-3 sm:border-4 border-teal-300 overflow-x-auto overflow-y-hidden shadow-xl" style={{ minHeight: '144px' }}>
         {/* Taust efektid - väiksemad mobiilil */}
         <div className="absolute top-2 sm:top-4 left-4 sm:left-10 text-3xl sm:text-5xl opacity-30 animate-pulse">☁️</div>
         <div className="absolute top-4 sm:top-8 right-8 sm:right-20 text-2xl sm:text-4xl opacity-25 animate-pulse" style={{ animationDelay: '0.7s' }}>☁️</div>
         <div className="absolute bottom-1 sm:bottom-2 left-1/4 text-xl sm:text-3xl opacity-20 animate-pulse hidden sm:block" style={{ animationDelay: '1.4s' }}>☁️</div>
         
         {/* Raudtee */}
         <div className="absolute bottom-3 sm:bottom-6 w-full h-2 sm:h-4 bg-gradient-to-r from-slate-400 via-slate-500 to-slate-400 rounded-full border-1 sm:border-2 border-slate-600 shadow-inner">
           <div className="absolute top-0 left-0 w-full h-0.5 sm:h-1 bg-slate-300 border-t border-slate-400 border-dashed"></div>
         </div>
         
         {/* Rong - väiksem mobiilil, scrollitav */}
         <div className={`flex items-end gap-1 sm:gap-2 px-2 sm:px-4 transition-transform duration-1000 ease-in-out shrink-0 ${trainState === 'enter' ? '-translate-x-[150%]' : ''} ${trainState === 'idle' ? 'translate-x-0' : ''} ${trainState === 'leave' ? 'translate-x-[150%]' : ''}`} style={{ minWidth: 'max-content' }}>
            {/* Rongi mootor - täiustatud, väiksem mobiilil */}
            <div className="relative w-18 h-18 sm:w-28 sm:h-28 bg-gradient-to-br from-red-500 to-red-700 rounded-xl sm:rounded-2xl rounded-tr-[2rem] sm:rounded-tr-[4rem] border-2 sm:border-4 border-red-800 flex items-center justify-center shadow-2xl z-10 shrink-0" style={{ minWidth: '72px', minHeight: '72px' }}>
                <div className="absolute -top-5 sm:-top-10 left-2 sm:left-3 w-2.5 sm:w-5 h-5 sm:h-10 bg-slate-800 rounded-t-lg"></div>
                <div className="absolute -top-7 sm:-top-12 left-0.5 sm:left-1 w-5 sm:w-10 h-2.5 sm:h-5 bg-slate-600 rounded-full opacity-60 animate-ping"></div>
                <div className="text-3xl sm:text-6xl drop-shadow-lg filter brightness-110">🚂</div>
                <div className="absolute bottom-0 left-0 right-0 h-1.5 sm:h-2 bg-slate-800 rounded-b-lg"></div>
            </div>
            
            {/* Vagunid - täiustatud, väiksemad mobiilil */}
            {problem.sequence.map((item, i) => (
               <div key={i} className="relative w-12 h-16 sm:w-20 sm:h-24 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-lg sm:rounded-2xl border-2 sm:border-4 border-teal-600 flex items-center justify-center shadow-lg shrink-0 mx-0.5 sm:mx-1 group" style={{ minWidth: '48px', minHeight: '64px' }}>
                   <div className="text-2xl sm:text-5xl filter drop-shadow-lg transition-transform group-hover:scale-110">{item}</div>
                   <div className="absolute -bottom-1 sm:-bottom-2 w-full flex justify-between px-1.5 sm:px-3">
                       <div className="w-2 h-2 sm:w-4 sm:h-4 bg-slate-900 rounded-full shadow-md"></div>
                       <div className="w-2 h-2 sm:w-4 sm:h-4 bg-slate-900 rounded-full shadow-md"></div>
                   </div>
                   <div className="absolute top-0.5 sm:top-1 left-0.5 sm:left-1 right-0.5 sm:right-1 h-0.5 sm:h-1 bg-teal-300 rounded-full opacity-50"></div>
               </div>
            ))}
            
            {/* Küsimärgi vagun - täiustatud, väiksem mobiilil */}
            <div className="relative w-12 h-16 sm:w-20 sm:h-24 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-lg sm:rounded-2xl border-2 sm:border-4 border-yellow-600 border-dashed flex items-center justify-center animate-pulse shrink-0 mx-0.5 sm:mx-1 shadow-lg" style={{ minWidth: '48px', minHeight: '64px' }}>
                <div className="text-2xl sm:text-5xl font-black text-yellow-900 drop-shadow-md">?</div>
                <div className="absolute -bottom-1 sm:-bottom-2 w-full flex justify-between px-1.5 sm:px-3">
                    <div className="w-2 h-2 sm:w-4 sm:h-4 bg-slate-900 rounded-full shadow-md"></div>
                    <div className="w-2 h-2 sm:w-4 sm:h-4 bg-slate-900 rounded-full shadow-md"></div>
                </div>
            </div>
         </div>
      </div>
      
      {/* Täiustatud valikud - värvikamad, kompaktne mobiilil */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 w-full max-w-md">
        {problem.options.map((opt, idx) => {
          const isDisabled = disabled.includes(idx) || trainState === 'leave';
          const isSelected = selectedOption === idx;
          
          return (
            <button 
              key={idx} 
              disabled={isDisabled} 
              onClick={() => handleChoice(opt, idx)} 
              className={`
                h-16 sm:h-28 rounded-xl sm:rounded-3xl border-2 sm:border-4 text-3xl sm:text-6xl flex items-center justify-center 
                transition-all duration-300 shadow-lg
                ${isDisabled 
                  ? 'bg-slate-200 opacity-40 grayscale cursor-not-allowed border-slate-300' 
                  : isSelected
                  ? 'bg-gradient-to-br from-green-400 to-emerald-500 border-green-600 scale-105 sm:scale-110 shadow-2xl'
                  : 'bg-gradient-to-br from-white to-teal-50 border-teal-300 hover:border-teal-500 hover:bg-teal-100 hover:scale-105 active:scale-95 shadow-xl'
                }
              `}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
};

interface MemoryGameViewProps {
  problem: MemoryMathProblem;
  onAnswer: (answer: boolean) => void;
  soundEnabled: boolean;
}

export const MemoryGameView: React.FC<MemoryGameViewProps> = ({ problem, onAnswer, soundEnabled }) => {
  const [cards, setCards] = useState<Array<{ id: string; content: string; matched?: boolean; flipped?: boolean; solved?: boolean; matchId?: string; type?: string }>>(problem.cards || []);
  const [flipped, setFlipped] = useState<number[]>([]); 
  const [matchedPairs, setMatchedPairs] = useState<number>(0);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);
  const problemUid: string = problem.uid;
  
  useEffect(() => { 
    const timer = setTimeout(() => {
      setCards(problem.cards); 
      setFlipped([]); 
      setMatchedPairs(0);
      setShowCelebration(false);
    }, 0);
    return () => clearTimeout(timer);
  }, [problemUid, problem.cards]);
  
  const handleCard = (index: number): void => {
    if (flipped.length >= 2 || cards[index]?.flipped || cards[index]?.solved) return;
    playSound('click', soundEnabled);
    
    const newCards = [...cards]; 
    if (newCards[index]) {
      newCards[index] = { ...newCards[index], flipped: true };
    }
    setCards(newCards); 
    
    const newFlipped = [...flipped, index]; 
    setFlipped(newFlipped);
    
    if (newFlipped.length === 2) {
      const i1 = newFlipped[0];
      const i2 = newFlipped[1];
      if (i1 !== undefined && i2 !== undefined) {
        const card1 = newCards[i1];
        const card2 = newCards[i2];
        if (card1 && card2 && card1.matchId === card2.matchId) {
        playSound('correct', soundEnabled);
        setMatchedPairs(prev => prev + 1);
        setTimeout(() => {
          const solvedCards = [...newCards];
          if (solvedCards[i1] && solvedCards[i2]) {
            solvedCards[i1] = { ...solvedCards[i1], solved: true } as typeof solvedCards[0];
            solvedCards[i2] = { ...solvedCards[i2], solved: true } as typeof solvedCards[0];
          }
          setCards(solvedCards); 
          setFlipped([]);
          
          // Kontrolli, kas kõik paarid on leitud
          const allSolved = solvedCards.every(c => c.solved);
          if (allSolved) {
            setShowCelebration(true);
            setTimeout(() => {
              onAnswer(true);
              setShowCelebration(false);
            }, 1500);
          }
        }, 600);
      } else {
        setTimeout(() => { 
          const resetCards = [...newCards];
          if (resetCards[i1] && resetCards[i2]) {
            resetCards[i1] = { ...resetCards[i1], flipped: false } as typeof resetCards[0];
            resetCards[i2] = { ...resetCards[i2], flipped: false } as typeof resetCards[0];
          }
          setCards(resetCards); 
          setFlipped([]); 
        }, 1200);
      }
      }
    }
  };

  const totalPairs = cards.length / 2;
  const progress = (matchedPairs / totalPairs) * 100;

  return (
    <div className="w-full mt-2 sm:mt-4 flex flex-col items-center px-2">
      {/* Progress bar - kompaktne mobiilil */}
      {totalPairs > 0 && (
        <div className="w-full max-w-md mb-3 sm:mb-4">
          <div className="flex items-center justify-between mb-1 sm:mb-2">
            <span className="text-xs sm:text-sm font-bold text-purple-700">Paarid: {matchedPairs}/{totalPairs}</span>
            <span className="text-xs sm:text-sm font-bold text-purple-700">{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-3 sm:h-4 bg-purple-100 rounded-full overflow-hidden shadow-inner">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 transition-all duration-500 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
      
      {/* Täiustatud kaardid - värvikamad ja atraktiivsemad, kompaktne mobiilil */}
      <div className="w-full grid grid-cols-4 gap-2 sm:gap-3 md:gap-4 aspect-square max-w-md mx-auto relative">
        {showCelebration && (
          <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
            <div className="text-5xl sm:text-8xl animate-bounce">🎉</div>
          </div>
        )}
        
        {cards.map((card, i) => {
          const isFlipped = card.flipped || card.solved;
          const isMath = card.type === 'math';
          
          return (
            <button 
              key={i} 
              onClick={() => handleCard(i)} 
              disabled={card.solved}
              className={`
                relative rounded-xl sm:rounded-2xl flex items-center justify-center 
                text-sm sm:text-lg md:text-xl font-black transition-all duration-300 
                shadow-lg
                ${card.solved 
                  ? 'opacity-0 scale-0 pointer-events-none' 
                  : isFlipped
                  ? 'bg-gradient-to-br from-white to-purple-50 border-3 sm:border-4 border-purple-500 text-purple-800 scale-100 shadow-xl' 
                  : 'bg-gradient-to-br from-purple-500 to-purple-700 border-3 sm:border-4 border-purple-800 text-transparent scale-100 hover:from-purple-600 hover:to-purple-800 hover:scale-105 active:scale-95'
                }
              `}
            >
              {/* Kaardi tagakülg - täiustatud */}
              {!isFlipped && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-4xl opacity-80">🧠</div>
                </div>
              )}
              
              {/* Kaardi esikülg - täiustatud */}
              <div className={`${isFlipped ? 'block' : 'hidden'} transition-opacity duration-300`}>
                <div className={`
                  px-2 py-1 rounded-lg
                  ${isMath ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}
                `}>
                  {card.content}
                </div>
                {/* Väike ikoon tüübi jaoks */}
                <div className="absolute top-1 right-1 text-xs">
                  {isMath ? '➕' : '🎯'}
                </div>
              </div>
              
              {/* Match efekt */}
              {card.solved && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-3xl animate-ping">✨</div>
                </div>
              )}
            </button>
          );
        })}
      </div>
      
      <style>{`
        /* Eemaldatud pöörlemise animatsioonid - lihtsam ja rahulikum */
      `}</style>
    </div>
  );
};

interface RoboPathViewProps {
  problem: RoboPathProblem;
  onAnswer: (answer: boolean) => void;
  soundEnabled: boolean;
}

export const RoboPathView: React.FC<RoboPathViewProps> = ({ problem, onAnswer, soundEnabled }) => {
  const t = useTranslation();
  const { formatText } = useProfileText();
  const [commands, setCommands] = useState<string[]>([]);
  const [robotPos, setRobotPos] = useState<[number, number]>(problem.start);
  const [status, setStatus] = useState<string>('planning');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [moveCount, setMoveCount] = useState<number>(0);
  const [bestTime, setBestTime] = useState<number | null>(null);
  const [bestMoves, setBestMoves] = useState<number | null>(null);
  
  // Reset state when problem changes - intentional cascading updates
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => { 
      setCommands([]); 
      setRobotPos(problem.start); 
      setStatus('planning');
      const now = Date.now();
      setStartTime(now);
      setElapsedTime(0);
      setMoveCount(0);
      
      // Laadi parimad tulemused
      const storageKey = `robo_best_${problem.gridSize}_${problem.obstacles.length}`;
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          const best = JSON.parse(saved) as { time: number; moves: number };
          setBestTime(best.time);
          setBestMoves(best.moves);
        }
      } catch {
        // Ignore
      }
  }, [problem.uid, problem.gridSize, problem.obstacles.length, problem.start]);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Timer - näitab aega
  useEffect(() => {
    if (status !== 'planning' || !startTime) return;
    
    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 100);
    
    return () => clearInterval(interval);
  }, [status, startTime]);

  const addCommand = useCallback((cmd: string): void => { 
      const maxCommands = problem.maxCommands || 8;
      if (status !== 'planning' || commands.length >= maxCommands) return; 
      playSound('click', soundEnabled);
      setCommands(prev => {
        const newCommands = [...prev, cmd];
        setMoveCount(newCommands.length);
        return newCommands;
      }); 
  }, [status, commands.length, problem.maxCommands, soundEnabled]);
  
  const removeCommand = useCallback(() => { 
      if (status !== 'planning') return; 
      playSound('click', soundEnabled);
      setCommands(prev => {
        const newCommands = prev.slice(0, -1);
        setMoveCount(newCommands.length);
        return newCommands;
      }); 
  }, [status, soundEnabled]);
  
  const runSimulation = useCallback(async (): Promise<void> => {
    if (commands.length === 0) return;
    setStatus('moving');
    playSound('click', soundEnabled);
    
    const currentPos: [number, number] = [problem.start[0], problem.start[1]];
    for (let i = 0; i < commands.length; i++) {
        const cmd = commands[i]; 
        await new Promise(r => setTimeout(r, 600));
        
        if (cmd === 'UP') currentPos[1] = Math.max(0, currentPos[1] - 1);
        if (cmd === 'DOWN') currentPos[1] = Math.min(problem.gridSize - 1, currentPos[1] + 1);
        if (cmd === 'LEFT') currentPos[0] = Math.max(0, currentPos[0] - 1);
        if (cmd === 'RIGHT') currentPos[0] = Math.min(problem.gridSize - 1, currentPos[0] + 1);
        
        setRobotPos([currentPos[0], currentPos[1]]);
        
        if (problem.obstacles.some(o => o[0] === currentPos[0] && o[1] === currentPos[1])) { 
            setStatus('crash'); 
            playSound('wrong', soundEnabled);
            setTimeout(() => { 
                onAnswer(false); 
                setRobotPos(problem.start); 
                setCommands([]); 
                setStatus('planning'); 
            }, 1200); 
            return; 
        }
    }
    
    const goalPos = problem.end || problem.goal;
    if (currentPos[0] === goalPos[0] && currentPos[1] === goalPos[1]) { 
        const finalTime = Math.floor((Date.now() - (startTime || 0)) / 1000);
        const finalMoves = commands.length;
        setElapsedTime(finalTime);
        setStatus('win');
        
        // Salvesta parimad tulemused
        const storageKey = `robo_best_${problem.gridSize}_${problem.obstacles.length}`;
        try {
          const saved = localStorage.getItem(storageKey);
          if (saved) {
            const best = JSON.parse(saved) as { time: number; moves: number };
            if (!bestTime || finalTime < best.time) {
              setBestTime(finalTime);
              localStorage.setItem(storageKey, JSON.stringify({ time: finalTime, moves: finalMoves }));
            }
            if (!bestMoves || finalMoves < best.moves) {
              setBestMoves(finalMoves);
              localStorage.setItem(storageKey, JSON.stringify({ time: best.time || finalTime, moves: finalMoves }));
            }
          } else {
            setBestTime(finalTime);
            setBestMoves(finalMoves);
            localStorage.setItem(storageKey, JSON.stringify({ time: finalTime, moves: finalMoves }));
          }
        } catch {
          // Ignore storage errors
        }
        
        setTimeout(() => onAnswer(true), 1500); 
    } else { 
        setStatus('crash'); 
        playSound('wrong', soundEnabled);
        setTimeout(() => { 
            onAnswer(false); 
            setRobotPos(problem.start); 
            setCommands([]); 
            setStatus('planning'); 
        }, 1200); 
    }
  }, [commands, problem.start, problem.end, problem.goal, problem.gridSize, problem.obstacles, soundEnabled, startTime, bestTime, bestMoves, onAnswer]);

  // Klaviatuuri tugi - nooleklahvid ja WASD
  useEffect(() => {
    if (status !== 'planning') return;
    
    const handleKeyPress = (e: KeyboardEvent): void => {
      // Vältime, kui kasutaja kirjutab tekstiväljale
      if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'TEXTAREA') return;
      
      let command: string | null = null;
      
      // Nooleklahvid
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        command = 'UP';
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        command = 'DOWN';
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        command = 'LEFT';
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        command = 'RIGHT';
      }
      // WASD klahvid
      else if (e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        command = 'UP';
      } else if (e.key === 's' || e.key === 'S') {
        e.preventDefault();
        command = 'DOWN';
      } else if (e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        command = 'LEFT';
      } else if (e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        command = 'RIGHT';
      }
      // Backspace või Delete - eemalda viimane käsk
      else if ((e.key === 'Backspace' || e.key === 'Delete') && commands.length > 0) {
        e.preventDefault();
        removeCommand();
        return;
      }
      // Enter või Space - käivita robot
      else if ((e.key === 'Enter' || e.key === ' ') && commands.length > 0) {
        e.preventDefault();
        void runSimulation();
        return;
      }
      
      if (command && commands.length < (problem.maxCommands || 8)) {
        addCommand(command);
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [status, commands.length, problem.uid, problem.maxCommands, soundEnabled, addCommand, removeCommand, runSimulation]);

  const renderCell = (x: number, y: number): React.ReactNode => {
     const isRobot = robotPos[0] === x && robotPos[1] === y;
     const isEnd = (problem.end?.[0] ?? problem.goal?.[0]) === x && (problem.end?.[1] ?? problem.goal?.[1]) === y;
     const isRock = problem.obstacles.some(o => o[0] === x && o[1] === y);
     
     return (
        <div key={`${x}-${y}`} className={`relative w-full aspect-square bg-white border-2 border-indigo-50 rounded-lg flex items-center justify-center text-3xl shadow-sm overflow-hidden ${status === 'crash' && isRobot ? 'bg-red-100 animate-pulse' : ''}`}>
            {isEnd && <div className="absolute inset-0 bg-green-50 flex items-center justify-center animate-pulse border-4 border-green-200 rounded-lg">🔋</div>}
            {isRock && <div className="absolute inset-0 bg-slate-100 flex items-center justify-center">🪨</div>}
            {isRobot && <div className="absolute inset-0 flex items-center justify-center z-10 text-4xl transition-all duration-300 drop-shadow-lg">🤖</div>}
        </div>
     );
  };


  return (
    <div className="w-full flex flex-col items-center max-w-sm mx-auto">
       {/* Statistika paneel - aeg, käigud, parimad (kompaktne mobiilile) */}
       <div className="w-full mb-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-2 sm:p-4 border-2 border-indigo-200 shadow-lg">
         <div className="grid grid-cols-3 gap-2 sm:gap-3 text-center">
           <div className="bg-white rounded-lg sm:rounded-xl p-2 sm:p-3 shadow-sm border-2 border-indigo-100">
             <div className="text-[10px] sm:text-xs font-bold text-slate-500 mb-0.5 sm:mb-1">⏱️ AEG</div>
             <div className="text-lg sm:text-2xl font-black text-indigo-600">{elapsedTime}s</div>
             {bestTime && (
               <div className="text-[9px] sm:text-xs text-green-600 font-semibold mt-0.5 sm:mt-1 hidden sm:block">
                 Parim: {bestTime}s
               </div>
             )}
           </div>
           <div className="bg-white rounded-lg sm:rounded-xl p-2 sm:p-3 shadow-sm border-2 border-indigo-100">
             <div className="text-[10px] sm:text-xs font-bold text-slate-500 mb-0.5 sm:mb-1">🎯 KÄIGUD</div>
             <div className="text-lg sm:text-2xl font-black text-purple-600">{moveCount}</div>
             {bestMoves && (
               <div className="text-[9px] sm:text-xs text-green-600 font-semibold mt-0.5 sm:mt-1 hidden sm:block">
                 Parim: {bestMoves}
               </div>
             )}
           </div>
           <div className="bg-white rounded-lg sm:rounded-xl p-2 sm:p-3 shadow-sm border-2 border-indigo-100">
             <div className="text-[10px] sm:text-xs font-bold text-slate-500 mb-0.5 sm:mb-1">📊 LIMIIT</div>
             <div className="text-lg sm:text-2xl font-black text-teal-600">{problem.maxCommands || 8}</div>
             <div className="text-[9px] sm:text-xs text-slate-400 mt-0.5 sm:mt-1">
               {moveCount}/{problem.maxCommands || 8}
             </div>
           </div>
         </div>
       </div>
       
       {/* Klaviatuuri vihje - peidetud väikestel ekraanidel */}
       {status === 'planning' && (
         <div className="mb-2 sm:mb-3 text-[10px] sm:text-xs text-slate-600 text-center bg-blue-50 px-2 sm:px-3 py-1 sm:py-2 rounded-lg border border-blue-200 hidden sm:block">
           💡 Vihje: Kasuta nooleklahve (↑↓←→) või WASD klahve, et lisada käske!
         </div>
       )}
       
       {/* Win celebration - kompaktne */}
       {status === 'win' && (
         <div className="mb-2 sm:mb-3 text-center animate-bounce">
           <div className="text-3xl sm:text-4xl mb-1 sm:mb-2">🎉</div>
           <div className="text-xs sm:text-sm font-bold text-green-600">
             {elapsedTime}s | {commands.length} käiku
           </div>
         </div>
       )}
       
       {/* Grid - kompaktne väikestel ekraanidel */}
       <div className="grid gap-1 sm:gap-2 w-full mb-2 sm:mb-4 bg-indigo-50 p-2 sm:p-4 rounded-xl sm:rounded-2xl border-2 sm:border-4 border-indigo-100 shadow-inner" style={{ gridTemplateColumns: `repeat(${problem.gridSize}, 1fr)` }}>
          {Array.from({ length: problem.gridSize * problem.gridSize }).map((_, i) => renderCell(i % problem.gridSize, Math.floor(i / problem.gridSize)))}
       </div>
       
       {/* Käsud - kompaktne */}
       <div className="flex gap-1 h-10 sm:h-12 w-full bg-slate-100 rounded-lg sm:rounded-xl mb-2 sm:mb-4 items-center px-2 overflow-x-auto border-inner shadow-inner no-scrollbar">
           {commands.length === 0 && <span className="text-slate-400 text-xs sm:text-sm ml-2">{formatText(t.roboPath.addCommands)}</span>}
           {commands.map((c, i) => <div key={i} className="min-w-[1.5rem] sm:min-w-[2rem] h-7 sm:h-8 bg-white rounded flex items-center justify-center text-indigo-600 font-black shadow-sm text-base sm:text-lg animate-in fade-in zoom-in">{c === 'UP' ? '⬆' : c === 'DOWN' ? '⬇' : c === 'LEFT' ? '⬅' : '➡'}</div>)}
       </div>
       
       {/* Nupud - kompaktne väikestel ekraanidel */}
       <div className="grid grid-cols-3 gap-1.5 sm:gap-2 w-full">
           <div className="col-start-2"><button onClick={() => addCommand('UP')} aria-label={t.roboPath.addCommandUp} disabled={status !== 'planning'} className="w-full h-12 sm:h-14 bg-white border-b-3 sm:border-b-4 border-indigo-200 rounded-lg sm:rounded-xl flex items-center justify-center active:translate-y-1 hover:bg-indigo-50 transition-colors"><ArrowUp size={18} className="sm:w-5 sm:h-5" /></button></div>
           <div className="col-start-1 row-start-2"><button onClick={() => addCommand('LEFT')} aria-label={t.roboPath.addCommandLeft} disabled={status !== 'planning'} className="w-full h-12 sm:h-14 bg-white border-b-3 sm:border-b-4 border-indigo-200 rounded-lg sm:rounded-xl flex items-center justify-center active:translate-y-1 hover:bg-indigo-50 transition-colors"><ArrowLeft size={18} className="sm:w-5 sm:h-5" /></button></div>
           <div className="col-start-2 row-start-2"><button onClick={() => addCommand('DOWN')} aria-label={t.roboPath.addCommandDown} disabled={status !== 'planning'} className="w-full h-12 sm:h-14 bg-white border-b-3 sm:border-b-4 border-indigo-200 rounded-lg sm:rounded-xl flex items-center justify-center active:translate-y-1 hover:bg-indigo-50 transition-colors"><ArrowDown size={18} className="sm:w-5 sm:h-5" /></button></div>
           <div className="col-start-3 row-start-2"><button onClick={() => addCommand('RIGHT')} aria-label={t.roboPath.addCommandRight} disabled={status !== 'planning'} className="w-full h-12 sm:h-14 bg-white border-b-3 sm:border-b-4 border-indigo-200 rounded-lg sm:rounded-xl flex items-center justify-center active:translate-y-1 hover:bg-indigo-50 transition-colors"><ArrowRight size={18} className="sm:w-5 sm:h-5" /></button></div>
           
           <div className="col-start-1 row-start-3"><button onClick={removeCommand} aria-label={t.roboPath.removeCommand} disabled={status !== 'planning'} className="w-full h-12 sm:h-14 bg-red-100 border-b-3 sm:border-b-4 border-red-300 text-red-500 rounded-lg sm:rounded-xl flex items-center justify-center active:translate-y-1"><RotateCcw size={16} className="sm:w-5 sm:h-5" /></button></div>
           <div className="col-start-2 col-end-4 row-start-3"><button onClick={() => void runSimulation()} aria-label={t.roboPath.runRobot} disabled={status !== 'planning' || commands.length === 0} className="w-full h-12 sm:h-14 bg-green-500 border-b-3 sm:border-b-4 border-green-700 text-white font-black rounded-lg sm:rounded-xl flex items-center justify-center active:translate-y-1 shadow-lg gap-1 sm:gap-2 text-sm sm:text-lg hover:bg-green-600 transition-colors">START <Play size={16} fill="white" className="sm:w-5 sm:h-5" /></button></div>
        </div>
    </div>
  );
};

export const Confetti: React.FC = () => {
  // Generate stable random positions for confetti using index-based seed (memoized to prevent recalculation)
  const confettiItems = useMemo(() => Array.from({ length: 30 }).map((_, i) => {
    const seed = i * 12345;
    const left = ((seed * 9301 + 49297) % 233280) / 2332.8;
    const duration = 2 + ((seed * 48271) % 100) / 50;
    const delay = ((seed * 1103515245 + 12345) % 100) / 100;
    return { left, duration, delay };
  }), []);
  
  return (
    <div className="fixed inset-0 pointer-events-none z-[50] overflow-hidden">
      {confettiItems.map(({ left, duration, delay }, i) => (
        <div key={i} className="absolute text-2xl animate-confetti" style={{
          left: `${left}%`, top: `-10%`, animationDuration: `${duration}s`, animationDelay: `${delay}s`
        }}>🎉</div>
      ))}
      <style>{`@keyframes confetti { 100% { transform: translateY(110vh) rotate(720deg); opacity: 0; } } .animate-confetti { animation: confetti 3s ease-out forwards; }`}</style>
    </div>
  );
};

interface TimeDisplayProps {
  hour: number;
  minute: number;
}

export const TimeDisplay: React.FC<TimeDisplayProps> = ({ hour, minute }) => {
  const angleH = ((hour % 12) + minute / 60) * 30;
  const angleM = minute * 6;
  const hourLen = 46;
  const minuteLen = 70;
  return (
    <div className="relative w-32 h-32 sm:w-44 sm:h-44">
      <div className="absolute inset-0 rounded-full bg-white border-[6px] sm:border-[10px] border-blue-100 shadow-[0_10px_25px_rgba(59,130,246,0.12)]"></div>
      {/* minute ticks */}
      {Array.from({ length: 60 }).map((_, i) => (
        <div
          key={i}
          className="absolute left-1/2 top-1/2 origin-bottom"
          style={{
            width: i % 5 === 0 ? 3 : 1,
            height: i % 5 === 0 ? 10 : 6,
            background: i % 5 === 0 ? '#93c5fd' : '#cbd5e1',
            transform: `translate(-50%, -50%) rotate(${i * 6}deg) translateY(-95px)`
          }}
        />
      ))}
      {/* numbers */}
      {Array.from({ length: 12 }).map((_, i) => {
        const n = i === 0 ? 12 : i;
        const angle = i * 30;
        return (
          <div
            key={n}
            className="absolute left-1/2 top-1/2 text-xs font-bold text-slate-500"
            style={{
              transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-78px) rotate(${-angle}deg)`
            }}
          >
            {n}
          </div>
        );
      })}
      {/* hour hand */}
      <div
        className="absolute left-1/2 top-1/2 w-[8px] bg-blue-500 rounded-full origin-bottom shadow-md"
        style={{ height: `${hourLen}px`, transform: `translate(-50%, -100%) rotate(${angleH}deg)` }}
      />
      {/* minute hand */}
      <div
        className="absolute left-1/2 top-1/2 w-[6px] bg-blue-800 rounded-full origin-bottom shadow"
        style={{ height: `${minuteLen}px`, transform: `translate(-50%, -100%) rotate(${angleM}deg)` }}
      />
      <div className="absolute left-1/2 top-1/2 w-4 h-4 -translate-x-1/2 -translate-y-1/2 bg-blue-900 rounded-full shadow-inner"></div>
    </div>
  );
};

interface TimeGameViewProps {
  problem: TimeMatchProblem;
  onAnswer: (answer: boolean) => void;
  soundEnabled: boolean;
}

export const TimeGameView: React.FC<TimeGameViewProps> = ({ problem, onAnswer, soundEnabled }) => {
  const t = useTranslation();
  const { formatText } = useProfileText();
  const [disabled, setDisabled] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisabled([]);
      setFeedback(null);
    }, 0);
    return () => clearTimeout(timer);
  }, [problem.uid]);

  const handleChoice = (opt: string): void => {
    playSound('click', soundEnabled);
    const correct = opt === problem.answer;
    if (correct) {
      setFeedback(null);
      onAnswer(true);
    } else {
      setDisabled(prev => [...prev, opt]);
      setFeedback(`${t.gameScreen.timeMatch.correctTimeIs} ${problem.answer}`);
      onAnswer(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 sm:gap-6 w-full px-2">
      <TimeDisplay hour={problem.display.hour} minute={problem.display.minute} />
      <div className="text-xs sm:text-sm font-semibold text-slate-500 mb-1 sm:mb-2">{formatText(t.gameScreen.timeMatch.selectCorrectTime)}</div>
      {feedback && <div className="text-[10px] sm:text-xs font-semibold text-red-500 -mt-1 sm:-mt-2 px-2 text-center">{formatText(feedback)}</div>}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full max-w-sm">
        {problem.options.map((opt, idx) => (
          <button
            key={idx}
            disabled={disabled.includes(opt)}
            onClick={() => handleChoice(opt)}
            className={`
              h-14 sm:h-16 rounded-xl sm:rounded-2xl border-b-4 sm:border-b-[6px] text-base sm:text-xl font-black flex items-center justify-center transition-all p-1.5 sm:p-2 shadow-sm
              bg-white border-blue-200 text-slate-700
              ${disabled.includes(opt) ? 'bg-slate-100 border-slate-100 opacity-40 cursor-not-allowed scale-95' : 'hover:border-blue-400 hover:-translate-y-1 active:scale-95 active:border-b-0 active:translate-y-1'}
            `}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
};

interface UnitConversionViewProps {
  problem: UnitConversionProblem;
  onAnswer: (answer: boolean) => void;
  soundEnabled: boolean;
}

export const UnitConversionView: React.FC<UnitConversionViewProps> = ({ problem, onAnswer, soundEnabled }) => {
  const { formatText } = useProfileText();
  const [disabled, setDisabled] = useState<number[]>([]);
  
  useEffect(() => { 
    setTimeout(() => setDisabled([]), 0);
  }, [problem.uid]);

  const handleChoice = (opt: number): void => {
    playSound('click', soundEnabled);
    const isCorrect = opt === problem.answer;
    
    if (isCorrect) {
      onAnswer(true);
    } else {
      setDisabled([...disabled, opt]);
      onAnswer(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center animate-in fade-in zoom-in duration-300 px-2">
      {/* Ülesande kuvamine */}
      <div className="mb-4 sm:mb-6 p-4 sm:p-6 bg-white rounded-2xl sm:rounded-3xl border-b-6 sm:border-b-8 border-teal-200 shadow-lg text-center w-full max-w-md">
        {/* Küsimus */}
        <h2 className="text-lg sm:text-2xl font-black text-teal-700 mb-2 sm:mb-3">
          {formatText(problem.question)}
        </h2>
        
        {/* Teisendus visuaalselt */}
        <div className="text-xl sm:text-3xl font-bold text-slate-600 bg-teal-50 rounded-xl p-3 sm:p-4 border-2 border-teal-200">
          {formatText(problem.question)}
        </div>
      </div>

      {/* Valikud - 2x2 grid */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full max-w-md">
        {problem.options.map((opt, idx) => {
          const isDisabled = disabled.includes(opt);
          return (
            <button
              key={idx}
              disabled={isDisabled}
              onClick={() => handleChoice(opt)}
              className={`
                h-20 sm:h-24 rounded-2xl sm:rounded-3xl border-b-6 sm:border-b-8 
                text-2xl sm:text-3xl font-black flex items-center justify-center 
                transition-all shadow-lg
                ${isDisabled 
                  ? 'bg-slate-200 border-slate-300 opacity-40 cursor-not-allowed scale-95' 
                  : 'bg-gradient-to-br from-white to-teal-50 border-teal-300 hover:border-teal-500 hover:bg-teal-100 hover:scale-105 hover:-translate-y-1 hover:shadow-xl active:scale-95 active:border-b-2 active:translate-y-1'
                }
              `}
            >
              <span className={isDisabled ? 'text-slate-400' : 'text-teal-700'}>
                {opt} {problem.toUnit}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
