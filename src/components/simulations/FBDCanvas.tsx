import React, { useState } from 'react';
import { ForceArrow } from './ForceArrow';
import { Equation } from '../math/Equation';
import { CheckCircle2, XCircle, HelpCircle, Layers } from 'lucide-react';
import confetti from 'canvas-confetti';

interface FBDScenario {
  id: string;
  title: string;
  situation: string;
  contextNote: string;
  correctForces: string[];
  explanation: string;
}

const SCENARIOS: FBDScenario[] = [
  {
    id: 'rest-flat',
    title: 'Scenario 1: Box at Rest on Flat Table',
    situation: 'A crate sits stationary on a smooth horizontal wooden table with no horizontal forces acting on it.',
    contextNote: 'Vertical forces must balance (ΣF_y = 0); no horizontal forces.',
    correctForces: ['weight', 'normal'],
    explanation: 'Only Gravity (Weight W acting downwards towards Earth center) and the Contact Normal Force (N acting perpendicularly upwards from table surface) are present. Since it is at rest with no horizontal force, friction is zero.',
  },
  {
    id: 'pulled-constant-v',
    title: 'Scenario 2: Box Pulled at Constant Velocity with Friction',
    situation: 'A box is pulled to the right with a horizontal rope at a steady constant speed across a rough floor.',
    contextNote: 'Constant speed implies ΣF_x = 0 and ΣF_y = 0 (Translational Equilibrium).',
    correctForces: ['weight', 'normal', 'tension', 'friction'],
    explanation: 'Four forces act: Weight W (downwards), Normal force N (upwards, equal to W), Tension T (to the right from rope), and Dynamic Friction f_k (to the left opposing motion, equal in magnitude to T).',
  },
  {
    id: 'accelerating-push',
    title: 'Scenario 3: Box Accelerating Right with Applied Push',
    situation: 'A worker pushes a heavy box to the right, causing it to speed up across a rough concrete floor.',
    contextNote: 'Net force to the right (F_app > f_k).',
    correctForces: ['weight', 'normal', 'applied', 'friction'],
    explanation: 'Four forces act: Weight W (downwards), Normal Force N (upwards), Applied Push F_app (rightwards), and Friction f_k (leftwards, smaller in magnitude than F_app).',
  },
  {
    id: 'angled-pull',
    title: 'Scenario 4: Box Pulled Upward at an Angle',
    situation: 'A sled is pulled by a rope tilted at 30° above horizontal across snow.',
    contextNote: 'The rope pulls both forward and slightly upward!',
    correctForces: ['weight', 'normal', 'tension_angled', 'friction'],
    explanation: 'Weight acts down. Normal force acts up (Notice: N < W because the rope provides vertical support T*sin(θ)!). Tension acts diagonally up-right, and friction acts left.',
  },
];

interface AvailableForce {
  id: string;
  label: string;
  mathLaTeX: string;
  direction: number; // degrees (0=right, 90=up, 180=left, 270=down, 30=diagonal)
  color: string;
  description: string;
}

const AVAILABLE_FORCES: AvailableForce[] = [
  { id: 'weight', label: 'Weight (W = mg)', mathLaTeX: '\\vec{W}', direction: 270, color: '#94a3b8', description: 'Downwards gravitational pull of Earth' },
  { id: 'normal', label: 'Normal Force (N)', mathLaTeX: '\\vec{N}', direction: 90, color: '#38bdf8', description: 'Perpendicular support from surface' },
  { id: 'applied', label: 'Applied Push (F_app)', mathLaTeX: '\\vec{F}_{\\text{app}}', direction: 0, color: '#f59e0b', description: 'Rightwards push from external agent' },
  { id: 'friction', label: 'Friction Force (f)', mathLaTeX: '\\vec{f}', direction: 180, color: '#f43f5e', description: 'Leftwards contact resistance opposing motion' },
  { id: 'tension', label: 'Tension (T)', mathLaTeX: '\\vec{T}', direction: 0, color: '#10b981', description: 'Rightwards pulling force from rope/cable' },
  { id: 'tension_angled', label: 'Angled Tension (T ∠ 30°)', mathLaTeX: '\\vec{T}_{\\theta}', direction: 30, color: '#10b981', description: 'Diagonal pull with horizontal and vertical components' },
];

