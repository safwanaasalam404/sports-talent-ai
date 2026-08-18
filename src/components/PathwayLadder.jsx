import React from 'react';
import {
  Trophy,
  Award,
  CheckCircle2,
  Lock,
  ChevronRight,
  Sparkles,
  Zap,
  Flame,
} from 'lucide-react';

const PATHWAY_TIERS = [
  {
    level: 7,
    title: 'Olympic & TOPS Podium Scheme',
    badge: 'Target Olympic Podium',
    criteria: 'Score 97+ | Sub-210ms reaction | National Gold',
    authority: 'Ministry of Youth Affairs & Sports (MYAS)',
    glowColor: 'from-amber-400 to-yellow-500',
    borderActive: 'border-yellow-400',
    bgActive: 'bg-yellow-500/15',
  },
  {
    level: 6,
    title: 'International / Asian Games Squad',
    badge: 'National Senior Team',
    criteria: 'Score 94-96 | Sub-225ms reaction | Elite Agility',
    authority: 'National Sports Federation (NSF)',
    glowColor: 'from-purple-400 to-indigo-500',
    borderActive: 'border-purple-400',
    bgActive: 'bg-purple-500/15',
  },
  {
    level: 5,
    title: 'National Talent Pool / Junior India',
    badge: 'SAI National Center of Excellence',
    criteria: 'Score 88-93 | High kinematic efficiency',
    authority: 'Sports Authority of India (SAI)',
    glowColor: 'from-emerald-400 to-teal-500',
    borderActive: 'border-emerald-400',
    bgActive: 'bg-emerald-500/15',
  },
  {
    level: 4,
    title: 'State Championship Academy',
    badge: 'Khelo India State Center (KISCE)',
    criteria: 'Score 80-87 | State championship standard',
    authority: 'State Directorate of Sports',
    glowColor: 'from-cyan-400 to-blue-500',
    borderActive: 'border-cyan-400',
    bgActive: 'bg-cyan-500/15',
  },
  {
    level: 3,
    title: 'District Excellence & Podium',
    badge: 'District Khelo India Center',
    criteria: 'Score 68-79 | Consistent footwork cadence',
    authority: 'District Sports Council',
    glowColor: 'from-amber-400 to-orange-500',
    borderActive: 'border-amber-400',
    bgActive: 'bg-amber-500/15',
  },
  {
    level: 2,
    title: 'School / College Varsity',
    badge: 'Inter-University / School Games (SGFI)',
    criteria: 'Score 55-67 | Foundational athleticism',
    authority: 'School Games Federation of India',
    glowColor: 'from-blue-400 to-cyan-500',
    borderActive: 'border-blue-400',
    bgActive: 'bg-blue-500/15',
  },
  {
    level: 1,
    title: 'Grassroots Discovery & Baseline',
    badge: 'Talent Identification Pool',
    criteria: 'Score < 55 | Initial digital assessment',
    authority: 'Community Sports Scouts',
    glowColor: 'from-slate-400 to-slate-500',
    borderActive: 'border-slate-400',
    bgActive: 'bg-slate-500/15',
  },
];

export function PathwayLadder({ score = 75 }) {
  // Determine current active level from score
  const getActiveLevel = (s) => {
    if (s >= 97) return 7;
    if (s >= 94) return 6;
    if (s >= 88) return 5;
    if (s >= 80) return 4;
    if (s >= 68) return 3;
    if (s >= 55) return 2;
    return 1;
  };

  const activeLevel = getActiveLevel(score);

  return (
    <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
      {/* Title */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
            National Scouting Pyramid
          </span>
          <h3 className="text-xl font-bold text-white font-display">
            SAI & Khelo India Pathway Ladder
          </h3>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-xs font-bold text-emerald-300">
          <Trophy className="w-3.5 h-3.5" />
          <span>Tier {activeLevel} of 7</span>
        </div>
      </div>

      <p className="text-xs text-slate-400 mb-6">
        Athletes assessed through KhelAI are indexed against the official 7-stage national sports development pathway.
      </p>

      {/* Ladder Track */}
      <div className="space-y-2.5">
        {PATHWAY_TIERS.map((tier) => {
          const isCurrent = tier.level === activeLevel;
          const isAchieved = tier.level < activeLevel;
          const isLocked = tier.level > activeLevel;

          return (
            <div
              key={tier.level}
              className={`p-3.5 rounded-xl transition-all border flex items-center justify-between relative overflow-hidden ${
                isCurrent
                  ? `${tier.bgActive} ${tier.borderActive} shadow-lg shadow-emerald-500/10 scale-[1.01]`
                  : isAchieved
                  ? 'bg-slate-950/70 border-slate-800/80 text-slate-300'
                  : 'bg-slate-950/30 border-slate-900/80 text-slate-500 opacity-60'
              }`}
            >
              <div className="flex items-center gap-3">
                {/* Level Badge / Status Icon */}
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                    isCurrent
                      ? 'bg-emerald-500 text-slate-950 shadow-md animate-pulse'
                      : isAchieved
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {isAchieved ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : isCurrent ? (
                    <Flame className="w-5 h-5 fill-slate-950" />
                  ) : (
                    <Lock className="w-4 h-4" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h4
                      className={`text-sm font-bold ${
                        isCurrent ? 'text-white' : isAchieved ? 'text-slate-200' : 'text-slate-500'
                      }`}
                    >
                      {tier.title}
                    </h4>
                    {isCurrent && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-500 text-slate-950">
                        Current Position
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-[11px] mt-0.5 text-slate-400">
                    <span className="font-medium text-slate-300">{tier.badge}</span>
                    <span>•</span>
                    <span>{tier.criteria}</span>
                  </div>
                </div>
              </div>

              {/* Authority Tag */}
              <div className="hidden sm:block text-right">
                <span className="text-[10px] font-mono text-slate-400">{tier.authority}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
