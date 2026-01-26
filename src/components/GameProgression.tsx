// Mängu progressiooni komponent - näitab progressi ja soovitusi
import React from 'react';
import { TrendingUp, TrendingDown, Target, Award } from 'lucide-react';
import { getProgressionRecommendation, calculateGameSuccessScore } from '../engine/progression';
import { Stats } from '../types/stats';
import { useTranslation } from '../i18n/useTranslation';
import { useProfileText } from '../hooks/useProfileText';

interface GameProgressionCardProps {
  gameType: string;
  stats: Stats;
}

export const GameProgressionCard: React.FC<GameProgressionCardProps> = ({ gameType, stats }) => {
  const t = useTranslation();
  const { formatText } = useProfileText();
  const recommendation = getProgressionRecommendation(stats, gameType);
  const successScore: number = calculateGameSuccessScore(stats, gameType);
  const recommendationLabel = formatText(t.progressionCard.recommendation);
  const successScoreLabel = formatText(t.progressionCard.successScore);
  
  const getRecommendationIcon = (): React.ReactElement => {
    switch (recommendation.action) {
      case 'level_up':
        return <TrendingUp className="w-5 h-5 text-green-600" />;
      case 'level_down':
        return <TrendingDown className="w-5 h-5 text-yellow-600" />;
      case 'start':
        return <Target className="w-5 h-5 text-blue-600" />;
      default:
        return <Award className="w-5 h-5 text-purple-600" />;
    }
  };
  
  const getRecommendationColor = (): string => {
    switch (recommendation.priority) {
      case 'high':
        return 'bg-blue-50 border-blue-200';
      case 'medium':
        return 'bg-green-50 border-green-200';
      default:
        return 'bg-slate-50 border-slate-200';
    }
  };
  
  return (
    <div className={`p-4 rounded-xl border-2 ${getRecommendationColor()} mb-4`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {getRecommendationIcon()}
          <span className="font-bold text-sm text-slate-700">{recommendationLabel}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">{successScoreLabel}:</span>
          <span className="font-black text-lg text-purple-600">{successScore}</span>
        </div>
      </div>
      <p className="text-sm text-slate-600">{formatText(recommendation.message)}</p>
      
      {/* Progress bar */}
      <div className="mt-3 w-full h-2 bg-slate-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
          style={{ width: `${Math.min(100, successScore)}%` }}
        />
      </div>
    </div>
  );
};

interface LevelProgressIndicatorProps {
  current: number;
  next: number;
  progress: number;
}

export const LevelProgressIndicator: React.FC<LevelProgressIndicatorProps> = ({ current, next, progress }) => {
  const t = useTranslation();
  const { formatText } = useProfileText();
  const progressPercentage: number = (progress / 5) * 100;
  const currentLabel = formatText(t.progressionCard.currentLevel);
  const nextLabel = formatText(t.progressionCard.nextLevel);
  const collectedLabel = formatText(
    t.progressionCard.starsCollectedLabel
      .replace('{current}', String(progress))
      .replace('{total}', '5')
  );
  
  return (
    <div className="w-full max-w-md mx-auto p-4 bg-white rounded-xl border-2 border-slate-200 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-bold text-slate-600">{currentLabel}: {current}</span>
        <span className="text-sm font-bold text-slate-600">{nextLabel}: {next}</span>
      </div>
      <div className="w-full h-4 bg-slate-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 transition-all duration-500"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      <div className="text-center mt-2 text-xs text-slate-500">
        {collectedLabel}
      </div>
    </div>
  );
};
