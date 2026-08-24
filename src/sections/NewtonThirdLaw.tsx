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
import { NewtonThirdSim } from '../components/simulations/NewtonThirdSim';

interface NewtonThirdLawProps {
  onNextSection: () => void;
  onAnswerSubmitted?: (isCorrect: boolean) => void;
  savedAnswer?: { selectedOptionId: string; isCorrect: boolean };
}

const WORKED_EXAMPLE_N3: WorkedExampleData = {
  id: 'we-n3',
  problemStatement:
    'An 80 kg skater (Skater A) on frictionless ice pushes a 40 kg skater (Skater B) with a constant horizontal force of 120 N for a duration of 0.50 s. Both skaters start from rest. (a) Determine the force exerted on Skater A. (b) Calculate the acceleration of each skater during the push. (c) Calculate the final separation speed of the two skaters after 0.50 s.',
  givenData: [
    { label: 'Mass of A', value: '80 kg', symbol: 'm_A' },
    { label: 'Mass of B', value: '40 kg', symbol: 'm_B' },
    { label: 'Force A on B', value: '120 N (forward)', symbol: 'F_{A \\to B}' },
    { label: 'Push Duration', value: '0.50 s', symbol: '\\Delta t' },
  ],
  steps: [
    {
      stepNumber: 1,
      title: '1. Apply Newton’s Third Law for Interaction Force',
      explanation:
        'By Newton’s 3rd Law, the force exerted by Skater B onto Skater A is equal in magnitude and opposite in direction to the force exerted by A onto B.',
      mathLaTeX: '\\vec{F}_{B \\to A} = -\\vec{F}_{A \\to B} = -120\\text{ N}',
      highlightText: 'Skater A experiences exactly 120 N of force backwards.',
    },
    {
      stepNumber: 2,
      title: '2. Calculate Acceleration of Skater A',
      explanation:
        'Apply Newton’s 2nd Law (a = F/m) to Skater A using mass mA = 80 kg.',
      mathLaTeX: 'a_A = \\frac{F_{B \\to A}}{m_A} = \\frac{-120\\text{ N}}{80\\text{ kg}} = -1.50\\text{ m/s}^2',
    },
    {
      stepNumber: 3,
      title: '3. Calculate Acceleration of Skater B',
      explanation:
        'Apply Newton’s 2nd Law to Skater B using mass mB = 40 kg.',
      mathLaTeX: 'a_B = \\frac{F_{A \\to B}}{m_B} = \\frac{+120\\text{ N}}{40\\text{ kg}} = +3.00\\text{ m/s}^2',
      highlightText: 'Notice Skater B accelerates twice as fast because their mass is half as large!',
    },
    {
      stepNumber: 4,
      title: '4. Calculate Final Velocities After 0.50 s',
      explanation:
        'Using kinematics v = u + at starting from rest (u = 0):',
      mathLaTeX: 'v_A = (-1.50)(0.50) = -0.75\\text{ m/s},\\quad v_B = (+3.00)(0.50) = +1.50\\text{ m/s}',
    },
    {
      stepNumber: 5,
      title: '5. Calculate Total Relative Separation Speed',
      explanation:
        'Since the skaters move in opposite directions, their relative separation speed is the sum of their absolute speeds.',
      mathLaTeX: 'v_{\\text{rel}} = |v_B - v_A| = 1.50 - (-0.75) = 2.25\\text{ m/s}',
    },
  ],
  finalAnswer: {
    symbol: 'v_{\\text{rel}}',
    value: '2.25',
    unit: 'm/s (v_A = 0.75 m/s left, v_B = 1.50 m/s right)',
    mathLaTeX: 'v_{\\text{rel}} = 2.25\\text{ m/s}',
  },
};

