import React from 'react';
import { motion } from 'framer-motion';

export const CloudCore: React.FC = () => {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#00aaff]/10 blur-[100px] rounded-full pointer-events-none" />
      
      <svg viewBox="0 0 400 400" className="w-[100%] max-w-[600px] h-auto overflow-visible opacity-30" style={{ filter: 'drop-shadow(0px 0px 10px rgba(0, 170, 255, 0.2))' }}>
        <defs>
          <linearGradient id="cloudSurface" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0a1526" />
            <stop offset="50%" stopColor="#050a14" />
            <stop offset="100%" stopColor="#02050a" />
          </linearGradient>
          <radialGradient id="serverLight" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="30%" stopColor="#00d8ff" />
            <stop offset="100%" stopColor="#0055ff" stopOpacity="0" />
          </radialGradient>
        </defs>

        <g>
          {/* Main Server Rack */}
          <rect x="120" y="80" width="160" height="240" rx="8" fill="url(#cloudSurface)" stroke="#00aaff" strokeWidth="2" />
          
          {/* Server Blades */}
          {[100, 140, 180, 220, 260].map((y, i) => (
            <g key={`blade-${i}`}>
              <rect x="130" y={y} width="140" height="24" rx="2" fill="#000" stroke="#0055ff" strokeWidth="1" />
              {/* Drive slots */}
              <rect x="140" y={y + 6} width="20" height="12" rx="1" fill="#111" stroke="#333" strokeWidth="1" />
              <rect x="165" y={y + 6} width="20" height="12" rx="1" fill="#111" stroke="#333" strokeWidth="1" />
              <rect x="190" y={y + 6} width="20" height="12" rx="1" fill="#111" stroke="#333" strokeWidth="1" />
              
              {/* Status LEDs */}
              <motion.circle 
                cx="240" cy={y + 12} r="3" fill="#00ff00"
                animate={{ opacity: [1, 0.2, 1] }}
                transition={{ duration: Math.random() * 2 + 0.5, repeat: Infinity, delay: Math.random() }}
              />
              <motion.circle 
                cx="250" cy={y + 12} r="3" fill="#00ffff"
                animate={{ opacity: [1, 0.2, 1] }}
                transition={{ duration: Math.random() * 2 + 0.5, repeat: Infinity, delay: Math.random() }}
              />
            </g>
          ))}

          {/* Cloud Networking Connections */}
          <path d="M 80 120 L 120 120" stroke="#00d8ff" strokeWidth="2" />
          <path d="M 80 200 L 120 200" stroke="#00d8ff" strokeWidth="2" />
          <path d="M 80 280 L 120 280" stroke="#00d8ff" strokeWidth="2" />
          <path d="M 320 120 L 280 120" stroke="#00d8ff" strokeWidth="2" />
          <path d="M 320 200 L 280 200" stroke="#00d8ff" strokeWidth="2" />
          <path d="M 320 280 L 280 280" stroke="#00d8ff" strokeWidth="2" />

          {/* Data Packets */}
          <motion.circle cx="80" cy="120" r="4" fill="#ffffff" animate={{ x: [0, 40, 0] }} transition={{ duration: 2, repeat: Infinity }} />
          <motion.circle cx="320" cy="200" r="4" fill="#ffffff" animate={{ x: [0, -40, 0] }} transition={{ duration: 1.5, repeat: Infinity }} />
          <motion.circle cx="80" cy="280" r="4" fill="#ffffff" animate={{ x: [0, 40, 0] }} transition={{ duration: 2.5, repeat: Infinity }} />

          {/* Angled Motherboard Traces to Global Circuit */}
          {/* Top Wires */}
          <path d="M 150 80 L 150 40 L 50 0" fill="none" stroke="#00aaff" strokeWidth="3" opacity="0.6" />
          <path d="M 250 80 L 250 40 L 350 0" fill="none" stroke="#00aaff" strokeWidth="3" opacity="0.6" />
          <circle cx="50" cy="0" r="4" fill="#00d8ff" />
          <circle cx="350" cy="0" r="4" fill="#00d8ff" />
          {/* Side Wires */}
          <path d="M 120 200 L 50 200 L 0 150" fill="none" stroke="#00d8ff" strokeWidth="3" opacity="0.6" />
          <path d="M 280 200 L 350 200 L 400 150" fill="none" stroke="#00d8ff" strokeWidth="3" opacity="0.6" />
          {/* Bottom Wires */}
          <path d="M 160 320 L 160 360 L 50 400" fill="none" stroke="#00aaff" strokeWidth="3" opacity="0.6" />
          <path d="M 240 320 L 240 360 L 350 400" fill="none" stroke="#00aaff" strokeWidth="3" opacity="0.6" />
          <path d="M 200 320 L 200 400" fill="none" stroke="#00aaff" strokeWidth="3" opacity="0.8" strokeDasharray="10 10" className="animate-[dash_3s_linear_infinite]" />
          <circle cx="50" cy="400" r="4" fill="#00d8ff" />
          <circle cx="350" cy="400" r="4" fill="#00d8ff" />
        </g>
      </svg>
    </div>
  );
};
