// Täiustatud statistika dashboard - parem visualiseerimine
import React from 'react';
import { BarChart3, Trophy, Target, TrendingUp, Clock, Star } from 'lucide-react';
import { Stats } from '../types/stats';
import { AchievementUnlock } from '../types/achievement';

interface StatsDashboardProps {
  stats: Stats;
  unlockedAchievements?: AchievementUnlock[];
}

export const StatsDashboard: React.FC<StatsDashboardProps> = ({ stats, unlockedAchievements = [] }) => {
  const accuracy: number = stats.gamesPlayed > 0
    ? Math.round((stats.correctAnswers / (stats.correctAnswers + stats.wrongAnswers)) * 100)
    : 0;
  
  const totalAnswers: number = stats.correctAnswers + stats.wrongAnswers;
  const avgTimePerGame: number = stats.gamesPlayed > 0
    ? Math.floor(stats.totalTimePlayed / stats.gamesPlayed)
    : 0;
  
  const formatTime = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`;
    const minutes: number = Math.floor(seconds / 60);
    const secs: number = seconds % 60;
    return `${minutes}m ${secs}s`;
  };
  
  interface StatCard {
    icon: React.ComponentType<{ size?: number }>;
    label: string;
    value: string | number;
    color: string;
    subtitle?: string;
  }
  
  const statCards: StatCard[] = [
    {
      icon: Trophy,
      label: 'Kokku mänge',
      value: stats.gamesPlayed,
      color: 'bg-yellow-100 text-yellow-700',
    },
    {
      icon: Target,
      label: 'Täpsus',
      value: `${accuracy}%`,
      color: 'bg-green-100 text-green-700',
      subtitle: `${stats.correctAnswers} / ${totalAnswers}`,
    },
    {
      icon: TrendingUp,
      label: 'Parim seeria',
      value: stats.maxStreak,
      color: 'bg-blue-100 text-blue-700',
      subtitle: 'järjestikust õiget',
    },
    {
      icon: Star,
      label: 'Kogutud tähed',
      value: stats.collectedStars || 0,
      color: 'bg-purple-100 text-purple-700',
    },
    {
      icon: Clock,
      label: 'Mänguaeg',
      value: formatTime(stats.totalTimePlayed),
      color: 'bg-indigo-100 text-indigo-700',
      subtitle: avgTimePerGame > 0 ? `~${formatTime(avgTimePerGame)} mängu kohta` : '',
    },
    {
      icon: BarChart3,
      label: 'Saavutused',
      value: unlockedAchievements.length,
      color: 'bg-pink-100 text-pink-700',
    },
  ];
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {statCards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl ${card.color}`}>
                <Icon size={24} />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-800 mb-1">
              {card.value}
            </div>
            <div className="text-sm font-semibold text-slate-600">
              {card.label}
            </div>
            {card.subtitle && (
              <div className="text-xs text-slate-500 mt-1">
                {card.subtitle}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

// Game type statistics
interface GameTypeStatsProps {
  stats: Stats;
}

export const GameTypeStats: React.FC<GameTypeStatsProps> = ({ stats }) => {
  const gameTypes: Record<string, number> = stats.gamesByType || {};
  const totalGames: number = Object.values(gameTypes).reduce((a, b) => a + b, 0);
  
  if (totalGames === 0) {
    return (
      <div className="text-center text-slate-500 py-8">
        Pole veel mängutüüpe mängitud
      </div>
    );
  }
  
  const sortedTypes: [string, number][] = Object.entries(gameTypes)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-black text-slate-800 mb-4">Kõige rohkem mängitud mängud</h3>
      {sortedTypes.map(([type, count]) => {
        const percentage: number = (count / totalGames) * 100;
        return (
          <div key={type} className="space-y-1">
            <div className="flex justify-between items-center text-sm">
              <span className="font-semibold text-slate-700 capitalize">
                {type.replace(/_/g, ' ')}
              </span>
              <span className="text-slate-500">{count} mängu</span>
            </div>
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
