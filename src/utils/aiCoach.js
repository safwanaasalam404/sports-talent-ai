/**
 * AI Sports Coaching & Talent Scouting Synthesis Engine
 * Provides dynamic biomechanical feedback, actionable training drills,
 * and calls the secure /api/coach serverless endpoint with instant offline fallback.
 */

const DRILLS_DATABASE = {
  badminton: {
    elite: [
      {
        title: '6-Corner Explosive Shadow Footwork',
        duration: '4 sets × 45s (30s rest)',
        focus: 'Court coverage & recovery velocity',
        description: 'Randomized corner lunges maintaining low center of gravity. Focus on immediate split-step push-off upon landing.',
      },
      {
        title: 'Reactive Agility Ladder Ickey-Shuffle to Smash Jump',
        duration: '5 sets × 6 reps',
        focus: 'Ankle stiffness & vertical transfer',
        description: 'High-frequency 2-in-1-out footwork across 10 rungs, culminating in explosive rear-court scissor jump.',
      },
    ],
    developing: [
      {
        title: 'Lateral Cone Touch Shuffles',
        duration: '4 sets × 30s',
        focus: 'Base stance width & deceleration stability',
        description: 'Place 2 cones 3 meters apart. Shuffle laterally without crossing feet, touching the cone base on each turn.',
      },
      {
        title: 'Split-Step Reaction Drops',
        duration: '3 sets × 12 reps',
        focus: 'Neuromuscular readiness',
        description: 'Drop from a low hop into wide athletic base the moment visual cue appears, accelerating into left or right diagonal.',
      },
    ],
  },
  football: {
    elite: [
      {
        title: 'T-Drill Dynamic Shuttle with Turn-and-Sprint',
        duration: '5 sets × 4 reps',
        focus: 'Multi-directional change of pace',
        description: 'Sprint 10m forward, 5m lateral shuffle left, 10m lateral shuffle right, backpedal 5m, explosive 15m breakaway.',
      },
      {
        title: 'Box-to-Box Interval Accelerations',
        duration: '6 reps × 100m (45s recovery)',
        focus: 'Aerobic threshold & speed reserve',
        description: 'Maximal effort straight-line sprint with deceleration zone in the final 10 meters.',
      },
    ],
    developing: [
      {
        title: 'Zig-Zag Slalom Agility Run',
        duration: '4 sets × 6 cones',
        focus: 'Torso angulation & balance',
        description: 'Weave through tightly spaced cones using short, choppy steps while keeping chest facing forward.',
      },
    ],
  },
  boxing: {
    elite: [
      {
        title: 'Slip-Line Footwork & Pivot Combos',
        duration: '4 rounds × 2 mins',
        focus: 'Head movement & hip torque',
        description: 'Navigate cord line with continuous slipping, ducking, and 90-degree check hooks on pivot.',
      },
    ],
    developing: [
      {
        title: 'Double-End Bag Rhythm & Step Drills',
        duration: '3 rounds × 2 mins',
        focus: 'Hand-eye timing & weight distribution',
        description: 'Light rhythmic touches maintaining 60/40 rear-to-lead foot balance.',
      },
    ],
  },
  cricket: {
    elite: [
      {
        title: '30-Yard Sprint-and-Slide Fielding Pickups',
        duration: '5 sets × 5 reps',
        focus: 'Fielding deceleration & release velocity',
        description: 'Full sprint from boundary line, knee slide pickup, and direct-hit throw at single stump.',
      },
    ],
    developing: [
      {
        title: 'Reaction Ball Wall Rebounds',
        duration: '4 sets × 20 catches',
        focus: 'Peripheral vision & hand adjustment',
        description: 'Throw irregular multi-nodal reaction ball against brick wall at 2-meter distance, catching with single hand.',
      },
    ],
  },
  archery: {
    elite: [
      {
        title: 'Isometric Scapular Hold with Resistance Band',
        duration: '5 sets × 20s hold',
        focus: 'Back muscle endurance & skeletal alignment',
        description: 'Simulate full draw with heavy resistance band, maintaining zero tremor in shoulder stabilizers.',
      },
    ],
    developing: [
      {
        title: 'Heart-Rate Calming Box Breathing & Laser Target Hold',
        duration: '5 cycles of 4s-4s-4s-4s',
        focus: 'Autonomic nervous control',
        description: 'Inhale 4s, hold 4s, exhale 4s, hold 4s while keeping laser pointer centered on a 5cm target at 5 meters.',
      },
    ],
  },
};

