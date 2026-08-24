import React from 'react';
import { AlertTriangle, CheckCircle2, XCircle, HelpCircle } from 'lucide-react';

interface MisconceptionCardProps {
  myth: string;
  reality: string;
  scientificExplanation: string;
  whyItMatters?: string;
  className?: string;
}

export const MisconceptionCard: React.FC<MisconceptionCardProps> = ({
  myth,
  reality,
  scientificExplanation,
  whyItMatters,
  className = '',
}) => {
  return (
    <div
      style={{
        background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.4) 0%, rgba(15, 23, 42, 0.9) 100%)',
        border: '1px solid rgba(244, 63, 94, 0.35)',
        borderRadius: '16px',
        boxShadow: '0 8px 30px rgba(244, 63, 94, 0.08)',
      }}
      className={`p-5 transition-all relative overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-rose-500/20">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-rose-500/15 text-rose-400 border border-rose-500/30">
            <AlertTriangle size={17} />
          </span>
          <h4 className="font-bold text-slate-100 text-sm uppercase tracking-wide">
            Common Misconception Alert
          </h4>
        </div>
        <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/30">
          Watch Out
        </span>
      </div>

      {/* Myth vs Reality Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        {/* Myth */}
        <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-500/25 flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-400 uppercase tracking-wider">
            <XCircle size={14} className="text-rose-400 shrink-0" />
            <span>Common Intuition (False)</span>
          </div>
          <p className="text-sm text-rose-200/90 font-medium italic">"{myth}"</p>
        </div>

        {/* Reality */}
        <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/25 flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
            <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
            <span>Physics Reality (True)</span>
          </div>
          <p className="text-sm text-emerald-200/95 font-medium">"{reality}"</p>
        </div>
      </div>

      {/* Scientific Explanation */}
      <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 text-xs text-slate-300 leading-relaxed">
        <div className="flex items-center gap-1.5 text-cyan-400 font-semibold mb-1">
          <HelpCircle size={13} />
          <span>Why this happens in physics:</span>
        </div>
        <p className="text-slate-300">{scientificExplanation}</p>
        {whyItMatters && (
          <p className="mt-2 text-slate-400 border-t border-slate-800/80 pt-2 font-mono text-[11px]">
            <span className="text-amber-400 font-semibold">IB Exam Note: </span>
            {whyItMatters}
          </p>
        )}
      </div>
    </div>
  );
};
