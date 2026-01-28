import { useState, useCallback, useRef } from 'react';
import { gameRegistry } from '../games/registry';
import { getEffectiveLevel } from '../engine/adaptiveDifficulty';
import { createRng } from '../engine/rng';
import type { Problem, ProfileType } from '../types/game';

// Import registrations to ensure games are registered
import '../games/registrations';

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
    case 'letter_match': return `letter:${prob.word}`;
    case 'sentence_logic': return `sent:${prob.sentence}`;
    case 'balance_scale': return `bal:${prob.display.left.join(',')}|${prob.display.right.join(',')}`;
    case 'pattern': return `pat:${prob.sequence.join('')}:${prob.answer}`;
    case 'memory_math': return `mem:${prob.cards.map((c) => c.content).join('|')}`;
    case 'robo_path': return `robo:${prob.grid.length}:${prob.goal[0]},${prob.goal[1]}:${prob.obstacles.map((o) => `${o[0]},${o[1]}`).join(';')}`;
    case 'math_snake': {
      const apple = prob.apple;
      const mathKey = prob.math ? prob.math.equation : 'none';
      return `snake:${prob.gridSize}:${apple?.kind ?? 'none'}:${apple ? apple.pos.join(',') : 'none'}:${mathKey}`;
    }
    case 'time_match': return `time:${prob.answer}`;
    case 'unit_conversion': return `unit:${prob.value}${prob.fromUnit}=${prob.answer}${prob.toUnit}`;
    default: {
      // TypeScript narrowing - this should never happen but satisfies type checker
      return `${String((prob as Problem).type)}:${(prob as Problem).uid}`;
    }
  }
};

export function useGameEngine() {
  const [rng] = useState(() => {
    if (typeof window === 'undefined') {
      return createRng(Date.now());
    }
    const params = new URLSearchParams(window.location.search);
    const seedParam = params.get('seed');
    const parsed = seedParam ? parseInt(seedParam, 10) : null;
    return createRng(Number.isFinite(parsed) && parsed !== null ? parsed : Date.now());
  });
  
  const lastKeysRef = useRef<Record<string, string[]>>({});
  // Track last words separately for word-based games to avoid consecutive duplicates
  const lastWordsRef = useRef<Record<string, string[]>>({});

  const getRng = useCallback(() => rng, [rng]);

  const generateUniqueProblem = useCallback((type: string, level: number, profile: string): Problem | null => {
    const buffer = lastKeysRef.current[type] || [];
    const wordBuffer = lastWordsRef.current[type] || [];
    let attempt = 0;
    let prob: Problem;
    let key: string;
    
    // Get generator from registry
    const gameEntry = gameRegistry.get(type);
    if (!gameEntry) {
      console.error(`Game not found in registry: ${type}`);
      return null;
    }
    
    const generator = gameEntry.generator;
    
    // Try up to 30 times to generate a unique problem (increased from 15)
    do {
      prob = generator(level, rng, profile as ProfileType);
      key = makeKey(prob);
      attempt++;
      
      // For word-based games, also check if the word itself was recently used
      const isWordGame = prob.type === 'word_builder' || prob.type === 'word_cascade' || prob.type === 'syllable_builder';
      if (isWordGame) {
        const word = 'target' in prob ? prob.target : '';
        if (word && wordBuffer.includes(word)) {
          continue; // Skip this problem if word was recently used
        }
      }
    } while (attempt < 30 && buffer.includes(key));
    
    // Keep last 50 problems (increased from 20)
    const nextBuffer = [key, ...buffer].slice(0, 50);
    lastKeysRef.current = { ...lastKeysRef.current, [type]: nextBuffer };
    
    // For word-based games, also track the word itself
    const isWordGame = prob.type === 'word_builder' || prob.type === 'word_cascade' || prob.type === 'syllable_builder';
    if (isWordGame) {
      const word = 'target' in prob ? prob.target : '';
      if (word) {
        // Keep last 15 words to avoid consecutive duplicates
        const nextWordBuffer = [word, ...wordBuffer].slice(0, 15);
        lastWordsRef.current = { ...lastWordsRef.current, [type]: nextWordBuffer };
      }
    }
    
    return prob;
  }, [rng]);

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

  const validateAnswer = useCallback((problem: Problem, userAnswer: unknown): boolean => {
    if (!problem) return false;
    
    // Get validator from registry
    const gameEntry = gameRegistry.get(problem.type);
    if (!gameEntry) {
      console.warn(`Game not found in registry for validation: ${problem.type}`);
      return false;
    }
    
    // Use the registered validator
    return gameEntry.validator(problem, userAnswer);
  }, []);

  return {
    generateUniqueProblemForGame,
    validateAnswer,
    getRng,
  };
}
