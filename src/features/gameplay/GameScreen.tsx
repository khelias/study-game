/**
 * GameScreen Component (Refactored)
 * 
 * Main game screen component. Orchestrates game play, UI, and state management.
 * This refactored version uses extracted hooks and components for better scalability.
 */

import React, { useEffect, useRef, useState } from 'react';
import { Loader2, Trophy, TrendingUp } from 'lucide-react';
import { useGameStore } from '../../stores/gameStore';
import { usePlaySessionStore } from '../../stores/playSessionStore';
import { useGameEngine } from '../../hooks/useGameEngine';
import { useGameAudio } from '../../hooks/useGameAudio';
import { useAnswerHandler } from '../../hooks/useAnswerHandler';
import { useGameHints } from '../../hooks/useGameHints';
import { useGameTips } from '../../hooks/useGameTips';
import { GameRenderer } from './GameRenderer';
import { Confetti } from '../../components/shared/Confetti';
import { NotificationSystem } from '../../components/NotificationSystem';
import { HintButton } from '../../components/HintButton';
import { TipButton } from '../../components/TipButton';
import { EnhancedConfetti } from '../../components/EnhancedAnimations';
import { ParticleEffect } from '../../components/ParticleEffect';
import { GameHeader } from '../../components/GameHeader';
import { SettingsMenu } from '../../components/SettingsMenu';
import { StatsModal } from '../modals/StatsModal';
import { AchievementsModal } from '../modals/AchievementsModal';
import { ShopModal } from '../modals/ShopModal';
import { LevelSelectorModal } from '../modals/LevelSelectorModal';
import { moveMathSnake } from '../../engine/mathSnake';
import { calculateLevelUpRequirement } from '../../engine/progression';
import { ACHIEVEMENTS } from '../../engine/achievements';
import { getAchievementCopy } from '../../utils/achievementCopy';
import { useTranslation } from '../../i18n/useTranslation';
import type { Direction, ProfileType } from '../../types/game';
import type { AchievementUnlock } from '../../types/achievement';

