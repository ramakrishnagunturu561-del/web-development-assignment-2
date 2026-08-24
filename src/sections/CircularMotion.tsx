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
import { CircularMotionSimulation } from '../components/simulations/CircularMotionSimulation';

interface CircularMotionProps {
  onNextSection: () => void;
  onAnswerSubmitted?: (isCorrect: boolean) => void;
  savedAnswer?: { selectedOptionId: string; isCorrect: boolean };
}

const WORKED_EXAMPLE_UCM: WorkedExampleData = {
  id: 'we-ucm',
  problemStatement:
    'A 1200 kg race car drives around a flat, unbanked horizontal circular turn of radius r = 80.0 m. The coefficient of static friction between tires and dry tarmac is μs = 0.75. (a) Calculate the maximum speed vmax the car can negotiate the turn without skidding outward. (b) Calculate the centripetal acceleration at this maximum speed. (Use g = 9.81 m/s²)',
  givenData: [
    { label: 'Car Mass', value: '1200 kg', symbol: 'm' },
    { label: 'Turn Radius', value: '80.0 m', symbol: 'r' },
    { label: 'Static Friction Coeff', value: '0.75', symbol: '\\mu_s' },
    { label: 'Gravity', value: '9.81 m/s²', symbol: 'g' },
  ],
  steps: [
    {
      stepNumber: 1,
      title: '1. Identify the Source of the Centripetal Force',
      explanation:
        'On an unbanked flat road, the only horizontal force directed toward the center of the turn is the lateral STATIC friction force fs from the road on the tires.',
      mathLaTeX: 'F_c = f_s \\le f_{s,\\text{max}} = \\mu_s N',
    },
    {
      stepNumber: 2,
      title: '2. Determine Normal Force (N) and Max Static Friction',
      explanation:
        'Vertically, normal force equals gravitational weight: N = mg.',
      mathLaTeX: 'f_{s,\\text{max}} = \\mu_s mg = 0.75 \\times (1200)(9.81) = 8829\\text{ N}',
    },
    {
      stepNumber: 3,
      title: '3. Equate Centripetal Force to Maximum Static Friction',
      explanation:
        'Set Fc = m*v^2 / r equal to μs*m*g. Notice that car mass m cancels out completely!',
      mathLaTeX: '\\frac{m v_{\\text{max}}^2}{r} = \\mu_s m g \\implies v_{\\text{max}}^2 = \\mu_s g r',
      highlightText: 'Maximum safe speed is independent of car mass! (v_max = √(μs * g * r))',
    },
    {
      stepNumber: 4,
      title: '4. Calculate the Maximum Speed (vmax)',
      explanation:
        'Take the square root of (μs * g * r).',
      mathLaTeX: 'v_{\\text{max}} = \\sqrt{0.75 \\times 9.81\\text{ m/s}^2 \\times 80.0\\text{ m}} = \\sqrt{588.6} = 24.26\\text{ m/s}',
    },
    {
      stepNumber: 5,
      title: '5. Calculate Maximum Centripetal Acceleration (ac)',
      explanation:
        'Compute ac = v^2 / r = μs * g.',
      mathLaTeX: 'a_c = \\mu_s g = 0.75 \\times 9.81\\text{ m/s}^2 = 7.36\\text{ m/s}^2',
    },
  ],
  finalAnswer: {
    symbol: 'v_{\\text{max}} \\text{ and } a_c',
    value: 'v_max = 24.3 m/s (87.3 km/h), ac = 7.36 m/s²',
    unit: '',
    mathLaTeX: 'v_{\\text{max}} = 24.3\\text{ m/s},\\quad a_c = 7.36\\text{ m/s}^2',
  },
};

