import { describe, it, expect } from 'vitest';
import { validateRhythmEcho, getBeatAccuracy } from '../validators';
import { createRng } from '../../engine/rng';
import { Generators } from '../generators';
import type { Beat } from '../../types/game';

describe('Validators', () => {
  describe('rhythm_echo', () => {
    it('should validate perfect match', () => {
      const rng = createRng(12345);
      const generator = Generators.rhythm_echo;
      if (!generator) throw new Error('rhythm_echo generator not found');
      
      const problem = generator(1, rng, 'starter');
      const playerBeats: Beat[] = problem.pattern.beats.map(beat => ({
        time: beat.time,
        pad: beat.pad,
      }));
      
      const result = validateRhythmEcho(problem, playerBeats);
      expect(result).toBe(true);
    });

    it('should validate when beats are within tolerance', () => {
      const rng = createRng(12345);
      const generator = Generators.rhythm_echo;
      if (!generator) throw new Error('rhythm_echo generator not found');
      
      const problem = generator(1, rng, 'starter');
      const tolerance = problem.toleranceMs;
      
      // Add slight timing variations within tolerance
      const playerBeats: Beat[] = problem.pattern.beats.map(beat => ({
        time: beat.time + (Math.random() * tolerance * 0.5), // Within half tolerance
        pad: beat.pad,
      }));
      
      const result = validateRhythmEcho(problem, playerBeats);
      expect(result).toBe(true);
    });

    it('should fail when not enough beats tapped', () => {
      const rng = createRng(12345);
      const generator = Generators.rhythm_echo;
      if (!generator) throw new Error('rhythm_echo generator not found');
      
      const problem = generator(1, rng, 'starter');
      const playerBeats: Beat[] = problem.pattern.beats.slice(0, -1); // Missing last beat
      
      const result = validateRhythmEcho(problem, playerBeats);
      expect(result).toBe(false);
    });

    it('should fail when beats are outside tolerance', () => {
      const rng = createRng(12345);
      const generator = Generators.rhythm_echo;
      if (!generator) throw new Error('rhythm_echo generator not found');
      
      const problem = generator(1, rng, 'starter');
      const tolerance = problem.toleranceMs;
      
      // Add timing variations outside tolerance
      const playerBeats: Beat[] = problem.pattern.beats.map(beat => ({
        time: beat.time + tolerance * 2, // Way outside tolerance
        pad: beat.pad,
      }));
      
      const result = validateRhythmEcho(problem, playerBeats);
      expect(result).toBe(false);
    });

    it('should fail when wrong pads are used', () => {
      const rng = createRng(12345);
      const generator = Generators.rhythm_echo;
      if (!generator) throw new Error('rhythm_echo generator not found');
      
      const problem = generator(8, rng, 'starter'); // Duo mode with drum and bell
      
      // Use wrong pads
      const playerBeats: Beat[] = problem.pattern.beats.map(beat => ({
        time: beat.time,
        pad: beat.pad === 'drum' ? 'bell' : 'drum', // Swap pads
      }));
      
      const result = validateRhythmEcho(problem, playerBeats);
      expect(result).toBe(false);
    });

    it('should pass with 70% accuracy', () => {
      const rng = createRng(12345);
      const generator = Generators.rhythm_echo;
      if (!generator) throw new Error('rhythm_echo generator not found');
      
      const problem = generator(1, rng, 'starter');
      const targetBeats = problem.pattern.beats;
      
      // Hit 70% of the beats correctly
      const hitCount = Math.ceil(targetBeats.length * 0.7);
      const playerBeats: Beat[] = targetBeats.slice(0, hitCount);
      
      const result = validateRhythmEcho(problem, playerBeats);
      expect(result).toBe(true);
    });

    it('should fail with less than 70% accuracy', () => {
      const rng = createRng(12345);
      const generator = Generators.rhythm_echo;
      if (!generator) throw new Error('rhythm_echo generator not found');
      
      const problem = generator(1, rng, 'starter');
      const targetBeats = problem.pattern.beats;
      
      // Hit only 50% of the beats
      const hitCount = Math.floor(targetBeats.length * 0.5);
      const playerBeats: Beat[] = targetBeats.slice(0, hitCount);
      
      const result = validateRhythmEcho(problem, playerBeats);
      expect(result).toBe(false);
    });
  });

  describe('getBeatAccuracy', () => {
    it('should return perfect for very small offsets', () => {
      const tolerance = 100;
      const offset = 20; // 20% of tolerance
      
      const accuracy = getBeatAccuracy(offset, tolerance);
      expect(accuracy).toBe('perfect');
    });

    it('should return good for medium offsets', () => {
      const tolerance = 100;
      const offset = 50; // 50% of tolerance
      
      const accuracy = getBeatAccuracy(offset, tolerance);
      expect(accuracy).toBe('good');
    });

    it('should return ok for larger offsets within tolerance', () => {
      const tolerance = 100;
      const offset = 80; // 80% of tolerance
      
      const accuracy = getBeatAccuracy(offset, tolerance);
      expect(accuracy).toBe('ok');
    });

    it('should return miss for offsets outside tolerance', () => {
      const tolerance = 100;
      const offset = 150; // 150% of tolerance
      
      const accuracy = getBeatAccuracy(offset, tolerance);
      expect(accuracy).toBe('miss');
    });

    it('should handle negative offsets', () => {
      const tolerance = 100;
      
      expect(getBeatAccuracy(-20, tolerance)).toBe('perfect');
      expect(getBeatAccuracy(-50, tolerance)).toBe('good');
      expect(getBeatAccuracy(-80, tolerance)).toBe('ok');
      expect(getBeatAccuracy(-150, tolerance)).toBe('miss');
    });

    it('should handle exact tolerance boundaries', () => {
      const tolerance = 100;
      
      // 30% boundary
      expect(getBeatAccuracy(30, tolerance)).toBe('perfect');
      expect(getBeatAccuracy(31, tolerance)).toBe('good');
      
      // 60% boundary
      expect(getBeatAccuracy(60, tolerance)).toBe('good');
      expect(getBeatAccuracy(61, tolerance)).toBe('ok');
      
      // 100% boundary
      expect(getBeatAccuracy(100, tolerance)).toBe('ok');
      expect(getBeatAccuracy(101, tolerance)).toBe('miss');
    });
  });
});
