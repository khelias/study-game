import React from 'react';
import { X, Trophy, Star, Wallet } from 'lucide-react';
import { GAME_CONFIG } from '../../games/data';
import { StatsDashboard, GameTypeStats } from '../../components/StatsDashboard';
import { FocusTrap } from '../../components/AccessibilityHelpers';
import { useTranslation } from '../../i18n/useTranslation';
import { useGameStore } from '../../stores/gameStore';
import { useProfileText } from '../../hooks/useProfileText';
import { Stats } from '../../types/stats';
import { AchievementUnlock } from '../../types/achievement';

interface StatsModalProps {
  stats: Stats;
  unlockedAchievements: AchievementUnlock[];
  onClose: () => void;
}

export const StatsModal: React.FC<StatsModalProps> = ({ stats, unlockedAchievements, onClose }) => {
  const t = useTranslation();
  const { formatText } = useProfileText();
  const highScores = useGameStore((state) => state.highScores);
  const spendableStars = useGameStore((state) => state.stars);

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        margin: 0,
        padding: '1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onClick={(e: React.MouseEvent<HTMLDivElement>) => e.target === e.currentTarget && onClose()}
    >
      <FocusTrap active={true}>
        <div
          className="bg-white rounded-3xl p-6 max-w-4xl w-full shadow-2xl max-h-[90vh] overflow-y-auto"
          style={{ margin: '0 auto' }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-black text-slate-800">{t.statsModal.title}</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
              aria-label={t.statsModal.close}
            >
              <X size={20} className="text-slate-600" />
            </button>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-black text-slate-700">
                  <Wallet size={18} className="text-amber-600" aria-hidden />
                  {formatText(t.stats.spendableStars)}
                </div>
                <div className="text-3xl font-black text-slate-900">{spendableStars}</div>
                <p className="mt-1 text-xs font-medium text-slate-600">
                  {formatText(t.stats.spendableStarsHint)}
                </p>
              </div>
              <div className="rounded-2xl border border-yellow-200 bg-yellow-50/80 p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-black text-slate-700">
                  <Star size={18} className="fill-yellow-400 text-yellow-600" aria-hidden />
                  {formatText(t.stats.totalStars)}
                </div>
                <div className="text-3xl font-black text-slate-900">
                  {stats.collectedStars || 0}
                </div>
                <p className="mt-1 text-xs font-medium text-slate-600">
                  {formatText(t.stats.lifetimeStarsHint)}
                </p>
              </div>
            </div>

            {/* Enhanced dashboard */}
            <StatsDashboard stats={stats} unlockedAchievements={unlockedAchievements} />

            {/* Game type statistics */}
            <div className="bg-slate-50 p-6 rounded-2xl border-2 border-slate-200">
              <GameTypeStats stats={stats} />
            </div>

            {/* Max levels */}
            {stats.maxLevels && Object.keys(stats.maxLevels).length > 0 && (
              <div className="bg-slate-50 p-6 rounded-2xl border-2 border-slate-200">
                <h3 className="text-lg font-black text-slate-800 mb-4">
                  {t.statsModal.highestLevels}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.entries(stats.maxLevels).map(([gameType, level]) => {
                    const config = GAME_CONFIG[gameType];
                    if (!config) return null;
                    const gameTitle: string = (t.games[config.id as keyof typeof t.games]?.title ??
                      config.title) as string;
                    return (
                      <div
                        key={gameType}
                        className="flex justify-between items-center bg-white p-3 rounded-xl"
                      >
                        <span className="text-sm font-semibold text-slate-600">{gameTitle}</span>
                        <span className="text-lg font-black text-slate-800">{level}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* High Scores */}
            {highScores && Object.keys(highScores).length > 0 && (
              <div className="bg-slate-50 p-6 rounded-2xl border-2 border-slate-200">
                <h3 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">
                  <Trophy size={20} className="text-yellow-500" />
                  {formatText(t.game.highScore || 'High Scores')}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.entries(highScores)
                    .sort((a, b) => b[1] - a[1]) // Sort by score descending
                    .map(([gameType, score]) => {
                      const config = GAME_CONFIG[gameType];
                      if (!config) return null;
                      const gameTitle: string = (t.games[config.id as keyof typeof t.games]
                        ?.title ?? config.title) as string;
                      return (
                        <div
                          key={gameType}
                          className="flex justify-between items-center bg-white p-3 rounded-xl"
                        >
                          <span className="text-sm font-semibold text-slate-600">
                            {formatText(gameTitle)}
                          </span>
                          <span className="text-lg font-black text-yellow-600">{score}</span>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </div>
        </div>
      </FocusTrap>
    </div>
  );
};
