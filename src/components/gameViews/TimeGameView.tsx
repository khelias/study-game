/**
 * TimeGameView Component
 * 
 * Game view for time matching games.
 */

import React, { useEffect, useState } from 'react';
import { playSound } from '../../engine/audio';
import { useTranslation } from '../../i18n/useTranslation';
import { useProfileText } from '../../hooks/useProfileText';
import { TimeDisplay } from '../shared/TimeDisplay';
import type { TimeMatchProblem } from '../../types/game';

type AnswerHandler = (answer: boolean) => void;

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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDisabled([]);
     
    setFeedback(null);
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
    <div className="w-full flex flex-col items-center px-4 sm:px-6 max-w-2xl mx-auto pt-4 sm:pt-6 animate-in fade-in duration-300">
      <TimeDisplay hour={problem.display.hour} minute={problem.display.minute} />
      <div className="text-xs sm:text-sm font-semibold text-slate-500 mb-1 sm:mb-2">{formatText(t.gameScreen.timeMatch.selectCorrectTime)}</div>
      {/* Feedback - always reserve space to prevent layout shift */}
      <div className={`text-[10px] sm:text-xs font-semibold text-red-500 -mt-1 sm:-mt-2 px-2 text-center min-h-[1.25rem] transition-opacity duration-300 ${
        feedback ? 'opacity-100' : 'opacity-0'
      }`}>
        {feedback && formatText(feedback)}
      </div>
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
