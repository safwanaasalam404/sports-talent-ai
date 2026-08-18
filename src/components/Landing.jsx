import React from 'react';
import {
  Zap,
  Target,
  Activity,
  ArrowRight,
  ShieldCheck,
  Award,
  Video,
  Timer,
  ChevronRight,
  Flame,
  Globe2,
  Users,
} from 'lucide-react';

export function Landing({ onSelectFlow }) {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto hud-grid">
      {/* Top Banner / SIH Theme */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-6 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold tracking-wide">
          <Flame className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
          <span>Smart India Hackathon 2024 — Sports & Fitness Technology</span>
        </div>
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 text-xs font-medium">
          <Globe2 className="w-3.5 h-3.5 text-blue-400" />
          <span>Aligned with Khelo India & SAI Grassroots Protocols</span>
        </div>
      </div>

      {/* Main Hero Section */}
      <div className="text-center max-w-3xl mx-auto space-y-4 mb-8">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1] font-display">
          Discover Your Sport. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
            Discover Your Potential.
          </span>
        </h1>
        <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto">
          India’s first in-browser AI athletic scouting platform. Measure real-time lateral footwork agility, reflex reaction times, and map your talent directly to the National Sports Pathway with zero specialized equipment.
        </p>
      </div>

      {/* Hero Dual Action Targets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto w-full my-4">
        {/* Flow 1: I Know My Sport */}
        <div
          onClick={() => onSelectFlow('know_sport')}
          className="group relative rounded-2xl bg-gradient-to-b from-[#141b2b] to-[#0d121c] p-7 border border-slate-800 hover:border-emerald-500/60 transition-all duration-300 cursor-pointer hover:shadow-2xl hover:shadow-emerald-500/10 flex flex-col justify-between"
        >
          {/* Subtle Glow Indicator */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all"></div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Video className="w-7 h-7 text-emerald-400" />
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                Hero CV Test
              </span>
            </div>

            <h3 className="text-2xl font-bold text-white group-hover:text-emerald-300 transition-colors mb-2 font-display">
              I Know My Sport
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              Jump straight into sport-specific testing. Launch the live camera MoveNet AI to measure lateral footwork agility, deceleration control, and court speed for Badminton, or assess multi-sport skills.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>10s MoveNet Vision Test</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm font-bold text-emerald-400 group-hover:translate-x-1 transition-transform">
              <span>Start Assessment</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Flow 2: I Don't Know My Sport */}
        <div
          onClick={() => onSelectFlow('dont_know_sport')}
          className="group relative rounded-2xl bg-gradient-to-b from-[#141b2b] to-[#0d121c] p-7 border border-slate-800 hover:border-cyan-500/60 transition-all duration-300 cursor-pointer hover:shadow-2xl hover:shadow-cyan-500/10 flex flex-col justify-between"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl group-hover:bg-cyan-500/20 transition-all"></div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Target className="w-7 h-7 text-cyan-400" />
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                Talent Discovery Flow
              </span>
            </div>

            <h3 className="text-2xl font-bold text-white group-hover:text-cyan-300 transition-colors mb-2 font-display">
              I Don't Know My Sport
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              Take our 2-minute aptitude battery. Test your sub-millisecond reflex speed with an interactive stimulus tap challenge and answer 4 biomechanical questions to unlock your ideal Olympic discipline.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
              <Timer className="w-3.5 h-3.5 text-cyan-400" />
              <span>Reflex Tap + Aptitude Match</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm font-bold text-cyan-400 group-hover:translate-x-1 transition-transform">
              <span>Discover Match</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Feature & Impact Stats Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto w-full pt-4">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 text-center">
          <div className="text-2xl font-extrabold text-white font-mono">100%</div>
          <div className="text-xs text-slate-400 mt-0.5">In-Browser & Private</div>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 text-center">
          <div className="text-2xl font-extrabold text-emerald-400 font-mono">30 FPS</div>
          <div className="text-xs text-slate-400 mt-0.5">MoveNet Pose Tracking</div>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 text-center">
          <div className="text-2xl font-extrabold text-cyan-400 font-mono">7 Tiers</div>
          <div className="text-xs text-slate-400 mt-0.5">SAI National Pathway</div>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 text-center">
          <div className="text-2xl font-extrabold text-amber-400 font-mono">5 Sports</div>
          <div className="text-xs text-slate-400 mt-0.5">Grassroots Disciplines</div>
        </div>
      </div>
    </div>
  );
}