export const FBDCanvas: React.FC = () => {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('rest-flat');
  const [activeForceIds, setActiveForceIds] = useState<string[]>(['weight']);
  const [isEvaluated, setIsEvaluated] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);

  const scenario = SCENARIOS.find((s) => s.id === selectedScenarioId) || SCENARIOS[0];

  const handleScenarioChange = (id: string) => {
    setSelectedScenarioId(id);
    setActiveForceIds(['weight']);
    setIsEvaluated(false);
  };

  const handleToggleForce = (forceId: string) => {
    setIsEvaluated(false);
    setActiveForceIds((prev) =>
      prev.includes(forceId) ? prev.filter((id) => id !== forceId) : [...prev, forceId]
    );
  };

  const handleCheckDiagram = () => {
    const correctSet = new Set(scenario.correctForces);
    const activeSet = new Set(activeForceIds);

    const matches =
      correctSet.size === activeSet.size &&
      [...correctSet].every((id) => activeSet.has(id));

    setIsCorrect(matches);
    setIsEvaluated(true);

    if (matches) {
      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.75 },
          colors: ['#06b6d4', '#10b981', '#6366f1'],
        });
      } catch {}
    }
  };

  const handleReset = () => {
    setActiveForceIds([]);
    setIsEvaluated(false);
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
              <Layers size={16} />
            </span>
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
              Interactive Free-Body Diagram (FBD) Builder
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Select and isolate the exact physical forces acting on the object
          </p>
        </div>

        {/* Scenario Selector */}
        <select
          value={selectedScenarioId}
          onChange={(e) => handleScenarioChange(e.target.value)}
          className="text-xs font-semibold bg-slate-900 border border-slate-700 text-cyan-300 rounded-lg px-3 py-2 outline-none focus:border-cyan-400 cursor-pointer"
        >
          {SCENARIOS.map((s) => (
            <option key={s.id} value={s.id}>
              {s.title}
            </option>
          ))}
        </select>
      </div>

      {/* Scenario Brief */}
      <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-400 mb-0.5">
            <HelpCircle size={13} />
            <span>Physical Situation:</span>
          </div>
          <p className="text-xs text-slate-200">{scenario.situation}</p>
        </div>
        <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-slate-900 text-slate-400 border border-slate-800 shrink-0">
          {scenario.contextNote}
        </span>
      </div>

      {/* FBD Canvas & Control Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
        {/* SVG FBD Canvas (7 cols on lg) */}
        <div className="lg:col-span-7 relative rounded-xl bg-slate-950 border border-slate-800 p-2 flex items-center justify-center min-h-[260px]">
          <svg viewBox="0 0 400 260" className="w-full max-w-[400px] h-auto select-none">
            <defs>
              <pattern id="fbdGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(148, 163, 184, 0.04)" strokeWidth="1" />
              </pattern>
            </defs>

            <rect width="400" height="260" fill="url(#fbdGrid)" />

            {/* Coordinate axes watermark */}
            <line x1="200" y1="20" x2="200" y2="240" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" opacity={0.3} />
            <line x1="20" y1="130" x2="380" y2="130" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" opacity={0.3} />

            {/* The Isolated Particle / Body at (200, 130) */}
            <g transform="translate(200, 130)">
              {/* Central Block representation */}
              <rect
                x="-25"
                y="-25"
                width="50"
                height="50"
                rx="6"
                fill="#1e293b"
                stroke="#64748b"
                strokeWidth="2"
              />
              <circle cx="0" cy="0" r="4" fill="#38bdf8" />
              <text x="0" y="4" fill="#94a3b8" fontSize="9" fontFamily="monospace" textAnchor="middle">
                m
              </text>

              {/* Render Selected Force Arrows */}
              {AVAILABLE_FORCES.map((force) => {
                const isActive = activeForceIds.includes(force.id);
                if (!isActive) return null;

                return (
                  <ForceArrow
                    key={force.id}
                    startX={0}
                    startY={0}
                    length={70}
                    angleDeg={force.direction}
                    color={force.color}
                    mathLaTeX={force.mathLaTeX}
                  />
                );
              })}
            </g>
          </svg>
        </div>

        {/* Force Selection Toggles (5 cols on lg) */}
        <div className="lg:col-span-5 space-y-2">
          <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Click to add / remove forces:
          </p>

          <div className="space-y-1.5">
            {AVAILABLE_FORCES.map((force) => {
              const isSelected = activeForceIds.includes(force.id);
              return (
                <button
                  key={force.id}
                  type="button"
                  onClick={() => handleToggleForce(force.id)}
                  style={{
                    borderColor: isSelected ? force.color : 'rgba(148, 163, 184, 0.15)',
                    backgroundColor: isSelected ? 'rgba(15, 23, 42, 0.9)' : 'rgba(15, 23, 42, 0.4)',
                  }}
                  className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between gap-2 transition-all hover:border-slate-600 ${
                    isSelected ? 'shadow-sm' : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      style={{ backgroundColor: force.color }}
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                        <span>{force.label}</span>
                        <span className="font-mono text-cyan-300 text-[11px]">
                          <Equation math={force.mathLaTeX} />
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400">{force.description}</p>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                      isSelected
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {isSelected ? 'ACTIVE' : 'OFF'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Validation Result Box */}
      {isEvaluated && (
        <div
          className={`mt-4 p-4 rounded-xl border animate-fadeIn ${
            isCorrect
              ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-100'
              : 'bg-rose-950/30 border-rose-500/40 text-rose-100'
          }`}
        >
          <div className="flex items-center gap-2 mb-1.5">
            {isCorrect ? (
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                <CheckCircle2 size={16} />
                <span>✓ Perfect Free-Body Diagram!</span>
              </span>
            ) : (
              <span className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1">
                <XCircle size={16} />
                <span>✕ Incomplete or Incorrect Diagram</span>
              </span>
            )}
          </div>
          <p className="text-xs text-slate-200 leading-relaxed mb-2">{scenario.explanation}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-800">
        <span className="text-xs text-slate-400">
          Active Forces on Diagram: <strong className="text-cyan-300 font-mono">{activeForceIds.length}</strong>
        </span>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 bg-slate-800 rounded-lg"
          >
            Clear All
          </button>
          <button
            type="button"
            onClick={handleCheckDiagram}
            className="px-4 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 rounded-lg shadow-md shadow-cyan-500/20 active:scale-95 transition-all"
          >
            Verify Diagram
          </button>
        </div>
      </div>
    </div>
  );
};
