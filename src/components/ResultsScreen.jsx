import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { PathwayLadder } from './PathwayLadder';
import { ScoutCardModal } from './ScoutCardModal';
import { generateAICoachingReport } from '../utils/aiCoach';
import {
  Trophy,
  Award,
  Zap,
  Activity,
  ArrowRight,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Share2,
  Dumbbell,
  Shield,
  TrendingUp,
  FileText,
  Bot,
} from 'lucide-react';

export function ResultsScreen({
  resultData,
  onRetake,
  onExploreOtherSports,
  ageGroup = 'U17 Youth',
}) {
  const [showCardModal, setShowCardModal] = useState(false);
  const [coachingReport, setCoachingReport] = useState(null);
  const [isLoadingCoach, setIsLoadingCoach] = useState(true);

  const {
    sportId = 'badminton',
    sportName = 'Badminton',
    score = 84,
    percentile = 88,
    tier = {},
    metrics = {
      lateralSpeed: 86,
      frequencyReps: 82,
      movementConsistency: 90,
      explosivenessIndex: 85,
    },
    reactionTimeMs = 230,
    totalDisplacementPx = 1850,
    reps = 9,
    isDemo = false,
  } = resultData || {};

  // Confetti effect on load
  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#06b6d4', '#f59e0b', '#ffffff'],
      });
    } catch (e) {}
  }, []);

  // Generate AI coaching report
  useEffect(() => {
    async function loadReport() {
      setIsLoadingCoach(true);
      const report = await generateAICoachingReport({
        sportId,
        score,
        percentile,
        metrics,
        reactionTimeMs,
      });
      setCoachingReport(report);
      setIsLoadingCoach(false);
    }
    loadReport();
  }, [sportId, score, percentile, metrics, reactionTimeMs]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Top Banner / Assessment Complete */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
          <Award className="w-3.5 h-3.5" />
          <span>Official Scouting Assessment Report</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
          Talent Scorecard & Biomechanical Profile
        </h1>
        <p className="text-sm text-slate-300">
          Discipline: <span className="font-bold text-white">{sportName}</span> • Cohort:{' '}
          <span className="font-bold text-white">{ageGroup}</span>
          {isDemo && (
            <span className="ml-2 text-xs font-mono text-cyan-400 bg-cyan-500/15 px-2 py-0.5 rounded border border-cyan-500/30">
              Demo Verified
            </span>
          )}
        </p>
      </div>

      {/* Main Score & Percentile Hero Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Score & Tier */}
        <div className="md:col-span-2 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#132228] via-[#0e191d] to-[#0a1215] border-2 border-emerald-500/40 relative overflow-hidden flex flex-col justify-between shadow-2xl">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Overall Athletic Score
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-6xl sm:text-7xl font-black text-white font-mono tracking-tight">
                  {score}
                </span>
                <span className="text-xl text-slate-400 font-bold">/ 100</span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                National Tier
              </span>
              <div className="text-lg sm:text-xl font-bold text-emerald-400 mt-1">
                {tier.title || 'National Contender'}
              </div>
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mt-1">
                {tier.badge || 'SAI Talent Pool'}
              </span>
            </div>
          </div>

          <p className="text-sm text-slate-300 my-4 leading-relaxed">
            {tier.description ||
              'High kinetic efficiency with rapid deceleration and directional reversal matching State Championship standards.'}
          </p>

          <div className="pt-4 border-t border-emerald-500/20 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>
                Benchmark: <strong className="text-white">Top {100 - percentile}%</strong> of
                12,500+ national athlete evaluations
              </span>
            </div>
            <button
              onClick={() => setShowCardModal(true)}
              className="font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
            >
              <span>View Scout Pass</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Card 2: Percentile & Quick Badges */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
              National Percentile
            </span>
            <div className="text-5xl font-black text-cyan-400 font-mono mt-2 mb-1">
              {percentile}
              <span className="text-2xl font-normal text-slate-400">th</span>
            </div>
            <p className="text-xs text-slate-400">
              You scored better than <strong className="text-white">{percentile}%</strong> of
              athletes in your age bracket.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-800 space-y-2 mt-4">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Reflex Velocity:</span>
              <span className="font-mono font-bold text-white">{reactionTimeMs} ms</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Lateral Shuffles:</span>
              <span className="font-mono font-bold text-white">{reps} direction turns</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Net Lateral Travel:</span>
              <span className="font-mono font-bold text-white">{totalDisplacementPx} px</span>
            </div>
          </div>
        </div>
      </div>

      {/* Biomechanical Radar / Pillar Breakdown */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800">
        <h3 className="text-base font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-400" />
          <span>Biomechanical Pillar Breakdown</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Pillar 1 */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80">
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="text-slate-400 font-medium">Lateral Velocity</span>
              <span className="font-mono font-bold text-emerald-400">
                {metrics.lateralSpeed || score}%
              </span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-2">
              <div
                className="bg-emerald-500 h-full rounded-full"
                style={{ width: `${metrics.lateralSpeed || score}%` }}
              ></div>
            </div>
            <p className="text-[11px] text-slate-400 leading-tight">
              Rate of horizontal ground travel across the court.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80">
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="text-slate-400 font-medium">Cadence / Turns</span>
              <span className="font-mono font-bold text-cyan-400">
                {metrics.frequencyReps || 80}%
              </span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-2">
              <div
                className="bg-cyan-500 h-full rounded-full"
                style={{ width: `${metrics.frequencyReps || 80}%` }}
              ></div>
            </div>
            <p className="text-[11px] text-slate-400 leading-tight">
              Rapid deceleration and momentum reversal frequency.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80">
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="text-slate-400 font-medium">Kinetic Consistency</span>
              <span className="font-mono font-bold text-amber-400">
                {metrics.movementConsistency || 85}%
              </span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-2">
              <div
                className="bg-amber-400 h-full rounded-full"
                style={{ width: `${metrics.movementConsistency || 85}%` }}
              ></div>
            </div>
            <p className="text-[11px] text-slate-400 leading-tight">
              Symmetry between left-ward and right-ward plant steps.
            </p>
          </div>

          {/* Pillar 4 */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80">
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="text-slate-400 font-medium">Explosiveness</span>
              <span className="font-mono font-bold text-purple-400">
                {metrics.explosivenessIndex || score}%
              </span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-2">
              <div
                className="bg-purple-500 h-full rounded-full"
                style={{ width: `${metrics.explosivenessIndex || score}%` }}
              ></div>
            </div>
            <p className="text-[11px] text-slate-400 leading-tight">
              Sub-second burst power from neutral ready stance.
            </p>
          </div>
        </div>
      </div>

      {/* National Pathway Ladder Section */}
      <PathwayLadder score={score} />

      {/* AI Coaching & Biomechanical Insights Section */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#141b2c] to-[#0c121e] border border-slate-800 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-600 flex items-center justify-center text-white shadow-md">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                AI Coach & Scouting Insights
              </span>
              <h3 className="text-xl font-bold text-white font-display">
                Personalized Development Program
              </h3>
            </div>
          </div>
          <span className="text-xs font-mono text-slate-400 hidden sm:inline">
            Model: KhelAI Biometrics Engine
          </span>
        </div>

        {/* AI Insight Box */}
        {isLoadingCoach ? (
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-400 animate-pulse">
            Analyzing kinematic displacement curves...
          </div>
        ) : (
          coachingReport && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2">
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Biomechanical Strength & Observation:
                </div>
                <p className="text-sm text-slate-200 leading-relaxed">
                  {coachingReport.biomechanicalInsight}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
                <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  Target Priority for Next Tier:
                </div>
                <p className="text-sm text-emerald-200 leading-relaxed">
                  {coachingReport.priorityFocus}
                </p>
              </div>

              {/* Actionable Drills */}
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">
                  Recommended Training Regimen Drills:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {coachingReport.drills.map((drill, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="text-sm font-bold text-white">{drill.title}</h4>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700 shrink-0">
                          {drill.duration}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed mb-2">
                        {drill.description}
                      </p>
                      <span className="text-[10px] font-semibold text-cyan-400">
                        Focus: {drill.focus}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        )}
      </div>

      {/* Bottom Action CTAs */}
      <div className="flex flex-wrap gap-4 pt-4 border-t border-slate-800">
        <button
          onClick={() => setShowCardModal(true)}
          className="flex-1 min-w-[200px] py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-extrabold text-sm shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
        >
          <FileText className="w-4 h-4" />
          <span>Export Official Scout Card</span>
        </button>

        <button
          onClick={onRetake}
          className="px-6 py-4 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-850 hover:border-slate-700 text-slate-200 font-bold text-sm flex items-center justify-center gap-2 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Retake Assessment</span>
        </button>

        <button
          onClick={onExploreOtherSports}
          className="px-6 py-4 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-850 hover:border-slate-700 text-slate-200 font-bold text-sm flex items-center justify-center gap-2 transition-colors"
        >
          <span>Explore Other Sports</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Scout Pass Modal */}
      {showCardModal && (
        <ScoutCardModal
          resultData={resultData}
          ageGroup={ageGroup}
          onClose={() => setShowCardModal(false)}
        />
      )}
    </div>
  );
}
