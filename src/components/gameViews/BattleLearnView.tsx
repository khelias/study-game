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
import { applyShot, checkWinCondition, isShipSunk } from '../../engine/battlelearn';
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
  const [gamePhase, setGamePhase] = useState<'shooting' | 'answering'>('shooting');

  // Reset when problem UID actually changes (new game session)
  // Preserve game state (revealed, hits, sunkShips) during the same session
  useEffect(() => {
    // Only reset if this is truly a new problem (different UID)
    if (problem.uid !== localProblem.uid) {
      setLocalProblem(problem);
      setSelectedOption(null);
      setFeedback('');
      setShowFeedback(false);
      setGamePhase('shooting'); // Always start in shooting phase
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [problem.uid]);

  const handleOptionSelect = (index: number) => {
    if (gamePhase !== 'answering' || localProblem.gameWon) return;
    
    playSound('click', soundEnabled);
    setSelectedOption(index);
    
    const isCorrect = index === localProblem.question.correctIndex;
    
    if (isCorrect) {
      const correctFeedback = t.feedback.correct[Math.floor(Math.random() * t.feedback.correct.length)];
      setFeedback(correctFeedback);
      setShowFeedback(true);
      
      // Return to shooting phase
      setGamePhase('shooting');
      onAnswer(true); // No heart lost
      
      setTimeout(() => {
        setShowFeedback(false);
        setSelectedOption(null);
      }, 1500);
    } else {
      const wrongFeedback = t.feedback.wrong[Math.floor(Math.random() * t.feedback.wrong.length)];
      setFeedback(wrongFeedback);
      setShowFeedback(true);
      
      setTimeout(() => {
        setShowFeedback(false);
        setSelectedOption(null);
      }, 1500);
      
      onAnswer(false); // Lose heart
      // Stay in answering phase until correct
    }
  };

  const handleCellClick = (row: number, col: number) => {
    if (gamePhase !== 'shooting' || localProblem.gameWon) return;
    
    playSound('click', soundEnabled);
    
    // Apply shot
    const result = applyShot(localProblem.ships, localProblem.revealed, row, col);
    
    if (result.alreadyShot) {
      setFeedback(t.battlelearn.alreadyShot);
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
      // HIT: No problem needed, continue shooting
      if (result.sunkShipId) {
        playSound('success', soundEnabled);
        setFeedback(t.battlelearn.shipSunk);
      } else {
        playSound('success', soundEnabled);
        setFeedback(t.battlelearn.hit);
      }
      // Stay in shooting phase
    } else {
      // MISS: Must answer problem to continue
      setFeedback(t.battlelearn.miss);
      setGamePhase('answering'); // Switch to problem phase
    }
    
    setShowFeedback(true);
    setTimeout(() => setShowFeedback(false), 2000);
    
    setLocalProblem(prev => ({
      ...prev,
      revealed: newRevealed,
      hits: newHits,
      sunkShips: newSunkShips,
      gameWon,
    }));
    
    setSelectedOption(null);
    
    if (gameWon) {
      setTimeout(() => {
        playSound('success', soundEnabled);
        setFeedback(t.battlelearn.victory);
        setShowFeedback(true);
      }, 500);
    }
  };

  const renderGrid = () => {
    const { gridSize } = localProblem;
    const cells = [];
    
    // Get all positions of sunk ships for special rendering
    const sunkShipPositions = new Set<string>();
    localProblem.ships.forEach(ship => {
      if (isShipSunk(ship)) {
        ship.positions.forEach(([r, c]) => {
          sunkShipPositions.add(`${r},${c}`);
        });
      }
    });
    
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const posKey = `${row},${col}`;
        const isRevealed = localProblem.revealed.some(([r, c]) => r === row && c === col);
        const isHit = localProblem.hits.some(([r, c]) => r === row && c === col);
        const isSunkShipPosition = sunkShipPositions.has(posKey);
        
        let cellClass = 'w-full h-full border border-gray-300 rounded flex items-center justify-center text-2xl font-bold transition-all duration-200';
        let cellContent = '';
        
        // Sunk ship takes priority - show entire ship
        if (isSunkShipPosition) {
          cellClass += ' bg-gradient-to-br from-purple-600 to-red-800 shadow-xl text-white animate-pulse';
          cellContent = '☠️';
        } else if (!isRevealed) {
          cellClass += ' bg-gradient-to-br from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 shadow-md hover:shadow-xl cursor-pointer transform hover:-translate-y-0.5 transition-all';
          if (gamePhase === 'shooting' && !localProblem.gameWon) {
            cellClass += ' animate-pulse';
          }
        } else if (isHit) {
          // Regular hit (not sunk yet)
          cellClass += ' bg-gradient-to-br from-orange-400 to-red-500 shadow-lg text-white';
          cellContent = '💥';
        } else {
          // Miss
          cellClass += ' bg-gradient-to-br from-slate-200 to-slate-300 text-blue-600';
          cellContent = '💨';
        }
        
        cells.push(
          <div
            key={`${row}-${col}`}
            className={cellClass}
            onClick={() => handleCellClick(row, col)}
            style={{ 
              aspectRatio: '1/1',
              cursor: gamePhase === 'shooting' && !isSunkShipPosition && !isRevealed && !localProblem.gameWon ? 'pointer' : 'default'
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
  const gridClass = `grid gap-2 ${gridCols} max-w-2xl mx-auto shadow-lg rounded-lg p-2 bg-gradient-to-br from-slate-100 to-slate-200`;

  return (
    <div className="w-full flex flex-col items-center px-4 py-6 animate-in fade-in duration-300">
      {/* Game Status */}
      <div className="mb-4 text-center">
        <div className="flex items-center justify-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Target className="w-4 h-4" />
            <span>{t.battlelearn.shipsRemaining}: {localProblem.ships.length - localProblem.sunkShips.length}/{localProblem.ships.length}</span>
          </div>
          {gamePhase === 'shooting' && !localProblem.gameWon && (
            <div className="flex items-center gap-1 px-3 py-1 bg-green-100 border-2 border-green-500 rounded-full text-green-700 font-bold animate-pulse">
              <Target className="w-4 h-4" />
              <span>{t.battlelearn.shotReady}</span>
            </div>
          )}
          {gamePhase === 'answering' && !localProblem.gameWon && (
            <div className="flex items-center gap-1 px-3 py-1 bg-orange-100 border-2 border-orange-500 rounded-full text-orange-700 font-bold">
              <span>❓ {t.battlelearn.answerToEarnShot}</span>
            </div>
          )}
          {localProblem.gameWon && (
            <div className="flex items-center gap-1 px-4 py-2 bg-yellow-100 border-2 border-yellow-500 rounded-full text-yellow-700 font-bold animate-bounce">
              <Trophy className="w-5 h-5" />
              <span>{t.battlelearn.victory}</span>
            </div>
          )}
        </div>
      </div>

      {/* Victory Screen */}
      {localProblem.gameWon && (
        <div className="mb-6 w-full max-w-2xl animate-in zoom-in duration-500">
          <div className="bg-gradient-to-br from-yellow-100 via-amber-100 to-orange-100 rounded-xl shadow-2xl p-8 border-4 border-yellow-400 text-center">
            <div className="text-6xl mb-4 animate-bounce">🏆</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">{t.battlelearn.victory}</h2>
            <p className="text-lg text-gray-600">{t.battlelearn.allShipsSunk || 'All ships have been destroyed!'}</p>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mb-4 w-full max-w-2xl">
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-lg p-3 text-center">
          <p className="text-sm font-medium text-gray-700">
            {t.battlelearn.instructions}
          </p>
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
      {!localProblem.gameWon && gamePhase === 'answering' && (
        <div className="w-full max-w-2xl animate-in slide-in-from-bottom duration-300">
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl shadow-lg p-6 border-2 border-orange-300">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-orange-600" />
              <h3 className="text-lg font-bold text-gray-800">
                {t.battlelearn.answerToContinue}
              </h3>
            </div>
            
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
          </div>
        </div>
      )}
    </div>
  );
};
