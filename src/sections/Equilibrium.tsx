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
import { EquilibriumCanvas } from '../components/simulations/EquilibriumCanvas';

interface EquilibriumProps {
  onNextSection: () => void;
  onAnswerSubmitted?: (isCorrect: boolean) => void;
  savedAnswer?: { selectedOptionId: string; isCorrect: boolean };
}

const WORKED_EXAMPLE_EQ: WorkedExampleData = {
  id: 'we-eq',
  problemStatement:
    'A traffic light of mass 15.0 kg hangs suspended in translational equilibrium by two cables connected to horizontal support poles. Cable 1 makes an angle of 30.0° to the horizontal ceiling on the left, and Cable 2 makes an angle of 60.0° to the ceiling on the right. Calculate the tensions T1 and T2 in both cables. (Take g = 9.81 m/s²)',
  givenData: [
    { label: 'Mass', value: '15.0 kg', symbol: 'm' },
    { label: 'Weight (W = mg)', value: '147.15 N', symbol: 'W' },
    { label: 'Cable 1 Angle', value: '30.0° to ceiling', symbol: '\\theta_1' },
    { label: 'Cable 2 Angle', value: '60.0° to ceiling', symbol: '\\theta_2' },
  ],
  steps: [
    {
      stepNumber: 1,
      title: '1. Set up the Horizontal Equilibrium Equation (ΣFx = 0)',
      explanation:
        'Resolving horizontally: Cable 1 pulls left with T1*cos(30°), Cable 2 pulls right with T2*cos(60°).',
      mathLaTeX: '\\Sigma F_x = T_2\\cos(60.0^\\circ) - T_1\\cos(30.0^\\circ) = 0 \\implies T_2 (0.500) = T_1 (0.866)',
      highlightText: 'This gives the relationship: T2 = 1.732 T1.',
    },
    {
      stepNumber: 2,
      title: '2. Set up the Vertical Equilibrium Equation (ΣFy = 0)',
      explanation:
        'Resolving vertically: The upward components of both cables balance the downward weight W = mg = 147.15 N.',
      mathLaTeX: '\\Sigma F_y = T_1\\sin(30.0^\\circ) + T_2\\sin(60.0^\\circ) - 147.15\\text{ N} = 0',
    },
    {
      stepNumber: 3,
      title: '3. Substitute T2 into the Vertical Equation',
      explanation:
        'Replace T2 with 1.732 T1: T1(0.500) + (1.732 T1)(0.866) = 147.15.',
      mathLaTeX: '0.500 T_1 + 1.500 T_1 = 147.15\\text{ N} \\implies 2.000 T_1 = 147.15\\text{ N}',
    },
    {
      stepNumber: 4,
      title: '4. Solve for Tension T1',
      explanation:
        'Divide total weight by 2.000.',
      mathLaTeX: 'T_1 = \\frac{147.15\\text{ N}}{2.000} = 73.58\\text{ N}',
    },
    {
      stepNumber: 5,
      title: '5. Solve for Tension T2',
      explanation:
        'Use the substitution relationship T2 = 1.732 * T1.',
      mathLaTeX: 'T_2 = 1.732 \\times 73.58\\text{ N} = 127.4\\text{ N}',
    },
  ],
  finalAnswer: {
    symbol: 'T_1 \\text{ and } T_2',
    value: 'T1 = 73.6 N, T2 = 127.4 N',
    unit: '',
    mathLaTeX: 'T_1 = 73.6\\text{ N},\\quad T_2 = 127.4\\text{ N}',
  },
};

