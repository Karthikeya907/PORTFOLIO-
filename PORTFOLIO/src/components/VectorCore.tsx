import React from 'react';
import { motion } from 'framer-motion';

export const VectorCore: React.FC = () => {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Intense Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#00d8ff]/20 blur-[100px] rounded-full pointer-events-none" />
      
      <svg viewBox="0 0 400 400" className="w-[80%] max-w-[500px] h-auto overflow-visible">
        <defs>
          <filter id="neonGlowBase">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <radialGradient id="centerOrb" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="40%" stopColor="#00d8ff" />
            <stop offset="100%" stopColor="#0055ff" stopOpacity="0" />
          </radialGradient>
        </defs>

        <g filter="url(#neonGlowBase)">
          
          {/* Central Pulsing Orb (Not an eye) */}
          <motion.circle 
            cx="200" cy="200" r="30" 
            fill="url(#centerOrb)"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          />

          {/* Inner Ring (Counter-Clockwise) */}
          <motion.g 
            style={{ transformOrigin: '200px 200px' }}
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          >
            {/* Base solid ring */}
            <circle cx="200" cy="200" r="60" stroke="#0055ff" strokeWidth="2" fill="none" opacity="0.5" />
            
            {/* Thick dashed segments */}
            <circle 
              cx="200" cy="200" r="60" 
              stroke="#00d8ff" 
              strokeWidth="6" 
              fill="none" 
              strokeDasharray="40 20 10 30" 
            />

            {/* Inner nodes */}
            {[0, 60, 120, 180, 240, 300].map(angle => {
              const rad = (angle * Math.PI) / 180;
              const x = 200 + 75 * Math.cos(rad);
              const y = 200 + 75 * Math.sin(rad);
              return (
                <rect key={angle} x={x - 3} y={y - 3} width="6" height="6" fill="#00ffff" />
              );
            })}
          </motion.g>

          {/* Middle Decorative Ring (Static) */}
          <circle 
            cx="200" cy="200" r="95" 
            stroke="#0055ff" 
            strokeWidth="1" 
            fill="none" 
            opacity="0.3" 
          />
          <circle cx="200" cy="105" r="4" fill="#00d8ff" />
          <circle cx="200" cy="295" r="4" fill="#00d8ff" />
          <circle cx="105" cy="200" r="4" fill="#00d8ff" />
          <circle cx="295" cy="200" r="4" fill="#00d8ff" />

          {/* Outer Radar Ring (Clockwise) */}
          <motion.g 
            style={{ transformOrigin: '200px 200px' }}
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            {/* Base line */}
            <circle cx="200" cy="200" r="120" stroke="#00d8ff" strokeWidth="1" fill="none" opacity="0.6" />
            
            {/* Tick marks (radar/HUD style) */}
            <circle 
              cx="200" cy="200" r="120" 
              stroke="#00ffff" 
              strokeWidth="10" 
              fill="none" 
              strokeDasharray="2 15" 
              opacity="0.8"
            />
            
            {/* Large HUD brackets */}
            <path d="M 200 70 A 130 130 0 0 1 290 90" stroke="#00d8ff" strokeWidth="3" fill="none" />
            <path d="M 200 330 A 130 130 0 0 1 110 310" stroke="#00d8ff" strokeWidth="3" fill="none" />
          </motion.g>

          {/* Outermost Thin Tracker Ring (Counter-Clockwise Fast) */}
          <motion.g 
            style={{ transformOrigin: '200px 200px' }}
            animate={{ rotate: -360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            <circle cx="200" cy="200" r="150" stroke="#ff0033" strokeWidth="1" fill="none" strokeDasharray="50 150" opacity="0.8" />
            <circle cx="200" cy="50" r="3" fill="#ff0033" />
          </motion.g>

        </g>
      </svg>
    </div>
  );
};
