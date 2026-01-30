/**
 * RhythmEchoView Component
 * 
 * Music rhythm game where players listen to a beat pattern and tap it back.
 * Uses visual-first design with audio enhancement.
 */

import React, { useEffect, useState, useRef } from 'react';
import { playSound } from '../../engine/audio';
import { RhythmAudio } from '../../engine/rhythmAudio';
import { getBeatAccuracy, validateRhythmEcho } from '../../games/validators';
import { useTranslation } from '../../i18n/useTranslation';
import type { RhythmEchoProblem, Beat, BeatPad, BeatResult } from '../../types/game';

type AnswerHandler = (answer: boolean) => void;

interface RhythmEchoViewProps {
  problem: RhythmEchoProblem;
  onAnswer: AnswerHandler;
  soundEnabled: boolean;
  level?: number;
}

export const RhythmEchoView: React.FC<RhythmEchoViewProps> = ({
  problem,
  onAnswer,
  soundEnabled,
}) => {
  const t = useTranslation();
  const [phase, setPhase] = useState<'listen' | 'play' | 'result'>('listen');
  const [playedBeatIndex, setPlayedBeatIndex] = useState(-1);
  const [playerBeats, setPlayerBeats] = useState<Beat[]>([]);
  const [results, setResults] = useState<BeatResult[]>([]);
  const [activePad, setActivePad] = useState<BeatPad | null>(null);
  
  const startTimeRef = useRef<number>(0);
  const audioRef = useRef<RhythmAudio | null>(null);

  // Initialize audio
  useEffect(() => {
    audioRef.current = new RhythmAudio();
    audioRef.current.initialize();
    return () => audioRef.current?.close();
  }, []);

  // Reset on new problem
  useEffect(() => {
    setPhase('listen');
    setPlayedBeatIndex(-1);
    setPlayerBeats([]);
    setResults([]);
    setActivePad(null);
    
    // Start playing pattern after delay
    const timer = setTimeout(() => {
      void playPattern();
    }, 800);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [problem.uid]);

  // Play the pattern
  const playPattern = async () => {
    setPhase('listen');
    const { beats } = problem.pattern;
    
    for (let i = 0; i < beats.length; i++) {
      const beat = beats[i];
      const delay = i === 0 ? 0 : beat.time - beats[i - 1].time;
      
      await new Promise(resolve => setTimeout(resolve, delay));
      
      setPlayedBeatIndex(i);
      setActivePad(beat.pad);
      if (soundEnabled) audioRef.current?.playSound(beat.pad);
      
      // Clear active pad after short duration
      setTimeout(() => setActivePad(null), 150);
    }
    
    // Transition to play phase
    await new Promise(resolve => setTimeout(resolve, 600));
    setPhase('play');
    setPlayedBeatIndex(-1);
    startTimeRef.current = performance.now();
  };

  // Handle pad tap
  const handlePadTap = (pad: BeatPad) => {
    if (phase !== 'play') return;
    
    const tapTime = performance.now() - startTimeRef.current;
    const newBeat: Beat = { time: tapTime, pad };
    
    if (soundEnabled) audioRef.current?.playSound(pad);
    
    setActivePad(pad);
    setTimeout(() => setActivePad(null), 150);
    
    const updatedBeats = [...playerBeats, newBeat];
    setPlayerBeats(updatedBeats);
    
    // Check if enough beats tapped
    if (updatedBeats.length >= problem.pattern.beats.length) {
      evaluatePerformance(updatedBeats);
    }
  };

  // Evaluate performance
  const evaluatePerformance = (beats: Beat[]) => {
    setPhase('result');
    
    // Calculate results for each target beat
    const beatResults: BeatResult[] = problem.pattern.beats.map(target => {
      const match = beats.find(b => 
        b.pad === target.pad && 
        Math.abs(b.time - target.time) <= problem.toleranceMs
      );
      
      const offsetMs = match ? match.time - target.time : 0;
      
      return {
        beat: target,
        playerTime: match?.time || null,
        accuracy: match ? getBeatAccuracy(offsetMs, problem.toleranceMs) : 'miss',
        offsetMs,
      };
    });
    
    setResults(beatResults);
    
    const isCorrect = validateRhythmEcho(problem, beats);
    
    setTimeout(() => {
      playSound(isCorrect ? 'correct' : 'wrong', soundEnabled);
      onAnswer(isCorrect);
    }, 1500);
  };

  // Pad colors
  const padColors: Record<BeatPad, string> = {
    drum: 'bg-red-500 hover:bg-red-400 border-red-700',
    bell: 'bg-yellow-500 hover:bg-yellow-400 border-yellow-700',
    clap: 'bg-green-500 hover:bg-green-400 border-green-700',
  };

  const padEmojis: Record<BeatPad, string> = {
    drum: '🥁',
    bell: '🔔',
    clap: '👏',
  };

  return (
    <div className="w-full flex flex-col items-center px-4 sm:px-6 max-w-2xl mx-auto pt-4 sm:pt-6 animate-in fade-in duration-300">
      {/* Background gradient */}
      <div 
        className="fixed inset-0 -z-10 bg-gradient-to-br from-indigo-950 via-purple-900 to-violet-900"
        style={{ pointerEvents: 'none' }}
      />

      {/* Header */}
      <div className="mb-6 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-lg">
          {phase === 'listen' ? t.gameScreen.rhythmEcho.listen :
           phase === 'play' ? t.gameScreen.rhythmEcho.yourTurn :
           t.gameScreen.rhythmEcho.resultTitle}
        </h2>
        <p className="text-sm text-purple-200 mt-1">
          {problem.pattern.beats.length} {t.gameScreen.rhythmEcho.beats} • {problem.pattern.bpm} BPM
        </p>
      </div>

      {/* Beat indicators */}
      <div className="mb-8 p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
        <div className="flex gap-3 justify-center">
          {problem.pattern.beats.map((beat, index) => {
            const isPlayed = phase === 'listen' && playedBeatIndex >= index;
            const isDone = phase === 'play' && playerBeats.length > index;
            const result = phase === 'result' ? results[index] : null;
            
            return (
              <div
                key={index}
                className={`
                  w-4 h-4 sm:w-5 sm:h-5 rounded-full transition-all duration-150
                  ${isPlayed ? 'bg-white scale-125 shadow-lg shadow-white/50' : ''}
                  ${isDone ? 'bg-green-400 scale-110' : ''}
                  ${result?.accuracy === 'perfect' ? 'bg-green-500 scale-125' : ''}
                  ${result?.accuracy === 'good' ? 'bg-lime-500 scale-110' : ''}
                  ${result?.accuracy === 'ok' ? 'bg-yellow-500' : ''}
                  ${result?.accuracy === 'miss' ? 'bg-red-500 animate-pulse' : ''}
                  ${!isPlayed && !isDone && !result ? 'bg-gray-500' : ''}
                `}
                style={{
                  boxShadow: isPlayed ? '0 0 15px rgba(255,255,255,0.8)' : undefined,
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Rhythm pads */}
      <div className="flex gap-4 sm:gap-6 justify-center">
        {problem.pads.map(pad => (
          <button
            key={pad}
            onClick={() => handlePadTap(pad)}
            disabled={phase !== 'play'}
            className={`
              w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-b-4 
              flex flex-col items-center justify-center gap-1
              transition-all duration-100 
              ${padColors[pad]}
              ${activePad === pad ? 'scale-90 brightness-125 border-b-2' : ''}
              ${phase !== 'play' ? 'opacity-60 cursor-not-allowed' : 'active:scale-90 active:border-b-2'}
            `}
            style={{
              boxShadow: activePad === pad ? `0 0 30px ${pad === 'drum' ? '#ef4444' : pad === 'bell' ? '#eab308' : '#22c55e'}` : undefined,
            }}
          >
            <span className="text-3xl sm:text-4xl">{padEmojis[pad]}</span>
            <span className="text-xs font-bold text-white/80 uppercase">
              {t.gameScreen.rhythmEcho.pads[pad]}
            </span>
          </button>
        ))}
      </div>

      {/* Result feedback */}
      {phase === 'result' && (
        <div className="mt-8 text-center animate-in fade-in zoom-in duration-300">
          {(() => {
            const perfectCount = results.filter(r => r.accuracy === 'perfect').length;
            const hitCount = results.filter(r => r.accuracy !== 'miss').length;
            const total = results.length;
            const percentage = Math.round((hitCount / total) * 100);
            
            return (
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
                <div className="text-4xl mb-2">
                  {percentage >= 90 ? '🌟' : percentage >= 70 ? '👏' : '💪'}
                </div>
                <div className="text-2xl font-bold text-white mb-1">
                  {percentage >= 90 ? t.gameScreen.rhythmEcho.result.excellent :
                   percentage >= 70 ? t.gameScreen.rhythmEcho.result.good :
                   t.gameScreen.rhythmEcho.result.tryAgain}
                </div>
                <div className="text-purple-200 text-sm">
                  {hitCount}/{total} {t.gameScreen.rhythmEcho.beats}
                  {perfectCount > 0 && ` • ${perfectCount} ${t.gameScreen.rhythmEcho.accuracy.perfect}`}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Instructions */}
      {phase === 'play' && (
        <p className="mt-6 text-sm text-purple-200 animate-pulse">
          {t.gameScreen.rhythmEcho.tapToPlay}
        </p>
      )}
    </div>
  );
};
