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
import { FBDCanvas } from '../components/simulations/FBDCanvas';

interface FreeBodyDiagramsProps {
  onNextSection: () => void;
  onAnswerSubmitted?: (isCorrect: boolean) => void;
  savedAnswer?: { selectedOptionId: string; isCorrect: boolean };
}

const WORKED_EXAMPLE_FBD: WorkedExampleData = {
  id: 'we-fbd',
  problemStatement:
    'A child pulls a 12.0 kg toy wagon with a rope inclined at an angle of 35.0° above the horizontal with a tension of 50.0 N. The wagon accelerates along a horizontal concrete sidewalk against a rolling friction force of 8.0 N. (a) Draw and identify all four forces on the wagon. (b) Calculate the magnitude of the Normal contact force N exerted by the sidewalk on the wagon. (c) Calculate the horizontal acceleration of the wagon. (Take g = 9.81 m/s²)',
  givenData: [
    { label: 'Mass', value: '12.0 kg', symbol: 'm' },
    { label: 'Rope Tension', value: '50.0 N at 35.0°', symbol: 'T' },
    { label: 'Rolling Friction', value: '8.0 N', symbol: 'f' },
    { label: 'Gravity', value: '9.81 m/s²', symbol: 'g' },
  ],
  steps: [
    {
      stepNumber: 1,
      title: '1. Resolve Tension into Horizontal and Vertical Components',
      explanation:
        'The angled rope pulls both horizontally forward (+x) and vertically upward (+y).',
      mathLaTeX: 'T_x = T\\cos(35^\\circ) = 50.0\\cos(35.0^\\circ) = 40.96\\text{ N},\\quad T_y = T\\sin(35^\\circ) = 50.0\\sin(35.0^\\circ) = 28.68\\text{ N}',
    },
    {
      stepNumber: 2,
      title: '2. Identify all Vertical Forces & Apply ΣFy = 0',
      explanation:
        'The wagon does not lift off the ground, so vertical acceleration ay = 0. The three vertical forces are: Normal force N (up), Tension y-component Ty (up), and Weight W = mg (down).',
      mathLaTeX: '\\Sigma F_y = N + T_y - mg = 0 \\implies N = mg - T_y',
      highlightText: 'Notice the normal force is REDUCED because the rope carries part of the wagon’s weight!',
    },
    {
      stepNumber: 3,
      title: '3. Calculate the Normal Force (N)',
      explanation:
        'Calculate weight W = (12.0)(9.81) = 117.72 N, then subtract the upward tension component Ty.',
      mathLaTeX: 'N = 117.72\\text{ N} - 28.68\\text{ N} = 89.04\\text{ N}',
    },
    {
      stepNumber: 4,
      title: '4. Sum the Horizontal Forces (ΣFx)',
      explanation:
        'The forward force is Tx and the opposing friction force is f.',
      mathLaTeX: '\\Sigma F_x = T_x - f = 40.96\\text{ N} - 8.00\\text{ N} = +32.96\\text{ N}',
    },
    {
      stepNumber: 5,
      title: '5. Calculate Horizontal Acceleration (ax)',
      explanation:
        'Apply Newton’s 2nd Law ax = ΣFx / m.',
      mathLaTeX: 'a_x = \\frac{32.96\\text{ N}}{12.0\\text{ kg}} = 2.75\\text{ m/s}^2',
    },
  ],
  finalAnswer: {
    symbol: 'N \\text{ and } a_x',
    value: 'Normal Force N = 89.0 N, Acceleration a = 2.75 m/s²',
    unit: '',
    mathLaTeX: 'N = 89.0\\text{ N},\\quad a = 2.75\\text{ m/s}^2',
  },
};

