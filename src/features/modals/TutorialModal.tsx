import React, { useState, useMemo } from 'react';
import { X, ArrowRight, ArrowLeft } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';

interface TutorialStep {
  title: string;
  content: string;
  emoji: string;
}

interface TutorialModalProps {
  onClose: () => void;
}

export const TutorialModal: React.FC<TutorialModalProps> = ({ onClose }) => {
  const t = useTranslation();
  const [currentStep, setCurrentStep] = useState<number>(0);

  const TUTORIAL_STEPS: TutorialStep[] = useMemo(() => [
    {
      title: t.tutorial.welcome.title,
      content: t.tutorial.welcome.content,
      emoji: '👋'
    },
    {
      title: t.tutorial.selectAge.title,
      content: t.tutorial.selectAge.content,
      emoji: '👶'
    },
    {
      title: t.tutorial.selectGame.title,
      content: t.tutorial.selectGame.content,
      emoji: '🎪'
    },
    {
      title: t.tutorial.answerCorrectly.title,
      content: t.tutorial.answerCorrectly.content,
      emoji: '⭐'
    },
    {
      title: t.tutorial.beCareful.title,
      content: t.tutorial.beCareful.content,
      emoji: '❤️'
    },
    {
      title: t.tutorial.collectAchievements.title,
      content: t.tutorial.collectAchievements.content,
      emoji: '🏅'
    }
  ], [t]);

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

  const step: TutorialStep = TUTORIAL_STEPS[currentStep] ?? TUTORIAL_STEPS[0]!;
  const isLast: boolean = currentStep === TUTORIAL_STEPS.length - 1;

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-300"
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
        justifyContent: 'center'
      }}
      onClick={(e: React.MouseEvent<HTMLDivElement>) => {
        // Close when clicking on background
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div 
        className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl text-center relative"
        style={{ margin: '0 auto' }}
      >
        <button
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors z-10"
          aria-label={t.tutorial.close}
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
              {t.tutorial.back}
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
            {isLast ? t.tutorial.startGame : t.tutorial.next}
            {!isLast && <ArrowRight size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
};
