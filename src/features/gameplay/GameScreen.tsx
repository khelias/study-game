import React, { useEffect, useState, useCallback } from 'react';
import { Heart, Star, Home, Loader2 } from 'lucide-react';
import { useGameStore } from '../../stores/gameStore';
import { usePlaySessionStore } from '../../stores/playSessionStore';
import { useGameEngine } from '../../hooks/useGameEngine';
import { useGameAudio } from '../../hooks/useGameAudio';
import { GameRenderer } from './GameRenderer';
import { LevelUpModal, Confetti } from '../../components/GameViews';
import { AchievementModal } from '../../components/AchievementModal';
import { HintButton } from '../../components/HintButton';
import { FeedbackMessage, getRandomEncouragement } from '../../components/FeedbackSystem';
import { EnhancedConfetti, PulseEffect } from '../../components/EnhancedAnimations';
import { ParticleEffect } from '../../components/ParticleEffect';
import { ProgressIndicator } from '../../components/FeedbackSystem';
import { LearningTip } from '../../components/LearningTips';
import { GAME_CONFIG } from '../../games/data';

export const GameScreen: React.FC = () => {
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
  const showLevelUp = usePlaySessionStore(state => state.showLevelUp);
  const showAchievement = usePlaySessionStore(state => state.showAchievement);
  const showHint = usePlaySessionStore(state => state.showHint);
  const feedbackMessage = usePlaySessionStore(state => state.feedbackMessage);
  const feedbackType = usePlaySessionStore(state => state.feedbackType);
  const showLearningTip = usePlaySessionStore(state => state.showLearningTip);
  const currentStreak = usePlaySessionStore(state => state.currentStreak);
  const adaptiveDifficulty = usePlaySessionStore(state => state.adaptiveDifficulty);
  const gameStartTime = usePlaySessionStore(state => state.gameStartTime);
  
  const setProblem = usePlaySessionStore(state => state.setProblem);
  const returnToMenu = usePlaySessionStore(state => state.returnToMenu);
  const setBgClass = usePlaySessionStore(state => state.setBgClass);
  const setConfetti = usePlaySessionStore(state => state.setConfetti);
  const setEnhancedConfetti = usePlaySessionStore(state => state.setEnhancedConfetti);
  const setParticleActive = usePlaySessionStore(state => state.setParticleActive);
  const dismissLevelUpModal = usePlaySessionStore(state => state.dismissLevelUpModal);
  const setShowAchievement = usePlaySessionStore(state => state.setShowAchievement);
  const setShowHint = usePlaySessionStore(state => state.setShowHint);
  const setFeedbackMessage = usePlaySessionStore(state => state.setFeedbackMessage);
  const setShowLearningTip = usePlaySessionStore(state => state.setShowLearningTip);
  const incrementStars = usePlaySessionStore(state => state.incrementStars);
  const decrementHearts = usePlaySessionStore(state => state.decrementHearts);
  const endGame = usePlaySessionStore(state => state.endGame);
  const updateAdaptiveDifficulty = usePlaySessionStore(state => state.updateAdaptiveDifficulty);
  const submitAnswer = usePlaySessionStore(state => state.submitAnswer);
  const showLevelUpModal = usePlaySessionStore(state => state.showLevelUpModal);
  
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
    
    // Update stats in global store
    const { newAchievements } = recordAnswer(isCorrect, points);
    
    if (newAchievements.length > 0) {
      setShowAchievement(newAchievements[0]);
    }
    
    if (isCorrect) {
      // Correct answer
      const encouragement = getRandomEncouragement('correct', newStreak);
      setFeedbackMessage(encouragement, newStreak >= 2 ? 'streak' : 'correct');
      setBgClass('bg-green-50');
      setParticleActive(true);
      setTimeout(() => setParticleActive(false), 1500);
      addScore(points);
      
      const { newAchievements: starAchievements } = addCollectedStars(1);
      if (starAchievements.length > 0) {
        setShowAchievement(starAchievements[0]);
      }
      
      setShowHint(false);
      
      const nextStars = incrementStars();
      if (nextStars >= 5) {
        // Level complete!
        playWin();
        setEnhancedConfetti(true);
        setTimeout(() => {
          setConfetti(true);
          showLevelUpModal();
          setEnhancedConfetti(false);
        }, 800);
      } else {
        // Next problem
        const progressMessages = [
          '1/5 tähte! 🌟', 
          '2/5 tähte! ⭐⭐', 
          '3/5 tähte! ⭐⭐⭐', 
          '4/5 tähte! ⭐⭐⭐⭐', 
          'Viimane täht! ⭐⭐⭐⭐⭐'
        ];
        setTimeout(() => {
          setFeedbackMessage(progressMessages[nextStars - 1] || '', 'info');
          setTimeout(() => {
            setBgClass('bg-slate-50');
            setFeedbackMessage(null);
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
      // Wrong answer
      const encouragement = getRandomEncouragement('wrong');
      setFeedbackMessage(encouragement, 'wrong');
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
          setFeedbackMessage(null);
        }, 1500);
      }
    }
  }, [
    currentStreak, recordAnswer, setShowAchievement, setFeedbackMessage, setBgClass,
    setParticleActive, addScore, addCollectedStars, setShowHint, incrementStars,
    decrementHearts, endGame, gameStartTime, updateAdaptiveDifficulty, submitAnswer,
    playWin, setEnhancedConfetti, setConfetti, showLevelUpModal, gameType, levels,
    profile, adaptiveDifficulty, generateUniqueProblemForGame, setProblem, updateStats
  ]);
  
  const handleNextLevel = useCallback(() => {
    if (!gameType) return;
    
    dismissLevelUpModal();
    
    const newLevel = (levels[profile]?.[gameType] || 1) + 1;
    const { newAchievements } = recordLevelUp(gameType, newLevel);
    
    if (newAchievements.length > 0) {
      setShowAchievement(newAchievements[0]);
    }
    
    setTimeout(() => {
      const newProblem = generateUniqueProblemForGame(gameType, newLevel, profile, adaptiveDifficulty);
      setProblem(newProblem);
      setBgClass('bg-slate-50');
      setFeedbackMessage(null);
    }, 100);
  }, [gameType, levels, profile, recordLevelUp, setShowAchievement, dismissLevelUpModal, 
      generateUniqueProblemForGame, adaptiveDifficulty, setProblem, setBgClass, setFeedbackMessage]);
  
  const handleHint = useCallback(() => {
    if (!problem) return;
    
    let hintText = '';
    switch(problem.type) {
      case 'word_builder':
        hintText = `Vihje: Sõna algab tähega "${problem.target[0]}"`;
        break;
      case 'syllable_builder':
        hintText = `Vihje: Sõna algab silbiga "${problem.parts[0]}"`;
        break;
      case 'balance_scale': {
        const leftSum = problem.display.left.reduce((a: number, b: number) => a + b, 0);
        const rightKnown = problem.display.right.reduce((a: number, b: number) => a + b, 0);
        hintText = `Vihje: Vasak pool on ${leftSum}, parem pool on ${rightKnown} + ?`;
        break;
      }
      case 'pattern':
        hintText = `Vihje: Vaata, mis mustrit järgib rong!`;
        break;
      case 'memory_math':
        hintText = `Vihje: Pööra kaardid ümber ja leia paarid!`;
        break;
      case 'sentence_logic':
        hintText = `Vihje: Vaata, kus asub ${problem.display.split(' ')[0]} stseenis!`;
        break;
      case 'robo_path':
        hintText = `Vihje: Robot peab jõudma rohelise aknaga lahtrisse!`;
        break;
      case 'time_match':
        hintText = `Vihje: Vaata kella osuteid!`;
        break;
      case 'unit_conversion':
        hintText = problem.hint || `Vihje: ${problem.question}`;
        break;
      default:
        hintText = 'Proovi veel!';
    }
    
    setFeedbackMessage(hintText, 'hint');
    setBgClass('bg-yellow-50');
    setTimeout(() => {
      setBgClass('bg-slate-50');
      setFeedbackMessage(null);
    }, 3000);
  }, [problem, setFeedbackMessage, setBgClass]);
  
  if (!gameType) {
    return null;
  }
  
  return (
    <div className={`min-h-screen font-sans flex flex-col ${bgClass} transition-colors duration-500 select-none overflow-hidden`}>
      {confetti && <Confetti />}
      {enhancedConfetti && <EnhancedConfetti active={enhancedConfetti} onComplete={() => setEnhancedConfetti(false)} />}
      <ParticleEffect type="success" active={particleActive} />
      
      {showLevelUp && gameType && (
        <LevelUpModal 
          level={(levels[profile]?.[gameType] || 1) + 1} 
          onNext={handleNextLevel} 
          gameConfig={GAME_CONFIG[gameType]} 
        />
      )}
      
      {showAchievement && (
        <AchievementModal 
          achievement={showAchievement} 
          onClose={() => setShowAchievement(null)} 
          soundEnabled={soundEnabled} 
        />
      )}
      
      <FeedbackMessage 
        message={feedbackMessage} 
        type={feedbackType} 
        duration={2500}
        onComplete={() => setFeedbackMessage(null)}
        soundEnabled={soundEnabled}
      />
      
      {/* Header */}
      <div className="flex justify-between items-center p-2 sm:p-3 bg-white/80 backdrop-blur-md border-b-3 sm:border-b-4 border-slate-200 sticky top-0 z-40 shadow-sm">
        <button 
          onClick={returnToMenu} 
          aria-label="Tagasi menüüsse"
          className="bg-slate-100 hover:bg-slate-200 p-2 sm:p-3 rounded-lg sm:rounded-xl transition-colors active:scale-90">
          <Home size={18} className="sm:w-5 sm:h-5 text-slate-600"/>
        </button>
        
        <div className="flex flex-col items-center gap-0.5 sm:gap-1">
          <div className="flex gap-1 sm:gap-1.5 bg-slate-100 px-2 sm:px-3 py-1 sm:py-2 rounded-full">
            {[...Array(5)].map((_, i) => (
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
          {[...Array(3)].map((_, i) => (
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
            
            {gameType && !showHint && showLearningTip && (
              <LearningTip 
                gameType={gameType.replace('_adv', '')} 
                onClose={() => setShowLearningTip(false)}
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