export const FreeBodyDiagrams: React.FC<FreeBodyDiagramsProps> = ({
  onNextSection,
  onAnswerSubmitted,
  savedAnswer,
}) => {
  const quiz = SECTION_QUIZZES['free-body-diagrams'];

  const takeaways = [
    { id: 't1', text: 'An FBD isolates ONE body and represents all external forces acting ON it' },
    { id: 't2', text: 'Normal force is NOT always equal to mg', mathFormula: 'N = mg \\pm F_y' },
    { id: 't3', text: 'Never draw internal forces or forces exerted BY the body on other objects' },
    { id: 't4', text: 'Always resolve angled vectors into orthogonal x and y components' },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
          <span>Topic 4 of 9</span>
          <span>•</span>
          <span>IB DP Physics A.2.4</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
          Free-Body Diagrams (FBD)
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Isolating physical systems and modeling force vectors for mathematical analysis.
        </p>
      </div>

      {/* 1. Concept Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <ConceptCard title="The Art of System Isolation" variant="cyan">
            <p>
              A <strong>Free-Body Diagram (FBD)</strong> is a simplified schematic diagram showing a single isolated object (represented as a dot or simple box) and <em>only</em> the external vector forces acting directly upon it.
            </p>
            <p className="mt-2 text-slate-300">
              In IB Physics exams, every force vector in an FBD must be clearly drawn starting from the body, pointing in the correct physical direction, with arrow lengths roughly proportional to their magnitudes and clearly labeled (e.g. <Equation math="\vec{W}" />, <Equation math="\vec{N}" />, <Equation math="\vec{f}" />, <Equation math="\vec{T}" />).
            </p>
          </ConceptCard>
        </div>

        <div>
          <FormulaCard
            title="General Force Balance"
            mathLaTeX="\Sigma F_x = ma_x,\quad \Sigma F_y = ma_y"
            description="Resolve all forces into orthogonal Cartesian axes before applying Newton's laws."
            variables={[
              { symbol: 'N', name: 'Normal Force', unit: 'N' },
              { symbol: 'W', name: 'Weight (mg)', unit: 'N' },
              { symbol: 'T', name: 'Tension', unit: 'N' },
            ]}
          />
        </div>
      </div>

      {/* 2. Interactive Simulation (FBD Builder) */}
      <div>
        <FBDCanvas />
      </div>

      {/* 3. Common Misconception Callout */}
      <MisconceptionCard
        myth="The normal force N is always equal in magnitude to the weight mg."
        reality="The normal force N is a contact constraint force that adjusts to whatever value prevents the surfaces from penetrating! It is only equal to mg when resting on a horizontal surface with no vertical applied forces or accelerations."
        scientificExplanation="If you pull upward on an object with force F_lift, N = mg - F_lift (N < mg). In an upward accelerating elevator, N = m(g + a) (N > mg). On an incline of angle θ, N = mg cos(θ) (N < mg)!"
        whyItMatters="Assuming N = mg without setting up ΣFy = 0 is the #1 reason students lose marks on friction and incline exam problems."
      />

      {/* 4. IB Exam Tip */}
      <ExamTip
        title="IB Examiner Conventions for FBDs"
        tip="Do NOT include components (like mg sin θ or mg cos θ) on the initial FBD in Paper 2 unless explicitly asked! Draw only the pure fundamental forces (Weight, Normal, Friction, Tension) with arrows starting from the object."
        paperType="Paper 2 (Structured)"
        warning="Never draw 'ma' or 'resultant force' as an arrow on an FBD! 'ma' is the result of forces, not a force itself."
      />

      {/* 5. Worked Example (Progressive Reveal) */}
      <WorkedExample data={WORKED_EXAMPLE_FBD} />

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
        title="Inclined Plane Coordinate Rotation"
        subtitle="Why choosing axes parallel and perpendicular to the slope simplifies calculations"
        ibLevel="Both"
        equations={[
          'W_{\\parallel} = mg\\sin\\theta \\quad\\text{(Down slope)}',
          'W_{\\perp} = mg\\cos\\theta \\quad\\text{(Into slope)}',
          'N = mg\\cos\\theta',
        ]}
      >
        <p>
          When an object slides on an incline tilted at angle <Equation math="\theta" />, setting the x-axis parallel to the incline and the y-axis perpendicular simplifies the problem because acceleration along the perpendicular axis is zero (<Equation math="a_y = 0" />).
        </p>
        <p className="mt-2">
          Gravity <Equation math="\vec{W}" /> is the only force requiring decomposition: <Equation math="W_x = mg\sin\theta" /> drives the downhill motion while <Equation math="W_y = mg\cos\theta" /> presses the object into the slope, setting the normal force <Equation math="N = mg\cos\theta" />.
        </p>
      </DeepDive>
    </div>
  );
};
