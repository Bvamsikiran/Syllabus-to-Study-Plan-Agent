import React, { useState } from 'react';
import { ScreenId, ScheduleSlot, SlotType } from '../types';

interface Step3BandwidthProps {
  onNavigate: (screen: ScreenId) => void;
  slots: Record<string, ScheduleSlot>;
  setSlots: React.Dispatch<React.SetStateAction<Record<string, ScheduleSlot>>>;
}

const DAYS = [
  { id: 'mon', name: 'Monday', date: 'Oct 20' },
  { id: 'tue', name: 'Tuesday', date: 'Oct 21' },
  { id: 'wed', name: 'Wednesday', date: 'Oct 22' },
  { id: 'thu', name: 'Thursday', date: 'Oct 23' },
  { id: 'fri', name: 'Friday', date: 'Oct 24' },
  { id: 'sat', name: 'Saturday', date: 'Oct 25', isWeekend: true },
  { id: 'sun', name: 'Sunday', date: 'Oct 26', isWeekend: true },
];

export const Step3Bandwidth: React.FC<Step3BandwidthProps> = ({ onNavigate, slots, setSlots }) => {
  const [activePreset, setActivePreset] = useState<'student' | 'pro' | 'warrior'>('pro');

  const toggleSlot = (key: string, defaultHours: number, defaultLabel: string, defaultSub: string) => {
    setSlots((prev) => {
      const current = prev[key] || {
        day: key.split('-')[0],
        timeBlock: key.split('-')[1] as any,
        type: 'rest',
        hours: defaultHours,
        label: 'Rest / Off',
        sublabel: 'Standby',
      };

      const nextType: SlotType =
        current.type === 'rest'
          ? 'focus'
          : current.type === 'focus'
          ? 'spaced'
          : current.type === 'spaced'
          ? 'buffer'
          : 'rest';

      let label = 'Rest / Off';
      let sublabel = 'Standby';
      let hours = 0;

      if (nextType === 'focus') {
        label = 'Active Focus';
        sublabel = 'Core Syllabus';
        hours = defaultHours;
      } else if (nextType === 'spaced') {
        label = 'Flashcards';
        sublabel = 'Spaced Recall';
        hours = Math.min(1.5, defaultHours);
      } else if (nextType === 'buffer') {
        label = 'Adaptive Buffer';
        sublabel = 'AI Auto-Heal';
        hours = defaultHours * 0.75;
      }

      return {
        ...prev,
        [key]: {
          ...current,
          type: nextType,
          hours,
          label,
          sublabel,
        },
      };
    });
  };

  const applyPreset = (preset: 'student' | 'pro' | 'warrior') => {
    setActivePreset(preset);
    const newSlots: Record<string, ScheduleSlot> = {};

    DAYS.forEach((d) => {
      // Default to rest
      newSlots[`${d.id}-morning`] = { day: d.id, timeBlock: 'morning', type: 'rest', hours: 0, label: 'Rest / Off', sublabel: 'Standby' };
      newSlots[`${d.id}-afternoon`] = { day: d.id, timeBlock: 'afternoon', type: 'rest', hours: 0, label: 'Rest / Off', sublabel: 'Standby' };
      newSlots[`${d.id}-evening`] = { day: d.id, timeBlock: 'evening', type: 'rest', hours: 0, label: 'Rest / Off', sublabel: 'Standby' };
    });

    if (preset === 'student') {
      // 28-30 hrs
      DAYS.forEach((d) => {
        if (!d.isWeekend) {
          newSlots[`${d.id}-morning`] = { day: d.id, timeBlock: 'morning', type: 'focus', hours: 4.0, label: 'Active Focus', sublabel: 'Lecture Theory' };
          newSlots[`${d.id}-evening`] = { day: d.id, timeBlock: 'evening', type: 'spaced', hours: 1.5, label: 'Flashcards', sublabel: 'Active Recall' };
        }
      });
      newSlots['sat-morning'] = { day: 'sat', timeBlock: 'morning', type: 'focus', hours: 4.0, label: 'Mock Testing', sublabel: 'Full Sim' };
      newSlots['sun-afternoon'] = { day: 'sun', timeBlock: 'afternoon', type: 'buffer', hours: 3.0, label: 'Adaptive Buffer', sublabel: 'Auto-Healing' };
    } else if (preset === 'pro') {
      // 21.5 hrs (Screen 5 design matching)
      newSlots['mon-morning'] = { day: 'mon', timeBlock: 'morning', type: 'focus', hours: 4.0, label: 'Active Focus', sublabel: 'Core Syllabus' };
      newSlots['wed-morning'] = { day: 'wed', timeBlock: 'morning', type: 'focus', hours: 4.0, label: 'Active Focus', sublabel: 'Problem Sets' };
      newSlots['sat-morning'] = { day: 'sat', timeBlock: 'morning', type: 'focus', hours: 4.0, label: 'Active Focus', sublabel: 'Mock Testing' };

      newSlots['tue-afternoon'] = { day: 'tue', timeBlock: 'afternoon', type: 'focus', hours: 4.0, label: 'Active Focus', sublabel: 'Deep Review' };
      newSlots['sun-afternoon'] = { day: 'sun', timeBlock: 'afternoon', type: 'buffer', hours: 3.0, label: 'Adaptive Buffer', sublabel: 'AI Auto-Heals' };

      newSlots['mon-evening'] = { day: 'mon', timeBlock: 'evening', type: 'spaced', hours: 1.5, label: 'Flashcards', sublabel: 'Spaced Recall' };
      newSlots['wed-evening'] = { day: 'wed', timeBlock: 'evening', type: 'spaced', hours: 1.5, label: 'Flashcards', sublabel: 'Active Recall' };
      newSlots['thu-evening'] = { day: 'thu', timeBlock: 'evening', type: 'spaced', hours: 1.5, label: 'Quiz Sprint', sublabel: 'Quick Checks' };
      newSlots['sun-evening'] = { day: 'sun', timeBlock: 'evening', type: 'spaced', hours: 2.0, label: 'Weekly Prep', sublabel: 'Diagnostic Run' };
    } else {
      // Weekend Warrior (15-18 hrs)
      newSlots['sat-morning'] = { day: 'sat', timeBlock: 'morning', type: 'focus', hours: 5.0, label: 'Deep Focus', sublabel: 'Exams & Theory' };
      newSlots['sat-afternoon'] = { day: 'sat', timeBlock: 'afternoon', type: 'focus', hours: 4.0, label: 'Problem Drills', sublabel: 'QBank' };
      newSlots['sun-morning'] = { day: 'sun', timeBlock: 'morning', type: 'focus', hours: 4.0, label: 'Deep Focus', sublabel: 'High-Yield Units' };
      newSlots['sun-afternoon'] = { day: 'sun', timeBlock: 'afternoon', type: 'buffer', hours: 3.0, label: 'Adaptive Buffer', sublabel: 'Mistake Review' };
    }

    setSlots(newSlots);
  };

  const selectAllRow = (timeBlock: 'morning' | 'afternoon' | 'evening') => {
    setSlots((prev) => {
      const next = { ...prev };
      const hours = timeBlock === 'evening' ? 1.5 : 4.0;
      const type: SlotType = timeBlock === 'evening' ? 'spaced' : 'focus';
      DAYS.forEach((d) => {
        const key = `${d.id}-${timeBlock}`;
        next[key] = {
          day: d.id,
          timeBlock,
          type,
          hours,
          label: type === 'spaced' ? 'Flashcards' : 'Active Focus',
          sublabel: 'Selected Row',
        };
      });
      return next;
    });
  };

  const clearAll = () => {
    setSlots((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((k) => {
        next[k] = { ...next[k], type: 'rest', hours: 0, label: 'Rest / Off', sublabel: 'Standby' };
      });
      return next;
    });
  };

  // Calculations
  const allSlotList = Object.values(slots);
  const totalWeeklyHours = allSlotList.reduce((acc, s) => acc + (s.hours || 0), 0);
  const deepFocusHours = allSlotList.filter((s) => s.type === 'focus').reduce((acc, s) => acc + s.hours, 0);
  const spacedHours = allSlotList.filter((s) => s.type === 'spaced').reduce((acc, s) => acc + s.hours, 0);
  const bufferHours = allSlotList.filter((s) => s.type === 'buffer').reduce((acc, s) => acc + s.hours, 0);

  return (
    <div className="bg-background text-on-surface font-body antialiased min-h-screen flex flex-col selection:bg-primary selection:text-on-primary">
      {/* TOP APP BAR */}
      <header className="flex justify-between items-center w-full px-6 py-3 border-b border-outline-variant bg-background sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <button onClick={() => onNavigate('landing')} className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-primary/20"></span>
            <span className="text-base font-bold font-headline tracking-tight text-on-surface">Synapse AI</span>
            <span className="text-outline">/</span>
            <span className="font-mono text-xs text-on-surface-variant font-medium tracking-wider">STUDY ENGINE</span>
          </button>
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface-container-high border border-outline-variant text-[11px] font-mono text-primary font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
            INGESTION PIPELINE • Step 3 of 4
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8 text-sm">
          <button onClick={() => onNavigate('step1-upload')} className="text-on-surface-variant hover:text-on-surface">
            Upload Syllabus
          </button>
          <button onClick={() => onNavigate('step2-exam')} className="text-on-surface-variant hover:text-on-surface">
            Exam & Goals
          </button>
          <div className="text-primary font-medium border-b-2 border-primary pb-1">Study Bandwidth</div>
          <button onClick={() => onNavigate('step4-resources')} className="text-on-surface-variant hover:text-on-surface">
            AI Generation
          </button>
        </nav>

        {/* Trailing Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => applyPreset('pro')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded border border-outline-variant"
          >
            <span className="material-symbols-outlined text-[16px]">restart_alt</span>
            <span>Reset Grid</span>
          </button>
          <button
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-on-surface bg-surface-container border border-outline-variant hover:border-outline rounded"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
            <span>Save & Exit</span>
          </button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-28">
        {/* STEP PROGRESS TRACKER */}
        <section className="bg-surface-container border border-outline-variant rounded-lg p-3 sm:p-4 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {/* Step 1: Completed */}
            <button
              onClick={() => onNavigate('step1-upload')}
              className="flex items-center gap-3 p-2 rounded-lg bg-surface-container-low/60 border border-outline-variant/60 text-left hover:bg-surface-container-high transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-tertiary-container text-tertiary flex items-center justify-center font-bold text-xs shrink-0">
                <span className="material-symbols-outlined text-[16px]">check</span>
              </div>
              <div className="min-w-0">
                <div className="text-[10px] uppercase font-mono tracking-wider text-secondary">Step 1</div>
                <div className="text-xs font-medium text-on-surface truncate">Upload Syllabus</div>
              </div>
            </button>

            {/* Step 2: Completed */}
            <button
              onClick={() => onNavigate('step2-exam')}
              className="flex items-center gap-3 p-2 rounded-lg bg-surface-container-low/60 border border-outline-variant/60 text-left hover:bg-surface-container-high transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-tertiary-container text-tertiary flex items-center justify-center font-bold text-xs shrink-0">
                <span className="material-symbols-outlined text-[16px]">check</span>
              </div>
              <div className="min-w-0">
                <div className="text-[10px] uppercase font-mono tracking-wider text-secondary">Step 2</div>
                <div className="text-xs font-medium text-on-surface truncate">Exam & Goals</div>
              </div>
            </button>

            {/* Step 3: Active */}
            <div className="flex items-center gap-3 p-2 rounded-lg bg-primary/10 border border-primary ring-1 ring-primary/30">
              <div className="w-7 h-7 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-xs shrink-0 shadow-[0_0_12px_rgba(167,139,250,0.5)]">
                3
              </div>
              <div className="min-w-0">
                <div className="text-[10px] uppercase font-mono tracking-wider text-primary font-semibold">Active Pipeline</div>
                <div className="text-xs font-bold text-on-surface truncate">Study Bandwidth</div>
              </div>
            </div>

            {/* Step 4: Upcoming */}
            <button
              onClick={() => onNavigate('step4-resources')}
              className="flex items-center gap-3 p-2 rounded-lg bg-surface-container-low/40 border border-outline-variant/40 opacity-70 text-left hover:opacity-100 transition-opacity"
            >
              <div className="w-7 h-7 rounded-full bg-surface-container-high border border-outline-variant text-on-surface-variant flex items-center justify-center font-mono text-xs shrink-0">
                4
              </div>
              <div className="min-w-0">
                <div className="text-[10px] uppercase font-mono tracking-wider text-secondary">Step 4</div>
                <div className="text-xs font-medium text-on-surface-variant truncate">AI Generation</div>
              </div>
            </button>
          </div>
        </section>

        {/* HEADER TITLE & COGNITIVE BADGE */}
        <section className="mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container border border-outline-variant text-xs font-mono text-primary">
              <span className="material-symbols-outlined text-[16px]">tune</span>
              <span>Cognitive Load Calibration</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded bg-tertiary-container/30 border border-tertiary/30 text-tertiary text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-tertiary animate-ping"></span>
              <span>Optimal Pacing: High Retention Density</span>
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-headline font-bold tracking-tight text-on-surface">
            Set your weekly study bandwidth
          </h1>
          <p className="mt-2 text-sm sm:text-base text-on-surface-variant max-w-3xl leading-relaxed">
            Tap time blocks across the week to designate available focus windows. Synapse automatically places high-yield topics during peak focus hours and balances spaced recall sessions.
          </p>
        </section>

        {/* CONTROLS & PRESETS BAR */}
        <section className="bg-surface-container border border-outline-variant rounded-lg p-4 mb-6">
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
            {/* Quick Preset Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono text-on-surface-variant uppercase tracking-wider mr-1">Presets:</span>
              <button
                onClick={() => applyPreset('student')}
                className={`px-3 py-1.5 rounded border text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                  activePreset === 'student'
                    ? 'bg-primary/20 border-primary text-primary'
                    : 'bg-surface-container-high border-outline-variant hover:border-primary text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[14px] text-primary">school</span>
                Full-Time Student (25-30 hrs)
              </button>

              <button
                onClick={() => applyPreset('pro')}
                className={`px-3 py-1.5 rounded border text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                  activePreset === 'pro'
                    ? 'bg-primary/20 border-primary text-primary font-bold shadow-sm'
                    : 'bg-surface-container-high border-outline-variant hover:border-primary text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[14px]">work</span>
                Working Professional (15-20 hrs)
                <span className="material-symbols-outlined text-[14px]">check</span>
              </button>

              <button
                onClick={() => applyPreset('warrior')}
                className={`px-3 py-1.5 rounded border text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                  activePreset === 'warrior'
                    ? 'bg-primary/20 border-primary text-primary'
                    : 'bg-surface-container-high border-outline-variant hover:border-primary text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[14px] text-primary">bolt</span>
                Weekend Warrior
              </button>

              <div className="h-4 w-[1px] bg-outline-variant mx-1 hidden sm:block"></div>

              <button
                onClick={() => selectAllRow('morning')}
                className="px-2.5 py-1.5 rounded bg-surface-container-low border border-outline-variant hover:border-outline text-xs text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
              >
                Select All Mornings
              </button>
              <button
                onClick={clearAll}
                className="px-2.5 py-1.5 rounded bg-surface-container-low border border-outline-variant hover:border-error/50 hover:text-error text-xs text-on-surface-variant transition-colors cursor-pointer"
              >
                Clear All
              </button>
            </div>

            {/* Weekly Total & Status Indicator */}
            <div className="flex items-center gap-4 bg-surface-container-low px-4 py-2 rounded-lg border border-outline-variant self-start xl:self-auto">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">schedule</span>
                <div>
                  <div className="text-[10px] uppercase font-mono tracking-wider text-secondary">Weekly Dedicated</div>
                  <div className="text-sm font-bold font-mono text-on-surface">{totalWeeklyHours.toFixed(1)} Hours</div>
                </div>
              </div>
              <div className="h-6 w-[1px] bg-outline-variant"></div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-tertiary shadow-[0_0_8px_rgba(52,211,153,0.6)]"></span>
                <div>
                  <div className="text-[10px] uppercase font-mono tracking-wider text-secondary">Schedule Status</div>
                  <div className="text-xs font-semibold text-tertiary">Optimal Pacing</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* INTERACTIVE WEEKLY CALENDAR GRID */}
        <section className="bg-surface-container border border-outline-variant rounded-lg overflow-hidden mb-6">
          <div className="px-5 py-3 border-b border-outline-variant bg-surface-container-high/50 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 font-mono text-on-surface-variant">
              <span className="material-symbols-outlined text-[16px] text-primary">touch_app</span>
              <span>Click any card to cycle (Focus ➔ Spaced ➔ Buffer ➔ Rest)</span>
            </div>
            <div className="flex items-center gap-4 font-mono text-[11px] flex-wrap">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-primary/20 border border-primary"></span> Deep Focus (4h)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-primary-container/20 border border-primary-container"></span> Moderate/Spaced (3h)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-tertiary/20 border border-tertiary"></span> Adaptive Buffer
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-surface-container-low border border-dashed border-outline-variant"></span> Rest Slot
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[940px] p-4">
              {/* 7-Column Days Header */}
              <div className="grid grid-cols-7 gap-3 mb-3 text-center">
                {DAYS.map((d) => (
                  <div
                    key={d.id}
                    className={`p-2.5 rounded border border-outline-variant ${
                      d.isWeekend ? 'bg-surface-container-high/60' : 'bg-surface-container-high'
                    }`}
                  >
                    <div className={`text-xs font-semibold ${d.isWeekend ? 'text-primary' : 'text-on-surface'}`}>
                      {d.name}
                    </div>
                    <div className="text-[11px] font-mono text-secondary">{d.date}</div>
                  </div>
                ))}
              </div>

              {/* ROW 1: Morning Block */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2 px-1">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-primary">wb_sunny</span>
                    <span className="text-xs font-bold font-headline tracking-tight text-on-surface">Morning Block</span>
                    <span className="text-xs font-mono text-on-surface-variant">(08:00 - 12:00)</span>
                    <span className="px-2 py-0.2 rounded bg-primary/10 border border-primary/20 text-[10px] font-mono text-primary">
                      Peak Focus • 4h
                    </span>
                  </div>
                  <button
                    onClick={() => selectAllRow('morning')}
                    className="text-[11px] font-mono text-secondary hover:text-primary transition-colors cursor-pointer"
                  >
                    Select all row
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-3">
                  {DAYS.map((d) => {
                    const key = `${d.id}-morning`;
                    const slot = slots[key] || { type: 'rest', hours: 0, label: 'Rest / Off', sublabel: 'Standby' };
                    const isFocus = slot.type === 'focus';
                    const isBuffer = slot.type === 'buffer';
                    const isSpaced = slot.type === 'spaced';

                    if (isFocus) {
                      return (
                        <div
                          key={key}
                          onClick={() => toggleSlot(key, 4.0, 'Active Focus', 'Core Syllabus')}
                          className="group relative cursor-pointer p-3 rounded-lg bg-primary/15 border-2 border-primary shadow-[0_0_15px_rgba(167,139,250,0.15)] transition-all hover:bg-primary/20"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="material-symbols-outlined text-[16px] text-primary">check_circle</span>
                            <span className="text-[10px] font-mono font-bold text-primary">{slot.hours}h</span>
                          </div>
                          <div className="text-xs font-semibold text-on-surface">{slot.label}</div>
                          <div className="text-[10px] font-mono text-on-surface-variant">{slot.sublabel}</div>
                        </div>
                      );
                    }

                    if (isBuffer) {
                      return (
                        <div
                          key={key}
                          onClick={() => toggleSlot(key, 4.0, 'Adaptive Buffer', 'AI Auto-Heal')}
                          className="group relative cursor-pointer p-3 rounded-lg bg-tertiary/10 border-2 border-tertiary shadow-[0_0_15px_rgba(52,211,153,0.15)] transition-all hover:bg-tertiary/15"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="material-symbols-outlined text-[16px] text-tertiary">auto_awesome</span>
                            <span className="text-[10px] font-mono font-bold text-tertiary">{slot.hours}h</span>
                          </div>
                          <div className="text-xs font-semibold text-on-surface">{slot.label}</div>
                          <div className="text-[9px] font-mono text-tertiary-fixed-dim">{slot.sublabel}</div>
                        </div>
                      );
                    }

                    if (isSpaced) {
                      return (
                        <div
                          key={key}
                          onClick={() => toggleSlot(key, 4.0, 'Flashcards', 'Spaced Recall')}
                          className="group relative cursor-pointer p-3 rounded-lg bg-surface-container-highest border border-primary/50 hover:border-primary transition-all"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="material-symbols-outlined text-[16px] text-primary">cached</span>
                            <span className="text-[10px] font-mono font-semibold text-primary">{slot.hours}h</span>
                          </div>
                          <div className="text-xs font-medium text-on-surface">{slot.label}</div>
                          <div className="text-[10px] font-mono text-on-surface-variant">{slot.sublabel}</div>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={key}
                        onClick={() => toggleSlot(key, 4.0, 'Active Focus', 'Core Syllabus')}
                        className="group cursor-pointer p-3 rounded-lg bg-surface-container-low border border-dashed border-outline-variant hover:border-outline transition-all text-secondary hover:text-on-surface-variant flex flex-col justify-between min-h-[72px]"
                      >
                        <div className="flex justify-between items-center text-[10px] font-mono">
                          <span>Rest / Off</span>
                          <span className="material-symbols-outlined text-[14px]">add</span>
                        </div>
                        <div className="text-[11px] text-secondary font-mono">Standby</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ROW 2: Afternoon Block */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2 px-1">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-secondary-fixed">light_mode</span>
                    <span className="text-xs font-bold font-headline tracking-tight text-on-surface">Afternoon Block</span>
                    <span className="text-xs font-mono text-on-surface-variant">(13:00 - 17:00)</span>
                    <span className="px-2 py-0.2 rounded bg-surface-container-high border border-outline-variant text-[10px] font-mono text-on-surface-variant">
                      Moderate Retention • 4h
                    </span>
                  </div>
                  <button
                    onClick={() => selectAllRow('afternoon')}
                    className="text-[11px] font-mono text-secondary hover:text-primary transition-colors cursor-pointer"
                  >
                    Select all row
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-3">
                  {DAYS.map((d) => {
                    const key = `${d.id}-afternoon`;
                    const slot = slots[key] || { type: 'rest', hours: 0, label: 'Rest / Off', sublabel: 'Standby' };

                    if (slot.type === 'focus') {
                      return (
                        <div
                          key={key}
                          onClick={() => toggleSlot(key, 4.0, 'Active Focus', 'Deep Review')}
                          className="group relative cursor-pointer p-3 rounded-lg bg-primary/15 border-2 border-primary shadow-[0_0_15px_rgba(167,139,250,0.15)] transition-all hover:bg-primary/20"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="material-symbols-outlined text-[16px] text-primary">check_circle</span>
                            <span className="text-[10px] font-mono font-bold text-primary">{slot.hours}h</span>
                          </div>
                          <div className="text-xs font-semibold text-on-surface">{slot.label}</div>
                          <div className="text-[10px] font-mono text-on-surface-variant">{slot.sublabel}</div>
                        </div>
                      );
                    }

                    if (slot.type === 'buffer') {
                      return (
                        <div
                          key={key}
                          onClick={() => toggleSlot(key, 4.0, 'Adaptive Buffer', 'Auto-Healing')}
                          className="group relative cursor-pointer p-3 rounded-lg bg-tertiary/10 border-2 border-tertiary shadow-[0_0_15px_rgba(52,211,153,0.15)] transition-all hover:bg-tertiary/15"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="material-symbols-outlined text-[16px] text-tertiary">auto_awesome</span>
                            <span className="text-[10px] font-mono font-bold text-tertiary">{slot.hours}h Buffer</span>
                          </div>
                          <div className="text-xs font-semibold text-on-surface">{slot.label}</div>
                          <div className="text-[9px] font-mono text-tertiary-fixed-dim leading-tight mt-0.5">
                            AI Auto-Heals Missed Blocks
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={key}
                        onClick={() => toggleSlot(key, 4.0, 'Active Focus', 'Deep Review')}
                        className="group cursor-pointer p-3 rounded-lg bg-surface-container-low border border-dashed border-outline-variant hover:border-outline transition-all text-secondary hover:text-on-surface-variant flex flex-col justify-between min-h-[72px]"
                      >
                        <div className="flex justify-between items-center text-[10px] font-mono">
                          <span>Rest / Off</span>
                          <span className="material-symbols-outlined text-[14px]">add</span>
                        </div>
                        <div className="text-[11px] text-secondary font-mono">Standby</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ROW 3: Evening Block */}
              <div>
                <div className="flex items-center justify-between mb-2 px-1">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-primary">dark_mode</span>
                    <span className="text-xs font-bold font-headline tracking-tight text-on-surface">Evening Block</span>
                    <span className="text-xs font-mono text-on-surface-variant">(18:30 - 21:30)</span>
                    <span className="px-2 py-0.2 rounded bg-surface-container-high border border-outline-variant text-[10px] font-mono text-primary">
                      Spaced Review & Light Tasks • 3h
                    </span>
                  </div>
                  <button
                    onClick={() => selectAllRow('evening')}
                    className="text-[11px] font-mono text-secondary hover:text-primary transition-colors cursor-pointer"
                  >
                    Select all row
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-3">
                  {DAYS.map((d) => {
                    const key = `${d.id}-evening`;
                    const slot = slots[key] || { type: 'rest', hours: 0, label: 'Rest / Off', sublabel: 'Standby' };

                    if (slot.type === 'spaced' || slot.type === 'focus') {
                      return (
                        <div
                          key={key}
                          onClick={() => toggleSlot(key, 1.5, 'Flashcards', 'Active Recall')}
                          className="group relative cursor-pointer p-3 rounded-lg bg-surface-container-highest border border-primary/50 hover:border-primary transition-all"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="material-symbols-outlined text-[16px] text-primary">cached</span>
                            <span className="text-[10px] font-mono font-semibold text-primary">{slot.hours}h</span>
                          </div>
                          <div className="text-xs font-medium text-on-surface">{slot.label}</div>
                          <div className="text-[10px] font-mono text-on-surface-variant">{slot.sublabel}</div>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={key}
                        onClick={() => toggleSlot(key, 1.5, 'Flashcards', 'Spaced Recall')}
                        className="group cursor-pointer p-3 rounded-lg bg-surface-container-low border border-dashed border-outline-variant hover:border-outline transition-all text-secondary hover:text-on-surface-variant flex flex-col justify-between min-h-[72px]"
                      >
                        <div className="flex justify-between items-center text-[10px] font-mono">
                          <span>Rest / Off</span>
                          <span className="material-symbols-outlined text-[14px]">add</span>
                        </div>
                        <div className="text-[11px] text-secondary font-mono">Standby</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BOTTOM SUMMARY MATRIX CARD */}
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-surface-container border border-outline-variant rounded-lg p-4">
            <div className="flex items-center justify-between text-secondary mb-2">
              <span className="text-[11px] font-mono uppercase tracking-wider">Deep Focus</span>
              <span className="material-symbols-outlined text-[18px] text-primary">psychology</span>
            </div>
            <div className="text-2xl font-bold font-mono text-on-surface">{deepFocusHours.toFixed(1)} hrs</div>
            <div className="mt-2 flex items-center gap-1.5 text-xs text-on-surface-variant">
              <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
              <span>Optimal for complex theory parsing</span>
            </div>
          </div>

          <div className="bg-surface-container border border-outline-variant rounded-lg p-4">
            <div className="flex items-center justify-between text-secondary mb-2">
              <span className="text-[11px] font-mono uppercase tracking-wider">Spaced Repetition</span>
              <span className="material-symbols-outlined text-[18px] text-primary">replay</span>
            </div>
            <div className="text-2xl font-bold font-mono text-on-surface">{spacedHours.toFixed(1)} hrs</div>
            <div className="mt-2 flex items-center gap-1.5 text-xs text-on-surface-variant">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-container"></span>
              <span>Retains 92% memory decay rate</span>
            </div>
          </div>

          <div className="bg-surface-container border border-outline-variant rounded-lg p-4">
            <div className="flex items-center justify-between text-secondary mb-2">
              <span className="text-[11px] font-mono uppercase tracking-wider">Adaptive Buffer</span>
              <span className="material-symbols-outlined text-[18px] text-tertiary">shield</span>
            </div>
            <div className="text-2xl font-bold font-mono text-tertiary">{bufferHours.toFixed(1)} hrs</div>
            <div className="mt-2 flex items-center gap-1.5 text-xs text-tertiary-fixed-dim">
              <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
              <span>Zero burnout insurance</span>
            </div>
          </div>

          <div className="bg-surface-container-high border border-outline-variant rounded-lg p-4 relative overflow-hidden flex flex-col justify-between">
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-primary/10 rounded-full blur-xl pointer-events-none"></div>
            <div>
              <div className="flex items-center justify-between text-secondary mb-1">
                <span className="text-[11px] font-mono uppercase tracking-wider">Projected Coverage</span>
                <span className="material-symbols-outlined text-[18px] text-tertiary">verified</span>
              </div>
              <div className="text-base font-bold text-on-surface mt-1">100% of Syllabus parsed</div>
              <div className="text-xs font-mono text-tertiary mt-0.5">by Nov 23 (5 days ahead)</div>
            </div>
            <div className="w-full bg-surface-container-lowest rounded-full h-1.5 mt-3 border border-outline-variant overflow-hidden">
              <div className="bg-gradient-to-r from-primary to-tertiary h-1.5 rounded-full" style={{ width: '100%' }}></div>
            </div>
          </div>
        </section>
      </main>

      {/* STICKY BOTTOM FOOTER */}
      <footer className="fixed bottom-0 left-0 w-full z-50 flex justify-between items-center px-6 py-4 border-t border-outline-variant bg-surface-container-lowest">
        <button
          onClick={() => onNavigate('step2-exam')}
          className="flex items-center gap-2 text-on-surface-variant hover:border-outline hover:text-on-surface border border-outline-variant px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Back</span>
        </button>

        <div className="hidden sm:flex items-center gap-3 font-mono text-xs text-on-surface-variant">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span className="text-on-surface font-medium">Step 3 of 4: Study Bandwidth</span>
          </span>
          <span className="text-outline">•</span>
          <span>Next: AI Engine Schedule Generation</span>
        </div>

        <button
          onClick={() => onNavigate('step4-resources')}
          className="flex items-center gap-2 bg-primary text-on-primary font-medium px-5 py-2.5 rounded-lg text-sm shadow-[0_0_20px_rgba(167,139,250,0.35)] hover:bg-primary/90 transition-all cursor-pointer active:scale-95"
        >
          <span>Generate Smart Schedule</span>
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
      </footer>
    </div>
  );
};
