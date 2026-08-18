import React, { useState, useEffect, useRef, useCallback } from 'react';
import { usePoseDetection } from '../hooks/usePoseDetection';
import { calculateAgilityScore, getSamplePitchData } from '../utils/scoring';
import {
  Camera,
  Activity,
  ArrowLeft,
  Timer,
  Play,
  RotateCcw,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Zap,
  Flame,
  ShieldAlert,
} from 'lucide-react';

export function LiveAssessment({
  sportId = 'badminton',
  onComplete,
  onBack,
  isSimulation,
  onToggleSimulation,
  audio,
}) {
  // Test lifecycle states: 'calibrating' | 'countdown' | 'active' | 'finished'
  const [testPhase, setTestPhase] = useState('calibrating');
  const [countdownNum, setCountdownNum] = useState(3);
  const [timeRemaining, setTimeRemaining] = useState(10);
  const [liveScoreEstimate, setLiveScoreEstimate] = useState(0);

  const countdownIntervalRef = useRef(null);
  const testTimerRef = useRef(null);

  // Pose detection hook
  const {
    videoRef,
    canvasRef,
    isLoadingModel,
    cameraActive,
    poseDetected,
    errorMessage,
    currentVelocity,
    peakVelocity,
    totalDisplacement,
    leftDisplacement,
    rightDisplacement,
    repsCount,
    startCamera,
    stopCamera,
    resetMetrics,
    getTelemetrySummary,
  } = usePoseDetection({
    isTestingActive: testPhase === 'active',
    isSimulation,
    onFrameMetric: (metric) => {
      // Real-time live score estimate
      const est = Math.min(98, Math.round((metric.totalDisplacement / 2200) * 90 + repsCount * 0.8));
      setLiveScoreEstimate(Math.max(20, est));
    },
  });

  // Start camera on mount if not simulation
  useEffect(() => {
    if (!isSimulation) {
      startCamera();
    }
    return () => {
      stopCamera();
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
      if (testTimerRef.current) clearInterval(testTimerRef.current);
    };
  }, [isSimulation, startCamera, stopCamera]);

  // Handle countdown logic
  const handleStartCountdown = useCallback(() => {
    resetMetrics();
    setTestPhase('countdown');
    setCountdownNum(3);

    if (audio?.playCountdownBeep) {
      audio.playCountdownBeep(false);
    }

    let count = 3;
    countdownIntervalRef.current = setInterval(() => {
      count -= 1;
      if (count > 0) {
        setCountdownNum(count);
        if (audio?.playCountdownBeep) {
          audio.playCountdownBeep(false);
        }
      } else if (count === 0) {
        setCountdownNum('GO!');
        if (audio?.playCountdownBeep) {
          audio.playCountdownBeep(true); // Whistle sound
        }
      } else {
        clearInterval(countdownIntervalRef.current);
        startActiveTest();
      }
    }, 1000);
  }, [resetMetrics, audio]);

  // Start 10-second active test
  const startActiveTest = useCallback(() => {
    setTestPhase('active');
    setTimeRemaining(10);

    let secLeft = 10;
    testTimerRef.current = setInterval(() => {
      secLeft -= 1;
      setTimeRemaining(secLeft);

      if (secLeft <= 0) {
        clearInterval(testTimerRef.current);
        finishTest();
      }
    }, 1000);
  }, []);

  // Finish test and calculate final scores
  const finishTest = useCallback(() => {
    setTestPhase('finished');
    if (audio?.playVictoryFanfare) {
      audio.playVictoryFanfare();
    }

    setTimeout(() => {
      const telemetry = getTelemetrySummary ? getTelemetrySummary() : {
        totalDisplacement,
        reps: repsCount,
        leftDisplacement,
        rightDisplacement,
        peakVelocity,
      };

      console.log('[KhelAI Telemetry Complete]', telemetry);

      const finalResult = calculateAgilityScore(totalDisplacement, 10, repsCount, telemetry);

      console.log('[KhelAI Dynamic Pillars]', finalResult.metrics, 'Score:', finalResult.score);

      onComplete({
        sportId: 'badminton',
        sportName: 'Badminton',
        score: finalResult.score,
        percentile: finalResult.percentile,
        tier: finalResult.tier,
        metrics: finalResult.metrics,
        totalDisplacementPx: finalResult.totalDisplacementPx,
        reps: repsCount,
        leftDisplacementPx: finalResult.leftDisplacementPx,
        rightDisplacementPx: finalResult.rightDisplacementPx,
        peakVelocityPx: finalResult.peakVelocityPx,
        symmetryRatio: finalResult.symmetryRatio,
        testDuration: 10,
        reactionTimeMs: 228,
        isDemo: isSimulation,
        timestamp: new Date().toISOString(),
      });
    }, 800);
  }, [totalDisplacement, repsCount, leftDisplacement, rightDisplacement, peakVelocity, getTelemetrySummary, audio, onComplete, isSimulation]);

  // Instant Skip with Sample Data (Pitch Fail-safe button)
  const handleInstantSkip = () => {
    const sample = getSamplePitchData('badminton', 'high');
    if (audio?.playVictoryFanfare) audio.playVictoryFanfare();
    onComplete(sample);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
      {/* Top Header / Status bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            title="Return to sport selection"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Hero Live CV Assessment
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Badminton Agility
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white font-display">
              10-Second Lateral Footwork Test
            </h2>
          </div>
        </div>

        {/* Action / Safety controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleSimulation}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              isSimulation
                ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {isSimulation ? 'Mode: Synthetic Athlete' : 'Mode: Live Webcam'}
          </button>

          {/* Quick Pitch Savior */}
          <button
            onClick={handleInstantSkip}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 transition-all"
            title="Instantly generate high-scoring benchmark data for pitch demo"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Skip with Sample Data</span>
          </button>
        </div>
      </div>

      {/* Main Vision Stage & Telemetry Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left 2 Cols: Camera & Canvas Stage */}
        <div className="lg:col-span-2 relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl aspect-[4/3] flex items-center justify-center">
          {/* Hidden/Active Video Element */}
          <video
            ref={videoRef}
            playsInline
            muted
            className={`absolute inset-0 w-full h-full object-cover transform -scale-x-100 ${
              isSimulation ? 'hidden' : 'block'
            }`}
          />

          {/* Canvas for Neon MoveNet Skeleton Rendering */}
          <canvas
            ref={canvasRef}
            width={640}
            height={480}
            className="absolute inset-0 w-full h-full object-cover z-10 pointer-events-none"
          />

          {/* Error / Permission fallback banner */}
          {errorMessage && !isSimulation && (
            <div className="absolute top-4 left-4 right-4 z-20 p-3 rounded-xl bg-rose-950/90 border border-rose-500/50 text-rose-200 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{errorMessage}</span>
              </div>
              <button
                onClick={onToggleSimulation}
                className="px-2.5 py-1 rounded bg-rose-500 text-white font-bold hover:bg-rose-600 transition-colors shrink-0"
              >
                Switch to Simulation
              </button>
            </div>
          )}

          {/* HUD Overlay Details */}
          <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-xs font-mono">
              <span className="relative flex h-2 w-2">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    poseDetected ? 'bg-emerald-400' : 'bg-amber-400'
                  }`}
                ></span>
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${
                    poseDetected ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}
                ></span>
              </span>
              <span className="text-slate-200">
                {isLoadingModel
                  ? 'Loading MoveNet...'
                  : poseDetected
                  ? 'Skeleton Tracked'
                  : 'Searching Pose...'}
              </span>
            </div>

            {testPhase === 'active' && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 backdrop-blur-md border border-emerald-500/40 text-emerald-300 text-xs font-bold font-mono animate-pulse">
                <Flame className="w-3.5 h-3.5 text-emerald-400" />
                <span>ACTIVE TRACKING</span>
              </div>
            )}
          </div>

          {/* Calibration / Framing Guide Lines */}
          <div className="absolute inset-x-12 inset-y-8 border-2 border-dashed border-emerald-500/20 rounded-2xl pointer-events-none z-10 flex flex-col justify-between p-4">
            <div className="text-[10px] text-emerald-400/60 font-mono tracking-wider text-center">
              [ ATHLETE POSITIONING FRAME ]
            </div>
            <div className="flex justify-between text-[9px] text-emerald-400/40 font-mono">
              <span>◄ LEFT BOUND</span>
              <span>CENTER SHUFFLE ZONE</span>
              <span>RIGHT BOUND ►</span>
            </div>
          </div>

          {/* Countdown Center Overlay */}
          {testPhase === 'countdown' && (
            <div className="absolute inset-0 z-30 bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center animate-fade-in">
              <div className="text-7xl sm:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-br from-emerald-300 to-emerald-500 font-mono animate-bounce">
                {countdownNum}
              </div>
              <p className="text-sm font-semibold text-emerald-300 mt-4 tracking-wide uppercase">
                Get ready to shuffle side to side!
              </p>
            </div>
          )}

          {/* Active 10s Timer Banner on Top of Stage */}
          {testPhase === 'active' && (
            <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
              <div className="px-4 py-2 rounded-xl bg-black/80 backdrop-blur-md border border-emerald-500/50 flex items-center gap-2">
                <Timer className="w-5 h-5 text-emerald-400 animate-spin" />
                <span className="text-2xl font-black text-emerald-400 font-mono leading-none">
                  {timeRemaining}s
                </span>
              </div>
            </div>
          )}

          {/* Finished Overlay */}
          {testPhase === 'finished' && (
            <div className="absolute inset-0 z-30 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center text-center p-6">
              <CheckCircle2 className="w-16 h-16 text-emerald-400 mb-3 animate-bounce" />
              <h3 className="text-2xl font-bold text-white mb-1">Assessment Complete!</h3>
              <p className="text-sm text-slate-300">Processing biomechanical agility kinematics...</p>
            </div>
          )}
        </div>

        {/* Right Col: Instructions & Real-Time Telemetry Cards */}
        <div className="space-y-4">
          {/* Test Instructions Card */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span>Protocol & Instructions</span>
            </h3>
            <ol className="text-xs text-slate-300 space-y-2 list-decimal list-inside leading-relaxed">
              <li>
                <span className="font-semibold text-white">Stand 6–8 feet back</span> so your full body and ankles are in frame.
              </li>
              <li>
                On <span className="font-semibold text-emerald-400">"GO"</span>, shuffle side to side as rapidly as possible for 10 seconds.
              </li>
              <li>
                Keep your knees bent and stay low to maximize lateral burst speed.
              </li>
            </ol>

            {/* Calibration check */}
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-400">Tracking Status:</span>
              <span
                className={`font-semibold flex items-center gap-1 ${
                  poseDetected ? 'text-emerald-400' : 'text-amber-400'
                }`}
              >
                {poseDetected ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" /> Full Body Calibrated
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-3.5 h-3.5" /> Step Back Into Frame
                  </>
                )}
              </span>
            </div>
          </div>

          {/* Live Telemetry Metrics */}
          <div className="grid grid-cols-2 gap-3">
            {/* Metric 1: Total Distance */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Lateral Travel
              </div>
              <div className="text-2xl font-black text-white font-mono mt-1">
                {Math.round(totalDisplacement)}
                <span className="text-xs font-normal text-slate-400 ml-1">px</span>
              </div>
              <div className="text-[10px] text-emerald-400 mt-1">Ankle $\Delta x$ sum</div>
            </div>

            {/* Metric 2: Shuffles / Direction Changes */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Shuffle Reversals
              </div>
              <div className="text-2xl font-black text-cyan-400 font-mono mt-1">
                {repsCount}
                <span className="text-xs font-normal text-slate-400 ml-1">turns</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-1">Deceleration count</div>
            </div>

            {/* Metric 3: Live Velocity */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Current Speed
              </div>
              <div className="text-2xl font-black text-amber-400 font-mono mt-1">
                {currentVelocity}
                <span className="text-xs font-normal text-slate-400 ml-1">px/s</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-1">Burst velocity</div>
            </div>

            {/* Metric 4: Real-Time Score Estimate */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Live Rating
              </div>
              <div className="text-2xl font-black text-emerald-400 font-mono mt-1">
                {testPhase === 'active' ? liveScoreEstimate : '--'}
                <span className="text-xs font-normal text-slate-400 ml-1">/100</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-1">Norm benchmark</div>
            </div>
          </div>

          {/* Primary Action Button */}
          {testPhase === 'calibrating' && (
            <button
              onClick={handleStartCountdown}
              disabled={isLoadingModel}
              className="w-full py-4 rounded-xl font-bold text-base bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              <Play className="w-5 h-5 fill-slate-950" />
              <span>Start 10s Agility Assessment</span>
            </button>
          )}

          {testPhase === 'active' && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center">
              <div className="text-sm font-bold text-emerald-300 animate-pulse">
                Keep Shuffling! Push for max cadence!
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
                <div
                  className="bg-emerald-500 h-full transition-all duration-1000"
                  style={{ width: `${(10 - timeRemaining) * 10}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
