import React, { useState, useEffect, useRef } from 'react';
import { ForceArrow } from './ForceArrow';
import { Equation } from '../math/Equation';
import { PredictReveal } from '../pedagogy/PredictReveal';
import type { PredictRevealOption } from '../pedagogy/PredictReveal';
import { calculateAtwood } from '../../utils/physics';
import { Play, Pause, RotateCcw, ArrowDown, Activity } from 'lucide-react';

/* ── Prediction types ────────────────────────────────────────────────────── */
type SpeedChoice = 'faster' | 'slower' | 'same';
type DirectionChoice = 'left_down' | 'right_down' | 'no_motion';

interface AtwoodPred {
  speedChoice: SpeedChoice | null;
  dirChoice: DirectionChoice | null;
  prevAcceleration: number;
  prevDirection: 'balanced' | 'm1_down' | 'm2_down';
  isRevealed: boolean;
  correctSpeed: SpeedChoice | null;
  correctDir: DirectionChoice | null;
  actualDelta: number | null;
  skipped: boolean;
}

const SPEED_OPTIONS: PredictRevealOption[] = [
  { label: 'Faster', value: 'faster', icon: '⚡' },
  { label: 'Slower', value: 'slower', icon: '🐢' },
  { label: 'Same speed', value: 'same', icon: '➡️' },
];

const DIR_OPTIONS: PredictRevealOption[] = [
  { label: 'Left mass (m₁) down', value: 'left_down', icon: '⬇️' },
  { label: 'Right mass (m₂) down', value: 'right_down', icon: '⬇️' },
  { label: 'No motion (balanced)', value: 'no_motion', icon: '⚖️' },
];

function directionToChoice(dir: 'balanced' | 'm1_down' | 'm2_down'): DirectionChoice {
  if (dir === 'm1_down') return 'left_down';
  if (dir === 'm2_down') return 'right_down';
  return 'no_motion';
}

function deltaToSpeed(
  newAcc: number,
  prevAcc: number,
): SpeedChoice {
  const THRESHOLD = 0.05;
  const delta = newAcc - prevAcc;
  if (Math.abs(delta) < THRESHOLD) return 'same';
  return delta > 0 ? 'faster' : 'slower';
}

