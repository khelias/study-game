import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { playSound } from '../engine/audio';

export const AchievementModal = ({ achievement, onClose, soundEnabled }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (achievement) {
      playSound('win', soundEnabled);
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        setTimeout(onClose, 500);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [achievement, onClose, soundEnabled]);

  if (!achievement || !show) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center transform scale-100 animate-bounce-short border-4 border-yellow-400 relative">
        <button
          onClick={() => {
            setShow(false);
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
          aria-label="Sulge"
        >
          <X size={20} className="text-slate-600" />
        </button>
        
        <div className="mx-auto w-28 h-28 bg-gradient-to-br from-yellow-200 to-orange-200 rounded-full flex items-center justify-center mb-4 text-7xl shadow-inner animate-pulse">
          {achievement.icon}
        </div>
        <div className="text-2xl font-black text-yellow-600 mb-2">SAAVUTUS!</div>
        <h2 className="text-3xl font-black text-slate-800 mb-2">{achievement.title}</h2>
        <p className="text-slate-600 mb-6 font-semibold">{achievement.desc}</p>
        
        <div className="flex gap-2 justify-center">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-2 h-2 bg-yellow-400 rounded-full animate-ping" style={{ animationDelay: `${i * 0.1}s` }} />
          ))}
        </div>
      </div>
    </div>
  );
};
