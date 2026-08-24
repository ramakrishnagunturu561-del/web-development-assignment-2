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
import { AtwoodSimulation } from '../components/simulations/AtwoodSimulation';

interface AtwoodMachineProps {
  onNextSection: () => void;
  onAnswerSubmitted?: (isCorrect: boolean) => void;
  savedAnswer?: { selectedOptionId: string; isCorrect: boolean };
}

const WORKED_EXAMPLE_ATWOOD: WorkedExampleData = {
  id: 'we-atwood',
  problemStatement:
    'An Atwood machine consists of two hanging blocks of masses m1 = 2.0 kg and m2 = 6.0 kg connected by a light, inextensible string passing over a frictionless, massless pulley. (a) Draw separate FBDs for m1 and m2. (b) Write Newton’s 2nd Law equations for each mass. (c) Solve the coupled system simultaneously to find acceleration a. (d) Determine the tension T in the string. (Take g = 9.81 m/s²)',
  givenData: [
    { label: 'Mass 1 (left)', value: '2.0 kg', symbol: 'm_1' },
    { label: 'Mass 2 (right)', value: '6.0 kg', symbol: 'm_2' },
    { label: 'Gravity', value: '9.81 m/s²', symbol: 'g' },
  ],
  steps: [
    {
      stepNumber: 1,
      title: '1. Draw FBD for Mass 1 (m1 accelerating upward)',
      explanation:
        'Two vertical forces act on m1: Upward tension T from the string and downward weight W1 = m1*g. Since m2 > m1, m1 accelerates UPWARDS (+y).',
      mathLaTeX: '\\Sigma F_1 = T - m_1 g = m_1 a \\quad\\text{--- (Equation 1)}',
    },
    {
      stepNumber: 2,
      title: '2. Draw FBD for Mass 2 (m2 accelerating downward)',
      explanation:
        'Two vertical forces act on m2: Downward weight W2 = m2*g and upward tension T from the string. Taking downward as positive for m2:',
      mathLaTeX: '\\Sigma F_2 = m_2 g - T = m_2 a \\quad\\text{--- (Equation 2)}',
    },
    {
      stepNumber: 3,
      title: '3. Add the Two Simultaneous Equations to Eliminate Tension T',
      explanation:
        'Add Equation 1 and Equation 2 directly. Notice that +T and -T cancel out!',
      mathLaTeX: '(T - m_1 g) + (m_2 g - T) = m_1 a + m_2 a \\implies (m_2 - m_1) g = (m_1 + m_2) a',
      highlightText: 'The net driving force is (m2 - m1)g acting on the total system mass (m1 + m2).',
    },
    {
      stepNumber: 4,
      title: '4. Solve for Acceleration (a)',
      explanation:
        'Divide the difference in weights by the total system mass.',
      mathLaTeX: 'a = \\frac{m_2 - m_1}{m_1 + m_2} g = \\frac{6.0 - 2.0}{2.0 + 6.0} (9.81) = \\frac{4.0}{8.0} (9.81) = 0.50 \\times 9.81 = 4.905\\text{ m/s}^2',
    },
    {
      stepNumber: 5,
      title: '5. Solve for String Tension (T)',
      explanation:
        'Substitute acceleration a back into Equation 1: T = m1(g + a).',
      mathLaTeX: 'T = m_1(g + a) = 2.0 \\times (9.81 + 4.905) = 2.0 \\times 14.715 = 29.43\\text{ N}',
    },
    {
      stepNumber: 6,
      title: '6. Check via the Double-Mass Tension Formula',
      explanation:
        'Verify with the analytical formula: T = 2 m1 m2 g / (m1 + m2) = 2(2)(6)(9.81) / 8 = 235.44 / 8 = 29.43 N.',
      mathLaTeX: 'T = \\frac{2 m_1 m_2 g}{m_1 + m_2} = 29.43\\text{ N}',
    },
  ],
  finalAnswer: {
    symbol: 'a \\text{ and } T',
    value: 'Acceleration a = 4.91 m/s², Tension T = 29.4 N',
    unit: '',
    mathLaTeX: 'a = 4.91\\text{ m/s}^2,\\quad T = 29.4\\text{ N}',
  },
};

