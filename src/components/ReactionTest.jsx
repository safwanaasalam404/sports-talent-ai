import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Timer,
  Zap,
  RotateCcw,
  CheckCircle2,
  ArrowRight,
  AlertTriangle,
  Flame,
  Award,
} from 'lucide-react';

export function ReactionTest({ onComplete, audio }) {
  // Test states: 'intro' | 'waiting' | 'ready' | 'result' | 'completed' | 'early'
  const [gameState, setGameState] = useState('intro');
  const [currentTrial, setCurrentTrial] = useState(1);
  const [trialsData, setTrialsData] = useState([]);
  const [lastReactionMs, setLastReactionMs] = useState(null);

  const startTimeRef = useRef(null);
  const timeoutIdRef = useRef(null);

  const TOTAL_TRIALS = 3;

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
    };
  }, []);

  // Start waiting state for next stimulus
  const startTrial = useCallback(() => {
    setGameState('waiting');
    setLastReactionMs(null);

    // Random stimulus delay between 1400ms and 3600ms
    const randomDelay = Math.floor(Math.random() * 2200) + 1400;

    timeoutIdRef.current = setTimeout(() => {
      startTimeRef.current = performance.now();
      setGameState('ready');
      if (audio?.playTone) {
        audio.playTone(800, 0.08, 'sine', 0.15);
      }
    }, randomDelay);
  }, [audio]);

  // User taps the reaction arena
  const handleArenaClick = useCallback(() => {
    if (gameState === 'intro') {
      startTrial();
    } else if (gameState === 'waiting') {
      // False start! Clicked too early
      if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
      setGameState('early');
    } else if (gameState === 'ready') {
      // Valid reaction! Measure delta
      const reactionTime = Math.round(performance.now() - startTimeRef.current);
      setLastReactionMs(reactionTime);
      if (audio?.playTap) audio.playTap();

      const newTrials = [...trialsData, reactionTime];
      setTrialsData(newTrials);

      if (currentTrial >= TOTAL_TRIALS) {
        setGameState('completed');
        if (audio?.playVictoryFanfare) audio.playVictoryFanfare();
      } else {
        setGameState('result');
      }
    } else if (gameState === 'early' || gameState === 'result') {
      if (gameState === 'result') {
        setCurrentTrial((prev) => prev + 1);
      }
      startTrial();
    }
  }, [gameState, startTrial, trialsData, currentTrial, audio]);

  // Compute average score
  const avgReactionTime =
    trialsData.length > 0
      ? Math.round(trialsData.reduce((a, b) => a + b, 0) / trialsData.length)
      : 250;

  // Rating badge
  const getRating = (ms) => {
    if (ms < 220) return { label: 'Olympic / Lightning Reflexes', color: 'text-emerald-400', badge: 'Top 2%' };
    if (ms < 260) return { label: 'Elite Athletic Reaction', color: 'text-cyan-400', badge: 'Top 10%' };
    if (ms < 310) return { label: 'Solid Competitive Reflexes', color: 'text-amber-400', badge: 'Top 30%' };
    return { label: 'Developing Baseline Speed', color: 'text-slate-300', badge: 'Baseline' };
  };

  const currentRating = getRating(avgReactionTime);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Top Banner */}
      <div className="text-center mb-6">
        <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
          Aptitude Battery — Step 1 of 2
        </span>
        <h2 className="text-3xl font-extrabold text-white font-display mt-1">
          Neuromuscular Reflex Test
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Measures sensory processing velocity and fast-twitch nervous reaction in milliseconds.
        </p>
      </div>

      {/* Trial Progress Bar */}
      <div className="flex items-center justify-between gap-2 mb-4 px-2">
        <span className="text-xs font-medium text-slate-400">
          Trial {Math.min(currentTrial, TOTAL_TRIALS)} of {TOTAL_TRIALS}
        </span>
        <div className="flex gap-1.5">
          {[1, 2, 3].map((step) => {
            const isDone = trialsData.length >= step;
            const isCurrent = currentTrial === step && gameState !== 'completed';
            return (
              <div
                key={step}
                className={`h-2 w-8 rounded-full transition-all ${
                  isDone
                    ? 'bg-cyan-400'
                    : isCurrent
                    ? 'bg-cyan-500/40 border border-cyan-400'
                    : 'bg-slate-800'
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* Interactive Reflex Arena Target */}
      <div
        onClick={handleArenaClick}
        className={`w-full aspect-[16/10] rounded-3xl flex flex-col items-center justify-center text-center p-6 cursor-pointer select-none transition-all duration-200 border shadow-2xl relative overflow-hidden ${
          gameState === 'intro'
            ? 'bg-slate-900/90 border-slate-700 hover:border-cyan-500/60'
            : gameState === 'waiting'
            ? 'bg-rose-950/40 border-rose-500/40'
            : gameState === 'ready'
            ? 'bg-emerald-500 border-emerald-400 scale-[1.02] shadow-emerald-500/50'
            : gameState === 'early'
            ? 'bg-amber-950/50 border-amber-500/50'
            : gameState === 'result'
            ? 'bg-slate-900 border-cyan-500/40'
            : 'bg-gradient-to-b from-slate-900 to-slate-950 border-cyan-500/50'
        }`}
      >
        {gameState === 'intro' && (
          <div className="space-y-3">
            <div className="w-16 h-16 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center mx-auto text-cyan-400">
              <Zap className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-white">Tap Anywhere to Start</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              When the screen turns <span className="text-emerald-400 font-bold">EMERALD GREEN</span>, tap as fast as humanly possible.
            </p>
          </div>
        )}

        {gameState === 'waiting' && (
          <div className="space-y-2 animate-pulse">
            <div className="w-16 h-16 rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center mx-auto text-rose-400">
              <Timer className="w-8 h-8 animate-spin" />
            </div>
            <h3 className="text-2xl font-bold text-rose-300">Wait for Green...</h3>
            <p className="text-xs text-rose-400/80">Stay poised. Do not click early!</p>
          </div>
        )}

        {gameState === 'ready' && (
          <div className="space-y-2">
            <h3 className="text-5xl sm:text-6xl font-black text-slate-950 font-mono tracking-tight animate-bounce">
              TAP NOW!
            </h3>
            <p className="text-sm font-bold text-slate-900">HIT THE SCREEN!</p>
          </div>
        )}

        {gameState === 'early' && (
          <div className="space-y-3">
            <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto" />
            <h3 className="text-2xl font-bold text-amber-300">Too Early! False Start</h3>
            <p className="text-xs text-slate-300">Tap to retry trial {currentTrial}</p>
          </div>
        )}

        {gameState === 'result' && (
          <div className="space-y-2">
            <div className="text-4xl sm:text-5xl font-black text-cyan-400 font-mono">
              {lastReactionMs}
              <span className="text-xl font-normal text-slate-400 ml-1">ms</span>
            </div>
            <p className="text-sm font-bold text-white">Trial {currentTrial} Recorded!</p>
            <p className="text-xs text-cyan-300">Tap anywhere for next trial →</p>
          </div>
        )}

        {gameState === 'completed' && (
          <div className="space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Average Reaction Velocity
              </span>
              <div className="text-5xl font-black text-emerald-400 font-mono mt-1">
                {avgReactionTime}
                <span className="text-xl font-normal text-slate-400 ml-1">ms</span>
              </div>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-bold text-white">
              <span className={currentRating.color}>{currentRating.label}</span>
              <span className="text-slate-500">•</span>
              <span className="text-emerald-400">{currentRating.badge}</span>
            </div>
          </div>
        )}
      </div>

      {/* Action CTA when completed */}
      {gameState === 'completed' && (
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => {
              setGameState('intro');
              setCurrentTrial(1);
              setTrialsData([]);
            }}
            className="px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white flex items-center justify-center gap-2 text-sm font-medium transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retake Reflex Test</span>
          </button>
          <button
            onClick={() => onComplete(avgReactionTime)}
            className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
          >
            <span>Proceed to Trait Assessment</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
