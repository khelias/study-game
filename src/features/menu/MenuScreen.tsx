import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Trash2, Volume2, VolumeX, BarChart3,
  Type, Brain, Scale, BookOpen, GraduationCap, TrainFront, Bot, Clock3, Ruler, Gamepad2, ChevronDown, ChevronUp, Languages, Menu, X, Hash, FileText, Layers, Search, Star, Anchor, Pencil
} from 'lucide-react';
import { useGameStore } from '../../stores/gameStore';
import { useGameAudio } from '../../hooks/useGameAudio';
import { GameCard } from '../../components/GameCard';
import { StatsModal } from '../modals/StatsModal';
import { AchievementsModal } from '../modals/AchievementsModal';
import { TutorialModal } from '../modals/TutorialModal';
import { ShopModal } from '../modals/ShopModal';
import { GAME_CONFIG, PROFILES, CATEGORIES } from '../../games/data';
import { ACHIEVEMENTS } from '../../engine/achievements';

const TOTAL_ACHIEVEMENTS = Object.keys(ACHIEVEMENTS).length;
import { useTranslation } from '../../i18n/useTranslation';
import { useProfileText } from '../../hooks/useProfileText';
import { type SupportedLocale } from '../../i18n';
import { getAchievementCopy } from '../../utils/achievementCopy';
import { ResourceBadge } from '../../components/shared/ResourceBadge';
import { SmartGamesLogo } from '../../components/shared/SmartGamesLogo';
import { SettingsMenu } from '../../components/SettingsMenu';
import type { ProfileType } from '../../types/game';
import type { AchievementUnlock } from '../../types/achievement';
import { gameIdToSlug } from '../../utils/gameSlug';

const ICON_MAP = { Type, Brain, Scale, BookOpen, GraduationCap, TrainFront, Bot, Clock3, Ruler, Gamepad2, Hash, FileText, Layers, Search, Star, Anchor };

