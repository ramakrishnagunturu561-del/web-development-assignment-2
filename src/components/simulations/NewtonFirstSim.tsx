import React, { useState, useEffect, useRef } from 'react';
import { ForceArrow } from './ForceArrow';
import { Equation } from '../math/Equation';
import { Play, Pause, RotateCcw, Zap } from 'lucide-react';

export const NewtonFirstSim: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [posX, setPosX] = useState<number>(300); // pixels
  const [velocity, setVelocity] = useState<number>(0); // m/s
  const [hasFriction, setHasFriction] = useState<boolean>(false);
  const [activePush, setActivePush] = useState<'left' | 'right' | null>(null);
  const pushDurationRef = useRef<number>(0);

  const requestRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(performance.now());

  const PUSH_FORCE = 15; // N
  const FRICTION_COEFF = 0.05;
  const MASS = 2.0; // kg

  // Animate simulation loop
  useEffect(() => {
    const animate = (time: number) => {
      const dt = Math.min((time - lastTimeRef.current) / 1000, 0.05);
      lastTimeRef.current = time;

      if (isPlaying) {
        setPosX((prevX) => {
          let currentV = velocity;
          let appliedF = 0;

          if (activePush === 'right') appliedF += PUSH_FORCE;
          if (activePush === 'left') appliedF -= PUSH_FORCE;

          let frictionF = 0;
          if (hasFriction && Math.abs(currentV) > 0.01) {
            frictionF = -Math.sign(currentV) * (FRICTION_COEFF * MASS * 9.81);
          }

          const netF = appliedF + frictionF;
          const acc = netF / MASS;

          const newV = currentV + acc * dt;
          setVelocity(Math.abs(newV) < 0.001 ? 0 : newV);

          let newX = prevX + newV * dt * 45; // scale to screen pixels
          // Wrap around canvas edges (width 600)
          if (newX > 560) newX = 40;
          if (newX < 40) newX = 560;

          return newX;
        });

        // Handle momentary push duration
        if (activePush) {
          pushDurationRef.current += dt;
          if (pushDurationRef.current > 0.4) {
            setActivePush(null);
            pushDurationRef.current = 0;
          }
        }
      }

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [isPlaying, velocity, activePush, hasFriction]);

  const handleApplyPush = (dir: 'left' | 'right') => {
    setActivePush(dir);
    pushDurationRef.current = 0;
  };

  const handleReset = () => {
    setPosX(300);
    setVelocity(0);
    setActivePush(null);
    setIsPlaying(true);
  };

  const handleSetSpeed = (speed: number) => {
    setVelocity(speed);
  };

  const currentApplied = activePush === 'right' ? PUSH_FORCE : activePush === 'left' ? -PUSH_FORCE : 0;
  const currentFriction = hasFriction && Math.abs(velocity) > 0.01
    ? -Math.sign(velocity) * (FRICTION_COEFF * MASS * 9.81)
    : 0;
  const netForce = currentApplied + currentFriction;
  const currentAcc = netForce / MASS;

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
              <Zap size={16} />
            </span>
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
              Newton's 1st Law Interactive Lab: Law of Inertia
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Demonstrate that an object maintains constant velocity when <Equation math="\Sigma F = 0" />
          </p>
        </div>

        {/* State Badge */}
        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-mono font-bold px-2.5 py-1 rounded-full border ${
              Math.abs(netForce) < 0.01
                ? Math.abs(velocity) < 0.01
                  ? 'bg-blue-950/60 text-blue-300 border-blue-500/30'
                  : 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30'
                : 'bg-amber-950/60 text-amber-300 border-amber-500/30'
            }`}
          >
            {Math.abs(netForce) < 0.01
              ? Math.abs(velocity) < 0.01
                ? 'STATE: At Rest (ΣF = 0)'
                : 'STATE: Constant Velocity (ΣF = 0)'
              : 'STATE: Accelerating (ΣF ≠ 0)'}
          </span>
        </div>
      </div>

      {/* SVG Canvas Area */}
      <div className="relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800 p-2">
        <svg viewBox="0 0 600 240" className="w-full h-auto select-none">
          <defs>
            {/* Ice Grid Pattern */}
            <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(148, 163, 184, 0.05)" strokeWidth="1" />
            </pattern>
            {/* Ice surface gradient */}
            <linearGradient id="iceTrack" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0284c7" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#0f172a" stopOpacity="0.8" />
            </linearGradient>
          </defs>

          {/* Background grid */}
          <rect width="600" height="240" fill="url(#grid)" />

          {/* Ice track ground line */}
          <rect x="0" y="160" width="600" height="80" fill="url(#iceTrack)" />
          <line x1="0" y1="160" x2="600" y2="160" stroke="#38bdf8" strokeWidth="2" strokeOpacity={0.6} />

          {/* Ice crystals / markers */}
          {[100, 200, 300, 400, 500].map((mx) => (
            <g key={mx} opacity={0.3}>
              <line x1={mx} y1="160" x2={mx} y2="175" stroke="#94a3b8" strokeWidth="1" />
              <text x={mx} y="190" fill="#64748b" fontSize="10" fontFamily="monospace" textAnchor="middle">
                {mx - 300}m
              </text>
            </g>
          ))}

          {/* Friction indicator label */}
          <text x="300" y="225" fill="#94a3b8" fontSize="11" fontFamily="sans-serif" textAnchor="middle" opacity={0.7}>
            {hasFriction ? '⚠️ Surface: Normal Friction Enabled (μ = 0.05)' : '✨ Surface: Ideal Frictionless Ice / Space (μ = 0.00)'}
          </text>

          {/* The Moving Puck/Block */}
          <g transform={`translate(${posX}, 120)`}>
            {/* Shadow */}
            <ellipse cx="0" cy="40" rx="35" ry="6" fill="rgba(0, 0, 0, 0.5)" />

            {/* Block Body */}
            <rect
              x="-35"
              y="0"
              width="70"
              height="40"
              rx="8"
              fill="url(#puckGrad)"
              stroke="#06b6d4"
              strokeWidth="2"
            />
            <defs>
              <linearGradient id="puckGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#0e7490" />
                <stop offset="100%" stopColor="#155e75" />
              </linearGradient>
            </defs>

            {/* Block Center Marker */}
            <circle cx="0" cy="20" r="3" fill="#38bdf8" />
            <text x="0" y="24" fill="#f8fafc" fontSize="11" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
              {MASS} kg
            </text>

            {/* Force Arrows */}
            {/* Weight (W = mg) */}
            <ForceArrow
              startX={0}
              startY={20}
              length={35}
              angleDeg={270}
              color="#94a3b8"
              mathLaTeX="W=mg"
            />

            {/* Normal Force (N = mg) */}
            <ForceArrow
              startX={0}
              startY={20}
              length={35}
              angleDeg={90}
              color="#38bdf8"
              mathLaTeX="N"
            />

            {/* Push Force */}
            {activePush === 'right' && (
              <ForceArrow
                startX={0}
                startY={20}
                length={50}
                angleDeg={0}
                color="#f59e0b"
                mathLaTeX="F_{\text{push}}"
                valueText="15N"
              />
            )}
            {activePush === 'left' && (
              <ForceArrow
                startX={0}
                startY={20}
                length={50}
                angleDeg={180}
                color="#f59e0b"
                mathLaTeX="F_{\text{push}}"
                valueText="15N"
              />
            )}

            {/* Friction Force Arrow */}
            {hasFriction && Math.abs(velocity) > 0.01 && (
              <ForceArrow
                startX={0}
                startY={38}
                length={25}
                angleDeg={velocity > 0 ? 180 : 0}
                color="#f43f5e"
                mathLaTeX="f_k"
              />
            )}

            {/* Velocity Vector indicator */}
            {Math.abs(velocity) > 0.01 && (
              <g transform="translate(0, -15)">
                <line
                  x1="0"
                  y1="0"
                  x2={velocity * 12}
                  y2="0"
                  stroke="#10b981"
                  strokeWidth="2.5"
                  strokeDasharray="3 3"
                />
                <circle cx={velocity * 12} cy="0" r="3" fill="#10b981" />
                <text
                  x={velocity * 6}
                  y="-6"
                  fill="#34d399"
                  fontSize="10"
                  fontFamily="monospace"
                  textAnchor="middle"
                >
                  v = {velocity.toFixed(2)} m/s
                </text>
              </g>
            )}
          </g>
        </svg>
      </div>

      {/* Numerical Telemetry Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-4">
        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col">
          <span className="text-[11px] font-mono text-slate-400 uppercase">Net Force (ΣF)</span>
          <span className="text-lg font-mono font-bold text-cyan-300">
            {netForce.toFixed(2)} <span className="text-xs text-slate-400 font-normal">N</span>
          </span>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col">
          <span className="text-[11px] font-mono text-slate-400 uppercase">Velocity (v)</span>
          <span className={`text-lg font-mono font-bold ${Math.abs(velocity) > 0.01 ? 'text-emerald-400' : 'text-slate-400'}`}>
            {velocity.toFixed(2)} <span className="text-xs text-slate-400 font-normal">m/s</span>
          </span>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col">
          <span className="text-[11px] font-mono text-slate-400 uppercase">Acceleration (a)</span>
          <span className="text-lg font-mono font-bold text-amber-400">
            {currentAcc.toFixed(2)} <span className="text-xs text-slate-400 font-normal">m/s²</span>
          </span>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col">
          <span className="text-[11px] font-mono text-slate-400 uppercase">Vertical Forces</span>
          <span className="text-xs font-mono font-semibold text-cyan-400 mt-1">
            N - W = 0 (Balanced)
          </span>
        </div>
      </div>

      {/* Interactive Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
        {/* Force Pulse Buttons */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 uppercase mr-1">Apply Impulse:</span>
          <button
            type="button"
            onClick={() => handleApplyPush('left')}
            className="px-3 py-1.5 text-xs font-bold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-lg active:scale-95 transition-all"
          >
            ← Push Left (15 N)
          </button>
          <button
            type="button"
            onClick={() => handleApplyPush('right')}
            className="px-3 py-1.5 text-xs font-bold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-lg active:scale-95 transition-all"
          >
            Push Right (15 N) →
          </button>
        </div>

        {/* Quick Speed presets & Toggles */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => handleSetSpeed(3.0)}
            className="px-2.5 py-1 text-xs font-mono bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-md border border-slate-700"
          >
            Set v = +3 m/s
          </button>
          <button
            type="button"
            onClick={() => handleSetSpeed(0)}
            className="px-2.5 py-1 text-xs font-mono bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md border border-slate-700"
          >
            Stop (v = 0)
          </button>

          {/* Toggle Friction */}
          <button
            type="button"
            onClick={() => setHasFriction(!hasFriction)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
              hasFriction
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
            }`}
          >
            {hasFriction ? 'Disable Friction' : 'Enable Friction'}
          </button>

          {/* Play/Pause & Reset */}
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
            title="Reset simulation"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
