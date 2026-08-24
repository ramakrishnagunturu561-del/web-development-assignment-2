import React from 'react';
import { Award, AlertCircle } from 'lucide-react';

interface ExamTipProps {
  title: string;
  tip: string;
  paperType?: 'Paper 1 (MCQ)' | 'Paper 2 (Structured)' | 'General IB Tip';
  warning?: string;
}

export const ExamTip: React.FC<ExamTipProps> = ({
  title,
  tip,
  paperType = 'General IB Tip',
  warning,
}) => {
  return (
    <div
      style={{
        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(15, 23, 42, 0.8) 100%)',
        border: '1px solid rgba(245, 158, 11, 0.3)',
        borderRadius: '16px',
      }}
      className="p-4 my-3 transition-all"
    >
      <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-amber-500/20">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <Award size={16} />
          </span>
          <h4 className="font-semibold text-slate-100 text-sm">{title}</h4>
        </div>
        <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
          {paperType}
        </span>
      </div>

      <p className="text-xs text-slate-300 leading-relaxed">{tip}</p>

      {warning && (
        <div className="mt-2.5 pt-2 border-t border-amber-500/15 flex items-start gap-1.5 text-xs text-amber-300/90 bg-amber-950/20 p-2 rounded-lg">
          <AlertCircle size={14} className="text-amber-400 shrink-0 mt-0.5" />
          <span>{warning}</span>
        </div>
      )}
    </div>
  );
};
