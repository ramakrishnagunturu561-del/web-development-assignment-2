import React from 'react';
import { Equation } from './Equation';

interface StepEquationProps {
  label?: string;
  mathLaTeX: string;
  annotation?: string;
  isResult?: boolean;
}

export const StepEquation: React.FC<StepEquationProps> = ({
  label,
  mathLaTeX,
  annotation,
  isResult = false,
}) => {
  return (
    <div
      style={{
        background: isResult ? 'rgba(16, 185, 129, 0.08)' : 'rgba(15, 23, 42, 0.6)',
        border: `1px solid ${isResult ? 'rgba(16, 185, 129, 0.4)' : 'rgba(148, 163, 184, 0.15)'}`,
        borderRadius: '10px',
        padding: '0.75rem 1rem',
      }}
      className="my-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 transition-all"
    >
      <div className="flex items-center gap-3">
        {label && (
          <span className="text-xs font-mono font-medium text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
            {label}
          </span>
        )}
        <div className="text-slate-100 font-mono text-sm">
          <Equation math={mathLaTeX} />
        </div>
      </div>
      {annotation && (
        <span className="text-xs text-slate-400 italic">
          {annotation}
        </span>
      )}
    </div>
  );
};
