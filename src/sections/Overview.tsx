import React from 'react';
import type { SectionId } from '../types/learning';
import { FormulaCard } from '../components/math/FormulaCard';
import {
  Sparkles,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Rocket,
  Layers,
  Scale,
  Activity,
  Zap,
  Target,
} from 'lucide-react';

interface OverviewProps {
  onStartLearning: () => void;
  onNavigateSection: (id: SectionId) => void;
  completedCount: number;
}

export const Overview: React.FC<OverviewProps> = ({
  onStartLearning,
  onNavigateSection,
  completedCount,
}) => {
  const learningObjectives = [
    {
      id: 'lo1',
      title: "Newton's 3 Fundamental Laws",
      desc: 'Master translational inertia, F=ma dynamics, and interaction pairs on distinct bodies.',
      icon: <Activity size={16} className="text-cyan-400" />,
      sectionId: 'newton-first-law' as SectionId,
    },
    {
      id: 'lo2',
      title: 'Free-Body Vector Modeling',
      desc: 'Isolate systems and construct precise FBDs with weight, normal, tension, and friction vectors.',
      icon: <Layers size={16} className="text-blue-400" />,
      sectionId: 'free-body-diagrams' as SectionId,
    },
    {
      id: 'lo3',
      title: 'Static & Kinetic Friction Laws',
      desc: 'Quantify breakaway thresholds with f_s ≤ μ_s N and dynamic sliding with f_k = μ_k N.',
      icon: <Zap size={16} className="text-amber-400" />,
      sectionId: 'friction' as SectionId,
    },
    {
      id: 'lo4',
      title: '2D Translational Equilibrium',
      desc: 'Resolve coplanar force vectors along orthogonal axes to enforce ΣFx = 0 and ΣFy = 0.',
      icon: <Scale size={16} className="text-emerald-400" />,
      sectionId: 'translational-equilibrium' as SectionId,
    },
    {
      id: 'lo5',
      title: 'Coupled Systems & Atwood Machine',
      desc: 'Solve simultaneous equations of motion for connected masses and internal string tension.',
      icon: <Rocket size={16} className="text-purple-400" />,
      sectionId: 'atwood-machine' as SectionId,
    },
    {
      id: 'lo6',
      title: 'Uniform Circular Motion Dynamics',
      desc: 'Analyze radial inward centripetal forces Fc = mv²/r and tangential velocity vectors.',
      icon: <Target size={16} className="text-rose-400" />,
      sectionId: 'uniform-circular-motion' as SectionId,
    },
  ];

  const realWorldApplications = [
    { title: 'Spacecraft Trajectories', desc: 'Inertial drifting and orbital maneuvers governed by zero net force & centripetal gravity.' },
    { title: 'Automotive Anti-lock Brakes (ABS)', desc: 'Maximizing stopping power by keeping tires in the higher static friction regime (μs > μk).' },
    { title: 'Bridge & Crane Cable Engineering', desc: 'Calculating tension equilibrium to prevent structural failure in suspension networks.' },
    { title: 'Elevator Safety Braking', desc: 'Counterweight Atwood systems balancing passenger cabins and emergency deceleration.' },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Banner Card */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(30, 41, 59, 0.7) 50%, rgba(15, 23, 42, 0.95) 100%)',
          border: '1px solid rgba(6, 182, 212, 0.4)',
          borderRadius: '24px',
          boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.5), 0 0 30px rgba(6, 182, 212, 0.15)',
        }}
        className="p-6 md:p-10 relative overflow-hidden"
      >
        <div className="max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center gap-1.5">
              <Sparkles size={13} />
              <span>IB Diploma Physics — Topic A.2</span>
            </span>
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-slate-900/80 text-slate-300 border border-slate-700">
              K.A. Tsokos 7th Edition
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight font-display">
            Forces & Newton's Laws
          </h1>

          <p className="text-base sm:text-lg text-slate-300 font-medium leading-relaxed">
            Understand how forces create, change, and balance motion through interactive mathematical simulations, progressive worked solutions, and visual vector modeling.
          </p>

          <div className="pt-4 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={onStartLearning}
              className="px-6 py-3.5 text-sm font-bold text-slate-950 bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 rounded-xl shadow-lg shadow-cyan-500/25 flex items-center gap-2 active:scale-95 transition-all"
            >
              <span>Start Learning Journey</span>
              <ArrowRight size={18} />
            </button>

            <div className="flex items-center gap-2 text-xs font-mono text-slate-300 bg-slate-900/80 px-4 py-3 rounded-xl border border-slate-800">
              <CheckCircle2 size={16} className="text-emerald-400" />
              <span>{completedCount} / 10 Sections Mastered</span>
            </div>
          </div>
        </div>
      </div>

      {/* Learning Objectives Grid */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <span className="p-1.5 rounded-lg bg-cyan-500/15 text-cyan-400">
            <BookOpen size={18} />
          </span>
          <h2 className="text-xl font-bold text-slate-100 font-display">
            What You Will Master in This Chapter
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {learningObjectives.map((obj) => (
            <div
              key={obj.id}
              onClick={() => onNavigateSection(obj.sectionId)}
              style={{
                background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.5) 100%)',
                border: '1px solid rgba(148, 163, 184, 0.15)',
              }}
              className="p-5 rounded-2xl cursor-pointer transition-all hover:border-cyan-500/50 hover:translate-y-[-2px] group"
            >
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                  {obj.icon}
                </div>
                <ArrowRight size={14} className="text-slate-600 group-hover:text-cyan-400 transition-colors" />
              </div>
              <h3 className="text-sm font-bold text-slate-100 mb-1 group-hover:text-cyan-300 transition-colors">
                {obj.title}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {obj.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Essential Chapter Formulas Preview */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <span className="p-1.5 rounded-lg bg-cyan-500/15 text-cyan-400">
            <Sparkles size={18} />
          </span>
          <h2 className="text-xl font-bold text-slate-100 font-display">
            Key Equations Reference (IB Physics Formula Booklet)
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <FormulaCard
            title="Newton's 2nd Law"
            mathLaTeX="\Sigma\vec{F} = m\vec{a}"
            description="Resultant net force equals mass multiplied by linear acceleration vector."
            variables={[
              { symbol: '\\Sigma F', name: 'Net Resultant Force', unit: 'N' },
              { symbol: 'm', name: 'Inertial Mass', unit: 'kg' },
              { symbol: 'a', name: 'Acceleration', unit: 'm/s²' },
            ]}
          />

          <FormulaCard
            title="Static & Kinetic Friction"
            mathLaTeX="f_s \le \mu_s N \quad\text{and}\quad f_k = \mu_k N"
            description="Static friction prevents motion up to a threshold; kinetic friction resists sliding."
            variables={[
              { symbol: 'f_s, f_k', name: 'Friction Force', unit: 'N' },
              { symbol: '\\mu', name: 'Coefficient of Friction', unit: 'dimensionless' },
              { symbol: 'N', name: 'Normal Reaction Force', unit: 'N' },
            ]}
          />

          <FormulaCard
            title="Centripetal Dynamics"
            mathLaTeX="F_c = \frac{mv^2}{r} = m\omega^2 r"
            description="Resultant force directed toward circle center sustaining circular orbit."
            variables={[
              { symbol: 'F_c', name: 'Centripetal Force', unit: 'N' },
              { symbol: 'v', name: 'Linear Tangential Velocity', unit: 'm/s' },
              { symbol: 'r', name: 'Orbital Radius', unit: 'm' },
            ]}
          />
        </div>
      </div>

      {/* Real-World Engineering Applications */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
        <h3 className="text-base font-bold text-slate-100 mb-3 flex items-center gap-2">
          <Rocket size={18} className="text-cyan-400" />
          <span>Real-World Physical Applications</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {realWorldApplications.map((app, i) => (
            <div key={i} className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
              <h4 className="text-xs font-bold text-cyan-300 mb-1">{app.title}</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">{app.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
