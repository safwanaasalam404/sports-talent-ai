import React, { useState } from 'react';
import { SPORTS_DATABASE } from '../utils/sportRecommendation';
import { getTalentTier } from '../utils/scoring';
import {
  ArrowLeft,
  ArrowRight,
  Shield,
  Target,
  Zap,
  Crosshair,
  Award,
  Sparkles,
  Timer,
  CheckCircle2,
} from 'lucide-react';

const SPORT_QUIZZES = {
  football: {
    title: 'Football Biomechanical & Tactical Aptitude',
    questions: [
      {
        q: 'When defending a 1v1 counter-attack, your body mechanics instinct is:',
        options: [
          { text: 'Side-on athletic stance, forcing attacker onto weaker foot', score: 30 },
          { text: 'Square body stance, lunging forward immediately for tackle', score: 15 },
          { text: 'Backpedaling rapidly while cutting off passing lane', score: 25 },
        ],
      },
      {
        q: 'In the 85th minute of a high-tempo match, your physical resilience relies on:',
        options: [
          { text: 'High anaerobic threshold and continuous second-wind sprinting', score: 30 },
          { text: 'Energy conservation and smart tactical positional coverage', score: 25 },
          { text: 'Relying purely on teammates to cover defensive distance', score: 10 },
        ],
      },
      {
        q: 'When striking a ball from distance, your kinetic chain power originates from:',
        options: [
          { text: 'Hip flexion, core rotational torque, and locked plant ankle', score: 35 },
          { text: 'Pure lower knee swinging extension without torso rotation', score: 15 },
          { text: 'Upper body forward dive towards ball trajectory', score: 20 },
        ],
      },
    ],
  },
  cricket: {
    title: 'Cricket Hand-Eye Coordination & Biomechanics',
    questions: [
      {
        q: 'When tracking a high-velocity pull shot in the deep, your visual saccade focuses on:',
        options: [
          { text: 'Early bat seam angle and instantaneous ball release trajectory', score: 30 },
          { text: 'Waiting until ball reaches highest trajectory apex', score: 20 },
          { text: 'Following batsman foot movement only', score: 15 },
        ],
      },
      {
        q: 'In explosive fielding pickups, what gives you the fastest throwing release?',
        options: [
          { text: 'Single-stride lateral knee slide into compact shoulder snap', score: 35 },
          { text: 'Coming to complete stop before winding up throwing arm', score: 15 },
          { text: 'Jumping high in the air while throwing mid-flight', score: 20 },
        ],
      },
      {
        q: 'When facing 140+ kmph express pace bowling, your reflex strategy is:',
        options: [
          { text: 'Sub-conscious head alignment and compact front-foot trigger', score: 30 },
          { text: 'Pre-meditating shot before bowler lands at crease', score: 15 },
          { text: 'Deep back-foot retreat with high backlift', score: 25 },
        ],
      },
    ],
  },
  boxing: {
    title: 'Boxing Kinetic Chain & Reaction Aptitude',
    questions: [
      {
        q: 'When throwing a knockout straight cross, where does maximum force generate?',
        options: [
          { text: 'Rear foot pivot -> hip rotation -> shoulder whip -> fist pronation', score: 35 },
          { text: 'Arm muscle extension without turning the hips or rear heel', score: 10 },
          { text: 'Leaning upper body weight forward past lead knee', score: 15 },
        ],
      },
      {
        q: 'When an opponent throws a lead jab, your evasion reflex is:',
        options: [
          { text: 'Micro-slip 2 inches to outside of punch with loaded counter', score: 30 },
          { text: 'Pulling head straight back with chin exposed', score: 10 },
          { text: 'Dropping hands to block body shot', score: 15 },
        ],
      },
      {
        q: 'Your conditioning pacing in round 3 of intense sparring is:',
        options: [
          { text: 'Rhythmic nasal breathing and high-cadence active defense', score: 30 },
          { text: 'Adrenaline dump throwing continuous 100% effort hooks', score: 15 },
          { text: 'Holding onto opponent until referee breaks', score: 15 },
        ],
      },
    ],
  },
  archery: {
    title: 'Archery Precision & Posture Stabilization',
    questions: [
      {
        q: 'During full draw anchor hold, your primary muscular engagement is:',
        options: [
          { text: 'Rhomboid and middle trapezius scapular contraction', score: 35 },
          { text: 'Bicep and forearm grip tension in drawing hand', score: 10 },
          { text: 'Shrugging anterior deltoids up to ear level', score: 15 },
        ],
      },
      {
        q: 'When shooting in 15 kmph gusting crosswinds, your mental protocol is:',
        options: [
          { text: 'Smooth timing release during natural wind pause interval', score: 30 },
          { text: 'Jerking string release the split-second pin crosses center', score: 15 },
          { text: 'Over-aiming 10 rings to opposite direction', score: 15 },
        ],
      },
      {
        q: 'Your respiratory cycle during shot execution is:',
        options: [
          { text: 'Controlled half-exhale at anchor, shooting in respiratory pause', score: 30 },
          { text: 'Holding full deep inhale with tense chest', score: 15 },
          { text: 'Rapid breathing throughout aiming cycle', score: 10 },
        ],
      },
    ],
  },
};

