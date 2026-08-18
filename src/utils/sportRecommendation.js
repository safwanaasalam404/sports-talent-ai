/**
 * Multi-Factor Sport Recommendation & Aptitude Matrix
 * Combines millisecond reaction time and psychological / biomechanical trait preferences
 * to rank optimal Olympic & National sports pathways.
 */

export const SPORTS_DATABASE = {
  badminton: {
    id: 'badminton',
    name: 'Badminton',
    tagline: 'High-Speed Court Agility & Lightning Reflexes',
    category: 'Racquet Sport / Olympic',
    heroTestAvailable: true,
    accentColor: '#10b981', // emerald volt
    icon: 'Activity',
    keyAttributes: ['Lateral Agility', 'Sub-250ms Reflexes', 'Wrist Explosiveness', 'Court Vision'],
    description: 'Demands split-second decision making, dynamic change of direction, and rapid shuttlecock trajectory tracking.',
    kheloIndiaCategory: 'High Priority Olympic Discipline',
    famousIndianAthletes: ['PV Sindhu', 'Lakshya Sen', 'Pullela Gopichand', 'Saina Nehwal'],
  },
  football: {
    id: 'football',
    name: 'Football',
    tagline: 'Spatial Awareness, Teamwork & Sustained Endurance',
    category: 'Team Sport / Global',
    heroTestAvailable: false,
    accentColor: '#3b82f6', // blue
    icon: 'Shield',
    keyAttributes: ['Aerobic Stamina', 'Multi-Directional Sprinting', 'Tactical Synergy', 'Lower Limb Control'],
    description: 'Requires sustained high-intensity interval running, team spatial intelligence, and pitch awareness.',
    kheloIndiaCategory: 'National Grassroots Priority',
    famousIndianAthletes: ['Sunil Chhetri', 'Bhaichung Bhutia', 'Manvir Singh', 'Ashalata Devi'],
  },
  cricket: {
    id: 'cricket',
    name: 'Cricket',
    tagline: 'Hand-Eye Coordination, Tactical Focus & Burst Power',
    category: 'Fielding & Batting / LA28 Olympic Sport',
    heroTestAvailable: false,
    accentColor: '#f59e0b', // amber
    icon: 'Target',
    keyAttributes: ['Dynamic Vision', 'Rotational Power', 'Hand-Eye Sync', 'Fielding Anticipation'],
    description: 'Combines burst sprinting, rotational core torque for batting/bowling, and rapid peripheral ball tracking.',
    kheloIndiaCategory: 'Olympic Focus 2028',
    famousIndianAthletes: ['Virat Kohli', 'Smriti Mandhana', 'Jasprit Bumrah', 'Harmanpreet Kaur'],
  },
  boxing: {
    id: 'boxing',
    name: 'Boxing',
    tagline: 'Explosive Power, Head Movement & Neuromuscular Speed',
    category: 'Combat Sport / Olympic',
    heroTestAvailable: false,
    accentColor: '#ef4444', // red
    icon: 'Zap',
    keyAttributes: ['Fast-Twitch Upper Body', 'Slip & Counter Reaction', 'Anaerobic Capacity', 'Mental Resilience'],
    description: 'Requires exceptional hand speed, kinetic chain rotation from hips to fists, and evasive head/footwork timing.',
    kheloIndiaCategory: 'Olympic Medal Discipline',
    famousIndianAthletes: ['Mary Kom', 'Nikhat Zareen', 'Lovlina Borgohain', 'Vijender Singh'],
  },
  archery: {
    id: 'archery',
    name: 'Archery',
    tagline: 'Micro-Precision, Core Stability & Mental Focus',
    category: 'Precision Target / Olympic',
    heroTestAvailable: false,
    accentColor: '#06b6d4', // cyan
    icon: 'Crosshair',
    keyAttributes: ['Steady Heart Rate Control', 'Isometric Scapular Strength', 'Target Micro-Focus', 'Fine Motor Control'],
    description: 'Requires supreme mental stillness, isometric posture stabilization, and millimeter-level release consistency.',
    kheloIndiaCategory: 'Target Olympic Podium (TOPS)',
    famousIndianAthletes: ['Deepika Kumari', 'Dhiraj Bommadevara', 'Ankita Bhakat', 'Tarundeep Rai'],
  },
};

/**
 * Aptitude Quiz Questions
 */
