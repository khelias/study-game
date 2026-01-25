import { useState, useCallback, useRef } from 'react';
import { Generators } from '../games/generators';
import { getEffectiveLevel } from '../engine/adaptiveDifficulty';
import { createRng } from '../engine/rng';

interface Problem {
  type: string;
  answer: any;
  uid?: string;
  [key: string]: any;
}

interface AdaptiveDifficulty {
  recentAccuracy: boolean[];
  averageResponseTime: number[];
  consecutiveCorrect: number;
  consecutiveWrong: number;
  difficultyMultiplier: number;
  levelAdjustment: number;
}

const makeKey = (prob: Problem | null): string => {
  if (!prob) return '';
  switch(prob.type) {
    case 'word_builder': return `word:${prob.target}`;
    case 'syllable_builder': return `syll:${prob.target}`;
    case 'letter_match': return `letter:${prob.display}`;
    case 'sentence_logic': return `sent:${prob.display}`;
    case 'balance_scale': return `bal:${prob.display.left.join(',')}|${prob.display.right.join(',')}`;
    case 'pattern': return `pat:${prob.sequence.join('')}:${prob.answer}`;
    case 'memory_math': return `mem:${prob.cards.map((c: any) => c.content).join('|')}`;
    case 'robo_path': return `robo:${prob.gridSize}:${prob.end.x},${prob.end.y}:${prob.obstacles.map((o: any) => `${o.x},${o.y}`).join(';')}`;
    case 'time_match': return `time:${prob.answer}`;
    case 'unit_conversion': return `unit:${prob.value}${prob.fromUnit}=${prob.answer}${prob.toUnit}`;
    default: return `${prob.type}:${prob.answer || prob.display || prob.uid}`;
  }
};

export function useGameEngine() {
  const [rng] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const seedParam = params.get('seed');
    const parsed = seedParam ? parseInt(seedParam, 10) : null;
    return createRng(Number.isFinite(parsed) ? parsed : Date.now());
  });
  
  const [lastKeys, setLastKeys] = useState<Record<string, string[]>>({});

  const generateUniqueProblem = useCallback((type: string, level: number, profile: string): Problem | null => {
    const buffer = lastKeys[type] || [];
    let attempt = 0;
    let prob: Problem;
    let key: string;
    
    // Try up to 15 times to generate a unique problem
    do {
      prob = Generators[type](level, rng, profile);
      key = makeKey(prob);
      attempt++;
    } while (attempt < 15 && buffer.includes(key));
    
    const nextBuffer = [key, ...buffer].slice(0, 20); // Keep last 20 problems
    setLastKeys(prev => ({ ...prev, [type]: nextBuffer }));
    
    return prob;
  }, [rng, lastKeys]);

  const generateUniqueProblemForGame = useCallback((gameType: string, level: number, profile: string, adaptiveDifficulty: AdaptiveDifficulty): Problem | null => {
    try {
      // Handle advanced versions of games
      const baseType = gameType.replace('_adv', '');
      const actualType = baseType !== gameType ? baseType : gameType;
      
      // Get effective level with adaptive difficulty
      const effectiveLevel = getEffectiveLevel(level, adaptiveDifficulty);
      
      return generateUniqueProblem(actualType, effectiveLevel, profile);
    } catch (error) {
      console.error('Error generating problem:', error);
      return null;
    }
  }, [generateUniqueProblem]);

  const validateAnswer = useCallback((problem: Problem, userAnswer: any): boolean => {
    if (!problem) return false;
    
    // The actual validation is handled by the game views
    // This is a placeholder for any additional validation logic
    return userAnswer === problem.answer;
  }, []);

  return {
    generateUniqueProblemForGame,
    validateAnswer,
  };
}