export const GameScreen: React.FC = () => {
  // Global state
  const profile = useGameStore(state => state.profile);
  const profileId = profile as ProfileType;
  const levels = useGameStore(state => state.levels);
  const soundEnabled = useGameStore(state => state.soundEnabled);
  const toggleSound = useGameStore(state => state.toggleSound);
  const recordLevelUp = useGameStore(state => state.recordLevelUp);
  const setLevel = useGameStore(state => state.setLevel);
  const addGlobalScore = useGameStore(state => state.addScore);
  const updateStats = useGameStore(state => state.updateStats);
  const updateHighScore = useGameStore(state => state.updateHighScore);

  // Session state
  const gameType = usePlaySessionStore(state => state.gameType);
  const problem = usePlaySessionStore(state => state.problem);
  const stars = useGameStore(state => state.stars); // Persistent currency (for display in menu)
  const hearts = useGameStore(state => state.hearts); // Persistent global resource
  const score = usePlaySessionStore(state => state.score);
  const levelProgress = usePlaySessionStore(state => state.levelProgress);
  const bgClass = usePlaySessionStore(state => state.bgClass);
  const confetti = usePlaySessionStore(state => state.confetti);
  const enhancedConfetti = usePlaySessionStore(state => state.enhancedConfetti);
  const particleActive = usePlaySessionStore(state => state.particleActive);
  const showHint = usePlaySessionStore(state => state.showHint);
  const adaptiveDifficulty = usePlaySessionStore(state => state.adaptiveDifficulty);
  const gameStartTime = usePlaySessionStore(state => state.gameStartTime);
  const notifications = usePlaySessionStore(state => state.notifications);

  // Session actions
  const setProblem = usePlaySessionStore(state => state.setProblem);
  const returnToMenu = usePlaySessionStore(state => state.returnToMenu);
  const setBgClass = usePlaySessionStore(state => state.setBgClass);
  const setConfetti = usePlaySessionStore(state => state.setConfetti);
  const setEnhancedConfetti = usePlaySessionStore(state => state.setEnhancedConfetti);
  // Stars are now persistent (gameStore.stars), no reset needed
  const endGame = usePlaySessionStore(state => state.endGame);
  const addScore = usePlaySessionStore(state => state.addScore);
  const addNotification = usePlaySessionStore(state => state.addNotification);
  const removeNotification = usePlaySessionStore(state => state.removeNotification);
  const clearNotifications = usePlaySessionStore(state => state.clearNotifications);

  // Hooks
  const { generateUniqueProblemForGame, getRng } = useGameEngine();
  const { playClick } = useGameAudio(soundEnabled);
  const { handleAnswer: handleAnswerBase } = useAnswerHandler();
  
  // Wrap handleAnswer to check achievement state
  const handleAnswer = (isCorrect: boolean) => {
    handleAnswerBase(isCorrect, () => !achievementShown);
  };
  const { showHint: showHintForProblem } = useGameHints(addNotification, setBgClass);
  
  const [isCompactLayout, setIsCompactLayout] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [showLevelSelector, setShowLevelSelector] = useState(false);
  const settingsMenuRef = useRef<HTMLDivElement>(null);
  
  // Get stats and achievements for modals
  const stats = useGameStore(state => state.stats);
  const unlockedAchievementIds = useGameStore(state => state.unlockedAchievements);
  const t = useTranslation();

  // Convert achievement IDs to AchievementUnlock objects
  const unlockedAchievements: AchievementUnlock[] = unlockedAchievementIds
    .map(id => {
      const achievement = ACHIEVEMENTS[id];
      if (!achievement) return null;
      const copy = getAchievementCopy(t, achievement.id);
      return {
        id: achievement.id,
        title: copy.title,
        desc: copy.desc,
        icon: achievement.icon,
      };
    })
    .filter((a): a is AchievementUnlock => a !== null);

  // Track achievement notifications - compute directly from notifications
  const achievementShown = notifications.some(n => n.type === 'achievement');

  // Use tips hook
  const { handleTipReplay, canReopenTip } = useGameTips(
    gameType,
    problem,
    notifications,
    addNotification,
    isCompactLayout
  );

  // Settings menu click outside handler
  useEffect(() => {
    if (!showSettingsMenu) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (settingsMenuRef.current && !settingsMenuRef.current.contains(event.target as Node)) {
        setShowSettingsMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSettingsMenu]);

  // Responsive layout detection
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const media = window.matchMedia('(max-width: 639px)');
    const update = (): void => setIsCompactLayout(media.matches);
    update();
    if (typeof media.addEventListener === 'function') {
      media.addEventListener('change', update);
      return () => media.removeEventListener('change', update);
    }
    media.addListener(update);
    return () => media.removeListener(update);
  }, []);

  // Generate initial problem on mount
  useEffect(() => {
    if (gameType && !problem) {
      const currentLevel = levels[profile]?.[gameType] || 1;
      const newProblem = generateUniqueProblemForGame(gameType, currentLevel, profile, adaptiveDifficulty);
      setProblem(newProblem);
    }
  }, [gameType, problem, levels, profile, adaptiveDifficulty, generateUniqueProblemForGame, setProblem]);
  
  // Reset level progress when level changes (e.g., from menu or manual level-up)
  const resetLevelProgress = usePlaySessionStore(state => state.resetLevelProgress);
  useEffect(() => {
    if (gameType) {
      // Ensure level progress is initialized when game starts or level changes
      // Level progress is initialized in startGame, but reset if level changes externally
      resetLevelProgress();
    }
  }, [gameType, levels, profile, resetLevelProgress]);

  // Handle next level (legacy - now handled automatically in Phase 3)
  // This is kept for backward compatibility with level-up modal
  const handleNextLevel = () => {
    if (!gameType) return;

    clearNotifications();
    setConfetti(false);
    // Stars are now persistent (gameStore.stars), no reset needed
    // Level progress is reset automatically when level-up happens

    const newLevel = (levels[profile]?.[gameType] || 1) + 1;
    // Note: recordLevelUp is now called automatically in useAnswerHandler when level-up occurs
    // This is only for manual level-up (if needed)
    const { newAchievements } = recordLevelUp(gameType, newLevel);

    if (newAchievements.length > 0) {
      const achievement = newAchievements[0];
      if (achievement) {
        addNotification({
          type: 'achievement',
          achievement: achievement,
        });
      }
    }

    const baseType = gameType.replace('_adv', '');
    const isMathSnake = baseType === 'math_snake';

    setTimeout(() => {
      if (!isMathSnake) {
        const newProblem = generateUniqueProblemForGame(gameType, newLevel, profile, adaptiveDifficulty);
        setProblem(newProblem);
      }
      setBgClass('bg-slate-50');
    }, 100);
  };

  // Handle math snake movement
  const handleMathSnakeMove = (direction: Direction) => {
    if (!gameType || !problem || problem.type !== 'math_snake') return;
    const baseType = gameType.replace('_adv', '');
    if (baseType !== 'math_snake') return;
    if (problem.math) return;
    const currentLevel = levels[profile]?.[gameType] || 1;
    const rng = getRng();

    const wasEatingNormalApple = problem.apple?.kind === 'normal';

    const result = moveMathSnake(problem, direction, currentLevel, rng, profileId);
    if (result.collision) {
      const finalSnakeLength = problem.snake.length;
      updateStats(stats => ({
        ...stats,
        maxSnakeLength: Math.max(stats.maxSnakeLength || 0, finalSnakeLength),
      }));
      
      // High score is already updated on each score increase, no need to update here
      endGame();
      if (gameStartTime) {
        const playTime = Math.floor((Date.now() - gameStartTime) / 1000);
        updateStats(stats => ({
          ...stats,
          totalTimePlayed: stats.totalTimePlayed + playTime,
        }));
      }
      return;
    }

    const currentSnakeLength = result.problem.snake.length;
    updateStats(stats => ({
      ...stats,
      maxSnakeLength: Math.max(stats.maxSnakeLength || 0, currentSnakeLength),
    }));

    if (wasEatingNormalApple && !result.problem.math) {
      const applePoints = 5;
      addScore(applePoints);
      addGlobalScore(applePoints);
      
      // Update high score after adding apple points
      const newScore = score + applePoints;
      updateHighScore(gameType, newScore);
    }

    setProblem(result.problem);
  };

  // Handle hint button click
  const handleHint = () => {
    if (!problem) return;
    showHintForProblem(problem);
  };

  // Handle notification dismissal
  const handleNotificationDismiss = (id: string) => {
    const notification = notifications.find(n => n.id === id);
    removeNotification(id);

    if (notification?.type === 'levelUp') {
      handleNextLevel();
    }
  };

  if (!gameType) {
    return null;
  }

  const currentLevel = levels[profile]?.[gameType] ?? 1;
  const baseType = gameType.replace('_adv', '');
  const isMathSnake = baseType === 'math_snake';

  return (
    <div className={`min-h-screen font-sans flex flex-col ${bgClass} transition-colors duration-500 select-none overflow-hidden`}>
      {confetti && <Confetti />}
      {enhancedConfetti && <EnhancedConfetti active={enhancedConfetti} onComplete={() => setEnhancedConfetti(false)} />}
      <ParticleEffect type="success" active={particleActive} />

      <NotificationSystem notifications={notifications} onDismiss={handleNotificationDismiss} />

      <GameHeader
        score={score}
        stars={stars}
        hearts={hearts}
        levelProgress={levelProgress}
        levelUpRequirement={calculateLevelUpRequirement(currentLevel)}
        particleActive={particleActive}
        onReturnToMenu={() => {
          playClick();
          // High score is already updated on each score increase
          returnToMenu();
        }}
        onSettingsClick={() => {
          setShowSettingsMenu(!showSettingsMenu);
          playClick();
        }}
        onShopClick={() => {
          setShowShop(true);
          playClick();
        }}
        showSettingsMenu={showSettingsMenu}
        settingsMenuRef={settingsMenuRef as React.RefObject<HTMLDivElement>}
      >
        <SettingsMenu
          soundEnabled={soundEnabled}
          onToggleSound={() => {
            playClick();
            toggleSound();
          }}
          onReturnToMenu={() => {
            playClick();
            // High score is already updated on each score increase
            returnToMenu();
          }}
          onClose={() => setShowSettingsMenu(false)}
          onShowAchievements={() => setShowAchievements(true)}
          onShowStats={() => setShowStats(true)}
          onShowShop={() => setShowShop(true)}
          unlockedAchievements={unlockedAchievements}
          isGameScreen={true}
        />
      </GameHeader>

      <div className="flex-1 flex flex-col items-center p-4 max-w-2xl mx-auto w-full relative pt-14 sm:pt-16">
        {/* Level Badge - floating in top left of game area, clickable */}
        <div
          onClick={() => setShowLevelSelector(true)}
          className="absolute top-2 left-2 sm:top-4 sm:left-4 z-30 flex items-center gap-1.5 bg-purple-50 border-purple-200 rounded-lg shadow-md hover:bg-purple-100 hover:border-purple-300 transition-colors cursor-pointer"
          style={{ 
            padding: '0.375rem 0.625rem',
            boxSizing: 'border-box',
            border: '1px solid',
            borderColor: 'rgb(233, 213, 255)',
            width: 'fit-content',
            height: 'fit-content'
          }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setShowLevelSelector(true);
            }
          }}
          aria-label="Change level"
        >
          <TrendingUp size={14} className="text-purple-600 w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
          <span className="text-xs sm:text-sm font-bold text-purple-700 whitespace-nowrap">{currentLevel}</span>
        </div>
        
        {/* Session Score Badge - floating in top right of game area */}
        <div 
          className="absolute top-2 right-2 sm:top-4 sm:right-4 z-30 flex items-center gap-1.5 bg-blue-50 border-blue-200 rounded-lg shadow-md"
          style={{ 
            padding: '0.375rem 0.625rem',
            boxSizing: 'border-box',
            border: '1px solid',
            borderColor: 'rgb(191, 219, 254)',
            width: 'fit-content',
            height: 'fit-content'
          }}
        >
          <Trophy size={14} className="text-blue-600 w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
          <span className="text-xs sm:text-sm font-bold text-blue-700 whitespace-nowrap">{score}</span>
        </div>
        
        {!problem ? (
          <Loader2 className="animate-spin mt-20 text-slate-400" size={48} />
        ) : (
          <div key={problem.uid} className="w-full flex justify-center pb-8">
            <GameRenderer
              gameType={gameType}
              problem={problem}
              onAnswer={handleAnswer}
              onMove={isMathSnake ? handleMathSnakeMove : undefined}
              soundEnabled={soundEnabled}
              level={currentLevel}
            />

            {showHint && <HintButton onHint={handleHint} soundEnabled={soundEnabled} disabled={false} />}

            <TipButton onTip={handleTipReplay} soundEnabled={soundEnabled} disabled={!canReopenTip} />
          </div>
        )}
      </div>

      {/* Modals */}
      {showStats && (
        <StatsModal
          stats={stats}
          unlockedAchievements={unlockedAchievements}
          onClose={() => setShowStats(false)}
        />
      )}
      {showAchievements && (
        <AchievementsModal
          unlockedAchievements={unlockedAchievementIds}
          onClose={() => setShowAchievements(false)}
        />
      )}
      {showShop && (
        <ShopModal
          onClose={() => setShowShop(false)}
          openedFromNoHearts={hearts <= 0}
        />
      )}
      {showLevelSelector && gameType && (
        <LevelSelectorModal
          currentLevel={currentLevel}
          gameType={gameType}
          onClose={() => setShowLevelSelector(false)}
          onLevelChange={(newLevel) => {
            setLevel(gameType, newLevel);
            // Reset level progress and regenerate problem for new level
            resetLevelProgress();
            const newProblem = generateUniqueProblemForGame(gameType, newLevel, profileId, adaptiveDifficulty);
            setProblem(newProblem);
            setShowLevelSelector(false);
          }}
        />
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        @keyframes pulse-slow { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }
        .animate-pulse-slow { animation: pulse-slow 2s infinite ease-in-out; }
        .animate-bounce-short { animation: bounce-short 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55); }
        @keyframes bounce-short {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-15px) scale(1.05); }
        }
        @keyframes star-collect {
          0% { transform: scale(0) rotate(0deg); opacity: 0; }
          50% { transform: scale(1.2) rotate(180deg); opacity: 1; }
          100% { transform: scale(1) rotate(360deg); opacity: 1; }
        }
        .animate-star-collect { animation: star-collect 0.5s ease-out; }
      `}</style>
    </div>
  );
};
