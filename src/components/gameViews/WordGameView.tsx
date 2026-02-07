/**
 * WordGameView Component
 * 
 * Game view for word builder games.
 */

import React, { useEffect, useState } from 'react';
import { playSound } from '../../engine/audio';
import { useTranslation } from '../../i18n/useTranslation';
import { GAME_CONFIG } from '../../games/data';
import { PaidHintButtons } from '../shared';
import type { WordBuilderProblem, LetterObject } from '../../types/game';

type AnswerHandler = (answer: boolean) => void;

interface WordGameViewProps {
  problem: WordBuilderProblem;
  onAnswer: AnswerHandler;
  soundEnabled: boolean;
  gameType?: string;
  stars?: number;
  spendStars?: (count: number) => boolean;
}

export const WordGameView: React.FC<WordGameViewProps> = ({ problem, onAnswer, soundEnabled, gameType, stars = 0 }) => {
  const t = useTranslation();
  const baseType = gameType?.replace('_adv', '') ?? 'word_builder';
  const paidHints = GAME_CONFIG[baseType]?.paidHints ?? [];
  const [userWord, setUserWord] = useState<Array<{ char: string; id: string } | null>>([]);
  const [pool, setPool] = useState<Array<{ char: string; id: string }>>(problem.shuffled || []);
  
  // Reset state when problem changes
  useEffect(() => { 
    // Build initial word state
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
    
    // Build initial pool (remaining letters after pre-filled)
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
    
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUserWord(next);
    setPool(remainingPool);
  }, [problem.uid, problem.target, problem.shuffled, problem.preFilledPositions]);
  
  const isPreFilled = (index: number): boolean => {
    return problem.preFilledPositions?.includes(index) || false;
  };
  
  const handleSelect = (letter: LetterObject): void => {
    playSound('click', soundEnabled);
    
    // Use functional updates to avoid stale state
    setUserWord(prevWord => {
      // Find first empty (non-prefilled) slot
      const emptyIndex = prevWord.findIndex((l, idx) => !isPreFilled(idx) && l === null);
      if (emptyIndex === -1) return prevWord; // All non-prefilled slots are full
      
      const newWord = [...prevWord];
      newWord[emptyIndex] = letter;
      
      // Check if all positions are filled
      if (newWord.every(l => l !== null)) {
        const userString = newWord.map(l => (l as LetterObject).char).join('');
        // Case-insensitive comparison for word games
        if (userString.toLowerCase() === problem.target.toLowerCase()) {
          onAnswer(true);
        } else {
          setTimeout(() => { 
            onAnswer(false);
            // Reset to initial state
            const resetWord: Array<{ char: string; id: string } | null> = [];
            for (let i = 0; i < problem.target.length; i++) {
              if (problem.preFilledPositions?.includes(i)) {
                const char = problem.target[i];
                resetWord[i] = char ? { char, id: `prefilled-${i}` } : null;
              } else {
                resetWord[i] = null;
              }
            }
            const resetPool = [...(problem.shuffled || [])];
            problem.preFilledPositions?.forEach(idx => {
              const char = problem.target[idx];
              if (char) {
                const indexInPool = resetPool.findIndex(
                  l => l.char.toUpperCase() === char.toUpperCase()
                );
                if (indexInPool !== -1) {
                  resetPool.splice(indexInPool, 1);
                }
              }
            });
            setUserWord(resetWord);
            setPool(resetPool);
          }, 500);
        }
      }
      
      return newWord;
    });
    
    setPool(prev => prev.filter(l => l.id !== letter.id));
  };

  const handleRemove = (letter: LetterObject, idx: number): void => {
    // Cannot remove pre-filled letters
    if (isPreFilled(idx)) return;
    
    playSound('click', soundEnabled);
    
    // Use functional updates to avoid stale state
    setUserWord(prev => {
      const newUserWord = [...prev]; 
      newUserWord[idx] = null;
      return newUserWord;
    }); 
    
    setPool(prev => [...prev, letter]);
  };

  return (
    <div className="w-full flex flex-col items-center px-4 sm:px-6 max-w-2xl mx-auto pt-4 sm:pt-6 animate-in fade-in duration-300">
      <div className="text-6xl sm:text-9xl mb-4 sm:mb-8 animate-bounce filter drop-shadow-xl">{problem.emoji}</div>
      
      {/* Hint - always reserve space to prevent layout shift */}
      <div className={`mb-2 text-sm sm:text-base text-orange-600 font-bold min-h-[1.5rem] transition-opacity duration-300 ${
        problem.preFilledPositions && problem.preFilledPositions.length > 0 ? 'opacity-100' : 'opacity-0'
      }`}>
        {problem.preFilledPositions && problem.preFilledPositions.length > 0 && (
          <>💡 {t.gameScreen.wordBuilder.preFilled}</>
        )}
      </div>
      
      {/* Silhouette positions */}
      <div className="flex gap-1.5 sm:gap-2 mb-4 sm:mb-8 min-h-[3.5rem] sm:min-h-[4.5rem] flex-wrap justify-center">
        {Array.from({ length: problem.target.length }).map((_, i) => {
          const isPrefilled = isPreFilled(i);
          const letter = userWord[i];
          
          return (
            <button 
              key={i} 
              onPointerDown={(e) => {
                if (letter && !isPrefilled) {
                  e.preventDefault();
                  handleRemove(letter, i);
                }
              }}
              type="button"
              disabled={isPrefilled}
              className={`w-12 h-14 sm:w-14 sm:h-16 rounded-xl sm:rounded-2xl border-b-3 sm:border-b-4 flex items-center justify-center text-2xl sm:text-3xl font-black transition-all ${
                isPrefilled 
                  ? 'bg-gradient-to-br from-green-100 to-green-200 border-green-500 text-green-700 cursor-not-allowed'
                  : letter 
                    ? 'bg-orange-100 border-orange-400 text-orange-600 scale-100 cursor-pointer hover:bg-orange-200' 
                    : 'bg-slate-100 border-slate-200 border-dashed scale-95'
              }`}
              style={{ touchAction: 'manipulation' }}
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
            onPointerDown={(e) => {
              e.preventDefault();
              handleSelect(l);
            }}
            type="button"
            className="w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-xl sm:rounded-2xl border-b-[4px] sm:border-b-[6px] border-slate-200 text-2xl sm:text-3xl font-black text-slate-700 shadow-sm active:translate-y-2 active:border-b-0 hover:bg-orange-50 transition-colors"
            style={{ touchAction: 'manipulation' }}
          >
            {l.char}
          </button>
        ))}
      </div>
      {paidHints.length > 0 && (
        <PaidHintButtons hints={paidHints} stars={stars ?? 0} onHintClick={() => {}} />
      )}
    </div>
  );
};
