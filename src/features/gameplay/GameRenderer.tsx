import React from 'react';
import { gameRegistry } from '../../games/registry';
import type { Problem, Direction } from '../../types/game';
import { useTranslation } from '../../i18n/useTranslation';

// Import registrations to ensure games are registered
import '../../games/registrations';

interface GameRendererProps {
  gameType: string;
  problem: Problem;
  onAnswer: (isCorrect: boolean) => void;
  onMove?: (direction: Direction) => void;
  soundEnabled: boolean;
  level?: number;
  /** Passed to Shape Shift for star-based hints (outline / place one piece) */
  stars?: number;
  spendStars?: (count: number) => boolean;
}

export const GameRenderer: React.FC<GameRendererProps> = ({ 
  gameType, 
  problem, 
  onAnswer, 
  onMove, 
  soundEnabled, 
  level,
  stars,
  spendStars,
}) => {
  const t = useTranslation();
  
  // Handle advanced versions by removing '_adv' suffix
  const baseGameType = gameType.replace('_adv', '');
  
  // Get game from registry
  const gameEntry = gameRegistry.get(baseGameType);
  
  if (!gameEntry) {
    return (
      <div className="text-center p-8 text-red-600">
        {t.errors.unknownGameType}: "{gameType}"
      </div>
    );
  }
  
  // Render the game component
  const Component = gameEntry.component;
  return (
    <Component
      problem={problem}
      onAnswer={onAnswer}
      onMove={onMove}
      soundEnabled={soundEnabled}
      level={level}
      gameType={gameType}
      stars={stars}
      spendStars={spendStars}
    />
  );
};
