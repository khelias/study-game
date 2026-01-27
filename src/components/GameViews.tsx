import React, { useEffect, useState, useMemo, useCallback, useId } from 'react';
import { ArrowRight, RotateCcw, Play } from 'lucide-react';
import { playSound } from '../engine/audio';
import { useTranslation } from '../i18n/useTranslation';
import { useProfileText } from '../hooks/useProfileText';
import { GameConfig } from '../types/game';
import { buildUnitConversionQuestion } from '../utils/unitConversion';
import { ControlPad } from './ControlPad';
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

type AnswerHandler = (answer: boolean) => void;

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
  num?: number;
  label?: string;
  color: 'blue' | 'red' | 'neutral';
  dashed?: boolean;
}

const SvgWeight: React.FC<SvgWeightProps> = ({ x, y, num, label, color, dashed }) => {
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
      
      {/* Number background (better readability) */}
      <circle cx="0" cy="-5" r="10" fill="white" opacity="0.25" />
      
      {/* Number - larger and clearer, always visible */}
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
                {/* Enhanced golden gradient for scale */}
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
            
            {/* Enhanced base - 3D effect */}
            <path d="M 120 230 L 220 230 Q 230 230 225 220 L 180 140 L 160 140 L 115 220 Q 110 230 120 230" 
                  fill="url(#gradGoldVertical)" 
                  filter="url(#shadowStrong)" 
                  stroke="#b45309" 
                  strokeWidth="2" />
            {/* Base shadow */}
            <ellipse cx="170" cy="230" rx="55" ry="8" fill="black" opacity="0.3" />
            
            {/* Enhanced support post */}
            <rect x="165" y="60" width="10" height="100" 
                  fill="url(#gradPole)" 
                  filter="url(#shadow)"
                  rx="2" />
            <rect x="163" y="58" width="14" height="4" 
                  fill="#92400e" 
                  rx="2" />
            
            <g style={{ transform: `rotate(${tilt}deg)`, transformOrigin: '170px 60px', transition: 'transform 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
                {/* Enhanced scale - 3D effect */}
                <rect x="50" y="55" width="240" height="10" rx="5" 
                      fill="url(#gradGold)" 
                      filter="url(#shadowStrong)" 
                      stroke="#b45309" 
                      strokeWidth="1.5" />
                {/* Scale top glow */}
                <rect x="50" y="55" width="240" height="4" rx="5" fill="#fcd34d" opacity="0.6" />
                
                {/* Enhanced center point */}
                <circle cx="170" cy="60" r="8" fill="url(#gradGoldVertical)" filter="url(#shadowStrong)" stroke="#b45309" strokeWidth="2" />
                <circle cx="170" cy="60" r="5" fill="#fbbf24" opacity="0.8" />
                <g transform="translate(60, 60)">
                    <g style={{ transform: `rotate(${-tilt}deg)`, transformOrigin: '0px 0px', transition: 'transform 1.2s' }}>
                        {/* Enhanced ropes - 3D effect */}
                        <line x1="0" y1="0" x2="-25" y2="90" stroke="#64748b" strokeWidth="3" strokeLinecap="round" />
                        <line x1="0" y1="0" x2="25" y2="90" stroke="#64748b" strokeWidth="3" strokeLinecap="round" />
                        <line x1="0" y1="0" x2="-25" y2="90" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
                        <line x1="0" y1="0" x2="25" y2="90" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
                        
                        {/* Enhanced bowl - blue */}
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
                        {/* Enhanced ropes - 3D effect */}
                        <line x1="0" y1="0" x2="-25" y2="90" stroke="#64748b" strokeWidth="3" strokeLinecap="round" />
                        <line x1="0" y1="0" x2="25" y2="90" stroke="#64748b" strokeWidth="3" strokeLinecap="round" />
                        <line x1="0" y1="0" x2="-25" y2="90" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
                        <line x1="0" y1="0" x2="25" y2="90" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
                        
                        {/* Enhanced bowl - red */}
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

interface StandardGameViewProps {
  problem: SentenceLogicProblem | LetterMatchProblem;
  onAnswer: AnswerHandler;
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
    
    const isCorrect = problem.type === 'sentence_logic' 
      ? (typeof opt === 'object' && 'text' in opt ? opt.text === problem.answer : false)
      : opt === problem.answer;
    
    if (isCorrect) {
      setHasAnswered(true);
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
  onAnswer: AnswerHandler;
  soundEnabled: boolean;
}

export const WordGameView: React.FC<WordGameViewProps> = ({ problem, onAnswer, soundEnabled }) => {
  const t = useTranslation();
  const [userWord, setUserWord] = useState<Array<{ char: string; id: string } | null>>([]);
  const [pool, setPool] = useState<Array<{ char: string; id: string }>>(problem.shuffled || []);
  const problemUid: string = problem.uid;
  const buildInitialWord = useCallback((): Array<{ char: string; id: string } | null> => {
    const next: Array<{ char: string; id: string } | null> = [];
    for (let i = 0; i < problem.target.length; i++) {
      if (problem.preFilledPositions?.includes(i)) {
        const char = problem.target[i];
        if (char) {
          next[i] = { char, id: `prefilled-${i}` };
        } else {
          next[i] = null;
        }
      } else {
        next[i] = null;
      }
    }
    return next;
  }, [problem.target, problem.preFilledPositions]);

  const buildInitialPool = useCallback((): Array<{ char: string; id: string }> => {
    const remainingPool = [...(problem.shuffled || [])];
    problem.preFilledPositions?.forEach(idx => {
      const char = problem.target[idx];
      if (char) {
        const indexInPool = remainingPool.findIndex(
          l => l.char.toUpperCase() === char.toUpperCase()
        );
        if (indexInPool !== -1) {
          remainingPool.splice(indexInPool, 1);
        }
      }
    });
    return remainingPool;
  }, [problem.shuffled, problem.target, problem.preFilledPositions]);
  
  // Initialize userWord with pre-filled positions
  useEffect(() => { 
    const timer = setTimeout(() => {
      setUserWord(buildInitialWord());
      setPool(buildInitialPool());
    }, 0);
    return () => clearTimeout(timer);
  }, [problemUid, buildInitialWord, buildInitialPool]);
  
  const isPreFilled = (index: number): boolean => {
    return problem.preFilledPositions?.includes(index) || false;
  };
  
  const handleSelect = (letter: LetterObject): void => {
    playSound('click', soundEnabled);
    
    // Find first empty (non-prefilled) slot
    const emptyIndex = userWord.findIndex((l, idx) => !isPreFilled(idx) && l === null);
    if (emptyIndex === -1) return; // All non-prefilled slots are full
    
    const newWord = [...userWord];
    newWord[emptyIndex] = letter;
    setUserWord(newWord);
    setPool(pool.filter(l => l.id !== letter.id));
    
    // Check if all positions are filled
    if (newWord.every(l => l !== null)) {
      const userString = newWord.map(l => (l as LetterObject).char).join('');
      if (userString === problem.target) {
        onAnswer(true);
      } else {
        setTimeout(() => { 
          onAnswer(false);
          setUserWord(buildInitialWord());
          setPool(buildInitialPool());
        }, 500);
      }
    }
  };

  const handleRemove = (letter: LetterObject, idx: number): void => {
    // Cannot remove pre-filled letters
    if (isPreFilled(idx)) return;
    
    playSound('click', soundEnabled);
    const newUserWord = [...userWord]; 
    newUserWord[idx] = null;
    setUserWord(newUserWord); 
    setPool(prev => [...prev, letter]);
  };

  return (
    <div className="flex flex-col items-center mt-2 sm:mt-4 w-full animate-in fade-in slide-in-from-right-4 duration-500 px-2">
      <div className="text-6xl sm:text-9xl mb-4 sm:mb-8 animate-bounce filter drop-shadow-xl">{problem.emoji}</div>
      
      {/* Show hint if there are pre-filled positions */}
      {problem.preFilledPositions && problem.preFilledPositions.length > 0 && (
        <div className="mb-2 text-sm sm:text-base text-orange-600 font-bold">
          💡 {t.gameScreen.wordBuilder.preFilled}
        </div>
      )}
      
      {/* Silhouette positions */}
      <div className="flex gap-1.5 sm:gap-2 mb-4 sm:mb-8 min-h-[3.5rem] sm:min-h-[4.5rem] flex-wrap justify-center">
        {Array.from({ length: problem.target.length }).map((_, i) => {
          const isPrefilled = isPreFilled(i);
          const letter = userWord[i];
          
          return (
            <button 
              key={i} 
              onClick={() => letter && !isPrefilled && handleRemove(letter, i)} 
              disabled={isPrefilled}
              className={`w-12 h-14 sm:w-14 sm:h-16 rounded-xl sm:rounded-2xl border-b-3 sm:border-b-4 flex items-center justify-center text-2xl sm:text-3xl font-black transition-all ${
                isPrefilled 
                  ? 'bg-gradient-to-br from-green-100 to-green-200 border-green-500 text-green-700 cursor-not-allowed'
                  : letter 
                    ? 'bg-orange-100 border-orange-400 text-orange-600 scale-100 cursor-pointer hover:bg-orange-200' 
                    : 'bg-slate-100 border-slate-200 border-dashed scale-95'
              }`}
            >
              {letter ? letter.char : ''}
            </button>
          );
        })}
      </div>
      
      {/* Letter pool */}
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
  onAnswer: AnswerHandler;
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
  onAnswer: AnswerHandler;
  soundEnabled: boolean;
}

export const PatternTrainView: React.FC<PatternTrainViewProps> = ({ problem, onAnswer, soundEnabled }) => {
  const t = useTranslation();
  const { formatText } = useProfileText();
  const [disabled, setDisabled] = useState<number[]>([]);
  const [trainState, setTrainState] = useState<'enter' | 'idle' | 'leave'>('enter'); 
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [feedbackChoice, setFeedbackChoice] = useState<string | null>(null);
  const problemUid = problem.uid;
  const patternPreview = useMemo(() => problem.patternCycle.join(' '), [problem.patternCycle]);
  
  useEffect(() => { 
    const timer = setTimeout(() => {
      setDisabled([]); 
      setTrainState('enter'); 
      setSelectedOption(null);
      setFeedbackChoice(null);
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
    
    const isCorrect = opt === problem.answer;
    
    if (isCorrect) { 
      setFeedbackChoice(null);
      setTrainState('leave'); 
      setTimeout(() => {
        onAnswer(true);
        setSelectedOption(null);
      }, 700); 
    } else { 
      setDisabled(prev => [...prev, idx]); 
      setFeedbackChoice(opt);
      setTimeout(() => {
        onAnswer(false);
        setSelectedOption(null);
      }, 350);
    }
  };

  return (
    <div className="w-full flex flex-col items-center px-2 sm:px-4">
      <div className="w-full max-w-3xl text-center mb-3 sm:mb-4">
        <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wide text-teal-600">
          {formatText(t.gameScreen.pattern.tagline)}
        </div>
        <div className="text-lg sm:text-2xl font-black text-slate-800">
          {formatText(t.gameScreen.pattern.instruction)}
        </div>
        <div className="text-xs sm:text-sm text-slate-500 mt-1">
          {formatText(t.gameScreen.pattern.subInstruction)}
        </div>
      </div>

      <div className="w-full max-w-4xl">
        <div className="relative rounded-2xl sm:rounded-3xl bg-gradient-to-b from-white via-teal-50 to-emerald-50 border-2 sm:border-3 border-teal-200 shadow-lg px-3 sm:px-6 py-4 sm:py-6 overflow-hidden">
          <div className="absolute inset-x-6 bottom-4 h-1.5 sm:h-2 bg-gradient-to-r from-slate-400 via-slate-500 to-slate-400 rounded-full opacity-80"></div>
          <div className="absolute inset-x-8 bottom-2 h-1 bg-slate-300 rounded-full opacity-60"></div>

          <div
            className={`flex items-end gap-2 sm:gap-3 overflow-x-auto pb-6 sm:pb-8 transition-transform duration-700 ease-out ${
              trainState === 'enter' ? 'opacity-0 -translate-x-6' : ''
            } ${trainState === 'leave' ? 'opacity-0 translate-x-10' : ''}`}
          >
            <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-500 text-2xl sm:text-3xl shadow-md shrink-0">
              🚂
            </div>
            {problem.sequence.map((item, i) => (
              <div
                key={`${item}-${i}`}
                className="relative w-12 h-16 sm:w-16 sm:h-20 rounded-2xl bg-white/90 border-2 border-teal-200 shadow-md flex items-center justify-center text-2xl sm:text-4xl shrink-0"
              >
                <span className="drop-shadow-sm">{item}</span>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
                  <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-slate-700 rounded-full"></span>
                  <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-slate-700 rounded-full"></span>
                </div>
              </div>
            ))}
            <div className="relative w-12 h-16 sm:w-16 sm:h-20 rounded-2xl border-2 border-dashed border-amber-300 bg-amber-100/80 shadow-md flex items-center justify-center text-2xl sm:text-4xl shrink-0">
              <span className="font-black text-amber-700">?</span>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
                <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-slate-700 rounded-full"></span>
                <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-slate-700 rounded-full"></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {feedbackChoice && (
        <div className="w-full max-w-3xl mt-3 sm:mt-4 rounded-2xl border-2 border-amber-200 bg-amber-50 px-3 sm:px-4 py-3 sm:py-4 text-amber-900 shadow-sm">
          <div className="text-sm sm:text-base font-black">{formatText(t.gameScreen.pattern.feedbackTitle)}</div>
          <div className="text-xs sm:text-sm mt-1">
            {formatText(
              t.gameScreen.pattern.feedbackReason
                .replace('{pattern}', patternPreview)
                .replace('{answer}', problem.answer)
            )}
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs sm:text-sm">
            <span className="font-semibold">{formatText(t.gameScreen.pattern.feedbackChoiceLabel)}</span>
            <span className="text-xl">{feedbackChoice}</span>
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs sm:text-sm">
            <span className="font-semibold">{formatText(t.gameScreen.pattern.patternLabel)}</span>
            <div className="flex items-center gap-1 text-lg">
              {problem.patternCycle.map((item, index) => (
                <span key={`${item}-${index}`}>{item}</span>
              ))}
            </div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-3 gap-2 sm:gap-4 w-full max-w-md mt-4 sm:mt-5">
        {problem.options.map((opt, idx) => {
          const isDisabled = disabled.includes(idx) || trainState === 'leave';
          const isSelected = selectedOption === idx;
          
          return (
            <button 
              key={idx} 
              disabled={isDisabled} 
              onClick={() => handleChoice(opt, idx)} 
              className={`
                h-16 sm:h-24 rounded-2xl border-2 text-3xl sm:text-5xl flex items-center justify-center 
                transition-all duration-200 shadow-md
                ${isDisabled 
                  ? 'bg-slate-200 opacity-40 grayscale cursor-not-allowed border-slate-300' 
                  : isSelected
                  ? 'bg-emerald-200 border-emerald-400 scale-[1.02] shadow-lg'
                  : 'bg-white border-teal-200 hover:border-teal-400 hover:bg-teal-50 active:scale-95'
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
  onAnswer: AnswerHandler;
  soundEnabled: boolean;
}

export const MemoryGameView: React.FC<MemoryGameViewProps> = ({ problem, onAnswer, soundEnabled }) => {
  const t = useTranslation();
  const { formatText } = useProfileText();
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
      {/* Progress bar - compact on mobile */}
      {totalPairs > 0 && (
        <div className="w-full max-w-md mb-3 sm:mb-4">
          <div className="flex items-center justify-between mb-1 sm:mb-2">
            <span className="text-xs sm:text-sm font-bold text-purple-700">{formatText(t.gameScreen.memoryMath.pairsLabel)}: {matchedPairs}/{totalPairs}</span>
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
      
      {/* Enhanced cards - more colorful and attractive, compact on mobile */}
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
  onAnswer: AnswerHandler;
  soundEnabled: boolean;
}

export const RoboPathView: React.FC<RoboPathViewProps> = ({ problem, onAnswer, soundEnabled }) => {
  const t = useTranslation();
  const { formatText } = useProfileText();
  const [commands, setCommands] = useState<string[]>([]);
  const [robotPos, setRobotPos] = useState<[number, number]>(problem.start);
  const [robotDirection, setRobotDirection] = useState<'UP' | 'DOWN' | 'LEFT' | 'RIGHT'>('DOWN');
  const [status, setStatus] = useState<'planning' | 'moving' | 'crash' | 'win' | 'notReached'>('planning');
  const [stars, setStars] = useState<number>(0);
  const [currentCommandIndex, setCurrentCommandIndex] = useState<number>(-1);
  const [showRetryPrompt, setShowRetryPrompt] = useState<boolean>(false);
  const [showHintMarker, setShowHintMarker] = useState<boolean>(false);
  const coalPos = problem.coal ?? problem.coins?.[0];
  const maxCommands = problem.maxCommands ?? 8;
  const commandCount = commands.length;
  
  // Calculate Manhattan distance to goal
  const calculateDistance = useCallback((pos: [number, number]): number => {
    const goalPos = problem.end || problem.goal;
    return Math.abs(goalPos[0] - pos[0]) + Math.abs(goalPos[1] - pos[1]);
  }, [problem.end, problem.goal]);
  
  // Reset state when problem changes
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => { 
      setCommands([]); 
      setRobotPos(problem.start); 
      setRobotDirection('DOWN');
      setStatus('planning');
      setStars(0);
      setCurrentCommandIndex(-1);
      setShowRetryPrompt(false);
      setShowHintMarker(false);
  }, [problem.uid, problem.start]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const addCommand = useCallback((cmd: string): void => { 
      if (status !== 'planning' || commandCount >= maxCommands) return; 
      playSound('click', soundEnabled);
      setCommands(prev => [...prev, cmd]); 
  }, [status, commandCount, maxCommands, soundEnabled]);
  
  const removeCommand = useCallback(() => { 
      if (status !== 'planning' || commandCount === 0) return; 
      playSound('click', soundEnabled);
      setCommands(prev => prev.slice(0, -1)); 
  }, [status, commandCount, soundEnabled]);
  
  const runSimulation = useCallback(async (): Promise<void> => {
    if (commandCount === 0) return;
    setStatus('moving');
    playSound('click', soundEnabled);
    
    const currentPos: [number, number] = [problem.start[0], problem.start[1]];
    let currentDir: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' = 'DOWN';
    
    for (let i = 0; i < commands.length; i++) {
        const cmd = commands[i];
        setCurrentCommandIndex(i);
        await new Promise(r => setTimeout(r, 400));
        
        let newDir: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' = currentDir;
        if (cmd === 'UP') {
          currentPos[1] = Math.max(0, currentPos[1] - 1);
          newDir = 'UP';
        }
        if (cmd === 'DOWN') {
          currentPos[1] = Math.min(problem.gridSize - 1, currentPos[1] + 1);
          newDir = 'DOWN';
        }
        if (cmd === 'LEFT') {
          currentPos[0] = Math.max(0, currentPos[0] - 1);
          newDir = 'LEFT';
        }
        if (cmd === 'RIGHT') {
          currentPos[0] = Math.min(problem.gridSize - 1, currentPos[0] + 1);
          newDir = 'RIGHT';
        }
        
        currentDir = newDir;
        setRobotDirection(newDir);
        setRobotPos([currentPos[0], currentPos[1]]);
        
        if (problem.obstacles.some(o => o[0] === currentPos[0] && o[1] === currentPos[1])) { 
            setStatus('crash'); 
            setShowHintMarker(true);
            playSound('wrong', soundEnabled);
            setTimeout(() => { 
                onAnswer(false); 
                setRobotPos(problem.start); 
                setRobotDirection('DOWN');
                setCommands([]); 
                setStatus('planning');
                setCurrentCommandIndex(-1);
            }, 2000); 
            return; 
        }
    }
    
    setCurrentCommandIndex(-1);
    
    const goalPos = problem.end || problem.goal;
    if (currentPos[0] === goalPos[0] && currentPos[1] === goalPos[1]) { 
        const finalMoves = commands.length;
        // Calculate stars based on optimal moves
        const optimal = problem.optimalMoves || calculateDistance(problem.start);
        let starCount = 1;
        
        if (finalMoves === optimal) {
          starCount = 3;
        } else if (finalMoves <= optimal + 2) {
          starCount = 2;
        }
        
        setStars(starCount);
        setStatus('win');
        
        playSound('correct', soundEnabled);
        if (starCount < 3) {
          setShowRetryPrompt(true);
          return;
        }
        setTimeout(() => onAnswer(true), 3000); 
    } else { 
        setStatus('notReached'); 
        setShowHintMarker(true);
        playSound('wrong', soundEnabled);
        setTimeout(() => { 
            onAnswer(false); 
            setRobotPos(problem.start);
            setRobotDirection('DOWN');
            setCommands([]); 
            setStatus('planning');
            setCurrentCommandIndex(-1);
        }, 2000); 
    }
  }, [commands, commandCount, problem.start, problem.end, problem.goal, problem.gridSize, problem.obstacles, problem.optimalMoves, soundEnabled, calculateDistance, onAnswer]);

  const handleRetry = useCallback(() => {
    setShowRetryPrompt(false);
    setCommands([]);
    setRobotPos(problem.start);
    setRobotDirection('DOWN');
    setStatus('planning');
    setStars(0);
    setCurrentCommandIndex(-1);
  }, [problem.start]);

  const handleNext = useCallback(() => {
    setShowRetryPrompt(false);
    onAnswer(true);
  }, [onAnswer]);

  // Keyboard support
  useEffect(() => {
    if (status !== 'planning') return;
    
    const handleKeyPress = (e: KeyboardEvent): void => {
      if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'TEXTAREA') return;
      
      let command: string | null = null;
      
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
      } else if (e.key === 'w' || e.key === 'W') {
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
      } else if ((e.key === 'Backspace' || e.key === 'Delete') && commandCount > 0) {
        e.preventDefault();
        removeCommand();
        return;
      } else if ((e.key === 'Enter' || e.key === ' ') && commandCount > 0) {
        e.preventDefault();
        void runSimulation();
        return;
      }
      
      if (command && commandCount < maxCommands) {
        addCommand(command);
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [status, commandCount, maxCommands, addCommand, removeCommand, runSimulation]);

  const renderCell = (x: number, y: number): React.ReactNode => {
     const isRobot = robotPos[0] === x && robotPos[1] === y;
     const isStart = problem.start[0] === x && problem.start[1] === y;
     const isEnd = (problem.end?.[0] ?? problem.goal?.[0]) === x && (problem.end?.[1] ?? problem.goal?.[1]) === y;
     const isRock = problem.obstacles.some(o => o[0] === x && o[1] === y);
     const isCoal = showHintMarker && coalPos?.[0] === x && coalPos?.[1] === y && !isEnd;
     
     // Robot rotation based on direction
     const robotRotation = robotDirection === 'UP' ? 'rotate-0' : 
                          robotDirection === 'RIGHT' ? 'rotate-90' : 
                          robotDirection === 'DOWN' ? 'rotate-180' : 'rotate-[270deg]';
     
     return (
        <div
          key={`${x}-${y}`}
          className={`relative w-full aspect-square bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-emerald-200 rounded-lg flex items-center justify-center text-3xl shadow-sm overflow-hidden transition-all duration-300 ${
            status === 'crash' && isRobot ? 'bg-red-200 animate-pulse' : ''
          } ${isStart ? 'ring-2 ring-emerald-400' : ''} ${isEnd ? 'ring-2 ring-amber-400' : ''}`}
        >
            {isEnd && (
              <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center border-4 border-green-400 rounded-lg">
                <div className="text-4xl animate-pulse drop-shadow-lg">🔋</div>
                <div className="absolute inset-0 bg-green-300 opacity-20 rounded-full blur-xl animate-pulse"></div>
              </div>
            )}
            {isRock && (
              <div className="absolute inset-0 bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600 flex items-center justify-center rounded-lg shadow-[inset_-2px_-2px_8px_rgba(0,0,0,0.4),inset_2px_2px_8px_rgba(255,255,255,0.1),4px_4px_12px_rgba(0,0,0,0.5)] border-2 border-gray-700 transform hover:scale-105 transition-transform">
                <div className="text-3xl drop-shadow-[2px_2px_4px_rgba(0,0,0,0.8)]">🪨</div>
              </div>
            )}
            {isCoal && !isRock && (
              <div className="absolute inset-1 rounded-lg bg-gradient-to-br from-yellow-200 via-amber-200 to-orange-200 border-2 border-amber-400 shadow-[inset_-2px_-2px_6px_rgba(251,191,36,0.45),inset_2px_2px_6px_rgba(255,255,255,0.4)] flex items-center justify-center">
                <div className="text-lg drop-shadow-lg">⚡</div>
              </div>
            )}
            {isRobot && (
              <div className={`absolute inset-0 flex items-center justify-center z-10 text-4xl transition-all duration-300 drop-shadow-2xl ${robotRotation} ${status === 'crash' ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}>
                🤖
              </div>
            )}
            {status === 'crash' && isRobot && (
              <div className="absolute inset-0 flex items-center justify-center z-20 text-5xl animate-ping">💥</div>
            )}
        </div>
     );
  };

  const getCommandColor = (cmd: string): string => {
    if (cmd === 'UP') return 'bg-blue-500 border-blue-700';
    if (cmd === 'DOWN') return 'bg-red-500 border-red-700';
    if (cmd === 'LEFT') return 'bg-yellow-500 border-yellow-700';
    if (cmd === 'RIGHT') return 'bg-green-500 border-green-700';
    return 'bg-white border-indigo-200';
  };

  return (
    <div className="w-full flex flex-col items-center max-w-sm mx-auto">
       {/* Stats panel */}
       <div className="w-full mb-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-2 sm:p-4 border-2 border-indigo-200 shadow-lg">
         <div className="grid grid-cols-2 gap-2 sm:gap-3 text-center">
           <div className="bg-white rounded-lg sm:rounded-xl p-2 sm:p-3 shadow-sm border-2 border-indigo-100">
             <div className="text-[10px] sm:text-xs font-bold text-slate-500 mb-0.5 sm:mb-1">🎯 {t.roboPath.commands}</div>
             <div className="text-lg sm:text-2xl font-black text-purple-600">{commandCount}</div>
           </div>
           <div className="bg-white rounded-lg sm:rounded-xl p-2 sm:p-3 shadow-sm border-2 border-indigo-100">
             <div className="text-[10px] sm:text-xs font-bold text-slate-500 mb-0.5 sm:mb-1">📊 {t.roboPath.max}</div>
             <div className="text-lg sm:text-2xl font-black text-teal-600">{maxCommands}</div>
             <div className="text-[9px] sm:text-xs text-slate-400 mt-0.5 sm:mt-1">
               {commandCount}/{maxCommands}
             </div>
           </div>
         </div>
       </div>
       
       {/* Win celebration with stars */}
       {status === 'win' && (
         <div className="mb-3 text-center bg-gradient-to-br from-yellow-100 to-orange-100 p-4 rounded-2xl border-4 border-yellow-400 shadow-xl">
           <div className="text-4xl mb-2 animate-bounce">
             {stars === 3 ? '⭐⭐⭐' : stars === 2 ? '⭐⭐' : '⭐'}
           </div>
           <div className="text-sm font-bold text-green-700 mb-1">
             {stars === 3 ? t.roboPath.excellent : stars === 2 ? t.roboPath.good : t.roboPath.solved}
           </div>
           <div className="text-xs text-slate-600 mb-2">
             {t.roboPath.youUsed} {commandCount} {t.roboPath.commands}
           </div>
           {showRetryPrompt && (
             <div className="mt-3 bg-white/90 rounded-xl border-2 border-amber-300 p-3 text-xs text-amber-900 shadow-sm">
               <div className="font-bold mb-2">{t.roboPath.tryAgainPrompt}</div>
               <div className="flex gap-2">
                 <button
                   onClick={handleRetry}
                   className="flex-1 bg-amber-500 text-white text-xs font-bold py-2 px-3 rounded-lg shadow-md hover:bg-amber-600 transition-colors"
                 >
                   {t.roboPath.tryAgainButton}
                 </button>
                 <button
                   onClick={handleNext}
                   className="flex-1 bg-emerald-500 text-white text-xs font-bold py-2 px-3 rounded-lg shadow-md hover:bg-emerald-600 transition-colors"
                 >
                   {t.roboPath.nextButton}
                 </button>
               </div>
             </div>
           )}
           {stars < 3 && !showRetryPrompt && (
             <div className="text-[10px] text-orange-600 mt-2">
               {t.roboPath.tryAgainFor3Stars}
             </div>
           )}
         </div>
       )}
       
       {/* Crash/Not reached feedback */}
       {status === 'crash' && (
         <div className="mb-3 text-center bg-red-100 p-3 rounded-xl border-2 border-red-400 animate-pulse">
           <div className="text-sm font-bold text-red-700">{t.roboPath.crashWithStone}</div>
           <div className="text-xs text-red-600 mt-1">{t.roboPath.avoidObstacles}</div>
         </div>
       )}
       
       {status === 'notReached' && (
         <div className="mb-3 text-center bg-orange-100 p-3 rounded-xl border-2 border-orange-400 animate-pulse">
           <div className="text-sm font-bold text-orange-700">{t.roboPath.needMoreCommands}</div>
         </div>
       )}

       <div className="w-full mb-2 text-[10px] sm:text-xs font-semibold text-slate-500 flex flex-wrap items-center justify-center gap-2">
         <span className="flex items-center gap-1">🤖 {t.roboPath.legendStart}</span>
         <span>•</span>
         <span className="flex items-center gap-1">🪨 {t.roboPath.legendObstacle}</span>
         <span>•</span>
         <span className="flex items-center gap-1">🔋 {t.roboPath.legendGoal}</span>
         {showHintMarker && coalPos && (
           <>
             <span>•</span>
             <span className="flex items-center gap-1">⚡ {t.roboPath.legendHint}</span>
           </>
         )}
       </div>
       
       {/* Grid */}
       <div className="grid gap-1 sm:gap-2 w-full mb-2 sm:mb-4 bg-gradient-to-br from-green-100 to-emerald-200 p-2 sm:p-4 rounded-xl sm:rounded-2xl border-2 sm:border-4 border-emerald-300 shadow-inner" style={{ gridTemplateColumns: `repeat(${problem.gridSize}, 1fr)` }}>
          {Array.from({ length: problem.gridSize * problem.gridSize }).map((_, i) => renderCell(i % problem.gridSize, Math.floor(i / problem.gridSize)))}
       </div>
       
       {/* Command queue with colors and indices */}
       <div className="flex gap-1 min-h-10 sm:min-h-12 w-full bg-slate-100 rounded-lg sm:rounded-xl mb-2 sm:mb-4 items-center px-2 py-2 overflow-x-auto border-2 border-slate-300 shadow-inner">
           {commandCount === 0 && <span className="text-slate-400 text-xs sm:text-sm ml-2">{formatText(t.roboPath.addCommands)}</span>}
           {commands.map((c, i) => (
             <div key={i} className="relative flex-shrink-0">
               <div className={`min-w-[2rem] sm:min-w-[2.5rem] h-8 sm:h-10 ${getCommandColor(c)} text-white rounded-lg flex items-center justify-center font-black shadow-md text-base sm:text-xl border-b-4 transform transition-all ${currentCommandIndex === i ? 'scale-110 ring-4 ring-yellow-400 animate-pulse' : ''}`}>
                 {c === 'UP' ? '⬆' : c === 'DOWN' ? '⬇' : c === 'LEFT' ? '⬅' : '➡'}
               </div>
               <div className="absolute -top-1 -right-1 bg-white text-[8px] sm:text-[10px] font-bold text-slate-600 rounded-full w-4 h-4 flex items-center justify-center border border-slate-300">
                 {i + 1}
               </div>
             </div>
           ))}
       </div>
       
       {/* Control buttons */}
       <div className="flex flex-col gap-3 w-full">
         <ControlPad
           onUp={() => addCommand('UP')}
           onDown={() => addCommand('DOWN')}
           onLeft={() => addCommand('LEFT')}
           onRight={() => addCommand('RIGHT')}
           disabled={status !== 'planning' || commandCount >= maxCommands}
           className="mx-auto"
         />
         <div className="flex gap-2 w-full">
           <button 
             onClick={removeCommand} 
             aria-label={t.roboPath.removeCommand} 
             disabled={status !== 'planning' || commandCount === 0} 
             className="flex-1 h-12 sm:h-14 bg-orange-400 border-b-4 border-orange-600 text-white rounded-2xl flex items-center justify-center active:translate-y-1 hover:bg-orange-500 transition-all disabled:bg-gray-300 disabled:border-gray-400 shadow-lg"
           >
             <RotateCcw size={18} className="sm:w-5 sm:h-5" />
           </button>
           <button 
             onClick={() => void runSimulation()} 
             aria-label={t.roboPath.runRobot} 
             disabled={status !== 'planning' || commandCount === 0} 
             className="flex-1 h-12 sm:h-14 bg-gradient-to-r from-green-500 to-emerald-600 border-b-4 border-green-800 text-white font-black rounded-2xl flex items-center justify-center active:translate-y-1 shadow-xl gap-1 sm:gap-2 text-sm sm:text-lg hover:from-green-600 hover:to-emerald-700 transition-all disabled:from-gray-300 disabled:to-gray-400 disabled:border-gray-500"
           >
             {t.roboPath.runRobot} <Play size={18} fill="white" className="sm:w-5 sm:h-5" />
           </button>
         </div>
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
    <div className="relative w-48 h-48 sm:w-52 sm:h-52">
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
  onAnswer: AnswerHandler;
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
    <div className="flex flex-col items-center gap-4 sm:gap-6 w-full px-2 pt-2 sm:pt-4">
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
  onAnswer: AnswerHandler;
  soundEnabled: boolean;
}

export const UnitConversionView: React.FC<UnitConversionViewProps> = ({ problem, onAnswer, soundEnabled }) => {
  const t = useTranslation();
  const { formatText } = useProfileText();
  const [disabled, setDisabled] = useState<number[]>([]);
  const questionText = useMemo(
    () => buildUnitConversionQuestion(t, problem.value, problem.fromUnit, problem.toUnit),
    [t, problem.value, problem.fromUnit, problem.toUnit]
  );
  
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
          {formatText(questionText)}
        </h2>
        
        {/* Teisendus visuaalselt */}
        <div className="text-xl sm:text-3xl font-bold text-slate-600 bg-teal-50 rounded-xl p-3 sm:p-4 border-2 border-teal-200">
          {formatText(`${problem.value} ${problem.fromUnit} = ? ${problem.toUnit}`)}
        </div>
      </div>

      {/* Options - 2x2 grid */}
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
