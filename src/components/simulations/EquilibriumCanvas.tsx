import React, { useState } from 'react';
import { ForceArrow } from './ForceArrow';
import { Equation } from '../math/Equation';
import { calculateEquilibrium } from '../../utils/physics';
import type { ForceVector } from '../../types/physics';
import { Scale, CheckCircle2, AlertCircle, RotateCcw, Target, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export const EquilibriumCanvas: React.FC = () => {
  const [forces, setForces] = useState<ForceVector[]>([
    { id: 'f1', name: 'Force 1', symbol: '\\vec{F}_1', magnitude: 30, angleDeg: 0, color: '#38bdf8' },
    { id: 'f2', name: 'Force 2', symbol: '\\vec{F}_2', magnitude: 40, angleDeg: 120, color: '#f59e0b' },
    { id: 'f3', name: 'Force 3', symbol: '\\vec{F}_3', magnitude: 35, angleDeg: 240, color: '#a855f7' },
  ]);

  const [challengeMode, setChallengeMode] = useState<boolean>(false);

  const eqState = calculateEquilibrium(forces, 1.0);

  const handleUpdateForce = (id: string, field: 'magnitude' | 'angleDeg', val: number) => {
    setForces((prev) =>
      prev.map((f) => (f.id === id ? { ...f, [field]: val } : f))
    );
  };

  const handleStartChallenge = () => {
    setChallengeMode(true);
    // Lock F1 and F2 to specific non-symmetric values, ask user to balance F3
    // Example: F1 = 50 N at 0° (x=50, y=0), F2 = 50 N at 90° (x=0, y=50) -> Need F3 ≈ 70.7 N at 225°
    setForces([
      { id: 'f1', name: 'Target Force 1', symbol: '\\vec{F}_1', magnitude: 40, angleDeg: 30, color: '#38bdf8' },
      { id: 'f2', name: 'Target Force 2', symbol: '\\vec{F}_2', magnitude: 30, angleDeg: 135, color: '#f59e0b' },
      { id: 'f3', name: 'Your Balancer Force', symbol: '\\vec{F}_3', magnitude: 20, angleDeg: 200, color: '#a855f7' },
    ]);
  };

  const handleSetAutoBalance = () => {
    // Automatically solve F3 to demonstrate equilibrium
    const f1Rad = (forces[0].angleDeg * Math.PI) / 180;
    const f2Rad = (forces[1].angleDeg * Math.PI) / 180;

    const fx12 = forces[0].magnitude * Math.cos(f1Rad) + forces[1].magnitude * Math.cos(f2Rad);
    const fy12 = forces[0].magnitude * Math.sin(f1Rad) + forces[1].magnitude * Math.sin(f2Rad);

    const neededFx = -fx12;
    const neededFy = -fy12;

    const neededMag = Math.sqrt(neededFx * neededFx + neededFy * neededFy);
    let neededAngle = (Math.atan2(neededFy, neededFx) * 180) / Math.PI;
    if (neededAngle < 0) neededAngle += 360;

    setForces((prev) => [
      prev[0],
      prev[1],
      {
        ...prev[2],
        magnitude: Number(neededMag.toFixed(1)),
        angleDeg: Number(neededAngle.toFixed(1)),
      },
    ]);

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#10b981', '#06b6d4', '#a855f7'],
      });
    } catch {}
  };

  const handleReset = () => {
    setChallengeMode(false);
    setForces([
      { id: 'f1', name: 'Force 1', symbol: '\\vec{F}_1', magnitude: 30, angleDeg: 0, color: '#38bdf8' },
      { id: 'f2', name: 'Force 2', symbol: '\\vec{F}_2', magnitude: 40, angleDeg: 120, color: '#f59e0b' },
      { id: 'f3', name: 'Force 3', symbol: '\\vec{F}_3', magnitude: 35, angleDeg: 240, color: '#a855f7' },
    ]);
  };

  return (
    <div
      style={{
        background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.95) 0%, rgba(10, 15, 29, 0.9) 100%)',
        border: '1px solid rgba(6, 182, 212, 0.3)',
        borderRadius: '20px',
        boxShadow: '0 12px 30px rgba(0, 0, 0, 0.4)',
      }}
      className="p-5 my-6 overflow-hidden"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
              <Scale size={16} />
            </span>
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
              Translational Equilibrium Vector Sandbox (<Equation math="\Sigma\vec{F} = 0" />)
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Resolve forces in orthogonal components: <Equation math="\Sigma F_x = 0" /> and <Equation math="\Sigma F_y = 0" />
          </p>
        </div>

        {/* State Badge */}
        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-mono font-bold px-3 py-1 rounded-full border flex items-center gap-1.5 ${
              eqState.isEquilibrium
                ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40 shadow-sm shadow-emerald-500/20'
                : 'bg-rose-950/60 text-rose-300 border-rose-500/40'
            }`}
          >
            {eqState.isEquilibrium ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
            <span>
              {eqState.isEquilibrium ? 'IN TRANSLATIONAL EQUILIBRIUM' : 'NOT IN EQUILIBRIUM'}
            </span>
          </span>
          <button
            type="button"
            onClick={handleReset}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
            title="Reset sandbox"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>

      {/* SVG Vector Canvas & Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
        {/* Vector Dial Canvas */}
        <div className="lg:col-span-7 relative rounded-xl bg-slate-950 border border-slate-800 p-2 flex items-center justify-center min-h-[290px]">
          <svg viewBox="0 0 400 290" className="w-full max-w-[400px] h-auto select-none">
            <defs>
              <pattern id="eqGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(148, 163, 184, 0.04)" strokeWidth="1" />
              </pattern>
            </defs>

            <rect width="400" height="290" fill="url(#eqGrid)" />

            {/* Polar Ring Guides */}
            <circle cx="200" cy="145" r="40" fill="none" stroke="#1e293b" strokeWidth="1" />
            <circle cx="200" cy="145" r="80" fill="none" stroke="#1e293b" strokeWidth="1" />
            <circle cx="200" cy="145" r="120" fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />

            {/* Coordinate axes */}
            <line x1="200" y1="10" x2="200" y2="280" stroke="#334155" strokeWidth="1.5" />
            <line x1="10" y1="145" x2="390" y2="145" stroke="#334155" strokeWidth="1.5" />

            <text x="385" y="140" fill="#64748b" fontSize="10" fontFamily="monospace" textAnchor="end">+x (0°)</text>
            <text x="205" y="22" fill="#64748b" fontSize="10" fontFamily="monospace">+y (90°)</text>
            <text x="15" y="140" fill="#64748b" fontSize="10" fontFamily="monospace">-x (180°)</text>
            <text x="205" y="275" fill="#64748b" fontSize="10" fontFamily="monospace">-y (270°)</text>

            {/* Central Ring / Point Mass */}
            <circle
              cx="200"
              cy="145"
              r="8"
              fill={eqState.isEquilibrium ? '#10b981' : '#0f172a'}
              stroke={eqState.isEquilibrium ? '#34d399' : '#38bdf8'}
              strokeWidth="3"
              className="transition-colors duration-300"
            />

            {/* Active Force Arrows */}
            {forces.map((f) => (
              <ForceArrow
                key={f.id}
                startX={200}
                startY={145}
                length={f.magnitude * 2.2}
                angleDeg={f.angleDeg}
                color={f.color}
                mathLaTeX={f.symbol}
                valueText={`${f.magnitude}N`}
              />
            ))}

            {/* Resultant Net Force Arrow (if not in equilibrium) */}
            {!eqState.isEquilibrium && eqState.netMagnitude > 1.0 && (
              <ForceArrow
                startX={200}
                startY={145}
                length={Math.min(110, eqState.netMagnitude * 2.2)}
                angleDeg={
                  ((Math.atan2(eqState.sumFy, eqState.sumFx) * 180) / Math.PI + 360) % 360
                }
                color="#f43f5e"
                strokeWidth={4}
                mathLaTeX="\Sigma\vec{F}"
                valueText={`${eqState.netMagnitude.toFixed(1)}N`}
              />
            )}
          </svg>
        </div>

        {/* Real-time Component Math Readouts */}
        <div className="lg:col-span-5 space-y-3">
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Component Resolution
            </h4>

            {/* Sigma Fx */}
            <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-950/70 border border-slate-800 font-mono">
              <span className="text-slate-400">
                <Equation math="\Sigma F_x = \sum F_i \cos\theta_i" />
              </span>
              <span className={`font-bold ${Math.abs(eqState.sumFx) < 1.0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {eqState.sumFx.toFixed(2)} N
              </span>
            </div>

            {/* Sigma Fy */}
            <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-950/70 border border-slate-800 font-mono">
              <span className="text-slate-400">
                <Equation math="\Sigma F_y = \sum F_i \sin\theta_i" />
              </span>
              <span className={`font-bold ${Math.abs(eqState.sumFy) < 1.0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {eqState.sumFy.toFixed(2)} N
              </span>
            </div>

            {/* Net Magnitude */}
            <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-950/70 border border-slate-800 font-mono">
              <span className="text-slate-400">
                <Equation math="|\Sigma\vec{F}| = \sqrt{\Sigma F_x^2 + \Sigma F_y^2}" />
              </span>
              <span className={`font-bold text-sm ${eqState.isEquilibrium ? 'text-emerald-400' : 'text-rose-400'}`}>
                {eqState.netMagnitude.toFixed(2)} N
              </span>
            </div>
          </div>

          {/* Quick Solver & Challenge Buttons */}
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={handleSetAutoBalance}
              className="w-full py-2 px-3 text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 rounded-lg flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20 active:scale-95 transition-all"
            >
              <Sparkles size={14} />
              <span>Auto-Calculate Balancing Vector (<Equation math="\vec{F}_3" />)</span>
            </button>

            <button
              type="button"
              onClick={handleStartChallenge}
              className="w-full py-2 px-3 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
            >
              <Target size={14} className="text-purple-400" />
              <span>Load Equilibrium Challenge</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sliders for the 3 Vectors */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4 pt-3 border-t border-slate-800">
        {forces.map((force, idx) => {
          const isLocked = challengeMode && idx < 2;

          return (
            <div
              key={force.id}
              style={{
                borderColor: `${force.color}40`,
                backgroundColor: 'rgba(15, 23, 42, 0.7)',
              }}
              className="p-3 rounded-xl border space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <span style={{ backgroundColor: force.color }} className="w-2.5 h-2.5 rounded-full" />
                  <span>{force.name}</span>
                  <span className="font-mono text-cyan-300">
                    <Equation math={force.symbol} />
                  </span>
                </span>
                {isLocked && (
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                    Locked
                  </span>
                )}
              </div>

              {/* Magnitude Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-slate-400">Magnitude:</span>
                  <span className="text-slate-100 font-bold">{force.magnitude} N</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="60"
                  step="1"
                  disabled={isLocked}
                  value={force.magnitude}
                  onChange={(e) =>
                    handleUpdateForce(force.id, 'magnitude', parseFloat(e.target.value))
                  }
                  className="w-full"
                />
              </div>

              {/* Angle Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-slate-400">Angle (θ):</span>
                  <span className="text-slate-100 font-bold">{force.angleDeg}°</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="360"
                  step="5"
                  disabled={isLocked}
                  value={force.angleDeg}
                  onChange={(e) =>
                    handleUpdateForce(force.id, 'angleDeg', parseFloat(e.target.value))
                  }
                  className="w-full"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
