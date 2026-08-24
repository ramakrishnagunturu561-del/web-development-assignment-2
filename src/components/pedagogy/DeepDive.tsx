import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Layers, Sparkles } from 'lucide-react';
import { Equation } from '../math/Equation';

interface DeepDiveProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  equations?: string[];
  ibLevel?: 'SL' | 'HL' | 'Both';
  defaultOpen?: boolean;
}

export const DeepDive: React.FC<DeepDiveProps> = ({
  title,
  subtitle = 'Advanced Analysis & IB HL Extension',
  children,
  equations = [],
  ibLevel = 'HL',
  defaultOpen = false,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div
      style={{
        background: 'linear-gradient(145deg, rgba(30, 27, 75, 0.25) 0%, rgba(15, 23, 42, 0.7) 100%)',
        border: '1px solid rgba(139, 92, 246, 0.25)',
        borderRadius: '16px',
      }}
      className="my-4 overflow-hidden transition-all"
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between gap-3 text-left hover:bg-purple-950/20 transition-colors"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3">
          <span className="p-2 rounded-xl bg-purple-500/15 text-purple-400 border border-purple-500/30">
            <Layers size={18} />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-slate-100">{title}</h4>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30">
                IB {ibLevel} Extension
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-purple-400 text-xs font-medium">
          <span className="hidden sm:inline">{isOpen ? 'Collapse' : 'Expand Deep Dive'}</span>
          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </button>

      {isOpen && (
        <div className="p-5 pt-2 border-t border-purple-500/20 text-slate-300 text-xs leading-relaxed space-y-3 animate-fadeIn">
          {children}

          {equations.length > 0 && (
            <div className="mt-3 p-3 rounded-xl bg-slate-950/70 border border-purple-500/20 space-y-2">
              <div className="flex items-center gap-1.5 text-purple-300 font-semibold text-[11px] uppercase tracking-wider">
                <Sparkles size={12} />
                <span>Extended Mathematical Form</span>
              </div>
              <div className="space-y-1.5">
                {equations.map((eq, i) => (
                  <div key={i} className="py-1">
                    <Equation math={eq} displayMode={true} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
