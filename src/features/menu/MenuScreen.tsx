import React, { useState, useEffect, useRef } from 'react';
import { 
  Trophy, Trash2, Volume2, VolumeX, BarChart3,
  Type, Brain, Scale, BookOpen, GraduationCap, TrainFront, Bot, Clock3, Ruler, ChevronDown, ChevronUp, Languages
} from 'lucide-react';
import { useGameStore } from '../../stores/gameStore';
import { usePlaySessionStore } from '../../stores/playSessionStore';
import { useGameAudio } from '../../hooks/useGameAudio';
import { GameCard } from '../../components/GameCard';
import { StatsModal } from '../modals/StatsModal';
import { AchievementsModal } from '../modals/AchievementsModal';
import { TutorialModal } from '../modals/TutorialModal';
import { GAME_CONFIG, PROFILES, CATEGORIES } from '../../games/data';
import { ACHIEVEMENTS } from '../../engine/achievements';
import { useTranslation } from '../../i18n/useTranslation';
import { getLocale, setLocale, type SupportedLocale } from '../../i18n';
import type { ProfileType } from '../../types/game';
import type { AchievementUnlock } from '../../types/achievement';

const ICON_MAP = { Type, Brain, Scale, BookOpen, GraduationCap, TrainFront, Bot, Clock3, Ruler };

