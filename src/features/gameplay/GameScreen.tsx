import React, { useEffect, useCallback, useRef, useState } from 'react';
import { Heart, Star, Home, Loader2, Menu, X, Volume2, VolumeX, Trophy, Sparkles } from 'lucide-react';
import { useGameStore } from '../../stores/gameStore';
import { usePlaySessionStore } from '../../stores/playSessionStore';
import { useGameEngine } from '../../hooks/useGameEngine';
import { useGameAudio } from '../../hooks/useGameAudio';
import { GameRenderer } from './GameRenderer';
import { Confetti } from '../../components/GameViews';
import { NotificationSystem } from '../../components/NotificationSystem';
import { HintButton } from '../../components/HintButton';
import { TipButton } from '../../components/TipButton';
import { getRandomEncouragement } from '../../components/FeedbackSystem';
import { EnhancedConfetti, PulseEffect } from '../../components/EnhancedAnimations';
import { ParticleEffect } from '../../components/ParticleEffect';
import { ProgressIndicator } from '../../components/FeedbackSystem';
import { useTranslation } from '../../i18n/useTranslation';
import { buildUnitConversionQuestion } from '../../utils/unitConversion';
import { useProfileText } from '../../hooks/useProfileText';

import { GAME_CONFIG } from '../../games/data';
import { moveMathSnake, resolveMathSnakeAnswer } from '../../engine/mathSnake';
import type { Direction, ProfileType } from '../../types/game';

