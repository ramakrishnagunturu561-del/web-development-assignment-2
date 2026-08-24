import React from 'react';
import { Equation } from './Equation';
import { Sigma, ArrowRight } from 'lucide-react';

interface VariableMeaning {
  symbol: string;
  name: string;
  unit: string;
}

interface FormulaCardProps {
  title: string;
  mathLaTeX: string;
  description: string;
  variables?: VariableMeaning[];
  ibTag?: string;
  className?: string;
}

export const FormulaCard: React.FC<FormulaCardProps> = ({
  title,
  mathLaTeX,
  description,
  variables = [],
  ibTag = 'IB Core Formula',
  className = '',
}) => {
  return (
    <div
      style={{
        background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.6) 100%)',
        border: '1px solid rgba(6, 182, 212, 0.3)',
        borderRadius: '16px',
        padding: '1.25rem',
        boxShadow: '0 8px 24px -6px rgba(0, 0, 0, 0.4), 0 0 16px rgba(6, 182, 212, 0.1)',
      }}
      className={`relative overflow-hidden transition-all hover:border-cyan-400/50 ${className}`}
    >
      <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-700/50">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Sigma size={16} />
          </span>
          <h4 className="font-semibold text-slate-100 text-sm tracking-wide uppercase">{title}</h4>
        </div>
        {ibTag && (
          <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
            {ibTag}
          </span>
        )}
      </div>

      <div className="py-2.5 my-1 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-center">
        <Equation math={mathLaTeX} displayMode={true} />
      </div>

      <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">{description}</p>

      {variables.length > 0 && (
        <div className="mt-3 pt-2.5 border-t border-slate-800/80">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            Variables & Units
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {variables.map((v, i) => (
              <div
                key={i}
                className="flex items-center gap-1.5 text-xs text-slate-300 bg-slate-900/50 px-2 py-1 rounded-md border border-slate-800"
              >
                <Equation math={v.symbol} className="text-cyan-300 font-medium" />
                <ArrowRight size={10} className="text-slate-500" />
                <span className="text-slate-200">{v.name}</span>
                <span className="text-slate-500 text-[11px] ml-auto font-mono">[{v.unit}]</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
