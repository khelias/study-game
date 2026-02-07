/**
 * UnitConversionView Component
 * 
 * Game view for unit conversion games.
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { playSound } from '../../engine/audio';
import { useTranslation } from '../../i18n/useTranslation';
import { useProfileText } from '../../hooks/useProfileText';
import { buildUnitConversionQuestion } from '../../utils/unitConversion';
import { GAME_CONFIG } from '../../games/data';
import { PaidHintButtons } from '../shared';
import type { UnitConversionProblem } from '../../types/game';

type AnswerHandler = (answer: boolean) => void;

interface UnitConversionViewProps {
  problem: UnitConversionProblem;
  onAnswer: AnswerHandler;
  soundEnabled: boolean;
  gameType?: string;
  stars?: number;
  spendStars?: (count: number) => boolean;
}

export const UnitConversionView: React.FC<UnitConversionViewProps> = ({ problem, onAnswer, soundEnabled, gameType, stars = 0, spendStars }) => {
  const t = useTranslation();
  const { formatText } = useProfileText();
  const baseType = gameType?.replace('_adv', '') ?? 'unit_conversion';
  const paidHints = GAME_CONFIG[baseType]?.paidHints ?? [];
  const [disabled, setDisabled] = useState<number[]>([]);
  const [eliminatedIndices, setEliminatedIndices] = useState<number[]>([]);
  const questionText = useMemo(
    () => buildUnitConversionQuestion(t, problem.value, problem.fromUnit, problem.toUnit),
    [t, problem.value, problem.fromUnit, problem.toUnit]
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset UI when problem.uid changes
    setDisabled([]);
    setEliminatedIndices([]);
  }, [problem.uid]);

  const handlePaidHint = useCallback(
    (hintId: string) => {
      if (hintId !== 'eliminate' || !spendStars) return;
      const wrongIndices = problem.options
        .map((opt, idx) => (opt !== problem.answer ? idx : -1))
        .filter((i) => i >= 0 && !eliminatedIndices.includes(i));
      if (wrongIndices.length === 0) return;
      if (!spendStars(1)) return;
      const pick = wrongIndices[Math.floor(Math.random() * wrongIndices.length)] as number;
      setEliminatedIndices((prev) => [...prev, pick]);
    },
    [problem.options, problem.answer, eliminatedIndices, spendStars]
  );

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
          const isEliminated = eliminatedIndices.includes(idx);
          if (isEliminated) {
            return (
              <div
                key={idx}
                className="h-20 sm:h-24 rounded-2xl sm:rounded-3xl border-2 border-dashed border-slate-200 bg-slate-100/50 min-h-[5rem] sm:min-h-[6rem]"
                aria-hidden
              />
            );
          }
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
      {paidHints.length > 0 && (
        <PaidHintButtons hints={paidHints} stars={stars} onHintClick={handlePaidHint} />
      )}
    </div>
  );
};
