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
  const getDotPattern = (val: number) => {
    const patterns: Record<number, boolean[]> = {
      1: [false, false, false, false, true, false, false, false, false],
      2: [true, false, false, false, false, false, false, false, true],
      3: [true, false, false, false, true, false, false, false, true],
      4: [true, false, true, false, false, false, true, false, true],
      5: [true, false, true, false, true, false, true, false, true],
      6: [true, false, true, true, false, true, true, false, true],
    };
    return patterns[val] || patterns[1];
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
    <div className="flex flex-col items-center justify-center min-h-[400px] p-4 sm:p-8">
      {/* Instruction - emphasize symbol selection */}
      <div className="text-lg sm:text-2xl font-bold mb-6 sm:mb-8 text-gray-700 text-center">
        {t.games.compareSizes.symbolInstruction}
      </div>

      {/* Comparison display */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12 w-full max-w-4xl">
        {/* Left item */}
        <div 
          className="flex flex-col items-center justify-center bg-blue-100 rounded-2xl p-4 sm:p-6 lg:p-8 min-w-[140px] sm:min-w-[180px] lg:min-w-[200px] min-h-[140px] sm:min-h-[180px] lg:min-h-[200px] border-2 sm:border-4 border-blue-300 flex-1 max-w-xs"
          aria-label={t.games.compareSizes.leftItem}
        >
          {isDiceMode ? (
            <div className="flex flex-col items-center gap-2 sm:gap-4">
              {renderDiceDisplay(problem.leftItem.value)}
              {problem.showNumbers && (
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-600 mt-2">
                  {problem.leftItem.value}
                </div>
              )}
            </div>
          ) : (
            <div className="text-4xl sm:text-5xl lg:text-6xl font-bold text-blue-600">
              {problem.leftItem.display}
            </div>
          )}
        </div>

        {/* Middle comparison symbol placeholder - big question mark */}
        <div className="flex flex-col items-center flex-shrink-0">
          <div className="text-5xl sm:text-6xl lg:text-7xl font-bold text-purple-600 animate-pulse">
            ?
          </div>
          <div className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">
            {t.games.compareSizes.selectSymbol}
          </div>
        </div>

        {/* Right item */}
        <div 
          className="flex flex-col items-center justify-center bg-green-100 rounded-2xl p-4 sm:p-6 lg:p-8 min-w-[140px] sm:min-w-[180px] lg:min-w-[200px] min-h-[140px] sm:min-h-[180px] lg:min-h-[200px] border-2 sm:border-4 border-green-300 flex-1 max-w-xs"
          aria-label={t.games.compareSizes.rightItem}
        >
          {isDiceMode ? (
            <div className="flex flex-col items-center gap-2 sm:gap-4">
              {renderDiceDisplay(problem.rightItem.value)}
              {problem.showNumbers && (
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-green-600 mt-2">
                  {problem.rightItem.value}
                </div>
              )}
            </div>
          ) : (
            <div className="text-4xl sm:text-5xl lg:text-6xl font-bold text-green-600">
              {problem.rightItem.display}
            </div>
          )}
        </div>
      </div>

      {/* Symbol selection buttons - ALWAYS 3 slots for consistency */}
      <div className="flex gap-3 sm:gap-4 lg:gap-6 flex-wrap justify-center max-w-2xl">
        {(['left', 'right', 'equal'] as const).map((option) => {
          const symbol = getSymbol(option);
          const isAvailable = problem.options.includes(option);
          const label = option === 'left' 
            ? `${symbol} (${t.games.compareSizes.leftBigger})` 
            : option === 'right' 
            ? `${symbol} (${t.games.compareSizes.rightBigger})` 
            : `${symbol} (${t.games.compareSizes.equal})`;
          
          return (
            <button
              key={option}
              onClick={() => isAvailable && handleAnswer(option)}
              disabled={!isAvailable || selectedAnswer !== null}
              className={`
                flex flex-col items-center gap-2 sm:gap-3 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-5 rounded-xl sm:rounded-2xl font-bold
                transition-all transform ${isAvailable && selectedAnswer === null ? 'hover:scale-105 active:scale-95' : ''}
                ${selectedAnswer === option 
                  ? selectedAnswer === problem.answer 
                    ? 'bg-green-500 text-white' 
                    : 'bg-red-500 text-white'
                  : isAvailable
                  ? 'bg-gradient-to-br from-purple-500 to-indigo-600 text-white hover:from-purple-600 hover:to-indigo-700'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }
                border-2 sm:border-4 ${
                  selectedAnswer === option
                    ? selectedAnswer === problem.answer
                      ? 'border-green-700'
                      : 'border-red-700'
                    : isAvailable
                    ? 'border-purple-700 hover:border-purple-800'
                    : 'border-gray-300'
                }
                ${!isAvailable || selectedAnswer !== null ? 'opacity-50' : ''} shadow-lg sm:shadow-xl min-w-[80px] sm:min-w-[100px]
              `}
              aria-label={label}
              aria-disabled={!isAvailable}
            >
              {/* Large symbol display */}
              <span className="text-3xl sm:text-4xl lg:text-5xl font-black">
                {symbol}
              </span>
              {/* Text label */}
              <span className="text-xs sm:text-sm font-medium text-center">
                {option === 'left' ? t.games.compareSizes.leftBigger 
                  : option === 'right' ? t.games.compareSizes.rightBigger 
                  : t.games.compareSizes.equal}
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
