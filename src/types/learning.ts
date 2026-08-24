export type SectionId =
  | 'overview'
  | 'newton-first-law'
  | 'newton-second-law'
  | 'newton-third-law'
  | 'free-body-diagrams'
  | 'friction'
  | 'translational-equilibrium'
  | 'atwood-machine'
  | 'uniform-circular-motion'
  | 'final-challenge';

export interface SectionMeta {
  id: SectionId;
  number: number;
  title: string;
  shortTitle: string;
  subtitle: string;
  ibSyllabusRef: string;
  iconName: string;
  estimatedMinutes: number;
}

export interface KeyTakeawayItem {
  id: string;
  text: string;
  mathFormula?: string;
  tag?: string;
}

export interface Misconception {
  myth: string;
  reality: string;
  scientificExplanation: string;
  whyItMatters: string;
}

export interface ExamTipItem {
  title: string;
  tip: string;
  paperType: 'Paper 1 (MCQ)' | 'Paper 2 (Structured)' | 'General IB Tip';
  warning?: string;
}

export interface DeepDiveItem {
  title: string;
  subtitle: string;
  content: string;
  mathEquations?: string[];
  ibLevel: 'SL' | 'HL' | 'Both';
}

export interface WorkedExampleStep {
  stepNumber: number;
  title: string;
  explanation: string;
  mathLaTeX?: string;
  highlightText?: string;
}

export interface WorkedExampleData {
  id: string;
  problemStatement: string;
  diagramDescription?: string;
  givenData: { label: string; value: string; symbol: string }[];
  steps: WorkedExampleStep[];
  finalAnswer: {
    symbol: string;
    value: string;
    unit: string;
    mathLaTeX: string;
  };
}

export interface QuizOption {
  id: string;
  text: string;
  mathLaTeX?: string;
  isCorrect: boolean;
  explanation: string;
}

export interface QuizQuestion {
  id: string;
  sectionId: SectionId;
  questionNumber: number;
  prompt: string;
  promptLaTeX?: string;
  hint?: string;
  options: QuizOption[];
  conceptualRationale: string;
  ibTopicTag?: string;
}

export interface FinalChallengeQuestion extends QuizQuestion {
  difficulty: 'Standard Level (SL)' | 'Higher Level (HL)';
  points: number;
  reviewSectionId: SectionId;
  reviewSectionTitle: string;
}

export interface UserLearningProgress {
  completedSections: SectionId[];
  quizAnswers: Record<string, {
    selectedOptionId: string;
    isCorrect: boolean;
    timestamp: number;
  }>;
  finalChallenge: {
    completed: boolean;
    score: number;
    totalPossible: number;
    answers: Record<string, string>;
    timestamp?: number;
  };
  revealedSteps: Record<string, number>; // exampleId -> stepIndex
}
