import React, { useState } from 'react';
import {
  APTITUDE_QUESTIONS,
  calculateSportRecommendations,
} from '../utils/sportRecommendation';
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Trophy,
  Activity,
  Zap,
  Shield,
  Target,
  Crosshair,
  Flame,
} from 'lucide-react';

const SPORT_ICON_MAP = {
  badminton: Activity,
  football: Shield,
  cricket: Target,
  boxing: Zap,
  archery: Crosshair,
};

export function QuizFlow({
  reactionTimeMs = 250,
  onLaunchLiveTest,
  onViewResults,
  onBack,
  audio,
}) {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [recommendationResult, setRecommendationResult] = useState(null);

  const currentQ = APTITUDE_QUESTIONS[currentQuestionIdx];
  const totalQuestions = APTITUDE_QUESTIONS.length;

  const handleSelectOption = (option) => {
    if (audio?.playTap) audio.playTap();

    const updatedAnswers = {
      ...userAnswers,
      [currentQ.id]: option,
    };
    setUserAnswers(updatedAnswers);

    if (currentQuestionIdx + 1 < totalQuestions) {
      setCurrentQuestionIdx((prev) => prev + 1);
    } else {
      // Completed all questions -> calculate recommendations
      const recommendations = calculateSportRecommendations(updatedAnswers, reactionTimeMs);
      setRecommendationResult(recommendations);
      if (audio?.playVictoryFanfare) audio.playVictoryFanfare();
    }
  };

  // If recommendation result is ready, show recommendation screen
  if (recommendationResult) {
    const { primary, secondary, allRanked } = recommendationResult;
    const PrimaryIcon = SPORT_ICON_MAP[primary.id] || Activity;
    const SecondaryIcon = SPORT_ICON_MAP[secondary.id] || Target;

    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Talent Recommendation Engine</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
            Your Optimal Sports Pathway
          </h2>
          <p className="text-sm text-slate-300 max-w-xl mx-auto mt-1">
            Synthesized from your {reactionTimeMs}ms neuromuscular reflex speed and biomechanical trait profile.
          </p>
        </div>

        {/* Primary Match Hero Card */}
        <div className="rounded-3xl bg-gradient-to-br from-[#122822] via-[#0d1c1a] to-[#0a1214] border-2 border-emerald-500/50 p-6 sm:p-8 shadow-2xl shadow-emerald-500/15 mb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>

          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-lg">
                <PrimaryIcon className="w-8 h-8" />
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  #1 Primary Recommendation
                </span>
                <h3 className="text-3xl font-extrabold text-white font-display">{primary.name}</h3>
                <span className="text-xs text-slate-400">{primary.category}</span>
              </div>
            </div>

            {/* Match Percentage Badge */}
            <div className="text-right">
              <div className="text-4xl sm:text-5xl font-black text-emerald-400 font-mono leading-none">
                {primary.matchPercentage}%
              </div>
              <span className="text-xs font-bold text-slate-300">Biomechanical Match</span>
            </div>
          </div>

          <p className="text-sm sm:text-base text-slate-200 leading-relaxed mb-6">
            {primary.description}
          </p>

          {/* Key Attributes Match */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
            {primary.keyAttributes.map((attr, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-slate-950/60 border border-emerald-500/20 text-center"
              >
                <span className="text-xs font-semibold text-emerald-300">{attr}</span>
              </div>
            ))}
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-emerald-500/20">
            {primary.heroTestAvailable ? (
              <button
                onClick={() => onLaunchLiveTest(primary.id)}
                className="flex-1 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-extrabold text-sm shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
              >
                <Activity className="w-5 h-5 fill-slate-950" />
                <span>Launch Live 10s Agility Test in {primary.name}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() =>
                  onViewResults({
                    sportId: primary.id,
                    sportName: primary.name,
                    score: Math.round(primary.matchPercentage * 0.9),
                    percentile: Math.min(94, Math.round(primary.matchPercentage * 0.95)),
                    reactionTimeMs,
                  })
                }
                className="flex-1 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-extrabold text-sm shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
              >
                <span>View Full Pathway & Coaching Report</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={() =>
                onViewResults({
                  sportId: primary.id,
                  sportName: primary.name,
                  score: Math.round(primary.matchPercentage * 0.9),
                  percentile: Math.min(94, Math.round(primary.matchPercentage * 0.95)),
                  reactionTimeMs,
                })
              }
              className="px-5 py-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
            >
              <span>View Talent Pathway</span>
            </button>
          </div>
        </div>

        {/* Secondary Match & Other Rankings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Secondary Card */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-200">
                <SecondaryIcon className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
                  #2 Alternative Discipline
                </span>
                <h4 className="text-lg font-bold text-white">{secondary.name}</h4>
                <p className="text-xs text-slate-400">{secondary.tagline}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-cyan-400 font-mono">
                {secondary.matchPercentage}%
              </span>
              <div className="text-[10px] text-slate-400">Affinity</div>
            </div>
          </div>

          {/* Full Distribution Breakdown */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Complete Discipline Affinity:
            </span>
            <div className="space-y-1.5">
              {allRanked.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium">{item.name}</span>
                  <div className="flex items-center gap-2 w-1/2">
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full"
                        style={{ width: `${item.matchPercentage}%` }}
                      ></div>
                    </div>
                    <span className="font-mono text-slate-400 text-[11px] w-8 text-right">
                      {item.matchPercentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Active Question Flow
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={
            currentQuestionIdx === 0
              ? onBack
              : () => setCurrentQuestionIdx((prev) => prev - 1)
          }
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
          Question {currentQuestionIdx + 1} of {totalQuestions}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden mb-8 border border-slate-800">
        <div
          className="bg-gradient-to-r from-cyan-500 to-emerald-500 h-full transition-all duration-300"
          style={{ width: `${((currentQuestionIdx + 1) / totalQuestions) * 100}%` }}
        ></div>
      </div>

      {/* Question Title */}
      <div className="mb-6 text-center">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display mb-2">
          {currentQ.title}
        </h2>
        <p className="text-sm text-slate-400">{currentQ.subtitle}</p>
      </div>

      {/* Options List */}
      <div className="space-y-3">
        {currentQ.options.map((option) => (
          <div
            key={option.id}
            onClick={() => handleSelectOption(option)}
            className="group p-5 rounded-2xl bg-slate-900/70 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/50 cursor-pointer transition-all duration-200 hover:shadow-xl flex items-start gap-4"
          >
            <div className="w-6 h-6 rounded-full border border-slate-600 group-hover:border-emerald-400 group-hover:bg-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5 transition-colors">
              <div className="w-2.5 h-2.5 rounded-full bg-transparent group-hover:bg-emerald-400 transition-colors" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                {option.label}
              </h4>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5 leading-relaxed">
                {option.sublabel}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