export const GameScreen: React.FC = () => {
  const t = useTranslation();
  const { formatText } = useProfileText();
  // Global state
  const profile = useGameStore(state => state.profile);
  const profileId = profile as ProfileType;
  const levels = useGameStore(state => state.levels);
  const soundEnabled = useGameStore(state => state.soundEnabled);
  const toggleSound = useGameStore(state => state.toggleSound);
  const recordAnswer = useGameStore(state => state.recordAnswer);
  const recordLevelUp = useGameStore(state => state.recordLevelUp);
  const addCollectedStars = useGameStore(state => state.addCollectedStars);
  const addGlobalScore = useGameStore(state => state.addScore);
  const updateStats = useGameStore(state => state.updateStats);
  
  // Session state
  const gameType = usePlaySessionStore(state => state.gameType);
  const problem = usePlaySessionStore(state => state.problem);
  const stars = usePlaySessionStore(state => state.stars);
  const hearts = usePlaySessionStore(state => state.hearts);
  const score = usePlaySessionStore(state => state.score);
  const addScore = usePlaySessionStore(state => state.addScore);
  const bgClass = usePlaySessionStore(state => state.bgClass);
  const confetti = usePlaySessionStore(state => state.confetti);
  const enhancedConfetti = usePlaySessionStore(state => state.enhancedConfetti);
  const particleActive = usePlaySessionStore(state => state.particleActive);
  const showHint = usePlaySessionStore(state => state.showHint);
  const currentStreak = usePlaySessionStore(state => state.currentStreak);
  const adaptiveDifficulty = usePlaySessionStore(state => state.adaptiveDifficulty);
  const gameStartTime = usePlaySessionStore(state => state.gameStartTime);
  const notifications = usePlaySessionStore(state => state.notifications);
  
  // Track if we're currently showing an achievement to prevent duplicates
  const achievementShownRef = useRef(false);
  
  // Update ref when achievement notification changes
  useEffect(() => {
    const hasAchievement = notifications.some(n => n.type === 'achievement');
    achievementShownRef.current = hasAchievement;
  }, [notifications]);
  
  // Tip state (only show once per session, allow manual reopen)
  const tipShownOnceRef = useRef(false);
  const tipMessageRef = useRef<string | null>(null);
  const [canReopenTip, setCanReopenTip] = useState(false);
  const [isCompactLayout, setIsCompactLayout] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const settingsMenuRef = useRef<HTMLDivElement>(null);
  
  const setProblem = usePlaySessionStore(state => state.setProblem);
  const returnToMenu = usePlaySessionStore(state => state.returnToMenu);
  const setBgClass = usePlaySessionStore(state => state.setBgClass);
  const setConfetti = usePlaySessionStore(state => state.setConfetti);
  const setEnhancedConfetti = usePlaySessionStore(state => state.setEnhancedConfetti);
  const setParticleActive = usePlaySessionStore(state => state.setParticleActive);
  const setShowHint = usePlaySessionStore(state => state.setShowHint);
  const incrementStars = usePlaySessionStore(state => state.incrementStars);
  const resetStars = usePlaySessionStore(state => state.resetStars);
  const decrementHearts = usePlaySessionStore(state => state.decrementHearts);
  const endGame = usePlaySessionStore(state => state.endGame);
  const updateAdaptiveDifficulty = usePlaySessionStore(state => state.updateAdaptiveDifficulty);
  const submitAnswer = usePlaySessionStore(state => state.submitAnswer);
  const addNotification = usePlaySessionStore(state => state.addNotification);
  const removeNotification = usePlaySessionStore(state => state.removeNotification);
  const clearNotifications = usePlaySessionStore(state => state.clearNotifications);
  
  const { generateUniqueProblemForGame, getRng } = useGameEngine();
  const { playWin, playClick } = useGameAudio(soundEnabled);

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
  
  const handleAnswer = useCallback((isCorrect: boolean) => {
    const answerStartTime = Date.now();
    const points = isCorrect ? 10 : 0;
    const baseGameType = gameType?.replace('_adv', '');

    // Update adaptive difficulty
    const responseTime = Date.now() - answerStartTime;
    updateAdaptiveDifficulty(isCorrect, responseTime);

    // Update streak
    submitAnswer(isCorrect);
    const newStreak = isCorrect ? currentStreak + 1 : 0;

    // Collect achievements first
    const { newAchievements: answerAchievements } = recordAnswer(isCorrect, points);

    if (baseGameType === 'math_snake' && problem?.type === 'math_snake') {
      let allNewAchievements = [...answerAchievements];

      if (isCorrect) {
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
        setParticleActive(true);
        setTimeout(() => setParticleActive(false), 1200);
        // Add to session score (displayed during game) and global score (persisted)
        // Math answer gives points (not the apple itself - apple gives star)
        addScore(points);
        addGlobalScore(points);
        setShowHint(false);

        // Collect star for correct math answer (like other games)
        const { newAchievements: starAchievements } = addCollectedStars(1);
        const answerIds = new Set(answerAchievements.map(a => a.id));
        const uniqueStarAchievements = starAchievements.filter(a => !answerIds.has(a.id));
        allNewAchievements = [...answerAchievements, ...uniqueStarAchievements];

        // Check for level up (5 stars)
        const nextStars = incrementStars();
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
        }
      } else {
        const encouragement = getRandomEncouragement('wrong');
        addNotification({
          type: 'wrong',
          message: formatText(encouragement),
        });
        setBgClass('bg-red-50');
        setShowHint(false);
        
        // Decrement heart for wrong answer
        const newHearts = decrementHearts();
        if (newHearts <= 0) {
          // Game over if no hearts left
          const rng = getRng();
          const resolution = resolveMathSnakeAnswer(problem, isCorrect, rng);
          setProblem(resolution.problem);
          // Record max snake length before game ends
          const finalSnakeLength = resolution.problem.snake.length;
          setTimeout(() => {
            endGame();
            if (gameStartTime) {
              const playTime = Math.floor((Date.now() - gameStartTime) / 1000);
              updateStats(stats => ({
                ...stats,
                totalTimePlayed: stats.totalTimePlayed + playTime,
                maxSnakeLength: Math.max(stats.maxSnakeLength || 0, finalSnakeLength)
              }));
            }
          }, 800);
          return;
        }
      }

      if (allNewAchievements.length > 0 && !achievementShownRef.current) {
        const achievement = allNewAchievements[0];
        if (achievement) {
          addNotification({
            type: 'achievement',
            achievement: achievement,
          });
        }
        achievementShownRef.current = true;
      }

      const rng = getRng();
      const resolution = resolveMathSnakeAnswer(problem, isCorrect, rng);
      
      // Track max snake length during game
      const currentSnakeLength = resolution.problem.snake.length;
      updateStats(stats => ({
        ...stats,
        maxSnakeLength: Math.max(stats.maxSnakeLength || 0, currentSnakeLength)
      }));
      
      setProblem(resolution.problem);

      // Check for collision-based game over (snake hits self)
      if (resolution.gameOver) {
        setTimeout(() => {
          endGame();
          if (gameStartTime) {
            const playTime = Math.floor((Date.now() - gameStartTime) / 1000);
            updateStats(stats => ({
              ...stats,
              totalTimePlayed: stats.totalTimePlayed + playTime
            }));
          }
        }, 400);
        return;
      }

      setTimeout(() => setBgClass('bg-slate-50'), 600);
      return;
    }

    let allNewAchievements = [...answerAchievements];

    if (isCorrect) {
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
      setParticleActive(true);
      setTimeout(() => setParticleActive(false), 1500);
      // Add to session score (displayed during game) and global score (persisted)
      addScore(points);
      addGlobalScore(points);

      const { newAchievements: starAchievements } = addCollectedStars(1);
      const answerIds = new Set(answerAchievements.map(a => a.id));
      const uniqueStarAchievements = starAchievements.filter(a => !answerIds.has(a.id));
      allNewAchievements = [...answerAchievements, ...uniqueStarAchievements];

      if (allNewAchievements.length > 0 && !achievementShownRef.current) {
        const achievement = allNewAchievements[0];
        if (achievement) {
          addNotification({
            type: 'achievement',
            achievement: achievement,
          });
        }
        achievementShownRef.current = true;
      }

      setShowHint(false);

      const nextStars = incrementStars();
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
      } else {
        setTimeout(() => {
          setBgClass('bg-slate-50');
          if (gameType) {
            const currentLevel = levels[profile]?.[gameType] || 1;
            const newProblem = generateUniqueProblemForGame(gameType, currentLevel, profile, adaptiveDifficulty);
            setProblem(newProblem);
          }
        }, 600);
      }
    } else {
      if (allNewAchievements.length > 0 && !achievementShownRef.current) {
        const achievement = allNewAchievements[0];
        if (achievement) {
          addNotification({
            type: 'achievement',
            achievement: achievement,
          });
        }
        achievementShownRef.current = true;
      }

      const encouragement = getRandomEncouragement('wrong');
      addNotification({
        type: 'wrong',
        message: formatText(encouragement),
      });

      setBgClass('bg-red-50');
      setShowHint(true);

      const newHearts = decrementHearts();
      if (newHearts <= 0) {
        setTimeout(() => {
          endGame();
          if (gameStartTime) {
            const playTime = Math.floor((Date.now() - gameStartTime) / 1000);
            updateStats(stats => ({
              ...stats,
              totalTimePlayed: stats.totalTimePlayed + playTime
            }));
          }
        }, 800);
      } else {
        setTimeout(() => {
          setBgClass('bg-slate-50');
        }, 1500);
      }
    }
  }, [
    currentStreak, recordAnswer, addNotification, setBgClass,
    setParticleActive, addScore, addGlobalScore, addCollectedStars, setShowHint, incrementStars,
    decrementHearts, endGame, gameStartTime, updateAdaptiveDifficulty, submitAnswer,
    playWin, setEnhancedConfetti, setConfetti, gameType, levels,
    profile, adaptiveDifficulty, generateUniqueProblemForGame, setProblem, updateStats, t,
    formatText, getRng, problem
  ]);
  
  const handleNextLevel = useCallback(() => {
    if (!gameType) return;
    
    // Clear level up notification
    clearNotifications();
    setConfetti(false);
    resetStars();
    
    const newLevel = (levels[profile]?.[gameType] || 1) + 1;
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
      // For math snake, continue with same problem (game continues)
      // For other games, generate new problem with new level
      if (!isMathSnake) {
        const newProblem = generateUniqueProblemForGame(gameType, newLevel, profile, adaptiveDifficulty);
        setProblem(newProblem);
      }
      setBgClass('bg-slate-50');
    }, 100);
  }, [gameType, levels, profile, recordLevelUp, addNotification, clearNotifications, setConfetti,
      generateUniqueProblemForGame, adaptiveDifficulty, setProblem, setBgClass, resetStars]);

  const handleMathSnakeMove = useCallback((direction: Direction) => {
    if (!gameType || !problem || problem.type !== 'math_snake') return;
    const baseType = gameType.replace('_adv', '');
    if (baseType !== 'math_snake') return;
    if (problem.math) return;
    const currentLevel = levels[profile]?.[gameType] || 1;
    const rng = getRng();
    
    // Check if we're eating an apple before moving
    const wasEatingNormalApple = problem.apple?.kind === 'normal';
    
    const result = moveMathSnake(problem, direction, currentLevel, rng, profileId);
    if (result.collision) {
      // Record max snake length before game ends
      const finalSnakeLength = problem.snake.length;
      updateStats(stats => ({
        ...stats,
        maxSnakeLength: Math.max(stats.maxSnakeLength || 0, finalSnakeLength)
      }));
      endGame();
      if (gameStartTime) {
        const playTime = Math.floor((Date.now() - gameStartTime) / 1000);
        updateStats(stats => ({
          ...stats,
          totalTimePlayed: stats.totalTimePlayed + playTime
        }));
      }
      return;
    }
    
    // Track max snake length during game
    const currentSnakeLength = result.problem.snake.length;
    updateStats(stats => ({
      ...stats,
      maxSnakeLength: Math.max(stats.maxSnakeLength || 0, currentSnakeLength)
    }));
    
    // If we ate a normal apple, give points (not for math apple - that gives star)
    if (wasEatingNormalApple && !result.problem.math) {
      const applePoints = 5; // Points for eating a normal apple
      addScore(applePoints);
      addGlobalScore(applePoints);
    }
    
    setProblem(result.problem);
  }, [gameType, problem, levels, profile, getRng, profileId, setProblem, endGame, gameStartTime, updateStats, addScore, addGlobalScore]);
  
  const handleHint = useCallback(() => {
    if (!problem) return;
    
    let hintText = '';
    switch(problem.type) {
      case 'word_builder':
        if (problem.type === 'word_builder') {
          hintText = problem.target ? `${t.gameScreen.hints.wordBuilder} "${problem.target[0] ?? ''}"` : '';
        }
        break;
      case 'syllable_builder':
        if (problem.type === 'syllable_builder') {
          const firstSyllable = problem.shuffled?.[0];
          hintText = firstSyllable ? `${t.gameScreen.hints.syllableBuilder} "${firstSyllable.text ?? ''}"` : '';
        }
        break;
      case 'balance_scale': {
        if (problem.type === 'balance_scale') {
          const leftSum = problem.display.left.reduce((a, b) => a + b, 0);
          const rightKnown = problem.display.right.reduce((a, b) => a + b, 0);
          hintText = `${t.gameScreen.hints.balanceScale} ${leftSum}, ${t.gameScreen.hints.balanceScaleRight} ${rightKnown} + ?`;
        }
        break;
      }
      case 'pattern':
        hintText = t.gameScreen.hints.pattern;
        break;
      case 'memory_math':
        hintText = t.gameScreen.hints.memoryMath;
        break;
      case 'sentence_logic':
        if (problem.type === 'sentence_logic') {
          const firstWord = problem.sentence.split(' ')[0];
          hintText = `${t.gameScreen.hints.sentenceLogic} ${firstWord} ${t.gameScreen.hints.sentenceLogicScene}`;
        }
        break;
      case 'robo_path':
        hintText = t.gameScreen.hints.roboPath;
        break;
      case 'math_snake':
        hintText = t.gameScreen.hints.mathSnake;
        break;
      case 'time_match':
        hintText = t.gameScreen.hints.timeMatch;
        break;
      case 'unit_conversion':
        if (problem.type === 'unit_conversion') {
          hintText = buildUnitConversionQuestion(t, problem.value, problem.fromUnit, problem.toUnit);
        }
        break;
      default:
        hintText = t.gameScreen.hints.default;
    }
    
    addNotification({
      type: 'hint',
      message: formatText(hintText),
    });
    setBgClass('bg-yellow-50');
    setTimeout(() => {
      setBgClass('bg-slate-50');
    }, 3000);
  }, [problem, addNotification, setBgClass, t, formatText]);
  
  const getTipsForGame = useCallback((type: string): string[] => {
    switch (type) {
      case 'word_builder':
        return [...t.gameScreen.tips.word_builder];
      case 'syllable_builder':
        return [...t.gameScreen.tips.syllable_builder];
      case 'pattern':
        return [...t.gameScreen.tips.pattern];
      case 'sentence_logic':
        return [...t.gameScreen.tips.sentence_logic];
      case 'memory_math':
        return [...t.gameScreen.tips.memory_math];
      case 'balance_scale':
        return [...t.gameScreen.tips.balance_scale];
      case 'robo_path':
        return [...t.gameScreen.tips.robo_path];
      case 'math_snake':
        return [...t.gameScreen.tips.math_snake];
      case 'time_match':
        return [...t.gameScreen.tips.time_match];
      case 'letter_match':
        return [...t.gameScreen.tips.letter_match];
      case 'unit_conversion':
        return [...t.gameScreen.tips.unit_conversion];
      default:
        return [];
    }
  }, [t]);

  useEffect(() => {
    tipShownOnceRef.current = false;
    tipMessageRef.current = null;
    const resetTimer = setTimeout(() => setCanReopenTip(false), 0);
    return () => clearTimeout(resetTimer);
  }, [gameType]);

  const handleTipReplay = useCallback(() => {
    if (!tipMessageRef.current) return;
    const hasTipNotification = notifications.some(n => n.type === 'tip');
    if (hasTipNotification) return;
    addNotification({
      type: 'tip',
      message: tipMessageRef.current,
    });
  }, [addNotification, notifications]);

  // Show learning tip only once per session
  useEffect(() => {
    if (!gameType || !problem) {
      return;
    }
    
    // Only show tip once per session, and avoid duplicates if visible
    const hasTipNotification = notifications.some(n => n.type === 'tip');
    
    if (!tipShownOnceRef.current && !hasTipNotification) {
      const gameTypeBase = gameType.replace('_adv', '');
      const tips = getTipsForGame(gameTypeBase);

      if (tips.length > 0) {
        const tipMessage = tips[Math.floor(Math.random() * tips.length)];
        if (tipMessage) {
          tipShownOnceRef.current = true;
          tipMessageRef.current = tipMessage;
          const tipTimer = setTimeout(() => {
            setCanReopenTip(true);
            if (!isCompactLayout) {
              addNotification({
                type: 'tip',
                message: tipMessage,
              });
            }
          }, 0);
          return () => {
            clearTimeout(tipTimer);
          };
        }
      }
    }
    return undefined;
  }, [gameType, problem, notifications, addNotification, getTipsForGame, isCompactLayout]);
  
  if (!gameType) {
    return null;
  }

  const currentLevel = levels[profile]?.[gameType] ?? 1;
  const baseType = gameType.replace('_adv', '');
  const isMathSnake = baseType === 'math_snake';
  const settingsLabel = formatText(t.menu.settings);
  const scoreLabel = formatText(t.game.score);
  const levelLabel = formatText(t.game.level);
  
  return (
    <div className={`min-h-screen font-sans flex flex-col ${bgClass} transition-colors duration-500 select-none overflow-hidden`}>
      {confetti && <Confetti />}
      {enhancedConfetti && <EnhancedConfetti active={enhancedConfetti} onComplete={() => setEnhancedConfetti(false)} />}
      <ParticleEffect type="success" active={particleActive} />
      
      {/* Unified Notification System */}
      <NotificationSystem 
        notifications={notifications}
        onDismiss={(id) => {
          // Find the notification before removing it
          const notification = notifications.find(n => n.id === id);
          removeNotification(id);
          
          // If it was a level up notification, handle next level
          if (notification?.type === 'levelUp') {
            handleNextLevel();
          }
          
          // Reset achievement ref when achievement notification is dismissed
          if (notification?.type === 'achievement') {
            achievementShownRef.current = false;
          }
        }}
      />
      
      {/* Header */}
      <div className="flex justify-between items-center p-1.5 sm:p-3 bg-white/80 backdrop-blur-md border-b-2 sm:border-b-4 border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="w-full max-w-2xl mx-auto grid grid-cols-2 items-center gap-1.5 px-2 sm:px-0 sm:flex sm:items-center sm:justify-between sm:gap-3">
          <div className="flex items-center gap-2 sm:gap-3 order-1 sm:order-1">
            <button 
              onClick={() => {
                playClick();
                returnToMenu();
              }} 
              aria-label={t.gameScreen.returnToMenu}
              className="bg-slate-100 hover:bg-slate-200 p-1.5 sm:p-3 rounded-lg sm:rounded-xl transition-colors active:scale-90">
              <Home size={16} className="sm:w-5 sm:h-5 text-slate-600"/>
            </button>
            <div className="relative" ref={settingsMenuRef}>
              <button 
                onClick={() => {
                  setShowSettingsMenu(!showSettingsMenu);
                  playClick();
                }} 
                aria-label={settingsLabel}
                title={settingsLabel}
                aria-expanded={showSettingsMenu}
                className="bg-slate-100 hover:bg-slate-200 p-1.5 sm:p-3 rounded-lg sm:rounded-xl transition-colors active:scale-90"
              >
                {showSettingsMenu ? <X size={14} className="sm:w-5 sm:h-5 text-slate-600"/> : <Menu size={14} className="sm:w-5 sm:h-5 text-slate-600"/>}
              </button>
              {showSettingsMenu && (
                <div className="absolute left-0 top-full mt-2 bg-white rounded-xl shadow-lg border-2 border-slate-200 overflow-hidden z-50 min-w-[180px]">
                  <button
                    onClick={() => {
                      playClick();
                      toggleSound();
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-slate-50 transition-colors flex items-center gap-2 text-slate-700"
                  >
                    {soundEnabled ? <Volume2 size={16} className="text-slate-600"/> : <VolumeX size={16} className="text-red-500"/>}
                    <span>{formatText(soundEnabled ? t.menuSpecific.toggleSoundOff : t.menuSpecific.toggleSoundOn)}</span>
                  </button>
                  <div className="border-t border-slate-200">
                    <button
                      onClick={() => {
                        playClick();
                        setShowSettingsMenu(false);
                        returnToMenu();
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-slate-50 transition-colors flex items-center gap-2 text-slate-700"
                    >
                      <Home size={16} className="text-slate-600"/>
                      <span>{formatText(t.gameScreen.returnToMenu)}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-0.5 sm:gap-1.5 order-2 sm:order-3">
            <div className="flex items-center gap-1 sm:gap-2">
              <div className="flex items-center gap-1 sm:gap-1.5 bg-yellow-100/80 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-yellow-700 shadow-sm">
                <Trophy size={13} className="sm:w-4 sm:h-4" />
                <span className="text-xs sm:text-sm font-black">{score}</span>
                <span className="hidden sm:inline text-[10px] font-bold uppercase tracking-wide text-yellow-700/80">{scoreLabel}</span>
                <span className="sr-only sm:hidden">{scoreLabel}</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-1.5 bg-purple-100/80 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-purple-700 shadow-sm">
                <Sparkles size={13} className="sm:w-4 sm:h-4" />
                <span className="text-xs sm:text-sm font-black">{currentLevel}</span>
                <span className="hidden sm:inline text-[10px] font-bold uppercase tracking-wide text-purple-700/80">{levelLabel}</span>
                <span className="sr-only sm:hidden">{levelLabel}</span>
              </div>
            </div>
            <div className="hidden sm:flex gap-0.5 sm:gap-1">
              {Array.from({ length: 3 }, (_, i) => (
                <Heart key={i} className={`w-5 h-5 sm:w-7 sm:h-7 transition-all duration-300 ${i < hearts ? 'text-red-500 fill-red-500 animate-pulse-slow' : 'text-slate-200'}`} />
              ))}
            </div>
          </div>

          <div className="col-span-2 relative flex items-center justify-center order-3 sm:order-2 w-full">
            {isMathSnake ? (
              <div className="flex flex-col items-center gap-0.5 sm:gap-1">
                <div className="flex gap-0.5 sm:gap-1.5 bg-slate-100 px-1.5 sm:px-3 py-0.5 sm:py-2 rounded-full">
                {Array.from({ length: 5 }, (_, i) => (
                  <PulseEffect key={i} active={i < stars && particleActive}>
                    <div className={`transition-all duration-500 ${i < stars ? 'scale-110' : 'scale-100'}`}>
                      <Star 
                        className={`w-3.5 h-3.5 sm:w-5 sm:h-5 ${i < stars ? 'text-yellow-400 fill-yellow-400 drop-shadow-sm' : 'text-slate-300'}`} 
                        strokeWidth={2.5}
                      />
                    </div>
                  </PulseEffect>
                ))}
                </div>
                <div className="w-16 sm:w-full max-w-xs">
                  <ProgressIndicator current={stars} total={5} />
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-0.5 sm:gap-1">
                <div className="flex gap-0.5 sm:gap-1.5 bg-slate-100 px-1.5 sm:px-3 py-0.5 sm:py-2 rounded-full">
                {Array.from({ length: 5 }, (_, i) => (
                  <PulseEffect key={i} active={i < stars && particleActive}>
                    <div className={`transition-all duration-500 ${i < stars ? 'scale-110' : 'scale-100'}`}>
                      <Star 
                        className={`w-3.5 h-3.5 sm:w-5 sm:h-5 ${i < stars ? 'text-yellow-400 fill-yellow-400 drop-shadow-sm' : 'text-slate-300'}`} 
                        strokeWidth={2.5}
                      />
                    </div>
                  </PulseEffect>
                ))}
                </div>
                <div className="w-16 sm:w-full max-w-xs">
                  <ProgressIndicator current={stars} total={5} />
                </div>
              </div>
            )}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 flex gap-0.5 sm:hidden">
              {Array.from({ length: 3 }, (_, i) => (
                <Heart key={i} className={`w-4 h-4 transition-all duration-300 ${i < hearts ? 'text-red-500 fill-red-500 animate-pulse-slow' : 'text-slate-200'}`} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Game content */}
      <div className="flex-1 flex flex-col items-center p-4 max-w-2xl mx-auto w-full relative">
        {!problem ? (
          <Loader2 className="animate-spin mt-20 text-slate-400" size={48}/>
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
            
            {showHint && (
              <HintButton 
                onHint={handleHint} 
                soundEnabled={soundEnabled}
                disabled={false}
              />
            )}

            <TipButton
              onTip={handleTipReplay}
              soundEnabled={soundEnabled}
              disabled={!canReopenTip}
            />
          </div>
        )}
      </div>

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
