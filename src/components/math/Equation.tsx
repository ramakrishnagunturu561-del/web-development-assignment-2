import React, { useMemo } from 'react';
import katex from 'katex';

interface EquationProps {
  math: string;
  displayMode?: boolean;
  className?: string;
  ariaLabel?: string;
}

export const Equation: React.FC<EquationProps> = ({
  math,
  displayMode = false,
  className = '',
  ariaLabel,
}) => {
  const html = useMemo(() => {
    try {
      return katex.renderToString(math, {
        displayMode,
        throwOnError: false,
        output: 'htmlAndMathml',
      });
    } catch (err) {
      console.warn('KaTeX rendering error for math:', math, err);
      return `<span class="katex-error">${math}</span>`;
    }
  }, [math, displayMode]);

  return (
    <span
      className={`inline-flex items-center ${displayMode ? 'justify-center my-2 w-full overflow-x-auto' : ''} ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
      aria-label={ariaLabel || math}
    />
  );
};
