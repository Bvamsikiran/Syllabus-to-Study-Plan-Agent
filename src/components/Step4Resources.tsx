import React, { useState } from 'react';
import { ScreenId, ResourceItem } from '../types';

interface Step4ResourcesProps {
  onNavigate: (screen: ScreenId) => void;
  resources: ResourceItem[];
  setResources: React.Dispatch<React.SetStateAction<ResourceItem[]>>;
}

export const Step4Resources: React.FC<Step4ResourcesProps> = ({ onNavigate, resources, setResources }) => {
  const [activeCategory, setActiveCategory] = useState<string>('Textbook / Book');
  const [resourceInput, setResourceInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const categories = [
    { label: 'Textbook / Book', icon: 'auto_stories' },
    { label: 'Question Bank', icon: 'quiz' },
    { label: 'Video Course / Lecture', icon: 'smart_display' },
    { label: 'Notes / Anki Deck', icon: 'style' },
    { label: 'Practice Exam / Paper', icon: 'fact_check' },
  ];

  const suggestions = [
    { name: 'UWorld Question Bank', type: 'Question Bank' as const, meta: '2,100 Questions', role: 'Primary Core' as const },
    { name: 'Kaplan 2025 MCAT Review', type: 'Textbook / Book' as const, meta: '450 Pages', role: 'Primary Core' as const },
    { name: 'Anki MileDown Deck', type: 'Notes / Anki Deck' as const, meta: '2,800 Cards', role: 'Spaced Practice' as const },
    { name: 'Khan Academy Med Video Library', type: 'Video Course / Lecture' as const, meta: '32 Hours', role: 'Supplemental' as const },
    { name: 'AAMC Section Bank', type: 'Question Bank' as const, meta: '300 High-Yield Passages', role: 'Benchmark Core' as const },
  ];

  const handleAddResource = () => {
    if (resourceInput.trim()) {
      const newItem: ResourceItem = {
        id: `res-${Date.now()}`,
        title: resourceInput.trim(),
        type: activeCategory as any,
        meta: `${activeCategory} • Custom Attachment`,
        mappedInfo: 'Mapped: High-Yield',
        role: 'Primary Core',
        assignedWeeks: 'Integrated into upcoming study sprint',
      };
      setResources([newItem, ...resources]);
      setResourceInput('');
    }
  };

  const addSuggestion = (s: typeof suggestions[0]) => {
    const exists = resources.some((r) => r.title.toLowerCase().includes(s.name.toLowerCase()));
    if (!exists) {
      const newItem: ResourceItem = {
        id: `res-${Date.now()}`,
        title: s.name,
        type: s.type,
        meta: s.meta,
        mappedInfo: 'Mapped: Core Module',
        role: s.role,
        assignedWeeks: 'Auto-balanced across remaining review weeks',
      };
      setResources([...resources, newItem]);
    }
  };

  const removeResource = (id: string) => {
    setResources(resources.filter((r) => r.id !== id));
  };

  const handleFinalize = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      onNavigate('dashboard');
    }, 1200);
  };

  return (
    <div className="bg-background text-on-surface font-body antialiased min-h-screen flex flex-col pb-28 selection:bg-primary-container selection:text-on-primary-container">
      {/* Top App Bar */}
      <header className="flex justify-between items-center w-full px-6 py-3 border-b border-outline-variant bg-background sticky top-0 z-40">
        <button onClick={() => onNavigate('landing')} className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-surface-container border border-outline-variant flex items-center justify-center text-primary shadow-sm">
            <span className="material-symbols-outlined text-[19px]">neurology</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-base font-bold font-headline tracking-tight text-on-surface">Synapse AI</span>
            <span className="text-xs px-2 py-0.5 rounded border border-outline-variant bg-surface-container font-mono text-on-surface-variant font-medium tracking-wide">
              INGESTION PIPELINE • Step 4 of 4
            </span>
          </div>
        </button>

        {/* Stepper Link Items */}
        <nav className="hidden lg:flex items-center space-x-6 text-xs font-medium font-headline">
          <button
            onClick={() => onNavigate('step1-upload')}
            className="text-on-surface-variant hover:text-on-surface transition-colors flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-tertiary text-sm">check_circle</span>
            Upload Syllabus
          </button>
          <button
            onClick={() => onNavigate('step2-exam')}
            className="text-on-surface-variant hover:text-on-surface transition-colors flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-tertiary text-sm">check_circle</span>
            Exam & Goals
          </button>
          <button
            onClick={() => onNavigate('step3-bandwidth')}
            className="text-on-surface-variant hover:text-on-surface transition-colors flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-tertiary text-sm">check_circle</span>
            Study Bandwidth
          </button>
          <span className="text-primary font-medium border-b-2 border-primary pb-1 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            AI Generation
          </span>
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('master-schedule')}
            className="flex items-center gap-1.5 text-xs text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high px-3 py-1.5 rounded-lg border border-outline-variant"
          >
            <span className="material-symbols-outlined text-sm">calendar_month</span>
            <span>Schedule</span>
          </button>
          <button
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-1.5 text-xs text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high px-3 py-1.5 rounded-lg border border-outline-variant"
          >
            <span className="material-symbols-outlined text-sm">close</span>
            <span>Save & Exit</span>
          </button>
        </div>
      </header>

      {/* Stepper Ribbon */}
      <section className="w-full max-w-7xl mx-auto px-6 pt-6 pb-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Step 1 */}
          <button
            onClick={() => onNavigate('step1-upload')}
            className="flex items-center justify-between p-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-left hover:bg-surface-container transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <span className="w-5 h-5 rounded-full bg-tertiary-container/30 border border-tertiary/40 flex items-center justify-center">
                <span className="material-symbols-outlined text-tertiary text-xs">check</span>
              </span>
              <div>
                <div className="text-[11px] font-mono uppercase tracking-wider text-secondary">Step 1</div>
                <div className="text-xs font-semibold text-on-surface">Upload Syllabus</div>
              </div>
            </div>
            <span className="text-[10px] font-mono text-tertiary px-1.5 py-0.5 rounded bg-tertiary-container/20 border border-tertiary-container">
              Completed
            </span>
          </button>

          {/* Step 2 */}
          <button
            onClick={() => onNavigate('step2-exam')}
            className="flex items-center justify-between p-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-left hover:bg-surface-container transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <span className="w-5 h-5 rounded-full bg-tertiary-container/30 border border-tertiary/40 flex items-center justify-center">
                <span className="material-symbols-outlined text-tertiary text-xs">check</span>
              </span>
              <div>
                <div className="text-[11px] font-mono uppercase tracking-wider text-secondary">Step 2</div>
                <div className="text-xs font-semibold text-on-surface">Exam & Goals</div>
              </div>
            </div>
            <span className="text-[10px] font-mono text-tertiary px-1.5 py-0.5 rounded bg-tertiary-container/20 border border-tertiary-container">
              Completed
            </span>
          </button>

          {/* Step 3 */}
          <button
            onClick={() => onNavigate('step3-bandwidth')}
            className="flex items-center justify-between p-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-left hover:bg-surface-container transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <span className="w-5 h-5 rounded-full bg-tertiary-container/30 border border-tertiary/40 flex items-center justify-center">
                <span className="material-symbols-outlined text-tertiary text-xs">check</span>
              </span>
              <div>
                <div className="text-[11px] font-mono uppercase tracking-wider text-secondary">Step 3</div>
                <div className="text-xs font-semibold text-on-surface">Study Bandwidth</div>
              </div>
            </div>
            <span className="text-[10px] font-mono text-tertiary px-1.5 py-0.5 rounded bg-tertiary-container/20 border border-tertiary-container">
              Completed
            </span>
          </button>

          {/* Step 4: Active */}
          <div className="flex items-center justify-between p-3 rounded-lg border-2 border-primary bg-surface-container shadow-[0_0_15px_-3px_rgba(167,139,250,0.25)] relative overflow-hidden">
            <div className="absolute -right-2 -bottom-2 w-16 h-16 bg-primary/10 rounded-full blur-xl pointer-events-none"></div>
            <div className="flex items-center gap-2.5">
              <span className="w-5 h-5 rounded-full bg-primary text-on-primary text-xs font-bold flex items-center justify-center">
                4
              </span>
              <div>
                <div className="text-[11px] font-mono uppercase tracking-wider text-primary font-semibold">Active Pipeline</div>
                <div className="text-xs font-bold text-on-surface">Resources & Synthesis</div>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 text-[10px] font-mono text-primary font-semibold px-2 py-0.5 rounded-full bg-primary/15 border border-primary/40">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping"></span>
              Step 4 of 4
            </span>
          </div>
        </div>
      </section>

      {/* Main Canvas: Bento Architecture */}
      <main className="w-full max-w-7xl mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
        {/* Left 8 Columns */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded w-fit">
              <span className="material-symbols-outlined text-sm">hub</span>
              Resource Mapping & Synthesis
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-on-surface font-headline">
              Attach your primary study resources
            </h1>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Synapse cross-references your syllabus modules with specific chapters, question banks, and lecture series to build your day-by-day reading and drill schedule.
            </p>
          </div>

          {/* Resource Intake Box */}
          <div className="bg-surface-container border border-outline-variant rounded-lg p-5 flex flex-col gap-4">
            {/* Category Filter Toggles */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-secondary font-mono mr-1">Filter by type:</span>
              {categories.map((c) => {
                const isActive = activeCategory === c.label;
                return (
                  <button
                    key={c.label}
                    onClick={() => setActiveCategory(c.label)}
                    className={`px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                      isActive
                        ? 'bg-primary text-on-primary'
                        : 'bg-surface-container-high text-on-surface-variant border border-outline-variant hover:text-on-surface hover:border-outline'
                    }`}
                  >
                    <span className="material-symbols-outlined text-xs">{c.icon}</span>
                    {c.label}
                  </button>
                );
              })}
            </div>

            {/* Input Bar */}
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
                  search
                </span>
                <input
                  type="text"
                  value={resourceInput}
                  onChange={(e) => setResourceInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddResource()}
                  placeholder="Add a resource (e.g., First Aid 2025 p. 120-180, UWorld QBank, Ninja Nerd Biochemistry, Kaplan Ch. 8)..."
                  className="w-full pl-10 pr-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg text-xs text-on-surface placeholder:text-secondary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-body transition-colors"
                />
              </div>
              <button
                onClick={handleAddResource}
                className="px-4 py-2.5 bg-surface-container-highest hover:bg-surface-container-high text-primary border border-outline-variant hover:border-primary text-xs font-medium rounded-lg flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                Add Resource
              </button>
            </div>

            {/* Preset Suggestions */}
            <div className="flex flex-col gap-1.5 pt-1">
              <span className="text-[11px] font-mono text-secondary">Quick suggestions based on your syllabus topics:</span>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((s) => (
                  <button
                    key={s.name}
                    onClick={() => addSuggestion(s)}
                    className="text-xs px-2.5 py-1 rounded-md bg-surface-container-lowest border border-outline-variant text-on-surface-variant hover:text-primary hover:border-primary/50 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span className="text-primary font-bold">+</span> {s.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Attached Resources Inventory */}
          <div className="bg-surface-container border border-outline-variant rounded-lg p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-semibold uppercase text-secondary">Attached Resources</span>
                <span className="text-[11px] font-mono bg-primary-container text-on-primary-container font-semibold px-2 py-0.5 rounded-full">
                  {resources.length} Configured
                </span>
              </div>
              <span className="text-xs text-on-surface-variant">
                Syllabus Match Coverage: <span className="text-tertiary font-mono font-semibold">98.4%</span>
              </span>
            </div>

            {/* List */}
            <div className="flex flex-col gap-3">
              {resources.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-lg border border-outline-variant bg-surface-container-lowest hover:border-outline transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded bg-surface-container border border-outline-variant flex items-center justify-center text-primary shrink-0 mt-0.5">
                      <span className="material-symbols-outlined text-[18px]">
                        {item.type.includes('Textbook')
                          ? 'book_2'
                          : item.type.includes('Question')
                          ? 'quiz'
                          : item.type.includes('Video')
                          ? 'smart_display'
                          : item.type.includes('Notes')
                          ? 'style'
                          : 'fact_check'}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-semibold text-on-surface">{item.title}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface-container-highest text-on-surface-variant border border-outline-variant">
                          {item.meta}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-tertiary-container/20 text-tertiary border border-tertiary-container">
                          {item.mappedInfo}
                        </span>
                      </div>
                      <span className="text-[11px] text-on-surface-variant mt-0.5">{item.assignedWeeks}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] font-mono text-secondary">Weight / Role</span>
                      <span
                        className={`text-xs font-mono font-medium ${
                          item.role === 'Primary Core'
                            ? 'text-primary'
                            : item.role === 'Benchmark Core'
                            ? 'text-primary font-bold'
                            : item.role === 'Spaced Practice'
                            ? 'text-tertiary'
                            : 'text-on-surface-variant'
                        }`}
                      >
                        {item.role}
                      </span>
                    </div>
                    <button
                      onClick={() => removeResource(item.id)}
                      className="w-7 h-7 rounded border border-outline-variant bg-surface-container-high hover:bg-error-container hover:text-error hover:border-error flex items-center justify-center text-secondary transition-colors cursor-pointer"
                      title="Remove Resource"
                    >
                      <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 4 Columns: Cognitive Synthesis */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-surface-container border border-outline-variant rounded-lg p-5 flex flex-col gap-5 sticky top-20">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[19px]">psychology</span>
                <span className="text-xs font-bold font-headline text-on-surface uppercase tracking-wider">
                  Cognitive Synthesis
                </span>
              </div>
              <span className="text-[10px] font-mono text-tertiary bg-tertiary-container/30 px-2 py-0.5 rounded border border-tertiary/30">
                Engine Ready
              </span>
            </div>

            {/* Metric Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-surface-container-lowest border border-outline-variant rounded-lg flex flex-col">
                <span className="text-[10px] font-mono text-secondary uppercase">Parsed Units</span>
                <span className="text-lg font-bold font-mono text-on-surface mt-1">18 Modules</span>
                <span className="text-[10px] text-tertiary mt-0.5">100% mapped</span>
              </div>
              <div className="p-3 bg-surface-container-lowest border border-outline-variant rounded-lg flex flex-col">
                <span className="text-[10px] font-mono text-secondary uppercase">Retention Target</span>
                <span className="text-lg font-bold font-mono text-tertiary mt-1">94%</span>
                <span className="text-[10px] text-on-surface-variant mt-0.5">FSRS Confidence</span>
              </div>
            </div>

            {/* Total Workload Breakdown */}
            <div className="flex flex-col gap-2 p-3 bg-surface-container-lowest border border-outline-variant rounded-lg">
              <span className="text-[11px] font-mono uppercase text-secondary">Aggregated Workload Volume</span>
              <div className="flex items-center justify-between text-xs py-1 border-b border-outline-variant">
                <span className="flex items-center gap-1.5 text-on-surface-variant">
                  <span className="material-symbols-outlined text-sm text-primary">menu_book</span>
                  Core Readings
                </span>
                <span className="font-mono font-semibold text-on-surface">38 Chapters</span>
              </div>
              <div className="flex items-center justify-between text-xs py-1 border-b border-outline-variant">
                <span className="flex items-center gap-1.5 text-on-surface-variant">
                  <span className="material-symbols-outlined text-sm text-primary">help_center</span>
                  Active Recall Drills
                </span>
                <span className="font-mono font-semibold text-on-surface">1,240 Questions</span>
              </div>
              <div className="flex items-center justify-between text-xs py-1">
                <span className="flex items-center gap-1.5 text-on-surface-variant">
                  <span className="material-symbols-outlined text-sm text-primary">videocam</span>
                  Video Modules
                </span>
                <span className="font-mono font-semibold text-on-surface">24.5 Hours</span>
              </div>
            </div>

            {/* AI Engine Parameters */}
            <div className="flex flex-col gap-2.5">
              <span className="text-[11px] font-mono uppercase text-secondary">Algorithmic Scheduling Engine</span>
              <div className="p-3 rounded-lg border border-primary/20 bg-primary/5 flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-on-surface flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                    FSRS-4.5 Adaptive Pacing
                  </span>
                  <span className="text-[10px] font-mono text-primary bg-surface-container px-1.5 py-0.5 rounded border border-outline-variant">
                    Active
                  </span>
                </div>
                <p className="text-[11px] text-on-surface-variant leading-snug">
                  Calculates interval decay rates using difficulty metrics extracted from your syllabus topics.
                </p>
              </div>

              <div className="p-3 rounded-lg border border-outline-variant bg-surface-container-lowest flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-sm">tune</span>
                  <span className="text-xs text-on-surface">Daily Review Threshold</span>
                </div>
                <span className="text-xs font-mono text-on-surface">85 min / day</span>
              </div>

              <div className="p-3 rounded-lg border border-outline-variant bg-surface-container-lowest flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-sm">event_repeat</span>
                  <span className="text-xs text-on-surface">Spaced Buffer Zones</span>
                </div>
                <span className="text-xs font-mono text-tertiary">Every 7th Day</span>
              </div>
            </div>

            {/* Confidence */}
            <div className="p-3 rounded-lg border border-outline-variant bg-surface-container-high flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-xl">verified</span>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-on-surface">High Generation Confidence</span>
                <span className="text-[10px] text-on-surface-variant">Syllabus deadlines & resources completely aligned.</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Sticky Bottom Action Bar */}
      <footer className="fixed bottom-0 left-0 w-full z-50 flex justify-between items-center px-6 py-4 border-t border-outline-variant bg-surface-container-lowest">
        <button
          onClick={() => onNavigate('step3-bandwidth')}
          className="text-on-surface-variant hover:text-on-surface hover:border-outline transition-colors border border-outline-variant px-4 py-2 rounded-lg text-xs font-medium flex items-center gap-2 active:scale-[0.98]"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          <span>Back</span>
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-on-surface-variant">
          <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
          <span>Step 4 of 4: Study Resources • Ready for Synthesis</span>
        </div>

        <button
          onClick={handleFinalize}
          disabled={isGenerating}
          className="bg-primary text-on-primary font-semibold px-5 py-2.5 rounded-lg text-xs flex items-center gap-2 shadow-[0_0_20px_-3px_rgba(167,139,250,0.4)] hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer"
        >
          {isGenerating ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              <span>Building Master Schedule...</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-base">auto_awesome</span>
              <span>Generate Study Plan</span>
            </>
          )}
        </button>
      </footer>
    </div>
  );
};
