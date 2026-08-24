import React, { useState, useEffect } from 'react';
import type { SectionId } from '../types/learning';
import { FINAL_CHALLENGE_QUESTIONS } from '../data/quizData';
import { recordFinalChallengeResult, loadProgress } from '../utils/storage';
import {
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  HelpCircle,
  BookOpen,
  Trophy,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface FinalChallengeProps {
  onNavigateSection: (id: SectionId) => void;
}

export const FinalChallenge: React.FC<FinalChallengeProps> = ({ onNavigateSection }) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);

  // Load saved challenge results on mount if any
  useEffect(() => {
    const progress = loadProgress();
    if (progress.finalChallenge.completed) {
      setSelectedAnswers(progress.finalChallenge.answers);
      setScore(progress.finalChallenge.score);
      setIsSubmitted(true);
    }
  }, []);

  const handleSelectOption = (questionId: string, optionId: string) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handleSubmit = () => {
    let earnedPoints = 0;
    FINAL_CHALLENGE_QUESTIONS.forEach((q) => {
      const selectedId = selectedAnswers[q.id];
      const selectedOpt = q.options.find((o) => o.id === selectedId);
      if (selectedOpt && selectedOpt.isCorrect) {
        earnedPoints += 1;
      }
    });

    const totalPossible = FINAL_CHALLENGE_QUESTIONS.length;
    setScore(earnedPoints);
    setIsSubmitted(true);

    recordFinalChallengeResult(earnedPoints, totalPossible, selectedAnswers);

    if (earnedPoints >= 6) {
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#06b6d4', '#10b981', '#f59e0b', '#8b5cf6'],
        });
      } catch {}
    }
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
    setScore(0);
  };

  const totalQuestions = FINAL_CHALLENGE_QUESTIONS.length;
  const percentage = Math.round((score / totalQuestions) * 100);
  const answeredCount = Object.keys(selectedAnswers).length;

  const getPerformanceBadge = () => {
    if (percentage >= 85) {
      return {
        label: 'IB Physics Grade 7 (Exceptional Mastery)',
        bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      };
    }
    if (percentage >= 70) {
      return {
        label: 'IB Physics Grade 6 (Proficient)',
        bg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
      };
    }
    if (percentage >= 50) {
      return {
        label: 'IB Physics Grade 5 (Sound Understanding)',
        bg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      };
    }
    return {
      label: 'Needs Conceptual Review',
      bg: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    };
  };

  const badge = getPerformanceBadge();

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
          <span>Topic 9 of 9</span>
          <span>•</span>
          <span>IB DP Physics Exam Simulator</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
          Chapter 2 Final Mastery Assessment
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Comprehensive multi-topic exam evaluating Newton's laws, FBDs, friction, equilibrium, Atwood machine, and circular motion.
        </p>
      </div>

      {/* Score Results Card (when submitted) */}
      {isSubmitted && (
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.7) 100%)',
            border: `1px solid ${percentage >= 70 ? 'rgba(16, 185, 129, 0.4)' : 'rgba(245, 158, 11, 0.4)'}`,
            borderRadius: '20px',
            boxShadow: '0 15px 35px -10px rgba(0, 0, 0, 0.5)',
          }}
          className="p-6 md:p-8 animate-fadeIn"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <span className="p-3 rounded-2xl bg-gradient-to-tr from-cyan-500 to-emerald-500 text-slate-950 shadow-lg shadow-cyan-500/20">
                <Trophy size={26} />
              </span>
              <div>
                <h2 className="text-lg font-bold text-white">Assessment Complete</h2>
                <span className={`inline-block mt-1 text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border ${badge.bg}`}>
                  {badge.label}
                </span>
              </div>
            </div>

            <div className="text-right">
              <div className="text-3xl font-extrabold font-mono text-cyan-300">
                {score} / {totalQuestions}
              </div>
              <p className="text-xs text-slate-400 font-mono">Score: {percentage}%</p>
            </div>
          </div>

          <p className="text-xs text-slate-300 mt-4 leading-relaxed">
            Review the detailed question analysis below. For any question answered incorrectly, use the dedicated <strong className="text-cyan-400">Review Topic</strong> button to jump directly back to that simulation and study the core principles.
          </p>

          <div className="mt-4 pt-3 flex justify-end">
            <button
              type="button"
              onClick={handleRetake}
              className="px-4 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw size={13} />
              <span>Retake Assessment</span>
            </button>
          </div>
        </div>
      )}

      {/* Questions List */}
      <div className="space-y-6">
        {FINAL_CHALLENGE_QUESTIONS.map((question, qIdx) => {
          const selectedOptionId = selectedAnswers[question.id];
          const selectedOption = question.options.find((o) => o.id === selectedOptionId);
          const isQCorrect = selectedOption ? selectedOption.isCorrect : false;

          return (
            <div
              key={question.id}
              style={{
                background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.5) 100%)',
                border: `1px solid ${
                  isSubmitted
                    ? isQCorrect
                      ? 'rgba(16, 185, 129, 0.35)'
                      : 'rgba(244, 63, 94, 0.35)'
                    : 'rgba(148, 163, 184, 0.15)'
                }`,
                borderRadius: '18px',
              }}
              className="p-5 md:p-6 transition-all"
            >
              {/* Question Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2.5 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
                    Question {qIdx + 1} of {totalQuestions}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    [{question.difficulty}]
                  </span>
                </div>

                {isSubmitted && (
                  <div className="flex items-center gap-2">
                    {isQCorrect ? (
                      <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                        <CheckCircle2 size={13} />
                        <span>✓ Correct</span>
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-rose-400 flex items-center gap-1 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-500/30">
                        <XCircle size={13} />
                        <span>✕ Incorrect</span>
                      </span>
                    )}

                    {/* Review Topic Link */}
                    {!isQCorrect && (
                      <button
                        type="button"
                        onClick={() => onNavigateSection(question.reviewSectionId)}
                        className="text-xs font-semibold text-cyan-300 hover:text-cyan-200 bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/40 px-2.5 py-0.5 rounded flex items-center gap-1 transition-colors"
                      >
                        <BookOpen size={12} />
                        <span>Review: {question.reviewSectionTitle}</span>
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Prompt */}
              <p className="text-sm text-slate-100 font-medium leading-relaxed mb-4">
                {question.prompt}
              </p>

              {/* Options */}
              <div className="space-y-2 mb-4" role="radiogroup" aria-label={`Question ${qIdx + 1} options`}>
                {question.options.map((opt, optIdx) => {
                  const isSelected = selectedOptionId === opt.id;
                  const letter = String.fromCharCode(65 + optIdx);

                  let borderClass = 'border-slate-800/80 bg-slate-900/40 hover:border-slate-700';
                  let textClass = 'text-slate-300';

                  if (isSubmitted) {
                    if (opt.isCorrect) {
                      borderClass = 'border-emerald-500/60 bg-emerald-950/30';
                      textClass = 'text-emerald-200 font-medium';
                    } else if (isSelected && !opt.isCorrect) {
                      borderClass = 'border-rose-500/60 bg-rose-950/30';
                      textClass = 'text-rose-200';
                    } else {
                      borderClass = 'border-slate-800/30 opacity-50';
                    }
                  } else if (isSelected) {
                    borderClass = 'border-cyan-400 bg-cyan-950/40 shadow-sm';
                    textClass = 'text-cyan-100 font-medium';
                  }

                  return (
                    <div
                      key={opt.id}
                      onClick={() => handleSelectOption(question.id, opt.id)}
                      className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${borderClass}`}
                      role="radio"
                      aria-checked={isSelected}
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === ' ' || e.key === 'Enter') {
                          e.preventDefault();
                          handleSelectOption(question.id, opt.id);
                        }
                      }}
                    >
                      <span
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-mono font-bold shrink-0 mt-0.5 border ${
                          isSelected
                            ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                      >
                        {letter}
                      </span>
                      <span className={`text-xs sm:text-sm leading-relaxed flex-1 ${textClass}`}>
                        {opt.text}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Detailed Explanation on Submission */}
              {isSubmitted && (
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 space-y-1.5 animate-fadeIn">
                  <div className="flex items-center gap-1.5 text-cyan-400 font-semibold">
                    <HelpCircle size={13} />
                    <span>Scientific Solution Rationale:</span>
                  </div>
                  <p className="text-slate-300">{selectedOption?.explanation || question.conceptualRationale}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Submit Action */}
      {!isSubmitted && (
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-xs text-slate-400">
            Answered: <strong className="text-cyan-300 font-mono">{answeredCount}</strong> of {totalQuestions} questions
          </div>

          <button
            type="button"
            disabled={answeredCount < totalQuestions}
            onClick={handleSubmit}
            className={`px-6 py-3 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all ${
              answeredCount === totalQuestions
                ? 'bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 text-slate-950 hover:from-cyan-300 hover:to-emerald-300 shadow-lg shadow-cyan-500/25 active:scale-95 cursor-pointer'
                : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
            }`}
          >
            <Sparkles size={16} />
            <span>Submit Assessment & Generate Report</span>
          </button>
        </div>
      )}
    </div>
  );
};
