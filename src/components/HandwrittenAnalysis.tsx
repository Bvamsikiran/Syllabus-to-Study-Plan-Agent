import React, { useState } from 'react';
import { ScreenId, AnnotationPin } from '../types';
import { INITIAL_PINS } from '../data/mockData';

interface HandwrittenAnalysisProps {
  onNavigate: (screen: ScreenId) => void;
}

export const HandwrittenAnalysis: React.FC<HandwrittenAnalysisProps> = ({ onNavigate }) => {
  const [zoomLevel, setZoomLevel] = useState(100);
  const [showOcrLayer, setShowOcrLayer] = useState(true);
  const [showPins, setShowPins] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'insights' | 'errors' | 'rubric'>('all');
  const [pins] = useState<AnnotationPin[]>(INITIAL_PINS);
  const [activePinId, setActivePinId] = useState<number | null>(1);

  // AI Tutor chat state
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [isAskingTutor, setIsAskingTutor] = useState(false);
  const [compareModalOpen, setCompareModalOpen] = useState(false);

  const handleAskTutor = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!aiQuestion.trim()) return;

    setIsAskingTutor(true);
    setAiAnswer(null);

    try {
      const res = await fetch('/api/ai-tutor-ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: aiQuestion,
          context: 'Electrophilic addition of HBr to 3-methyl-1-butene and 1,2-hydride shift vs methyl shift',
        }),
      });
      const data = await res.json();
      setAiAnswer(data.answer || 'A 1,2-hydride shift occurs because it creates a more stable tertiary carbocation.');
    } catch {
      setAiAnswer(
        'A 1,2-hydride shift is kinetically and thermodynamically preferred here because shifting H⁻ directly converts a secondary carbocation into a highly stabilized tertiary carbocation center.'
      );
    } finally {
      setIsAskingTutor(false);
    }
  };

  const filteredPins = pins.filter((p) => {
    if (activeFilter === 'errors') return p.type === 'error';
    if (activeFilter === 'insights') return p.type === 'correct' || p.type === 'strategy';
    return true;
  });

  return (
    <div className="bg-background text-on-surface font-body antialiased min-h-screen flex flex-col selection:bg-primary-container selection:text-on-primary-container">
      {/* ================= TOP APP BAR ================= */}
      <header className="docked full-width top-0 sticky z-50 flex items-center justify-between px-4 h-14 w-full bg-background border-b border-outline-variant select-none">
        <div className="flex items-center gap-6">
          <button onClick={() => onNavigate('dashboard')} className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-primary-container flex items-center justify-center text-on-primary-container font-mono font-bold text-sm shadow-inner">
              Ψ
            </div>
            <span className="font-headline text-base font-semibold tracking-tight text-primary">Synapse AI</span>
            <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-surface-container-highest text-secondary-fixed border border-outline-variant tracking-wider">
              v4.0.2
            </span>
          </button>

          <nav className="hidden md:flex items-center gap-5 text-sm">
            <button className="text-primary font-medium border-b-2 border-primary pb-1">Problem Context</button>
            <button
              onClick={() => onNavigate('master-schedule')}
              className="text-on-surface-variant font-normal hover:text-on-surface pb-1 transition-colors"
            >
              Master Schedule
            </button>
            <button
              onClick={() => onNavigate('dashboard')}
              className="text-on-surface-variant font-normal hover:text-on-surface pb-1 transition-colors"
            >
              Dashboard
            </button>
            <button
              onClick={() => onNavigate('voice-quiz')}
              className="text-on-surface-variant font-normal hover:text-on-surface pb-1 transition-colors"
            >
              Voice Quiz
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onNavigate('master-schedule')}
            className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded transition-colors"
            title="Session Timer"
          >
            <span className="material-symbols-outlined text-[19px] leading-none">timer</span>
          </button>
          <button
            onClick={() => alert('Rubric: 10 pts max. 4 pts for intermediate, 3 pts for arrow pushing, 3 pts for stereochemistry.')}
            className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded transition-colors"
            title="Grading Parameters"
          >
            <span className="material-symbols-outlined text-[19px] leading-none">tune</span>
          </button>

          <div className="h-4 w-[1px] bg-outline-variant mx-1"></div>

          <button
            onClick={() => onNavigate('dashboard')}
            className="px-3 py-1.5 text-xs font-medium text-on-surface-variant hover:text-on-surface rounded border border-outline-variant hover:bg-surface-container active:scale-[0.98] transition-all cursor-pointer"
          >
            Exit Session
          </button>

          <button
            onClick={() => alert('Analysis report saved to your study plan archive!')}
            className="px-3.5 py-1.5 text-xs font-semibold text-on-primary bg-primary rounded hover:bg-opacity-90 active:scale-[0.98] transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px] leading-none">save</span>
            <span>Save Analysis</span>
          </button>

          <div className="w-7 h-7 rounded-full bg-surface-container-high border border-outline-variant flex items-center justify-center text-xs font-medium text-primary ml-1 ring-1 ring-outline-variant/60">
            DR
          </div>
        </div>
      </header>

      {/* ================= SUB-HEADER: CONTEXT BAR ================= */}
      <section className="bg-surface-container-low border-b border-outline-variant px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-on-surface-variant min-w-0">
          <span className="text-tertiary font-mono font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>
            MCAT Organic Chemistry
          </span>
          <span className="text-outline">/</span>
          <span className="text-on-surface font-medium truncate">Reaction Mechanisms</span>
          <span className="text-outline">•</span>
          <span className="text-on-surface font-semibold tracking-tight truncate text-primary">
            Problem 3 of 6: Electrophilic Addition & Carbocation Rearrangement
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 px-2.5 py-1 rounded bg-surface-container border border-outline-variant font-mono">
            <span className="text-secondary-fixed">Score:</span>
            <span className="font-bold text-tertiary">8.5</span>
            <span className="text-secondary">/ 10</span>
            <span className="text-[10px] text-tertiary-fixed-dim bg-tertiary-container/40 px-1 py-0.2 rounded font-sans font-medium ml-1">
              85%
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-container border border-outline-variant">
            <span className="w-1.5 h-1.5 rounded-full bg-error"></span>
            <span className="text-secondary-fixed">FSRS Difficulty:</span>
            <span className="font-medium text-on-surface">High (0.84)</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-container border border-primary/30 text-primary">
            <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
            <span className="font-medium tracking-tight">AI Vision 4.0 Analyzed</span>
          </div>

          <div className="h-4 w-[1px] bg-outline-variant mx-1 hidden sm:block"></div>

          <button
            onClick={() => onNavigate('voice-quiz')}
            className="px-3 py-1 rounded bg-primary text-on-primary font-semibold hover:bg-opacity-95 transition-all flex items-center gap-1 cursor-pointer"
          >
            <span>Next Problem</span>
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </button>
        </div>
      </section>

      {/* ================= MAIN SPLIT CANVAS ================= */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden bg-background">
        {/* LEFT COLUMN: Handwritten Sheet Viewer */}
        <div className="lg:col-span-6 flex flex-col border-b lg:border-b-0 lg:border-r border-outline-variant bg-surface-container-lowest relative">
          {/* Controls Bar */}
          <div className="p-3 bg-surface-container border-b border-outline-variant flex flex-wrap items-center justify-between gap-2 z-10">
            <div className="flex items-center gap-2">
              <button
                onClick={() => alert('Camera activated for high-resolution answer scan.')}
                className="px-3 py-1.5 rounded bg-surface-container-high border border-outline text-xs font-medium text-on-surface hover:border-primary transition-colors flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
              >
                <span className="material-symbols-outlined text-primary text-[16px]">photo_camera</span>
                <span>Snap with Camera</span>
              </button>
              <button
                onClick={() => alert('Uploaded new work sheet! Running OCR extraction...')}
                className="px-3 py-1.5 rounded bg-surface-container-high border border-outline-variant hover:border-outline text-xs font-medium text-on-surface-variant hover:text-on-surface transition-colors flex items-center gap-1.5 active:scale-95 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">upload_file</span>
                <span>Upload Answer Sheet</span>
              </button>
            </div>

            {/* Toolbar */}
            <div className="flex items-center gap-1 bg-surface-container-lowest p-1 rounded border border-outline-variant text-on-surface-variant">
              <button
                onClick={() => setZoomLevel((z) => Math.min(z + 10, 150))}
                className="p-1.5 hover:text-on-surface hover:bg-surface-container rounded cursor-pointer"
                title="Zoom In"
              >
                <span className="material-symbols-outlined text-[16px]">zoom_in</span>
              </button>
              <span className="text-[11px] font-mono px-1 select-none text-secondary">{zoomLevel}%</span>
              <button
                onClick={() => setZoomLevel((z) => Math.max(z - 10, 70))}
                className="p-1.5 hover:text-on-surface hover:bg-surface-container rounded cursor-pointer"
                title="Zoom Out"
              >
                <span className="material-symbols-outlined text-[16px]">zoom_out</span>
              </button>
              <button
                onClick={() => setZoomLevel(100)}
                className="p-1.5 hover:text-on-surface hover:bg-surface-container rounded cursor-pointer"
                title="Fit to Screen"
              >
                <span className="material-symbols-outlined text-[16px]">fit_screen</span>
              </button>

              <div className="h-3 w-[1px] bg-outline-variant mx-1"></div>

              <button
                onClick={() => setShowOcrLayer(!showOcrLayer)}
                className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium cursor-pointer transition ${
                  showOcrLayer
                    ? 'bg-primary/20 text-primary border border-primary/40'
                    : 'bg-surface-container text-on-surface-variant'
                }`}
              >
                <span className="material-symbols-outlined text-[13px]">document_scanner</span>
                <span>OCR Layer</span>
              </button>

              <button
                onClick={() => setShowPins(!showPins)}
                className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium cursor-pointer transition ${
                  showPins ? 'bg-primary/20 text-primary border border-primary/40' : 'bg-surface-container text-on-surface-variant'
                }`}
              >
                <span className="material-symbols-outlined text-[13px]">layers</span>
                <span>Pins (3)</span>
              </button>
            </div>
          </div>

          {/* Blueprint Grid Canvas */}
          <div className="flex-1 relative overflow-auto p-6 flex items-center justify-center blueprint-grid min-h-[580px] select-none custom-scrollbar">
            <div
              className="relative w-full max-w-[620px] bg-surface-container rounded-lg border border-outline-variant shadow-2xl p-6 overflow-hidden transition-transform duration-200"
              style={{ transform: `scale(${zoomLevel / 100})` }}
            >
              {/* Sheet Header */}
              <div className="border-b border-outline-variant pb-3 mb-5 flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-mono text-secondary tracking-widest uppercase">
                    EXAM SESSION ID: #CHEM-2024-MCAT-77B
                  </span>
                  <h2 className="text-sm font-semibold text-on-surface tracking-tight mt-0.5">
                    MCAT Chem/Phys Section • Free-Response Work Canvas
                  </h2>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-mono text-tertiary bg-tertiary-container/30 px-2 py-0.5 rounded border border-tertiary/20">
                    Verified Submission
                  </span>
                </div>
              </div>

              {/* Prompt Text */}
              <div className="text-xs text-on-surface-variant font-mono bg-surface-container-low p-2.5 rounded border border-outline-variant mb-6">
                <span className="text-primary font-bold">Prompt:</span> Treat 3-methyl-1-butene with aqueous HBr. Formulate the major thermodynamic product and illustrate the step-by-step carbocation mechanism including electron push arrows.
              </div>

              {/* Step 1 */}
              <div className="relative bg-surface-container-high/60 rounded p-4 border border-outline-variant/60 font-mono text-xs mb-6">
                <div className="text-[10px] uppercase tracking-wider text-secondary mb-2 flex items-center justify-between">
                  <span>Step 1: Electrophilic Protonation</span>
                  <span className="text-tertiary text-[11px]">✓ Valid Markovnikov Addition</span>
                </div>
                <div className="flex items-center justify-around py-3">
                  <div className="text-center font-mono">
                    <div className="text-on-surface font-semibold tracking-wide">H₂C = CH — CH(CH₃)₂</div>
                    <div className="text-[10px] text-secondary mt-1">3-methyl-1-butene</div>
                  </div>
                  <div className="flex items-center gap-1 text-primary">
                    <span className="material-symbols-outlined text-sm">add</span>
                    <span className="font-bold">H — Br</span>
                    <span className="material-symbols-outlined text-sm">east</span>
                  </div>
                  <div className="text-center font-mono">
                    <div className="text-on-surface font-semibold tracking-wide">H₃C — C⁺H — CH(CH₃)₂</div>
                    <div className="text-[10px] text-tertiary mt-1">Secondary (2°) Carbocation</div>
                  </div>
                </div>
              </div>

              {/* Step 2: Pin 1 (1,2-Hydride Shift) */}
              <div
                onClick={() => setActivePinId(1)}
                className={`relative rounded p-4 font-mono text-xs mb-6 transition-all cursor-pointer ${
                  activePinId === 1
                    ? 'border-2 border-tertiary bg-tertiary/10 ring-2 ring-tertiary/30'
                    : 'border-2 border-tertiary/50 bg-tertiary/5'
                }`}
              >
                {showPins && (
                  <div className="absolute -top-3.5 left-4 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface-container-lowest border-2 border-tertiary text-tertiary text-[11px] font-bold shadow-lg ring-2 ring-tertiary/20">
                    <span className="w-2 h-2 rounded-full bg-tertiary"></span>
                    <span>Pin 1: 1,2-Hydride Shift Identified</span>
                    <span className="text-[10px] bg-tertiary text-on-tertiary px-1 rounded font-mono">+4.0</span>
                  </div>
                )}

                <div className="pt-2">
                  {showOcrLayer && (
                    <>
                      <div className="text-[11px] text-tertiary font-sans italic mb-1 flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">edit</span>
                        <span>Handwritten annotation extracted by Vision OCR:</span>
                      </div>
                      <div className="p-3 bg-surface-container-lowest/80 rounded border border-outline-variant font-mono text-on-surface text-xs leading-relaxed mb-3">
                        <span className="text-secondary">&gt;</span> "2° carbocation rearranges via{' '}
                        <span className="bg-tertiary/25 text-tertiary-fixed font-bold px-1 rounded">1,2-H shift</span> to form more thermodynamically favored{' '}
                        <span className="text-tertiary font-bold">3° carbocation</span> intermediate before attack."
                      </div>
                    </>
                  )}

                  <div className="flex items-center justify-center gap-4 text-xs font-mono">
                    <span className="text-secondary-fixed">H₃C — C⁺H — CH(CH₃)₂</span>
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] text-tertiary font-bold">~H⁻ shift</span>
                      <span className="text-tertiary">━━━━▶</span>
                    </div>
                    <span className="text-primary font-bold">H₃C — CH₂ — C⁺(CH₃)₂</span>
                    <span className="text-[10px] text-tertiary bg-tertiary-container/40 px-1.5 py-0.5 rounded border border-tertiary/30">
                      Stable 3°
                    </span>
                  </div>
                </div>
              </div>

              {/* Step 3: Pin 2 & Pin 3 */}
              <div className="relative bg-surface-container-high/60 rounded p-4 border border-outline-variant font-mono text-xs">
                <div className="text-[10px] uppercase tracking-wider text-secondary mb-3 flex items-center justify-between">
                  <span>Step 3: Nucleophile Attack & Quench</span>
                  <span className="text-error text-[11px] font-semibold">2 Critical Annotations</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  {/* Pin 2 */}
                  <div
                    onClick={() => setActivePinId(2)}
                    className={`relative p-3 rounded bg-error-container/20 border-2 cursor-pointer transition-all ${
                      activePinId === 2 ? 'border-error ring-2 ring-error/40' : 'border-error/70'
                    }`}
                  >
                    {showPins && (
                      <div className="absolute -top-3.5 left-3 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface-container-lowest border-2 border-error text-error text-[11px] font-bold shadow-lg ring-2 ring-error/20">
                        <span className="w-2 h-2 rounded-full bg-error"></span>
                        <span>Pin 2: Inverted Arrow Pushing</span>
                        <span className="text-[10px] bg-error text-on-error px-1 rounded font-mono">-1.5</span>
                      </div>
                    )}
                    <div className="mt-2 text-center">
                      <div className="font-mono text-xs text-on-surface font-semibold mb-1">C⁺(CH₃)₂ ──▶ :Br:⁻</div>
                      <div className="text-[10px] text-error font-sans font-medium">
                        Student drew arrow starting at carbocation towards bromide!
                      </div>
                    </div>
                    <div className="mt-2 text-[10px] text-on-error-container bg-error-container/40 p-1.5 rounded font-mono text-center">
                      Violates convention: e⁻ flows nucleophile → electrophile
                    </div>
                  </div>

                  {/* Pin 3 */}
                  <div
                    onClick={() => setActivePinId(3)}
                    className={`relative p-3 rounded bg-surface-container-lowest border-2 cursor-pointer transition-all ${
                      activePinId === 3 ? 'border-amber-500 ring-2 ring-amber-500/40' : 'border-amber-500/60'
                    }`}
                  >
                    {showPins && (
                      <div className="absolute -top-3.5 left-3 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface-container-lowest border-2 border-amber-500 text-amber-400 text-[11px] font-bold shadow-lg ring-2 ring-amber-500/20">
                        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                        <span>Pin 3: Stereochemistry (±)</span>
                        <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1 rounded font-mono">
                          -0.0
                        </span>
                      </div>
                    )}
                    <div className="mt-2 text-center">
                      <div className="font-mono text-xs text-on-surface font-semibold mb-1">Product: 2-bromo-2-methylbutane</div>
                      <div className="text-[10px] text-amber-300 font-sans">
                        Final structure correct, but planar sp² face unnotated
                      </div>
                    </div>
                    <div className="mt-2 text-[10px] text-secondary-fixed bg-surface-container p-1.5 rounded font-mono text-center border border-outline-variant">
                      Missing racemic (±) designation
                    </div>
                  </div>
                </div>
              </div>

              {/* Document Footer */}
              <div className="mt-4 pt-3 border-t border-outline-variant flex items-center justify-between text-[11px] text-secondary font-mono">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px] text-tertiary">check_circle</span>
                  Chemistry Rule Parser: Passed (14 valid sub-tokens)
                </span>
                <span className="italic text-on-surface-variant font-sans">Page 1 of 1</span>
              </div>
            </div>
          </div>

          {/* Bottom Document Meta */}
          <div className="px-4 py-2.5 bg-surface-container border-t border-outline-variant flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-secondary-fixed">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[15px]">image</span>
              <span className="text-on-surface font-medium">handwritten_mechanism_p3.jpg</span>
              <span className="text-outline">•</span>
              <span>2.4 MB</span>
              <span className="text-outline">•</span>
              <span className="text-tertiary font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                OCR Confidence 97.8%
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-secondary">Capture: 14:02 EST</span>
              <span className="text-outline">•</span>
              <span className="text-secondary">Resolution: 3024 × 4032 px</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: AI Feedback & Annotations List */}
        <div className="lg:col-span-6 flex flex-col bg-background h-full overflow-hidden">
          {/* Top Section */}
          <div className="p-4 border-b border-outline-variant bg-surface-container-low">
            <div className="bg-surface-container rounded-lg border border-outline-variant p-4 shadow-sm">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-secondary font-semibold">
                    SYNAPSE AI RUBRIC EVALUATION
                  </span>
                  <h3 className="text-base font-headline font-bold text-on-surface tracking-tight mt-0.5">
                    Mechanistic Breakdown & Performance
                  </h3>
                </div>
                <div className="text-right">
                  <div className="flex items-baseline justify-end gap-1">
                    <span className="text-2xl font-extrabold text-primary font-mono tracking-tight">8.5</span>
                    <span className="text-xs text-secondary font-mono">/ 10.0</span>
                  </div>
                  <span className="text-[10px] text-tertiary font-mono uppercase font-semibold">85% • Proficient Master</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden flex mb-3">
                <div className="bg-tertiary h-full" style={{ width: '85%' }}></div>
                <div className="bg-error h-full" style={{ width: '15%' }}></div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-outline-variant text-xs">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-tertiary text-base">task_alt</span>
                  <div>
                    <span className="text-secondary block text-[10px]">Rubric Alignment</span>
                    <span className="font-medium text-on-surface font-mono">4 of 5 Criteria Met</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-base">psychology</span>
                  <div>
                    <span className="text-secondary block text-[10px]">Cognitive Mastery Index</span>
                    <span className="font-medium text-on-surface font-mono">Top 9% MCAT Pacing</span>
                  </div>
                </div>
              </div>

              <div className="mt-3 p-2.5 rounded bg-surface-container-lowest border border-outline-variant text-xs text-on-surface-variant flex items-start gap-2">
                <span className="material-symbols-outlined text-primary text-[17px] shrink-0 mt-0.5">insights</span>
                <p className="leading-relaxed">
                  <strong className="text-on-surface font-semibold">Diagnostic Summary:</strong> Strong mechanistic grasp with rapid identification of secondary-to-tertiary carbocation rearrangement. Primary deduction stems from arrow pushing convention inversion at the nucleophilic quench step.
                </p>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 mt-3 border-b border-outline-variant/60 pb-1 text-xs">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-3 py-1.5 rounded font-medium flex items-center gap-1.5 cursor-pointer ${
                  activeFilter === 'all'
                    ? 'bg-surface-container-highest text-primary border border-primary/30'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span>All Feedback</span>
                <span className="w-4 h-4 rounded-full bg-primary/20 text-[10px] flex items-center justify-center font-mono">
                  {pins.length}
                </span>
              </button>
              <button
                onClick={() => setActiveFilter('insights')}
                className={`px-3 py-1.5 rounded font-medium cursor-pointer ${
                  activeFilter === 'insights'
                    ? 'bg-surface-container-highest text-primary border border-primary/30'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Key Insights
              </button>
              <button
                onClick={() => setActiveFilter('errors')}
                className={`px-3 py-1.5 rounded font-medium flex items-center gap-1.5 cursor-pointer ${
                  activeFilter === 'errors'
                    ? 'bg-surface-container-highest text-primary border border-primary/30'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span>Errors & Fixes</span>
                <span className="w-4 h-4 rounded-full bg-error/20 text-error text-[10px] flex items-center justify-center font-mono font-bold">
                  1
                </span>
              </button>
              <button
                onClick={() => setActiveFilter('rubric')}
                className={`px-3 py-1.5 rounded font-medium cursor-pointer ${
                  activeFilter === 'rubric'
                    ? 'bg-surface-container-highest text-primary border border-primary/30'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Rubric Breakdown
              </button>
            </div>
          </div>

          {/* Feedback Cards List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 custom-scrollbar">
            {filteredPins.map((pin) => {
              const isSelected = activePinId === pin.id;

              if (pin.id === 1) {
                return (
                  <div
                    key={pin.id}
                    onClick={() => setActivePinId(pin.id)}
                    className={`rounded-lg bg-surface-container border p-4 transition-all shadow-sm cursor-pointer ${
                      isSelected ? 'border-tertiary ring-1 ring-tertiary/40' : 'border-tertiary/40 hover:border-tertiary'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-tertiary/15 border border-tertiary/50 text-tertiary flex items-center justify-center font-bold text-xs">
                          ✓
                        </span>
                        <h4 className="text-sm font-semibold text-on-surface tracking-tight">{pin.title}</h4>
                      </div>
                      <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-tertiary-container text-tertiary-fixed border border-tertiary/30">
                        {pin.points}
                      </span>
                    </div>
                    <p className="text-xs text-on-surface-variant leading-relaxed mb-3">{pin.description}</p>
                    <div className="bg-surface-container-lowest rounded p-2.5 border border-outline-variant text-xs font-mono text-secondary-fixed">
                      <span className="text-secondary text-[10px] block font-sans uppercase tracking-wider mb-1">OCR Text Match:</span>
                      <span className="text-tertiary">"</span>...rearranges via 1,2-H shift to form 3° carbocation intermediate...<span className="text-tertiary">"</span>
                    </div>
                    <div className="mt-3 pt-2.5 border-t border-outline-variant flex items-center justify-between text-[11px] text-tertiary font-medium">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[15px]">verified</span>
                        {pin.ruleMet}
                      </span>
                      <button className="text-on-surface-variant hover:text-on-surface text-[11px] underline">
                        View rubric rule
                      </button>
                    </div>
                  </div>
                );
              }

              if (pin.id === 2) {
                return (
                  <div
                    key={pin.id}
                    onClick={() => setActivePinId(pin.id)}
                    className={`rounded-lg bg-surface-container border p-4 transition-all shadow-sm cursor-pointer ${
                      isSelected ? 'border-error ring-1 ring-error/40' : 'border-error/50 hover:border-error'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-error-container/40 border border-error/60 text-error flex items-center justify-center font-bold text-xs">
                          ✕
                        </span>
                        <h4 className="text-sm font-semibold text-on-surface tracking-tight">{pin.title}</h4>
                      </div>
                      <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-error-container text-on-error-container border border-error/40">
                        {pin.points}
                      </span>
                    </div>
                    <p className="text-xs text-on-surface-variant leading-relaxed mb-3">{pin.description}</p>
                    <div className="bg-error-container/20 rounded p-3 border border-error/40 text-xs mb-3 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-error font-semibold">
                        <span className="material-symbols-outlined text-[15px]">warning</span>
                        <span>Remediation Rule: Tail at electrons, head at target</span>
                      </div>
                      <p className="text-on-surface-variant text-[11px] leading-normal">{pin.remediation}</p>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setCompareModalOpen(true);
                        }}
                        className="px-2.5 py-1.5 rounded bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant text-xs font-medium text-on-surface transition-colors flex items-center gap-1.5 active:scale-[0.98] cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-primary text-[15px]">compare</span>
                        <span>Compare with Canonical Mechanism</span>
                      </button>
                      <span className="text-[11px] text-secondary">2-min interactive drill</span>
                    </div>
                  </div>
                );
              }

              if (pin.id === 3) {
                return (
                  <div
                    key={pin.id}
                    onClick={() => setActivePinId(pin.id)}
                    className={`rounded-lg bg-surface-container border p-4 transition-all shadow-sm cursor-pointer ${
                      isSelected ? 'border-amber-500 ring-1 ring-amber-500/40' : 'border-amber-500/40 hover:border-amber-500'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-amber-500/15 border border-amber-500/50 text-amber-400 flex items-center justify-center font-bold text-xs">
                          ⚠
                        </span>
                        <h4 className="text-sm font-semibold text-on-surface tracking-tight">{pin.title}</h4>
                      </div>
                      <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
                        {pin.points}
                      </span>
                    </div>
                    <p className="text-xs text-on-surface-variant leading-relaxed mb-3">{pin.description}</p>
                    <div className="bg-surface-container-lowest rounded p-2 border border-outline-variant text-[11px] font-mono text-secondary flex items-center justify-between">
                      <span>Note: No penalty applied under current practice mode.</span>
                      <span className="text-amber-400 font-sans font-medium text-xs">High Exam Frequency</span>
                    </div>
                  </div>
                );
              }

              // Pin 4: Strategy
              return (
                <div
                  key={pin.id}
                  onClick={() => setActivePinId(pin.id)}
                  className={`rounded-lg bg-surface-container border p-4 transition-all shadow-sm cursor-pointer ${
                    isSelected ? 'border-primary ring-1 ring-primary/40' : 'border-primary/40 hover:border-primary'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-primary/20 border border-primary/50 text-primary flex items-center justify-center font-bold text-xs">
                        ✦
                      </span>
                      <h4 className="text-sm font-semibold text-on-surface tracking-tight">{pin.title}</h4>
                    </div>
                    <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-primary-container text-on-primary-container">
                      {pin.points}
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant leading-relaxed">{pin.description}</p>
                  <div className="mt-3 flex items-center gap-2 pt-2 border-t border-outline-variant text-[11px] text-secondary">
                    <span className="text-primary font-mono font-semibold">Pacing: 78 seconds</span>
                    <span>•</span>
                    <span>Cohort Average: 142 seconds</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sticky Panel Footer: Ask AI Tutor */}
          <div className="p-3 bg-surface-container border-t border-outline-variant space-y-2.5">
            {aiAnswer && (
              <div className="p-2.5 bg-primary/10 border border-primary/30 rounded text-xs text-on-surface leading-relaxed animate-fade-in relative">
                <button
                  onClick={() => setAiAnswer(null)}
                  className="absolute top-1.5 right-1.5 text-secondary hover:text-white"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
                <div className="font-semibold text-primary mb-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">psychology</span>
                  <span>AI Tutor Response:</span>
                </div>
                <p>{aiAnswer}</p>
              </div>
            )}

            <form onSubmit={handleAskTutor} className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-3 text-primary text-[18px] pointer-events-none">
                auto_awesome
              </span>
              <input
                type="text"
                value={aiQuestion}
                onChange={(e) => setAiQuestion(e.target.value)}
                placeholder="Ask AI Tutor about this problem (e.g. 'Why does 1,2-hydride beat methyl shift here?')..."
                className="w-full pl-9 pr-10 py-2 bg-surface-container-lowest border border-outline-variant rounded-md text-xs text-on-surface placeholder:text-secondary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-body"
              />
              <button
                type="submit"
                disabled={isAskingTutor || !aiQuestion.trim()}
                className="absolute right-1.5 p-1 text-primary hover:bg-surface-container rounded transition-colors disabled:opacity-40 cursor-pointer"
                title="Submit Question"
              >
                {isAskingTutor ? (
                  <span className="w-3.5 h-3.5 border-2 border-primary border-t-transparent rounded-full animate-spin inline-block"></span>
                ) : (
                  <span className="material-symbols-outlined text-[18px] leading-none">arrow_upward</span>
                )}
              </button>
            </form>

            <div className="flex items-center justify-between text-[11px] text-secondary px-1">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => alert('Regrade request submitted to Faculty Mentor Queue.')}
                  className="hover:text-on-surface transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[14px]">history_edu</span>
                  <span>Request Human Regrade</span>
                </button>
                <span className="text-outline">•</span>
                <button
                  onClick={() => alert('Inaccuracy flag logged for machine model calibration.')}
                  className="hover:text-error transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[14px]">flag</span>
                  <span>Flag Inaccuracy</span>
                </button>
              </div>
              <div className="flex items-center gap-1 text-secondary-fixed">
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                <span>Synapse Neural Core Active</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Compare Modal */}
      {compareModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container border border-outline-variant p-6 rounded-xl max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-outline-variant pb-2">
              <h3 className="font-bold text-sm text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">compare</span>
                Canonical Reaction Mechanism
              </h3>
              <button onClick={() => setCompareModalOpen(false)} className="text-secondary hover:text-white">
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>
            <div className="space-y-3 text-xs text-on-surface-variant font-mono bg-surface-container-lowest p-3 rounded border border-outline-variant">
              <div>
                <span className="text-tertiary font-bold">Step 1:</span> Alkene π-electrons attack proton of H-Br. Carbocation forms at C2 (Markovnikov).
              </div>
              <div>
                <span className="text-tertiary font-bold">Step 2:</span> Secondary carbocation at C2 induces 1,2-hydride shift from C3. Creates tertiary carbocation at C3.
              </div>
              <div>
                <span className="text-tertiary font-bold">Step 3:</span> Bromide ion (:Br:⁻) donates electron pair to C3⁺ (curved arrow from Br⁻ to C⁺).
              </div>
              <div className="text-primary font-bold">
                Product: 2-bromo-2-methylbutane (thermodynamic major product).
              </div>
            </div>
            <div className="text-right">
              <button
                onClick={() => setCompareModalOpen(false)}
                className="px-4 py-1.5 rounded bg-primary text-on-primary text-xs font-bold"
              >
                Close Drill
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
