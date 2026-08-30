import React from 'react';
import { motion } from 'framer-motion';

export const RobotFaceCore: React.FC = () => {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Intense Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#00d8ff]/5 blur-[100px] rounded-full pointer-events-none" />
      
      <svg viewBox="0 0 400 400" className="w-[100%] max-w-[600px] h-auto overflow-visible opacity-30" style={{ filter: 'drop-shadow(0px 0px 10px rgba(0, 216, 255, 0.2))' }}>
        <defs>
          <linearGradient id="robotSurface" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1a1a24" />
            <stop offset="50%" stopColor="#0d0d14" />
            <stop offset="100%" stopColor="#050508" />
          </linearGradient>

          <radialGradient id="eyeLight" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="30%" stopColor="#00ffff" />
            <stop offset="100%" stopColor="#0055ff" stopOpacity="0" />
          </radialGradient>
        </defs>

        <g>
          {/* Base Head Outline */}
          <path d="M 120 100 L 280 100 L 320 180 L 300 300 L 250 340 L 150 340 L 100 300 L 80 180 Z" fill="url(#robotSurface)" stroke="#0055ff" strokeWidth="3" />
          
          {/* Inner Panel Lines */}
          <path d="M 200 100 L 200 150 M 120 100 L 150 150 M 280 100 L 250 150" stroke="#00aaff" strokeWidth="1" opacity="0.4" />
          <path d="M 100 300 L 150 280 M 300 300 L 250 280" stroke="#00aaff" strokeWidth="1" opacity="0.4" />

          {/* Left Eye */}
          <motion.rect 
            x="130" y="180" width="50" height="20" rx="4" 
            fill="none" stroke="#00d8ff" strokeWidth="2" 
          />
          <motion.circle 
            cx="155" cy="190" r="15" fill="url(#eyeLight)"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
          />

          {/* Right Eye */}
          <motion.rect 
            x="220" y="180" width="50" height="20" rx="4" 
            fill="none" stroke="#00d8ff" strokeWidth="2" 
          />
          <motion.circle 
            cx="245" cy="190" r="15" fill="url(#eyeLight)"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
          />

          {/* Center Brain Core */}
          <circle cx="200" cy="130" r="12" fill="none" stroke="#0055ff" strokeWidth="2" />
          <motion.circle 
            cx="200" cy="130" r="6" fill="#00ffff"
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />

          {/* Mouth/Voicebox */}
          <rect x="160" y="260" width="80" height="30" rx="4" fill="none" stroke="#0055ff" strokeWidth="2" />
          {Array.from({ length: 7 }).map((_, i) => (
            <motion.line 
              key={`voice-${i}`}
              x1={170 + i * 10} y1="275" x2={170 + i * 10} y2="275"
              stroke="#00ffff" strokeWidth="3"
              animate={{ 
                y1: [275, 275 - Math.random() * 10 - 2, 275], 
                y2: [275, 275 + Math.random() * 10 + 2, 275] 
              }}
              transition={{ duration: Math.random() * 0.5 + 0.2, repeat: Infinity, repeatType: "mirror" }}
            />
          ))}

          {/* Side Antennas / Ears */}
          <path d="M 80 180 L 50 180 L 50 220 L 80 220" fill="none" stroke="#00d8ff" strokeWidth="2" />
          <circle cx="45" cy="200" r="8" fill="#0055ff" />
          <path d="M 320 180 L 350 180 L 350 220 L 320 220" fill="none" stroke="#00d8ff" strokeWidth="2" />
          <circle cx="355" cy="200" r="8" fill="#0055ff" />

          {/* Angled Motherboard Traces to Global Circuit */}
          {/* Top Wires */}
          <path d="M 150 100 L 150 50 L 50 0" fill="none" stroke="#00d8ff" strokeWidth="3" opacity="0.6" />
          <path d="M 250 100 L 250 50 L 350 0" fill="none" stroke="#00d8ff" strokeWidth="3" opacity="0.6" />
          <circle cx="50" cy="0" r="4" fill="#00ffff" />
          <circle cx="350" cy="0" r="4" fill="#00ffff" />
          {/* Side Wires */}
          <path d="M 80 180 L 20 180 L 0 160" fill="none" stroke="#0055ff" strokeWidth="3" opacity="0.6" />
          <path d="M 320 180 L 380 180 L 400 160" fill="none" stroke="#0055ff" strokeWidth="3" opacity="0.6" />
          {/* Bottom Wires */}
          <path d="M 150 340 L 150 370 L 50 400" fill="none" stroke="#00aaff" strokeWidth="3" opacity="0.6" />
          <path d="M 250 340 L 250 370 L 350 400" fill="none" stroke="#00aaff" strokeWidth="3" opacity="0.6" />
          <path d="M 200 340 L 200 400" fill="none" stroke="#00ffff" strokeWidth="3" opacity="0.8" strokeDasharray="10 10" className="animate-[dash_5s_linear_infinite]" />
          <circle cx="50" cy="400" r="4" fill="#00ffff" />
          <circle cx="350" cy="400" r="4" fill="#00ffff" />
        </g>
      </svg>
    </div>
  );
};
