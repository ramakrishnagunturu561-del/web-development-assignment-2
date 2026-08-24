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
import { NewtonSecondSim } from '../components/simulations/NewtonSecondSim';

interface NewtonSecondLawProps {
  onNextSection: () => void;
  onAnswerSubmitted?: (isCorrect: boolean) => void;
  savedAnswer?: { selectedOptionId: string; isCorrect: boolean };
}

const WORKED_EXAMPLE_N2: WorkedExampleData = {
  id: 'we-n2',
  problemStatement:
    'A horizontal pulling force of 45.0 N is applied to a 6.0 kg wooden crate across a flat floor. A constant kinetic friction force of 15.0 N opposes the crate’s motion. Calculate the resulting acceleration of the crate.',
  givenData: [
    { label: 'Mass', value: '6.0 kg', symbol: 'm' },
    { label: 'Applied Pull Force', value: '45.0 N (right)', symbol: 'F_{\\text{app}}' },
    { label: 'Kinetic Friction', value: '15.0 N (left)', symbol: 'f_k' },
  ],
  steps: [
    {
      stepNumber: 1,
      title: '1. Identify Known Values & Coordinate System',
      explanation:
        'Establish the coordinate axis: Let the positive x-axis (+x) point to the right in the direction of the applied force. Mass m = 6.0 kg.',
      mathLaTeX: 'm = 6.0\\text{ kg},\\quad F_{\\text{app}} = +45.0\\text{ N},\\quad f_k = -15.0\\text{ N}',
    },
    {
      stepNumber: 2,
      title: '2. Isolate Horizontal & Vertical Forces',
      explanation:
        'Vertically, Normal force balances Weight: N = mg = (6.0)(9.81) = 58.86 N, so vertical acceleration ay = 0. Horizontally, only F_app and f_k act.',
      mathLaTeX: '\\Sigma F_y = N - mg = 0',
    },
    {
      stepNumber: 3,
      title: '3. Calculate the Net Horizontal Resultant Force (ΣFx)',
      explanation:
        'Compute the algebraic sum of horizontal forces along the x-axis: Net force = Applied Force minus opposing Friction.',
      mathLaTeX: '\\Sigma F_x = F_{\\text{app}} - f_k = 45.0\\text{ N} - 15.0\\text{ N} = +30.0\\text{ N}',
      highlightText: 'Resultant force is 30.0 N pointing to the right.',
    },
    {
      stepNumber: 4,
      title: '4. Apply Newton’s Second Law: ΣF = ma',
      explanation:
        'Relate the resultant net horizontal force directly to mass and linear horizontal acceleration ax.',
      mathLaTeX: '\\Sigma F_x = m a_x \\implies a_x = \\frac{\\Sigma F_x}{m}',
    },
    {
      stepNumber: 5,
      title: '5. Calculate the Acceleration Value',
      explanation:
        'Substitute the computed net force (30.0 N) and mass (6.0 kg) into the acceleration formula.',
      mathLaTeX: 'a_x = \\frac{30.0\\text{ N}}{6.0\\text{ kg}} = 5.00\\text{ m/s}^2',
    },
    {
      stepNumber: 6,
      title: '6. State the Final Answer with Direction and Units',
      explanation:
        'The crate accelerates horizontally to the right at 5.00 m/s².',
      mathLaTeX: 'a = 5.00\\text{ m/s}^2 \\text{ (to the right)}',
    },
  ],
  finalAnswer: {
    symbol: 'a',
    value: '5.00',
    unit: 'm/s² (to the right)',
    mathLaTeX: 'a = 5.00\\text{ m/s}^2',
  },
};

