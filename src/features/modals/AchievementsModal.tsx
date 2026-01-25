import React from 'react';
import { X } from 'lucide-react';
import { ACHIEVEMENTS } from '../../engine/achievements';

interface AchievementsModalProps {
  unlockedAchievements: string[];
  onClose: () => void;
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({ unlockedAchievements, onClose }) => {
  const allAchievements = Object.values(ACHIEVEMENTS);
  const unlockedSet: Set<string> = new Set(unlockedAchievements);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl p-6 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black text-slate-800">Saavutused 🏅</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
            aria-label="Sulge"
          >
            <X size={20} className="text-slate-600" />
          </button>
        </div>

        <div className="mb-4 text-center">
          <div className="text-4xl font-black text-purple-600 mb-2">
            {unlockedAchievements.length} / {allAchievements.length}
          </div>
          <p className="text-sm text-slate-600">medalit kogutud</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {allAchievements.map((achievement) => {
            const isUnlocked: boolean = unlockedSet.has(achievement.id);
            return (
              <div
                key={achievement.id}
                className={`
                  p-4 rounded-xl border-2 transition-all
                  ${isUnlocked
                    ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-300 shadow-md'
                    : 'bg-slate-50 border-slate-200 opacity-60'
                  }
                `}
              >
                <div className="flex items-start gap-3">
                  <div className={`
                    text-4xl flex-shrink-0
                    ${isUnlocked ? '' : 'grayscale opacity-50'}
                  `}>
                    {achievement.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`
                      font-black text-lg mb-1
                      ${isUnlocked ? 'text-slate-800' : 'text-slate-400'}
                    `}>
                      {achievement.title}
                      {isUnlocked && <span className="ml-2 text-yellow-500">✓</span>}
                    </h3>
                    <p className={`
                      text-sm
                      ${isUnlocked ? 'text-slate-600' : 'text-slate-400'}
                    `}>
                      {achievement.desc}
                    </p>
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
