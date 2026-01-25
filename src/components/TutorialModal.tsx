import React, { useState } from 'react';
import { X, ArrowRight, ArrowLeft } from 'lucide-react';

interface TutorialStep {
  title: string;
  content: string;
  emoji: string;
}

const TUTORIAL_STEPS: TutorialStep[] = [
  {
    title: 'Tere tulemast! 🎮',
    content: 'See on õppemäng, kus saad harjutada lugemist, matemaatikat ja loogikat!',
    emoji: '👋'
  },
  {
    title: 'Vali oma vanus 🎯',
    content: 'Vali menüüs oma vanusegrupp (5+ või 7+), et saada sobivad ülesanded.',
    emoji: '👶'
  },
  {
    title: 'Vali mäng 🎲',
    content: 'Vali mäng, mida soovid mängida. Igal mängul on oma teema ja raskusaste.',
    emoji: '🎪'
  },
  {
    title: 'Vasta õigesti ⭐',
    content: 'Iga õige vastus annab sulle tähe. Kui kogud 5 tähte, tõused taseme võrra!',
    emoji: '⭐'
  },
  {
    title: 'Ole ettevaatlik ❤️',
    content: 'Iga vale vastus võtab ühe südame ära. Kui südamed otsa saavad, mäng lõppeb.',
    emoji: '❤️'
  },
  {
    title: 'Kogu saavutusi 🏅',
    content: 'Kogu medaleid ja jälgi oma statistikat menüü ülevalt!',
    emoji: '🏅'
  }
];

interface TutorialModalProps {
  onClose: () => void;
}

export const TutorialModal: React.FC<TutorialModalProps> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState<number>(0);

  const nextStep = (): void => {
    if (currentStep < TUTORIAL_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const prevStep = (): void => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const step: TutorialStep = TUTORIAL_STEPS[currentStep ?? 0] ?? TUTORIAL_STEPS[0]!;
  const isLast: boolean = currentStep === TUTORIAL_STEPS.length - 1;

  return (
    <div 
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-300"
      onClick={(e: React.MouseEvent<HTMLDivElement>) => {
        // Sulge, kui klikitakse taustale
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl text-center relative">
        <button
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors z-10"
          aria-label="Sulge juhend"
          type="button"
        >
          <X size={20} className="text-slate-600" />
        </button>
        <div className="text-7xl mb-4 animate-bounce">{step.emoji}</div>
        <h2 className="text-3xl font-black text-slate-800 mb-4">{step.title}</h2>
        <p className="text-lg text-slate-600 mb-8 leading-relaxed">{step.content}</p>
        
        <div className="flex items-center justify-center gap-2 mb-6">
          {TUTORIAL_STEPS.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all ${
                i === currentStep ? 'bg-blue-500 w-8' : 'bg-slate-300'
              }`}
            />
          ))}
        </div>

        <div className="flex gap-3">
          {currentStep > 0 && (
            <button
              onClick={prevStep}
              className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft size={20} />
              Tagasi
            </button>
          )}
          <button
            onClick={nextStep}
            className={`flex-1 py-3 px-4 rounded-xl font-bold text-white transition-colors flex items-center justify-center gap-2 ${
              isLast
                ? 'bg-green-500 hover:bg-green-600'
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {isLast ? 'Alusta mängu!' : 'Järgmine'}
            {!isLast && <ArrowRight size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
};
