import React from 'react';
import { Equation } from '../math/Equation';

interface ForceArrowProps {
  startX: number;
  startY: number;
  length: number; // in pixels
  angleDeg: number; // 0 = right, 90 = down in SVG canvas coords, or math coords
  color?: string;
  label?: string;
  mathLaTeX?: string;
  valueText?: string;
  strokeWidth?: number;
  headSize?: number;
  isMathCoord?: boolean; // if true, 90 = up, 270 = down
}

export const ForceArrow: React.FC<ForceArrowProps> = ({
  startX,
  startY,
  length,
  angleDeg,
  color = '#06b6d4',
  label,
  mathLaTeX,
  valueText,
  strokeWidth = 3,
  headSize = 8,
  isMathCoord = true,
}) => {
  if (Math.abs(length) < 2) return null;

  // Convert math angle (0=right, 90=up) to SVG screen angle (0=right, 90=down)
  const angleRad = isMathCoord
    ? ((-angleDeg) * Math.PI) / 180
    : (angleDeg * Math.PI) / 180;

  const endX = startX + length * Math.cos(angleRad);
  const endY = startY + length * Math.sin(angleRad);

  // Arrowhead points
  const headAngle1 = angleRad + Math.PI * 0.85;
  const headAngle2 = angleRad - Math.PI * 0.85;

  const arrowHeadP1X = endX + headSize * Math.cos(headAngle1);
  const arrowHeadP1Y = endY + headSize * Math.sin(headAngle1);
  const arrowHeadP2X = endX + headSize * Math.cos(headAngle2);
  const arrowHeadP2Y = endY + headSize * Math.sin(headAngle2);

  // Label position slightly offset from tip
  const labelOffsetX = 14 * Math.cos(angleRad);
  const labelOffsetY = 14 * Math.sin(angleRad);

  return (
    <g className="force-arrow transition-all duration-75">
      {/* Glow shadow line */}
      <line
        x1={startX}
        y1={startY}
        x2={endX}
        y2={endY}
        stroke={color}
        strokeWidth={strokeWidth + 4}
        strokeOpacity={0.25}
        strokeLinecap="round"
      />
      {/* Main vector line */}
      <line
        x1={startX}
        y1={startY}
        x2={endX}
        y2={endY}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      {/* Arrowhead polygon */}
      <polygon
        points={`${endX},${endY} ${arrowHeadP1X},${arrowHeadP1Y} ${arrowHeadP2X},${arrowHeadP2Y}`}
        fill={color}
      />
      {/* Text Label */}
      {(label || valueText || mathLaTeX) && (
        <foreignObject
          x={endX + labelOffsetX - 50}
          y={endY + labelOffsetY - 14}
          width={100}
          height={32}
          className="pointer-events-none"
        >
          <div className="flex flex-col items-center justify-center text-center">
            <span
              style={{
                backgroundColor: 'rgba(15, 23, 42, 0.85)',
                borderColor: color,
                color: color,
              }}
              className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border shadow-sm flex items-center gap-1 whitespace-nowrap"
            >
              {mathLaTeX ? <Equation math={mathLaTeX} /> : label}
              {valueText && <span className="text-slate-200">={valueText}</span>}
            </span>
          </div>
        </foreignObject>
      )}
    </g>
  );
};
