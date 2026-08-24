import React, { useState, useEffect, useRef } from 'react';
import { ForceArrow } from './ForceArrow';
import { Equation } from '../math/Equation';
import { calculateFriction } from '../../utils/physics';
import { RotateCcw, Flame, ShieldAlert, Activity } from 'lucide-react';

export const FrictionSimulation: React.FC = () => {
  const [mass, setMass] = useState<number>(3.0); // kg
  const [muS, setMuS] = useState<number>(0.50); // static friction coeff
  const [muK, setMuK] = useState<number>(0.30); // kinetic friction coeff
  const [appliedForce, setAppliedForce] = useState<number>(10.0); // N
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  const [position, setPosition] = useState<number>(150);
  const [velocity, setVelocity] = useState<number>(0);

  const requestRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(performance.now());

  // Physical calculation
  const frictionState = calculateFriction(mass, muS, muK, appliedForce, 9.81, velocity);

  // Animation Loop
  useEffect(() => {
    const animate = (time: number) => {
      const dt = Math.min((time - lastTimeRef.current) / 1000, 0.05);
      lastTimeRef.current = time;

      if (isPlaying) {
        if (frictionState.isMoving) {
          setVelocity((v) => {
            const newV = v + frictionState.acceleration * dt;
            return Math.max(0, newV);
          });

          setPosition((x) => {
            let newX = x + velocity * dt * 35;
            if (newX > 540) newX = 80;
            return newX;
          });
        } else {
          setVelocity(0);
        }
      }

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [isPlaying, frictionState.isMoving, frictionState.acceleration, velocity]);

  const handleReset = () => {
    setPosition(150);
    setVelocity(0);
    setAppliedForce(0);
    setIsPlaying(true);
  };

  const handleSetThresholdTest = () => {
    // Set force just below and just above threshold for demonstration
    setAppliedForce(Number((frictionState.maxStaticFriction + 1.0).toFixed(1)));
  };

  // Percentage of static threshold reached
  const thresholdPercentage = Math.min(
    100,
    (appliedForce / (frictionState.maxStaticFriction || 1)) * 100
  );

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
              <Flame size={16} />
            </span>
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
              Static vs Kinetic Friction Transition Lab
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Compare static threshold (<Equation math="f_s \le \mu_s N" />) with kinetic sliding (<Equation math="f_k = \mu_k N" />)
          </p>
        </div>

        {/* Status indicator */}
        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-mono font-bold px-3 py-1 rounded-full border flex items-center gap-1.5 ${
              frictionState.isMoving
                ? 'bg-amber-950/60 text-amber-300 border-amber-500/40 shadow-sm shadow-amber-500/20'
                : 'bg-blue-950/60 text-blue-300 border-blue-500/40'
            }`}
          >
            {frictionState.isMoving ? <Activity size={13} /> : <ShieldAlert size={13} />}
            <span>
              {frictionState.isMoving
                ? 'REGIME: Dynamic Kinetic Sliding'
                : 'REGIME: Static Interlocking (Stationary)'}
            </span>
          </span>
          <button
            type="button"
            onClick={handleSetThresholdTest}
            className="px-2.5 py-1 text-xs font-semibold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-lg active:scale-95 transition-all"
            title="Set applied force slightly above max static threshold"
          >
            Breakaway Pulse
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
            title="Reset position and force"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>

      {/* Threshold Visual Indicator Bar */}
      <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 mb-4">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="font-semibold text-slate-300 flex items-center gap-1.5">
            <span>Static Breakaway Gauge:</span>
            <span className="font-mono text-cyan-400">
              F_app ({appliedForce.toFixed(1)} N) vs Max Static ({frictionState.maxStaticFriction.toFixed(1)} N)
            </span>
          </span>
          <span className="font-mono text-[11px] text-slate-400">
            {thresholdPercentage.toFixed(0)}% of Breakaway Threshold
          </span>
        </div>

        {/* Visual Bar */}
        <div className="w-full h-4 bg-slate-900 rounded-full overflow-hidden border border-slate-800 relative">
          {/* Fill */}
          <div
            style={{ width: `${thresholdPercentage}%` }}
            className={`h-full transition-all duration-150 ${
              thresholdPercentage >= 100
                ? 'bg-gradient-to-r from-amber-500 to-rose-500'
                : 'bg-gradient-to-r from-cyan-500 to-blue-500'
            }`}
          />
          {/* 100% Threshold line marker */}
          <div className="absolute top-0 bottom-0 right-0 w-1 bg-amber-400 shadow-sm" />
        </div>

        <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
          <span>0 N (Rest)</span>
          <span className="text-amber-400 font-bold">Breakaway Threshold: f_s,max = {frictionState.maxStaticFriction.toFixed(1)} N</span>
          <span>Sliding (Kinetic f_k = {frictionState.kineticFriction.toFixed(1)} N)</span>
        </div>
      </div>

      {/* SVG Canvas Area */}
      <div className="relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800 p-2">
        <svg viewBox="0 0 600 230" className="w-full h-auto select-none">
          <defs>
            <pattern id="fricGrid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(148, 163, 184, 0.04)" strokeWidth="1" />
            </pattern>
            {/* Rough surface pattern */}
            <pattern id="roughSurface" width="20" height="10" patternUnits="userSpaceOnUse">
              <path d="M 0 10 L 5 2 L 10 10 L 15 2 L 20 10" fill="none" stroke="#475569" strokeWidth="1" />
            </pattern>
          </defs>

          <rect width="600" height="230" fill="url(#fricGrid)" />

          {/* Rough Ground */}
          <rect x="0" y="150" width="600" height="80" fill="#0f172a" />
          <rect x="0" y="150" width="600" height="15" fill="url(#roughSurface)" />
          <line x1="0" y1="150" x2="600" y2="150" stroke="#64748b" strokeWidth="2" />

          {/* Microscopic Interlocking Zoom Callout */}
          <g transform="translate(480, 50)">
            <rect x="-60" y="-30" width="120" height="60" rx="8" fill="#1e293b" stroke="#334155" strokeWidth="1" />
            <text x="0" y="-14" fill="#94a3b8" fontSize="9" fontFamily="sans-serif" textAnchor="middle" fontWeight="bold">
              Surface Interlocking
            </text>
            <path d="M -45 5 L -30 -5 L -15 5 L 0 -5 L 15 5 L 30 -5 L 45 5" fill="none" stroke="#38bdf8" strokeWidth="2" />
            <path d="M -45 10 L -30 0 L -15 10 L 0 0 L 15 10 L 30 0 L 45 10" fill="none" stroke="#f59e0b" strokeWidth="2" />
            <text x="0" y="24" fill="#64748b" fontSize="8" fontFamily="monospace" textAnchor="middle">
              {frictionState.isMoving ? 'Asperities Shearing' : 'Asperities Locked'}
            </text>
          </g>

          {/* The Block */}
          <g transform={`translate(${position}, 150)`}>
            {/* Skid spark particles if moving */}
            {frictionState.isMoving && (
              <g opacity={0.8}>
                <circle cx="-35" cy="0" r="2" fill="#fbbf24" />
                <circle cx="-42" cy="-4" r="1.5" fill="#f97316" />
                <circle cx="-50" cy="1" r="1" fill="#ef4444" />
              </g>
            )}

            {/* Block Body */}
            <rect
              x="-35"
              y="-50"
              width="70"
              height="50"
              rx="6"
              fill="#0f766e"
              stroke="#2dd4bf"
              strokeWidth="2"
            />
            <circle cx="0" cy="-25" r="3" fill="#5eead4" />
            <text x="0" y="-21" fill="#f8fafc" fontSize="11" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
              {mass} kg
            </text>

            {/* Weight Vector */}
            <ForceArrow
              startX={0}
              startY={-25}
              length={50}
              angleDeg={270}
              color="#94a3b8"
              mathLaTeX="W=mg"
              valueText={`${(mass * 9.81).toFixed(1)}N`}
            />

            {/* Normal Force Vector */}
            <ForceArrow
              startX={0}
              startY={-25}
              length={50}
              angleDeg={90}
              color="#38bdf8"
              mathLaTeX="N"
              valueText={`${frictionState.normalForce.toFixed(1)}N`}
            />

            {/* Applied Force Vector */}
            {appliedForce > 0.1 && (
              <ForceArrow
                startX={0}
                startY={-25}
                length={Math.min(80, appliedForce * 2.2)}
                angleDeg={0}
                color="#f59e0b"
                mathLaTeX="F_{\text{app}}"
                valueText={`${appliedForce.toFixed(1)}N`}
              />
            )}

            {/* Friction Force Vector */}
            {Math.abs(frictionState.frictionForce) > 0.1 && (
              <ForceArrow
                startX={0}
                startY={-2}
                length={Math.min(65, Math.abs(frictionState.frictionForce) * 2.2)}
                angleDeg={180}
                color="#f43f5e"
                mathLaTeX={frictionState.isMoving ? 'f_k' : 'f_s'}
                valueText={`${Math.abs(frictionState.frictionForce).toFixed(1)}N`}
              />
            )}
          </g>
        </svg>
      </div>

      {/* Physics Readouts Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-4">
        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col">
          <span className="text-[11px] font-mono text-slate-400 uppercase">Normal Force (N)</span>
          <span className="text-lg font-mono font-bold text-cyan-300">
            {frictionState.normalForce.toFixed(1)} <span className="text-xs text-slate-400 font-normal">N</span>
          </span>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col">
          <span className="text-[11px] font-mono text-slate-400 uppercase">Active Friction (f)</span>
          <span className="text-lg font-mono font-bold text-rose-400">
            {Math.abs(frictionState.frictionForce).toFixed(1)} <span className="text-xs text-slate-400 font-normal">N</span>
          </span>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col">
          <span className="text-[11px] font-mono text-slate-400 uppercase">Net Force (ΣF)</span>
          <span className="text-lg font-mono font-bold text-amber-400">
            {frictionState.netForce.toFixed(1)} <span className="text-xs text-slate-400 font-normal">N</span>
          </span>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col">
          <span className="text-[11px] font-mono text-slate-400 uppercase">Acceleration (a)</span>
          <span className="text-lg font-mono font-bold text-emerald-400">
            {frictionState.acceleration.toFixed(2)} <span className="text-xs text-slate-400 font-normal">m/s²</span>
          </span>
        </div>
      </div>

      {/* Interactive Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-950/70 border border-slate-800">
        {/* Mass */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-300 font-semibold">Mass (<Equation math="m" />)</span>
            <span className="font-mono text-cyan-400 font-bold">{mass.toFixed(1)} kg</span>
          </div>
          <input
            type="range"
            min="1.0"
            max="10.0"
            step="0.5"
            value={mass}
            onChange={(e) => setMass(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Static Coeff mu_s */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-300 font-semibold">Static Coeff (<Equation math="\mu_s" />)</span>
            <span className="font-mono text-blue-400 font-bold">{muS.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0.10"
            max="0.90"
            step="0.05"
            value={muS}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              setMuS(val);
              if (muK > val) setMuK(val);
            }}
            className="w-full"
          />
        </div>

        {/* Kinetic Coeff mu_k */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-300 font-semibold">Kinetic Coeff (<Equation math="\mu_k" />)</span>
            <span className="font-mono text-rose-400 font-bold">{muK.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0.05"
            max={muS}
            step="0.05"
            value={muK}
            onChange={(e) => setMuK(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Applied Force */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-300 font-semibold">Applied Force (<Equation math="F_{\text{app}}" />)</span>
            <span className="font-mono text-amber-400 font-bold">{appliedForce.toFixed(1)} N</span>
          </div>
          <input
            type="range"
            min="0"
            max="60"
            step="1"
            value={appliedForce}
            onChange={(e) => setAppliedForce(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};
