import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Landing } from './components/Landing';
import { SportSelect } from './components/SportSelect';
import { LiveAssessment } from './components/LiveAssessment';
import { ReactionTest } from './components/ReactionTest';
import { QuizFlow } from './components/QuizFlow';
import { MockSportQuiz } from './components/MockSportQuiz';
import { ResultsScreen } from './components/ResultsScreen';
import { useAudioSynth } from './hooks/useAudioSynth';
import { getSamplePitchData } from './utils/scoring';

export function App() {
  // Navigation View State
  const [currentView, setCurrentView] = useState('landing');
  const [selectedSportId, setSelectedSportId] = useState('badminton');
  const [reactionTimeMs, setReactionTimeMs] = useState(245);
  const [assessmentResult, setAssessmentResult] = useState(null);

  // Settings / Cohorts
  const [ageGroup, setAgeGroup] = useState(() => {
    return localStorage.getItem('khelai_age_group') || 'U17 Youth';
  });

  const [isSimulation, setIsSimulation] = useState(() => {
    return localStorage.getItem('khelai_simulation_mode') === 'true';
  });

  // Audio Synthesizer Hook
  const audio = useAudioSynth();

  // Load cached result if available
  useEffect(() => {
    const cached = localStorage.getItem('khelai_last_result');
    if (cached) {
      try {
        setAssessmentResult(JSON.parse(cached));
      } catch (e) {}
    }
  }, []);

  // Sync settings to localStorage
  useEffect(() => {
    localStorage.setItem('khelai_age_group', ageGroup);
  }, [ageGroup]);

  useEffect(() => {
    localStorage.setItem('khelai_simulation_mode', isSimulation.toString());
  }, [isSimulation]);

  // --- Handlers ---
  const handleSelectFlow = (flow) => {
    if (audio.playTap) audio.playTap();
    if (flow === 'know_sport') {
      setCurrentView('sport_select');
    } else {
      setCurrentView('reaction_test');
    }
  };

  const handleSelectSport = (sportId) => {
    if (audio.playTap) audio.playTap();
    setSelectedSportId(sportId);
    if (sportId === 'badminton') {
      setCurrentView('live_assessment');
    } else {
      setCurrentView('mock_quiz');
    }
  };

  const handleCompleteReactionTest = (avgMs) => {
    setReactionTimeMs(avgMs);
    setCurrentView('quiz_flow');
  };

  const handleCompleteAssessment = (result) => {
    setAssessmentResult(result);
    localStorage.setItem('khelai_last_result', JSON.stringify(result));
    setCurrentView('results');
  };

  // Instant Demo Preset for Pitch judges
  const handleTriggerQuickPitchData = () => {
    if (audio.playVictoryFanfare) audio.playVictoryFanfare();
    const sample = getSamplePitchData('badminton', 'high');
    setAssessmentResult(sample);
    localStorage.setItem('khelai_last_result', JSON.stringify(sample));
    setCurrentView('results');
  };

  return (
    <div className="min-h-screen bg-[#080b11] text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-300">
      {/* Top Brand Navbar */}
      <Navbar
        currentView={currentView}
        onNavigateHome={() => setCurrentView('landing')}
        isMuted={audio.isMuted}
        onToggleMute={() => audio.setIsMuted(!audio.isMuted)}
        ageGroup={ageGroup}
        onChangeAgeGroup={setAgeGroup}
        isSimulation={isSimulation}
        onToggleSimulation={() => setIsSimulation(!isSimulation)}
        onTriggerQuickPitchData={handleTriggerQuickPitchData}
      />

      {/* Main Dynamic View Router */}
      <main className="flex-1">
        {currentView === 'landing' && (
          <Landing onSelectFlow={handleSelectFlow} />
        )}

        {currentView === 'sport_select' && (
          <SportSelect
            onSelectSport={handleSelectSport}
            onBack={() => setCurrentView('landing')}
          />
        )}

        {currentView === 'live_assessment' && (
          <LiveAssessment
            sportId={selectedSportId}
            onComplete={handleCompleteAssessment}
            onBack={() => setCurrentView('sport_select')}
            isSimulation={isSimulation}
            onToggleSimulation={() => setIsSimulation(!isSimulation)}
            audio={audio}
          />
        )}

        {currentView === 'mock_quiz' && (
          <MockSportQuiz
            sportId={selectedSportId}
            onComplete={handleCompleteAssessment}
            onBack={() => setCurrentView('sport_select')}
            audio={audio}
          />
        )}

        {currentView === 'reaction_test' && (
          <ReactionTest
            onComplete={handleCompleteReactionTest}
            audio={audio}
          />
        )}

        {currentView === 'quiz_flow' && (
          <QuizFlow
            reactionTimeMs={reactionTimeMs}
            onLaunchLiveTest={(sportId) => {
              setSelectedSportId(sportId);
              setCurrentView('live_assessment');
            }}
            onViewResults={(res) => {
              const fullResult = getSamplePitchData(res.sportId || 'badminton', 'high');
              handleCompleteAssessment({
                ...fullResult,
                ...res,
                reactionTimeMs,
              });
            }}
            onBack={() => setCurrentView('reaction_test')}
            audio={audio}
          />
        )}

        {currentView === 'results' && (
          <ResultsScreen
            resultData={assessmentResult || getSamplePitchData('badminton', 'high')}
            onRetake={() => {
              if (selectedSportId === 'badminton') {
                setCurrentView('live_assessment');
              } else {
                setCurrentView('sport_select');
              }
            }}
            onExploreOtherSports={() => setCurrentView('sport_select')}
            ageGroup={ageGroup}
          />
        )}
      </main>
    </div>
  );
}
export default App;
