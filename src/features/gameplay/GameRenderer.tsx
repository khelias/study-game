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
}

export const GameRenderer: React.FC<GameRendererProps> = ({ 
  gameType, 
  problem, 
  onAnswer, 
  onMove, 
  soundEnabled, 
  level 
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
  // Use key prop to force remount when problem changes (critical for word_cascade)
  const Component = gameEntry.component;
  const problemKey = problem.type === 'word_cascade' 
    ? `${problem.uid}-${problem.target}` 
    : problem.uid;
  
  return (
    <Component
      key={problemKey}
      problem={problem}
      onAnswer={onAnswer}
      onMove={onMove}
      soundEnabled={soundEnabled}
      level={level}
      gameType={gameType}
    />
  );
};
