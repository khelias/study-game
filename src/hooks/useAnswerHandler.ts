/**
 * useAnswerHandler Hook
 * 
 * Encapsulates answer handling logic for games.
 * Coordinates between engine logic and UI state updates.
 */

import { useCallback } from 'react';
import { useGameStore } from '../stores/gameStore';
import { usePlaySessionStore } from '../stores/playSessionStore';
import { useGameEngine } from './useGameEngine';
import { useGameAudio } from './useGameAudio';
import { useProfileText } from './useProfileText';
import { processAnswer } from '../engine/answerHandler';
import { getRandomEncouragement } from '../components/FeedbackSystem';
import { GAME_CONFIG } from '../games/data';
import { useTranslation } from '../i18n/useTranslation';
import { 
  checkLevelUp, 
  calculateStarReward
} from '../engine/progression';
import { generateBattleLearnQuestion } from '../games/generators';
import type { BattleLearnProblem } from '../types/game';

export interface UseAnswerHandlerResult {
  handleAnswer: (isCorrect: boolean, shouldShowAchievement?: () => boolean) => void;
}

export function useAnswerHandler(): UseAnswerHandlerResult {
  const t = useTranslation();
  const { formatText } = useProfileText();
  const { getRng, generateUniqueProblemForGame } = useGameEngine();
  const { playWin } = useGameAudio(useGameStore(state => state.soundEnabled));

  // Global state
  const profile = useGameStore(state => state.profile);
  const levels = useGameStore(state => state.levels);
  const recordAnswer = useGameStore(state => state.recordAnswer);
  const earnStars = useGameStore(state => state.earnStars);
  const addGlobalScore = useGameStore(state => state.addScore);
  const updateStats = useGameStore(state => state.updateStats);
  const spendHeart = useGameStore(state => state.spendHeart);
  const recordLevelUp = useGameStore(state => state.recordLevelUp);
  const updateHighScore = useGameStore(state => state.updateHighScore);

  // Session state
  const gameType = usePlaySessionStore(state => state.gameType);
  const problem = usePlaySessionStore(state => state.problem);
  const levelProgress = usePlaySessionStore(state => state.levelProgress);
  const recordLevelAnswer = usePlaySessionStore(state => state.recordLevelAnswer);
  const resetLevelProgress = usePlaySessionStore(state => state.resetLevelProgress);
  const currentStreak = usePlaySessionStore(state => state.currentStreak);
  const adaptiveDifficulty = usePlaySessionStore(state => state.adaptiveDifficulty);
  const gameStartTime = usePlaySessionStore(state => state.gameStartTime);

  // Session actions
  const setProblem = usePlaySessionStore(state => state.setProblem);
  const setBgClass = usePlaySessionStore(state => state.setBgClass);
  const setConfetti = usePlaySessionStore(state => state.setConfetti);
  const setEnhancedConfetti = usePlaySessionStore(state => state.setEnhancedConfetti);
  const setParticleActive = usePlaySessionStore(state => state.setParticleActive);
  const setShowHint = usePlaySessionStore(state => state.setShowHint);
  const addScore = usePlaySessionStore(state => state.addScore);
  const endGame = usePlaySessionStore(state => state.endGame);
  const updateAdaptiveDifficulty = usePlaySessionStore(state => state.updateAdaptiveDifficulty);
  const submitAnswer = usePlaySessionStore(state => state.submitAnswer);
  const addNotification = usePlaySessionStore(state => state.addNotification);
  const score = usePlaySessionStore(state => state.score);

  const handleAnswer = useCallback((isCorrect: boolean, shouldShowAchievement: () => boolean = () => true) => {
    if (!gameType || !problem) return;

    const answerStartTime = Date.now();
    const points = isCorrect ? 10 : 0;
    const baseGameType = gameType.replace('_adv', '');

    // Update adaptive difficulty
    const responseTime = Date.now() - answerStartTime;
    updateAdaptiveDifficulty(isCorrect, responseTime);

    // Update streak
    submitAnswer(isCorrect);
    const newStreak = isCorrect ? currentStreak + 1 : 0;

    // Collect achievements
    const { newAchievements: answerAchievements } = recordAnswer(isCorrect, points);

    // Track level progress (for automatic level-up)
    recordLevelAnswer(isCorrect);

    // Process answer using engine logic
    const rng = getRng();
    const result = processAnswer({
      isCorrect,
      problem,
      gameType,
      currentStreak: newStreak,
      // currentStars removed - stars are persistent currency, not used for level-up
      // currentHearts removed - hearts are persistent global resource in gameStore
      rng,
    });

    // Handle achievements - collect all achievements
    let allNewAchievements = [...answerAchievements];
    
    // Check for level completion and level-up (Phase 3) - after tracking the answer
    const currentLevel = levels[profile]?.[gameType] || 1;
    // Get updated progress (after recordLevelAnswer)
    const updatedProgress = levelProgress 
      ? {
          correctAnswers: levelProgress.correctAnswers + (isCorrect ? 1 : 0),
          totalAnswers: levelProgress.totalAnswers + 1,
          levelStartedAt: levelProgress.levelStartedAt,
        }
      : {
          correctAnswers: isCorrect ? 1 : 0,
          totalAnswers: 1,
          levelStartedAt: Date.now(),
        };
    
    // Check if should level up (after this answer)
    const shouldLevelUp = checkLevelUp(currentLevel, updatedProgress.correctAnswers, updatedProgress.totalAnswers);

    // Handle level completion and level-up (Phase 3)
    if (shouldLevelUp && isCorrect) {
      // Calculate star reward
      const perfect = updatedProgress.totalAnswers === updatedProgress.correctAnswers; // Perfect level (no wrong answers)
      const starsEarned = calculateStarReward(gameType, currentLevel, perfect);
      
      // Award stars
      const { newAchievements: starAchievements } = earnStars(starsEarned, `level_completion_${gameType}_${currentLevel}`);
      const answerIds = new Set(answerAchievements.map(a => a.id));
      const uniqueStarAchievements = starAchievements.filter(a => !answerIds.has(a.id));
      allNewAchievements = [...answerAchievements, ...uniqueStarAchievements];
      
      // Level up automatically
      const newLevel = currentLevel + 1;
      const { newAchievements: levelUpAchievements } = recordLevelUp(gameType, newLevel);
      const levelUpIds = new Set(allNewAchievements.map(a => a.id));
      const uniqueLevelUpAchievements = levelUpAchievements.filter(a => !levelUpIds.has(a.id));
      allNewAchievements = [...allNewAchievements, ...uniqueLevelUpAchievements];
      
      // Reset level progress for new level
      resetLevelProgress();
      
      // Show level-up notification
      playWin();
      setEnhancedConfetti(true);
      setTimeout(() => {
        setConfetti(true);
        const gameConfig = GAME_CONFIG[gameType] ?? GAME_CONFIG['word_builder']!;
        addNotification({
          type: 'levelUp',
          title: `${t.levelUp.level} ${newLevel}`,
          emoji: gameConfig.icon,
          message: formatText(t.levelUp.greatWork),
        });
        
        // Show stars earned notification
        setTimeout(() => {
          addNotification({
            type: 'info',
            message: `⭐ Earned ${starsEarned} ${starsEarned === 1 ? 'star' : 'stars'}!`,
          });
        }, 1000);
        
        setEnhancedConfetti(false);
        
        // Generate new problem with new level after level-up animation completes
        setTimeout(() => {
          if (baseGameType !== 'math_snake') {
            setBgClass('bg-slate-50');
            // For BattleLearn, generate new question but keep board state
            if (baseGameType === 'battlelearn' && problem.type === 'battlelearn') {
              const rng = getRng();
              const newQuestion = generateBattleLearnQuestion(problem, newLevel, profile, rng);
              setProblem(newQuestion);
            } else {
              const newProblem = generateUniqueProblemForGame(gameType, newLevel, profile, adaptiveDifficulty);
              setProblem(newProblem);
            }
          }
        }, 2000); // After level-up animation completes
      }, 800);
    }

    // Handle correct answer
    if (isCorrect) {
      // Note: Stars are now earned per-level completion (Phase 3), not per-answer
      const encouragement = getRandomEncouragement('correct', newStreak);
      if (newStreak >= 2) {
        addNotification({
          type: 'streak',
          message: formatText(encouragement),
          streakCount: newStreak,
        });
      } else {
        addNotification({
          type: 'correct',
          message: formatText(encouragement),
        });
      }

      setBgClass('bg-green-50');

      if (result.shouldShowParticles) {
        setParticleActive(true);
        setTimeout(() => setParticleActive(false), result.shouldShowParticles ? 1200 : 1500);
      }

      if (result.shouldIncrementScore) {
        addScore(result.points);
        addGlobalScore(result.points);
        
        // Update high score after adding points (check new score)
        if (gameType) {
          const newScore = score + result.points;
          updateHighScore(gameType, newScore);
        }
      }

      setShowHint(false);

      // Update problem if needed (for math snake)
      if (result.updatedProblem) {
        setProblem(result.updatedProblem);
      }

      // If we leveled up, use the new level for next problem
      const levelForNextProblem = shouldLevelUp ? (currentLevel + 1) : currentLevel;
      
      // Don't generate new problem immediately if we just leveled up (let level-up animation play)
      if (!shouldLevelUp && !result.updatedProblem && baseGameType !== 'math_snake') {
        // Generate new problem for standard games (only if not leveling up)
        setTimeout(() => {
          setBgClass('bg-slate-50');
          // For BattleLearn, generate new question but keep board state
          if (baseGameType === 'battlelearn' && problem.type === 'battlelearn') {
            const rng = getRng();
            const newQuestion = generateBattleLearnQuestion(problem, levelForNextProblem, profile, rng);
            setProblem(newQuestion);
          } else {
            const newProblem = generateUniqueProblemForGame(gameType, levelForNextProblem, profile, adaptiveDifficulty);
            setProblem(newProblem);
          }
        }, 600);
      } else if (!shouldLevelUp) {
        // Just reset background if not leveling up
        setTimeout(() => setBgClass('bg-slate-50'), 600);
      }
      // If leveling up, new problem will be generated after level-up animation completes (handled above)

      // Track max snake length for math snake
      if (baseGameType === 'math_snake' && result.updatedProblem && result.updatedProblem.type === 'math_snake') {
        const currentSnakeLength = result.updatedProblem.snake.length;
        updateStats(stats => ({
          ...stats,
          maxSnakeLength: Math.max(stats.maxSnakeLength || 0, currentSnakeLength),
        }));
      }

      // Check for collision-based game over (math snake)
      if (result.gameOver && !result.shouldEndGame) {
        setTimeout(() => {
          endGame();
          if (gameStartTime) {
            const playTime = Math.floor((Date.now() - gameStartTime) / 1000);
            updateStats(stats => ({
              ...stats,
              totalTimePlayed: stats.totalTimePlayed + playTime,
            }));
          }
        }, 400);
        return;
      }
    } else {
      // Handle wrong answer
      const encouragement = getRandomEncouragement('wrong');
      addNotification({
        type: 'wrong',
        message: formatText(encouragement),
      });

      setBgClass('bg-red-50');
      setShowHint(baseGameType !== 'math_snake'); // Show hint for non-math-snake games

      if (result.shouldDecrementHearts) {
        spendHeart();
        
        // Update problem for math snake before ending
        if (result.updatedProblem) {
          setProblem(result.updatedProblem);
        }

        // Check if game should end (no hearts left)
        const currentHearts = useGameStore.getState().hearts;
        if (currentHearts <= 0 || result.shouldEndGame) {
          // Record max snake length before game ends
          if (baseGameType === 'math_snake' && problem.type === 'math_snake') {
            const finalSnakeLength = problem.snake.length;
            updateStats(stats => ({
              ...stats,
              maxSnakeLength: Math.max(stats.maxSnakeLength || 0, finalSnakeLength),
            }));
          }

          setTimeout(() => {
            endGame();
            if (gameStartTime) {
              const playTime = Math.floor((Date.now() - gameStartTime) / 1000);
              updateStats(stats => ({
                ...stats,
                totalTimePlayed: stats.totalTimePlayed + playTime,
              }));
            }
          }, 800);
          return;
        }
      }

      setTimeout(() => {
        setBgClass('bg-slate-50');
      }, baseGameType === 'math_snake' ? 600 : 1500);
    }

    // Show achievements if we should (for both correct and wrong answers)
    if (allNewAchievements.length > 0 && shouldShowAchievement()) {
      const achievement = allNewAchievements[0];
      if (achievement) {
        addNotification({
          type: 'achievement',
          achievement: achievement,
        });
      }
    }
  }, [
    gameType,
    problem,
    currentStreak,
    profile,
    levels,
    adaptiveDifficulty,
    gameStartTime,
    recordAnswer,
    earnStars,
    recordLevelUp,
    addGlobalScore,
    updateStats,
    setProblem,
    setBgClass,
    setConfetti,
    setEnhancedConfetti,
    setParticleActive,
    setShowHint,
    spendHeart,
    addScore,
    endGame,
    updateAdaptiveDifficulty,
    submitAnswer,
    addNotification,
    recordLevelAnswer,
    resetLevelProgress,
    getRng,
    generateUniqueProblemForGame,
    playWin,
    t,
    formatText,
    levelProgress,
    score,
    updateHighScore,
    // checkLevelUp and calculateStarReward are pure functions from engine, no need in deps
  ]);

  return { handleAnswer };
}