export const NewtonSecondLaw: React.FC<NewtonSecondLawProps> = ({
  onNextSection,
  onAnswerSubmitted,
  savedAnswer,
}) => {
  const quiz = SECTION_QUIZZES['newton-second-law'];

  const takeaways = [
    { id: 't1', text: 'Acceleration is directly proportional to net force', mathFormula: 'a \\propto \\Sigma F' },
    { id: 't2', text: 'Acceleration is inversely proportional to mass', mathFormula: 'a \\propto \\frac{1}{m}' },
    { id: 't3', text: 'Net force and acceleration always point in the exact same direction', mathFormula: '\\vec{a} \\parallel \\Sigma\\vec{F}' },
    { id: 't4', text: '1 Newton is the force giving 1 kg an acceleration of 1 m/s²', mathFormula: '1\\text{ N} = 1\\text{ kg}\\cdot\\text{m/s}^2' },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
          <span>Topic 2 of 9</span>
          <span>•</span>
          <span>IB DP Physics A.2.2</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
          Newton's Second Law of Motion: The Law of Dynamics
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Quantitative relationship between resultant force, inertial mass, and linear acceleration.
        </p>
      </div>

      {/* 1. Concept Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <ConceptCard title="Resultant Force & Acceleration" variant="cyan">
            <p>
              Newton's Second Law states: <em>"The rate of change of momentum of a body is directly proportional to the resultant external force acting on it, and occurs in the direction of that force."</em>
            </p>
            <p className="mt-2 text-slate-300">
              For a system of constant mass <Equation math="m" />, this fundamental law takes the familiar form <Equation math="\Sigma\vec{F} = m\vec{a}" />. Acceleration is directly proportional to the vector sum of all forces (<Equation math="\Sigma F" />) and inversely proportional to inertial mass (<Equation math="m" />).
            </p>
          </ConceptCard>
        </div>

        <div>
          <FormulaCard
            title="Newton's 2nd Law"
            mathLaTeX="\Sigma\vec{F} = m\vec{a} = \frac{\Delta\vec{p}}{\Delta t}"
            description="Net force equals mass times acceleration, or rate of change of momentum."
            variables={[
              { symbol: '\\Sigma F', name: 'Resultant Net Force', unit: 'N' },
              { symbol: 'm', name: 'Inertial Mass', unit: 'kg' },
              { symbol: 'a', name: 'Acceleration', unit: 'm/s²' },
              { symbol: 'p', name: 'Linear Momentum', unit: 'kg·m/s' },
            ]}
          />
        </div>
      </div>

      {/* 2. Interactive Simulation */}
      <div>
        <NewtonSecondSim />
      </div>

      {/* 3. Common Misconception Callout */}
      <MisconceptionCard
        myth="Acceleration is always in the direction of the applied force or the direction the object is currently moving."
        reality="Acceleration is ALWAYS in the direction of the RESULTANT NET FORCE (ΣF), not necessarily the applied force or the velocity vector!"
        scientificExplanation="If a car is moving forward at 30 m/s and the driver hits the brakes, the net force points backwards (due to friction). The acceleration points backwards (a < 0) even though velocity is still forward!"
        whyItMatters="IB examiners frequently test braking objects and upward projectiles where velocity and acceleration point in opposite directions."
      />

      {/* 4. IB Exam Tip */}
      <ExamTip
        title="Always Calculate ΣF Before Applying F = ma"
        tip="Never plug a single individual force directly into F = ma unless that is the ONLY force acting! You must always write ΣFx = F1 + F2 + ... = ma_x."
        paperType="Paper 2 (Structured)"
        warning="Remember: Forces are vectors. If forces oppose each other, subtract their magnitudes."
      />

      {/* 5. Worked Example (6-Step Reveal) */}
      <WorkedExample data={WORKED_EXAMPLE_N2} />

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
        title="Momentum Formulation & Variable Mass Systems"
        subtitle="The rigorous calculus definition of Newton's 2nd Law (F = dp/dt)"
        ibLevel="HL"
        equations={[
          '\\vec{F}_{\\text{net}} = \\frac{d\\vec{p}}{dt} = \\frac{d(m\\vec{v})}{dt}',
          '\\vec{F}_{\\text{net}} = m\\frac{d\\vec{v}}{dt} + \\vec{v}\\frac{dm}{dt} = m\\vec{a} + \\vec{v}_{\\text{rel}}\\frac{dm}{dt}',
        ]}
      >
        <p>
          In the general formulation, Newton defined force as the time-derivative of linear momentum: <Equation math="\vec{F} = \frac{d\vec{p}}{dt}" />.
        </p>
        <p className="mt-2">
          When mass is constant (<Equation math="\frac{dm}{dt} = 0" />), this simplifies to <Equation math="\Sigma\vec{F} = m\vec{a}" />. However, in variable-mass systems (such as a rocket ejecting burned fuel or a conveyor belt loading gravel), the second term <Equation math="\vec{v}\frac{dm}{dt}" /> generates thrust or drag!
        </p>
      </DeepDive>
    </div>
  );
};
