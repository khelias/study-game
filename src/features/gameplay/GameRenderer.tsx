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

interface Problem {
  type: string;
  answer: any;
  uid?: string;
  [key: string]: any;
}

interface GameRendererProps {
  gameType: string;
  problem: Problem;
  onAnswer: (isCorrect: boolean) => void;
  soundEnabled: boolean;
}

export const GameRenderer: React.FC<GameRendererProps> = ({ gameType, problem, onAnswer, soundEnabled }) => {
  // Handle advanced versions by removing '_adv' suffix
  const baseGameType = gameType.replace('_adv', '');
  
  switch (baseGameType) {
    case 'word_builder':
      return <WordGameView problem={problem} onAnswer={onAnswer} soundEnabled={soundEnabled} />;
    
    case 'memory_math':
      return <MemoryGameView problem={problem} onAnswer={onAnswer} soundEnabled={soundEnabled} />;
    
    case 'pattern':
      return <PatternTrainView problem={problem} onAnswer={onAnswer} soundEnabled={soundEnabled} />;
    
    case 'balance_scale':
      return <BalanceScaleView problem={problem} onAnswer={onAnswer} soundEnabled={soundEnabled} />;
    
    case 'robo_path':
      return <RoboPathView problem={problem} onAnswer={onAnswer} soundEnabled={soundEnabled} />;
    
    case 'syllable_builder':
      return <SyllableGameView problem={problem} onAnswer={onAnswer} soundEnabled={soundEnabled} />;
    
    case 'time_match':
      return <TimeGameView problem={problem} onAnswer={onAnswer} soundEnabled={soundEnabled} />;
    
    case 'unit_conversion':
      return <UnitConversionView problem={problem} onAnswer={onAnswer} soundEnabled={soundEnabled} />;
    
    case 'letter_match':
    case 'sentence_logic':
      return <StandardGameView problem={problem} onAnswer={onAnswer} soundEnabled={soundEnabled} />;
    
    default:
      return (
        <div className="text-center p-8 text-red-600">
          Viga: Tundmatu mängutüüp "{gameType}"
        </div>
      );
  }
};
