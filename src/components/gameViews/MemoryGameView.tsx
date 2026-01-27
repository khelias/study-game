/**
 * MemoryGameView Component
 * 
 * Game view for memory math matching games.
 */

import React, { useEffect, useState } from 'react';
import { playSound } from '../../engine/audio';
import { useTranslation } from '../../i18n/useTranslation';
import { useProfileText } from '../../hooks/useProfileText';
import type { MemoryMathProblem } from '../../types/game';

type AnswerHandler = (answer: boolean) => void;

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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCards(problem.cards); 
     
    setFlipped([]); 
     
    setMatchedPairs(0);
     
    setShowCelebration(false);
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
          
          // Check if all pairs are found
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
    <div className="w-full flex flex-col items-center px-4 sm:px-6 max-w-2xl mx-auto pt-4 sm:pt-6 animate-in fade-in duration-300">
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
      
      {/* Cards */}
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
                  ? 'opacity-20 scale-95 pointer-events-none' 
                  : isFlipped
                  ? 'bg-gradient-to-br from-white to-purple-50 border-3 sm:border-4 border-purple-500 text-purple-800 scale-100 shadow-xl' 
                  : 'bg-gradient-to-br from-purple-500 to-purple-700 border-3 sm:border-4 border-purple-800 text-transparent scale-100 hover:from-purple-600 hover:to-purple-800 hover:scale-105 active:scale-95'
                }
              `}
            >
              {/* Card back */}
              {!isFlipped && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-4xl opacity-80">🧠</div>
                </div>
              )}
              
              {/* Card front */}
              <div className={`${isFlipped ? 'block' : 'hidden'} transition-opacity duration-300`}>
                <div className={`
                  px-2 py-1 rounded-lg
                  ${isMath ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}
                `}>
                  {card.content}
                </div>
                {/* Small icon for type */}
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
        /* Removed rotation animations - simpler and calmer */
      `}</style>
    </div>
  );
};