export function MockSportQuiz({ sportId = 'football', onComplete, onBack, audio }) {
  const sport = SPORTS_DATABASE[sportId] || SPORTS_DATABASE.football;
  const quiz = SPORT_QUIZZES[sportId] || SPORT_QUIZZES.football;

  const [currentIdx, setCurrentIdx] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);

  const handleSelectOption = (points) => {
    if (audio?.playTap) audio.playTap();
    const newTotal = totalPoints + points;
    setTotalPoints(newTotal);

    if (currentIdx + 1 < quiz.questions.length) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      // Finished quiz -> compute score
      if (audio?.playVictoryFanfare) audio.playVictoryFanfare();
      const finalScore = Math.min(96, Math.max(58, Math.round(newTotal * 0.95 + 8)));
      const percentile = Math.min(94, Math.round(finalScore * 0.96));

      onComplete({
        sportId: sport.id,
        sportName: sport.name,
        score: finalScore,
        percentile,
        tier: getTalentTier(finalScore),
        metrics: {
          lateralSpeed: Math.min(95, finalScore - 2),
          frequencyReps: Math.min(95, finalScore + 4),
          movementConsistency: Math.min(98, finalScore + 2),
          explosivenessIndex: Math.min(95, finalScore),
        },
        reactionTimeMs: Math.round(270 - (finalScore - 60) * 1.5),
        isDemo: true,
        timestamp: new Date().toISOString(),
      });
    }
  };

  const currentQ = quiz.questions[currentIdx];

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        <div className="text-right">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
            {sport.name} Talent Battery
          </span>
          <p className="text-xs text-slate-400">
            Question {currentIdx + 1} of {quiz.questions.length}
          </p>
        </div>
      </div>

      {/* Progress */}
      <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden mb-8 border border-slate-800">
        <div
          className="bg-amber-400 h-full transition-all duration-300"
          style={{ width: `${((currentIdx + 1) / quiz.questions.length) * 100}%` }}
        ></div>
      </div>

      <div className="mb-6 text-center">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          {quiz.title}
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display mt-2 mb-2">
          {currentQ.q}
        </h2>
      </div>

      {/* Options */}
      <div className="space-y-3">
        {currentQ.options.map((opt, idx) => (
          <div
            key={idx}
            onClick={() => handleSelectOption(opt.score)}
            className="group p-5 rounded-2xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/50 cursor-pointer transition-all duration-200 hover:shadow-xl flex items-center justify-between"
          >
            <span className="text-sm sm:text-base font-semibold text-slate-200 group-hover:text-amber-300 transition-colors">
              {opt.text}
            </span>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all shrink-0 ml-3" />
          </div>
        ))}
      </div>
    </div>
  );
}