export const APTITUDE_QUESTIONS = [
  {
    id: 'team_vs_solo',
    title: 'How do you thrive best under pressure?',
    subtitle: 'Choose the competitive environment where your instincts peak.',
    options: [
      {
        id: 'solo',
        label: 'Solo Arena / 1-on-1 Duel',
        sublabel: 'I love total control, personal accountability, and outsmarting a direct rival.',
        scores: { badminton: 4, boxing: 5, archery: 5, cricket: 1, football: 0 },
      },
      {
        id: 'team',
        label: 'Squad Dynamics / Team Synergy',
        sublabel: 'I thrive coordinating plays, communicating on field, and winning as a collective unit.',
        scores: { football: 5, cricket: 4, badminton: 1, boxing: 0, archery: 0 },
      },
    ],
  },
  {
    id: 'energy_system',
    title: 'What is your physical engine style?',
    subtitle: 'How does your body naturally prefer expending energy?',
    options: [
      {
        id: 'explosive',
        label: 'Lightning Bursts & Rapid Acceleration',
        sublabel: 'Short explosive springs, instant changes of direction, high-velocity twitch actions.',
        scores: { badminton: 5, boxing: 5, cricket: 3, football: 2, archery: 0 },
      },
      {
        id: 'endurance',
        label: 'Sustained Stamina & Engine Relentlessness',
        sublabel: 'Continuous high-workrate output over long periods without dropping intensity.',
        scores: { football: 5, badminton: 3, boxing: 3, cricket: 2, archery: 1 },
      },
      {
        id: 'steady_calm',
        label: 'Controlled Stillness & Micro-Pulse Regulation',
        sublabel: 'Lowering heart rate under adrenaline, calm breathing, and rock-steady muscle holds.',
        scores: { archery: 5, cricket: 2, badminton: 1, boxing: 0, football: 0 },
      },
    ],
  },
  {
    id: 'skill_preference',
    title: 'Which superpower would you choose on game day?',
    subtitle: 'Your primary physical weapon in competitive sport.',
    options: [
      {
        id: 'agility_reaction',
        label: 'Instant Reaction & Agile Footwork',
        sublabel: 'Reacting before the opponent blinks and flying across the playing surface.',
        scores: { badminton: 5, boxing: 4, football: 3, cricket: 2, archery: 0 },
      },
      {
        id: 'precision_accuracy',
        label: 'Laser Accuracy & Target Precision',
        sublabel: 'Hitting an exact coin-sized target with calculated micro-adjustments.',
        scores: { archery: 5, cricket: 4, badminton: 2, boxing: 1, football: 2 },
      },
      {
        id: 'power_impact',
        label: 'Kinetic Power & Decisive Impact',
        sublabel: 'Generating explosive rotational torque, striking with maximum force and conviction.',
        scores: { boxing: 5, cricket: 4, football: 3, badminton: 2, archery: 1 },
      },
    ],
  },
  {
    id: 'tactical_mindset',
    title: 'What excites your competitive mindset most?',
    subtitle: 'The psychological edge you bring to competition.',
    options: [
      {
        id: 'fast_court',
        label: 'Deceptive Rallies & Court Angles',
        sublabel: 'Creating sharp angles, drops, and deceptive smashes in milliseconds.',
        scores: { badminton: 5, cricket: 2, football: 1, boxing: 2, archery: 0 },
      },
      {
        id: 'field_strategy',
        label: 'Tactical Playmaking & Space Creation',
        sublabel: 'Reading the entire field, unlocking defenses, and leading transitions.',
        scores: { football: 5, cricket: 3, badminton: 1, boxing: 0, archery: 0 },
      },
      {
        id: 'combat_timing',
        label: 'Direct Combat Timing & Counter-Punching',
        sublabel: 'Anticipating attacks, slipping punches, and landing crisp counters.',
        scores: { boxing: 5, badminton: 2, cricket: 1, football: 1, archery: 0 },
      },
      {
        id: 'zen_focus',
        label: 'Zen Composure & Mental Discipline',
        sublabel: 'Shutting out crowd noise, tuning into zero heartbeat variation, hitting the bullseye.',
        scores: { archery: 5, cricket: 3, badminton: 1, boxing: 1, football: 0 },
      },
    ],
  },
];

/**
 * Calculates recommendation affinities given user answers and reaction test millisecond score
 */
export function calculateSportRecommendations(answers = {}, reactionTimeMs = 260) {
  const sportScores = {
    badminton: 0,
    football: 0,
    cricket: 0,
    boxing: 0,
    archery: 0,
  };

  // Add question scores
  Object.values(answers).forEach((selectedOption) => {
    if (selectedOption && selectedOption.scores) {
      Object.entries(selectedOption.scores).forEach(([sportId, points]) => {
        if (sportScores[sportId] !== undefined) {
          sportScores[sportId] += points;
        }
      });
    }
  });

  // Reaction time biomechanical modifier
  if (reactionTimeMs < 230) {
    // Ultra-fast reflexes -> boost Badminton & Boxing
    sportScores.badminton += 6;
    sportScores.boxing += 5;
    sportScores.cricket += 3;
  } else if (reactionTimeMs < 270) {
    // Fast reflexes -> balanced court & field
    sportScores.badminton += 4;
    sportScores.football += 4;
    sportScores.cricket += 4;
  } else if (reactionTimeMs < 330) {
    // Good field & coordination
    sportScores.football += 4;
    sportScores.cricket += 3;
    sportScores.archery += 3;
  } else {
    // Calmer/deliberate control
    sportScores.archery += 6;
    sportScores.cricket += 2;
  }

  // Normalize scores to percentages
  const maxPossible = 26; // Approximate max points obtainable
  const ranked = Object.entries(sportScores)
    .map(([sportId, score]) => {
      const sportInfo = SPORTS_DATABASE[sportId];
      const matchPercentage = Math.min(98, Math.max(45, Math.round((score / maxPossible) * 96)));
      return {
        ...sportInfo,
        rawScore: score,
        matchPercentage,
        reactionBonusApplied: reactionTimeMs < 250,
      };
    })
    .sort((a, b) => b.matchPercentage - a.matchPercentage);

  return {
    primary: ranked[0],
    secondary: ranked[1],
    allRanked: ranked,
    reactionTimeMs,
  };
}
