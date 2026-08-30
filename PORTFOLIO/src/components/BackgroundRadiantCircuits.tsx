import React from 'react';

interface BackgroundRadiantCircuitsProps {
  color1?: string;
  color2?: string;
  opacity?: number;
}

export const BackgroundRadiantCircuits: React.FC<BackgroundRadiantCircuitsProps> = ({ 
  color1 = "#00d8ff", 
  color2 = "#0055ff",
  opacity = 0.2
}) => {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-0" style={{ opacity }}>
      {/* 
        Using viewBox 0 0 100 100 with preserveAspectRatio="none" 
        lets us draw lines using percentages (0-100) so they perfectly 
        connect top-to-bottom between sections. 
      */}
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <g fill="none" strokeLinecap="square" strokeLinejoin="miter">
          
          {/* Main Vertical Data Buses - Ensure continuity between sections */}
          
          {/* Left Bus */}
          <path d="M 15 0 L 15 100" stroke={color1} strokeWidth="0.2" opacity="0.3" />
          <path d="M 17 0 L 17 100" stroke={color2} strokeWidth="0.1" opacity="0.2" />
          
          {/* Right Bus */}
          <path d="M 85 0 L 85 100" stroke={color2} strokeWidth="0.2" opacity="0.3" />
          <path d="M 83 0 L 83 100" stroke={color1} strokeWidth="0.1" opacity="0.2" />
          
          {/* Center Bus (subtle) */}
          <path d="M 50 0 L 50 100" stroke={color1} strokeWidth="0.05" opacity="0.1" />

          {/* Animated Energy Flow (Data packets traveling across the buses) */}
          <path 
            d="M 15 0 L 15 100" 
            stroke={color1} 
            strokeWidth="0.6" 
            strokeDasharray="5 150" 
            className="animate-[dash_4s_linear_infinite]" 
          />
          <path 
            d="M 85 100 L 85 0" 
            stroke={color2} 
            strokeWidth="0.6" 
            strokeDasharray="8 200" 
            className="animate-[dash_6s_linear_infinite]" 
          />
          <path 
            d="M 17 0 L 17 100" 
            stroke={color2} 
            strokeWidth="0.4" 
            strokeDasharray="2 100" 
            className="animate-[dash_3s_linear_infinite]" 
          />
          <path 
            d="M 83 100 L 83 0" 
            stroke={color1} 
            strokeWidth="0.4" 
            strokeDasharray="4 120" 
            className="animate-[dash_5s_linear_infinite]" 
          />
        </g>
      </svg>
      
      {/* Horizontal Branches (Absolute divs for perfect rendering) */}
      <div className="absolute top-[20%] left-0 w-[15%] h-[1px] bg-cyan-500/20" />
      <div className="absolute top-[20%] left-[15%] w-[4px] h-[4px] bg-cyan-400 rounded-full -translate-y-[1.5px] -translate-x-[2px] shadow-[0_0_8px_rgba(0,255,255,1)]" />

      <div className="absolute top-[70%] right-0 w-[15%] h-[1px] bg-blue-500/20" />
      <div className="absolute top-[70%] right-[15%] w-[4px] h-[4px] bg-blue-400 rounded-full -translate-y-[1.5px] translate-x-[2px] shadow-[0_0_8px_rgba(0,85,255,1)]" />
      
      <div className="absolute top-[50%] left-[15%] w-[5%] h-[1px] bg-cyan-500/10" />
      <div className="absolute top-[40%] right-[85%] w-[5%] h-[1px] bg-blue-500/10" />
    </div>
  );
};
