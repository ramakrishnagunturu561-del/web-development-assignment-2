import React from 'react';
import type { WorkedExampleData } from '../types/learning';
import { SECTION_QUIZZES } from '../data/quizData';
import { ConceptCard } from '../components/pedagogy/ConceptCard';
import { MisconceptionCard } from '../components/pedagogy/MisconceptionCard';
import { ExamTip } from '../components/pedagogy/ExamTip';
import { KeyTakeaway } from '../components/pedagogy/KeyTakeaway';
import { DeepDive } from '../components/pedagogy/DeepDive';
import { WorkedExample } from '../components/pedagogy/WorkedExample';
import { Quiz } from '../components/pedagogy/Quiz';
import { FormulaCard } from '../components/math/FormulaCard';
import { Equation } from '../components/math/Equation';
import { FrictionSimulation } from '../components/simulations/FrictionSimulation';

interface FrictionProps {
  onNextSection: () => void;
  onAnswerSubmitted?: (isCorrect: boolean) => void;
  savedAnswer?: { selectedOptionId: string; isCorrect: boolean };
}

const WORKED_EXAMPLE_FRICTION: WorkedExampleData = {
  id: 'we-friction',
  problemStatement:
    'A 20.0 kg crate rests on a horizontal factory floor. The coefficient of static friction between crate and floor is μs = 0.45, and the coefficient of kinetic friction is μk = 0.30. (a) How much horizontal force is required to start moving the crate? (b) If a worker continues to push with this same threshold force once the crate is in motion, calculate the acceleration of the crate. (Use g = 9.81 m/s²)',
  givenData: [
    { label: 'Mass', value: '20.0 kg', symbol: 'm' },
    { label: 'Static Coeff', value: '0.45', symbol: '\\mu_s' },
    { label: 'Kinetic Coeff', value: '0.30', symbol: '\\mu_k' },
    { label: 'Gravity', value: '9.81 m/s²', symbol: 'g' },
  ],
  steps: [
    {
      stepNumber: 1,
      title: '1. Calculate the Normal Contact Force (N)',
      explanation:
        'On a level surface with no vertical applied forces, the normal force balances gravitational weight.',
      mathLaTeX: 'N = mg = 20.0\\text{ kg} \\times 9.81\\text{ m/s}^2 = 196.2\\text{ N}',
    },
    {
      stepNumber: 2,
      title: '2. Determine the Maximum Static Friction Threshold (fs,max)',
      explanation:
        'To start motion, the applied force must exceed the maximum static friction threshold fs,max = μs * N.',
      mathLaTeX: 'f_{s,\\text{max}} = \\mu_s N = 0.45 \\times 196.2\\text{ N} = 88.29\\text{ N}',
      highlightText: 'The required breakaway force to start motion is F_app > 88.3 N.',
    },
    {
      stepNumber: 3,
      title: '3. Calculate Kinetic Friction Once in Motion (fk)',
      explanation:
        'Once sliding begins, microscopic asperities shear and friction drops to the kinetic value fk = μk * N.',
      mathLaTeX: 'f_k = \\mu_k N = 0.30 \\times 196.2\\text{ N} = 58.86\\text{ N}',
    },
    {
      stepNumber: 4,
      title: '4. Calculate the Net Force During Accelerated Sliding',
      explanation:
        'With the worker pushing at F_app = 88.29 N and kinetic friction opposing at fk = 58.86 N, calculate net force.',
      mathLaTeX: '\\Sigma F = F_{\\text{app}} - f_k = 88.29\\text{ N} - 58.86\\text{ N} = +29.43\\text{ N}',
    },
    {
      stepNumber: 5,
      title: '5. Calculate the Resulting Acceleration',
      explanation:
        'Apply Newton’s 2nd Law a = ΣF / m.',
      mathLaTeX: 'a = \\frac{\\Sigma F}{m} = \\frac{29.43\\text{ N}}{20.0\\text{ kg}} = 1.47\\text{ m/s}^2',
    },
  ],
  finalAnswer: {
    symbol: 'F_{\\text{breakaway}} \\text{ and } a',
    value: 'Breakaway Force = 88.3 N, Sliding Acceleration = 1.47 m/s²',
    unit: '',
    mathLaTeX: 'F_{\\text{start}} = 88.3\\text{ N},\\quad a = 1.47\\text{ m/s}^2',
  },
};

