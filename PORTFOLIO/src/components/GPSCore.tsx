import React from 'react';
import { motion } from 'framer-motion';

export const GPSCore: React.FC = () => {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#00ff55]/10 blur-[100px] rounded-full pointer-events-none" />
      
      <svg viewBox="0 0 400 400" className="w-[100%] max-w-[600px] h-auto overflow-visible opacity-30" style={{ filter: 'drop-shadow(0px 0px 10px rgba(0, 255, 85, 0.2))' }}>
        <defs>
          <linearGradient id="gpsSurface" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#112211" />
            <stop offset="50%" stopColor="#0a1a0a" />
            <stop offset="100%" stopColor="#050a05" />
          </linearGradient>
          <linearGradient id="panelSurface" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0055ff" />
            <stop offset="100%" stopColor="#001144" />
          </linearGradient>
        </defs>

        <g>
          {/* Solar Panels (Left) */}
          <rect x="20" y="160" width="100" height="80" fill="url(#panelSurface)" stroke="#00d8ff" strokeWidth="2" />
          <line x1="45" y1="160" x2="45" y2="240" stroke="#00d8ff" strokeWidth="1" />
          <line x1="70" y1="160" x2="70" y2="240" stroke="#00d8ff" strokeWidth="1" />
          <line x1="95" y1="160" x2="95" y2="240" stroke="#00d8ff" strokeWidth="1" />
          <line x1="20" y1="200" x2="120" y2="200" stroke="#00d8ff" strokeWidth="1" />
          <line x1="120" y1="200" x2="150" y2="200" stroke="#555" strokeWidth="4" />

          {/* Solar Panels (Right) */}
          <rect x="280" y="160" width="100" height="80" fill="url(#panelSurface)" stroke="#00d8ff" strokeWidth="2" />
          <line x1="305" y1="160" x2="305" y2="240" stroke="#00d8ff" strokeWidth="1" />
          <line x1="330" y1="160" x2="330" y2="240" stroke="#00d8ff" strokeWidth="1" />
          <line x1="355" y1="160" x2="355" y2="240" stroke="#00d8ff" strokeWidth="1" />
          <line x1="280" y1="200" x2="380" y2="200" stroke="#00d8ff" strokeWidth="1" />
          <line x1="250" y1="200" x2="280" y2="200" stroke="#555" strokeWidth="4" />

          {/* Satellite Body */}
          <polygon points="170,120 230,120 250,150 250,250 230,280 170,280 150,250 150,150" fill="url(#gpsSurface)" stroke="#00ff55" strokeWidth="2" />
          <rect x="180" y="150" width="40" height="100" rx="4" fill="none" stroke="#00ff55" strokeWidth="1" opacity="0.5" />
          
          {/* Blinking LEDs */}
          <motion.circle 
            cx="200" cy="140" r="4" fill="#ff0055"
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <motion.circle 
            cx="200" cy="260" r="4" fill="#00ff55"
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />

          {/* GPS Antenna Dish */}
          <path d="M 160 80 Q 200 40 240 80" fill="none" stroke="#00d8ff" strokeWidth="3" />
          <line x1="200" y1="80" x2="200" y2="120" stroke="#00d8ff" strokeWidth="3" />
          <circle cx="200" cy="75" r="5" fill="#00ffff" />

          {/* Emitting Radio Waves */}
          {Array.from({ length: 3 }).map((_, i) => (
            <motion.path 
              key={`wave-${i}`}
              d={`M ${170 - i * 15} ${50 - i * 15} Q 200 ${10 - i * 20} ${230 + i * 15} ${50 - i * 15}`}
              fill="none" stroke="#00ff55" strokeWidth="2"
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 0, y: -20, scale: 1.1 }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.6 }}
            />
          ))}

          {/* Angled Motherboard Traces to Global Circuit */}
          {/* Top Wires */}
          <path d="M 150 150 L 150 50 L 50 0" fill="none" stroke="#00ff55" strokeWidth="3" opacity="0.6" />
          <path d="M 250 150 L 250 50 L 350 0" fill="none" stroke="#00ff55" strokeWidth="3" opacity="0.6" />
          <circle cx="50" cy="0" r="4" fill="#00ff55" />
          <circle cx="350" cy="0" r="4" fill="#00ff55" />
          {/* Side Wires */}
          <path d="M 45 160 L 20 160 L 0 140" fill="none" stroke="#00d8ff" strokeWidth="3" opacity="0.6" />
          <path d="M 355 160 L 380 160 L 400 140" fill="none" stroke="#00d8ff" strokeWidth="3" opacity="0.6" />
          {/* Bottom Wires */}
          <path d="M 160 265 L 160 320 L 50 400" fill="none" stroke="#00ff55" strokeWidth="3" opacity="0.6" />
          <path d="M 240 265 L 240 320 L 350 400" fill="none" stroke="#00ff55" strokeWidth="3" opacity="0.6" />
          <path d="M 200 280 L 200 400" fill="none" stroke="#00ff55" strokeWidth="3" opacity="0.8" strokeDasharray="10 10" className="animate-[dash_3s_linear_infinite]" />
          <circle cx="50" cy="400" r="4" fill="#00ff55" />
          <circle cx="350" cy="400" r="4" fill="#00ff55" />
        </g>
      </svg>
    </div>
  );
};
