/**
 * WordCascadeView (MVP)
 *
 * Arcade-style word builder: letters fall in lanes, player taps to build the target word.
 * Dictionary source is curated (WORD_DB in games/data.ts) via generator.
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { playSound } from '../../engine/audio';
import { useTranslation } from '../../i18n/useTranslation';
import { useGameStore } from '../../stores/gameStore';
import { ALPHABET, GAME_CONFIG } from '../../games/data';
import { PaidHintButtons } from '../shared';
import type { WordCascadeProblem } from '../../types/game';

type FallingItemKind = 'letter' | 'star' | 'heart' | 'strike';

type FallingItem = {
  id: string;
  kind: FallingItemKind;
  char: string;
  lane: number;
  y: number;
};

interface WordCascadeViewProps {
  problem: WordCascadeProblem;
  onAnswer: (isCorrect: boolean) => void;
  soundEnabled: boolean;
  level?: number;
  gameType?: string;
  stars?: number;
  spendStars?: (count: number) => boolean;
}

const BOARD_H = 320;

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

// Estonian visually/phonetically similar letters (for smart distractors)
const SIMILAR_LETTERS: Record<string, string[]> = {
  'A': ['Ä', 'E', 'O'],
  'Ä': ['A', 'E', 'Ö'],
  'E': ['A', 'Ä', 'I'],
  'I': ['E', 'L', 'J'],
  'O': ['Ö', 'A', 'Q'],
  'Ö': ['O', 'Ü', 'Õ'],
  'U': ['Ü', 'V', 'Y'],
  'Ü': ['U', 'Ö', 'Y'],
  'Õ': ['O', 'Ö', 'A'],
  'K': ['G', 'H', 'R'],
  'G': ['K', 'Q', 'C'],
  'P': ['B', 'R', 'D'],
  'B': ['P', 'D', 'R'],
  'T': ['D', 'L', 'F'],
  'D': ['T', 'B', 'P'],
  'S': ['Z', 'Š', 'C'],
  'Š': ['S', 'Z', 'Ž'],
  'Z': ['S', 'Ž', 'Š'],
  'Ž': ['Z', 'Š', 'S'],
  'L': ['I', 'T', 'J'],
  'R': ['K', 'P', 'N'],
  'M': ['N', 'W', 'H'],
  'N': ['M', 'R', 'H']
};

// Progressive distractor probability by level
function getDistractorProbability(level: number): number {
  if (level <= 3) return 0; // No distractors early
  if (level <= 6) return 0.25; // 25% chance (light)
  if (level <= 10) return 0.45; // 45% chance (moderate)
  return 0.55; // 55% chance (expert)
}

// Get a smart distractor letter (prefers visually similar, excludes target word letters)
// Preserves case style of target word
function getDistractorLetter(targetWord: string, neededLetter: string | null): string {
  // Detect case style of target word
  const targetChars = targetWord.split('');
  const hasUpper = targetChars.some(c => c !== c.toLowerCase());
  const hasLower = targetChars.some(c => c !== c.toUpperCase());
  const isTitleCase = targetChars.length > 0 && 
    targetChars[0] === targetChars[0].toUpperCase() &&
    targetChars.slice(1).every(c => c === c.toLowerCase());
  
  const caseStyle: 'upper' | 'lower' | 'title' | 'mixed' = 
    !hasLower ? 'upper' :
    !hasUpper ? 'lower' :
    isTitleCase ? 'title' : 'mixed';

  const targetCharsUpper = targetWord.toUpperCase().split('');
  const availableLetters = ALPHABET.filter(letter => !targetCharsUpper.includes(letter));
  
  if (availableLetters.length === 0) {
    // Fallback: use any letter if all are in target (unlikely but safe)
    const fallback = ALPHABET[Math.floor(Math.random() * ALPHABET.length)] ?? 'A';
    return caseStyle === 'upper' ? fallback : fallback.toLowerCase();
  }

  // Try to find a visually similar letter to the needed letter or a random target letter
  const referenceLetter = neededLetter?.toUpperCase() ?? targetCharsUpper[Math.floor(Math.random() * targetCharsUpper.length)] ?? 'A';
  const similar = SIMILAR_LETTERS[referenceLetter];
  
  let distractor: string;
  if (similar && similar.length > 0) {
    // Filter to only similar letters that aren't in target word
    const validSimilar = similar.filter(letter => availableLetters.includes(letter));
    if (validSimilar.length > 0) {
      distractor = validSimilar[Math.floor(Math.random() * validSimilar.length)] ?? availableLetters[0] ?? 'A';
    } else {
      distractor = availableLetters[Math.floor(Math.random() * availableLetters.length)] ?? 'A';
    }
  } else {
    // Fallback: random letter from available (not in target word)
    distractor = availableLetters[Math.floor(Math.random() * availableLetters.length)] ?? 'A';
  }
  
  // Apply case style
  if (caseStyle === 'upper') {
    return distractor;
  } else if (caseStyle === 'lower' || caseStyle === 'title') {
    return distractor.toLowerCase();
  } else {
    // Mixed case: random upper/lower
    return Math.random() > 0.5 ? distractor : distractor.toLowerCase();
  }
}

export const WordCascadeView: React.FC<WordCascadeViewProps> = ({ problem, onAnswer, soundEnabled, level = 1, gameType, stars = 0 }) => {
  const t = useTranslation();
  const baseType = gameType?.replace('_adv', '') ?? 'word_cascade';
  const paidHints = GAME_CONFIG[baseType]?.paidHints ?? [];
  const [progress, setProgress] = useState('');
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [letters, setLetters] = useState<FallingItem[]>([]);
  const [strikes, setStrikes] = useState(0);
  const [shakeBarrier, setShakeBarrier] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [showPickupHint, setShowPickupHint] = useState(false);
  const earnStars = useGameStore(state => state.earnStars);
  const addHeart = useGameStore(state => state.addHeart);
  const nextIdx = progress.length;
  const gameTitle = t.games['word_cascade' as keyof typeof t.games]?.title ?? 'Word Cascade';
  const MAX_STRIKES = 3;

  const laneCount = clamp(problem.columns ?? 4, 3, 6);
  
  // Slower, more forgiving speed - balanced for good gameplay
  const speed = useMemo(() => {
    const wordFactor = problem.target.length * 0.03;
    const progressBoost = nextIdx * 0.015;
    const strikeRelief = strikes * -0.2;
    const earlySafety = nextIdx === 0 ? -0.25 : 0;
    return clamp(0.7 + wordFactor + progressBoost + strikeRelief + earlySafety, 0.5, 1.6);
  }, [problem.target.length, nextIdx, strikes]);

  // Base spawn interval - will be adjusted dynamically based on screen density
  const baseSpawnMs = useMemo(() => {
    const base = 600 - (problem.target.length * 20);
    const progressFaster = Math.max(0, nextIdx - 1) * -8;
    const strikePause = strikes * 60;
    return clamp(base + progressFaster + strikePause, 400, 800);
  }, [problem.target.length, nextIdx, strikes]);

  const uidRef = useRef(0);
  const tickRef = useRef<number | null>(null);
  const spawnRef = useRef<number | null>(null);
  const wrongFlashTimerRef = useRef<number | null>(null);
  const penaltyCooldownRef = useRef(false);
  const bottomPenaltyTimerRef = useRef<number | null>(null);
  const strikesRef = useRef(0);
  const endedRef = useRef(false);
  const firstSelectedYRef = useRef<number | null>(null);
  const forgivenIdsRef = useRef<Set<string>>(new Set());
  const shakeTimerRef = useRef<number | null>(null);
  const hasShownPickupHintRef = useRef(false);

  // Respect user's reduced motion preference
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setPrefersReducedMotion(media.matches);
    update();
    if (typeof media.addEventListener === 'function') {
      media.addEventListener('change', update);
      return () => media.removeEventListener('change', update);
    }
    media.addListener(update);
    return () => media.removeListener(update);
  }, []);

  // Reset on new problem
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    setProgress('');
    setStatus('idle');
    setLetters([]);
    /* eslint-enable react-hooks/set-state-in-effect */
    penaltyCooldownRef.current = false;
    setStrikes(0);
    strikesRef.current = 0;
    endedRef.current = false;
    firstSelectedYRef.current = null;
    forgivenIdsRef.current = new Set();
    setShakeBarrier(false);
    setShowPickupHint(false);
    hasShownPickupHintRef.current = false;
    if (shakeTimerRef.current) {
      window.clearTimeout(shakeTimerRef.current);
      shakeTimerRef.current = null;
    }
    if (wrongFlashTimerRef.current) {
      window.clearTimeout(wrongFlashTimerRef.current);
      wrongFlashTimerRef.current = null;
    }
    if (bottomPenaltyTimerRef.current) {
      window.clearTimeout(bottomPenaltyTimerRef.current);
      bottomPenaltyTimerRef.current = null;
    }
  }, [problem.uid, problem.target]);

  // Density-based spawning: maintain 4-6 letters on screen, prevent accumulation
  useEffect(() => {
    if (spawnRef.current) {
      window.clearInterval(spawnRef.current);
      spawnRef.current = null;
    }

    spawnRef.current = window.setInterval(() => {
      if (endedRef.current) return;
      
      setLetters(prev => {
        const letterCount = prev.filter(l => l.kind === 'letter').length;
        const pickupsOnScreen = prev.filter(p => p.kind !== 'letter').length;
        const need = problem.target[nextIdx] ?? '';
        const hasNeededOnScreen = !!need && prev.some(l => l.kind === 'letter' && l.char.toLowerCase() === need.toLowerCase());

        // Density control: don't spawn if too many letters already on screen
        const MAX_LETTERS = 6;
        if (letterCount >= MAX_LETTERS) {
          return prev; // Don't spawn, wait for player to tap
        }

        // Optional pickups (only after the first correct letter, capped on screen)
        const canSpawnPickup = nextIdx > 0 && pickupsOnScreen < 2;
        if (canSpawnPickup && Math.random() < 0.08) {
          const kinds: FallingItemKind[] = ['star', 'heart'];
          if (strikesRef.current > 0) kinds.push('strike');
          const kind = kinds[Math.floor(Math.random() * kinds.length)];
          const char =
            kind === 'star' ? '⭐' :
            kind === 'heart' ? '❤' :
            '🛡️';
          const lane = Math.floor(Math.random() * laneCount);
          const id = `wc-${problem.uid}-${problem.target}-pickup-${uidRef.current++}`;
          return [{ id, kind, char, lane, y: -24 }, ...prev].slice(0, 20);
        }

        // Progressive distractor system: spawn incorrect letters based on level
        const distractorProbability = getDistractorProbability(level);
        const shouldSpawnDistractor = Math.random() < distractorProbability;

        let char: string;
        
        if (shouldSpawnDistractor) {
          // Spawn a distractor (incorrect letter)
          char = getDistractorLetter(problem.target, need);
        } else {
          // Spawn a correct letter (from target word)
          // Smart letter selection: prioritize needed letter when screen is sparse
          let spawnNeeded = false;
          if (need) {
            if (hasNeededOnScreen) {
              // Needed letter already available, normal distribution
              spawnNeeded = Math.random() < 0.4;
            } else {
              // Needed letter not on screen - higher priority when screen is empty
              if (letterCount < 3) {
                spawnNeeded = Math.random() < 0.9; // Very high priority when sparse
              } else {
                spawnNeeded = Math.random() < 0.7; // High priority when moderate
              }
            }
          }

          const fallbackChar = problem.target[Math.floor(Math.random() * problem.target.length)] ?? need;
          char = spawnNeeded ? need : fallbackChar;
        }

        const lane = Math.floor(Math.random() * laneCount);
        const id = `wc-${problem.uid}-${problem.target}-${uidRef.current++}`;

        return [{ id, kind: 'letter', char, lane, y: -24 }, ...prev].slice(0, 20);
      });
    }, baseSpawnMs);

    return () => {
      if (spawnRef.current) {
        window.clearInterval(spawnRef.current);
        spawnRef.current = null;
      }
    };
  }, [problem.uid, problem.target, nextIdx, laneCount, baseSpawnMs, level]);

  // Animate falling letters
  useEffect(() => {
    if (tickRef.current) window.clearInterval(tickRef.current);
    tickRef.current = window.setInterval(() => {
      if (endedRef.current) return;
      setLetters(prev => {
        const next = prev
          .map(l => ({ ...l, y: l.y + 6 * speed }))
          .filter(l => l.y < BOARD_H + 40);
        return next;
      });
    }, 50);
    return () => {
      if (tickRef.current) window.clearInterval(tickRef.current);
      tickRef.current = null;
    };
  }, [speed]);

  // If letters pile up too much near bottom, treat as a mistake (heart loss via onAnswer(false))
  useEffect(() => {
    const bottomLetters = letters.filter(l => {
      if (l.kind !== 'letter') return false;
      // Only count letters that hit the bottom
      if (l.y <= BOARD_H - 10) return false;
      // Forgiven: letters that were already below the first-selected Y when the first letter was tapped
      if (forgivenIdsRef.current.has(l.id)) return false;
      return true;
    });
    
    if (bottomLetters.length === 0) return;
    // Before the player has even chosen the first letter, we treat bottom hits as \"free\" –
    // no strikes or hearts yet, to avoid punishing kids who are just orienting.
    if (nextIdx === 0) {
      return;
    }
    if (penaltyCooldownRef.current) return;
    if (endedRef.current) return;

    // Remove bottom-hit letters immediately so we don't repeatedly penalize.
    /* eslint-disable react-hooks/set-state-in-effect */
    setLetters(prev => prev.filter(l => l.y <= BOARD_H - 10));
    setStatus('wrong');
    /* eslint-enable react-hooks/set-state-in-effect */

    if (!prefersReducedMotion) {
      setShakeBarrier(true);
      if (shakeTimerRef.current) {
        window.clearTimeout(shakeTimerRef.current);
      }
      shakeTimerRef.current = window.setTimeout(() => {
        setShakeBarrier(false);
      }, 180);
    }

    // Increase internal strikes deterministically (ref-backed).
    const nextStrikes = Math.min(MAX_STRIKES, strikesRef.current + 1);
    strikesRef.current = nextStrikes;
    setStrikes(nextStrikes);

    penaltyCooldownRef.current = true;
    playSound('wrong', soundEnabled);

    if (wrongFlashTimerRef.current) window.clearTimeout(wrongFlashTimerRef.current);
    wrongFlashTimerRef.current = window.setTimeout(() => {
      setStatus('idle');
      penaltyCooldownRef.current = false;
    }, 220);

    // If we just hit the strike limit, trigger a single global wrong-answer (heart spend + game over).
    if (nextStrikes >= MAX_STRIKES && !bottomPenaltyTimerRef.current) {
      endedRef.current = true;
      window.setTimeout(() => onAnswer(false), 0);
      bottomPenaltyTimerRef.current = window.setTimeout(() => {
        bottomPenaltyTimerRef.current = null;
      }, 1200);
    }
  }, [letters, nextIdx, onAnswer, soundEnabled, prefersReducedMotion]);

  // Show a one-time hint when pickups first appear on screen
  useEffect(() => {
    if (hasShownPickupHintRef.current) return;
    const hasPickup = letters.some(l => l.kind !== 'letter');
    if (hasPickup && nextIdx > 0) {
      hasShownPickupHintRef.current = true;
      window.setTimeout(() => setShowPickupHint(true), 0);
    }
  }, [letters, nextIdx]);

  const handleTap = (l: FallingItem) => {
    if (endedRef.current) return;
    if (status === 'correct') return;

    // Handle pickups (non-letter entities)
    if (l.kind !== 'letter') {
      // Small safety: do not process pickups before first letter
      if (nextIdx === 0) return;
      setLetters(prev => prev.filter(x => x.id !== l.id));
      if (l.kind === 'star') {
        earnStars(1, 'word_cascade_pickup');
        playSound('correct', soundEnabled);
      } else if (l.kind === 'heart') {
        addHeart(1);
        playSound('correct', soundEnabled);
      } else if (l.kind === 'strike') {
        if (strikesRef.current > 0) {
          const nextStrikes = Math.max(0, strikesRef.current - 1);
          strikesRef.current = nextStrikes;
          setStrikes(nextStrikes);
        }
        playSound('correct', soundEnabled);
      }
      return;
    }

    const need = problem.target[nextIdx];
    if (!need) return;

    playSound('click', soundEnabled);

    // Case-insensitive comparison for letter matching
    if (l.char.toLowerCase() === need.toLowerCase()) {
      // When first letter is tapped: record which letters are "forgiven" (already below that Y)
      if (nextIdx === 0) {
        firstSelectedYRef.current = l.y;
        forgivenIdsRef.current = new Set(letters.filter(x => x.y > l.y).map(x => x.id));
      }

      setLetters(prev => prev.filter(x => x.id !== l.id));
      const nextProgress = progress + l.char;
      setProgress(nextProgress);

      // Reset penalty cooldown on correct tap to allow next letter selection immediately
      penaltyCooldownRef.current = false;
      if (wrongFlashTimerRef.current) {
        window.clearTimeout(wrongFlashTimerRef.current);
        wrongFlashTimerRef.current = null;
      }

      // Case-insensitive comparison for word completion
      if (nextProgress.toLowerCase() === problem.target.toLowerCase()) {
        setStatus('correct');
        playSound('correct', soundEnabled);
        window.setTimeout(() => onAnswer(true), 150);
      }
      return;
    }

    // Wrong letter: charge the penalty, but don't "lock" the round.
    // IMPORTANT: Wrong taps should NOT cost a heart (too punishing).
    // We only penalize hearts when letters reach the bottom.
    // Brief red flash + short cooldown to prevent spam-clicking.
    if (penaltyCooldownRef.current) return;
    penaltyCooldownRef.current = true;

    setStatus('wrong');
    playSound('wrong', soundEnabled);
    // Remove the tapped wrong letter as a small penalty (reduces clutter).
    setLetters(prev => prev.filter(x => x.id !== l.id));
    if (wrongFlashTimerRef.current) window.clearTimeout(wrongFlashTimerRef.current);
    wrongFlashTimerRef.current = window.setTimeout(() => {
      setStatus('idle');
      penaltyCooldownRef.current = false;
    }, 180);

    // No onAnswer(false) here — wrong taps do not spend hearts.
  };

  const slots = Array.from({ length: problem.target.length }, (_, i) => ({
    char: progress[i] ?? '',
    isActive: i === nextIdx,
  }));

  return (
    <div className="w-full flex flex-col items-center px-4 sm:px-6 max-w-2xl mx-auto pt-4 sm:pt-6 animate-in fade-in duration-300">
      <div className="text-6xl sm:text-8xl mb-2 sm:mb-3 filter drop-shadow-xl">{problem.emoji}</div>

      {/* Internal strikes indicator (does NOT spend hearts directly) */}
      <div className="flex items-center justify-center gap-1 mb-2">
        {Array.from({ length: MAX_STRIKES }).map((_, i) => (
          <span
            key={i}
            className={[
              'w-4 h-4 rounded-full border border-red-200',
              i < strikes ? 'bg-red-500' : 'bg-white',
            ].join(' ')}
            aria-hidden="true"
          />
        ))}
      </div>

      {/* Target word slots */}
      <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 mb-3 sm:mb-4">
        {slots.map((s, i) => (
          <div
            key={i}
            className={[
              'w-10 h-12 sm:w-12 sm:h-14 rounded-xl flex items-center justify-center text-xl sm:text-2xl font-black border-b-4',
              s.char
                ? 'bg-pink-100 border-pink-300 text-pink-700'
                : s.isActive
                ? 'bg-white border-purple-300 text-slate-300'
                : 'bg-slate-100 border-slate-200 text-slate-300',
            ].join(' ')}
          >
            {s.char}
          </div>
        ))}
      </div>

      {/* Play area */}
      <div
        className={[
          'w-full rounded-3xl border-2 shadow-lg overflow-hidden relative',
          shakeBarrier && !prefersReducedMotion ? 'wc-barrier-shake' : '',
          status === 'wrong' ? 'bg-red-50 border-red-200' : status === 'correct' ? 'bg-green-50 border-green-200' : 'bg-white border-slate-200',
        ].join(' ')}
        style={{ height: BOARD_H }}
        aria-label={String(gameTitle)}
      >
        {/* lanes background */}
        <div className="absolute inset-0 grid" style={{ gridTemplateColumns: `repeat(${laneCount}, minmax(0, 1fr))` }}>
          {Array.from({ length: laneCount }).map((_, i) => (
            <div key={i} className="border-r border-slate-100 last:border-r-0" />
          ))}
        </div>

        {/* letters and pickups */}
        {letters.map(l => {
          const isLetter = l.kind === 'letter';
          const baseClasses = isLetter
            ? 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 text-purple-700'
            : l.kind === 'star'
            ? 'bg-gradient-to-br from-yellow-50 to-amber-100 border-amber-300 text-amber-700'
            : l.kind === 'heart'
            ? 'bg-gradient-to-br from-rose-50 to-red-100 border-red-300 text-red-700'
            : 'bg-gradient-to-br from-sky-50 to-blue-100 border-sky-300 text-sky-700';

          const ariaLabel = isLetter
            ? `Letter ${l.char}`
            : l.kind === 'star'
            ? t.gameScreen.wordCascade.starPickup
            : l.kind === 'heart'
            ? t.gameScreen.wordCascade.heartPickup
            : t.gameScreen.wordCascade.shieldPickup;

          return (
            <button
              key={l.id}
              onPointerDown={(e) => {
                e.preventDefault();
                handleTap(l);
              }}
              type="button"
              className={[
                'absolute w-12 h-12 rounded-2xl border-2 shadow-md text-xl font-black active:scale-95 transition-transform duration-100 flex items-center justify-center',
                baseClasses,
              ].join(' ')}
              style={{
                left: `calc(${(100 / laneCount) * l.lane}% + ${(100 / laneCount) / 2}% - 1.5rem)`,
                top: l.y,
                touchAction: 'manipulation',
              }}
              aria-label={ariaLabel}
            >
              {l.char}
            </button>
          );
        })}

        {/* Bottom barrier highlight */}
        <div
          className={[
            'absolute left-0 right-0 bottom-0 h-3 sm:h-4 pointer-events-none',
            status === 'wrong' ? 'bg-gradient-to-t from-red-200/80 to-transparent' : 'bg-gradient-to-t from-red-100/60 to-transparent',
          ].join(' ')}
          aria-hidden="true"
        />
      </div>

      {/* Instruction (reserved space to avoid layout shift) */}
      <div
        className="mt-3 min-h-[1.25rem] text-xs sm:text-sm font-semibold text-slate-600"
        role="status"
        aria-live="polite"
      >
        {status === 'idle' && (
          <>
            <span>
              {nextIdx === 0 && strikes === 0
                ? t.gameScreen.wordCascade.tutorial
                : t.gameScreen.wordCascade.tapLetters}
            </span>
            {showPickupHint && (
              <span className="ml-2 text-[0.7rem] sm:text-xs text-slate-500">
                {t.gameScreen.wordCascade.pickupHint}
              </span>
            )}
          </>
        )}
        {status === 'wrong' && <span className="text-red-600">{t.gameScreen.wordCascade.tryAgain}</span>}
      </div>

      <style>{`
        @keyframes wc-shake {
          0%, 100% { transform: translateY(0); }
          25% { transform: translateY(-3px); }
          50% { transform: translateY(2px); }
          75% { transform: translateY(-1px); }
        }
        .wc-barrier-shake {
          animation: wc-shake 0.2s ease-in-out;
        }
      `}</style>
      {paidHints.length > 0 && (
        <PaidHintButtons hints={paidHints} stars={stars} onHintClick={() => {}} />
      )}
    </div>
  );
};

