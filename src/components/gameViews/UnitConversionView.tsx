/**
 * UnitConversionView Component
 * 
 * Game view for unit conversion games.
 */

import React, { useEffect, useState, useMemo } from 'react';
import { playSound } from '../../engine/audio';
import { useTranslation } from '../../i18n/useTranslation';
import { useProfileText } from '../../hooks/useProfileText';
import { buildUnitConversionQuestion } from '../../utils/unitConversion';
import type { UnitConversionProblem } from '../../types/game';

type AnswerHandler = (answer: boolean) => void;

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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDisabled([]);
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
    <div className="w-full flex flex-col items-center px-4 sm:px-6 max-w-2xl mx-auto pt-4 sm:pt-6 animate-in fade-in duration-300">
      {/* Task display */}
      <div className="mb-4 sm:mb-6 p-4 sm:p-6 bg-white rounded-2xl sm:rounded-3xl border-b-6 sm:border-b-8 border-teal-200 shadow-lg text-center w-full max-w-md">
        {/* Question */}
        <h2 className="text-lg sm:text-2xl font-black text-teal-700 mb-2 sm:mb-3">
          {formatText(questionText)}
        </h2>
        
        {/* Conversion visually */}
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
