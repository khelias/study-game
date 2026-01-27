/**
 * SettingsMenu Component
 * 
 * Dropdown menu for game settings (sound toggle, return to menu).
 */

import React from 'react';
import { Volume2, VolumeX, Home } from 'lucide-react';
import { useTranslation } from '../i18n/useTranslation';
import { useProfileText } from '../hooks/useProfileText';

interface SettingsMenuProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  onReturnToMenu: () => void;
  onClose: () => void;
}

export const SettingsMenu: React.FC<SettingsMenuProps> = ({
  soundEnabled,
  onToggleSound,
  onReturnToMenu,
  onClose,
}) => {
  const t = useTranslation();
  const { formatText } = useProfileText();

  return (
    <div className="absolute left-0 top-full mt-2 bg-white rounded-xl shadow-lg border-2 border-slate-200 overflow-hidden z-50 min-w-[180px]">
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
          {formatText(soundEnabled ? t.menuSpecific.toggleSoundOff : t.menuSpecific.toggleSoundOn)}
        </span>
      </button>
      <div className="border-t border-slate-200">
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
      </div>
    </div>
  );
};
