import React from 'react';
import { X } from 'lucide-react';
import { ACHIEVEMENTS, CORE_GAME_TYPES_FOR_ALL_GAMES } from '../../engine/achievements';
import { useTranslation } from '../../i18n/useTranslation';
import { useProfileText } from '../../hooks/useProfileText';
import { getAchievementCopy } from '../../utils/achievementCopy';
import type { Stats } from '../../types/stats';

interface AchievementsModalProps {
  unlockedAchievements: string[];
  stats: Stats;
  onClose: () => void;
}

interface AchievementProgress {
  current: number;
  target: number;
}

const levelProgress = (stats: Stats, gameType: string, target: number): AchievementProgress => ({
  current: stats.maxLevels[gameType] || 0,
  target,
});

const gamesPlayedProgress = (
  stats: Stats,
  gameType: string,
  target: number,
): AchievementProgress => ({
  current: stats.gamesByType[gameType] || 0,
  target,
});

const getAchievementProgress = (id: string, stats: Stats): AchievementProgress => {
  switch (id) {
    case 'first_game':
      return { current: stats.gamesPlayed, target: 1 };
    case 'perfect_5':
      return { current: stats.maxStreak, target: 5 };
    case 'word_master':
      return levelProgress(stats, 'word_builder', 5);
    case 'math_whiz':
      return levelProgress(stats, 'memory_math', 5);
    case 'pattern_pro':
      return levelProgress(stats, 'pattern', 5);
    case 'score_100':
      return { current: stats.totalScore, target: 100 };
    case 'score_500':
      return { current: stats.totalScore, target: 500 };
    case 'persistent':
      return { current: stats.gamesPlayed, target: 10 };
    case 'all_games':
      return {
        current: CORE_GAME_TYPES_FOR_ALL_GAMES.filter((type) => (stats.gamesByType[type] || 0) > 0)
          .length,
        target: CORE_GAME_TYPES_FOR_ALL_GAMES.length,
      };
    case 'battlelearn_first_win':
      return levelProgress(stats, 'battlelearn', 2);
    case 'battlelearn_captain':
      return levelProgress(stats, 'battlelearn', 5);
    case 'battlelearn_admiral':
      return levelProgress(stats, 'battlelearn', 10);
    case 'star_collector_50':
      return { current: stats.collectedStars || 0, target: 50 };
    case 'star_collector_100':
      return { current: stats.collectedStars || 0, target: 100 };
    case 'star_collector_250':
      return { current: stats.collectedStars || 0, target: 250 };
    case 'snake_master':
      return levelProgress(stats, 'math_snake', 5);
    case 'snake_growth_20':
      return { current: stats.maxSnakeLength || 0, target: 20 };
    case 'snake_growth_30':
      return { current: stats.maxSnakeLength || 0, target: 30 };
    case 'snake_growth_max':
      return { current: stats.maxSnakeLength || 0, target: 49 };
    case 'syllable_master':
      return levelProgress(stats, 'syllable_builder', 5);
    case 'sentence_detective':
      return levelProgress(stats, 'sentence_logic', 5);
    case 'robo_master':
      return levelProgress(stats, 'robo_path', 5);
    case 'letter_detective':
      return levelProgress(stats, 'letter_match', 5);
    case 'unit_master':
      return levelProgress(stats, 'unit_conversion', 5);
    case 'compare_master':
      return levelProgress(stats, 'compare_sizes', 5);
    case 'scale_master':
      return levelProgress(stats, 'balance_scale', 5);
    case 'clock_master':
      return levelProgress(stats, 'time_match', 5);
    case 'cascade_master':
      return levelProgress(stats, 'word_cascade', 5);
    case 'cascade_perfect_10':
      return gamesPlayedProgress(stats, 'word_cascade', 10);
    default:
      return { current: 0, target: 1 };
  }
};

export const AchievementsModal: React.FC<AchievementsModalProps> = ({
  unlockedAchievements,
  stats,
  onClose,
}) => {
  const t = useTranslation();
  const { formatText } = useProfileText();
  const allAchievements = Object.values(ACHIEVEMENTS);
  const unlockedSet: Set<string> = new Set(unlockedAchievements);

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
      <div
        className="bg-white rounded-3xl p-6 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto"
        style={{ margin: '0 auto' }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black text-slate-800">
            {formatText(t.achievements.modalTitle)}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
            aria-label={formatText(t.common.close)}
          >
            <X size={20} className="text-slate-600" />
          </button>
        </div>

        <div className="mb-4 text-center">
          <div className="text-4xl font-black text-purple-600 mb-2">
            {unlockedAchievements.length} / {allAchievements.length}
          </div>
          <p className="text-sm text-slate-600">{formatText(t.achievements.collectedLabel)}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {allAchievements.map((achievement) => {
            const isUnlocked: boolean = unlockedSet.has(achievement.id);
            const copy = getAchievementCopy(t, achievement.id);
            const progress = getAchievementProgress(achievement.id, stats);
            const cappedCurrent = Math.min(progress.current, progress.target);
            const progressPercent =
              progress.target > 0 ? Math.min(100, (cappedCurrent / progress.target) * 100) : 0;
            return (
              <div
                key={achievement.id}
                className={[
                  'rounded-xl border-2 p-4 transition-all',
                  isUnlocked
                    ? 'border-yellow-300 bg-gradient-to-br from-yellow-50 to-orange-50 shadow-md'
                    : 'border-slate-200 bg-white shadow-sm',
                ].join(' ')}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={[
                      'flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl text-3xl',
                      isUnlocked ? 'bg-yellow-100' : 'bg-slate-100 grayscale',
                    ].join(' ')}
                  >
                    {achievement.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="mb-1 flex items-start justify-between gap-2">
                      <h3 className="text-lg font-black text-slate-800">
                        {formatText(copy.title)}
                      </h3>
                      <span
                        className={[
                          'shrink-0 rounded-full px-2 py-1 text-[0.62rem] font-black uppercase',
                          isUnlocked
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-slate-100 text-slate-500',
                        ].join(' ')}
                      >
                        {formatText(isUnlocked ? t.achievements.unlocked : t.achievements.locked)}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600">{formatText(copy.desc)}</p>
                    <div className="mt-3">
                      <div className="mb-1 flex items-center justify-between gap-2 text-xs font-bold text-slate-500">
                        <span>{formatText(t.achievements.progress)}</span>
                        <span className="text-slate-700">
                          {cappedCurrent}/{progress.target}
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                        <div
                          className={[
                            'h-full rounded-full transition-all duration-500',
                            isUnlocked ? 'bg-yellow-500' : 'bg-blue-500',
                          ].join(' ')}
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
