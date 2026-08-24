import React from 'react';

interface ProgressBarProps {
  completedCount: number;
  totalCount: number;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  completedCount,
  totalCount,
  className = '',
}) => {
  const percentage = Math.min(100, Math.round((completedCount / totalCount) * 100));

  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between text-xs mb-1.5 font-mono">
        <span className="text-slate-400">
          Module Progress: <strong className="text-cyan-300">{completedCount}</strong> / {totalCount} Topics Completed
        </span>
        <span className="text-cyan-400 font-bold">{percentage}%</span>
      </div>
      <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800/80">
        <div
          style={{ width: `${percentage}%` }}
          className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-400 transition-all duration-500 rounded-full"
        />
      </div>
    </div>
  );
};
