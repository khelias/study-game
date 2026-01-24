// Mängu progressiooni komponent - näitab progressi ja soovitusi
import React from 'react';
import { TrendingUp, TrendingDown, Target, Award } from 'lucide-react';
import { getProgressionRecommendation, calculateGameSuccessScore } from '../engine/progression';

export const GameProgressionCard = ({ gameType, stats }) => {
  const recommendation = getProgressionRecommendation(stats, gameType);
  const successScore = calculateGameSuccessScore(stats, gameType);
  
  const getRecommendationIcon = () => {
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
  
  const getRecommendationColor = () => {
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
          <span className="font-bold text-sm text-slate-700">Soovitus</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Edukuse skoor:</span>
          <span className="font-black text-lg text-purple-600">{successScore}</span>
        </div>
      </div>
      <p className="text-sm text-slate-600">{recommendation.message}</p>
      
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

export const LevelProgressIndicator = ({ current, next, progress }) => {
  const progressPercentage = (progress / 5) * 100;
  
  return (
    <div className="w-full max-w-md mx-auto p-4 bg-white rounded-xl border-2 border-slate-200 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-bold text-slate-600">Praegune tase: {current}</span>
        <span className="text-sm font-bold text-slate-600">Järgmine: {next}</span>
      </div>
      <div className="w-full h-4 bg-slate-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 transition-all duration-500"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      <div className="text-center mt-2 text-xs text-slate-500">
        {progress} / 5 tähte kogutud
      </div>
    </div>
  );
};
