// Õppimise progressi jälgimise komponent - hariduslik väärtus
import React from 'react';
import { TrendingUp, Target, BookOpen, Award } from 'lucide-react';
import { Stats } from '../types/stats';

interface LearningProgressProps {
  stats: Stats;
  gameType: string;
}

export const LearningProgress: React.FC<LearningProgressProps> = ({ stats, gameType }) => {
  const gameStats: number = stats.gamesByType?.[gameType] || 0;
  const maxLevel: number = stats.maxLevels?.[gameType] || 1;
  const accuracy: number = stats.gamesPlayed > 0
    ? Math.round((stats.correctAnswers / (stats.correctAnswers + stats.wrongAnswers)) * 100)
    : 0;
  
  // Arvuta õppimise skoor
  const learningScore: number = Math.min(100, Math.round(
    (accuracy * 0.4) + 
    (maxLevel * 5) + 
    (gameStats * 2)
  ));
  
  interface LearningStage {
    label: string;
    emoji: string;
    color: string;
  }
  
  const getLearningStage = (): LearningStage => {
    if (learningScore >= 80) return { label: 'Meister', emoji: '🏆', color: 'text-yellow-600' };
    if (learningScore >= 60) return { label: 'Edasijõudnud', emoji: '⭐', color: 'text-blue-600' };
    if (learningScore >= 40) return { label: 'Harjutaja', emoji: '📚', color: 'text-green-600' };
    return { label: 'Algaja', emoji: '🌱', color: 'text-slate-600' };
  };
  
  const stage: LearningStage = getLearningStage();
  
  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
          <BookOpen size={20} className="text-purple-600" />
          Õppimise Progress
        </h3>
        <span className={`text-2xl ${stage.color}`}>{stage.emoji}</span>
      </div>
      
      <div className="space-y-4">
        {/* Learning Score */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-slate-600">Õppimise skoor</span>
            <span className="text-xl font-black text-purple-700">{learningScore}%</span>
          </div>
          <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
              style={{ width: `${learningScore}%` }}
            />
          </div>
          <div className="text-xs text-slate-500 mt-1 text-center">
            {stage.emoji} {stage.label}
          </div>
        </div>
        
        {/* Key Metrics */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center bg-white/50 rounded-xl p-3">
            <Target size={20} className="text-green-600 mx-auto mb-1" />
            <div className="text-lg font-black text-slate-800">{accuracy}%</div>
            <div className="text-xs text-slate-600">Täpsus</div>
          </div>
          <div className="text-center bg-white/50 rounded-xl p-3">
            <TrendingUp size={20} className="text-blue-600 mx-auto mb-1" />
            <div className="text-lg font-black text-slate-800">{maxLevel}</div>
            <div className="text-xs text-slate-600">Tase</div>
          </div>
          <div className="text-center bg-white/50 rounded-xl p-3">
            <Award size={20} className="text-purple-600 mx-auto mb-1" />
            <div className="text-lg font-black text-slate-800">{gameStats}</div>
            <div className="text-xs text-slate-600">Mänge</div>
          </div>
        </div>
        
        {/* Encouragement */}
        {learningScore >= 80 && (
          <div className="bg-yellow-100 border-2 border-yellow-300 rounded-xl p-3 text-center">
            <div className="text-sm font-bold text-yellow-800">
              🎉 Suurepärane! Oled tõeline meister!
            </div>
          </div>
        )}
        {learningScore < 40 && (
          <div className="bg-blue-100 border-2 border-blue-300 rounded-xl p-3 text-center">
            <div className="text-sm font-bold text-blue-800">
              💪 Jätka harjutamist! Iga samm loeb!
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Skill breakdown komponent
interface SkillBreakdownProps {
  stats: Stats;
}

interface Skill {
  name: string;
  games: string[];
  icon: string;
}

export const SkillBreakdown: React.FC<SkillBreakdownProps> = ({ stats }) => {
  const skills: Skill[] = [
    {
      name: 'Lugemine',
      games: ['word_builder', 'syllable_builder', 'letter_match', 'sentence_logic'],
      icon: '📖',
    },
    {
      name: 'Matemaatika',
      games: ['memory_math', 'balance_scale', 'time_match'],
      icon: '🔢',
    },
    {
      name: 'Loogika',
      games: ['pattern', 'robo_path'],
      icon: '🧩',
    },
  ];
  
  const calculateSkillLevel = (skillGames: string[]): { totalGames: number; maxLevel: number } => {
    const totalGames: number = skillGames.reduce((sum, gameType) => {
      return sum + (stats.gamesByType?.[gameType] || 0);
    }, 0);
    const maxLevel: number = Math.max(...skillGames.map(gt => stats.maxLevels?.[gt] || 1));
    return { totalGames, maxLevel };
  };
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-black text-slate-800 mb-4">Oskuste ülevaade</h3>
      {skills.map((skill, idx) => {
        const { totalGames, maxLevel } = calculateSkillLevel(skill.games);
        const skillScore: number = Math.min(100, (totalGames * 5) + (maxLevel * 10));
        
        return (
          <div key={idx} className="bg-white rounded-xl p-4 border-2 border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{skill.icon}</span>
                <span className="font-bold text-slate-800">{skill.name}</span>
              </div>
              <span className="text-lg font-black text-slate-600">{skillScore}%</span>
            </div>
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                style={{ width: `${skillScore}%` }}
              />
            </div>
            <div className="text-xs text-slate-500 mt-2">
              {totalGames} mängu • Tase {maxLevel}
            </div>
          </div>
        );
      })}
    </div>
  );
};
