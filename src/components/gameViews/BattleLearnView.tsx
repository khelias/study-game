/**
 * BattleLearnView Component
 * 
 * Game view for BattleLearn games (Battleship-inspired educational game).
 * Players answer questions to earn shots, then click grid cells to find and sink ships.
 */

import React, { useState, useEffect } from 'react';
import { Target, Waves, Trophy } from 'lucide-react';
import { playSound } from '../../engine/audio';
import { useTranslation } from '../../i18n/useTranslation';
import { applyShot, checkWinCondition, getShipAtPosition, isShipSunk } from '../../engine/battlelearn';
import type { BattleLearnProblem } from '../../types/game';

interface BattleLearnViewProps {
  problem: BattleLearnProblem;
  onAnswer: (isCorrect: boolean) => void;
  soundEnabled: boolean;
}

export const BattleLearnView: React.FC<BattleLearnViewProps> = ({ 
  problem, 
  onAnswer, 
  soundEnabled 
}) => {
  const t = useTranslation();
  const [localProblem, setLocalProblem] = useState(problem);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string>('');
  const [showFeedback, setShowFeedback] = useState(false);

  // Reset when problem changes
  useEffect(() => {
    setLocalProblem(problem);
    setSelectedOption(null);
    setFeedback('');
    setShowFeedback(false);
  }, [problem.uid]);

  const handleOptionSelect = (index: number) => {
    if (localProblem.shotAvailable || localProblem.gameWon) return;
    
    playSound('click', soundEnabled);
    setSelectedOption(index);
    
    const isCorrect = index === localProblem.question.correctIndex;
    
    if (isCorrect) {
      setFeedback('✅ Correct! Take your shot!');
      setShowFeedback(true);
      setTimeout(() => setShowFeedback(false), 2000);
      
      // Grant shot
      setLocalProblem(prev => ({ ...prev, shotAvailable: true }));
      onAnswer(true);
    } else {
      setFeedback('❌ Try again!');
      setShowFeedback(true);
      setTimeout(() => {
        setShowFeedback(false);
        setSelectedOption(null);
      }, 1500);
      onAnswer(false);
    }
  };

  const handleCellClick = (row: number, col: number) => {
    if (!localProblem.shotAvailable || localProblem.gameWon) return;
    
    playSound('click', soundEnabled);
    
    // Apply shot
    const result = applyShot(localProblem.ships, localProblem.revealed, row, col);
    
    if (result.alreadyShot) {
      setFeedback('Already shot here!');
      setShowFeedback(true);
      setTimeout(() => setShowFeedback(false), 1000);
      return;
    }
    
    // Update local state
    const newRevealed = [...localProblem.revealed, [row, col] as [number, number]];
    const newHits = result.hit 
      ? [...localProblem.hits, [row, col] as [number, number]] 
      : localProblem.hits;
    const newSunkShips = result.sunkShipId 
      ? [...localProblem.sunkShips, result.sunkShipId] 
      : localProblem.sunkShips;
    
    const gameWon = checkWinCondition(localProblem.ships);
    
    if (result.hit) {
      if (result.sunkShipId) {
        playSound('success', soundEnabled);
        setFeedback('🎯 Ship sunk!');
      } else {
        playSound('success', soundEnabled);
        setFeedback('💥 Hit!');
      }
    } else {
      setFeedback('💦 Miss!');
    }
    
    setShowFeedback(true);
    setTimeout(() => setShowFeedback(false), 2000);
    
    setLocalProblem(prev => ({
      ...prev,
      revealed: newRevealed,
      hits: newHits,
      sunkShips: newSunkShips,
      shotAvailable: false,
      gameWon,
    }));
    
    setSelectedOption(null);
    
    if (gameWon) {
      setTimeout(() => {
        playSound('success', soundEnabled);
        setFeedback('🏆 Victory! All ships sunk!');
        setShowFeedback(true);
      }, 500);
    }
  };

  const renderGrid = () => {
    const { gridSize } = localProblem;
    const cells = [];
    
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const isRevealed = localProblem.revealed.some(([r, c]) => r === row && c === col);
        const isHit = localProblem.hits.some(([r, c]) => r === row && c === col);
        const ship = getShipAtPosition(localProblem.ships, row, col);
        const isSunk = ship && isShipSunk(ship);
        
        let cellClass = 'w-full h-full border border-gray-300 rounded flex items-center justify-center text-2xl font-bold transition-all duration-200';
        let cellContent = '';
        
        if (!isRevealed) {
          cellClass += ' bg-blue-400 hover:bg-blue-500 cursor-pointer';
          if (localProblem.shotAvailable && !localProblem.gameWon) {
            cellClass += ' hover:scale-110 hover:shadow-lg';
          }
        } else if (isHit) {
          if (isSunk) {
            cellClass += ' bg-red-600 text-white';
            cellContent = '💀';
          } else {
            cellClass += ' bg-red-400 text-white';
            cellContent = '💥';
          }
        } else {
          cellClass += ' bg-blue-200 text-blue-600';
          cellContent = '💦';
        }
        
        cells.push(
          <div
            key={`${row}-${col}`}
            className={cellClass}
            onClick={() => handleCellClick(row, col)}
            style={{ 
              aspectRatio: '1/1',
              cursor: localProblem.shotAvailable && !isRevealed && !localProblem.gameWon ? 'pointer' : 'default'
            }}
          >
            {cellContent}
          </div>
        );
      }
    }
    
    return cells;
  };

  const gridCols = `grid-cols-${localProblem.gridSize}`;
  const gridClass = `grid gap-1 ${gridCols} max-w-md mx-auto`;

  return (
    <div className="w-full flex flex-col items-center px-4 py-6 animate-in fade-in duration-300">
      {/* Game Status */}
      <div className="mb-4 text-center">
        <div className="flex items-center justify-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Target className="w-4 h-4" />
            <span>Ships: {localProblem.ships.length - localProblem.sunkShips.length}/{localProblem.ships.length}</span>
          </div>
          {localProblem.shotAvailable && (
            <div className="flex items-center gap-1 text-green-600 font-bold animate-pulse">
              <Target className="w-4 h-4" />
              <span>Shot Ready!</span>
            </div>
          )}
          {localProblem.gameWon && (
            <div className="flex items-center gap-1 text-yellow-600 font-bold">
              <Trophy className="w-5 h-5" />
              <span>Victory!</span>
            </div>
          )}
        </div>
      </div>

      {/* Feedback */}
      {showFeedback && (
        <div className="mb-4 px-4 py-2 bg-white border-2 border-blue-400 rounded-lg shadow-lg text-lg font-bold animate-in zoom-in duration-200">
          {feedback}
        </div>
      )}

      {/* Grid */}
      <div className="mb-6 w-full max-w-2xl">
        <div className={gridClass} style={{ gridTemplateColumns: `repeat(${localProblem.gridSize}, minmax(0, 1fr))` }}>
          {renderGrid()}
        </div>
      </div>

      {/* Question Card */}
      {!localProblem.gameWon && (
        <div className="w-full max-w-2xl">
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-blue-300">
            <div className="flex items-center gap-2 mb-4">
              <Waves className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-bold text-gray-800">
                {localProblem.shotAvailable ? 'Click a cell to shoot!' : 'Answer to earn a shot:'}
              </h3>
            </div>
            
            {!localProblem.shotAvailable && (
              <>
                <p className="text-xl font-medium mb-4 text-center text-gray-700">
                  {localProblem.question.prompt}
                </p>
                
                <div className="grid grid-cols-2 gap-3">
                  {localProblem.question.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleOptionSelect(index)}
                      disabled={selectedOption !== null}
                      className={`px-6 py-4 rounded-lg font-bold text-lg transition-all duration-200 ${
                        selectedOption === index
                          ? index === localProblem.question.correctIndex
                            ? 'bg-green-500 text-white'
                            : 'bg-red-500 text-white'
                          : 'bg-blue-100 hover:bg-blue-200 text-gray-800 hover:scale-105 hover:shadow-md'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
