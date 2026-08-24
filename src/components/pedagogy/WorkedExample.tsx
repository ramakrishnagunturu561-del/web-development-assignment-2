import React, { useState } from 'react';
import type { WorkedExampleData } from '../../types/learning';
import { Equation } from '../math/Equation';
import { HelpCircle, ChevronRight, RotateCcw, CheckCircle2, ListOrdered } from 'lucide-react';

interface WorkedExampleProps {
  data: WorkedExampleData;
  className?: string;
}

export const WorkedExample: React.FC<WorkedExampleProps> = ({ data, className = '' }) => {
  // Current revealed step index (1-based: 0 means none revealed yet, data.steps.length means all revealed)
  const [revealedCount, setRevealedCount] = useState<number>(1);

  const totalSteps = data.steps.length;
  const isFullyRevealed = revealedCount >= totalSteps;

  const handleNextStep = () => {
    if (revealedCount < totalSteps) {
      setRevealedCount((prev) => prev + 1);
    }
  };

  const handleRevealAll = () => {
    setRevealedCount(totalSteps);
  };

  const handleReset = () => {
    setRevealedCount(1);
  };

  return (
    <div
      style={{
        background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.5) 100%)',
        border: '1px solid rgba(59, 130, 246, 0.3)',
        borderRadius: '18px',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
      }}
      className={`p-5 my-5 overflow-hidden transition-all ${className}`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-4 border-b border-blue-500/20">
        <div className="flex items-center gap-2.5">
          <span className="p-2 rounded-xl bg-blue-500/15 text-blue-400 border border-blue-500/30">
            <ListOrdered size={18} />
          </span>
          <div>
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
              Step-by-Step Worked Problem
            </h3>
            <p className="text-xs text-slate-400">Walk through the solution logic one step at a time</p>
          </div>
        </div>

        {/* Progress pills */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-slate-900 border border-slate-700 text-cyan-300">
            Step {revealedCount} of {totalSteps}
          </span>
          <button
            type="button"
            onClick={handleReset}
            title="Reset to first step"
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>

      {/* Problem Statement */}
      <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 mb-4">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-400 mb-1.5 uppercase tracking-wider">
          <HelpCircle size={14} />
          <span>Problem Statement</span>
        </div>
        <p className="text-sm text-slate-200 font-medium leading-relaxed">
          {data.problemStatement}
        </p>

        {/* Given values */}
        {data.givenData && data.givenData.length > 0 && (
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-1">
              Given:
            </span>
            {data.givenData.map((item, idx) => (
              <span
                key={idx}
                className="text-xs font-mono px-2 py-0.5 rounded-md bg-blue-950/40 border border-blue-500/20 text-blue-300 flex items-center gap-1"
              >
                <Equation math={item.symbol} />
                <span>=</span>
                <span>{item.value}</span>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Steps List */}
      <div className="space-y-3">
        {data.steps.slice(0, revealedCount).map((step) => (
          <div
            key={step.stepNumber}
            style={{
              background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.4) 0%, rgba(15, 23, 42, 0.8) 100%)',
              border: '1px solid rgba(148, 163, 184, 0.2)',
            }}
            className="p-4 rounded-xl transition-all duration-300 animate-fadeIn"
          >
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold flex items-center justify-center shrink-0">
                {step.stepNumber}
              </span>
              <h4 className="text-xs font-bold text-slate-100 tracking-wide uppercase">
                {step.title}
              </h4>
            </div>

            <p className="text-xs text-slate-300 ml-8 leading-relaxed mb-2">
              {step.explanation}
            </p>

            {step.mathLaTeX && (
              <div className="ml-8 my-2 p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 font-mono text-xs text-cyan-200">
                <Equation math={step.mathLaTeX} displayMode={true} />
              </div>
            )}

            {step.highlightText && (
              <p className="ml-8 text-[11px] text-amber-300/90 font-mono italic">
                💡 {step.highlightText}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Final Answer Banner when complete */}
      {isFullyRevealed && (
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(15, 23, 42, 0.9) 100%)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
          }}
          className="mt-4 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fadeIn"
        >
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <CheckCircle2 size={20} />
            </span>
            <div>
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Final Result
              </h4>
              <p className="text-sm font-semibold text-slate-100">
                {data.finalAnswer.symbol} = {data.finalAnswer.value} {data.finalAnswer.unit}
              </p>
            </div>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-slate-950/80 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
            <Equation math={data.finalAnswer.mathLaTeX} />
          </div>
        </div>
      )}

      {/* Control Buttons */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-800">
        <span className="text-xs text-slate-400">
          {!isFullyRevealed
            ? `Step ${revealedCount} revealed. Reveal step ${revealedCount + 1} next.`
            : 'All steps revealed. Try solving it on paper to reinforce!'}
        </span>

        <div className="flex items-center gap-2">
          {!isFullyRevealed && (
            <>
              <button
                type="button"
                onClick={handleRevealAll}
                className="px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
              >
                Reveal All
              </button>
              <button
                type="button"
                onClick={handleNextStep}
                className="px-4 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 rounded-lg flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 transition-all active:scale-95"
              >
                <span>Reveal Next Step</span>
                <ChevronRight size={14} />
              </button>
            </>
          )}

          {isFullyRevealed && (
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw size={13} />
              <span>Restart Walkthrough</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
