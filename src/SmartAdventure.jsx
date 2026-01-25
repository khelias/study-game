import React, { useEffect, useState } from 'react';
import { 
  Heart, Trophy, Trash2, Volume2, VolumeX, Loader2, Star, Home, BarChart3,
  Type, Brain, Scale, BookOpen, GraduationCap, TrainFront, Bot, Clock3, Ruler
} from 'lucide-react';

import { LevelUpModal, BalanceScaleView, StandardGameView, WordGameView, PatternTrainView, MemoryGameView, RoboPathView, Confetti, SyllableGameView, TimeGameView, UnitConversionView } from './components/GameViews';
import { AchievementModal } from './components/AchievementModal';
import { AchievementsModal } from './components/AchievementsModal';
import { StatsModal } from './components/StatsModal';
import { ParticleEffect } from './components/ParticleEffect';
import { TutorialModal } from './components/TutorialModal';
import { HintButton } from './components/HintButton';
import { FeedbackMessage, getRandomEncouragement } from './components/FeedbackSystem';
import { EnhancedConfetti, PulseEffect } from './components/EnhancedAnimations';
import { GameCard } from './components/GameCard';
import { ProgressIndicator } from './components/FeedbackSystem';
import { LearningTip } from './components/LearningTips';
import { createAdaptiveDifficulty, updateAdaptiveDifficulty, getEffectiveLevel } from './engine/adaptiveDifficulty';
import { Generators } from './games/generators';
import { APP_KEY, GAME_CONFIG, PROFILES, CATEGORIES } from './games/data';
import { playSound } from './engine/audio';
import { createRng } from './engine/rng';
import { createStats, recordGameStart, recordAnswer, recordLevelUp, recordScore } from './engine/stats';
import { checkAchievements } from './engine/achievements';

const ICON_MAP = { Type, Brain, Scale, BookOpen, GraduationCap, TrainFront, Bot, Clock3, Ruler };

const buildDefaultLevels = () => {
  const base = {};
  Object.keys(PROFILES).forEach(pid => {
    const start = PROFILES[pid].levelStart || 1;
    base[pid] = Object.keys(GAME_CONFIG).reduce((acc, g) => ({ ...acc, [g]: start }), {});
  });
  return base;
};