export const Friction: React.FC<FrictionProps> = ({
  onNextSection,
  onAnswerSubmitted,
  savedAnswer,
}) => {
  const quiz = SECTION_QUIZZES['friction'];

  const takeaways = [
    { id: 't1', text: 'Static friction is self-adjusting up to a maximum', mathFormula: 'f_s \\le \\mu_s N' },
    { id: 't2', text: 'Kinetic friction is constant for sliding surfaces', mathFormula: 'f_k = \\mu_k N' },
    { id: 't3', text: 'Static coefficient is almost always larger than kinetic', mathFormula: '\\mu_s > \\mu_k' },
    { id: 't4', text: 'Friction always opposes RELATIVE motion between contact surfaces' },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
          <span>Topic 5 of 9</span>
          <span>•</span>
          <span>IB DP Physics A.2.5</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
          Static & Dynamic (Kinetic) Friction Mechanics
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Microscopic surface roughness, the static breakaway threshold, and dynamic sliding resistance.
        </p>
      </div>

      {/* 1. Concept Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <ConceptCard title="Microscopic Origins of Friction" variant="amber">
            <p>
              Friction arises from electrostatic attractions and mechanical interlocking between microscopic surface peaks (called <strong>asperities</strong>) on contact surfaces.
            </p>
            <p className="mt-2 text-slate-300">
              When stationary, asperities settle deep into each other, requiring a greater force to break free (<Equation math="f_{s,\text{max}} = \mu_s N" />). Once sliding begins, the peaks ride over one another, reducing the effective contact resistance to <Equation math="f_k = \mu_k N" />, where typically <Equation math="\mu_k < \mu_s" />.
            </p>
          </ConceptCard>
        </div>

        <div>
          <FormulaCard
            title="Laws of Friction"
            mathLaTeX="f_s \le \mu_s N,\quad f_k = \mu_k N"
            description="Static friction is an inequality; kinetic friction is a constant equality."
            variables={[
              { symbol: 'f_s', name: 'Static Friction Force', unit: 'N' },
              { symbol: 'f_k', name: 'Kinetic Friction Force', unit: 'N' },
              { symbol: '\\mu_s, \\mu_k', name: 'Friction Coefficients', unit: 'dimensionless' },
              { symbol: 'N', name: 'Normal Reaction Force', unit: 'N' },
            ]}
          />
        </div>
      </div>

      {/* 2. Interactive Simulation */}
      <div>
        <FrictionSimulation />
      </div>

      {/* 3. Common Misconception Callout */}
      <MisconceptionCard
        myth="Static friction is always equal to μs * N, and friction always opposes the direction an object is moving."
        reality="Static friction is an INEQUALITY (fs ≤ μs N) that exactly equals the applied force up to the threshold! Furthermore, static friction can ACCELERATE objects (e.g. friction between your shoes and the floor pushes you forward when walking!)."
        scientificExplanation="If you push a 100 kg box with only 5 N, static friction responds with exactly 5 N (not μs N = 490 N). If static friction were always μs N, a light tap would cause the box to shoot backwards!"
        whyItMatters="IB examiners often give a problem where F_app < μs N and ask for the friction force. The correct answer is F_app, NOT μs N!"
      />

      {/* 4. IB Exam Tip */}
      <ExamTip
        title="Check the Regime Before Calculating Acceleration"
        tip="Always calculate f_s,max = μs * N FIRST. If F_app ≤ f_s,max, the object does NOT move (a = 0, f = F_app). Only if F_app > f_s,max does the object slide, using fk = μk * N in ΣF = F_app - fk = ma."
        paperType="Paper 2 (Structured)"
        warning="Never use μs in F = ma calculations once an object is already sliding!"
      />

      {/* 5. Worked Example (Progressive Reveal) */}
      <WorkedExample data={WORKED_EXAMPLE_FRICTION} />

      {/* 6. Check Yourself Quiz */}
      <Quiz
        question={quiz}
        savedAnswer={savedAnswer}
        onAnswerSubmitted={onAnswerSubmitted}
        onNextSection={onNextSection}
      />

      {/* 7. Key Takeaway Badges */}
      <KeyTakeaway takeaways={takeaways} />

      {/* 8. Deep Dive (Expandable) */}
      <DeepDive
        title="Angle of Repose & Critical Sliding Angle"
        subtitle="How to experimentally measure μs using an adjustable inclined ramp"
        ibLevel="Both"
        equations={[
          '\\Sigma F_{\\parallel} = mg\\sin\\theta_c - f_{s,\\text{max}} = 0',
          '\\Sigma F_{\\perp} = N - mg\\cos\\theta_c = 0',
          'mg\\sin\\theta_c = \\mu_s (mg\\cos\\theta_c) \\implies \\mu_s = \\tan\\theta_c',
        ]}
      >
        <p>
          The <strong>angle of repose</strong> <Equation math="\theta_c" /> is the steepest angle at which a slope can be tilted before an object placed on it begins to slide down.
        </p>
        <p className="mt-2">
          At the threshold of sliding, <Equation math="mg\sin\theta_c = \mu_s mg\cos\theta_c" />. Dividing both sides by <Equation math="mg\cos\theta_c" /> reveals the elegant relationship: <Equation math="\mu_s = \tan\theta_c" />. Notice this critical angle is independent of mass!
        </p>
      </DeepDive>
    </div>
  );
};