export const CircularMotion: React.FC<CircularMotionProps> = ({
  onNextSection,
  onAnswerSubmitted,
  savedAnswer,
}) => {
  const quiz = SECTION_QUIZZES['uniform-circular-motion'];

  const takeaways = [
    { id: 't1', text: 'Centripetal acceleration points towards circle center', mathFormula: 'a_c = \\frac{v^2}{r} = \\omega^2 r' },
    { id: 't2', text: 'Centripetal force is NOT a new physical force, but a label for net radial force', mathFormula: 'F_c = \\frac{mv^2}{r}' },
    { id: 't3', text: 'Velocity vector is always tangent to the circle', mathFormula: '\\vec{v} \\perp \\vec{F}_c' },
    { id: 't4', text: 'Speed is constant, but acceleration is non-zero due to direction change' },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
          <span>Topic 8 of 9</span>
          <span>•</span>
          <span>IB DP Physics A.2.8</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
          Uniform Circular Motion (UCM) & Centripetal Dynamics
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Tangential velocity, radial acceleration, and center-directed resultant forces.
        </p>
      </div>

      {/* 1. Concept Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <ConceptCard title="Why Circular Motion Requires Continuous Force" variant="cyan">
            <p>
              An object undergoing <strong>Uniform Circular Motion (UCM)</strong> travels along a circular path at a constant speed <Equation math="v" />. Even though its speed is constant, its <em>direction</em> of motion changes continuously at every millisecond!
            </p>
            <p className="mt-2 text-slate-300">
              Because velocity is a vector (<Equation math="\vec{v}" />), changing direction constitutes a continuous acceleration: the <strong>centripetal acceleration</strong> <Equation math="a_c = \frac{v^2}{r}" />, pointing directly toward the center of curvature. By Newton’s 2nd Law, this requires a continuous net center-directed force: <Equation math="F_c = \frac{mv^2}{r}" />.
            </p>
          </ConceptCard>
        </div>

        <div>
          <FormulaCard
            title="Centripetal Formulas"
            mathLaTeX="a_c = \frac{v^2}{r} = \omega^2 r,\quad F_c = \frac{mv^2}{r} = m\omega^2 r"
            description="Radial inward acceleration and resultant force required for circular orbit."
            variables={[
              { symbol: 'a_c', name: 'Centripetal Acceleration', unit: 'm/s²' },
              { symbol: 'F_c', name: 'Centripetal Force', unit: 'N' },
              { symbol: 'v', name: 'Tangential Speed', unit: 'm/s' },
              { symbol: 'r', name: 'Radius of Curvature', unit: 'm' },
            ]}
          />
        </div>
      </div>

      {/* 2. Interactive Simulation */}
      <div>
        <CircularMotionSimulation />
      </div>

      {/* 3. Common Misconception Callout */}
      <MisconceptionCard
        myth="There is an outward 'centrifugal force' throwing objects away from the center of a circle. When a string snaps, the ball flies straight outwards."
        reality="Centrifugal force is a FICTITIOUS effect felt only in a rotating non-inertial frame. In reality, there is only an INWARD centripetal force! When the string snaps, the object flies off along the straight-line TANGENT (Newton's 1st Law), NOT radially outward!"
        scientificExplanation="Try the 'Cut Tether String!' button in the simulation above: the particle instantly transitions into a straight line in the direction of its tangential velocity at that exact moment."
        whyItMatters="IB Paper 1 questions repeatedly show a bird's-eye view of a ball on a string being cut and ask for the trajectory. The answer is ALWAYS the tangent line, never a radial outward line."
      />

      {/* 4. IB Exam Tip */}
      <ExamTip
        title="Centripetal Force is a Role, Not an Entity"
        tip="Never draw 'Fc' as an additional force on an FBD! Instead, identify the REAL physical force supplying the centripetal role: Tension (string), Gravity (satellite orbit), Friction (car turning), or Normal force (banked track)."
        paperType="General IB Tip"
        warning="Always write ΣF_radial = (Real Forces Inward - Real Forces Outward) = mv²/r."
      />

      {/* 5. Worked Example (Progressive Reveal) */}
      <WorkedExample data={WORKED_EXAMPLE_UCM} />

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
        title="Banked Curves & Frictionless Cornering"
        subtitle="How highway and velodrome banking eliminates reliance on tire friction"
        ibLevel="HL"
        equations={[
          'N\\sin\\theta = \\frac{mv^2}{r} \\quad\\text{(Horizontal centripetal support)}',
          'N\\cos\\theta = mg \\quad\\text{(Vertical weight support)}',
          '\\tan\\theta = \\frac{v^2}{rg} \\implies \\theta = \\arctan\\left(\\frac{v^2}{rg}\\right)',
        ]}
      >
        <p>
          On a frictionless road banked at angle <Equation math="\theta" />, the horizontal component of the normal force <Equation math="N\sin\theta" /> provides the entire centripetal force required to negotiate the turn.
        </p>
        <p className="mt-2">
          Dividing the two equations gives the ideal banking angle: <Equation math="\tan\theta = \frac{v^2}{rg}" />. At this designed speed, a vehicle can corner safely even on sheet ice without slipping!
        </p>
      </DeepDive>
    </div>
  );
};
