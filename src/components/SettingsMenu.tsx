/**
 * SettingsMenu Component
 *
 * Dropdown menu for game settings (consistent across MenuScreen and GameScreen).
 */

import React, { useState } from 'react';
import { Volume2, VolumeX, Home, BarChart3, Languages, Trash2, ShoppingBag } from 'lucide-react';
import { useTranslation } from '../i18n/useTranslation';
import { useProfileText } from '../hooks/useProfileText';
import { getLocale, setLocale, type SupportedLocale } from '../i18n';
import type { AchievementUnlock } from '../types/achievement';

interface SettingsMenuProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  onReturnToMenu: () => void;
  onClose: () => void;
  // Optional props for full menu (from GameScreen)
  onShowAchievements?: () => void;
  onShowStats?: () => void;
  onShowShop?: () => void; // Shop modal
  unlockedAchievements?: AchievementUnlock[];
  isGameScreen?: boolean; // If true, shows "Return to Menu" instead of "Delete Progress"
  onDeleteProgress?: () => void; // For MenuScreen
}

export const SettingsMenu: React.FC<SettingsMenuProps> = ({
  soundEnabled,
  onToggleSound,
  onReturnToMenu,
  onClose,
  onShowAchievements,
  onShowStats,
  onShowShop,
  unlockedAchievements = [],
  isGameScreen = false,
  onDeleteProgress,
}) => {
  const t = useTranslation();
  const { formatText } = useProfileText();
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const currentLocale = getLocale();

  const handleLanguageChange = (locale: SupportedLocale) => {
    setLocale(locale);
    setShowLanguageMenu(false);
  };

  return (
    <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-lg border-2 border-slate-200 overflow-hidden z-50 min-w-[180px]">
      {/* Achievements - only if handlers provided */}
      {onShowAchievements && (
        <>
          <button
            onClick={() => {
              onShowAchievements();
              onClose();
            }}
            className="w-full px-4 py-2 text-left hover:bg-slate-50 transition-colors flex items-center gap-2 text-slate-700"
          >
            <span className="text-lg">🏅</span>
            <span>{formatText(t.menuSpecific.showAchievements)}</span>
            {unlockedAchievements.length > 0 && (
              <span className="ml-auto text-sm font-bold text-purple-700">
                {unlockedAchievements.length}
              </span>
            )}
          </button>
          <div className="border-t border-slate-200" />
        </>
      )}

      {/* Stats - only if handler provided */}
      {onShowStats && (
        <>
          <button
            onClick={() => {
              onShowStats();
              onClose();
            }}
            className="w-full px-4 py-2 text-left hover:bg-slate-50 transition-colors flex items-center gap-2 text-slate-700"
          >
            <BarChart3 size={16} className="text-blue-600" />
            <span>{formatText(t.menu.stats)}</span>
          </button>
          <div className="border-t border-slate-200" />
        </>
      )}

      {/* Shop - only if handler provided */}
      {onShowShop && (
        <>
          <button
            onClick={() => {
              onShowShop();
              onClose();
            }}
            className="w-full px-4 py-2 text-left hover:bg-slate-50 transition-colors flex items-center gap-2 text-slate-700"
          >
            <ShoppingBag size={16} className="text-purple-600" />
            <span>{formatText(t.shop.title)}</span>
          </button>
          <div className="border-t border-slate-200" />
        </>
      )}

      {/* Language selector */}
      <div>
        <button
          onClick={() => {
            setShowLanguageMenu(!showLanguageMenu);
          }}
          className="w-full px-4 py-2 text-left hover:bg-slate-50 transition-colors flex items-center justify-between text-slate-700"
        >
          <div className="flex items-center gap-2">
            <Languages size={16} className="text-slate-600" />
            <span>{formatText(t.menuSpecific.language)}</span>
          </div>
          <span className="text-sm">{currentLocale === 'et' ? '🇪🇪' : '🇬🇧'}</span>
        </button>
        {showLanguageMenu && (
          <div className="border-t border-slate-200 bg-slate-50">
            <button
              onClick={() => {
                handleLanguageChange('et');
                setShowLanguageMenu(false);
              }}
              className={`w-full px-4 py-2 text-left hover:bg-slate-100 transition-colors ${
                currentLocale === 'et' ? 'bg-purple-50 text-purple-700 font-bold' : 'text-slate-700'
              }`}
            >
              🇪🇪 Eesti
            </button>
            <button
              onClick={() => {
                handleLanguageChange('en');
                setShowLanguageMenu(false);
              }}
              className={`w-full px-4 py-2 text-left hover:bg-slate-100 transition-colors ${
                currentLocale === 'en' ? 'bg-purple-50 text-purple-700 font-bold' : 'text-slate-700'
              }`}
            >
              🇬🇧 English
            </button>
          </div>
        )}
      </div>

      {/* Sound toggle */}
      <div className="border-t border-slate-200">
        <button
          onClick={() => {
            onToggleSound();
            onClose();
          }}
          className="w-full px-4 py-2 text-left hover:bg-slate-50 transition-colors flex items-center gap-2 text-slate-700"
        >
          {soundEnabled ? (
            <Volume2 size={16} className="text-slate-600" />
          ) : (
            <VolumeX size={16} className="text-red-500" />
          )}
          <span>
            {formatText(
              soundEnabled ? t.menuSpecific.toggleSoundOff : t.menuSpecific.toggleSoundOn,
            )}
          </span>
        </button>
      </div>

      {/* Return to Menu (GameScreen) or Delete Progress (MenuScreen) */}
      <div className="border-t border-slate-200">
        {isGameScreen ? (
          <button
            onClick={() => {
              onReturnToMenu();
              onClose();
            }}
            className="w-full px-4 py-2 text-left hover:bg-slate-50 transition-colors flex items-center gap-2 text-slate-700"
          >
            <Home size={16} className="text-slate-600" />
            <span>{formatText(t.gameScreen.returnToMenu)}</span>
          </button>
        ) : (
          onDeleteProgress && (
            <button
              onClick={() => {
                onDeleteProgress();
                onClose();
              }}
              className="w-full px-4 py-2 text-left hover:bg-red-50 transition-colors flex items-center gap-2 text-red-600"
            >
              <Trash2 size={16} />
              <span>{formatText(t.menuSpecific.deleteProgress)}</span>
            </button>
          )
        )}
      </div>
    </div>
  );
};
