import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Equal } from 'lucide-react';
import type { CompareSizesProblem } from '../types/game';
import { useTranslation } from '../i18n/useTranslation';
import { playSound } from '../engine/audio';

interface CompareSizesViewProps {
  problem: CompareSizesProblem;
  onAnswer: (isCorrect: boolean) => void;
  soundEnabled: boolean;
}

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

  const getIcon = (option: 'left' | 'right' | 'equal') => {
    if (option === 'left') return ChevronLeft;
    if (option === 'right') return ChevronRight;
    return Equal;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      {/* Instruction */}
      <div className="text-2xl font-bold mb-8 text-gray-700 text-center">
        {t.games.compareSizes.instruction}
      </div>

      {/* Comparison display */}
      <div className="flex items-center justify-center gap-8 mb-12">
        {/* Left item */}
        <div 
          className="flex flex-col items-center justify-center bg-blue-100 rounded-2xl p-8 min-w-[200px] min-h-[200px] border-4 border-blue-300"
          aria-label={t.games.compareSizes.leftItem}
        >
          {problem.showNumbers ? (
            <div className="text-6xl font-bold text-blue-600">
              {problem.leftItem.display}
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {problem.leftItem.visual && problem.leftItem.visual.split('').map((_, idx) => (
                <div 
                  key={idx} 
                  className="w-16 h-8 bg-blue-500 rounded"
                  aria-hidden="true"
                />
              ))}
            </div>
          )}
        </div>

        {/* VS separator */}
        <div className="text-4xl font-bold text-gray-400">
          {problem.showSymbols ? '?' : 'VS'}
        </div>

        {/* Right item */}
        <div 
          className="flex flex-col items-center justify-center bg-green-100 rounded-2xl p-8 min-w-[200px] min-h-[200px] border-4 border-green-300"
          aria-label={t.games.compareSizes.rightItem}
        >
          {problem.showNumbers ? (
            <div className="text-6xl font-bold text-green-600">
              {problem.rightItem.display}
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {problem.rightItem.visual && problem.rightItem.visual.split('').map((_, idx) => (
                <div 
                  key={idx} 
                  className="w-16 h-8 bg-green-500 rounded"
                  aria-hidden="true"
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Answer options */}
      <div className="flex gap-4 flex-wrap justify-center">
        {problem.options.map((option) => {
          const Icon = getIcon(option);
          const label = option === 'left' 
            ? t.games.compareSizes.leftBigger 
            : option === 'right' 
            ? t.games.compareSizes.rightBigger 
            : t.games.compareSizes.equal;
          
          return (
            <button
              key={option}
              onClick={() => handleAnswer(option)}
              disabled={selectedAnswer !== null}
              className={`
                flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-lg
                transition-all transform hover:scale-105 active:scale-95
                ${selectedAnswer === option 
                  ? selectedAnswer === problem.answer 
                    ? 'bg-green-500 text-white' 
                    : 'bg-red-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
                }
                border-4 ${
                  selectedAnswer === option
                    ? selectedAnswer === problem.answer
                      ? 'border-green-600'
                      : 'border-red-600'
                    : 'border-gray-300'
                }
                disabled:opacity-50
              `}
              aria-label={label}
            >
              <Icon className="w-6 h-6" aria-hidden="true" />
              {problem.showSymbols ? (
                <span className="text-2xl">{getSymbol(option)}</span>
              ) : (
                <span>{label}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Hint area for accessibility */}
      {selectedAnswer && (
        <div 
          className="mt-8 text-center text-lg"
          role="status"
          aria-live="polite"
        >
          {selectedAnswer === problem.answer ? (
            <span className="text-green-600 font-bold">
              {t.feedback.correct[0]}
            </span>
          ) : (
            <span className="text-red-600 font-bold">
              {t.feedback.wrong[0]}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
