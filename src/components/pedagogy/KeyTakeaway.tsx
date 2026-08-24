import React from 'react';
import { Check, Zap } from 'lucide-react';
import { Equation } from '../math/Equation';

interface KeyTakeawayProps {
  takeaways: {
    id: string;
    text: string;
    mathFormula?: string;
    tag?: string;
  }[];
}

export const KeyTakeaway: React.FC<KeyTakeawayProps> = ({ takeaways }) => {
  return (
    <div className="my-4">
      <div className="flex items-center gap-2 mb-2.5">
        <span className="p-1 rounded-md bg-emerald-500/20 text-emerald-400">
          <Zap size={14} />
        </span>
        <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
          Key Takeaways
        </h4>
      </div>
      <div className="flex flex-wrap gap-2">
        {takeaways.map((item) => (
          <div
            key={item.id}
            style={{
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(15, 23, 42, 0.9) 100%)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
            }}
            className="px-3 py-1.5 rounded-xl flex items-center gap-2 text-xs text-slate-200 transition-all hover:border-emerald-400/60 shadow-sm"
          >
            <span className="p-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
              <Check size={12} strokeWidth={3} />
            </span>
            <span className="font-medium">{item.text}</span>
            {item.mathFormula && (
              <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-emerald-500/30 text-emerald-300 font-mono text-[11px]">
                <Equation math={item.mathFormula} />
              </span>
            )}
            {item.tag && (
              <span className="text-[10px] text-slate-400 bg-slate-800/80 px-1.5 py-0.5 rounded">
                {item.tag}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
