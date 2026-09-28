import React, { useState } from 'react';
import { ScreenId } from '../types';

interface Step2ExamProps {
  onNavigate: (screen: ScreenId) => void;
  parsedData: any;
  targetDate: string;
  setTargetDate: (date: string) => void;
  targetScore: number;
  setTargetScore: (score: number) => void;
  retentionMode: 'aggressive' | 'balanced';
  setRetentionMode: (mode: 'aggressive' | 'balanced') => void;
}

export const Step2Exam: React.FC<Step2ExamProps> = ({
  onNavigate,
  parsedData,
  targetDate,
  setTargetDate,
  targetScore,
  setTargetScore,
  retentionMode,
  setRetentionMode,
}) => {
  const [courseName, setCourseName] = useState(
    parsedData?.courseName || 'MCAT Prep: Biological & Biochemical Foundations'
  );
  const [tags, setTags] = useState(['Pre-Med', 'High-Stakes', 'Standard 12-Week']);
  const [newTag, setNewTag] = useState('');
  const [showAddTag, setShowAddTag] = useState(false);
  const [selectedDay, setSelectedDay] = useState(28); // Nov 28

  const handleDayClick = (day: number) => {
    setSelectedDay(day);
    setTargetDate(`2025-11-${day < 10 ? '0' + day : day}`);
  };

  const daysRemaining = selectedDay >= 17 ? selectedDay - 17 + 31 : 32;

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
      setShowAddTag(false);
    }
  };

  return (
    <div className="bg-background text-on-surface font-body antialiased min-h-screen pb-28 selection:bg-primary-container selection:text-on-primary-container">
      {/* Top Navigation Bar */}
      <header className="flex justify-between items-center w-full px-6 py-3 border-b border-outline-variant bg-background sticky top-0 z-40 backdrop-blur-md bg-opacity-95">
        <div className="flex items-center gap-4">
          <button onClick={() => onNavigate('landing')} className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary-container flex items-center justify-center text-on-primary font-bold text-xs">
              <span className="material-symbols-outlined text-[16px] text-primary-fixed">neurology</span>
            </div>
            <span className="text-base font-bold font-headline tracking-tight text-on-surface">Synapse AI</span>
            <span className="text-xs font-mono text-outline px-1.5 py-0.5 rounded border border-outline-variant uppercase">
              STUDY ENGINE
            </span>
          </button>
          <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface-container-high border border-outline-variant text-[11px] font-mono text-on-surface-variant">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
            INGESTION PIPELINE • Step 2 of 4
          </div>
        </div>

        {/* Stepper Links inside Nav */}
        <nav className="hidden lg:flex items-center gap-6 text-xs">
          <button
            onClick={() => onNavigate('step1-upload')}
            className="text-on-surface-variant flex items-center gap-1.5 font-medium hover:text-on-surface"
          >
            <span className="material-symbols-outlined text-[15px] text-tertiary">check_circle</span>
            Upload Syllabus
          </button>
          <div className="text-primary font-medium border-b-2 border-primary pb-1 flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-full bg-primary text-on-primary text-[10px] flex items-center justify-center font-bold">
              2
            </span>
            Exam & Goals
          </div>
          <button
            onClick={() => onNavigate('step3-bandwidth')}
            className="text-on-surface-variant flex items-center gap-1.5 font-medium opacity-60 hover:opacity-100"
          >
            <span className="w-4 h-4 rounded-full border border-outline text-outline text-[10px] flex items-center justify-center font-bold">
              3
            </span>
            Study Bandwidth
          </button>
          <button
            onClick={() => onNavigate('step4-resources')}
            className="text-on-surface-variant flex items-center gap-1.5 font-medium opacity-60 hover:opacity-100"
          >
            <span className="w-4 h-4 rounded-full border border-outline text-outline text-[10px] flex items-center justify-center font-bold">
              4
            </span>
            AI Generation
          </button>
        </nav>

        {/* Trailing Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('master-schedule')}
            className="flex items-center gap-1.5 text-xs font-medium text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high px-2.5 py-1.5 rounded-lg border border-outline-variant transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">calendar_today</span>
            <span className="hidden sm:inline">Schedule</span>
          </button>
          <button
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-1.5 text-xs font-medium text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high px-2.5 py-1.5 rounded-lg border border-outline-variant transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
            <span className="hidden sm:inline">Save & Exit</span>
          </button>
        </div>
      </header>

      {/* Interactive 4-Step Visual Track Container */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-2">
        <div className="bg-surface-container border border-outline-variant rounded-xl p-3 grid grid-cols-2 md:grid-cols-4 gap-2">
          {/* Step 1 Complete */}
          <button
            onClick={() => onNavigate('step1-upload')}
            className="flex items-center gap-3 px-3 py-2 rounded-lg bg-surface-container-low border border-outline-variant/60 text-left hover:bg-surface-container-high transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-tertiary-container/30 border border-tertiary/40 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-tertiary text-sm">check</span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono uppercase text-tertiary font-semibold tracking-wide">Step 01</span>
                <span className="text-[9px] px-1 py-0.2 rounded bg-tertiary-container/40 text-on-tertiary-container font-mono">
                  Done
                </span>
              </div>
              <p className="text-xs font-medium text-on-surface truncate">Upload Syllabus</p>
            </div>
          </button>

          {/* Step 2 Active */}
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-surface-container-high border border-primary ring-1 ring-primary/40 shadow-[0_0_15px_rgba(167,139,250,0.15)]">
            <div className="w-7 h-7 rounded-full bg-primary text-on-primary flex items-center justify-center shrink-0 font-bold text-xs">
              2
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono uppercase text-primary font-semibold tracking-wide">Step 02</span>
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping"></span>
              </div>
              <p className="text-xs font-semibold text-on-surface truncate">Exam & Goals</p>
            </div>
          </div>

          {/* Step 3 Upcoming */}
          <button
            onClick={() => onNavigate('step3-bandwidth')}
            className="flex items-center gap-3 px-3 py-2 rounded-lg bg-surface-container-lowest/50 border border-outline-variant/40 opacity-70 text-left hover:opacity-100 transition-opacity"
          >
            <div className="w-7 h-7 rounded-full bg-surface-container border border-outline text-on-surface-variant flex items-center justify-center shrink-0 font-mono text-xs">
              3
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-mono uppercase text-secondary font-medium tracking-wide">Step 03</span>
              <p className="text-xs font-medium text-on-surface-variant truncate">Study Bandwidth</p>
            </div>
          </button>

          {/* Step 4 Upcoming */}
          <button
            onClick={() => onNavigate('step4-resources')}
            className="flex items-center gap-3 px-3 py-2 rounded-lg bg-surface-container-lowest/50 border border-outline-variant/40 opacity-70 text-left hover:opacity-100 transition-opacity"
          >
            <div className="w-7 h-7 rounded-full bg-surface-container border border-outline text-on-surface-variant flex items-center justify-center shrink-0 font-mono text-xs">
              4
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-mono uppercase text-secondary font-medium tracking-wide">Step 04</span>
              <p className="text-xs font-medium text-on-surface-variant truncate">AI Generation</p>
            </div>
          </button>
        </div>
      </section>

      {/* Main Workflow Canvas */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-4">
        {/* Header Block */}
        <div className="mb-6 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-container border border-outline-variant text-[11px] font-mono text-primary font-medium">
            <span className="material-symbols-outlined text-[13px]">tune</span>
            Deterministic Milestone Mapping
          </div>
          <h1 className="text-2xl sm:text-3xl font-headline font-bold text-on-surface tracking-tight">
            Define your exam milestones & target score
          </h1>
          <p className="text-sm text-on-surface-variant max-w-3xl leading-relaxed">
            Synapse calculates reverse-engineered pacing curves based on your target date and curriculum complexity. Calibrate your difficulty weighting below.
          </p>
        </div>

        {/* Asymmetric 2-Column Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column / Primary Configuration Parameters (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            {/* Course Meta Card */}
            <div className="bg-surface-container border border-outline-variant rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono font-medium text-on-surface-variant uppercase tracking-wider flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[15px] text-primary">school</span>
                  Subject / Course Name
                </label>
                <span className="text-[11px] font-mono text-secondary">Verified from PDF metadata</span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3.5 py-2.5 text-sm text-on-surface font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
                <span className="absolute right-3 top-3 text-secondary text-xs material-symbols-outlined">edit</span>
              </div>

              {/* Quick Classification Tag Chips */}
              <div className="flex flex-wrap gap-2 pt-1 items-center">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 rounded-md text-xs font-medium bg-surface-container-high border border-outline-variant text-on-surface flex items-center gap-1"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                    {tag}
                  </span>
                ))}
                {showAddTag ? (
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      placeholder="Tag..."
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                      className="bg-surface-container-low border border-primary text-xs px-2 py-1 rounded text-on-surface outline-none w-24"
                    />
                    <button
                      onClick={handleAddTag}
                      className="px-2 py-1 bg-primary text-on-primary text-xs rounded font-bold"
                    >
                      Add
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowAddTag(true)}
                    className="px-2 py-1 rounded-md text-xs font-medium border border-dashed border-outline text-secondary hover:text-on-surface hover:border-on-surface-variant transition-colors"
                  >
                    + Add Tag
                  </button>
                )}
              </div>
            </div>

            {/* Sleek Dark Calendar Date Picker Widget */}
            <div className="bg-surface-container border border-outline-variant rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xs font-mono font-medium text-on-surface-variant uppercase tracking-wider flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[15px] text-primary">calendar_month</span>
                    Target Exam Date
                  </h2>
                  <p className="text-xs text-secondary mt-0.5">Calculates non-linear spaced repetition intervals</p>
                </div>
                <div className="flex items-center gap-2 bg-surface-container-low border border-primary/40 px-3 py-1 rounded-lg">
                  <span className="material-symbols-outlined text-primary text-sm">schedule</span>
                  <span className="text-xs font-mono font-bold text-primary">{daysRemaining} Days to Exam</span>
                </div>
              </div>

              {/* Interactive Calendar UI */}
              <div className="bg-surface-container-low border border-outline-variant rounded-lg p-3.5">
                <div className="flex items-center justify-between mb-3 px-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-on-surface">November 2025</span>
                    <span className="text-[11px] font-mono text-secondary px-1.5 py-0.5 bg-surface-container rounded border border-outline-variant">
                      Q4 Term
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button className="w-7 h-7 rounded border border-outline-variant hover:bg-surface-container flex items-center justify-center text-on-surface-variant">
                      <span className="material-symbols-outlined text-sm">chevron_left</span>
                    </button>
                    <button className="w-7 h-7 rounded border border-outline-variant hover:bg-surface-container flex items-center justify-center text-on-surface-variant">
                      <span className="material-symbols-outlined text-sm">chevron_right</span>
                    </button>
                  </div>
                </div>

                {/* Weekday headers */}
                <div className="grid grid-cols-7 text-center font-mono text-[10px] text-secondary mb-2">
                  <span>SU</span>
                  <span>MO</span>
                  <span>TU</span>
                  <span>WE</span>
                  <span>TH</span>
                  <span>FR</span>
                  <span>SA</span>
                </div>

                {/* Month Days Matrix */}
                <div className="grid grid-cols-7 gap-1 text-xs font-mono text-center">
                  <span className="py-1.5 text-outline/50">26</span>
                  <span className="py-1.5 text-outline/50">27</span>
                  <span className="py-1.5 text-outline/50">28</span>
                  <span className="py-1.5 text-outline/50">29</span>
                  <span className="py-1.5 text-outline/50">30</span>
                  <span className="py-1.5 text-outline/50">31</span>
                  {[...Array(30)].map((_, i) => {
                    const dayNum = i + 1;
                    const isSelected = selectedDay === dayNum;
                    const isToday = dayNum === 17;
                    return (
                      <button
                        key={dayNum}
                        onClick={() => handleDayClick(dayNum)}
                        className={`py-1.5 rounded transition-all cursor-pointer relative ${
                          isSelected
                            ? 'bg-primary text-on-primary font-bold shadow-[0_0_8px_rgba(167,139,250,0.6)] ring-2 ring-primary/40'
                            : isToday
                            ? 'text-on-surface bg-surface-container-high border border-outline font-bold'
                            : 'text-on-surface-variant hover:bg-surface-container'
                        }`}
                      >
                        {dayNum < 10 ? '0' + dayNum : dayNum}
                        {isSelected && <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-tertiary"></span>}
                      </button>
                    );
                  })}
                  <span className="py-1.5 text-outline/50">01</span>
                  <span className="py-1.5 text-outline/50">02</span>
                  <span className="py-1.5 text-outline/50">03</span>
                  <span className="py-1.5 text-outline/50">04</span>
                  <span className="py-1.5 text-outline/50">05</span>
                  <span className="py-1.5 text-outline/50">06</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-secondary pt-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-primary"></span>
                  Selected: <strong className="text-on-surface font-mono">Friday, Nov {selectedDay}, 2025</strong>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-tertiary"></span>
                  Simulation Period: <span className="text-on-surface font-mono">Nov 23 - Nov {selectedDay - 1}</span>
                </span>
              </div>
            </div>

            {/* Target Score & Goal Calibration Card */}
            <div className="bg-surface-container border border-outline-variant rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono font-medium text-on-surface-variant uppercase tracking-wider flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[15px] text-primary">target</span>
                  Target Score & Competency Benchmark
                </label>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-surface-container-high border border-outline-variant text-primary font-bold">
                  {targetScore}+ / 96th Percentile
                </span>
              </div>

              {/* Slider Track */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-secondary font-mono">Pass / Baseline (490)</span>
                  <span className="text-secondary font-mono">Medians (504)</span>
                  <span className="text-primary font-mono font-semibold">Competitive ({targetScore})</span>
                  <span className="text-secondary font-mono">Max (528)</span>
                </div>
                <input
                  type="range"
                  min="480"
                  max="528"
                  value={targetScore}
                  onChange={(e) => setTargetScore(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-primary"
                />

                {/* Visual Percentile Tick Marks */}
                <div className="grid grid-cols-4 gap-2 pt-2">
                  <button
                    onClick={() => setTargetScore(503)}
                    className={`py-2 px-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      targetScore >= 500 && targetScore <= 505
                        ? 'border-primary bg-primary-container/10 ring-1 ring-primary/30'
                        : 'border-outline-variant bg-surface-container-low hover:border-outline'
                    }`}
                  >
                    <span className="block text-[10px] font-mono text-secondary">TIER 1</span>
                    <span className="text-xs font-semibold text-on-surface">500-505</span>
                    <span className="block text-[10px] text-secondary">55th %tile</span>
                  </button>

                  <button
                    onClick={() => setTargetScore(510)}
                    className={`py-2 px-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      targetScore >= 506 && targetScore <= 512
                        ? 'border-primary bg-primary-container/10 ring-1 ring-primary/30'
                        : 'border-outline-variant bg-surface-container-low hover:border-outline'
                    }`}
                  >
                    <span className="block text-[10px] font-mono text-secondary">TIER 2</span>
                    <span className="text-xs font-semibold text-on-surface">506-512</span>
                    <span className="block text-[10px] text-secondary">75th %tile</span>
                  </button>

                  <button
                    onClick={() => setTargetScore(518)}
                    className={`py-2 px-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      targetScore >= 513 && targetScore <= 520
                        ? 'border-primary bg-primary-container/10 ring-1 ring-primary/30'
                        : 'border-outline-variant bg-surface-container-low hover:border-outline'
                    }`}
                  >
                    <span className="block text-[10px] font-mono text-primary font-semibold">TIER 3 (CURRENT)</span>
                    <span className="text-xs font-bold text-on-surface">515-520</span>
                    <span className="block text-[10px] text-primary">96th %tile</span>
                  </button>

                  <button
                    onClick={() => setTargetScore(525)}
                    className={`py-2 px-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      targetScore >= 521
                        ? 'border-primary bg-primary-container/10 ring-1 ring-primary/30'
                        : 'border-outline-variant bg-surface-container-low hover:border-outline'
                    }`}
                  >
                    <span className="block text-[10px] font-mono text-secondary">TIER 4</span>
                    <span className="text-xs font-semibold text-on-surface">521-528</span>
                    <span className="block text-[10px] text-secondary">99th %tile</span>
                  </button>
                </div>
              </div>

              {/* Difficulty & Spaced Repetition Bias */}
              <div className="pt-3 border-t border-outline-variant">
                <label className="text-xs font-mono font-medium text-on-surface-variant uppercase tracking-wider block mb-2">
                  Algorithm Retention Mode
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label
                    onClick={() => setRetentionMode('aggressive')}
                    className={`relative flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      retentionMode === 'aggressive'
                        ? 'border-primary bg-surface-container-high'
                        : 'border-outline-variant bg-surface-container-low'
                    }`}
                  >
                    <input
                      type="radio"
                      name="retention_mode"
                      checked={retentionMode === 'aggressive'}
                      onChange={() => setRetentionMode('aggressive')}
                      className="mt-0.5 text-primary"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-on-surface">Aggressive Mastery</span>
                        <span className="text-[9px] font-mono px-1 rounded bg-primary-container text-on-primary-container font-semibold">
                          FSRS-4.5
                        </span>
                      </div>
                      <p className="text-[11px] text-on-surface-variant mt-0.5 leading-snug">
                        90% target retention rate with accelerated spaced-repetition decay compensation.
                      </p>
                    </div>
                  </label>

                  <label
                    onClick={() => setRetentionMode('balanced')}
                    className={`relative flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      retentionMode === 'balanced'
                        ? 'border-primary bg-surface-container-high'
                        : 'border-outline-variant bg-surface-container-low'
                    }`}
                  >
                    <input
                      type="radio"
                      name="retention_mode"
                      checked={retentionMode === 'balanced'}
                      onChange={() => setRetentionMode('balanced')}
                      className="mt-0.5 text-primary"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-on-surface">Balanced Retention</span>
                        <span className="text-[9px] font-mono px-1 rounded bg-secondary-container text-secondary-fixed">
                          STANDARD
                        </span>
                      </div>
                      <p className="text-[11px] text-on-surface-variant mt-0.5 leading-snug">
                        82% retention benchmark. Flattens daily card loads to prevent burnout.
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column / AI Ingestion & Pacing Preview (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            {/* Syllabus Parsed Yield Preview */}
            <div className="bg-surface-container border border-outline-variant rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-mono font-medium text-on-surface-variant uppercase tracking-wider flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[15px] text-tertiary">data_object</span>
                  Detected from Syllabus
                </h2>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-tertiary-container/30 text-tertiary border border-tertiary/20">
                  18 Modules Extracted
                </span>
              </div>
              <p className="text-xs text-on-surface-variant">
                Extracted high-yield domains from <span className="font-mono text-on-surface">MCAT_BioChem_Syllabus_2025.pdf</span>:
              </p>

              <div className="space-y-2.5">
                {/* Topic 1 */}
                <div className="p-2.5 rounded-lg bg-surface-container-low border border-outline-variant hover:border-outline transition-colors">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-on-surface">Cellular Energetics & Metabolism</span>
                    <span className="text-[11px] font-mono font-bold text-primary">Weight: 22%</span>
                  </div>
                  <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
                    <div className="bg-primary h-full rounded-full" style={{ width: '22%' }}></div>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-secondary mt-1.5">
                    <span>Glycolysis, Krebs, Oxidative Phosphorylation</span>
                    <span className="font-mono">5 Submodules</span>
                  </div>
                </div>

                {/* Topic 2 */}
                <div className="p-2.5 rounded-lg bg-surface-container-low border border-outline-variant hover:border-outline transition-colors">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-on-surface">Organic Reaction Mechanisms</span>
                    <span className="text-[11px] font-mono font-bold text-primary">Weight: 25%</span>
                  </div>
                  <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
                    <div className="bg-primary h-full rounded-full" style={{ width: '25%' }}></div>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-secondary mt-1.5">
                    <span>Nucleophilic Addition, Carbonyl Chemistry</span>
                    <span className="font-mono">6 Submodules</span>
                  </div>
                </div>

                {/* Topic 3 */}
                <div className="p-2.5 rounded-lg bg-surface-container-low border border-outline-variant hover:border-outline transition-colors">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-on-surface">Enzyme Kinetics & Catalysis</span>
                    <span className="text-[11px] font-mono font-bold text-primary">Weight: 18%</span>
                  </div>
                  <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
                    <div className="bg-primary h-full rounded-full" style={{ width: '18%' }}></div>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-secondary mt-1.5">
                    <span>Michaelis-Menten, Inhibition Profiles</span>
                    <span className="font-mono">4 Submodules</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-secondary">+ 3 remaining foundational modules (35%)</span>
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="text-[11px] font-mono text-primary hover:underline flex items-center gap-0.5"
                >
                  Inspect Full Hierarchy <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
                </button>
              </div>
            </div>

            {/* Pacing Projection Velocity Curve Card */}
            <div className="bg-surface-container border border-outline-variant rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-mono font-medium text-on-surface-variant uppercase tracking-wider flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[15px] text-primary">monitoring</span>
                  Pacing Projection
                </h2>
                <span className="text-xs font-mono font-bold text-tertiary">FEASIBLE (94% CONFIDENCE)</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-surface-container-low border border-outline-variant">
                  <span className="text-[10px] font-mono text-secondary uppercase">Recommended Pace</span>
                  <div className="text-xl font-bold font-headline text-on-surface mt-0.5">
                    ~3.4 <span className="text-xs font-normal text-secondary">hrs/day</span>
                  </div>
                  <span className="text-[10px] text-tertiary flex items-center gap-1 mt-1">
                    <span className="material-symbols-outlined text-[12px]">trending_up</span> Consistent trajectory
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-surface-container-low border border-outline-variant">
                  <span className="text-[10px] font-mono text-secondary uppercase">Daily Card Volume</span>
                  <div className="text-xl font-bold font-headline text-on-surface mt-0.5">
                    85 <span className="text-xs font-normal text-secondary">cards/day</span>
                  </div>
                  <span className="text-[10px] text-on-surface-variant flex items-center gap-1 mt-1">
                    <span className="material-symbols-outlined text-[12px]">refresh</span> With FSRS reviews
                  </span>
                </div>
              </div>

              {/* Velocity Sparkline Bars */}
              <div className="p-3 rounded-lg bg-surface-container-lowest border border-outline-variant space-y-2">
                <div className="flex justify-between items-center text-[10px] font-mono text-secondary">
                  <span>Velocity Curve Projection</span>
                  <span>Nov {selectedDay} Finish</span>
                </div>
                <div className="h-16 flex items-end gap-1.5 pt-2 px-1">
                  <div className="flex-1 bg-surface-container-high rounded-t hover:bg-primary transition-colors" style={{ height: '35%' }} title="Week 1: Core Fundamentals"></div>
                  <div className="flex-1 bg-surface-container-high rounded-t hover:bg-primary transition-colors" style={{ height: '48%' }} title="Week 2: Kinetics"></div>
                  <div className="flex-1 bg-surface-container-high rounded-t hover:bg-primary transition-colors" style={{ height: '62%' }} title="Week 3: Mechanisms"></div>
                  <div className="flex-1 bg-primary/70 rounded-t hover:bg-primary transition-colors" style={{ height: '78%' }} title="Week 4: Peak Repetition"></div>
                  <div className="flex-1 bg-primary rounded-t shadow-[0_0_8px_rgba(167,139,250,0.5)]" style={{ height: '92%' }} title="Week 5: Full Integration"></div>
                  <div className="flex-1 bg-tertiary/80 rounded-t hover:bg-tertiary transition-colors" style={{ height: '40%' }} title="Week 6: Taper & Diagnostic Sim"></div>
                </div>
                <div className="flex justify-between text-[9px] font-mono text-secondary pt-1 border-t border-outline-variant/40">
                  <span>W1 Intro</span>
                  <span>W3 Peak Volume</span>
                  <span className="text-tertiary">W6 Taper</span>
                </div>
              </div>

              {/* Emergency Buffer Notice */}
              <div className="p-3 rounded-lg bg-surface-container-low border border-tertiary/30 flex items-start gap-2.5">
                <span className="material-symbols-outlined text-tertiary text-base mt-0.5 shrink-0">verified_user</span>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  <strong className="text-on-surface">5-Day Simulation Buffer:</strong> Includes 5 full zero-new-content buffer days before Nov {selectedDay} allocated specifically for full-length simulation tests & deep mistake audits.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Sticky Bottom Footer */}
      <footer className="fixed bottom-0 left-0 w-full z-50 flex flex-col sm:flex-row justify-between items-center px-6 py-4 border-t border-outline-variant bg-surface-container-lowest backdrop-blur-lg bg-opacity-95 gap-3">
        <button
          onClick={() => onNavigate('step1-upload')}
          className="text-on-surface-variant hover:text-on-surface border border-outline-variant px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors duration-150 active:scale-[0.98]"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Back to Syllabus
        </button>

        <div className="hidden md:flex flex-col items-center text-center">
          <span className="text-xs font-mono text-on-surface font-semibold">Step 2 of 4: Exam Targets</span>
          <span className="text-[11px] text-secondary">Next: Weekly Availability & Study Bandwidth</span>
        </div>

        <button
          onClick={() => onNavigate('step3-bandwidth')}
          className="w-full sm:w-auto bg-primary text-on-primary font-medium px-5 py-2.5 rounded-lg text-sm flex items-center justify-center gap-2 hover:bg-primary-fixed hover:text-on-primary-fixed transition-all duration-150 shadow-[0_0_15px_rgba(167,139,250,0.25)] active:scale-[0.98]"
        >
          <span>Continue to Study Bandwidth</span>
          <span className="material-symbols-outlined text-sm font-bold">arrow_forward</span>
        </button>
      </footer>
    </div>
  );
};
