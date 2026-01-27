/**
 * PatternTrainView Component
 * 
 * Game view for pattern recognition games.
 */

import React, { useEffect, useState, useMemo } from 'react';
import { playSound } from '../../engine/audio';
import { useTranslation } from '../../i18n/useTranslation';
import { useProfileText } from '../../hooks/useProfileText';
import type { PatternProblem } from '../../types/game';

type AnswerHandler = (answer: boolean) => void;

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
