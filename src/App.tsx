/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ScreenId, ScheduleSlot, SyllabusModule, ResourceItem } from './types';
import { INITIAL_MODULES, INITIAL_RESOURCES } from './data/mockData';
import { NavigationHeader } from './components/NavigationHeader';
import { LandingPage } from './components/LandingPage';
import { MasterSchedule } from './components/MasterSchedule';
import { Step1Upload } from './components/Step1Upload';
import { Step2Exam } from './components/Step2Exam';
import { Step3Bandwidth } from './components/Step3Bandwidth';
import { Step4Resources } from './components/Step4Resources';
import { StudyDashboard } from './components/StudyDashboard';
import { VoiceRecallQuiz } from './components/VoiceRecallQuiz';
import { HandwrittenAnalysis } from './components/HandwrittenAnalysis';

export default function App() {
  // Sync screen with URL hash if present
  const getInitialScreen = (): ScreenId => {
    const hash = window.location.hash.replace('#', '') as ScreenId;
    const validScreens: ScreenId[] = [
      'landing',
      'master-schedule',
      'step1-upload',
      'step2-exam',
      'step3-bandwidth',
      'step4-resources',
      'dashboard',
      'voice-quiz',
      'handwritten-analysis',
    ];
    return validScreens.includes(hash) ? hash : 'landing';
  };

  const [currentScreen, setCurrentScreen] = useState<ScreenId>(getInitialScreen);

  // Global state across onboarding & planner
  const [syllabusText, setSyllabusText] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [parsedData, setParsedData] = useState<any>(null);
  const [targetDate, setTargetDate] = useState<string>('2025-11-28');
  const [targetScore, setTargetScore] = useState<number>(518);
  const [retentionMode, setRetentionMode] = useState<'aggressive' | 'balanced'>('aggressive');

  // Bandwidth slots (default matching Screen 5)
  const [slots, setSlots] = useState<Record<string, ScheduleSlot>>(() => {
    const initial: Record<string, ScheduleSlot> = {
      'mon-morning': { day: 'mon', timeBlock: 'morning', type: 'focus', hours: 4.0, label: 'Active Focus', sublabel: 'Core Syllabus' },
      'wed-morning': { day: 'wed', timeBlock: 'morning', type: 'focus', hours: 4.0, label: 'Active Focus', sublabel: 'Problem Sets' },
      'sat-morning': { day: 'sat', timeBlock: 'morning', type: 'focus', hours: 4.0, label: 'Active Focus', sublabel: 'Mock Testing' },

      'tue-afternoon': { day: 'tue', timeBlock: 'afternoon', type: 'focus', hours: 4.0, label: 'Active Focus', sublabel: 'Deep Review' },
      'sun-afternoon': { day: 'sun', timeBlock: 'afternoon', type: 'buffer', hours: 3.0, label: 'Adaptive Buffer', sublabel: 'AI Auto-Heals' },

      'mon-evening': { day: 'mon', timeBlock: 'evening', type: 'spaced', hours: 1.5, label: 'Flashcards', sublabel: 'Spaced Recall' },
      'wed-evening': { day: 'wed', timeBlock: 'evening', type: 'spaced', hours: 1.5, label: 'Flashcards', sublabel: 'Active Recall' },
      'thu-evening': { day: 'thu', timeBlock: 'evening', type: 'spaced', hours: 1.5, label: 'Quiz Sprint', sublabel: 'Quick Checks' },
      'sun-evening': { day: 'sun', timeBlock: 'evening', type: 'spaced', hours: 2.0, label: 'Weekly Prep', sublabel: 'Diagnostic Run' },
    };
    return initial;
  });

  // Attached study resources
  const [resources, setResources] = useState<ResourceItem[]>(INITIAL_RESOURCES);

  // Active course modules
  const [modules, setModules] = useState<SyllabusModule[]>(INITIAL_MODULES);

  // Navigate helper
  const navigateTo = (screen: ScreenId) => {
    setCurrentScreen(screen);
    window.location.hash = screen;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Sync back button / hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') as ScreenId;
      const validScreens: ScreenId[] = [
        'landing',
        'master-schedule',
        'step1-upload',
        'step2-exam',
        'step3-bandwidth',
        'step4-resources',
        'dashboard',
        'voice-quiz',
        'handwritten-analysis',
      ];
      if (validScreens.includes(hash)) {
        setCurrentScreen(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleSyllabusParsed = (data: any) => {
    setParsedData(data);
    if (data.units && data.units.length > 0) {
      const converted: SyllabusModule[] = data.units.map((u: any, idx: number) => ({
        id: u.id || `unit-${idx}`,
        name: u.name,
        submodulesCount: u.submodulesCount || 4,
        weight: u.weight || 20,
        topics: u.topics || ['Lecture Core'],
        completedUnits: idx === 0 ? 4 : idx === 1 ? 3 : 0,
        totalUnits: 4,
        reference: u.reference || 'Syllabus Assigned',
        status: idx < 2 ? 'completed' : idx === 2 ? 'in-progress' : 'pending',
        progress: idx === 0 ? 100 : idx === 1 ? 100 : idx === 2 ? 60 : 0,
      }));
      setModules(converted);
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col">
      {/* Dev & Navigation Quick Switcher Banner */}
      <NavigationHeader currentScreen={currentScreen} onNavigate={navigateTo} />

      {/* Screen Render */}
      <div className="flex-1 flex flex-col">
        {currentScreen === 'landing' && <LandingPage onNavigate={navigateTo} />}

        {currentScreen === 'master-schedule' && <MasterSchedule onNavigate={navigateTo} />}

        {currentScreen === 'step1-upload' && (
          <Step1Upload
            onNavigate={navigateTo}
            syllabusText={syllabusText}
            setSyllabusText={setSyllabusText}
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
            onSyllabusParsed={handleSyllabusParsed}
          />
        )}

        {currentScreen === 'step2-exam' && (
          <Step2Exam
            onNavigate={navigateTo}
            parsedData={parsedData}
            targetDate={targetDate}
            setTargetDate={setTargetDate}
            targetScore={targetScore}
            setTargetScore={setTargetScore}
            retentionMode={retentionMode}
            setRetentionMode={setRetentionMode}
          />
        )}

        {currentScreen === 'step3-bandwidth' && (
          <Step3Bandwidth onNavigate={navigateTo} slots={slots} setSlots={setSlots} />
        )}

        {currentScreen === 'step4-resources' && (
          <Step4Resources onNavigate={navigateTo} resources={resources} setResources={setResources} />
        )}

        {currentScreen === 'dashboard' && (
          <StudyDashboard onNavigate={navigateTo} modules={modules} setModules={setModules} />
        )}

        {currentScreen === 'voice-quiz' && <VoiceRecallQuiz onNavigate={navigateTo} />}

        {currentScreen === 'handwritten-analysis' && <HandwrittenAnalysis onNavigate={navigateTo} />}
      </div>
    </div>
  );
}
