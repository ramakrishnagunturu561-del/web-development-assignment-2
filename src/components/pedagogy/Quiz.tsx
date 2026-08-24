import React, { useState, useEffect } from 'react';
import type { QuizQuestion } from '../../types/learning';
import { Equation } from '../math/Equation';
import { recordQuizAnswer } from '../../utils/storage';
import { HelpCircle, CheckCircle2, XCircle, ArrowRight, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';

interface QuizProps {
  question: QuizQuestion;
  onAnswerSubmitted?: (isCorrect: boolean) => void;
  onNextSection?: () => void;
  savedAnswer?: {
    selectedOptionId: string;
    isCorrect: boolean;
  };
  className?: string;
}

export const Quiz: React.FC<QuizProps> = ({
  question,
  onAnswerSubmitted,
  onNextSection,
  savedAnswer,
  className = '',
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(
    savedAnswer ? savedAnswer.selectedOptionId : null
  );
  const [isSubmitted, setIsSubmitted] = useState<boolean>(!!savedAnswer);

  useEffect(() => {
    if (savedAnswer) {
      setSelectedId(savedAnswer.selectedOptionId);
      setIsSubmitted(true);
    }
  }, [savedAnswer]);

  const selectedOption = question.options.find((opt) => opt.id === selectedId);
  const isCorrect = selectedOption ? selectedOption.isCorrect : false;

  const handleOptionSelect = (optionId: string) => {
    if (isSubmitted) return;
    setSelectedId(optionId);
  };

  const handleSubmit = () => {
    if (!selectedId || isSubmitted) return;
    setIsSubmitted(true);
    const chosen = question.options.find((o) => o.id === selectedId);
    const correct = chosen ? chosen.isCorrect : false;

    recordQuizAnswer(question.id, selectedId, correct);
    if (onAnswerSubmitted) {
      onAnswerSubmitted(correct);
    }

    if (correct) {
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#06b6d4', '#10b981', '#3b82f6'],
        });
      } catch {
        // Fallback if confetti fails
      }
    }
  };

  const handleTryAgain = () => {
    setIsSubmitted(false);
    setSelectedId(null);
  };

  return (
    <div
      style={{
        background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.6) 100%)',
        border: `1px solid ${
          isSubmitted
            ? isCorrect
              ? 'rgba(16, 185, 129, 0.4)'
              : 'rgba(244, 63, 94, 0.4)'
            : 'rgba(6, 182, 212, 0.3)'
        }`,
        borderRadius: '18px',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
      }}
      className={`p-5 my-5 overflow-hidden transition-all ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2 pb-3 mb-4 border-b border-slate-700/60">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
            <HelpCircle size={16} />
          </span>
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
            Check Yourself — Concept Verification
          </h3>
        </div>
        {question.ibTopicTag && (
          <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
            {question.ibTopicTag}
          </span>
        )}
      </div>

      {/* Question Prompt */}
      <div className="mb-4">
        <p className="text-sm text-slate-100 font-medium leading-relaxed">
          {question.prompt}
        </p>
        {question.promptLaTeX && (
          <div className="my-2 p-2 rounded-lg bg-slate-950/70 text-center font-mono text-cyan-300">
            <Equation math={question.promptLaTeX} displayMode={true} />
          </div>
        )}
      </div>

      {/* Options */}
      <div className="space-y-2.5 mb-4" role="radiogroup" aria-label="Question Options">
        {question.options.map((option, idx) => {
          const isSelected = selectedId === option.id;
          let borderStyle = 'border-slate-800 hover:border-slate-700 bg-slate-900/60';
          let textColor = 'text-slate-200';

          if (isSubmitted) {
            if (option.isCorrect) {
              borderStyle = 'border-emerald-500/60 bg-emerald-950/30';
              textColor = 'text-emerald-200 font-medium';
            } else if (isSelected && !option.isCorrect) {
              borderStyle = 'border-rose-500/60 bg-rose-950/30';
              textColor = 'text-rose-200';
            } else {
              borderStyle = 'border-slate-800/40 opacity-50 bg-slate-950/40';
            }
          } else if (isSelected) {
            borderStyle = 'border-cyan-400 bg-cyan-950/40 shadow-sm shadow-cyan-500/20';
            textColor = 'text-cyan-100 font-medium';
          }

          const optionLetter = String.fromCharCode(65 + idx); // A, B, C, D

          return (
            <div
              key={option.id}
              onClick={() => handleOptionSelect(option.id)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${borderStyle}`}
              role="radio"
              aria-checked={isSelected}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                  e.preventDefault();
                  handleOptionSelect(option.id);
                }
              }}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold shrink-0 mt-0.5 border ${
                  isSelected
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                    : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}
              >
                {optionLetter}
              </div>

              <div className="flex-1 text-xs sm:text-sm leading-relaxed">
                <span className={textColor}>{option.text}</span>
                {option.mathLaTeX && (
                  <span className="ml-2 font-mono text-cyan-300">
                    <Equation math={option.mathLaTeX} />
                  </span>
                )}
              </div>

              {isSubmitted && option.isCorrect && (
                <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/40 shrink-0">
                  <CheckCircle2 size={13} />
                  <span>✓ Correct</span>
                </span>
              )}
              {isSubmitted && isSelected && !option.isCorrect && (
                <span className="flex items-center gap-1 text-xs font-bold text-rose-400 bg-rose-950/80 px-2 py-0.5 rounded border border-rose-500/40 shrink-0">
                  <XCircle size={13} />
                  <span>✕ Not quite</span>
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Post-Submission Explanation */}
      {isSubmitted && (
        <div
          className={`p-4 rounded-xl mb-4 border animate-fadeIn ${
            isCorrect
              ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-100'
              : 'bg-rose-950/30 border-rose-500/40 text-rose-100'
          }`}
        >
          <div className="flex items-center gap-2 mb-1.5">
            {isCorrect ? (
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                <CheckCircle2 size={15} />
                <span>✓ Correct! Scientific Understanding Confirmed</span>
              </span>
            ) : (
              <span className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1">
                <XCircle size={15} />
                <span>✕ Not quite — Let's understand why</span>
              </span>
            )}
          </div>

          <p className="text-xs text-slate-200 leading-relaxed mb-2">
            {selectedOption?.explanation || question.conceptualRationale}
          </p>

          <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 text-[11px] text-slate-300">
            <span className="font-semibold text-cyan-300">Core Principle: </span>
            {question.conceptualRationale}
          </div>
        </div>
      )}

      {/* Action Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
        <div>
          {!isSubmitted && (
            <p className="text-xs text-slate-400">
              {selectedId ? 'Option selected. Click Submit to verify.' : 'Select an option to test your understanding.'}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {!isSubmitted ? (
            <button
              type="button"
              disabled={!selectedId}
              onClick={handleSubmit}
              className={`px-5 py-2 text-xs font-bold rounded-lg transition-all ${
                selectedId
                  ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 hover:from-cyan-300 hover:to-blue-400 shadow-md shadow-cyan-500/20 active:scale-95'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              }`}
            >
              Submit Answer
            </button>
          ) : (
            <>
              {!isCorrect && (
                <button
                  type="button"
                  onClick={handleTryAgain}
                  className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <RotateCcw size={13} />
                  <span>Try Again</span>
                </button>
              )}
              {onNextSection && (
                <button
                  type="button"
                  onClick={onNextSection}
                  className="px-4 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 rounded-lg flex items-center gap-1.5 shadow-md shadow-emerald-500/20 active:scale-95 transition-all"
                >
                  <span>Next Topic</span>
                  <ArrowRight size={14} />
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
