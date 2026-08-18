import React from 'react';
import {
  Activity,
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export function Navbar({
  currentView,
  onNavigateHome,
  isMuted,
  onToggleMute,
  ageGroup,
  onChangeAgeGroup,
  isSimulation,
  onToggleSimulation,
  onTriggerQuickPitchData,
}) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-[#080b11]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <div
          onClick={onNavigateHome}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <Zap className="w-6 h-6 text-white fill-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-white font-display">
                KHEL<span className="text-emerald-400">AI</span>
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
                SIH Edition
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium hidden md:block">
              National Sports Talent Assessment Platform
            </p>
          </div>
        </div>

        {/* Center / Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Age Group Selector */}
          <div className="hidden lg:flex items-center gap-1 bg-slate-900/80 border border-slate-800 rounded-lg p-1 text-xs">
            <span className="text-slate-400 px-2 py-1 font-medium">Cohort:</span>
            {['U14 Junior', 'U17 Youth', 'U21 Senior', 'Open'].map((cohort) => {
              const isActive = ageGroup === cohort;
              return (
                <button
                  key={cohort}
                  onClick={() => onChangeAgeGroup(cohort)}
                  className={`px-2.5 py-1 rounded-md transition-all font-medium ${
                    isActive
                      ? 'bg-emerald-500 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {cohort}
                </button>
              );
            })}
          </div>

          {/* Pitch Safety: Live vs Simulation Switch */}
          <button
            onClick={onToggleSimulation}
            title={isSimulation ? 'Running Kinematic Simulation' : 'Running Live Webcam AI'}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              isSimulation
                ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300'
                : 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
            }`}
          >
            <span className="relative flex h-2 w-2">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  isSimulation ? 'bg-cyan-400' : 'bg-emerald-400'
                }`}
              ></span>
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  isSimulation ? 'bg-cyan-500' : 'bg-emerald-500'
                }`}
              ></span>
            </span>
            <span className="hidden sm:inline">{isSimulation ? 'Simulation Mode' : 'Live MoveNet'}</span>
          </button>

          {/* Quick Demo Sample Data Button (Pitch Fail-safe) */}
          <button
            onClick={onTriggerQuickPitchData}
            title="Instant Jump to Sample Scorecard for Stage Pitch"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Pitch Demo</span>
          </button>

          {/* Audio Mute Toggle */}
          <button
            onClick={onToggleMute}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          {/* Reset / Home Button */}
          {currentView !== 'landing' && (
            <button
              onClick={onNavigateHome}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors text-xs font-medium"
              title="Reset to Landing"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Home</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
