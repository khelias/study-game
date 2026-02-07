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
  // Separate game state from question state
  const [gameState, setGameState] = useState({
    gridSize: problem.gridSize,
    ships: problem.ships,
    revealed: problem.revealed,
    hits: problem.hits,
    sunkShips: problem.sunkShips,
    gameWon: problem.gameWon,
  });
  const [question, setQuestion] = useState(problem.question);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string>('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [gamePhase, setGamePhase] = useState<'shooting' | 'answering'>('shooting');
  const [currentUid, setCurrentUid] = useState(problem.uid);

  // Only reset game state when it's a brand new game (different UID AND empty revealed array)
  // Update question when parent provides new question (after answering)
  useEffect(() => {
    const isNewGame = problem.uid !== currentUid && problem.revealed.length === 0;
    
    if (isNewGame) {
      // Complete reset for new game
      setGameState({
        gridSize: problem.gridSize,
        ships: problem.ships,
        revealed: problem.revealed,
        hits: problem.hits,
        sunkShips: problem.sunkShips,
        gameWon: problem.gameWon,
      });
      setQuestion(problem.question);
      setCurrentUid(problem.uid);
      setSelectedOption(null);
      setFeedback('');
      setShowFeedback(false);
      setGamePhase('shooting');
    } else {
      // Just update the question (same game session, new question after answering)
      setQuestion(problem.question);
      setCurrentUid(problem.uid);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [problem.uid]);

  const handleOptionSelect = (index: number) => {
    if (gamePhase !== 'answering' || gameState.gameWon) return;
    
    playSound('click', soundEnabled);
    setSelectedOption(index);
    
    const isCorrect = index === question.correctIndex;
    
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
    if (gamePhase !== 'shooting' || gameState.gameWon) return;
    
    playSound('click', soundEnabled);
    
    // Apply shot
    const result = applyShot(gameState.ships, gameState.revealed, row, col);
    
    if (result.alreadyShot) {
      setFeedback(t.battlelearn.alreadyShot);
      setShowFeedback(true);
      setTimeout(() => setShowFeedback(false), 1000);
      return;
    }
    
    // Update local state
    const newRevealed = [...gameState.revealed, [row, col] as [number, number]];
    const newHits = result.hit 
      ? [...gameState.hits, [row, col] as [number, number]] 
      : gameState.hits;
    const newSunkShips = result.sunkShipId 
      ? [...gameState.sunkShips, result.sunkShipId] 
      : gameState.sunkShips;
    
    const gameWon = checkWinCondition(gameState.ships);
    
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
    
    setGameState(prev => ({
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
    const { gridSize } = gameState;
    const cells = [];
    
    // Get all positions of sunk ships for special rendering
    const sunkShipPositions = new Set<string>();
    gameState.ships.forEach(ship => {
      if (isShipSunk(ship)) {
        ship.positions.forEach(([r, c]) => {
          sunkShipPositions.add(`${r},${c}`);
        });
      }
    });
    
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const posKey = `${row},${col}`;
        const isRevealed = gameState.revealed.some(([r, c]) => r === row && c === col);
        const isHit = gameState.hits.some(([r, c]) => r === row && c === col);
        const isSunkShipPosition = sunkShipPositions.has(posKey);
        
        let cellClass = 'w-full h-full border border-gray-300 rounded flex items-center justify-center text-2xl font-bold transition-all duration-200';
        let cellContent = '';
        
        // Sunk ship takes priority - show entire ship
        if (isSunkShipPosition) {
          cellClass += ' bg-gradient-to-br from-purple-600 to-red-800 shadow-xl text-white animate-pulse';
          cellContent = '☠️';
        } else if (!isRevealed) {
          cellClass += ' bg-gradient-to-br from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 shadow-md hover:shadow-xl cursor-pointer transform hover:-translate-y-0.5 transition-all';
          if (gamePhase === 'shooting' && !gameState.gameWon) {
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
              cursor: gamePhase === 'shooting' && !isSunkShipPosition && !isRevealed && !gameState.gameWon ? 'pointer' : 'default'
            }}
          >
            {cellContent}
          </div>
        );
      }
    }
    
    return cells;
  };

  const gridCols = `grid-cols-${gameState.gridSize}`;
  const gridClass = `grid gap-2 ${gridCols} max-w-2xl mx-auto shadow-lg rounded-lg p-2 bg-gradient-to-br from-slate-100 to-slate-200`;

  return (
    <div className="w-full flex flex-col items-center px-4 py-6 animate-in fade-in duration-300">
      {/* Game Status */}
      <div className="mb-4 text-center">
        <div className="flex items-center justify-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Target className="w-4 h-4" />
            <span>{t.battlelearn.shipsRemaining}: {gameState.ships.length - gameState.sunkShips.length}/{gameState.ships.length}</span>
          </div>
          {gamePhase === 'shooting' && !gameState.gameWon && (
            <div className="flex items-center gap-1 px-3 py-1 bg-green-100 border-2 border-green-500 rounded-full text-green-700 font-bold animate-pulse">
              <Target className="w-4 h-4" />
              <span>{t.battlelearn.shotReady}</span>
            </div>
          )}
          {gamePhase === 'answering' && !gameState.gameWon && (
            <div className="flex items-center gap-1 px-3 py-1 bg-orange-100 border-2 border-orange-500 rounded-full text-orange-700 font-bold">
              <span>❓ {t.battlelearn.answerToEarnShot}</span>
            </div>
          )}
          {gameState.gameWon && (
            <div className="flex items-center gap-1 px-4 py-2 bg-yellow-100 border-2 border-yellow-500 rounded-full text-yellow-700 font-bold animate-bounce">
              <Trophy className="w-5 h-5" />
              <span>{t.battlelearn.victory}</span>
            </div>
          )}
        </div>
      </div>

      {/* Victory Screen */}
      {gameState.gameWon && (
        <div className="mb-6 w-full max-w-2xl animate-in zoom-in duration-500">
          <div className="bg-gradient-to-br from-yellow-100 via-amber-100 to-orange-100 rounded-xl shadow-2xl p-8 border-4 border-yellow-400 text-center">
            <div className="text-6xl mb-4 animate-bounce">🏆</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">{t.battlelearn.victory}</h2>
            <p className="text-lg text-gray-600">{t.battlelearn.allShipsSunk}</p>
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
        <div className={gridClass} style={{ gridTemplateColumns: `repeat(${gameState.gridSize}, minmax(0, 1fr))` }}>
          {renderGrid()}
        </div>
      </div>

      {/* Question Card */}
      {!gameState.gameWon && gamePhase === 'answering' && (
        <div className="w-full max-w-2xl animate-in slide-in-from-bottom duration-300">
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl shadow-lg p-6 border-2 border-orange-300">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-orange-600" />
              <h3 className="text-lg font-bold text-gray-800">
                {t.battlelearn.answerToContinue}
              </h3>
            </div>
            
            <p className="text-xl font-medium mb-4 text-center text-gray-700">
              {question.prompt}
            </p>
            
            <div className="grid grid-cols-2 gap-3">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleOptionSelect(index)}
                  disabled={selectedOption !== null}
                  className={`px-6 py-4 rounded-lg font-bold text-lg transition-all duration-200 ${
                    selectedOption === index
                      ? index === question.correctIndex
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
