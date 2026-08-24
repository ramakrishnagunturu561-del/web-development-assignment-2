import React from 'react';
import { BookOpen, Sparkles } from 'lucide-react';

interface ConceptCardProps {
  title: string;
  tag?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  variant?: 'cyan' | 'indigo' | 'emerald' | 'amber';
}

export const ConceptCard: React.FC<ConceptCardProps> = ({
  title,
  tag = 'Core Concept',
  children,
  icon,
  variant = 'cyan',
}) => {
  const getColors = () => {
    switch (variant) {
      case 'emerald':
        return {
          border: 'border-emerald-500/30',
          bg: 'from-emerald-950/40 to-slate-900/80',
          badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          iconBg: 'bg-emerald-500/20 text-emerald-400',
        };
      case 'amber':
        return {
          border: 'border-amber-500/30',
          bg: 'from-amber-950/40 to-slate-900/80',
          badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
          iconBg: 'bg-amber-500/20 text-amber-400',
        };
      case 'indigo':
        return {
          border: 'border-indigo-500/30',
          bg: 'from-indigo-950/40 to-slate-900/80',
          badgeBg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
          iconBg: 'bg-indigo-500/20 text-indigo-400',
        };
      case 'cyan':
      default:
        return {
          border: 'border-cyan-500/30',
          bg: 'from-cyan-950/40 to-slate-900/80',
          badgeBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
          iconBg: 'bg-cyan-500/20 text-cyan-400',
        };
    }
  };

  const colors = getColors();

  return (
    <div
      style={{
        borderRadius: '16px',
        border: '1px solid rgba(148, 163, 184, 0.15)',
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(10, 15, 29, 0.95) 100%)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
      }}
      className={`p-5 transition-all relative overflow-hidden ${colors.border}`}
    >
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <span className={`p-2 rounded-xl ${colors.iconBg}`}>
            {icon || <BookOpen size={18} />}
          </span>
          <h3 className="text-base font-bold text-slate-100">{title}</h3>
        </div>
        <span className={`text-[11px] font-mono font-medium px-2.5 py-0.5 rounded-full border ${colors.badgeBg} flex items-center gap-1`}>
          <Sparkles size={11} />
          {tag}
        </span>
      </div>
      <div className="text-slate-300 text-sm leading-relaxed space-y-2">
        {children}
      </div>
    </div>
  );
};