export const MenuScreen: React.FC = () => {
  const navigate = useNavigate();
  const t = useTranslation();
  const { formatText } = useProfileText();
  const profile = useGameStore(state => state.profile);
  const stars = useGameStore(state => state.stars); // Persistent currency
  const hearts = useGameStore(state => state.hearts); // Persistent global resource
  const unlockedAchievements = useGameStore(state => state.unlockedAchievements);
  const soundEnabled = useGameStore(state => state.soundEnabled);
  const stats = useGameStore(state => state.stats);
  const hasSeenTutorial = useGameStore(state => state.hasSeenTutorial);
  const levels = useGameStore(state => state.levels);
  const getHighScore = useGameStore(state => state.getHighScore);
  const favouriteGameIds = useGameStore(state => state.favouriteGameIds);
  const setFavouriteGameIds = useGameStore(state => state.setFavouriteGameIds);
  
  const setProfile = useGameStore(state => state.setProfile);
  const toggleSound = useGameStore(state => state.toggleSound);
  const resetGame = useGameStore(state => state.resetGame);
  const markTutorialSeen = useGameStore(state => state.markTutorialSeen);
  // Game start logic is handled by GameRoute when navigating to /games/:slug
  
  const { playClick } = useGameAudio(soundEnabled);
  
  const [showStats, setShowStats] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [showTutorial, setShowTutorial] = useState(!hasSeenTutorial);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [showFavourites, setShowFavourites] = useState(() => favouriteGameIds.length > 0);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [showEditFavourites, setShowEditFavourites] = useState(false);
  const [editFavouritesDraft, setEditFavouritesDraft] = useState<string[]>([]);
  const settingsMenuRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Check for openShop query parameter (from GameResultScreen)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('openShop') === 'true') {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- sync from URL on mount
      setShowShop(true);
      window.history.replaceState({}, '', '/');
    }
  }, []);
  const settingsLabel = formatText(t.menu.settings);

  // Close settings menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (settingsMenuRef.current && !settingsMenuRef.current.contains(event.target as Node)) {
        setShowSettingsMenu(false);
      }
    };

    if (showSettingsMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSettingsMenu]);

  const handleStartGame = (gameType: string) => {
    playClick();
    
    // Check if player has hearts before starting
    if (hearts <= 0) {
      // Open shop to buy hearts (with flag to show no hearts message)
      setShowShop(true);
      return;
    }
    
    // Navigate to the game route using URL slug
    const slug = gameIdToSlug(gameType);
    void navigate(`/games/${slug}`);
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


  return (
    <div className="h-dvh min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 font-sans flex flex-col items-center overflow-hidden animate-in fade-in">
      {/* Scrollable area so viewport resize (e.g. mobile URL bar) doesn't reset scroll */}
      <div ref={scrollContainerRef} className="flex-1 min-h-0 w-full overflow-y-auto overflow-x-hidden overscroll-contain">
      {/* Header - Matches GameHeader exactly, starts from top */}
      <div className="w-full bg-white/90 backdrop-blur-md border-b-2 sm:border-b-4 border-slate-200 sticky top-0 z-40 shadow-sm flex-shrink-0">
        <div className="w-full max-w-2xl mx-auto flex items-center justify-between gap-2 sm:gap-3 px-2 sm:px-4 p-2 sm:p-2.5 min-h-[56px] sm:min-h-[64px]">
          {/* Left: App Icon + Stars */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => {
                playClick();
                // Reset menu to default state
                setExpandedCategories({});
                setShowFavourites(favouriteGameIds.length > 0);
                setShowStats(false);
                setShowAchievements(false);
                setShowShop(false);
                setShowSettingsMenu(false);
                // Scroll menu content to top
                scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="bg-slate-100 hover:bg-slate-200 p-2 rounded-lg transition-colors active:scale-90 flex items-center justify-center"
              aria-label="Smart Games"
              title="Smart Games"
            >
              <SmartGamesLogo />
            </button>
            <ResourceBadge 
              type="stars" 
              value={stars} 
              compact={true} 
              onClick={() => {
                setShowShop(true);
                playClick();
              }}
            />
          </div>

          {/* Center: Achievements - Styled like progress bar */}
          <div className="flex-1 flex flex-col items-center gap-1 min-w-0 mx-2 sm:mx-4">
            <button
              onClick={() => {
                setShowAchievements(true);
                playClick();
              }}
              className="w-full max-w-[120px] sm:max-w-[180px] flex flex-col items-center gap-1"
              title={formatText(t.menuSpecific.showAchievements)}
              aria-label={t.menuSpecific.showAchievements}
            >
              <div className="text-xs sm:text-sm font-bold text-slate-700 text-center">
                🏅 {unlockedAchievements.length}
              </div>
              <div className="w-full h-2 sm:h-2.5 bg-slate-200 rounded-full overflow-hidden shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-purple-400 via-purple-500 to-pink-500 transition-all duration-500 ease-out rounded-full"
                  style={{ width: `${Math.min(100, (unlockedAchievements.length / Math.max(1, TOTAL_ACHIEVEMENTS)) * 100)}%` }}
                />
              </div>
            </button>
          </div>

          {/* Right: Hearts + Menu */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <ResourceBadge 
              type="hearts" 
              value={hearts} 
              maxValue={5} 
              compact={true}
              onClick={() => {
                setShowShop(true);
                playClick();
              }}
            />
            <div className="relative" ref={settingsMenuRef}>
              <button 
                onClick={() => {
                  setShowSettingsMenu(!showSettingsMenu);
                  playClick();
                }} 
                aria-label={settingsLabel}
                className="bg-slate-100 hover:bg-slate-200 p-2 rounded-lg transition-colors active:scale-90 flex items-center justify-center"
                title={settingsLabel}
              >
                {showSettingsMenu ? <X size={18} className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600"/> : <Menu size={18} className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600"/>}
              </button>
              {showSettingsMenu && (
                <SettingsMenu
                  soundEnabled={soundEnabled}
                  onToggleSound={() => {
                    toggleSound();
                    playClick();
                  }}
                  onReturnToMenu={() => {
                    // Not used in MenuScreen
                  }}
                  onClose={() => setShowSettingsMenu(false)}
                  onShowAchievements={() => {
                    setShowAchievements(true);
                    setShowSettingsMenu(false);
                  }}
                  onShowStats={() => {
                    setShowStats(true);
                    setShowSettingsMenu(false);
                  }}
                  onShowShop={() => {
                    setShowShop(true);
                    setShowSettingsMenu(false);
                  }}
                  unlockedAchievements={unlockedAchievements}
                  isGameScreen={false}
                  onDeleteProgress={() => {
                    resetGame();
                    setShowSettingsMenu(false);
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Content area with padding */}
      <div className="w-full max-w-2xl mx-auto px-4 pt-4 pb-6 sm:pb-10 flex flex-col items-center">
      
      {/* Modals */}
      {showStats && (
        <StatsModal 
          key="stats-modal"
          stats={stats} 
          unlockedAchievements={unlockedAchievements.map(id => {
            const achievement = ACHIEVEMENTS[id];
            if (!achievement) return null;
            const copy = getAchievementCopy(t, achievement.id);
            return {
              id: achievement.id,
              title: copy.title,
              desc: copy.desc,
              icon: achievement.icon
            };
          }).filter((a): a is AchievementUnlock => a !== null)}
          onClose={() => setShowStats(false)} 
        />
      )}
      
      {showAchievements && (
        <AchievementsModal
          key="achievements-modal"
          unlockedAchievements={unlockedAchievements}
          onClose={() => setShowAchievements(false)}
        />
      )}
      
      {showShop && (
        <ShopModal
          key="shop-modal"
          onClose={() => setShowShop(false)}
          openedFromNoHearts={hearts <= 0}
        />
      )}
      
      {showTutorial && (
        <TutorialModal 
          key="tutorial-modal"
          onClose={handleCloseTutorial}
        />
      )}
      
      {/* Title Section - Cleaner design */}
      <div className="w-full mb-4 sm:mb-5">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="flex-1">
            <h1 className={`text-2xl sm:text-3xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent ${profile === 'starter' ? 'tracking-tight' : 'tracking-normal'}`}>
              {formatText(t.menu.title)}
            </h1>
            <p className={`text-xs sm:text-sm text-slate-600 mt-1 ${profile === 'starter' ? 'uppercase font-semibold' : 'font-medium'}`}>
              {formatText(profile === 'starter' 
                ? t.menuSpecific.starterDescription
                : t.menuSpecific.advancedDescription)}
            </p>
          </div>
          <button
            onClick={() => setShowTutorial(true)}
            className="flex-shrink-0 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3 sm:px-4 py-1.5 sm:py-2 text-blue-700 rounded-lg font-semibold text-xs sm:text-sm transition-colors"
            aria-label={formatText(t.menuSpecific.showTutorial)}
          >
            ❓ {formatText(t.menuSpecific.tutorial)}
          </button>
        </div>
      </div>
      
      {/* Profile selector - Refined */}
      <div className="w-full mb-4 sm:mb-5">
        <div className="flex gap-2 sm:gap-3">
          {Object.values(PROFILES).map(p => (
            <button
              key={p.id}
              onClick={() => {
                playClick();
                setProfile(p.id);
              }}
              className={`
                flex-1 py-2.5 sm:py-3 rounded-xl border-2 font-semibold text-xs sm:text-sm 
                transition-all duration-200
                ${profile === p.id 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-purple-400 shadow-md' 
                  : 'bg-white text-slate-700 border-slate-200 hover:border-purple-300 hover:shadow-sm'}
              `}
            >
              <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                <span className="text-lg sm:text-xl">{p.emoji || '👤'}</span>
                <div className="text-left">
                  <div className="font-bold">{p.label}</div>
                  <div className={`text-[10px] sm:text-xs ${profile === p.id ? 'text-purple-50' : 'text-slate-500'}`}>
                    {formatText(t.profiles[p.id as keyof typeof t.profiles]?.desc || p.desc)}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
      
      {/* Favourites Section */}
      <div className="w-full mb-4 sm:mb-5">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              playClick();
              setShowFavourites(!showFavourites);
            }}
            className="flex-1 flex items-center justify-between bg-white border-2 border-slate-200 hover:border-emerald-300 px-4 py-3 rounded-xl shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-xl sm:text-2xl">❤️</span>
              <span className="font-bold text-sm sm:text-base text-slate-700">
                {formatText(t.menu.favourites)}
              </span>
            </div>
            {showFavourites ? (
              <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
            ) : (
              <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
            )}
          </button>
          <button
            onClick={() => {
              playClick();
              setEditFavouritesDraft([...favouriteGameIds]);
              setShowEditFavourites(true);
            }}
            className="p-2.5 rounded-xl bg-white border-2 border-slate-200 hover:border-emerald-300 shadow-sm hover:shadow-md transition-all"
            aria-label={formatText(t.menuSpecific.editFavourites)}
            title={formatText(t.menuSpecific.editFavourites)}
          >
            <Pencil className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
          </button>
        </div>
        
        {/* Favourites games grid */}
        {showFavourites && (
          <div className="grid grid-cols-1 gap-3 sm:gap-4 mt-3 animate-fadeIn">
            {favouriteGameIds
              .filter((key) => GAME_CONFIG[key]?.allowedProfiles?.includes(profile as ProfileType))
              .map((key) => {
                const conf = GAME_CONFIG[key];
                if (!conf) return null;
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
                    badge={isNew ? formatText(t.menuSpecific.newGame) : null}
                    delay={0}
                    highScore={getHighScore(key)}
                  />
                );
              })}
          </div>
        )}
      </div>

      {/* Edit Favourites modal */}
      {showEditFavourites && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[85vh] flex flex-col border-2 border-slate-200 animate-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-slate-200">
              <h2 className="text-lg font-bold text-slate-800">{formatText(t.menuSpecific.editFavouritesTitle)}</h2>
            </div>
            <div className="p-4 overflow-y-auto flex-1">
              {Object.values(CATEGORIES).map((category) => {
                const categoryGames = Object.entries(GAME_CONFIG)
                  .filter(
                    ([key, conf]) =>
                      conf.category === category.id &&
                      conf.allowedProfiles?.includes(profile as ProfileType)
                  );
                if (categoryGames.length === 0) return null;
                const categoryName = formatText(t.categories[category.id as keyof typeof t.categories]?.name ?? category.name);
                return (
                  <div key={category.id} className="mb-4">
                    <div className="flex items-center gap-2 mb-2 px-1 text-slate-500 text-sm font-semibold">
                      <span className="text-lg" aria-hidden>{category.emoji}</span>
                      <span>{categoryName}</span>
                    </div>
                    {categoryGames.map(([key, conf]) => {
                      const isChecked = editFavouritesDraft.includes(key);
                      const gameName = t.games[key as keyof typeof t.games]?.title ?? conf.title;
                      const gameEmoji = conf.emoji ?? CATEGORIES[conf.category]?.emoji ?? '🎮';
                      return (
                        <label
                          key={key}
                          className="flex items-center gap-3 py-2.5 px-3 rounded-xl hover:bg-slate-50 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {
                              if (isChecked) {
                                setEditFavouritesDraft((prev) => prev.filter((id) => id !== key));
                              } else {
                                setEditFavouritesDraft((prev) => [...prev, key]);
                              }
                            }}
                            className="w-5 h-5 rounded border-2 border-slate-300 text-emerald-600 focus:ring-emerald-500"
                          />
                          <span className="text-xl sm:text-2xl shrink-0" aria-hidden>{gameEmoji}</span>
                          <span className="font-semibold text-slate-800">{formatText(gameName)}</span>
                        </label>
                      );
                    })}
                  </div>
                );
              })}
            </div>
            <div className="p-4 border-t border-slate-200 flex gap-2 justify-end">
              <button
                onClick={() => {
                  playClick();
                  setShowEditFavourites(false);
                }}
                className="px-4 py-2 rounded-xl border-2 border-slate-200 font-semibold text-slate-700 hover:bg-slate-50"
              >
                {formatText(t.common.cancel)}
              </button>
              <button
                onClick={() => {
                  playClick();
                  setFavouriteGameIds(editFavouritesDraft);
                  setShowEditFavourites(false);
                  if (editFavouritesDraft.length === 0) setShowFavourites(false);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600"
              >
                {formatText(t.menuSpecific.save)}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Games by category - Refined */}
      <div className="w-full pb-6 sm:pb-10">
        {Object.values(CATEGORIES).map(category => {
          // All games appear in their category; favourites also appear in Favourites section
          const categoryGames = Object.entries(GAME_CONFIG)
            .filter(([key, conf]) => 
              conf.category === category.id && 
              (!conf.allowedProfiles || conf.allowedProfiles.includes(profile as ProfileType))
            );
          
          if (categoryGames.length === 0) return null;
          
          const isExpanded = expandedCategories[category.id];
          
          return (
            <div key={category.id} className="mb-3 sm:mb-4">
              {/* Category header */}
              <button
                onClick={() => toggleCategory(category.id)}
                className="w-full flex items-center justify-between bg-white border-2 border-slate-200 hover:border-purple-300 px-4 py-3 rounded-xl shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="text-xl sm:text-2xl">{category.emoji}</span>
                  <span className="font-bold text-sm sm:text-base text-slate-700">
                    {formatText(t.categories[category.id as keyof typeof t.categories]?.name || category.name)}
                  </span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="text-xs sm:text-sm text-slate-500 font-semibold bg-slate-100 px-2 py-1 rounded-full">
                    {categoryGames.length}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
                  ) : (
                    <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
                  )}
                </div>
              </button>
              
              {/* Games grid */}
              {isExpanded && (
                <div className="grid grid-cols-1 gap-3 sm:gap-4 mt-3 animate-fadeIn">
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
                        badge={isNew ? formatText(t.menuSpecific.newGame) : null}
                        delay={idx * 50}
                        highScore={getHighScore(key)}
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
      </div>
    </div>
  );
};
