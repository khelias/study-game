import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../../stores/gameStore';
import { usePlaySessionStore } from '../../stores/playSessionStore';
import { useTranslation } from '../../i18n/useTranslation';
import { useProfileText } from '../../hooks/useProfileText';
import { useGameAudio } from '../../hooks/useGameAudio';
import { GAME_CONFIG, CATEGORIES } from '../../games/data';
import { gameIdToSlug } from '../../utils/gameSlug';

export const GameOverScreen: React.FC = () => {
  const navigate = useNavigate();
  const t = useTranslation();
  const { formatText } = useProfileText();
  const score = usePlaySessionStore(state => state.score); // Use session score, not global
  const soundEnabled = useGameStore(state => state.soundEnabled);
  const gameType = usePlaySessionStore(state => state.gameType);
  const returnToMenu = usePlaySessionStore(state => state.returnToMenu);
  const startGame = usePlaySessionStore(state => state.startGame);
  const getHighScore = useGameStore(state => state.getHighScore);
  const { playClick } = useGameAudio(soundEnabled);
  const scoreMessage = formatText(
    t.game.scoreMessage.replace('{score}', String(score))
  );

  const highScore = gameType ? getHighScore(gameType) : 0;
  const isNewRecord = gameType && score > 0 && score >= highScore;

  const baseType = gameType ? gameType.replace('_adv', '') : null;
  const gameConfig = baseType ? GAME_CONFIG[baseType] : undefined;
  const category = gameConfig ? CATEGORIES[gameConfig.category] : undefined;

  const headerEmoji = category?.emoji ?? '🎮';
  const headerTitle =
    baseType && t.games[baseType as keyof typeof t.games]
      ? t.games[baseType as keyof typeof t.games].title
      : formatText(t.game.gameOver);

  const themeBorder = gameConfig?.theme.border ?? 'border-slate-200';
  const themeText = gameConfig?.theme.text ?? 'text-slate-800';
  const themeBgSoft = gameConfig?.theme.bg ?? 'bg-slate-50';

  const handleRetry = () => {
    playClick();
    if (gameType) {
      // Navigate back to the same game route to restart
      const slug = gameIdToSlug(gameType);
      returnToMenu(); // Reset game state first
      navigate(`/games/${slug}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-slate-50 animate-in fade-in">
      <div className="w-full max-w-md">
        <div className={`relative rounded-3xl bg-white/95 shadow-xl border ${themeBorder} px-6 py-6 sm:px-8 sm:py-8`}>
          {/* Game title pill */}
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${themeBgSoft} border border-slate-200 mb-4`}>
            <span className="text-lg" aria-hidden="true">
              {headerEmoji}
            </span>
            <span className={`text-xs font-semibold tracking-wide uppercase ${themeText}`}>
              {headerTitle}
            </span>
          </div>

          {/* Icon + headline */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="relative mb-3">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-rose-400 via-pink-500 to-purple-500 shadow-[0_0_24px_rgba(244,114,182,0.45)] flex items-center justify-center">
                <span className="text-4xl sm:text-5xl" aria-hidden="true">
                  💔
                </span>
              </div>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-1">
              {formatText(t.game.gameOver)}
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              {scoreMessage}
            </p>
          </div>

          {/* Score + high score */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="rounded-2xl bg-slate-50 border border-slate-200 px-4 py-3 text-center">
              <div className="text-[0.65rem] sm:text-xs uppercase tracking-wide text-slate-500 mb-1">
                {formatText(t.game.score)}
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900">
                {score}
              </div>
            </div>
            <div
              className={[
                'rounded-2xl px-4 py-3 text-center border',
                isNewRecord
                  ? 'bg-yellow-50 border-yellow-300 shadow-[0_0_16px_rgba(250,204,21,0.5)]'
                  : 'bg-slate-50 border-slate-200',
              ].join(' ')}
            >
              <div className="text-[0.65rem] sm:text-xs uppercase tracking-wide text-slate-500 mb-1">
                {formatText(t.game.highScore || 'High Score')}
              </div>
              <div className="flex items-center justify-center gap-1">
                <span className="text-2xl sm:text-3xl font-black text-slate-900">
                  {highScore > 0 ? highScore : '-'}
                </span>
                {isNewRecord && (
                  <span className="text-xs sm:text-sm font-bold text-yellow-600">
                    {formatText(t.game.newRecord || 'New Record!')}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={handleRetry}
              className="flex-1 inline-flex items-center justify-center px-4 py-3 rounded-xl bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500 text-white font-bold text-sm sm:text-base shadow-lg shadow-blue-500/40 hover:shadow-blue-400/60 active:scale-95 transition-transform"
            >
              {formatText(t.game.retry)}
            </button>
            <button
              type="button"
              onClick={() => {
                playClick();
                // High score is already updated on each score increase
                returnToMenu();
                navigate('/');
              }}
              className="flex-1 inline-flex items-center justify-center px-4 py-3 rounded-xl bg-slate-100 text-slate-800 font-semibold text-sm sm:text-base border border-slate-300 hover:bg-slate-200 active:scale-95 transition-transform"
            >
              {formatText(t.game.returnToMenu)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
