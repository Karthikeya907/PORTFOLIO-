import React from 'react';
import { motion } from 'framer-motion';

export const MicrocontrollerCore: React.FC = () => {
  // Generate pins for all four sides
  const generatePins = (side: 'top' | 'right' | 'bottom' | 'left') => {
    const pins = [];
    const pinCount = 12;
    const spacing = 160 / pinCount;
    
    for (let i = 0; i < pinCount; i++) {
      const offset = -80 + spacing / 2 + i * spacing;
      let x = 0, y = 0, w = 0, h = 0;
      
      switch (side) {
        case 'top':
          x = 200 + offset - 2; y = 90; w = 4; h = 20; break;
        case 'bottom':
          x = 200 + offset - 2; y = 290; w = 4; h = 20; break;
        case 'left':
          x = 90; y = 200 + offset - 2; w = 20; h = 4; break;
        case 'right':
          x = 290; y = 200 + offset - 2; w = 20; h = 4; break;
      }
      
      pins.push(<rect key={`${side}-${i}`} x={x} y={y} width={w} height={h} fill="#00d8ff" opacity="0.8" />);
    }
    return pins;
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Intense Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#00d8ff]/10 blur-[80px] rounded-full pointer-events-none" />
      
      <svg viewBox="0 0 400 400" className="w-[80%] max-w-[500px] h-auto overflow-visible" style={{ filter: 'drop-shadow(0px 0px 10px rgba(0, 216, 255, 0.4))' }}>
        <defs>
          <linearGradient id="chipSurface" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#111" />
            <stop offset="50%" stopColor="#222" />
            <stop offset="100%" stopColor="#0a0a0a" />
          </linearGradient>

          <radialGradient id="coreLight" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="20%" stopColor="#00ffff" />
            <stop offset="60%" stopColor="#0055ff" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#0055ff" stopOpacity="0" />
          </radialGradient>
        </defs>

        <g>
          
          {/* Microcontroller Pins */}
          {generatePins('top')}
          {generatePins('right')}
          {generatePins('bottom')}
          {generatePins('left')}

          {/* Main Chip Body */}
          <rect x="110" y="110" width="180" height="180" rx="12" fill="url(#chipSurface)" stroke="#0055ff" strokeWidth="2" />
          
          {/* Unique RGB Inner Borders (Red & Green) */}
          <motion.rect 
            x="126" y="126" width="148" height="148" rx="8" 
            fill="none" 
            stroke="#ff0000" 
            strokeWidth="1" 
            opacity="0.6"
            strokeDasharray="10 5"
            animate={{ strokeDashoffset: [0, 30] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            style={{ filter: 'drop-shadow(0px 0px 4px #ff0000)' }}
          />
          <motion.rect 
            x="134" y="134" width="132" height="132" rx="6" 
            fill="none" 
            stroke="#00ff00" 
            strokeWidth="1" 
            opacity="0.6"
            strokeDasharray="10 5"
            animate={{ strokeDashoffset: [30, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            style={{ filter: 'drop-shadow(0px 0px 4px #00ff00)' }}
          />

          <path d="M 130 200 L 270 200 M 200 130 L 200 270" stroke="#00d8ff" strokeWidth="1" opacity="0.2" />

          {/* Central Pulsing Light (Heartbeat) */}
          <motion.circle 
            cx="200" cy="200" r="45" 
            fill="url(#coreLight)"
            animate={{ 
              scale: [1, 1.15, 1, 1.05, 1],
              opacity: [0.8, 1, 0.8, 0.9, 0.8]
            }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          />

          {/* Center tiny die/core hardware */}
          <rect x="185" y="185" width="30" height="30" rx="4" fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.9" />
          <circle cx="200" cy="200" r="5" fill="#ffffff" />

          {/* Corner mounting holes */}
          <circle cx="125" cy="125" r="4" fill="#00d8ff" opacity="0.5" />
          <circle cx="275" cy="125" r="4" fill="#00d8ff" opacity="0.5" />
          <circle cx="125" cy="275" r="4" fill="#00d8ff" opacity="0.5" />
          <circle cx="275" cy="275" r="4" fill="#00d8ff" opacity="0.5" />

        </g>
      </svg>
    </div>
  );
};
