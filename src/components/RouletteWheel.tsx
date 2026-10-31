import React from 'react';

interface RouletteWheelProps {
  rotation: number;
  isSpinning: boolean;
  availableNumbers: number[];
  drawnNumbers: number[];
  winningNumber: number | null;
}

const TOTAL_SEGMENTS = 25;
const SEGMENT_ANGLE = 360 / TOTAL_SEGMENTS; // 14.4 degrees
const RADIUS = 180;
const CENTER = 200;

// Joyful palette that rotates through 6 cheerful shades
const SLICE_COLORS = [
  '#f59e0b', // amber
  '#06b6d4', // cyan
  '#ec4899', // pink
  '#10b981', // emerald
  '#8b5cf6', // purple
  '#ef4444', // red
  '#3b82f6', // blue
  '#f97316', // orange
  '#14b8a6', // teal
  '#a855f7', // violet
];

export const RouletteWheel: React.FC<RouletteWheelProps> = ({
  rotation,
  isSpinning,
  availableNumbers,
  drawnNumbers,
  winningNumber
}) => {
  // Generate SVG path for a sector
  const getCoordinatesForPercent = (percent: number) => {
    const x = CENTER + RADIUS * Math.cos(2 * Math.PI * percent);
    const y = CENTER + RADIUS * Math.sin(2 * Math.PI * percent);
    return [x, y];
  };

  return (
    <div className="relative w-full max-w-[340px] sm:max-w-[390px] aspect-square mx-auto flex items-center justify-center select-none">
      {/* Outer Glow & Metallic Bezel */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-slate-700 via-slate-800 to-slate-950 p-3 shadow-2xl border-4 border-amber-400/80">
        {/* Decorative perimeter rivets/LEDs */}
        <div className="absolute inset-1 rounded-full border border-dashed border-amber-300/40 pointer-events-none" />
      </div>

      {/* Top Pointer Indicator */}
      <div className="absolute -top-3 z-30 flex flex-col items-center pointer-events-none">
        <div className="w-8 h-9 drop-shadow-[0_4px_6px_rgba(0,0,0,0.5)]">
          <svg viewBox="0 0 32 36" className="w-full h-full filter drop-shadow">
            <polygon
              points="16,36 3,4 29,4"
              className="fill-amber-400 stroke-amber-600 stroke-2"
            />
            <circle cx="16" cy="11" r="5" className="fill-red-600" />
            <circle cx="16" cy="11" r="2" className="fill-white" />
          </svg>
        </div>
      </div>

      {/* Rotating Wheel Container */}
      <div
        className="relative w-[90%] h-[90%] rounded-full overflow-hidden shadow-inner transition-transform"
        style={{
          transform: `rotate(${rotation}deg)`,
          transition: isSpinning
            ? 'transform 4.2s cubic-bezier(0.12, 0.95, 0.22, 1)'
            : 'transform 0.15s ease-out'
        }}
      >
        <svg
          viewBox="0 0 400 400"
          className="w-full h-full"
          style={{ transform: 'rotate(-90deg)' }} // start sector 1 at top
        >
          {Array.from({ length: TOTAL_SEGMENTS }, (_, index) => {
            const num = index + 1;
            const startAngle = index * SEGMENT_ANGLE;
            const endAngle = (index + 1) * SEGMENT_ANGLE;

            const startPercent = startAngle / 360;
            const endPercent = endAngle / 360;

            const [startX, startY] = getCoordinatesForPercent(startPercent);
            const [endX, endY] = getCoordinatesForPercent(endPercent);

            const pathData = `M ${CENTER} ${CENTER} L ${startX} ${startY} A ${RADIUS} ${RADIUS} 0 0 1 ${endX} ${endY} Z`;

            const isAvailable = availableNumbers.includes(num);
            const isDrawn = drawnNumbers.includes(num);
            const isWinner = winningNumber === num;

            // Color selection
            const baseColor = SLICE_COLORS[index % SLICE_COLORS.length];
            const fillColor = isDrawn
              ? '#64748b' // Dimmed slate for already revealed
              : isWinner
              ? '#fbbf24'
              : baseColor;

            // Text angle and coordinates
            const midAngle = (startAngle + endAngle) / 2;
            const textRadius = RADIUS * 0.72;
            const textRad = (midAngle * Math.PI) / 180;
            const textX = CENTER + textRadius * Math.cos(textRad);
            const textY = CENTER + textRadius * Math.sin(textRad);

            return (
              <g key={num} className="transition-opacity duration-300">
                {/* Sector Slice */}
                <path
                  d={pathData}
                  fill={fillColor}
                  opacity={isDrawn ? 0.35 : 1}
                  stroke="#ffffff"
                  strokeWidth="1.5"
                  className={isWinner ? 'animate-pulse' : ''}
                />

                {/* Subtle dark border line between slices */}
                <line
                  x1={CENTER}
                  y1={CENTER}
                  x2={startX}
                  y2={startY}
                  stroke="#1e293b"
                  strokeWidth="0.5"
                  opacity="0.3"
                />

                {/* Number Text */}
                <g
                  transform={`translate(${textX}, ${textY}) rotate(${midAngle + 90})`}
                >
                  <text
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill={isDrawn ? '#cbd5e1' : '#ffffff'}
                    fontWeight="800"
                    fontSize="17"
                    fontFamily="Outfit, sans-serif"
                    className="select-none filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]"
                  >
                    {num}
                  </text>
                  {isDrawn && (
                    <text
                      textAnchor="middle"
                      dominantBaseline="central"
                      y="14"
                      fill="#fca5a5"
                      fontSize="10"
                      fontWeight="700"
                    >
                      ✓
                    </text>
                  )}
                </g>
              </g>
            );
          })}

          {/* Wheel Center Hub (Chrome cap) */}
          <circle cx={CENTER} cy={CENTER} r="38" fill="#1e293b" stroke="#f59e0b" strokeWidth="4" />
          <circle cx={CENTER} cy={CENTER} r="30" fill="#334155" />
          <circle cx={CENTER} cy={CENTER} r="18" fill="#f59e0b" />
          <circle cx={CENTER} cy={CENTER} r="8" fill="#ffffff" />
        </svg>
      </div>

      {/* Center Badge Overlay (shows remaining or status) */}
      <div className="absolute z-20 pointer-events-none w-14 h-14 rounded-full flex flex-col items-center justify-center text-center shadow-lg bg-slate-900 border-2 border-amber-400">
        <span className="text-[10px] font-bold text-amber-300 leading-tight">1-25</span>
        <span className="text-[9px] text-slate-300 font-medium">SECRET</span>
      </div>
    </div>
  );
};
