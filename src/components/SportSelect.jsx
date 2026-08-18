import React from 'react';
import { SPORTS_DATABASE } from '../utils/sportRecommendation';
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  Shield,
  Target,
  Zap,
  Crosshair,
  Sparkles,
  Award,
  Video,
  ClipboardList,
} from 'lucide-react';

const ICON_MAP = {
  badminton: Activity,
  football: Shield,
  cricket: Target,
  boxing: Zap,
  archery: Crosshair,
};

export function SportSelect({ onSelectSport, onBack }) {
  const sports = Object.values(SPORTS_DATABASE);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        <div className="text-right">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
            Phase 1: Sport Selection
          </span>
          <p className="text-xs text-slate-400">Choose a discipline to begin assessment</p>
        </div>
      </div>

      <div className="text-center max-w-2xl mx-auto mb-10">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display tracking-tight mb-2">
          Select Your Target Sport
        </h2>
        <p className="text-sm sm:text-base text-slate-300">
          Assess your baseline kinematics, lateral footwork speed, or sport-specific tactical instincts.
        </p>
      </div>

      {/* Grid of 5 Sports */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sports.map((sport) => {
          const IconComp = ICON_MAP[sport.id] || Activity;
          const isHero = sport.heroTestAvailable;

          return (
            <div
              key={sport.id}
              onClick={() => onSelectSport(sport.id)}
              className={`group relative rounded-2xl p-6 transition-all duration-300 cursor-pointer flex flex-col justify-between border ${
                isHero
                  ? 'bg-gradient-to-b from-[#132223] to-[#0c1619] border-emerald-500/50 hover:border-emerald-400 hover:shadow-2xl hover:shadow-emerald-500/20'
                  : 'bg-slate-900/60 hover:bg-slate-900/90 border-slate-800 hover:border-slate-700 hover:shadow-xl'
              }`}
            >
              {isHero && (
                <div className="absolute -top-3 right-5 px-3 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-500 text-slate-950 uppercase tracking-wider shadow-md">
                  Hero Live CV Test
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                    style={{
                      backgroundColor: `${sport.accentColor}20`,
                      border: `1px solid ${sport.accentColor}50`,
                      color: sport.accentColor,
                    }}
                  >
                    <IconComp className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700">
                    {sport.category}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-emerald-300 transition-colors font-display">
                  {sport.name}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">{sport.tagline}</p>

                {/* Key Attributes */}
                <div className="space-y-1.5 mb-6">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Core Attributes Tested:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {sport.keyAttributes.map((attr, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-800 text-slate-300 border border-slate-700/60"
                      >
                        {attr}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  {isHero ? (
                    <>
                      <Video className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-300 font-semibold">Webcam MoveNet AI</span>
                    </>
                  ) : (
                    <>
                      <ClipboardList className="w-3.5 h-3.5 text-slate-400" />
                      <span>Skill & Aptitude Battery</span>
                    </>
                  )}
                </div>
                <div
                  className={`flex items-center gap-1 text-xs font-bold transition-transform group-hover:translate-x-1 ${
                    isHero ? 'text-emerald-400' : 'text-slate-300'
                  }`}
                >
                  <span>{isHero ? 'Start Camera Test' : 'Start Assessment'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