export const NewtonThirdLaw: React.FC<NewtonThirdLawProps> = ({
  onNextSection,
  onAnswerSubmitted,
  savedAnswer,
}) => {
  const quiz = SECTION_QUIZZES['newton-third-law'];

  const takeaways = [
    { id: 't1', text: 'Forces always occur in matched interaction pairs', mathFormula: '\\vec{F}_{A \\to B} = -\\vec{F}_{B \\to A}' },
    { id: 't2', text: 'Action and reaction forces act on TWO DIFFERENT BODIES' },
    { id: 't3', text: 'Action-reaction pairs NEVER cancel out on a single object' },
    { id: 't4', text: 'Equal forces produce different accelerations if masses differ', mathFormula: 'a_A = \\frac{F}{m_A},\\; a_B = \\frac{F}{m_B}' },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
          <span>Topic 3 of 9</span>
          <span>•</span>
          <span>IB DP Physics A.2.3</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
          Newton's Third Law of Motion: Action & Reaction
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Mutual interaction pairs, equal magnitudes, opposite directions, and distinct objects.
        </p>
      </div>

      {/* 1. Concept Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <ConceptCard title="The Law of Mutual Interactions" variant="cyan">
            <p>
              Newton's Third Law states: <em>"When body A exerts a force on body B, body B simultaneously exerts an equal in magnitude and opposite in direction force on body A."</em>
            </p>
            <p className="mt-2 text-slate-300">
              There are no isolated forces in the universe; all forces are interactions between two bodies. The two forces in a Newton's 3rd Law pair are of the <strong>same physical type</strong> (e.g. both gravitational, both normal contact, or both electrostatic) and act along the same line of action.
            </p>
          </ConceptCard>
        </div>

        <div>
          <FormulaCard
            title="Newton's 3rd Law"
            mathLaTeX="\vec{F}_{A \to B} = -\vec{F}_{B \to A}"
            description="Force on body B from body A is equal and opposite to force on body A from body B."
            variables={[
              { symbol: '\\vec{F}_{A \\to B}', name: 'Force on Body B', unit: 'N' },
              { symbol: '\\vec{F}_{B \\to A}', name: 'Force on Body A', unit: 'N' },
            ]}
          />
        </div>
      </div>

      {/* 2. Interactive Simulation */}
      <div>
        <NewtonThirdSim />
      </div>

      {/* 3. Common Misconception Callout */}
      <MisconceptionCard
        myth="Action and reaction forces cancel each other out, making ΣF = 0, so nothing should ever be able to move or accelerate."
        reality="Action and reaction forces do NOT cancel out because they act on DIFFERENT OBJECTS! When calculating ΣF for body B, you only sum forces acting ON body B."
        scientificExplanation="To find the acceleration of body B, you evaluate ΣF_B / m_B, which includes F_{A \to B}. The reaction force F_{B \to A} acts on body A, so it has zero direct effect on body B's free-body diagram!"
        whyItMatters="A classic IB Paper 1 trick asks why a horse can pull a cart: The horse moves forward because the ground pushes the horse forward (reaction to horse pushing ground), which exceeds the backward pull of the cart."
      />

      {/* 4. IB Exam Tip */}
      <ExamTip
        title="Identifying Genuine Newton 3rd Law Pairs"
        tip="To verify if two forces form a genuine Newton 3rd Law pair, use the rule: If Force 1 is 'Body A acts on Body B', then Force 2 MUST be 'Body B acts on Body A'. If both forces act on the same body, they CANNOT be a Newton 3rd Law pair (e.g. Weight and Normal force on a book are NOT a pair!)."
        paperType="Paper 1 (MCQ)"
        warning="Weight is Earth pulling Book; the reaction is Book pulling Earth gravitationally."
      />

      {/* 5. Worked Example (Progressive Reveal) */}
      <WorkedExample data={WORKED_EXAMPLE_N3} />

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
        title="Conservation of Linear Momentum from Newton's 3rd Law"
        subtitle="How Newton's Third Law directly proves the Law of Conservation of Momentum"
        ibLevel="HL"
        equations={[
          '\\vec{F}_{A \\to B} + \\vec{F}_{B \\to A} = 0',
          '\\frac{d\\vec{p}_B}{dt} + \\frac{d\\vec{p}_A}{dt} = \\frac{d}{dt}(\\vec{p}_A + \\vec{p}_B) = 0 \\implies \\vec{p}_{\\text{total}} = \\text{constant}',
        ]}
      >
        <p>
          Consider an isolated two-body system containing only bodies A and B with no external forces. Integrating Newton's Third Law over the duration of an interaction reveals that the total impulse given to body B is exactly equal and opposite to the impulse given to body A.
        </p>
        <p className="mt-2">
          Therefore, the total linear momentum of any closed, isolated system remains strictly conserved in all collisions (both elastic and inelastic).
        </p>
      </DeepDive>
    </div>
  );
};
