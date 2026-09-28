import React, { useState } from 'react';
import { ScreenId } from '../types';

interface MasterScheduleProps {
  onNavigate: (screen: ScreenId) => void;
}

export const MasterSchedule: React.FC<MasterScheduleProps> = ({ onNavigate }) => {
  const [activeCourse, setActiveCourse] = useState('mcat');
  const [filterSubject, setFilterSubject] = useState<string>('all');
  const [showSpaced, setShowSpaced] = useState(true);
  const [showBanner, setShowBanner] = useState(true);
  const [bandwidthHours, setBandwidthHours] = useState(3.75);
  const [searchQuery, setSearchQuery] = useState('');
  const [recalibrationNotice, setRecalibrationNotice] = useState<string | null>(null);

  const handleRecalibrate = () => {
    setRecalibrationNotice('Recalibrating schedule with neural decay curve... Buffer optimized!');
    setTimeout(() => setRecalibrationNotice(null), 3000);
  };

  return (
    <div className="bg-background text-on-surface antialiased font-body min-h-screen selection:bg-primary-container selection:text-white flex">
      {/* ================= 1. LEFT SIDE NAVIGATION BAR ================= */}
      <aside className="hidden lg:flex fixed top-0 left-0 h-screen w-64 z-40 bg-surface-container-low shadow-2xl backdrop-blur-xl border-r border-outline-variant flex-col justify-between p-4">
        {/* Top Area: Brand & Navigation */}
        <div className="flex flex-col gap-4">
          <button onClick={() => onNavigate('landing')} className="flex items-center gap-3 px-1 py-1 text-left">
            <div className="h-9 w-9 rounded-lg bg-surface-container-high flex items-center justify-center border border-outline-variant shadow-inner">
              <span className="material-symbols-outlined text-primary text-xl">psychology</span>
            </div>
            <div>
              <div className="text-base font-headline font-bold text-on-surface tracking-tight">Synapse AI</div>
              <div className="text-xs font-mono text-on-surface-variant">STUDY ENGINE</div>
            </div>
          </button>

          {/* Quick Action CTA */}
          <button
            onClick={handleRecalibrate}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-primary-container text-on-primary-container font-label text-xs tracking-wide transition-all ease-out active:scale-[0.98] glow-primary font-semibold hover:bg-opacity-90 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">bolt</span>
            <span>Recalibrate Plan</span>
          </button>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1 mt-2">
            <button
              onClick={() => onNavigate('master-schedule')}
              className="flex items-center gap-3 px-3 py-2 rounded-lg bg-surface-container-highest text-on-surface font-semibold border-l-2 border-primary text-xs"
            >
              <span className="material-symbols-outlined text-primary">calendar_today</span>
              <span>Schedule</span>
              <span className="ml-auto flex h-1.5 w-1.5 rounded-full bg-primary animate-pulse"></span>
            </button>

            <button
              onClick={() => onNavigate('dashboard')}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors text-xs text-left"
            >
              <span className="material-symbols-outlined text-base">auto_stories</span>
              <span>Courses</span>
              <span className="ml-auto text-[11px] font-mono px-1.5 py-0.5 rounded bg-surface-container-highest text-on-surface-variant border border-outline-variant">
                3
              </span>
            </button>

            <button
              onClick={() => onNavigate('voice-quiz')}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors text-xs text-left"
            >
              <span className="material-symbols-outlined text-base">mic</span>
              <span>Voice Recall Quiz</span>
              <span className="ml-auto text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface-container-highest text-primary border border-outline-variant">
                142
              </span>
            </button>

            <button
              onClick={() => onNavigate('handwritten-analysis')}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors text-xs text-left"
            >
              <span className="material-symbols-outlined text-base">draw</span>
              <span>Answer Analysis</span>
              <span className="ml-auto text-[10px] font-mono px-1 py-0.2 rounded bg-tertiary-container text-tertiary">
                AI Vision
              </span>
            </button>

            <button
              onClick={() => onNavigate('step1-upload')}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors text-xs text-left"
            >
              <span className="material-symbols-outlined text-base">upload_file</span>
              <span>Upload Syllabus</span>
            </button>
          </nav>
        </div>

        {/* Bottom Sidebar Widgets */}
        <div className="flex flex-col gap-2 pt-4 border-t border-outline-variant">
          {recalibrationNotice && (
            <div className="p-2 bg-primary/20 border border-primary text-xs rounded text-primary font-mono text-center">
              {recalibrationNotice}
            </div>
          )}

          <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-surface-container-high border border-outline-variant">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-base">local_fire_department</span>
              <span className="text-xs text-on-surface">Daily Streak: 14d</span>
            </div>
            <span className="text-xs font-mono text-tertiary font-bold">+1.2x</span>
          </div>

          <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-surface-container-high border border-outline-variant">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-tertiary text-base">bolt</span>
              <span className="text-xs text-on-surface">Cognitive Load: Optimal</span>
            </div>
            <div className="h-2 w-2 rounded-full bg-tertiary shadow-[0_0_8px_rgba(52,211,153,0.4)]"></div>
          </div>

          {/* User Mini Profile */}
          <div className="flex items-center gap-2.5 px-2 py-2 mt-1 rounded-lg hover:bg-surface-container border border-transparent hover:border-outline-variant transition-colors">
            <div className="h-8 w-8 rounded-full bg-primary/20 border border-primary text-primary font-bold flex items-center justify-center text-xs">
              AV
            </div>
            <div className="flex flex-col truncate">
              <span className="text-xs font-semibold text-on-surface truncate">Dr. Alexis Vance</span>
              <span className="text-[11px] font-mono text-on-surface-variant truncate">MCAT Track 2025</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Content wrapper */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        {/* ================= 2. TOP APP BAR ================= */}
        <header className="sticky top-0 z-30 w-full bg-surface/90 border-b border-outline-variant backdrop-blur-md shadow-sm">
          <div className="flex items-center justify-between px-6 py-3 w-full">
            {/* Left: Active Context and Quick Course Switchers */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="text-lg font-headline font-bold text-on-surface tracking-tight">Master Schedule</span>
                <span className="text-xs text-outline px-1">/</span>
                <span className="text-[11px] font-mono text-primary bg-surface-container-high px-2 py-0.5 rounded border border-outline-variant">
                  LIVE SYNC
                </span>
              </div>

              {/* Course Quick-Switchers */}
              <div className="hidden lg:flex items-center gap-4 text-xs font-label">
                <button
                  onClick={() => setActiveCourse('mcat')}
                  className={`pb-1 transition-all ${
                    activeCourse === 'mcat'
                      ? 'text-primary font-semibold border-b-2 border-primary'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  MCAT Prep 2025
                </button>
                <button
                  onClick={() => setActiveCourse('neuro')}
                  className={`pb-1 transition-all ${
                    activeCourse === 'neuro'
                      ? 'text-primary font-semibold border-b-2 border-primary'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  Neuroanatomy
                </button>
                <button
                  onClick={() => setActiveCourse('orgo')}
                  className={`pb-1 transition-all ${
                    activeCourse === 'orgo'
                      ? 'text-primary font-semibold border-b-2 border-primary'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  Organic Chem
                </button>
              </div>
            </div>

            {/* Right: Search & Actions */}
            <div className="flex items-center gap-3">
              <div className="relative w-60 hidden sm:block">
                <span className="material-symbols-outlined absolute left-2.5 top-2 text-outline text-base">search</span>
                <input
                  type="text"
                  placeholder="Search topics, tags, decks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-surface-container-high border border-outline-variant text-on-surface placeholder:text-outline text-xs focus:outline-none focus:border-primary"
                />
              </div>

              <button
                onClick={() => onNavigate('dashboard')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-high text-on-surface hover:bg-surface-container-highest border border-outline-variant text-xs transition-colors"
              >
                <span className="material-symbols-outlined text-sm">dashboard</span>
                <span>Dashboard</span>
              </button>

              <button
                onClick={() => onNavigate('voice-quiz')}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-primary-container text-on-primary-container hover:bg-opacity-90 border border-primary/30 text-xs transition-colors font-semibold glow-primary cursor-pointer active:scale-95"
              >
                <span className="material-symbols-outlined text-sm">timer</span>
                <span>Focus Session</span>
              </button>
            </div>
          </div>
        </header>

        {/* ================= MAIN WORKSPACE CONTAINER ================= */}
        <main className="p-6 flex flex-col gap-6 bg-background flex-1">
          {/* AI Adaptive Engine Banner */}
          {showBanner && (
            <section className="relative overflow-hidden rounded-lg bg-surface-container-low border border-outline-variant p-4 shadow-sm backdrop-blur-md">
              <div className="absolute -right-16 -top-16 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
                <div className="flex items-start gap-3.5">
                  <div className="p-2 rounded-lg bg-surface-container-high text-primary border border-outline-variant mt-0.5">
                    <span className="material-symbols-outlined text-xl">auto_awesome</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-headline text-on-surface font-semibold tracking-tight">
                        AI Adaptive Engine: Schedule Optimized
                      </span>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-tertiary-container/30 text-tertiary border border-tertiary/30">
                        REAL-TIME RECALIBRATION
                      </span>
                    </div>
                    <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                      You completed <strong className="text-on-surface font-medium">Organic Chemistry Unit 3</strong> 45 mins faster than estimated.{' '}
                      <span className="text-primary font-medium">1.5 hrs reallocated</span> to Neuroanatomy High-Yield review before Friday's practice exam.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
                  <button
                    onClick={() => onNavigate('dashboard')}
                    className="px-3 py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-xs border border-outline-variant transition-colors"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => setShowBanner(false)}
                    className="p-1.5 rounded-lg text-outline hover:text-on-surface transition-colors"
                    title="Dismiss banner"
                  >
                    <span className="material-symbols-outlined text-base">close</span>
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* Top Metrics Bento Strip */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Metric 1: Target Exam Countdown */}
            <div className="p-4 rounded-lg bg-surface-container-low border border-outline-variant flex flex-col justify-between hover:border-outline transition-colors">
              <div className="flex items-center justify-between text-on-surface-variant text-xs">
                <span>Target Exam Countdown</span>
                <span className="material-symbols-outlined text-primary text-base">event_upcoming</span>
              </div>
              <div className="my-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-headline text-on-surface font-bold tracking-tight">32</span>
                  <span className="text-xs font-mono text-on-surface-variant">DAYS REMAINING</span>
                </div>
                <span className="text-[11px] font-mono text-primary font-medium">TARGET: 518+ MCAT</span>
              </div>
              <div className="space-y-1 mt-1">
                <div className="flex justify-between text-[11px] font-mono text-on-surface-variant">
                  <span>Syllabus Coverage</span>
                  <span className="text-on-surface font-medium">68%</span>
                </div>
                <div className="w-full h-1 bg-surface-container-highest rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: '68%' }}></div>
                </div>
              </div>
            </div>

            {/* Metric 2: Weekly Available Hours */}
            <div className="p-4 rounded-lg bg-surface-container-low border border-outline-variant flex flex-col justify-between hover:border-outline transition-colors">
              <div className="flex items-center justify-between text-on-surface-variant text-xs">
                <span>Weekly Available Hours</span>
                <span className="material-symbols-outlined text-on-surface-variant text-base">schedule</span>
              </div>
              <div className="my-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-headline text-on-surface font-bold tracking-tight">18.5</span>
                  <span className="text-xs font-mono text-outline">/ 24 HRS</span>
                </div>
                <span className="text-[11px] font-mono text-tertiary font-medium">5.5 hrs buffer preserved</span>
              </div>
              <div className="space-y-1 mt-1">
                <div className="flex justify-between text-[11px] font-mono text-on-surface-variant">
                  <span>Capacity Utilized</span>
                  <span className="text-on-surface font-medium">77%</span>
                </div>
                <div className="w-full h-1 bg-surface-container-highest rounded-full overflow-hidden">
                  <div className="h-full bg-secondary-fixed rounded-full" style={{ width: '77%' }}></div>
                </div>
              </div>
            </div>

            {/* Metric 3: Today's Study Load */}
            <div className="p-4 rounded-lg bg-surface-container-low border border-outline-variant flex flex-col justify-between hover:border-outline transition-colors">
              <div className="flex items-center justify-between text-on-surface-variant text-xs">
                <span>Today's Study Load</span>
                <span className="material-symbols-outlined text-primary text-base">fitness_center</span>
              </div>
              <div className="my-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-headline text-on-surface font-bold tracking-tight">3</span>
                  <span className="text-xs font-mono text-on-surface-variant">BLOCKS (3h 45m)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                  <span className="text-[11px] text-on-surface-variant">
                    Cognitive Effort: <strong className="text-on-surface font-medium">Moderate</strong>
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-mono text-outline mt-1">
                <span className="material-symbols-outlined text-xs text-tertiary">check_circle</span>
                <span>1 block complete, 2 remaining</span>
              </div>
            </div>

            {/* Metric 4: Retention Velocity */}
            <div className="p-4 rounded-lg bg-surface-container-low border border-outline-variant flex flex-col justify-between hover:border-outline transition-colors">
              <div className="flex items-center justify-between text-on-surface-variant text-xs">
                <span>Retention Velocity</span>
                <span className="material-symbols-outlined text-tertiary text-base">speed</span>
              </div>
              <div className="my-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-headline text-tertiary font-bold tracking-tight">94%</span>
                  <span className="text-xs font-mono text-on-surface-variant">RETENTION</span>
                </div>
                <span className="text-[11px] font-mono text-tertiary-fixed-dim">Spaced Repetition sync active</span>
              </div>
              <div className="space-y-1 mt-1">
                <div className="flex justify-between text-[11px] font-mono text-on-surface-variant">
                  <span>Forgetting Curve Safety</span>
                  <span className="text-tertiary font-medium">High Margin</span>
                </div>
                <div className="w-full h-1 bg-surface-container-highest rounded-full overflow-hidden">
                  <div className="h-full bg-tertiary rounded-full" style={{ width: '94%' }}></div>
                </div>
              </div>
            </div>
          </section>

          {/* Main 8-Col + 4-Col Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
            {/* 8 Cols: Interactive Weekly Timeline */}
            <section className="xl:col-span-8 flex flex-col gap-4">
              {/* Controls Strip */}
              <div className="p-3.5 rounded-lg bg-surface-container-low border border-outline-variant backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center bg-surface-container-highest p-1 rounded-lg border border-outline-variant">
                  <button className="px-3 py-1.5 rounded-md bg-surface-container-high text-on-surface text-xs shadow-sm font-semibold flex items-center gap-1.5 border border-outline-variant">
                    <span className="material-symbols-outlined text-sm">view_week</span>
                    Weekly Timeline
                  </button>
                  <button
                    onClick={() => onNavigate('dashboard')}
                    className="px-3 py-1.5 rounded-md text-on-surface-variant hover:text-on-surface text-xs transition-colors flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-sm">calendar_view_day</span>
                    Daily Deep-Dive
                  </button>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] font-mono text-outline mr-1">FILTER:</span>
                  <button
                    onClick={() => setFilterSubject(filterSubject === 'orgo' ? 'all' : 'orgo')}
                    className={`px-2.5 py-1 rounded-full text-xs font-mono font-medium transition-colors cursor-pointer ${
                      filterSubject === 'orgo'
                        ? 'bg-primary text-on-primary font-bold'
                        : 'bg-primary/10 text-primary border border-primary/30'
                    }`}
                  >
                    Organic Chem
                  </button>
                  <button
                    onClick={() => setFilterSubject(filterSubject === 'bio' ? 'all' : 'bio')}
                    className={`px-2.5 py-1 rounded-full text-xs font-mono font-medium transition-colors cursor-pointer ${
                      filterSubject === 'bio'
                        ? 'bg-secondary text-white font-bold'
                        : 'bg-secondary-container text-on-secondary-container border border-outline-variant'
                    }`}
                  >
                    Cell Biology
                  </button>
                  <button
                    onClick={() => setFilterSubject(filterSubject === 'phys' ? 'all' : 'phys')}
                    className={`px-2.5 py-1 rounded-full text-xs font-mono font-medium transition-colors cursor-pointer ${
                      filterSubject === 'phys'
                        ? 'bg-tertiary text-on-tertiary font-bold'
                        : 'bg-tertiary-container/30 text-tertiary border border-tertiary/30'
                    }`}
                  >
                    Physics
                  </button>
                  <button
                    onClick={() => setFilterSubject(filterSubject === 'cars' ? 'all' : 'cars')}
                    className={`px-2.5 py-1 rounded-full text-xs font-mono font-medium transition-colors cursor-pointer ${
                      filterSubject === 'cars'
                        ? 'bg-surface-variant text-white font-bold'
                        : 'bg-surface-container-highest text-on-surface-variant border border-outline-variant'
                    }`}
                  >
                    Verbal Reasoning
                  </button>
                </div>

                {/* Spaced Toggle */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showSpaced}
                    onChange={(e) => setShowSpaced(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-8 h-4 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-on-surface after:border-zinc-700 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-primary relative border border-outline-variant"></div>
                  <span className="text-xs text-on-surface-variant">Show Spaced Repetition</span>
                </label>
              </div>

              {/* 7-Day Calendar Grid */}
              <div className="rounded-lg bg-surface-container-low border border-outline-variant overflow-hidden backdrop-blur-md shadow-sm">
                <div className="grid grid-cols-7 border-b border-outline-variant bg-surface-container-high/60 text-center divide-x divide-outline-variant">
                  <div className="py-2.5 px-1">
                    <div className="text-[11px] font-mono text-outline">MON</div>
                    <div className="text-sm font-headline font-bold text-on-surface">Oct 20</div>
                  </div>
                  <div className="py-2.5 px-1">
                    <div className="text-[11px] font-mono text-outline">TUE</div>
                    <div className="text-sm font-headline font-bold text-on-surface">Oct 21</div>
                  </div>
                  <div className="py-2.5 px-1 bg-surface-container-highest border-b-2 border-primary">
                    <div className="text-[11px] font-mono text-primary font-bold">WED • TODAY</div>
                    <div className="text-sm font-headline font-bold text-primary">Oct 22</div>
                  </div>
                  <div className="py-2.5 px-1">
                    <div className="text-[11px] font-mono text-outline">THU</div>
                    <div className="text-sm font-headline font-bold text-on-surface">Oct 23</div>
                  </div>
                  <div className="py-2.5 px-1">
                    <div className="text-[11px] font-mono text-outline">FRI</div>
                    <div className="text-sm font-headline font-bold text-on-surface">Oct 24</div>
                  </div>
                  <div className="py-2.5 px-1 bg-surface-container-high/40">
                    <div className="text-[11px] font-mono text-on-surface-variant font-semibold">SAT • SIM</div>
                    <div className="text-sm font-headline font-bold text-on-surface">Oct 25</div>
                  </div>
                  <div className="py-2.5 px-1">
                    <div className="text-[11px] font-mono text-outline">SUN</div>
                    <div className="text-sm font-headline font-bold text-on-surface">Oct 26</div>
                  </div>
                </div>

                {/* Days Grid Content */}
                <div className="grid grid-cols-7 divide-x divide-outline-variant min-h-[560px] p-2 gap-2 bg-surface-container-lowest/60">
                  {/* Mon */}
                  <div className="flex flex-col gap-2">
                    <div className="p-2.5 rounded-lg bg-surface-container-high/70 border border-outline-variant opacity-80">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-mono text-tertiary bg-tertiary-container/30 px-1.5 py-0.5 rounded border border-tertiary/30">
                          Cell Bio
                        </span>
                        <span className="material-symbols-outlined text-tertiary text-sm">check_circle</span>
                      </div>
                      <div className="text-xs text-on-surface font-semibold line-clamp-2">
                        Membrane Potentials & Synapses
                      </div>
                      <div className="text-[11px] font-mono text-outline mt-1.5">1h 30m • Done</div>
                    </div>

                    {showSpaced && (
                      <div className="p-2 rounded-lg bg-surface-container/60 border border-outline-variant/60 opacity-75">
                        <div className="flex items-center gap-1 text-[11px] font-mono text-on-surface-variant">
                          <span className="material-symbols-outlined text-xs">psychology</span>
                          <span>Anki 95 Cards</span>
                        </div>
                        <div className="text-[10px] font-mono text-outline mt-1">Retention: 96%</div>
                      </div>
                    )}
                  </div>

                  {/* Tue */}
                  <div className="flex flex-col gap-2">
                    <div className="p-2.5 rounded-lg bg-surface-container-high/70 border border-outline-variant opacity-80">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-mono text-primary bg-primary/10 px-1.5 py-0.5 rounded border border-primary/30">
                          Organic Chem
                        </span>
                        <span className="material-symbols-outlined text-tertiary text-sm">check_circle</span>
                      </div>
                      <div className="text-xs text-on-surface font-semibold line-clamp-2">Electrophilic Addition</div>
                      <div className="text-[11px] font-mono text-outline mt-1.5">2h 00m • Done</div>
                    </div>

                    <div className="p-2 rounded-lg bg-tertiary-container/20 border border-tertiary/30">
                      <span className="text-[11px] font-mono text-tertiary font-medium">⚡ Finished 45m early</span>
                    </div>
                  </div>

                  {/* Wed (Today) */}
                  <div className="flex flex-col gap-2 bg-surface-container p-1 rounded-lg border border-primary/30">
                    <div className="p-2.5 rounded-lg bg-surface-container-high border border-outline-variant">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-mono text-primary bg-primary/10 px-1.5 py-0.5 rounded border border-primary/30">
                          Organic Chem
                        </span>
                        <span className="material-symbols-outlined text-tertiary text-sm">check_circle</span>
                      </div>
                      <div className="text-xs text-on-surface font-semibold">Reaction Mechanisms & Carbonyls</div>
                      <div className="text-[10px] font-mono text-outline mt-1">1h 15m • Completed 08:30</div>
                    </div>

                    {/* Active Target Block */}
                    <div
                      onClick={() => onNavigate('dashboard')}
                      className="p-3 rounded-lg bg-surface-container-highest border border-primary shadow-sm relative glow-primary cursor-pointer hover:border-primary-fixed"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-mono text-primary bg-primary/15 px-1.5 py-0.5 rounded border border-primary/30 font-semibold">
                          Cell Bio
                        </span>
                        <span className="flex h-1.5 w-1.5 rounded-full bg-primary animate-ping"></span>
                      </div>
                      <div className="text-xs text-on-surface font-bold">Signal Transduction Cascades</div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface-container text-on-surface-variant border border-outline-variant">
                          High-Yield
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-primary/20 text-primary font-medium border border-primary/30">
                          Active Recall
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] font-mono text-on-surface-variant font-medium mt-2.5 pt-2 border-t border-outline-variant">
                        <span>1h 45m Block</span>
                        <span className="text-[10px] font-mono bg-primary text-on-primary px-2 py-0.5 rounded font-bold">
                          READY
                        </span>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-lg bg-surface-container-high border border-outline-variant">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-mono text-tertiary bg-tertiary-container/30 px-1.5 py-0.5 rounded border border-tertiary/30">
                          Physics
                        </span>
                        <span className="text-[11px] font-mono text-outline">45m</span>
                      </div>
                      <div className="text-xs text-on-surface font-medium">Fluids & Hydrostatic Pressure</div>
                      <div className="text-[10px] font-mono text-outline mt-1.5">Problem Set (15 Qs)</div>
                    </div>
                  </div>

                  {/* Thu */}
                  <div className="flex flex-col gap-2">
                    <div className="p-2.5 rounded-lg bg-surface-container-high/60 border border-outline-variant hover:border-outline transition-colors">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-mono text-on-surface-variant bg-surface-container-highest px-1.5 py-0.5 rounded border border-outline-variant">
                          Neuroanatomy
                        </span>
                        <span className="text-[11px] font-mono text-outline">2h 15m</span>
                      </div>
                      <div className="text-xs text-on-surface font-semibold">Cranial Nerves & Pathways</div>
                      <div className="mt-2 flex items-center gap-1 text-[10px] font-mono text-tertiary font-medium">
                        <span className="material-symbols-outlined text-xs">auto_awesome</span>
                        <span>+45m AI Reallocated</span>
                      </div>
                    </div>

                    {showSpaced && (
                      <div className="p-2 rounded-lg bg-surface-container-high/40 border border-outline-variant/60 flex items-center gap-2">
                        <span className="material-symbols-outlined text-outline text-xs">sync</span>
                        <span className="text-[11px] font-mono text-on-surface-variant">Anki Deck v3.2 Sync</span>
                      </div>
                    )}
                  </div>

                  {/* Fri */}
                  <div className="flex flex-col gap-2">
                    <div className="p-2.5 rounded-lg bg-surface-container-high/60 border border-outline-variant hover:border-outline transition-colors">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-mono text-primary bg-primary/10 px-1.5 py-0.5 rounded border border-primary/30">
                          Organic Chem
                        </span>
                        <span className="text-[11px] font-mono text-outline">1h 30m</span>
                      </div>
                      <div className="text-xs text-on-surface font-semibold">Spectroscopy NMR & IR</div>
                      <div className="text-[10px] font-mono text-outline mt-1">High-Yield Synthesis</div>
                    </div>

                    <div className="p-2.5 rounded-lg bg-surface-container-highest border border-outline-variant">
                      <div className="flex items-center gap-1 text-[10px] font-mono text-primary font-bold mb-1">
                        <span className="material-symbols-outlined text-xs">bolt</span>
                        <span>AI BOOSTER SESSION</span>
                      </div>
                      <div className="text-xs text-on-surface font-medium">Neuroanatomy Drill (1.5h)</div>
                    </div>
                  </div>

                  {/* Sat */}
                  <div className="flex flex-col gap-2 bg-surface-container-high/20 p-1 rounded-lg border border-outline-variant">
                    <div className="p-3 rounded-lg bg-surface-container-high border border-outline-variant shadow-sm">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-mono text-on-surface font-bold px-2 py-0.5 rounded bg-surface-container-highest border border-outline-variant">
                          FULL SIM
                        </span>
                        <span className="material-symbols-outlined text-primary text-sm">flag</span>
                      </div>
                      <div className="text-xs text-on-surface font-bold">MCAT Practice Exam Sim #4</div>
                      <div className="text-[11px] font-mono text-on-surface-variant mt-1.5">08:00 - 15:30 • 7.5 hrs</div>
                      <div className="mt-2.5 pt-2 border-t border-outline-variant flex items-center justify-between">
                        <span className="text-[10px] font-mono text-tertiary font-semibold">TEST CENTER MODE</span>
                        <button
                          onClick={() => onNavigate('handwritten-analysis')}
                          className="text-[11px] font-mono text-primary hover:underline"
                        >
                          Prep Spec →
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Sun */}
                  <div className="flex flex-col gap-2">
                    <div className="p-3 rounded-lg border border-dashed border-tertiary/40 bg-tertiary-container/10 text-center">
                      <span className="material-symbols-outlined text-tertiary text-base">verified</span>
                      <div className="text-xs font-headline text-tertiary font-bold mt-1">AI Buffer Window</div>
                      <div className="text-[11px] font-mono text-on-surface-variant mt-1">3.5 hrs Unallocated</div>
                      <p className="text-[10px] text-outline mt-1.5 leading-snug">
                        Available for deep review of Saturday exam weak points.
                      </p>
                    </div>

                    <div className="p-2.5 rounded-lg bg-surface-container-high/40 border border-outline-variant">
                      <div className="text-[10px] font-mono text-outline">WEEKLY RESET</div>
                      <div className="text-xs text-on-surface font-medium mt-0.5">Spaced Repetition Hygiene</div>
                      <div className="text-[11px] font-mono text-outline mt-1">45 mins</div>
                    </div>
                  </div>
                </div>

                {/* Bottom Legend */}
                <div className="p-3 bg-surface-container-high/60 border-t border-outline-variant flex flex-wrap items-center justify-between text-xs text-on-surface-variant gap-3">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-primary"></span>
                      <span className="text-xs">Organic Chemistry</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-secondary-fixed"></span>
                      <span className="text-xs">Cell Biology & Neuro</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-tertiary"></span>
                      <span className="text-xs">Physics & Quant</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-outline"></span>
                      <span className="text-xs">Simulations / Exams</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-[11px]">
                    <span className="material-symbols-outlined text-tertiary text-sm">auto_awesome</span>
                    <span>AUTONOMOUS SCHEDULE ENGINE: ACTIVE & CALIBRATED</span>
                  </div>
                </div>
              </div>
            </section>

            {/* 4 Cols: Contextual Inspector */}
            <aside className="xl:col-span-4 flex flex-col gap-4">
              {/* CARD 1: Today's Focus Queue */}
              <div className="rounded-lg bg-surface-container-low border border-outline-variant p-4 backdrop-blur-md shadow-sm flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-outline-variant pb-3">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-lg">play_circle</span>
                    <span className="text-sm font-headline text-on-surface font-bold tracking-tight">Today's Focus Queue</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-container-highest text-primary border border-outline-variant">
                    NEXT BLOCK
                  </span>
                </div>

                <div className="p-3.5 rounded-lg bg-surface-container-high border border-outline-variant">
                  <span className="text-[10px] font-mono text-primary font-semibold uppercase tracking-wider">Cell Biology</span>
                  <h4 className="text-sm font-headline text-on-surface font-bold mt-0.5">Signal Transduction Cascades</h4>
                  <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                    G-Protein Coupled Receptors & RTK Phosphorylation maps.
                  </p>

                  <div className="mt-4 p-3 rounded-lg bg-surface-container-lowest border border-outline-variant flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full border border-primary flex items-center justify-center text-primary font-mono text-xs font-bold glow-primary">
                        45m
                      </div>
                      <div>
                        <div className="text-xs text-on-surface font-semibold">Deep Focus Interval</div>
                        <div className="text-[11px] font-mono text-outline">Target: 2 cycles with 5m break</div>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-outline">headphones</span>
                  </div>

                  <button
                    onClick={() => onNavigate('dashboard')}
                    className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary-container text-on-primary-container font-label text-xs tracking-wide font-bold shadow-sm glow-primary hover:bg-opacity-90 active:scale-[0.98] transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">rocket_launch</span>
                    <span>Launch Deep Focus Session</span>
                  </button>
                </div>

                {/* Study Artifacts */}
                <div className="flex flex-col gap-2">
                  <span className="text-[11px] font-mono text-outline font-semibold tracking-wider">ATTACHED STUDY ARTIFACTS</span>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-surface-container-high/60 hover:bg-surface-container-highest border border-outline-variant transition-colors cursor-pointer">
                    <div className="flex items-center gap-2.5 truncate">
                      <span className="material-symbols-outlined text-error text-base">picture_as_pdf</span>
                      <span className="text-xs text-on-surface truncate">Kaplan Ch. 8 PDF - Signal Transduction</span>
                    </div>
                    <span className="text-[11px] font-mono text-outline shrink-0 ml-2">p. 142</span>
                  </div>
                  <div
                    onClick={() => onNavigate('voice-quiz')}
                    className="flex items-center justify-between p-2 rounded-lg bg-surface-container-high/60 hover:bg-surface-container-highest border border-outline-variant transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <span className="material-symbols-outlined text-primary text-base">style</span>
                      <span className="text-xs text-on-surface truncate">Anki Deck v3.2 (Tagged #BioChem)</span>
                    </div>
                    <span className="text-[11px] font-mono text-primary shrink-0 ml-2">48 Cards</span>
                  </div>
                  <div
                    onClick={() => onNavigate('handwritten-analysis')}
                    className="flex items-center justify-between p-2 rounded-lg bg-surface-container-high/60 hover:bg-surface-container-highest border border-outline-variant transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <span className="material-symbols-outlined text-tertiary text-base">quiz</span>
                      <span className="text-xs text-on-surface truncate">UWorld QBank Set 12 (Hard Passages)</span>
                    </div>
                    <span className="text-[11px] font-mono text-tertiary shrink-0 ml-2">15 Qs</span>
                  </div>
                </div>
              </div>

              {/* CARD 2: Adaptive Reschedule Simulator */}
              <div className="rounded-lg bg-surface-container-low border border-outline-variant p-4 backdrop-blur-md shadow-sm flex flex-col gap-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-lg">tune</span>
                    <span className="text-sm font-headline text-on-surface font-bold tracking-tight">Reschedule Simulator</span>
                  </div>
                  <span className="text-[10px] font-mono text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/30">
                    PREDICTIVE
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Adjust available study hours for today to test schedule reallocation impact without breaking your retention curve.
                </p>

                {/* Slider Control */}
                <div className="space-y-2 pt-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-on-surface-variant">Adjust Today's Bandwidth:</span>
                    <span className="text-primary font-bold font-mono text-xs">{bandwidthHours.toFixed(1)} hrs</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="6"
                    step="0.5"
                    value={bandwidthHours}
                    onChange={(e) => setBandwidthHours(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between text-[10px] text-outline font-mono">
                    <span>1.0 hr (Emergency)</span>
                    <span>3.75h</span>
                    <span>6.0 hrs (Sprint)</span>
                  </div>
                </div>

                {/* Dynamic Impact Output Box */}
                <div className="p-3 rounded-lg bg-surface-container-highest border border-outline-variant text-xs">
                  <div className="flex items-center gap-1.5 text-on-surface font-semibold text-xs mb-1">
                    <span className="material-symbols-outlined text-sm text-primary">schema</span>
                    <span>Simulated Schedule Cascade:</span>
                  </div>
                  <p className="text-on-surface-variant text-[11px] leading-relaxed">
                    {bandwidthHours < 3.0 ? (
                      <>
                        Bandwidth compressed (-{(3.75 - bandwidthHours).toFixed(1)}h):{' '}
                        <span className="text-primary font-medium">Physics Problem Set</span> is automatically transferred into{' '}
                        <strong className="text-tertiary">Sunday's 3.5h Unallocated Buffer</strong>. MCAT Target retention remains at 94%.
                      </>
                    ) : bandwidthHours > 4.5 ? (
                      <>
                        Bandwidth expanded (+{(bandwidthHours - 3.75).toFixed(1)}h): AI proactively pulls forward{' '}
                        <strong className="text-primary">Thursday Cranial Nerves</strong> to relieve Friday's load.
                      </>
                    ) : (
                      <>
                        Scheduled baseline (3.75h): <span className="text-on-surface">Reaction Mechanisms</span> completed. Next is{' '}
                        <strong className="text-primary">Signal Transduction</strong>. Schedule optimal.
                      </>
                    )}
                  </p>
                </div>

                <button
                  onClick={handleRecalibrate}
                  className="w-full py-2 px-3 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-xs font-semibold border border-outline-variant transition-colors cursor-pointer"
                >
                  Commit Dynamic Adjustment
                </button>
              </div>

              {/* CARD 3: Memory Decay Guard */}
              <div className="rounded-lg bg-surface-container-low border border-outline-variant p-4 backdrop-blur-md shadow-sm flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-tertiary text-lg">heat_pump</span>
                    <span className="text-sm font-headline text-on-surface font-bold tracking-tight">Memory Decay Guard</span>
                  </div>
                  <span className="text-[10px] font-mono text-tertiary">0 CRITICAL DUE</span>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] font-mono text-outline">
                    <span>Biochemistry</span>
                    <span className="text-tertiary font-semibold">98% Intact</span>
                  </div>
                  <div className="grid grid-cols-12 gap-1">
                    {[...Array(12)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-1.5 rounded-sm ${i === 7 || i === 8 ? 'bg-secondary' : 'bg-tertiary'}`}
                      ></div>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] font-mono text-outline">
                    <span>Organic Mechanisms</span>
                    <span className="text-primary font-semibold">91% Intact</span>
                  </div>
                  <div className="grid grid-cols-12 gap-1">
                    {[...Array(12)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-1.5 rounded-sm ${
                          i === 4 ? 'bg-primary/60' : i === 2 || i === 3 || i === 8 ? 'bg-secondary' : 'bg-tertiary'
                        }`}
                      ></div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-outline-variant text-[11px] font-mono">
                  <span className="text-outline">Algorithm: FSRS-4.5</span>
                  <button onClick={() => onNavigate('voice-quiz')} className="text-primary hover:underline cursor-pointer">
                    Open Anki Matrix →
                  </button>
                </div>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
};
