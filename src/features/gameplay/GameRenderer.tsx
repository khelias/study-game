import React from 'react';
import { 
  BalanceScaleView, 
  StandardGameView, 
  WordGameView, 
  PatternTrainView, 
  MemoryGameView, 
  RoboPathView, 
  SyllableGameView, 
  TimeGameView, 
  UnitConversionView 
} from '../../components/GameViews';
import type { 
  Problem,
  BalanceScaleProblem,
  WordBuilderProblem,
  PatternProblem,
  MemoryMathProblem,
  RoboPathProblem,
  SyllableBuilderProblem,
  TimeMatchProblem,
  UnitConversionProblem,
  SentenceLogicProblem,
  LetterMatchProblem
} from '../../types/game';
import { useTranslation } from '../../i18n/useTranslation';

interface GameRendererProps {
  gameType: string;
  problem: Problem;
  onAnswer: (isCorrect: boolean) => void;
  soundEnabled: boolean;
}

export const GameRenderer: React.FC<GameRendererProps> = ({ gameType, problem, onAnswer, soundEnabled }) => {
  const t = useTranslation();
  // Handle advanced versions by removing '_adv' suffix
  const baseGameType = gameType.replace('_adv', '');
  
  switch (baseGameType) {
    case 'word_builder':
      return <WordGameView problem={problem as WordBuilderProblem} onAnswer={onAnswer} soundEnabled={soundEnabled} />;
    
    case 'memory_math':
      return <MemoryGameView problem={problem as MemoryMathProblem} onAnswer={onAnswer} soundEnabled={soundEnabled} />;
    
    case 'pattern':
      return <PatternTrainView problem={problem as PatternProblem} onAnswer={onAnswer} soundEnabled={soundEnabled} />;
    
    case 'balance_scale':
      return <BalanceScaleView problem={problem as BalanceScaleProblem} onAnswer={onAnswer} soundEnabled={soundEnabled} />;
    
    case 'robo_path':
      return <RoboPathView problem={problem as RoboPathProblem} onAnswer={onAnswer} soundEnabled={soundEnabled} />;
    
    case 'syllable_builder':
      return <SyllableGameView problem={problem as SyllableBuilderProblem} onAnswer={onAnswer} soundEnabled={soundEnabled} />;
    
    case 'time_match':
      return <TimeGameView problem={problem as TimeMatchProblem} onAnswer={onAnswer} soundEnabled={soundEnabled} />;
    
    case 'unit_conversion':
      return <UnitConversionView problem={problem as UnitConversionProblem} onAnswer={onAnswer} soundEnabled={soundEnabled} />;
    
    case 'letter_match':
    case 'sentence_logic':
      return <StandardGameView problem={problem as SentenceLogicProblem | LetterMatchProblem} onAnswer={onAnswer} soundEnabled={soundEnabled} />;
    
    default:
      return (
        <div className="text-center p-8 text-red-600">
          {t.errors.unknownGameType}: "{gameType}"
        </div>
      );
  }
};
