// Hariduslikud näpunäited ja õpetused mängu ajal
import React, { useState } from 'react';
import { Lightbulb, X } from 'lucide-react';

const LEARNING_TIPS: Record<string, string[]> = {
  word_builder: [
    '💡 Vihje: Proovi mõelda, mis sõna võiks emoji järgi olla!',
    '💡 Vihje: Vaata esimest tähte - see aitab alustada!',
    '💡 Vihje: Mõtle, millised tähed sobivad kokku!',
  ],
  syllable_builder: [
    '💡 Vihje: Silbid on sõna osad - proovi neid kokku panna!',
    '💡 Vihje: Vaata, kuidas silbid kokku sobivad!',
    '💡 Vihje: Mõtle, kuidas sõna kõlab, kui loed seda!',
  ],
  pattern: [
    '💡 Vihje: Vaata, mis mustrit järgib rong!',
    '💡 Vihje: Mõtle, mis järgmisena peaks tulema!',
    '💡 Vihje: Vaata, kuidas emojid korduvad!',
  ],
  sentence_logic: [
    '💡 Vihje: Loe lauset hoolikalt läbi!',
    '💡 Vihje: Vaata, kus objektid stseenis asuvad!',
    '💡 Vihje: Mõtle, mis on loogiline!',
  ],
  memory_math: [
    '💡 Vihje: Pööra kaardid ümber ja leia paarid!',
    '💡 Vihje: Mõtle, mis arvud kokku annavad tehte vastuse!',
    '💡 Vihje: Proovi meelde jätta, kus mis kaart on!',
  ],
  balance_scale: [
    '💡 Vihje: Arvuta, kui palju on vasakul pool!',
    '💡 Vihje: Mõtle, mis arv tasakaalustab kaalud!',
    '💡 Vihje: Vaata, kui palju on paremal pool!',
  ],
  robo_path: [
    '💡 Vihje: Mõtle, kuidas robot peab liikuma!',
    '💡 Vihje: Vaata, kus on takistused!',
    '💡 Vihje: Proovi sammhaaval!',
  ],
  time_match: [
    '💡 Vihje: Vaata kella osuteid!',
    '💡 Vihje: Mõtle, mis kellaaeg on näidatud!',
    '💡 Vihje: Tund on suurem number, minut väiksem!',
  ],
  letter_match: [
    '💡 Vihje: Vaata suurt tähte ja leia väike!',
    '💡 Vihje: Mõtle, mis täht sobib!',
    '💡 Vihje: Suur ja väike täht on sama!',
  ],
};

interface LearningTipProps {
  gameType: string;
  onClose?: () => void;
}

export const LearningTip: React.FC<LearningTipProps> = ({ gameType, onClose }) => {
  const tips: string[] = LEARNING_TIPS[gameType] || [];
  const [currentTip, setCurrentTip] = useState<number>(0);
  
  if (tips.length === 0) return null;
  
  const tip: string = tips[currentTip] || '';
  
  return (
    <div className="fixed bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 z-40 max-w-md w-full mx-2 sm:mx-4 animate-fade-in">
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-2xl border-3 sm:border-4 border-blue-300">
        <div className="flex items-start gap-2 sm:gap-3">
          <Lightbulb className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-xs sm:text-sm font-bold leading-relaxed">{tip}</p>
            {tips.length > 1 && (
              <div className="flex items-center gap-2 sm:gap-3 mt-2 sm:mt-3">
                <button
                  onClick={() => setCurrentTip((prev) => (prev > 0 ? prev - 1 : tips.length - 1))}
                  className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-white font-bold text-sm sm:text-base"
                  aria-label="Eelmine näpunäide"
                >
                  ←
                </button>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  {tips.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentTip(i)}
                      className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all cursor-pointer ${
                        i === currentTip ? 'bg-white scale-125' : 'bg-white/40 hover:bg-white/60'
                      }`}
                      aria-label={`Näita näpunäidet ${i + 1} / ${tips.length}`}
                      title={`Näpunäide ${i + 1} / ${tips.length}`}
                    />
                  ))}
                </div>
                <button
                  onClick={() => setCurrentTip((prev) => (prev < tips.length - 1 ? prev + 1 : 0))}
                  className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-white font-bold text-sm sm:text-base"
                  aria-label="Järgmine näpunäide"
                >
                  →
                </button>
                <span className="text-[10px] sm:text-xs text-white/80 ml-1 sm:ml-2">
                  {currentTip + 1}/{tips.length}
                </span>
              </div>
            )}
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="flex-shrink-0 p-1 hover:bg-white/20 rounded-lg transition-colors"
              aria-label="Sulge näpunäide"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper function (not a component)
// eslint-disable-next-line react-refresh/only-export-components
export const getRandomTip = (gameType: string): string | null => {
  const tips: string[] = LEARNING_TIPS[gameType] || [];
  if (tips.length === 0) return null;
  return tips[Math.floor(Math.random() * tips.length)] || null;
};