/**
 * Generate comprehensive AI coaching feedback report
 */
export async function generateAICoachingReport({
  sportId = 'badminton',
  score = 75,
  percentile = 70,
  metrics = {},
  reactionTimeMs = 250,
}) {
  const sportDrills = DRILLS_DATABASE[sportId] || DRILLS_DATABASE.badminton;
  const isHighPerformer = score >= 80;
  const recommendedDrills = isHighPerformer
    ? sportDrills.elite || sportDrills.developing
    : sportDrills.developing || sportDrills.elite;

  // Base expert coaching analysis
  let biomechanicalInsight = '';
  let priorityFocus = '';
  let scoutSummary = '';

  if (score >= 90) {
    biomechanicalInsight = `Outstanding kinetic chain efficiency. Your lateral ground reaction force is in the top 5% of tested athletes. Ankle stiffness and rapid hip realignment allow virtually zero deceleration lag during directional changes.`;
    priorityFocus = `Refine post-turn recovery angle by keeping the torso 5° lower during peak velocity transitions to shave an extra 0.08s off court baseline recovery.`;
    scoutSummary = `High-potential prospect for State & National Sports Authority of India (SAI) training camps. Ready for high-velocity competitive sparring.`;
  } else if (score >= 78) {
    biomechanicalInsight = `Strong footwork cadence with impressive burst acceleration. Lateral displacement velocity remains steady across high-tempo segments, showing solid aerobic foundation.`;
    priorityFocus = `Focus on reducing ground contact time on the non-dominant plant foot. Introducing reactive plyometrics will balance left-right directional symmetry.`;
    scoutSummary = `District medal contender with clear runway for State Academy induction within 3-6 months of structured ladder conditioning.`;
  } else if (score >= 60) {
    biomechanicalInsight = `Consistent movement base with good athletic posture. Lateral agility is developing well, though slight deceleration occurs when reversing momentum to the left.`;
    priorityFocus = `Prioritize lateral cone drills and split-step agility to build reactive neuromuscular firing before full-court dynamic lunges.`;
    scoutSummary = `Promising grassroots athlete. Foundational biomechanics are sound; targeted interval footwork will yield rapid percentile gains.`;
  } else {
    biomechanicalInsight = `Good baseline effort recorded. Center of gravity elevates during transitions, which temporarily reduces lateral leverage and shuffle speed.`;
    priorityFocus = `Incorporate daily 10-minute ankle mobility, core rotational holds, and low-stance cone taps to establish an explosive athletic base.`;
    scoutSummary = `Grassroots discovery stage. Focus on fundamental movement literacy and neuromuscular coordination games.`;
  }

  // Attempt non-blocking serverless /api/coach call (with 2.5s strict timeout so demo never delays)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const response = await fetch('/api/coach', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sportId,
        score,
        percentile,
        metrics,
        reactionTimeMs,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (data?.success && data?.coachingTip) {
        biomechanicalInsight = data.coachingTip;
      }
    }
  } catch (e) {
    // Graceful offline fallback
  }

  return {
    scoutSummary,
    biomechanicalInsight,
    priorityFocus,
    drills: recommendedDrills,
    reactionBenchmark:
      reactionTimeMs < 240
        ? 'Elite Reflex (Top Tier)'
        : reactionTimeMs < 280
        ? 'Competitive Athletic Reaction'
        : 'Developing Reflex Range',
  };
}
