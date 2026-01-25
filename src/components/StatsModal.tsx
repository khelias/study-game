import React from 'react';
import { X, Trophy, Target, Clock, TrendingUp } from 'lucide-react';
import { GAME_CONFIG } from '../games/data';
import { StatsDashboard, GameTypeStats } from './StatsDashboard';
import { FocusTrap } from './AccessibilityHelpers';
import { Stats } from '../types/stats';
import { AchievementUnlock } from '../types/achievement';

interface StatsModalProps {
  stats: Stats;
  unlockedAchievements: AchievementUnlock[];
  onClose: () => void;
}

export const StatsModal: React.FC<StatsModalProps> = ({ stats, unlockedAchievements, onClose }) => {
  // Removed unused accuracy calculation

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300"
      onClick={(e: React.MouseEvent<HTMLDivElement>) => e.target === e.currentTarget && onClose()}
    >
      <FocusTrap active={true}>
        <div className="bg-white rounded-3xl p-6 max-w-4xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-black text-slate-800">Statistika 📊</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
              aria-label="Sulge statistika"
            >
              <X size={20} className="text-slate-600" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Enhanced dashboard */}
            <StatsDashboard stats={stats} unlockedAchievements={unlockedAchievements} />
            
            {/* Game type statistics */}
            <div className="bg-slate-50 p-6 rounded-2xl border-2 border-slate-200">
              <GameTypeStats stats={stats} />
            </div>

            {/* Max levels */}
            {stats.maxLevels && Object.keys(stats.maxLevels).length > 0 && (
              <div className="bg-slate-50 p-6 rounded-2xl border-2 border-slate-200">
                <h3 className="text-lg font-black text-slate-800 mb-4">Kõrgeimad tasemed</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.entries(stats.maxLevels).map(([gameType, level]) => {
                    const config = GAME_CONFIG[gameType];
                    if (!config) return null;
                    return (
                      <div key={gameType} className="flex justify-between items-center bg-white p-3 rounded-xl">
                        <span className="text-sm font-semibold text-slate-600">{config.title}</span>
                        <span className="text-lg font-black text-slate-800">{level}</span>
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