export const AtwoodMachine: React.FC<AtwoodMachineProps> = ({
  onNextSection,
  onAnswerSubmitted,
  savedAnswer,
}) => {
  const quiz = SECTION_QUIZZES['atwood-machine'];

  const takeaways = [
    { id: 't1', text: 'Acceleration formula for ideal Atwood machine', mathFormula: 'a = \\frac{|m_2 - m_1|}{m_1 + m_2} g' },
    { id: 't2', text: 'String tension formula for ideal Atwood machine', mathFormula: 'T = \\frac{2 m_1 m_2}{m_1 + m_2} g' },
    { id: 't3', text: 'Tension is strictly between the two weights', mathFormula: 'W_{\\text{min}} < T < W_{\\text{max}}' },
    { id: 't4', text: 'For equal masses (m1 = m2), a = 0 and T = mg (Static equilibrium)' },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
          <span>Topic 7 of 9</span>
          <span>•</span>
          <span>IB DP Physics A.2.7</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
          The Atwood Machine & Connected Mass Dynamics
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Coupled systems, internal string tension, and solving simultaneous equations of motion.
        </p>
      </div>

      {/* 1. Concept Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <ConceptCard title="Coupled Dynamics over a Pulley" variant="cyan">
            <p>
              Invented in 1784 by George Atwood, the <strong>Atwood machine</strong> is the classic laboratory apparatus used to verify Newton's Second Law with low, easily measurable accelerations.
            </p>
            <p className="mt-2 text-slate-300">
              Because the string is <em>inextensible</em> (does not stretch), both masses move with identical speed and magnitude of acceleration <Equation math="a" />. Because the pulley and string are <em>ideal</em> (massless and frictionless), tension <Equation math="T" /> is uniform throughout the entire string.
            </p>
          </ConceptCard>
        </div>

        <div>
          <FormulaCard
            title="Atwood Equations"
            mathLaTeX="a = \frac{m_2 - m_1}{m_1 + m_2} g,\quad T = \frac{2m_1m_2}{m_1+m_2} g"
            description="Coupled acceleration and internal string tension for dual hanging masses."
            variables={[
              { symbol: 'm_1, m_2', name: 'Connected Masses', unit: 'kg' },
              { symbol: 'a', name: 'System Acceleration', unit: 'm/s²' },
              { symbol: 'T', name: 'String Tension', unit: 'N' },
            ]}
          />
        </div>
      </div>

      {/* 2. Interactive Simulation */}
      <div>
        <AtwoodSimulation />
      </div>

      {/* 3. Common Misconception Callout */}
      <MisconceptionCard
        myth="The tension T in the string is equal to the weight of the heavier mass (T = m2 g) or the sum of weights (T = m1 g + m2 g)."
        reality="If T were equal to m2 g, the heavier mass would have zero net force and could not accelerate downwards! Tension T is strictly LESS than m2 g and GREATER than m1 g."
        scientificExplanation="For m2 to accelerate down, m2 g > T. For m1 to accelerate up, T > m1 g. Therefore, W1 < T < W2. Tension self-adjusts to the harmonic mean of the masses: T = 2 m1 m2 g / (m1 + m2)."
        whyItMatters="Paper 2 Atwood problems test whether students realize that tension is an internal constraint force, NOT equal to either individual weight."
      />

      {/* 4. IB Exam Tip */}
      <ExamTip
        title="Treating Coupled Systems as a Single Unified Body"
        tip="You can instantly find system acceleration by treating the two masses as a single combined mass (M_total = m1 + m2): F_net = Driving Force - Opposing Force = (m2 - m1)g = (m1 + m2)a ⇒ a = (m2 - m1)g / (m1 + m2). Then isolate ONE mass to find tension T."
        paperType="Paper 2 (Structured)"
        warning="Always show both individual FBD equations when full working is required for method marks!"
      />

      {/* 5. Worked Example (6-Step Progressive Reveal) */}
      <WorkedExample data={WORKED_EXAMPLE_ATWOOD} />

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
        title="Rotational Inertia of a Massive Pulley (IB Option B Extension)"
        subtitle="How a non-ideal pulley with moment of inertia I reduces system acceleration"
        ibLevel="HL"
        equations={[
          '\\tau_{\\text{net}} = (T_2 - T_1) R = I\\alpha = I\\frac{a}{R}',
          'a = \\frac{(m_2 - m_1) g}{m_1 + m_2 + \\frac{I}{R^2}} = \\frac{(m_2 - m_1) g}{m_1 + m_2 + \\frac{1}{2}M_{\\text{pulley}}}',
        ]}
      >
        <p>
          If the pulley has mass <Equation math="M_{\text{pulley}}" /> and radius <Equation math="R" /> (with moment of inertia <Equation math="I = \frac{1}{2} M R^2" />), the string tensions on either side are <strong>not equal</strong> (<Equation math="T_2 > T_1" />).
        </p>
        <p className="mt-2">
          The difference in tensions produces a net torque that angularly accelerates the pulley. This adds an effective mass term <Equation math="\frac{I}{R^2} = \frac{1}{2} M_{\text{pulley}}" /> to the denominator, slowing down system acceleration!
        </p>
      </DeepDive>
    </div>
  );
};
