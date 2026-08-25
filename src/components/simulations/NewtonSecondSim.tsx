import React, { useState, useEffect, useRef } from 'react';
import { ForceArrow } from './ForceArrow';
import { Equation } from '../math/Equation';
import { PredictReveal } from '../pedagogy/PredictReveal';
import type { PredictRevealOption } from '../pedagogy/PredictReveal';
import { calculateAcceleration, calculateNormalForce } from '../../utils/physics';
import { Play, Pause, RotateCcw, Activity, Info } from 'lucide-react';

/* ── Prediction state types ─────────────────────────────────────────────── */
type PredParam = 'force' | 'mass';

interface PredState {
  param: PredParam;
  prediction: string | null;
  prevAcceleration: number;
  isRevealed: boolean;
  correctAnswer: string | null;
  actualDelta: number | null; // signed delta in m/s²
  skipped: boolean;
}

function deltaToDir(delta: number): 'up' | 'down' | 'same' {
  if (Math.abs(delta) < 0.05) return 'same';
  return delta > 0 ? 'up' : 'down';
}

const ACCEL_OPTIONS: PredictRevealOption[] = [
  { label: 'Go up ↑', value: 'up', icon: '📈' },
  { label: 'Go down ↓', value: 'down', icon: '📉' },
  { label: 'Stay the same', value: 'same', icon: '➡️' },
];

