import { useCallback, useRef, useState } from 'react';

/**
 * Synthesizes athletic whistle, countdown beeps, and celebration chimes
 * using zero-dependency in-browser Web Audio API.
 */
export function useAudioSynth() {
  const audioCtxRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);

  const getAudioContext = useCallback(() => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  const playTone = useCallback((freq, duration = 0.15, type = 'sine', gainVal = 0.15) => {
    if (isMuted) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gainNode.gain.setValueAtTime(gainVal, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      console.warn('Audio synthesis failed:', e);
    }
  }, [isMuted, getAudioContext]);

  // Countdown Beep (3, 2, 1) or Whistle (Go!)
  const playCountdownBeep = useCallback((isGo = false) => {
    if (isMuted) return;
    if (isGo) {
      // Whistle tone (high dual frequency burst)
      playTone(880, 0.4, 'triangle', 0.25);
      setTimeout(() => playTone(1174, 0.45, 'sine', 0.2), 60);
    } else {
      // 3, 2, 1 countdown beep
      playTone(440, 0.18, 'sine', 0.2);
    }
  }, [isMuted, playTone]);

  // Tap click for reflex test
  const playTap = useCallback(() => {
    if (isMuted) return;
    playTone(659, 0.08, 'triangle', 0.18);
  }, [isMuted, playTone]);

  // Victory / Completion fanfare chime
  const playVictoryFanfare = useCallback(() => {
    if (isMuted) return;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, index) => {
      setTimeout(() => {
        playTone(freq, 0.35, 'triangle', 0.2);
      }, index * 120);
    });
  }, [isMuted, playTone]);

  return {
    isMuted,
    setIsMuted,
    playCountdownBeep,
    playTap,
    playVictoryFanfare,
    playTone,
  };
}
