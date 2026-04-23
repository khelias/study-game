import React from 'react';
import { useTranslation } from '../../i18n/useTranslation';
import { useProfileText } from '../../hooks/useProfileText';
import { GAME_CONFIG } from '../../games/data';
import { Z_INDEX } from '../../utils/zIndex';

interface GameDescriptionModalProps {
  gameType: string;
  onClose: () => void;
}

/**
 * "How to play" modal shown on first game entry (auto) and when
 * the player taps the game-name badge. Extracted from the
 * GameScreen IIFE to isolate the i18n lookup and the dialog
 * markup from the top-level game state orchestration.
 *
 * `onClose` is expected to carry whatever sound/animation effects
 * the parent needs (e.g. playClick); this component just invokes it.
 */
export const GameDescriptionModal: React.FC<GameDescriptionModalProps> = ({
  gameType,
  onClose,
}) => {
  const t = useTranslation();
  const { formatText } = useProfileText();

  const baseType = gameType.replace('_adv', '');
  const gameConfig = GAME_CONFIG[baseType];
  const gameEmoji = gameConfig?.emoji ?? '🎮';
  const gameTitleStr: string =
    gameConfig && t.games[baseType as keyof typeof t.games]
      ? t.games[baseType as keyof typeof t.games].title
      : gameType.toUpperCase();
  const gameName = formatText(gameTitleStr);
  const gameDesc = (t.games[baseType as keyof typeof t.games] as { gameDescription?: string })
    ?.gameDescription;
  const tips = (t.gameScreen.tips as unknown as Record<string, string[] | undefined>)[baseType];
  const tipsList = Array.isArray(tips) ? tips : [];

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4 animate-in fade-in duration-200"
      style={{ zIndex: Z_INDEX.MODALS, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="bg-gradient-to-br from-slate-50 via-white to-slate-50 rounded-2xl shadow-2xl border-2 border-slate-200 w-full max-w-md animate-in zoom-in duration-300 p-5 sm:p-6 max-h-[85vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="game-description-title"
      >
        <h2
          id="game-description-title"
          className="text-lg sm:text-xl font-black text-slate-800 mb-2 flex items-center gap-2"
        >
          <span>{gameEmoji}</span>
          {gameName}
        </h2>
        <p className="text-sm text-slate-700 mb-4 whitespace-pre-wrap">
          {gameDesc ? formatText(gameDesc) : ''}
        </p>
        {tipsList.length > 0 && (
          <>
            <h3 className="text-sm font-bold text-slate-700 mb-2">
              {formatText(t.gameScreen.tipsLabel)}
            </h3>
            <ul className="list-disc list-inside text-sm text-slate-600 space-y-1 mb-4">
              {tipsList.map((tip, i) => (
                <li key={i}>{formatText(tip)}</li>
              ))}
            </ul>
          </>
        )}
        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 rounded-xl font-bold border-2 border-slate-600 bg-slate-600 text-white hover:bg-slate-700 transition-colors"
          aria-label={formatText(t.common.close)}
        >
          {formatText(t.common.close)}
        </button>
      </div>
    </div>
  );
};
