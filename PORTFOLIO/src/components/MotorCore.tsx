import React from 'react';
import { motion } from 'framer-motion';

export const MotorCore: React.FC = () => {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#ff7300]/10 blur-[100px] rounded-full pointer-events-none" />
      
      <svg viewBox="0 0 400 400" className="w-[100%] max-w-[600px] h-auto overflow-visible opacity-30" style={{ filter: 'drop-shadow(0px 0px 10px rgba(255, 115, 0, 0.2))' }}>
        <defs>
          <linearGradient id="motorSurface" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#222" />
            <stop offset="50%" stopColor="#111" />
            <stop offset="100%" stopColor="#0a0a0a" />
          </linearGradient>
          <radialGradient id="coilGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ff7300" />
            <stop offset="100%" stopColor="#aa2200" stopOpacity="0" />
          </radialGradient>
        </defs>

        <g>
          {/* Base Motor Housing */}
          <rect x="100" y="100" width="200" height="200" rx="100" fill="url(#motorSurface)" stroke="#ff7300" strokeWidth="2" />
          <circle cx="200" cy="200" r="80" fill="none" stroke="#555" strokeWidth="4" strokeDasharray="10 10" />

          {/* Copper Coils (Static) */}
          {Array.from({ length: 8 }).map((_, i) => (
            <g key={`coil-${i}`} transform={`rotate(${i * 45} 200 200)`}>
              <rect x="190" y="105" width="20" height="40" rx="4" fill="#884400" stroke="#ff7300" strokeWidth="1" />
              <line x1="192" y1="110" x2="208" y2="110" stroke="#ffaa00" strokeWidth="1" />
              <line x1="192" y1="120" x2="208" y2="120" stroke="#ffaa00" strokeWidth="1" />
              <line x1="192" y1="130" x2="208" y2="130" stroke="#ffaa00" strokeWidth="1" />
              <line x1="192" y1="140" x2="208" y2="140" stroke="#ffaa00" strokeWidth="1" />
            </g>
          ))}

          {/* Rotating Inner Rotor */}
          <motion.g
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            style={{ originX: "200px", originY: "200px" }}
          >
            <circle cx="200" cy="200" r="60" fill="#111" stroke="#ff7300" strokeWidth="2" />
            <circle cx="200" cy="200" r="40" fill="url(#coilGlow)" opacity="0.4" />
            {Array.from({ length: 6 }).map((_, i) => (
              <line 
                key={`spoke-${i}`}
                x1="200" y1="140" x2="200" y2="260" 
                stroke="#ffaa00" strokeWidth="2" opacity="0.8"
                transform={`rotate(${i * 30} 200 200)`}
              />
            ))}
            <circle cx="200" cy="200" r="15" fill="#ff7300" />
            <circle cx="200" cy="200" r="8" fill="#fff" />
          </motion.g>

          {/* Mounting Brackets */}
          <rect x="80" y="180" width="20" height="40" rx="2" fill="#222" stroke="#555" strokeWidth="2" />
          <rect x="300" y="180" width="20" height="40" rx="2" fill="#222" stroke="#555" strokeWidth="2" />
          
          <circle cx="90" cy="200" r="4" fill="#00d8ff" opacity="0.5" />
          <circle cx="310" cy="200" r="4" fill="#00d8ff" opacity="0.5" />

          {/* Angled Motherboard Traces to Global Circuit */}
          {/* Top Wires */}
          <path d="M 150 100 L 150 50 L 50 0" fill="none" stroke="#ff7300" strokeWidth="3" opacity="0.6" />
          <path d="M 250 100 L 250 50 L 350 0" fill="none" stroke="#ff7300" strokeWidth="3" opacity="0.6" />
          <circle cx="50" cy="0" r="4" fill="#ffaa00" />
          <circle cx="350" cy="0" r="4" fill="#ffaa00" />
          {/* Side Wires */}
          <path d="M 80 200 L 20 200 L 0 180" fill="none" stroke="#ffaa00" strokeWidth="3" opacity="0.6" />
          <path d="M 320 200 L 380 200 L 400 180" fill="none" stroke="#ffaa00" strokeWidth="3" opacity="0.6" />
          {/* Bottom Wires */}
          <path d="M 150 295 L 150 350 L 50 400" fill="none" stroke="#ff7300" strokeWidth="3" opacity="0.6" />
          <path d="M 250 295 L 250 350 L 350 400" fill="none" stroke="#ff7300" strokeWidth="3" opacity="0.6" />
          <path d="M 200 300 L 200 400" fill="none" stroke="#ffaa00" strokeWidth="3" opacity="0.8" strokeDasharray="10 10" className="animate-[dash_5s_linear_infinite]" />
          <circle cx="50" cy="400" r="4" fill="#ffaa00" />
          <circle cx="350" cy="400" r="4" fill="#ffaa00" />
        </g>
      </svg>
    </div>
  );
};
