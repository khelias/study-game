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
  const addCollectedStars = useGameStore(state => state.addCollectedStars);
  const addGlobalScore = useGameStore(state => state.addScore);
  const updateStats = useGameStore(state => state.updateStats);

  // Session state
  const gameType = usePlaySessionStore(state => state.gameType);
  const problem = usePlaySessionStore(state => state.problem);
  const stars = usePlaySessionStore(state => state.stars);
  const hearts = usePlaySessionStore(state => state.hearts);
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
  const incrementStars = usePlaySessionStore(state => state.incrementStars);
  const decrementHearts = usePlaySessionStore(state => state.decrementHearts);
  const addScore = usePlaySessionStore(state => state.addScore);
  const endGame = usePlaySessionStore(state => state.endGame);
  const updateAdaptiveDifficulty = usePlaySessionStore(state => state.updateAdaptiveDifficulty);
  const submitAnswer = usePlaySessionStore(state => state.submitAnswer);
  const addNotification = usePlaySessionStore(state => state.addNotification);

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

    // Process answer using engine logic
    const rng = getRng();
    const result = processAnswer({
      isCorrect,
      problem,
      gameType,
      currentStreak: newStreak,
      currentStars: stars,
      currentHearts: hearts,
      rng,
    });

    // Handle achievements - collect all achievements
    let allNewAchievements = [...answerAchievements];

    // Handle correct answer
    if (isCorrect) {
      // Collect star achievements for correct answers
      if (result.shouldIncrementStars) {
        const { newAchievements: starAchievements } = addCollectedStars(1);
        const answerIds = new Set(answerAchievements.map(a => a.id));
        const uniqueStarAchievements = starAchievements.filter(a => !answerIds.has(a.id));
        allNewAchievements = [...answerAchievements, ...uniqueStarAchievements];
      }
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
      }

      setShowHint(false);

      // Update problem if needed (for math snake)
      if (result.updatedProblem) {
        setProblem(result.updatedProblem);
      }

      // Check for level up
      const nextStars = result.shouldIncrementStars ? incrementStars() : stars;
      if (nextStars >= 5) {
        playWin();
        setEnhancedConfetti(true);
        setTimeout(() => {
          setConfetti(true);
          if (gameType) {
            const currentLevel = levels[profile]?.[gameType] || 1;
            const gameConfig = GAME_CONFIG[gameType] ?? GAME_CONFIG['word_builder']!;
            addNotification({
              type: 'levelUp',
              title: `${t.levelUp.level} ${currentLevel + 1}`,
              emoji: gameConfig.icon,
              message: formatText(t.levelUp.greatWork),
            });
          }
          setEnhancedConfetti(false);
        }, 800);
      } else if (!result.updatedProblem && baseGameType !== 'math_snake') {
        // Generate new problem for standard games
        setTimeout(() => {
          setBgClass('bg-slate-50');
          const currentLevel = levels[profile]?.[gameType] || 1;
          const newProblem = generateUniqueProblemForGame(gameType, currentLevel, profile, adaptiveDifficulty);
          setProblem(newProblem);
        }, 600);
      } else {
        setTimeout(() => setBgClass('bg-slate-50'), 600);
      }

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
        decrementHearts();
        
        // Update problem for math snake before ending
        if (result.updatedProblem) {
          setProblem(result.updatedProblem);
        }

        if (result.shouldEndGame) {
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
    stars,
    hearts,
    currentStreak,
    profile,
    levels,
    adaptiveDifficulty,
    gameStartTime,
    recordAnswer,
    addCollectedStars,
    addGlobalScore,
    updateStats,
    setProblem,
    setBgClass,
    setConfetti,
    setEnhancedConfetti,
    setParticleActive,
    setShowHint,
    incrementStars,
    decrementHearts,
    addScore,
    endGame,
    updateAdaptiveDifficulty,
    submitAnswer,
    addNotification,
    getRng,
    generateUniqueProblemForGame,
    playWin,
    t,
    formatText,
  ]);

  return { handleAnswer };
}
