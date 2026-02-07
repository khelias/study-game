import React, { useState } from 'react';
import type { CompareSizesProblem } from '../types/game';
import { useTranslation } from '../i18n/useTranslation';
import { playSound } from '../engine/audio';

interface CompareSizesViewProps {
  problem: CompareSizesProblem;
  onAnswer: (isCorrect: boolean) => void;
  soundEnabled: boolean;
}

// Dice face dots patterns (1-6) - using CSS Grid for robust scaling
const DiceFace: React.FC<{ value: number }> = ({ value }) => {
  const getDotPattern = (val: number): boolean[] => {
    const patterns: Record<number, boolean[]> = {
      1: [false, false, false, false, true, false, false, false, false],
      2: [true, false, false, false, false, false, false, false, true],
      3: [true, false, false, false, true, false, false, false, true],
      4: [true, false, true, false, false, false, true, false, true],
      5: [true, false, true, false, true, false, true, false, true],
      6: [true, false, true, true, false, true, true, false, true],
    };
    return patterns[val] ?? patterns[1]!;
  };

  const pattern = getDotPattern(value);
  
  return (
    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white border-2 sm:border-4 border-gray-800 rounded-lg shadow-lg aspect-square p-1 sm:p-2">
      <div className="grid grid-cols-3 grid-rows-3 w-full h-full gap-0.5 sm:gap-1">
        {pattern.map((hasDot, idx) => (
          <div key={idx} className="flex items-center justify-center">
            {hasDot && <div className="w-2.5 h-2.5 sm:w-4 sm:h-4 bg-gray-900 rounded-full" />}
          </div>
        ))}
      </div>
    </div>
  );
};

