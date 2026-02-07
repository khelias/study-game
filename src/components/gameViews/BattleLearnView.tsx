/**
 * BattleLearnView Component (REDESIGNED)
 * 
 * Game view for BattleLearn games (Battleship-inspired educational game).
 * Players click grid cells to find and sink ships. On miss, answer a question to continue.
 * 
 * REDESIGN GOALS:
 * - Cleaner UI with less visual clutter
 * - Modal for problems (focuses attention, doesn't break flow)
 * - Simplified game stats (only essential info)
 * - Better feedback integration
 * - Generic victory screen (GameResultScreen)
 */

import React, { useState, useEffect } from 'react';
import { Target } from 'lucide-react';
import { playSound } from '../../engine/audio';
import { useTranslation } from '../../i18n/useTranslation';
import { applyShot, checkWinCondition, isShipSunk } from '../../engine/battlelearn';
import { usePlaySessionStore } from '../../stores/playSessionStore';
import type { BattleLearnProblem } from '../../types/game';
import { GameProblemModal } from '../shared/GameProblemModal';
import { GameStatsBar, type GameStat } from '../shared/GameStatsBar';
import { GameResultScreen } from '../../features/gameplay/GameResultScreen';

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
  const setProblem = usePlaySessionStore(state => state.setProblem);
  
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
  const [gamePhase, setGamePhase] = useState<'shooting' | 'answering'>('shooting');
  const [currentUid, setCurrentUid] = useState(problem.uid);

  // Only reset game state when it's a brand new game (different UID AND empty revealed array)
  // Update question when parent provides new question (after answering)
  // Sync board state from problem if it has been updated externally
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
      setGamePhase('shooting');
    } else {
      // Same game session, new question - update question and sync board state from problem
      setQuestion(problem.question);
      setCurrentUid(problem.uid);
      // Sync board state to ensure any external updates are reflected
      setGameState(prev => ({
        ...prev,
        revealed: problem.revealed,
        hits: problem.hits,
        sunkShips: problem.sunkShips,
        ships: problem.ships,
        gameWon: problem.gameWon,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [problem.uid]);

  const handleOptionSelect = (index: number) => {
    if (gamePhase !== 'answering' || gameState.gameWon) return;
    
    playSound('click', soundEnabled);
    setSelectedOption(index);
    
    const isCorrect = index === question.correctIndex;
    
    if (isCorrect) {
      // Show visual feedback (button color) then close modal
      setTimeout(() => {
        setGamePhase('shooting'); // Close modal
        setSelectedOption(null);
        onAnswer(true); // This triggers general feedback system
      }, 800); // Brief pause to see green button
    } else {
      // Show visual feedback (button color) then allow retry
      setTimeout(() => {
        setSelectedOption(null);
        onAnswer(false); // This triggers general feedback system
        // Stay in answering phase until correct
      }, 800);
    }
  };

  const handleCellClick = (row: number, col: number) => {
    if (gamePhase !== 'shooting' || gameState.gameWon) return;
    
    playSound('click', soundEnabled);
    
    // Apply shot
    const result = applyShot(gameState.ships, gameState.revealed, row, col);
    
    if (result.alreadyShot) {
      // Brief feedback for already shot - no modal needed
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
      } else {
        playSound('success', soundEnabled);
      }
      // Stay in shooting phase
    } else {
      // MISS: Must answer problem to continue
      playSound('wrong', soundEnabled);
      setGamePhase('answering'); // Switch to problem phase (opens modal)
    }
    
    // Update local state
    setGameState(prev => ({
      ...prev,
      revealed: newRevealed,
      hits: newHits,
      sunkShips: newSunkShips,
      gameWon,
    }));
    
    // CRITICAL: Also update the problem in the store so parent handlers have current state
    setProblem({
      ...problem,
      revealed: newRevealed,
      hits: newHits,
      sunkShips: newSunkShips,
      gameWon,
    });
    
    setSelectedOption(null);
    
    if (gameWon) {
      setTimeout(() => {
        playSound('success', soundEnabled);
      }, 500);
    }
  };

  const renderGrid = () => {
    const { gridSize } = gameState;
    const columnLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    
    // Get all positions of sunk ships for special rendering
    const sunkShipPositions = new Set<string>();
    gameState.ships.forEach(ship => {
      if (isShipSunk(ship)) {
        ship.positions.forEach(([r, c]) => {
          sunkShipPositions.add(`${r},${c}`);
        });
      }
    });
    
    return (
      <div className="flex gap-1">
        {/* Row numbers */}
        <div className="flex flex-col justify-between py-1">
          {/* Empty corner cell */}
          <div className="h-6 sm:h-7" />
          {Array.from({ length: gridSize }, (_, row) => (
            <div
              key={`row-${row}`}
              className="flex items-center justify-center text-xs sm:text-sm font-bold text-slate-600"
              style={{ height: `calc((100% - 1.75rem) / ${gridSize})` }}
            >
              {row + 1}
            </div>
          ))}
        </div>
        
        {/* Grid with column headers */}
        <div className="flex-1">
          {/* Column letters */}
          <div className="grid mb-1" style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}>
            {columnLabels.slice(0, gridSize).map((label) => (
              <div
                key={`col-${label}`}
                className="text-center text-xs sm:text-sm font-bold text-slate-600 h-6 sm:h-7 flex items-center justify-center"
              >
                {label}
              </div>
            ))}
          </div>
          
          {/* Game cells */}
          <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}>
            {Array.from({ length: gridSize }, (_, row) =>
              Array.from({ length: gridSize }, (_, col) => {
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
                
                return (
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
              })
            )}
          </div>
        </div>
      </div>
    );
  };

  // Prepare game stats - only essential info (ships remaining)
  const stats: GameStat[] = [
    {
      id: 'ships',
      icon: Target,
      label: t.battlelearn.shipsRemaining,
      value: `${gameState.ships.length - gameState.sunkShips.length}/${gameState.ships.length}`,
      variant: gameState.ships.length - gameState.sunkShips.length === 0 ? 'success' : 'default',
    },
  ];

  // Show victory screen if game is won
  if (gameState.gameWon) {
    return (
      <GameResultScreen
        type="victory"
        onContinue={() => onAnswer(true)}
        customMessage={t.battlelearn.allShipsSunk}
      />
    );
  }

  return (
    <div className="w-full flex flex-col items-center px-4 py-6 animate-in fade-in duration-300">
      {/* Game Stats Bar - Only essential info */}
      <div className="mb-4 w-full max-w-2xl">
        <GameStatsBar stats={stats} />
      </div>

      {/* Grid - Main focus with coordinates */}
      <div className="w-full max-w-2xl">
        <div className="shadow-lg rounded-lg p-3 sm:p-4 bg-gradient-to-br from-slate-100 to-slate-200">
          {renderGrid()}
        </div>
      </div>

      {/* Problem Modal - Only shown when answering */}
      <GameProblemModal
        isOpen={gamePhase === 'answering' && !gameState.gameWon}
        title={t.battlelearn.answerToContinue}
        prompt={question.prompt}
        options={question.options}
        correctIndex={question.correctIndex}
        selectedOption={selectedOption}
        onOptionSelect={handleOptionSelect}
        disabled={selectedOption !== null}
        icon={<Target className="text-orange-600" />}
      />
    </div>
  );
};
