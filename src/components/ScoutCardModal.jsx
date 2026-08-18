import React, { useRef } from 'react';
import {
  X,
  Share2,
  Download,
  Printer,
  ShieldCheck,
  Zap,
  Award,
  Trophy,
  CheckCircle2,
  QrCode,
  Sparkles,
} from 'lucide-react';

export function ScoutCardModal({ resultData, onClose, ageGroup = 'U17 Youth' }) {
  const cardRef = useRef(null);

  if (!resultData) return null;

  const {
    sportName = 'Badminton',
    score = 85,
    percentile = 89,
    tier = {},
    metrics = {},
    reactionTimeMs = 230,
    totalDisplacementPx = 1980,
    reps = 10,
  } = resultData;

  const athleteId = `KHEL-IND-2024-${Math.floor(1000 + Math.random() * 9000)}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="max-w-lg w-full bg-slate-950 border border-slate-800 rounded-3xl p-6 relative shadow-2xl space-y-5 animate-scale-up">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
            Verified Digital Athlete Pass
          </span>
          <h3 className="text-2xl font-black text-white font-display">
            Official Scout Talent Card
          </h3>
        </div>

        {/* The Athletic Card Canvas */}
        <div
          ref={cardRef}
          className="rounded-2xl bg-gradient-to-br from-[#121c2c] via-[#0d1522] to-[#080d15] border-2 border-emerald-500/40 p-6 shadow-2xl relative overflow-hidden"
        >
          {/* Decorative Corner Accents */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/15 rounded-full blur-2xl"></div>

          {/* Card Header */}
          <div className="flex items-start justify-between border-b border-slate-800 pb-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-slate-950 shadow-md">
                <Zap className="w-6 h-6 fill-slate-950 text-slate-950" />
              </div>
              <div>
                <h4 className="text-lg font-black text-white font-display leading-tight">
                  KHEL<span className="text-emerald-400">AI</span> SCOUT PASS
                </h4>
                <p className="text-[10px] font-mono text-emerald-400">{athleteId}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <ShieldCheck className="w-3 h-3" />
                <span>SAI Verified</span>
              </span>
              <div className="text-[10px] text-slate-400 mt-0.5">{ageGroup}</div>
            </div>
          </div>

          {/* Sport & Tier Banner */}
          <div className="flex items-center justify-between bg-slate-900/90 rounded-xl p-3.5 border border-slate-800 mb-4">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Target Discipline
              </span>
              <div className="text-xl font-extrabold text-white">{sportName}</div>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Assessed Tier
              </span>
              <div className="text-xs font-bold text-emerald-400">{tier.title || 'National Contender'}</div>
            </div>
          </div>

          {/* Core Metrics Grid */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-center">
              <div className="text-[10px] font-bold text-slate-400 uppercase">Talent Rating</div>
              <div className="text-3xl font-black text-emerald-400 font-mono mt-0.5">
                {score}
                <span className="text-xs text-slate-400 font-normal">/100</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-center">
              <div className="text-[10px] font-bold text-slate-400 uppercase">National Percentile</div>
              <div className="text-3xl font-black text-cyan-400 font-mono mt-0.5">
                Top {100 - percentile}%
              </div>
            </div>
          </div>

          {/* Biomechanical Breakdown */}
          <div className="space-y-2 text-xs mb-4">
            <div className="flex justify-between text-slate-300">
              <span>Lateral Agility Index:</span>
              <span className="font-mono text-emerald-400 font-bold">
                {metrics.lateralSpeed || score}%
              </span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Reflex Velocity:</span>
              <span className="font-mono text-cyan-400 font-bold">{reactionTimeMs} ms</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Cadence / Reversals:</span>
              <span className="font-mono text-amber-400 font-bold">{reps} turns / 10s</span>
            </div>
          </div>

          {/* QR Code Verification Footer */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-white rounded-lg p-1 flex items-center justify-center shrink-0">
                <QrCode className="w-8 h-8 text-black" />
              </div>
              <div className="text-[10px] text-slate-400 leading-tight">
                Scan with Khelo India Scout App <br />
                to verify credentials
              </div>
            </div>
            <span className="text-[9px] font-mono text-slate-500">
              TIMESTAMP: {new Date().toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Action CTAs */}
        <div className="flex gap-2">
          <button
            onClick={handlePrint}
            className="flex-1 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:text-white flex items-center justify-center gap-2 text-xs font-semibold transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print Pass</span>
          </button>
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: 'My KhelAI Sports Talent Card',
                  text: `I scored ${score}/100 in ${sportName} on KhelAI! National Percentile: ${percentile}th.`,
                }).catch(() => {});
              } else {
                navigator.clipboard?.writeText(window.location.href);
                alert('Card link copied to clipboard!');
              }
            }}
            className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-500/20"
          >
            <Share2 className="w-4 h-4" />
            <span>Share Talent Card</span>
          </button>
        </div>
      </div>
    </div>
  );
}