export const CompareSizesView: React.FC<CompareSizesViewProps> = ({ 
  problem, 
  onAnswer, 
  soundEnabled 
}) => {
  const t = useTranslation();
  const [selectedAnswer, setSelectedAnswer] = useState<'left' | 'right' | 'equal' | null>(null);

  const handleAnswer = (userAnswer: 'left' | 'right' | 'equal') => {
    setSelectedAnswer(userAnswer);
    const isCorrect = userAnswer === problem.answer;
    
    if (soundEnabled) {
      playSound(isCorrect ? 'correct' : 'wrong');
    }
    
    setTimeout(() => {
      onAnswer(isCorrect);
      setSelectedAnswer(null);
    }, 800);
  };

  const getSymbol = (option: 'left' | 'right' | 'equal') => {
    if (option === 'left') return '>';
    if (option === 'right') return '<';
    return '=';
  };

  // Check if we're using dice visualization
  const isDiceMode = problem.leftItem.visual && problem.leftItem.visual.includes('🎲');
  
  // Render dice display with responsive layout
  const renderDiceDisplay = (value: number) => {
    if (value <= 6) {
      return <DiceFace value={value} />;
    } else {
      // For double dice (7-12), show two dice
      const firstDie = Math.min(6, value - 6);
      const secondDie = 6;
      return (
        <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
          <DiceFace value={secondDie} />
          <DiceFace value={firstDie} />
        </div>
      );
    }
  };

  return (
    <div className="w-full flex flex-col items-center px-4 sm:px-6 max-w-2xl mx-auto pt-4 sm:pt-6 animate-in fade-in duration-300">
      {/* Comparison display */}
      <div className="flex flex-row items-center justify-center gap-3 sm:gap-5 lg:gap-8 mb-6 sm:mb-8 w-full max-w-5xl">
        {/* Left item */}
        <div 
          className="flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-4 sm:p-5 lg:p-7 min-w-[110px] sm:min-w-[150px] lg:min-w-[200px] min-h-[110px] sm:min-h-[150px] lg:min-h-[200px] border-3 sm:border-4 border-blue-400 shadow-xl hover:shadow-2xl transition-shadow duration-300 flex-1 max-w-xs relative overflow-hidden"
          aria-label={t.games.compare_sizes.leftItem}
        >
          {/* Decorative gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-200/20 to-transparent pointer-events-none"></div>
          {isDiceMode ? (
            <div className="flex flex-col items-center gap-2 sm:gap-4 relative z-10">
              {renderDiceDisplay(problem.leftItem.value)}
              {problem.showNumbers && (
                <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-blue-700 mt-2 drop-shadow-sm">
                  {problem.leftItem.value}
                </div>
              )}
            </div>
          ) : (
            <div className="text-5xl sm:text-6xl lg:text-7xl font-black text-blue-600 drop-shadow-md relative z-10">
              {problem.leftItem.display}
            </div>
          )}
        </div>

        {/* Middle comparison symbol placeholder - more elegant */}
        <div className="flex flex-col items-center justify-center flex-shrink-0 px-2 sm:px-3">
          <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full bg-gradient-to-br from-purple-100 to-purple-200 border-3 sm:border-4 border-purple-400 flex items-center justify-center shadow-lg">
            <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-purple-600 animate-pulse">
              ?
            </div>
          </div>
          <div className="text-[10px] sm:text-xs font-semibold text-purple-700 mt-2 text-center max-w-[80px]">
            {t.games.compare_sizes.selectSymbol}
          </div>
        </div>

        {/* Right item */}
        <div 
          className="flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-green-100 rounded-3xl p-4 sm:p-5 lg:p-7 min-w-[110px] sm:min-w-[150px] lg:min-w-[200px] min-h-[110px] sm:min-h-[150px] lg:min-h-[200px] border-3 sm:border-4 border-green-400 shadow-xl hover:shadow-2xl transition-shadow duration-300 flex-1 max-w-xs relative overflow-hidden"
          aria-label={t.games.compare_sizes.rightItem}
        >
          {/* Decorative gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-200/20 to-transparent pointer-events-none"></div>
          {isDiceMode ? (
            <div className="flex flex-col items-center gap-2 sm:gap-4 relative z-10">
              {renderDiceDisplay(problem.rightItem.value)}
              {problem.showNumbers && (
                <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-green-700 mt-2 drop-shadow-sm">
                  {problem.rightItem.value}
                </div>
              )}
            </div>
          ) : (
            <div className="text-5xl sm:text-6xl lg:text-7xl font-black text-green-600 drop-shadow-md relative z-10">
              {problem.rightItem.display}
            </div>
          )}
        </div>
      </div>

      {/* Symbol selection buttons - ALWAYS 3 slots for consistency, improved styling */}
      <div className="flex gap-3 sm:gap-4 lg:gap-5 justify-center max-w-2xl">
        {(['left', 'equal', 'right'] as const).map((option) => {
          const symbol = getSymbol(option);
          const isAvailable = problem.options.includes(option);
          const label = option === 'left' 
            ? `${symbol} (${t.games.compare_sizes.leftBigger})` 
            : option === 'right' 
            ? `${symbol} (${t.games.compare_sizes.rightBigger})` 
            : `${symbol} (${t.games.compare_sizes.equal})`;
          
          return (
            <button
              key={option}
              onClick={() => isAvailable && handleAnswer(option)}
              disabled={!isAvailable || selectedAnswer !== null}
              className={`
                flex flex-col items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-5 lg:px-7 py-3 sm:py-4 lg:py-5 
                rounded-2xl sm:rounded-3xl font-bold relative overflow-hidden
                transition-all duration-300 transform ${isAvailable && selectedAnswer === null ? 'hover:scale-110 hover:-translate-y-1 active:scale-95' : ''}
                ${selectedAnswer === option 
                  ? selectedAnswer === problem.answer 
                    ? 'bg-gradient-to-br from-green-500 to-green-600 text-white shadow-2xl ring-4 ring-green-300' 
                    : 'bg-gradient-to-br from-red-500 to-red-600 text-white shadow-2xl ring-4 ring-red-300'
                  : isAvailable
                  ? 'bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-600 text-white hover:from-purple-600 hover:via-purple-700 hover:to-indigo-700 shadow-xl hover:shadow-2xl'
                  : 'bg-gradient-to-br from-gray-200 to-gray-300 text-gray-400 cursor-not-allowed shadow-md'
                }
                border-3 sm:border-4 ${
                  selectedAnswer === option
                    ? selectedAnswer === problem.answer
                      ? 'border-green-400'
                      : 'border-red-400'
                    : isAvailable
                    ? 'border-purple-400 hover:border-purple-500'
                    : 'border-gray-300'
                }
                ${!isAvailable || selectedAnswer !== null ? 'opacity-60' : ''}
                min-w-[70px] sm:min-w-[90px] lg:min-w-[110px]
              `}
              aria-label={label}
              aria-disabled={!isAvailable}
            >
              {/* Shine effect overlay for available buttons */}
              {isAvailable && selectedAnswer === null && (
                <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent pointer-events-none"></div>
              )}
              
              {/* Symbol display with better styling */}
              <span className="text-2xl sm:text-3xl lg:text-4xl font-black drop-shadow-lg relative z-10">
                {symbol}
              </span>
              
              {/* Text label */}
              <span className="text-[10px] sm:text-xs font-semibold text-center relative z-10 leading-tight">
                {option === 'left' ? t.games.compare_sizes.leftBigger 
                  : option === 'right' ? t.games.compare_sizes.rightBigger 
                  : t.games.compare_sizes.equal}
              </span>
            </button>
          );
        })}
      </div>

      {/* Screen reader feedback only - visually hidden */}
      {selectedAnswer && (
        <div 
          className="sr-only"
          role="status"
          aria-live="polite"
        >
          {selectedAnswer === problem.answer ? (
            <span>
              {t.feedback.correct[0]}
            </span>
          ) : (
            <span>
              {t.feedback.wrong[0]}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
