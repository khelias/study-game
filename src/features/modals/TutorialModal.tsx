import React, { useState, useMemo } from 'react';
import {
  X,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  Gamepad2,
  Target,
  Heart,
  Trophy,
  type LucideIcon,
} from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';
import { AppModal } from '../../components/shared';

interface TutorialStep {
  title: string;
  content: string;
  Icon: LucideIcon;
}

interface TutorialModalProps {
  onClose: () => void;
}

export const TutorialModal: React.FC<TutorialModalProps> = ({ onClose }) => {
  const t = useTranslation();
  const [currentStep, setCurrentStep] = useState<number>(0);

  const TUTORIAL_STEPS: TutorialStep[] = useMemo(
    () => [
      {
        title: t.tutorial.welcome.title,
        content: t.tutorial.welcome.content,
        Icon: BookOpen,
      },
      {
        title: t.tutorial.selectAge.title,
        content: t.tutorial.selectAge.content,
        Icon: Target,
      },
      {
        title: t.tutorial.selectGame.title,
        content: t.tutorial.selectGame.content,
        Icon: Gamepad2,
      },
      {
        title: t.tutorial.answerCorrectly.title,
        content: t.tutorial.answerCorrectly.content,
        Icon: Target,
      },
      {
        title: t.tutorial.beCareful.title,
        content: t.tutorial.beCareful.content,
        Icon: Heart,
      },
      {
        title: t.tutorial.collectAchievements.title,
        content: t.tutorial.collectAchievements.content,
        Icon: Trophy,
      },
    ],
    [t],
  );

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
  const StepIcon = step.Icon;

  return (
    <AppModal
      labelledBy="tutorial-modal-title"
      onClose={onClose}
      size="md"
      panelClassName="relative"
      contentClassName="p-6 text-center sm:p-8"
    >
      <button
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
          e.stopPropagation();
          onClose();
        }}
        className="absolute top-4 right-4 p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors z-10"
        aria-label={t.tutorial.close}
        type="button"
      >
        <X size={20} className="text-slate-600" />
      </button>
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
        <StepIcon size={40} aria-hidden />
      </div>
      <h2 id="tutorial-modal-title" className="text-3xl font-black text-slate-800 mb-4">
        {step.title}
      </h2>
      <p className="text-lg text-slate-600 mb-8 leading-relaxed">{step.content}</p>

      <div className="flex items-center justify-center gap-2 mb-6">
        {TUTORIAL_STEPS.map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all ${
              i === currentStep ? 'bg-emerald-600 w-8' : 'bg-slate-300'
            }`}
          />
        ))}
      </div>

      <div className="flex gap-3">
        {currentStep > 0 && (
          <button
            onClick={prevStep}
            className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft size={20} />
            {t.tutorial.back}
          </button>
        )}
        <button
          onClick={nextStep}
          className={`flex-1 py-3 px-4 rounded-lg font-bold text-white transition-colors flex items-center justify-center gap-2 ${
            isLast ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-slate-900 hover:bg-slate-800'
          }`}
        >
          {isLast ? t.tutorial.startGame : t.tutorial.next}
          {!isLast && <ArrowRight size={20} />}
        </button>
      </div>
    </AppModal>
  );
};
