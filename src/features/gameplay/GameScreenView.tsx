import React from 'react';
import { Loader2 } from 'lucide-react';
import { Confetti } from '../../components/shared/Confetti';
import { NotificationSystem } from '../../components/NotificationSystem';
import { TipButton } from '../../components/TipButton';
import { EnhancedConfetti } from '../../components/EnhancedAnimations';
import { ParticleEffect } from '../../components/ParticleEffect';
import { GameHeader } from '../../components/GameHeader';
import { GameRenderer } from './GameRenderer';
import type { Direction, Problem } from '../../types/game';
import type { Notification } from '../../types/notification';

interface GameScreenViewProps {
  // Background / overlay effects
  bgClass: string;
  confetti: boolean;
  enhancedConfetti: boolean;
  particleActive: boolean;
  onEnhancedConfettiComplete: () => void;

  // Notifications
  notifications: Notification[];
  onNotificationDismiss: (id: string) => void;

  // Header
  score: number;
  stars: number;
  hearts: number;
  levelProgress: { correctAnswers: number; totalAnswers: number } | null;
  levelUpRequirement: number;
  showLevelProgress: boolean;
  showSettingsMenu: boolean;
  settingsMenuRef: React.RefObject<HTMLDivElement>;
  settingsMenuSlot: React.ReactNode;
  onReturnToMenu: () => void;
  onSettingsClick: () => void;
  onShopClick: () => void;

  // HUD actions
  currentLevel: number;
  gameType: string;
  onLevelBadgeClick: () => void;
  onGameNameClick: () => void;

  // Game area
  problem: Problem | null;
  soundEnabled: boolean;
  spendStars: (amount: number) => boolean;
  spendHeart: () => boolean;
  endGame: () => void;
  onAnswer: (
    isCorrect: boolean,
    shouldShowAchievement?: () => boolean,
    options?: { skipHeartDeduction?: boolean },
  ) => void;
  onMove: ((direction: Direction) => void) | undefined;

  // Tip
  onTipReplay: () => void;
  canReopenTip: boolean;
}

export const GameScreenView: React.FC<GameScreenViewProps> = ({
  bgClass,
  confetti,
  enhancedConfetti,
  particleActive,
  onEnhancedConfettiComplete,
  notifications,
  onNotificationDismiss,
  score,
  stars,
  hearts,
  levelProgress,
  levelUpRequirement,
  showLevelProgress,
  showSettingsMenu,
  settingsMenuRef,
  settingsMenuSlot,
  onReturnToMenu,
  onSettingsClick,
  onShopClick,
  currentLevel,
  gameType,
  onLevelBadgeClick,
  onGameNameClick,
  problem,
  soundEnabled,
  spendStars,
  spendHeart,
  endGame,
  onAnswer,
  onMove,
  onTipReplay,
  canReopenTip,
}) => {
  return (
    <div
      className={`flex h-full min-h-0 flex-col overflow-hidden font-sans ${bgClass} select-none transition-colors duration-500`}
    >
      {confetti && <Confetti />}
      {enhancedConfetti && (
        <EnhancedConfetti active={enhancedConfetti} onComplete={onEnhancedConfettiComplete} />
      )}
      <ParticleEffect type="success" active={particleActive} />

      <NotificationSystem notifications={notifications} onDismiss={onNotificationDismiss} />

      <GameHeader
        score={score}
        stars={stars}
        hearts={hearts}
        levelProgress={levelProgress}
        levelUpRequirement={levelUpRequirement}
        showLevelProgress={showLevelProgress}
        particleActive={particleActive}
        onReturnToMenu={onReturnToMenu}
        onSettingsClick={onSettingsClick}
        onShopClick={onShopClick}
        currentLevel={currentLevel}
        gameType={gameType}
        onLevelClick={onLevelBadgeClick}
        onGameNameClick={onGameNameClick}
        showSettingsMenu={showSettingsMenu}
        settingsMenuRef={settingsMenuRef}
      >
        {settingsMenuSlot}
      </GameHeader>

      <div className="flex-1 flex flex-col items-center p-4 max-w-2xl mx-auto w-full relative pt-3 sm:pt-4">
        {!problem ? (
          <Loader2 className="animate-spin mt-20 text-slate-400" size={48} />
        ) : (
          <div key={problem.uid} className="w-full flex justify-center pb-8">
            <GameRenderer
              key={`${problem.type}-${problem.uid}-${'target' in problem ? problem.target : ''}`}
              gameType={gameType}
              problem={problem}
              onAnswer={onAnswer}
              onMove={onMove}
              soundEnabled={soundEnabled}
              level={currentLevel}
              stars={stars}
              spendStars={spendStars}
              spendHeart={spendHeart}
              endGame={endGame}
            />

            <TipButton onTip={onTipReplay} soundEnabled={soundEnabled} disabled={!canReopenTip} />
          </div>
        )}
      </div>
    </div>
  );
};
