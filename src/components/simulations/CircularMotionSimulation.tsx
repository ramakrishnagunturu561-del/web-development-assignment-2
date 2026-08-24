import React, { useState, useEffect, useRef } from 'react';
import { ForceArrow } from './ForceArrow';
import { Equation } from '../math/Equation';
import { calculateCentripetal } from '../../utils/physics';
import { Play, Pause, RotateCcw, Orbit, Scissors } from 'lucide-react';

export const CircularMotionSimulation: React.FC = () => {
  const [mass, setMass] = useState<number>(2.0); // kg
  const [velocity, setVelocity] = useState<number>(6.0); // m/s
  const [radius, setRadius] = useState<number>(3.0); // m
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  // String snapped state for tangential inertia demo
  const [isStringSnapped, setIsStringSnapped] = useState<boolean>(false);
  const [tangentPos, setTangentPos] = useState<{ x: number; y: number; vx: number; vy: number } | null>(null);

  const [angle, setAngle] = useState<number>(0); // radians

  const requestRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(performance.now());

  const ucm = calculateCentripetal(mass, velocity, radius);

  useEffect(() => {
    const animate = (time: number) => {
      const dt = Math.min((time - lastTimeRef.current) / 1000, 0.05);
      lastTimeRef.current = time;

      if (isPlaying) {
        if (!isStringSnapped) {
          setAngle((prev) => {
            const next = prev + ucm.angularVelocity * dt;
            return next % (2 * Math.PI);
          });
        } else if (tangentPos) {
          // Tangential inertial motion (straight line)
          setTangentPos((p) => {
            if (!p) return null;
            return {
              x: p.x + p.vx * dt * 25,
              y: p.y + p.vy * dt * 25,
              vx: p.vx,
              vy: p.vy,
            };
          });
        }
      }

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [isPlaying, isStringSnapped, ucm.angularVelocity, tangentPos]);

  const handleSnapString = () => {
    if (isStringSnapped) return;

    // Center of circle at (220, 150), pixel radius scale = radius * 28
    const rPx = radius * 28;
    const px = 220 + rPx * Math.cos(angle);
    const py = 150 + rPx * Math.sin(angle);

    // Tangent velocity components
    const vx = -velocity * Math.sin(angle);
    const vy = velocity * Math.cos(angle);

    setTangentPos({ x: px, y: py, vx, vy });
    setIsStringSnapped(true);
  };

  const handleReset = () => {
    setIsStringSnapped(false);
    setTangentPos(null);
    setAngle(0);
    setIsPlaying(true);
  };

  // Center coordinate
  const cx = 220;
  const cy = 150;
  const pixelRadius = radius * 28;

  // Particle position on circle
  const px = !isStringSnapped ? cx + pixelRadius * Math.cos(angle) : tangentPos?.x || cx;
  const py = !isStringSnapped ? cy + pixelRadius * Math.sin(angle) : tangentPos?.y || cy;

  // Vector angles
  // Radial inward angle towards (cx, cy)
  const centripetalAngleDeg = (((angle + Math.PI) * 180) / Math.PI + 360) % 360;
  // Tangential velocity angle
  const velocityAngleDeg = (((angle + Math.PI / 2) * 180) / Math.PI + 360) % 360;

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
              <Orbit size={16} />
            </span>
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
              Uniform Circular Motion & Centripetal Dynamics
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Radial acceleration <Equation math="a_c = \frac{v^2}{r}" /> directed towards circle center
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSnapString}
            disabled={isStringSnapped}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all ${
              isStringSnapped
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30 active:scale-95'
            }`}
          >
            <Scissors size={13} />
            <span>{isStringSnapped ? 'String Cut!' : 'Cut Tether String!'}</span>
          </button>

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
            title="Reset orbit"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>

      {/* SVG Canvas and Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
        {/* SVG Orbital Canvas */}
        <div className="lg:col-span-7 relative rounded-xl bg-slate-950 border border-slate-800 p-2 flex items-center justify-center min-h-[300px]">
          <svg viewBox="0 0 440 300" className="w-full max-w-[440px] h-auto select-none">
            <defs>
              <pattern id="ucmGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(148, 163, 184, 0.04)" strokeWidth="1" />
              </pattern>
            </defs>

            <rect width="440" height="300" fill="url(#ucmGrid)" />

            {/* Circular Orbit Path */}
            <circle
              cx={cx}
              cy={cy}
              r={pixelRadius}
              fill="none"
              stroke="#0284c7"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              opacity={0.6}
            />

            {/* Center Pivot Point */}
            <circle cx={cx} cy={cy} r="6" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
            <circle cx={cx} cy={cy} r="2" fill="#38bdf8" />
            <text x={cx} y={cy + 18} fill="#64748b" fontSize="9" fontFamily="monospace" textAnchor="middle">
              Center
            </text>

            {/* Tension/Tether string line (only if string not snapped) */}
            {!isStringSnapped && (
              <line x1={cx} y1={cy} x2={px} y2={py} stroke="#94a3b8" strokeWidth="1.5" />
            )}

            {/* Radius dimension label */}
            {!isStringSnapped && (
              <text
                x={(cx + px) / 2}
                y={(cy + py) / 2 - 8}
                fill="#38bdf8"
                fontSize="10"
                fontFamily="monospace"
                fontWeight="bold"
                textAnchor="middle"
              >
                r = {radius.toFixed(1)}m
              </text>
            )}

            {/* The Moving Particle / Satellite */}
            <g transform={`translate(${px}, ${py})`}>
              <circle cx="0" cy="0" r="10" fill="#0369a1" stroke="#38bdf8" strokeWidth="2.5" />
              <text x="0" y="3.5" fill="#f8fafc" fontSize="8" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                {mass}kg
              </text>

              {/* Tangential Velocity Vector (Green) */}
              {!isStringSnapped && (
                <ForceArrow
                  startX={0}
                  startY={0}
                  length={Math.min(65, velocity * 4.5)}
                  angleDeg={velocityAngleDeg}
                  color="#10b981"
                  isMathCoord={false}
                  mathLaTeX="\vec{v}"
                  valueText={`${velocity}m/s`}
                />
              )}

              {/* Centripetal Force Vector (Cyan / Inward) */}
              {!isStringSnapped && (
                <ForceArrow
                  startX={0}
                  startY={0}
                  length={Math.min(65, ucm.centripetalForce * 0.7)}
                  angleDeg={centripetalAngleDeg}
                  color="#06b6d4"
                  isMathCoord={false}
                  mathLaTeX="\vec{F}_c"
                  valueText={`${ucm.centripetalForce.toFixed(0)}N`}
                />
              )}
            </g>

            {/* Tangential path indicator when snapped */}
            {isStringSnapped && (
              <text x="220" y="270" fill="#f43f5e" fontSize="11" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">
                ⚠️ Tether Cut: Object flies straight along velocity tangent (Newton's 1st Law!)
              </text>
            )}
          </svg>
        </div>

        {/* Real-time Math & Telemetry */}
        <div className="lg:col-span-5 space-y-3">
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Circular Kinematics & Dynamics
            </h4>

            {/* Centripetal Acceleration */}
            <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-950/70 border border-slate-800 font-mono">
              <span className="text-slate-400">
                <Equation math="a_c = \frac{v^2}{r}" />
              </span>
              <span className="font-bold text-cyan-300 text-sm">
                {ucm.centripetalAcceleration.toFixed(2)} m/s²
              </span>
            </div>

            {/* Centripetal Force */}
            <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-950/70 border border-slate-800 font-mono">
              <span className="text-slate-400">
                <Equation math="F_c = \frac{mv^2}{r}" />
              </span>
              <span className="font-bold text-emerald-400 text-sm">
                {ucm.centripetalForce.toFixed(2)} N
              </span>
            </div>

            {/* Orbital Period */}
            <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-950/70 border border-slate-800 font-mono">
              <span className="text-slate-400">
                <Equation math="T = \frac{2\pi r}{v}" />
              </span>
              <span className="font-bold text-amber-300">
                {ucm.period.toFixed(2)} s
              </span>
            </div>

            {/* Angular Speed */}
            <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-950/70 border border-slate-800 font-mono">
              <span className="text-slate-400">
                <Equation math="\omega = \frac{v}{r}" />
              </span>
              <span className="font-bold text-purple-300">
                {ucm.angularVelocity.toFixed(2)} rad/s
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/20 text-xs text-slate-300 leading-relaxed">
            <span className="font-semibold text-cyan-300">IB Insight: </span>
            Notice that doubling velocity <Equation math="v \to 2v" /> quadruples the required centripetal force <Equation math="F_c \to 4F_c" />!
          </div>
        </div>
      </div>

      {/* Control Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4 pt-3 border-t border-slate-800">
        {/* Mass */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-300 font-semibold">Mass (<Equation math="m" />)</span>
            <span className="text-cyan-400 font-bold">{mass.toFixed(1)} kg</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="5.0"
            step="0.5"
            value={mass}
            onChange={(e) => setMass(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Speed */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-300 font-semibold">Orbital Speed (<Equation math="v" />)</span>
            <span className="text-emerald-400 font-bold">{velocity.toFixed(1)} m/s</span>
          </div>
          <input
            type="range"
            min="1.0"
            max="12.0"
            step="0.5"
            value={velocity}
            onChange={(e) => setVelocity(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Radius */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-300 font-semibold">Orbit Radius (<Equation math="r" />)</span>
            <span className="text-amber-400 font-bold">{radius.toFixed(1)} m</span>
          </div>
          <input
            type="range"
            min="1.0"
            max="4.5"
            step="0.5"
            value={radius}
            onChange={(e) => setRadius(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};
