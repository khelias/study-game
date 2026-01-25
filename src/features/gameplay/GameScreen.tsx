import React, { useEffect, useCallback, useRef } from 'react';
import { Heart, Star, Home, Loader2 } from 'lucide-react';
import { useGameStore } from '../../stores/gameStore';
import { usePlaySessionStore } from '../../stores/playSessionStore';
import { useGameEngine } from '../../hooks/useGameEngine';
import { useGameAudio } from '../../hooks/useGameAudio';
import { GameRenderer } from './GameRenderer';
import { Confetti } from '../../components/GameViews';
import { NotificationSystem } from '../../components/NotificationSystem';
import { HintButton } from '../../components/HintButton';
import { getRandomEncouragement as _getRandomEncouragement } from '../../components/FeedbackSystem';
import { EnhancedConfetti, PulseEffect } from '../../components/EnhancedAnimations';
import { ParticleEffect } from '../../components/ParticleEffect';
import { ProgressIndicator } from '../../components/FeedbackSystem';
import { useTranslation } from '../../i18n/useTranslation';
import { useProfileText } from '../../hooks/useProfileText';

// Type-safe wrapper for getRandomEncouragement
const getRandomEncouragement = (type: string, streak?: number): string => 
  (_getRandomEncouragement as (type: string, streak?: number) => string)(type, streak);
import { GAME_CONFIG } from '../../games/data';