const SmartAdventure = () => {
  const [rng] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const seedParam = params.get('seed');
    const parsed = seedParam ? parseInt(seedParam, 10) : null;
    return createRng(Number.isFinite(parsed) ? parsed : Date.now());
  });

  const [profile, setProfile] = useState(Object.keys(PROFILES)[0]);
  const [gameState, setGameState] = useState('menu'); // menu, playing, game_over
  const [gameType, setGameType] = useState(null);
  const [problem, setProblem] = useState(null);
  const [lastKeys, setLastKeys] = useState({});
  const [levels, setLevels] = useState(buildDefaultLevels);
  const [score, setScore] = useState(0);
  const [hearts, setHearts] = useState(3);
  const [stars, setStars] = useState(0); 
  const [bgClass, setBgClass] = useState('bg-slate-50');
  const [confetti, setConfetti] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [stats, setStats] = useState(createStats);
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);
  const [newAchievement, setNewAchievement] = useState(null);
  const [gameStartTime, setGameStartTime] = useState(null);
  const [showStats, setShowStats] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [particleActive, setParticleActive] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [collectedStars, setCollectedStars] = useState(0); // Kogutud tähed (narratiivi jaoks)
  const [showHint, setShowHint] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState(null);
  const [feedbackType, setFeedbackType] = useState('info');
  const [adaptiveDifficulty, setAdaptiveDifficulty] = useState(() => createAdaptiveDifficulty());
  const [currentStreak, setCurrentStreak] = useState(0);
  const [enhancedConfetti, setEnhancedConfetti] = useState(false);
  const [showLearningTip, setShowLearningTip] = useState(true);

  // LOAD / SAVE
  useEffect(() => {
    try {
      const saved = localStorage.getItem(APP_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        const savedLevels = data.levels;
        if (savedLevels && typeof savedLevels === 'object') {
          const template = buildDefaultLevels();
          // Täida puuduolevad profiilid mängude kaupa
          const merged = { ...template };
          Object.entries(savedLevels).forEach(([pid, lvlObj]) => {
            merged[pid] = { ...template[pid], ...lvlObj };
          });
          setLevels(merged);
        }
        setScore(data.score || 0);
        if (typeof data.sound === 'boolean') setSoundEnabled(data.sound);
        if (data.profile && PROFILES[data.profile]) setProfile(data.profile);
        if (data.stats) {
          setStats(data.stats);
          // Sünkroniseeri collectedStars statistikaga
          if (data.stats.collectedStars) {
            setCollectedStars(data.stats.collectedStars);
          }
        }
        if (Array.isArray(data.unlockedAchievements)) setUnlockedAchievements(data.unlockedAchievements);
        if (typeof data.collectedStars === 'number' && !data.stats?.collectedStars) {
          setCollectedStars(data.collectedStars);
        }
        
        // Näita tutoriali ainult esimesel korral
        if (!data.hasSeenTutorial) {
          setShowTutorial(true);
        }
      } else {
        // Uus kasutaja
        setShowTutorial(true);
      }
    } catch {
      // Kui laadimine ebaõnnestub, näita tutoriali
      setShowTutorial(true);
    }
  }, []);

  useEffect(() => {
    try {
      // Sünkroniseeri collectedStars statistikaga
      const statsWithStars = { ...stats, collectedStars };
      localStorage.setItem(APP_KEY, JSON.stringify({ 
        levels, 
        score, 
        sound: soundEnabled, 
        profile,
        stats: statsWithStars,
        unlockedAchievements,
        hasSeenTutorial: !showTutorial,
        collectedStars
      }));
    } catch {
      // Salvestamine ebaõnnestus - vaikselt ignoreerime
    }
  }, [levels, score, soundEnabled, profile, stats, unlockedAchievements, showTutorial, collectedStars]);

  const makeKey = (prob) => {
    if (!prob) return '';
    switch(prob.type) {
      case 'word_builder': return `word:${prob.target}`;
      case 'syllable_builder': return `syll:${prob.target}`;
      case 'letter_match': return `letter:${prob.display}`;
      case 'sentence_logic': return `sent:${prob.display}`;
      case 'balance_scale': return `bal:${prob.display.left.join(',')}|${prob.display.right.join(',')}`;
      case 'pattern': return `pat:${prob.sequence.join('')}:${prob.answer}`;
      case 'memory_math': return `mem:${prob.cards.map(c=>c.content).join('|')}`;
      case 'robo_path': return `robo:${prob.gridSize}:${prob.end.x},${prob.end.y}:${prob.obstacles.map(o=>`${o.x},${o.y}`).join(';')}`;
      case 'time_match': return `time:${prob.answer}`;
      case 'unit_conversion': return `unit:${prob.value}${prob.fromUnit}=${prob.answer}${prob.toUnit}`;
      default: return `${prob.type}:${prob.answer || prob.display || prob.uid}`;
    }
  };

  const generateUniqueProblem = (type, level) => {
    const buffer = lastKeys[type] || [];
    let attempt = 0;
    let prob;
    let key;
    // Suurendame katsete arvu ja bufferi suurust
    do {
      prob = Generators[type](level, rng, profile);
      key = makeKey(prob);
      attempt++;
    } while (attempt < 15 && buffer.includes(key)); // 15 katset asemel 7
    const nextBuffer = [key, ...buffer].slice(0, 20); // 20 viimast asemel 5
    setLastKeys(prev => ({ ...prev, [type]: nextBuffer }));
    return prob;
  };
  
  const generateUniqueProblemForGame = (gameType, level) => {
    // Kui mäng on advanced versioon, kasuta base mängu tüüpi
    const baseType = gameType.replace('_adv', '');
    const actualType = baseType !== gameType ? baseType : gameType;
    return generateUniqueProblem(actualType, level);
  };

  // GAME LOOP
  const startGame = (type) => {
    setGameType(type);
    setGameState('playing');
    setBgClass('bg-slate-50');
    setFeedbackMessage(null);
    setStars(0);
    setHearts(3);
    setShowHint(false);
    setShowLearningTip(true); // Näita uue mängu alguses
    setCurrentStreak(0);
    setGameStartTime(() => Date.now());
    // Lähtesta adaptiivne raskusaste uue mängu jaoks
    setAdaptiveDifficulty(createAdaptiveDifficulty());
    playSound('click', soundEnabled);
    
    // Uuenda statistikat
    setStats(prev => {
      const updated = recordGameStart(prev, type);
      const newAchievements = checkAchievements(updated, unlockedAchievements);
      if (newAchievements.length > 0) {
        setNewAchievement(newAchievements[0]);
        setUnlockedAchievements(prevUnlocks => [...prevUnlocks, ...newAchievements.map(a => a.id)]);
      }
      return updated;
    });
    
    try { 
        const effectiveLevel = getEffectiveLevel(levels[profile][type], adaptiveDifficulty);
        setProblem(generateUniqueProblemForGame(type, effectiveLevel)); 
    } catch { 
        // Kui ülesande genereerimine ebaõnnestub, naase menüüsse
        setGameState('menu'); 
    }
  };

  const nextLevel = () => {
    playSound('click', soundEnabled);
    setShowLevelUp(false);
    setConfetti(false);
    setStars(0);
    const newLevel = (levels[profile]?.[gameType] || 1) + 1;
    setLevels(prev => ({
      ...prev, 
      [profile]: { 
        ...prev[profile], 
        [gameType]: newLevel
      }
    }));
    
    // Uuenda statistikat
    setStats(prev => {
      const updated = recordLevelUp(prev, gameType, newLevel);
      // Kontrolli achievement'e
      const newAchievements = checkAchievements(updated, unlockedAchievements);
      if (newAchievements.length > 0) {
        setNewAchievement(newAchievements[0]);
        setUnlockedAchievements(prevUnlocks => [...prevUnlocks, ...newAchievements.map(a => a.id)]);
      }
      return updated;
    });
    
    setTimeout(() => {
        const effectiveLevel = getEffectiveLevel(newLevel, adaptiveDifficulty);
        setProblem(generateUniqueProblemForGame(gameType, effectiveLevel));
        setBgClass('bg-slate-50'); 
        setFeedbackMessage(null);
    }, 100);
  };

  const handleAnswer = (isCorrect) => {
    const answerStartTime = Date.now();
    const points = isCorrect ? 10 : 0;
    
    // Uuenda adaptiivset raskusastet
    const responseTime = Date.now() - answerStartTime;
    setAdaptiveDifficulty(prev => updateAdaptiveDifficulty(prev, isCorrect, responseTime));
    
    // Uuenda streak'i
    const newStreak = isCorrect ? currentStreak + 1 : 0;
    setCurrentStreak(newStreak);
    
    // Uuenda statistikat
    setStats(prev => {
      let updated = recordAnswer(prev, isCorrect);
      if (points > 0) {
        updated = recordScore(updated, points);
      }
      
      // Kontrolli achievement'e
      const newAchievements = checkAchievements(updated, unlockedAchievements);
      if (newAchievements.length > 0) {
        setNewAchievement(newAchievements[0]);
        setUnlockedAchievements(prevUnlocks => [...prevUnlocks, ...newAchievements.map(a => a.id)]);
      }
      
      return updated;
    });
    
    if (isCorrect) {
      // Kasuta uut tagasiside süsteemi
      const encouragement = getRandomEncouragement('correct', newStreak);
      setFeedbackMessage(encouragement);
      setFeedbackType(newStreak >= 2 ? 'streak' : 'correct');
      setBgClass('bg-green-50');
      setParticleActive(true);
      setTimeout(() => setParticleActive(false), 1500);
      setScore(s => s + points);
      const newCollectedStars = collectedStars + 1;
      setCollectedStars(newCollectedStars);
      setShowHint(false);
      
      // Uuenda statistikat tähtede jaoks
      setStats(prev => {
        const updated = { ...prev, collectedStars: newCollectedStars };
        const newAchievements = checkAchievements(updated, unlockedAchievements);
        if (newAchievements.length > 0) {
          setNewAchievement(newAchievements[0]);
          setUnlockedAchievements(prevUnlocks => [...prevUnlocks, ...newAchievements.map(a => a.id)]);
        }
        return updated;
      });
      
      setStars(prevStars => {
        const nextStars = prevStars + 1;
        if (nextStars >= 5) { 
          playSound('win', soundEnabled);
          setEnhancedConfetti(true);
          setTimeout(() => {
            setConfetti(true);
            setShowLevelUp(true);
            setEnhancedConfetti(false);
          }, 800);
        } else {
          // Näita progressi - parem tagasiside
          const progressMessages = [
            '1/5 tähte! 🌟', 
            '2/5 tähte! ⭐⭐', 
            '3/5 tähte! ⭐⭐⭐', 
            '4/5 tähte! ⭐⭐⭐⭐', 
            'Viimane täht! ⭐⭐⭐⭐⭐'
          ];
          if (nextStars < 5) {
            setTimeout(() => {
              setFeedbackMessage(progressMessages[nextStars - 1] || '');
              setFeedbackType('info');
              setTimeout(() => {
                setBgClass('bg-slate-50'); 
                setFeedbackMessage(null);
                // Kasuta adaptiivset raskusastet
                const effectiveLevel = getEffectiveLevel(levels[profile][gameType], adaptiveDifficulty);
                setProblem(generateUniqueProblemForGame(gameType, effectiveLevel));
              }, 1200);
            }, 600);
          }
        }
        return nextStars;
      });
    } else {
      // Kasuta uut tagasiside süsteemi
      const encouragement = getRandomEncouragement('wrong');
      setFeedbackMessage(encouragement);
      setFeedbackType('wrong');
      setBgClass('bg-red-50');
      setShowHint(true);
      setHearts(prev => {
        const next = prev - 1;
        if (next <= 0) {
            setTimeout(() => {
              setGameState('game_over');
              if (gameStartTime) {
                const playTime = Math.floor((Date.now() - gameStartTime) / 1000);
                setStats(prevStats => ({ ...prevStats, totalTimePlayed: prevStats.totalTimePlayed + playTime }));
              }
            }, 800);
        } else {
            setTimeout(() => { 
              setBgClass('bg-slate-50'); 
              setFeedbackMessage(null);
            }, 1500);
        }
        return next;
      });
    }
  };
  
  const handleHint = () => {
    if (!problem) return;
    // Näita vihjet vastavalt mängutüübile
    let hintText = '';
    switch(problem.type) {
      case 'word_builder':
        hintText = `Vihje: Sõna algab tähega "${problem.target[0]}"`;
        break;
      case 'syllable_builder':
        hintText = `Vihje: Sõna algab silbiga "${problem.parts[0]}"`;
        break;
      case 'balance_scale': {
        const leftSum = problem.display.left.reduce((a, b) => a + b, 0);
        const rightKnown = problem.display.right.reduce((a, b) => a + b, 0);
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
    setFeedbackMessage(hintText);
    setFeedbackType('hint');
    setBgClass('bg-yellow-50');
    setTimeout(() => {
      setBgClass('bg-slate-50');
      setFeedbackMessage(null);
    }, 3000);
  };

  const resetGame = () => {
    if (confirm('Kas oled kindel, et soovid kogu progressi kustutada?')) { 
        localStorage.removeItem(APP_KEY); 
        window.location.reload(); 
    }
  };
  
  const closeAchievement = () => {
    setNewAchievement(null);
  };

  // RENDERING
  if (gameState === 'game_over') return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 p-4 animate-in fade-in">
        <div className="text-8xl mb-4 animate-bounce">😢</div>
        <h2 className="text-4xl font-black text-red-600 mb-2">Mäng Läbi!</h2>
        <p className="text-slate-600 mb-8">Said {score} punkti!</p>
        <button onClick={() => { setHearts(3); setGameState('menu'); }} className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-xl font-bold text-xl shadow-lg transition-transform active:scale-95">
            Tagasi Menüüsse
        </button>
    </div>
  );

  if (gameState === 'menu') return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 font-sans p-4 flex flex-col items-center animate-in fade-in">
      {/* Täiustatud header - värvikam ja atraktiivsem, mobiilile optimeeritud */}
      <div className="w-full max-w-md flex justify-between items-center mb-4 sm:mb-6 bg-gradient-to-r from-white to-slate-50 p-2 sm:p-4 rounded-2xl sm:rounded-3xl shadow-lg border-2 border-purple-200 backdrop-blur-sm">
         <div className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-1 sm:gap-2">
              <div className="bg-yellow-100 p-1.5 sm:p-2 rounded-lg text-yellow-600"><Trophy size={18} className="sm:w-6 sm:h-6" /></div>
              <span className="font-black text-lg sm:text-2xl text-slate-700">{score}</span>
            </div>
            {collectedStars > 0 && (
              <div className="flex items-center gap-1 sm:gap-2">
                <span className="text-xl sm:text-2xl">⭐</span>
                <span className="font-black text-base sm:text-xl text-slate-700">{collectedStars}</span>
                <span className="text-[10px] sm:text-xs text-slate-500 hidden sm:inline">tähte</span>
              </div>
            )}
         </div>
         <div className="flex items-center gap-1 sm:gap-2">
            {unlockedAchievements.length > 0 && (
              <button
                onClick={() => setShowAchievements(true)}
                className="flex items-center gap-1 px-2 py-1 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors cursor-pointer"
                title={`${unlockedAchievements.length} saavutust - kliki, et näha kõiki`}
                aria-label="Näita saavutusi"
              >
                <span className="text-lg">🏅</span>
                <span className="text-sm font-bold text-purple-700">{unlockedAchievements.length}</span>
              </button>
            )}
             <button 
               onClick={() => setShowStats(true)} 
               aria-label="Näita statistikat"
               className="p-2 sm:p-3 bg-blue-50 text-blue-600 rounded-lg sm:rounded-xl hover:bg-blue-100 transition-colors"
               title="Statistika"
             >
                <BarChart3 size={16} className="sm:w-5 sm:h-5"/>
             </button>
             <button 
               onClick={() => setSoundEnabled(!soundEnabled)} 
               aria-label={soundEnabled ? 'Lülita heli välja' : 'Lülita heli sisse'}
               className={`p-2 sm:p-3 rounded-lg sm:rounded-xl transition-colors ${soundEnabled ? 'bg-slate-100 text-slate-600' : 'bg-red-100 text-red-500'}`}
             >
                {soundEnabled ? <Volume2 size={16} className="sm:w-5 sm:h-5"/> : <VolumeX size={16} className="sm:w-5 sm:h-5"/>}
             </button>
             <button 
               onClick={resetGame} 
               aria-label="Kustuta salvestatud progress"
               className="p-2 sm:p-3 bg-slate-100 text-slate-400 rounded-lg sm:rounded-xl hover:bg-red-50 hover:text-red-500 transition-colors">
                <Trash2 size={16} className="sm:w-5 sm:h-5"/>
             </button>
         </div>
      </div>
      
      {showStats && (
        <StatsModal 
          stats={stats} 
          unlockedAchievements={unlockedAchievements}
          onClose={() => setShowStats(false)} 
        />
      )}
      
      {showAchievements && (
        <AchievementsModal
          unlockedAchievements={unlockedAchievements}
          onClose={() => setShowAchievements(false)}
        />
      )}
      
      {showTutorial && (
        <TutorialModal 
          onClose={() => setShowTutorial(false)}
          soundEnabled={soundEnabled}
        />
      )}
      
      {/* Täiustatud pealkiri - värvikam ja atraktiivsem, mobiilile optimeeritud */}
      <div className="flex items-center justify-between w-full max-w-md mb-4 sm:mb-6">
        <div className="flex-1">
          <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
            <div className="text-3xl sm:text-5xl animate-bounce">🚀</div>
            <div>
              <h1 className="text-2xl sm:text-4xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent tracking-tight">
                Tarkade Mängud
              </h1>
              <div className="flex items-center gap-1 sm:gap-2 mt-0.5 sm:mt-1">
                <span className="text-[10px] sm:text-xs font-bold text-purple-600 bg-purple-100 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
                  HARJUTA JA ÕPI
                </span>
              </div>
            </div>
          </div>
          <p className="text-sm sm:text-base font-bold text-slate-700 mt-1 sm:mt-2 leading-relaxed">
            {profile === 'starter' 
              ? '👶 Vali mäng ja harjuta lugemist ja loogikat!' 
              : '🧒 Vali mäng ja harjuta matemaatikat ja mõtlemist!'}
          </p>
          {collectedStars > 0 && (
            <div className="mt-2 flex items-center gap-2 flex-wrap">
              {collectedStars >= 50 && collectedStars < 100 && (
                <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-bold">
                  ⭐ Tähtede koguja!
                </span>
              )}
              {collectedStars >= 100 && collectedStars < 250 && (
                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-bold">
                  ⭐⭐ Tähtede meister!
                </span>
              )}
              {collectedStars >= 250 && (
                <span className="text-xs bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-2 py-0.5 rounded-full font-bold">
                  ✨ Tähtede legenda!
                </span>
              )}
            </div>
          )}
        </div>
        <button
          onClick={() => setShowTutorial(true)}
          className="px-2 sm:px-4 py-1.5 sm:py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm transition-colors"
          aria-label="Näita juhendit"
        >
          ❓ Juhend
        </button>
      </div>
      {/* Täiustatud profiilide valik - värvikam, mobiilile optimeeritud */}
      <div className="flex gap-2 sm:gap-3 mb-4 sm:mb-6 w-full max-w-md">
        {Object.values(PROFILES).map(p => (
          <button
            key={p.id}
            onClick={() => setProfile(p.id)}
            className={`
              flex-1 py-2.5 sm:py-4 rounded-xl sm:rounded-2xl border-3 sm:border-4 font-black text-xs sm:text-sm tracking-wide 
              transition-all duration-300
              ${profile === p.id 
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-purple-400 shadow-xl scale-[1.02] sm:scale-[1.03] transform -translate-y-0.5 sm:-translate-y-1' 
                : 'bg-white text-slate-700 border-slate-300 hover:border-purple-300 hover:shadow-lg hover:scale-[1.01]'}
            `}
          >
            <div className="flex items-center justify-center gap-1 sm:gap-2">
              <span className="text-xl sm:text-2xl">{p.emoji || '👤'}</span>
              <div className="text-left">
                <div className="text-sm sm:text-base">{p.label}</div>
                <div className={`text-[10px] sm:text-xs ${profile === p.id ? 'text-purple-100' : 'text-slate-500'}`}>
                  {p.desc}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
      
      {/* Täiustatud mängude loend - värvikam, mobiilile optimeeritud */}
      <div className="mb-4 sm:mb-6 text-center">
        <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-white/80 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border-2 border-purple-200 shadow-sm">
          <span className="text-xl sm:text-2xl">🎮</span>
          <span className="font-black text-xs sm:text-base text-slate-700">
            {Object.entries(GAME_CONFIG).filter(([, conf]) => !conf.allowedProfiles || conf.allowedProfiles.includes(profile)).length} mängu
          </span>
        </div>
      </div>

      {/* Mängud kategooriate kaupa */}
      <div className="w-full max-w-md pb-6 sm:pb-10">
        {Object.values(CATEGORIES).map(category => {
          const categoryGames = Object.entries(GAME_CONFIG)
            .filter(([, conf]) => 
              conf.category === category.id && 
              (!conf.allowedProfiles || conf.allowedProfiles.includes(profile))
            );
          
          if (categoryGames.length === 0) return null;
          
          return (
            <div key={category.id} className="mb-6 sm:mb-8">
              {/* Category header */}
              <div className="mb-3 sm:mb-4 text-center">
                <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full border-2 border-purple-200 shadow-sm">
                  <span className="text-xl sm:text-2xl">{category.emoji}</span>
                  <span className="font-black text-sm sm:text-base text-slate-700">
                    {category.name}
                  </span>
                </div>
              </div>
              
              {/* Games grid */}
              <div className="grid grid-cols-1 gap-3 sm:gap-5">
                {categoryGames.map(([key, conf], idx) => {
                  const Icon = ICON_MAP[conf.icon] || Type;
                  const gameStats = stats.gamesByType?.[key] || 0;
                  const isNew = gameStats === 0;
                  return (
                    <GameCard
                      key={key}
                      gameConfig={{ ...conf, iconComponent: Icon }}
                      level={levels[profile][key]}
                      onClick={() => startGame(key)}
                      badge={isNew ? 'UUS!' : null}
                      delay={idx * 50}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen font-sans flex flex-col ${bgClass} transition-colors duration-500 select-none overflow-hidden`}>
      {confetti && <Confetti />}
      {enhancedConfetti && <EnhancedConfetti active={enhancedConfetti} onComplete={() => setEnhancedConfetti(false)} />}
      <ParticleEffect type="success" active={particleActive} />
      {showLevelUp && <LevelUpModal level={levels[profile][gameType] + 1} onNext={nextLevel} gameConfig={GAME_CONFIG[gameType]} />}
      {newAchievement && <AchievementModal achievement={newAchievement} onClose={closeAchievement} soundEnabled={soundEnabled} />}
      
      {/* Uus täiustatud tagasiside */}
      <FeedbackMessage 
        message={feedbackMessage} 
        type={feedbackType} 
        duration={2500}
        onComplete={() => setFeedbackMessage(null)}
        soundEnabled={soundEnabled}
      />
      
      <div className="flex justify-between items-center p-2 sm:p-3 bg-white/80 backdrop-blur-md border-b-3 sm:border-b-4 border-slate-200 sticky top-0 z-40 shadow-sm">
        <button 
          onClick={() => setGameState('menu')} 
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
          {/* Täiustatud progress bar - väiksem mobiilil */}
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

      <div className="flex-1 flex flex-col items-center p-4 max-w-2xl mx-auto w-full relative">

        {!problem ? <Loader2 className="animate-spin mt-20 text-slate-400" size={48}/> : (
          <div key={problem.uid} className="w-full flex justify-center pb-8">
            {/* Määra base game type (_adv eemaldamine) */}
            {(() => {
              const baseGameType = gameType.replace('_adv', '');
              
              if (baseGameType === 'word_builder') {
                return <WordGameView problem={problem} onAnswer={handleAnswer} soundEnabled={soundEnabled} />;
              }
              if (baseGameType === 'memory_math') {
                return <MemoryGameView problem={problem} onAnswer={handleAnswer} soundEnabled={soundEnabled} />;
              }
              if (baseGameType === 'pattern') {
                return <PatternTrainView problem={problem} onAnswer={handleAnswer} soundEnabled={soundEnabled} />;
              }
              if (baseGameType === 'balance_scale') {
                return <BalanceScaleView problem={problem} onAnswer={handleAnswer} soundEnabled={soundEnabled} />;
              }
              if (baseGameType === 'robo_path') {
                return <RoboPathView problem={problem} onAnswer={handleAnswer} soundEnabled={soundEnabled} />;
              }
              if (baseGameType === 'syllable_builder') {
                return <SyllableGameView problem={problem} onAnswer={handleAnswer} soundEnabled={soundEnabled} />;
              }
              if (baseGameType === 'time_match') {
                return <TimeGameView problem={problem} onAnswer={handleAnswer} soundEnabled={soundEnabled} />;
              }
              if (baseGameType === 'unit_conversion') {
                return <UnitConversionView problem={problem} onAnswer={handleAnswer} soundEnabled={soundEnabled} />;
              }
              if (baseGameType === 'letter_match' || baseGameType === 'sentence_logic') {
                return <StandardGameView problem={problem} onAnswer={handleAnswer} soundEnabled={soundEnabled} />;
              }
              
              // Fallback - kui mängutüüp on tundmatu
              return <div className="text-center p-8 text-red-600">Viga: Tundmatu mängutüüp "{gameType}"</div>;
            })()}
            
            {/* Vihje nupp - näita ainult mängu ajal ja kui on vaja */}
            {showHint && (
              <HintButton 
                onHint={handleHint} 
                soundEnabled={soundEnabled}
                disabled={false}
              />
            )}
            
            {/* Hariduslikud näpunäited - näita ainult kui vihjet pole (et ei oleks duplikaat) */}
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

export default SmartAdventure;