export const MenuScreen: React.FC = () => {
  const t = useTranslation();
  const profile = useGameStore(state => state.profile);
  const score = useGameStore(state => state.score);
  const collectedStars = useGameStore(state => state.collectedStars);
  const unlockedAchievements = useGameStore(state => state.unlockedAchievements);
  const soundEnabled = useGameStore(state => state.soundEnabled);
  const stats = useGameStore(state => state.stats);
  const hasSeenTutorial = useGameStore(state => state.hasSeenTutorial);
  const levels = useGameStore(state => state.levels);
  
  const setProfile = useGameStore(state => state.setProfile);
  const toggleSound = useGameStore(state => state.toggleSound);
  const resetGame = useGameStore(state => state.resetGame);
  const markTutorialSeen = useGameStore(state => state.markTutorialSeen);
  const recordGameStart = useGameStore(state => state.recordGameStart);
  
  const startGame = usePlaySessionStore(state => state.startGame);
  const setShowAchievement = usePlaySessionStore(state => state.setShowAchievement);
  
  const { playClick } = useGameAudio(soundEnabled);
  
  const [showStats, setShowStats] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showTutorial, setShowTutorial] = useState(!hasSeenTutorial);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const currentLocale = getLocale();
  const languageMenuRef = useRef<HTMLDivElement>(null);

  // Close language menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (languageMenuRef.current && !languageMenuRef.current.contains(event.target as Node)) {
        setShowLanguageMenu(false);
      }
    };

    if (showLanguageMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showLanguageMenu]);

  const handleStartGame = (gameType: string) => {
    playClick();
    
    // Record game start and check for achievements
    const { newAchievements } = recordGameStart(gameType);
    if (newAchievements.length > 0) {
      setShowAchievement(newAchievements[0] ?? null);
    }
    
    startGame(gameType);
  };

  const toggleCategory = (categoryId: string) => {
    playClick();
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const handleCloseTutorial = () => {
    setShowTutorial(false);
    markTutorialSeen();
  };

  const handleLanguageChange = (locale: SupportedLocale) => {
    setLocale(locale);
    setShowLanguageMenu(false);
    playClick();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 font-sans p-4 flex flex-col items-center animate-in fade-in">
      {/* Header */}
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
              <span className="text-[10px] sm:text-xs text-slate-500 hidden sm:inline">{t.menuSpecific.starsLabel}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          {unlockedAchievements.length > 0 && (
            <button
              onClick={() => setShowAchievements(true)}
              className="flex items-center gap-1 px-2 py-1 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors cursor-pointer"
              title={`${unlockedAchievements.length} ${t.menuSpecific.achievementsCount}`}
              aria-label={t.menuSpecific.showAchievements}
            >
              <span className="text-lg">🏅</span>
              <span className="text-sm font-bold text-purple-700">{unlockedAchievements.length}</span>
            </button>
          )}
          <button 
            onClick={() => setShowStats(true)} 
            aria-label={t.menuSpecific.showStats}
            className="p-2 sm:p-3 bg-blue-50 text-blue-600 rounded-lg sm:rounded-xl hover:bg-blue-100 transition-colors"
            title={t.menu.stats}
          >
            <BarChart3 size={16} className="sm:w-5 sm:h-5"/>
          </button>
          <div className="relative" ref={languageMenuRef}>
            <button 
              onClick={() => {
                setShowLanguageMenu(!showLanguageMenu);
                playClick();
              }} 
              aria-label={t.menuSpecific.selectLanguage}
              className="p-2 sm:p-3 bg-slate-50 text-slate-600 rounded-lg sm:rounded-xl hover:bg-slate-100 transition-colors"
              title={t.menuSpecific.language}
            >
              <Languages size={16} className="sm:w-5 sm:h-5"/>
            </button>
            {showLanguageMenu && (
              <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-lg border-2 border-slate-200 overflow-hidden z-50">
                <button
                  onClick={() => handleLanguageChange('et')}
                  className={`w-full px-4 py-2 text-left hover:bg-slate-50 transition-colors ${
                    currentLocale === 'et' ? 'bg-purple-50 text-purple-700 font-bold' : 'text-slate-700'
                  }`}
                >
                  🇪🇪 Eesti
                </button>
                <button
                  onClick={() => handleLanguageChange('en')}
                  className={`w-full px-4 py-2 text-left hover:bg-slate-50 transition-colors ${
                    currentLocale === 'en' ? 'bg-purple-50 text-purple-700 font-bold' : 'text-slate-700'
                  }`}
                >
                  🇬🇧 English
                </button>
              </div>
            )}
          </div>
          <button 
            onClick={toggleSound} 
            aria-label={soundEnabled ? t.menuSpecific.toggleSoundOff : t.menuSpecific.toggleSoundOn}
            className={`p-2 sm:p-3 rounded-lg sm:rounded-xl transition-colors ${soundEnabled ? 'bg-slate-100 text-slate-600' : 'bg-red-100 text-red-500'}`}
          >
            {soundEnabled ? <Volume2 size={16} className="sm:w-5 sm:h-5"/> : <VolumeX size={16} className="sm:w-5 sm:h-5"/>}
          </button>
          <button 
            onClick={resetGame} 
            aria-label={t.menuSpecific.deleteProgress}
            className="p-2 sm:p-3 bg-slate-100 text-slate-400 rounded-lg sm:rounded-xl hover:bg-red-50 hover:text-red-500 transition-colors">
            <Trash2 size={16} className="sm:w-5 sm:h-5"/>
          </button>
        </div>
      </div>
      
      {/* Modals */}
      {showStats && (
        <StatsModal 
          stats={stats} 
          unlockedAchievements={unlockedAchievements.map(id => {
            const achievement = ACHIEVEMENTS[id];
            if (!achievement) return null;
            return {
              id: achievement.id,
              title: achievement.title,
              desc: achievement.desc,
              icon: achievement.icon
            };
          }).filter((a): a is AchievementUnlock => a !== null)}
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
          onClose={handleCloseTutorial}
        />
      )}
      
      {/* Title */}
      <div className="flex items-center justify-between w-full max-w-md mb-4 sm:mb-6">
        <div className="flex-1">
          <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
            <div className="text-3xl sm:text-5xl animate-bounce">🚀</div>
            <div>
              <h1 className="text-2xl sm:text-4xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent tracking-tight">
                {t.menu.title}
              </h1>
              <div className="flex items-center gap-1 sm:gap-2 mt-0.5 sm:mt-1">
                <span className="text-[10px] sm:text-xs font-bold text-purple-600 bg-purple-100 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
                  {t.menuSpecific.subtitle}
                </span>
              </div>
            </div>
          </div>
          <p className="text-sm sm:text-base font-bold text-slate-700 mt-1 sm:mt-2 leading-relaxed">
            {profile === 'starter' 
              ? t.menuSpecific.starterDescription
              : t.menuSpecific.advancedDescription}
          </p>
          {collectedStars > 0 && (
            <div className="mt-2 flex items-center gap-2 flex-wrap">
              {collectedStars >= 50 && collectedStars < 100 && (
                <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-bold">
                  {t.menuSpecific.starCollector}
                </span>
              )}
              {collectedStars >= 100 && collectedStars < 250 && (
                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-bold">
                  {t.menuSpecific.starMaster}
                </span>
              )}
              {collectedStars >= 250 && (
                <span className="text-xs bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-2 py-0.5 rounded-full font-bold">
                  {t.menuSpecific.starLegend}
                </span>
              )}
            </div>
          )}
        </div>
        <button
          onClick={() => setShowTutorial(true)}
          className="px-2 sm:px-4 py-1.5 sm:py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm transition-colors"
          aria-label={t.menuSpecific.showTutorial}
        >
          ❓ {t.menuSpecific.tutorial}
        </button>
      </div>
      
      {/* Profile selector */}
      <div className="flex gap-2 sm:gap-3 mb-4 sm:mb-6 w-full max-w-md">
        {Object.values(PROFILES).map(p => (
          <button
            key={p.id}
            onClick={() => {
              playClick();
              setProfile(p.id);
            }}
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
                  {t.profiles[p.id as keyof typeof t.profiles]?.desc || p.desc}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
      
      {/* Game count */}
      <div className="mb-4 sm:mb-6 text-center">
        <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-white/80 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border-2 border-purple-200 shadow-sm">
          <span className="text-xl sm:text-2xl">🎮</span>
          <span className="font-black text-xs sm:text-base text-slate-700">
            {Object.entries(GAME_CONFIG).filter(([, conf]) => !conf.allowedProfiles || conf.allowedProfiles.includes(profile as ProfileType)).length} {t.menuSpecific.gamesCount}
          </span>
        </div>
      </div>

      {/* Games by category */}
      <div className="w-full max-w-md pb-6 sm:pb-10">
        {Object.values(CATEGORIES).map(category => {
          const categoryGames = Object.entries(GAME_CONFIG)
            .filter(([, conf]) => 
              conf.category === category.id && 
              (!conf.allowedProfiles || conf.allowedProfiles.includes(profile as ProfileType))
            );
          
          if (categoryGames.length === 0) return null;
          
          const isExpanded = expandedCategories[category.id];
          
          return (
            <div key={category.id} className="mb-4 sm:mb-6">
              {/* Category header */}
              <div className="mb-3 sm:mb-4">
                <button
                  onClick={() => toggleCategory(category.id)}
                  className="w-full flex items-center justify-between bg-white/90 backdrop-blur-sm px-4 sm:px-5 py-3 sm:py-4 rounded-2xl border-2 border-purple-200 shadow-sm hover:shadow-md hover:border-purple-300 transition-all active:scale-[0.98] cursor-pointer"
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <span className="text-2xl sm:text-3xl">{category.emoji}</span>
                    <span className="font-black text-base sm:text-lg text-slate-700">
                      {t.categories[category.id as keyof typeof t.categories]?.name || category.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <span className="text-sm sm:text-base text-slate-500 font-bold bg-slate-100 px-2 sm:px-3 py-1 rounded-full">
                      {categoryGames.length}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 sm:w-6 sm:h-6 text-slate-600" />
                    ) : (
                      <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-slate-600" />
                    )}
                  </div>
                </button>
              </div>
              
              {/* Games grid */}
              {isExpanded && (
                <div className="grid grid-cols-1 gap-3 sm:gap-5 animate-fadeIn">
                  {categoryGames.map(([key, conf], idx) => {
                    const Icon = ICON_MAP[conf.icon as keyof typeof ICON_MAP] || Type;
                    const gameStats = stats.gamesByType?.[key] || 0;
                    const isNew = gameStats === 0;
                    const currentLevel = levels[profile]?.[key] ?? 1;
                    return (
                      <GameCard
                        key={key}
                        gameConfig={{ ...conf, iconComponent: Icon }}
                        level={currentLevel}
                        onClick={() => handleStartGame(key)}
                        badge={isNew ? t.menuSpecific.newGame : null}
                        delay={idx * 50}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
