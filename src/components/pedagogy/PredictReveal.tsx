import React from 'react';
import { Lightbulb, CheckCircle2, XCircle, SkipForward, Sparkles, ArrowRight } from 'lucide-react';

export interface PredictRevealOption {
  label: string;
  value: string;
  /** Optional emoji/icon prefix shown on the button */
  icon?: string;
}

export type PredictRevealState = 'idle' | 'predicted' | 'revealed';

interface PredictRevealProps {
  /** The prediction question to show the student */
  question: string;
  /** Answer choices displayed as buttons */
  options: PredictRevealOption[];
  /** Currently selected prediction (null = nothing chosen yet) */
  prediction: string | null;
  /** Whether the reveal phase is active (slider was moved after prediction) */
  isRevealed: boolean;
  /** The value of the correct answer — used to show ✓/✗ */
  correctAnswer: string | null;
  /** Called when student clicks an option button */
  onPredict: (value: string) => void;
  /** Called when student clicks "Skip prediction" */
  onSkip: () => void;
  /** Content to render in the revealed slot (explanation text, etc.) */
  revealedContent?: React.ReactNode;
}

/**
 * PredictReveal — implements the Predict → Observe → Explain pedagogy pattern.
 *
 * Lifecycle:
 *   idle        → student sees the question + option buttons (or can skip)
 *   predicted   → student has clicked an option; waiting for the slider to move
 *   revealed    → slider moved; result + correctness badge is shown
 *
 * This component is purely presentational — the parent sim owns all state.
 */
export const PredictReveal: React.FC<PredictRevealProps> = ({
  question,
  options,
  prediction,
  isRevealed,
  correctAnswer,
  onPredict,
  onSkip,
  revealedContent,
}) => {
  const isCorrect = correctAnswer !== null && prediction === correctAnswer;

  /* ── Revealed Phase ─────────────────────────────────────────────────────── */
  if (isRevealed && prediction !== null) {
    return (
      <div
        style={{
          background: isCorrect
            ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.16) 0%, rgba(6, 14, 30, 0.95) 100%)'
            : 'linear-gradient(135deg, rgba(239, 68, 68, 0.14) 0%, rgba(6, 14, 30, 0.95) 100%)',
          border: `1px solid ${isCorrect ? 'rgba(52, 211, 153, 0.5)' : 'rgba(248, 113, 113, 0.45)'}`,
          borderRadius: '16px',
          boxShadow: isCorrect
            ? '0 8px 25px rgba(16, 185, 129, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.08)'
            : '0 8px 25px rgba(239, 68, 68, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
        }}
        className="p-4 sm:p-5 mb-4 animate-fadeIn backdrop-blur-md"
      >
        {/* Result badge */}
        <div className="flex items-start gap-3.5">
          <span
            className={`p-2 rounded-xl shrink-0 mt-0.5 shadow-sm ${
              isCorrect
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 shadow-emerald-500/20'
                : 'bg-rose-500/20 text-rose-300 border border-rose-400/40 shadow-rose-500/20'
            }`}
          >
            {isCorrect ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
          </span>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span
                className={`text-xs font-mono font-extrabold uppercase tracking-wider ${
                  isCorrect ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {isCorrect ? '✓ Correct Prediction!' : '⚡ Not Quite — See Why:'}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Your hypothesis:{' '}
                <span className="text-slate-100 font-bold px-2 py-0.5 rounded-md bg-slate-800/80 border border-slate-700">
                  {options.find((o) => o.value === prediction)?.label ?? prediction}
                </span>
              </span>
            </div>

            {revealedContent && (
              <div className="mt-2.5 text-xs text-slate-200 leading-relaxed font-normal bg-slate-950/40 p-3 rounded-xl border border-slate-800/80">
                {revealedContent}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* ── Predicted Phase (waiting for slider move) ──────────────────────────── */
  if (prediction !== null && !isRevealed) {
    return (
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.16) 0%, rgba(6, 14, 30, 0.95) 100%)',
          border: '1px solid rgba(129, 140, 248, 0.4)',
          borderRadius: '16px',
          boxShadow: '0 8px 25px rgba(99, 102, 241, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
        }}
        className="p-4 sm:p-5 mb-4 animate-fadeIn backdrop-blur-md"
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 text-indigo-300">
            <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <Sparkles size={16} />
            </span>
            <div>
              <span className="text-xs font-semibold text-indigo-200 block">
                Prediction locked:{' '}
                <span className="text-white font-bold font-mono px-2 py-0.5 rounded bg-indigo-950/80 border border-indigo-500/40">
                  {options.find((o) => o.value === prediction)?.label ?? prediction}
                </span>
              </span>
            </div>
          </div>
          <span className="text-[11px] font-mono font-semibold text-indigo-400/90 flex items-center gap-1">
            <span>Move slider to test</span>
            <ArrowRight size={12} />
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-2 ml-9">
          Now interact with the slider below to observe the real physics in action ↓
        </p>
      </div>
    );
  }

  /* ── Idle Phase (question + option buttons) ─────────────────────────────── */
  return (
    <div
      style={{
        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12) 0%, rgba(12, 20, 38, 0.95) 100%)',
        border: '1px solid rgba(251, 191, 36, 0.35)',
        borderRadius: '16px',
        boxShadow: '0 8px 25px rgba(245, 158, 11, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.06)',
      }}
      className="p-4 sm:p-5 mb-4 backdrop-blur-md"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3.5">
        <div className="flex items-center gap-2.5">
          <span className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm shrink-0">
            <Lightbulb size={16} />
          </span>
          <div>
            <span className="text-[10px] font-mono font-extrabold text-amber-400 uppercase tracking-widest block">
              Predict First • Scientific Inquiry
            </span>
            <p className="text-xs sm:text-sm text-slate-100 font-semibold mt-0.5 leading-snug">
              {question}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onSkip}
          title="Skip prediction and use sliders directly"
          className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400 hover:text-slate-200 transition-colors shrink-0 px-2.5 py-1 rounded-lg bg-slate-900/60 border border-slate-800 hover:border-slate-700"
        >
          <SkipForward size={12} />
          <span>Skip</span>
        </button>
      </div>

      {/* Option buttons */}
      <div className="flex flex-wrap gap-2.5 mt-2">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onPredict(opt.value)}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-700/80
                       bg-slate-900/90 text-slate-200 shadow-sm
                       hover:bg-amber-500/20 hover:border-amber-400/60 hover:text-amber-100
                       active:scale-[0.98]
                       focus:outline-none focus:ring-2 focus:ring-amber-400/50
                       transition-all duration-150 flex items-center"
          >
            {opt.icon && <span className="mr-1.5 text-sm">{opt.icon}</span>}
            <span>{opt.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
