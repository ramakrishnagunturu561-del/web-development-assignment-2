import type { SectionId, UserLearningProgress } from '../types/learning';

const STORAGE_KEY = 'forcelab_user_progress_v1';

const DEFAULT_PROGRESS: UserLearningProgress = {
  completedSections: ['overview'],
  quizAnswers: {},
  finalChallenge: {
    completed: false,
    score: 0,
    totalPossible: 8,
    answers: {},
  },
  revealedSteps: {},
};

export function loadProgress(): UserLearningProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROGRESS;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_PROGRESS,
      ...parsed,
      completedSections: Array.isArray(parsed.completedSections)
        ? parsed.completedSections
        : DEFAULT_PROGRESS.completedSections,
    };
  } catch {
    return DEFAULT_PROGRESS;
  }
}

export function saveProgress(progress: UserLearningProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (err) {
    console.error('Failed to save progress to localStorage', err);
  }
}

export function markSectionCompleted(sectionId: SectionId): UserLearningProgress {
  const current = loadProgress();
  if (!current.completedSections.includes(sectionId)) {
    const updated: UserLearningProgress = {
      ...current,
      completedSections: [...current.completedSections, sectionId],
    };
    saveProgress(updated);
    return updated;
  }
  return current;
}

export function recordQuizAnswer(
  questionId: string,
  selectedOptionId: string,
  isCorrect: boolean
): UserLearningProgress {
  const current = loadProgress();
  const updated: UserLearningProgress = {
    ...current,
    quizAnswers: {
      ...current.quizAnswers,
      [questionId]: {
        selectedOptionId,
        isCorrect,
        timestamp: Date.now(),
      },
    },
  };
  saveProgress(updated);
  return updated;
}

export function recordFinalChallengeResult(
  score: number,
  totalPossible: number,
  answers: Record<string, string>
): UserLearningProgress {
  const current = loadProgress();
  const updated: UserLearningProgress = {
    ...current,
    finalChallenge: {
      completed: true,
      score,
      totalPossible,
      answers,
      timestamp: Date.now(),
    },
  };
  if (!updated.completedSections.includes('final-challenge')) {
    updated.completedSections.push('final-challenge');
  }
  saveProgress(updated);
  return updated;
}

export function resetAllProgress(): UserLearningProgress {
  saveProgress(DEFAULT_PROGRESS);
  return DEFAULT_PROGRESS;
}