export const Equilibrium: React.FC<EquilibriumProps> = ({
  onNextSection,
  onAnswerSubmitted,
  savedAnswer,
}) => {
  const quiz = SECTION_QUIZZES['translational-equilibrium'];

  const takeaways = [
    { id: 't1', text: 'Translational equilibrium requires zero resultant force', mathFormula: '\\Sigma\\vec{F} = 0' },
    { id: 't2', text: 'Component condition: ΣFx = 0 AND ΣFy = 0 simultaneously', mathFormula: '\\Sigma F_x = 0,\\; \\Sigma F_y = 0' },
    { id: 't3', text: 'Three equilibrium forces must form a closed vector triangle', mathFormula: '\\vec{F}_1 + \\vec{F}_2 + \\vec{F}_3 = 0' },
    { id: 't4', text: 'Steeper cables support greater fractions of suspended weight' },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
          <span>Topic 6 of 9</span>
          <span>•</span>
          <span>IB DP Physics A.2.6</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
          Translational Equilibrium in 2D
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Simultaneous vector resolution, closed force polygons, and tension balance systems.
        </p>
      </div>

      {/* 1. Concept Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <ConceptCard title="Coplanar Vector Balance" variant="cyan">
            <p>
              A point particle or rigid body is in <strong>translational equilibrium</strong> when the vector sum of all external forces acting upon it is identically zero: <Equation math="\Sigma\vec{F} = 0" />.
            </p>
            <p className="mt-2 text-slate-300">
              In a two-dimensional Cartesian plane, this vector condition splits into two independent scalar equations: <Equation math="\Sigma F_x = 0" /> and <Equation math="\Sigma F_y = 0" />. Geometrically, if you place the force vectors head-to-tail, they form a <strong>closed polygon</strong> (e.g. a closed triangle for 3 forces).
            </p>
          </ConceptCard>
        </div>

        <div>
          <FormulaCard
            title="Equilibrium Conditions"
            mathLaTeX="\Sigma F_x = 0,\quad \Sigma F_y = 0"
            description="The algebraic sum of orthogonal components must vanish along every axis."
            variables={[
              { symbol: '\\Sigma F_x', name: 'Horizontal Resultant', unit: '0 N' },
              { symbol: '\\Sigma F_y', name: 'Vertical Resultant', unit: '0 N' },
            ]}
          />
        </div>
      </div>

      {/* 2. Interactive Simulation */}
      <div>
        <EquilibriumCanvas />
      </div>

      {/* 3. Common Misconception Callout */}
      <MisconceptionCard
        myth="If a cable is pulled tighter and becomes nearly horizontal, the tension in the cable decreases because it does not carry much weight."
        reality="As a support cable approaches horizontal (θ → 0°), the required tension approaches INFINITY! It is physically impossible to pull any real cable into a perfectly horizontal line."
        scientificExplanation="To balance vertical weight W, the cable must supply an upward component 2T sin(θ) = W ⇒ T = W / (2 sin θ). As θ → 0°, sin(θ) → 0, so T → ∞!"
        whyItMatters="IB examiners frequently test why tightropes and power lines always sag under their own weight: without sag (θ > 0°), tension would exceed the breaking strength of any cable."
      />

      {/* 4. IB Exam Tip */}
      <ExamTip
        title="Using Lami's Theorem for 3-Force Equilibrium"
        tip="For three coplanar concurrent forces in equilibrium, you can use Lami's Theorem (Law of Sines for forces): F1/sin(α) = F2/sin(β) = F3/sin(γ), where α, β, γ are the angles opposite the respective forces."
        paperType="Paper 2 (Structured)"
        warning="Always verify that the angles are measured between the other two force vectors."
      />

      {/* 5. Worked Example (Progressive Reveal) */}
      <WorkedExample data={WORKED_EXAMPLE_EQ} />

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
        title="Rotational vs Translational Equilibrium"
        subtitle="Complete static equilibrium conditions for extended rigid bodies (Torque balance)"
        ibLevel="HL"
        equations={[
          '\\Sigma\\vec{F} = 0 \\quad\\text{(Zero Linear Acceleration: } \\vec{a} = 0\\text{)}',
          '\\Sigma\\vec{\\tau} = \\Sigma (\\vec{r} \\times \\vec{F}) = 0 \\quad\\text{(Zero Angular Acceleration: } \\vec{\\alpha} = 0\\text{)}',
        ]}
      >
        <p>
          For an extended object (such as a ladder leaning against a wall or a crane boom), translational equilibrium alone (<Equation math="\Sigma\vec{F} = 0" />) is insufficient to prevent rotation!
        </p>
        <p className="mt-2">
          Complete static equilibrium requires both translational equilibrium (<Equation math="\Sigma\vec{F} = 0" />) AND rotational equilibrium (<Equation math="\Sigma\vec{\tau} = 0" /> about any arbitrary pivot point).
        </p>
      </DeepDive>
    </div>
  );
};
