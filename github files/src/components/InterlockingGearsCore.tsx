import React from 'react';

// Helper SVG path generator for precise mechanical spur gears
const generateGearPath = (cx: number, cy: number, outerRadius: number, innerRadius: number, teeth: number, holeRadius: number) => {
  const points: string[] = [];
  const anglePerStep = (Math.PI * 2) / teeth;

  for (let i = 0; i < teeth; i++) {
    const a0 = i * anglePerStep;
    const a1 = a0 + anglePerStep * 0.25;
    const a2 = a0 + anglePerStep * 0.50;
    const a3 = a0 + anglePerStep * 0.75;

    // Inner radius start
    const x0 = cx + Math.cos(a0) * innerRadius;
    const y0 = cy + Math.sin(a0) * innerRadius;
    // Outer radius tooth peak start
    const x1 = cx + Math.cos(a1) * outerRadius;
    const y1 = cy + Math.sin(a1) * outerRadius;
    // Outer radius tooth peak end
    const x2 = cx + Math.cos(a2) * outerRadius;
    const y2 = cy + Math.sin(a2) * outerRadius;
    // Inner radius tooth root end
    const x3 = cx + Math.cos(a3) * innerRadius;
    const y3 = cy + Math.sin(a3) * innerRadius;

    if (i === 0) {
      points.push(`M ${x0} ${y0}`);
    } else {
      points.push(`L ${x0} ${y0}`);
    }
    points.push(`L ${x1} ${y1}`);
    points.push(`L ${x2} ${y2}`);
    points.push(`L ${x3} ${y3}`);
  }
  points.push('Z');

  // Inner center hole cutout
  let holePath = '';
  if (holeRadius > 0) {
    holePath = ` M ${cx + holeRadius} ${cy} A ${holeRadius} ${holeRadius} 0 1 0 ${cx - holeRadius} ${cy} A ${holeRadius} ${holeRadius} 0 1 0 ${cx + holeRadius} ${cy} Z`;
  }

  return points.join(' ') + holePath;
};

export const InterlockingGearsCore: React.FC = () => {
  // Main Gear: Center (250, 250), 20 teeth
  const mainGearPath = generateGearPath(250, 250, 140, 118, 20, 65);
  // Secondary Interlocking Gear: Top Right (345, 155), 14 teeth
  const gear2Path = generateGearPath(250, 250, 90, 75, 14, 35);
  // Satellite Interlocking Gear: Bottom Left (155, 345), 10 teeth
  const gear3Path = generateGearPath(250, 250, 68, 56, 10, 25);

  return (
    <div className="relative w-full h-full flex items-center justify-center pointer-events-none select-none overflow-hidden">
      {/* High Performance Ambient Center Glow (Static CSS GPU Accelerated) */}
      <div className="absolute w-56 h-56 sm:w-72 sm:h-72 rounded-full bg-cyan-500/15 blur-2xl pointer-events-none transform-gpu animate-pulse" />
      <div className="absolute w-36 h-36 sm:w-48 sm:h-48 rounded-full bg-blue-600/10 blur-xl pointer-events-none transform-gpu" />

      <svg
        className="w-[380px] h-[380px] sm:w-[480px] sm:h-[480px] opacity-90 transform-gpu"
        viewBox="0 0 500 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Main Gear Gradient: Electric Cyan to Deep Blue */}
          <linearGradient id="mainGearGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#0066ff" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#00f0ff" stopOpacity="0.9" />
          </linearGradient>
          {/* Gear 2 Gradient: Tech Indigo to Royal Blue */}
          <linearGradient id="gear2Grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.8" />
          </linearGradient>
          {/* Gear 3 Gradient: Emerald Teal to Mint Cyan */}
          <linearGradient id="gear3Grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#0d9488" stopOpacity="0.8" />
          </linearGradient>
          <radialGradient id="centerCoreLight" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="30%" stopColor="#00f0ff" stopOpacity="0.9" />
            <stop offset="70%" stopColor="#0066ff" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Outer Tech Scale Calibration Ring */}
        <g style={{ transformOrigin: '250px 250px' }} className="animate-[spin_40s_linear_infinite] origin-center">
          <circle cx="250" cy="250" r="225" stroke="rgba(0, 240, 255, 0.25)" strokeWidth="1.5" strokeDasharray="8 8" />
          <circle cx="250" cy="250" r="212" stroke="rgba(59, 130, 246, 0.2)" strokeWidth="1" strokeDasharray="4 12" />
        </g>

        {/* 1. Main Large Mechanical Gear (Electric Cyan Gradient - Clockwise Rotation) */}
        <g style={{ transformOrigin: '250px 250px' }} className="animate-[spin_20s_linear_infinite] origin-center">
          <path
            d={mainGearPath}
            fill="url(#mainGearGrad)"
            stroke="#00f0ff"
            strokeWidth="2"
            fillRule="evenodd"
          />
          {/* Inner Light Window Spokes */}
          {[0, 60, 120, 180, 240, 300].map((deg) => (
            <circle
              key={deg}
              cx="250"
              cy="160"
              r="12"
              fill="#020305"
              stroke="#00f0ff"
              strokeWidth="1.5"
              transform={`rotate(${deg} 250 250)`}
            />
          ))}
        </g>

        {/* 2. Secondary Interlocking Gear (Tech Indigo/Royal Blue - Counter-Clockwise Rotation) */}
        <g style={{ transformOrigin: '340px 160px' }} className="animate-[spin_12s_linear_infinite_reverse] origin-center">
          <g transform="translate(90, -90)">
            <path
              d={gear2Path}
              fill="url(#gear2Grad)"
              stroke="#6366f1"
              strokeWidth="2"
              fillRule="evenodd"
            />
            {/* Gear 2 Inner Cutouts */}
            {[0, 90, 180, 270].map((deg) => (
              <circle
                key={deg}
                cx="250"
                cy="195"
                r="8"
                fill="#020305"
                stroke="#6366f1"
                strokeWidth="1"
                transform={`rotate(${deg} 250 250)`}
              />
            ))}
          </g>
        </g>

        {/* 3. Small Interlocking Satellite Gear (Emerald Teal/Mint Cyan - Counter-Clockwise Rotation) */}
        <g style={{ transformOrigin: '160px 340px' }} className="animate-[spin_8s_linear_infinite_reverse] origin-center">
          <g transform="translate(-90, 90)">
            <path
              d={gear3Path}
              fill="url(#gear3Grad)"
              stroke="#06b6d4"
              strokeWidth="1.5"
              fillRule="evenodd"
            />
          </g>
        </g>

        {/* Center Glowing Hub Light Core */}
        <circle cx="250" cy="250" r="50" fill="url(#centerCoreLight)" />
        <circle cx="250" cy="250" r="28" fill="#00f0ff" stroke="#ffffff" strokeWidth="2.5" />
        <circle cx="250" cy="250" r="12" fill="#ffffff" />
      </svg>
    </div>
  );
};
