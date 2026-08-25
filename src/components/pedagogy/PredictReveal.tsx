import React from 'react';
import { Lightbulb, CheckCircle2, XCircle, SkipForward } from 'lucide-react';

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
            ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(15, 23, 42, 0.9) 100%)'
            : 'linear-gradient(135deg, rgba(239, 68, 68, 0.10) 0%, rgba(15, 23, 42, 0.9) 100%)',
          border: `1px solid ${isCorrect ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.35)'}`,
          borderRadius: '14px',
        }}
        className="p-4 mb-4 animate-fadeIn"
      >
        {/* Result badge */}
        <div className="flex items-start gap-3">
          <span
            className={`p-1.5 rounded-xl shrink-0 mt-0.5 ${
              isCorrect
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                : 'bg-red-500/15 text-red-400 border border-red-500/30'
            }`}
          >
            {isCorrect ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
          </span>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`text-xs font-bold uppercase tracking-wider ${
                  isCorrect ? 'text-emerald-400' : 'text-red-400'
                }`}
              >
                {isCorrect ? 'Correct prediction!' : 'Not quite — see why:'}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Your answer:{' '}
                <span className="text-slate-200 font-semibold">
                  {options.find((o) => o.value === prediction)?.label ?? prediction}
                </span>
              </span>
            </div>

            {revealedContent && (
              <div className="mt-2 text-xs text-slate-300 leading-relaxed">
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
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(15, 23, 42, 0.9) 100%)',
          border: '1px solid rgba(99, 102, 241, 0.35)',
          borderRadius: '14px',
        }}
        className="p-4 mb-4"
      >
        <div className="flex items-center gap-2 text-indigo-300">
          <Lightbulb size={15} className="shrink-0" />
          <span className="text-xs font-semibold">
            Prediction locked:{' '}
            <span className="text-indigo-100 font-bold">
              {options.find((o) => o.value === prediction)?.label ?? prediction}
            </span>
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1.5 ml-5.5">
          Now move a slider to see if you were right ↓
        </p>
      </div>
    );
  }

  /* ── Idle Phase (question + option buttons) ─────────────────────────────── */
  return (
    <div
      style={{
        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(15, 23, 42, 0.9) 100%)',
        border: '1px solid rgba(245, 158, 11, 0.3)',
        borderRadius: '14px',
      }}
      className="p-4 mb-4"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-amber-500/15 text-amber-400 border border-amber-500/30 shrink-0">
            <Lightbulb size={14} />
          </span>
          <div>
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">
              Make a prediction first
            </span>
            <p className="text-xs text-slate-200 font-medium mt-0.5 leading-snug">
              {question}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onSkip}
          title="Skip prediction and use sliders directly"
          className="flex items-center gap-1 text-[10px] text-slate-500 hover:text-slate-300 transition-colors shrink-0 mt-0.5"
        >
          <SkipForward size={11} />
          <span>Skip</span>
        </button>
      </div>

      {/* Option buttons */}
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onPredict(opt.value)}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-600
                       bg-slate-800 text-slate-200
                       hover:bg-amber-500/20 hover:border-amber-500/50 hover:text-amber-200
                       focus:outline-none focus:ring-2 focus:ring-amber-400/50
                       transition-all"
          >
            {opt.icon && <span className="mr-1">{opt.icon}</span>}
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
};
