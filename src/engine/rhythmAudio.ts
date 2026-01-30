/**
 * Rhythm Audio Engine
 * 
 * Web Audio API based sound synthesis for rhythm game
 * Zero-latency oscillator-based sounds - no audio files needed
 */

import type { BeatPad } from '../types/game';

// Sound definitions - oscillator-based, no audio files needed
export const RHYTHM_SOUNDS = {
  drum: { frequency: 150, type: 'triangle' as OscillatorType, decay: 0.15 },
  bell: { frequency: 800, type: 'sine' as OscillatorType, decay: 0.4 },
  clap: { frequency: 400, type: 'square' as OscillatorType, decay: 0.08 },
};

export class RhythmAudio {
  private audioContext: AudioContext | null = null;

  initialize(): void {
    if (!this.audioContext) {
      const AudioCtor = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (AudioCtor) {
        this.audioContext = new AudioCtor();
      }
    }
  }

  playSound(pad: BeatPad): void {
    if (!this.audioContext) return;
    
    const sound = RHYTHM_SOUNDS[pad];
    const ctx = this.audioContext;
    
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.type = sound.type;
    oscillator.frequency.value = sound.frequency;
    
    gainNode.gain.setValueAtTime(0.5, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + sound.decay);
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.start();
    oscillator.stop(ctx.currentTime + sound.decay);
  }

  close(): void {
    void this.audioContext?.close();
    this.audioContext = null;
  }
}

export const rhythmAudio = new RhythmAudio();
