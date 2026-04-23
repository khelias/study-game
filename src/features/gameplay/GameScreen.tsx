/**
 * GameScreen Component (Refactored)
 *
 * Main game screen component. Orchestrates game play, UI, and state management.
 * This refactored version uses extracted hooks and components for better scalability.
 */

import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Trophy, TrendingUp } from 'lucide-react';
import { useGameStore } from '../../stores/gameStore';
import { usePlaySessionStore } from '../../stores/playSessionStore';
import { useGameEngine } from '../../hooks/useGameEngine';
import { useGameAudio } from '../../hooks/useGameAudio';
import { useAnswerHandler } from '../../hooks/useAnswerHandler';
import { useGameTips } from '../../hooks/useGameTips';
import { GameRenderer } from './GameRenderer';
import { Confetti } from '../../components/shared/Confetti';
import { NotificationSystem } from '../../components/NotificationSystem';
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
import { useProfileText } from '../../hooks/useProfileText';
import { GAME_CONFIG } from '../../games/data';
import { Z_INDEX } from '../../utils/zIndex';
import type { Direction, ProfileType } from '../../types/game';
import type { AchievementUnlock } from '../../types/achievement';

export const GameScreen: React.FC = () => {
  const navigate = useNavigate();
  const { formatText } = useProfileText();

  // Global state
  const profile = useGameStore((state) => state.profile);
  const profileId = profile as ProfileType;
  const levels = useGameStore((state) => state.levels);
  const soundEnabled = useGameStore((state) => state.soundEnabled);
  const toggleSound = useGameStore((state) => state.toggleSound);
  const setLevel = useGameStore((state) => state.setLevel);
  const addGlobalScore = useGameStore((state) => state.addScore);
  const updateStats = useGameStore((state) => state.updateStats);
  const updateHighScore = useGameStore((state) => state.updateHighScore);

  // Session state
  const gameType = usePlaySessionStore((state) => state.gameType);
  const problem = usePlaySessionStore((state) => state.problem);
  const stars = useGameStore((state) => state.stars); // Persistent currency (for display in menu)
  const spendStars = useGameStore((state) => state.spendStars); // For shape_shift star hints
  const spendHeart = useGameStore((state) => state.spendHeart);
  const hearts = useGameStore((state) => state.hearts); // Persistent global resource
  const score = usePlaySessionStore((state) => state.score);
  const levelProgress = usePlaySessionStore((state) => state.levelProgress);
  const bgClass = usePlaySessionStore((state) => state.bgClass);
  const confetti = usePlaySessionStore((state) => state.confetti);
  const enhancedConfetti = usePlaySessionStore((state) => state.enhancedConfetti);
  const particleActive = usePlaySessionStore((state) => state.particleActive);
  const adaptiveDifficulty = usePlaySessionStore((state) => state.adaptiveDifficulty);
  const gameStartTime = usePlaySessionStore((state) => state.gameStartTime);
  const notifications = usePlaySessionStore((state) => state.notifications);
  const autoShowGameDescription = usePlaySessionStore((state) => state.autoShowGameDescription);
  const setAutoShowGameDescription = usePlaySessionStore(
    (state) => state.setAutoShowGameDescription,
  );

  // Session actions
  const setProblem = usePlaySessionStore((state) => state.setProblem);
  const returnToMenu = usePlaySessionStore((state) => state.returnToMenu);
  const setEnhancedConfetti = usePlaySessionStore((state) => state.setEnhancedConfetti);
  // Stars are now persistent (gameStore.stars), no reset needed
  const endGame = usePlaySessionStore((state) => state.endGame);
  const addScore = usePlaySessionStore((state) => state.addScore);
  const addNotification = usePlaySessionStore((state) => state.addNotification);
  const removeNotification = usePlaySessionStore((state) => state.removeNotification);

  // Hooks
  const { generateUniqueProblemForGame, getRng } = useGameEngine();
  const { playClick } = useGameAudio(soundEnabled);
  const { handleAnswer: handleAnswerBase } = useAnswerHandler();

  // Wrap handleAnswer to check achievement state and pass through options (e.g. skipHeartDeduction)
  const handleAnswer = (
    isCorrect: boolean,
    shouldShowAchievement?: () => boolean,
    options?: { skipHeartDeduction?: boolean },
  ) => {
    handleAnswerBase(isCorrect, shouldShowAchievement ?? (() => !achievementShown), options);
  };

  const [isCompactLayout, setIsCompactLayout] = useState(false);
  const [showGameDescription, setShowGameDescription] = useState(false);
  const hasAutoShownDescriptionRef = useRef(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [showLevelSelector, setShowLevelSelector] = useState(false);
  const settingsMenuRef = useRef<HTMLDivElement>(null);

  // Get stats and achievements for modals
  const stats = useGameStore((state) => state.stats);
  const unlockedAchievementIds = useGameStore((state) => state.unlockedAchievements);
  const t = useTranslation();

  // Convert achievement IDs to AchievementUnlock objects
  const unlockedAchievements: AchievementUnlock[] = unlockedAchievementIds
    .map((id) => {
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
  const achievementShown = notifications.some((n) => n.type === 'achievement');

  // Use tips hook
  const { handleTipReplay, canReopenTip } = useGameTips(
    gameType,
    problem,
    notifications,
    addNotification,
    isCompactLayout,
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
      const newProblem = generateUniqueProblemForGame(
        gameType,
        currentLevel,
        profile,
        adaptiveDifficulty,
      );
      setProblem(newProblem);
    }
  }, [
    gameType,
    problem,
    levels,
    profile,
    adaptiveDifficulty,
    generateUniqueProblemForGame,
    setProblem,
  ]);

  // Reset level progress only on fresh start (no problem yet). Do not reset when resuming from game over.
  const resetLevelProgress = usePlaySessionStore((state) => state.resetLevelProgress);
  useEffect(() => {
    if (gameType && !problem) {
      resetLevelProgress();
    }
  }, [gameType, problem, resetLevelProgress]);

  // Auto-show game description when route set autoShowGameDescription (first time entering this game type).
  // Defer open to next frame so modal opens after first paint (fixes iOS). Do not cancel rAF in cleanup: clearing the flag re-runs this effect and would cancel the scheduled open.
  useEffect(() => {
    if (!gameType || !problem || !autoShowGameDescription || hasAutoShownDescriptionRef.current)
      return;
    hasAutoShownDescriptionRef.current = true;
    setAutoShowGameDescription(false);
    requestAnimationFrame(() => {
      setShowGameDescription(true);
    });
  }, [gameType, problem, autoShowGameDescription, setAutoShowGameDescription]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showGameDescription) {
        playClick();
        setShowGameDescription(false);
      }
    };
    if (showGameDescription) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
    return undefined;
  }, [showGameDescription, playClick]);

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
      updateStats((stats) => ({
        ...stats,
        maxSnakeLength: Math.max(stats.maxSnakeLength || 0, finalSnakeLength),
      }));

      // High score is already updated on each score increase, no need to update here
      endGame();
      if (gameStartTime) {
        const playTime = Math.floor((Date.now() - gameStartTime) / 1000);
        updateStats((stats) => ({
          ...stats,
          totalTimePlayed: stats.totalTimePlayed + playTime,
        }));
      }
      return;
    }

    const currentSnakeLength = result.problem.snake.length;
    updateStats((stats) => ({
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

  // Handle notification dismissal
  const handleNotificationDismiss = (id: string) => {
    const notification = notifications.find((n) => n.id === id);
    removeNotification(id);

    // Level-up: next problem and level record are already handled by levelUpOnDismiss in useAnswerHandler.
    // Do not call handleNextLevel() here or we would set the problem twice and double-record level up.
    if (notification?.type === 'levelUp') {
      return;
    }
  };

  if (!gameType) {
    return null;
  }

  const currentLevel = levels[profile]?.[gameType] ?? 1;
  const baseType = gameType.replace('_adv', '');
  const isMathSnake = baseType === 'math_snake';

  return (
    <div
      className={`min-h-screen font-sans flex flex-col ${bgClass} transition-colors duration-500 select-none overflow-hidden`}
    >
      {confetti && <Confetti />}
      {enhancedConfetti && (
        <EnhancedConfetti active={enhancedConfetti} onComplete={() => setEnhancedConfetti(false)} />
      )}
      <ParticleEffect type="success" active={particleActive} />

      <NotificationSystem notifications={notifications} onDismiss={handleNotificationDismiss} />

      <GameHeader
        score={score}
        stars={stars}
        hearts={hearts}
        levelProgress={levelProgress}
        levelUpRequirement={calculateLevelUpRequirement(currentLevel)}
        showLevelProgress={GAME_CONFIG[gameType]?.levelUpStrategy !== 'onGameWin'}
        particleActive={particleActive}
        onReturnToMenu={() => {
          playClick();
          void navigate('/', { replace: true });
          void returnToMenu();
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
            void navigate('/', { replace: true });
            void returnToMenu();
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
            height: 'fit-content',
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
          <TrendingUp
            size={14}
            className="text-purple-600 w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0"
          />
          <span className="text-xs sm:text-sm font-bold text-purple-700 whitespace-nowrap">
            {currentLevel}
          </span>
        </div>

        {/* Game Name Badge - clickable, opens game description */}
        {gameType &&
          (() => {
            const baseType = gameType.replace('_adv', '');
            const gameConfig = GAME_CONFIG[baseType];
            const gameEmoji = gameConfig?.emoji ?? '🎮';
            const gameTitleStr: string = (
              gameConfig && t.games[baseType as keyof typeof t.games]
                ? t.games[baseType as keyof typeof t.games].title
                : gameType.toUpperCase()
            );
            const gameName = formatText(gameTitleStr);
            return (
              <button
                type="button"
                onClick={() => {
                  playClick();
                  setShowGameDescription(true);
                }}
                className="absolute top-2 left-1/2 transform -translate-x-1/2 sm:top-4 z-30 flex items-center gap-1.5 bg-slate-50 border-slate-200 rounded-lg shadow-md cursor-pointer hover:bg-slate-100 active:scale-[0.98] transition-colors"
                style={{
                  padding: '0.375rem 0.75rem',
                  boxSizing: 'border-box',
                  border: '1px solid',
                  borderColor: 'rgb(226, 232, 240)',
                  width: 'fit-content',
                  height: 'fit-content',
                  maxWidth: '60vw',
                }}
                aria-label={formatText(t.gameScreen.gameDescriptionTitle)}
              >
                <span className="text-base sm:text-lg flex-shrink-0">{gameEmoji}</span>
                <span className="text-xs sm:text-sm font-bold text-slate-700 whitespace-nowrap truncate">
                  {gameName}
                </span>
              </button>
            );
          })()}

        {/* Session Score Badge - floating in top right of game area */}
        <div
          className="absolute top-2 right-2 sm:top-4 sm:right-4 z-30 flex items-center gap-1.5 bg-blue-50 border-blue-200 rounded-lg shadow-md"
          style={{
            padding: '0.375rem 0.625rem',
            boxSizing: 'border-box',
            border: '1px solid',
            borderColor: 'rgb(191, 219, 254)',
            width: 'fit-content',
            height: 'fit-content',
          }}
        >
          <Trophy size={14} className="text-blue-600 w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
          <span className="text-xs sm:text-sm font-bold text-blue-700 whitespace-nowrap">
            {score}
          </span>
        </div>

        {!problem ? (
          <Loader2 className="animate-spin mt-20 text-slate-400" size={48} />
        ) : (
          <div key={problem.uid} className="w-full flex justify-center pb-8">
            <GameRenderer
              key={
                problem
                  ? `${problem.type}-${problem.uid}-${'target' in problem ? problem.target : ''}`
                  : 'no-problem'
              }
              gameType={gameType}
              problem={problem}
              onAnswer={handleAnswer}
              onMove={isMathSnake ? handleMathSnakeMove : undefined}
              soundEnabled={soundEnabled}
              level={currentLevel}
              stars={stars}
              spendStars={spendStars}
              spendHeart={spendHeart}
              endGame={endGame}
            />

            <TipButton
              onTip={handleTipReplay}
              soundEnabled={soundEnabled}
              disabled={!canReopenTip}
            />
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
        <ShopModal onClose={() => setShowShop(false)} openedFromNoHearts={hearts <= 0} />
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
            const newProblem = generateUniqueProblemForGame(
              gameType,
              newLevel,
              profileId,
              adaptiveDifficulty,
            );
            setProblem(newProblem);
            setShowLevelSelector(false);
          }}
        />
      )}

      {/* Game description modal (how to play) */}
      {showGameDescription &&
        gameType &&
        (() => {
          const baseType = gameType.replace('_adv', '');
          const gameConfig = GAME_CONFIG[baseType];
          const gameEmoji = gameConfig?.emoji ?? '🎮';
          const gameTitleStr: string = (
            gameConfig && t.games[baseType as keyof typeof t.games]
              ? t.games[baseType as keyof typeof t.games].title
              : gameType.toUpperCase()
          );
          const gameName = formatText(gameTitleStr);
          const gameDesc = (
            t.games[baseType as keyof typeof t.games] as { gameDescription?: string }
          )?.gameDescription;
          const tips = (t.gameScreen.tips as unknown as Record<string, string[] | undefined>)[
            baseType
          ];
          const tipsList = Array.isArray(tips) ? tips : [];
          return (
            <div
              className="fixed inset-0 flex items-center justify-center p-4 animate-in fade-in duration-200"
              style={{ zIndex: Z_INDEX.MODALS, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  playClick();
                  setShowGameDescription(false);
                }
              }}
            >
              <div
                className="bg-gradient-to-br from-slate-50 via-white to-slate-50 rounded-2xl shadow-2xl border-2 border-slate-200 w-full max-w-md animate-in zoom-in duration-300 p-5 sm:p-6 max-h-[85vh] overflow-y-auto"
                role="dialog"
                aria-modal="true"
                aria-labelledby="game-description-title"
              >
                <h2
                  id="game-description-title"
                  className="text-lg sm:text-xl font-black text-slate-800 mb-2 flex items-center gap-2"
                >
                  <span>{gameEmoji}</span>
                  {gameName}
                </h2>
                <p className="text-sm text-slate-700 mb-4 whitespace-pre-wrap">
                  {gameDesc ? formatText(gameDesc) : ''}
                </p>
                {tipsList.length > 0 && (
                  <>
                    <h3 className="text-sm font-bold text-slate-700 mb-2">
                      {formatText(t.gameScreen.tipsLabel)}
                    </h3>
                    <ul className="list-disc list-inside text-sm text-slate-600 space-y-1 mb-4">
                      {tipsList.map((tip, i) => (
                        <li key={i}>{formatText(tip)}</li>
                      ))}
                    </ul>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => {
                    playClick();
                    setShowGameDescription(false);
                  }}
                  className="w-full py-2.5 rounded-xl font-bold border-2 border-slate-600 bg-slate-600 text-white hover:bg-slate-700 transition-colors"
                  aria-label={formatText(t.common.close)}
                >
                  {formatText(t.common.close)}
                </button>
              </div>
            </div>
          );
        })()}

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
