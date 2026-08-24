import React, { useState, useEffect, useRef } from 'react';
import { ForceArrow } from './ForceArrow';
import { Equation } from '../math/Equation';
import { RotateCcw, ArrowLeftRight } from 'lucide-react';

export const NewtonThirdSim: React.FC = () => {
  const [massA, setMassA] = useState<number>(2.0); // kg
  const [massB, setMassB] = useState<number>(5.0); // kg
  const [pushForce, setPushForce] = useState<number>(20.0); // N
  const [isPushing, setIsPushing] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  // Positions and velocities of Cart A (left) and Cart B (right)
  const [posA, setPosA] = useState<number>(250);
  const [posB, setPosB] = useState<number>(350);
  const [velA, setVelA] = useState<number>(0);
  const [velB, setVelB] = useState<number>(0);

  const requestRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(performance.now());
  const pushDurationRef = useRef<number>(0);

  const accA = isPushing ? -pushForce / massA : 0; // Accelerates left
  const accB = isPushing ? pushForce / massB : 0; // Accelerates right

  useEffect(() => {
    const animate = (time: number) => {
      const dt = Math.min((time - lastTimeRef.current) / 1000, 0.05);
      lastTimeRef.current = time;

      if (isPlaying) {
        if (isPushing) {
          pushDurationRef.current += dt;
          setVelA((v) => v + accA * dt);
          setVelB((v) => v + accB * dt);

          if (pushDurationRef.current > 0.6) {
            setIsPushing(false);
            pushDurationRef.current = 0;
          }
        }

        setPosA((p) => {
          let newP = p + velA * dt * 35;
          if (newP < 50) newP = 50;
          return newP;
        });

        setPosB((p) => {
          let newP = p + velB * dt * 35;
          if (newP > 550) newP = 550;
          return newP;
        });
      }

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [isPlaying, isPushing, accA, accB, velA, velB]);

  const handleTriggerPush = () => {
    // Reset positions back to contact
    setPosA(270);
    setPosB(330);
    setVelA(0);
    setVelB(0);
    setIsPushing(true);
    pushDurationRef.current = 0;
    setIsPlaying(true);
  };

  const handleReset = () => {
    setPosA(270);
    setPosB(330);
    setVelA(0);
    setVelB(0);
    setIsPushing(false);
    pushDurationRef.current = 0;
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
              <ArrowLeftRight size={16} />
            </span>
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
              Newton's 3rd Law: Action & Reaction Pairs (<Equation math="\vec{F}_{A \to B} = -\vec{F}_{B \to A}" />)
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Equal and opposite forces acting on <strong className="text-cyan-300">two separate objects</strong>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleTriggerPush}
            className="px-4 py-1.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 rounded-lg shadow-md shadow-amber-500/20 active:scale-95 transition-all"
          >
            Trigger Push Pulse
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200"
            title="Reset positions"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>

      {/* SVG Simulation Canvas */}
      <div className="relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800 p-2">
        <svg viewBox="0 0 600 230" className="w-full h-auto select-none">
          <defs>
            <pattern id="grid3" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(148, 163, 184, 0.05)" strokeWidth="1" />
            </pattern>
          </defs>

          <rect width="600" height="230" fill="url(#grid3)" />

          {/* Frictionless Track */}
          <rect x="0" y="160" width="600" height="70" fill="#0f172a" />
          <line x1="0" y1="160" x2="600" y2="160" stroke="#38bdf8" strokeWidth="2" />

          {/* Center Origin Mark */}
          <line x1="300" y1="140" x2="300" y2="180" stroke="#475569" strokeWidth="1" strokeDasharray="4 4" />
          <text x="300" y="195" fill="#64748b" fontSize="10" fontFamily="monospace" textAnchor="middle">
            Contact Plane
          </text>

          {/* Cart A (Blue) */}
          <g transform={`translate(${posA}, 160)`}>
            {/* Wheels */}
            <circle cx="-25" cy="0" r="6" fill="#334155" stroke="#64748b" strokeWidth="1.5" />
            <circle cx="25" cy="0" r="6" fill="#334155" stroke="#64748b" strokeWidth="1.5" />

            {/* Body */}
            <rect
              x="-35"
              y="-40"
              width="70"
              height="35"
              rx="6"
              fill="#1e3a8a"
              stroke="#3b82f6"
              strokeWidth="2"
            />
            <text x="0" y="-20" fill="#93c5fd" fontSize="11" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
              Cart A ({massA}kg)
            </text>

            {/* Reaction Force on Cart A (from B) */}
            {isPushing && (
              <ForceArrow
                startX={35}
                startY={-22}
                length={pushForce * 2.2}
                angleDeg={180}
                color="#38bdf8"
                mathLaTeX="\vec{F}_{B \to A}"
                valueText={`${pushForce}N`}
              />
            )}

            {/* Velocity readout above Cart A */}
            {Math.abs(velA) > 0.05 && (
              <text x="0" y="-50" fill="#60a5fa" fontSize="10" fontFamily="monospace" textAnchor="middle">
                v_A = {velA.toFixed(2)} m/s
              </text>
            )}
          </g>

          {/* Cart B (Rose/Orange) */}
          <g transform={`translate(${posB}, 160)`}>
            {/* Wheels */}
            <circle cx="-25" cy="0" r="6" fill="#334155" stroke="#64748b" strokeWidth="1.5" />
            <circle cx="25" cy="0" r="6" fill="#334155" stroke="#64748b" strokeWidth="1.5" />

            {/* Body */}
            <rect
              x="-35"
              y="-40"
              width="70"
              height="35"
              rx="6"
              fill="#881337"
              stroke="#f43f5e"
              strokeWidth="2"
            />
            <text x="0" y="-20" fill="#fecdd3" fontSize="11" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
              Cart B ({massB}kg)
            </text>

            {/* Action Force on Cart B (from A) */}
            {isPushing && (
              <ForceArrow
                startX={-35}
                startY={-22}
                length={pushForce * 2.2}
                angleDeg={0}
                color="#f43f5e"
                mathLaTeX="\vec{F}_{A \to B}"
                valueText={`${pushForce}N`}
              />
            )}

            {/* Velocity readout above Cart B */}
            {Math.abs(velB) > 0.05 && (
              <text x="0" y="-50" fill="#fb7185" fontSize="10" fontFamily="monospace" textAnchor="middle">
                v_B = +{velB.toFixed(2)} m/s
              </text>
            )}
          </g>
        </svg>
      </div>

      {/* Force Comparison Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-4">
        {/* Object A Card */}
        <div className="p-3.5 rounded-xl bg-blue-950/30 border border-blue-500/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
              Force Acting On Cart A
            </span>
            <span className="text-xs font-mono text-cyan-300">
              <Equation math="\vec{F}_{B \to A} = -20\text{ N}" />
            </span>
          </div>
          <div className="space-y-1 text-xs text-slate-300">
            <div className="flex justify-between">
              <span>Acceleration of A:</span>
              <span className="font-mono text-blue-300 font-bold">
                a_A = {(-pushForce / massA).toFixed(2)} m/s² (Left)
              </span>
            </div>
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>Origin of Force:</span>
              <span>Exerted by Cart B onto Cart A</span>
            </div>
          </div>
        </div>

        {/* Object B Card */}
        <div className="p-3.5 rounded-xl bg-rose-950/30 border border-rose-500/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">
              Force Acting On Cart B
            </span>
            <span className="text-xs font-mono text-rose-300">
              <Equation math="\vec{F}_{A \to B} = +20\text{ N}" />
            </span>
          </div>
          <div className="space-y-1 text-xs text-slate-300">
            <div className="flex justify-between">
              <span>Acceleration of B:</span>
              <span className="font-mono text-rose-300 font-bold">
                a_B = +{(pushForce / massB).toFixed(2)} m/s² (Right)
              </span>
            </div>
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>Origin of Force:</span>
              <span>Exerted by Cart A onto Cart B</span>
            </div>
          </div>
        </div>
      </div>

      {/* Control Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-slate-950/70 border border-slate-800">
        {/* Mass A */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-300 font-semibold">Mass of Cart A (<Equation math="m_A" />)</span>
            <span className="font-mono text-blue-400 font-bold">{massA.toFixed(1)} kg</span>
          </div>
          <input
            type="range"
            min="1.0"
            max="10.0"
            step="0.5"
            value={massA}
            onChange={(e) => setMassA(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Mass B */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-300 font-semibold">Mass of Cart B (<Equation math="m_B" />)</span>
            <span className="font-mono text-rose-400 font-bold">{massB} kg</span>
          </div>
          <input
            type="range"
            min="1.0"
            max="10.0"
            step="0.5"
            value={massB}
            onChange={(e) => setMassB(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Push Force */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-300 font-semibold">Interactive Contact Force (<Equation math="F" />)</span>
            <span className="font-mono text-amber-400 font-bold">{pushForce.toFixed(0)} N</span>
          </div>
          <input
            type="range"
            min="5"
            max="50"
            step="5"
            value={pushForce}
            onChange={(e) => setPushForce(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};
