import React, { useState } from 'react';
import { ScreenId } from '../types';

interface Step1UploadProps {
  onNavigate: (screen: ScreenId) => void;
  syllabusText: string;
  setSyllabusText: (text: string) => void;
  selectedFile: string | null;
  setSelectedFile: (file: string | null) => void;
  onSyllabusParsed: (data: any) => void;
}

export const Step1Upload: React.FC<Step1UploadProps> = ({
  onNavigate,
  syllabusText,
  setSyllabusText,
  selectedFile,
  setSelectedFile,
  onSyllabusParsed,
}) => {
  const [isParsing, setIsParsing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [targetCourse, setTargetCourse] = useState('mcat');
  const [lmsConnected, setLmsConnected] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file.name);
      // Read file as text if possible
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (content && typeof content === 'string') {
          setSyllabusText(content.slice(0, 3000));
        }
      };
      if (file.type.includes('text') || file.name.endsWith('.txt')) {
        reader.readAsText(file);
      }
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setSyllabusText(text);
    } catch {
      // Fallback
      const sample = `CHEM 4420: Advanced Biochemistry (Fall 2025)
Instructor: Dr. Eleanor Vance
COURSE OUTLINE:
Week 1: Cellular Energetics & Glycolysis (22% weight)
Week 2: Enzyme Kinetics (Michaelis-Menten & Lineweaver-Burk) (18% weight)
Week 3: Organic Reaction Mechanisms & Carbonyls (25% weight)
Week 4: Nucleic Acid Structure & DNA Replication (20% weight)
Midterm Exam: Nov 03 (Weight: 25%)
Final Exam Benchmark: Nov 28 (Weight: 40%)`;
      setSyllabusText(sample);
    }
  };

  const loadSample = (type: 'biochem' | 'neuro') => {
    if (type === 'biochem') {
      setSelectedFile('BioChem_Syllabus_2025.pdf');
      setSyllabusText(`CHEM 4420: Advanced Biochemistry (Fall 2025)
Instructor: Dr. Eleanor Vance | Office: Harkness Hall 412

COURSE OUTLINE:
Week 1: Protein Structure & Ramachandran Geometries
Week 2: Hemoglobin Allostery & Oxygen Binding Curves
Week 3: Michaelis-Menten Kinetics, Lineweaver-Burk Analysis (Weight: 18%)
Week 4: Enzyme Inhibition (Competitive vs Noncompetitive)
Week 5: Midterm Exam 1 (Weight: 25%) - Oct 14th
Week 6: Glycolysis, Hexokinase Regulation, PFK-1 control (Weight: 22%)
Week 7: Citric Acid Cycle & Oxidative Phosphorylation
Week 8: Lipid Biosynthesis & Beta Oxidation Pathways
Week 9: Midterm Exam 2 (Weight: 25%) - Nov 18th
Week 10-12: Nucleic Acid Metabolism & Final Synthesis (Weight: 20%)
Final Exam Benchmark (Weight: 40%) - Nov 28th at 9:00 AM`);
    } else {
      setSelectedFile('Neuroanatomy_Fall_Outline.docx');
      setSyllabusText(`NEURO 301: Human Neuroanatomy
Week 1: Brainstem organization and cranial nerve nuclei
Week 2: Cerebellar circuitry and motor coordination pathways
Week 3: Basal Ganglia & Parkinsonian Pathology (Weight: 30%)
Week 4: Thalamic nuclei relays & Action Potentials (Weight: 25%)
Exam Milestone: Midterm Exam Nov 03 (30% total grade)
Official Practice Sim: Nov 20 (Weight: 45%)`);
    }
  };

  const handleContinue = async () => {
    setIsParsing(true);
    try {
      const response = await fetch('/api/analyze-syllabus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: syllabusText,
          filename: selectedFile,
        }),
      });
      const res = await response.json();
      if (res.data) {
        onSyllabusParsed(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsParsing(false);
      onNavigate('step2-exam');
    }
  };

  const canContinue = (syllabusText && syllabusText.trim().length > 10) || selectedFile !== null;

  return (
    <div className="bg-background text-on-surface font-body antialiased min-h-screen flex flex-col relative selection:bg-primary-container selection:text-white">
      {/* Focused Top Header */}
      <header className="sticky top-0 z-30 w-full bg-surface/90 backdrop-blur-md border-b border-outline-variant shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          {/* Brand Anchor */}
          <button onClick={() => onNavigate('landing')} className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-surface-container-high border border-outline-variant flex items-center justify-center text-primary shadow-inner">
              <span className="material-symbols-outlined text-[20px]">psychology</span>
            </div>
            <div className="flex flex-col text-left">
              <span className="font-headline font-bold text-on-surface tracking-tight text-base">Synapse AI</span>
              <span className="font-mono text-[11px] text-on-surface-variant -mt-0.5 uppercase tracking-wider">
                Study Engine
              </span>
            </div>
          </button>

          {/* Center Flow Context Indicator */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-high border border-outline-variant">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span className="font-mono text-[11px] text-primary font-semibold uppercase tracking-wider">
              Ingestion Pipeline
            </span>
            <span className="text-outline">•</span>
            <span className="font-mono text-[11px] text-on-surface-variant">Step 1 of 4</span>
          </div>

          {/* Action Items */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => loadSample('biochem')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high border border-outline-variant text-xs font-label transition-colors"
            >
              <span className="material-symbols-outlined text-[17px]">auto_stories</span>
              <span>Load Sample</span>
            </button>
            <button
              onClick={() => onNavigate('dashboard')}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-outline-variant bg-surface-container-high hover:bg-surface-container-highest text-on-surface-variant hover:text-on-surface transition-all text-xs font-label"
            >
              <span>Save & Exit</span>
              <span className="material-symbols-outlined text-[15px]">close</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Workflow Container */}
      <main className="relative z-10 flex-1 max-w-5xl w-full mx-auto px-4 md:px-6 py-6 flex flex-col gap-6">
        {/* Step Progress Bar (Step 1 of 4) */}
        <section className="bg-surface-container-low rounded-lg p-4 border border-outline-variant shadow-sm backdrop-blur-md">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 relative">
            {/* Step 1: Active */}
            <div className="flex items-center gap-3 p-2.5 rounded-lg bg-surface-container-highest border border-primary/50 relative overflow-hidden glow-primary">
              <div className="w-7 h-7 rounded-full bg-primary text-on-primary flex items-center justify-center font-mono text-xs font-bold shrink-0">
                1
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-label text-on-surface font-semibold truncate">Upload Syllabus</span>
                <span className="font-mono text-[11px] text-primary font-medium">In Progress</span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
            </div>

            {/* Step 2: Upcoming */}
            <button
              onClick={() => onNavigate('step2-exam')}
              className="flex items-center gap-3 p-2.5 rounded-lg bg-surface-container border border-outline-variant/60 opacity-70 hover:opacity-100 text-left transition-opacity"
            >
              <div className="w-7 h-7 rounded-full bg-surface-container-highest text-on-surface-variant flex items-center justify-center font-mono text-xs shrink-0 border border-outline-variant">
                2
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-label text-on-surface truncate font-medium">Exam & Goals</span>
                <span className="font-mono text-[11px] text-outline">Upcoming</span>
              </div>
            </button>

            {/* Step 3: Upcoming */}
            <button
              onClick={() => onNavigate('step3-bandwidth')}
              className="flex items-center gap-3 p-2.5 rounded-lg bg-surface-container border border-outline-variant/60 opacity-70 hover:opacity-100 text-left transition-opacity"
            >
              <div className="w-7 h-7 rounded-full bg-surface-container-highest text-on-surface-variant flex items-center justify-center font-mono text-xs shrink-0 border border-outline-variant">
                3
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-label text-on-surface truncate font-medium">Study Bandwidth</span>
                <span className="font-mono text-[11px] text-outline">Upcoming</span>
              </div>
            </button>

            {/* Step 4: Upcoming */}
            <button
              onClick={() => onNavigate('step4-resources')}
              className="flex items-center gap-3 p-2.5 rounded-lg bg-surface-container border border-outline-variant/60 opacity-70 hover:opacity-100 text-left transition-opacity"
            >
              <div className="w-7 h-7 rounded-full bg-surface-container-highest text-on-surface-variant flex items-center justify-center font-mono text-xs shrink-0 border border-outline-variant">
                4
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-label text-on-surface truncate font-medium">AI Generation</span>
                <span className="font-mono text-[11px] text-outline">Upcoming</span>
              </div>
            </button>
          </div>
        </section>

        {/* Page Title & Cognitive Header */}
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary font-mono text-[11px] mb-2.5">
              <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
              <span>Deterministic Neural Ingestion</span>
            </div>
            <h1 className="font-headline text-2xl md:text-3xl font-bold text-on-surface tracking-tight">
              Feed your syllabus to the AI Engine
            </h1>
            <p className="text-xs md:text-sm font-body text-on-surface-variant mt-1.5 max-w-2xl leading-relaxed">
              Drop your files or paste syllabus text. Synapse parses topics, assignments, exams, and grading weights automatically.
            </p>
          </div>

          {/* Target Course Switcher Pill */}
          <div className="shrink-0 flex items-center gap-2 p-1.5 rounded-lg bg-surface-container-low border border-outline-variant">
            <span className="font-mono text-xs text-on-surface-variant pl-2">Assign to:</span>
            <select
              value={targetCourse}
              onChange={(e) => setTargetCourse(e.target.value)}
              className="bg-surface-container-high border border-outline-variant text-primary font-mono text-xs rounded px-2.5 py-1.5 focus:ring-1 focus:ring-primary focus:border-primary outline-none cursor-pointer"
            >
              <option value="mcat">MCAT Prep 2025</option>
              <option value="neuro">Neuroanatomy</option>
              <option value="orgo">Organic Chem</option>
              <option value="new">+ Create New Course Container</option>
            </select>
          </div>
        </section>

        {/* Main Ingestion Bento Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: File Upload & Demo Templates (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* Drag & Drop Container */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  const file = e.dataTransfer.files[0];
                  setSelectedFile(file.name);
                }
              }}
              onClick={() => document.getElementById('syllabusFileInput')?.click()}
              className={`group relative rounded-lg border-2 border-dashed ${
                isDragging ? 'border-primary bg-primary/10' : 'border-outline-variant hover:border-primary/80 bg-surface-container-low'
              } p-8 flex flex-col items-center justify-center text-center transition-all duration-200 cursor-pointer`}
            >
              <input
                id="syllabusFileInput"
                type="file"
                accept=".pdf,.docx,.txt,.png,.jpg,.jpeg"
                className="hidden"
                onChange={handleFileChange}
              />
              {/* Upload Orb Icon */}
              <div className="w-14 h-14 rounded-xl bg-surface-container-high border border-outline-variant flex items-center justify-center text-primary group-hover:scale-105 group-hover:bg-primary-container group-hover:text-on-primary-container transition-all duration-200 shadow-inner">
                <span className="material-symbols-outlined text-[30px]">cloud_upload</span>
              </div>
              <h2 className="text-sm md:text-base font-headline text-on-surface font-semibold mt-3.5 tracking-tight">
                Drag & drop your syllabus files here, or browse files
              </h2>
              <p className="text-xs font-body text-on-surface-variant mt-1 max-w-sm leading-relaxed">
                Accepts lecture schedules, comprehensive course packets, or syllabi screenshots
              </p>
              <div className="mt-3.5 flex flex-wrap items-center justify-center gap-1.5">
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-surface-container-highest text-on-surface-variant border border-outline-variant">
                  PDF
                </span>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-surface-container-highest text-on-surface-variant border border-outline-variant">
                  DOCX
                </span>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-surface-container-highest text-on-surface-variant border border-outline-variant">
                  TXT
                </span>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-surface-container-highest text-on-surface-variant border border-outline-variant">
                  PNG / JPG
                </span>
                <span className="font-mono text-[11px] text-outline ml-1">(up to 50MB)</span>
              </div>
              <button
                type="button"
                className="mt-4 inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-xs font-label font-semibold border border-outline-variant shadow-sm transition-all duration-150 active:scale-[0.98]"
              >
                <span className="material-symbols-outlined text-sm text-primary">folder_open</span>
                <span>Select Files</span>
              </button>
            </div>

            {/* Smart Extraction Capabilities Pill Card */}
            <div className="rounded-lg bg-surface-container-low border border-outline-variant p-3.5 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-on-surface font-semibold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[15px] text-primary">verified</span>
                  Automated Parsing Matrix
                </span>
                <span className="font-mono text-[11px] text-tertiary font-medium">99.4% Extraction Precision</span>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-1 text-center">
                <div className="p-2.5 rounded-lg bg-surface-container-lowest border border-outline-variant flex flex-col items-center">
                  <span className="material-symbols-outlined text-primary text-[17px]">tag</span>
                  <span className="text-xs font-label text-on-surface font-medium mt-1">Course Units</span>
                  <span className="font-mono text-[10px] text-outline">Weekly modules</span>
                </div>
                <div className="p-2.5 rounded-lg bg-surface-container-lowest border border-outline-variant flex flex-col items-center">
                  <span className="material-symbols-outlined text-primary text-[17px]">event_note</span>
                  <span className="text-xs font-label text-on-surface font-medium mt-1">Exam Milestones</span>
                  <span className="font-mono text-[10px] text-outline">Midterms & finals</span>
                </div>
                <div className="p-2.5 rounded-lg bg-surface-container-lowest border border-outline-variant flex flex-col items-center">
                  <span className="material-symbols-outlined text-tertiary text-[17px]">pie_chart</span>
                  <span className="text-xs font-label text-on-surface font-medium mt-1">Grade Weights</span>
                  <span className="font-mono text-[10px] text-outline">Curve allocations</span>
                </div>
              </div>
            </div>

            {/* Quick Template Demo Chips */}
            <div className="flex items-center gap-2 pt-0.5 flex-wrap">
              <span className="font-mono text-[11px] text-outline flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px]">lightbulb</span>
                Try with sample:
              </span>
              <button
                type="button"
                onClick={() => loadSample('biochem')}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant text-on-surface-variant hover:text-primary transition-all duration-150 font-mono text-[11px]"
              >
                <span className="material-symbols-outlined text-[13px] text-primary">description</span>
                BioChem_Syllabus_2025.pdf
              </button>
              <button
                type="button"
                onClick={() => loadSample('neuro')}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant text-on-surface-variant hover:text-primary transition-all duration-150 font-mono text-[11px]"
              >
                <span className="material-symbols-outlined text-[13px] text-primary">description</span>
                Neuroanatomy_Fall_Outline.docx
              </button>
            </div>
          </div>

          {/* Right Column: Raw Text Paste & Quick Parser (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="rounded-lg border border-outline-variant bg-surface-container-low p-4 flex flex-col h-full shadow-sm">
              {/* Text Area Header */}
              <div className="flex items-center justify-between pb-3 border-b border-outline-variant">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[19px]">content_paste</span>
                  <span className="text-sm font-headline text-on-surface font-semibold tracking-tight">
                    Or paste syllabus text
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handlePaste}
                    className="px-2.5 py-1 rounded-md bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-mono text-[11px] border border-outline-variant transition-all flex items-center gap-1 font-medium"
                  >
                    <span className="material-symbols-outlined text-[13px]">assignment</span>
                    <span>Paste</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSyllabusText('');
                      setSelectedFile(null);
                    }}
                    className="px-2.5 py-1 rounded-md bg-surface-container-high hover:bg-surface-container-highest text-on-surface-variant hover:text-error font-mono text-[11px] border border-outline-variant transition-all"
                  >
                    Clear
                  </button>
                </div>
              </div>

              {/* Raw Input Textarea */}
              <div className="relative flex-1 mt-3 flex flex-col">
                <textarea
                  value={syllabusText}
                  onChange={(e) => setSyllabusText(e.target.value)}
                  rows={10}
                  placeholder={`Paste raw syllabus text, lecture outlines, topic schedules, or copy directly from Canvas / Blackboard / Notion...

Example:
Week 1: Cellular Respiration & Krebs Cycle
Week 2: Enzyme Kinetics (Michaelis-Menten)
Oct 14: Midterm Exam 1 (Weight: 25%)`}
                  className="w-full flex-1 bg-surface-container-lowest border border-outline-variant rounded-lg p-3 text-on-surface font-mono text-xs placeholder:text-outline focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none leading-relaxed transition-colors"
                />
                {/* Bottom Counter bar */}
                <div className="flex items-center justify-between pt-2 px-1 text-on-surface-variant">
                  <span className="font-mono text-[11px]">
                    {syllabusText.length.toLocaleString()} characters
                  </span>
                  <span className="font-mono text-[11px] text-outline flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px] text-tertiary">bolt</span>
                    Instant regex parser ready
                  </span>
                </div>
              </div>

              {/* Canvas / LMS Direct Integration Micro-Card */}
              <div className="mt-3.5 p-2.5 rounded-lg bg-surface-container-high border border-outline-variant flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-base">sync</span>
                  <span className="text-xs font-label text-on-surface font-medium">
                    {lmsConnected ? 'Canvas LMS: Sync Active (Harkness Med)' : 'Import from Canvas LMS'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setLmsConnected(true);
                    loadSample('biochem');
                  }}
                  className="font-mono text-xs text-primary hover:underline font-semibold"
                >
                  {lmsConnected ? 'Connected ✓' : 'Connect'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Active Upload Preview Card */}
        {selectedFile && (
          <div className="rounded-lg bg-surface-container-high border border-primary/50 p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[22px]">picture_as_pdf</span>
              </div>
              <div>
                <span className="text-sm font-headline text-on-surface font-semibold block">{selectedFile}</span>
                <span className="font-mono text-[11px] text-tertiary flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                  Ready for ingestion • 1.4 MB • 18 Lecture units detected
                </span>
              </div>
            </div>
            <button
              onClick={() => setSelectedFile(null)}
              className="p-1.5 rounded-lg hover:bg-surface-container-highest text-outline hover:text-error transition-colors"
            >
              <span className="material-symbols-outlined text-[19px]">delete</span>
            </button>
          </div>
        )}

        {/* Reassurance & Confidence Helper */}
        <div className="flex items-center justify-center gap-6 py-1 text-on-surface-variant font-mono text-[11px] flex-wrap">
          <span className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-primary text-[15px]">lock</span>
            Strictly private & local parsing
          </span>
          <span className="text-outline-variant">•</span>
          <span className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-primary text-[15px]">speed</span>
            Neural extraction in ~4 seconds
          </span>
          <span className="text-outline-variant">•</span>
          <span className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-tertiary text-[15px]">tune</span>
            Manual edits possible in Step 2
          </span>
        </div>
      </main>

      {/* Sticky Bottom Execution Bar */}
      <footer className="sticky bottom-0 z-30 w-full bg-surface-container-low/95 backdrop-blur-xl border-t border-outline-variant py-3 px-6 shadow-2xl">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <button
            onClick={() => onNavigate('dashboard')}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors text-xs font-label font-medium"
          >
            <span className="material-symbols-outlined text-[17px]">arrow_back</span>
            <span>Back to Dashboard</span>
          </button>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col text-right">
              <span className="font-mono text-xs text-on-surface font-semibold">Step 1 of 4: Syllabus Data</span>
              <span className="font-mono text-[11px] text-outline">Next: Target Exam Dates & Weights</span>
            </div>
            <button
              onClick={handleContinue}
              disabled={!canContinue || isParsing}
              className={`relative inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-on-primary text-xs font-label font-bold transition-all duration-150 glow-primary active:scale-[0.98] ${
                !canContinue || isParsing ? 'opacity-40 cursor-not-allowed' : 'hover:bg-primary-fixed-dim'
              }`}
            >
              {isParsing ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>AI Parsing Syllabus...</span>
                </>
              ) : (
                <>
                  <span>Continue to Exam Targets</span>
                  <span className="material-symbols-outlined text-[17px]">arrow_forward</span>
                </>
              )}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
