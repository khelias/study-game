import { useState, useCallback } from 'react';
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

// CRITICAL FIX: Move buffers to module level so they're shared across ALL hook instances
// Previously, each useGameEngine() call created separate buffers, causing duplicate words
// when useAnswerHandler and GameScreen both called useGameEngine()
const sharedLastKeys: Record<string, string[]> = {};
const sharedLastWords: Record<string, string[]> = {};

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

  const getRng = useCallback(() => rng, [rng]);

  const generateUniqueProblem = useCallback((type: string, level: number, profile: string): Problem | null => {
    // CRITICAL: Use shared module-level buffers so all hook instances share the same state
    const buffer = sharedLastKeys[type] || [];
    // CRITICAL: Always normalize wordBuffer to lowercase when reading
    // The buffer should store lowercase, but handle legacy mixed-case data
    const wordBuffer = (sharedLastWords[type] || []).map(w => w.toLowerCase());
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
    
    // Try up to 50 times to generate a unique problem (increased from 30)
    do {
      prob = generator(level, rng, profile as ProfileType);
      key = makeKey(prob);
      attempt++;
      
      // For word-based games, check both the word and the key
      const isWordGame = prob.type === 'word_builder' || prob.type === 'word_cascade' || prob.type === 'syllable_builder';
      if (isWordGame) {
        const word = 'target' in prob ? prob.target : '';
        // CRITICAL: Compare words case-insensitively since applyLetterCase changes case by level
        // The same word might appear as "KASS", "Kass", or "kass" depending on level
        const wordLower = word ? word.toLowerCase() : '';
        // CRITICAL: wordBuffer is already normalized to lowercase at function start
        const isDuplicateWord = wordLower && wordBuffer.includes(wordLower);
        const isDuplicateKey = buffer.includes(key);
        
        // Debug logging in development to understand what's happening
        if (process.env.NODE_ENV === 'development' && attempt === 1) {
          console.log(`[generateUniqueProblem] Type: ${type}, Word: ${word} (${wordLower}), Buffer: [${wordBuffer.join(', ')}], IsDuplicate: ${isDuplicateWord}`);
        }
        
        // Skip if word (case-insensitive) was recently used OR if the exact problem (key) was used
        if (isDuplicateWord || isDuplicateKey) {
          // This word/problem was recently used, try again
          continue;
        }
        // Found a unique word and unique problem - exit loop
        break;
      }
      
      // For non-word games, just check the key
      if (!buffer.includes(key)) {
        break;
      }
    } while (attempt < 50);
    
    // Safety check: If we hit max attempts, log a warning (but still return the problem)
    if (attempt >= 50) {
      console.warn(`generateUniqueProblem: Hit max attempts (50) for type ${type}, level ${level}. May have duplicate.`);
    }
    
    // Keep last 50 problems (increased from 20)
    // CRITICAL: Update shared module-level buffer so all hook instances see the same state
    const nextBuffer = [key, ...buffer].slice(0, 50);
    sharedLastKeys[type] = nextBuffer;
    
    // For word-based games, also track the word itself (case-insensitive)
    const isWordGame = prob.type === 'word_builder' || prob.type === 'word_cascade' || prob.type === 'syllable_builder';
    if (isWordGame) {
      const word = 'target' in prob ? prob.target : '';
      if (word) {
        // Store word in lowercase to ensure case-insensitive comparison
        // This prevents "KASS", "Kass", "kass" from being treated as different words
        const wordLower = word.toLowerCase();
        // Always update buffer - remove existing instance (if any) and add to front
        // This ensures FIFO behavior and prevents duplicates
        const filtered = wordBuffer.filter(w => w !== wordLower);
        const nextWordBuffer = [wordLower, ...filtered].slice(0, 25);
        sharedLastWords[type] = nextWordBuffer;
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