/* ── Component ──────────────────────────────────────────────────────────── */
export const AtwoodSimulation: React.FC = () => {
  const [m1, setM1] = useState<number>(2.0); // kg
  const [m2, setM2] = useState<number>(5.0); // kg
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  // Vertical offsets from center hanging position (px)
  const [offsetY, setOffsetY] = useState<number>(0); // positive: m2 down, m1 up
  const [velocity, setVelocity] = useState<number>(0);
  const [pulleyAngle, setPulleyAngle] = useState<number>(0);

  const requestRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(performance.now());

  const atwood = calculateAtwood(m1, m2, 9.81);
  // signed acceleration (positive = m2 down, m1 up)
  const signedAcc = ((m2 - m1) / (m1 + m2)) * 9.81;

  // Predict-then-reveal state
  const [pred, setPred] = useState<AtwoodPred | null>(null);
  // Phase: 'speed' = picking speed; 'dir' = picking direction; 'done' = both picked
  const [predPhase, setPredPhase] = useState<'speed' | 'dir' | 'done'>('speed');

  useEffect(() => {
    const animate = (time: number) => {
      const dt = Math.min((time - lastTimeRef.current) / 1000, 0.05);
      lastTimeRef.current = time;

      if (isPlaying) {
        setVelocity((v) => {
          const newV = v + signedAcc * dt;
          return newV;
        });

        setOffsetY((y) => {
          const newY = y + velocity * dt * 25; // scaling factor
          // Limit bounds of travel
          if (newY > 70) {
            return 70;
          }
          if (newY < -70) {
            return -70;
          }
          return newY;
        });

        setPulleyAngle((a) => a + velocity * dt * 50);
      }

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [isPlaying, signedAcc, velocity]);

  const handleReset = () => {
    setOffsetY(0);
    setVelocity(0);
    setPulleyAngle(0);
    setIsPlaying(true);
  };

  // Base hanging height
  const baseHeight = 150;
  const y1 = baseHeight - offsetY; // m1 position (moves opposite to m2)
  const y2 = baseHeight + offsetY; // m2 position

  const w1 = m1 * 9.81;
  const w2 = m2 * 9.81;

  /* ── Prediction handlers ──────────────────────────────────────────────── */
  const handleSpeedChoice = (val: string) => {
    const newPred: AtwoodPred = {
      speedChoice: val as SpeedChoice,
      dirChoice: null,
      prevAcceleration: atwood.acceleration,
      prevDirection: atwood.direction,
      isRevealed: false,
      correctSpeed: null,
      correctDir: null,
      actualDelta: null,
      skipped: false,
    };
    setPred(newPred);
    setPredPhase('dir');
  };

  const handleDirChoice = (val: string) => {
    setPred((prev) => {
      if (!prev) return null;
      return { ...prev, dirChoice: val as DirectionChoice };
    });
    setPredPhase('done');
  };

  const handleSkip = () => {
    setPred({
      speedChoice: null,
      dirChoice: null,
      prevAcceleration: atwood.acceleration,
      prevDirection: atwood.direction,
      isRevealed: false,
      correctSpeed: null,
      correctDir: null,
      actualDelta: null,
      skipped: true,
    });
    setPredPhase('speed');
  };

  /** Called when a slider actually changes value — trigger reveal if prediction is locked */
  const applyReveal = (newM1: number, newM2: number) => {
    const newAtwood = calculateAtwood(newM1, newM2, 9.81);
    setPred((prev) => {
      if (prev === null || prev.skipped) return null;
      if (prev.isRevealed) return null; // already revealed; caller resets
      if (predPhase !== 'done') return prev; // prediction not fully locked yet
      if (prev.speedChoice === null || prev.dirChoice === null) return prev;

      const correctSpeed = deltaToSpeed(newAtwood.acceleration, prev.prevAcceleration);
      const correctDir = directionToChoice(newAtwood.direction);
      const delta = newAtwood.acceleration - prev.prevAcceleration;

      return {
        ...prev,
        isRevealed: true,
        correctSpeed,
        correctDir,
        actualDelta: delta,
      };
    });
  };

  const handleM1Change = (newVal: number) => {
    if (pred !== null && pred.isRevealed) {
      // New interaction after a reveal → reset prediction
      setPred(null);
      setPredPhase('speed');
    }
    applyReveal(newVal, m2);
    setM1(newVal);
    setVelocity(0);
    setOffsetY(0);
  };

  const handleM2Change = (newVal: number) => {
    if (pred !== null && pred.isRevealed) {
      setPred(null);
      setPredPhase('speed');
    }
    applyReveal(m1, newVal);
    setM2(newVal);
    setVelocity(0);
    setOffsetY(0);
  };

  /* ── Reveal content ───────────────────────────────────────────────────── */
  const buildRevealContent = (p: AtwoodPred) => {
    const newAtwood = calculateAtwood(m1, m2, 9.81);
    const speedCorrect = p.speedChoice === p.correctSpeed;
    const dirCorrect = p.dirChoice === p.correctDir;

    const dirLabel =
      newAtwood.direction === 'm1_down'
        ? 'left mass (m₁) descends'
        : newAtwood.direction === 'm2_down'
        ? 'right mass (m₂) descends'
        : 'system is balanced';

    const sign = (p.actualDelta ?? 0) >= 0 ? '+' : '';
    const deltaStr = `${sign}${(p.actualDelta ?? 0).toFixed(2)} m/s²`;

    return (
      <span>
        {speedCorrect && dirCorrect
          ? '✓ Both correct! '
          : `Speed: ${speedCorrect ? '✓' : '✗'}  Direction: ${dirCorrect ? '✓' : '✗'}. `}
        Acceleration changed by {deltaStr} (now {newAtwood.acceleration.toFixed(2)} m/s²);{' '}
        {dirLabel}. Per a = (m₂−m₁)g/(m₁+m₂), the heavier side always descends.
      </span>
    );
  };

  /* ── What to show in the predict UI ──────────────────────────────────── */
  const showPredictUI = pred === null;
  const showSpeedPhase = !showPredictUI && pred !== null && !pred.skipped && predPhase === 'dir' && !pred.isRevealed;
  const showDoneWaiting = !showPredictUI && pred !== null && !pred.skipped && predPhase === 'done' && !pred.isRevealed;
  const showRevealed = pred !== null && !pred.skipped && pred.isRevealed;

  const speedQuestion = 'If I increase m₁, will the system accelerate faster, slower, or stay the same?';
  const dirQuestion = 'Which way will the system move?';

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
              Atwood Machine Dynamic Simulation
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Two connected masses over an ideal frictionless pulley with tension <Equation math="T" />
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-cyan-950/60 text-cyan-300 border border-cyan-500/30">
            a = {atwood.acceleration.toFixed(2)} m/s²
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
        <svg viewBox="0 0 600 300" className="w-full h-auto select-none">
          <defs>
            <pattern id="atwoodGrid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(148, 163, 184, 0.04)" strokeWidth="1" />
            </pattern>
          </defs>

          <rect width="600" height="300" fill="url(#atwoodGrid)" />

          {/* Ceiling Mount */}
          <rect x="250" y="0" width="100" height="12" fill="#334155" />
          <line x1="300" y1="12" x2="300" y2="45" stroke="#94a3b8" strokeWidth="4" />

          {/* Pulley at (300, 55), Radius = 40 */}
          <g transform="translate(300, 55)">
            <circle cx="0" cy="0" r="35" fill="#1e293b" stroke="#38bdf8" strokeWidth="3" />
            <circle cx="0" cy="0" r="8" fill="#0f172a" stroke="#64748b" strokeWidth="2" />

            {/* Rotating Spokes */}
            <g transform={`rotate(${pulleyAngle})`}>
              <line x1="-32" y1="0" x2="32" y2="0" stroke="#475569" strokeWidth="2" />
              <line x1="0" y1="-32" x2="0" y2="32" stroke="#475569" strokeWidth="2" />
            </g>
          </g>

          {/* Inextensible String Lines */}
          {/* Left string from (265, 55) down to (265, y1) */}
          <line x1="265" y1="55" x2="265" y2={y1} stroke="#f8fafc" strokeWidth="2" />
          {/* Right string from (335, 55) down to (335, y2) */}
          <line x1="335" y1="55" x2="335" y2={y2} stroke="#f8fafc" strokeWidth="2" />

          {/* Top arc of string over pulley */}
          <path d="M 265 55 A 35 35 0 0 1 335 55" fill="none" stroke="#f8fafc" strokeWidth="2" />

          {/* Mass 1 (Left, Blue) */}
          <g transform={`translate(265, ${y1})`}>
            {/* Visual size based on m1 */}
            {(() => {
              const bWidth = 32 + m1 * 4;
              const bHeight = 28 + m1 * 4;
              return (
                <>
                  <rect
                    x={-bWidth / 2}
                    y="0"
                    width={bWidth}
                    height={bHeight}
                    rx="5"
                    fill="#1e3a8a"
                    stroke="#3b82f6"
                    strokeWidth="2"
                  />
                  <circle cx="0" cy={bHeight / 2} r="3" fill="#60a5fa" />
                  <text
                    x="0"
                    y={bHeight / 2 + 4}
                    fill="#ffffff"
                    fontSize="11"
                    fontFamily="monospace"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {m1}kg
                  </text>
                  <text
                    x="0"
                    y="-8"
                    fill="#93c5fd"
                    fontSize="10"
                    fontFamily="monospace"
                    textAnchor="middle"
                  >
                    m₁
                  </text>

                  {/* Tension Vector (Upwards) */}
                  <ForceArrow
                    startX={0}
                    startY={0}
                    length={Math.min(50, atwood.tension * 0.7)}
                    angleDeg={90}
                    color="#38bdf8"
                    mathLaTeX="T"
                    valueText={`${atwood.tension.toFixed(1)}N`}
                  />

                  {/* Weight Vector (Downwards) */}
                  <ForceArrow
                    startX={0}
                    startY={bHeight}
                    length={Math.min(60, w1 * 0.7)}
                    angleDeg={270}
                    color="#94a3b8"
                    mathLaTeX="W_1"
                    valueText={`${w1.toFixed(1)}N`}
                  />
                </>
              );
            })()}
          </g>

          {/* Mass 2 (Right, Amber/Rose) */}
          <g transform={`translate(335, ${y2})`}>
            {/* Visual size based on m2 */}
            {(() => {
              const bWidth = 32 + m2 * 4;
              const bHeight = 28 + m2 * 4;
              return (
                <>
                  <rect
                    x={-bWidth / 2}
                    y="0"
                    width={bWidth}
                    height={bHeight}
                    rx="5"
                    fill="#9a3412"
                    stroke="#f97316"
                    strokeWidth="2"
                  />
                  <circle cx="0" cy={bHeight / 2} r="3" fill="#fdba74" />
                  <text
                    x="0"
                    y={bHeight / 2 + 4}
                    fill="#ffffff"
                    fontSize="11"
                    fontFamily="monospace"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {m2}kg
                  </text>
                  <text
                    x="0"
                    y="-8"
                    fill="#fed7aa"
                    fontSize="10"
                    fontFamily="monospace"
                    textAnchor="middle"
                  >
                    m₂
                  </text>

                  {/* Tension Vector (Upwards) */}
                  <ForceArrow
                    startX={0}
                    startY={0}
                    length={Math.min(50, atwood.tension * 0.7)}
                    angleDeg={90}
                    color="#38bdf8"
                    mathLaTeX="T"
                    valueText={`${atwood.tension.toFixed(1)}N`}
                  />

                  {/* Weight Vector (Downwards) */}
                  <ForceArrow
                    startX={0}
                    startY={bHeight}
                    length={Math.min(60, w2 * 0.7)}
                    angleDeg={270}
                    color="#f97316"
                    mathLaTeX="W_2"
                    valueText={`${w2.toFixed(1)}N`}
                  />
                </>
              );
            })()}
          </g>
        </svg>
      </div>

      {/* Numerical Telemetry */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-4">
        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col">
          <span className="text-[11px] font-mono text-slate-400 uppercase">Acceleration (a)</span>
          <span className="text-lg font-mono font-bold text-cyan-300">
            {atwood.acceleration.toFixed(2)} <span className="text-xs text-slate-400 font-normal">m/s²</span>
          </span>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col">
          <span className="text-[11px] font-mono text-slate-400 uppercase">String Tension (T)</span>
          <span className="text-lg font-mono font-bold text-emerald-400">
            {atwood.tension.toFixed(2)} <span className="text-xs text-slate-400 font-normal">N</span>
          </span>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col">
          <span className="text-[11px] font-mono text-slate-400 uppercase">Direction of Motion</span>
          <span className="text-xs font-mono font-bold text-amber-300 mt-1 flex items-center gap-1">
            {atwood.direction === 'm2_down' ? (
              <>
                <span>m₂ Descending</span>
                <ArrowDown size={13} />
              </>
            ) : atwood.direction === 'm1_down' ? (
              <>
                <span>m₁ Descending</span>
                <ArrowDown size={13} />
              </>
            ) : (
              'Balanced (Static Equilibrium)'
            )}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col">
          <span className="text-[11px] font-mono text-slate-400 uppercase">Formula Check</span>
          <span className="text-xs font-mono text-slate-300 mt-1">
            <Equation math="T < \max(W_1, W_2)" />
          </span>
        </div>
      </div>

      {/* Mass Control Sliders — with Predict-Then-Reveal above */}
      <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-4">
        {/* Predict prompt — Step 1: Speed */}
        {showPredictUI && (
          <PredictReveal
            question={speedQuestion}
            options={SPEED_OPTIONS}
            prediction={null}
            isRevealed={false}
            correctAnswer={null}
            onPredict={handleSpeedChoice}
            onSkip={handleSkip}
          />
        )}

        {/* Step 2: Direction (only shown after speed is picked) */}
        {showSpeedPhase && (
          <PredictReveal
            question={dirQuestion}
            options={DIR_OPTIONS}
            prediction={null}
            isRevealed={false}
            correctAnswer={null}
            onPredict={handleDirChoice}
            onSkip={handleSkip}
          />
        )}

        {/* Locked prediction waiting for slider */}
        {showDoneWaiting && pred !== null && (
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(15, 23, 42, 0.9) 100%)',
              border: '1px solid rgba(99, 102, 241, 0.35)',
              borderRadius: '14px',
            }}
            className="p-4"
          >
            <p className="text-xs font-semibold text-indigo-300">
              Prediction locked — Speed:{' '}
              <span className="text-indigo-100 font-bold capitalize">{pred.speedChoice}</span>
              {' · '}Direction:{' '}
              <span className="text-indigo-100 font-bold">
                {DIR_OPTIONS.find((o) => o.value === pred.dirChoice)?.label ?? pred.dirChoice}
              </span>
            </p>
            <p className="text-xs text-slate-400 mt-1">Now adjust m₁ or m₂ to see if you were right ↓</p>
          </div>
        )}

        {/* Reveal result */}
        {showRevealed && pred !== null && (
          <PredictReveal
            question={speedQuestion}
            options={SPEED_OPTIONS}
            prediction={pred.speedChoice}
            isRevealed={true}
            correctAnswer={pred.correctSpeed}
            onPredict={() => {}}
            onSkip={() => {
              setPred(null);
              setPredPhase('speed');
            }}
            revealedContent={buildRevealContent(pred)}
          />
        )}

        {/* The actual mass sliders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Mass 1 */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">Left Mass (<Equation math="m_1" />)</span>
              <span className="font-mono text-blue-400 font-bold">{m1.toFixed(1)} kg</span>
            </div>
            <input
              type="range"
              id="atwood-m1-slider"
              min="1.0"
              max="10.0"
              step="0.5"
              value={m1}
              onChange={(e) => handleM1Change(parseFloat(e.target.value))}
              className="w-full"
              aria-label="Left mass m1 in kilograms"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>1.0 kg</span>
              <span>Weight W₁ = {(m1 * 9.81).toFixed(1)} N</span>
              <span>10.0 kg</span>
            </div>
          </div>

          {/* Mass 2 */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">Right Mass (<Equation math="m_2" />)</span>
              <span className="font-mono text-orange-400 font-bold">{m2.toFixed(1)} kg</span>
            </div>
            <input
              type="range"
              id="atwood-m2-slider"
              min="1.0"
              max="10.0"
              step="0.5"
              value={m2}
              onChange={(e) => handleM2Change(parseFloat(e.target.value))}
              className="w-full"
              aria-label="Right mass m2 in kilograms"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>1.0 kg</span>
              <span>Weight W₂ = {(m2 * 9.81).toFixed(1)} N</span>
              <span>10.0 kg</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