/* ── Component ──────────────────────────────────────────────────────────── */
export const NewtonSecondSim: React.FC = () => {
  const [mass, setMass] = useState<number>(2.0); // kg
  const [appliedForce, setAppliedForce] = useState<number>(10.0); // N (+ right, - left)
  const [hasFriction, setHasFriction] = useState<boolean>(false);
  const muK = 0.2; // kinetic friction coefficient
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  const [position, setPosition] = useState<number>(300);
  const [velocity, setVelocity] = useState<number>(0);

  // Predict-then-reveal state — one for each slider (mass & force)
  const [massPred, setMassPred] = useState<PredState | null>(null);
  const [forcePred, setForcePred] = useState<PredState | null>(null);

  const requestRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(performance.now());

  // Physical calculations
  const normalForce = calculateNormalForce(mass);
  const frictionForceMagnitude = hasFriction ? muK * normalForce : 0;

  // Friction opposes velocity or applied force if velocity is zero
  let frictionForce = 0;
  if (hasFriction) {
    if (Math.abs(velocity) > 0.01) {
      frictionForce = -Math.sign(velocity) * frictionForceMagnitude;
    } else if (Math.abs(appliedForce) > 0.01) {
      frictionForce = -Math.sign(appliedForce) * frictionForceMagnitude;
    }
  }

  const netForce = appliedForce + frictionForce;
  const acceleration = calculateAcceleration(netForce, mass);

  // Physics animation loop
  useEffect(() => {
    const animate = (time: number) => {
      const dt = Math.min((time - lastTimeRef.current) / 1000, 0.05);
      lastTimeRef.current = time;

      if (isPlaying) {
        setVelocity((prevV) => {
          const newV = prevV + acceleration * dt;
          return newV;
        });

        setPosition((prevX) => {
          let newX = prevX + velocity * dt * 40; // pixel scale
          if (newX > 560) newX = 40;
          if (newX < 40) newX = 560;
          return newX;
        });
      }

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [isPlaying, acceleration, velocity]);

  const handleReset = () => {
    setPosition(300);
    setVelocity(0);
    setIsPlaying(true);
  };

  /* ── Prediction handlers ──────────────────────────────────────────────── */
  const handleMassPredict = (choice: string) => {
    setMassPred({
      param: 'mass',
      prediction: choice,
      prevAcceleration: acceleration,
      isRevealed: false,
      correctAnswer: null,
      actualDelta: null,
      skipped: false,
    });
  };

  const handleForcePredict = (choice: string) => {
    setForcePred({
      param: 'force',
      prediction: choice,
      prevAcceleration: acceleration,
      isRevealed: false,
      correctAnswer: null,
      actualDelta: null,
      skipped: false,
    });
  };

  const handleMassChange = (newMass: number) => {
    setMass(newMass);
    // Compute new acceleration with updated mass
    const newNormal = calculateNormalForce(newMass);
    const newFriction = hasFriction ? muK * newNormal : 0;
    const newFrictionForce = hasFriction && Math.abs(appliedForce) > 0.01
      ? -Math.sign(appliedForce) * newFriction
      : 0;
    const newNet = appliedForce + newFrictionForce;
    const newAcc = calculateAcceleration(newNet, newMass);

    setMassPred((prev) => {
      if (prev === null || prev.skipped) return null;
      if (prev.isRevealed) {
        // User moved slider again after reveal → start fresh
        return null;
      }
      if (prev.prediction === null) return prev;
      const delta = newAcc - prev.prevAcceleration;
      const correct = deltaToDir(delta);
      return {
        ...prev,
        isRevealed: true,
        actualDelta: delta,
        correctAnswer: correct,
      };
    });
    // Reset force prediction when mass changes (fresh interaction)
    setForcePred(null);
    setVelocity(0);
  };

  const handleForceChange = (newForce: number) => {
    setAppliedForce(newForce);
    const newFriction = hasFriction ? muK * normalForce : 0;
    const newFrictionForce = hasFriction && Math.abs(newForce) > 0.01
      ? -Math.sign(newForce) * newFriction
      : 0;
    const newNet = newForce + newFrictionForce;
    const newAcc = calculateAcceleration(newNet, mass);

    setForcePred((prev) => {
      if (prev === null || prev.skipped) return null;
      if (prev.isRevealed) return null;
      if (prev.prediction === null) return prev;
      const delta = newAcc - prev.prevAcceleration;
      const correct = deltaToDir(delta);
      return {
        ...prev,
        isRevealed: true,
        actualDelta: delta,
        correctAnswer: correct,
      };
    });
    setMassPred(null);
    setVelocity(0);
  };

  /* ── Reveal content builders ──────────────────────────────────────────── */
  const buildRevealContent = (pred: PredState, paramLabel: string) => {
    const dir = pred.actualDelta !== null ? deltaToDir(pred.actualDelta) : 'same';
    const dirLabel = dir === 'up' ? 'increased' : dir === 'down' ? 'decreased' : 'stayed the same';
    const sign = pred.actualDelta !== null ? (pred.actualDelta >= 0 ? '+' : '') : '';
    const deltaStr = pred.actualDelta !== null ? `${sign}${pred.actualDelta.toFixed(2)} m/s²` : '';
    const accStr = acceleration.toFixed(2);

    return (
      <span>
        Acceleration {dirLabel} ({deltaStr} → now {accStr} m/s²).{' '}
        {paramLabel === 'force'
          ? 'Per a = F/m, increasing net force directly increases acceleration.'
          : 'Per a = F/m, increasing mass in the denominator reduces acceleration.'}
      </span>
    );
  };

  /* ── Should we show the predict prompt? ──────────────────────────────── */
  // Show mass prediction prompt if no prediction is active yet for mass
  const showMassPredictPrompt = massPred === null;
  const showForcePredictPrompt = forcePred === null;

  const massQuestion = `If I increase the mass, will the acceleration go up, down, or stay the same?`;
  const forceQuestion = `If I increase the applied force, will the acceleration go up, down, or stay the same?`;

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
              <Activity size={16} />
            </span>
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
              Newton's 2nd Law Simulation (<Equation math="\Sigma F = ma" />)
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Vary mass and applied force to observe direct proportionality of acceleration
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-cyan-950/60 text-cyan-300 border border-cyan-500/30">
            a = {acceleration.toFixed(2)} m/s²
          </span>
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

      {/* SVG Canvas Area */}
      <div className="relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800 p-2">
        <svg viewBox="0 0 600 230" className="w-full h-auto select-none">
          <defs>
            <pattern id="grid2" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(148, 163, 184, 0.05)" strokeWidth="1" />
            </pattern>
            <linearGradient id="groundGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#070b14" />
            </linearGradient>
            <linearGradient id="blockGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#1d4ed8" />
            </linearGradient>
          </defs>

          {/* Background Grid */}
          <rect width="600" height="230" fill="url(#grid2)" />

          {/* Ground */}
          <rect x="0" y="150" width="600" height="80" fill="url(#groundGrad)" />
          <line x1="0" y1="150" x2="600" y2="150" stroke="#475569" strokeWidth="2" />

          {/* Ground Hash Marks */}
          {[60, 140, 220, 300, 380, 460, 540].map((gx) => (
            <line key={gx} x1={gx} y1="150" x2={gx - 10} y2="162" stroke="#334155" strokeWidth="1.5" />
          ))}

          {/* The Accelerated Block (Scales visually with mass) */}
          <g transform={`translate(${position}, 150)`}>
            {/* Block Size computed by mass */}
            {(() => {
              const bWidth = 30 + mass * 10;
              const bHeight = 25 + mass * 6;
              return (
                <>
                  {/* Shadow */}
                  <ellipse cx="0" cy="0" rx={bWidth / 2 + 6} ry="5" fill="rgba(0,0,0,0.5)" />

                  {/* Block Body */}
                  <rect
                    x={-bWidth / 2}
                    y={-bHeight}
                    width={bWidth}
                    height={bHeight}
                    rx="6"
                    fill="url(#blockGrad)"
                    stroke="#38bdf8"
                    strokeWidth="2"
                  />

                  {/* Center Dot */}
                  <circle cx="0" cy={-bHeight / 2} r="3" fill="#67e8f9" />
                  <text
                    x="0"
                    y={-bHeight / 2 + 4}
                    fill="#f8fafc"
                    fontSize="11"
                    fontFamily="monospace"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {mass} kg
                  </text>

                  {/* Weight Force (W = mg) */}
                  <ForceArrow
                    startX={0}
                    startY={-bHeight / 2}
                    length={Math.min(65, 15 + mass * 8)}
                    angleDeg={270}
                    color="#94a3b8"
                    mathLaTeX="W"
                    valueText={`${(mass * 9.81).toFixed(1)}N`}
                  />

                  {/* Normal Force (N = mg) */}
                  <ForceArrow
                    startX={0}
                    startY={-bHeight / 2}
                    length={Math.min(65, 15 + mass * 8)}
                    angleDeg={90}
                    color="#38bdf8"
                    mathLaTeX="N"
                    valueText={`${normalForce.toFixed(1)}N`}
                  />

                  {/* Applied Force */}
                  {Math.abs(appliedForce) > 0.1 && (
                    <ForceArrow
                      startX={0}
                      startY={-bHeight / 2}
                      length={Math.min(80, Math.abs(appliedForce) * 2.5)}
                      angleDeg={appliedForce > 0 ? 0 : 180}
                      color="#f59e0b"
                      mathLaTeX="F_{\text{app}}"
                      valueText={`${Math.abs(appliedForce).toFixed(0)}N`}
                    />
                  )}

                  {/* Friction Force */}
                  {hasFriction && Math.abs(frictionForce) > 0.1 && (
                    <ForceArrow
                      startX={0}
                      startY={-2}
                      length={Math.min(50, Math.abs(frictionForce) * 2.5)}
                      angleDeg={frictionForce > 0 ? 0 : 180}
                      color="#f43f5e"
                      mathLaTeX="f_k"
                      valueText={`${Math.abs(frictionForce).toFixed(1)}N`}
                    />
                  )}

                  {/* Acceleration Indicator Banner above block */}
                  <g transform={`translate(0, ${-bHeight - 25})`}>
                    <line
                      x1="0"
                      y1="0"
                      x2={acceleration * 8}
                      y2="0"
                      stroke="#a855f7"
                      strokeWidth="2.5"
                    />
                    <polygon
                      points={`${acceleration * 8},0 ${acceleration * 8 - Math.sign(acceleration) * 5},-4 ${acceleration * 8 - Math.sign(acceleration) * 5},4`}
                      fill="#a855f7"
                    />
                    <text
                      x="0"
                      y="-6"
                      fill="#c084fc"
                      fontSize="10"
                      fontFamily="monospace"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      a = {acceleration.toFixed(2)} m/s²
                    </text>
                  </g>
                </>
              );
            })()}
          </g>
        </svg>
      </div>

      {/* Live Readouts */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-4">
        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col">
          <span className="text-[11px] font-mono text-slate-400 uppercase">Mass (m)</span>
          <span className="text-lg font-mono font-bold text-cyan-300">
            {mass.toFixed(1)} <span className="text-xs text-slate-400 font-normal">kg</span>
          </span>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col">
          <span className="text-[11px] font-mono text-slate-400 uppercase">Net Force (ΣF)</span>
          <span className="text-lg font-mono font-bold text-amber-400">
            {netForce.toFixed(2)} <span className="text-xs text-slate-400 font-normal">N</span>
          </span>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col">
          <span className="text-[11px] font-mono text-slate-400 uppercase">Acceleration (a = ΣF/m)</span>
          <span className="text-lg font-mono font-bold text-purple-400">
            {acceleration.toFixed(2)} <span className="text-xs text-slate-400 font-normal">m/s²</span>
          </span>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col">
          <span className="text-[11px] font-mono text-slate-400 uppercase">Velocity (v)</span>
          <span className="text-lg font-mono font-bold text-emerald-400">
            {velocity.toFixed(2)} <span className="text-xs text-slate-400 font-normal">m/s</span>
          </span>
        </div>
      </div>

      {/* Control Sliders & Toggles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-950/70 border border-slate-800">
        {/* Mass Slider — with Predict-Then-Reveal */}
        <div className="space-y-1.5">
          {/* Predict prompt for mass */}
          {showMassPredictPrompt && (
            <PredictReveal
              question={massQuestion}
              options={ACCEL_OPTIONS}
              prediction={null}
              isRevealed={false}
              correctAnswer={null}
              onPredict={handleMassPredict}
              onSkip={() =>
                setMassPred({
                  param: 'mass',
                  prediction: null,
                  prevAcceleration: acceleration,
                  isRevealed: false,
                  correctAnswer: null,
                  actualDelta: null,
                  skipped: true,
                })
              }
            />
          )}

          {/* Pending or revealed state for mass */}
          {massPred !== null && !massPred.skipped && (
            <PredictReveal
              question={massQuestion}
              options={ACCEL_OPTIONS}
              prediction={massPred.prediction}
              isRevealed={massPred.isRevealed}
              correctAnswer={massPred.correctAnswer}
              onPredict={handleMassPredict}
              onSkip={() => setMassPred(null)}
              revealedContent={
                massPred.isRevealed ? buildRevealContent(massPred, 'mass') : undefined
              }
            />
          )}

          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300">Object Mass (<Equation math="m" />)</span>
            <span className="font-mono text-cyan-400 font-bold">{mass.toFixed(1)} kg</span>
          </div>
          <input
            type="range"
            id="newton2-mass-slider"
            min="0.5"
            max="10.0"
            step="0.5"
            value={mass}
            onChange={(e) => handleMassChange(parseFloat(e.target.value))}
            className="w-full"
            aria-label="Object mass in kilograms"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>0.5 kg (Light)</span>
            <span>10.0 kg (Heavy)</span>
          </div>
        </div>

        {/* Applied Force Slider — with Predict-Then-Reveal */}
        <div className="space-y-1.5">
          {/* Predict prompt for force */}
          {showForcePredictPrompt && (
            <PredictReveal
              question={forceQuestion}
              options={ACCEL_OPTIONS}
              prediction={null}
              isRevealed={false}
              correctAnswer={null}
              onPredict={handleForcePredict}
              onSkip={() =>
                setForcePred({
                  param: 'force',
                  prediction: null,
                  prevAcceleration: acceleration,
                  isRevealed: false,
                  correctAnswer: null,
                  actualDelta: null,
                  skipped: true,
                })
              }
            />
          )}

          {/* Pending or revealed state for force */}
          {forcePred !== null && !forcePred.skipped && (
            <PredictReveal
              question={forceQuestion}
              options={ACCEL_OPTIONS}
              prediction={forcePred.prediction}
              isRevealed={forcePred.isRevealed}
              correctAnswer={forcePred.correctAnswer}
              onPredict={handleForcePredict}
              onSkip={() => setForcePred(null)}
              revealedContent={
                forcePred.isRevealed ? buildRevealContent(forcePred, 'force') : undefined
              }
            />
          )}

          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300">Applied Force (<Equation math="F_{\text{app}}" />)</span>
            <span className="font-mono text-amber-400 font-bold">{appliedForce.toFixed(0)} N</span>
          </div>
          <input
            type="range"
            id="newton2-force-slider"
            min="-30"
            max="30"
            step="2"
            value={appliedForce}
            onChange={(e) => handleForceChange(parseFloat(e.target.value))}
            className="w-full"
            aria-label="Applied force in Newtons"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>-30 N (Left)</span>
            <span>0 N</span>
            <span>+30 N (Right)</span>
          </div>
        </div>

        {/* Friction Toggle & Friction Coeff */}
        <div className="flex items-center justify-between col-span-1 md:col-span-2 pt-2 border-t border-slate-800">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setHasFriction(!hasFriction)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                hasFriction
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              {hasFriction ? '✓ Friction Enabled' : 'Friction Disabled'}
            </button>

            {hasFriction && (
              <span className="text-xs text-slate-400 flex items-center gap-1.5 font-mono">
                <Equation math="\mu_k" /> = {muK.toFixed(2)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Info size={13} className="text-cyan-400" />
            <span>Notice: As mass doubles, acceleration is cut in half!</span>
          </div>
        </div>
      </div>
    </div>
  );
};