export const GameScreen: React.FC = () => {
  const t = useTranslation();
  const { formatText } = useProfileText();
  // Global state
  const profile = useGameStore(state => state.profile);
  const levels = useGameStore(state => state.levels);
  const soundEnabled = useGameStore(state => state.soundEnabled);
  const recordAnswer = useGameStore(state => state.recordAnswer);
  const recordLevelUp = useGameStore(state => state.recordLevelUp);
  const addCollectedStars = useGameStore(state => state.addCollectedStars);
  const addScore = useGameStore(state => state.addScore);
  const updateStats = useGameStore(state => state.updateStats);
  
  // Session state
  const gameType = usePlaySessionStore(state => state.gameType);
  const problem = usePlaySessionStore(state => state.problem);
  const stars = usePlaySessionStore(state => state.stars);
  const hearts = usePlaySessionStore(state => state.hearts);
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
  
  const setProblem = usePlaySessionStore(state => state.setProblem);
  const returnToMenu = usePlaySessionStore(state => state.returnToMenu);
  const setBgClass = usePlaySessionStore(state => state.setBgClass);
  const setConfetti = usePlaySessionStore(state => state.setConfetti);
  const setEnhancedConfetti = usePlaySessionStore(state => state.setEnhancedConfetti);
  const setParticleActive = usePlaySessionStore(state => state.setParticleActive);
  const setShowHint = usePlaySessionStore(state => state.setShowHint);
  const incrementStars = usePlaySessionStore(state => state.incrementStars);
  const decrementHearts = usePlaySessionStore(state => state.decrementHearts);
  const endGame = usePlaySessionStore(state => state.endGame);
  const updateAdaptiveDifficulty = usePlaySessionStore(state => state.updateAdaptiveDifficulty);
  const submitAnswer = usePlaySessionStore(state => state.submitAnswer);
  const addNotification = usePlaySessionStore(state => state.addNotification);
  const removeNotification = usePlaySessionStore(state => state.removeNotification);
  const clearNotifications = usePlaySessionStore(state => state.clearNotifications);
  
  const { generateUniqueProblemForGame } = useGameEngine();
  const { playWin } = useGameAudio(soundEnabled);
  
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
    
    // Update adaptive difficulty
    const responseTime = Date.now() - answerStartTime;
    updateAdaptiveDifficulty(isCorrect, responseTime);
    
    // Update streak
    submitAnswer(isCorrect);
    const newStreak = isCorrect ? currentStreak + 1 : 0;
    
    // Collect all achievements first, then show only one
    const { newAchievements: answerAchievements } = recordAnswer(isCorrect, points);
    
    let allNewAchievements = [...answerAchievements];
    
    if (isCorrect) {
      // Correct answer
       
      const encouragement = getRandomEncouragement('correct', newStreak);
      
      // Show correct notification or streak notification
      if (newStreak >= 2) {
        addNotification({
          type: 'streak',
          message: formatText(encouragement),
          streakCount: newStreak,
          duration: 2000,
          position: 'center',
          size: 'large',
        });
      } else {
        addNotification({
          type: 'correct',
          message: formatText(encouragement),
          duration: 1500,
          position: 'center',
          size: 'large',
        });
      }
      
      setBgClass('bg-green-50');
      setParticleActive(true);
      setTimeout(() => setParticleActive(false), 1500);
      addScore(points);
      
      const { newAchievements: starAchievements } = addCollectedStars(1);
      
      // Combine achievements, avoiding duplicates
      const answerIds = new Set(answerAchievements.map(a => a.id));
      const uniqueStarAchievements = starAchievements.filter(a => !answerIds.has(a.id));
      allNewAchievements = [...answerAchievements, ...uniqueStarAchievements];
      
      // Show only the first achievement if any exist and none is currently showing
      if (allNewAchievements.length > 0 && !achievementShownRef.current) {
        const achievement = allNewAchievements[0];
        if (achievement) {
          addNotification({
            type: 'achievement',
            achievement: achievement,
            duration: 3000,
            position: 'center',
            size: 'large',
          });
        }
        achievementShownRef.current = true;
      }
      
      setShowHint(false);
      
      const nextStars = incrementStars();
      if (nextStars >= 5) {
        // Level complete!
        playWin();
        setEnhancedConfetti(true);
        setTimeout(() => {
          setConfetti(true);
          
          // Show level up notification
          if (gameType) {
            const currentLevel = levels[profile]?.[gameType] || 1;
            const gameConfig = GAME_CONFIG[gameType] ?? GAME_CONFIG['word_builder']!;
            addNotification({
              type: 'levelUp',
              title: `${t.levelUp.level} ${currentLevel + 1}`,
              emoji: gameConfig.icon,
              message: t.levelUp.greatWork,
              duration: 3000,
              position: 'center',
              size: 'large',
            });
          }
          
          setEnhancedConfetti(false);
        }, 800);
      } else {
        // Next problem
        const progressMessages = [
          t.gameScreen.starProgress.one,
          t.gameScreen.starProgress.two,
          t.gameScreen.starProgress.three,
          t.gameScreen.starProgress.four,
          t.gameScreen.starProgress.last,
        ];
        setTimeout(() => {
          // Show progress info
          addNotification({
            type: 'info',
            message: formatText(progressMessages[nextStars - 1] || ''),
            duration: 1200,
            position: 'top',
            size: 'medium',
          });
          
          setTimeout(() => {
            setBgClass('bg-slate-50');
            // Generate next problem
            if (gameType) {
              const currentLevel = levels[profile]?.[gameType] || 1;
              const newProblem = generateUniqueProblemForGame(gameType, currentLevel, profile, adaptiveDifficulty);
              setProblem(newProblem);
            }
          }, 1200);
        }, 600);
      }
    } else {
      // Show achievement from recordAnswer even for wrong answers (if any)
      if (allNewAchievements.length > 0 && !achievementShownRef.current) {
        const achievement = allNewAchievements[0];
        if (achievement) {
          addNotification({
            type: 'achievement',
            achievement: achievement,
            duration: 3000,
            position: 'center',
            size: 'large',
          });
        }
        achievementShownRef.current = true;
      }
      // Wrong answer
       
      const encouragement = getRandomEncouragement('wrong');
      addNotification({
        type: 'wrong',
        message: formatText(encouragement),
        duration: 2000,
        position: 'top',
        size: 'medium',
      });
      
      setBgClass('bg-red-50');
      setShowHint(true);
      
      const newHearts = decrementHearts();
      if (newHearts <= 0) {
        setTimeout(() => {
          endGame();
          // Record time played
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
    setParticleActive, addScore, addCollectedStars, setShowHint, incrementStars,
    decrementHearts, endGame, gameStartTime, updateAdaptiveDifficulty, submitAnswer,
    playWin, setEnhancedConfetti, setConfetti, gameType, levels,
    profile, adaptiveDifficulty, generateUniqueProblemForGame, setProblem, updateStats, t,
    formatText
  ]);
  
  const handleNextLevel = useCallback(() => {
    if (!gameType) return;
    
    // Clear level up notification
    clearNotifications();
    setConfetti(false);
    
    const newLevel = (levels[profile]?.[gameType] || 1) + 1;
    const { newAchievements } = recordLevelUp(gameType, newLevel);
    
    if (newAchievements.length > 0) {
      const achievement = newAchievements[0];
      if (achievement) {
        addNotification({
          type: 'achievement',
          achievement: achievement,
          duration: 3000,
          position: 'center',
          size: 'large',
        });
      }
    }
    
    setTimeout(() => {
      const newProblem = generateUniqueProblemForGame(gameType, newLevel, profile, adaptiveDifficulty);
      setProblem(newProblem);
      setBgClass('bg-slate-50');
    }, 100);
  }, [gameType, levels, profile, recordLevelUp, addNotification, clearNotifications, setConfetti,
      generateUniqueProblemForGame, adaptiveDifficulty, setProblem, setBgClass]);
  
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
      case 'time_match':
        hintText = t.gameScreen.hints.timeMatch;
        break;
      case 'unit_conversion':
        if (problem.type === 'unit_conversion') {
          hintText = problem.question || t.gameScreen.hints.unitConversion;
        }
        break;
      default:
        hintText = t.gameScreen.hints.default;
    }
    
    addNotification({
      type: 'hint',
      message: formatText(hintText),
      duration: 3000,
      position: 'top',
      size: 'medium',
    });
    setBgClass('bg-yellow-50');
    setTimeout(() => {
      setBgClass('bg-slate-50');
    }, 3000);
  }, [problem, addNotification, setBgClass, t, formatText]);
  
  // Show learning tip on first problem
  useEffect(() => {
    if (gameType && problem && notifications.length === 0) {
      // Show learning tip for the game type
      const tipMessages: Record<string, string> = {
        word_builder: '💡 Vihje: Proovi mõelda, mis sõna võiks emoji järgi olla!',
        syllable_builder: '💡 Vihje: Silbid on sõna osad - proovi neid kokku panna!',
        pattern: '💡 Vihje: Vaata, mis mustrit järgib rong!',
        sentence_logic: '💡 Vihje: Loe lauset hoolikalt läbi!',
        memory_math: '💡 Vihje: Pööra kaardid ümber ja leia paarid!',
        balance_scale: '💡 Vihje: Arvuta, kui palju on vasakul pool!',
        robo_path: '💡 Vihje: Mõtle, kuidas robot peab liikuma!',
        time_match: '💡 Vihje: Vaata kella osuteid!',
        letter_match: '💡 Vihje: Vaata suurt tähte ja leia väike!',
        unit_conversion: '💡 Vihje: Loe küsimust hoolikalt ja mõtle ühikute vahekordadele!',
      };
      
      const gameTypeBase = gameType.replace('_adv', '');
      const tipMessage = tipMessages[gameTypeBase];
      
      if (tipMessage) {
        addNotification({
          type: 'tip',
          message: tipMessage,
          position: 'bottom',
          size: 'small',
        });
      }
    }
  }, [gameType, problem, notifications, addNotification]);
  
  if (!gameType) {
    return null;
  }
  
  return (
    <div className={`min-h-screen font-sans flex flex-col ${bgClass} transition-colors duration-500 select-none overflow-hidden`}>
      {confetti && <Confetti />}
      {enhancedConfetti && <EnhancedConfetti active={enhancedConfetti} onComplete={() => setEnhancedConfetti(false)} />}
      <ParticleEffect type="success" active={particleActive} />
      
      {/* Unified Notification System */}
      <NotificationSystem 
        notifications={notifications}
        onDismiss={(id) => {
          removeNotification(id);
          // If it was a level up notification, handle next level
          const notification = notifications.find(n => n.id === id);
          if (notification?.type === 'levelUp') {
            handleNextLevel();
          }
        }}
      />
      
      {/* Header */}
      <div className="flex justify-between items-center p-2 sm:p-3 bg-white/80 backdrop-blur-md border-b-3 sm:border-b-4 border-slate-200 sticky top-0 z-40 shadow-sm">
        <button 
          onClick={returnToMenu} 
          aria-label={t.gameScreen.returnToMenu}
          className="bg-slate-100 hover:bg-slate-200 p-2 sm:p-3 rounded-lg sm:rounded-xl transition-colors active:scale-90">
          <Home size={18} className="sm:w-5 sm:h-5 text-slate-600"/>
        </button>
        
          <div className="flex flex-col items-center gap-0.5 sm:gap-1">
          <div className="flex gap-1 sm:gap-1.5 bg-slate-100 px-2 sm:px-3 py-1 sm:py-2 rounded-full">
            {Array.from({ length: 5 }, (_, i) => (
              <PulseEffect key={i} active={i < stars && particleActive}>
                <div className={`transition-all duration-500 ${i < stars ? 'scale-110' : 'scale-100'}`}>
                  <Star 
                    className={`w-4 h-4 sm:w-5 sm:h-5 ${i < stars ? 'text-yellow-400 fill-yellow-400 drop-shadow-sm' : 'text-slate-300'}`} 
                    strokeWidth={2.5}
                  />
                </div>
              </PulseEffect>
            ))}
          </div>
          <div className="w-20 sm:w-full max-w-xs">
            <ProgressIndicator current={stars} total={5} />
          </div>
        </div>
        
        <div className="flex gap-0.5 sm:gap-1">
          {Array.from({ length: 3 }, (_, i) => (
            <Heart key={i} className={`w-5 h-5 sm:w-7 sm:h-7 transition-all duration-300 ${i < hearts ? 'text-red-500 fill-red-500 animate-pulse-slow' : 'text-slate-200'}`} />
          ))}
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
              soundEnabled={soundEnabled} 
            />
            
            {showHint && (
              <HintButton 
                onHint={handleHint} 
                soundEnabled={soundEnabled}
                disabled={false}
              />
            )}
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
