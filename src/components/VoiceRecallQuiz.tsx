import React, { useState, useEffect } from 'react';
import { ScreenId } from '../types';

interface VoiceRecallQuizProps {
  onNavigate: (screen: ScreenId) => void;
}

export const VoiceRecallQuiz: React.FC<VoiceRecallQuizProps> = ({ onNavigate }) => {
  const [isRecording, setIsRecording] = useState(true);
  const [recordingSeconds, setRecordingSeconds] = useState(24);
  const [quizTimer, setQuizTimer] = useState(105); // 01:45
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [retentionDelta, setRetentionDelta] = useState('+1.4%');

  const [transcript, setTranscript] = useState(
    'A competitive inhibitor competes directly with the substrate for the active site of the free enzyme. Because of this competition, increasing substrate concentration can overcome the inhibition, so the maximal velocity Vmax remains unchanged. However, the apparent affinity decreases, which causes the Michaelis constant Km to increase. On a Lineweaver-Burk plot, since the y-intercept is 1/Vmax, it stays the same, while the slope Km/Vmax increases and the x-intercept shifts closer to the origin'
  );

  const [diagnosticFeedback, setDiagnosticFeedback] = useState({
    correct1: {
      title: '✓ Correctly Articulated: Vmax Constancy & Active Site Competition',
      desc: 'Accurately stated that competitive inhibitors bind reversibly to the active site and that high substrate concentrations outcompete the inhibitor, keeping Vmax unaltered.',
    },
    correct2: {
      title: '✓ Correctly Articulated: Lineweaver-Burk Intercept Behavior',
      desc: 'Precise identification that the 1/Vmax y-intercept remains unaffected while the slope Km/Vmax steepens.',
    },
    misconception: {
      title: '✗ Inaccuracy / Misconception: Km Shift Explanation',
      desc: 'You noted apparent affinity decreases, but momentarily stated Km increases because of "lower substrate turnover." Clarification: Turnover (kcat) is constant; apparent Km rises because a higher substrate concentration is required to reach half-maximal velocity (1/2 Vmax).',
      link: 'Review Lineweaver-Burk Slope Derivation (2 min read)',
    },
  });

  // Timers
  useEffect(() => {
    let recInt: any = null;
    if (isRecording) {
      recInt = setInterval(() => {
        setRecordingSeconds((s) => s + 1);
      }, 1000);
    }
    return () => clearInterval(recInt);
  }, [isRecording]);

  useEffect(() => {
    const qInt = setInterval(() => {
      setQuizTimer((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(qInt);
  }, []);

  // Spacebar toggle
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && (e.target as HTMLElement).tagName !== 'TEXTAREA') {
        e.preventDefault();
        setIsRecording((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleEvaluate = async () => {
    setIsEvaluating(true);
    try {
      const res = await fetch('/api/voice-quiz-eval', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionTitle: 'Explain competitive inhibition on Km, Vmax, and Lineweaver-Burk',
          spokenTranscript: transcript,
          targetConcepts: ['Km increase', 'Vmax unchanged', 'Lineweaver-Burk slope', 'x-intercept'],
        }),
      });
      const data = await res.json();
      if (data.data) {
        if (data.data.retentionDelta) setRetentionDelta(data.data.retentionDelta);
        if (data.data.correctInsights?.length >= 2) {
          setDiagnosticFeedback((prev) => ({
            ...prev,
            correct1: { ...prev.correct1, title: data.data.correctInsights[0] },
            correct2: { ...prev.correct2, title: data.data.correctInsights[1] },
          }));
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsEvaluating(false);
      setIsRecording(false);
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-background text-on-surface min-h-screen flex flex-col selection:bg-primary selection:text-on-primary font-body">
      {/* ================= TOP APP BAR ================= */}
      <header className="bg-surface-container border-b border-outline-variant sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Left: Brand & Quiz Context */}
          <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
            <button onClick={() => onNavigate('dashboard')} className="flex items-center gap-2.5">
              <div className="relative flex items-center justify-center">
                <span className="w-2.5 h-2.5 rounded-full bg-primary animate-ping absolute opacity-75"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
              </div>
              <span className="font-headline font-bold text-sm tracking-tight text-on-surface">
                Synapse AI — Active Voice Recall
              </span>
            </button>
            <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-outline-variant text-xs text-on-surface-variant font-mono">
              <span className="text-on-surface font-medium">MCAT Foundations: Enzyme Kinetics</span>
              <span className="text-secondary">•</span>
              <span className="text-primary font-semibold">Q4 of 8</span>
            </div>
          </div>

          {/* Center: Stepper Progress */}
          <div className="flex items-center gap-1.5 w-full md:w-64">
            <div className="h-1.5 flex-1 bg-surface-container-highest rounded-full overflow-hidden flex gap-1 p-0.5">
              <div className="h-full w-1/4 bg-primary rounded-full"></div>
              <div className="h-full w-1/4 bg-primary rounded-full"></div>
              <div className="h-full w-1/4 bg-primary rounded-full"></div>
              <div className="h-full w-1/4 bg-primary rounded-full"></div>
            </div>
            <div className="h-1.5 flex-1 bg-surface-container-highest rounded-full overflow-hidden flex gap-1 p-0.5">
              <div className="h-full w-1/4 bg-surface-variant rounded-full"></div>
              <div className="h-full w-1/4 bg-surface-variant rounded-full"></div>
              <div className="h-full w-1/4 bg-surface-variant rounded-full"></div>
              <div className="h-full w-1/4 bg-surface-variant rounded-full"></div>
            </div>
            <span className="text-[11px] font-mono font-medium text-primary pl-1">50%</span>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3 self-end md:self-auto">
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-container-high border border-outline-variant text-xs font-mono text-on-surface">
              <span className="material-symbols-outlined text-amber-500 !text-sm">local_fire_department</span>
              <span>18 Days</span>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-container-high border border-outline-variant text-xs font-mono text-primary">
              <span className="material-symbols-outlined !text-sm">schedule</span>
              <span>{formatTimer(quizTimer)}</span>
            </div>

            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-container-low border border-outline-variant text-xs font-mono text-tertiary">
              <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>
              <span>Default Mic</span>
            </div>

            <button
              onClick={() => onNavigate('dashboard')}
              className="flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high border border-outline-variant transition-colors cursor-pointer"
            >
              <span>Exit</span>
              <span className="material-symbols-outlined !text-sm">close</span>
            </button>
          </div>
        </div>
      </header>

      {/* ================= MAIN CANVAS ================= */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6 flex flex-col gap-6">
        {/* 1. Prompt Card */}
        <section className="bg-surface-container border border-outline-variant rounded-xl p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-80"></div>
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded text-[11px] font-mono tracking-wider font-semibold uppercase bg-surface-variant text-primary border border-outline-variant">
                  BIOCHEMISTRY • MICHAELIS-MENTEN
                </span>
                <span className="text-xs text-on-surface-variant font-mono">ID: MM-204</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-tertiary bg-tertiary-container/30 px-2.5 py-0.5 rounded border border-tertiary/20 font-mono">
                <span className="material-symbols-outlined !text-xs">psychology</span>
                <span>Target Recall: 4 Concepts</span>
              </div>
            </div>

            <h1 className="text-lg md:text-xl font-bold tracking-tight text-on-surface leading-snug">
              Explain how a competitive inhibitor affects K<sub className="text-xs">m</sub> and V<sub className="text-xs">max</sub>,
              and describe what happens to the Lineweaver-Burk double reciprocal plot.
            </h1>

            {/* Target Concepts Checklist */}
            <div className="pt-2">
              <div className="text-[11px] font-mono uppercase text-on-surface-variant mb-2">Target Cognitive Concepts</div>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-container-high border border-outline-variant text-xs text-on-surface font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                  K<sub>m</sub> increase
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-container-high border border-outline-variant text-xs text-on-surface font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                  V<sub>max</sub> unchanged
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-container-high border border-outline-variant text-xs text-on-surface font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                  Lineweaver-Burk slope increase (K<sub>m</sub>/V<sub>max</sub>)
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-container-high border border-outline-variant text-xs text-on-surface font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-outline"></span>
                  X-intercept shift closer to origin
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Microphone & Audio Visualizer Section */}
        <section className="bg-surface-container-low border border-outline-variant rounded-xl p-8 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute w-72 h-72 rounded-full bg-primary/5 blur-3xl pointer-events-none"></div>

          {/* Mic Button Cluster */}
          <div className="relative flex items-center justify-center my-3">
            {isRecording && (
              <div className="absolute w-28 h-28 rounded-full bg-primary/10 border border-primary/30 animate-ping opacity-60"></div>
            )}
            <div className="w-24 h-24 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center p-2 backdrop-blur-sm transition-transform duration-200">
              <button
                onClick={() => setIsRecording(!isRecording)}
                className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all active:scale-95 cursor-pointer ${
                  isRecording
                    ? 'bg-primary text-on-primary shadow-primary/30 ring-4 ring-primary/30'
                    : 'bg-surface-container-high text-on-surface-variant hover:text-white'
                }`}
                title={isRecording ? 'Click to pause mic' : 'Click to resume mic'}
              >
                <span className="material-symbols-outlined !text-3xl">
                  {isRecording ? 'mic' : 'mic_off'}
                </span>
              </button>
            </div>
          </div>

          {/* Waveform Bars */}
          <div className="flex items-center justify-center gap-1 h-9 my-4 px-4">
            {[0.1, 0.3, 0.5, 0.2, 0.4, 0.6, 0.15, 0.35, 0.55, 0.25, 0.45, 0.1, 0.3, 0.5].map((delay, idx) => (
              <span
                key={idx}
                className={`w-1 rounded-full ${
                  isRecording ? 'bg-primary wave-bar' : 'bg-outline h-1.5'
                }`}
                style={isRecording ? { animationDelay: `${delay}s` } : {}}
              ></span>
            ))}
          </div>

          {/* Recording Timer */}
          <div className="flex items-center gap-2 text-xs font-mono text-on-surface-variant mb-6">
            <span className={`w-2 h-2 rounded-full ${isRecording ? 'bg-primary animate-pulse' : 'bg-outline'}`}></span>
            <span>{isRecording ? 'Listening & analyzing speech cadence...' : 'Microphone Paused'}</span>
            <span className="px-1.5 py-0.5 rounded bg-surface-container border border-outline-variant text-on-surface text-[11px]">
              ({formatTimer(recordingSeconds)} recorded)
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center flex-wrap justify-center gap-2.5">
            <button
              onClick={() => setIsRecording(!isRecording)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-high border border-outline-variant hover:bg-surface-container-highest text-xs font-medium text-on-surface transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined !text-base text-secondary">
                {isRecording ? 'pause' : 'play_arrow'}
              </span>
              <span>{isRecording ? 'Mute/Pause' : 'Resume Mic'}</span>
            </button>

            <button
              onClick={() => {
                setRecordingSeconds(0);
                setTranscript('');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-high border border-outline-variant hover:bg-surface-container-highest text-xs font-medium text-on-surface transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined !text-base text-secondary">restart_alt</span>
              <span>Reset Speech</span>
            </button>

            <button
              onClick={handleEvaluate}
              disabled={isEvaluating}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-surface-container-highest border border-primary/40 hover:border-primary text-xs font-semibold text-primary transition-all cursor-pointer glow-primary"
            >
              {isEvaluating ? (
                <>
                  <span className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
                  <span>AI Evaluating...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined !text-base">done_all</span>
                  <span>Done Speaking / Evaluate</span>
                </>
              )}
            </button>
          </div>
        </section>

        {/* 3. Real-Time Transcription Text Area */}
        <section className="bg-surface-container border border-outline-variant rounded-xl p-5 relative">
          <div className="flex items-center justify-between pb-3 border-b border-outline-variant mb-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary !text-base">graphic_eq</span>
              <span className="text-xs font-semibold uppercase tracking-wider text-on-surface font-mono">
                Live Speech Transcription (Whisper-3.5 Realtime)
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-surface-container-lowest border border-outline-variant font-mono text-[11px] text-tertiary">
              <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
              <span>18ms • 99.2% confidence</span>
            </div>
          </div>
          <div className="font-mono text-sm leading-relaxed text-on-surface/90 bg-surface-container-lowest p-4 rounded-lg border border-outline-variant min-h-[96px]">
            {transcript}
            {isRecording && <span className="cursor-blink inline-block w-2 h-4 bg-primary align-middle ml-1"></span>}
          </div>
        </section>

        {/* 4. AI Feedback Cards: Diagnostic Breakdown */}
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary !text-lg">analytics</span>
              <h2 className="text-xs font-bold uppercase tracking-wider text-on-surface font-mono">
                AI Diagnostic Breakdown
              </h2>
            </div>
            <span className="px-2 py-0.5 rounded bg-surface-container border border-outline-variant text-[11px] font-mono text-tertiary">
              FSRS Retention {retentionDelta}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {/* Emerald Correct Card 1 */}
            <div className="p-4 rounded-xl border border-tertiary/30 bg-[#065f46]/20 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-tertiary font-semibold text-xs tracking-tight">
                <span className="material-symbols-outlined !text-base">check_circle</span>
                <span>{diagnosticFeedback.correct1.title}</span>
              </div>
              <p className="text-xs leading-relaxed text-on-surface/85">{diagnosticFeedback.correct1.desc}</p>
            </div>

            {/* Emerald Correct Card 2 */}
            <div className="p-4 rounded-xl border border-tertiary/30 bg-[#065f46]/20 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-tertiary font-semibold text-xs tracking-tight">
                <span className="material-symbols-outlined !text-base">check_circle</span>
                <span>{diagnosticFeedback.correct2.title}</span>
              </div>
              <p className="text-xs leading-relaxed text-on-surface/85">{diagnosticFeedback.correct2.desc}</p>
            </div>

            {/* Crimson Misconception Card */}
            <div className="md:col-span-2 p-4 rounded-xl border border-error/40 bg-[#3b1111]/30 flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-error font-semibold text-xs tracking-tight">
                  <span className="material-symbols-outlined !text-base">cancel</span>
                  <span>{diagnosticFeedback.misconception.title}</span>
                </div>
                <span className="text-[10px] font-mono text-error uppercase tracking-wider px-2 py-0.5 rounded bg-error/10 border border-error/20">
                  Conceptual Nuance
                </span>
              </div>
              <p className="text-xs leading-relaxed text-on-surface/90">{diagnosticFeedback.misconception.desc}</p>

              <div className="pt-1 flex items-center gap-2">
                <button
                  onClick={() => onNavigate('handwritten-analysis')}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-container-high border border-outline-variant hover:border-primary text-xs font-mono text-on-surface transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-primary !text-sm">menu_book</span>
                  <span>{diagnosticFeedback.misconception.link}</span>
                  <span className="material-symbols-outlined !text-xs text-secondary">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ================= 5. BOTTOM ACTION BAR ================= */}
      <footer className="bg-surface-container border-t border-outline-variant mt-auto sticky bottom-0 z-40">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-on-surface-variant">
            <span className="material-symbols-outlined !text-sm text-secondary">keyboard</span>
            <span>
              Key shortcut: Press{' '}
              <kbd className="px-1.5 py-0.5 rounded bg-surface-container-highest border border-outline-variant text-on-surface font-semibold">
                [Space]
              </kbd>{' '}
              to pause mic
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={() => {
                setRecordingSeconds(0);
                setIsRecording(true);
              }}
              className="px-3.5 py-2 rounded-lg bg-surface-container-high border border-outline-variant hover:bg-surface-container-highest text-xs font-semibold text-on-surface transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined !text-sm">replay</span>
              <span>Re-record Answer</span>
            </button>
            <button
              onClick={() => onNavigate('handwritten-analysis')}
              className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-fixed text-on-primary text-xs font-bold tracking-tight shadow-md shadow-primary/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>Next: Answer Analysis</span>
              <span className="material-symbols-outlined !text-sm">arrow_forward</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
