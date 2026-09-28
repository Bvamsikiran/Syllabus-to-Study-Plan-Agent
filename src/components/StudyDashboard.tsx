import React, { useState, useEffect } from 'react';
import { ScreenId, SyllabusModule } from '../types';

interface StudyDashboardProps {
  onNavigate: (screen: ScreenId) => void;
  modules: SyllabusModule[];
  setModules: React.Dispatch<React.SetStateAction<SyllabusModule[]>>;
}

export const StudyDashboard: React.FC<StudyDashboardProps> = ({ onNavigate, modules, setModules }) => {
  const [syllabusFilter, setSyllabusFilter] = useState<'all' | 'high-yield' | 'review'>('all');
  const [timelineFilter, setTimelineFilter] = useState<string>('all');
  const [showAddUnitModal, setShowAddUnitModal] = useState(false);
  const [newUnitTitle, setNewUnitTitle] = useState('');
  const [newUnitRef, setNewUnitRef] = useState('');

  // Pomodoro countdown timer state
  const [timerSeconds, setTimerSeconds] = useState(14 * 60 + 22); // 14:22 remaining
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    } else if (timerSeconds === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleToggleModule = (id: string) => {
    setModules((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const nextStatus = m.status === 'completed' ? 'in-progress' : m.status === 'in-progress' ? 'pending' : 'completed';
          const nextProgress = nextStatus === 'completed' ? 100 : nextStatus === 'in-progress' ? 50 : 0;
          return {
            ...m,
            status: nextStatus,
            progress: nextProgress,
            completedUnits: nextStatus === 'completed' ? m.totalUnits : nextStatus === 'in-progress' ? Math.floor(m.totalUnits / 2) : 0,
          };
        }
        return m;
      })
    );
  };

  const handleAddUnit = () => {
    if (newUnitTitle.trim()) {
      const newMod: SyllabusModule = {
        id: `custom-${Date.now()}`,
        name: newUnitTitle.trim(),
        submodulesCount: 4,
        weight: 12,
        topics: ['Custom Lecture Notes', 'High-Yield Drill'],
        completedUnits: 0,
        totalUnits: 4,
        reference: newUnitRef.trim() || 'Custom Reference',
        status: 'pending',
        progress: 0,
      };
      setModules([...modules, newMod]);
      setNewUnitTitle('');
      setNewUnitRef('');
      setShowAddUnitModal(false);
    }
  };

  const completedCount = modules.filter((m) => m.status === 'completed').length;
  const overallPercentage = Math.round((completedCount / modules.length) * 100) || 64;

  const filteredModules = modules.filter((m) => {
    if (syllabusFilter === 'high-yield') return m.weight >= 18;
    if (syllabusFilter === 'review') return m.status === 'in-progress';
    return true;
  });

  return (
    <div className="bg-background text-on-surface antialiased flex flex-col min-h-screen selection:bg-primary selection:text-on-primary font-body">
      {/* TOP NAVIGATION BAR */}
      <header className="w-full flex justify-between items-center px-4 py-2.5 h-14 bg-surface border-b border-outline-variant sticky top-0 z-40">
        <div className="flex items-center gap-5">
          <button onClick={() => onNavigate('landing')} className="flex items-center gap-2.5 cursor-pointer">
            <div className="w-8 h-8 rounded-lg bg-surface-container-high border border-outline-variant flex items-center justify-center text-primary shadow-inner">
              <span className="material-symbols-outlined text-xl">psychology</span>
            </div>
            <span className="text-lg font-headline font-bold text-on-surface tracking-tighter">Synapse AI</span>
          </button>
          <div className="h-4 w-px bg-outline-variant"></div>

          {/* Track Switcher */}
          <div className="flex items-center gap-2 bg-surface-container px-3 py-1.5 rounded-lg border border-outline-variant cursor-pointer hover:border-outline transition-colors text-xs font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tertiary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-tertiary"></span>
            </span>
            <span className="text-on-surface font-headline font-medium">
              MCAT Prep: Biological & Biochemical Foundations 2025
            </span>
            <span className="material-symbols-outlined text-sm text-on-surface-variant">expand_more</span>
          </div>
        </div>

        {/* Center Search Input */}
        <div className="hidden lg:flex items-center flex-1 max-w-md mx-6">
          <div className="relative w-full">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-base">
              search
            </span>
            <input
              type="text"
              placeholder="Search topics, resources, or notes..."
              className="w-full bg-surface-container border border-outline-variant text-xs text-on-surface placeholder:text-on-surface-variant/60 rounded-lg pl-9 pr-8 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition"
            />
            <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-on-surface-variant border border-outline-variant px-1.5 py-0.5 rounded bg-surface-container-high">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface-variant border border-outline-variant text-xs text-on-surface">
            <span className="material-symbols-outlined text-sm text-amber-400">local_fire_department</span>
            <span className="font-medium">Streak: 18 Days</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface-variant border border-outline-variant text-xs text-on-surface">
            <span className="material-symbols-outlined text-sm text-primary">schedule</span>
            <span className="text-on-surface-variant">Today's Goal:</span>
            <span className="text-primary font-mono font-medium">3.5h / 4.0h</span>
          </div>

          <button
            onClick={() => onNavigate('master-schedule')}
            className="hidden xl:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-outline-variant bg-surface-container text-xs font-medium text-on-surface hover:bg-surface-variant transition"
          >
            <span className="material-symbols-outlined text-sm">calendar_month</span>
            <span>Master Schedule</span>
          </button>

          <button
            onClick={() => onNavigate('voice-quiz')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-on-primary text-xs font-semibold hover:bg-opacity-90 active:scale-95 transition cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">bolt</span>
            <span>Focus Session</span>
          </button>

          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-primary-container to-tertiary-container border border-outline flex items-center justify-center text-[11px] font-bold text-on-surface ml-1">
            AV
          </div>
        </div>
      </header>

      {/* SUBHEADER */}
      <div className="w-full bg-surface-container-low border-b border-outline-variant px-6 flex items-center justify-between text-xs h-10">
        <div className="flex items-center space-x-6">
          <button className="text-primary border-b-2 border-primary font-medium py-2.5 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-base">school</span>
            MCAT Prep 2025
          </button>
          <button
            onClick={() => onNavigate('master-schedule')}
            className="text-on-surface-variant hover:text-on-surface py-2.5 font-normal transition flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-base">monitoring</span>
            Analytics
          </button>
          <button
            onClick={() => onNavigate('step4-resources')}
            className="text-on-surface-variant hover:text-on-surface py-2.5 font-normal transition flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-base">auto_stories</span>
            Resource Hub
          </button>
        </div>
        <div className="flex items-center gap-4 text-on-surface-variant font-mono text-[11px]">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span> Engine: Synapse FSRS-4.5
          </span>
          <span className="hidden md:inline text-outline">|</span>
          <span className="hidden md:inline">Sync Plan: Active (3m ago)</span>
        </div>
      </div>

      {/* THREE-COLUMN DASHBOARD CANVAS */}
      <main className="flex-1 w-full max-w-[1920px] mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ================= COLUMN A: LEFT SIDEBAR ================= */}
        <section className="lg:col-span-3 flex flex-col gap-4">
          <div className="glass-panel rounded-xl p-4 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-headline font-semibold text-on-surface tracking-tight flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-primary text-base">account_tree</span>
                  Syllabus Matrix & Mastery
                </h2>
                <p className="text-xs text-on-surface-variant mt-0.5">Foundations 2025 • Phase 2</p>
              </div>
              <span className="text-xs font-mono font-medium text-tertiary bg-tertiary-container/30 px-2 py-0.5 rounded border border-tertiary/20">
                {completedCount} / {modules.length} Done
              </span>
            </div>

            {/* Overall Progress */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] font-mono text-on-surface-variant">
                <span>Overall Module Completion</span>
                <span className="text-on-surface font-semibold">{overallPercentage}%</span>
              </div>
              <div className="w-full h-1.5 bg-surface-variant rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-tertiary rounded-full transition-all duration-300"
                  style={{ width: `${overallPercentage}%` }}
                ></div>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="grid grid-cols-3 gap-1 bg-surface-container p-1 rounded-lg border border-outline-variant text-[11px] font-medium text-center">
              <button
                onClick={() => setSyllabusFilter('all')}
                className={`py-1 rounded cursor-pointer transition ${
                  syllabusFilter === 'all' ? 'bg-surface-variant text-on-surface shadow-sm font-bold' : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                All ({modules.length})
              </button>
              <button
                onClick={() => setSyllabusFilter('high-yield')}
                className={`py-1 rounded cursor-pointer transition ${
                  syllabusFilter === 'high-yield' ? 'bg-surface-variant text-on-surface shadow-sm font-bold' : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                High-Yield
              </button>
              <button
                onClick={() => setSyllabusFilter('review')}
                className={`py-1 rounded cursor-pointer transition ${
                  syllabusFilter === 'review' ? 'bg-surface-variant text-on-surface shadow-sm font-bold' : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Review (3)
              </button>
            </div>

            {/* Topic List */}
            <div className="flex flex-col gap-2.5 max-h-[580px] overflow-y-auto pr-1">
              {filteredModules.map((mod) => {
                const isCompleted = mod.status === 'completed';
                const isTodayActive = mod.id === 'm4';

                return (
                  <div
                    key={mod.id}
                    onClick={() => handleToggleModule(mod.id)}
                    className={`p-2.5 rounded-lg border transition group cursor-pointer relative ${
                      isTodayActive
                        ? 'bg-surface-variant border-primary/50 shadow-sm'
                        : isCompleted
                        ? 'bg-surface-container border-outline-variant hover:border-outline'
                        : 'bg-surface-container/70 border-outline-variant hover:border-outline'
                    }`}
                  >
                    {isTodayActive && (
                      <div className="absolute -top-1.5 -right-1 px-1.5 py-0.2 bg-primary text-on-primary text-[9px] font-semibold rounded uppercase tracking-wider">
                        Active Today
                      </div>
                    )}

                    <div className="flex items-start gap-2.5">
                      <div
                        className={`w-4 h-4 rounded flex items-center justify-center mt-0.5 border ${
                          isCompleted
                            ? 'bg-tertiary/10 border-tertiary text-tertiary'
                            : isTodayActive
                            ? 'border-primary'
                            : 'bg-surface-variant border-outline text-transparent'
                        }`}
                      >
                        {isCompleted ? (
                          <span className="material-symbols-outlined text-xs font-bold">check</span>
                        ) : isTodayActive ? (
                          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                        ) : (
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <h3
                            className={`text-xs font-medium truncate transition ${
                              isTodayActive ? 'text-primary font-bold' : 'text-on-surface group-hover:text-primary'
                            }`}
                          >
                            {mod.name}
                          </h3>
                          <span
                            className={`text-[10px] font-mono ${
                              isCompleted ? 'text-tertiary font-bold' : isTodayActive ? 'text-primary font-bold' : 'text-on-surface-variant'
                            }`}
                          >
                            {mod.progress}%
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-[10px] text-on-surface-variant">
                          <span className={isCompleted ? 'text-tertiary font-mono' : 'text-primary font-mono'}>
                            {mod.completedUnits}/{mod.totalUnits} units
                          </span>
                          <span>•</span>
                          <span className="truncate">{mod.reference}</span>
                        </div>
                        <div className="w-full h-1 bg-surface-variant rounded-full mt-2 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${isCompleted ? 'bg-tertiary' : 'bg-primary'}`}
                            style={{ width: `${mod.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Actions */}
            <div className="pt-2 border-t border-outline-variant flex items-center justify-between gap-2">
              <button
                onClick={() => setShowAddUnitModal(true)}
                className="flex-1 py-1.5 px-2 rounded-lg border border-outline-variant bg-surface-container hover:bg-surface-variant text-[11px] font-medium text-on-surface flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm text-primary">add</span>
                <span>Add Custom Unit</span>
              </button>
              <button
                onClick={() => onNavigate('step1-upload')}
                className="py-1.5 px-2 rounded-lg border border-outline-variant bg-surface-container hover:bg-surface-variant text-on-surface-variant hover:text-on-surface text-[11px] flex items-center justify-center transition"
                title="Re-parse Syllabus"
              >
                <span className="material-symbols-outlined text-sm">cloud_sync</span>
              </button>
            </div>
          </div>
        </section>

        {/* ================= COLUMN B: CENTER AREA ================= */}
        <section className="lg:col-span-6 flex flex-col gap-4">
          {/* Timeline Header & Controls */}
          <div className="glass-panel rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-headline font-bold text-on-surface tracking-tight">Weekly Pacing Schedule</h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-primary-container/40 text-on-primary-container border border-primary/30">
                  Target: 28 hrs
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1 text-xs text-on-surface-variant">
                <span className="font-mono text-on-surface font-medium">Oct 20 – Oct 26, 2025</span>
                <span>•</span>
                <span>Phase 2: High-Yield Consolidation</span>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start md:self-auto">
              <div className="flex items-center bg-surface-container border border-outline-variant rounded-lg p-0.5 text-xs font-medium">
                <button className="bg-surface-variant text-primary px-2.5 py-1 rounded shadow-sm flex items-center gap-1 font-bold">
                  <span className="material-symbols-outlined text-sm">view_week</span>
                  <span>Week</span>
                </button>
                <button
                  onClick={() => onNavigate('master-schedule')}
                  className="text-on-surface-variant hover:text-on-surface px-2.5 py-1 rounded transition flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">view_day</span>
                  <span>Day</span>
                </button>
              </div>
              <div className="flex items-center border border-outline-variant bg-surface-container rounded-lg">
                <button className="p-1 text-on-surface-variant hover:text-on-surface transition">
                  <span className="material-symbols-outlined text-base">chevron_left</span>
                </button>
                <button className="p-1 text-on-surface-variant hover:text-on-surface transition">
                  <span className="material-symbols-outlined text-base">chevron_right</span>
                </button>
              </div>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-[11px] text-on-surface-variant font-medium flex items-center gap-1 pl-1">
              <span className="material-symbols-outlined text-sm">filter_list</span> Filter:
            </span>
            <button
              onClick={() => setTimelineFilter('all')}
              className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition cursor-pointer ${
                timelineFilter === 'all'
                  ? 'bg-primary/20 border border-primary/40 text-primary font-bold'
                  : 'bg-surface-container border border-outline-variant text-on-surface-variant'
              }`}
            >
              All Subjects
            </button>
            <button
              onClick={() => setTimelineFilter('biochem')}
              className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition cursor-pointer ${
                timelineFilter === 'biochem'
                  ? 'bg-primary/20 border border-primary/40 text-primary font-bold'
                  : 'bg-surface-container border border-outline-variant text-on-surface-variant'
              }`}
            >
              Biochem & Cell
            </button>
            <button
              onClick={() => setTimelineFilter('organ')}
              className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition cursor-pointer ${
                timelineFilter === 'organ'
                  ? 'bg-primary/20 border border-primary/40 text-primary font-bold'
                  : 'bg-surface-container border border-outline-variant text-on-surface-variant'
              }`}
            >
              Organ Systems
            </button>
            <button
              onClick={() => setTimelineFilter('uworld')}
              className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition cursor-pointer ${
                timelineFilter === 'uworld'
                  ? 'bg-primary/20 border border-primary/40 text-primary font-bold'
                  : 'bg-surface-container border border-outline-variant text-on-surface-variant'
              }`}
            >
              UWorld QBank
            </button>
          </div>

          {/* Calendar Cards */}
          <div className="flex flex-col gap-3">
            {/* Mon Oct 20 */}
            <div className="glass-panel rounded-xl p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 border-l-4 border-l-tertiary">
              <div className="flex items-center gap-3">
                <div className="text-center w-14 py-1 rounded bg-surface-container border border-outline-variant">
                  <span className="text-[10px] text-on-surface-variant font-mono uppercase block">Mon</span>
                  <span className="text-sm font-bold text-on-surface">Oct 20</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-on-surface">Glycolysis & Pentose Phosphate Pathway</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-tertiary-container/30 text-tertiary border border-tertiary/20">
                      Done ✓
                    </span>
                  </div>
                  <p className="text-[11px] text-on-surface-variant mt-0.5">3.5 hrs completed • 100% mastery score achieved</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-1 rounded bg-surface-container border border-outline-variant text-[11px] text-on-surface-variant flex items-center gap-1 font-mono">
                  <span className="material-symbols-outlined text-xs text-tertiary">menu_book</span> Kaplan Ch. 1-2
                </span>
                <span className="px-2 py-1 rounded bg-surface-container border border-outline-variant text-[11px] text-on-surface-variant flex items-center gap-1 font-mono">
                  <span className="material-symbols-outlined text-xs text-primary">quiz</span> 30 Qs (87%)
                </span>
              </div>
            </div>

            {/* Tue Oct 21 */}
            <div className="glass-panel rounded-xl p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 border-l-4 border-l-tertiary">
              <div className="flex items-center gap-3">
                <div className="text-center w-14 py-1 rounded bg-surface-container border border-outline-variant">
                  <span className="text-[10px] text-on-surface-variant font-mono uppercase block">Tue</span>
                  <span className="text-sm font-bold text-on-surface">Oct 21</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-on-surface">Michaelis-Menten Kinetics & Lineweaver-Burk</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-tertiary-container/30 text-tertiary border border-tertiary/20">
                      Done ✓
                    </span>
                  </div>
                  <p className="text-[11px] text-on-surface-variant mt-0.5">4.0 hrs completed • Km / Vmax calculations mastered</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-1 rounded bg-surface-container border border-outline-variant text-[11px] text-on-surface-variant flex items-center gap-1 font-mono">
                  <span className="material-symbols-outlined text-xs text-primary">smart_display</span> Ninja Nerd (55m)
                </span>
                <span className="px-2 py-1 rounded bg-surface-container border border-outline-variant text-[11px] text-on-surface-variant flex items-center gap-1 font-mono">
                  <span className="material-symbols-outlined text-xs text-amber-400">style</span> 120 Anki Cards
                </span>
              </div>
            </div>

            {/* Wed Oct 22 • TODAY (Hero Highlighted Card) */}
            <div className="glass-panel rounded-xl p-4 border border-primary ring-1 ring-primary/40 bg-surface-container/90 relative overflow-hidden shadow-xl">
              <div className="absolute -top-12 -right-12 w-44 h-44 bg-primary/10 rounded-full blur-2xl pointer-events-none"></div>

              {/* Status Header */}
              <div className="flex items-center justify-between pb-3 border-b border-outline-variant">
                <div className="flex items-center gap-2.5">
                  <div className="text-center w-14 py-1 rounded bg-primary/20 border border-primary text-primary">
                    <span className="text-[10px] font-mono uppercase block font-semibold">Today</span>
                    <span className="text-base font-extrabold">Oct 22</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-on-surface">Active Focus: Nucleic Acid Structure & Replication</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary text-on-primary animate-pulse">
                        IN PROGRESS
                      </span>
                    </div>
                    <p className="text-xs text-on-surface-variant mt-0.5">Assigned Target: 4.0 hrs • Next block in 24 mins</p>
                  </div>
                </div>
                <div className="text-right hidden sm:block">
                  <span className="text-[11px] font-mono text-tertiary flex items-center justify-end gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span> 2.5h / 4.0h Completed
                  </span>
                  <span className="text-[10px] text-on-surface-variant">62% daily pacing achieved</span>
                </div>
              </div>

              {/* Tasks List */}
              <div className="py-3 flex flex-col gap-2.5">
                <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-surface-variant/80 border border-outline-variant">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-tertiary text-sm">check_circle</span>
                    <span className="text-on-surface line-through opacity-70">
                      DNA Polymerase III vs I & Telomerase Mechanisms
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-tertiary">1.2 hrs ✓</span>
                </div>

                <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-surface-container border border-primary/40">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-sm animate-spin">progress_activity</span>
                    <span className="text-on-surface font-medium">UWorld 40 Qs: Replication Forks & Proofreading</span>
                  </div>
                  <span className="text-[10px] font-mono text-primary font-bold">1.3 hrs remaining</span>
                </div>

                <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-surface-container/60 border border-outline-variant opacity-80">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-on-surface-variant text-sm">radio_button_unchecked</span>
                    <span className="text-on-surface">Evening Review: MileDown Anki Nucleic Deck (150 cards)</span>
                  </div>
                  <span className="text-[10px] font-mono text-on-surface-variant">0.5 hrs</span>
                </div>
              </div>

              {/* Resource Links & Action */}
              <div className="pt-2 border-t border-outline-variant flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="px-2.5 py-1 rounded-md bg-surface-variant border border-outline-variant text-[11px] text-primary flex items-center gap-1.5 font-mono">
                    <span className="material-symbols-outlined text-xs">auto_stories</span> Kaplan Ch. 4 (pp. 82-114)
                  </span>
                  <button
                    onClick={() => onNavigate('handwritten-analysis')}
                    className="px-2.5 py-1 rounded-md bg-surface-variant hover:bg-surface-container-high border border-outline-variant text-[11px] text-tertiary flex items-center gap-1.5 font-mono cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-xs">draw</span> Mechanism Practice
                  </button>
                  <button
                    onClick={() => onNavigate('voice-quiz')}
                    className="px-2.5 py-1 rounded-md bg-surface-variant hover:bg-surface-container-high border border-outline-variant text-[11px] text-amber-400 flex items-center gap-1.5 font-mono cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-xs">mic</span> Voice Recall Sprint
                  </button>
                </div>

                <button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className="px-3 py-1 rounded-lg bg-primary text-on-primary text-xs font-semibold hover:bg-opacity-90 flex items-center gap-1 transition cursor-pointer"
                >
                  <span className="material-symbols-outlined text-xs">{isTimerRunning ? 'pause' : 'play_arrow'}</span>
                  <span>{isTimerRunning ? 'Pause Study' : 'Resume Study'}</span>
                </button>
              </div>
            </div>

            {/* Thu Oct 23 */}
            <div className="glass-panel rounded-xl p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 border-l-4 border-l-outline">
              <div className="flex items-center gap-3">
                <div className="text-center w-14 py-1 rounded bg-surface-container border border-outline-variant">
                  <span className="text-[10px] text-on-surface-variant font-mono uppercase block">Thu</span>
                  <span className="text-sm font-semibold text-on-surface">Oct 23</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-on-surface">Eukaryotic Transcription, Lac Operon & Trp Operon</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface-variant text-on-surface-variant border border-outline-variant">
                      Planned
                    </span>
                  </div>
                  <p className="text-[11px] text-on-surface-variant mt-0.5">3.5 hrs allocated • High-Yield Molecular Biology</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-1 rounded bg-surface-container border border-outline-variant text-[11px] text-on-surface-variant flex items-center gap-1 font-mono">
                  <span className="material-symbols-outlined text-xs text-primary">play_circle</span> Ninja Nerd Operons (45m)
                </span>
                <span className="px-2 py-1 rounded bg-surface-container border border-outline-variant text-[11px] text-on-surface-variant flex items-center gap-1 font-mono">
                  <span className="material-symbols-outlined text-xs">quiz</span> Khan Academy Passages
                </span>
              </div>
            </div>

            {/* Fri Oct 24 */}
            <div className="glass-panel rounded-xl p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 border-l-4 border-l-outline">
              <div className="flex items-center gap-3">
                <div className="text-center w-14 py-1 rounded bg-surface-container border border-outline-variant">
                  <span className="text-[10px] text-on-surface-variant font-mono uppercase block">Fri</span>
                  <span className="text-sm font-semibold text-on-surface">Oct 24</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-on-surface">
                      Membrane Potential, Nernst Equation & Synaptic Trans
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface-variant text-on-surface-variant border border-outline-variant">
                      Planned
                    </span>
                  </div>
                  <p className="text-[11px] text-on-surface-variant mt-0.5">3.5 hrs allocated • Physiology & Physics Cross-link</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-1 rounded bg-surface-container border border-outline-variant text-[11px] text-on-surface-variant flex items-center gap-1 font-mono">
                  <span className="material-symbols-outlined text-xs text-tertiary">menu_book</span> Kaplan Phys Ch. 4
                </span>
                <span className="px-2 py-1 rounded bg-surface-container border border-outline-variant text-[11px] text-on-surface-variant flex items-center gap-1 font-mono">
                  <span className="material-symbols-outlined text-xs">calculate</span> Goldman-Hodgkin Solver
                </span>
              </div>
            </div>

            {/* Sat Oct 25 */}
            <div className="glass-panel rounded-xl p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 border-l-4 border-l-primary-container bg-surface-container-high/60">
              <div className="flex items-center gap-3">
                <div className="text-center w-14 py-1 rounded bg-primary-container/20 border border-primary-container text-on-primary-container">
                  <span className="text-[10px] font-mono uppercase block font-bold">Sat</span>
                  <span className="text-sm font-extrabold text-on-surface">Oct 25</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-on-surface">Full-Length Simulation Exam (AAMC FL 1)</span>
                    <span className="text-[10px] px-2 py-0.5 rounded font-mono font-semibold bg-primary-container text-on-primary-container">
                      MILESTONE SIMULATION
                    </span>
                  </div>
                  <p className="text-[11px] text-on-surface-variant mt-0.5">7.5 hrs timed block • 8:00 AM start • Full test-day condition mimic</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded bg-surface-container border border-outline-variant text-[11px] text-primary font-mono flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">timer</span> 230 Questions
                </span>
                <button
                  onClick={() => onNavigate('handwritten-analysis')}
                  className="px-3 py-1 rounded bg-surface-variant border border-outline hover:border-primary text-xs text-on-surface transition cursor-pointer"
                >
                  Setup Lockdown
                </button>
              </div>
            </div>

            {/* Sun Oct 26 */}
            <div className="glass-panel rounded-xl p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 border-l-4 border-l-secondary-fixed-dim">
              <div className="flex items-center gap-3">
                <div className="text-center w-14 py-1 rounded bg-surface-container border border-outline-variant">
                  <span className="text-[10px] text-on-surface-variant font-mono uppercase block">Sun</span>
                  <span className="text-sm font-semibold text-on-surface">Oct 26</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-on-surface">Adaptive Buffer & Knowledge Decay Audit</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface-container-high text-tertiary border border-tertiary/20">
                      Buffer & Rest
                    </span>
                  </div>
                  <p className="text-[11px] text-on-surface-variant mt-0.5">3.0 hrs allocated • Remediation of missed FL1 questions & resting</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 rounded bg-surface-container border border-outline-variant text-[11px] text-on-surface-variant flex items-center gap-1 font-mono">
                  <span className="material-symbols-outlined text-xs text-tertiary">healing</span> FSRS Decay Fix
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ================= COLUMN C: RIGHT PANEL ================= */}
        <section className="lg:col-span-3 flex flex-col gap-4">
          {/* 1. Mastery Ring Widget */}
          <div className="glass-panel rounded-xl p-4 flex flex-col items-center text-center relative overflow-hidden">
            <div className="w-full flex items-center justify-between pb-2 mb-2 border-b border-outline-variant">
              <span className="text-xs font-headline font-semibold text-on-surface flex items-center gap-1">
                <span className="material-symbols-outlined text-primary text-sm">donut_large</span> Mastery Index
              </span>
              <span className="text-[10px] font-mono text-tertiary">+4.2% this wk</span>
            </div>

            {/* SVG Circular Progress Ring */}
            <div className="relative w-40 h-40 my-2 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" fill="none" r="50" stroke="#18181b" strokeWidth="9"></circle>
                <circle
                  cx="60"
                  cy="60"
                  fill="none"
                  r="50"
                  stroke="#27272a"
                  strokeDasharray="314.15"
                  strokeDashoffset="31.4"
                  strokeLinecap="round"
                  strokeWidth="9"
                ></circle>
                <circle
                  cx="60"
                  cy="60"
                  fill="none"
                  r="50"
                  stroke="url(#primaryGradientDash)"
                  strokeDasharray="314.15"
                  strokeDashoffset="100.5"
                  strokeLinecap="round"
                  strokeWidth="9"
                ></circle>
                <defs>
                  <linearGradient id="primaryGradientDash" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#a78bfa"></stop>
                    <stop offset="100%" stopColor="#34d399"></stop>
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-extrabold font-headline tracking-tighter text-on-surface">68%</span>
                <span className="text-[10px] font-mono uppercase tracking-wider text-on-surface-variant">Syllabus Mastered</span>
              </div>
            </div>

            <p className="text-xs text-on-surface-variant font-body">
              Target: <span className="text-on-surface font-semibold">90%</span> by exam date
            </p>
            <div className="w-full mt-3 pt-3 border-t border-outline-variant flex items-center justify-between text-[11px] font-mono">
              <span className="text-on-surface-variant">FSRS Retention Rate</span>
              <span className="text-tertiary font-bold">94.2%</span>
            </div>
          </div>

          {/* 2. Exam Countdown */}
          <div className="glass-panel rounded-xl p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-on-surface flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary text-sm">alarm</span> Official Exam Day
              </span>
              <span className="text-[10px] font-mono text-on-surface-variant">Nov 28, 2025</span>
            </div>
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-3xl font-black font-headline tracking-tight text-on-surface">32</span>
                <span className="text-sm font-semibold text-primary ml-1">Days Remaining</span>
              </div>
              <span className="text-xs font-mono text-tertiary bg-tertiary-container/30 border border-tertiary/20 px-2 py-0.5 rounded">
                MCAT 518+ Goal
              </span>
            </div>
            <div className="space-y-1">
              <div className="w-full h-2 bg-surface-variant rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary via-primary to-amber-400 rounded-full" style={{ width: '74%' }}></div>
              </div>
              <div className="flex justify-between text-[10px] font-mono text-on-surface-variant">
                <span>Day 88 / 120</span>
                <span>73.3% Timeline Elapsed</span>
              </div>
            </div>
          </div>

          {/* 3. Hours Studied Telemetry */}
          <div className="glass-panel rounded-xl p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-on-surface flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary text-sm">timer</span> Hours Studied Telemetry
              </span>
              <span className="text-[10px] font-mono text-tertiary">+2.0h ahead</span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-2.5 rounded-lg bg-surface-container border border-outline-variant">
                <span className="text-[10px] text-on-surface-variant block font-mono">Logged Total</span>
                <span className="text-lg font-bold font-mono text-on-surface">
                  64.5<span className="text-xs font-normal text-on-surface-variant">h</span>
                </span>
                <span className="text-[9px] text-on-surface-variant block">of 95.0h Target Pace</span>
              </div>
              <div className="p-2.5 rounded-lg bg-surface-container border border-outline-variant">
                <span className="text-[10px] text-on-surface-variant block font-mono">This Week</span>
                <span className="text-lg font-bold font-mono text-primary">
                  18.5<span className="text-xs font-normal text-on-surface-variant">h</span>
                </span>
                <span className="text-[9px] text-tertiary block">Velocity: 3.7h / day</span>
              </div>
            </div>

            {/* Velocity Histogram */}
            <div className="flex items-end gap-1.5 h-12 pt-2 border-t border-outline-variant">
              <div className="flex-1 bg-surface-variant rounded-t h-8" title="Mon: 3.5h"></div>
              <div className="flex-1 bg-surface-variant rounded-t h-10" title="Tue: 4.0h"></div>
              <div className="flex-1 bg-primary rounded-t shadow-sm shadow-primary/20 h-7 relative" title="Wed (Today): 2.5h">
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-primary animate-ping"></div>
              </div>
              <div className="flex-1 bg-surface-variant/40 rounded-t h-9 border-t border-dashed border-outline-variant" title="Thu: 3.5h"></div>
              <div className="flex-1 bg-surface-variant/40 rounded-t h-9 border-t border-dashed border-outline-variant" title="Fri: 3.5h"></div>
              <div className="flex-1 bg-surface-variant/40 rounded-t h-12 border-t border-dashed border-outline-variant" title="Sat: 7.5h"></div>
              <div className="flex-1 bg-surface-variant/40 rounded-t h-6 border-t border-dashed border-outline-variant" title="Sun: 3.0h"></div>
            </div>
            <div className="flex justify-between text-[9px] font-mono text-on-surface-variant">
              <span>M</span>
              <span>T</span>
              <span className="text-primary font-bold">W</span>
              <span>T</span>
              <span>F</span>
              <span>S</span>
              <span>S</span>
            </div>
          </div>

          {/* 4. Topics Breakdown */}
          <div className="glass-panel rounded-xl p-4 flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-on-surface flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary text-sm">checklist</span> Topics Mastered
              </span>
              <span className="text-xs font-mono font-bold text-on-surface">
                {completedCount} / {modules.length}
              </span>
            </div>
            <div className="space-y-1.5 text-[11px]">
              <div className="flex justify-between items-center py-1 border-b border-outline-variant/60">
                <span className="text-on-surface-variant flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded bg-tertiary"></span> Core Foundational
                </span>
                <span className="font-mono text-on-surface font-medium">{completedCount} Completed</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-outline-variant/60">
                <span className="text-on-surface-variant flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded bg-primary"></span> High-Yield Clinical
                </span>
                <span className="font-mono text-on-surface font-medium">6 Completed</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-on-surface-variant flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded bg-outline"></span> Remaining Syllabus
                </span>
                <span className="font-mono text-on-surface-variant font-medium">
                  {modules.length - completedCount} Pending
                </span>
              </div>
            </div>
          </div>

          {/* 5. Spaced Repetition Queue */}
          <div className="glass-panel rounded-xl p-4 flex flex-col gap-3 border border-primary/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-surface-variant border border-outline-variant flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-sm">sync_alt</span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-on-surface">Spaced Repetition Queue</h4>
                  <p className="text-[10px] text-on-surface-variant font-mono">FSRS Interval Algorithm</p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-primary px-2 py-0.5 rounded bg-primary/10 border border-primary/20">
                85 Due
              </span>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => onNavigate('voice-quiz')}
                className="flex-1 py-1.5 px-2 rounded-lg bg-primary hover:bg-opacity-90 text-on-primary text-xs font-semibold flex items-center justify-center gap-1 transition cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">bolt</span>
                <span>Review Sprint</span>
              </button>
              <button
                onClick={() => alert('Synced 85 review cards to your local memory cache!')}
                className="py-1.5 px-3 rounded-lg bg-surface-container border border-outline-variant hover:bg-surface-variant text-on-surface text-xs font-medium flex items-center gap-1 transition cursor-pointer"
                title="Sync with Anki Mobile"
              >
                <span className="material-symbols-outlined text-sm">refresh</span>
                <span>Sync</span>
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* QUICK STUDY BAR / ACTIVE TIMER DOCK */}
      <footer className="w-full bg-surface-container-low border-t border-outline-variant px-6 py-2 flex items-center justify-between text-xs sticky bottom-0 z-30">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
            <span className="text-on-surface font-medium font-headline">Active Block:</span>
            <span className="text-on-surface-variant truncate max-w-xs">
              Nucleic Acid Structure & Replication (Kaplan Ch. 4)
            </span>
          </div>
          <span className="hidden md:inline text-outline">|</span>
          <div className="hidden md:flex items-center gap-2 text-on-surface-variant font-mono text-[11px]">
            <span>Pomodoro: 25m focus</span>
            <span className="text-tertiary font-bold">{formatTimer(timerSeconds)} remaining</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsTimerRunning(!isTimerRunning)}
            className="p-1 text-on-surface-variant hover:text-on-surface transition cursor-pointer"
            title={isTimerRunning ? 'Pause Timer' : 'Play Timer'}
          >
            <span className="material-symbols-outlined text-lg">{isTimerRunning ? 'pause' : 'play_arrow'}</span>
          </button>
          <button
            onClick={() => setTimerSeconds(25 * 60)}
            className="p-1 text-on-surface-variant hover:text-on-surface transition cursor-pointer"
            title="Reset Session"
          >
            <span className="material-symbols-outlined text-lg">restart_alt</span>
          </button>
          <button
            onClick={() => onNavigate('voice-quiz')}
            className="px-2.5 py-1 rounded bg-surface-variant hover:bg-surface-container-high border border-outline-variant text-[11px] font-mono text-primary transition cursor-pointer"
          >
            Mini-Player ⇱
          </button>
        </div>
      </footer>

      {/* Add Custom Unit Modal */}
      {showAddUnitModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container border border-outline-variant p-6 rounded-xl max-w-md w-full shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-outline-variant pb-2">
              <h3 className="font-bold text-sm text-on-surface">Add Custom Syllabus Unit</h3>
              <button onClick={() => setShowAddUnitModal(false)} className="text-secondary hover:text-white">
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>
            <div>
              <label className="text-xs text-secondary font-mono block mb-1">Unit Title</label>
              <input
                type="text"
                placeholder="e.g., Immunoglobulin Gene Rearrangements & Somatic Hypermutation"
                value={newUnitTitle}
                onChange={(e) => setNewUnitTitle(e.target.value)}
                className="w-full bg-surface-container-lowest border border-outline-variant text-xs p-2.5 rounded text-on-surface outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="text-xs text-secondary font-mono block mb-1">Assigned Resource / Reference</label>
              <input
                type="text"
                placeholder="e.g., Janeway Ch. 5 / UWorld Qs"
                value={newUnitRef}
                onChange={(e) => setNewUnitRef(e.target.value)}
                className="w-full bg-surface-container-lowest border border-outline-variant text-xs p-2.5 rounded text-on-surface outline-none focus:border-primary"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowAddUnitModal(false)}
                className="px-3 py-1.5 rounded border border-outline-variant text-xs text-secondary hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleAddUnit}
                className="px-4 py-1.5 rounded bg-primary text-on-primary text-xs font-bold hover:bg-primary-fixed cursor-pointer"
              >
                Add Unit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
