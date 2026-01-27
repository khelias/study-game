import React, { useState } from 'react';
import type { CompareSizesProblem } from '../types/game';
import { useTranslation } from '../i18n/useTranslation';
import { playSound } from '../engine/audio';

interface CompareSizesViewProps {
  problem: CompareSizesProblem;
  onAnswer: (isCorrect: boolean) => void;
  soundEnabled: boolean;
}

// Dice face dots patterns (1-6)
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
    <div className="w-20 h-20 bg-white border-4 border-gray-800 rounded-lg shadow-lg flex flex-wrap p-2 gap-1">
      {pattern.map((hasDot, idx) => (
        <div key={idx} className="w-5 h-5 flex items-center justify-center">
          {hasDot && <div className="w-4 h-4 bg-gray-900 rounded-full" />}
        </div>
      ))}
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
  
  // Render dice display
  const renderDiceDisplay = (value: number) => {
    if (value <= 6) {
      return <DiceFace value={value} />;
    } else {
      // For double dice (7-12), show two dice
      const firstDie = Math.min(6, value - 6);
      const secondDie = 6;
      return (
        <div className="flex gap-3">
          <DiceFace value={secondDie} />
          <DiceFace value={firstDie} />
        </div>
      );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      {/* Instruction - emphasize symbol selection */}
      <div className="text-2xl font-bold mb-8 text-gray-700 text-center">
        {t.games.compareSizes.symbolInstruction}
      </div>

      {/* Comparison display */}
      <div className="flex items-center justify-center gap-8 mb-12">
        {/* Left item */}
        <div 
          className="flex flex-col items-center justify-center bg-blue-100 rounded-2xl p-8 min-w-[200px] min-h-[200px] border-4 border-blue-300"
          aria-label={t.games.compareSizes.leftItem}
        >
          {isDiceMode ? (
            <div className="flex flex-col items-center gap-4">
              {renderDiceDisplay(problem.leftItem.value)}
              {problem.showNumbers && (
                <div className="text-4xl font-bold text-blue-600 mt-2">
                  {problem.leftItem.value}
                </div>
              )}
            </div>
          ) : (
            <div className="text-6xl font-bold text-blue-600">
              {problem.leftItem.display}
            </div>
          )}
        </div>

        {/* Middle comparison symbol placeholder - big question mark */}
        <div className="flex flex-col items-center">
          <div className="text-7xl font-bold text-purple-600 animate-pulse">
            ?
          </div>
          <div className="text-sm text-gray-500 mt-2">
            {t.games.compareSizes.selectSymbol}
          </div>
        </div>

        {/* Right item */}
        <div 
          className="flex flex-col items-center justify-center bg-green-100 rounded-2xl p-8 min-w-[200px] min-h-[200px] border-4 border-green-300"
          aria-label={t.games.compareSizes.rightItem}
        >
          {isDiceMode ? (
            <div className="flex flex-col items-center gap-4">
              {renderDiceDisplay(problem.rightItem.value)}
              {problem.showNumbers && (
                <div className="text-4xl font-bold text-green-600 mt-2">
                  {problem.rightItem.value}
                </div>
              )}
            </div>
          ) : (
            <div className="text-6xl font-bold text-green-600">
              {problem.rightItem.display}
            </div>
          )}
        </div>
      </div>

      {/* Symbol selection buttons - MAIN FOCUS */}
      <div className="flex gap-6 flex-wrap justify-center">
        {problem.options.map((option) => {
          const symbol = getSymbol(option);
          const label = option === 'left' 
            ? `${symbol} (${t.games.compareSizes.leftBigger})` 
            : option === 'right' 
            ? `${symbol} (${t.games.compareSizes.rightBigger})` 
            : `${symbol} (${t.games.compareSizes.equal})`;
          
          return (
            <button
              key={option}
              onClick={() => handleAnswer(option)}
              disabled={selectedAnswer !== null}
              className={`
                flex flex-col items-center gap-3 px-10 py-6 rounded-2xl font-bold
                transition-all transform hover:scale-110 active:scale-95
                ${selectedAnswer === option 
                  ? selectedAnswer === problem.answer 
                    ? 'bg-green-500 text-white' 
                    : 'bg-red-500 text-white'
                  : 'bg-gradient-to-br from-purple-500 to-indigo-600 text-white hover:from-purple-600 hover:to-indigo-700'
                }
                border-4 ${
                  selectedAnswer === option
                    ? selectedAnswer === problem.answer
                      ? 'border-green-700'
                      : 'border-red-700'
                    : 'border-purple-700 hover:border-purple-800'
                }
                disabled:opacity-50 shadow-xl
              `}
              aria-label={label}
            >
              {/* Large symbol display */}
              <span className="text-6xl font-black">
                {symbol}
              </span>
              {/* Text label */}
              <span className="text-sm font-medium">
                {option === 'left' ? t.games.compareSizes.leftBigger 
                  : option === 'right' ? t.games.compareSizes.rightBigger 
                  : t.games.compareSizes.equal}
              </span>
            </button>
          );
        })}
      </div>

      {/* Hint area for accessibility */}
      {selectedAnswer && (
        <div 
          className="mt-8 text-center text-xl font-bold"
          role="status"
          aria-live="polite"
        >
          {selectedAnswer === problem.answer ? (
            <span className="text-green-600">
              {t.feedback.correct[0]}
            </span>
          ) : (
            <span className="text-red-600">
              {t.feedback.wrong[0]}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
